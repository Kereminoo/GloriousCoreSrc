import { ipcRenderer } from 'electron';
import { default as devicesData } from '../debug/getAllDevices_all.json';

export type DebugDeviceQuery =
{
    deviceSerialNumber: string;
    instanceCount: number;
}

// Reference
/*
CORE 1
Keyboards:
Numpad: image/GMMK NUMPAD | image/navNumpad_Icon.png | 0x320F0x5088
GMMK PRO: image/GMMK Pro
GMMK PRO ISO: image/GMMK Pro ISO
GMMK v2 65 ISO: image/GMMK V2 65ISO
GMMK v2 65 US: image/GMMK V2 65US
GMMK v2 96 ISO: image/GMMK V2 96ISO
GMMK v2 96 US: image/GMMK V2 96US

Mice:
Model O Wired: image/ModelO | image/iconMice.png | 0x320F0x8888
Model O Wireless: image/ModelO | image/iconMice.png | 0x258A0x2011
Model O Minus Wired: image/ModelO | image/Model_O-_Wireless_Icon.png |  0x258A0x2036
Model O Minus Wireless: image/ModelO-Wireless | image/Model_O-_Wireless_Icon.png | 0x258A0x2013
Model O Pro Wireless: image/ModelOPROWL | image/Model_O_Pro_Wireless_icon.png | 0x258A0x2015
Model O2 Wired: image/MOWired2 | image/Model_O_V2_Wireless_icon.png | 0x320F0x823A
Model O2 Wireless: image/MOW2 | image/Model_O_V2_Wireless_icon.png | 0x093A0x822A
Model D Wireless: image/ModelDWireless | image/Model_D_Wireless_Icon.png | 0x258A0x2012
Model D Minus Wireless: image/ModelDWireless | image/Model_D_Wireless_Icon.png | 0x258A0x2014
Model D Pro Wireless: image/ModelDPROWL | image/ModelDPro_Icon.png | 0x258A0x2017
Model I: image/ModelI | image/Model_I_Icon.png | 0x22D40x1503
Model I2 Wireless: image/MI2Wireless | image/MI2Wireless_icon.png | 0x093A0x821A
Series One Pro Wireless: image/SeriesOneProWL | image/Series_One_Pro_Wireless_icon.png | 0x258A0x2018


CORE 2
Keyboards:
Numpad: GMMK NUMPAD | image/navNumpad_Icon.png | 0x320F0x5088
GMMK PRO: GMMK Pro
GMMK PRO ISO: image/GMMK Pro ISO
GMMK v2 65 ISO: image/GMMK V2 65ISO
GMMK v2 65 US: image/GMMK V2 65US
GMMK v2 96 ISO: image/GMMK V2 96ISO
GMMK v2 96 US: image/GMMK V2 96US

Mice:
Model O Wired: image/ModelO | image/iconMice.png | 0x320F0x8888
Model O Wireless: image/ModelO | image/iconMice.png | 0x258A0x2011
Model O Minus Wired: image/ModelO | image/Model_O-_Wireless_Icon.png |  0x258A0x2036
Model O Minus Wireless: image/ModelO-Wireless | image/Model_O-_Wireless_Icon.png | 0x258A0x2013
Model O Pro Wireless: image/ModelOPROWL | image/Model_O_Pro_Wireless_icon.png | 0x258A0x2015
Model O2 Wired: image/MOWired2 | image/Model_O_V2_Wireless_icon.png | 0x320F0x823A
Model O2 Wireless: image/MOW2 | image/Model_O_V2_Wireless_icon.png | 0x093A0x822A
Model D Wireless: image/ModelDWireless | image/Model_D_Wireless_Icon.png | 0x258A0x2012
Model D Minus Wireless: image/ModelDWireless | image/Model_D_Wireless_Icon.png | 0x258A0x2014
Model D Pro Wireless: image/ModelDPROWL | image/ModelDPro_Icon.png | 0x258A0x2017
Model I: image/ModelI | image/Model_I_Icon.png | 0x22D40x1503
Model I2 Wireless: image/MI2Wireless | image/MI2Wireless_icon.png | 0x093A0x821A
Series One Pro Wireless: image/SeriesOneProWL | image/Series_One_Pro_Wireless_icon.png | 0x258A0x2018

*/
// 

