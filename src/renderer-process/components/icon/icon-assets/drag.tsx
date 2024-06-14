import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const Drag: React.FC<IconAssetProps> = ({ color, size, width = "12", height = "20", className }) => {
  return (
    <svg width={width || size} height={height || size} className={className} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="18" r="2" fill={`var(${color})`}/>
      <circle cx="10" cy="18" r="2" fill={`var(${color})`}/>
      <circle cx="2" cy="2" r="2" fill={`var(${color})`}/>
      <circle cx="10" cy="2" r="2" fill={`var(${color})`}/>
      <circle cx="2" cy="10" r="2" fill={`var(${color})`}/>
      <circle cx="10" cy="10" r="2" fill={`var(${color})`}/>
    </svg>    
  );
};

export default Drag;
