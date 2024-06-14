import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import { BindingTypes_ButtonPress } from '@renderer/data/binding-type';
import { ShortcutTypes } from '@renderer/data/shortcut-option';
import { WindowsFunctionShortcuts } from '@renderer/data/windows-shortcut-option';
import { useParams } from 'react-router';
import { AdvancedKeyMode } from '../../../../src/common/data/valueC-data';

function DeviceBreadcrumbsComponent(props: any) {
    const { subpage } = useParams();

    // const devicesContext = useDevicesContext();
    const uiContext = useUIContext();
    const { update } = useUIUpdateContext();
    const devicesContext = useDevicesContext();
    const { getCurrentProfile, getCurrentLegacyLayerIndex } = useDevicesManagementContext();

    const translate = useTranslate();
    const showLegacyCrumb: boolean = false;

    // old keyboard devices
    // these layers are the actual profile objects all settings are being saved to;
    // that's why these always show up, whereas newer layers only show up when relevant.
    const legacyLayerBreadcrumb =
        devicesContext.previewDevice != null && devicesContext.previewDevice.ModelType == 2 && showLegacyCrumb ? (
            <a className="disabled">
                {translate('Device_Breadcrumb_Label_LegacyLayer', 'Layer')} {(getCurrentLegacyLayerIndex() ?? 0) + 1}
            </a>
        ) : null;

    const hasLightingBreadcrumbs = subpage == 'lighting' && uiContext.lightSettingMode != 'none';
    const hasKeybindingBreadcrumbs =
        subpage == 'keybinding' &&
        uiContext.keybindSelectedBindingType != null &&
        uiContext.keybindSelectedBindingType.optionKey != 'none';
    const hasAdvancedKeysBreadcrumbs =
        subpage == 'advanced-keys' && uiContext.valueCState.advancedKeysBindingMode != AdvancedKeyMode.None;
    const homeBreadcrumb = hasLightingBreadcrumbs ? (
        <a
            onClick={() => {
                uiContext.lightSettingMode = 'none';
                update(uiContext);
            }}
        >
            {translate('Device_Breadcrumb_Label_LightingHome', 'Lighting Home')}
        </a>
    ) : hasKeybindingBreadcrumbs ? (
        <a
            onClick={() => {
                uiContext.keybindSelectedBindingType = BindingTypes_ButtonPress[0];
                update(uiContext);
            }}
        >
            {translate('Device_Breadcrumb_Label_KeybindingHome', 'Keybinding Home')}
        </a>
    ) : hasAdvancedKeysBreadcrumbs ? (
        <a
            onClick={() => {
                uiContext.valueCState.advancedKeysBindingMode = AdvancedKeyMode.None;
                uiContext.valueCState.advancedKeysSelectedKeyTmp = null;
                update(uiContext);
            }}
        >
            {translate('Device_Breadcrumb_Label_AdvancedKeysHome', 'Advanced Keys Home')}
        </a>
    ) : null;

    // model I and new keyboard devices
    const layerBreadcrumb =
        devicesContext.previewDevice?.SN == '0x093A0x821A' || devicesContext.previewDevice?.SN == '0x320F0x831A' ? (
            <></>
        ) : null;

    const processBreadcrumbs =
        subpage == 'keybinding' &&
        uiContext.keybindSelectedBindingType?.optionKey == 'shortcuts' &&
        uiContext.keybindSelectedShortcutType != null &&
        uiContext.keybindSelectedShortcutType?.optionKey != 'none' ? (
            <a
                onClick={() => {
                    uiContext.keybindSelectedShortcutType = ShortcutTypes[0];
                    uiContext.keybindSelectedShortcutWindowsOption = WindowsFunctionShortcuts[0];
                    update(uiContext);
                }}
            >
                {translate('Device_Breadcrumb_Label_Shortcuts', 'Shortcuts')}
            </a>
        ) : null;

    return (
        <div className="breadcrumbs">
            {legacyLayerBreadcrumb}
            {legacyLayerBreadcrumb != null && homeBreadcrumb != null ? '>' : null}
            {homeBreadcrumb}
            {homeBreadcrumb != null && layerBreadcrumb != null ? '>' : null}
            {layerBreadcrumb}
            {homeBreadcrumb != null && processBreadcrumbs != null ? '>' : null}
            {processBreadcrumbs}
        </div>
    );
}

export default DeviceBreadcrumbsComponent;
