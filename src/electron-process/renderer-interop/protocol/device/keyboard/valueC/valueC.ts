import { Keyboard } from '../keyboard';
import { DeviceData } from '../../../service/DeviceService';
import {
    KeyboardvalueCData,
    KeyboardvalueCKeyData,
    TriggerPoint,
} from '../../../../../../common/data/valueC-data';

import { HID } from '../../../nodeDriver/HID';
import { Buffer } from 'buffer';
import { EventTypes } from '../../../../../../common/EventVariable';

import { KeyCodeMapping, ModifierKeys, PhysicalKeyMapping } from './valueCKeyMaps';
import {
    ParseDeviceID,
    ParseDongleVersionResponse,
    ParseFWVersionResponse,
    ParseProfileIndexResponse,
    PrepareActuationPointAndRapidTriggerMagnetismReport,
    PrepareDynamicKeyStrokeMagnetismReport,
    PrepareGetDeviceID,
    PrepareGetFWVersion,
    PrepareGetProfileIndex,
    PrepareKeystrokeClear,
    PrepareLightingBuffers,
    PrepareMacroBuffer,
    PrepareModTapMagnetismReport,
    PrepareReset,
    PrepareSetCustomActuationMode,
    PrepareSetKeystroke,
    PrepareSetProfileIndex,
    PrepareSetReportRate,
    PrepareToggleMagnetismReport,
    PrepareVisualization,
    ProfileIndexToFWProfileNumber,
    UpdateKeystrokeClear,
    VisualizationToPercent,
} from './valueCBufferSetup';

import { ColorMode, LightingEffect, MapEffectValue } from './valueCLighting';
import { RGBAColor } from '../../../../../../common/data/structures/rgb-color.struct';
import { MacroRecord } from '../../../../../../common/data/records/macro.record';
import { GenerateMacroKeyCode, GetMacroRepeatType, PrepareMacroData } from './valueCMacro';

interface KeyData {
    valueCKeyData: KeyboardvalueCKeyData | null;
    defaultValue: string;
    value: string;
    recordBindCodeType: string;
    recordBindCodeName: string;
    changed: boolean;
    Shift: boolean;
    Alt: boolean;
    Ctrl: boolean;
    Windows: boolean;
    macro_Data: MacroRecord;
}

interface ProfileData {
    valueCData: KeyboardvalueCData | null;
    assignedKeyboardKeys: KeyData[][] | null;
    pollingrate: number;
    light_PRESETS_Data: any;
}

export interface ActuationPointData {
    actuationPointPress: number;
    actuationPointRelease: number;
    rapidTriggerEnabled: boolean;
    rapidTriggerPointPress: number;
    rapidTriggerPointRelease: number;
}

export interface DynamicKeystrokeData {
    firstPointValue: number | null;
    firstPointPressButton: string | null;
    firstPointReleaseButton: string | null;
    secondPointPressButton: string | null;
    secondPointReleaseButton: string | null;
}

enum PollingRates {
    Hz125 = 8,
    Hz250 = 4,
    Hz500 = 2,
    Hz1000 = 1,
}

const ProduceKeyCode = (
    key: number,
    modifierData: {
        Shift: boolean;
        Alt: boolean;
        Ctrl: boolean;
        Windows: boolean;
    },
) => {
    const result = new Uint8Array(4);
    if (modifierData.Shift) result[1] = ModifierKeys.ShiftLeft;
    if (modifierData.Alt) result[1] = ModifierKeys.AltLeft;
    if (modifierData.Ctrl) result[1] = ModifierKeys.CtrlLeft;
    if (modifierData.Windows) result[1] = ModifierKeys.MetaLeft;
    result[2] = key;
    return result;
};

function getProfileData(dev) {
    const currentProfileIndex = dev.deviceData.profileindex;
    const currentProfileLayerIndex = dev.deviceData.profileLayerIndex[currentProfileIndex];
    const currentProfile = dev.deviceData.profileLayers[currentProfileIndex][currentProfileLayerIndex];
    return { currentProfileIndex, currentProfile, currentProfileLayerIndex };
}

function getProfile(dev: { deviceData: { profileLayers: ProfileData[][] } }, profileIndex: number, layer: number) {
    return dev.deviceData.profileLayers[profileIndex][layer];
}

function getLayers(dev, profileIndex) {
    return dev.deviceData.profileLayers[profileIndex];
}

