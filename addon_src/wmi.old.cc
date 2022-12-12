#include "wmi.h"
#include "WmiObject.h"

//Wrapping namespace wmi
namespace wmi{
  bool isConnect = false;

  NAN_METHOD(ConnectMethod){ //WMI initialize function
    REQ_STRING(0, ns) 

    if(!isConnect){
      HRESULT hres =  CoInitializeEx(0, COINIT_MULTITHREADED); //Strat to initialize COM library.

      if(FAILED(hres)){ //Failed to initialize COM library.
        std::string errorMessage = "Failed to initialize COM library. Error code = ";
        errorMessage += std::to_string(hres);
        return Nan::ThrowError(errorMessage.c_str());
      }

      hres = CoInitializeSecurity(NULL, - 1, NULL, NULL, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE, NULL); //Strat to initialize security.

      if(FAILED(hres)){ //Failed to initialize security.
        std::string errorMessage = "Failed to initialize security. Error code = ";
        errorMessage += std::to_string(hres);
        CoUninitialize();
        return Nan::ThrowError(errorMessage.c_str());
      }
      isConnect = true;
      printf("init success.\n");
    }


    v8::Local<v8::Value> argv[1] = {ns};

    info.GetReturnValue().Set(WmiObject::NewInstance(1, argv));
  }

  NAN_METHOD(CloseMethod){
    CoUninitialize();

    isConnect = false;
  }

  NAN_MODULE_INIT(Init) {
    WmiObject::Init(target);

    BIND_PROPERTY("connect", ConnectMethod);
    BIND_PROPERTY("close", CloseMethod);
  }

  NODE_MODULE(wmi, Init)
}