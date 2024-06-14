import React, { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import './device-lighting-preview-node.component.css'
import { useParams } from 'react-router';

function DeviceLightingPreviewNodeComponent(props: any) 
{
  const { title, targetColor, currentColor, x, y, width, height, quickKeyIds } = props;

  const {subpage} = useParams();

  const lightingCanvas = useRef(null);
  const lightingNodes = useRef(null);
  const [lightingNodeItems, setLightingNodeItems] = useState(new Array());

  const [style, setStyle] = useState({ 
    backgroundColor:`rgb(${targetColor.red} ${targetColor.green} ${targetColor.blue} / ${targetColor.alpha})`, 
    translate: `${x}px ${y}px`, 
    width: `${width}px`, 
    height: `${height}px`,
    opacity: '0', 
  });

  useEffect(() =>
  {
    setStyle({ 
      backgroundColor:`rgb(${currentColor.red} ${currentColor.green} ${currentColor.blue} / ${currentColor.alpha})`, 
      translate: `${x}px ${y}px`, 
      width: `${width}px`, 
      height: `${height}px`,
      opacity: style.opacity
    });
  }, [currentColor]);

  useEffect(() =>
  {
    if(quickKeyIds.indexOf(2) > -1 && subpage != 'lighting')
    {
      setStyle({...style, opacity: '0'})
    }
    else
    {
      setStyle({...style, opacity: '1'});
    }
    console.log('quick', quickKeyIds);
  }, [subpage])

  return (<><div 
    className="node" 
    title={title}
    style={style}
    >{/*name*/}</div>
  </>)
}

export default DeviceLightingPreviewNodeComponent;