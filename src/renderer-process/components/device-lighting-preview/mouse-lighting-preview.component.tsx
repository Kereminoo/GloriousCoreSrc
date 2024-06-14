import { useEffect, useRef } from 'react';
import './device-lighting-preview.component.css';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { DeviceRecordColorData } from '../../../common/data/records/device-data.record';
import { RGBGradients_Default } from '@renderer/data/rgb-gradient';

const animationSpeed_defaultAdjustment = .5;


function MouseLightingPreviewComponent(props: any) 
{
  const devicesContext = useDevicesContext();
  const { getCurrentProfile } = useDevicesManagementContext();

  const lightingCanvas = useRef(null);
  const gradientScrollOffset = useRef(0);
  
  const breathing = useRef({
    operationKey: 'Lighten',
    lightnessPercent: 100,
    targetIndex: 0,
  });
  const seamlessBreathing = useRef({
    targetIndex: 0,
    mixIndex: 1,
    mixPercent: 0,
  });
  const breathingSingleColor = useRef({
    operationKey: 'Lighten',
    lightnessPercent: 100
  });

  const tailProperties = useRef({
    colorIndex: 0, // what color to show
    colorOffsetIndex: 0, // how much to shift the color array
    rotationIndex: 4, // 
    displayDuration: 10,
    elapsedDuration: 0
  });

  const raveProperties = useRef({
    colorIndex: 0,
    directionIndex: 0,
    displayDuration: 10,
    elapsedDuration: 0
  });

  const animationFrameHandleReference = useRef<number|null>(null);
  const animationContext = useRef<CanvasRenderingContext2D|null>(null);
  const canvasFillFunction = useRef<((animationSpeed: number) => CanvasGradient|RGBAColor)|null>(null);
  const currentAnimationColor = useRef<RGBAColor|null>(null);
  const currentAnimationColors = useRef<RGBAColor[]>([]);
  const currentGradientStops = useRef<{stop: number, hex: string}[]>([]);

  useEffect(() =>
  {
    // animationInterval.current = setInterval(animationLoop, 15);
    // return () => removeAnimationListeners();
    animationFrameHandleReference.current = requestAnimationFrame(animationLoop);
    return () => removeAnimationListeners();
  }, []);

  useEffect(() =>
  {
    const profile = getCurrentProfile();
    if(profile.lighting?.Effect == null) { return; }

    const effect = profile.lighting.Effect;
    // const displayOption = devicesContext.previewDevice.lightingEffects[effect];

    if(effect == 0)
    {
      canvasFillFunction.current = createGradient_Glorious;
    }
    else if(effect == 1)
    {
      canvasFillFunction.current = createGradient_SeamlessBreathing;
    }
    else if(effect == 2)
    {
      canvasFillFunction.current = createGradient_Breathing;
    }
    else if(effect == 3)
    {
      canvasFillFunction.current = createGradient_SingleColor;
    }
    else if(effect == 4)
    {
      canvasFillFunction.current = createGradient_BreathingSingleColor;
    }
    else if(effect == 5)
    {
      canvasFillFunction.current = createGradient_Tail;
    }
    else if(effect == 6)
    {
      canvasFillFunction.current = createGradient_Rave;
    }
    else if(effect == 7)
    {
      canvasFillFunction.current = createGradient_Wave;
    }
    else if(effect == 8)
    {
      canvasFillFunction.current = createGradient_LEDOff;
    }
    updateGradientStops();

    // console.log(canvasFillFunction.current);
  }, [getCurrentProfile()?.lighting?.Effect]);
  
  useEffect(() =>
  {
    const profile = getCurrentProfile();
    if(profile == null || profile?.lighting?.Color == null) { return; }

    const colors = (profile.lighting.Color.length == 0) ? [new DeviceRecordColorData(255, 255, 255, false)] : profile.lighting.Color;
    const color = colors[0];

    currentAnimationColor.current = RGBAColor.fromRGB(color.R, color.G, color.B);

    currentAnimationColors.current = [];
    for(let i = 0; i < colors.length; i++)
    {
      currentAnimationColors.current.push(RGBAColor.fromRGB(colors[i].R, colors[i].G, colors[i].B))
    }
    
    updateGradientStops();

    console.log(currentAnimationColor.current, currentAnimationColors.current, currentGradientStops.current);
    
  }, [getCurrentProfile()?.lighting?.Color]);

  const updateGradientStops = () =>
  {
    const profile = getCurrentProfile();
    if(profile?.lighting == null) { return; }
    
    const gradientStops = (profile.lighting.Effect == 0) ?
    RGBGradients_Default[0].data.stops : // GloriousMode
    profile.lighting.Color.map(color => { return { hex: RGBAColor.fromRGB(color.R, color.G, color.B).toHex(), stop: undefined }; });

    if(gradientStops.length == 1) { gradientStops.push(gradientStops[0]); }
    const composedStops: any[] = [];
    const stepValue = 100 / gradientStops.length;
    let currentStepValue = 0;
    for(let j = 0; j < gradientStops.length; j++)
    {
      if(gradientStops[j].stop != null) { composedStops.push(gradientStops[j]); }
      else { composedStops.push({ hex: gradientStops[j].hex, stop: currentStepValue}); }
      currentStepValue += stepValue;
    }

    // console.log('gradient', composedStops);
    currentGradientStops.current = composedStops;
  }

  const removeAnimationListeners = () =>
  {
    if(animationFrameHandleReference.current != null)
    {
      cancelAnimationFrame(animationFrameHandleReference.current)
    }
  }

  const getCurrentBreathingSingleColor = (animationSpeed: number, targetColor: RGBAColor) =>
  {
    // calculate percentage of how light the colors should be
    if(breathingSingleColor.current.lightnessPercent <= 0)
    {
      breathingSingleColor.current.lightnessPercent = 0;
      breathingSingleColor.current.operationKey = 'Lighten';
    }
    else if(breathingSingleColor.current.lightnessPercent >= 100)
    {
      breathingSingleColor.current.lightnessPercent = 100;
      breathingSingleColor.current.operationKey = 'Darken';
    }

    const breathingStep = (1 * animationSpeed)
    if(breathingSingleColor.current.operationKey == 'Darken')
    {
      breathingSingleColor.current.lightnessPercent = breathingSingleColor.current.lightnessPercent - breathingStep;
    }
    else if(breathingSingleColor.current.operationKey == 'Lighten')
    {
      breathingSingleColor.current.lightnessPercent = breathingSingleColor.current.lightnessPercent + breathingStep;
    }

    // get percentage between the target and 0 for each color
    const updatedRed = (breathingSingleColor.current.lightnessPercent / 100) * targetColor.red;
    const updatedGreen = (breathingSingleColor.current.lightnessPercent / 100) * targetColor.green;
    const updatedBlue = (breathingSingleColor.current.lightnessPercent / 100) * targetColor.blue;
    
    return RGBAColor.fromRGB(updatedRed, updatedGreen, updatedBlue);
  }

  const getCurrentBreathingColor = (animationSpeed: number, targetColors: RGBAColor[]) =>
  {
    // calculate percentage of how light the colors should be
    if(breathing.current.lightnessPercent <= 0)
    {
      breathing.current.lightnessPercent = 0;
      breathing.current.operationKey = 'Lighten';
      breathing.current.targetIndex += 1;
      if(breathing.current.targetIndex > (targetColors.length - 1))
      {
        breathing.current.targetIndex = 0;
      }
    }
    else if(breathing.current.lightnessPercent >= 100)
    {
      breathing.current.lightnessPercent = 100;
      breathing.current.operationKey = 'Darken';
    }

    const breathingStep = (1 * animationSpeed)
    if(breathing.current.operationKey == 'Darken')
    {
      breathing.current.lightnessPercent = breathing.current.lightnessPercent - breathingStep;
    }
    else if(breathing.current.operationKey == 'Lighten')
    {
      breathing.current.lightnessPercent = breathing.current.lightnessPercent + breathingStep;
    }
    
    const targetColor = RGBAColor.fromRGB(targetColors[breathing.current.targetIndex].r, targetColors[breathing.current.targetIndex].g, targetColors[breathing.current.targetIndex].b);

    // get percentage between the target and 0 for each color
    const updatedRed = (breathing.current.lightnessPercent / 100) * targetColor.red;
    const updatedGreen = (breathing.current.lightnessPercent / 100) * targetColor.green;
    const updatedBlue = (breathing.current.lightnessPercent / 100) * targetColor.blue;
    
    return RGBAColor.fromRGB(updatedRed, updatedGreen, updatedBlue);
  }

  const getCurrentSeamlessBreathingColor = (animationSpeed: number, targetColors: RGBAColor[]) =>
  {
    if(seamlessBreathing.current.mixPercent >= 100)
    {
      seamlessBreathing.current.mixPercent = 0;

      seamlessBreathing.current.targetIndex += 1;
      seamlessBreathing.current.mixIndex = seamlessBreathing.current.targetIndex + 1;
    }
    if(seamlessBreathing.current.targetIndex > (targetColors.length - 1))
    {
      seamlessBreathing.current.targetIndex= 0;
    }
    if(seamlessBreathing.current.mixIndex > (targetColors.length - 1))
    {
      seamlessBreathing.current.mixIndex= 0;
    }

    const targetColor = RGBAColor.fromRGB(targetColors[seamlessBreathing.current.targetIndex].r, targetColors[seamlessBreathing.current.targetIndex].g, targetColors[seamlessBreathing.current.targetIndex].b);
    const mixColor = RGBAColor.fromRGB(targetColors[seamlessBreathing.current.mixIndex].r, targetColors[seamlessBreathing.current.mixIndex].g, targetColors[seamlessBreathing.current.mixIndex].b);

    const mixFloat = seamlessBreathing.current.mixPercent / 100;

    // additive color blend (light is additive)
    const updatedRed = Math.round(targetColor.red + (mixFloat * (mixColor.red - targetColor.red)));
    const updatedGreen = Math.round(targetColor.green + (mixFloat * (mixColor.green - targetColor.green)));
    const updatedBlue = Math.round(targetColor.blue + (mixFloat * (mixColor.blue - targetColor.blue)));

    seamlessBreathing.current.mixPercent += animationSpeed;
    
    return RGBAColor.fromRGB(updatedRed, updatedGreen, updatedBlue);
  }

  const interval = (1.0 / 30.0) * 1000; // locked framerate prevents over-rendering; 30fps
  const previousTime = useRef(interval);

  const animationLoop = (time: number) =>
  {
    let timeSinceLastFrame = time - previousTime.current;
    const animationSpeed = animationSpeed_defaultAdjustment;

    if(timeSinceLastFrame >= interval)
    {
      previousTime.current = time;
        // calculate new lighting
        // console.log(lightPreset);
        onDrawUpdate(animationSpeed);

        // console.log('update');

        // setLightingNodeItems(currentGradientEffectNodes.current);
    }

    animationFrameHandleReference.current = requestAnimationFrame(animationLoop)
  };
  
  const onDrawUpdate = (animationSpeed: number) =>
  {

    if(animationContext.current == null) { return; }

    if(canvasFillFunction.current == null) { return; }

    const result: CanvasGradient|RGBAColor = canvasFillFunction.current(animationSpeed);
    if(result instanceof CanvasGradient)
    {
      animationContext.current.fillStyle = result;
    }
    else
    {
      animationContext.current.fillStyle = result.toHex();
    }
    animationContext.current.clearRect(0, 0, animationContext.current.canvas.width, animationContext.current.canvas.height);
    animationContext.current.fillRect(0, 0, animationContext.current.canvas.width, animationContext.current.canvas.height);
  }
  
  const createGradient_Glorious = (animationSpeed: number) =>
  {    
    const gradient = animationContext.current!.createLinearGradient(animationContext.current!.canvas.width/2, 0, animationContext.current!.canvas.width/2, animationContext.current!.canvas.height);
    for(let i = 0; i < currentGradientStops.current!.length; i++)
    {
      const stop = currentGradientStops.current![i];

      // simple gradient scroll
      let stopValue = (stop.stop + gradientScrollOffset.current);
      if(stopValue > 100) { stopValue = stopValue - 100; }

      // add stop
      gradient.addColorStop(stopValue/100, stop.hex);
    }

    // scroll gradient offset
    gradientScrollOffset.current += 1 * animationSpeed;
    if(gradientScrollOffset.current > 100) { gradientScrollOffset.current = 0; }
    return gradient;
  }
  
  const createGradient_SeamlessBreathing = (animationSpeed: number) =>
  {
    const targetColors = currentAnimationColors.current ?? [RGBAColor.fromRGB(255, 255, 255)];
    const updatedColor = getCurrentSeamlessBreathingColor(animationSpeed, targetColors);
    return updatedColor;
  }
  
  const createGradient_Breathing = (animationSpeed: number) =>
  {
    const targetColors = currentAnimationColors.current ?? [RGBAColor.fromRGB(255, 255, 255)];
    const updatedColor = getCurrentBreathingColor(animationSpeed, targetColors);
    return updatedColor;
  }
  
  const createGradient_SingleColor = (animationSpeed: number) =>
  {
    if(currentAnimationColor.current == null) { return RGBAColor.fromRGB(0, 0, 0); }
    return currentAnimationColor.current;
  }
  
  const createGradient_BreathingSingleColor = (animationSpeed: number) =>
  {
    const targetColor = currentAnimationColor.current ?? RGBAColor.fromRGB(255, 255, 255);
    const updatedColor = getCurrentBreathingSingleColor(animationSpeed, targetColor);
    return updatedColor;
  }
  
  const createGradient_Tail = (animationSpeed: number) =>
  {
    if(currentAnimationColor.current == null || animationContext.current == null) { return RGBAColor.fromRGB(0, 0, 0); }

    const gradient = animationContext.current.createLinearGradient(animationContext.current.canvas.width/2, 0, animationContext.current.canvas.width/2, animationContext.current.canvas.height);
    
    // split the canvas into deviceColors.length
    // show each color at a specific position; rotate the array; 

    const profile = getCurrentProfile();
    const deviceColorsCopy: Array<{R:number,G:number,B:number}> = Array.from(profile.lighting.Color)
    const deviceColors = deviceColorsCopy.slice(tailProperties.current.colorOffsetIndex).concat(deviceColorsCopy.slice(0, tailProperties.current.colorOffsetIndex))
    if(profile != null)
    {
      const sectionHeight = animationContext.current.canvas.height / deviceColors.length;
      let currentColorIndex = tailProperties.current.colorIndex + tailProperties.current.colorOffsetIndex;
      while(currentColorIndex > (deviceColors.length - 1))
      {
        currentColorIndex = currentColorIndex - deviceColors.length;
      }
      const currentDeviceColor = deviceColors[currentColorIndex];
      if(currentDeviceColor == null)
      {
        console.error('unexpected color', currentDeviceColor, currentColorIndex);
        return RGBAColor.fromRGB(0, 0, 0);
      }
      const currentY = tailProperties.current.rotationIndex * sectionHeight;
      const topAsDecimal = (currentY / animationContext.current.canvas.height);
      const bottomAsDecimal = (currentY + sectionHeight) / animationContext.current.canvas.height;
      const colorHex = RGBAColor.fromRGB(currentDeviceColor.R, currentDeviceColor.B, currentDeviceColor.G).toHex();

      if(topAsDecimal > 0)
      {
        gradient.addColorStop(0, '#00000000');
        gradient.addColorStop(Math.max(topAsDecimal - .0001, 0), '#00000000');
      }
      gradient.addColorStop(topAsDecimal, colorHex);
      gradient.addColorStop(bottomAsDecimal, colorHex);
      gradient.addColorStop(Math.min( bottomAsDecimal + .0001, 1), '#00000000');
      gradient.addColorStop(1, '#00000000');


      if(tailProperties.current.elapsedDuration >= tailProperties.current.displayDuration)
      {

        tailProperties.current.rotationIndex++;
        if(tailProperties.current.rotationIndex > (deviceColors.length - 1))
        {
          tailProperties.current.rotationIndex = 0;

          tailProperties.current.colorOffsetIndex++;
          if(tailProperties.current.colorOffsetIndex > (deviceColors.length - 1))
          {
            tailProperties.current.colorOffsetIndex = 0;            
          }
        }

        tailProperties.current.colorIndex++;
        if(tailProperties.current.colorIndex > (deviceColors.length - 1))
        {
          tailProperties.current.colorIndex = 0;          
        }

        tailProperties.current.elapsedDuration = 0;
      }
      tailProperties.current.elapsedDuration++;
    }

    
    // const colorSelectionValue = (uiContext.lightSettingMode == 'per-key') ? uiContext.colorPickerValue_PerKeyLighting : uiContext.colorPickerValue_PresetLighting;
    // const targetColor = (devicesContext.currentProfile.lighting.Color.length > 0) ? RGBAColor.fromRGB(devicesContext.currentProfile.lighting.Color[0].R, devicesContext.currentProfile.lighting.Color[0].G, devicesContext.currentProfile.lighting.Color[0].B)
    // : (colorSelectionValue == null) ? RGBAColor.fromRGB(255, 0, 0) : colorSelectionValue;
    // const updatedColor = getCurrentBreathingSingleColor(animationSpeed, targetColor);
    // const updatedColorHex = updatedColor.toHex();
    // gradient.addColorStop(0, updatedColorHex);
    // gradient.addColorStop(1, updatedColorHex);
    return gradient;
  }
  
  const createGradient_Rave = (animationSpeed: number) =>
  {
    const gradient = animationContext.current!.createLinearGradient(animationContext.current!.canvas.width/2, 0, animationContext.current!.canvas.width/2, animationContext.current!.canvas.height);
    const profile = getCurrentProfile();
    if(profile != null)
    {
      const colorHex = (raveProperties.current.colorIndex == 0)
      ? RGBAColor.fromRGB(profile.lighting.Color[0].R, profile.lighting.Color[0].B, profile.lighting.Color[0].G).toHex() ?? '#FF0000'
      : RGBAColor.fromRGB(profile.lighting.Color[1].R, profile.lighting.Color[1].B, profile.lighting.Color[1].G).toHex() ?? '#B0B000'
      
      if(raveProperties.current.directionIndex == 0)
      {
        gradient.addColorStop(0, colorHex);
        gradient.addColorStop(1, '#000000');
      }
      else
      {
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, colorHex);
      }

      if(raveProperties.current.elapsedDuration >= raveProperties.current.displayDuration)
      {
        if(raveProperties.current.colorIndex == 0)
        {
          if(raveProperties.current.directionIndex == 0)
          {
            raveProperties.current.directionIndex = 1;
          }
          else
          {
            raveProperties.current.directionIndex = 0;
            raveProperties.current.colorIndex = 1;
          }
        }
        else
        {
          if(raveProperties.current.directionIndex == 0)
          {
            raveProperties.current.directionIndex = 1;
          }
          else
          {
            raveProperties.current.directionIndex = 0;
            raveProperties.current.colorIndex = 0;
          }
        }

        raveProperties.current.elapsedDuration = 0;
      }
      raveProperties.current.elapsedDuration++;
    }

    // swap between
    // first color, to bottom
    // first color, to top
    // second color, to bottom
    // second color, to top
    return gradient;
  }
  
  const createGradient_Wave = (animationSpeed: number) =>
  {
    if(currentGradientStops.current.length == 0) { return RGBAColor.fromRGB(0, 0, 0); }

    const gradient = animationContext.current!.createLinearGradient(animationContext.current!.canvas.width/2, 0, animationContext.current!.canvas.width/2, animationContext.current!.canvas.height);

    // reverse scroll with selected colors
    for(let i = 0; i < currentGradientStops.current!.length; i++)
    {
      const stop = currentGradientStops.current![i];

      // simple gradient scroll
      let stopValue = (stop.stop - gradientScrollOffset.current);
      if(stopValue < 0) { stopValue = 100 + stopValue; }

      // add stop
      gradient.addColorStop(stopValue/100, stop.hex);
    }

    // scroll gradient offset
    gradientScrollOffset.current += 1 * animationSpeed;
    if(gradientScrollOffset.current > 100) { gradientScrollOffset.current = 0; }
    return gradient;
  }
  
  const createGradient_LEDOff = (animationSpeed: number) =>
  {
    return RGBAColor.fromRGB(0, 0, 0);
  }
  useEffect(() => {
      // const handler = () => {
      //     updateScale();
      // };
      // window.addEventListener('resize', handler);

      updateScale();

      // return () => window.removeEventListener('resize', handler);
  }, []);

  const updateScale = () => {
      if (devicesContext.previewDevice == null || devicesContext.previewDevice.showLightingCanvas != true) {
          return;
      }
      // let currentScaleIndex = 0;
      // for (let i = 0; i < devicesContext.previewDevice.productScales.length; i++) {
      //     const scale = devicesContext.previewDevice.productScales[i];
      //     if (window.innerWidth > scale.breakpoint.width || window.innerHeight > scale.breakpoint.height) {
      //         currentScaleIndex = i;
      //     }
      // }
      const lastItem = devicesContext.previewDevice.productScales[devicesContext.previewDevice.productScales.length-1];
      const width = lastItem.imageSize.width;
      const height = lastItem.imageSize.height;
      if(lightingCanvas.current == null) { console.warn("No canvas established"); return; }
      (lightingCanvas.current as HTMLCanvasElement).width = width;
      (lightingCanvas.current as HTMLCanvasElement).height = height;
  };
  
  useEffect(() =>
  {
    initAnimationContext();
   
  }, [devicesContext.previewDevice]);

  const initAnimationContext = () =>
  {
    if(devicesContext.previewDevice == null || devicesContext.previewDevice.showLightingCanvas != true) { return; }

    if(lightingCanvas.current == null) { console.warn("No canvas established"); return; }

    updateScale();

    const context = (lightingCanvas.current as unknown as HTMLCanvasElement).getContext('2d')! as CanvasRenderingContext2D;
    animationContext.current = context;
  }

  return (devicesContext.previewDevice != null && devicesContext.previewDevice.showLightingCanvas == true) ? <canvas ref={lightingCanvas}></canvas> : <></>
}

export default MouseLightingPreviewComponent;