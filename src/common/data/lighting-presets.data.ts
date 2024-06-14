export type LightingPresetKeys = 
  'GloriousMode'
| 'Wave1'
| 'Wave2'
| 'SpiralingWave'
| 'AcidMode'
| 'Breathing'
| 'NormallyOn'
| 'RippleGraff'
| 'PassWithoutTrace'
| 'FastRunWithoutTrace'
| 'Matrix2'
| 'Matrix3'
| 'Rainbow'
| 'HeartbeatSensor'
| 'DigitalTimes'
| 'Kamehemeha'
| 'Pingpong'
| 'Surmount'
| 'LEDOFF';
export type LightingPreset = { key: LightingPresetKeys } & Record<Exclude<string, "key">, any>;
export const LightingPresets_Keyboard: { [key in LightingPresetKeys]: LightingPreset } = 
{
    'GloriousMode': { key: 'GloriousMode' },
    'Wave1': { key: 'Wave1' },
    'Wave2': { key: 'Wave2' },
    'SpiralingWave': { key: 'SpiralingWave' },
    'AcidMode': { key: 'AcidMode' },
    'Breathing': { key: 'Breathing' },
    'NormallyOn': { key: 'NormallyOn' },
    'RippleGraff': { key: 'RippleGraff' },
    'PassWithoutTrace': { key: 'PassWithoutTrace' },
    'FastRunWithoutTrace': { key: 'FastRunWithoutTrace' },
    'Matrix2': { key: 'Matrix2' },
    'Matrix3': { key: 'Matrix3' },
    'Rainbow': { key: 'Rainbow' },
    'HeartbeatSensor': { key: 'HeartbeatSensor' },
    'DigitalTimes': { key: 'DigitalTimes' },
    'Kamehemeha': { key: 'Kamehemeha' },
    'Pingpong': { key: 'Pingpong' },
    'Surmount': { key: 'Surmount' },
    'LEDOFF': { key: 'LEDOFF' },
};

export const LightingPresets_Mouse = 
{

};