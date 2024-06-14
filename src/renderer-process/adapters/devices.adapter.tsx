import { DeviceService } from '@renderer/services/device.service';
import { ProtocolService } from '@renderer/services/protocol.service';
import { FuncName, FuncType } from '../../common/FunctionVariable';
import {
    KeybindingLayers_Keyboard,
    KeybindingLayers_ShiftLayer,
    KeybindingLayers_SingleLayer,
} from '@renderer/data/keybinding-layer';
import {
    LightingEffects_Keyboard,
    LightingEffects_Mouse,
    LightingEffects_valueJ,
} from '@renderer/data/lighting-effect';
import { ImageAttributes, PreloadedImageAttributes } from '@renderer/data/image-attributes';
import { DeviceImageAdjustment } from '@renderer/data/device-image-adjustment';
import { PollingRates_1K, PollingRates_4K, PollingRates_4K8K } from '@renderer/data/polling-rate';
import { DPISections_19000, DPISections_26000 } from '@renderer/data/dpi-section';
import { RGBGradients_Default } from '@renderer/data/rgb-gradient';
import {
    ProductColors_Black,
    ProductColors_BlackAndWhite,
    ProductColors_BlackWhitePink,
    ProductColors_Default,
    ProductColors_ModelDProEditions,
    ProductColors_ModelOProEditions,
    ProductColors_SeriesOneProEditions,
} from '@renderer/data/device-product-color';
import { DeviceIconData } from '@renderer/data/device-icon-data';
import {
    DeviceManagementSections_AnalogKeyboard,
    DeviceManagementSections_Keyboard,
    DeviceManagementSections_Mouse,
    DeviceManagementSections_Mouse_Unlit,
    DeviceManagementSections_valueJ,
} from '@renderer/data/management-section';
import { InputLatencies } from '@renderer/data/input-latency';
import { LiftOffDistances } from '@renderer/data/liftoff-distance';
import { StandbyTypes } from '@renderer/data/standby-type';
import { UIDevice } from '@renderer/data/ui-device';
import { KeyboardData } from '@renderer/data/legacy/keyboard-data';
import { ProductScales_Default, ProductScales_V1 } from '@renderer/data/device-product-scale';
import { IconType } from '@renderer/components/icon/icon.types';

/*
Keyboards:
GMMK Numpad: 0x320F0x5088
GMMK PRO: 0x320F0x5044 (alternate board: 0x320F0x5092)
GMMK PRO ISO: 0x320F0x5046 (alternate board: 0x320F0x5093)
GMMK v2 65 ISO: 0x320F0x504A
GMMK v2 65 US: 0x320F0x5045
GMMK v2 96 ISO: 0x320F0x505A
GMMK v2 96 US: 0x320F0x504B

// temporary VID/PIDs; should ALWAYS be removed
valueB: 0x24420x2682
valueBWireless: 0x24420x0056
valueB65: 0x24420x0052
valueB65Wireless: 0x24420x0054
valueB75: 0x24420x0053
valueB75Wireless: 0x24420x0055

valueB: 0x342D0xE3C5
valueBISO: 0x342D0xE3CE
valueBWireless: 0x342D0xE3CB
valueBWirelessISO: 0x342D0xE3D4
valueB65: 0x342D0xE3C7
valueB65ISO: 0x342D0xE3D0
valueB65Wireless: 0x342D0xE3CD
valueB65WirelessISO: 0x342D0xE3D6
valueB75: 0x342D0xE3C6
valueB75ISO: 0x342D0xE3Cf
valueB75Wireless: 0x342D0xE3CC
valueB75WirelessISO: 0x342D0xE3D5

valueD100: 0x342D0xE3C8
valueD100ISO: 0x342D0xE3D1
valueD75: 0x342D0xE3C9
valueD75ISO: 0x342D0xE3D2
valueD65: 0x342D0xE3CA
valueD65ISO:0x342D0xE3D3

valueC: 0x342D0xE3DB

Mice:
Model O Wired: 0x320F0x8888
Model O Wireless: 0x258A0x2011
Model O Minus Wired: 0x258A0x2036
Model O Minus Wireless: 0x258A0x2013
Model O Pro Wireless: 0x258A0x2015
Model O2 Wired: 0x320F0x823A
Model O2 Wireless: 0x093A0x822A
Model O2 Pro 1k Wireless: 0x258A0x2019
Model O2 Pro 8k Wireless: 0x258A0x201B
Model D Wireless: 0x258A0x2012
Model D Minus Wireless: 0x258A0x2014
Model D Pro Wireless: 0x258A0x2017
Model D2 Pro 1k Wireless: 0x258A0x201A
Model D2 Pro 8k Wireless: 0x258A0x201C
Model I Wired: 0x22D40x1503
Model I2 Wireless: 0x093A0x821A
Model valueG: 0x320F0x831A
Model D2 Wired: 0x320F0x825A
Model D2 Wireless: 0x093A0x824A
Series One Pro Wireless: 0x258A0x2018
valueH Pro: 0x258A0x201D (8k wireless)
valueF Wireless: 0x093A0x826A
valueF: 0x320F0x827A

Devices:
Wireless Dock: 0x342D0xE391
Wireless valueE: TODO
RGB valueJ: 0x12CF0x0491
Dongle Kit V2: 0x093A0x829D
Dongle Kit 4k/8k: 0x258A0x2038
*/

/*********
 * 5/14 Device support
 *
 */

// TODO: Change how "image" is stored in the SupportDevice DB, to deprecate this adapter
const DeviceImageValueTranslations = new Map<string, { img: string; lightingViewImages: string[] }>(
    Object.entries({
        GMMKNUMPAD: {
            img: 'Keyboard_GMMKNumpad',
            lightingViewImages: ['_Sidelights'],
        },
        GMMKPro: {
            img: 'Keyboard_GMMKPRO',
            lightingViewImages: ['_Sidelights'],
        },
        GMMKProISO: {
            img: 'Keyboard_GMMKPROISO',
            lightingViewImages: ['_Sidelights'],
        }, // 'GMMKPROISOWB':
        // {
        //     img: "Keyboard_GMMKPROISO",
        //     lightingViewImages: []
        // },
        // 'GMMKPROWB':
        // {
        //     img: "Keyboard_GMMKPRO",
        //     lightingViewImages: []
        // },
        GMMKV265ISO: {
            img: 'Keyboard_GMMKV265ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueB65: {
            img: 'Keyboard_valueB65',
            lightingViewImages: ['_Sidelights'],
        },
        valueB65ISO: {
            img: 'Keyboard_valueB65ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueB65Wireless: {
            img: 'Keyboard_valueB65Wireless',
            lightingViewImages: ['_Sidelights'],
        },
        valueB65WirelessISO: {
            img: 'Keyboard_valueB65WirelessISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueB75: {
            img: 'Keyboard_valueB75',
            lightingViewImages: ['_Sidelights'],
        },
        valueB75ISO: {
            img: 'Keyboard_valueB75ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueB75Wireless: {
            img: 'Keyboard_valueB75Wireless',
            lightingViewImages: ['_Sidelights'],
        },
        valueB75WirelessISO: {
            img: 'Keyboard_valueB75WirelessISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueB: {
            img: 'Keyboard_valueB100',
            lightingViewImages: ['_Sidelights'],
        },
        valueBISO: {
            img: 'Keyboard_valueB100ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueBWireless: {
            img: 'Keyboard_valueB100Wireless',
            lightingViewImages: ['_Sidelights'],
        },
        valueBWirelessISO: {
            img: 'Keyboard_valueB100WirelessISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueC65: {
            img: 'Keyboard_valueC65',
            lightingViewImages: ['_Sidelights'],
        },
        valueC75: {
            img: 'Keyboard_valueC75',
            lightingViewImages: ['_Sidelights'],
        },
        valueC100: {
            img: 'Keyboard_valueC100',
            lightingViewImages: ['_Sidelights'],
        },
        valueC65ISO: {
            img: 'Keyboard_valueC65ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueC75ISO: {
            img: 'Keyboard_valueC75ISO',
            lightingViewImages: ['_Sidelights'],
        },
        valueC100ISO: {
            img: 'Keyboard_valueC100ISO',
            lightingViewImages: ['_Sidelights'],
        },
        GMMKV265US: {
            img: 'Keyboard_GMMKV265US',
            lightingViewImages: ['_Sidelights'],
        },
        GMMKV296ISO: {
            img: 'Keyboard_GMMKV296ISO',
            lightingViewImages: ['_Sidelights'],
        },
        GMMKV296US: {
            img: 'Keyboard_GMMKV296US',
            lightingViewImages: ['_Sidelights'],
        }, // 'ModelD-Wireless':
        // {
        //     img: "Mouse_ModelDMinusWireless",
        //     lightingViewImages: []
        // },
        'ModelO-Wireless': {
            img: 'Mouse_ModelOWireless',
            lightingViewImages: [],
        },
        ModelO: {
            img: 'Mouse_ModelOWireless',
            lightingViewImages: [],
        }, // 'ModelO-Wireless':
        // {
        //     img: "Mouse_ModelOMinusWired",
        //     lightingViewImages: []
        // },
        ModelI: {
            img: 'Mouse_ModelIWired',
            lightingViewImages: [],
        },
        ModelDWireless: {
            img: 'Mouse_ModelDWireless',
            lightingViewImages: [],
        }, // 'MODELOWired':
        // {
        //     img: "Mouse_ModelOWired",
        //     lightingViewImages: []
        // },
        // 'WirelessDock':
        // {
        //     img: "Dock_WirelessDock",
        //     lightingViewImages: []
        // },
        ModelOPROWL: {
            img: 'Mouse_ModelOProWireless',
            lightingViewImages: [],
        },
        ModelDPROWL: {
            img: 'Mouse_ModelDProWireless',
            lightingViewImages: [],
        },
        ModelO2PROWL: {
            img: 'Mouse_ModelO2ProWireless',
            lightingViewImages: [],
        },
        ModelD2PROWL: {
            img: 'Mouse_ModelD2ProWireless',
            lightingViewImages: [],
        },
        MOW2: {
            img: 'Mouse_ModelO2Wireless',
            lightingViewImages: [],
        },
        MOWired2: {
            img: 'Mouse_ModelO2Wired',
            lightingViewImages: [],
        },
        SeriesOneProWL: {
            img: 'Mouse_SeriesOneProWireless',
            lightingViewImages: [],
        },
        MI2Wireless: {
            img: 'Mouse_ModelI2Wireless',
            lightingViewImages: [],
        },
        ModelI2: {
            img: 'Mouse_ModelvalueG',
            lightingViewImages: [],
        },
        ModelD2Wired: {
            img: 'Mouse_ModelD2Wired',
            lightingViewImages: [],
        },
        MD2Wireless: {
            img: 'Mouse_ModelD2Wireless',
            lightingViewImages: [],
        }, // 'GloriousWirelessvalueE':
        // {
        //     img: "valueE_GloriousWirelessvalueE",
        //     lightingViewImages: []
        // },
        // 'DongleV2Kit':
        // {
        //     img: "DongleKit_V2",
        //     lightingViewImages: []
        // },
        valueJ: {
            img: 'valueJ',
            lightingViewImages: [],
        },
        MO2MiniWireless: {
            img: 'Mouse_ModelO2Wireless',
            lightingViewImages: [],
        },
        MO2Mini: {
            img: 'Mouse_ModelO2Wired',
            lightingViewImages: [],
        },
        valueHProWireless: {
            img: 'Mouse_valueHProWireless',
            lightingViewImages: [],
        },
    }),
);

