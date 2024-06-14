import './mouse-home-dash.css';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useEffect, useMemo, useState } from 'react';
import { getVersion } from '@renderer/services/device.service';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useParams } from 'react-router';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';
import BatteryPill from '../battery-pill/battery-pill';
import FirmwarePill, { FirmwareUpdateStatus } from '../firmware-pill/firmware-pill';
import WirelessConnectionPill, {
    WirelessConnectionStrength,
} from '../wireless-connection-pill/wireless-connection-pill';
import DPIPill from '../dpi-pill/dpi-pill';
import { DPIStageData } from 'src/common/data/records/device-data.record';
import { UpdatesService } from '@renderer/services/updates.service';
import DeviceColorsSwatch from '../color-picker/device-colors-swatch';

const DisplayDeviceColorsIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function MouseHomeDash() {
    const { subpage } = useParams();
    const { previewDevice } = useDevicesContext();
    const { unsavedPropertyNames } = useUIContext();
    const translate = useTranslate();
    const { openDeviceUpdateModal } = useUIUpdateContext();
    const { getCurrentProfile } = useDevicesManagementContext();

    const currentActiveProfile = useMemo(() => {
        return previewDevice?.deviceData?.profile.find(
            (profile) => profile.profileName === getCurrentProfile()?.profileName,
        );
    }, [previewDevice]);

    const [defaultDPIStage, setDefaultDpiStage] = useState<DPIStageData | null>(null);
    const [firmwareStatus, setFirmwareStatus] = useState<FirmwareUpdateStatus>(FirmwareUpdateStatus.UpToDate);

    useEffect(() => {
        if (
            getCurrentProfile()?.performance?.DpiStage == null ||
            getCurrentProfile()?.performance?.dpiSelectIndex == null
        ) {
            return;
        }
        // console.log(getCurrentProfile().performance.DpiStage[getCurrentProfile().performance.dpiSelectIndex])
        setDefaultDpiStage(getCurrentProfile().performance.DpiStage[getCurrentProfile().performance.dpiSelectIndex]);
    }, [getCurrentProfile()?.performance?.DpiStage, getCurrentProfile()?.performance?.dpiSelectIndex]);

    useEffect(() =>
    {
      updateFirmwareStatus();
    }, [previewDevice]);

    const updateFirmwareStatus = async () => {
        if (previewDevice == null) {
            return;
        }
        const hasUpdates = await UpdatesService.checkIfDeviceHasUpdatesAvailable(previewDevice);
        setFirmwareStatus(hasUpdates == true ? FirmwareUpdateStatus.HasUpdate : FirmwareUpdateStatus.UpToDate);
    };

    return (
      <div className="layout home mouse-dash">
        <div className="panel main">
          <div className="background">
              <Icon type={IconType.GloriousLogo} width="507px" height="329px" color={Color.Base70} />
          </div>
          <div className="content">
            <div className='device-name'>
                <h2>{previewDevice?.devicename}</h2>
            </div>
            {(subpage == undefined || subpage == 'settings') 
            ? <>
              <div className="profile-tile">
                <span className="profile-name">
                  {currentActiveProfile?.profileName}
                </span>
                <span className="status">
                  {(currentActiveProfile != null) ? "Active" : undefined}
                </span>
              </div>
              <div className='device-states'>
                {!previewDevice?.StateArray.includes('USB') && (
                  <WirelessConnectionPill connectionStrength={WirelessConnectionStrength.Strong} />
                )}
                {previewDevice != undefined && previewDevice.pid.length > 1 && 
                  <BatteryPill value={previewDevice?.batteryvalue as number} />
                }
              </div>
              <div className='firmware'>
                <FirmwarePill version={(previewDevice != null) ? getVersion(previewDevice) : undefined } 
                size={(firmwareStatus == FirmwareUpdateStatus.Updating) ? IconSize.Small : IconSize.XSmall} 
                updateStatus={firmwareStatus}
                updateOnClick={() =>
                {
                  openDeviceUpdateModal();
                }} />
              </div>
            </>
            : (subpage == 'dpi' && defaultDPIStage != null)
            ? <div className="dpi">
                <DPIPill value={defaultDPIStage.value} color={`#${defaultDPIStage.color}`} size={24} padding={4} useHoverEffect={false} />
              </div>
            : undefined
            }
            {unsavedPropertyNames.size > 0 ? (
              <div className='unsaved-changes'>
                <span>{translate('Device_Home_Dash_Label_Unsaved_Changes', 'Unsaved Changes')}</span>
              </div>
            ) : null}
            {(subpage == "lighting"
            && getCurrentProfile()?.lighting?.Effect != null && DisplayDeviceColorsIndexes.indexOf(getCurrentProfile()?.lighting?.Effect) > -1) ?
              <DeviceColorsSwatch deviceColorArray={getCurrentProfile()?.lighting?.Color} />
              : <></>
            }
          </div>
          </div>
    </div>
  )
}

export default MouseHomeDash;
