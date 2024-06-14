import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUIContext, useUIUpdateContext } from './ui.context';
import { AppService } from '@renderer/services/app.service';
import { DisplayOption } from '@renderer/data/display-option';
import { useDevicesContext, useDevicesManagementContext } from './devices.context';
import { ProfileData } from 'src/common/data/records/device-data.record';
import { useTranslationsUpdateContext } from './translations.context';

const systemLang = navigator.language.split('-');

const defaultLanguageOptions = [
    new DisplayOption('ar', 'languageTitle_ar', 'Arabic - اَلْعَرَبِيَّةُ'),
    new DisplayOption('de', 'languageTitle_de', 'German - Deutsch'),
    new DisplayOption('en', 'languageTitle_en', 'English'),
    new DisplayOption('es', 'languageTitle_es', 'Spanish - Español'),
    new DisplayOption('fr', 'languageTitle_fr', 'French - Français'),
    new DisplayOption('he', 'languageTitle_he', 'Hebrew - עִבְֿרִית'),
    new DisplayOption('it', 'languageTitle_it', 'Italian - Italiano'),
    new DisplayOption('ja', 'languageTitle_ja', 'Japanese - 日本語'),
    new DisplayOption('ko', 'languageTitle_ko', 'Korean - 한국어'),
    new DisplayOption('pl', 'languageTitle_pl', 'Polish - Polski'),
    new DisplayOption('pt', 'languageTitle_pt', 'Portugese - Português'),
    new DisplayOption('th', 'languageTitle_th', 'Thai - ไทย'),
    new DisplayOption('tr', 'languageTitle_tr', 'Turkish - Türkçe'),
    new DisplayOption('vi', 'languageTitle_vi', 'Vietnamese - Tiếng Việt'),
    new DisplayOption('zh', 'languageTitle_zh', 'Traditional Chinese - 漢語'),
];

export class AppDataState {
    // save to DB
    language: string = defaultLanguageOptions.find((x) => x.optionKey == systemLang[0])?.optionKey ?? 'en';
    startup: boolean = false;
    minimize: boolean = false;
    update: boolean = true;
    sleep: boolean = false;
    sleeptime: number = 10;
    tooltip: boolean = true;
    theme: string = 'dark';

    // unusued in ui
    // exportVersion: number = 1;
    // remember: number = 0;
    // uuid: string = "";

    languageOptions: DisplayOption[] = defaultLanguageOptions;
    version: string = '';
    buildVersion?: string = '';
    showDebug: boolean = false;
}

const AppDataDisplayContext = createContext(new AppDataState());
const AppDataUpdateContext = createContext<{ [key: string]: (...params: any[]) => void }>({});

export function useAppDataContext() {
    return useContext(AppDataDisplayContext);
}
export function useAppDataUpdateContext() {
    return useContext(AppDataUpdateContext);
}

