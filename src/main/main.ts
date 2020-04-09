/* eslint-disable */
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow | null;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.log); // eslint-disable-line no-console
};

const getPrimaryDisplayId = () => screen.getPrimaryDisplay().id;

const blockExternalDisplays = () => {
  const displays = screen.getAllDisplays();
  for (const i in displays) {
    if (displays[i].id === getPrimaryDisplayId()) {
      continue;
    }

    const externalDisplay = displays[i];
    const extraWindow = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
      resizable: false,
      movable: false,
      alwaysOnTop: true,
      fullscreen: true,
      webPreferences: {
        nodeIntegration: false
      }
    });

    extraWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'extraWindow.html'), // TODO: Fix path
        protocol: 'file:',
        slashes: true
      })
    );
    extraWindow.show();
  }
};

const createWindow = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    title: 'Mob timer',
    icon: path.join(__dirname, 'favicon.ico'), // TODO: Fix path
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true },
    show: false
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Mob timer');
  });

  ipcMain.on('timer-ended', () => {
    mainWindow.maximize();
    mainWindow.setFullScreen(true);
    mainWindow.setAlwaysOnTop(true);
    mainWindow.focus();

    blockExternalDisplays();
  });

  ipcMain.on('timer-started', () => {
    setTimeout(function() {
      // Must be set before minimizing otherwise the window will show up again.
      mainWindow.setAlwaysOnTop(false);
      mainWindow.setFullScreen(false);

      if (mainWindow.isVisible()) {
        mainWindow.minimize();
      }

      const windows = BrowserWindow.getAllWindows();
      for (const window of windows) {
        if (window === mainWindow) {
          continue;
        }

        window.close();
      }
    }, 3000);
  });

  if (process.env.NODE_ENV !== 'production') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'; // eslint-disable-line require-atomic-updates
    mainWindow.loadURL(`http://localhost:2003`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow!.webContents.openDevTools();
    });
  }

  mainWindow.webContents.once('dom-ready', () => {
    // Wait to show the application until the view has finished loading.
    mainWindow.maximize();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