function getPhysicalDeviceSN(dev) {
    let deviceSN: string = dev.BaseInfo?.SN as string;
    if (!deviceSN) {
        console.warn('valueC.getDeviceSN: dev.BaseInfo.SN is undefined');
        return '';
    }
    const stateID = dev.BaseInfo.StateID ?? 0;
    if (stateID != 0) deviceSN = `${dev.BaseInfo.vid[stateID]}${dev.BaseInfo.pid[stateID]}`;
    return deviceSN;
}

export class valueC extends Keyboard {
    static #instance: valueC;
    static #usagePage = 0xffff;
    static #settingsUsage = 0x0002;
    static #reportID = 0x00;
    static #visualisationUsage = 0x0001;

    visualizationUpdateIntervalID: NodeJS.Timeout | null = null;
    visualizationState: number = 0;

    constructor(hid: HID) {
        super();
        this.hid = hid;
    }

    static getInstance(hid: any | null = null) {
        if (this.#instance) {
            return this.#instance;
        }
        if (!hid) {
            throw new Error(`valueC could not be initialized: hid == ${hid}`);
        }
        this.#instance = new valueC(hid);
        return this.#instance;
    }

    FindDevice(deviceSN: string, usagePage = valueC.#usagePage, usage = valueC.#settingsUsage) {
        if (deviceSN.length != 12) {
            console.error('valueC GetDeviceID: Invalid deviceSN!');
            return null;
        }
        const vid = parseInt(deviceSN.substring(0, 6), 16);
        const pid = parseInt(deviceSN.substring(6, 12), 16);
        return this.hid!.FindDevice(usagePage, usage, vid, pid);
    }

    SendReportToDevice(dev, report: Buffer, delayAfter: number = 450) {
        return new Promise((resolve) => {
            setTimeout(() => {
                report[0] = valueC.#reportID;

                const msg = Array.from(report)
                    .map((value) => value.toString(16).padStart(2, '0'))
                    .join(' ');

                const physicalSN = getPhysicalDeviceSN(dev);
                console.debug('valueC', `SendReportToDevice ${physicalSN} ${msg}`);
                const deviceID = this.FindDevice(physicalSN);
                if (deviceID) {
                    const bytesWritten = this.hid!.SetFeatureReport(
                        deviceID,
                        valueC.#reportID,
                        report.length,
                        report,
                    );
                    if (bytesWritten < 0) {
                        console.error('valueC', 'Failed to send report');
                    } else {
                        console.debug('valueC', `Report sent`);
                    }
                    resolve(bytesWritten);
                } else {
                    console.error(`valueC failed to get deviceID`);
                    resolve(0);
                }
            }, delayAfter);
        });
    }

