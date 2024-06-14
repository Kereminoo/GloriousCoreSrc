import { useEffect, useMemo, useState } from 'react';
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
import { DevicePairableDevices } from '@renderer/adapters/devices.adapter';

const colorPickerIndexes = [2, 3, 4, 6];

const indexesOfLightingEffectsWithRGBGradients = [1, 2, 5, 6, 7];
const indexesOfLightingEffectsWithCustomColorSelection = [1, 2, 3, 4, 5, 6, 7];

function MouseLightingManagementPage(props: any) {
    const devicesContext = useDevicesContext();
    const {
        getCurrentProfile,
        setLightingEffect,
        setSeparateWiredWirelessBrightness,
        setWiredBrightness,
        setWirelessBrightness,
        setRate,
        setMouseLightingColor,
        setSelectedPresetGradient,
    } = useDevicesManagementContext();

    const uiContext = useUIContext();
    const { setColor_PresetColorPicker, setColor_ModalColorPicker, 
        // setLightingColorStyle
     } = useUIUpdateContext();

    const translate = useTranslate();
    const [presetEffectOptions, setPresetEffectOptions] = useState<any[]>([]);
    const [currentGradient, setCurrentGradient] = useState<DisplayOption>();
    const [colorDialogIsOpen, setColorDialogIsOpen] = useState(false);


    const colorArray = useMemo(() => {
        return getCurrentProfile()?.lighting?.Color ?? [];
    }, [getCurrentProfile()?.lighting?.Color]);

    const selectedColor = useMemo(()=>{
        if (colorArray.length <= uiContext.selectedColorIndex) {
            return new RGBAColor();
        }
        const color = colorArray[uiContext.selectedColorIndex];
        return RGBAColor.fromRGB(color.R, color.G, color.B);
    },[uiContext.selectedColorIndex])

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

    // useEffect(() =>
    // {
    //     setLightingColorStyle('customColor')
    // }, []);

    return (
        <>
            <div className={'layout lighting mouse preset'}>
                <div className="panel main">
                    <header>
                        <div className="title">{translate('Device_Lighting_Label_Effect', 'Effect')}</div>
                    </header>
                    <OptionSelectComponent
                        options={presetEffectOptions}
                        value={getCurrentProfile()?.lighting?.Effect}
                        onChange={(value) => {
                            setLightingEffect(parseInt(value));
                        }}
                    />

                    {/* {!isNaN(getCurrentProfile()?.lighting?.Effect) &&
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
                    )} */}
                    {devicesContext.previewDevice?.SN &&
                    DevicePairableDevices.get(devicesContext.previewDevice.SN) != null &&
                    DevicePairableDevices.get(devicesContext.previewDevice.SN)!.length > 0 ? (
                        <div className="setting separate-brightness">
                            <div className="title">
                                {translate(
                                    'Device_Lighting_Label_SeparateBrightness_WiredWireless',
                                    'Separate Wired / Wireless Brightness Setting',
                                )}
                            </div>
                            <label>
                                <ToggleComponent
                                    value={getCurrentProfile()?.lighting?.SepatateCheckValue}
                                    onChange={(value) => {
                                        setSeparateWiredWirelessBrightness(value);
                                    }}
                                />
                            </label>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="panel second">
                    <div className="controls">
                        <label className="field">
                            <span className="label">
                                {getCurrentProfile()?.lighting?.SepatateCheckValue == true
                                    ? `${translate('Device_Lighting_Label_Brightness_WiredPrefix', 'Wired')} `
                                    : ''}
                                {translate('Device_Lighting_Label_Brightness', 'Brightness')}
                                <span className="result">
                                    {getCurrentProfile()?.lighting?.WiredBrightnessValue}&#x25;
                                </span>
                            </span>
                            <RangeComponent
                                value={getCurrentProfile()?.lighting?.WiredBrightnessValue}
                                onChange={(value) => {
                                    setWiredBrightness(value);
                                }}
                            />
                        </label>
                        <label
                            className="field wireless-brightness"
                            style={
                                {
                                    '--opacity': getCurrentProfile()?.lighting?.SepatateCheckValue == true ? 1 : 0,
                                    '--height':
                                        getCurrentProfile()?.lighting?.SepatateCheckValue == true ? 'auto' : '0',
                                } as React.CSSProperties
                            }
                        >
                            <span className="label">
                                {translate('Device_Lighting_Label_Brightness_Wireless', 'Wireless Brightness')}
                                <span className="result">
                                    {getCurrentProfile()?.lighting?.WirelessBrightnessValue}&#x25;
                                </span>
                            </span>
                            <RangeComponent
                                value={getCurrentProfile()?.lighting?.WirelessBrightnessValue}
                                onChange={(value) => {
                                    setWirelessBrightness(value);
                                }}
                            />
                        </label>
                        <label className="field">
                            <span className="label">
                                {translate('Device_Lighting_Label_Rate', 'Rate')}
                                <span className="result">{getCurrentProfile()?.lighting?.RateValue}&#x25;</span>
                            </span>
                            <RangeComponent
                                value={getCurrentProfile()?.lighting?.RateValue}
                                onChange={(value) => {
                                    setRate(value);
                                }}
                            />
                        </label>
                    </div>
                </div>
                {(function(){console.log('show color', uiContext.lightingSelectedPreset?.data?.enableColorSelection, uiContext.lightingSelectedColorStyle?.optionKey); return undefined})()}
                {getCurrentProfile()?.lighting?.Effect == 0 ? (
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
                                        setSelectedPresetGradient(gradient);
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
                  uiContext.lightingSelectedPreset?.data?.enableColorSelection /*&&
                  uiContext.lightingSelectedColorStyle?.optionKey == 'customColor'*/ ? (
                    <div className="panel third color-picker">
                        <header>
                            <div className="title">{translate('ColorPicker_Label_ColorPicker', 'Color Picker')}</div>
                            <button
                                type="button"
                                onClick={() => {
                                    // setColorDialogCachedColor(uiState.devicePropertyColor);
                                    setColorDialogIsOpen(true);
                                }}
                            >
                                {translate('Button_Expand', 'Expand')}
                            </button>
                        </header>
                        <ColorPickerComponent
                            value={selectedColor}
                            onChange={(color: RGBAColor) => {
                                setColor_PresetColorPicker(color);

                                colorArray[uiContext.selectedColorIndex] = { R: color.r, G: color.g, B: color.b, flag: true };
                                setMouseLightingColor(colorArray);
                            }}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <ContentDialogComponent
                className="color"
                title="Color Picker"
                open={colorDialogIsOpen}
                actions={[
                    <button
                        type="button"
                        key={0}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                            colorArray[uiContext.selectedColorIndex] = {
                                R: uiContext.colorPickerValue_PresetLighting.r,
                                G: uiContext.colorPickerValue_PresetLighting.g,
                                B: uiContext.colorPickerValue_PresetLighting.b,
                                flag: true,
                            };
                            setMouseLightingColor(colorArray);
                        }}
                    >
                        {translate('Button_Cancel', 'Cancel')}
                    </button>,
                    <button
                        type="button"
                        key={1}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                            colorArray[uiContext.selectedColorIndex] = {
                                R: uiContext.colorPickerValue_ColorPickerModal.r,
                                G: uiContext.colorPickerValue_ColorPickerModal.g,
                                B: uiContext.colorPickerValue_ColorPickerModal.b,
                                flag: true,
                            };
                            setMouseLightingColor(colorArray);
                        }}
                    >
                        {translate('Button_Ok', 'Ok')}
                    </button>,
                ]}
            >
                <ColorPickerComponent
                    expanded={true}
                    value={selectedColor}
                    onChange={(color) => {
                        setColor_ModalColorPicker(color);
                        colorArray[uiContext.selectedColorIndex] = { R: color.r, G: color.g, B: color.b, flag: true };
                        setMouseLightingColor(colorArray);
                    }}
                />
            </ContentDialogComponent>
        </>
    );
}

function convertGradientDefinitionToCssStyle(gradient) {
    return '#FF0000';
}

export default MouseLightingManagementPage;
