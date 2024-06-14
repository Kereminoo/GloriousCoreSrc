import { EventTypes } from "../../../../../common/EventVariable";
import { env } from "../../../others/env";
import { Dock } from "./Dock";

export class CommonDockSeries extends Dock 
{
    static #instance: CommonDockSeries;

    arrLEDType: any[];
    arrBatteryStats: any[];

    constructor(hid) 
    {
        env.log('CommonDockSeries','CommonDockSeries class','begin');
        super();
        this.hid = hid;

        this.arrLEDType =  
        [
            { UIEffect: 0, value: 'Glorious Mode', EffectHID :0x03, RGB: true, BatteryCheck: false },
            { UIEffect: 3, value: 'Single Color', EffectHID :0x04, RGB: false, BatteryCheck: false },
            { UIEffect: 9, value: 'Battery Level', EffectHID :0x02, RGB: false, BatteryCheck: true },
            { UIEffect: 8, value: 'LED Off', EffectHID :0x00, RGB: false, BatteryCheck: false }
        ];
        this.arrBatteryStats =  
        [
            { BatteryStats:-1, hid: 0x00, BatteryFull: false , BatteryLow: false , SleepMode: false , value: 'Disconnected', MinValue :-1, MaxValue: -1},
            { BatteryStats: 0, hid: 0x03, BatteryFull: false , BatteryLow: false , SleepMode: false , value: 'Red Battery', MinValue: 6, MaxValue :25},
            { BatteryStats: 1, hid: 0x02, BatteryFull: false , BatteryLow: false , SleepMode: false , value: 'Orange Battery', MinValue: 26, MaxValue :60},
            { BatteryStats: 2, hid: 0x01, BatteryFull: false , BatteryLow: false , SleepMode: false , value: 'Yellow Battery', MinValue: 61, MaxValue :90},
            { BatteryStats: 3, hid: 0x00, BatteryFull: false , BatteryLow: false , SleepMode: false , value: 'Green Battery', MinValue: 91, MaxValue :99},
            { BatteryStats: 4, hid: 0x00, BatteryFull: true  , BatteryLow: false , SleepMode: false , Charging: true , value: 'Battery Full', MinValue: 100, MaxValue :100},
            { BatteryStats: 5, hid: 0x03, BatteryFull: false , BatteryLow: true  , SleepMode: false , Charging: false , value: 'Battery Low', MinValue: 0, MaxValue :5},
            { BatteryStats: 4, hid: 0x00, BatteryFull: false , BatteryLow: false , SleepMode: false , Charging: false , value: 'Battery Full-OFF', MinValue: 100, MaxValue :100},
            { BatteryStats: 5, hid: 0x03, BatteryFull: false , BatteryLow: false , SleepMode: false , Charging: true , value: 'Battery Low-OFF', MinValue: 0, MaxValue :5},
            { BatteryStats: 6, hid: 0x00, BatteryFull: false , BatteryLow: false , SleepMode: true , value: 'Sleep Mode', MinValue: -1, MaxValue :-1},
        ];
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('CommonDockSeries', 'getInstance', `Get exist CommonDockSeries() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('CommonDockSeries', 'getInstance', `New CommonDockSeries() INSTANCE`);
            this.#instance = new CommonDockSeries(hid);

            return this.#instance;
        }
    }
    InitialDevice(dev,Obj,callback) {
        env.log('CommonDockSeries','initDevice','Begin')
        //Initialize dev value
        dev.m_bSetHWDevice = false;
        dev.BatteryStats = -1;
        dev.BatteryLow = false;
        dev.BatteryFull = false;
        dev.SleepMode = false;
        
        dev.MouseCharging = 0;

        if(env.BuiltType == 0) {
            this.ReadFWVersion(dev,0,() => {
                this.SetProfileDataFromDB(dev,0,() => {
                    var ObjEffectData = dev.deviceData.profile[0].lighting;
                    var Obj3 = {
                        SN: ObjEffectData.ChooseMouseDataValue,
                    };
                    this.SendDockedCharging(dev,Obj3,() => {
                        callback("SetLighting Done");
                    });
                });
            });
            callback(0);
        } else {
            dev.BaseInfo.version_Wired = "0001";
            callback(0);
        }
    }
    /**
     * Read FW Version from device
     * @param {*} dev 
     * @param {*} Obj 
     * @param {*} callback 
     */
    ReadFWVersion(dev,Obj,callback){
        try{
            var rtnData = this.hid!.GetFWVersion(dev.BaseInfo.DeviceId);
            var CurFWVersion = parseInt(rtnData.toString(16), 10);
            var verRev = CurFWVersion.toString();//Version byte Reversed 
            var strVertion = verRev.padStart(4,'0');
            dev.BaseInfo.version_Wired = strVertion; 
            callback(strVertion);
        } catch(e) {
            env.log('GmmkNumpadSeries','ReadFWVersion',`Error:${e}`);
            callback(false);
        }
    }
    /**
     * Refresh Mouse Battery Stats 
     * @param {*} dev 
     * @param {*} Obj 
     * @param {*} callback 
     */
    SendBatteryValue(dev,Obj,callback) {
        if (dev.deviceData.profile.length <= 0) {
            callback();
            return;
        }
        var EffectData = dev.deviceData.profile[0].lighting;
        if (EffectData.ChooseMouseDataValue == Obj.SN) {
            //-----Detect Wireless-Receiver Did Not Find Device---------
            if (Obj.Battery == "Device Not Detected") {
                var target = this.arrBatteryStats.find((x) => x.value == 'Sleep Mode');
                var arrBatteryStats = target;
                if (arrBatteryStats.BatteryStats == dev.BatteryStats){
                    callback();
                    return;
                }
                dev.BatteryFull = arrBatteryStats.BatteryFull;//Battery Full
                dev.BatteryLow = arrBatteryStats.BatteryLow;//Battery Low
                dev.BatteryStats = arrBatteryStats.BatteryStats;
                dev.SleepMode = arrBatteryStats.SleepMode;

                var ObjEffectData = dev.deviceData.profile[0].lighting;
                this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                    callback();
                });
                return;
            }
            //----------------Refresh with the Battery Stats array--------------------
            for (let index = 0; index < this.arrBatteryStats.length; index++) {
                var arrBatteryStats = this.arrBatteryStats[index];
                //----------------SwitchFullandLow--------------------
                if (arrBatteryStats.MinValue <= Obj.Battery && 
                    arrBatteryStats.MaxValue >= Obj.Battery) {
                    var bSwitchFullandLow = false;
                    //----------Refresh BatteryFull and BatteryLow mode------------
                    if (arrBatteryStats.Charging != undefined) {
                        if (arrBatteryStats.Charging == Obj.Charging) {
                            if (dev.BatteryFull != arrBatteryStats.BatteryFull ||
                                dev.BatteryLow != arrBatteryStats.BatteryLow) {
                                bSwitchFullandLow = true;
                            }
                        }
                    }
                    //---------------------------------------------------
                    if (arrBatteryStats.BatteryStats != dev.BatteryStats || bSwitchFullandLow || 
                        dev.MouseCharging != Obj.Charging) {
                        dev.BatteryFull = arrBatteryStats.BatteryFull;//Battery Full
                        dev.BatteryLow = arrBatteryStats.BatteryLow;//Battery Low
                        dev.BatteryStats = arrBatteryStats.BatteryStats;
                        dev.SleepMode = arrBatteryStats.SleepMode;
                        //---------Assign Dock effects whether the mouse is charged or not--------
                        dev.MouseCharging = Obj.Charging;
                        var ObjEffectData;
                        if (dev.deviceData.profile[0].DockedChargingFlag && Obj.Charging) {
                            ObjEffectData = dev.deviceData.profile[0].templighting[2];//templighting[2] is battery default effect
                        }else{
                            ObjEffectData = dev.deviceData.profile[0].lighting;
                        }
                        //---------Assign Dock effects--------
                        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                        });
                        break;
                    }
                }
                
            }
            // //----------Charging Animation For assigned Mouse---------------
            // if (dev.deviceData.profile[0].DockedChargingFlag) {
            //     var Obj2 = {
            //         Func: EventTypes.DockedCharging,
            //         SN: dev.BaseInfo.SN,
            //         Param: {
            //             SN: Obj.SN,
            //             Charging:dev.deviceData.profile[0].DockedChargingFlag
            //             //Charging:Obj.Charging
            //         }
            //     };
            //     this.emit(EventTypes.ProtocolMessage, Obj2);
            // }
            // //--------------------------------------------------------------
        }
        callback();
    }
    SendDisconnected(dev,Obj,callback) {
        var EffectData = dev.deviceData.profile[0].lighting;
        if (EffectData.ChooseMouseDataValue == Obj.SN) {
            dev.Disconnected = true;
            dev.BatteryStats = -1;
            //---------Assign Dock effects--------
            var ObjEffectData = dev.deviceData.profile[0].lighting;
            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
            });
        }
        callback();
    }
    
    //Send App data and convert deviceData into Firmware From Local Data File
    SetProfileDataFromDB(dev,Obj,callback) {
        if(env.BuiltType == 1) {
            callback();
            return;
        }
        var ObjEffectData;
        if (dev.deviceData.profile[0].DockedChargingFlag && dev.MouseCharging) {
            ObjEffectData = dev.deviceData.profile[0].templighting[2];
        }else{
            ObjEffectData = dev.deviceData.profile[0].lighting;
        }
        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
            callback("SetProfileDataFromDB Done");
        });
    }
    //Send From UI
    SetLighting(dev, Obj, callback) {
        
        dev.deviceData.profile = Obj.profileData;
        
        var ObjEffectData;
        if (dev.deviceData.profile[0].DockedChargingFlag && dev.MouseCharging) {
            ObjEffectData = dev.deviceData.profile[0].templighting[2];
        }else{
            ObjEffectData = dev.deviceData.profile[0].lighting;
        }

        if (ObjEffectData.Effect == 9 && ObjEffectData.ChooseMouseDataValue != undefined) {
            dev.BatteryStats = -1;
            //-----------emit-------------------
            var Obj2 = {
                Func: "RefreshBatteryStats",
                SN: ObjEffectData.ChooseMouseDataValue,
                Param: 0
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            this.setProfileToDevice(dev,() => {
                var Obj3 = {
                    SN: ObjEffectData.ChooseMouseDataValue,
                };
                this.SendDockedCharging(dev,Obj3,() => {
                    callback("SetLighting Done");
                });
            });
        }else{
            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                this.setProfileToDevice(dev,() => {
                    var Obj3 = {
                        SN: ObjEffectData.ChooseMouseDataValue,
                    };
                    this.SendDockedCharging(dev,Obj3,() => {
                        callback("SetLighting Done");
                    });
                });
            });
        }

    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try{
            var Data = Buffer.alloc(264);
            
            var target = this.arrLEDType.find((x) => x.UIEffect == ObjEffectData.Effect);
            var iEffect =  target.EffectHID;
            var bBreathing =  ObjEffectData.BreathingCheckValue;
            if (target.value == 'Single Color' && bBreathing == true) {
                iEffect = 0x05;
            }else if(target.value == 'Battery Level' && dev.BatteryStats == -1){
                iEffect = 0x00;
            }
            var bRGB = target.RGB;

            Data[0] = 0x07;
            Data[1] = 0x02;
            Data[2] = iEffect;//EffectHID
            Data[3] = ObjEffectData.RateValue / 5;//Speed:0~20
            Data[4] = ObjEffectData.WiredBrightnessValue / 5;//Brightness:0~20

            if (target.BatteryCheck == true) {
                //Data 5:Battery Low
                Data[5] = dev.BatteryLow ? 1 : 0;//false-0:Default,true-1:Battery Low Red Light
                //Data 6:Battery Full
                Data[6] = dev.BatteryFull ? 1 : 0;//false-0:Default,true-1:Battery Low Red Light
                //Data 6:Sleep Mode
                Data[7] = dev.SleepMode ? 1 : 0;//false-0:Default,true-1:Battery Sleep Purple
            }

            if (dev.BatteryStats != -1) {
                target = this.arrBatteryStats.find((x) => x.BatteryStats == dev.BatteryStats);
                Data[8] = target.hid;
            }

            Data[9] = bRGB ? 0 : 1;//0:RGB,1:SingleColor
            if (ObjEffectData.Color.length > 0) {
                Data[10] = ObjEffectData.Color[0].R;
                Data[11] = ObjEffectData.Color[0].G;
                Data[12] = ObjEffectData.Color[0].B;
            }
            this.SetFeatureReport(dev, Data,5).then(() => {
                callback("SetLEDEffectToDevice Done");
            });
        } catch(e) {
            env.log('GmmkNumpadSeries','SetLEDEffectToDevice',`Error:${e}`);
        }
    }

    //Send Firmware Data Into node Driver
    SetFeatureReport(dev, buf,iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try{
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x00, 256, buf);
                setTimeout(() => {
                    resolve(rtnData);
                },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf,iSleep) {
        //env.log("ModelOSeries","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            try {
                // var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, buf);
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65);
                setTimeout(() => {
                // if(rtnData != 65)
                //     env.log("DeviceApi GetFeatureReport","GetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                },iSleep);
            } catch(err) {
                env.log("DeviceApi Error","GetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    SendDockedCharging(dev, Obj, callback){
        setTimeout(()=>{
            //----------Charging Animation For assigned Mouse---------------
            //if (dev.deviceData.profile[0].DockedChargingFlag) {
                var Obj2 = {
                    Func: EventTypes.DockedCharging,
                    SN: dev.BaseInfo.SN,
                    Param: {
                        SN: Obj.SN,
                        Charging:dev.deviceData.profile[0].DockedChargingFlag
                        //Charging:Obj.Charging
                    }
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            //}
            callback();
            //--------------------------------------------------------------
        },100);

    }

}
