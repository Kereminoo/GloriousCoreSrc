cmake_minimum_required(VERSION 3.10)

project(AudioServerPlugin)

set(CMAKE_CXX_STANDARD 11)

include_directories(/System/Library/Frameworks/CoreAudio.framework/Headers)
include_directories(${CMAKE_SOURCE_DIR})

add_library(${PROJECT_NAME} MODULE
    GloriousAudioServicePlugin.cpp
    GloriousAudioDevice.h
    GloriousAudioDevice.cpp
    PerAppDataHandlers.h
    PerAppDataHandlers.cpp
)

set_target_properties(${PROJECT_NAME} PROPERTIES
    BUNDLE TRUE
    BUNDLE_EXTENSION "bundle"
)
