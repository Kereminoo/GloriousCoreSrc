#include <CoreAudio/AudioServerPlugIn.h>
#include <atomic>
#include <iostream>
#include "GloriousAudioDevice.h"


static std::atomic<int> gRefCount(0);

static HRESULT ASPQueryInterface(void *inDriver, REFIID inUUID, LPVOID *outInterface) {
    // code to handle query interface if needed
    return kAudioHardwareNoError;
}

static UInt32 ASPAddRef(void *inDriver) {
    return ++gRefCount;
}

static UInt32 ASPRelease(void *inDriver) {
    return --gRefCount;
}

static OSStatus ASPInitialize(AudioServerPlugInDriverRef inDriver, AudioServerPlugInHostRef inHost) {
    std::cout << "Initializing audio server plugin" << std::endl;

    return kAudioHardwareNoError;
}

static OSStatus ASPCreateDevice(AudioServerPlugInDriverRef inDriver,
                                CFDictionaryRef inDescription,
                                const AudioServerPlugInClientInfo *inClientInfo,
                                AudioObjectID *outDeviceObjectID) {
  OSStatus status = kAudioHardwareNoError;

    try {
        // Validate the parameters
        if (outDeviceObjectID == NULL) {
            return kAudioHardwareBadObjectError;
        }

        // Create the virtual audio device
        GloriousAudioDevice* virtualDevice = new GloriousAudioDevice();

        // Initialize and configure the virtual device
        virtualDevice->initialize(inDescription);

    } catch (std::exception& ex) {
        std::cerr << "Error creating virtual audio device: " << ex.what() << std::endl;
        status = kAudioHardwareUnspecifiedError;
    }

    return status;
}

static OSStatus ASPStartIO(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID) {
    std::cout << "Starting IO" << std::endl;
    // start passing audio data through from the input to the output
    return kAudioHardwareNoError;
}

static OSStatus ASPStopIO(AudioServerPlugInDriverRef inDriver, AudioObjectID inDeviceObjectID, const AudioServerPlugInClientInfo* inClientInfo) {
    std::cout << "Stopping IO" << std::endl;
    // stop handling audio data
    return kAudioHardwareNoError;
}

static AudioServerPlugInDriverInterface gAudioServerPlugInDriverInterface = {
    NULL,
    ASPQueryInterface,
    ASPAddRef,
    ASPRelease,
    ASPInitialize,
    ASPCreateDevice,
    ASPStartIO,
    ASPStopIO,
};

extern "C" AudioServerPlugInDriverInterface* GloriousASPFactoryFunction() {
    return &gAudioServerPlugInDriverInterface;
}
