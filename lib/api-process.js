const api = require('./api');
const fs = require('fs');
//api.load();
console.log(process);
fs.writeFileSync('info.txt', JSON.stringify(process.versions))
try {
  api.load();
  process.on('message', ({name, id, ...args})=>{
    console.log(name, id, ...args);
    api.run(name, ...args).then((result)=>{
      process.send({name, id, result});
    })
  });
  
  setInterval(()=>{
    console.log('test');
  }, 2000); 
} catch (error) {
}