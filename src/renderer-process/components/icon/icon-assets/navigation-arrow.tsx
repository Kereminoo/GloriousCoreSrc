import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const NavigationArrow: React.FC<IconAssetProps> = ({ color, size, width, height, className }) => {
  return (
    <svg width={width || size} height={height || size} className={className} viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L2 7L8 13" stroke={`var(${color})`} strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 8C18.5523 8 19 7.55228 19 7C19 6.44772 18.5523 6 18 6V8ZM2.5 8H18V6H2.5V8Z" fill={`var(${color})`}/>
    </svg>
  );
};

export default NavigationArrow;
