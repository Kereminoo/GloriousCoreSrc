import { AppChannel } from "../../common/channel-maps/AppChannel.map";
import { IPCService } from "./ipc.service"; // assuming IPCService is similar to your earlier example

export async function loginWindow(page: string, language: string): Promise<any> {
    return await IPCService.invoke(AppChannel.Login, { lang: language, initialPage: page });
}

export async function logout(): Promise<void> {
    await IPCService.invoke(AppChannel.Logout);
}

export async function getCloudCurrentDeviceProfiles(serialNumber: string): Promise<any> {
    return await IPCService.invoke(AppChannel.GetCloudDeviceProfiles, { sn: serialNumber });
}

export async function saveLocalProfileToCloud(profile: any, cloudProfileId: string, previewDevice: any): Promise<void> {
    await IPCService.invoke(AppChannel.CreateCloudDeviceProfile, {
        id: cloudProfileId,
        name: profile.profileName,
        data: window.btoa(JSON.stringify(profile)),
        sn: previewDevice.SN,
        deviceName: previewDevice.devicename,
        deviceCategory: previewDevice.deviceCategoryName
    });
}

export async function removeProfileFromCloud(cloudProfileId: string): Promise<void> {
    await IPCService.invoke(AppChannel.DeleteCloudDeviceProfile, cloudProfileId);
}

export async function getAllDevicesCloudProfiles(): Promise<any> {
    return await IPCService.invoke(AppChannel.GetAllCloudDevicesProfiles);
}

export async function checkLoginStatus() {
    return await IPCService.invoke(AppChannel.IsLoggedIn);
}

export async function setUserProfile(): Promise<any> {
    return await IPCService.invoke(AppChannel.GetProfile);
}
