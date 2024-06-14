import audioSessionLibUrl from './AudioSession.node?asset';
import hidLibUrl from './hiddevice.node?asset';
import launchWinSocketLibUrl from './LaunchWinSocket.node?asset';
import gloriousMOISDKLibUrl from './GloriousMOISDK.node?asset';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const AudioSessionLib = require(audioSessionLibUrl);
export const HidLib = require(hidLibUrl);
export const LaunchWinSocketLib = require(launchWinSocketLibUrl);
export const GloriousMOISDKLib = require(gloriousMOISDKLibUrl);
