// const EventEmitter = require('events');
// const env = require('../../others/env');
// var nedbObj = require('../../dbapi/AppDB');
// var HID = require('../nodeDriver/HID');
// var FuncAudioSession = require('../nodeDriver/AudioSession');
// var ModelOSeries = require('../device/mouse/ModelOSeries');
// var ModelOV2Series = require('../device/mouse/ModelOV2Series');

import EventEmitter from 'events';
import { env } from '../../others/env';
import { HID } from '../nodeDriver/HID';
import { FuncAudioSession } from '../nodeDriver/AudioSession';
import { AppDB } from '../../dbapi/AppDB';
import { EventTypes } from '../../../../common/EventVariable';
import { FuncName, FuncType } from '../../../../common/FunctionVariable';
import { FakeDevice } from './FakeDevice';
import { ModelOSeries } from '../device/mouse/ModelOSeries';
import { ModelOV2Series } from '../device/mouse/ModelOV2Series';
import { ModelISeries } from '../device/mouse/ModelISeries';
import { CommonMouseSeries } from '../device/mouse/CommonMouseSeries';
import { ModelOWiredSeries } from '../device/mouse/ModelOWiredSeries';
import { ModelOV2WiredSeries } from '../device/mouse/ModelOV2WiredSeries';
import { CommonDockSeries } from '../device/mouseDock/CommonDockSeries';
import { RGBvalueJSeries } from '../device/valueJ/RGBvalueJSeries';
import { GmmkSeries } from '../device/keyboard/GmmkSeries';
import { GmmkNumpadSeries } from '../device/keyboard/GmmkNumpadSeries';
import { valueC } from '../device/keyboard/valueC/valueC';
import { Gmmk3Series } from '../device/keyboard/Gmmk3Series';

// var ModelISeries = require('../device/mouse/ModelISeries');
// var CommonMouseSeries = require('../device/mouse/CommonMouseSeries');
// var GmmkSeries = require('../device/keyboard/GmmkSeries');
// var GmmkNumpadSeries = require('../device/keyboard/GmmkNumpadSeries');
// var ModelOWiredSeries = require('../device/mouse/ModelOWiredSeries');
// var ModelOV2WiredSeries = require('../device/mouse/ModelOV2WiredSeries');

// var DockSeries = require('../device/mouseDock/CommonDockSeries')
// var funcVar = require('../../others/FunctionVariable');
// var EventTypes = require('../../others/EventVariable').EventTypes;
// const FakeDevice = require('./FakeDevice').FakeDevice

export type DeviceInfo = {
    vid: string;
    pid: string;
    devicename: string;
    ModelType: number;
    SN: string;
    DeviceId: number;
    StateID: number;
    StateType: string[];
    StateArray: string[];
    routerID?: string;

    version_Wired: string;
    version_Wireless: string;
    pairingFlag: boolean;
    // img: val.BaseInfo.img

    set?: any[];
};

export class DeviceData {
    BaseInfo: DeviceInfo = {} as DeviceInfo;
    SeriesInstance?: { [key: string]: any };
    deviceData?: any;
}

export class DeviceService extends EventEmitter {
    static #instance?: DeviceService;

    nedbObj!: AppDB;
    SupportDevice!: any[];
    AllDevices!: Map<any, DeviceData>;
    hid!: HID;
    AudioSession!: FuncAudioSession;

    //device instance
    ModelOSeries?;
    ModelOV2Series?;
    ModelISeries?;
    CommonMouseSeries?;
    DockSeries?;
    RGBvalueJSeries?;
    GmmkSeries?;
    Gmmk3Series?;
    GmmkNumpadSeries?;
    ModelOWiredSeries?;
    ModelOV2WiredSeries?;
    valueC?;

    SetPluginDB: boolean = false;

    ObjHotPlug: any = {};
    arrObjHotPlug: any[] = [];

    constructor() {
        env.log('DeviceService', 'DeviceService', 'begin');
        try {
            super();

            this.nedbObj = AppDB.getInstance();
            this.SupportDevice = [];
            this.AllDevices = new Map<any, DeviceData>();
            this.hid = HID.getInstance();
            this.AudioSession = FuncAudioSession.getInstance();

            //device instance
            // this.ModelOSeries;
            // this.ModelOV2Series;
            // this.ModelISeries;
            // this.CommonMouseSeries;
            // this.DockSeries;

            // this.GmmkSeries;
            // this.GmmkNumpadSeries;
            // this.ModelOWiredSeries;
            // this.ModelOV2WiredSeries;

            this.SetPluginDB = false;

            this.ObjHotPlug = {};
            this.arrObjHotPlug = [];
        } catch (e) {
            env.log('ERROR', 'DeviceService', e);
        }
    }

    static getInstance() {
        if (this.#instance) {
            env.log('DeviceService', 'getInstance', `Get exist DeviceService() INSTANCE`);

            return this.#instance;
        } else {
            env.log('DeviceService', 'getInstance', `New DeviceService() INSTANCE`);
            this.#instance = new DeviceService();

            return this.#instance;
        }
    }

