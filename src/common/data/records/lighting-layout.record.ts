import { AppRecord } from "./app-record";

export type LightingLayoutData =
{
    _id: string;
    AllData: LightingLayoutRecord[];
}

export class LightingLayoutRecord extends AppRecord
{
    SN: string = "Error";
    devicename: string = "Error";
    m_Identifier: string = "1";
    name: string = "NewLayout";
    value: number = 0;
    content!: LightingLayoutContent;
}
export class LightingLayoutContent
{
    AllBlockColor: LightingLayoutBlockColor[] = [];
    lightData: LightingLayoutLightData;

    constructor(AllBlockColor: LightingLayoutBlockColor[], lightData: LightingLayoutLightData)
    {
        this.AllBlockColor = AllBlockColor;
        this.lightData = lightData;
    }
}
export class LightingLayoutBlockColor
{
    breathing: boolean = false;
    clearStatus: boolean = false;
    color: number[] = [0,0,0,0];
    brightness: number = 60;
}
export class LightingLayoutLightData
{
    breathing:boolean = false;
    brightness:number = 60;
    brightness_Enable:boolean = false;
    colorHex: string = "#ff0000";
    colorPickerValue: number[] = [255, 0, 0, 1];
    color_Enable: boolean = false;
    isRainbow: boolean = false;
    lightSelected: any;
    rate: number = 50;
    rate_Enable: boolean = false;
    sideLightColor: number[] = [0, 0, 0, 0];
    sideLightSync: boolean = false;
}