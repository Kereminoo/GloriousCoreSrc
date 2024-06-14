import axios from "axios";
import { getAccessToken, getRegion, getProfile } from "../auth/auth.service";
import { cloudConfig } from "./cloud.config";
import { createProfile, deleteProfile, updateProfile } from "./graphql/mutations";
import { listProfiles, queryByOwner } from "./graphql/queries";
import { CreateProfileInput, ModelProfileFilterInput, UpdateProfileInput } from "./graphql/API";

async function makeGraphQlRequest(query: string, variables) {
    try {
        const accessToken = await getAccessToken();
        const region = await getRegion();

        const response = await axios({
            url: cloudConfig[region],
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                query,
                variables: JSON.stringify(variables)
            }
        });

        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function getDeviceProfiles(filters: ModelProfileFilterInput) {
    const profile = await getProfile();
    const vars = { owner: `${profile.id}::${profile.id}` };
    if (filters.sn) {
      vars.sn = { eq: filters.sn }
    }

    const data = await makeGraphQlRequest(queryByOwner, vars);
    return data?.data?.queryByOwner?.items;
}

export async function getAllDevicesProfiles() {
    const profile = await getProfile();
    const vars = { owner: `${profile.id}::${profile.id}` };

    const data = await makeGraphQlRequest(queryByOwner, vars);
    return data?.data?.queryByOwner?.items;
}

export async function saveProfile(input: CreateProfileInput | UpdateProfileInput) {
    const query = input.id ? updateProfile : createProfile;
    return await makeGraphQlRequest(query, { input });
}

export async function deleteDeviceProfile(id: string) {
    return await makeGraphQlRequest(deleteProfile, { input: { id } });
}
