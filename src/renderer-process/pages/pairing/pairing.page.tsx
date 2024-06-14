import { useEffect, useState } from 'react';
import './pairing.page.css';
import OptionSelectComponent from '@renderer/components/option-select/option-select.component';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { DevicePairableDevices } from '@renderer/adapters/devices.adapter';

function PairingPage(props: any) {
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [receiverIsConnected, setReceiverIsConnected] = useState(false);

    const canPair = () => {
        return selectedDevice != null && receiverIsConnected == true;
    };

    const devicesContext = useDevicesContext();
    const translate = useTranslate();

    const [pairableDevices, setPairableDevices] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (devicesContext.devices == null) {
            return;
        }

        const pairable: { value: string; label: string }[] = [
            { value: '-1', label: translate('Pairing_DeviceSelect_DefaultOption', 'Select Mouse')! },
        ];
        for (let i = 0; i < devicesContext.devices.length; i++) {
            const device = devicesContext.devices[i];
            if (DevicePairableDevices.get(device.SN) != null && DevicePairableDevices.get(device.SN)!.length > 0) {
                pairable.push({ value: device.SN, label: translate(`DeviceName_${device.SN}`, device.devicename)! });
            }
        }

        setPairableDevices(pairable);
    }, [devicesContext.devices]);

    return (
        <div className="pairing">
            <h1>{translate('Pairing_Title', 'GLORIOUS PAIRING UTILITY')}</h1>
            <div className="instructions">
                <header>
                    <div className="title">{translate('Pairing_List_Heading', 'Pairing Steps')}</div>
                </header>
                <ol>
                    <li>{translate('Pairing_List_Step1', 'Unplug all Glorious mouse cables & receivers.')}</li>
                    <li>
                        {translate(
                            'Pairing_List_Step2',
                            "Plug in the mouse you'd like to pair via USB cable. Plug in the wireless receiver.",
                        )}
                    </li>
                    <li>{translate('Pairing_List_Step3', 'Select the mouse being paired from the utility below.')}</li>
                    <li>
                        {translate(
                            'Pairing_List_Step4',
                            'When both the USB and Wireless receiver have been reconnected, click the Pair button..',
                        )}
                    </li>
                </ol>
            </div>
            <div className="panels">
                <div className="panel device-connection">
                    <div className="device-image"></div>
                    <div className="right">
                        <header>
                            <div className="title">{translate('Pairing_Device_Title', 'Mouse')}</div>
                        </header>
                        <div className="status">
                            {selectedDevice != null && selectedDevice.hasWiredConnection == true
                                ? translate('Pairing_Connection_Connected', 'Connected')
                                : translate('Pairing_Connection_Disconnected', 'Disconnected')}
                        </div>
                        <OptionSelectComponent options={pairableDevices} />
                    </div>
                </div>
                <div className="panel receiver-connection">
                    <div className="device-image"></div>
                    <div className="right">
                        <header>
                            <div className="title">{translate('Pairing_Receiver_Title', 'Dongle')}</div>
                        </header>
                        <div className="status">
                            {receiverIsConnected == true
                                ? translate('Pairing_Connection_Connected', 'Connected')
                                : translate('Pairing_Connection_Disconnected', 'Disconnected')}
                        </div>
                    </div>
                </div>
            </div>
            <div className="actions">
                <button type="button" className="pair" disabled={!canPair()}>
                    {translate('Button_Pairing_Pair', 'Pair')}
                </button>
            </div>
            <div className="help">
                <p>{translate('Pairing_DeviceSelect_DeviceNotFoundPrompt', "Don't see your mouse on the list?")}</p>
                <p>
                    {translate(
                        'Pairing_DeviceSelect_ClassicSupportDescription',
                        'Please refer to the following link for classic device support:',
                    )}{' '}
                    <a
                        onClick={() => {
                            console.log('todo');
                        }}
                    >
                        {translate('Pairing_DeviceSelect_ClassicPairingUtilityLink', 'Classic Pairing Utility.')}
                    </a>
                </p>
            </div>
        </div>
    );
}

export default PairingPage;
