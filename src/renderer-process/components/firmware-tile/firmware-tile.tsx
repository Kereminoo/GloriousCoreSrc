import './firmware-tile.css';
import { useTranslate } from '../../contexts/translations.context';
import { UIDevice } from '../../data/ui-device';
import { getVersion } from '../../services/device.service';
import { useUIUpdateContext } from '../../contexts/ui.context';

function FirmwareTile(props: { device?: UIDevice }) {
    const { device } = props;
    const translate = useTranslate();
    const { openUpdateManager } = useUIUpdateContext();

    if (device == null) return <></>;

    return (
        <>
            <div className="firmware-tile">
                <div className='firmware-version'>
                    <span>
                        {translate('Device_Home_Label_Firmware', 'Firmware')} {getVersion(device)}
                    </span>
                </div>
                <div className='update-status'>
                    {/* <span>{translate('Device_Home_Dash_Label_Firmware_Status', 'Up to date')}</span>
                  <SVGIconComponent src={iconSrc(ICONS.greenConfirmation)} /> */}
                    <button
                        className="hollow"
                        type="button"
                        onClick={() => {
                            openUpdateManager();
                        }}
                    >
                        {translate('Device_Home_Label_Firmware_Check_For_Update', 'Check For Update')}
                    </button>
                </div>
            </div>
        </>
    );
}

export default FirmwareTile;
