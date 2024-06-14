import React, { CSSProperties, useEffect, useState } from 'react';
import { Color } from '../component.types';
import styles from './dpi-pill.module.css';

export enum DPIPillColorStyle
{
  Filled,
  Border
}

export type DPIColor = Color.FriendlyYellow
| Color.FriendlyBlue
| Color.FriendlyRed
| Color.FriendlyGreen
| Color.FriendlyPurple
| Color.FriendlyTeal
|`#${string}`;

export interface DPIPillProps 
{
  value?: number;
  color?: DPIColor;
  size?: number;
  padding?:number;
  style?: DPIPillColorStyle;
  isDefault?: boolean;
  useHoverEffect?: boolean;
  title?:string;
  onClick?: (event?: MouseEvent) => void;
  onChange?: (value: number) => void;
}
const DPIPill: React.ElementType<DPIPillProps> = ({ value = 0, color = Color.FriendlyYellow, size = 16, padding = 7, 
  style=DPIPillColorStyle.Filled, isDefault=false, useHoverEffect = true, title, onClick, onChange }) => {

    const [currentValue, setCurrentValue] = useState(value);
    useEffect(() =>
    {
      setCurrentValue(value);
    }, [value])
  return (
    <div className={`dpi-pill ${styles['dpi-pill']}${(isDefault==true) ? ` ${styles['dpi-pill-default']}` : ''}`}
    title={title}
    style={{ 
      '--dpi-padding': `${padding}px`,
      '--dpi-hover-border-color': (useHoverEffect == true) ? `var(${Color.Glorange60})` : `var(${Color.Base50})`,
      '--dpi-hover-text-color': (useHoverEffect == true) ? `var(${Color.Glorange60})` : `var(${Color.Base20})`,
      '--dpi-hover-cursor': (useHoverEffect == true) ? `pointer` : `default`,
    } as CSSProperties}
    onClick={() => { if(onClick != null) { onClick(); } }}
    >
      <span className={`${styles['color']}${(style==DPIPillColorStyle.Border) ? ` ${styles['border-color']}` : ''}`}
      style={
        { 
        '--dpi-color': (color.startsWith('#')) ? color : `var(${color})`,
        '--dpi-size': `${size}px`,
        } as CSSProperties}></span>
        {(onChange != null)
        ? <input type="text" value={currentValue} className={styles['editable-value']} onChange={(event) =>
        {
          const newValue = parseInt((event.currentTarget).value);
          if(isNaN(newValue))
          {
            return;
          }
          
          setCurrentValue(newValue);
          if(onChange != null)
          {
            onChange(newValue);
          }
        }} />
        : <span className={styles['value']}>{value}</span>
        }
    </div>
  );

};

export default DPIPill;
