import { useDevicesContext } from "@renderer/contexts/devices.context";
import { useTranslate } from "@renderer/contexts/translations.context";
import { useUIContext, useUIUpdateContext } from "@renderer/contexts/ui.context";
import { BindingTypes_ButtonPress } from "@renderer/data/binding-type";
import { ShortcutTypes } from "@renderer/data/shortcut-option";
import { WindowsFunctionShortcuts } from "@renderer/data/windows-shortcut-option";
import { useParams } from "react-router";

function RGBSyncSettings(props: any) 
{
  const { subpage } = useParams();

  const devicesContext = useDevicesContext();
  const uiContext = useUIContext();
  const {update} = useUIUpdateContext();

  const translate = useTranslate(); 

  return (
        <p> RGBSyncSettings </p>
  );
}

export default RGBSyncSettings