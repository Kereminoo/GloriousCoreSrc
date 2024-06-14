import EventEmitter from 'events';
import { env } from '../../others/env';
import { AppDB } from '../../dbapi/AppDB';
import { ModelOV2FWUpdate } from '../DeviceFWUpdate/ModelOV2FWUpdate';
import { EventTypes } from '../../../../common/EventVariable';
import { ModelOFWUpdate } from '../DeviceFWUpdate/SocketFWUpdate';
import { ModelIFWUpdate } from '../DeviceFWUpdate/ModelIFWUpdate';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import AdmZip from 'adm-zip';

import { LaunchWinSocketLib } from '../nodeDriver/lib';

import { DownloaderHelper } from 'node-downloader-helper';
import { IPCProgress } from '../../../../common/ipc-progress';
import { AppPaths } from '../../app-files/appPaths';
import { valueCFWUpdate } from '../DeviceFWUpdate/valueC/valueCFWUpdate';

// ordered to prevent early false-positives (GMMK Pro would match before GMMK Pro ISO)
const FirmwareFilenameDeviceMap = new Map([
    ['Model_O-', '0x258A0x2013'],
    ['model_o_pro', '0x258A0x2015'],
    ['Model_O_V2', '0x320F0x823A'],
    ['Model_O', '0x258A0x2011'],
    ['MOW_V2', '0x093A0x822A'],
    ['Model_D-', '0x258A0x2014'],
    ['Model_D_Pro', '0x258A0x2017'],
    ['Model_D_V2', '0x320F0x825A'],
    ['Model_D', '0x258A0x2012'],
    ['MDW_V2', '0x093A0x824A'],
    ['Model_I_V2', '0x320F0x831A'],
    ['Model_I', '0x22D40x1503'],
    ['MIW_V2', '0x093A0x821A'],
    ['Series_One_Pro', '0x258A0x2018'],
    ['RGBvalueJ', '0x12CF0x0491'],
    ['GMMK_Pro_ISO_WB', '0x320F0x5093'],
    ['GMMK_Pro_WB', '0x320F0x5092'],
    ['GMMK_Pro_ISO', '0x320F0x5046'],
    ['GMMK_Pro', '0x320F0x5044'],
    ['GMMK_V2_65US', '0x320F0x5045'],
    ['GMMK_V2_65ISO', '0x320F0x504A'],
    ['GMMK_V2_96US', '0x320F0x504B'],
    ['GMMK_V2_96ISO', '0x320F0x505A'],
    ['GMMK_Numpad', '0x320F0x5088'],
    // Temporary
    ['valueC', '0x342D0xE3D7'], // valueC 65% Wireless ANSI
    ['valueC', '0x342D0xE3D8'], // valueC 75% Wireless ANSI
    ['valueC', '0x342D0xE3D9'], // valueC 100% Wireless ANSI
    ['valueC', '0x342D0xE3DA'], // valueC 65% ANSI
    ['valueC', '0x342D0xE3DB'], // valueC 75% ANSI
    ['valueC', '0x342D0xE3DC'], // valueC 100% ANSI
    ['valueC', '0x342D0xE3EC'], // valueC 65% Wireless ISO
    ['valueC', '0x342D0xE3ED'], // valueC 75% Wireless ISO
    ['valueC', '0x342D0xE3EE'], // valueC 100% Wireless ISO
    ['valueC', '0x342D0xE3EF'], // valueC 65% ISO
    ['valueC', '0x342D0xE3F0'], // valueC 75% ISO
    ['valueC', '0x342D0xE3F1'], // valueC 100% ISO
    ['valueC', '0x342D0xE3DD'], // valueA valueD HE 65% ANSI
    ['valueC', '0x342D0xE3F2'], // valueA valueD HE 65% ISO
    ['valueC', '0x342D0xE3DE'], // valueA valueD HE 75% ANSI
    ['valueC', '0x342D0xE3F3'], // valueA valueD HE 75% ISO
    ['valueC', '0x342D0xE3DF'], // valueA valueD HE 100% ANSI
    ['valueC', '0x342D0xE3F4'], // valueA valueD HE 100% ISO
]);

