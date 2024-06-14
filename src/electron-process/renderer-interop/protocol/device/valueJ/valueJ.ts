import { env } from "../../../others/env";
import { Device } from "../Device";


export class valueJ extends Device {
    static instance: valueJ;

    constructor() {
        env.log('valueJ','valueJclass','begin');
        super();        
    }

    static getInstance(hid?: any, AudioSession?: any) {
        if (this.instance) {
            env.log('valueJ', 'getInstance', `Get exist valueJ() INSTANCE`);
            return this.instance;
        }
        else {
            env.log('valueJ', 'getInstance', `New valueJ() INSTANCE`);
            this.instance = new valueJ();

            return this.instance;
        }
    }

    /**
     * init valueJ Device
     * @param {*} dev 
     */
    initDevice(dev) {
        env.log('valueJ','initDevice','begin')
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
        var _this = this; 
        let ProfileIndex = dev.deviceData.profileindex;
        //var profilelist = obj.profilelist;
        env.log('valueJ','ImportProfile',JSON.stringify(obj));
        dev.deviceData.profile[ProfileIndex-1] = obj;
        
        _this.SetImportProfileData(dev,0,function () {
            callback();
        });
    }

    InitialDevice(dev,Obj,callback) { throw new Error("Not Implemented"); }
}

module.exports = valueJ;
