const os = require('os');
const fs = require('fs');
const path = require('path');

const PLATFORMS = {
  'win32' : 'windows',
  'linux' : 'linux'
}

const modules = {};

exports.load = async()=>{
  const platform = os.platform();
  const files = fs.readdirSync(__dirname);

  for(const file of files){
    stat = fs.statSync(path.join(__dirname, file));

    if(stat.isDirectory()){
      const modulePath = path.join(__dirname, file, `${PLATFORMS[platform]}.js`);
      if(fs.existsSync(modulePath)){
        modules[file] = require(modulePath); 
        fs.writeFileSync('test1.txt',modulePath )
        
        if(typeof modules[file].init === 'function') await modules[file].init();
      }

      
    }
  }
};

exports.run = async(name, ...args)=>{
  if(!modules[name]){return null;}

  if(typeof modules[name].run === 'function'){
    const result = await modules[name].run(...args);
    return result;
  }else{
    return null;
  }
}

exports.list = ()=>{
  return Object.keys(modules);
}
