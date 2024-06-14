import React, { useMemo, useCallback } from 'react';
import './device-keybinding-selection-node.component.css';
import { useTranslate } from '@renderer/contexts/translations.context';

function DeviceKeybindingSelectionNodeComponent(props: any) {
    const { title, x, y, width, height, onClick, selected, hasBindValue, onHoverStart, onHoverEnd, children } = props;
    const translate = useTranslate();
    const style = useMemo(
        () =>
            ({
                transform: `translate(${x}px, ${y}px)`,
                width: `${width}px`,
                height: `${height}px`,
                '--x': `${x}px`,
                '--y': `${y}px`,
            }) as React.CSSProperties,
        [x, y, width, height],
    );

    const handleMouseEnter = useCallback(() => {
        if (onHoverStart) {
            onHoverStart();
        }
    }, [onHoverStart]);

    const handleMouseLeave = useCallback(() => {
        if (onHoverEnd) {
            onHoverEnd();
        }
    }, [onHoverEnd]);

    return (
        <div
            className="node"
            title={translate(title, title)}
            style={style}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-selected={selected ? title : null}
            data-bound={hasBindValue ? title : null}
        >
            <div className="hover-indicator"></div>
            <div className="selected-indicator"></div>
            <div className="bound-indicator"></div>
            {children}
        </div>
    );
}

export default DeviceKeybindingSelectionNodeComponent;
