import { LayoutNode } from 'src/common/data/device-input-layout.data';
import { LightingLayoutLightData, LightingLayoutRecord } from '../../common/data/records/lighting-layout.record';
import { RGBAColor } from '../../common/data/structures/rgb-color.struct';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { MacroRecord } from 'src/common/data/records/macro.record';
import { DisplayOption } from '@renderer/data/display-option';
import { KeybindingLayers_SingleLayer } from '@renderer/data/keybinding-layer';
import { BindingTypes_ButtonPress } from '@renderer/data/binding-type';
import { AdvancedKeyMode, valueCUIState } from '../../common/data/valueC-data';
import { PerKeyAction } from '@renderer/data/per-key-action.data';

export type LightSettingMode = 'none' | 'preset' | 'per-key';

export class UIState {
    // loading states
    isLoadingDevices: boolean = false;

    // saving states
    isSaving: boolean = false;
    showingSaveSuccess: boolean = false;

    // modal states
    updateDeviceModal_isOpen: boolean = false;
    updateManagerModal_isOpen: boolean = false;
    pairingModal_isOpen: boolean = false;
    macroModal_isOpen: boolean = false;
    advDebounce_isOpen: boolean = false;

    // color values
    colorPickerValue_PresetLighting: RGBAColor = RGBAColor.fromRGB(255, 0, 0);
    colorPickerValue_PerKeyLighting: RGBAColor = RGBAColor.fromRGB(255, 0, 0);
    colorPickerValue_ColorPickerModal: RGBAColor = RGBAColor.fromRGB(255, 0, 0);
    activeLightingPicker_selectedColor: RGBAColor = RGBAColor.fromRGB(255, 0, 0);

    // navigation states
    displayNavigation: boolean = true;

    // preview values //

    // lighting management
    lightSettingMode: LightSettingMode = 'none';
    lightingSelectedPreset: DisplayOption | null = null;
    lightingPresetGradient: DisplayOption | null = null;
    lightingSelectedColorStyle: DisplayOption | null = null;
    selectedColorIndex:number = 0;

    // keybinding management
    keybindSelectedLayer: DisplayOption | null = KeybindingLayers_SingleLayer[0];
    keybindSelectedBindingType: DisplayOption | null = BindingTypes_ButtonPress[0];
    keybindSelectedKeyCode: string | null = null;
    keybindSelectedKeyModifier: DisplayOption | null = null;
    keybindSelectedKeyboardFunction: DisplayOption | null = null;
    keybindSelectedMouseFunction: DisplayOption | null = null;
    keybindSelectedDPIOption: DisplayOption | null = null;
    keybindSelectedMultimediaFunction: DisplayOption | null = null;
    keybindSelectedShortcutType: DisplayOption | null = null;
    // keybindSelectedShortcutOption: DisplayOption|null = null;
    keybindSelectedShortcutProgramPath: string | null = null;
    keybindSelectedShortcutUrl: string | null = null;
    keybindSelectedShortcutWindowsOption: DisplayOption | null = null;
    keybindDisabledIsSelected: boolean = false;
    keybindSoundControlSelection: DisplayOption | null = null;
    keybindAudioToggleTarget: DisplayOption | null = null;
    keybindSelectedRotaryEncoderAction: DisplayOption | null = null;

    // keybind node selection
    keybindSelectedNode: LayoutNode | null = null;
    keybindSelectedNodeIndex: number = -1;
    // rapid trigger selection

    // lighting selection
    perKeyLightingSelectedNode: LayoutNode | null = null;
    perKeyLightingSelectedNodeIndex: number = -1;
    selectedPerKeyAction:PerKeyAction = PerKeyAction.Add;
    selectedPerKeyData: LightingLayoutLightData = new LightingLayoutLightData();

    unsavedPropertyNames: Set<string> = new Set([]);

    keybindMacroSelection?: MacroRecord;
    lightingLayoutSelection?: LightingLayoutRecord;

    // advanced keys
    // advancedKeys_all: Array<any> = [];
    // advancedKeys_selectedKey: LayoutNode|null = null;
    // advancedKeys_selectedBinding: string|null = null;
    // advancedKeys_assignedToggleKey: LayoutNode|null = null;
    // advancedKeys_assignedModTapKey: LayoutNode|null = null;
    // advancedKeys_showCharacterSelector: boolean = false;
    // advancedKeys_dynamicKeyStrokeKey: string|null = null;
    // advancedKeys_dynamicKeyStroke: any = {
    //     keyPress1: { value: 25 },
    //     keyPress2: { value: 75 },
    //     keyRelease1: { value: 25 },
    //     keyRelease2: { value: 75 }
    // };

