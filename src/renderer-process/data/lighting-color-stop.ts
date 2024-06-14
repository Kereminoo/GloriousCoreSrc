export class LightingColorStop 
{ 
     hex: string;
     stop?: number;

    constructor(hex: string, stop?: number) 
    {
        this.hex = hex;
        this.stop = stop;
    } 
}