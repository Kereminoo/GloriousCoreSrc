import { useEffect, useMemo, useState } from 'react';
import OptionSelectComponent from '../../components/option-select/option-select.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import './settings.page.css';
import { AppService } from '@renderer/services/app.service';
import { useTranslate, useTranslationsUpdateContext } from '@renderer/contexts/translations.context';
import { useAppDataContext, useAppDataUpdateContext } from '@renderer/contexts/app-data.context';
import SVGIconComponent from '../../components/svg-icon/svg-icon.component';
import { useCloudDataContext, useCloudDataUpdateContext } from '@renderer/contexts/cloud.context';
// import { useDevicesContext } from '@renderer/contexts/devices.context';
import ProfileTile from '../../components/device-profile/device-profile-tile';
import Icon from '@renderer/components/icon/icon';
import { IconSize, IconType } from '@renderer/components/icon/icon.types';
import { Color } from '@renderer/components/component.types';
import SVGImage from '@renderer/components/svg-image/svg-image';
import { SVGImageType } from '@renderer/components/svg-image/svg-image.types';
import { UpdatesService } from '@renderer/services/updates.service';

export enum AppUpdateStatus {
    CheckingForUpdate,
    UpToDate,
    HasUpdate,
    DownloadingUpdate,
    Updating,
    UpdateFailed,
}

const ICONS_PATH = '/images/icons';
const ICONS = {
    gloriousIdLabel: 'glorious_id_label.svg',
    facebook: 'facebook.png',
    google: 'google.png',
};
const iconSrc = (fileName) => `${ICONS_PATH}/${fileName}`;

