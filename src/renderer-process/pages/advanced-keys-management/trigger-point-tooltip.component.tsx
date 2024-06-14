import { useState } from 'react';
import { iconSrc, ICONS } from '@renderer/utils/icons';
import SVGIconComponent from '@renderer/components/svg-icon/svg-icon.component';
import { cleanupKeyName, gaugeValueToFixedNumber } from '@renderer/utils/dynamic-keys';
import './trigger-point-tooltip.component.css';

function TriggerPointTooltip({
  selectedKey, value, isContinuous,
  onKeySelect, onRemove, onContinuationChange
}) {
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <div className={`trigger-point-tooltip ${hasFocus ? 'has-focus' : ''}`}>
      {selectedKey && (
        <div className='trigger-point-actions-selected'>
          <div className='swith-keystroke' onClick={onContinuationChange}>
            <SVGIconComponent src={iconSrc(isContinuous ? ICONS.keystrokeContinuous : ICONS.keystrokeSignle)} />
          </div>
          <div className='delete-action' onClick={onRemove}>
            <SVGIconComponent src={iconSrc(ICONS.delete)} />
          </div>
        </div>
      )}
      <div className='trigger-point-main-menu' onClick={onKeySelect}>
        <div className='chosen-key-action'>
          {cleanupKeyName(selectedKey) || '+'}
        </div>
        <div className='trigger-point-value'>
          {gaugeValueToFixedNumber(value)} mm
        </div>
      </div>
    </div>
  );
}

export default TriggerPointTooltip;
