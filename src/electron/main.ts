import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { createSeedDatabase, type Database } from "./database.js";

function getDatabasePath(): string {
  return path.join(app.getPath("userData"), "database.json");
}

// Seed the user's database on first launch so there's always something to read.
function ensureDatabaseExists(): void {
  const dbPath = getDatabasePath();
  if (fs.existsSync(dbPath)) {
    return;
  }
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(createSeedDatabase(), null, 2));
}

ipcMain.handle("load-database", async (): Promise<Database> => {
  const dbPath = getDatabasePath();
  if (!fs.existsSync(dbPath)) {
    return createSeedDatabase();
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf-8")) as Database;
});

ipcMain.on("save-database", (_event, newDatabase: Database) => {
  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(newDatabase, null, 2));
});

app.on("ready", () => {
  ensureDatabaseExists();

  const mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    // titleBarStyle: 'customButtonsOnHover',
    width: 1280,
    height: 820,
    minWidth: 700,
    // minWidth: 800,
    minHeight: 500,
    trafficLightPosition: {
      x: 20, // Adds left padding (in pixels)
      y: 20, // Adds top padding (in pixels)
    },
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
      contextIsolation: true,
      // ESM preload scripts require the renderer to be unsandboxed.
      sandbox: false,
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
