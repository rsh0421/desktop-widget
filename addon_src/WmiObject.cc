#include "WmiObject.h"

void wcharToString(BSTR str, char pStr[]){
  int strSize = WideCharToMultiByte(CP_ACP, 0, str, -1, NULL, 0,NULL, NULL);

  WideCharToMultiByte(CP_ACP, 0, str, -1, pStr, strSize, 0,0);
}

void obj_property(napi_env env, napi_value obj, BSTR name, VARIANT var, CIMTYPE type){
  napi_value value;

  char nameStr[100];

  wcharToString(name, nameStr);

  switch(type){
    case CIM_SINT64:
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_create_int64(env, _wtoi(var.bstrVal), &value);
      break;
    case CIM_SINT32:
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_create_int32(env, var.intVal, &value);
      break;
    case CIM_UINT64:
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_create_int64(env, _wtoi(var.bstrVal), &value);
      break;
    case CIM_UINT32:
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_create_uint32(env, var.uintVal, &value);
      break;
    case CIM_BOOLEAN:
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_get_boolean(env, var.boolVal, &value);
      break;
    case CIM_STRING:{
      char valueStr[100];
      wcharToString(var.bstrVal, valueStr);
      (var.bstrVal == nullptr)? napi_get_null(env, &value) : napi_create_string_utf8(env, valueStr, strlen(valueStr), &value);
      break;
    }
  }

  napi_status status = napi_set_named_property(env, obj, nameStr, value);
  assert(status == napi_ok);
}

napi_status WmiObject::Init(napi_env env){
  napi_status status;
  napi_property_descriptor properties[] = {
    DECLARE_NAPI_METHOD("query", QueryMethod),
    DECLARE_NAPI_METHOD("close", CloseMethod)
  };

  napi_value cons;
  status = napi_define_class(env, "WmiObject", NAPI_AUTO_LENGTH, New, nullptr, 2, properties, &cons);
  assert(status == napi_ok);

  napi_ref* constructor = new napi_ref;
  status = napi_create_reference(env, cons, 1, constructor);
  assert(status == napi_ok);

  status = napi_set_instance_data(
    env,
    constructor,
    [](napi_env env, void* data, void* hint) {
      napi_ref* constructor = static_cast<napi_ref*>(data);
      napi_status status = napi_delete_reference(env, *constructor);
      assert(status == napi_ok);
      delete constructor;
    },
    nullptr);
  assert(status == napi_ok);

  return napi_ok;
}

void WmiObject::Destructor(napi_env env, void* nativeObject, void* finalize_hint){

}
napi_status WmiObject::NewInstance(napi_env env, napi_value arg, napi_value* instance){
  napi_status status;

  const int argc = 1;
  napi_value args[argc] = {arg};

  status = napi_new_instance(env, Constructor(env), argc, args, instance);

  printf("test");

  return status;
}

inline napi_value WmiObject::Constructor(napi_env env){
  void* instance_data = nullptr;
  napi_status status = napi_get_instance_data(env, &instance_data);
  assert(status == napi_ok);
  napi_ref* constructor = static_cast<napi_ref*>(instance_data);

  napi_value cons;
  status = napi_get_reference_value(env, *constructor, &cons);
  assert(status == napi_ok);
  return cons;
}

