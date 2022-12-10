const os = require('os');
const fs = require('fs');
const path = require('path');

const PLATFORMS = {
  'win32' : 'windows',
  'linux' : 'linux'
}

const modules = {};

const load = (platform)=>{
  const files = fs.readdirSync(__dirname);
  const dirs = [];

  for(const file of files){
    stat = fs.statSync(path.join(__dirname, file));

    if(stat.isDirectory()){
      const modulePath = path.join(__dirname, file, `${PLATFORMS[platform]}.js`);
      if(fs.existsSync(modulePath)){
        modules[platform] = require(modulePath);
        modules[platform].init();
      }
    }
  }
};

load(os.platform());
