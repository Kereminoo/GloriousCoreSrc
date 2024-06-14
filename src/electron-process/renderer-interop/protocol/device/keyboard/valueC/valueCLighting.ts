import { RGBAColor } from '../../../../../../common/data/structures/rgb-color.struct';

export const MapEffectValue = (value: number): Effect => {
    switch (value) {
        case 0:
            return Effect.GloriousMode;
        case 1:
            return Effect.Wave1;
        case 2:
            return Effect.Breathing;
        case 3:
            return Effect.Wave2;
        case 4:
            return Effect.SpiralingWave;
        case 5:
            return Effect.AcidMode;
        case 6:
            return Effect.NormallyOn;
        case 7:
            return Effect.RippleGraff;
        case 8:
            return Effect.Off;
        case 9:
            return Effect.PassWithoutTrace;
        case 10:
            return Effect.FastRunWithoutTrace;
        case 11:
            return Effect.Matrix2;
        case 12:
            return Effect.Matrix3;
        case 13:
            return Effect.Rainbow;
        case 14:
            return Effect.HeartbeatSensor;
        case 15:
            return Effect.DigitalTimes;
        case 16:
            return Effect.Kamehameha;
        case 17:
            return Effect.PingPong;
        case 18:
            return Effect.Surmount;
        default:
            return Effect.Off;
    }
};

export enum Effect {
    Off,
    GloriousMode,
    Wave1,
    Wave2,
    SpiralingWave,
    AcidMode,
    Breathing,
    NormallyOn,
    RippleGraff,
    PassWithoutTrace ,
    FastRunWithoutTrace,
    Matrix2,
    Matrix3,
    Rainbow,
    HeartbeatSensor,
    DigitalTimes,
    Kamehameha,
    PingPong,
    Surmount,
}

export enum ColorMode {
    Red,
    Orange,
    Yellow,
    Green,
    Cyan,
    Blue,
    Purple,
    APColor,
    RGBMode,
}

export class LightingEffect {
    static readonly #speedSteps = 4;
    static readonly #brightnessSteps = 4;

    effect: Effect;
    speedPercent: number;
    brightnessPercent: number;
    colorMode: ColorMode;
    type: number;
    RGB: RGBAColor;

    constructor(
        effect: Effect,
        speedPercent: number,
        brightnessPercent: number,
        color: ColorMode,
        type: number,
        RGB: RGBAColor = RGBAColor.fromRGB(180, 180, 180),
    ) {
        this.effect = effect;
        this.speedPercent = speedPercent;
        this.brightnessPercent = brightnessPercent;
        this.colorMode = color;
        this.type = type;
        this.RGB = RGB;
    }

    toUint8Array(): Uint8Array {
        const optionLow = 0b00001111 & this.colorMode;
        const optionHigh = (0b00001111 & this.type) << 4;
        const option = optionLow | optionHigh;

        const speed = Math.ceil((this.speedPercent / 100) * LightingEffect.#speedSteps);
        const brightness = Math.ceil((this.brightnessPercent / 100) * LightingEffect.#brightnessSteps);

        const data = new Uint8Array(7);

        data[0] = this.effect;
        data[1] = speed;
        data[2] = brightness;
        data[3] = option;
        data[4] = this.RGB.r;
        data[5] = this.RGB.g;
        data[6] = this.RGB.b;
        return data;
    }

    fromUint8Array(data: Uint8Array): void {
        this.effect = data[0];
        this.speedPercent = (data[1] / LightingEffect.#speedSteps) * 100;
        this.brightnessPercent = (data[2] / LightingEffect.#brightnessSteps) * 100;
        this.colorMode = data[3] & 0b00001111;
        this.type = (data[3] & 0b11110000) >> 4;
        this.RGB = RGBAColor.fromRGB(data[4], data[5], data[6]);
    }
}
