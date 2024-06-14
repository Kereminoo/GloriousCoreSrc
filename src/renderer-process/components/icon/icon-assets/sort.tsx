import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const Sort: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18V16H9V18H3ZM3 13V11H15V13H3ZM3 8V6H21V8H3Z" fill={`var(${color})`}/>
    </svg>    
  );
};

export default Sort;
