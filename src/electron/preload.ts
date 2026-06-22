import { contextBridge, ipcRenderer } from "electron";
import type { Database } from "./database.js";

contextBridge.exposeInMainWorld("api", {
  saveDatabase: (database: Database) =>
    ipcRenderer.send("save-database", database),
  loadDatabase: (): Promise<Database> => ipcRenderer.invoke("load-database"),
});

// Kept for parity with the original app (generic invoke bridge).
contextBridge.exposeInMainWorld("electron", {
  invoke: (channel: string, data?: unknown) =>
    ipcRenderer.invoke(channel, data),
});
