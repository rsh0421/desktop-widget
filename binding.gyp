{
  "targets": [
    {
      "target_name": "wmi",
      "sources": [ "addon_src/wmi.cc" ],
      "include_dirs": [
          "<!(node -e \"require('nan')\")"
      ],
      "libraries": [ "wbemuuid.lib" ]
    }
  ]
}