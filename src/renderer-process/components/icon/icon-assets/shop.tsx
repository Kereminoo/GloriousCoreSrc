import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const Shop: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M0.971803 1.35354V0H15.0282V1.35354H0.971803ZM1.00652 13.987V8.57263H0V7.2191L0.971803 2.70716H15.0282L16 7.2191V8.57263H14.9935V13.987H13.6399V8.57263H9.57916V13.987H1.00652ZM2.36006 12.6334H8.22562V8.57263H2.36006V12.6334Z" 
      fill={`var(${color})`}/>
    </svg>
    
  );
};

export default Shop;
