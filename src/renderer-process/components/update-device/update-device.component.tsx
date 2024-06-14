import React, { useEffect, useRef, useState } from 'react';
import style from './update-device.module.css';
import ContentDialogComponent from '../content-dialog/content-dialog.component';
import { UpdatesService } from '@renderer/services/updates.service';
import { IPCProgress } from 'src/common/ipc-progress';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { useDevicesContext, useDevicesManagementContext } from '../../contexts/devices.context';
import { IconSize, IconType } from '../icon/icon.types';
import { DeviceUpdateTasks } from '../../data/update-task';
import Icon from '../icon/icon';
import { Color } from '../component.types';

type FirmwareUpdaterStep = 'pending' | 'in-progress' | 'error' | 'failed';

class ComponentState {
    deviceIcon: IconType = IconType.ModelODevice;
    deviceSN: string = '';
}

const WiredDeviceSet = new Set(['USB']);
const WirelessMouseSet = new Set(['USB', 'Dongle']);
const WirelessKeyboardSet = new Set(['USB', 'Dongle']);

const ValidUpdateDeviceStateArray = new Map(
    Object.entries({
        '0x320F0x5044': WiredDeviceSet, // GMMK PRO
        '0x320F0x5092': WiredDeviceSet, // GMMK PRO
        '0x320F0x5046': WiredDeviceSet, // GMMK PRO ISO
        '0x320F0x5093': WiredDeviceSet, // GMMK PRO ISO
        '0x320F0x504A': WiredDeviceSet, // GMMK v2 65 ISO
        '0x320F0x5045': WiredDeviceSet, // GMMK v2 65 US
        '0x320F0x505A': WiredDeviceSet, // GMMK v2 96 ISO
        '0x320F0x504B': WiredDeviceSet, // GMMK v2 96 US
        '0x320F0x5088': WiredDeviceSet, // GMMK Numpad

        '0x342D0xE3C5': WiredDeviceSet, // valueB
        '0x342D0xE3CE': WiredDeviceSet, // valueBISO
        '0x342D0xE3CB': WirelessKeyboardSet, // valueBWireless
        '0x342D0xE3D4': WirelessKeyboardSet, // valueBWirelessISO
        '0x342D0xE3C7': WiredDeviceSet, // valueB65
        '0x342D0xE3D0': WiredDeviceSet, // valueB65ISO
        '0x342D0xE3CD': WirelessKeyboardSet, // valueB65Wireless
        '0x342D0xE3D6': WirelessKeyboardSet, // valueB65WirelessISO
        '0x342D0xE3C6': WiredDeviceSet, // valueB75
        '0x342D0xE3CF': WiredDeviceSet, // valueB75ISO
        '0x342D0xE3CC': WirelessKeyboardSet, // valueB75Wireless
        '0x342D0xE3D5': WirelessKeyboardSet, // valueB75WirelessISO
        '0x342D0xE3C8': WiredDeviceSet, // valueD100
        '0x342D0xE3D1': WiredDeviceSet, // valueD100ISO
        '0x342D0xE3C9': WiredDeviceSet, // valueD75
        '0x342D0xE3D2': WiredDeviceSet, // valueD75ISO
        '0x342D0xE3CA': WiredDeviceSet, // valueD65
        '0x342D0xE3D3': WiredDeviceSet, // valueD65ISO

        '0x342D0xE3D7': WirelessKeyboardSet, // valueC 65% Wireless ANSI
        '0x342D0xE3D8': WirelessKeyboardSet, // valueC 75% Wireless ANSI
        '0x342D0xE3D9': WirelessKeyboardSet, // valueC 100% Wireless ANSI
        '0x342D0xE3EC': WirelessKeyboardSet, // valueC 65% Wireless ISO
        '0x342D0xE3ED': WirelessKeyboardSet, // valueC 75% Wireless ISO
        '0x342D0xE3EE': WirelessKeyboardSet, // valueC 100% Wireless ISO

        '0x342D0xE3DA': WiredDeviceSet, // valueC 65% ANSI
        '0x342D0xE3DB': WiredDeviceSet, // valueC 75% ANSI
        '0x342D0xE3DC': WiredDeviceSet, // valueC 100% ANSI
        '0x342D0xE3EF': WiredDeviceSet, // valueC 65% ISO
        '0x342D0xE3F0': WiredDeviceSet, // valueC 75% ISO
        '0x342D0xE3F1': WiredDeviceSet, // valueC 100% ISO

        '0x342D0xE3DD': WiredDeviceSet, // valueA valueD HE 65% ANSI
        '0x342D0xE3F2': WiredDeviceSet, // valueA valueD HE 65% ISO
        '0x342D0xE3DE': WiredDeviceSet, // valueA valueD HE 75% ANSI
        '0x342D0xE3F3': WiredDeviceSet, // valueA valueD HE 75% ISO
        '0x342D0xE3DF': WiredDeviceSet, // valueA valueD HE 100% ANSI
        '0x342D0xE3F4': WiredDeviceSet, // valueA valueD HE 100% ISO

        '0x320F0x8888': WiredDeviceSet, // Model O Wired
        '0x258A0x2011': WirelessMouseSet, // Model O Wireless
        '0x258A0x2036': WiredDeviceSet, // Model O Minus Wired
        '0x258A0x2013': WirelessMouseSet, // Model O Minus Wireless
        '0x258A0x2015': WirelessMouseSet, // Model O Pro Wireless
        '0x320F0x823A': WiredDeviceSet, // Model O2 Wired
        '0x093A0x822A': WirelessMouseSet, // Model O2 Wireless
        '0x258A0x2019': WirelessMouseSet, // Model O2 Pro 1k
        '0x258A0x201B': WirelessMouseSet, // Model O 2 Pro 8k
        '0x258A0x2012': WirelessMouseSet, // Model D Wireless
        '0x258A0x2014': WirelessMouseSet, // Model D Minus Wireless
        '0x258A0x2017': WirelessMouseSet, // Model D Pro Wireless
        '0x258A0x201A': WirelessMouseSet, // Model D 2 Pro 1k
        '0x258A0x201C': WirelessMouseSet, // Model D 2 Pro 8k
        '0x22D40x1503': WiredDeviceSet, // Model I
        '0x093A0x821A': WirelessMouseSet, // Model I2
        '0x320F0x831A': WiredDeviceSet, // Model valueG
        '0x320F0x825A': WiredDeviceSet, // Model D2 Wired
        '0x093A0x824A': WirelessMouseSet, // Model D2 Wireless
        '0x258A0x2018': WirelessMouseSet, // Series One Pro Wireless
        '0x258A0x201D': WirelessMouseSet, //valueH Pro (8k wireless)
        '0x093A0x826A': WirelessMouseSet, //valueF Wireless
        '0x320F0x827A': WiredDeviceSet, //valueF

        // '0x12CF0x0491': [], // RGB valueJ
        '0x12CF0x0491': WiredDeviceSet, //GMP 2 GLO

        '0x24420x2682': WiredDeviceSet, // temporary valueB
        '0x24420x0056': WirelessKeyboardSet, // temporary valueB Wireless
        '0x24420x0052': WiredDeviceSet, // temporary valueB 65%
        '0x24420x0054': WirelessKeyboardSet, // temporary valueB 65% Wireless
        '0x24420x0053': WiredDeviceSet, // temporary valueB 75%
        '0x24420x0055': WirelessKeyboardSet, // temporary valueB 75% Wireless
    }),
);

