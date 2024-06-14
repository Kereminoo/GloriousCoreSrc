import React, { CSSProperties } from 'react';
import { Color } from '../component.types';
import styles from './color-pill.module.css';

// export enum DPIPillColorStyle
// {
//   Filled,
//   Border
// }

// export type DPIColor = Color.FriendlyYellow
// | Color.FriendlyBlue
// | Color.FriendlyRed
// | Color.FriendlyGreen
// | Color.FriendlyPurple
// | Color.FriendlyTeal
// |`#${string}`;

export interface ColorPillProps 
{
  color?: string;
  size?: number;
  padding?: number|{x: number, y: number}
  useHoverEffect?: boolean;
  title?:string;
  isSelected?: boolean;
  onClick?: (event?: MouseEvent) => void;
}
const ColorPill: React.ElementType<ColorPillProps> = ({ color = Color.FriendlyYellow, size = 16, padding = 7, 
  title = undefined, useHoverEffect = true, isSelected = false, onClick }) => {
  return (
    <div className={`${styles['color-pill']}${(isSelected == true) ? ` ${styles['selected']}`: ''}`}
    title={title}
    style={{ 
      '--padding': (typeof padding == 'number') ? `${padding}px` : `${padding.y}px ${padding.x}px`,
      '--hover-border-color': (useHoverEffect == true) ? `var(${Color.Glorange60})` : `var(${Color.Base50})`,
      '--hover-text-color': (useHoverEffect == true) ? `var(${Color.Glorange60})` : `var(${Color.Base20})`,
      '--hover-cursor': (useHoverEffect == true) ? `pointer` : `default`,
    } as CSSProperties}
    onClick={() => { if(onClick != null) { onClick(); } }}
    >
      <span className={`${styles['color']}`}
      style={
        { 
        '--color': color,
        '--size': `${size}px`,
        } as CSSProperties}></span>
      <span className={styles['value']}>{color}</span>
    </div>
  );

};

export default ColorPill;
