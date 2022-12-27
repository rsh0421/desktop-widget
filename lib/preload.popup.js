// const {contextBridge,ipcRenderer} = require('electron');

// const api = {
//   result: (name, ...arg)=>ipcRenderer.invoke(name, ...arg),
//   popup: (name)=>{}
// };

// contextBridge.exposeInMainWorld('api', api);

require('./preload.js');
const {contextBridge} = require('electron');

contextBridge.exposeInMainWorld('POPUP_WINDOW', true);
contextBridge.exposeInMainWorld('PROGRAM_ARGV', process.argv);