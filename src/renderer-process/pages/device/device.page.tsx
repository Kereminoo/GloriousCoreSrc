import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LightingManagementPage from '../lighting-management/lighting-management.page';
import './device.page.css';
import DeviceSettingsManagementPage from '../device-settings-management/device-settings-management.page';
import KeybindingManagementPage from '../keybinding-management/keybinding-management.page';
import PerformanceManagementPage from '../performance-management/performance-management.page';
import DPIManagementPage from '../dpi-management/dpi-management.page';
import DeviceHomePage from '../device-home/device-home.page';
import DeviceLightingPreviewComponent from '../../components/device-lighting-preview/device-lighting-preview.component';
import KeyboardKeybindingSelectionComponent
    from '../../components/device-keybinding-selection/keyboard-keybinding-selection.component';
import DeviceLightingSelectionComponent
    from '../../components/device-lighting-selection/device-lighting-selection.component';
import MouseKeybindingSelectionComponent
    from '../../components/device-keybinding-selection/mouse-keybinding-selection.component';
import { useUIContext, useUIUpdateContext } from '../../contexts/ui.context';
import { useDevicesContext, useDevicesManagementContext } from '../../contexts/devices.context';
import { useTranslate } from '../../contexts/translations.context';
import DeviceBreadcrumbsComponent from '../..//components/device-breadcrumbs/device-breadcrumbs.component';
import ActuationManagementPage from '../actuation-management/actuation-management.page';
import AdvancedKeysManagementPage from '../advanced-keys-management/advanced-keys-management.page';
import { UIDevice } from '../../data/ui-device';
import { AppService } from '../../services/app.service';
import MouseHomeDash from '../..//components/device-dash/mouse-home-dash';
import KeyboardActuationBindingSelectionComponent
    from '../..//components/device-keybinding-selection/keyboard-actuation-binding-selection.component';
import KeyboardAdvancedKeybindingSelectionComponent
    from '../../components/device-keybinding-selection/keyboard-advanced-keybinding-selection.component';

import KeyboardHomeDash from '../../components/device-dash/keyboard-home-dash';
import { AdvancedKeyMode } from '../../../common/data/valueC-data';
import { LayoutNode } from 'src/common/data/device-input-layout.data';
import KeyboardKeySelectionComponent
    from '../../components/device-keybinding-selection/keyboard-key-selection.component';
import { IconSize, IconType } from '../../components/icon/icon.types';
import Icon from '../..//components/icon/icon';
import { Color } from '../../components/component.types';

class DeviceManagementData {
    className: string = '';
    tabs: JSX.Element[] = [];
    pages: JSX.Element[] = [];
}

const ManagementSectionIconMap = new Map([
    ['home', IconType.Home],
    ['settings', IconType.CogOutline],
    ['performance', IconType.Speedometer],
    ['lighting', IconType.Lightbulb],
    ['dpi', IconType.LightningBolt],
    ['keybinding', IconType.Keybinding],
    ['actuation', IconType.Actuation],
    ['advanced-keys', IconType.AdvancedKeys],
]);

