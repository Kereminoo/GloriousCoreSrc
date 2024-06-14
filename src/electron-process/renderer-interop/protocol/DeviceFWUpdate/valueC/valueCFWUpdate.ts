import EventEmitter from 'events';
import { valueC } from '../../device/keyboard/valueC/valueC';

// import { ChannelCredentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import path from 'path';
import * as child_process from 'node:child_process';
import { EventTypes } from '../../../../../common/EventVariable';

import { DriverGrpcClient } from './generated/driver.grpc-client';
import { Progress, ResUpgradeInfo, UpgradeDevInfo, UpgradeInfo, UpgradeMethod } from './generated/driver';

const UPGRADE_SEQUENCE = {
    Wired: [UpgradeMethod.KEYBOARD8K, UpgradeMethod.KEYBOARD8KRF, UpgradeMethod.MLED],
    Wireless: [UpgradeMethod.KEYBOARD8K, UpgradeMethod.KEYBOARD8KRF, UpgradeMethod.NORDICKEYBOARD, UpgradeMethod.MLED],
    Dongle: [UpgradeMethod.NORDICDANGLE],
};

enum UpgradeStage {
    Upd50 = 50,
    Upd100 = 100,
}

// TODO: this is from the doc, verify against actual dongles
const DONGLE_DEVICE_ID = {
    '0x342D0xE3E0': 1732,
    '0x342D0xE3E1': 1733,
    '0x342D0xE3E2': 1734,
    // valueB ANSI, kept for reference,
    // '0x342D0xE3E6': 1735,
    // '0x342D0xE3E7': 1736,
    // '0x342D0xE3E8': 1737,
    '0x342D0xE3F5': 1738,
    '0x342D0xE3F6': 1739,
    '0x342D0xE3F7': 1740,
    // valueB ISO, kept for reference,
    // '0x342D0xE3FB': 1741,
    // '0x342D0xE3FC': 1743,
    // '0x342D0xE3FD': 1744,
};

// TODO: move to global helper location
const valueC_WIRELESS = [
    // valueC ANSI Wireless
    '0x342D0xE3D7', // 65%
    '0x342D0xE3D8', // 75%
    '0x342D0xE3D9', // 100%
    // valueC ISO Wireless
    '0x342D0xE3EC', // 65%
    '0x342D0xE3ED', // 75%
    '0x342D0xE3EE', // 100%
];

export class valueCFWUpdate extends EventEmitter {

