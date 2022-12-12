const core = require('../core.windows');

let namespace;

const info = {
  name: null,
  maxSpeed: 0,
  cores: 0,
  processors: 0
};

const cores = [];
const total = {};

exports.init = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT Name, MaxClockSpeed, NumberOfCores, NumberOfLogicalProcessors FROM Win32_Processor');

    if(arr.length > 0){
      const item = arr[0];
      info.name = item.Name;
      info.maxSpeed = item.MaxClockSpeed;
      info.cores = item.NumberOfCores;
      info.processors = item.NumberOfLogicalProcessors;
    }

  }catch(e){
    console.log(e);
    throw new Error('CPU Init fail.');
  }
}

exports.run = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT Name, PercentProcessorTime, PercentProcessorPerformance, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation');

    for(const item of arr){
      if(item.Name === '_Total'){
        total.speed = item.ProcessorFrequency,
        total.usage = item.PercentProcessorTime
      }else if(/^\d+,\d+$/.test(item.Name)){
        const nameSplit = item.Name.split(',');
        const index = parseInt(nameSplit[1]);
        cores[index] = {
          speed: item.ProcessorFrequency,
          usage: item.PercentProcessorTime
        }
      }
    }

    return {info, cores, total}
  }catch(e){
    console.log(e);
    throw new Error('CPU run fail.');
  }
}