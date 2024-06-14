import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const CloudCheck: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 10.5022C1 11.093 1.11636 11.6779 1.34243 12.2237C1.56851 12.7695 1.89987 13.2654 2.3176 13.6832C3.16125 14.5268 4.30548 15.0008 5.49858 15.0008H17.4948C18.3805 15.0024 19.2338 14.668 19.8827 14.0652C20.5315 13.4623 20.9276 12.6358 20.991 11.7524C21.0544 10.869 20.7805 9.99442 20.2244 9.30507C19.6683 8.61572 18.8715 8.16291 17.9946 8.03798C18.0044 6.33728 17.3945 4.69123 16.2789 3.40753C15.1632 2.12383 13.6183 1.29035 11.9329 1.06289C10.2474 0.835424 8.53683 1.22955 7.12084 2.1716C5.70485 3.11364 4.68039 4.53912 4.23898 6.18156C3.30439 6.45449 2.48352 7.02312 1.89952 7.80215C1.31552 8.58118 0.999892 9.52858 1 10.5022Z" 
      stroke={`var(${color})`} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13.9957 7.00348L9.99693 11.0022L7.99756 9.00285" stroke={`var(${color})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>    
  );
};

export default CloudCheck;
