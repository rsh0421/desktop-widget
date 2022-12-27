const fs = require('fs');
const path = require('path');

const TMP_PATH = path.join(process.env.TEMP, '.desktop-widget');

const locals = {};

exports.init = ()=>{
  if(!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
  }
}

exports.get = (name)=>{
  const filePath = path.join(TMP_PATH, `${name}.json`);

  try{
    locals[name] = require(filePath);
  }catch(e){
    locals[name] = {};
  }

  return locals[name];
}

exports.save = (name)=>{
  const filePath = path.join(TMP_PATH, `${name}.json`);

  if(typeof locals[name] === 'object'){
    fs.writeFileSync(filePath, JSON.stringify(locals[name]));
  }
}