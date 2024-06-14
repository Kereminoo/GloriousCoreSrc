import { env } from "../../../others/env";
import { Device } from "../Device";

export class Dock extends Device 
{
    static #instance: Dock;

    constructor() 
    {
        env.log('Dock','Dockclass','begin');
        super();
        
    }

    static getInstance(hid?: any) {
        if (this.#instance) {
            env.log('Dock', 'getInstance', `Get exist Dock() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('Dock', 'getInstance', `New Dock() INSTANCE`);
            this.#instance = new Dock();

            return this.#instance;
        }
    }

    /**
     * init Dock Device
     * @param {*} dev 
     */
    initDevice(dev) {
        env.log('Dock','initDevice','begin')
        return new Promise<void>((resolve, reject) => {
            this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
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
                    this.SaveProfileToDevice(dev,(data) => {
                        dev.deviceData = data;
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
                    });
                }
            })
        })
    }
    
    ImportProfile(dev, obj, callback) {
        let ProfileIndex = dev.deviceData.profileindex;
        //var profilelist = obj.profilelist;
        env.log('Dock','ImportProfile',JSON.stringify(obj));
        dev.deviceData.profile[ProfileIndex-1] = obj;
        
        this.SetImportProfileData(dev,0,() => {
            callback();
        });
    }

    InitialDevice(dev,Obj,callback) { throw new Error("Not Implemented"); }

}