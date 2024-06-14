import { useContext, useEffect, useState } from 'react';
import OptionSelectComponent from '../../components/option-select/option-select.component';
import TooltipComponent from '../../components/tooltip/tooltip.component';
import { DeviceService } from '@renderer/services/device.service';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import RangeComponent from '@renderer/components/range/range.component';
import { useUIUpdateContext } from '@renderer/contexts/ui.context';
import { DisplayOption } from '@renderer/data/display-option';
import { StandbyTypes } from '@renderer/data/standby-type';

function KeyboardPerformanceManagementPage(props: any) {
    const devicesContext = useDevicesContext();
    const translate = useTranslate();

    const {
        getCurrentProfile,
        setPollingRate,
        setInputLatency,
        setRotarySensitivity,
        setStandbyType,
        setStandbyValue,
    } = useDevicesManagementContext();

    const pollingRateOptions = devicesContext.previewDevice?.pollingRates.map((option: DisplayOption, index) => {
        return { value: option.value, label: translate(option.translationKey, option.data?.translationFallback) };
    });
    const inputLatencyOptions = devicesContext.previewDevice?.inputLatencies.map((option: DisplayOption, index) => {
        return { value: option.value, label: translate(option.translationKey, option.data?.translationFallback) };
    });

    return (
        <>
            <div className="panel performance keyboard">
                <div className="properties">
                    <label className="field polling-rate">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Performance_Label_PollingRate', 'Polling Rate')}
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
                            value={getCurrentProfile()?.pollingrate}
                            onChange={(value) => {
                                setPollingRate(value);
                            }}
                            direction="below"
                        />
                        <span className="result"></span>
                    </label>
                    {devicesContext.previewDevice?.deviceCategoryName == 'Numpad' ? (
                        <label className="field standby">
                            <span className="label">
                                <span className="text">{translate('Device_Performance_Label_Standby', 'Standby')}</span>
                                {getCurrentProfile() == null ? (
                                    <></>
                                ) : getCurrentProfile().standbyvalue == 1 ? (
                                    <TooltipComponent>
                                        <header>{translate('Tooltip_InheritGlobal_Title', 'Inherit Global')}</header>
                                        <div className="message">
                                            {translate(
                                                'Tooltip_InheritGlobal_Description',
                                                'The device will adhere to the global standby timer setting.',
                                            )}
                                        </div>
                                    </TooltipComponent>
                                ) : (
                                    <TooltipComponent>
                                        <header>{translate('Tooltip_DeviceSpecific_Title', 'Device Specific')}</header>
                                        <div className="message">
                                            {translate(
                                                'Tooltip_DeviceSpecific_Description',
                                                'The device standby timer will be independent of the global standby timer.',
                                            )}
                                        </div>
                                    </TooltipComponent>
                                )}
                            </span>
                            <OptionSelectComponent
                                options={StandbyTypes.map((option) => {
                                    return {
                                        value: option.value,
                                        label: translate(option.translationKey, option.data?.translationFallback),
                                    };
                                })}
                                onChange={(value) => {
                                    setStandbyType(value);
                                }}
                                direction="below"
                            />
                            <RangeComponent
                                value={getCurrentProfile()?.standbyvalue}
                                min={0}
                                max={16}
                                step={2}
                                onChange={(value) => {
                                    setStandbyValue(value);
                                }}
                            />
                            <span className="result">{getCurrentProfile()?.standbyvalue}ms</span>
                        </label>
                    ) : null}
                    <label className="field input-latency">
                        <span className="label">
                            <span className="text">
                                {translate('Device_Performance_Label_InputLatency', 'Input Latency')}
                            </span>
                            <TooltipComponent>
                                <header>{translate('Tooltip_InputLatency_Title', 'Input Latency')}</header>
                                <div className="message">
                                    {translate(
                                        'Tooltip_InputLatency_Description',
                                        'Input latency is the amount of time that passes between sending an electrical signal and the occurrence of a corresponding action.',
                                    )}
                                </div>
                            </TooltipComponent>
                        </span>
                        <OptionSelectComponent
                            options={inputLatencyOptions}
                            value={getCurrentProfile()?.inputLatency}
                            onChange={(value) => {
                                setInputLatency(value);
                            }}
                            direction="above"
                        />
                        <span className="result"></span>
                    </label>
                    {devicesContext.previewDevice?.deviceCategoryName == 'Numpad' ? (
                        <label className="field rotary-sensitivity">
                            <span className="label">
                                <span className="text">
                                    {translate('Device_Performance_Label_RotarySensitivity', 'Rotary Sensitivity')}
                                </span>
                                <TooltipComponent>
                                    <header>
                                        {translate('Tooltip_RotarySensitivity_Title', 'Rotary Sensitivity')}
                                    </header>
                                    <div className="message">
                                        {translate(
                                            'Tooltip_RotarySensitivity_Description',
                                            'Rotary Sensitivity controls the adjust increment between each step.',
                                        )}
                                    </div>
                                </TooltipComponent>
                            </span>
                            <RangeComponent
                                value={getCurrentProfile()?.sensitivity}
                                min={0}
                                max={16}
                                step={2}
                                onChange={(value) => {
                                    setRotarySensitivity(value);
                                }}
                            />
                            <span className="result">{getCurrentProfile()?.sensitivity}ms</span>
                        </label>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default KeyboardPerformanceManagementPage;
