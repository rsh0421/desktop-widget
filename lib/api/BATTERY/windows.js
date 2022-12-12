const core = require('../core.windows');

let namespace;

const info = {
  hasBattery: false,
  status: 0,
  charge: 0
};
exports.init = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT BatteryStatus, EstimatedChargeRemaining FROM Win32_Battery');

    if(arr.length >= 1){
      info.hasBattery = true;
    }else{
      info.hasBattery = false;
    }
  }catch(e){
    return new Error('Battery Init fail.');
  }
}

exports.run = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT BatteryStatus, EstimatedChargeRemaining FROM Win32_Battery');

    if(arr.length >= 1){
      info.hasBattery = true;
      switch(arr[0].BatteryStatus){
        case null: case 1:
          info.status = 'battery'
          break;
        case 2: case 6: case 7: case 8:
          info.status = 'charging'
          break;
        case 3:
          info.status = 'full'
          break;
        case 4:
          info.status = 'low'
          break;
      }
      info.charge = arr[0].EstimatedChargeRemaining;
    }else{
      info.hasBattery = false;
    }

    return {info}
  }catch(e){
    return new Error('Battery run fail.');
  }
}