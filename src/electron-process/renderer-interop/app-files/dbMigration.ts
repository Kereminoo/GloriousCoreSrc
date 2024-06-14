import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { env } from '../others/env';
import { copyAppFile, readFirstLine } from './helpers';
import { AppPaths, getDataFilePath } from './appPaths';
import { readUserDataFile } from './appFiles';
import { DBFiles,
    copyDBResourceFileContentInto, copyDBResourceFileToDataFolder,
    copyDBDataFileIfNotExists, refreshSupportAndPluginsDB
} from './dbFiles';

const getDateBeforeVersion2 = (): Date => {
    const updateYear = 2023; // 2023
    const updateMonth = 2; // March
    const updateDay = 1; // 1st
    return new Date(updateYear, updateMonth, updateDay);
};

export const migrateDeviceData = (): void => {
    try {
        env.log('electron', 'data', 'Migrating Device Data');
        // 2.0 migration
        // device.img = "image/[image-name]" -> device.image = "[image-name]"
        env.log('electron', 'data', 'Begin 2.0 Migration');
        const deviceDataText = readUserDataFile(DBFiles.DeviceDB).toString();
        const updatedText = deviceDataText.replace(/"image":"image\/(.*?)"/g, `"image": "$1"`);
        if (updatedText !== deviceDataText) {
            writeFileSync(getDataFilePath(DBFiles.DeviceDB), updatedText);
            env.log('electron', 'data', 'Completed 2.0 Migration');
        } else {
            env.log('electron', 'data', 'Device Data up to date; Skipped 2.0 Migration');
        }
    } catch (err) {
        env.log('electron', 'data', `An error occurred while updating Device Data: ${err}`);
        env.log('electron', 'data', 'Creating new device data.');
        copyDBResourceFileToDataFolder(DBFiles.DeviceDB);
    }
};

export const refreshSupportPluginsAndMigrateDeviceData = (): void => {
    refreshSupportAndPluginsDB();
    migrateDeviceData();
};

export const refreshLegacyDBFiles = async (): Promise<void> => {
    const hasDataFolder = existsSync(AppPaths.DataFolder);
    const hasUserData = existsSync(AppPaths.UserFile);

    if (!hasDataFolder) {
        mkdirSync(AppPaths.DataFolder, { recursive: true });
    }

    if (!hasUserData) {
        env.log('electron', 'data', 'No User data found. Creating User data.');
        copyDBResourceFileContentInto(DBFiles.AppSettingDB, AppPaths.UserFile);
        refreshSupportAndPluginsDB();
    }

    const supportDeviceDataFilePath = getDataFilePath(DBFiles.SupportDevice);
    const hasSupportDataFile = existsSync(supportDeviceDataFilePath);

    // // if we just set SupportData in the user data closure, we don't need to check if its updated
    // if (!hasUserData && hasSupportDataFile) {
    //     // check for 2.0 update
    //     const { birthtime } = statSync(supportDeviceDataFilePath);
    //     const updateDate = getDateBeforeVersion2();
    //     // if support db file was created before March 1st, 2023
    //     if (birthtime < updateDate) {
    //         env.log('electron', 'data', 'Device Support Data created before 2.0 update');
    //         // refresh Support and Plugin dbs because they has state data
    //         refreshSupportPluginsAndMigrateDeviceData();
    //     } else {
    //         try {
    //             env.log('electron', 'data', 'Reading first line of Device Support Data...');
    //             const data = await readFirstLine(getDataFilePath(DBFiles.SupportDevice));
    //             if (data.indexOf(`"img":"image/`) > -1) {
    //                 env.log('electron', 'data', 'Device Support Data has out of date content');
    //                 // refresh Support and Plugin dbs because they has stale data
    //                 refreshSupportPluginsAndMigrateDeviceData();
    //             }
    //         } catch (err) {
    //             env.log('electron', 'data', 'Could not read Device Support Data');
    //             // refresh Support and Plugin dbs because they has state data
    //             refreshSupportPluginsAndMigrateDeviceData();
    //         }
    //     }
    // } else if (!hasSupportDataFile || process.env.NODE_ENV !== 'production') {
    //     // refresh Support db because it is static data; overwriting it won't hurt.
    //     refreshSupportAndPluginsDB();
    // }
    
    // refresh Support db because it is static data; overwriting it won't hurt.
    refreshSupportAndPluginsDB();

    copyDBDataFileIfNotExists(DBFiles.AppSettingDB);
    copyDBDataFileIfNotExists(DBFiles.MacroDB);
    if (!copyDBDataFileIfNotExists(DBFiles.DeviceDB)) {
        migrateDeviceData();
    }
    copyDBDataFileIfNotExists(DBFiles.LayoutDB);
};
