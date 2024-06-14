import { useEffect, useState } from 'react'
import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import './rgbsync.page.css'
import { AppService } from '@renderer/services/app.service';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { useAppDataContext, useAppDataUpdateContext } from '@renderer/contexts/app-data.context';
import DevicesDrawer from '@renderer/components/devices-drawer/devices-drawer.component';
import RGBSyncArrangement from '@renderer/components/rgbsync-arrangement/rgbsync-arrangement.component';
import RGBSyncBreadcrumbs from '@renderer/components/rgbsync-breadcrumbs/rgbsync-breadcrumbs.component';
import RGBSyncSettings from '@renderer/components/rgbsync-settings/rgbsync-settings.component';

function RGBSyncPage(props: any) 
{
  // const { onHyperlinkClick } = props;

  const devicesContext = useDevicesContext();
  const translate = useTranslate();

  const appDataContext = useAppDataContext();
  // const {
  //   setLanguage,
  //   setOpenOnStartup,
  //   setMinimizedByDefault,
  //   setEnableAutomaticUpdates,
  //   setGlobalStandby,
  //   setGlobalStandbyTimer,
  //   setEnableTooltips,
  //   setTheme,
  // } = useAppDataUpdateContext();

  // const [showDebugUI, setShowDebugUI] = useState("");

  return (<>
    <div className="rgbsync-page">
      <div className="drawer">
        <DevicesDrawer/>
      </div>
      <div className="arrangement">
        <RGBSyncArrangement/>
      </div>
      <div className="breadcrumbs">
        <RGBSyncBreadcrumbs/>
      </div>
      <div className="settings">
        <RGBSyncSettings/>
      </div>
    </div>
    </>)
}

export default RGBSyncPage



 
  // /**
  //  * click Light Sleep checkbox
  //  */
  // LightingSleepChange() {
  //     this.getAppService.getAppSetting().sleep = this.LightingSleep;
  //     this.getAppService.updateAppsetting();
  //     for (let i = 0; i < this.deviceService.pluginDeviceData.length; i++) {
  //         let obj = {
  //             Type: this.funcVar.FuncType.Mouse,
  //             SN: this.deviceService.pluginDeviceData[i].SN,
  //             Func: this.funcVar.FuncName.SleepTime,
  //             Param: {
  //                 sleep: this.LightingSleep,
  //                 sleeptime: this.SleepValue
  //             }
  //         }
  //         this.protocolService.RunSetFunction(obj).then((data) => { });
  //     }
  // }

  // /**
  //  * move sleep slider
  //  */
  // sleepmove() {
  //     const sleepTimeSlider: any = document.getElementById("SleepTimeslider");
  //     if (sleepTimeSlider) {
  //         sleepTimeSlider.style.backgroundImage = '-webkit-linear-gradient(left ,#FFA40D 0%,#FFA40D ' + ((this["SleepValue"] - 1) / 14 * 100) + '%,#313131 ' + ((this["SleepValue"] - 1) / 14 * 100) + '%, #313131 100%)';
  //         const sleepSliderText = document.getElementById("SleepSliderText");
  //         if(sleepSliderText != null)
  //         {
  //             sleepSliderText.style.marginLeft = ((this.SleepValue - 1) * 13) + "px";
  //         }
  //     }
  // }

  // /**
  //  * Sleep slider change
  //  */
  // SleepsliderChange() {
  //     this.getAppService.getAppSetting().sleeptime = this.SleepValue;
  //     this.getAppService.updateAppsetting();
  //     for (let i = 0; i < this.deviceService.pluginDeviceData.length; i++) {
  //         let obj = {
  //             Type: this.funcVar.FuncType.Mouse,
  //             SN: this.deviceService.pluginDeviceData[i].SN,
  //             Func: this.funcVar.FuncName.SleepTime,
  //             Param: {
  //                 sleep: this.LightingSleep,
  //                 sleeptime: this.SleepValue
  //             }
  //         }
  //         this.protocolService.RunSetFunction(obj).then((data) => { });
  //     }
  // }