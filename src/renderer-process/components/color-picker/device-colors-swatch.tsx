import './device-colors-swatch.css';
import { DeviceRecordColorData } from '../../../common/data/records/device-data.record';
import { useUIContext, useUIUpdateContext } from '../../contexts/ui.context';
import { useEffect } from 'react';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import ColorPill from '../color-pill/color-pill';
import { useDevicesContext } from '@renderer/contexts/devices.context';


function DeviceColorsSwatch(props: { deviceColorArray?: DeviceRecordColorData[] | string[] }) {
    const { deviceColorArray } = props;
    const { setSelectedColorIndex } = useUIUpdateContext();
    const { selectedColorIndex, lightSettingMode } = useUIContext();
    const { presetEffectHasFixedColors } = useDevicesContext();

    useEffect(() => {
        if ((deviceColorArray?.length ?? 0) < selectedColorIndex) setSelectedColorIndex(0);
    }, [deviceColorArray?.length]);

    if (!Array.isArray(deviceColorArray) || deviceColorArray.length == 0) {
        return <></>;
    }

    const colorToHex = (color: {R: number, G: number, B: number}) =>
    {
        return RGBAColor.fromRGB(color.R, color.G, color.B).toHex();
    };

    let colorMap: any = <></>;

    if (deviceColorArray[0]['R'] != undefined) {
        // const toCSSColor = (color: DeviceRecordColorData) => (color ? `rgb(${color.R} ${color.G} ${color.B})` : '');
        colorMap = deviceColorArray.map((color, index: number) => {
            return (
                // <ColorPill key={index} color={colorToHex(color)} useHoverEffect={!presetEffectHasFixedColors} padding={{x: 7, y: 3} } isSelected={(lightSettingMode != 'per-key' && presetEffectHasFixedColors == false && index == selectedColorIndex)} onClick={() =>
                <ColorPill key={index} color={colorToHex(color)} useHoverEffect={false} padding={{x: 7, y: 3} } />
            );
        });
    } else {
        colorMap = deviceColorArray.map((color, index: number) => {
            return (
                // <ColorPill key={index} color={color} useHoverEffect={!presetEffectHasFixedColors} padding={{x: 7, y: 3} } isSelected={(lightSettingMode != 'per-key' && presetEffectHasFixedColors == false && index == selectedColorIndex)} onClick={() =>
                <ColorPill key={index} color={color} useHoverEffect={false} padding={{x: 7, y: 3} } />
            );
        });
    }

    return (
        <>
            <div className={'device-colors'}>
                {colorMap}
            </div>
        </>
    );
}

export default DeviceColorsSwatch;
