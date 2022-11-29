const os = require('os');

exports.result = ()=>{
  const free = os.freemem();
  const total = os.totalmem();
  return {
    free: Math.round(free / (1024*1024*1024) * 10) / 10,
    total: Math.round(total / (1024*1024*1024) * 10) / 10,
    percentage: Math.round(free / total * 100)
  };
}