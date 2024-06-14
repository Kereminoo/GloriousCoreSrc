import React, { CSSProperties } from 'react';
import { IconAssetProps } from './icon-asset.types';

const ProfilePicture: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_694_3768" style={{"maskType":"luminance"} as CSSProperties} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <path d="M16 0H0V16H16V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_694_3768)">
        <path d="M14.5427 2.2496L15.2499 2.9568L15.8536 2.35307C15.9472 2.25935 15.9997 2.13239 15.9998 2C15.9998 1.73736 15.948 1.47728 15.8475 1.23463C15.747 0.991982 15.5997 0.771504 15.414 0.585786C15.2283 0.400069 15.0078 0.25275 14.7652 0.152241C14.5225 0.0517315 14.2624 0 13.9998 0C13.8674 7.50382e-05 13.7405 0.0526239 13.6467 0.146133L13.043 0.746667L13.7502 1.45387L14.5427 2.2496Z" 
        fill={`var(${color})`}/>
        <path d="M13.8784 3.00373L12.9867 2.112L12.336 1.46133L0.146133 13.6469C0.0527226 13.7407 0.000191383 13.8676 0 14L0 16H2C2.13239 15.9999 2.25935 15.9474 2.35307 15.8539L14.5429 3.664L13.8784 3.00373ZM1.79307 15.0037H1.00053V14.2037L2.17387 13.0304L2.9664 13.8229L1.79307 15.0037ZM2.53013 12.6805L12.3179 2.8928L13.1285 3.66827L3.32373 13.4731L2.53013 12.6805Z" 
        fill={`var(${color})`}/>
        <path d="M4.75 16H16.0001V14.5003H6.24974L4.75 16Z" 
        fill={`var(${color})`}/>
      </g>
    </svg>
    
  );
};

export default ProfilePicture;
