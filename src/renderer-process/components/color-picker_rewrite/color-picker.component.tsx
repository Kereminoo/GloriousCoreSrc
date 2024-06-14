import React, { ChangeEvent, MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import './color-picker.component.css'
import { HSLColor } from 'src/common/data/structures/hsl-color.struct';
import { RGBValue } from '@renderer/services/color.service';

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

type UpdateMethod = 'internal'|'external';
type InternalUpdateMethod = 'saturationLightnessPicker'|'huePicker'|'hexInput'|'redInput'|'greenInput'|'blueInput'|'swatchClick';

class SaturationLightnessValues
{
  pickerBounds!: DOMRect;
  xMinValue: number = 0;
  xMaxValue: number = 0;
  yMinValue: number = 0;
  yMaxValue: number = 0;
  cursorHalfWidth: number = 0;
  cursorHalfHeight: number = 0;
}

function ColorPickerComponentRewrite(props: any) 
{
  const { value, onColorChange, userSwatches, expanded, suspendUpdates } = props;
  
  // const colorPreview = useRef(null);
  // const redInput = useRef(null);
  // const greenInput = useRef(null);
  // const blueInput = useRef(null);

  const initialColor = (value == null) ? DEFAULT_COLOR : value;

  const saturationLightnessPicker = useRef(null);
  const saturationLightnessIndicator = useRef(null);
  const huePicker = useRef(null);
  const hueIndicator = useRef(null);

  const [previewColor, setPreviewColor] = useState<HSLColor>(initialColor); // active color the picker is working with
  const [huePreviewColor, setHuePreviewColor] = useState('#FF0000'); // saturated color for rendering picker
  const [selectedColor, setSelectedColor] = useState(initialColor); // notifies change event
  const [selectedSwatch, setSelectedSwatch] = useState(-1); // highlights the selected swatch
  const mouseIsDown = useRef(false);

  const [hueCursorPosition, setHueCursorPosition] = useState({top: 0, left: 0});
  const [saturationLightnessCursorPosition, setSaturationLightnessCursorPosition] = useState({top: 0, left: 0});
  const saturationLightnessValues = useRef(new SaturationLightnessValues())

  // need these as states to handle intermediate representations;
  // for example, a user should be able to enter invalid values
  // like "ff" or "305" into the text fields, because they may
  // be partially correct values, like "ff" for "#FFFFFF", or typos.
  const [targetHex, setTargetHex] = useState(initialColor.toHex());
  const [targetRedInt, setTargetRedInt] = useState(initialColor.red);
  const [targetGreenInt, setTargetGreenInt] = useState(initialColor.green);
  const [targetBlueInt, setTargetBlueInt] = useState(initialColor.blue);

  const [swatches, setSwatches] = useState(DefaultSwatches);

  // const updatesAreSuspended = useRef(suspendUpdates ?? false);
  // const isPickingHue = useRef(false);
  // const isPickingSaturationLightness = useRef(false);
  // const isSettingHex = useRef(false);

  const isNotifying = useRef(false);
  const previewColor_isUpdating = useRef(false);

  const updatePreviewColor_internal = (color: HSLColor, method: InternalUpdateMethod) =>
  {
    // console.log('update preview color');
    previewColor_isUpdating.current = true;
    const updatedHex = color.toHex();
    const rgba = color.toRGBA();
    if(method == 'saturationLightnessPicker')
    {
      updateHexValue(updatedHex);
      updateRedValue(rgba.red);
      updateGreenValue(rgba.green);
      updateBlueValue(rgba.blue);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'huePicker')
    {
      updateHexValue(updatedHex);
      updateRedValue(rgba.red);
      updateGreenValue(rgba.green);
      updateBlueValue(rgba.blue);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'hexInput')
    {
      updateRedValue(rgba.red);
      updateGreenValue(rgba.green);
      updateBlueValue(rgba.blue);
      updateSaturationLightnessPickerAndCursor(color);
      updateHuePickerAndCursor(color);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'redInput')
    {
      updateHexValue(updatedHex);
      updateGreenValue(rgba.green);
      updateBlueValue(rgba.blue);
      updateSaturationLightnessPickerAndCursor(color);
      updateHuePickerAndCursor(color);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'greenInput')
    {
      updateHexValue(updatedHex);
      updateRedValue(rgba.red);
      updateBlueValue(rgba.blue);
      updateSaturationLightnessPickerAndCursor(color);
      updateHuePickerAndCursor(color);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'blueInput')
    {
      updateHexValue(updatedHex);
      updateRedValue(rgba.red);
      updateGreenValue(rgba.green);
      updateSaturationLightnessPickerAndCursor(color);
      updateHuePickerAndCursor(color);
      updateSelectedSwatch(updatedHex);
    }
    else if(method == 'swatchClick')
    {
      updateSaturationLightnessPickerAndCursor(color);
      updateHuePickerAndCursor(color);
      updateHexValue(updatedHex);
      updateRedValue(rgba.red);
      updateGreenValue(rgba.green);
      updateBlueValue(rgba.blue);
    }
    else
    {
      console.error(new Error(`[Color Picker] Unknown Internal Update Method: ${method}`));
      return;
    }
    setPreviewColor(color);
    previewColor_isUpdating.current = false;
  }
  const updatePreviewColor_external = (color: HSLColor) =>
  {
    const updatedHex = color.toHex();
    const rgba = color.toRGBA();
    setTargetHex(updatedHex);
    setTargetRedInt(rgba.red);
    setTargetGreenInt(rgba.green);
    setTargetBlueInt(rgba.blue);
    updateSaturationLightnessPickerAndCursor(color);
    updateHuePickerAndCursor(color);
    updateSelectedSwatch(updatedHex);
    setPreviewColor(color);
  }

  const updateSaturationLightnessPickerAndCursor = (color: HSLColor) =>
  {
    const pickerBounds = (saturationLightnessPicker.current! as HTMLElement).getBoundingClientRect();
    const cursorBounds = (saturationLightnessIndicator.current! as HTMLElement).getBoundingClientRect();

    // todo: re-check this algo; the cursor doesn't stay in the same spot on hue rotations. seems like it should?
    // might be due to equivalent math values for lightness/saturation?

    let saturationLightnessX = ((color.saturation * pickerBounds.width) / 100) - (cursorBounds.width / 2);
    let saturationLightnessY = pickerBounds.height - (((color.lightness*2) * pickerBounds.height) / 100) - (cursorBounds.height / 2);
    if(color.lightness >=50)
    {
      saturationLightnessX -= (color.lightness - 50);
    }
    
    saturationLightnessY = Math.max(saturationLightnessY, -(cursorBounds.height / 2));
    saturationLightnessX = Math.max(saturationLightnessX, -(cursorBounds.width / 2));
    
    setSaturationLightnessCursorPosition({ top: saturationLightnessY, left: saturationLightnessX });
  }
  const updateHuePickerAndCursor = (color: HSLColor) =>
  {
    // set full saturation/lightness version of color
    // for displaying on the hue indicator (covers up transparency issues at edges)
    const huePreviewColor = HSLColor.fromHSL(color.hue, color.saturation, color.lightness);
    huePreviewColor.saturation = 100;
    huePreviewColor.lightness = 50;
    setHuePreviewColor(huePreviewColor.toHex());

    const hueX = (color.hue / HUE_RANGE) * (huePicker.current! as HTMLElement).getBoundingClientRect().width;
    setHueCursorPosition({top: hueCursorPosition.top, left: hueX });
  }
  const updateHexValue = (value: string) =>
  {
    // todo: check if half hex color (#FFF = #FFFFFF; #F0D = #FF00DD); convert to full hex;
    // maybe not though; could be annoying
    const isFullHexColorRegex = /^#[0-9A-F]{6}$/i;
    const isHexColor = isFullHexColorRegex.test(targetHex);
    if(isHexColor == false)
    {
      return;
    }

    setTargetHex(value);
  
    if(previewColor_isUpdating.current == false)
    {
      const hexColor = RGBAColor.fromHex(value);
      updatePreviewColor_internal(hexColor.toHSL(), 'hexInput');
    }
  }
  const updateRedValue = (value: number) =>
  {
    if(isNaN(value) || value < 0 || value > 255) { return; }
    const newColor = previewColor.toRGBA();
    newColor.red = value as RGBValue;
    if(previewColor_isUpdating.current == false)
    {
      updatePreviewColor_internal(newColor.toHSL(), 'redInput');
    }
  }
  const updateGreenValue = (value: number) =>
  {
    if(isNaN(value) || value < 0 || value > 255) { return; }
    const newColor = previewColor.toRGBA();
    newColor.green = value as RGBValue;
    if(previewColor_isUpdating.current == false)
    {
      updatePreviewColor_internal(newColor.toHSL(), 'greenInput');
    }
  }
  const updateBlueValue = (value: number) =>
  {
    if(isNaN(value) || value < 0 || value > 255) { return; }
    const newColor = previewColor.toRGBA();
    newColor.blue = value as RGBValue;
    if(previewColor_isUpdating.current == false)
    {
      updatePreviewColor_internal(newColor.toHSL(), 'blueInput');
    }
  }
  const updateSelectedSwatch = (updatedHex) =>
  {
    for(let i = 0; i < swatches.length; i++)
    {
      const swatch = swatches[i];
      if(swatch.toHex() == updatedHex)
      {
        setSelectedSwatch(i);
        break;
      }
    }
  }
  

  useEffect(() => 
  {
    const swatch = swatches[selectedSwatch];
    if(swatch == null) { return; }
    updatePreviewColor_internal(swatch.toHSL(), 'swatchClick');
  }, [selectedSwatch]);

  useEffect(() => 
  { 
    setSwatches(userSwatches ?? DefaultSwatches);
  }, [userSwatches]);

  useEffect(() => 
  {
    if(isNotifying.current == true)
    {
      return;
    }

    // console.log('value property is being set');

    const color = value.toHSL();
    updatePreviewColor_external(color);
    setSelectedColor(color);
  }, [value]);

  useEffect(() =>
  {
    // console.log('set selectedColor');
    if(onColorChange != null)
    {
      console.log('notify selectedColor');
      // when 'notifying', component is alerting parent components
      // which will then update their states which may cause the 
      // color picker's value property to get re-set. That should be
      // stopped by the value effect's notifying guard.
      isNotifying.current = true;
      onColorChange(selectedColor.toRGBA());
      requestAnimationFrame(() =>
      {
        isNotifying.current = false;
      });
    }
  }, [selectedColor]);

  useEffect(() =>
  {
    // window.removeEventListener('mousemove', onMouseMove_SaturationLightnessPicker);
    // window.removeEventListener('mouseup', onMouseUp_Picker);
    // window.addEventListener('mousemove', onMouseMove_SaturationLightnessPicker);
    // window.addEventListener('mouseup', onMouseUp_Picker);
  }, []);

  // const updateSelectedColor = () => { setSelectedColor(previewColor); }

  // need to do this so that we can give the 'cleanup' function
  // to react as a callback, in case a render happens before our
  // mouse events can resolve; return value is cleanup function;
  // useEffect(() =>
  // {
  //   // window.removeEventListener('mousemove', onMouseMove_SaturationLightnessPicker);
  //   // window.removeEventListener('mouseup', onMouseUp_Picker);
  //   // window.removeEventListener('mouseleave', onMouseUp_Picker);

  //   // window.addEventListener('mousemove', onMouseMove_SaturationLightnessPicker);
  //   // window.addEventListener('mouseup', onMouseUp_Picker);
  //   // window.addEventListener('mouseleave', onMouseUp_Picker, {once: true});
    
  //   // return () => { onMouseUp_Picker(null); };
  // }, [mouseIsDown]);
  
  const onMouseUp_Picker = (event:any) =>
  {
    // window.removeEventListener('mousemove', onMouseMove_SaturationLightnessPicker);
    // window.removeEventListener('mouseup', onMouseUp_Picker);
    // window.removeEventListener('mouseleave', onMouseUp_Picker);

    if(mouseIsDown.current == false) { return; }
    

    // keep the final few render frames from affecting
    // the selectedColor
    requestAnimationFrame(() =>
    {
      console.log('set');
      setSelectedColor(previewColor);
      mouseIsDown.current = false;
    });
  };

  const onMouseMove_SaturationLightnessPicker = (event:MouseEvent|Event) =>
  {
    if(event == null || mouseIsDown.current == false) { return; }
    const mouseEvent = event as MouseEvent;
    let localX = (saturationLightnessValues.current.pickerBounds.width * (mouseEvent.clientX - saturationLightnessValues.current.pickerBounds.left)) / 100;
    let localY = (saturationLightnessValues.current.pickerBounds.height * (mouseEvent.clientY - saturationLightnessValues.current.pickerBounds.top)) / 100;
    localX = Math.max(saturationLightnessValues.current.xMinValue, Math.min(saturationLightnessValues.current.xMaxValue, localX));
    localY = Math.max(saturationLightnessValues.current.yMinValue, Math.min(saturationLightnessValues.current.yMaxValue, localY));
    setSaturationLightnessCursorPosition({ top: localY, left: localX });


    // store values;
    const saturationValue = ((localX + saturationLightnessValues.current.cursorHalfWidth) * 100) / saturationLightnessValues.current.pickerBounds.width;
    
    const lightnessYPercent = ((saturationLightnessValues.current.pickerBounds.height - localY - saturationLightnessValues.current.cursorHalfHeight) * 100) / saturationLightnessValues.current.pickerBounds.height;
    const hsv_value = (lightnessYPercent / 100);
    const lightnessValue = ((hsv_value / 2) * (2 - (saturationValue / 100))) * 100;

    const newColor = HSLColor.fromHSL(previewColor.hue, saturationValue, lightnessValue);
    updatePreviewColor_internal(newColor, 'saturationLightnessPicker');

    event.preventDefault();
    event.stopPropagation();
  };
  const saturationLightness_onMouseDown = (event:MouseEvent) =>
  {
    event.preventDefault();
    event.stopPropagation();

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

    // allowed to manipulate this directly (instead of indirectly by
    // updating previewColor) because multiple values can have the same
    // numerical representation, so we don't want the cursor to jump
    // to an alternate representation while dragging.
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
    updatePreviewColor_internal(newColor, 'saturationLightnessPicker');

    saturationLightnessValues.current = {
      pickerBounds: bounds,
      xMinValue: xMinimum,
      xMaxValue: xMaximum,
      yMinValue: yMinimum,
      yMaxValue: yMaximum,
      cursorHalfWidth,
      cursorHalfHeight
    };

    mouseIsDown.current = true;

    return false;
  };

  const hue_onMouseDown = (event: MouseEvent) =>
  {
    // isPickingHue.current = true;

    // const target = huePicker.current! as HTMLElement;
    // let bounds = target.getBoundingClientRect();
    // const cursorBounds = (hueIndicator.current! as HTMLElement).getBoundingClientRect();
    // const cursorHalfWidth = cursorBounds.width / 2;
    // const cursorHalfHeight = cursorBounds.height / 2;

    // let localX = event.clientX - bounds.left - cursorHalfWidth;
    // let localY = event.clientY - bounds.top - cursorHalfHeight;

    // // prevent cursor from rendering outside of context
    // const xMinimum = 0;
    // const xMaximum = bounds.width;
    // const yMinimum = cursorHalfHeight * -1;
    // const yMaximum = bounds.height + cursorHalfHeight - cursorBounds.height;

    // localX = Math.max(xMinimum, Math.min(xMaximum, localX));
    // localY = Math.max(yMinimum, Math.min(yMaximum, localY));

    // setHueCursorPosition({ top: localY, left: localX });

    // const fullValue = (expanded) ? bounds.height : bounds.width;
    // const localValue = (expanded) ? localY : localX;
    // const huePercent = (100 * localValue) / fullValue;
    // const hue = (huePercent * HUE_RANGE) / 100;

    // const newColor = HSLColor.fromHSL(hue, previewColor.saturation, previewColor.lightness);
    // setPreviewColor(newColor);

    // const onMouseMove = (event:MouseEvent|Event) =>
    // {
    //   if(event == null) { return; }
    //   const target = huePicker.current! as HTMLElement;
    //   let bounds = target.getBoundingClientRect();
    //   const mouseEvent = event as MouseEvent;
    //   let localX = mouseEvent.clientX - bounds.left - cursorHalfWidth;
    //   let localY = mouseEvent.clientY - bounds.top - cursorHalfHeight;
    //   localX = Math.max(xMinimum, Math.min(xMaximum, localX));
    //   localY = Math.max(yMinimum, Math.min(yMaximum, localY));
    //   setHueCursorPosition({ top: localY, left: localX });

    //   const fullValue = (expanded) ? bounds.height : bounds.width;
    //   const localValue = (expanded) ? localY : localX;
    //   const huePercent = (100 * localValue) / fullValue;
    //   const hue = (huePercent * HUE_RANGE) / 100;

    //   const newColor = HSLColor.fromHSL(hue, previewColor.saturation, previewColor.lightness);
    //   setPreviewColor(newColor);

    //   event.preventDefault();
    //   event.stopPropagation();
    // };

    // const onMouseUp = (event:any) =>
    // {
    //   window.removeEventListener('mousemove', onMouseMove);
    //   window.removeEventListener('mouseup', onMouseUp);
    //   window.removeEventListener('mouseleave', onMouseUp);

    //   // keep the final few render frames from affecting
    //   // the selectedColor, which otherwise gets updated by the
    //   // value property
    //   requestAnimationFrame(() =>
    //   {
    //     requestAnimationFrame(() =>
    //     {

    //       updateSelectedColor();
          
    //       isPickingSaturationLightness.current = false;
    //       isPickingHue.current = false;
    //       isSettingHex.current = false;
    //     });
    //   });
    // };


    // console.log(window);
    // window.removeEventListener('mousemove', onMouseMove);
    // window.removeEventListener('mouseup', onMouseUp);
    // window.removeEventListener('mouseleave', onMouseUp);
    // window.addEventListener('mousemove', onMouseMove);
    // window.addEventListener('mouseup', onMouseUp, {once: true});
    // window.addEventListener('mouseleave', onMouseUp, {once: true});

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
          
          updateHexValue(value);
          
        }} />
      </label>
      <div className="integer-values">
        <label className="field red">
          <div className="label">Red</div>
          <input type="text" value={targetRedInt} onChange={(event) =>
          {
            const stringValue = (event.target as HTMLInputElement).value;
            const intValue = parseInt(stringValue);
            if(isNaN(intValue)) { return; }

            updateRedValue(intValue);
          }} />
        </label>
        <label className="field green">
          <div className="label">Green</div>
          <input type="text" value={targetBlueInt} onChange={(event) =>
          {
            const stringValue = (event.target as HTMLInputElement).value;
            const intValue = parseInt(stringValue);
            if(isNaN(intValue)) { return; }
            
            updateGreenValue(intValue);
          }} />
        </label>
        <label className="field blue">
          <div className="label">Blue</div>
          <input type="text" value={targetGreenInt} onChange={(event) =>
          {
            const stringValue = (event.target as HTMLInputElement).value;
            const intValue = parseInt(stringValue);
            if(isNaN(intValue)) { return; }
            
            updateBlueValue(intValue);
          }} />
        </label>
      </div>
    </div>
    <header className="color-picker-heading">Color Picker</header>
    <div className="saturation-lightness"style={{ "backgroundColor": huePreviewColor }} ref={saturationLightnessPicker} onMouseDown={saturationLightness_onMouseDown} onMouseMove={onMouseMove_SaturationLightnessPicker} onMouseUp={onMouseUp_Picker}>
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
              setSelectedColor(swatches[i].toHSL());
            }} />
        })}
      </ul>
    </div>
  </div>)
}

export default ColorPickerComponentRewrite;