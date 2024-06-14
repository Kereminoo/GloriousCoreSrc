import { DownloaderHelper } from "node-downloader-helper";
import { AppPaths } from "../../app-files/appPaths";
import { env } from "../../others/env";
import EventEmitter from "events";
import { EventTypes } from "../../../../common/EventVariable";
import { IPCProgress } from "../../../../common/ipc-progress";
import AdmZip from "adm-zip";
import path from "path";
import fs from 'fs/promises';
import { shell } from "electron";

export class AppUpdateServiceClass extends EventEmitter
{
    downloadHelper?: DownloaderHelper;
    
    downloadAppUpdater(url: string)
    {
       
        return new Promise<void>((resolve, reject) =>
        {
            // let progressStats;
            const parsedUrl = url.replaceAll('%20', ' ');
            const fileName = parsedUrl.substring(parsedUrl.lastIndexOf('/'));
            this.downloadHelper = new DownloaderHelper(parsedUrl, AppPaths.DownloadsFolder, {
                override: true,
                fileName
            });
            this.downloadHelper.on('start', () => {
                const message = `Download Progress | ${parsedUrl} | Start`;
                env.log('FWUpdateSilent', 'downloadAppUpdater', message);
                // this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'start', null, message));
            });
            this.downloadHelper.on('progress', (stats) => {
                const message = `Download Progress | ${parsedUrl} | ${stats.progress.toFixed(2)}% [${stats.downloaded.toFixed(2)} / ${stats.total.toFixed(2)}]`;
                env.log('FWUpdateSilent', 'downloadAppUpdater', message);
                // progressStats = stats;
                this.emit(EventTypes.DownloadProgress, new IPCProgress('APP', 'progress', stats, message));
            });
            // this.downloadHelper.on('stop', async () => {
            //     const stats = progressStats;
                
            // })
            this.downloadHelper.on('end', async (stats) => {
                const message = `Download Progress | ${parsedUrl} | Download Completed`;
                env.log('FWUpdateSilent', 'downloadAppUpdater', message);

                if (fileName.endsWith('.zip')) {
                    if (env.isWindows) {
                        const downloadedArchivePath = path.join(AppPaths.DownloadsFolder, fileName);
                        const directoryName = fileName.substring(0, fileName.lastIndexOf('.'));
                        const baseFileName = directoryName.replace(/\s*?\(\d+\)$/, '');
                        const extractedArchiveDirectory = path.join(AppPaths.DownloadsFolder, baseFileName);
    
                        try {
                            const existingExtractedDirectoryStats = await fs.stat(extractedArchiveDirectory);
                            if (existingExtractedDirectoryStats != null) {
                                await fs.rm(extractedArchiveDirectory, { recursive: true, force: true });
                            }
                        } catch (_) {}
    
                        const zip = new AdmZip(downloadedArchivePath);
                        zip.extractAllTo(extractedArchiveDirectory, true);
    
                        try {
                            // const updaterFileName = baseFileName + deviceInfo.FWUpdateExtension[0];
                            // const updaterFilepath = path.join(extractedArchiveDirectory, updaterFileName);
                            const updaterFilepath =path.join(extractedArchiveDirectory, baseFileName + ".exe")
                            const updaterStats = await fs.stat(updaterFilepath);
                            console.log(updaterStats);
                            shell.openPath(updaterFilepath);
                        } catch (exception) {
                            console.log(exception);
                            const message = `Download Progress | APP | Error: Did not find executable firmware after unpacking the archive.`;
                            env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);
                            this.emit(EventTypes.DownloadProgress, new IPCProgress('APP', 'error', null, message));
                            return;
                        }
                        // console.log(zip);
                    } else if (env.isMac) {
                        // todo;
                    }
                }

                resolve();
    
                this.emit(EventTypes.DownloadProgress, new IPCProgress('APP', 'complete', stats, message));
            });
            this.downloadHelper.on('error', (err) => {
                const message = `Download Progress | ${parsedUrl} | Download Failed: ${JSON.stringify(err, undefined, 2)}`;
                env.log('FWUpdateSilent', 'downloadAppUpdater', message);
                reject();
                // this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'error', null, message));
            });
            this.downloadHelper.start();
        });
    }
}
export const AppUpdateService  = new AppUpdateServiceClass();