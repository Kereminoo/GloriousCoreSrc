import { HSLColor } from "../../common/data/structures/hsl-color.struct";
import { RGBAColor } from "../../common/data/structures/rgb-color.struct";
import { ComputeRange } from "../../common/data/types/compute-range.type";

export type RGBValue = ComputeRange<256>[number];
export type HueValue = ComputeRange<361>[number];
export type PercentValue = ComputeRange<101>[number];

export function toRGBA(hsl: HSLColor): RGBAColor
{
    const hue = hsl.h / 360;
    const saturation = hsl.s / 100;
    const luminosity = hsl.l / 100;
  
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
  
    return RGBAColor.fromRGB(red, green, blue);
}
export function toHSL(rgb: RGBAColor): HSLColor
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

    return HSLColor.fromHSL(hue, saturation, luminosity);
}
export function toHex(color:RGBAColor|HSLColor): string
{
    const rgbaColor = (color instanceof RGBAColor) ? color : toRGBA(color as HSLColor);

    let redString = Math.round(rgbaColor.r).toString(16);
    let greenString = Math.round(rgbaColor.g).toString(16);
    let blueString = Math.round(rgbaColor.b).toString(16);
  
    if (redString.length == 1)
    {
        redString = "0" + redString;
    }
    if (greenString.length == 1)
    {
        greenString = "0" + greenString;
    }
    if (blueString.length == 1)
    {
        blueString = "0" + blueString;
    }
  
    return "#" + redString + greenString + blueString;
}

export function toArray_rgba(color:RGBAColor|HSLColor): Array<number>
{
    const rgbaColor = (color instanceof RGBAColor) ? color : toRGBA(color as HSLColor);
    return [rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a];
}
export function toArray_hsl(color:RGBAColor|HSLColor): Array<number>
{
    const hslColor = (color instanceof HSLColor) ? color : toHSL(color as RGBAColor);
    return [hslColor.h, hslColor.s, hslColor.l];
}