{
  "targets": [
    {
      "target_name": "wmi",
      "defines": [ "V8_DEPRECATION_WARNINGS=1" ],
      "sources": [ "addon_src/wmi.cc","addon_src/WmiObject.cc" ],
      "include_dirs": [
          "<!(node -e \"require('nan')\")"
      ],
      "libraries": [ "wbemuuid.lib" ]
    }
  ]
}