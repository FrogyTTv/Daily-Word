const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.on('save-database', (event, newDatabase) => {
  // ✅ CHANGE: use userData instead of __dirname
  const dbDir = path.join(app.getPath('userData'));
  const dbPath = path.join(dbDir, 'database.json');

  // ✅ CHANGE: ensure directory exists
  fs.mkdirSync(dbDir, { recursive: true });

  fs.writeFileSync(dbPath, JSON.stringify(newDatabase, null, 2));
  console.log('Database saved to', dbPath);
});

ipcMain.handle('load-database', async () => {
  const dbPath = path.join(app.getPath('userData'), 'database.json');

  if (!fs.existsSync(dbPath)) {
    return {}; // or default database structure
  }

  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
});

function ensureDatabaseExists() {
  const userDbPath = path.join(app.getPath('userData'), 'database.json');

  // Already initialized
  if (fs.existsSync(userDbPath)) {
    return;
  }

  // ✅ Works in dev AND packaged
  const bundledDbPath = path.join(__dirname, 'database.json');

  fs.mkdirSync(path.dirname(userDbPath), { recursive: true });

  const initialData = fs.readFileSync(bundledDbPath, 'utf-8');
  fs.writeFileSync(userDbPath, initialData);

  console.log('Initialized database from bundled copy');
}



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 560,
    minHeight: 400,
    minWidth: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(() => {
  ensureDatabaseExists();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
