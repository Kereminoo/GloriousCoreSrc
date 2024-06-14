// const env = require('../../../others/env');
// var Mouse = require('./Mouse');
// var EventTypes = require('../../../others/EventVariable').EventTypes;
// var SupportData = require('../../../others/SupportData');
// var AppObj = require("../../../dbapi/AppDB");
// var path = require('path');
// const { cpuUsage } = require('process');

import path from "path";
import { env } from "../../../others/env";
import { Mouse } from "./Mouse";
import { SupportData } from "../../../../../common/SupportData";
import { EventTypes } from "../../../../../common/EventVariable";

import { GloriousMOISDKLib } from "../../nodeDriver/lib";
import { GetValidURL } from '../../../../../common/utils';


export class ModelISeries extends Mouse
{
    static #instance: ModelISeries;

    GloriousMOISDK = GloriousMOISDKLib;

    m_bSetFWEffect: boolean;

    MDFMapping: any[];
    MouseMapping: any[];
    ButtonMapping: any[];


    constructor(hid) {
        env.log('ModelISeries','ModelISeries class','begin');
        super();
        this.m_bSetFWEffect = false;//SET DB
        this.hid = hid;
        // this.AppDB = AppObj.getInstance();

        this.MDFMapping = [
            {keyCode:0xA0, value:"Shift", MDFKey:0x01,    code:"ShiftLeft"},
            {keyCode:0xA2, value:"Ctrl", MDFKey:0x00,     code:"ControlLeft"},
            {keyCode:0xA4, value:"Alt", MDFKey:0x02,      code:"AltLeft"},
            {keyCode:0x5B, value:'Left Win', MDFKey:0x03, code:"MetaLeft"},
            {keyCode:0xA1, value:"RShift", MDFKey:0x05,    code:"ShiftRight"},
            {keyCode:0xA3, value:"RCtrl", MDFKey:0x04,     code:"ControlRight"},
            {keyCode:0xA5, value:"RAlt", MDFKey:0x06,      code:"AltRight"},
            {keyCode:0x5C, value:'Right Win', MDFKey:0x07,code:"MetaLeft"},
        ];
        this.MouseMapping = [
            {keyCode:'16', value:"Left Click",  hid:0x01, code:"0"},
            {keyCode:'17', value:"Scroll Click",hid:0x04, code:"1"},
            {keyCode:'18', value:"Right Click", hid:0x02, code:"2"},
            {keyCode:'91', value:'Back Key',    hid:0x08, code:"3"},
            {keyCode:'92', value:'Forward Key', hid:0x10, code:"4"},
        ];
        this.ButtonMapping = [
            {ButtonID:0x01 , value:'LeftClick'},//DLL BUTTON_1
            {ButtonID:0x03 , value:'ScorllClick'},
            {ButtonID:0x02 , value:'RightClick'},
            {ButtonID:0x05 , value:'Forward'},
            {ButtonID:0x06 , value:'Backward'},
            {ButtonID:0x07 , value:'DPI UP'},
            {ButtonID:0x00 , value:'Scroll Up'},
            {ButtonID:0x00 , value:'Scroll Down'},
            {ButtonID:0x09 , value:'Profile Cycle'},//(Big Side Button)
            {ButtonID:0x04 , value:'Layer Cycle'},//(Former Side Button)
            {ButtonID:0x08 , value:'DPI Down'},
            // Shift Key Button
            {ButtonID:0x0a , value:'LeftClick'},//DLL BUTTON_1
            {ButtonID:0x0c , value:'ScorllClick'},
            {ButtonID:0x0b , value:'RightClick'},
            {ButtonID:0x0e , value:'Forward'},
            {ButtonID:0x0f , value:'Backward'},
            {ButtonID:0x10 , value:'DPI UP'},
            {ButtonID:0x00 , value:'Scroll Up'},
            {ButtonID:0x00 , value:'Scroll Down'},
            {ButtonID:0x12 , value:'Profile Cycle'},//(Big Side Button)
            {ButtonID:0x0d , value:'Layer Cycle'},//(Former Side Button)
            {ButtonID:0x11 , value:'DPI Down'},
        ];
        if(env.isWindows)
        {
            //----------------Defined DLL Path-------------------
            // var DLLPath;
            // var isAsar = __dirname.match('app.asar');
            // if(isAsar == null){
            //     DLLPath = path.resolve(__dirname, '../../../../DllSDK/model_i_dll.dll');
            // }
            // else{
            //         DLLPath = path.resolve(__dirname, '../../../../../../DllSDK/model_i_dll.dll');
            // }
            // var fs = require('fs');
            // var bDLLExist = fs.existsSync(DLLPath);
            // env.log('ModelISeries','MOISDK-DllPath:'+ JSON.stringify(DLLPath), 'Exist:'+JSON.stringify(bDLLExist));


            //----------------Defined DLL Path-------------------
            var DeviceFlags = this.GloriousMOISDK.Initialization();
            env.log('ModelISeries','GloriousMOISDK-Initialization:',JSON.stringify(DeviceFlags));
        }
    }
    static getInstance(hid)
    {
        if (this.#instance) {
            env.log('ModelISeries', 'getInstance', `Get exist ModelISeries() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('ModelISeries', 'getInstance', `New ModelISeries() INSTANCE`);
            this.#instance = new ModelISeries(hid);

            return this.#instance;
        }
    }
    InitialDevice(dev,Obj,callback) {
        env.log('ModelISeries','initDevice','Begin')
        dev.bwaitForPair = false;
        dev.m_bSetHWDevice = false;
        dev.DLLDevice = false;

        if(env.BuiltType == 0) {
            var DeviceFlags;
            DeviceFlags = this.GloriousMOISDK.CaptureCBData();
            env.log('ModelISeries','initDevice-CaptureCBData','Done,then SetProfileDataFromDB')
            //dev.DLLDevice = DeviceFlags;
            //DeviceFlags = this.GloriousMOISDK.Updatelighting();
            //DeviceFlags = this.GloriousMOISDK.ChangeCurProfileID(2);
            dev.BaseInfo.version_Wired = "00.00";
            dev.BaseInfo.version_Wireless = "00.00";
            // this.ReadFWVersion(dev,0,(ObjFWVersion) => {
                this.SetProfileDataFromDB(dev,0,() => {
                    callback(0);
                });
            // });
        }else{
            dev.BaseInfo.version_Wired = "00.03.01.00";
            dev.BaseInfo.version_Wireless = "00.03.01.00";
            callback(0);
        }
    }
    HIDEP2Data(dev,ObjData) {
        if (ObjData[0]== 0x03 && ObjData[1]== 0x01 ){//EP2 Switch Profile
            dev.deviceData.profileindex = ObjData[2];
            var iProfile = ObjData[2];
            env.log('ModelISeries','HIDEP2Data-SwitchProfile',iProfile)
            var Obj2 = {
                Func: EventTypes.SwitchUIProfile,
                SN: dev.BaseInfo.SN,
                Param: {
                    SN: dev.BaseInfo.SN,
                    Profile: iProfile,
                    ModelType: dev.BaseInfo.ModelType//Mouse:1,Keyboard:2,Dock:4
                }
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        else if (ObjData[0]== 0x03 && ObjData[1]== 0x23 ){ //EP2 Launch Program
            var UIButtonID = this.ButtonMapping.findIndex((x) => x.ButtonID == ObjData[4])
            this.LaunchProgram(dev,UIButtonID);
        }
        else if (ObjData[0]== 0x03 && ObjData[1]== 0x24 ){ //EP2 Launch Program
            var UIButtonID = this.ButtonMapping.findIndex((x) => x.ButtonID == ObjData[4])
            this.LaunchProgram(dev,UIButtonID);
        }
    }
    LaunchProgram(dev,iKey) {
        var iProfile = dev.deviceData.profileindex -1;
        var KeyAssignData;
        if (iKey >= 11) {
            KeyAssignData = dev.deviceData.profile[iProfile].keybindingLayerShift[iKey - 11];//Button
        }else{
            KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];//Button
        }

        switch (KeyAssignData.group) {
            case 2://Windows Shortcut/Launch
                if (KeyAssignData.function == 1) {//Launch Program
                    var csProgram = KeyAssignData.param;
                    if (csProgram != "") {
                        this.RunApplication(csProgram);
                    }
                }
                else if (KeyAssignData.function == 2) {//Launch WebSite
                    var csProgram = KeyAssignData.param;
                    if (csProgram != null && csProgram.trim() != '') {
                        this.RunWebSite(GetValidURL(csProgram));
                    }
                }
                else if (KeyAssignData.function == 3) {//Windows Shortcut
                }
            break;
            case 8://Keyboard Profile/Layer Switch
                if (KeyAssignData.function == 1) {//Profile Cycle Up
                    var Obj2 = {Func: "SwitchKeyboardProfile",SN:dev.BaseInfo.SN,Updown:2};
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                } else if (KeyAssignData.function == 2) {//Profile Cycle Down
                    var Obj2 = {Func: "SwitchKeyboardProfile",SN:dev.BaseInfo.SN,Updown:1};
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                } else if (KeyAssignData.function == 3) {//Layer Cycle /Up
                    var Obj2 = {Func: "SwitchKeyboardLayer",SN:dev.BaseInfo.SN,Updown:2};
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                } else if (KeyAssignData.function == 4) {//Layer Cycle Down
                    var Obj2 = {Func: "SwitchKeyboardLayer",SN:dev.BaseInfo.SN,Updown:1};
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                }
            break;
            default:
                break;
        }
    }
    GetWirelessMode(dev,Obj,callback){
        var bWireless = false;
        for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
            var StateSN = "0x"+ this.NumTo16Decimal(dev.BaseInfo.vid[iState]) + "0x"+ this.NumTo16Decimal(dev.BaseInfo.pid[iState]);
            if (dev.BaseInfo.SN == StateSN && iState>0) {
                bWireless = true;
                break;
            }
        }
        callback(bWireless);
    }
    ReadFWVersion(dev,Obj,callback){
        try{
            var rtnData = this.GloriousMOISDK.GetFWVersion();

            // var verHigh = parseInt(rtnData / 100);//Version byte high
            // var verRev = rtnData % 100;//Version byte Reversed
            // var strVersion = verHigh+'.'+verRev;
            // dev.BaseInfo.version_Wired = strVersion;

            var verRev = rtnData / 100;
            var strVersion = verRev.toString();
            dev.BaseInfo.version_Wired = strVersion;
            dev.BaseInfo.version_Wireless = '0.00';
            callback(strVersion);

        } catch(e) {
            env.log('ModelISeries','ReadFWVersion',`Error:${e}`);
            callback(false);
        }
    }
    ChangeProfileID(dev,Obj, callback) {

        // dev.deviceData.profileindex = Obj;
        env.log('ModelISeries','ChangeProfileID','Begin')
        try{
            if(env.BuiltType == 1) {
                callback();
                return;
            }
            dev.deviceData.profileindex = Obj;

            var DeviceFlags = this.GloriousMOISDK.ChangeCurProfileID(dev.deviceData.profileindex);
            this.setProfileToDevice(dev,() => {
                callback("ChangeProfileID Done");
            })

        } catch(e) {
            env.log('ModelISeries','ChangeProfileID',`Error:${e}`);
        }
    }
    SetLEDEffect(dev, Obj, callback) {
        env.log('ModelISeries','SetLEDEffect','Begin')
        try{
            var iEffect;
            var iModeaux = 0;
            var Colors = Obj.LightingData.Color;
            var iSpeed = Obj.LightingData.RateValue;
            // if (Obj.LightingData.Effect == 6 || Obj.LightingData.Effect == 7)//Rave/Wave
            // {
            //     iSpeed = (105-Obj.LightingData.RateValue)*2;
            // }

            var iBrightness = Obj.LightingData.WiredBrightnessValue;
            var iProfile = Obj.iProfile;

	        //LED_OFF = 0x00,
	        //GLORIOUS_MODE = 0x01,
	        //SEAMLESS_BREATHING = 0x02,
	        //BREATHING_RGB = 0x04,
	        //BREATHING_SINGLECOLOR = 0x05,
	        //SINGLE_COLOR = 0x06,
	        //TAIL_MODE = 0x07,
	        //RAVE_MODE = 0x13,
	        //WAVE_MODE = 0x09,
	        //CUSTOM_COLOR = 0x0F,          // 13 individual colors
            var arrEffectName = [1,2,4,6,5,7,0x13,9,0];
            iEffect = arrEffectName[Obj.LightingData.Effect];
            if (iEffect == 0x04 || iEffect == 0x13) {//BREATHING_RGB,RAVE_MODE
                for (var index = 0; index < Colors.length; index++) {
                    if (Colors[index].flag == true) {
                        iModeaux++;
                    }
                }
            }

            var DataColors = Buffer.alloc(40);//1+13*3
            DataColors[0] = Colors.length*3;//R
            for (var index = 0; index < Colors.length; index++) {
                if (Colors[index].flag == false) {
                    DataColors[1+index*3+0] = 0;//R
                    DataColors[1+index*3+1] = 0;//G
                    DataColors[1+index*3+2] = 0;//B
                }
                else if (Colors[index].flag == true && Colors[index].R == 0 && Colors[index].G == 0 && Colors[index].B == 0 ) {
                    DataColors[1+index*3+0] = 1;//R
                    DataColors[1+index*3+1] = 0;//G
                    DataColors[1+index*3+2] = 0;//B
                }
                else {
                    DataColors[1+index*3+0] = Colors[index].R;//R
                    DataColors[1+index*3+1] = Colors[index].G;//G
                    DataColors[1+index*3+2] = Colors[index].B;//B
                }
            }
            //-------------GloriousMOISDK DLL---------------------
	        //[1] UIEffectId
	        //[2] UIbrightness
	        //[3] UIspeed
	        //[4] UIsleeptime
	        //[5] UImodeaux
	        //[6] Colorarray

            var DeviceFlags = this.GloriousMOISDK.SetLEDEffect(iProfile+1,iEffect,iBrightness,iSpeed,0,iModeaux,DataColors);
            callback("SetLEDEffect Done");

        } catch(e) {
            env.log('ModelISeries','SetLEDEffect',`Error:${e}`);
        }
    }
    SetSleepTimetoDevice(dev, Obj, callback) {
        try{
            var Data = Buffer.alloc(65);
            Data[0] = 0x00;
            Data[1] = 0x00;
            Data[2] = 0x00;
            Data[3] = 0x02;//Mouse
            Data[4] = 0x02;
            Data[5] = 0x00;
            Data[6] = 0x07;
            if(Obj.sleep)
            {
                var iSleeptime = Obj.sleeptime * 60;
                Data[7] = (iSleeptime / 0xFF);
                Data[8] = (iSleeptime & 0xFF);
            }
            else
            {
                Data[7] = 0xff;
                Data[8] = 0xff;
            }

            this.SetFeatureReport(dev, Data,30).then(function ()
            {
                callback("SetCalibration2Device Done");
            });
        } catch(e) {
            env.log('ModelISeries','SetCalibration2Device',`Error:${e}`);
        }
    }
    SetImportProfileData(dev,Obj,callback) {
        if(env.BuiltType == 1) {
            callback();
            return;
        }
        this.nedbObj.getMacro().then((doc) => {
            var iProfile = dev.deviceData.profileindex-1;

            var ProfileData = dev.deviceData.profile[iProfile];
            var KeyAssignData = ProfileData.keybinding;
            var KeyAssignDataShift = ProfileData.keybindingLayerShift;

            var LightingData = ProfileData.lighting;
            var PerformanceData = ProfileData.performance;
            var MacroData = doc;
            var ObjKeyAssign = {
                iProfile :iProfile,
                KeyAssignData:KeyAssignData,
                KeyAssignDataShift:KeyAssignDataShift,
                MacroData:MacroData
            }
            var ObjLighting = {
                iProfile :iProfile,
                LightingData:LightingData
            }
            var ObjPerformance = {
                iProfile :iProfile,
                PerformanceData:PerformanceData
            }
            this.GloriousMOISDK.SetLEDOnOff(0);
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                this.SetLEDEffect(dev, ObjLighting, (param2) => {
                    this.SetPerformance(dev, ObjPerformance, (param3) => {
                        this.GloriousMOISDK.SetLEDOnOff(1);
                        callback("SetProfileDataFromDB Done");
                    });
                });
            });
        });
    }
    SetProfileDataFromDB(dev,Obj,callback) {
        if(env.BuiltType == 1) {
            callback();
            return;
        }
        this.nedbObj.getMacro().then((doc) => {

            env.log('ModelISeries','SetProfileDataFromDB','SetLEDOnOff Begin');
            this.GloriousMOISDK.SetLEDOnOff(0);
            env.log('ModelISeries','SetProfileDataFromDB','SetLEDOnOff Done');
            var MacroData = doc;
            const SetProfileData = (iProfile) => {
                var ProfileData = dev.deviceData.profile[iProfile];
                if (iProfile < 3 && ProfileData!= undefined) {
                    var KeyAssignData = ProfileData.keybinding;
                    var KeyAssignDataShift = ProfileData.keybindingLayerShift;
                    var LightingData = ProfileData.lighting;
                    var PerformanceData = ProfileData.performance;

                    var ObjKeyAssign = {
                        iProfile :iProfile,
                        KeyAssignData:KeyAssignData,
                        KeyAssignDataShift:KeyAssignDataShift,
                        MacroData:MacroData
                    }
                    var ObjLighting = {
                        iProfile :iProfile,
                        LightingData:LightingData
                    }
                    var ObjPerformance = {
                        iProfile :iProfile,
                        PerformanceData:PerformanceData
                    }
                    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                        this.SetLEDEffect(dev, ObjLighting, (param3) => {
                            this.SetPerformance(dev, ObjPerformance, (param4) => {
                                SetProfileData(iProfile+1);
                            });
                        });
                    });
                } else{
                    this.ChangeProfileID(dev,dev.deviceData.profileindex, (param) => {
                        setTimeout(() => {
                            this.GloriousMOISDK.SetLEDOnOff(1);
                            this.setProfileToDevice(dev, (paramDB) => {
                                callback("SetProfileDataFromDB Done");
                            });
                        },50);
                    });
                }

            };
            SetProfileData(0);
        });
    }
    SetKeyMatrix(dev, Obj, callback) {
        env.log('ModelISeries','SetKeyMatrix','Begin')
        dev.deviceData.profile = Obj.profileData;//Assign profileData From Obj
        var iProfile = dev.deviceData.profileindex -1;//Assign profileindex From deviceData
        var switchUIflag = Obj.switchUIflag;

        if(env.BuiltType == 1) {
            this.setProfileToDevice(dev, (paramDB) => {//Save DeviceData into Database
                callback("SetKeyMatrix Done");
            });
            return;
        }
        try{
            dev.m_bSetHWDevice = true;
            switch (true) {
                case switchUIflag.keybindingflag://Set Device keybinding(Key Assignment)
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var KeyAssignData = Obj.profileData[iProfile].keybinding;
                        var KeyAssignDataShift = Obj.profileData[iProfile].keybindingLayerShift;
                        var ObjKeyAssign = {
                            iProfile :iProfile,
                            KeyAssignData:KeyAssignData,
                            KeyAssignDataShift:KeyAssignDataShift,
                            MacroData:MacroData
                        }
                        //this.GloriousMOISDK.SetLEDOnOff(0);
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            //this.GloriousMOISDK.SetLEDOnOff(1);
                            this.setProfileToDevice(dev, (paramDB) => {//Save DeviceData into Database
                                dev.m_bSetHWDevice = false;
                                callback("SetKeyMatrix Done");
                            });
                        });
                    });
                    break;
                case switchUIflag.lightingflag://Set Device Lighting
                    var LightingData = Obj.profileData[iProfile].lighting;
                    var ObjLighting = {
                        iProfile :iProfile,
                        LightingData:LightingData
                    }
                    //this.GloriousMOISDK.SetLEDOnOff(0);
                    this.SetLEDEffect(dev, ObjLighting, (param2) => {
                        //this.GloriousMOISDK.SetLEDOnOff(1);
                        this.setProfileToDevice(dev, (paramDB) => {//Save DeviceData into Database
                            dev.m_bSetHWDevice = false;
                            callback("SetKeyMatrix Done");
                        });
                    });
                    break;
                case switchUIflag.performanceflag://Set Device Performance
                    var PerformanceData = Obj.profileData[iProfile].performance;
                    var ObjPerformance = {
                        iProfile :iProfile,
                        PerformanceData:PerformanceData
                    }
                    //this.GloriousMOISDK.SetLEDOnOff(0);
                    this.SetPerformance(dev, ObjPerformance, (param1) => {
                        //this.GloriousMOISDK.SetLEDOnOff(1);
                        //-------------dpiSelectIndex---------------
                        var ObjActiveDPI = {profile:iProfile,activeDPI:Obj.profileData[iProfile].performance.dpiSelectIndex};
                        if (ObjPerformance.PerformanceData.dpiSelectIndex == undefined) {
                            ObjActiveDPI.activeDPI = 0;
                        }
                        //-------------dpiSelectIndex---------------
                        this.setProfileToDevice(dev, (paramDB) => {//Save DeviceData into Database
                            dev.m_bSetHWDevice = false;
                            callback("SetKeyMatrix Done");
                        });
                    });
                    break;

            }


        } catch(e) {
            env.log('ModelISeries','SetKeyMatrix',`Error:${e}`);
        }
    }
    SetPerformance(dev, ObjPerformance, callback){
        //------------Total DPI levels-------------
        var DpiStage = ObjPerformance.PerformanceData.DpiStage;
        var DataDPIStages = Buffer.alloc(40);
        DataDPIStages[0] = DpiStage.length * 4;//DPI Stages Number
        for (var i = 0; i < DpiStage.length; i++){ //DPI resolution
            DataDPIStages[1+i*4+0] = DpiStage[i].value >> 8;    //DPI Stage X High Byte
            DataDPIStages[1+i*4+1] = DpiStage[i].value & 0xFF;    //DPI Stage X High Byte
            DataDPIStages[1+i*4+2] = DpiStage[i].value >> 8;       //DPI Stage Y High Byte
            DataDPIStages[1+i*4+3] = DpiStage[i].value & 0xFF;       //DPI Stage Y High Byte
        }
        //------------Total DPI levels-------------
        //-------------dpiSelectIndex-DPICurStage---------------
        var DPICurStage = 0;
        if (ObjPerformance.PerformanceData.dpiSelectIndex != undefined) {
            DPICurStage = ObjPerformance.PerformanceData.dpiSelectIndex + 1;//UI-dpiSelectIndex Value:0~5 DLL-DPICurStage Value:1~6
        }
        //-------------dpiSelectIndex-DPICurStage---------------
        //------------------DPI stage Color---------------------
        var DataDPIColor = Buffer.alloc(30);
        DataDPIColor[0] = DpiStage.length * 3;//DPI Stages Number
        for (var i = 0; i < DpiStage.length; i++){ //DPI resolution
            var DPIColor = this.hexToRgb(DpiStage[i].color)!;
            DataDPIColor[1+i*3+0] = DPIColor.color.R;//DPI Color R
            DataDPIColor[1+i*3+1] = DPIColor.color.G;//DPI Color G
            DataDPIColor[1+i*3+2] = DPIColor.color.B;//DPI Color B
        }
        //-------------------DPI stage Color--------------------
        //--------------Calibration setting (Lod)----------------
        var LODValue = ObjPerformance.PerformanceData.LodValue-1;
        //-------------Calibration setting (Lod)---------------
        //-------------Polling Rate---------------
        var arrRate = [125,250,500,1000];
        // var arrRateValue = [8,4,2,1];
        var PollingRate = 1000;
        var isPollingRate = arrRate.indexOf(ObjPerformance.PerformanceData.pollingrate);
        if (isPollingRate!= -1) {
            PollingRate = ObjPerformance.PerformanceData.pollingrate;
        }
        //-------------Polling Rate---------------
        //-------------Debounce time---------------
        var Responsetime = ObjPerformance.PerformanceData.DebounceValue;
        //-------------DPINumber---------------
        var DPINumber = DpiStage.length;
        var iProfile = ObjPerformance.iProfile+1;
        var DeviceFlags = this.GloriousMOISDK.SetPerformance(iProfile,PollingRate,Responsetime,LODValue,DPINumber,DPICurStage,DataDPIStages,DataDPIColor);

        if (!DeviceFlags) {
            env.log('ModelISeries','SetPerformance','GloriousMOISDK Error');
        }
        callback("SetPerformance Done");
    }
    MacroToData(MacroData,Repeat){
        var BufferKey: any[] = [];//MacroDataBuffer to Device
        var DataEvent: any[] = [];//DataEvent
        //------------Turns Hash Keys into Event Array-------------
        var Macrokeys=Object.keys(MacroData.content);
        for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
            var Hashkeys = Macrokeys[icontent];
            for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
                var MacroEvent ={keydown:true,key:Hashkeys,times:MacroData.content[Hashkeys].data[iData].startTime};
                DataEvent.push(MacroEvent);
                MacroEvent ={keydown:false,key:Hashkeys,times:MacroData.content[Hashkeys].data[iData].endTime};
                DataEvent.push(MacroEvent);
            }
        }
        //------------Sort Event Array By times-------------
        DataEvent = DataEvent.sort((a, b) => {
            return a.times >= b.times ? 1 : -1;
        });
        //------------Turns Event Array into BufferKey-------------
        //UI Repeat--0:No Replay,1:Toggle,2:Repeat while Holding
        //DLL Repeat--0:No Replay,1:Repeat while Holding,2:Toggle
        var DLLRepeat;
        if (Repeat == 1)
            DLLRepeat = 2;
        else if (Repeat == 2)
            DLLRepeat = 1;
        else
            DLLRepeat = 0;

        //Check Max MacroData Value,Max is 72 Actions
        if (DataEvent.length > 72) {
            DataEvent.length = 72;
        }
        //Push Macro-ID,Event Count,DLL Repeat Into Macro Array
        BufferKey.push(MacroData.value);//Byte[0]:Macro-ID
        BufferKey.push(DataEvent.length);//Byte[1]:Macro-Event Number
        BufferKey.push(DLLRepeat);//Byte[2]:Macro-DLLRepeat(loop_count)

        for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
            var KeyCode = 0x04;//A
            var bModifyKey = false;
            var bMouseButton = false;
            //Assign Keyboard KeyCode to KeyCode
            for(var i=0; i<SupportData.AllFunctionMapping.length; i++){
                if(DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code){
                    //KeyCode = SupportData.AllFunctionMapping[i].hid;
                    KeyCode = parseInt(SupportData.AllFunctionMapping[i].keyCode);
                    break;
                }
            }
            //Assign Mouse KeyCode to KeyCode
            for(var i=0; i<this.MouseMapping.length; i++){
                if(DataEvent[iEvent].key == this.MouseMapping[i].code){
                    var Mousehid = this.MouseMapping[i].hid;
                    //KeyCode = DataEvent[iEvent].keydown ? Mousehid : 0;
                    KeyCode = Mousehid;
                    bMouseButton = true;
                    break;
                }
            }
            //Assign MDF KeyCode to KeyCode
            for(var i=0; i<this.MDFMapping.length; i++){
                if(DataEvent[iEvent].key == this.MDFMapping[i].code){
                    KeyCode = this.MDFMapping[i].keyCode;
                    //bModifyKey = true;
                    break;
                }
            }
            var Event_type;
            //Assign Delay to Event
            var iDelay = 20;
            if (iEvent < DataEvent.length-1) {
                iDelay = DataEvent[iEvent+1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent+1].times - DataEvent[iEvent].times : 20;
            }
            //-----------------------------------------
            //Assign Event_type
            if (bMouseButton)
                Event_type = 0x10;
            else
                Event_type = 0x12;
            //Assign Make(keydown/keyup)
            var Make = DataEvent[iEvent].keydown ? 0 : 1;

            BufferKey.push(Event_type);
            BufferKey.push(KeyCode);
            BufferKey.push(Make);//Make
            BufferKey.push(parseInt((iDelay / 0xFF) as any));
            BufferKey.push(parseInt((iDelay & 0xFF) as any));
        }
        return BufferKey;
    }
    SetKeyFunction(dev, ObjKeyAssign, callback){
        //------------KeyAssignment-------------
        var iProfile = ObjKeyAssign.iProfile;

        var iMacroUSECount = 0;
        //------------Turn UI Data into node-DLL Data-----------------
        var ObjarrButtonData: any[] = [];
        var ObjarrDLLButtonData: any[] = [];
        //-------------------------------------------------

        var AllKeyAssignData: any[] = [];
        for (let iButton = 0; iButton < ObjKeyAssign.KeyAssignData.length; iButton++) {
            AllKeyAssignData.push(ObjKeyAssign.KeyAssignData[iButton]);
        }
        if (ObjKeyAssign.KeyAssignDataShift != undefined) {
            for (let iButton = 0; iButton < ObjKeyAssign.KeyAssignDataShift.length; iButton++) {
                AllKeyAssignData.push(ObjKeyAssign.KeyAssignDataShift[iButton]);
            }
        }
        //--------------------------------------------
        //The ID of the normal key is 1~9, and the ID of the corresponding ShiftKey is also 1~9
        var Buttonlength = ObjKeyAssign.KeyAssignData.length;

        for (let iButton = 0; iButton < AllKeyAssignData.length; iButton++) {
            if (iButton == 6 || iButton == 7 || iButton == 11 + 6 || iButton == 11 + 7)
                continue;
            var KeyAssignData = AllKeyAssignData[iButton];//Button
            var ObjButtonData:
            {
                DLLfunction,
                DLLbinding,
                DLLbinding_aux,
                DLLButtonID?,
                DLLDataMacro?
            } = this.KeyAssignToData(KeyAssignData);
            //------------ConvertMacroData-----------------
            //DataMacro into NodeDriver Byte Count:3 + 74*5 = 373
            //var DLLDataMacro = Buffer.alloc(373);
            var DLLDataMacro: any[] = [];
            if (KeyAssignData.group == 1) {//Macro Function
                var MacroID = KeyAssignData.function;
                for (var iMacro = 0; iMacro < ObjKeyAssign.MacroData.length; iMacro++) {

                    if (iMacro + 1 == ObjKeyAssign.MacroData.length && MacroID != ObjKeyAssign.MacroData[iMacro].value){//Data of Macro and KeyBinding do not match
                        MacroID = ObjKeyAssign.MacroData[iMacro].value;
                    }

                    if (MacroID == ObjKeyAssign.MacroData[iMacro].value){
                        iMacroUSECount++;
                        var MacroData = ObjKeyAssign.MacroData[iMacro];//Button
                        var DLLDataMacro1 = this.MacroToData(MacroData,KeyAssignData.param);
                        //param--0:No Replay,1:Toggle,2:Repeat while Holding
                        //Byte[0]:Macro ID
                        //Byte[1]:Event Count(eevent number)
                        //Byte[2]:loop_count
                        //Byte[3]~Byte[3+72*5]-Events
                                                //---Event_type
                                                //---action(KeyCode)
                                                //---KeyDown(Make)
                                                //---Delay-High Byte
                                                //---Delay-Low Byte
                        var i = -1;
                        while (++i < DLLDataMacro1.length) {//i is +1 before comparing whether it meets the conditions
                            //DLLDataMacro[i] = DLLDataMacro1[i];
                            DLLDataMacro.push(DLLDataMacro1[i]);
                        }
                        break;
                    }
                }
            }
            //-------------------------------------
            ObjButtonData.DLLButtonID = this.ButtonMapping[iButton ].ButtonID;
            //ObjButtonData.DLLButtonID = this.ButtonMapping[iButton % Buttonlength].ButtonID;
            ObjButtonData.DLLDataMacro = DLLDataMacro;
            ObjarrButtonData.push(ObjButtonData);
        }//SetAssignKey Loop Ended
        //Swapping ButtonData queue For Dll(include Shift Key)
        for (let iButton = 0; iButton < ObjarrButtonData.length ; iButton++) {
            var ButtonDataIndex = ObjarrButtonData.findIndex((x) => x.DLLButtonID == (iButton  + 1) );
            ObjarrDLLButtonData.push(ObjarrButtonData[ButtonDataIndex]);
        }
        // //Shift Key
        // if (ObjarrButtonData.length>9) {
        //     for (let iButton = 9; iButton < ObjarrButtonData.length ; iButton++) {
        //         var ButtonDataIndex = ObjarrButtonData.findIndex((x) => x.DLLButtonID == ((iButton % 9) + 1) );
        //         ObjarrDLLButtonData.push(ObjarrButtonData[9 + ButtonDataIndex]);
        //     }

        // }
        var iSleep = 120 + iMacroUSECount * 160;
        //Swapping ALL ButtonData into Dll
        this.SetAllButtonIntoDLL(dev,iSleep,iProfile+1,ObjarrDLLButtonData).then(() => {
            callback("SetKeyFunction Done");
        });
        //-----------------------------------

    }
    KeyAssignToData(KeyAssignData){
        //var BufferKey = Buffer.alloc(55);//KeyData
        //Turn UI Function Into DLL's partition
        var DLLfunction = 0;
        var DLLbinding = 0;
        var DLLbinding_aux = 0;
        switch (KeyAssignData.group) {
            case 1://Macro Function
                DLLfunction = 0x11;//MACRO_FUN(0x11)

                var arrDLLRepeat = [0,2,1];
                DLLbinding = arrDLLRepeat.indexOf(KeyAssignData.param);
                if (DLLbinding == -1) {
                    DLLbinding = 0;
                }
                break;
            case 7://Key Function
                for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                    if(KeyAssignData.function == SupportData.AllFunctionMapping[iMap].value ){
                        var arrModifiers = [1,0,2,3,4];
                        DLLfunction = 0x10;//KEYBOARD_KEY_FUN(0x10)
                        for (var index = 0; index < KeyAssignData.param.length; index++) {
                            if (KeyAssignData.param[index] == true)
                                DLLbinding |= Math.pow(2,arrModifiers[index]);//Binary To Byte
                        }
                        DLLbinding_aux = parseInt(SupportData.AllFunctionMapping[iMap].keyCode);//key code. >VK Code

                        //Assign MDF KeyCode to Select Key-KeyCode
                        for(var i=0; i<this.MDFMapping.length; i++){
                            if(SupportData.AllFunctionMapping[iMap].value == this.MDFMapping[i].value){
                                //DLLbinding_aux = parseInt(this.MDFMapping[i].keyCode);
                                DLLbinding |= Math.pow(2,this.MDFMapping[i].MDFKey);//Binary To Byte
                                DLLbinding_aux = 0;
                                //bModifyKey = true;
                                break;
                            }
                        }
                        break;
                    }
                }
            break;
            case 3://Mouse Function
                DLLfunction = 0x13;//MOUSE_BUTTON_FUN(0x13)
                ///////////DLL binding Mouce Function List////////////////////
                //LEFT_CLICK				= 0x01,
                //RIGHT_CLICK				= 0x02,
                //MIDDLE_CLICK			    = 0x04,
                //IE_BACKWARD				= 0x08,
                //IE_FORWARD			    = 0x10,
                //SCROLL_UP				    = 0x11,
                //SCROLL_DOWN				= 0x12,
                //TRIPLE_CLICK			    = 0x13,
                //FIRE_KEY				    = 0x14,
                //PROFILE_CYCLE_NEXT		= 0x15,
                //PROFILE_CYCLE_PREV		= 0x16,
                if (KeyAssignData.function == 11) {//Layer Shift Button
                    DLLfunction = 0x0b;//MOUSE_BUTTON_FUN(0x13)
                    DLLbinding = 0x02;
                }else{
                    var arrMouseValue = [1,0x01,0x02,0x04,0x10,0x08,0x11,0x12,0x16,0x15,0x01];
                    DLLbinding = arrMouseValue[KeyAssignData.function];//Turn UI Mouse Function Into DLL's partition
                }
            break;
            case 8://Keyboard Profile/Layer Switch
                DLLfunction = 0x12;//SHORTCUTS_FUN(0x12)
                DLLbinding = 0x23;//LAUNCH_PROGRAM
            break;
            case 4://DPI Switch
                DLLfunction = 0x14;//DPI_FUN(0x14)
                ///////////DLL binding DPI Function List////////////////////
	            //NEXT_CPI			= 0x00,
	            //PREVIOUS_CPI		= 0x01,
	            //NEXT_CPI_CYCLE	= 0x03,
	            //lOCK_CPI			= 0x0A,
                var arrDPIValue = [0,0x00,0x01,0x03,0x04,0x0A];
                DLLbinding = arrDPIValue[KeyAssignData.function];//Turn UI DPI Function Into DLL's partition
                if (arrDPIValue[KeyAssignData.function] == 0x0A) {//Sniper DPI(lOCK_CPI)
                    var DpiValue = KeyAssignData.param;
                    DLLbinding_aux = DpiValue;
                }
            break;
            case 5://Multi Media
                DLLfunction = 0x15;//MEDIA_FUN(0x15)
                ///////////DLL binding DPI Function List////////////////////
                //M_MEDIA_PLAYER	= 0x01,
                //M_PLAY_PAUSE		= 0x02,
                //M_NEXT_TRACK		= 0x03,
                //M_PREV_TRACK		= 0x04,
                //M_STOP			= 0x05,
                //M_VOL_MUTE		= 0x06,
                //M_VOL_UP			= 0x07,
                //M_VOL_DOWN		= 0x08,
                var arrMediaValue = [0,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x03,0x04];
                DLLbinding = arrMediaValue[KeyAssignData.function];//Turn UI DPI Function Into DLL's partition
            break;
            case 2://Windows Shortcut/Launch
                DLLfunction = 0x12;//SHORTCUTS_FUN(0x12)
                ///////////DLL binding Windows Function List////////////////////
	            //OS_EMAIL		= 0x00,
	            //OS_CALCULATOR	= 0x01,
	            //OS_MY_PC		= 0x02,
	            //OS_EXPLORER	= 0x03,
	            //OS_IE_HOME	= 0x04,
	            //OS_IE_REFRESH	= 0x05,
	            //OS_IE_STOP	= 0x07,
	            //OS_IE_BACK	= 0x08,
	            //OS_IE_FORWARD	= 0x09,
	            //OS_IE_SEARCH	= 0x10,
	            //LAUNCH_PROGRAM= 0x23,
                //OPEN_FILE_LINK= 0x24,
                switch (KeyAssignData.function) {
                    case 1://Launch Program
                        DLLbinding = 0x23;//LAUNCH_PROGRAM
                    break;
                    case 2://Launch WebSite
                        DLLbinding = 0x23;//LAUNCH_PROGRAM
                    break;
                    default:
                    break;
                }
                if (KeyAssignData.function == 1) {//Launch Program
                    DLLbinding = 0x24;//OPEN_FILE_LINK
                }
                else if (KeyAssignData.function == 2) {//Launch WebSite
                    DLLbinding = 0x24;//OPEN_FILE_LINK(WebSite)
                }
                else if (KeyAssignData.function == 3) {//Windows Shortcut
                    switch (KeyAssignData.param) {
                        case 1://Emil
                            DLLbinding = 0x00;//OS_EMAIL
                        break;
                        case 2://Calculator
                            DLLbinding = 0x01;//OS_CALCULATOR
                        break;
                        case 3://My PC
                            DLLbinding = 0x02;//OS_MY_PC
                        break;
                        case 4://Explorer(Win+E)
                            DLLfunction = 0x10;//OS_EXPLORER->KEYBOARD_KEY_FUN(0x10)
                            DLLbinding  = 0x08;//MDFKey-Windows
                            DLLbinding_aux = 0x45;//Visual Key code-E
                        break;
                        case 5://Home
                            DLLbinding = 0x04;//OS_IE_HOME
                        break;
                        case 6://Rehresh
                            DLLbinding = 0x05;//OS_IE_REFRESH
                        break;
                        case 7://Stop
                            DLLbinding = 0x07;//OS_IE_STOP
                        break;
                        case 8://Back
                            DLLbinding = 0x08;//OS_IE_BACK
                        break;
                        case 9://Forward
                            DLLbinding = 0x09;//OS_IE_SEARCH
                        break;
                        case 10://Search
                            DLLbinding = 0x10;//OS_IE_SEARCH
                        break;
                        default:
                        break;
                    }
                }
            break;
            case 6://Disable
                DLLfunction = 0x0a;//DISABLE_BUTTON_FUN(0x0a)
            break;
            default:
            break;
        }
        var Obj = {DLLfunction:DLLfunction,DLLbinding:DLLbinding,DLLbinding_aux:DLLbinding_aux};//Assemble DLL's partition
        return Obj;
    }
    SetFeatureReport(dev, buf,iSleep) {
        return new Promise((resolve, reject) => {
            try{
                   var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, buf);
                   setTimeout(() => {
                    // if(rtnData != 65)
                    //     env.log("DeviceApi SetFeatureReport","SetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                    },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf,iSleep) {
        return new Promise((resolve, reject) => {
            try{
                //    var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, buf);
                   var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65);
                   setTimeout(() => {
                    // if(rtnData != 65)
                    //     env.log("DeviceApi GetFeatureReport","GetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                    },iSleep);
            }catch(err){
                env.log("DeviceApi Error","GetFeatureReport",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    SetButtonFuncIntoDLL(dev,iSleep,iProfile,DLLButtonID,DLLfunction,DLLbinding,DLLbinding_aux,DLLDataMacro) {
        return new Promise((resolve, reject) => {
            try{
                var DeviceFlags = this.GloriousMOISDK.SetButtonFunc(iProfile,DLLButtonID,DLLfunction,DLLbinding,DLLbinding_aux,DLLDataMacro);
                    setTimeout(() => {
                        resolve(DeviceFlags);
                    },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetButtonFuncIntoDLL",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    SetAllButtonIntoDLL(dev,iSleep,iProfile,ObjButtonData) {
        return new Promise((resolve, reject) => {
            try{
                var DeviceFlags = this.GloriousMOISDK.SetAllButton(iProfile,ObjButtonData);
                    setTimeout(() => {
                        resolve(DeviceFlags);
                    },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetAllButtonIntoDLL",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
    SetLEDOnOffIntoDLL(dev,iSleep,iOnOff) {
        return new Promise((resolve, reject) => {
            try{
                var DeviceFlags = this.GloriousMOISDK.SetLEDOnOff(iOnOff);
                setTimeout(() => {
                    resolve(DeviceFlags);
                },iSleep);
            }catch(err){
                env.log("DeviceApi Error","SetAllButtonIntoDLL",`ex:${(err as Error).message}`);
                resolve(err);
            }
        });
    }
}
