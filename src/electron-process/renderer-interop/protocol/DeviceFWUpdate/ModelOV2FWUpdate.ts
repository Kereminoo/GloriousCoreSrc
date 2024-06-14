import { env } from "../../others/env";
import { HID } from "../nodeDriver/HID";
import fs from "node:fs";
import { ModelOV2USBDriver } from "./ModelOV2USBDriver";
import { EventTypes } from "../../../../common/EventVariable";

export class ModelOV2FWUpdate extends ModelOV2USBDriver 
{
    static #instance?: ModelOV2FWUpdate;

    
    hid: any;
    //FirmwareData: any;
    ArrayDev: any;
    DeviceStep: any;
    TimerBootloader: any;
    ApModeTimeOut: any;
    ProcessSum2: any;

    OpenInBootloader: boolean;

    SN: any;
    m_TimerSendFWUPDATE: any;

    constructor(hid,ObjDeviceInfo) {
        super();
        
        this.hid = HID.getInstance();
        //this.FirmwareData = [];
        this.ArrayDev = [];
        this.DeviceStep = 0
        this.TimerBootloader = null;//Timer For Function
        
        this.ApModeTimeOut = 0
        this.ProcessSum2 = 0;

        this.OpenInBootloader = false;
    }
    static getInstance(hid?,ObjDeviceInfo?) {
        if (this.#instance) {
            env.log('ModelOV2FWUpdate', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('ModelOV2FWUpdate', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new ModelOV2FWUpdate(hid,ObjDeviceInfo);
            return this.#instance;
        }
    }
    Initialization(arrDeviceInfo,SN,ObjFile){
        try{
            this.SN = SN;
            this.ZipfiletoFirmwareData(arrDeviceInfo,ObjFile.execPath,(result) => {
                if (!result) {
                    this.SendProgressMessage('FAIL');
                    return;
                }
                this.OpenDevice(this.ArrayDev,(result2) => {
                    if (result2) {
                        this.StartFWUpdate(this.ArrayDev);
                    } else {
                        this.SendProgressMessage('FAIL');
                    }

                });
            });

        }catch(err){
            env.log('ModelOV2FWUpdate Error', 'Initialization',`ex:${(err as Error).message}`);
            console.log("FWUpdate Error","Initialization",`ex:${(err as Error).message}`);
        }
    }
    ZipfiletoFirmwareData(arrDeviceInfo,ZipFile,callback){

        var ExtCount = arrDeviceInfo[0].FWUpdateExtension.length;
        const WriteFirmwareData = (i) => {
            if (i < ExtCount){//224
                var ObjFilePath = ZipFile.replace('.zip', arrDeviceInfo[0].FWUpdateExtension[i]);
                ObjFilePath = ObjFilePath.replace('FWUpdate.exe', '');
                var ObjFilename;
    
                //list.filter(file => file.endsWith(extname));
                fs.readdir(ObjFilePath, (err, files)=>{
                    for (var f of files){
                        if (f.endsWith('.bin')){
                            ObjFilename = f;
                            break;
                        }
                    }
                    var FilePath = ObjFilePath + ObjFilename;
                    //---Assign vid and pid-----------------------
                    var BaseInfo = JSON.parse(JSON.stringify(arrDeviceInfo[i]));

                    BaseInfo.vid = JSON.parse(JSON.stringify(arrDeviceInfo[i].vid[BaseInfo.StateID]));
                    BaseInfo.pid = JSON.parse(JSON.stringify(arrDeviceInfo[i].pid[BaseInfo.StateID]));
                    //-------------------------------------
                    var ObjFirmwareData = {FilePath:FilePath,BaseInfo:BaseInfo};
                    this.ArrayDev.push(ObjFirmwareData);
                    //var iState = dev.BaseInfo.StateID;
                    WriteFirmwareData(i+1);
                })
            
            } else {//Write Data Done  

                callback(true);
            }
        };
        WriteFirmwareData(0);
    }
    OpenDevice(ArrayDev,callback){
        try{
            var deviceresult = false;
            if (this.hid != undefined) {
                //--------------FindDevice----------------
                for (var iState = 0; iState < ArrayDev.length; iState++) {
                    var StateDevice = ArrayDev[iState].BaseInfo;

                    var result ;
                    result = this.hid.FindDevice(StateDevice.set[0].usagepage, StateDevice.set[0].usage,StateDevice.vid, StateDevice.pid);
                    env.log('ModelOV2FWUpdate', 'OpenDevice: ', result);
                    if (result > 0) {
                        if (StateDevice.vid_BT == StateDevice.vid && StateDevice.pid_BT ==  StateDevice.pid) {
                            this.OpenInBootloader = true; 
                        }
                        deviceresult = true;
                        ArrayDev[iState].BaseInfo.DeviceId = result;
                    }else{
                        ArrayDev[iState].BaseInfo.DeviceId = 0;
                    }
                }
            }
            callback(deviceresult);
        }catch(err){
            console.log("FWUpdate Error","OpenDevice",`ex:${(err as Error).message}`);
        }
    }
    
    PluginDevice(dev){
    }

    ///////////////////////Update Progress/////////////////////////////
    StartFWUpdate(ArrayDev) {//Start UpdataProcess_Hid
        //this.DeviceStep = 0

        const FWUpdatetoDevice = (iDevice) => {
            this.DeviceStep = iDevice;
            if (iDevice < ArrayDev.length){
                var dev = ArrayDev[iDevice];//Assign dev From Device Array
                if (dev.BaseInfo.DeviceId == 0) {
                    this.StartFakeProcess(dev,(res) => {
                        FWUpdatetoDevice(iDevice+1);
                    });
                } else {
                    dev.m_iSnCount = 0;
                    dev.m_iSnCount2 = 0;
                    dev.m_iTarget = 0;
                    this.StartDeviceFWUpdate(dev,(res) => {
                        FWUpdatetoDevice(iDevice+1);
                    });
                }
            } else {    
                this.SendProgressMessage('PASS');
            }

        };
        FWUpdatetoDevice(0);
        
    }
    StartFakeProcess(dev,callback) {//Start UpdataProcess_Hid

        const FakeProcess = (iProcess) => {
            if (iProcess < 100){
                setTimeout(() => {
                    this.SendProgressMessage(iProcess);
                    FakeProcess(iProcess+5);
                },100);
            } else {    
                callback(true);
            }

        }
        FakeProcess(0);
    }
    
    StartDeviceFWUpdate(dev,callback) {//Start UpdataProcess_Hid

        this.CMD_FW_WRITE_27(dev,0,(res1) => {
            this.SendProgressMessage(2);
            this.CMD_FW_INIT_NEW_CHECK_42(dev,0,(res2) => {
                if (res2 == false) {
                    this.SendProgressMessage('FAIL');
                    callback(false);
                }
                var BufData = Buffer.alloc(0x40);
                for (let index = 1; index < BufData.length - 6; index++) {
                    BufData[index] = res2[index-1 +6];
                }
                //-----------COtaParam-----------
                var OtaParamData: any = {};
                OtaParamData.OtaNewFlow = (BufData[3] != 0x00) || (BufData[4] != 0x01);
                OtaParamData.crc = (BufData[8] << 8 | BufData[7]);
                OtaParamData.MaxObjectSize = (BufData[12] << 24 | BufData[11] << 16 | BufData[10] << 8 | BufData[9]);
                OtaParamData.MtuSize = ((BufData[14] << 8 | BufData[13]));
                OtaParamData.PrnThreshold = (BufData[16] << 8 | BufData[15]);
                OtaParamData.spec_check_result = BufData[17];

                dev.OtaParamData = OtaParamData;
		        //-----------COtaParam-----------
                this.SendProgressMessage(4);
                this.CMD_FW_GET_INFO_23(dev,0,(res3) => {
                    this.SendProgressMessage(6);
                    if (res3 == false) {
                        this.SendProgressMessage('FAIL');
                        callback(false);
                    }else{
                        //----------Get Version And Checksum-----------
		                //version
                        var wcVersion = Buffer.alloc(6);
                        for (let index = 0; index < wcVersion.length; index++) {
                            wcVersion[index] = res3[10+index-1];
                        }
                        var strVersion = this.byte2String(wcVersion);
		                //checksum
                        var Checksum = this.MAKEWORD(res3[15-1], res3[16-1]);
                        console.log("strVersion:"+strVersion,"checksum:"+ Checksum.toString(16))
                        dev.DeviceVersion = strVersion;
                        dev.DeviceChecksum = Checksum;
                        //-----Turn FirmwareData into vdBuffer-----
                        this.FirmwareDataintovdBuffer(dev,(res4) => {
                            if (res4 == false) {
                                this.SendProgressMessage('FAIL');
                                callback(false);
                            }else{
                                this.SendProgressMessage(7);
                                this.SendFwToDevice(dev,(res5) => {//Into UpdataProcess_Hid
                                    if (res5 == false) {
                                        callback(false);
                                    }else{
                                        callback(true);
                                    }
                                });
                            }
                        });
                        //-----Turn FirmwareData into vdBuffer-----
                    }

                });
            });

        });
    }
    SendFwToDevice(dev,callback){//UpdataProcess
        this.SendProgressMessage(8);
        dev.m_iSnCount = 1;
        
        this.CMD_FW_WRITE_27(dev,dev.FileSize,(res1) => {
            if (!res1)callback(false);

            this.SendProgressMessage(9);
            this.CMD_FW_INIT_NEW_CHECK_42(dev,0,(res2) => {
                if (!res1)callback(false);
                this.SendProgressMessage(10);
                this.CMD_FW_OBJECT_CREATE_25(dev,0,(res3) => {//indexCount:0
                    //////////////////////////////////////
	                var bufChecksum = 0;
	                var indexCount = 0;
                    const WriteFWData = (iWriteCount) => {
                        if (iWriteCount < dev.vdBuffer.length) {
                            indexCount += dev.vdBuffer[iWriteCount].Size;

                            //在每一個區塊的最後一筆前下一次41
                            this.CheckFirstCRCCHECK_41(dev,indexCount, bufChecksum,(res) => {
                                if (!res)callback(false);

                                bufChecksum += dev.vdBuffer[iWriteCount].Checksum;
                                bufChecksum &= 0xffff;//reduce into WORD Size
                                //
                                this.CMD_FW_CONTENT_40(dev, dev.vdBuffer[iWriteCount],(res) => {
                                    if (!res)callback(false);

                                    this.CheckLastCRCCHECK_41_45(dev,indexCount,bufChecksum,(res) => {
                                        if (!res)callback(false);

                                        //------------------------
                                        var  iProgress = iWriteCount * 80 / dev.vdBuffer.length;
                                        this.SendProgressMessage(10 + iProgress);
                                        //------------------------
                                        WriteFWData(iWriteCount+1);
                                    });
                                });

                            });

                            
                        } else {//Finished
                            //在下完最後一筆後41
                                this.CMD_FW_CRC_CHECK_41(dev, bufChecksum,(res) => {
                                    if (!res)callback(false);
                                    this.SendProgressMessage(92);

                                    this.CMD_FW_UPGRADE_18(dev, 0, (res) => {
                                        setTimeout(() => { 
                                            if (!res)callback(false);
                                            this.SendProgressMessage(95);
                                            //
                                            this.CMD_FW__RESET2(dev, 0,(res) => {
                                                setTimeout(() => { 
                                                
                                                //this.SendProgressMessage(100);
                                                    callback(true);//Update Finished
                                                },1000); 
                                            });
                                        },1000); 
                                    }); 

                                });

                        }

                    };
                    WriteFWData(0);

                });

            });
        });

    }
    CheckFirstCRCCHECK_41(dev,indexCount,bufChecksum,callback){
		//在每一個區塊的最後一筆前下一次41
		if (indexCount % dev.OtaParamData.MaxObjectSize == 0 && bufChecksum != 0) {
            this.CMD_FW_CRC_CHECK_41(dev, bufChecksum,(res) => {
                if (res == false) {
                    this.SendProgressMessage('FAIL');
                    callback(false);
                }else{
                    setTimeout(()=>{
                        callback(true);
                    },50)
                }
            });
        }else{
            callback(true);
        }
    }
    CheckLastCRCCHECK_41_45(dev,indexCount,bufChecksum,callback){

		if (indexCount % dev.OtaParamData.MaxObjectSize == 0) {
			//在每一個區塊的最後一筆後下一次41
            this.CMD_FW_CRC_CHECK_41(dev, bufChecksum,(res) => {
                if (res == false)
                    callback(false);
                
                    setTimeout(()=>{
                        this.CMD_FW_OBJECT_CREATE_25(dev, indexCount,(res) => {
                            if (res == false)callback(false);
                            
                            callback(true);
                        });
                    },50)
            });
        }else{
            callback(true);
        }

    }
    ///////////////////////API///////////////////////////////////
    FirmwareDataintovdBuffer(dev,callback){

        var FilePath = dev.FilePath;
        this.ReadBinToData(FilePath,(FirmwareData: any) => {
            if (FirmwareData != undefined) {//Read BinFile Success
                var iFileSize = FirmwareData.length;
                dev.FileSize = iFileSize;
		        //array accumulate into checksum
                const initialValue = 0;
                var bChecksum = FirmwareData.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
                bChecksum &= 0xffff;
                dev.FileChecksum = JSON.parse(JSON.stringify(bChecksum));

                //Initialize vdBuffer by OtaParamData
		        var iMaxObjectSize = dev.OtaParamData.MaxObjectSize;
                var vdBuffer: any[] = [];
                var iSizeCount = 0;
                var iIndex = 0;
                
		        var iBuffSize = dev.OtaParamData.MtuSize;
                while (iIndex < iFileSize) {
                    if (vdBuffer.length == 1286) {
                        if (vdBuffer.length == 1286) {
                        }
                        
                    }

                    var bBuff: any[] = [];
                    for (let i = 0; i < iBuffSize; i++) {
                        if (iIndex + i >= iFileSize) {
                            bBuff.push(0);
                        }else{
                            bBuff.push(FirmwareData[iIndex + i]);
                        }
                        
                    }
                    bChecksum = bBuff.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
                    bChecksum &= 0xffff;

                    var ObjvdBuffer = {Buffer:bBuff,Checksum:bChecksum,Size:iBuffSize};
                    vdBuffer.push(ObjvdBuffer);
                    iIndex += iBuffSize;
                    
			        //每區以iMaxObjectSize長度為上限。
			        iSizeCount += iBuffSize;
			        if ((iMaxObjectSize - iSizeCount) >= dev.OtaParamData.MtuSize) {
			        	iBuffSize = dev.OtaParamData.MtuSize;
			        }
			        else if ((iMaxObjectSize - iSizeCount) <= 0) {
			        	iBuffSize = dev.OtaParamData.MtuSize;
			        	iSizeCount = 0;
			        }
			        else {
			        	iBuffSize = iMaxObjectSize - iSizeCount;
                    }
                    
                }
                //----------------------------------
                dev.vdBuffer = vdBuffer;
                callback(true);
            }else{//Read Bin Data Faild
                callback(false);
            }
        });
    }
    
    ReadBinToData(ObjFile , callback){
        try{
            //var dbPath1 = path.resolve(path.join('FWUpdate'));
            console.log(ObjFile);
            fs.open(ObjFile, 'r', (err, FileTemp) => {
                if (err) {
                    env.log("Error", "ReadHexToData", err);
                    callback(undefined);
                } else {
                    var buffer = Buffer.alloc(100000);
                    fs.read(FileTemp, buffer, 0, 100000, 0, (err, lsize) => {
                        console.log(buffer.toString('utf8', 0, lsize));
                        //---------------Strings To Data Array-----------------
                        var pData = Buffer.alloc(lsize);
                        for (var i = 0; i < lsize; i++) {
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
    isNumber(value) {
    	return !isNaN(parseInt(value, 10));
    }
    OnTimerSendFWUPDATE(ProcessSum) {
        try{
            if (ProcessSum != this.ProcessSum2) {
                this.ProcessSum2 = JSON.parse(JSON.stringify(ProcessSum));
                
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data: this.ProcessSum2}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2);
                clearInterval(this.m_TimerSendFWUPDATE);
                this.m_TimerSendFWUPDATE = undefined;
                
            }else{
                clearInterval(this.m_TimerSendFWUPDATE);
                this.m_TimerSendFWUPDATE = undefined;
            }
        } catch(e) {
            env.log('GmmkNumpadSeries','TimerEmitFrontend',`Error:${e}`);
        }
    }
    SendProgressMessage(Current) {
        
        env.log('ModelOV2FWUpdate','SendProgressMessage', Current);
        var ProcessSum = Current;
        if (this.isNumber(Current)){
            ProcessSum = parseInt( (100 / this.ArrayDev.length * this.DeviceStep) + (Current/this.ArrayDev.length) as any );
            //ProcessSum = 100;
            //------------Set timer to send frontend-----------------------
            if (this.m_TimerSendFWUPDATE == undefined) {
                this.m_TimerSendFWUPDATE = setInterval(() => this.OnTimerSendFWUPDATE(ProcessSum), 500);
            }
            //------------Set timer to send frontend-----------------------
        }else{
            setTimeout(() => { 
                var Obj2 = {
                    Func: EventTypes.SendFWUPDATE,
                    SN: this.SN,
                    Param: {Data:ProcessSum}
                };
                this.emit(EventTypes.ProtocolMessage, Obj2); 
            },200); 
        }
        //--------------Finish Testing--------------------
        if (Current == "PASS" || Current == "FAIL") {
            while (this.ArrayDev.length) {
                this.ArrayDev.pop();
            }
        }
        //--------------Finish Testing--------------------
    }
    StartDonglePairing() {
        setTimeout(()=>{
            var Obj2 = {
                Func: "DonglePairing",
                SN: this.SN,
                Param: true
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        },1000)
    }

    byte2String(array) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
          result += String.fromCharCode(parseInt(array[i]));
        }

        return result;
    }
    
}