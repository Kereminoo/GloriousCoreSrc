export const ICONS_PATH = '/images/icons';
export const ICONS = {
  deviceConnected: 'device_connected.svg',
  greenBatteryPower: 'green_battery_power.svg',
  greenConfirmation: 'green_confirmation.svg',
  layerSelectionTop: 'layer-selection-top.svg',
  layerSelectionTopSelected: 'layer-selection-top_selected.svg',
  layerSelectionCenter: 'layer-selection-center.svg',
  layerSelectionCenterSelected: 'layer-selection-center_selected.svg',
  layerSelectionBottom: 'layer-selection-bottom.svg',
  layerSelectionBottomSelected: 'layer-selection-bottom_selected.svg'
};

export const iconSrc = (fileName: string) => `${ICONS_PATH}/${fileName}`;
