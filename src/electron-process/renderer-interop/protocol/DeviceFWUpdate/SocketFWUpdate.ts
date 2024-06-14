import EventEmitter from "events";
import { env } from "../../others/env";
import { EventTypes } from "../../../../common/EventVariable";
import cp from "child_process";
import { LaunchWinSocketLib } from "../nodeDriver/lib";


export class ModelOFWUpdate extends EventEmitter {

    static #instance?:ModelOFWUpdate;

    LaunchWinSocket = LaunchWinSocketLib;

    TimerWaitForLaunch: any;//Timer For Function
    TimerStartFWUpdate: any;//Timer For Function
    WaitForLaunchCount: number;
    TimerGetProcess: any//Timer For Function
    LaunchStep: number;
    LaunchStepCount: number;
    LaunchPath: any[];

    TimerFakerProcess: any;

    CurrentProcess: number;
    ProcessFailCount: number;
    SuccessCount: number;
    FailedDevices: any[];

    devicename: any;
    SN: any;
    TimerFakeProcess: any;

    currentFirmwareProcessId: number = NaN;

    constructor(hid,ObjDeviceInfo) {
        super();

        this.TimerWaitForLaunch = null;//Timer For Function
        this.TimerStartFWUpdate = null;//Timer For Function
        this.WaitForLaunchCount = 0;
        this.TimerGetProcess = null;//Timer For Function
        this.LaunchStep = 0;
        this.LaunchStepCount = 2;
        this.LaunchPath = [];

        this.TimerFakerProcess = null;//Timer For Function

        this.CurrentProcess = 0;
        this.ProcessFailCount = 0;
        this.SuccessCount = 0;
        this.FailedDevices = [];
    }
    static getInstance(hid?,ObjDeviceInfo?) {
        if (this.#instance) {
            env.log('SocketFWUpdate', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('SocketFWUpdate', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new ModelOFWUpdate(hid,ObjDeviceInfo);
            return this.#instance;
        }
    }
    Initialization(DeviceInfo,SN,Obj){
        try{
            this.devicename = DeviceInfo.devicename;
            this.SN = SN;
            this.LaunchPath = [];

            for(var i = 0; i < DeviceInfo.FWUpdateExtension.length; i++) {
                this.LaunchPath.push(Obj.execPath.replace(/\s*?\(\d+\)/, '').replace('.zip', DeviceInfo.FWUpdateExtension[i]));
            }
            this.LaunchStepCount = this.LaunchPath.length;

            this.SuccessCount = 0;
            this.LaunchStep = 0;
            var ObjFWUpdate ={execPath:this.LaunchPath[this.LaunchStep],  Step:this.LaunchStep};
            //Step 1:Get Exe File Path to launch
            this.ExecuteFWUpdate(ObjFWUpdate);

        }catch(err){
            //Print devicename into env logs
            env.log('FWUpdate ' + this.devicename +'Error', 'Initialization',`ex:${(err as Error).message}`);
            console.log("FWUpdate Error","Initialization",`ex:${(err as Error).message}`);
        }
    }
    ExecuteFWUpdate(Obj){
        // if (this.LaunchStep +1 == this.LaunchStepCount) {//Final FWUpdate
        //     var Obj2 = {
        //         Func: EventTypes.SwitchHotPlug,
        //         SN: this.SN,
        //         Param: true
        //     };
        //     this.emit(EventTypes.ProtocolMessage, Obj2);
        // }else{
        //     var Obj2 = {
        //         Func: EventTypes.SwitchHotPlug,
        //         SN: this.SN,
        //         Param: false
        //     };
        //     this.emit(EventTypes.ProtocolMessage, Obj2);
        // }
        //Print devicename into env logs
        env.log('FWUpdate ' + this.devicename ,'ExecuteFWUpdate',Obj.execPath);

        var execFile = cp.execFile;//execFile->exec
        var T_Path_Stringify = JSON.parse(JSON.stringify(Obj.execPath));
        var returnValue = execFile(T_Path_Stringify,(err,data) => {
            if(err)
                env.log('FWUpdate ' + this.devicename,'ExecuteFWUpdate-Error',err);
            else
                env.log('FWUpdate ' + this.devicename,'ExecuteFWUpdate','success');
        });
        this.currentFirmwareProcessId = returnValue.pid ?? NaN;

        if(isNaN(this.currentFirmwareProcessId))
        {
            console.error(new Error('Unable to launch firmware'));
        }

        console.log(returnValue);


        //Step 2:Get Progreess to Check Socket File is open
        this.ProcessFailCount = 0;
        this.WaitForLaunchCount = 0;
        clearInterval(this.TimerWaitForLaunch);
        this.TimerWaitForLaunch = null;
        this.TimerWaitForLaunch = setInterval(() => this.OnTimerWaitForLaunch(), 1000);
    }
    OnTimerWaitForLaunch() {

        var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater","GETPROGRESS");
        if (this.WaitForLaunchCount >= 15) {
            this.WaitForLaunchCount = 0;
            clearInterval(this.TimerWaitForLaunch);
            this.TimerWaitForLaunch = null;
            console.log("LaunchFWUpdate-Failed:")
            env.log('FWUpdate ' + this.devicename,'OnTimerWaitForLaunch','LaunchFWUpdate-Failed');

            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:"FAIL"}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        else if (csRtn1.indexOf("GETPROGRESSOK:") != -1) {
            //Step 3:Get Progreess is response,Then Send Start Update Command
            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:"START"}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            //
            var ProcessSum = 100/this.LaunchStepCount*this.LaunchStep;
            var Process2 = ProcessSum.toString();
            Obj2.Param.Data =Process2;
            this.emit(EventTypes.ProtocolMessage, Obj2);

            this.WaitForLaunchCount = 0;
            clearInterval(this.TimerWaitForLaunch);
            this.TimerWaitForLaunch = null;
            //-----------------------------------------------
            console.log("LaunchFWUpdate-Start To Update:")
            env.log('FWUpdate ' + this.devicename,'OnTimerWaitForLaunch','Start To Update');
            clearInterval(this.TimerStartFWUpdate);
            this.TimerStartFWUpdate = null;
            this.TimerStartFWUpdate = setInterval(() => this.OnTimerStartFWUpdate(), 1000);

            //this.StartFWUpdate();
        }
        this.WaitForLaunchCount ++;
    }
    OnTimerStartFWUpdate() {


        if(this.FailedDevices.indexOf(this.devicename) > -1)
        {
            clearInterval(this.TimerStartFWUpdate);
            this.TimerStartFWUpdate = null;

            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {

                env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device with same name has failed during this update; skipping device.');
                this.CurrentProcess = 0;
                clearInterval(this.TimerFakeProcess);
                this.TimerFakeProcess = null;

                this.ProcessFailCount = 0;
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"ERROR", deviceName: this.devicename, errorKey: (this.LaunchStep == 0) ? "device" : "dongle" }
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
                this.FailedDevices.push(this.devicename);

                this.FinishedFWUpdate();
            });
            return;
        }

