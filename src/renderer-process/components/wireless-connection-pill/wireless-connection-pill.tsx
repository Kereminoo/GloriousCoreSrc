import React, { useEffect, useState } from 'react';
import { Color } from '../component.types';
import { IconColor, IconSize, IconType } from '../icon/icon.types';
import Icon from '../icon/icon';
import { useTranslate } from '../../contexts/translations.context';
import styles from './wireless-connection-pill.module.css';

export enum WirelessConnectionStrength
{
  Disconnected,
  Weak,
  Medium,
  Strong,
}


export interface WirelessConnectionPillProps 
{
  value?: number;
  valueColor?: IconColor;
  iconColor?: IconColor;
  iconSecondaryColor?: IconColor;
  size?: IconSize;
  connectionStrength?: WirelessConnectionStrength;

}
const WirelessConnectionPill: React.ElementType<WirelessConnectionPillProps> = ({ iconColor = Color.Base50, size = IconSize.Small, connectionStrength = WirelessConnectionStrength.Disconnected }) => {

  const translate = useTranslate();

  let iconType = IconType.WirelessConnectionDisconnected;
  let statusKey = 'Device_Home_Dash_Label_ConnectionLost';
  if (connectionStrength == WirelessConnectionStrength.Weak) 
  {
    iconType = IconType.WirelessConnectionWeak;
    statusKey = 'Device_Home_Dash_Label_ConnectionUnstable';
  } else if (connectionStrength == WirelessConnectionStrength.Medium) {
    iconType = IconType.WirelessConnectionMedium;
    statusKey = 'Device_Home_Dash_Label_Connected';
  } else if (connectionStrength == WirelessConnectionStrength.Strong) {
    iconType = IconType.WirelessConnectionStrong;
    statusKey = 'Device_Home_Dash_Label_Connected';
  }


  return (
    <div className={styles['wireless-connection-pill']}>
      <div className="status">
        {translate(statusKey, "Connected")}
      </div>
      <Icon size={IconSize.Small} type={iconType} color={iconColor} />
    </div>
  );

};

export default WirelessConnectionPill;
