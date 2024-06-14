#ifndef AUDIOSSESSIONMAC_H
#define AUDIOSSESSIONMAC_H

#include <node.h>
#include <string>
#include <vector>
#include <CoreAudio/CoreAudio.h>

namespace AudioSession {

enum SpeakerAction {
    SetValue,
    Increase,
    Decrease
};

void DebugLog(std::string_view const &msg,
              const char *file,
              const char *function,
              int line,
              bool writeToFile);

OSStatus GetDefaultOutputDevice(AudioDeviceID* device);
OSStatus GetCurrentVolume(AudioDeviceID device, Float32* volume);
OSStatus SetVolume(AudioDeviceID device, Float32 volume);
OSStatus ChangeVolume(AudioDeviceID device, Float32 delta);

void AdjustSpeakerVolume(SpeakerAction action, int32_t value);

void Initialization(const v8::FunctionCallbackInfo<v8::Value> &args);
void ShowDebug(const v8::FunctionCallbackInfo<v8::Value> &args);
void SetSpeakerValue(const v8::FunctionCallbackInfo<v8::Value> &args);
void SpeakerUp(const v8::FunctionCallbackInfo<v8::Value> &args);
void SpeakerDown(const v8::FunctionCallbackInfo<v8::Value> &args);
void GetAudioSession(const v8::FunctionCallbackInfo<v8::Value> &args);
void SetAudioSession(const v8::FunctionCallbackInfo<v8::Value> &args);
void SetAudioSessionArray(const v8::FunctionCallbackInfo<v8::Value> &args);

} // namespace AudioSession

#endif // AUDIOSSESSIONMAC_H
