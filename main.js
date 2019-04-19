const path = require("path");
const electron = require("electron");
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron")
});
const url = require("url");

const { app, BrowserWindow, ipcMain } = electron;

let extraWindows = [];

let mainWindow;

ipcMain.on("time-has-elapsed", (event, arg) => {
  mainWindow.show();
  mainWindow.maximize();

  blockExternalDisplays();
});

ipcMain.on("timer-started", (event, arg) => {
  setTimeout(function() {
    if (mainWindow.isVisible()) {
      mainWindow.minimize();
    }

    for (let i in extraWindows) {
      try {
        if (extraWindows[i] && extraWindows[i].isVisible()) {
          extraWindows[i].close();
        }
      } catch (e) {
        // ignore.
      }
    }
    extraWindows = [];
  }, 3000);
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "/favicon.ico")
  });

  mainWindow.on("close", function() {
    app.quit();
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.maximize();
});

function blockExternalDisplays() {
  extraWindows = [];
  const displays = electron.screen.getAllDisplays();
  const primaryDisplayId = electron.screen.getPrimaryDisplay().id;
  for (const i in displays) {
    if (displays[i].id === primaryDisplayId) {
      continue;
    }

    const externalDisplay = displays[i];
    const extraWindow = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50
    });

    extraWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "extraWindow.html"),
        protocol: "file:",
        slashes: true
      })
    );
    extraWindow.maximize();
    extraWindows.push(extraWindow);
  }
}
