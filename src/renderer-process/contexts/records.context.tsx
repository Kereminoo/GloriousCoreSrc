import { LightingLayoutRecord } from 'src/common/data/records/lighting-layout.record';
import { MacroRecord } from 'src/common/data/records/macro.record';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    deleteLightingLayoutRecord,
    deleteMacroRecord,
    getLightingLayoutRecords,
    getMacroRecords,
    saveMacroRecord,
    updateLightingLayoutRecord,
} from '@renderer/services/records.service';

export class RecordsState {
    macros: MacroRecord[] = [];
    lightingLayouts: LightingLayoutRecord[] = [];
}

const RecordsDisplayContext = createContext<RecordsState>(new RecordsState());
const RecordsUpdateContext = createContext<{[key:string]:(...params:any[]) => void}>({});

export function useRecordsContext()
{
    return useContext(RecordsDisplayContext);
}
export function useRecordsUpdateContext()
{
    return useContext(RecordsUpdateContext);
}

export function RecordsContext({children})
{
    // reference holds single value in memory that gets updated
    // when the state changes; state gets provided with the ref
    // object, so it's not getting double-cloned on every update.
    const stateReference = useRef(new RecordsState());
    const [displayState, setDisplayState] = useState(stateReference.current);

    // initialize records on first load
    useEffect(() => {
        getMacros();
        getLightingLayouts();
    }, []);

    const getMacros = async () => {
        const records = await getMacroRecords();
        stateReference.current.macros = records;
        setDisplayState(cloneState(stateReference.current));
    };
    const updateMacro = async (macro: MacroRecord) => {
        await saveMacroRecord(macro);
        await getMacros();
    };
    const deleteMacro = async (value: number) => {
        await deleteMacroRecord(value);
        await getMacros();
    };
    const updateLightingLayout = async (lightingLayout: LightingLayoutRecord) => {
        await updateLightingLayoutRecord(lightingLayout);
    };
    const deleteLightingLayout = async (SN: string, value: number) => {
        await deleteLightingLayoutRecord(SN, value);
    };
    const getLightingLayouts = async () => {
        const records = await getLightingLayoutRecords();
        stateReference.current.lightingLayouts = records;
        setDisplayState(cloneState(stateReference.current));
    };

    const cloneState = (toClone: RecordsState) => {
        const newState = new RecordsState();

        newState.macros = toClone.macros;
        newState.lightingLayouts = toClone.lightingLayouts;

        return newState;
    };

    const updateFunctions = {
        getMacros,
        updateMacro,
        deleteMacro,
        getLightingLayouts,
        updateLightingLayout,
        deleteLightingLayout,
    };

    return (
        <RecordsDisplayContext.Provider value={displayState}>
            <RecordsUpdateContext.Provider value={updateFunctions}>{children}</RecordsUpdateContext.Provider>
        </RecordsDisplayContext.Provider>
    );
}
