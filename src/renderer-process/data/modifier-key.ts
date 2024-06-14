import { DisplayOption } from './display-option';

export const ModifierKeys: DisplayOption[] = [
    new DisplayOption('none', 'Option_ModifierKeys_none', -1, { translationFallback: 'None' }),
    new DisplayOption('shift', 'Option_ModifierKeys_shift', 0, { translationFallback: 'Shift' }),
    new DisplayOption('ctrl', 'Option_ModifierKeys_ctrl', 1, { translationFallback: 'Ctrl' }),
    new DisplayOption('alt', 'Option_ModifierKeys_alt', 2, { translationFallback: 'Alt' }),
    new DisplayOption('windows', 'Option_ModifierKeys_windows', 3, { translationFallback: 'Windows Key' }),
];
