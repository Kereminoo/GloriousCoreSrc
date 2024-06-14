import { env } from '../../others/env';
import { HidLib } from './lib';
export class HID
{
    static #instance?: HID;

    hid = HidLib;

    constructor()
    {
        if(this.hid === undefined)
        {
            throw new Error('Hid not init');
        }
    }
    static getInstance()
    {
        if (this.#instance)
        {
            return this.#instance;
        }
        else
        {
            console.log("new HID Class");
            this.#instance = new HID();
            return this.#instance;
        }
    }

    FindDevice(usagepage,usage,vid,pid)
    {
        return this.hid.FindDevice(parseInt(usagepage),parseInt(usage),parseInt(vid),parseInt(pid));
    }
    DeviceDataCallback(usagepage,usage,vid,pid)
    {
        return this.hid.DeviceDataCallback(parseInt(usagepage),parseInt(usage),parseInt(vid),parseInt(pid));
    }
    SetDeviceCallbackFunc(EP3Func) {
        return this.hid.SetDeviceCallbackFunc(EP3Func);
    }

    SetFeatureReport(DeviceId,ReportID,Length,buf)
    {
        return this.hid.SetFeatureReport(DeviceId,ReportID,Length,buf);
    }
    GetFeatureReport(DeviceId,ReportID,Length)
    {
        return this.hid.GetFeatureReport(DeviceId,ReportID,Length);
    }
    GetFWVersion(DeviceId)
    {
        return this.hid.GetFWVersion(DeviceId);
    }
    SetHidWrite(DeviceId,ReportID,Length,buf)
    {
        return this.hid.SetHidWrite(DeviceId,ReportID,Length,buf);
    }
    GetEPTempData(DeviceId)
    {
        return this.hid.GetEPTempData(DeviceId);
    }
    ExecuteHIDRead(DeviceId: number, bufferLength: number, timeout: number)
    {
        return this.hid.ExecuteHIDRead(DeviceId, bufferLength, timeout);
    }
    SetupHIDReadThread(start: boolean, DeviceId: number = 0, bufferLength: number = 0, callback: (data: Buffer) => void = {} as any)
    {
        return this.hid.SetupHIDReadThread(start, DeviceId, bufferLength, callback);
    }
}
