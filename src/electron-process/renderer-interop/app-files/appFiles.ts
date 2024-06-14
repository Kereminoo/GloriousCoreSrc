import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { AppPaths, getDataFilePath } from './appPaths';

export const readUserDataFile = (fileName: string): Buffer => readFileSync(getDataFilePath(fileName));

const createFolderIfNotExists = (folderPath: string): void => {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
    }
};

export const createAppFolders = (): void => 
{
    createFolderIfNotExists(AppPaths.UserDataFolder);
    createFolderIfNotExists(AppPaths.DataFolder);
    createFolderIfNotExists(AppPaths.LogsFolder);
    createFolderIfNotExists(AppPaths.DownloadsFolder);
    createFolderIfNotExists(AppPaths.TempFolder);
};
