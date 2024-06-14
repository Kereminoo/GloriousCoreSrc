import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './toggle.component.css';

function ToggleComponent(props: any) {
    const { value, onChange, thumbContent, onContent, offContent } = props;
    const [checked, setChecked] = useState(value == true ? true : false);
    const [checkedStateContent, setCheckedStateContent] = useState(<>"OFF"</>);

    useEffect(() => {
        let content;
        if (checked) {
            content = onContent == null ? <></> : onContent;
        } else {
            content = offContent == null ? <></> : offContent;
        }
        setCheckedStateContent(content);
    }, [checked]);

    useEffect(() => {
        setChecked(value);
    }, [value]);

    return (
        <div className="track" data-toggle>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    e.stopPropagation();
                    const value = !checked;
                    setChecked(value);
                    if (onChange != null) {
                        onChange(value);
                    }
                }}
            />
            <div className="checked-state">{checkedStateContent}</div>
            <div className="thumb">{thumbContent == null ? null : thumbContent}</div>
        </div>
    );
}

export default ToggleComponent;
