import { LayoutNode } from './device-input-layout.data';

const DEFAULT_ACTUATION_PRESS_VALUE = 50;
const DEFAULT_ACTUATION_RELEASE_VALUE = 50;
const DEFAULT_RAPID_TRIGGER_PRESS_VALUE = 0;
const DEFAULT_RAPID_TRIGGER_RELEASE_VALUE = 35;

export class valueCUIKeyState {
    actuationData: ActuationData | null = null;
    rapidTriggerData: RapidTriggerData | null = null;
    dynamicKeystrokeData: DynamicKeystrokeData[] | null = null;
    modTapData: ModTapData | null = null;
    toggleData: ToggleData | null = null;

    toKeyboardvalueCKeyData(): KeyboardvalueCKeyData {
        const keyData = new KeyboardvalueCKeyData();
        keyData.actuationData = this.actuationData;
        keyData.rapidTriggerData = this.rapidTriggerData;
        keyData.DynamicKeystrokeData = this.dynamicKeystrokeData;
        keyData.ModTapData = this.modTapData;
        keyData.ToggleData = this.toggleData;
        return keyData;
    }
}

export enum AdvancedKeyMode {
    None = 0,
    DynamicKeystroke = 1,
    ModTap = 2,
    Toggle = 3,
}

export class valueCUIState {
    isActuationPerKey: boolean = false;
    actuationGlobalPress: number = DEFAULT_ACTUATION_PRESS_VALUE;
    actuationGlobalRelease: number = DEFAULT_ACTUATION_RELEASE_VALUE;
    actuationTmpPress: number = DEFAULT_ACTUATION_PRESS_VALUE;
    actuationTmpRelease: number = DEFAULT_ACTUATION_RELEASE_VALUE;

    isRapidTriggerEnabled: boolean = false;
    isRapidTriggerPerKey: boolean = false;
    rapidTriggerGlobalPress: number = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
    rapidTriggerGlobalRelease: number = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;
    rapidTriggerTmpPress: number = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
    rapidTriggerTmpRelease: number = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;

    isVisualisationEnabled: boolean = false;
    visualisationDisplayValue: number = 0;

    actuationSelectedNodes = {
        layers: [],
        current: [],
    };
    // TODO: maybe separate advanced keys into their own class
    advancedKeysShowSelector: boolean = false;
    advancedKeysTypeSelectionOpened: boolean = false;
    advancedKeysSelectedKeyTmp: LayoutNode | null = null;
    advancedKeysBindingMode: AdvancedKeyMode = AdvancedKeyMode.None;
    advancedKeysSelectedTriggerPoint: TriggerPoint | null = null;
    advancedKeysAssignedTmp: {
        toggle: LayoutNode | null;
        modTapHold: LayoutNode | null;
        modTapPress: LayoutNode | null;
        dynamicKeystrokes: {
            keys: Record<TriggerPoint, {node: LayoutNode, isContinuous: boolean}>;
            firstTriggerPointValue: number;
            isContinuous: boolean;
        } | null;
    } = { toggle: null, modTapHold: null, modTapPress: null, dynamicKeystrokes: null };

    toKeyboardvalueCData(): KeyboardvalueCData {
        const data = new KeyboardvalueCData();
        data.ActuationPressValue = this.actuationGlobalPress;
        data.ActuationReleaseValue = this.actuationGlobalRelease;
        data.RapidTriggerEnabled = this.isRapidTriggerEnabled;
        data.RapidTriggerPressValue = this.rapidTriggerGlobalPress;
        data.RapidTriggerReleaseValue = this.rapidTriggerGlobalRelease;
        data.VisualisationEnabled = this.isVisualisationEnabled;

        return data;
    }

