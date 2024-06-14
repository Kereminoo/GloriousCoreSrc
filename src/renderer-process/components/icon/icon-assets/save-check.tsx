import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const SaveCheck: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10.8889 17.8887L7 13.9999L8.55554 12.4443L10.8889 14.7776L16.3333 9.33325L17.8888 10.8888L10.8889 17.8887Z"
      fill={`var(${color})`} />
    </svg>
    
  );
};

export default SaveCheck;
