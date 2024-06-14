import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceInputLayoutMap } from '../../../common/data/device-input-layout.data';
import DeviceKeybindingSelectionNodeComponent from './device-keybinding-selection-node/device-keybinding-selection-node.component';
import './keyboard-keybinding-selection.component.css';
import { DeviceService } from '@renderer/services/device.service';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useTranslate } from '../../contexts/translations.context';
import { KeyMapping } from '../../../common/SupportData';
import { BindingTypes_KeyPress, BindingTypes_RotaryPress, BindingTypes_Rotation } from '@renderer/data/binding-type';
import { DisplayOption } from '@renderer/data/display-option';
import { ModifierKeys } from '@renderer/data/modifier-key';
import { KeyboardFunctions } from '@renderer/data/keyboard-function';
import { MouseFunctions } from '@renderer/data/mouse-function';
import { MultimediaOptions } from '@renderer/data/multimedia-option';
import { ShortcutTypes } from '@renderer/data/shortcut-option';
import { WindowsFunctionShortcuts } from '@renderer/data/windows-shortcut-option';

function KeyboardKeybindingSelectionComponent(props: any) {
    // const { previewDevice, uiState, onUIStateUpdate } = props;

    // const [selectedValue, setSelectedValue] = useState(parentSelectedValue);
    // const [selectedNode, setSelectedNode] = useState(null);
    const [bindingTypes, setBindingTypes] = useState<DisplayOption[]>([]);
    const translate = useTranslate();
    const devicesContext = useDevicesContext();
    const { 
    } = useDevicesManagementContext();
    const uiContext = useUIContext();
    const { 
        setKeybindingType,
        setKeybindSoundControlSelection,
        setKeybindAudioToggleTarget,
        setKeybindMacroSelection,
        setKeybindingSelectedNode,
        setRotaryEncoderAction,

        
        setKeybindingKeyCode,
        setKeybindingKeyModifier,
        setKeybindingKeyboardFunction,
        setKeybindSelectedMouseFunction,
        setKeybindSelectedMultimediaFunction,
        setKeybindDisabledIsSelected,
        setKeybindSelectedShortcutType,
        setKeybindSelectedShortcutProgramPath,
        setKeybindSelectedShortcutUrl,
        setKeybindSelectedWindowsOption,

    } = useUIUpdateContext();

    const [hoverNode, setHoverNode] = useState(null);
    const nodes = useRef(null);
    const [nodeItems, setNodeItems] = useState([]);
    const [currentProfile, setCurrentProfile] = useState<any>(null);
    const [selectedNodePosition, setSelectedNodePosition] = useState({ x: 0, y: 0 });

    // const handleNodeClick = (nodeDefinition) =>
    // {
    //   setSelectedNode(nodeDefinition);
    //   setSelectedValue(nodeDefinition);
    //   if(onChange != null) { onChange(nodeDefinition); }

    //   setHoverNode(null); // changes header text to have gold border
    // };

    const handleNodeClick = (nodeDefinition, index) => {
        setKeybindingSelectedNode(nodeDefinition, index);

        if(currentProfile == null) { return; }        
        
        const currentKeyArray = currentProfile.assignedKeyboardKeys[currentProfile.fnModeindex];
        const selectionCodeValue = KeyMapping.find(
            (item) => item.code == uiContext.keybindSelectedNode!.translationKey,
        );
        if (selectionCodeValue == null) {
            console.error('Could not find selectd key in keymap');
            return;
        }
        const selectionComparisonValue = selectionCodeValue.value;
        const selectedKey = currentKeyArray.find((item) => {
            //[dmercer]todo: refactor supportdb and refresh device db so that this value is stored instead of "ScrollWheel"
            if (selectionComparisonValue == 'Volume') {
                return item.defaultValue == 'ScrollWheel';
            }
            return item.defaultValue == selectionComparisonValue;
        });

        console.log(selectedKey);
        if (selectedKey == null || selectedKey.recordBindCodeType == '') {
            console.log(bindingTypes[0]);
            setKeybindingType(bindingTypes[0]);
            return;
        }
        const bindOption = bindingTypes.find(item => item.data.bindingCode == selectedKey.recordBindCodeType);
        if(bindOption == null) { throw new Error("Unknown bind option assigned to key"); }

        setKeybindingType(bindOption);
        if(bindOption.optionKey == 'keystroke')
        {
            // key
            if(selectedKey.recordBindCodeName != 'Default' && selectedKey.recordBindCodeName != 'Option_BindingTypes_keystroke')
            {
                setKeybindingKeyCode(selectedKey.recordBindCodeName);
            }
            // modifiers
            if(selectedKey.Alt == true)
            {
                const modifierOption = ModifierKeys.find(item => item.value == 'alt');
                if(modifierOption != null)
                {
                    setKeybindingKeyModifier(modifierOption);
                }
            }
            else if(selectedKey.Ctrl == true)
            {
                const modifierOption = ModifierKeys.find(item => item.value == 'ctrl');
                if(modifierOption != null)
                {
                    setKeybindingKeyModifier(modifierOption);
                }
            }
            else if(selectedKey.Shift == true)
            {
                const modifierOption = ModifierKeys.find(item => item.value == 'shift');
                if(modifierOption != null)
                {
                    setKeybindingKeyModifier(modifierOption);
                }
            }
            else if(selectedKey.Windows == true)
            {
                const modifierOption = ModifierKeys.find(item => item.value == 'windows');
                if(modifierOption != null)
                {
                    setKeybindingKeyModifier(modifierOption);
                }
            }

        }
        else if(bindOption.optionKey == 'keyboardFunction')
        {
            const item = KeyboardFunctions.find(item => item.data.bindingValue == selectedKey.recordBindCodeName);
            if(item != null)
            {
                setKeybindingKeyboardFunction(item);
            }
        }
        else if(bindOption.optionKey == 'mouseFunction')
        {
            const item = MouseFunctions.find(item => item.data.bindingValue == selectedKey.recordBindCodeName);
            if(item != null)
            {
                setKeybindSelectedMouseFunction(item);
            }
        }
        else if(bindOption.optionKey == 'macro')
        {
            setKeybindMacroSelection(selectedKey.macro_Data);
        }
        else if(bindOption.optionKey == 'multimedia')
        {
            const item = MultimediaOptions.find(item => item.data.bindingValue == selectedKey.recordBindCodeName);
            if(item != null)
            {
                setKeybindSelectedMultimediaFunction(item);
            }
        }
        else if(bindOption.optionKey == 'shortcuts')
        {
            const item = ShortcutTypes.find(item => item.data.bindingValue == selectedKey.recordBindCodeName);
            if(item != null)
            {
                setKeybindSelectedShortcutType(item);

                if (bindOption.value == 1)
                {
                    // LaunchProgram
                    setKeybindSelectedShortcutProgramPath(selectedKey.ApplicationPath);
                }
                else if (bindOption.value == 2) 
                {
                    // LaunchWebsite
                    setKeybindSelectedShortcutUrl(selectedKey.WebsitePath);
                } 
                else if (bindOption.value == 3) 
                {
                    // WindowsFunction
                    const windowsOption = WindowsFunctionShortcuts.find(item => item.data.bindingValue == selectedKey.recordBindCodeName);
                    setKeybindSelectedWindowsOption(windowsOption);
                }
            }
        }
        else if(bindOption.optionKey == 'audioToggle')
        {
            
        }
        else if(bindOption.optionKey == 'soundControl')
        {
            
        }
        else if(bindOption.optionKey == 'disable')
        {
            setKeybindDisabledIsSelected(true);
        }

        // console.log(selectedKey);
        // selectedKey.recordBindCodeType = option.data.bindingCode;
        // selectedKey.recordBindCodeName = option.translationKey;


        // uiContext.keybindSelectedNode = nodeDefinition;
        // uiContext.keybindSelectedNodeIndex = index;
        // update(uiContext);
        // if(onUIStateUpdate != null) { onUIStateUpdate(uiContext); }
    };

    const getKeyData = (profile: any, index: number) => {
        if (profile == null) {
            return;
        }
        const currentKeyArray = profile.assignedKeyboardKeys[profile.fnModeindex];
        const currentKey = currentKeyArray[index];
        return currentKey;
    };
    
    useEffect(() => {

        const profile = DeviceService.getDeviceProfile(devicesContext.previewDevice);
        setCurrentProfile(profile);

        if (devicesContext.previewDevice == null || uiContext.keybindSelectedNode == null) {
            setBindingTypes(BindingTypes_KeyPress);
            return;
        }
        if (devicesContext.previewDevice.deviceCategoryName == 'Numpad') {
            if (uiContext.keybindSelectedNode.isRotary) {
                if (uiContext.keybindSelectedRotaryEncoderAction?.value == 0) {
                    setBindingTypes(BindingTypes_RotaryPress);
                } else if (uiContext.keybindSelectedRotaryEncoderAction?.value == 1) {
                    setBindingTypes(BindingTypes_Rotation);
                } else {
                    setBindingTypes(BindingTypes_KeyPress);
                }
            } else {
                setBindingTypes(BindingTypes_KeyPress);
            }
        } else if (devicesContext.previewDevice.deviceCategoryName == 'Keyboard') {
            setBindingTypes(BindingTypes_KeyPress);
        }
    }, [devicesContext.previewDevice]);

    useEffect(() => {
        if (devicesContext.previewDevice == null || currentProfile == null) {
            return;
        }

        const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
        // const deviceInputLayout: any = DeviceInputLayoutData[devicesContext.previewDevice.SN];
        // console.log(previewDevice.SN);
        if (deviceInputLayout == null) {
            return;
        }

        if (deviceInputLayout.selectedNodePosition != null) {
            setSelectedNodePosition(deviceInputLayout.selectedNodePosition);
        }

        const nodeItems: any[] = [];
        const keyNodeDefinitions = deviceInputLayout.layoutNodes.filter(item => item.isKey == true);
        for (let i = 0; i < keyNodeDefinitions.length; i++) {
            const nodeDefinition = keyNodeDefinitions[i];

            const keyData = getKeyData(currentProfile, i);
            // console.log(keyData);
            const hasBindValue = keyData != null && keyData.recordBindCodeName != 'Default';

            const isSelected = uiContext.keybindSelectedNode?.translationKey == nodeDefinition.translationKey;

            const name = hasBindValue == true ? keyData.recordBindCodeName : nodeDefinition.translationKey;

            const position = {
                x:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.x + nodeDefinition.position.x
                        : nodeDefinition.position.x,
                y:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.y + nodeDefinition.position.y
                        : nodeDefinition.position.y,
            };

            const size = {
                width:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.width ?? 65
                        : nodeDefinition.size.width,
                height:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.height ?? 65
                        : nodeDefinition.size.height,
            };

            //   if(hasBindValue)
            //   {
            //     console.log(keyData);
            //   }

            nodeItems.push(<DeviceKeybindingSelectionNodeComponent
                title={nodeDefinition.translationKey}
                key={i}
                x={position.x}
                y={position.y}
                width={size.width}
                height={size.height}
                onClick={() => {
                    handleNodeClick(nodeDefinition, i);
                }}
                selected={isSelected}
                hasBindValue={hasBindValue}
                onHoverStart={() => {
                    setHoverNode(nodeDefinition);
                }}
                onHoverEnd={() => {
                    setHoverNode(null);
                }}
            />);
        }
        setNodeItems(nodeItems);
    }, [devicesContext.previewDevice, currentProfile, uiContext.keybindSelectedNode]);

    const getDisplayedNodeName = (index: number, fallback: string) => {
        const keyData = getKeyData(currentProfile, index);
        if (keyData == null || keyData.recordBindCodeName == 'Default') {
            return translate(fallback);
        }

        return translate(keyData.recordBindCodeName);
    };

    const getNodeItemIndex = (node: any) => {
        if (devicesContext.previewDevice == null) {
            return;
        }
        const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
        // const layout = DeviceInputLayoutData[devicesContext.previewDevice.SN];
        if (deviceInputLayout == null) {
            return -1;
        }
        return deviceInputLayout.layoutNodes.filter(item => item.isKey == true).findIndex((item) => item.translationKey == node.translationKey);
    };

    return (
        <>
            <div
                className="selected-node"
                style={{ position: 'relative', top: selectedNodePosition.y, left: selectedNodePosition.x }}
            >
                {hoverNode != null ? (
                    <span className="hover">
                        {getDisplayedNodeName(getNodeItemIndex(hoverNode), (hoverNode as any).translationKey)}
                    </span>
                ) : uiContext.keybindSelectedNode != null ? (
                    <span className="selected">
                        {getDisplayedNodeName(
                            uiContext.keybindSelectedNodeIndex,
                            (uiContext.keybindSelectedNode as any).translationKey,
                        )}
                    </span>
                ) : null}
            </div>
            <div className="keybinding-selection keyboard" ref={nodes}>
                {nodeItems}
            </div>
        </>
    );
}

export default KeyboardKeybindingSelectionComponent;
