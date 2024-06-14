import { PercentValue, RGBValue, toHex, toHSL } from "../../../renderer-process/services/color.service";
import { HSLColor } from "./hsl-color.struct";

const HEX_COLOR_MAX = 255;

export class RGBAColor
{
    #red:RGBValue = 0;
    get red():RGBValue
    {
        return this.#red;
    }
    set red(value: RGBValue)
    {
        this.#red = value;
    }
    get r():RGBValue
    {
        return this.#red;
    }
    set r(value:RGBValue)
    {
        this.#red = value;
    }

    #green:RGBValue = 0;
    get green():RGBValue
    {
        return this.#green;
    }
    set green(value: RGBValue)
    {
        this.#green = value;
    }
    get g():RGBValue
    {
        return this.#green;
    }
    set g(value:RGBValue)
    {
        this.#green = value;
    }

    #blue:RGBValue = 100;
    get blue():RGBValue
    {
        return this.#blue;
    }
    set blue(value: RGBValue)
    {
        this.#blue = value;
    }
    get b():RGBValue
    {
        return this.#blue;
    }
    set b(value:RGBValue)
    {
        this.#blue = value;
    }

    #alpha:PercentValue = 100;
    get alpha():PercentValue
    {
        return this.#alpha;
    }
    set alpha(value: PercentValue)
    {
        this.#alpha = value;
    }
    get a():PercentValue
    {
        return this.#alpha;
    }
    set a(value:PercentValue)
    {
        this.#alpha = value;
    }

    constructor()
    {
    }

    toRGBA(): RGBAColor
    {
        return this;
    }
    toHSL(): HSLColor
    {
        return toHSL(this);
    }
    toHex(): string
    {
        return toHex(this);
    }
    toArray_rgba(): Array<number>
    {
        return [this.#red, this.#green, this.#blue, this.#alpha];
    }
    toArray_hsl(): Array<number>
    {
        const hslColor = toHSL(this);
        return [hslColor.h, hslColor.s, hslColor.l];
    }

    static fromRGB(red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1.0)
    {
        const color = new RGBAColor();
        color.#red = red as RGBValue;
        color.#green = green as RGBValue;
        color.#blue = blue as RGBValue;
        color.#alpha = alpha as PercentValue;
        return color;
    }

    static fromHSL(hue:number = 0, saturation:number = 0, lightness:number = 0, alpha:number = 1.0)
    {
        const color = new RGBAColor();
        
        const hue_local: number = hue / 360;
        const saturation_local: number = saturation / 100;
        const luminosity_local: number = lightness / 100;

        let red: number = 0; 
        let green: number = 0; 
        let blue: number = 0;

        if (saturation_local == 0) 
        {
            red = green = blue = luminosity_local; // no color
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

            const q = luminosity_local < 0.5 ? luminosity_local * (1 + saturation_local) : luminosity_local + saturation_local - luminosity_local * saturation_local;
            const p = 2 * luminosity_local - q;

            red = hue2rgb(p, q, hue_local + 1/3);
            green = hue2rgb(p, q, hue_local);
            blue = hue2rgb(p, q, hue_local - 1/3);
        }

        color.#red = red * 255 as RGBValue;
        color.#green = green * 255 as RGBValue;
        color.#blue = blue * 255 as RGBValue;

        color.#alpha = alpha as PercentValue;
        return color;
    }

    static fromHex(hex: string)
    {
        const color = new RGBAColor();
        const rgbArray = [('0x' + hex[1] + hex[2] as any) | 0, ('0x' + hex[3] + hex[4] as any) | 0, ('0x' + hex[5] + hex[6] as any) | 0];
        color.#red = rgbArray[0] as RGBValue;
        color.#green = rgbArray[1] as RGBValue;
        color.#blue = rgbArray[2] as RGBValue;

        if(hex.length > 7)
        {
            const hexInteger = ('0x' + hex[6] + hex[7] as any) | 0;
            const hexPercent = hexInteger / HEX_COLOR_MAX;
            color.#alpha = hexPercent as PercentValue;
        }
        return color;
    }
}