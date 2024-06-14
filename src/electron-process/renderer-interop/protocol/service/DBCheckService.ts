import EventEmitter from "events";
import { env } from "../../others/env";
import { AppDB } from "../../dbapi/AppDB";


export class DBCheckService extends EventEmitter {
    static #instance?: DBCheckService;

    AppDB: AppDB;

    constructor(AppDB) 
    {
        super();
        
        this.AppDB = AppDB;
    }
    static getInstance(AppDB) {
        if (this.#instance) {
            env.log('DBCheckService', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('DBCheckService', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new DBCheckService(AppDB);
            
            return this.#instance;
        }
    }
    /**
     * get data from SupportDeviceDB
     */
    CheckDevicedata(callback) {
        this.AppDB.getSupportDevice().then((arrSupportDevicedata)=>{ 
            this.AppDB.getAllDevice().then((result) => {
                const arrDevicedata = result as any[];
                if(arrDevicedata) {
                    for (let index = 0; index < arrDevicedata.length; index++) {
                        var SupportDevicedata;
                        for (let index2 = 0; index2 < arrSupportDevicedata.length; index2++) {
                            var SupportSN = arrSupportDevicedata[index2].vid[0] + arrSupportDevicedata[index2].pid[0];
                            if (SupportSN == arrDevicedata[index].SN) {
                                SupportDevicedata = arrSupportDevicedata[index2];
                                break;
                            }
                        }
                        if (this.KeybindingCheck(SupportDevicedata,arrDevicedata[index])) {
                            this.AppDB.updateDevice(arrDevicedata[index].SN, arrDevicedata[index]);
                        }
                    }
                }
                callback();
            });
        });

    }
    /**
     * get data from SupportDeviceDB
     */
    KeybindingCheck(SupportDevicedata,Devicedata) {
        if (Devicedata.SN == '0x22D40x1503') {//Model I
            //Obj is ready to be dev.deviceData
            if (Devicedata.profile[0].keybindingLayerShift == undefined) {
                for (let i = 0; i < Devicedata.profile.length; i++) {
                    Devicedata.profile[i].keybindingLayerShift = SupportDevicedata.defaultProfile[i].keybindingLayerShift;
                }
                return true;
            }
            return false;
        }else{
            return false;
        }
    }
}