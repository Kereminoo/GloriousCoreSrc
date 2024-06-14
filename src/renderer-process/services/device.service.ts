import { AppEvent } from '@renderer/support/app.events';
import { DataService } from './data.service';
import { FuncName, FuncType } from '../../common/FunctionVariable';
import { ProtocolService } from './protocol.service';

// mock devices
import { default as packageProperties } from '../../../package.json';
import { PluginDeviceRecord } from '../../common/data/records/plugin-device.record';
import { DeviceDataRecord, ProfileData } from '../../common/data/records/device-data.record';
import { UIDevice } from '@renderer/data/ui-device';
import { DisplayOption } from '@renderer/data/display-option';
import { DevicesAdapter } from '../adapters/devices.adapter';

const MockDeviceVersionMap: { [name: string]: { version_Wired: string; version_Wireless: string } } = {
    // Mice
    '0x320F0x8888': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x258A0x2011': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x258A0x2036': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x258A0x2013': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x258A0x2015': { version_Wired: '01.00', version_Wireless: '01.00' },
    '0x320F0x823A': { version_Wired: '1.0.4', version_Wireless: '1.0.4' },
    '0x258A0x2012': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x258A0x2014': { version_Wired: '0.3.8.1', version_Wireless: '0.3.8.1' },
    '0x22D40x1503': { version_Wired: '01.22', version_Wireless: '00.00' },
    '0x258A0x2017': { version_Wired: '1.0.0.0', version_Wireless: '1.0.0.0' },
    '0x258A0x2018': { version_Wired: '1.0.0.0', version_Wireless: '1.0.0.0' },
    '0x093A0x822A': { version_Wired: '1.0.0.5', version_Wireless: '1.0.0.5' },
    '0x093A0x821A': { version_Wired: '1.0.0.5', version_Wireless: '1.0.0.5' },
    '0x093A0x824A': { version_Wired: '1.0.0.0', version_Wireless: '1.0.0.0' },
    '0x320F0x825A': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' },
    '0x320F0x831A': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' },

    '0x258A0x2019': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, // Model O2 Pro 1k
    '0x258A0x201B': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, // Model O 2 Pro 8k
    '0x258A0x201A': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, // Model D 2 Pro 1k
    '0x258A0x201C': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, // Model D 2 Pro 8k
    '0x258A0x201D': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, //valueH Pro (8k wireless)
    '0x093A0x826A': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, //valueF Wireless
    '0x320F0x827A': { version_Wired: '1.0.0.0', version_Wireless: '99.99.99.99' }, //valueF

    // Keyboards
    '0x320F0x5044': { version_Wired: '0045', version_Wireless: '99.99.99.99' },
    '0x320F0x5046': { version_Wired: '0017', version_Wireless: '99.99.99.99' },
    '0x320F0x5045': { version_Wired: '0019', version_Wireless: '99.99.99.99' },
    '0x320F0x504A': { version_Wired: '0012', version_Wireless: '99.99.99.99' },
    '0x320F0x504B': { version_Wired: '0016', version_Wireless: '99.99.99.99' },
    '0x320F0x505A': { version_Wired: '0013', version_Wireless: '99.99.99.99' },
    '0x320F0x5088': { version_Wired: '0088', version_Wireless: '99.99.99.99' },
    '0x320F0x5092': { version_Wired: '0009', version_Wireless: '99.99.99.99' },
    '0x320F0x5093': { version_Wired: '0009', version_Wireless: '99.99.99.99' },

    '0x342D0xE3C5': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB
    '0x342D0xE3CE': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueBISO
    '0x342D0xE3CB': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueBWireless
    '0x342D0xE3D4': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueBWirelessISO
    '0x342D0xE3C7': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB65
    '0x342D0xE3D0': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB65ISO
    '0x342D0xE3CD': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB65Wireless
    '0x342D0xE3D6': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB65WirelessISO
    '0x342D0xE3C6': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB75
    '0x342D0xE3CF': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB75ISO
    '0x342D0xE3CC': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB75Wireless
    '0x342D0xE3D5': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueB75WirelessISO

    '0x342D0xE3C8': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD100
    '0x342D0xE3D1': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD100ISO
    '0x342D0xE3C9': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD75
    '0x342D0xE3D2': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD75ISO
    '0x342D0xE3CA': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD65
    '0x342D0xE3D3': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueD65ISO
    '0x342D0xE3DD': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 65% ANSI
    '0x342D0xE3F2': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 65% ISO
    '0x342D0xE3DE': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 75% ANSI
    '0x342D0xE3F3': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 75% ISO
    '0x342D0xE3DF': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 100% ANSI
    '0x342D0xE3F4': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueA valueD HE 100% ISO

    '0x342D0xE3D7': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 65% Wireless ANSI
    '0x342D0xE3D8': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 75% Wireless ANSI
    '0x342D0xE3D9': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 100% Wireless ANSI
    '0x342D0xE3EC': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 65% Wireless ISO
    '0x342D0xE3ED': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 75% Wireless ISO
    '0x342D0xE3EE': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 100% Wireless ISO

    '0x342D0xE3DA': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 65% ANSI
    '0x342D0xE3DB': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 75% ANSI
    '0x342D0xE3DC': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 100% ANSI
    '0x342D0xE3EF': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 65% ISO
    '0x342D0xE3F0': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 75% ISO
    '0x342D0xE3F1': { version_Wired: '0009', version_Wireless: '99.99.99.99' }, // valueC 100% ISO

    // Other devices
    '0x12CF0x0491': { version_Wired: '0001', version_Wireless: '99.99.99.99' },
};

