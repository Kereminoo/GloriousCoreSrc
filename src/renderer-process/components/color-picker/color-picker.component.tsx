import React, { ChangeEvent, MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import './color-picker.component.css';
import { HSLColor } from 'src/common/data/structures/hsl-color.struct';
import { RGBValue } from '@renderer/services/color.service';
import { RgbColor, RgbColorPicker } from 'react-colorful';
import { useTranslate } from '@renderer/contexts/translations.context';

const DEFAULT_COLOR = RGBAColor.fromRGB(255, 0, 0);
const DefaultSwatches = [
    RGBAColor.fromHex('#FF1E00'),
    RGBAColor.fromHex('#040AFF'),
    RGBAColor.fromHex('#1DFF00'),
    RGBAColor.fromHex('#BA01FF'),
    RGBAColor.fromHex('#FFF000'),
    RGBAColor.fromHex('#FFFFFF'),
];
const HUE_RANGE = 360;

const DEBOUNCE_TIMEOUT = 2;

type UpdateMethod = 'internal' | 'external';
type InternalUpdateMethod =
    | 'saturationLightnessPicker'
    | 'huePicker'
    | 'hexInput'
    | 'redInput'
    | 'greenInput'
    | 'blueInput'
    | 'swatchClick';

class SaturationLightnessValues {
    pickerBounds!: DOMRect;
    xMinValue: number = 0;
    xMaxValue: number = 0;
    yMinValue: number = 0;
    yMaxValue: number = 0;
    cursorHalfWidth: number = 0;
    cursorHalfHeight: number = 0;
}

function ColorPickerComponent(props: any) {
    const { value, onChange, userSwatches, expanded, suspendUpdates } = props;
    const translate = useTranslate();

    // const [, updateState] = React.useState();
    // const forceUpdate = React.useCallback(() => updateState({} as any), []);

    const initialColor = value == null ? DEFAULT_COLOR : value;
    // const [previewColor, setPreviewColor] = useState<HSLColor>(initialColor); // active color the picker is working with
    const [selectedColor, setSelectedColor] = useState(initialColor); // notifies change event
    const [selectedSwatch, setSelectedSwatch] = useState(-1); // highlights the selected swatch

    const [swatches, setSwatches] = useState(DefaultSwatches);

    // const hexValue = useRef(initialColor.toHex());
    // const redInt = useRef(initialColor.R);
    // const greenInt = useRef(initialColor.G);
    // const blueInt = useRef(initialColor.B);

    const [targetColor, setTargetColor] = useState(initialColor);
    const [targetHex, setTargetHex] = useState(initialColor.toHex());
    const [targetRed, setTargetRed] = useState(initialColor.r);
    const [targetGreen, setTargetGreen] = useState(initialColor.g);
    const [targeBlue, setTargetBlue] = useState(initialColor.b);

    const isUpdatingValue = useRef(false);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const onMouseUpdate = (value: RgbColor) => {
        const color = RGBAColor.fromRGB(value.r, value.g, value.b);
        // hexValue.current = color.toHex();
        // redInt.current = color.r;
        // greenInt.current = color.g;
        // blueInt.current = color.b;
        // setTargetColor(color);
        setTargetHex(color.toHex());
        setTargetRed(color.r);
        setTargetGreen(color.g);
        setTargetBlue(color.b);
        setTargetColor(color);
        setSelectedColor(color);

        // debounce updating the actual color
        // if (debounceTimeout.current != null) {
        //     clearTimeout(debounceTimeout.current);
        // }
        // debounceTimeout.current = setTimeout(() => {
        //     setSelectedColor(color);
        // }, DEBOUNCE_TIMEOUT);
    };

    useEffect(() => {
        if (onChange != null) {
            onChange(selectedColor);
        }
    }, [selectedColor]);

    // useEffect(() =>
    // {
    //   console.log("why doesn't this update?");
    // }, [targetColor]);

    useEffect(() => {
        if (value == null) {
            return;
        }
        // hexValue.current = value.toHex();
        // redInt.current = value.r;
        // greenInt.current = value.g;
        // blueInt.current = value.b;
        setTargetColor(value);
        setTargetHex(value.toHex());
        setTargetRed(value.r);
        setTargetGreen(value.g);
        setTargetBlue(value.b);
    }, [value]);

    return (
        <div data-color-picker className={expanded == true ? 'expanded' : ''}>
            <div className="active-color">
                <header>{translate('Device_Lighting_Label_ActiveColor', 'Active Color')}</header>
                <label className="field hex">
                    <div className="label">
                        <div className="color-preview" style={{ backgroundColor: targetColor?.toHex() }}></div>
                    </div>
                    <input
                        type="text"
                        value={targetHex}
                        name="hex"
                        onChange={(event) => {
                            let value = (event.currentTarget as HTMLInputElement).value.toUpperCase();
                            if (value == '') {
                                value = '#';
                            }
                            if (value.length > 7) {
                                value = value.substring(0, 7);
                            }

                            // hexValue.current = value;
                            setTargetHex(value);

                            // todo: check if half hex color (#FFF = #FFFFFF; #F0D = #FF00DD); convert to full hex;
                            // maybe not though; could be annoying
                            const isFullHexColorRegex = /^#[0-9A-F]{6}$/i;
                            const isHexColor = isFullHexColorRegex.test(value);
                            if (isHexColor) {
                                const hexColor = RGBAColor.fromHex(value);
                                setSelectedColor(hexColor);
                            }
                        }}
                    />
                </label>
                <div className="integer-values">
                    <label className="field red">
                        <div className="label">{translate('Device_Lighting_Label_Red', 'Red')}</div>
                        <input
                            type="text"
                            value={targetRed}
                            onChange={(event) => {
                                const stringValue = (event.target as HTMLInputElement).value;
                                const intValue = parseInt(stringValue);
                                if (isNaN(intValue)) {
                                    return;
                                }

                                // redInt.current = intValue;
                                setTargetRed(intValue);

                                if (intValue < 0 || intValue > 255) {
                                    return;
                                }
                                const color = structuredClone(selectedColor);
                                color.r = intValue;
                                setSelectedColor(color);
                            }}
                        />
                    </label>
                    <label className="field green">
                        <div className="label">{translate('Device_Lighting_Label_Green', 'Green')}</div>
                        <input
                            type="text"
                            value={targetGreen}
                            onChange={(event) => {
                                const stringValue = (event.target as HTMLInputElement).value;
                                const intValue = parseInt(stringValue);
                                if (isNaN(intValue)) {
                                    return;
                                }

                                // greenInt.current = intValue;
                                setTargetGreen(intValue);

                                if (intValue < 0 || intValue > 255) {
                                    return;
                                }
                                const color = structuredClone(selectedColor);
                                color.g = intValue;
                                setSelectedColor(color);
                            }}
                        />
                    </label>
                    <label className="field blue">
                        <div className="label">{translate('Device_Lighting_Label_Blue', 'Blue')}</div>
                        <input
                            type="text"
                            value={targeBlue}
                            onChange={(event) => {
                                const stringValue = (event.target as HTMLInputElement).value;
                                const intValue = parseInt(stringValue);
                                if (isNaN(intValue)) {
                                    return;
                                }

                                // blueInt.current = intValue;
                                setTargetBlue(intValue);

                                if (intValue < 0 || intValue > 255) {
                                    return;
                                }
                                const color = structuredClone(selectedColor);
                                color.b = intValue;
                                setSelectedColor(color);
                            }}
                        />
                    </label>
                </div>
            </div>
            <header className="color-picker-heading">
                {translate('Device_Lighting_Label_ColorPicker', 'Color Picker')}
            </header>
            <RgbColorPicker
                color={{ r: selectedColor.r, g: selectedColor.g, b: selectedColor.b }}
                onChange={onMouseUpdate}
            ></RgbColorPicker>
            <div className="swatches">
                <header>{translate('Device_Lighting_Label_Swatches', 'Swatches')}</header>
                <ul className="items">
                    {swatches.map((swatch, i) => {
                        let classes = 'swatch';
                        if (selectedSwatch == i) {
                            classes += ' selected';
                        }
                        return (
                            <div
                                key={i}
                                style={{ backgroundColor: swatch.toHex() }}
                                className={classes}
                                onClick={() => {
                                    setSelectedSwatch(i);
                                    onMouseUpdate(swatches[i]);
                                }}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ColorPickerComponent;
