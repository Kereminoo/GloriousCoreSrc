import { Buffer } from 'buffer';
import { ActuationPointData, DynamicKeystrokeData } from './valueC';
import { LightingEffect } from './valueCLighting';

export enum Command {
    GetFWVersionUSB = 0xf0,
    GetFWVersionRF = 0x80,
    GetFWVersionLED = 0xae,
    GetFWVersionDongle = 0xf0,

    GetDeviceID = 0x8f,
    GetLEDParam = 0x87,
    GetProfileIndex = 0x85,
    GetSideLEDParam = 0x88,
    SetKeyMatrixSimple = 0x13,
    SetLEDParam = 0x07,
    SetMagnetism = 0x1a,
    SetMagnetismMode = 0x1d,
    SetProfileIndex = 0x05,
    SetReportRate = 0x04,
    SetReportTravelDistance = 0x1b,
    SetReset = 0x02,
    SetSideLEDParam = 0x08,
    GetMacro = 0x8b,
    SetMacro = 0x16,
}

enum ProfileNumbers {
    Profile0 = 0,
    Profile1 = 1,
    Profile2 = 2,
}

const otherFlag = 0b00010100;

enum MagnetismMode {
    Comfort = 0x0,
    Sensitive = 0x1,
    Game = 0x2,
    Custom = 0x3,
}

enum MappingMode {
    Normal = 0x0,
    Controller = 0x1,
}

enum TriggerOption {
    NonRapidTrigger = 0x0,
    RapidTrigger = 0x80, // It looks like the doc has this value wrong?
    Dynamic = 0x2,
    ModTap = 0x3,
    Toggle = 0x4,
}

enum KeySettingMode {
    PerKey = 0x0,
    AllKeys = 0x1,
}

const CalculateChecksum = (buffer: Buffer) => {
    const sum = buffer.reduce((sum, val) => sum + val, 0);
    return 0xff - (sum & 0xff);
};

enum valueCFirmwareLimits {
    Actuation = 0x27,
    RapidTriggerMin = 0x02,
    RapidTriggerMax = 0x19,
    DynamicKeystroke = 0x19,
    VisualizationUpperBound = 42,
    ModTapHoldMaxTimeout = 64,
    MacroPageSize = 56,
}

const ActuationToTravel = (percent: number) => {
    const fwValue = Math.round((percent * valueCFirmwareLimits.Actuation) / 100);
    return fwValue > 0 ? fwValue : 1;
};

const ActuationToRapidTrigger = (percent: number) => {
    const fraction = (percent > 100 ? 100 : percent < 0 ? 0 : percent) / 100;
    const delta = valueCFirmwareLimits.RapidTriggerMax - valueCFirmwareLimits.RapidTriggerMin;
    return Math.round(fraction * delta) + valueCFirmwareLimits.RapidTriggerMin;
};

const ActuationToDynamicKeystroke = (percent: number) => {
    percent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
    return Math.round((percent * valueCFirmwareLimits.DynamicKeystroke) / 100) + 2;
};

export const VisualizationToPercent = (firmwareValue: number | undefined) => {
    if (firmwareValue == null) return 0;
    const min = 0x0;
    const max = valueCFirmwareLimits.VisualizationUpperBound;
    const percent = ((firmwareValue - min) / (max - min)) * 100;
    const clamped = percent > 100 ? 100 : percent < 0 ? 0 : percent;
    if (clamped < percent) {
        console.warn(
            `valueC: Visualization value received (${firmwareValue}) ` +
                `is higher then current limit (${valueCFirmwareLimits.VisualizationUpperBound})`,
        );
    }
    const rounded = Math.round(clamped);
    return rounded;
};

export const ProfileIndexToFWProfileNumber = (profileIndex: number) => {
    switch (profileIndex) {
        case 0:
            return ProfileNumbers.Profile0;
        case 1:
            return ProfileNumbers.Profile1;
        case 2:
            return ProfileNumbers.Profile2;
        default:
            throw new Error('Incorrect profile index!');
    }
};

export const PrepareSetKeystroke = (
    buffer: Buffer,
    keyNumberPhysical: number,
    firmwareProfileNo: number,
    keycode: Uint8Array,
    layer: number,
    layerIndex: number,
) => {
    buffer.fill(0);
    buffer[0] = Command.SetKeyMatrixSimple;
    buffer[1] = firmwareProfileNo;
    buffer[2] = keyNumberPhysical;
    buffer[3] = layer;
    buffer[4] = layerIndex;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
    if (keycode.length != 4) {
        console.error('keycode must be 4 bytes long');
        throw new Error('valueC: PrepareSetDynamicKeystroke: keycode must be 4 bytes long');
    }
    buffer.set(keycode, 8);
};