export type DeviceCategory = 'Mouse' | 'Keyboard' | 'Numpad' | 'valueE' | 'Dongle Kit' | 'valueJ';

export class DeviceServiceClass {
    getDeviceClassification(device): DeviceCategory {
        let deviceClassification: DeviceCategory = 'Mouse';
        if (device.ModelType == 1) {
            if (`${device.SN}` == '0x093A0x829D') {
                deviceClassification = 'Dongle Kit';
            } else if (`${device.SN}` == '0x12CF0x0491') {
                deviceClassification = 'valueJ';
            } else {
                deviceClassification = 'Mouse';
            }
        } else if (device.ModelType == 2) {
            if (`${device.SN}` == '0x320F0x5088') {
                deviceClassification = 'Numpad';
            } else {
                deviceClassification = 'Keyboard';
            }
        } else if (device.ModelType == 3) {
            deviceClassification = 'valueE';
        }
        return deviceClassification;
    }

    getDeviceProfile(device?: UIDevice, profileIndex?: number | string | undefined): ProfileData {
        if (device?.deviceCategoryName == 'Mouse') {
            if (device.deviceData == null) {
                throw new Error('Error getting device profile');
            }
            const index = profileIndex ?? device.deviceData.profileindex;
            return device.deviceData.profile[isNaN(index as number) ? parseInt(index as string) : index];
        } else if (device?.deviceCategoryName == 'Keyboard' || device?.deviceCategoryName == 'Numpad') {
            if (device.keyboardData == null) {
                throw new Error('Error getting device profile');
            }

            const index = profileIndex ?? device.keyboardData.profileindex;
            const profileLayerIndex = device.keyboardData.profileLayerIndex[index];
            const currentProfile =
                device.keyboardData.profileLayers[device.keyboardData.profileindex][profileLayerIndex];
            return currentProfile;
        } else if (device?.deviceCategoryName == 'valueJ') {
            if (device.deviceData == null) {
                throw new Error('Error getting device profile');
            }
            const currentProfile = device.deviceData.profile[0];
            return currentProfile;
        }
        throw new Error('Error getting device profile');
    }
    getDeviceProfiles(device?: UIDevice): ProfileData[] {
        if (device?.deviceCategoryName == 'Mouse') {
            if (device.deviceData == null) {
                throw new Error('Error getting device profile');
            }
            return device.deviceData.profile;
        } else if (device?.deviceCategoryName == 'Keyboard' || device?.deviceCategoryName == 'Numpad') {
            if (device.keyboardData == null) {
                throw new Error('Error getting device profile');
            }
            const currentProfile = device.keyboardData.profileLayers[device.keyboardData.profileindex];
            return currentProfile;
        } else if (device?.deviceCategoryName == 'valueJ') {
            if (device.deviceData == null) {
                throw new Error('Error getting device profile');
            }
            return device.deviceData.profile;
        }
        throw new Error('Error getting device profile');
    }
    getDeviceLayerProfiles(device?: UIDevice, layerIndex: number): ProfileData {
        if (device?.deviceCategoryName == 'Keyboard' || device?.deviceCategoryName == 'Numpad') {
            if (device.keyboardData == null) {
                throw new Error('Error getting device profile');
            }
            const currentProfile = device.keyboardData.profileLayers[layerIndex];
            return currentProfile;
        } 
        throw new Error('Error getting device layer profiles');
    }

