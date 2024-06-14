
set OS=x64
set ELECTRON_VERSION=25.2.0

cd LaunchWinSocket
call node-gyp rebuild --target=%ELECTRON_VERSION% --arch=%OS% --dist-url=https://electronjs.org/headers
cd ..
copy .\LaunchWinSocket\build\Release\LaunchWinSocket.node            0.Output\win64\LaunchWinSocket.node   
rmdir /s/q LaunchWinSocket\build
pause
