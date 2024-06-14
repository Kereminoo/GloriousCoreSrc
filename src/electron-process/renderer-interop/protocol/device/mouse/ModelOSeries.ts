import { EventTypes } from '../../../../../common/EventVariable';
import { SupportData } from '../../../../../common/SupportData';
import { env } from '../../../others/env';
import { Mouse } from './Mouse';
import { ModelO2ProPairing } from './ModelO2ProPairing';
import { GetValidURL } from '../../../../../common/utils';

export class ModelOSeries extends Mouse {
    static #instance: ModelOSeries;

    m_bSetFWEffect: boolean;

    MDFMapping: any[];
    MouseMapping: any[];
    ButtonMapping: any[];
    MouseMacroContentMap: { [key: string]: string } = {};
    modelO2ProPairing: ModelO2ProPairing | undefined = undefined;

    constructor(hid) {
        env.log('ModelOSeries', 'ModelOSeries class', 'begin');
        super();

        this.m_bSetFWEffect = false; //SET DB
        this.hid = hid;
        // this.AppDB = AppObj.getInstance();
        //--Define that turn UI Data into MDF KeyData--
        this.MDFMapping = [
            { keyCode: '16', value: 'Shift', MDFKey: 0x02, code: 'ShiftLeft' },
            { keyCode: '17', value: 'Ctrl', MDFKey: 0x01, code: 'ControlLeft' },
            { keyCode: '18', value: 'Alt', MDFKey: 0x04, code: 'AltLeft' },
            { keyCode: '91', value: 'Left Win', MDFKey: 0x08, code: 'MetaLeft' },
            { keyCode: '16', value: 'RShift', MDFKey: 0x20, code: 'ShiftRight' },
            { keyCode: '17', value: 'RCtrl', MDFKey: 0x10, code: 'ControlRight' },
            { keyCode: '18', value: 'RAlt', MDFKey: 0x40, code: 'AltRight' },
            { keyCode: '92', value: 'Right Win', MDFKey: 0x80, code: 'MetaLeft' },
        ];
        this.MouseMapping = [
            { keyCode: '16', value: 'Left Click', hid: 0x01, code: '0' },
            { keyCode: '17', value: 'Scroll Click', hid: 0x04, code: '1' },
            { keyCode: '18', value: 'Right Click', hid: 0x02, code: '2' },
            { keyCode: '91', value: 'Back Key', hid: 0x08, code: '3' },
            { keyCode: '92', value: 'Forward Key', hid: 0x10, code: '4' },
        ];
        this.ButtonMapping = [
            { ButtonID: 0x01, value: 'LeftClick' },
            { ButtonID: 0x03, value: 'ScorllClick' },
            { ButtonID: 0x02, value: 'RightClick' },
            { ButtonID: 0x05, value: 'Forward' },
            { ButtonID: 0x04, value: 'Backward' },
            { ButtonID: 0x14, value: 'DPISwitch' },
            { ButtonID: 0x10, value: 'Scroll Up' },
            { ButtonID: 0x11, value: 'Scroll Down' },
        ];
        //--Define that turn UI Data into MDF KeyData--
        this.MouseMacroContentMap = {
            mouse_left: '0',
            mouse_middle: '1',
            mouse_right: '2',
            mouse_back: '3',
            mouse_forward: '4',
            '0': 'mouse_left',
            '1': 'mouse_middle',
            '2': 'mouse_right',
            '3': 'mouse_back',
            '4': 'mouse_forward',
        };
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('ModelOSeries', 'getInstance', `Get exist ModelOSeries() INSTANCE`);
            return this.#instance;
        } else {
            env.log('ModelOSeries', 'getInstance', `New ModelOSeries() INSTANCE`);
            this.#instance = new ModelOSeries(hid);

            return this.#instance;
        }
    }
    InitialDevice(dev, Obj, callback) {
        try {
            env.log('ModelOSeries', 'initDevice', 'Begin');
            //---------------Initialize Pairing funcion-------------------
            if (this.modelO2ProPairing == undefined) {
                this.modelO2ProPairing = ModelO2ProPairing.getInstance(this.hid);
            }
            //----------------------------------
            dev.bwaitForPair = false;
            dev.m_bSetHWDevice = false;

            dev.ChangingDockedEffect = 0;
            dev.Batterytest = 0;
            dev.SetFromDB = false;

            if (env.BuiltType == 0) {
                dev.SetFromDB = true;
                this.SetProfileDataFromDB(dev, 0, () => {
                    dev.SetFromDB = false;
                    callback(0);
                });
            } else {
                dev.BaseInfo.version_Wired = '00.03.01.00';
                dev.BaseInfo.version_Wireless = '00.03.01.00';
                callback(0);
            }
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'InitialDevice', `Error:${e}`);
            callback(0);
        }
    }
    //------Recieve Callback From Device Input Data------
    HIDEP2Data(dev, ObjData) {
        if (ObjData[0] == 0x04 && ObjData[1] == 0x02) {
            //EP2 Switch Profile
            dev.deviceData.profileindex = ObjData[2];
            var iProfile = ObjData[2];
            env.log('ModelOSeries', 'HIDEP2Data-SwitchProfile', iProfile);
            var Obj2 = {
                Func: EventTypes.SwitchUIProfile,
                SN: dev.BaseInfo.SN,
                Param: {
                    SN: dev.BaseInfo.SN,
                    Profile: iProfile,
                    ModelType: dev.BaseInfo.ModelType, //Mouse:1,Keyboard:2,Dock:4
                },
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            //------For Wireless Mode ,Device can't not recieve immediately from application, So we need to wait with the device status------
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0x06) {
            //EP2 Get Device Stats
            if (ObjData[2] == 1) {
                //Wireless On notify
                dev.bwaitForPair = false;
                this.ReconnectDevice(dev, () => {});
                // setTimeout(function () {
                //     this.GetBatteryStats(dev,0,function (ObjBattery) {
                //     });
                // }, 3000);
            } else {
                //Wireless disconnected notify
                dev.bwaitForPair = true;
            }
        } else if (ObjData[0] == 0x01 && ObjData[1] == 0x0f) {
            //EP2 Launch Program
            this.LaunchProgram(dev, ObjData[2]);
        }
    }
    //--------------------------------------------------------
    ReconnectDevice(dev, callback) {
        if (dev.arrLostBuffer != undefined) {
            this.SetFeatureReport(dev, dev.arrLostBuffer, 5).then(() => {
                delete dev.arrLostBuffer;
                callback();
            });
        } else {
            // this.GetProfileIDFromDevice(dev, 0, (iProfile) => {
            //     if (dev.deviceData.profileindex != iProfile && iProfile > 0 && iProfile <= 3) {
            //         dev.deviceData.profileindex = iProfile;
            //         var Obj2 = {
            //             Func: EventTypes.SwitchUIProfile,
            //             SN: dev.BaseInfo.SN,
            //             Param: {
            //                 SN: dev.BaseInfo.SN,
            //                 Profile: iProfile,
            //                 ModelType: dev.BaseInfo.ModelType, //Mouse:1,Keyboard:2,Dock:4
            //             },
            //         };
            //         this.emit(EventTypes.ProtocolMessage, Obj2);
            //     }
            callback();
            //});
        }
    }
    //------We recieved just include Button ID, So We must decide function from the application Data base------
    LaunchProgram(dev, iKey) {
        var iProfile = dev.deviceData.profileindex - 1;
        var KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey]; //Get Button Data
        switch (
            KeyAssignData.group //determine function with KeyAssign group
        ) {
            case 2: //Windows Shortcut/Launch
                if (KeyAssignData.function == 1) {
                    //Launch Program
                    var csProgram = KeyAssignData.param;
                    if (csProgram != '') this.RunApplication(csProgram);
                } else if (KeyAssignData.function == 2) {
                    //Launch WebSite
                    var csProgram = KeyAssignData.param;
                    if (csProgram != null && csProgram.trim() != '') {
                        this.RunWebSite(GetValidURL(csProgram));
                    }
                } else if (KeyAssignData.function == 3) {
                    //Windows Shortcut
                }
                break;
            case 8: //Keyboard Profile/Layer Switch
                if (KeyAssignData.function == 1) {
                    //Profile Cycle Up
                    var Obj2 = { Func: 'SwitchKeyboardProfile', SN: dev.BaseInfo.SN, Updown: 2 };
                    this.emit(EventTypes.ProtocolMessage, Obj2); //Send to Frontend
                } else if (KeyAssignData.function == 2) {
                    //Profile Cycle Down
                    var Obj2 = { Func: 'SwitchKeyboardProfile', SN: dev.BaseInfo.SN, Updown: 1 };
                    this.emit(EventTypes.ProtocolMessage, Obj2); //Send to Frontend
                } else if (KeyAssignData.function == 3) {
                    //Layer Cycle /Up
                    var Obj2 = { Func: 'SwitchKeyboardLayer', SN: dev.BaseInfo.SN, Updown: 2 };
                    this.emit(EventTypes.ProtocolMessage, Obj2); //Send to Frontend
                } else if (KeyAssignData.function == 4) {
                    //Layer Cycle Down
                    var Obj2 = { Func: 'SwitchKeyboardLayer', SN: dev.BaseInfo.SN, Updown: 1 };
                    this.emit(EventTypes.ProtocolMessage, Obj2); //Send to Frontend
                }
                break;
            default:
                break;
        }
    }

    GetWirelessMode(dev, Obj, callback) {
        //Determine WirelessMode With State Number
        var bWireless = false;
        for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
            var StateSN =
                '0x' +
                this.NumTo16Decimal(dev.BaseInfo.vid[iState]) +
                '0x' +
                this.NumTo16Decimal(dev.BaseInfo.pid[iState]);
            if (dev.BaseInfo.SN == StateSN && iState > 0) {
                bWireless = true;
                break;
            }
        }
        callback(bWireless);
    }
    ReadFWVersion(dev, Obj, callback) {
        try {
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'USB') {
                var Data = Buffer.alloc(65);
                //-----------------Wired-Mouse------------------
                Data[0] = 0x00;
                Data[1] = 0x00;
                Data[2] = 0x00;
                Data[3] = 0x02; //Mouse
                Data[4] = 0x03;
                Data[5] = 0x00;
                Data[6] = 0x81;
                //-----------------------------------
                this.SetAndCheckStatus(dev, Data, 50).then((rtnData) => {
                    if (!rtnData) {
                        callback();
                        return;
                    }
                    //this.SetFeatureReport(dev, Data,50).then(function () {
                    //this.GetFeatureReport(dev, Data,50).then(function (rtnData) {
                    dev.BaseInfo.version_Wireless = '99.99.99.99';
                    if (rtnData[0] != 0xa1 || dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                        dev.BaseInfo.version_Wired = '99.99.99.99';
                    } else {
                        //var verHigh = this.padLeft(parseInt(rtnData[6].toString(16), 10),2);//Version byte high
                        var verHigh = rtnData[6].toString(); //Version byte high
                        var verMid = rtnData[7].toString(); //Version byte mid
                        var verLow = rtnData[8].toString(); //Version byte low
                        var verRev = rtnData[9].toString(); //Version byte Reversed
                        var strVertion = verHigh + '.' + verMid + '.' + verLow + '.' + verRev;
                        dev.BaseInfo.version_Wired = strVertion;
                    }
                    callback();
                    //});
                });
            } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //-----------------Wireless-MouseDongle------------------
                var Data = Buffer.alloc(65);
                Data[0] = 0x00;
                Data[1] = 0x00;
                Data[2] = 0x00;
                Data[3] = 0x00; //Dongle
                Data[4] = 0x03;
                Data[5] = 0x00;
                Data[6] = 0x81;
                this.SetAndCheckStatus(dev, Data, 100).then((rtnData) => {
                    if (!rtnData) {
                        callback();
                        return;
                    }
                    //this.SetFeatureReport(dev, Data,50).then(function () {
                    //this.GetFeatureReport(dev, Data,50).then(function (rtnData) {
                    dev.BaseInfo.version_Wired = '99.99.99.99';
                    if (rtnData[0] != 0xa1) {
                        //USB Wireless Mode Failed
                        dev.BaseInfo.version_Wireless = '99.99.99.99';
                    } else {
                        //var verHigh = this.padLeft(rtnData[6],2);//Version byte high
                        var verHigh = rtnData[6].toString(); //Version byte high
                        var verMid = rtnData[7].toString(); //Version byte mid
                        var verLow = rtnData[8].toString(); //Version byte low
                        var verRev = rtnData[9].toString(); //Version byte Reversed
                        var strVertion = verHigh + '.' + verMid + '.' + verLow + '.' + verRev; //Convert to Version String
                        dev.BaseInfo.version_Wireless = strVertion;
                    }
                    callback();
                    //});
                });
            }
        } catch (e) {
            env.log('ModelOSeries', 'ReadFWVersion', `Error:${e}`);
            callback(false);
        }
    }
    //Get Device Battery Status From Device
    GetDeviceBatteryStats(dev, Obj, callback) {
        try {
            if (dev.m_bSetHWDevice) {
                callback(false);
                return;
            }
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x02;
            Data[5] = 0x00;
            Data[6] = 0x83;

            //-----------------------------------
            this.SetFeatureReport(dev, Data, 50).then(() => {
                this.GetFeatureReport(dev, Data, 50).then((rtnData: any) => {
                    var arrStatus = [0xa1, 0xa4, 0xa2, 0xa0, 0xa3]; //0:Success,1:Sleep,2:Failure,3:Busy,4:Unsupport
                    var Status = arrStatus.indexOf(rtnData[0]);
                    if (rtnData[5] != 0x83)
                        //Is Not BatteryStats Status is Fail
                        Status = 2;
                    if (rtnData[7] == 0)
                        //Battery Value is 0 Convert To 1
                        rtnData[7] = 1;

                    if (Status == 2) {
                        env.log(dev.BaseInfo.devicename, 'GetDeviceBatteryStats', 'Fail-Status:' + Status);
                        callback(false);
                    } else {
                        var ObjBattery = {
                            SN: dev.BaseInfo.SN,
                            Status: Status,
                            Battery: rtnData[7],
                            Charging: rtnData[6],
                        };
                        callback(ObjBattery);
                    }
                });
            });
        } catch (e) {
            env.log('ModelOSeries', 'GetDeviceBatteryStats', `Error:${e}`);
        }
    }
    GetProfileIDFromDevice(dev, Obj, callback) {
        try {
            if (env.BuiltType == 1) {
                callback('GetProfileIDFromDevice Done');
                return;
            }
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x01;
            Data[5] = 0x00;
            Data[6] = 0x85;

            //-----------------------------------
            this.SetFeatureReport(dev, Data, 30).then(() => {
                this.GetFeatureReport(dev, Data, 20).then((rtnData: any) => {
                    var iProfile = rtnData[6];
                    callback(iProfile);
                });
            });
        } catch (e) {
            env.log('ModelOSeries', 'GetProfileIDFromDevice', `Error:${e}`);
        }
    }

    ChangeProfileID(dev, Obj, callback) {
        env.log('ModelOSeries', 'ChangeProfileID', 'Begin');
        try {
            if (env.BuiltType == 1) {
                callback('ChangeProfileID Done');
                return;
            }
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x01;
            Data[5] = 0x00;
            Data[6] = 0x05;

            Data[7] = Obj;
            dev.deviceData.profileindex = Obj; //Change deviceData Hardware Profile id
            //-----------------------------------
            this.SetAndCheckStatus(dev, Data, 50).then(() => {
                //Set LEDBrightness
                var iProfile = Obj - 1;
                var ProfileData = dev.deviceData.profile[iProfile];
                var LightingData = ProfileData.lighting;
                var ObjLighting = {
                    iProfile: iProfile,
                    LightingData: LightingData,
                };
                this.SetLEDBright(dev, ObjLighting, (param1) => {
                    this.setProfileToDevice(dev, () => {
                        callback('ChangeProfileID Done');
                    });
                });
            });
        } catch (e) {
            env.log('ModelOSeries', 'ChangeProfileID', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetLEDEffect(dev, Obj, callback) {
        if (dev.BaseInfo.LEDSetting == false) {
            callback('SetLEDEffect Done');
            return;
        }

        env.log(dev.BaseInfo.devicename, 'SetLEDEffect', 'Begin');
        try {
            var iEffect;
            var Colors = Obj.LightingData.Color;
            var iSpeed = (105 - Obj.LightingData.RateValue) / 5;
            if (Obj.LightingData.Effect == 6 || Obj.LightingData.Effect == 7)
                //Rave/Wave
                iSpeed = (105 - Obj.LightingData.RateValue) * 2;

            var iBrightness;
            var iProfile = Obj.iProfile;
            var arrEffectName = [1, 2, 3, 4, 5, 6, 7, 8, 0];
            iEffect = arrEffectName[Obj.LightingData.Effect];
            var iDataNum = Colors.length * 3 + 5;
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = iDataNum;
            Data[5] = 0x02;
            Data[6] = 0x00;
            Data[7] = iProfile + 1; //Profile
            Data[8] = 0xff; //zones-All zones
            Data[9] = iEffect; //Effect
            Data[10] = 0x00; //Direction
            Data[11] = iSpeed; //Speed
            if (iEffect == 2) {
                //Seamless Breathing
                Data[12] = 0xff; //R
                Data[13] = 0x00; //G
                Data[14] = 0x00; //B
            } else {
                for (var index = 0; index < Colors.length; index++) {
                    if (Colors[index].flag == false) {
                        Data[12 + index * 3 + 0] = 0; //R
                        Data[12 + index * 3 + 1] = 0; //G
                        Data[12 + index * 3 + 2] = 0; //B
                    } else if (
                        Colors[index].flag == true &&
                        Colors[index].R == 0 &&
                        Colors[index].G == 0 &&
                        Colors[index].B == 0
                    ) {
                        Data[12 + index * 3 + 0] = 1; //R
                        Data[12 + index * 3 + 1] = 0; //G
                        Data[12 + index * 3 + 2] = 0; //B
                    } else {
                        Data[12 + index * 3 + 0] = Colors[index].R; //R
                        Data[12 + index * 3 + 1] = Colors[index].G; //G
                        Data[12 + index * 3 + 2] = Colors[index].B; //B
                    }
                }
            }
            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetLEDEffect Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetLEDEffect', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetLEDBright(dev, Obj, callback) {
        if (dev.BaseInfo.LEDSetting == false) {
            callback('SetLEDBright Done');
            return;
        }

        env.log('ModelOSeries', 'SetLEDBright', 'Begin');
        try {
            var iWiredBrightness = (Obj.LightingData.WiredBrightnessValue / 100) * 255;
            var iWirelessBrightness = (Obj.LightingData.WirelessBrightnessValue / 100) * 255;
            var bCheckValue = Obj.LightingData.SepatateCheckValue;
            var iProfile = Obj.iProfile;
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x02;
            Data[5] = 0x02;
            Data[6] = 0x02;
            Data[7] = 1; //Mode WIRED
            Data[8] = iWiredBrightness; //Brightness(0-255)
            this.SetFeatureReport(dev, Data, 30).then(() => {
                Data[7] = 0; //Mode WIRELESS
                if (bCheckValue)
                    Data[8] = iWirelessBrightness; //Brightness(0-255)
                else Data[8] = iWiredBrightness; //Brightness(0-255)
                this.SetFeatureReport(dev, Data, 30).then(() => {
                    callback('SetLEDBright Done');
                });
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetLEDEffect', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetSleepTimetoDevice(dev, Obj, callback) {
        try {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x02;
            Data[5] = 0x00;
            Data[6] = 0x07;
            if (Obj.sleep) {
                var iSleeptime = Obj.sleeptime * 60;
                Data[7] = iSleeptime / 0xff;
                Data[8] = iSleeptime & 0xff;
            } else {
                Data[7] = 0xff;
                Data[8] = 0xff;
            }

            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetSleepTime2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetSleepTimetoDevice', `Error:${e}`);
        }
    }
    //Send Import App data and convert deviceData into Firmware
    SetImportProfileData(dev, Obj, callback) {
        if (env.BuiltType == 1) {
            callback();
            return;
        }
        var iProfile = dev.deviceData.profileindex - 1;
        var ProfileData = dev.deviceData.profile[iProfile];
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
            iProfile: iProfile,
            KeyAssignData: KeyAssignData,
        };
        var ObjLighting = {
            iProfile: iProfile,
            LightingData: LightingData,
        };
        var ObjPerformance = {
            iProfile: iProfile,
            PerformanceData: PerformanceData,
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
                this.SetLEDBright(dev, ObjLighting, (param25) => {
                    this.SetPerformance(dev, ObjPerformance, (param3) => {
                        //-------------dpiSelectIndex---------------
                        var ObjActiveDPI = { profile: iProfile, activeDPI: ProfileData.performance.dpiSelectIndex };
                        this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param35) => {
                            //Set ActiveDPIStage Into Device
                            //-------------dpiSelectIndex---------------
                            this.nedbObj.getMacro().then((doc) => {
                                var MacroData = doc;
                                var ObjMacroData = {
                                    MacroData: MacroData,
                                };
                                this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                                    callback('SetProfileDataFromDB Done');
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    //Send App data and convert deviceData into Firmware From Local Data File
    SetProfileDataFromDB(dev, Obj, callback) {
        if (env.BuiltType == 1) {
            callback();
            return;
        }

        const SetProfileData = (iProfile) => {
            var ProfileData = dev.deviceData.profile[iProfile];
            if (iProfile < 3 && ProfileData != undefined) {
                var KeyAssignData = ProfileData.keybinding;
                var LightingData = ProfileData.lighting;
                var PerformanceData = ProfileData.performance;
                var ObjKeyAssign = {
                    iProfile: iProfile,
                    KeyAssignData: KeyAssignData,
                };
                var ObjLighting = {
                    iProfile: iProfile,
                    LightingData: LightingData,
                };
                var ObjPerformance = {
                    iProfile: iProfile,
                    PerformanceData: PerformanceData,
                };
                this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                    this.SetLEDEffect(dev, ObjLighting, (param3) => {
                        this.SetPerformance(dev, ObjPerformance, (param4) => {
                            SetProfileData(iProfile + 1);
                        });
                    });
                });
            } else {
                this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                    //Set LEDBrightness
                    var iProfile = dev.deviceData.profileindex - 1;
                    var ProfileData = dev.deviceData.profile[iProfile];
                    var LightingData = ProfileData.lighting;
                    var ObjLighting = {
                        iProfile: iProfile,
                        LightingData: LightingData,
                    };
                    this.SetLEDBright(dev, ObjLighting, (param1) => {
                        //-------------dpiSelectIndex---------------
                        var ProfileData = dev.deviceData.profile[iProfile];
                        var PerformanceData = ProfileData.performance;
                        var ObjActiveDPI = { profile: iProfile, activeDPI: PerformanceData.dpiSelectIndex };
                        if (PerformanceData.dpiSelectIndex == undefined) {
                            ObjActiveDPI.activeDPI = 0;
                        }
                        //-------------dpiSelectIndex---------------
                        this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param2) => {
                            //Set ActiveDPIStage Into Device
                            this.setProfileToDevice(dev, (paramDB) => {
                                callback('SetProfileDataFromDB Done');
                            });
                        });
                    });
                });
            }
        };

        SetProfileData(0);
    }
    //Apply and Send data Fron Frontend,the subprogram that can choose type
    SetKeyMatrix(dev, Obj, callback) {
        env.log('ModelOSeries', 'SetKeyMatrix', 'Begin');
        dev.deviceData.profile = Obj.profileData; //Assign profileData From Obj
        var iProfile = dev.deviceData.profileindex - 1; //Assign profileindex From deviceData
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
                //Send Key data,Macro data and convert deviceData into Firmware
                case switchUIflag.keybindingflag: //Set Device keybinding(Key Assignment)
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var KeyAssignData = Obj.profileData[iProfile].keybinding;
                        var ObjKeyAssign = {
                            iProfile: iProfile,
                            KeyAssignData: KeyAssignData,
                        };
                        var ObjMacroData = {
                            MacroData: MacroData,
                        };
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                                this.setProfileToDevice(dev, (paramDB) => {
                                    //Save DeviceData into Database
                                    dev.m_bSetHWDevice = false;
                                    callback('SetKeyMatrix Done');
                                });
                            });
                        });
                    });
                    break;
                //Send lighting data and convert deviceData into Firmware
                case switchUIflag.lightingflag: //Set Device Lighting
                    var LightingData = Obj.profileData[iProfile].lighting;
                    var ObjLighting = {
                        iProfile: iProfile,
                        LightingData: LightingData,
                    };
                    this.SetLEDEffect(dev, ObjLighting, (param2) => {
                        this.SetLEDBright(dev, ObjLighting, (param25) => {
                            this.setProfileToDevice(dev, (paramDB) => {
                                //Save DeviceData into Database
                                //When Changing Effect , DockedEffect is set to 0
                                dev.ChangingDockedEffect = 0;
                                dev.m_bSetHWDevice = false;
                                callback('SetKeyMatrix Done');
                            });
                        });
                    });
                    break;
                //Send performance data and convert deviceData into Firmware
                case switchUIflag.performanceflag: //Set Device Performance
                    var PerformanceData = Obj.profileData[iProfile].performance;
                    var ObjPerformance = {
                        iProfile: iProfile,
                        PerformanceData: PerformanceData,
                    };
                    this.SetPerformance(dev, ObjPerformance, (param1) => {
                        //-------------dpiSelectIndex---------------
                        var ObjActiveDPI = {
                            profile: iProfile,
                            activeDPI: Obj.profileData[iProfile].performance.dpiSelectIndex,
                        };
                        if (ObjPerformance.PerformanceData.dpiSelectIndex == undefined) {
                            ObjActiveDPI.activeDPI = 0;
                        }
                        //-------------dpiSelectIndex---------------
                        this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param2) => {
                            //Set ActiveDPIStage Into Device
                            this.setProfileToDevice(dev, (paramDB) => {
                                //Save DeviceData into Database
                                dev.m_bSetHWDevice = false;
                                callback('SetKeyMatrix Done');
                            });
                        });
                    });
                    break;
            }
        } catch (e) {
            env.log('ModelOSeries', 'SetKeyMatrix', `Error:${e}`);
        }
    }
    //Send performance data and convert deviceData into Firmware
    SetPerformance(dev, ObjPerformance, callback) {
        env.log(dev.BaseInfo.devicename, 'SetPerformance', 'Begin');
        //------------Total DPI levels-------------
        var DpiStage = ObjPerformance.PerformanceData.DpiStage;
        var DataDPIStages = Buffer.alloc(65);
        DataDPIStages[0] = ObjPerformance.iProfile + 1;
        DataDPIStages[1] = DpiStage.length; //DPI Stages Number

        for (
            var i = 0;
            i < DpiStage.length;
            i++ //DPI resolution
        ) {
            DataDPIStages[2 + i * 4 + 0] = DpiStage[i].value >> 8; //DPI Stage X High Byte
            DataDPIStages[2 + i * 4 + 1] = DpiStage[i].value & 0xff; //DPI Stage X Low Byte
            DataDPIStages[2 + i * 4 + 2] = DpiStage[i].value >> 8; //DPI Stage Y High Byte
            DataDPIStages[2 + i * 4 + 3] = DpiStage[i].value & 0xff; //DPI Stage Y Low Byte
        }
        //------------Total DPI levels-------------
        //------------DPI stage Color-------------
        var DataDPIColor = Buffer.alloc(65);
        DataDPIColor[0] = ObjPerformance.iProfile + 1;

        for (
            var i = 0;
            i < DpiStage.length;
            i++ //DPI resolution
        ) {
            var DPIColor = this.hexToRgb(DpiStage[i].color);
            DataDPIColor[1 + i * 3 + 0] = DPIColor!.color.R; //DPI Color R
            DataDPIColor[1 + i * 3 + 1] = DPIColor!.color.G; //DPI Color G
            DataDPIColor[1 + i * 3 + 2] = DPIColor!.color.B; //DPI Color B
        }
        //------------DPI stage Color-------------
        //-------------Calibration setting (Lod)---------------
        var DataCalibration: any[] = [];
        //For Model O2 Pro Series,Separate Wireless PollingRate Value,then use pollingratearray
        if (
            dev.BaseInfo.SN == '0x258A0x201B' ||
            dev.BaseInfo.SN == '0x258A0x201C' ||
            dev.BaseInfo.SN == '0x258A0x2019' ||
            dev.BaseInfo.SN == '0x258A0x201D' ||
            dev.BaseInfo.SN == '0x258A0x201A'
        ) {
            //20231117 NEW Firmware-Add Separete with Profile
            DataCalibration.push(ObjPerformance.iProfile + 1);
        }
        DataCalibration.push(ObjPerformance.PerformanceData.LodValue); //1MM~2MM
        //-------------Calibration setting (Lod)---------------
        //-------------Polling Rate---------------
        var DataPollingRate: any[] = []; //Empty Array
        var arrNewRateValue = [
            { PollingRate: 125, HIDvalue: 8, translate: '125Hz', Wireless: true },
            { PollingRate: 250, HIDvalue: 4, translate: '250Hz', Wireless: true },
            { PollingRate: 500, HIDvalue: 2, translate: '500Hz', Wireless: true },
            { PollingRate: 1000, HIDvalue: 1, translate: '1000Hz', Wireless: true },
            { PollingRate: 2000, HIDvalue: 0x20, translate: '2000Hz', Wireless: true },
            { PollingRate: 4000, HIDvalue: 0x40, translate: '4000Hz', Wireless: true },
            { PollingRate: 8000, HIDvalue: 0x80, translate: '8000Hz', Wireless: false },
        ];
        //For Model O2 Pro Series,Separate Wireless PollingRate Value,then use pollingratearray
        if (
            dev.BaseInfo.SN == '0x258A0x201D' ||
            dev.BaseInfo.SN == '0x258A0x201B' ||
            dev.BaseInfo.SN == '0x258A0x201C' ||
            dev.BaseInfo.SN == '0x258A0x2019' ||
            dev.BaseInfo.SN == '0x258A0x201A'
        ) {
            //20231108 NEW Firmware-Add Separete with Profile
            DataPollingRate.push(ObjPerformance.iProfile + 1);

            const pollingratearray = ObjPerformance.PerformanceData.pollingratearray;
            for (let index = 0; index < pollingratearray.length; index++) {
                var target;
                //pollingrateSelect is true,Separate Wireless PollingRate Value,with pollingratearray
                if (ObjPerformance.PerformanceData.pollingrateSelect == true) {
                    target = arrNewRateValue.find((x) => x.PollingRate == pollingratearray[index]);
                    DataPollingRate.push(target.Wireless == false && index == 1 ? 0x40 : target.HIDvalue);
                } else {
                    target = arrNewRateValue.find((x) => x.PollingRate == pollingratearray[0]);
                    DataPollingRate.push(target.HIDvalue);
                    if (pollingratearray.length == 1) {
                        DataPollingRate.push(target.Wireless == false ? 0x40 : target.HIDvalue); //Wireless Value
                    }
                }
            }
        } else {
            var target: any = arrNewRateValue.find((x) => x.PollingRate == ObjPerformance.PerformanceData.pollingrate);
            if (target != undefined) {
                DataPollingRate.push(target.HIDvalue);
            }
        }
        //-------------Polling Rate---------------
        //-------------Debounce time-Add CheckSlam Value---------------
        var DataDebounce: any[] = []; //Empty Array
        DataDebounce.push(ObjPerformance.iProfile + 1); //Byte 0
        if (ObjPerformance.PerformanceData.AdvancedDebounce != undefined) {
            if (ObjPerformance.PerformanceData.AdvancedDebounce.AdvancedSwitch == true) {
                DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.BeforePressValue); //Byte 1
                DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.BeforeReleaseValue); //Byte 2
                DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.AfterPressValue); //Byte 3
                DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.AfterReleaseValue); //Byte 4
                DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.LiftOffPressValue); //Byte 5
                DataDebounce.push(0x00); //Byte 6-resvd
            } else {
                DataDebounce.push(ObjPerformance.PerformanceData.DebounceValue); //When it is only set for DebounceTime, only set BeforePressValue
                DataDebounce.push(0x00);
                DataDebounce.push(0x00);
                DataDebounce.push(0x00);
                DataDebounce.push(0x00);
                DataDebounce.push(0x00);
            }
        } else {
            DataDebounce.push(ObjPerformance.PerformanceData.DebounceValue); //Byte 1
        }
        //-------------Motion Sync setting---------------
        var DataMotionSync = Buffer.alloc(2);
        if (
            ObjPerformance.PerformanceData.MotionSyncFlag != undefined &&
            (dev.BaseInfo.SN == '0x258A0x201D' ||
                dev.BaseInfo.SN == '0x258A0x201B' ||
                dev.BaseInfo.SN == '0x258A0x201C' ||
                dev.BaseInfo.SN == '0x258A0x2019' ||
                dev.BaseInfo.SN == '0x258A0x201A')
        ) {
            DataMotionSync[0] = ObjPerformance.iProfile + 1;
            DataMotionSync[1] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
        } else {
            DataMotionSync[0] = 0xff; //MotionSync Not used
        }
        //-------------Assign to Device---------------
        this.SetDPIStages2Device(dev, DataDPIStages, (param1) => {
            //Set DPIStage Into Device
            this.SetDPIColor2Device(dev, DataDPIColor, (param2) => {
                //Set DPIColor Into Device
                this.SetCalibration2Device(dev, DataCalibration, (param3) => {
                    //Set Calibration Into Device
                    this.SetPollingRate2Device(dev, DataPollingRate, (param4) => {
                        //Set PollingRate Into Device
                        this.SetDebounce2Device(dev, DataDebounce, (param5) => {
                            //Set Debounce Into Device
                            this.SetMotionSync2Device(dev, DataMotionSync, (param6) => {
                                //Set MotionSync Into Device
                                callback('SetPerformance Done');
                            });
                        });
                    });
                });
            });
        });
    }

    //Send current DPI stage from frontend
    SetActiveDPIStages2Device(dev, ObjActiveDPI, callback) {
        try {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x02;
            Data[5] = 0x01;
            Data[6] = 0x02;

            Data[7] = ObjActiveDPI.profile + 1;
            Data[8] = ObjActiveDPI.activeDPI + 1;
            this.SetFeatureReport(dev, Data, 120).then(() => {
                callback('SetActiveDPIStages2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetActiveDPIStages2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetDPIStages2Device(dev, DataBuffer, callback) {
        try {
            var Data = Buffer.alloc(65);
            var iDataNum = DataBuffer[1] * 4 + 2;
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = iDataNum;
            Data[5] = 0x01;
            Data[6] = 0x01;

            for (var i = 0; i < 58; i++) Data[7 + i] = DataBuffer[i];
            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetDPIStages2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetDPIStages2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetDPIColor2Device(dev, DataBuffer, callback) {
        try {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x13;
            Data[5] = 0x02;
            Data[6] = 0x01;
            for (var i = 0; i < 58; i++) Data[7 + i] = DataBuffer[i];
            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetDPIStages2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetDPIStages2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetCalibration2Device(dev, DataBuffer, callback) {
        try {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = DataBuffer.length; //Data Size
            Data[5] = 0x01;

            if (
                dev.BaseInfo.SN == '0x258A0x201B' ||
                dev.BaseInfo.SN == '0x258A0x201C' ||
                dev.BaseInfo.SN == '0x258A0x2019' ||
                dev.BaseInfo.SN == '0x258A0x201A' ||
                dev.BaseInfo.SN == '0x258A0x201D'
            ) {
                Data[6] = 0x0b; //Universal Calibration Setting V2
            } else {
                Data[6] = 0x08; //Universal Calibration Setting for old devices
            }

            for (var i = 0; i < DataBuffer.length; i++) {
                Data[7 + i] = DataBuffer[i];
            }
            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetCalibration2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetCalibration2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetPollingRate2Device(dev, DataBuffer, callback) {
        try {
            if (DataBuffer.length < 1) {
                return callback();
            }
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = DataBuffer.length; //Data Size
            Data[5] = 0x01;
            if (
                dev.BaseInfo.SN == '0x258A0x201B' ||
                dev.BaseInfo.SN == '0x258A0x201D' ||
                dev.BaseInfo.SN == '0x258A0x201C' ||
                dev.BaseInfo.SN == '0x258A0x2019' ||
                dev.BaseInfo.SN == '0x258A0x201A'
            ) {
                Data[6] = 0x0a; //Device Polling Info V2
            } else {
                Data[6] = 0x00; //Device Polling Info for old devices
            }

            for (var i = 0; i < DataBuffer.length; i++) {
                Data[7 + i] = DataBuffer[i];
            }
            this.SetFeatureReport(dev, Data, 30).then(() => {
                callback('SetPollingRate2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetPollingRate2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetDebounce2Device(dev, DataBuffer, callback) {
        try {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = DataBuffer.length; //Data Size
            Data[5] = 0x00;
            Data[6] = 0x08;

            for (var i = 0; i < 58; i++) {
                Data[7 + i] = DataBuffer[i];
            }
            this.SetAndCheckStatus(dev, Data, 50).then(() => {
                callback('SetDebounce2Device Done');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetDebounce2Device', `Error:${e}`);
        }
    }
    //Send Converted deviceData into Firmware
    SetMotionSync2Device(dev, DataBuffer, callback) {
        try {
            if (DataBuffer[0] == 0xff) {
                //Not O2 Pro Series,then turn back
                return callback();
            }
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x02; //Data Size
            Data[5] = 0x01;
            Data[6] = 0x09;

            for (var i = 0; i < 2; i++) {
                Data[7 + i] = DataBuffer[i];
            }
            this.SetAndCheckStatus(dev, Data, 50).then(() => {
                callback();
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetMotionSync2Device', `Error:${e}`);
        }
    }

    //-------------------Set Key Function And Macro----------------------
    //Send Macro data and convert deviceData into Firmware
    SetMacroFunction(dev, ObjMacroData, callback) {
        const SetMacro = (iMacro) => {
            if (iMacro < ObjMacroData.MacroData.length) {
                var MacroData = ObjMacroData.MacroData[iMacro]; //Button
                var BufferKey = this.MacroToData(MacroData);
                var ObjMacroData2 = { MacroID: MacroData.value, MacroData: BufferKey };

                var DataDelete = Buffer.alloc(65);
                var DataCreate = Buffer.alloc(65);
                //Delete Macro
                DataDelete[0] = 0x00;
                DataDelete[1] = 0x00;
                DataDelete[2] = 0x00;
                DataDelete[3] = 0x02; //Mouse
                DataDelete[4] = 0x02;
                DataDelete[5] = 0x04;
                DataDelete[6] = 0x02;
                DataDelete[7] = MacroData.value / 0xff;
                DataDelete[8] = MacroData.value & 0xff;
                //Create Macro
                DataCreate[0] = 0x00;
                DataCreate[1] = 0x00;
                DataCreate[2] = 0x00;
                DataCreate[3] = 0x02; //Mouse
                DataCreate[4] = 0x06;
                DataCreate[5] = 0x04;
                DataCreate[6] = 0x01;
                DataCreate[7] = MacroData.value / 0xff;
                DataCreate[8] = MacroData.value & 0xff;
                DataCreate[9] = 0x00;
                DataCreate[10] = 0x00;
                DataCreate[11] = BufferKey.length / 0xff;
                DataCreate[12] = BufferKey.length & 0xff;

                this.SetAndCheckStatus(dev, DataDelete, 50).then(() => {
                    this.SetAndCheckStatus(dev, DataCreate, 50).then(() => {
                        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
                            SetMacro(iMacro + 1);
                        });
                    });
                });
            } else {
                callback('SetMacroFunction Done');
            }
        };
        SetMacro(0);
    }
    //Send Converted deviceData into Firmware
    SetMacroDataToDevice(dev, ObjMacroData, callback) {
        var MacroID = ObjMacroData.MacroID;
        var MacroData = ObjMacroData.MacroData;

        const SetMacroData = (iMacro) => {
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02; //Mouse
            Data[4] = 0x00; //Data Size
            Data[5] = 0x04;
            Data[6] = 0x03;
            Data[7] = MacroID / 0xff;
            Data[8] = MacroID & 0xff;
            var iMaxSize = 51;
            var iOffset = iMacro * iMaxSize;
            if (iOffset < MacroData.length) {
                Data[11] = iOffset / 0xff; //High Byte of Macro ID
                Data[12] = iOffset & 0xff; //Low Byte of Macro ID
                var iSize = MacroData.length % iMaxSize;
                Data[13] = iSize; //Macro Data Sizeif((MacroData.length-iOffset)/(iMaxSize + 1)>=1)//Is out of Maximium Size,Assign Macro Data Size into MaxSize
                Data[13] = iMaxSize; //Data(51)

                //Data size is limited to a maximum length of 64(Max Packet Size)-6(Header Size) = 58
                Data[4] = Data[13] + 7; //Set Data Size:Parameters(7) + Data(51)
                for (var k = 0; k < iMaxSize; k++) {
                    if (iOffset + k >= MacroData.length) break;
                    Data[14 + k] = MacroData[iOffset + k];
                }
                var delaytime = 50;
                if (iMacro >= 5) delaytime = 70;

                this.SetAndCheckStatus(dev, Data, delaytime).then(() => {
                    SetMacroData(iMacro + 1);
                });
            } else {
                callback();
            }
        };
        SetMacroData(0);
    }
    //convert APP Macro Data into deviceData
    MacroToData(MacroData) {
        var BufferKey: any[] = []; //MacroDataBuffer to Device
        var DataEvent: any[] = []; //DataEvent
        //------------Turns Hash Keys into Event Array-------------
        var Macrokeys = Object.keys(MacroData.content);
        for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
            var Hashkeys = this.MouseMacroContentMap[Macrokeys[icontent]];
            for (var iData = 0; iData < MacroData.content[this.MouseMacroContentMap[Hashkeys]].data.length; iData++) {
                var MacroEvent = {
                    keydown: true,
                    key: Hashkeys,
                    times: MacroData.content[this.MouseMacroContentMap[Hashkeys]].data[iData].startTime,
                };
                DataEvent.push(MacroEvent);
                MacroEvent = {
                    keydown: false,
                    key: Hashkeys,
                    times: MacroData.content[this.MouseMacroContentMap[Hashkeys]].data[iData].endTime,
                };
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
            //Assign Keyboard KeyCode to KeyCode
            for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
                if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
                    KeyCode = SupportData.AllFunctionMapping[i].hid as number;
                    break;
                }
            }
            //Assign Mouse KeyCode to KeyCode
            for (var i = 0; i < this.MouseMapping.length; i++) {
                if (DataEvent[iEvent].key == this.MouseMapping[i].code) {
                    var Mousehid = this.MouseMapping[i].hid;
                    KeyCode = DataEvent[iEvent].keydown ? Mousehid : 0;
                    bMouseButton = true;
                    break;
                }
            }
            //Assign MDF KeyCode to KeyCode
            for (var i = 0; i < this.MDFMapping.length; i++) {
                if (DataEvent[iEvent].key == this.MDFMapping[i].code) {
                    KeyCode = this.MDFMapping[i].MDFKey;
                    bModifyKey = true;
                    break;
                }
            }

            var ID;
            //Assign Delay to Event
            if (iEvent > 0) {
                var iDelay =
                    DataEvent[iEvent].times - DataEvent[iEvent - 1].times > 0
                        ? DataEvent[iEvent].times - DataEvent[iEvent - 1].times
                        : 1;

                ID = iDelay <= 255 ? 0x20 : 0x21;
                if (ID == 0x20) {
                    //DELAY_1
                    BufferKey.push(ID);
                    BufferKey.push(iDelay);
                } else {
                    //DELAY_2
                    BufferKey.push(ID);
                    //BufferKey.push(0x21);
                    BufferKey.push(iDelay / 0xff);
                    BufferKey.push(iDelay & 0xff);
                }
            }
            //Assign KeyCode Make/Break to Event
            if (bMouseButton) ID = DataEvent[iEvent].keydown ? 1 : 1;
            else if (bModifyKey) ID = DataEvent[iEvent].keydown ? 9 : 10;
            else ID = DataEvent[iEvent].keydown ? 2 : 3;
            BufferKey.push(ID);
            BufferKey.push(KeyCode);
        }
        return BufferKey;
    }
    //Send Button data and convert deviceData into Firmware
    SetKeyFunction(dev, ObjKeyAssign, callback) {
        //------------KeyAssignment-------------
        var iProfile = ObjKeyAssign.iProfile;
        const SetAssignKey = (iButton) => {
            if (iButton < ObjKeyAssign.KeyAssignData.length) {
                var KeyAssignData = ObjKeyAssign.KeyAssignData[iButton]; //Button
                var BufferKey = this.KeyAssignToData(KeyAssignData);
                var DataBuffer = Buffer.alloc(58); //KeyData length:64-6
                DataBuffer[0] = iProfile + 1; //Profile
                //-------------------------------------
                DataBuffer[1] = this.ButtonMapping[iButton].ButtonID;
                //-------------------------------------
                // DataBuffer[1] = iButton+1;//Button
                // if (this.Matrix_KeyCode_ModelO[iButton] == "DPISwitch") {
                //     DataBuffer[1] = 0x14;
                // }
                //-------------------------------------
                DataBuffer[2] = 0;
                for (
                    var i = 0;
                    i < BufferKey.length;
                    i++ //Buffer 6+3 to Buffer 6+58
                )
                    DataBuffer[3 + i] = BufferKey[i];
                //------------KeyAssignment-------------
                var Data = Buffer.alloc(65);
                Data[0] = 0x00;
                Data[1] = 0x00;
                Data[2] = 0x00;
                Data[3] = 0x02; //Mouse
                Data[4] = 0x0a;
                Data[5] = 0x03;
                Data[6] = 0x00;
                for (
                    var i = 0;
                    i < DataBuffer.length;
                    i++ //30
                )
                    Data[7 + i] = DataBuffer[i];
                //-----------------------------------
                return new Promise((resolve) => {
                    this.SetAndCheckStatus(dev, Data, 100).then(() => {
                        SetAssignKey(iButton + 1);
                    });
                });
                //-----------------------------------
            } else {
                callback('SetKeyFunction Done');
            }
        };
        SetAssignKey(0);
    }
    //convert APP KeyAssign Data into deviceData
    KeyAssignToData(KeyAssignData) {
        var BufferKey = Buffer.alloc(55); //KeyData length:5*11
        switch (KeyAssignData.group) {
            case 1: //Macro Function
                if (KeyAssignData.param == 3) {
                    //Toggle
                    BufferKey[0] = 0x12; //ID:Macro Button
                    BufferKey[1] = 0x02; //Size
                } else if (KeyAssignData.param == 2) {
                    //Repeat while holding
                    BufferKey[0] = 0x11; //ID:Macro Button
                    BufferKey[1] = 0x02; //Size
                } else {
                    BufferKey[0] = 0x10; //ID:Macro Button
                    BufferKey[1] = 0x03; //Size
                    BufferKey[4] = 0x01; //Repeat Times
                }
                BufferKey[2] = KeyAssignData.function >> 8; //Macro ID-Highbyte
                BufferKey[3] = KeyAssignData.function & 0xff; //Macro ID-Lowbyte
                break;
            case 7: //Key Function
                for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                    if (KeyAssignData.function == SupportData.AllFunctionMapping[iMap].value) {
                        var arrModifiers = [1, 0, 2, 3, 4];
                        BufferKey[0] = 0x04; //ID:Keyboard Button
                        BufferKey[1] = 0x02; //Size
                        BufferKey[2] = 0x00; //Modifiers.
                        for (var index = 0; index < KeyAssignData.param.length; index++) {
                            if (KeyAssignData.param[index] == true) BufferKey[2] |= Math.pow(2, arrModifiers[index]); //Binary To Byte
                        }
                        if (SupportData.AllFunctionMapping[iMap].Modifier != undefined)
                            BufferKey[2] |= SupportData.AllFunctionMapping[iMap].Modifier!;
                        else BufferKey[3] = SupportData.AllFunctionMapping[iMap].hid as number; //key code.
                        //BufferKey[2] = 0x01;//Modifiers.
                        //BufferKey[3] = 0x00;//Modifiers.
                        break;
                    }
                }
                break;
            case 3: //Mouse Function
                var arrMouseValue = [1, 1, 2, 3, 5, 4, 0x10, 0x11, 0x18, 0x19, 0x0c];
                BufferKey[0] = 0x01; //ID:Mouse Button
                BufferKey[1] = 0x01; //Size
                BufferKey[2] = arrMouseValue[KeyAssignData.function]; //P1
                if (arrMouseValue[KeyAssignData.function] == 0x0c) {
                    //Battery Indication
                    BufferKey[0] = 0x0c; //ID:Mouse Button
                    BufferKey[2] = 0x01;
                } else if (arrMouseValue[KeyAssignData.function] == 0x18) {
                    //Profile loopUp
                    BufferKey[0] = 0x08; //ID:Profile
                    BufferKey[2] = 0x04;
                } else if (arrMouseValue[KeyAssignData.function] == 0x19) {
                    //Profile loopDown
                    BufferKey[0] = 0x08; //ID:Profile
                    BufferKey[2] = 0x03;
                }
                break;
            case 8: //Keyboard Profile/Layer Switch
                BufferKey[0] = 0x05; //ID:consumer Keys
                BufferKey[1] = 0x02; //Size
                BufferKey[2] = KeyAssignData.value; //Button ID
                BufferKey[3] = 0x0f; //Launch ID
                break;
            case 4: //DPI Switch
                var arrDPIValue = [1, 1, 2, 6, 7, 5];
                BufferKey[0] = 0x07; //ID:DPI
                BufferKey[1] = 0x01; //Size
                BufferKey[2] = arrDPIValue[KeyAssignData.function]; //P1
                if (arrDPIValue[KeyAssignData.function] == 5) {
                    //Sniper DPI
                    var DpiValue = KeyAssignData.param;
                    BufferKey[1] = 0x05; //Size
                    BufferKey[2] = 0x05; //Sniper DPI
                    BufferKey[3] = parseInt(DpiValue) >> 8; //Sniper DPI-X-Highbyte
                    BufferKey[4] = parseInt(DpiValue) & 0xff; //Sniper DPI-X-Lowbyte
                    BufferKey[5] = parseInt(DpiValue) >> 8; //Sniper DPI-Y-Highbyte
                    BufferKey[6] = parseInt(DpiValue) & 0xff; //Sniper DPI-Y-Lowbyte
                }
                break;
            case 5: //Multi Media
                var hidMap = SupportData.MediaMapping[KeyAssignData.function].hidMap;
                BufferKey[0] = 0x05; //ID:consumer Keys
                BufferKey[1] = 0x02; //Size
                for (var index = 0; index < hidMap.length; index++) {
                    BufferKey[2 + index] = hidMap[index];
                }
                break;
            case 2: //Windows Shortcut/Launch
                if (KeyAssignData.function == 1) {
                    //Launch Program
                    BufferKey[0] = 0x05; //ID:consumer Keys
                    BufferKey[1] = 0x02; //Size
                    BufferKey[2] = KeyAssignData.value; //Button ID
                    BufferKey[3] = 0x0f; //Launch ID
                } else if (KeyAssignData.function == 2) {
                    //Launch WebSite
                    BufferKey[0] = 0x05; //ID:consumer Keys
                    BufferKey[1] = 0x02; //Size
                    BufferKey[2] = KeyAssignData.value; //Button ID
                    BufferKey[3] = 0x0f; //Launch ID
                } else if (KeyAssignData.function == 3) {
                    //Windows Shortcut
                    var hidMap: number[];
                    if (KeyAssignData.param == 4) {
                        //Explorer
                        hidMap = [0x08, 0x08]; //Windows+E
                        BufferKey[0] = 0x04; //ID:consumer Keys
                        BufferKey[1] = 0x02; //Size
                    } else {
                        hidMap = SupportData.WindowsMapping[KeyAssignData.param].hidMap;
                        BufferKey[0] = 0x05; //ID:consumer Keys
                        BufferKey[1] = 0x02; //Size
                    }
                    for (var index = 0; index < hidMap.length; index++) {
                        BufferKey[2 + index] = hidMap[index];
                    }
                }
                break;
            case 6: //Disable
                BufferKey[0] = 0x00; //ID:Disable
                BufferKey[1] = 0x00; //Size
                break;
            default:
                break;
        }
        return BufferKey;
    }
    //-------------------Set Key Function End----------------------

    SetAndCheckStatus(dev, buf, iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                var csFailStasus;
                var rtnData;
                rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 65, buf);
                const SetCheckStatus = (iTimes) => {
                    var WaitCount = 3;
                    if (dev.SetFromDB == true) {
                        WaitCount = 2;
                    } else if (dev.BaseInfo.LEDSetting == false) {
                        WaitCount = 10;
                    }
                    if (iTimes < WaitCount) {
                        // if (bwireless == true){
                        if (!dev.bwaitForPair) {
                            setTimeout(() => {
                                //var BufferGet = Buffer.alloc(65);//KeyData
                                //rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, BufferGet);
                                rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 65); // this function only takes 3 params; not sure why 4 were being passed
                                if (rtnData[0] == 0xa2) {
                                    //0xa2:Firmware Command Failure
                                    csFailStasus = '0xa2-Firmware Command Failure';
                                    setTimeout(() => {
                                        this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 65, buf);
                                        SetCheckStatus(iTimes + 1);
                                    }, 40);
                                } else if (rtnData[0] == 0xa0) {
                                    //0xa0:Firmware Command Busy
                                    csFailStasus = '0xa0-Firmware Command Busy';
                                    setTimeout(() => {
                                        SetCheckStatus(iTimes + 1);
                                    }, 40);
                                } else if (rtnData[0] == 0xa4) {
                                    //0xa4:Wireless-Receiver Did Not Find Device
                                    csFailStasus = '0xa4-Wireless-Receiver Did Not Find Device';
                                    // //dev.bwaitForPair = true;
                                    // this.hid.SetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, buf);
                                    // setTimeout(function(){
                                    SetCheckStatus(iTimes + 1);
                                    // },80);
                                } else {
                                    resolve(rtnData);
                                }
                            }, iSleep);
                        } else {
                            // is waitForPair
                            dev.arrLostBuffer = buf;
                            setTimeout(() => {
                                env.log('ModelOSeries', 'SetAndCheckStatus', 'waitForPair- times:' + iTimes);
                                SetCheckStatus(iTimes + 1);
                            }, iSleep);
                        }
                    } else {
                        env.log('ModelOSeries', 'SetAndCheckStatus', 'Fail:' + csFailStasus || rtnData[0]);
                        resolve(0);
                    }
                };
                SetCheckStatus(0);
            } catch (err) {
                env.log('DeviceApi Error', 'SetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }

    //Send Firmware Data Into node Driver
    SetFeatureReport(dev, buf, iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 65, buf);
                setTimeout(() => {
                    // if(rtnData != 65)
                    //     env.log("DeviceApi SetFeatureReport","SetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('DeviceApi Error', 'SetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }

    GetFeatureReport(dev, buf, iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                // var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, buf);
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 65);
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

    /**
     * Save Device Data to Device
     * @param {*} dev
     */
    SavingProfile2Device(dev) {
        return new Promise((resolve) => {
            var Data = Buffer.alloc(65);
            Data[0] = 0x07;
            Data[1] = 0xa6;
            Data[2] = 0x01; //AP Mode
            Data[3] = 0x4b;
            //Profile:1~5
            if (m_CurrentData.CurrentSW > 2) {
                //Profile4-VirtualProfile
                Data[6] = 4; //Profile4-VirtualProfile
            } else {
                Data[6] = m_CurrentData.CurrentSW + 1; //Number of profiles
            }

            // //-----------------------------------
            this.SetFeatureReport(dev, Data, 5).then(() => {
                resolve('12');
            });
        });
    }

    //
    DockedCharging(dev, Obj, callback) {
        try {
            if (Obj.Charging != dev.ChangingDockedEffect) {
                dev.ChangingDockedEffect = Obj.Charging;

                var iProfile = dev.deviceData.profileindex - 1;
                var ProfileData = dev.deviceData.profile[iProfile];
                var LightingData;
                if (dev.ChangingDockedEffect) {
                    LightingData = ProfileData.templighting[5]; //Rate Effect
                } else {
                    LightingData = ProfileData.lighting; //Current Lighting
                }

                var ObjLighting = {
                    iProfile: iProfile,
                    LightingData: LightingData,
                };
                this.SetLEDEffect(dev, ObjLighting, (param1) => {});
            }
            callback('DockedCharging Done');
        } catch (e) {
            env.log('ModelOSeries', 'DockedCharging', `Error:${e}`);
        }
    }
    //------------------Dongle Pairing--------------------------

    //Start Dongle Pairing For MOW2 Pro Series
    DongleParingStart(dev, AssignSN, callback) {
        env.log('ModelOSeries', 'DongleParingStart', 'Begin');
        if (env.BuiltType == 1) {
            return callback('DongleParingStart Done');
        }
        //Only For Model O2 Pro Series
        if (
            dev.BaseInfo.SN != '0x258A0x201B' &&
            dev.BaseInfo.SN != '0x258A0x201C' &&
            dev.BaseInfo.SN != '0x258A0x2019' &&
            dev.BaseInfo.SN != '0x258A0x201A' &&
            dev.BaseInfo.SN != '0x258A0x201D' &&
            dev.BaseInfo.SN != '0x258A0x2037' &&
            dev.BaseInfo.SN != '0x258A0x2038'
        ) {
            return callback('DongleParingStart Done');
        }
        this.DeleteBatteryTimeout(dev, 0, () => {});

        try {
            var res = this.modelO2ProPairing!.OpenDongleDevice(dev);
            if (res && dev.BaseInfo.pairingFlag != undefined && dev.BaseInfo.pairingFlag == 3) {
                //For 4K/8K Dongle
                this.modelO2ProPairing!.StartRFDevicePairing(dev, (res) => {
                    if (res == true && dev.TimerWait4K8KParing == undefined) {
                        dev.TimerWait4K8KParing = setInterval(() => this.OnTimerWait4K8KPairing(dev, AssignSN), 2000);
                    }
                });
            } else if (res) {
                this.modelO2ProPairing!.CheckPairingAddress(dev, (res, arrAddress) => {
                    if (res == true) {
                        setTimeout(() => {
                            this.PairingSuccess(dev);
                        }, 500);
                    } else {
                        this.modelO2ProPairing!.SetAddresstoDongle(dev, arrAddress, (res) => {
                            this.modelO2ProPairing!.SetVIDPIDtoDongle(dev, (res) => {
                                this.modelO2ProPairing!.ResetDongle(dev, (res) => {
                                    this.OnTimerWaitParing(dev);
                                });
                            });
                        });
                    }
                });
            } else {
                this.PairingFail(dev, false);
                env.log('ModelOSeries', dev.BaseInfo.devicename, 'Cannot find Dongle Device');
            }

            callback();
        } catch (e) {
            env.log('ModelOSeries', 'DongleParingStart', `Error:${e}`);
            this.PairingFail(dev, false);
            callback();
        }
    }

    OnTimerWaitParing(dev) {
        dev.TimerWaitParing = setInterval(() => {
            var res = this.modelO2ProPairing!.OpenDongleDevice(dev);
            if (res) {
                this.modelO2ProPairing!.CheckPairingAddress(dev, (res1) => {
                    if (res1 == true) {
                        clearInterval(dev.TimerWaitParing);
                        this.PairingSuccess(dev);
                    }
                });
            }
        }, 2000);
    }

    OnTimerWait4K8KPairing(dev, AssignSN) {
        var res = this.modelO2ProPairing!.OpenDongleDevice(dev);
        if (!res && AssignSN != undefined) {
            //After pairing is completed, the Dongle is replaced with another device, so if the original device cannot be read, it is considered successful.
            clearInterval(dev.TimerWait4K8KParing);
            //delete dev.TimerWait4K8KParing;

            this.PairingSuccess(dev);
        } else if (res) {
            this.modelO2ProPairing!.GetRFDevicePairingStatus(dev, (res1) => {
                if (res1 == 1) {
                    //1:Success,0:Waiting,-1:Fail
                    clearInterval(dev.TimerWait4K8KParing);
                    //delete dev.TimerWait4K8KParing;
                    this.PairingSuccess(dev);
                } else if (res1 == -1) {
                    clearInterval(dev.TimerWait4K8KParing);
                    //delete dev.TimerWait4K8KParing;
                    this.PairingFail(dev, false);
                }
            });
        }
    }

    //-------------Pairing For MOWPro V2 Series-------------------------
    PairingFail(dev, bRefresh) {
        dev.m_bDonglepair = false;
        if (bRefresh) {
            this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {});
        }
        var Obj2 = {
            Func: 'PairingFail',
            SN: dev.BaseInfo.SN,
            Param: {},
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
    }
    PairingSuccess(dev) {
        dev.m_bDonglepair = false;
        var Obj2 = {
            Func: 'PairingSuccess',
            SN: dev.BaseInfo.SN,
            Param: {},
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        env.log(dev.BaseInfo.devicename, 'CheckDetectfromDevice', 'PairingSuccess');
    }
}

module.exports = ModelOSeries;
