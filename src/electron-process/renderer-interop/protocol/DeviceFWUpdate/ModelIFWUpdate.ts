import { EventEmitter } from "stream";
import { env } from "../../others/env";
import { EventTypes } from "../../../../common/EventVariable";

// binary managment
import { LaunchWinSocketLib, GloriousMOISDKLib } from "../nodeDriver/lib";


export class ModelIFWUpdate extends EventEmitter
{
    static #instance?: ModelIFWUpdate;

    LaunchWinSocket = LaunchWinSocketLib;
    GloriousMOISDK = GloriousMOISDKLib;

    TimerWaitForLaunch: any;
    WaitForLaunchCount: any;
    TimerGetProcess: any;
    LaunchPath: any;
    CurrentProcess: any;
    ProcessFailCount: any;
    SuccessCount: any;

    LaunchStep: any;
    SN: any;

    constructor(hid,ObjDeviceInfo)
    {
        super();
        //----------------Defined Variable-------------------
        this.TimerWaitForLaunch = null;//Timer For Function
        this.WaitForLaunchCount = 0;
        this.TimerGetProcess = null;//Timer For Function
        this.LaunchPath;

        this.CurrentProcess = 0;
        this.ProcessFailCount = 0;
        this.SuccessCount = 0;

        //----------------Defined DLL Path-------------------
        // var DLLPath;
        // var isAsar = __dirname.match('app.asar');
        // if(isAsar == null){
        //     DLLPath = path.resolve(__dirname, '../../../../DllSDK/x64/model_i_dll.dll');
        // }else{
        //     DLLPath = path.resolve(__dirname, '../../../../../DllSDK/x64/model_i_dll.dll');
        // }
        // env.log('ModelIFWUpdate','GloriousMOISDK-DllPath:',JSON.stringify(DLLPath));
        //this.GloriousMOISDK.DllPath(DLLPath);
        //----------------Defined DLL Path-------------------
    }
    static getInstance(hid?,ObjDeviceInfo?) {
        if (this.#instance) {
            env.log('ModelIFWUpdate', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('ModelIFWUpdate', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new ModelIFWUpdate(hid,ObjDeviceInfo);
            return this.#instance;
        }
    }
    Initialization(DeviceInfo,SN,Obj){
        try{
            var DeviceFlags = this.GloriousMOISDK.Initialization();
            var LaunchPath = Obj.execPath.replace('.zip','.bin');
            //Step 1:Send bin File Path to NodeDriver

            this.SuccessCount = 0;
            this.LaunchStep = 0;
            this.SN = SN;
            if (env.BuiltType == 1) {
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"PASS"}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            } else {
                var ObjFWUpdate ={execPath:LaunchPath};
                this.ExecuteFWUpdate(ObjFWUpdate);
            }

        }catch(err){
            env.log('ModelIFWUpdate Error', 'Initialization',`ex:${(err as Error).message}`);
            console.log("FWUpdate Error","Initialization",`ex:${(err as Error).message}`);
        }
    }
    ExecuteFWUpdate(Obj){
        //Step 2:Send Firmware Path into nodeDriver and then into DLL
        var result = this.GloriousMOISDK.UpdateFirmware(Obj.execPath);
        if (result) {
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
        }
    }
    OnTimerGetProcess() {
        //Step 3:Get Progreess is response
        var csRtn1 = this.GloriousMOISDK.GetUpdateStats();
        console.log(csRtn1);
        //Device DLL Progress is PASS
        if (csRtn1.indexOf("PASS") != -1) {
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.FinishedFWUpdate();
        }else if (csRtn1.indexOf("FAIL") != -1) {
            env.log('ModelIFWUpdate-GetProcess', 'GetUpdateStats FAIL',csRtn1);
            console.log("ModelIFWUpdate-GetProcess","GetUpdateStats FAIL",csRtn1);
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:"FAIL"}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            //Device DLL Progress is processing
        }else{
            var Processlength = csRtn1.split("GETPROGRESS:").length;
            var CurProcess = parseInt(csRtn1.split("GETPROGRESS:")[Processlength-1]);
            if (CurProcess>100) {
                CurProcess = 100;
            }
            var Process2 = CurProcess.toString();

            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:Process2}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
    }
    //Finished,So the update is done
    FinishedFWUpdate(){
        console.log("FinishedFWUpdate")
        var Obj2 = {
            Func: EventTypes.SendFWUPDATE,
            SN: this.SN,
            Param: {Data:"PASS"}
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
    }
}
