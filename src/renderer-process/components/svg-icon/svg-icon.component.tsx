import { CSSProperties } from "react";
import './svg-icon.component.css'

function SVGIconComponent(props :any) 
{
    const { src, active, selected, className, onClick } = props;

    return <i className={`icon ${className}`} onClick={onClick}
        style={
        {
            ['--icon-default']: `url(${(import.meta.env.PROD) ? ".." : ""}${src})`,
            ['--icon-active']: `url(${(import.meta.env.PROD) ? ".." : ""}${active})`,
            ['--icon-selected']: `url(${(import.meta.env.PROD) ? ".." : ""}${selected})`
        } as CSSProperties}
    ></i>
}

export default SVGIconComponent;