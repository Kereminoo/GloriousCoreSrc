import { Color } from '../component.types';

export enum IconSize {
  XSmall = 'xsmall',
  Smaller = 'smaller',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Larger = 'larger',
  ExtraLarge = 'extralarge',
}
export enum UniqueIconSize {
  ModelO = 'model-o',
  ModelD = 'model-d',
  ModelI = 'model-i',
  valueJ = 'valueJ',
  GMMKPRO = 'gmmk-pro',
  GMMK265 = 'gmmk2-65',
  GMMK296 = 'gmmk2-96',
  Keyboard100 = 'keyboard-100',
  Numpad = 'numpad',
  Drag = 'drag',
  LayerTop = 'layer-top',
  LayerUnderneath = 'layer-underneath',
  NavigationArrow = 'navigation-arrow',
  DocumentMagnifyingGlass = 'document-magnifying-glass',
  USBSymbol = 'usb-symbol',
}
export const UniqueIconSizeMap  = new Map([
  [ "model-o", { width: "26px", height: "40px" } ],
  [ "model-d", { width: "28px", height: "40px" } ],
  [ "model-i", { width: "30px", height: "40px" } ],
  [ "valueJ", { width: "26px", height: "40px" } ],
  [ "gmmk-pro", { width: "71px", height: "36px" } ],
  [ "gmmk2-65", { width: "74px", height: "32px" } ],
  [ "gmmk2-96", { width: "81px", height: "36px" } ],
  [ "numpad", { width: "32px", height: "32px" } ],
  [ "drag", { width: "12px", height: "20px" } ],
  [ "layer-top", { width: "47px", height: "25px" } ],
  [ "layer-underneath", { width: "47px", height: "17px" } ],
  [ "navigation-arrow", { width: "19px", height: "14px" } ],
  [ "document-magnifying-glass", { width: "28px", height: "35px" } ],
  [ "usb-symbol", { width: "12px", height: "16px" } ],
]);

export const iconColorsOptions: (Color | undefined)[] = [
  Color.Base100,
  Color.Base60,
  Color.Base70,
  Color.Base50,
  Color.Base30,
  Color.Base20,
  Color.Base20,
  Color.Glorange60,
  Color.Glorange50,
  Color.Glorange20,
  undefined,
];

export type IconColor =
  | Color.Base100
  | Color.Base60
  | Color.Base70
  | Color.Base50
  | Color.Base30
  | Color.Base20
  | Color.Glorange60
  | Color.Glorange50
  | Color.Glorange20
  | Color.GreenDark60
  | Color.GreenDark40
  | Color.RedDark60
  | Color.GIDSuccessDark
  | Color.GIDSuccessLight
  | Color.GIDUploadDark
  | Color.GIDUploadLight
  | Color.GIDSyncingDark
  | Color.GIDSyncingLight
  | Color.GIDDisconnectDark
  | Color.GIDDisconnectLight
  | Color.GIDLogoMark;

export enum IconType {

  // Status
  SuccessCheck = 'success-check',
  FailCross = 'fail-cross',

  // Utility
  SaveCheck = 'save-check',
  CancelCross = 'cancel-cross',
  InformationOutline = 'information-outline',
  Trash = 'trash',
  ExclamationPoint = 'exclamation-point',
  QuestionMark = 'question-mark',
  NavigationArrow = 'navigation-arrow',
  CircleArrow = 'circle-arrow',
  UpArrowOutline = 'up-arrow-outline',
  DocumentMagnifyingGlass = 'document-magnifying-glass',
  Hourglass = 'hourglass',
  USBSymbol = 'usb-symbol',
  VerticalEllipses = 'vertical-ellipses',
  Drag = 'drag',
  Plus = 'plus',
  PlusOutline = 'plus-outline',
  Edit = 'edit',
  FloppyDisk = 'floppy-disk',
  Undo = 'undo',
  SaveCheckRounded = 'save-check-rounded',


  // Navigation
  GloriousLogo = 'glorious-logo',
  CogFilled = 'cog-filled',
  RGBSync = 'rgb-sync',
  ModelODevice = 'model-o-device',
  ModelDDevice = 'model-d-device',
  ModelIDevice = 'model-i-device',
  GMMK265Device = 'gmmk2-65-device',
  GMMK296Device = 'gmmk2-96-device',
  GMMKPRODevice = 'gmmk-pro-device',
  NumpadDevice = 'numpad-device',
 
  // Connected Devices
  BatteryLow = 'battery-low',
  BatteryMedium = 'battery-medium',
  BatteryHigh = 'battery-high',
  WirelessConnectionStrong = 'wireless-connection-strong',
  WirelessConnectionMedium = 'wireless-connection-medium',
  WirelessConnectionWeak = 'wireless-connection-weak',
  WirelessConnectionDisconnected = 'wireless-connection-disconnected',
 
 // Settings
  ProfilePicture = 'profile-picture',
  Sun = 'sun',
  Moon = 'moon',
 
  // GloriousID
  GloriousID = 'glorious-id',
  CloudCheck = 'cloud-check',
  CloudUpload = 'cloud-upload',
  CloudSyncing = 'cloud-syncing',
  CloudDisconnected = 'cloud-disconnected',
  WireframeGlobe = 'wireframe-globe',
  Shop = 'shop',
  Filter = 'filter',
  Sort = 'sort',

  // Pairing

  // Devices
  Home = 'home',
  CogOutline = 'cog-outline',
  Lightbulb = 'lightbulb',
  LightningBolt = 'lightning-bolt',
  Speedometer = 'speedometer',
  Keybinding = 'keybinding',
  Actuation = 'actuation',
  AdvancedKeys = 'advanced-keys',
  DynamicKeystroke = 'dynamic-keystroke',
  ModTap = 'mod-tap',
  ToggleKey = 'toggle-key',
  LayerTop = 'layer-top',
  LayerUnderneath = 'layer-underneath',

  // Macros
  MacroNoRepeat = 'macro-no-repeat',
  MacroRepeatWhileHolding = 'macro-repeat-while-holding',
  MacroToggle = 'macro-toggle',

  // these icons were "modern ui" icons; not custom glorious icons
  // Alert = 'alert',
  // ArrowLeft = 'arrow-left',
  // BatteryCharging = 'battery-charging',
  // ChatProcessing = 'chat-processing',
  // Close = 'close',
  // Copy = 'copy',
  // Delete = 'delete',
  // GamepadSquare = 'gamepad-square',
  // valueEMic = 'valueE-mic',
  // Mic = 'mic',
  // MicOff = 'mic-off',
  // Nc = 'nc',
  // Open = 'open',
  // Pause = 'pause',
  // Play = 'play',
  // Plus = 'plus',
  // RotateLeft = 'rotate-left',
  // RotateRight = 'rotate-right',
  // Screen = 'screen',
  // SpinnerDark = 'spinner-dark',
  // SpinnerLight = 'spinner-light',
  // Stop = 'stop',
  // Tick = 'tick',
  // TransparencyMode = 'transparency-mode',
  // TransparencyOff = 'transparency-off',
  // TuneVariant = 'tune-variant',
  // Upload = 'upload',
  // VolumeUp = 'volume-up',
}
