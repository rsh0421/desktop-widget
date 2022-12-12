const core = require('../core.windows');

let namespace;

const info = {
  name: null,
  cores: 0,
  processors: 0
};

const cores = [];
const total = {};

exports.init = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const cpuInfo = await namespace.query('SELECT Name, NumberOfCores, NumberOfLogicalProcessors, ProcessorFrequency FROM Win32_Processor');

    info.name = cpuInfo[0].name;
    info.cores = cpuInfo[0].NumberOfCores;
    info.processors = cpuInfo[0].NumberOfLogicalProcessors;
  }catch(e){
    throw new Error('CPU Init fail.');
  }
}

exports.run = async()=>{
  try{
    namespace = await core.getNamespace('ROOT\\CIMV2');
    const arr = await namespace.query('SELECT Name, PercentProcessorTime, PercentProcessorPerformance, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation');

    for(const item of arr){
      if(item.Name === '_Total'){
        total = {
          speed: item.ProcessorFrequency,
          usage: item.PercentProcessorTime
        }
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
    throw new Error('CPU Init fail.');
  }
}