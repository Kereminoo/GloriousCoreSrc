import { useEffect, useState } from 'react'
import OptionSelectComponent from '../../components/option-select/option-select.component'
import TooltipComponent from '../../components/tooltip/tooltip.component';
import { getVersion } from '../../services/device.service';
import { AppEvent, AppEventChannel } from '@renderer/support/app.events';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { useUIUpdateContext } from '@renderer/contexts/ui.context';
import { ImportExport } from '@renderer/services/import-export.service';
import UnsavedPropertyIndicatorComponent from '@renderer/components/unsaved-property-indicator/unsaved-property-indicator.component';

function KeyboardDeviceHomePage(props:any) 
{
  const [profileOptions, setProfileOptions] = useState<{value: string, label: string}[]>([]);
  const devicesContext = useDevicesContext();
  const translate = useTranslate();
  const
  {
    openUpdateManager
  } = useUIUpdateContext();
  const 
  {
    setCurrentProfile,
  } = useDevicesManagementContext();

  const doImport = () => {
      console.log('clicked import');
      const deviceData = devicesContext.previewDevice?.deviceData;
      if (deviceData) {
          new ImportExport(deviceData).importProfile().then((res) => console.log(res));
      }
  };
  const doExport = () => {
      console.log('clicked export');
      const deviceData = devicesContext.previewDevice?.deviceData;
      if (deviceData) {
          new ImportExport(deviceData).exportProfile().then((res) => console.log(res));
      }
  };

  useEffect(() =>
  {
    if(devicesContext.previewDevice == null) { return; }

    if(devicesContext.previewDevice.deviceData == null) 
    {
      console.error("Device Data is not assigned");
      return;
    }

    const options: {value: string, label: string}[] = [];
    for(let i = 0; i < devicesContext.previewDevice.deviceData.profile.length; i++)
    {
      const profile = devicesContext.previewDevice.deviceData.profile[i];
      options.push({value: i.toString(), label: profile.profileName})
    }
    setProfileOptions(options);
  }, [devicesContext.previewDevice]);

  return (<>
    <div className="panel main keyboard">
      <header>{(devicesContext.previewDevice != null) ? translate(`DeviceName_${devicesContext.previewDevice.SN}`, "") : ""}</header>
      <div className="center">
        <header className="current">
            <span>{translate('Device_Home_Label_Firmware', "Firmware")}</span>
            <span className="value">{(devicesContext.previewDevice != null) ? getVersion(devicesContext.previewDevice) : ""}</span>
        </header>
        <div>
          <button className="secondary" type="button" onClick={()=> 
          {
            openUpdateManager();
          }
          }>
            {translate('Button_CheckForFirmwareUpdates', "Check For FW Update")}
          </button>
        </div>
      </div>
      <div className="profile">
        <label className="field current">
          <span className="label">
            <span className="text">
                <UnsavedPropertyIndicatorComponent propertyKey="profile" />
                {translate('Device_Home_Label_Profile', 'Profile')}
            </span>
            <TooltipComponent>
              <header>
                {translate('Tooltip_Profiles_Title', "Profiles")}
              </header>
              <div className="message">
                {translate('Tooltip_Profiles_Description', "Exporting a profile allows you to save custom settings. Importing a profile will allow you to apply custom settings from that profile. You can have up to three profiles in CORE at once.")}
              </div>
            </TooltipComponent>
          </span>
          <OptionSelectComponent value={devicesContext.previewDevice?.deviceData?.profileindex}
            options={profileOptions}
            onChange={(value) => 
            {
              const profileIndex = parseInt(value);
              setCurrentProfile(profileIndex);
            }}  />
        </label>
        <div className="actions">
            <button className="hollow import" onClick={() => doImport()}>
                <SVGIconComponent src="/images/icons/download.svg" />
                <span className="label">{translate('Button_ImportProfile', 'Import Profile')}</span>
            </button>
            <button className="hollow export" onClick={() => doExport()}>
                <SVGIconComponent src="/images/icons/upload.svg" />
                <span className="label">{translate('Button_ExportProfile', 'Export Profile')}</span>
            </button>
        </div>
      </div>
    </div>
  </>)
}

export default KeyboardDeviceHomePage