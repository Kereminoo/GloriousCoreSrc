import { DisplayOption } from "./display-option";

export const WindowsFunctionShortcuts: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_WindowsFunctionShortcuts_none', -1, {translationFallback: ""}),
    new DisplayOption('email', 'Option_WindowsFunctionShortcuts_email', 1, {translationFallback: "Email"}),
    new DisplayOption('calculator', 'Option_WindowsFunctionShortcuts_calculator', 2, {translationFallback: "Calculator"}),
    new DisplayOption('myComputer', 'Option_WindowsFunctionShortcuts_myComputer', 3, {translationFallback: "My Computer"}),
    new DisplayOption('explorer', 'Option_WindowsFunctionShortcuts_explorer', 4, {translationFallback: "Explorer"}),
    new DisplayOption('browserHome', 'Option_WindowsFunctionShortcuts_browserHome', 5, {translationFallback: "Browser - Home"}),
    new DisplayOption('browserRefresh', 'Option_WindowsFunctionShortcuts_browserRefresh', 6, {translationFallback: "Browser - Refresh"}),
    new DisplayOption('browserStop', 'Option_WindowsFunctionShortcuts_browserStop', 7, {translationFallback: "Browser - Stop"}),
    new DisplayOption('browserBack', 'Option_WindowsFunctionShortcuts_browserBack', 8, {translationFallback: "Browser - Back"}),
    new DisplayOption('browserForward', 'Option_WindowsFunctionShortcuts_browserForward', 9, {translationFallback: "Browser - Forward"}),
    new DisplayOption('browserSearch', 'Option_WindowsFunctionShortcuts_browserSearch', 10, {translationFallback: "Browser - Search"}),
];