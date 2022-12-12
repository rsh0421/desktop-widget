#pragma once

#ifndef WMI_OBJECT_HEADER_FILE
#define WMI_OBJECT_HEADER_FILE

#include "wmi.h"

class WmiObject {
  public:
    static napi_status Init(napi_env env);
    static void Destructor(napi_env env, void* nativeObject, void* finalize_hint);
    static napi_status NewInstance(napi_env env, napi_value arg, napi_value* instance);
  private:
    WmiObject(napi_env env, IWbemServices *pSvc): _env_(env), _wrapper_(nullptr), pSvc(pSvc){}
    ~WmiObject(){ napi_delete_reference(_env_, _wrapper_); }

    static inline napi_value Constructor(napi_env env);
    static napi_value New(napi_env env, napi_callback_info info);
    static napi_value QueryMethod(napi_env env, napi_callback_info info);
    static napi_value CloseMethod(napi_env env, napi_callback_info info);

    IWbemServices *pSvc;
    napi_env _env_;
    napi_ref _wrapper_;
};

#define DECLARE_NAPI_METHOD(name, func)                                        \
  { name, 0, func, 0, 0, 0, napi_default, 0 }


#endif //WMI_OBJECT_HEADER_FILE