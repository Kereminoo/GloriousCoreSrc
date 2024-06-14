import KeyboardKeybindingManagementPage from './keyboard-keybinding-management';
import MouseKeybindingManagementPage from './mouse-keybinding-management';
import './keybinding-management.page.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';

function KeybindingManagementPage(props:any) 
{
  const devicesContext = useDevicesContext();

  return (<>
    {(devicesContext.previewDevice?.deviceCategoryName == "Mouse") ? 
    <MouseKeybindingManagementPage /> 
  : (devicesContext.previewDevice?.deviceCategoryName == "Keyboard" || devicesContext.previewDevice?.deviceCategoryName == "Numpad") ? 
  <KeyboardKeybindingManagementPage /> 
  : (devicesContext.previewDevice?.deviceCategoryName == "valueE") ? <>
      <a>None</a>
    </> 
  : <></>}</>);
}

export default KeybindingManagementPage;