// temporary version mapping for layout design; dummy data;
const MockDeviceVersionMap: {[name: string]: {version_Wired: string, version_Wireless: string}} = 
{
  // Mice
  "0x320F0x8888":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x258A0x2011":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x258A0x2036":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x258A0x2013":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x258A0x2015":{ version_Wired: "01.00", version_Wireless: "01.00"},
  "0x320F0x823A":{ version_Wired: "1.0.4", version_Wireless: "1.0.4"},
  "0x258A0x2012":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x258A0x2014":{ version_Wired: "0.3.8.1", version_Wireless: "0.3.8.1"},
  "0x22D40x1503":{ version_Wired: "01.22", version_Wireless: "00.00"},
  "0x258A0x2017":{ version_Wired: "1.0.0.0", version_Wireless: "1.0.0.0"},
  "0x258A0x2018":{ version_Wired: "1.0.0.0", version_Wireless: "1.0.0.0"},
  "0x093A0x822A":{ version_Wired: "1.0.0.5", version_Wireless: "1.0.0.5"},
  "0x093A0x821A":{ version_Wired: "1.0.0.5", version_Wireless: "1.0.0.5"},
  // Keyboards
  "0x320F0x5044":{ version_Wired: "0045", version_Wireless: "99.99.99.99"},
  "0x320F0x5046":{ version_Wired: "0017", version_Wireless: "99.99.99.99"},
  "0x320F0x5045":{ version_Wired: "0019", version_Wireless: "99.99.99.99"},
  "0x320F0x504A":{ version_Wired: "0012", version_Wireless: "99.99.99.99"},
  "0x320F0x504B":{ version_Wired: "0016", version_Wireless: "99.99.99.99"},
  "0x320F0x505A":{ version_Wired: "0013", version_Wireless: "99.99.99.99"},
  "0x320F0x5088":{ version_Wired: "0088", version_Wireless: "99.99.99.99"},
  "0x320F0x5092":{ version_Wired: "0009", version_Wireless: "99.99.99.99"},
  "0x320F0x5093":{ version_Wired: "0009", version_Wireless: "99.99.99.99"},
}
export async function getDevices() : Promise<Array<any>>
{

  ipcRenderer.invoke('')

    // devicesData comes from SupportData.db which is untyped string data
    // we need to use the "any" type until we generate classes and subclasses
    // that handle SupportData.db, rather than just injecting raw js objects
    const data = devicesData as Array<any>;
    const result = data.map((deviceData) =>
    {
      const mapItem =  MockDeviceVersionMap[getSerialNumber(deviceData)];
      if(mapItem == null) return deviceData;
      deviceData.version_Wired = mapItem.version_Wired;
      deviceData.version_Wireless = mapItem.version_Wireless;
      return deviceData;
    });
    return result;
}

export function getSerialNumber(deviceData: { vid: string[], pid: string[] }) : string
{
  return deviceData.vid[0] + deviceData.pid[0];
}

export function getVersion(deviceData: { version_Wireless: string, version_Wired: string }) : string
{
  if(deviceData.version_Wireless != null && deviceData.version_Wireless != "99.99.99.99")
  {
    return deviceData.version_Wireless;
  }
  else if(deviceData.version_Wired != "99.99.99.99")
  {
    return deviceData.version_Wired;
  }
  throw new Error(`Device Data could not be parsed into version; Wired Version: ${deviceData.version_Wired}, Wireless Version: ${deviceData.version_Wireless}`);
}


export function getDeviceType(vid: string, pid: string): DeviceLookupEntry|null
{
  const map = test_vid_pid_lookupMap;
  for(let i = 0; i < map.length; i++)
  {
    const entry = map[i];
    if(entry.vid == vid && entry.pid == pid)
    {
      return entry;
    }
  }
  return null;
}



const test_vid_pid_lookupMap: DeviceLookupEntry[] = 
[
  { vid: "O", pid: "1", type: "mouse", name: "Model O Wireless" },
  { vid: "O", pid: "2", type: "mouse", name: "Model O2 Wired" },
  { vid: "D", pid: "1", type: "mouse", name: "Model D Wired" },
  { vid: "I", pid: "1", type: "mouse", name: "Model I Wired" },
  { vid: "I", pid: "2", type: "mouse", name: "Model I2 Wireless" },
  { vid: "GMMK", pid: "PRO", type: "keyboard", name: "GMMK PRO" },
  { vid: "GMMK", pid: "2", type: "keyboard", name: "GMMK 2" },
  { vid: "GMMK ISO", pid: "2", type: "keyboard", name: "GMMK 2 ISO" },
];
const vid_pid_lookupMap: DeviceLookupEntry[] = 
[
  { vid: "O", pid: "1", type: "mouse", name: "Model O Wired" },
];

export type DeviceLookupEntry = { vid: string, pid: string, type: string, name: string };