const DevicePollingRates = new Map(
    Object.entries({
        '0x320F0x5044': PollingRates_1K, // GMMK PRO
        '0x320F0x5092': PollingRates_1K, // GMMK PRO
        '0x320F0x5046': PollingRates_1K, // GMMK PRO ISO
        '0x320F0x5093': PollingRates_1K, // GMMK PRO ISO
        '0x320F0x504A': PollingRates_1K, // GMMK v2 65 ISO
        '0x320F0x5045': PollingRates_1K, // GMMK v2 65 US
        '0x320F0x505A': PollingRates_1K, // GMMK v2 96 ISO
        '0x320F0x504B': PollingRates_1K, // GMMK v2 96 US
        '0x320F0x5088': PollingRates_1K, // GMMK Numpad

        '0x342D0xE3C5': PollingRates_1K, // valueB
        '0x342D0xE3CE': PollingRates_1K, // valueBISO
        '0x342D0xE3CB': PollingRates_1K, // valueBWireless
        '0x342D0xE3D4': PollingRates_1K, // valueBWirelessISO
        '0x342D0xE3C7': PollingRates_1K, // valueB65
        '0x342D0xE3D0': PollingRates_1K, // valueB65ISO
        '0x342D0xE3CD': PollingRates_1K, // valueB65Wireless
        '0x342D0xE3D6': PollingRates_1K, // valueB65WirelessISO
        '0x342D0xE3C6': PollingRates_1K, // valueB75
        '0x342D0xE3CF': PollingRates_1K, // valueB75ISO
        '0x342D0xE3CC': PollingRates_1K, // valueB75Wireless
        '0x342D0xE3D5': PollingRates_1K, // valueB75WirelessISO
        '0x342D0xE3C8': PollingRates_1K, // valueD100
        '0x342D0xE3D1': PollingRates_1K, // valueD100ISO
        '0x342D0xE3C9': PollingRates_1K, // valueD75
        '0x342D0xE3D2': PollingRates_1K, // valueD75ISO
        '0x342D0xE3CA': PollingRates_1K, // valueD65
        '0x342D0xE3D3': PollingRates_1K, // valueD65ISO

        '0x342D0xE3D7': PollingRates_1K, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': PollingRates_1K, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': PollingRates_1K, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': PollingRates_1K, // valueC 65% Wireless ISO
        '0x342D0xE3ED': PollingRates_1K, // valueC 75% Wireless ISO
        '0x342D0xE3EE': PollingRates_1K, // valueC 100% Wireless ISO

        '0x342D0xE3DA': PollingRates_4K8K, // valueC 65% ANSI
        '0x342D0xE3DB': PollingRates_4K8K, // valueC 75% ANSI
        '0x342D0xE3DC': PollingRates_4K8K, // valueC 100% ANSI
        '0x342D0xE3EF': PollingRates_4K8K, // valueC 65% ISO
        '0x342D0xE3F0': PollingRates_4K8K, // valueC 75% ISO
        '0x342D0xE3F1': PollingRates_4K8K, // valueC 100% ISO

        '0x342D0xE3DD': PollingRates_1K, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': PollingRates_1K, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': PollingRates_1K, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': PollingRates_1K, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': PollingRates_1K, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': PollingRates_1K, // valueA valueD HE 100% ISO

        '0x320F0x8888': PollingRates_1K, // Model O Wired
        '0x258A0x2011': PollingRates_1K, // Model O Wireless
        '0x258A0x2036': PollingRates_1K, // Model O Minus Wired
        '0x258A0x2013': PollingRates_1K, // Model O Minus Wireless
        '0x258A0x2015': PollingRates_1K, // Model O Pro Wireless
        '0x320F0x823A': PollingRates_1K, // Model O2 Wired
        '0x093A0x822A': PollingRates_1K, // Model O2 Wireless
        '0x258A0x2019': PollingRates_1K, // Model O2 Pro 1k
        '0x258A0x201B': PollingRates_4K8K, // Model O 2 Pro 8k
        '0x258A0x2012': PollingRates_1K, // Model D Wireless
        '0x258A0x2014': PollingRates_1K, // Model D Minus Wireless
        '0x258A0x2017': PollingRates_1K, // Model D Pro Wireless
        '0x258A0x201A': PollingRates_1K, // Model D 2 Pro 1k
        '0x258A0x201C': PollingRates_4K8K, // Model D 2 Pro 8k
        '0x22D40x1503': PollingRates_1K, // Model I
        '0x093A0x821A': PollingRates_1K, // Model I2 Wireless
        '0x320F0x831A': PollingRates_1K, // Model valueG
        '0x320F0x825A': PollingRates_1K, // Model D2 Wired
        '0x093A0x824A': PollingRates_1K, // Model D2 Wireless
        '0x258A0x2018': PollingRates_1K, // Series One Pro Wireless
        '0x258A0x201D': PollingRates_4K8K, //valueH Pro (8k wireless)
        '0x093A0x826A': PollingRates_1K, //valueF Wireless
        '0x320F0x827A': PollingRates_1K, //valueF

        '0x24420x2682': PollingRates_1K, // temporary valueB
        '0x24420x0056': PollingRates_1K, // temporary valueB Wireless
        '0x24420x0052': PollingRates_1K, // temporary valueB 65%
        '0x24420x0054': PollingRates_1K, // temporary valueB 65% Wireless
        '0x24420x0053': PollingRates_1K, // temporary valueB 75%
        '0x24420x0055': PollingRates_1K, // temporary valueB 75% Wireless
    }),
);

const DeviceWirelessPollingRates = new Map(
    Object.entries({
        '0x258A0x2019': PollingRates_1K, // Model O2 Pro 1k
        '0x258A0x201B': PollingRates_4K, // Model O 2 Pro 8k
        '0x258A0x201A': PollingRates_1K, // Model D 2 Pro 1k
        '0x258A0x201C': PollingRates_4K, // Model D 2 Pro 8k
        '0x258A0x201D': PollingRates_4K8K, //valueH Pro (8k wireless)
    }),
);

const DeviceLightingEffects = new Map(
    Object.entries({
        '0x320F0x5044': LightingEffects_Keyboard, // GMMK PRO
        '0x320F0x5092': LightingEffects_Keyboard, // GMMK PRO
        '0x320F0x5046': LightingEffects_Keyboard, // GMMK PRO ISO
        '0x320F0x5093': LightingEffects_Keyboard, // GMMK PRO ISO
        '0x320F0x504A': LightingEffects_Keyboard, // GMMK v2 65 ISO
        '0x320F0x5045': LightingEffects_Keyboard, // GMMK v2 65 US
        '0x320F0x505A': LightingEffects_Keyboard, // GMMK v2 96 ISO
        '0x320F0x504B': LightingEffects_Keyboard, // GMMK v2 96 US
        '0x320F0x5088': LightingEffects_Keyboard, // GMMK Numpad

        '0x342D0xE3C5': LightingEffects_Keyboard, // valueB
        '0x342D0xE3CE': LightingEffects_Keyboard, // valueBISO
        '0x342D0xE3CB': LightingEffects_Keyboard, // valueBWireless
        '0x342D0xE3D4': LightingEffects_Keyboard, // valueBWirelessISO
        '0x342D0xE3C7': LightingEffects_Keyboard, // valueB65
        '0x342D0xE3D0': LightingEffects_Keyboard, // valueB65ISO
        '0x342D0xE3CD': LightingEffects_Keyboard, // valueB65Wireless
        '0x342D0xE3D6': LightingEffects_Keyboard, // valueB65WirelessISO
        '0x342D0xE3C6': LightingEffects_Keyboard, // valueB75
        '0x342D0xE3CF': LightingEffects_Keyboard, // valueB75ISO
        '0x342D0xE3CC': LightingEffects_Keyboard, // valueB75Wireless
        '0x342D0xE3D5': LightingEffects_Keyboard, // valueB75WirelessISO
        '0x342D0xE3C8': LightingEffects_Keyboard, // valueD100
        '0x342D0xE3D1': LightingEffects_Keyboard, // valueD100ISO
        '0x342D0xE3C9': LightingEffects_Keyboard, // valueD75
        '0x342D0xE3D2': LightingEffects_Keyboard, // valueD75ISO
        '0x342D0xE3CA': LightingEffects_Keyboard, // valueD65
        '0x342D0xE3D3': LightingEffects_Keyboard, // valueD65ISO

        '0x342D0xE3D7': LightingEffects_Keyboard, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': LightingEffects_Keyboard, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': LightingEffects_Keyboard, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': LightingEffects_Keyboard, // valueC 65% Wireless ISO
        '0x342D0xE3ED': LightingEffects_Keyboard, // valueC 75% Wireless ISO
        '0x342D0xE3EE': LightingEffects_Keyboard, // valueC 100% Wireless ISO

        '0x342D0xE3DA': LightingEffects_Keyboard, // valueC 65% ANSI
        '0x342D0xE3DB': LightingEffects_Keyboard, // valueC 75% ANSI
        '0x342D0xE3DC': LightingEffects_Keyboard, // valueC 100% ANSI
        '0x342D0xE3EF': LightingEffects_Keyboard, // valueC 65% ISO
        '0x342D0xE3F0': LightingEffects_Keyboard, // valueC 75% ISO
        '0x342D0xE3F1': LightingEffects_Keyboard, // valueC 100% ISO

        '0x342D0xE3DD': LightingEffects_Keyboard, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': LightingEffects_Keyboard, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': LightingEffects_Keyboard, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': LightingEffects_Keyboard, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': LightingEffects_Keyboard, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': LightingEffects_Keyboard, // valueA valueD HE 100% ISO

        '0x320F0x8888': LightingEffects_Mouse, // Model O Wired
        '0x258A0x2011': LightingEffects_Mouse, // Model O Wireless
        '0x258A0x2036': LightingEffects_Mouse, // Model O Minus Wired
        '0x258A0x2013': LightingEffects_Mouse, // Model O Minus Wireless
        '0x258A0x2015': LightingEffects_Mouse, // Model O Pro Wireless
        '0x320F0x823A': LightingEffects_Mouse, // Model O2 Wired
        '0x093A0x822A': LightingEffects_Mouse, // Model O2 Wireless
        '0x258A0x2019': LightingEffects_Mouse, // Model O2 Pro 1k
        '0x258A0x201B': LightingEffects_Mouse, // Model O 2 Pro 8k
        '0x258A0x2012': LightingEffects_Mouse, // Model D Wireless
        '0x258A0x2014': LightingEffects_Mouse, // Model D Minus Wireless
        '0x258A0x2017': LightingEffects_Mouse, // Model D Pro Wireless
        '0x258A0x201A': LightingEffects_Mouse, // Model D 2 Pro 1k
        '0x258A0x201C': LightingEffects_Mouse, // Model D 2 Pro 8k
        '0x22D40x1503': LightingEffects_Mouse, // Model I
        '0x093A0x821A': LightingEffects_Mouse, // Model I2
        '0x320F0x831A': LightingEffects_Mouse, // Model valueG
        '0x320F0x825A': LightingEffects_Mouse, // Model D2 Wired
        '0x093A0x824A': LightingEffects_Mouse, // Model D2 Wireless
        '0x258A0x2018': LightingEffects_Mouse, // Series One Pro Wireless
        '0x258A0x201D': LightingEffects_Mouse, //valueH Pro (8k wireless)
        '0x093A0x826A': LightingEffects_Mouse, //valueF Wireless
        '0x320F0x827A': LightingEffects_Mouse, //valueF

        '0x12CF0x0491': LightingEffects_valueJ, // RGB valueJ

        '0x24420x2682': LightingEffects_Keyboard, // temporary valueB
        '0x24420x0056': LightingEffects_Keyboard, // temporary valueB Wireless
        '0x24420x0052': LightingEffects_Keyboard, // temporary valueB 65%
        '0x24420x0054': LightingEffects_Keyboard, // temporary valueB 65% Wireless
        '0x24420x0053': LightingEffects_Keyboard, // temporary valueB 75%
        '0x24420x0055': LightingEffects_Keyboard, // temporary valueB 75% Wireless
    }),
);

