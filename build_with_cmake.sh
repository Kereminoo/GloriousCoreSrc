#!/usr/bin/env bash

#setup_vcpkg () {
#  if [ -z "${VCPKG_ROOT}" ]; then
#      pushd ..
#      if [ ! -d "vcpkg" ]; then
#          git clone https://github.com/Microsoft/vcpkg.git
#          ./vcpkg/bootstrap-vcpkg.sh
#      fi
#      export VCPKG_ROOT="$(realpath vcpkg)"
#      export PATH="${VCPKG_ROOT}:${PATH}"
#      popd
#  fi
#
#  if ! command -v vcpkg &> /dev/null
#  then
#      echo "vcpkg is not available or not in PATH"
#      exit 1
#  fi
#  export CMAKE_TOOLCHAIN_FILE="${VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
#  toolchain="--CDCMAKE_TOOLCHAIN_FILE=$CMAKE_TOOLCHAIN_FILE"
#
#  vcpkg install
#}

clean=false
debug=false
copy=false

# Parse args
for arg in "$@"
do
    case $arg in
        --clean) clean=true ;;
        --debug) debug=true ;;
        --copy) copy=true ;;
    esac
done

if ! command -v cmake-js &> /dev/null
then
    echo "cmake-js is not available. Trying npm install..."
    npm install cmake-js
fi


build_dir="build_cmake_js"
if [ ! -d "$build_dir" ]; then
    mkdir "$build_dir"
elif $clean; then
    echo "Cleaning up..."
    rm -rf "${build_dir:?}"/*
fi

export SKIP_MANUAL_CMAKEJS=1

flag_debug=""
if $debug; then
    flag_debug="-D -x"
fi

#setup_vcpkg()

cmake-js build -r electron -v 25.2.0 -O $build_dir $flag_debug $toolchain

if $copy; then
    output="src/electron-process/renderer-interop/protocol/nodeDriver/lib"
    subdir="Release"
    extensions="*.node"

    if $debug; then
        # Xcode subdir is a bit deeper
        subdir="Debug/Debug"
    fi

    nodeFiles=$(find "${build_dir:?}/$subdir" -type f \( -name $extensions \))

    echo "Would be copied" $nodeFiles

    read -p "<Enter> to confirm, <q> to quit:" -r answer
    if [[ "$answer" =~ ^[qQ]$ ]]; then
        exit 1
    fi

    for file in $nodeFiles; do
        cp -v "$file" "$output"
    done
fi
