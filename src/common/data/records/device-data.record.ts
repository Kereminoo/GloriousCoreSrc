import { AppRecord } from './app-record';

export class DeviceRecordColorData {
    R: number = 255;
    G: number = 0;
    B: number = 0;
    flag: boolean = false;

    constructor(R: number = 255, G: number = 0, B: number = 0, flag: boolean) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.flag = flag;
    }
}

export class DPIStageData {
    value: number;
    color: string;
    isDefault?: boolean;
    constructor(value: number = 0, color: string = 'FFFF00', isDefault?: boolean) {
        this.value = value;
        this.color = color;
        this.isDefault = isDefault;
    }
}

export class AdvanceDebounceSettings {
    AdvancedSwitch: boolean;
    BeforePressValue: number;
    BeforeReleaseValue: number;
    AfterPressValue: number;
    AfterReleaseValue: number;
    LiftOffPressValue: number;
    constructor(
        AdvancedSwitch: boolean = false,
        BeforePressValue: number = 0,
        BeforeReleaseValue: number = 0,
        AfterPressValue: number = 10,
        AfterReleaseValue: number = 10,
        LiftOffPressValue: number = 8,
    ) {
        this.AdvancedSwitch = AdvancedSwitch;
        this.BeforePressValue = BeforePressValue;
        this.BeforeReleaseValue = BeforeReleaseValue;
        this.AfterPressValue = AfterPressValue;
        this.AfterReleaseValue = AfterReleaseValue;
        this.LiftOffPressValue = LiftOffPressValue;
    }
}
export class MousePerformanceData {
    pollingrate: number = 1000;
    inputLatency: number = 16;
    LodValue: number = 1;
    DebounceValue: number = 10;
    DpiNum: number = 6;
    dpiSelectIndex: number = 2;
    DpiStage: DPIStageData[] = [];
    MotionSyncFlag?: boolean;
    pollingrateSelect?: boolean;
    AdvancedDebounce?: AdvanceDebounceSettings;
    pollingratearray?: number[];
}

export class MouseLightingData {
    Effect: number = 0;
    RateValue: number = 60;
    OpacityValue: number = 60;
    WiredBrightnessValue: number = 60;
    WirelessBrightnessValue: number = 60;
    SepatateCheckValue: boolean = false;
    Color: DeviceRecordColorData[] = [new DeviceRecordColorData(255, 0, 0, false)];
    Zone: number = 0;
}

export class ButtonKeybindData {
    value: number = -1;
    group: number = -1;
    function: number | string = -1;
    name: string = '';
    param: string | number | boolean[] = '';
    param2: string = '';
}

export class PerKeyLightingSelectionData {
    value: number = 1;
}

export class PerKeyLightingKeyData
{
    border: boolean = true;
    breathing: boolean = false;
    clearStatus: boolean = false;
    color: number[] = [0, 0, 0, 0];
    // coordinateData: {clientHeight: 39, clientWidth: 36, offsetLeft: 10, offsetTop: 11, scroll: ƒ, …}
    keyCode: string = "";
    colorEnabled: boolean = false;
    breathingEnabled: boolean = false;
}

export class PresetLightingParameterNumberData {
    visible: boolean = false;
    translate: string = 'SPEED';
    maxValue: number = 10;
    minValue: number = 1;
    setValue: number = 1;
    field: string = 'speed';
}
export class PresetLightingBoolListData {
    visible: boolean = false;
    translate: string = 'SEPARATE';
    setValue: boolean = false;
    field: string = 'separate';
}
export class PresetLightingData {
    color_quantity: number = 1;
    translate: string = 'Option_LightingEffect_GloriousMode';
    Multicolor: boolean = false;
    Multicolor_Enable: boolean = false;
    colorPickerValue: number[] = [255, 0, 0, 1];
    brightness: number = 100;
    wirelessBrightness: number = 100;
    value: number = 0;
    speed: number = 50;
    brightness_Enable: boolean = true;
    color_Enable: boolean = false;
    rate_Enable: boolean = false;
    colors: string[] = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#007fff', '#0000ff', '#8b00ff'];
    ParameterNumberList: PresetLightingParameterNumberData[] = [new PresetLightingParameterNumberData()];
    ParameterBoolList: PresetLightingBoolListData[] = [new PresetLightingBoolListData()];
    PointEffectName: string = 'Glorious Mode';
    separateBrightness: boolean = false;
}

