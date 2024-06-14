import EventEmitter from 'events';
import { env } from '../../../others/env';
//var Mouse = require('./Mouse');
// const EventEmitter = require('events');
('use strict');
var _this;

export class ModelO2ProPairing extends EventEmitter {
    static #instance?: ModelO2ProPairing;

    constructor(hid) {
        env.log('ModelO2ProPairing', 'ModelO2ProPairing class', 'begin');
        super();
        _this = this;
        _this.hid = hid;

        _this.arrDongleDevices = [
            { vid: '0x258A', pid: '0x2033', pairingFlag: 2, devicename: 'MO2 PRO W_1K' },
            { vid: '0x258A', pid: '0x2034', pairingFlag: 2, devicename: 'MD2 PRO W_1K' },
            { vid: '0x258A', pid: '0x2035', pairingFlag: 3, devicename: 'MO2 PRO W_4K/8K' },
            { vid: '0x258A', pid: '0x2036', pairingFlag: 3, devicename: 'MD2 PRO W_4K/8K' },
            { vid: '0x258A', pid: '0x2038', pairingFlag: 3, devicename: 'Pro2_4K/8K Dongle Kit' },
        ];
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('ModelO2ProPairing', 'getInstance', `Get exist ModelO2ProPairing() INSTANCE`);
            return this.#instance;
        } else {
            env.log('ModelO2ProPairing', 'getInstance', `New ModelO2ProPairing() INSTANCE`);
            this.#instance = new ModelO2ProPairing(hid);

            return this.#instance;
        }
    }
    /**
     * Get Device RFAddress from Device
     * @param {*} dev
     */
    OpenDongleDevice(dev) {
        var arrDeviceId = [];
        var result = false;
        ///////////////////////////////////////
        var PairingSeries = 0;

        for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
            var DeviceId = _this.hid.FindDevice(
                dev.BaseInfo.set[0].usagepage,
                dev.BaseInfo.set[0].usage,
                dev.BaseInfo.vid[iState],
                dev.BaseInfo.pid[iState],
            );
            if (DeviceId != 0 && iState == 0) {
                //Detected USB Mouse
                dev.BaseInfo.DeviceId = DeviceId;
                if (dev.BaseInfo.pairingFlag != undefined) {
                    PairingSeries = dev.BaseInfo.pairingFlag;
                }
                break;
            } else if (DeviceId != 0 && iState == 1) {
                //Detected Dongle Mouse
                if (dev.BaseInfo.pairingFlag != undefined) {
                    PairingSeries = dev.BaseInfo.pairingFlag;
                }
            }
        }
        //---------------Check Mouse And Reciver Device------------------------
        for (var iDongle = 0; iDongle < _this.arrDongleDevices.length; iDongle++) {
            if (_this.arrDongleDevices[iDongle].pairingFlag == PairingSeries) {
                var RFDeviceId = _this.hid.FindDevice(
                    dev.BaseInfo.set[0].usagepage,
                    dev.BaseInfo.set[0].usage,
                    _this.arrDongleDevices[iDongle].vid,
                    _this.arrDongleDevices[iDongle].pid,
                );
                if (RFDeviceId != 0) {
                    //Detected Dongle
                    dev.BaseInfo.DeviceId_RF = RFDeviceId;
                    result = true;
                    break;
                }
            }
        }
        // if(dev.BaseInfo.SN == '0x258A0x2038'){
        //     var RFDeviceId = _this.hid.FindDevice(dev.BaseInfo.set[0].usagepage, dev.BaseInfo.set[0].usage,dev.BaseInfo.vid[0], dev.BaseInfo.pid[0]);
        //     if(RFDeviceId != 0)//Detected Dongle
        //     {
        //         dev.BaseInfo.DeviceId_RF = RFDeviceId;
        //         result = true;
        //     }
        // }else if (dev.BaseInfo.pairingFlag > 1) {//For Pro 2 Devices
        //     var RFDeviceId = _this.hid.FindDevice(dev.BaseInfo.set[0].usagepage, dev.BaseInfo.set[0].usage,dev.BaseInfo.vid[1], dev.BaseInfo.pid[1]);
        //     if(RFDeviceId != 0)//Detected Dongle
        //     {
        //         dev.BaseInfo.DeviceId_RF = RFDeviceId;
        //         result = true;
        //     }
        // }

        return result;
    }
    ///////////For 1k Devices////////////
    CheckPairingAddress(dev, callback) {
        _this.GetDeviceRFAddress(dev, dev.BaseInfo.DeviceId, function (res1) {
            _this.GetDeviceRFAddress(dev, dev.BaseInfo.DeviceId_RF, function (res2) {
                if (JSON.stringify(res1) == JSON.stringify(res2)) {
                    //The Device Address of Mouse and Dongle are the same
                    callback(true, res1); //Pairing Address are the same
                } else {
                    callback(false, res1); //Pairing Address are the diffierent,then changing dongle address
                }
            });
        });
    }
    /**
     * Set Device RFAddress to Dongle Device
     * @param {*} dev
     * @param {*} arrAddress
     * @param {*} callback
     */
    SetAddresstoDongle(dev, arrAddress, callback) {
        var Data = Buffer.alloc(65);
        Data[0] = 0x00;
        Data[1] = 0x00;
        Data[2] = 0x00;
        Data[3] = 0x01; //Mouse
        Data[4] = 0x04;
        Data[5] = 0x00;
        Data[6] = 0x0a;
        for (let index = 0; index < arrAddress.length; index++) {
            Data[7 + index] = arrAddress[index];
        }
        //----------------------------------------
        _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
        setTimeout(function () {
            var rtnData = _this.hid.GetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
            var result = true;
            if (rtnData[0] == 0xa1) {
                //0xa1:Firmware Command Success
                for (let index = 0; index < arrAddress.length; index++) {
                    if (arrAddress[index] != rtnData[6 + index]) {
                        result = false;
                    }
                }
                //setTimeout(function () {
                //}, 500);
            }
            callback(result);
        }, 200);
    }

    /**
     * Change Device VIDPID to Dongle Device
     * @param {*} dev
     * @param {*} arrAddress
     * @param {*} callback
     */
    SetVIDPIDtoDongle(dev, callback) {
        //Device Pair info
        var Data = Buffer.alloc(65);
        Data[0] = 0x00;
        Data[1] = 0x00;
        Data[2] = 0x00;
        Data[3] = 0x01; //Mouse
        Data[4] = 0x06;
        Data[5] = 0x00;
        Data[6] = 0x0b;

        Data[7] = 0x02; //Device Type:Dongle
        Data[8] = 0x01; //Reserved
        Data[9] = dev.BaseInfo.vid[1] >> 8; //Device Vid-Highbyte
        Data[10] = dev.BaseInfo.vid[1] & 0xff; //Device Vid-Highbyte

        Data[11] = dev.BaseInfo.pid[1] >> 8; //Device Pid-Highbyte
        Data[12] = dev.BaseInfo.pid[1] & 0xff; //Device Pid-Highbyte
        //----------------------------------------
        _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
        setTimeout(() => {
            //---------------------------------
            var RFDeviceId = _this.hid.FindDevice(
                dev.BaseInfo.set[0].usagepage,
                dev.BaseInfo.set[0].usage,
                dev.BaseInfo.vid[1],
                dev.BaseInfo.pid[1],
            );
            if (RFDeviceId != 0) {
                //Detected Dongle
                dev.BaseInfo.DeviceId_RF = RFDeviceId;
                env.log('ModelO2ProPairing', dev.BaseInfo.devicename + ':SetVIDPIDtoDongle', 'Success');
            } else {
                env.log('ModelO2ProPairing', dev.BaseInfo.devicename + ':SetVIDPIDtoDongle', 'New ID is not Detected');
            }

            //---------------------------------
            callback();
        }, 500);
    }
    /**
     * Change Device VIDPID to Dongle Device
     * @param {*} dev
     * @param {*} arrAddress
     * @param {*} callback
     */
    ResetDongle(dev, callback) {
        //Device Pair info
        var iDeviceCount = 2;
        var arrDeviceID = [0x01, 0x00];

        if (dev.BaseInfo.pairingFlag == 3) {
            //2 PRO WIRELESS_4K/8K
            iDeviceCount = 2;
        } else {
            iDeviceCount = 1;
        }
        (function Reset2Device(j) {
            if (j < iDeviceCount) {
                try {
                    var Data = Buffer.alloc(65);
                    Data[0] = 0x00;
                    Data[1] = 0x00;
                    Data[2] = 0x00;
                    Data[3] = arrDeviceID[j]; //Mouse
                    Data[4] = 0x0a; //Device Mode
                    Data[5] = 0x00;
                    Data[6] = 0x00;

                    Data[7] = 0xc0; //reset device
                    Data[8] = 0x00; //reset device
                    _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
                    setTimeout(() => {
                        Reset2Device(j + 1);
                    }, 200);
                } catch (e) {
                    Reset2Device(j + 1);
                }
            } else {
                env.log('ModelO2ProPairing', dev.BaseInfo.devicename + ':ResetDongle', 'Finished');
                callback();
            }
        })(0);
        //----------------------------------------
    }

    /**
     * Get Device RFAddress from Device
     * @param {*} dev
     */
    GetDeviceRFAddress(dev, DeviceId, callback) {
        var Data = Buffer.alloc(65);
        Data[0] = 0x00;
        Data[1] = 0x00;
        Data[2] = 0x00;
        Data[3] = 0x01; //Mouse
        Data[4] = 0x04;
        Data[5] = 0x00;
        Data[6] = 0x8a;
        //----------------------------------------
        var arrAddress: any[] = [];
        _this.hid.SetFeatureReport(DeviceId, 0x00, 65, Data);
        setTimeout(function () {
            var rtnData = _this.hid.GetFeatureReport(DeviceId, 0x00, 65, Data);
            if (rtnData[0] == 0xa1) {
                //0xa1:Firmware Command Success
                for (let index = 0; index < 4; index++) {
                    arrAddress.push(rtnData[6 + index]);
                }
                callback(arrAddress);
            }
        }, 200);
    }
    ///////////////////For 4k/8K Devices/////////////////

    /**
     * Start RF Device Pairing
     * @param {*} dev
     */
    StartRFDevicePairing(dev, callback) {
        var Data = Buffer.alloc(65);
        Data[0] = 0x00;
        Data[1] = 0x00;
        Data[2] = 0x02; //Dongle
        Data[3] = 0x00;
        Data[4] = 0x01;
        Data[5] = 0x00;
        Data[6] = 0x0c;

        Data[7] = 0x01; //pairing start
        //----------------------------------------
        _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
        setTimeout(function () {
            callback(true);
        }, 200);
    }
    /**
     * Get RF Device Pairing Status
     * @param {*} dev
     */
    GetRFDevicePairingStatus(dev, callback) {
        var Data = Buffer.alloc(65);
        Data[0] = 0x00;
        Data[1] = 0x00;
        Data[2] = 0x02; //Dongle
        Data[3] = 0x00;
        Data[4] = 0x01;
        Data[5] = 0x00;
        Data[6] = 0x8c;
        //----------------------------------------
        _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
        setTimeout(() => {
            var rtnData = _this.hid.GetFeatureReport(dev.BaseInfo.DeviceId_RF, 0x00, 65, Data);
            if (rtnData[0] == 0xa1) {
                //0xa1:Firmware Command Success
                //Status-0:Pairing Stop
                //Status-1:Pairing Started
                //Status-2:Pairing Sussess
                //Status-3:Pairing Timeout
                if (rtnData[6] == 2) {
                    callback(1);
                } else if (rtnData[6] == 0) {
                    //Pairing Stop , then return failed
                    env.log('ModelO2ProPairing', dev.BaseInfo.devicename + ':PairingStatus', 'Failed-Stop');
                    callback(-1);
                } else if (rtnData[6] == 3) {
                    //Pairing Timeout, then return failed
                    env.log('ModelO2ProPairing', dev.BaseInfo.devicename + ':PairingStatus', 'Failed-Timeout');
                    callback(-1);
                } else {
                    callback(0);
                }
            } else {
                callback(0);
            }
        }, 100);
    }
}

module.exports = ModelO2ProPairing;
