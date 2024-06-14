import { useEffect } from 'react'
import './app.css'
import { Route, Routes } from 'react-router-dom'
import ConnectedDevicesPage from '../../pages/connected-devices/connected-devices.page'
import NavigationComponent from '../navigation/navigation.component'
import SettingsPage from '../../pages/settings/settings.page'
import RGBSyncPage from '../../pages/rgb-sync/rgbsync.page'
import DevicePage from '../../pages/device/device.page'
import { AppService } from '@renderer/services/app.service'
import { MessageChannels } from '../../../common/channel-maps/MessageChannels'
import { UIContext } from '@renderer/contexts/ui.context'
import { RecordsContext } from '@renderer/contexts/records.context'
import { DevicesContext } from '@renderer/contexts/devices.context'
import { TranslationsContext } from '@renderer/contexts/translations.context'
import SVGIconComponent from '../svg-icon/svg-icon.component'
import PairingPage from '@renderer/pages/pairing/pairing.page'
import UpdateManagerComponent from '../update-manager/update-manager.component'
import { AppDataContext } from '@renderer/contexts/app-data.context'
import { CloudContext } from '@renderer/contexts/cloud.context'
import DebugOverlayComponent from '../debug-overlay/debug-overlay-component'
import UpdateDeviceComponent from '../update-device/update-device.component'

const showDebugOverlay = false;

function App() {
    useEffect(() => {
        console.log('Environment', import.meta.env);
    }, []);

  return <>
    {/* todo: updater context */}
    <UIContext>
        <DevicesContext>
          <AppDataContext>
            <CloudContext>
              <RecordsContext>
                  <TranslationsContext>
                    <div className="title-bar">
                      <div className="actions">
                        <button type="button" className="embed action minimize" title="Minimize" onClick={() => { AppService.runWindowCommand(MessageChannels.AppChannel.CommandMin); }} >
                          <SVGIconComponent src="/images/icons/system_minimize-window.svg" selected="/images/icons/system_minimize-window.svg" />
                        </button>
                        <button type="button" className="embed action maximize" title="Maximize / Restore"
                        onClick={() => 
                        {
                          AppService.runWindowCommand(MessageChannels.AppChannel.CommandMax);
                        }} >
                          <SVGIconComponent src="/images/icons/system_maximize-window.svg" selected="/images/icons/system_maximize-window.svg" />
                        </button>
                        <button type="button" className="embed action close" title="Close"
                        onClick={() => 
                        { 
                          AppService.runWindowCommand(MessageChannels.AppChannel.CommandClose); 
                        }} >
                          <SVGIconComponent src="/images/icons/system_close-window.svg" selected="/images/icons/system_close-window.svg" />
                        </button>
                      </div>
                    </div>
                    <NavigationComponent />
                    <div className="content">
                      <Routes>
                        <Route path="/" element={<ConnectedDevicesPage />}></Route>
                        <Route path="/settings" element={<SettingsPage />}></Route>
                        <Route path="/rgbsync" element={<RGBSyncPage />}></Route>
                        <Route path="/device">
                          <Route index={true} element={<DevicePage />}></Route>
                          <Route path=":subpage" element={<DevicePage />}></Route>
                        </Route>
                        <Route path="/pairing" element={<PairingPage />}></Route>
                        {/* <Route path="/debug" element={<DebugPage lastDataSent={lastDataSent} mockDevices={[]} />}></Route>
                        <Route path="/component-showcase">
                          <Route index={true} element={<ComponentShowcasePage />}></Route>
                          <Route path=":subpage" element={<ComponentShowcasePage />}></Route>
                        </Route> */}
                      </Routes>
                    </div>
                    <UpdateDeviceComponent />
                    <UpdateManagerComponent />
                    <DebugOverlayComponent visible={showDebugOverlay}></DebugOverlayComponent>
                  </TranslationsContext>
              </RecordsContext>
            </CloudContext>
          </AppDataContext>
        </DevicesContext>
    </UIContext>
  </>
}

export default App;