const DeviceDPISections = new Map(
    Object.entries({
        // don't have DPIs
        // "0x320F0x5044": LightingEffects_Keyboard, // GMMK PRO
        // "0x320F0x5092": LightingEffects_Keyboard, // GMMK PRO
        // "0x320F0x5046": LightingEffects_Keyboard, // GMMK PRO ISO
        // "0x320F0x5093": LightingEffects_Keyboard, // GMMK PRO ISO
        // "0x320F0x504A": LightingEffects_Keyboard, // GMMK v2 65 ISO
        // "0x320F0x5045": LightingEffects_Keyboard, // GMMK v2 65 US
        // "0x320F0x505A": LightingEffects_Keyboard, // GMMK v2 96 ISO
        // "0x320F0x504B": LightingEffects_Keyboard, // GMMK v2 96 US
        // "0x320F0x5088": LightingEffects_Keyboard, // GMMK Numpad

        '0x320F0x8888': DPISections_19000, // Model O Wired
        '0x258A0x2011': DPISections_19000, // Model O Wireless
        '0x258A0x2036': DPISections_19000, // Model O Minus Wired
        '0x258A0x2013': DPISections_19000, // Model O Minus Wireless
        '0x258A0x2015': DPISections_19000, // Model O Pro Wireless
        '0x320F0x823A': DPISections_26000, // Model O2 Wired
        '0x093A0x822A': DPISections_26000, // Model O2 Wireless
        '0x258A0x2019': DPISections_26000, // Model O2 Pro 1k
        '0x258A0x201B': DPISections_26000, // Model O 2 Pro 8k
        '0x258A0x2012': DPISections_19000, // Model D Wireless
        '0x258A0x2014': DPISections_19000, // Model D Minus Wireless
        '0x258A0x2017': DPISections_19000, // Model D Pro Wireless
        '0x258A0x201A': DPISections_26000, // Model D 2 Pro 1k
        '0x258A0x201C': DPISections_26000, // Model D 2 Pro 8k
        '0x22D40x1503': DPISections_19000, // Model I
        '0x093A0x821A': DPISections_26000, // Model I2
        '0x320F0x831A': DPISections_26000, // Model valueG
        '0x320F0x825A': DPISections_26000, // Model D2 Wired
        '0x093A0x824A': DPISections_26000, // Model D2 Wireless
        '0x258A0x2018': DPISections_19000, // Series One Pro Wireless
        '0x258A0x201D': DPISections_26000, //valueH Pro (8k wireless)
        '0x093A0x826A': DPISections_26000, //valueF Wireless
        '0x320F0x827A': DPISections_26000, //valueF
    }),
);

const DeviceRGBGradients = new Map(
    Object.entries({
        '0x320F0x5044': RGBGradients_Default, // GMMK PRO
        '0x320F0x5092': RGBGradients_Default, // GMMK PRO
        '0x320F0x5046': RGBGradients_Default, // GMMK PRO ISO
        '0x320F0x5093': RGBGradients_Default, // GMMK PRO ISO
        '0x320F0x504A': RGBGradients_Default, // GMMK v2 65 ISO
        '0x320F0x5045': RGBGradients_Default, // GMMK v2 65 US
        '0x320F0x505A': RGBGradients_Default, // GMMK v2 96 ISO
        '0x320F0x504B': RGBGradients_Default, // GMMK v2 96 US
        '0x320F0x5088': RGBGradients_Default, // GMMK Numpad

        '0x342D0xE3C5': RGBGradients_Default, // valueB
        '0x342D0xE3CE': RGBGradients_Default, // valueBISO
        '0x342D0xE3CB': RGBGradients_Default, // valueBWireless
        '0x342D0xE3D4': RGBGradients_Default, // valueBWirelessISO
        '0x342D0xE3C7': RGBGradients_Default, // valueB65
        '0x342D0xE3D0': RGBGradients_Default, // valueB65ISO
        '0x342D0xE3CD': RGBGradients_Default, // valueB65Wireless
        '0x342D0xE3D6': RGBGradients_Default, // valueB65WirelessISO
        '0x342D0xE3C6': RGBGradients_Default, // valueB75
        '0x342D0xE3CF': RGBGradients_Default, // valueB75ISO
        '0x342D0xE3CC': RGBGradients_Default, // valueB75Wireless
        '0x342D0xE3D5': RGBGradients_Default, // valueB75WirelessISO
        '0x342D0xE3C8': RGBGradients_Default, // valueD100
        '0x342D0xE3D1': RGBGradients_Default, // valueD100ISO
        '0x342D0xE3C9': RGBGradients_Default, // valueD75
        '0x342D0xE3D2': RGBGradients_Default, // valueD75ISO
        '0x342D0xE3CA': RGBGradients_Default, // valueD65
        '0x342D0xE3D3': RGBGradients_Default, // valueD65ISO

        '0x342D0xE3D7': RGBGradients_Default, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': RGBGradients_Default, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': RGBGradients_Default, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': RGBGradients_Default, // valueC 65% Wireless ISO
        '0x342D0xE3ED': RGBGradients_Default, // valueC 75% Wireless ISO
        '0x342D0xE3EE': RGBGradients_Default, // valueC 100% Wireless ISO

        '0x342D0xE3DA': RGBGradients_Default, // valueC 65% ANSI
        '0x342D0xE3DB': RGBGradients_Default, // valueC 75% ANSI
        '0x342D0xE3DC': RGBGradients_Default, // valueC 100% ANSI
        '0x342D0xE3EF': RGBGradients_Default, // valueC 65% ISO
        '0x342D0xE3F0': RGBGradients_Default, // valueC 75% ISO
        '0x342D0xE3F1': RGBGradients_Default, // valueC 100% ISO

        '0x342D0xE3DD': RGBGradients_Default, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': RGBGradients_Default, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': RGBGradients_Default, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': RGBGradients_Default, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': RGBGradients_Default, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': RGBGradients_Default, // valueA valueD HE 100% ISO

        '0x320F0x8888': RGBGradients_Default, // Model O Wired
        '0x258A0x2011': RGBGradients_Default, // Model O Wireless
        '0x258A0x2036': RGBGradients_Default, // Model O Minus Wired
        '0x258A0x2013': RGBGradients_Default, // Model O Minus Wireless
        '0x258A0x2015': RGBGradients_Default, // Model O Pro Wireless
        '0x320F0x823A': RGBGradients_Default, // Model O2 Wired
        '0x093A0x822A': RGBGradients_Default, // Model O2 Wireless
        '0x258A0x2019': RGBGradients_Default, // Model O2 Pro 1k
        '0x258A0x201B': RGBGradients_Default, // Model O 2 Pro 8k
        '0x258A0x2012': RGBGradients_Default, // Model D Wireless
        '0x258A0x2014': RGBGradients_Default, // Model D Minus Wireless
        '0x258A0x2017': RGBGradients_Default, // Model D Pro Wireless
        '0x258A0x201A': RGBGradients_Default, // Model D 2 Pro 1k
        '0x258A0x201C': RGBGradients_Default, // Model D 2 Pro 8k
        '0x22D40x1503': RGBGradients_Default, // Model I
        '0x093A0x821A': RGBGradients_Default, // Model I2
        '0x320F0x831A': RGBGradients_Default, // Model valueG
        '0x320F0x825A': RGBGradients_Default, // Model D2 Wired
        '0x093A0x824A': RGBGradients_Default, // Model D2 Wireless
        '0x258A0x2018': RGBGradients_Default, // Series One Pro Wireless
        '0x258A0x201D': RGBGradients_Default, //valueH Pro (8k wireless)
        '0x093A0x826A': RGBGradients_Default, //valueF Wireless
        '0x320F0x827A': RGBGradients_Default, //valueF

        '0x12CF0x0491': RGBGradients_Default, // RGB valueJ

        '0x24420x2682': RGBGradients_Default, // temporary valueB
        '0x24420x0056': RGBGradients_Default, // temporary valueB Wireless
        '0x24420x0052': RGBGradients_Default, // temporary valueB 65%
        '0x24420x0054': RGBGradients_Default, // temporary valueB 65% Wireless
        '0x24420x0053': RGBGradients_Default, // temporary valueB 75%
        '0x24420x0055': RGBGradients_Default, // temporary valueB 75% Wireless
    }),
);

const DeviceProductColors = new Map(
    Object.entries({
        '0x320F0x5044': ProductColors_BlackAndWhite, // GMMK PRO
        '0x320F0x5092': ProductColors_BlackAndWhite, // GMMK PRO
        '0x320F0x5046': ProductColors_BlackAndWhite, // GMMK PRO ISO
        '0x320F0x5093': ProductColors_BlackAndWhite, // GMMK PRO ISO
        '0x320F0x504A': ProductColors_BlackWhitePink, // GMMK v2 65 ISO
        '0x320F0x5045': ProductColors_BlackWhitePink, // GMMK v2 65 US
        '0x320F0x505A': ProductColors_BlackWhitePink, // GMMK v2 96 ISO
        '0x320F0x504B': ProductColors_BlackWhitePink, // GMMK v2 96 US
        '0x320F0x5088': ProductColors_BlackAndWhite, // GMMK Numpad

        '0x342D0xE3C5': ProductColors_BlackAndWhite, // valueB
        '0x342D0xE3CE': ProductColors_BlackAndWhite, // valueBISO
        '0x342D0xE3CB': ProductColors_BlackAndWhite, // valueBWireless
        '0x342D0xE3D4': ProductColors_BlackAndWhite, // valueBWirelessISO
        '0x342D0xE3C7': ProductColors_BlackAndWhite, // valueB65
        '0x342D0xE3D0': ProductColors_BlackAndWhite, // valueB65ISO
        '0x342D0xE3CD': ProductColors_BlackAndWhite, // valueB65Wireless
        '0x342D0xE3D6': ProductColors_BlackAndWhite, // valueB65WirelessISO
        '0x342D0xE3C6': ProductColors_BlackAndWhite, // valueB75
        '0x342D0xE3CF': ProductColors_BlackAndWhite, // valueB75ISO
        '0x342D0xE3CC': ProductColors_BlackAndWhite, // valueB75Wireless
        '0x342D0xE3D5': ProductColors_BlackAndWhite, // valueB75WirelessISO
        '0x342D0xE3C8': ProductColors_BlackAndWhite, // valueD100
        '0x342D0xE3D1': ProductColors_BlackAndWhite, // valueD100ISO
        '0x342D0xE3C9': ProductColors_BlackAndWhite, // valueD75
        '0x342D0xE3D2': ProductColors_BlackAndWhite, // valueD75ISO
        '0x342D0xE3CA': ProductColors_BlackAndWhite, // valueD65
        '0x342D0xE3D3': ProductColors_BlackAndWhite, // valueD65ISO

        '0x342D0xE3D7': ProductColors_BlackAndWhite, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': ProductColors_BlackAndWhite, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': ProductColors_BlackAndWhite, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': ProductColors_BlackAndWhite, // valueC 65% Wireless ISO
        '0x342D0xE3ED': ProductColors_BlackAndWhite, // valueC 75% Wireless ISO
        '0x342D0xE3EE': ProductColors_BlackAndWhite, // valueC 100% Wireless ISO

        '0x342D0xE3DA': ProductColors_BlackAndWhite, // valueC 65% ANSI
        '0x342D0xE3DB': ProductColors_BlackAndWhite, // valueC 75% ANSI
        '0x342D0xE3DC': ProductColors_BlackAndWhite, // valueC 100% ANSI
        '0x342D0xE3EF': ProductColors_BlackAndWhite, // valueC 65% ISO
        '0x342D0xE3F0': ProductColors_BlackAndWhite, // valueC 75% ISO
        '0x342D0xE3F1': ProductColors_BlackAndWhite, // valueC 100% ISO

        '0x342D0xE3DD': ProductColors_BlackAndWhite, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': ProductColors_BlackAndWhite, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': ProductColors_BlackAndWhite, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': ProductColors_BlackAndWhite, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': ProductColors_BlackAndWhite, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': ProductColors_BlackAndWhite, // valueA valueD HE 100% ISO

        '0x320F0x8888': ProductColors_BlackAndWhite, // Model O Wired
        '0x258A0x2011': ProductColors_BlackAndWhite, // Model O Wireless
        '0x258A0x2036': ProductColors_BlackAndWhite, // Model O Minus Wired
        '0x258A0x2013': ProductColors_BlackAndWhite, // Model O Minus Wireless
        '0x258A0x2015': ProductColors_ModelOProEditions, // Model O Pro Wireless
        '0x320F0x823A': ProductColors_BlackAndWhite, // Model O2 Wired
        '0x093A0x822A': ProductColors_BlackAndWhite, // Model O2 Wireless
        '0x258A0x2019': ProductColors_Black, // Model O2 Pro 1k
        '0x258A0x201B': ProductColors_Black, // Model O2 Pro 8k
        '0x258A0x2012': ProductColors_BlackAndWhite, // Model D Wireless
        '0x258A0x2014': ProductColors_BlackAndWhite, // Model D Minus Wireless
        '0x258A0x2017': ProductColors_ModelDProEditions, // Model D Pro Wireless
        '0x258A0x201A': ProductColors_Black, // Model D 2 Pro 1k
        '0x258A0x201C': ProductColors_Black, // Model D 2 Pro 8k
        '0x22D40x1503': ProductColors_BlackAndWhite, // Model I
        '0x093A0x821A': ProductColors_BlackAndWhite, // Model I2
        '0x320F0x831A': ProductColors_BlackAndWhite, // Model valueG
        '0x320F0x825A': ProductColors_BlackAndWhite, // Model D2 Wired
        '0x093A0x824A': ProductColors_BlackAndWhite, // Model D2 Wireless
        '0x258A0x2018': ProductColors_SeriesOneProEditions, // Series One Pro Wireless
        '0x258A0x201D': ProductColors_BlackAndWhite, //valueH Pro (8k wireless)
        '0x093A0x826A': ProductColors_BlackAndWhite, //valueF Wireless
        '0x320F0x827A': ProductColors_BlackAndWhite, //valueF

        '0x12CF0x0491': ProductColors_Default, // RGB valueJ

        '0x24420x2682': ProductColors_BlackAndWhite, // temporary valueB
        '0x24420x0056': ProductColors_BlackAndWhite, // temporary valueB Wireless
        '0x24420x0052': ProductColors_BlackAndWhite, // temporary valueB 65%
        '0x24420x0054': ProductColors_BlackAndWhite, // temporary valueB 65% Wireless
        '0x24420x0053': ProductColors_BlackAndWhite, // temporary valueB 75%
        '0x24420x0055': ProductColors_BlackAndWhite, // temporary valueB 75% Wireless
    }),
);

