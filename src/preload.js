// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveDatabase: (newDatabase) => ipcRenderer.send('save-database', newDatabase)
});
