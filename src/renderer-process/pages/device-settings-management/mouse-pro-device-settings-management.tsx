import { useEffect, useRef, useState } from 'react';
import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import TooltipComponent from '@renderer/components/tooltip/tooltip.component';
import { DeviceService } from '@renderer/services/device.service';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { DisplayOption } from '@renderer/data/display-option';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import ContentDialogComponent from '@renderer/components/content-dialog/content-dialog.component';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { ICONS, iconSrc } from '@renderer/utils/icons';

function MouseProDeviceSettingsManagementPage(props: any) {
    const devicesContext = useDevicesContext();
    const { getCurrentProfile } = useDevicesManagementContext();
    const translate = useTranslate();
    const uiContext = useUIContext();
    const { openAdvDebounce, closeAdvDebounce } = useUIUpdateContext();
    const {
        setPollingRate,
        setWirelessPollingRate,
        setLiftOffDistance,
        setDebounceTime,
        setIsMotionSyncActive,
        setSeparatePollingActive,
        setAdvDebounceActive,
        setLiftOffPressTime,
        setAfterPressTime,
        setBeforePressTime,
        setAfterReleaseTime,
        setBeforeReleaseTime,
    } = useDevicesManagementContext();
    const advDialogRef = useRef<HTMLDivElement>(null);

    const pollingRateOptions = devicesContext.previewDevice?.pollingRates.map((option: DisplayOption, index) => {
        return { value: option.value, label: translate(option.translationKey, option.data?.translationFallback) };
    });
    const wirelessPollingRateOptions = devicesContext.previewDevice?.wirelessPollingRates.map(
        (option: DisplayOption, index) => {
            return { value: option.value, label: translate(option.translationKey, option.data?.translationFallback) };
        },
    );
    const liftOffDistanceOptions = devicesContext.previewDevice?.liftoffDistances.map(
        (option: DisplayOption, index) => {
            return { value: option.value, label: translate(option.translationKey, option.data?.translationFallback) };
        },
    );

    return (
        <>
            <div className="panel settings mouse">
                <div className="column nogap">
                    <label className="field polling-rate">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Settings_Label_PollingRate', 'Polling Rate')}
                            </span>
                            <TooltipComponent>
                                <header>{translate('Tooltip_PollingRate_Title', 'Polling Rate')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_PollingRate_Description',
                                        'Polling Rate is how often your OS checks for input. This is a factor in determining the maximum input latency of key presses. A high polling rate takes up more CPU resources than lower polling rates.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <OptionSelectComponent
                            options={pollingRateOptions}
                            value={getCurrentProfile()?.performance?.pollingratearray[0]}
                            onChange={(value) => {
                                setPollingRate(value);
                            }}
                        />
                        <span className="result"></span>
                    </label>
                    <label
                        className="field polling-rate"
                        style={
                            {
                                opacity: getCurrentProfile()?.performance?.pollingrateSelect == true ? 1 : 0,
                                height: getCurrentProfile()?.performance?.pollingrateSelect == true ? 'auto' : '0',
                            } as React.CSSProperties
                        }
                    >
                        <span className="label">
                            <span className="text">
                                {translate('Device_Settings_Label_WirelessPollingRate', 'Wireless Polling Rate')}
                            </span>
                            {/* <TooltipComponent>
                                <header>{translate('Tooltip_WirelessPollingRate_Title', 'Wireless Polling Rate')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_WirelessPollingRate_Description',
                                        'Wireless polling rates are capped for some models.',
                                    )}
                                </div>
                            </TooltipComponent> */}
                        </span>
                        <OptionSelectComponent
                            options={wirelessPollingRateOptions}
                            value={getCurrentProfile()?.performance?.pollingratearray[1]}
                            onChange={(value) => {
                                setWirelessPollingRate(value);
                            }}
                        />
                        <span className="result"></span>
                    </label>
                    <label
                        className="field separate-polling"
                        style={
                            {
                                marginTop:
                                    getCurrentProfile()?.performance?.pollingrateSelect == false ? '57px' : '0px',
                                padding:
                                    getCurrentProfile()?.performance?.pollingrateSelect == false
                                        ? '10px'
                                        : '7px 10px 10px 10px',
                            } as React.CSSProperties
                        }
                    >
                        <span className="label">
                            <span className="text">
                                {translate(
                                    'Device_Settings_Label_SeparatePollingRate',
                                    'Separate polling for wired/wireless',
                                )}
                            </span>
                        </span>
                        <ToggleComponent
                            value={getCurrentProfile()?.performance?.pollingrateSelect}
                            onChange={(value) => {
                                setSeparatePollingActive(value);
                            }}
                        />
                    </label>
                </div>
                <div className="column">
                    <label className="field debounce-time">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Settings_Label_DebounceTime', 'Debounce Time')}
                            </span>
                            {/* <TooltipComponent>
                                <header>{translate('Tooltip_DebounceTime_Title', 'Debounce Time')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_DebounceTime_Description',
                                        'Debounce Time is a delay in detecting clicks after an initial click.',
                                    )}
                                </div>
                            </TooltipComponent> */}
                        </span>
                        <span className="result">{getCurrentProfile()?.performance?.DebounceValue}ms</span>
                        <span className="debounce-desc">
                            {translate(
                                'Tooltip_DebounceTime_Description',
                                'Debounce Time is a delay in detecting clicks after an initial click.',
                            )}
                        </span>
                        <RangeComponent
                            value={getCurrentProfile()?.performance?.DebounceValue}
                            min={0}
                            max={16}
                            step={2}
                            onChange={(value) => {
                                setDebounceTime(value);
                            }}
                        />
                    </label>
                    <label className="field advanced-settings">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Settings_Label_Advanced_Settings', 'Advanced Settings')}
                            </span>
                            <TooltipComponent>
                                <header>
                                    {translate('Tooltip_AdvancedDebounce_Title', 'Advanced Debounce Settings')}
                                </header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_AdvancedDebounce_Description',
                                        'Select this option so that you can further specify when and where your debounce timers are triggered. All debounce options are applied to all buttons on the mouse.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <div className="adv-edit-container">
                            <ToggleComponent
                                value={getCurrentProfile()?.performance?.AdvancedDebounce?.AdvancedSwitch || false}
                                onChange={(value) => {
                                    setAdvDebounceActive(value);
                                }}
                            />
                            <button className="hollow edit-adv-debounce" onClick={() => openAdvDebounce()}>
                                Edit
                            </button>
                        </div>
                    </label>
                </div>
                <div className="column">
                    <label className="field lift-off">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Settings_Label_LiftOffDistance', 'Lift-off Distance')}
                            </span>
                            <TooltipComponent>
                                <header>{translate('Tooltip_LiftOffDistance_Title', 'Lift Off Distance')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_LiftOffDistance_Description',
                                        'Lift-off Distance is how far the mouse sensor has to be from the valueJ or surface to stop tracking.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <OptionSelectComponent
                            options={liftOffDistanceOptions}
                            value={getCurrentProfile()?.performance?.LodValue}
                            onChange={(value) => {
                                setLiftOffDistance(value);
                            }}
                        />
                        <span className="result"></span>
                    </label>
                    <label className="field pro-motion-sync">
                        <span className="label">
                            <span className="text">{translate('Device_Settings_Label_MotionSync', 'Motion Sync')}</span>
                            <TooltipComponent>
                                <header>{translate('Tooltip_MotionSync_Title', 'Motion Sync')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_MotionSync_Description',
                                        'Motion Sync optimizes mouse tracking by synchronizing sensor and USB polling events.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <ToggleComponent
                            value={getCurrentProfile()?.performance?.MotionSyncFlag}
                            onChange={(value) => {
                                setIsMotionSyncActive(value);
                            }}
                        />
                    </label>
                </div>

                <div className="adv-debounce-settings-container" ref={advDialogRef}>
                    <ContentDialogComponent
                        className="adv-debounce-dialog"
                        title={translate('Dialog_AdvancedDebounceSettings_Title', 'Advanced Debounce Settings')}
                        icon={
                            <SVGIconComponent
                                className="adv-debounce-close"
                                onClick={() => closeAdvDebounce()}
                                src={iconSrc(ICONS.closeModal)}
                                selected={iconSrc(ICONS.closeModalHover)}
                            />
                        }
                        open={uiContext.advDebounce_isOpen}
                        actions={[]}
                    >
                        <div className="adv-debounce-modal">
                            <div className="column">
                                <label className="field press-time">
                                    <span className="label group">
                                        <span className="text">
                                            {translate('Device_Settings_Label_PressTime', 'Press Time')}
                                        </span>
                                    </span>
                                    <span className="presstime-desc">
                                        {translate(
                                            'Tooltip_PressTime_Description',
                                            'Adjust debounce delay at the exact moment you begin pressing or have fully pressed the mouse button.',
                                        )}
                                    </span>
                                    <span className="mini-label before-press">
                                        <span className="text">
                                            {translate('Device_Settings_Label_BeforePress', 'Before Press')}
                                        </span>
                                    </span>
                                    <span className="result before-press">
                                        {getCurrentProfile()?.performance?.AdvancedDebounce.BeforePressValue}ms
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.performance?.AdvancedDebounce.BeforePressValue}
                                        min={0}
                                        max={16}
                                        step={2}
                                        onChange={(value) => {
                                            setBeforePressTime(value);
                                        }}
                                    />
                                    <span className="mini-label after-press">
                                        <span className="text">
                                            {translate('Device_Settings_Label_AfterPress', 'After Press')}
                                        </span>
                                    </span>
                                    <span className="result after-press">
                                        {getCurrentProfile()?.performance?.AdvancedDebounce.AfterPressValue}ms
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.performance?.AdvancedDebounce.AfterPressValue}
                                        min={0}
                                        max={16}
                                        step={2}
                                        onChange={(value) => {
                                            setAfterPressTime(value);
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="column">
                                <label className="field release-time">
                                    <span className="label group">
                                        <span className="text">
                                            {translate('Device_Settings_Label_ReleaseTime', 'Release Time')}
                                        </span>
                                    </span>
                                    <span className="releasetime-desc">
                                        {translate(
                                            'Tooltip_ReleaseTime_Description',
                                            'Adjust debounce delay at the exact moment you begin releasing, or have fully released the mouse button.',
                                        )}
                                    </span>
                                    <span className="mini-label before-release">
                                        <span className="text">
                                            {translate('Device_Settings_Label_BeforeRelease', 'Before Release')}
                                        </span>
                                    </span>
                                    <span className="result before-release">
                                        {getCurrentProfile()?.performance?.AdvancedDebounce.BeforeReleaseValue}ms
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.performance?.AdvancedDebounce.BeforeReleaseValue}
                                        min={0}
                                        max={16}
                                        step={2}
                                        onChange={(value) => {
                                            setBeforeReleaseTime(value);
                                        }}
                                    />
                                    <span className="mini-label after-release">
                                        <span className="text">
                                            {translate('Device_Settings_Label_AfterRelease', 'After Release')}
                                        </span>
                                    </span>
                                    <span className="result after-release">
                                        {getCurrentProfile()?.performance?.AdvancedDebounce.AfterReleaseValue}ms
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.performance?.AdvancedDebounce.AfterReleaseValue}
                                        min={0}
                                        max={16}
                                        step={2}
                                        onChange={(value) => {
                                            setAfterReleaseTime(value);
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="column">
                                <label className="field lift-off-press">
                                    <span className="label group">
                                        <span className="text">
                                            {translate('Device_Settings_Label_LiftOffPressTime', 'Lift-off Press Time')}
                                        </span>
                                    </span>
                                    <span className="result">
                                        {getCurrentProfile()?.performance?.AdvancedDebounce.LiftOffPressValue}ms
                                    </span>
                                    <span className="lift-off-press-desc">
                                        {translate(
                                            'Tooltip_LiftOffPressTime_Description',
                                            'Adjust debounce delay at the exact moment you have lifted and placed the mouse back down on the surface.',
                                        )}
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.performance?.AdvancedDebounce.LiftOffPressValue}
                                        min={0}
                                        max={16}
                                        step={2}
                                        onChange={(value) => {
                                            setLiftOffPressTime(value);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </ContentDialogComponent>
                </div>
            </div>
        </>
    );
}

export default MouseProDeviceSettingsManagementPage;