const DeviceKeybindingLayers = new Map(
    Object.entries({
        '0x320F0x5044': KeybindingLayers_Keyboard, // GMMK PRO
        '0x320F0x5092': KeybindingLayers_Keyboard, // GMMK PRO
        '0x320F0x5046': KeybindingLayers_Keyboard, // GMMK PRO ISO
        '0x320F0x5093': KeybindingLayers_Keyboard, // GMMK PRO ISO
        '0x320F0x504A': KeybindingLayers_Keyboard, // GMMK v2 65 ISO
        '0x320F0x5045': KeybindingLayers_Keyboard, // GMMK v2 65 US
        '0x320F0x505A': KeybindingLayers_Keyboard, // GMMK v2 96 ISO
        '0x320F0x504B': KeybindingLayers_Keyboard, // GMMK v2 96 US
        '0x320F0x5088': KeybindingLayers_Keyboard, // GMMK Numpad

        '0x342D0xE3C5': KeybindingLayers_Keyboard, // valueB
        '0x342D0xE3CE': KeybindingLayers_Keyboard, // valueBISO
        '0x342D0xE3CB': KeybindingLayers_Keyboard, // valueBWireless
        '0x342D0xE3D4': KeybindingLayers_Keyboard, // valueBWirelessISO
        '0x342D0xE3C7': KeybindingLayers_Keyboard, // valueB65
        '0x342D0xE3D0': KeybindingLayers_Keyboard, // valueB65ISO
        '0x342D0xE3CD': KeybindingLayers_Keyboard, // valueB65Wireless
        '0x342D0xE3D6': KeybindingLayers_Keyboard, // valueB65WirelessISO
        '0x342D0xE3C6': KeybindingLayers_Keyboard, // valueB75
        '0x342D0xE3CF': KeybindingLayers_Keyboard, // valueB75ISO
        '0x342D0xE3CC': KeybindingLayers_Keyboard, // valueB75Wireless
        '0x342D0xE3D5': KeybindingLayers_Keyboard, // valueB75WirelessISO
        '0x342D0xE3C8': KeybindingLayers_Keyboard, // valueD100
        '0x342D0xE3D1': KeybindingLayers_Keyboard, // valueD100ISO
        '0x342D0xE3C9': KeybindingLayers_Keyboard, // valueD75
        '0x342D0xE3D2': KeybindingLayers_Keyboard, // valueD75ISO
        '0x342D0xE3CA': KeybindingLayers_Keyboard, // valueD65
        '0x342D0xE3D3': KeybindingLayers_Keyboard, // valueD65ISO

        '0x342D0xE3D7': KeybindingLayers_Keyboard, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': KeybindingLayers_Keyboard, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': KeybindingLayers_Keyboard, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': KeybindingLayers_Keyboard, // valueC 65% Wireless ISO
        '0x342D0xE3ED': KeybindingLayers_Keyboard, // valueC 75% Wireless ISO
        '0x342D0xE3EE': KeybindingLayers_Keyboard, // valueC 100% Wireless ISO

        '0x342D0xE3DA': KeybindingLayers_Keyboard, // valueC 65% ANSI
        '0x342D0xE3DB': KeybindingLayers_Keyboard, // valueC 75% ANSI
        '0x342D0xE3DC': KeybindingLayers_Keyboard, // valueC 100% ANSI
        '0x342D0xE3EF': KeybindingLayers_Keyboard, // valueC 65% ISO
        '0x342D0xE3F0': KeybindingLayers_Keyboard, // valueC 75% ISO
        '0x342D0xE3F1': KeybindingLayers_Keyboard, // valueC 100% ISO

        '0x342D0xE3DD': KeybindingLayers_Keyboard, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': KeybindingLayers_Keyboard, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': KeybindingLayers_Keyboard, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': KeybindingLayers_Keyboard, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': KeybindingLayers_Keyboard, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': KeybindingLayers_Keyboard, // valueA valueD HE 100% ISO

        '0x320F0x8888': KeybindingLayers_SingleLayer, // Model O Wired
        '0x258A0x2011': KeybindingLayers_SingleLayer, // Model O Wireless
        '0x258A0x2036': KeybindingLayers_SingleLayer, // Model O Minus Wired
        '0x258A0x2013': KeybindingLayers_SingleLayer, // Model O Minus Wireless
        '0x258A0x2015': KeybindingLayers_SingleLayer, // Model O Pro Wireless
        '0x320F0x823A': KeybindingLayers_SingleLayer, // Model O2 Wired
        '0x093A0x822A': KeybindingLayers_SingleLayer, // Model O2 Wireless
        '0x258A0x2019': KeybindingLayers_SingleLayer, // Model O2 Pro 1k
        '0x258A0x201B': KeybindingLayers_SingleLayer, // Model O 2 Pro 8k
        '0x258A0x2012': KeybindingLayers_SingleLayer, // Model D Wireless
        '0x258A0x2014': KeybindingLayers_SingleLayer, // Model D Minus Wireless
        '0x258A0x2017': KeybindingLayers_SingleLayer, // Model D Pro Wireless
        '0x258A0x201A': KeybindingLayers_SingleLayer, // Model D 2 Pro 1k
        '0x258A0x201C': KeybindingLayers_SingleLayer, // Model D 2 Pro 8k
        '0x22D40x1503': KeybindingLayers_ShiftLayer, // Model I
        '0x093A0x821A': KeybindingLayers_ShiftLayer, // Model I2
        '0x320F0x831A': KeybindingLayers_ShiftLayer, // Model valueG
        '0x320F0x825A': KeybindingLayers_SingleLayer, // Model D2 Wired
        '0x093A0x824A': KeybindingLayers_SingleLayer, // Model D2 Wireless
        '0x258A0x2018': KeybindingLayers_SingleLayer, // Series One Pro Wireless
        '0x258A0x201D': KeybindingLayers_SingleLayer, //valueH Pro (8k wireless)
        '0x093A0x826A': KeybindingLayers_SingleLayer, //valueF Wireless
        '0x320F0x827A': KeybindingLayers_SingleLayer, //valueF

        '0x24420x2682': KeybindingLayers_Keyboard, // temporary valueB
        '0x24420x0056': KeybindingLayers_Keyboard, // temporary valueB Wireless
        '0x24420x0052': KeybindingLayers_Keyboard, // temporary valueB 65%
        '0x24420x0054': KeybindingLayers_Keyboard, // temporary valueB 65% Wireless
        '0x24420x0053': KeybindingLayers_Keyboard, // temporary valueB 75%
        '0x24420x0055': KeybindingLayers_Keyboard, // temporary valueB 75% Wireless
    }),
);

