import './mock-device-provider.component.css'

import {IPCService} from "../../services/ipc.service";
import {MessageChannels} from "../../../common/channel-maps/MessageChannels";
import {useState, useCallback, useEffect} from 'react';

function MockDeviceProviderComponent(props: any) {
    const {onDevicesLoaded, onMockDeviceConnected} = props;
    const gatherEnabled = false;

    const [devices, setDevices] = useState<any>();
    const [selectedDevice, setSelectedDevice] = useState(null);

    const connectHandler = useCallback(() => handleConnect(selectedDevice), [selectedDevice]);
    const gatherHandler = useCallback(() => handleGather(setDevices), []);
    const disconnectHandler = useCallback(() => handleDisconnect(selectedDevice), [selectedDevice]);
    const disconnectAllHandler = useCallback(() => handleDisconnectAll(), []);

    const handleApiCall = async (channel: string, payload: never[] | undefined) => {
        const res = await IPCService.invoke(channel, payload);
        if (!res.success) {
            console.error(res);
        } else {
            return res.data;
        }
    }

    const handleConnect = async (device) => {
        const response = await handleApiCall(MessageChannels.DeviceChannel.MockDeviceRegister, device);
        if (response.success) {
            onMockDeviceConnected(device);
            console.log("Device connected successfully!");
        } else {
            console.error("Failed to connect device!");
        }
    }

    const handleGather = async (setDevices) => {
        await handleApiCall(MessageChannels.DeviceChannel.MockDeviceCollect, undefined)
            .then(data => setDevices(data));
    }

    const handleLoad = async () => {
        const devices = await handleApiCall(MessageChannels.DeviceChannel.MockDeviceLoad, undefined)
        setDevices(devices);
        onDevicesLoaded(devices);
    }

    const handleDisconnect = async (device) => {
        const response = await handleApiCall(MessageChannels.DeviceChannel.MockDeviceUnregister, device);
        if (response.success) {
            console.log("Device connected successfully!");
        } else {
            console.error("Failed to connect device!");
        }
    }

    const handleDisconnectAll = async () => {
        handleApiCall(MessageChannels.DeviceChannel.MockDeviceUnregister, undefined);
    }

    useEffect(() => {
        handleLoad()
    }, [])

    return (<div className='content'>
        <div className="appConfig">
            {devices && (<select onChange={(e) => setSelectedDevice(devices[e.target.selectedIndex])}>
                {devices.map((device, index) => (<option key={index} value={device}>
                    {device.product + ' ' + device.vendorId.toString(16).padStart(4, '0') + ' ' + device.productId.toString(16).padStart(4, '0') + device.path}
                </option>))}
            </select>)}
        </div>
        <div className='appConfig'>
            <button onClick={connectHandler}>connect selected</button>
            <button onClick={disconnectHandler}>disconnect selected</button>
            <button onClick={disconnectAllHandler}>disconnect all</button>
            {gatherEnabled && (<button onClick={gatherHandler}>gather devices</button>)}
        </div>
    </div>)
}

export default MockDeviceProviderComponent
