import React, { useEffect, useRef, useState } from 'react';
import { Color } from '../component.types';
import { IconColor, IconSize, IconType } from '../icon/icon.types';
import Icon from '../icon/icon';
import styles from './color-picker.module.css';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';


export interface ColorPickerProps {
  value?: RGBAColor
  onChange?: (value: RGBAColor) => void;
}

class ColorPickerState
{
  color: RGBAColor = RGBAColor.fromHex('#FF0000');
}


const ColorPicker_New: React.ElementType<ColorPickerProps> = ({ value, onChange }) => 
{
  const [state, setState] = useState(new ColorPickerState());

  const [hexInputValue, setHexInputValue] = useState(state.color.toHex());

  const hueCursorPosition = useRef({top: 0, left: 0});
  const saturationLightnessCursorPosition = useRef({top: 0, left: 0});

  // Element Refs
  const RedInput = useRef(null);
  const GreenInput = useRef(null);
  const BlueInput = useRef(null);
  const SaturationLightnessPicker = useRef(null);
  const SaturationLightnessCursor = useRef(null);
  const HuePicker = useRef(null);
  const HueCursor = useRef(null);
  
  useEffect(() =>
  {
    console.log('Color Picker', 'color', value);
    if(value == null || !(value instanceof RGBAColor))
    {
      return;
    }
    setState({...state, color: value })
  }, [value]);

  useEffect(() =>
  {
    if(onChange != null) { onChange(state.color); }
  }, [state]);

  return (<div className={styles['color-picker']}>
  <div className={styles["active-color"]}>
    <label className={styles["hex-field"]}>
      <div className={styles["hex-field-label"]}><div className={styles["color-preview"]} style={{ "backgroundColor": state.color.toHex() }}></div></div>
      <input className={styles["hex-field-input"]} type="text" value={hexInputValue} name="hex" onChange={(event) =>
      {
        let value = (event.currentTarget as HTMLInputElement).value.toUpperCase();
        if(value == "") { value = "#"; }
        if(!value.startsWith("#")) { value = `#${value}`; }
        if(value.length <= 7) { setHexInputValue(value); }
        if(value.length < 7) { return; }
        if(value.length > 7) { value = value.substring(0, 7); }
        const color = RGBAColor.fromHex(value);
        setState({...state, color});
      }} />
    </label>
    {/* <div className="integer-values">
      <label className="field red">
        <div className="label">Red</div>
        <input type="text" ref={redInput} />
      </label>
      <label className="field green">
        <div className="label">Green</div>
        <input type="text" ref={greenInput} />
      </label>
      <label className="field blue">
        <div className="label">Blue</div>
        <input type="text" ref={blueInput} />
      </label>
    </div> */}
  </div>
  {/* <div className="saturation-lightness"style={{ "backgroundColor": state.color.toHex() }} ref={SaturationLightnessPicker} onMouseDown={saturationLightness_onMouseDown}> */}
  <div className={styles["saturation-lightness"]} style={{ "backgroundColor": state.color.toHex() }} ref={SaturationLightnessPicker}>
    <div className={styles["saturation-lightness-indicator"]} style={{ translate: `${saturationLightnessCursorPosition.current.left}px ${saturationLightnessCursorPosition.current.top}px`}} ref={SaturationLightnessCursor}></div>
    </div>
  {/* <div className="hue" ref={HuePicker} onMouseDown={hue_onMouseDown}> */}
  <div className={styles["hue"]} ref={HuePicker}>
    <div className={styles["hue-indicator"]} style={{ "backgroundColor": state.color.toHex() }} ref={HueCursor}></div>
  </div>
  <div className={styles["swatches"]}>
    <header>Swatches</header>
    <ul className={styles["swatch-items"]}>
      {/* {swatches.map((swatch, i) => {
        let classes = 'swatch'
        if(selectedSwatch == i) { classes += " selected"; };
        return <div key={i} style={{ "backgroundColor": swatch.toHex() }} className={classes} onClick={() => 
          { 
            setSelectedSwatch(i);
            setPreviewColor(swatches[i].toHSL());
          }} />
      })} */}
    </ul>
  </div>
</div>
  );

};

export default ColorPicker_New;
