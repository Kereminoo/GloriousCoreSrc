import { EventTypes } from "../../../../../common/EventVariable";
import { SupportData } from "../../../../../common/SupportData";
import { GMMKLocation } from "../../../others/GMMKLocation";
import { env } from "../../../others/env";
import { Keyboard } from "./keyboard";
import { GetValidURL } from '../../../../../common/utils';

// const env = require('../../../others/env');
// var EventTypes = require('../../../others/EventVariable').EventTypes;
// var SupportData = require('../../../others/SupportData');

// var GMMKLocation = require('../../../others/GMMKLocation').GMMKLocation;

'use strict';


export class Gmmk3Series extends Keyboard
{
    static #instance: Gmmk3Series;

    m_bSetFWEffect: boolean;
    m_bSetHWDevice: boolean;

    Matrix_SideLED: any[];
    arrLEDType: any[];

    constructor(hid,AudioSession) {
        env.log('Gmmk3Series','Gmmk3Series class','begin');
        super();

        this.m_bSetFWEffect = false;//SET DB
        this.m_bSetHWDevice = false;
        this.hid = hid;
        this.AudioSession = AudioSession;

        this.Matrix_SideLED =  [ "SideLED1","SideLED2","SideLED3","SideLED4","SideLED5","SideLED6","SideLED7","SideLED8","SideLED9","SideLED10","SideLED11","SideLED12","SideLED13","SideLED14","SideLED15","SideLED16","SideLED17","SideLED18","SideLED19","SideLED20"];

        this.arrLEDType  =
        [
            8,//'LEDOFF',
            0,//'GloriousMode',
            1,//'Wave#1',
            3,//'Wave#2',
            4,//'SpiralingWave',
            5,//'AcidMode',
            2,//'Breathing',
            6,//'NormallyOn',
            7,//'RippleGraff',
            9,//'PassWithoutTrace',
            10,//'FastRunWithoutTrace',
            11,//'Matrix2',
            12,//'Matrix3',
            13,//'Rainbow',
            14,//'HeartbeatSensor',
            15,//'DigitTimes',
            16,//'Kamehameha',
            17,//'Pingpong',
            18,//'Surmount',
        ];
    }

