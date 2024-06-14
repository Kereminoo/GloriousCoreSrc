import React, { ChangeEvent, MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import './color-picker.component.css'
import { HSLColor } from 'src/common/data/structures/hsl-color.struct';

const DEFAULT_COLOR = RGBAColor.fromRGB(255, 0, 0);
const DefaultSwatches = 
[
  RGBAColor.fromHex("#FF1E00"), 
  RGBAColor.fromHex("#040AFF"),
  RGBAColor.fromHex("#1DFF00"),
  RGBAColor.fromHex("#BA01FF"),
  RGBAColor.fromHex("#FFF000"),
  RGBAColor.fromHex("#FFFFFF")
];
const HUE_RANGE = 360;

function ColorPickerComponent(props: any) 
{
  const { value, onColorChange, userSwatches, expanded, suspendUpdates } = props;
  
  // const colorPreview = useRef(null);
  const redInput = useRef(null);
  const greenInput = useRef(null);
  const blueInput = useRef(null);
  const saturationLightnessPicker = useRef(null);
  const saturationLightnessIndicator = useRef(null);
  const huePicker = useRef(null);
  const hueIndicator = useRef(null);

  const initialColor = (value == null) ? DEFAULT_COLOR : value;
  const [previewColor, setPreviewColor] = useState<HSLColor>(initialColor);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSwatch, setSelectedSwatch] = useState(-1);

  const [targetHex, setTargetHex] = useState(initialColor.toHex());

  const [swatches, setSwatches] = useState(DefaultSwatches);

  const [huePreviewColor, setHuePreviewColor] = useState('#FF0000');

  const updatesAreSuspended = useRef(suspendUpdates ?? false);
  const isPickingHue = useRef(false);
  const isPickingSaturationLightness = useRef(false);
  const isSettingHex = useRef(false);

  const [hueCursorPosition, setHueCursorPosition] = useState({top: 0, left: 0});
  const [saturationLightnessCursorPosition, setSaturationLightnessCursorPosition] = useState({top: 0, left: 0});
  
  useEffect(() =>
  {
    updatesAreSuspended.current = suspendUpdates;
  }, [suspendUpdates])

  useEffect(() =>
  {
    updatesAreSuspended.current = true;
    setSelectedColor(previewColor);

    if(!isSettingHex.current)
    {
      setTargetHex(previewColor.toHex());
    }

    // set full saturation/lightness version of color
    // for displaying on the hue indicator (covers up transparency issues at edges)
    const huePreviewColor = HSLColor.fromHSL(previewColor.hue, previewColor.saturation, previewColor.lightness);
    huePreviewColor.saturation = 100;
    huePreviewColor.lightness = 50;
    
    if(!isPickingSaturationLightness.current)
    {

      setHuePreviewColor(huePreviewColor.toHex());

      if(!isPickingHue.current)
      {
        const hueX = (previewColor.hue / HUE_RANGE) * (huePicker.current! as HTMLElement).getBoundingClientRect().width;
        setHueCursorPosition({top: hueCursorPosition.top, left: hueX });

        const pickerBounds = (saturationLightnessPicker.current! as HTMLElement).getBoundingClientRect();
        const cursorBounds = (saturationLightnessIndicator.current! as HTMLElement).getBoundingClientRect();
  
        // todo: re-check this algo; the cursor doesn't stay in the same spot on hue rotations. seems like it should?
        // might be due to equivalent math values for lightness/saturation?
    
        let saturationLightnessX = ((previewColor.saturation * pickerBounds.width) / 100) - (cursorBounds.width / 2);
        let saturationLightnessY = pickerBounds.height - (((previewColor.lightness*2) * pickerBounds.height) / 100) - (cursorBounds.height / 2);
        if(previewColor.lightness >=50)
        {
          saturationLightnessX -= (previewColor.lightness - 50);
        }
        
        saturationLightnessY = Math.max(saturationLightnessY, -(cursorBounds.height / 2));
        saturationLightnessX = Math.max(saturationLightnessX, -(cursorBounds.width / 2));
        
        setSaturationLightnessCursorPosition({ top: saturationLightnessY, left: saturationLightnessX });
      }
    }
    updatesAreSuspended.current = false;

  }, [previewColor]);

  useEffect(() => 
  { 
    // todo: check if half hex color (#FFF = #FFFFFF; #F0D = #FF00DD); convert to full hex;
    // maybe not though; could be annoying
    const isFullHexColorRegex = /^#[0-9A-F]{6}$/i;
    const isHexColor = isFullHexColorRegex.test(targetHex);
    if(isHexColor)
    {
      const hexColor = RGBAColor.fromHex(targetHex);
      setPreviewColor(hexColor.toHSL());
    }
  }, [targetHex]);

  useEffect(() => 
  { 
    setSwatches(userSwatches ?? DefaultSwatches);
  }, [userSwatches]);

  useEffect(() => 
  {
    if(updatesAreSuspended.current == true || value == null || isPickingSaturationLightness || isPickingHue) { return; }

    const color = value as HSLColor;
    setPreviewColor(color);
    setSelectedColor(color);
  }, [value]);

  useEffect(() =>
  {
    if(onColorChange != null)
    {
      onColorChange(selectedColor);
    }
  }, [selectedColor]);

  const updateSelectedColor = () => { setSelectedColor(previewColor); }

  const saturationLightness_onMouseDown = (event:MouseEvent) =>
  {
    isPickingSaturationLightness.current = true;

    const target = saturationLightnessPicker.current! as HTMLElement;
    let bounds = target.getBoundingClientRect();
    const cursorBounds = (saturationLightnessIndicator.current! as HTMLElement).getBoundingClientRect();
    const cursorHalfWidth = cursorBounds.width / 2;
    const cursorHalfHeight = cursorBounds.height / 2;

    let localX = (bounds.width * (event.clientX - bounds.left)) / 100;
    let localY = (bounds.height * (event.clientY - bounds.top)) / 100;

    // prevent cursor from rendering outside of context
    const xMinimum = cursorHalfWidth * -1;
    const xMaximum = bounds.width + cursorHalfWidth - cursorBounds.width;
    const yMinimum = cursorHalfHeight * -1;
    const yMaximum = bounds.height + cursorHalfHeight - cursorBounds.height;

    localX = Math.max(xMinimum, Math.min(xMaximum, localX));
    localY = Math.max(yMinimum, Math.min(yMaximum, localY));

    setSaturationLightnessCursorPosition({ top: localY, left: localX });

    // store values;
    const saturationValue = ((localX + cursorHalfWidth) * 100) / bounds.width;

    // lightness is 0 anywhere that localY = bounds.height
    // lightness if 50 (full saturation) when localY = 0 AND localX = hounds.width
    // lightness is 100 (full white) when localY = 0 AND localX = 0
    // linear interpolation between those points; that's why this is more complex than saturation/hue
    const lightnessYPercent = ((bounds.height - localY - cursorHalfHeight) * 100) / bounds.height;
    const hsv_value = (lightnessYPercent / 100);
    const lightnessValue = ((hsv_value / 2) * (2 - (saturationValue / 100))) * 100;

    const newColor = HSLColor.fromHSL(previewColor.hue, saturationValue, lightnessValue);
    setPreviewColor(newColor);

    const onMouseMove = (event:MouseEvent|Event) =>
    {
      if(event == null) { return; }
      const target = saturationLightnessPicker.current! as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const mouseEvent = event as MouseEvent;
      let localX = (bounds.width * (mouseEvent.clientX - bounds.left)) / 100;
      let localY = (bounds.height * (mouseEvent.clientY - bounds.top)) / 100;
      localX = Math.max(xMinimum, Math.min(xMaximum, localX));
      localY = Math.max(yMinimum, Math.min(yMaximum, localY));
      setSaturationLightnessCursorPosition({ top: localY, left: localX });

      // store values;
      const saturationValue = ((localX + cursorHalfWidth) * 100) / bounds.width;
      
      const lightnessYPercent = ((bounds.height - localY - cursorHalfHeight) * 100) / bounds.height;
      const hsv_value = (lightnessYPercent / 100);
      const lightnessValue = ((hsv_value / 2) * (2 - (saturationValue / 100))) * 100;

      const newColor = HSLColor.fromHSL(previewColor.hue, saturationValue, lightnessValue);
      setPreviewColor(newColor);

      event.preventDefault();
      event.stopPropagation();
    };
  
    const onMouseUp = (event:any) =>
    {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);

      // keep the final few render frames from affecting
      // the selectedColor, which otherwise gets updated by the
      // value property
      requestAnimationFrame(() =>
      {
        requestAnimationFrame(() =>
        {

          updateSelectedColor();

          isPickingSaturationLightness.current = false;
          isPickingHue.current = false;
          isSettingHex.current = false;
        });
      });
    };
    
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mouseleave', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp, {once: true});
    window.addEventListener('mouseleave', onMouseUp, {once: true});

    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const hue_onMouseDown = (event: MouseEvent) =>
  {
    isPickingHue.current = true;

    const target = huePicker.current! as HTMLElement;
    let bounds = target.getBoundingClientRect();
    const cursorBounds = (hueIndicator.current! as HTMLElement).getBoundingClientRect();
    const cursorHalfWidth = cursorBounds.width / 2;
    const cursorHalfHeight = cursorBounds.height / 2;

    let localX = event.clientX - bounds.left - cursorHalfWidth;
    let localY = event.clientY - bounds.top - cursorHalfHeight;

    // prevent cursor from rendering outside of context
    const xMinimum = 0;
    const xMaximum = bounds.width;
    const yMinimum = cursorHalfHeight * -1;
    const yMaximum = bounds.height + cursorHalfHeight - cursorBounds.height;

    localX = Math.max(xMinimum, Math.min(xMaximum, localX));
    localY = Math.max(yMinimum, Math.min(yMaximum, localY));

    setHueCursorPosition({ top: localY, left: localX });

    const fullValue = (expanded) ? bounds.height : bounds.width;
    const localValue = (expanded) ? localY : localX;
    const huePercent = (100 * localValue) / fullValue;
    const hue = (huePercent * HUE_RANGE) / 100;

    const newColor = HSLColor.fromHSL(hue, previewColor.saturation, previewColor.lightness);
    setPreviewColor(newColor);

    const onMouseMove = (event:MouseEvent|Event) =>
    {
      if(event == null) { return; }
      const target = huePicker.current! as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const mouseEvent = event as MouseEvent;
      let localX = mouseEvent.clientX - bounds.left - cursorHalfWidth;
      let localY = mouseEvent.clientY - bounds.top - cursorHalfHeight;
      localX = Math.max(xMinimum, Math.min(xMaximum, localX));
      localY = Math.max(yMinimum, Math.min(yMaximum, localY));
      setHueCursorPosition({ top: localY, left: localX });

      const fullValue = (expanded) ? bounds.height : bounds.width;
      const localValue = (expanded) ? localY : localX;
      const huePercent = (100 * localValue) / fullValue;
      const hue = (huePercent * HUE_RANGE) / 100;

      const newColor = HSLColor.fromHSL(hue, previewColor.saturation, previewColor.lightness);
      setPreviewColor(newColor);

      event.preventDefault();
      event.stopPropagation();
    };

    const onMouseUp = (event:any) =>
    {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);

      // keep the final few render frames from affecting
      // the selectedColor, which otherwise gets updated by the
      // value property
      requestAnimationFrame(() =>
      {
        requestAnimationFrame(() =>
        {

          updateSelectedColor();
          
          isPickingSaturationLightness.current = false;
          isPickingHue.current = false;
          isSettingHex.current = false;
        });
      });
    };


    // console.log(window);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mouseleave', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp, {once: true});
    window.addEventListener('mouseleave', onMouseUp, {once: true});

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  return (<div data-color-picker className={(expanded == true) ? "expanded" : ""}>
    <div className="active-color">
      <header>Active Color</header>
      <label className="field hex">
        <div className="label"><div className="color-preview" style={{ "backgroundColor": previewColor?.toHex() }}></div></div>
        <input type="text" value={targetHex} name="hex" onChange={(event) =>
        {
          let value = (event.currentTarget as HTMLInputElement).value.toUpperCase();
          if(value == "") { value = "#"; }
          if(value.length > 7) { value = value.substring(0, 7); }
          isSettingHex.current = true;
          setTargetHex(value);
          requestAnimationFrame(() =>
          {
            requestAnimationFrame(() =>
            {
              isPickingSaturationLightness.current = false;
              isPickingHue.current = false;
              isSettingHex.current = false;
            })
          })
        }} />
      </label>
      <div className="integer-values">
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
      </div>
    </div>
    <header className="color-picker-heading">Color Picker</header>
    <div className="saturation-lightness"style={{ "backgroundColor": huePreviewColor }} ref={saturationLightnessPicker} onMouseDown={saturationLightness_onMouseDown}>
      <div className="indicator" style={{ translate: `${saturationLightnessCursorPosition.left}px ${saturationLightnessCursorPosition.top}px`}} ref={saturationLightnessIndicator}></div>
      </div>
    <div className="hue" ref={huePicker} onMouseDown={hue_onMouseDown}>
      <div className="indicator" style={{ "backgroundColor": huePreviewColor, translate: (expanded) ? `0px ${hueCursorPosition.top}px` : `${hueCursorPosition.left}px 0px` }} ref={hueIndicator}></div>
    </div>
    <div className="swatches">
      <header>Swatches</header>
      <ul className="items">
        {swatches.map((swatch, i) => {
          let classes = 'swatch'
          if(selectedSwatch == i) { classes += " selected"; };
          return <div key={i} style={{ "backgroundColor": swatch.toHex() }} className={classes} onClick={() => 
            { 
              setSelectedSwatch(i);
              setPreviewColor(swatches[i].toHSL());
            }} />
        })}
      </ul>
    </div>
  </div>)
}

export default ColorPickerComponent;