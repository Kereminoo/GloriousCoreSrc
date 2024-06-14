cmake_minimum_required(VERSION 3.26)

project(LaunchWinSocket)

set(CMAKE_CXX_STANDARD 20)

set(CMAKE_VERBOSE_MAKEFILE OFF)

set(SOURCE "src/LaunchWinSocket.cc" "src/tools/WriteLog.cpp")

add_library(${PROJECT_NAME} SHARED ${SOURCE} ${CMAKE_JS_SRC})

target_include_directories(${PROJECT_NAME} SYSTEM PUBLIC "src" "src/tools")

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

set(BOOST_INCLUDE_LIBRARIES system asio)
set(BOOST_ENABLE_CMAKE ON)

include(FetchContent)
Set(FETCHCONTENT_QUIET FALSE) # Needed to print downloading progress
FetchContent_Declare(
        Boost
        URL https://github.com/boostorg/boost/releases/download/boost-1.82.0/boost-1.82.0.7z # downloading a zip release speeds up the download
        USES_TERMINAL_DOWNLOAD TRUE
        GIT_PROGRESS TRUE
        DOWNLOAD_NO_EXTRACT FALSE
)
FetchContent_MakeAvailable(Boost)

target_link_libraries(${PROJECT_NAME} Boost::asio)

#find_package(Boost REQUIRED)
#target_include_directories(${PROJECT_NAME} SYSTEM PRIVATE ${Boost_INCLUDE_DIRS})


# CMake-js

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
