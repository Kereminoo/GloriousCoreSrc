'use strict';

export const FuncName = {
    ExecFile: 'ExecFile',
    downloadFile: 'downloadFile',
    //Init Device
    InitDevice: 'InitDevice',
    ChangeProfileID: 'ChangeProfileID',
    //Check AppVersion & download
    UpdateApp: 'UpdateApp',
    //upzip AppUpdate File
    DownloadInstallPackage: 'DownloadInstallPackage',
    UpdateFW: 'UpdateFW',
    DownloadFWInstallPackage: 'DownloadFWInstallPackage',
    ChangeWindowSize: 'ChangeWindowSize',
    ShowWindow: 'ShowWindow',
    RunApplication: 'RunApplication',
    ImportProfile: 'ImportProfile',
    QuitApp: 'QuitApp',
    GetBatteryStats: 'GetBatteryStats',
    ReadFWVersion: 'ReadFWVersion',
    HideApp: 'HideApp',
    MaxSize: 'MaxSize',
    //Glorious
    setProfileToDevice: 'setProfileToDevice',
    SetKeyMatrix: 'SetKeyMatrix',
    SetLighting: 'SetLighting',
    SleepTime: 'SleepTime',
    LaunchFWUpdate: 'LaunchFWUpdate',
    DeleteMacro: 'DeleteMacro',
    GetAudioSession: 'GetAudioSession',
    valueCVisualizationToggle: 'SetVisualization',
    ResetDevice: 'ResetDevice',
    ApplyLEDEffect: 'ApplyLEDEffect',
    SetLEDEffect: 'SetLEDEffect',
    GetProfileID: 'GetProfileID',
} as const;
export const FuncType = {
    System : 0x01,
    Mouse : 0x02,
    Keyboard :0x03,
    Device : 0x04,
    valueE : 0x05
} as const;