    setDeviceProfile(device, profileIndex: number) {
        return new Promise<any>((resolve, _) => {
            let obj = {
                Type: FuncType.Mouse,
                SN: device.SN,
                Func: FuncName.ChangeProfileID,
                Param: profileIndex,
            };
            ProtocolService.RunSetFunction(obj).then((data) => {
                resolve(data);
            });
        });
    }

    async getDevices() {
        const TempData = this.pluginDeviceData;
        const AllDeviceData: PluginDeviceRecord[] = [];

        const plugdata = await DataService.getPluginDevice();

        for (let i of plugdata[0].Mouse) {
            AllDeviceData.push(i);
        }
        for (let i of plugdata[0].Keyboard) {
            AllDeviceData.push(i);
        }
        for (let i of plugdata[0].valueE) {
            AllDeviceData.push(i);
        }
        for (let i of plugdata[0].MouseDock) {
            AllDeviceData.push(i);
        }

        const mockDevices = await this.getUIMockDevices();
        // console.log(mockDevices);
        AllDeviceData.push(...mockDevices);
        const data = await DataService.getAllDevice();
        // console.log(' this.dbservice.getAllDevice().then',data);

        const backgroundGradient_keyboard = 'linear-gradient(0.25turn, #673AB7, #512DA8)';
        const backgroundGradient_mouse = 'linear-gradient(0.25turn, #005C97, #363795)';
        const backgroundGradient_valueJ = 'linear-gradient(0.25turn, #4776E6, #8E54E9)';
        const backgroundGradient_valueE = 'linear-gradient(0.25turn, #5433FF, #20BDFF, #A5FECB)';
        const backgroundGradient_other = 'linear-gradient(0.25turn, #283048, #859398)';

        console.groupCollapsed('Device Data');
        for (let i = 0; i < AllDeviceData.length; i++) {
            const connectedDevice = AllDeviceData[i];
            const deviceDataIndex = data.findIndex((x) => x.SN == connectedDevice.SN);
            const tempDataIndex = TempData.findIndex((x) => x.SN == connectedDevice.SN);

            const backgroundGradient =
                connectedDevice.ModelType == 1
                    ? backgroundGradient_mouse
                    : connectedDevice.ModelType == 2
                      ? backgroundGradient_keyboard
                      : connectedDevice.ModelType == 3
                        ? backgroundGradient_valueE
                        : connectedDevice.ModelType == 4
                          ? backgroundGradient_valueJ
                          : backgroundGradient_other;

            // visual log for quickly finding devices in the devtools console;
            console.log(
                `%c ${connectedDevice.devicename}_Data`,
                `background: ${backgroundGradient}; background-size:100% 100%; color:white; font-size: 16px; padding: 5px 10px;`,
            );
            console.log(connectedDevice);

            if (deviceDataIndex != -1 && tempDataIndex == -1) {
                AllDeviceData[i].deviceData = data[deviceDataIndex];
            } else if (tempDataIndex != -1) {
                TempData[tempDataIndex].version_Wired = AllDeviceData[i].version_Wired;
                TempData[tempDataIndex].version_Wireless = AllDeviceData[i].version_Wireless;
                TempData[tempDataIndex].StateArray = AllDeviceData[i].StateArray;
                AllDeviceData[i] = TempData[tempDataIndex];
            }
        }
        console.groupEnd();

        this.pluginDeviceData = AllDeviceData;

        this.deviceDataForUI = [];
        for (let pluginDeviceData of this.pluginDeviceData)
        {
            if (pluginDeviceData.SN == '0x093A0x829D')
            {
                //dongle kit
                continue;
            }

            // TODO: maybe implement for older devices?
            if (DevicesAdapter.isvalueC(pluginDeviceData.SN)) {
                // @ts-ignore
                const result: any  = await ProtocolService.RunSetFunction({
                    SN: pluginDeviceData.SN,
                    Type: FuncType.Keyboard,
                    Func: FuncName.GetProfileID,
                    Param: { SN: pluginDeviceData.SN }
                });
                if (result?.profileID != null && pluginDeviceData.deviceData != null) {
                    pluginDeviceData.deviceData.profileindex = result.profileID;
                }
            }

            const uiDevice = new UIDevice(pluginDeviceData);
            // pluginDeviceData.profile = [];
            if (pluginDeviceData.deviceData == null)
            {
                continue;
            }

            for (let j = 0; j < pluginDeviceData.deviceData.profile.length; j++)
            {
                // let profileData =
                // {
                //     name: pluginDeviceData.deviceData.profile[j].profileName,
                //     value: pluginDeviceData.deviceData.profile[j].profileid,
                //     translate: pluginDeviceData.deviceData.profile[j].profileName
                // }

                uiDevice.profile.push(
                    new DisplayOption(
                        pluginDeviceData.deviceData.profile[j].profileName,
                        pluginDeviceData.deviceData.profile[j].profileName,
                        pluginDeviceData.deviceData.profile[j].profileid,
                    ),
                );
            }

            this.deviceDataForUI.push(uiDevice);
        }

        return this.deviceDataForUI;
    }
    async getUIMockDevices() {
        const supportedDevices = await DataService.getSupportDevice();
        const mockDevices: PluginDeviceRecord[] = [];
        for (const mockDevice of packageProperties.mockDevices) {
            const supportedDeviceIndex = supportedDevices.findIndex(
                (x: { pid: string[]; vid: string[] }) =>
                    x.pid.includes(mockDevice.pid) && x.vid.includes(mockDevice.vid),
            );

            if (supportedDeviceIndex != -1) {
                const deviceIndex = packageProperties.mockDevices.indexOf(mockDevice);

                const pluginDeviceData = new PluginDeviceRecord();
                pluginDeviceData.vid = [mockDevice.vid];
                pluginDeviceData.pid = [mockDevice.pid];
                pluginDeviceData.devicename = supportedDevices[supportedDeviceIndex].devicename;
                pluginDeviceData.ModelType = supportedDevices[supportedDeviceIndex].ModelType;
                pluginDeviceData.SN = mockDevice.vid + mockDevice.pid;
                pluginDeviceData.DeviceId = deviceIndex;
                pluginDeviceData.StateID = 0;
                pluginDeviceData.StateArray = ['Mock'];
                pluginDeviceData.version_Wired = MockDeviceVersionMap[mockDevice.vid + mockDevice.pid].version_Wired;
                pluginDeviceData.version_Wireless =
                    MockDeviceVersionMap[mockDevice.vid + mockDevice.pid].version_Wireless;
                pluginDeviceData.pairingFlag = supportedDevices[supportedDeviceIndex].pairingFlag;

                pluginDeviceData.deviceData = new DeviceDataRecord();
                pluginDeviceData.deviceData._id = deviceIndex.toString();
                pluginDeviceData.deviceData.vid = [mockDevice.vid];
                pluginDeviceData.deviceData.pid = [mockDevice.pid];
                pluginDeviceData.deviceData.SN = mockDevice.vid + mockDevice.pid;
                pluginDeviceData.deviceData.devicename = supportedDevices[supportedDeviceIndex].devicename;
                pluginDeviceData.deviceData.ModelType = supportedDevices[supportedDeviceIndex].ModelType;
                pluginDeviceData.deviceData.image = supportedDevices[supportedDeviceIndex].img;
                pluginDeviceData.deviceData.battery = supportedDevices[supportedDeviceIndex].battery;
                pluginDeviceData.deviceData.batteryLevelIndicator =
                    supportedDevices[supportedDeviceIndex].batteryLevelIndicator;
                pluginDeviceData.deviceData.profile = [...supportedDevices[supportedDeviceIndex].defaultProfile];
                pluginDeviceData.deviceData.profileindex = 1;
                pluginDeviceData.deviceData.value = 1;
                pluginDeviceData.deviceData.layerMaxNumber = supportedDevices[supportedDeviceIndex].layerMaxNumber;
                pluginDeviceData.deviceData.profileLayerIndex =
                    supportedDevices[supportedDeviceIndex].profileLayerIndex;
                pluginDeviceData.deviceData.sideLightSwitch = supportedDevices[supportedDeviceIndex].sideLightSwitch;
                pluginDeviceData.deviceData.profileLayers = supportedDevices[supportedDeviceIndex].profileLayers;

                mockDevices.push(pluginDeviceData);
            }
        }
        return mockDevices;
    }