function SettingsPage() {
    // (props: any)
    // const { onHyperlinkClick } = props;
    // const devicesContext = useDevicesContext();
    const translate = useTranslate();
    const updateTranslations = useTranslationsUpdateContext();

    const [appUpdateFailureReason, setAppUpdateFailureReason] = useState("");

    const appDataContext = useAppDataContext();
    const {
        setLanguage,
        setOpenOnStartup,
        setMinimizedByDefault,
        setEnableAutomaticUpdates,
        setGlobalStandby,
        setGlobalStandbyTimer,
        setEnableTooltips,
        setTheme,
    } = useAppDataUpdateContext();

    const { loginWindow, logout, getAllDevicesCloudProfiles } = useCloudDataUpdateContext();
    const { userProfile, allDevicesProfiles } = useCloudDataContext();

    const [sleepTimeout, setSleepTimeout] = useState(appDataContext.sleeptime);
    const onSetSleepTimeout = (value: number) => {
        setSleepTimeout(value);
        setGlobalStandbyTimer(value);
    };

    // const [showDebugUI, setShowDebugUI] = useState("");
    const [activeTab, setActiveTab] = useState('settings');

    useEffect(() => {
        if (activeTab !== 'gloriousid') return;
        getAllDevicesCloudProfiles();
    }, [activeTab]);

    const [appUpdateStatus, setAppUpdateStatus] = useState<AppUpdateStatus>(AppUpdateStatus.CheckingForUpdate);
    useEffect(() =>
    {
      refreshAppUpdateStatus();
    }, []);
    const refreshAppUpdateStatus = async () =>
    {
        const hasUpdates = await UpdatesService.checkIfAppHasUpdates(appDataContext.version);
        console.log(hasUpdates);
        setAppUpdateStatus((hasUpdates == true) ? AppUpdateStatus.HasUpdate : AppUpdateStatus.UpToDate);
    }

    const [downloadProgress, setDownloadProgress] = useState(0);
    useEffect(() =>
    {
        if(appUpdateStatus == AppUpdateStatus.DownloadingUpdate)
        {
            setDownloadProgress(0);

        }
        else if(appUpdateStatus == AppUpdateStatus.Updating)
        {
            setTimeout(() =>
            {
                AppService.quitApplication();
            }, 1000);
        }
    }, [appUpdateStatus]);

    const isGoogleLinked = userProfile?.linkedAccounts.includes('google');
    const isMetaLinked = userProfile?.linkedAccounts.includes('facebook');

    console.log(userProfile?.linkedAccounts);

    const linkedAccountTiles = [
        { name: 'Google', icon: ICONS.google, isLinked: isGoogleLinked },
        {
            name: 'Meta',
            icon: ICONS.facebook,
            isLinked: isMetaLinked,
        },
    ];

    const cloudProfileTiles = useMemo(() => {
        if (!userProfile || !allDevicesProfiles) return;

        const groupedData = allDevicesProfiles?.reduce((groupedDevices, profile) => {
            const deviceName = profile.deviceName;
            (groupedDevices[deviceName] = groupedDevices[deviceName] || []).push(profile);
            return groupedDevices;
        }, {});

        return Object.entries(groupedData).map(([deviceName, profiles]) => (
            <div className="profiles-group" key={deviceName}>
                <div className="device-name-title">
                    <span>{deviceName}</span>
                </div>
                <div className="profiles-tiles">
                    {profiles.map((profile, idx) => {
                        const profileData = JSON.parse(window.atob(profile.data));
                        return (
                            <ProfileTile
                                key={`${profile.deviceName}_${profile.profileName}_${idx}`}
                                profile={profileData}
                                deviceName={profile.deviceName}
                                cloudProfileId={profile.id}
                                isCloudProfile={true}
                                isActive={false}
                                isSynced={true}
                            />
                        );
                    })}
                </div>
            </div>
        ));
    }, [allDevicesProfiles, userProfile]);

    return (
        <>
            <div className="settings-page">
                <header>
                    <div className="title">                        
                        {(activeTab === 'settings') ? <SVGImage type={SVGImageType.Core2WordMark} /> : undefined }
                        {(activeTab === 'gloriousid') ? <SVGImage type={SVGImageType.GloriousIDWordMark} /> : undefined }
                    </div>
                </header>
                <ul className="panel tabs">
                    <li className="tab" onClick={() => setActiveTab('settings')}>
                        <Icon
                            type={IconType.CogFilled}
                            color={Color.Base50}
                            size={IconSize.Small}
                            className="icon tab"
                        />
                        <span>{translate('Settings_Tab_Settings', 'Settings')}</span>
                    </li>
                    <li className="tab" onClick={() => setActiveTab('gloriousid')}>
                        <Icon
                            type={IconType.GloriousID}
                            color={Color.Base50}
                            size={IconSize.Small}
                            className="icon tab"
                        />
                        <span>{translate('Settings_Tab_Glorious_ID', 'Glorious ID')}</span>
                    </li>
                </ul>
                {
                    activeTab === 'settings' && (
                        <div className="tab-content settings">
                            <div className="panel version-info">
                                <div className="top">
                                    <div className="version">
                                        <span className="title">{translate('Settings_Version', 'Version')}</span>
                                        <span className="label">{appDataContext.version}</span>
                                    </div>
                                    <button type="button" className="secondary" onClick={() =>
                                    {
                                        setAppUpdateStatus(AppUpdateStatus.CheckingForUpdate);
                                        // artificial delay to give users some kind of visual
                                        // feedback that the check is happening.
                                        setTimeout(() =>
                                        {
                                            refreshAppUpdateStatus();
                                        }, 500);
                                    }}>
                                        {translate('Button_CheckForAppUpdates', 'Check for Updates')}
                                    </button>
                                </div>
                                {(appUpdateStatus == AppUpdateStatus.HasUpdate)
                                ?
                                <div className="update-link" onClick={async () =>
                                {
                                    const url = await UpdatesService.getAppUpdaterSetupUrl();
                                    setAppUpdateStatus(AppUpdateStatus.DownloadingUpdate);
                                    await UpdatesService.downloadAppUpdate(url, (update) =>
                                    {
                                        if (update.type == 'start') {
                                            setDownloadProgress(0);
                                        } else if (update.type == 'progress') {
                                            setDownloadProgress(Math.round(update.value.progress));
                                        } else if (update.type == 'complete') {
                                            setDownloadProgress(100);
                                            setAppUpdateStatus(AppUpdateStatus.Updating);
                                        } else if (update.type == 'error') {
                                            setAppUpdateFailureReason('An error occurred during the download.');
                                            setAppUpdateStatus(AppUpdateStatus.UpdateFailed);
                                        }
                                    });
                                    // const urlArray = url.split('/');
                                    // const fileName = urlArray[urlArray.length - 1];
                                    // await UpdatesService.beginAppUpdate(fileName);

                                    // console.log('update link clicked', url);
                                    // AppService.openHyperlink(url);
                                }}>
                                    <Icon type={IconType.ExclamationPoint} size={IconSize.Small} color={Color.Glorange60} />
                                    <span>A new version of CORE 2.0 is available!</span>
                                </div>
                                : (appUpdateStatus == AppUpdateStatus.CheckingForUpdate)
                                ? <div className="checking-version">
                                    <Icon type={IconType.CircleArrow} size={IconSize.Small} color={Color.Glorange60} />
                                    <span>Checking for update...</span>
                                </div>
                                : (appUpdateStatus == AppUpdateStatus.DownloadingUpdate)
                                ? <div className="downloading">
                                    <Icon type={IconType.UpArrowOutline} size={IconSize.Small} color={Color.Glorange60} />
                                    <span>Downloading...</span>
                                    <progress min={0} max={100} value={downloadProgress} />
                                    <span>{downloadProgress}%</span>
                                    <button type="button" onClick={()=>
                                    {
                                        UpdatesService.cancelAppUpdaterDownload();
                                        setAppUpdateStatus(AppUpdateStatus.UpdateFailed);
                                        setAppUpdateFailureReason("User canceled download")
                                    }
                                    }>
                                        Cancel Download
                                    </button>
                                </div>
                                : (appUpdateStatus == AppUpdateStatus.UpdateFailed)
                                ? <div className="update-failed">
                                    <Icon type={IconType.CancelCross} size={IconSize.XSmall} color={Color.RedDark60} />
                                    <span>Update Failed:</span>
                                    <span>{appUpdateFailureReason}</span>
                                </div>
                                : (appUpdateStatus == AppUpdateStatus.Updating)
                                ? <div className="updating">
                                    <Icon type={IconType.CircleArrow} size={IconSize.Small} color={Color.GreenDark60} />
                                    <span>Starting Update...</span>
                                    <span>{appUpdateFailureReason}</span>
                                </div>
                                : <></>}
                                {/* {appDataContext.buildVersion != '' ? (
                                    <div className="build-version">
                                        <span className="title">[DEV] Build Version</span>
                                        <span className="label">{appDataContext.buildVersion}</span>
                                    </div>
                                ) : (
                                    <></>
                                )} */}
                                {/* <div>
                                    <div className="changelog-link">
                                        <a
                                            onClick={() => {
                                                const url =
                                                    'https://www.gloriousgaming.com/pages/development-changelog#change-logs';
                                                AppService.openHyperlink(url);
                                            }}
                                        >
                                            {translate('Settings_ViewChangelog', 'View Changelog')}
                                        </a>
                                    </div>
                                </div> */}
                            </div>
                            <div className="panel app-config">
                                <label className="field">
                                    <span className="label">
                                        {translate(
                                            'Settings_LaunchOnStartup',
                                            'Automatically launch CORE on PC startup',
                                        )}
                                    </span>
                                    <ToggleComponent
                                        value={appDataContext.startup}
                                        onChange={async (value) => {
                                            setOpenOnStartup(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.startup = value;
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label>
                                <label className="field">
                                    <span className="label">
                                        {translate('Settings_MinimizedByDefault', 'Launch CORE minimized by default')}
                                    </span>
                                    <ToggleComponent
                                        value={appDataContext.minimize}
                                        onChange={async (value) => {
                                            setMinimizedByDefault(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.minimize = value;
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label>
                                <label className="field">
                                    <span className="label">{translate('Settings_Tooltips', 'CORE tooltips')}</span>
                                    <ToggleComponent
                                        value={appDataContext.tooltip}
                                        onChange={async (value) => {
                                            setEnableTooltips(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.tooltip = value;
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label>
                                <label className="field">
                                    <span className="label">
                                        {translate('Settings_AutomaticUpdates', 'Enable Automatic Updates')}
                                    </span>
                                    <ToggleComponent
                                        value={appDataContext.update}
                                        onChange={async (value) => {
                                            setEnableAutomaticUpdates(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.update = value;
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label>
                                {/* <label className="field">
                                    <span className="label">
                                        {translate('Settings_ColorTheme', 'Change Color Theme')}
                                    </span>
                                    <ToggleComponent
                                        value={appDataContext.theme}
                                        onChange={async (value) => {
                                            setTheme(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.theme = (value) ? 'dark' : 'light';
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label> */}
                            </div>
                            <div className="panel global-device-config">
                                <label className="field global-standby">
                                    <span className="label">
                                        {translate('Settings_GlobalStandby', 'Global Standby')}
                                    </span>{' '}
                                    <ToggleComponent
                                        value={appDataContext.sleep}
                                        onChange={async (value) => {
                                            setGlobalStandby(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.sleep = value;
                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();

                                            //todo;
                                            // update all devices with sleep time
                                        }}
                                    />
                                </label>
                                <label className="field">
                                    <label className="field time-slider-control">
                                        <span className="label">
                                            {translate('Settings_TurnOffAfterActivity', 'Turn off after activity')}
                                        </span>
                                        <span className="label">
                                            <input
                                                type="text"
                                                pattern="([0-9]|&#8734;)+"
                                                className="time-input"
                                                value={sleepTimeout < 100 ? sleepTimeout : String.fromCodePoint(8734)}
                                                onChange={(e) => {
                                                    if (e.target.value.length == 0) {
                                                        onSetSleepTimeout(0);
                                                        return;
                                                    }
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val) && val >= 0 && val <= 100) {
                                                        onSetSleepTimeout(val);
                                                    }
                                                }}
                                                onFocus={(e) => e.target.select()}
                                            />
                                            {'min'}
                                        </span>
                                    </label>
                                    <RangeComponent value={appDataContext.sleeptime} onChange={onSetSleepTimeout} />
                                    <span className="result"></span>
                                </label>
                            </div>
                            <div className="panel language">
                                <label className="field language">
                                    <span className="label">{translate('Settings_Language', 'Language')}</span>
                                    <OptionSelectComponent
                                        options={appDataContext.languageOptions.map((item) => {
                                            return {
                                                value: item.optionKey,
                                                label: translate(item.translationKey, item.value),
                                            };
                                        })}
                                        value={appDataContext.language}
                                        onChange={async (value) => {
                                            setLanguage(value);
                                            // const settings = structuredClone(currentSettings);
                                            // settings.language = value;

                                            // // const { default: updatedTranslations } = await import('../../public/i18n/$');
                                            // // if(updatedTranslations != null)
                                            // // {
                                            // //   setTranslations(updatedTranslations as Translation[]);
                                            // //   console.log('translations', updatedTranslations);
                                            // // }

                                            // await AppService.saveAppSetting(settings);
                                            // updateCurrentSettings();
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="panel support">
                                <div className="support">
                                    <div className="label">{translate('Settings_Support', 'Support')}</div>
                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="hollow"
                                            onClick={() => {
                                                const url = 'https://www.gloriousgaming.com/pages/product-registration';
                                                AppService.openHyperlink(url);
                                            }}
                                        >
                                            {translate('Button_ExtendWarranty', 'Extend Warranty')}
                                        </button>
                                        <button
                                            type="button"
                                            className="hollow"
                                            onClick={() => {
                                                const url = 'https://www.gloriousgaming.com/en-ca/pages/support';
                                                AppService.openHyperlink(url);
                                            }}
                                        >
                                            {translate('Button_SupportHomepage', 'Support Homepage')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="panel feature-request">
                                <div>
                                    <div className="label">
                                        {translate(
                                            'Settings_FeatureRequestPrompt',
                                            'Is there a feature you would like to request?',
                                        )}
                                    </div>
                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="hollow"
                                            onClick={() => {
                                                const url = 'https://gloriouspcgaming.featureupvote.com/';
                                                AppService.openHyperlink(url);
                                            }}
                                        >
                                            {translate('Button_FeatureUpvote', 'Feature Upvote')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) /* end of settings tab */
                }
                {
                    activeTab === 'gloriousid' && (
                        <div className="tab-content glorious-id">
                            {
                                !userProfile && (
                                    <div className="panel welcome">
                                        <div>
                                            <Icon type={IconType.GloriousID} size={IconSize.Large} color={Color.GIDLogoMark} />
                                            <h3>{translate('Settings_Glorious_Welcome', 'Welcome to GLORIOUS ID')}</h3>
                                            <p>
                                                {translate(
                                                    'Settings_Glorious_Welcome_create_account',
                                                    'Creating an account allows you to do X, Y, Z and so much more!',
                                                )}
                                            </p>

                                            <div className="features">
                                                <div className="feature">
                                                    <Icon type={IconType.SuccessCheck} size={IconSize.Medium} color={Color.GreenDark60} />
                                                    {translate(
                                                        'Settings_Glorious_Welcome_feature_1',
                                                        'Features list X.',
                                                    )}
                                                </div>

                                                <div className="feature">
                                                    <Icon type={IconType.SuccessCheck} size={IconSize.Medium} color={Color.GreenDark60} />
                                                    {translate(
                                                        'Settings_Glorious_Welcome_feature_2',
                                                        'Features list Y.',
                                                    )}
                                                </div>

                                                <div className="feature">
                                                    <Icon type={IconType.SuccessCheck} size={IconSize.Medium} color={Color.GreenDark60} />
                                                    {translate(
                                                        'Settings_Glorious_Welcome_feature_3',
                                                        'Features list Z.',
                                                    )}
                                                </div>
                                            </div>

                                            <div className="actions">
                                                <button
                                                    type="button"
                                                    className="primary"
                                                    onClick={() => loginWindow('signIn')}
                                                >
                                                    {translate('Settings_Glorious_Welcome_Login', 'Login')}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="secondary"
                                                    onClick={() => loginWindow('signUp')}
                                                >
                                                    {translate('Settings_Glorious_Welcome_Register', 'Register')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) /* end of glorious-id welcome panel */
                            }
                            {
                                userProfile && (
                                    <>
                                        <div className="panel logged-in">
                                            <div className="user-profile">
                                                <div className="profile-data">
                                                    <h3>
                                                        <Icon type={IconType.GloriousID} size={IconSize.Medium} color={Color.GIDLogoMark} />
                                                        {userProfile.email}
                                                    </h3>
                                                    <p>
                                                        {translate(
                                                            'Settings_Glorious_Welcome_LoggedIn',
                                                            'Welcome to Glorious ID! Creating an account allows you to do X, Y, Z and so much more!',
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="profile-actions">
                                                    <button
                                                        type="button"
                                                        className="secondary hollow"
                                                        onClick={() => logout()}
                                                    >
                                                        {translate('Settings_Glorious_Welcome_Logout', 'Logout')}
                                                    </button>
                                                    <SVGImage type={SVGImageType.GloriousIDLabel} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel cloud-profiles">
                                            <div className="profiles-header">
                                                <h3>
                                                    {translate(
                                                        'Settings_Glorious_Cloud_Profiles',
                                                        'Glorious Cloud Profiles',
                                                    )}
                                                </h3>
                                            </div>
                                            <div>{cloudProfileTiles}</div>
                                        </div>
                                        <div className="panel linked-accounts">
                                            <h3>
                                                {translate(
                                                    'Settings_Glorious_Linked_Accounts_SSO_Account',
                                                    'SSO Account',
                                                )}
                                            </h3>
                                            <p>
                                                {translate(
                                                    'Settings_Glorious_Linked_Accounts_Connect_Your_Customer_Account',
                                                    'Connect your gloriousgaming.com customer account...',
                                                )}
                                            </p>
                                            {linkedAccountTiles.map((account) => (
                                                <div className="linked-account-row" key={account.name}>
                                                    <div className="linked-account-tile">
                                                        <div className="sso-name">                                                            
                                                            <Icon type={IconType.GloriousID} size={IconSize.Medium} color={Color.GIDLogoMark} />
                                                            <span>{account.name}</span>
                                                        </div>
                                                        <div className={`sso-status ${account.isLinked && 'active'}`}>
                                                            <span>
                                                                {account.isLinked
                                                                    ? translate(
                                                                          'Settings_Glorious_Linked_Connected',
                                                                          'Connected',
                                                                      )
                                                                    : translate(
                                                                          'Settings_Glorious_Linked_NotConnected',
                                                                          'Not Connected',
                                                                      )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {!account.isLinked && (
                                                        <button
                                                            type="button"
                                                            className="primary"
                                                            onClick={() => loginWindow('signIn')}
                                                        >
                                                            {translate(
                                                                'Settings_Glorious_Linked_Accounts_Connect',
                                                                'Connect',
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) /* end of glorious-id logged in panel */
                            }
                        </div>
                    ) /* end of glorious id tab */
                }
                <footer></footer>
            </div>
        </>
    );
}

export default SettingsPage;

// /**
//  * click Light Sleep checkbox
//  */
// LightingSleepChange() {
//     this.getAppService.getAppSetting().sleep = this.LightingSleep;
//     this.getAppService.updateAppsetting();
//     for (let i = 0; i < this.deviceService.pluginDeviceData.length; i++) {
//         let obj = {
//             Type: this.funcVar.FuncType.Mouse,
//             SN: this.deviceService.pluginDeviceData[i].SN,
//             Func: this.funcVar.FuncName.SleepTime,
//             Param: {
//                 sleep: this.LightingSleep,
//                 sleeptime: this.SleepValue
//             }
//         }
//         this.protocolService.RunSetFunction(obj).then((data) => { });
//     }
// }

// /**
//  * move sleep slider
//  */
// sleepmove() {
//     const sleepTimeSlider: any = document.getElementById("SleepTimeslider");
//     if (sleepTimeSlider) {
//         sleepTimeSlider.style.backgroundImage = '-webkit-linear-gradient(left ,#FFA40D 0%,#FFA40D ' + ((this["SleepValue"] - 1) / 14 * 100) + '%,#313131 ' + ((this["SleepValue"] - 1) / 14 * 100) + '%, #313131 100%)';
//         const sleepSliderText = document.getElementById("SleepSliderText");
//         if(sleepSliderText != null)
//         {
//             sleepSliderText.style.marginLeft = ((this.SleepValue - 1) * 13) + "px";
//         }
//     }
// }

// /**
//  * Sleep slider change
//  */
// SleepsliderChange() {
//     this.getAppService.getAppSetting().sleeptime = this.SleepValue;
//     this.getAppService.updateAppsetting();
//     for (let i = 0; i < this.deviceService.pluginDeviceData.length; i++) {
//         let obj = {
//             Type: this.funcVar.FuncType.Mouse,
//             SN: this.deviceService.pluginDeviceData[i].SN,
//             Func: this.funcVar.FuncName.SleepTime,
//             Param: {
//                 sleep: this.LightingSleep,
//                 sleeptime: this.SleepValue
//             }
//         }
//         this.protocolService.RunSetFunction(obj).then((data) => { });
//     }
// }
