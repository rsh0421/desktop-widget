const {app, BrowserWindow, ipcMain} = require('electron');
//const {SetBottomMost} = require('electron-bottom-most');
const {SetWindowPos, HWND_BOTTOM, SWP_NOACTIVATE, SWP_NOSIZE, SWP_NOMOVE} = require('win-setwindowpos');
const path = require('path');
const fs = require('fs');
const isDevelopment = (process.env.mode === 'dev');

const api = require('./api');

const createWindow = ()=>{
  app.allowRendererProcessReuse = false;

  api.load();

  const list = api.list();

  for(const name of list){
    ipcMain.handle(name, async(event, ...args)=>{
      try{
        const result = await api.run(name, ...args);
        console.log(result);
        return result;
      }catch(e){
        console.log(e);
      }
    })
  }

  let win = new BrowserWindow({
    //alwaysOnTop: true,
    focusable: false,
    //opacity: 0.2,
    //width:800,
    //height:600,
    type:'desktop',
    frame:false,
    backgroundColor:'#00000000',
    transparent:true,
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
/*
  const ipcList = fs.readdirSync(path.join(__dirname, 'api'));

  const api = {};

  for(const filename of ipcList){
    const name = path.basename(filename, path.extname(filename));
    try{
      api[name] = require(path.join(__dirname, 'api', filename));
      ipcMain.handle(name, async(event, ...args)=>{
        const result = await api[name].result(...args);
        console.log(result);
        return result;
      })
    }catch(e){
      console.log(e);
      continue;
    }
  }*/

  SetWindowPos(win.getNativeWindowHandle(), HWND_BOTTOM, 0, 0, 0, 0, SWP_NOACTIVATE|SWP_NOSIZE|SWP_NOMOVE);
 // SetBottomMost(win.getNativeWindowHandle());

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