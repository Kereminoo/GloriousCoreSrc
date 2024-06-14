import { DisplayOption } from "./display-option";

export const DPIOptions: DisplayOption[] = 
[
    new DisplayOption('none', 'Option_DPIOptions_none', -1, {translationFallback: ""}),
    new DisplayOption('dpiStageUp', 'Option_DPIOptions_dpiStageUp', 1, {translationFallback: "DPI Stage Up"}),
    new DisplayOption('dpiStageDown', 'Option_DPIOptions_dpiStageDown', 2, {translationFallback: "DPI Stage Down"}),
    new DisplayOption('dpiCycleUp', 'Option_DPIOptions_dpiCycleUp', 3, {translationFallback: "DPI Cycle Up"}),
    new DisplayOption('dpiCycleDown', 'Option_DPIOptions_dpiCycleDown', 4, {translationFallback: "DPI Cycle Down"}),
    new DisplayOption('dpiLock', 'Option_DPIOptions_dpiLock', 5, {translationFallback: "DPI Lock"})
];