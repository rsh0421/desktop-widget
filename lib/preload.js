// const {contextBridge,ipcRenderer} = require('electron');

// const api = {
//   result: (name, ...arg)=>ipcRenderer.invoke(name, ...arg),
//   popup: (name)=>{}
// };

// contextBridge.exposeInMainWorld('api', api);

const {contextBridge,ipcRenderer} = require('electron');

const api = {
  send: (name, ...arg)=>ipcRenderer.send(name, ...arg),
  on: (name, callback)=>ipcRenderer.on(name, callback),
  removeAllListeners: (name)=>ipcRenderer.removeAllListeners(name),
  result: (name, ...arg)=>ipcRenderer.invoke(name, ...arg),
  popup: (name, ...arg)=>ipcRenderer.invoke('open-popup-window', name, ...arg)
};

contextBridge.exposeInMainWorld('api', api);
