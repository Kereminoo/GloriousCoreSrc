import EditableListComponent from '../editable-list/editable-list.component';
import { useTranslate } from '../../contexts/translations.context';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { useRecordsContext, useRecordsUpdateContext } from '../../contexts/records.context';
import { useUIContext, useUIUpdateContext } from '../../contexts/ui.context';
import { ExportMacro, ImportMacro } from '../../services/import-export.service';
import { MacroRecord } from '../../../common/data/records/macro.record';
import { useDevicesManagementContext } from '../../contexts/devices.context';
import { BindingTypes_ButtonPress } from '@renderer/data/binding-type';
import style from './macro-selector.component.module.css';

function MacroSelectorComponent() {
    const translate = useTranslate();

    const { openMacroEditor } = useUIUpdateContext();
    const { setKeybindingType, setKeybindMacroSelection } = useDevicesManagementContext();
    const { keybindSelectedBindingType, keybindMacroSelection } = useUIContext();

    const { deleteMacro, getMacros } = useRecordsUpdateContext();
    const { macros } = useRecordsContext();

    const importMacro = async () => {
        const result = await ImportMacro();
        console.log(`Import Macro: ${result.success ? 'Success' : 'Failure: ' + result.data}`);
        getMacros();
    };
    const exportMacro = async () => {
        if (!keybindMacroSelection) return;
        const result = await ExportMacro(keybindMacroSelection.value);
        console.log(`Export Macro: ${result.success ? 'Success' : 'Failure: ' + result.data}`);
    };

    return (
        <>
            <div className="main macro">
                <header>{translate('Device_Keybinding_Label_Macros', 'Macros')}</header>
                <p>
                    {translate(
                        'Device_Keybinding_Label_MacroDescription1',
                        "Selecting 'New Macro' will open the macro creation modal. Inside, you can choose the type of macro you want to create, set a name, and record & edit your inputs.",
                    )}
                </p>
                <p>
                    {translate(
                        'Device_Keybinding_Label_MacroDescription2',
                        'Saving from within the modal will add it to the macro list.',
                    )}
                </p>

                <button
                    className="glorious"
                    type="button"
                    onClick={() => {
                        setKeybindMacroSelection(undefined);
                        openMacroEditor();
                    }}
                >
                    {translate('Button_NewMacro', 'New Macro')}
                </button>
            </div>
            <div className="second macro">
                <div className="stack-container macros">
                    <EditableListComponent
                        className={style["macro-list"]}
                        items={macros.map((record: MacroRecord) => {
                            return { label: record.name, ref: record, id: record.value };
                        })}
                        noItemsMessage={translate('Device_Keybinding_Label_Macro_EmptyList', 'No Macros Saved')}
                        onClick={(item: any) => {
                            setKeybindingType(
                                BindingTypes_ButtonPress.find(
                                    (x) => x.optionKey == keybindSelectedBindingType?.optionKey,
                                ),
                            );
                            setKeybindMacroSelection(item.ref);
                        }}
                        onButtonClick={(action: string, item: any, _index: number) => {
                            switch (action) {
                                case 'edit': {
                                    setKeybindMacroSelection(item.ref);
                                    openMacroEditor();
                                    break;
                                }
                                case 'remove': {
                                    setKeybindMacroSelection(undefined);
                                    deleteMacro(item.ref.value);
                                    break;
                                }
                            }
                        }}
                        externalEditor={true}
                        selectedID={keybindMacroSelection?.value}
                    />
                </div>
                <div className="actions">
                    <button className={`hollow ${style["import-export-button"]}`} type="button" onClick={importMacro}>
                        <SVGIconComponent src="/images/icons/download.svg" />
                        <span className="label">{translate('Button_ImportMacro', 'Import Macro')}</span>
                    </button>
                    <button className={`hollow ${style["import-export-button"]}`} type="button" onClick={exportMacro}>
                        <SVGIconComponent src="/images/icons/upload.svg" />
                        <span className="label">{translate('Button_ExportMacro', 'Export Macro')}</span>
                    </button>
                    <div />
                </div>
            </div>
        </>
    );
}

export default MacroSelectorComponent;
