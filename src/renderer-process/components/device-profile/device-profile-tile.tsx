import { useState } from 'react';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useCloudDataUpdateContext } from '@renderer/contexts/cloud.context';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import DeviceProfileInfoModal from './device-profile-info-modal';
import { iconSrc, ICONS } from '@renderer/utils/icons';
import './device-profile-tile.css';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';

interface Profile {
    [key: string]: any;
}
interface ProfileTileProps {
    profile: Profile;
    deviceName: String;
    cloudProfileId?: any;
    isCloudProfile?: Boolean;
    isActive: Boolean;
    isSynced?: Boolean;
    onActivate?: () => void;
    removeLocalProfile?: () => void;
    addLocalProfileFromCloud?: () => void;
}

const ProfileTile: React.FC<ProfileTileProps> = ({
    profile,
    deviceName,
    cloudProfileId,
    isCloudProfile,
    isActive,
    isSynced,
    addLocalProfileFromCloud,
    removeLocalProfile,
    onActivate,
}) => {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const translate = useTranslate();
    const { saveLocalProfileToCloud, removeProfileFromCloud } = useCloudDataUpdateContext();

    const handleActivationClick = () => {
        if (onActivate) onActivate();
    };
    const handleLocalProfileRemovalClick = () => {
        if (removeLocalProfile) removeLocalProfile();
    };

    const handleLocalProfileAdditionClick = () => {
        if (addLocalProfileFromCloud) addLocalProfileFromCloud();
    };

    const toggleModal = () => setIsInfoModalOpen(!isInfoModalOpen);
    // const syncIcon = isCloudProfile
    //     ? iconSrc(isSynced ? ICONS.cloudActive : ICONS.cloudNotSynced)
    //     : iconSrc(isSynced ? ICONS.cloudActive : ICONS.localProfileNotSynced);
    const syncIcon = isCloudProfile
    ? isSynced ? IconType.CloudCheck : IconType.CloudDisconnected
    : isSynced ? IconType.CloudCheck : IconType.FloppyDisk;
    const syncIconColor = isCloudProfile
    ? isSynced ? Color.GreenDark60 : Color.RedDark60
    : isSynced ? Color.GreenDark60  : Color.Base20;

    const statusActionIcon = () => {
        if (isCloudProfile) {
            if (isSynced === undefined) {
                return iconSrc(ICONS.applyProfile);
            } else if (isSynced && isActive) {
                return iconSrc(ICONS.activeProfile);
            } else {
                return iconSrc(ICONS.greenConfirmation);
            }
        } else {
            if (isActive) {
                return iconSrc(ICONS.activeProfile);
            } else {
                return iconSrc(ICONS.applyProfile);
            }
        }
    };

    const getStatusIconType = () =>
    {
        if (isCloudProfile) {
            if (isSynced === undefined) {
                return IconType.PlusOutline;
            } else if (isSynced && isActive) {
                return IconType.SuccessCheck;
            } else {
                return IconType.SuccessCheck;
            }
        } else {
            if (isActive) {
                return IconType.SuccessCheck;
            } else {
                return IconType.PlusOutline;
            }
        }
    }
    const getStatusIconColor = () =>
    {
        if (isActive) {
            return Color.GreenDark60;
        } else {
            return Color.Base50;
        }
    }

    return (
        <div className="profile-tile">
            <div
                className="status-action"
                onClick={() => (isCloudProfile ? handleLocalProfileAdditionClick() : handleActivationClick())}
            >
                <Icon type={getStatusIconType()} color={getStatusIconColor()} size={IconSize.Smaller} />
            </div>
            <div className="profile-name">
                <p>{translate(`Cloud_Label_${profile.profileName}`, profile.profileName)}</p>
            </div>
            <div className="profile-status">
                <span className={isActive ? 'active' : 'inactive'}>
                    {translate(
                        isActive
                            ? 'Device_Home_Label_Profiles_Active_Status'
                            : 'Device_Home_Label_Profiles_Inactive_Status',
                        isActive ? 'Active' : 'Inactive',
                    )}
                </span>
            </div>
            <div className="sync-action" onClick={() => { console.log('add'); saveLocalProfileToCloud(profile, cloudProfileId)}}>
                <Icon type={syncIcon}  size={IconSize.Smaller} color={syncIconColor} />
            </div>
            <div className="info-action" onClick={toggleModal}>
                {isInfoModalOpen && (
                    <DeviceProfileInfoModal
                        deviceName={deviceName}
                        profile={profile}
                        isActive={isActive}
                        toggleModal={toggleModal}
                    />
                )}
                <Icon type={IconType.InformationOutline} color={Color.Base50} size={IconSize.Smaller} />
            </div>
            <div
                className="remove-action"
                onClick={() =>
                    isCloudProfile ? removeProfileFromCloud(cloudProfileId) : handleLocalProfileRemovalClick()
                }
            >
                <Icon type={IconType.Trash} color={Color.Base50} size={IconSize.Smaller} />
            </div>
        </div>
    );
};

export default ProfileTile;
