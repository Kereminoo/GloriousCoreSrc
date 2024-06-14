const ICONS_PATH = '/images/icons';
export const ICONS = {
    dynamicKeystroke: 'dynamic_keystroke.svg',
    modTap: 'mod_tap.svg',
    toggleKey: 'toggle_key.svg',

    rightArrow: 'right_arrow.svg',
    rightArrowOrange: 'right_arrow_orange.svg',
    keystrokeSignle: 'dynamic_keystroke_single_activation.svg',
    keystrokeContinuous: 'dynamic_keystroke_continuous_activation.svg',
    delete: 'delete.svg',
    deleteHover: 'delete_hover.svg',

    // Profile icons
    deviceConnected: 'device_connected.svg',
    greenBatteryPower: 'green_battery_power.svg',
    greenConfirmation: 'green_confirmation.svg',
    activeProfile: 'active_profile.svg',
    cloudNotSynced: 'cloud_not_synced.svg',
    localProfileNotSynced: 'local_profile_not_synced.svg',
    applyProfile: 'apply_profile.svg',
    deactivateProfile: 'delete.svg',
    profileInfo: 'profile_info.svg',
    cloudActive: 'cloud_active.svg',
    closeModal: 'close.svg',
    closeModalHover: 'close_hover.svg'
};

export const iconSrc = (fileName: string) => `${ICONS_PATH}/${fileName}`;
