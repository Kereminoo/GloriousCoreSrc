import React, { CSSProperties } from 'react';
import { Color } from '../component.types';
import styles from './primary-button.module.css';

export type PrimaryButtonColor = Color.Yellow60
|Color.Yellow40
|Color.Purple60
|Color.Purple40;

export interface PrimaryButtonProps 
{
  label?:string;
  color?: PrimaryButtonColor;
  padding?:number;
  title?:string;
  isDisabled?: boolean;
  onClick?: (event?: MouseEvent) => void;
}
const PrimaryButton: React.ElementType<PrimaryButtonProps> = ({ label, color = Color.Yellow60, padding = 10, isDisabled = false, title, onClick }) => {

  let fontColor;
  if(color == Color.Yellow40 || color == Color.Yellow60)
  {
    fontColor = Color.Base100;
  }
  else
  {
    fontColor = Color.Base20;
  }
  return (
    <button type='button' className={styles['button']} disabled={isDisabled}
    title={title}
    style={{ 
      backgroundColor: `var(${color})`,
      fontColor: `var(${fontColor})`,
      padding: `${padding}px`,
    } as CSSProperties}
    onClick={() => { if(onClick != null) { onClick(); } }}
    >
      <span className={styles['label']}>{label}</span>
    </button>
  );

};

export default PrimaryButton;
