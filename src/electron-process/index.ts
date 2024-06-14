// static imports for extended objects
import './renderer-interop/others/date.ext';
import './renderer-interop/others/string.ext';

// library imports
import { app, BrowserWindow, dialog, ipcMain, Menu, session, shell, Tray } from 'electron';
import { electronApp, is } from '@electron-toolkit/utils';
import icon from '../../app-icon.ico?asset';
import { MessageChannels } from '../common/channel-maps/MessageChannels';
import { default as fsPromises } from 'node:fs/promises';
import { default as fs } from 'node:fs';
import { join, default as path } from 'node:path';
import { ProtocolInterface } from './renderer-interop/protocol/Interface';
import { IpcResponse } from '../common/ipc-response';
import { env } from './renderer-interop/others/env';
import { AppDB } from './renderer-interop/dbapi/AppDB';
import { EventTypes } from '../common/EventVariable';
import { default as packageProperties } from '../../package.json';
import { DeviceService } from './renderer-interop/protocol/service/DeviceService';
import * as authProcess from './auth/auth.process';
import * as authService from './auth/auth.service';

import { refreshLegacyDBFiles } from './renderer-interop/app-files/dbMigration';
import { AppPaths, getDataFilePath } from './renderer-interop/app-files/appPaths';
import * as cloudService from './cloud/cloud.service';
import { AppUpdateService } from './renderer-interop/protocol/service/AppUpdateService';

const TrayItemNames = ['Open Glorious Core', 'Quit Glorious Core'];

let MainWindow: BrowserWindow;
let AppProtocol: ProtocolInterface;
let DeviceServiceRef: DeviceService;
let DatabaseService: AppDB;
let VersionFileUrl: string;

function createWindow(): void {
    // Create the browser window.
    MainWindow = new BrowserWindow({
        width: 1024,
        height: 728,
        minWidth: 800,
        minHeight: 600,
        center: true,
        show: false,
        autoHideMenuBar: true,
        frame: false, ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'), sandbox: false, devTools: false
        },
        icon: './src/renderer-process/public/images/icons/appIcon2.png'
    });


    MainWindow.on('ready-to-show', async () => {
        const appSetting = await DatabaseService.getAppSetting();
        if (!appSetting[0]?.minimize) {
            MainWindow.show();
        }
        // if (process.env.NODE_ENV !== 'production') {
        //     const devtools = new BrowserWindow();
        //     MainWindow.webContents.setDevToolsWebContents(devtools.webContents);
        //     MainWindow.webContents.openDevTools({ mode: 'detach' });

        //     // MainWindow.webContents.openDevTools();
        // }
    });

    MainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    MainWindow.webContents.on('did-finish-load', () => {
        AppProtocol.on(EventTypes.ProtocolMessage, function(obj) {
            try {
                if (obj.Func == 'ShowWindow') {
                    if (obj.Param == 'Hide') {
                        MainWindow.minimize();
                    }
                    if (obj.Param == 'Close') {
                        env.log('electron', 'ShowWindow', JSON.stringify(obj.Param));
                        MainWindow.hide();
                    }
                } else if (obj.Func == 'QuitApp') {
                    // global.CanQuit = true;
                    app.quit();
                } else if (obj.Func == 'HideApp') {
                    // global.CanQuit = true;
                    // app.hide();
                    MainWindow.minimize();
                    // return app.terminate();
                }
                var t = { Func: obj.Func, Param: obj.Param };
                console.log('send to web contents', JSON.stringify(t));
                MainWindow.webContents.send('ipcEvent', t);
                // mainWindow.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('icpEvent', {'detail':'${JSON.stringify(t)}'}));`);
            } catch (e) {
                env.log('electron', 'AppProtocol', 'error:' + e);
            }
        });

        AppUpdateService.on(EventTypes.DownloadProgress, (data) => {
            const content = {
                Func: EventTypes.DownloadProgress, Param: data
            };
            MainWindow.webContents.send('ipcEvent', content);
        });

        AppProtocol.FWUpdateService.on(EventTypes.DownloadProgress, (data) => {
            const content = {
                Func: EventTypes.DownloadProgress, Param: data
            };
            MainWindow.webContents.send('ipcEvent', content);
        });

        AppProtocol.FWUpdateService.on(EventTypes.UpdateFW, (data) => {
            // console.log(data);
            const content = {
                Func: EventTypes.UpdateFW, Param: data
            };
            MainWindow.webContents.send('ipcEvent', content);
        });
    });

    const filter = {
        urls: ['https://*.digitaloceanspaces.com/*'] // Remote API URS for which you are getting CORS error
    };

    MainWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders.Origin = `https://*.digitaloceanspaces.com/*`;
        callback({ requestHeaders: details.requestHeaders });
    });

    MainWindow.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
        if (details.responseHeaders == null) {
            details.responseHeaders = {};
        }
        details.responseHeaders['access-control-allow-origin'] = ['*' // URL your local electron app hosted
        ];
        callback({ responseHeaders: details.responseHeaders });
    });

    session.defaultSession.webRequest.onBeforeSendHeaders({
        urls: ['https://www.gloriousgaming.com/*']
    }, (details, callback) => {
        console.log(details);
        details.requestHeaders['Origin'] = 'https://www.gloriousgaming.com/';
        callback({ requestHeaders: details.requestHeaders });
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        MainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        MainWindow.loadFile(path.join(__dirname, '../renderer-process/index.html'));
    }
}

