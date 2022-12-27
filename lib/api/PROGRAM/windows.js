const {shell} = require('electron');
const path = require('path');
const fs = require('fs');
const local = require('../local.js')

const USER_PATH = process.env.USERPROFILE;
const START_MENU_PATH = 'AppData/Roaming/Microsoft/windows/Start Menu/Programs';
const USER_START_MENU_PATH = path.join(USER_PATH, START_MENU_PATH);
const GLOBA_START_MENU_PATH = path.join(USER_PATH, START_MENU_PATH);

const LOCAL_NAME = 'PROGRAM';

const list = [];
const pathList = {};

let lData;

const createObjectList = (list)=>{
  const rst = [];

  for(const item of list){
    const stat = fs.statSync(path.join)
    rst.push();
  }
}

const getFileObjects = (path)=>{
  const list = fs.readdirSync(path);
  const rst = [];


}

exports.init = async()=>{
  try{
    lData = local.get(LOCAL_NAME);

    const userMenuStat = fs.statSync(USER_START_MENU_PATH);
    const globalMenuStat = fs.statSync(GLOBA_START_MENU_PATH);

    if(lData.uMtime !== userMenuStat.mtimeMs || lData.gMtime !== globalMenuStat.mtimeMs){
      lData.uMtime = userMenuStat.mtimeMs;
      lData.gMtime = globalMenuStat.mtimeMs;

      const uList = fs.readdirSync(USER_START_MENU_PATH);
      const gList = fs.readdirSync(GLOBA_START_MENU_PATH);

      const list = gList.concat(uList).sort();

      lData.list

      local.save(LOCAL_NAME);
    }

  }catch(e){
    console.log(e);
    throw new Error('Program list init fail.');
  }
}

exports.run = async(name)=>{
  try{

    if(typeof name === 'string'){
      shell.openPath(pathList[name]);
    }
    
    return {list}
  }catch(e){
    throw new Error('Program list run fail.');
  }
}