import React from 'react';
import { IconAssetProps } from './icon-asset.types';

const MacroSetDelay: React.FC<IconAssetProps> = ({ color, size, className }) => {
  return (    
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.25 1.5C10.1239 1.5 8.04538 2.13047 6.27757 3.31169C4.50975 4.4929 3.13189 6.1718 2.31826 8.1361C1.50462 10.1004 1.29179 12.2619 1.70657 14.3471C2.12136 16.4324 3.14523 18.3479 4.64863 19.8513C6.15203 21.3547 8.06744 22.3785 10.1527 22.7933C12.238 23.2081 14.3996 22.9952 16.3638 22.1816C18.3281 21.3679 20.007 19.9901 21.1882 18.2223C22.3694 16.4544 23 14.3761 23 12.2499C23 9.39887 21.8673 6.66458 19.8513 4.64858C17.8353 2.63258 15.1011 1.5 12.25 1.5ZM18.9005 18.9005C17.2513 20.5444 15.0491 21.5153 12.7231 21.6242C10.3972 21.733 8.11406 20.972 6.31851 19.4894C4.52296 18.0068 3.34362 15.9089 3.01042 13.6043C2.67723 11.2997 3.2141 8.95363 4.51618 7.02318C5.81827 5.09273 7.79229 3.71617 10.0539 3.16176C12.3154 2.60735 14.7025 2.91479 16.7498 4.02417C18.7971 5.13355 20.3579 6.96541 21.1283 9.1628C21.8988 11.3602 21.8236 13.7657 20.9173 15.9106C20.4451 17.0285 19.76 18.0439 18.9005 18.9005Z"
      fill={`var(${color})`}/>
      <path d="M16.9955 11.5763H13.4122C13.2941 11.3723 13.1245 11.2028 12.9206 11.0847V5.86734C12.9126 5.69461 12.8385 5.53162 12.7134 5.41221C12.5883 5.2928 12.422 5.22614 12.249 5.22614C12.0761 5.22614 11.9099 5.2928 11.7849 5.41221C11.6598 5.53162 11.5855 5.69461 11.5775 5.86734V11.0847C11.3991 11.1877 11.2468 11.3303 11.1324 11.5016C11.018 11.6729 10.9446 11.8682 10.9177 12.0724C10.8908 12.2767 10.9113 12.4843 10.9776 12.6794C11.0438 12.8744 11.1538 13.0517 11.2995 13.1973C11.4452 13.343 11.6225 13.4532 11.8176 13.5194C12.0126 13.5856 12.2203 13.6061 12.4245 13.5792C12.6288 13.5523 12.824 13.4789 12.9953 13.3644C13.1666 13.25 13.3092 13.0977 13.4122 12.9193H16.9955C17.1683 12.9113 17.3314 12.8371 17.4508 12.712C17.5702 12.587 17.6368 12.4207 17.6368 12.2478C17.6368 12.0749 17.5702 11.9086 17.4508 11.7836C17.3314 11.6585 17.1683 11.5843 16.9955 11.5763Z"
      fill={`var(${color})`}/>
    </svg>

  );
};

export default MacroSetDelay;
