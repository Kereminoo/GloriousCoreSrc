import { EventTypes } from '../../../../../common/EventVariable';
import { SupportData } from '../../../../../common/SupportData';
import { env } from '../../../others/env';
import { Mouse } from './Mouse';
import { GetValidURL } from '../../../../../common/utils';

export class ModelOV2WiredSeries extends Mouse {
    static #instance?: ModelOV2WiredSeries;

    m_bSetFWEffect: boolean;
    m_bSetHWDevice: boolean;

    ButtonMapping: any[];
    LEDType: any[];
    MouseMapping: any[];

    constructor(hid) {
        env.log('ModelOV2WiredSeries', 'ModelOV2WiredSeries class', 'begin');
        super();

        this.m_bSetFWEffect = false; //SET DB
        this.m_bSetHWDevice = false;
        this.hid = hid;

        this.ButtonMapping = [
            { ButtonID: 0x00, HidButtonID: 0x00, value: 'LeftClick' },
            { ButtonID: 0x01, HidButtonID: 0x02, value: 'ScorllClick' },
            { ButtonID: 0x02, HidButtonID: 0x01, value: 'RightClick' },
            { ButtonID: 0x03, HidButtonID: 0x04, value: 'Forward' },
            { ButtonID: 0x04, HidButtonID: 0x03, value: 'Backward' },
            { ButtonID: 0x05, HidButtonID: 0x05, value: 'DPISwitch' },
            { ButtonID: 0x06, HidButtonID: 0x06, value: 'Scroll Up' },
            { ButtonID: 0x07, HidButtonID: 0x07, value: 'Scroll Down' },
        ];

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
            { keyCode: '16', value: 'Left Click', hid: 0xb7, code: '0' },
            { keyCode: '17', value: 'Scroll Click', hid: 0xb9, code: '1' },
            { keyCode: '18', value: 'Right Click', hid: 0xb8, code: '2' },
            { keyCode: '91', value: 'Back Key', hid: 0xba, code: '3' },
            { keyCode: '92', value: 'Forward Key', hid: 0xbb, code: '4' },
        ];
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('ModelOV2WiredSeries', 'getInstance', `Get exist ModelOV2WiredSeries() INSTANCE`);
            return this.#instance;
        } else {
            env.log('ModelOV2WiredSeries', 'getInstance', `New ModelOV2WiredSeries() INSTANCE`);
            this.#instance = new ModelOV2WiredSeries(hid);

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
        env.log('ModelOV2WiredSeries', 'initDevice', 'Begin');
        dev.bwaitForPair = false;
        dev.m_bSetHWDevice = false;

        if (dev.BaseInfo.SN == '0x320F0x831A') {
            dev.ButtonMapping = [
                { ButtonID: 0x00, HidButtonID: 0x00, RGBSyncID: 0x00, value: 'LeftClick' },
                { ButtonID: 0x01, HidButtonID: 0x02, RGBSyncID: 0x00, value: 'ScorllClick' },
                { ButtonID: 0x02, HidButtonID: 0x01, RGBSyncID: 0x00, value: 'RightClick' },
                { ButtonID: 0x03, HidButtonID: 0x04, RGBSyncID: 0x03, value: 'Forward' },
                { ButtonID: 0x04, HidButtonID: 0x03, RGBSyncID: 0x04, value: 'Backward' },
                { ButtonID: 0x05, HidButtonID: 0x05, RGBSyncID: 0x02, value: 'DPI UP' }, //DPISwitch->DPI UP
                { ButtonID: 0x06, HidButtonID: 0xff, RGBSyncID: 0xff, value: 'Scroll Up' },
                { ButtonID: 0x07, HidButtonID: 0xff, RGBSyncID: 0xff, value: 'Scroll Down' },
                { ButtonID: 0x08, HidButtonID: 0x08, RGBSyncID: 0x01, value: 'DPI Lock' }, //(Big Side Button)
                { ButtonID: 0x09, HidButtonID: 0x07, RGBSyncID: 0x01, value: 'HOME' }, //(Former Side Button)
                { ButtonID: 0x0a, HidButtonID: 0x06, RGBSyncID: 0x03, value: 'DPI Down' },
            ];
        } else {
            dev.ButtonMapping = [
                { ButtonID: 0x00, HidButtonID: 0x00, RGBSyncID: 0x00, value: 'LeftClick' },
                { ButtonID: 0x01, HidButtonID: 0x02, RGBSyncID: 0x00, value: 'ScorllClick' },
                { ButtonID: 0x02, HidButtonID: 0x01, RGBSyncID: 0x00, value: 'RightClick' },
                { ButtonID: 0x03, HidButtonID: 0x04, RGBSyncID: 0x02, value: 'Forward' },
                { ButtonID: 0x04, HidButtonID: 0x03, RGBSyncID: 0x01, value: 'Backward' },
                { ButtonID: 0x05, HidButtonID: 0x05, RGBSyncID: 0x02, value: 'DPISwitch' },
                { ButtonID: 0x06, HidButtonID: 0x06, RGBSyncID: 0xff, value: 'Scroll Up' },
                { ButtonID: 0x07, HidButtonID: 0x07, RGBSyncID: 0xff, value: 'Scroll Down' },
            ];
        }

        //-------Initial Key/LEDCode Matrix-------
        dev.BaseInfo.version_Wireless = '0001';
        if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Bootloader') {
            //Is in Bootloader
            dev.BaseInfo.version_Wired = '0001';
            callback(0);
        } else if (env.BuiltType == 0) {
            //this.ReadFWVersion(dev,0,(ObjFWVersion) => {
            this.SetProfileDataFromDB(dev, 0, () => {
                callback(0);
            });
            //});
        } else {
            dev.BaseInfo.version_Wired = '0001';
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
                    KeyAssignDataLayerShift: {},
                    KeyAssignData: KeyAssignData,
                }; //--------------LayerShift---------------
                if (dev.BaseInfo.SN == '0x320F0x831A') {
                    ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
                } //--------------LayerShift---------------
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
                    callback('SetProfileDataFromDB Done');
                });
            }
        };
        SetProfileData(0);
    }

    ChangeProfileID(dev, Obj, callback) {
        env.log('ModelOV2WiredSeries', 'ChangeProfileID', `${Obj}`);
        try {
            if (env.BuiltType == 1) {
                callback('ChangeProfileID Done');
                return;
            }
            var Data = Buffer.alloc(264);
            Data[0] = 0x07;
            Data[1] = 0x01;
            Data[2] = Obj;
            //-----------------------------------
            this.SetFeatureReport(dev, Data, 50).then(() => {
                dev.deviceData.profileindex = Obj;
                this.setProfileToDevice(dev, () => {
                    callback('ChangeProfileID Done');
                });
            });
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'ChangeProfileID', `Error:${e}`);
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
            KeyAssignDataLayerShift: {},
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
        //LayerShift
        if (dev.BaseInfo.SN == '0x320F0x831A' && ProfileData.keybindingLayerShift != undefined) {
            ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
        }
        //
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
                this.SetPerformance(dev, ObjPerformance, (param3) => {
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
    }

    HIDEP2Data(dev, ObjData) {
        if (ObjData[0] == 0x04 && ObjData[1] == 0xf1 && ObjData[2] == 0xa0) {
            //EP2 Hardware Reset Default
            env.log('ModelOV2WiredSeries', 'HIDEP2Data-HardwareReset', '');
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xf1 && ObjData[2] <= 0x03) {
            //EP2 Switch Profile
            dev.deviceData.profileindex = ObjData[2];
            var iProfile = ObjData[2];
            env.log('ModelOV2WiredSeries', 'HIDEP2Data-SwitchProfile', iProfile);
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
        } else if (ObjData[0] == 0x04 && ObjData[1] == 0xf7 && ObjData[2] >= 0x80) {
            //EP2 Launch Program-Press
            var target = dev.ButtonMapping.find((x) => x.HidButtonID == ObjData[3]);
            var iIndex = target.ButtonID;

            this.LaunchProgram(dev, iIndex);
        }
    }

    /**
     * Launch Program
     * @param {*} dev
     * @param {*} iKey
     */
    LaunchProgram(dev, iKey, bLayershift = undefined) {
        var iProfile = dev.deviceData.profileindex - 1;
        var KeyAssignData;
        //LayerShift
        if (dev.BaseInfo.SN == '0x320F0x831A' && bLayershift) {
            //Over keybinding Array,Then using LayerShift Data
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
     * Set Polling Rate to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetPollingRatetoDevice(dev, Obj, callback) {
        var Data = Buffer.alloc(264);
        var arrPollingrate = [1000, 500, 250, 125];
        Data[0] = 0x07;
        Data[1] = 0x08;
        Data[8] = arrPollingrate.indexOf(Obj.iPollingrate);
        Data[9] = Obj.EP2Enable; //EP3_Flag
        Data[10] = Obj.LEDNoChange; //LED NO Change: 0 Dis/ 1 En

        // //-----------------------------------
        return new Promise((resolve) => {
            this.SetFeatureReport(dev, Data, 100).then(() => {
                callback();
            });
        });
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
            if (strVersion == '2000') {
                //Ver 2000>Force Update
                dev.BaseInfo.version_Wired = '0001';
            } else {
                dev.BaseInfo.version_Wired = strVersion;
            }
            dev.BaseInfo.version_Wireless = '99.99.99.99';
            callback(strVersion);
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'ReadFWVersion', `Error:${e}`);
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
        env.log('ModelOV2WiredSeries', 'SetKeyMatrix', 'Begin');
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
                case switchUIflag.keybindingflag: //Set Device keybinding(Key Assignment)
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var KeyAssignData = Obj.profileData[iProfile].keybinding;
                        var ObjKeyAssign = {
                            iProfile: iProfile,
                            KeyAssignDataLayerShift: {},
                            KeyAssignData: KeyAssignData,
                        };
                        //LayerShift
                        if (dev.BaseInfo.SN == '0x320F0x831A') {
                            ObjKeyAssign.KeyAssignDataLayerShift = Obj.profileData[iProfile].keybindingLayerShift;
                        }
                        //
                        var ObjMacroData = { MacroData: MacroData };
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                                this.setProfileToDevice(dev, (paramDB) => {
                                    // Save DeviceData into Database
                                    dev.m_bSetHWDevice = false;
                                    callback('SetKeyMatrix Done');
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
                            //this.ChangeProfileID(dev, iProfile, (param0) => {
                            dev.m_bSetHWDevice = false;
                            callback('SetKeyMatrix Done');
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
                            callback('SetKeyMatrix Done');
                        });
                    });
                    break;
            }
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'SetKeyMatrix', `Error:${e}`);
        }
    }
    //Send performance data and convert deviceData into Firmware
    SetPerformance(dev, ObjPerformance, callback) {
        //------------Total DPI levels And Colors-------------
        var DpiStage = ObjPerformance.PerformanceData.DpiStage;
        var DataPerformance = Buffer.alloc(264);
        DataPerformance[0] = 0x07;
        DataPerformance[1] = 0x04;
        DataPerformance[2] = ObjPerformance.iProfile + 1;

        //-------------dpiSelectIndex---------------
        if (ObjPerformance.PerformanceData.dpiSelectIndex != undefined) {
            DataPerformance[3] = ObjPerformance.PerformanceData.dpiSelectIndex + 1; //DPI Active Stages:1~6
        }
        //-------------dpiSelectIndex---------------
        DataPerformance[4] = DpiStage.length; //DPI Stages Number
        //------------Total DPI levels And Colors-------------
        for (
            var i = 0;
            i < DpiStage.length;
            i++ //DPI resolution
        ) {
            var DpiValue = DpiStage[i].value / 50; //Value:1~520 = 50~26000DPI
            DataPerformance[16 + i * 8 + 0] = DpiValue >> 0x08; //DPI Value-High Byte
            DataPerformance[16 + i * 8 + 1] = DpiValue & 0xff; //DPI Value-Low Byte

            var DPIColor = this.hexToRgb(DpiStage[i].color)!;
            DataPerformance[16 + i * 8 + 2] = DPIColor.color.R; //DPI Color R
            DataPerformance[16 + i * 8 + 3] = DPIColor.color.G; //DPI Color G
            DataPerformance[16 + i * 8 + 4] = DPIColor.color.B; //DPI Color B
        }
        //-------------Lod Value---------------
        DataPerformance[5] = ObjPerformance.PerformanceData.LodValue;
        //-------------Debounce time---------------
        DataPerformance[6] = ObjPerformance.PerformanceData.DebounceValue;
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
            DataPerformance[7] = arrRateValue[PollingRate];
        }
        //-------------Motion Sync Flag---------------
        DataPerformance[8] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
        //-------------Set Performance into Device---------------
        this.SetPerformance2Device(dev, DataPerformance, (param1) => {
            //Set Performance Into Device
            callback('SetPerformance Done');
        });
    }
    //Send current DPI stage from frontend
    SetPerformance2Device(dev, DataPerformance, callback) {
        try {
            var Data = Buffer.alloc(264);
            for (var i = 0; i < DataPerformance.length; i++) Data[i] = DataPerformance[i];
            //-----------------------------------
            this.SetFeatureReport(dev, Data, 150).then(() => {
                callback('SetPerformance2Device Done');
            });
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'SetPerformance2Device', `Error:${e}`);
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

        var Data = Buffer.alloc(264);
        Data[0] = 0x07;
        Data[1] = 0x05;
        Data[2] = MacroID - 1; //MacroID : 0x00~0x27(39)
        var iMaxSize = 248;
        for (var k = 0; k < iMaxSize; k++) Data[8 + k] = MacroData[0 + k];
        this.SetFeatureReport(dev, Data, 100).then(() => {
            callback('SetMacroDataToDevice Done');
        });
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

        BufferKey[0] = DataEvent.length; //Event length
        //------------Turns Event Array into BufferKey-------------
        for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
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
            // for (var i = 0; i < this.MouseMapping.length; i++) {
            //     if (DataEvent[iEvent].key == this.MouseMapping[i].code) {
            //         var Mousehid = this.MouseMapping[i].hid;
            //         KeyCode = Mousehid;
            //         break;
            //     }
            // }

            const currentEvent = DataEvent[iEvent];
            let KeyCode = SupportData.AllFunctionMapping.find((value) => value.code == currentEvent.key)?.hid as number ?? 0;
            KeyCode = this.MouseMapping.find((value) => value.code == KeyCode)?.hid ?? KeyCode;

            //Assign Delay to Event
            var iDelay = 1;
            if (iEvent < DataEvent.length - 1) {
                iDelay =
                    DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0
                        ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times
                        : 1;
            }

            BufferKey[1 + iEvent * 3 + 0] = iDelay >> 0x08;
            if (DataEvent[iEvent].keydown) BufferKey[1 + iEvent * 3 + 0] += 0x80;
            BufferKey[1 + iEvent * 3 + 1] = iDelay & 0xff;
            //Assign KeyCode to Event
            BufferKey[1 + iEvent * 3 + 2] = KeyCode;
        }
        return BufferKey;
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
        //--------------LayerShift---------------
        if (dev.BaseInfo.SN == '0x320F0x831A') {
            var KeyAssignData2 = ObjKeyAssign.KeyAssignDataLayerShift;
            KeyAssignData2.layershift = true;
            var DataBuffer2 = this.KeyAssignToData(dev, KeyAssignData2);
            for (let index = 0; index < 36; index++) {
                //DataBuffer-9*4 Bytes
                DataBuffer[36 + index] = DataBuffer2[index];
            }
        }
        //--------------LayerShift---------------
        this.SendButtonMatrix2Device(dev, Obj1).then(() => {
            // this.SendMacroType2Device(dev, Obj2).then(() => {
            callback('SetKeyFunction Done');
            // });
        });
    }

    SendButtonMatrix2Device(dev, Obj) {
        var iProfile = Obj.iProfile;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;
        Data[0] = 0x07;
        Data[1] = 0x03;
        Data[2] = iProfile + 1; //DataProfile
        var DataBuffer = Obj.DataBuffer;

        for (
            var i = 0;
            i < DataBuffer.length;
            i++ //30
        )
            Data[8 + i] = DataBuffer[i];
        //-----------------------------------
        return new Promise((resolve) => {
            this.SetFeatureReport(dev, Data, 150).then(() => {
                resolve('SendButtonMatrix2Device Done');
            });
        });
        //-----------------------------------
    }
    SendMacroType2Device(dev, Obj) {
        var iProfile = Obj.iProfile;
        var iLayerIndex = Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;

        Data[0] = 0x07;
        Data[1] = 0x04;
        Data[2] = iProfile + 1; //DataProfile
        Data[3] = iLayerIndex + 1; //Layer

        var DataBuffer = Obj.DataBuffer;

        //-----------------------------------
        return new Promise((resolve) => {
            if (DataBuffer == false) {
                //No Macro
                resolve('SendButtonMatrix2Device Done');
            } else {
                for (
                    var i = 0;
                    i < DataBuffer.length;
                    i++ //30
                ) {
                    Data[8 + i] = DataBuffer[i];
                }
                this.SetFeatureReport(dev, Data, 150).then(() => {
                    resolve('SendButtonMatrix2Device Done');
                });
            }
        });
        //-----------------------------------
    }
    KeyAssignToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(264); //104KeyData
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
                    var arrMouseValue = [1, 1, 2, 3, 5, 4, 0xa0, 0xa1, 0xb1, 0xb0, 1];
                    //0xb0----SW:Profile Down HW:1>2>3>1
                    //0xb1----SW:Profile Up HW:1>3>2>1
                    DataBuffer[iIndex * 4 + 0] = 0x01; //ID:Mouse Button
                    DataBuffer[iIndex * 4 + 1] = arrMouseValue[Temp_BtnData.function]; //P1
                    if (Temp_BtnData.function == 11) {
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
                        var DpiValue: number = Temp_BtnData.param;
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
        env.log('ModelOV2WiredSeries', 'SetLEDEffect', 'Begin');
        try {
            var ObjEffectData = { iProfile: Obj.iProfile, Data: Obj.LightingData };
            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                callback('SetLEDEffect Done');
            });
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'SetLEDEffect', `Error:${e}`);
        }
    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try {
            var Data = Buffer.alloc(264);
            var iProfile = ObjEffectData.iProfile;

            var iIndex = this.LEDType.findIndex((x) => x.EffectID == ObjEffectData.Data.Effect);
            var HidEffectID = this.LEDType[iIndex].HidEffectID;

            //-----------------Wired-Mouse------------------
            Data[0] = 0x07;
            Data[1] = 0x02;
            Data[2] = iProfile + 1;
            Data[3] = HidEffectID; //Led_Type
            Data[4] = ObjEffectData.Data.RateValue > 0 ? (ObjEffectData.Data.RateValue * 20) / 100 : 1; //Run_Speed(Rate) Range:1~20
            Data[5] = (ObjEffectData.Data.WiredBrightnessValue * 20) / 100; //LED_BR Range:0~20

            //-----Using templighting value to assign Color-----
            for (let LEDindex = 0; LEDindex < dev.deviceData.profile[iProfile].templighting.length; LEDindex++) {
                var arrLightingData = dev.deviceData.profile[iProfile].templighting[LEDindex];
                var tempID = this.LEDType.findIndex((x) => x.EffectID == arrLightingData.Effect);
                var ColorIndexID = this.LEDType[tempID].ColorIndexID;
                if (ColorIndexID != 0xff) {
                    var tempColors = arrLightingData.Color;
                    var ColorCount = 0;
                    for (var index = 0; index < tempColors.length; index++) {
                        if (tempColors[index].flag == true) {
                            Data[16 + ColorIndexID * 3 + ColorCount * 3 + 0] = tempColors[index].R; //R
                            Data[16 + ColorIndexID * 3 + ColorCount * 3 + 1] = tempColors[index].G; //G
                            Data[16 + ColorIndexID * 3 + ColorCount * 3 + 2] = tempColors[index].B; //B
                            ColorCount++;
                        }
                    }
                    if (this.LEDType[tempID].value == 'Rave') {
                        if (ColorCount <= 1) {
                            //When only have one color,Assign Second Rave Color
                            Data[16 + ColorIndexID * 3 + 1 * 3 + 0] = tempColors[0].R; //R
                            Data[16 + ColorIndexID * 3 + 1 * 3 + 1] = tempColors[0].G; //G
                            Data[16 + ColorIndexID * 3 + 1 * 3 + 2] = tempColors[0].B; //B
                        }
                    } else if (this.LEDType[tempID].value == 'Breathing') {
                        Data[6] = ColorCount > 0 ? ColorCount - 1 : 0; //led quantity
                    }
                }
            }
            //-----Using templighting value to assign Color-----

            this.SetFeatureReport(dev, Data, 100).then(() => {
                callback('SetLEDEffectToDevice Done');
            });
        } catch (e) {
            env.log('ModelOV2WiredSeries', 'SetLEDEffectToDevice', `Error:${e}`);
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
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId, 0x07, 264, buf);
                setTimeout(() => {
                    if (rtnData < 8)
                        env.log(
                            'ModelOV2WiredSeries SetFeatureReport',
                            'SetFeatureReport(error) return data length : ',
                            JSON.stringify(rtnData),
                        );
                    resolve(rtnData);
                }, iSleep);
            } catch (err) {
                env.log('ModelOV2WiredSeries Error', 'SetFeatureReport', `ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf, iSleep) {
        return new Promise((resolve, reject) => {
            try {
                //    var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x07, 256, buf);
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId, 0x07, 256);
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
