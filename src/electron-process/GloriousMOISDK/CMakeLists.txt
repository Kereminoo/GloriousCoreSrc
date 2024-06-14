cmake_minimum_required(VERSION 3.11)

project(GloriousMOISDK)

if (WIN32)
    set(SOURCE "src/GloriousMOISDK.cc")
else ()
    set(SOURCE "src/GloriousMOISDKNotImplemented.cc")
endif()
add_library(${PROJECT_NAME} SHARED ${SOURCE} ${CMAKE_JS_SRC})

target_include_directories(${PROJECT_NAME} SYSTEM PUBLIC "src")

if (WIN32)
    target_link_libraries(${PROJECT_NAME}
            setupapi
            WtsApi32
            psapi
            ole32
            shell32
            Shlwapi
            Ws2_32
            Winmm
    )
endif (WIN32)
if (MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}" "/EHsc")
    add_definitions(
            -DWIN32_LEAN_AND_MEAN
            -DDEBUG
    )
endif (MSVC)

#find_package(hidapi REQUIRED)
#target_link_libraries(${PROJECT_NAME} hidapi::hidapi)
target_link_libraries(${PROJECT_NAME} hidapi)

# CMake-js

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
