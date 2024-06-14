import EventEmitter from "events";
import { env } from "../../others/env";
import { EventTypes } from "../../../../common/EventVariable";
import fs  from "node:fs";

export class GMMKProFWUpdate extends EventEmitter 
{
    
    static #instance?: GMMKProFWUpdate;

    hid: any;
    DeviceInfo: any;
    FirmwareData: any[];
    TimerBootloader: any;
    OpenInBootloader: boolean;
    m_iTimerIntoAPMode: any;

    constructor(hid,ObjDeviceInfo) 
    {
        super();
        this.hid = hid;
        this.DeviceInfo = ObjDeviceInfo;
        this.FirmwareData = [];
        this.TimerBootloader = null;//Timer For Function

        this.OpenInBootloader = false;
    }
    static getInstance(hid,ObjDeviceInfo) {
        if (this.#instance) {
            env.log('GMMKProFWUpdate', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('GMMKProFWUpdate', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new GMMKProFWUpdate(hid,ObjDeviceInfo);
            return this.#instance;
        }
    }
    Initialization(dev,ObjFile){
        try{
            //this.OpenDevice((result) => {
                this.DeviceInfo.DeviceId = JSON.parse(JSON.stringify(dev.BaseInfo.DeviceId));

                env.log('GMMKProFWUpdate', 'Initialization DeviceInfo.DeviceId ',JSON.stringify(dev.BaseInfo.DeviceId));
                console.log('DeviceInfo.DeviceId ',this.DeviceInfo.DeviceId);
                if (this.DeviceInfo.DeviceId) {//Open Device
                    var Binfile = ObjFile.replace('.zip', '.bin');
                    this.ReadBinToData(Binfile,(Data) => {
                        if (Data != undefined) {//Read BinFile Success
                            this.FirmwareData = Data;
                            if (this.OpenInBootloader) {//FWUpdate->WriteIntoDevice
                                this.SendFwToDevice();
                            } else {
                                this.StartFWUpdate();
                            }
                        }
                        else{
                            var Obj2 = {
                                Func: EventTypes.DownloadProgress,
                                SN: this.DeviceInfo.SN,
                                Param: {Current: 'FAIL'}
                            };
                            this.emit(EventTypes.ProtocolMessage, Obj2);
                        }
                    });
                } else {//Device Not Found
                    var Obj2 = {
                        Func: EventTypes.DownloadProgress,
                        SN: this.DeviceInfo.SN,
                        Param: {Current: 'FAIL'}
                    };
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                }
            //});
        }catch(err){
            env.log('GMMKProFWUpdate Error', 'Initialization',`ex:${(err as Error).message}`);
            console.log("FWUpdate Error","Initialization",`ex:${(err as Error).message}`);
        }
    }
    PluginDevice(dev){
        if (this.hid != undefined) {
            //--------------FindDevice Done----------------
            env.log("GMMKProFWUpdate","PluginDevice",JSON.stringify(this.DeviceInfo.DeviceId));
            this.DeviceInfo.DeviceId = JSON.parse(JSON.stringify(this.DeviceInfo.DeviceId));
            //---------------------------------------------
        }
    }

    StartFWUpdate() {
        var Data = Buffer.alloc(264);
        if (this.DeviceInfo.DeviceId == 0) {
            env.log('GMMKProFWUpdate', 'StartFWUpdate', "Fail to Intoloader");
        } else {
            Data[0] = 0x07;
            Data[1] = 0x30;
            var bIsInBT = false;
            if (parseInt(this.DeviceInfo.version_Wired) >= 200) {
                bIsInBT = true;
            }

            this.SetFeatureReport(Data, 1000,256).then(() => {
                env.log('GMMKProFWUpdate', 'StartFWUpdate', 'Intoloader Success');
                var Obj2 = {
                    Func: EventTypes.DownloadProgress,
                    SN: this.DeviceInfo.SN,
                    Param: {Current: 2}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
    
                if (!bIsInBT) {
                    this.DeviceInfo.DeviceId = 0;//Clear Open
                }
                clearInterval(this.TimerBootloader );
                this.TimerBootloader = null;
                this.TimerBootloader = setInterval(() => this.OnTimerWaitBootloader(), 5000);
            });
        }
    }
    OnTimerWaitBootloader() {
        if (this.DeviceInfo.DeviceId > 0) {
            env.log('GMMKProFWUpdate', 'Intoloader Success:',JSON.stringify(this.DeviceInfo.DeviceId));
            var Obj2 = {
                Func: EventTypes.DownloadProgress,
                SN: this.DeviceInfo.SN,
                Param: {Current: 4}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);

            clearInterval(this.TimerBootloader );
            this.TimerBootloader = null;
            
            this.SendFwToDevice();
        }
        
    }
    SendFwToDevice() {
        env.log('GMMKProFWUpdate', 'SendFwToDevice', "Begin");
        //----------------ReadHexToData----------------
        function ArraySum(total, num) {
            return total + num;
        }
        var CheckSum = this.FirmwareData.reduce(ArraySum);

        var flashCnt = Math.ceil(this.FirmwareData.length / 2048);
        //----------------Clear Flash Data----------------
        var SendCnt = 0;
        var Data = Buffer.alloc(2056);

        var Obj2 = {
            Func: EventTypes.DownloadProgress,
            SN: this.DeviceInfo.SN,
            Param: {Current: 10}
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        
                //-----------------Write Data Into Bootloader-10%~80%------------------
                const WriteBT = (i) =>
                {
                    if (i <= flashCnt)//224
                    {
                        var SendCnt = i;
                        var idiffer = (flashCnt) / 70;//difference Range To 0~70
                        var iProcessWrite = parseInt(((SendCnt) / idiffer) as any) + 10;

                        var Obj2 = {
                            Func: EventTypes.DownloadProgress,
                            SN: this.DeviceInfo.SN,
                            Param: {Current: iProcessWrite}
                        };
                        this.emit(EventTypes.ProtocolMessage, Obj2);
                    
                        for (var iBuffer = 0; iBuffer < 2048; iBuffer++) {
                            Data[8 + iBuffer] = this.FirmwareData[(SendCnt * 2048) + iBuffer];
                        }
                    
                        Data[0] = 0x07;
                        Data[1] = 0x32;
                        Data[2] = SendCnt;
                        Data[3] = flashCnt;		
                        if (SendCnt == flashCnt)
                        {
                            Data[4] = CheckSum >> 8 & 0xff;
                            Data[5] = CheckSum & 0xff;
                        }
                        this.SetFeatureReport(Data, 50, 2048+8).then((rtnData) => {
                            WriteBT(i + 1);
                        });
                    
                    } else {//Write Data Done                
                        setTimeout(() => {
                            env.log('GMMKProFWUpdate', 'SendFwToDevice', "IntoAPMode");
                            var Obj2 = {
                                Func: EventTypes.DownloadProgress,
                                SN: this.DeviceInfo.SN,
                                Param: {Current: 80}
                            };
                            this.emit(EventTypes.ProtocolMessage, Obj2);
                        
                            Data = Buffer.alloc(2056);
                            Data[0] = 0x07;
                            Data[1] = 0x30;
                            this.SetFeatureReport(Data, 3000, 2048+8).then((rtnData) => {
                                
                                clearInterval(this.m_iTimerIntoAPMode);
                                this.m_iTimerIntoAPMode = null;
                                this.m_iTimerIntoAPMode = setInterval(() => this.OnTimerIntoAPMode(), 5000);
                            });
                        }, 2000);
                    }
                };
                WriteBT(0);
    }
    OnTimerIntoAPMode() {
        if (this.DeviceInfo.DeviceId > 0) {
            env.log('GMMKProFWUpdate', 'IntoAPMode Success:',JSON.stringify(this.DeviceInfo.DeviceId));
            clearInterval(this.m_iTimerIntoAPMode);
            this.m_iTimerIntoAPMode = null;

            this.SetDefault(() => {
                var Obj2 = {
                    Func: EventTypes.DownloadProgress,
                    SN: this.DeviceInfo.SN,
                    Param: {Current: 'Success'}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            });
        }
        
    }
    OnTimerGetProcess() {
    
        var Obj2: any = {
            Func: EventTypes.SendFWUPDATE,
            SN: null,
            // Param: {Data:Process2}
            Param: null
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
    }
    OpenDevice(callback){
        try{
            //this.hiddevice.HIDPnpCallBack(this.HIDDevicePnp);
            var DeviceId = 0;
            var deviceresult = 0;
            if (this.hid != undefined) {
                
                //this.hid.HIDPnpCallBack(this.HotPlug);
                //--------------FindDevice----------------
                for (var iState = 0; iState < this.DeviceInfo.pid.length; iState++) {
                    var result ;
                    result = this.hid.FindDevice(this.DeviceInfo.set[0].usagepage, this.DeviceInfo.set[0].usage,this.DeviceInfo.vid[iState], this.DeviceInfo.pid[iState]);
                    env.log('GMMKProFWUpdate', 'OpenDevice: ', result);
                    if (result > 0) {
                        // if (this.DeviceInfo.StateType[iState] == "Bootloader") {
                        //     this.OpenInBootloader = true; 
                        // }
                        deviceresult = result;
                        break;
                    }
                }
            }
            if (deviceresult > 0) {
                this.DeviceInfo.DeviceId = deviceresult;
                callback(true);
            } else {
                callback(false);
            }
        }catch(err){
            console.log("FWUpdate Error","OpenDevice",`ex:${(err as Error).message}`);
        }

    }

    ReadBinToData(ObjFile , callback){
        try{
            //var dbPath1 = path.resolve(path.join('FWUpdate'));
            console.log(ObjFile);
            fs.open(ObjFile, 'r', (err, FileTemp) => {
                if (err) {
                    env.log("FWUpdate_Kemove Error", "ReadHexToData", err);
                    callback(undefined);
                    //console.log(err);
                } else {
                    var buffer = Buffer.alloc(56000);
                    fs.read(FileTemp, buffer, 0, 56000, 0, (err, num) => {
                        console.log(buffer.toString('utf8', 0, num));
                        //---------------Strings To Data Array-----------------
                        var pData = Buffer.alloc(num);
                        for (var i = 0; i < num; i++) {
                            pData[i] = parseInt(buffer[i] as any);
                        }
                        fs.close(FileTemp,(err) => {
                            callback(pData);
                        });
                    });
                }
            });
        }catch(err){
            console.log("FWUpdate Error","ReadBinToData",`ex:${(err as Error).message}`);
            callback(`Error:${(err as Error).message}`);
        }
    }

    SetDefault(callback){
        try{
            var Data = Buffer.alloc(264);
            // //-----------------------------------
            Data[0] = 0x07;
            Data[1] = 0x01;
            Data[2] = 0xff; //DataProfile
            this.SetFeatureReport(Data, 1000,256).then(() => {
                callback(true);
            });
            //-----------------------------------
        }catch(err){
            console.log("FWUpdate Error","SetDefault",`ex:${(err as Error).message}`);
            callback(`Error:${(err as Error).message}`);
        }
    }
    SetFeatureReport(buf,iSleep,length) {
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            try{
                   var rtnData = this.hid.SetFeatureReport(this.DeviceInfo.DeviceId ,0x07, length, buf);
                   //var rtnData = 264;
                   setTimeout(() => {
                    if(rtnData < 8)
                        env.log("GMMKProFWUpdate","SetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                    },iSleep);
            }catch(err){
                env.log("GMMKProFWUpdate Error","SetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
}