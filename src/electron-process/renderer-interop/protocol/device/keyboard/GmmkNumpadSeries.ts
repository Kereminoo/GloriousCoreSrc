// const env = require('../../../others/env');
// var keyboard = require('./keyboard');
// var EventTypes = require('../../../others/EventVariable').EventTypes;
// var SupportData = require('../../../others/SupportData');

import { EventTypes } from '../../../../../common/EventVariable';
import { GMMKLocation } from '../../../others/GMMKLocation';
import { SupportData } from '../../../../../common/SupportData';
import { env } from '../../../others/env';
import { FuncAudioSession } from '../../nodeDriver/AudioSession';
import { Keyboard } from './keyboard';
import { GetValidURL } from '../../../../../common/utils';

// var GMMKLocation = require('../../../others/GMMKLocation').GMMKLocation;

// var AppObj = require("../../../dbapi/AppDB");

// var fs = require('fs');

export class GmmkNumpadSeries extends Keyboard {
    static #instance: GmmkNumpadSeries;

    AudioSession: FuncAudioSession;
    CheckSliderClose: boolean;

    arrLEDType: any[];

    FrontendValue1: any;
    FrontendValue2: any;

    repeateTest: any;
    TargetVolume: any;

    constructor(hid, AudioSession) {
        env.log('GmmkNumpadSeries', 'GmmkNumpadSeries class', 'begin');
        super();

        this.hid = hid;
        this.AudioSession = AudioSession;

        this.arrLEDType = [
            8, //'LEDOFF',
            0, //'GloriousMode',
            1, //'Wave#1',
            3, //'Wave#2',
            4, //'SpiralingWave',
            5, //'AcidMode',
            2, //'Breathing',
            6, //'NormallyOn',
            7, //'RippleGraff',
            9, //'PassWithoutTrace',
            10, //'FastRunWithoutTrace',
            11, //'Matrix2',
            12, //'Matrix3',
            13, //'Rainbow',
            14, //'HeartbeatSensor',
            15, //'DigitTimes',
            16, //'Kamehameha',
            17, //'Pingpong',
            18, //'Surmount',
        ];
        //Initialize NodeDriver
        //this.AudioSession = require(`../../nodeDriver/${env.arch}/AudioSession.node`);
        //AudioSession Test

        //this.AudioSession.TimerAudioSession(1);

        // var AudioSession = this.AudioSession.GetAudioSession();
        // for (var index = 0; index < AudioSession.length; index++) {
        //     if (AudioSession[index].percent != undefined) {
        //         AudioSession[index].percent = index*10;
        //     }
        // }
        // this.AudioSession.SetAudioSession(AudioSession);

        this.CheckSliderClose = false;
    }

    static getInstance(hid, AudioSession) {
        if (this.#instance) {
            env.log('GmmkNumpadSeries', 'getInstance', `Get exist GmmkNumpadSeries() INSTANCE`);
            return this.#instance;
        } else {
            env.log('GmmkNumpadSeries', 'getInstance', `New GmmkNumpadSeries() INSTANCE`);
            this.#instance = new GmmkNumpadSeries(hid, AudioSession);

            return this.#instance;
        }
    }

