import { useTranslate } from '@renderer/contexts/translations.context';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { ICONS, iconSrc } from '@renderer/utils/icons';
import './device-profile-info-modal.css';
import { useAppDataContext } from '../../contexts/app-data.context';
import { useMemo } from 'react';

const DeviceProfileInfoModal = ({ profile, deviceName, isActive, toggleModal }) => {
    const translate = useTranslate();
    const appDataContext = useAppDataContext();
    const handleModalContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const modalDetails = useMemo(() => {
        if (!profile) return { pollingRate: '', lightingEffect: '', lastUpdated: '' };
        return {
            pollingRate: profile.pollingrate ?? profile.performance?.pollingrate ?? '',
            lightingEffect: translate(profile.light_PRESETS_Data?.translate) ?? '',
            lastUpdated: profile!.lastModified
                ? new Date(profile!.lastModified).toLocaleString(appDataContext.language)
                : '',
        };
    }, [profile]);

    return (
        <div className="profile-modal" onClick={handleModalContentClick}>
            <div className="modal-header">
                <div className="modal-header-first-row">
                    <div className="modal-profile-name">
                        <span>{profile.profileName}</span>
                    </div>
                    <div className="modal-close-action" onClick={toggleModal}>
                        <SVGIconComponent src={iconSrc(ICONS.closeModal)} />
                    </div>
                </div>
                <div className="modal-device-name">
                    <h3>{deviceName}</h3>
                </div>
                <div className="modal-hr"></div>
            </div>
            <div className="modal-details">
                <div className="modal-profile-detail-row">
                    <span>{translate('Device_Home_Label_Profiles_Modal_Status', 'Status')}:</span>
                    <span>
                        {translate(
                            isActive
                                ? 'Device_Home_Label_Profiles_Active_Status'
                                : 'Device_Home_Label_Profiles_Inactive_Status',
                            isActive ? 'Active' : 'Inactive',
                        )}
                    </span>
                </div>
                <div className="modal-profile-detail-row">
                    <span>{translate('Device_Home_Label_Profiles_Modal_Last_Updated', 'Last Updated')}:</span>
                    <span>{modalDetails.lastUpdated}</span>
                </div>
                <div className="modal-profile-detail-row">
                    <span>{translate('Device_Home_Label_Profiles_Modal_Polling_Rate', 'Polling Rate')}:</span>
                    <span>{modalDetails.pollingRate} Hz</span>
                </div>
                {!profile.pollingrate && (
                    <>
                        <div className="modal-profile-detail-row">
                            <span>{translate('Device_Home_Label_Profiles_Modal_Motion_Sync', 'Motion Sync')}:</span>
                            <span>{profile.performance.MotionSyncFlag ? 'On' : 'Off'}</span>
                        </div>
                        <div className="modal-profile-detail-row">
                            <span>DPI:</span>
                            <span>{profile.performance.DpiStage[profile.performance.dpiSelectIndex].value}</span>
                        </div>
                    </>
                )}
                <div className="modal-profile-detail-row">
                    <span>{translate('Device_Home_Label_Profiles_Modal_Lighting_Effect', 'Lighting Effect')}:</span>
                    <span>{modalDetails.lightingEffect}</span>
                </div>
            </div>
        </div>
    );
};

export default DeviceProfileInfoModal;