    // vvvvv----- legacy code -----vvvvv

    // updatCurrentDeviceData: EventEmitter<object> = new EventEmitter();
    // content_Refresh: EventEmitter<object> = new EventEmitter();
    // setPageDevice = new EventEmitter<string>();
    // updateMacroData: EventEmitter<number> = new EventEmitter();

    pluginDeviceData = new Array<PluginDeviceRecord>();
    AllDeviceData = new Array<PluginDeviceRecord>();
    deviceDataForUI = new Array<UIDevice>();
    PairingFlag: boolean = false; //true:Pairing Page
    FWUpgradeFlag: boolean = false; //true:paring page:donwloading and updating FW

    currentDevice: any = undefined;

    /**
     * get all pluging device
     */
    // getDevices()
    // {
    //     return new Promise<void>(async (resolve,reject) => {
    //         let TempData = this.pluginDeviceData;//21
    //         let AllDeviceData = new Array<any>();

    //         // SupportDB
    //         await DataService.getSupportDevice().then((supportedDevices) => {
    //             for (let d of packageProperties.mockDevices) {
    //                 let temp = supportedDevices.findIndex((x:{pid:string[],vid:string[]})=>x.pid.includes(d.pid)&&x.vid.includes(d.vid));

    //                 if (temp!=-1)
    //                 {
    //                     AllDeviceData.push({
    //                         "SN": d.vid+d.pid,
    //                         "pid": [d.pid],
    //                         "vid": [d.vid],
    //                         "version_Wired": MockDeviceVersionMap[d.vid+d.pid].version_Wired,
    //                         "version_Wireless": MockDeviceVersionMap[d.vid+d.pid].version_Wireless,
    //                         "devicename": supportedDevices[temp].devicename,
    //                         "pairingFlag": supportedDevices[temp].pairingFlag,
    //                         "routerID": supportedDevices[temp].routerID,
    //                         "ModelType": supportedDevices[temp].ModelType,
    //                         "battery": supportedDevices[temp].battery,
    //                         "batteryLevelIndicator": supportedDevices[temp].batteryLevelIndicator,
    //                         "sideLightSwitch": supportedDevices[temp].sideLightSwitch,
    //                         "profileLayerIndex": supportedDevices[temp].profileLayerIndex,
    //                         "profileLayers": supportedDevices[temp].profileLayers,
    //                         "deviceData": {
    //                             "profile": [...supportedDevices[temp].defaultProfile],
    //                             "image": supportedDevices[temp].img,
    //                             "profileindex": "01"
    //                         },
    //                         "_id": supportedDevices[temp]._id,
    //                         "layerMaxNumber": supportedDevices[temp].layerMaxNumber,
    //                         "set": [...supportedDevices[temp].set],
    //                         "get": [...supportedDevices[temp].get],
    //                         "defaultProfile": [...supportedDevices[temp].defaultProfile],
    //                         "StateType": [...supportedDevices[temp].StateType],
    //                         "FWUpdateExtension": supportedDevices[temp].FWUpdateExtension
    //                     });
    //                     AllDeviceData.push(supportedDevices[temp]);
    //                 }
    //             }
    //         });