napi_value WmiObject::New(napi_env env, napi_callback_info info){
  napi_status status;

  size_t argc = 1;
  napi_value args[1];
  napi_value jsThis;

  status = napi_get_cb_info(env, info, &argc, args, &jsThis, nullptr);
  assert(status == napi_ok);

  napi_valuetype argtype0;
  status = napi_typeof(env, args[0], &argtype0);

  if (argtype0 != napi_string) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  char ns[32];
  size_t length;
  
  status = napi_get_value_string_utf8(env, args[0], ns, 32, &length);

  HRESULT hres;
  IWbemLocator *pLoc = 0;
  IWbemServices *pSvc = 0;

  hres = CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, (LPVOID *) &pLoc);

  if(FAILED(hres)){
    std::string errorMessage = "Failed to create IWbemLocator object. Error code = ";
    errorMessage += std::to_string(hres);
    CoUninitialize();
    napi_throw_error(env, NULL, errorMessage.c_str());
  }

  hres = pLoc->ConnectServer(_bstr_t(ns), NULL, NULL, 0, NULL, 0, 0, &pSvc);

  if(FAILED(hres)){
    std::string errorMessage = "Could not connect. Error code = ";
    errorMessage += std::to_string(hres);
    pLoc->Release();     
    CoUninitialize();
    napi_throw_error(env, NULL, errorMessage.c_str());
  }

  pLoc->Release();

  hres = CoSetProxyBlanket(pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE);

  if(FAILED(hres)){
    std::string errorMessage = "Could not set proxy blanket. Error code = ";
    errorMessage += std::to_string(hres);
    pSvc->Release();
    pLoc->Release();     
    CoUninitialize();
    napi_throw_error(env, NULL, errorMessage.c_str());
  }

  printf("%s connect.\n", ns);


  WmiObject* obj = new WmiObject(env, pSvc);

  status = napi_wrap(env,
                     jsThis,
                     reinterpret_cast<void*>(obj),
                     WmiObject::Destructor,
                     nullptr, /* finalize_hint */
                     &obj->_wrapper_);

  assert(status == napi_ok);

  return jsThis;
}

napi_value WmiObject::QueryMethod(napi_env env, napi_callback_info info){
  napi_status status;

  size_t argc = 1;
  napi_value args[1];
  napi_value jsThis;

  status = napi_get_cb_info(env, info, &argc, args, &jsThis, nullptr);
  assert(status == napi_ok);

  napi_valuetype argtype0;
  status = napi_typeof(env, args[0], &argtype0);

  if (argtype0 != napi_string) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  char query[256];
  size_t length;
  
  status = napi_get_value_string_utf8(env, args[0], query, 256, &length);

  WmiObject* self;
  status = napi_unwrap(env, jsThis, reinterpret_cast<void**>(&self));
  assert(status == napi_ok);

  napi_value arr;
  status = napi_create_array(env, &arr);
  assert(status == napi_ok);

  HRESULT hres;
  IWbemServices *pSvc = self->pSvc;
  IEnumWbemClassObject* pEnumerator = NULL;

  hres = self->pSvc->ExecQuery(bstr_t("WQL"), bstr_t(query), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator);

  if(FAILED(hres)){
    std::string errorMessage = "Query for operating system name failed. Error code = ";
    errorMessage += std::to_string(hres);

    napi_throw_error(env, NULL, errorMessage.c_str());
  }else{

    IWbemClassObject *pclsObj;
    ULONG uReturn = 0;
    uint32_t index = 0;

    while (pEnumerator){
      hres = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);

      if(uReturn == 0){
        break;
      }

      napi_value obj;
      status = napi_create_object(env, &obj);
      assert(status == napi_ok);

      if(pclsObj->BeginEnumeration(0) == S_OK){
        BSTR name = nullptr;
        VARIANT var;
        CIMTYPE type;

        while(pclsObj->Next(0, &name, &var, &type, nullptr) == WBEM_S_NO_ERROR){
          if(name[0] != (wchar_t)'_'){
            obj_property(env, obj, name, var, type);
          }
            
          SysFreeString(name);
          VariantClear(&var);
        }

      }

      napi_set_element(env, arr, index++, obj);

      pclsObj->Release();
    }

    pEnumerator->Release();
  }

  return arr;
}

napi_value WmiObject::CloseMethod(napi_env env, napi_callback_info info){
  napi_status status;

  napi_value jsThis;

  status = napi_get_cb_info(env, info, nullptr, nullptr, &jsThis, nullptr);
  assert(status == napi_ok);

  WmiObject* self;
  status = napi_unwrap(env, jsThis, reinterpret_cast<void**>(&self));
  assert(status == napi_ok);

  self->pSvc->Release();

  napi_value value;

  napi_get_null(env, &value);

  return value;
}