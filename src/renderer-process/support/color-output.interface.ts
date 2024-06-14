import { Hsl } from './hsl.interface';
import { Rgb } from './rgb.interface';

export interface ColorOutput {
    rgb: Rgb;
    hex: number;
    hexString: string;
    hsl: Hsl;
}
