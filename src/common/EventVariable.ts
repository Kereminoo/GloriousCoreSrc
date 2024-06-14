'use strict';

export const EventTypes =
{
	  Error : 'Error',
    HotPlug : 'HotPlug',
    ProtocolMessage : 'ProtocolMessage',
    DownloadProgress: 'DownloadProgress',
    UpdateApp : 'UpdateApp',
    UpdateFW : 'UpdateFW',
    ChangeWindowSize: 'ChangeWindowSize',
    ShowWindow : "ShowWindow",
    HIDEP2Data:'HIDEP2Data',
    KeyDataCallback : 'KeyDataCallback',
    QuitApp:"QuitApp",
    RefreshDevice : 'RefreshDevice',
    SwitchProfile : 'SwitchProfile',
    ImportProfile : 'ImportProfile',
    DownloadFileError: "DownloadFileError",
    //Battery
    GetBatteryStats : 'GetBatteryStats',
    SwitchUIProfile: 'SwitchUIProfile',
    SwitchLighting: 'SwitchLighting',
    SwitchMultiColor: 'SwitchMultiColor',

    SwitchSliderVolume: 'SwitchSliderVolume',
    //FWUpdate
    SendFWUPDATE : 'SendFWUPDATE',
    SwitchHotPlug : 'SwitchHotPlug',
    HideApp:'HideApp',
    MaxSize:'MaxSize',
    //Audio Session
    GetAudioSession:'GetAudioSession',
    //Dock
    DockedCharging:'DockedCharging',
    DeleteMacro: 'DeleteMacro',

    // 2.0
    SavedDevice: "SavedDevice",

    // Authentication events
    UserLoggedIn: "UserLogin",
    // valueC
    valueCVisualizationUpdate: "valueCVisualizationUpdate",
} as const;
