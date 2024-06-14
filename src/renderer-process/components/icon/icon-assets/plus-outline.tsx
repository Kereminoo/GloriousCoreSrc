import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const PlusOutline: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" 
    d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 9V13H7V9H3V7H7V3H9V7H13V9H9Z" 
    fill={`var(${color})`}/>
    </svg>
    
  );
};

export default PlusOutline;
