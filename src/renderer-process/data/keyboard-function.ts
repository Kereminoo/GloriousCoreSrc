import { DisplayOption } from './display-option';

export const KeyboardFunctions: DisplayOption[] = [
    new DisplayOption('none', 'Option_KeyboardFunctions_none', -1, { translationFallback: 'none' }),
    new DisplayOption('profileCycleUp', 'Option_KeyboardFunctions_profileCycleUp', 1, {
        translationFallback: 'Profile Cycle Up',
        bindingValue: 'KEYBOARD_Fun_10',
    }),
    new DisplayOption('profileCycleDown', 'Option_KeyboardFunctions_profileCycleDown', 2, {
        translationFallback: 'Profile Cycle Down',
        bindingValue: 'KEYBOARD_Fun_11',
    }),
    new DisplayOption('layerCycleUp', 'Option_KeyboardFunctions_layerCycleUp', 3, {
        translationFallback: 'Layer Cycle Up',
        bindingValue: 'KEYBOARD_Fun_12',
    }),
    new DisplayOption('layerCycleDown', 'Option_KeyboardFunctions_layerCycleDown', 4, {
        translationFallback: 'Layer Cycle Down',
        bindingValue: 'KEYBOARD_Fun_13',
    }),
];
