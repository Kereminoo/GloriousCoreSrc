import { DisplayOption } from "./display-option";
import { LightingColorStop } from "./lighting-color-stop";

export const RGBGradients_Default = 
[
    new DisplayOption('OGRGB', "Option_RGBGradient_OGRGB", null, {
        translationFallback: "OG RGB",
        stops: [
            new LightingColorStop('#FF0000'),
            new LightingColorStop('#FFC400'),
            new LightingColorStop('#FBFF00'),
            new LightingColorStop('#00FF33'),
            new LightingColorStop('#00FBFF'),
            new LightingColorStop('#0004FF'),
            new LightingColorStop('#E600FF'),
        ]
    }),
    new DisplayOption('OGRGBRainbowRGB', "Option_RGBGradient_RGBRainbow", null, {
        translationFallback: "RGB Rainbow",
        stops: [
            new LightingColorStop('#FF009D'),
            new LightingColorStop('#FBFF00'),
            new LightingColorStop('#95FF00'),
            new LightingColorStop('#00E5FF')
        ]
    }),
    new DisplayOption('PinkGrapefruit', "Option_RGBGradient_PinkGrapefruit", null, {
        translationFallback: "Pink Grapefruit",
        stops: [
            new LightingColorStop('#FFEF5F'),
            new LightingColorStop('#FFA1C0'),
            new LightingColorStop('#EF142E'),
        ]
    }),
    new DisplayOption('Nebula', "Option_RGBGradient_Nebula", null, {
        translationFallback: "Nebula",
        stops: [
            new LightingColorStop('#8C17FF'),
            new LightingColorStop('#FF31FB'),
            new LightingColorStop('#FFB5EA'),
        ]
    }),
    new DisplayOption('Pastel', "Option_RGBGradient_Pastel", null, {
        translationFallback: "Pastel",
        stops: [
            new LightingColorStop('#4DF4A7'),
            new LightingColorStop('#33D9FF'),
            new LightingColorStop('#FF99B4'),
        ]
    }),
    new DisplayOption('CelestialFire', "Option_RGBGradient_CelestialFire", null, {
        translationFallback: "Celestial Fire",
        stops: [
            new LightingColorStop('#0000B3'),
            new LightingColorStop('#6300FF'),
            new LightingColorStop('#FF0043'),
            new LightingColorStop('#FF9100'),
            new LightingColorStop('#FFF800'),
        ]
    }),
    new DisplayOption('CelestialIce', "Option_RGBGradient_CelestialIce", null, {
        translationFallback: "Celestial Ice",
        stops: [
            new LightingColorStop('#0000B3'),
            new LightingColorStop('#6300FF'),
            new LightingColorStop('#FF0043'),
            new LightingColorStop('#FFFFFF'),
        ]
    }),
    new DisplayOption('Chameleon', "Option_RGBGradient_Chameleon", null, {
        translationFallback: "Chameleon",
        stops: [
            new LightingColorStop('#00FBFF'),
            new LightingColorStop('#C8FF00'),
            new LightingColorStop('#FFEE00'),
        ]
    }),
    new DisplayOption('GloriousGold', "Option_RGBGradient_GloriousGold", null, {
        translationFallback: "Glorious Gold",
        stops: [
            new LightingColorStop('#FFAC2A'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#FFAC2A'),
        ]
    }),
    new DisplayOption('Rave', "Option_RGBGradient_Rave", null, {
        translationFallback: "Rave",
        stops: [
            new LightingColorStop('#FF0000'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#FFC400'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#FBFF00'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#00FF33'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#00FBFF'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#0004FF'),
            new LightingColorStop('#000000'),
            new LightingColorStop('#E600FF'),
        ]
    }),
    new DisplayOption('Kitt', "Option_RGBGradient_Kitt", null, {
        translationFallback: "Kitt",
        stops: [
            new LightingColorStop('#FF0000'),
            new LightingColorStop('#FF8165'),
            new LightingColorStop('#FFFFFF'),
            new LightingColorStop('#000000'),
        ]
    }),
]