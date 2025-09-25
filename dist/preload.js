"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
console.log("✅ preload.ts is running");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    ping: function () { return Promise.resolve("pong ✅ from preload"); },
});