export class FWUpdateSilent extends EventEmitter {
    static #instance?: FWUpdateSilent;

    LaunchWinSocket = LaunchWinSocketLib;
    nedbObj: AppDB;

    SupportDevice: any;

    ModelOFWUpdate!: ModelOFWUpdate;
    ModelOV2FWUpdate!: ModelOV2FWUpdate;
    ModelIFWUpdate!: ModelIFWUpdate;
    valueC?: valueCFWUpdate;

    constructor() {
        env.log('FWUpdateSilent', 'FWUpdateSilent class', 'begin');
        super();

        this.nedbObj = AppDB.getInstance();

        this.GetSupportDevice();
    }
    static getInstance() {
        if (this.#instance) {
            env.log('FWUpdateSilent', 'getInstance', `Get exist FWUpdateSilent() INSTANCE`);
            return this.#instance;
        } else {
            env.log('FWUpdateSilent', 'getInstance', `New FWUpdateSilent() INSTANCE`);
            this.#instance = new FWUpdateSilent();

            return this.#instance;
        }
    }
    /**
     * get data from SupportDeviceDB
     */
    GetSupportDevice(callback?) {
        this.nedbObj.getSupportDevice().then((data) => {
            this.SupportDevice = data;
            if (callback != null) {
                callback();
            }
        });
    }
    /**
     * Exec FW  update
     * @param {*} Obj
     */
    LaunchFWUpdate(Obj) {
        //------------------Compare SN to the Device-----------------
        var DeviceInfo;
        for (var i = 0; i < this.SupportDevice.length; i++) {
            var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
            if (Obj.SN == sn) {
                DeviceInfo = this.SupportDevice[i];
            }
        }
        //------------------Create FWUpdate Instance------------------
        var cmdInst: any = undefined;

        if (Obj.CurrentdeviceSN != Obj.SN && DeviceInfo.routerID == 'ModelOV2Series') {
            if (this.ModelOV2FWUpdate == undefined) {
                this.ModelOV2FWUpdate = ModelOV2FWUpdate.getInstance();
                this.ModelOV2FWUpdate.on(EventTypes.ProtocolMessage, this.OnModelOUpdateMessage);
            }
            cmdInst = this.ModelOV2FWUpdate;
        } else if (
            DeviceInfo.routerID == 'ModelOSeries' ||
            DeviceInfo.routerID == 'GmmkSeries' ||
            DeviceInfo.routerID == 'Gmmk3Series' ||
            DeviceInfo.routerID == 'GmmkNumpadSeries' ||
            DeviceInfo.routerID == 'ModelOV2Series' ||
            DeviceInfo.routerID == 'ModelOWiredSeries' ||
            DeviceInfo.routerID == 'ModelOV2WiredSeries'
        ) {
            if (this.ModelOFWUpdate == undefined) {
                this.ModelOFWUpdate = ModelOFWUpdate.getInstance();
                this.ModelOFWUpdate.on(
                    EventTypes.ProtocolMessage,
                    this.OnModelOUpdateMessage.bind(FWUpdateSilent.getInstance()),
                );
            }
            cmdInst = this.ModelOFWUpdate;
        } else if (DeviceInfo.routerID == 'ModelISeries') {
            if (this.ModelIFWUpdate == undefined) {
                this.ModelIFWUpdate = ModelIFWUpdate.getInstance();
                this.ModelIFWUpdate.on(
                    EventTypes.ProtocolMessage,
                    this.OnModelOUpdateMessage.bind(FWUpdateSilent.getInstance()),
                );
            }
            cmdInst = this.ModelIFWUpdate;
        }
        //------------------FWUpdate-Initialization------------------
        if (cmdInst != undefined) {
            var ObjFWUpdate = { execPath: Obj.execPath };
            //--------------------Test-----------------------------------
            if (Obj.CurrentdeviceSN != Obj.SN && DeviceInfo.routerID == 'ModelOV2Series') {
                var ArrayDevInfo: any = [];
                var BaseInfo;

                //Apply USB State-Obj.SN
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                    if (Obj.SN == sn) {
                        BaseInfo = JSON.parse(JSON.stringify(this.SupportDevice[i]));
                    }
                }
                var iState = BaseInfo.StateType.indexOf('USB');
                BaseInfo.StateID = iState;
                ArrayDevInfo.push(BaseInfo);

                //Apply Dongle State-Obj.CurrentdeviceSN
                for (var i = 0; i < this.SupportDevice.length; i++) {
                    var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
                    if (Obj.CurrentdeviceSN == sn) {
                        BaseInfo = JSON.parse(JSON.stringify(this.SupportDevice[i]));
                    }
                }
                var iState = BaseInfo.StateType.indexOf('Dongle');
                BaseInfo.StateID = iState;
                ArrayDevInfo.push(BaseInfo);

                //Pusd Device BaseInfo into DeviceInfo Array
                DeviceInfo = JSON.parse(JSON.stringify(ArrayDevInfo));
            }

            cmdInst.Initialization(DeviceInfo, Obj.SN, ObjFWUpdate);
        }
    }
    OnModelOUpdateMessage(Obj) {
        this.emit(EventTypes.UpdateFW, Obj);
    }

    async getExistingFirmwareUpdaters() {
        const files = await fs.readdir(AppPaths.DownloadsFolder);
        const mappedFiles: { SN: string; filename: string }[] = [];

        for (let [deviceKey, deviceSN] of FirmwareFilenameDeviceMap) {
            const file = files.find((item) => item.toLowerCase().indexOf(deviceKey.toLowerCase()) > -1);
            if (file != null) {
                mappedFiles.push({ SN: deviceSN, filename: file });
            }
        }
        // console.log(mappedFiles);
        return mappedFiles;
    }
    beginFirmwareDownloads(items: any[]) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const deviceInfo = this.SupportDevice.find((entry) => entry.vid[0] + entry.pid[0] == item.SN);

            const downloadHelper = new DownloaderHelper(item.downloadPath, AppPaths.DownloadsFolder, {
                override: true
            });
            downloadHelper.on('start', () => {
                const message = `Download Progress | ${item.name} | Start`;
                env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);
                this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'start', null, message));
            });
            downloadHelper.on('progress', (stats) => {
                const message = `Download Progress | ${item.name} | ${stats.progress.toFixed(2)}% [${stats.downloaded.toFixed(2)} / ${stats.total.toFixed(2)}]`;
                env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);
                this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'progress', stats, message));
            });
            downloadHelper.on('end', async (stats) => {
                const message = `Download Progress | ${item.name} | Download Completed`;
                env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);

                if (stats.fileName.endsWith('.zip')) {
                    if (env.isWindows) {
                        const downloadedArchivePath = stats.filePath;
                        const directoryName = stats.fileName.substring(0, stats.fileName.lastIndexOf('.'));
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
                            const updaterFilepath =
                                deviceInfo.FWUpdateExtension[0] == '.exe'
                                    ? path.join(extractedArchiveDirectory, baseFileName + '.exe')
                                    : path.join(
                                          extractedArchiveDirectory,
                                          baseFileName,
                                          deviceInfo.FWUpdateExtension[0],
                                      );
                            const updaterStats = await fs.stat(updaterFilepath);
                            console.log(updaterStats);
                        } catch (exception) {
                            console.log(exception);
                            const message = `Download Progress | ${item.name} | Error: Did not find executable firmware after unpacking the archive.`;
                            env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);
                            this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'error', null, message));
                            return;
                        }
                        console.log(zip);
                    } else if (env.isMac) {
                        // todo;
                    }
                }

                this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'complete', stats, message));
            });
            downloadHelper.on('error', (err) => {
                const message = `Download Progress | ${item.name} | Download Failed: ${JSON.stringify(err, undefined, 2)}`;
                env.log('FWUpdateSilent', 'beginFirmwareDownloads', message);
                this.emit(EventTypes.DownloadProgress, new IPCProgress(item, 'error', null, message));
            });
            downloadHelper.start();
            // downloadHelper.start().catch((err) =>
            // {
            //     console.error(err)
            // });
        }
    }
    async beginFirmwareUpdates(items: any[]) {
        const files = await fs.readdir(AppPaths.DownloadsFolder, {
            withFileTypes: true,
        });
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const deviceInfo = this.SupportDevice.find((entry) => entry.vid[0] + entry.pid[0] == item.SN);
            console.log(deviceInfo);
            if (deviceInfo == null) {
                return;
            }

            let updaterInstance: ModelOFWUpdate | ModelIFWUpdate | null = null;
            if (
                deviceInfo.routerID == 'ModelOSeries' ||
                deviceInfo.routerID == 'GmmkSeries' ||
                deviceInfo.routerID == 'Gmmk3Series' ||
                deviceInfo.routerID == 'GmmkNumpadSeries' ||
                deviceInfo.routerID == 'ModelOV2Series' ||
                deviceInfo.routerID == 'ModelOWiredSeries' ||
                deviceInfo.routerID == 'ModelOV2WiredSeries' ||
                deviceInfo.routerID == 'RGBvalueJSeries'
            ) {
                if (this.ModelOFWUpdate == undefined) {
                    this.ModelOFWUpdate = ModelOFWUpdate.getInstance();
                    this.ModelOFWUpdate.on(EventTypes.ProtocolMessage, this.onFirmwareUpdateMessage.bind(this, item));
                }
                updaterInstance = this.ModelOFWUpdate;
            } else if (deviceInfo.routerID == 'ModelISeries') {
                if (this.ModelIFWUpdate == undefined) {
                    this.ModelIFWUpdate = ModelIFWUpdate.getInstance();
                    this.ModelIFWUpdate.on(EventTypes.ProtocolMessage, this.OnModelOUpdateMessage.bind(this, item));
                }
                updaterInstance = this.ModelIFWUpdate;
            } else if (deviceInfo.routerID == 'valueC') {
                if (this.valueC == null) {
                    this.valueC = valueCFWUpdate.getInstance();
                    this.valueC.on(EventTypes.ProtocolMessage, this.onFirmwareUpdateMessage.bind(this, item));
                }
                updaterInstance = this.valueC;
            }

            if (updaterInstance == null) {
                console.error('No updater instance set.');
                return;
            }

            let deviceKey = '';
            for (let [key, deviceSN] of FirmwareFilenameDeviceMap) {
                if (item.SN == deviceSN) {
                    deviceKey = key;
                    break;
                }
            }

            const file = files.find((item) =>
                item.isFile() == true ? item.name.toLowerCase().indexOf(deviceKey.toLowerCase()) > -1 : false,
            );
            if (file == null) {
                console.error('No updater file found.');
                return;
            }

            const fileBaseName = file.name.substring(0, file.name.lastIndexOf('.'));
            const fileNameWithoutCopyNumber = fileBaseName.replace(/\s*?\(\d+\)$/, '');

            // const fileBaseName = file.name.substring(0, file.name.lastIndexOf('.'));

            updaterInstance.Initialization(deviceInfo, item.SN, {
                execPath: path.join(AppPaths.DownloadsFolder, fileNameWithoutCopyNumber, file.name),
            });
        }
    }
    onFirmwareUpdateMessage(item, obj) {
        let message = `Update Progress | ${item.name} | `;
        let value: any = null;
        let type: 'start' | 'progress' | 'error' | 'complete' = 'start';

        if (obj.Param?.Data == null) {
            return;
        }

        if (obj.Param.message) {
            message += obj.Param.message;
        }

        if (obj.Param.Data == 'START') {
            message += 'Start';
        } else if (obj.Param.Data?.Error != null) {
            type = 'error';
            message += `Error: ${obj.Param?.Data.Error}`;
        } else {
            const parsedProgress = parseFloat(obj.Param.Data);
            if (!isNaN(parsedProgress)) {
                type = 'progress';
                message += `${parsedProgress.toFixed(2)}%`;
                value = parsedProgress;
            }

            if (parsedProgress == 100) {
                this.emit(EventTypes.UpdateFW, new IPCProgress(item, type, value, message));
                type = 'complete';
                message += 'Update Complete';
            }
        }

        this.emit(EventTypes.UpdateFW, new IPCProgress(item, type, value, message));
    }

    // env.log('UpdateClass','UpdateClass','DownloadInstallPackage')
    //     try{
    //         var packPath = os.tmpdir()+"/"+AppData.ProjectName+"FW.zip";
    //         this.DownloadFileCancel = false;
    //         env.log('UpdateClass','DownloadInstallPackage',`package:${packPath}`);
    //         var pathExt = path.extname(packPath).toLowerCase();
    //         var dirName = path.join(path.dirname(packPath), 'GSPYFWUpdate');
    //         if (fs.existsSync(dirName)){
    //             env.DeleteFolderRecursive(dirName, false);
    //         }else{
    //             fs.mkdirSync(dirName);
    //         }
    //         if(env.isMac && pathExt === '.zip'){
    //             cp.execFile('/usr/bin/unzip',['-q','-o',packPath,'-d',dirName],(err, stdout, stderr) => {
    //                 if(err != undefined && err != null){
    //                     env.log('Error','DownloadInstallPackage',`upzip error : ${err}`);
    //                 }
    //                 if(stderr != undefined && stderr != null){
    //                     env.log('Error','DownloadInstallPackage',`upzip error :`+stderr);
    //                 }
    //                 var baseName = this.GetExtFilePath(dirName, '.mpkg');
    //                 if (baseName === undefined){
    //                     baseName = this.GetExtFilePath(dirName, '.pkg');
    //                 }
    //                 if (baseName === undefined){
    //                     env.log('Error','DownloadInstallPackage',`Not found .mpkg file in:${dirName}`);
    //                     callback(0x1008);
    //                     return;
    //                 }
    //                 cp.execFile('/bin/chmod',['777',baseName],(err, stdout, stderr) => {
    //                     if(err!=undefined && err!=null){
    //                         env.log('Error','DownloadInstallPackage',`chomd error:${err}`);
    //                     }
    //                     if(stderr != undefined && stderr != null){
    //                         env.log('Error','DownloadInstallPackage',`chomd error:${stderr}`);
    //                     }
    //                     fs.unlink(packPath,() => {
    //                         env.log('UpdateClass','DownloadInstallPackage',`run insPack:${baseName}`);
    //                         shell.openPath(baseName!);
    //                         callback();
    //                     });
    //                 });
    //             });
    //         }else if(env.isWindows && pathExt === '.zip'){
    //             try
    //             {
    //                 var zip = new AdmZip(packPath);
    //                 zip.extractAllTo(dirName, true);
    //                 var baseName = this.GetExtFilePath(dirName, '.exe');
    //                 if (baseName === undefined){
    //                     env.log('Error','DownloadInstallPackage',`Not found .exe file in ${dirName}`);
    //                     callback(0x1008);
    //                     return;
    //                 }
    //                 fs.unlink(packPath,function ()
    //                 {
    //                     env.log('UpdateClass','DownloadInstallPackage',`run insPack:${dirName}`);
    //                     try
    //                     {
    //                         shell.openPath(baseName!);
    //                     }catch(e){
    //                         env.log('Error','openPath error : ',e);
    //                     }
    //                     callback();
    //                 });
    //             }catch(e){
    //                 env.log('UpdateClass','openPath : ',(e as Error).toString());
    //             }

    //         }
    //     }catch(ex){
    //         env.log('Error','DownloadInstallPackage',`ex:${(ex as Error).message}`);
    //         callback(0x1008);
    //     }
}