    GetAudioSession(dev, Obj, callback) {
        var arrAudioSession = this.AudioSession.GetAudioSession();
        if (arrAudioSession == null) {
            callback(undefined);
            return;
        }

        var FrontSession: any[] = [];
        //------------------Add Default Sound Output---------------------
        var AudioSession: any = {
            filepath: 'Windows Default Sound Output',
            filename: 'Windows Default Sound Output',
            percent: 0,
            processid: 1,
        };
        FrontSession.push(AudioSession);
        //---------------------------------------------------------------
        for (let index = 0; index < arrAudioSession.length; index++) {
            var FileDescription = arrAudioSession[index].FileDescription;
            var Filepath = arrAudioSession[index].filepath;
            if (arrAudioSession[index].filepath == 'System Sounds') {
                //System Sound
                FileDescription = arrAudioSession[index].filepath;
            }
            var AudioSession;
            if (FileDescription != '') {
                AudioSession = {
                    filepath: FileDescription,
                    filename: FileDescription,
                    percent: arrAudioSession[index].percent,
                    processid: arrAudioSession[index].processid,
                };
                FrontSession.push(AudioSession);
            } else if (FileDescription == '' && Filepath != '') {
                //var filepath = arrAudioSession[index].filepath;
                var filename = arrAudioSession[index].filepath;
                if (arrAudioSession[index].filepath.indexOf('\\') != -1) {
                    //Path is exist
                    //filepath = arrAudioSession[index].filepath.replace(/\\/g, "\\\\");
                    filename = arrAudioSession[index].filepath.replace(/^.*[\\\/]/, '');
                    var extIndex = filename.lastIndexOf('.');
                    if (extIndex != -1) {
                        filename = filename.substr(0, extIndex);
                    }
                }
                AudioSession = {
                    filepath: filename,
                    filename: filename,
                    percent: arrAudioSession[index].percent,
                    processid: arrAudioSession[index].processid,
                };
                FrontSession.push(AudioSession);
            } else if (FileDescription == '' && Filepath == '') {
                //env.log('GmmkNumpadSeries-GetAudioSession','Filename invalid-Processid:', arrAudioSession[index].processid);
            }
        }
        //-------------------compare repeat filename------------------------------
        for (let index = 0; index < FrontSession.length; index++) {
            var iRepratCount = 0;
            for (let index2 = 0; index2 < FrontSession.length; index2++) {
                if (FrontSession[index].filename == FrontSession[index2].filename) {
                    iRepratCount++;
                    if (iRepratCount >= 2) {
                        FrontSession[index2].filename += iRepratCount.toString();
                    }
                }
            }
            if (iRepratCount >= 2) {
                FrontSession[index].filename += '1';
            }
        }
        //-------------------compare repeat filename------------------------------
        callback(FrontSession);
    }
    /**
     * Init Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    InitialDevice(dev, Obj, callback) {
        env.log('GmmkNumpadSeries', 'initDevice', 'Begin');
        dev.bwaitForPair = false;
        dev.m_bSetHWDevice = false;

        dev.m_bAudioControl = false;

        dev.DataNumber = 0;
        dev.awaitHidWrite = false;
        dev.awaittime = 0;

        dev.BTErrorcount = 0;
        //-------Initial Key/LEDCode Matrix-------
        var keyBoardList = GMMKLocation.keyBoardList[dev.BaseInfo.SN];

        if (keyBoardList != undefined) {
            dev.Matrix_KEYCode_GMMK = keyBoardList.Matrix_KEYCode;
            dev.Matrix_LEDCode_GMMK = keyBoardList.Matrix_LEDCode;
            dev.Matrix_KEYButtons_GMMK = keyBoardList.Matrix_KEYButtons;
            dev.Buttoninfo_Default = keyBoardList.Buttoninfo_Default;
        } else {
            // dev.Matrix_LEDCode_GMMK = this.Matrix_LEDCode_GMMK;
            // dev.Matrix_KEYButtons_GMMK = this.Matrix_KEYButtons_GMMK;
            // dev.Buttoninfo_Default = this.Buttoninfo_Default;
            env.log('GmmkNumpadSeries', dev.BaseInfo.devicename, 'GMMKLocation is not Exists');
            callback(0);
        }

        this.FrontendValue1 = 0;
        this.FrontendValue2 = 0;

        //-------Initial Key/LEDCode Matrix-------
        dev.BaseInfo.version_Wired = '0021';
        dev.BaseInfo.version_Wireless = '0001';

        this.nedbObj.getAppSetting().then((doc) => {
            if (doc![0].sleep != undefined) {
                dev.sleep = doc![0].sleep;
            }
            if (doc![0].sleeptime != undefined) {
                dev.sleeptime = doc![0].sleeptime;
            }
            //--------------------------------------
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bootloader') {
                //Bootloader Mode
                dev.BaseInfo.version_Wired = '0001';
                dev.BaseInfo.version_Wireless = '0001';
                callback(0);
            } else if (env.BuiltType == 0) {
                //this.ReadFWVersion(dev,0,(ObjFWVersion) => {
                this.SetProfileDataFromDB(dev, 0, () => {
                    callback(0);
                });
                //});
            } else {
                callback(0);
            }
            this.OnTimerGetAudioSession(dev);
        });
    }
    /**
     * Set Device Data from DB to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetProfileDataFromDB(dev, Obj, callback) {
        if (env.BuiltType == 1) {
            callback();
            return;
        }
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            var iProfile = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
            var appProfileLayers = dev.deviceData.profileLayers;
            //-----------------Set Polling Rate And Sleep time of all layers----------------------------
            this.StartHIDWrite(dev, () => {
                var ObjPollRateAndSleep = {
                    iProfile: iProfile,
                    iLayerIndex: iLayerIndex,
                    appProfileLayers: appProfileLayers,
                };
                this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
                    this.EndHIDWrite(dev, () => {
                        setTimeout(() => {
                            callback('SetProfileDataFromDB Done');
                        }, 100);
                    });
                });
            });
            //-----------------Set Polling Rate And Sleep time of all layers----------------------------
        } else
            this.nedbObj.getLayout().then((data) => {
                //Get Perkey Dat
                const SetProfileData = (iProfile, iLayerIndex) => {
                    var layoutDBdata = JSON.parse(JSON.stringify(data![0].AllData));
                    var ProfileData = dev.deviceData.profile[iProfile];

                    if (iProfile < 3 && iLayerIndex < 3 && ProfileData != undefined) {
                        var appProfileLayers = dev.deviceData.profileLayers;
                        //KeyAssignData
                        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                        var ObjKeyAssign = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            KeyAssignData: KeyAssignData,
                        };
                        //LightingData
                        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
                        if (LightingData.sensitivity == undefined) {
                            var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                            var Temp_BtnList = KeyAssignData[5]; //"ROTARY ENCODER"
                            LightingData.sensitivity = Temp_BtnList.sensitivity;
                        }

                        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;

                        var ObjLighting = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            LightingData: LightingData,
                            LightingPerKeyData: LightingPerKeyData,
                            Perkeylist: layoutDBdata,
                        };
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            this.SetLEDEffect(dev, ObjLighting, (param2) => {
                                SetProfileData(iProfile, iLayerIndex + 1);
                            });
                        });
                    } else if (iProfile < 3 && ProfileData != undefined) {
                        SetProfileData(iProfile + 1, 0);
                    } else {
                        //Finish SetProfileData Loop
                        this.nedbObj.getMacro().then((doc) => {
                            var MacroData = doc;
                            var ObjMacroData = { MacroData: MacroData };
                            this.SetMacroFunction(dev, ObjMacroData, (param1) => {
                                this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                                    var iProfile = dev.deviceData.profileindex;
                                    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                                    var appProfileLayers = dev.deviceData.profileLayers;

                                    //-----------------Set Polling Rate And Sleep time of all layers----------------------------
                                    var ObjPollRateAndSleep = {
                                        iProfile: iProfile,
                                        iLayerIndex: iLayerIndex,
                                        appProfileLayers: appProfileLayers,
                                    };
                                    this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
                                        this.CheckSliderfunction(dev);
                                        callback('SetProfileDataFromDB Done');
                                    });
                                    //-----------------Set Polling Rate And Sleep time of all layers----------------------------
                                });
                            });
                        });
                    }
                };
                SetProfileData(0, 0); //Initialize SetProfileData Loop
            });
    }

    /**
     * Set Device Data from Import Profile to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetImportProfileData(dev, Obj, callback) {
        if (env.BuiltType == 1) {
            callback();
            return;
        }
        var iProfile = dev.deviceData.profileindex;
        const SetLayoutData = (iLayerIndex) => {
            if (iLayerIndex < 3) {
                var appProfileLayers = dev.deviceData.profileLayers;
                //KeyAssignData
                var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                var ObjKeyAssign = {
                    iProfile: iProfile,
                    iLayerIndex: iLayerIndex,
                    KeyAssignData: KeyAssignData,
                };
                //LightingData
                var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;

                LightingData.sensitivity = appProfileLayers[iProfile][iLayerIndex].sensitivity;

                var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;

                var Perkeylist = Obj.Perkeylist;
                var ObjLighting = {
                    iProfile: iProfile,
                    iLayerIndex: iLayerIndex,
                    LightingData: LightingData,
                    LightingPerKeyData: LightingPerKeyData,
                    Perkeylist: Perkeylist,
                };
                this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                    this.SetLEDEffect(dev, ObjLighting, (param2) => {
                        SetLayoutData(iLayerIndex + 1);
                    });
                });
            } else {
                var Macrolist: any[] = Obj.Macrolist;
                var MacroData: any[] = [];
                for (let index = 0; index < Macrolist.length; index++) {
                    if (parseInt(Macrolist[index].m_Identifier) > 0) {
                        MacroData.push(Macrolist[index]);
                    }
                }
                var ObjMacroData = { MacroData: MacroData };
                this.SetMacroFunction(dev, ObjMacroData, (param1) => {
                    this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                        var iProfile = dev.deviceData.profileindex;
                        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                        var appProfileLayers = dev.deviceData.profileLayers;

                        var ObjPollRateAndSleep = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            appProfileLayers: appProfileLayers,
                        };
                        this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
                            callback('SetProfileDataFromDB Done');
                        });
                    });
                });
            }
        };
        SetLayoutData(0);
    }
    OnTimerEmitFrontend(dev) {
        try {
            if (this.FrontendValue1 != this.FrontendValue2) {
                this.FrontendValue2 = JSON.parse(JSON.stringify(this.FrontendValue1));

                this.LaunchSliderFunction(dev, this.FrontendValue2);
                var Obj2 = {
                    Func: EventTypes.SwitchSliderVolume,
                    SN: dev.BaseInfo.SN,
                    Param: { Value: this.FrontendValue2 },
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
                clearInterval(dev.m_TimerEmitFrontend);
                dev.m_TimerEmitFrontend = undefined;
            } else {
                clearInterval(dev.m_TimerEmitFrontend);
                dev.m_TimerEmitFrontend = undefined;
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'TimerEmitFrontend', `Error:${e}`);
        }
    }
    OnTimerSoundControlFlag(dev) {
        try {
            clearInterval(dev.m_TimerSoundControlFlag);
            dev.m_TimerSoundControlFlag = undefined;
            dev.m_bAudioControl = false;
        } catch (e) {
            env.log('GmmkNumpadSeries', 'OnTimerSoundControlFlag', `Error:${e}`);
        }
    }
    HIDEP2Data(dev, ObjData) {
        if (ObjData[0] == 0x04 && ObjData[1] == 0xf7 && ObjData[2] >= 0x80) {
            //EP2 Launch Program-Press
            //-------------overlay by EPTempData---------------
            var EPTempData = this.hid!.GetEPTempData(dev.BaseInfo.DeviceId);
            if (EPTempData[0] == 0x04 && EPTempData[1] == 0xf7 && EPTempData[2] >= 0x80) {
                //when EPTempData is launch,overlay the ObjData
                for (var i = 0; i < ObjData.length; i++) {
                    ObjData[i] = EPTempData[i];
                }
                env.log(dev.BaseInfo.devicename, 'overlayEPTempData-Launch:', JSON.stringify(ObjData));
            }
            //-------------overlay by EPTempData---------------
            var iKeyColumn = ObjData[2] & 0x7f; //KEYCOLUMN-AND Binary 0111 1111
            var iKeyRaw = ObjData[3];
            var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw]);
            var bSwitch = true;
            if (ObjData[4] == 0xff) {
                bSwitch = false;
            }

            env.log(
                'HIDEP2Data-Launch Program:',
                'StringKey:',
                JSON.stringify(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw]),
            );
            this.LaunchProgram(dev, iKey, bSwitch);
        }
        //await for BLE Writedata
        else if (ObjData[0] == 0x04 && ObjData[1] == 0xfc) {
            // if(fs.existsSync(env.APPDATA + "\\GSPYTEST.TEST")) {
            //     env.log(dev.BaseInfo.devicename,'EP2Array:',JSON.stringify(ObjData));
            // };
            // setTimeout(() => {
            dev.awaitHidWrite = false;
            // },20);
        }
        //
        else if (ObjData[0] == 0x04 && ObjData[1] == 0x8a) {
            //Callback FW Version
            //-----------------------------------
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode

                var ObjBattery = {
                    SN: dev.BaseInfo.SN,
                    Status: 0,
                    Battery: ObjData[2],
                    Charging: ObjData[3],
                };
                //-----------emit-------------------
                var Obj2: any = {
                    Func: EventTypes.GetBatteryStats,
                    SN: dev.BaseInfo.SN,
                    Param: ObjBattery,
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);

                //-------------FWVersion----------------
                if (ObjData[4] != 0 || ObjData[5] != 0) {
                    var FWHex = ObjData[5] * 256 + ObjData[4];
                    var FWVersion = parseInt(FWHex.toString(16), 10);
                    var verRev = FWVersion.toString(); //Version byte Reversed
                    var strVertion = verRev.padStart(4, '0');
                    dev.BaseInfo.version_Wired = strVertion;
                }
                //-------------FWVersion----------------
            }
        }
        //
        else if (ObjData[0] == 0x04 && ObjData[1] == 0xf8 && ObjData[2] == 0x32) {
            //Volume Bar Value
            var iValue: number = ObjData[4]; //0~100(0x00~0x64)
            this.FrontendValue1 = iValue;
            //PlanA
            if (dev.m_TimerEmitFrontend == undefined) {
                dev.m_TimerEmitFrontend = setInterval(() => this.OnTimerEmitFrontend(dev), 40);
            }
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xfa) {
            //EP2 KNOB Volume With Sound Control
            //if (this.TargetVolume != undefined) {
            var bUp = false;
            var iValue = 2;
            if (ObjData[3] == 0xff) {
                bUp = false;
                iValue = (0x100 - ObjData[2]) * 2;
            } else {
                bUp = true;
                iValue = ObjData[2] * 2;
            }
            this.LaunchKnobFunction(dev, bUp, iValue);

            // dev.m_bAudioControl = true;
            // if (dev.m_TimerSoundControlFlag == undefined) {
            //     dev.m_TimerSoundControlFlag = setInterval(() => this.OnTimerSoundControlFlag(dev), 2000);
            // }
            //}
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xf1 && ObjData[8] != 0x01) {
            //EP2 Switch Profile
            var iProfile = ObjData[2] - 1;
            var iLayerIndex = ObjData[3] - 1;
            var ObjProfileIndex = { Profile: iProfile, LayerIndex: iLayerIndex, SN: dev.BaseInfo.SN };
            env.log('GmmkNumpadSeries', 'HIDEP2Data-SwitchProfile', JSON.stringify(ObjProfileIndex));
            //---------------Update dev ProfileData------------------
            dev.deviceData.profileindex = iProfile;
            dev.deviceData.profileLayerIndex[iProfile] = iLayerIndex;
            this.CheckSliderfunction(dev);
            //---------------Send ProfileData Into UI----------------
            var Obj2: any = {
                Func: EventTypes.SwitchUIProfile,
                SN: dev.BaseInfo.SN,
                Param: ObjProfileIndex,
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            //----------------Set ProfileData to DB-------------------
            this.setProfileToDevice(dev, (paramDB) => {
                // Save DeviceData into Database
            });
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xf2) {
            //EP2 Switch Effect
            if (
                ObjData[3] == 0x01 &&
                ObjData[4] == 0x12 &&
                ObjData[5] == 0x14 &&
                ObjData[6] == 0x14 &&
                ObjData[7] == 0x01
            ) {
                //Hardware Reset Default
            }
            var iProfile = ObjData[2] - 1;
            var iLayerIndex = ObjData[3] - 1;
            var iEffect = this.arrLEDType[ObjData[4]]; //Turn FW_Effect Into UI_Effect
            var iSpeed = (ObjData[5] * 100) / 20;
            var iBright = (ObjData[6] * 100) / 20;
            var ObjLighting: any = {
                Profile: iProfile,
                LayerIndex: iLayerIndex,
                Effect: iEffect,
                Speed: iSpeed,
                Bright: iBright,
                SN: dev.BaseInfo.SN,
            };
            var Obj2: any = {
                Func: EventTypes.SwitchLighting,
                SN: dev.BaseInfo.SN,
                Param: ObjLighting,
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xf9) {
            //EP2 Multicolor Switch
            var iEffect = this.arrLEDType[ObjData[2]]; //Turn FW_Effect Into UI_Effect
            var bMultiColor = ObjData[3] == 1 ? true : false;
            var iProfileindex = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfileindex] as number;
            var LightingData = JSON.parse(
                JSON.stringify(dev.deviceData.profileLayers[iProfileindex][iLayerIndex].light_PRESETS_Data),
            );
            // LightingData.Multicolor = bMultiColor;

            if (iEffect == LightingData.value) {
                LightingData.Multicolor = bMultiColor;
                //----------Set LEDDATA to DB-----------
                var ObjLighting: any = { Effect: LightingData, SN: dev.BaseInfo.SN };
                var Obj2: any = {
                    Func: EventTypes.SwitchMultiColor,
                    SN: dev.BaseInfo.SN,
                    Param: ObjLighting,
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
                //----------Set LEDDATA to DB-----------
                this.setProfileToDevice(dev, (paramDB) => {
                    // Save DeviceData into Database
                });
            }
        }

        if (ObjData[0] == 0x04 && (ObjData[1] == 0xf8 || ObjData[1] == 0xf7) && ObjData[2] >= 0x80) {
            //EP2 Input-Press
            var iKeyColumn = ObjData[2] & 0x7f; //KEYCOLUMN-AND Binary 0111
            var iKeyRaw = ObjData[3];
            var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw]);
            //-----------emit-------------------
            var Obj2: any = { Func: 'SendKeynumber', SN: dev.BaseInfo.SN, Param: iKey };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
    }
    /**
     * ControlTargetVolume-Use Slider's value to adjust
     * @param {*} bUp
     */
    ControlTargetVolume(ivalue) {
        if (this.TargetVolume.processid == 1) {
            //Windows Default Sound Output

            this.AudioSession.SetSpeakerValue(ivalue);
        } else {
            this.TargetVolume.percent = ivalue;
            var AudioSession = this.AudioSession.SetAudioSession(this.TargetVolume);
        }
    }
    /**
     * Launch Program
     * @param {*} dev
     * @param {*} iKey
     */
    LaunchProgram(dev, iKey, bSwitch) {
        var iProfile = dev.deviceData.profileindex;
        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
        var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey]; //Button

