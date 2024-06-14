import React, { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import './device-lighting-selection-node.component.css'

function DeviceLightingSelectionNodeComponent(props: any) 
{
  const { title, currentColor, x, y, width, height, onClick, selected, onHoverStart, onHoverEnd } = props;

  const [style, setStyle] = useState({
    translate: `${x}px ${y}px`, 
    width: `${width}px`, 
    height: `${height}px`,
  });

  useEffect(() =>
  {
    setStyle({
      translate: `${x}px ${y}px`, 
      width: `${width}px`, 
      height: `${height}px`,
    });
  }, [currentColor]);

  return (<><div 
    className="node" 
    title={title}
    style={style}
    onClick={onClick}
    onMouseEnter={() => { if(onHoverStart == null) { return; } onHoverStart(); }}
    onMouseLeave={() => { if(onHoverEnd == null) { return; } onHoverEnd(); }}
    data-selected={(selected) ? title : null}
    >
      <div className="hover-indicator"></div>
      <div className="selected-indicator"></div>
    {/*name*/}</div>
  </>)
}

export default DeviceLightingSelectionNodeComponent;