import { DisplayOption } from "./display-option";

export const ColorSettingStyle: DisplayOption[] = 
[
    new DisplayOption('customColor', 'Option_ColorSettingStyle_customColor', -1, {translationFallback: "Custom Color"}),
    new DisplayOption('rgbGradient', 'Option_ColorSettingStyle_rgbGradient', 7, {translationFallback: "RGB Gradient"}),
];