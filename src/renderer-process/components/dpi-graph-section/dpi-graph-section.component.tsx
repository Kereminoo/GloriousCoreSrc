import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './dpi-graph-section.component.css'

function DpiGraphSectionComponent(props: any) 
{
  const { min, max, ticks, sectionIndex, onClick } = props;

  const getTicks = () =>
  {
    const tickElements: any[] = [];
    for(let i = 0; i < ticks + 1; i++)
    {
      tickElements.push(<div className="range" key={i}></div>)
    }
    return (tickElements.length == 0) ? [<div className="range"></div>] : tickElements;
  }

  return (<section data-min={min} data-max={max} data-index={sectionIndex} onClick={onClick}>
    {getTicks()}
  </section>)
}

export default DpiGraphSectionComponent