import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const LightningBolt: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_35_1005)">
        <path
        d="M6.29574 20C5.90407 20 5.5874 19.6875 5.5874 19.3C5.5874 19.2334 5.59574 19.1667 5.61657 19.1L7.70824 12.05H3.42074C3.02907 12.05 2.7124 11.7375 2.7124 11.3542C2.7124 11.175 2.78324 11.0042 2.90824 10.875L13.2166 0.216697C13.4874 -0.0624701 13.9332 -0.0749701 14.2166 0.191697C14.4124 0.370863 14.4832 0.645863 14.4082 0.895863L12.2957 7.93753H16.5832C16.9749 7.93753 17.2916 8.24586 17.2916 8.63336C17.2916 8.81253 17.2207 8.98336 17.0999 9.11253L6.80824 19.7834C6.6749 19.9209 6.4874 20 6.29574 20ZM4.55824 10.8792H9.30407L7.32907 17.5334L15.4499 9.11253H10.6999L12.6916 2.47086L4.55407 10.8792H4.55824Z"
        fill={`var(${color})`}/>
      </g>
      <defs>
        <clipPath id="clip0_35_1005">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default LightningBolt;