    private static instance?: valueCFWUpdate;
    private driverGrpc?: DriverGrpcClient;
    private childProcess?: child_process.ChildProcess;
    private hasDongle: boolean = false;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new valueCFWUpdate();
        }
        return this.instance;
    }

    async Initialization(deviceInfo, SN, data: { execPath: string; protoPath?}) {
        // console.log(deviceInfo, SN, data);

        try {

            // Do not try to start if already running
            if (this.childProcess != null) return;

            this.emit(EventTypes.ProtocolMessage, { Param: { Data: 'START' } });

            const execPath = path.parse(data.execPath);
            const realExecPath = path.join(execPath.dir, execPath.name + '.exe');
            await this.startUpdaterExecutable(realExecPath);

            // this.driverGrpc = new DriverGrpcClient('localhost:3814', ChannelCredentials.createInsecure(), );
            const def = protoLoader.loadSync(path.join(execPath.dir, 'driver.proto'), {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
            });
            const driver = grpc.loadPackageDefinition(def).driver;
            this.driverGrpc = new driver.DriverGrpc('localhost:3814', grpc.credentials.createInsecure());

            await this.updateDevice(deviceInfo, SN, data);
        } catch (ex) {
            this.emit(EventTypes.ProtocolMessage, {
                Param: { Data: { Error: ex } },
            });
            await this.stopUpdaterExecutable();
            console.error(ex);
        }
    }

    async updateDevice(dev, SN, _data) {
        const isWireless = valueC_WIRELESS.includes(SN);

        const deviceID = await valueC.getInstance()?.getDeviceID(SN);
        if (!deviceID) throw new Error('Could not get device ID!');

        const devicePath = valueC.getInstance().FindDevice(SN);
        const devInfo: UpgradeDevInfo = {
            dev_id: deviceID,
            vid: parseInt(dev.vid[0], 16),
            pid: parseInt(dev.pid[0], 16),
            devicePath: devicePath
        };

        const response = await this.getUpgradeInfo(devInfo);
        if (!response) throw new Error("Failed to get upgrade info!");

        const value = JSON.parse(response.res);
        const data = value.data;
        const file_path = data.file_path;
        const version_str = data.version_str;

        this.emit(EventTypes.ProtocolMessage, {
            Param: {
                Data: 0,
                message: `### valueC updating device: ${devicePath}, fw: ${file_path}, ver: ${version_str} ### `,
            },
        });

        const dongle_idx = dev.StateType.indexOf('Dongle');
        this.hasDongle = (dev.FWUpdateExtension.length > 1) && dongle_idx >= 0;

        if (!isWireless && this.hasDongle) throw new Error(`Device ${SN} has a dongle but is not marked as wireless!`);

        const updateSequence = isWireless ? UPGRADE_SEQUENCE.Wireless : UPGRADE_SEQUENCE.Wired;

        const upgradeRequest: UpgradeInfo = {
            dev: devInfo,
            file_path: file_path,
            version_str: version_str,
            upgrade_method: updateSequence,
        };

        const progressStream = this.driverGrpc!.upgradeDev(upgradeRequest);
        if (!progressStream) {
            this.emit(EventTypes.ProtocolMessage, {
                Param: {
                    Data: { Error: 'Failed to start device upgrade process!' },
                },
            });
        }

        const multiplier = this.hasDongle ? UpgradeStage.Upd50 : UpgradeStage.Upd100;

        progressStream.on('data', (progress: Progress) => {
            if (progress.err != '') {
                this.emit(EventTypes.ProtocolMessage, {
                    Param: { Data: { Error: `Device update error: ${progress.err}` } ,
                }});
                throw new Error(progress.err);
            }
            const progressPercent = progress.progress * multiplier;
            // console.log(`Progress: ${progressPercent}% ${progress.err}`);
            this.emit(EventTypes.ProtocolMessage, { Param: { Data: progressPercent } });
        });

        progressStream.on('end', () => {
            console.log(`Update finished`);
            this.emit(EventTypes.ProtocolMessage, { Param: { Data: this.hasDongle ? UpgradeStage.Upd50 : UpgradeStage.Upd100 } });
            if (this.hasDongle) {
                const dongleSN = `${dev.vid[dongle_idx]}${dev.pid[dongle_idx]}`;
                this.updateDongle(dongleSN);
            } else {
                this.stopUpdaterExecutable();
            }
        });

        progressStream.on('error', (progress: Progress) => {
            console.error(`Update encountered an error: ${progress?.err}`);
            this.emit(EventTypes.ProtocolMessage, {
                Param: {
                    Data: { Error: progress?.err },
                },
            });
            throw new Error(`Error during update: ${progress.err}`);
        });
    }

    async updateDongle(dongleSN) {
        const dongleID = DONGLE_DEVICE_ID[dongleSN];
        if (dongleID == null) throw new Error("Failed to get dongle ID!");

        const vid = parseInt(dongleSN.substring(0, 6), 16);
        const pid = parseInt(dongleSN.substring(6, 12), 16);
        const devicePath = valueC.getInstance().FindDevice(dongleSN);

        const dongleInfo: UpgradeDevInfo = {
            dev_id: dongleID,
            vid: vid,
            pid: pid,
            devicePath: devicePath
        };

        const response = await this.getUpgradeInfo(dongleInfo);
        if (!response) throw new Error("Failed to get dongle upgrade info!");

        const value = JSON.parse(response.res);
        const data = value.data;
        const file_path = data.file_path;
        const version_str = data.version_str;

        this.emit(EventTypes.ProtocolMessage, {
            Param: {
                Data: 0,
                message: `### valueC updating dongle: ${devicePath}, fw: ${file_path}, ver: ${version_str} ### `,
            },
        });

        const dongleUpgradeRequest: UpgradeInfo = {
            dev: dongleInfo,
            file_path: file_path,
            version_str: version_str,
            upgrade_method: UPGRADE_SEQUENCE.Dongle
        }

        const progressStream = this.driverGrpc!.upgradeDev(dongleUpgradeRequest);
        if (!progressStream) {
            this.emit(EventTypes.ProtocolMessage, {
                Param: {
                    Data: { Error: 'Failed to start dongle upgrade process!' },
                },
            });
        }

        progressStream.on('data', (progress: Progress) => {
            if (progress.err != '') {
                this.emit(EventTypes.ProtocolMessage, {
                    Param: { Data: { Error: `Dongle update error: ${progress.err}` } }
                });
                throw new Error(progress.err);
            }
            const progressPercent = UpgradeStage.Upd50 * (1 + progress.progress);
            // console.log(`Progress: ${progressPercent}% ${progress.err}`);
            this.emit(EventTypes.ProtocolMessage, { Param: { Data: progressPercent } });
        });

        progressStream.on('end', () => {
            console.log(`Update finished`);
            this.emit(EventTypes.ProtocolMessage, { Param: { Data: UpgradeStage.Upd100 } });
            this.stopUpdaterExecutable();
        });

        progressStream.on('error', (progress?: Progress) => {
            console.error(`Dongle update encountered an error: ${progress?.err}`);
            this.emit(EventTypes.ProtocolMessage, {
                Param: {
                    Data: { Error: progress?.err },
                },
            });
            throw new Error(`Error during update: ${progress?.err}`);
        });
    }

    async getUpgradeInfo(request: UpgradeDevInfo) {
        return new Promise<ResUpgradeInfo | undefined>((resolve, reject) => {
            this.driverGrpc!.getUpgradeInfo(request, (error, response) => {
                if (error) reject(error);
                else resolve(response);
            });
        });
    }

    async startUpdaterExecutable(execPath: string) {
        if (this.childProcess) throw new Error("Updater already running!")
        this.childProcess = child_process.execFile(execPath);
        await new Promise((r) => setTimeout(r, 3000));
        try {
            process.kill(this.childProcess.pid!, 0);
        }
        catch (_ex) {
            this.childProcess = undefined;
            throw new Error("Failed to spawn updater process!");
        }

    }

    async stopUpdaterExecutable() {
        try {
            if (this.childProcess?.pid != null && this.childProcess.pid != 0) {
                process.kill(this.childProcess.pid, 'SIGKILL');
            }
        }
        catch (ex) {
            console.warn(ex);
        }
        finally {
            this.childProcess = undefined;
        }
    }
}
