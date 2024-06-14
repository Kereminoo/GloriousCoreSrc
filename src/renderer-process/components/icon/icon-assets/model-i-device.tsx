import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const ModelIDevice: React.FC<IconAssetProps> = ({ color, size, width, height, className }) => {
  return (
    <svg width={width || size} height={height || size} className={className} viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M29.975 23.2083L29.2833 23.2333C29.225 22.1416 29.175 21.025 29.1667 19.8916C29.1667 18.575 29.175 17.25 29.1917 15.9583C29.25 11.3833 29.3083 7.06663 28.2667 4.36663C27.15 1.4833 22.3167 0.366634 20.2917 0.0166336C19.5583 -0.108366 18.7917 -0.0416998 18.0833 0.2083L17.875 0.2833C17.2417 0.5083 16.5417 0.516634 15.9 0.299967C15.45 0.149967 14.9833 0.0749669 14.5167 0.0749669C14.0917 0.0749669 13.6667 0.1333 13.25 0.2583C11.3917 0.8083 6.275 2.7083 4.95 4.84163C3.9 6.5333 3.90833 9.6583 4 12.7083V13C4.025 13.4416 4.03333 13.7916 4.01666 13.9916C3.975 14.5083 3.73333 14.7083 3.01666 15.2833C2.69166 15.55 2.3 15.8666 1.85 16.2833L1.68333 16.4416C0.124998 17.8833 0.0249976 18.275 0.283331 21.6166C0.608331 26.55 2.375 30.7083 6.175 35.525C8.18333 38.0666 12 39.7583 16.1333 39.9416C20.0833 40.1166 23.675 38.8583 25.8417 36.5583C29.7417 32.4083 29.5 27.7583 29.275 23.25L29.9667 23.2166L29.975 23.2083ZM24.85 35.6083C23.0667 37.5083 20.1833 38.575 16.8833 38.575C16.6583 38.575 16.4333 38.575 16.2083 38.5583C12.4583 38.3916 9.03333 36.9 7.26666 34.6666C3.65 30.0833 1.975 26.1416 1.66666 21.5083C1.45833 18.8333 1.43333 18.55 2.625 17.45L3.96666 16.275L4.2 17.4916C4.9 22.8833 7.675 27.425 7.79166 27.6166C7.98333 27.9333 8.425 28.0333 8.74166 27.8416C9.06666 27.6416 9.16666 27.2166 8.96666 26.8916C8.8 26.625 5.01666 20.3166 5.45 14.1L5.41666 13.9333C5.41666 13.525 5.4 13.1333 5.38333 12.675C5.29166 9.7583 5.31666 6.8833 6.125 5.57497C7.03333 4.09997 11.15 2.32497 13.6417 1.59163C14.2333 1.41663 14.8833 1.42497 15.475 1.61663L16.2167 1.8083V5.72497L15.875 5.92497C15.225 6.29997 14.8417 6.96663 14.8417 7.69997V10.8666C14.8417 11.6 15.225 12.2666 15.875 12.6416L16.2167 12.8416V15.5C16.2167 15.8833 16.525 16.1916 16.9083 16.1916C17.2917 16.1916 17.6 15.8833 17.6 15.5V12.8416L17.9417 12.6416C18.5917 12.2666 18.975 11.6 18.975 10.8666V7.69997C18.975 6.96663 18.5917 6.29997 17.9417 5.92497L17.6 5.72497V1.7833L18.5583 1.5083C19.05 1.3333 19.5667 1.29163 20.075 1.37497C23.8667 2.02497 26.3917 3.29997 27 4.86663C27.95 7.31663 27.8917 11.5083 27.8333 15.9416C27.8167 17.2416 27.8 18.5666 27.8083 19.9C27.8083 21.0666 27.875 22.2 27.925 23.3166C28.15 27.725 28.3583 31.8916 24.8667 35.6083H24.85Z"
        fill={`var(${color})`}/>
    </svg>
  );
};

export default ModelIDevice;
