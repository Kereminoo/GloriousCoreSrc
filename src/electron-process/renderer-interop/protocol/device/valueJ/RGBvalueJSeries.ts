import { valueJ } from './valueJ';
import { HID } from '../../nodeDriver/HID';
import { DeviceData } from '../../service/DeviceService';
import { env } from '../../../others/env';

interface LEDType {
    UIEffect: number;
    value: string;
    EffectHID: number;
    RGB: boolean;
}

const arrLEDType: LEDType[] = [
    { UIEffect: 1, value: 'Seamless Breathing (RGB)', EffectHID: 0x0b, RGB: true },
    { UIEffect: 3, value: 'Breathing', EffectHID: 0x02, RGB: false },
    { UIEffect: 2, value: 'Single Color', EffectHID: 0x01, RGB: false },
    { UIEffect: 4, value: 'Breathing (Single Color)', EffectHID: 0x03, RGB: false },
    { UIEffect: 8, value: 'LED Off', EffectHID: 0x00, RGB: false },
];

export class RGBvalueJSeries extends valueJ {
    constructor(hid: HID | undefined = undefined) {
        console.log('RGBvalueJSeries', 'RGBvalueJSeries class', 'begin');
        super();
        this.hid = hid;
    }

    static getInstance(hid: HID | undefined = undefined) {
        if (this.instance) {
            console.log('RGBvalueJSeries', 'getInstance', `Get exist RGBvalueJSeries() INSTANCE`);
            return this.instance;
        } else {
            console.log('RGBvalueJSeries', 'getInstance', `New RGBvalueJSeries() INSTANCE`);
            this.instance = new RGBvalueJSeries(hid);
            return this.instance;
        }
    }
    InitialDevice(dev: DeviceData, Obj, callback) {
        console.log('RGBvalueJSeries', 'initDevice', 'Begin');
        callback(0);
        //Initialize dev value
        // dev.m_bSetHWDevice = false;
        // dev.BatteryStats = -1;
        // dev.BatteryLow = false;
        // dev.BatteryFull = false;
        // dev.SleepMode = false;

        // dev.MouseCharging = 0;

        if (env.BuiltType == 0) {
            this.ReadFWVersion(dev, 0, () => {
                this.SetProfileDataFromDB(dev, 0, function () {
                    callback('SetLighting Done');
                });
            });
            callback(0);
        } else {
            dev.BaseInfo.version_Wired = '0001';
            callback(0);
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
            //var rtnData = _this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
            ///////////////////////////////
            this.GetFWVersionFromDevice(dev, 0, (rtnData) => {
                //var CurFWVersion = parseInt(rtnData.toString(16), 10);
                var CurFWVersion = rtnData;
                var verRev = CurFWVersion.toString(); //Version byte Reversed
                var strVertion = verRev.padStart(4, '0');
                dev.BaseInfo.version_Wired = strVertion;
                callback(strVertion);
            });
        } catch (e) {
            console.error(dev.BaseInfo.devicename, 'ReadFWVersion', `Error:${e}`);
            callback(false);
        }
    }

