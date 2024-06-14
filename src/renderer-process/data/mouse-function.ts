import { DisplayOption } from './display-option';

export const MouseFunctions: DisplayOption[] = [
    new DisplayOption('none', 'Option_MouseFunctions_none', -1, { translationFallback: 'none' }),
    new DisplayOption('leftClick', 'Option_MouseFunctions_leftClick', 1, {
        translationFallback: 'Left Click',
        bindingValue: 'MOUSE_Fun_14',
    }),
    new DisplayOption('rightClick', 'Option_MouseFunctions_rightClick', 2, {
        translationFallback: 'Right Click',
        bindingValue: 'MOUSE_Fun_15',
    }),
    new DisplayOption('middleClick', 'Option_MouseFunctions_middleClick', 3, {
        translationFallback: 'Middle Click',
        bindingValue: 'MOUSE_Fun_16',
    }),
    new DisplayOption('forward', 'Option_MouseFunctions_forward', 4, {
        translationFallback: 'Forward',
        bindingValue: 'MOUSE_Fun_17',
    }),
    new DisplayOption('back', 'Option_MouseFunctions_back', 5, {
        translationFallback: 'Back',
        bindingValue: 'MOUSE_Fun_18',
    }),
    new DisplayOption('scrollUp', 'Option_MouseFunctions_scrollUp', 6, {
        translationFallback: 'Scroll Up',
        bindingValue: 'MOUSE_Fun_19',
    }),
    new DisplayOption('scrollDown', 'Option_MouseFunctions_scrollDown', 7, {
        translationFallback: 'Scroll Down',
        bindingValue: 'MOUSE_Fun_20',
    }),
    new DisplayOption('profileCycleUp', 'Option_MouseFunctions_profileCycleUp', 9, {
        translationFallback: 'Profile Cycle Up',
        bindingValue: 'MOUSE_Fun_21',
    }),
    new DisplayOption('profileCycleDown', 'Option_MouseFunctions_profileCycleDown', 8, {
        translationFallback: 'Profile Cycle Down',
        bindingValue: 'MOUSE_Fun_22',
    }),
    new DisplayOption('batteryStatusCheck', 'Option_MouseFunctions_batteryStatusCheck', 10, {
        translationFallback: 'Battery Status Check',
        bindingValue: 'MOUSE_Fun_23',
    }),
    new DisplayOption('layerShift', 'Option_MouseFunctions_layerShift', 12, {
        translationFallback: 'Layer Shift',
        bindingValue: 'LayerShift',
    }),
];
