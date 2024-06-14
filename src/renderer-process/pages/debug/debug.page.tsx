import { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react'
import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import './debug.page.css'
import MacroEditorComponent from '@renderer/components/macro-editor/macro-editor.component';

function DebugPage(props: any) 
{
  // const { lastDataSent, mockDevices } = props;

  // const [mockedDevices, setMockedDevices] = useState(mockDevices);
  // const [currentDevice, setCurrentDevice] = useState(lastDataSent.currentUiDeviceState);
  // const [previewDevice, setPreviewDevice] = useState(lastDataSent.previewUiDeviceState);
  // const [keyboardData, setKeyboardData] = useState(lastDataSent.keyboardData);
  // useEffect(() =>
  // {
  //   setMockedDevices(mockDevices);
  // }, [mockDevices]);

  // useEffect(() =>
  // {
  //   console.log(lastDataSent);
  //   setCurrentDevice(lastDataSent.currentUiDeviceState);
  //   setPreviewDevice(lastDataSent.previewUiDeviceState);
  //   setKeyboardData(lastDataSent.keyboardData);
  // }, [lastDataSent]);

  



  return (<div className="debug-page">
    <MacroEditorComponent isOpen={true}></MacroEditorComponent>
    </div>)
}

export default DebugPage