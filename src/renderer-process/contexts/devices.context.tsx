import { DevicesAdapter } from '@renderer/adapters/devices.adapter';
import { ProtocolService } from '@renderer/services/protocol.service';
import { AppEvent } from '@renderer/support/app.events';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { EventTypes } from '../../common/EventVariable';
import { FuncName, FuncType } from '../../common/FunctionVariable';
import { useUIContext, useUIUpdateContext } from './ui.context';
import { BatteryStatusData } from '../../common/data/battery-status';
import { useLocation } from 'react-router';
import { DeviceService } from '@renderer/services/device.service';
import { UIDevice } from '@renderer/data/ui-device';
import {
    AdvanceDebounceSettings,
    DeviceRecordColorData,
    DPIStageData,
    PerKeyLightingKeyData,
    PresetLightingData,
} from '../../common/data/records/device-data.record';
import { RGBAColor } from '../../common/data/structures/rgb-color.struct';
import { DisplayOption } from '@renderer/data/display-option';
import { StandbyTypes } from '@renderer/data/standby-type';
import { MacroRecord } from 'src/common/data/records/macro.record';
// import { DeviceInputLayoutMap, LayoutNode, QuickKeyId } from '../../common/data/device-input-layout.data';
import { LayoutNode, QuickKeyId } from '../../common/data/device-input-layout.data';
import { ModifierKeys } from '@renderer/data/modifier-key';
import { KeyboardKeyAssignmentData } from '../data/legacy/keyboard-data';
import {
    ActuationData,
    DynamicKeystrokeData,
    KeyboardvalueCKeyData,
    valueCUIState,
    ModTapData,
    RapidTriggerData,
    ToggleData,
    ToggleType,
} from '../../common/data/valueC-data';
import { BindingTypes_ButtonPress, BindingTypes_KeyPress } from '@renderer/data/binding-type';
import { ShortcutTypes } from '@renderer/data/shortcut-option';
import { EventKey_BindingCodeMap } from '@renderer/data/event-key-binding-code.map';
import { RGBGradients_Default } from '@renderer/data/rgb-gradient';
import { KeyMapping } from '../../common/SupportData';
import { LightingEffects_Keyboard } from '../data/lighting-effect';
// import { KeybindingTypeCodeMap } from '@renderer/data/keybinding-type-code.map';

// import { isNaN } from 'lodash';

const fixedColorsPresetEffects = [0, 5, 16, 17];
export class DevicesState {
    subscribed: boolean = false;
    devices: UIDevice[] = [];
    referenceDevice?: UIDevice;
    previewDevice?: UIDevice;
    // currentProfile?: ProfileData;
    // currentProfileLayer?: ProfileData;
    currentProfileLayerIndex?: number;

    pairableDevices: any[] = [];

    hasInitializedDevices: boolean = false;
    isRefreshingDevices: boolean = false;
    devicesCurrentlyUpdating: string[] = [];

    presetEffectHasFixedColors: boolean = true;
}

const DevicesDisplayContext = createContext<DevicesState>(new DevicesState());
const DevicesManagementContext = createContext({} as any);

export function useDevicesContext() {
    return useContext(DevicesDisplayContext);
}

export function useDevicesManagementContext() {
    return useContext(DevicesManagementContext);
}

