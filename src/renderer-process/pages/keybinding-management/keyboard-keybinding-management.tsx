import { useEffect, useState } from 'react';
import MacroEditorComponent from '../../components/macro-editor/macro-editor.component';
import OptionSelectComponent from '../../components/option-select/option-select.component';
import { useDevicesContext, useDevicesManagementContext } from '../../contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { MacroRecord } from 'src/common/data/records/macro.record';
import { useRecordsContext } from '@renderer/contexts/records.context';
import { DisplayOption } from '@renderer/data/display-option';
import { BindingTypes_KeyPress, BindingTypes_RotaryPress, BindingTypes_Rotation } from '@renderer/data/binding-type';
import { ModifierKeys } from '@renderer/data/modifier-key';
import { WindowsFunctionShortcuts } from '@renderer/data/windows-shortcut-option';
import { ShortcutTypes } from '@renderer/data/shortcut-option';
import { MultimediaOptions } from '@renderer/data/multimedia-option';
import { MouseFunctions } from '@renderer/data/mouse-function';
import { KeyboardFunctions } from '@renderer/data/keyboard-function';
import { RotaryEncoderActions } from '@renderer/data/rotary-encoder-action';
import { useRecordsUpdateContext } from '../../contexts/records.context';
import MacroSelectorComponent from '../../components/macro-selector/macro-selector-component';
import { AppService } from '@renderer/services/app.service';
import KeyCharacterSelector from '@renderer/components/device-keybinding-selection/key-character-selector';
// import KeyCharacterSelector from '../../components/device-keybinding-selection/key-character-selector';

// class LocalState
// {
//   keybindSelectedNode: LayoutNode|null = null;
//   keybindSelectedNodeIndex: number = -1;
//   keystrokeValue: string = "";
//   keystrokeModifierValue: DisplayOption|undefined;
//   keyboardFunction: DisplayOption|undefined;
//   mouseFunction: DisplayOption|undefined;
//   dpiOption: DisplayOption|undefined;
//   macroSelection: DisplayOption|null = null;
//   macroTypeSelection: DisplayOption|undefined;
//   shortcutType: DisplayOption|null = null;
//   programPath: string = "";
//   url: string = "";
//   windowsShortcut: DisplayOption|undefined;
//   multimediaOption: DisplayOption|undefined;
//   disabledSelected: boolean = false;
//   macroEditorIsOpen: boolean = false;

//   bindingTypes: DisplayOption[] = BindingTypes_KeyPress;
//   rotaryEncoderAction: UIListItem|undefined;
// }

