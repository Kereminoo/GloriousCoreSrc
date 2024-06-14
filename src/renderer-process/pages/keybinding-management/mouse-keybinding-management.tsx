import { useRef, useState } from 'react';
import OptionSelectComponent from '@renderer/components/option-select/option-select.component';
import MacroEditorComponent from '@renderer/components/macro-editor/macro-editor.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useRecordsContext, useRecordsUpdateContext } from '@renderer/contexts/records.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { DisplayOption } from '@renderer/data/display-option';
import { ModifierKeys } from '@renderer/data/modifier-key';
import { ShortcutTypes } from '@renderer/data/shortcut-option';
import { MouseFunctions } from '@renderer/data/mouse-function';
import { DPIOptions } from '@renderer/data/dpi-option';
import { MultimediaOptions } from '@renderer/data/multimedia-option';
import { KeyboardFunctions } from '@renderer/data/keyboard-function';
import { WindowsFunctionShortcuts } from '@renderer/data/windows-shortcut-option';
import { BindingTypes_ButtonPress } from '@renderer/data/binding-type';
import { SupportData } from '../../../common/SupportData';
import MacroSelectorComponent from '../../components/macro-selector/macro-selector-component';
import { AppService } from '@renderer/services/app.service';

// class LocalState
// {
//   keybindSelectedNode: LayoutNode|null = null;
//   keybindSelectedNodeIndex: number = -1;
//   keystrokeValue: string = "";
//   keystrokeModifierValue: DisplayOption|undefined;
//   keyboardFunction: DisplayOption|undefined;
//   mouseFunction: DisplayOption|undefined;
//   dpiOption: DisplayOption|undefined;
//   // macroSelection: UIListItem|null = null;
//   macroTypeSelection: DisplayOption|undefined;
//   shortcutType: DisplayOption|null = null;
//   programPath: string = "";
//   url: string = "";
//   windowsShortcut: DisplayOption|undefined;
//   multimediaOption: DisplayOption|undefined;
//   disabledSelected: boolean = false;

//   hasLayerShiftButtonSet: boolean = false;
// }

// const BindingGroupMap = new Map<number, Array<UIListItem>>();

// TODO: centralize
const SupportsLayerShift = [
    '0x22D40x1503', // Model I Wired
    '0x093A0x821A', // Model I2 Wireless
    '0x320F0x831A', // Model valueG
];

