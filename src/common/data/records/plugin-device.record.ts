import { AppRecord } from "./app-record";
import { DeviceDataRecord } from "./device-data.record";
export class PluginDeviceRecord extends AppRecord
{
    vid: string[] = [];
    pid: string[] = [];
    devicename: string = "";
    ModelType: number = -1;
    SN: string = "";
    DeviceId: number = -1;
    StateID: number = -1;
    StateArray: string[] = [];
    version_Wired: string = "";
    version_Wireless: string = "";
    pairingFlag: number = 0;
    batterystatus: number = 0;
    batteryvalue: string|number = 100;
    deviceData?: DeviceDataRecord;
}
