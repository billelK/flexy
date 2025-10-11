import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { getAllTransactions,addTransaction, mockRecharge } from "../src/lib/transactions.js";
import { detectOperators } from "../src/lib/portServices.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
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
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }

  
};



ipcMain.handle("get-transactions", () => {
  return getAllTransactions()
});

ipcMain.handle("add-transaction", (event, transaction) => {
  return addTransaction(transaction)
});

ipcMain.handle("mock-recharge", async (event, transaction) => {
  return await mockRecharge(transaction)
});

ipcMain.handle("detect-operators", async () => {
  return await detectOperators();
});
 



app.on("ready",createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});