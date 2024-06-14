import { MessageChannels } from "../../../src/common/channel-maps/MessageChannels";
import { IPCService } from "./ipc.service";
import { IPCProgress } from "../../common/ipc-progress";
import { EventTypes } from "../../../src/common/EventVariable";
import { AppEvent } from "@renderer/support/app.events";
import { AppService } from "./app.service";
import { DeviceService } from "./device.service";
import { UIDevice } from "@renderer/data/ui-device";

export class UpdatesServiceClass
{

    versionData: any;
    lastUpdate: number = Date.now();
    refreshInterval: number = 60*60*1000;
    /**
    *compare version
    * @param versionA number:A version
    * @param versionB number:B version
    * @param exponent number:exponent 
    * return result:
    * 0: is equal to
    * 1: is more than
    * -1: is less than
    */
    compareVersions(versionA: string, versionB: string, exponent: number)
    {
      exponent = exponent || 2;
      if (versionA === versionB)
      {
          return 0;
      }
      const length = Math.max(versionA.split('.').length, versionB.split('.').length);
      versionA = this.versionToNumber(versionA, length, exponent);
      versionB = this.versionToNumber(versionB, length, exponent);
      return versionA > versionB ? 1 : (versionA < versionB ? -1 : 0);
    }
    versionToNumber(version: string, length: any, exponent: any)
    {
        // [dmercer]: rewritten to work around prerelease tags like (-dev, -rc) and build metadata (+[date].forcecompile).

        let workingString: string = version;

        const metadataArray: string[] = workingString.split('+');
        workingString = metadataArray.shift()!;
        let metadata: string[]|undefined;
        if(metadataArray.length > 0)
        {
            metadata = metadataArray[0].split('.');
        }

        const prereleaseTagArray: string[] = workingString.split('-');
        workingString = prereleaseTagArray.shift()!;
        let prereleaseTag: string|undefined;
        if(prereleaseTagArray.length > 0)
        {
            prereleaseTag = prereleaseTagArray[0];
        }

        const versionNumberArray: string[] = workingString.split('.');
        let versionNumber = 0;
        versionNumberArray.forEach(function (value: any, index: any, array: any) 
        {
            versionNumber += value * Math.pow(10, length * exponent - 1);
            length--;
        });

        return versionNumber.toString();
    }

    async getRemoteVersionManifest()
    {
      if(this.versionData == null || Date.now() - this.lastUpdate > this.refreshInterval)
      {
        const versionFileUrl = await AppService.getVersionFileUrl();
        this.versionData = await (await fetch(versionFileUrl)).json();
      }
      return this.versionData;
    }

    async getCore2RemoteVersionManifest()
    {
      if(this.versionData == null || Date.now() - this.lastUpdate > this.refreshInterval)
      {
        const versionFileUrl = await AppService.getCore2VersionFileUrl();
        this.versionData = await (await fetch(versionFileUrl)).json();
      }
      return this.versionData;
    }

    async checkIfAppHasUpdates(currentVersion: string)
    {
      const versionData = await this.getCore2RemoteVersionManifest();
      const appVersionData = versionData.AppSetting;
      if(appVersionData == null) { throw new Error('Unable to find AppSetting from remote version file.'); }

      if(this.compareVersions(appVersionData.version,currentVersion,2)==1)
      {
        return true;
      }

      return false;
    }

    async getAppUpdaterSetupUrl()
    {
      const versionData = await this.getCore2RemoteVersionManifest();
      const appVersionData = versionData.AppSetting;
      if(appVersionData == null) { throw new Error('Unable to find AppSetting from remote version file.'); }
      return appVersionData.downloadPath;
    }

