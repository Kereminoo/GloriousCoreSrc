import { useState } from 'react'
import KeyboardPerformanceManagementPage from './keyboard-performance-management.page';
import './performance-management.page.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';

function PerformanceManagementPage(props:any) 
{
  const devicesContext = useDevicesContext();
  const translate = useTranslate();

  return <>{(devicesContext.previewDevice?.deviceCategoryName == "Keyboard" || devicesContext.previewDevice?.deviceCategoryName == "Numpad") ?
  <KeyboardPerformanceManagementPage /> :
  <p>{translate("Error_Device_LoadingSelectedDevice", "There was an error loading the selected device.")}</p>}</>;
}

export default PerformanceManagementPage