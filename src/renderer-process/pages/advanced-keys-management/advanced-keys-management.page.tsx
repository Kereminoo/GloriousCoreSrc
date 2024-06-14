import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import './advanced-keys-management.page.css';
import RangeComponent from '@renderer/components/range/range.component';
import { AdvancedKeyMode, TriggerPoint } from '../../../common/data/valueC-data';
import SVGIconComponent from '../../components/svg-icon/svg-icon.component';
import TriggerPointTooltip from './trigger-point-tooltip.component';
import { useEffect, useState } from 'react';
import { useDevicesContext, useDevicesManagementContext } from '../../contexts/devices.context';
import TooltipComponent from '../../components/tooltip/tooltip.component';
import { iconSrc, ICONS } from '@renderer/utils/icons';
import {
    getDynamicKeysDetailsWithIcons,
    cleanupKeyName,
    getDynamicKeysApplied,
} from '@renderer/utils/dynamic-keys';
import { KeyboardKeyAssignmentData } from '@renderer/data/legacy/keyboard-data';
import Ruler from '@renderer/components/ruler/ruler';


const SECOND_TRIGGER_POINT = (3.5 / 4.0) * 100;

function AdvancedKeysManagementPage() {
    const [selectedTriggerValue, setSelectedTriggerValueP] = useState<number>(0);
    const uiContext = useUIContext();
    const { update, setvalueCState, setPreviewDevicePropertiesAsUnsaved } = useUIUpdateContext();
    const { valueCState } = useUIContext();
    const { savePreviewDevice, setvalueCAdvancedKeys } = useDevicesManagementContext();
    const { previewDevice } = useDevicesContext();
    const translate = useTranslate();

    const valueCKeys = getDynamicKeysDetailsWithIcons(previewDevice);

    const openSelector = () => {
        // uiContext.advancedKeys_showCharacterSelector = true;
        valueCState.advancedKeysShowSelector = true;
        update(uiContext);
    };

    const setSelectedTriggerValue = (value: number) => {
        if (value <= SECOND_TRIGGER_POINT - 0.2) {
            setSelectedTriggerValueP(value);
        }
    };

    const setDynamicKeyStroke = (triggerPoint: TriggerPoint) => {
        valueCState.advancedKeysShowSelector = true;
        valueCState.advancedKeysSelectedTriggerPoint = triggerPoint;
        // setvalueCState(valueCState);
        setvalueCAdvancedKeys(valueCState);
    };

    const getSelectedKeys = () => {
        switch (valueCState.advancedKeysBindingMode) {
            case AdvancedKeyMode.DynamicKeystroke:
                return valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes?.keys;
            case AdvancedKeyMode.ModTap:
                return valueCState.advancedKeysAssignedTmp?.modTapPress;
            case AdvancedKeyMode.Toggle:
                return valueCState.advancedKeysAssignedTmp?.toggle;
        }
        return null;
    };

    useEffect(() => {
        const dynamicKeystrokes = valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes;
        if (dynamicKeystrokes != null && dynamicKeystrokes.firstTriggerPointValue != selectedTriggerValue) {
            dynamicKeystrokes.firstTriggerPointValue = selectedTriggerValue;
            setvalueCAdvancedKeys(valueCState);
        }
    }, [selectedTriggerValue]);

    useEffect(() => {
        if (valueCState.advancedKeysBindingMode === AdvancedKeyMode.None) {
            setSelectedTriggerValueP(0);
        }
    }, [valueCState.advancedKeysBindingMode])

    const removeDynamicKeyStroke = (triggerPoint: TriggerPoint) => {
        const dynamicKeystrokes = valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes;
        if (dynamicKeystrokes != null && dynamicKeystrokes.keys[triggerPoint] != null) {
            delete dynamicKeystrokes.keys[triggerPoint];
            setvalueCAdvancedKeys(valueCState);
        }
    };

    const switchKeystrokeContinuation = (triggerPoint: TriggerPoint) => {
        const dynamicKeystrokes = valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes;
        if (dynamicKeystrokes != null && dynamicKeystrokes.keys[triggerPoint] != null) {
            dynamicKeystrokes.keys[triggerPoint].isContinuous = !dynamicKeystrokes.keys[triggerPoint].isContinuous;
            setvalueCAdvancedKeys(valueCState);
        }
    };

    const editBinding = (keyName) => {
        // const { valueCKeyData } = getDynamicKeysApplied(previewDevice)
        //     .find(({ defaultValue }: KeyboardKeyAssignmentData) => defaultValue === keyName);
        // valueCState.advancedKeysAssignedTmp = valueCKeyData;
        // valueCState.advancedKeysBindingMode = resolveProfileStoredAdvancedKeysType(valueCKeyData);
        // setvalueCAdvancedKeys(valueCState);
    }

    const removeBinding = (keyName) => {
        const binding = getDynamicKeysApplied(previewDevice)
            .find(({ defaultValue }: KeyboardKeyAssignmentData) => defaultValue === keyName);

        binding.changed = true;
        binding.valueCKeyData = null;

        setPreviewDevicePropertiesAsUnsaved('keybind-valueC-state');
        savePreviewDevice();
    }

    return (
        <>
            <div className="layout advanced-keys keyboard">
                {valueCState.advancedKeysBindingMode == AdvancedKeyMode.None && (
                    <>
                        <div className="advanced-keybindings panel main">
                            <h3>{translate('Device_AdvancedKeys_Label_AdvancedKeys', 'Advanced Keys')}</h3>
                            <p>
                                {translate(
                                    'Device_AdvancedKey_Description_Label',
                                    "Select a key, and then choose the type of advanced keybinding you'd like to add"
                                )}
                            </p>

                            <h4>{translate('Device_AdvancedKeys_Label_TestBinding', 'Test Binding')}</h4>
                            <div className="test-binding-container"></div>
                        </div>
                        <div className="your-bindings panel main">
                           <h3>{translate('Device_AdvancedKey_YourBindings_Label', 'Your Bindings')}</h3>
                           <div className="list">
                               {valueCKeys.map((binding) => (
                                    <div className="binding-row" key={binding.keyName}>
                                        <div className="binding-row-details" onClick={() => editBinding(binding.keyName)}>
                                            <div className="binding-key">
                                                {binding.keyName}
                                            </div>
                                            <div>
                                                <SVGIconComponent src={binding.bindingTypeIconSrc} />
                                            </div>
                                            <div>
                                                {binding.bindings}
                                            </div>
                                        </div>

                                        <div className="remove-binding">
                                            <SVGIconComponent
                                                src={iconSrc(ICONS.delete)}
                                                selected={iconSrc(ICONS.deleteHover)}
                                                onClick={() => removeBinding(binding.keyName)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {valueCState.advancedKeysBindingMode === AdvancedKeyMode.DynamicKeystroke && (
                    <>
                      <div className="panel main">
                          <div className="key-binding-mode-label">
                              <div className='orange-box'></div>
                              <h3>{translate('Device_AdvancedKeys_Label_DynamicKeystroke_Header', 'Dynamic Keystroke')}</h3>
                              <TooltipComponent>
                                  <header>
                                      {translate(
                                          'Device_AdvancedKeys_Label_DynamicKeystroke_Header',
                                          'Dynamic Keystroke',
                                      )}
                                  </header>
                                  <div className="message">
                                      {translate(
                                          'Device_AdvancedKey_Description_Label',
                                          "Select a key, and then choose the type of advanced keybinding you'd like to add",
                                      )}
                                  </div>
                              </TooltipComponent>
                          </div>
                          <p>
                              {translate(
                                  'Device_AdvancedKey_Description_Label',
                                  "Select a key, and then choose the type of advanced keybinding you'd like to add",
                                )}
                            </p>
                            <h4>{translate('Device_AdvancedKeys_Label_TestBinding', 'Test Binding')}</h4>
                            <div className="test-binding-container"></div>
                        </div>
                        <div className="panel key-press">
                            <div className="key-mark">
                                <p>{translate('Device_AdvancedKeys_Label_DynamicKeystroke_Header', 'Key Press')}</p>
                                <div className="key-mark-box key-mark-press">
                                    <SVGIconComponent src={iconSrc(ICONS.rightArrow)} />
                                </div>
                            </div>
                            <Ruler className="right" />
                          <div className="key-press-slider stage-one">
                                <RangeComponent
                                    value={selectedTriggerValue}
                                    onChange={(value) => setSelectedTriggerValue(value)}
                                    className="gauge"
                                >
                                    <TriggerPointTooltip
                                        selectedKey={
                                            getSelectedKeys()?.[TriggerPoint.StageOnePress]?.node.translationKey
                                        }
                                        value={selectedTriggerValue}
                                        isContinuous={getSelectedKeys()?.[TriggerPoint.StageOnePress]?.isContinuous}
                                        onKeySelect={() => setDynamicKeyStroke(TriggerPoint.StageOnePress)}
                                        onRemove={() => removeDynamicKeyStroke(TriggerPoint.StageOnePress)}
                                        onContinuationChange={() =>
                                            switchKeystrokeContinuation(TriggerPoint.StageOnePress)
                                        }
                                    />
                                </RangeComponent>
                            </div>
                            <div className="key-press-slider">
                                <RangeComponent value={SECOND_TRIGGER_POINT} className="gauge">
                                    <TriggerPointTooltip
                                        onKeySelect={() => setDynamicKeyStroke(TriggerPoint.StageTwoPress)}
                                        selectedKey={
                                            valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes?.keys?.[
                                                TriggerPoint.StageTwoPress
                                            ]?.node.translationKey
                                        }
                                        onRemove={() => removeDynamicKeyStroke(TriggerPoint.StageTwoPress)}
                                        onContinuationChange={() =>
                                            switchKeystrokeContinuation(TriggerPoint.StageTwoPress)
                                        }
                                        value={SECOND_TRIGGER_POINT}
                                        isContinuous={getSelectedKeys()?.[TriggerPoint.StageTwoPress]?.isContinuous}
                                    />
                                </RangeComponent>
                            </div>
                        </div>
                        <div className="panel third">
                            <div className="column slider-column">
                                <div className="key-press-slider">
                                    <RangeComponent
                                        value={selectedTriggerValue}
                                        onChange={(value) => setSelectedTriggerValue(value)}
                                        className="gauge"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="panel key-release">
                            <div className="key-mark">
                                <div className="key-mark-box key-mark-release">
                                    <SVGIconComponent src={iconSrc(ICONS.rightArrow)} />
                                </div>
                                <p>{translate('Device_AdvancedKeys_Label_DynamicKeystroke_Header', 'Key Release')}</p>
                            </div>
                          <div className="key-release-slider stage-one">
                                <RangeComponent
                                    value={selectedTriggerValue}
                                    onChange={(value) => setSelectedTriggerValue(value)}
                                    className="gauge"
                                >
                                    <TriggerPointTooltip
                                        selectedKey={
                                            getSelectedKeys()?.[TriggerPoint.StageOneRelease]?.node.translationKey
                                        }
                                        value={selectedTriggerValue}
                                        isContinuous={getSelectedKeys()?.[TriggerPoint.StageOneRelease]?.isContinuous}
                                        onRemove={() => removeDynamicKeyStroke(TriggerPoint.StageOneRelease)}
                                        onKeySelect={() => setDynamicKeyStroke(TriggerPoint.StageOneRelease)}
                                        onContinuationChange={() =>
                                            switchKeystrokeContinuation(TriggerPoint.StageOneRelease)
                                        }
                                    />
                                </RangeComponent>
                            </div>
                            <div className="key-release-slider">
                                <RangeComponent value={SECOND_TRIGGER_POINT} className="gauge">
                                    <TriggerPointTooltip
                                        selectedKey={
                                            valueCState.advancedKeysAssignedTmp?.dynamicKeystrokes?.keys?.[
                                                TriggerPoint.StageTwoRelease
                                            ]?.node.translationKey
                                        }
                                        value={SECOND_TRIGGER_POINT}
                                        isContinuous={getSelectedKeys()?.[TriggerPoint.StageTwoRelease]?.isContinuous}
                                        onKeySelect={() => setDynamicKeyStroke(TriggerPoint.StageTwoRelease)}
                                        onRemove={() => removeDynamicKeyStroke(TriggerPoint.StageTwoRelease)}
                                        onContinuationChange={() =>
                                            switchKeystrokeContinuation(TriggerPoint.StageTwoRelease)
                                        }
                                    />
                                </RangeComponent>
                            </div>
                            <Ruler className="left" />
                        </div>
                    </>
                )}
                {valueCState.advancedKeysBindingMode === AdvancedKeyMode.ModTap && (
                    <>
                      <div className="panel main">
                          <div className="key-binding-mode-label">
                              <div className='orange-box'></div>
                              <h3>{translate('Device_AdvancedKeys_Label_ModTap_Header', 'Mod Tap')}</h3>
                              <TooltipComponent>
                                  <header>
                                      {translate(
                                          'Device_AdvancedKeys_Label_ModTap_Header',
                                          'Mod Tap',
                                      )}
                                  </header>
                                  <div className="message">
                                      {translate(
                                          'Device_AdvancedKey_Label_ModTap_Description',
                                          "2 different actions on a single key based on press behaviour. Hold the key down for the first action or tap the key for the second action.",
                                      )}
                                  </div>
                              </TooltipComponent>
                          </div>
                          <p>
                              {translate(
                                  'Device_AdvancedKey_Label_ModTap_Description',
                                  '2 different actions on a single key based on press behaviour. Hold the key down for the first action or tap the key for the second action.',
                                )}
                            </p>
                            <h4>{translate('Device_AdvancedKeys_Label_TestBinding', 'Test Binding')}</h4>
                            <div className="test-binding-container"></div>
                        </div>
                        <div className="panel second character-selection">
                            <div className="column">
                                <div>
                                    <h3>
                                        {translate(
                                            'Device_AdvancedKeys_Label_CharacterSelection_Header',
                                            'Character Selection'
                                        )}
                                    </h3>
                                    <p>
                                        {translate(
                                            'Device_AdvancedKey_Label_ModTap_Description',
                                            'To assign you desired characters, you can first select the Hold/Tap fields and use your keyboard to input any key. You can also use the character selector module below.'
                                        )}
                                    </p>
                                </div>
                                <button className="secondary" onClick={openSelector}>
                                    Selector
                                </button>
                            </div>
                            <div className="column">
                                <div>
                                    <h4>Hold</h4>
                                    <div className="keyname">
                                        {cleanupKeyName(valueCState.advancedKeysSelectedKeyTmp?.translationKey)}
                                    </div>
                                </div>
                                <div>
                                    <h4>Tap</h4>
                                    <div className="keyname">
                                        {cleanupKeyName(
                                            valueCState.advancedKeysAssignedTmp?.modTapPress?.translationKey
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {valueCState.advancedKeysBindingMode === AdvancedKeyMode.Toggle && (
                    <>
                      <div className="panel main">
                          <div className="key-binding-mode-label">
                              <div className='orange-box'></div>
                              <h3>{translate('Device_AdvancedKeys_Label_TogleKey_Header', 'Toggle Key')}</h3>
                              <TooltipComponent>
                                  <header>
                                      {translate(
                                          'Device_AdvancedKeys_Label_TogleKey_Header',
                                          'Toggle Key',
                                      )}
                                  </header>
                                  <div className="message">
                                      {translate(
                                          'Device_AdvancedKey_Description_Label',
                                          "Select a key, and then choose the type of advanced keybinding you'd like to add",
                                      )}
                                  </div>
                              </TooltipComponent>
                          </div>
                          <p>
                              {translate(
                                  'Device_AdvancedKey_Description_Label',
                                  "Select a key, and then choose the type of advanced keybinding you'd like to add",
                                )}
                            </p>
                            <h4>{translate('Device_AdvancedKeys_Label_TestBinding', 'Test Binding')}</h4>
                            <div className="test-binding-container"></div>
                        </div>
                        <div className="panel second character-selection">
                            <div className="column">
                                <div>
                                    <h3>
                                        {translate(
                                            'Device_AdvancedKeys_Label_CharacterSelection_Header',
                                            'Character Selection'
                                        )}
                                    </h3>
                                    <p>
                                        {translate(
                                            'Device_AdvancedKey_Label_ToggleKey_Description',
                                            'To assign you desired characters, you can first select the Hold/Tap fields and use your keyboard to input any key. You can also use the character selector module below.'
                                        )}
                                    </p>
                                </div>
                                <button className="secondary" onClick={openSelector}>
                                    Selector
                                </button>
                            </div>
                            <div className="column">
                                <div>
                                    <h3>Toggle</h3>
                                    <div className="keyname">
                                        {cleanupKeyName(valueCState.advancedKeysAssignedTmp?.toggle?.translationKey)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default AdvancedKeysManagementPage
