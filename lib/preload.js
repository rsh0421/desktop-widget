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

const path = require('path');
const {fork} = require('child_process');
const {contextBridge} = require('electron');

const apiProcess = fork(path.join(__dirname, 'api-process.js'), ['--inspect=9229']);

const eventHandleList = {};

const send = (name, ...args)=>new Promise((reolve, reject)=>{
  const id = Date.now();
  eventHandleList[`${name}${id}`] = {reolve, reject};

  console.log(eventHandleList);

  apiProcess.send({name, id, ...args});
});

apiProcess.on('message', ({name, id, result})=>{
  if(eventHandleList[`${name}${id}`] && typeof eventHandleList[`${name}${id}`].resolve === 'function'){
    eventHandleList[`${name}${id}`].resolve(result);
    delete eventHandleList[`${name}${id}`];
  }
});

apiProcess.on('close', ()=>{
  console.log('api process close.');
})

const api = {
  result: send
}

contextBridge.exposeInMainWorld('api', api);