export function AppDataContext({ children }) {
    // reference holds single value in memory that gets updated
    // when the state changes; state gets provided with the ref
    // object, so it's not getting double-cloned on every update.
    const stateReference = useRef(new AppDataState());
    const [displayState, setDisplayState] = useState(stateReference.current);
    const isSaving = useRef(false);
    const hasUnsavedQueuedData = useRef(false);

    const devicesContext = useDevicesContext();
    const { getDeviceProfile, saveDeviceRgbOffAfterInactivity, saveDeviceRgbOffAfterInactivityTime } =
        useDevicesManagementContext();

    // initialize settings; listen for refresh events
    useEffect(() => {
        init();
    }, []);
    const init = async () => {
        const result = await AppService.getAppSetting();
        const settings = result[0];

        const version = await AppService.getAppInfo('version');
        console.log(version);

        const showDebug = await AppService.getAppInfo('showDebug');
        console.log(showDebug);

        stateReference.current.languageOptions = await loadLanguageOptions();

        stateReference.current.language = settings.language;
        stateReference.current.startup = settings.startup;
        stateReference.current.minimize = settings.minimize;
        stateReference.current.update = settings.update;
        stateReference.current.sleep = settings.sleep;
        stateReference.current.sleeptime = settings.sleeptime;
        stateReference.current.tooltip = settings.tooltip;
        stateReference.current.theme = settings.theme;

        stateReference.current.version = version;
        stateReference.current.showDebug = showDebug;

        if (showDebug == true) {
            const buildVersion = await AppService.getAppInfo('buildVersion');
            stateReference.current.buildVersion = buildVersion;
        }

        setOpenOnStartup(settings.startup);
        setDisplayState(cloneState(stateReference.current));
    };
    const loadLanguageOptions = async () => {
        // todo: load from file names?;
        return defaultLanguageOptions;
    };

    // custom cloning function instead of
    // `structuredClone` because may we want
    // to preserve custom object values, like
    // RGBAColor properties and UIList/DisplayOption properties
    const cloneState = (toClone: AppDataState) => {
        const newState = new AppDataState();

        newState.language = toClone.language;
        newState.startup = toClone.startup;
        newState.minimize = toClone.minimize;
        newState.update = toClone.update;
        newState.sleep = toClone.sleep;
        newState.sleeptime = toClone.sleeptime;
        newState.tooltip = toClone.tooltip;
        newState.theme = toClone.theme;
        newState.version = toClone.version;
        newState.buildVersion = toClone.buildVersion;
        newState.showDebug = toClone.showDebug;

        return newState;
    };

    const saveAppData = async () => {
        const settings = {
            language: stateReference.current.language,
            startup: stateReference.current.startup,
            minimize: stateReference.current.minimize,
            update: stateReference.current.update,
            sleep: stateReference.current.sleep,
            sleeptime: stateReference.current.sleeptime,
            tooltip: stateReference.current.tooltip,
            theme: stateReference.current.theme,
        };

        if (isSaving.current == true) {
            hasUnsavedQueuedData.current = true;
            return;
        }

        isSaving.current = true;
        await AppService.saveAppSetting(settings);

        if (hasUnsavedQueuedData.current == true) {
            await saveAppData();
            hasUnsavedQueuedData.current = false;
        }

        isSaving.current = false;
    };

    const setLanguage = (value: string) => {
        stateReference.current.language = value;
        setDisplayState(cloneState(stateReference.current));
        return saveAppData();
    };
    const setOpenOnStartup = async (value: boolean) => {
        stateReference.current.startup = value;
        setDisplayState(cloneState(stateReference.current));
        saveAppData();
        await AppService.saveStartupSetting(value);
    };
    const setMinimizedByDefault = (value: boolean) => {
        stateReference.current.minimize = value;
        setDisplayState(cloneState(stateReference.current));
        return saveAppData();
    };
    const setEnableAutomaticUpdates = (value: boolean) => {
        stateReference.current.update = value;
        setDisplayState(cloneState(stateReference.current));
        return saveAppData();
    };
    const setGlobalStandby = (value: boolean) => {
        stateReference.current.sleep = value;
        setDisplayState(cloneState(stateReference.current));

        for (let i = 0; i < devicesContext.devices.length; i++) {
            const profile = getDeviceProfile(devicesContext.devices[i]);
            if (
                profile?.lighting != null
                // && todo
            ) {
                saveDeviceRgbOffAfterInactivity(devicesContext.devices[i], value);
            }
        }

        return saveAppData();
    };
    const setGlobalStandbyTimer = (value: number) => {
        stateReference.current.sleeptime = value;
        setDisplayState(cloneState(stateReference.current));

        for (let i = 0; i < devicesContext.devices.length; i++) {
            const profile = getDeviceProfile(devicesContext.devices[i]);
            if (
                profile?.lighting != null
                // && todo
            ) {
                saveDeviceRgbOffAfterInactivityTime(devicesContext.devices[i], value);
            }
        }
        return saveAppData();
    };
    const setEnableTooltips = (value: boolean) => {
        stateReference.current.tooltip = value;
        setDisplayState(cloneState(stateReference.current));
        return saveAppData();
    };
    const setTheme = (value: string) => {
        stateReference.current.theme = value;
        setDisplayState(cloneState(stateReference.current));
        return saveAppData();
    };

    const updateFunctions = {
        setLanguage,
        setOpenOnStartup,
        setMinimizedByDefault,
        setEnableAutomaticUpdates,
        setGlobalStandby,
        setGlobalStandbyTimer,
        setEnableTooltips,
        setTheme,
    };

    return (
        <AppDataDisplayContext.Provider value={displayState}>
            <AppDataUpdateContext.Provider value={updateFunctions}>{children}</AppDataUpdateContext.Provider>
        </AppDataDisplayContext.Provider>
    );
}
