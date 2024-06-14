import React, { useEffect, useState } from 'react';
import { Color } from '../component.types';
import { IconColor, IconSize, IconType } from '../icon/icon.types';
import Icon from '../icon/icon';
import { useTranslate } from '@renderer/contexts/translations.context';
import styles from './firmware-pill.module.css';

export enum FirmwareUpdateStatus {
    UpToDate,
    HasUpdate,
    Updating,
    UpdateFailed,
}

export interface FirmwarePillProps {
    version?: string;
    versionColor?: IconColor;
    updateStatus?: FirmwareUpdateStatus;
    iconColor?: IconColor;
    iconSecondaryColor?: IconColor;
    size?: IconSize;
    updateOnClick?: (event?) => void | Promise<void>;
}
const FirmwarePill: React.ElementType<FirmwarePillProps> = ({
    iconColor = Color.Base50,
    size = IconSize.Small,
    version = '0.0.0.0',
    updateStatus = FirmwareUpdateStatus.UpToDate,
    updateOnClick,
}) => {
    const translate = useTranslate();

  let iconType = IconType.SuccessCheck;
  let updateStatusText = translate('Device_Home_Label_UpToDate', 'Up to Date');
  iconColor = Color.GreenDark60;
  if (updateStatus == FirmwareUpdateStatus.HasUpdate) {
      updateStatusText = translate('Device_Home_Label_UpdateAvailable', 'Update Available');
      iconType = IconType.ExclamationPoint;
      iconColor = Color.Glorange60;
  } else if (updateStatus == FirmwareUpdateStatus.Updating) {
      updateStatusText = translate('Device_Home_Label_Updating', 'Updating...');
      iconType = IconType.CircleArrow;
      iconColor = Color.Glorange60;
  } else if (updateStatus == FirmwareUpdateStatus.UpdateFailed) {
      updateStatusText = translate('Device_Home_Label_UpdateFailed', 'Update Failed');
      iconType = IconType.FailCross;
      iconColor = Color.RedDark60;
  }

  return (
    <div className={styles['firmware-pill']}>
      <span className={styles['version']}>
        <span className="title">{translate('Device_Home_Label_Firmware', 'Firmware')}</span>
        <span className="value">{version}</span>
      </span>
      <button className={`${styles['update']}${(updateStatus == FirmwareUpdateStatus.HasUpdate) ? ` ${styles['has-update']}` : ''}`}
      onClick={(event) =>
      {
        if(updateOnClick != null)
        {
          updateOnClick(event);
        }
      }}>
        <span className="status">{updateStatusText}</span>
        <Icon className={(updateStatus == FirmwareUpdateStatus.Updating) ? `${styles['updating']}` : undefined } size={size} type={iconType} color={iconColor} />
      </button>
    </div>
  );
};

export default FirmwarePill;
