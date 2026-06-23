import { contextBridge, ipcRenderer } from "electron";
import type { Database } from "./database.js";

contextBridge.exposeInMainWorld("api", {
  saveDatabase: (database: Database) =>
    ipcRenderer.send("save-database", database),
  loadDatabase: (): Promise<Database> => ipcRenderer.invoke("load-database"),
  onNavigate: (callback: (page: string) => void) => {
    const listener = (_event: unknown, page: string) => callback(page);
    ipcRenderer.on("navigate", listener);
    // Return an unsubscribe fn so the renderer can clean up the listener.
    return () => ipcRenderer.removeListener("navigate", listener);
  },
});

// Kept for parity with the original app (generic invoke bridge).
contextBridge.exposeInMainWorld("electron", {
  invoke: (channel: string, data?: unknown) =>
    ipcRenderer.invoke(channel, data),
});
