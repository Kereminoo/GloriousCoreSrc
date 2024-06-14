import { DisplayOption } from "./display-option";

export const RotaryEncoderActions: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_RotaryEncoderAction_Push', 0, {translationFallback: "Knob Push"}),
    new DisplayOption('dpiStageUp', 'Option_RotaryEncoderAction_Rotate', 1, {translationFallback: "Knob Rotation"}),
];