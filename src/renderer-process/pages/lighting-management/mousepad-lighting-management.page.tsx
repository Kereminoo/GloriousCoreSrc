import { useEffect, useState } from 'react';
import ColorPickerComponent from '../../components/color-picker/color-picker.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import OptionSelectComponent from '@renderer/components/option-select/option-select.component';
import ContentDialogComponent from '@renderer/components/content-dialog/content-dialog.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { DisplayOption } from '@renderer/data/display-option';
import { useTranslate } from '@renderer/contexts/translations.context';
import ToggleChoiceComponent from '@renderer/components/toggle-choice/toggle-choice.component';
import { ColorSettingStyle } from '@renderer/data/color-setting-style';

const colorPickerIndexes = [2, 3, 4, 6];

const indexesOfLightingEffectsWithRGBGradients = [1, 2, 5, 6, 7];
const indexesOfLightingEffectsWithCustomColorSelection = [1, 2, 3, 4, 5, 6, 7];

function valueJLightingManagementPage(props: any) {
    const devicesContext = useDevicesContext();
    const {
        getCurrentProfile,
        setvalueJLightingEffect,
        setvalueJLightingColor,
        setvalueJWiredBrightness,
        setvalueJRate,
        setvalueJZoneSelected,
    } = useDevicesManagementContext();

    const uiContext = useUIContext();
    const { setColor_PresetColorPicker, setColor_ModalColorPicker, setLightingColorStyle } = useUIUpdateContext();

    const translate = useTranslate();
    const [presetEffectOptions, setPresetEffectOptions] = useState<any[]>([]);
    const [currentGradient, setCurrentGradient] = useState<DisplayOption>();
    const [colorDialogIsOpen, setColorDialogIsOpen] = useState(false);

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Profile is undefined');
        }

        setPresetEffectOptions(
            devicesContext.previewDevice.lightingEffects.map((item) => {
                return {
                    value: item.value,
                    label: translate(item.translationKey, item.data?.translationFallback),
                };
            }),
        );
        // console.log(profile.lighting.Color)

        // selected gradient isn't stored; only colors;
        // determine gradient selection by the colors
        for (let i = 0; i < devicesContext.previewDevice.rgbGradients.length; i++) {
            const gradient = devicesContext.previewDevice.rgbGradients[i];

            const stops = gradient.data?.stops;
            if (stops == null) {
                console.log('stops == null');
                // todo;
                return;
            }

            let foundMismatch = false;
            for (let j = 0; j < stops.length; j++) {
                if (profile.lighting?.Color[j] == null) {
                    foundMismatch = true;
                    break;
                }
                const profileColor = RGBAColor.fromRGB(
                    profile.lighting?.Color[j].R,
                    profile.lighting?.Color[j].G,
                    profile.lighting?.Color[j].B,
                );
                if (profileColor.toHex() != stops[j].hex.toLowerCase()) {
                    foundMismatch = true;
                    break;
                }
            }
            if (foundMismatch) {
                continue;
            }

            setCurrentGradient(gradient);

            break;
        }
    }, [devicesContext.previewDevice]);

    return (
        <>
            <div className={'layout lighting valueJ'}>
                <div className="panel main">
                    <header>
                        <div className="title">{translate('Device_Lighting_Label_Effect', 'Effect')}</div>
                    </header>
                    <OptionSelectComponent
                        options={presetEffectOptions}
                        value={getCurrentProfile()?.lightData[getCurrentProfile()?.lighting.Zone]?.Effect}
                        onChange={(value) => {
                            setvalueJLightingEffect(parseInt(value));
                        }}
                    />

                    {!isNaN(getCurrentProfile()?.lighting?.Effect) &&
                    indexesOfLightingEffectsWithRGBGradients.indexOf(getCurrentProfile().lighting.Effect) != -1 &&
                    indexesOfLightingEffectsWithCustomColorSelection.indexOf(getCurrentProfile().lighting.Effect) !=
                        -1 ? (
                        <div className="setting color-setting-style">
                            <label className="color-type">
                                <ToggleChoiceComponent
                                    choice={
                                        uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient' ? 'a' : 'b'
                                    }
                                    choiceAContent={
                                        <>
                                            {translate(
                                                ColorSettingStyle[1].translationKey,
                                                ColorSettingStyle[1].data.translationFallback,
                                            )}
                                        </>
                                    }
                                    choiceBContent={
                                        <>
                                            {translate(
                                                ColorSettingStyle[0].translationKey,
                                                ColorSettingStyle[0].data.translationFallback,
                                            )}
                                        </>
                                    }
                                    disableChoiceA={!uiContext.lightingSelectedPreset?.data?.enableGradients}
                                    disableChoiceB={!uiContext.lightingSelectedPreset?.data?.enableColorSelection}
                                    onChange={(choice) => {
                                        choice == 'a'
                                            ? setLightingColorStyle(ColorSettingStyle[1])
                                            : setLightingColorStyle(ColorSettingStyle[0]);
                                    }}
                                />
                            </label>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="controls">
                        <div className="field">
                            <span className="label">
                                <button
                                    type="button"
                                    className={`${getCurrentProfile()?.lighting?.Zone == 0 ? ' selected' : ' unselected'}`}
                                    onClick={() => {
                                        setvalueJZoneSelected(0);
                                    }}
                                >
                                    {translate('Button_AllZones', 'All Zones')}
                                </button>
                                <button
                                    type="button"
                                    className={`${getCurrentProfile()?.lighting?.Zone == 1 ? ' selected' : ' unselected'}`}
                                    onClick={() => {
                                        setvalueJZoneSelected(1);
                                    }}
                                >
                                    {translate('Button_Zone1', 'Zone 1')}
                                </button>
                                <button
                                    type="button"
                                    className={`${getCurrentProfile()?.lighting?.Zone == 2 ? ' selected' : ' unselected'}`}
                                    onClick={() => {
                                        setvalueJZoneSelected(2);
                                    }}
                                >
                                    {translate('Button_Zone2', 'Zone 2')}
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="panel second">
                    <div className="controls">
                        <label className="field">
                            <span className="label">
                                {`${translate('Device_Lighting_Label_Brightness_WiredPrefix', 'Wired')} `}
                                {translate('Device_Lighting_Label_Brightness', 'Brightness')}
                                <span className="result">
                                    {
                                        getCurrentProfile()?.lightData[getCurrentProfile()?.lighting.Zone]
                                            .WiredBrightnessValue
                                    }
                                    &#x25;
                                </span>
                            </span>
                            <RangeComponent
                                value={
                                    getCurrentProfile()?.lightData[getCurrentProfile()?.lighting.Zone]
                                        .WiredBrightnessValue
                                }
                                onChange={(value) => {
                                    setvalueJWiredBrightness(value);
                                }}
                            />
                        </label>
                        <label className="field">
                            <span className="label">
                                {translate('Device_Lighting_Label_Rate', 'Rate')}
                                <span className="result">
                                    {getCurrentProfile()?.lightData[getCurrentProfile()?.lighting.Zone].RateValue}&#x25;
                                </span>
                            </span>
                            <RangeComponent
                                value={getCurrentProfile()?.lightData[getCurrentProfile()?.lighting.Zone].RateValue}
                                onChange={(value) => {
                                    setvalueJRate(value);
                                }}
                            />
                        </label>
                    </div>
                </div>
                {getCurrentProfile()?.lighting?.Effect == 8 ? (
                    <></>
                ) : getCurrentProfile()?.lighting?.Effect != null &&
                  uiContext.lightingSelectedPreset?.data?.enableGradients &&
                  uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient' ? (
                    <div className="panel third">
                        <header>
                            <div className="title">
                                {translate('Device_Lighting_Label_RGBGradient', 'RGB Gradient')}
                            </div>
                        </header>
                        <div className="stack gradient-select">
                            {devicesContext.previewDevice?.rgbGradients.map((gradient, index) => (
                                <a
                                    key={index}
                                    className={`option${gradient == uiContext.lightingPresetGradient ? ' selected' : ''}`}
                                    title={translate(gradient.translationKey, gradient.data?.translationFallback)}
                                    onClick={() => {
                                        // setSelectedPresetGradient(gradient);
                                    }}
                                >
                                    <span className="name">
                                        {translate(gradient.translationKey, gradient.data?.translationFallback)}
                                    </span>
                                    <span
                                        className="gradient"
                                        style={{
                                            background: `linear-gradient(to right, ${gradient.data?.stops.reduce(
                                                (accumulatedString, stop, i) => {
                                                    const stopString =
                                                        stop.stop == undefined ? stop.hex : `${stop.hex} ${stop.stop}`;
                                                    if (i == gradient.data.stops.length - 1) {
                                                        accumulatedString += stopString;
                                                    } else {
                                                        accumulatedString += stopString + ', ';
                                                    }
                                                    return accumulatedString;
                                                },
                                                '',
                                            )})`,
                                        }}
                                    ></span>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : getCurrentProfile()?.lighting?.Effect != null &&
                  uiContext.lightingSelectedPreset?.data?.enableColorSelection &&
                  uiContext.lightingSelectedColorStyle?.optionKey == 'customColor' ? (
                    <div className="panel third color-picker">
                        <header>
                            <div className="title">{translate('ColorPicker_Label_ColorPicker', 'Color Picker')}</div>
                            <button
                                type="button"
                                onClick={() => {
                                    setColorDialogIsOpen(true);
                                }}
                            >
                                {translate('Button_Expand', 'Expand')}
                            </button>
                        </header>
                        <ColorPickerComponent
                            value={null}
                            onChange={(color: RGBAColor) => {
                                setColor_PresetColorPicker(color);

                                // const hexColor: string = (getCurrentProfile()?.lighting?.Color == null) ?
                                // "#ffff00"
                                // : (Array.isArray(getCurrentProfile()?.lighting?.Color)) ? getCurrentProfile().lighting.Color[0]
                                // : getCurrentProfile().lighting.Color;
                                setvalueJLightingColor(color.toHex());
                            }}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <ContentDialogComponent
                className="color"
                title={translate('Device_Lighting_Label_ColorPicker', 'Color Picker')}
                open={colorDialogIsOpen}
                actions={[
                    <button
                        type="button"
                        key={0}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                            // const hexColor: string = (getCurrentProfile()?.lighting?.Color == null) ?
                            // "#ffff00"
                            // : (Array.isArray(getCurrentProfile()?.lighting?.Color)) ? getCurrentProfile().lighting.Color[0]
                            // : getCurrentProfile().lighting.Color;
                            // setvalueJLightingColor(hexColor);
                        }}
                    >
                        {translate('Button_Cancel', 'Cancel')}
                    </button>,
                    <button
                        type="button"
                        key={1}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                            // const hexColor: string = (getCurrentProfile()?.lighting?.Color == null) ?
                            // "#ffff00"
                            // : (Array.isArray(getCurrentProfile()?.lighting?.Color)) ? getCurrentProfile().lighting.Color[0]
                            // : getCurrentProfile().lighting.Color;
                            // setvalueJLightingColor(hexColor);
                        }}
                    >
                        {translate('Button_Ok', 'Ok')}
                    </button>,
                ]}
            >
                <ColorPickerComponent
                    expanded={true}
                    value={null}
                    onChange={(color) => {
                        setColor_ModalColorPicker(color);
                        // const hexColor: string = (getCurrentProfile()?.lighting?.Color == null) ?
                        // "#ffff00"
                        // : (Array.isArray(getCurrentProfile()?.lighting?.Color)) ? getCurrentProfile().lighting.Color[0]
                        // : getCurrentProfile().lighting.Color;
                        // setvalueJLightingColor(hexColor);
                    }}
                />
            </ContentDialogComponent>
        </>
    );
}

export default valueJLightingManagementPage;
