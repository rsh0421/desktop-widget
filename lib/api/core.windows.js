const wmi = require('bindings')('wmi.node');

const namespaces = {};

exports.getNamespace = (ns)=>new Promise((resolve, reject)=>{
  try {
    let obj = namespaces[ns];

    if(!obj){
      obj = namespaces[ns] = new WmiNamespace(ns);
    }
    
    resolve(obj);
  } catch (error) {
    console.log(error);
    reject(error);
  }
});


class WmiNamespace{
  constructor(namespace){
    try{
      wmi.init();
    }catch(e){
      console.log(e);
    }
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