import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ColorPickerComponent from '../../components/color-picker/color-picker.component';
import RangeComponent from '../../components/range/range.component';
import ToggleComponent from '../../components/toggle/toggle.component';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import OptionSelectComponent from '@renderer/components/option-select/option-select.component';
import ToggleChoiceComponent from '@renderer/components/toggle-choice/toggle-choice.component';
import ContentDialogComponent from '@renderer/components/content-dialog/content-dialog.component';
import EditableListComponent from '@renderer/components/editable-list/editable-list.component';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useUIContext, useUIUpdateContext } from '@renderer/contexts/ui.context';
import {
    LightingLayoutBlockColor,
    LightingLayoutContent,
    LightingLayoutLightData,
    LightingLayoutRecord,
} from '../../../common/data/records/lighting-layout.record';
import { useRecordsContext, useRecordsUpdateContext } from '@renderer/contexts/records.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import { DisplayOption } from '@renderer/data/display-option';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { DevicesAdapter } from '@renderer/adapters/devices.adapter';
import { ColorSettingStyle } from '@renderer/data/color-setting-style';
import { ProfileData } from 'src/common/data/records/device-data.record';
import { IconSize, IconType } from '@renderer/components/icon/icon.types';
import { Color } from '@renderer/components/component.types';
import Icon from '@renderer/components/icon/icon';
import { PerKeyAction } from '@renderer/data/per-key-action.data';
import ColorPicker_New from '@renderer/components/color-picker-new/color-picker';
import { QuickKeyId } from '../../../common/data/device-input-layout.data';

const FKeyDeviceSNs = [
    '0x320F0x5044',
    '0x320F0x5092',
    '0x320F0x5046',
    '0x320F0x5093',
    '0x320F0x504B',
    '0x320F0x505A',
    '0x342D0xE3C8',
    '0x342D0xE3DF',
    '0x342D0xE3D1',
    '0x342D0xE3C9',
    '0x342D0xE3DE',
    '0x342D0xE3D2',
    '0x342D0xE3C5', 
    '0x342D0xE3CB', 
    '0x342D0xE3CE', 
    '0x342D0xE3D4', 
    '0x342D0xE3C6', 
    '0x342D0xE3CC', 
    '0x342D0xE3CF', 
    '0x342D0xE3D5', 
    '0x342D0xE3DC',
    '0x342D0xE3D9',
    '0x342D0xE3F1',
    '0x342D0xE3EE',
    '0x342D0xE3DB',
    '0x342D0xE3D8',
    '0x342D0xE3F0',
    '0x342D0xE3ED',
];