    //         // PluginDB
    //         DataService.getPluginDevice().then((plugdata) => {//30
    //             //var data=JSON.parse(JSON.stringify(temp_data));
    //             console.log('dbservice_getPluginDevice()',plugdata);
    //             for(let i of plugdata[0].Mouse){
    //                 AllDeviceData.push(i);
    //             }
    //             for(let i of plugdata[0].Keyboard){
    //                 AllDeviceData.push(i);
    //             }
    //             for(let i of plugdata[0].valueE){
    //                 AllDeviceData.push(i);
    //             }
    //             for(let i of plugdata[0].MouseDock){
    //                 AllDeviceData.push(i);
    //             }

    //             // DeviceDB
    //             DataService.getAllDevice().then((data: any) => {
    //                 // var data=JSON.parse(JSON.stringify(data));
    //                 console.log(' this.dbservice.getAllDevice().then',data);
    //                 for(let i = 0; i < AllDeviceData.length; i++) {
    //                     let index = data.findIndex((x:any) => x.SN == AllDeviceData[i].SN)
    //                     let TempDataIndex = TempData.findIndex(x => x.SN == AllDeviceData[i].SN)
    //                     console.log('%c'+AllDeviceData[i].devicename+'_Data', 'background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c); background-size: 100% 100%;color:yellow;font-size: 40px;width: 0px;height: 0px;line-height: 0px;padding: 100px;',AllDeviceData[i]);
    //                     if(index != -1 && TempDataIndex == -1){
    //                         AllDeviceData[i].deviceData = data[index];
    //                     }
    //                     else if(TempDataIndex != -1){
    //                         TempData[TempDataIndex].version_Wired=AllDeviceData[i].version_Wired;
    //                         TempData[TempDataIndex].version_Wireless=AllDeviceData[i].version_Wireless;
    //                         TempData[TempDataIndex].StateArray = AllDeviceData[i].StateArray;
    //                         // TempData[TempDataIndex].deviceData.profileindex = data[index].profileindex; // debug
    //                         AllDeviceData[i] = TempData[TempDataIndex];
    //                     }
    //                 }
    //                 this.pluginDeviceData = AllDeviceData;
    //                 console.log('pluginDeviceData',this.pluginDeviceData);

