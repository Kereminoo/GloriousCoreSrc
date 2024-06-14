export enum Color {
    Base100 = '--base-shades-100',
    Base90 = '--base-shades-90',
    Base80 = '--base-shades-80',
    Base70 = '--base-shades-70',
    Base60 = '--base-shades-60',
    Base50 = '--base-shades-50',
    Base40 = '--base-shades-40',
    Base30 = '--base-shades-30',
    Base20 = '--base-shades-20',
    Base10 = '--base-shades-10',
    Glorange20 = '--glorange-20',
    Glorange50 = '--glorange-50',
    Glorange60 = '--glorange-60',
    RedDark60 = '--red-dark-60',
    GreenDark60 = '--green-dark-60',
    GreenDark40 = '--green-dark-40',

    Yellow40 = '--yellow-40',
    Yellow60 = '--yellow-60',

    Purple40 = '--purple-40',
    Purple60 = '--purple-60',

    
    FriendlyYellow = '--friendly-yellow',
    FriendlyBlue = '--friendly-blue',
    FriendlyRed = '--friendly-red',
    FriendlyGreen = '--friendly-green',
    FriendlyPurple = '--friendly-purple',
    FriendlyTeal = '--friendly-teal',

    GIDSuccessDark = '--gid-success-dark',
    GIDSuccessLight = '--gid-success-light',
    GIDUploadDark = '--gid-upload-dark',
    GIDUploadLight = '--gid-upload-light',
    GIDSyncingDark = '--gid-syncing-dark',
    GIDSyncingLight = '--gid-syncing-light',
    GIDDisconnectDark = '--gid-disconnect-dark',
    GIDDisconnectLight = '--gid-disconnect-light',
    GIDLogoMark = '--gid-logo-mark',
  }
  
  export enum Position {
    LeftTop = 'lefttop',
    RightTop = 'righttop',
    LeftBottom = 'leftbottom',
    RightBottom = 'rightbottom',
  }
  
  export enum Size {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
  }
  
  export interface ColorOption {
    name: string;
    color: string;
  }
  
  export enum ColorType {
    Gradient = 'Gradient',
    Solid = 'Solid',
  }
  
  export enum ImageType {
    Single = 'Single',
    Sequence = 'Sequence',
  }
  