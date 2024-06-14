import { useCallback, useMemo } from 'react';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useCloudDataContext, useCloudDataUpdateContext } from '@renderer/contexts/cloud.context';
import ProfileTile from '@renderer/components/device-profile/device-profile-tile';
import './mouse-device-home.page.css';
import Icon from '@renderer/components/icon/icon';
import { IconSize, IconType } from '@renderer/components/icon/icon.types';
import { Color } from '@renderer/components/component.types';

function MouseDeviceHomePage() {
    const translate = useTranslate();
    const { previewDevice } = useDevicesContext();
    const { userProfile, currentDeviceProfiles } = useCloudDataContext();
    const { loginWindow } = useCloudDataUpdateContext();
    const { setCurrentProfile, getCurrentProfile } = useDevicesManagementContext();

    const activateProfile = useCallback(
        (profileIndex: number) => {
            if (profileIndex === previewDevice?.deviceData?.profileindex) return;
            setCurrentProfile(profileIndex);
        },
        [previewDevice, setCurrentProfile],
    );

    const profileTiles = useMemo(() => {
        return previewDevice?.deviceData?.profile?.map((profile, idx) => {
            const localCloudProfile = currentDeviceProfiles?.[profile.profileName];
            const cloudProfileId = localCloudProfile?.id;
            const isSynced = localCloudProfile?.isSynced;
            const isActive = previewDevice?.deviceData?.profileindex === idx;

            return (
                <ProfileTile
                    key={profile.profileName}
                    profile={profile}
                    deviceName={previewDevice.devicename}
                    cloudProfileId={cloudProfileId}
                    isActive={isActive}
                    isSynced={isSynced}
                    isCloudProfile={false}
                    onActivate={() => activateProfile(idx)}
                />
            );
        });
    }, [currentDeviceProfiles, previewDevice?.deviceData, activateProfile]);

    const cloudProfileTiles = useMemo(() => {
        if (!currentDeviceProfiles) return null;

        return Object.values(currentDeviceProfiles).map((profile: any, idx: number) => {
            const decodedData = window.atob(profile.data);
            const profileData = JSON.parse(decodedData);
            const isActive = profile.isSynced ? profileData.profileName === getCurrentProfile()?.profileName : false;

            return (
                <ProfileTile
                    key={`Cloud_Label_${profileData.profileName}`}
                    profile={profileData}
                    deviceName={profile.deviceName}
                    cloudProfileId={profile.id}
                    isSynced={profile.isSynced}
                    isCloudProfile={true}
                    isActive={isActive}
                    onActivate={() => activateProfile(idx)}
                />
            );
        });
    }, [currentDeviceProfiles, activateProfile]);

    if (!previewDevice || !previewDevice.deviceData || !previewDevice.deviceData.profile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="layout home mouse">
            <div className="panel main">
                <h2>{translate('Device_Home_Label_Mouse_Profiles_Header', 'Mouse Profiles')}</h2>
                {profileTiles}
            </div>
            <div className={`panel main cloud ${userProfile ? 'is-logged-in' : ''}`}>
                {!userProfile && (
                    <div className="login-backdrop">
                        <div className="login-popup">
                            <Icon type={IconType.GloriousID} size={IconSize.Medium} color={Color.GIDLogoMark} />
                            <p>
                                <a onClick={() => loginWindow('login')}>
                                    {translate('Device_Home_Label_Profiles_SignIn', 'Sign In')}
                                </a>
                                /
                                <a onClick={() => loginWindow('register')}>
                                    {translate('Device_Home_Label_Profiles_Register', 'Register')}
                                </a>
                                &nbsp;
                                {translate(
                                    'Device_Home_Label_Profiles_Cloud_Login_Text',
                                    'to Glorious ID in order to access cloud profiles!',
                                )}
                            </p>
                        </div>
                    </div>
                )}
                <h2>{translate('Device_Home_Label_Mouse_Profiles_Cloud_Header', 'Cloud Profiles')}</h2>
                {userProfile && currentDeviceProfiles && cloudProfileTiles}
                {!userProfile &&
                    previewDevice.deviceData.profile.map((profile) => (
                        <div className="profile-tile" key={profile.profileName}></div>
                    ))}
            </div>
        </div>
    );
}

export default MouseDeviceHomePage;
