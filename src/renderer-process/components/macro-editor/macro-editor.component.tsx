import React, { CSSProperties, MouseEvent, useEffect, useRef, useState } from 'react';
import './macro-editor.component.css';
import ToggleChoiceComponent from '../toggle-choice/toggle-choice.component';
import { ViewportList } from 'react-viewport-list';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { useDevicesContext } from '@renderer/contexts/devices.context';
import { useUIContext } from '@renderer/contexts/ui.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { useRecordsContext } from '@renderer/contexts/records.context';
import { MacroContent, MacroItem, MacroItemEntry, MacroRecord } from '../../../common/data/records/macro.record';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';

type DelayType = 'set-time' | 'as-recorded';

const MaxSupportedMilliseconds = 65535;
const MarkerInterval = 10; // milliseconds per interval
const MarkerWidth = 30; // pixels between markers
const MaxSupportedEntries = 80;

const TotalNumberOfMarkers = MaxSupportedMilliseconds / MarkerInterval;

const FieldMarkers: { id: number; milliseconds: number }[] = [];
for (let i = 0; i < TotalNumberOfMarkers; i++) {
    const milliseconds = i * 10;
    FieldMarkers.push({ id: i, milliseconds });
}

const MouseButtonKeyMap = ['mouse_left', 'mouse_middle', 'mouse_right', 'mouse_back', 'mouse_forward'];

// class MacroEntry extends MacroItemEntry
// {
//   constructor(public inputName: string, data: MacroItemEntry)
//   {
//     super(data.startTime, data.endTime, "", 0);
//     Object.assign(this, data);
//   }
// }

