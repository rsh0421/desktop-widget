#include "wmi.h"
#include "WmiObject.h"

bool isConnect = false;

static napi_value ConnectMethod(napi_env env, const napi_callback_info info){
  napi_status status;

  size_t argc = 1;
  napi_value args[1];

  status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);

  if(status != napi_ok){
    napi_throw_error(env, NULL, "Failed to parse arguments");
  }

  if(!isConnect){
    HRESULT hres =  CoInitializeEx(0, COINIT_MULTITHREADED); //Strat to initialize COM library.

    if(FAILED(hres)){ //Failed to initialize COM library.
      std::string errorMessage = "Failed to initialize COM library. Error code = ";
      errorMessage += std::to_string(hres);
      napi_throw_error(env, NULL, errorMessage.c_str());
    }

    hres = CoInitializeSecurity(NULL, - 1, NULL, NULL, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE, NULL); //Strat to initialize security.

    if(FAILED(hres)){ //Failed to initialize security.
      std::string errorMessage = "Failed to initialize security. Error code = ";
      errorMessage += std::to_string(hres);
      CoUninitialize();
      napi_throw_error(env, NULL, errorMessage.c_str());
    }
    isConnect = true;
    printf("init success.\n");
  }

  napi_value instance;
  status = WmiObject::NewInstance(env, args[0], &instance);
  assert(status == napi_ok);

  return instance;
}

static napi_value Init(napi_env env, napi_value exports){
  napi_status status = WmiObject::Init(env);
  assert(status == napi_ok);

  napi_property_descriptor property = DECLARE_NAPI_METHOD("connect", ConnectMethod);
  status = napi_define_properties(env, exports, 1, &property);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)