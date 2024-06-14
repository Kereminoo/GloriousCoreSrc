
set OS=x64
set ELECTRON_VERSION=25.2.0

cd hiddevice
call node-gyp rebuild --target=%ELECTRON_VERSION% --arch=%OS% --dist-url=https://electronjs.org/headers
cd ..
copy .\hiddevice\build\Release\hiddevice.node            0.Output\win64\hiddevice.node   
rmdir /s/q hiddevice\build
pause
