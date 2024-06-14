# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-src"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-build"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/tmp"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/src/boost-populate-stamp"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/src"
  "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/src/boost-populate-stamp"
)

set(configSubDirs Debug)
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/src/boost-populate-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "C:/Development/core/projects/glorious-core-app/build_cmake_js/_deps/boost-subbuild/boost-populate-prefix/src/boost-populate-stamp${cfgdir}") # cfgdir has leading slash
endif()
