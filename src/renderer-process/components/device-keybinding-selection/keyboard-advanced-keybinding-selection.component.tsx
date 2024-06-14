import { useCallback, useEffect } from 'react';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import KeyCharacterSelector from './key-character-selector';
import './keyboard-advanced-keybinding-selection.component.css';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { LayoutNode } from '../../../common/data/device-input-layout.data';
import { AdvancedKeyMode } from '../../../common/data/valueC-data';
import { useDevicesManagementContext } from '../../contexts/devices.context';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { ICONS, iconSrc } from '@renderer/utils/icons';
import { cleanupKeyName, getBindingModeIcon } from '@renderer/utils/dynamic-keys';
import { useTranslate } from '../../contexts/translations.context';

function KeyboardAdvancedKeybindingSelectionComponent() {
    const uiContext = useUIContext();
    const { update, setvalueCState, setvalueCAdvancedKeyBindingMode } = useUIUpdateContext();
    const translate = useTranslate();
    // const { setvalueCState } = useDevicesUpdateContext();
    const deviceContext = useDevicesContext();
    const { valueCState } = useUIContext();
    const { setvalueCAdvancedKeys } = useDevicesManagementContext();

    // const handleNodeClick = useCallback(
    //     ({ nodeDefinition }) => {
    //         uiContext.advancedKeys_selectedKey = nodeDefinition;
    //
    //         update(uiContext);
    //     },
    //     [uiContext.advancedKeys_selectedKey],
    // );

    // const handleBindingTypeChoice = useCallback(
    //     (type) => {
    //         uiContext.advancedKeys_selectedBinding = type;
    //         update(uiContext);
    //     },
    //     [uiContext.advancedKeys_selectedKey, uiContext.advancedKeys_selectedBinding],
    // );
    //
    // const isSelectBindingMode = uiContext.advancedKeys_selectedKey && !uiContext.advancedKeys_selectedBinding;

    // const selectKeyBinding = useCallback(
    //     (nodeDefinition) => {
    //         if (uiContext.advancedKeys_selectedBinding === 'mod-tap') {
    //             uiContext.advancedKeys_assignedModTapKey = nodeDefinition;
    //         } else if (uiContext.advancedKeys_selectedBinding === 'toggle-key') {
    //             uiContext.advancedKeys_assignedToggleKey = nodeDefinition;
    //         } else if (uiContext.advancedKeys_selectedBinding === 'dynamic-keystroke') {
    //             uiContext.advancedKeys_dynamicKeyStroke[uiContext.advancedKeys_dynamicKeyStrokeKey].assignedKey =
    //                 nodeDefinition;
    //         }
    //         uiContext.advancedKeys_showCharacterSelector = false;
    //         update(uiContext);
    //     },
    //     [
    //         uiContext.advancedKeys_selectedBinding,
    //         uiContext.advancedKeys_dynamicKeyStrokeKey,
    //         uiContext.advancedKeys_dynamicKeyStroke,
    //     ],
    // );

    useEffect(() => {
        const updatedMode =
            valueCState.advancedKeysSelectedKeyTmp != null &&
            valueCState.advancedKeysBindingMode == AdvancedKeyMode.None;
        if (valueCState.advancedKeysTypeSelectionOpened != updatedMode) {
            valueCState.advancedKeysTypeSelectionOpened = updatedMode;
            setvalueCState(valueCState);
        }
    }, [
        valueCState.advancedKeysTypeSelectionOpened,
        valueCState.advancedKeysSelectedKeyTmp,
        valueCState.advancedKeysBindingMode,
    ]);

    const handleBindingTypeChoice = useCallback(
        (type) => {
            valueCState.advancedKeysBindingMode = type;
            setvalueCState(valueCState);
        },
        [valueCState.advancedKeysBindingMode],
    );

    const closeKeyCharacterSelectorModal = () => {
        valueCState.advancedKeysShowSelector = false;
        setvalueCState(valueCState);
        setvalueCAdvancedKeys(valueCState);
    };

    const closeAdvancedKeysTypeSelection = useCallback(() => {
        valueCState.advancedKeysBindingMode = AdvancedKeyMode.None;
        valueCState.advancedKeysSelectedKeyTmp = null;
        valueCState.advancedKeysTypeSelectionOpened = false;
        setvalueCState(valueCState);
    }, []);

    useEffect(() => {
        if (!valueCState.advancedKeysTypeSelectionOpened) return;

        const handleKeyDown = (event) => event.key === 'Escape' && closeAdvancedKeysTypeSelection();
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [valueCState.advancedKeysTypeSelectionOpened, closeAdvancedKeysTypeSelection]);

    const selectKeyBinding = useCallback(
        (nodeDefinition: LayoutNode) => {
            const advancedKeys = valueCState.advancedKeysAssignedTmp;
            switch (valueCState.advancedKeysBindingMode) {
                case AdvancedKeyMode.None:
                    break;
                // TODO: allow for setting both press and hold
                case AdvancedKeyMode.ModTap:
                    advancedKeys.modTapPress = nodeDefinition;
                    break;
                case AdvancedKeyMode.Toggle:
                    advancedKeys.toggle = nodeDefinition;
                    break;
                case AdvancedKeyMode.DynamicKeystroke:
                    const triggerPoint = valueCState.advancedKeysSelectedTriggerPoint;
                    if (triggerPoint == null) {
                        console.warn('No trigger point selected for dynamic keystroke');
                        break;
                    }

                    if (advancedKeys.dynamicKeystrokes) {
                        advancedKeys.dynamicKeystrokes.keys[triggerPoint] = {
                            node: nodeDefinition,
                            isContinuous: false,
                        };
                    } else if (!advancedKeys.dynamicKeystrokes) {
                        advancedKeys.dynamicKeystrokes = {
                            keys: { [triggerPoint]: { node: nodeDefinition, isContinuous: false } },
                            firstTriggerPointValue: 0,
                        };
                    }
                    break;
            }
            closeKeyCharacterSelectorModal();
        },
        [valueCState.advancedKeysAssignedTmp, valueCState.advancedKeysSelectedTriggerPoint],
    );

    return (
        <div
            className={`${'advanced-keybinding-showcase'} ${
                valueCState.advancedKeysTypeSelectionOpened || valueCState.advancedKeysShowSelector
                    ? 'choose-type'
                    : ''
            }`}
        >
            {valueCState.advancedKeysShowSelector && (
                <KeyCharacterSelector
                    previewDevice={deviceContext.previewDevice}
                    onKeySelect={selectKeyBinding}
                    onClose={closeKeyCharacterSelectorModal}
                />
            )}
            <div className="bindings">
                {valueCState.advancedKeysSelectedKeyTmp && (
                    <>
                        {valueCState.advancedKeysBindingMode !== AdvancedKeyMode.None && (
                            <div className="current-binding binding-mode">
                                <SVGIconComponent src={getBindingModeIcon(valueCState.advancedKeysBindingMode)} />
                            </div>
                        )}
                        <div className="current-binding">
                            {cleanupKeyName(valueCState.advancedKeysSelectedKeyTmp.translationKey)}
                        </div>
                    </>
                )}
            </div>
            {valueCState.advancedKeysTypeSelectionOpened && (
                <>
                    <div className="binding-type-close" onClick={closeAdvancedKeysTypeSelection}>
                        <SVGIconComponent src={iconSrc(ICONS.closeModal)} selected={iconSrc(ICONS.closeModalHover)} />
                    </div>
                    <div className="binding-type-choose">
                        <div
                            className="binding-type-tile"
                            onClick={() => handleBindingTypeChoice(AdvancedKeyMode.DynamicKeystroke)}
                        >
                            <div className="binding-type-tile-header">
                                <h4>
                                    {translate(
                                        'Advanced_Keybinding_Selection_Dynamic_Keystroke_Label',
                                        'Dynamic Keystroke',
                                    )}
                                </h4>
                                <SVGIconComponent src={iconSrc(ICONS.dynamicKeystroke)} />
                            </div>
                            <p>
                                {translate(
                                    'Advanced_Keybinding_Selection_Dynamic_Keystroke_Description',
                                    '4 different actions on a single key based on key position. Activate 1 up to 4 bindings on 4 different parts of the key press.',
                                )}
                            </p>
                        </div>
                        <div
                            className="binding-type-tile"
                            onClick={() => handleBindingTypeChoice(AdvancedKeyMode.ModTap)}
                        >
                            <div className="binding-type-tile-header">
                                <h4>{translate('Advanced_Keybinding_Selection_Mod_Tap_Label', 'Mod Tap')}</h4>
                                <SVGIconComponent src={iconSrc(ICONS.modTap)} />
                            </div>
                            <p>
                                {translate(
                                    'Advanced_Keybinding_Selection_Mod_Tap_Description',
                                    '2 different actions on a single key based on press behaviour. Hold the key down for the first action or tap the key for the second action.',
                                )}
                            </p>
                        </div>
                        <div
                            className="binding-type-tile"
                            onClick={() => handleBindingTypeChoice(AdvancedKeyMode.Toggle)}
                        >
                            <div className="binding-type-tile-header">
                                <h4>{translate('Advanced_Keybinding_Selection_Toggle_Key_Label', 'Toggle Key')}</h4>
                                <SVGIconComponent src={iconSrc(ICONS.toggleKey)} />
                            </div>
                            <p>
                                {translate(
                                    'Advanced_Keybinding_Selection_Toggle_Key_Description',
                                    'Lock the action between its on and off state by tapping the key. Activate the normal key behaviour by holding down the key.',
                                )}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default KeyboardAdvancedKeybindingSelectionComponent;
