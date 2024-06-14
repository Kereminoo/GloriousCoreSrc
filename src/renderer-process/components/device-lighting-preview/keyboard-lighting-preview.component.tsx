import React, {
    ChangeEvent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { DeviceInputLayoutMap } from '../../../common/data/device-input-layout.data';
import DeviceLightingPreviewNodeComponent from './device-lighting-preview-node/device-lighting-preview-node.component';
import './device-lighting-preview.component.css';
import { RGBAColor } from '../../../common/data/structures/rgb-color.struct';
import { DeviceService } from '@renderer/services/device.service';
import { LightingLayoutContent, LightingLayoutData } from 'src/common/data/records/lighting-layout.record';
import { useUIContext } from '@renderer/contexts/ui.context';
import { useDevicesContext, useDevicesManagementContext } from '@renderer/contexts/devices.context';
import { useRecordsContext } from '@renderer/contexts/records.context';
import { DeviceRecordColorData, ProfileData } from '../../../common/data/records/device-data.record';
import { ColorSettingStyle } from '@renderer/data/color-setting-style';

type BreathingOperationKeys = 'Lighten' | 'Darken'; // using this allows us to type-check the strings
const animationSpeed_defaultAdjustment = 0.5;

const mouseEffectSingleColorIndexes = [2, 3, 4, 6]; // well known values that only use a single color; gradient colors should not be evaluated.
const dummyContext = document.createElement('canvas').getContext('2d')!;

const CENTER_BLOCK_INDEX = 37;
const MIN_KEY_WIDTH = 43;
const MIN_KEY_HEIGHT = 41;

class NodePositionData {
    clientHeight: number = 0;
    clientWidth: number = 0;
    offsetLeft: number = 0;
    offsetTop: number = 0;
    scroll: number = 0;
    top_Left: number = 0;
    top_Right: number = 0;
    bottom_Left: number = 0;
    bottom_Right: number = 0;
    center_Point: number = 0;
}

class Point {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class AnimationProperties_GloriousMode {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    setRGB: number[][] = [];
    averagearr: {
        color: number[];
        colorIndex: number;
        recordIndex: number;
    }[] = [];

    effectDelay: number = 600;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Wave {
    layoutColors: RGBAColor[] = [RGBAColor.fromRGB(255, 0, 0, 1)]; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    bandwidth: number = 20;
    baseSpeed: number = 140;
    angle: number = 40;
    theta: number = 0;
    dx: number = 0;
    dy: number = 0;
    position: number = 5;
    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_SpiralingWave {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;
    angle: number = 40;
    direction: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_AcidMode {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    step: number = 0;
    nowStep: number = 0;
    repeatCount: any = 0;
    repeatCountList: any[] = [];
    minKeyWidth: number = 42;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Breathing {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_NormallyOn {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_RippleGraff {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_PassWithoutTrace {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_FastRunWithoutTrace {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Matrix2 {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    intervalCount: number = 0;
    repeatCountList: any[] = [];
    RanRange: number[] = [];
    totalStep: number = 0;
    repeatCount: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Matrix3 {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    intervalCount: number = 0;
    repeatCountList: any[] = [];
    RanRange: number[] = [];
    totalStep: number = 0;
    repeatCount: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Rainbow {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    angle: number = 40;
    theta: number = 0;
    dx: number = 0;
    dy: number = 0;
    position: number = 5;
    bandwidth: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_HeartbeatSensor {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    minKeyWidth: number = 42;
    horizontalList: any[] = [];
    share_RepeatCount: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_DigitalTimes {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Kamehameha {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    Step2_Range: number[] = [22, 23, 38, 52, 51, 36];
    Step1_Range: number[] = [0, 15, 30, 58, 71, 82];
    centerBlockIndex: number = 38;
    repeatCount: number = 0;
    setRGB: number[][] = [];
    setArray: number[] = [];

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_PingPong {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    intervalCount: number = 0;
    repeatCount: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}
class AnimationProperties_Surmount {
    layoutColors: RGBAColor[] = []; // colors currently represented in the layout
    startPoint: Point = new Point();
    modeStep: number = 0;
    centerNode: ReactElement | null = null;
    operationKey: 'lighten' | 'darken' = 'lighten';
    lightnessPercent: number = 100;
    targetIndex: number = 0;
    minIndex: number = 1;
    minPercent: number = 0;

    mode_step: number = 0;
    nowStep: number = 0;
    step: number = 0;
    minKeyWidth: number = 50;
    repeatCount: number = 0;

    effectDelay: number = 150;
    elapsedTimeSinceUpdate: number = 0;
}

function distanceCalculation(x1: any, y1: any, x2: any, y2: any) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); //å…©é»žè·�é›¢
}

function KeyboardLightingPreviewComponent(this: typeof KeyboardLightingPreviewComponent, props: any) {
    const devicesContext = useDevicesContext();
    const { getCurrentProfile } = useDevicesManagementContext();
    const uiContext = useUIContext();

    // const nodePositionMap = useRef<NodePositionData[]>([]);

    const animationFrameHandleReference = useRef<number | null>(null);
    const animationContext = useRef<CanvasRenderingContext2D | null>(null);
    const animationFunction = useRef<((deltaTime: number, animationSpeed: number) => ReactElement[]) | null>(null);
    const currentAnimationColor = useRef<RGBAColor | null>(null);
    const currentAnimationColors = useRef<RGBAColor[]>([]);
    // const currentNodes = useRef<ReactElement[]>(new Array());

    const interval = (1.0 / 30.0) * 1000; // locked framerate prevents over-rendering; 30fps
    const previousTime = useRef(interval);

    const lightingNodes = useRef(null);
    const [lightingNodeItems, setLightingNodeItems] = useState(new Array());
    const lightingNodeItemsRef = useRef(new Array<ReactElement>());

    const presetColor = useRef(uiContext.colorPickerValue_PresetLighting);
    const perKeyColor = useRef(uiContext.colorPickerValue_PerKeyLighting);
    const modalColor = useRef(uiContext.colorPickerValue_ColorPickerModal);

    useEffect(() => {
        // animationInterval.current = setInterval(animationLoop, 15);
        // return () => removeAnimationListeners();
        animationFrameHandleReference.current = requestAnimationFrame(animationLoop);
        return () => removeAnimationListeners();
    }, []);
    const animationLoop = (time: number) => {
        let timeSinceLastFrame = time - previousTime.current;
        const animationSpeed = animationSpeed_defaultAdjustment;

        if (timeSinceLastFrame >= interval) {
            previousTime.current = time;
            // calculate new lighting
            // console.log(lightPreset);
            onDrawUpdate(timeSinceLastFrame, animationSpeed);

            // console.log('update');

            // setLightingNodeItems(currentGradientEffectNodes.current);
        }

        animationFrameHandleReference.current = requestAnimationFrame(animationLoop);
    };
    const removeAnimationListeners = () => {
        if (animationFrameHandleReference.current != null) {
            cancelAnimationFrame(animationFrameHandleReference.current);
        }
    };

    useEffect(() => {
        if (devicesContext.previewDevice == null) {
            return;
        }

        // gradientEffectNodeGenerators.current = new Map([
        //     [0, getGradientNodes_GloriousMode]
        //   ]);

        const deviceInputLayout = DeviceInputLayoutMap.get(devicesContext.previewDevice.SN);
        if (deviceInputLayout == null) {
            return;
        }
        // const deviceInputLayout: any = DeviceInputLayoutData[devicesContext.previewDevice.SN];
        const colorNodes: any[] = [];
        for (let i = 0; i < deviceInputLayout.layoutNodes.length; i++) {
            const node = deviceInputLayout.layoutNodes[i];
            if (!node.hasLight) {
                continue;
            }
            colorNodes.push(node);
        }

        // nodePositionMap.current = [];

        const nodeItems: ReactElement[] = [];
        // console.log(deviceInputLayout);

        // if(recordsContext?.lightingLayouts != null)
        // {
        //   const deviceLightingLayout = recordsContext.lightingLayouts.find(layout => layout.SN == devicesContext.previewDevice?.SN && layout.value == currentProfile.light_PERKEY_Data.value);
        //   // setDeviceLightingLayout(deviceLightingLayout);
        //   if(deviceLightingLayout != null)
        //   {
        //     const activeIndexes: number[] = [];
        //     for(let i = 0; i < deviceLightingLayout.content.AllBlockColor.length; i++)
        //     {
        //       if(deviceLightingLayout.content.AllBlockColor[i].color[3] == 1)
        //       {
        //         activeIndexes.push(i);
        //       }
        //     }
        //     setLightingLayoutActiveIndexes(activeIndexes);
        //   }
        // }

        for (let i = 0; i < colorNodes.length; i++) {
            const nodeDefinition = colorNodes[i];
            // const color = [255, 120, 16, 1]; //todo: source from device
            const colorSelectionValue =
                uiContext.lightSettingMode == 'per-key'
                    ? uiContext.colorPickerValue_PerKeyLighting
                    : uiContext.colorPickerValue_PresetLighting;
            const color = colorSelectionValue == null ? [255, 120, 16, 1] : colorSelectionValue.toArray_rgba();
            const rgbaColor = RGBAColor.fromRGB(color[0], color[1], color[2]);

            const position = {
                x:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.x + nodeDefinition.position.x
                        : nodeDefinition.position.x,
                y:
                    deviceInputLayout.nodeBaseOffset != null
                        ? deviceInputLayout.nodeBaseOffset.y + nodeDefinition.position.y
                        : nodeDefinition.position.y,
            };

            const size = {
                width:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.width ?? 65
                        : nodeDefinition.size.width,
                height:
                    nodeDefinition.size == null
                        ? deviceInputLayout.nodeBaseSize?.height ?? 65
                        : nodeDefinition.size.height,
            };

            // console.log(nodeDefinition);
            // const name = (nodeDefinition.name.indexOf('Numpad') > -1) ? nodeDefinition.name.substring(nodeDefinition.name.indexOf('Numpad') + 6) : nodeDefinition.name;
            const nodeElement = (
                <DeviceLightingPreviewNodeComponent
                    title={nodeDefinition.name}
                    key={i}
                    targetColor={rgbaColor}
                    currentColor={rgbaColor}
                    x={position.x}
                    y={position.y}
                    width={size.width}
                    height={size.height}
                    centerPoint={new Point(position.x + size.width / 2, position.y + size.height / 2)}
                    bottomLeftPoint={new Point(position.x, position.y + size.height)}
                    topRightPoint={new Point(position.x + size.width, position.y)}
                    quickKeyIds={nodeDefinition.quickKeyIds}
                />
            );
            nodeItems.push(nodeElement);

            if (i == CENTER_BLOCK_INDEX) {
                gloriousMode.current.centerNode = nodeElement;
            }

            // const positionData = new NodePositionData();
            // positionData.clientHeight = element.clientHeight;
            // positionData.clientWidth = element.clientWidth;
            // positionData.offsetLeft = element.offsetLeft;
            // positionData.offsetTop = element.offsetTop;
            // positionData.scroll = element.scroll;
            // positionData.top_Left = [element.offsetLeft, element.offsetTop];
            // positionData.top_Right = [element.offsetLeft + element.clientWidth, element.offsetTop];
            // positionData.bottom_Left = [element.offsetLeft, element.offsetTop + element.clientHeight];
            // positionData.bottom_Right = [element.offsetLeft + element.clientWidth, element.offsetTop + element.clientHeight];
            // positionData.center_Point = [element.offsetLeft + (element.clientWidth/2), element.offsetTop + (element.clientHeight/2)];

            // nodePositionMap.current[i] = positionData;
        }

        lightingNodeItemsRef.current = nodeItems;
        setLightingNodeItems(lightingNodeItemsRef.current);

        // console.log(devicesContext.previewDevice);
    }, [devicesContext.previewDevice]);

    useEffect(() => {
        // if(devicesContext.currentProfile?.lighting?.Effect == null) { return; }
        // if(devicesContext.previewDevice == null) { return; }

        // const effect = devicesContext.currentProfile.lighting.Effect;
        // const displayOption = devicesContext.previewDevice.lightingEffects[effect];

        // if(uiContext.lightingSelectedPreset == null)
        // {
        //   return;
        // }

        const effect = getCurrentProfile()?.light_PRESETS_Data?.value ?? 0;
        console.log('effect', effect);
        // removeAnimationListeners();

        if (effect == 0) {
            initGloriousMode();
            animationFunction.current = getNodeColors_GloriousMode;
        } else if (effect == 1) {
            initWave(wave1Mode.current);
            animationFunction.current = getNodeColors_Wave.bind(this, wave1Mode.current);
        } else if (effect == 3) {
            initWave(wave2Mode.current);
            animationFunction.current = getNodeColors_Wave.bind(this, wave2Mode.current);
        } else if (effect == 4) {
            initSpiralingWave();
            animationFunction.current = getNodeColors_SpiralingWave;
        } else if (effect == 5) {
            initAcidMode();
            animationFunction.current = getNodeColors_AcidMode;
        } else if (effect == 2) {
            initBreathing();
            animationFunction.current = getNodeColors_Breathing;
        } else if (effect == 6) {
            animationFunction.current = getNodeColors_NormallyOn;
        } else if (effect == 7) {
            initRippleGraff();
            animationFunction.current = getNodeColors_RippleGraff;
        } else if (effect == 9) {
            initPassWithoutTrace();
            animationFunction.current = getNodeColors_PassWithoutTrace;
        } else if (effect == 10) {
            initFastRunWithoutTrace();
            animationFunction.current = getNodeColors_FastRunWithoutTrace;
        } else if (effect == 11) {
            initMatrix2();
            animationFunction.current = getNodeColors_Matrix2;
        } else if (effect == 12) {
            initMatrix3();
            animationFunction.current = getNodeColors_Matrix3;
        } else if (effect == 13) {
            initRainbow();
            animationFunction.current = getNodeColors_Rainbow;
        } else if (effect == 14) {
            initHeartbeatSensor();
            animationFunction.current = getNodeColors_HeartbeatSensor;
        } else if (effect == 15) {
            initDigitalTimes();
            animationFunction.current = getNodeColors_DigitalTimes;
        } else if (effect == 16) {
            initKamehameha();
            animationFunction.current = getNodeColors_Kamehameha;
        } else if (effect == 17) {
            initPingPong();
            animationFunction.current = getNodeColors_PingPong;
        } else if (effect == 18) {
            initSurmount();
            animationFunction.current = getNodeColors_Surmount;
        } else if (effect == 8) {
            animationFunction.current = getNodeColors_LEDOff;
        }
        // updateGradientStops();

        // console.log(canvasFillFunction.current);

        // animationFrameHandleReference.current = requestAnimationFrame(animationLoop);
        // return () => removeAnimationListeners();
    }, [
        uiContext.lightingSelectedPreset,
        getCurrentProfile()?.light_PRESETS_Data?.colors,
        uiContext.lightingSelectedColorStyle,
    ]);

    useEffect(() => {
        presetColor.current = uiContext.colorPickerValue_PresetLighting;
        perKeyColor.current = uiContext.colorPickerValue_PerKeyLighting;
        modalColor.current = uiContext.colorPickerValue_ColorPickerModal;
    }, [
        uiContext.colorPickerValue_PresetLighting,
        uiContext.colorPickerValue_PerKeyLighting,
        uiContext.colorPickerValue_ColorPickerModal,
    ]);

    const onDrawUpdate = (deltaTime: number, animationSpeed: number) => {
        if (animationFunction.current == null) {
            return;
        }

        const nodes = animationFunction.current(deltaTime, animationSpeed);

        const profile = getCurrentProfile() as ProfileData;
        if (profile != null && profile.light_PERKEY_KeyAssignments != null) {
            // force per-key lighting effects
            const assignments = profile.light_PERKEY_KeyAssignments[0];
            // console.log(assignments.filter(item => item.colorEnabled));
            for (let i = 0; i < assignments.length; i++) {
                const lightingKeyData = assignments[i];
                if (lightingKeyData.colorEnabled == true) {
                    const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                        currentColor: RGBAColor.fromRGB(...lightingKeyData.color),
                    });
                    nodes.splice(i, 1, updatedNode);
                }
            }
        }

        lightingNodeItemsRef.current = nodes;
        setLightingNodeItems([...lightingNodeItemsRef.current]);
    };

    const gloriousMode = useRef(new AnimationProperties_GloriousMode());
    const initGloriousMode = () => {
        if (gloriousMode.current.centerNode != null) {
            gloriousMode.current.startPoint = gloriousMode.current.centerNode.props.centerPoint ?? new Point();
        }

        console.log('Start Point', gloriousMode.current.startPoint);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));

        const profile = getCurrentProfile() as ProfileData;

        // let setRGB: any;
        let gradientRGB: number[][] = [];

        // let T_RGB = (Array.isArray(profile.light_PRESETS_Data?.colors)) ?
        // profile.light_PRESETS_Data!.colors.map(color => { return RGBAColor.fromHex(color).toArray_rgba(); })
        // : [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
        let T_RGB = profile.light_PRESETS_Data!.colors.map((color) => {
            return RGBAColor.fromHex(color).toArray_rgba();
        });
        let g_totalStep = 3;
        let g_nowStep = 0;
        // let T_nowColorIndex = 0;

        for (let i = 0; i < T_RGB.length - 1; i++) {
            let T1Color = T_RGB[i];
            let T2Color = T_RGB[i + 1];
            let gradient_COLOR = [0, 0, 0, 1];
            for (let i_2 = 0; i_2 < 3; i_2++) {
                //console.log('%c mode_ConicRippleRGB_gradientRGB','color:rgb(255,75,255,1)', T1Color[i_2],T2Color[i_2],gradient_COLOR,T1Color,T2Color);
                gradient_COLOR[i_2] =
                    (T1Color[i_2] * (g_totalStep - g_nowStep) + T2Color[i_2] * g_nowStep) / g_totalStep;
            }
            gradientRGB.push(gradient_COLOR);
            if (g_nowStep < g_totalStep) {
                g_nowStep += 1;
            } else {
                g_nowStep = 0;
                // T_nowColorIndex+=1;
            }
        }

        gloriousMode.current.setRGB = gradientRGB;

        console.log(gloriousMode.current.setRGB);

        // let T_center_Point=StartPoint.center_Point;
        // let diameter= this.imageMaxWidth-gloriousMode.current.startPoint.x+this.minKeyWidth;
        let diameter = MIN_KEY_WIDTH * lightingNodeItemsRef.current.length * 2;
        console.log(diameter);
        // diameter = 1000;
        // let target = this.AllBlockColor;

        // let averagearr:
        // {
        //     color: number[][],
        //     colorIndex: number,
        //     recordIndex: number,
        // }[] = [];

        for (let d_index = 0; d_index < gloriousMode.current.setRGB.length; d_index++) {
            var averagePrevious = (diameter / gloriousMode.current.setRGB.length) * d_index;
            var averageNext = averagePrevious + diameter / gloriousMode.current.setRGB.length;
            for (let index = 0; index < lightingNodeItemsRef.current.length; index++) {
                let element = lightingNodeItemsRef.current[index];
                let distance = distanceCalculation(
                    gloriousMode.current.startPoint.x,
                    gloriousMode.current.startPoint.y,
                    element.props.centerPoint.x,
                    element.props.centerPoint.y,
                );

                if (distance >= averagePrevious && distance <= averageNext) {
                    if (gloriousMode.current.averagearr.some((x: any) => x.recordIndex == index) == false) {
                        console.log(d_index);
                        gloriousMode.current.averagearr.push({
                            color: gloriousMode.current.setRGB[d_index],
                            colorIndex: d_index,
                            recordIndex: index,
                        });
                    }
                }
            }
        }
        console.log('%c mode_ConccRipple_averagearr', 'color:rgb(255,75,255,1)', gloriousMode.current.averagearr);
    };
    const getNodeColors_GloriousMode = (deltaTime: number, animationSpeed: number) => {
        gloriousMode.current.elapsedTimeSinceUpdate += deltaTime;
        if (gloriousMode.current.elapsedTimeSinceUpdate < gloriousMode.current.effectDelay) {
            return lightingNodeItemsRef.current;
        }

        const nodes: ReactElement[] = [];

        // let direction=0;
        for (let index = 0; index < gloriousMode.current.averagearr.length; index++) {
            const element = gloriousMode.current.averagearr[index];
            // if (direction == 1)
            // {
            //     if (element.colorIndex < gloriousMode.current.setRGB.length - 1)
            //     {
            //         element.colorIndex += 1;
            //     }
            //     else
            //     {
            //         element.colorIndex = 0;
            //     }
            // }
            // else
            // {
            if (element.colorIndex > 0) {
                element.colorIndex -= 1;
            } else {
                element.colorIndex = gloriousMode.current.setRGB.length - 1;
            }
            // }
            // let temp_colorData = JSON.parse(JSON.stringify(gloriousMode.current.setRGB[element.colorIndex]));
            // console.log(temp_colorData);
            // for (let index = 0; index < 3; index++)
            // {
            //     temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            // }
            // lightingNodeItemsRef.current[element.recordIndex].props.color = temp_colorData;
            if (lightingNodeItemsRef.current[element.recordIndex] != null) {
                const updatedNode =
                    gloriousMode.current.setRGB[element.colorIndex] != null
                        ? React.cloneElement(lightingNodeItemsRef.current[element.recordIndex], {
                              currentColor: RGBAColor.fromRGB(
                                  gloriousMode.current.setRGB[element.colorIndex][0],
                                  gloriousMode.current.setRGB[element.colorIndex][1],
                                  gloriousMode.current.setRGB[element.colorIndex][2],
                                  gloriousMode.current.setRGB[element.colorIndex][3],
                              ),
                          })
                        : React.cloneElement(lightingNodeItemsRef.current[element.recordIndex]);
                nodes[element.recordIndex] = updatedNode;
            }
        }

        // for(let i = 0; i < lightingNodeItemsRef.current.length; i++)
        // {
        //   // const layoutColor = uiContext.colorPickerValue_PresetLighting;
        //   // console.log('layoutColor', layoutColor);
        //   const targetColor = lightingNodeItemsRef.current[i].props.targetColor;
        //   // const updatedColor = (layoutColor == null) ? getCurrentBreathingColor(animationSpeed, [targetColor]) : RGBAColor.fromRGB(layoutColor[0], layoutColor[1], layoutColor[2], layoutColor[3]);

        //   const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i],
        //   {
        //     currentColor: presetColor.current
        //   });
        //   nodes.push(updatedNode);
        // }

        // console.log(nodes);

        gloriousMode.current.elapsedTimeSinceUpdate = 0;

        return nodes;
    };

    const wave1Mode = useRef(new AnimationProperties_Wave());
    const wave2Mode = useRef(new AnimationProperties_Wave());
    const initWave = (modeOptions: AnimationProperties_Wave) => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%c mode_WaveSync_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        // clearInterval(this.repeater);
        // this.currentBlockIndex=0;
        // var intervalCount=0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        if (modeOptions.centerNode != null) {
            modeOptions.startPoint = modeOptions.centerNode.props.centerPoint ?? new Point();
        }

        const rgbGradientsValue = ColorSettingStyle[1].value;
        if (uiContext.lightingSelectedColorStyle?.value == rgbGradientsValue) {
            //colors =this.rainbow7Color();
            // modeOptions.layoutColors = [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
            modeOptions.layoutColors = profile.light_PRESETS_Data!.colors.map((color) => RGBAColor.fromHex(color));
            //colors= colors.concat(colors);
        } else {
            var maxPercent = 55;
            var currentPercent = 55;
            var tempColorArray: number[][] = [];
            var inputColor_T = modeOptions.layoutColors[0].toArray_rgba();
            //console.log('%c inputColor_T','color:rgb(255,75,255,1)',inputColor_T);
            while (currentPercent > 25) {
                currentPercent -= 5;
                var tempColor = [0, 0, 0, 1];
                tempColor[0] = (inputColor_T[0] * currentPercent) / maxPercent;
                tempColor[1] = (inputColor_T[1] * currentPercent) / maxPercent;
                tempColor[2] = (inputColor_T[2] * currentPercent) / maxPercent;
                //console.log('%c currentPercent>0','color:rgb(255,75,255,1)',tempColor);
                tempColorArray.push(tempColor);
            }
            modeOptions.layoutColors = tempColorArray.map((color) => RGBAColor.fromRGB(color[0], color[1], color[2]));
            //console.log('%c tempColorArray','color:rgb(255,75,255,1)',tempColorArray);
        }

        //console.log('%c colors','color:rgb(255,75,255,1)',colors);
        // var setRGB=colors[this.getRandom(0, colors.length - 1)];
        // var spacing=-5;
        // var nowColor=0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        // modeOptions.angle=40;
        modeOptions.theta = (Math.PI * modeOptions.angle) / 180; //弧度
        modeOptions.dx = Math.cos(modeOptions.theta);
        modeOptions.dy = -Math.sin(modeOptions.theta);
        if (Math.abs(modeOptions.dx) < 1e-5) {
            modeOptions.dx = 0;
        }
        if (Math.abs(modeOptions.dy) < 1e-5) {
            modeOptions.dy = 0;
        }

        // var position=0;
        // var color_number=colors.length;
        // var target = this.AllBlockColor;
        // var handleAllList=[];
        // position+=5;

        modeOptions.position = 5;
    };
    const getNodeColors_Wave = (modeOptions: AnimationProperties_Wave, animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        //position+=5;
        modeOptions.position += 50;
        modeOptions.position %= modeOptions.bandwidth * modeOptions.layoutColors.length;

        for (let index = 0; index < lightingNodeItems.length; index++) {
            var element = lightingNodeItems[index];
            if (element == null) {
                continue;
            }
            //var y=sinx + cosx;
            //var y=sinx + cosx;
            var OffsetValue =
                element.props.centerPoint.x * modeOptions.dx + element.props.centerPoint.y * modeOptions.dy; //x*cos+y*sin=P(x,y)theta
            var scale = (OffsetValue - modeOptions.position) / modeOptions.bandwidth / modeOptions.layoutColors.length;
            var defaultscales = [0, 0.2, 0.4, 0.6, 0.8];
            //console.log('%c dy','color:rgb(255,75,255,1)',dx,dy);
            // console.log('%c OffsetValue','color:rgb(255,75,255,1)',OffsetValue);
            // console.log('%c scale','color:rgb(255,75,255,1)',String(scale));
            // console.log('%c position','color:rgb(255,75,255,1)',position);
            // console.log('%c bandwidth','color:rgb(255,75,255,1)',bandwidth);
            var scales = defaultscales.slice(0);
            scale -= Math.floor(scale); // [0, 1)
            var lower_index = -1;
            var lower_scale = 0;
            var upper_index = modeOptions.layoutColors.length;
            var upper_scale = 1;
            for (let i = 0; i < modeOptions.layoutColors.length; ++i) {
                if (scales[i] <= scale) {
                    if (scales[i] >= lower_scale)
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                        lower_scale = scales[(lower_index = i)];
                    //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                } else {
                    if (scales[i] < upper_scale) upper_scale = scales[(upper_index = i)];
                }
            }
            //console.log('%c lower_scale','color:rgb(255,75,255,1)',upper_scale);

            //console.log('%c upper_scale','color:rgb(255,75,255,1)',upper_scale);
            // colors[lower_index];
            //element.color = JSON.parse(JSON.stringify(colors[nowColor]));
            // var temp_colorData =JSON.parse(JSON.stringify(modeOptions.layoutColors[lower_index]));
            // for (let index = 0; index < 3; index++) {
            //     temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            // }
            // element.color = temp_colorData;

            if (lightingNodeItemsRef.current[index] != null) {
                const updatedNode = React.cloneElement(lightingNodeItemsRef.current[index], {
                    currentColor: modeOptions.layoutColors[lower_index],
                });
                nodes[index] = updatedNode;
            }
        }

        return nodes;
    };

    const spiralingWaveMode = useRef(new AnimationProperties_SpiralingWave());
    const initSpiralingWave = () => {
        const profile = getCurrentProfile() as ProfileData;

        spiralingWaveMode.current.layoutColors = profile.light_PRESETS_Data!.colors.map((color) =>
            RGBAColor.fromHex(color),
        );

        // console.log('%c mode_Spiral','color:rgb(255,75,255,1)',colors,this.repeater);
        console.log('%c mode_Spiral', 'color:rgb(255,75,255,1)');
        // clearInterval(this.repeater);
        // this.currentBlockIndex=0;
        // var intervalCount=0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        // if (isRainbow) {
        //     //colors =this.rainbow7Color();
        //     colors= [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
        //     //colors= colors.concat(colors);
        // }
        // else{
        var maxPercent = 55;
        var currentPercent = 55;
        var tempColorArray: number[][] = [];
        var inputColor_T = spiralingWaveMode.current.layoutColors[0];
        console.log('%c inputColor_T', 'color:rgb(255,75,255,1)', inputColor_T);
        while (currentPercent > 25) {
            currentPercent -= 5;
            var tempColor = [0, 0, 0, 1];
            tempColor[0] = (inputColor_T.r * currentPercent) / maxPercent;
            tempColor[1] = (inputColor_T.g * currentPercent) / maxPercent;
            tempColor[2] = (inputColor_T.b * currentPercent) / maxPercent;
            console.log('%c currentPercent>0', 'color:rgb(255,75,255,1)', tempColor);
            tempColorArray.push(tempColor);
        }
        // spiralingWaveMode.current.layoutColors = tempColorArray;
        spiralingWaveMode.current.layoutColors = tempColorArray.map((item) =>
            RGBAColor.fromRGB(item[0], item[1], item[2], item[3]),
        );
        console.log('%c tempColorArray', 'color:rgb(255,75,255,1)', tempColorArray);
        // }
        //console.log('%c colors','color:rgb(255,75,255,1)',colors);

        // var setRGB=spiralingWaveMode.current.layoutColors[this.getRandom(0, spiralingWaveMode.current.layoutColors.length - 1)];
        var spacing = -5;
        var nowColor = 0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        spiralingWaveMode.current.angle = 0;
        // spiralingWaveMode.current.theta = Math.PI * 30 / 180;//弧度
        // spiralingWaveMode.current.dx =  Math.cos(theta);
        // spiralingWaveMode.current.dy = -Math.sin(theta);
        // if (Math.abs(dx) < 1e-5) spiralingWaveMode.current.dx = 0;
        // if (Math.abs(dy) < 1e-5) spiralingWaveMode.current.dy = 0;
        // spiralingWaveMode.current.position=0;
        // var color_number=spiralingWaveMode.current.layoutColors.length;
        var bandwidth = 20;
        // var target = this.AllBlockColor;
        // position+=5;
    };
    const getNodeColors_SpiralingWave = (animationSpeed: number) => {
        if (devicesContext.previewDevice == null) {
            return lightingNodeItems;
        }
        const nodes: ReactElement[] = [];

        if (spiralingWaveMode.current.direction == 1) {
            spiralingWaveMode.current.angle += 10 * 1; //-1 反向
        } else {
            spiralingWaveMode.current.angle += 10 * -1; //-1 反向
        }
        var bandangle = 360 / spiralingWaveMode.current.layoutColors.length;
        var dis_angle = spiralingWaveMode.current.angle % 360;
        for (let index = 0; index < lightingNodeItems.length; index++) {
            // var element = target[index];
            var element = lightingNodeItems[index];
            //var y=sinx + cosx;
            //var OffsetValue = element.coordinateData.center_Point[0] * dx + element.coordinateData.center_Point[1] * dy;  //x*cos+y*sin=P(x,y)theta

            var center_Point = [
                devicesContext.previewDevice.deviceRenderAttributes.large.width / 2,
                devicesContext.previewDevice.deviceRenderAttributes.large.height / 2,
            ];
            center_Point[0] -= 40;
            //center_Point[1]-=30;
            var PointRotation = rotatePoint(center_Point, element.props.centerPoint);
            if (PointRotation < 0) {
                PointRotation += 360;
            }
            var remainder: any;
            var scale =
                (PointRotation - spiralingWaveMode.current.angle) /
                bandangle /
                spiralingWaveMode.current.layoutColors.length; // / colors.length
            var defaultscales = [0, 0.5, 0.1, 0.3, 0.5, 0.7, 0.9];
            // var defaultscales = [
            // ];
            // var addvalue=0;
            // for (let index = 0; index < colors.length; index++) {
            //     addvalue+=1/colors.length;
            //     defaultscales.push(addvalue);
            // }
            ///(360/colors.length);
            remainder = Math.floor(remainder);
            scale -= Math.floor(scale); // [0, 1)
            var data = {
                PointRotation: PointRotation,
                remainder: scale,
                dis_angle: dis_angle,
                part: bandangle,
            };
            //console.log('%c mode_Spiral','color:rgb(255,75,255,1)',data);

            var scales = defaultscales.slice(0);

            var lower_index = 0;
            var lower_scale = 0;
            var upper_index = spiralingWaveMode.current.layoutColors.length;
            var upper_scale = 1;
            for (let i = 0; i < spiralingWaveMode.current.layoutColors.length; ++i) {
                if (scales[i] <= scale) {
                    if (scales[i] >= lower_scale)
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                        lower_scale = scales[(lower_index = i)];
                    //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                } else {
                    if (scales[i] < upper_scale) upper_scale = scales[(upper_index = i)];
                }
            }
            // var temp_colorData = JSON.parse(JSON.stringify(spiralingWaveMode.current.layoutColors[lower_index]));
            // for (let index = 0; index < 3; index++) {
            //     // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            // }
            // element.color = temp_colorData;

            console.log('lower_index', lower_index);

            if (lightingNodeItemsRef.current[index] != null) {
                const updatedNode = React.cloneElement(lightingNodeItemsRef.current[index], {
                    currentColor: spiralingWaveMode.current.layoutColors[lower_index],
                });
                nodes[index] = updatedNode;
            }
        }

        // await new Promise(resolve => setTimeout(resolve, 600));

        return nodes;
    };

    const acidModeMode = useRef(new AnimationProperties_AcidMode());
    const initAcidMode = () => {
        const profile = getCurrentProfile() as ProfileData;

        // clearInterval(this.repeater);
        acidModeMode.current.layoutColors = [
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
        ].map((item) => RGBAColor.fromRGB(item[0], item[1], item[2], item[3]));
        acidModeMode.current.repeatCount = 0;
        // var StartPoint = this.getNowBlock(50).coordinateData;
        acidModeMode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[lightingNodeItems.length - 1].props?.centerPoint || new Point()
            : new Point();
        var mode_step = 0;
        acidModeMode.current.step = 60;
        acidModeMode.current.nowStep = 0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        acidModeMode.current.repeatCountList = [];
        // var target = this.AllBlockColor;
        for (
            let i_compare = 0;
            i_compare < devicesContext.previewDevice!.deviceRenderAttributes.large.width;
            i_compare += acidModeMode.current.minKeyWidth
        ) {
            for (let index = 0; index < lightingNodeItems.length; index++) {
                var element = lightingNodeItems[index];

                var dis = distanceCalculation(
                    acidModeMode.current.startPoint.x,
                    acidModeMode.current.startPoint.y,
                    element.props.centerPoint.x,
                    element.props.centerPoint.y,
                );
                if (dis <= i_compare && dis >= i_compare - acidModeMode.current.minKeyWidth) {
                    acidModeMode.current.repeatCountList.push({
                        color: acidModeMode.current.layoutColors[0],
                        recordIndex: index,
                        repeatTime: getRandom(5, 25),
                    });
                }
            }
        }
    };
    const getNodeColors_AcidMode = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        // console.log('repeatCountList', repeatCountList)
        // this.repeater = setInterval(() => {
        var t_Count = acidModeMode.current.repeatCount % 3;
        var t_Count2;
        if (t_Count + 1 < acidModeMode.current.layoutColors.length) {
            t_Count2 = t_Count + 1;
        } else {
            t_Count2 = 0;
        }

        const indexesToUpdate: Map<number, number[]> = new Map();

        for (let index = 0; index < acidModeMode.current.repeatCountList.length; index++) {
            var nowColor = JSON.parse(
                JSON.stringify(acidModeMode.current.layoutColors.map((item) => item.toArray_rgba())),
            );
            var temp_colorData = [0, 0, 0, 1];
            for (let index = 0; index < 3; index++) {
                temp_colorData[index] =
                    (nowColor[t_Count][index] * (acidModeMode.current.step - acidModeMode.current.nowStep) +
                        nowColor[t_Count2][index] * acidModeMode.current.nowStep) /
                    acidModeMode.current.step;
                // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }
            // var target = this.AllBlockColor;
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;

            // console.log('acid index', acidModeMode.current.repeatCountList[index].recordIndex);
            // console.log('length', lightingNodeItemsRef.current.length);

            const toUpdate = lightingNodeItemsRef.current[acidModeMode.current.repeatCountList[index].recordIndex];
            if (toUpdate != null) {
                indexesToUpdate.set(acidModeMode.current.repeatCountList[index].recordIndex, temp_colorData);
            }

            // target[repeatCountList[index].recordIndex].color=JSON.parse(JSON.stringify(temp_colorData));
        }
        if (acidModeMode.current.nowStep < acidModeMode.current.step - 1) {
            acidModeMode.current.nowStep += 1;
        } else {
            acidModeMode.current.nowStep = 0;
            acidModeMode.current.repeatCount += 1;
        }
        // }, 50*this.animationSpeed)

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = indexesToUpdate.get(i) ?? RGBAColor.fromRGB(0, 0, 0, 1);
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: RGBAColor.fromRGB(updatedColor[0], updatedColor[1], updatedColor[2], updatedColor[3]),
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const breathingMode = useRef(new AnimationProperties_Breathing());
    const initBreathing = () => {
        const profile = getCurrentProfile() as ProfileData;

        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        breathingMode.current.layoutColors = new Array<RGBAColor>().fill(
            presetColor.current,
            0,
            lightingNodeItems.length,
        );

        if (uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient') {
            if (profile.light_PRESETS_Data == null) {
                return;
            }

            const rowLength = devicesContext.previewDevice?.SN == '0x320F0x5044' ? 15 : 15;

            // gmmk pro rowLength 15
            // gmmk2 96 18
            // gmmk 65 15
            // valueB 100 21

            const splitLength = Math.ceil(rowLength / profile.light_PRESETS_Data.colors.length);

            // profile.light_PRESETS_Data!.colors.map(item => RGBAColor.fromHex(item))
            let deviceColorsIndex = -1;
            for (let i = 0; i < lightingNodeItems.length; i++) {
                if (i % splitLength == 0) {
                    deviceColorsIndex++;
                    if (deviceColorsIndex > profile.light_PRESETS_Data.colors.length - 1) {
                        deviceColorsIndex = 0;
                    }
                }
                // console.log(deviceColorsIndex);
                breathingMode.current.layoutColors[i] = RGBAColor.fromHex(
                    profile.light_PRESETS_Data.colors[deviceColorsIndex],
                );
            }
        }

        // /// if multicolor...
        // clearInterval(this.repeater);
        // var repeatCount = 0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        // var totalstep = 60;
        // var nowStep = 0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList:any=[];
        // var target = this.AllBlockColor;
        // var setRGB;
        // var repeatCircleCount=0;
        // //var RGBObj=this.rainbow7Color()
        // var RGBObj =[[255,0,0,1],[255,0,0,1],[0, 255, 0,1],[0,0,255,1],[0, 0, 255,1]];

        // //[this.getRandom(0, this.rainbow7Color().length - 1)];
        // var Rainbow_totalstep=60;
        // var Rainbow_step=0;
        // var Rainbow_i=0;
        // console.log('%c mode_BreathingMulticolor','color:rgb(255,75,255,1)',this.imageMaxWidth);

        // for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.imageMaxWidth/60/5) {

        //     //const element = array[index];
        //     if(Rainbow_step<Rainbow_totalstep){
        //         Rainbow_step+=1;
        //     }
        //     else{
        //         Rainbow_step=0;
        //         if(Rainbow_i<RGBObj.length-2){
        //             Rainbow_i+=1;
        //         }
        //         else{
        //             Rainbow_i=0;
        //         }
        //     }

        //     if (isRainbow) {
        //         var t_data = [0,0,0,1];
        //         if(RGBObj[Rainbow_i]==undefined){
        //             console.log('%c RGBObjError','color:rgb(255,75,255,1)',RGBObj,Rainbow_i);
        //             return;
        //         }
        //         else{
        //             console.log('%c RGBObj','color:rgb(255,75,255,1)',Rainbow_i);
        //         }
        //         var temp_colorData = [0, 0, 0, 1];
        //         for (let index2 = 0; index2 < 3; index2++) {
        //             temp_colorData[index2] = (RGBObj[Rainbow_i][index2] * (Rainbow_totalstep - Rainbow_step) + RGBObj[Rainbow_i+1][index2] * Rainbow_step) / Rainbow_totalstep;
        //             temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
        //         }
        //         //setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];
        //         console.log('%c RGBObj_t_data','color:rgb(255,75,255,1)',temp_colorData);
        //         setRGB=temp_colorData;
        //     }
        //     else {
        //         setRGB = colors[0];
        //     }
        //     for (let index = 0; index < target.length; index++) {
        //         var element = target[index];
        //         var dis = this.distanceCalculation(0,this.imageMaxHeight/2, element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
        //         if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
        //             //element.color = setRGB;
        //             repeatCountList.push({
        //                 color: setRGB,
        //                 recordIndex:index,
        //                 //repeatTime: this.getRandom(5, 25),
        //             });
        //         }
        //     }
        // }
        // console.log('repeatCountList', repeatCountList)

        // this.repeater = setInterval(() => {
        //     //this.mode_reset();
        //     var t_Count=repeatCount%2;
        //     var t_Count2=0;
        //     if(t_Count==0){
        //         t_Count2=1;
        //     }
        //     else{
        //         t_Count2=0;
        //     }
        //     for (let index = 0; index < repeatCountList.length; index++) {
        //         var nowColor=[JSON.parse(JSON.stringify(repeatCountList[index].color)),[0,0,0,1]];
        //         var temp_colorData = [0, 0, 0, 1];
        //         for (let index2 = 0; index2 < 3; index2++) {
        //             temp_colorData[index2] = (nowColor[t_Count][index2] * (totalstep - nowStep) + nowColor[t_Count2][index2] * nowStep) / totalstep;
        //             temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
        //         }
        //         var target = this.AllBlockColor;
        //         target[repeatCountList[index].recordIndex].color= temp_colorData;
        //         //console.log('element.color', t_data, step, nowStep)
        //     }

        //     if(nowStep<totalstep-1){
        //         nowStep+=1;

        //     }
        //     else{
        //         nowStep=0;
        //         repeatCount += 1;
        //         //repeatCount=0;
        //     }
        // }, 50*this.animationSpeed)
        // //clearInterval(this.repeater);

        // /// else
        // clearInterval(this.repeater);
        // var repeatCount = 0;
        // var mode_step = 0;
        // var totalstep = 60;
        // var nowStep = 0;
        // if(isRainbow){
        // colors=this.rainbow7Color();
        // }
        // else{
        // //colors=[[0, 0, 255, 1],[255, 0, 0, 1]];
        // }
        // var nowC_index=0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList:any=[];
        // var target = this.AllBlockColor;
        // var setRGB;
        // var repeatCircleCount=0;
        // console.log('%c mode_Breathing','color:rgb(255,75,255,1)',colors,isRainbow);
        // //setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];
        // for (let index = 0; index < target.length; index++) {
        //     //var element = target[index];
        //     repeatCountList.push({
        //         color: [0, 0, 0, 1],
        //         recordIndex: index,
        //         repeatTime: this.getRandom(5, 25),
        //     });
        // }
        // console.log('repeatCountList', repeatCountList)
        // this.repeater = setInterval(() => {
        //     //this.mode_reset();
        //     var t_Count=repeatCount%2;
        //     var t_Count2=0;
        //     if(t_Count==0){
        //         t_Count2=1;
        //     }
        //     else{
        //         t_Count2=0;
        //     }
        //     var T_colors=JSON.parse(JSON.stringify(colors[nowC_index]));
        //     //console.log('T_colors', T_colors)
        //     for (let index = 0; index < repeatCountList.length; index++) {
        //         var nowColor=[[0,0,0,1],T_colors];

        //         var temp_colorData = [0, 0, 0, 1];
        //         for (let index2 = 0; index2 < 3; index2++) {
        //             temp_colorData[index2] = (nowColor[t_Count][index2] * (totalstep - nowStep) + nowColor[t_Count2][index2] * nowStep) / totalstep;
        //             temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
        //         }
        //         var target = this.AllBlockColor;
        //         target[repeatCountList[index].recordIndex].color= JSON.parse(JSON.stringify(temp_colorData))
        //         //console.log('element.color', t_data, nowStep, totalstep)
        //     }

        //     if(nowStep<totalstep-1){
        //         nowStep+=1;
        //     }
        //     else{
        //         nowStep=0;
        //         repeatCount += 1;
        //         var t_Count3=repeatCount%2;
        //         console.log('t_Count', t_Count3)
        //         if(t_Count3==0){
        //             if(nowC_index<colors.length-1){
        //                 nowC_index+=1;
        //             }
        //             else{
        //                 nowC_index=0;
        //             }
        //         }

        //         //repeatCount=0;
        //     }
        // }, 50*this.animationSpeed)
        // //clearInterval(this.repeater);
    };
    const getNodeColors_Breathing = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        if (uiContext.lightingSelectedColorStyle?.optionKey == 'customColor') {
            const color = getCurrentBreathingSingleColor(animationSpeed * 0.05, presetColor.current);

            for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
                // const layoutColor = uiContext.colorPickerValue_PresetLighting;
                const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                    currentColor: color,
                });
                nodes.push(updatedNode);
            }
        } else if (uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient') {
            for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
                if (breathingMode.current.layoutColors[i] == null) {
                    continue;
                }

                const color = getCurrentBreathingSingleColor(
                    animationSpeed * 0.05,
                    breathingMode.current.layoutColors[i],
                );
                // const layoutColor = uiContext.colorPickerValue_PresetLighting;
                const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                    currentColor: color,
                });
                nodes.push(updatedNode);
            }
        }

        return nodes;
    };

    const getNodeColors_NormallyOn = (animationSpeed: number) => {
        // /// if multicolor
        // clearInterval(this.repeater);
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList=[];
        // var target = this.AllBlockColor;
        // var setRGB;
        // var RGBObj =[[255,0,0,1],[255,0,0,1],[0, 255, 0,1],[0,0,255,1],[0, 0, 255,1]];
        // var Rainbow_totalstep=60;
        // var Rainbow_step=0;
        // var Rainbow_i=0;
        // console.log('%c mode_NormallyOnMulticolor','color:rgb(255,75,255,1)',colors);
        // for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.imageMaxWidth/60/5) {
        //     if(Rainbow_step<Rainbow_totalstep){
        //         Rainbow_step+=1;
        //     }
        //     else{
        //         Rainbow_step=0;
        //         if(Rainbow_i<RGBObj.length-2){
        //             Rainbow_i+=1;
        //         }
        //         else{
        //             Rainbow_i=0;
        //         }
        //     }
        //         var t_data = [0,0,0,1];
        //         for (let index = 0; index < 3; index++) {
        //             t_data[index] = (RGBObj[Rainbow_i][index] * (Rainbow_totalstep - Rainbow_step) + RGBObj[Rainbow_i+1][index] * Rainbow_step) / Rainbow_totalstep;
        //         }
        //         setRGB=t_data;
        //     for (let index = 0; index < target.length; index++) {
        //         var element = target[index];
        //         var dis = this.distanceCalculation(0,this.imageMaxHeight/2, element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
        //         if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
        //             var temp_colorData = JSON.parse(JSON.stringify(setRGB));
        //             for (let index = 0; index < 3; index++) {
        //                 temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
        //             }
        //             element.color=temp_colorData;
        //         }
        //     }
        // }

        ///else
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const rippleGraffMode = useRef(new AnimationProperties_RippleGraff());
    const initRippleGraff = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%c mode_RippleGraff','color:rgb(255,75,255,1)',colors,isRainbow);
        // clearInterval(this.repeater);
        // var repeatCount = 0;
        // var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        // var mode_step = 0;
        // var totalstep = 30;
        // var nowStep = 0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var r_totalstep = 30;
        // var r_nowStep = 0;
        // this.repeater = setInterval(() => {
        //     var target = this.AllBlockColor;
        //     var setRGB;
        //     if (isRainbow) {
        //         setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];
        //     }
        //     else {
        //         setRGB = colors[this.getRandom(0, colors.length - 1)];
        //     }
        //     var compareResult = this.minKeyWidth * repeatCount;
        //     var compareResultMax = this.minKeyWidth * repeatCount - this.minKeyWidth;
        //     if (r_nowStep + 1 < r_totalstep) {
        //         r_nowStep += 1;
        //     }
        //     for (let index = 0; index < target.length; index++) {
        //         var element = target[index];
        //         var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
        //         if (mode_step == 0) {
        //             if (dis <= compareResult && dis >= compareResultMax) {
        //                 var temp_colorData = JSON.parse(JSON.stringify(setRGB));
        //                 for (let index = 0; index < 3; index++) {
        //                     temp_colorData[index] = (temp_colorData[index] * (r_totalstep - r_nowStep) + 0 * r_nowStep) / r_totalstep;
        //                     temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
        //                 }
        //                 element.color = temp_colorData;
        //             }

        //         }
        //         else {
        //             var temp_colorData = JSON.parse(JSON.stringify(setRGB));
        //             for (let index = 0; index < 3; index++) {
        //                 temp_colorData[index] = (temp_colorData[index] * (totalstep - nowStep) + 0 * nowStep) / totalstep;
        //                 temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
        //             }
        //             element.color = temp_colorData;
        //         }

        //     }
        //     if (nowStep + 1 < totalstep) {
        //         nowStep += 1;
        //     }
        //     else {
        //         nowStep = 0;
        //         mode_step = 0;
        //         repeatCount = 0;
        //         clearInterval(this.repeater);
        //         this.setAllBlockColor([0, 0, 0, 1]);
        //         if(this.lightData.PointEffectName=="Kamehemeha"){
        //             this.mode_Kamehemeha(colors,isRainbow);
        //         }
        //     }
        //     if (this.minKeyWidth * repeatCount < this.imageMaxWidth) {
        //         repeatCount += 1;
        //     }
        //     else {
        //         mode_step = 1;
        //     }
        // }, 50**this.animationSpeed)
    };
    const getNodeColors_RippleGraff = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const passWithoutTraceMode = useRef(new AnimationProperties_PassWithoutTrace());
    const initPassWithoutTrace = () => {
        const profile = getCurrentProfile() as ProfileData;

        // let magnification = target_cs.animationSpeed * 100 * target_cs.animationSpeed;
        // if (target.Multicolor) {
        //     var colors = [[255, 0, 0, 1], [0, 255, 0, 1], [0, 0, 255, 1]];
        //     inputColor = [colors[this.M_Light_PRESETS.getRandom(0, colors.length - 1)]];
        // }
        // target_cs.mode_PassWithoutTrace(inputColor, index, magnification);

        // clearInterval(this.repeater);
        // //this.setAllBlockColor([0,0,0,1]);
        // var nowStep=0;
        // var totalStep=30;
        // var nextColor=[0,0,0,1];
        // var randomColor=colors[this.getRandom(0,colors.length-1)];
        // this.repeater = setInterval(() => {
        //     this.setAllBlockColor([0,0,0,1]);
        //     if (nowStep<totalStep) {
        //         nowStep+=1;
        //     }
        //     else{
        //         clearInterval(this.repeater);
        //     }
        //     var temp_colorData = [0, 0, 0, 1];
        //     for (let index = 0; index < 3; index++) {
        //         temp_colorData[index] = (randomColor[index] * (totalStep - nowStep) + nextColor[index] * nowStep) / totalStep;
        //         temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
        //     }
        //     var target = this.AllBlockColor;
        //     target[index].color = temp_colorData;
        // }, BaseSpeed*this.animationSpeed)
    };
    const getNodeColors_PassWithoutTrace = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const fastRunWithoutTraceMode = useRef(new AnimationProperties_FastRunWithoutTrace());
    const initFastRunWithoutTrace = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%c mode_FastRunWithoutTrace','color:rgb(255,77,255)',colors, isRainbow);
        // if (isRainbow) {
        //     colors =this.rainbow7Color();
        // }
        // clearInterval(this.repeater);
        // this.currentBlockIndex=blockIndex;
        // var repeatCount=0;
        // var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        // this.setAllBlockColor([0,0,0,1]);
        // var totalStep=10;
        // var horizontalList:any={
        // };
        // var target = this.AllBlockColor;
        // var randomValue=this.getRandom(0,colors.length-1);
        // var step_End=false;
        // horizontalList[this.currentBlockIndex]={
        //        color:colors[this.getRandom(0,colors.length-1)]
        // }
        // for (let index = 0; index < target.length; index++) {
        //     const element = target[index];
        //     var Ysdis=Math.abs(StartPoint.top_Left[1]-element.coordinateData.top_Left[1]);
        //     if (Ysdis <= 10) {
        //         horizontalList[index]={
        //             color:colors[this.getRandom(0,colors.length-1)],
        //             nowPos:0,
        //             nowstep:0,
        //             repeatCount:0,
        //             repeatTime:this.getRandom(15,20),
        //         }
        //     }
        // }
        // console.log('horizontalList',Object.keys(horizontalList))
        // this.repeater=setInterval(()=>{
        //     var LIndex=this.currentBlockIndex-repeatCount;
        //     var RIndex=this.currentBlockIndex+repeatCount;
        //     var resultL = horizontalList[LIndex];
        //     var resultR = horizontalList[RIndex];
        //     if (step_End) {
        //         var tempColors = colors;
        //         var nextColor=[0,0,0,1];
        //         var arr = Object.keys(horizontalList);
        //         for (let index = 0; index < arr.length; index++) {
        //             var index_num = parseInt(arr[index])
        //             var temp_block = horizontalList[index_num]
        //             if (temp_block.nowStep + 1 <= totalStep) {
        //                 temp_block.nowStep += 1;
        //             }
        //             else {
        //                 temp_block.nowStep = 0;
        //                 temp_block.repeatCount += 1;
        //             }
        //             var temp_C = temp_block.color;
        //             var temp_colorData = [0, 0, 0, 1];
        //             for (let index = 0; index < 3; index++) {
        //                 temp_colorData[index]= (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
        //                 temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
        //             }
        //             if(temp_block.repeatCount!=2){
        //                 target[index_num].color = temp_colorData;
        //             }
        //         }
        //         if(horizontalList[arr[0]].repeatCount==2){
        //             step_End = false;
        //             clearInterval(this.repeater);
        //         }
        //         return;
        //     }
        //     if (resultL == undefined && resultR == undefined) {
        //         repeatCount=0;
        //         step_End=true;
        //     }
        //     else{
        //         console.log('%c mode_FastRunWithoutTrace','color:rgb(255,77,255)',this.lightData.brightness);
        //         if (resultL != undefined) {
        //             var temp_color=JSON.parse(JSON.stringify(horizontalList[LIndex].color));
        //             for (let index = 0; index < 3; index++) {
        //                 temp_color[index]=temp_color[index]*this.lightData.brightness/100;
        //             }
        //             target[LIndex].color = temp_color;
        //         }
        //         if (resultR != undefined) {
        //             var temp_color=JSON.parse(JSON.stringify(horizontalList[RIndex].color));
        //             for (let index = 0; index < 3; index++) {
        //                 temp_color[index]=temp_color[index]*this.lightData.brightness/100;
        //             }
        //             target[RIndex].color = temp_color;
        //         };
        //         repeatCount+=1;
        //     }
        // },35*this.animationSpeed)
    };
    const getNodeColors_FastRunWithoutTrace = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const matrix2Mode = useRef(new AnimationProperties_Matrix2());
    const initMatrix2 = () => {
        const profile = getCurrentProfile() as ProfileData;

        // clearInterval(this.repeater);
        // this.currentBlockIndex=0;
        // var RGBcolors=[];
        // RGBcolors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]];
        // if(isRainbow){
        //     //colors=this.rainbow7Color();
        //     colors=RGBcolors;

        // }
        // else{
        //     colors=[colors[0],[0,0,0,1]];
        // }

        matrix2Mode.current.layoutColors = [
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
        ].map((item) => RGBAColor.fromRGB(item[0], item[1], item[2], item[3]));
        matrix2Mode.current.layoutColors = [
            RGBAColor.fromHex(profile.light_PRESETS_Data!.colors[0]),
            RGBAColor.fromRGB(0, 0, 0, 1),
        ];
        matrix2Mode.current.totalStep = 30;

        matrix2Mode.current.intervalCount = 0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        matrix2Mode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[0].props?.centerPoint || new Point()
            : new Point();
        // var target = this.AllBlockColor;
        // this.setAllBlockColor([0,0,0,1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        matrix2Mode.current.repeatCountList = [];
        matrix2Mode.current.RanRange = [10, 100];
        //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));

        for (let index = 0; index < lightingNodeItems.length; index++) {
            //console.log(' target[index].center_Point[0]', target[index].coordinateData.center_Point[0]);
            // var alpha=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            var modStep =
                (lightingNodeItems[index].props.centerPoint.x %
                    devicesContext.previewDevice!.deviceRenderAttributes.large.width) /
                devicesContext.previewDevice!.deviceRenderAttributes.large.width;
            //var ran=this.getRandom(0, colors.length - 1);
            var ran =
                matrix2Mode.current.layoutColors.length -
                1 -
                Math.round(modStep * (matrix2Mode.current.layoutColors.length - 1));
            //console.log('alpha',alpha);
            //console.log('modStep',modStep);

            //nowstep:modStep*totalStep
            matrix2Mode.current.repeatCountList.push({
                color: 0,
                nowPos: 0,
                nowstep: 0,
                repeatCount: 1,
                repeatTime: getRandom(matrix2Mode.current.RanRange[0], matrix2Mode.current.RanRange[1]),
            });

            // var temp_block=repeatCountList[index];
            var temp_C = matrix2Mode.current.layoutColors[0];
            var nextColor = matrix2Mode.current.layoutColors[1];
            if (uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient') {
                matrix2Mode.current.repeatCountList[index].nowPos = ran;
                if (ran < matrix2Mode.current.layoutColors.length - 1) {
                    temp_C = matrix2Mode.current.layoutColors[ran];
                    nextColor = matrix2Mode.current.layoutColors[ran + 1];
                } else {
                    temp_C = matrix2Mode.current.layoutColors[0];
                    nextColor = matrix2Mode.current.layoutColors[0];
                }
            }
            // var temp_colorData = [0, 0, 0, 1];
            // for (let index = 0; index < 3; index++) {
            //     temp_colorData[index] = (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
            //     temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
            // }
        }
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        matrix2Mode.current.repeatCount = 0;
    };
    const getNodeColors_Matrix2 = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];

        const updatedColors: Map<number, number[]> = new Map();
        var exist: number[] = [];
        // this.repeater = setInterval(() => {
        //this.setAllBlockColor([0, 0, 0, 1]);
        // var horizontalList = [];
        //console.log('horizontalList;',horizontalList);
        for (let index = 0; index < lightingNodeItems.length; index++) {
            const element = lightingNodeItems[index];
            // var resultL = exist.find((x) => x == index)
            // if (resultL != undefined) {
            //     break;
            // }
            exist.push(index);
            var temp_block = matrix2Mode.current.repeatCountList[index];
            var tempColors = matrix2Mode.current.layoutColors.map((item) => item.toArray_rgba());
            var nextColor;
            //var tempColors =temp_block.color;
            if (temp_block.repeatTime > 0) {
                temp_block.repeatTime -= 1;
            }
            if (temp_block.repeatTime == 0) {
                if (temp_block.nowStep + 1 < matrix2Mode.current.totalStep) {
                    temp_block.nowStep += 1;
                } else {
                    temp_block.nowStep = 0;
                    var newRand = getRandom(matrix2Mode.current.RanRange[0], matrix2Mode.current.RanRange[1]);
                    temp_block.repeatTime = newRand;
                    if (temp_block.nowPos + 1 < tempColors.length) {
                        temp_block.nowPos += 1;
                    } else {
                        temp_block.nowPos = 0;
                    }
                }
                var temp_C = tempColors[temp_block.nowPos];
                if (temp_block.nowPos + 1 < tempColors.length) {
                    nextColor = tempColors[temp_block.nowPos + 1];
                } else {
                    nextColor = tempColors[0];
                }
                var temp_colorData = [0, 0, 0, 1];
                for (let i = 0; i < 3; i++) {
                    temp_colorData[i] =
                        (temp_C[i] * (matrix2Mode.current.totalStep - temp_block.nowStep) +
                            nextColor[i] * temp_block.nowStep) /
                        matrix2Mode.current.totalStep;
                    // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                }
                // element.color = temp_colorData;
                updatedColors.set(index, temp_colorData);
            }
            //continue;
            //break;
        }
        if (matrix2Mode.current.intervalCount * 50 < devicesContext.previewDevice!.deviceRenderAttributes.large.width) {
            matrix2Mode.current.intervalCount += 1;
        } else {
            matrix2Mode.current.intervalCount = 0;
            exist = [];
            matrix2Mode.current.repeatCount += 1;
        }
        // if(repeatCount>2){
        //     clearInterval(this.repeater);
        // }
        // }, 100)

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = updatedColors.get(i) ?? lightingNodeItemsRef.current[i].props.currentColor;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: RGBAColor.fromRGB(updatedColor[0], updatedColor[1], updatedColor[2], updatedColor[3]),
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const matrix3Mode = useRef(new AnimationProperties_Matrix3());
    const initMatrix3 = () => {
        const profile = getCurrentProfile() as ProfileData;

        // clearInterval(this.repeater);
        //     this.currentBlockIndex=0;
        // var RGBcolors=[];
        // RGBcolors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]];
        // //RGBcolors =[[255,0,0,1],[255,0,0,0.8],[0,255,0,1],[0,255,0,0.8],[0,0,255,1],[0,0,255,0.8]];
        // if(isRainbow){
        //     //colors=this.rainbow7Color();
        //     colors=RGBcolors;

        // }
        // else{
        //     colors=[colors[0],[0,0,0,1]];
        // }
        // var totalStep=30;

        matrix2Mode.current.layoutColors = [
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
        ].map((item) => RGBAColor.fromRGB(item[0], item[1], item[2], item[3]));
        matrix2Mode.current.layoutColors = [
            RGBAColor.fromHex(profile.light_PRESETS_Data!.colors[0]),
            RGBAColor.fromRGB(0, 0, 0, 1),
        ];
        matrix2Mode.current.totalStep = 30;

        var intervalCount = 0;
        matrix2Mode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[0].props?.centerPoint || new Point()
            : new Point();
        // var target = this.AllBlockColor;
        //   this.setAllBlockColor([0,0,0,1]);
        //  var repeatCountList:any=[];
        //  var RanRange=[1,25];
        //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        matrix2Mode.current.repeatCountList = [];
        matrix2Mode.current.RanRange = [1, 25];

        for (let index = 0; index < lightingNodeItems.length; index++) {
            //console.log(' target[index].center_Point[0]', target[index].coordinateData.center_Point[0]);
            // var alpha=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            // var modStep=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            var modStep =
                (lightingNodeItems[index].props.centerPoint.x %
                    devicesContext.previewDevice!.deviceRenderAttributes.large.width) /
                devicesContext.previewDevice!.deviceRenderAttributes.large.width;
            //var ran=this.getRandom(0, colors.length - 1);
            // var ran=(colors.length - 1)-Math.round(modStep* (colors.length - 1));
            var ran =
                matrix2Mode.current.layoutColors.length -
                1 -
                Math.round(modStep * (matrix2Mode.current.layoutColors.length - 1));
            //console.log('alpha',alpha);
            //console.log('modStep',modStep);
            //nowstep:modStep*totalStep
            matrix2Mode.current.repeatCountList.push({
                color: 0,
                nowPos: 0,
                nowstep: 0,
                repeatCount: 1,
                repeatTime: getRandom(matrix2Mode.current.RanRange[0], matrix2Mode.current.RanRange[1]),
            });
            // var temp_block=repeatCountList[index];
            // var temp_C=colors[0];
            // var nextColor=colors[1];
            // if(uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient')
            // {
            //   matrix2Mode.current.repeatCountList[index].nowPos=ran;
            //     if(ran<colors.length - 1){
            //         temp_C=colors[ran];
            //         nextColor=colors[ran+1];
            //     }
            //     else{
            //         temp_C=colors[0];
            //         nextColor=colors[0];
            //     }

            // }
        }
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        matrix2Mode.current.repeatCount = 0;
    };
    const getNodeColors_Matrix3 = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];
        const updatedColors: Map<number, number[]> = new Map();
        var exist: number[] = [];
        // this.repeater = setInterval(() => {
        //this.setAllBlockColor([0, 0, 0, 1]);
        // var horizontalList = [];
        //console.log('horizontalList;',horizontalList);
        for (let index = 0; index < lightingNodeItems.length; index++) {
            // const element = target[index];
            // var resultL = exist.find((x) => x == index)
            // if (resultL != undefined) {
            //     break;
            // }
            exist.push(index);
            var temp_block = matrix2Mode.current.repeatCountList[index];
            //console.log('temp_block.color',temp_block.color);
            var tempColors = matrix2Mode.current.layoutColors.map((item) => item.toArray_rgba());
            //var tempColors =temp_block.color;
            var nextColor;
            if (temp_block.repeatTime > 0) {
                temp_block.repeatTime -= 1;
            }
            if (temp_block.repeatTime == 0) {
                if (temp_block.nowStep + 1 < matrix2Mode.current.totalStep) {
                    temp_block.nowStep += 1;
                } else {
                    temp_block.nowStep = 0;
                    var newRand = getRandom(matrix2Mode.current.RanRange[0], matrix2Mode.current.RanRange[1]);
                    temp_block.repeatTime = newRand;
                    if (temp_block.nowPos + 1 < tempColors.length) {
                        temp_block.nowPos += 1;
                    } else {
                        temp_block.nowPos = 0;
                    }
                }
                var temp_C = tempColors[temp_block.nowPos];
                if (temp_block.nowPos + 1 < tempColors.length) {
                    nextColor = tempColors[temp_block.nowPos + 1];
                } else {
                    nextColor = tempColors[0];
                }
                var temp_colorData = [0, 0, 0, 1];
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] =
                        (temp_C[index] * (matrix2Mode.current.totalStep - temp_block.nowStep) +
                            nextColor[index] * temp_block.nowStep) /
                        matrix2Mode.current.totalStep;
                    // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                }
                // element.color = temp_colorData;
                updatedColors.set(index, temp_colorData);
            }
            //continue;
            //break;
        }
        if (matrix2Mode.current.intervalCount * 50 < devicesContext.previewDevice!.deviceRenderAttributes.large.width) {
            matrix2Mode.current.intervalCount += 1;
        } else {
            matrix2Mode.current.intervalCount = 0;
            exist = [];
            matrix2Mode.current.repeatCount += 1;
        }
        // if(repeatCount>2){
        //     clearInterval(this.repeater);
        // }
        // }, 100)

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = updatedColors.get(i) ?? lightingNodeItemsRef.current[i].props.currentColor;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: RGBAColor.fromRGB(updatedColor[0], updatedColor[1], updatedColor[2], updatedColor[3]),
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const rainbowMode = useRef(new AnimationProperties_Rainbow());
    const initRainbow = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%c mode_Rainbow_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        // clearInterval(this.repeater);
        // this.currentBlockIndex=0;
        if (uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient') {
            //colors =this.rainbow7Color();
            // colors= [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
            rainbowMode.current.layoutColors = profile.light_PRESETS_Data!.colors.map((item) =>
                RGBAColor.fromHex(item),
            );
        } else {
            var maxPercent = 55;
            var currentPercent = 55;
            var tempColorArray: number[][] = [];
            var inputColor_T = RGBAColor.fromHex(profile.light_PRESETS_Data!.colors[0]);
            //console.log('%c inputColor_T','color:rgb(255,75,255,1)',inputColor_T);
            while (currentPercent > 25) {
                currentPercent -= 5;
                var tempColor = [0, 0, 0, 1];
                tempColor[0] = (inputColor_T.r * currentPercent) / maxPercent;
                tempColor[1] = (inputColor_T.g * currentPercent) / maxPercent;
                tempColor[2] = (inputColor_T.b * currentPercent) / maxPercent;
                //console.log('%c currentPercent>0','color:rgb(255,75,255,1)',tempColor);
                tempColorArray.push(tempColor);
            }
            rainbowMode.current.layoutColors = tempColorArray.map((item) =>
                RGBAColor.fromRGB(item[0], item[1], item[2]),
            );
        }
        // this.setAllBlockColor([0, 0, 0, 1]);

        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        rainbowMode.current.angle = -270;
        rainbowMode.current.theta = (Math.PI * rainbowMode.current.angle) / 180; //弧度
        rainbowMode.current.dx = Math.cos(rainbowMode.current.theta);
        rainbowMode.current.dy = -Math.sin(rainbowMode.current.theta);
        if (Math.abs(rainbowMode.current.dx) < 1e-5) rainbowMode.current.dx = 0;
        if (Math.abs(rainbowMode.current.dy) < 1e-5) rainbowMode.current.dy = 0;
        var position = 0;
        // var color_number=colors.length;
        // var target = this.AllBlockColor;
        var handleAllList = [];
        rainbowMode.current.position += 5;
    };
    const getNodeColors_Rainbow = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];
        //console.log('%c getColor','color:rgb(255,75,255,1)',result,this.use_scales,loop,this.colors,scales);
        // this.repeater = setInterval(() => {
        //position+=5;
        rainbowMode.current.position += 50;
        rainbowMode.current.position %= rainbowMode.current.bandwidth * rainbowMode.current.layoutColors.length;
        for (let index = 0; index < lightingNodeItems.length; index++) {
            var element = lightingNodeItems[index];
            //var y=sinx + cosx;
            //var y=sinx + cosx;
            var OffsetValue =
                element.props.centerPoint.x * rainbowMode.current.dx +
                element.props.centerPoint.y * rainbowMode.current.dy; //x*cos+y*sin=P(x,y)theta
            var scale =
                (OffsetValue - rainbowMode.current.position) /
                rainbowMode.current.bandwidth /
                rainbowMode.current.layoutColors.length;
            var defaultscales = [0, 0.2, 0.4, 0.6, 0.8];
            //console.log('%c dy','color:rgb(255,75,255,1)',dx,dy);
            // console.log('%c OffsetValue','color:rgb(255,75,255,1)',OffsetValue);
            // console.log('%c scale','color:rgb(255,75,255,1)',String(scale));
            // console.log('%c position','color:rgb(255,75,255,1)',position);
            // console.log('%c bandwidth','color:rgb(255,75,255,1)',bandwidth);
            var scales = defaultscales.slice(0);
            scale -= Math.floor(scale); // [0, 1)
            var lower_index = -1;
            var lower_scale = 0;
            var upper_index = rainbowMode.current.layoutColors.length;
            var upper_scale = 1;
            for (let i = 0; i < rainbowMode.current.layoutColors.length; ++i) {
                if (scales[i] <= scale) {
                    if (scales[i] >= lower_scale)
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                        lower_scale = scales[(lower_index = i)];
                    //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                } else {
                    if (scales[i] < upper_scale) upper_scale = scales[(upper_index = i)];
                }
            }
            //console.log('%c lower_scale','color:rgb(255,75,255,1)',upper_scale);
            //console.log('%c upper_scale','color:rgb(255,75,255,1)',upper_scale);
            //element.color = JSON.parse(JSON.stringify(colors[nowColor]));
            // var temp_colorData =JSON.parse(JSON.stringify(colors[lower_index]));
            for (let index = 0; index < 3; index++) {
                // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }
            // element.color = temp_colorData;
            const updatedNode = React.cloneElement(lightingNodeItems[index], {
                currentColor:
                    rainbowMode.current.layoutColors[lower_index] ?? lightingNodeItems[index].props.currentColor,
            });
            nodes.push(updatedNode);
        }

        // }, BaseSpeed*this.animationSpeed)

        return nodes;
    };

    const heartbeatSensorMode = useRef(new AnimationProperties_HeartbeatSensor());
    const initHeartbeatSensor = () => {
        const profile = getCurrentProfile() as ProfileData;

        if (uiContext.lightingSelectedColorStyle?.optionKey == 'customColor') {
            // let magnification=T_CS.animationSpeed*60;
            // T_CS.mode_HeartbeatSensor(inputColor,magnification);
        } else {
            // /// if multicolor
            // let magnification=T_CS.animationSpeed*60;
            // T_CS.mode_HeartbeatSensor([[255, 0, 0, 1], [0, 255, 0, 1], [0, 0, 255, 1]],magnification);
        }

        console.log('%c Enter_mode_HeartbeatSensor', 'color:rgb(255,77,255)', heartbeatSensorMode.current.layoutColors);
        var Brightness = 1;
        // clearInterval(this.repeater);
        // this.currentBlockIndex=43;
        //var StartPoint = [this.imageMaxWidth/2,this.imageMaxHeight/2];
        // var StartPoint = this.getNowBlock(0).coordinateData;
        heartbeatSensorMode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[lightingNodeItems.length - 1].props?.centerPoint || new Point()
            : new Point();

        heartbeatSensorMode.current.share_RepeatCount = 0;

        heartbeatSensorMode.current.horizontalList = [];
        for (
            let index = 0;
            index < devicesContext.previewDevice!.deviceRenderAttributes.large.width;
            index += heartbeatSensorMode.current.minKeyWidth / 2
        ) {
            var ratio = Math.sin((index * Math.PI) / 180);
            //var xpos=120+index;
            //const scale = (Math.sin(radian - Math.PI * 0.5) + 1) * 0.5*maxH;
            var ypos = (ratio + 1) * devicesContext.previewDevice!.deviceRenderAttributes.large.height;
            heartbeatSensorMode.current.horizontalList.push({
                repeatCount: 0,
                coordinate: [index, +ypos],
                //StartPoint.top_Left[0]+ypos
                //StartPoint[1]+ypos
            });
        }
    };
    const getNodeColors_HeartbeatSensor = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];
        const indexesToUpdate: Map<number, RGBAColor> = new Map();
        // this.repeater=setInterval(()=>{

        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        var isEnd = false;
        var spacing = -5;
        // if(horizontalList[0]['coordinate'][1]<=0||horizontalList[1]['coordinate'][1]>=this.imageMaxHeight){
        //     //h_Item['repeatCount']+=1;
        //     share_RepeatCount+=1;
        // }
        for (let index = 0; index < heartbeatSensorMode.current.horizontalList.length; index++) {
            var h_Item = heartbeatSensorMode.current.horizontalList[index];
            if (
                h_Item.coordinate[1] <= 0 ||
                h_Item.coordinate[1] >= devicesContext.previewDevice!.deviceRenderAttributes.large.height
            ) {
                h_Item['repeatCount'] += 1;
                //isEnd=true;
                //break;
            }
            if (h_Item['repeatCount'] % 2 == 0) {
                h_Item['coordinate'][1] -= 40;
                if (h_Item['coordinate'][1] <= 0) {
                    h_Item['coordinate'][1] = 0;
                }
            } else {
                h_Item['coordinate'][1] += 40;
                if (h_Item['coordinate'][1] >= devicesContext.previewDevice!.deviceRenderAttributes.large.height) {
                    h_Item['coordinate'][1] = devicesContext.previewDevice!.deviceRenderAttributes.large.height;
                }
            }
        }
        // if(isEnd){
        //     for (let i_2 = 0; i_2 <  horizontalList.length; i_2++) {
        //         var h_Item2=horizontalList[i_2];
        //         h_Item2.repeatCount+=1;
        //     }
        // }
        console.log(
            'horizontalList',
            heartbeatSensorMode.current.horizontalList,
            heartbeatSensorMode.current.share_RepeatCount % 2,
        );
        // var target = this.AllBlockColor;
        for (let index = 0; index < lightingNodeItems.length; index++) {
            const element = lightingNodeItems[index];
            for (let i2 = 0; i2 < heartbeatSensorMode.current.horizontalList.length; i2++) {
                var T = heartbeatSensorMode.current.horizontalList[i2].coordinate;
                //console.log('SlopeEquation[index]', i2, T, element.coordinateData.top_Left);
                if (
                    T[0] >= element.props.x &&
                    T[0] <= element.props.topRightPoint.x &&
                    T[1] >= element.props.y &&
                    T[1] <= element.props.bottomLeftPoint.y
                ) {
                    // var temp_colorData =JSON.parse(JSON.stringify(heartbeatSensorMode.current.layoutColors[getRandom(0, heartbeatSensorMode.current.layoutColors.length-1)]));
                    for (let index = 0; index < 3; index++) {
                        // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }
                    // element.color =temp_colorData;

                    const toUpdate =
                        heartbeatSensorMode.current.layoutColors[
                            getRandom(0, heartbeatSensorMode.current.layoutColors.length - 1)
                        ];
                    if (toUpdate != null) {
                        indexesToUpdate.set(index, toUpdate);
                    }
                    continue;
                }
            }
        }
        //console.log('this.animationSpeed', this.animationSpeed);
        // },BaseSpeed*this.animationSpeed)

        console.log(indexesToUpdate);
        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = indexesToUpdate.get(i) ?? RGBAColor.fromRGB(0, 0, 0, 1);
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: updatedColor,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const digtialTimesMode = useRef(new AnimationProperties_DigitalTimes());
    const initDigitalTimes = () => {
        const profile = getCurrentProfile() as ProfileData;

        // //   if (target.Multicolor) {
        // //     T_CS.mode_KeepRaining(inputColor,true,650);
        // // }
        // // else {
        // //     T_CS.mode_KeepRaining(inputColor,false,650);
        // //     //T_CS.mode_DigitTimes(inputColor);
        // // }
        // console.log('%c mode_KeepRaining', 'color:rgb(255,75,255,1)', colors, this.repeater);
        // clearInterval(this.repeater);
        // this.currentBlockIndex = 0;
        // console.log('%c mode_Starlight', 'color:rgb(255,75,255,1)', colors);
        // //colors=[[255,0,0,1]];
        // var translatecolors = [];
        // if (isRainbow) {
        //     translatecolors = this.rainbow7Color();
        // }
        // else {
        //     translatecolors = colors;
        // }
        // var totalStep = 5;
        // var intervalCount = 0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        // var target = this.AllBlockColor;
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList:any = [];
        // var RanRange = [0, 2];
        // var coordinateAllList:any=[];
        // var countNumber = 0;
        // //RotationMatrixValue: xpos + space+ypos,
        // //x' = cos(θ) * x - sin(θ) * y
        // //y' = sin(θ) * x + cos(θ) * y
        // //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));
        // for (let xpos = -350; xpos < this.imageMaxWidth; xpos += 40 ) {
        //     countNumber += 1;
        //     for (let ypos = 0; ypos < this.imageMaxHeight; ypos += 40) {
        //         //space += this.minKeyWidth/2;
        //         if(countNumber%3>0){
        //             coordinateAllList.push(
        //             {
        //                     coordinate: [xpos , ypos],
        //                     backupPos: [xpos , ypos],
        //                     RotationMatrixValue: xpos +ypos,
        //                     isVisible: countNumber%3==0?false:true,
        //             });
        //         }
        //     }
        // }
        // for (let index = 0; index < target.length; index++) {
        //     //var modStep = (target[index].coordinateData.center_Point[0] % this.imageMaxWidth) / this.imageMaxWidth;
        //     var ran = this.getRandom(0, translatecolors.length - 1);
        //     console.log('ran', ran);
        //     repeatCountList.push({
        //         nowColor: [0, 0, 0, 1],
        //         nextColor: translatecolors[ran],
        //         recordIndex: index,
        //         nowStep: 10,
        //         totalStep: 10,
        //         repeatCount: 0,
        //         repeatTime: this.getRandom(RanRange[0], RanRange[1]),
        //         switchOn:false,
        //     })
        //     //target[index].color=repeatCountList[index].color;
        // }
        // var MoveCenter=[0,0];
    };
    const getNodeColors_DigitalTimes = (animationSpeed: number) => {
        // this.repeater = setInterval(() => {
        //     this.setAllBlockColor([0, 0, 0, 1]);
        //     var nowAddx=0;
        //     // if(MoveCenter[0]<this.imageMaxWidth){
        //     //     MoveCenter[0]+=50;
        //     //     MoveCenter[1]+=50;
        //     // }
        //     // else{
        //     //     MoveCenter[0]=0;
        //     //     MoveCenter[1]=0;
        //     // }
        //     for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
        //         var T_CA = coordinateAllList[c2];
        //         //T_CA.coordinate[0]+=this.getRandom(25, 75);
        //         if(T_CA.coordinate[1]<this.imageMaxHeight){
        //             // nowAddx=50;
        //             T_CA.coordinate[0]+=this.getRandom(0, this.minKeyWidth*2);
        //             //T_CA.coordinate[0]+=this.minKeyHeight;
        //             T_CA.coordinate[1]+=this.minKeyHeight;
        //         }
        //         else{
        //             //T_CA.coordinate[0]=this.getRandom(0, 20);
        //             T_CA.coordinate[0]=T_CA.backupPos[0];
        //             T_CA.coordinate[1]=0;
        //         }
        //     }

        //     for (let index = 0; index < target.length; index++) {
        //         const element = target[index];
        //         var temp_block=repeatCountList[index];
        //         var RotationMatrixValue=MoveCenter[0]+MoveCenter[1];
        //         var RotationMatrixValue2=element.coordinateData.top_Left[0]+ element.coordinateData.top_Left[1];
        //         for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
        //             var T_CA = coordinateAllList[c2];
        //             if (T_CA.coordinate[0] > element.coordinateData.top_Left[0] &&
        //                 T_CA.coordinate[0] < element.coordinateData.top_Right[0] &&
        //                 T_CA.coordinate[1] > element.coordinateData.top_Left[1] &&
        //                 T_CA.coordinate[1] < element.coordinateData.bottom_Left[1]
        //             ) {
        //                 var colorData = [0, 0, 0, 1]
        //                 colorData[0] = (temp_block.nowColor[0] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[0] * temp_block.nowStep) / temp_block.totalStep;
        //                 colorData[1] = (temp_block.nowColor[1] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[1] * temp_block.nowStep) / temp_block.totalStep;
        //                 colorData[2] = (temp_block.nowColor[2] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[2] * temp_block.nowStep) / temp_block.totalStep;
        //                 element.color = this.getBrightnessRatio(colorData)
        //             }
        //         }

        //     }
        // }, BaseSpeed * this.animationSpeed)
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const initKeepRaining = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%c mode_KeepRaining', 'color:rgb(255,75,255,1)', colors, this.repeater);
        // clearInterval(this.repeater);
        // this.currentBlockIndex = 0;
        // console.log('%c mode_Starlight', 'color:rgb(255,75,255,1)', colors);
        // //colors=[[255,0,0,1]];
        // var translatecolors = [];
        // if (isRainbow) {
        //     translatecolors = this.rainbow7Color();
        // }
        // else {
        //     translatecolors = colors;
        // }
        // var totalStep = 5;
        // var intervalCount = 0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        // var target = this.AllBlockColor;
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList:any = [];
        // var RanRange = [0, 2];
        // var coordinateAllList:any=[];
        // var countNumber = 0;
        // //RotationMatrixValue: xpos + space+ypos,
        // //x' = cos(θ) * x - sin(θ) * y
        // //y' = sin(θ) * x + cos(θ) * y
        // //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));
        // for (let xpos = -350; xpos < this.imageMaxWidth; xpos += 40 ) {
        //     countNumber += 1;
        //     for (let ypos = 0; ypos < this.imageMaxHeight; ypos += 40) {
        //         //space += this.minKeyWidth/2;
        //         if(countNumber%3>0){
        //             coordinateAllList.push(
        //             {
        //                     coordinate: [xpos , ypos],
        //                     backupPos: [xpos , ypos],
        //                     RotationMatrixValue: xpos +ypos,
        //                     isVisible: countNumber%3==0?false:true,
        //             });
        //         }
        //     }
        // }
        // for (let index = 0; index < target.length; index++) {
        //     //var modStep = (target[index].coordinateData.center_Point[0] % this.imageMaxWidth) / this.imageMaxWidth;
        //     var ran = this.getRandom(0, translatecolors.length - 1);
        //     console.log('ran', ran);
        //     repeatCountList.push({
        //         nowColor: [0, 0, 0, 1],
        //         nextColor: translatecolors[ran],
        //         recordIndex: index,
        //         nowStep: 10,
        //         totalStep: 10,
        //         repeatCount: 0,
        //         repeatTime: this.getRandom(RanRange[0], RanRange[1]),
        //         switchOn:false,
        //     })
        //     //target[index].color=repeatCountList[index].color;
        // }
        // var MoveCenter=[0,0];
    };
    const getNodeColors_KeepRaining = (colors = [[0, 0, 255, 1]], isRainbow = false, BaseSpeed = 140) => {
        // this.repeater = setInterval(() => {
        //     this.setAllBlockColor([0, 0, 0, 1]);
        //     var nowAddx=0;
        //     // if(MoveCenter[0]<this.imageMaxWidth){
        //     //     MoveCenter[0]+=50;
        //     //     MoveCenter[1]+=50;
        //     // }
        //     // else{
        //     //     MoveCenter[0]=0;
        //     //     MoveCenter[1]=0;
        //     // }
        //     for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
        //         var T_CA = coordinateAllList[c2];
        //         //T_CA.coordinate[0]+=this.getRandom(25, 75);
        //         if(T_CA.coordinate[1]<this.imageMaxHeight){
        //             // nowAddx=50;
        //             T_CA.coordinate[0]+=this.getRandom(0, this.minKeyWidth*2);
        //             //T_CA.coordinate[0]+=this.minKeyHeight;
        //             T_CA.coordinate[1]+=this.minKeyHeight;
        //         }
        //         else{
        //             //T_CA.coordinate[0]=this.getRandom(0, 20);
        //             T_CA.coordinate[0]=T_CA.backupPos[0];
        //             T_CA.coordinate[1]=0;
        //         }
        //     }
        //     for (let index = 0; index < target.length; index++) {
        //         const element = target[index];
        //         var temp_block=repeatCountList[index];
        //         var RotationMatrixValue=MoveCenter[0]+MoveCenter[1];
        //         var RotationMatrixValue2=element.coordinateData.top_Left[0]+ element.coordinateData.top_Left[1];
        //         for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
        //             var T_CA = coordinateAllList[c2];
        //             if (T_CA.coordinate[0] > element.coordinateData.top_Left[0] &&
        //                 T_CA.coordinate[0] < element.coordinateData.top_Right[0] &&
        //                 T_CA.coordinate[1] > element.coordinateData.top_Left[1] &&
        //                 T_CA.coordinate[1] < element.coordinateData.bottom_Left[1]
        //             ) {
        //                 var colorData = [0, 0, 0, 1]
        //                 colorData[0] = (temp_block.nowColor[0] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[0] * temp_block.nowStep) / temp_block.totalStep;
        //                 colorData[1] = (temp_block.nowColor[1] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[1] * temp_block.nowStep) / temp_block.totalStep;
        //                 colorData[2] = (temp_block.nowColor[2] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[2] * temp_block.nowStep) / temp_block.totalStep;
        //                 element.color = this.getBrightnessRatio(colorData)
        //             }
        //         }
        //     }
        // }, BaseSpeed * this.animationSpeed)
    };

    const kamehamehaMode = useRef(new AnimationProperties_Kamehameha());
    const initKamehameha = () => {
        const profile = getCurrentProfile() as ProfileData;

        // clearInterval(this.repeater);
        if (uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient') {
            kamehamehaMode.current.layoutColors = profile.light_PRESETS_Data!.colors.map((item) =>
                RGBAColor.fromHex(item),
            );
        }
        kamehamehaMode.current.centerBlockIndex = 38;
        kamehamehaMode.current.repeatCount = 0;
        // var StartPoint = this.getNowBlock(this.centerBlockPoint).coordinateData;
        kamehamehaMode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[lightingNodeItems.length - 1].props?.centerPoint || new Point()
            : new Point();
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        // var target = this.AllBlockColor;
        kamehamehaMode.current.setRGB = profile.light_PRESETS_Data!.colors.map((item) =>
            RGBAColor.fromHex(item).toArray_rgba(),
        );
        kamehamehaMode.current.setArray = JSON.parse(JSON.stringify(kamehamehaMode.current.Step1_Range));
        console.log('enter mode_Kamehemeha');
    };
    const getNodeColors_Kamehameha = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];
        const indexesToUpdate: Map<number, RGBAColor> = new Map();
        // this.repeater = setInterval(() => {
        for (let index = 0; index < kamehamehaMode.current.setArray.length; index++) {
            var temp_colorData = JSON.parse(
                JSON.stringify(
                    kamehamehaMode.current.layoutColors[getRandom(0, kamehamehaMode.current.layoutColors.length - 1)],
                ),
            );
            for (let index = 0; index < 3; index++) {
                // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }
            indexesToUpdate.set(kamehamehaMode.current.setArray[index], temp_colorData);
        }
        for (let index = 0; index < kamehamehaMode.current.setArray.length; index++) {
            if (kamehamehaMode.current.setArray[index] < kamehamehaMode.current.centerBlockIndex) {
                kamehamehaMode.current.setArray[index] += 1;
            } else {
                if (
                    lightingNodeItems[kamehamehaMode.current.setArray[index]].props.centerPoint.x >
                    kamehamehaMode.current.startPoint.x
                ) {
                    kamehamehaMode.current.setArray[index] -= 1;
                }
            }
        }
        kamehamehaMode.current.repeatCount += 1;
        if (kamehamehaMode.current.repeatCount > 7) {
            getNodeColors_Kamehameha2(
                kamehamehaMode.current.layoutColors.map((item) => item.toArray_rgba()),
                uiContext.lightingSelectedColorStyle?.optionKey == 'rgbGradient',
            );
        }
        // }, 55*this.animationSpeed)

        console.log(indexesToUpdate);
        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = indexesToUpdate.get(i) ?? RGBAColor.fromRGB(0, 0, 0, 1);
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: updatedColor,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };
    const getNodeColors_Kamehameha2 = (
        colors = [
            [255, 0, 0, 1],
            [0, 255, 0, 1],
            [0, 0, 255, 1],
        ],
        isRainbow = true,
    ) => {
        // clearInterval(this.repeater);
        // var repeatCount = 0;
        // var StartPoint = this.getNowBlock(this.centerBlockPoint).coordinateData;
        // if(isRainbow){
        //     colors = this.rainbow7Color();
        // }
        // var qigongRangeIndex = [0];
        // this.setAllBlockColor([0, 0, 0, 1]);
        // var repeatCountList=[];
        // var target = this.AllBlockColor;
        // for (let index = 0; index < target.length; index++) {
        //     var element = target[index];
        //     var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
        //     if (dis>5&& dis <= this.minKeyWidth*1.5 ) {
        //         repeatCountList.push({
        //             color: colors[0],
        //             recordIndex:index,
        //             repeatTime: this.getRandom(5, 25),
        //         });
        //     }
        // }
        // this.repeater = setInterval(() => {
        //     this.setAllBlockColor([0, 0, 0, 1]);
        //     var target = this.AllBlockColor;
        //     for (let index = 0; index < qigongRangeIndex.length; index++) {
        //         var temp_colorData = JSON.parse(JSON.stringify(colors[this.getRandom(0,colors.length-1)]));
        //         for (let index = 0; index < 3; index++) {
        //             temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
        //     }          temp_colorData
        //     target[this.qigong_Step2_Range[qigongRangeIndex[index]]].color=temp_colorData;
        //     }
        //     for (let index = 0; index < qigongRangeIndex.length; index++) {
        //         if(qigongRangeIndex[index]<this.qigong_Step2_Range.length-1){
        //             qigongRangeIndex[index]+=1;
        //         }
        //         else{
        //             qigongRangeIndex[index]=0;
        //         }
        //     }
        //     repeatCount += 1;
        //     if(repeatCount>27){
        //         if(isRainbow){
        //             this.mode_RippleGraff(colors,true,this.centerBlockPoint);
        //         }
        //         else{
        //             this.mode_RippleGraff(colors,false,this.centerBlockPoint);
        //         }
        //     }
    };

    const pingPongMode = useRef(new AnimationProperties_PingPong());
    const initPingPong = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%cmode_Pingpong_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        //     clearInterval(this.repeater);
        // pingPongMode.current.currentBlockIndex=0;
        pingPongMode.current.intervalCount = 0;
        // var StartPoint = this.getNowBlock(0).coordinateData;
        pingPongMode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[0].props?.centerPoint || new Point()
            : new Point();
        // if (isRainbow) {
        //     colors =this.rainbow7Color();
        // }
        //console.log('StartPoint','color:green',JSON.stringify(StartPoint),this.AllBlockColor);
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        //Math.trunc(3.7); // 3

        pingPongMode.current.repeatCount = 0;
    };
    const getNodeColors_PingPong = (animationSpeed: number) => {
        const nodes: ReactElement[] = [];
        const indexesToUpdate: Map<number, RGBAColor> = new Map();
        // this.repeater = setInterval(() => {
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        var horizontalList: number[][] = [];
        var setRGB = pingPongMode.current.layoutColors[getRandom(0, pingPongMode.current.layoutColors.length - 1)];
        //console.log('repeatCount', repeatCount);
        var spacing = -5;
        if (pingPongMode.current.repeatCount % 2 == 0) {
            for (
                let index = 0;
                index < devicesContext.previewDevice!.deviceRenderAttributes.large.height;
                index += 50
            ) {
                var ypos = index;
                spacing += 1;
                var min = pingPongMode.current.intervalCount * 50 + spacing * 22;
                var max = pingPongMode.current.intervalCount * 100 * 4 + spacing * 22;
                for (let index2 = min; index2 < max; index2 += 1) {
                    var xpos = index2;
                    horizontalList.push([xpos, ypos]);
                }
            }
        } else {
            var spacing = -5;
            for (
                let index = 0;
                index < devicesContext.previewDevice!.deviceRenderAttributes.large.height;
                index += 50
            ) {
                spacing += 1;
                var ypos = index;
                var min =
                    devicesContext.previewDevice!.deviceRenderAttributes.large.width -
                    pingPongMode.current.intervalCount * 50 -
                    spacing * 22 -
                    50 * 4;
                var max =
                    devicesContext.previewDevice!.deviceRenderAttributes.large.width -
                    pingPongMode.current.intervalCount * 50 -
                    spacing * 22;
                //var spacing2 = this.minKeyWidth * intervalCount;
                for (let index2 = max; index2 > min; index2 -= 1) {
                    var xpos = index2;
                    horizontalList.push([xpos, ypos]);
                }
            }
        }
        //console.log('horizontalList', horizontalList);
        // var target = this.AllBlockColor;

        for (let index = 0; index < lightingNodeItems.length; index++) {
            const element = lightingNodeItems[index];
            for (let i2 = 0; i2 < horizontalList.length; i2++) {
                var T = horizontalList[i2];
                if (
                    T[0] > element.props.x &&
                    T[0] < element.props.topRightPoint.x &&
                    T[1] > element.props.y &&
                    T[1] < element.props.bottomLeftPoint.y
                ) {
                    var temp_colorData = JSON.parse(
                        JSON.stringify(
                            pingPongMode.current.layoutColors[
                                getRandom(0, pingPongMode.current.layoutColors.length - 1)
                            ],
                        ),
                    );
                    for (let index = 0; index < 3; index++) {
                        // temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }
                    // element.color = temp_colorData;
                    indexesToUpdate.set(index, temp_colorData);
                    //element.color = setRGB;
                    continue;
                }
            }
        }
        if (
            pingPongMode.current.intervalCount * 50 * 2 <
            devicesContext.previewDevice!.deviceRenderAttributes.large.width
        ) {
            pingPongMode.current.intervalCount += 1;
        } else {
            pingPongMode.current.intervalCount = 0;
            pingPongMode.current.repeatCount += 1;
        }
        // }, 100)

        console.log(indexesToUpdate);
        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            const updatedColor = indexesToUpdate.get(i) ?? [0, 0, 0, 1];
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: RGBAColor.fromRGB(updatedColor[0], updatedColor[1], updatedColor[2], updatedColor[3]),
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const surmountMode = useRef(new AnimationProperties_Surmount());
    const initSurmount = () => {
        const profile = getCurrentProfile() as ProfileData;

        // console.log('%cmode_Surmount_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        // clearInterval(this.repeater);
        surmountMode.current.repeatCount = 0;
        // surmountMode.current.StartPoint = this.getNowBlock(blockIndex).coordinateData;
        surmountMode.current.startPoint = lightingNodeItems.length
            ? lightingNodeItems[lightingNodeItems.length - 1].props?.centerPoint || new Point()
            : new Point();
        surmountMode.current.mode_step = 0;
        surmountMode.current.step = 30;
        surmountMode.current.nowStep = 0;
        // this.setAllBlockColor([0, 0, 0, 1]);
        setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
    };
    const getNodeColors_Surmount = (animationSpeed: number) => {
        const profile = getCurrentProfile() as ProfileData;
        const nodes: ReactElement[] = [];
        // this.repeater = setInterval(() => {
        // var target = this.AllBlockColor;
        var setRGB = profile.light_PRESETS_Data!.colors[getRandom(0, profile.light_PRESETS_Data!.colors.length - 1)];
        // if (uiContext.lightingSelectedColorStyle!.optionKey == 'rgbGradient')
        // {
        //     setRGB = this.rainbow7Color()[this.getRandom(0, colors.length - 1)];
        // }
        // else
        // {
        //     setRGB = colors[this.getRandom(0, colors.length - 1)];
        // }

        var compareResult = surmountMode.current.minKeyWidth * surmountMode.current.repeatCount;
        var compareResultMax =
            surmountMode.current.minKeyWidth * surmountMode.current.repeatCount - surmountMode.current.minKeyWidth;
        for (let index = 0; index < lightingNodeItems.length; index++) {
            var element = lightingNodeItems[index];
            var dis = distanceCalculation(
                surmountMode.current.startPoint.x,
                surmountMode.current.startPoint.y,
                element.props.centerPoint.x,
                element.props.centerPoint.y,
            );
            if (surmountMode.current.mode_step == 0) {
                if (dis <= compareResult && dis >= compareResultMax) {
                    var temp_colorData = JSON.parse(JSON.stringify(setRGB));
                    for (let index2 = 0; index2 < 3; index2++) {
                        // temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                    }
                    element.color = temp_colorData;
                }
            } else {
                // clearInterval(this.repeater);
            }
        }
        if (surmountMode.current.nowStep + 1 < surmountMode.current.step) {
            surmountMode.current.nowStep += 1;
        } else {
            surmountMode.current.nowStep = 0;
            surmountMode.current.mode_step = 0;
            surmountMode.current.repeatCount = 0;
            // clearInterval(this.repeater);
            // this.setAllBlockColor([0, 0, 0, 1]);
            setAllNodes(RGBAColor.fromRGB(0, 0, 0, 1));
        }
        if (
            surmountMode.current.minKeyWidth * surmountMode.current.repeatCount <
            devicesContext.previewDevice!.deviceRenderAttributes.large.width
        ) {
            surmountMode.current.repeatCount += 1;
        } else {
            surmountMode.current.mode_step = 1;
        }
        // }, 50**this.animationSpeed)

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: presetColor.current,
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const getNodeColors_LEDOff = () => {
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            // const layoutColor = uiContext.colorPickerValue_PresetLighting;
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: RGBAColor.fromRGB(0, 0, 0, 1),
            });
            nodes.push(updatedNode);
        }

        return nodes;
    };

    const setAllNodes = (color: RGBAColor) => {
        const nodes: ReactElement[] = [];

        for (let i = 0; i < lightingNodeItemsRef.current.length; i++) {
            if (lightingNodeItemsRef.current[i] == null) {
                continue;
            }
            const updatedNode = React.cloneElement(lightingNodeItemsRef.current[i], {
                currentColor: color,
            });
            nodes.push(updatedNode);
        }

        lightingNodeItemsRef.current = nodes;
        setLightingNodeItems(lightingNodeItemsRef.current);
    };

    const getRandom = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const rotatePoint = (a: number[], b: number[]) => {
        // var Dx = Math.abs(PointB[0] - PointA[0]);
        // var Dy = Math.abs(PointB[1] - PointA[1]);
        var Dx = b[0] - a[0];
        var Dy = b[1] - a[1];
        var DRoation = Math.atan2(Dy, Dx);
        //console.log('PointRotation,Math.atan2', DRoation);
        var WRotation = (DRoation / Math.PI) * 180;
        //弧度=角度/180*π(PI)
        //(角度=弧度*180/π(PI))
        return WRotation;
    };

    const getCurrentBreathingSingleColor = (animationSpeed: number, targetColor: RGBAColor) => {
        // calculate percentage of how light the colors should be
        if (breathingMode.current.lightnessPercent <= 0) {
            breathingMode.current.lightnessPercent = 0;
            breathingMode.current.operationKey = 'lighten';
        } else if (breathingMode.current.lightnessPercent >= 100) {
            breathingMode.current.lightnessPercent = 100;
            breathingMode.current.operationKey = 'darken';
        }

        const breathingStep = 1 * animationSpeed;
        if (breathingMode.current.operationKey == 'darken') {
            breathingMode.current.lightnessPercent = breathingMode.current.lightnessPercent - breathingStep;
        } else if (breathingMode.current.operationKey == 'lighten') {
            breathingMode.current.lightnessPercent = breathingMode.current.lightnessPercent + breathingStep;
        }

        // get percentage between the target and 0 for each color
        const updatedRed = (breathingMode.current.lightnessPercent / 100) * targetColor.red;
        const updatedGreen = (breathingMode.current.lightnessPercent / 100) * targetColor.green;
        const updatedBlue = (breathingMode.current.lightnessPercent / 100) * targetColor.blue;

        return RGBAColor.fromRGB(updatedRed, updatedGreen, updatedBlue);
    };

    return (
        <div className="nodes" ref={lightingNodes}>
            {lightingNodeItems}
        </div>
    );
}

export default KeyboardLightingPreviewComponent;
