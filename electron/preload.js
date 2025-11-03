/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getTransactions: () => ipcRenderer.invoke("get-transactions"),
  getOffers: () => ipcRenderer.invoke("get-offers"),

  addTransaction: (transaction) => ipcRenderer.invoke("add-transaction", transaction),
  addOffer: (offer) => ipcRenderer.invoke("add-offer", offer),
  
  mockRecharge: (transaction) => ipcRenderer.invoke("mock-recharge", transaction),
  detectOperators: () => ipcRenderer.invoke('detect-operators'),
  saveOperators: (operators) => ipcRenderer.invoke('save-operators', operators),
  readOperators: () => ipcRenderer.invoke('read-operators'),
});
