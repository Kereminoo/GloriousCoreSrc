import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { env } from '../others/env';
import { getDataFilePath, getDBResourceFilePath } from "./appPaths";
import { copyAppFile } from './helpers';
import { AppPaths } from './appPaths';

export const enum DBNames {
    SupportDevice = 'SupportDevice',
    AppSettingDB = 'AppSettingDB',
    PluginDB = 'PluginDB',
    MacroDB = 'MacroDB',
    DeviceDB = 'DeviceDB',
    LayoutDB = 'LayoutDB',
    SocialDB = 'SocialDB',
    EQDB = 'EQDB',
};

export const enum DBFiles {
    SupportDevice = `${DBNames.SupportDevice}.db`,
    AppSettingDB = `${DBNames.AppSettingDB}.db`,
    PluginDB = `${DBNames.PluginDB}.db`,
    MacroDB = `${DBNames.MacroDB}.db`,
    DeviceDB = `${DBNames.DeviceDB}.db`,
    LayoutDB = `${DBNames.LayoutDB}.db`,
    SocialDB = `${DBNames.SocialDB}.db`,
    EQDB = `${DBNames.EQDB}.db`,
};


export const copyDBResourceFile = (fileName: DBFiles, destinationPath: string): void => {
    const sourceFile = getDBResourceFilePath(fileName);
    const destFile = join(destinationPath, fileName);
    copyAppFile(sourceFile, destFile);
};

export const copyDBResourceFileContentInto = (fileName: DBFiles, destinationFilePath: string) => {
    copyAppFile(getDBResourceFilePath(fileName), destinationFilePath);
};

export const copyDBResourceFileToDataFolder = (dbFileName: DBFiles): void => {
    copyDBResourceFile(dbFileName, AppPaths.DataFolder);
};

export const refreshSupportAndPluginsDB = (): void => {
    env.log('electron', 'data', 'Refreshing Support data');
    copyDBResourceFileToDataFolder(DBFiles.SupportDevice);

    env.log('electron', 'data', 'Refreshing Plugin data');
    copyDBResourceFileToDataFolder(DBFiles.PluginDB);
};

export const copyDBDataFileIfNotExists = (dbFile: DBFiles): Boolean => {
    if (existsSync(getDataFilePath(dbFile))) {
        return false;
    }
    env.log('electron', 'data', `No ${dbFile} found. Creating User ${dbFile}.`);
    copyDBResourceFileToDataFolder(dbFile);
    return true;
};

