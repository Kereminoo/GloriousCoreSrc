import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './toggle-choice.component.css'

function ToggleChoiceComponent(props: any) 
{
  const { choice, onChange, thumbContent, choiceAContent, choiceBContent, disableChoiceA, disableChoiceB } = props;
  const [checked, setChecked] = useState((choice == null) ? false : (choice == 'b'));

  const [choiceA, setChoiceA] = useState(<>Option A</>);
  const [choiceB, setChoiceB] = useState(<>Option B</>);
  const [selectedChoice, setSelectedChoice] = useState<'a'|'b'>('a');

  useEffect(() =>
  {
    if(selectedChoice == null) { return; }
    setSelectedChoice(selectedChoice);
  }, [selectedChoice]);

  useEffect(() =>
  {
    if(choiceAContent == null) { return; }
    setChoiceA(choiceAContent);
  }, [choiceAContent]);
  useEffect(() =>
  {
    if(choiceAContent == null) { return; }
    setChoiceB(choiceBContent);
  }, [choiceBContent]);

  useEffect(() =>
  {
    setChecked((choice == 'b'));
  }, [choice]);

  useEffect(() =>
  {
    const value = (checked) ? 'b' : 'a';
    setSelectedChoice(value);
    if(onChange != null){ onChange(value); }
  }, [checked]);

  return (<div className="track" data-toggle-choice>
    <input type="checkbox" checked={checked} onChange={() => 
      { 
        if(disableChoiceA || disableChoiceB) { return; }
        const value = !checked; setChecked(value); 
      }} />
    <div className={`choice a${(disableChoiceA == true) ? " disabled" : ""}`}>{choiceA}</div>
    <div className={`choice b${(disableChoiceB == true) ? " disabled" : ""}`}>{choiceB}</div>
    <div className="thumb">{thumbContent == null ? null : thumbContent}</div>
  </div>)
}

export default ToggleChoiceComponent