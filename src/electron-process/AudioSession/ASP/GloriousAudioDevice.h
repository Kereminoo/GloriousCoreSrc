#ifndef GLORIOUSAUDIODEVICE_H
#define GLORIOUSAUDIODEVICE_H

#include <CoreAudio/CoreAudio.h>
#include <atomic>
#include "PerAppDataHandlers.h"

class GloriousAudioDevice {
public:
    GloriousAudioDevice();
    ~GloriousAudioDevice();

    void initialize(CFDictionaryRef inDescription);
    AudioObjectID registerWithSystem();
    OSStatus start();
    OSStatus stop();

private:
    AudioObjectID mDeviceObjectID;
    std::atomic<bool> mIsRunning;
    PerAppDataHandlers mAppAudioDataHandlers;
    AudioUnit mAudioUnit;

    void registerCallback();
    void registerAudioCaptureCallbacks();
    void onAudioDataCaptured(AudioBuffer* audioBuffer, const AudioUnitPropertyID propertyID);
    void handleAudioData(AudioBufferList* ioData, UInt32 inNumberFrames);
};

#endif // GLORIOUSAUDIODEVICE_H