    //                 this.getDeviceForUI();
    //                 resolve();
    //             })
    //         })

    //     });
    // }
    checkHasDeviceExist() {
        return this.pluginDeviceData.length > 0 ? true : false;
    }
    /**
     * Re-Sort For UI
     */
    // getDeviceForUI() {
    //     this.deviceDataForUI = [];
    //     let obj =[];
    //     let count = 0;
    //     for(let i of this.pluginDeviceData) {
    //         if(i.SN == '0x093A0x829D') //dongle kit
    //             continue;
    //         console.log('dbservice_getDeviceForUI()', this.pluginDeviceData,i);
    //         count ++;
    //         i.profile = [];
    //         if(i.deviceData == null) { continue; }
    //         for(let j = 0; j < i.deviceData.profile.length; j++) {
    //             let profileData = {
    //                 name: i.deviceData.profile[j].profileName,
    //                 value: i.deviceData.profile[j].profileid,
    //                 translate: i.deviceData.profile[j].profileName
    //             }
    //             i.profile.push(profileData)
    //         }
    //         if(count % 4 == 0) {
    //             obj.push(i);
    //             this.deviceDataForUI.push(obj);
    //             obj = [];
    //         } else {
    //             obj.push(i);
    //         }
    //     }
    //     if( obj.length != 0)
    //         this.deviceDataForUI.push(obj);
    //     console.log('deviceDataForUI',this.deviceDataForUI)
    // }

    setAssignTargetValue(index: any, parameter: any, value: any) {
        this.pluginDeviceData[index][parameter] = value;
    }

    getAssignTarget(index: any): any {
        return this.pluginDeviceData[index];
    }

    /**
     * 取得
     * @param ModelType 1:Mouse 2:Keyboard 3:valueE 4:Mouse Dock
     */
    getDeviceFormModel(ModelType: any) {
        let result: any[] = [];
        for (let i of this.pluginDeviceData) {
            if (i.ModelType == ModelType) result.push(i);
        }
        console.log('getDeviceFormModel', result);
        return result;
    }

    getCurrentDeviceProfileIndex() {
        let index = this.currentDevice.deviceData.profile.findIndex(
            (x: any) => x.profileid == this.currentDevice.deviceData.profileindex,
        );
        if (index == -1) {
            console.log('getCurrentDeviceProfileIndex取得失敗', this.currentDevice.deviceData.profileindex);
        }

        return index;
    }

    /**
     * 判斷當前裝置存不存在
     */
    checkDeviceExist() {
        if (this.PairingFlag) return true;
        let result: any = false;
        if (this.currentDevice != undefined) {
            let index = this.pluginDeviceData.findIndex((x: any) => x.SN == this.currentDevice.SN);
            if (index != -1) result = true;
            else result = false;
        } else {
            result = undefined;
        }
        console.log('checkDeviceExist', result);
        return result;
    }

