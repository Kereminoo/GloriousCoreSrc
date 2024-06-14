import EventEmitter from "events";
import { env } from "../../others/env";
import { HID } from "../nodeDriver/HID";

export class ModelOV2USBDriver extends EventEmitter {
    static #instance?:ModelOV2USBDriver;

    DefSleep: any;
    CheckCount: any;


    LOWORD(l) { return l & 0xffff; }
    HIWORD(l) { return (l >> 16) & 0xffff; }
    LOBYTE(w) { return w & 0xff; }
    HIBYTE(w) { return (w >> 8) & 0xff; }
    MAKEWORD(a, b) {return(a & 0xff | (b & 0xff) << 8);}

    hid!: HID;

    constructor() {
        env.log('Device','Device class','begin');
        super();

        try{
            this.DefSleep = 1000;
            this.CheckCount = 1000;

        }catch(err){
            console.log("Device Error","Init",`ex:${(err as Error).message}`);
        }
    }

    static getInstance(hid,ObjDeviceInfo) {
        if (this.#instance) {
            env.log('Device', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('Device', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new ModelOV2USBDriver();

            return this.#instance;
        }
    }
    //--------------------------------------------
    
    CMD_FW_WRITE_27(dev,ObjDataLength, callback) {
        //callback(true);
        var datalen = ObjDataLength;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);

        //Calculate Checksum
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x27;
        buf[7] = iSn2; //SN
        buf[8] = 0x06;
        buf[9] = 0x27;
        buf[10] = this.LOBYTE(this.LOWORD(datalen));
        buf[11] = this.HIBYTE(this.LOWORD(datalen));
        buf[12] = this.LOBYTE(this.HIWORD(datalen));
        buf[13] = this.HIBYTE(this.HIWORD(datalen));

        //Get Data Checksum into byte[1]
        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);

        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);


