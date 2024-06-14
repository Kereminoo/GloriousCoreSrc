import { useDevicesContext } from "@renderer/contexts/devices.context";
import { useTranslate } from "@renderer/contexts/translations.context";
import { useUIContext, useUIUpdateContext } from "@renderer/contexts/ui.context";
import { BindingTypes_ButtonPress } from "@renderer/data/binding-type";
import { ShortcutTypes } from "@renderer/data/shortcut-option";
import { UIDevice } from "@renderer/data/ui-device";
import { WindowsFunctionShortcuts } from "@renderer/data/windows-shortcut-option";
import { useParams } from "react-router";
import SVGIconComponent from "../svg-icon/svg-icon.component";
import "./devices-drawer.component.css";
import { useEffect, useState } from "react";
import { IconSize } from "../icon/icon.types";
import Icon from "../icon/icon";

function DevicesDrawer(props: any) {
  const { subpage } = useParams();

  const devicesContext = useDevicesContext();
  const uiContext = useUIContext();
  const { update } = useUIUpdateContext();

  const translate = useTranslate();

  const [rotateHandle, setRotateHandle] = useState(false);
  const handleRotate = () => setRotateHandle(!rotateHandle);
  const handleRotationStyle = rotateHandle ? 'rotate(0deg)' : 'rotate(180deg)';
  const drawerItemStyle = { display: rotateHandle ? 'none' : 'block'};

  return (
    <>
      <div className="devices">
        {devicesContext.devices ? <> {devicesContext.devices.map((device: UIDevice, index: number) => {
          return <div className="drawer-item" style={drawerItemStyle} key={device.SN + index}>
            <p style={{width: 60, height: 24, fontSize: 8}}>{device.devicename}</p>
            <div className="item-box">
              <Icon type={device.iconType} size={IconSize.Larger} />
              {/* <SVGIconComponent className="device"
                src={device.iconPaths.defaultSource}
                active={device.iconPaths.activeSource}
                selected={device.iconPaths.selectedSource}/> */}
                <input type="checkbox"/>
              </div>
          </div>
        })}</> : "loading..."}
        <div className="drawer-handle" key="handle">
            <div className="handle-box" style={{transform: handleRotationStyle, transition: "transform 150ms ease-out"}} onClick={()=>handleRotate()}>
            ▶
            </div>
          </div>
      </div>
    </>);
}

export default DevicesDrawer