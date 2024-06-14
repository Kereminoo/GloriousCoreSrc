import { PluginDeviceRecord } from '../../../common/data/records/plugin-device.record';
import { PluginDevices } from '../../../common/data/types/plugin-devices.type';
import { queryCmd, updateCmd } from './lib/neDB';
import { DBNames } from '../app-files/dbFiles';
export class PluginDB {
    async getPluginDevice(): Promise<PluginDevices[] | undefined> {
        const docs = await queryCmd(DBNames.PluginDB, {});
        console.log('PluginDB_getPluginDevice', docs);
        if (Array.isArray(docs) && docs.length > 0) return docs;
        return;
    }

    updatePluginDevice(obj: any): Promise<any> {
        return updateCmd(DBNames.PluginDB, { id: 1 }, obj);
    }

    async updateAllPluginDevice(obj: any): Promise<any> {
        const { Keyboard, Mouse, valueE, MouseDock } = obj;
        // const docs = await queryCmd(DBNames.PluginDB, {});
        // console.log('updateAllPluginDevice', docs);
        return await updateCmd(DBNames.PluginDB, { id: 1 }, { Keyboard, Mouse, valueE, MouseDock });
    }
}
