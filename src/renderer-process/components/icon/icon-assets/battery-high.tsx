import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const BatteryHigh: React.FC<IconAssetProps> = ({ color, size, secondaryColor = '--green-dark-60', className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M0 6.16245V17.5354C0 18.2268 0.562723 18.7896 1.25418 18.7896H6.84074L7.20385 17.5449H1.25418C1.24905 17.5449 1.2447 17.5405 1.2447 17.5354V6.16245C1.2447 6.15712 1.24905 6.15297 1.25418 6.15297H8.9708L10.1539 4.90826H1.25418C0.562723 4.90826 0 5.47099 0 6.16245Z" 
        fill={`var(${color})`}/>
      <path 
        d="M23.3679 8.21589H22.7266V6.16245C22.7266 5.47099 22.1641 4.90826 21.4724 4.90826H17.0851L16.7181 6.15297H21.4724C21.4777 6.15297 21.4819 6.15712 21.4819 6.16245V8.21589H21.4724V15.166H21.4819V17.5354C21.4819 17.5405 21.4777 17.5449 21.4724 17.5449H14.8232L13.6436 18.7896H21.4724C22.1641 18.7896 22.7266 18.2268 22.7266 17.5354V15.166H23.3679C23.7168 15.166 23.9997 14.8831 23.9997 14.5342V8.84772C23.9997 8.49883 23.7168 8.21589 23.3679 8.21589Z"
        fill={`var(${color})`}/>
      <path  className="bolt"
        d="M19.6301 9.97699C19.5118 9.70254 19.2421 9.52523 18.9432 9.52523L14.4195 9.52681L15.414 6.15323L15.7811 4.90853L16.6493 1.96361C16.7488 1.6319 16.6104 1.27886 16.311 1.10353C16.0099 0.926817 15.6314 0.980325 15.3907 1.23345L11.8975 4.90853L10.7144 6.15323L4.50549 12.6856C4.29916 12.9026 4.2421 13.2206 4.36017 13.4959C4.47824 13.7711 4.74796 13.949 5.04748 13.949H9.57395L8.52531 17.5451L8.16221 18.7898L7.3661 21.5201C7.26698 21.8522 7.40618 22.2051 7.7063 22.38C7.82477 22.4491 7.95509 22.4827 8.08402 22.4827C8.28383 22.4827 8.48069 22.4019 8.62601 22.2481L11.9032 18.7898L13.0828 17.5451L19.4874 10.7867C19.6925 10.5693 19.7486 10.2514 19.6301 9.97699ZM11.3419 17.5451L10.1623 18.7898L9.17471 19.832L9.47858 18.7898L9.84149 17.5451L11.2588 12.6854H6.24914L12.4579 6.15323L13.641 4.90853L14.8335 3.65376L14.4635 4.90853L14.0967 6.15323L12.7293 10.7911L17.7439 10.7893L11.3419 17.5451Z" 
        fill={`var(${secondaryColor})`}/>
    </svg>
  );
};

export default BatteryHigh;
