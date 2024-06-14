import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './option-select.component.css'

const MIN_SELECT_POPUP_HEIGHT = 35;

function OptionSelectComponent(props: any) 
{
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{value: string, label: string}|null>(null);
  const selectedDisplay = useRef(null);
  const containerElement = useRef(null);
  const { options, value, onChange, listHeaderContent, direction } = props;

  useEffect(() =>
  {
    const target = containerElement.current! as HTMLElement;
    target.classList.remove('above');

    const parent = (target.parentElement!.tagName.toLowerCase() == "label") ? target.parentElement!.parentElement : target.parentElement;

    const padding = 10;

    const distanceBelow = parent!.offsetTop + parent!.offsetHeight - (target.offsetTop + target.offsetHeight) - padding;
    // console.log(distanceBelow);
    let maxHeight = distanceBelow;
    if(direction == 'above' || (direction == null && distanceBelow < MIN_SELECT_POPUP_HEIGHT))
    {
      maxHeight =  parent!.offsetTop - target.offsetTop - padding;
      target.classList.add('above');
    }
    target.style.setProperty('--max-height', `${maxHeight}px`);

    let currentSelectionValue = value ?? (selectedDisplay.current! as HTMLElement).dataset.value;
    let currentSelectionIndex = 0;
    if(options != null && options.length > 0 && ((!isNaN(parseInt(currentSelectionValue))) || (currentSelectionValue != null && (currentSelectionValue.trim != null && currentSelectionValue.trim() != ""))))
    {
      for(let i = 0; i < options.length; i++)
      {
        if(options[i].value == currentSelectionValue)
        {
          currentSelectionIndex = i;
          break;
        }
      }
    }
    setSelectedOption(options[currentSelectionIndex]);
  });

  const handleOffComponentClick = useCallback((event: Event) =>
  {
    if((event.target as HTMLElement).closest('[data-selection]') == null)
    {
      setOpen(false);
      window.removeEventListener('click', handleOffComponentClick);

      // should prevent clickthrough to elements underneath;
      // doesn't work for range inputs (click still sets range); does work for toggles (click does not toggle input); 
      event.stopPropagation();
      event.preventDefault();
    }
  }, []);

  const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
    const newValue = !open;
    setOpen(newValue);
    window.removeEventListener('click', handleOffComponentClick);
    if(newValue == true)
    {
      window.addEventListener('click', handleOffComponentClick, {once: true});
    }
    event.stopPropagation();
  };

  const handleSelect = (optionElement: HTMLElement) => {
    const option = { label: optionElement.textContent ?? "", value: optionElement.dataset.value ?? "" };
    setSelectedOption(option);
    if(onChange != null) { onChange(option.value); }
    setOpen(false);
    window.removeEventListener('click', handleOffComponentClick);
  };

  const optionElements = (options == null) ? <></> : options.map((option: {value: string, label: string}, index: number) =>
    <div className="option" key={index} data-value={option.value} onClick={(event) =>
    {
      const option = event.currentTarget as HTMLElement;
      handleSelect(option);
    }}>{option.label}</div>
  );

  return (<div className={`option-select${(open) ? ' open' : ''}`} ref={containerElement}>
      <div className="selected" ref={selectedDisplay} data-value={selectedOption?.value} onClick={handleOpen}>
        <span className="label">{selectedOption?.label}</span>
      </div>
      {open ? 
      <div className="options">
        <header>{listHeaderContent}</header>
        <div className="items">
          {optionElements}
        </div>
      </div> : null}
    </div>)
}

export default OptionSelectComponent