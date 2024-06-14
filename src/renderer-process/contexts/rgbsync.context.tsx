import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUIContext, useUIUpdateContext } from "./ui.context";
import { AppService } from "@renderer/services/app.service";
import { DisplayOption } from "@renderer/data/display-option";
import { useDevicesContext, useDevicesManagementContext } from "./devices.context";
import { ProfileData } from "src/common/data/records/device-data.record";

const defaultLanguageOptions = [new DisplayOption('en', 'languageTitle_en', 'English'), new DisplayOption('tw', 'languageTitle_tw', 'Taiwanese')];

export class RGBSyncState {
    //  drawer items array or add some properties to device db???
    //       	SN string
    // 	        Sync'd bool
    // 	        arrangement top num
    //          arrangement left num

    //  drawer open bool
    //  selected breadcrumb tab string

    //  appearance tab
    //  	selected lighting effect string? index num?
    //  	brightness percent num
    //  	rate percent num
    //  	colorstyle custom/gradient flag bool

    //  	...Custom color
    //  		active color
    //  		swatches RGBA values array
    //  	...RGB Gradient
    //  		gradients array of rgba stop points?
    //  	...Effects and their properties from spreadsheet
    //  		WAVE
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			bandwidth 50-500
    //  			angle 0-359
    //  			gradient flag bool  on=true
    //  		SONIC
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			bandwidth 50-500
    //  			gradient flag bool  on=true
    //  			direction flag bool  out=true in=false
    //  		SPIRAL
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			gradient flag bool  on=true
    //  			direction flag bool  out=true in=false
    //  		CYCLE
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			gradient flag bool  on=true
    //  		LINEAR WAVE
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			bandwidth 50-500
    //  			angle 0-359
    //  			gap 0-500
    //  			bump flag bool on=true
    //  			bidirectional flag bool on=true
    //  			gradient flag bool  on=true
    //  		RIPPLE
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			bandwidth 50-500
    //  			gap 0-500
    //  			gradient flag bool  on=true
    //  		RESPIRATORY
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			bandwidth 50-500
    //  			gap 0-500
    //  		RAIN
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			angle 0-359
    //  			rain num??  1-10  why rain 1-10 & fire is 0-10
    //  		FIRE
    //  			opacity num 0-100
    //  			fire num?? 0-10  why rain 1-10 & fire is 0-10
    //  		TRIGGER
    //  			opacity num 0-100
    //  			color RGBA array[1-20?]
    //  			speed 1-10
    //  			radius num 10-500
    //  		AUDIO SYNC
    //  			opacity num 0-100
    //  			color RGBA array[1]
    //  			amplitude 200-8000


    //  movement tab
    //  	angle num
    //  	bandwidth num
    //  	gap num
    //  	bump bool
    //  	bidirectional bool

}

const RGBSyncDisplayContext = createContext(new RGBSyncState());
const RGBSyncUpdateContext = createContext<{ [key: string]: (...params: any[]) => void }>({});

export function useRGBSyncContext() {
    return useContext(RGBSyncDisplayContext);
}
export function useRGBSyncUpdateContext() {
    return useContext(RGBSyncUpdateContext);
}

export function RGBSyncContext({ children }) {
    // reference holds single value in memory that gets updated
    // when the state changes; state gets provided with the ref
    // object, so it's not getting double-cloned on every update.
    const stateReference = useRef(new RGBSyncState());
    const [rgbSyncState, setRgbSyncState] = useState(stateReference.current);

    // const devicesContext = useDevicesContext();
    // const 
    // {
    //     getDeviceProfile,
    //     saveDeviceRgbOffAfterInactivity,
    //     saveDeviceRgbOffAfterInactivityTime,
    // } = useDevicesUpdateContext();

    // // initialize settings; listen for refresh events
    // useEffect(() =>
    // {
    //     init();
    // }, []);
    // const init = async () =>
    // {
    //     const result = await AppService.getAppSetting();
    //     const settings = result[0];

    //     const version = await AppService.getAppInfo('version');
    //     console.log(version);

    //     const showDebug = await AppService.getAppInfo('showDebug');
    //     console.log(showDebug);

    //     stateReference.current.language = settings.language;
    //     stateReference.current.startup = settings.startup;
    //     stateReference.current.minimize = settings.minimize;
    //     stateReference.current.update = settings.update;
    //     stateReference.current.sleep = settings.sleep;
    //     stateReference.current.sleeptime = settings.sleeptime;
    //     stateReference.current.tooltip = settings.tooltip;
    //     stateReference.current.theme = settings.theme;

    //     stateReference.current.languageOptions = await loadLanguageOptions();

    //     stateReference.current.version = version;
    //     stateReference.current.showDebug = showDebug;

    //     if(showDebug == true)
    //     {
    //       const buildVersion = await AppService.getAppInfo('buildVersion');
    //       stateReference.current.buildVersion = buildVersion;
    //     }

    //    setRgbSyncState(cloneState(stateReference.current));
    //}

    // const loadLanguageOptions = async () =>
    // {
    //     // todo: load from file names;
    //     return defaultLanguageOptions;
    // }

    // custom cloning function instead of 
    // `structuredClone` because may we want
    // to preserve custom object values, like
    // RGBAColor properties and UIList/DisplayOption properties
    const cloneState = (toClone: RGBSyncState) => {
        const newState = new RGBSyncState();

        //to-do

        // newState.language = toClone.language;
        // newState.startup = toClone.startup;
        // newState.minimize = toClone.minimize;
        // newState.update = toClone.update;
        // newState.sleep = toClone.sleep;
        // newState.sleeptime = toClone.sleeptime;
        // newState.tooltip = toClone.tooltip;
        // newState.theme = toClone.theme;
        // newState.version = toClone.version;
        // newState.buildVersion = toClone.buildVersion;
        // newState.showDebug = toClone.showDebug;

        return newState;
    }

    const saveRGBSyncData = async () => {
        //to-do
        // const settings = 
        // {
        //     language: stateReference.current.language,
        //     startup: stateReference.current.startup,
        //     minimize: stateReference.current.minimize,
        //     update: stateReference.current.update,
        //     sleep: stateReference.current.sleep,
        //     sleeptime: stateReference.current.sleeptime,
        //     tooltip: stateReference.current.tooltip,
        //     theme: stateReference.current.theme,
        // }
        //  await AppService.saveAppSetting(null);
    }


    const setLanguage = (value: string) => {
        // stateReference.current.language = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }
    const setOpenOnStartup = async (value: boolean) => {
        // stateReference.current.startup = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }
    const setMinimizedByDefault = (value: boolean) => {
        // stateReference.current.minimize = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }
    const setEnableAutomaticUpdates = (value: boolean) => {
        // stateReference.current.update = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }
    const setEnableTooltips = (value: boolean) => {
        // stateReference.current.tooltip = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }
    const setTheme = (value: string) => {
        // stateReference.current.theme = value;
        // setDisplayState(cloneState(stateReference.current));
        // return saveAppData();
    }

    const updateFunctions = {
        setLanguage,
        setOpenOnStartup,
        setMinimizedByDefault,
        setEnableAutomaticUpdates,
        setEnableTooltips,
        setTheme,
    };

    return <RGBSyncDisplayContext.Provider value={rgbSyncState}>
        <RGBSyncUpdateContext.Provider value={updateFunctions}>
            {children}
        </RGBSyncUpdateContext.Provider>
    </RGBSyncDisplayContext.Provider>
}

