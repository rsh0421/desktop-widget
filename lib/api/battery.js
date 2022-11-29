const {spawnSync} = require('child_process');

exports.result = ()=>{
  const {stdout} = spawnSync('WMIC', ['Path', 'Win32_Battery', 'Get', 'BatteryStatus,EstimatedChargeRemaining']);

  const data = stdout.toString();
  console.log(data);
  let str = data.split('\n')[1];

  const [type, capacity] = str.replace(/[' ']+/g, ' ').replace(/\r/g,'').split(' ');
  return {
    type: parseFloat(type),
    capacity: parseFloat(capacity)
  };
}