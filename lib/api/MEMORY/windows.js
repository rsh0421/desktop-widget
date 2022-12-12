const core = require('../core.windows');

let namespace;

const info = {
  speed: 0,
  free: 0,
  total: 0,
  count: 0,
  committed: 0,
  commitLimit: 0,
  poolPage: 0,
  poolNonPage: 0
};

exports.init = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT Tag, Capacity, Speed FROM Win32_PhysicalMemory');

    info.total = 0;
    info.count = 0;

    console.log(arr);

    for(const item of arr){
      info.speed = item.Speed;
      info.total += item.Capacity;
      info.count++;
    }
  }catch(e){
    throw new Error('Memory Init fail.');
  }
};

exports.run = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT AvailableBytes, CommitLimit, CommittedBytes, PoolNonpagedBytes, PoolPagedBytes FROM Win32_PerfFormattedData_PerfOS_Memory');

    if(arr.length > 0){
      const item = arr[0];
      info.free = item.AvailableBytes;
      info.committed = item.CommittedBytes;
      info.commitLimit = item.CommitLimit;
      info.poolPage = item.PoolPagedBytes;
      info.poolNonPage = item.PoolNonpagedBytes;
    }

    return {info}
  }catch(e){
    throw new Error('Memory Init fail.');
  }
};