export const PrepareToggleMagnetismReport = (
    buffer: Buffer,
    profileIndex: number,
    keyNumberPhysical: number,
    toggleType: number,
) => {
    buffer.fill(0);
    buffer[0] = Command.SetMagnetism;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[2] = MappingMode.Normal;
    buffer[3] = TriggerOption.Toggle + toggleType; // 0x4 for hold, 0x5 for re-trigger
    buffer[6] = keyNumberPhysical;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareModTapMagnetismReport = (
    buffer: Buffer,
    profileIndex: number,
    keyNumberPhysical: number,
    holdTimeout: number,
) => {
    buffer.fill(0);
    buffer[0] = Command.SetMagnetism;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[2] = MappingMode.Normal;
    buffer[3] = TriggerOption.ModTap;
    buffer[6] = keyNumberPhysical;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));

    // Hold timeout is in ms, clamp to 10-1000
    const clampedHoldTimeout = holdTimeout > 1000 ? 1000 : holdTimeout < 10 ? 10 : holdTimeout;
    const timeoutAsFraction = clampedHoldTimeout / 1000.0;
    const firmwareHoldTimeout = Math.ceil(timeoutAsFraction * valueCFirmwareLimits.ModTapHoldMaxTimeout);
    buffer[16] = firmwareHoldTimeout;
};

export const PrepareDynamicKeyStrokeMagnetismReport = (
    buffer: Buffer,
    profileIndex: number,
    data: DynamicKeystrokeData,
    keyNumberPhysical: number,
) => {
    buffer.fill(0);
    buffer[0] = Command.SetMagnetism;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[2] = MappingMode.Normal;
    buffer[3] = TriggerOption.Dynamic;
    buffer[5] = KeySettingMode.PerKey;
    buffer[6] = keyNumberPhysical;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
    buffer[11] = data.firstPointValue != null ? ActuationToDynamicKeystroke(data.firstPointValue) : 0x0c;

    buffer[12] = data.firstPointPressButton != null ? 0x01 : 0x00;
    buffer[13] = data.secondPointPressButton != null ? 0x04 : 0x00;
    buffer[14] = data.secondPointReleaseButton != null ? 0x10 : 0x00;
    buffer[15] = data.firstPointReleaseButton != null ? 0x40 : 0x00;

    buffer[16] = otherFlag;
};