export function DevicesContext({ children }) {
    // reference holds single value in memory that gets updated
    // when the state changes; state gets provided with the ref
    // object, so it's not getting double-cloned on every update.
    // const stateReference = useRef(new DevicesState());
    // const [displayState, setDisplayState] = useState(state);

    const [state, setStateInt] = useState(new DevicesState());

    const eventStateRef = useRef(state);

    const setState = (devicesState: DevicesState) => {
        const deviceStateUpdate = (device: UIDevice | undefined) => {
            if (device != null) {
                device.deviceData = structuredClone(device.deviceData);
                if (device.keyboardData != null) {
                    device.keyboardData = structuredClone(device.keyboardData);
                }
                return { ...device } as UIDevice;
            }
            return undefined;
        };

        devicesState.previewDevice = deviceStateUpdate(devicesState.previewDevice);
        if (devicesState.previewDevice != null) {
            updateDevicesReference();
        }

        setStateInt(devicesState);
        eventStateRef.current = devicesState;
    };

    const location = useLocation();

    const uiContext = useUIContext();
    const {
        setIsSaving,
        setShowingSaveSuccess,
        clearUnsavedPreviewDeviceProperties,
        setDevicesLoading,
        setPreviewDevicePropertiesAsUnsaved,
        setLightingColorStyle,
        setLightingPresetSelection,
        setLightingPresetGradient,

        setLightSettingMode,
        setSelectedColorIndex,

        setKeybindingLayer: setUIKeybindingLayer,
        setKeybindingType: setUIKeybindingType,
        setKeybindingKeyCode: setUIKeybindingKeyCode,
        setKeybindingKeyModifier: setUIKeybindingKeyModifier,
        setKeybindingKeyboardFunction: setUIKeybindingKeyboardFunction,
        setKeybindSelectedMouseFunction: setUIKeybindSelectedMouseFunction,
        setKeybindSelectedDPIOption: setUIKeybindSelectedDPIOption,
        setKeybindSelectedMultimediaFunction: setUIKeybindSelectedMultimediaFunction,
        setKeybindSelectedShortcutType: setUIKeybindSelectedShortcutType, // setKeybindSelectedShortcutOption:setUIKeybindSelectedShortcutOption,
        setKeybindSelectedShortcutProgramPath: setUIKeybindSelectedShortcutProgramPath,
        setKeybindSelectedShortcutUrl: setUIKeybindSelectedShortcutUrl,
        setKeybindSelectedWindowsOption: setUIKeybindSelectedWindowsOption,
        setKeybindDisabledIsSelected: setUIKeybindDisabledIsSelected,
        setKeybindSoundControlSelection: setUIKeybindSoundControlSelection,
        setKeybindAudioToggleTarget: setUIKeybindAudioToggleTarget,
        setKeybindMacroSelection: setUIKeybindMacroSelection,
        setKeybindingSelectedNode: setUIKeybindingSelectedNode,
        setRotaryEncoderAction: setUIRotaryEncoderAction,
        setvalueCState: setUIvalueCState,
        setvalueCVisualizationEnabled: setUIvalueCVisualizationEnabled,
        setvalueCVisualizationValue: setvalueCVisualizationValue,
    } = useUIUpdateContext();

    // initialize devices; listen for refresh events
    useEffect(() => {
        if (state.hasInitializedDevices == true) {
            return;
        }

        // AppEvent.subscribe(EventTypes.RefreshDevice, onRefreshDevice);
        // AppEvent.subscribe(EventTypes.GetBatteryStats, onGetBatteryStats);
        // AppEvent.subscribe(EventTypes.valueCVisualizationUpdate, onvalueCVisualizationUpdate);
        // AppEvent.subscribe(EventTypes.SwitchUIProfile, onSwitchUIProfile);
        // AppEvent.subscribe(EventTypes.SavedDevice, (event) =>
        // {
        //   const data = (event as CustomEvent).detail;
        //   setLastDataSent(data);
        // })

        setDevicesLoading(true);

        // this.translate.addLangs(['tw', 'en']);
        let obj = {
            Type: FuncType.System,
            SN: '',
            Func: FuncName.InitDevice,
            Param: '',
        };

        ProtocolService.RunSetFunction(obj).then((data: any) => {
            console.log(data);
            if (data.success == false) {
                state.hasInitializedDevices = false;
                throw new Error('Error initializing devices');
            }
        });

        state.hasInitializedDevices = true;
    }, []);

    // reapply listeners every time the state changes in order to keep
    // listeners with a fresh reference to state
    // https://stackoverflow.com/a/53846698
    useEffect(() => {
        AppEvent.subscribe(EventTypes.RefreshDevice, onRefreshDevice);
        AppEvent.subscribe(EventTypes.GetBatteryStats, onGetBatteryStats);
        AppEvent.subscribe(EventTypes.valueCVisualizationUpdate, onvalueCVisualizationUpdate);
        AppEvent.subscribe(EventTypes.SwitchUIProfile, onSwitchUIProfile);

        return () => {
            AppEvent.unsubscribe(EventTypes.RefreshDevice, onRefreshDevice);
            AppEvent.unsubscribe(EventTypes.GetBatteryStats, onGetBatteryStats);
            AppEvent.unsubscribe(EventTypes.valueCVisualizationUpdate, onvalueCVisualizationUpdate);
            AppEvent.unsubscribe(EventTypes.SwitchUIProfile, onSwitchUIProfile);
        };
    }, [state]);

    useEffect(() => {
        if (location.pathname == '/') {
            setPreviewDevice(undefined);
        }
    }, [location]);

    // subscription handlers
    const onRefreshDevice = useCallback(
        (event) => {
            // if(eventStateRef.current.devicesCurrentlyUpdating.length == 0)
            // {
            //     setDevicesLoading(true);
            // }
            refreshDevices();
        },
        [state.devicesCurrentlyUpdating],
    );
    const onGetBatteryStats = useCallback(
        (event: { detail: BatteryStatusData }) => {
            const data: BatteryStatusData = event.detail;
            if (state.isRefreshingDevices == true || eventStateRef.current.devicesCurrentlyUpdating.length > 0) {
                return;
            }
            const device = state.devices.find((x) => x.SN == data.SN);
            if (device) {
                // todo: hacky workaround, events don't seem to be aware of a correct state
                // maybe find a better way
                state.previewDevice = eventStateRef.current.previewDevice;
                state.devices = eventStateRef.current.devices;

                if (state.previewDevice?.SN === device.SN) {
                    state.previewDevice.batteryvalue = data.Battery;
                    state.previewDevice.batterystatus = data.Charging;
                }

                device.batteryvalue = data.Battery;
                device.batterystatus = data.Charging;

                setState({ ...state });
            }
        },
        [state.devicesCurrentlyUpdating],
    );

    const onvalueCVisualizationUpdate = useCallback((event: { detail: { SN: string; value: number } }) => {
        const data: { SN: string; value: number } = event.detail;
        if (eventStateRef.current.previewDevice?.SN == data.SN && uiContext.valueCState.isVisualisationEnabled) {
            setvalueCVisualizationValue(data.value);
        }
    }, []);

    const refreshDevices = () => {
        console.log('refresh', eventStateRef.current.devicesCurrentlyUpdating, state.devicesCurrentlyUpdating);
        const devicesCurrentlyUpdating = eventStateRef.current.devicesCurrentlyUpdating;
        if (state.isRefreshingDevices == true || devicesCurrentlyUpdating.length > 0) {
            return;
        }

        state.isRefreshingDevices = true;
        DevicesAdapter.getDevices().then(async (devices) => {
            if (devices == null) {
                console.warn('devices is undefined');
                devices = [];
            }

            state.devices = [...devices];

            state.isRefreshingDevices = false;

            const device = devices.find((device) => device.SN == state.previewDevice?.SN);
            setPreviewDevice(device, false);

            // // restore previously selected device if any;
            // if(state.previewDevice != null)
            // {
            //     for(let i = 0; i < devices.length; i++)
            //     {
            //         if(state.previewDevice.SN == devices[i].SN)
            //         {
            //             state.previewDevice = devices[i];
            //             break;
            //         }
            //     }
            // }

            setState(state);

            setDevicesLoading(false);
        });
    };

    const onSwitchUIProfile = useCallback(
        (event: { detail: { SN: string; Profile: number; ModelType: number } }) => {
            const data: { SN: string; Profile?: number; Layer?: number; ModelType: number } = event.detail;

            const devicesCurrentlyUpdating = eventStateRef.current.devicesCurrentlyUpdating;
            if (state.isRefreshingDevices == true || devicesCurrentlyUpdating.length > 0) {
                return;
            }

            const device = eventStateRef.current.devices.find((x) => x.SN == data.SN);
            if (data.Profile != null) {
                if (data.Profile > 0 && !DevicesAdapter.isvalueC(data.SN)) {
                    data.Profile -= 1;
                }
                if (device) {
                    state.previewDevice = eventStateRef.current.previewDevice;
                    state.devices = eventStateRef.current.devices;

                    if (device.SN == state.previewDevice?.SN) {
                        setCurrentProfile(data.Profile, true);
                    } else {
                        setDeviceProfile(device, data.Profile);
                        setState({ ...state });
                    }
                }
            }
            if (data.Layer != null) {
                setCurrentProfileLayer(data.Layer, true, true);
                console.log(`Layer switch event: ${data.Layer}`);
            }
        },
        [state.devicesCurrentlyUpdating],
    );

    const setPreviewDevice = (device: UIDevice | undefined, applyState: boolean = true) => {
        // clear device page settings
        setUIKeybindingType(BindingTypes_ButtonPress[0]);
        setUIKeybindSelectedShortcutType(ShortcutTypes[0]);
        setUIKeybindingSelectedNode(null, -1);

        //[dmercer] todo: if we're going to preserve preview values, we need to clone the current
        // previewDevice object back into the devices array

        // update device
        state.previewDevice = device ? ({ ...device } as UIDevice) : undefined;
        clearUnsavedPreviewDeviceProperties();
        if (state.previewDevice != null) {
            DevicesAdapter.updateImages(state.previewDevice);

            if (state.previewDevice.deviceData != null) {
                const index = isNaN(state.previewDevice.deviceData.profileindex as any)
                    ? parseInt(state.previewDevice.deviceData.profileindex as string)
                    : (state.previewDevice.deviceData.profileindex as number);
                setCurrentProfile(index, false);
            }
        }

        if (applyState) {
            setState({ ...state });
        }

        // remove subpages and breadcrumbs
        setLightSettingMode('none');
    };

    const savePreviewDevice = async () => {
        const result = await DevicesAdapter.saveDeviceData(
            state.previewDevice,
            Array.from(uiContext.unsavedPropertyNames),
        );
        clearUnsavedPreviewDeviceProperties();
        setIsSaving(true);
        setState({ ...state });
        console.log('Save Device status: ', result);
    };

    const resetPreviewDevice = async () => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = DeviceService.getDeviceProfile(state.previewDevice);
        if (DevicesAdapter.isvalueJ(state.previewDevice.SN)) {
            if (profile.lighting != null) {
                profile.lighting.Zone = 0;
            }
            if (profile.lightData != null) {
                profile.lightData = [
                    { Effect: 1, Color: [], WiredBrightnessValue: 100, RateValue: 100 },
                    { Effect: 1, Color: [], WiredBrightnessValue: 100, RateValue: 100 },
                    { Effect: 1, Color: [], WiredBrightnessValue: 100, RateValue: 100 },
                ];
            }
        } else if (state.previewDevice.ModelType == 1) {
            if (profile.lighting != null) {
                if (
                    state.previewDevice!.SN == '0x093A0x822A' || //O2W
                    state.previewDevice!.SN == '0x093A0x821A' || //I2W
                    state.previewDevice!.SN == '0x093A0x824A' || //D2W
                    state.previewDevice!.SN == '0x093A0x826A' //O2W Mini
                ) {
                    profile.lighting.RateValue = 50;
                    profile.lighting.OpacityValue = 60;
                    profile.lighting.SepatateCheckValue = true;
                    profile.lighting.Color = [];
                    profile.lighting.Effect = 0;
                    profile.lighting.WiredBrightnessValue = 100;
                    profile.lighting.WirelessBrightnessValue = 5;
                } else if (
                    state.previewDevice!.SN == '0x320F0x827A' || //O2 Mini
                    state.previewDevice!.SN == '0x320F0x825A' || //D2
                    state.previewDevice!.SN == '0x320F0x823A' //O2
                ) {
                    profile.lighting.RateValue = 50;
                    profile.lighting.OpacityValue = 60;
                    profile.lighting.SepatateCheckValue = false;
                    profile.lighting.Color = [];
                    profile.lighting.Effect = 0;
                    profile.lighting.WiredBrightnessValue = 100;
                    profile.lighting.WirelessBrightnessValue = 5;
                } else {
                    profile.lighting.RateValue = 60;
                    profile.lighting.OpacityValue = 60;
                    profile.lighting.SepatateCheckValue = false;
                    profile.lighting.Color = [];
                    profile.lighting.Effect = 0;
                    profile.lighting.WiredBrightnessValue = 60;
                    profile.lighting.WirelessBrightnessValue = 60;
                }
            }

            if (profile.keybinding != null) {
                // let profileindex = this.currentDevice.deviceData.profile.findIndex((x:any) => x.profileid == this.profileSelect.value)
                for (let i = 0; i < profile.keybinding.length; i++) {
                    let button = profile.keybinding[i];
                    switch (button.value) {
                        case 0:
                            button.group = 3;
                            button.function = 1;
                            button.param = '';
                            break;
                        case 1:
                            button.group = 3;
                            button.function = 3;
                            button.param = '';
                            break;
                        case 2:
                            button.group = 3;
                            button.function = 2;
                            button.param = '';
                            break;
                        case 3:
                            button.group = 3;
                            button.function = 4;
                            button.param = '';
                            break;
                        case 4:
                            button.group = 3;
                            button.function = 5;
                            button.param = '';
                            break;
                        case 5:
                            if (
                                state.previewDevice!.SN == '0x22D40x1503' ||
                                state.previewDevice!.SN == '0x093A0x821A' ||
                                state.previewDevice!.SN == '0x320F0x831A'
                            ) {
                                button.group = 4;
                                button.function = 1;
                                button.param = '';
                            } else {
                                button.group = 4;
                                button.function = 3;
                                button.param = '';
                            }
                            break;
                        case 6:
                            button.group = 3;
                            button.function = 6;
                            button.param = '';
                            break;
                        case 7:
                            button.group = 3;
                            button.function = 7;
                            button.param = '';
                            break;
                        case 8:
                            button.group = 4;
                            button.function = 5;
                            button.param = 400;
                            break;
                        case 9: //Change Model I to Home key
                            button.group = 7;
                            button.function = 'Home';
                            button.param = '';
                            break;
                        case 10:
                            button.group = 4;
                            button.function = 2;
                            button.param = '';
                            break;
                    }
                }
                //Reset Layer Shift
                if (profile.keybindingLayerShift != null) {
                    for (let j = 0; j < profile.keybindingLayerShift.length; j++) {
                        profile.keybindingLayerShift[j].group = 6;
                        profile.keybindingLayerShift[j].function = '';
                        profile.keybindingLayerShift[j].name = '';
                        profile.keybindingLayerShift[j].param = '';
                        profile.keybindingLayerShift[j].param2 = '';
                    }
                }
            }

            if (profile.performance != null) {
                profile.performance.LodValue = 1;
                if (
                    state.previewDevice!.SN == '0x093A0x822A' ||
                    state.previewDevice!.SN == '0x320F0x823A' ||
                    state.previewDevice!.SN == '0x320F0x827A' ||
                    state.previewDevice!.SN == '0x093A0x821A' ||
                    state.previewDevice!.SN == '0x093A0x824A' ||
                    state.previewDevice!.SN == '0x320F0x825A' ||
                    state.previewDevice!.SN == '0x093A0x826A' ||
                    state.previewDevice!.SN == '0x093A0x831A'
                ) {
                    // Model O2 Wireless, Wired and Model I 2 Wireless
                    profile.performance.DebounceValue = 2;
                    profile.performance.MotionSyncFlag = false;
                } else if (DevicesAdapter.isAdvDebounceCapable(state.previewDevice.SN)) {
                    profile.performance.DebounceValue = 0;
                    profile.performance.MotionSyncFlag = false;
                    profile.performance.AdvancedDebounce = new AdvanceDebounceSettings(true);
                } else {
                    profile.performance.DebounceValue = 10;
                    profile.performance.MotionSyncFlag = true;
                }
                profile.performance.pollingrate = 1000;
                profile.performance.pollingrateSelect = false;

                profile.performance.DpiStage = [
                    {
                        value: 400,
                        color: 'FFFF00',
                    },
                    {
                        value: 800,
                        color: '0000FF',
                    },
                    {
                        value: 1600,
                        color: 'FF0000',
                    },
                    {
                        value: 3200,
                        color: '00FF00',
                    },
                ];
            }
        } else if (state.previewDevice.ModelType == 2) {
            const profileIndex = state.previewDevice!.keyboardData?.profileindex;
            if (profileIndex != null) {
                //lighting

                state.previewDevice.keyboardData!.KeyBoardArray![
                    state.previewDevice.keyboardData!.profileindex
                ]!.light_PRESETS_Data = new PresetLightingData();
                // state.previewDevice.keyboardData!.KeyBoardArray![
                //     state.previewDevice.keyboardData!.profileindex
                // ]!.light_PERKEY_Data = new PerKeyLightingSelectionData();
                profile.light_PRESETS_Data = new PresetLightingData();
                // profile.light_PERKEY_Data = new PerKeyLightingSelectionData();

                // this.M_Light_PRESETS.resetDefault(new GloriousMode());
                // this.Built_ineffect.resetAllData();
                // this.Built_ineffect.Built_inSelected = new GloriousMode();
                // this.KeyBoardManager.getTarget().light_PRESETS_Data = JSON.parse(JSON.stringify(this.Built_ineffect.Built_inSelected));

                // this.PerKeyArea = '';
                // this.M_Light_PERKEY.settingPerkeyName = '';
                // this.M_Light_PERKEY.resetDefault(this.default_LightData());
                // this.PERKEY_lightData = this.default_LightData();
                // this.layoutService.updateContentToDB(this.M_Light_PERKEY.AllBlockColor, this.PERKEY_lightData);

                // this.setRGBcolor();//by ResetToDefault

                // keybinding
                const keyboardProfile =
                    state.previewDevice!.keyboardData?.KeyBoardArray == null
                        ? null
                        : state.previewDevice!.keyboardData?.KeyBoardArray[profileIndex];
                if (keyboardProfile != null) {
                    if (keyboardProfile.valueCData != null) {
                        keyboardProfile.valueCData = null;
                    }

                    const assignedKeys = keyboardProfile.assignedKeyboardKeys[0];
                    if (assignedKeys != null) {
                        for (let i = 0; i < assignedKeys.length; i++) {
                            assignedKeys[i] = new KeyboardKeyAssignmentData();
                            if (assignedKeys[i].valueCKeyData != null) {
                                assignedKeys[i].valueCKeyData = null;
                            }
                        }
                    }
                    if (
                        keyboardProfile.light_PERKEY_KeyAssignments &&
                        keyboardProfile.light_PERKEY_KeyAssignments.length > 0
                    ) {
                        const assignedKeyLighting = keyboardProfile.light_PERKEY_KeyAssignments[0];
                        if (assignedKeyLighting != null) {
                            for (let i = 0; i < assignedKeyLighting.length; i++) {
                                assignedKeyLighting[i] = new PerKeyLightingKeyData();
                            }
                        }
                    }
                }
            }

            if (uiContext.valueCState != null) {
                uiContext.valueCState.reset();
            }
        }

        const success = await DevicesAdapter.saveDeviceData(state.previewDevice, ['reset']);
        console.log('Save Device status: ', success);

        setState({ ...state });
    };

    const setCurrentProfile = (profileIndex: number, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        setDeviceProfile(state.previewDevice, profileIndex);

        updateDevicesReference();

        if (applyState == true) {
            setState({ ...state });
        }
    };

    const setDeviceProfile = (device: UIDevice, profileIndex: number) => {
        if (!device) throw new Error('Device is null');

        const deviceCurrentProfile = DeviceService.getDeviceProfile(device);
        if (device.ModelType == 1) {
            // mice deal with deviceData
            if (device.deviceData == null) {
                throw new Error("Current Device's device data is null");
            }

            if (device.deviceData.profileindex != profileIndex) {
                const success = DevicesAdapter.setDeviceProfile(device.SN, device.ModelType, profileIndex);
                console.log('Set Device Profile status: ', success);
                device.deviceData!.profileindex = profileIndex;
                // deviceCurrentProfile.profileid = profileIndex + 1;
                // profile = DeviceService.getDeviceProfile(state.previewDevice);
            }
        } else if (device.ModelType == 2) {
            // keyboards deal with keyboardData
            if (device.keyboardData == null) {
                throw new Error('Current Device is a keyboard ModelType but has no keyboardData.');
            }

            if (device.keyboardData.profileindex != profileIndex) {
                // update layer before sending profile to device
                // keyboards, numpads; legacy type of layers doesn't apply to model I
                const layerIndexes = device.keyboardData.profileLayerIndex;
                if (layerIndexes == null) {
                    throw new Error("Current Device's layer indexes are null.");
                }

                const layerIndex = layerIndexes[device.keyboardData.profileindex];
                if (!DevicesAdapter.isvalueC(device.SN)) {
                    setDeviceProfileLayer(device, layerIndex, false);

                    const success = DevicesAdapter.setDeviceProfile(device.SN, device.ModelType, profileIndex);
                    console.log('Set Device Profile status: ', success);
                    device.keyboardData.profileindex = profileIndex;
                    //deviceCurrentProfile.profileid = profileIndex + 1;
                } else {
                    setDeviceProfileLayer(device, layerIndex, true);
                    device.keyboardData.profileindex = profileIndex;
                }
            }
        }
    };

    const setCurrentProfileLayer = async (
        layerIndex: number,
        applyState: boolean = true,
        applyToDevice: boolean = true,
    ) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        setDeviceProfileLayer(state.previewDevice, layerIndex, applyToDevice);

        updateDevicesReference();

        if (applyState == true) {
            setState({ ...state });
        }
    };

    const setDeviceProfileLayer = (device: UIDevice, layerIndex: number, applyToDevice: boolean) => {
        if (device.keyboardData == null) {
            console.error(
                `Trying to setDeviceProfileLayer for a device ${device.SN} while ` +
                    `device.keyboardData is ${device.keyboardData} `,
            );
            return false;
        }
        if (device.keyboardData.profileLayerIndex == null) {
            console.error(
                `Trying to setDeviceProfileLayer for a device ${device.SN} while ` +
                    `device.keyboardData.profileLayerIndex is ${device.keyboardData.profileLayerIndex} `,
            );
            return false;
        }
        device.keyboardData.profileLayerIndex[device.keyboardData.profileindex] = layerIndex;
        if (applyToDevice) {
            const success = DevicesAdapter.setDeviceLegacyLayer(device);
            console.log('Set Device Legacy Layer status: ', success);
        }
        return true;
    };

    const updateDevicesReference = () => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }
        for (let i = 0; i < state.devices.length; i++) {
            if (state.devices[i].SN == state.previewDevice.SN) {
                state.devices[i] = structuredClone(state.previewDevice);
            }
        }
    };

    // lighting
    const setRgbOffAfterInactivity = (value: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        // profile.lighting.Effect = effectValue;
        setPreviewDevicePropertiesAsUnsaved('rgb-off-after-inactivity');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setRgbOffAfterInactivityTime = (value: number, applyState: boolean = true) => {
        if (isNaN(value)) {
            throw new Error('Value is not a number');
        }
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        // profile.lighting.Effect = effectValue;
        setPreviewDevicePropertiesAsUnsaved('rgb-off-after-inactivity');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setLightingEffect = (effectValue: number, applyState: boolean = true) => {
        if (isNaN(effectValue)) {
            throw new Error('Effect value is not a number');
        }
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        console.log('set light effect: ', effectValue, applyState, profile.lighting.Effect); //NS
        profile.lighting.Effect = effectValue;

        // set default colors, for effects with defaults
        if (effectValue == 0 || effectValue == 1) {
            const colors = RGBGradients_Default[0].data.stops.map((color) => {
                const value = RGBAColor.fromHex(color.hex);
                return { R: value.r, G: value.g, B: value.b, flag: true };
            });
            setMouseLightingColor(colors, false);
        } else if (effectValue == 2) {
            const colors = [
                { R: 255, G: 246, B: 10, flag: true },
                { R: 10, G: 255, B: 125, flag: true },
                { R: 255, G: 96, B: 10, flag: true },
                { R: 10, G: 255, B: 229, flag: true },
                { R: 255, G: 10, B: 212, flag: true },
                { R: 255, G: 0, B: 0, flag: true },
            ];
            setMouseLightingColor(colors, false);
        } else if (effectValue == 3 || effectValue == 4) {
            const colors = [{ R: 255, G: 0, B: 0, flag: true }];
            setMouseLightingColor(colors, false);
        } else if (effectValue == 5) {
            const colors: { R: number; G: number; B: number; flag: boolean }[] = [
                {
                    R: 255,
                    G: 246,
                    B: 10,
                    flag: true,
                },
                { R: 10, G: 255, B: 125, flag: true },
                { R: 255, G: 96, B: 10, flag: true },
                {
                    R: 10,
                    G: 255,
                    B: 229,
                    flag: true,
                },
                { R: 255, G: 10, B: 212, flag: true },
                { R: 255, G: 0, B: 0, flag: true },
            ];
            setMouseLightingColor(colors, false);
        } else if (effectValue == 6) {
            const colors = [
                { R: 255, G: 0, B: 0, flag: true },
                { R: 255, G: 255, B: 0, flag: true },
            ];
            setMouseLightingColor(colors, false);
        } else if (effectValue == 7) {
            const colors: { R: number; G: number; B: number; flag: boolean }[] = [
                {
                    R: 255,
                    G: 246,
                    B: 10,
                    flag: true,
                },
                { R: 10, G: 255, B: 125, flag: true },
                { R: 255, G: 96, B: 10, flag: true },
                {
                    R: 10,
                    G: 255,
                    B: 229,
                    flag: true,
                },
                { R: 255, G: 10, B: 212, flag: true },
                { R: 0, G: 0, B: 0, flag: true },
                {
                    R: 255,
                    G: 0,
                    B: 0,
                    flag: true,
                },
            ];
            setMouseLightingColor(colors, false);
        } else if (effectValue == 8) {
            setMouseLightingColor([], false);
        }
        setPreviewDevicePropertiesAsUnsaved('lighting-effect');

        if (applyState == true) {
            setState({ ...state });
        }

        const effectOption = state.previewDevice?.lightingEffects.find((item) => item.value == effectValue);

        if (effectOption != null) {
            setLightingPresetSelection(effectOption);

            // [dmercer]: debugging this feature
            // const effectForcedStyle =
            //     effectOption.data?.enableColorSelection == true && effectOption.data?.enableGradients == false
            //         ? ColorSettingStyle[0]
            //         : effectOption.data?.enableColorSelection == false && effectOption.data?.enableGradients == true
            //           ? ColorSettingStyle[1]
            //           : null;
            // if (effectForcedStyle != null) {
            //     setLightingColorStyle(effectForcedStyle);
            // }
        }
    };
    const setSeparateWiredWirelessBrightness = (isSeparate: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        profile.lighting.SepatateCheckValue = isSeparate;
        setPreviewDevicePropertiesAsUnsaved('separate-wired-wireless-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setWiredBrightness = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        profile.lighting.WiredBrightnessValue = value;
        setPreviewDevicePropertiesAsUnsaved('wired-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setWirelessBrightness = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        profile.lighting.WirelessBrightnessValue = value;
        setPreviewDevicePropertiesAsUnsaved('wireless-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setRate = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        profile.lighting.RateValue = value;
        setPreviewDevicePropertiesAsUnsaved('lighting-rate');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setMouseLightingColor = (
        colors: {
            R: number;
            G: number;
            B: number;
            flag: boolean;
        }[],
        applyState: boolean = true,
    ) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        // if (profile.lighting.Effect == 0) {
        //     console.log('No changes to colors while in Glorious mode');
        //     return;
        // }
        profile.lighting.Color = [...colors];
        if (profile.templighting != null && profile.templighting[profile.lighting.Effect] != null) {
            profile.templighting[profile.lighting.Effect].Color = [...colors];
        }
        setPreviewDevicePropertiesAsUnsaved('mouse-lighting-color');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setKeyboardPresetLightingColorStyle = (mode: 'rgbGradient' | 'customColor', applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile lighting is null');
        }
        // if(profile.light_PRESETS_Data.value == 0)
        // {
        //     console.log('No changes to colors while in Glorious mode');
        //     return;
        // }

        // [dmercer]: debugging this feature
        // profile.light_PRESETS_Data.color_Enable = mode == 'customColor';
        // profile.light_PRESETS_Data.Multicolor_Enable = mode == 'rgbGradient';
        // profile.light_PRESETS_Data.Multicolor = mode == 'rgbGradient';

        // setPreviewDevicePropertiesAsUnsaved('keyboard-lighting-color');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setKeyboardPresetLightingColor = (colors: string[], applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile lighting is null');
        }
        // if(profile.light_PRESETS_Data.value == 0)
        // {
        //     console.log('No changes to colors while in Glorious mode');
        //     return;
        // }
        console.log(colors);
        profile.light_PRESETS_Data.colors = [...colors];
        if (colors.length > 0) {
            profile.light_PRESETS_Data.colorPickerValue = RGBAColor.fromHex(colors[0]).toArray_rgba();
        }
        setPreviewDevicePropertiesAsUnsaved('keyboard-lighting-color');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setKeyboardPresetLightingEffect = (index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile Lighting Presets data is null');
        }
        profile.light_PRESETS_Data.value = index;
        const effect = LightingEffects_Keyboard.find((x) => x.value == index);
        if (effect) {
            profile.light_PRESETS_Data.translate = effect.translationKey;
        }

        setPreviewDevicePropertiesAsUnsaved('keyboard-preset-effect');

        if (
            profile.light_PRESETS_Data.value == 0 ||
            profile.light_PRESETS_Data.value == 5 ||
            profile.light_PRESETS_Data.value == 16 ||
            profile.light_PRESETS_Data.value == 17
        ) {
            // glorious mode; default colors
            setKeyboardPresetLightingColor(
                ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#007fff', '#0000ff', '#8b00ff'],
                false,
            );
            state.presetEffectHasFixedColors = true;
        } else {
            const selectedColor = profile.light_PRESETS_Data.colors[uiContext.selectedColorIndex];
            setKeyboardPresetLightingColor([selectedColor], false);
            state.presetEffectHasFixedColors = false;
            setSelectedColorIndex(0);
        }

        if (applyState == true) {
            setState({ ...state });
        }

        // [dmercer]: debugging this feature
        const effectOption = state.previewDevice?.lightingEffects[index];
        if (effectOption != null) {
            // setLightingPresetSelection(effectOption);
            // const effectForcedStyle =
            //     effectOption.data?.enableColorSelection == true && effectOption.data?.enableGradients == false
            //         ? ColorSettingStyle[0]
            //         : effectOption.data?.enableColorSelection == false && effectOption.data?.enableGradients == true
            //           ? ColorSettingStyle[1]
            //           : null;
            // if (effectForcedStyle != null) {
            //     setLightingColorStyle(effectForcedStyle);
            // }
        }
    };
    const setPresetLightingSpeed = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile Lighting Presets data is null');
        }
        profile.light_PRESETS_Data.speed = value;
        setPreviewDevicePropertiesAsUnsaved('keyboard-preset-speed');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setPresetLightingWiredBrightness = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile Lighting Presets data is null');
        }
        profile.light_PRESETS_Data.brightness = value;
        setPreviewDevicePropertiesAsUnsaved('keyboard-preset-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setPresetLightingWirelessBrightness = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile Lighting Presets data is null');
        }
        profile.light_PRESETS_Data.wirelessBrightness = value;
        setPreviewDevicePropertiesAsUnsaved('keyboard-preset-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setPresetSeparateWiredWirelessBrightness = (isSeparate: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PRESETS_Data == null) {
            throw new Error('Current Profile Lighting Per Key data is null');
        }
        profile!.light_PRESETS_Data.separateBrightness = isSeparate;
        setPreviewDevicePropertiesAsUnsaved('separate-wired-wireless-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setSelectedPerKeyLayout = (index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PERKEY_Data == null) {
            throw new Error('Current Profile Lighting Per Key data is null');
        }
        profile!.light_PERKEY_Data.value = index;
        setPreviewDevicePropertiesAsUnsaved('keyboard-perkey-layout');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const addQuickKeysToPerKeyLayoutSelection = (quickKeyId: QuickKeyId, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        // const layout = DeviceInputLayoutMap.get(state.previewDevice.SN);
        // if(layout == null) { return; }
        // // console.log(layout);
        // const keyIndexes = layout.layoutNodes.reduce((value, item, index) => { 
        //     if(item.quickKeyIds.indexOf(quickKeyId) > -1)
        //     { 
        //         value.push(index);
        //     }
        //     return value;
        // }, new Array<number>());

        // // console.log(keyIndexes);
        // addToPerKeyLayoutSelection(keyIndexes, applyState);

    };
    const addToPerKeyLayoutSelection = (keyIndexes: number[], applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PERKEY_Data == null) {
            throw new Error('Current Profile Lighting Per Key data is null');
        }

        for (let i = 0; i < keyIndexes.length; i++) {
            const keyIndex = keyIndexes[i];
            // console.log(keyIndex, profile.light_PERKEY_KeyAssignments[0][keyIndex]);
            if (profile.light_PERKEY_KeyAssignments[0][keyIndex] == null) {
                throw new Error(`Layout key data is null at index ${keyIndex}`);
            }
            profile.light_PERKEY_KeyAssignments[0][keyIndex].color =
                uiContext.colorPickerValue_PerKeyLighting.toArray_rgba();
            profile.light_PERKEY_KeyAssignments[0][keyIndex].colorEnabled = true;
            setPreviewDevicePropertiesAsUnsaved('keyboard-perkey-layout');
        }

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const removeFromPerKeyLayoutSelection = (keyIndexes: number[], applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PERKEY_Data == null) {
            throw new Error('Current Profile Lighting Per Key data is null');
        }

        for (let i = 0; i < keyIndexes.length; i++) {
            const keyIndex = keyIndexes[i];
            console.log(keyIndex, profile.light_PERKEY_KeyAssignments[0][keyIndex]);
            if (profile.light_PERKEY_KeyAssignments[0][keyIndex] == null) {
                throw new Error(`Layout key data is null at index ${keyIndex}`);
            }
            profile.light_PERKEY_KeyAssignments[0][keyIndex].color = [0, 0, 0, 0];
            profile.light_PERKEY_KeyAssignments[0][keyIndex].colorEnabled = false;
            setPreviewDevicePropertiesAsUnsaved('keyboard-perkey-layout');
        }

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setPerKeyLightingBrightness = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.light_PERKEY_Data == null) {
            throw new Error('Current Profile Lighting Per Key data is null');
        }

        setPreviewDevicePropertiesAsUnsaved('keyboard-per-key-brightness');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setSelectedPresetGradient = (value: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        const stops = value.data?.stops;
        if (stops == null) {
            throw new Error('Invalid Gradient Option');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.lighting == null) {
                throw new Error('Current Profile lighting is null');
            }

            const colors: DeviceRecordColorData[] = [];
            for (let i = 0; i < stops.length; i++) {
                const color = RGBAColor.fromHex(stops[i].hex);
                const colorData = new DeviceRecordColorData(color.r, color.g, color.b, false);
                colors.push(colorData);
            }
            profile.lighting.Color = [...colors];
            setPreviewDevicePropertiesAsUnsaved('mouse-lighting-color');
        } else if (state.previewDevice.ModelType == 2) {
            if (profile.light_PRESETS_Data == null) {
                throw new Error('Current Profile lighting is null');
            }
            profile.light_PRESETS_Data.colors = [...stops];
            setPreviewDevicePropertiesAsUnsaved('keyboard-lighting-color');
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setLightingPresetGradient(value);
    };

    const setvalueJZoneSelected = (zone: number, applyState: boolean = true) => {
        if (isNaN(zone)) {
            throw new Error('Zone value is not a number');
        }
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        profile.lighting.Zone = zone;
        //setPreviewDevicePropertiesAsUnsaved('valueJ-zone');
        if (applyState == true) {
            setState({ ...state });
        }
    };

    const setvalueJLightingEffect = (effectValue: number, applyState: boolean = true) => {
        if (isNaN(effectValue)) {
            throw new Error('Effect value is not a number');
        }
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        if (isNaN(profile.lighting.Zone)) {
            profile.lighting.Zone = 0;
        }
        profile.lightData![profile.lighting.Zone].Effect = effectValue;

        // set default colors, for effects with defaults
        if (effectValue == 5) {
            const colors: { R: number; G: number; B: number; flag: boolean }[] = [
                {
                    R: 255,
                    G: 246,
                    B: 10,
                    flag: true,
                },
                { R: 10, G: 255, B: 125, flag: true },
                { R: 255, G: 96, B: 10, flag: true },
                {
                    R: 10,
                    G: 255,
                    B: 229,
                    flag: true,
                },
                { R: 255, G: 10, B: 212, flag: true },
                { R: 255, G: 0, B: 0, flag: true },
            ];
            //   setvalueJLightingColor(colors, false);
        } else if (effectValue == 6) {
            // const colors: { R: number, G: number, B: number, flag: boolean }[] = [{"R":255,"G":246,"B":10,"flag":true},{"R":10,"G":255,"B":125,"flag":true},{"R":255,"G":96,"B":10,"flag":true},{"R":10,"G":255,"B":229,"flag":true},{"R":255,"G":10,"B":212,"flag":true},{"R":255,"G":0,"B":0,"flag":true}];
            // setvalueJLightingColor(colors, false);
        } else if (effectValue == 8) {
            // setvalueJLightingColor([], false);
        }
        setPreviewDevicePropertiesAsUnsaved('lighting-effect');

        if (applyState == true) {
            setState({ ...state });
        }

        const effectOption = state.previewDevice?.lightingEffects.find((item) => item.value == effectValue);

        if (effectOption != null) {
            setLightingPresetSelection(effectOption);

            // const effectForcedStyle = (effectOption.data?.enableColorSelection == true && effectOption.data?.enableGradients == false) ? ColorSettingStyle[0]
            // : (effectOption.data?.enableColorSelection == false && effectOption.data?.enableGradients == true) ? ColorSettingStyle[1]
            // : null;
            // if(effectForcedStyle != null)
            // {
            //     setLightingColorStyle(effectForcedStyle);
            // }
        }
    };
    const setvalueJRate = (val: any) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        if (isNaN(profile.lighting.Zone)) {
            profile.lighting.Zone = 0;
        }
        if (profile.lightData == null) {
            throw new Error('Current Profile lightData is null');
        }
        profile.lightData[profile.lighting.Zone].RateValue = val;
        setPreviewDevicePropertiesAsUnsaved('lighting-rate');
        setState({ ...state });
    };
    const setvalueJWiredBrightness = (val: any) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        if (isNaN(profile.lighting.Zone)) {
            profile.lighting.Zone = 0;
        }
        if (profile.lightData == null) {
            throw new Error('Current Profile lightData is null');
        }
        profile.lightData[profile.lighting.Zone].WiredBrightnessValue = val;
        setPreviewDevicePropertiesAsUnsaved('wired-brightness');
        setState({ ...state });
    };
    const setvalueJLightingColor = (color: string | string[], applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.lighting == null) {
            throw new Error('Current Profile lighting is null');
        }
        if (isNaN(profile.lighting.Zone)) {
            profile.lighting.Zone = 0;
        }
        if (profile.lightData == null) {
            throw new Error('Current Profile lightData is null');
        }
        if (Array.isArray(color)) {
            var arrColors: DeviceRecordColorData[] = [];
            for (var i = 0; i < color.length; i++) {
                let colorValue = color[i].startsWith('#') ? color[i].substring(1) : color;
                var result = hexToRgbOrNull(colorValue);
                if (result && result.color.R != undefined) {
                    arrColors.push(new DeviceRecordColorData(result.color.R, result.color.G, result.color.B, false));
                }
                profile.lightData[profile.lighting.Zone].Color = arrColors;
            }
        } else {
            let colorValue = color.startsWith('#') ? color.substring(1) : color;
            var result = hexToRgbOrNull(colorValue);
            if (result && result.color.R != undefined) {
                profile.lightData[profile.lighting.Zone].Color = [
                    new DeviceRecordColorData(result.color.R, result.color.G, result.color.B, false),
                ];
            }
        }
        setPreviewDevicePropertiesAsUnsaved('mouse-lighting-color');

        if (applyState == true) {
            setState({ ...state });
        }
    };

    // directly save inactivity values onto device based on globa settings changes
    const saveDeviceRgbOffAfterInactivity = (device: UIDevice, value: boolean, applyState: boolean = true) => {
        const profile = DeviceService.getDeviceProfile(device);
        if (profile?.lighting == null) {
            throw new Error('Device Profile lighting is null');
        }
    };
    const saveDeviceRgbOffAfterInactivityTime = (device: UIDevice, value: number, applyState: boolean = true) => {
        if (isNaN(value)) {
            throw new Error('Value is not a number');
        }

        const profile = DeviceService.getDeviceProfile(device);
        if (profile?.lighting == null) {
            throw new Error('Device Profile lighting is null');
        }
    };

    // settings
    const setPollingRate = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            if (state.previewDevice!.ModelType == 2) {
                // keyboards, numpads
                profile.pollingrate = value;
            } else {
                throw new Error('Current Profile performance is null');
            }
        } else {
            if (DevicesAdapter.isAdvDebounceCapable(state.previewDevice?.SN)) {
                if (profile.performance.pollingratearray != undefined) {
                    profile.performance.pollingratearray[0] = value;
                } else {
                    profile.performance.pollingratearray = [value, 1000];
                }
            } else {
                profile.performance.pollingrate = value;
            }
        }

        setPreviewDevicePropertiesAsUnsaved('polling-rate');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setWirelessPollingRate = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            if (state.previewDevice!.ModelType == 2) {
                // keyboards, numpads
                profile.pollingrate = value;
            } else {
                throw new Error('Current Profile performance is null');
            }
        } else {
            if (DevicesAdapter.isAdvDebounceCapable(state.previewDevice?.SN)) {
                if (profile.performance.pollingratearray != undefined) {
                    profile.performance.pollingratearray[1] = value;
                } else {
                    profile.performance.pollingratearray = [1000, value];
                }
            } else {
                profile.performance.pollingrate = value;
            }
        }

        setPreviewDevicePropertiesAsUnsaved('polling-rate');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setAdvDebounceActive = (value: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }

        profile.performance.AdvancedDebounce.AdvancedSwitch = value;
        setPreviewDevicePropertiesAsUnsaved('adv-debounce');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setAfterPressTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }
        profile.performance.AdvancedDebounce.AfterPressValue = value;
        setPreviewDevicePropertiesAsUnsaved('after-press-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setBeforePressTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }
        profile.performance.AdvancedDebounce.BeforePressValue = value;
        setPreviewDevicePropertiesAsUnsaved('before-press-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setAfterReleaseTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }
        profile.performance.AdvancedDebounce.AfterReleaseValue = value;
        setPreviewDevicePropertiesAsUnsaved('after-release-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setBeforeReleaseTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }
        profile.performance.AdvancedDebounce.BeforeReleaseValue = value;
        setPreviewDevicePropertiesAsUnsaved('before-release-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setLiftOffPressTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.AdvancedDebounce == null) {
            profile.performance.AdvancedDebounce = new AdvanceDebounceSettings();
        }
        profile.performance.AdvancedDebounce.LiftOffPressValue = value;
        setPreviewDevicePropertiesAsUnsaved('lift-off-press-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setSeparatePollingActive = (value: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        } else {
            profile.performance.pollingrateSelect = value;
        }

        setPreviewDevicePropertiesAsUnsaved('separate-polling-rate');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setLiftOffDistance = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }

        profile.performance.LodValue = value;
        setPreviewDevicePropertiesAsUnsaved('lift-off-distance');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setDebounceTime = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }

        profile.performance.DebounceValue = value;
        setPreviewDevicePropertiesAsUnsaved('debounce-time');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setIsMotionSyncActive = (value: boolean, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance is null');
        }
        if (profile.performance.MotionSyncFlag == null) {
            throw new Error('Current Device does not support Motion Sync');
        }

        profile.performance.MotionSyncFlag = value;
        setPreviewDevicePropertiesAsUnsaved('motion-sync');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setInputLatency = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.inputLatency == null) {
            throw new Error('Current Device does not support Input Latency');
        }

        profile.inputLatency = value;
        setPreviewDevicePropertiesAsUnsaved('input-latency');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setRotarySensitivity = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.sensitivity == null) {
            throw new Error('Current Device does not support Rotary Sensitivity');
        }

        profile.sensitivity = value;
        setPreviewDevicePropertiesAsUnsaved('rotary-sensitivity');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setStandbyType = (index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.standbyvalue == null) {
            throw new Error('Current Device does not support Standby type');
        }

        const option = StandbyTypes[index];

        // profile.standbyvalue = value;
        setPreviewDevicePropertiesAsUnsaved('standby-type');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setStandbyValue = (value: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.standbyvalue == null) {
            throw new Error('Current Device does not support Standby value');
        }

        profile.standbyvalue = value;
        setPreviewDevicePropertiesAsUnsaved('standby-value');

        if (applyState == true) {
            setState({ ...state });
        }
    };

    // dpi
    const addDPIStage = (stage: DPIStageData, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance data is null');
        }
        profile.performance.DpiStage.push(stage);
        profile.performance.DpiStage = structuredClone(profile.performance.DpiStage);
        setPreviewDevicePropertiesAsUnsaved('dpi-stages');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const removeDPIStage = (index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance data is null');
        }

        profile.performance.DpiStage.splice(index, 1);

        if (index < profile.performance.dpiSelectIndex) {
            profile.performance.dpiSelectIndex = profile.performance.dpiSelectIndex - 1;
        }

        if (
            profile.performance.dpiSelectIndex < 0 ||
            profile.performance.dpiSelectIndex >= profile.performance.DpiStage.length
        ) {
            profile.performance.dpiSelectIndex = 0;
        }

        profile.performance.DpiStage = structuredClone(profile.performance.DpiStage);

        setPreviewDevicePropertiesAsUnsaved('dpi-stages');

        if (applyState == true) {
            setState({ ...state });
        }
    };
    const setDefaultDPIStage = (index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.performance == null) {
            throw new Error('Current Profile performance data is null');
        }

        profile.performance.dpiSelectIndex = index;
        setPreviewDevicePropertiesAsUnsaved('dpi-default-stage');

        if (applyState == true) {
            setState({ ...state });
        }
    };

    // keybinding
    const setKeybindingLayer = (option: DisplayOption, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.keybinding == null) {
            throw new Error('Current Profile keybinding data is null');
        }

        // const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
        // if(keybindData == null)
        // {
        //     throw new Error(`Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`);
        // }

        // prepare for assignment
        // setPreviewDevicePropertiesAsUnsaved('keybind-layer');
        //
        if (applyState == true) {
            setState({ ...state });
        }

        // update UI
        setUIKeybindingLayer(option);
    };

    const getSelectedKeyAssignment = () => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (profile.assignedKeyboardKeys == null) {
            throw new Error('Current Profile keybinding keys data is null');
        }
        if (profile.fnModeindex == null) {
            throw new Error('Current Profile keybinding keys index is null');
        }

        if (uiContext.keybindSelectedNode == null) {
            throw new Error('Current selected key is null');
        }

        const currentKeyArray = profile.assignedKeyboardKeys[profile.fnModeindex];

        // let selectionCodeValue = EventKey_BindingCodeMap.find(
        //     (item) => item.eventKeyCode == uiContext.keybindSelectedNode!.translationKey,
        // )
        // ?? { bindCodeName: uiContext.keybindSelectedNode.translationKey };

        // let selectionComparisonValue = selectionCodeValue.bindCodeName;
        // if (selectionComparisonValue.startsWith('Key')) {
        //     selectionComparisonValue = selectionComparisonValue.substring(3);
        // }
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

        return selectedKey;
    };

    const setKeybindingType = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.group = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.recordBindCodeType = option.data.bindingCode;
            selectedKey.recordBindCodeName = option.translationKey;
        }
        // keyboard keybind type is set on the selected key
        // since we don't know the key selection yet, we just
        // need to store a reference to it, which we do in the
        // ui context;
        // nothing else needs to be done here.

        if (applyState == true) {
            setState({ ...state });
        }

        console.log('keybinding type');

        setUIKeybindingType(option);
        // if (state.previewDevice.ModelType == 2)
        // {
        //     setUIKeybindingKeyCode(option.data.bindingCode);
        // }
    };
    const setKeybindingKeyCode = (value: string, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }
            keybindData.function = value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            let assignmentCodeValue = EventKey_BindingCodeMap.find((item) => item.eventKeyCode == value) ?? {
                bindCodeName: value,
            };

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.recordBindCodeType = uiContext.keybindSelectedBindingType.data.bindingCode;
            selectedKey.recordBindCodeName = assignmentCodeValue.bindCodeName;

            // if(state.previewDevice.keyboardData == null)
            // {
            //     throw new Error('Current Profile keyboard data is null');
            // }

            // // get profile from keyboardData content
            // const keyboardDataProfileIndex = state.previewDevice.keyboardData.profileindex;
            // const keyboardDataProfileLayerIndex = state.previewDevice.keyboardData.profileLayerIndex[keyboardDataProfileIndex];
            // const keyboardDataProfile = state.previewDevice.keyboardData.profileLayers[state.previewDevice.keyboardData.profileindex][keyboardDataProfileLayerIndex];

            // const assignmentKeyArray = keyboardDataProfile.assignedKeyboardKeys[profile.fnModeindex];
            // const assignmentKey = assignmentKeyArray.find(item => item.defaultValue == selectionComparisonValue);
            // if(assignmentKey == null)
            // {
            //     throw new Error('Current Profile keybinding key assignment reference is null');
            // }

            // assignmentKey.recordBindCodeType = KeybindingTypeCodeMap[uiContext.keybindSelectedBindingType.value];
            // assignmentKey.recordBindCodeName = assignmentCodeValue.bindCodeName;
        }

        // prepare for assignment
        setPreviewDevicePropertiesAsUnsaved('keybind-single-key');

        if (applyState == true) {
            setState({ ...state });
        }

        setUIKeybindingKeyCode(value);
    };
    const setKeybindingKeyModifier = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }
            keybindData.param =
                uiContext.keybindSelectedKeyModifier == ModifierKeys[0].value
                    ? ''
                    : [
                          option.value == ModifierKeys[1].value,
                          option.value == ModifierKeys[2].value,
                          option.value == ModifierKeys[3].value,
                          option.value == ModifierKeys[4].value,
                      ];
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.Shift = false;
            selectedKey.Ctrl = false;
            selectedKey.Alt = false;
            selectedKey.Windows = false;

            selectedKey.Shift = option.value == ModifierKeys[1].value;
            selectedKey.Ctrl = option.value == ModifierKeys[2].value;
            selectedKey.Alt = option.value == ModifierKeys[3].value;
            selectedKey.Windows = option.value == ModifierKeys[4].value;

            selectedKey.combinationkeyEnable =
                selectedKey.Shift == true ||
                selectedKey.Ctrl == true ||
                selectedKey.Alt == true ||
                selectedKey.Windows == true;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-single-key-modifier');

        setUIKeybindingKeyModifier(option);
    };
    const setKeybindingKeyboardFunction = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.recordBindCodeType = uiContext.keybindSelectedBindingType.data.bindingCode;
            selectedKey.recordBindCodeName = option.data.bindingValue;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-keyboard-function');

        setUIKeybindingKeyboardFunction(option);
    };
    const setKeybindSelectedMouseFunction = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.recordBindCodeType = uiContext.keybindSelectedBindingType.data.bindingCode;
            selectedKey.recordBindCodeName = option.data.bindingValue;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-mouse-function');

        setUIKeybindSelectedMouseFunction(option);
    };
    const setKeybindSelectedDPIOption = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            console.error('Attempting to set DPI option on Keyboard device.');
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-dpi-function');

        setUIKeybindSelectedDPIOption(option);
    };
    const setKeybindSelectedMultimediaFunction = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.recordBindCodeType = uiContext.keybindSelectedBindingType.data.bindingCode;
            selectedKey.recordBindCodeName = option.data.bindingValue;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-multimedia-function');

        setUIKeybindSelectedMultimediaFunction(option);
    };
    const setKeybindSelectedShortcutType = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = option.value;
            keybindData.param =
                keybindData.function == 1
                    ? uiContext.keybindSelectedShortcutProgramPath ?? ''
                    : keybindData.function == 2
                      ? uiContext.keybindSelectedShortcutUrl ?? ''
                      : keybindData.function == 3
                        ? uiContext.keybindSelectedShortcutWindowsOption?.value ?? ''
                        : '';
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }

            // shortcut sets the binding value as the type, as well
            selectedKey.recordBindCodeType = option.data.bindingValue;
            selectedKey.recordBindCodeName = option.data.bindingValue;

            if (option.value == 1) {
                // LaunchProgram
                selectedKey.ApplicationPath = '';
            } else if (option.value == 2) {
                // LaunchWebsite
                selectedKey.WebsitePath = '';
            } else if (option.value == 3) {
                selectedKey.shortcutsWindowsEnable = true;
            }
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-shortcut-type');

        setUIKeybindSelectedShortcutType(option);
    };
    // const setKeybindSelectedShortcutOption = (option: DisplayOption, applyState: boolean = true) =>
    // {
    //     if(profile == null)
    //     {
    //         throw new Error('Current Profile is null');
    //     }
    //     if(profile.keybinding == null)
    //     {
    //         throw new Error('Current Profile keybinding data is null');
    //     }
    //     const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
    //     if(keybindData == null)
    //     {
    //         throw new Error(`Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`);
    //     }

    //
    // if(applyState == true)
    // {
    //     setState({...state});
    // }

    //     setUIKeybindSelectedShortcutOption(option);
    // }
    const setKeybindSelectedShortcutProgramPath = (value: string, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.param = value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.ApplicationPath = value;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-shortcut-value');

        setUIKeybindSelectedShortcutProgramPath(value);
    };
    const setKeybindSelectedShortcutUrl = (value: string, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.param = value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
            selectedKey.WebsitePath = value;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-shortcut-value');

        setUIKeybindSelectedShortcutUrl(value);
    };
    const setKeybindSelectedShortcutWindowsOption = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.param = option.value;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }

            selectedKey.shortcutsWindowsEnable = true;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-shortcut-value');

        setUIKeybindSelectedWindowsOption(option);
    };
    const setKeybindDisabledIsSelected = (value: boolean, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = '';
            keybindData.param = '';
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }

            const KeyboardDisabledFunctionCode = 'Disable_Fun35';

            selectedKey.recordBindCodeType = uiContext.keybindSelectedBindingType.data.bindingCode;
            selectedKey.recordBindCodeName = KeyboardDisabledFunctionCode;
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-disabled');

        setUIKeybindDisabledIsSelected(value);
    };
    const setKeybindSoundControlSelection = (value: any, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
        }

        if (applyState == true) {
            setState({ ...state });
        }

        setUIKeybindSoundControlSelection(value);
    };
    const setKeybindAudioToggleTarget = (value: any, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
        }

        if (applyState == true) {
            setState({ ...state });
        }

        setUIKeybindAudioToggleTarget(value);
    };
    const setKeybindMacroSelection = (macro: MacroRecord | undefined, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }

            keybindData.function = macro?.value ?? '';
            keybindData.param = macro?.m_Identifier ?? '';
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }

            selectedKey.macro_Data = macro;
            switch (macro?.m_Identifier) {
                case '3':
                    selectedKey.macro_RepeatType = 1;
                    break;
                case '2':
                    selectedKey.macro_RepeatType = 2;
                    break;
                case '1':
                default:
                    selectedKey.macro_RepeatType = 0;
                    break;
            }
            const displayOption_Macro = BindingTypes_KeyPress.find(
                (option) => option.optionKey == 'macro',
            ) as DisplayOption;
            setKeybindingType(displayOption_Macro, false);
        }

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-macro');

        setUIKeybindMacroSelection(macro);
    };

    const setKeybindingSelectedNode = (node: LayoutNode, index: number, applyState: boolean = true) => {
        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }
        if (profile.keybinding == null) {
            throw new Error('Current Profile keybinding data is null');
        }
        const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
        if (keybindData == null) {
            throw new Error(
                `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
            );
        }
        // state.keybindSelectedNode = node;
        // state.keybindSelectedNodeIndex = index;

        if (applyState == true) {
            setState({ ...state });
        }

        setUIKeybindingSelectedNode(node, index);
    };

    const setRotaryEncoderAction = (option: DisplayOption, applyState: boolean = true) => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Current Profile is null');
        }

        if (state.previewDevice.ModelType == 1) {
            if (profile.keybinding == null) {
                throw new Error('Current Profile keybinding data is null');
            }
            const keybindData = profile.keybinding[uiContext.keybindSelectedNodeIndex];
            if (keybindData == null) {
                throw new Error(
                    `Unknown keybinding target for selected node index "${uiContext.keybindSelectedNodeIndex}"`,
                );
            }
            // state.keybindSelectedRotaryEncoderAction = option;
        } else if (state.previewDevice.ModelType == 2) {
            if (uiContext.keybindSelectedBindingType == null) {
                throw new Error('Current Profile keybinding type is null');
            }

            const selectedKey = getSelectedKeyAssignment();
            if (selectedKey == null) {
                throw new Error('Current keybinding selection key is null');
            }
        }

        if (applyState == true) {
            setState({ ...state });
        }

        setUIRotaryEncoderAction(option);
    };

    const keyNameFromTranslationKey = (translationKey: string | null | undefined) => {
        // let assignmentCodeValue = EventKey_BindingCodeMap.find(item => translationKey == value) ?? { bindCodeName: value }

        return translationKey ? translationKey.replace('Key', '').replace('Digit', '') : '';
    };
    const setvalueCState = (data: valueCUIState, applyState: boolean = true) => {
        // TODO: optimize - separate by function

        const profileIndex = state.previewDevice!.keyboardData!.profileindex;
        const profileLayerIndex = state.previewDevice!.keyboardData!.profileLayerIndex[profileIndex];
        const selectedProfile = state.previewDevice!.keyboardData!.profileLayers[profileIndex][profileLayerIndex];

        selectedProfile.valueCData = data.toKeyboardvalueCData();
        selectedProfile.assignedKeyboardKeys.forEach((deeper: KeyboardKeyAssignmentData[]) =>
            deeper.forEach((keyData: KeyboardKeyAssignmentData) => {
                const keyValue = keyData.defaultValue;
                // TODO: better key matching
                // TODO: do key name cleanup earlier
                const match = data.actuationSelectedNodes.layers.find((value) => {
                    const matchKey = keyNameFromTranslationKey(value.nodes[0].nodeDefinition.translationKey);
                    return matchKey == keyValue;
                });
                if (match) {
                    // TODO: should use valueCUIKeyState
                    keyData.valueCKeyData = new KeyboardvalueCKeyData();
                    if (match.actuationPress !== undefined) {
                        keyData.valueCKeyData.actuationData = new ActuationData(match.actuationPress);
                    }
                    if (match.rapidTriggerPress !== undefined) {
                        keyData.valueCKeyData.rapidTriggerData = new RapidTriggerData(match.rapidTriggerPress);
                    }
                } else {
                    keyData.valueCKeyData = null;
                }
            }),
        );

        if (applyState == true) {
            setState({ ...state });
        }
        setPreviewDevicePropertiesAsUnsaved('keybind-valueC-state');
        // setDisplayState(cloneState(stateReference.current));
        setUIvalueCState(data);
    };

    const setvalueCAdvancedKeys = (data: valueCUIState, applyState: boolean = true) => {
        const profileIndex = state.previewDevice!.keyboardData!.profileindex;
        const profileLayerIndex = state.previewDevice!.keyboardData!.profileLayerIndex[profileIndex];
        const selectedProfile = state.previewDevice!.keyboardData!.profileLayers[profileIndex][profileLayerIndex];

        selectedProfile.valueCData = data.toKeyboardvalueCData();
        if (data.advancedKeysAssignedTmp != null && data.advancedKeysSelectedKeyTmp != null) {
            selectedProfile.assignedKeyboardKeys.forEach((deeper: KeyboardKeyAssignmentData[]) => {
                const match = deeper.find((keyData: KeyboardKeyAssignmentData) => {
                    const key = keyNameFromTranslationKey(data.advancedKeysSelectedKeyTmp!.translationKey);
                    return keyData.defaultValue == key;
                });

                if (match != null) {
                    match.valueCKeyData = new KeyboardvalueCKeyData();
                    if (data.advancedKeysAssignedTmp.toggle != null) {
                        const mappedKey = keyNameFromTranslationKey(data.advancedKeysAssignedTmp.toggle.translationKey);
                        match.valueCKeyData.ToggleData = new ToggleData(ToggleType.ReTrigger, mappedKey);
                    }
                    if (
                        data.advancedKeysAssignedTmp.modTapPress != null ||
                        data.advancedKeysAssignedTmp.modTapHold != null
                    ) {
                        const mappedKeyHold = keyNameFromTranslationKey(
                            data.advancedKeysAssignedTmp.modTapHold?.translationKey,
                        );
                        const mappedKeyPress = keyNameFromTranslationKey(
                            data.advancedKeysAssignedTmp.modTapPress?.translationKey,
                        );
                        match.valueCKeyData.ModTapData = new ModTapData(mappedKeyHold, 200, mappedKeyPress);
                    }
                    if (data.advancedKeysAssignedTmp.dynamicKeystrokes != null) {
                        if (match.valueCKeyData.DynamicKeystrokeData == null) {
                            match.valueCKeyData.DynamicKeystrokeData = [];
                        }
                        for (const triggerPointAsKey in data.advancedKeysAssignedTmp.dynamicKeystrokes.keys) {
                            if (isNaN(Number(triggerPointAsKey))) continue;
                            const triggerPoint = Number(triggerPointAsKey);
                            const key = data.advancedKeysAssignedTmp.dynamicKeystrokes.keys[triggerPoint];
                            const mappedKey = keyNameFromTranslationKey(key.node.translationKey);
                            match.valueCKeyData.DynamicKeystrokeData.push(
                                new DynamicKeystrokeData(
                                    triggerPoint,
                                    data.advancedKeysAssignedTmp.dynamicKeystrokes.firstTriggerPointValue,
                                    mappedKey,
                                    '',
                                    key.isContinuous,
                                ),
                            );
                        }
                    }
                }
            });

            if (applyState == true) {
                setState({ ...state });
            }

            setPreviewDevicePropertiesAsUnsaved('keybind-valueC-state');
            // setDisplayState(cloneState(stateReference.current));
            setUIvalueCState(data);
        }
    };

    const setvalueCVisualizationState = async (enabled: boolean) => {
        const SN = state.previewDevice?.SN;
        if (DevicesAdapter.isvalueC(SN)) {
            const response = await ProtocolService.RunSetFunction({
                SN: SN!,
                Type: FuncType.Keyboard,
                Func: FuncName.valueCVisualizationToggle,
                Param: { SN: SN!, value: enabled },
            });
            if (response?.success) {
                setUIvalueCVisualizationEnabled(enabled);
            }
        }
    };

    const setProductColor = async (SN: string, index: number, applyState: boolean = true) => {
        const deviceIndex = state.devices.findIndex((item) => item.SN == SN);
        if (deviceIndex == -1) {
            throw new Error(`Could not find device from SN: ${SN}`);
        }

        state.devices[deviceIndex].productColorIndex = index;
        await DevicesAdapter.updateImages(state.devices[deviceIndex]);

        if (state.devices[deviceIndex].SN == state.previewDevice?.SN) {
            // [dmercer] this shouldn't be currently possible? future feature?
            state.previewDevice.productColorIndex = index;
            await DevicesAdapter.updateImages(state.previewDevice);
        }

        // force react to understand that the devices array has changed
        state.devices = [...state.devices];

        if (applyState == true) {
            setState({ ...state });
        }
    };

    // getters
    const getCurrentProfile = () => {
        return state.previewDevice == null ? undefined : DeviceService.getDeviceProfile(state.previewDevice);
    };
    const getCurrentProfileIndex = () => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }
        if (state.previewDevice.ModelType == 1) {
            if (state.previewDevice.deviceData == null) {
                throw new Error('Error getting device data');
            }
            return state.previewDevice.deviceData.profileindex;
        }
        if (state.previewDevice.ModelType == 2) {
            if (state.previewDevice.keyboardData == null) {
                throw new Error('Error getting device data');
            }
            return state.previewDevice.keyboardData.profileindex;
        }

        throw new Error('Unknown Device Type');
    };
    const getCurrentLegacyLayerIndex = () => {
        if (state.previewDevice == null) {
            throw new Error('Current Device is null');
        }
        if (state.previewDevice.ModelType != 2) {
            throw new Error('Error collecting layer index for legacy device.');
        }
        if (state.previewDevice.keyboardData == null) {
            throw new Error('Error getting device data');
        }
        return state.previewDevice.keyboardData.profileLayerIndex[state.previewDevice.keyboardData.profileindex];
    };

    const setDeviceUpdateListeningState = (value: boolean) => {
        if (value == true) {
            AppEvent.subscribe(EventTypes.RefreshDevice, refreshDevices);
        } else {
            AppEvent.unsubscribe(EventTypes.RefreshDevice, refreshDevices);
        }
    };
    const setDevicesCurrentlyUpdating = (SNs: string[]) => {
        state.devicesCurrentlyUpdating = [...SNs];
        setState({ ...state });
    };

    const updateFunctions = {
        // getters
        getCurrentProfile,
        getCurrentProfileIndex,
        getCurrentLegacyLayerIndex,

        // device
        refreshDevices,
        setPreviewDevice,
        savePreviewDevice,
        resetPreviewDevice,
        setCurrentProfile,
        setCurrentProfileLayer, // settings
        setPollingRate,
        setWirelessPollingRate,
        setLiftOffDistance,
        setSeparatePollingActive,
        setAdvDebounceActive,
        setLiftOffPressTime,
        setAfterPressTime,
        setBeforePressTime,
        setAfterReleaseTime,
        setBeforeReleaseTime,
        setDebounceTime,
        setIsMotionSyncActive,
        setInputLatency,
        setRotarySensitivity,
        setStandbyType,
        setStandbyValue, // dpi
        addDPIStage,
        removeDPIStage,
        setDefaultDPIStage, // lighting
        setRgbOffAfterInactivity,
        setRgbOffAfterInactivityTime,
        setLightingEffect,
        setSeparateWiredWirelessBrightness,
        setWiredBrightness,
        setWirelessBrightness,
        setRate,
        setMouseLightingColor,
        setKeyboardPresetLightingColorStyle,
        setKeyboardPresetLightingColor,
        setKeyboardPresetLightingEffect,
        setPresetLightingSpeed,
        setPresetLightingWiredBrightness,
        setPresetLightingWirelessBrightness,
        setPresetSeparateWiredWirelessBrightness,
        setSelectedPerKeyLayout,
        addQuickKeysToPerKeyLayoutSelection,
        addToPerKeyLayoutSelection,
        removeFromPerKeyLayoutSelection,
        setSelectedPresetGradient, // keybinding
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
        setKeybindingSelectedNode,
        setRotaryEncoderAction,

        getDeviceProfile: DeviceService.getDeviceProfile,
        saveDeviceRgbOffAfterInactivity,
        saveDeviceRgbOffAfterInactivityTime,

        setvalueCState,
        setvalueCAdvancedKeys,
        setvalueCVisualizationState,

        setProductColor,

        setvalueJZoneSelected,
        setvalueJLightingEffect,
        setvalueJLightingColor,
        setvalueJRate,
        setvalueJWiredBrightness,

        setDeviceUpdateListeningState,
        setDevicesCurrentlyUpdating,
    };

    const hexToRgbOrNull = (InputData) => {
        try {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(InputData);
            return result
                ? {
                      color: {
                          R: parseInt(result[1], 16),
                          G: parseInt(result[2], 16),
                          B: parseInt(result[3], 16),
                      },
                  }
                : null;
        } catch {
            return null;
        }
    };

    return (
        <DevicesDisplayContext.Provider value={state}>
            <DevicesManagementContext.Provider value={updateFunctions}>{children}</DevicesManagementContext.Provider>
        </DevicesDisplayContext.Provider>
    );
}
