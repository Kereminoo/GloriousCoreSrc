import { PluginDeviceRecord } from "../../../common/data/records/plugin-device.record";
import { PluginDevices } from "../../../common/data/types/plugin-devices.type";
import { DBNames } from "../app-files/dbFiles";
import { updateCmd, queryCmd } from "./lib/neDB";
import { AppSettingDB } from "./AppSettingDB";
import { DeviceDB } from "./DeviceDB";
import { EQDB } from "./EQDB";
import { MacroDB } from "./MacroDB";
import { PluginDB } from "./PluginDB";
import { SocialDB } from "./SocialDB";


export class AppDB {
    static #instance?: AppDB;

    DeviceDB: DeviceDB;
    AppSettingDB: AppSettingDB;
    MacroDB: MacroDB;
    EQDB: EQDB;
    PluginDB: PluginDB;
    SocialDB: SocialDB;

    constructor() {
        this.DeviceDB = new DeviceDB();
        this.AppSettingDB = new AppSettingDB();
        this.MacroDB = new MacroDB();
        this.EQDB = new EQDB();
        this.PluginDB = new PluginDB();
        this.SocialDB = new SocialDB();
    }
    static getInstance() {
        if (!this.#instance) {
            console.log("new AppDB Class");
            this.#instance = new AppDB();
        }
        return this.#instance;
    }

    //----------------------------Plugin--------------------------------//
    getPluginDevice(): Promise<PluginDevices[] | undefined> {
        return this.PluginDB.getPluginDevice();
    }

    updatePluginDevice(obj: any): Promise<any> {
        return this.PluginDB.updatePluginDevice(obj);
    }

    updateAllPluginDevice(obj){
        return this.PluginDB.updateAllPluginDevice(obj);
    };

    //----------------------------AppSetting----------------------------//
    getAppSetting() {
        return this.AppSettingDB.getAppSetting();
    };

    saveAppSetting(obj) {
        return this.AppSettingDB.saveAppSetting(obj);
    };

    getSupportDevice(): Promise<any[]> {
        return this.DeviceDB.getSupportDevice();
    };

    // setSupportDevice_defaultProfile_test(_id: any, obj: any): Promise<any> {
    //     console.log('setSupportDevice_defaultProfile_test', _id, obj);
    //     return updateCmd(DBNames.SupportDevice, { _id }, { defaultProfile: obj });
    // }

    getDefaultProfile(vid: any, pid: any): Promise<any> {
        return this.DeviceDB.getDefaultProfile(vid, pid);
    }

    getDevice(sn: any): Promise<any> {
        return this.DeviceDB.getDevice(sn);
    }

    AddDevice(obj: any): Promise<any> {
        return this.DeviceDB.AddDevice(obj);
    }

    getAllDevice(): Promise<any> {
        return this.DeviceDB.getAllDevice();
    }

    updateDevice(_id: any, obj: any): Promise<any> {
        return this.DeviceDB.updateDevice(_id, obj);
    }

    //----------------------------Macro----------------------------//
    getMacro(): Promise<any> {
        return this.MacroDB.getMacro();
    }

    getMacroById(id: any): Promise<any> {
        return this.MacroDB.getMacroById(id);
    }

    insertMacro(obj: any): Promise<any> {
        return this.MacroDB.insertMacro(obj);
    }

    DeleteMacro(index: any): Promise<any> {
        return this.MacroDB.deleteMacro(index);
    }

    updateMacro(id: any, obj: any): Promise<any> {
        return this.MacroDB.updateMacro(id, obj);
    }

    //----------------------------EQ----------------------------//
    getEQ(): Promise<any> {
        return this.EQDB.getEQ();
    }

    getEQById(id: any): Promise<any> {
        return this.EQDB.getEQById(id);
    }

    insertEQ(obj: any): Promise<any> {
        return this.EQDB.insertEQ(obj);
    }

    DeleteEQ(index: any): Promise<any> {
        return this.EQDB.deleteEQ(index);
    }

    updateEQ(id: any, obj: any): Promise<any> {
        return this.EQDB.updateEQ(id, obj);
    }

    //----------------------------Layout----------------------------//
    getLayout(): Promise<any> {
        return queryCmd(DBNames.LayoutDB, {});
    }

    getLayoutAssignField(compareData: any): Promise<any> {
        return queryCmd(DBNames.LayoutDB, compareData);
    }

    updateLayoutAlldata(compareData: any, obj: any): Promise<any> {
        return updateCmd(DBNames.LayoutDB, compareData, { "AllData": obj });
    }

    //----------------------------Social----------------------------//

    updateSocial(SocialId: any, SocialType: any, obj: any): Promise<any> {
        // return this.SocialDB.updateSocial(SocialId, SocialType, obj);
    }

    getSocial(SocialId: any, SocialType: any): Promise<any> {
        return this.SocialDB.getSocial(SocialId, SocialType);
    }

    getSocialType(SocialType: any): Promise<any> {
        return this.SocialDB.getSocialType(SocialType);
    }

    AddSocial(obj: any): Promise<any> {
        return this.SocialDB.addSocial(obj);
    }
}

export const AppObj = new AppDB();