    /**
     * 設定當前裝置
     * @param obj
     */
    setCurrentPageDevice(SN: any) {
        if (SN == undefined) return;
        let result = false;
        let index = this.pluginDeviceData.findIndex((x: any) => x.SN == SN);
        if (index != -1) {
            this.currentDevice = this.pluginDeviceData[index];
            result = true;
        } else {
            this.currentDevice = undefined;
            result = false;
        }
        console.log('setCurrentPageDevice', this.currentDevice);
        // this.setPageDevice.emit(SN);
        return result;
    }

    /**
     * 取得當前裝置
     */
    getCurrentDevice() {
        return this.currentDevice;
    }

    /**
     * set Current Device
     * @param data
     */
    setCurrentDevice(data: any) {
        this.currentDevice = data;
        this.updateCurrentDevice(0);
    }

    /**
     * update Current Device
     * flag : 0:no emit 1:emit 2:emit and setHardware
     */
    updateCurrentDevice(flag: any) {
        let SN = this.currentDevice.SN;
        let index = this.pluginDeviceData.findIndex((x: any) => x.SN == SN);
        if (index != -1) {
            this.pluginDeviceData[index] = this.currentDevice;
            DataService.updateDevice(this.currentDevice.SN, this.currentDevice.deviceData);
            console.log('updateCurrentDevice', this.currentDevice);
            if (flag) {
                let obj = {
                    data: this.currentDevice,
                    flag: flag,
                };
                AppEvent.publish('devices-updated', obj);
                // this.updatCurrentDeviceData.emit(obj)
            }
        }
    }

    /**
     * Find specific key and specific value from Array
     * @param array
     * @param key
     * @param value
     */
    findNestedIndices(array: any, key: any, value: any) {
        let i;
        let j;
        for (i = 0; i < array.length; ++i) {
            const nestedArray = array[i];
            for (j = 0; j < nestedArray.length; ++j) {
                const object = nestedArray[j];
                if (object[key] === value) {
                    return { i, j };
                }
            }
        }
        return undefined;
    }

    /**
     * When macro data is deleted and macro is set to another key
     */
    updateMacroDeviceData(macroSelect: any) {
        console.log('updateMacroDeviceData', macroSelect);
        // this.updateMacroData.emit(macroSelect.value);
        let SN = '',
            updateFlag = false;
        for (let device of this.pluginDeviceData) {
            SN = device.SN;
            updateFlag = false;
            if (device.ModelType == 1) {
                //Mouse
                for (let profile of device.deviceData!.profile) {
                    if (profile.keybinding == null) {
                        throw new Error("device profile's keybinding property is null");
                    }
                    for (let i = 0; i < profile.keybinding.length; i++) {
                        if (profile.keybinding[i].group == 1 && profile.keybinding[i].function == macroSelect.value) {
                            updateFlag = true;
                            if (SN == '0x22D40x1503' || SN == '0x093A0x821A' || SN == '0x320F0x831A') {
                                switch (i) {
                                    case 0:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 1;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 1:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 3;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 2:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 2;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 3:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 4;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 4:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 5;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 5:
                                        profile.keybinding[i].group = 4;
                                        profile.keybinding[i].function = 1;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 6:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 6;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 7:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 7;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 8:
                                        profile.keybinding[i].group = 4;
                                        profile.keybinding[i].function = 5;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = 400;
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 9:
                                        profile.keybinding[i].group = 7;
                                        profile.keybinding[i].function = 'Home';
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 10:
                                        profile.keybinding[i].group = 4;
                                        profile.keybinding[i].function = 2;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                }
                            } else {
                                switch (i) {
                                    case 0:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 1;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 1:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 3;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 2:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 2;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 3:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 4;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 4:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 5;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 5:
                                        profile.keybinding[i].group = 4;
                                        profile.keybinding[i].function = 3;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 6:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 6;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                    case 7:
                                        profile.keybinding[i].group = 3;
                                        profile.keybinding[i].function = 7;
                                        profile.keybinding[i].name = '';
                                        profile.keybinding[i].param = '';
                                        profile.keybinding[i].param2 = '';
                                        break;
                                }
                            }
                        }
                    }
                }
                if (updateFlag && SN == this.currentDevice.SN) this.updateCurrentDevice(1);
            }
            if (device.ModelType == 2) {
                //Keynoard
                var profileLayers = device.deviceData!.profileLayers!;
                for (let profile_Arr of profileLayers) {
                    //console.log('%c profile_Arr','color:rgb(255,77,255)',  profile_Arr);

                    for (let profile_data of profile_Arr) {
                        //console.log('%c profile_data','color:rgb(255,77,255)',  profile_data);
                        for (let matrix_arr of profile_data.assignedKeyboardKeys!) {
                            console.log('%c matrix_arr', 'color:rgb(255,77,255)', matrix_arr);
                            for (let matrix of matrix_arr) {
                                console.log('%c matrix', 'color:rgb(255,77,255)', matrix);
                                if (matrix.recordBindCodeType == 'MacroFunction') {
                                    if (matrix.macro_Data.m_Identifier == macroSelect.m_Identifier) {
                                        matrix.recordBindCodeName = 'Default';
                                        matrix.recordBindCodeType = '';
                                        matrix.macro_Data = {};
                                        matrix.changed = false;
                                    }
                                }
                            }
                        }
                    }
                }
                if (updateFlag && SN == this.currentDevice.SN) this.updateCurrentDevice(1);
            }
        }
    }

