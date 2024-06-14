import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDataContext } from './app-data.context';

export const TranslationsDisplayContext = createContext<Translation[]>([]);
export const TranslationsUpdateContext = createContext<{[key:string]:(...params:any[]) => void}>({});

export type Translation =
{
    key: string;
    value: string;
}

export function useTranslationsContext()
{
    return useContext(TranslationsDisplayContext);
}
export function useTranslationsUpdateContext()
{
    return useContext(TranslationsUpdateContext);
}

export function useTranslate()
{
    const context = useContext(TranslationsDisplayContext);

    return (key?: string, fallback?: string) => 
    {
        if(key == null || `${key}`.trim() == "") { return fallback; }
        const translation = context?.find((translation: Translation) => translation.key === key)?.value;

        return translation || fallback || key;
    }
}

export const TranslationsContext = ({ children }) => 
{
    const [translations, setTranslations] = useState<Translation[]>([]);

    const appDataContext = useAppDataContext();

    useEffect(() =>
    {
        console.log(appDataContext.language);
        updateTranslations(appDataContext.language);
    }, [appDataContext.language]);

    const updateTranslations = async (key: string = 'en') =>
    {
        const value = await (await fetch(`${(import.meta.env.PROD) ? "." : ""}/i18n/${key}.json`)).json();
        if(value != null)
        {
            setTranslations(value as Translation[]);
            // console.log('translations', updatedTranslations);
        }
    }

    const updateFunctions = {updateTranslations};

    return (<TranslationsDisplayContext.Provider value={translations}>
        <TranslationsUpdateContext.Provider value={updateFunctions}>
            {children}
        </TranslationsUpdateContext.Provider>
    </TranslationsDisplayContext.Provider>)
}