        var ObjSetData =  {buffer:buf,iSleep:10,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:10,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });

    }
    CMD_FW_INIT_NEW_CHECK_42(dev,Obj, callback) {
        //callback(true);
        var datalen = 0x40;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);

        //Calculate Checksum
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x42;
        buf[7] = iSn2; //SN
        buf[8] = 0x02;
        buf[9] = 0x42;

        //Get Data Checksum into byte[1]
        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);

        var ObjSetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });
    }
    //
    CMD_FW_OBJECT_CREATE_25(dev,indexCount, callback) {
        //callback(true);
        var datalen = 0x40;
        //
        var iSn = dev.m_iSnCount;
        var iTarget = dev.m_iTarget;
        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);
        //Calculate Checksum
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x25;
        buf[7] = iSn; //SN
        buf[8] = 0x09;
        buf[9] = 0x25;
        buf[10] = this.LOBYTE(this.LOWORD(indexCount));
        buf[11] = this.HIBYTE(this.LOWORD(indexCount));
        buf[12] = this.LOBYTE(this.HIWORD(indexCount));
        buf[13] = this.HIBYTE(this.HIWORD(indexCount));

        buf[14] = this.LOBYTE(this.LOWORD(dev.OtaParamData.MaxObjectSize));
        buf[15] = this.HIBYTE(this.LOWORD(dev.OtaParamData.MaxObjectSize));
        buf[16] = this.LOBYTE(this.HIWORD(dev.OtaParamData.MaxObjectSize));
        buf[17] = this.HIBYTE(this.HIWORD(dev.OtaParamData.MaxObjectSize));
        
        //Get Data Checksum into byte[1]
        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);

        var ObjSetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });
    }
    //

    CMD_FW_UPGRADE_18(dev,Obj, callback) {
        //callback(true);
        var datalen = dev.FileSize;
        var checksum = dev.Checksum;
        if (dev.FileChecksum != undefined) {
            checksum = dev.FileChecksum;
        }

        var strVersion = dev.DeviceVersion;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);

        //Calculate Checksum
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x18;
        buf[7] = iSn2; //SN
        buf[8] = 0x0C;
        buf[9] = 0x18;
        buf[10] = this.LOBYTE(this.LOWORD(datalen));
        buf[11] = this.HIBYTE(this.LOWORD(datalen));
        buf[12] = this.LOBYTE(this.HIWORD(datalen));
        buf[13] = this.HIBYTE(this.HIWORD(datalen));

        buf[14] = this.LOBYTE(checksum);
        buf[15] = this.HIBYTE(checksum);
        //Convert Firmware String into byte array
        var arFWString = this.String2byte(strVersion);
        for (let index = 0; index < 5; index++) {
            buf[16+index] = arFWString[index];
        }

        //Get Data Checksum into byte[1]
        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);

        var ObjSetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });
    }
    //

    CMD_FW_CONTENT_40(dev, vdBuffer, callback) {
        //callback(true);
        var datalen = dev.FileSize;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);

        //Calculate Checksum
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x40;
        buf[7] = iSn2; //SN
        buf[8] = vdBuffer.Size;

        //vdBuffer array into byte array
        for (let index = 0; index < vdBuffer.Buffer.length; index++) {
            buf[9+index] = vdBuffer.Buffer[index];
        }

        //Get Data Checksum into byte[1]
        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);

        var ObjSetData =  {buffer:buf,iSleep:5,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
            dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
            callback(Databack); 
        });
    }

    //
    CMD_FW_GET_INFO_23(dev,Obj, callback) {
        //callback(true);
        var datalen = 0x40;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);

        buf[1] = 0; //checksun
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x23;
        buf[7] = iSn2; //SN
        buf[8] = 0x02;
        buf[9] = 0x23;

        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);


        var ObjSetData =  {buffer:buf,iSleep:10,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:10,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });

    }
    //
    
    CMD_FW_CRC_CHECK_41(dev,Checksum, callback) {
        var datalen = 0x40;
        //
        var iSn = dev.m_iSnCount;
        var iSn2 = dev.m_iSnCount2;
        var iTarget = dev.m_iTarget;

        if (datalen == undefined) datalen = 0;

        var buf = Buffer.alloc(0x41);
        
        if (iSn == 312) {
            buf[4] = iSn; //SN
        }

        buf[1] = 0; //checksun
        buf[2] = 0x65;
        buf[3] = 0x3a;;
        buf[4] = iSn; //SN
        buf[5] = iTarget; //target;

        buf[6] = 0x41;
        buf[7] = iSn2; //SN
        buf[8] = 0x03;
        buf[9] = 0x41;
        buf[10] = this.LOBYTE(Checksum);
        buf[11] = this.HIBYTE(Checksum);

        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);


        var ObjSetData =  {buffer:buf,iSleep:1,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
            var ObjGetData =  {buffer:buf,iSleep:1,com:0x65,sn:iSn,CheckCount:1000}
            this.GetDatafromDevice(dev,ObjGetData,(Databack) => {
                dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
                dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
                callback(Databack); 
            });
        });
    }

    //
    
    CMD_FW__RESET2(dev,Obj, callback) {
        var datalen = 0x40;
        //
        var iSn = dev.m_iSnCount;

        if (datalen == undefined) datalen = 0;
        var buf = Buffer.alloc(0x41);

        buf[1] = 0x08; //checksun
        buf[2] = 0xfa;
        buf[3] = 0x06;

        const initialValue = 0;
        const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        buf[0] = 0x03;
        buf[1] = this.LOBYTE(bChecksun);

        this.CheckCount = 1;
        var ObjSetData =  {buffer:buf,iSleep:50,com:0x65,sn:iSn}
        this.SetDataintoDevice(dev,ObjSetData,(Databack) => {
                this.CheckCount = 1000;
                callback(Databack); 
        });
    }
    //---------------------------------------
    
    GetDatafromDevice(dev, Obj, callback) {
        var CheckCount =  Obj.CheckCount;
        var comID =  Obj.com;
        var Data = Obj.buffer;
        
        const GetData = (iCount) => {
            if (iCount > 0){//CheckCount,Default:1000
                this.GetFeatureReport(dev, Data,1).then((rtnData: any) => {
                    var res: any = true;
                    res &= ((comID == rtnData[1-1]) && (dev.m_iSnCount == rtnData[4-1])) as any;
                    res &= (rtnData[2-1] == 0x00) as any;
                    //enum Cmd_rsp_status_t : BYTE {
                    //CMD_RSP_SUCCESS = 0x00,
                    //CMD_RSP_FAIL = 0x01,

                    if (!res && iCount > 0) {
                        GetData(iCount - 1);
                    } else {
                        callback(rtnData);
                    }
                });

            } else {//GetData Failed     
                callback(false);
            }

        }
        GetData(CheckCount);
    }
    
    /**
     * Set Data into Device
     * @param {*} dev 
     * @param {*} Obj 
     *      @param {*} iSleep 
     *      @param {*} buffer 
     * @param {*} callback 
     */
    SetDataintoDevice(dev,Obj,callback) {
        try {  
            if(Obj.iSleep == undefined) Obj.iSleep = this.DefSleep;  
            var CheckCount = this.CheckCount;

            const SetData = (iCount) => {
                if (iCount > 0){//CheckCount,Default:1000(
                    this.SetFeatureReport(dev, Obj.buffer,Obj.iSleep).then((res:any) => {
                        if(res > 0){
                            callback(true);
                        } else if(iCount == 0){
                            callback(false);
                        }else{
                            SetData(iCount - 1);
                        }
                    });

                } else {//SetData Failed     
                    callback(false);
                }
            };
            SetData(CheckCount);
            //---------

        } catch (err) {
            console.log("SetData_Fail");
            callback(false);
        }
    }
    //-----------------------------------------------------



    //-----------------------------------------------------
    //Send Firmware Data Into node Driver
    SetFeatureReport(dev, buf,iSleep) {
        return new Promise((resolve, reject) => {
            try{
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,buf[0], 65, buf);
                setTimeout(() => {
                    resolve(rtnData);
                },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    //
    GetFeatureReport(dev, buf,iSleep) {
        return new Promise((resolve, reject) => {
            try {
                // var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,buf[0], 64, buf);
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,buf[0], 64);
                setTimeout(() => {
                    resolve(rtnData);
                },iSleep);
            } catch(err) {
                env.log("DeviceApi Error","GetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    //
    
    String2byte(string) {
        let utf8Encode = new TextEncoder();
        var result = utf8Encode.encode(string);

        return result;
    }
}