const DeviceIconsMap = new Map(
    Object.entries({
        '0x320F0x5044': IconType.GMMKPRODevice, // GMMK PRO
        '0x320F0x5092': IconType.GMMKPRODevice, // GMMK PRO
        '0x320F0x5046': IconType.GMMKPRODevice, // GMMK PRO ISO
        '0x320F0x5093': IconType.GMMKPRODevice, // GMMK PRO ISO
        '0x320F0x504A': IconType.GMMK265Device, // GMMK v2 65 ISO
        '0x320F0x5045': IconType.GMMK265Device, // GMMK v2 65 US
        '0x320F0x505A': IconType.GMMK296Device, // GMMK v2 96 ISO
        '0x320F0x504B': IconType.GMMK296Device, // GMMK v2 96 US
        '0x320F0x5088': IconType.NumpadDevice, // GMMK Numpad

        '0x342D0xE3C5': IconType.GMMK296Device, // valueB
        '0x342D0xE3CE': IconType.GMMK296Device, // valueBISO
        '0x342D0xE3CB': IconType.GMMK296Device, // valueBWireless
        '0x342D0xE3D4': IconType.GMMK296Device, // valueBWirelessISO
        '0x342D0xE3C7': IconType.GMMK265Device, // valueB65
        '0x342D0xE3D0': IconType.GMMK265Device, // valueB65ISO
        '0x342D0xE3CD': IconType.GMMK265Device, // valueB65Wireless
        '0x342D0xE3D6': IconType.GMMK265Device, // valueB65WirelessISO
        '0x342D0xE3C6': IconType.GMMK265Device, // valueB75
        '0x342D0xE3CF': IconType.GMMK265Device, // valueB75ISO
        '0x342D0xE3CC': IconType.GMMK265Device, // valueB75Wireless
        '0x342D0xE3D5': IconType.GMMK265Device, // valueB75WirelessISO
        '0x342D0xE3C8': IconType.GMMK296Device, // valueD100
        '0x342D0xE3D1': IconType.GMMK296Device, // valueD100ISO
        '0x342D0xE3C9': IconType.GMMK265Device, // valueD75
        '0x342D0xE3D2': IconType.GMMK265Device, // valueD75ISO
        '0x342D0xE3CA': IconType.GMMK265Device, // valueD65
        '0x342D0xE3D3': IconType.GMMK265Device, // valueD65ISO

        '0x342D0xE3DD': IconType.GMMK265Device, //valueA valueD HE 65% ANSI TEMP
        '0x342D0xE3F2': IconType.GMMK265Device, //valueA valueD HE 65% ISO TEMP
        '0x342D0xE3DE': IconType.GMMK265Device, //valueA valueD HE 75% ANSI TEMP
        '0x342D0xE3F3': IconType.GMMK265Device, //valueA valueD HE 75% ISO TEMP
        '0x342D0xE3DF': IconType.GMMK296Device, //valueA valueD HE 100% ANSI TEMP
        '0x342D0xE3F4': IconType.GMMK296Device, //valueA valueD HE 100% ISO TEMP

        '0x31510x4035': IconType.GMMK296Device, // valueC Pre

        '0x342D0xE3D7': IconType.GMMK296Device, // valueC 65% Wireless ANSI TEMP
        '0x342D0xE3D8': IconType.GMMK296Device, // valueC 75% Wireless ANSI TEMP
        '0x342D0xE3D9': IconType.GMMK296Device, // valueC 100% Wireless ANSI TEMP
        '0x342D0xE3DA': IconType.GMMK265Device, // valueC 65% ANSI TEMP
        '0x342D0xE3DB': IconType.GMMK296Device, // valueC 75% ANSI TEMP
        '0x342D0xE3DC': IconType.GMMK296Device, // valueC 100% ANSI TEMP
        '0x342D0xE3EC': IconType.GMMK265Device, // valueC 65% Wireless ISO TEMP
        '0x342D0xE3ED': IconType.GMMK296Device, // valueC 75% Wireless ISO TEMP
        '0x342D0xE3EE': IconType.GMMK296Device, // valueC 100% Wireless ISO TEMP
        '0x342D0xE3EF': IconType.GMMK265Device, // valueC 65% ISO TEMP
        '0x342D0xE3F0': IconType.GMMK296Device, // valueC 75% ISO TEMP
        '0x342D0xE3F1': IconType.GMMK296Device, // valueC 100% ISO TEMP

        '0x320F0x8888': IconType.ModelODevice, // Model O Wired
        '0x258A0x2011': IconType.ModelODevice, // Model O Wireless
        '0x258A0x2036': IconType.ModelODevice, // Model O Minus Wired
        '0x258A0x2013': IconType.ModelODevice, // Model O Minus Wireless
        '0x258A0x2015': IconType.ModelODevice, // Model O Pro Wireless
        '0x320F0x823A': IconType.ModelODevice, // Model O2 Wired
        '0x093A0x822A': IconType.ModelODevice, // Model O2 Wireless
        '0x258A0x2019': IconType.ModelODevice, // Model O2 Pro 1k
        '0x258A0x201B': IconType.ModelODevice, // Model O 2 Pro 8k
        '0x258A0x2018': IconType.ModelODevice, // Series One Pro Wireless
        '0x258A0x201D': IconType.ModelODevice, //valueH Pro (8k wireless)
        '0x093A0x826A': IconType.ModelODevice, //valueF Wireless
        '0x320F0x827A': IconType.ModelODevice, //valueF

        '0x258A0x2012': IconType.ModelDDevice, // Model D Wireless
        '0x258A0x2014': IconType.ModelDDevice, // Model D Minus Wireless
        '0x258A0x2017': IconType.ModelDDevice, // Model D Pro Wireless
        '0x258A0x201A': IconType.ModelDDevice, // Model D 2 Pro 1k
        '0x258A0x201C': IconType.ModelDDevice, // Model D 2 Pro 8k
        '0x320F0x825A': IconType.ModelDDevice, // Model D2 Wired
        '0x093A0x824A': IconType.ModelDDevice, // Model D2 Wireless

        '0x22D40x1503': IconType.ModelIDevice, // Model I
        '0x093A0x821A': IconType.ModelIDevice, // Model I2
        '0x320F0x831A': IconType.ModelIDevice, // Model valueG

        '0x24420x2682': IconType.GMMK296Device, // temporary valueB
        '0x24420x0056': IconType.GMMK296Device, // temporary valueB Wireless
        '0x24420x0052': IconType.GMMK265Device, // temporary valueB 65%
        '0x24420x0054': IconType.GMMK265Device, // temporary valueB 65% Wireless
        '0x24420x0053': IconType.GMMK265Device, // temporary valueB 75%
        '0x24420x0055': IconType.GMMK265Device, // temporary valueB 75% Wireless
    }),
);

const DeviceManagementSections = new Map(
    Object.entries({
        '0x320F0x5044': DeviceManagementSections_Keyboard, // GMMK PRO
        '0x320F0x5092': DeviceManagementSections_Keyboard, // GMMK PRO
        '0x320F0x5046': DeviceManagementSections_Keyboard, // GMMK PRO ISO
        '0x320F0x5093': DeviceManagementSections_Keyboard, // GMMK PRO ISO
        '0x320F0x504A': DeviceManagementSections_Keyboard, // GMMK v2 65 ISO
        '0x320F0x5045': DeviceManagementSections_Keyboard, // GMMK v2 65 US
        '0x320F0x505A': DeviceManagementSections_Keyboard, // GMMK v2 96 ISO
        '0x320F0x504B': DeviceManagementSections_Keyboard, // GMMK v2 96 US
        '0x320F0x5088': DeviceManagementSections_Keyboard, // GMMK Numpad

        '0x342D0xE3C5': DeviceManagementSections_Keyboard, // valueB
        '0x342D0xE3CE': DeviceManagementSections_Keyboard, // valueBISO
        '0x342D0xE3CB': DeviceManagementSections_Keyboard, // valueBWireless
        '0x342D0xE3D4': DeviceManagementSections_Keyboard, // valueBWirelessISO
        '0x342D0xE3C7': DeviceManagementSections_Keyboard, // valueB65
        '0x342D0xE3D0': DeviceManagementSections_Keyboard, // valueB65ISO
        '0x342D0xE3CD': DeviceManagementSections_Keyboard, // valueB65Wireless
        '0x342D0xE3D6': DeviceManagementSections_Keyboard, // valueB65WirelessISO
        '0x342D0xE3C6': DeviceManagementSections_Keyboard, // valueB75
        '0x342D0xE3CF': DeviceManagementSections_Keyboard, // valueB75ISO
        '0x342D0xE3CC': DeviceManagementSections_Keyboard, // valueB75Wireless
        '0x342D0xE3D5': DeviceManagementSections_Keyboard, // valueB75WirelessISO
        '0x342D0xE3C8': DeviceManagementSections_Keyboard, // valueD100
        '0x342D0xE3D1': DeviceManagementSections_Keyboard, // valueD100ISO
        '0x342D0xE3C9': DeviceManagementSections_Keyboard, // valueD75
        '0x342D0xE3D2': DeviceManagementSections_Keyboard, // valueD75ISO
        '0x342D0xE3CA': DeviceManagementSections_Keyboard, // valueD65
        '0x342D0xE3D3': DeviceManagementSections_Keyboard, // valueD65ISO

        '0x342D0xE3D7': DeviceManagementSections_AnalogKeyboard, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': DeviceManagementSections_AnalogKeyboard, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': DeviceManagementSections_AnalogKeyboard, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': DeviceManagementSections_AnalogKeyboard, // valueC 65% Wireless ISO
        '0x342D0xE3ED': DeviceManagementSections_AnalogKeyboard, // valueC 75% Wireless ISO
        '0x342D0xE3EE': DeviceManagementSections_AnalogKeyboard, // valueC 100% Wireless ISO

        '0x342D0xE3DA': DeviceManagementSections_AnalogKeyboard, // valueC 65% ANSI
        '0x342D0xE3DB': DeviceManagementSections_AnalogKeyboard, // valueC 75% ANSI
        '0x342D0xE3DC': DeviceManagementSections_AnalogKeyboard, // valueC 100% ANSI
        '0x342D0xE3EF': DeviceManagementSections_AnalogKeyboard, // valueC 65% ISO
        '0x342D0xE3F0': DeviceManagementSections_AnalogKeyboard, // valueC 75% ISO
        '0x342D0xE3F1': DeviceManagementSections_AnalogKeyboard, // valueC 100% ISO

        '0x342D0xE3DD': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': DeviceManagementSections_AnalogKeyboard, // valueA valueD HE 100% ISO

        '0x320F0x8888': DeviceManagementSections_Mouse, // Model O Wired
        '0x258A0x2011': DeviceManagementSections_Mouse, // Model O Wireless
        '0x258A0x2036': DeviceManagementSections_Mouse, // Model O Minus Wired
        '0x258A0x2013': DeviceManagementSections_Mouse, // Model O Minus Wireless
        '0x258A0x2015': DeviceManagementSections_Mouse_Unlit, // Model O Pro Wireless
        '0x320F0x823A': DeviceManagementSections_Mouse, // Model O2 Wired
        '0x093A0x822A': DeviceManagementSections_Mouse, // Model O2 Wireless
        '0x258A0x2019': DeviceManagementSections_Mouse_Unlit, // Model O2 Pro 1k
        '0x258A0x201B': DeviceManagementSections_Mouse_Unlit, // Model O 2 Pro 8k
        '0x258A0x2012': DeviceManagementSections_Mouse, // Model D Wireless
        '0x258A0x2014': DeviceManagementSections_Mouse, // Model D Minus Wireless
        '0x258A0x2017': DeviceManagementSections_Mouse_Unlit, // Model D Pro Wireless
        '0x258A0x201A': DeviceManagementSections_Mouse_Unlit, // Model D 2 Pro 1k
        '0x258A0x201C': DeviceManagementSections_Mouse_Unlit, // Model D 2 Pro 8k
        '0x22D40x1503': DeviceManagementSections_Mouse, // Model I
        '0x093A0x821A': DeviceManagementSections_Mouse, // Model I2
        '0x320F0x831A': DeviceManagementSections_Mouse, // Model valueG
        '0x320F0x825A': DeviceManagementSections_Mouse, // Model D2 Wired
        '0x093A0x824A': DeviceManagementSections_Mouse, // Model D2 Wireless
        '0x258A0x2018': DeviceManagementSections_Mouse_Unlit, // Series One Pro Wireless
        '0x258A0x201D': DeviceManagementSections_Mouse_Unlit, //valueH Pro (8k wireless)
        '0x093A0x826A': DeviceManagementSections_Mouse, //valueF Wireless
        '0x320F0x827A': DeviceManagementSections_Mouse, //valueF

        '0x12CF0x0491': DeviceManagementSections_valueJ, // RGB valueJ

        '0x24420x2682': DeviceManagementSections_Keyboard, // temporary valueB
        '0x24420x0056': DeviceManagementSections_Keyboard, // temporary valueB Wireless
        '0x24420x0052': DeviceManagementSections_Keyboard, // temporary valueB 65%
        '0x24420x0054': DeviceManagementSections_Keyboard, // temporary valueB 65% Wireless
        '0x24420x0053': DeviceManagementSections_Keyboard, // temporary valueB 75%
        '0x24420x0055': DeviceManagementSections_Keyboard, // temporary valueB 75% Wireless
    }),
);

