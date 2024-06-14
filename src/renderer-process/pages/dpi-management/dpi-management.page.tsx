import { useState } from 'react'
import MouseDPIManagementPage from './mouse-dpi-management.page';
import { useDevicesContext } from '@renderer/contexts/devices.context';

function DPIManagementPage(props:any) 
{
  const devicesContext = useDevicesContext();

  return (<>
    {(devicesContext.previewDevice?.deviceCategoryName == "Mouse") ? 
    <MouseDPIManagementPage /> :
    <a>An Error has occurred</a>}
  </>);
}

export default DPIManagementPage