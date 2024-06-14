import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const ToggleKey: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.7507 2.25072V33.7507H2.25072V2.25072H33.7507ZM33.7507 0.00144H2.25072C1.65404 0.00143988 1.08178 0.238371 0.65973 0.660151C0.237679 1.08193 0.000381752 1.65404 0 2.25072L0 33.7507C-6.05573e-08 34.0462 0.058227 34.3388 0.171354 34.6118C0.284481 34.8848 0.45029 35.1328 0.659308 35.3417C0.868325 35.5506 1.11645 35.7162 1.38952 35.8292C1.66258 35.9422 1.95522 36.0002 2.25072 36H33.7507C34.3473 36 34.9194 35.763 35.3412 35.3412C35.763 34.9194 36 34.3473 36 33.7507V2.25072C36 1.65404 35.7631 1.08178 35.3413 0.65973C34.9195 0.237679 34.3474 0.000381752 33.7507 0"
     fill={`var(${color})`}/>
    <path d="M18 9H9V27H18V9Z"
     fill={`var(${color})`}/>
    <path d="M29.2507 29.2507H6.75072V6.75073H29.2507V29.2507ZM30.937 4.5H5.62464C5.32637 4.5 5.04032 4.61848 4.82941 4.82939C4.6185 5.0403 4.50002 5.32638 4.50002 5.62465V30.3754C4.50002 30.6736 4.6185 30.9597 4.82941 31.1706C5.04032 31.3815 5.32637 31.5 5.62464 31.5H30.937C31.0863 31.5 31.2295 31.4407 31.3351 31.3351C31.4407 31.2295 31.5 31.0863 31.5 30.937V5.06305C31.5 4.91372 31.4407 4.7705 31.3351 4.6649C31.2295 4.55931 31.0863 4.5 30.937 4.5Z"
     fill={`var(${color})`}/>
    </svg>
    
  );
};

export default ToggleKey;
