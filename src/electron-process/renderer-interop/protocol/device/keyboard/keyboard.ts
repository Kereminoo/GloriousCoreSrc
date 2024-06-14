import { EventTypes } from "../../../../../common/EventVariable";
import { env } from "../../../others/env";
import { Device } from "../Device";


export class Keyboard extends Device
{
    static #instance: Keyboard;

    setDeviceDataCallback: (() => any)|null = null;

    constructor() {
        env.log('Keyboard','Keyboardclass','begin');
        super();
    }

    static getInstance(hid?: any, AudioSession?: any) {
        if (this.#instance) {
            env.log('Keyboard', 'getInstance', `Get exist Keyboard() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('Keyboard', 'getInstance', `New Keyboard() INSTANCE`);
            this.#instance = new Keyboard();

            return this.#instance;
        }
    }

    /**
     * init Keyboard Device
     * @param {*} dev  device Info
     */
    initDevice(dev) {
        try{
            return new Promise<void>((resolve, reject) => {
                this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
                    //env.log('Keyboard' , 'getDevice-exist:' , JSON.stringify(exist) );
                    if(exist) {
                        dev.deviceData = exist;
                        //-------------Detect Bootloader-----------------
                        var StateID = dev.BaseInfo.StateID;
                        if(dev.BaseInfo.StateType[StateID] == "Bootloader"){
                            resolve();
                            return;
                        }
                        //-------------Detect Bootloader-----------------
                        this.InitialDevice(dev,0,() => {

                            resolve();
                        });
                    } else {
                        this.SaveProfileToDevice(dev, (data) => {
                            //-------------Detect Bootloader-----------------
                            var StateID = dev.BaseInfo.StateID;
                            if(dev.BaseInfo.StateType[StateID] == "Bootloader"){
                                resolve();
                                return;
                            }
                            //-------------Detect Bootloader-----------------
                            dev.deviceData = data;
                            this.InitialDevice(dev,0,() => {
                                resolve();
                            });
                        });
                    }
                });
            });
        } catch(e) {
            env.log('Device:' + dev.BaseInfo.devicename,'initDevice',`Error:${e}`);
        }
    }

    /**
     * Save Device data to DB
     * @param {*} dev
     * @param {*} callback
     */
    SaveProfileToDevice(dev, callback) {
        env.log('Device', 'SaveProfileToDevice', `SaveProfileToDevice`);
        var BaseInfo = dev.BaseInfo;
        var obj = {
            vid: BaseInfo.vid,
            pid: BaseInfo.pid,
            SN: BaseInfo.SN,
            devicename: BaseInfo.devicename,
            ModelType: BaseInfo.ModelType,
            image: BaseInfo.img,
            battery: BaseInfo.battery,
            layerMaxNumber: BaseInfo.layerMaxNumber,
            profile: BaseInfo.defaultProfile,
            profileLayerIndex:  BaseInfo.profileLayerIndex,
            sideLightSwitch: BaseInfo.sideLightSwitch,
            profileLayers: BaseInfo.profileLayers,
            profileindex: 0
        }
        this.nedbObj.AddDevice(obj).then(()=>{
            callback(obj)
        })
    }

    /*
Keyboards:
GMMK Numpad: 0x320F0x5088
GMMK PRO: 0x320F0x5044 (alternate board: 0x320F0x5092)
GMMK PRO ISO: 0x320F0x5046 (alternate board: 0x320F0x5093)
GMMK v2 65 ISO: 0x320F0x504A
GMMK v2 65 US: 0x320F0x5045
GMMK v2 96 ISO: 0x320F0x505A
GMMK v2 96 US: 0x320F0x504B

valueA valueB: TODO
valueA valueD: TODO
valueA valueC 65% Wireless ANSI: 0x342D0xE3D7
valueA valueC 75% Wireless ANSI: 0x342D0xE3D8
valueA valueC 100% Wireless ANSI: 0x342D0xE3D9
valueA valueC 65% ANSI: 0x342D0xE3DA
valueA valueC 75% ANSI: 0x342D0xE3DB
valueA valueC 100% ANSI: 0x342D0xE3DC
valueA valueC 65% Wireless ISO: 0x342D0xE3EC
valueA valueC 75% Wireless ISO: 0x342D0xE3ED
valueA valueC 100% Wireless ISO: 0x342D0xE3EE
valueA valueC 65% ISO: 0x342D0xE3EF
valueA valueC 75% ISO: 0x342D0xE3F0
valueA valueC 100% ISO: 0x342D0xE3F1
valueA valueD HE 65% ANSI: 0x342D0xE3DD
valueA valueD HE 65% ISO: 0x342D0xE3F2
valueA valueD HE 75% ANSI: 0x342D0xE3DE
valueA valueD HE 75% ISO: 0x342D0xE3F3
valueA valueD HE 100% ANSI: 0x342D0xE3DF
valueA valueD HE 100% ISO: 0x342D0xE3F4

*/

    /**
     * Switch Profile
     * @param {*} dev
     * @param {*} Obj
     * @param {*} callback
     */
    ChangeProfileID(dev,Obj, callback) {
        env.log(dev.BaseInfo.devicename,'ChangeProfileID',`${Obj}`)
        try{
            if(env.BuiltType == 1) {
                callback("ChangeProfileID Done");
                return;
            }
            var Data = Buffer.alloc(264);
            dev.deviceData.profileindex = Obj;
            var iLayerIndex = dev.deviceData.profileLayerIndex[Obj];

            Data[0] = 0x07;
            Data[1] = 0x01;
            Data[2] = Obj+1;
            Data[3] = iLayerIndex+1;
            //-----------------------------------

            const isGmmkV2 = (dev.deviceData.SN == "0x320F0x504A" //65ISO
            || dev.deviceData.SN == "0x320F0x5045" //65US
            || dev.deviceData.SN == "0x320F0x505A" //96ISO
            || dev.deviceData.SN == "0x320F0x504B" //96US
            )

            if(isGmmkV2 == true)
            {
                this.setDeviceDataCallback = callback.bind("ChangeProfileID Done");
            }
            this.SetFeatureReport(dev, Data,50).then(() => {

                // gmmk pro/numpad doesn't report profile change after setting, so we need to
                // save the profile data now.
                if(isGmmkV2 == false)
                {
                    callback("ChangeProfileID Done");
                }
                // this.setProfileToDevice(dev,() => {
                //     callback("ChangeProfileID Done");
                // })
            });
        } catch(e) {
            env.log('ModelOSeries','SetKeyMatrix',`Error:${e}`);
            callback();
        }
    }

    /**
     * Mouse change Keyboard Profile
     * @param {*} obj 1:up 2:down
     */
    ChangeProfile(dev, obj) {
        new Promise<void>((resolve,reject) =>{

            if(obj == 1)
                dev.deviceData.profileindex++;
            if(obj == 2)
                dev.deviceData.profileindex--;
            if(dev.deviceData.profileindex >= dev.deviceData.profile.length)
                dev.deviceData.profileindex = 0;
            else if(dev.deviceData.profileindex < 0)
                dev.deviceData.profileindex = dev.deviceData.profile.length-1;
            this.ChangeProfileID(dev, dev.deviceData.profileindex, (data) => {
                this.setProfileToDevice(dev, (data) => {
                    var ObjProfileIndex ={Profile:dev.deviceData.profileindex, LayerIndex:dev.deviceData.profileLayerIndex[dev.deviceData.profileindex], SN:dev.BaseInfo.SN};
                    var Obj2 = {
                        Func: EventTypes.SwitchUIProfile,
                        SN: dev.BaseInfo.SN,
                        Param: ObjProfileIndex
                    };
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                    resolve();
                });
            })
        });
    }

    /**
     * Mouse change Keyboard Layer
     * @param {*} obj 1:up 2:down
     */
    ChangeLayer(dev, obj) {
        new Promise<void>((resolve,reject) =>{

            if(obj == 1)
                dev.deviceData.profileLayerIndex[dev.deviceData.profileindex]++;
            if(obj == 2)
                dev.deviceData.profileLayerIndex[dev.deviceData.profileindex]--;
            if(dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] >= dev.deviceData.profileLayerIndex.length)
                dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] = 0;
            else if(dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] < 0)
                dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] = dev.deviceData.profileLayerIndex.length-1;
            this.ChangeProfileID(dev, dev.deviceData.profileindex, (data) => {
                this.setProfileToDevice(dev, (data) => {
                    var ObjProfileIndex ={Profile:dev.deviceData.profileindex, LayerIndex:dev.deviceData.profileLayerIndex[dev.deviceData.profileindex], SN:dev.BaseInfo.SN};
                    var Obj2 = {
                        Func: EventTypes.SwitchUIProfile,
                        SN: dev.BaseInfo.SN,
                        Param: ObjProfileIndex
                    };
                    this.emit(EventTypes.ProtocolMessage, Obj2);
                    resolve();
                });
            })
        });
    }

    /**
     * Import Profile
     * @param {*} dev
     * @param {*} obj
     * @param {*} callback
     */
    ImportProfile(dev, obj, callback) {
        let ProfileIndex = dev.deviceData.profileindex;
        var profilelist = obj.profilelist;
        env.log('DeviceApi ImportProfile','ImportProfile',JSON.stringify(obj));
        for(var i=0; i < profilelist.length; i++){
            dev.deviceData.profileLayers[ProfileIndex][i] = profilelist[i];
        }
        var Obj2 = {
            Perkeylist: obj.PERKEYlist,
            Macrolist: obj.macrolist
        };
        this.SetImportProfileData(dev,Obj2,() => {
            callback();
        });
    }

    InitialDevice(dev,Obj,callback) { throw new Error("Not Implemented"); }
    SetFeatureReport(dev, buf,iSleep): Promise<unknown> { throw new Error("Not Implemented"); }

}

module.exports = Keyboard;
