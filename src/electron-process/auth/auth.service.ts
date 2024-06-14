import axios from 'axios';
import url from 'url';
import keytar from 'keytar';
import os from 'os';
import qs from 'qs';

import { authConfig } from './auth.config';

const KEYTAR_TOKEN = 'glorious-token';
const KEYTAR_REGION = 'glorious-region';
const KEYTAR_ACCOUNT = os.userInfo().username;

let idToken: string = '';
let accessToken: string = '';
let refreshToken: string = '';
let refreshInProgress: boolean = false;

// TODO: Add geoip region detection
export async function getRegion() {
  let region = await keytar.getPassword(KEYTAR_REGION, KEYTAR_ACCOUNT);

  if (!region) {
    try {
      const response = await axios.get(authConfig.region_detect_api);
      region = response.data.region;
      await keytar.setPassword(KEYTAR_REGION, KEYTAR_ACCOUNT, region);
    } catch (error) {
      throw new Error('An error occurred during region detection. Please try again later.');
    }
  }

  return region;
}

export async function changePassword({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
  const region = await getRegion();
  const token = await getAccessToken();

  const options = {
    adapter: 'http',
    method: 'POST',
    url: `${authConfig[region].cognito_api}/`,
    headers: {
      'content-type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.ChangePassword'
    },
    data: {
      AccessToken: token,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword
    }
  };

  try {
    await axios(options);
  } catch (error) {
    throw error;
  }
}

export function isExpired(token) {
  if (!token) {
    return true;
  }

  const expiration = token.split('.')[1];
  const decoded = Buffer.from(expiration, 'base64').toString();
  const { exp } = JSON.parse(decoded);

  return Date.now() >= exp * 1000;
}

export async function isLoggedIn() {
  if (!accessToken || isExpired(accessToken)) {
    await refreshTokens();
  }

  return !!accessToken;
}

export async function getAccessToken() {
  if (!accessToken || isExpired(accessToken)) {
    await refreshTokens();
  }

  return accessToken;
}

export async function getIdToken() {
  if (!idToken || isExpired(idToken)) {
    await refreshTokens();
  }

  return idToken;
}

export async function getProfile() {
  const idToken = await getIdToken();

  const decoded = Buffer.from(idToken.split('.')[1], 'base64').toString();
  const profile = JSON.parse(decoded);

  const linkedAccounts = (profile.identities || []).map(identity => identity.providerName.toLowerCase());
  return {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    linkedAccounts
  }
}

export async function getAuthenticationURL(options) {
  const region = await getRegion() as string;

  const params = qs.stringify(options);
  console.log("going to: " + authConfig[region].auth_ui + "?" + params);
  return authConfig[region].auth_ui + "?" + params;
}

export async function refreshTokens() {
  const region = await getRegion();
  refreshToken = await keytar.getPassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT) || '';

  if (refreshToken && !refreshInProgress) {
    refreshInProgress = true;
    const refreshOptions = {
      adapter: 'http',
      method: 'POST',
      url: `${authConfig[region].auth_api}/oauth2/token`,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: qs.stringify({
        grant_type: 'refresh_token',
        client_id: authConfig[region].auth_client_id,
        refresh_token: refreshToken
      })
    };

    try {
      const response = await axios(refreshOptions);
      accessToken = response.data.access_token;
      idToken = response.data.id_token;
      refreshInProgress = false;
    } catch (error) {
      throw error;
    }
  }
}

export async function loadTokensFromUrl(callbackURL: string) {
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;
  const { token, id_token, refresh_token } = query;

  if (refresh_token) {
    accessToken = token as string;
    idToken = id_token as string;
    refreshToken = refresh_token as string;
    await keytar.setPassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT, refreshToken);
  }
}

export async function logout() {
  try {
    await keytar.deletePassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT);
  } catch (e) {
    throw e;
  }
}