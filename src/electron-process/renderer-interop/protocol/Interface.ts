import EventEmitter from "events";
import { AppDB } from "../dbapi/AppDB";
import { env } from "../others/env";
import { DeviceService } from "./service/DeviceService";
import { EventTypes } from "../../../common/EventVariable";
import { FuncName, FuncType } from "../../../common/FunctionVariable";
import { FWUpdateSilent } from "./service/FWUpdateService";
import { DBCheckService } from "./service/DBCheckService";
import { UpdateClass } from "../others/update";
import path from "path";
import fs from "node:fs";
import { ClearFolder } from "../others/tool";
import { HidLib, LaunchWinSocketLib } from "./nodeDriver/lib";
import { AppPaths } from "../app-files/appPaths";

export class ProtocolInterface extends EventEmitter
{
    //支援机种
    SupportDevice = undefined;
    hiddevice = HidLib;
    LaunchWinSocket = LaunchWinSocketLib;

    //是否拔插时正刷新设备列表
    IsRefreshDevice = false;

    AppDB: AppDB|boolean = false;

    update: any = false;
    //当前最前程序路径
    //ForegroundAppPath = undefined;

    deviceService!: DeviceService;
    FWUpdateService!: FWUpdateSilent;
    DBCheckService!: DBCheckService;

    constructor()
    {
        super();

        try
        {
            env.log( 'Interface', 'ProtocolInterface', " New ProtocolInterface INSTANCE. ");

            this.AppDB = AppDB.getInstance();
            this.deviceService = DeviceService.getInstance();
            this.deviceService.on(EventTypes.ProtocolMessage, this.OnProtocolMessage.bind(this))

            //------------------FWUpdateService------------------
            this.FWUpdateService = FWUpdateSilent.getInstance();
            this.FWUpdateService.on(EventTypes.ProtocolMessage, this.OnFWUpdateMessage.bind(this));
            // this.HotPlugFlag = true;
            //------------------DBCheckService------------------
            this.DBCheckService = DBCheckService.getInstance(this.AppDB);

            //--------------------------------------------------

            this.update = new UpdateClass();
            this.update.on(EventTypes.ProtocolMessage, this.OnProtocolMessage.bind(this));
            this.hiddevice.DebugMessageCallback(this.DebugCallback);
            this.hiddevice.StartHidPnpNotify();
            this.hiddevice.HIDPnpCallBack(this.HIDDevicePnp.bind(this));


            if (this.hiddevice === undefined)
                env.log( "Interface", "InterfaceClass", `hiddevice init error.`);
            //-------------InitDevice---------------------
            this.DBCheckService.CheckDevicedata(() => {});
            this.ClearDownloadFile();
            //--------------------------------------------
        }
        catch (ex)
        {
            env.log('Interface Error', 'ProtocolInterface', `ex:${(ex as Error).message}`);
        }
    }

    InitDevice(callback)
    {
        this.deviceService!.initDevice().then(() => {
            console.log('initDevice finish');
            env.log('ProtocolInterface','InitDevice','initDevice finish');
        });
    }

    DeleteMacro(obj) {
        return new Promise<void>((resolve,reject) => {
            this.deviceService!.DeleteMacro(obj).then(() => {
                env.log('ProtocolInterface','DeleteMacro','DeleteMacro finish');
                resolve();
            });
        });
    }

    CloseAllDevice(callback?) {
        return new Promise((resolve) => {
            try {
                env.log('Interface', 'CloseAllDevice', ` Begin Close Device `);
                resolve(0);
            } catch (ex) {
                env.log('Interface Error', 'CloseAllDevice', `ex:${(ex as Error).message}`);
                resolve(0);
            }
        });

    };

    HIDDevicePnp(Obj) {
        //HotPlugFlag:
        //It is used to avoid the problem of delay caused by plugging and unplugging when updating the firmware, so use this variable to intercept
        // if (this.HotPlugFlag == true) {
            this.deviceService!.HotPlug(Obj);
        // }
    }

    DebugCallback(Obj) {
        env.log('Interface', 'DebugCallback', JSON.stringify(Obj));
    }

    KeyDataCallback(Obj) {
        var Obj2={
            Type : FuncType.System,
            SN : null,
            Func : EventTypes.KeyDataCallback,
            Param : Obj
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);

    }

