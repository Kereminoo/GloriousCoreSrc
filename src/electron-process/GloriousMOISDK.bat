
set OS=x64
set ELECTRON_VERSION=25.2.0

cd GloriousMOISDK
call node-gyp rebuild --target=%ELECTRON_VERSION% --arch=%OS% --dist-url=https://electronjs.org/headers
cd ..
copy .\GloriousMOISDK\build\Release\GloriousMOISDK.node            0.Output\win64\GloriousMOISDK.node   
rmdir /s/q GloriousMOISDK\build
pause
