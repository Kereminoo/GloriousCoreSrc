import { EventTypes } from '../../../../../common/EventVariable';
import { env } from '../../../others/env';
import { Device } from '../Device';

export class Mouse extends Device {
    static #instance: Mouse;

    constructor() {
        env.log('Mouse', 'Mouseclass', 'begin');
        super();
    }

    static getInstance(hid?: any) {
        if (this.#instance) {
            env.log('Mouse', 'getInstance', `Get exist Mouse() INSTANCE`);
            return this.#instance;
        } else {
            env.log('Mouse', 'getInstance', `New Mouse() INSTANCE`);
            this.#instance = new Mouse();

            return this.#instance;
        }
    }

    /**
     * init Mouse Device
     * @param {*} dev
     */
    initDevice(dev) {
        env.log('Mouse', 'initDevice', 'begin');
        return new Promise<void>((resolve, reject) => {
            dev.CancelPairing = false;

            this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
                if (exist) {
                    dev.deviceData = exist;
                    //-------------Detect Bootloader-----------------
                    var StateID = dev.BaseInfo.StateID;
                    if (dev.BaseInfo.StateType[StateID] == 'Bootloader') {
                        resolve();
                        return;
                    }
                    //-------------Detect Bootloader-----------------
                    this.InitialDevice(dev, 0, () => {
                        resolve();
                    });
                } else {
                    this.SaveProfileToDevice(dev, (data) => {
                        dev.deviceData = data;
                        //-------------Detect Bootloader-----------------
                        var StateID = dev.BaseInfo.StateID;
                        if (dev.BaseInfo.StateType[StateID] == 'Bootloader') {
                            resolve();
                            return;
                        }
                        //-------------Detect Bootloader-----------------
                        this.InitialDevice(dev, 0, () => {
                            resolve();
                        });
                    });
                }
            });
        });
    }

    ImportProfile(dev, obj, callback) {
        let ProfileIndex = dev.deviceData.profileindex;
        //var profilelist = obj.profilelist;
        env.log('DeviceApi ImportProfile', 'ImportProfile', JSON.stringify(obj));
        dev.deviceData.profile[ProfileIndex - 1] = obj;

        this.SetImportProfileData(dev, 0, () => {
            callback();
        });
    }

    //-------------Pairing For ModelOV2Series MOW V2 and MIW V2-------------------------
    PairingFail(dev, doRefresh: boolean = true) {
        dev.m_bDonglepair = false;
        if (doRefresh) {
            this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {});
        }

        var Obj2 = {
            Func: 'PairingFail',
            SN: dev.BaseInfo.SN,
            Param: {
                SN: dev.BaseInfo.SN,
            },
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
    }

    CancelPairing(dev, Obj, callback) {
        dev.m_bDonglepair = false;
        dev.CancelPairing = true;
        this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {});

        callback();
    }
    DongleParingStart(dev, Obj, callback) {
        //When Finishing FWUpdate, then Start Dongle Pairing
        this.DeleteBatteryTimeout(dev, 0, () => {});

        dev.m_iSnCount = 0x00;
        dev.m_iSnCount2 = 0x00;
        this.OpenDongleDevice(dev, 0, (res) => {
            if (res) {
                this.ClearPairing(dev, Obj, (res) => {
                    if (res) {
                        this.StartPairing(dev, Obj, (res) => {
                            callback();
                        });
                    } else {
                        this.PairingFail(dev);
                        env.log(dev.BaseInfo.devicename, 'DongleParingStart', 'PairingFail');
                        callback();
                    }
                });
            } else {
                this.PairingFail(dev);
                env.log(dev.BaseInfo.devicename, 'DonglePairing', 'Cannot find Dongle Device');
            }
        });
    }

    DonglePairing(dev, Obj, callback) {
        this.DeleteBatteryTimeout(dev, 0, () => {});

        dev.m_iSnCount = 0x00;
        dev.m_iSnCount2 = 0x00;
        this.OpenDongleDevice(dev, 0, (res) => {
            if (res) {
                this.ClearPairing(dev, Obj, (res) => {
                    if (res) {
                        this.StartPairing(dev, Obj, (res) => {});
                    } else {
                        this.PairingFail(dev);
                        env.log(dev.BaseInfo.devicename, 'DonglePairing', 'PairingFail');
                    }
                });
            } else {
                this.PairingFail(dev);
                env.log(dev.BaseInfo.devicename, 'DonglePairing', 'Cannot find Dongle Device');
            }
        });

        callback();
    }
    //

    /**
     * RefreshPlugDevice
     * @param {*} dev
     * @param {*} ObjDeviceInfo
     * @param {*} callback
     */
    OpenDongleDevice(dev, Obj, callback) {
        dev.m_bDonglepair = true;

        var deviceresult = 0;
        var StateID = -1;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            callback(true);
        } else {
            for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
                var result = 0;
                for (var index = 0; index < dev.BaseInfo.set.length; index++) {
                    result = this.hid!.FindDevice(
                        dev.BaseInfo.set[index].usagepage,
                        dev.BaseInfo.set[index].usage,
                        dev.BaseInfo.vid[iState],
                        dev.BaseInfo.pid[iState],
                    );
                    if (result != 0 && dev.BaseInfo.StateType[iState] == 'Dongle') {
                        break;
                    } else {
                        result = 0;
                        continue;
                    }
                }
                if (result != 0) {
                    dev.BaseInfo.StateID = iState;
                    dev.BaseInfo.DeviceId = result;
                    deviceresult = result;
                    break;
                }
            }
            callback(deviceresult != 0);
        }
    }
    //
    ClearPairing(dev, Obj, callback) {
        // var ObjChannel ={Channel:1};
        // this.ClearPairtoDevice(dev, ObjChannel, (res) => {
        //     callback(res);
        // });
        const ClearChannel = (iChannel) => {
            if (iChannel < 5 + 1) {
                //Data: 0
                var ObjChannel = { Channel: iChannel };
                this.ClearPairtoDevice(dev, ObjChannel, (res) => {
                    ClearChannel(iChannel + 1);
                });
            } else {
                callback(true);
            }
        };
        ClearChannel(1);
    }
    StartPairing(dev, Obj, callback) {
        var ObjChannel = { Channel: 1, State: 1 };
        this.StartPairStep1toDevice(dev, ObjChannel, (res) => {
            this.StartPairStep2toDevice(dev, ObjChannel, (res) => {
                env.log(dev.BaseInfo.devicename, 'StartPairing', 'Start TimerPairing');
                if (res) {
                    this.StartTimerPairing(dev, 100);
                } else {
                    this.PairingFail(dev);
                    env.log(dev.BaseInfo.devicename, 'StartPairing', 'PairingFail');
                }
                callback(true);
            });
        });
    }
    StartTimerPairing(dev, iDelay) {
        const TimerPairing = (PairingCount) => {
            if (dev.CancelPairing) {
                //CancelPairing
                dev.CancelPairing = false;
            } else if (PairingCount < 500) {
                //CheckCount,Default:500
                setTimeout(() => {
                    var ObjChannel = { Channel: 1 };
                    this.CheckDetectfromDevice(dev, ObjChannel, (res, resConnect) => {
                        //CMD_FW_32
                        if (res == true && resConnect == true) {
                            dev.m_bDonglepair = false;
                            //-----------------------------------
                            this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {});
                            var Obj2 = {
                                //Func: "PairingFail",
                                Func: 'PairingSuccess',
                                SN: dev.BaseInfo.SN,
                                Param: {
                                    SN: dev.BaseInfo.SN,
                                },
                            };
                            this.emit(EventTypes.ProtocolMessage, Obj2);
                            env.log(dev.BaseInfo.devicename, 'CheckDetectfromDevice', 'PairingSuccess');
                            //-----------------------------------
                        } else {
                            TimerPairing(PairingCount + 1);
                        }
                    });
                }, iDelay);
            } else {
                //GetData Failed
                //-----------------------------------
                this.PairingFail(dev);
                env.log(dev.BaseInfo.devicename, 'StartTimerPairing', 'PairingFail');
                //-----------------------------------
            }
        };
        TimerPairing(0);
    }
    StartPairStep1toDevice(dev, Obj, callback) {
        //CMD_FW_31
        var iSn = dev.m_iSnCount;
        var iTarget = Obj.Channel;
        var iState = Obj.State;
        var iDataLen = 0,
            iDataReportID = 0;
        //------------------------------------
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            iDataReportID = 0x03;
            iDataLen = 64;
        }
        //------------------------------------
        var Data = Buffer.alloc(iDataLen);
        Data[2] = 0x31;
        Data[3] = 0x05;
        Data[4] = iSn; //SN

        Data[5] = 0x00;
        Data[6] = iTarget; //target;
        Data[7] = iState;
        //------------------------
        function ArraySum(total, num) {
            return total + num;
        }
        var CheckSum = Data.reduce(ArraySum);

        Data[0] = iDataReportID;
        Data[1] = CheckSum;
        //------------------------
        dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
            dev.m_iSnCount++;
            dev.m_iSnCount2++;
            callback(true);
        });
    }
    StartPairStep2toDevice(dev, Obj, callback) {
        //CMD_FW_38
        var iSn = dev.m_iSnCount;
        var iTarget = Obj.Channel;
        var iDataLen = 0,
            iDataReportID = 0;
        //------------------------------------
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            iDataReportID = 0x03;
            iDataLen = 64;
        }
        //------------------------------------
        var Data = Buffer.alloc(iDataLen);
        Data[2] = 0x38;
        Data[3] = 0x01;
        Data[4] = iSn; //SN

        Data[5] = 0x00;
        Data[6] = iTarget; //target;
        Data[7] = 0x00;
        //------------------------
        function ArraySum(total, num) {
            return total + num;
        }
        var CheckSum = Data.reduce(ArraySum);

        Data[0] = iDataReportID;
        Data[1] = CheckSum;
        //------------------------
        dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
            var ObjResponse = { CheckCount: 100, FunctionID: 0x38 };
            this.GetResponseData(dev, ObjResponse, (res) => {
                if (res == true) {
                    dev.m_iSnCount++;
                    dev.m_iSnCount2++;
                }
                callback(res);
            });
        });
    }

    GetResponseData(dev, Obj, callback) {
        var CheckCount = Obj.CheckCount;
        var FunctionID = Obj.FunctionID;
        var Data = Buffer.alloc(264);

        (function GetData(iCount) {
            if (iCount > 0) {
                //CheckCount,Default:1000

                dev.SeriesInstance.GetFeatureReport(dev, Data, 1).then((rtnData) => {
                    var rtnFunctionID = rtnData[1 - 1];
                    var res: any = true;
                    res &= (FunctionID == rtnFunctionID && dev.m_iSnCount == rtnData[4 - 1]) as any;
                    res &= (rtnData[2 - 1] == 0x00) as any;
                    //enum Cmd_rsp_status_t : BYTE {
                    //CMD_RSP_SUCCESS = 0x00,
                    //CMD_RSP_FAIL = 0x01,

                    if (!res && iCount > 0) {
                        GetData(iCount - 1);
                    } else {
                        callback(true, rtnData);
                    }
                });
            } else {
                //GetData Failed
                callback(false, false);
            }
        })(CheckCount);
    }

    CheckDetectfromDevice(dev, Obj, callback) {
        //CMD_FW_32

        var iSn = dev.m_iSnCount;
        var iTarget = Obj.Channel;
        var iDataLen = 0,
            iDataReportID = 0;
        //------------------------------------
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            iDataReportID = 0x03;
            iDataLen = 64;
        }
        //------------------------------------
        var Data = Buffer.alloc(iDataLen);
        Data[2] = 0x32;
        Data[3] = 0x01;
        Data[4] = iSn; //SN

        Data[5] = 0x00;
        Data[6] = iTarget; //target;
        Data[7] = 0x00;
        //------------------------
        function ArraySum(total, num) {
            return total + num;
        }
        var CheckSum = Data.reduce(ArraySum);

        Data[0] = iDataReportID;
        Data[1] = CheckSum;
        //------------------------
        dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
            var ObjResponse = { CheckCount: 1, FunctionID: 0x32 };
            this.GetResponseData(dev, ObjResponse, (res, rtnData) => {
                var resConnect = false;
                if (res == true) {
                    resConnect = rtnData[5 - 1];
                    if (resConnect) {
                        resConnect = true;
                    }

                    dev.m_iSnCount < 255 ? dev.m_iSnCount++ : (dev.m_iSnCount = 0);
                    dev.m_iSnCount2 < 255 ? dev.m_iSnCount2++ : (dev.m_iSnCount2 = 0);
                    //console.log("dev.m_iSnCount:",dev.m_iSnCount);
                }
                callback(res, resConnect);
            });
        });

        //callback(true);
    }

    ClearPairtoDevice(dev, Obj, callback) {
        //CMD_FW_35
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] != 'Dongle') {
            //2.4G Dongle
            callback(false);
            return;
        }
        var iSn = dev.m_iSnCount;
        //var iSn2 = m_iSnCount2;
        var iTarget = Obj.Channel;

        var iDataLen = 0,
            iDataReportID = 0;
        //------------------------------------

        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == 'Dongle') {
            //2.4G Dongle
            iDataReportID = 0x03;
            iDataLen = 64;
        }
        var Data = Buffer.alloc(iDataLen);

        Data[2] = 0x35;
        Data[3] = 0x01;
        Data[4] = iSn; //SN

        Data[5] = 0x00;
        Data[6] = iTarget; //target;
        Data[7] = 0x00;
        //------------------------
        function ArraySum(total, num) {
            return total + num;
        }
        var CheckSum = Data.reduce(ArraySum);

        Data[0] = iDataReportID;
        Data[1] = CheckSum;
        //------------------------
        dev.SeriesInstance.SetFeatureReport(dev, Data, 100).then(() => {
            dev.m_iSnCount++;
            callback(true);
        });
    }

    InitialDevice(dev: any, obj: any, callback: (...args) => void) {
        throw new Error('Not Implemented');
    }
}
