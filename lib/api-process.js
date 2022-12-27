const api = require('./api');
const fs = require('fs');

fs.writeFileSync('info.txt', JSON.stringify(process.versions))
try {
  api.load();
  process.on('message', ({name, id, ...args})=>{
    api.run(name, ...args).then((result)=>{
      process.send({name, id, result});
    })
  });
  
  setInterval(()=>{
    console.log('test');
  }, 2000); 
} catch (error) {
}