export class KeyboardKeybindAssignment {
    'keyAssignType': string[] = ['', '', ''];
    LongTimePressValue: string = '';
    InstantPressValue: string = '';
    LongTime_Instant_Status: boolean = false;
    openLongTimePress: boolean = false;
    defaultValue: string = 'Esc';
    value: string = 'Default';
    macro_RepeatType: number = 0;
    macro_Data: any = {};
    assignValue: string = '';
    profileName: string = '';
    recordBindCodeType: string = '';
    recordBindCodeName: string = 'Default';
    shortcutsWindowsEnable: boolean = false;
    ApplicationPath: string = '';
    WebsitePath: string = '';
    combinationkeyEnable: boolean = false;
    Shift: boolean = false;
    Alt: boolean = false;
    Ctrl: boolean = false;
    hasFNStatus: boolean = false;
    AltGr: boolean = false;
    Windows: boolean = false;
    changed: boolean = false;
}

export class ProfileData {
    profileName: string = '';
    profileid: number = -1;

    // keyboard data
    defaultName?: string = 'Default';
    hibernate?: boolean;
    hibernateTimeArr?: number[];
    hibernateTime?: number;
    winLock?: boolean;
    inputLatency?: number = 16;
    recordAssignBtnIndex?: number = 14;
    assignText?: string = 'defaultKey';
    maxKayCapNumber?: number = 83;
    assignedKeyboardKeys?: KeyboardKeybindAssignment[][] = [];
    assignedFnKeyboardKeys?: any[] = [];
    fnModeMartrix?: boolean[] = [false, false, false];
    fnModeindex?: number = 0;
    fiveDefaultLedCode?: any[] = [];
    fiveRecordIndex?: number = 0;
    keyHoverIndex?: number = 0;
    profileLayerIndex?: number = 0;
    sensitivity?: number = 0;
    standbyvalue?: number = 0;
    light_PERKEY_Layout: number = 0;
    light_PERKEY_KeyAssignments: PerKeyLightingKeyData[][] = [[]];
    light_PERKEY_Data?: { value: number};
    light_PRESETS_Data?: PresetLightingData;

    // mouse data
    DPIMin?: number = 100;
    DPIMax?: number = 19000;
    templighting?: MouseLightingData[] = [];
    lighting?: MouseLightingData = new MouseLightingData();
    keybinding?: ButtonKeybindData[] = [];
    keybindingLayerShift?: ButtonKeybindData[] = [];
    performance?: MousePerformanceData = new MousePerformanceData();
    pollingrate?: number = 1000;

    // valueJ data
    lightData?: valueJLightData[] = [];
}

export class DeviceDataRecord extends AppRecord {
    vid: string[] = [];
    pid: string[] = [];
    SN: string = '';
    devicename: string = '';
    ModelType: number = -1;
    image: string = '';
    battery: boolean = false;
    batteryLevelIndicator: boolean = false;
    profile: ProfileData[] = [];
    // profileIndex: number = 1;
    profileindex: number | string = 1;
    value: number = -1;

    //keyboard properties
    layerMaxNumber?: number = 3;
    profileLayerIndex?: number[] = [0, 0, 0];
    sideLightSwitch?: boolean = false;
    profileLayers: ProfileData[][] = [];
}

export class valueJLightData {
    Color: DeviceRecordColorData[] = [new DeviceRecordColorData(255, 0, 0, false)];
    Effect: number = 0;
    RateValue: number = 100;
    WiredBrightnessValue: number = 100;
}
