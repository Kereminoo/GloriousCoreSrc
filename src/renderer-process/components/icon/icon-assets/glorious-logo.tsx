import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const GloriousLogo: React.FC<IconAssetProps> = ({ color, size, width, height, className }) => {
  return (
    <svg width={width || size} height={height || size} className={className} viewBox="0 0 40 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.8326 0.00484277C27.7781 0.00878632 27.5954 0.0217065 27.4266 0.0335768C25.2054 0.189773 22.9346 0.915902 20.6137 2.21218C19.5552 2.80332 18.8055 3.28479 16.1971 5.04857C14.6272 6.1101 13.6924 6.67557 12.6619 7.18692C10.8735 8.0744 9.31264 8.4773 7.66114 8.47777C7.0207 8.47795 6.47046 8.40808 5.76526 8.237C5.21991 8.10472 4.72054 7.93158 4.27006 7.71861C4.07214 7.62503 4.00574 7.60219 3.96062 7.61209C3.88413 7.62892 3.81991 7.70052 3.80636 7.7841C3.78925 7.88957 3.98356 8.16714 4.28293 8.46489C5.20173 9.37871 6.74781 9.99784 8.537 10.1685C10.4585 10.3517 12.4042 10.0016 14.5335 9.08936C15.5964 8.63401 16.446 8.19376 18.4153 7.07785C19.595 6.40935 20.1311 6.11333 20.7226 5.80377C23.0526 4.58434 24.9088 3.98718 26.8315 3.83845C27.2199 3.80839 28.1135 3.81311 28.5003 3.84725C29.9558 3.97572 31.0725 4.38936 32.0313 5.15504C32.3261 5.39051 32.3581 5.4258 32.3581 5.51575C32.3581 5.60471 32.3075 5.67268 32.226 5.69315C32.194 5.70118 32.0563 5.67847 31.8651 5.6336C30.6937 5.3588 29.4922 5.20492 28.5193 5.2051C26.2923 5.2055 24.2629 5.82178 21.9109 7.21183C21.2 7.63197 20.6448 7.9925 19.2174 8.96083C17.1102 10.3903 16.2182 10.9378 15.0088 11.5436C13.6621 12.2182 12.4711 12.6511 11.1581 12.9432C8.00181 13.6454 4.65435 13.3694 1.7645 12.1688C1.40531 12.0196 0.776621 11.7171 0.468474 11.5453C0.2179 11.4057 0.14478 11.3951 0.0544685 11.4854C-0.0283365 11.5683 -0.0205531 11.6322 0.104239 11.8949C0.54304 12.8186 1.24503 13.6652 2.20484 14.4281C2.48156 14.6481 3.13515 15.0844 3.48227 15.2808C5.77609 16.5788 8.82845 17.2376 12.0735 17.135C12.9304 17.108 13.5033 17.0639 14.1671 16.974C15.2171 16.8319 16.1371 16.5824 16.7497 16.2737C16.9185 16.1886 17.01 16.1826 17.0793 16.252C17.1811 16.3538 17.1458 16.4425 16.8568 16.8129C16.0258 17.8778 14.8224 18.8035 13.4541 19.4302C12.2895 19.9637 11.1077 20.2768 9.73592 20.4152C9.30995 20.4582 8.33869 20.475 7.95822 20.4459C5.66374 20.2704 2.88921 19.2899 1.2542 18.0768C1.03094 17.9111 0.98897 17.8872 0.938349 17.897C0.848394 17.9143 0.794583 17.9588 0.768638 18.0374C0.746833 18.1035 0.7502 18.1195 0.811437 18.2405C0.910423 18.436 1.19467 18.8607 1.38418 19.0963C2.83722 20.9024 5.65257 22.3125 8.64149 22.7312C9.34641 22.8299 9.67137 22.8504 10.5329 22.8504C11.3444 22.8503 11.6405 22.8355 12.3054 22.7616C14.6948 22.4962 16.7597 21.6858 18.6331 20.2782C19.2248 19.8337 19.6605 19.4543 20.2742 18.8494C21.1264 18.0094 21.745 17.3027 23.1195 15.599C24.4575 13.9404 25.052 13.26 25.7831 12.5503C27.0994 11.2725 28.3813 10.5059 29.7933 10.152C31.3596 9.75947 32.9362 9.84153 34.3219 10.3877C34.8429 10.5931 35.3313 10.857 35.7051 11.1353C35.9342 11.3058 36.2732 11.6406 36.3485 11.7708C36.3992 11.8584 36.4018 11.8727 36.3804 11.9441C36.3575 12.0206 36.2828 12.0815 36.2118 12.0815C36.1953 12.0815 36.0746 12.0374 35.9438 11.9836C35.287 11.7135 34.6671 11.56 33.883 11.4735C33.4838 11.4294 32.1714 11.4232 31.8827 11.464C30.4359 11.6685 29.2505 12.2967 28.0619 13.4888C27.2302 14.323 26.5058 15.2925 25.2194 17.2933C24.1213 19.0011 23.6427 19.6944 23.0487 20.4374C22.875 20.6547 22.8516 20.6931 22.8516 20.7611C22.8516 20.8141 22.8666 20.8557 22.8994 20.8939L22.9472 20.9495L23.3797 20.9621C25.3143 21.0184 26.8912 21.5529 28.3224 22.6374C28.8637 23.0476 29.2226 23.3749 30.2001 24.3497C31.4206 25.5669 31.8606 25.9254 32.5462 26.2615C33.1489 26.5569 33.6275 26.6667 34.3132 26.6667C36.3373 26.6667 37.653 25.5483 38.1715 23.387C38.5103 21.9751 38.5191 20.1558 38.1983 17.868C38.143 17.4738 38.1385 17.4091 38.1594 17.3096C38.1864 17.1806 38.2714 17.0513 38.3589 17.006C38.3919 16.9889 38.684 16.8851 39.0079 16.7754C39.7461 16.5253 39.8583 16.4636 39.9562 16.2531C40.0372 16.0792 40.0295 16.0415 39.7271 15.1259C39.0825 13.1741 38.7761 12.0287 38.4408 10.3178C38.2217 9.19911 38.0505 8.11707 37.875 6.74083C37.7145 5.48252 37.608 5.01381 37.3268 4.32927C36.4485 2.19141 34.5814 0.833008 31.7496 0.271557C31.2287 0.168292 30.6207 0.0894603 29.9022 0.0320311C29.644 0.0114017 28.0343 -0.00976225 27.8326 0.00484277Z"
        fill={`var(${color})`}/>
    </svg>   
    
  );
};

export default GloriousLogo;
