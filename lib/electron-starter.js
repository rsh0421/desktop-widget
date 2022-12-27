const {app, BrowserWindow, ipcMain, screen} = require('electron');
const {SetWindowPos, HWND_BOTTOM, SWP_NOACTIVATE, SWP_NOSIZE, SWP_NOMOVE} = require('win-setwindowpos');
const path = require('path');
const isDevelopment = (process.env.mode === 'dev');
const api = require('./api');

const popupWinList = {};

api.load().then(()=>{
  const list = api.list();

  for(const name of list){
    ipcMain.handle(name, async(event, ...args)=>{
      try{
        const result = await api.run(name, ...args);
        return result;
      }catch(e){
        console.log(e);
      }
    })
  }
});

ipcMain.handle('open-popup-window', async(event, name, ...args)=>{
  createPopupWindow(name, ...args);
});

const createWindow = ()=>{
  app.allowRendererProcessReuse = true;

  let win = new BrowserWindow({
    focusable: false,
    type: 'desktop',
    frame: false,
    backgroundColor:'#00000000',
    transparent: true,
    hasShadow: false,
    maximizable: false,
    minimizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if(isDevelopment){
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  }else{
    win.removeMenu();
    win.loadFile(path.join(__dirname, '../build.index.html'));
  }

  win.maximize();
  win.blur();

  win.on('closed', ()=>{
    win = null;
  });

  screen.on('display-metrics-changed', ()=>{win.maximize();});

  SetWindowPos(win.getNativeWindowHandle(), HWND_BOTTOM, 0, 0, 0, 0, SWP_NOACTIVATE|SWP_NOSIZE|SWP_NOMOVE);
}

const createPopupWindow = (name, ...arg)=>{
  if(popupWinList[name]) return;

  let win = new BrowserWindow({
    type:'desktop',
    //frame:false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.popup.js'),
      additionalArguments: [name, ...arg]
    }
  
  });

  popupWinList[name] = win;

  if(isDevelopment){
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  }else{
    win.removeMenu();
    win.loadFile(path.join(__dirname, '../build.index.html'));
  }

  win.on('closed', ()=>{
    delete popupWinList[name];
  });
}

app.whenReady().then(()=>{
  createWindow();
})

app.on('window-all-closed', ()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', ()=>{
  if(win === null){
    createWindow();
  }
});