function MouseKeybindingManagementPage(props: any) {
    // const { previewDevice, onPreviewDeviceUpdate, uiState, onUIStateUpdate, macros } = props;

    const devicesContext = useDevicesContext();
    const uiContext = useUIContext();
    const { setKeybindingType: setUIKeybindingType } = useUIUpdateContext();
    const recordsContext = useRecordsContext();
    const translate = useTranslate();

    const { openMacroEditor, closeMacroEditor } = useUIUpdateContext();

    const {
        setKeybindingLayer,
        setKeybindingType,
        setKeybindingKeyCode,
        setKeybindingKeyModifier,
        setKeybindingKeyboardFunction,
        setKeybindSelectedMouseFunction,
        setKeybindSelectedDPIOption,
        setKeybindSelectedMultimediaFunction,
        setKeybindSelectedShortcutType, // setKeybindSelectedShortcutOption,
        setKeybindSelectedShortcutProgramPath,
        setKeybindSelectedShortcutUrl,
        setKeybindSelectedShortcutWindowsOption,
        setKeybindDisabledIsSelected,
        setKeybindSoundControlSelection,
        setKeybindAudioToggleTarget,
        setKeybindMacroSelection,
    } = useDevicesManagementContext();

    const { updateMacro, deleteMacro } = useRecordsUpdateContext();

    const keystrokeModifierOptions = ModifierKeys.map((keyData, i) => {
        return {
            value: keyData.optionKey,
            label: translate(keyData.translationKey, keyData.data?.translationFallback),
        };
    });

    // const [localState, setLocalState] = useState(new LocalState());

    const [currentProfile, setCurrentProfile] = useState<any>(null);
    // const [macros, setMacros] = useState<MacroRecord[]>([]);

    const keystrokeInput = useRef();
    const keystrokeModifier = useRef();

    const selectShortcutProgramPath = async () => {
        const result = await AppService.dialogShortcutProgramPath();
        console.log(`Program Shortcut Selection: ${result.success ? 'Success' + result.data : 'Failure: '}`);
        setKeybindingType(
            BindingTypes_ButtonPress.find((x) => x.optionKey == uiContext.keybindSelectedBindingType?.optionKey),
        );
        setKeybindSelectedShortcutProgramPath(result.data);
    };
    // useEffect(() =>
    // {

    //   // if selected node was null, keep all settings instead of
    //   // replacing them with node values;
    //   // else if the management subpage was navigated to by clicking
    //   // a mouse button node (selected node won't be null), then we
    //   // should replace the keybinding data with the node's values.
    //   // if the node doesn't have any keybinding values set, we don't
    //   // override the current values

    //   // const updatedLocalState = structuredClone(localState);
    //   // updatedLocalState.keybindSelectedNode = uiContext.keybindSelectedNode;
    //   // updatedLocalState.keybindSelectedNodeIndex = uiContext.keybindSelectedNodeIndex;
    //   // updatedLocalState.shortcutType = uiContext.keybindShortcutType;
    //   // updatedLocalState.macroSelection = uiContext.keybindMacroSelection;

    //   // if(updatedLocalState.keybindSelectedNode == null || currentProfile == null) { return; }

    //   // // console.log(previewDevice, updatedLocalState);

    //   // const keybindingData = currentProfile.keybinding[uiContext.keybindSelectedNodeIndex];
    //   // // console.log(keybindingData);
    //   // if(keybindingData.group == 1) // Macro
    //   // {

    //   // }
    //   // else if (keybindingData.group == 2) // Shortcut
    //   // {
    //   //   updatedLocalState.shortcutType = ShortcutTypes.find(item => item.value == keybindingData.function) ?? null;
    //   // }
    //   // else if(keybindingData.group == 3) // Mouse Function
    //   // {
    //   //   updatedLocalState.mouseFunction = MouseFunctions.find(item => item.value == keybindingData.function);
    //   // }
    //   // else if(keybindingData.group == 4) // DPI Data
    //   // {
    //   //   updatedLocalState.dpiOption = DPIOptions.find(item => item.value == keybindingData.function);
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
    //   //   // updatedLocalState.keystrokeModifierValue = (keybindingData.param == '') ? ModifierKeys[0].optionKey :
    //   //   // (keybindingData.param[0] == true) ? ModifierKeys[1].optionKey :
    //   //   // (keybindingData.param[1] == true) ? ModifierKeys[2].optionKey :
    //   //   // (keybindingData.param[2] == true) ? ModifierKeys[3].optionKey :
    //   //   // (keybindingData.param[3] == true) ? ModifierKeys[4].optionKey : "";
    //   // }
    //   // else if(keybindingData.group == 8) // Keyboard Function
    //   // {
    //   //   updatedLocalState.keyboardFunction = KeyboardFunctions.find(item => item.value == keybindingData.function);
    //   // }

    //   // setLocalState(updatedLocalState);
    // }, [uiContext]);

    // useEffect(() =>
    // {
    //   if(devicesContext.previewDevice == null) { return; }
    //   // setCurrentProfile(DeviceService.getCurrentDeviceProfile(devicesContext.previewDevice));

    //   // we only need to update this when the device changes;
    //   // if a user sets the layer shift function in the UI, we
    //   // don't want to allow them to set layer shift buttons yet.
    //   // they have to save it to the device, first, which will
    //   // update the previewDevice state, here.
    //   // localState.hasLayerShiftButtonSet = false; // todo;

    //   // const updatedLocalState = structuredClone(localState);
    //   // if(localState.keybindSelectedNode != null)
    //   // {
    //   //   const keybindingData = DeviceService.getCurrentDeviceProfile(previewDevice).keybinding[uiState.keybindSelectedNodeIndex];
    //   //   const functionValue = keybindingData.function;
    //   //   const paramValue = keybindingData.function;
    //   //   console.log(functionValue, paramValue);
    //   //   // updatedLocalState.keystrokeValue = "";
    //   //   // updatedLocalState.keyboardFunction = ;
    //   //   // updatedLocalState.mouseFunction = ;
    //   //   // updatedLocalState.macroSelection = ;
    //   //   // updatedLocalState.macroTypeSelection = ;
    //   //   // updatedLocalState.programPath = ;
    //   //   // updatedLocalState.url = ;
    //   //   // updatedLocalState.windowsShortcut = ;
    //   //   // updatedLocalState.multimediaOption = ;
    //   //   // updatedLocalState.disabledSelected = ;
    //   // }
    //   // else
    //   // {
    //   //   // updatedLocalState.keystrokeValue = "";
    //   //   // updatedLocalState.keyboardFunction = ;
    //   //   // updatedLocalState.mouseFunction = ;
    //   //   // updatedLocalState.macroSelection = ;
    //   //   // updatedLocalState.macroTypeSelection = ;
    //   //   // updatedLocalState.programPath = ;
    //   //   // updatedLocalState.url = ;
    //   //   // updatedLocalState.windowsShortcut = ;
    //   //   // updatedLocalState.multimediaOption = ;
    //   //   // updatedLocalState.disabledSelected = ;
    //   // }
    // }, [devicesContext.previewDevice]);

    // useEffect(() =>
    // {
    //   setMacros(recordsContext.macros);
    // }, [recordsContext.macros]);

    return (
        <>
            <div className="layout keybinding mouse">
                {uiContext.keybindSelectedNodeIndex == -1 ? (
                    <div className="panel no-device-input-selection">
                        <em>
                            {translate(
                                'Device_Keybinding_Mouse_SelectButton',
                                'Select a Mouse Button, above, to see its keybinding options.',
                            )}
                        </em>
                    </div>
                ) : devicesContext.previewDevice?.SN == '0x093A0x821A' &&
                  uiContext.keybindSelectedLayer?.optionKey == 'none' ? (
                    <div className="panel main">
                        <div className="stack-container layers">
                            <div className="stack">
                                {devicesContext.previewDevice?.keybindingLayers.map((option: DisplayOption) => {
                                    return (
                                        <a
                                            key={option.optionKey}
                                            onClick={() => {
                                                setKeybindingLayer(option);
                                            }}
                                        >
                                            {translate(option.optionKey, option.data?.translationFallback)}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'none' ? (
                    <>
                        <div className="panel main">
                            {uiContext.keybindSelectedLayer?.optionKey != 'layerShift' ||
                            uiContext.keybindSelectedLayer?.optionKey ==
                                'layerShift' /*&& localState.hasLayerShiftButtonSet*/ ? (
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
                                        {BindingTypes_ButtonPress.map((option: DisplayOption) => {
                                            if (option.optionKey == 'none') {
                                                return null;
                                            }

                                            return (
                                                <a
                                                    key={option.value}
                                                    onClick={() => {
                                                        setUIKeybindingType(option);
                                                    }}
                                                >
                                                    {translate(option.translationKey, option.data?.translationFallback)}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <header>
                                        <div className="title">
                                            {translate('Device_Keybinding_Label_LayerShift_Heading', 'Layer Shift')}
                                        </div>
                                    </header>
                                    <p>
                                        {translate(
                                            'Device_Keybinding_Label_LayerShift_Description',
                                            "A mouse button must be assigned as Layer Shift on the Standard layer under 'Mouse Function' in order to access the second layer of functionality.",
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setKeybindingLayer(devicesContext.previewDevice!.keybindingLayers[0]);
                                        }}
                                    >
                                        {translate('Button_Assign', 'Assign')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'keystroke' ? (
                    <>
                        <div className="panel main keystroke">
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
                                    onKeyDown={(event) => {
                                        event?.stopPropagation();
                                        event?.preventDefault();

                                        //todo: the keyCode property is deprecated; remap the support data keymapping class to use event.code property as its lookup key

                                        const mappedItem = SupportData.KeyMapping.find(
                                            (item) => item.code == event.code,
                                        );
                                        if (mappedItem == null) {
                                            throw new Error('Unknown Key pressed');
                                        }
                                        const value = mappedItem.value;

                                        setKeybindingType(
                                            BindingTypes_ButtonPress.find(
                                                (x) => x.optionKey == uiContext.keybindSelectedBindingType?.optionKey,
                                            ),
                                        );
                                        setKeybindingKeyCode(value);

                                        return false;
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
                                    }}
                                />
                            </label>
                        </div>
                    </>
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'keyboardFunction' ? (
                    <>
                        <div className="panel main keyboard-functions">
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
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
                                                    setKeybindingKeyboardFunction(option);
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
                        <div className="panel main mouse-functions">
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
                                        if (
                                            option.optionKey == 'layerShift' &&
                                            !SupportsLayerShift.includes(devicesContext.previewDevice?.SN ?? '')
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedMouseFunction == option ? 'selected' : ''
                                                }
                                                onClick={() => {
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
                                                    setKeybindSelectedMouseFunction(option);
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
                ) : uiContext.keybindSelectedBindingType?.optionKey == 'dpi' ? (
                    <>
                        <div className="panel main dpi">
                            <div className="stack-container dpi-options">
                                <header>
                                    <div className="title">{translate('Device_Keybinding_Label_DPI', 'DPI')}</div>
                                </header>
                                <div className="stack">
                                    {DPIOptions.map((option: DisplayOption) => {
                                        if (option.optionKey == 'none') {
                                            return null;
                                        }
                                        return (
                                            <a
                                                key={option.value}
                                                className={
                                                    uiContext.keybindSelectedDPIOption == option ? 'selected' : ''
                                                }
                                                onClick={() => {
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
                                                    setKeybindSelectedDPIOption(option);
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
                        <div className="panel main multimedia">
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
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
                                                    setKeybindSelectedMultimediaFunction(option);
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
                        <div className="panel main shortcuts">
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
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
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
                        <div className="panel main shortcuts">
                            <div className="stack-container launchProgram">
                                <header>
                                    <div className="title">
                                        {translate('Device_Keybinding_Label_Shortcuts', 'Shortcuts')}
                                    </div>
                                </header>
                                <label className="field path">
                                    <span className="label">{translate('Device_Keybinding_Label_Path', 'Path')}</span>
                                    <input
                                        placeholder="Enter Path"
                                        defaultValue={uiContext.keybindSelectedShortcutProgramPath ?? ''}
                                        onChange={(event) => {
                                            const value = (event.currentTarget as HTMLInputElement).value;
                                            setKeybindingType(
                                                BindingTypes_ButtonPress.find(
                                                    (x) =>
                                                        x.optionKey == uiContext.keybindSelectedBindingType?.optionKey,
                                                ),
                                            );
                                            setKeybindSelectedShortcutProgramPath(value);
                                            // localState.programPath = value;

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 2;
                                            // keybindData.function = 1;
                                            // keybindData.param = value;
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
                        <div className="panel main shortcuts">
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
                                            setKeybindingType(
                                                BindingTypes_ButtonPress.find(
                                                    (x) =>
                                                        x.optionKey == uiContext.keybindSelectedBindingType?.optionKey,
                                                ),
                                            );
                                            setKeybindSelectedShortcutUrl(value);

                                            // localState.url = value;

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 2;
                                            // keybindData.function = 2;
                                            // keybindData.param = value;
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
                        <div className="panel main windows">
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
                                                    setKeybindingType(
                                                        BindingTypes_ButtonPress.find(
                                                            (x) =>
                                                                x.optionKey ==
                                                                uiContext.keybindSelectedBindingType?.optionKey,
                                                        ),
                                                    );
                                                    setKeybindSelectedShortcutWindowsOption(option);
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
                        <div className="panel main disable">
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
                                            setKeybindingType(
                                                BindingTypes_ButtonPress.find(
                                                    (x) =>
                                                        x.optionKey == uiContext.keybindSelectedBindingType?.optionKey,
                                                ),
                                            );
                                            setKeybindDisabledIsSelected(!uiContext.keybindDisabledIsSelected);

                                            // localState.disabledSelected = !localState.disabledSelected;

                                            // const keybindData = currentProfile.keybinding[localState.keybindSelectedNodeIndex];
                                            // keybindData.group = 6;
                                            // keybindData.function = '';
                                            // keybindData.param = '';
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
                        return;
                    }
                    // todo: warn user
                }}
                onSave={(macro) => {
                    console.log(macro);
                    updateMacro(macro);
                    setKeybindMacroSelection(macro);
                    closeMacroEditor();
                }}
            />
        </>
    );
}

export default MouseKeybindingManagementPage;
