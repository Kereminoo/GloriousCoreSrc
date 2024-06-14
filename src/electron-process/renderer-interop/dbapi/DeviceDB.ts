import { DBNames } from "../app-files/dbFiles";
import { env } from "../others/env";
import { queryCmd, insertCmd, updateCmd } from "./lib/neDB";

export class DeviceDB {
    /**
     * get data from SupportDeviceDB
     */
    getSupportDevice(): Promise<any[]> {
        return queryCmd(DBNames.SupportDevice, {});
    }
    /**
     * get Default data from SupportDeviceDB
     * @param {*} vid
     * @param {*} pid
     */
    async getDefaultProfile(vid: string, pid: string): Promise<any> {
        const docs = await queryCmd(DBNames.SupportDevice, { vid, pid });
        return docs[0];
    }
    /**
     * get data from DeviceDB
     * @param {*} SN
     */
    async getDevice(SN: string): Promise<any> {
        const docs = await queryCmd(DBNames.DeviceDB, { SN });
        env.log(DBNames.DeviceDB, 'getDevice', 'queryCmd Done');
        return docs[0];
    }
    /**
     * get all data from DeviceDB
     */
    async getAllDevice(): Promise<any[]> {
        const docs = await queryCmd(DBNames.DeviceDB, {});
        console.log('getAllDevice', docs);
        return docs;
    }
    /**
     * add data to DeviceDB
     * @param {*} obj
     */
    AddDevice(obj: any): Promise<any> {
        return insertCmd(DBNames.DeviceDB, obj);
    }
    /**
     * update data to device
     * @param {*} SN
     * @param {*} obj
     */
    updateDevice(SN: string, obj: any): Promise<any> {
        return updateCmd(DBNames.DeviceDB, { SN }, obj);
    }
}