app.commandLine.appendSwitch(' --enable-logging');
app.commandLine.appendSwitch('touch-events', 'enabled');
app.commandLine.appendSwitch('--disable-http-cache');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');
app.commandLine.appendSwitch('disable-features', 'WidgetLayering'); // fix context menus in appearing behind the devtools window

const instanceData = {};
const haslock = app.requestSingleInstanceLock(instanceData);
if (!haslock) {
    app.quit();
}

app.on('second-instance', (event, commandLine, workingDirectory, instanceData) => {
    // Someone tried to run a second instance, we should focus our window.
    if (MainWindow) {
        if (MainWindow.isMinimized()) {
            MainWindow.restore();
        }
        MainWindow.focus();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, _2) => {
        // optimizer.watchWindowShortcuts(window)
    });

    await refreshLegacyDBFiles();

    AppProtocol = new ProtocolInterface();
    DeviceServiceRef = AppProtocol.deviceService;
    DatabaseService = DeviceServiceRef!.nedbObj;

    registerIPCmethods();
    installTray(TrayItemNames);

    createWindow();

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function registerIPCmethods() {
    //debug
    // ipcMain.on('test', (event, data) => {console.log(data)});

    // message type maps can be found at /src/common/channel-maps

    // app
    let AppChannel = MessageChannels.AppChannel;
    ipcMain.handle(AppChannel.GetAppSetting, async (_, data) => {
        return handleIpcRequest(DatabaseService.getAppSetting.bind(appDataInstance));
    });
    ipcMain.handle(AppChannel.SaveAppSetting, async (_, data) => {
        return handleIpcRequest(DatabaseService.saveAppSetting.bind(appDataInstance), data);
    });
    ipcMain.handle(AppChannel.SaveStartupSetting, async (_, startupState) => {
        app.setLoginItemSettings({
            openAtLogin: startupState
        });
    });
    ipcMain.handle(AppChannel.GetVersion, async (_, data) => {
        const response = new IpcResponse();
        response.data = env.appversion;
        response.success = true;
        return response;
    });
    ipcMain.handle(AppChannel.GetAvailableTranslations, async (_, data) => {
        const response = new IpcResponse();
        //todo: enumerate i18n directory
        // response.data = packageProperties.buildVersion;
        response.success = true;
        return response;
    });
    ipcMain.handle(AppChannel.GetBuildVersion, async (_, data) => {
        const response = new IpcResponse();
        response.data = packageProperties.buildVersion;
        response.success = true;
        return response;
    });
    ipcMain.handle(AppChannel.GetVersionFileUrl, async (_, data) => {
        const response = new IpcResponse();

        if (VersionFileUrl == null) {
            if (packageProperties.useDebugVersionFileUrl) {
                try {
                    let data = fs.readFileSync(getDataFilePath('GSPYTESTServer.TEST')).toString();
                    let parsedData = JSON.parse(data);
                    VersionFileUrl = parsedData.UpdateUrl;
                } catch (e) {
                    VersionFileUrl = packageProperties.versionFileUrl;
                    env.log('GetVersionFileUrl', 'ReadFile-Error', `Error:${e}`);
                }
            } else {
                VersionFileUrl = packageProperties.versionFileUrl;
            }
        }

        response.data = VersionFileUrl;
        response.success = true;
        env.log('GetVersionFileUrl', 'Using URL:', `${VersionFileUrl}`);
        return response;
    });
    ipcMain.handle(AppChannel.GetCORE2VersionFileUrl, async (_, data) => {
        const response = new IpcResponse();

        if (VersionFileUrl == null) {
            if (packageProperties.useDebugVersionFileUrl) {
                try {
                    let data = fs.readFileSync(getDataFilePath('GSPYTESTServer.TEST')).toString();
                    let parsedData = JSON.parse(data);
                    VersionFileUrl = parsedData.CORE2UpdateUrl;
                } catch (e) {
                    VersionFileUrl = packageProperties.core2VersionFileUrl;
                    env.log('GetCORE2VersionFileUrl', 'ReadFile-Error', `Error:${e}`);
                }
            } else {
                VersionFileUrl = packageProperties.core2VersionFileUrl;
            }
        }

        response.data = VersionFileUrl;
        response.success = true;
        env.log('GetCORE2VersionFileUrl', 'Using URL:', `${VersionFileUrl}`);
        return response;
    });
    ipcMain.handle(AppChannel.GetDownloadedFirmwareUpdaters, async (_) => {
        const response = new IpcResponse();

        try {
            response.data = await AppProtocol.FWUpdateService.getExistingFirmwareUpdaters();
            response.success = true;
        } catch (exception) {
            env.log('Electron', 'Get Downloaded Firmware Updaters', exception);
        }
        return response;
    });
    ipcMain.handle(AppChannel.BeginFirmwareDownloads, async (_, data) => {
        const response = new IpcResponse();
        response.data = null;

        try {
            AppProtocol.FWUpdateService.beginFirmwareDownloads(data);
            response.success = true;
        } catch (exception) {
            env.log('Electron', 'Firmware Download', exception);
        }
        return response;
    });
    ipcMain.handle(AppChannel.BeginFirmwareUpdates, async (_, data) => {
        const response = new IpcResponse();
        response.data = null;

        try {
            AppProtocol.FWUpdateService.beginFirmwareUpdates(data);
            response.success = true;
        } catch (exception) {
            env.log('Electron', 'Firmware Update', exception);
        }
        return response;
    });
    ipcMain.handle(AppChannel.SetFirmwareOverrides, async (_, overridesData: {
        name: string;
        path: string
    }[] | null) => {
        const response = new IpcResponse();
        // TODO: finish merging firmware overrides from webassembly_test (FWUpdateService.ts)
        // try {
        //     AppProtocol.FWUpdateService.setFirmwareOverrides(overridesData);
        //     response.success = true;
        //     if (overridesData)
        //         response.data = `Firmware overrides set: ${overridesData.map((item) => item.path).join(', ')}`;
        //     else response.data = `Firmware overrides removed`;
        // } catch (exception) {
        //     response.success = false;
        //     response.data = 'Failed to set firmware overrides';
        // }
        return response;
    });

    ipcMain.handle(AppChannel.ShowDebug, async (_, data) => {
        const response = new IpcResponse();
        response.data = packageProperties.showDebugUI;
        response.success = true;
        return response;
    });

    ipcMain.on(AppChannel.InitTray, function(event, labs) {
        installTray(labs);
    });

    ipcMain.handle(AppChannel.ShowOpenDialog, async (_, data) => {
        const response = new IpcResponse();
        try {
            var window = BrowserWindow.getFocusedWindow()!;
            var result = await dialog.showOpenDialog(window, data);

            if (result == undefined) {
                return undefined;
            }
            response.data = result.filePaths[0];
            response.success = true;

            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.ShowSaveDialog, async (_, data) => {
        const response = new IpcResponse();
        try {
            var window = BrowserWindow.getFocusedWindow()!;
            var result = await dialog.showSaveDialog(window, data);

            if (result == undefined) {
                return undefined;
            }
            response.data = result.filePath;
            response.success = true;

            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.CommandMin, async (_, data) => {
        const response = new IpcResponse();
        try {
            var window = BrowserWindow.getFocusedWindow()!;
            window.minimize();
            response.success = true;
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.CommandMax, async (_, data) => {
        const response = new IpcResponse();
        try {
            var window = BrowserWindow.getFocusedWindow()!;

            if (window.isMaximized()) {
                window.unmaximize();
            } else if (window.isMaximizable()) {
                window.maximize();
            }
            response.success = true;
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.CommandClose, async (_, data) => {
        const response = new IpcResponse();
        try {
            var window = BrowserWindow.getFocusedWindow()!;
            window.hide();
            response.success = true;
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.OpenHyperlink, async (_, data) => {
        const response = new IpcResponse();
        try {
            // env.log('electron','進入瀏覽器指定URL',data);
            // //const shell = require('electron').shell;
            // //shell.openExternal("")
            // cp.execSync('start '+data);
            console.log(data);
            shell.openExternal(data);
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    
    ipcMain.handle(AppChannel.Tool_DownloadFile, async (_, data) => {
        const response = new IpcResponse();
        let resultData;
        try {
            
            // const urlArray = data.url.split('/');
            // const packageFileName = urlArray[urlArray.length - 1];
            // const filename = data.outputFilename ?? packageFileName.substring(0, packageFileName.lastIndexOf('.'));

            // const path = join(AppPaths.DownloadsFolder, filename);
            const result = await AppUpdateService.downloadAppUpdater(data.url);

            // const file = fs.createWriteStream("file.jpg");
            // const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
            // response.pipe(file);

            // // after download completed close filestream
            // file.on("finish", () => {
            //     file.close();
            //     console.log("Download Completed");
            // });

            // resultData = await fsPromises.writeFile(path, );
            response.success = true;
            return response;
        } catch (exception) {
            response.data = { error: exception, data: resultData };
            return response;
        }
    });
    ipcMain.handle(AppChannel.Tool_CancelDownload, async (_, data) => {
        const response = new IpcResponse();
        let resultData;
        try {
            
            if(AppUpdateService.downloadHelper != null) 
            {
                response.success = await AppUpdateService.downloadHelper.stop();
            }
            
            response.success = true;
            return response;
        } catch (exception) {
            response.data = { error: exception, data: resultData };
            return response;
        }
    });

    ipcMain.handle(AppChannel.Tool_SaveFile, async (_, data) => {
        const response = new IpcResponse();
        let resultData;
        try {
            let finalData = {
                filename: data.filename, exportVersion: data.exportVersion, value: data.value
            };

            resultData = await fsPromises.writeFile(data.path, JSON.stringify(finalData));
            response.success = true;
            return response;
        } catch (exception) {
            response.data = { error: exception, data: resultData };
            return response;
        }
    });
    ipcMain.handle(AppChannel.Tool_ClearFolder, async (_, data) => {
        const response = new IpcResponse();
        try {
            let folder_exists = fs.existsSync(data);
            if (folder_exists) {
                let filelist = fs.readdirSync(data);
                filelist.forEach(function(fileName) {
                    fs.unlinkSync(path.join(data, fileName));
                });
            }
            response.success = true;
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(AppChannel.Tool_SupportSaveFile, async (_, data) => {
        const response = new IpcResponse();
        let resultData;
        try {
            resultData = await fsPromises.writeFile(data.path, JSON.stringify(data.data));
            response.success = true;
            return response;
        } catch (exception) {
            response.data = { error: exception, data: resultData };
            return response;
        }
    });
    ipcMain.handle(AppChannel.Tool_OpenFile, async (_, data) => {
        const response = new IpcResponse();
        try {
            const resultData = fsPromises.readFile(data);
            response.success = true;
            response.data = (await resultData).toString();
            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });

    // app settings from db
    const appDataInstance = AppDB.getInstance();
    let DataChannel = MessageChannels.DataChannel;
    ipcMain.handle(DataChannel.GetSupportDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.getSupportDevice.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.GetLayout, async (_, data) => {
        return handleIpcRequest(DatabaseService.getLayout.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.UpdateLayout, async (_, data) => {
        return handleIpcRequest(DatabaseService.updateLayoutAlldata.bind(appDataInstance), data.compareData, data.obj);
    });
    ipcMain.handle(DataChannel.GetPluginDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.getPluginDevice.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.UpdatePluginDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.updatePluginDevice.bind(appDataInstance), data.obj);
    });
    ipcMain.handle(DataChannel.UpdateAllPluginDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.updateAllPluginDevice.bind(appDataInstance), data.obj);
    });
    ipcMain.handle(DataChannel.UpdateDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.updateDevice.bind(appDataInstance), data._id, data.obj);
    });
    ipcMain.handle(DataChannel.GetAllDevice, async (_, data) => {
        return handleIpcRequest(DatabaseService.getAllDevice.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.GetMacro, async (_, data) => {
        return handleIpcRequest(DatabaseService.getMacro.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.GetMacroById, async (_, data) => {
        return handleIpcRequest(DatabaseService.getMacroById.bind(appDataInstance), data);
    });
    ipcMain.handle(DataChannel.InsertMacro, async (_, data) => {
        return handleIpcRequest(DatabaseService.insertMacro.bind(appDataInstance), data);
    });
    ipcMain.handle(DataChannel.DeleteMacro, async (_, data) => {
        return handleIpcRequest(DatabaseService.DeleteMacro.bind(appDataInstance), data);
    });
    ipcMain.handle(DataChannel.UpdateMacro, async (_, data) => {
        return handleIpcRequest(DatabaseService.updateMacro.bind(appDataInstance), data.id, data.obj);
    });
    ipcMain.handle(DataChannel.GetEQ, async (_, data) => {
        return handleIpcRequest(DatabaseService.getEQ.bind(appDataInstance));
    });
    ipcMain.handle(DataChannel.GetEQById, async (_, data) => {
        return handleIpcRequest(DatabaseService.getEQById.bind(appDataInstance), data.id);
    });
    ipcMain.handle(DataChannel.InsertEQ, async (_, data) => {
        return handleIpcRequest(DatabaseService.insertEQ.bind(appDataInstance), data.obj);
    });
    ipcMain.handle(DataChannel.DeleteEQ, async (_, data) => {
        return handleIpcRequest(DatabaseService.DeleteEQ.bind(appDataInstance), data.index);
    });
    ipcMain.handle(DataChannel.UpdateEQ, async (_, data) => {
        return handleIpcRequest(DatabaseService.updateEQ.bind(appDataInstance), data.id, data.obj);
    });

    // devices
    let DeviceChannel = MessageChannels.DeviceChannel;
    ipcMain.handle(DeviceChannel.MockDeviceRegister, async (_, device: any) => {
        const response = new IpcResponse();
        try {
            const path = device.path.toUpperCase();
            AppProtocol.hiddevice.EmulateDeviceConnection(true, path);
        } catch (exception) {
            response.data = exception;
        }
        return response;
    });

    // ipcMain.handle(DeviceChannel.MockDeviceCollect, async () => {
    //     try {
    //         // Get list of all HID devices
    //         const devices = HID.devices();

    //         // Filter devices based on VendorID and ProductID from FakeDevice
    //         let matchedDevices = devices.filter((device) =>
    //             // Check if the device's VendorID and ProductID match with any of the fake devices
    //             FakeDevice.some(
    //                 (fakeDevice) =>
    //                     fakeDevice.vid.includes(device.vendorId.toString(16).padStart(4, '0')) &&
    //                     fakeDevice.pid.includes(device.productId.toString(16).padStart(4, '0')),
    //             ),
    //         );

    //         if (matchedDevices.length == 0) matchedDevices = devices;

    //         // Save the matchedDevices to a JSON file
    //         fs.writeFileSync('fakeDeviceData.json', JSON.stringify(matchedDevices, null, 2));

    //         // Prepare the response
    //         const response: IpcResponse = {
    //             success: true,
    //             data: matchedDevices,
    //         };

    //         return response;
    //     } catch (err) {
    //         console.error(err);

    //         const errorResponse: IpcResponse = {
    //             success: false,
    //             data: null,
    //         };

    //         return errorResponse;
    //     }
    // });

    ipcMain.handle(DeviceChannel.MockDeviceLoad, async (_, path) => {
        let response: IpcResponse;
        try {
            const filePath = path ?? 'fakeDeviceData.json';
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            response = { data: data, success: true };
            return response;
        } catch (err) {
            response = { data: undefined, success: false };
            return response;
        }
    });

    ipcMain.handle(DeviceChannel.MockDeviceUnregister, async (_, device) => {
        let response = new IpcResponse();
        try {
            if (device !== undefined) {
                const path = device.path.toUpperCase();
                AppProtocol.hiddevice.EmulateDeviceConnection(false, path);
            } else {
                AppProtocol.hiddevice.EmulateDeviceConnection(false, '');
            }
            response.success = true;
        } catch (err) {
            response.success = false;
            response.data = err;
        }
        return response;
    });

    ipcMain.handle(DeviceChannel.DeviceSendHidReport, async (_, data: {
        vid: number; pid: number; usagePage: number; usage: number; reportID: number; report: Array<number>;
    }) => {
        const response = new IpcResponse();
        try {
            const checksum = 0xff - (data.report.reduce((sum, val) => sum + val, 0) & 0xff);
            const length = data.report.length + 2;
            let buffer = Buffer.alloc(length);
            buffer[0] = data.reportID;
            buffer.set(data.report, 1);
            buffer[length - 1] = checksum;

            const deviceId = AppProtocol.hiddevice.FindDevice(data.usagePage, data.usage, data.vid, data.pid);
            if (deviceId > 0) {
                response.data = AppProtocol.hiddevice.SetFeatureReport(deviceId, data.reportID, length, buffer);
                response.success = true;
            }
        } catch (err) {
            response.success = false;
            response.data = err;
        }
        return response;
    });

    // protocol
    const ProtocolChannel = MessageChannels.ProtocolChannel;
    ipcMain.handle(ProtocolChannel.RunSetFunctionSystem, async (_, data) => {
        const response = new IpcResponse();
        try {
            let error;
            await AppProtocol.RunFunction(data, (err, data) => {
                error = err;
            });

            response.success = error == null;
            if (!response.success) {
                response.data = error;
            }

            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });
    ipcMain.handle(ProtocolChannel.RunSetFunctionDevice, async (_, data) => {
        const response = new IpcResponse();
        try {
            let error;
            let resultData;
            await AppProtocol.RunFunction(data, (result, data) => {
                if (result != null && typeof result === 'string' && result.includes('Error')) {
                    error = result;
                } else {
                    resultData = result;
                }
            });

            response.success = error == null;
            if (response.success) {
                response.data = resultData;
            } else {
                response.data = error;
            }

            return response;
        } catch (exception) {
            response.data = exception;
            return response;
        }
    });

    // handling login event
    ipcMain.handle(AppChannel.Login, (_ev, options) => authProcess.createAuthWindow(options, MainWindow));

    ipcMain.handle(AppChannel.IsLoggedIn, authService.isLoggedIn);
    ipcMain.handle(AppChannel.GetProfile, authService.getProfile);
    ipcMain.handle(AppChannel.ChangePassword, (_ev, options) => authService.changePassword(options));
    ipcMain.handle(AppChannel.Logout, authService.logout);
    //device icp
    ipcMain.handle(AppChannel.GetCloudDeviceProfiles, (_ev, variables) => cloudService.getDeviceProfiles(variables));

    ipcMain.handle(AppChannel.GetAllCloudDevicesProfiles, (_ev, variables) => cloudService.getAllDevicesProfiles(variables));

    ipcMain.handle(AppChannel.CreateCloudDeviceProfile, (_ev, options) => cloudService.saveProfile(options));

    ipcMain.handle(AppChannel.DeleteCloudDeviceProfile, (_ev, options) => cloudService.deleteDeviceProfile(options));
}

async function handleIpcRequest(getData, ...args) {
    const response = new IpcResponse();
    try {
        response.data = await getData(...args);
        response.success = true;
        return response;
    } catch (exception) {
        response.data = exception;
        return response;
    }
}

let TrayIcon;

function installTray(labs) {
    if (labs === null || labs === undefined || labs.constructor !== Array || labs.length !== 2) {
        labs = ['Open', 'Exit'];
    }
    if (TrayIcon !== undefined) {
        TrayIcon.destroy();
        TrayIcon = null;
    }

    try {
        const trayIconPath = process.env.NODE_ENV === 'production' ? path.join(process.resourcesPath, 'public/images/icons/app-icon.ico') : './app-icon.ico';
        // env.log("index", "install tray", `Tray Icon Path: ${trayIconPath}`);
        console.log('Tray Icon Path', trayIconPath);
        TrayIcon = new Tray(`${trayIconPath}`);
        var contextMenu = Menu.buildFromTemplate([{
            label: labs[0], // icon:'./src/renderer-process/assets/images/topmost.png', // if these images don't exist, the tray doesn't work; uncomment when assets are available
            click: function(event) {
                // if (env.isMac)
                //     app.dock.show();
                console.log(event);
                global.CanQuit = false;
                MainWindow.show();
                MainWindow.setSkipTaskbar(false);
            }
        }, {
            label: labs[1], // icon:'./src/renderer-process/assets/images/exit.png', // if these images don't exist, the tray doesn't work; uncomment when assets are available
            click: function() {
                global.CanQuit = true;
                AppProtocol.CloseAllDevice().then(function() {
                    app.quit();
                });
            }
        }]);
        TrayIcon.setTitle('Glorious Core');
        TrayIcon.setToolTip('Glorious Core');
        TrayIcon.setContextMenu(contextMenu);
        TrayIcon.on('double-click', function() {
            // if (env.isMac)
            //     app.dock.show();
            global.CanQuit = false;
            MainWindow.show();
            setTimeout(function() {
                MainWindow.setSkipTaskbar(false);
            }, 100);
        });

        TrayIcon.on('right-click', function() {
            // if (env.isMac)
            //     app.dock.show();
            global.CanQuit = false;
        });
    } catch (exception) {
        // env.log(exception);
    }
}
