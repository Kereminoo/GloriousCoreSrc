import { NavLink, useNavigate } from 'react-router-dom';
import './connected-devices.page.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext } from '@renderer/contexts/ui.context';
import BatteryStatusComponent from '@renderer/components/battery-status/battery-status.component';
import { UIDevice } from '@renderer/data/ui-device';
import BatteryPill from '@renderer/components/battery-pill/battery-pill';
import { IconSize, IconType } from '@renderer/components/icon/icon.types';
import Icon from '@renderer/components/icon/icon';
import { Color } from '@renderer/components/component.types';
import SpinnerComponent from '../../components/spinner/spinner-component';
import SVGImage from '@renderer/components/svg-image/svg-image';
import { SVGImageType } from '@renderer/components/svg-image/svg-image.types';

function ConnectedDevicesPage(props: any) {
    const navigate = useNavigate();
    const translate = useTranslate();

    const uiState = useUIContext();
    const devicesContext = useDevicesContext();
    const { setProductColor } = useDevicesManagementContext();
    const { setPreviewDevice } = useDevicesManagementContext();

    const [currentProductColorMenu_DeviceSN, setCurrentProductColorMenu_DeviceSN] = useState<null | string>(null);

    useEffect(() => {
        console.log('devices changed');
        setCurrentProductColorMenu_DeviceSN(null);
    }, [devicesContext.devices]);

    const isWireless = (pids: string[]) =>
    {
        if(pids.length < 2)
        {
            return false;
        }
        if(pids[1].startsWith('0xB0'))
        {
            return false;
        }

        return true;
    }

    // return <div className="placeholder">
    //     <div className='spinner'></div>
    //     <p>{translate('ConnectedDevices_Label_LoadingDevices', 'Loading Connected Devices...')}</p>
    // </div>
    return (
        <>
            {(uiState.isLoadingDevices == true && (devicesContext.devices == null || devicesContext.devices.length == 0))
            ? <div className="placeholder">
                <SpinnerComponent
                    size={'50px'}
                    labelText={translate(
                        'ConnectedDevices_Label_LoadingDevices',
                        'Loading Connected Devices...',
                    )}
                    labelFontSize={'14px'}
                />
              </div>
            : (devicesContext.devices != null && devicesContext.devices.length > 0)
            ? <ul className="connected-devices">
                {devicesContext.devices.map((device: UIDevice, deviceIndex: number) => {
                    const deviceClassName = device.devicename.toLowerCase().replaceAll(' ', '-').replace('%', '');
                    return (
                        <li
                            key={device.SN + deviceIndex}
                            className={deviceClassName}
                            style={
                                {
                                    '--product-color': device.productColors[device.productColorIndex].hex,
                                } as React.CSSProperties
                            }
                        >
                            <a
                                data-serial-number={device.SN}
                                onClick={() => {
                                    setPreviewDevice(device);
                                    navigate('/device');
                                }}
                            >
                                <header>{translate(`DeviceName_${device.SN}`, device.devicename)}</header>
                                <div
                                    className="color"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        if (currentProductColorMenu_DeviceSN == null) {
                                            setCurrentProductColorMenu_DeviceSN(device.SN);
                                        } else {
                                            setCurrentProductColorMenu_DeviceSN(null);
                                        }
                                    }}
                                >
                                    <div className="preview"></div>
                                    {currentProductColorMenu_DeviceSN == device.SN ? (
                                        <ul className="options">
                                            {device.productColors.map((productColor, productColorIndex) => (
                                                <li
                                                    key={productColorIndex}
                                                    title={translate(productColor.name)}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        setProductColor(device.SN, productColorIndex);
                                                        setCurrentProductColorMenu_DeviceSN(null);
                                                    }}
                                                >
                                                    <div
                                                        className="preview"
                                                        style={
                                                            {
                                                                '--product-color': productColor.hex,
                                                            } as React.CSSProperties
                                                        }
                                                    ></div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="content">
                                    <img
                                        draggable={false}
                                        className="render small"
                                        src={device.deviceRenderAttributes.small.path}
                                        alt={device.devicename}
                                    />
                                    {isWireless(device.pid) && device.batterystatus != null ? (
                                        <BatteryPill
                                            size={IconSize.Small}
                                            value={parseInt(device.batteryvalue as string)}
                                            isCharging={device.batterystatus == 1}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </a>
                        </li>
                    );
                })}
              </ul>
            : <div className="no-devices-message">No supported devices connected</div>
            }
            <div className="word-mark">
                <SVGImage type={SVGImageType.GloriousWordMark} />
            </div>
        </>
    );
}

export default ConnectedDevicesPage;
