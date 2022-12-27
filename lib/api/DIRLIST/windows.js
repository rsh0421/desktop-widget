const {shell} = require('electron');
const path = require('path');
const fs = require('fs');

const TMP_ICON_PATH = path.join(process.env.TEMP, '.dw-dirlist-icons');
const USER_PATH = process.env.USERPROFILE;
const DIR_LIST = ['Downloads', 'Documents', 'Pictures', 'Videos', 'Music'];

const list = [];
const pathList = {};

exports.init = async()=>{
  try{
    for(const name of DIR_LIST){
      const pathname = path.join(USER_PATH, name);
      list.push({
        name,
        path: pathname
      });

      pathList[name] = pathname;
    }
  }catch(e){
    throw new Error('Directories list init fail.');
  }
}

exports.run = async(name)=>{
  try{

    if(typeof name === 'string'){
      shell.openPath(pathList[name]);
    }
    
    return {list}
  }catch(e){
    throw new Error('Directories list run fail.');
  }
}