    static getInstance(hid,AudioSession) {
        if (this.#instance) {
            env.log('Gmmk3Series', 'getInstance', `Get exist Gmmk3Series() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('Gmmk3Series', 'getInstance', `New Gmmk3Series() INSTANCE`);
            this.#instance = new Gmmk3Series(hid,AudioSession);

            return this.#instance;
        }
    }

    /**
     * Init Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    InitialDevice(dev,Obj,callback) {
        env.log('Gmmk3Series','initDevice','Begin')
        dev.bwaitForPair = false;
        dev.m_bSetHWDevice = false;

        //-------Initial Key/LEDCode Matrix-------
        var keyBoardList = GMMKLocation.keyBoardList[dev.BaseInfo.SN];

        if (keyBoardList != undefined) {
            dev.Matrix_LEDCode_GMMK = keyBoardList.Matrix_LEDCode;
            dev.Matrix_KEYButtons = keyBoardList.Matrix_KEYButtons;
            dev.Buttoninfo_Default = keyBoardList.Buttoninfo_Default;
        } else {
            env.log(dev.BaseInfo.devicename,"InitialDevice",'GMMKLocation is not Exists');
            callback(0);
            return;
        }

        dev.KeyMatrixLength = 110;//valueA PRO valueB Wireless-126 BYTE


        //-------Initial Key/LEDCode Matrix-------
        dev.BaseInfo.version_Wireless = "0001";
        if(env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {//Is in Bootloader
            dev.BaseInfo.version_Wired = "0001";
            callback(0);
        } else if(env.BuiltType == 0) {
            // this.ReadFWVersion(dev,0,function (ObjFWVersion) {
                var ObjPollingrate = {iPollingrate:1000,EP2Enable:1,LEDNoChange:1};
                this.SetPollingRatetoDevice(dev,ObjPollingrate, function(param1){//LEDNoChange
                    //this.SetProfileDataFromDB(dev,0,function () {
                        callback(0);
                    //});
                });
            // });
        } else {
            dev.BaseInfo.version_Wired = "0021";
            callback(0);
        }
    }

    /**
     * Set Device Data from DB to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetProfileDataFromDB(dev,Obj,callback) {
        if(env.BuiltType == 1) {
            callback();
            return;
        }
        this.nedbObj.getLayout().then((data) => {//Get Perkey Dat
            const SetProfileData = (iProfile,iLayerIndex) =>{
                var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
                var ProfileData = dev.deviceData.profile[iProfile];
                //var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                if (iProfile < 3 && iLayerIndex < 3 && ProfileData!= undefined) {
                    var appProfileLayers=dev.deviceData.profileLayers;
                    //KeyAssignData
                    var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                    var ObjKeyAssign = {
                        iProfile :iProfile,
                        iLayerIndex :iLayerIndex,
                        KeyAssignData:KeyAssignData,
                        assignedKnob: undefined,
                    }
                    ///Assign Key Knob For GMMK Pro/Gmmk Pro Iso
                    if (appProfileLayers[iProfile][iLayerIndex].assignedKnob != undefined) {
                        ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex].assignedKnob;
                    }
                    //LightingData
                    var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                    LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
                    var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;

                    var ObjLighting = {
                        iProfile :iProfile,
                        iLayerIndex :iLayerIndex,
                        LightingData:LightingData,
                        LightingPerKeyData:LightingPerKeyData,
                        Perkeylist:layoutDBdata
                    }
                    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                        this.SetLEDEffect(dev, ObjLighting, (param2) => {
                            SetProfileData(iProfile,iLayerIndex+1);
                        });
                    });
                } else if(iProfile < 3 && ProfileData!= undefined) {
                    SetProfileData(iProfile+1,0);
                } else {//Finish SetProfileData Loop
                    this.nedbObj.getMacro().then((doc) => {
                        var MacroData = doc;
                        var ObjMacroData = {MacroData:MacroData};
                        this.SetMacroFunction(dev, ObjMacroData, (param1) => {
                            this.ChangeProfileID(dev,dev.deviceData.profileindex, (paramDB) =>{
                                var iProfile = dev.deviceData.profileindex;
                                var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                                var appProfileLayers=dev.deviceData.profileLayers;
                                var iPollingrate = appProfileLayers[iProfile][iLayerIndex].pollingrate;
                                var ObjPollingrate = {iPollingrate:iPollingrate,EP2Enable:1,LEDNoChange:0};
                                this.SetPollingRatetoDevice(dev,ObjPollingrate, (param1) =>{
                                    callback("SetProfileDataFromDB Done");
                                });
                            });
                        });
                    });
                }
            }
            SetProfileData(0,0);//Initialize SetProfileData Loop

        });//Finished getLayout Function
    }

    /**
     * Set Device Data from Import Profile to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetImportProfileData(dev,Obj,callback) {
        if(env.BuiltType == 1) {
            callback();
            return;
        }
        var iProfile = dev.deviceData.profileindex;
        const SetLayoutData = (iLayerIndex) => {
            if (iLayerIndex < 3) {
                var appProfileLayers=dev.deviceData.profileLayers;
                //KeyAssignData
                var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                var ObjKeyAssign = {
                    iProfile :iProfile,
                    iLayerIndex :iLayerIndex,
                    KeyAssignData:KeyAssignData,
                    assignedKnob: undefined,
                }
                ///Assign Key Knob For GMMK Pro/Gmmk Pro Iso
                if (appProfileLayers[iProfile][iLayerIndex].assignedKnob != undefined) {
                    ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex].assignedKnob;
                }
                //LightingData
                var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;

                var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;

                var Perkeylist = Obj.Perkeylist;
                var ObjLighting = {
                    iProfile :iProfile,
                    iLayerIndex :iLayerIndex,
                    LightingData:LightingData,
                    LightingPerKeyData:LightingPerKeyData,
                    Perkeylist:Perkeylist
                }
                this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                    this.SetLEDEffect(dev, ObjLighting, (param2) => {
                        SetLayoutData(iLayerIndex+1);
                    });
                });
            } else {
                var Macrolist = Obj.Macrolist;
                var MacroData: any[] = [];
                for (let index = 0; index < Macrolist.length; index++) {
                    if (parseInt(Macrolist[index].m_Identifier) > 0) {
                        MacroData.push(Macrolist[index]);
                    }
                }
                //this.nedbObj.getMacro().then(function (doc) {
                    //var MacroData = doc;
                    var ObjMacroData = {MacroData:MacroData};
                    this.SetMacroFunction(dev, ObjMacroData, (param1) => {
                        var iProfile = dev.deviceData.profileindex;
                        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
                        var appProfileLayers=dev.deviceData.profileLayers;
                        var iPollingrate = appProfileLayers[iProfile][iLayerIndex].pollingrate;
                        var ObjPollingrate = {iPollingrate:iPollingrate,EP2Enable:1,LEDNoChange:0};
                        this.SetPollingRatetoDevice(dev,ObjPollingrate, (param1) =>{
                            this.ChangeProfileID(dev,dev.deviceData.profileindex, (paramDB) =>{
                                callback("SetProfileDataFromDB Done");
                            });
                        });
                    });
                //});
            }
        }
        SetLayoutData(0);
    }

    HIDEP2Data(dev,ObjData) {
        if (ObjData[0]==0x04 && ObjData[1]== 0xf7 && ObjData[2] >= 0x80)
        { //EP2 Launch Program-Press
            //-------------overlay by EPTempData---------------
            //var EPTempData = this.hid.GetEPTempData(dev.BaseInfo.DeviceId);
            // if (ObjData[0]==0x04 && ObjData[1]== 0xf7 && ObjData[2] >= 0x80){ //when EPTempData is launch,overlay the ObjData
            //     for (var i = 0; i < ObjData.length; i++) {
            //         ObjData[i] = EPTempData[i];
            //     }
            //     env.log(dev.BaseInfo.devicename,'overlayEPTempData-Launch:',JSON.stringify(ObjData));
            // }
            // //-------------overlay by EPTempData---------------
            var iKeyColumn = ObjData[2] & 0x7F;//KEYCOLUMN-AND Binary 0111
            var iKeyRaw = ObjData[3];
            if (iKeyColumn == 0x04 && (iKeyRaw == 0x0f || iKeyRaw == 0x10)) {
                this.LaunchProgramKnob(dev,iKeyRaw == 0x10 ? 1 : 0,false);
            } else {
                var iKey =  dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn*20+iKeyRaw]);
                this.LaunchProgram(dev,iKey);
            }
        }
        else if (ObjData[0]==0x04 && ObjData[1]== 0xf7 && ObjData[4] == 0x01){ //EP2 Launch Program-Press-For Wireless
            //-------------overlay by EPTempData---------------
            var iKeyColumn: number = ObjData[2];
            var iKeyRaw = ObjData[3];
            // if (iKeyColumn == 0x04 && (iKeyRaw == 0x0f || iKeyRaw == 0x10)) {
            //     _this.LaunchProgramKnob(dev,iKeyRaw == 0x10 ? 1 : 0,false);
            // } else {
                var iKey =  dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn* 5 +iKeyRaw]);
                this.LaunchProgram(dev,iKey);
            // }
        	} else if (ObjData[0]== 0x04 && ObjData[1]== 0xf1  && ObjData[8]!= 0x01){ //EP2 Switch Profile/Layer
            var iProfile = ObjData[2]-1;
            var iLayerIndex = ObjData[3]-1;
            var ObjProfileIndex ={Profile:iProfile, LayerIndex:iLayerIndex, SN:dev.BaseInfo.SN};
            env.log('Gmmk3Series','HIDEP2Data-SwitchProfile',JSON.stringify(ObjProfileIndex));
            //---------------Update dev ProfileData------------------
            dev.deviceData.profileindex = iProfile;
            dev.deviceData.profileLayerIndex[iProfile] = iLayerIndex;
            //---------------Send ProfileData Into UI----------------
            var Obj2 = {
                Func: EventTypes.SwitchUIProfile,
                SN: dev.BaseInfo.SN,
                Param: ObjProfileIndex
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            //----------------Set ProfileData to DB-------------------
            this.setProfileToDevice(dev, function(paramDB) {// Save DeviceData into Database
            });
        } 
        else if (ObjData[0]== 0x04 && ObjData[1]== 0xf2){ //EP2 Switch Effect
            var iProfile = ObjData[2]-1;
            var iLayerIndex = ObjData[3]-1;
            var iEffect = this.arrLEDType[ObjData[4]];//Turn FW_Effect Into UI_Effect
            var iSpeed = ObjData[5] * 100/20;
            var iBright = ObjData[6] * 100/20;
            var ObjLighting ={Profile:iProfile, LayerIndex:iLayerIndex,Effect:iEffect,Speed:iSpeed,Bright:iBright, SN:dev.BaseInfo.SN};
            var Obj3 = {
                Func: EventTypes.SwitchLighting,
                SN: dev.BaseInfo.SN,
                Param: ObjLighting
            };
            this.emit(EventTypes.ProtocolMessage, Obj3);
        }
        else if (ObjData[0]== 0x04 && ObjData[1]== 0xf9){ //EP2 Multicolor Switch
            var iEffect = this.arrLEDType[ObjData[2]];//Turn FW_Effect Into UI_Effect
            var bMultiColor = ObjData[3] == 1 ? true : false;
            var iProfileindex = dev.deviceData.profileindex;
            var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfileindex];
            var LightingData = JSON.parse(JSON.stringify(dev.deviceData.profileLayers[iProfileindex][iLayerIndex2].light_PRESETS_Data));
            // LightingData.Multicolor = bMultiColor;

            if (iEffect == LightingData.value) {
                LightingData.Multicolor = bMultiColor;
                //----------Set LEDDATA to DB-----------
                var ObjLighting2 ={Effect:LightingData, SN:dev.BaseInfo.SN};
                var Obj4 = {
                    Func: EventTypes.SwitchMultiColor,
                    SN: dev.BaseInfo.SN,
                    Param: ObjLighting2
                };
                this.emit(EventTypes.ProtocolMessage, Obj4);
                //----------Set LEDDATA to DB-----------
                this.setProfileToDevice(dev, function(paramDB) {// Save DeviceData into Database
                });
            }
        }
        if (ObjData[0]==0x04 && (ObjData[1]== 0xf8 || ObjData[1]== 0xf7 ) && ObjData[2] >= 0x80){ //EP2 Input-Press
            var iKeyColumn = ObjData[2] & 0x7F;//KEYCOLUMN-AND Binary 0111
            var iKeyRaw = ObjData[3];
            var iKey =  dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn*20+iKeyRaw]);
            //-----------emit-------------------
            var Obj5 = {Func: "SendKeynumber",SN:dev.BaseInfo.SN,Param:iKey};
            this.emit(EventTypes.ProtocolMessage, Obj5);
        }
    }

    /**
     * Launch Program
     * @param {*} dev
     * @param {*} iKey
     */
    LaunchProgram(dev,iKey) {
        var iProfile = dev.deviceData.profileindex;
        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
        var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];//Button
        switch (KeyAssignData.recordBindCodeType) {
            case "LaunchProgram"://LaunchProgram Function
                var csProgram = KeyAssignData.ApplicationPath;

                if (csProgram == undefined) {
                    console.log(dev.BaseInfo.devicename,'---csProgram is undefined');
                }
                else if (csProgram != "") {
                    this.RunApplication(csProgram);
                }
                break;
            case "LaunchWebsite"://LaunchWebsite Function
                var csProgram = KeyAssignData.WebsitePath;
                if (csProgram == undefined) {

                    console.log(dev.BaseInfo.devicename,'---csProgram is undefined');
                }
                else if (csProgram != "") {
                    this.RunWebSite(GetValidURL(csProgram), null);
                }
            break;
            default:
                break;
        }
    }
    /**
     * Launch Program Knob
     * @param {*} dev
     * @param {*} iKey
     */
    LaunchProgramKnob(dev,iKey,bSwitch) {
        var iProfile = dev.deviceData.profileindex;
        var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
        var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKnob[iKey];//Button

        env.log('GmmkNumpad-LaunchProgram','KnobData:' + JSON.stringify(KeyAssignData),'iKey:'+JSON.stringify(iKey));
        switch (KeyAssignData.recordBindCodeType) {
            case "Shortcuts"://LaunchProgram Function
                if (KeyAssignData.recordBindCodeName == 'Microphone_Down') {
                    this.AudioSession?.MicrophoneDown(2);
                } else if (KeyAssignData.recordBindCodeName == 'Microphone_Up') {
                    this.AudioSession?.MicrophoneUp(2);
                } else if (KeyAssignData.recordBindCodeName == 'Audio_Device_Prev') {
                    this.AudioSession?.Initialization();
                    this.AudioSession?.SetNextAudioDeviceDefault();
                } else if (KeyAssignData.recordBindCodeName == 'Audio_Device_Next') {
                    this.AudioSession?.Initialization();
                    this.AudioSession?.SetNextAudioDeviceDefault();
                }
                break;
                //--------------------------------------
            default:
                break;
        }
        ///////////test////////////////////////
        // if (iKey) {
        //     this.AudioSession.MicrophoneUp(2);

        // }else {
        //     this.AudioSession.MicrophoneDown(2);
        // }
        ///////test2//////////////////////////
        // if (iKey) {
        //     this.AudioSession.Initialization();
        //     this.AudioSession.SetNextAudioDeviceDefault();

        // }else {
        //     this.AudioSession.Initialization();
        //     this.AudioSession.SetPreviousAudioDeviceDefault();
        // }
    }

    /**
     * Set Polling Rate to Device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetPollingRatetoDevice(dev, Obj, callback) {
        var Data = Buffer.alloc(264);
        var arrPollingrate = [1000,500,250,125];
        Data[0] = 0x07;
        Data[1] = 0x08;
        // Data[8] = arrPollingrate.indexOf(Obj.iPollingrate);
        Data[2] = Obj.EP2Enable; //EP3_Flag
        // Data[10] = Obj.LEDNoChange;//LED NO Change: 0 Dis/ 1 En

        // //-----------------------------------
        return new Promise((resolve) => {
            this.SetFeatureReport(dev, Data,100).then(function () {
                callback();
            });
        });
    }

    /**
     * Read FW Version from device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    ReadFWVersion(dev,Obj,callback){
        try{
            var rtnData = this.hid!.GetFWVersion(dev.BaseInfo.DeviceId);
            var CurFWVersion = parseInt(rtnData.toString(16), 10);
            var verRev = CurFWVersion.toString();//Version byte Reversed
            var strVertion = verRev.padStart(4,'0');
            if (strVertion == '2000') {//Ver 2000>Force Update
                dev.BaseInfo.version_Wired = '0001';
            } else {
                dev.BaseInfo.version_Wired = strVertion;
            }
            callback("0");
        } catch(e) {
            env.log('Gmmk3Series','ReadFWVersion',`Error:${e}`);
            callback(false);
        }
    }

    /**
     * Set key matrix to device
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    SetKeyMatrix(dev, Obj, callback) {
        env.log('Gmmk3Series','SetKeyMatrix','Begin')
        dev.deviceData.profile =Obj.KeyBoardManager.KeyBoardArray;//Assign profileData From Obj
        dev.deviceData.profileLayers = Obj.KeyBoardManager.profileLayers;//Assign profileData From Obj
        dev.deviceData.profileindex=Obj.KeyBoardManager.profileindex;
        dev.deviceData.profileLayerIndex=Obj.KeyBoardManager.profileLayerIndex;
        dev.deviceData.sideLightSwitch=Obj.KeyBoardManager.sideLightSwitch;
        var iProfile = Obj.KeyBoardManager.profileindex;//Assign profileindex From deviceData
        var appProfileLayers=Obj.KeyBoardManager.profileLayers;
        var Temp3=Obj.KeyBoardManager.layerMaxNumber;
        //dev.deviceData.profile = KeyBoardManager.profileData;//Assign profileData From Obj
       //var iProfile = dev.deviceData.profileindex;//Assign profileindex From deviceData
        var switchUIflag = Obj.switchUIflag;
        if(env.BuiltType == 1) {
            this.setProfileToDevice(dev, function(paramDB) {//Save DeviceData into Database
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
                        var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
                        var ObjKeyAssign = {
                            iProfile :iProfile,
                            iLayerIndex :iLayerIndex,
                            KeyAssignData:KeyAssignData,
                            assignedKnob: undefined,
                        }
                        ///Assign Key Knob For GMMK Pro/Gmmk Pro Iso
                        if (appProfileLayers[iProfile][iLayerIndex].assignedKnob != undefined) {
                            ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex].assignedKnob;
                        }
                        var ObjMacroData = {MacroData:MacroData};
                        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                            this.SetMacroFunction(dev, ObjMacroData,  (param2) => {
                                this.ChangeProfileID(dev, iProfile, (param0) => {
                                    this.setProfileToDevice(dev, (paramDB) => {// Save DeviceData into Database
                                        dev.m_bSetHWDevice = false;
                                        callback("SetKeyMatrix Done");
                                    });
                                });
                            });
                        });
                    });
                break;
                case switchUIflag.lightingflag://Set Device Lighting
                    this.nedbObj.getLayout().then( (data) => {//Get Perkey Data
                        var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
                        var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
                        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
                        var ObjLighting = {
                            iProfile :iProfile,
                            iLayerIndex :iLayerIndex,
                            LightingData:LightingData,
                            LightingPerKeyData:LightingPerKeyData,
                            Perkeylist:layoutDBdata
                        }
                        this.SetLEDEffect(dev, ObjLighting, (param2) => {
                           this.setProfileToDevice(dev, (paramDB) => {//Save  DeviceData into Database
                                this.ChangeProfileID(dev, iProfile, function(param0) {
                                   dev.m_bSetHWDevice = false;
                                   callback("SetKeyMatrix Done");
                               });
                            });
                        });
                    });
                break;
                case switchUIflag.performanceflag://Set Device Performance
                    var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
                    var iPollingrate = appProfileLayers[iProfile][iLayerIndex].pollingrate;
                    var ObjPollingrate = {iPollingrate:iPollingrate,EP2Enable:1,LEDNoChange:0};
                    this.SetPollingRatetoDevice(dev, ObjPollingrate ,(paramDB) => {

                        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
                        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
                        var ObjTypeData = {iProfile :iProfile,iLayerIndex :iLayerIndex,Data:LightingData};
                        this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
                            this.setProfileToDevice(dev, function(paramDB) {// Save DeviceData into Database
                                callback("SetKeyMatrix Done");
                            });
                        });
                    });
                break;
            }
        } catch(e) {
            env.log('Gmmk3Series','SetKeyMatrix',`Error:${e}`);
        }
    }

    /**
     * Set Macro to Device
     * @param {*} dev
     * @param {*} ObjMacroData
     * @param {*} callback
     */
    SetMacroFunction(dev, ObjMacroData, callback)
    {
        const SetMacro = (iMacro) => {
            if (iMacro < ObjMacroData.MacroData.length) {
                var MacroData = ObjMacroData.MacroData[iMacro];//Button
                var BufferKey = this.MacroToData(MacroData);
                var ObjMacroData2 = {MacroID:parseInt(MacroData.value),MacroData:BufferKey};

                this.SetMacroDataToDevice(dev, ObjMacroData2,function () {
                    SetMacro(iMacro + 1);
                });
            } else {
                callback("SetMacroFunction Done");
            }
        }
        SetMacro(0);
    }

    /**
     * Set Macro to Device
     * @param {*} dev
     * @param {*} ObjMacroData
     * @param {*} callback
     */
    SetMacroDataToDevice(dev, ObjMacroData,callback) {
        var MacroID = ObjMacroData.MacroID;
        var MacroData = ObjMacroData.MacroData;

        var Data = Buffer.alloc(264);
        Data[0] = 0x07;
        Data[1] = 0x05;
        Data[2] = MacroID;
        var iMaxSize = 248;
        for (var k = 0; k < iMaxSize; k++)
            Data[8+k] = MacroData[0+k];
        this.SetFeatureReport(dev, Data,100).then(function () {
            callback("SetMacroDataToDevice Done");
        });
    }
    MacroToData(MacroData) {
        var BufferKey = new Array(264);
        var DataEvent: any[] = [];//DataEvent
        //------------Turns Hash Keys into Event Array-------------
        var Macrokeys = Object.keys(MacroData.content);
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
        DataEvent = DataEvent.sort(function (a, b) {
            return a.times >= b.times ? 1 : -1;
        });
        //------------Turns Event Array into BufferKey-------------
        for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
            var KeyCode = 0x04;//A
            var bModifyKey = false;
            var bMouseButton = false;
            //Assign Keyboard/Mouse KeyCode to KeyCode
            for(var i=0; i<SupportData.AllFunctionMapping.length; i++){
                if(DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code){
                    KeyCode = SupportData.AllFunctionMapping[i].hid as number;
                    break;
                }
            }
            //Assign Delay to Event
            var iDelay = 1;
            if (iEvent < DataEvent.length-1) {
                iDelay = DataEvent[iEvent+1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent+1].times - DataEvent[iEvent].times : 1;
            }

            BufferKey[iEvent*3+0] = iDelay >> 0x08;
            if (DataEvent[iEvent].keydown)
                BufferKey[iEvent*3+0] += 0x80;
            BufferKey[iEvent*3+1] = iDelay & 0xFF;
            //Assign KeyCode to Event
            BufferKey[iEvent*3+2] =KeyCode;
        }
        return BufferKey;
    }

    SetKeyFunction(dev, ObjKeyAssign, callback) {
        //------------KeyAssignment-------------
        //KeyMapping
        var KeyAssignData = ObjKeyAssign.KeyAssignData;
        var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
        var Obj1 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer
        }
        ///Assign Key Knob For GMMK Pro/Gmmk Pro Iso
        if (ObjKeyAssign.assignedKnob != undefined) {
            this.KnobAssignToData(dev, ObjKeyAssign.assignedKnob, DataBuffer);
        }
        //------------MacroType-------------
        var DataBuffer2 = this.MacroTypeToData(dev, KeyAssignData);
        var Obj2 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer2
        }
        //------------Set Key Matrix ALT_GR-------------
        var KeyAssignData = ObjKeyAssign.KeyAssignData;
        var DataBuffer3 = this.KeyAltGrToData(dev, KeyAssignData);
        var Obj3 = {
            iProfile: ObjKeyAssign.iProfile,
            iLayerIndex: ObjKeyAssign.iLayerIndex,
            DataBuffer: DataBuffer3
        }
        //------------------------------------
        this.SendButtonMatrix2Device(dev, Obj1).then(() => {
            this.SendMacroType2Device(dev, Obj2).then(() => {
                //this.SendAlrGR2Device(dev, Obj3 ,function() {
                    callback("SetKeyFunction Done");
                //});
            });
        });
    }

    SendAlrGR2Device(dev, Obj,callback) {
        var iProfile=Obj.iProfile;
        var iLayerIndex=Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;
        // if (DataBuffer == false) {
        //     callback();
        //     return;
        // }
        Data[0] = 0x07;
        Data[1] = 0x09;
        Data[2] = iProfile+1; //DataProfile
        Data[3] = iLayerIndex+1; //Layer
        var DataBuffer = Obj.DataBuffer;

        for (var i = 0; i < DataBuffer.length; i++)//30
            Data[8 + i] = DataBuffer[i];
        //-----------------------------------
        this.SetFeatureReport(dev, Data,150).then(function () {
            callback();
        });
        //-----------------------------------
    };

    SendButtonMatrix2Device(dev, Obj) {
        var iProfile=Obj.iProfile;
        var iLayerIndex=Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;
        Data[0] = 0x07;
        Data[1] = 0x03;
        Data[2] = iProfile+1; //DataProfile
        Data[3] = iLayerIndex+1; //Layer
        var DataBuffer = Obj.DataBuffer;

        for (var i = 0; i < DataBuffer.length; i++)//30
            Data[8 + i] = DataBuffer[i];
        //-----------------------------------
        return new Promise((resolve) => {
            this.SetFeatureReport(dev, Data,150).then(function () {
                resolve("SendButtonMatrix2Device Done");
            });
        });
        //-----------------------------------
    };
    SendMacroType2Device(dev, Obj) {
        var iProfile=Obj.iProfile;
        var iLayerIndex=Obj.iLayerIndex;
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;

        Data[0] = 0x07;
        Data[1] = 0x04;
        Data[2] = iProfile+1; //DataProfile
        Data[3] = iLayerIndex+1; //Layer

        var DataBuffer = Obj.DataBuffer;

        //-----------------------------------
        return new Promise((resolve) => {
            if (DataBuffer == false) {//No Macro
                resolve("SendButtonMatrix2Device Done");
            } else {
                for (var i = 0; i < DataBuffer.length; i++)//30
                {
                    Data[8 + i] = DataBuffer[i];
                }
                this.SetFeatureReport(dev, Data,150).then(function () {
                    resolve("SendButtonMatrix2Device Done");
                });
            }
        });
        //-----------------------------------
    };
    MacroTypeToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(264);
        var iMacroCount = 0;
        var arrMacroType=[0x01,0x00,0xffff];

        for(var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case "MacroFunction"://MacroFunction Function
                    DataBuffer[iIndex*2] = arrMacroType[Temp_BtnList.macro_RepeatType] >> 0x08;
                    DataBuffer[iIndex*2+1] = arrMacroType[Temp_BtnList.macro_RepeatType] & 0xFF;
                    iMacroCount++;
                break;
                default:
                break;
            }
        }
        if (iMacroCount<=0)
            return false;
        else
            return DataBuffer;
    }
    KeyAltGrToData(dev, KeyAssignData) {
        var DataBuffer = Buffer.alloc(264);//104KeyData

        var iAltGrCount = 0;
        for(var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case "SingleKey"://Keyboard Function/Combination Key
                    var KeyCode = 0;
                    // for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                    //     if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                    //         KeyCode = SupportData.AllFunctionMapping[iMap].hid;
                    //         break;
                    //     }
                    // }

                    var arrcomplex=[false,false,Temp_BtnList.AltGr];
                    var bycomplex = 0;
                    for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
                        if (arrcomplex[icomplex] == true)
                            bycomplex |= Math.pow(2,icomplex);//Binary To Byte
                    }
                    if (bycomplex>0) {
                        DataBuffer[iIndex] = 0xe0;//Binary To Byte
                        DataBuffer[iIndex] += bycomplex;//Binary To Byte
                        iAltGrCount++;
                    }
                break;
            }
        }

        return DataBuffer;
    }
    KeyAssignToData(dev, KeyAssignData) {
        //var DataBuffer = Buffer.alloc(264);//104KeyData
        var DataBuffer = JSON.parse(JSON.stringify(dev.Buttoninfo_Default));
        //return DataBuffer;
        var iMacroCount = 0;
        for(var i = 0; i < KeyAssignData.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
            var Temp_BtnList = KeyAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case "SingleKey"://Keyboard Function/Combination Key
                    var KeyCode = 0;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x01;//key matrix type-0x01: Normal key
                    DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data

                    var arrcomplex=[Temp_BtnList.Ctrl,Temp_BtnList.Shift,Temp_BtnList.Alt,Temp_BtnList.Windows,Temp_BtnList.hasFNStatus];

                    var bycomplex = 0;
                    for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
                        if (arrcomplex[icomplex] == true)
                            bycomplex |= Math.pow(2,icomplex);//Binary To Byte
                    }
                    if (bycomplex > 0 || Temp_BtnList.AltGr) {
                        DataBuffer[iIndex] = 0xe0;//Binary To Byte
                        DataBuffer[iIndex] += bycomplex;//Binary To Byte
                    }
                break;
                case "MOUSE"://MOUSE Function
                    var KeyCode = 0;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x09;//Mouse Function
                    DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data
                break;
                case "KEYBOARD"://KEYBOARD Function
                    var KeyCode = 0;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x08;//Keyboard Function
                    DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data
                break;
                case "Multimedia"://Multimedia Function
                    var KeyCode = 0;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            //KeyCode = SupportData.AllFunctionMapping[iMap].hidMap[1];
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x03;//key matrix type-0x03: Consumer key
                    DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data
                break;
                case "LaunchProgram"://LaunchProgram Function
                case "LaunchWebsite"://LaunchWebsite Function
                    DataBuffer[iIndex] = 0x07;//key matrix type-0x04: Launch Program
                    DataBuffer[dev.KeyMatrixLength + iIndex] = 0x00;//key matrix data
                    break;
                case "Shortcuts"://Shortcuts Function
                    var KeyCode = 0;
                    var KeyValue;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            //KeyCode = SupportData.AllFunctionMapping[iMap].hidMap[1];
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            KeyValue = SupportData.AllFunctionMapping[iMap].value;
                            break;
                        }
                    }
                    if (KeyValue == "Explorer") {//Win+E
                        var bycomplex = 0;
                        bycomplex |= Math.pow(2,3);//Byte 3 To Binary 11
                        DataBuffer[iIndex] = 0xe0;
                        DataBuffer[iIndex] += bycomplex;//key data Win
                        DataBuffer[dev.KeyMatrixLength + iIndex] = 0x08;//key data E
                    }else{
                        DataBuffer[iIndex] = 0x03;//key matrix type-0x03: Consumer key
                        DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data
                    }
                break;
                case "MacroFunction"://MacroFunction Function
                    DataBuffer[iIndex] = 0x05;//key matrix type-0x05: Macro
                    DataBuffer[dev.KeyMatrixLength + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
                break;
                case "Disable"://Disable
                    DataBuffer[iIndex] = 0x01;//key matrix type-0x01: Normal key
                    DataBuffer[dev.KeyMatrixLength + iIndex] = 0x00;//key matrix data
                break;
                default:
                break;
            }
        }
        return DataBuffer;
    }

    KnobAssignToData(dev, KnobAssignData,DataBuffer) {
        var Matrix_Knob = ["Knobleft","KnobRight"];

        //--Define that turn UI Data into Knob HidData--
        var KnobFuncMapping = [
            {BindCodeName:'Scroll_APP', HidType:0xe4, HidData:0x29},//Scroll Through Active Applications:ALT+ESC

            {BindCodeName:'brightness_UP', HidType:0xf0, HidData:0x1a},//brightness UP:FN+W
            {BindCodeName:'brightness_DOWN', HidType:0xf0, HidData:0x16},//brightness DOWN:FN+S
            {BindCodeName:'Windows_Zoom_In', HidType:0xe1, HidData:0x2E},//Windows Zoom In:Ctrl+"+"
            {BindCodeName:'Windows_Zoom_Out', HidType:0xe1, HidData:0x2D},//Windows Zoom In:Ctrl+"-"
            {BindCodeName:'Video_Scrub_Forward', HidType:0xe1, HidData:0x4f},//Video Scrubbing Forward:Ctrl+Right
            {BindCodeName:'Video_Scrub_Backward', HidType:0xe1, HidData:0x50},//Video Scrubbing Back:Ctrl+Left

            {BindCodeName:'Mouse_Scroll_Up', HidType:0x09, HidData:0x06},//Mouse_Scroll_Up
            {BindCodeName:'Mouse_Scroll_Down', HidType:0x09, HidData:0x07},//Mouse_Scroll_Down
            {BindCodeName:'Mouse_Scroll_Right', HidType:0x09, HidData:0x08},//Mouse_Scroll_Right
            {BindCodeName:'Mouse_Scroll_Left', HidType:0x09, HidData:0x09},//Mouse_Scroll_Left

            {BindCodeName:'Mouse_Movement_Up', HidType:0x0b, HidData:0x01},//Mouse_Movement_Up
            {BindCodeName:'Mouse_Movement_Down', HidType:0x0b, HidData:0x02},//Mouse_Movement_Down
            {BindCodeName:'Mouse_Movement_Left', HidType:0x0b, HidData:0x03},//Mouse_Movement_Left
            {BindCodeName:'Mouse_Movement_Right', HidType:0x0b, HidData:0x04},//Mouse_Movement_Right

            {BindCodeName:'Audio_Device_Prev', HidType:0x07, HidData:0x0f},//Audio_Device_Prev(LaunchProgram Function)
            {BindCodeName:'Audio_Device_Next', HidType:0x07, HidData:0x0f},//Audio_Device_Next(LaunchProgram Function)

            {BindCodeName:'Microphone_Down', HidType:0x07, HidData:0x0f},//Microphone_Down(LaunchProgram Function)
            {BindCodeName:'Microphone_Up', HidType:0x07, HidData:0x0f},//Microphone_Up(LaunchProgram Function)
        ];


        for(var i = 0; i < KnobAssignData.length; i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(Matrix_Knob[i]);
            var Temp_BtnList = KnobAssignData[i];

            switch (Temp_BtnList.recordBindCodeType) {
                case "SingleKey"://Keyboard Function/Combination Key
                    var KeyCode = 0;
                    for(var iMap=0; iMap<SupportData.AllFunctionMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code){
                            KeyCode = SupportData.AllFunctionMapping[iMap].hid as number;
                            break;
                        }
                    }
                    DataBuffer[iIndex] = 0x01;//key matrix type-0x01: Normal key
                    DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;//key matrix data

                    var arrcomplex=[Temp_BtnList.Ctrl,Temp_BtnList.Shift,Temp_BtnList.Alt,Temp_BtnList.Windows,Temp_BtnList.hasFNStatus];

                    var bycomplex = 0;
                    for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
                        if (arrcomplex[icomplex] == true)
                            bycomplex |= Math.pow(2,icomplex);//Binary To Byte
                    }
                    if (bycomplex > 0 || Temp_BtnList.AltGr) {
                        DataBuffer[iIndex] = 0xe0;//Binary To Byte
                        DataBuffer[iIndex] += bycomplex;//Binary To Byte
                    }
                break;
                case "Shortcuts"://Shortcuts Function

                    for(var iMap=0; iMap<KnobFuncMapping.length; iMap++){
                        if(Temp_BtnList.recordBindCodeName == KnobFuncMapping[iMap].BindCodeName){
                            DataBuffer[iIndex] = KnobFuncMapping[iMap].HidType;//Knob key Type
                            DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData;//Knob key Data
                            if (KnobFuncMapping[iMap].HidType == 0x07) {//Knob Left-0x0f,Knob Right-0x10
                                DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData + i;//Knob key Data
                            }
                            break;
                        }
                    }

                break;
                case "Disable"://Disable
                    DataBuffer[iIndex] = 0x01;//key matrix type-0x01: Normal key
                    DataBuffer[dev.KeyMatrixLength + iIndex] = 0x00;//key matrix data
                break;
                default:
                break;
            }
        }
        return DataBuffer;
    }
    SetLEDEffect(dev, Obj, callback) {
        env.log('valueASeries','SetLEDEffect','Begin')
        try{
            var ObjTypeData = {iProfile :Obj.iProfile,iLayerIndex :Obj.iLayerIndex,Data:Obj.LightingData};
            var ObjEffectData = {iProfile :Obj.iProfile,iLayerIndex :Obj.iLayerIndex,Data:Obj.LightingData};

            this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
                this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
                    //var T_data = Obj.Perkeylist.filter(function (item, index, array) {
                    //    if (item.SN == dev.BaseInfo.SN) {
                    //        return item;//回傳符合條件的
                    //    }
                    //});
                    //if(T_data.length<1){
                    //    callback("SetLEDEffect Done");
                    //    return;
                    //}
                    var ObjLayoutData = {
                        iProfile :Obj.iProfile,
                        iLayerIndex :Obj.iLayerIndex,
                        PerKeyData:Obj.LightingPerKeyData,
                        //Perkeylist:T_data
                    };
                    //this.SetLEDLayoutToDevice(dev, ObjLayoutData, function(){
                        callback("SetLEDEffect Done");
                    //});
                });
            });
        } catch(e) {
            env.log('valueASeries','SetLEDEffect',`Error:${e}`);
        }
    }
    SetLEDEffectToDevice(dev, ObjEffectData, callback) {
        try{
            var Data = Buffer.alloc(264);
            var iEffect =  this.arrLEDType.indexOf(ObjEffectData.Data.value);
            if (iEffect == -1)
                iEffect = 0;
            //-----------------Wired-Mouse------------------
            Data[0] = 0x07;
            Data[1] = 0x02;
            Data[2] = iEffect;//Led_Type
            Data[8] = 20-ObjEffectData.Data.speed *19/100;//Run_Speed(Rate) Range:0~20
            //For valueB Wireless
            Data[9] = ObjEffectData.Data.brightness*20/100;//LED_BR     Range:0~20(New FW)

            if (ObjEffectData.Data.Multicolor_Enable == true) {
                Data[10] = ObjEffectData.Data.Multicolor;//Multicolor
            }
            if (iEffect == 13 || ObjEffectData.Data.PointEffectName == 'Rainbow') {
                Data[12] = 1;//Wave Dir ---> Up
            }

            Data[15] = ObjEffectData.Data.colorPickerValue[0];//COLOR_R
            Data[16] = ObjEffectData.Data.colorPickerValue[1];//COLOR_G
            Data[17] = ObjEffectData.Data.colorPickerValue[2];//COLOR_B
            //For valueB Wireless
            Data[18] = ObjEffectData.Data.brightness*20/100;//LED_BR_Wireless     Range:0~20(New FW)

            this.SetFeatureReport(dev, Data,100).then(function () {
                callback("SetLEDEffectToDevice Done");
            });
        } catch(e) {
            env.log('valueASeries','SetLEDEffectToDevice',`Error:${e}`);
        }
    }
    SetLEDTypeToDevice(dev, ObjEffectData, callback) {
        try{
            var Data = Buffer.alloc(264);
            var iEffect =  this.arrLEDType.indexOf(ObjEffectData.Data.value);
            if (iEffect == -1)
                iEffect = 0;
            //-----------------Wired-Mouse------------------
            Data[0] = 0x07;
            Data[1] = 0x07;
            Data[2] = ObjEffectData.iProfile+1;
            Data[3] = ObjEffectData.iLayerIndex+1;
            Data[4] = iEffect;//Led_Type
            Data[5] = 0x00;//Win_Lock
            Data[6] = 0x01;//PerKey_sw
            Data[7] = dev.deviceData.sideLightSwitch ? 0 : 1;//Cap_Lock
            //Data[8] = ObjEffectData.Data.brightness*20/100;//LED_BR     Range:0~20(New FW)
            //Data[8] = 0;//LED_BR     Range:0~20(Old FW)

            if (ObjEffectData.Data.inputLatency != undefined) {
                Data[10] = ObjEffectData.Data.inputLatency;
            }
            Data[11] = 0xff;//Sleep Time

            this.SetFeatureReport(dev, Data,100).then(function () {
                callback("SetLEDTypeToDevice Done");
            });
        } catch(e) {
            env.log('valueASeries','SetLEDTypeToDevice',`Error:${e}`);
        }
    }

    SetLEDLayoutToDevice(dev, ObjLayoutData, callback) {
        try{
            //-------Search Layout Data----------
            var PerKeyContent = this.SearchPerKeyContent(dev,ObjLayoutData);
        
            if (PerKeyContent == undefined) {//PerKeyContent Not Macth So Cancel
                callback("SetLEDLayoutToDevice Failed");
                env.log('valueASeries','SetLEDEffectToDevice',"Failed");
                return;
            }
            var Data = Buffer.alloc(264);
            var DataBuffer = this.LayoutToData(dev, ObjLayoutData);

            /**
             * Print Log for the current Profile and Layer
             */
            // var icurprofileindex = dev.deviceData.profileLayerIndex[dev.deviceData.profileindex];
            // if (dev.deviceData.profileindex == ObjLayoutData.iProfile && icurprofileindex == ObjLayoutData.iLayerIndex) {
            //     //Print devicename into env logs
            //     env.log("valueASeries-"+dev.BaseInfo.devicename,"SetLEDLayoutToDevice DataBuffer: ",JSON.stringify(DataBuffer));
            // }
            //-----------------Wired-Mouse------------------
            Data[0] = 0x07;
            Data[1] = 0x06;
            Data[2] = ObjLayoutData.iProfile+1;
            Data[3] = ObjLayoutData.iLayerIndex+1;
            //Data[4] = 83;//KeyNumber

            //-------Search Layout Data----------
            var brightness = PerKeyContent.lightData.brightness*20/100;//Perkey_BR     Range:0~20
            Data[5] = brightness;

            var iLayerCount;
                iLayerCount = 3;

            const SetAp = (j) => {
                if (j < iLayerCount) {
                    Data[4] = j; //Page Number
                    for (var k = 0; k < 220; k++)
                        Data[8 + k] = DataBuffer[220 * j + k];

                    this.SetFeatureReport(dev, Data,100).then(function () {
                        SetAp(j + 1);
                    });

                } else {
                    callback("SetLEDLayoutToDevice Done");
                }
            };
            SetAp(0);
        } catch(e) {
            env.log('valueASeries','SetLEDLayoutToDevice',`Error:${e}`);
            callback("SetLEDLayoutToDevice Done");
        }
    }

    LayoutToData(dev, ObjLayoutData) {
        var DataBuffer = Buffer.alloc(1000);
        //-------Search Layout Data----------
        var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
        var PerKeyContent;
        for (var i=0;i < ObjLayoutData.Perkeylist.length;i++) {
            if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value)
            && dev.BaseInfo.SN == ObjLayoutData.Perkeylist[i].SN)
            {
                PerKeyContent = ObjLayoutData.Perkeylist[i].content;
                break;
            }
        }
        if (PerKeyContent == undefined)
            return DataBuffer;
        /**
         * Print Log for the current Profile and Layer
         */
        // var icurprofileindex = dev.deviceData.profileLayerIndex[dev.deviceData.profileindex];
        // if (dev.deviceData.profileindex == ObjLayoutData.iProfile && icurprofileindex == ObjLayoutData.iLayerIndex) {
        //     env.log("valueASeries-"+dev.BaseInfo.devicename,"LayoutToData : ",JSON.stringify(PerKeyContent));
        // }
        //-------Set To Data----------
        for (var i = 0;i < PerKeyContent.AllBlockColor.length;i++) {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
            //var RgbData = this.hexToRgb(PerKeyContent.colorArr[i]);
            var RgbData = PerKeyContent.AllBlockColor[i].color;
            var strAry;
            var visible = 0xff;
            //RGBA
            RgbData = PerKeyContent.AllBlockColor[i].color;
            if(PerKeyContent.AllBlockColor[i].breathing && PerKeyContent.AllBlockColor[i].clearStatus) {
                visible = 0xfe;//Perkey Breathing Mode
            }else if (PerKeyContent.AllBlockColor[i].clearStatus) {
                visible = 0xff;
            }else{
                visible = 0x00;
            }
            DataBuffer[iIndex*5+0] = visible;//KO_BR:00:Off,0xff:lighting,1~254:Breath
            DataBuffer[iIndex*5+1] = iIndex;//KeyMap Index
            DataBuffer[iIndex*5+2] = RgbData[0];
            DataBuffer[iIndex*5+3] = RgbData[1];
            DataBuffer[iIndex*5+4] = RgbData[2];
        }
        //-------------------sideLight-------------------------
        if (PerKeyContent.lightData.sideLightColor[3] != undefined) {
            //var bSideSync = PerKeyContent.lightData.sideLightSync;
            //Sidelight Breathing setting is depending on bSideSync is on or not
            var RgbData = PerKeyContent.lightData.sideLightColor;

            //using RgbA of SideLight to choose breathing or not
            var bBreathing = RgbData[3] ? PerKeyContent.lightData.sideLightSync : false;

            for (var iside=0;iside < this.Matrix_SideLED.length;iside++){
                var visible = 0xff;
                if (parseInt(RgbData[3]) == 0) {
                    visible = 0x00;
                }else if (bBreathing){
                    visible = 0xfe;//Perkey Breathing Mode
                }
                var iIndexside = dev.Matrix_LEDCode_GMMK.indexOf(this.Matrix_SideLED[iside]);
                DataBuffer[iIndexside*5+0] = visible;//KO_BR:00:Off,0xff:lighting,1~254:Breath
                DataBuffer[iIndexside*5+1] = iIndexside;//KeyMap Index
                DataBuffer[iIndexside*5+2] = RgbData[0];
                DataBuffer[iIndexside*5+3] = RgbData[1];
                DataBuffer[iIndexside*5+4] = RgbData[2];
            }
        }
        //-------------------sideLight-------------------------
        return DataBuffer;//DataBuffer--Byte 6 to the End
    }
    //
    SetFeatureReport(dev, buf,iSleep) {
        //env.log("Gmmk3Series","SetFeatureReport",dev.BaseInfo.DeviceId)
        return new Promise((resolve, reject) => {
            // if (env.DebugMode){
            //     resolve(true);
            //     return;
            // }
            try {
                var rtnData;
                //rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x07, 264, buf);

                if(dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth"){//Bluetooth Wireless Mode
                    var DataBuffer = Buffer.alloc(264);
                    DataBuffer[0] = 0xF0;
                    DataBuffer[1] = 0xF1;
                    DataBuffer[2] = 0xF2;
                    DataBuffer[3] = 0xF3;
                    for (var i = 0; i < buf.length; i++){
                        DataBuffer[4 + i] = buf[i];
                    }
                    
                    const SetBluetooth = (j)=> 
                    {
                        //Split the 256-byte command into four sets of 64 bytes each for input
                        if (j < 4) {//
                            var Data = Buffer.alloc(264);
                            Data[0] = 0x06;
                            Data[1] = 0x55;
                        
                            for (var i = 0; i < 64; i++){
                                Data[2 + i] = DataBuffer[64 * j + i];
                            }
                            var rtnData = this.hid!.SetHidWrite(dev.BaseInfo.DeviceId,0x06, 65, Data);
                            setTimeout(function(){
                                SetBluetooth(j + 1);
                            },100);
                        } else {
                            resolve(0);
                        }
                    }
                    SetBluetooth(0);
                }else if(dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle"){//Bluetooth Wireless Mode
                    var DataBuffer = Buffer.alloc(264);
                    DataBuffer[0] = 0xE0;
                    DataBuffer[1] = 0xE1;
                    DataBuffer[2] = 0xE2;
                    DataBuffer[3] = 0xE3;
                    for (var i = 0; i < buf.length; i++){
                        DataBuffer[4 + i] = buf[i];
                    }
                    var DataCount = 0;
                    const SetDongle = (j) => {
                        //Split the 256-byte command into four sets of 64 bytes each for input
                        if (j < 4) {//   
                            //The first segment: E0, E1, E2, E3, +60 bytes.
                            //The second to fourth segments:
                            //00+63 bytes
                            //Total: 60+63+63+63 bytes
                            var DongleLength = (j == 0 ? 64 : 63);
                            var StartByte = (j == 0 ? 1 : 2);
                            this.GetDongleStatus(dev,(rtn)=> {
                                if (rtn) {
                                    var Data = Buffer.alloc(264);                        
                                    for (var i = 0; i < DongleLength; i++){
                                        Data[StartByte + i] = DataBuffer[DataCount];
                                        DataCount ++;
                                    }

                                    var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, Data);
                                    setTimeout(function(){
                                        SetDongle(j + 1);
                                    },iSleep);
                                } else {
                                    resolve(0);
                                }
                            });
                        } else {
                            resolve(0);
                        }
                    }
                    SetDongle(0);//SetDongle Loop End
                    
                }
                else
                {
                    rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x07, 264, buf);
                    setTimeout(function(){
                    if(rtnData < 8)
                        env.log("Gmmk3Series SetFeatureReport","SetFeatureReport(error) return data length : ",JSON.stringify(rtnData));
                    resolve(rtnData);
                    },iSleep);
                }
            } 
            catch(err: any) {
                env.log("Gmmk3Series Error","SetFeatureReport",`ex:${err.message}`);
                resolve(err);
            }
        });
    }
    GetFeatureReport(dev, buf,iSleep) {
        return new Promise((resolve, reject) => {
            try{
                var rtnData = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x07, 264);
                setTimeout(function(){
                    resolve(rtnData);
                },iSleep);
            }catch(err: any){
                env.log("DeviceApi Error","GetFeatureReport",`ex:${err.message}`);
                resolve(err);
            }
        });
    }
    GetDongleStatus(dev, callback) {
        try{
            var Data = Buffer.alloc(65);     
            Data[1] = 0xf7;
            var WaitCount = 5;
            const SetCheckStatus = (iTimes) =>{ 
                var rtnData = this.hid!.SetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, Data);
                setTimeout(()=>
                {
                    var rtnData1 = this.hid!.GetFeatureReport(dev.BaseInfo.DeviceId,0x00, 65, Data);
                    if (iTimes < WaitCount){
                        setTimeout(function(){
                            if (rtnData1[5] == 1){
                                callback(true);
                            }else{
                                env.log("Gmmk3Series","GetDongleStatus","waitForPair- times:"+iTimes);
                                SetCheckStatus(iTimes+1);
                            }
                        },15);
                    }else{
                        callback(false);
                    }
                },10);
            }
            SetCheckStatus(0);

        }catch(err){
            env.log("DeviceApi Error","GetDongleStatus",`ex:${(err as any).message}`);
            callback(err);
        }
    }

    ////////////////////RGB SYNC////////////////////////////
    //#region RGBSYNC
    SetLEDMatrix(dev, Obj) {
        var DataBuffer = Buffer.alloc(512);
        if (dev.m_bSetHWDevice || !dev.m_bSetSyncEffect){
            return;
        }

        for(var i = 0; i < dev.Matrix_KEYButtons.length; i++)
        {
            var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);//Default:104 Keys
            DataBuffer[0  +iIndex] = Obj.Buffer[i][0];//Number 1-Red
            DataBuffer[140+iIndex] = Obj.Buffer[i][1];//Number 1-Green
            DataBuffer[280+iIndex] = Obj.Buffer[i][2];//Number 2-Blue
        }

        var Obj3 = {
            DataBuffer: DataBuffer
        }
        this.SendLEDData2Device(dev, Obj3).then(function() {
        });
    }

    SendLEDData2Device(dev, Obj) {
        var Data = Buffer.alloc(264);
        var DataBuffer = Obj.DataBuffer;
        //-----------------------------------
        return new Promise<void>((resolve) => {
            const SetAp = (j) => {
                if (j < 3) {
                    Data = Buffer.alloc(264);
                    Data[0] = 0x07;
                    Data[1] = 0x10;
                    Data[2] = j+1; //If Num=1, there will be 120 R. If Num = 2, there will be 120 G.If Num = 3, there will be 120 B.

                    for (var i = 0; i < 140; i++)
                        Data[8 + i] = DataBuffer[140 * j + i];
                        this.SetFeatureReport(dev, Data, 5).then(() =>  {
                            SetAp(j + 1);
                        });
                } else {
                    resolve();
                }
            }
            SetAp(0);
        });
        // //-----------------------------------
    }
    //#endregion RGBSYNC

}

module.exports = Gmmk3Series;
