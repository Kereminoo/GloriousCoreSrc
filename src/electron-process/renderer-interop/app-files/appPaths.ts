import { app } from 'electron';
import { is } from '@electron-toolkit/utils'
import { join, resolve } from 'node:path';
import { userInfo } from 'node:os';
import { DBFiles } from './dbFiles';

const appUserDataFolderPath = app.getPath('userData');
const userName = userInfo().username;

export const AppPaths = {
    UserDataFolder: appUserDataFolderPath,
    UserFile: join(appUserDataFolderPath, `${userName}.txt`),
    DataFolder: join(appUserDataFolderPath, 'userdata', userName, 'data'),
    LogsFolder: join(appUserDataFolderPath, 'logs'),
    DownloadsFolder: join(appUserDataFolderPath, 'downloads'),
    DBResource: is.dev
        ? resolve(__dirname, "../../src/renderer-process/public/database")
        : join(process.resourcesPath, "./public/database"),
    TempFolder: join(appUserDataFolderPath, "temp"),
}

export const getDBResourceFilePath = (fileName: DBFiles): string => join(AppPaths.DBResource, fileName);
export const getDataFilePath = (fileName: string): string => join(AppPaths.DataFolder, fileName);
export const getTempFilePath = (fileName: string): string => join(AppPaths.TempFolder, fileName);
