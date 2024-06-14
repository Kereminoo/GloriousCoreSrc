import EventEmitter from 'events';
import { AppDB } from '../../dbapi/AppDB';
import { HID } from '../nodeDriver/HID';
import { shell } from 'electron';
import { exec } from 'child_process';
import { env } from '../../others/env';
import { EventTypes } from '../../../../common/EventVariable';
import { FuncAudioSession } from '../nodeDriver/AudioSession';

export class Device extends EventEmitter {
    static #instance: Device;

    nedbObj: AppDB;
    hid?: HID;
    AudioSession?: FuncAudioSession;

    constructor() {
        env.log('Device', 'Device class', 'begin');
        super();

        this.nedbObj = AppDB.getInstance();
    }

    static getInstance() {
        if (this.#instance) {
            env.log('Device', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        } else {
            env.log('Device', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new Device();

            return this.#instance;
        }
    }

    /**
     * Set Device Data to Device
     * @param {*} dev
     * @param {*} callback
     */
    SaveProfileToDevice(dev, callback) {
        env.log(dev.BaseInfo.devicename, 'SaveProfileToDevice', `SaveProfileToDevice`);
        var BaseInfo = dev.BaseInfo;
        var profile = BaseInfo.defaultProfile;
        var obj = {
            vid: BaseInfo.vid,
            pid: BaseInfo.pid,
            SN: BaseInfo.SN,
            devicename: BaseInfo.devicename,
            ModelType: BaseInfo.ModelType,
            image: BaseInfo.img,
            battery: BaseInfo.battery,
            profile: profile,
            profileindex: 1,
            EnableRGBSync: false,
        };
        if (dev.BaseInfo.deviceInfo != undefined && dev.BaseInfo.deviceInfo.SyncFlag) {
            obj.EnableRGBSync = false;
        }
        this.nedbObj.AddDevice(obj).then(() => {
            callback(obj);
        });
    }

    /**
     * update Device Data to DB
     * @param {*} dev
     * @param {*} callback
     */
    setProfileToDevice(dev, callback) {
        env.log(dev.BaseInfo.devicename, 'setProfileToDevice', 'Begin');
        // dev.deviceData.profile = obj
        this.nedbObj.updateDevice(dev.BaseInfo.SN, dev.deviceData);
        callback();
    }

    /**
     * Switch Profile
     * @param {*} dev
     * @param {*} obj
     * @param {*} callback
     */
    ChangeProfile(dev, obj, callback) {
        try {
            this.ChangeProfileID(dev, obj, (params) => {
                if (dev.BaseInfo.deviceInfo != undefined && dev.BaseInfo.deviceInfo.SyncFlag) {
                    var ProfileID = dev.deviceData.profileindex;
                    dev.m_bSetSyncEffect = dev.deviceData.EnableRGBSync;
                }
                callback(obj);
            });
        } catch (e) {
            env.log(dev.BaseInfo.devicename, 'ChangeProfile', `${e}`);
            callback();
        }
    }

    hexToRgb(InputData) {
        try {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(InputData);
            return result
                ? {
                      color: {
                          R: parseInt(result[1], 16),
                          G: parseInt(result[2], 16),
                          B: parseInt(result[3], 16),
                      },
                  }
                : null;
        } catch {
            return 1;
        }
    }

    // padLeft(num,numZeros){
    //     var n = Math.abs(num);
    //     var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    //     var zeroString = Math.pow(10,zeros).toString().substr(1);
    //     if( num < 0 ) {
    //         zeroString = '-' + zeroString;
    //     }
    //     return zeroString+n;

    // }

    /**
     * Run the WebSite
     * @param {*} obj
     * @param {*} callback
     */
    RunWebSite(obj, _callback?) {
        try {
            env.log('DeviceApi RunWebSite', 'RunWebSite', JSON.stringify(obj));
            if (env.isWindows) {
                shell.openExternal(obj);
            } else {
                obj = 'open -nF ' + obj;
                exec(obj, { shell: '/bin/bash' }, function (err, data) {});
            }
        } catch (e) {
            env.log('RunWebSite', 'LaunchProgram', `Error:${e}`);
        }
    }

    /**
     * Run the application
     * @param {*} obj
     * @param {*} callback
     */
    RunApplication(obj, callback?) {
        try {
            env.log('DeviceApi RunApplication', 'RunApplication', JSON.stringify(obj));
            if (env.isWindows) {
                shell.openExternal(obj);
                // exec(obj,function(err,data){
                //     // if(err)
                //     //     callback(err)
                //     // else
                //     //     callback(true);
                // })
            } else {
                obj = 'open -nF ' + obj;
                exec(obj, { shell: '/bin/bash' }, function (err, data) {
                    // if(err)
                    //     callback(err)
                    // else
                    //     callback(true);
                });
            }
        } catch (e) {
            env.log('RunApplication', 'LaunchProgram', `Error:${e}`);
        }
    }

    /**
     * Import Profile
     * @param {*} obj import profile Data
     */
    ImportProfile(dev, obj, callback) {
        env.log('DeviceApi ImportProfile', 'ImportProfile', JSON.stringify(obj));
        let ProfileIndex = dev.deviceData.profile.findIndex((x) => x.profileid == obj.profileid);
        if (ProfileIndex != -1) {
            dev.deviceData.profile[ProfileIndex] = obj;
            this.SetImportProfileData(dev, 0, () => {
                callback();
            });
        }
    }

    /**
     * Sleep Time
     * @param {*} dev
     * @param {*} obj
     * @param {*} callback
     */
    SleepTime(dev, obj, callback) {
        env.log('DeviceApi', 'SleepTime', JSON.stringify(obj));

        this.SetSleepTimetoDevice(dev, obj, () => {
            callback();
        });
    }
    SetSleepTimeFromDataBase(dev, obj, callback) {
        this.nedbObj.getAppSetting().then((doc) => {
            var ObjSleep;
            if (doc![0].sleep != undefined && doc![0].sleeptime != undefined) {
                ObjSleep = doc![0];
                this.SetSleepTimetoDevice(dev, ObjSleep, () => {
                    callback();
                });
            } else {
                callback();
            }
        });
    }

    NumTo16Decimal(rgb) {
        //HEX
        var hex = Number(rgb).toString(16).toUpperCase();

        while (hex.length < 4) {
            hex = '0' + hex;
        }
        return hex;
    }

    /**
     * get battery info
     * @param {*} dev
     */
    OnTimerGetBattery(dev) {
        try {
            if (env.BuiltType == 1) {
                return;
            }
            if (dev.BaseInfo.battery) {
                this.GetDeviceBatteryStats(dev, 0, (ObjBattery) => {
                    if (ObjBattery == false) {
                        return;
                    }
                    //-----------emit-------------------
                    var Obj2 = {
                        Func: EventTypes.GetBatteryStats,
                        SN: dev.BaseInfo.SN,
                        Param: ObjBattery,
                    };
                    if (ObjBattery.Status == 0) {
                        this.emit(EventTypes.ProtocolMessage, Obj2);
                    }
                });
            }
        } catch (e) {
            env.log('Device:' + dev.BaseInfo.devicename, 'OnTimerGetBattery', `Error:${e}`);
        }
    }
    DeleteBatteryTimeout(dev, Obj, callback) {
        if (dev.m_TimerGetBattery != undefined) {
            clearInterval(dev.m_TimerGetBattery);
            //delete dev.m_TimerGetBattery;
        }
        callback();
    }
    StartBatteryTimeout(dev, Obj, callback) {
        if (
            (dev.BaseInfo.SN == '0x093A0x822A' ||
                dev.BaseInfo.SN == '0x093A0x821A' ||
                dev.BaseInfo.SN == '0x093A0x824A' ||
                dev.BaseInfo.SN == '0x093A0x826A' ||
                dev.BaseInfo.SN == '0x093A0x833A') &&
            dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle'
        ) {
        } else if (dev.BaseInfo.battery) {
            if (dev.m_TimerGetBattery != undefined) {
                clearInterval(dev.m_TimerGetBattery);
            }
            dev.m_TimerGetBattery = setInterval(() => this.OnTimerGetBattery(dev), 15000); //60000(1 Minute)>2000(2 Second)
        }
        callback();
    }

    /**
     * Get Battery info
     * @param {*} dev
     * @param {*} obj
     * @param {*} callback
     */

    GetBatteryStats(dev, obj, callback) {
        if (env.BuiltType == 1) {
            callback(0);
            return;
        }
        if (dev.BaseInfo.battery) {
            setTimeout(() => {
                this.GetDeviceBatteryStats(dev, 0, (ObjBattery) => {
                    if (ObjBattery.Status == 1) {
                        //Status Error--->Battery Off
                        ObjBattery.Status = 0; //0
                        ObjBattery.Battery = 'Device Not Detected'; //10-->Device Not Detected
                    }
                    //-----------emit-------------------
                    if (ObjBattery == false) {
                        //GMMK Bluetooth mode, FW must wait for EP signal return,So cancel the Function callback
                        env.log(
                            'Device-' + dev.BaseInfo.devicename,
                            'GetBatteryStats-' + JSON.stringify(ObjBattery),
                            JSON.stringify(ObjBattery.Battery),
                        );
                        callback(false);
                    } else {
                        env.log(
                            'Device-' + dev.BaseInfo.devicename,
                            'GetBatteryStats-' + JSON.stringify(ObjBattery.Status) + ':',
                            JSON.stringify(ObjBattery.Battery),
                        );
                        var Obj2 = {
                            Func: 'GetBatteryStats',
                            SN: dev.BaseInfo.SN,
                            Param: ObjBattery,
                        };
                        this.emit(EventTypes.ProtocolMessage, Obj2);
                        env.log(
                            'Device-' + dev.BaseInfo.devicename,
                            'GetBatteryStats-' + JSON.stringify(ObjBattery.Status) + ':',
                            JSON.stringify(ObjBattery.Battery),
                        );
                        callback(ObjBattery);
                    }
                    //----------------------------------
                });
            }, 1000);
        } else {
            callback(0);
        }
    }
    /**
     * RefreshPlugDevice
     * @param {*} dev
     * @param {*} ObjDeviceInfo
     * @param {*} callback
     */
    RefreshPlugDevice(dev, ObjDeviceInfo, callback) {
        if (this.hid == null) {
            throw new Error('Cannot refresh plug device before hid property is set');
        }

        this.DeleteBatteryTimeout(dev, 0, function () {});
        var deviceresult = 0;
        var StateID = -1;

        for (var iState = 0; iState < ObjDeviceInfo.pid.length; iState++) {
            var result;
            for (var index = 0; index < ObjDeviceInfo.set.length; index++) {
                result = this.hid.FindDevice(
                    ObjDeviceInfo.set[index].usagepage,
                    ObjDeviceInfo.set[index].usage,
                    ObjDeviceInfo.vid[iState],
                    ObjDeviceInfo.pid[iState],
                );
                if (result != 0) {
                    break;
                } else {
                    //Delete State number for dev.BaseInfo.StateArray
                    var StateArraynum = dev.BaseInfo.StateArray.indexOf(dev.BaseInfo.StateType[iState]);
                    if (StateArraynum != -1) {
                        dev.BaseInfo.StateArray.splice(StateArraynum, 1);
                    }
                }
            }
            //--------Update StateArray and Assign deviceresult---------------
            if (result != 0) {
                if (deviceresult == 0) {
                    deviceresult = result;
                    StateID = iState;
                }
                var StateArraynum = dev.BaseInfo.StateArray.indexOf(dev.BaseInfo.StateType[iState]);
                if (StateArraynum == -1) {
                    dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType[iState]);
                }
            }
        }
        //-----------------------
        if (deviceresult != 0) {
            dev.BaseInfo.DeviceId = deviceresult;
            dev.BaseInfo.StateID = StateID;

            this.StartBatteryTimeout(dev, 0, function () {});
            this.ReadFWVersion(dev, 0, function () {
                var ObjResult = {
                    Plug: true,
                    StateID: StateID,
                };
                callback(ObjResult);
            });
        } else {
            //Send Mouse No Device into Dock
            if (dev.BaseInfo.ModelType == 1) {
                var Obj2 = {
                    Func: 'SendDisconnected',
                    SN: dev.BaseInfo.SN,
                    Param: {
                        SN: dev.BaseInfo.SN,
                    },
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            }
            //
            var ObjResult = {
                Plug: false,
                StateID: 0,
            };
            callback(ObjResult);
        }
    }
    ////////////////////RGB SYNC////////////////////////////
    SyncFlag(dev, Obj, callback) {
        if (dev.BaseInfo.deviceInfo != undefined && dev.BaseInfo.deviceInfo.SyncFlag) {
            dev.deviceData.EnableRGBSync = Obj; //Assign EnableRGBSync
            dev.m_bSetSyncEffect = Obj;
        }
        callback();
    }
    ////////////////////RGB SYNC////////////////////////////

    //#region AudioSession
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

    GetAudioSession(dev, Obj, callback) {
        try {
            var arrAudioSession = this.AudioSession?.GetSystemAudioSession();
            if (!arrAudioSession) {
                env.log('GmmkNumpadSeries', 'GetAudioSession', `No audio sessions.`);
                return;
            }

            var FrontSession: any[] = [];
            //------------------Add Default Sound Output---------------------
            let AudioSession = {
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
                // var AudioSession: FuncAudioSession|undefined;
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
        } catch (e) {
            env.log('GmmkNumpadSeries', 'GetAudioSession', `Error ${e}`);
        }
    }
    //#endregion AudioSession

    SetImportProfileData(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }
    ChangeProfileID(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }
    SetSleepTimetoDevice(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }
    GetDeviceBatteryStats(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }
    ReadFWVersion(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }


    SearchPerKeyContent(dev,Obj){
        
        var T_data = Obj.Perkeylist.filter(function (item, index, array) {
            if (item.SN == dev.BaseInfo.SN) {
                return item;//Return items that meet the criteria
            }
        });
        if(T_data.length<1){                    
            return;
        }
        
        var iPerKeyIndex = Obj.PerKeyData.value;
        var PerKeyContent;
        for (var i=0;i < T_data.length;i++){
            if (iPerKeyIndex == parseInt(T_data[i].value)
                && T_data[i].SN == dev.BaseInfo.SN) {
                PerKeyContent = T_data[i].content;
                break;
            }
        }
        return PerKeyContent;
    }
}
