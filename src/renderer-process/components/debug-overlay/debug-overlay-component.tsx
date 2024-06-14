import './debug-overlay-component.css';
import MockDeviceProviderComponent from '../mock-device-provider/mock-device-provider.component';
import FirmwareSelectorComponent from '../firmware-selector/firmware-selector-component';
import { ReactElement, useEffect, useState } from 'react';
import HidReportSenderComponent from '../device-hid-intercation/device-hid-sender-component';
import Icon from '../icon/icon';
import { IconSize, IconType, UniqueIconSize, UniqueIconSizeMap } from '../icon/icon.types';

function DebugOverlayComponent(props: any) {
    const { visible } = props;
    const [show, setShow] = useState(visible);
    const [icons, setIcons] = useState<ReactElement[]>([]);

    useEffect(() => {
        const keyPressHandler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key == 'd') {
                setShow(!show);
            }
        };
        document.addEventListener('keydown', keyPressHandler);
        return () => document.removeEventListener('keydown', keyPressHandler);
    }, [show]);

    
  useEffect(() =>
  {

    const icons: ReactElement[] = [];
    for(const [key, value] of Object.entries(IconType))
    {
        let iconDimensions: {width:string, height: string}|undefined = undefined;
        switch(value)
        {
            case IconType.ModelODevice:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.ModelO);
                break;
            case IconType.ModelDDevice:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.ModelD);
                break;
            case IconType.ModelIDevice:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.ModelI);
                break;
            // case IconType.valueJ:
            //     iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.valueJ);
            //     break;
            case IconType.GMMKPRODevice:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.GMMKPRO);
                break;
            case IconType.GMMK265Device:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.GMMK265);
                break;
            case IconType.GMMK296Device:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.GMMK296);
                break;
            case IconType.NumpadDevice:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.Numpad);
                break;
            case IconType.Drag:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.Drag);
                break;
            case IconType.LayerTop:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.LayerTop);
                break;
            case IconType.LayerUnderneath:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.LayerUnderneath);
                break;
            case IconType.NavigationArrow:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.NavigationArrow);
                break;
            case IconType.DocumentMagnifyingGlass:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.DocumentMagnifyingGlass);
                break;
            case IconType.USBSymbol:
                iconDimensions = UniqueIconSizeMap.get(UniqueIconSize.USBSymbol);
                break;
            default:
                iconDimensions = undefined;
        }

        icons.push(<Icon key={key} 
            type={value as IconType}
            size={IconSize.Medium}
            width={(iconDimensions == undefined) 
            ? undefined
            : iconDimensions.width}
            height={(iconDimensions == undefined) 
            ? undefined
            : iconDimensions.height} />);
    }
    setIcons(icons);
    // if(devicesContext.previewDevice == null) { return; }

    // const deviceInputLayout: any = DeviceInputLayoutData[devicesContext.previewDevice.SN];
    // if(deviceInputLayout == null)
    // {
    //   return;
    // }

    // const colorNodes: LayoutNode[] = [];
    // for(let i = 0; i < deviceInputLayout.layoutNodes.length; i++)
    // {
    //   const node = deviceInputLayout.layoutNodes[i];
    //   if(!node.hasLight)
    //   {
    //     continue;
    //   }
    //   node.keybindArrayIndex = i;
    //   colorNodes.push(node);
    // }  
      
    // const nodeItems: any[] = [];
    // for(let i = 0; i < colorNodes.length; i++)
    // {
    //   const nodeDefinition = colorNodes[i];
    //   nodeItems.push(<DeviceLightingSelectionNodeComponent
    //   title={nodeDefinition.translationKey}
    //   key={i}
    //   x={nodeDefinition.position.x}
    //   y={nodeDefinition.position.y}
    //   width={nodeDefinition.size.width}
    //   height={nodeDefinition.size.height}
    //   onClick={() => { handleNodeClick(nodeDefinition); }}
    //   selected={uiContext.perKeyLightingSelectedNode==nodeDefinition}
    //   onHoverStart={() => { setHoverNode(nodeDefinition); }}
    //   onHoverEnd={() => { setHoverNode(null); }}
    //     />)
    // }
    // setNodeItems(nodeItems);

   
  }, [IconType]);

    return (
        <>
            <dialog className="debug-overlay" open={show}>
                <header>Debug settings</header>
                <MockDeviceProviderComponent
                    onDevicesLoaded={(devices: any) => {
                        console.log(devices);
                    }}
                ></MockDeviceProviderComponent>
                <FirmwareSelectorComponent></FirmwareSelectorComponent>
                <HidReportSenderComponent></HidReportSenderComponent>
                <section>
                    <header>Icons</header>
                    {icons}
                </section>
                <button
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    Close overlay
                </button>
            </dialog>
        </>
    );
}

export default DebugOverlayComponent;