    reset() {
        this.isActuationPerKey = false;
        this.actuationGlobalPress = DEFAULT_ACTUATION_PRESS_VALUE;
        this.actuationGlobalRelease = DEFAULT_ACTUATION_RELEASE_VALUE;
        this.actuationTmpPress = DEFAULT_ACTUATION_PRESS_VALUE;
        this.actuationTmpRelease = DEFAULT_ACTUATION_RELEASE_VALUE;
        this.isRapidTriggerEnabled = false;
        this.isRapidTriggerPerKey = false;
        this.rapidTriggerGlobalPress = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
        this.rapidTriggerGlobalRelease = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;
        this.rapidTriggerTmpPress = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
        this.rapidTriggerTmpRelease = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;
        this.isVisualisationEnabled = false;
        this.visualisationDisplayValue = 0;
        this.actuationSelectedNodes = {
            layers: [],
            current: [],
        };
        this.advancedKeysShowSelector = false;
        this.advancedKeysTypeSelectionOpened = false;
        this.advancedKeysSelectedKeyTmp = null;
        this.advancedKeysBindingMode = AdvancedKeyMode.None;
        this.advancedKeysSelectedTriggerPoint = null;
        this.advancedKeysAssignedTmp = { toggle: null, modTapHold: null, modTapPress: null, dynamicKeystrokes: null };
    }
}

export class KeyboardvalueCData {
    ActuationPressValue: number = DEFAULT_ACTUATION_PRESS_VALUE;
    ActuationReleaseValue: number = DEFAULT_ACTUATION_RELEASE_VALUE;

    RapidTriggerEnabled: boolean = false;
    RapidTriggerPressValue: number = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
    RapidTriggerReleaseValue: number = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;

    VisualisationEnabled: boolean = false;
}

export class ActuationData {
    ActuationPressValue: number = DEFAULT_ACTUATION_PRESS_VALUE;
    ActuationReleaseValue: number = DEFAULT_ACTUATION_RELEASE_VALUE;

    constructor(pressValue: number, releaseValue: number = DEFAULT_ACTUATION_RELEASE_VALUE) {
        this.ActuationPressValue = pressValue;
        this.ActuationReleaseValue = releaseValue;
    }
}

export class RapidTriggerData {
    RapidTriggerPressValue: number = DEFAULT_RAPID_TRIGGER_PRESS_VALUE;
    RapidTriggerReleaseValue: number = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE;

    constructor(pressValue: number, releaseValue: number = DEFAULT_RAPID_TRIGGER_RELEASE_VALUE) {
        this.RapidTriggerPressValue = pressValue;
        this.RapidTriggerReleaseValue = releaseValue;
    }
}

export class KeyboardvalueCKeyData {
    actuationData: ActuationData | null = null;
    rapidTriggerData: RapidTriggerData | null = null;
    DynamicKeystrokeData: DynamicKeystrokeData[] | null = null;
    ModTapData: ModTapData | null = null;
    ToggleData: ToggleData | null = null;
}

export enum TriggerPoint {
    StageOnePress = 0,
    StageOneRelease = 3,
    StageTwoPress = 1,
    StageTwoRelease = 2,
}
export class DynamicKeystrokeData {
    triggerPoint: TriggerPoint;
    triggerPointValue: number | null = null;
    assignedKey: string;
    modifier: string;
    isContinuous: boolean;

    constructor(
        triggerPoint: TriggerPoint,
        triggerPointValue: number,
        assignedKey: string,
        modifier: string,
        isContinuous: boolean
    ) {
        this.triggerPoint = triggerPoint;
        this.triggerPointValue = triggerPointValue;
        this.assignedKey = assignedKey;
        this.modifier = modifier;
        this.isContinuous = isContinuous;
    }
}

export class ModTapData {
    holdAction: string;
    holdTimeout: number;
    tapAction: string;

    constructor(holdAction: string, holdTimeout: number, tapAction: string) {
        this.holdAction = holdAction;
        this.holdTimeout = holdTimeout;
        this.tapAction = tapAction;
    }
}

export enum ToggleType {
    Hold = 0,
    ReTrigger = 1,
}

export class ToggleData {
    toggleType: ToggleType;
    toggleAction: string;

    constructor(toggleType: ToggleType, toggleAction: string) {
        this.toggleType = toggleType;
        this.toggleAction = toggleAction;
    }
}
