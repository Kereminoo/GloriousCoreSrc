import React, { ChangeEvent, useEffect, useState } from 'react';
import './range.component.css';

interface RangeComponentProps {
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  className?: string;
  children?: React.ReactNode;
}

function RangeComponent({
  onChange,
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  className = '',
  children
}: RangeComponentProps) {
  const [inputValue, setInputValue] = useState<number>(value);
  const classNames = `range ${className}`.trim();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setInputValue(newValue);
      if(onChange) {
        onChange(newValue);
      }
    }
  };

  const style = {
    '--min': min,
    '--max': max,
    '--step': step,
    '--value': inputValue,
  } as React.CSSProperties;

  return (
    <div className={classNames} style={style}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={inputValue}
        onChange={handleChange}
      />
      {children}
    </div>
  );
}

export default RangeComponent;