function UpdateDeviceComponent(props: any) {
    // const { devices, selectedDevice } = props;

    // const [firmwareUpdaterDialogIsOpen, setFirmwareUpdaterDialogIsOpen] = useState(false);
    const [firmwareUpdaterStep, setFirmwareUpdaterStep] = useState<string & FirmwareUpdaterStep>('pending');

    const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);
    const [confirmationDialogData, setConfirmationDialogData] = useState({ text: '', title: '', icon: '' });
    const confirmationResolve = useRef<null | ((result: boolean) => void)>(null);

    const [selectedDevices, setSelectedDevices] = useState<any[]>([]);

    const [devicesWithUpdatesAvailable, setDevicesWithUpdatesAvailable] = useState<any[]>([]);

    // const [downloadProgressMap, setDownloadProgressMap] = useState(new Map<string, number>());
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [deviceProgress, setDeviceProgress] = useState(0);
    const [accessoryProgress, setAccessoryProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    // const downloadProgress = useRef(0);
    // const deviceProgress = useRef(0);
    // const accessoryProgress = useRef(0);

    const downloadProgressMapRef = useRef(new Map<string, number>());
    const [updateProgressMap, setUpdateProgressMap] = useState(new Map<string, number | number[]>());
    const updateProgressMapRef = useRef(new Map<string, number | number[]>());

    const [componentState, setComponentState] = useState<ComponentState>(new ComponentState());

    const translate = useTranslate();
    const devicesContext = useDevicesContext();
    const { setDevicesCurrentlyUpdating, refreshDevices } = useDevicesManagementContext();
    const uiContext = useUIContext();
    const { closeDeviceUpdateModal } = useUIUpdateContext();

    
    const [isUpdating, setIsUpdating] = useState(false);

    // useEffect(() =>
    // {
    //   setConfirmationDialogIsOpen(true);
    // }, [confirmationDialogData]);

    useEffect(() => {
        console.log('update model isOpen changed')
        setDownloadProgress(0);
        setDeviceProgress(0);
        setAccessoryProgress(0);
        setStatusMessage('');
    }, [uiContext.updateDeviceModal_isOpen]);

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }

        componentState.deviceSN = devicesContext.previewDevice.SN;

        // const iconTypes = [IconType.ModelODevice, IconType]
        // componentState.deviceIcon = (devicesContext.previewDevice.ModelType)
    }, [devicesContext.previewDevice]);

    const refresh = async () => {
        if (uiContext.updateDeviceModal_isOpen == true) {
            // setFirmwareUpdaterStep(data.step as FirmwareUpdaterStep);
            // setFirmwareUpdaterDialogIsOpen(true);
            // debug
            // const updatesAvailable = await getDevicesWithUpdatesAvailable(true);
            // const updatesAvailable = await getDevicesWithUpdatesAvailable();
            // setDevicesWithUpdatesAvailable(updatesAvailable);
            // console.log(updatesAvailable);
            // downloadProgressMapRef.current = new Map();
            // const existingFirmwareUpdaters = await getDownloadedFirmwareUpdaters();
            // for(let i = 0; i < existingFirmwareUpdaters.length; i++)
            // {
            //   downloadProgressMapRef.current.set(existingFirmwareUpdaters[i].SN, 100);
            // }
            // setDownloadProgressMap(downloadProgressMapRef.current);
            // App Update
            // if(this.FWManager.versionCompare(data.AppSetting.version,this.getAppVersion(),2)==1){
            //     this.FWManager.FwServerData.push(data.AppSetting);
            //  }
            // if(this.FWManager.FwServerData.length>0){
            //     console.log('getAssignURL_json_FwServerData',this.FWManager.FwServerData);
            //     this.getAppService.hasUpdateTip=true;
            //     this.setTopLayerContentUIStatus("CHECK_DOWNLOAD");
            // }
            // else{
            //     this.setTopLayerContentUIStatus("");
            // }
        }
    };

    const getDownloadedFirmwareUpdaters = async () => {
        const files = await UpdatesService.getDownloadedFirmwareUpdaters();
        // console.log(files);
        return files;
    };

    const getFirmwareVersionDataFromServer = async (deviceSN: string) => {
        const versionData = await UpdatesService.getRemoteVersionManifest();

        const mouseData = versionData?.Mouse?.find((item) => item.SN == deviceSN);
        if (mouseData) return mouseData;
        const keyboardData = versionData?.Keyboard?.find((item) => item.SN == deviceSN);
        if (keyboardData) return keyboardData;
        const valueJData = versionData?.valueJ?.find((item) => item.SN == deviceSN);
        if (valueJData) return valueJData;

        console.error(`Failed to find update url for: ${deviceSN}`, versionData);
        return null;
    };

    const beginFirmwareUpdates = async () => {
        setIsUpdating(true);
        await downloadFirmware();
        console.log('all selected device firmware updaters have been downloaded');
        setDevicesCurrentlyUpdating([componentState.deviceSN]);
        const success = await updateSelectedDevices();
        if (success == true) {
            setStatusMessage('Update completed successfully!');
        } else {
            setStatusMessage('An error occurred during the update.');
        }
        setIsUpdating(false);
    };

    const downloadFirmware = () => {
        setDownloadProgress(0);
        setDeviceProgress(0);
        setAccessoryProgress(0);
        return new Promise<void>(async (resolve, _) => {
            const existingFirmwareUpdaters = await getDownloadedFirmwareUpdaters();
            const existingDeviceUpdate = existingFirmwareUpdaters.find(
                (updater) => updater.SN == componentState.deviceSN,
            );
            if (existingDeviceUpdate != null) {
                setDownloadProgress(100);
                resolve();
                return;
            }

            const firmwareData = await getFirmwareVersionDataFromServer(componentState.deviceSN);
            if (firmwareData == null) return;
            UpdatesService.downloadFirmwareUpdaters([firmwareData], (update) => {
                if (update.type == 'start') {
                    setDownloadProgress(0);
                } else if (update.type == 'progress') {
                    setDownloadProgress(update.value.progress);
                } else if (update.type == 'complete') {
                    setDownloadProgress(100);
                    resolve();
                } else if (update.type == 'error') {
                    setStatusMessage('An error occurred during the update.');
                    setIsUpdating(false);
                    resolve();
                    console.log(update);
                }
            });
        });
    };

    const updateSelectedDevices = async () => {
        setDeviceProgress(0);
        setAccessoryProgress(0);
        return new Promise<boolean>(async (resolve) => {
            try {
                const firmwareData = await getFirmwareVersionDataFromServer(componentState.deviceSN);
                UpdatesService.beginFirmwareUpdates([firmwareData], (update: IPCProgress<any>) => {
                    console.log(update);
                    if (update.type == 'start') {
                        setDeviceProgress(0);
                        setAccessoryProgress(0);
                    } else if (update.type == 'progress') {
                        const validSet = ValidUpdateDeviceStateArray.get(devicesContext.previewDevice?.SN ?? '');
                        if (validSet == null) {
                            setDeviceProgress(update.value);
                        } else {
                            // if there's a recevier to update, split the update values in half
                            // so they can be set to each progress bar separately
                            if (validSet.has('Dongle')) {
                                const valueIndex = update.value <= 50 ? 0 : 1;
                                if (valueIndex == 0) {
                                    setDeviceProgress(update.value * 2);
                                } else if (valueIndex == 1) {
                                    setAccessoryProgress((update.value - 50) * 2);
                                }
                            } else {
                                // if no receiver, just update the device progress
                                setDeviceProgress(update.value);
                            }
                        }
                    } else if (update.type == 'complete') {
                        setDeviceProgress(100);
                        setAccessoryProgress(100);
                        resolve(true);
                    } else if (update.type == 'error') {
                        setIsUpdating(false);
                        resolve(false);
                        setStatusMessage('An error occurred during the update.');
                        console.log(update);
                    }
                });

                // setTimeout(() =>
                // {
                //   refreshDevices();
                // }, 100) // wait for the devices state to allow refreshing again
            } finally {
            }
        });
    };

    const getDeviceUpdateTasks = (deviceSN: string | null | undefined) => {
        if (deviceSN == null || deviceSN == '') return <></>;

        const deviceUpdateTasks = DeviceUpdateTasks.get(deviceSN);
        if (deviceUpdateTasks == null || deviceUpdateTasks.length == 0) return <></>;

        return deviceUpdateTasks.map((task, index) => {
            const totalAccountedPercentage = deviceUpdateTasks.reduce((acc, item) => {
                return item.percentageOfTotal == null ? acc : acc + item.percentageOfTotal;
            }, 0);
            const undefinedPercentageItems = deviceUpdateTasks.filter((item) => item.percentageOfTotal == null);
            const calculatedPercentage = (100 - totalAccountedPercentage) / undefinedPercentageItems.length;

            const percentage = task.percentageOfTotal != null ? task.percentageOfTotal : calculatedPercentage;
            const currentValue = index == 0 ? downloadProgress : index == 1 ? deviceProgress : accessoryProgress;

            // console.log(downloadProgress);

            return (
                <li
                    className={style.task}
                    key={deviceSN + index}
                    title={translate(task.translate)}
                    style={{ '--width': `${percentage}%` } as React.CSSProperties}
                >
                    <progress className={style.taskprogress} max="100" value={currentValue} />
                </li>
            );
        });
    };

    return (
        <div className="update-device">
            <ContentDialogComponent
                className={style.monitor}
                title={`${translate('Dialog_UpdateDevice_Title', 'Update')} ${translate(`DeviceName_${devicesContext.previewDevice?.SN}`, devicesContext.previewDevice?.devicename)}`}
                icon={
                    <Icon
                        type={IconType.CircleArrow}
                        color={Color.Glorange60}
                        size={IconSize.Large}
                        className="update-icon"
                    />
                }
                open={uiContext.updateDeviceModal_isOpen}
                actions={[
                    <button
                        style={{ display: statusMessage != '' ? 'none' : undefined }}
                        type="button"
                        key="cancel"
                        onClick={() => {
                            // todo: cancel update?
                            
                            setIsUpdating(false);
                            closeDeviceUpdateModal();
                        }}
                    >
                        {translate('Dialog_FirmwareUpdate_CancelButton', 'Cancel')}
                    </button>,
                    <button
                        type="button"
                        key="ok"
                        disabled={isUpdating}
                        onClick={() => {
                            if (statusMessage != '') {
                                closeDeviceUpdateModal();
                                return;
                            }
                            if (devicesContext.previewDevice == null) {
                                return;
                            }
                            const validSet = ValidUpdateDeviceStateArray.get(devicesContext.previewDevice.SN);
                            if (validSet == null) {
                                console.error("Unable to find device's valid update set");
                                // todo: report this
                                return;
                            }

                            const hasValidConnectionState = Array.from(validSet).every((item) =>
                                devicesContext.previewDevice!.StateArray.includes(item),
                            );

                            if (hasValidConnectionState == false) {
                                setConfirmationDialogIsOpen(true);

                                confirmationResolve.current = (result) => {
                                    setConfirmationDialogIsOpen(false);
                                    if (result == false) {
                                        return;
                                    }
                                    beginFirmwareUpdates();
                                };
                            } else {
                                beginFirmwareUpdates();
                            }
                        }}
                    >
                        {translate('Dialog_FirmwareUpdate_OkButton', 'Ok')}
                    </button>,
                ]}
            >
                {statusMessage != '' ? (
                    <div className={style.statusMessage}>{statusMessage}</div>
                ) : (
                    <ul className={style.tasks}>{getDeviceUpdateTasks(componentState.deviceSN)}</ul>
                )}
            </ContentDialogComponent>
            <ContentDialogComponent
                className="confirmation"
                title={translate('Dialog_UpdateManager_PreUpdateWarning_Title', 'Warning')}
                icon={confirmationDialogData.icon}
                open={confirmationDialogIsOpen}
                actions={[
                    <button
                        type="button"
                        key="Button_Cancel"
                        onClick={() => {
                            if (confirmationResolve.current != null) {
                                confirmationResolve.current(false);
                            }
                            setConfirmationDialogIsOpen(false);
                        }}
                    >
                        {translate('Button_Cancel', 'Cancel')}
                    </button>,
                    <button
                        type="button"
                        key="Button_Ok"
                        onClick={() => {
                            if (confirmationResolve.current != null) {
                                confirmationResolve.current(true);
                            }
                            setConfirmationDialogIsOpen(false);
                        }}
                    >
                        {translate('Button_Ok', 'Ok')}
                    </button>,
                ]}
            >
                <section>
                    {translate(
                        'Dialog_UpdateDevice_PreUpdateWarning_Description',
                        'The selected device does not have both its cable and wireless receiver plugged in. Are you sure you want to continue?',
                    )}
                </section>
            </ContentDialogComponent>
        </div>
    );
}

export default UpdateDeviceComponent;