        env.log(
            'GmmkNumpad-LaunchProgram',
            'KeyAssignData:' + JSON.stringify(KeyAssignData),
            'iKey:' + JSON.stringify(iKey),
        );
        switch (KeyAssignData.recordBindCodeType) {
            case 'LaunchProgram': //LaunchProgram Function000
                var csProgram = KeyAssignData.ApplicationPath;
                if (csProgram != '') {
                    this.RunApplication(csProgram);
                }
                break;
            case 'LaunchWebsite': //LaunchWebsite Function
                var csProgram = KeyAssignData.WebsitePath;
                if (csProgram != null && csProgram.trim() != '') {
                    this.RunWebSite(GetValidURL(csProgram));
                }
                break;
            case 'SOUND CONTROL': //SOUND CONTROL in Function
                //env.log('GmmkNumpadSeries','SOUND CONTROL-iKey:',JSON.stringify(iKey));
                if (bSwitch) {
                    //bSwitch is true,Enter Sound Control mode

                    this.TargetVolume = KeyAssignData.d_SoundVolume.bindTarget;
                    this.CheckSliderClose = true;
                    if (this.TargetVolume.filename == 'default') {
                        //Poka-yoke(Mistake-proofing)
                        this.TargetVolume.filename = 'Windows Default Sound Output';
                    }
                    for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
                        const AudioSession = dev.deviceData.AudioSession[i];
                        if (this.TargetVolume.filename == AudioSession.filename) {
                            this.TargetVolume = AudioSession;
                            break;
                        }
                    }
                    this.TargetVolume.KeyNumber = iKey;
                } else {
                    //bSwitch is false,Escape the Sound Control mode
                    if (this.TargetVolume != undefined) {
                        delete this.TargetVolume;
                        this.CheckSliderfunction(dev);
                    }
                }
                break;

