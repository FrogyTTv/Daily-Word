import { app, BrowserWindow, ipcMain, Menu, clipboard, dialog } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { createSeedDatabase, type Database } from "./database.js";
import { error } from "console";

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

const downloadDatabase = async (mainWindow: BrowserWindow): Promise<void> => {
  console.log("Exporting Reading Progress...");

  const downloadLocation = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"], // Restricts selection to files only
  });
  if (downloadLocation.canceled) {
    return console.error("Download Canceled");
  } else {
    console.log(`User Selected: ${downloadLocation.filePaths[0]}`);
    try {
      fs.writeFileSync(
        `${downloadLocation.filePaths[0]}/database.json`,
        `${fs.readFileSync(getDatabasePath(), "utf-8")}`,
        "utf8",
      );
      console.log("Successfully Downloaded!");
    } catch (err) {
      console.error(err);
    }
  }
};
const importDatabase = async (mainWindow: BrowserWindow): Promise<void> => {
  console.log("Importing Database...");
  // const databaseLocation = await dialog.showOpenDialog(mainWindow, {
  //   properties: ["openDirectory"],
  // });
};

function buildAppMenu(mainWindow: BrowserWindow): Menu {
  const sendNavigate = (page: string) => {
    mainWindow.webContents.send("navigate", page);
  };

  const appMenu: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Preferences",
          accelerator: "Cmd+,",
          click: () => sendNavigate("settings"),
        },
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
          label: "Export Reading Progress",
          accelerator: "Cmd+E",
          click: () => {
            // console.log("Export Reading Progress...");
            // shell.openPath(getDatabasePath());
            downloadDatabase(mainWindow);
          },
        },
        {
          label: "Import Reading Progress",
          accelerator: "Cmd+I",
          click: () => {
            // console.log("Import Reading Progress...");
            importDatabase(mainWindow);
          },
        },
        { type: "separator" }, // Adds a visual line separator
        {
          label: "Reset All Progress",
          click: () => {
            console.log("Reset All Progress...");
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { type: "separator" },
        {
          label: "Search",
          accelerator: "Cmd+F",
          click: () => mainWindow.webContents.send("focus-search"),
        },
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
          label: "Notes & Highlights",
          accelerator: "Cmd+2",
          click: () => sendNavigate("notes"),
        },
        {
          label: "Register Chapters",
          accelerator: "Cmd+3",
          click: () => sendNavigate("registration"),
        },
        { type: "separator" },
        {
          label: "Progress Analytics",
          accelerator: "Cmd+4",
          click: () => sendNavigate("analytics"),
        },
        {
          label: "Support",
          accelerator: "Cmd+5",
          click: () => sendNavigate("support"),
        },
        {
          label: "Settings",
          accelerator: "Cmd+6",
          click: () => sendNavigate("settings"),
        },
      ],
    },
    {
      label: "Reading",
      submenu: [
        {
          label: "Today's Verse",
          accelerator: "Cmd+T",
          click: () => sendNavigate("dashboard"),
        },
        {
          label: "Copy Today's Verse",
          accelerator: "Cmd+Shift+T",
          click: () => clipboard.writeText("Here is the verse"),
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Daily Word Help",
          click: () => sendNavigate("support"),
        },
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
