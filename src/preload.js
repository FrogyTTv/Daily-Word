const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveDatabase: (database) => {
    ipcRenderer.send('save-database', database);
  },

  loadDatabase: () => {
    return ipcRenderer.invoke('load-database');
  },
});

// (optional) keep your existing electron.invoke if you still use it
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});
