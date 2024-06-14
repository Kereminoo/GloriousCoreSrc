import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import TooltipComponent from '@renderer/components/tooltip/tooltip.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useMemo } from 'react';
import { ProfileData } from '../../../common/data/records/device-data.record';

function MouseDeviceSettingsManagementPage() {
    const { previewDevice } = useDevicesContext();
    const { getCurrentProfile } = useDevicesManagementContext();
    const translate = useTranslate();

    const { setPollingRate, setLiftOffDistance, setDebounceTime, setIsMotionSyncActive } =
        useDevicesManagementContext();

    const { pollingRate, liftOffDistance, debounceTime, motionSyncEnable } = useMemo(() => {
        const performance = (getCurrentProfile() as ProfileData)?.performance;
        if (!performance) return { pollingRate: 0, liftOffDistance: 0, debounceTime: 0, motionSyncEnable: false };
        return {
            pollingRate: performance.pollingrate,
            liftOffDistance: performance.LodValue,
            debounceTime: performance.DebounceValue,
            motionSyncEnable: performance.MotionSyncFlag ?? false,
        };
    }, [previewDevice]);

    const pollingRateOptions = useMemo(() => {
        let pollingRateOptions: Array<{ value: any; label: string }> = [];
        if (previewDevice?.pollingRates != null) {
            pollingRateOptions = previewDevice.pollingRates.flatMap((option) => {
                return {
                    value: option.value,
                    label: translate(option.translationKey, option.data?.translationFallback) ?? '',
                };
            });
        }

        return pollingRateOptions;
    }, [previewDevice?.pollingRates]);

    const liftOffDistanceOptions = useMemo(() => {
        let liftOffDistanceOptions: Array<{ value: any; label: string }> = [];
        if (previewDevice?.liftoffDistances != null) {
            liftOffDistanceOptions = previewDevice.liftoffDistances.flatMap((option) => {
                return {
                    value: option.value,
                    label: translate(option.translationKey, option.data?.translationFallback) ?? '',
                };
            });
        }
        return liftOffDistanceOptions;
    }, [previewDevice?.liftoffDistances]);

    return (
        <>
            <div className="panel settings mouse">
                <div className="column">
                    <label className="field">
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
                            value={pollingRate}
                            onChange={(value: number) => {
                                setPollingRate(value);
                            }}
                        />
                        <span className="result"></span>
                    </label>
                    <label className="field motion-sync">
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
                            value={motionSyncEnable}
                            onChange={(value: boolean) => {
                                setIsMotionSyncActive(value);
                            }}
                        />
                    </label>
                </div>
                <div className="column">
                    <label className="field">
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
                            value={liftOffDistance}
                            onChange={(value: number) => {
                                setLiftOffDistance(value);
                            }}
                        />
                        <span className="result"></span>
                    </label>
                </div>
                <div className="column">
                    <label className="field debounce-time">
                        <span className="label">
                            {translate('Device_Settings_Label_DebounceTime', 'Debounce Time')}
                        </span>
                        <span className="result">{debounceTime}ms</span>
                        <TooltipComponent className="tooltip">
                            <header>{translate('Tooltip_DebounceTime_Title', 'Debounce Time')}</header>
                            <div className="message">
                                {translate(
                                    'Tooltip_DebounceTime_Description',
                                    'Debounce Time is a delay in detecting clicks after an initial click.',
                                )}
                            </div>
                        </TooltipComponent>
                        <RangeComponent
                            value={debounceTime}
                            min={0}
                            max={16}
                            step={2}
                            onChange={(value: number) => {
                                setDebounceTime(value);
                            }}
                        />
                    </label>
                </div>
            </div>
        </>
    );
}

export default MouseDeviceSettingsManagementPage;
