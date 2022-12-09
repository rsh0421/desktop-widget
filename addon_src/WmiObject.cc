#include "WmiObject.h"

v8::Local<v8::String> wcharToString(BSTR str){
  int strSize = WideCharToMultiByte(CP_ACP, 0,str,-1, NULL, 0,NULL, NULL);
  char* pStr = new char[strSize];
  WideCharToMultiByte(CP_ACP, 0, str, -1, pStr, strSize, 0,0);

  v8::Local<v8::String> rst = Nan::New<v8::String>(pStr).ToLocalChecked();
  delete pStr;

  return rst;
}

NAN_MODULE_INIT(WmiObject::Init){
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "query", QueryMethod);
  Nan::SetPrototypeMethod(tpl, "close", CloseMethod);

  constructor().Reset(Nan::GetFunction(tpl).ToLocalChecked());
}

v8::Local<v8::Object> WmiObject::NewInstance(int argc, v8::Local<v8::Value> argv[]){
  v8::Local<v8::Function> cons = Nan::New(constructor());

  return Nan::NewInstance(cons, argc, argv).ToLocalChecked();
}

NAN_METHOD(WmiObject::New){
  if(!info.IsConstructCall()){
    Nan::ThrowTypeError("Cannot instantiate without new");
  }

  REQ_STRING(0, ns)

  HRESULT hres;
  IWbemLocator *pLoc = 0;
  IWbemServices *pSvc = 0;

  hres = CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, (LPVOID *) &pLoc);

  if(FAILED(hres)){
    std::string errorMessage = "Failed to create IWbemLocator object. Error code = ";
    errorMessage += std::to_string(hres);
    CoUninitialize();
    return Nan::ThrowError(errorMessage.c_str());
  }

  hres = pLoc->ConnectServer(_bstr_t(*(Nan::Utf8String(ns))), NULL, NULL, 0, NULL, 0, 0, &pSvc);

  if(FAILED(hres)){
    std::string errorMessage = "Could not connect. Error code = ";
    errorMessage += std::to_string(hres);
    pLoc->Release();     
    CoUninitialize();
    return Nan::ThrowError(errorMessage.c_str());
  }

  hres = CoSetProxyBlanket(pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE);

  if(FAILED(hres)){
    std::string errorMessage = "Could not set proxy blanket. Error code = ";
    errorMessage += std::to_string(hres);
    pSvc->Release();
    pLoc->Release();     
    CoUninitialize();
    return Nan::ThrowError(errorMessage.c_str());
  }

  printf("%s connect.\n", *(Nan::Utf8String(ns)));

  WmiObject *obj = new WmiObject(pLoc, pSvc);
  obj->Wrap(info.This());

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(WmiObject::QueryMethod){
  INIT_OBJECT_FUNCTION(WmiObject)
  REQ_STRING(0, query) 

  v8::Local<v8::Array> arr = Nan::New<v8::Array>();
  
  HRESULT hres;
  IWbemServices *pSvc = self->pSvc;
  IEnumWbemClassObject* pEnumerator = NULL;

  hres = self->pSvc->ExecQuery(bstr_t("WQL"), bstr_t(*(Nan::Utf8String(query))), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator);

  if(FAILED(hres)){
    std::string errorMessage = "Query for operating system name failed. Error code = ";
    errorMessage += std::to_string(hres);

    return Nan::ThrowError(errorMessage.c_str());
  }else{

    IWbemClassObject *pclsObj;
    ULONG uReturn = 0;
    uint32_t index = 0;

    while (pEnumerator){
      hres = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);

      if(uReturn == 0){
        break;
      }

      v8::Local<v8::Object> obj = Nan::New<v8::Object>();

      if(pclsObj->BeginEnumeration(0) == S_OK){
        BSTR name = nullptr;
        VARIANT var;
        CIMTYPE type;

        while(pclsObj->Next(0, &name, &var, &type, nullptr) == WBEM_S_NO_ERROR){
          if(name[0] == (wchar_t)'-'){
            printf("system\n");
          }
          switch(type){
            case CIM_SINT64: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : Nan::New<v8::Number>(_wtoi(var.bstrVal))); break;
            case CIM_SINT32: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : Nan::New<v8::Number>(var.intVal)); break;
            case CIM_UINT64: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : Nan::New<v8::Number>(_wtoi(var.bstrVal))); break;
            case CIM_UINT32: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : Nan::New<v8::Number>(var.uintVal)); break;
            case CIM_BOOLEAN: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : Nan::New<v8::Boolean>(var.boolVal)); break;
            case CIM_STRING: Nan::Set(obj, wcharToString(name), (var.bstrVal == nullptr)? Nan::Null() : wcharToString(var.bstrVal)); break;
          }
          SysFreeString(name);
          VariantClear(&var);
        }

      }

      Nan::Set(arr, index++, obj);

      pclsObj->Release();
      pclsObj = NULL;
    }

    pEnumerator->Release();
  }

  info.GetReturnValue().Set(arr);
}

NAN_METHOD(WmiObject::CloseMethod){
  INIT_OBJECT_FUNCTION(WmiObject)

  self->pSvc->Release();
  self->pLoc->Release();
}