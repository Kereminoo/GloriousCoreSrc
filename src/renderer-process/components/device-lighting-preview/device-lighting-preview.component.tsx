import React, { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import './device-lighting-preview.component.css';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import MouseLightingPreviewComponent from './mouse-lighting-preview.component';
import KeyboardLightingPreviewComponent from './keyboard-lighting-preview.component';

function DeviceLightingPreviewComponent(props: any) 
{
  const devicesContext = useDevicesContext();

  return (<>{(devicesContext.previewDevice?.deviceCategoryName == "Mouse") ?
  <MouseLightingPreviewComponent /> 
  : (devicesContext.previewDevice?.deviceCategoryName == "Keyboard" || devicesContext.previewDevice?.deviceCategoryName == "Numpad") 
  ? <KeyboardLightingPreviewComponent />
  : <></>
  }
  </>)
}

export default DeviceLightingPreviewComponent;