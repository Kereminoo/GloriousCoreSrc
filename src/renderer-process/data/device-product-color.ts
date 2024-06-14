export class DeviceProductColor
{
    name: string;
    subpath: string;
    filenameAdjustment: string;
    hex: string;
    constructor(name: string, subpath: string, filenameAdjustment: string, hex: string)
    {
        this.name = name;
        this.subpath = subpath;
        this.filenameAdjustment = filenameAdjustment;
        this.hex = hex;
    }
}
export const ProductColors_Default = 
[
    new DeviceProductColor("Default", "", "", "#121212")
];

export const ProductColors_Black = 
[
    new DeviceProductColor("Black", "Black/", "Black", "#121212"),
];

export const ProductColors_BlackAndWhite = 
[
    new DeviceProductColor("Black", "Black/", "Black", "#121212"),
    new DeviceProductColor("White", "White/", "White", "#EDEDFF"),
];

export const ProductColors_BlackWhitePink = 
[
    new DeviceProductColor("Black", "Black/", "Black", "#121212"),
    new DeviceProductColor("White", "White/", "White", "#EDEDFF"),
    new DeviceProductColor("Pink", "Pink/", "Pink", "#F7C7D9"),
];

export const ProductColors_ModelOProEditions = 
[
    new DeviceProductColor("BlueLynx", "BlueLynx/", "BlueLynx", "#70b4c5"),
    new DeviceProductColor("GoldenPanda", "GoldenPanda/", "GoldenPanda", "#f1db92"),
    new DeviceProductColor("RedFox", "RedFox/", "RedFox", "#dd8a74"),
];

export const ProductColors_ModelDProEditions = 
[
    new DeviceProductColor("Flamingo", "Flamingo/", "Flamingo", "#eb96a4"),
    new DeviceProductColor("Skyline", "Skyline/", "Skyline", "#79c1e5"),
    new DeviceProductColor("Vice", "Vice/", "Vice", "#707070"),
];

export const ProductColors_SeriesOneProEditions = 
[
    new DeviceProductColor("Centauri", "Centauri/", "Centauri", "#db1a3c"),
    new DeviceProductColor("Genos", "Genos/", "Genos", "#f0a229"),
    new DeviceProductColor("Vidar", "Vidar/", "Vidar", "#4085dc"),
];