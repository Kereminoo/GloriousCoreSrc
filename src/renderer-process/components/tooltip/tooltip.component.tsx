import { CSSProperties, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './tooltip.component.css';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { useAppDataContext } from '@renderer/contexts/app-data.context';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';
import { Color } from '../component.types';

function TooltipComponent(props: any) {
    const [open, setOpen] = useState(false);
    const [openOnHover, setOpenOnHover] = useState(false);
    const { message, hover } = props;
    const appDataContext = useAppDataContext();

    useEffect(() => {
        setOpenOnHover(hover);
    }, [hover]);

    const handleOffComponentClick = useCallback((event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        if ((event.target as HTMLElement).closest('[data-selection]') == null) {
            setOpen(false);
            window.removeEventListener('click', handleOffComponentClick);
        }
    }, []);

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const newValue = !open;
        setOpen(newValue);
        window.removeEventListener('click', handleOffComponentClick);
        if (newValue == true) {
            window.addEventListener('click', handleOffComponentClick, { once: true });
        }
    };

    if (openOnHover == true && appDataContext.tooltip) {
        return (
            <div
                className="tooltip hover"
                onMouseEnter={() => {
                    setOpen(true);
                }}
                onMouseLeave={() => {
                    setOpen(false);
                }}
            >
                <div className="display">?</div>
                {!open ? '' : props.children != null ? props.children : <div className="message">{message}</div>}
            </div>
        );
    }

    return appDataContext.tooltip ? (
        <div className="tooltip click" onClick={handleClick}>
            <div className="display">
                <Icon type={IconType.QuestionMark} color={Color.Base20} size={IconSize.Smaller} />
            </div>
            {!open ? (
                ''
            ) : props.children != null ? (
                <>
                    <div className="shade"></div>
                    <div className="panel">
                        <div className="tip">{props.children}</div>
                        <button className="close-button" onClick={() => setOpen(false)}>
                            <Icon type={IconType.CancelCross} color={Color.Base50} size={IconSize.Small} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="shade"></div>
                    <div className="panel">
                        <div className="tip">{message}</div>
                        <button className="close-button" onClick={() => setOpen(false)}>
                            <Icon type={IconType.CancelCross} color={Color.Base50} size={IconSize.Medium} />
                        </button>
                    </div>
                </>
            )}
        </div>
    ) : (
        <></>
    );
}

export default TooltipComponent;
