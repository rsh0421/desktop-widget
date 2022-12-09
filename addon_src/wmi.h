#pragma once

#ifndef WMI_HEADER_FILE
#define WMI_HEADER_FILE

#define _WIN32_DCOM

#include <nan.h>
#include <comdef.h>
#include <Wbemidl.h>
#include <string>

#define BIND_PROPERTY(NAME, FUNC) Nan::Set(target, Nan::New(NAME).ToLocalChecked(), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(FUNC)).ToLocalChecked());
#define BIND_FUNCTION(CONTEXT_OBJECT, NAME, FUNC) exports->Set(CONTEXT_OBJECT, Nan::New(NAME).ToLocalChecked(), Nan::New<v8::FunctionTemplate>(FUNC)->GetFunction(CONTEXT_OBJECT).ToLocalChecked())

#define REQ_STRING(i, NAME)                                                               \
  if(info.Length() <= i || !info[i]->IsString())                                          \
    return Nan::ThrowTypeError("#i Argument must be a string");                           \
  v8::Local<v8::String> NAME = v8::Local<v8::String>::Cast(info[i]);   

#define REQ_CALLBACK(i, NAME)                                                             \
  if(info.Length() <= i || !info[i]->IsFunction())                                        \
    return Nan::ThrowTypeError("#i Argument must be a function");                         \
  v8::Local<v8::Function> NAME = v8::Local<v8::Function>::Cast(info[i]);


#define PRINT_LOG(NAME) printf(*(Nan::Utf8String(NAME)))

#define INIT_OBJECT_FUNCTION(NAME)                                                        \
  Nan::HandleScope scope;                                                                 \
  NAME *self = Nan::ObjectWrap::Unwrap<NAME>(info.This());

#endif //WMI_HEADER_FILE