import { useMemo } from 'react';
import KeyboardDeviceHomePage from './keyboard-device-home.page';
import './device-home.page.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import MouseDeviceHomePage from './mouse-device-home.page';
import valueJDeviceHomePage from './valueJ-device-home.page';

function DeviceHomePage() {
  const { previewDevice } = useDevicesContext();
  const translate = useTranslate();

  const renderDevicePage = useMemo(() => {
    if (!previewDevice) {
      return <p>{translate("Error_Device_NotFound", "Device not found.")}</p>;
    }

    switch (previewDevice.deviceCategoryName) {
      case "Mouse":
        return <MouseDeviceHomePage />;
      case "valueJ":
          return <valueJDeviceHomePage />;
      case "Keyboard":
      case "Numpad":
        return <KeyboardDeviceHomePage />;
      default:
        return (
          <p>
            {translate(
              "Error_Device_LoadingSelectedDevice", 
              "There was an error loading the selected device."
            )}
          </p>
        );
    }
  }, [previewDevice?.deviceCategoryName]);

  return renderDevicePage;
}

export default DeviceHomePage;
