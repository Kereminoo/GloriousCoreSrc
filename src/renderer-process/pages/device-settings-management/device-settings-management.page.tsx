import MouseDeviceSettingsManagementPage from './mouse-device-settings-management';
import './device-settings-management.page.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import MouseProDeviceSettingsManagementPage from './mouse-pro-device-settings-management';
import { DevicesAdapter } from '@renderer/adapters/devices.adapter';

function DeviceSettingsManagementPage(props: any) {
    const devicesContext = useDevicesContext();

    return devicesContext.previewDevice?.deviceCategoryName == 'Mouse' ? (
        DevicesAdapter.isAdvDebounceCapable(devicesContext.previewDevice.SN) ? (
            <MouseProDeviceSettingsManagementPage />
        ) : (
            <MouseDeviceSettingsManagementPage />
        )
    ) : (
        <a>An Error has occurred.</a>
    );
}

export default DeviceSettingsManagementPage;