    OnProtocolMessage(Obj) {
        this.emit(EventTypes.ProtocolMessage, Obj);

    }

    OnFWUpdateMessage(Obj) {
        // if (Obj.Func == EventTypes.SwitchHotPlug){
        //     this.HotPlugFlag = Obj.Param;
        //     this.deviceService!.SwitchHotPlug(Obj.Param);
        // }else
        if (Obj.Func == "SendFWUPDATE") {
            console.log('SendFWUPDATE: ',Obj.Param.Data);
        }

        if(env.BuiltType == 1) {//Fake Device Process
            this.emit(EventTypes.ProtocolMessage, Obj);
        }
        else if (Obj.Func == EventTypes.SendFWUPDATE && Obj.Param.Data == "PASS"){
            this.deviceService!.RefreshAllDevices();
            this.deviceService!.initDevicebySN(Obj.SN , (res) => {
                this.deviceService!.StartBatteryTimeBySN(Obj.SN);
                this.hiddevice.SwitchHidIntercept(false);
                if (!res) {
                    Obj.Param.Data = "FAIL";
                }

                this.deviceService!.StartBatteryTimeBySN(Obj.SN);
                this.emit(EventTypes.ProtocolMessage, Obj);
            });
        }else if (Obj.Func == EventTypes.SendFWUPDATE && Obj.Param.Data == "FAIL"){
            this.deviceService!.initDevicebySN(Obj.SN , (res) => {
                this.deviceService!.StartBatteryTimeBySN(Obj.SN);
                this.hiddevice.SwitchHidIntercept(false);
                this.emit(EventTypes.ProtocolMessage, Obj);
            });
        }else if (Obj.Func == "DonglePairing"){
            this.deviceService!.DonglePairing(Obj.SN);
        }else{
            this.emit(EventTypes.ProtocolMessage, Obj);
        }
    }


    OnPairingMessage(Obj) {
        this.emit(EventTypes.ProtocolMessage, Obj);
    }

    async RunFunction(Obj, callback) {
        try {
            if (!this.CheckParam(Obj)) {
                callback('Error', 'ProtocolInterface.RunFunction');
                return;
            }
            if (Obj.Func == FuncName.InitDevice) {
                await this.InitDevice(callback);
                return;
            }
            //-----------------------------------
            else if( Obj.Func == 'ClearDownloadFile') {
                await this.ClearDownloadFile();
                return;
            } else if (Obj.Func == FuncName.UpdateApp) {
                await this.update.UpdateApp();
                return;
            } else if (Obj.Func == FuncName.DownloadInstallPackage) {
                await this.update.DownloadInstallPackage();
                return;
            } else if (Obj.Func == FuncName.UpdateFW) {
                await this.update.UpdateFW();
                return;
            } else if(Obj.Func == FuncName.downloadFile) {
                await this.downloadFile(Obj.Param);
                return;
            } else if (Obj.Func == FuncName.DownloadFWInstallPackage) {
                await this.update.DownloadFWInstallPackage();
                return;
            } else if (Obj.Func == FuncName.ExecFile) {
                await this.ExecFile(Obj.Param, callback);
                return;
            } else if (Obj.Func == FuncName.LaunchFWUpdate) {
                await this.hiddevice.SwitchHidIntercept(true);
                Obj.Param.CurrentdeviceSN = Obj.SN;
                await this.FWUpdateService.LaunchFWUpdate(Obj.Param);
                await this.deviceService!.DeleteBatteryTimeBySN(Obj.SN);
                return;
            } else if (Obj.Func == FuncName.ChangeWindowSize) {
                var options: any = {
                    Type: FuncType.System,
                    Func: EventTypes.ChangeWindowSize,
                    Param: Obj.Param
                }
                this.emit(EventTypes.ProtocolMessage, options);
                return;
            }
            else if (Obj.Func == FuncName.ShowWindow) {
                var options: any = {
                    Type: FuncType.System,
                    Func: EventTypes.ShowWindow,
                    Param: Obj.Param
                }
                this.emit(EventTypes.ProtocolMessage, options);
                return;
            } else if (Obj.Func == FuncName.QuitApp) {
                var options: any = {
                    Type: FuncType.System,
                    Func: EventTypes.QuitApp,
                    Param: Obj.Param
                }
                this.emit(EventTypes.ProtocolMessage, options);
                return;
            }else if (Obj.Func == FuncName.HideApp) {
                var options: any = {
                    Type: FuncType.System,
                    Func: EventTypes.HideApp,
                    Param: Obj.Param
                }
                this.emit(EventTypes.ProtocolMessage, options);
                return;
            }
            else if (Obj.Type == FuncType.System)
            {
                var fn = this[Obj.Func];
                fn(Obj.Param).then((data) => {
                    callback(data);
                });
                return;
            }

            switch (Obj.Type) {
                case FuncType.Device:
                case FuncType.Mouse:
                case FuncType.Keyboard:
                    await this.deviceService!.RunFunction(Obj,callback);
                    break;

                default:
                    callback('InterFace RunFun Error', Obj.Type);
                    return;
            }
        } catch (ex) {
            env.log('Interface Error', 'RunFunction', ` ex:${(ex as Error).message}`);
        }
    };

