import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { DeviceInputLayout, DeviceInputLayoutMap } from '../../../common/data/device-input-layout.data';
import DeviceKeybindingSelectionNodeComponent
    from './device-keybinding-selection-node/device-keybinding-selection-node.component';
import { DeviceService } from '@renderer/services/device.service';
import './keyboard-key-selection.component.css';
// import { getDynamicKeysDetailsWithIcons, cleanupKeyName } from '@renderer/utils/dynamic-keys';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { cleanupKeyName, getDynamicKeysDetailsWithIcons } from '../../utils/dynamic-keys';
import { ProfileData } from '../../../common/data/records/device-data.record';

const getKeyData = (profile, index) => {
    if (!profile) return null;
    const currentKeyArray = profile.assignedKeyboardKeys[profile.fnModeindex];
    return currentKeyArray[index];
};

function KeyboardKeySelectionComponent(props: {
    selectionMode: string;
    className: string;
    onNodeClick?: any;
    onNodeHover?: any;
    selectedNodes?: any;
}) {
    const { selectionMode, className, onNodeClick, onNodeHover, selectedNodes } = props;
    const { previewDevice } = useDevicesContext();
    const [currentProfile, setCurrentProfile] = useState<ProfileData | undefined>();
    const [deviceInputLayout, setDeviceInputLayout] = useState<DeviceInputLayout | undefined>();

    const [hoverNode, setHoverNode] = useState(null);

    const [selectedNodePosition, setSelectedNodePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!previewDevice) return;

        setCurrentProfile(DeviceService.getDeviceProfile(previewDevice));
        setDeviceInputLayout(DeviceInputLayoutMap.get(previewDevice.SN));
    }, [previewDevice?.devicename]);

    const handleNodeClick = useCallback(
        (nodeDefinition, index) => {
            onNodeClick({ nodeDefinition, index });
            if (deviceInputLayout?.selectedNodePosition)
                setSelectedNodePosition(deviceInputLayout.selectedNodePosition);
        },
        [onNodeClick]
    );

    const handleHoverStart = useCallback(
        (nodeDefinition) => {
            if (onNodeHover) onNodeHover(nodeDefinition);
            if (nodeDefinition) setHoverNode(nodeDefinition);
        },
        [onNodeHover]
    );

    const handleHoverEnd = useCallback(() => {
        if (onNodeHover) onNodeHover(null);
        setHoverNode(null);
    }, [onNodeHover]);

    const getDisplayedNodeName = useCallback(
        (index, fallback) => {
            const keyData = getKeyData(currentProfile, index);
            return keyData && keyData.recordBindCodeName !== 'Default' ? keyData.recordBindCodeType : fallback;
        },
        [currentProfile]
    );

    const getNodeItemIndex = useCallback(
        (node) => {
            return (
                deviceInputLayout?.layoutNodes.findIndex((item) => item.translationKey === node.translationKey) ?? -1
            );
        },
        [deviceInputLayout]
    );

    const nodeItems = useMemo(() => {
        if (!deviceInputLayout || !currentProfile) return [];
        const valueCDataKeyMap = getDynamicKeysDetailsWithIcons(previewDevice)?.reduce(
            (keyMap: Object, keyData) => ({ ...keyMap, [keyData.keyName]: keyData }),
            {}
        );

        return deviceInputLayout.layoutNodes.map((nodeDefinition, i) => {
            const keyData = getKeyData(currentProfile, i);
            const hasBindValue = keyData && keyData.recordBindCodeName !== 'Default';

            let isSelected: boolean;
            if (selectionMode === 'single') {
                isSelected = selectedNodes.length > 0 && selectedNodes[0].index === i;
            } else {
                // "multiple" mode
                isSelected = selectedNodes.some((node) => node.index === i);
            }
            const keyMapping = valueCDataKeyMap[cleanupKeyName(nodeDefinition.translationKey)];
            const position = {
                x:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.x + nodeDefinition.position.x
                        : nodeDefinition.position.x,
                y:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.y + nodeDefinition.position.y
                        : nodeDefinition.position.y
            };
            const size = {
                width:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.width ?? 65
                        : nodeDefinition.size.width,
                height:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.height ?? 65
                        : nodeDefinition.size.height
            };

            return (
                <DeviceKeybindingSelectionNodeComponent
                    title={nodeDefinition.translationKey}
                    key={i}
                    x={position.x}
                    y={position.y}
                    width={size.width}
                    height={size.height}
                    onClick={() => handleNodeClick(nodeDefinition, i)}
                    selected={isSelected}
                    hasBindValue={hasBindValue}
                    onHoverStart={() => handleHoverStart(nodeDefinition)}
                    onHoverEnd={handleHoverEnd}
                >
                    {keyMapping && (
                        <div
                            style={{
                                position: 'absolute',
                                transform: 'scale(1.6) translateX(6px) translateY(-2px)'
                            }}
                        >
                            <SVGIconComponent src={keyMapping.bindingTypeIconSrc} />
                        </div>
                    )}
                </DeviceKeybindingSelectionNodeComponent>
            );
        });
    }, [currentProfile, selectedNodes, deviceInputLayout, handleNodeClick, handleHoverStart, handleHoverEnd]);

    return (
        <>
            <div
                className='selected-node'
                style={{ position: 'relative', top: selectedNodePosition.y, left: selectedNodePosition.x }}
            >
                {hoverNode != null ? (
                    <span className='hover'>
                        {getDisplayedNodeName(getNodeItemIndex(hoverNode), (hoverNode as any).translationKey)}
                    </span>
                ) : null}
            </div>
            <div className={`keyboard-key-selection-component ${className}`}>{nodeItems}</div>
        </>
    );
}

export default KeyboardKeySelectionComponent;
