import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname / __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ✅ preload
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on("preload-error", (event, preloadPath, error) => {
  console.error("❌ Preload failed:", preloadPath, error);
});

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// Example IPC handler
ipcMain.handle("ping", async () => {
  return "pong from Electron (ESM)";
});

console.log("🔎 preload path:", path.join(__dirname, "preload.js"));
