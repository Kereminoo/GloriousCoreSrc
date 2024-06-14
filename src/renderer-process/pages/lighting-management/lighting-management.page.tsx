import KeyboardLightingManagementPage from './keyboard-lighting-management';
import MouseLightingManagementPage from './mouse-lighting-management';
import './lighting-management.page.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import valueJLightingManagementPage from './valueJ-lighting-management.page';

function LightingManagementPage(props:any) 
{
  const devicesContext = useDevicesContext();

  return (<>{(devicesContext.previewDevice?.deviceCategoryName == "Mouse") ? 
  <MouseLightingManagementPage /> :
  (devicesContext.previewDevice?.deviceCategoryName == "Keyboard" || devicesContext.previewDevice?.deviceCategoryName == "Numpad") ? 
  <KeyboardLightingManagementPage /> 
  : (devicesContext.previewDevice?.deviceCategoryName == "valueJ") ? 
  <>
  <valueJLightingManagementPage />
  </> 
  : (devicesContext.previewDevice?.deviceCategoryName == "valueE") ? 
  <>
    <a>An Error has occurred.</a>
  </> 
  : <></>}</>);
}

export default LightingManagementPage