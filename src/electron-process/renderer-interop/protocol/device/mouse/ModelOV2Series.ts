import { EventTypes } from '../../../../../common/EventVariable';
import { SupportData } from '../../../../../common/SupportData';
import { env } from '../../../others/env';
import { Mouse } from './Mouse';
import { GetValidURL } from '../../../../../common/utils';

export class ModelOV2Series extends Mouse {
    static #instance?: ModelOV2Series;

    m_bSetFWEffect: boolean;
    m_bSetHWDevice: boolean;

    LEDType: any[];
    MouseMapping: any[];

    constructor(hid) {
        env.log('ModelOV2Series', 'ModelOV2Series class', 'begin');
        super();
        this.m_bSetFWEffect = false; //SET DB
        this.m_bSetHWDevice = false;
        this.hid = hid;

        this.LEDType = [
            { EffectID: 0x00, HidEffectID: 0x01, ColorIndexID: 0xff, value: 'GloriousMode' },
            { EffectID: 0x01, HidEffectID: 0x02, ColorIndexID: 0xff, value: 'SeamlessBreathing' },
            { EffectID: 0x02, HidEffectID: 0x03, ColorIndexID: 0x00, value: 'Breathing' },
            { EffectID: 0x03, HidEffectID: 0x04, ColorIndexID: 0x06, value: 'SingleColor' },
            { EffectID: 0x04, HidEffectID: 0x05, ColorIndexID: 0x07, value: 'BreathingSingleColor' },
            { EffectID: 0x05, HidEffectID: 0x06, ColorIndexID: 0xff, value: 'Tail' },
            { EffectID: 0x06, HidEffectID: 0x07, ColorIndexID: 0x08, value: 'Rave' },
            { EffectID: 0x07, HidEffectID: 0x08, ColorIndexID: 0xff, value: 'Wave' },
            { EffectID: 0x08, HidEffectID: 0x00, ColorIndexID: 0xff, value: 'LEDOFF' },
        ];
        this.MouseMapping = [
            { keyCode: '16', value: 'Left Click', hid: 0xb7, code: 1 },
            { keyCode: '17', value: 'Scroll Click', hid: 0xb9, code: 3 },
            { keyCode: '18', value: 'Right Click', hid: 0xb8, code: 2 },
            { keyCode: '91', value: 'Back Key', hid: 0xba, code: 4 },
            { keyCode: '92', value: 'Forward Key', hid: 0xbb, code: 5 },
        ];
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('ModelOV2Series', 'getInstance', `Get exist ModelOV2Series() INSTANCE`);
            return this.#instance;
        } else {
            env.log('ModelOV2Series', 'getInstance', `New ModelOV2Series() INSTANCE`);
            this.#instance = new ModelOV2Series(hid);

            return this.#instance;
        }
    }

    /**
     * Init Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    InitialDevice(dev, Obj, callback) {
        try {
            env.log('ModelOV2Series', 'initDevice', 'Begin');
            dev.bwaitForPair = false;
            dev.m_bSetHWDevice = false;
            dev.m_bDonglepair = false;
            //------------------------------------------

            if (dev.BaseInfo.SN == '0x093A0x821A') {
                dev.ButtonMapping = [
                    { ButtonID: 0x00, HidButtonID: 0x00, value: 'LeftClick' },
                    { ButtonID: 0x01, HidButtonID: 0x02, value: 'ScorllClick' },
                    { ButtonID: 0x02, HidButtonID: 0x01, value: 'RightClick' },
                    { ButtonID: 0x03, HidButtonID: 0x04, value: 'Forward' },
                    { ButtonID: 0x04, HidButtonID: 0x03, value: 'Backward' },
                    { ButtonID: 0x05, HidButtonID: 0x08, value: 'DPI UP' }, //DPISwitch->DPI UP
                    { ButtonID: 0x06, HidButtonID: 0xff, value: 'Scroll Up' },
                    { ButtonID: 0x07, HidButtonID: 0xff, value: 'Scroll Down' },
                    { ButtonID: 0x08, HidButtonID: 0x06, value: 'DPI Lock' }, //(Big Side Button)
                    { ButtonID: 0x09, HidButtonID: 0x05, value: 'HOME' }, //(Former Side Button)
                    { ButtonID: 0x0a, HidButtonID: 0x07, value: 'DPI Down' },
                ];
            } else {
                dev.ButtonMapping = [
                    { ButtonID: 0x00, HidButtonID: 0x00, value: 'LeftClick' },
                    { ButtonID: 0x01, HidButtonID: 0x02, value: 'ScorllClick' },
                    { ButtonID: 0x02, HidButtonID: 0x01, value: 'RightClick' },
                    { ButtonID: 0x03, HidButtonID: 0x04, value: 'Forward' },
                    { ButtonID: 0x04, HidButtonID: 0x03, value: 'Backward' },
                    { ButtonID: 0x05, HidButtonID: 0x05, value: 'DPISwitch' },
                    { ButtonID: 0x06, HidButtonID: 0x06, value: 'Scroll Up' },
                    { ButtonID: 0x07, HidButtonID: 0x07, value: 'Scroll Down' },
                ];
            }

            //-------Initial Key/LEDCode Matrix-------
            dev.BaseInfo.version_Wireless = '0001';
            if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bootloader') {
                //Bootloader Mode
                dev.BaseInfo.version_Wired = '0001';
                callback(0);
            } else if (env.BuiltType == 0) {
                //this.ReadFWVersion(dev,0,function (ObjFWVersion) {
                this.SetProfileDataFromDB(dev, 0, () => {
                    callback(0);
                });
                //});
            } else {
                dev.BaseInfo.version_Wired = '0001';
                callback(0);
            }
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'InitialDevice', `Error:${e}`);
            callback(0);
        }
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
        const SetProfileData = (iProfile) => {
            var ProfileData = dev.deviceData.profile[iProfile];
            if (iProfile < 3 && ProfileData != undefined) {
                var KeyAssignData = ProfileData.keybinding;
                var LightingData = ProfileData.lighting;
                var PerformanceData = ProfileData.performance;
                var ObjKeyAssign = {
                    iProfile: iProfile,
                    KeyAssignData: KeyAssignData,
                    KeyAssignDataLayerShift: undefined,
                };
                //---------MIW Layer Shift-----
                if (dev.BaseInfo.SN == '0x093A0x821A') {
                    ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
                }
                //-------------------------
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
                    setTimeout(() => {
                        this.SetSleepTimeFromDataBase(dev, 0, (paramDB) => {
                            callback('SetProfileDataFromDB Finish');
                        });
                    }, 1000);
                });
            }
        };

        SetProfileData(0);
    }

    ChangeProfileID(dev, Obj, callback) {
        env.log('ModelOV2Series', 'ChangeProfileID', `${Obj}`);
        try {
            if (env.BuiltType == 1) {
                callback('ChangeProfileID Finish');
                return;
            }
            var Data = Buffer.alloc(64);
            Data[0] = 0x03;
            Data[1] = 0x01;
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //2.4G Dongle
                Data[2] = 0xfb;
            } else {
                Data[2] = 0xfa;
            }
            Data[3] = Obj;
            //-----------------------------------
            this.SetFeatureReport(dev, Data, 50).then(() => {
                dev.deviceData.profileindex = Obj;
                this.setProfileToDevice(dev, () => {
                    callback('ChangeProfileID Finish');
                });
            });
        } catch (e) {
            env.log('ModelOV2Series', 'ChangeProfileID', `Error:${e}`);
            callback();
        }
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
        var iProfile = dev.deviceData.profileindex - 1;
        var ProfileData = dev.deviceData.profile[iProfile];
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
            iProfile: iProfile,
            KeyAssignData: KeyAssignData,
            KeyAssignDataLayerShift: undefined,
        };
        var ObjLighting = {
            iProfile: iProfile,
            LightingData: LightingData,
        };
        var ObjPerformance = {
            iProfile: iProfile,
            PerformanceData: PerformanceData,
        };
        if (dev.BaseInfo.SN == '0x093A0x821A' && ProfileData.keybindingLayerShift != undefined) {
            ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
        }
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
                this.SetPerformance(dev, ObjPerformance, (param3) => {
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var ObjMacroData = { MacroData: MacroData };
                        this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                            callback('SetProfileDataFromDB Finish');
                        });
                    });
                });
            });
        });
    }

    HIDEP2Data(dev, ObjData) {
        if (ObjData[0] == 0x06 && ObjData[1] == 0xf6) {
            //EP2 Switch Profile
            dev.deviceData.profileindex = ObjData[2];
            var iProfile = ObjData[2];
            env.log('ModelOV2Series', 'HIDEP2Data-SwitchProfile', iProfile);
            var Obj2: { [key: string]: any } = {
                Func: EventTypes.SwitchUIProfile,
                SN: dev.BaseInfo.SN,
                Param: {
                    SN: dev.BaseInfo.SN,
                    Profile: iProfile,
                    ModelType: dev.BaseInfo.ModelType, //Mouse:1,Keyboard:2,Dock:4
                },
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (ObjData[0] == 0x06 && ObjData[1] == 0xf9 && ObjData[2] >= 0x80) {
            //EP2 Launch Program-Press
            var target = dev.ButtonMapping.find((x) => x.HidButtonID == ObjData[3]);
            var iIndex = target.ButtonID;

            var bLayershift = ObjData[4];
            this.LaunchProgram(dev, iIndex, bLayershift);
        } else if (ObjData[0] == 0x06 && ObjData[1] == 0xfb) {
            //EP2 Battery Status
            if (ObjData[2] < 0 || ObjData[2] > 100) {
                //value is out of range
                return;
            }
            var ObjBattery = {
                Status: 0,
                Battery: ObjData[2],
                Charging: ObjData[3],
                SN: dev.BaseInfo.SN,
            };
            //-----------emit-------------------
            var Obj2: { [key: string]: any } = {
                Func: EventTypes.GetBatteryStats,
                SN: dev.BaseInfo.SN,
                Param: ObjBattery,
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
    }

    /**
     * Launch Program
     * @param {*} dev
     * @param {*} iKey
     */
    LaunchProgram(dev, iKey, bLayershift) {
        var iProfile = dev.deviceData.profileindex - 1;
        var KeyAssignData;
        //---------MIW Layer Shift-----
        if (dev.BaseInfo.SN == '0x093A0x821A' && bLayershift) {
            //Over keybinding Array,Then using LayerShift Data
            //ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
            KeyAssignData = dev.deviceData.profile[iProfile].keybindingLayerShift[iKey]; //Get Button Data
        } else {
            KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey]; //Get Button Data
        }

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

    /**
     * Read FW Version from device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    ReadFWVersion(dev, Obj, callback) {
        try {
            var rtnData = this.hid!.GetFWVersion(dev.BaseInfo.DeviceId);
            var CurFWVersion = parseInt(rtnData.toString(16), 10);
            var verRev = CurFWVersion.toString(); //Version byte Reversed
            var strVersion = verRev.padStart(4, '0');
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                dev.BaseInfo.version_Wired = '99.99.99.99';
                dev.BaseInfo.version_Wireless = strVersion;
            } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //2.4G Dongle
                dev.BaseInfo.version_Wired = '99.99.99.99';
                dev.BaseInfo.version_Wireless = strVersion;
            } else {
                dev.BaseInfo.version_Wired = strVersion;
                dev.BaseInfo.version_Wireless = '99.99.99.99';
            }
            callback(strVersion);
        } catch (e) {
            env.log('ModelOV2Series', 'ReadFWVersion', `Error:${e}`);
            callback(false);
        }
    }

    /**
     * Set key matrix to device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetKeyMatrix(dev, Obj, callback) {
        env.log('ModelOV2Series', 'SetKeyMatrix', 'Begin');
        dev.deviceData.profile = Obj.profileData; //Assign profileData From Obj
        var iProfile = dev.deviceData.profileindex - 1; //Assign profileindex From deviceData

        var switchUIflag = Obj.switchUIflag;
        if (env.BuiltType == 1) {
            this.setProfileToDevice(dev, (paramDB) => {
                //Save DeviceData into Database
                callback('SetKeyMatrix Finish');
            });
            return;
        }
        try {
            dev.m_bSetHWDevice = true;
            switch (true) {
                case switchUIflag.keybindingflag: //Set Device keybinding(Key Assignment)
                    //this.RefreshMacroDataBase(dev, function() {
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var KeyAssignData = Obj.profileData[iProfile].keybinding;
                        var ObjKeyAssign = {
                            iProfile: iProfile,
                            KeyAssignData: KeyAssignData,
                            KeyAssignDataLayerShift: undefined,
                        };
                        if (dev.BaseInfo.SN == '0x093A0x821A') {
                            ObjKeyAssign.KeyAssignDataLayerShift = Obj.profileData[iProfile].keybindingLayerShift;
                        }

                        //
                        var ObjMacroData = { MacroData: MacroData };
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                                this.setProfileToDevice(dev, (paramDB) => {
                                    // Save DeviceData into Database
                                    dev.m_bSetHWDevice = false;
                                    callback('SetKeyMatrix Finish');
                                });
                            });
                        });
                    });
                    break;
                case switchUIflag.lightingflag: //Set Device Lighting
                    var LightingData = Obj.profileData[iProfile].lighting;
                    var ObjLighting = {
                        iProfile: iProfile,
                        LightingData: LightingData,
                    };
                    this.SetLEDEffect(dev, ObjLighting, (param2) => {
                        this.setProfileToDevice(dev, (paramDB) => {
                            //Save  DeviceData into Database
                            //this.ChangeProfileID(dev, iProfile, function(param0) {
                            dev.m_bSetHWDevice = false;
                            callback('SetKeyMatrix Finish');
                            //});
                        });
                    });
                    break;
                case switchUIflag.performanceflag: //Set Device Performance
                    var PerformanceData = Obj.profileData[iProfile].performance;
                    var ObjPerformance = {
                        iProfile: iProfile,
                        PerformanceData: PerformanceData,
                    };
                    this.SetPerformance(dev, ObjPerformance, (param1) => {
                        this.setProfileToDevice(dev, (paramDB) => {
                            //Save DeviceData into Database
                            dev.m_bSetHWDevice = false;
                            callback('SetKeyMatrix Finish');
                        });
                    });
                    break;
            }
        } catch (e) {
            env.log('ModelOV2Series', 'SetKeyMatrix', `Error:${e}`);
        }
    }
    //Send performance data and convert deviceData into Firmware
    SetPerformance(dev, ObjPerformance, callback) {
        var iSleeptime = 30;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            iSleeptime = 500;
        }
        setTimeout(() => {
            //-------------Set Performance into Device---------------
            this.SetPerformance2Device(dev, ObjPerformance, (param1) => {
                //Set Performance Into Device
                callback('SetPerformance Finish');
            });
        }, iSleeptime);
    }
    //Send current DPI stage from frontend
    SetPerformance2Device(dev, ObjPerformance, callback) {
        var Data = Buffer.alloc(64);
        var iProfile = ObjPerformance.iProfile;

        var DataPerformance = this.PerformanceToData(dev, ObjPerformance);

        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            const SetAp = (j) => {
                if (j < 4) {
                    //Data: 0
                    Data = Buffer.alloc(64);
                    Data[0] = 0x05;
                    Data[1] = 0x04;
                    Data[2] = j; //Index_0~2
                    Data[3] = iProfile + 1;

                    if (j == 0) {
                        for (var i = 0; i < 11; i++) Data[4 + i] = DataPerformance[i]; //Write Byte[5] to Byte[14]
                    } else {
                        for (var i = 0; i < 10; i++) Data[4 + i] = DataPerformance[11 + 10 * (j - 1) + i]; //Write Byte[5] to Byte[14]
                    }

                    this.SetFeatureReport(dev, Data, 30).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SetPerformance2Device Finish');
                }
            };

            SetAp(0);
        } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            const SetAp = (j) => {
                if (j < 4) {
                    //Data: 0
                    Data = Buffer.alloc(64);
                    Data[0] = 0x03;
                    Data[1] = 0x04;
                    Data[2] = 0xfb;
                    Data[3] = j; //Index_0~2
                    Data[4] = iProfile + 1;
                    if (j == 0) {
                        for (var i = 0; i < 11; i++) Data[5 + i] = DataPerformance[i]; //Write Byte[5] to Byte[14]
                    } else {
                        for (var i = 0; i < 10; i++) Data[5 + i] = DataPerformance[11 + 10 * (j - 1) + i]; //Write Byte[5] to Byte[14]
                    }

                    this.SetFeatureReport(dev, Data, 150).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SetPerformance2Device Finish');
                }
            };
            SetAp(0);
        } else {
            //USB Mode
            Data[0] = 0x03;
            Data[1] = 0x04;
            Data[2] = 0xfa;
            Data[3] = iProfile + 1;

            for (var i = 0; i < 256; i++) Data[4 + i] = DataPerformance[i];

            // for (var i = 0; i < DataPerformance.length; i++)
            //     Data[i] = DataPerformance[i];
            //-----------------------------------
            this.SetFeatureReport(dev, Data, 150).then(() => {
                callback('SetPerformance2Device Finish');
            });
        }
    }

    PerformanceToData(dev, ObjPerformance) {
        var DataBuffer = Buffer.alloc(256); //DataBuffer-Start from DPI Level
        //------------Total DPI levels And Colors-------------
        var DpiStage = ObjPerformance.PerformanceData.DpiStage;
        //-------------dpiSelectIndex---------------
        if (ObjPerformance.PerformanceData.dpiSelectIndex != undefined) {
            DataBuffer[0] = ObjPerformance.PerformanceData.dpiSelectIndex; //DPI Active Stages:0~5
        }
        //-------------DPI Stages Number---------------
        DataBuffer[1] = DpiStage.length; //DPI Stages Number
        //-------------Lod Value---------------
        DataBuffer[2] = ObjPerformance.PerformanceData.LodValue;
        //-------------Debounce time---------------
        DataBuffer[3] = ObjPerformance.PerformanceData.DebounceValue;
        //-------------Polling Rate---------------
        var arrRate = [125, 250, 500, 1000];
        var arrRateValue = [1, 2, 3, 4];
        var PollingRate = arrRate.indexOf(
            ObjPerformance.PerformanceData.pollingrate != null &&
                typeof ObjPerformance.PerformanceData.pollingrate === 'string'
                ? parseInt(ObjPerformance.PerformanceData.pollingrate)
                : ObjPerformance.PerformanceData.pollingrate,
        );
        if (PollingRate != -1) {
            DataBuffer[4] = arrRateValue[PollingRate];
        }
        //-------------Motion Sync Flag---------------
        DataBuffer[5] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
        //------------Total DPI levels And Colors-------------
        if (
            dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle' ||
            dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth'
        ) {
            //2.4G and Bluetooth Wireless Mode
            for (var i = 0; i < DpiStage.length; i++) {
                //DPI resolution, Start from Byte 16(-3)+(DPI number)*5
                var DpiValue = DpiStage[i].value / 50; //Value:1~520 = 50~26000DPI
                DataBuffer[6 + i * 5 + 1] = DpiValue >> 0x08; //DPI Value-High Byte
                DataBuffer[6 + i * 5 + 0] = DpiValue & 0xff; //DPI Value-Low Byte

                var DPIColor = this.hexToRgb(DpiStage[i].color)!;
                DataBuffer[6 + i * 5 + 2] = DPIColor.color.R; //DPI Color R
                DataBuffer[6 + i * 5 + 3] = DPIColor.color.G; //DPI Color G
                DataBuffer[6 + i * 5 + 4] = DPIColor.color.B; //DPI Color B
            }
        } else {
            //USB Mode
            for (var i = 0; i < DpiStage.length; i++) {
                //DPI resolution, Start from Byte 16(-3)+(DPI number)*8

                var DpiValue = DpiStage[i].value / 50; //Value:1~520 = 50~26000DPI
                DataBuffer[12 + i * 8 + 1] = DpiValue >> 0x08; //DPI Value-High Byte
                DataBuffer[12 + i * 8 + 0] = DpiValue & 0xff; //DPI Value-Low Byte

                var DPIColor = this.hexToRgb(DpiStage[i].color)!;
                DataBuffer[12 + i * 8 + 2] = DPIColor.color.R; //DPI Color R
                DataBuffer[12 + i * 8 + 3] = DPIColor.color.G; //DPI Color G
                DataBuffer[12 + i * 8 + 4] = DPIColor.color.B; //DPI Color B
            }
        }
        return DataBuffer;
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
                var ObjBufferKey = this.MacroToData(MacroData);
                var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: ObjBufferKey };

                this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
                    SetMacro(iMacro + 1);
                });
            } else {
                callback('SetMacroFunction Finish');
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
        var MacroDataKey = ObjMacroData.MacroData.BufferKey;
        var MacroActionCount = ObjMacroData.MacroData.ActionCount;
        //When the Macro Content is empty, set ActionCount to 1 to clear the Firmware Content
        if (MacroActionCount == 0) {
            MacroActionCount = 1;
        }
        //
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            var byteAction = Math.ceil(MacroActionCount / 3);
            const SetAp = (j) => {
                if (j < byteAction) {
                    //Data: 0
                    var Data = Buffer.alloc(64);
                    Data[0] = 0x05;
                    Data[1] = 0x05;
                    Data[2] = MacroID - 1; //MacroID : 0x00~0x27(39)
                    //Data[3] = 0x1f + MacroID;//Macro ID:0x20~.0x47
                    Data[3] = j; //Index_0~2
                    Data[4] = byteAction; //Total Action
                    Data[5] = MacroActionCount;

                    for (var i = 0; i < 9; i++) Data[6 + i] = MacroDataKey[9 * j + i]; //Write Byte[4] to Byte[15]

                    this.SetFeatureReport(dev, Data, 30).then(function () {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SetMacroDataToDevice Finish');
                }
            };
            SetAp(0);
        } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            var byteAction = Math.ceil(MacroActionCount / 3);
            const SetAp = (j) => {
                if (j < byteAction) {
                    //Data: 0
                    var Data = Buffer.alloc(64);
                    Data[0] = 0x03;
                    Data[1] = 0x05;
                    Data[2] = 0xfb;
                    Data[3] = MacroID - 1; //MacroID : 0x00~0x27(39)
                    //Data[3] = 0x1f + MacroID;//Macro ID:0x20~.0x47
                    Data[4] = j; //Index_
                    Data[5] = byteAction; //Total Action
                    Data[6] = MacroActionCount; //ACTION Count

                    for (var i = 0; i < 9; i++) Data[7 + i] = MacroDataKey[9 * j + i]; //Write Byte[5] to Byte[16]

                    this.SetFeatureReport(dev, Data, 30).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    setTimeout(() => {
                        callback('SetMacroDataToDevice Finish');
                    }, 200);
                }
            };
            SetAp(0);
        } else {
            //USB Mode
            var byteAction = Math.ceil(MacroActionCount / 18);
            const SetAp = (j) => {
                if (j < byteAction) {
                    //Data: 0
                    var Data = Buffer.alloc(64);
                    Data[0] = 0x03;
                    Data[1] = 0x05;
                    Data[2] = 0xfa;
                    Data[3] = MacroID - 1; //MacroID : 0x00~0x27(39)
                    //Data[3] = 0x1f + MacroID;//Macro ID:0x20~.0x47
                    Data[4] = j; //Index
                    Data[5] = byteAction; //Total Action
                    Data[6] = MacroActionCount; //ACTION Count

                    for (var i = 0; i < 54; i++) Data[8 + i] = MacroDataKey[54 * j + i]; //Write Byte[8] to Byte[63]

                    this.SetFeatureReport(dev, Data, 30).then(function () {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SetMacroDataToDevice Finish');
                }
            };
            SetAp(0);
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
        for (let iEvent = 0; iEvent < DataEvent.length; iEvent++) {
            // var KeyCode = 0x04; //A
            // var bModifyKey = false;
            // var bMouseButton = false;
            // //Assign Keyboard/Mouse KeyCode to KeyCode
            // for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
            //     if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
            //         KeyCode = SupportData.AllFunctionMapping[i].hid as number;
            //         break;
            //     }
            // }
            // //Assign Mouse KeyCode to KeyCode
            // for (let i = 0; i < this.MouseMapping.length; i++) {
            //     if (KeyCode == this.MouseMapping[i].code) {
            //         const Mousehid = this.MouseMapping[i].hid;
            //         KeyCode = Mousehid;
            //         break;
            //     }
            // }

            const currentEvent = DataEvent[iEvent];
            let KeyCode =
                (SupportData.AllFunctionMapping.find((value) => value.code == currentEvent.key)?.hid as number) ?? 0;
            KeyCode = this.MouseMapping.find((value) => value.code == KeyCode)?.hid ?? KeyCode;

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
        //DataEvent.length:Event length
        var ObjMacroData = { BufferKey: BufferKey, ActionCount: DataEvent.length };
        return ObjMacroData;
    }

    SetKeyFunction(dev, ObjKeyAssign, callback) {
        //------------KeyAssignment-------------
        //KeyMapping
        var KeyAssignData = ObjKeyAssign.KeyAssignData;
        var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
        var Obj1 = {
            iProfile: ObjKeyAssign.iProfile,
            DataBuffer: DataBuffer,
        };
        //--------------MIW Layer Shift---------------
        if (dev.BaseInfo.SN == '0x093A0x821A') {
            var KeyAssignData2 = ObjKeyAssign.KeyAssignDataLayerShift;
            KeyAssignData2.layershift = true;
            var DataBuffer2 = this.KeyAssignToData(dev, KeyAssignData2);
            for (let index = 0; index < 36; index++) {
                //DataBuffer-9*4 Bytes
                DataBuffer[36 + index] = DataBuffer2[index];
            }
        }

        //--------------MIW Layer Shift---------------

        this.SendButtonMatrix2Device(dev, Obj1, function () {
            callback('SetKeyFunction Finish');
        });
    }

    SendButtonMatrix2Device(dev, Obj, callback) {
        var iProfile = Obj.iProfile;
        var Data = Buffer.alloc(64);
        var DataBuffer = Obj.DataBuffer;

        var IndexCount_USB = 1;
        var IndexCount_Wireless = 2;
        if (dev.BaseInfo.SN == '0x093A0x821A') {
            IndexCount_Wireless = 6; //Add Layer Shift:and then Set length:3-->6
            IndexCount_USB = 2;
        }

        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
            //Bluetooth Wireless Mode
            const SetAp = (j) => {
                if (j < IndexCount_Wireless) {
                    //Data: 0
                    Data = Buffer.alloc(64);
                    Data[0] = 0x05;
                    Data[1] = 0x03;
                    Data[2] = j; //Index_0~2
                    Data[3] = iProfile + 1;

                    for (var i = 0; i < 12; i++) Data[4 + i] = DataBuffer[12 * j + i]; //Write Byte[4] to Byte[15]

                    this.SetFeatureReport(dev, Data, 30).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SendButtonMatrix2Device Finish');
                }
            };
            SetAp(0);
        } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            const SetAp = (j) => {
                if (j < IndexCount_Wireless) {
                    //Data: 0
                    Data = Buffer.alloc(64);
                    Data[0] = 0x03;
                    Data[1] = 0x03;
                    Data[2] = 0xfb;
                    Data[3] = j; //Index_0~2
                    Data[4] = iProfile + 1;

                    for (var i = 0; i < 12; i++) Data[5 + i] = DataBuffer[12 * j + i]; //Write Byte[5] to Byte[16]

                    this.SetFeatureReport(dev, Data, 150).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SendButtonMatrix2Device Finish');
                }
            };
            SetAp(0);
        } else {
            //USB Mode
            const SetAp = (j) => {
                if (j < IndexCount_USB) {
                    //Data: 0
                    Data[0] = 0x03;
                    Data[1] = 0x03;
                    Data[2] = 0xfa;
                    Data[3] = iProfile + 1;
                    if (dev.BaseInfo.SN == '0x093A0x821A') {
                        Data[4] = j; //MIW-Index_0~2
                    }
                    for (var i = 0; i < 36; i++) Data[8 + i] = DataBuffer[36 * j + i]; //36:DataBuffer-9KEY*4 Bytes

                    //-----------------------------------
                    this.SetFeatureReport(dev, Data, 100).then(() => {
                        SetAp(j + 1);
                    });
                } else {
                    callback('SendButtonMatrix2Device Finish');
                }
            };
            SetAp(0);
        }
        //-----------------------------------
    }
    KeyAssignToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(256); //104KeyData
        for (var i = 0; i < KeyAssignData.length; i++) {
            var target = dev.ButtonMapping.find((x) => x.ButtonID == i);
            var iIndex = target.HidButtonID;
            var Temp_BtnData = KeyAssignData[i];
            switch (Temp_BtnData.group) {
                case 1: //Macro Function
                    DataBuffer[iIndex * 4 + 0] = 0x1f + Temp_BtnData.function; //Macro ID:0x20~.0x47
                    ///////
                    if (Temp_BtnData.param == 3) {
                        //Toggle
                        DataBuffer[iIndex * 4 + 1] = 0xe1; //Toggle
                    } else if (Temp_BtnData.param == 2) {
                        //Repeat while holding
                        DataBuffer[iIndex * 4 + 1] = 0xe0; //Repeat while holding
                    } else {
                        DataBuffer[iIndex * 4 + 1] = 0x01; //Repeat Times
                    }
                    break;
                case 7: //Key Function
                    for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
                        if (Temp_BtnData.function == SupportData.AllFunctionMapping[iMap].value) {
                            var arrModifiers = [1, 0, 2, 3, 4];
                            DataBuffer[iIndex * 4 + 0] = 0x02; //ID:Keyboard Button
                            //Set Modifiers Key
                            for (var index = 0; index < Temp_BtnData.param.length; index++) {
                                if (Temp_BtnData.param[index] == true)
                                    DataBuffer[iIndex * 4 + 1] |= Math.pow(2, arrModifiers[index]); //Binary To Byte
                            }
                            //Set Key Code
                            DataBuffer[iIndex * 4 + 2] = SupportData.AllFunctionMapping[iMap].hid as number; //key code.
                            break;
                        }
                    }
                    break;
                case 3: //Mouse Function
                    var arrMouseValue = [1, 1, 2, 3, 5, 4, 0xa0, 0xa1, 0xb1, 0xb0, 0x77];
                    //0xb0----SW:Profile Down HW:1>2>3>1
                    //0xb1----SW:Profile Up HW:1>3>2>1
                    DataBuffer[iIndex * 4 + 0] = 0x01; //ID:Mouse Button
                    DataBuffer[iIndex * 4 + 1] = arrMouseValue[Temp_BtnData.function]; //P1
                    if (arrMouseValue[Temp_BtnData.function] == 0x77) {
                        //Battery status check
                        DataBuffer[iIndex * 4 + 0] = 0x77;
                        DataBuffer[iIndex * 4 + 1] = 0x00;
                    } else if (Temp_BtnData.function == 11) {
                        //MIW Layer Shift
                        DataBuffer[iIndex * 4 + 0] = 0x88;
                        DataBuffer[iIndex * 4 + 1] = 0x00;
                    }
                    break;
                case 8: //Keyboard Profile/Layer Switch
                    DataBuffer[iIndex * 4 + 0] = 0x04; //ID:Shortcuts
                    DataBuffer[iIndex * 4 + 1] = 0x01; //Function Shortcuts
                    break;
                case 4: //DPI Switch
                    var arrDPIValue = [1, 1, 2, 3, 4, 5];
                    DataBuffer[iIndex * 4 + 0] = 0x66; //ID:DPI
                    DataBuffer[iIndex * 4 + 1] = arrDPIValue[Temp_BtnData.function]; //P1
                    if (arrDPIValue[Temp_BtnData.function] == 5) {
                        //Sniper DPI
                        var DpiValue = parseInt(Temp_BtnData.param) / 50; //Value:1~520 = 50~26000DPI

                        DataBuffer[iIndex * 4 + 3] = DpiValue >> 0x08; //DPI Value-High Byte
                        DataBuffer[iIndex * 4 + 2] = DpiValue & 0xff; //DPI Value-Low Byte

                        //     DataBuffer[2] = 0x05;//Sniper DPI
                        //     DataBuffer[3] = parseInt(DpiValue) >> 8;//Sniper DPI-X-Highbyte
                        //     DataBuffer[4] = parseInt(DpiValue) & 0xFF;//Sniper DPI-X-Lowbyte
                        //     DataBuffer[5] = parseInt(DpiValue) >> 8;//Sniper DPI-Y-Highbyte
                        //     DataBuffer[6] = parseInt(DpiValue) & 0xFF;//Sniper DPI-Y-Lowbyte
                    }
                    break;
                case 5: //Multi Media
                    var hidMap = SupportData.MediaMapping[Temp_BtnData.function].hidMap;
                    DataBuffer[iIndex * 4 + 0] = 0x03; //ID:Function Multimedia
                    for (var iTemp = 0; iTemp < hidMap.length; iTemp++) {
                        //Consumer Keys
                        DataBuffer[iIndex * 4 + 2 - iTemp] = hidMap[iTemp];
                    }
                    break;
                case 2: //Windows Shortcut/Launch
                    if (Temp_BtnData.function == 1) {
                        //Launch Program
                        DataBuffer[iIndex * 4 + 0] = 0x04; //ID:consumer Keys
                        DataBuffer[iIndex * 4 + 1] = 0x01; //Function Shortcuts
                    } else if (Temp_BtnData.function == 2) {
                        //Launch WebSite
                        DataBuffer[iIndex * 4 + 0] = 0x04; //ID:consumer Keys
                        DataBuffer[iIndex * 4 + 1] = 0x01; //Function Shortcuts
                    } else if (Temp_BtnData.function == 3) {
                        //Windows Shortcut
                        var hidMap: number[];
                        if (Temp_BtnData.param == 4) {
                            //Explorer
                            hidMap = [0x08, 0x08]; //Windows+E
                            DataBuffer[iIndex * 4 + 0] = 0x02; //ID:Keyboard Button
                        } else {
                            hidMap = SupportData.WindowsMapping[Temp_BtnData.param].hidMap;
                            DataBuffer[iIndex * 4 + 0] = 0x03; //ID:Function Multimedia
                        }
                        for (var index = 0; index < hidMap.length; index++) {
                            DataBuffer[iIndex * 4 + 2 - index] = hidMap[index];
                        }
                    }
                    break;
                case 6: //Disable
                    DataBuffer[iIndex * 4 + 0] = 0x00; //ID:Disable
                    DataBuffer[iIndex * 4 + 1] = 0x00;
                    break;
                default:
                    DataBuffer[iIndex * 4] = 0xff; //key matrix type-0xff: Default
                    break;
            }
        }
        return DataBuffer;
    }

    SetLEDEffect(dev, Obj, callback) {
        env.log('ModelOV2Series', 'SetLEDEffect', 'Begin');
        try {
            var ObjEffectData = { iProfile: Obj.iProfile, Data: Obj.LightingData };

            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                callback('SetLEDEffect Finish');
            });
        } catch (e) {
            env.log('ModelOV2Series', 'SetLEDEffect', `Error:${e}`);
        }
    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try {
            var Data = Buffer.alloc(64);
            var iProfile = ObjEffectData.iProfile;

            var iIndex = this.LEDType.findIndex((x) => x.EffectID == ObjEffectData.Data.Effect);
            var HidEffectID = this.LEDType[iIndex].HidEffectID;

            var DataBuffer = this.LEDEffectToData(dev, ObjEffectData);

            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[0] = 0x05;
                Data[1] = 0x02;
                Data[2] = 0x00; //Index_0
                Data[3] = iProfile + 1;
                Data[4] = HidEffectID; //Led_Type

                for (var i = 0; i < 11; i++) Data[5 + i] = DataBuffer[0 + i]; //Num1:R,G Num2:B
                this.SetFeatureReport(dev, Data, 30).then(() => {
                    Data[2] = 0x01; //Index_1
                    for (var i = 0; i < 12; i++) Data[5 + i] = DataBuffer[11 + i]; //Num1:R,G Num2:B
                    this.SetFeatureReport(dev, Data, 30).then(() => {
                        callback('SetLEDEffectToDevice Finish');
                    });
                });
            } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //2.4G Dongle
                Data[0] = 0x03;
                Data[1] = 0x02;
                Data[2] = 0xfb;
                Data[3] = 0x00; //Index_0
                Data[4] = iProfile + 1;
                Data[5] = HidEffectID; //Led_Type

                for (var i = 0; i < 8; i++) Data[6 + i] = DataBuffer[0 + i]; //Rate,Bright,LEDCount,Color 0
                this.SetFeatureReport(dev, Data, 280).then(() => {
                    Data[3] = 0x01; //Index_1
                    for (var i = 0; i < 9; i++) Data[6 + i] = DataBuffer[8 + i]; //Color 1 ~ 3
                    this.SetFeatureReport(dev, Data, 280).then(() => {
                        Data[3] = 0x02; //Index_2
                        for (var i = 0; i < 9; i++) Data[6 + i] = DataBuffer[8 + 9 + i]; //Color 4 ~5
                        this.SetFeatureReport(dev, Data, 280).then(() => {
                            callback('SetLEDEffectToDevice Finish');
                        });
                    });
                });
            } else {
                Data[0] = 0x03;
                Data[1] = 0x02;
                Data[2] = 0xfa;
                Data[3] = iProfile + 1;
                Data[4] = HidEffectID; //Led_Type
                for (var i = 0; i < 29; i++) Data[5 + i] = DataBuffer[0 + i]; //Num1:R,G Num2:B
                this.SetFeatureReport(dev, Data, 100).then(() => {
                    callback('SetLEDEffectToDevice Finish');
                });
            }
        } catch (e) {
            env.log('ModelOV2Series', 'SetLEDEffectToDevice', `Error:${e}`);
        }
    }

    LEDEffectToData(dev, ObjEffectData) {
        var DataBuffer = Buffer.alloc(256); //DataBuffer-Start from Byte 5
        //-----------------Wired-Mouse------------------
        var iShift = 0;
        DataBuffer[0] = ObjEffectData.Data.RateValue > 0 ? (ObjEffectData.Data.RateValue * 20) / 100 : 1; //Run_Speed(Rate) Range:1~20
        DataBuffer[1] = (ObjEffectData.Data.WiredBrightnessValue * 20) / 100; //LED_BR Range:0~20

        if (ObjEffectData.Data.SepatateCheckValue) {
            DataBuffer[4] = (ObjEffectData.Data.WirelessBrightnessValue * 20) / 100; //RF_Brigh Range:0~20
        } else {
            DataBuffer[4] = (ObjEffectData.Data.WiredBrightnessValue * 20) / 100; //RF_Brigh Range:0~20
        }
        DataBuffer[3] = ObjEffectData.Data.RateValue > 0 ? (ObjEffectData.Data.RateValue * 20) / 100 : 1; //Run_Speed(Rate) Range:1~20
        //-----Using templighting value to assign Color-----
        var Colors = ObjEffectData.Data.Color;
        var ColorCount = 0;
        if (
            dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle' ||
            dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth'
        ) {
            //2.4G and Bluetooth Wireless Mode
            for (var index = 0; index < Colors.length; index++) {
                // if (index >= 2) {
                //     break;
                // }
                if (Colors[index].flag == true) {
                    DataBuffer[5 + ColorCount * 3 + 0] = Colors[index].R; //R
                    DataBuffer[5 + ColorCount * 3 + 1] = Colors[index].G; //G
                    DataBuffer[5 + ColorCount * 3 + 2] = Colors[index].B; //B
                    ColorCount++;
                }
            }
        } else {
            for (var index = 0; index < Colors.length; index++) {
                if (Colors[index].flag == true) {
                    DataBuffer[11 + ColorCount * 3 + 0] = Colors[index].R; //R
                    DataBuffer[11 + ColorCount * 3 + 1] = Colors[index].G; //G
                    DataBuffer[11 + ColorCount * 3 + 2] = Colors[index].B; //B
                    ColorCount++;
                }
            }
        }
        DataBuffer[2] = ColorCount > 0 ? ColorCount : 0; //led quantity
        //-----Using templighting value to assign Color-----

        return DataBuffer;
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
            var DataSleeptime;
            if (Obj.sleep) {
                var iSleeptime = Obj.sleeptime;
                DataSleeptime = iSleeptime & 0xff;
            } else {
                DataSleeptime = 0xff;
            }
            //-------------------------------
            var Data = Buffer.alloc(64);
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[0] = 0x05;
                Data[1] = 0x06;
                Data[2] = DataSleeptime;
            } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //2.4G Dongle
                Data[0] = 0x03;
                Data[1] = 0x06;
                Data[2] = 0xfb;
                Data[3] = DataSleeptime;
            } else {
                Data[0] = 0x03;
                Data[1] = 0x06;
                Data[2] = 0xfa;
                Data[3] = DataSleeptime;
            }

            this.SetFeatureReport(dev, Data, 30).then(function () {
                callback('SetSleepTimetoDevice Finish');
            });
        } catch (e) {
            env.log('ModelOSeries', 'SetSleepTimetoDevice', `Error:${e}`);
        }
    }
    //Get Device Battery Status From Device
    GetDeviceBatteryStats(dev, ObjDelay, callback) {
        try {
            if (dev.m_bSetHWDevice || dev.m_bSetHWDevice == undefined || dev.m_bDonglepair == true) {
                callback(false);
                return;
            }
            var Data = Buffer.alloc(64);
            if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                //Bluetooth Wireless Mode
                Data[0] = 0x05;
                Data[1] = 0x08;
                Data[2] = 0x14;
            } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
                //2.4G Dongle
                Data[0] = 0x03;
                Data[1] = 0x08;
                Data[2] = 0xfb;
                Data[3] = 0x14;
            } else {
                Data[0] = 0x03;
                Data[1] = 0x08;
                Data[2] = 0xfa;
                Data[3] = 0x14;
            }
            //-----------------------------------

            const GetDeviceBattery = (iCheck) => {
                if (iCheck < 3) {
                    this.SetFeatureReport(dev, Data, 50).then(() => {
                        this.GetFeatureReport(dev, Data, 50).then((rtnData: any) => {
                            var Status = '';
                            if (rtnData[2 - 1] != 0x14)
                                //Is Not BatteryStats Status is Fail
                                Status = 'Not BatteryStats Status';
                            else if (rtnData[3 - 1] == 0xff)
                                //BatteryStats Status is Not response
                                GetDeviceBattery(iCheck + 1);
                            else {
                                if (Status != '') {
                                    env.log(dev.BaseInfo.devicename, 'GetDeviceBatteryStats', 'Fail-Status:' + Status);
                                    callback(false);
                                } else {
                                    if (rtnData[3 - 1] == 0)
                                        //Battery Value is 0 Convert To 1
                                        rtnData[3 - 1] = 1;

                                    var ObjBattery = {
                                        SN: dev.BaseInfo.SN,
                                        Status: Status,
                                        Battery: rtnData[3 - 1],
                                        Charging: rtnData[4 - 1],
                                    };

                                    callback(ObjBattery);
                                }
                            }
                        });
                    });
                } else {
                    //'BatteryStats Status is Not response',
                    env.log(
                        dev.BaseInfo.devicename,
                        'GetDeviceBatteryStats',
                        'Fail-Status:' + 'BatteryStats Status is Not response',
                    );
                    var ObjBattery = {
                        SN: dev.BaseInfo.SN,
                        Status: 0,
                        Battery: 0,
                        Charging: 0,
                    };

                    callback(ObjBattery);
                }
            };
            GetDeviceBattery(0);
        } catch (e) {
            env.log('ModelOSeries', 'GetDeviceBatteryStats', `Error:${e}`);
        }
    }
    //
    SetFeatureReport(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            try {
                var rtnData;
                if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                    //Bluetooth Wireless Mode
                    rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x05, 21, buf);
                } else {
                    rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x03, 64, buf);
                }
                setTimeout(() => {
                    if (rtnData < 8)
                        env.log(
                            'ModelOV2Series SetFeatureReport',
                            'SetFeatureReport(error) return data length : ',
                            JSON.stringify(rtnData),
                        );
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('ModelOV2Series Error', 'SetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            try {
                var rtnData;
                if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bluetooth') {
                    //Bluetooth Wireless Mode
                    // rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x05, 21, buf);
                    rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x05, 21);
                } else {
                    // rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x03, 64, buf);
                    rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x03, 64);
                }
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
}
