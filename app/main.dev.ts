import electron, { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
import url from 'url';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const getPrimaryDisplayId = () => electron.screen.getPrimaryDisplay().id;

const blockExternalDisplays = () => {
  const displays = electron.screen.getAllDisplays();
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
        pathname: path.join(__dirname, 'extraWindow.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    extraWindow.show();
  }
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '../favicon.ico'),
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  });

  ipcMain.once('react-app-loaded', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    // Let the user move around the window until the rounds have started.
    mainWindow.maximize();
    mainWindow.focus();
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

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  // Remove this if your app does not use auto updates
  new AppUpdater();
});