    valueCState: valueCUIState = new valueCUIState();

    // end preview values //
}

const UIDisplayContext = createContext(new UIState());
const UIUpdateContext = createContext<{ [key: string]: (...params: any[]) => void }>({});

export function useUIContext() {
    return useContext(UIDisplayContext);
}
export function useUIUpdateContext() {
    return useContext(UIUpdateContext);
}

export function UIContext({ children }) {
    // reference holds single value in memory that gets updated
    // when the state changes; state gets provided with the ref
    // object, so it's not getting double-cloned on every update.
    // const stateReference = useRef(new UIState());
    const [state, setState] = useState(new UIState());

    const setDevicesLoading = (value: boolean) => {
        state.isLoadingDevices = value;
        setState({ ...state });
    };
    const setIsSaving = (value: boolean) => {
        state.isSaving = value;
        setState({ ...state });

        if (value == true) {
            // todo: we do not currently listen for a response
            // to determine if the device was properly saved to;
            // we should change this to only be set once we hear
            // a response event; requires backend rework - deprioritized;
            setTimeout(() => {
                state.isSaving = false;
                setShowingSaveSuccess(true);
            }, 750);
        }
    };
    const setShowingSaveSuccess = (value: boolean) => {
        state.showingSaveSuccess = value;
        setState({ ...state });

        if (value == true) {
            // todo: we do not currently listen for a response
            // to determine if the device was properly saved to;
            // we should change this to only be set once we hear
            // a response event; requires backend rework - deprioritized;
            setTimeout(() => {
                state.showingSaveSuccess = false;
                setState({ ...state });
            }, 1000);
        }
    };
    // const update = (value: UIState) =>
    // {
    //     state = value;
    //     setState({...state});
    // }

    // custom cloning function instead of
    // `structuredClone` because we want to
    // preserve custom object values, like
    // RGBAColor properties and UIList/DisplayOption properties
    // const structuredClone = (toClone: UIState) =>
    // {
    //     const newState = new UIState();

    //     newState.unsavedPropertyNames = toClone.unsavedPropertyNames;

    //     // loading states
    //     newState.isLoadingDevices = toClone.isLoadingDevices;
    //     newState.isSaving = toClone.isSaving;
    //     newState.showingSaveSuccess = toClone.showingSaveSuccess;

    //     // modal states
    //     newState.updateManagerModal_isOpen = toClone.updateManagerModal_isOpen;
    //     newState.pairingModal_isOpen = toClone.pairingModal_isOpen;
    //     newState.macroModal_isOpen = toClone.macroModal_isOpen;

    //     // color values
    //     newState.colorPickerValue_PresetLighting = toClone.colorPickerValue_PresetLighting;
    //     newState.colorPickerValue_PerKeyLighting = toClone.colorPickerValue_PerKeyLighting;
    //     newState.colorPickerValue_ColorPickerModal = toClone.colorPickerValue_ColorPickerModal;
    //     newState.activeLightingPicker_selectedColor = toClone.activeLightingPicker_selectedColor;

    //     // navigation states
    //     newState.displayNavigation = toClone.displayNavigation;

    //     // preview values //

    //     // lighting management
    //     newState.lightSettingMode = toClone.lightSettingMode;
    //     newState.lightingSelectedPreset = toClone.lightingSelectedPreset;
    //     newState.lightingPresetGradient = toClone.lightingPresetGradient;
    //     newState.lightingSelectedColorStyle = toClone.lightingSelectedColorStyle;

    //     // keybinding management
    //     newState.keybindSelectedLayer = toClone.keybindSelectedLayer;
    //     newState.keybindSelectedBindingType = toClone.keybindSelectedBindingType;
    //     newState.keybindSelectedKeyCode = toClone.keybindSelectedKeyCode;
    //     newState.keybindSelectedKeyModifier = toClone.keybindSelectedKeyModifier;
    //     newState.keybindSelectedKeyboardFunction = toClone.keybindSelectedKeyboardFunction;
    //     newState.keybindSelectedMouseFunction = toClone.keybindSelectedMouseFunction;
    //     newState.keybindSelectedDPIOption = toClone.keybindSelectedDPIOption;
    //     newState.keybindSelectedMultimediaFunction = toClone.keybindSelectedMultimediaFunction;
    //     newState.keybindSelectedShortcutType = toClone.keybindSelectedShortcutType;
    //     // newState.keybindSelectedShortcutOption = toClone.keybindSelectedShortcutOption;
    //     newState.keybindSelectedShortcutProgramPath = toClone.keybindSelectedShortcutProgramPath;
    //     newState.keybindSelectedShortcutUrl = toClone.keybindSelectedShortcutUrl;
    //     newState.keybindSelectedShortcutWindowsOption = toClone.keybindSelectedShortcutWindowsOption;
    //     newState.keybindDisabledIsSelected = toClone.keybindDisabledIsSelected;
    //     newState.keybindSoundControlSelection = toClone.keybindSoundControlSelection;
    //     newState.keybindAudioToggleTarget = toClone.keybindAudioToggleTarget;

    //     // keybind node selection
    //     newState.keybindSelectedNode = toClone.keybindSelectedNode;
    //     newState.keybindSelectedNodeIndex = toClone.keybindSelectedNodeIndex;

    //     // // advanced keybinV
    //     // newState.advancedKeys_dynamicKeyStrokeKey = toClone.advancedKeys_dynamicKeyStrokeKey;
    //     // newState.advancedKeys_selectedKey = toClone.advancedKeys_selectedKey;
    //     // newState.advancedKeys_selectedBinding = toClone.advancedKeys_selectedBinding;
    //     // newState.advancedKeys_assignedToggleKey = toClone.advancedKeys_assignedToggleKey;
    //     // newState.advancedKeys_assignedModTapKey = toClone.advancedKeys_assignedModTapKey;
    //     // newState.advancedKeys_dynamicKeyStroke = toClone.advancedKeys_dynamicKeyStroke;
    //     // newState.advancedKeys_all = toClone.advancedKeys_all;
    //     // newState.advancedKeys_showCharacterSelector = toClone.advancedKeys_showCharacterSelector;

    //     // lighting selection
    //     newState.lightingSelectedNode = toClone.lightingSelectedNode;
    //     newState.lighting_perKeyData = toClone.lighting_perKeyData;

    //     // records
    //     newState.keybindMacroSelection = toClone.keybindMacroSelection;
    //     newState.lightingLayoutSelection = toClone.lightingLayoutSelection;

    //     // end preview values //

    //     newState.valueCState = toClone.valueCState;

    //     return newState;
    // }

    const setPreviewDevicePropertiesAsUnsaved = (...propertyNames: string[]) => {
        const unsavedProperties = new Set(state.unsavedPropertyNames);
        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName = propertyNames[i];
            unsavedProperties.add(propertyName);
        }
        state.unsavedPropertyNames = unsavedProperties;
        setState({ ...state });
    };

    const clearUnsavedPreviewDeviceProperties = () => {
        state.unsavedPropertyNames = new Set();
        setState({ ...state });
    };

    // modals
    const openMacroEditor = () => {
        state.macroModal_isOpen = true;
        setState({ ...state });
    };
    const closeMacroEditor = () => {
        state.macroModal_isOpen = false;
        setState({ ...state });
    };
    const openUpdateManager = () => {
        state.updateManagerModal_isOpen = true;
        setState({ ...state });
    };    
    const closeUpdateManager = () => {
        state.updateManagerModal_isOpen = false;
        setState({ ...state });
    };
    const openDeviceUpdateModal = () => {
        state.updateDeviceModal_isOpen = true;
        setState({ ...state });
    };
    const closeDeviceUpdateModal = () => {
        state.updateDeviceModal_isOpen = false;
        setState({ ...state });
    };
    const openPairingUtility = () => {
        state.pairingModal_isOpen = true;
        setState({ ...state });
    };
    const closePairingUtility = () => {
        state.pairingModal_isOpen = false;
        setState({ ...state });
    };
    const openAdvDebounce = () => {
        state.advDebounce_isOpen = true;
        setState({ ...state });
    };
    const closeAdvDebounce = () => {
        state.advDebounce_isOpen = false;
        setState({ ...state });
    };

    // color values
    const setColor_PresetColorPicker = (color: RGBAColor) => {
        state.colorPickerValue_PresetLighting = color;
        state.activeLightingPicker_selectedColor = color;
        setState({ ...state });
    };
    const setColor_PerKeyColorPicker = (color: RGBAColor) => {
        state.colorPickerValue_PerKeyLighting = color;
        state.activeLightingPicker_selectedColor = color;
        setState({ ...state });
    };
    const setColor_ModalColorPicker = (color: RGBAColor) => {
        state.colorPickerValue_ColorPickerModal = color;
        state.activeLightingPicker_selectedColor = color;
        setState({ ...state });
    };

    // navigation
    const setDisplayNavigation = (value: boolean) => {
        state.displayNavigation = value;
        setState({ ...state });
    };

    // lighting
    const setLightingColorStyle = (colorStyle: DisplayOption) => {
        console.log('how');
        debugger;
        // state.lightingSelectedColorStyle = colorStyle;
        setState({ ...state });
    };
    const setLightingLayoutSelection = (lightingLayout: LightingLayoutRecord | undefined) => {
        state.lightingLayoutSelection = lightingLayout;
        setState({ ...state });
    };
    const setLightSettingMode = (value: LightSettingMode) => {
        state.lightSettingMode = value;
        setState({ ...state });
    };
    const setLightingPresetSelection = (option: DisplayOption) => {
        state.lightingSelectedPreset = option;
        setState({ ...state });
    };
    const setLightingPresetGradient = (option: DisplayOption) => {
        state.lightingPresetGradient = option;
        setState({ ...state });
    };
    const setPerkeylightingSelectedNode = (node: LayoutNode) => {
        state.lightSettingMode = 'per-key';
        state.perKeyLightingSelectedNode = node;
        setState({ ...state });
    };
    const setPerkeylightingSelectedNodeIndex = (index: number) => {
        state.perKeyLightingSelectedNodeIndex = index;
        setState({ ...state });
    };

    const setSelectedColorIndex = (index: number) => {
        state.selectedColorIndex = index;
        setState({...state});
    }
    
    const setSelectedPerKeyAction = (action: PerKeyAction) => {
        state.selectedPerKeyAction = action;
        setState({...state});
    }
    

    // keybinding
    const setKeybindingLayer = (option: DisplayOption) => {
        state.keybindSelectedLayer = option;
        setState({ ...state });
    };
    const setKeybindingType = (option: DisplayOption) => {
        state.keybindSelectedBindingType = option;
        setState({ ...state });
    };
    const setKeybindingKeyCode = (value: string | null) => {
        state.keybindSelectedKeyCode = value;
        setState({ ...state });
    };
    const setKeybindingKeyModifier = (option: DisplayOption) => {
        state.keybindSelectedKeyModifier = option;
        setState({ ...state });
    };
    const setKeybindingKeyboardFunction = (option: DisplayOption) => {
        state.keybindSelectedKeyboardFunction = option;
        setState({ ...state });
    };
    const setKeybindSelectedMouseFunction = (option: DisplayOption) => {
        state.keybindSelectedMouseFunction = option;
        setState({ ...state });
    };
    const setKeybindSelectedDPIOption = (option: DisplayOption) => {
        state.keybindSelectedDPIOption = option;
        setState({ ...state });
    };
    const setKeybindSelectedMultimediaFunction = (option: DisplayOption) => {
        state.keybindSelectedMultimediaFunction = option;
        setState({ ...state });
    };
    const setKeybindSelectedShortcutType = (option: DisplayOption) => {
        state.keybindSelectedShortcutType = option;
        setState({ ...state });
    };
    // const setKeybindSelectedShortcutOption = (option: DisplayOption) =>
    // {
    //     state.keybindSelectedShortcutOption = option;
    //     setUiState({...state});
    // }
    const setKeybindSelectedShortcutProgramPath = (value: string | null) => {
        state.keybindSelectedShortcutProgramPath = value;
        setState({ ...state });
    };
    const setKeybindSelectedShortcutUrl = (value: string | null) => {
        state.keybindSelectedShortcutUrl = value;
        setState({ ...state });
    };
    const setKeybindSelectedWindowsOption = (option: DisplayOption) => {
        state.keybindSelectedShortcutWindowsOption = option;
        setState({ ...state });
    };
    const setKeybindDisabledIsSelected = (value: boolean) => {
        state.keybindDisabledIsSelected = value;
        setState({ ...state });
    };
    const setKeybindSoundControlSelection = (value: any) => {
        state.keybindSoundControlSelection = value;
        setState({ ...state });
    };
    const setKeybindAudioToggleTarget = (value: any) => {
        state.keybindAudioToggleTarget = value;
        setState({ ...state });
    };
    const setKeybindMacroSelection = (macro: MacroRecord | undefined) => {
        state.keybindMacroSelection = macro;
        setState({ ...state });
    };
    const setKeybindingSelectedNode = (node: LayoutNode, index: number) => {
        state.keybindSelectedNode = node;
        state.keybindSelectedNodeIndex = index;
        setState({ ...state });
    };
    const setRotaryEncoderAction = (option: DisplayOption) => {
        state.keybindSelectedRotaryEncoderAction = option;
        setState({ ...state });
    };

    const setAdvancedKeybindingsMode = () => {};

    const setAdvancedKeysSelectedKeyTmp = () => {};

    const setvalueCState = (value: valueCUIState) => {
        state.valueCState = value;
        setState({ ...state });
    };

    const setvalueCAdvancedKeyBindingMode = (value: valueCUIState) => {
        switch (value.advancedKeysBindingMode) {
            case AdvancedKeyMode.None:
                value.advancedKeysSelectedKeyTmp = null;
                value.advancedKeysAssignedTmp = {
                    toggle: null,
                    modTapHold: null,
                    modTapPress: null,
                    dynamicKeystrokes: null,
                };
                value.advancedKeysSelectedTriggerPoint = null;
                break;
            default:
                break;
        }
        state.valueCState = value;
        setState({ ...state });
    };

    const setvalueCVisualizationEnabled = (value: boolean) => {
        state.valueCState.isVisualisationEnabled = value;
        setState({ ...state });
    };

    const setvalueCVisualizationValue = (value: number) => {
        state.valueCState.visualisationDisplayValue = value;
        setState({ ...state });
    };

    const update = (state: UIState) => {
        setState({ ...state });
    };

    const updateFunctions = {
        update,
        setDevicesLoading,
        setIsSaving,
        setShowingSaveSuccess,
        setPreviewDevicePropertiesAsUnsaved,
        clearUnsavedPreviewDeviceProperties,
        // modals
        openMacroEditor,
        closeMacroEditor,
        openUpdateManager,
        closeUpdateManager,
        openDeviceUpdateModal,
        closeDeviceUpdateModal,
        openPairingUtility,
        closePairingUtility,
        openAdvDebounce,
        closeAdvDebounce,
        // colors
        setColor_PresetColorPicker,
        setColor_PerKeyColorPicker,
        setColor_ModalColorPicker,
        // navigation
        setDisplayNavigation,

        // lighting
        setLightingColorStyle,
        setLightingLayoutSelection,
        setLightSettingMode,
        setLightingPresetSelection,
        setLightingPresetGradient,
        setPerkeylightingSelectedNode,
        setPerkeylightingSelectedNodeIndex,
        setSelectedColorIndex,
        setSelectedPerKeyAction,
        // keybinding
        setKeybindingLayer,
        setKeybindingType,
        setKeybindingKeyCode,
        setKeybindingKeyModifier,
        setKeybindingKeyboardFunction,
        setKeybindSelectedMouseFunction,
        setKeybindSelectedDPIOption,
        setKeybindSelectedMultimediaFunction,
        setKeybindSelectedShortcutType,
        // setKeybindSelectedShortcutOption,
        setKeybindSelectedShortcutProgramPath,
        setKeybindSelectedShortcutUrl,
        setKeybindSelectedWindowsOption,
        setKeybindDisabledIsSelected,
        setKeybindSoundControlSelection,
        setKeybindAudioToggleTarget,
        setKeybindMacroSelection,
        setKeybindingSelectedNode,
        setRotaryEncoderAction,

        // valueC
        setvalueCState,
        setvalueCAdvancedKeyBindingMode,
        setvalueCVisualizationEnabled,
        setvalueCVisualizationValue,
    };

    return (
        <UIDisplayContext.Provider value={state}>
            <UIUpdateContext.Provider value={updateFunctions}>{children}</UIUpdateContext.Provider>
        </UIDisplayContext.Provider>
    );
}
