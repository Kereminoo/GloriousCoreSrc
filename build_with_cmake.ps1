param([switch]$clean, [switch]$debug, [switch]$copy, [switch]$deps)

$ErrorActionPreference = "Stop"

#function SetupVCPKG {
#    if ($null -eq $env:VCPKG_ROOT)
#    {
#        pushd ..
#        if (!(Test-Path -PathType Container vcpkg]))
#        {
#            git clone https://github.com/Microsoft/vcpkg.git
#            .\vcpkg\bootstrap-vcpkg.bat
#        }
#        $env:VCPKG_ROOT = Resolve-Path "vcpkg"
#        $env:PATH += ";${env:VCPKG_ROOT}"
#        popd
#    }
#
#    if (!(Get-Command "vcpkg" -errorAction SilentlyContinue))
#    {
#        Write-Error "vcpkg is not availible or not in PATH"
#        exit
#    }
#
#    $CMAKE_TOOLCHAIN_FILE = Resolve-Path "${env:VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
#    $toolchain = "--CDCMAKE_TOOLCHAIN_FILE=$CMAKE_TOOLCHAIN_FILE "
#    vcpkg install
#}


if (!(Get-Command "cmake-js" -errorAction SilentlyContinue))
{
    Write-Output "cmake-js not availible. Trying npm install..."
    npm install cmake-js -g
}


$build_dir = "build_cmake_js"
if (!(Test-Path -PathType Container $build_dir))
{
    New-Item -ItemType Directory -Path $build_dir
}
elseif ($clean)
{
    Write-Output "Cleaning up..."
    Remove-Item -Recurse $build_dir/*
}


$env:SKIP_MANUAL_CMAKEJS = 1

if ($debug)
{
    $flag_debug += "-D"
}

# SetupVCPKG

cmake-js build -r electron -v 25.2.0 -O $build_dir $flag_debug $toolchain

if ($copy)
{
    $output = "src/electron-process/renderer-interop/protocol/nodeDriver/lib"
    $subdir = "Release"
    $extensions = @("*.node")
    if ($debug)
    {
        $subdir = "Debug"
        $extensions += "*.pdb"
    }

    $nodeFiles = Get-ChildItem -Path "$build_dir/$subdir" -Recurse -Include $extensions
    Write-Output "Would be copied" $nodeFiles

    # if ((Read-Host "<Enter> to confirm, <q> to quit") -eq "q")
    # {
    #     exit
    # }

    foreach ($file in $nodeFiles)
    {
        Copy-Item -Path $file.FullName -Destination $output -Force -Verbose
    }
}

if ($deps) {
  Remove-Item -Recurse "$build_dir/_deps"
}
