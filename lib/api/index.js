const os = require('os');
const fs = require('fs');
const path = require('path');

const PLATFORMS = {
  'win32' : 'windows',
  'linux' : 'linux'
}

const modules = {};

exports.load = ()=>{
  const platform = os.platform();
  const files = fs.readdirSync(__dirname);

  for(const file of files){
    stat = fs.statSync(path.join(__dirname, file));

    if(stat.isDirectory()){
      const modulePath = path.join(__dirname, file, `${PLATFORMS[platform]}.js`);
      console.log(modulePath);
      if(fs.existsSync(modulePath)){
        fs.appendFileSync('test1.txt',modulePath )
        try {
          modules[file] = require(modulePath); 
        } catch (error) {
          fs.writeFileSync('error.txt',error)
        }
        fs.writeFileSync('test1.txt',modulePath )
        if(typeof modules[file].init === 'function') modules[file].init();
      }

      
    }
  }
};

exports.run = async(name, ...args)=>{
  console.log(modules);
  if(!modules[name]){return null;}

  if(typeof modules[name].run === 'function'){
    const result = await modules[name].run(...args);
    console.log(result);
    return result;
  }else{
    return null;
  }
}

exports.list = ()=>{
  return Object.keys(modules);
}
