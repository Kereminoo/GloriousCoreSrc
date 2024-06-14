import './keyboard-home-dash.css';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import FirmwarePill, { FirmwareUpdateStatus } from '../firmware-pill/firmware-pill';
import { getVersion } from '@renderer/services/device.service';
import { IconSize, IconType } from '../icon/icon.types';
import { UpdatesService } from '@renderer/services/updates.service';
import DeviceColorsSwatch from '../color-picker/device-colors-swatch';
import WirelessConnectionPill, {
    WirelessConnectionStrength,
} from '../wireless-connection-pill/wireless-connection-pill';
import BatteryPill from '../battery-pill/battery-pill';
import Icon from '../icon/icon';
import { Color } from '../component.types';

const DisplayDeviceColorsIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function KeyboardHomeDash({ onLayerClick }) {
    const { subpage } = useParams();
    const { previewDevice } = useDevicesContext();
    const { getCurrentLegacyLayerIndex, setCurrentProfileLayer, getCurrentProfile } = useDevicesManagementContext();
    const { unsavedPropertyNames, lightSettingMode, colorPickerValue_PerKeyLighting } = useUIContext();
    const { openDeviceUpdateModal } = useUIUpdateContext();
    const translate = useTranslate();

    const [colors, setColors] = useState<string[]>();
    const [firmwareStatus, setFirmwareStatus] = useState<FirmwareUpdateStatus>(FirmwareUpdateStatus.UpToDate);
    useEffect(() =>
    {
      updateFirmwareStatus();
    }, [previewDevice]);

    const currentActiveProfile = useMemo(() => {
        return previewDevice?.deviceData?.profile.find(
            (profile) => profile.profileName === getCurrentProfile()?.profileName,
        );
    }, [previewDevice]);

    const updateFirmwareStatus = async () =>
    {
      if(previewDevice == null) { return; }
      const hasUpdates = await UpdatesService.checkIfDeviceHasUpdatesAvailable(previewDevice);
      setFirmwareStatus((hasUpdates == true) ? FirmwareUpdateStatus.HasUpdate : FirmwareUpdateStatus.UpToDate);
    }

    const isWireless = (pids: string[]) =>
    {
        if(pids.length < 2)
        {
            return false;
        }
        if(pids[1].startsWith('0xB0'))
        {
            return false;
        }

        return true;
    }

    return (
        <div className="layout home keyboard-dash">
            <div className="panel main">
                <div className="background">
                    <Icon type={IconType.GloriousLogo} width="507px" height="329px" color={Color.Base70} />
                </div>
                <div className="content">
                    <div className="dash-row">
                        <div className="device-name">
                            <h2>{translate(`DeviceName_${previewDevice?.SN}`, previewDevice?.devicename)}</h2>
                        </div>
                    </div>
                    {subpage == undefined || subpage == 'performance' ? (
                        <>
                            <div className="profile-tile">
                                <span className="profile-name">{currentActiveProfile?.profileName}</span>
                                <span className="status">{currentActiveProfile != null ? 'Active' : undefined}</span>
                            </div>
                            <div className="device-states">
                                {previewDevice != undefined &&
                                    previewDevice.pid.length > 1 &&
                                    !previewDevice?.StateArray.includes('USB') && (
                                        <WirelessConnectionPill
                                            connectionStrength={WirelessConnectionStrength.Strong}
                                        />
                                    )}
                                {previewDevice != undefined && isWireless(previewDevice.pid) && (
                                    <BatteryPill value={previewDevice?.batteryvalue as number} />
                                )}
                            </div>
                            <div className="firmware">
                                <FirmwarePill
                                    version={previewDevice != null ? getVersion(previewDevice) : undefined}
                                    size={
                                        firmwareStatus == FirmwareUpdateStatus.Updating
                                            ? IconSize.Small
                                            : IconSize.XSmall
                                    }
                                    updateStatus={firmwareStatus}
                                    updateOnClick={() => {
                                        openDeviceUpdateModal();
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    {subpage == 'lighting' &&
                    DisplayDeviceColorsIndexes.indexOf(getCurrentProfile()?.light_PRESETS_Data?.value) > -1 ? (
                        lightSettingMode == 'per-key' ? (
                            <DeviceColorsSwatch deviceColorArray={[colorPickerValue_PerKeyLighting.toHex()]} />
                        ) : (
                            <DeviceColorsSwatch deviceColorArray={getCurrentProfile()?.light_PRESETS_Data?.colors} />
                        )
                    ) : (
                        <></>
                    )}
                    {unsavedPropertyNames.size > 0 ? (
                        <div className="unsaved-changes">
                            <span>{translate('Device_Home_Dash_Label_Unsaved_Changes', 'Unsaved Changes')}</span>
                        </div>
                    ) : null}
                </div>
            </div>

            {(previewDevice?.deviceCategoryName == 'Keyboard' || previewDevice?.deviceCategoryName == 'Numpad') &&
            ['keybinding', 'actuation', 'advanced-keys'].includes(subpage ?? '') ? (
                <div className="layer-selection">
                    <SVGIconComponent
                        src="/images/icons/layer-selection-top.svg"
                        active="/images/icons/layer-selection-top_selected.svg"
                        selected="/images/icons/layer-selection-top_selected.svg"
                        className={`top${getCurrentLegacyLayerIndex() == 0 ? ' active' : ''}`}
                        onClick={() => {
                            onLayerClick(0);
                        }}
                    />
                    <SVGIconComponent
                        src="/images/icons/layer-selection-center.svg"
                        active="/images/icons/layer-selection-center_selected.svg"
                        selected="/images/icons/layer-selection-center_selected.svg"
                        className={`center${getCurrentLegacyLayerIndex() == 1 ? ' active' : ''}`}
                        onClick={() => {
                            onLayerClick(1);
                        }}
                    />
                    <SVGIconComponent
                        src="/images/icons/layer-selection-bottom.svg"
                        active="/images/icons/layer-selection-bottom_selected.svg"
                        selected="/images/icons/layer-selection-bottom_selected.svg"
                        className={`bottom${getCurrentLegacyLayerIndex() == 2 ? ' active' : ''}`}
                        onClick={() => {
                            onLayerClick(2);
                        }}
                    />
                    <div className="label">
                        <span className="title">Layer</span>
                        <span className="value">{(getCurrentLegacyLayerIndex() + 1).toString()}</span>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default KeyboardHomeDash;