    GetFWVersionFromDevice(dev, Obj, callback) {
        try {
            var Data = Buffer.alloc(9);
            Data[0] = 0x00;
            Data[1] = 0xc4;
            Data[2] = 0x08;
            this.SetFeatureReport(dev, Data, 10).then(() => {
                this.GetFeatureReport(dev, Data, 10).then((rtnData: any) => {
                    var FWVer = 0;
                    if (rtnData[1] == 0x55 && rtnData[2] == 0xaa) {
                        FWVer = rtnData[3];
                    }
                    callback(FWVer);
                });
            });
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'GetFWVersionFromDevice', `Error:${e}`);
            callback(0);
        }
    }

    //Send App data and convert deviceData into Firmware From Local Data File
    SetProfileDataFromDB(dev, Obj, callback) {
        if (env.BuiltType == 1) {
            callback();
            return;
        }

        //var ObjEffectData;
        //ObjEffectData = dev.deviceData.profile[0].lighting;
        //Test
        // ObjEffectData.Effect = 2;
        // ObjEffectData.RateValue = 100;
        // ObjEffectData.WiredBrightnessValue = 100;
        // ObjEffectData.Color = [
        //     {R: 255,G: 255,B: 0},
        //     {R: 0,G: 255,B: 0},
        //     {R: 255,G: 0,B: 0},
        //     {R: 0,G: 0,B: 255},
        //     {R: 120,G: 50,B: 255},
        //     {R: 255,G: 255,B: 255}
        // ]
        this.SetLEDEffect(dev, dev.deviceData.profile[0], () => {
            callback('SetProfileDataFromDB Done');
        });
    }
    //Send From UI
    ApplyLEDEffect(dev, Obj, callback) {
        dev.deviceData.profile = Obj.profileData;

        var ObjEffectData;
        ObjEffectData = dev.deviceData.profile[0].lighting;

        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
            this.setProfileToDevice(dev, () => {
                callback('SetLighting Done');
            });
        });
    }
    //SetLEDEffect
    SetLEDEffect(dev, ObjLEDEffect, callback) {
        env.log(dev.BaseInfo.devicename, 'SetLEDEffect', 'Begin');
        try {
            var iZone = ObjLEDEffect.lighting.Zone; //Zone-0:All Zone,1:Zone1,2:Zone2
            var ZoneLightData = ObjLEDEffect.lightData[iZone];

            var iSpeed = ZoneLightData.RateValue;
            var iBrightness = ZoneLightData.WiredBrightnessValue;
            //Effect ID into Effect Hid
            var target = arrLEDType.find((x) => x.UIEffect == ZoneLightData.Effect);
            var iEffect = target?.EffectHID;

            //Assign Effect Data to Device
            var ObjEffectData = { iZone: iZone, iEffect: iEffect };

            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                var ObjColorData = {
                    iZone: iZone,
                    iLEDGroup: 1,
                    iEffect: iEffect,
                    Color: iEffect == 11 ? [] : ZoneLightData.Color,
                };
                this.SetLEDColorToDevice(dev, ObjColorData, () => {
                    ObjColorData = {
                        iZone: iZone,
                        iLEDGroup: 2,
                        iEffect: iEffect,
                        Color: iEffect == 11 ? [] : ZoneLightData.Color,
                    };
                    this.SetLEDColorToDevice(dev, ObjColorData, () => {
                        var ObjBrightData = {
                            iZone: iZone,
                            iLEDGroup: 1,
                            iEffect: iEffect,
                            iBright: iBrightness,
                            iSpeed: iSpeed,
                        };
                        this.SetBrightSpeedToDevice(dev, ObjBrightData, () => {
                            ObjBrightData = {
                                iZone: iZone,
                                iLEDGroup: 2,
                                iEffect: iEffect,
                                iBright: iBrightness,
                                iSpeed: iSpeed,
                            };
                            this.SetBrightSpeedToDevice(dev, ObjBrightData, () => {
                                var ObjDeviceDb = {
                                    ...dev,
                                };
                                ObjDeviceDb.deviceData.profile[0] = ObjLEDEffect;
                                this.setProfileToDevice(ObjDeviceDb, () => {
                                    console.log('setProfileToDevice Done');
                                    callback('SetLEDEffect Done');
                                });
                            });
                        });
                    });
                });
            });
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'SetLEDEffect', `Error:${e}`);
        }
    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try {
            var Data = Buffer.alloc(9);
            Data[0] = 0x00;
            Data[1] = 0xde; //Set Profile Memory (DEh)

            switch (ObjEffectData.iZone) {
                case 1:
                    Data[2] = 0x52; //BOTTOM LED Group #0 : Method
                    break;
                case 2:
                    Data[2] = 0x84; //BOTTOM LED Group #1 : Method
                    break;
                default:
                    Data[2] = 0x00; //BOTTOM LED Group #All : Method
                    break;
            }
            Data[4] = ObjEffectData.iEffect; //Number-0~19

            this.SetFeatureReport(dev, Data, 20).then(() => {
                callback('SetLEDEffectToDevice Done');
            });
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'SetLEDEffectToDevice', `Error:${e}`);
        }
    }
    SetBrightSpeedToDevice(dev, ObjBrightData, callback) {
        try {
            var iZone = ObjBrightData.iZone;
            var iLEDGroup = ObjBrightData.iLEDGroup;
            //Brightness and Speed
            var iSpeed = ObjBrightData.iSpeed;
            var iBrightness = ObjBrightData.iBright;

            //Determine LED Group  for LED Speed
            var SpeedGroup;
            var BrightGroup = iLEDGroup == 1 ? 0x53 : 0x85;
            switch (ObjBrightData.iEffect) {
                case 0x0b: //LED_SEAMLESS_BREATH
                    SpeedGroup = iLEDGroup == 1 ? 0x82 : 0xb4;
                    break;
                case 2: //LED_BREATH
                    SpeedGroup = iLEDGroup == 1 ? 0x17 : 0x1e;
                    break;
                case 3: //LED_BREATH_ONE_COLOR
                    SpeedGroup = iLEDGroup == 1 ? 0x17 : 0x1e;
                    break;
                default: //Cancel Sending
                    iZone = 1;
                    iLEDGroup = 2;
                    break;
            }
            var Data = Buffer.alloc(9);
            Data[0] = 0x00;
            Data[1] = 0xde; //Set Profile Memory (DEh)
            Data[3] = 0x00;
            //Brightness
            Data[2] = BrightGroup; //BOTTOM LED Group #0 Brightness for LED ON
            Data[4] = iBrightness;
            this.SetFeatureReport(dev, Data, 10).then(() => {
                //Speed
                if (iZone == 0x01 && iLEDGroup != 1) {
                    callback(false);
                } else if (iZone == 0x02 && iLEDGroup != 2) {
                    callback(false);
                } else {
                    Data[2] = SpeedGroup; //BOTTOM LED Group #0 Brightness for LED ON
                    Data[4] = iSpeed;
                    this.SetFeatureReport(dev, Data, 10).then(() => {
                        callback('SetBrightSpeedToDevice Done');
                    });
                }
            });
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'SetBrightSpeedToDevice', `Error:${e}`);
        }
    }
    SetLEDColorToDevice(dev, ObjColorData, callback) {
        try {
            var iZone = ObjColorData.iZone;
            var iLEDGroup = ObjColorData.iLEDGroup;
            //Color
            var arrColor: any[] = [];
            if (!Array.isArray(ObjColorData.Color) && ObjColorData.Color.R == undefined) {
                //if frondend data is hex, then convert to RGB Data
                var ColorData = this.hexToRgb(ObjColorData.Color);
                if (ColorData) {
                    arrColor.push(ColorData);
                }
            } else if (ObjColorData.Color.length > 0) {
                for (var i = 0; i < ObjColorData.Color.length; i++) {
                    if (ObjColorData.Color[i].R == undefined) {
                        //if frondend data is hex, then convert to RGB Data
                        var ColorData = this.hexToRgb(ObjColorData.Color[i]);
                        if (ColorData) {
                            arrColor.push(ColorData);
                        }
                    } else {
                        if (ObjColorData.Color[i].R != undefined) {
                            arrColor.push(ObjColorData.Color[i]);
                        }
                    }
                }
            } else {
                arrColor = ObjColorData.Color;
            }
            //Determine LED Group  for LED
            var LEDGroup;
            var iColorCount = 0;
            switch (ObjColorData.iEffect) {
                case 1: //LED_SINGLE_COLOR
                    iColorCount = 1;
                    LEDGroup = iLEDGroup == 1 ? 0x54 : 0x86;
                    break;
                case 2: //LED_BREATH
                    iColorCount = arrColor.length;
                    LEDGroup = iLEDGroup == 1 ? 0x58 : 0x8a;
                    break;
                case 3: //LED_BREATH_ONE_COLOR
                    iColorCount = 1;
                    LEDGroup = iLEDGroup == 1 ? 0x58 : 0x8a;
                    break;
                default: //Cancel Sending
                    iZone = 1;
                    iLEDGroup = 2;
                    break;
            }
            var Data = Buffer.alloc(9);
            Data[0] = 0x00;
            Data[1] = 0xde; //Set Profile Memory (DEh)
            Data[3] = 0x00;

            const SetAp = (iColor: number, jRGB: number) => {
                if (iColor < iColorCount) {
                    var Color = [arrColor[iColor].R, arrColor[iColor].G, arrColor[iColor].B];
                    if (jRGB < 3) {
                        Data[2] = LEDGroup + iColor * 3 + jRGB; //BOTTOM LED Group #0 for LED ON:        Color-R
                        Data[4] = Color[jRGB];
                        this.SetFeatureReport(dev, Data, 10).then(() => {
                            SetAp(iColor, jRGB + 1);
                        });
                    } else {
                        SetAp(iColor + 1, 0);
                    }
                } else {
                    //Set Breathing/Blinking Number
                    if (ObjColorData.iEffect == 2) {
                        Data[2] = iLEDGroup == 1 ? 0x57 : 0x89;
                        Data[4] = ObjColorData.Color.length;
                        this.SetFeatureReport(dev, Data, 10).then(() => {
                            callback('SetLEDColorToDevice Done');
                        });
                    } else {
                        callback('SetLEDColorToDevice Done');
                    }
                }
            };

            if (iZone == 0x01 && iLEDGroup != 1) {
                callback(false);
            } else if (iZone == 0x02 && iLEDGroup != 2) {
                callback(false);
            } else {
                SetAp(0, 0);
            }
        } catch (e) {
            console.error(dev.BaseInfo.devicename, 'SetLEDEffectToDevice', `Error:${e}`);
        }
    }
    //Send Firmware Data Into node Driver
    SetFeatureReport(dev, buf, iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                if (env.BuiltType == 0) {
                    // Don't send to device if mock devices enabled
                    var rtnData = this.hid?.SetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 9, buf);
                    setTimeout(() => {
                        resolve(rtnData);
                    }, iSleep);
                } else {
                    resolve(0);
                }
            } catch (err: any) {
                console.error('DeviceApi Error', 'SetFeatureReport', `ex:${err.message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf: any, iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                var rtnData = this.hid?.GetFeatureReport(dev.BaseInfo.DeviceId, 0x00, 9);
                setTimeout(() => {
                    // if(rtnData != 65)
                    //     env.log("DeviceApi GetFeatureReport","GetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                }, iSleep);
            } catch (err: any) {
                console.error('DeviceApi Error', 'GetFeatureReport', `ex:${err.message}`);
                resolve(err);
            }
        });
    }

    ////////////////////RGB SYNC////////////////////////////
    //#region RGBSYNC
    SetLEDMatrix(dev, Obj) {
        var DataBuffer = Buffer.alloc(512);
        if (dev.m_bSetHWDevice || !dev.m_bSetSyncEffect) {
            return;
        }

        for (var i = 0; i < 2; i++) {
            var iIndex = i; //Default:14 LEDS
            DataBuffer[iIndex * 3 + 0] = Obj.Buffer[i][0]; //Number 1-Red
            DataBuffer[iIndex * 3 + 1] = Obj.Buffer[i][1]; //Number 1-Green
            DataBuffer[iIndex * 3 + 2] = Obj.Buffer[i][2]; //Number 2-Blue
        }

        var Obj3 = {
            DataBuffer: DataBuffer,
        };
        this.SendLEDData2Device(dev, Obj3);
    }

    SendLEDData2Device(dev, Obj) {
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;

        var Data = Buffer.alloc(9);
        Data[0] = 0x00;
        Data[1] = 0xc4; //Set AP MODE Color (C4h)
        Data[2] = 0xe0;

        for (var i = 0; i < 6; i++) Data[3 + i] = DataBuffer[i]; //21:DataBuffer-7LEDS*3 Bytes
        //-----------------------------------
        this.SetFeatureReport(dev, Data, 10).then(() => {
            //End
        });
        // //-----------------------------------
    }

    SyncFlag(dev, Obj, callback) {
        if (dev.BaseInfo.deviceInfo != undefined && dev.BaseInfo.deviceInfo.SyncFlag) {
            //valueJ must be set to single brightness before RGBSYNC can be run.
            if (Obj) {
                var ObjEffectData = { iZone: 0, iEffect: 0x01 }; //All Zone Single effect
                this.SetLEDEffectToDevice(dev, ObjEffectData, () => {});
            }

            dev.deviceData.EnableRGBSync = Obj; //Assign EnableRGBSync
            dev.m_bSetSyncEffect = Obj;
        }
        callback();
    }

    //#endregion RGBSYNC
}

module.exports = RGBvalueJSeries;