export const PrepareSetCustomActuationMode = (buffer: Buffer) => {
    buffer.fill(0);
    buffer[0] = Command.SetMagnetismMode;
    buffer[1] = MagnetismMode.Custom;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareActuationPointAndRapidTriggerMagnetismReport = (
    buffer: Buffer,
    data: ActuationPointData,
    profileIndex: number,
    layer: number,
    isPerKey: boolean,
    keyNumberPhysical: number,
) => {
    const profile = ProfileIndexToFWProfileNumber(profileIndex);
    const layerAndProfile = ((layer & 0x0F) << 4) | (profile & 0x0F);

    buffer.fill(0);
    buffer[0] = Command.SetMagnetism;
    buffer[1] = layerAndProfile;
    buffer[2] = MappingMode.Normal;
    buffer[3] = data.rapidTriggerEnabled ? TriggerOption.RapidTrigger : TriggerOption.NonRapidTrigger;
    buffer[4] = ActuationToTravel(data.actuationPointPress);
    buffer[5] = isPerKey ? KeySettingMode.PerKey : KeySettingMode.AllKeys;
    buffer[6] = isPerKey ? keyNumberPhysical : 0;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
    buffer[8] = ActuationToTravel(data.actuationPointRelease);
    if (data.rapidTriggerEnabled) {
        buffer[9] = ActuationToRapidTrigger(data.rapidTriggerPointPress);
        buffer[10] = ActuationToRapidTrigger(data.rapidTriggerPointRelease);
    }
    buffer[16] = otherFlag;
};

export const PrepareVisualization = (buffer: Buffer, enable: boolean) => {
    buffer.fill(0);
    buffer[0] = Command.SetReportTravelDistance;
    buffer[1] = enable ? 1 : 0;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareReset = (buffer: Buffer) => {
    buffer.fill(0);
    buffer[0] = Command.SetReset;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareSetReportRate = (buffer: Buffer, profileIndex: number, firmwareRate: number) => {
    buffer.fill(0);
    buffer[0] = Command.SetReportRate;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[2] = firmwareRate;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareKeystrokeClear = (buffer: Buffer, profileIndex: number) => {
    buffer.fill(0);
    buffer[0] = Command.SetMagnetism;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[6] = KeySettingMode.PerKey;
    buffer[16] = otherFlag;
};

export const UpdateKeystrokeClear = (buffer: Buffer, keyNumberPhysical: number) => {
    buffer[6] = keyNumberPhysical;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareLightingBuffers = (lightingEffect: LightingEffect) => {
    const effectData = lightingEffect.toUint8Array();
    const LEDBuffer = Buffer.alloc(9, 0);
    LEDBuffer[0] = Command.SetLEDParam;
    LEDBuffer.set(effectData, 1);
    LEDBuffer[8] = CalculateChecksum(LEDBuffer.subarray(0, 8));
    const SideLEDBuffer = Buffer.alloc(9, 0);
    SideLEDBuffer[0] = Command.SetSideLEDParam;
    SideLEDBuffer.set(effectData, 1);
    SideLEDBuffer[8] = CalculateChecksum(SideLEDBuffer.subarray(0, 8));
    return { LEDBuffer, SideLEDBuffer };
};

export const PrepareGetFWVersion = () => {
    const requests = {
        USB: Buffer.alloc(9, 0),
        RF: Buffer.alloc(9, 0),
        LED: Buffer.alloc(9, 0),
        Dongle: Buffer.alloc(9, 0),
    };
    requests.USB[1] = Command.GetFWVersionUSB;
    requests.USB[8] = CalculateChecksum(requests.USB);

    requests.RF[1] = Command.GetFWVersionRF;
    requests.RF[8] = CalculateChecksum(requests.RF);

    requests.LED[1] = Command.GetFWVersionLED;
    requests.LED[8] = CalculateChecksum(requests.LED);

    requests.Dongle[1] = Command.GetFWVersionDongle;
    requests.Dongle[8] = CalculateChecksum(requests.Dongle);
    return requests;
};

export const ParseFWVersionResponse = (buffer: Buffer) => {
    if (!Buffer.isBuffer(buffer)) {
        console.error('ParseFWVersion: Malformed buffer');
        return '';
    }
    const command = buffer.readUInt8(0);
    switch (command) {
        case Command.GetFWVersionUSB: {
            return `KBv${buffer.readUint16LE(1).toString(16)}`;
        }
        case Command.GetFWVersionRF: {
            return `RFv${buffer.readUint16LE(1).toString(16)}`;
        }
        case Command.GetFWVersionLED: {
            return `LEDv${buffer.readUint16LE(1).toString(16)}`;
        }
        default: {
            console.warn(`valueC: Unexpected response in FW Version: 0x${command.toString(16).padStart(2, '0')}`);
            return '';
        }
    }
};

export const ParseDongleVersionResponse = (buffer: Buffer) => {
    if (Buffer.isBuffer(buffer) && buffer.length >= 2) {
        return `DongleV${buffer.readUint16BE(0).toString(16).padStart(4, '0')}`;
    }
    console.warn(`valueC: Unexpected response in Dongle FW Version`);
    return '';
};

export const PrepareSetProfileIndex = (buffer: Buffer, profileIndex: number, layer: number) => {
    buffer.fill(0);
    buffer[0] = Command.SetProfileIndex;
    buffer[1] = ProfileIndexToFWProfileNumber(profileIndex);
    buffer[2] = layer;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareGetProfileIndex = (buffer: Buffer) => {
    buffer.fill(0);
    buffer[0] = Command.GetProfileIndex;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const ParseProfileIndexResponse = (buffer: Buffer) => {
    if (!Buffer.isBuffer(buffer)) throw new Error('ParseProfileResponse: Malformed buffer');
    if (buffer[0] != Command.GetProfileIndex) throw new Error('ParseProfileResponse: Buffer structure mismatch');

    switch (buffer[1]) {
        case ProfileNumbers.Profile0:
            return 0;
        case ProfileNumbers.Profile1:
            return 1;
        case ProfileNumbers.Profile2:
            return 2;
        default:
            throw new Error(`ParseProfileResponse: Unexpected profile number: 0x${buffer.readUInt8(1).toString(16)}`);
    }
};

export const PrepareMacroBuffer = (buffer: Buffer, id: number, page: number, isLastPage: boolean) => {
    buffer.fill(0);
    buffer[0] = Command.SetMacro;
    buffer[1] = id;
    buffer[2] = page;
    buffer[3] = valueCFirmwareLimits.MacroPageSize;
    buffer[4] = isLastPage ? 1 : 0;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
};

export const PrepareGetDeviceID = (buffer: Buffer) => {
    buffer.fill(0);
    buffer[0] = Command.GetDeviceID;
    buffer[7] = CalculateChecksum(buffer.subarray(0, 7));
    return buffer;
};

export const ParseDeviceID = (buffer: Buffer) => {
    if (!Buffer.isBuffer(buffer) || buffer.length < 8) console.error('Malformed buffer');
    if (buffer[0] != Command.GetDeviceID) console.error('Unexpected response!');
    const deviceID = buffer.readUInt32LE(1);
    const mode = buffer[5] == 0 ? 'Wired' : 'Wireless';
    const type = buffer[6] == 0 ? 'Keyboard' : 'Mouse';
    return { deviceID, mode, type };
};
