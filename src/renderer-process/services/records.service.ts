import { LightingLayoutRecord } from 'src/common/data/records/lighting-layout.record';
import { MacroRecord } from '../../common/data/records/macro.record';
// import { default as devicesData } from '../debug/getAllDevices_all.json';
import { DataService } from './data.service';

const debugMacros: any[] = [
    {
        name: 'Debug Macro - Basic',
        value: 9000,
        m_Identifier: '1683145666028',
        content: {
            Numpad1: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 72,
                        marginleft: '72px',
                        endTime: 72,
                        width: 5,
                        isDown: false,
                        tipStart: 'Numpad1_tipStart0',
                        tipEnd: 'Numpad1_tipEnd0',
                        tipInterval: 'Numpad1_tipInterval0',
                    },
                    {
                        startTime: 176,
                        marginleft: '176px',
                        endTime: 184,
                        width: 8,
                        isDown: false,
                        tipStart: 'Numpad1_tipStart1',
                        tipEnd: 'Numpad1_tipEnd1',
                        tipInterval: 'Numpad1_tipInterval1',
                    },
                ],
            },
            KeyA: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 280,
                        marginleft: '280px',
                        endTime: 288,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyA_tipStart0',
                        tipEnd: 'KeyA_tipEnd0',
                        tipInterval: 'KeyA_tipInterval0',
                    },
                ],
            },
            KeyS: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 320,
                        marginleft: '320px',
                        endTime: 332,
                        width: 12,
                        isDown: false,
                        tipStart: 'KeyS_tipStart0',
                        tipEnd: 'KeyS_tipEnd0',
                        tipInterval: 'KeyS_tipInterval0',
                    },
                    {
                        startTime: 400,
                        marginleft: '400px',
                        endTime: 404,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyS_tipStart1',
                        tipEnd: 'KeyS_tipEnd1',
                        tipInterval: 'KeyS_tipInterval1',
                    },
                ],
            },
            F5: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 552,
                        marginleft: '552px',
                        endTime: 556,
                        width: 4,
                        isDown: false,
                        tipStart: 'F5_tipStart0',
                        tipEnd: 'F5_tipEnd0',
                        tipInterval: 'F5_tipInterval0',
                    },
                    {
                        startTime: 580,
                        marginleft: '580px',
                        endTime: 584,
                        width: 4,
                        isDown: false,
                        tipStart: 'F5_tipStart1',
                        tipEnd: 'F5_tipEnd1',
                        tipInterval: 'F5_tipInterval1',
                    },
                ],
            },
            ControlRight: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 768,
                        marginleft: '768px',
                        endTime: 856,
                        width: 88,
                        isDown: false,
                        tipStart: 'ControlRight_tipStart0',
                        tipEnd: 'ControlRight_tipEnd0',
                        tipInterval: 'ControlRight_tipInterval0',
                    },
                ],
            },
            KeyF: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 820,
                        marginleft: '820px',
                        endTime: 820,
                        width: 5,
                        isDown: false,
                        tipStart: 'KeyF_tipStart0',
                        tipEnd: 'KeyF_tipEnd0',
                        tipInterval: 'KeyF_tipInterval0',
                    },
                    {
                        startTime: 1500,
                        marginleft: '1500px',
                        endTime: 1508,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyF_tipStart1',
                        tipEnd: 'KeyF_tipEnd1',
                        tipInterval: 'KeyF_tipInterval1',
                    },
                ],
            },
            ShiftLeft: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 1352,
                        marginleft: '1352px',
                        endTime: 1444,
                        width: 92,
                        isDown: false,
                        tipStart: 'ShiftLeft_tipStart0',
                        tipEnd: 'ShiftLeft_tipEnd0',
                        tipInterval: 'ShiftLeft_tipInterval0',
                    },
                ],
            },
            KeyD: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 1392,
                        marginleft: '1392px',
                        endTime: 1396,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyD_tipStart0',
                        tipEnd: 'KeyD_tipEnd0',
                        tipInterval: 'KeyD_tipInterval0',
                    },
                    {
                        startTime: 1408,
                        marginleft: '1408px',
                        endTime: 1412,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyD_tipStart1',
                        tipEnd: 'KeyD_tipEnd1',
                        tipInterval: 'KeyD_tipInterval1',
                    },
                ],
            },
            CapsLock: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 1464,
                        marginleft: '1464px',
                        endTime: 1476,
                        width: 12,
                        isDown: false,
                        tipStart: 'CapsLock_tipStart0',
                        tipEnd: 'CapsLock_tipEnd0',
                        tipInterval: 'CapsLock_tipInterval0',
                    },
                    {
                        startTime: 1548,
                        marginleft: '1548px',
                        endTime: 1556,
                        width: 8,
                        isDown: false,
                        tipStart: 'CapsLock_tipStart1',
                        tipEnd: 'CapsLock_tipEnd1',
                        tipInterval: 'CapsLock_tipInterval1',
                    },
                ],
            },
        },
        _id: 'Rkuz2UGLGCVh8qUc',
    },
    {
        name: 'Debug Macro - Empty',
        content: {},
        value: 9001,
        m_Identifier: '1',
        _id: 'SfIRhyUbf57HKn7s',
    },
    {
        name: 'Debug Macro - W Key',
        value: 9002,
        m_Identifier: '1683146090761',
        content: {
            KeyW: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 36,
                        marginleft: '36px',
                        endTime: 112,
                        width: 76,
                        isDown: false,
                        tipStart: 'KeyW_tipStart0',
                        tipEnd: 'KeyW_tipEnd0',
                        tipInterval: 'KeyW_tipInterval0',
                    },
                ],
            },
        },
        _id: 'soHAWvexkuwKfPBq',
    },

    {
        name: 'Debug Macro - Complicated',
        value: 9003,
        m_Identifier: '1683227784115',
        content: {
            KeyG: {
                targetIndex: 5,
                data: [
                    {
                        startTime: 44,
                        marginleft: '44px',
                        endTime: 48,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyG_tipStart0',
                        tipEnd: 'KeyG_tipEnd0',
                        tipInterval: 'KeyG_tipInterval0',
                    },
                    {
                        startTime: 100,
                        marginleft: '100px',
                        endTime: 104,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyG_tipStart1',
                        tipEnd: 'KeyG_tipEnd1',
                        tipInterval: 'KeyG_tipInterval1',
                    },
                    {
                        startTime: 108,
                        marginleft: '108px',
                        endTime: 112,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyG_tipStart2',
                        tipEnd: 'KeyG_tipEnd2',
                        tipInterval: 'KeyG_tipInterval2',
                    },
                    {
                        startTime: 816,
                        marginleft: '816px',
                        endTime: 820,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyG_tipStart3',
                        tipEnd: 'KeyG_tipEnd3',
                        tipInterval: 'KeyG_tipInterval3',
                    },
                    {
                        startTime: 824,
                        marginleft: '824px',
                        endTime: 832,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyG_tipStart4',
                        tipEnd: 'KeyG_tipEnd4',
                        tipInterval: 'KeyG_tipInterval4',
                    },
                    {
                        startTime: 840,
                        marginleft: '840px',
                        endTime: 844,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyG_tipStart5',
                        tipEnd: 'KeyG_tipEnd5',
                        tipInterval: 'KeyG_tipInterval5',
                    },
                ],
            },
            KeyA: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 72,
                        marginleft: '72px',
                        endTime: 80,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyA_tipStart0',
                        tipEnd: 'KeyA_tipEnd0',
                        tipInterval: 'KeyA_tipInterval0',
                    },
                    {
                        startTime: 120,
                        marginleft: '120px',
                        endTime: 128,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyA_tipStart1',
                        tipEnd: 'KeyA_tipEnd1',
                        tipInterval: 'KeyA_tipInterval1',
                    },
                ],
            },
            KeyJ: {
                targetIndex: 3,
                data: [
                    {
                        startTime: 224,
                        marginleft: '224px',
                        endTime: 228,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyJ_tipStart0',
                        tipEnd: 'KeyJ_tipEnd0',
                        tipInterval: 'KeyJ_tipInterval0',
                    },
                    {
                        startTime: 240,
                        marginleft: '240px',
                        endTime: 248,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyJ_tipStart1',
                        tipEnd: 'KeyJ_tipEnd1',
                        tipInterval: 'KeyJ_tipInterval1',
                    },
                    {
                        startTime: 336,
                        marginleft: '336px',
                        endTime: 340,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyJ_tipStart2',
                        tipEnd: 'KeyJ_tipEnd2',
                        tipInterval: 'KeyJ_tipInterval2',
                    },
                    {
                        startTime: 692,
                        marginleft: '692px',
                        endTime: 700,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyJ_tipStart3',
                        tipEnd: 'KeyJ_tipEnd3',
                        tipInterval: 'KeyJ_tipInterval3',
                    },
                ],
            },
            KeyU: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 260,
                        marginleft: '260px',
                        endTime: 268,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyU_tipStart0',
                        tipEnd: 'KeyU_tipEnd0',
                        tipInterval: 'KeyU_tipInterval0',
                    },
                ],
            },
            ShiftLeft: {
                targetIndex: 1,
                data: [
                    {
                        startTime: 476,
                        marginleft: '476px',
                        endTime: 560,
                        width: 84,
                        isDown: false,
                        tipStart: 'ShiftLeft_tipStart0',
                        tipEnd: 'ShiftLeft_tipEnd0',
                        tipInterval: 'ShiftLeft_tipInterval0',
                    },
                    {
                        startTime: 888,
                        marginleft: '888px',
                        endTime: 1036,
                        width: 148,
                        isDown: false,
                        tipStart: 'ShiftLeft_tipStart1',
                        tipEnd: 'ShiftLeft_tipEnd1',
                        tipInterval: 'ShiftLeft_tipInterval1',
                    },
                ],
            },
            KeyM: {
                targetIndex: 0,
                data: [
                    {
                        startTime: 512,
                        marginleft: '512px',
                        endTime: 520,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyM_tipStart0',
                        tipEnd: 'KeyM_tipEnd0',
                        tipInterval: 'KeyM_tipInterval0',
                    },
                ],
            },
            KeyK: {
                targetIndex: 3,
                data: [
                    {
                        startTime: 676,
                        marginleft: '676px',
                        endTime: 684,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyK_tipStart0',
                        tipEnd: 'KeyK_tipEnd0',
                        tipInterval: 'KeyK_tipInterval0',
                    },
                    {
                        startTime: 712,
                        marginleft: '712px',
                        endTime: 720,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyK_tipStart1',
                        tipEnd: 'KeyK_tipEnd1',
                        tipInterval: 'KeyK_tipInterval1',
                    },
                    {
                        startTime: 932,
                        marginleft: '932px',
                        endTime: 936,
                        width: 4,
                        isDown: false,
                        tipStart: 'KeyK_tipStart2',
                        tipEnd: 'KeyK_tipEnd2',
                        tipInterval: 'KeyK_tipInterval2',
                    },
                    {
                        startTime: 976,
                        marginleft: '976px',
                        endTime: 984,
                        width: 8,
                        isDown: false,
                        tipStart: 'KeyK_tipStart3',
                        tipEnd: 'KeyK_tipEnd3',
                        tipInterval: 'KeyK_tipInterval3',
                    },
                ],
            },
        },
        _id: 'DWJvJrnHtGryOgmO',
    },
];


