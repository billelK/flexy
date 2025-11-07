import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { getAllTransactions,addTransaction, mockRecharge } from "../src/lib/transactions.js";
import { getAllOffers, addOffer, updateOffer, deleteOffer} from "../src/lib/offers.js";

import { detectOperators, performRecharge } from "../src/lib/portServices.js";
import { saveDetectedOperators, readDetectedOperators } from '../src/lib/operatorMappings.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
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


app.on("ready",createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});