    ExecFile = (obj, callback) => {
        env.log('interface','ExecFile',`${obj.path}`)
        var exec = require('child_process').exec;//execFile->exec
        if(obj.path.indexOf('UpdateApp.bat') != -1) {
            let batPath = path.resolve(path.join(AppPaths.DownloadsFolder,"/UpdateApp.bat"));
            if(fs.existsSync(batPath))
                fs.unlinkSync(batPath)
            let filename = (obj.filename.split('.zip')[0]);
            filename = path.resolve(path.join(AppPaths.DownloadsFolder,"/"+filename));
            let batData ="chcp 65001\r\n"+ "start \"\" \"" + filename + ".exe\""+" /SUPPRESSMSGBOXES /NORESTART";
            fs.writeFileSync(batPath,batData)
            var T_Path_Stringify=JSON.stringify(obj.path);
            exec(T_Path_Stringify,(err,data) => {
                if(err)
                {
                    env.log('ProtocolInterface','ExecFile',err);
                    callback(err);
                }
                else
                {
                    env.log('ProtocolInterface','ExecFile','success');
                    callback('success');
                }
            })
        } else {
            exec(T_Path_Stringify!,(err,data) => {
                if(err)
                {
                    env.log('ProtocolInterface','ExecFile',err);
                    callback(err);
                }
                else
                {
                    env.log('ProtocolInterface','ExecFile','success');
                    callback('success');
                }
            })
        }
    }

    CheckParam(Obj) {
        if (Obj === null || Obj === undefined || typeof Obj !== 'object')
            return false;
        // if (!Obj.hasOwnProperty('Type'))
        // 	return false;
        if (!Obj.hasOwnProperty('Type') || !Obj.hasOwnProperty('Func') || !Obj.hasOwnProperty('Param'))
            return false
        if (Obj.Type === null || Obj.Type === undefined || typeof Obj.Type !== 'number')
            return false;
        return true;
    };


    downloadFile = (obj) => {
        env.log('interface','downloadFile',`${obj}`)

        this.TerminateFWUpdate("FirmwareUpdater",() => {
            this.update.downloadFile(obj.UrlPath,obj.FilePath);
        });
    }

    TerminateFWUpdate = (Obj,callback) => {
        var csRtn;
        const TerminateEXE = (iTimes) => {
            if (iTimes < 5){
                var iFindRtn = this.LaunchWinSocket.FindWindowProcess(Obj);
                if (iFindRtn>=1) {//File is Open
                    csRtn = this.LaunchWinSocket.TerminateProcess(Obj);
                    console.log("LaunchWinSocket TerminateProcess:",csRtn)
                    env.log('Interface FWUpdate','TerminateProcess:',csRtn);
                    setTimeout(() => {
                        //callback("Exit ProcessName App Success");
                        TerminateEXE(iTimes+1);
                    },1000);
                }else{
                    callback("Exit ProcessName App Success");
                }
            }else{
                env.log('Interface FWUpdate','TerminateProcess:',"Exit ProcessName App FAIL");
                callback(csRtn);
            }
        };
        TerminateEXE(0);
    }

    ClearDownloadFile = () => {
        ClearFolder(AppPaths.DownloadsFolder);
    }
}