    // async checkForFirmwareUpdates<T extends {SN: string, hasUpdates: boolean} = {SN: string, hasUpdates: boolean}>(...deviceSNs: string[]): Promise<T[]>
    // {
    //     if(deviceSNs.length == 0) { return []; }

    //     const results = new Array<T>;
    //     for(let i = 0; i < deviceSNs.length; i++)
    //     {
    //         results.push({SN: deviceSNs[i], hasUpdates: await this.checkForFirmwareUpdate(deviceSNs[i])} as T)
    //     }
    //     return results;
    // }
    // async checkForFirmwareUpdate(deviceSN: string): Promise<boolean>
    // {

    // }

    async executeFirmwareUpdates(...deviceSNs: Array<string>) {}
}

// export function getSerialNumber(deviceData: { vid: string[], pid: string[] }) : string
// {
//   return deviceData.vid[0] + deviceData.pid[0];
// }

export function getVersion(deviceData: UIDevice): string {
    if (
        deviceData.version_Wireless != null &&
        deviceData.version_Wireless != '99.99.99.99' &&
        deviceData.version_Wireless != '0001' &&
        deviceData.version_Wireless != '0000'
    ) {
        return deviceData.version_Wireless;
    } else if (deviceData.version_Wired != '99.99.99.99') {
        return deviceData.version_Wired;
    }
    throw new Error(
        `Device Data could not be parsed into version; Wired Version: ${deviceData.version_Wired}, Wireless Version: ${deviceData.version_Wireless}`,
    );
}

// export function getDeviceType(vid: string, pid: string): DeviceLookupEntry|null
// {
//   const map = test_vid_pid_lookupMap;
//   for(let i = 0; i < map.length; i++)
//   {
//     const entry = map[i];
//     if(entry.vid == vid && entry.pid == pid)
//     {
//       return entry;
//     }
//   }
//   return null;
// }
// const test_vid_pid_lookupMap: DeviceLookupEntry[] =
// [
//   { vid: "O", pid: "1", type: "mouse", name: "Model O Wireless" },
//   { vid: "O", pid: "2", type: "mouse", name: "Model O2 Wired" },
//   { vid: "D", pid: "1", type: "mouse", name: "Model D Wired" },
//   { vid: "I", pid: "1", type: "mouse", name: "Model I Wired" },
//   { vid: "I", pid: "2", type: "mouse", name: "Model I2 Wireless" },
//   { vid: "GMMK", pid: "PRO", type: "keyboard", name: "GMMK PRO" },
//   { vid: "GMMK", pid: "2", type: "keyboard", name: "GMMK 2" },
//   { vid: "GMMK ISO", pid: "2", type: "keyboard", name: "GMMK 2 ISO" },
// ];
// const vid_pid_lookupMap: DeviceLookupEntry[] =
// [
//   { vid: "O", pid: "1", type: "mouse", name: "Model O Wired" },
// ];

// export type DeviceLookupEntry = { vid: string, pid: string, type: string, name: string };

export const DeviceService = new DeviceServiceClass();
