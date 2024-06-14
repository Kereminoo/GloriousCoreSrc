import { CSSProperties, useEffect, useState } from "react";
import './unsaved-property-indicator.component.css'
// import { useDevicesContext } from "@renderer/contexts/devices.context";
import { useUIContext } from "@renderer/contexts/ui.context";

function UnsavedPropertyIndicatorComponent(props :any) 
{
    const { propertyKey, propertyKeys } = props;

    // const devicesContext = useDevicesContext();
    const uiContext = useUIContext();


    const [propertyIsUnsaved, setPropertyIsUnsaved] = useState(false);

    useEffect(() =>
    {
        if(uiContext.unsavedPropertyNames.has(propertyKey))
        {
            setPropertyIsUnsaved(true);
        }
        else if(propertyKeys != null)
        {
            for(let i = 0; i < propertyKeys.length; i++)
            {
                if(uiContext.unsavedPropertyNames.has(propertyKeys[i]))
                {
                    setPropertyIsUnsaved(true);
                    break;
                }
            }
        }

    }, [uiContext.unsavedPropertyNames]);

    return <span className={`unsaved-property-indicator${(propertyIsUnsaved) ? ' unsaved' : ''}`}></span>
}

function getNestedPropertyValue(target: any, propertyKey: string)
{
    let propertyValue = (propertyKey.indexOf('.') == -1) ? target[propertyKey] : 
    propertyKey.split('.').reduce((ref: any, refKey: string, index: number) =>
    {
        return (ref || {})[refKey];
    }, target);

    return propertyValue;
}

export default UnsavedPropertyIndicatorComponent;