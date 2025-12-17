import { app, BrowserWindow, ipcMain, protocol } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { getAllTransactions,addTransaction, mockRecharge } from "../src/lib/transactions.js";
import { getAllOffers, addOffer, updateOffer, deleteOffer} from "../src/lib/offers.js";

import { detectOperators, performRecharge } from "../src/lib/portServices.js";
import { saveDetectedOperators, readDetectedOperators } from '../src/lib/operatorMappings.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
const midRangeLaptops = { width: 1536, height: 864 };
const midSizeMonitors = { width: 1440, height: 900 }; // 100%
const smallLaptopScreen = { width: 1366, height: 768 }; // 100%
const compactLaptop = { width: 1280, height: 800 }; // 90%
const HDmonitors = { width: 1280, height: 720 };// 90%
const tabletOldMonitors = { width: 1024, height: 768 }; // 50 - 50

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: compactLaptop.width,
    height: compactLaptop.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // In production we load files via the `app://` protocol so absolute paths
    // like "/_next/..." resolve to files inside the `out` directory.
    mainWindow.loadURL("app://index.html");
  }
};



ipcMain.handle("get-transactions", () => {
  return getAllTransactions()
});

ipcMain.handle("get-offers", () => {
  return getAllOffers();
});


ipcMain.handle("add-transaction", (event, transaction) => {
  return addTransaction(transaction)
});

ipcMain.handle("add-offer", (event, offer) => {
  return addOffer(offer)
});


ipcMain.handle("update-offer", (event, offer) => {
  return updateOffer(offer)
});


ipcMain.handle("mock-recharge", async (event, transaction) => {
  // return await mockRecharge(transaction)
  return await performRecharge(transaction)
});

ipcMain.handle("detect-operators", async () => {
  return await detectOperators();
});
 
ipcMain.handle("save-operators", async (_, operators) => {
  return saveDetectedOperators(operators)
})

ipcMain.handle("read-operators", async () => {
  return readDetectedOperators()
})

ipcMain.handle("delete-offer", async (event, id) => {
  return deleteOffer(id);
});


// Register a secure, standard `app://` scheme so we can map requests to the
// exported `out` folder and keep absolute asset paths like `/_next/...` working
// when the app is opened from file:// in production.
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { standard: true, secure: true } },
]);

import fs from "fs";

app.whenReady().then(() => {
  // Map `app://<path>` to `out/<path>` files. Resolve extensionless routes to
  // their generated `.html` files (e.g., `/history` -> `out/history.html`) and
  // fall back to `index.html` or `.txt` payloads when necessary.
  protocol.registerFileProtocol("app", (request, callback) => {
    try {
      const requestUrl = new URL(request.url);
      let pathname = decodeURIComponent(requestUrl.pathname);

      // Normalize root
      if (pathname === "/" || pathname === "") pathname = "/index.html";

      const basePath = path.join(__dirname, "..", "out");

      // Inspect Accept header to determine if the client wants a Flight payload
      const headers = request.headers || {};
      const accept = (headers.accept || headers.Accept || "").toString();
      const wantsFlight = accept.includes("text/x-component") || accept.includes("application/json");

      // Build candidate list based on expected response type
      const candidates = wantsFlight
        ? [
            path.join(basePath, pathname + ".txt"),
            path.join(basePath, pathname + ".html"),
            path.join(basePath, pathname, "index.html"),
            path.join(basePath, pathname),
          ]
        : [
            path.join(basePath, pathname), // exact path
            path.join(basePath, pathname + ".html"),
            path.join(basePath, pathname, "index.html"),
            path.join(basePath, pathname + ".txt"),
          ];

      for (const p of candidates) {
        if (fs.existsSync(p)) {
          callback({ path: p });
          return;
        }
      }

      callback({ error: -6 }); // FILE_NOT_FOUND
    } catch (err) {
      callback({ error: -6 }); // FILE_NOT_FOUND
    }
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});