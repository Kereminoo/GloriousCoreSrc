import './spinner-component.css';
import { CSSProperties } from 'react';

function SpinnerComponent(props: {size: string; labelText?: string; labelFontSize?: string }) {
    const { size, labelText, labelFontSize } = props;

    return (
        <>
            <div className="spinner-component">
                <div className="spinner-anim" style={{ ['--spinner-anim-size']: `${size}` } as CSSProperties} />
                {labelText != null && <p style={{['fontSize']: `${labelFontSize ?? '8px'}`} as CSSProperties}>{labelText}</p>}
            </div>
        </>
    );
}

export default SpinnerComponent;
