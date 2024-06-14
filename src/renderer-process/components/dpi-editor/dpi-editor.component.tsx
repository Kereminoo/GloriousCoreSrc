import { CSSProperties, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import './dpi-editor.component.css'
import DpiGraphSectionComponent from '../dpi-graph-section/dpi-graph-section.component';
import { DeviceService } from '@renderer/services/device.service';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useTranslate } from '@renderer/contexts/translations.context';
import SVGIconComponent from '../svg-icon/svg-icon.component';
import { DPIStageData, ProfileData } from '../../../common/data/records/device-data.record';
import { DPISection } from '@renderer/data/dpi-section';
import DPIPill, { DPIColor, DPIPillColorStyle } from '../dpi-pill/dpi-pill';
import { Color } from '../component.types';
import Icon from '../icon/icon';
import { IconSize, IconType } from '../icon/icon.types';

// const debugSections = new Array(
//   { min: 100, max: 1000, ticks: 0 },
//   { min: 1000, max: 2000, ticks: 0 },
//   { min: 2000, max: 3000, ticks: 0 },
//   { min: 3000, max: 4000, ticks: 0 },
//   { min: 4000, max: 8000, ticks: 3 },
//   { min: 8000, max: 12000, ticks: 3 },
//   { min: 12000, max: 19000, ticks: 5 },
// );
// const debugStages = new Array(
//   { value: 400, color: "#FFAC26", isDefault: false },
//   { value: 800, color: "#26B4FF", isDefault: false },
//   { value: 1600, color: "#FF2626", isDefault: false },
//   { value: 3200, color: "#18B30A", isDefault: false },
// );

const SECTION_WIDTH = 40;
const STAGE_NODE_SIZE = 15;

const defaultStageColors: DPIColor[] = 
[
  Color.FriendlyYellow,
  Color.FriendlyBlue,
  Color.FriendlyRed,
  Color.FriendlyGreen,
  Color.FriendlyPurple,
  Color.FriendlyTeal,
];

const DPIColorHexMap: Map<DPIColor, string> = new Map([
  [Color.FriendlyYellow, 'FFA40D'],
  [Color.FriendlyBlue, '#26B4FF'],
  [Color.FriendlyRed, '#FF2626'],
  [Color.FriendlyGreen, '#18B30A'],
  [Color.FriendlyPurple, '#BA01FF'],
  [Color.FriendlyTeal, '#2EF6CA']
]);

const defaultStageValues = 
[
  400,
  800,
  1600,
  3200,
  6400,
  12800
];

const TRACK_PADDING_X = 10;
const TRACK_PADDING_TOP = 20;

