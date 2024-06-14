
set OS=x64
set ELECTRON_VERSION=25.2.0

cd AudioSession
call node-gyp rebuild --target=%ELECTRON_VERSION% --arch=%OS% --dist-url=https://electronjs.org/headers
cd ..
copy .\AudioSession\build\Release\AudioSession.node            0.Output\win64\AudioSession.node  
rmdir /s/q AudioSession\build
pause