    /**
     * Device sends a message back to the App
     * @param {*} Obj
     */
    OnDeviceMessage(Obj) {
        if (Obj.SN != undefined) {
            var dev = this.AllDevices.get(Obj.SN)!;
            if (Obj.Func == 'SwitchKeyboardProfile' && global.ChangeProfileLayerFlag == false) {
                env.log('DeviceService', 'OnDeviceMessage-SwitchKeyboardProfile', Obj.Updown); //1:Up,2:Down
                this.ChangeKeyboardProfileLayer(1, Obj.Updown);
            } else if (Obj.Func == 'SwitchKeyboardLayer' && global.ChangeProfileLayerFlag == false) {
                env.log('DeviceService', 'OnDeviceMessage-SwitchKeyboardLayer', Obj.Updown); //1:Up,2:Down
                this.ChangeKeyboardProfileLayer(2, Obj.Updown);
            } else if (Obj.Func == 'GetBatteryStats') {
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                    if (this.AllDevices.has(sn)) {
                        var devDetect = this.AllDevices.get(sn)!;
                        if (devDetect.BaseInfo.routerID == 'DockSeries') {
                            devDetect.SeriesInstance!['SendBatteryValue'](devDetect, Obj.Param, function () {});
                        }
                    }
                }
                this.emit(EventTypes.ProtocolMessage, Obj);

                //For Dock SendMessage
            } else if (Obj.Func == 'DockedCharging') {
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                    //--------------Bootloader Detect----------------
                    if (this.AllDevices.has(sn)) {
                        var devDetect = this.AllDevices.get(sn)!;
                        if (devDetect.BaseInfo.SN == Obj.Param.SN) {
                            devDetect.SeriesInstance!['DockedCharging'](devDetect, Obj.Param, function () {});
                        }
                    }
                    //--------------Bootloader Detect----------------
                }
            } else if (Obj.Func == 'SendDisconnected') {
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                    if (this.AllDevices.has(sn)) {
                        var devDetect = this.AllDevices.get(sn)!;
                        if (devDetect.BaseInfo.routerID == 'DockSeries') {
                            devDetect.SeriesInstance!['SendDisconnected'](devDetect, Obj.Param, function () {});
                        }
                    }
                }
            } else if (Obj.Func == 'RefreshBatteryStats') {
                if (this.AllDevices.has(Obj.SN)) {
                    var devDetect = this.AllDevices.get(Obj.SN)!;
                    this[dev.BaseInfo.routerID!].GetBatteryStats(dev, 0, function () {});
                }
            } else {
                this.emit(EventTypes.ProtocolMessage, Obj);
            }
        }
    }

    /**
     * Receive messages from the front-end
     * @param {*} Obj
     * @param {*} callback
     */
    async RunFunction(Obj: any, callback: any) {
        if (env.BuiltType == 1) {
            if (Obj.Func != FuncName.GetAudioSession) {
                callback();
                return;
            }
        }
        try {
            if (this.AllDevices.size <= 0) throw new Error('Please initDevice first (AllDevices are empty)');
            if (!this.AllDevices.has(Obj.SN)) throw new Error(`No device with SN ${Obj.SN} in AllDevices`);

            const lookupDevice = this.AllDevices.get(Obj.SN)!;
            const dev = Object.assign(lookupDevice, Obj.Param.device);
            delete Obj.Param.device;
            const devfun = lookupDevice.SeriesInstance![Obj.Func];
            if (devfun === undefined) throw new Error(`Error: device's SeriesInstance does not have ${Obj.Func}`);
            await lookupDevice.SeriesInstance![Obj.Func](dev, Obj.Param, callback);
        } catch (e) {
            env.log('DeviceService', 'RunFunction', `Error ${e}`);
        }
    }

    NumTo16Decimal(rgb) {
        return Number(rgb).toString(16).toUpperCase().padStart(4, '0');
    }

    HIDEP2DataFromDevice(Obj, Obj2) {
        try {
            if (Obj[0] == 6 && Obj[1] == 246 && Obj[2] == 0) {
                //ignore requests to change to non-existing profile 0
                return;
            }

            if (env.BuiltType == 1) return;

            var EP2Array = Obj;
            var DeviceInfo = Obj2;
            if (DeviceInfo.vid != undefined && DeviceInfo.pid != undefined) {
                var SN;
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
                        if (
                            this.SupportDevice[i].vid[iState] == DeviceInfo.vid &&
                            this.SupportDevice[i].pid[iState] == DeviceInfo.pid
                        ) {
                            SN =
                                '0x' +
                                this.NumTo16Decimal(this.SupportDevice[i].vid[0]) +
                                '0x' +
                                this.NumTo16Decimal(this.SupportDevice[i].pid[0]);
                            break;
                        }
                    }
                }
                var dev = this.AllDevices.get(SN)!;
                if (dev.SeriesInstance === undefined) return;
                else {
                    var devfun = dev.SeriesInstance['HIDEP2Data'];
                    if (devfun === undefined) {
                        env.log('DeviceService', 'HIDEP2DataFromDevice', `${Obj.Func}`);
                        return;
                    }
                    dev.SeriesInstance['HIDEP2Data'](dev, EP2Array);
                }
            }
            return;
        } catch (e) {
            env.log('DeviceService', 'HIDEP2DataFromDevice', `Error ${e}`);
        }
    }

    /**
     * Init All Device
     */
    initDevice() {
        env.log('DeviceService', 'initDevice', 'begin');
        //
        var rtn = this.hid.SetDeviceCallbackFunc(this.HIDEP2DataFromDevice.bind(this));
        //
        var filterDevice: any[] = [];
        return new Promise<void>((resolve, reject) => {
            this.GetSupportDevice(() => {
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var deviceresult = 0;
                    var StateID = -1;
                    //--------------FindDevice----------------
                    var EnableStates: any[] = []; //Check for Current Enable Device;
                    for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
                        var result: string | number;
                        for (let index = 0; index < this.SupportDevice[i].set.length; index++) {
                            result = this.hid.FindDevice(
                                this.SupportDevice[i].set[index].usagepage,
                                this.SupportDevice[i].set[index].usage,
                                this.SupportDevice[i].vid[iState],
                                this.SupportDevice[i].pid[iState],
                            );
                            if (result != 0) break;
                        }
                        //---------Bootloader Detect---------------
                        if (result != 0) {
                            var csCallback = 'FindDevice-' + this.SupportDevice[i].devicename + ' : ';
                            env.log('DeviceService', csCallback, 'Found-' + result);
                            EnableStates.push(iState);
                            if (deviceresult == 0) {
                                deviceresult = result;
                                StateID = iState;
                            }

                            //break;
                        }
                    }
                    //--------------FindDevice Done----------------
                    if (deviceresult != 0 || env.BuiltType == 1) {
                        let FakeDeviceFlag = false;
                        if (env.BuiltType == 1) {
                            for (let j = 0; j < FakeDevice.length; j++) {
                                if (
                                    this.SupportDevice[i].vid[0] == FakeDevice[j].vid[0] &&
                                    this.SupportDevice[i].pid[0] == FakeDevice[j].pid[0]
                                ) {
                                    FakeDeviceFlag = true;
                                    StateID = FakeDevice[j].StateID;
                                }
                            }
                        }

                        if (env.BuiltType == 1 && !FakeDeviceFlag) continue;

                        var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                        var dev: { BaseInfo?: any } = {};
                        dev.BaseInfo = this.SupportDevice[i];
                        dev.BaseInfo.DeviceId = deviceresult;
                        dev.BaseInfo.StateID = StateID;
                        dev.BaseInfo.SN = sn;
                        //Assign StateArray from EnableStates;
                        dev.BaseInfo.StateArray = [];
                        for (let index = 0; index < EnableStates.length; index++) {
                            dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType[EnableStates[index]]);
                        }

                        filterDevice.push(dev);

                        //--------------DeviceCallback----------------
                        if (env.isWindows) {
                            for (let index = 0; index < this.SupportDevice[i].get.length; index++) {
                                var getEndpoint = this.SupportDevice[i].get[index];
                                var csCallback = 'DeviceDataCallback-' + index + 'index : ' + index;

                                var rtn = this.hid.DeviceDataCallback(
                                    getEndpoint.usagepage,
                                    getEndpoint.usage,
                                    this.SupportDevice[i].vid[StateID],
                                    this.SupportDevice[i].pid[StateID],
                                );
                                env.log('initDevice', csCallback, rtn);
                            }
                        }
                        //--------------DeviceCallback----------------
                    }
                }

                filterDevice
                    .reduce((sequence, dev) => {
                        return sequence
                            .then(() => {
                                this.AllDevices.set(dev.BaseInfo.SN, dev);
                                return;
                            })
                            .then(() => {
                                if (dev.BaseInfo.StateID == 0xff) {
                                    return;
                                } else {
                                    return this.GetDeviceInst(dev);
                                }
                            })
                            .catch((e) => {
                                env.log('DeviceService', 'initDevice', `Error:${e}`);
                            });
                    }, Promise.resolve())
                    .then(() => {
                        return this.SavePluginDevice();
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((e) => {
                        env.log('DeviceService', 'initDevice', `Error:${e}`);
                    });
            });
        });
    }

    /**
     * Init All Device
     */
    initDevicebySN(ObjSN, callback) {
        env.log('DeviceService', 'initDevicebySN', 'begin');
        var filterDevice = [];
        this.GetSupportDevice(() => {
            var DeviceID = 0;
            var EnableStates: any[] = []; //Check for Current Enable Device;
            var deviceresult;
            var StateID;
            for (var i = 0; i < this.SupportDevice.length; i++) {
                deviceresult = 0;
                StateID = -1;

                var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                if (ObjSN == sn) {
                    DeviceID = i;
                    break;
                }
            }
            //--------------FindDevice----------------
            for (var iState = 0; iState < this.SupportDevice[DeviceID].pid.length; iState++) {
                var result;
                for (let index = 0; index < this.SupportDevice[DeviceID].set.length; index++) {
                    result = this.hid.FindDevice(
                        this.SupportDevice[DeviceID].set[index].usagepage,
                        this.SupportDevice[DeviceID].set[index].usage,
                        this.SupportDevice[DeviceID].vid[iState],
                        this.SupportDevice[DeviceID].pid[iState],
                    );
                    if (result != 0) break;
                }
                if (result != 0) {
                    env.log('DeviceService', 'FindDevice', 'begin');
                    EnableStates.push(iState);
                    if (deviceresult == 0) {
                        deviceresult = result;
                        StateID = iState;
                    }
                }
            }
            var devDetect: DeviceData = new DeviceData();
            //--------------FindDevice Done----------------
            if (deviceresult != 0 || env.BuiltType == 1) {
                //--------------DeviceCallback----------------
                if (env.isWindows) {
                    for (let index = 0; index < this.SupportDevice[i].get.length; index++) {
                        var getEndpoint = this.SupportDevice[i].get[index];
                        var csCallback = 'DeviceDataCallback- ' + index + ' : ';
                        var rtn = this.hid.DeviceDataCallback(
                            getEndpoint.usagepage,
                            getEndpoint.usage,
                            this.SupportDevice[i].vid[StateID],
                            this.SupportDevice[i].pid[StateID],
                        );
                        env.log('initDevice', csCallback, rtn);
                    }
                }
                //--------------DeviceCallback----------------

                if (this.AllDevices.has(ObjSN)) {
                    devDetect = this.AllDevices.get(ObjSN)!;

                    devDetect.BaseInfo.DeviceId = deviceresult;
                    devDetect.BaseInfo.StateID = StateID;
                    //Assign StateArray from EnableStates;
                    devDetect.BaseInfo.StateArray = [];
                    for (let index = 0; index < EnableStates.length; index++) {
                        devDetect.BaseInfo.StateArray.push(devDetect.BaseInfo.StateType![EnableStates[index]]);
                    }

                    //Using ASync Progress
                    devDetect.SeriesInstance!['InitialDevice'](devDetect, 0, () => {
                        devDetect.SeriesInstance!['ReadFWVersion'](devDetect, 0, () => {
                            this.SavePluginDevice();
                            callback(true);
                        });
                    });
                } else {
                    devDetect.BaseInfo = this.SupportDevice[DeviceID];
                    devDetect.BaseInfo.SN = ObjSN;
                    devDetect.BaseInfo.DeviceId = deviceresult;
                    devDetect.BaseInfo.StateID = StateID;
                    //Assign StateArray from EnableStates;
                    devDetect.BaseInfo.StateArray = [];
                    for (let index = 0; index < EnableStates.length; index++) {
                        devDetect.BaseInfo.StateArray.push(devDetect.BaseInfo.StateType![EnableStates[index]]);
                    }
                    //-------------------------------------
                    this.AllDevices.set(ObjSN, devDetect);
                    this.GetDeviceInst(devDetect).then(() => {
                        this.SavePluginDevice();
                        callback(true);
                    });
                }
            } else {
                callback(false);
            }

            //Using Sync Progress
            // filterDevice.reduce((sequence, dev) =>{
            //     return sequence.then(() => {
            //         //this.AllDevices.set(dev.BaseInfo.SN, dev);
            //         dev.SeriesInstance.ReadFWVersion(dev,0,function () {
            //             return;
            //         });
            //     }).catch((e)=> {
            //         env.log('DeviceService','initDevice',`Error:${e}`);
            //     });
            // },Promise.resolve()).then(() => {
            //     return this.SavePluginDevice();
            // }).then(() => {
            //     resolve();
            // }).catch((e) => {
            //     env.log('DeviceService','initDevice',`Error:${e}`);
            // });
        });
    }

    RefreshAllDevices() {
        for (var val of this.AllDevices.values()) {
            var result;
            for (var iState = 0; iState < val.BaseInfo.pid.length; iState++) {
                for (let index = 0; index < val.BaseInfo.set!.length; index++) {
                    result = this.hid.FindDevice(
                        val.BaseInfo.set![index].usagepage,
                        val.BaseInfo.set![index].usage,
                        val.BaseInfo.vid[iState],
                        val.BaseInfo.pid[iState],
                    );
                    if (result != 0) break;
                }
                if (result != 0) break;
            }
            if (result == 0) {
                this.AllDevices.delete(val.BaseInfo.SN);
            }
        }
    }
    /**
     * Get Support Data From SupportDB
     */
    GetSupportDevice(callback) {
        if (this.SupportDevice.length == 0) {
            this.nedbObj.getSupportDevice().then((data: any[]) => {
                this.SupportDevice = data;
                callback();
            });
        } else {
            callback();
        }
    }

    /**
     * init device instance and register device event
     * @param {*} dev
     */
    GetDeviceInst(dev) {
        return new Promise<void>((resolve, reject) => {
            env.log('DeviceService', 'GetDeviceInst', 'begin');
            var cmdInst: any = null;
            if (dev.BaseInfo.routerID == 'ModelOSeries') {
                if (this.ModelOSeries == undefined) {
                    this.ModelOSeries = ModelOSeries.getInstance(this.hid);
                    this.ModelOSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.ModelOSeries;
            } else if (dev.BaseInfo.routerID == 'ModelOV2Series') {
                if (this.ModelOV2Series == undefined) {
                    this.ModelOV2Series = ModelOV2Series.getInstance(this.hid);
                    this.ModelOV2Series.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.ModelOV2Series;
            } else if (dev.BaseInfo.routerID == 'ModelISeries') {
                if (this.ModelISeries == undefined) {
                    this.ModelISeries = ModelISeries.getInstance(this.hid);
                    this.ModelISeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.ModelISeries;
            } else if (dev.BaseInfo.routerID == 'CommonMouseSeries') {
                if (this.CommonMouseSeries == undefined) {
                    this.CommonMouseSeries = CommonMouseSeries.getInstance(this.hid);
                }
                cmdInst = this.CommonMouseSeries;
            } else if (dev.BaseInfo.routerID == 'GmmkSeries') {
                if (this.GmmkSeries == undefined) {
                    this.GmmkSeries = GmmkSeries.getInstance(this.hid, this.AudioSession);
                    this.GmmkSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.GmmkSeries;
            } else if (dev.BaseInfo.routerID == 'Gmmk3Series') {
                if (this.Gmmk3Series == undefined) {
                    this.Gmmk3Series = Gmmk3Series.getInstance(this.hid, this.AudioSession);
                    this.Gmmk3Series.on(EventTypes.ProtocolMessage, this.OnDeviceMessage);
                }
                cmdInst = this.Gmmk3Series;
            } else if (dev.BaseInfo.routerID == 'GmmkNumpadSeries') {
                if (this.GmmkNumpadSeries == undefined) {
                    this.GmmkNumpadSeries = GmmkNumpadSeries.getInstance(this.hid, this.AudioSession);
                    this.GmmkNumpadSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.GmmkNumpadSeries;
            } else if (dev.BaseInfo.routerID == 'ModelOWiredSeries') {
                if (this.ModelOWiredSeries == undefined) {
                    this.ModelOWiredSeries = ModelOWiredSeries.getInstance(this.hid);
                    this.ModelOWiredSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.ModelOWiredSeries;
            } else if (dev.BaseInfo.routerID == 'ModelOV2WiredSeries') {
                if (this.ModelOV2WiredSeries == undefined) {
                    this.ModelOV2WiredSeries = ModelOV2WiredSeries.getInstance(this.hid);
                    this.ModelOV2WiredSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.ModelOV2WiredSeries;
            } else if (dev.BaseInfo.routerID == 'DockSeries') {
                if (this.DockSeries == undefined) {
                    this.DockSeries = CommonDockSeries.getInstance(this.hid);
                    this.DockSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.DockSeries;
            } else if (dev.BaseInfo.routerID == 'valueC') {
                if (!this.valueC) {
                    this.valueC = valueC.getInstance(this.hid);
                    this.valueC.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.valueC;
            } else if (dev.BaseInfo.routerID == 'RGBvalueJSeries') {
                if (!this.RGBvalueJSeries) {
                    this.RGBvalueJSeries = RGBvalueJSeries.getInstance(this.hid);
                    this.RGBvalueJSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
                }
                cmdInst = this.RGBvalueJSeries;
            } else {
                throw Error('Unknown device routerID!!!');
            }

            if (cmdInst != null) {
                dev.SeriesInstance = cmdInst;
                cmdInst
                    .initDevice(dev)
                    .then(() => {
                        if (env.BuiltType == 1) {
                            //If App is Fake Device Mode
                            resolve();
                        } else {
                            dev.SeriesInstance.ReadFWVersion(dev, 0, () => {
                                dev.SeriesInstance.StartBatteryTimeout(dev, 0, function () {});
                                resolve();
                            });
                        }
                    })
                    .catch((e) => {
                        env.log('DeviceService', 'GetDeviceInst', `err: ${e}`);
                        resolve();
                    });
            } else {
                env.log('DeviceService', 'GetDeviceInst', 'cmdInst undefined');
                resolve();
            }
        });
    }

    /**
     * Save plugin Device to PlugingDB
     */
    SavePluginDevice() {
        env.log('DeviceService', 'SavePluginDevice', 'SavePluginDevice');
        return new Promise<void>((resolve, reject) => {
            let devList: {
                Keyboard: DeviceInfo[];
                Mouse: DeviceInfo[];
                valueE: DeviceInfo[];
                MouseDock: DeviceInfo[];
            } = {
                Keyboard: [],
                Mouse: [],
                valueE: [],
                MouseDock: [],
            };

            for (var val of this.AllDevices.values()) {
                if (val.BaseInfo.ModelType == 1) {
                    var Mouse = {
                        vid: val.BaseInfo.vid,
                        pid: val.BaseInfo.pid,
                        devicename: val.BaseInfo.devicename,
                        ModelType: val.BaseInfo.ModelType,
                        SN: val.BaseInfo.SN,
                        DeviceId: val.BaseInfo.DeviceId,
                        StateID: val.BaseInfo.StateID, //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
                        StateArray: val.BaseInfo.StateArray,

                        version_Wired: val.BaseInfo.version_Wired,
                        version_Wireless: val.BaseInfo.version_Wireless,
                        pairingFlag: val.BaseInfo.pairingFlag,
                        // img: val.BaseInfo.img
                    };
                    devList.Mouse.push(Mouse);
                } else if (val.BaseInfo.ModelType == 2) {
                    var Keyboaerd = {
                        vid: val.BaseInfo.vid,
                        pid: val.BaseInfo.pid,
                        devicename: val.BaseInfo.devicename,
                        ModelType: val.BaseInfo.ModelType,
                        SN: val.BaseInfo.SN,
                        DeviceId: val.BaseInfo.DeviceId,
                        StateID: val.BaseInfo.StateID, //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
                        StateArray: val.BaseInfo.StateArray,

                        version_Wired: val.BaseInfo.version_Wired,
                        version_Wireless: val.BaseInfo.version_Wireless,
                        pairingFlag: val.BaseInfo.pairingFlag,
                        // img: val.BaseInfo.img
                    };
                    devList.Keyboard.push(Keyboaerd);
                } else if (val.BaseInfo.ModelType == 3) {
                    var valueE = {
                        vid: val.BaseInfo.vid,
                        pid: val.BaseInfo.pid,
                        devicename: val.BaseInfo.devicename,
                        ModelType: val.BaseInfo.ModelType,
                        SN: val.BaseInfo.SN,
                        DeviceId: val.BaseInfo.DeviceId,
                        StateID: val.BaseInfo.StateID, //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
                        StateArray: val.BaseInfo.StateArray,

                        version_Wired: val.BaseInfo.version_Wired,
                        version_Wireless: val.BaseInfo.version_Wireless,
                        pairingFlag: val.BaseInfo.pairingFlag,
                        // img: val.BaseInfo.img
                    };
                    devList.valueE.push(valueE);
                } else if (val.BaseInfo.ModelType == 4) {
                    var MouseDock = {
                        vid: val.BaseInfo.vid,
                        pid: val.BaseInfo.pid,
                        devicename: val.BaseInfo.devicename,
                        ModelType: val.BaseInfo.ModelType,
                        SN: val.BaseInfo.SN,
                        DeviceId: val.BaseInfo.DeviceId,
                        StateID: val.BaseInfo.StateID, //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
                        StateArray: val.BaseInfo.StateArray,

                        version_Wired: val.BaseInfo.version_Wired,
                        version_Wireless: val.BaseInfo.version_Wireless,
                        pairingFlag: val.BaseInfo.pairingFlag,
                    };
                    devList.MouseDock.push(MouseDock);
                }
            }
            this.nedbObj.updateAllPluginDevice(devList).then(() => {
                setTimeout(() => {
                    var Obj2 = {
                        Type: FuncType.Device,
                        Func: EventTypes.RefreshDevice,
                        Param: '',
                    };
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                    resolve();
                }, 200);
            });
        });
    }

    /**
     * When device unplug, remove device from davice data
     */
    DeleteBTDevice() {
        for (var i = 0; i < this.SupportDevice.length; i++) {
            //Bootloader Vid/Pid---Stop Open
            var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
            //--------------Bootloader Detect----------------
            if (this.AllDevices.has(sn)) {
                var devDetect = this.AllDevices.get(sn)!;
                if (devDetect.BaseInfo.StateID == 0xff) {
                    this.AllDevices.delete(sn);
                }
            }
            //--------------Bootloader Detect----------------
        }
    }

    /**
     * Device plugin event
     * @param {*} obj
     */
    HotPlug(obj) {
        //---------------------------------------
        // env.log('DeviceService-HotPlug', 'obj:', JSON.stringify(obj));
        this.arrObjHotPlug.push(obj);
        var StateID = -1;
        var plugSN;
        for (var i = 0; i < this.SupportDevice.length; i++) {
            for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
                if (
                    parseInt(this.SupportDevice[i].vid[iState]) == obj.vid &&
                    parseInt(this.SupportDevice[i].pid[iState]) == obj.pid
                ) {
                    StateID = iState;
                    plugSN = this.SupportDevice[i].vid[StateID] + this.SupportDevice[i].pid[StateID];
                    break;
                }
            }
        }
        if (StateID == -1) {
            return;
        }
        //---------------------------------------
        if (this.ObjHotPlug.vid == obj.vid && this.ObjHotPlug.pid == obj.pid) {
            return;
        }
        this.ObjHotPlug = JSON.parse(JSON.stringify(obj));

        env.log('DeviceService-HotPlug', 'this.ObjHotPlug:', JSON.stringify(this.ObjHotPlug));
        try {
            setTimeout(() => {
                //-------------filter ObjHotPlug--------------
                //env.log('DeviceService-HotPlug', 'arrObjHotPlug:', JSON.stringify(this.arrObjHotPlug));
                var indexHotPlug = 0;
                for (var i = 0; i < this.arrObjHotPlug.length; i++) {
                    if (
                        this.arrObjHotPlug[i].vid == this.ObjHotPlug.vid &&
                        this.arrObjHotPlug[i].pid == this.ObjHotPlug.pid
                    ) {
                        indexHotPlug = i;
                    }
                }
                var HotPlugstatus = this.arrObjHotPlug[indexHotPlug]?.status;
                //var HotPlugstatus = iPlugCount > iUnPlugCount ? 1 : 0;

                this.arrObjHotPlug = [];
                //
                env.log('DeviceService-HotPlug', 'HotPlugstatus:', JSON.stringify(HotPlugstatus));
                //-------------filter pluged Device--------------
                var DeviceID = -1;
                var StateID = -1;
                env.log('DeviceService-HotPlug', 'filter ObjHotPlug Device:', this.ObjHotPlug);
                if (HotPlugstatus == 1) {
                    var deviceresult = 0;
                    var EnableStates: any = []; //Check for Current Enable Device;
                    for (var i = 0; i < this.SupportDevice.length; i++) {
                        for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
                            if (
                                parseInt(this.SupportDevice[i].vid[iState]) == this.ObjHotPlug.vid &&
                                parseInt(this.SupportDevice[i].pid[iState]) == this.ObjHotPlug.pid
                            ) {
                                DeviceID = i;
                                break;
                            }
                        }
                    }

                    if (DeviceID != -1) {
                        for (var iState = 0; iState < this.SupportDevice[DeviceID].pid.length; iState++) {
                            var result;
                            for (let index = 0; index < this.SupportDevice[DeviceID].set.length; index++) {
                                result = this.hid.FindDevice(
                                    this.SupportDevice[DeviceID].set[index].usagepage,
                                    this.SupportDevice[DeviceID].set[index].usage,
                                    this.SupportDevice[DeviceID].vid[iState],
                                    this.SupportDevice[DeviceID].pid[iState],
                                );
                                if (result != 0 && StateID == -1) {
                                    StateID = iState;
                                    deviceresult = result;
                                    break;
                                }
                            }
                            if (result != 0) {
                                EnableStates.push(iState);
                                env.log(
                                    'HotPlug-' + this.SupportDevice[DeviceID].devicename,
                                    `State${iState}-FindDevice result:`,
                                    result,
                                );
                            }
                        }
                        // var result ;
                        // for (let index = 0; index < this.SupportDevice[DeviceID].set.length; index++) {
                        //     result = this.hid.FindDevice(this.SupportDevice[DeviceID].set[index].usagepage, this.SupportDevice[DeviceID].set[index].usage,this.SupportDevice[DeviceID].vid[StateID], this.SupportDevice[DeviceID].pid[StateID]);

                        //     if(result != 0){
                        //         env.log('DeviceService-HotPlug', 'initDevice-FindDevice result:', result);
                        //         deviceresult = result;
                        //     }
                        // }
                    }
                    //--------------FindDevice Done----------------
                    if (deviceresult != 0) {
                        //--------------DeviceCallback----------------
                        for (let index = 0; index < this.SupportDevice[DeviceID].get.length; index++) {
                            var getEndpoint = this.SupportDevice[DeviceID].get[index];
                            var csCallback = 'DeviceDataCallback- ' + index + ' : ';

                            var rtn = this.hid.DeviceDataCallback(
                                getEndpoint.usagepage,
                                getEndpoint.usage,
                                this.SupportDevice[DeviceID].vid[StateID],
                                this.SupportDevice[DeviceID].pid[StateID],
                            );
                            env.log('DeviceService-HotPlug', csCallback, rtn);
                        }
                        //--------------DeviceCallback----------------
                        var sn = this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];

                        //When Model O Wired Pluged,then replace dongle device
                        if (this.AllDevices.has(sn)) {
                            var dev: DeviceData = this.AllDevices.get(sn)!;
                            this[dev.BaseInfo.routerID!]?.RefreshPlugDevice(dev, this.SupportDevice[DeviceID], () => {
                                // env.log('DeviceService-HotPlug', "SavePluginDevice", "has sn");
                                this.SavePluginDevice();
                            });
                        } else {
                            var dev: DeviceData = new DeviceData();
                            dev.BaseInfo = this.SupportDevice[DeviceID];
                            dev.BaseInfo.SN = sn;
                            dev.BaseInfo.DeviceId = deviceresult;
                            dev.BaseInfo.StateID = StateID;
                            //------Finished Searching Support Device then initialize Pluged Device---------
                            dev.BaseInfo.StateArray = [];
                            for (let index = 0; index < EnableStates.length; index++) {
                                dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType![EnableStates[index]]);
                            }
                            //
                            this.AllDevices.set(sn, dev);
                            this.GetDeviceInst(dev).then(() => {
                                // env.log('DeviceService-HotPlug', "GetDeviceInst", "Done");
                                console.log('final');
                                this.SavePluginDevice();
                            });
                        }
                    }
                } else {
                    var deviceresult = 0;
                    //--------------Get UnPlug State----------------
                    for (var i = 0; i < this.SupportDevice.length; i++) {
                        for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
                            if (
                                parseInt(this.SupportDevice[i].vid[iState]) == this.ObjHotPlug.vid &&
                                parseInt(this.SupportDevice[i].pid[iState]) == this.ObjHotPlug.pid
                            ) {
                                StateID = iState;
                                DeviceID = i;
                                break;
                            }
                        }
                    }
                    //--------------Get UnPlug State----------------
                    if (StateID != -1) {
                        var sn = this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];
                        if (this.AllDevices.has(sn)) {
                            var dev: DeviceData = this.AllDevices.get(sn)!;
                            //----------------RefreshPlugDevice-----------------
                            this[dev.BaseInfo.routerID!]?.RefreshPlugDevice(
                                dev,
                                this.SupportDevice[DeviceID],
                                (ObjResult) => {
                                    if (ObjResult.Plug == true) {
                                        StateID = ObjResult.StateID;
                                        for (let index = 0; index < this.SupportDevice[DeviceID].get.length; index++) {
                                            //DeviceDataCallback
                                            var getEndpoint = this.SupportDevice[DeviceID].get[index];
                                            var csCallback = 'DeviceDataCallback- ' + index + ' : ';
                                            var rtn = this.hid.DeviceDataCallback(
                                                getEndpoint.usagepage,
                                                getEndpoint.usage,
                                                this.SupportDevice[DeviceID].vid[StateID],
                                                this.SupportDevice[DeviceID].pid[StateID],
                                            );
                                            env.log('DeviceService-HotPlug', csCallback, rtn);
                                        }
                                        this.SavePluginDevice();
                                        //
                                    } else {
                                        var sn =
                                            this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];
                                        this.AllDevices.forEach((dev, devicesn) => {
                                            if (sn == devicesn) {
                                                this.AllDevices.delete(sn);
                                                this.SavePluginDevice();
                                            }
                                        });
                                    }
                                },
                            );
                        }
                    }
                }

                this.ObjHotPlug = {}; //Initialize ObjHotPlug
            }, 100);
        } catch (e) {
            env.log('ERROR', 'HotPlug:', e);
        }
    }

    /**
     * Change keyboard Profile
     * @param flag 1:Profile 2:Layer
     * @param updown 1:Up 2:Down
     */
    async ChangeKeyboardProfileLayer(flag, updown) {
        global.ChangeProfileLayerFlag = true;
        let i = 0;
        let length = this.MapArraylength(this.AllDevices);
        for (var val of this.AllDevices.values()) {
            var dev = this.AllDevices.get(val.BaseInfo.SN)!;
            if (val.BaseInfo.ModelType == 2 && flag == 1) await dev.SeriesInstance!['ChangeProfile'](dev, updown);
            else if (val.BaseInfo.ModelType == 2 && flag == 2) await dev.SeriesInstance!['ChangeLayer'](dev, updown);
            i++;
            if (i >= length) global.ChangeProfileLayerFlag = false;
        }
    }

    //Count Map Array length
    MapArraylength(x) {
        var len = 0;
        for (var count of x) len++;
        return len;
    }

    // //SwitchHotPlug
    // SwitchHotPlug(HotPlugFlag){

    //     for(var i = 0; i < this.SupportDevice.length; i++) {
    //         var sn = this.SupportDevice[i].vid[0]+this.SupportDevice[i].pid[0];
    //         if(this.AllDevices.has(sn)){
    //             var devDetect = this.AllDevices.get(sn);
    //             this.RefreshDeviceID(devDetect, HotPlugFlag,function () {});
    //         }
    //     }
    // }

    RefreshDeviceID(dev, Obj, callback) {
        if (Obj == true) {
            var result = 0;
            var StateID = 0;
            for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
                for (let index = 0; index < dev.BaseInfo.set.length; index++) {
                    result = this.hid.FindDevice(
                        dev.BaseInfo.set[index].usagepage,
                        dev.BaseInfo.set[index].usage,
                        dev.BaseInfo.vid[iState],
                        dev.BaseInfo.pid[iState],
                    );
                    if (result != 0) {
                        dev.BaseInfo.DeviceId = result;
                        StateID = iState;
                        break;
                    }
                }
                if (result != 0) break;
            }
            //--------------DeviceCallback----------------
            if (result != 0) {
                if (env.isWindows) {
                    for (let index = 0; index < dev.BaseInfo.get.length; index++) {
                        var getEndpoint = dev.BaseInfo.get[index];
                        var csCallback = 'DeviceDataCallback- ' + index + ' : ';

                        var rtn = this.hid.DeviceDataCallback(
                            getEndpoint.usagepage,
                            getEndpoint.usage,
                            dev.BaseInfo.vid[StateID],
                            dev.BaseInfo.pid[StateID],
                        );
                        env.log('RefreshDeviceID', csCallback, rtn);
                    }
                }
            }
            //--------------DeviceCallback----------------
        }
        callback();
    }

    DeleteBatteryTimeBySN(sn) {
        if (this.AllDevices.has(sn)) {
            var dev = this.AllDevices.get(sn)!;
            if (dev.SeriesInstance === undefined) return;
            dev.SeriesInstance['DeleteBatteryTimeout'](dev, 0, function () {});
        }
    }

    StartBatteryTimeBySN(sn) {
        if (this.AllDevices.has(sn)) {
            var dev = this.AllDevices.get(sn)!;
            if (dev.SeriesInstance === undefined) return;
            dev.SeriesInstance['StartBatteryTimeout'](dev, 0, function () {});
        }
    }

    DonglePairing(sn) {
        if (this.AllDevices.has(sn)) {
            var dev = this.AllDevices.get(sn)!;
            if (dev.SeriesInstance === undefined) return;
            dev.SeriesInstance['DonglePairing'](dev, 0, function () {});
        }
    }

    //
    DeleteMacro(obj) {
        return new Promise<void>((resolve, reject) => {
            for (var i = 0; i < this.SupportDevice.length; i++) {
                var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                if (this.AllDevices.has(sn)) {
                    var dev = this.AllDevices.get(sn)!;
                    //
                    var iProfile;
                    var ProfileData;
                    var bDeleteMacro = false;
                    var ObjKeyAssign;
                    if (
                        dev.BaseInfo.routerID == 'ModelOSeries' ||
                        dev.BaseInfo.routerID == 'ModelOV2Series' ||
                        dev.BaseInfo.routerID == 'ModelISeries' ||
                        dev.BaseInfo.routerID == 'ModelOWiredSeries'
                    ) {
                        iProfile = dev.deviceData.profileindex - 1;
                        ProfileData = dev.deviceData.profile[iProfile];

                        var arrKeyAssignData = ProfileData.keybinding;
                        for (let iButton = 0; iButton < arrKeyAssignData.length; iButton++) {
                            var KeyAssignData = arrKeyAssignData[iButton]; //Button

                            if (KeyAssignData.group == 1) {
                                //Macro Function
                                if (KeyAssignData.function == obj.MacroValue) {
                                    var defaultData =
                                        this.SupportDevice[i].defaultProfile[iProfile].keybinding[iButton];
                                    arrKeyAssignData[iButton] = defaultData;
                                    bDeleteMacro = true;
                                }
                            }
                        }
                        ObjKeyAssign = {
                            iProfile: iProfile,
                            KeyAssignData: arrKeyAssignData,
                        };
                    } else if (
                        dev.BaseInfo.routerID == 'GmmkSeries' ||
                        dev.BaseInfo.routerID == 'GmmkNumpadSeries' ||
                        dev.BaseInfo.routerID == 'Gmmk3Series'
                    ) {
                        iProfile = dev.deviceData.profileindex;
                        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                        ProfileData = dev.deviceData.profileLayers[iProfile][iLayerIndex];
                        var arrKeyAssignData = ProfileData.assignedKeyboardKeys[0];

                        for (let iButton = 0; iButton < arrKeyAssignData.length; iButton++) {
                            var KeyAssignData = arrKeyAssignData[iButton]; //Button

                            if (
                                KeyAssignData.recordBindCodeType == 'MacroFunction' &&
                                KeyAssignData.macro_Data.value == obj.MacroValue
                            ) {
                                //Macro Function
                                var defaultData =
                                    this.SupportDevice[i].defaultProfile[iProfile].assignedKeyboardKeys[0][iButton];
                                arrKeyAssignData[iButton] = defaultData;
                                bDeleteMacro = true;
                            }
                        }
                        ObjKeyAssign = {
                            iProfile: iProfile,
                            iLayerIndex: iLayerIndex,
                            KeyAssignData: arrKeyAssignData,
                        };
                    } else {
                        //DockSeries,CommonMouseSeries
                        continue;
                    }

                    if (bDeleteMacro) {
                        dev.SeriesInstance!['SetKeyFunction'](dev, ObjKeyAssign, function () {});
                        if (dev.BaseInfo.routerID == 'GmmkSeries' || dev.BaseInfo.routerID == 'Gmmk3Series') {
                            dev.SeriesInstance!['ChangeProfileID'](dev, iProfile, function () {});
                        }

                        dev.SeriesInstance!['setProfileToDevice'](dev, (paramDB) => {
                            resolve();
                        }); // Save DeviceData into Database
                    }
                }
            }
        });
    }
}
