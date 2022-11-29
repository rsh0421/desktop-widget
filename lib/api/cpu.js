const os = require('os');

const getInfo = ()=>{
  const cpus = os.cpus();

  const result = {
    use: 0,
    idle: 0,
    speed: 0
  }

  for(const item of cpus){
    result.use += item.times.sys;
    result.use += item.times.user;
    result.use += item.times.irq;
    result.idle += item.times.idle;
    result.speed += item.speed;
  }

  result.speed = (cpus.length === 0)? 0 : Math.round(result.speed / (cpus.length));

  return result;
}


let prevInfo = getInfo();

exports.result = ()=>{

  const currInfo = getInfo();

  const delta = {
    use: (currInfo.use - prevInfo.use),
    idle: (currInfo.idle - prevInfo.idle)
  };

  const result = {
    usage: ((delta.use + delta.idle) === 0)? 0 : Math.round( delta.use / (delta.use + delta.idle) * 100 ),
    speed: currInfo.speed
  };

  prevInfo = currInfo;

  return result;
}