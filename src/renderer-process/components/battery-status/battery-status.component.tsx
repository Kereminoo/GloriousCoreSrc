import { CSSProperties } from 'react';
import { UIDevice } from '../../data/ui-device';

enum ChargeState {
    ZeroBars = 7,
    OneBar = 20,
    TwoBars = 40,
    ThreeBars = 60,
    FourBars = 80,
    FullBars = 95,
}

function BatteryStatusComponent(props: { device: UIDevice; scaleX?: number; scaleY?: number }) {
    const { device, scaleX, scaleY } = props;

    if (device == null || device.deviceData == null || device.deviceData.battery == false) {
        return <></>;
    }

    const getBatteryIcon = () => {
        let imageName = '';

        if (device.batteryvalue == null) {
            return null;
        }

        if (device.batteryvalue >= ChargeState.FullBars) {
            imageName = 'battery_full.png';
        } else if (device.batteryvalue >= ChargeState.ThreeBars) {
            imageName = 'battery_charge_80.gif';
        } else if (device.batteryvalue >= ChargeState.TwoBars) {
            imageName = 'battery_charge_60.gif';
        } else if (device.batteryvalue >= ChargeState.OneBar) {
            imageName = 'battery_charge_40.gif';
        } else if (device.batteryvalue >= ChargeState.ZeroBars) {
            imageName = 'battery_charge_20.gif';
        } else if (device.batteryvalue >= 0) {
            imageName = 'battery_low.png';
        }

        return (
            <>
                <img
                    draggable={false}
                    src={`${import.meta.env.PROD ? '.' : ''}/images/icons/deprecated/${imageName}?asset`}
                    alt="Battery Status"
                />
            </>
        );
    };

    return (
        <i
            className={`icon battery ${device.batterystatus == 1 ? ' charging' : ''}`}
            style={
                {
                    ['transform']: `scale(${scaleX ?? 1}, ${scaleY ?? 1})`,
                    ['--icon-default']: `url(${import.meta.env.PROD ? '.' : ''}/images/icons/battery.svg)`,
                } as CSSProperties
            }
        >
            {getBatteryIcon()}
        </i>
    );
}

export default BatteryStatusComponent;
