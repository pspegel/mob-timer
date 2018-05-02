const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

ipcMain.on('time-has-elapsed', (event, arg) => {
  mainWindow.show();
  mainWindow.maximize();
});

ipcMain.on('timer-started', (event, arg) => {
  setTimeout(function() {
    if (mainWindow.isVisible()) {
      mainWindow.minimize();
    }
  }, 3000);
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.maximize();
});

