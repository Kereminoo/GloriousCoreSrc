import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const Filter: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18V16H14V18H10ZM6 13V11H18V13H6ZM3 8V6H21V8H3Z" fill={`var(${color})`}/>
    </svg>
    
  );
};

export default Filter;