function DevicePage(props: any) {
    const navigate = useNavigate();
    const { subpage } = useParams();
    const uiContext = useUIContext();
    const devicesContext = useDevicesContext();
    const { savePreviewDevice, resetPreviewDevice, setCurrentProfileLayer, setvalueCAdvancedKeys } =
        useDevicesManagementContext();
    const translate = useTranslate();

    const { setDisplayNavigation, update, setvalueCState, setvalueCAdvancedKeyBindingMode } = useUIUpdateContext();

    const [deviceClassName, setDeviceClassName] = useState('');
    const [scaleClass, setScaleClass] = useState('scale-1');
    const [renderDimensions, setRenderDimensions] = useState<{
        width: number;
        height: number;
        renderImagesGap: number;
    }>({ width: 0, height: 0, renderImagesGap: 0 });

    const [moreActionsIsOpen, setMoreActionsIsOpen] = useState(false);

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            navigate('/');
            return;
        }
        setDeviceClassName(devicesContext.previewDevice.devicename.toLowerCase().split(' ').join('-').replace('%', ''));
    }, [devicesContext.previewDevice]);

    useEffect(() => {
        const handler = () => {
            console.log('handler');
            updateScale();
        };
        window.addEventListener('resize', handler);

        updateScale();

        return () => window.removeEventListener('resize', handler);
    }, []);

    const updateScale = () => {
        if (devicesContext.previewDevice == null) {
            return;
        }
        let currentScaleIndex = 0;
        for (let i = 0; i < devicesContext.previewDevice.productScales.length; i++) {
            const scale = devicesContext.previewDevice.productScales[i];
            if (window.innerWidth > scale.breakpoint.width || window.innerHeight > scale.breakpoint.height) {
                currentScaleIndex = i;
            }
        }
        console.log(currentScaleIndex);
        if (currentScaleIndex == 0) {
            setScaleClass('');
        }
        if (currentScaleIndex == 1) {
            setScaleClass('scale-1');
        }
        if (currentScaleIndex == 2) {
            setScaleClass('scale-2');
        }
        if (currentScaleIndex == 3) {
            setScaleClass('scale-3');
        }
        if (currentScaleIndex == 4) {
            setScaleClass('scale-4');
        }
        const width = devicesContext.previewDevice.productScales[currentScaleIndex].imageSize.width;
        const height = devicesContext.previewDevice.productScales[currentScaleIndex].imageSize.height;
        const renderImagesGap = 50;
        setRenderDimensions({ width, height, renderImagesGap });
    };

    const handleNodeClick = useCallback(
        (element: { nodeDefinition: LayoutNode; index: number }) => {
            uiContext.valueCState.advancedKeysTypeSelectionOpened = true;
            if (uiContext.valueCState.advancedKeysBindingMode == AdvancedKeyMode.None) {
                uiContext.valueCState.advancedKeysSelectedKeyTmp = element.nodeDefinition;
                setvalueCState(uiContext.valueCState);
            } else {
                uiContext.valueCState.advancedKeysBindingMode = AdvancedKeyMode.None;
                setvalueCAdvancedKeyBindingMode(uiContext.valueCState);
                uiContext.valueCState.advancedKeysSelectedKeyTmp = element.nodeDefinition;
                setvalueCState(uiContext.valueCState);
            }
        },
        [uiContext.valueCState.advancedKeysSelectedKeyTmp],
    );

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }

        // setRenderDimensions(getRenderDimensions(devicesContext.previewDevice));
    }, [devicesContext.previewDevice]);

    const getRenderDimensions = (device: UIDevice) => {
        const imageRenderWidth = device.deviceRenderAttributes.large.width; // * device.imageAdjustments.scale;
        const imageRenderHeight = device.deviceRenderAttributes.large.height; // * device.imageAdjustments.scale;

        const renderImagesGap = 50;
        let width = imageRenderWidth;
        let height = imageRenderHeight;

        // for (let i = 0; i < device.lightingEffectRenderAttributes.length; i++) {
        //   const attributes = device.lightingEffectRenderAttributes[i];
        //   width += attributes.width;
        //   if (attributes.height > height) {
        //     height = attributes.height;
        //   }
        // }

        // if (device.lightingEffectRenderAttributes.length > 0) {
        //   width += (device.lightingEffectRenderAttributes.length - 1) * renderImagesGap;
        // }

        return { width, height, renderImagesGap };
    };

    const renderStyle = {
        '--render-width': `${renderDimensions.width}px`,
        '--render-height': `${renderDimensions.height}px`,
        '--render-images-gap': `${renderDimensions.renderImagesGap}px`,
        '--showcase-margin-top': '80px',
    } as React.CSSProperties;

    const focusStyle = {
        // '--translation': `${devicesContext.previewDevice?.imageAdjustments.translation.x}px ${devicesContext.previewDevice?.imageAdjustments.translation.y}px`,
        '--focus-z-index': `${uiContext.valueCState.advancedKeysTypeSelectionOpened ? 7 : 'initial'}`,
    } as React.CSSProperties;

    const lightingPreviewStyle = {
        '--lighting-color': 'var(--brand-color-1)',
        '--webkit-mask-url': devicesContext.previewDevice?.deviceRenderAttributes.mask
            ? `url(${import.meta.env.PROD ? '.' : ''}${devicesContext.previewDevice?.deviceRenderAttributes.mask.path})`
            : '',
    } as React.CSSProperties;

    const deviceCategoryName = devicesContext.previewDevice?.deviceCategoryName;
    const isKeyboardOrNumpad = ['Keyboard', 'Numpad'].includes(deviceCategoryName ?? '');
    const isMouse = deviceCategoryName == 'Mouse';

    // const allowSelectionPointerEvents = (DevicesAdapter.isvalueC(devicesContext.previewDevice?.SN) &&
    // (
    //   uiContext.valueCState.advancedKeysShowSelector
    //   || uiContext.valueCState.advancedKeysShowSelector
    // ));

    // const resetManagementPages = () =>
    // {
    //   uiState_onUpdate(new UIState());

    // const handleSave = async (saveType: 'lighting'|'keybinding'|'performance') =>
    // {
    //   // console.log("handleSave()", device, previewDevice, keyboardData);
    //   const success = await DevicesAdapter.saveDeviceData(device, previewDevice, saveType);
    // }
    const isMouseHomePage = devicesContext.previewDevice?.deviceCategoryName === 'Mouse'; //&& (subpage !== 'keybinding')
    const isKeyboardHomePage =
        devicesContext.previewDevice?.deviceCategoryName === 'Keyboard' &&
        !['keybinding', 'actuation', 'advanced-keys'].includes(subpage ?? '');

    return (
        <div className={`device ${deviceClassName} ${scaleClass}`}>
            <div className={`showcase`} style={renderStyle}>
                {isMouseHomePage ? (
                    <MouseHomeDash />
                ) : (
                    <KeyboardHomeDash
                        onLayerClick={(layerIndex: number) => {
                            setCurrentProfileLayer(layerIndex);
                        }}
                    />
                )}
                <div className="buffer">
                    <div className="focus" style={focusStyle}>
                        <div className="lighting-preview" style={lightingPreviewStyle}>
                            <DeviceLightingPreviewComponent />
                        </div>
                        <div className="renders">
                            <img
                                draggable={false}
                                className="render large"
                                alt={devicesContext.previewDevice?.devicename}
                                src={devicesContext.previewDevice?.deviceRenderAttributes.large.path}
                            />
                            {subpage == 'lighting' && devicesContext.previewDevice?.lightingEffectRenderAttributes.map(
                                (preloadedImage, index) => {
                                    return (
                                        <img
                                            draggable={false}
                                            key={index}
                                            className="render lighting-view"
                                            src={preloadedImage.path}
                                        />
                                    );
                                },
                            )}
                        </div>
                        {(subpage == 'keybinding' && devicesContext.previewDevice?.deviceCategoryName == 'Keyboard') ||
                        devicesContext.previewDevice?.deviceCategoryName == 'Numpad' ? (
                            <KeyboardKeybindingSelectionComponent />
                        ) : subpage == 'lighting' &&
                          (devicesContext.previewDevice?.deviceCategoryName == 'Keyboard' ||
                              devicesContext.previewDevice?.deviceCategoryName == 'Numpad') &&
                          uiContext.lightSettingMode == 'per-key' ? (
                            <DeviceLightingSelectionComponent />
                        ) : subpage == 'actuation' ? (
                            <KeyboardActuationBindingSelectionComponent />
                        ) : subpage == 'advanced-keys' ? (
                            <KeyboardKeySelectionComponent
                                selectedNodes={
                                    uiContext.valueCState.advancedKeysSelectedKeyTmp
                                        ? [uiContext.valueCState.advancedKeysSelectedKeyTmp]
                                        : []
                                }
                                className={`actuation-selection keyboard ${uiContext.valueCState.advancedKeysTypeSelectionOpened ? 'selector-active' : ''}`}
                                onNodeClick={handleNodeClick}
                            />
                        ) : (
                            <></>
                        )}
                        {isMouse && subpage == 'keybinding' && (
                            <div className="keybinding-selection mouse">
                                <MouseKeybindingSelectionComponent />
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className="showcase-actions"
                    style={{
                        display: ['actuation', 'advanced-keys'].includes(subpage) ? 'grid' : 'none',
                        pointerEvents: 'none'
                    }}
                >
                    {/* {isKeyboardOrNumpad && subpage === 'actuation' && <KeyboardActuationBindingSelectionComponent />} */}
                    {isKeyboardOrNumpad && subpage === 'advanced-keys' && (
                        <KeyboardAdvancedKeybindingSelectionComponent />
                    )}
                </div>
            </div>
            <div className="management">
                <ul className="tabs">
                    {devicesContext.previewDevice?.managementSections.map((sectionData, index) => {
                        let tabLabel = translate(sectionData.translationKey, '');
                        let clickPath = `/${sectionData.optionKey}`;
                        if (sectionData.optionKey == 'home') {
                            tabLabel = translate(
                                `Device_Tabs_Label_Home_${devicesContext.previewDevice?.deviceCategoryName}`,
                                translate('Device_Tabs_Label_Home_UnknownDevice', 'My Device'),
                            );
                            clickPath = '';
                        }

                        const classes =
                            subpage == null || subpage == ''
                                ? sectionData.optionKey == 'home'
                                    ? 'current-section'
                                    : ''
                                : subpage == sectionData.optionKey
                                  ? 'current-section'
                                  : '';

                        return (
                            <li key={index}>
                                <a
                                    className={classes}
                                    onClick={() => {
                                        navigate(`/device${clickPath}`);
                                        // resetManagementPages();
                                    }}
                                >
                                    <Icon
                                        className="tab-icon"
                                        type={ManagementSectionIconMap.get(sectionData.optionKey)!}
                                        size={IconSize.Small}
                                        color={Color.Base20}
                                    />
                                    <span className="label">{tabLabel}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
                <div className="content">
                    <DeviceBreadcrumbsComponent />
                    <div className={`page ${subpage == undefined ? 'home' : subpage}`}>
                        {subpage == undefined ? (
                            <DeviceHomePage />
                        ) : subpage == 'settings' ? (
                            <DeviceSettingsManagementPage />
                        ) : subpage == 'performance' ? (
                            <PerformanceManagementPage />
                        ) : subpage == 'lighting' ? (
                            <LightingManagementPage />
                        ) : subpage == 'dpi' ? (
                            <DPIManagementPage />
                        ) : subpage == 'keybinding' ? (
                            <KeybindingManagementPage />
                        ) : subpage == 'actuation' ? (
                            <ActuationManagementPage />
                        ) : subpage == 'advanced-keys' ? (
                            <AdvancedKeysManagementPage />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="actions">
                        <div className={`more-actions-menu${moreActionsIsOpen ? ' open' : ''}`}>
                            <a
                                onClick={() => {
                                    resetPreviewDevice();
                                    setMoreActionsIsOpen(false);
                                }}
                            >
                                <span className="label">
                                    {translate('Device_MoreActions_Menu_ResetToDefault', 'Reset to Default')}
                                </span>
                            </a>
                            <a
                                onClick={() => {
                                    setDisplayNavigation(!uiContext.displayNavigation);
                                    setMoreActionsIsOpen(false);
                                }}
                            >
                                <span className="label">
                                    {uiContext.displayNavigation == false
                                        ? translate('Menu_MoreActions_Reveal', 'Reveal Left Navigation')
                                        : translate('Menu_MoreActions_Hide', 'Hide Left Navigation')}
                                </span>
                            </a>
                            <a
                                onClick={() => {
                                    const deviceSlug = 'MO2W';
                                    const url = `https://www.gloriousgaming.com/pages/support?guide=${deviceSlug}`;
                                    AppService.openHyperlink(url);
                                    setMoreActionsIsOpen(false);
                                }}
                            >
                                <span className="label">
                                    {translate('Menu_MoreActions_ProductGuide', 'Product Guide')}
                                </span>
                            </a>
                            <a
                                onClick={() => {
                                    const deviceSlug = 'MO2W';
                                    // const url = `https://www.gloriousgaming.com/pages/support?guide=${deviceSlug}`;
                                    const url = `https://glorious.ladesk.com/098776-Model-O-2-Wireless`;
                                    AppService.openHyperlink(url);
                                    setMoreActionsIsOpen(false);
                                }}
                            >
                                <span className="label">
                                    {translate('Menu_MoreActions_ProductSupport', 'Product Support')}
                                </span>
                            </a>
                            <a
                            className='local-profile-import'
                                onClick={() => {
                                    setMoreActionsIsOpen(false);
                                }}
                            >
                                <span className='label'>{translate('Menu_MoreActions_ProfileImport', 'Local Profile Import')}</span>
                                <span className='label'>{translate('Menu_MoreActions_ProfileImport', 'Coming Soon')}</span>
                            </a>
                        </div>
                        <div className="more-actions-container">
                            <button
                                className="action more-actions"
                                onClick={() => {
                                    setMoreActionsIsOpen(!moreActionsIsOpen);
                                }}
                            >
                                <div className="display">
                                    <Icon type={IconType.VerticalEllipses} size={IconSize.Large} color={Color.Base50} />
                                </div>
                                <div className="label">{translate('Button_MoreActions', 'More Actions')}</div>
                            </button>
                        </div>
                        {/* <button
                            className="action undo"
                            title="Disabled"
                            onClick={async () => {
                                console.log('undo');
                            }}
                        >
                            <div className="display" style={{ backgroundColor: `var(${Color.Base80})` }}>
                                <Icon type={IconType.Undo} size={IconSize.Small} color={Color.Base60} />
                            </div>
                            <div className="label" style={{ color: `var(${Color.Base60})` }}>
                                {translate('Button_Undo', 'Undo')}
                            </div>
                        </button> */}
                        <button
                            className="action save"
                            onClick={() => {
                                let saveType: 'lighting' | 'keybinding' | 'performance' = 'performance';

                                if (subpage == 'lighting') {
                                    saveType = 'lighting';
                                } else if (subpage == 'keybinding') {
                                    saveType = 'keybinding';
                                } else if (subpage == 'advanced-keys') {
                                    saveType = 'keybinding';
                                    uiContext.valueCState.advancedKeysBindingMode = AdvancedKeyMode.None;
                                    uiContext.valueCState.advancedKeysSelectedKeyTmp = null;
                                    uiContext.valueCState.advancedKeysAssignedTmp = {
                                        toggle: null,
                                        modTapHold: null,
                                        modTapPress: null,
                                        dynamicKeystrokes: null,
                                    };
                                    uiContext.valueCState.advancedKeysSelectedTriggerPoint = null;
                                    update(uiContext);
                                }

                                savePreviewDevice();
                            }}
                        >
                            <div
                                className={`display${uiContext.isSaving || uiContext.showingSaveSuccess ? ' outline' : ''}`}
                            >
                                {uiContext.isSaving ? (
                                    <Icon
                                        type={IconType.SaveCheckRounded}
                                        size={IconSize.Medium}
                                        color={Color.Base20}
                                    />
                                ) : uiContext.showingSaveSuccess ? (
                                    <Icon
                                        type={IconType.SaveCheckRounded}
                                        size={IconSize.Medium}
                                        color={Color.GreenDark60}
                                    />
                                ) : (
                                    <Icon
                                        type={IconType.SaveCheckRounded}
                                        size={IconSize.Medium}
                                        color={Color.Base70}
                                    />
                                )}
                            </div>
                            <div className="label">{translate('Button_Save', 'Save')}</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DevicePage;
