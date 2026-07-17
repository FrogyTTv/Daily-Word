import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  clipboard,
  dialog,
  net,
} from "electron";
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

type DailyBibleVerse = {
  text: string;
  reference: string;
};

let bibleVerse: DailyBibleVerse;

ipcMain.handle("loadBibleVerse", async (): Promise<DailyBibleVerse> => {
  const DAILYVERSEAPI =
    "https://beta.ourmanna.com/api/v1/get/?format=json&order=daily";
  try {
    const response = await fetch(DAILYVERSEAPI);
    const data = await response.json();

    const { text, reference } = data?.verse?.details ?? {};

    bibleVerse = {
      text: text ?? "",
      reference: reference ?? "",
    };

    return {
      text: text ?? "",
      reference: reference ?? "",
    };
  } catch (e) {
    console.error(e);
    return { text: "", reference: "" };
  }
});

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

const loadDatabaseFunc = (): Database => {
  const dbPath = getDatabasePath();
  if (!fs.existsSync(dbPath)) {
    return createSeedDatabase();
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf-8")) as Database;
};
const saveToDatabase = (newDatabase: Database) => {
  // Make sure you pass the entire database with the changes, since this just overwrites everything at that location.
  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(newDatabase, null, 2));
};

const exportDatabase = async (mainWindow: BrowserWindow): Promise<void> => {
  console.log("Exporting Database...");

  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openDirectory"], // Restricts selection to files only
    })
    .then((result) => {
      if (result.canceled) {
        console.log("Canceled:\x1b[1;31m Export\x1b[0m");
        // dialog.showMessageBox(mainWindow, {
        //   type: "info",
        //   // title: "Database Updated",
        //   message: "Export Canceled",
        //   buttons: ["OK"],
        // });
      } else {
        console.log(`   ${result.filePaths[0]}`);
        try {
          fs.writeFileSync(
            `${result.filePaths[0]}/database.json`,
            `${fs.readFileSync(getDatabasePath(), "utf-8")}`,
            "utf8",
          );
          console.log("\x1b[1;32mDone Exporting!\x1b[0m");
          dialog.showMessageBox(mainWindow, {
            type: "info",
            // title: "Database Updated",
            message: "Successfully Exported!",
            buttons: ["OK"],
          });
        } catch (err) {
          console.error(err);
        }
      }
    });
};
const importDatabase = async (mainWindow: BrowserWindow): Promise<void> => {
  console.log("Importing Database...");
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Database", extensions: ["json"] }],
    })
    .then((result) => {
      if (result.canceled) {
        console.log("Canceled:\x1b[1;31m Import\x1b[0m");
      } else {
        console.log(`   ${result.filePaths[0]}`);
        try {
          console.log("Updating Database...");
          fs.writeFileSync(
            getDatabasePath(),
            fs.readFileSync(result.filePaths[0], "utf-8"),
            "utf8",
          );
          console.log("\x1b[1;32mDone Importing!\x1b[0m");

          dialog.showMessageBox(mainWindow, {
            type: "info",
            // title: "Database Updated",
            message: "Database Imported",
            buttons: ["OK"],
          });
        } catch (err) {
          console.error(err);
        }
      }
    });
};
const resetDatabasePrompt = async (
  mainWindow: BrowserWindow,
): Promise<void> => {
  console.log("Confirming Reset Datase...");
  dialog
    .showMessageBox(mainWindow, {
      type: "warning",
      title: "Reset Database",
      message: "Are you sure you want to reset your progress??",
      detail: "This action cannot be undone.",
      buttons: ["Delete", "Cancel"],
      defaultId: 1,
      cancelId: 1,
      noLink: false,
    })
    .then((res) => {
      if (res.response === 0) {
        resetDatabaseFunction();
        // Refresh dashboard page
        mainWindow.webContents.send("navigate", "registration");
        mainWindow.webContents.send("navigate", "dashboard");
      } else {
        return console.log("Canceled Action");
      }
    });
};

const resetDatabaseFunction = () => {
  const database = loadDatabaseFunc();
  for (const book in database.readingProgress) {
    for (const chapter in database.readingProgress[book]) {
      database.readingProgress[book][chapter] = false;
    }
  }
  console.log(": Reset Database-copy");
  saveToDatabase(database);
  console.log(": Saved copy to database");
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
          label: "Dev Inspect",
          accelerator: "Cmd+E",
          click: () => {
            mainWindow.webContents.openDevTools();
          },
        },
        { type: "separator" }, // Adds a visual line separator
        {
          label: "Export Reading Progress",
          accelerator: "Cmd+O",
          click: () => {
            // console.log("Export Reading Progress...");
            // shell.openPath(getDatabasePath());
            exportDatabase(mainWindow);
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
            // console.log("Reset All Progress...");
            resetDatabasePrompt(mainWindow);
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
          click: () => clipboard.writeText(bibleVerse.text),
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
    show: false,
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

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