    async checkIfDeviceHasUpdatesAvailable(previewDevice: UIDevice)
    {
      const versionData = await this.getRemoteVersionManifest();

      const devices = [...versionData.Mouse, ...versionData.Keyboard];

      for(let i = 0; i < devices.length; i++)
      {
        const item = devices[i];
        if(item.SN == previewDevice.SN)
        {
          if(this.compareVersions(item.version_Wired,previewDevice.version_Wired,2)==1)
          {
            return true;
          }
          if(this.compareVersions(item.version_Wireless,previewDevice.version_Wireless,2)==1)
          {
            return true;
          } 
        }
      }

      return false;
    }
    async getDevicesWithUpdatesAvailable(forceUpdates: boolean = false)
    {
      const versionData = await this.getRemoteVersionManifest();
      const updatesAvailable: any[] = [];
      
      for (let deviceIndex = 0; deviceIndex < DeviceService.pluginDeviceData.length; deviceIndex++) 
      {
        const deviceTarget = DeviceService.pluginDeviceData[deviceIndex];
        for(let mouseIndex = 0; mouseIndex < versionData.Mouse.length; mouseIndex++)
        {
          const item = versionData.Mouse[mouseIndex];
          if(forceUpdates == true)
          {
            updatesAvailable.push(item);
            continue;
          }

          if(item.SN == deviceTarget.SN)
          {
            if(this.compareVersions(item.version_Wired,deviceTarget.version_Wired,2)==1)
            {
                item.name=deviceTarget.devicename;
                item.battery=deviceTarget.deviceData?.battery;
                updatesAvailable.push(item);
                continue;
            }
            if(this.compareVersions(item.version_Wireless,deviceTarget.version_Wireless,2)==1)
            {
                item.name=deviceTarget.devicename;
                item.battery=deviceTarget.deviceData?.battery;

                updatesAvailable.push(item);
                continue;
            } 
          }
        }

        for(let keyboardIndex = 0; keyboardIndex < versionData.Keyboard.length; keyboardIndex++)
        {
          const item = versionData.Keyboard[keyboardIndex];
          if (item.SN == deviceTarget.SN) 
          {
            if(this.compareVersions(item.version_Wired,deviceTarget.version_Wired,2)==1)
            {
              item.name=deviceTarget.devicename;
              updatesAvailable.push(item);
              continue;
            }
          } 
        }
      }

      return updatesAvailable;
    }

    async getDownloadedFirmwareUpdaters()
    {
      const response = await IPCService.invoke(MessageChannels.AppChannel.GetDownloadedFirmwareUpdaters);
      if(!response.success)
      {
        console.error(response);
      }
      return response.data;
    }

    downloadFirmwareUpdaters<T>(items: T[], onDownloadProgress: (data: IPCProgress<T>) => void)
    {
      if(items.length == 0) { return; }
      
      let downloadingItems = items.length;
      const downloadProgressHandler = (event: CustomEvent) =>
      {
        const data = event.detail;
        onDownloadProgress(data);

        if(data.type == 'complete' || data.type == 'error')
        {
          downloadingItems--;
          if(downloadingItems == 0)
          {
            AppEvent.unsubscribe(EventTypes.DownloadProgress, downloadProgressHandler);
            console.log('unsubscribed from download progress');
          }
        }
        // console.log('download progress', data);
      };
      AppEvent.subscribe(EventTypes.DownloadProgress, downloadProgressHandler);
      console.log('subscribed to download progress');

      IPCService.invoke(MessageChannels.AppChannel.BeginFirmwareDownloads, items)
    }
    
    async downloadAppUpdate<T>(url: string, onDownloadProgress: (data: IPCProgress<T>) => void)
    {
      const downloadProgressHandler = (event: CustomEvent) =>
      {
        const data = event.detail;
        onDownloadProgress(data);

        if(data.type == 'complete' || data.type == 'error')
        {
          AppEvent.unsubscribe(EventTypes.DownloadProgress, downloadProgressHandler);
          console.log('unsubscribed from download progress');
        }
        // console.log('download progress', data);
      };
      AppEvent.subscribe(EventTypes.DownloadProgress, downloadProgressHandler);
      console.log('subscribed to download progress');

      return AppService.downloadAppUpdate(url);
    }
    async cancelAppUpdaterDownload()
    {
      return AppService.cancelAppUpdaterDownload();
    }

    async beginAppUpdate(fileName: string)
    {
      // const result = AppService.beginAppUpdate(fileName);
      // console.log(result);
      // if((result as any).success == true)
      // {
      //     // close application
      //     await this.forceCloseApplication();
      // }
      // else
      // {
      //     console.error((result as any).data);
      //     this.FWManager.getTarget().failMessage='SOFTWARE UPDATE FAILED';    
      //     this.setTopLayerContentUIStatus('FailMessage');
      // }
    }

    beginFirmwareUpdates<T>(items: T[], onUpdateProgress: (data: IPCProgress<T>) => void)
    {
      if(items.length == 0) { return; }
      
      let updatingItems = items.length;
      const progressHandler = (event: CustomEvent) =>
      {
        const data = event.detail;
        onUpdateProgress(data);

        if(data.type == 'complete' || data.type == 'error')
        {
          updatingItems--;
          if(updatingItems == 0)
          {
            AppEvent.unsubscribe(EventTypes.UpdateFW, progressHandler);
            console.log('unsubscribed from update progress');
          }
        }
        // console.log('download progress', data);
      };
      AppEvent.subscribe(EventTypes.UpdateFW, progressHandler);
      console.log('subscribed to update progress');

      IPCService.invoke(MessageChannels.AppChannel.BeginFirmwareUpdates, items)
    }
}

export const UpdatesService = new UpdatesServiceClass();