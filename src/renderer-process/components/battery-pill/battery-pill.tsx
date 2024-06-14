import React, { useEffect, useState } from 'react';
import { Color } from '../component.types';
import { IconColor, IconSize, IconType } from '../icon/icon.types';
import Icon from '../icon/icon';
import styles from './battery-pill.module.css';


export interface BatteryPillProps {
  value?: number;
  valueColor?: IconColor;
  iconColor?: IconColor;
  iconSecondaryColor?: IconColor;
  size?: IconSize;
  isCharging?: boolean;
  showValue?: boolean;

}
const BatteryPill: React.ElementType<BatteryPillProps> = ({ iconColor = Color.Base50, size = IconSize.Small, isCharging = false, showValue = true, value = 100 }) => {

  let iconType = IconType.BatteryLow;
  if (value > 33 && value <= 66) {
    iconType = IconType.BatteryMedium;
  } else if (value > 66) {
    iconType = IconType.BatteryHigh;
  }

  return (
    <div className={`${styles['battery-pill']}${(isCharging == true && value < 100) ? ` charging` : ''}`}>
      <Icon size={IconSize.Small} type={iconType} color={iconColor} />
      {showValue && (
        <div className={styles['value']}>
          { (isNaN(value)) ? undefined : `${value}%` }
        </div>
      )}
    </div>
  );

};

export default BatteryPill;
