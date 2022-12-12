const wmi = require('bindings')('wmi.node');
console.log(wmi);
const start = async()=>{
  const CIMV2 = wmi.connect('ROOT\\CIMV2');
  const WMI = wmi.connect('ROOT\\WMI');

  console.log(WMI);


  setInterval(()=>{
    let startTime = Date.now()
    console.log(CIMV2.query('SELECT Name, PercentIdleTime, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation'));
    //CIMV2.query('SELECT Name, PercentIdleTime, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation')
    console.log(WMI.query('SELECT * FROM MSAcpi_ThermalZoneTemperature'));
    console.log(Date.now()-startTime);
  }, 1000);
}

start();