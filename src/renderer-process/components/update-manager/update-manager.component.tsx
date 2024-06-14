import React, { ChangeEvent, MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import './update-manager.component.css'
import { AppEvent, AppEventChannel } from '@renderer/support/app.events';
import ContentDialogComponent from '../content-dialog/content-dialog.component';
import { AppService } from '@renderer/services/app.service';
import { DeviceService } from '@renderer/services/device.service';
import { UpdatesService } from '@renderer/services/updates.service';
import { IPCProgress } from 'src/common/ipc-progress';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { IconSize } from '../icon/icon.types';
import Icon from '../icon/icon';

type FirmwareUpdaterStep = 'device-select'|'in-progress'|'error'|'failed';

type UpdateTask = {
  key: string;
  percentageOfTotal?: number;
  translate: string;
}


export const UpdateTasks_App: UpdateTask[] = [
  { key: 'download', translate:'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
  { key: 'execute', translate:'FirmwareUpdate_Task_Execute' }, // not an 'update' step because we don't monitor this
  { key: 'shutdown', translate:'FirmwareUpdate_Task_Shutdown', percentageOfTotal: 10 }
];
export const UpdateTasks_Wired: UpdateTask[] = [
  { key: 'download', translate:'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
  { key: 'updateDevice', translate:'FirmwareUpdate_Task_UpdateDevice' },
];
export const UpdateTasks_WirelessReceiver: UpdateTask[] = [
  { key: 'download', translate:'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
  { key: 'updateDevice', translate:'FirmwareUpdate_Task_UpdateDevice' },
  { key: 'updateReceiver', translate:'FirmwareUpdate_Task_UpdateReceiver' },
];

const DeviceUpdateTasks = new Map(Object.entries(
  {
      "0x320F0x5044": UpdateTasks_Wired, // GMMK PRO
      "0x320F0x5092": UpdateTasks_Wired, // GMMK PRO
      "0x320F0x5046": UpdateTasks_Wired, // GMMK PRO ISO
      "0x320F0x5093": UpdateTasks_Wired, // GMMK PRO ISO
      "0x320F0x504A": UpdateTasks_Wired, // GMMK v2 65 ISO
      "0x320F0x5045": UpdateTasks_Wired, // GMMK v2 65 US
      "0x320F0x505A": UpdateTasks_Wired, // GMMK v2 96 ISO
      "0x320F0x504B": UpdateTasks_Wired, // GMMK v2 96 US
      "0x320F0x5088": UpdateTasks_Wired, // GMMK Numpad
      
      "0x320F0x8888": UpdateTasks_Wired, // Model O Wired
      "0x258A0x2011": UpdateTasks_WirelessReceiver, // Model O Wireless
      "0x258A0x2036": UpdateTasks_Wired, // Model O Minus Wired
      "0x258A0x2013": UpdateTasks_WirelessReceiver, // Model O Minus Wireless
      "0x258A0x2015": UpdateTasks_WirelessReceiver, // Model O Pro Wireless
      "0x320F0x823A": UpdateTasks_Wired, // Model O2 Wired
      "0x093A0x822A": UpdateTasks_WirelessReceiver, // Model O2 Wireless
      "0x258A0x2019": UpdateTasks_WirelessReceiver, // Model O2 Pro 1k
      "0x258A0x201B": UpdateTasks_WirelessReceiver, // Model O 2 Pro 8k
      "0x258A0x2012": UpdateTasks_WirelessReceiver, // Model D Wireless
      "0x258A0x2014": UpdateTasks_WirelessReceiver, // Model D Minus Wireless
      "0x258A0x2017": UpdateTasks_WirelessReceiver, // Model D Pro Wireless
      "0x258A0x201A": UpdateTasks_WirelessReceiver, // Model D 2 Pro 1k
      "0x258A0x201C": UpdateTasks_WirelessReceiver, // Model D 2 Pro 8k
      "0x22D40x1503": UpdateTasks_Wired, // Model I
      "0x320F0x831A": UpdateTasks_Wired, // Model valueG
      "0x093A0x821A": UpdateTasks_WirelessReceiver, // Model I2
      "0x320F0x825A": UpdateTasks_Wired, // Model D2 Wired
      "0x093A0x824A": UpdateTasks_WirelessReceiver, // Model D2 Wireless
      "0x258A0x2018": UpdateTasks_WirelessReceiver, // Series One Pro Wireless
      '0x258A0x201D': UpdateTasks_WirelessReceiver, //valueH Pro (8k wireless)
      '0x093A0x826A': UpdateTasks_WirelessReceiver, //valueF Wireless
      '0x320F0x827A': UpdateTasks_Wired, //valueF
  }
));

function UpdateManagerComponent(props: any) 
{
  // const { devices, selectedDevice } = props;

  // const [firmwareUpdaterDialogIsOpen, setFirmwareUpdaterDialogIsOpen] = useState(false);
  const [firmwareUpdaterStep, setFirmwareUpdaterStep] = useState<string & FirmwareUpdaterStep>('device-select');

  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);
  const [confirmationDialogData, setConfirmationDialogData] = useState({text: "", title: "", icon: ""});
  const confirmationResolve = useRef<null|((result: boolean)=>void)>(null);

  const [selectedDevices, setSelectedDevices] = useState<any[]>([]);

  const [devicesWithUpdatesAvailable, setDevicesWithUpdatesAvailable] = useState<any[]>([]);

  const [downloadProgressMap, setDownloadProgressMap] = useState(new Map<string, number>());
  const downloadProgressMapRef = useRef(new Map<string, number>());
  const [updateProgressMap, setUpdateProgressMap] = useState(new Map<string, number|number[]>());
  const updateProgressMapRef = useRef(new Map<string, number|number[]>());

  const translate = useTranslate();
  const devicesContext = useDevicesContext();
  const { setDevicesCurrentlyUpdating, refreshDevices } = useDevicesManagementContext();
  const uiContext = useUIContext();
  const 
  {
    closeUpdateManager,
  } = useUIUpdateContext();

  // useEffect(() =>
  // {
  //   setConfirmationDialogIsOpen(true);
  // }, [confirmationDialogData]);

  

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
  const compareVersions = (versionA: string, versionB: string, exponent: number) =>
  {
    exponent = exponent || 2;
    if (versionA === versionB)
    {
        return 0;
    }
    const length = Math.max(versionA.split('.').length, versionB.split('.').length);
    const getVersionNumber = (function (length, exponent)
    {
        return function (version: any)
        {
            return versionToNumber(version, length, exponent);
        };
    })(length, exponent);
    versionA = getVersionNumber(versionA);
    versionB = getVersionNumber(versionB);
    return versionA > versionB ? 1 : (versionA < versionB ? -1 : 0);
  }
  const versionToNumber = (version: string, length: any, exponent: any) =>
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

  useEffect(() =>
  {
    refresh();

  }, [uiContext.updateManagerModal_isOpen]);

  // useEffect(() =>
  // {
  //   if(devicesContext.devicesCurrentlyUpdating.length == 0) { return; }

  //   updateSelectedDevices();

  // }, [devicesContext.devicesCurrentlyUpdating]);

  const refresh = async () =>
  {
    if(uiContext.updateManagerModal_isOpen == true)
    {
      
      // setFirmwareUpdaterStep(data.step as FirmwareUpdaterStep);
      // setFirmwareUpdaterDialogIsOpen(true);

      // debug
      const updatesAvailable = await getDevicesWithUpdatesAvailable(true);
      // const updatesAvailable = await getDevicesWithUpdatesAvailable();
      setDevicesWithUpdatesAvailable(updatesAvailable);
      console.log(updatesAvailable);

      downloadProgressMapRef.current = new Map();
      
      const existingFirmwareUpdaters = await getDownloadedFirmwareUpdaters();
      for(let i = 0; i < existingFirmwareUpdaters.length; i++)
      {
        downloadProgressMapRef.current.set(existingFirmwareUpdaters[i].SN, 100);
      }

      setDownloadProgressMap(downloadProgressMapRef.current);


      // App Update
      // if(this.FWManager.versionCompare(data.AppSetting.version,this.getAppVersion(),2)==1){

      //     this.FWManager.FwServerData.push(data.AppSetting);
      //  }       
      // if(this.FWManager.FwServerData.length>0){
      //     console.log('getAssignURL_json_FwServerData',this.FWManager.FwServerData);
      //     this.getAppService.hasUpdateTip=true;
      //     this.setTopLayerContentUIStatus("CHECK_DOWNLOAD");
      // }
      // else{
      //     this.setTopLayerContentUIStatus("");
      // }
    }
  }

  const getDownloadedFirmwareUpdaters = async () =>
  {
    const files = await UpdatesService.getDownloadedFirmwareUpdaters();    
    // console.log(files);
    return files;
  }

  const getDevicesWithUpdatesAvailable = async (forceUpdates: boolean = false) =>
  {
    const versionFileUrl = await AppService.getVersionFileUrl();
    const versionData = await (await fetch(versionFileUrl)).json();
    // console.log(versionData);

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
          if(compareVersions(item.version_Wired,deviceTarget.version_Wired,2)==1)
          {
              item.name=deviceTarget.devicename;
              item.battery=deviceTarget.deviceData?.battery;
              updatesAvailable.push(item);
              continue;
          }
          if(compareVersions(item.version_Wireless,deviceTarget.version_Wireless,2)==1)
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
          if(compareVersions(item.version_Wired,deviceTarget.version_Wired,2)==1)
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

  const getFirmwareVersionDataFromServer = async (deviceSN: string) =>
  {
    const versionFileUrl = await AppService.getVersionFileUrl();
    const versionData = await (await fetch(versionFileUrl)).json();
    
    for(let mouseIndex = 0; mouseIndex < versionData.Mouse.length; mouseIndex++)
    {
      const item = versionData.Mouse[mouseIndex];
      if(item.SN == deviceSN)
      {
        return item;
      }
    }

    for(let keyboardIndex = 0; keyboardIndex < versionData.Keyboard.length; keyboardIndex++)
    {
      const item = versionData.Keyboard[keyboardIndex];
      if (item.SN == deviceSN) 
      {
        return item;
      } 
    }

    return null;
  }

  const beginFirmwareUpdates = async () =>
  {
    await downloadFirmware();
    console.log('all selected device firmware updateres have been downloaded');
    setDevicesCurrentlyUpdating(selectedDevices.map(item => item.SN));
  }

  const downloadFirmware = () =>
  {

    return new Promise<void>(async (resolve, _) =>
    {
      const existingFirmwareUpdaters = await getDownloadedFirmwareUpdaters();
      const toDownload = selectedDevices.filter(item => existingFirmwareUpdaters.find(updater => updater.SN == item.SN) == null);
      if(toDownload.length == 0) { resolve(); }
      // console.log(toDownload);

      for(let i = 0; i < toDownload.length; i++)
      {
        downloadProgressMapRef.current.set(toDownload[i].SN, 0);
      }
      setDownloadProgressMap(downloadProgressMapRef.current);
  
      // const firmwareData = getFirmwareVersionDataFromServer(selectedDevice);
      UpdatesService.downloadFirmwareUpdaters(toDownload, (update) =>
      {
        // const updateDevice = devices.find(device => device.SN == update.item.SN);
        
        const deviceUpdate = downloadProgressMapRef.current.get(update.item.SN);
        if(deviceUpdate == null) { return; }
  
        if(update.type == 'start')
        {
          downloadProgressMapRef.current.set(update.item.SN, 0);
        }
        else if(update.type == 'progress')
        {
          downloadProgressMapRef.current.set(update.item.SN, update.value.progress);
        }
        else if(update.type == 'complete')
        {
          downloadProgressMapRef.current.set(update.item.SN, 100);

          // check if we're finished with all downloads
          if(Array.from(downloadProgressMapRef.current.values()).find(value => value < 100) == null)
          {
            resolve();
          }
        }
        else if(update.type == 'error')
        {
          // todo: handle error in UI
          console.log(update);
          downloadProgressMapRef.current.delete(update.item.SN);
        }
  
  
        const newMap = structuredClone(downloadProgressMapRef.current);
        setDownloadProgressMap(newMap);
        // console.log(downloadProgressMap);
        
        // console.log(updateDevice, update);
      })
    });
  }

  const updateSelectedDevices = async () =>
  {
    await new Promise<void>((resolve) => 
    {
      try
      {
        for(let i = 0; i < selectedDevices.length; i++)
        {
          let value: number|number[] = 0;
          if(DeviceUpdateTasks.get(selectedDevices[i].SN) == UpdateTasks_WirelessReceiver)
          {
            value = [0,0];
          }
          updateProgressMapRef.current.set(selectedDevices[i].SN, value);
        }
        setUpdateProgressMap(updateProgressMapRef.current);
  
  
        UpdatesService.beginFirmwareUpdates(selectedDevices, (update: IPCProgress<any>) =>
        {
          const deviceUpdate = updateProgressMapRef.current.get(update.item.SN);
          if(deviceUpdate == null) { return; }
  
          if(update.type == 'start')
          {
            const value = structuredClone(updateProgressMapRef.current.get(update.item.SN));
            if(Array.isArray(value))
            {
              for(let i = 0; i < value.length; i++)
              {
                value[i] = 0;
              }
              updateProgressMapRef.current.set(update.item.SN, value);
            }
            else
            {
              updateProgressMapRef.current.set(update.item.SN, 0);
            }
          }
          else if(update.type == 'progress')
          {
            const value = structuredClone(updateProgressMapRef.current.get(update.item.SN));
            if(Array.isArray(value))
            {
              const valueIndex = (update.value) <= 50 ? 0 : 1;
              value[valueIndex] = (valueIndex == 0) ? update.value*2 : 50-(update.value*2);
              updateProgressMapRef.current.set(update.item.SN, value);
            }
            else
            {
              updateProgressMapRef.current.set(update.item.SN, update.value);
            }
            
          }
          else if(update.type == 'complete')
          {
            const value = structuredClone(updateProgressMapRef.current.get(update.item.SN));
            if(Array.isArray(value))
            {
              for(let i = 0; i < value.length; i++)
              {
                value[i] = 100;
              }
              updateProgressMapRef.current.set(update.item.SN, value);
            }
            else
            {
              updateProgressMapRef.current.set(update.item.SN, 100);
            }
  
            // check if we're finished with all updates
            const currentProgressValues = Array.from(updateProgressMapRef.current.values());
            const unfinishedValue = currentProgressValues.find((progressValuesItem) => 
            {
              return Array.isArray(progressValuesItem)
              ? progressValuesItem.find(arrayVal => arrayVal < 100) == null
              : progressValuesItem < 100;
            });

            if(unfinishedValue == null)
            {
              console.log('before devices update clear', devicesContext.devicesCurrentlyUpdating);
              setDevicesCurrentlyUpdating([]);
              resolve();
            }
          }
          else if(update.type == 'error')
          {
            // todo: handle error in UI
            console.log(update);
            updateProgressMapRef.current.delete(update.item.SN);
          }
  
  
          const newMap = structuredClone(updateProgressMapRef.current);
          setUpdateProgressMap(newMap);
        });

        setTimeout(() =>
        {
          refreshDevices();
        }, 100) // wait for the devices state to allow refreshing again
      }
      finally
      {
      }
    });
    
  }
    

  
  return (<div className="update-manager">


  <ContentDialogComponent className="monitor" 
  title={translate("Dialog_UpdateManager_Title", "Update Manager")} 
  icon="" 
  open={uiContext.updateManagerModal_isOpen}
  actions=
    {[
      <button type="button" key="cancel" onClick={() => 
      { 
        closeUpdateManager();
      }}>
        {translate("Dialog_FirmwareUpdate_CancelButton", "Cancel")}
      </button>,
      <button type="button" key="ok" onClick={() => 
      { 
        setConfirmationDialogIsOpen(true); 
        confirmationResolve.current = (result) =>
        {
          setConfirmationDialogIsOpen(false); 
          if(result == false) { return; }
          beginFirmwareUpdates();
        }
      }}>
        {translate("Dialog_FirmwareUpdate_OkButton", "Ok")}
      </button>,
    ]}>
    {(firmwareUpdaterStep == 'device-select') ?
      <>
      <header>
        <div className="description">
          <p>{translate("Dialog_UpdateManager_DevicesHaveUpdates", "The highlighted devices in the device list have firmware updates available!")}</p>
          <p>{translate("Dialog_UpdateManager_SelectDevices", "Select the devices you would like to update:")}</p>
        </div>
      </header>
      <div className="devices">
        <ul className="items">
          {(devicesContext.devices == null || devicesContext.devices.length == 0) ? 
          <li className='no-items' key="Option_NoDevices"><em>{translate("Option_NoDevices", "No Devices Available")}</em></li> :
          devicesContext.devices.map((device, index) => {
          
          return <li className={`item device${(selectedDevices.find(item => item.SN == device.SN) != null) ? " selected" : ""}${(devicesWithUpdatesAvailable.find(item => item.SN == device.SN) != null) ? ' has-update' : ''}`}
          key={device.SN + index}
          onClick={async (event) =>
          {
            event.stopPropagation();
            event.preventDefault();

            const newSelectedDevicesValue = structuredClone(selectedDevices);
            // console.log(newValue);
            const selectedDeviceIndex = selectedDevices.findIndex(item => item.SN == device.SN);

            // let newSelectedDevice = null;
            if(selectedDeviceIndex == null)
            {
              // newSelectedDevice = device;
              // console.log(newValue);
              // setSelectedDevices(newSelectedDevicesValue);
              // return;
            }

            // const selectedIndex = selectedDevices.indexOf(selectedDeviceIndex);
            if(selectedDeviceIndex== -1)
            {
              // newSelectedDevice = device;
              const firmwareData = await getFirmwareVersionDataFromServer(device.SN);
              newSelectedDevicesValue.push(firmwareData);
              // newSelectedDevicesValue.push(device);
              // // console.log(newValue);
              // setSelectedDevices(newSelectedDevicesValue);
              // return;
            }
            else
            {
              newSelectedDevicesValue.splice(selectedDeviceIndex, 1);
            }

            // console.log(newValue);
            setSelectedDevices(newSelectedDevicesValue);
          }}>
            <div className="column">
              <SVGIconComponent src="/images/icons/save-check.svg" />
            </div>
            <div className="column">
              <Icon type={device.iconType} size={IconSize.Larger} />
            </div>
            <div className="status">
              <header>{device.devicename}</header>
              <ul className="tasks">
                {(selectedDevices.find(item => item.SN == device.SN) == null) ? <></> : 
                DeviceUpdateTasks.get(device.SN)!.map((task, index) => {
                  const totalAccountedPercentage = DeviceUpdateTasks.get(device.SN)!.reduce((acc, item) => {return (item.percentageOfTotal == null) ? acc : acc + item.percentageOfTotal}, 0);
                  const undefinedPercentageItems = DeviceUpdateTasks.get(device.SN)!.filter(item => item.percentageOfTotal == null);
                  const calculatedPercentage = (100 - totalAccountedPercentage) / undefinedPercentageItems.length;
                  
                  const percentage = (task.percentageOfTotal != null) ? task.percentageOfTotal : calculatedPercentage;

                  const downloadProgress = (downloadProgressMap.get(device.SN) == null) ? 0 : downloadProgressMap.get(device.SN);
                  const updateProgressValue = (updateProgressMap.get(device.SN) == null) ? 0 : updateProgressMap.get(device.SN);
                  let updateProgressPercent_Device;
                  let updateProgressPercent_Accessory;
                  if(Array.isArray(updateProgressValue))
                  {
                    updateProgressPercent_Device = updateProgressValue[0];
                    updateProgressPercent_Accessory = updateProgressValue[1];
                  }
                  else
                  {
                    updateProgressPercent_Device = updateProgressValue;
                  }

                  console.log(downloadProgress, updateProgressMap, updateProgressValue, updateProgressPercent_Device, updateProgressPercent_Accessory);

                  const currentValue = (index == 0) ? downloadProgress : (index == 1) ? updateProgressPercent_Device : updateProgressPercent_Accessory;

                  // console.log(downloadProgress);

                  return <li className="task" key={device.SN + index} title={task.translate} style={{"--width": `${percentage}%`} as React.CSSProperties}>
                    <progress max="100" value={currentValue} />
                  </li>
                })}
              </ul>
            </div>
          </li>})}
        </ul>
      </div>
      </>
    : ""
    }
  </ContentDialogComponent>
  <ContentDialogComponent className="confirmation" title={translate("Dialog_UpdateManager_PreUpdateWarning_Title", "Warning")} 
  icon={confirmationDialogData.icon} 
  open={confirmationDialogIsOpen} 
  actions=
  {[
    <button type="button" key="Button_Cancel" onClick={() => 
      {
        if(confirmationResolve.current != null) { confirmationResolve.current(false); }
        setConfirmationDialogIsOpen(false); 
      }}>
        {translate("Button_Cancel", "Cancel")}
      </button>,
    <button type="button" key="Button_Ok" onClick={() => 
      { 
        if(confirmationResolve.current != null) { confirmationResolve.current(true); }
        setConfirmationDialogIsOpen(false); 
      }}>
        {translate("Button_Ok", "Ok")}
      </button>,
  ]}>
    <section>{translate("Dialog_UpdateManager_PreUpdateWarning_Description", "Some of the selected devices for updates do not have both their cable and wireless receiver plugged in. Are you sure you want to continue?")}</section>
  </ContentDialogComponent>
  </div>)
}

export default UpdateManagerComponent;