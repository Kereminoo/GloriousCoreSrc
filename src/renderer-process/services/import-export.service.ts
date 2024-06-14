import { DeviceDataRecord, ProfileData } from '../../common/data/records/device-data.record';
import { IPCService } from './ipc.service';
import { AppChannel } from '../../common/channel-maps/AppChannel.map';
import { MacroRecord } from '../../common/data/records/macro.record';
import { getMacro, saveMacroRecord } from './records.service';

const CURRENT_EXPORT_VERSION = 1;

const createSaveDialogOptions = (outputName: string) => {
    const sanitizedName = outputName.replace(/[<>:"\/\\|?*]+/g, '');
    return { defaultPath: sanitizedName, filters: [{ name: 'Custom File Type', extensions: ['json'] }] };
};

const createOpenDialogOptions = () => {
    return { filters: [{ name: 'Custom File Type', extensions: ['json'] }], properties: ['openFile'] };
};

export class ImportExport {
    private readonly deviceRecord: DeviceDataRecord;
    private profilePath: string;

    constructor(deviceRecord: DeviceDataRecord) {
        this.deviceRecord = deviceRecord;
        this.profilePath = '';
    }

    exportProfile = async () => {
        const response = await IPCService.invoke(AppChannel.ShowSaveDialog, this.createExportDialogOptions());
        if (!response.success) return { success: false, data: null };
        this.profilePath = response.data;
        if (!this.profilePath) return { success: false, data: 'Export path empty, likely user cancelled' };
        return this.saveProfile();
    };

    importProfile = async () => {
        const response = await IPCService.invoke(AppChannel.ShowOpenDialog, createOpenDialogOptions());
        if (!response.success) return { success: false, data: null };
        this.profilePath = response.data;
        if (!this.profilePath) return { success: false, data: 'Import path empty, likely user cancelled' };
        return this.loadProfile();
    };

    private createExportDialogOptions = () => {
        return createSaveDialogOptions(`Glorious_${this.deviceRecord.devicename}`);
    };

    private saveProfile = async () => {
        console.log(
            `Exporting profile for ${this.deviceRecord.devicename} to ${this.profilePath}: ${JSON.stringify(this.deviceRecord)}`,
        );
        const profileData = this.prepareData();
        if (!profileData) return { success: false, data: 'Failed to prepare profile data' };
        try {
            // TODO: get export version from somewhere
            const fileData = {
                filename: this.deviceRecord.SN + '_Profile',
                path: this.profilePath,
                exportVersion: 1, //this.commonService.getEnvFileData().exportVersion),
                value: profileData,
            };
            return await IPCService.invoke(AppChannel.Tool_SaveFile, fileData);
        } catch (err) {
            return { success: false, data: `Error writing file: ${err}` };
        }
    };

    private loadProfile = async () => {
        console.log(`importing profile for ${this.deviceRecord.devicename} from ${this.profilePath}`);
        return { success: true };
    };

    private deviceType() {
        switch (this.deviceRecord.ModelType) {
            case 1:
                return 'Mouse';
            case 2:
                return 'Keyboard';
            default:
                return 'Unknown';
        }
    }

    private prepareData() {
        switch (this.deviceType()) {
            case 'Mouse':
                return this.prepareMouseData();
            case 'Keyboard':
                return this.prepareKeyboardData();
            default:
                return null;
        }
    }

    private prepareMouseData() {
        const CurrentProfileIndex = Number(this.deviceRecord.profileindex) + 1;
        const profileData = this.deviceRecord.profile.find((x: ProfileData) => x.profileid == CurrentProfileIndex);
        if (!profileData) return null;

        let preparedData = {
            profile: profileData,
            macroObj: [],
            version: 0, // TODO: get app version from somewhere
        };

        if (preparedData.profile.keybinding) {
            for (let keybindingElement of preparedData.profile.keybinding) {
                if (
                    keybindingElement.group == 2 &&
                    (keybindingElement.function == 1 || keybindingElement.function == 2)
                ) {
                    keybindingElement.name = '';
                    keybindingElement.param = '';
                    keybindingElement.param2 = '';
                    switch (keybindingElement.value) {
                        case 0:
                            keybindingElement.group = 3;
                            keybindingElement.function = 1;
                            break;
                        case 1:
                            keybindingElement.group = 3;
                            keybindingElement.function = 3;
                            break;
                        case 2:
                            keybindingElement.group = 3;
                            keybindingElement.function = 2;
                            break;
                        case 3:
                            keybindingElement.group = 3;
                            keybindingElement.function = 4;
                            break;
                        case 4:
                            keybindingElement.group = 3;
                            keybindingElement.function = 5;
                            break;
                        case 5:
                            keybindingElement.group = 4;
                            keybindingElement.function = 3;
                            break;
                        case 6:
                            keybindingElement.group = 3;
                            keybindingElement.function = 6;
                            break;
                        case 7:
                            keybindingElement.group = 3;
                            keybindingElement.function = 7;
                            break;
                    }
                } else if (keybindingElement.group == 1) {
                    // TODO: access macroService somehow?
                    // const macroData = macroService.macroSelectData.find(
                    //     (x: any) => x.value == keybindingElement.function,
                    // );
                    // if (macroData) preparedData.macroObj.push(macroData);
                }
            }
        }
        return preparedData;
    }

    private prepareKeyboardData() {
        console.log(this.deviceRecord.ModelType);
        return [];
    }
}

export const ExportMacro = async (macroID: number) => {
    const macroRecord = await getMacro(macroID);
    if (!macroRecord) return;

    const tmpRecord = structuredClone(macroRecord);
    tmpRecord.value = -1;
    delete tmpRecord._id;

    const response = await IPCService.invoke(AppChannel.ShowSaveDialog, createSaveDialogOptions(tmpRecord.name));
    if (!response.success) return { success: false, data: null };
    const exportPath = response.data;
    if (!exportPath) return { success: false, data: 'Export path empty, likely user cancelled' };
    const data = {
        filename: tmpRecord.name,
        path: exportPath,
        exportVersion: 1,
        value: tmpRecord,
    };
    return await IPCService.invoke(AppChannel.Tool_SaveFile, data);
};

export const ImportMacro = async () => {
    const response = await IPCService.invoke(AppChannel.ShowOpenDialog, createOpenDialogOptions());
    if (!response.success) return { success: false, data: null };
    const importPath = response.data;
    const importResult = await IPCService.invoke(AppChannel.Tool_OpenFile, importPath);
    if (importResult.success) {
        const loaded = await importResult.data;
        try {
            const parsedResults = JSON.parse(loaded);
            if (parsedResults['exportVersion'] < CURRENT_EXPORT_VERSION) {
                console.warn(
                    `Importing macro with different export version: ${parsedResults['exportVersion']}, current: ${CURRENT_EXPORT_VERSION}`,
                );
            }
            const macroData = parsedResults['value'];
            const macroRecord = new MacroRecord(macroData);
            return { success: true, data: await saveMacroRecord(macroRecord) };
        } catch (e) {
            return { success: false, data: e };
        }
    }
    return { success: false, data: importResult.data };
};
