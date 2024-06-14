import React, { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { DeviceInputLayoutMap, LayoutNode } from '../../../common/data/device-input-layout.data';
import DeviceKeybindingSelectionNodeComponent from './device-lighting-selection-node/device-lighting-selection-node.component';
import './device-lighting-selection.component.css';
import DeviceLightingSelectionNodeComponent from './device-lighting-selection-node/device-lighting-selection-node.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useRecordsContext } from '@renderer/contexts/records.context';

function DeviceLightingSelectionComponent(props: any) 
{
  // const { previewDevice, uiState, onChange, lightingLayouts } = props;

  const devicesContext = useDevicesContext();
  const { getCurrentProfile, 
    addToPerKeyLayoutSelection,
    removeFromPerKeyLayoutSelection,
   } = useDevicesManagementContext();

   const recordsContext = useRecordsContext();

  const uiContext = useUIContext();
  // const { setPerkeylightingSelectedNode, setPerkeylightingSelectedNodeIndex } = useUIUpdateContext();

  // const [selectedValue, setSelectedValue] = useState(uiContext.lightingSelectedNode);
  // const [selectedNode, setSelectedNode] = useState(null);

  const [hoverNode, setHoverNode] = useState<LayoutNode|null>(null);

  const lightingCanvas = useRef(null);
  const nodes = useRef(null);
  const [nodeItems, setNodeItems] = useState(new Array());

  const handleNodeClick = (nodeDefinition) =>
  {
    // const profile = getCurrentProfile();
    // if (profile == null || profile.light_PERKEY_Data == null) {
    //     console.error(new Error("Current Device's perkey lighting data is undefined."));
    //     return;
    // }
    // const lightingLayout = recordsContext.lightingLayouts.find(item => item.SN == devicesContext.previewDevice?.SN);
    // if(lightingLayout == null)
    //   {
    //     console.error(new Error(`Unable to find the current device's layout category based on the SN: ${devicesContext.previewDevice?.SN}`));
    //     return;
    //   }
    // const lightingArray = lightingLayout.content.AllBlockColor;

    // const lightingItem = lightingArray[nodeDefinition.keybindArrayIndex];
    // console.log(nodeDefinition, lightingItem);
    addToPerKeyLayoutSelection([nodeDefinition.keybindArrayIndex]);
  };

  useEffect(() =>
  { 
    if(devicesContext.previewDevice == null) { return; }

    const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
    // const deviceInputLayout: any = DeviceInputLayoutData[devicesContext.previewDevice.SN];
    if(deviceInputLayout == null)
    {
      return;
    }

    const colorNodes: LayoutNode[] = [];
    for(let i = 0; i < deviceInputLayout.layoutNodes.length; i++)
    {
      const node = deviceInputLayout.layoutNodes[i];
      if(!node.hasLight)
      {
        continue;
      }
      node.keybindArrayIndex = i;
      colorNodes.push(node);
    }
 
      
    const nodeItems: any[] = [];
    for(let i = 0; i < colorNodes.length; i++)
    {
      const nodeDefinition = colorNodes[i];

      const position = {
        x: (deviceInputLayout.nodeBaseOffset != null) ? deviceInputLayout.nodeBaseOffset.x + nodeDefinition.position.x : nodeDefinition.position.x,
        y: (deviceInputLayout.nodeBaseOffset != null) ? deviceInputLayout.nodeBaseOffset.y + nodeDefinition.position.y : nodeDefinition.position.y,
      }

      const size = {
        width: (nodeDefinition.size == null) ? deviceInputLayout.nodeBaseSize?.width ?? 65 : nodeDefinition.size.width,
        height: (nodeDefinition.size == null) ? deviceInputLayout.nodeBaseSize?.height ?? 65 : nodeDefinition.size.height,
      } 
      
      nodeItems.push(<DeviceLightingSelectionNodeComponent
      title={nodeDefinition.translationKey}
      key={i}
      x={position.x}
      y={position.y}
      width={size.width}
      height={size.height}
      onClick={() => { handleNodeClick(nodeDefinition); }}
      selected={uiContext.perKeyLightingSelectedNode==nodeDefinition}
      onHoverStart={() => { setHoverNode(nodeDefinition); }}
      onHoverEnd={() => { setHoverNode(null); }}
        />)
    }
    setNodeItems(nodeItems);

   
  }, [devicesContext.previewDevice]);
  
  const getKeyData = (profile: any, index: number) =>
  {
    if(profile == null) { return; }
    const currentKeyArray = profile.assignedKeyboardKeys[profile.fnModeindex];
    const currentKey = currentKeyArray[index];
    return currentKey;
  }

  const getDisplayedNodeName = (index: number, fallback: string) =>
  {
    const keyData = getKeyData(getCurrentProfile(), index);
    if(keyData == null || keyData.recordBindCodeName == "Default") { return fallback; }

    return keyData.recordBindCodeName;
  }

  const getNodeItemIndex = (node: any) =>
  {
    if(devicesContext.previewDevice == null) { return; }
    const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
    // const layout = DeviceInputLayoutData[devicesContext.previewDevice.SN];
    if(deviceInputLayout == null) { return -1; }
    return deviceInputLayout.layoutNodes.findIndex(item => item.translationKey == node.translationKey);
  }

  return  (devicesContext.previewDevice?.deviceCategoryName == "Keyboard" || devicesContext.previewDevice?.deviceCategoryName == "Numpad") ?
  <>
    <div className="lighting-selection" ref={nodes}>
        {nodeItems}
    </div>
  </>
  : 
<></>
}

export default DeviceLightingSelectionComponent;