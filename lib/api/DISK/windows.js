const core = require('../core.windows');

let namespace;

const info = {
  name: null,
  total: 0,
  read: 0,
  write: 0,
  transfer: 0,
  usage: 0
};

exports.init = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT Model, Size FROM Win32_DiskDrive');

    if(arr.length > 0){
      const item = arr[0];
      info.name = item.Model;
      info.total = item.Size;
    }
  }catch(e){
    throw new Error('Disk Init fail.');
  }
}

exports.run = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr1 = await namespace.query('SELECT DeviceID, FileSystem, FreeSpace, Size FROM Win32_LogicalDisk');

    const disks = [];

    for(const item of arr1){
      disks.push({
        name: item.DeviceID,
        system: item.FileSystem,
        free: item.FreeSpace,
        total: item.Size,
      })
    };

    const arr2 = await namespace.query('SELECT Name, DiskBytesPersec, DiskReadBytesPersec, DiskWriteBytesPersec, PercentDiskTime FROM Win32_PerfFormattedData_PerfDisk_LogicalDisk WHERE Name=_Total');

    if(arr2.length > 0){
      const item = arr2[0];
      info.read = item.DiskBytesPersec;
      info.write = item.DiskReadBytesPersec;
      info.transfer = item.DiskWriteBytesPersec;
      info.usage = item.PercentDiskTime;
    }

    return {info, disks}
  }catch(e){
    throw new Error('Disk run fail.');
  }
}