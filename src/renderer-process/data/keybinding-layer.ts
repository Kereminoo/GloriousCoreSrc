import { DisplayOption } from "./display-option";

export const KeybindingLayers_SingleLayer: DisplayOption[] = 
[
    new DisplayOption('default', 'Option_KeybindingLayer_SingleLayer_default', 0, {translationFallback: "Default Layer"}),
];

export const KeybindingLayers_Keyboard: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_KeybindingLayer_none', -1, {translationFallback: ""}),
    new DisplayOption('default', 'Option_KeybindingLayer_default', 0, {translationFallback: "Default Layer"}),
    new DisplayOption('function', 'Option_KeybindingLayer_function', 1, {translationFallback: "Function Layer"}),
    new DisplayOption('alt', 'Option_KeybindingLayer_alt', 2, {translationFallback: "Alt Layer"}),
    new DisplayOption('function_alt', 'Option_KeybindingLayer_function_alt', 3, {translationFallback: "Function + Alt Layer"}),
];

export const KeybindingLayers_ShiftLayer: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_KeybindingLayer_none', -1, {translationFallback: ""}),
    new DisplayOption('default', 'Option_KeybindingLayer_default', 0, {translationFallback: "Default Layer"}),
    new DisplayOption('layerShift', 'Option_KeybindingLayer_layerShift', 1, {translationFallback: "Layer Shift"}),
];