const DeviceLightingMaskRequirements = new Map(
    Object.entries({
        // rectangular devices don't typically need masks
        // "0x320F0x5044": false, // GMMK PRO
        // "0x320F0x5092": false, // GMMK PRO
        // "0x320F0x5046": false, // GMMK PRO ISO
        // "0x320F0x5093": false, // GMMK PRO ISO
        // "0x320F0x504A": false, // GMMK v2 65 ISO
        // "0x320F0x5045": false, // GMMK v2 65 US
        // "0x320F0x505A": false, // GMMK v2 96 ISO
        // "0x320F0x504B": false, // GMMK v2 96 US
        // "0x320F0x5088": false, // GMMK Numpad

        '0x320F0x8888': true, // Model O Wired
        '0x258A0x2011': true, // Model O Wireless
        '0x258A0x2036': true, // Model O Minus Wired
        '0x258A0x2013': true, // Model O Minus Wireless
        '0x258A0x2015': false, // Model O Pro Wireless
        '0x320F0x823A': true, // Model O2 Wired
        '0x093A0x822A': true, // Model O2 Wireless
        '0x258A0x2019': false, // Model O2 Pro 1k
        '0x258A0x201B': false, // Model O 2 Pro 8k
        '0x258A0x2012': true, // Model D Wireless
        '0x258A0x2014': true, // Model D Minus Wireless
        '0x258A0x2017': false, // Model D Pro Wireless
        '0x258A0x201A': false, // Model D 2 Pro 1k
        '0x258A0x201C': false, // Model D 2 Pro 8k
        '0x22D40x1503': true, // Model I
        '0x093A0x821A': true, // Model I2
        '0x320F0x831A': true, // Model valueG
        '0x320F0x825A': true, // Model D2 Wired
        '0x093A0x824A': true, // Model D2 Wireless
        '0x258A0x2018': false, // Series One Pro Wireless
        '0x258A0x201D': false, //valueH Pro (8k wireless)
        '0x093A0x826A': true, //valueF Wireless
        '0x320F0x827A': true, //valueF
    }),
);

const DeviceImageAdjustments = new Map(
    Object.entries({
        '0x320F0x5044': new DeviceImageAdjustment(0.6, { x: 0, y: 0 }), // GMMK PRO
        '0x320F0x5092': new DeviceImageAdjustment(0.6, { x: 0, y: 0 }), // GMMK PRO
        '0x320F0x5046': new DeviceImageAdjustment(0.6, { x: 0, y: 0 }), // GMMK PRO ISO
        '0x320F0x5093': new DeviceImageAdjustment(0.6, { x: 0, y: 0 }), // GMMK PRO ISO
        '0x320F0x504A': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // GMMK v2 65 ISO
        '0x320F0x5045': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // GMMK v2 65 US
        '0x320F0x505A': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // GMMK v2 96 ISO
        '0x320F0x504B': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // GMMK v2 96 US
        '0x320F0x5088': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // GMMK Numpad

        '0x342D0xE3C5': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB
        '0x342D0xE3CE': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueBISO
        '0x342D0xE3CB': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueBWireless
        '0x342D0xE3D4': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueBWirelessISO
        '0x342D0xE3C7': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB65
        '0x342D0xE3D0': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB65ISO
        '0x342D0xE3CD': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB65Wireless
        '0x342D0xE3D6': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB65WirelessISO
        '0x342D0xE3C6': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB75
        '0x342D0xE3CF': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB75ISO
        '0x342D0xE3CC': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB75Wireless
        '0x342D0xE3D5': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueB75WirelessISO
        '0x342D0xE3C8': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD100
        '0x342D0xE3D1': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD100ISO
        '0x342D0xE3C9': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD75
        '0x342D0xE3D2': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD75ISO
        '0x342D0xE3CA': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD65
        '0x342D0xE3D3': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueD65ISO

        '0x342D0xE3D7': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 65% Wireless ANSI
        '0x342D0xE3D8': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 75% Wireless ANSI
        '0x342D0xE3D9': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 100% Wireless ANSI
        '0x342D0xE3EC': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 65% Wireless ISO
        '0x342D0xE3ED': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 75% Wireless ISO
        '0x342D0xE3EE': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 100% Wireless ISO

        '0x342D0xE3DA': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 65% ANSI
        '0x342D0xE3DB': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 75% ANSI
        '0x342D0xE3DC': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 100% ANSI
        '0x342D0xE3EF': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 65% ISO
        '0x342D0xE3F0': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 75% ISO
        '0x342D0xE3F1': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // valueC 100% ISO

        '0x342D0xE3DD': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 65% ISO
        '0x342D0xE3DE': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 75% ISO
        '0x342D0xE3DF': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // valueA valueD HE 100% ISO

        '0x320F0x8888': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O Wired
        '0x258A0x2011': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O Wireless
        '0x258A0x2036': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O Minus Wired
        '0x258A0x2013': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O Minus Wireless
        '0x258A0x2015': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O Pro Wireless
        '0x320F0x823A': new DeviceImageAdjustment(0.4, { x: 0, y: 0 }), // Model O2 Wired
        '0x093A0x822A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O2 Wireless
        '0x258A0x2019': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O2 Pro 1k
        '0x258A0x201B': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model O 2 Pro 8k
        '0x258A0x2012': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D Wireless
        '0x258A0x2014': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D Minus Wireless
        '0x258A0x2017': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D Pro Wireless
        '0x258A0x201A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D 2 Pro 1k
        '0x258A0x201C': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D 2 Pro 8k
        '0x22D40x1503': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model I
        '0x093A0x821A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model I2
        '0x320F0x831A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model valueG
        '0x320F0x825A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D2 Wired
        '0x093A0x824A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Model D2 Wireless
        '0x258A0x2018': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), // Series One Pro Wireless
        '0x258A0x201D': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), //valueH Pro (8k wireless)
        '0x093A0x826A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), //valueF Wireless
        '0x320F0x827A': new DeviceImageAdjustment(0.5, { x: 0, y: 0 }), //valueF

        '0x12CF0x0491': new DeviceImageAdjustment(0.4, { x: 0, y: 0 }), // RGB valueJ

        '0x24420x2682': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB
        '0x24420x0056': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB Wireless
        '0x24420x0052': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB 65%
        '0x24420x0054': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB 65% Wireless
        '0x24420x0053': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB 75%
        '0x24420x0055': new DeviceImageAdjustment(0.7, { x: 0, y: 0 }), // temporary valueB 75% Wireless
    }),
);

export const DevicePairableDevices = new Map(
    Object.entries({
        '0x320F0x5044': [], // GMMK PRO
        '0x320F0x5092': [], // GMMK PRO
        '0x320F0x5046': [], // GMMK PRO ISO
        '0x320F0x5093': [], // GMMK PRO ISO
        '0x320F0x504A': [], // GMMK v2 65 ISO
        '0x320F0x5045': [], // GMMK v2 65 US
        '0x320F0x505A': [], // GMMK v2 96 ISO
        '0x320F0x504B': [], // GMMK v2 96 US
        '0x320F0x5088': [], // GMMK Numpad

        '0x342D0xE3C5': [], // valueB
        '0x342D0xE3CE': [], // valueBISO
        '0x342D0xE3CB': [], // valueBWireless
        '0x342D0xE3D4': [], // valueBWirelessISO
        '0x342D0xE3C7': [], // valueB65
        '0x342D0xE3D0': [], // valueB65ISO
        '0x342D0xE3CD': [], // valueB65Wireless
        '0x342D0xE3D6': [], // valueB65WirelessISO
        '0x342D0xE3C6': [], // valueB75
        '0x342D0xE3CF': [], // valueB75ISO
        '0x342D0xE3CC': [], // valueB75Wireless
        '0x342D0xE3D5': [], // valueB75WirelessISO
        '0x342D0xE3C8': [], // valueD100
        '0x342D0xE3D1': [], // valueD100ISO
        '0x342D0xE3C9': [], // valueD75
        '0x342D0xE3D2': [], // valueD75ISO
        '0x342D0xE3CA': [], // valueD65
        '0x342D0xE3D3': [], // valueD65ISO

        '0x342D0xE3D7': [], // valueC 65% Wireless ANSI
        '0x342D0xE3D8': [], // valueC 75% Wireless ANSI
        '0x342D0xE3D9': [], // valueC 100% Wireless ANSI
        '0x342D0xE3EC': [], // valueC 65% Wireless ISO
        '0x342D0xE3ED': [], // valueC 75% Wireless ISO
        '0x342D0xE3EE': [], // valueC 100% Wireless ISO

        '0x342D0xE3DA': [], // valueC 65% ANSI
        '0x342D0xE3DB': [], // valueC 75% ANSI
        '0x342D0xE3DC': [], // valueC 100% ANSI
        '0x342D0xE3EF': [], // valueC 65% ISO
        '0x342D0xE3F0': [], // valueC 75% ISO
        '0x342D0xE3F1': [], // valueC 100% ISO

        '0x342D0xE3DD': [], // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': [], // valueA valueD HE 65% ISO
        '0x342D0xE3DE': [], // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': [], // valueA valueD HE 75% ISO
        '0x342D0xE3DF': [], // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': [], // valueA valueD HE 100% ISO

        '0x320F0x8888': [], // Model O Wired
        '0x258A0x2011': [], // Model O Wireless
        '0x258A0x2036': [], // Model O Minus Wired
        '0x258A0x2013': [], // Model O Minus Wireless
        '0x258A0x2015': [], // Model O Pro Wireless
        '0x320F0x823A': [], // Model O2 Wired
        '0x093A0x822A': ['dongle kit v2'], // Model O2 Wireless
        '0x258A0x2019': ['dongle kit v2'], // Model O2 Pro 1k
        '0x258A0x201B': ['dongle kit v2 8k'], // Model O 2 Pro 8k
        '0x258A0x2012': [], // Model D Wireless
        '0x258A0x2014': [], // Model D Minus Wireless
        '0x258A0x2017': [], // Model D Pro Wireless
        '0x258A0x201A': ['dongle kit v2'], // Model D 2 Pro 1k
        '0x258A0x201C': ['dongle kit v2 8k'], // Model D 2 Pro 8k
        '0x22D40x1503': [], // Model I
        '0x093A0x821A': ['dongle kit v2'], // Model I2
        '0x320F0x825A': [], // Model D2 Wired
        '0x093A0x824A': ['dongle kit v2'], // Model D2 Wireless
        '0x258A0x2018': [], // Series One Pro Wireless
        '0x258A0x201D': ['dongle kit v2 8k'], //valueH Pro (8k wireless)
        '0x093A0x826A': ['dongle kit v2'], //valueF Wireless
        '0x320F0x827A': [], //valueF

        '0x24420x2682': [], // temporarry valueB
        '0x24420x0056': [], // temporarry valueB Wireless
        '0x24420x0052': [], // temporarry valueB 65%
        '0x24420x0054': [], // temporarry valueB 65% Wireless
        '0x24420x0053': [], // temporarry valueB 75%
        '0x24420x0055': [], // temporarry valueB 75% Wireless
    }),
); // todo: get dongle kit SNs

const AdvDebounceDevices: string[] = [
    '0x258A0x2019', // Model O 2 Pro 1k
    '0x258A0x201A', // Model D 2 Pro 1k
    '0x258A0x201B', // Model O 2 Pro 4k8k
    '0x258A0x201C', // Model D 2 Pro 4k8k
    '0x258A0x201D', // valueH Pro
];

const lightingSaveProperties: string[] = [
    'reset',
    'mouse-lighting-color',
    'lighting-effect',
    'wired-brightness',
    'lighting-rate',
    'separate-wired-wireless-brightness',
    'wireless-brightness',
    'keyboard-preset-effect',
    'keyboard-preset-speed',
    'keyboard-preset-brightness',
    'keyboard-perkey-layout',
    'keyboard-per-key-brightness',
    'keyboard-lighting-color',
    'valueJ-zone',
];
const performanceSaveProperties: string[] = [
    'reset',
    'motion-sync',
    'polling-rate',
    'lift-off-distance',
    'debounce-time',
    'dpi-default-stage',
    'dpi-stages',
    'adv-debounce',
    'before-press-time',
    'after-press-time',
    'before-release-time',
    'after-release-time',
    'lift-off-press-time',
    'separate-polling-rate',
];
const keybindingSaveProperties: string[] = [
    'reset',
    'keybind-single-key',
    'keybind-single-key-modifier',
    'keybind-keyboard-function',
    'keybind-mouse-function',
    'keybind-dpi-function',
    'keybind-macro',
    'keybind-multimedia-function',
    'keybind-shortcut-type',
    'keybind-shortcut-value',
    'keybind-disabled',
    'keybind-valueC-state',
];

