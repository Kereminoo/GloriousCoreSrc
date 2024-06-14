import { HueValue, PercentValue, toHex, toRGBA } from "../../../renderer-process/services/color.service";

// Values:
// hue: 0 - 360; Red = 0-119, Green = 120 - 239, Blue = 240 - 360
// saturation: 0 - 100; 0 = grayscale, 50 = muted color, 100 = full saturation
// lightness/luminosity: 0 - 100; 0 = black, 50 = perfect hue/saturation, 100 = white

export class HSLColor
{
    #hue:HueValue = 0;
    get hue():HueValue
    {
        return this.#hue;
    }
    set hue(value: HueValue)
    {
        this.#hue = value;
    }
    get h():HueValue
    {
        return this.#hue;
    }
    set h(value:HueValue)
    {
        this.#hue = value;
    }

    #saturation:PercentValue = 100;
    get saturation():PercentValue
    {
        return this.#saturation;
    }
    set saturation(value: PercentValue)
    {
        this.#saturation = value;
    }
    get s():PercentValue
    {
        return this.#saturation;
    }
    set s(value:PercentValue)
    {
        this.#saturation = value;
    }

    #lightness:PercentValue = 100;
    get lightness():PercentValue
    {
        return this.#lightness;
    }
    set lightness(value: PercentValue)
    {
        this.#lightness = value;
    }
    get l():PercentValue
    {
        return this.#lightness;
    }
    set l(value:PercentValue)
    {
        this.#lightness = value;
    }

    toRGBA()
    {
        return toRGBA(this);
    }
    toHSL()
    {
        return this;
    }
    toHex()
    {
        return toHex(this);
    }
    toArray_rgba(): Array<number>
    {
        const rgbaColor = toRGBA(this);
        return [rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a];
    }
    toArray_hsl(): Array<number>
    {
        return [this.#hue, this.#saturation, this.#lightness];
    }

    static fromHSL(hue:number = 0, saturation:number = 100, lightness:number = 50)
    {
        const color = new HSLColor();
        color.#hue = hue as HueValue;
        color.#saturation = saturation as PercentValue;
        color.#lightness = lightness as PercentValue;
        return color;
    }
}