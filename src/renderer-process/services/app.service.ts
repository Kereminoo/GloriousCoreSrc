import { AppEvent } from '@renderer/support/app.events';
import { MessageChannels } from '../../common/channel-maps/MessageChannels';
import { IPCService } from './ipc.service';
import { EventTypes } from '../../../src/common/EventVariable';
import { FuncName, FuncType } from '../../common/FunctionVariable';
import { IPCProgress } from 'src/common/ipc-progress';

export class AppServiceClass {
    async getAppSetting(): Promise<any> {
        const response = await IPCService.invoke(MessageChannels.AppChannel.GetAppSetting);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }
    async saveAppSetting(obj: any): Promise<any> {
        const response = await IPCService.invoke(MessageChannels.AppChannel.SaveAppSetting, obj);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }

    async saveStartupSetting(startupState: boolean): Promise<any> {
        try {
            await IPCService.invoke(MessageChannels.AppChannel.SaveStartupSetting, startupState);
        } catch (error) {
            console.error('Failed to save startup setting:', error);
        }
    }

    async getAppInfo(key: 'version' | 'buildVersion' | 'mode' | 'showDebug'): Promise<any> {
        if (key == 'mode') {
            return import.meta.env.MODE;
        } else if (key == 'version') {
            const response = await IPCService.invoke(MessageChannels.AppChannel.GetVersion);
            if (!response.success) {
                console.error(response);
            }
            return response.data;
        } else if (key == 'buildVersion') {
            const response = await IPCService.invoke(MessageChannels.AppChannel.GetBuildVersion);
            if (!response.success) {
                console.error(response);
            }
            return response.data;
        } else if (key == 'showDebug') {
            const response = await IPCService.invoke(MessageChannels.AppChannel.ShowDebug);
            if (!response.success) {
                console.error(response);
            }
            return response.data;
        }
    }

    async openHyperlink(target: any): Promise<any> {
        const response = await IPCService.invoke(MessageChannels.AppChannel.OpenHyperlink, target);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }

    async runWindowCommand(command: string): Promise<any> {
        if (
            command == null ||
            (command != MessageChannels.AppChannel.CommandMin &&
                command != MessageChannels.AppChannel.CommandMax &&
                command != MessageChannels.AppChannel.CommandClose)
        ) {
            console.error(`Unknown command ${command}`);
            return;
        }
        const response = await IPCService.invoke(command);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }

    async getVersionFileUrl() {
        const response = await IPCService.invoke(MessageChannels.AppChannel.GetVersionFileUrl);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }

    async getCore2VersionFileUrl() {
        const response = await IPCService.invoke(MessageChannels.AppChannel.GetCORE2VersionFileUrl);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }

    async getAvailableTranslations() {
        const response = await IPCService.invoke(MessageChannels.AppChannel.GetAvailableTranslations);
        if (!response.success) {
            console.error(response);
        }
        return response.data;
    }
    
    async downloadAppUpdate(url: string)
    {
        const response = await IPCService.invoke(MessageChannels.AppChannel.Tool_DownloadFile, {url});
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
    }
    async cancelAppUpdaterDownload()
    {
        const response = await IPCService.invoke(MessageChannels.AppChannel.Tool_CancelDownload);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
    }
    async beginAppUpdate(filename: string)
    {
        const data = {Type:FuncType.System, Func:FuncName.ExecFile, Param : {
            //   path: this.joinEnvAppRootPath("UpdateApp.bat"),
              filename: filename
          }};
        const response = await IPCService.invoke(MessageChannels.ProtocolChannel.RunSetFunctionSystem, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
    }
    async quitApplication()
    {
        const data = {Type:FuncType.System, Func:FuncName.QuitApp, Param : "" };
        const response = await IPCService.invoke(MessageChannels.ProtocolChannel.RunSetFunctionSystem, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
    }

    dialogShortcutProgramPath = async () => {
        const response = await IPCService.invoke(MessageChannels.AppChannel.ShowOpenDialog, {
            filters: [{ name: 'Custom File Type', extensions: ['exe'] }],
            properties: ['openFile'],
        });
        return { success: response.success, data: response.success ? response.data : null };
    };
}

export const AppService = new AppServiceClass();
