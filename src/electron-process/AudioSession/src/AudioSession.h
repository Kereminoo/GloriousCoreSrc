#pragma once


#include "mmdeviceapi.h"


enum class CONTROL_DEVICE : unsigned int
{
    SPEAKER = eRender,
    MICROPHONE = eCapture
};

enum class CONTROL_IO : unsigned int
{
    WRITE,
    READ
};

enum class CONTROL_VALUE : unsigned int
{
    SCALAR,
    MUTE
};
