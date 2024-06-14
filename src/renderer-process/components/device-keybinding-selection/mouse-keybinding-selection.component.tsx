import { useEffect, useRef, useState } from 'react';
import { DataMap, DeviceInputLayoutMap, LayoutNode } from '../../../common/data/device-input-layout.data';
import DeviceKeybindingSelectionNodeComponent from './device-keybinding-selection-node/device-keybinding-selection-node.component';
import './mouse-keybinding-selection.component.css';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { WindowsFunctionShortcuts } from '@renderer/data/windows-shortcut-option';
import { MouseFunctions } from '@renderer/data/mouse-function';
import { DPIOptions } from '@renderer/data/dpi-option';
import { MultimediaOptions } from '@renderer/data/multimedia-option';
import { KeyboardFunctions } from '@renderer/data/keyboard-function';

function MouseKeybindingSelectionComponent(props: any) {
    // const { previewDevice, uiState, onUIStateUpdate } = props;

    const devicesContext = useDevicesContext();
    const { getCurrentProfile, getCurrentProfileIndex } = useDevicesManagementContext();
    const uiContext = useUIContext();

    const translate = useTranslate();

    const { setKeybindingSelectedNode } = useUIUpdateContext();

    const nodes = useRef(null);
    const [nodeItems, setNodeItems] = useState<any>([]);
    const [terminationPointItems, setTerminationPointItems] = useState([]);

    const handleNodeClick = (nodeDefinition, index) => {
        setKeybindingSelectedNode(nodeDefinition, index);
    };

    const getAssignmentLabelTranslationKey = (index: number) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            return 'Unknown';
        }

        if (profile.keybinding == null) {
            console.error('Device keybinding data is undefined');
            return 'Unknown';
        }

        const group = profile.keybinding[index].group;
        const value = profile.keybinding[index].value;

        // console.log(group, value);
        if (group == 1) {
            return 'MacroFunction';
            // Macro
        } else if (group == 2) {
            // Shortcut
            const shortcutType = profile.keybinding[index].function;

            if (shortcutType == 1) {
                const translationKey = `File: ${profile.keybinding[index].param}`;
                return translationKey;
            } else if (shortcutType == 2) {
                const translationKey = `URL: ${profile.keybinding[index].param}`;
                return translationKey;
            } else if (shortcutType == 3) {
                const windowsShortcutValue = profile.keybinding[index].param;
                const translationKey = WindowsFunctionShortcuts.find(
                    (item) => item.value == windowsShortcutValue,
                )?.translationKey;
                return translationKey;
            }
        } else if (group == 3) {
            // Mouse Function
            const translationKey = MouseFunctions.find(
                (item) => item.value == profile.keybinding![index].function,
            )?.translationKey;
            return translationKey;
        } else if (group == 4) {
            // DPI Data
            const translationKey = DPIOptions.find(
                (item) => item.value == profile.keybinding![index].function,
            )?.translationKey;
            return translationKey;
        } else if (group == 5) {
            // Multimedia
            const translationKey = MultimediaOptions.find(
                (item) => item.value == profile.keybinding![index].function,
            )?.translationKey;
            return  translationKey;
        } else if (group == 6) {
            // Disable
            return 'Disabled';
        } else if (group == 7) {
            // Key Function
            let keyName = profile.keybinding[index].function;
            let modifierKey = '';
            if (profile.keybinding[index].param != '') {
                modifierKey =
                    profile.keybinding[index].param[0] == true
                        ? 'Shift '
                        : profile.keybinding[index].param[1] == true
                          ? 'Ctrl '
                          : profile.keybinding[index].param[2] == true
                            ? 'Alt '
                            : profile.keybinding[index].param[3] == true
                              ? 'Windows '
                              : '';
            }

            return modifierKey + keyName;
        } else if (group == 8) {
            // Keyboard Function
            const translationKey = KeyboardFunctions.find(
                (item) => item.value == profile.keybinding![index].function,
            )?.translationKey;
            return translationKey;
        }

        return 'Unknown';
        // this.GroupFunction = this.currentDevice.deviceData.profile[profileindex].keybinding[index].group
        // let bottonid = this.currentDevice.deviceData.profile[profileindex].keybinding[index].value
        // //1: Marco, 2:shotcut, 3.Mouse Function, 4.DPI, 5.MultiMedia, 6.Disable, 7:Single/Combination key 8.Keyboard Function
        // switch (this.GroupFunction) {
        //     case 1:
        //         this.macroService.setMacroSelectData(this.currentDevice.deviceData.profile[profileindex].keybinding[index].function);
        //         this.macroService.setMacroTypeData(this.currentDevice.deviceData.profile[profileindex].keybinding[index].param);
        //         this.setButtonName(bottonid, this.macroService.nowMacroSelect.name)
        //         break;
        //     case 2:
        //         this.ShotcutKeyData = this.currentDevice.deviceData.profile[profileindex].keybinding[index].function
        //         if (this.ShotcutKeyData == 1) {
        //             this.WindowsShotcutKeyData = undefined;
        //             this.ApplicationPath = this.currentDevice.deviceData.profile[profileindex].keybinding[
        //                 index
        //             ].param
        //             this.WebsitePath = '';
        //             let ExeName = this.getFileName(this.ApplicationPath)
        //             this.setShortcutButtonName(bottonid, ExeName)
        //         } else if (this.ShotcutKeyData == 2) {
        //             this.WindowsShotcutKeyData = undefined;
        //             this.WebsitePath = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param
        //             this.ApplicationPath = ''
        //             this.setShortcutButtonName(bottonid, this.WebsitePath)
        //         } else {
        //             this.WindowsShotcutKeyData = this.currentDevice.deviceData.profile[profileindex].keybinding[
        //                 index
        //             ].param
        //             this.ApplicationPath = ''
        //             this.WebsitePath = ''
        //             this.setShortcutButtonName(bottonid, this.WindowsShotcutKeyData)
        //         }
        //         break
        //     case 3:
        //         this.MouseKeyMouseFunctionData = this.currentDevice.deviceData.profile[profileindex].keybinding[index].function
        //         this.setMouseFunctionButtonName(bottonid, this.MouseKeyMouseFunctionData)
        //         break
        //     case 4:
        //         this.MouseKeyDpiData = this.currentDevice.deviceData.profile[profileindex].keybinding[index].function
        //         if (this.currentDevice.deviceData.profile[profileindex].keybinding[index].function == 5)
        //             this.DpiLockValue = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param
        //         this.setDpiButtonName(bottonid, this.MouseKeyDpiData)
        //         break
        //     case 5:
        //         this.MouseKeyMulitmediaData = this.currentDevice.deviceData.profile[profileindex].keybinding[
        //             index
        //         ].function
        //         this.setMediaButtonName(bottonid, this.MouseKeyMulitmediaData)
        //         break
        //     case 6:
        //         this.setDisableButtonName(bottonid)
        //         break
        //     case 7:
        //         let Name = ''
        //         this.SingleKeyData = this.currentDevice.deviceData.profile[profileindex].keybinding[index].function;
        //         Name = this.SingleKeyData;

        //         let keyindex = this.KeyboardKeyData.findIndex((x:any) => x.value == this.SingleKeyData)
        //         setTimeout(() => {
        //             if(index != -1 && document.getElementById('singlekey'+keyindex)) {
        //                 (document.getElementById('singlekey'+keyindex) as any).checked = true;
        //             }
        //         });
        //         if (this.currentDevice.deviceData.profile[profileindex].keybinding[index].param == '') {
        //             this.ModifyKey = false
        //             this.Shift = false;
        //             this.Ctrl = false;
        //             this.Alt = false;
        //             this.Windows = false;
        //         }
        //         else {
        //             this.ModifyKey = true
        //             this.Shift = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param[0]
        //             this.Ctrl = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param[1]
        //             this.Alt = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param[2]
        //             this.Windows = this.currentDevice.deviceData.profile[profileindex].keybinding[index].param[3]
        //             if (this.Shift) Name = Name + ' + ' + 'Shift'
        //             if (this.Ctrl) Name = Name + ' + ' + 'Ctrl'
        //             if (this.Alt) Name = Name + ' + ' + 'Alt'
        //             if (this.Windows) Name = Name + ' + ' + 'Windows'
        //         }
        //         this.setSingleKeyButtonName(bottonid, Name)

        //         setTimeout(() => {
        //             if(document.getElementById('NumpadEnterHelpTooltip')) {
        //                 // in case it has already been applied. silent fail otherwise;
        //                 (document.getElementById("NumpadEnterHelpTooltip") as any)?.removeEventListener('mouseover',this.NumpadEnterHelpTooltipEvent);
        //                 (document.getElementById("NumpadEnterHelpTooltip") as any)?.removeEventListener('mouseout',this.NumpadEnterHelpTooltipOutEvent);

        //                 (document.getElementById("NumpadEnterHelpTooltip") as any)?.addEventListener('mouseover',this.NumpadEnterHelpTooltipEvent);
        //                 (document.getElementById("NumpadEnterHelpTooltip") as any)?.addEventListener('mouseout',this.NumpadEnterHelpTooltipOutEvent);
        //             }
        //         });
        //         break
        //     case 8:
        //         this.MouseKeyKeyboardFunctionData = this.currentDevice.deviceData.profile[profileindex].keybinding[
        //             index
        //         ].function
        //         this.setKeyboardFunctionButtonName(bottonid, this.MouseKeyKeyboardFunctionData)
        //         break;
        // }

        //   /**
        //    * update UI Shortcut - button name
        //    * @param ButtonId
        //    * @param Name
        //    */
        //   setShortcutButtonName(ButtonId:any, Name:any) {
        //     let ButtonName = ''
        //     if (Name == 1) ButtonName = 'Email'
        //     else if (Name == 2) ButtonName = 'Calculator'
        //     else if (Name == 3) ButtonName = 'MyPC'
        //     else if (Name == 4) ButtonName = 'Explorer'
        //     else if (Name == 5) ButtonName = 'WWWHome'
        //     else if (Name == 6) ButtonName = 'WWWRefresh'
        //     else if (Name == 7) ButtonName = 'WWWStop'
        //     else if (Name == 8) ButtonName = 'WWWBack'
        //     else if (Name == 9) ButtonName = 'WWWForward'
        //     else if (Name == 10) ButtonName = 'WWWSearch'
        //     else ButtonName = Name
        //     this.setButtonName(ButtonId, ButtonName)
        // }

        // /**
        //  * update UI Disable - button name
        //  * @param ButtonId
        //  */
        // setDisableButtonName(ButtonId:any) {
        //     this.translate.get('DISABLE').subscribe((result) => {
        //         this.setButtonName(ButtonId, result)
        //     })
        // }

        // /**
        //  * update UI Media - button name
        //  * @param ButtonId
        //  * @param Name
        //  */
        // setMediaButtonName(ButtonId:any, Name:any) {
        //     let ButtonName = ''
        //     if (Name == 1) ButtonName = 'Mediaplayer'
        //     else if (Name == 2) ButtonName = 'Playpause'
        //     else if (Name == 3) ButtonName = 'Next'
        //     else if (Name == 4) ButtonName = 'Previous'
        //     else if (Name == 5) ButtonName = 'Stop'
        //     else if (Name == 6) ButtonName = 'Mute'
        //     else if (Name == 7) ButtonName = 'Volumeup'
        //     else if (Name == 8) ButtonName = 'Volumedown'
        //     else if (Name == 9) ButtonName = 'NextSong'
        //     else if (Name == 10) ButtonName = 'PreviousSong'
        //     this.setButtonName(ButtonId, ButtonName)
        // }

        // /**
        //  * update UI Dpi - button name
        //  * @param ButtonId
        //  * @param Name
        //  */
        // setDpiButtonName(ButtonId:any, Name:any) {
        //     let ButtonName = ''
        //     if (Name == 1) ButtonName = 'DPIStageup'
        //     else if (Name == 2) ButtonName = 'DPIStagedown'
        //     else if (Name == 3) ButtonName = 'DPIcycleup'
        //     else if (Name == 4) ButtonName = 'DPIcycledown'
        //     else if (Name == 5) ButtonName = 'DPIlock'
        //     this.setButtonName(ButtonId, ButtonName)
        // }

        // /**
        //  * update UI Keyboard Function - button name
        //  * @param ButtonId
        //  * @param Name
        //  */
        // setKeyboardFunctionButtonName(ButtonId:any, Name:any) {
        //     let ButtonName = ''
        //     if (Name == 1) ButtonName = 'Profilecycleup'
        //     else if (Name == 2) ButtonName = 'Profilecycledown'
        //     else if (Name == 3) ButtonName = 'Layercycleup'
        //     else if (Name == 4) ButtonName = 'Layercycledown'
        //     this.setButtonName(ButtonId, ButtonName)
        // }

        // /**
        //  * update UI Mouse Function - button name
        //  * @param ButtonId
        //  * @param Name
        //  */
        // setMouseFunctionButtonName(ButtonId:any, Name:any) {
        //     let ButtonName = ''
        //     if (Name == 1) ButtonName = 'Leftbutton'
        //     else if (Name == 2) ButtonName = 'Rightbutton'
        //     else if (Name == 3) ButtonName = 'Middlebutton'
        //     else if (Name == 4) ButtonName = 'Forward'
        //     else if (Name == 5) ButtonName = 'Back'
        //     else if (Name == 6) ButtonName = 'Scrollup'
        //     else if (Name == 7) ButtonName = 'Scrolldown'
        //     else if (Name == 8) ButtonName = 'Profilecycleup'
        //     else if (Name == 9) ButtonName = 'Profilecycledown'
        //     else if (Name == 10) ButtonName = 'Batterystatuscheck'
        //     else if (Name == 11) ButtonName = 'Layer shift'
        //     this.setButtonName(ButtonId, ButtonName)
        // }
    };

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }
        // setCurrentProfile(DeviceService.getCurrentDeviceProfile(devicesContext.previewDevice));

        const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
        // console.log(previewDevice.SN);
        if (deviceInputLayout == null) {
            return;
        }

        const nodeItems: any[] = [];
        const terminationPointItems: any[] = [];

        for (let i = 0; i < deviceInputLayout.layoutNodes.length; i++) {
            const nodeDefinition: LayoutNode = deviceInputLayout.layoutNodes[i];

            const baseOffset = {
                x: deviceInputLayout.nodeBaseOffset?.x ?? 0,
                y: deviceInputLayout.nodeBaseOffset?.y ?? 0,
            }

            // prepare the lines
            const lineItems: any[] = [];
            if (nodeDefinition.lines != null && !nodeDefinition.hideUI) {
                const lines = deviceInputLayout.layoutNodes[i].lines;
                if(lines == null) { continue; }

                for (let j = 0; j < lines.length; j++) {
                    const lineDefinition = lines[j];
                    // console.log(lineDefinition);

                    const xTranslation = nodeDefinition.lineSide == 'right' ? '100%' : '0px';

                    const lineTop = `${lineDefinition.y == null ? '50%' : `calc(50% + ${(lineDefinition.angle != null && lineDefinition.angle > 0) ? `${lineDefinition.y}px` : `${baseOffset.y + lineDefinition.y}px`})`}`;
                    console.log(lineTop);
                    lineItems.push(
                        <div
                            className="line"
                            key={j}
                            style={
                                {
                                    top: lineTop,
                                    left: `${lineDefinition.x == null ? xTranslation : `calc(${xTranslation} + ${lineDefinition.x}px)`}`,
                                    width: `${lineDefinition.length}px`,
                                    '--angle': (lineDefinition.angle == null) ? undefined : `${lineDefinition.angle}deg`,
                                } as React.CSSProperties
                            }
                        ></div>,
                    );
                }
            }

            const translationKey = getAssignmentLabelTranslationKey(i) ?? '';

            if (nodeDefinition.terminationPoint != null && !nodeDefinition.hideUI) {
                terminationPointItems.push(
                    <div
                        className="termination-point"
                        key={i}
                        data-node-name={translationKey}
                        style={
                            {
                                '--x': `${baseOffset.x + nodeDefinition.terminationPoint.x}px`,
                                '--y': `${baseOffset.y + nodeDefinition.terminationPoint.y}px`,
                            } as React.CSSProperties
                        }
                    ></div>,
                );
            }

            // console.log(nodeDefinition);

            // create the node
            if (!nodeDefinition.hideUI) {
                let translation = translate(translationKey, translationKey) ?? '';
                if (translation.length > 13) translation = translation.substring(0, 13) + '...';
                nodeItems.push(
                    <DeviceKeybindingSelectionNodeComponent
                        title={translationKey}
                        key={i}
                        x={baseOffset.x + nodeDefinition.position.x}
                        y={baseOffset.y + nodeDefinition.position.y}
                        width={nodeDefinition.size?.width}
                        height={nodeDefinition.size?.height}
                        onClick={() => {
                            handleNodeClick(nodeDefinition, i);
                        }}
                        selected={uiContext.keybindSelectedNode?.translationKey == nodeDefinition.translationKey}
                    >
                        <div className="name">
                            {translation}
                        </div>
                        {lineItems}
                    </DeviceKeybindingSelectionNodeComponent>,
                );
            }
        }

        setNodeItems(nodeItems);
        setTerminationPointItems(terminationPointItems);
    }, [devicesContext.previewDevice, uiContext.keybindSelectedNode]);

    return (
        <>
            <div className="nodes" ref={nodes}>
                {nodeItems}
            </div>
            <div className="termination-points">{terminationPointItems}</div>
        </>
    );
}

export default MouseKeybindingSelectionComponent;
