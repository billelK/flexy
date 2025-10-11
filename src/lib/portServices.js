// src/main/services/portService.js
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

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
