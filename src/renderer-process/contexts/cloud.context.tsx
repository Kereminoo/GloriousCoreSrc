import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDevicesContext } from "./devices.context";
import { AppEvent } from "@renderer/support/app.events";
import { EventTypes } from "../../common/EventVariable";
import { useAppDataContext } from "./app-data.context";
import * as CloudService from "@renderer/services/cloud.service";
import { DeviceService } from "@renderer/services/device.service";


export class CloudState {
    userProfile: any = null;
    currentDeviceProfiles: any = null;
    allDevicesProfiles: Array<any> | null = null;
}

const CloudDataContext = createContext(new CloudState());
const CloudDataUpdateContext = createContext<{[key:string]:(...params:any[]) => void}>({});

export const useCloudDataContext = () => useContext(CloudDataContext);
export const useCloudDataUpdateContext = () => useContext(CloudDataUpdateContext);

export const CloudContext = ({ children }) => {
    const stateReference = useRef(new CloudState());
    const [displayState, setDisplayState] = useState(stateReference.current);
    const { previewDevice } = useDevicesContext();
    const appDataContext = useAppDataContext();

    useEffect(() => {
        const setUserProfile = async () => {
            const profile = await CloudService.setUserProfile();
            stateReference.current.userProfile = profile;
            setDisplayState(cloneState(stateReference.current));
        };

        const checkLoginStatus = async () => {
            const isLoggedIn = await CloudService.checkLoginStatus();
            if (isLoggedIn) await setUserProfile();
        }

        checkLoginStatus();
        AppEvent.subscribe(EventTypes.UserLoggedIn, setUserProfile);
        
        return () => AppEvent.unsubscribe(EventTypes.UserLoggedIn, setUserProfile);
    }, []);

    useEffect(() => {
        if (!displayState.userProfile) return;
        getCloudCurrentDeviceProfiles();
    }, [displayState.userProfile, previewDevice, JSON.stringify(previewDevice?.deviceData?.profile)]);

    const getAllDevicesCloudProfiles = async () => {
        try
        {
            const cloudProfiles = await CloudService.getAllDevicesCloudProfiles();
            stateReference.current.allDevicesProfiles = cloudProfiles;
            setDisplayState(cloneState(stateReference.current));
        }
        catch(error)
        {
            console.error("Error getting cloud device profiles.");
            console.error(error);
        }
    };
    const cloneState = (toClone: CloudState) => {
        const newState = new CloudState();

        newState.userProfile = toClone.userProfile;
        newState.currentDeviceProfiles = toClone.currentDeviceProfiles;
        newState.allDevicesProfiles = toClone.allDevicesProfiles;

        return newState;
    }

    const loginWindow = async (page: string) => {
        const lang = appDataContext.language;
        await CloudService.loginWindow(page, lang);
      };

    const getCloudCurrentDeviceProfiles = async () => {
        if (!previewDevice) return;

        const cloudProfiles = await CloudService.getCloudCurrentDeviceProfiles(previewDevice.SN);

        // [note: dmercer]
        // mice profiles are at previewDevice.deviceData.profile, but keyboard
        // profiles are at previewDevice.keyboardData, and indexed by the layer.
        const localDeviceProfiles = DeviceService.getDeviceProfiles(previewDevice);

        const cloudProfilesMap = cloudProfiles.reduce((profilesMap, profile) => ({
            ...profilesMap,
            [profile.name]: profile
        }), {})
        localDeviceProfiles?.forEach((profile) => {
            const encodedProfileData = window.btoa(JSON.stringify(profile));
            const localCloudProfile = cloudProfilesMap[profile.profileName]
            if (!localCloudProfile) return;
            
            // [note: dmercer] a 'lastModified' propery is added when a profile
            // is saved to the cloud. This makes the encoded data mismatch;
            // fixed, here, by decoding the cloud data, deleting the property
            // on a clone object, and then comparing the re-encoded cloud
            // data to the encoded local profile data
            const decodedData = window.atob(localCloudProfile.data);
            const cloudProfileData = JSON.parse(decodedData);

            const profileCopy = structuredClone(cloudProfileData);
            delete (profileCopy as any).lastModified;
            const cloudEncodedProfiledata = window.btoa(JSON.stringify(profile));
            localCloudProfile.isSynced = cloudEncodedProfiledata === encodedProfileData;

        })

        stateReference.current.currentDeviceProfiles = cloudProfilesMap;
        setDisplayState(cloneState(stateReference.current));
      
    };

    const saveLocalProfileToCloud = async (profile, cloudProfileId) => {
        await CloudService.saveLocalProfileToCloud(profile, cloudProfileId, previewDevice);
        getCloudCurrentDeviceProfiles();
    };

    const removeProfileFromCloud = async (cloudProfileId) => {
        await CloudService.removeProfileFromCloud(cloudProfileId);
        getCloudCurrentDeviceProfiles();
        getAllDevicesCloudProfiles();
    }
    
    const logout = async () => {
        await CloudService.logout();
        stateReference.current.userProfile = null;
        stateReference.current.currentDeviceProfiles = null;
        stateReference.current.allDevicesProfiles = null;
        setDisplayState(cloneState(stateReference.current));
    }

    
    const updateFunctions = { 
        loginWindow,
        logout,
        getCloudCurrentDeviceProfiles,
        saveLocalProfileToCloud,
        removeProfileFromCloud,
        getAllDevicesCloudProfiles,
    };

    return (
        <CloudDataContext.Provider value={displayState}>
            <CloudDataUpdateContext.Provider value={updateFunctions}>
                {children}
            </CloudDataUpdateContext.Provider>
        </CloudDataContext.Provider>
    );
}

