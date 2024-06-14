export class KeyboardLightingData
{
    maxkaycapNumber: number = 0;
    repeater:any;
    AllBlockColor: any[] = []
    lightData: KeyboardLightingData_LightData = new KeyboardLightingData_LightData();
    animationSpeed: number=1;
    currentBlockIndex: number=0;
    minKeyWidth: number=43;
    minKeyHeight: number=41;
    settingPerkeyName: string = '';
    imageMaxWidth: number = 0;
    imageMaxHeight: number = 0;
    recordModeArr: any[] = []
    currentModeIndex: number = 0
    twoDimensionalArray: any[] = new Array(26);//8*26;
    KeyTableArray:any[] = [];
    qigong_Step2_Range:number[] = [22,23, 38,52,51 ,36];
    qigong_Step1_Range:number[] = [0,15,30,58,71,82];
    BreathTempArray:any[] = [];
    centerBlockPoint: number = 37;
    break_DimensionalArray:any[] = [];
    max_X_Number: number = 26;
    max_Y_Number: number = 8;
}
export class KeyboardLightingData_LightData
{
    translate:string = 'GloriousMode';
    PointEffectName:string = 'GloriousMode';
    colorPickerValue:number[] = [255,0,0,1];
    brightness:number = 100;
    speed:number = 50;
}