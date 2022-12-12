// const path = require('path');
// const fs = require('fs');
// const {contextBridge,ipcRenderer} = require('electron');

// const ipcList = fs.readdirSync(path.join(__dirname, 'api'));

// const api = {};

// for(const filename of ipcList){
//   const name = path.basename(filename, path.extname(filename));
//   api[name] = require(path.join(__dirname, 'api', filename));
// }

// contextBridge.exposeInMainWorld('api', api);

const {contextBridge,ipcRenderer} = require('electron');

const api = {result: async (name, ...arg)=>await ipcRenderer.invoke(name, ...arg)};

contextBridge.exposeInMainWorld('api', api);