export function generateRecordId() : string
{
  const block: Uint8Array = new Uint8Array(20); // allocate memory
  crypto.getRandomValues(block); // fill with random values

  // convert to base64
  const base64: string = [].slice.apply(block)
  .map((character: number) => { return String.fromCharCode(character); })
  .join('');

  // format id to prevent character-caused issues
  const id: string = btoa(base64)
  .replace(/\//g, '_') // forward slash to underscore; / -> _
  .replace(/\+/g, '-') // plus to dash; + -> -
  .replace(/=/g, ''); // remove base64 padding (equals signs)

  return id;
}


let macroRecords: MacroRecord[] = [];
let lightingLayoutRecords: LightingLayoutRecord[] = [];

// Macro CRUD
export async function saveMacroRecord(record: MacroRecord) {
    if (record.value < 0) {
        const records = await getMacros();
        const values = records.map((x) => x.value);
        let v = 0;
        for (; v < values.length; ++v) {
            if (!values.includes(v)) break;
        }
        record.value = v;
        return addMacroRecord(record);
    }

    const existingRecord = await getMacro(record.value);
    if (existingRecord == null) {
        return addMacroRecord(record);
    }
    return updateMacroRecord(record);
}
export async function addMacroRecord(record: MacroRecord)
{
    await DataService.insertMacro(record);
}
export async function updateMacroRecord(record: MacroRecord)
{
  const records = await getMacroRecords();
  for(let i = 0 ; i < records.length; i++)
  {
    if(records[i].value == record.value)
    {
      Object.assign(records[i], record);
    }
  }
  await DataService.updateMacro(record.value, record);
}

export async function getMacros(values?: number[]): Promise<Array<MacroRecord>> {
    const records = macroRecords.length == 0 ? await getMacroRecords() : macroRecords;
    if (values == null) return records;

    const filtered = records.filter((x) => values.includes(x.value));
    return filtered;
}

export async function getMacroRecords() : Promise<Array<MacroRecord>>
{
    const macros = await DataService.getMacro();
    macros.sort((a, b) => a.value - b.value);
    console.log(macros);
    const records = macros.map((x) => {
        const record = new MacroRecord(x);
        if (Array.isArray(x.content) && x.content.length == 0) record.content = {};
        return record;
    });
    console.log('getMacroFromDB', records);

    // const addDebugMacros = true; // todo: move this where it makes sense
    // if(addDebugMacros == true)
    // {
    //     records = records.concat(...debugMacros);
    // }

    macroRecords = records;

    return macroRecords;
}
export async function getMacro(value: number) : Promise<MacroRecord|null>
{
    const records = await getMacros();
    return records.find((x) => x.value == value) ?? null;
}
export async function deleteMacroRecord(value: number)
{
    await DataService.DeleteMacro(value);
}

//[TODO: generalize these two enough that device, plugin, support, and app data can all be used in the same way]

// Lighting Layout CRUD
// export async function saveLightingLayoutRecord(record: LightingLayoutRecord)
// {
//   const existingRecord = await getLightingLayout(record.value);
//   if(existingRecord == null) { return addLightingLayoutRecord(record); }
//   return updateLightingLayoutRecord(record);
// }
export async function addLightingLayoutRecord(record: LightingLayoutRecord)
{
    lightingLayoutRecords.push(record);
    const compareData = // copied from legacy code
    {
        "_id": "S21tw2mhN6A65aVZnS",
    }
    DataService.updateLayoutAlldata(compareData, lightingLayoutRecords);
}
export async function updateLightingLayoutRecord(record: LightingLayoutRecord)
{
    let existingLayout: LightingLayoutRecord|null = null;
    for(let i = 0 ; i < lightingLayoutRecords.length; i++)
    {
        if(lightingLayoutRecords[i].SN == record.SN && lightingLayoutRecords[i].value == record.value)
        {
            existingLayout = lightingLayoutRecords[i];
        }
    }

    if(existingLayout == null)
    {
        addLightingLayoutRecord(record);
        return;
    }
    else
    {
        Object.assign(existingLayout, record);
    }

    const compareData = // copied from legacy code
    {
        "_id": "S21tw2mhN6A65aVZnS",
    }
    DataService.updateLayoutAlldata(compareData, lightingLayoutRecords);
}
export async function getLightingLayouts(values?: number[]) : Promise<Array<LightingLayoutRecord>>
{
    const records = (lightingLayoutRecords.length == 0) ? await getLightingLayoutRecords() : lightingLayoutRecords;
    if(values == null) { return records;  }

    const filtered: LightingLayoutRecord[] = [];
    for(let i = 0; i <  records.length; i++)
    {
        const record = records[i];
        if(values.indexOf(record.value))
        {
            filtered.push(record);
        }
    }

    return filtered;
}
// export const refreshLightingLayouts = getLightingLayouts; // logical alias for api usage
export async function getLightingLayoutRecords() : Promise<Array<LightingLayoutRecord>>
{
    const allLightingData = await DataService.getLayout();
    const layouts = allLightingData.AllData;

    lightingLayoutRecords = layouts;
    // console.log('getLayout', lightingLayoutRecords);

    return lightingLayoutRecords;
}
export async function getLightingLayout(value: number) : Promise<LightingLayoutRecord|null>
{
    const records = await getLightingLayouts();
    for(let i = 0 ; i < records.length; i++)
    {
        if(records[i].value == value)
        {
            return records[i];
        }
    }
    return null;
}
export async function deleteLightingLayoutRecord(SN: string, value: number)
{
//   const records = await getMacroRecords();
    let recordIndex = -1;
    for(let i = 0 ; i < lightingLayoutRecords.length; i++)
    {
        if(lightingLayoutRecords[i].SN == SN && lightingLayoutRecords[i].value == value)
        {
            recordIndex = i;
        }
    }
    if(recordIndex > -1)
    {
        lightingLayoutRecords.splice(recordIndex, 1);
    }
    const compareData = // copied from legacy code
    {
        "_id": "S21tw2mhN6A65aVZnS",
    }
    DataService.updateLayoutAlldata(compareData, lightingLayoutRecords);
}
