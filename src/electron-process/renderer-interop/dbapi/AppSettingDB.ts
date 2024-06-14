import { DBNames } from "../app-files/dbFiles";
import { queryCmd, updateCmd } from "./lib/neDB";

export class AppSettingDB {
    /**
     * get appsetting data from AppsettingDB
     */
    getAppSetting(): Promise<any> {
        return queryCmd(DBNames.AppSettingDB, {});
    }
    /**
     * save appsetting data to AppsettingDB
     * @param {*} obj
     */
    saveAppSetting(obj: any): Promise<any> {
        return updateCmd(DBNames.AppSettingDB, { "_id": "5Cyd2Zj4bnesrIGK" }, obj);
    };
}
