// src/main/services/portService.js
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import fs from "fs";
import path from "path";


export async function detectOperators() {
  const ports = await SerialPort.list();
  const results = [];
  
  for (const info of ports) {
    let operator = "Unknown";
    try {
      const port = new SerialPort({ path: info.path, baudRate: 115200, autoOpen: true });
      const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

      parser.on("data", line => {
        if (line.includes("+COPS")) {
          const match = line.match(/"([^"]+)"/);
          if (match) operator = match[1];
        }
      });

      port.write("AT+COPS?\r");

      await new Promise(r => setTimeout(r, 1500));
      port.close();

      results.push({
        path: info.path,
        manufacturer: info.manufacturer || "Unknown",
        operator,
      });
    } catch (e) {
      results.push({ path: info.path, operator: "Error" });
    }
  }
  return results;
}

function loadOperatorsPorts() {
  const filePath = path.join(process.cwd(), "src", "operatorDetectedPorts.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadOperatorsConfig() {
  const filePath = path.join(process.cwd(), "src", "operatorConfig.json");
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}


export async function performRecharge(transaction) {
  const portsData = loadOperatorsPorts();
  const config = loadOperatorsConfig();

  const operatorName = transaction.operator;
  // For testing: pick the first port if you want to force COM1 even when operator unknown
  // const operatorEntry = portsData.find(p => p.operator === operatorName);
  const operatorEntry = portsData.find(p => p.operator === operatorName) || portsData[0]; // fallback to first port

  const operatorConfig = config[operatorName];

  console.log("operatorEntry:", operatorEntry);

  if (!operatorEntry) {
    return {
      ...transaction,
      status: "Failed",
      created_at: new Date().toISOString(),
      message: `No ports available to test.`,
    };
  }

  const portPath = operatorEntry.path;
  const template = operatorConfig?.modes?.[transaction.mode];

  // if there's no template for this operator/mode that's fine in test mode:
  if (!template) {
    console.warn("No USSD template for operator/mode.");
  }

  const ussd = (template || "*000*{number}*{amount}#")
    .replace("{number}", transaction.phone)
    .replace("{amount}", transaction.amount);

  console.log("Testing port:", portPath, "USSD:", ussd);

  let port;
  try {
    port = new SerialPort({ path: portPath, baudRate: 115200, autoOpen: false });

    // open port
    await new Promise((resolve, reject) => port.open(err => (err ? reject(err) : resolve())));

    // create parser AFTER port open
    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    // promise that resolves on OK / ERROR / +CUSD or timeout
    const response = await new Promise((resolve) => {
      let done = false;
      let raw = "";

      // data handler
      function onData(line) {
        raw += line + "\n";
        console.log("📡 Serial line:", line);

        if (line.includes("OK")) {
          done = true;
          cleanup();
          return resolve({ code: "OK", raw });
        }
        if (line.includes("ERROR")) {
          done = true;
          cleanup();
          return resolve({ code: "ERROR", raw });
        }
        if (line.startsWith("+CUSD") || line.startsWith("+CMT") || line.startsWith("+CM")) {
          // treat USSD / SMS responses as OK (but return raw)
          done = true;
          cleanup();
          return resolve({ code: "OK", raw });
        }
      }

      // error handler
      function onError(err) {
        if (!done) {
          done = true;
          cleanup();
          return resolve({ code: "PORT_ERROR", raw: raw + "\n" + String(err) });
        }
      }

      // cleanup
      function cleanup() {
        try { parser.off("data", onData); } catch (e) {}
        try { port.off("error", onError); } catch (e) {}
      }

      // attach handlers
      parser.on("data", onData);
      port.on("error", onError);

      // write the command (no CR/LF duplication)
      const atCommand = `AT+CUSD=1,"${ussd}",15`;
      port.write(atCommand + "\r", (err) => {
        if (err) {
          cleanup();
          return resolve({ code: "WRITE_ERROR", raw: String(err) });
        }
        // if nothing arrives, we rely on timeout to resolve
      });

      // timeout fallback (increase if needed)
      const timeoutMs = 10000;
      setTimeout(() => {
        if (!done) {
          done = true;
          cleanup();
          resolve({ code: "TIMEOUT", raw });
        }
      }, timeoutMs);
    });

    // close port (best-effort)
    try { if (port && port.isOpen) port.close(); } catch (e) {}

    // interpret response
    if (response.code === "OK") {
      return {
        ...transaction,
        status: "Completed",
        created_at: new Date().toISOString(),
        message: "OK — reply received",
      };
    } else if (response.code === "ERROR") {
      return {
        ...transaction,
        status: "Failed",
        created_at: new Date().toISOString(),
        message: "Modem returned ERROR",
      };
    } else if (response.code === "TIMEOUT") {
      return {
        ...transaction,
        status: "Failed",
        created_at: new Date().toISOString(),
        message: "No response (timeout)",
      };
    } else if (response.code === "PORT_ERROR" || response.code === "WRITE_ERROR") {
      return {
        ...transaction,
        status: "Failed",
        created_at: new Date().toISOString(),
        message: `Port error: ${response.raw}`,
      };
    } else {
      return {
        ...transaction,
        status: "Failed",
        created_at: new Date().toISOString(),
        message: `Unknown response: ${response.code}`,
      };
    }
  } catch (err) {
    console.error("Recharge failed (outer):", err);
    try { if (port && port.isOpen) port.close(); } catch (e) {}
    return {
      ...transaction,
      status: "Failed",
      created_at: new Date().toISOString(),
      message: `Exception: ${err.message || String(err)}`,
    };
  }
}
