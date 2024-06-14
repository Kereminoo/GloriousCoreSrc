#ifndef PERAPPDATAHANDLERS_H
#define PERAPPDATAHANDLERS_H

#include <AudioToolbox/AudioToolbox.h>
#include <vector>

// Forward declaration
class PerAppDataHandler;

class PerAppDataHandlers {
public:
    PerAppDataHandlers();
    void initialize();
    PerAppDataHandler* getHandlerForApp(const std::string& appName);


private:
    std::vector<PerAppDataHandler*> mHandlers;
};

class PerAppDataHandler {
public:
    PerAppDataHandler();
    ~PerAppDataHandler();
    void setVolume(float volume);
    void processAudioData(AudioBuffer *audioBuffer);

private:
    float mVolume;
};

#endif // PERAPPDATAHANDLERS_H
