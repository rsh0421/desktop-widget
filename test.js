const wmi = require('bindings')('wmi.node');
console.log(wmi);

const CIMV2 = wmi.connect('ROOT\\CIMV2');
const WMI = wmi.connect('ROOT\\WMI');


setInterval(()=>{
  let startTime = Date.now()
  //console.log(CIMV2.query('SELECT Name, NumberOfCores, NumberOfLogicalProcessors FROM Win32_Processor'));
  //console.log(CIMV2.query('SELECT Name, PercentIdleTime, PercentProcessorTime, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation'));
  const obj = CIMV2.query('SELECT * FROM Win32_PerfFormattedData_PerfDisk_LogicalDisk WHERE Name="_Total"');
  console.log(obj);
  //console.log(WMI.query('SELECT * FROM MSAcpi_ThermalZoneTemperature'));
  console.log(Date.now()-startTime);
}, 1000);
