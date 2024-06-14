cmake_minimum_required(VERSION 3.11)
project(hidapi)

if (WIN32)
  set(SOURCES windows/hid.c)
endif()

add_definitions(
  -D_LARGEFILE_SOURCE
  -D_FILE_OFFSET_BITS=64
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}" -g)

add_library(${PROJECT_NAME} STATIC ${SOURCES})
target_include_directories(${PROJECT_NAME} PUBLIC hidapi)
