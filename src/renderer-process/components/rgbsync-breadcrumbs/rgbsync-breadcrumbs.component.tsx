import { useDevicesContext } from "@renderer/contexts/devices.context";
import { useTranslate } from "@renderer/contexts/translations.context";
import { useUIContext, useUIUpdateContext } from "@renderer/contexts/ui.context";
import { BindingTypes_ButtonPress } from "@renderer/data/binding-type";
import { ShortcutTypes } from "@renderer/data/shortcut-option";
import { WindowsFunctionShortcuts } from "@renderer/data/windows-shortcut-option";
import { useParams } from "react-router";

function RGBSyncBreadcrumbs(props: any) 
{
  const { subpage } = useParams();

  // const devicesContext = useDevicesContext();
  const uiContext = useUIContext();
  const {update} = useUIUpdateContext();

  const translate = useTranslate(); 

  return (
    <p> RGBSyncBreadcrumbs </p>
);

//   return <div className="breadcrumbs">
//   {(subpage == undefined) ?
//     null :
//     (subpage == "lighting" && uiContext.lightSettingMode != "none") ?
//     <a onClick={() => 
//       { 
//         uiContext.lightSettingMode = 'none';
//         update(uiContext);
//       }
//     }>
//       {translate('Device_Breadcrumb_Label_LightingHome', 'Lighting Home')}
//     </a> :
//     (subpage == "keybinding" && uiContext.keybindSelectedLayer == null) ?
//     <></> :
//     (subpage == "keybinding" && uiContext.keybindSelectedLayer!.optionKey != "none") ? 
//     <a onClick={() => 
//       {
//         // uiContext.keybindingLayer = devicesContext.previewDevice?.keybindingLayers[0];
//         uiContext.keybindSelectedBindingType = BindingTypes_ButtonPress[0]; 
//         update(uiContext); 
//       }
//     }>
//       {translate('Device_Breadcrumb_Label_KeybindingHome', 'Keybinding Home')}
//     </a> :
//     (subpage == "keybinding" && uiContext.keybindSelectedLayer!.optionKey == "") ?
//     <></> :
//     null
//   }
//   {(uiContext.keybindSelectedBindingType == null || uiContext.keybindSelectedBindingType.optionKey == "none") ? 
//     null :
//     <>
//       <span>&gt;</span>
//       <a onClick={() => 
//         {
//           uiContext.keybindSelectedBindingType = BindingTypes_ButtonPress[0];
//           uiContext.keybindSelectedShortcutType = ShortcutTypes[0];
//           uiContext.keybindMacroSelection = undefined;
//           update(uiContext); 
//         }}>
//           {translate(uiContext.keybindSelectedLayer?.translationKey, 'unknown')}
//       </a>
//     </>
//   }
//   {(uiContext.keybindSelectedBindingType?.optionKey == "macro" && uiContext.keybindMacroSelection != null) ? 
//     <>
//       <span>&gt;</span>
//       <a onClick={() => 
//         {
//           uiContext.keybindSelectedShortcutType = ShortcutTypes[0];
//           uiContext.keybindMacroSelection = undefined;
//           update(uiContext);
//         }
//       }>
//       {translate('Device_Breadcrumb_Label_Macros', 'Macros')}
//       </a>
//     </> :
//     null
//   }
//   {(uiContext.keybindSelectedBindingType?.optionKey == "shortcuts") ?
//     <>
//       <span>&gt;</span>
//       <a onClick={() => 
//         { 
//           uiContext.keybindSelectedShortcutType = ShortcutTypes[0];
//           uiContext.keybindSelectedShortcutWindowsOption = WindowsFunctionShortcuts[0];
//           update(uiContext); 
//         }
//       }>
//       {translate('Device_Breadcrumb_Label_Shortcuts', 'Shortcuts')}
//       </a>
//     </> :
//     null
//   }
// </div>
}

export default RGBSyncBreadcrumbs