function KeyboardKeybindingManagementPage(props: any) {
    // const { previewDevice, onPreviewDeviceUpdate, uiState, onUIStateUpdate, macros } = props;

    const devicesContext = useDevicesContext();
    const { getCurrentProfile } = useDevicesManagementContext();
    const uiContext = useUIContext();
    const recordsContext = useRecordsContext();
    const { updateMacro, deleteMacro, getMacros } = useRecordsUpdateContext();

    const translate = useTranslate();

    const { openMacroEditor, closeMacroEditor } = useUIUpdateContext();

    const {
        setKeybindingType,
        setKeybindingKeyCode,
        setKeybindingKeyModifier,
        setKeybindingKeyboardFunction,
        setKeybindSelectedMouseFunction,
        setKeybindSelectedDPIOption,
        setKeybindSelectedMultimediaFunction,
        setKeybindSelectedShortcutType,
        setKeybindSelectedShortcutOption,
        setKeybindSelectedShortcutProgramPath,
        setKeybindSelectedShortcutUrl,
        setKeybindSelectedShortcutWindowsOption,
        setKeybindDisabledIsSelected,
        setKeybindSoundControlSelection,
        setKeybindAudioToggleTarget,
        setKeybindMacroSelection,
        setRotaryEncoderAction,
    } = useDevicesManagementContext();

    const keystrokeModifierOptions = ModifierKeys.map((keyData, i) => {
        return {
            value: keyData.optionKey,
            label: translate(keyData.translationKey, keyData.data?.translationFallback),
        };
    });
    // const [localState, setLocalState] = useState(new LocalState());
    // const [currentProfile, setCurrentProfile] = useState<any>(null);
    const [macros, setMacros] = useState<MacroRecord[]>([]);
    const [bindingTypes, setBindingTypes] = useState<DisplayOption[]>([]);
    const [selectorVisible, showSelector] = useState(false);

    useEffect(() => {
        setMacros(recordsContext.macros);
    }, [recordsContext.macros]);

    useEffect(() => {
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

    const selectShortcutProgramPath = async () => {
        const result = await AppService.dialogShortcutProgramPath();
        console.log(`Program Shortcut Selection: ${result.success ? 'Success' + result.data : 'Failure: '}`);
        setKeybindingType(
            BindingTypes_KeyPress.find((x) => x.optionKey == uiContext.keybindSelectedBindingType?.optionKey),
        );
        setKeybindSelectedShortcutProgramPath(result.data);
    };

    // useEffect(() =>
    // {

    //   // if selected node was null, keep all settings instead of
    //   // replacing them with node values;
    //   // else if the management subpage was navigated to by clicking
    //   // a key node (selected node won't be null), then we
    //   // should replace the keybinding data with the node's values.
    //   // if the node doesn't have any keybinding values set, we don't
    //   // override the current values

    //   // const updatedLocalState = structuredClone(localState);
    //   // updatedLocalState.keybindSelectedNode = uiContext.keybindSelectedNode;
    //   // updatedLocalState.keybindSelectedNodeIndex = uiContext.keybindSelectedNodeIndex;
    //   // updatedLocalState.shortcutType = uiContext.keybindShortcutType;
    //   // updatedLocalState.macroSelection = uiContext.keybindMacroSelection;

    //   // if(updatedLocalState.keybindSelectedNode == null) { return; }

    //   // // console.log(previewDevice, updatedLocalState);

    //   // const keybindingData = DeviceService.getCurrentDeviceProfile(previewDevice).keybinding[uiState.keybindSelectedNodeIndex];
    //   // // console.log(keybindingData);
    //   // if(keybindingData.group == 1) // Macro
    //   // {

    //   // }
    //   // else if (keybindingData.group == 2) // Shortcut
    //   // {
    //   //   updatedLocalState.shortcutType = ShortcutTypes.find(item => item.value == keybindingData.function);
    //   // }
    //   // else if(keybindingData.group == 3) // Mouse Function
    //   // {
    //   //   updatedLocalState.mouseFunction = MouseFunctions.find(item => item.value == keybindingData.function);
    //   // }
    //   // else if(keybindingData.group == 4)
    //   // {

    //   // }
    //   // else if(keybindingData.group == 5) // Multimedia
    //   // {
    //   //   updatedLocalState.multimediaOption = MultimediaOptions.find(item => item.value == keybindingData.function);
    //   // }
    //   // else if(keybindingData.group == 6) // Disable
    //   // {
    //   //   updatedLocalState.disabledSelected = keybindingData.function;
    //   // }
    //   // else if(keybindingData.group == 7) // Key Function
    //   // {
    //   //   // console.log('value');
    //   //   updatedLocalState.keystrokeValue = keybindingData.function;
    //   //   updatedLocalState.keystrokeModifierValue = (keybindingData.param == '') ? ModifierKeys[0].name :
    //   //   (keybindingData.param[0] == true) ? ModifierKeys[1].name :
    //   //   (keybindingData.param[1] == true) ? ModifierKeys[2].name :
    //   //   (keybindingData.param[2] == true) ? ModifierKeys[3].name :
    //   //   (keybindingData.param[3] == true) ? ModifierKeys[4].name : "";
    //   // }
    //   // else if(keybindingData.group == 8) // Keyboard Function
    //   // {
    //   //   updatedLocalState.keyboardFunction = KeyboardFunctions.find(item => item.value == keybindingData.function);
    //   // }

    //   setLocalState(updatedLocalState);
    // }, [uiContext]);

    const getCurrentKey = () => {
        const proflle = getCurrentProfile();
        if (uiContext.keybindSelectedNodeIndex == -1) {
            return null;
        }

        if (proflle == null) {
            console.error('Current Profile is unassigned');
            return;
        }
        if (proflle.assignedKeyboardKeys == null) {
            console.error('Assigned Keyboard Keys are unassigned');
            return;
        }
        if (proflle.fnModeindex == null) {
            console.error('Function Mode Index is unassigned');
            return;
        }

        const currentKeyArray = proflle.assignedKeyboardKeys[proflle.fnModeindex];
        const currentKey = currentKeyArray[uiContext.keybindSelectedNodeIndex];
        return currentKey;
    };

    useEffect(() => {
        setMacros(recordsContext.macros);
    }, [recordsContext.macros]);

    return (
        <>
            <div className="layout keybinding keyboard">
                {uiContext.keybindSelectedLayer?.optionKey == 'none' ? (
                    <div className="main">
                        <div className="stack-container layers">
                            <div className="stack">
                                {devicesContext.previewDevice?.keybindingLayers.map((data: any) => {
                                    return (
                                        <a
                                            key={data.value}
                                            onClick={() => {
                                                if (data.value > 2) {
                                                    console.error(
                                                        'A fourth keybinding layer is not currently supported.',
                                                    );
                                                    return;
                                                }

                                                // devicesContext.previewDevice.keyboardData.profileLayerIndex[devicesContext.previewDevice.keyboardData.profileindex] = data.value;
                                                // onPreviewDeviceUpdate(previewDevice);

                                                uiContext.keybindSelectedLayer = data;
                                                // onUIStateUpdate(uiContext, localState);
                                            }}
                                        >
                                            {data.translate}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'none' ? (
                    <>
                        <div className="main">
                            {uiContext.keybindSelectedNode?.isRotary == true ? (
                                <div className="rotary-encoder-action">
                                    <button
                                        type="button"
                                        className="hollow"
                                        onClick={() => {
                                            setRotaryEncoderAction(RotaryEncoderActions[0]);
                                        }}
                                    >
                                        {translate(
                                            RotaryEncoderActions[0].translationKey,
                                            RotaryEncoderActions[0].data?.translationFallback,
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="hollow"
                                        onClick={() => {
                                            setRotaryEncoderAction(RotaryEncoderActions[1]);
                                        }}
                                    >
                                        {translate(
                                            RotaryEncoderActions[0].translationKey,
                                            RotaryEncoderActions[1].data?.translationFallback,
                                        )}
                                    </button>
                                </div>
                            ) : (
                                ''
                            )}
                            <div className="stack-container binding-types">
                                <header>
                                    <div className="title">
                                        {translate(
                                            uiContext.keybindSelectedLayer?.translationKey,
                                            uiContext.keybindSelectedLayer?.data?.translationFallback,
                                        )}
                                    </div>
                                </header>
                                <div className="stack">
                                    {bindingTypes.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                onClick={() => {
                                                    setKeybindingType(option);
                                                    // onUIStateUpdate(uiContext, localState);
                                                    // console.log('change');

                                                    // const currentKey = getCurrentKey();
                                                    // if(currentKey == null) { return; }
                                                    // currentKey.recordBindCodeType = CodeTypes.get(data.value);

                                                    // onPreviewDeviceUpdate(previewDevice);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'keystroke' ? (
                    <>
                        <div className="main keystroke">
                            <header>
                                <div className="title">
                                    {translate('Device_Keybinding_Label_Keystroke', 'Keystroke')}
                                </div>
                            </header>
                            <label className="field key">
                                <span className="label">{translate('Device_Keybinding_Label_Key', 'Key')}</span>
                                <input
                                    readOnly={true}
                                    value={uiContext.keybindSelectedKeyCode ?? ''}
                                    onClick={() => showSelector(true)}
                                    onKeyDown={(event) => {
                                        console.log('keybind');
                                        setKeybindingKeyCode(event.code);
                                        // event.preventDefault();
                                        // const value = event.code;
                                        // (event.currentTarget as HTMLInputElement).value = value;
                                        // localState.keystrokeValue = value;

                                        // setLocalState(structuredClone(localState));

                                        // const currentKey = getCurrentKey();
                                        // if(currentKey == null) { return; }
                                        // // currentKey.recordBindCodeType = CodeTypes.get(uiContext.keybindBindingType.value);
                                        // currentKey.recordBindCodeName = value;

                                        // KeyAssignManager.combinationkeyEnable

                                        // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                        // keybindData.group = 7;
                                        // keybindData.function = value.toUpperCase();
                                        // keybindData.param = (localState.keystrokeModifierValue == ModifierKeys[0].value) ? '' :
                                        // [
                                        //   (localState.keystrokeModifierValue == ModifierKeys[1].name),
                                        //   (localState.keystrokeModifierValue == ModifierKeys[2].name),
                                        //   (localState.keystrokeModifierValue == ModifierKeys[3].name),
                                        //   (localState.keystrokeModifierValue == ModifierKeys[4].name),
                                        // ];

                                        // onPreviewDeviceUpdate(previewDevice);
                                    }}
                                />
                                <span className="result"></span>
                            </label>
                            <label className="field modifier">
                                <span className="label">
                                    {translate('Device_Keybinding_Label_Modifier', 'Modifier')}
                                </span>
                                <OptionSelectComponent
                                    options={keystrokeModifierOptions}
                                    onChange={(value) => {
                                        const option = ModifierKeys.find((item) => item.optionKey == value);
                                        if (option == null) {
                                            throw new Error('Unknown modifier selected.');
                                        }
                                        setKeybindingKeyModifier(option);

                                        // KeyAssignManager.combinationkeyEnable
                                        // KeyAssignManager.setCombinationKeyEnable()

                                        // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                        // keybindData.param = (value == ModifierKeys[0].value) ? '' :
                                        // [
                                        //   (value == ModifierKeys[1].name),
                                        //   (value == ModifierKeys[2].name),
                                        //   (value == ModifierKeys[3].name),
                                        //   (value == ModifierKeys[4].name),
                                        // ];

                                        // onPreviewDeviceUpdate(previewDevice);
                                    }}
                                />
                            </label>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'keyboardFunction' ? (
                    <>
                        <div className="main">
                            <div className="stack-container keyboard-functions">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_KeyboardFunction', 'Keyboard Function')}
                                    </div>
                                </header>
                                <div className="stack">
                                    {KeyboardFunctions.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedKeyboardFunction == option
                                                        ? 'selected'
                                                        : ''
                                                }
                                                onClick={() => {
                                                    setKeybindingKeyboardFunction(option);
                                                    // localState.keyboardFunction = option;

                                                    // setLocalState(structuredClone(localState));
                                                    // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                                    // const currentKey = getCurrentKey();
                                                    // if(currentKey == null) { return; }
                                                    // currentKey.recordBindCodeType = CodeTypes.get(uiState.keybindBindingType.value);
                                                    // currentKey.recordBindCodeName = value;

                                                    //KeyAssignManager.setNowCodeName('KEYBOARD_Fun_11', 'KEYBOARD')

                                                    // SetGroupFunction('KEYBOARD','KEYBOARD_Fun_10')

                                                    //KeyAssignManager.recordBindCodeName == 'KEYBOARD_Fun_10' Profilecycleup
                                                    //KeyAssignManager.recordBindCodeName == 'KEYBOARD_Fun_11' Profilecycledown
                                                    //KeyAssignManager.recordBindCodeName == 'KEYBOARD_Fun_12' Layercycleup
                                                    //KeyAssignManager.recordBindCodeName == 'KEYBOARD_Fun_13' Layercycledown

                                                    // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                                    // keybindData.group = 8;
                                                    // keybindData.function = data.value;

                                                    // onPreviewDeviceUpdate(previewDevice);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'mouseFunction' ? (
                    <>
                        <div className="main">
                            <div className="stack-container mouse-functions">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_MouseFunction', 'Mouse Function')}
                                    </div>
                                </header>
                                <div className="stack">
                                    {MouseFunctions.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedMouseFunction == option ? 'selected' : ''
                                                }
                                                onClick={() => {
                                                    setKeybindSelectedMouseFunction(option);
                                                    // localState.mouseFunction = data;

                                                    // setLocalState(structuredClone(localState));

                                                    // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                                    // KeyAssignManager.recordBindCodeType == 'MOUSE'

                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_14' Leftbutton
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_15' Rightbutton
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_16' Middlebutton
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_17' Forward
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_18' Back
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_19' Scrollup
                                                    // KeyAssignManager.recordBindCodeName == 'MOUSE_Fun_20' Scrolldown

                                                    // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                                    // keybindData.group = 3;
                                                    // keybindData.function = data.value;

                                                    // onPreviewDeviceUpdate(previewDevice);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'macro' ? (
                    <>
                        <MacroSelectorComponent />
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'multimedia' ? (
                    <>
                        <div className="main">
                            <div className="stack-container multimedia">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Multimedia', 'Multimedia')}
                                    </div>
                                </header>
                                <div className="stack">
                                    {MultimediaOptions.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedMultimediaFunction == option
                                                        ? 'selected'
                                                        : ''
                                                }
                                                onClick={() => {
                                                    setKeybindSelectedMultimediaFunction(option);
                                                    // localState.multimediaOption = option;

                                                    // setLocalState(structuredClone(localState));

                                                    // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                                    // KeyAssignManager.recordBindCodeType == 'Multimedia'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_0'" 'Mediaplayer'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_1'" 'Playpause'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_2'" 'Next'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_3'" 'Previous'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_4'" 'Stop'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_5'" 'Mute'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_6'" 'Volumeup'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_7'" 'Volumedown'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_8'" 'NextSong'
                                                    // "KeyAssignManager.recordBindCodeName == 'Multimedia_Fun_9'" 'PreviousSong'

                                                    // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                                    // keybindData.group = 5;
                                                    // keybindData.function = data.value;

                                                    // onPreviewDeviceUpdate(previewDevice);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'shortcuts' &&
                  (uiContext.keybindSelectedShortcutType == null ||
                      uiContext.keybindSelectedShortcutType.optionKey == 'none') ? (
                    <>
                        <div className="main">
                            <div className="stack-container shortcuts">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Shortcuts', 'Shortcuts')}
                                    </div>
                                </header>
                                <div className="stack">
                                    {ShortcutTypes.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                onClick={() => {
                                                    setKeybindSelectedShortcutType(option);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'shortcuts' &&
                  (uiContext.keybindSelectedShortcutType == null ||
                      uiContext.keybindSelectedShortcutType.optionKey == 'launchProgram') ? (
                    <>
                        <div className="main">
                            <div className="stack-container launchProgram">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Shortcuts', 'Shortcuts')}
                                    </div>
                                </header>
                                <label className="field path">
                                    <span className="label">{translate('Device_Keybinding_Label_Path', 'Path')}</span>
                                    <input
                                        placeholder={translate('Placeholder_LaunchProgramUrl', 'Program Path')}
                                        defaultValue={uiContext.keybindSelectedShortcutProgramPath ?? ''}
                                        onChange={(event) => {
                                            const value = (event.currentTarget as HTMLInputElement).value;
                                            setKeybindSelectedShortcutProgramPath(value);
                                            // const value = (event.currentTarget as HTMLInputElement).value;
                                            // localState.programPath = value;
                                            // setLocalState(structuredClone(localState));

                                            // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                            // KeyAssignManager.recordBindCodeType == 'Shortcuts' || KeyAssignManager.recordBindCodeType == 'LaunchWebsite'|| KeyAssignManager.recordBindCodeType == 'LaunchProgram'

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 2;
                                            // keybindData.function = 1;
                                            // keybindData.param = value;

                                            // onPreviewDeviceUpdate(previewDevice);
                                        }}
                                    />
                                </label>
                                <button type="button" className="secondary" onClick={selectShortcutProgramPath}>
                                    {translate('Button_Browse', 'Browse...')}
                                </button>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'shortcuts' &&
                  (uiContext.keybindSelectedShortcutType == null ||
                      uiContext.keybindSelectedShortcutType.optionKey == 'launchWebsite') ? (
                    <>
                        <div className="main">
                            <div className="stack-container launchWebsite">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Shortcuts', 'Shortcuts')}
                                    </div>
                                </header>
                                <label className="field url">
                                    <span className="label">{translate('Device_Keybinding_Label_URL', 'URL')}</span>
                                    <input
                                        placeholder="Enter URL"
                                        defaultValue={uiContext.keybindSelectedShortcutUrl ?? ''}
                                        onChange={(event) => {
                                            const value = (event.currentTarget as HTMLInputElement).value;
                                            setKeybindSelectedShortcutUrl(value);

                                            // const value = (event.currentTarget as HTMLInputElement).value;
                                            // localState.url = value;
                                            // setLocalState(structuredClone(localState));

                                            // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 2;
                                            // keybindData.function = 2;
                                            // keybindData.param = value;

                                            // onPreviewDeviceUpdate(previewDevice);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'shortcuts' &&
                  (uiContext.keybindSelectedShortcutType == null ||
                      uiContext.keybindSelectedShortcutType.optionKey == 'windows') ? (
                    <>
                        <div className="main">
                            <div className="stack-container windows">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Shortcuts', 'Shortcuts')}
                                    </div>
                                </header>
                                <div className="stack">
                                    {WindowsFunctionShortcuts.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedShortcutWindowsOption == option
                                                        ? 'selected'
                                                        : ''
                                                }
                                                onClick={() => {
                                                    setKeybindSelectedShortcutWindowsOption(option);
                                                    // localState.windowsShortcut = data;
                                                    // setLocalState(structuredClone(localState));

                                                    // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                                    // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                                    // keybindData.group = 2;
                                                    // keybindData.function = 3;
                                                    // keybindData.param = data.value;

                                                    // onPreviewDeviceUpdate(previewDevice);
                                                }}
                                            >
                                                {translate(option.translationKey, option.data?.translationFallback)}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'disable' ? (
                    <>
                        <div className="main">
                            <div className="stack-container disable-options">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Disable', 'Disable')}
                                    </div>
                                </header>
                                <div className="stack">
                                    <a
                                        className={uiContext.keybindDisabledIsSelected == true ? `selected` : ''}
                                        onClick={() => {
                                            setKeybindDisabledIsSelected(!uiContext.keybindDisabledIsSelected);
                                            // localState.disabledSelected = !localState.disabledSelected;
                                            // setLocalState(structuredClone(localState));

                                            // if(localState.keybindSelectedNodeIndex == -1) {  return; }

                                            // KeyAssignManager.recordBindCodeType == 'Disable'

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 6;
                                            // keybindData.function = '';
                                            // keybindData.param = '';

                                            // onPreviewDeviceUpdate(previewDevice);
                                        }}
                                    >
                                        {translate('Device_Keybinding_Label_Disable', 'Disable')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            <MacroEditorComponent
                selectedMacro={uiContext.keybindMacroSelection}
                isOpen={uiContext.macroModal_isOpen}
                onCloseClick={(hasUnsavedData: boolean) => {
                    if (!hasUnsavedData) {
                        closeMacroEditor();
                    } else {
                        closeMacroEditor();
                        setKeybindMacroSelection(undefined);
                    }
                    // todo: warn user
                }}
                onSave={(macro: MacroRecord) => {
                    console.log(macro);
                    updateMacro(macro);
                    setKeybindMacroSelection(macro);
                    closeMacroEditor();
                }}
            />
            {selectorVisible && <KeyCharacterSelector
               onKeySelect={(selectedKey) => {
                    console.log(selectedKey);
                    const value = selectedKey.translationKey;
                    setKeybindingKeyCode(value);
                    showSelector(false);
                }}
                previewDevice={devicesContext.previewDevice}
                onClose={() => showSelector(false)}
            />}
        </>
    );
}

export default KeyboardKeybindingManagementPage;
