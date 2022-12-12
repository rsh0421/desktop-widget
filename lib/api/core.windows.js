const wmi = require('bindings')('wmi.node');
const fs = require('fs');
/*
const CIMV2 = wmi.connect('ROOT\\CIMV2');
const WMI = wmi.connect('ROOT\\WMI');


setInterval(()=>{
  let startTime = Date.now()
  console.log(CIMV2.query('SELECT Name, PercentIdleTime, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation'));
  //CIMV2.query('SELECT Name, PercentIdleTime, ProcessorFrequency FROM Win32_PerfFormattedData_Counters_ProcessorInformation')
  console.log(WMI.query('SELECT * FROM MSAcpi_ThermalZoneTemperature'));
  console.log(Date.now()-startTime);
}, 1000);

*/
const namespaces = {};

exports.getNamespace = (ns)=>new Promise((resolve, reject)=>{
  try {
    let obj = namespaces[ns];

    console.log(obj, namespaces);

    if(!obj){
      obj = namespaces[ns] = new WmiNamespace(ns);

      console.log(namespaces);
    }
    
    resolve(obj);
  } catch (error) {
    console.log(error);
    reject(error);
  }
});


class WmiNamespace{
  constructor(namespace){
    this._obj = wmi.connect(namespace);
  }

  query(queryStr){
    return new Promise((resolve, reject)=>{
      try {
        resolve(this._obj.query(queryStr));
      } catch (error) {
        reject(error);
      }
    });
  }

  close(){
    return this._obj.close();
  }
}