    GetReportFromDevice(dev, delayAfter: number = 150) {
        return new Promise<Buffer>((resolve) => {
            setTimeout(() => {
                const physicalSN = getPhysicalDeviceSN(dev);
                const deviceID = this.FindDevice(physicalSN);
                if (deviceID) {
                    const report = this.hid!.GetFeatureReport(deviceID, valueC.#reportID, 65);
                    if (report.length > 0) {
                        console.debug('valueC', `GetReportFromDevice ${physicalSN} ${report}`);
                    } else {
                        console.error('valueC', `GetReportFromDevice failed: ${physicalSN} ${deviceID} ${report})`);
                    }
                    resolve(Buffer.from(report));
                } else {
                    console.error(`valueC failed to get deviceID`);
                    resolve(Buffer.alloc(1, 0));
                }
            }, delayAfter);
        });
    }

    // @ts-ignore
    async InitialDevice(dev: DeviceData, Obj, callback) {
        console.log('valueC', 'InitialDevice', dev.BaseInfo.SN);

        await this.getFWVersion(dev);
        callback(0);
    }

    SetFeatureReport(dev, buf, iSleep): Promise<unknown> {
        console.log('valueC', `SetFeatureReport ${dev.BaseInfo.SN}`);
        return new Promise((resolve) => {
            try {
                const result = this.SendReportToDevice(dev, buf);
                setTimeout(() => {
                    console.log('valueC', `SetFeatureReport ${result != buf.length ? 'Error' : 'Success'}`);
                    resolve(result);
                }, iSleep);
            } catch (error) {
                console.log('valueC', `SetFeatureReport Error: ${error}`);
                resolve(error);
            }
        });
    }

    async initDevice(dev) {
        console.warn('valueC', 'initDevice');
        const readDeviceID = this.FindDevice(dev.BaseInfo.SN, valueC.#usagePage, valueC.#visualisationUsage);
        await super.initDevice(dev);

        const res = this.hid!.SetDeviceCallbackFunc((buffer: Uint8Array, deviceData: { vid: number; pid: number }) => {
            if (buffer[0] == 0x05 && buffer[1] == 0x01) {
                // Profile changed event
                const profileIndex = buffer[2];
                const layerIndex = buffer[3];
                const deviceSN = `0x${deviceData.vid.toString(16).toUpperCase()}0x${deviceData.pid.toString(16).toUpperCase()}`;

                const ProfileSwitchEvent = {
                    Func: EventTypes.SwitchUIProfile,
                    SN: deviceSN,
                    Param: {
                        SN: deviceSN,
                        Profile: profileIndex,
                        Layer: layerIndex,
                        ModelType: dev.BaseInfo.ModelType, // 2 - Keyboard
                    },
                };
                console.log(`Device [${readDeviceID} ] profile changed: ${profileIndex}-${layerIndex}`);
                this.emit(EventTypes.ProtocolMessage, ProfileSwitchEvent);
            }
        });

        console.log(`valueC init device: ${res}`);
    }

    SaveProfileToDevice(dev, callback) {
        console.warn('valueC', 'SaveProfileToDevice');
        super.SaveProfileToDevice(dev, callback);
        callback('valueC Done');
    }

    // @ts-ignore
    async ChangeProfileID(
        dev,
        profileAndLayerIndex: number,
        callback: {
            (arg0?: string): void;
        },
    ) {
        console.log('valueC', 'ChangeProfileID');
        const profileIndex = 0x0F & profileAndLayerIndex;
        const layer = (0xF0 & profileAndLayerIndex) >> 4;
        await this.setSelectedProfileIndex(dev, profileIndex, layer);
        const result = await this.getSelectedProfileIndex(dev);
        if (result == profileIndex) {
            dev.deviceData.profileindex = profileIndex;
            dev.profile = dev.deviceData.profileLayers[profileIndex];
            this.setProfileToDevice(dev, () => {
                console.log('valueC', 'ChangeProfile done');
                callback('valueC Done');
            });
        } else {
            console.log('valueC', 'Failed to ChangeProfile. Switch mismatch?');
            callback(undefined);
        }
    }

    // @ts-ignore
    ChangeProfile(dev, obj) {
        console.warn('valueC', 'ChangeProfile');
        // super.ChangeProfile(dev, obj);
    }

    // @ts-ignore
    ChangeLayer(dev, obj) {
        console.warn('valueC', 'ChangeLayer');
        console.log(obj);
        // super.ChangeLayer(dev, obj);
    }

    // @ts-ignore
    ImportProfile(dev, obj, callback) {
        console.warn('valueC', 'ImportProfile');
        callback('valueC Done');
        // super.ImportProfile(dev, obj, callback);
    }

    ReadFWVersion(dev, _obj, callback) {
        this.getFWVersion(dev).then(callback(0));
    }

    // @ts-ignore
    StartBatteryTimeout(dev, Obj, callback) {
        callback(0);
    }

    // @ts-ignore
    SetKeyMatrix(
        dev: any,
        obj: {
            switchUIflag: { keybindingflag: boolean; lightingflag: boolean; performanceflag: boolean };
        },
        callback: (arg0: { success: boolean; data: string }) => void,
    ) {
        if (obj.switchUIflag.keybindingflag || obj.switchUIflag.performanceflag) {
            this.setKeyboardDataFromProfile(dev).then((result) => {
                callback(result);
            });
        }
        if (obj.switchUIflag.lightingflag) {
            this.setLightingDataFromProfile(dev).then((result) => {
                callback(result);
            });
        }
    }

    ResetDevice(dev: any, Obj: any, callback: (arg0: { success: boolean; data: string }) => void) {
        console.debug('valueC', 'ResetDevice', Obj);
        this.resetDevice(dev).then((_result) => callback({ success: true, data: 'valueC Done' }));
    }

    async SetVisualization(
        dev: any,
        Obj: { SN: string; value: boolean },
        callback: (arg0: { success: boolean; data: string }) => void,
    ) {
        console.debug('valueC', 'SetVisualization', Obj);
        // this.setVisualization(dev, Obj.value).then(() => callback({ success: true, data: 'valueC Done' }));
        await this.setVisualization(dev, Obj.value);
        callback({ success: true, data: 'valueC Done' });
    }

    async GetProfileID(dev: any, _obj, callback) {
        const id = await this.getSelectedProfileIndex(dev);
        callback({ profileID: id });
    }

    async getDeviceID(deviceSN: string) {
        const buffer = Buffer.alloc(65, 0);
        const dev = { BaseInfo: { SN: deviceSN } };
        PrepareGetDeviceID(buffer.subarray(1));
        const bytesSent = await this.SendReportToDevice(dev, buffer);
        console.log(bytesSent);
        const response = (await this.GetReportFromDevice(dev)) as Buffer;
        const deviceInfo = ParseDeviceID(response);
        return deviceInfo.deviceID;
    }

    private async setLightingDataFromProfile(dev: any) {
        const { currentProfileIndex, currentProfile } = getProfileData(dev);

        await this.setGlobalLighting(dev, currentProfileIndex, currentProfile);
        this.setProfileToDevice(dev, () => {
            console.debug('valueC', 'setLightingDataFromProfile', 'done');
        });
        return { success: true, data: 'valueC setLightingDataFromProfile Done' };
    }

    private async setKeyboardDataFromProfile(dev: any) {
        console.debug('valueC', 'setKeyboardDataFromProfile');

        const { currentProfileIndex, currentProfile } = getProfileData(dev);

        if (!currentProfile || currentProfileIndex < 0) {
            console.warn('valueC', 'setKeyboardDataFromProfile', 'no profile found');
            return { success: false, data: 'Error: No profile found' };
        }

        // Global
        await this.setPollingRate(dev, currentProfileIndex, currentProfile);
        if (currentProfile.valueCData) {
            // TODO: add preset actuation modes
            // TODO: verify actuation mode before setting

            await this.setGlobalActuationAndRapidTrigger(dev, currentProfile, currentProfileIndex);
            await this.setCustomActuationMode(dev);
        }

        // Per layer
        const layers = getLayers(dev, currentProfileIndex);
        for (let layerNo = 0; layerNo < layers.length; ++layerNo) {
            await this.processDefaultBindings(dev, currentProfileIndex, layerNo);
            await this.clearRemovedvalueCBindings(dev, currentProfileIndex, layerNo);

            const profileLayer = layers[layerNo];
            if (!profileLayer.valueCData) {
                console.warn(
                    'valueC',
                    'setKeyboardDataFromProfile',
                    `no valueC data found in profile ${currentProfileIndex}-${layerNo}`,
                );
            } else {
                if (!profileLayer.valueCData.VisualisationEnabled) {
                    await this.setPerKeyActuationAndRapidTrigger(dev, currentProfileIndex, layerNo);

                    await this.setDynamicKeystroke(dev, currentProfileIndex, layerNo);
                    await this.setModTap(dev, currentProfileIndex, layerNo);
                    await this.setToggle(dev, currentProfileIndex, layerNo);
                }
            }
            await this.processBindingsWithMacros(dev, currentProfileIndex, layerNo);
        }

        this.setProfileToDevice(dev, () => {
            console.debug('valueC', 'setProfileToDevice', 'done');
        });
        console.debug('valueC', 'setKeyboardDataFromProfile', 'done');
        return { success: true, data: 'valueC setKeyboardDataFromProfile Done' };
    }

    private async setCustomActuationMode(dev) {
        const buffer = Buffer.alloc(65, 0);
        PrepareSetCustomActuationMode(buffer.subarray(1));
        await this.SendReportToDevice(dev, buffer);
    }

    private async setGlobalActuationAndRapidTrigger(dev, profile: ProfileData, profileIndex: number) {
        const valueCData = profile.valueCData;
        const actuationData: ActuationPointData = {
            actuationPointPress: valueCData!.ActuationPressValue,
            actuationPointRelease: valueCData!.ActuationReleaseValue,
            rapidTriggerEnabled: valueCData!.RapidTriggerEnabled,
            rapidTriggerPointPress: valueCData!.RapidTriggerPressValue,
            rapidTriggerPointRelease: valueCData!.RapidTriggerReleaseValue,
        };

        const buffer = Buffer.alloc(65, 0);
        PrepareActuationPointAndRapidTriggerMagnetismReport(
            buffer.subarray(1),
            actuationData,
            profileIndex,
            0,
            false,
            0,
        );
        await this.SendReportToDevice(dev, buffer);
    }

    private async setPerKeyActuationAndRapidTrigger(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }
        const keysActuationOrRapidTrigger = profile.assignedKeyboardKeys[0].filter(
            (key) =>
                key.valueCKeyData != null &&
                (key.valueCKeyData.actuationData != null || key.valueCKeyData.rapidTriggerData != null),
        );

        console.debug(
            'valueC',
            'setPerKeyActuationAndRapidTrigger',
            `keysActuationOrRapidTrigger: ${keysActuationOrRapidTrigger.length}`,
        );

        const deviceSN = dev.BaseInfo.SN;
        // TODO: add reset for actuation and rapid trigger
        const buffer = Buffer.alloc(65, 0);
        for (const key of keysActuationOrRapidTrigger) {
            const valueCKeyData = key.valueCKeyData;

            const perKeyActuationData: ActuationPointData = {
                actuationPointPress: valueCKeyData!.actuationData?.ActuationPressValue ?? 50,
                actuationPointRelease: valueCKeyData!.actuationData?.ActuationReleaseValue ?? 50,
                rapidTriggerEnabled: valueCKeyData!.rapidTriggerData !== null,
                rapidTriggerPointPress: valueCKeyData!.rapidTriggerData?.RapidTriggerPressValue ?? 0,
                rapidTriggerPointRelease: valueCKeyData!.rapidTriggerData?.RapidTriggerReleaseValue ?? 0,
            };

            const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
            PrepareActuationPointAndRapidTriggerMagnetismReport(
                buffer.subarray(1),
                perKeyActuationData,
                profileIndex,
                layer,
                true,
                keyNumberPhysical,
            );
            await this.SendReportToDevice(dev, buffer);
            key.changed = true;
        }
    }

    private async setDynamicKeystroke(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }

        const keysWithDynamicKeystroke = profile.assignedKeyboardKeys[0].filter(
            (keyData: KeyData) =>
                keyData.valueCKeyData != null && keyData.valueCKeyData.DynamicKeystrokeData != null,
        );

        console.debug(
            'valueC',
            'setDynamicKeystroke',
            `keysWithDynamicKeystroke: ${keysWithDynamicKeystroke.length}.`,
        );

        const deviceSN = dev.BaseInfo.SN;
        const buffer = Buffer.alloc(65, 0);
        for (const key of keysWithDynamicKeystroke) {
            if (
                key.valueCKeyData?.DynamicKeystrokeData == null ||
                key.valueCKeyData!.DynamicKeystrokeData!.length == 0
            ) {
                continue;
            }

            const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
            for (const triggerPoint in TriggerPoint) {
                if (isNaN(Number(triggerPoint))) continue;
                const assignedKey = key.valueCKeyData.DynamicKeystrokeData.find(
                    (x) => x.triggerPoint == Number(triggerPoint),
                )?.assignedKey;

                const keycode = new DeviceKeyCode(assignedKey ? KeyCodeMapping[assignedKey] : 0);
                const keystrokeFWProfileNo = ProfileIndexToFWProfileNumber(profileIndex);
                const dksLayerIndex = Number(triggerPoint);
                PrepareSetKeystroke(
                    buffer.subarray(1),
                    keyNumberPhysical,
                    keystrokeFWProfileNo,
                    keycode.valueOf(),
                    layer,
                    dksLayerIndex,
                );
                await this.SendReportToDevice(dev, buffer);
            }

            const dynamicKeystrokeData: DynamicKeystrokeData = {
                firstPointValue:
                    key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOnePress)
                        ?.triggerPointValue ?? null,
                firstPointPressButton:
                    key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOnePress)
                        ?.assignedKey ?? null,
                firstPointReleaseButton:
                    key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOneRelease)
                        ?.assignedKey ?? null,
                secondPointPressButton:
                    key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageTwoPress)
                        ?.assignedKey ?? null,
                secondPointReleaseButton:
                    key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageTwoRelease)
                        ?.assignedKey ?? null,
            };
            PrepareDynamicKeyStrokeMagnetismReport(
                buffer.subarray(1),
                profileIndex,
                dynamicKeystrokeData,
                keyNumberPhysical,
            );
            await this.SendReportToDevice(dev, buffer);
            key.changed = true;
        }
    }

    private async SetComplexKeystroke(
        dev,
        profileIndex: number,
        layer: number,
        keyNumberPhysical: number,
        keyCode0: DeviceKeyCode,
        keyCode1: DeviceKeyCode = new DeviceKeyCode(),
        keyCode2: DeviceKeyCode = new DeviceKeyCode(),
        keyCode3: DeviceKeyCode = new DeviceKeyCode(),
    ) {
        const FWProfileOffset = ProfileIndexToFWProfileNumber(profileIndex);
        const buffer = Buffer.alloc(65, 0);
        PrepareSetKeystroke(buffer.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode0.valueOf(), layer, 0);
        await this.SendReportToDevice(dev, buffer, 600);
        PrepareSetKeystroke(buffer.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode1.valueOf(), layer, 1);
        await this.SendReportToDevice(dev, buffer, 600);
        PrepareSetKeystroke(buffer.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode2.valueOf(), layer, 2);
        await this.SendReportToDevice(dev, buffer, 600);
        PrepareSetKeystroke(buffer.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode3.valueOf(), layer, 3);
        await this.SendReportToDevice(dev, buffer);
    }

    private async setModTap(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }
        const keysWithModTapData = profile.assignedKeyboardKeys[0].filter(
            (key) => key.valueCKeyData != null && key.valueCKeyData.ModTapData != null,
        );

        console.debug('valueC', 'setModTap', ``);

        const deviceSN = dev.BaseInfo.SN;

        const buffer = Buffer.alloc(65, 0);
        for (const key of keysWithModTapData) {
            const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];

            const holdKeyCode =
                KeyCodeMapping[key.valueCKeyData!.ModTapData!.holdAction] ?? KeyCodeMapping[key.defaultValue];
            const tapKeyCode = KeyCodeMapping[key.valueCKeyData!.ModTapData!.tapAction] ?? 0;

            // NOTE: setting this the same way as example app
            // TODO: verify if all of these are required
            await this.SetComplexKeystroke(
                dev,
                profileIndex,
                layer,
                keyNumberPhysical,
                new DeviceKeyCode(holdKeyCode),
                new DeviceKeyCode(tapKeyCode),
            );

            PrepareModTapMagnetismReport(
                buffer.subarray(1),
                profileIndex,
                keyNumberPhysical,
                key.valueCKeyData!.ModTapData!.holdTimeout,
            );
            await this.SendReportToDevice(dev, buffer);
            key.changed = true;
        }
    }

    private async sendVisualizationUpdate(deviceSN: string, value: number) {
        if (this.visualizationState != value) {
            this.visualizationState = value;
            this.emit(EventTypes.ProtocolMessage, {
                Func: EventTypes.valueCVisualizationUpdate,
                SN: deviceSN,
                Param: { SN: deviceSN, value: this.visualizationState },
            });
        }
    }

    private async setToggle(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }
        const keysWithToggleData = profile.assignedKeyboardKeys[0].filter(
            (key) => key.valueCKeyData != null && key.valueCKeyData.ToggleData != null,
        );

        console.debug('valueC', 'setToggle', ``);

        const deviceSN = dev.BaseInfo.SN;

        const buffer = Buffer.alloc(65, 0);
        for (const key of keysWithToggleData) {
            const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];

            const toggleKeyCode = KeyCodeMapping[key.valueCKeyData!.ToggleData!.toggleAction];
            const baseKeyCode = KeyCodeMapping[key.defaultValue];
            await this.SetComplexKeystroke(
                dev,
                profileIndex,
                layer,
                keyNumberPhysical,
                new DeviceKeyCode(toggleKeyCode),
                new DeviceKeyCode(baseKeyCode),
            );

            const toggleType = key.valueCKeyData!.ToggleData!.toggleType;
            PrepareToggleMagnetismReport(buffer.subarray(1), profileIndex, keyNumberPhysical, toggleType);
            await this.SendReportToDevice(dev, buffer);
            key.changed = true;
        }
    }

    private async setVisualization(dev, enable: boolean) {
        const buffer = Buffer.alloc(65, 0);
        PrepareVisualization(buffer.subarray(1), enable);
        if (enable) {
            await this.SendReportToDevice(dev, buffer);
            const physicalSN = getPhysicalDeviceSN(dev);
            const deviceID = this.FindDevice(physicalSN, valueC.#usagePage, valueC.#visualisationUsage);
            if (deviceID) {
                this.hid!.SetupHIDReadThread(true, deviceID, 4, (result: Buffer) => {
                    if (Buffer.isBuffer(result) && result.length > 0) {
                        const parsedResult = VisualizationToPercent(result.at(2));
                        console.debug('valueC', `Received visualization data: ${result.at(2)} == ${parsedResult}%`);
                        this.sendVisualizationUpdate(dev.BaseInfo.SN, parsedResult);
                    }
                });
            } else {
                console.error('valueC setVisualization: failed to get deviceID');
            }
        } else {
            this.hid!.SetupHIDReadThread(false);
            await this.SendReportToDevice(dev, buffer);
        }
    }

    private async resetDevice(dev) {
        await this.setVisualization(dev, false);
        const buffer = Buffer.alloc(65, 0);
        PrepareReset(buffer.subarray(1));
        await this.SendReportToDevice(dev, buffer);
    }

    private async clearRemovedvalueCBindings(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }
        const keysWithBindingsToClear = profile.assignedKeyboardKeys[0].filter(
            (keyData: KeyData) => keyData.valueCKeyData === null && keyData.changed,
        );

        const deviceSN = dev.BaseInfo.SN;

        const buffer = Buffer.alloc(65, 0);
        PrepareKeystrokeClear(buffer.subarray(1), 0);

        for (const key of keysWithBindingsToClear) {
            const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
            const defaultMapping = KeyCodeMapping[key.defaultValue];
            // TODO: maybe add separate clearing paths for different types of bindings that were there
            await this.SetComplexKeystroke(
                dev,
                profileIndex,
                layer,
                keyNumberPhysical,
                new DeviceKeyCode(defaultMapping),
            );
            UpdateKeystrokeClear(buffer.subarray(1), keyNumberPhysical);
            await this.SendReportToDevice(dev, buffer);
            key.changed = false;
        }
    }

    private async processDefaultBindings(dev, profileIndex: number, layer: number) {
        console.log('valueC', 'processDefaultBindings');
        const profile = getProfile(dev, profileIndex, layer);
        if (!profile || !profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
            return;
        }
        const keysWithBindings = profile.assignedKeyboardKeys[0].filter(
            (keyData: KeyData) => keyData.recordBindCodeType == 'SingleKey',
        );

        const deviceSN = dev.BaseInfo.SN;

        for (const key of keysWithBindings) {
            const mappedKeyName = key.recordBindCodeName.replace('Key', '').replace('Digit', '');

            const originalKey = PhysicalKeyMapping(deviceSN)[key.defaultValue];
            const mappedKey = KeyCodeMapping[mappedKeyName];

            if (mappedKey != null && originalKey != null) {
                const buffer = Buffer.alloc(65, 0);
                PrepareSetKeystroke(
                    buffer.subarray(1),
                    originalKey,
                    ProfileIndexToFWProfileNumber(profileIndex),
                    ProduceKeyCode(mappedKey, key),
                    layer,
                    0,
                );
                await this.SendReportToDevice(dev, buffer);
                key.value = key.recordBindCodeName;
                key.changed = true;
            }
        }
    }

    private async setPollingRate(dev, currentProfileIndex: number, profile: ProfileData) {
        const pollingRate = Number(profile.pollingrate);

        if (pollingRate && !isNaN(pollingRate)) {
            let firmwareRate = PollingRates.Hz1000;
            switch (pollingRate) {
                case 125:
                    firmwareRate = PollingRates.Hz125;
                    break;
                case 250:
                    firmwareRate = PollingRates.Hz250;
                    break;
                case 500:
                    firmwareRate = PollingRates.Hz500;
                    break;
                case 1000:
                default:
                    firmwareRate = PollingRates.Hz1000;
                    break;
            }
            const buffer = Buffer.alloc(65, 0);
            PrepareSetReportRate(buffer.subarray(1), currentProfileIndex, firmwareRate);
            await this.SendReportToDevice(dev, buffer);
        }
    }

    // @ts-ignore

    private async setGlobalLighting(dev, _currentProfileIndex: number, profile: ProfileData) {
        console.log('valueC', 'setLighting');

        const effect = MapEffectValue(profile.light_PRESETS_Data.value);
        const color = RGBAColor.fromHex(profile.light_PRESETS_Data.colors[0]);
        const speed = profile.light_PRESETS_Data.speed;
        const brightness = profile.light_PRESETS_Data.brightness * (color.alpha / 100);

        const lightingEffect = new LightingEffect(effect, speed, brightness, ColorMode.APColor, 0, color);

        const { LEDBuffer, SideLEDBuffer } = PrepareLightingBuffers(lightingEffect);
        const buffer = Buffer.alloc(65, 0);
        buffer.set(LEDBuffer, 1);
        await this.SendReportToDevice(dev, buffer, 600);
        buffer.set(SideLEDBuffer, 1);
        await this.SendReportToDevice(dev, buffer, 600);
    }

    // TODO: finish per-key lighting
    private async setPerKeyLighting(dev, _currentProfileIndex: number, profile: ProfileData) {
        console.log('valueC', `setPerKeyLighting`);
    }

    private async getSelectedProfileIndex(dev) {
        const buffer = Buffer.alloc(65, 0);
        PrepareGetProfileIndex(buffer.subarray(1));
        await this.SendReportToDevice(dev, buffer);
        const response = (await this.GetReportFromDevice(dev)) as Buffer;
        return ParseProfileIndexResponse(response);
    }

    private async setSelectedProfileIndex(dev, profileIndex: number, layer: number) {
        const buffer = Buffer.alloc(65, 0);
        PrepareSetProfileIndex(buffer.subarray(1), profileIndex, layer);
        await this.SendReportToDevice(dev, buffer);
    }

    private async getFWVersion(dev: DeviceData) {
        console.log('valueC', `getFWVersion`);

        const requests = PrepareGetFWVersion();
        const result: { USB?: Buffer; RF?: Buffer; LED?: Buffer } = {};

        await this.SendReportToDevice(dev, requests.USB);
        result.USB = await this.GetReportFromDevice(dev);

        await this.SendReportToDevice(dev, requests.RF);
        result.RF = await this.GetReportFromDevice(dev);

        await this.SendReportToDevice(dev, requests.LED);
        result.LED = await this.GetReportFromDevice(dev);

        let version =
            ParseFWVersionResponse(result.USB) + ParseFWVersionResponse(result.RF) + ParseFWVersionResponse(result.LED);

        const dongleIndex = dev.BaseInfo.StateType.indexOf('Dongle');
        if (dongleIndex != -1) {
            const dongle = { BaseInfo: { ...dev.BaseInfo } };
            dongle.BaseInfo.StateID = dongleIndex;
            await this.SendReportToDevice(dongle, requests.USB);
            const dongleResponse = await this.GetReportFromDevice(dongle);
            const dongleVersion = ParseDongleVersionResponse(dongleResponse);
            if (dongleVersion) version += ` ${dongleVersion}`;
        }
        console.log('valueC', `getFWVersion done: ${version}`);
        dev.BaseInfo.version_Wired = version;
        dev.BaseInfo.version_Wireless = version;
    }

    private async processBindingsWithMacros(dev, profileIndex: number, layer: number) {
        const profile = getProfile(dev, profileIndex, layer);
        const keysWithMacrosAssigned: KeyData[] = profile.assignedKeyboardKeys![0].filter(
            (keyData: KeyData) => keyData.recordBindCodeType == 'MacroFunction',
        );

        const allMacros = new Set(keysWithMacrosAssigned.map((key) => key.macro_Data.value));
        for (const macroID of allMacros) {
            await this.saveMacroToDevice(dev, macroID);
        }

        for (const keyWithMacro of keysWithMacrosAssigned) {
            await this.setMacroKeybind(
                dev,
                profileIndex,
                layer,
                keyWithMacro.defaultValue,
                keyWithMacro.macro_Data.value,
            );
        }
    }

    private async getMacroByID(macroID: number) {
        const macro = (await this.nedbObj.getMacroById(macroID)) as MacroRecord[];
        if (!macro || macro.length == 0)
            throw new Error(`valueC::saveMacroToDevice: Failed to get macro by id: ${macroID}`);
        if (macro.length != 1) console.warn(`Macros array size = ${macro.length}, expected exactly 1!`);
        return macro[0];
    }

    private async setMacroKeybind(dev, profileIndex: number, layer: number, key: string, macroID: number) {
        const deviceSN = dev.BaseInfo.SN;

        const buffer = Buffer.alloc(65, 0);
        const keyNumber = PhysicalKeyMapping(deviceSN)[key];
        const macro = await this.getMacroByID(macroID);
        const macroRepeatType = GetMacroRepeatType(macro.m_Identifier);
        const macroKeyCode = GenerateMacroKeyCode(macroID, macroRepeatType);
        PrepareSetKeystroke(buffer.subarray(1), keyNumber, profileIndex, macroKeyCode, layer, 0);
        await this.SendReportToDevice(dev, buffer);
    }

    private async saveMacroToDevice(dev, macroID: number) {
        const macro = await this.getMacroByID(macroID);
        const macroDataBuffers = PrepareMacroData(macro);
        let pageCounter = 0;
        for (const macroData of macroDataBuffers) {
            const buffer = Buffer.alloc(65, 0);
            PrepareMacroBuffer(buffer.subarray(1), macroID, pageCounter++, pageCounter == macroDataBuffers.length);
            buffer.set(macroData, 9);
            await this.SendReportToDevice(dev, buffer);
        }
    }
}

class DeviceKeyCode {
    private readonly data: Uint8Array;

    constructor(
        MappedKeyCode: number = 0,
        modifier1: number = 0,
        modifier2: number = 0,
        isMouseButton: boolean = false,
    ) {
        if (modifier1 && modifier2) {
            this.data = Uint8Array.from([0, modifier1, modifier2, MappedKeyCode]);
        } else if (modifier1) {
            this.data = Uint8Array.from([0, modifier1, MappedKeyCode, 0]);
        } else {
            this.data = Uint8Array.from([0, 0, MappedKeyCode, 0]);
        }
        if (isMouseButton) this.data[0] = 0x01;
    }

    valueOf(): Uint8Array {
        return this.data;
    }
}
