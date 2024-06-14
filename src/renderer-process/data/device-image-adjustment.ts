import { Position2D } from "./position-2d";

export class DeviceImageAdjustment
{
    scale: number = 1;
    translation: Position2D = {x: 0, y: 0};
    constructor(scale: number = 1, translation: Position2D = {x: 0, y: 0})
    {
        this.scale = scale;
        this.translation = translation;
    }
}