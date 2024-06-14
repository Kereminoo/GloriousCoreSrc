import { DeviceDataRecord } from 'src/common/data/records/device-data.record';
import { PluginDeviceRecord } from 'src/common/data/records/plugin-device.record';
import { DisplayOption } from './display-option';
import { ImageAttributes, PreloadedImageAttributes } from './image-attributes';
import { DeviceImageAdjustment } from './device-image-adjustment';
import { DPISection } from './dpi-section';
import { DeviceProductColor } from './device-product-color';
import { DeviceIconData } from './device-icon-data';
import { KeyboardData } from './legacy/keyboard-data';
import { DeviceProductScale } from './device-product-scale';
import { IconType } from '@renderer/components/icon/icon.types';

export class UIDevice {
    // plugin device record data
    vid: string[] = [];
    pid: string[] = [];
    devicename: string = '';
    ModelType: number = -1;
    SN: string = '';
    DeviceId: number = -1;
    StateID: number = -1;
    StateArray: string[] = [];
    version_Wired: string = '';
    version_Wireless: string = '';
    pairingFlag: number = 0;
    batterystatus: number = 0;
    batteryvalue: string | number = 100;
    deviceData?: DeviceDataRecord;

    // profile data
    profile: DisplayOption[] = [];

    // ui data (trusted to exist because they will be added by the adapter)
    img!: string;
    lightingViewImages!: string[];
    deviceRenderAttributes!: PreloadedImageAttributes;
    lightingEffectRenderAttributes!: ImageAttributes[];
    imageAdjustments!: DeviceImageAdjustment;
    showLightingCanvas!: boolean;
    lightingEffects!: DisplayOption[];
    pollingRates!: DisplayOption[];
    wirelessPollingRates!: DisplayOption[];
    inputLatencies!: DisplayOption[];
    liftoffDistances!: DisplayOption[];
    standbyTypes!: DisplayOption[];
    dpiSections!: DPISection[];
    keybindingLayers!: DisplayOption[];
    deviceCategoryName!: string;
    rgbGradients!: DisplayOption[];
    productColors!: DeviceProductColor[];
    productScales!: DeviceProductScale[];
    productColorIndex!: number;
    // iconPaths!: DeviceIconData;
    iconType!: IconType;
    managementSections!: DisplayOption[];
    rgbOffAfterInactivity!: boolean;
    rgbOffAfterInactivityTime!: number;

    keyboardData?: KeyboardData;

    constructor(pluginDeviceRecord: PluginDeviceRecord) {
        this.vid = pluginDeviceRecord.vid;
        this.pid = pluginDeviceRecord.pid;
        this.devicename = pluginDeviceRecord.devicename;
        this.ModelType = pluginDeviceRecord.ModelType;
        this.SN = pluginDeviceRecord.SN;
        this.DeviceId = pluginDeviceRecord.DeviceId;
        this.StateID = pluginDeviceRecord.StateID;
        this.StateArray = pluginDeviceRecord.StateArray;
        this.version_Wired = pluginDeviceRecord.version_Wired;
        this.version_Wireless = pluginDeviceRecord.version_Wireless;
        this.pairingFlag = pluginDeviceRecord.pairingFlag;
        this.batterystatus = pluginDeviceRecord.batterystatus;
        this.batteryvalue = pluginDeviceRecord.batteryvalue;
        this.deviceData = pluginDeviceRecord.deviceData;
    }
}