            //--------------------------------------
            default:
                break;
        }
    }

    CheckSliderfunction(dev) {
        var iProfile = dev.deviceData.profileindex;
        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
        var iKey = 13; //defaultValue:"SLIDER"
        var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey]; //Button

        if (
            AssignData.recordBindCodeType == 'SOUND CONTROL' &&
            AssignData.recordBindCodeName != 'Windows Default Sound Output'
        ) {
            this.CheckSliderClose = true;
        } else {
            this.CheckSliderClose = false;
        }
    }

    /**
     * Launch Side Slider Function
     * @param {*} dev
     * @param {*} iVolume
     */
    LaunchKnobFunction(dev, bUp, iValue) {
        //---------------------------
        var iKey = 5; //defaultValue:"SLIDER"
        var iProfile = dev.deviceData.profileindex;
        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
        var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey]; //Button
        // switch (AssignData.recordBindCodeType) {
        //     case "SOUND CONTROL"://SOUND CONTROL in Function
        var SoundVolume = AssignData.d_SoundVolume.bindTarget;
        if (SoundVolume.filename == 'Windows Default Sound Output') {
            //Poka-yoke(Mistake-proofing)
            if (bUp) {
                //Volume Up
                this.AudioSession.SpeakerUp(iValue);
            } else {
                //Volume Down
                this.AudioSession.SpeakerDown(iValue);
            }
            //break;
        } else {
            //Compare And Use Updated AudioSession
            for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
                const AudioSession = dev.deviceData.AudioSession[i];
                if (SoundVolume.filename == AudioSession.filename) {
                    var SliderSoundVolume = AudioSession;
                    if (SliderSoundVolume.percent >= 100 && bUp) {
                        //Volume Up
                        SliderSoundVolume.percent = 100;
                    } else if (bUp) {
                        //Volume Up
                        SliderSoundVolume.percent += iValue;
                    } else if (SliderSoundVolume.percent <= 0 && !bUp) {
                        //Volume Down
                        SliderSoundVolume.percent = 0;
                    } else if (!bUp) {
                        //Volume Down
                        SliderSoundVolume.percent -= iValue;
                    }
                    this.SwitchAudioSession(SliderSoundVolume);
                    break;
                }
            }
        }
        //     break;
        //     case "Disable"://Disable Function
        //     break;
        //     // default:
        //     //     this.AudioSession.SetSpeakerValue(iVolume);
        //     break;
        // }
        //---------------------------
    }
    /**
     * Confirm Value is Close Function
     * @param {*} dev
     * @param {*} iVolume
     */
    ConfirmValueisClose(srcValue, dstValue) {
        var bResult = false;
        if (Math.abs(srcValue - dstValue) < 5) {
            bResult = true;
        }
        return bResult;
    }
    /**
     * Launch Side Slider Function
     * @param {*} dev
     * @param {*} iVolume
     */
    LaunchSliderFunction(dev, iVolume) {
        if (this.CheckSliderClose && this.TargetVolume != undefined) {
            if (this.ConfirmValueisClose(this.TargetVolume.percent, iVolume)) {
                this.CheckSliderClose = false;
                this.ControlTargetVolume(iVolume);
            }
        } else if (this.TargetVolume != undefined) {
            this.ControlTargetVolume(iVolume);
        } else if (this.CheckSliderClose) {
            var iKey = 13; //defaultValue:"SLIDER"
            var iProfile = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
            var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey]; //Button
            if (AssignData.recordBindCodeType == 'SOUND CONTROL') {
                var SoundVolume = AssignData.d_SoundVolume.bindTarget;

                for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
                    const AudioSession = dev.deviceData.AudioSession[i];
                    if (SoundVolume.filename == AudioSession.filename) {
                        if (this.ConfirmValueisClose(AudioSession.percent, iVolume)) {
                            this.CheckSliderClose = false;
                        }
                        break;
                    }
                }
            }
        } else {
            //---------------------------
            var iKey = 13; //defaultValue:"SLIDER"
            var iProfile = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
            var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey]; //Button
            switch (AssignData.recordBindCodeType) {
                case 'SOUND CONTROL': //SOUND CONTROL in Function
                    var SoundVolume = AssignData.d_SoundVolume.bindTarget;
                    //SoundVolume.percent = iVolume;
                    //Compare And Use Updated AudioSession
                    for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
                        const AudioSession = dev.deviceData.AudioSession[i];
                        if (SoundVolume.filename == AudioSession.filename) {
                            var SliderSoundVolume = AudioSession;
                            SliderSoundVolume.percent = iVolume;
                            this.SwitchAudioSession(SliderSoundVolume);
                            break;
                        }
                    }
                    break;
                case 'Disable': //Disable Function
                    break;
                default:
                    this.AudioSession.SetSpeakerValue(iVolume);
                    break;
            }
            //---------------------------
        }
    }

    /**
     * Switch Profile
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    ChangeProfileID(dev, Obj, callback) {
        env.log(dev.BaseInfo.devicename, 'ChangeProfileID', `${Obj}`);
        try {
            if (env.BuiltType == 1) {
                callback('ChangeProfileID Done');
                return;
            } else if (dev.m_bSetHWDevice) {
                env.log(dev.BaseInfo.devicename, 'ChangeProfileID', 'Device Has Setting,Stop Forward');
                callback(false);
                return;
            }

            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                dev.m_bSetHWDevice = true;
                //-----------------------------------
                this.StartHIDWrite(dev, () => {
                    this.ChangeProfileIDtodevice(dev, Obj, () => {
                        this.EndHIDWrite(dev, () => {
                            dev.m_bSetHWDevice = false;
                            this.setProfileToDevice(dev, () => {
                                callback('ChangeProfileID Done');
                            });
                        });
                    });
                });
            } else {
                this.ChangeProfileIDtodevice(dev, Obj, () => {
                    this.setProfileToDevice(dev, () => {
                        callback('ChangeProfileID Done');
                    });
                });
            }
        } catch (e) {
            env.log('ModelOSeries', 'ChangeProfileID', `Error:${e}`);
            callback();
        }
    }
    ChangeProfileIDtodevice(dev, Obj, callback) {
        env.log(dev.BaseInfo.devicename, 'ChangeProfileID', `${Obj}`);
        try {
            if (env.BuiltType == 1) {
                callback('ChangeProfileID Done');
                return;
            }
            var Data = Buffer.alloc(264);
            dev.deviceData.profileindex = Obj;
            var iLayerIndex = dev.deviceData.profileLayerIndex[Obj];

            this.CheckSliderfunction(dev);
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[0] = 0x07;
                Data[1] = 0x01; //Set One time,Byte[1] is 0xff>0x01
                Data[2] = 0x01;
                Data[3] = Obj + 1;
                Data[4] = iLayerIndex + 1;
                //-----------------------------------
                this.SetHidWriteAwait(dev, Data).then(() => {
                    this.setProfileToDevice(dev, () => {
                        callback('ChangeProfileID Done');
                    });
                });
            } else {
                Data[0] = 0x07;
                Data[1] = 0x01;
                Data[2] = Obj + 1;
                Data[3] = iLayerIndex + 1;
                //-----------------------------------
                this.SetFeatureReport(dev, Data, 50).then(() => {
                    this.setProfileToDevice(dev, () => {
                        callback('ChangeProfileID Done');
                    });
                });
            }
        } catch (e) {
            env.log('ModelOSeries', 'SetKeyMatrix', `Error:${e}`);
            callback();
        }
    }

    /**
     * Set Polling Rate to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetPollRateAndSleeptoDevice(dev, Obj, callback) {
        //----Distinguish whether it is wired or wireless----
        var iShift = 0;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            iShift = 1;
        }
        //-----------Set Data into device----------------
        var Data = Buffer.alloc(264);
        var arrPollingrate = [1000, 500, 250, 125];
        Data[0] = 0x07;
        Data[iShift + 1] = 0x08;
        Data[iShift + 8] = arrPollingrate.indexOf(Obj.iPollingrate);
        Data[iShift + 9] = 1; //EP3_Flag
        Data[iShift + 10] = 0; //LED NO Change: 0 Dis/ 1 En

        for (var i = 0; i < Obj.DataSleep.length; i++) {
            Data[iShift + 11 + i] = Obj.DataSleep[i]; //LED Sleeptime 1~15, 0xff: no sleep
        }
        //----Set Data into device wired or wireless----
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            Data[1] = 0x01; //Set One time,Byte[1] is 0xff>0x01
            this.SetHidWriteAwait(dev, Data).then(() => {
                callback();
            });
        } else {
            this.SetFeatureReport(dev, Data, 150).then(() => {
                callback();
            });
        }
    }

    /**
     * Read FW Version from device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    ReadFWVersion(dev, Obj, callback) {
        try {
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                this.GetDeviceBatteryStats(dev, Obj, (FWData) => {
                    setTimeout(() => {
                        callback(dev.BaseInfo.version_Wired);
                    }, 200);
                });
            } else {
                var rtnData = this.hid!.GetFWVersion(dev.BaseInfo.DeviceId);
                var CurFWVersion = parseInt(rtnData.toString(16), 10);
                var verRev = CurFWVersion.toString(); //Version byte Reversed
                var strVertion = verRev.padStart(4, '0');
                this.GetDeviceBatteryStats(dev, Obj, (FWData) => {
                    setTimeout(() => {
                        if (parseInt(FWData.FWVersion) > 0) {
                            dev.BaseInfo.version_Wired = FWData.FWVersion;
                            strVertion = FWData.FWVersion;
                        } else {
                            //When Get FwData was invalid, then Use Endpoint Firmware version
                            dev.BaseInfo.version_Wired = strVertion;
                        }
                        callback(strVertion);
                    }, 200);
                });
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'ReadFWVersion', `Error:${e}`);
            callback(false);
        }
    }
    //---------------test--------------------
    initializeUart(dev, Obj, callback) {
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode

            var DataBTHid = Buffer.alloc(21);
            DataBTHid[0] = 0x07;
            DataBTHid[1] = 0xff;
            DataBTHid[2] = 0xff;
            DataBTHid[3] = 0xff;
            DataBTHid[4] = 0xff;
            DataBTHid[5] = 0xff;

            this.SetHidWrite(dev, DataBTHid, 800).then(() => {});
        }

        callback('');
    }
    setKeyMatrixTest(dev, Obj, callback) {
        if (!this.repeateTest || this.repeateTest == undefined) {
            this.repeateTest = true;
        } else {
            this.repeateTest = false;
            callback('setKeyMatrixTest Done');
            return;
        }

        const Test = (iTest) => {
            if (iTest != -1) {
                this.SetKeyMatrix(dev, Obj, (paramDB) => {
                    setTimeout(() => {
                        if (!this.repeateTest) {
                            Test(-1);
                        } else {
                            Test(iTest + 1);
                        }
                    }, 3000);
                });
            } else {
                this.repeateTest = false;
            }
        };
        Test(0);
        callback('setKeyMatrixTest Done');
    }

    //---------------test--------------------
    /**
     * Set key matrix to device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetKeyMatrix(dev, Obj, callback) {
        env.log('GmmkNumpadSeries', 'SetKeyMatrix', 'Begin');
        if (dev.m_bSetHWDevice) {
            env.log(dev.BaseInfo.devicename, 'SetKeyMatrix', 'Device Has Setting,Stop Forward');
            callback(false);
            return;
        }

        dev.deviceData.profile = Obj.KeyBoardManager.KeyBoardArray; //Assign profileData From Obj
        dev.deviceData.profileLayers = Obj.KeyBoardManager.profileLayers; //Assign profileData From Obj
        dev.deviceData.profileindex = Obj.KeyBoardManager.profileindex;
        dev.deviceData.profileLayerIndex = Obj.KeyBoardManager.profileLayerIndex;
        dev.deviceData.sideLightSwitch = Obj.KeyBoardManager.sideLightSwitch;
        var iProfile = Obj.KeyBoardManager.profileindex; //Assign profileindex From deviceData
        var appProfileLayers = Obj.KeyBoardManager.profileLayers;
        var Temp3 = Obj.KeyBoardManager.layerMaxNumber;
        //dev.deviceData.profile = KeyBoardManager.profileData;//Assign profileData From Obj
        //var iProfile = dev.deviceData.profileindex;//Assign profileindex From deviceData
        var switchUIflag = Obj.switchUIflag;
        if (env.BuiltType == 1) {
            this.setProfileToDevice(dev, (paramDB) => {
                //Save DeviceData into Database
                callback('SetKeyMatrix Done');
            });
            return;
        }
        try {
            dev.m_bSetHWDevice = true;
            switch (true) {
                case switchUIflag.keybindingflag: //Set Device keybinding(Key Assignment)
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                        var ObjKeyAssign = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            KeyAssignData: KeyAssignData,
                        };
                        var ObjMacroData = { MacroData: MacroData };
                        dev.DataNumber = 0;

                        this.StartHIDWrite(dev, () => {
                            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                                this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                                    dev.DataNumber = 0xff;
                                    this.ChangeProfileIDtodevice(dev, iProfile, (param0) => {
                                        this.EndHIDWrite(dev, () => {
                                            dev.m_bSetHWDevice = false;
                                            this.setProfileToDevice(dev, (paramDB) => {
                                                // Save DeviceData into Database

                                                this.CheckSliderfunction(dev);
                                                dev.DataNumber = 0x00;
                                                callback('SetKeyMatrix Done');
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                    break;
                case switchUIflag.lightingflag: //Set Device Lighting
                    this.nedbObj.getLayout().then((data) => {
                        //Get Perkey Data
                        var layoutDBdata = JSON.parse(JSON.stringify(data![0].AllData));
                        var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                        //Declare LightingData
                        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                        //Get sensitivity From ROTARY ENCODER
                        var ProfileData = appProfileLayers[iProfile][iLayerIndex];
                        LightingData.sensitivity = ProfileData.sensitivity;
                        //Get inputLatency
                        LightingData.inputLatency = ProfileData.inputLatency;
                        //
                        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
                        var ObjLighting = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            LightingData: LightingData,
                            LightingPerKeyData: LightingPerKeyData,
                            Perkeylist: layoutDBdata,
                        };
                        env.log(dev.BaseInfo.devicename, 'SetKeyMatrix', 'lightingflag-StartHIDWrite');
                        this.StartHIDWrite(dev, () => {
                            env.log(dev.BaseInfo.devicename, 'SetKeyMatrix', 'StartHIDWrite Done,then SetLEDEffect');
                            this.SetLEDEffect(dev, ObjLighting, (param2) => {
                                this.ChangeProfileIDtodevice(dev, iProfile, (param0) => {
                                    this.EndHIDWrite(dev, () => {
                                        dev.m_bSetHWDevice = false;
                                        this.setProfileToDevice(dev, (paramDB) => {
                                            //Save  DeviceData into Database
                                            dev.DataNumber = 0x00;
                                            callback('SetKeyMatrix Done');
                                        });
                                    });
                                });
                            });
                        });
                    });
                    break;
                case switchUIflag.performanceflag: //Set Device Performance
                    var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                    this.StartHIDWrite(dev, () => {
                        var ObjPollRateAndSleep = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            appProfileLayers: appProfileLayers,
                        };
                        this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
                            var ProfileData = appProfileLayers[iProfile][iLayerIndex];
                            var ObjProfile = { iProfile: iProfile, iLayerIndex: iLayerIndex, Data: ProfileData };
                            this.SetVolumeSensitivity(dev, ObjProfile, (param2) => {
                                this.EndHIDWrite(dev, () => {
                                    dev.m_bSetHWDevice = false;
                                    this.setProfileToDevice(dev, (paramDB) => {
                                        // Save DeviceData into Database
                                        callback('SetKeyMatrix Done');
                                    });
                                });
                            });
                        });
                    });
                    break;
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetKeyMatrix', `Error:${e}`);
        }
    }

    /**
     * Set Macro to Device
     * @param {*} dev
     * @param {*} ObjMacroData
     * @param {*} callback
     */
    SetMacroFunction(dev, ObjMacroData, callback) {
        const SetMacro = (iMacro) => {
            if (iMacro < ObjMacroData.MacroData.length) {
                var MacroData = ObjMacroData.MacroData[iMacro]; //Button
                var BufferKey = this.MacroToData(MacroData);
                var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };

                this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
                    SetMacro(iMacro + 1);
                });
            } else {
                callback('SetMacroFunction Done');
            }
        };
        SetMacro(0);
    }

    /**
     * Set Macro to Device
     * @param {*} dev
     * @param {*} ObjMacroData
     * @param {*} callback
     */
    SetMacroDataToDevice(dev, ObjMacroData, callback) {
        var MacroID = ObjMacroData.MacroID;
        var MacroData = ObjMacroData.MacroData;

        if (MacroData == false) {
            //No Macro
            callback('SetMacroDataToDevice Done');
            return;
        }
        //----Set Data into device wired or wireless----
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            var Data = Buffer.alloc(300);
            Data[0] = 0x05;
            Data[1] = MacroID;
            var iDataSize = 0;
            for (var k = 0; k < MacroData.length; k++) {
                if (MacroData[0 + k] == undefined) {
                    break;
                }
                Data[7 + k] = MacroData[0 + k];
                iDataSize++;
            }

            var DataNumber = 0;
            var iLayerCount = Math.ceil((8 + iDataSize) / 19); //byte 2 to byte 20-----19 bytes
            const SetAp = (j) => {
                if (j < iLayerCount) {
                    var DataBTHid = Buffer.alloc(21);
                    DataBTHid[0] = 0x07;

                    // if (j == iLayerCount-1)
                    //     DataBTHid[1] = 0xff;
                    // else{
                    DataBTHid[1] = DataNumber + 1; //1 to num
                    DataNumber++;
                    // }
                    for (var k = 0; k < 19; k++) DataBTHid[2 + k] = Data[19 * j + k];

                    this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
                        if (!bResult) {
                            SetAp(0);
                        } else {
                            SetAp(j + 1);
                        }
                        // this.SetHidWrite(dev, DataBTHid ,800).then(() => {
                    });
                } else {
                    callback('SendButtonMatrix2Device Done');
                }
            };
            SetAp(0);
        } else {
            var Data = Buffer.alloc(264);
            Data[0] = 0x07;
            Data[1] = 0x05;
            Data[2] = MacroID;
            var iMaxSize = 248;
            for (var k = 0; k < iMaxSize; k++) Data[8 + k] = MacroData[0 + k];

            this.SetFeatureReport(dev, Data, 100).then(() => {
                callback('SetMacroDataToDevice Done');
            });
        }
    }
    MacroToData(MacroData) {
        var BufferKey = new Array(256);
        var DataEvent: any[] = []; //DataEvent
        //------------Turns Hash Keys into Event Array-------------
        var Macrokeys = Object.keys(MacroData.content);
        for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
            var Hashkeys = Macrokeys[icontent];
            for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
                var MacroEvent = {
                    keydown: true,
                    key: Hashkeys,
                    times: MacroData.content[Hashkeys].data[iData].startTime,
                };
                DataEvent.push(MacroEvent);
                MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
                DataEvent.push(MacroEvent);
            }
        }
        //------------Sort Event Array By times-------------
        DataEvent = DataEvent.sort((a, b) => {
            return a.times >= b.times ? 1 : -1;
        });
        //------------Turns Event Array into BufferKey-------------
        for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
            var KeyCode = 0x04; //A
            var bModifyKey = false;
            var bMouseButton = false;
            //Assign Keyboard/Mouse KeyCode to KeyCode
            for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
                if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
                    KeyCode = SupportData.AllFunctionMapping[i].hid as number;
                    break;
                }
            }
            //Assign Delay to Event
            var iDelay = 1;
            if (iEvent < DataEvent.length - 1) {
                iDelay =
                    DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0
                        ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times
                        : 1;
            }

            BufferKey[iEvent * 3 + 0] = iDelay >> 0x08;
            if (DataEvent[iEvent].keydown) BufferKey[iEvent * 3 + 0] += 0x80;
            BufferKey[iEvent * 3 + 1] = iDelay & 0xff;
            //Assign KeyCode to Event
            BufferKey[iEvent * 3 + 2] = KeyCode;
        }
        if (DataEvent.length < 0) {
            return false;
        } else {
            return BufferKey;
        }
    }

    SetKeyFunction(dev, ObjKeyAssign, callback) {
        //------------KeyAssignment-------------
        //KeyMapping
        var KeyAssignData = ObjKeyAssign.KeyAssignData;
        var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
        var Obj1 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer,
        };
        //--------------MacroType---------------
        var DataBuffer2 = this.MacroTypeToData(dev, KeyAssignData);
        var Obj2 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer2,
        };
        //-------------Knob Sound Control-----------------------

        var iKey = 5; //defaultValue:"ROTARY ENCODER"
        var AssignData = KeyAssignData[iKey]; //Button

        var KnobControl = false;
        //if (AssignData.recordBindCodeType == "SOUND CONTROL") {
        if (AssignData.d_SoundVolume?.bindTarget?.filename != 'Windows Default Sound Output') {
            KnobControl = true;
        }
        //------------Glow when active-------------
        var DataBuffer3 = this.KeyGlowToData(dev, KeyAssignData);
        var Obj3 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer3,
            KnobControl: KnobControl,
        };
        //------------Set Data into device-------------
        this.SendButtonMatrix2Device(dev, Obj1, () => {
            this.SendMacroType2Device(dev, Obj2, () => {
                this.SendKeyGlow2Device(dev, Obj3, () => {
                    callback('SetKeyFunction Done');
                });
            });
        });
    }

    SendButtonMatrix2Device(dev, Obj, callback) {
        var iProfile = Obj.iProfile;
        var iLayerIndex = Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;

        //----Set Data into device wired or wireless----
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            Data[0] = 0x03;
            Data[1] = iProfile + 1; //DataProfile
            Data[2] = iLayerIndex + 1; //Layer
            for (
                var i = 0;
                i < DataBuffer.length;
                i++ //30
            )
                Data[7 + i] = DataBuffer[i];

            var DataNumber = 0;
            var iLayerCount = Math.ceil((DataBuffer.length + 8) / 19); //byte 2 to byte 20-----19 bytes
            const SetAp = (j) => {
                if (j < iLayerCount) {
                    var DataBTHid = Buffer.alloc(21);
                    DataBTHid[0] = 0x07;
                    // if (j == iLayerCount-1)
                    //     DataBTHid[1] = 0xff;
                    // else{
                    DataBTHid[1] = DataNumber + 1; //1 to num
                    DataNumber++;
                    // }
                    for (var k = 0; k < 19; k++) DataBTHid[2 + k] = Data[19 * j + k];

                    this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
                        if (!bResult) {
                            SetAp(0);
                        } else {
                            SetAp(j + 1);
                        }
                    });
                } else {
                    callback('SendButtonMatrix2Device Done');
                }
            };
            SetAp(0);
        } else {
            Data[0] = 0x07;
            Data[1] = 0x03;
            Data[2] = iProfile + 1; //DataProfile
            Data[3] = iLayerIndex + 1; //Layer

            for (
                var i = 0;
                i < DataBuffer.length;
                i++ //30
            )
                Data[8 + i] = DataBuffer[i];
            //-----------------------------------
            this.SetFeatureReport(dev, Data, 150).then(() => {
                callback('SendButtonMatrix2Device Done');
            });
            //-----------------------------------
        }
    }
    SendMacroType2Device(dev, Obj, callback) {
        var iProfile = Obj.iProfile;
        var iLayerIndex = Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;

        if (DataBuffer == false) {
            //No Macro
            callback('SendMacroType2Device Done');
            return;
        }
        //----Distinguish whether it is wired or wireless----

        //----Set Data into device wired or wireless----
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            //
            Data[0] = 0x04;
            Data[1] = iProfile + 1; //DataProfile
            Data[2] = iLayerIndex + 1; //Layer

            for (var i = 0; i < DataBuffer.length; i++) {
                //30
                Data[7 + i] = DataBuffer[i];
            }
            //
            var DataNumber = 0;
            var iLayerCount = Math.ceil((7 + DataBuffer.length) / 19); //byte 2 to byte 20-----13 bytes
            const SetAp = (j) => {
                if (j < iLayerCount) {
                    var DataBTHid = Buffer.alloc(21);
                    DataBTHid[0] = 0x07;
                    // if (j == iLayerCount-1)
                    //     DataBTHid[1] = 0xff;
                    // else{
                    DataBTHid[1] = DataNumber + 1; //1 to num
                    DataNumber++;
                    // }
                    for (var k = 0; k < 19; k++) DataBTHid[2 + k] = Data[19 * j + k];

                    this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
                        if (!bResult) {
                            SetAp(0);
                        } else {
                            SetAp(j + 1);
                        }
                    });
                } else {
                    callback('SendMacroType2Device Done');
                }
            };
            SetAp(0);
        } else {
            if (DataBuffer == false) {
                //No Macro
                callback('SendMacroType2Device Done');
            } else {
                Data[0] = 0x07;
                Data[1] = 0x04;
                Data[2] = iProfile + 1; //DataProfile
                Data[3] = iLayerIndex + 1; //Layer

                for (
                    var i = 0;
                    i < DataBuffer.length;
                    i++ //30
                ) {
                    Data[8 + i] = DataBuffer[i];
                }
                this.SetFeatureReport(dev, Data, 150).then(() => {
                    callback('SendMacroType2Device Done');
                });
            }
        }
    }
    MacroTypeToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(264);
        var iMacroCount = 0;
        var arrMacroType = [0x01, 0xffff, 0x00];

        for (var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_KEYCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case 'MacroFunction': //MacroFunction Function
                    DataBuffer[iIndex * 2] = arrMacroType[Temp_BtnList.macro_RepeatType] >> 0x08;
                    DataBuffer[iIndex * 2 + 1] = arrMacroType[Temp_BtnList.macro_RepeatType] & 0xff;
                    iMacroCount++;
                    break;
                default:
                    break;
            }
        }
        if (iMacroCount <= 0) return false;
        else return DataBuffer;
    }
    //-----------------------------------------
    KeyAssignToData(dev, KeyAssignData) {
        //var DataBuffer = Buffer.alloc(264);//104KeyData
        var DataBuffer = JSON.parse(JSON.stringify(dev.Buttoninfo_Default));
        //return DataBuffer;
        var iMacroCount = 0;
        for (var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_KEYCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
            if (iIndex == -1) {
                continue;
            }
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case 'SingleKey': //Keyboard Function/Combination Key
                    var KeyCode = 0;
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x01; //key matrix type-0x01: Normal key
                    DataBuffer[20 + iIndex] = KeyCode; //key matrix data

                    var arrcomplex = [
                        Temp_BtnList.Ctrl,
                        Temp_BtnList.Shift,
                        Temp_BtnList.Alt,
                        Temp_BtnList.Windows,
                        Temp_BtnList.hasFNStatus,
                    ];
                    var bycomplex = 0;
                    for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
                        if (arrcomplex[icomplex] == true) bycomplex |= Math.pow(2, icomplex); //Binary To Byte
                    }
                    if (bycomplex > 0) {
                        DataBuffer[iIndex] = 0xe0; //Binary To Byte
                        DataBuffer[iIndex] += bycomplex; //Binary To Byte
                    }
                    break;
                case 'MOUSE': //MOUSE Function
                    var KeyCode = 0;
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x09; //Mouse Function
                    DataBuffer[20 + iIndex] = KeyCode; //key matrix data
                    break;
                case 'KEYBOARD': //KEYBOARD Function
                    var KeyCode = 0;
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x08; //Keyboard Function
                    DataBuffer[20 + iIndex] = KeyCode; //key matrix data
                    break;
                case 'Multimedia': //Multimedia Function
                    var KeyCode = 0;
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
                            //KeyCode = SupportData.AllFunctionMapping[iMap].hidMap[1];
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x03; //key matrix type-0x03: Consumer key
                    DataBuffer[20 + iIndex] = KeyCode; //key matrix data
                    break;
                case 'LaunchProgram': //LaunchProgram Function
                case 'LaunchWebsite': //LaunchWebsite Function
                    DataBuffer[iIndex] = 0x07; //key matrix type-0x04: Launch Program
                    DataBuffer[20 + iIndex] = 0x00; //key matrix data
                    break;
                case 'SOUND CONTROL': //SOUND CONTROL in Function
                    if (Temp_BtnList.defaultValue == 'ROTARY ENCODER') {
                        DataBuffer[iIndex] = 0x03; //key matrix type-0x03: Consumer key
                        DataBuffer[20 + iIndex] = 0x10; //key matrix data-Calculator
                    } else {
                        DataBuffer[iIndex] = 0x0a; //SOUND CONTROL Function
                        DataBuffer[20 + iIndex] = 0x00; //SOUND CONTROL data
                    }
                    break;
                case 'Shortcuts': //Shortcuts Function
                    var KeyCode = 0;
                    var KeyValue;
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
                            //KeyCode = SupportData.AllFunctionMapping[iMap].hidMap[1];
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            KeyValue = SupportData.AllFunctionMapping[iMap].value;
                            break;
                        }
                    }
                    if (KeyValue == 'Explorer') {
                        //Win+E
                        var bycomplex = 0;
                        bycomplex |= Math.pow(2, 3); //Byte 3 To Binary 11
                        DataBuffer[iIndex] = 0xe0;
                        DataBuffer[iIndex] += bycomplex; //key data Win
                        DataBuffer[20 + iIndex] = 0x08; //key data E
                    } else {
                        DataBuffer[iIndex] = 0x03; //key matrix type-0x03: Consumer key
                        DataBuffer[20 + iIndex] = KeyCode; //key matrix data
                    }
                    break;
                case 'MacroFunction': //MacroFunction Function
                    DataBuffer[iIndex] = 0x05; //key matrix type-0x05: Macro
                    DataBuffer[20 + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
                    break;
                // case "SOUND CONTROL"://MacroFunction Function
                //     DataBuffer[iIndex] = 0x05;//key matrix type-0x05: Macro
                //     DataBuffer[20 + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
                // break;
                case 'Disable': //Disable
                    DataBuffer[iIndex] = 0x01; //key matrix type-0x01: Normal key
                    DataBuffer[20 + iIndex] = 0x00; //key matrix data
                    break;
                default:
                    break;
            }
        }
        return DataBuffer;
    }
    //Set Glow When Active

    KeyGlowToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(264);
        var iKeyGlowCount = 0;

        for (var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case 'SOUND CONTROL': //SOUND CONTROL Function
                    if (Temp_BtnList.d_SoundVolume.lightData.clearStatus == true) {
                        iKeyGlowCount++;
                        var RgbData = Temp_BtnList.d_SoundVolume.lightData.colorPickerValue;
                        var visible = 0xff; //KeyGlow Static Mode
                        if (Temp_BtnList.d_SoundVolume.lightData.breathing == true) visible = 0xfe; //KeyGlow Breathing Mode
                        //RGBA
                        DataBuffer[iIndex * 5 + 0] = visible; //KO_BR:00:Off,Non-zero:ON
                        DataBuffer[iIndex * 5 + 1] = iIndex; //KeyMap Index
                        DataBuffer[iIndex * 5 + 2] = RgbData[0];
                        DataBuffer[iIndex * 5 + 3] = RgbData[1];
                        DataBuffer[iIndex * 5 + 4] = RgbData[2];
                    }

                    break;
                default:
                    break;
            }
        }
        // if (iKeyGlowCount<=0)
        //     return false;
        // else
        return DataBuffer;
    }
    SendKeyGlow2Device(dev, Obj, callback) {
        var iProfile = Obj.iProfile;
        var iLayerIndex = Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;
        //----Distinguish whether it is wired or wireless----

        //----Set Data into device wired or wireless----
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            // function ArraySum(total, num) {
            //     return total + num;
            // }
            // var CheckSum = DataBuffer.reduce(ArraySum);
            // if (CheckSum == 0) {
            //     callback("SendButtonMatrix2Device Done");
            //     return;
            // }
            Data[0] = 0x09;
            Data[1] = iProfile + 1; //DataProfile
            Data[2] = iLayerIndex + 1; //Layer
            Data[3] = 42; //KeyNumber
            Data[5] = 0x14;
            Data[6] = Obj.KnobControl; //SoundControl_Flag

            for (
                var i = 0;
                i < DataBuffer.length;
                i++ //30
            )
                Data[7 + i] = DataBuffer[i];

            var DataNumber = 0;
            var iLayerCount = Math.ceil((DataBuffer.length + 7) / 19); //byte 2 to byte 20-----19 bytes
            const SetAp = (j) => {
                if (j < iLayerCount) {
                    var DataBTHid = Buffer.alloc(21);
                    DataBTHid[0] = 0x07;
                    DataBTHid[1] = DataNumber + 1; //1 to num
                    DataNumber++;

                    for (var k = 0; k < 19; k++) DataBTHid[2 + k] = Data[19 * j + k];

                    this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
                        if (!bResult) {
                            SetAp(0);
                        } else {
                            SetAp(j + 1);
                        }
                    });
                } else {
                    callback('SendButtonMatrix2Device Done');
                }
            };
            SetAp(0);
        } else {
            Data[0] = 0x07;
            Data[1] = 0x09;
            Data[2] = iProfile + 1; //DataProfile
            Data[3] = iLayerIndex + 1; //Layer
            Data[4] = 42; //KeyNumber
            Data[6] = 0x14;
            Data[7] = Obj.KnobControl; //SoundControl_Flag
            var iLayerCount: number;
            iLayerCount = 1; //For GMMK_Numpad

            const SetAp = (j) => {
                if (j < iLayerCount) {
                    Data[5] = j; //Page Number
                    for (var k = 0; k < 256; k++) Data[8 + k] = DataBuffer[256 * j + k];
                    this.SetFeatureReport(dev, Data, 150).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SendKeyGlow2Device Done');
                }
            };
            SetAp(0);
        }
        //-----------------------------------
    }

    //-------------------Lighting Effect------------------------
    SetLEDEffect(dev, Obj, callback) {
        env.log('GmmkNumpadSeries', 'SetLEDEffect', 'Begin');
        try {
            var ObjTypeData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
            var ObjEffectData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };

            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
                    var T_data = Obj.Perkeylist.filter((item, index, array) => {
                        if (item.SN == dev.BaseInfo.SN) {
                            return item; //回傳符合條件的
                        }
                    });
                    if (T_data.length < 1) {
                        callback('SetLEDEffect Done');
                        return;
                    }
                    var ObjLayoutData = {
                        iProfile: Obj.iProfile,
                        iLayerIndex: Obj.iLayerIndex,
                        PerKeyData: Obj.LightingPerKeyData,
                        Perkeylist: T_data,
                    };
                    this.SetLEDLayoutToDevice(dev, ObjLayoutData, () => {
                        callback('SetLEDEffect Done');
                    });
                });
            });
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetLEDEffect', `Error:${e}`);
        }
    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try {
            // callback();
            // return;
            var Data = Buffer.alloc(264);
            var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
            if (iEffect == -1) iEffect = 0;
            //--Distinguish whether it is wired or wireless--
            var iShift = 0;
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[1] = 0x01;
                iShift = 1;
            }

            Data[0] = 0x07;
            Data[iShift + 1] = 0x02;
            Data[iShift + 2] = ObjEffectData.iProfile + 1;
            Data[iShift + 3] = ObjEffectData.iLayerIndex + 1;
            Data[iShift + 4] = iEffect; //Led_Type
            Data[iShift + 8] = 20 - (ObjEffectData.Data.speed * 19) / 100; //Run_Speed(Rate) Range:0~20
            Data[iShift + 9] = 0x00; //LED_BR     (New FW)
            if (ObjEffectData.Data.Multicolor_Enable == true) {
                Data[iShift + 10] = ObjEffectData.Data.Multicolor; //Multicolor
            }
            if (iEffect == 13 || ObjEffectData.Data.PointEffectName == 'Rainbow') {
                Data[iShift + 12] = 1; //Wave Dir ---> Up
            }
            //Data[9] = ObjEffectData.Data.brightness*20/100;//LED_BR     Range:0~20(Old FW)

            Data[iShift + 15] = ObjEffectData.Data.colorPickerValue[0]; //COLOR_R
            Data[iShift + 16] = ObjEffectData.Data.colorPickerValue[1]; //COLOR_G
            Data[iShift + 17] = ObjEffectData.Data.colorPickerValue[2]; //COLOR_B

            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                this.SetHidWriteAwait(dev, Data).then(() => {
                    callback();
                });
            } else {
                this.SetFeatureReport(dev, Data, 100).then(() => {
                    env.log('GmmkNumpadSeries', 'SetLEDEffectToDevice', `2`);
                    callback();
                    env.log('GmmkNumpadSeries', 'SetLEDEffectToDevice', `3`);
                });
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetLEDEffectToDevice', `Error:${e}`);
        }
    }
    SetLEDTypeToDevice(dev, ObjEffectData, callback) {
        try {
            var Data = Buffer.alloc(264);
            var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
            if (iEffect == -1) iEffect = 0;

            var SidelightsFlag =
                dev.deviceData.profileLayers[ObjEffectData.iProfile][ObjEffectData.iLayerIndex].lockSidelightsFlag;
            var batteryLevel =
                dev.deviceData.profileLayers[ObjEffectData.iProfile][ObjEffectData.iLayerIndex].batteryLevelIndicator;
            //-----------------Wired and Wireless-Mouse------------------
            var iShift = 0;
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[1] = 0x01; //Set One time,Byte[1] is 0xff
                iShift = 1;
            }

            Data[0] = 0x07;
            Data[iShift + 1] = 0x07;
            Data[iShift + 2] = ObjEffectData.iProfile + 1;
            Data[iShift + 3] = ObjEffectData.iLayerIndex + 1;
            Data[iShift + 4] = iEffect; //Led_Type
            Data[iShift + 5] = 0x00; //Win_Lock
            Data[iShift + 6] = 0x01; //PerKey_sw
            Data[iShift + 7] = SidelightsFlag ? 1 : 0; //Num_lock led on
            Data[iShift + 8] = (ObjEffectData.Data.brightness * 20) / 100; //LED_BR     Range:0~20(New FW)

            Data[iShift + 10] = 0x08;
            if (ObjEffectData.Data.inputLatency != undefined) {
                //Data[iShift + 10] = ObjEffectData.Data.inputLatency;
            }
            if (ObjEffectData.Data.sensitivity != undefined) {
                Data[iShift + 11] = ObjEffectData.Data.sensitivity / 2; //Range_APP:0~100 Range_Firmware:0~50
            }
            Data[iShift + 12] = batteryLevel; //battery Level Indicator
            //----------------Wireless_LED_BR------------------
            if (ObjEffectData.Data.brightnessFlag == undefined)
                //Separate Brightness value
                Data[iShift + 13] = (ObjEffectData.Data.brightness * 20) / 100; //Range:0~20(New FW)
            else if (ObjEffectData.Data.brightnessFlag)
                //Separate Brightness value
                Data[iShift + 13] = (ObjEffectData.Data.wirelessBrightness * 20) / 100; //Range:0~20(New FW)
            else Data[iShift + 13] = (ObjEffectData.Data.brightness * 20) / 100;

            //---------------------LED_OFF_BRIGHTNESS------------------------
            if (iEffect == 0 || ObjEffectData.Data.PointEffectName == 'LEDOFF') {
                Data[iShift + 8] = 10;
                Data[iShift + 13] = 10;
            }
            //---------------------LED_OFF_BRIGHTNESS------------------------

            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                this.SetHidWriteAwait(dev, Data).then(() => {
                    callback('SetLEDTypeToDevice Done');
                });
            } else {
                this.SetFeatureReport(dev, Data, 100).then(() => {
                    callback('SetLEDTypeToDevice Done');
                });
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetLEDTypeToDevice', `Error:${e}`);
        }
    }
    SetVolumeSensitivity(dev, Obj, callback) {
        var iProfile = Obj.iProfile; //Assign profileindex From deviceData
        var ProfileData = Obj.Data;
        var iLayerIndex = Obj.iLayerIndex;
        //------------KeyAssignment-------------
        //KeyMapping
        //var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
        //var Temp_BtnList = KeyAssignData[5]; //"ROTARY ENCODER"

        //if (Temp_BtnList.recordBindCodeType == "SENSITIVITY") {
        var LightingData = ProfileData.light_PRESETS_Data;
        LightingData.inputLatency = ProfileData.inputLatency;

        LightingData.sensitivity = ProfileData.sensitivity;

        var ObjTypeData = { iProfile: iProfile, iLayerIndex: iLayerIndex, Data: LightingData };
        this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
            callback('SetVolumeSensitivity Done');
        });
        //}else{
        //callback("SetVolumeSensitivity Done");
        //}
    }
    //--------------------------------------------
    SetLEDLayoutToDevice(dev, ObjLayoutData, callback) {
        try {
            var Data = Buffer.alloc(264);
            var DataBuffer = this.LayoutToData(dev, ObjLayoutData);
            /**
             * Print Log for the current Profile and Layer
             */
            // var icurprofileindex = dev.deviceData.profileLayerIndex[dev.deviceData.profileindex];
            // if (dev.deviceData.profileindex == ObjLayoutData.iProfile && icurprofileindex == ObjLayoutData.iLayerIndex) {
            //     //Print devicename into env logs
            //     env.log("GmmkNumpadSeries-"+dev.BaseInfo.devicename,"SetLEDLayoutToDevice DataBuffer: ",JSON.stringify(DataBuffer));
            // }
            //-------Search Layout Data----------
            var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
            var PerKeyContent;
            for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
                if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value)) {
                    PerKeyContent = ObjLayoutData.Perkeylist[i].content;
                    break;
                }
            }
            if (PerKeyContent == undefined) {
                //PerKeyContent Not Macth So Cancel
                callback('SetLEDLayoutToDevice Failed');
                env.log('GmmkNumpadSeries', 'SetLEDEffectToDevice', 'Failed');
                return;
            }
            //-------Search Layout Data----------
            var brightness = (PerKeyContent.lightData.brightness * 20) / 100; //Perkey_BR     Range:0~20

            //----Set Data into device wired or wireless----
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode

                Data[0] = 0x06;
                Data[1] = ObjLayoutData.iProfile + 1;
                Data[2] = ObjLayoutData.iLayerIndex + 1;
                Data[3] = 42; //KeyNumber
                Data[5] = brightness;
                Data[4] = 0; //Page Number

                for (var j = 0; j < 256; j++) Data[7 + j] = DataBuffer[j];

                var iLayerCount = Math.ceil(DataBuffer.length / 13); //byte 8 to byte 20-----13 bytes
                var DataNumber = 0;

                const SetAp = (j) => {
                    if (j < iLayerCount) {
                        var DataBTHid = Buffer.alloc(21);
                        DataBTHid[0] = 0x07;
                        // if (j == iLayerCount-1)
                        //     DataBTHid[1] = 0xff;
                        // else{
                        DataBTHid[1] = DataNumber + 1; //1 to num
                        DataNumber++;
                        // }
                        for (var k = 0; k < 19; k++) DataBTHid[2 + k] = Data[19 * j + k];

                        this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
                            if (!bResult) {
                                SetAp(0);
                            } else {
                                SetAp(j + 1);
                            }
                        });
                    } else {
                        callback('SetLEDLayoutToDevice Done');
                    }
                };
                SetAp(0);
            } else {
                Data[0] = 0x07;
                Data[1] = 0x06;
                Data[2] = ObjLayoutData.iProfile + 1;
                Data[3] = ObjLayoutData.iLayerIndex + 1;
                Data[4] = 42; //KeyNumber
                Data[6] = brightness;

                var iLayerCount: number;
                iLayerCount = 1; //For GMMK_Numpad

                const SetAp = (j) => {
                    if (j < iLayerCount) {
                        Data[5] = j; //Page Number
                        for (var k = 0; k < 256; k++) Data[8 + k] = DataBuffer[256 * j + k];

                        this.SetFeatureReport(dev, Data, 100).then(() => {
                            SetAp(j + 1);
                        });
                    } else {
                        callback('SetLEDLayoutToDevice Done');
                    }
                };
                SetAp(0);
            }
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetLEDLayoutToDevice', `Error:${e}`);
            callback('SetLEDLayoutToDevice Done');
        }
    }

    LayoutToData(dev, ObjLayoutData) {
        var DataBuffer = Buffer.alloc(210);
        //-------Search Layout Data----------
        var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
        var PerKeyContent;
        for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
            if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value)) {
                PerKeyContent = ObjLayoutData.Perkeylist[i].content;
                break;
            }
        }
        if (PerKeyContent == undefined) return DataBuffer;
        /**
         * Print Log for the current Profile and Layer
         */
        // var icurprofileindex = dev.deviceData.profileLayerIndex[dev.deviceData.profileindex];
        // if (dev.deviceData.profileindex == ObjLayoutData.iProfile && icurprofileindex == ObjLayoutData.iLayerIndex) {
        //     env.log("GmmkNumpadSeries-"+dev.BaseInfo.devicename,"LayoutToData : ",JSON.stringify(PerKeyContent));
        // }
        //-------Set To Data----------
        for (var i = 0; i < PerKeyContent.AllBlockColor.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
            //var RgbData = this.hexToRgb(PerKeyContent.colorArr[i]);
            var RgbData = PerKeyContent.AllBlockColor[i].color;
            var strAry;
            var visible = 0xff;
            //RGBA
            RgbData = PerKeyContent.AllBlockColor[i].color;
            if (PerKeyContent.AllBlockColor[i].breathing && PerKeyContent.AllBlockColor[i].clearStatus) {
                visible = 0xfe; //Perkey Breathing Mode
            } else if (PerKeyContent.AllBlockColor[i].clearStatus) {
                visible = 0xff;
            } else {
                visible = 0x00;
            }
            DataBuffer[iIndex * 5 + 0] = visible; //KO_BR:00:Off,0xff:lighting,1~254:Breath
            DataBuffer[iIndex * 5 + 1] = iIndex; //KeyMap Index
            DataBuffer[iIndex * 5 + 2] = RgbData[0];
            DataBuffer[iIndex * 5 + 3] = RgbData[1];
            DataBuffer[iIndex * 5 + 4] = RgbData[2];
        }
        //-------------------sideLight-------------------------
        // if (PerKeyContent.lightData.sideLightColor[3] != undefined) {
        //     var bSideSync = PerKeyContent.lightData.sideLightSync;

        ////Sidelight Breathing setting is depending on bSideSync is on or not
        //     var RgbData = PerKeyContent.lightData.sideLightColor;
        ////using RgbA of SideLight to choose breathing or not
        //     var bBreathing = RgbData[3] ? PerKeyContent.lightData.breathing : false;

        //     for (var iside=0;iside < this.Matrix_SideLED.length;iside++){
        //         var visible = 0xff;
        //         if (parseInt(RgbData[3]) == 0) {
        //             visible = 0x00;
        //         }else if (bBreathing){
        //             visible = 0xfe;//Perkey Breathing Mode
        //         }
        //         var iIndexside = dev.Matrix_LEDCode_GMMK.indexOf(this.Matrix_SideLED[iside]);
        //         DataBuffer[iIndexside*5+0] = visible;//KO_BR:00:Off,0xff:lighting,1~254:Breath
        //         DataBuffer[iIndexside*5+1] = iIndexside;//KeyMap Index
        //         DataBuffer[iIndexside*5+2] = RgbData[0];
        //         DataBuffer[iIndexside*5+3] = RgbData[1];
        //         DataBuffer[iIndexside*5+4] = RgbData[2];
        //     }
        // }
        //-------------------sideLight-------------------------
        return DataBuffer; //DataBuffer--Byte 6 to the End
    }
    //
    SetFeatureReport(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            try {
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x07, 264, buf);
                //var rtnData = 256;
                setTimeout(() => {
                    if (rtnData < 8)
                        env.log(
                            'GmmkNumpadSeries SetFeatureReport',
                            'SetFeatureReport(error) return data length : ',
                            JSON.stringify(rtnData),
                        );
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('GmmkNumpadSeries Error', 'SetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            try {
                //    var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x07, 264, buf);
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x07, 264);
                setTimeout(() => {
                    // if(rtnData != 65)
                    //     env.log("DeviceApi GetFeatureReport","GetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('DeviceApi Error', 'GetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    //
    SetHidWrite(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            try {
                var rtnData = this.hid!.SetHidWrite(dev.BaseInfo.DeviceId, 0x07, 21, buf);
                setTimeout(() => {
                    if (rtnData < 8)
                        env.log(
                            'GmmkNumpadSeries SetHidWrite',
                            'SetHidWrite(error) return data length : ',
                            JSON.stringify(rtnData),
                        );
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('GmmkNumpadSeries Error', 'SetHidWrite', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    StartHIDWrite(dev, callback) {
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            var Data0 = Buffer.alloc(264);
            Data0[0] = 0x07;
            Data0[1] = 0x00;
            this.SetHidWriteAwait(dev, Data0).then(() => {
                callback();
            });
        } else {
            callback();
        }
    }
    EndHIDWrite(dev, callback) {
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            var Data0 = Buffer.alloc(264);
            Data0[0] = 0x07;
            Data0[1] = 0xff;
            this.SetHidWriteAwait(dev, Data0).then(() => {
                callback();
            });
        } else {
            callback();
        }
    }
    //
    SetHidWriteAwait(dev, buf) {
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            // try {
            dev.awaitHidWrite = true;
            var rtnData = this.hid!.SetHidWrite(dev.BaseInfo.DeviceId, 0x07, 21, buf);
            if (rtnData < 1)
                env.log(
                    'GmmkNumpadSeries SetHidWriteAwait',
                    'SetHidWriteAwait(error) return data length : ',
                    JSON.stringify(rtnData),
                );

            dev.timerawait = setInterval(() => {
                if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'USB') {
                    //USB Wired Mode
                    dev.BTErrorcount = 0;
                    dev.awaittime = 0;
                    clearInterval(dev.timerawait);
                    resolve(true);
                    //return;
                } else if (!dev.awaitHidWrite) {
                    dev.BTErrorcount = 0;
                    dev.awaittime = 0;
                    clearInterval(dev.timerawait);
                    //delete dev.timerawait;
                    resolve(true);
                    //return;
                } else if (dev.BTErrorcount >= 50 && dev.awaitHidWrite) {
                    dev.BTErrorcount = 0;
                    dev.awaittime = 0;
                    clearInterval(dev.timerawait);
                    // delete dev.timerawait;
                    resolve(true);
                    //return;
                } else if (dev.awaittime >= 50 && dev.awaitHidWrite) {
                    dev.BTErrorcount++;
                    env.log('GmmkNumpad SetHidWriteAwait', 'BLE No res count: ', JSON.stringify(dev.BTErrorcount));

                    rtnData = this.hid!.SetHidWrite(dev.BaseInfo.DeviceId, 0x07, 21, buf);
                    dev.awaittime = 0;
                    // dev.awaitHidWrite = false;
                    // clearInterval(dev.timerawait);
                    // resolve(false);
                } else {
                    dev.awaittime++;
                }
            }, 50);
            // } catch(err) {
            //     env.log("GmmkNumpadSeries Error","SetHidWriteAwait",`ex:${err.message}`);
            //     resolve(err);
            // }
        });
    }

    SwitchAudioSession(ObjSoundControl) {
        if (ObjSoundControl.processid == 1) {
            //Windows Default Sound Output
            this.AudioSession.SetSpeakerValue(ObjSoundControl.percent);
        } else if (ObjSoundControl.filepath != undefined) {
            var AudioSession = this.AudioSession.SetAudioSession(ObjSoundControl);
        }
    }
    //---------------------timer for get Audio Session-------------------------------

    /**
     * get Audio Session
     * @param {*} dev
     * @param {*} callback
     */
    OnTimerGetAudioSession(dev) {
        if (dev.m_TimerGetSession != undefined) {
            clearInterval(dev.m_TimerGetSession);
        }
        dev.m_TimerGetSession = setInterval(() => {
            try {
                this.GetAudioSession(dev, 0, (ObjSession) => {
                    if (ObjSession == null) {
                        return;
                    }
                    if (this.CompareContent(ObjSession, dev.deviceData.AudioSession) == false) {
                        dev.deviceData.AudioSession = JSON.parse(JSON.stringify(ObjSession));
                        //-----------emit-------------------
                        var Obj2 = {
                            Func: EventTypes.GetAudioSession,
                            SN: dev.BaseInfo.SN,
                            Param: dev.deviceData.AudioSession,
                        };
                        this.emit(EventTypes.ProtocolMessage, Obj2);
                        //-----------emit-------------------
                    }
                    //}
                });
            } catch (e) {
                env.log('GmmkNumpadSeries', 'OnTimerGetAudioSession', `Error:${e}`);
            }
        }, 1000);
    }
    CompareContent(object1, object2) {
        var bCompare = false;
        if (object1 == undefined || object2 == undefined) return false;
        if (object1.length != object2.length) return false;

        for (var iIndex = 0; iIndex < object1.length; iIndex++) {
            if (object1[iIndex].filename != object2[iIndex].filename) break;
            if (parseInt(object1[iIndex].percent) != parseInt(object2[iIndex].percent)) break;
            if (parseInt(object1[iIndex].processid) != parseInt(object2[iIndex].processid)) break;

            if (iIndex == object1.length - 1) {
                bCompare = true;
            }
        }
        return bCompare;
        //return JSON.stringify(object1) === JSON.stringify(object2);
    }
    /**
     * Set PollRate and Sleep Time
     * @param {*} dev
     * @param {*} Obj: appProfileLayers,iProfile,iLayerIndex
     */
    //Set PollRate and Sleep Time
    SetPollRateAndSleep(dev, Obj, callback) {
        var appProfileLayers = Obj.appProfileLayers;
        var iCurProfile = Obj.iProfile;
        var iCurLayerIndex = Obj.iLayerIndex;

        var iPollingrate = appProfileLayers[iCurProfile][iCurLayerIndex].pollingrate;

        var DataSleep = Buffer.alloc(9);
        //Assign Sleep Data
        for (var iProfile = 0; iProfile < 3; iProfile++) {
            for (var iLayer = 0; iLayer < 3; iLayer++) {
                var ProfileLayers = appProfileLayers[iProfile][iLayer];
                if (ProfileLayers.standby == 2) {
                    //With Profile Layer Device Specific
                    DataSleep[iProfile * 3 + iLayer] = ProfileLayers.standbyvalue;
                } else if (dev.sleep) {
                    //Inherit Global Value-Enable Sleeptime
                    DataSleep[iProfile * 3 + iLayer] = dev.sleeptime;
                } else {
                    //Inherit Global Value-Disable Sleep
                    DataSleep[iProfile * 3 + iLayer] = 0xff;
                }
            }
        }
        //--------------------------------------
        var ObjPollRateAndSleep = { iPollingrate: iPollingrate, DataSleep: DataSleep };
        this.SetPollRateAndSleeptoDevice(dev, ObjPollRateAndSleep, (param1) => {
            callback();
        });
    }
    //Set Sleep Time Into Device
    SetSleepTimetoDevice(dev, Obj, callback) {
        try {
            if (dev.m_bSetHWDevice) {
                env.log(dev.BaseInfo.devicename, 'SetSleepTimetoDevice', 'Device Has Setting,Stop Forward');
                callback(false);
                return;
            }
            dev.sleep = Obj.sleep;
            dev.sleeptime = Obj.sleeptime;
            //-------------------------------
            var iProfile = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
            var appProfileLayers = dev.deviceData.profileLayers;
            //-------------------------------
            this.StartHIDWrite(dev, () => {
                var ObjPollRateAndSleep = {
                    iProfile: iProfile,
                    iLayerIndex: iLayerIndex,
                    appProfileLayers: appProfileLayers,
                };
                this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
                    this.EndHIDWrite(dev, () => {
                        callback();
                    });
                });
            });
        } catch (e) {
            env.log('GmmkNumpadSeries', 'SetSleepTimetoDevice', `Error:${e}`);
        }
    }

    //Get Device Battery Status From Device
    GetDeviceBatteryStats(dev, Obj, callback) {
        try {
            if (dev.m_bAudioControl) return;
            else if (dev.m_bSetHWDevice) {
                callback(false);
                return;
            }
            //----Set Data into device wired or wireless----
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                //-----------------------------------
                dev.m_bSetHWDevice = true;
                this.StartHIDWrite(dev, () => {
                    var Data = Buffer.alloc(264);
                    Data[0] = 0x07;
                    Data[1] = 0x01;
                    Data[2] = 0x8a;
                    this.SetHidWriteAwait(dev, Data).then(() => {
                        this.EndHIDWrite(dev, () => {
                            dev.m_bSetHWDevice = false;
                            callback(false);
                        });
                    });
                });
            } else {
                //GMMK-Numpad Wired
                var Data = Buffer.alloc(264);
                Data[0] = 0x07;
                Data[1] = 0x8a;

                this.SetFeatureReport(dev, Data, 30).then(() => {
                    this.GetFeatureReport(dev, Data, 30).then((rtnData: any) => {
                        var batteryvalue = rtnData[2 - 1];
                        var batterycharging = rtnData[3 - 1];

                        var FWHex = rtnData[5 - 1] * 256 + rtnData[4 - 1];
                        var FWVersion = parseInt(FWHex.toString(16), 10);
                        var verRev = FWVersion.toString(); //Version byte Reversed
                        var strVertion = verRev.padStart(4, '0');

                        var ObjBattery = {
                            SN: dev.BaseInfo.SN,
                            Status: 0,
                            Battery: batteryvalue,
                            Charging: batterycharging,
                            FWVersion: strVertion,
                        };
                        callback(ObjBattery);
                    });
                });
            }
        } catch (e) {
            env.log('ModelOSeries', 'GetDeviceBatteryStats', `Error:${e}`);
        }
    }
}

module.exports = GmmkNumpadSeries;
