import { CSSProperties, useEffect, useMemo, useState } from 'react';
import './navigation.component.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppService } from '@renderer/services/app.service';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { useUIContext } from '@renderer/contexts/ui.context';
import SpinnerComponent from '../spinner/spinner-component';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';
import style from './navigation.component.module.css';

function NavigationComponent(props: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const translate = useTranslate();

    const devicesState = useDevicesContext();
    const { setPreviewDevice } = useDevicesManagementContext();

    const uiContext = useUIContext();

    // const { devices, selectedDevice, onDeviceClick } = props;

    // const [displayDevices, setDisplayDevices] = useState(devicesState.devices);
    const [showDebugUI, setShowDebugUI] = useState(false);

    const updateDebugUI = async () => {
        const showDebug = await AppService.getAppInfo('showDebug');
        setShowDebugUI(showDebug);
    };

    useEffect(() => {
        updateDebugUI();
    }, []);

    const deviceList = useMemo(() => {
        const deviceList = devicesState.devices.map((device, index) => {
            const selected = devicesState.previewDevice?.SN === device.SN;
            const deviceNameClass = device.devicename.toLowerCase().replaceAll(' ', '-').replaceAll('%', '');
            const className = `device ${deviceNameClass}${selected ? (location.pathname != '/settings' ? ' selected' : '') : ''}`;
            return {
                SN: device.SN,
                key: device.SN + index,
                title: device.devicename,
                className: className,
                // iconPaths: device.iconPaths,
                iconType: device.iconType,
                selected: selected,
                ref: device,
            };
        });
        return deviceList;
    }, [devicesState.previewDevice, devicesState.devices, location.pathname]);

    return (
        <nav className={uiContext.displayNavigation == false ? 'hidden' : ''}>
            <header>
                <a
                    className={location.pathname == '/' ? 'selected' : ''}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <Icon type={IconType.GloriousLogo} size={IconSize.Larger} className={style['nav-icon']} />
                </a>
                <a
                    className={location.pathname == '/settings' ? 'selected' : ''}
                    onClick={() => {
                        navigate('/settings');
                    }}
                >
                    <div className="badge">!</div>
                    <Icon type={IconType.CogFilled} size={IconSize.Larger} className={style['nav-icon']} />
                </a>
                {/* <a
                    onClick={() => {
                        navigate('/rgbsync');
                    }}
                >
                    <Icon type={IconType.RGBSync} size={IconSize.Larger} className={style['nav-icon']} />
                </a> */}
            </header>
            <section>
                {deviceList.map((deviceInfo) => {
                    return (
                        <a
                            key={deviceInfo.key}
                            title={deviceInfo.title}
                            className={deviceInfo.className}
                            onClick={() => {
                                setPreviewDevice(deviceInfo.ref);
                                navigate('/device');
                            }}
                        >
                            <div className="badge">!</div>
                            <Icon type={deviceInfo.iconType} size={IconSize.Larger} className={style['nav-icon']} />
                            <span className="label">{translate(`DeviceName_${deviceInfo.SN}`, deviceInfo.title)}</span>
                        </a>
                    );
                })}
                {uiContext.isLoadingDevices == true && (
                    <SpinnerComponent
                        size={'25px'}
                        labelText={translate('ConnectedDevices_Label_LoadingDevices', 'Loading Connected Devices...')}
                        labelFontSize={'8px'}
                    />
                )}
            </section>
            <footer>
                {/* {showDebugUI == true ? (
                    <a
                        onClick={() => {
                            navigate('/debug');
                        }}
                    >
                        <i
                            className="icon debug"
                            title="Debug"
                            style={
                                {
                                    ['--icon-default']: `url(${import.meta.env.PROD ? '.' : ''}/images/icons/debug.svg)`,
                                    ['--icon-selected']: `url(${import.meta.env.PROD ? '.' : ''}/images/icons/debug_active.svg)`,
                                } as CSSProperties
                            }
                        ></i>
                    </a>
                ) : (
                    <></>
                )}
                <a
                    onClick={() => {
                        navigate('/pairing');
                    }}
                >
                    <i
                        className="icon pairing"
                        title="Pairing"
                        style={
                            {
                                ['--icon-default']: `url(${import.meta.env.PROD ? '.' : ''}/images/icons/pairing.svg)`,
                                ['--icon-selected']: `url(${import.meta.env.PROD ? '.' : ''}/images/icons/pairing_active.svg)`,
                            } as CSSProperties
                        }
                    ></i>
                </a> */}
            </footer>
        </nav>
    );
}

export default NavigationComponent;
