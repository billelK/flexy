import { app, BrowserWindow, ipcMain, protocol, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { getAllTransactions,addTransaction, mockRecharge } from "../src/lib/transactions.js";
import { getAllOffers, addOffer, updateOffer, deleteOffer} from "../src/lib/offers.js";

import { detectOperators, performRecharge, sendUSSDForOffer } from "../src/lib/portServices.js";
import { saveDetectedOperators, readDetectedOperators } from '../src/lib/operatorMappings.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

// Application title and emoji (change emoji here if you want a different one)
const APP_TITLE = process.env.APP_TITLE || "Flexy Pay";
// Set the app name (used on some platforms)
try { app.setName && app.setName("Flexy Pay"); } catch (e) { /* ignore */ }
// On Windows set the AppUserModelID so the taskbar groups and notifications use our app identity
if (process.platform === "win32") {
  try { app.setAppUserModelId && app.setAppUserModelId("com.flexypay.app"); } catch (e) { /* ignore */ }
}

const compactLaptop = { width: 1280, height: 800 }; // 90%

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: compactLaptop.width,
    height: compactLaptop.height,
    title: APP_TITLE,
    icon: path.join(__dirname, 'public/FlexyPay2.ico'),
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
    // Use a host component ("-") in the URL so fetch/XHR treats the origin
    // as a proper HTTP-like origin (e.g. "app://-/index.html").
    mainWindow.loadURL("app://-/index.html");
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

// send USSD using offer template and specified phone (from renderer)
ipcMain.handle("send-ussd-offer", async (event, offer, phone) => {
  return await sendUSSDForOffer(offer, phone);
});


// Register a secure, standard `app://` scheme so we can map requests to the
// exported `out` folder and keep absolute asset paths like `/_next/...` working
// when the app is opened from file:// in production.
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true, // allow Fetch/Fetch-based APIs to use app://
      corsEnabled: true, // enable CORS handling on the scheme
      allowServiceWorkers: true,
    },
  },
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

      // If requests are made relative to the base `app://index.html` (e.g., `offers/index.txt`)
      // the URL becomes `app://index.html/offers/index.txt` — strip the `/index.html` prefix so
      // we can resolve to `/offers/index.txt`.
      if (pathname.startsWith("/index.html")) {
        pathname = pathname.replace(/^\/index\.html/, "") || "/";
      }

      // Normalize root
      if (pathname === "/" || pathname === "") pathname = "/index.html";

      // Try common locations for the exported `out` folder:
      //  - dev (project root): path.join(__dirname, '..', 'out')
      //  - packaged apps: path.join(process.resourcesPath, 'app', 'out') or path.join(process.resourcesPath, 'out')
      const candidateBasePaths = [
        path.join(__dirname, "..", "out"),
        path.join(process.resourcesPath || __dirname, "app", "out"),
        path.join(process.resourcesPath || __dirname, "out"),
      ];

      // Inspect Accept header to determine if the client wants a Flight payload
      const headers = request.headers || {};
      const accept = (headers.accept || headers.Accept || "").toString();
      const wantsFlight = accept.includes("text/x-component") || accept.includes("application/json");

      for (const basePath of candidateBasePaths) {
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
      }

      callback({ error: -6 }); // FILE_NOT_FOUND
    } catch (err) {
      callback({ error: -6 }); // FILE_NOT_FOUND
    }
  });

  // Remove default app menu (removes File/Edit/View, etc.) and set a minimal menu
  try {
    Menu.setApplicationMenu(null);
  } catch (e) {
    console.warn("Failed to set application menu to null:", e);
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});