import TooltipComponent from '../../components/tooltip/tooltip.component';
import { useTranslate } from '@renderer/contexts/translations.context';
import ToggleComponent from '@renderer/components/toggle/toggle.component';
import RangeComponent from '@renderer/components/range/range.component';
import './actuation-management.page.css';
import { useUIContext } from '@renderer/contexts/ui.context';
import { useDevicesManagementContext } from '../../contexts/devices.context';
import { CSSProperties, useMemo } from 'react';

enum TravelLimits {
    ActuationStart = 0.2,
    ActuationDelta = 3.8,
    RapidTriggerStart = 0.2,
    RapidTriggerDelta = 2.3,
}

function ActuationManagementPage(props: any) {
    const translate = useTranslate();
    // const { actuationCurrentValue, actuationSelectedNodes, isActuationPerKey, isRapidTriggerPerKey } = useUIContext();
    const { valueCState } = useUIContext();
    const { setvalueCState, setvalueCVisualizationState } = useDevicesManagementContext();

    const toggleActuationPerKey = () => {
        valueCState.isActuationPerKey = !valueCState.isActuationPerKey;
        setvalueCState(valueCState);
    };
    const setActuationPressValue = (value: number) => {
        if (valueCState.isActuationPerKey) {
            valueCState.actuationTmpPress = value;
        } else {
            valueCState.actuationGlobalPress = value;
        }
        setvalueCState(valueCState);
    };

    const setActuationReleaseValue = (value: number) => {
        if (valueCState.isActuationPerKey) {
            valueCState.actuationTmpRelease = value;
        } else {
            valueCState.actuationGlobalRelease = value;
        }
        setvalueCState(valueCState);
    };

    const getActuationPressValue = () => {
        return valueCState.isActuationPerKey ? valueCState.actuationTmpPress : valueCState.actuationGlobalPress;
    };

    const getActuationReleaseValue = () => {
        return valueCState.isActuationPerKey
            ? valueCState.actuationTmpRelease
            : valueCState.actuationGlobalRelease;
    };

    const getActuationUIValue = (value: number) => {
        return (value * 0.01 * TravelLimits.ActuationDelta + TravelLimits.ActuationStart).toFixed(1);
    };

    const setRapidTriggerEnabled = (value: boolean) => {
        valueCState.isRapidTriggerEnabled = value;
        setvalueCState(valueCState);
    };
    const toggleRapidTriggerPerKey = () => {
        valueCState.isRapidTriggerPerKey = !valueCState.isRapidTriggerPerKey;
        setvalueCState(valueCState);
    };
    const setRapidTriggerPressValue = (value: number) => {
        if (valueCState.isRapidTriggerPerKey) {
            valueCState.rapidTriggerTmpPress = value;
        } else {
            valueCState.rapidTriggerGlobalPress = value;
        }
        setvalueCState(valueCState);
    };
    const getRapidTriggerPressValue = () => {
        return valueCState.isRapidTriggerPerKey
            ? valueCState.rapidTriggerTmpPress
            : valueCState.rapidTriggerGlobalPress;
    };

    const setRapidTriggerReleaseValue = (value: number) => {
        if (valueCState.isRapidTriggerPerKey) {
            valueCState.rapidTriggerTmpRelease = value;
        } else {
            valueCState.rapidTriggerGlobalRelease = value;
        }
        setvalueCState(valueCState);
    };

    const getRapidTriggerReleaseValue = () => {
        return valueCState.isRapidTriggerPerKey
            ? valueCState.rapidTriggerTmpRelease
            : valueCState.rapidTriggerGlobalRelease;
    };
    const getRapidTriggerUIValue = (value: number) => {
        return (value * 0.01 * TravelLimits.RapidTriggerDelta + TravelLimits.RapidTriggerStart).toFixed(1);
    };

    const columnStyle = useMemo(() => {
        if (valueCState.isRapidTriggerPerKey || valueCState.isActuationPerKey) {
            return { ['gridTemplateColumns']: '1fr 270px 240px' } as CSSProperties;
        }
        return { ['gridTemplateColumns']: '1fr 270px' } as CSSProperties;
    }, [valueCState.isRapidTriggerPerKey, valueCState.isActuationPerKey]);

    return (
        <>
            <div className="layout actuation keyboard" style={columnStyle}>
                <div className="panel main">
                    <div className="column">
                        <label className="field">
                            <span className="label label-with-action">
                                <h3 className="text">
                                    {translate(
                                        'Device_Actuation_Label_CustomActuationPoint_Header',
                                        'Custom Actuation Point',
                                    )}
                                </h3>
                                <TooltipComponent>
                                    <header>
                                        {translate(
                                            'Device_Actuation_Label_CustomActuationPoint_Header',
                                            'Custom Actuation Point',
                                        )}
                                    </header>
                                    <div className="message">
                                        {translate(
                                            'Device_Actuation_Label_CustomActuationPoint_Description2',
                                            'Selecting the button below will allow you to edit the actuation point on a per key basis.',
                                        )}
                                    </div>
                                </TooltipComponent>
                            </span>
                        </label>
                        <p>
                            {translate(
                                'Device_Actuation_Label_CustomActuationPoint_Description1',
                                'Use the slider to set the point where any keypress will activate.',
                            )}
                        </p>
                        <p>
                            {translate(
                                'Device_Actuation_Label_CustomActuationPoint_Description2',
                                'Selecting the button below will allow you to edit the actuation point on a per key basis.',
                            )}
                        </p>
                        <label className="field visualisation-toggle">
                            <ToggleComponent
                                value={valueCState.isVisualisationEnabled}
                                onChange={(value: boolean) => setvalueCVisualizationState(value)}
                            />{' '}
                            {translate('Device_Actuation_Label_ShowVisualization', 'Show Visualization')}
                        </label>
                        <button type="button" className="hollow" onClick={() => toggleActuationPerKey()}>
                            <span className="label">
                                {valueCState.isActuationPerKey
                                    ? 'Revert to Global'
                                    : translate('Button_Actuation_PerKey', 'Per Key')}
                            </span>
                        </button>
                    </div>
                    <div className="column slider-column">
                        {!valueCState.isVisualisationEnabled ? (
                            <div className="key-press-slider">
                                <RangeComponent
                                    value={getActuationPressValue()}
                                    className="gauge"
                                    onChange={(value) => setActuationPressValue(value)}
                                >
                                    <div className="gauge-tooltip">
                                        {getActuationUIValue(getActuationPressValue())} mm
                                    </div>
                                </RangeComponent>
                            </div>
                        ) : (
                            <div className="key-press-slider">
                                <RangeComponent value={valueCState.visualisationDisplayValue} className="gauge">
                                    <div className="gauge-tooltip">
                                        {(valueCState.visualisationDisplayValue / 100) *
                                            (TravelLimits.ActuationStart + TravelLimits.ActuationDelta)}{' '}
                                        mm
                                    </div>
                                </RangeComponent>
                            </div>
                        )}
                    </div>
                </div>
                <div className="panel second">
                    <div className="column">
                        <label className="field title">
                            <span className="label label-with-action">
                                <h3 className="text">
                                    {translate('Device_Actuation_Label_RapidTrigger_Title', 'Rapid Trigger')}
                                </h3>
                                <TooltipComponent>
                                    <header>
                                        {translate('Device_Actuation_Label_RapidTrigger_Title', 'Rapid Trigger')}
                                    </header>
                                    <div className="message">
                                        {translate(
                                            'Device_Actuation_Label_RapidTrigger_Description',
                                            'Use the slider to set the point where any keypress will activate.',
                                        )}
                                    </div>
                                </TooltipComponent>
                            </span>
                        </label>
                        <label className="field rapid-toggle">
                            <ToggleComponent
                                value={valueCState.isRapidTriggerEnabled}
                                onChange={(value: boolean) => setRapidTriggerEnabled(value)}
                            />
                        </label>
                        {!valueCState.isRapidTriggerEnabled ? (
                            <p>
                                {translate(
                                    'Device_Actuation_Label_RapidTrigger_Description',
                                    'Use the slider to set the point where any keypress will activate.',
                                )}
                            </p>
                        ) : (
                            <button type="button" className="hollow" onClick={() => toggleRapidTriggerPerKey()}>
                                <span className="label">
                                    {valueCState.isRapidTriggerPerKey
                                        ? 'Revert to Global'
                                        : translate('Button_Actuation_PerKey', 'Per Key')}
                                </span>
                            </button>
                        )}
                    </div>
                    {valueCState.isRapidTriggerEnabled && (
                        <>
                            <div className="column rapid-trigger-value">
                                <div className="key-press-slider">
                                    <RangeComponent
                                        value={getRapidTriggerPressValue()}
                                        className="gauge"
                                        onChange={(value) => setRapidTriggerPressValue(value)}
                                    >
                                        <div className="gauge-tooltip">
                                            {getRapidTriggerUIValue(getRapidTriggerPressValue())} mm
                                        </div>
                                    </RangeComponent>
                                    <p className={'label'}>Press</p>
                                </div>
                            </div>
                            <div className="column rapid-trigger-value">
                                <div className="key-press-slider">
                                    <RangeComponent
                                        value={getRapidTriggerReleaseValue()}
                                        className="gauge"
                                        onChange={(value) => setRapidTriggerReleaseValue(value)}
                                    >
                                        <div className="gauge-tooltip">
                                            {getRapidTriggerUIValue(getRapidTriggerReleaseValue())} mm
                                        </div>
                                    </RangeComponent>
                                    <p className={'label'}>Release</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {(valueCState.isRapidTriggerPerKey || valueCState.isActuationPerKey) && (
                    <div className="panel third">
                        <ul>
                            {valueCState.actuationSelectedNodes?.layers?.map((layer) => (
                                <li>
                                    ++
                                    <div>
                                        {layer.nodes.map((keys) => keys.nodeDefinition.translationKey).join(', ')}
                                    </div>
                                    {valueCState.isActuationPerKey && (
                                        <div>{getActuationUIValue(layer.actuationPress)} mm</div>
                                    )}
                                    {valueCState.isRapidTriggerPerKey && (
                                        <div>{getRapidTriggerUIValue(layer.rapidTriggerPress)} mm</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default ActuationManagementPage;
