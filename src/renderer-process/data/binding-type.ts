import { DisplayOption } from "./display-option";

export const BindingTypes_ButtonPress: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_BindingTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('keystroke', 'Option_BindingTypes_keystroke', 7, {translationFallback: "Keystroke"}),
    new DisplayOption('keyboardFunction', 'Option_BindingTypes_keyboardFunction', 8, {translationFallback: "Keyboard Function"}),
    new DisplayOption('mouseFunction', 'Option_BindingTypes_mouseFunction', 3, {translationFallback: "Mouse Function"}),
    new DisplayOption('dpi', 'Option_BindingTypes_dpi', 4, {translationFallback: "DPI"}),
    new DisplayOption('macro', 'Option_BindingTypes_macro', 1, {translationFallback: "Macro"}),
    new DisplayOption('multimedia', 'Option_BindingTypes_multimedia', 5, {translationFallback: "Multimedia"}),
    new DisplayOption('shortcuts', 'Option_BindingTypes_shortcuts', 2, {translationFallback: "Shortcuts"}),
    new DisplayOption('disable', 'Option_BindingTypes_disable', 6, {translationFallback: "Disable"}),
];
  
export const BindingTypes_KeyPress: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_BindingTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('keystroke', 'Option_BindingTypes_keystroke', 0, {translationFallback: "Keystroke", bindingCode: "SingleKey" }),
    new DisplayOption('keyboardFunction', 'Option_BindingTypes_keyboardFunction', 1, {translationFallback: "Keyboard Function", bindingCode: "KEYBOARD" }),
    new DisplayOption('mouseFunction', 'Option_BindingTypes_mouseFunction', 2, {translationFallback: "Mouse Function", bindingCode: "MOUSE" }),
    new DisplayOption('macro', 'Option_BindingTypes_macro', 3, {translationFallback: "Macro", bindingCode: "MacroFunction" }),
    new DisplayOption('multimedia', 'Option_BindingTypes_multimedia', 4, {translationFallback: "Multimedia", bindingCode: "Multimedia" }),
    new DisplayOption('shortcuts', 'Option_BindingTypes_shortcuts', 5, {translationFallback: "Shortcuts" }),
    new DisplayOption('audioToggle', 'Option_BindingTypes_audioToggle', 7, {translationFallback: "Audio Toggle", bindingCode: "SOUND CONTROL" }),
    new DisplayOption('disable', 'Option_BindingTypes_disable', 6, {translationFallback: "Disable", bindingCode: "Disable" })
];

export const BindingTypes_Rotation: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_BindingTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('soundControl', 'Option_BindingTypes_soundControl', 0, {translationFallback: "Sound Control", bindingCode: "SOUND CONTROL"}),
    new DisplayOption('disable', 'Option_BindingTypes_disable', 6, {translationFallback: "Disable", bindingCode: "Disable"})
];

export const BindingTypes_RotaryPress: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_BindingTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('keystroke', 'Option_BindingTypes_keystroke', 0, {translationFallback: "Keystroke", bindingCode: "SingleKey"}),
    new DisplayOption('keyboardFunction', 'Option_BindingTypes_keyboardFunction', 1, {translationFallback: "Keyboard Function", bindingCode: "KEYBOARD"}),
    new DisplayOption('mouseFunction', 'Option_BindingTypes_mouseFunction', 2, {translationFallback: "Mouse Function", bindingCode: "MOUSE"}),
    new DisplayOption('multimedia', 'Option_BindingTypes_multimedia', 4, {translationFallback: "Multimedia", bindingCode: "Multimedia"}),
    new DisplayOption('shortcuts', 'Option_BindingTypes_shortcuts', 5, {translationFallback: "Shortcuts"}),
    new DisplayOption('disable', 'Option_BindingTypes_disable', 6, {translationFallback: "Disable", bindingCode: "Disable"})
];

export const BindingTypes_Slide: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_BindingTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('soundControl', 'Option_BindingTypes_soundControl', 0, {translationFallback: "Sound Control", bindingCode: "SOUND CONTROL"}),
    new DisplayOption('disable', 'Option_BindingTypes_disable', 6, {translationFallback: "Disable", bindingCode: "Disable"})
];