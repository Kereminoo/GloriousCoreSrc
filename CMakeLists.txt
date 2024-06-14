cmake_minimum_required(VERSION 3.26)

if (NOT WIN32)
    set(CMAKE_C_COMPILER "clang")
    set(CMAKE_CXX_COMPILER "clang++")
else ()
    set(CMAKE_CXX20_STANDARD_COMPILE_OPTION "-std:c++latest")
    set(CMAKE_CXX20_EXTENSION_COMPILE_OPTION "-std:c++latest")
endif ()

project(GloriousCoreC)

set(CMAKE_CXX_STANDARD 23)

set(NODE_RUNTIME electron)
set(NODE_RUNTIME_VER 25.2.0)

if (NOT DEFINED ENV{SKIP_MANUAL_CMAKEJS})
    include("cmakejs.cmake")
    setup_cmakejs()
endif ()

add_subdirectory(src/electron-process/AudioSession)
add_subdirectory(src/electron-process/GloriousMOISDK)
add_subdirectory(src/electron-process/hiddevice)
add_subdirectory(src/electron-process/LaunchWinSocket)


set(CMAKE_FRAMEWORK ON)
set(HIDAPI_WITH_HIDRAW OFF)
set(HIDAPI_WITH_LIBUSB ON)
set(BUILD_SHARED_LIBS FALSE)
add_subdirectory(src/electron-process/thridparty/hidapi)
