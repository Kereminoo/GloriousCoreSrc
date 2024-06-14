import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const InformationOutline: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.99539 5.87007C7.41539 5.87007 7.02539 5.49007 7.02539 5.00007C7.02539 4.51007 7.41539 4.13007 7.99539 4.13007C8.57539 4.13007 8.96539 4.49007 8.96539 4.97007C8.96539 5.49007 8.57539 5.87007 7.99539 5.87007ZM7.21539 12.0001V6.62007H8.77539V12.0001H7.21539Z" 
    fill={`var(${color})`}/>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" 
      fill={`var(${color})`}/>
    </svg>
    
  );
};

export default InformationOutline;
