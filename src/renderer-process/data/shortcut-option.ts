import { DisplayOption } from "./display-option";

export const ShortcutTypes: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_ShortcutTypes_none', -1, {translationFallback: ""}),
    new DisplayOption('launchProgram', 'Option_ShortcutTypes_launchProgram', 1, {translationFallback: "Launch Program", bindingValue: "LaunchProgram"}),
    new DisplayOption('launchWebsite', 'Option_ShortcutTypes_launchWebsite', 2, {translationFallback: "Launch Website", bindingValue: "LaunchWebsite"}),
    new DisplayOption('windows', 'Option_ShortcutTypes_windows', 3, {translationFallback: "Windows", bindingValue: "Windows"}),
];