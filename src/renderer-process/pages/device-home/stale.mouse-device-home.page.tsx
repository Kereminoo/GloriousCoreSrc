import OptionSelectComponent from '@renderer/components/option-select/option-select.component';
import RangeComponent from '@renderer/components/range/range.component';
import ToggleComponent from '@renderer/components/toggle/toggle.component';
import TooltipComponent from '@renderer/components/tooltip/tooltip.component';
import { getVersion } from '@renderer/services/device.service';
import { useMemo } from 'react';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { useUIUpdateContext } from '@renderer/contexts/ui.context';
import { ImportExport } from '../../services/import-export.service';
import UnsavedPropertyIndicatorComponent from '@renderer/components/unsaved-property-indicator/unsaved-property-indicator.component';

function MouseDeviceHomePage() {
    const { previewDevice } = useDevicesContext();
    const translate = useTranslate();

    const { setCurrentProfile, setRgbOffAfterInactivity, setRgbOffAfterInactivityTime } = useDevicesManagementContext();

    const { openUpdateManager } = useUIUpdateContext();

    const profileOptions = useMemo(() => {
        if (previewDevice == null || previewDevice.deviceData == null) return;
        
        return previewDevice
            .deviceData.profile
            .map((profile, idx) => ({ value: idx.toString(), label: profile.profileName}));

    }, [previewDevice]);

    const doImport = () => {
        console.log('clicked import');
        const deviceData = previewDevice?.deviceData;
        if (deviceData) {
            new ImportExport(deviceData).importProfile().then((res) => console.log(res));
        }
    };
    const doExport = () => {
        console.log('clicked export');
        const deviceData = previewDevice?.deviceData;
        if (deviceData) {
            new ImportExport(deviceData).exportProfile().then((res) => console.log(res));
        }
    };

    return (
        <>
            <div className="panel main mouse">
                <header>
                    {previewDevice != null
                        ? translate(`DeviceName_${previewDevice.SN}`, '')
                        : ''}
                </header>
                <div className="center">
                    <div className="firmware">
                        <header className="current">
                            <span>{translate('Device_Home_Label_Firmware', 'Firmware')}</span>
                            <span className="value">
                                {previewDevice != null ? getVersion(previewDevice) : ''}
                            </span>
                        </header>
                        <div>
                            <button
                                className="secondary"
                                type="button"
                                onClick={() => {
                                    openUpdateManager();
                                }}
                            >
                                {translate('Button_CheckForFirmwareUpdates', 'Check For FW Update')}
                            </button>
                        </div>
                    </div>
                    <div className="sleep">
                        <header>
                            <div className="title">
                                {translate('Device_Home_Label_RGBOffAfterInactivity', 'RGB off after inactivity')}
                            </div>
                            <label>
                                <ToggleComponent
                                    value={previewDevice?.rgbOffAfterInactivity}
                                    onChange={(value) => {
                                        setRgbOffAfterInactivity(value);
                                    }}
                                />
                            </label>
                        </header>
                        <label className="field">
                            <RangeComponent
                                value={previewDevice?.rgbOffAfterInactivityTime}
                                onChange={(value) => {
                                    setRgbOffAfterInactivityTime(value);
                                }}
                            />
                            <span>{previewDevice?.rgbOffAfterInactivityTime}</span>
                        </label>
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
                                <header>{translate('Tooltip_Profiles_Title', 'Profiles')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_Profiles_Description',
                                        'Exporting a profile allows you to save custom settings. Importing a profile will allow you to apply custom settings from that profile. You can have up to three profiles in CORE at once.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <OptionSelectComponent
                            value={previewDevice?.deviceData?.profileindex}
                            options={profileOptions}
                            onChange={(value) => {
                                const profileIndex = parseInt(value);
                                setCurrentProfile(profileIndex);
                            }}
                        />
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
        </>
    );
}

export default MouseDeviceHomePage;
