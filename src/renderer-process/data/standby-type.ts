import { DisplayOption } from "./display-option";

export const StandbyTypes = 
[
    new DisplayOption("InheritGlobal", "Option_StandbyTypes_InheritGlobal", 1, { translationFallback: "Inherit Global" }),
    new DisplayOption("DeviceSpecific", "Option_StandbyTypes_DeviceSpecific", 2, { translationFallback: "Device Specific" }),
];