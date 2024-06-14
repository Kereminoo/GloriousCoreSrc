import { env } from "../../others/env";
import { AudioSessionLib } from "./lib";

export class FuncAudioSession
{
    static #instance: FuncAudioSession;

    AudioSession = AudioSessionLib;

    constructor()
    {
        if(this.AudioSession === undefined)
            throw new Error('AudioSession not init');
    }

    static getInstance()
    {
        if (this.#instance)
        {
            return this.#instance;
        }
        else
        {
            console.log("new FuncAudioSession Class");
            this.#instance = new FuncAudioSession();
            return this.#instance;
        }
    }


    OnTimerGetAudioSession() {
        var AudioSession = this.AudioSession.GetAudioSession();
    }
    Initialization(){
        return this.AudioSession.Initialization();
    }
    GetSystemAudioSession() {
        return this.AudioSession.GetAudioSession();
    }
    GetAudioSession() {
        return this.AudioSession.GetAudioSession();
    }
    SetAudioSession(ObjAudioSession) {
        return this.AudioSession.SetAudioSession(ObjAudioSession);
    }
    SetSpeakerValue(iSpeakerValue) {
        return this.AudioSession.SetSpeakerValue(iSpeakerValue);
    }
    SpeakerUp(iValue) {
        return this.AudioSession.SpeakerUp(iValue);
    }
    SpeakerDown(iValue) {
        return this.AudioSession.SpeakerDown(iValue);
    }
    //region MicrophoneValue
    SetMicrophoneValue(iSpeakerValue) {
        return this.AudioSession.SetMicrophoneValue(iSpeakerValue);
    }
    MicrophoneUp(iValue) {
        return this.AudioSession.MicrophoneUp(iValue);
    }      
    MicrophoneDown(iValue) {
        return this.AudioSession.MicrophoneDown(iValue);
    }  
    //endregion MicrophoneValue  
    
    //region AudioDevice
    SetNextAudioDeviceDefault() {
        return this.AudioSession.SetNextAudioDeviceDefault();
    }
    SetPreviousAudioDeviceDefault() {
        return this.AudioSession.SetPreviousAudioDeviceDefault();
    }
    //endregion AudioDevice

    // TimerAudioSession(ObjTimer) {
    //     if (this.m_TimerGetAudioSession  != undefined) {
    //         clearInterval(this.m_TimerGetAudioSession);
    //     }
    //     if (ObjTimer) {
    //         this.m_TimerGetAudioSession = setInterval(() => this.OnTimerGetAudioSession(), 10000);
    //     }
    // }
}
