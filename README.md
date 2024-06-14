# GloriousCore

### Install
```shell
npm install
```

### Build
Output generated in `dist` directory.
```shell
npm run build:win
```

### Build & Run
This command will build your latest code changes, and then run the electron app in debug mode with VSCode attached.
```shell
npm run dev
```

### Launch Config
Use this `launch.config` configuration to build your latest code changes, and run electron with debugging in VSCode. Using the `Debug Main Process` will allow debugging of the `electron-process` code in VS code, while ignoring the `devtools`-debuggable `renderer-process` code. To include the renderer process, use the composite `` 
```json
 {
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite",
      "windows": {
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron-vite.cmd"
      },
      "runtimeArgs": ["--sourcemap"],
      "env": {
        "REMOTE_DEBUGGING_PORT": "9222"
      }
    },
    {
      "name": "Debug Renderer Process",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}/src/renderer",
      "timeout": 60000,
      "presentation": {
        "hidden": true
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug All",
      "configurations": ["Debug Main Process", "Debug Renderer Process"],
      "presentation": {
        "order": 1
      }
    }
  ]
}
```

Once this configuration has been added, you can use the built-in "Run and Debug" features in VSCode, including the shortcut `F5` to launch, after the "Electron Debug" option has been set as the "Run and Debug" target.

### Binary Libraries
This project uses compiled binaries generated from code in the `C` language. These binaries are compiled into `.node` libraries included in the `src/electron-process/renderer-interop/protocol/nodeDriver/x64` directory. These binaries are checked in and should not need to be rebuilt with every project build. Developers should not need to compile the `C` code in order to run and develop for the application.

In order to build the binary libraries, this project uses the CMake processor to generate project files, debugging files, and binary libraries. All of the binaries should be able to be built using standard CMake processes.

#### Build Prerequisites
Before building the binaries, you will need to pull down any dependencies so that they are local. This can be done by running the following command from the root of the project.

```shell
git submodule update --init --recursive
```

The above command should restore the `src/electron-process/thridparty/hidapi` and `src/electron-process/thridparty/libusb` libraries from their repositories.

In total, the prerequisites for building the binary libraries are:
 - CMake
 - A C Compiler (included with Visual Studio)
 - HIDAPI (git submodule)
 - LibUSB (git submodule)

#### Binaries
Once the prerequisites have been restored, CMake can be used to compile the binaries either individually or all at once.  

Internally, we use the `build_with_cmake.ps1` PowerShell script to help building the binaries.

#### Deployment
Once the binary `.node` files have been compiled, they need to be placed in the `src/electron-process/renderer-interop/protocol/nodeDriver/x64` directory.

When using the `build_with_cmake.ps1` PowerShell script, you can use the `-copy` argument to copy the binaries into the deployment directory.  
Example - Copy binaries (from root directory):
```shell
  ./build_with_cmake.ps1 -copy
```

#### Debugging
In order to use a JIT debugger, you will need to generate the required `.pdb` mapping files. Doing so is an option for the compiler.

Internally, we use the Visual Studio projects and rely on a configuration of the `build_with_cmake.ps1` script to correctly generate these debugging map files. By using the `-debug` argument, the script will use the compiler to generate the map files. This can be used in conjunction with the above `-copy` argument, to copy all binaries and debug maps into the `src/electron-process/renderer-interop/protocol/nodeDriver/x64` directory.

Example - Generate debug maps (from root directory):
```shell
  ./build_with_cmake.ps1 -debug
```


Example - Generate debug maps and copy all files into deployment directory (from root directory):
```shell
  ./build_with_cmake.ps1 -copy -debug
```

Once the debugging maps have been included in the deployment directory, any JIT debugger can be used to attach to the process. Internally, we use Visual Studio's JIT debugger, but it should work with JetBrains products, as well.


#### Slowdown Warning
Current conditions create a massive slowdown when the binary compilation projects are created in the `build_cmake_js` directory. The app may appear to freeze on startup, but it will eventually continue to work.

In order to use the generated projects for debugging, while minimizing the slowdown, you can delete the `build_cmake_js/_deps` subdirectory. There will still be some slowdown, but it will be noticeably shorter.

If you do not need to debug the `C` code, then the `build_cmake_js` direcotry can be deleted altogether. This will minimize startup time.