        var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater","START");//"START"
        if (csRtn1.indexOf("Device Not Found") != -1 && this.WaitForLaunchCount >= 5) {
            csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater","GETPROGRESS");
            env.log('FWUpdate ' + this.devicename,'StartFWUpdate',csRtn1);

            clearInterval(this.TimerStartFWUpdate);
            this.TimerStartFWUpdate = null;


            // this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
            //     env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device Not Found');
            //     this.CurrentProcess = 0;
            //     clearInterval(this.TimerFakeProcess);
            //     this.TimerFakeProcess = null;
            //     this.TimerFakeProcess = setInterval(() => this.OnTimerFakeProcess(), 20);
            // });

            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device Not Found');
                this.CurrentProcess = 0;
                clearInterval(this.TimerFakeProcess);
                this.TimerFakeProcess = null;

                this.ProcessFailCount = 0;
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"ERROR", deviceName: this.devicename, errorKey: (this.LaunchStep == 0) ? "device" : "dongle" }
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
                this.FailedDevices.push(this.devicename);

                this.FinishedFWUpdate();
            });
        } else if (csRtn1.indexOf("Device Not Found") != -1) {
            this.WaitForLaunchCount ++;
            env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device Not Found,Times:'+this.WaitForLaunchCount);

        } else {
            clearInterval(this.TimerStartFWUpdate);
            this.TimerStartFWUpdate = null;

            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
        }
    }
    StartFWUpdate(){
        //"START" "GETPROGRESS"
        var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater","START");//"START"
        console.log("LaunchWinSocket-Message:",csRtn1);
        if (csRtn1.indexOf("Device Not Found") != -1) {
            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device Not Found');
                this.CurrentProcess = 0;
                clearInterval(this.TimerFakeProcess);
                this.TimerFakeProcess = null;


                this.ProcessFailCount = 0;
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"ERROR", deviceName: this.devicename, errorKey: (this.LaunchStep== 0) ? "device" : "dongle" }
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);

                this.FailedDevices.push(this.devicename);
                this.FinishedFWUpdate();
            });

            // this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
            //     env.log('FWUpdate ' + this.devicename,'StartFWUpdate','Device Not Found');
            //     this.CurrentProcess = 0;
            //     clearInterval(this.TimerFakeProcess);
            //     this.TimerFakeProcess = null;
            //     this.TimerFakeProcess = setInterval(() => this.OnTimerFakeProcess(), 20);
            // });
        } else {
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
        }
    }
    //For ModelO ,If one of the wireless and wired devices is not plugged in, update the progress bar
    OnTimerFakeProcess() {
        this.CurrentProcess ++;
        var ProcessSum = 100/this.LaunchStepCount*this.LaunchStep + this.CurrentProcess;

        if (ProcessSum >= 100/this.LaunchStepCount * (this.LaunchStep+1)){
            clearInterval(this.TimerFakeProcess);
            this.TimerFakeProcess = null;
            this.FinishedFWUpdate();
        }else{
            var Process2 = ProcessSum.toString();
            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:Process2}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
    }
    OnTimerGetProcess() {
        var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater","GETPROGRESS");
        //Return value is "PASS", the update is successful
        if (csRtn1.indexOf("PASS") != -1) {
            this.SuccessCount++;


            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                this.FinishedFWUpdate();
            });
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;

        //Return value is this,Can't find the socket app
        }else if (csRtn1.indexOf("Not Found ProcessName App") != -1) {
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                env.log('FWUpdate ' + this.devicename,'Not Found app-CurProcess:',CurProcess);
                this.ProcessFailCount = 0;
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"FAIL"}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            });
        //FAIL to update Keyboard
        }else if (csRtn1.indexOf("FAIL") != -1) {
            clearInterval(this.TimerGetProcess);
            this.TimerGetProcess = null;
            this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                env.log('FWUpdate ' + this.devicename,'FAIL-' + csRtn1,'CurProcess:'+CurProcess);
                this.ProcessFailCount = 0;
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:"FAIL"}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            });
        }else{//Socket Progress is processing
            var Processlength = csRtn1.split("GETPROGRESSOK:").length;
            var Process = parseInt((csRtn1.split("GETPROGRESSOK:")[Processlength-1]/this.LaunchStepCount) as any);
            var CurProcess = parseInt(csRtn1.split("GETPROGRESSOK:")[Processlength-1]);

            if(this.CurrentProcess == CurProcess && this.ProcessFailCount >= 100 && CurProcess <100) {//Wait Too long-FAIL
                clearInterval(this.TimerGetProcess);
                this.TimerGetProcess = null;
                this.TerminateFWUpdate("FirmwareUpdater",(csRtn) => {
                    env.log('FWUpdate ' + this.devicename,'processingCount:'+this.ProcessFailCount,'CurProcess:'+CurProcess);
                    this.ProcessFailCount = 0;
                    var Obj2 = {
                        Func: EventTypes.SendFWUPDATE,
                        SN: this.SN,
                        Param: {Data:"FAIL"}
                    };
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                });
            }
            else if(this.CurrentProcess == CurProcess) {
                this.ProcessFailCount ++;
            }else{
                this.ProcessFailCount = 0;
                this.CurrentProcess = CurProcess;
                //ProcessSum
                var ProcessSum = 100/this.LaunchStepCount*this.LaunchStep + Process;

                var Process2 = ProcessSum.toString();
                // console.log("LaunchWinSocket-Message:GETPROGRESSOK:",Process2)
                env.log('FWUpdate ' + this.devicename,'GETPROGRESSOK:',Process2);

                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:Process2}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
            }
        }
    }
    TerminateFWUpdate(Obj,callback){
        var csRtn;
        const TerminateEXE = (iTimes) => {
            if (iTimes < 5){
                // this.LaunchWinSocket.TerminateProcessById(this.currentFirmwareProcessId);
                var iFindRtn = this.LaunchWinSocket.FindWindowProcess(Obj);
                if (iFindRtn>=1) {//File is Open
                    csRtn = this.LaunchWinSocket.TerminateProcess(Obj);
                    console.log("LaunchWinSocket TerminateProcess:",csRtn)
                    env.log('FWUpdate ' + this.devicename,'TerminateProcess:',csRtn);
                    setTimeout(() => {
                        //callback("Exit ProcessName App Success");
                        TerminateEXE(iTimes+1);
                    },1000);
                }else{
                    setTimeout(() => {
                        callback("Exit ProcessName App Success");
                    },500);
                }
            }else{
                env.log('FWUpdate ' + this.devicename,'TerminateProcess:',"Exit ProcessName App FAIL");
                callback(csRtn);
            }
        };
        TerminateEXE(0);
    }
    FinishedFWUpdate(){
        this.LaunchStep++;
        if (this.LaunchStep == this.LaunchStepCount) {//Finished,So the update is done
            console.log("FinishedFWUpdate")
            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:"PASS"}
            };
            if ((this.SuccessCount<=0 && env.BuiltType != 1) || this.FailedDevices.length > 0) {
                Obj2.Param.Data = "FAIL";
                env.log('FWUpdate ' + this.devicename,'FAIL-FinishedFWUpdate-SuccessCount:',this.SuccessCount);
            }
            this.emit(EventTypes.ProtocolMessage, Obj2);

            this.FailedDevices = [];

        //Finished,then start to next device Update
        }else{
            var ProcessSum = 100/this.LaunchStepCount*this.LaunchStep + 0;
            var Process2 = ProcessSum.toString();
            var Obj2 = {
                Func: EventTypes.SendFWUPDATE,
                SN: this.SN,
                Param: {Data:Process2}
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);

            env.log('FWUpdate ' + this.devicename,'FinishedFWUpdate-LaunchStep:',this.LaunchStep);
            console.log("ExecuteFWUpdate LaunchStep:",this.LaunchStep)
            var ObjFWUpdate ={execPath:this.LaunchPath[this.LaunchStep],Step:this.LaunchStep};
            this.ExecuteFWUpdate(ObjFWUpdate);
        }
    }
}
