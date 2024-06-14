# Native Modules Directory

This directory contains the native Node.js modules compiled for different platforms and architectures. Its purpose is to store the latest builds of native modules in one place.

## Structure

The `nativeModules` directory is organized as follows:

- `darwin`: Contains modules for macOS (Darwin).
  - `arm64`: Modules compiled for Apple Silicon (ARM64 architecture).
  - `x86_64`: Modules compiled for Intel-based Macs (x86_64 architecture).
- `win`: Contains modules for Windows.
  - `x64`: Modules compiled for 64-bit Windows.

## Usage

The modules in this directory serve as a centralized storage for the latest builds across different platforms. They are not directly used by the application in runtime. If a user wishes to use a specific pre-built module, it can be manually copied from this directory to the `src/electron-process/renderer-interop/protocol/nodeDriver/lib` folder.

Alternatively, users can build the modules from the source code and have them automatically copied to the `src/electron-process/renderer-interop/protocol/nodeDriver/lib`  folder by using the `/build_with_cmake.*` scripts. This process ensures that the modules are compiled with the correct version of Node.js and Electron for the target platform.

## Building and Updating

To build or update the modules:
1. Add or update the native module source code in the `src/electron-process` subdirectory.
2. Run the `/build_with_cmake.*` scripts to compile the modules.
3. The scripts will automatically place the compiled modules (if copy=true) in the `src/electron-process/renderer-interop/protocol/nodeDriver/lib` folder.
4. Copy modules from `src/electron-process/renderer-interop/protocol/nodeDriver/lib` to the platform-specific catalog

