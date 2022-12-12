#pragma once

#ifndef WMI_OBJECT_HEADER_FILE
#define WMI_OBJECT_HEADER_FILE

#include "wmi.h"

class WmiObject : public Nan::ObjectWrap{
  public:
    static NAN_MODULE_INIT(Init);
    static v8::Local<v8::Object> NewInstance(int argc, v8::Local<v8::Value> argv[]);
  private:
    WmiObject(IWbemLocator *pLoc, IWbemServices *pSvc): pLoc(pLoc), pSvc(pSvc){}
    ~WmiObject(){}

    static NAN_METHOD(New);
    static NAN_METHOD(QueryMethod);
    static NAN_METHOD(CloseMethod);

    static inline Nan::Persistent<v8::Function> & constructor(){
      static Nan::Persistent<v8::Function> wmiConstructor;

      return wmiConstructor;
    }

    IWbemLocator *pLoc;
    IWbemServices *pSvc;
};


#endif //WMI_OBJECT_HEADER_FILE