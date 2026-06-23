import { app, BrowserWindow, ipcMain, Menu } from "electron";
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

function buildAppMenu(mainWindow: BrowserWindow): Menu {
  const sendNavigate = (page: string) => {
    mainWindow.webContents.send("navigate", page);
  };

  const appMenu: any = [
  {
    label: app.name,
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "New Project",
        accelerator: "CmdOrCtrl+N", // Keyboard shortcut
        click: () => {
          console.log("Creating new project...");
        },
      },
      { type: "separator" }, // Adds a visual line separator
      // Using an OS built-in role
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Dashboard",
        accelerator: "Cmd+1",
        click: () => sendNavigate("dashboard"),
      },
      {
        label: "Notes",
        accelerator: "Cmd+2",
        click: () => sendNavigate("notes"),
      },
      {
        label: "Registration",
        accelerator: "Cmd+3",
        click: () => sendNavigate("registration"),
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
  ];

  return Menu.buildFromTemplate(appMenu);
}

app.on("ready", () => {
  ensureDatabaseExists();

  const mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    // titleBarStyle: 'customButtonsOnHover',
    backgroundColor: "#1d1d1e",
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

  Menu.setApplicationMenu(buildAppMenu(mainWindow));

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