function DpiEditorComponent(props: any) 
{
  const { className } = props;

  const translate = useTranslate();
  
  const devicesContext = useDevicesContext();
  const { getCurrentProfile } = useDevicesManagementContext();

  const 
  {
    addDPIStage,
    removeDPIStage,
    setDefaultDPIStage
  } = useDevicesManagementContext();

  // const [currentProfile, setCurrentProfile] = useState<any>(null);

  const [stages, setStages] = useState<any[]>([]);

  const [sections, setSections] = useState<DPISection[]>([]);
  const [caretPosition, setCaretPosition] = useState(0);

  const track = useRef(null);
  const caret = useRef(null);

  const addDPIValue =  useRef(defaultStageValues[stages.length]);

  useEffect(() =>
  {
    if(devicesContext.previewDevice == null) { return; }

    const profile = getCurrentProfile();

    if(profile?.performance == null)
    {
      console.error('Device Performance data is undefined.');
      return;
    }

    // const profile = DeviceService.getCurrentDeviceProfile(devicesContext.previewDevice);
    // setCurrentProfile(profile);
    // console.log(device.dpiSections, device);

    setSections(devicesContext.previewDevice.dpiSections);

    // console.log(profile.performance.DpiStage);
    const stages:DPIStageData[] = [];
    for(let i = 0; i < profile.performance.DpiStage.length; i++)
    {
      const stage = structuredClone(profile.performance.DpiStage[i]);
      if(i == profile.performance.dpiSelectIndex)
      {
        stage.isDefault = true;
      }
      else
      {
        stage.isDefault = false;
      }
      if(!stage.color.startsWith('#'))
      {
        stage.color = '#' + stage.color;
      }
      stages.push(stage);
    }
    setStages(stages);
    addDPIValue.current = defaultStageValues[stages.length]
  }, 
  [
    getCurrentProfile()?.performance?.DpiStage,
    getCurrentProfile()?.performance?.dpiSelectIndex
  ]);

  const getStageItems = (currentProfile: ProfileData|undefined) =>
  {
    if(currentProfile == null) { return null; }

    const stageItems: any[] = [];
    for(let i = 0; i < stages.length; i++)
    {
      stageItems.push(<li className="item stage" key={i} data-index={i} style={{"--stage-color": stages[i].color} as React.CSSProperties}>
        {/* <div className={`capsule${(stages[i].isDefault) ? " default" : ""}`} title={(stages[i].isDefault) ? "Default" : "Set New Default?"}
        onClick={(event) =>
        {
          setDefaultDPIStage(i);          
        }} >
          <div className="color"></div>
          <div className="value">{stages[i].value}</div>
        </div> */}
        <DPIPill value={stages[i].value} title={(stages[i].isDefault) ? "Default" : "Set New Default?"} color={stages[i].color} isDefault={stages[i].isDefault}
         onClick={(event) =>
         {
            setDefaultDPIStage(i);          
         }} />
        <button type="button" className="remove" title="Remove Stage" onClick={() =>
        {
          removeDPIStage(i);
        }}>
          {/* <SVGIconComponent src="/images/icons/close.svg" /> */}
          <Icon type={IconType.CancelCross} color={Color.Base50} size={IconSize.Smaller} />
        </button>
        <div className="default-title">{(stages[i].isDefault) ? "Default" : "Set New Default?"}</div>
      </li>)
    }
    return stageItems;
  }

  const getStageTrackNodes = () =>
  {
    const stageItems: any[] = [];
    for(let i = 0; i < stages.length; i++)
    {
      let xPosition = (STAGE_NODE_SIZE/2) * -1;
      let section: any = null;
      for(let j = 0; j < sections.length; j++)
      {
        if(sections[j].min <= stages[i].value)
        {
          section = sections[j];
          const increment = (section.max > stages[i].value) ? 0 : (section.ticks + 1) * SECTION_WIDTH;
          // console.log('increment', increment);
          xPosition += increment;
          
          if(section.max > stages[i].value)
          {
            break;
          }
        }
      }
      if(section != null)
      {
        // const sectionStart = xPosition;
        // console.log(stages[i], section);
        const sectionRange = section.max - section.min;
        const normalizedValue = stages[i].value - section.min;
        const percentageOfRange = (normalizedValue / sectionRange) * 100;
        let sectionWidth = (section.ticks + 1) * SECTION_WIDTH;
        sectionWidth = (sectionWidth > 0) ? sectionWidth : SECTION_WIDTH;
        // console.log(xPosition);
        const sectionX = sectionWidth * (percentageOfRange/100)
        xPosition += sectionX;
        // console.log(xPosition);

        // debugging stage position
        // console.log(`${stages[i].value} is ${percentageOfRange}% of the range between ${section.min} and ${section.max}, which is a span of ${sectionRange} units.`);
        // console.log(`The section width is ${sectionWidth} pixels.`);
        // console.log(`${sectionX} is ${percentageOfRange}% of the section width ( ${sectionWidth} pixels ).`);
        // console.log(`X should be ${sectionX} past the start of the section (${sectionStart}).`);
        // console.log(`X is ${xPosition}.`);
      }
      stageItems.push(<div className="stage" key={i} style={{"--stage-color": stages[i].color, "--left": `${xPosition}px`} as React.CSSProperties}></div>)
    }
    return stageItems;
  }

  const getDPIValueFromPosition = (xPosition: number) =>
  {
    let value = 0;
    let section: any = null;
    for(let j = 0; j < sections.length; j++)
    {
      if(sections[j].min <= xPosition)
      {
        section = sections[j];
        const increment = (j == 0) ? 0 : (section.ticks == 0) ? 31 : section.ticks * 31;
        value += increment;
        // console.log(xPosition);
        if(section.max > xPosition)
        {
          break;
        }
      }
    }
    if(section != null)
    {
      // console.log(stages[i], section);
      const sectionRange = section.max - section.min;
      const normalizedValue = xPosition - section.min;
      const percentageOfRange = (normalizedValue / sectionRange) * 100;
      let sectionWidth = section.ticks * 31;
      sectionWidth = (sectionWidth > 0) ? sectionWidth : SECTION_WIDTH;
      // console.log(xPosition);
      value += sectionWidth * (percentageOfRange/100);
      // console.log(xPosition);

      // debugging stage position
      // console.log(`${stages[i].value} is ${percentageOfRange}% of the range between ${section.min} and ${section.max}, which is a span of ${sectionRange} units.`);
      // console.log(`The section width is ${sectionWidth} pixels.`);
      // console.log(`${xPosition} is ${percentageOfRange}% of the section width ( ${sectionWidth} pixels ).`);
    }
    return value;
  };

  const getColor = () =>
  {
    return defaultStageColors[stages.length];
  }

  const getSectionFromCaret = (): [DPISection, HTMLElement|null] =>
  {
    const caretRect = (caret.current! as HTMLElement).getBoundingClientRect();
    const caretHalfWidth = (caretRect.width / 2);
    const caretCenterX = (track.current! as HTMLElement).offsetLeft + caretPosition + caretHalfWidth;

    if(caretCenterX > (track.current! as HTMLElement).offsetWidth - 10)
    {
      const sectionElements = [...(track.current! as HTMLElement).querySelectorAll('section')] as HTMLElement[];
      return [sections[sections.length - 1], (sectionElements.length > 0) ? sectionElements[sectionElements.length - 1] : null];
    }
    else if(caretCenterX <= 0)
    {
      return [sections[0], (track.current! as HTMLElement).querySelector('section')];
    }

    const testPoint = 
    {
      x:caretCenterX,
      y:caretRect.y+((caretRect.height/2)+1) 
    }

    // const debugElement = document.createElement('div');
    // debugElement.style.position = 'fixed';
    // debugElement.style.top = `${testPoint.y}px`;
    // debugElement.style.left = `${testPoint.x}px`;
    // debugElement.style.width = '10px';
    // debugElement.style.height = '10px';
    // debugElement.style.zIndex = '100';
    // debugElement.style.borderRadius = '50%';
    // debugElement.style.background = '#FF6666'

    // document.body.append(debugElement);
    // console.log(debugElement);
    // setTimeout(() =>
    // {
    //   debugElement.remove();
    // }, 10000)

    const elements = document.elementsFromPoint(testPoint.x, testPoint.y);
    let sectionElement: HTMLElement|null = null;
    for(let i = 0; i < elements.length; i++)
    {
      if(elements[i].tagName == "SECTION" && elements[i].parentElement == track.current)
      {
        sectionElement = elements[i] as HTMLElement;
      }
    }

    if(sectionElement == null)
    {
      console.warn("Clicked section not found");
      return [sections[0], (track.current! as HTMLElement).querySelector('section')];
    }

    const sectionIndex = parseInt(sectionElement.dataset.index!);
    return [sections[sectionIndex], sectionElement];
  }

  return (<div className={`dpi-editor${(className == null) ? "" : className}`}>
    <div className="stages">
      <header>
        <div className="title">
          {translate('Device_DPI_Label_DPIStages', 'DPI Stages')}
        </div>
      </header>
      <ul className="items">
        {getStageItems(getCurrentProfile())}
        {(stages.length < 6)
        ? <li className="item">
            <DPIPill value={addDPIValue.current} color={getColor()} style={DPIPillColorStyle.Border} useHoverEffect={false} onChange={(value: number) =>
            {
              addDPIValue.current = value;
            }} />
            <button type="button" className="add" title="Add" onClick={() =>
            {
              const value = (addDPIValue.current > sections[sections.length - 1].max) ? sections[sections.length - 1].max :  addDPIValue.current;
              console.log(value, sections);
              const color = getColor();
              const colorHex = DPIColorHexMap.get(color);
              const stage = new DPIStageData(value, colorHex);
              addDPIStage(stage);
            }}>
              <Icon type={IconType.CancelCross} color={Color.Base50} size={IconSize.Smaller} />
            </button>
          </li>
        : undefined}
        
      </ul>
    </div>
    <div className="track" ref={track}
      style={{
        '--track-padding-top': `${TRACK_PADDING_TOP}px`,
        '--track-padding-x': `${TRACK_PADDING_X}px`,
        '--section-width': `${SECTION_WIDTH}px`,
        '--stage-node-size': `${STAGE_NODE_SIZE}px`,
      } as CSSProperties}
      
      onMouseMove={(event) => 
      { 
        // console.log(event);
        const left = (track.current! as HTMLElement).offsetLeft;
        const caretHalfWidth = ((caret.current! as HTMLElement).offsetWidth / 2);
        const trackWidth = (track.current! as HTMLElement).offsetWidth - (TRACK_PADDING_X * 2);
        const offset = event.pageX - left - caretHalfWidth;
        let newPosition = offset - TRACK_PADDING_X;

        // debug
        // const section = getSectionFromCaret();
        // console.log(section[0].min, section[0].max);
        // console.log(offset, newPosition);
        if(newPosition < (caretHalfWidth * -1))
        {
          newPosition = (caretHalfWidth * -1);
        }
        else if(offset > trackWidth)
        {
          newPosition = trackWidth - caretHalfWidth;
        }
        setCaretPosition(newPosition);
      }}
      onClick={(event) =>
      {
        if(getCurrentProfile()?.performance == null || getCurrentProfile().performance.DpiStage.length >= 6)
        {
          return;
        }

        // const localPosition = event.pageX - (track.current! as HTMLElement).offsetLeft - (event.currentTarget as HTMLElement).offsetLeft;
        const caretHalfWidth = ((caret.current! as HTMLElement).offsetWidth / 2);
        const localPosition = caretPosition + caretHalfWidth;
        // console.log('track', localPosition);
        
        const [section, sectionElement] = getSectionFromCaret();
        if(sectionElement == null)
        {
          console.error("no section element found under cursor");
          return;
        }
        let percentage = ((localPosition - sectionElement.offsetLeft + TRACK_PADDING_X) / sectionElement.offsetWidth) * 100; 
        // console.log(localPosition, sectionElement!.offsetLeft, (localPosition - sectionElement!.offsetLeft + TRACK_PADDING_X), sectionElement!.offsetWidth)
        percentage = percentage / 100;
        // console.log(section);
        let dpiValue = section.min + (section.max - section.min) * percentage;
        if(dpiValue < 0) { dpiValue = devicesContext.previewDevice!.dpiSections[0].min; }
        dpiValue = Math.round(dpiValue);
        // console.log(dpiValue);
        
        if(dpiValue < 10000) { dpiValue = Math.round(dpiValue/10)*10; }
        if(dpiValue >= 10000) { dpiValue = Math.round(dpiValue/100)*100; }

        const color = getColor();
        const colorHex = DPIColorHexMap.get(color);
        const stage = new DPIStageData(dpiValue, colorHex);
        addDPIStage(stage);
      }} >
        <div className="caret" ref={caret} style={{"--caret-position": `${caretPosition}px`} as React.CSSProperties}></div>
        {sections.map((section, index) => <DpiGraphSectionComponent min={section.min} max={section.max} ticks={section.ticks} key={index} sectionIndex={index} />)}
        
        {getStageTrackNodes()}
    </div>
  </div>)
}

export default DpiEditorComponent