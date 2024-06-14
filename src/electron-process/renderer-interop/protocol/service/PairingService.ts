import EventEmitter from "events";
import { env } from "../../others/env";
import { AppDB } from "../../dbapi/AppDB";

export class PairingService extends EventEmitter 
{
    static #instance?: PairingService;
    nedbObj: AppDB;
    SupportDevice: any;

    constructor() {
        env.log('PairingService','PairingService class','begin');
        super();
        
        this.nedbObj = AppDB.getInstance();
        this.GetSupportDevice();
    }
    static getInstance() {
        if (this.#instance) {
            env.log('PairingService', 'getInstance', `Get exist Device() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('PairingService', 'getInstance', `New Device() INSTANCE`);
            this.#instance = new PairingService();
            
            return this.#instance;
        }
    }
    /**
     * get data from SupportDeviceDB
     */
    GetSupportDevice(callback?) {
        this.nedbObj.getSupportDevice().then((data)=>{ 
            this.SupportDevice = data;
            callback();
        });
    }
}