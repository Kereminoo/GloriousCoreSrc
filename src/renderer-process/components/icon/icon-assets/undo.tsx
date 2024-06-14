import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const Undo: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00005 19C7.71672 19 7.47922 18.9042 7.28755 18.7125C7.09588 18.5208 7.00005 18.2833 7.00005 18C7.00005 17.7167 7.09588 17.4792 7.28755 17.2875C7.47922 17.0958 7.71672 17 8.00005 17H14.1C15.15 17 16.0625 16.6667 16.8375 16C17.6125 15.3333 18 14.5 18 13.5C18 12.5 17.6125 11.6667 16.8375 11C16.0625 10.3333 15.15 9.99999 14.1 9.99999H7.80005L9.70005 11.9C9.88338 12.0833 9.97505 12.3167 9.97505 12.6C9.97505 12.8833 9.88338 13.1167 9.70005 13.3C9.51672 13.4833 9.28338 13.575 9.00005 13.575C8.71672 13.575 8.48338 13.4833 8.30005 13.3L4.70005 9.69999C4.60005 9.59999 4.52922 9.49165 4.48755 9.37499C4.44588 9.25832 4.42505 9.13332 4.42505 8.99999C4.42505 8.86665 4.44588 8.74165 4.48755 8.62499C4.52922 8.50832 4.60005 8.39999 4.70005 8.29999L8.30005 4.69999C8.48338 4.51665 8.71672 4.42499 9.00005 4.42499C9.28338 4.42499 9.51672 4.51665 9.70005 4.69999C9.88338 4.88332 9.97505 5.11665 9.97505 5.39999C9.97505 5.68332 9.88338 5.91665 9.70005 6.09999L7.80005 7.99999H14.1C15.7167 7.99999 17.1042 8.52499 18.2625 9.57499C19.4209 10.625 20 11.9333 20 13.5C20 15.0667 19.4209 16.375 18.2625 17.425C17.1042 18.475 15.7167 19 14.1 19H8.00005Z" 
    fill={`var(${color})`}/>
  </svg>

  );
};

export default Undo;