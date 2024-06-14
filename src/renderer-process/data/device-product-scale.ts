export class DeviceProductScale
{
    name: string;
    breakpoint: { width: number, height: number };
    imageSize: { width: number, height: number };
    className: string;
    constructor(name: string, breakpoint: { width: number, height: number }, imageSize: { width: number, height: number }, className: string)
    {
        this.name = name;
        this.breakpoint = breakpoint;
        this.imageSize = imageSize;
        this.className = className;
    }
}
export const ProductScales_Default = 
[
    new DeviceProductScale("1", { width: 0, height: 0 }, { width: 564, height: 280 }, 'scale-1'),
    new DeviceProductScale("2", { width: 1020, height: 720 }, { width: 705, height: 350 }, 'scale-2'),
    new DeviceProductScale("3", { width: 1440, height: 1080 }, { width: 1128, height: 560 }, 'scale-3'),
    new DeviceProductScale("4", { width: 2560, height: 1440 }, { width: 1692, height: 840 }, 'scale-4'),
];
export const ProductScales_V1 = 
[
    new DeviceProductScale("1", { width: 0, height: 0 }, { width: 564, height: 280 }, 'scale-1'),
    new DeviceProductScale("2", { width: 1024, height: 728 }, { width: 705, height: 350 }, 'scale-2'),
    new DeviceProductScale("3", { width: 1440, height: 1080 }, { width: 1128, height: 560 }, 'scale-3'),
    new DeviceProductScale("4", { width: 2560, height: 1440 }, { width: 1692, height: 840 }, 'scale-4'),
];