import React, { CSSProperties } from 'react';
import { IconAssetProps } from './icon-asset.types';

const SuccessCheck: React.FC<IconAssetProps> = ({ color = "--base-shades-20", size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g mask="url(#mask_successcheck)">
        <circle cx="8" cy="8" r="8" fill={`var(${color})`} />
      </g>
        
      <defs>
        <mask id="mask_successcheck" >
          <circle cx="8" cy="8" r="8" fill="white"  />
          <path
            d="M6.53553 11.8995L3 8.36398L4.41421 6.94977L6.53553 9.07109L11.4853 4.12134L12.8995 5.53556L6.53553 11.8995Z"
            fill="black" />
        </mask>
      </defs>
    </svg>
  );
};

export default SuccessCheck;
