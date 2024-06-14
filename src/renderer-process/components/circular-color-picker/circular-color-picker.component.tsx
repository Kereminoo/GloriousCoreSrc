import React, { ChangeEvent, MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import './circular-color-picker.component.css'

const HUE_ROTATION_OFFSET = 90;

function CircularColorPickerComponent(props: any) 
{
  const { onColorChange } = props;

  // display state
  const [isPickingLightness, setIsPickingLightness] = useState(false);
  const [isPickingHueSaturation, setIsPickingHueSaturation] = useState(false);
  let [lightnessCursorPosition, setLightnessCursorPosition] = useState({top: 0, left: 0});
  let [hueSaturationCursorPosition, setHueSaturationCursorPosition] = useState({top: 0, left: 0});

  // data state
  let [hue, setHue] = useState(0);
  let [saturation, setSaturation] = useState(0);
  let [lightness, setLightness] = useState(0);
  let [currentColor, setCurrentColor] = useState({hue: 0, saturation: 0, lightness: 0, red: 0, green: 0, blue: 0, hex: "#FFFFFF" });

  const { size } = props;
  let lightnessSize = size ?? 100;
  let hueSaturationSize = lightnessSize - (lightnessSize * .2);

  // user inputs
  const redInput = useRef(null);
  const greenInput = useRef(null);
  const blueInput = useRef(null);
  const hexInput = useRef(null);

  // set up pickers and cursors;
  const lightnessPicker = useRef(null);
  const lightnessCursor = useRef(null);
  useEffect(() =>
  {
    const canvas: HTMLCanvasElement = lightnessPicker.current!;
    const context = canvas.getContext('2d');

    const gradient = context!.createConicGradient(-1.57, lightnessSize/2, lightnessSize/2);
    gradient.addColorStop(0, "#000000"); // black
    gradient.addColorStop(1, "#ffffff"); // white
    
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, lightnessSize, lightnessSize);
  }, []);

  const hueSaturationPicker = useRef(null);
  const hueSaturationCursor = useRef(null);
  useEffect(() =>
  {
    const canvas: HTMLCanvasElement = hueSaturationPicker.current!;
    const context = canvas.getContext('2d');    

    const gradient = context!.createConicGradient(-1.57, hueSaturationSize/2, hueSaturationSize/2);
    const split = 1/6;
    gradient.addColorStop(split * 0, "#ff0000"); // red
    gradient.addColorStop(split * 1, "#ffff00"); // yellow
    gradient.addColorStop(split * 2, "#00ff00"); // green
    gradient.addColorStop(split * 3, "#00ffff"); // cyan
    gradient.addColorStop(split * 4, "#0000ff"); // blue
    gradient.addColorStop(split * 5, "#ff00ff"); // magenta
    gradient.addColorStop(split * 6, "#ff0000"); // red
    
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, lightnessSize, lightnessSize);
  }, []);

  useEffect(() =>
  {
    if(onColorChange != null)
    {
      onColorChange(new RGBAColor(currentColor.red, currentColor.green, currentColor.blue, 1));
    }

  }, [currentColor])



  const hueSaturation_onMouseDown = (event:MouseEvent) =>
  {
    setIsPickingHueSaturation(true);

    const target = event.target as HTMLElement;
    let bounds = target.getBoundingClientRect();
    const cursorBounds = (hueSaturationCursor.current! as HTMLElement).getBoundingClientRect();
    const localX = event.clientX - bounds.left + target.offsetLeft;
    const localY = event.clientY - bounds.top + target.offsetTop;
    setHueSaturationCursorPosition({ top: localY, left: localX });

    const hueSaturation_onMouseMove = (event:any) =>
    {
      if(event == null) { return; }
      const target = hueSaturationPicker.current! as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const localX = event.clientX - bounds.left + target.offsetLeft;
      const localY = event.clientY - bounds.top + target.offsetTop;

      const targetCenter = { x: target.offsetTop + (target.offsetHeight / 2), y: target.offsetLeft + (target.offsetWidth / 2) };
      const localCenter = { x: localX + (cursorBounds.height / 2), y: localY + (cursorBounds.width / 2) };
      const radius = hueSaturationSize/2;

      const distanceFromCenter = getDistance(targetCenter.x, targetCenter.y, localX, localY);
      // console.log(distanceFromCenter);
      const orientation = Math.atan2(localY - targetCenter.y, localX - targetCenter.x) * 180 / Math.PI; // between -180 and 180;
      // console.log(angle);
      if(distanceFromCenter < radius)
      {
        setHueSaturationCursorPosition({ top: localY, left: localX });
      }
      else 
      {
        var pointX = radius + Math.cos(Math.PI * orientation / -180) * radius;
        var pointY = radius - Math.sin(Math.PI * orientation / -180) * radius;
  
        const adjustedX = pointX + cursorBounds.width ;
        const adjustedY = pointY + cursorBounds.height;
        // console.log(adjustedX, adjustedY);

        setHueSaturationCursorPosition({ top: adjustedY, left: adjustedX });
      }

      let hue = orientation + HUE_ROTATION_OFFSET % 360; // between 0 and 360;
      if(hue < 0)
      {
        hue += 360;
      }
      // console.log(hue);

      let saturation = (distanceFromCenter < radius) ? distanceFromCenter / radius : 1; // between 0 and 1;
      saturation = saturation * 100; // between 0 and 100;
      // console.log(saturation);

      // store values;
      setHue(hue);
      setSaturation(saturation);

      
      // should be a updateCurrentColor function but won't
      // update in realtime if state update is moved to other function
      const currentColor = {
        hue,
        saturation,
        lightness,
        red: 0,
        green: 0,
        blue: 0,
        hex: ""
      };

      const rgb = hslToRgb({h: hue, s: saturation, l: lightness});
      currentColor.red = Math.round(rgb.r);
      currentColor.green = Math.round(rgb.g);
      currentColor.blue = Math.round(rgb.b);

      currentColor.hex = RGBToHex(rgb.r, rgb.g, rgb.b);

      console.log(currentColor.hex);

      setCurrentColor(currentColor);

      event.preventDefault();
      event.stopPropagation();
    };
  
    const hueSaturation_onMouseUp = (event:any) =>
    {
      window.removeEventListener('mousemove', hueSaturation_onMouseMove);
      window.removeEventListener('mouseup', hueSaturation_onMouseUp);
      // window.removeEventListener('mouseleave', handleMouseCancel);
      console.log('removed listeners');
  
      setIsPickingHueSaturation(false);
    };


    // console.log(window);
    window.removeEventListener('mousemove', hueSaturation_onMouseMove);
    window.removeEventListener('mouseup', hueSaturation_onMouseUp);
    // window.removeEventListener('mouseleave', handleMouseCancel);
    window.addEventListener('mousemove', hueSaturation_onMouseMove);
    window.addEventListener('mouseup', hueSaturation_onMouseUp, {once: true});
    // window.addEventListener('mouseleave', handleMouseCancel, {once: true});

    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const lightness_onMouseDown = (event:MouseEvent) =>
  {
    setIsPickingLightness(true);

    const target = event.target as HTMLElement;
    let bounds = target.getBoundingClientRect();
    const cursorBounds = (lightnessCursor.current! as HTMLElement).getBoundingClientRect();
    const localX = event.clientX - bounds.left + target.offsetLeft;
    const localY = event.clientY - bounds.top + target.offsetTop;
    setLightnessCursorPosition({ top: localY, left: localX });

    const lightness_onMouseMove = (event:any) =>
    {
      if(event == null) { return; }
      const target = lightnessPicker.current! as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const localX = event.clientX - bounds.left + target.offsetLeft;
      const localY = event.clientY - bounds.top + target.offsetTop;

      const targetCenter = { x: target.offsetTop + (target.offsetHeight / 2), y: target.offsetLeft + (target.offsetWidth / 2) };
      const radius = lightnessSize/2 - (cursorBounds.width/2);
      
      const orientation = Math.atan2(localY - targetCenter.y, localX - targetCenter.x) * 180 / Math.PI; // between -180 and 180;
      var pointX = radius + Math.cos(Math.PI * orientation / -180) * radius;
      var pointY = radius - Math.sin(Math.PI * orientation / -180) * radius;

      const adjustedX = pointX + (cursorBounds.width/2);
      const adjustedY = pointY + (cursorBounds.width/2);
      setLightnessCursorPosition({ top: adjustedY, left: adjustedX });

      let lightness = orientation + HUE_ROTATION_OFFSET % 360; // between 0 and 360;
      if(lightness < 0)
      {
        lightness += 360;
      }
      lightness = lightness/360; // between 0 and 1;
      lightness = lightness * 100; // between 0 and 100;

      // store value;
      setLightness(lightness);
      

      // should be a updateCurrentColor function but won't
      // update in realtime if state update is moved to other function
      const currentColor = {
        hue,
        saturation,
        lightness,
        red: 0,
        green: 0,
        blue: 0,
        hex: ""
      };

      const rgb = hslToRgb({h: hue, s: saturation, l: lightness});
      currentColor.red = rgb.r;
      currentColor.green = rgb.g;
      currentColor.blue = rgb.b;

      currentColor.hex = RGBToHex(rgb.r, rgb.g, rgb.b);

      // console.log(currentColor.hex);

      setCurrentColor(currentColor);

      event.preventDefault();
      event.stopPropagation();
    };
  
    const lightness_onMouseUp = (event:any) =>
    {
      window.removeEventListener('mousemove', lightness_onMouseMove);
      window.removeEventListener('mouseup', lightness_onMouseUp);
      // window.removeEventListener('mouseleave', handleMouseCancel);
      console.log('removed listeners');
  
      setIsPickingHueSaturation(false);
    };


    // console.log(window);
    window.removeEventListener('mousemove', lightness_onMouseMove);
    window.removeEventListener('mouseup', lightness_onMouseUp);
    window.addEventListener('mousemove', lightness_onMouseMove);
    window.addEventListener('mouseup', lightness_onMouseUp, {once: true});

    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  
  const handleInputChange = (event: ChangeEvent) =>
  {
    let redInt = parseInt((redInput.current! as HTMLInputElement).value)
    if(isNaN(redInt)) { redInt = 0; }
    

  }

  const handlePaletteClick = () =>
  {
    
  }

  return (<div data-color-picker>
    <div className="picker">
      <canvas className="lightness" ref={lightnessPicker} width={lightnessSize} height={lightnessSize} onMouseDown={lightness_onMouseDown} />
      <canvas className="hue-saturation" ref={hueSaturationPicker} width={hueSaturationSize} height={hueSaturationSize} onMouseDown={hueSaturation_onMouseDown} />
      <div ref={lightnessCursor} data-cursor="lightness" style={{translate: `${lightnessCursorPosition.left}px ${lightnessCursorPosition.top}px`}}><div className="display"></div></div>
      <div ref={hueSaturationCursor} data-cursor="hue-saturation" style={{translate: `${hueSaturationCursorPosition.left}px ${hueSaturationCursorPosition.top}px`}}><div className="display"></div></div>
    </div>
    <div className="values">
      <label data-field>
        <span className="label">Red</span>
        <span className="value">
          <input type="text" size={3} ref={redInput} value={currentColor.red} onChange={handleInputChange} />
        </span>
      </label>
      <label data-field>
        <span className="label">Green</span>
        <span className="value">
          <input type="text" size={3} ref={greenInput} value={currentColor.green} onChange={handleInputChange} />
        </span>
      </label>
      <label data-field>
        <span className="label">Blue</span>
        <span className="value">
          <input type="text" size={3} ref={blueInput} value={currentColor.blue} onChange={handleInputChange} />
        </span>
      </label>
      {/* 
      <label data-field>
        <span className="label">Hex</span>
        <span className="value">
          <input type="text" value={hexValue} />
        </span>
      </label> */}
    </div>
    <div className="palette"></div>
    <div className="current-color" style={{ backgroundColor: currentColor.hex }}></div>
  </div>)
}

function getDistance(x1:number, y1:number, x2:number, y2:number) 
{
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rgbToHsl(rgb: {r: number, g: number, b: number }) 
{
  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;

  const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
  const average: number = (max + min) / 2;
  let hue: number = average;
  let saturation: number = average;
  let luminosity: number = average;

  if (max == min) 
  {
    hue = saturation = 0; // no color
  } 
  else 
  {
    const delta = max - min;
    saturation = luminosity > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    if (max == red)
    {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    }
    else if (max == green)
    {
      hue = (blue - red) / delta + 2;
    }
    else if (max == blue)
    {
      hue = (red - green) / delta + 4;
    }

    hue /= 6
  }

  hue *= 360;
  saturation *= 100;
  luminosity *= 100;

  return { h: hue, s: saturation, l: luminosity };
}

function hslToRgb(hsl: {h: number, s: number, l: number })
{
  const hue: number = hsl.h / 360;
  const saturation: number = hsl.s / 100;
  const luminosity: number = hsl.l / 100;

  let red: number = 0; 
  let green: number = 0; 
  let blue: number = 0;

  if (saturation == 0) 
  {
    red = green = blue = luminosity; // no color
  } 
  else 
  {
    function hue2rgb(p: number, q: number, t: number) 
    {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p;
    }

    const q = luminosity < 0.5 ? luminosity * (1 + saturation) : luminosity + saturation - luminosity * saturation;
    const p = 2 * luminosity - q;

    red = hue2rgb(p, q, hue + 1/3);
    green = hue2rgb(p, q, hue);
    blue = hue2rgb(p, q, hue - 1/3);
  }

  red *= 255;
  green *= 255;
  blue *= 255;

  return { r: red, g: green, b: blue };
}

function RGBToHex(r:any,g:any,b:any) 
{
  r = Math.round(r).toString(16);
  g = Math.round(g).toString(16);
  b = Math.round(b).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

export default CircularColorPickerComponent;