export class DevicesAdapter {
    static async getDevices() {
        // RGB off after inactivty...
        // this.getAppService.getAppSetting().sleeptime = this.SleepValue;
        // this.getAppService.updateAppsetting();
        // for (let i = 0; i < this.deviceService.pluginDeviceData.length; i++) {
        //     let obj = {
        //         Type: this.funcVar.FuncType.Mouse,
        //         SN: this.deviceService.pluginDeviceData[i].SN,
        //         Func: this.funcVar.FuncName.SleepTime,
        //         Param: {
        //             sleep: this.LightingSleep,
        //             sleeptime: this.SleepValue
        //         }
        //     }
        //     this.protocolService.RunSetFunction(obj).then((data) => { });
        // }

        const devices = await DeviceService.getDevices();
        // console.log(devices, DeviceService.deviceDataForUI);
        if (devices == null || devices.length == 0) {
            console.info('No devices were found connected.');
            return;
        }

        const uiDevices: UIDevice[] = [];
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            uiDevices.push(await DevicesAdapter.appendUIHelperProperties(device));
        }

        return uiDevices;
    }

    static async appendUIHelperProperties(uiDevice: UIDevice) {
        // assign well-known data to device for UI or
        // providing data for controls

        if (uiDevice.deviceData == null) {
            throw new Error('Device data is unassigned');
        }

        let imgKey = uiDevice.deviceData.image.replace(/\s/g, '');
        const deviceCategoryName = DeviceService.getDeviceClassification(uiDevice);
        let profileIndex = isNaN(Number(uiDevice.deviceData.profileindex))
            ? parseInt(uiDevice.deviceData.profileindex as string)
            : Number(uiDevice.deviceData.profileindex);
        if (uiDevice.ModelType == 1) {
            // [dmercer] legacy implementation for mice devices store the profileid
            // property of profileData as the profileindex property on deviceData
            // this is not true for keyboard devices
            profileIndex = profileIndex - 1;
        }
        uiDevice.deviceData.profileindex = profileIndex - 1 < 0 ? 0 : profileIndex;

        console.log(imgKey);
        // debugger;

        const imageTranslations = DeviceImageValueTranslations.get(imgKey)!;
        uiDevice.img = imageTranslations.img;
        uiDevice.lightingViewImages = imageTranslations.lightingViewImages;
        uiDevice.deviceRenderAttributes = new PreloadedImageAttributes();
        uiDevice.lightingEffectRenderAttributes = new Array<ImageAttributes>();
        uiDevice.imageAdjustments = DeviceImageAdjustments.get(uiDevice.SN)!;
        uiDevice.lightingEffects = DeviceLightingEffects.get(uiDevice.SN)!;
        uiDevice.pollingRates = DevicePollingRates.get(uiDevice.SN)!;
        uiDevice.wirelessPollingRates = DeviceWirelessPollingRates.get(uiDevice.SN) ?? [];
        uiDevice.inputLatencies = InputLatencies;
        uiDevice.liftoffDistances = LiftOffDistances;
        uiDevice.standbyTypes = StandbyTypes;
        uiDevice.dpiSections = DeviceDPISections.get(uiDevice.SN)!;
        uiDevice.keybindingLayers = DeviceKeybindingLayers.get(uiDevice.SN)!;
        uiDevice.deviceCategoryName = deviceCategoryName;
        uiDevice.rgbGradients = DeviceRGBGradients.get(uiDevice.SN)!;
        uiDevice.productColors = DeviceProductColors.get(uiDevice.SN)!;
        uiDevice.productScales =
            DevicesAdapter.isvalueB(uiDevice.SN) || DevicesAdapter.isvalueC(uiDevice.SN)
                ? ProductScales_V1
                : ProductScales_Default;
        uiDevice.productColorIndex = 0!;
        // uiDevice.iconPaths = DeviceIconsMap.get(uiDevice.SN)!;
        uiDevice.iconType = DeviceIconsMap.get(uiDevice.SN)!;
        uiDevice.managementSections = DeviceManagementSections.get(uiDevice.SN)!;

        if (deviceCategoryName == 'valueJ') {
        }

        // handle keyboard data
        if (deviceCategoryName == 'Keyboard' || deviceCategoryName == 'Numpad') {
            uiDevice.keyboardData = new KeyboardData(uiDevice.deviceData.profileLayers[0][0].maxKayCapNumber);
            uiDevice.keyboardData.profileindex = uiDevice.deviceData.profileindex;
            uiDevice.keyboardData.profileLayerIndex = uiDevice.deviceData.profileLayerIndex ?? [0, 0, 0];
            uiDevice.keyboardData.sideLightSwitch = uiDevice.deviceData.sideLightSwitch ?? false;

            for (let i = 0; i < uiDevice.deviceData.profileLayers.length; i++) {
                const position = uiDevice.deviceData.profileLayers[i];
                for (let j = 0; j < position.length; j++) {
                    const layer = uiDevice.keyboardData.profileLayers[i][j];
                    layer.ImportClassData(uiDevice.deviceData.profileLayers[i][j]);

                    // uiDevice.deviceData.profileLayers[i][j].light_PERKEY_Layout = layer.light_PERKEY_Layout;
                    // todo: load these from layout DB
                    uiDevice.deviceData.profileLayers[i][j].light_PERKEY_KeyAssignments =
                        layer.light_PERKEY_KeyAssignments;
                }
            }

            for (let index = 0; index < uiDevice.deviceData.profile.length; index++) {
                uiDevice.keyboardData.KeyBoardArray[index].ImportClassData(uiDevice.deviceData.profile[index]);
            }
            // this.setPollingRateSort();
            // if(this.getInputLatencySort()==false){
            //     return;
            // }

            // save lighting; Built_ineffect is singlton; Built_inSelected: ModeParameter
            // //if(this.lightingPage == 'PRESETS'){
            // console.log('%c KB_ProfileImport', 'color:yellow', this.Built_ineffect.Built_inSelected);
            // this.KeyBoardManager.getTarget().light_PRESETS_Data = JSON.parse(JSON.stringify(this.Built_ineffect.Built_inSelected));
            // //}
            // //if(this.lightingPage == 'PERKEY'){
            // this.PerKeyAreaCick(this.PerKeyArea);
            // console.log('%c M_Light_PERKEY.AllBlockColor', 'color:rgb(255,75,255,1)', this.M_Light_PERKEY.AllBlockColor);
            // this.layoutService.updateContentToDB(this.M_Light_PERKEY.AllBlockColor, this.PERKEY_lightData);
            // this.KeyBoardManager.getTarget().light_PERKEY_Data.value = this.layoutService.getFromIdentifier().value;
        }

        uiDevice = await DevicesAdapter.updateImages(uiDevice);

        // console.log(deviceState);

        // const profileData = DeviceService.getDeviceProfile(uiDevice);

        // if(profileData.lighting != null && profileData.lighting.Effect == 0)
        // {
        //     const stops = uiDevice.rgbGradients[0].data.stops;
        //     if(stops == null) { throw new Error("Invalid Gradient Option"); }

        //     const colors: DeviceRecordColorData[] = [];
        //     for(let i = 1; i < stops.length; i++)
        //     {
        //         const color = RGBAColor.fromHex(stops[i].hex);
        //         const colorData = new DeviceRecordColorData(color.r, color.g, color.b, false);
        //         colors.push(colorData);
        //     }

        //     profileData.lighting.Color = colors;
        // }

        // console.log(uiDevice);

        return uiDevice;
    }

    static async updateImages(device: UIDevice) {
        if (device.img == null || device.productColors == null) {
            console.error('Device missing required properties:');
            console.log(device);
            return device;
        }

        //console.log(import.meta.env.PROD, device.img, device.productColors, device.productColorIndex);
        const baseImagePath = `${import.meta.env.PROD ? '.' : ''}/images/devices/${device.img}/${device.productColors[device.productColorIndex].subpath}`;
        const smallImagePath = `${baseImagePath}${device.img}${device.productColors[device.productColorIndex].filenameAdjustment}_Render_Small.png`;
        const largeImagePath = `${baseImagePath}${device.img}${device.productColors[device.productColorIndex].filenameAdjustment}_Render_Large.png`;

        const smallImageAttributes = await ImageAttributes.fromPath(smallImagePath);
        if (smallImageAttributes == null) {
            throw new Error('Small Image Render not found');
        }
        device.deviceRenderAttributes.small = smallImageAttributes;

        const largeImageAttributes = await ImageAttributes.fromPath(largeImagePath);
        if (largeImageAttributes == null) {
            throw new Error('Large Image Render not found');
        }
        device.deviceRenderAttributes.large = largeImageAttributes;

        if (DeviceLightingMaskRequirements.get(device.SN) == true) {
            const maskImagePath = `${baseImagePath}${device.img}${device.productColors[device.productColorIndex].filenameAdjustment}_Mask.png`;
            const maskImageAttributes = await ImageAttributes.fromPath(maskImagePath);

            if (maskImageAttributes != null) {
                device.deviceRenderAttributes.mask = maskImageAttributes;
                // if we don't need a mask, we shouldn't show
                // the canvas that would have been masked out.
                device.showLightingCanvas = true;
            } else {
                console.error(new Error('Mask Image Render not found'));
            }
        }

        if (device.productScales != null) {
            let currentScale = device.productScales[0];
            for (let i = 1; i < device.productScales.length; i++) {
                const scale = device.productScales[i];
                if (window.innerWidth > scale.breakpoint.width || window.innerHeight > scale.breakpoint.height) {
                    currentScale = scale;
                }
            }

            device.deviceRenderAttributes.large.width = currentScale.imageSize.width;
            device.deviceRenderAttributes.large.height = currentScale.imageSize.height;

            if (device.deviceRenderAttributes.mask != null) {
                device.deviceRenderAttributes.mask.width = currentScale.imageSize.width;
                device.deviceRenderAttributes.mask.height = currentScale.imageSize.height;
            }
        }

        device.lightingEffectRenderAttributes = [];
        for (let i = 0; i < device.lightingViewImages.length; i++) {
            const imageName = device.lightingViewImages[i];
            const imagePath = `${baseImagePath}${device.img}${device.productColors[device.productColorIndex].filenameAdjustment}${imageName}.png`;
            const lightingViewImage = await ImageAttributes.fromPath(imagePath);
            if (lightingViewImage == null) {
                throw new Error('Lighting Image Render not found');
            }
            // lightingViewImage.image.key = i;
            device.lightingEffectRenderAttributes.push(lightingViewImage);
        }

        return device;
    }

    static extractUIHelperProperties(uiDevice) {
        // remove all data that was added to prepare
        // to send the data to the device
        const clone = structuredClone(uiDevice);
        delete clone.img;
        delete clone.lightingViewImages;
        delete clone.lightingEffects;
        delete clone.pollingRates;
        delete clone.inputLatencies;
        delete clone.liftoffDistances;
        delete clone.standbyTypes;
        delete clone.dpiSections;
        delete clone.keybindingLayers;
        delete clone.deviceCategoryName;
        delete clone.rgbGradients;
        delete clone.productColors;
        delete clone.productScales;
        delete clone.productColorIndex;
        delete clone.iconType;
        delete clone.managementSections;

        if (clone.keyboardData != null) {
            delete clone.keyboardData;
        }

        return clone;
    }

    static isvalueC(serialNumber: string | null | undefined) {
        if (serialNumber == null) return false;
        return [
            // ANSI Wireless
            '0x342D0xE3D7',
            '0x342D0xE3D8',
            '0x342D0xE3D9',
            // ANSI Wired
            '0x342D0xE3DA',
            '0x342D0xE3DB',
            '0x342D0xE3DC',
            // ISO Wireless
            '0x342D0xE3EC',
            '0x342D0xE3ED',
            '0x342D0xE3EE',
            // ISO Wired
            '0x342D0xE3EF',
            '0x342D0xE3F0',
            '0x342D0xE3F1',
            // valueD
            '0x342D0xE3DD', // valueA valueD HE 65% ANSI
            '0x342D0xE3F2', // valueA valueD HE 65% ISO
            '0x342D0xE3DE', // valueA valueD HE 75% ANSI
            '0x342D0xE3F3', // valueA valueD HE 75% ISO
            '0x342D0xE3DF', // valueA valueD HE 100% ANSI
            '0x342D0xE3F4', // valueA valueD HE 100% ISO
        ].includes(serialNumber);
    }

    static isvalueJ(serialNumber: string | null | undefined) {
        if (serialNumber == null) return false;
        return ['0x12CF0x0491'].includes(serialNumber);
    }

    static isAdvDebounceCapable(serialNumber: string | null | undefined) {
        if (serialNumber == null) return false;
        return AdvDebounceDevices.findIndex((x) => x.toLowerCase() == serialNumber.toLowerCase()) != -1;
    }

    static savevalueCData(uiPreviewDevice: UIDevice) {
        console.assert(DevicesAdapter.isvalueC(uiPreviewDevice.SN), 'Device is not a valueC');
        console.log(uiPreviewDevice.keyboardData);
        return true;
    }

    static isvalueB(serialNumber: string | null | undefined) {
        if (serialNumber == null) return false;
        return [
            '0x24420x0054',
            '0x24420x0053',
            '0x24420x0055',
            '0x24420x2682',
            '0x24420x0052',
            '0x24420x0056',
        ].includes(serialNumber);
    }

    static isWirelessKeyboard(serialNumber: string | null | undefined) {
        if (serialNumber == null) return false;
        return [
            // valueC ANSI Wireless
            '0x342D0xE3D7',
            '0x342D0xE3D8',
            '0x342D0xE3D9',
            // valueC ISO Wireless
            '0x342D0xE3EC',
            '0x342D0xE3ED',
            '0x342D0xE3EE',
            // Other?
            '0x24420x0056',
            '0x24420x0054',
            '0x24420x0055',
        ].includes(serialNumber);
    }

    static setDeviceProfile(deviceSN: string, modelType: number, profileIndex: number) {
        try {
            // mice use an initial index of 1
            profileIndex = modelType == 1 ? profileIndex + 1 : profileIndex;

            // if profile is set, only profile gets saved. switching profiles wipes out unsaved preview properties
            let obj = {
                Type: FuncType.Mouse,
                SN: deviceSN,
                Func: FuncName.ChangeProfileID,
                Param: profileIndex,
            };
            console.log(obj);
            ProtocolService.RunSetFunction(obj).then((data) => {
                console.log('data', data);
            });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static setDeviceLegacyLayer(uiDevice: UIDevice) {
        try {
            uiDevice.deviceData!.profile = uiDevice.keyboardData!.KeyBoardArray;
            uiDevice.deviceData!.profileLayers = uiDevice.keyboardData!.profileLayers;
            uiDevice.deviceData!.sideLightSwitch = uiDevice.keyboardData!.sideLightSwitch;

            if (DevicesAdapter.isvalueC(uiDevice.SN)) {
                const profileID = uiDevice.keyboardData!.profileindex;
                const layerID = uiDevice.keyboardData!.profileLayerIndex[profileID];
                const id = ((layerID & 0x0f) << 4) | (profileID & 0x0f);

                const layerChangeRequest = {
                    Type: FuncType.Keyboard,
                    SN: uiDevice.SN,
                    Func: FuncName.ChangeProfileID,
                    Param: id,
                };
                ProtocolService.RunSetFunction(layerChangeRequest);
                return true;
            }

            const previewDevice = DevicesAdapter.extractUIHelperProperties(uiDevice);
            previewDevice.deviceData.profileindex = parseInt(previewDevice.deviceData.profileindex) + 1; // legacy offset; old ui had profiles indexed as 1,2,3
            const switchUIflag = { lightingflag: true, keybindingflag: true, performanceflag: true };

            let obj = {
                Type: FuncType.Mouse,
                SN: previewDevice.SN,
                Func: FuncName.SetKeyMatrix,
                Param: {
                    KeyBoardManager: uiDevice.keyboardData,
                    profileData: previewDevice.deviceData.profile,
                    switchUIflag,
                    device: previewDevice,
                },
            };
            console.log(obj);
            ProtocolService.RunSetFunction(obj).then((data) => {
                console.log('data', data);
            });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async saveDeviceData(uiPreviewDevice, updatedPropertynames: string[] = []) {
        // initial data transfer from ui settings into expected data structure
        if (uiPreviewDevice.deviceCategoryName == 'Keyboard' || uiPreviewDevice.deviceCategoryName == 'Numpad') {
            uiPreviewDevice.deviceData.KeyBoardArray = uiPreviewDevice.keyboardData.profile;
            uiPreviewDevice.deviceData.profileLayers = uiPreviewDevice.keyboardData.profileLayers;
            uiPreviewDevice.deviceData.sideLightSwitch = uiPreviewDevice.keyboardData.sideLightSwitch;
        }

        const previewDevice = DevicesAdapter.extractUIHelperProperties(uiPreviewDevice);
        console.log('saveDeviceData()', previewDevice, updatedPropertynames);

        const currentProfileIndex = parseInt(previewDevice.deviceData.profileindex);
        if (!DevicesAdapter.isvalueC(uiPreviewDevice.SN)) {
            previewDevice.deviceData.profileindex = currentProfileIndex + 1; // legacy offset; old ui had profiles indexed as 1,2,3
        }

        if (updatedPropertynames.includes('reset') && uiPreviewDevice.ModelType == 2) {
            const profileLayerIndex = previewDevice.deviceData.profileLayerIndex[currentProfileIndex];
            for (const key of previewDevice.deviceData.profileLayers[currentProfileIndex][profileLayerIndex]
                .assignedKeyboardKeys[0]) {
                key.recordBindCodeName = 'Default';
                key.recordBindCodeType = '';
                if (key.valueCKeyData != null) key.valueCKeyData = undefined;
            }
            previewDevice.deviceData.profile = previewDevice.deviceData.profileLayers[currentProfileIndex];
        }

        const saveTypes = DevicesAdapter.getSaveTypes(updatedPropertynames);
        if (saveTypes.length && uiPreviewDevice.keyboardData != undefined) {
            DevicesAdapter.updateModifiedTime(uiPreviewDevice, previewDevice);
        }

        // compose legacy data format
        if (uiPreviewDevice.deviceCategoryName == 'Keyboard' || uiPreviewDevice.deviceCategoryName == 'Numpad') {
            uiPreviewDevice.keyboardData!.KeyBoardArray = previewDevice.deviceData.profile;
            uiPreviewDevice.keyboardData!.profileLayers = previewDevice.deviceData.profileLayers;
            uiPreviewDevice.keyboardData!.sideLightSwitch = previewDevice.deviceData.sideLightSwitch;
        }

        if (DevicesAdapter.isvalueC(uiPreviewDevice.SN) && updatedPropertynames.includes('reset')) {
            console.log('Resetting valueC data');
            const profileLayerIndex = previewDevice.deviceData.profileLayerIndex[currentProfileIndex];
            for (const profileLayer of uiPreviewDevice.deviceData.profileLayers) {
                if (profileLayer[profileLayerIndex].valueCData) profileLayer.valueCData = undefined;
            }
            for (const profileLayer of uiPreviewDevice.keyboardData?.KeyBoardArray) {
                if (profileLayer.valueCData) profileLayer.valueCData = undefined;
            }

            const obj = {
                Type: FuncType.Mouse,
                SN: previewDevice.SN,
                Func: FuncName.ResetDevice,
                Param: { SN: previewDevice.SN, device: previewDevice },
            };
            ProtocolService.RunSetFunction(obj).then((data) => {
                console.log('data', data);
            });
            return true;
        }

        for (const saveType of saveTypes) {
            const switchUIflag = { lightingflag: false, keybindingflag: false, performanceflag: false };
            switchUIflag[saveType] = true;
            const obj = DevicesAdapter.isvalueJ(previewDevice.SN)
                ? {
                      Type: FuncType.Device,
                      SN: previewDevice.SN,
                      Func: FuncName.SetLEDEffect,
                      Param: uiPreviewDevice.deviceData!.profile[0],
                  }
                : {
                      Type: FuncType.Mouse,
                      SN: previewDevice.SN,
                      Func: FuncName.SetKeyMatrix,
                      Param: {
                          KeyBoardManager: uiPreviewDevice.keyboardData,
                          profileData: previewDevice.deviceData.profile,
                          switchUIflag,
                          device: previewDevice,
                      },
                  };
            console.log(obj);
            ProtocolService.RunSetFunction(obj).then((data) => {
                console.log('data', data);
            });

            // wait after sending a save command
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        return true;
    }

    private static updateModifiedTime(uiPreviewDevice, previewDevice) {
        const lastModified = Date.now();

        switch (uiPreviewDevice.ModelType) {
            case 2: {
                // Keyboard
                const uiProfileIndex = uiPreviewDevice.keyboardData.profileindex;
                uiPreviewDevice.keyboardData.KeyBoardArray[uiProfileIndex].lastModified = lastModified;

                const currentProfileIndex = DevicesAdapter.isvalueC(uiPreviewDevice.SN)
                    ? previewDevice.deviceData.profileindex
                    : previewDevice.deviceData.profileindex - 1;
                previewDevice.deviceData.profile[currentProfileIndex].lastModified = lastModified;
                const profileLayerIndex = previewDevice.deviceData.profileLayerIndex[currentProfileIndex];
                previewDevice.deviceData.profileLayers[profileLayerIndex][currentProfileIndex].lastModified =
                    lastModified;

                break;
            }
            case 1: {
                // Mouse
                const currentProfileIndex = uiPreviewDevice.deviceData.profileindex;
                uiPreviewDevice.deviceData.profile[currentProfileIndex].lastModified = lastModified;
                previewDevice.deviceData.profile[currentProfileIndex].lastModified = lastModified;
                break;
            }
            default:
                console.warn('Unhandled device type when setting profile modified time');
                break;
        }
    }

    static getSaveTypes(updatedProperties: string[]): ('lightingflag' | 'keybindingflag' | 'performanceflag')[] {
        let lighting = false;
        let keybinding = false;
        let performance = false;

        for (let i = 0; i < updatedProperties.length; i++) {
            if (lightingSaveProperties.indexOf(updatedProperties[i]) > -1) {
                lighting = true;
            }
            if (keybindingSaveProperties.indexOf(updatedProperties[i]) > -1) {
                keybinding = true;
            }
            if (performanceSaveProperties.indexOf(updatedProperties[i]) > -1) {
                performance = true;
            }

            if (lighting == true && keybinding == true && performance == true) {
                break;
            }
        }
        const types: ('lightingflag' | 'keybindingflag' | 'performanceflag')[] = [];
        if (lighting == true) {
            types.push('lightingflag');
        }
        if (keybinding == true) {
            types.push('keybindingflag');
        }
        if (performance == true) {
            types.push('performanceflag');
        }

        return types;
    }
}