function KeyboardLightingManagementPage(props: any) {
    const devicesContext = useDevicesContext();

    const uiContext = useUIContext();
    const {
        setColor_PresetColorPicker,
        setColor_PerKeyColorPicker,
        setColor_ModalColorPicker,
        setLightingColorStyle,
        setLightSettingMode,
        openColorModal,
        setSelectedPerKeyAction,
    } = useUIUpdateContext();

    const {
        getCurrentProfile,
        setSelectedPerKeyLayout,
        setKeyboardPresetLightingEffect,
        setPresetLightingSpeed,
        setPresetLightingWiredBrightness,
        setPresetLightingWirelessBrightness,
        setPresetSeparateWiredWirelessBrightness,
        setKeyboardPresetLightingColor,
        setKeyboardPresetLightingColorStyle,
        // addToPerKeyLayoutSelection,
        addQuickKeysToPerKeyLayoutSelection,
        removeFromPerKeyLayoutSelection, 
    } = useDevicesManagementContext();

    const { getLightingLayouts, updateLightingLayout, deleteLightingLayout } = useRecordsUpdateContext();

    const recordsContext = useRecordsContext();
    const translate = useTranslate();

    const [presetEffectOptions, setPresetEffectOptions] = useState<any[]>([]);
    const [currentGradient, setCurrentGradient] = useState<DisplayOption>();
    const [colorDialogIsOpen, setColorDialogIsOpen] = useState(false);

    const [deviceLayoutRecords, setDeviceLayoutRecords] = useState<LightingLayoutRecord[]>([]);
    const [layoutItems, setLayoutItems] = useState<{ label: string, id?: number }[]>([]);

    const colorArray = useMemo(() => {
        // console.log('updated colors', getCurrentProfile()?.light_PRESETS_Data?.colors);
        return  getCurrentProfile()?.light_PRESETS_Data?.colors ?? [];
    }, [getCurrentProfile()?.light_PRESETS_Data?.colors]);

    const selectedPresetColor = useMemo(()=>{
        // console.log('updated selected color', getCurrentProfile()?.light_PRESETS_Data?.colors, uiContext.selectedColorIndex);
        const colorArray = getCurrentProfile()?.light_PRESETS_Data?.colors;
        if (colorArray == null || colorArray.length <= uiContext.selectedColorIndex) return '#000000';
        return colorArray[uiContext.selectedColorIndex];
    },[uiContext.selectedColorIndex, colorArray]);

    const ColorPicker_OnChange = (color: RGBAColor) =>
    {
        // console.log(selectedPresetColor, color);
        
        setColor_PresetColorPicker(color);
        // const colorArray = getCurrentProfile()?.light_PRESETS_Data?.colors ?? [];

        colorArray[uiContext.selectedColorIndex] = color.toHex();
        setKeyboardPresetLightingColor(colorArray);
    };

    const ColorPickerExpanded_OnChange = (color: RGBAColor) =>
    {
        // console.log(selectedPresetColor, color);
        
        setColor_ModalColorPicker(color);
        // const colorArray = getCurrentProfile()?.light_PRESETS_Data?.colors ?? [];

        colorArray[uiContext.selectedColorIndex] = color.toHex();
        setKeyboardPresetLightingColor(colorArray);
    };

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }

        const profile = getCurrentProfile();
        if (profile == null) {
            throw new Error('Profile is undefined');
        }

        setPresetEffectOptions(
            devicesContext.previewDevice.lightingEffects.map((item) => {
                return {
                    value: item.value,
                    label: translate(item.translationKey, item.data?.translationFallback),
                };
            }),
        );

        const items: { label: string, id?: number }[] = [];
        const records: LightingLayoutRecord[] = [];
        for (let i = 0; i < recordsContext.lightingLayouts.length; i++) {
            if (recordsContext.lightingLayouts[i].SN == devicesContext.previewDevice.SN) {
                items.push({ label: recordsContext.lightingLayouts[i].name, id: items.length });
                records.push(recordsContext.lightingLayouts[i]);
            }
        }
        setLayoutItems(items);
        setDeviceLayoutRecords(records);

        // selected gradient isn't stored; only colors;
        // determine gradient selection by the colors
        for (let i = 0; i < devicesContext.previewDevice.rgbGradients.length; i++) {
            const gradient = devicesContext.previewDevice.rgbGradients[i];

            const stops = gradient.data?.stops;
            if (stops == null) {
                // todo;
                return;
            }

            let foundMismatch = false;
            for (let j = 0; j < stops.length; j++) {
                if (profile.lighting?.Color[j] == null) {
                    foundMismatch = true;
                    break;
                }
                const profileColor = RGBAColor.fromRGB(
                    profile.lighting?.Color[j].R,
                    profile.lighting?.Color[j].G,
                    profile.lighting?.Color[j].B,
                );
                if (profileColor.toHex() != stops[j].hex.toLowerCase()) {
                    foundMismatch = true;
                    break;
                }
            }
            if (foundMismatch) {
                continue;
            }

            setCurrentGradient(gradient);
            break;
        }
    }, [devicesContext.previewDevice]);

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }
        const items: { label: string, id?: number }[] = [];
        const records: LightingLayoutRecord[] = [];
        for (let i = 0; i < recordsContext.lightingLayouts.length; i++) {
            if (recordsContext.lightingLayouts[i].SN == devicesContext.previewDevice.SN) {
                items.push({ label: recordsContext.lightingLayouts[i].name, id: items.length });
                records.push(recordsContext.lightingLayouts[i]);
            }
        }
        setLayoutItems(items);
        setDeviceLayoutRecords(records);
    }, [recordsContext.lightingLayouts]);

    useEffect(() => {
        const profile = getCurrentProfile();
        if (profile == null) {
            return;
        }

        if (uiContext.lightSettingMode == 'per-key') {
            if (profile.light_PERKEY_Data == null) {
                console.error(new Error("Current Device's perkey lighting data is undefined."));
                return;
            }
            const lightingLayout = recordsContext.lightingLayouts[profile.light_PERKEY_Data.value];
            const lightingArray = lightingLayout.content.AllBlockColor;

            if (uiContext.perKeyLightingSelectedNode == null) {
                return;
            }
            const lightingItem = lightingArray[uiContext.perKeyLightingSelectedNode.keybindArrayIndex];

            lightingItem.color = [
                uiContext.activeLightingPicker_selectedColor.r,
                uiContext.activeLightingPicker_selectedColor.g,
                uiContext.activeLightingPicker_selectedColor.b,
                1,
            ];
        }
    }, [uiContext.lightSettingMode]);

    return (
        <>
            <div
                className={`layout lighting keyboard${uiContext.lightSettingMode == 'none' ? '' : ` ${uiContext.lightSettingMode}`}`}
            >
                {uiContext.lightSettingMode == 'none' ? (
                    <>
                        <div className="panel main">
                            <div className="stack mode-select">
                                <a
                                    className="option"
                                    onClick={() => {
                                        setLightSettingMode('preset');
                                    }}
                                >
                                    {translate('Option_LightSettingMode_PresetEffects', 'Preset Effects')}
                                </a>
                                <a
                                    className="option"
                                    onClick={() => {
                                        setLightSettingMode('per-key');
                                    }}
                                >
                                    {translate('Option_LightSettingMode_CustomPerKey', 'Custom Per Key')}
                                </a>
                            </div>
                        </div>
                    </>
                ) : null}
                {uiContext.lightSettingMode == 'preset' ? (
                    <>
                        <div className="panel main">
                            <header>
                                <div className="title">
                                    {translate('Device_Lighting_Label_PresetEffect', 'Preset Effect')}
                                </div>
                            </header>
                            <OptionSelectComponent
                                options={presetEffectOptions}
                                value={getCurrentProfile()?.light_PRESETS_Data?.value}
                                onChange={(value) => {
                                    const index = parseInt(value);
                                    setKeyboardPresetLightingEffect(index);
                                }}
                            />
                            {/* {(devicesContext.presetEffectHasFixedColors == true) ? <></>
                            : 
                            <div className="setting color-style">
                                <header>
                                    <div className="title">
                                        {translate('Device_Lighting_Label_ColorStyle', 'Color Style')}
                                    </div>
                                </header>
                                <label>
                                    <ToggleChoiceComponent
                                        choice={
                                            uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient' ? 'a' : 'b'
                                        }
                                        choiceAContent={
                                            <>
                                                {translate(
                                                    ColorSettingStyle[1].translationKey,
                                                    ColorSettingStyle[1].data.translationFallback,
                                                )}
                                            </>
                                        }
                                        choiceBContent={
                                            <>
                                                {translate(
                                                    ColorSettingStyle[0].translationKey,
                                                    ColorSettingStyle[0].data.translationFallback,
                                                )}
                                            </>
                                        }
                                        // disableChoiceA={!uiContext.lightingSelectedPreset?.data?.enableGradients}
                                        // disableChoiceB={!uiContext.lightingSelectedPreset?.data?.enableColorSelection}
                                        onChange={(choice) => {
                                            if (choice == 'a') {
                                                // setLightingColorStyle(ColorSettingStyle[1]);
                                                // setKeyboardPresetLightingColorStyle(ColorSettingStyle[1].optionKey);
                                            } else {
                                                // setLightingColorStyle(ColorSettingStyle[0]);
                                                // setKeyboardPresetLightingColorStyle(ColorSettingStyle[0].optionKey);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            } */}
                            {DevicesAdapter.isWirelessKeyboard(devicesContext.previewDevice?.SN) ? (
                                <div className="setting separate-brightness">
                                    <header className="">
                                        <div className="title">
                                            {translate(
                                                'Device_Lighting_Label_SeparateBrightness_WiredWireless',
                                                'Separate Wired / Wireless Brightness Setting',
                                            )}
                                        </div>
                                        <label>
                                            <ToggleComponent
                                                value={getCurrentProfile()?.light_PRESETS_Data?.separateBrightness}
                                                onChange={(value) => {
                                                    setPresetSeparateWiredWirelessBrightness(value);
                                                }}
                                            />
                                        </label>
                                    </header>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="panel second">
                            <div className="controls">
                                {getCurrentProfile()?.light_PRESETS_Data.value != 0 ? ( // glorious mode is a single rate
                                    <label className="field rate">
                                        <span className="label">
                                            {translate('Device_Lighting_Label_Rate', 'Rate')}
                                            <span className="result">
                                                {getCurrentProfile()?.light_PRESETS_Data?.speed}&#x25;
                                            </span>
                                        </span>
                                        <RangeComponent
                                            value={getCurrentProfile()?.light_PRESETS_Data?.speed}
                                            onChange={(value) => {
                                                setPresetLightingSpeed(value);
                                            }}
                                        />
                                    </label>
                                ) : (
                                    <></>
                                )}
                                <label
                                    className="field wireless-brightness"
                                    style={
                                        {
                                            '--opacity':
                                                getCurrentProfile()?.light_PRESETS_Data?.separateBrightness == true
                                                    ? 1
                                                    : 0,
                                            '--height':
                                                getCurrentProfile()?.light_PRESETS_Data?.separateBrightness == true
                                                    ? 'auto'
                                                    : '0',
                                        } as React.CSSProperties
                                    }
                                >
                                    <span className="label">
                                        {translate('Device_Lighting_Label_Brightness_Wireless', 'Wireless Brightness')}
                                        <span className="result">
                                            {getCurrentProfile()?.light_PRESETS_Data?.wirelessBrightness}&#x25;
                                        </span>
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.light_PRESETS_Data?.wirelessBrightness}
                                        onChange={(value) => {
                                            setPresetLightingWirelessBrightness(value);
                                        }}
                                    />
                                </label>
                                <label className="field brightness">
                                    <span className="label">
                                        {translate('Device_Lighting_Label_Brightness', 'Brightness')}
                                        <span className="result">
                                            {getCurrentProfile()?.light_PRESETS_Data?.brightness}&#x25;
                                        </span>
                                    </span>
                                    <RangeComponent
                                        value={getCurrentProfile()?.light_PRESETS_Data?.brightness}
                                        onChange={(value) => {
                                            setPresetLightingWiredBrightness(value);
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        {(devicesContext.presetEffectHasFixedColors == true) ? <></>
                        // : uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient' 
                        // ? (
                        //     <div className="panel third">
                        //         <header>
                        //             <div className="title">
                        //                 {translate('Device_Lighting_Label_RGBGradient', 'RGB Gradient')}
                        //             </div>
                        //         </header>
                        //         <div className="stack gradient-select">
                        //             {devicesContext.previewDevice?.rgbGradients.map((gradient, index) => (
                        //                 <a
                        //                     key={index}
                        //                     className={`option${gradient == currentGradient ? ' selected' : ''}`}
                        //                     title={translate(
                        //                         gradient.translationKey,
                        //                         gradient.data?.translationFallback,
                        //                     )}
                        //                     onClick={() => {
                        //                         setCurrentGradient(gradient);
                        //                         const colors = gradient.data.stops.map((item) => {
                        //                             return item.hex.toLowerCase();
                        //                         });
                        //                         setKeyboardPresetLightingColor(colors);
                        //                     }}
                        //                 >
                        //                     <span className="name">
                        //                         {translate(gradient.translationKey, gradient.data?.translationFallback)}
                        //                     </span>
                        //                     <span
                        //                         className="gradient"
                        //                         style={{
                        //                             background: `linear-gradient(to right, ${gradient.data?.stops.reduce(
                        //                                 (accumulatedString, stop, i) => {
                        //                                     const stopString =
                        //                                         stop.stop == undefined
                        //                                             ? stop.hex
                        //                                             : `${stop.hex} ${stop.stop}`;
                        //                                     if (i == gradient.data.stops.length - 1) {
                        //                                         accumulatedString += stopString;
                        //                                     } else {
                        //                                         accumulatedString += stopString + ', ';
                        //                                     }
                        //                                     return accumulatedString;
                        //                                 },
                        //                                 '',
                        //                             )})`,
                        //                         }}
                        //                     ></span>
                        //                 </a>
                        //             ))}
                        //         </div>
                        //     </div>
                        // ) 
                        : (
                            <div className="panel third color-picker">
                                <header>
                                    <div className="title">
                                        {translate('ColorPicker_Label_ColorPicker', 'Color Picker')}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setColorDialogIsOpen(true);
                                        }}
                                    >
                                        {translate('Button_Expand', 'Expand')}
                                    </button>
                                </header>
                                <ColorPickerComponent
                                    // value={uiContext.colorPickerValue_PresetLighting}
                                    value={RGBAColor.fromHex(selectedPresetColor)}
                                    onChange={ColorPicker_OnChange}
                                />
                                {/* <ColorPicker_New value={RGBAColor.fromHex(getCurrentProfile()?.light_PRESETS_Data?.colors[uiContext.selectedColorIndex])} /> */}
                            </div>
                        )
                        }
                        
                    </>
                ) : null}
                {uiContext.lightSettingMode == 'per-key' ? (
                    <>
                        <div className="panel main">
                            <div className="stack-container custom-layouts">
                                <header>
                                    <div className="title">
                                        {translate('Device_Lighting_Label_CustomPerKey', 'Custom Per Key')}
                                    </div>
                                    <button
                                        onClick={() => {
                                            const layout = new LightingLayoutRecord();
                                            layout.SN = devicesContext.previewDevice!.SN;
                                            layout.devicename = devicesContext.previewDevice!.devicename;

                                            const highestValue = deviceLayoutRecords.reduce((highest, item, index) => {
                                                if (item.value >= highest) {
                                                    return item.value;
                                                } else {
                                                    return highest;
                                                }
                                            }, 1);
                                            layout.value = highestValue + 1;

                                            layout.name = `Layout ${layout.value}`;

                                            const allBlockColor = [].fill(
                                                new LightingLayoutBlockColor(),
                                                0,
                                                (getCurrentProfile() as ProfileData).maxKayCapNumber,
                                            );
                                            layout.content = new LightingLayoutContent(
                                                allBlockColor,
                                                new LightingLayoutLightData(),
                                            );

                                            //   var T = {
                                            //     name:'NewLayout',
                                            //     value:0,
                                            //     m_Identifier:'',
                                            //     content:{},
                                            //     SN:"Error",
                                            //     devicename:'Error'
                                            // }

                                            // var colorArr=[];
                                            // for (let index = 0; index < this.maxkaycapNumber; index++) {
                                            //     colorArr.push({
                                            //         clearStatus:false,
                                            //         color: [0,0,0,0],
                                            //         breathing:false,
                                            //         border: true,
                                            //         coordinateData:[],
                                            //         keyCode:''}
                                            //         )
                                            // }
                                            // var tempObj = this.defaultModule();
                                            // tempObj.content ={
                                            //     AllBlockColor:colorArr,
                                            //     lightData:this.getDefaultData()
                                            // };
                                            // tempObj.name='Layout 1';
                                            // tempObj.SN=this.deviceObj.SN;
                                            // tempObj.devicename=this.deviceObj.devicename;
                                            // this.nowEditName = this.nowlayoutSelect.name;
                                            updateLightingLayout(layout);

                                            setTimeout(() => {
                                                getLightingLayouts();
                                            }, 3);
                                        }}
                                    >
                                        <Icon type={IconType.PlusOutline} size={IconSize.XSmall} color={Color.Base30} />
                                    </button>
                                </header>
                                <EditableListComponent
                                    noItemsMessage={
                                        <span>
                                            {translate('Device_Lighting_Label_NoCustomLayouts', 'No Custom Layouts')}
                                        </span>
                                    }
                                    items={layoutItems}
                                    onClick={(value: any, index: number) => {
                                        setSelectedPerKeyLayout(index + 1);
                                    }}
                                    selectedID={getCurrentProfile()?.light_PERKEY_Data.value-1}
                                    onButtonClick={(action, item, index) => {
                                        if (action == 'remove') {
                                            const layout = deviceLayoutRecords[index];
                                            deleteLightingLayout(layout.SN, layout.value);

                                            setTimeout(() => {
                                                getLightingLayouts();
                                            }, 3);

                                            return;
                                        } else if (action == 'edit') {
                                            const layout = deviceLayoutRecords[index];

                                            // console.log(item, layout);
                                            layout.name = item.label;
                                            updateLightingLayout(layout);

                                            setTimeout(() => {
                                                getLightingLayouts();
                                            }, 3);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="panel second per-key-settings">
                            <div className="top-row">
                                <div className="action">
                                    <header>
                                        <div className="title">
                                            {translate('Device_Lighting_Label_Action', 'Action')}
                                        </div>
                                        <span className="status">{(uiContext.selectedPerKeyAction == PerKeyAction.Add) ? translate('Device_Lighting_Label_Add', 'Add'): translate('Device_Lighting_Label_Remove', 'Remove')}</span>
                                    </header>
                                    <label>
                                        <Icon type={IconType.CancelCross} size={IconSize.XSmall} color={(uiContext.selectedPerKeyAction == PerKeyAction.Remove) ? Color.Glorange60 : Color.Base20} />
                                        <ToggleComponent
                                            value={(uiContext.selectedPerKeyAction == PerKeyAction.Add)}
                                            onChange={(value) => {
                                                setSelectedPerKeyAction((value == PerKeyAction.Add));
                                            }}
                                        />
                                        <Icon type={IconType.Edit} size={IconSize.Smaller} color={(uiContext.selectedPerKeyAction == PerKeyAction.Add) ? Color.Glorange60 : Color.Base20} />
                                    </label>
                                </div>
                                <div className="breathing">
                                    <header className="title">{translate('Device_Lighting_Label_Breathing', 'Breathing')}</header>
                                    <label>
                                        <ToggleComponent
                                            value={uiContext.selectedPerKeyData?.breathing}
                                            onChange={(value) => {
                                                // setSelectePerKeyBreathing(value);
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="brightness">
                                <header>
                                    <div className="title">
                                        {translate('Device_Lighting_Label_Brightness', 'Brightness')}
                                    </div>
                                    <span>{uiContext.selectedPerKeyData?.brightness}</span>
                                </header>
                                <RangeComponent
                                    className="brightness"
                                    value={uiContext.selectedPerKeyData?.brightness}
                                    onChange={(value) => {
                                        // setSelectePerKeyBrightness(value);
                                    }}
                                />
                                </div>
                            </div>
                            <div className="quick-keys">
                                <header>
                                    <div className="title">
                                        {translate('Device_Lighting_Label_QuickKeySelection', 'Quick Key Selection')}
                                    </div>
                                </header>
                                <span className="options">
                                    <span className="row one">
                                        {devicesContext.previewDevice?.SN != '0x320F0x5088' &&
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.WASD);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_WASD', 'WASD')}
                                        </button>}
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.Numbers);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_Numbers', 'Numbers')}
                                        </button>
                                        { false && 
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.Sidelights);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_SideLights', 'Side Lights')}
                                        </button>
                                        }
                                    </span>
                                    <span className="row two">
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.Modifiers);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_Modifiers', 'Modifiers')}
                                        </button>
                                        {devicesContext.previewDevice != null && FKeyDeviceSNs.indexOf(devicesContext.previewDevice.SN) > -1 && 
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.FKeys);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_FKeys', 'F Keys')}
                                        </button>}                                        
                                        {devicesContext.previewDevice?.SN != '0x320F0x5088' &&
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.Arrows);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_Arrows', 'Arrows')}
                                        </button>}
                                        <button
                                            className="hollow"
                                            onClick={() => {
                                                addQuickKeysToPerKeyLayoutSelection(QuickKeyId.All);
                                            }}
                                        >
                                            {translate('Option_QuickKeySelection_All', 'All')}
                                        </button>
                                    </span>
                                </span>
                                <span className="result"></span>
                            </div>
                        </div>
                        <div className="panel third color-picker">
                            <header>
                                <div className="title">
                                    {translate('ColorPicker_Label_ColorPicker', 'Color Picker')}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setColorDialogIsOpen(true);
                                    }}
                                >
                                    {translate('Button_Expand', 'Expand')}
                                </button>
                            </header>
                            <ColorPickerComponent
                                value={uiContext.colorPickerValue_PerKeyLighting}
                                onChange={(color: RGBAColor) => {
                                    setColor_PerKeyColorPicker(color);
                                }}
                            />
                            {/* <ColorPickerComponent value={uiContext.activeLightingPicker_selectedColor} onChange={(color: RGBAColor) =>
            {
              if(previewDevice == null) { return; }
              console.log(previewDevice);
              const currentProfile = DeviceService.getCurrentDeviceProfile(previewDevice);
              const colors = [color.toHex()];
              for(let i = 1; i < currentProfile.light_PRESETS_Data.colors.length; i++)
              {
                colors.push(currentProfile.light_PRESETS_Data.colors[i]);
              }
              currentProfile.light_PRESETS_Data.colors = colors;
              onPreviewDeviceUpdate(previewDevice);
              uiContext.devicePropertyColor = color;
              onUIStateUpdate(uiContext);
              // expandedColorPickerColor.current = color;
            } } /> */}
                        </div>
                    </>
                ) : null}
            </div>
            <ContentDialogComponent
                className="color"
                title="Color Picker"
                open={colorDialogIsOpen}
                actions={[
                    <button
                        type="button"
                        key={0}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                        }}
                    >
                        {translate('Button_Cancel', 'Cancel')}
                    </button>,
                    <button
                        type="button"
                        key={1}
                        onClick={() => {
                            setColorDialogIsOpen(false);
                        }}
                    >
                        {translate('Button_Ok', 'Ok')}
                    </button>,
                ]}
            >
                <ColorPickerComponent
                    expanded={true}
                    value={RGBAColor.fromHex(selectedPresetColor)}
                    onChange={ColorPickerExpanded_OnChange}
                />
                {/* <ColorPickerComponent
                    expanded={true}
                    value={uiContext.colorPickerValue_ColorPickerModal}
                    onChange={(color: RGBAColor) => {
                        setColor_ModalColorPicker(color);
                    }}
                /> */}
            </ContentDialogComponent>
        </>
    );
}

function convertGradientDefinitionToCssStyle(gradient) {
    return '#FF0000';
}

export default KeyboardLightingManagementPage;