function MacroEditorComponent(props: any) {
    const { selectedMacro, isOpen, onCloseClick, onSave } = props;

    const devicesContext = useDevicesContext();
    const uiContext = useUIContext();
    const recordsContext = useRecordsContext();
    const translate = useTranslate();

    const [isRecording, setIsRecording] = useState(false);
    const [isSelectingMode, setIsSelectingMode] = useState(false);
    const [isShowingHelp, setIsShowingHelp] = useState(false);
    // const [ entryInputs, setEntryInputs ] = useState<Map<string, MacroEntry[]>>(new Map());
    const [entriesEndTime, setEntriesEndTime] = useState(0);
    const [entriesStartTime, setEntriesStartTime] = useState(0);
    // const [ editingMacro, setEditingMacro ] = useState<any>(null);
    const [editorIsOpen, setEditorIsOpen] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);

    const [selectedMacroData, setSelectedMacroData] = useState<MacroRecord | null>(null);
    const recordingMacroData = useRef<MacroRecord | null>(null);

    const [delayType, setDelayType] = useState<DelayType>('set-time');
    const [delayTime, setDelayTime] = useState(30);

    const [isEditingName, setIsEditingName] = useState(false);
    const nameInputRef = useRef(null);

    const recordingStartTime = useRef(0);
    const elapsedMilliseconds = useRef(0);
    const recordingInProgress = useRef(false); // different from isRecording; recordingInProgress controls recording behavior; isRecording handles event listeners and UI;
    // const recordingEntries = useRef<Map<string, MacroEntry[]>>(new Map());

    const recordingEntry = useRef<MacroItemEntry | null>(null);
    const recordingInterval = useRef<NodeJS.Timer | null>(null);
    const lastRecordedTime = useRef<number | null>(null);

    const [modeSelectIsOpen, setModeSelectIsOpen] = useState(false);

    const hasUnsavedData = useRef(false);

    const viewportList = useRef(null);
    const listHandle = useRef<any>(null);

    const [selectedItemKey, setSelectedItemKey] = useState<number | undefined>(undefined);

    const encodeKey = (index: number, index2: number) => {
        if (index2 > 0xffff) throw new Error('index2 too large!');
        return ((index + 1) << 16) + (index2 & 0xffff);
    };
    const decodeKey = (key: number) => {
        const index = ((key & ~0xffff) >> 16) - 1;
        const index2 = key & 0xffff;
        return { index, index2 };
    };

    const editEntry = async (key: number) => {};
    const deleteEntry = async (key: number) => {
        if (selectedMacroData == null) return;
        const keys = Object.getOwnPropertyNames(selectedMacroData.content);
        const asArray = keys.map((x) => selectedMacroData.content[x]);
        const { index, index2 } = decodeKey(key);
        const element = asArray[index] ? asArray[index].data[index2] : null;
        if (element) {
            selectedMacroData.content[keys[index]].data.splice(index2, 1);
            setSelectedItemKey(undefined);
            setSelectedMacroData(structuredClone(selectedMacroData));
        }
    };

    useEffect(() => {
        // this is being handled by a useEffect so that
        // it can be deconstructed with the return value
        setSelectedItemKey(undefined);
        if (isRecording == true) {
            listenForInput();
            return () => removeInputListeners();
        }
        return () => {};
    }, [isRecording]);

    const beginRecording = () => {
        if (selectedMacroData == null) {
            throw new Error('No Macro data to record to.');
        }
        console.log('recording');
        recordingInProgress.current = true;
        setCursorPosition(0);
        recordingStartTime.current = Date.now();
        elapsedMilliseconds.current = 0;
        listHandle.current.scrollToIndex({ index: 0, offset: -10 }); // without negative offset, will cause alignment-jump from zero position;

        recordingMacroData.current = structuredClone(selectedMacroData);
        recordingMacroData.current!.content = {};
        lastRecordedTime.current = null;

        setEntriesStartTime(0);
        setEntriesEndTime(0);

        setIsRecording(true);
    };

    const endRecording = () => {
        console.log('end recording');
        setIsRecording(false);
        // setEditingMacro(recordingMacroData.current);
        recordingInProgress.current = false;
        recordingStartTime.current = 0;
        removeInputListeners();
    };

    const intervalHandler = () => {
        if (recordingInProgress.current == false) {
            if (recordingEntry.current?.endTime != null) {
                setEntriesEndTime(recordingEntry.current.endTime);
            }

            clearInterval(recordingInterval.current!);
            return;
        }

        if (delayType == 'as-recorded') {
            elapsedMilliseconds.current = Date.now() - recordingStartTime.current;
        }

        if (listHandle.current != null) {
            const scrollIndex = Math.floor(elapsedMilliseconds.current / 10 / 3);
            // console.log(elapsedMilliseconds.current/20);
            // console.log(scrollIndex);
            if (scrollIndex > 15) {
                listHandle.current.scrollToIndex({ index: scrollIndex - 15 });
            }
        }
        setCursorPosition(elapsedMilliseconds.current);

        if (recordingMacroData.current != null) {
            setSelectedMacroData(recordingMacroData.current);

            const items = Object.keys(recordingMacroData.current.content);
            // console.log(recordingMacroData.current.content[items[0]]);
            if (items.length == 1 && recordingMacroData.current.content[items[0]].data[0].startTime > 0) {
                setEntriesStartTime(recordingMacroData.current.content[items[0]].data[0].startTime);
                setEntriesEndTime(recordingMacroData.current.content[items[0]].data[0].startTime);
            }
        }

        if (recordingEntry.current != null) {
            if (recordingEntry.current.endTime != null) {
                setEntriesEndTime(recordingEntry.current.endTime);
            } else {
                setEntriesEndTime(elapsedMilliseconds.current / 3);
            }
        }
    };

    const listenForInput = () => {
        recordingInterval.current = setInterval(intervalHandler, 15);

        document.addEventListener('keydown', key_onDown);
        document.addEventListener('keyup', key_onUp);
        document.addEventListener('mousedown', mouse_onDown);
        document.addEventListener('mouseup', mouse_onUp);
    };

    const key_onDown = (event: KeyboardEvent) => {
        if (event.repeat == true) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const keyId = event.code;
        console.log('keydown', keyId);
        recordInputStart(keyId);
        return false;
    };
    const key_onUp = (event: KeyboardEvent) => {
        const keyId = event.code;
        console.log('keyup', keyId);
        recordInputEnd(keyId);
    };
    const mouse_onDown = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        // check if stop recording button
        const clickTarget = event.target as HTMLElement;
        const closestButton = clickTarget.tagName == 'button' ? clickTarget : clickTarget.closest('button');
        if (closestButton != null && closestButton.classList.contains('no-record')) {
            return;
        }
        const buttonKey = (event as unknown as MouseEvent).button;
        const buttonId = MouseButtonKeyMap[buttonKey];
        console.log('mousedown', buttonId);
        recordInputStart(buttonId);

        if (buttonId == 'mouse_left') {
        }

        return false;
    };
    const mouse_onUp = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        // check if stop recording button
        const clickTarget = event.target as HTMLElement;
        const closestButton = clickTarget.tagName == 'button' ? clickTarget : clickTarget.closest('button');
        if (closestButton != null && closestButton.classList.contains('no-record')) {
            return;
        }

        const buttonKey = (event as unknown as MouseEvent).button;
        const buttonId = MouseButtonKeyMap[buttonKey];
        console.log('mousedown', buttonId);
        recordInputEnd(buttonId);
    };

    const recordInputStart = (inputId: string) => {
        recordingEntry.current = new MacroItemEntry(inputId, elapsedMilliseconds.current / 3);
        recordingMacroData.current!.content[inputId] ??= new MacroItem();
        recordingMacroData.current!.content[inputId].data.push(recordingEntry.current);
        if (delayType == 'set-time') elapsedMilliseconds.current += delayTime * 3;
    };

    const recordInputEnd = (inputId: string) => {
        if (recordingInProgress.current == false || recordingEntry.current == null) {
            return;
        }

        if (recordingMacroData.current!.content[inputId] == null) {
            console.error('how did this happen?');
            return;
        }

        recordingMacroData.current!.content[inputId].data.slice(-1)[0].endTime = elapsedMilliseconds.current / 3;
        if (delayType == 'set-time') elapsedMilliseconds.current += delayTime * 3;
    };

    const removeInputListeners = () => {
        document.removeEventListener('keydown', key_onDown);
        document.removeEventListener('keyup', key_onUp);
        document.removeEventListener('mousedown', mouse_onDown);
        document.removeEventListener('mouseup', mouse_onUp);

        if (recordingInterval.current != null) {
            if (recordingEntry.current?.endTime != null) {
                setEntriesEndTime(recordingEntry.current.endTime);
            }
            clearInterval(recordingInterval.current);
        }
    };

    const classes = `macro-editor${isRecording ? ' recording' : ''}${selectedMacroData && Object.getOwnPropertyNames(selectedMacroData.content).length > 0 ? ' has-entries' : ''}`;

    useEffect(() => {
        if (!isOpen) return;
        if (selectedMacro == null) {
            const macro = new MacroRecord();
            macro.value = recordsContext.macros.length + 1;
            setSelectedMacroData(macro);
            return;
        }

        // setEditingMacro(selectedMacro);
        const newMacro = new MacroRecord(selectedMacro);
        setSelectedMacroData(newMacro);

        const entryKeys = Object.keys(newMacro.content);
        let earliestStartTime = 0;
        let latestEndTime = 0;
        for (let i = 0; i < entryKeys.length; i++) {
            const key = entryKeys[i];
            const entry = selectedMacro.content[key] as MacroItem;
            for (let j = 0; j < entry.data.length; j++) {
                const data = entry.data[j] as MacroItemEntry;

                if (data.endTime != null && data.endTime > latestEndTime) {
                    latestEndTime = data.endTime;
                }
                earliestStartTime =
                    earliestStartTime == 0
                        ? data.startTime
                        : earliestStartTime > data.startTime
                          ? data.startTime
                          : earliestStartTime;
            }
        }
        // // const sortedInputs = JSON.parse(JSON.stringify(inputs)).sort((a: any, b: any) => { return a.startTime - b.startTime; });
        // setEntryInputs(inputs);
        setEntriesStartTime(earliestStartTime);
        setEntriesEndTime(latestEndTime);

        console.log(selectedMacro);
        // TODO: verify why selectedMacro is not working as dependency here
        // }, [selectedMacro]);
    }, [uiContext]);

    useEffect(() => {
        if (isOpen == null) {
            setEditorIsOpen(false);
            return;
        }
        setEditorIsOpen(isOpen);

        if (isOpen == true) {
            // initialize editor window
            setIsRecording(false);
            setIsSelectingMode(false);
            setIsShowingHelp(false);
        }

        // if(markers == null)
        // {
        //   setMarkers(getFieldMarkers());
        // }
    }, [isOpen]);

    return (
        <>
            <dialog
                className={classes}
                open={editorIsOpen ? true : undefined}
                data-recording={isRecording == true ? isRecording : null}
                data-help={isShowingHelp == true ? isShowingHelp : null}
                data-mode-select={isSelectingMode == true ? isSelectingMode : null}
                onClick={() => setSelectedItemKey(undefined)}
            >
                <div className="panel macro-help">
                    <button
                        type="button"
                        onClick={() => {
                            setIsShowingHelp(!isShowingHelp);
                        }}
                    >
                        <SVGIconComponent
                            className="help"
                            src="/images/icons/more-info.svg"
                            selected="/images/icons/more-info.svg"
                        />
                    </button>
                </div>
                <div className="panel name">
                    <div className="unsaved-indicator"></div>
                    <input
                        type="text"
                        ref={nameInputRef}
                        value={selectedMacroData?.name}
                        disabled={!isEditingName}
                        onFocus={(v) => v.target.select()}
                        onChange={(event) => {
                            if (selectedMacroData == null) {
                                return;
                            }

                            const data = structuredClone(selectedMacroData);
                            data.name = event.currentTarget.value;
                            setSelectedMacroData(data);
                        }}
                        onBlur={() => {
                            setIsEditingName(false);
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditingName(true);
                            (nameInputRef.current as unknown as HTMLInputElement)?.focus();
                        }}
                    >
                        <SVGIconComponent
                            className="help"
                            src="/images/icons/rename.svg"
                            selected="/images/icons/rename_hover.svg"
                        />
                    </button>
                </div>
                <div className="panel mode">
                    <button
                        type="button"
                        className="button embed toggle-mode-select"
                        onClick={() => {
                            setModeSelectIsOpen(!modeSelectIsOpen);
                        }}
                    >
                        <span className="current">
                            {selectedMacroData?.m_Identifier == '1' ? (
                                <SVGIconComponent className="macro-mode" src="/images/icons/macro_no-repeat.svg" />
                            ) : selectedMacroData?.m_Identifier == '2' ? (
                                <SVGIconComponent
                                    className="macro-mode"
                                    src="/images/icons/macro_repeat-while-holding.svg"
                                />
                            ) : selectedMacroData?.m_Identifier == '3' ? (
                                <SVGIconComponent className="macro-mode" src="/images/icons/macro_toggle.svg" />
                            ) : (
                                <></>
                            )}
                            <span className="label">
                                {selectedMacroData?.m_Identifier == '1'
                                    ? translate('Option_MacroType_NoRepeat', 'No Repeat')
                                    : selectedMacroData?.m_Identifier == '2'
                                      ? translate('Option_MacroType_RepeatWhileHolding', 'Repeat While Holding')
                                      : selectedMacroData?.m_Identifier == '3'
                                        ? translate('Option_MacroType_Toggle', 'Toggle')
                                        : translate('Option_MacroType_SelectMode', 'Select Mode')}
                            </span>
                        </span>
                    </button>
                </div>
                <div className="panel recording-actions">
                    {!isRecording ? (
                        <button
                            type="button"
                            className="button start-recording no-record"
                            title="Start Recording"
                            onClick={() => {
                                beginRecording();
                            }}
                        >
                            <SVGIconComponent
                                className="record start"
                                src="/images/icons/macro_start-recording.svg"
                                selected="/images/icons/macro_start-recording.svg"
                            />
                            <span className="text">
                                {translate('Button_MacroRecording_Start', 'Record Keystrokes')}
                            </span>
                        </button>
                    ) : null}
                    {isRecording ? (
                        <button
                            type="button"
                            className="button stop-recording no-record"
                            title="Stop Recording"
                            onClick={() => {
                                endRecording();
                            }}
                        >
                            <SVGIconComponent
                                className="record stop"
                                src="/images/icons/macro_stop-recording.svg"
                                selected="/images/icons/macro_stop-recording.svg"
                            />
                            <span className="text">{translate('Button_MacroRecording_Stop', 'Stop Recording')}</span>
                        </button>
                    ) : null}
                </div>
                <div className="panel close">
                    <button
                        type="button"
                        className="button embed close no-record"
                        title="Close Macro Editor"
                        onClick={() => {
                            if (onCloseClick != null) {
                                onCloseClick(hasUnsavedData.current);
                            }
                            hasUnsavedData.current = false;
                        }}
                    >
                        <SVGIconComponent
                            className="close"
                            src="/images/icons/close.svg"
                            selected="/images/icons/close_hover.svg"
                        />
                    </button>
                </div>
                <div className="panel field">
                    <div className="scroll-container" ref={viewportList}>
                        <div
                            className="recording-cursor"
                            style={{ ['--translation']: `${cursorPosition}px` } as CSSProperties}
                        ></div>
                        <div className="entries">
                            {
                                <div className="entry-types">
                                    {selectedMacroData != null && MacroContent.getSize(selectedMacroData.content) > 0
                                        ? Object.getOwnPropertyNames(selectedMacroData.content).map(
                                              (key: string, index: number) => {
                                                  const entryDescription = getEntryDescription(key);
                                                  let translationBuffer = 0; // buffer translation by widths of previous entries in the same input type; 5px padding means 10px is smallest increment per entry;
                                                  return (
                                                      <div
                                                          className="entry-type"
                                                          data-input={entryDescription.inputValue}
                                                          key={index}
                                                      >
                                                          {selectedMacroData.content[key]!.data.map(
                                                              (entry: MacroItemEntry, entryIndex: number) => {
                                                                  let endTime =
                                                                      entry.endTime == null
                                                                          ? elapsedMilliseconds.current / 3
                                                                          : entry.endTime;
                                                                  const entryWidth = (endTime - entry.startTime) * 3; // multiply by three because the milliseconds are a span of 10, but the markers are 30px wide; 30/10 = 3;
                                                                  const translation =
                                                                      entry.startTime * 3 - translationBuffer;
                                                                  translationBuffer +=
                                                                      entryWidth < 10 ? 10 : entryWidth;
                                                                  const entryKey = encodeKey(index, entryIndex);
                                                                  return (
                                                                      <>
                                                                          <a
                                                                              className={
                                                                                  'entry' +
                                                                                  (selectedItemKey === entryKey
                                                                                      ? ' selected'
                                                                                      : '')
                                                                              }
                                                                              key={entryKey}
                                                                              title={entryDescription.title}
                                                                              style={
                                                                                  {
                                                                                      ['--translation']: `${translation}px 0`,
                                                                                      ['--entry-width']: `${entryWidth}px`,
                                                                                  } as CSSProperties
                                                                              }
                                                                              onClick={(e) => {
                                                                                  e.preventDefault();
                                                                                  e.stopPropagation();
                                                                                  setSelectedItemKey(entryKey);
                                                                              }}
                                                                          >
                                                                              <div className="name">
                                                                                  {entryDescription.inputValue}
                                                                              </div>
                                                                          </a>
                                                                          <div
                                                                              className={
                                                                                  'callout' +
                                                                                  (selectedItemKey === entryKey
                                                                                      ? ' selected'
                                                                                      : '')
                                                                              }
                                                                              style={
                                                                                  {
                                                                                      ['--translation']: `${translation - entryWidth}px`,
                                                                                  } as CSSProperties
                                                                              }
                                                                          >
                                                                              <div className="options">
                                                                                  <button
                                                                                      type="button"
                                                                                      title="Edit"
                                                                                      className="button embed edit"
                                                                                      onClick={() =>
                                                                                          editEntry(entryKey)
                                                                                      }
                                                                                  >
                                                                                      <SVGIconComponent
                                                                                          className="edit"
                                                                                          src="/images/icons/rename.svg"
                                                                                          selected="/images/icons/rename_hover.svg"
                                                                                      />
                                                                                  </button>
                                                                                  <button
                                                                                      type="button"
                                                                                      title="Delete"
                                                                                      className="button embed delete"
                                                                                      onClick={() =>
                                                                                          deleteEntry(entryKey)
                                                                                      }
                                                                                  >
                                                                                      <SVGIconComponent
                                                                                          className="delete"
                                                                                          src="/images/icons/delete.svg"
                                                                                          selected="/images/icons/delete_hover.svg"
                                                                                      />
                                                                                  </button>
                                                                              </div>
                                                                          </div>
                                                                      </>
                                                                  );
                                                              },
                                                          )}
                                                      </div>
                                                  );
                                              },
                                          )
                                        : null}
                                </div>
                            }
                            <div className="recorded-limits">
                                <div className="handle start"></div>
                                <div
                                    className="recording-span"
                                    style={
                                        {
                                            width: `${(entriesEndTime - entriesStartTime) * 3}px`,
                                            ['--translation']: `${entriesStartTime * 3}px 0`,
                                        } as CSSProperties
                                    }
                                ></div>
                                <div className="handle end"></div>
                            </div>
                        </div>
                        <div className="markers">
                            <ViewportList
                                viewportRef={viewportList}
                                ref={listHandle}
                                items={FieldMarkers}
                                axis="x"
                                overscan={20}
                            >
                                {(marker) => (
                                    <div
                                        key={marker.id}
                                        className="item"
                                        style={
                                            {
                                                ['--item-width']: `${MarkerWidth}px`,
                                                ['--translation']: marker.id < 1000 ? '-15%' : '-50%',
                                            } as CSSProperties
                                        }
                                    >
                                        <div className="marker"></div>
                                        <div className="label">
                                            {marker.milliseconds}
                                            {marker.id != 0 ? '' : 'ms'}
                                        </div>
                                    </div>
                                )}
                            </ViewportList>
                        </div>
                    </div>
                </div>
                <div className="panel recording-type">
                    <div className="title">{translate('MacroEditor_Label_Delay', 'Delay')}</div>
                    <label>
                        <ToggleChoiceComponent
                            choice={delayType == 'set-time' ? 'a' : 'b'}
                            choiceAContent={
                                <>
                                    <SVGIconComponent className="set-time" src="/images/icons/macro_set-time.svg" />
                                    <span className="label">{translate('Toggle_SetTime', 'Set Time')}</span>
                                </>
                            }
                            choiceBContent={
                                <>
                                    <SVGIconComponent className="set-time" src="/images/icons/macro_as-recorded.svg" />
                                    <span className="label">{translate('Toggle_AsRecorded', 'As Recorded')}</span>
                                </>
                            }
                            onChange={(choice) => {
                                if (choice == 'a') {
                                    setDelayType('set-time');
                                } else {
                                    setDelayType('as-recorded');
                                }
                            }}
                        />
                    </label>
                    {delayType == 'set-time' ? (
                        <>
                            <div className="description">
                                {translate(
                                    'MacroEditor_Label_SetTimeDescription',
                                    'A consistent time delay between all keystrokes. Set value from 10ms to 10000ms.',
                                )}
                            </div>
                            <input
                                type="number"
                                className="time"
                                min={10}
                                max={10000}
                                value={delayTime}
                                onChange={(e) => setDelayTime(parseInt(e.currentTarget.value))}
                            />
                        </>
                    ) : (
                        <div className="description">
                            {translate(
                                'MacroEditor_Label_AsRecordedDescription',
                                'The delays between keystrokes will appear accurate to their recorded time.',
                            )}
                        </div>
                    )}
                </div>
                <div className="panel actions">
                    <button
                        type="button"
                        className="button save"
                        title="Save Macro"
                        onClick={() => {
                            if (onSave != null) {
                                onSave(selectedMacroData);
                            }
                        }}
                    >
                        <SVGIconComponent className="save" src="/images/icons/save-check.svg" />
                        <span className="label">{translate('Button_SaveMacro', 'Save Macro')}</span>
                    </button>
                </div>
                <div className={`macro-info${isShowingHelp == true ? ' show' : ''}`}>
                    <div className="info-box name-info">
                        {translate(
                            'Tooltip_Macro_Name',
                            'Change the name of your macro and access this information anytime.',
                        )}
                    </div>
                    <div className="info-box macro-type-info">
                        {translate('Tooltip_Macro_Type', 'Access the Macro Type selection menu.')}
                    </div>
                    <div className="info-box start-info">
                        {translate(
                            'Tooltip_Macro_ToggleButton',
                            'Use this button to start and pause the macro keystroke recording.',
                        )}
                    </div>
                    <div className="info-box exit-info">{translate('Tooltip_Macro_Exit', 'Exit')}</div>
                    <div className="info-box recording-type-info">
                        {translate(
                            'Tooltip_Macro_RecordingType',
                            'Selecting between Set Time or As Recorded allows you to either automatically set consistent delays between inputs, or record/adjust manually.',
                        )}
                    </div>
                    <div className="info-box save-button-info">
                        {translate('Tooltip_Macro_SaveButton', 'Save your macro.')}
                    </div>
                </div>
                <div className={`mode-options${modeSelectIsOpen == true ? ' show' : ''}`}>
                    <header>
                        {translate(
                            'MacroEditor_Label_MacroType_Description',
                            'Choose your desired type of macro to begin. You can change this at anytime.',
                        )}
                    </header>
                    <div className="options">
                        <div
                            className="option"
                            onClick={() => {
                                if (selectedMacroData == null) {
                                    return;
                                }
                                const data = structuredClone(selectedMacroData);
                                data.m_Identifier = '1';
                                setSelectedMacroData(data);
                                setModeSelectIsOpen(false);
                            }}
                        >
                            <header>
                                <div className="title">
                                    {translate('MacroEditor_Label_MacroType_NoRepeat_Title', 'No Repeat')}
                                </div>
                                <Icon type={IconType.MacroNoRepeat} color={Color.Base20} size={IconSize.Medium} />
                            </header>
                            <div className="description">
                                {translate(
                                    'MacroEditor_Label_MacroType_NoRepeat_Description',
                                    'A No Repeat macro performs once per activation of where it is assigned.',
                                )}
                            </div>
                        </div>
                        <div
                            className="option"
                            onClick={() => {
                                if (selectedMacroData == null) {
                                    return;
                                }
                                const data = structuredClone(selectedMacroData);
                                data.m_Identifier = '2';
                                setSelectedMacroData(data);
                                setModeSelectIsOpen(false);
                            }}
                        >
                            <header>
                                <div className="title">
                                    {translate(
                                        'MacroEditor_Label_MacroType_RepeatWhileHolding_Title',
                                        'Repeat While Holding',
                                    )}
                                </div>
                                <Icon
                                    type={IconType.MacroRepeatWhileHolding}
                                    color={Color.Base20}
                                    size={IconSize.Medium}
                                />
                            </header>
                            <div className="description">
                                {translate(
                                    'MacroEditor_Label_MacroType_RepeatWhileHolding_Description',
                                    "The assigned macro will perform continuously for as long as it's assigned trigger is held down.",
                                )}
                            </div>
                        </div>
                        <div
                            className="option"
                            onClick={() => {
                                if (selectedMacroData == null) {
                                    return;
                                }
                                const data = structuredClone(selectedMacroData);
                                data.m_Identifier = '3';
                                setSelectedMacroData(data);
                                setModeSelectIsOpen(false);
                            }}
                        >
                            <header>
                                <div className="title">
                                    {translate('MacroEditor_Label_MacroType_Toggle_Title', 'Toggle')}
                                </div>
                                <Icon type={IconType.MacroToggle} color={Color.Base20} size={IconSize.Medium} />
                            </header>
                            <div className="description">
                                {translate(
                                    'MacroEditor_Label_MacroType_Toggle_Description',
                                    'Upon activation, a Toggle macro performs continuously until activated a seconded time.',
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}

function getEntryDescription(inputName: string) {
    let inputValue = inputName.replace('Key', '');
    inputValue = inputValue.replace('Left', '');
    inputValue = inputValue.replace('Right', '');
    inputValue = inputValue.replace(/([A-Z]|(?<!F|\d)\d+)/g, ' $1').trim();

    let title = inputName.replace(/([A-Z]|(?<!F|\d)\d+)/g, ' $1').trim();

    return { inputValue, title };
}

export default MacroEditorComponent;
