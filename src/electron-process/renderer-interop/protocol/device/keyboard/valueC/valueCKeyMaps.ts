// TODO: move this file appropriate place

// Transcribed from the documentation

export const KeyCodeMapping: { [key: string]: number } = {
    A: 0x04,
    B: 0x05,
    C: 0x06,
    D: 0x07,
    E: 0x08,
    F: 0x09,
    G: 0x0a,
    H: 0x0b,
    I: 0x0c,
    J: 0x0d,
    K: 0x0e,
    L: 0x0f,
    M: 0x10,
    N: 0x11,
    O: 0x12,
    P: 0x13,
    Q: 0x14,
    R: 0x15,
    S: 0x16,
    T: 0x17,
    U: 0x18,
    V: 0x19,
    W: 0x1a,
    X: 0x1b,
    Y: 0x1c,
    Z: 0x1d,
    '1': 0x1e,
    '2': 0x1f,
    '3': 0x20,
    '4': 0x21,
    '5': 0x22,
    '6': 0x23,
    '7': 0x24,
    '8': 0x25,
    '9': 0x26,
    '0': 0x27,
    Return: 0x28,
    Escape: 0x29,
    Backspace: 0x2a,
    Tab: 0x2b,
    Space: 0x2c,
    '-': 0x2d,
    '=': 0x2e,
    '[': 0x2f,
    ']': 0x30,
    '\\': 0x31,
    'Europe 1 (Note 2)': 0x32,
    ';': 0x33,
    "'": 0x34,
    '`': 0x35,
    ',': 0x36,
    '.': 0x37,
    '/': 0x38,
    'Caps Lock': 0x39,
    F1: 0x3a,
    F2: 0x3b,
    F3: 0x3c,
    F4: 0x3d,
    F5: 0x3e,
    F6: 0x3f,
    F7: 0x40,
    F8: 0x41,
    F9: 0x42,
    F10: 0x43,
    F11: 0x44,
    F12: 0x45,
    'Print Screen': 0x46,
    'Scroll Lock': 0x47,
    Break: 0x48,
    Pause: 0x48,
    Insert: 0x49,
    Home: 0x4a,
    'Page Up': 0x4b,
    Delete: 0x4c,
    End: 0x4d,
    'Page Down': 0x4e,
    'Right Arrow': 0x4f,
    'Left Arrow': 0x50,
    'Down Arrow': 0x51,
    'Up Arrow': 0x52,
    'Num Lock': 0x53,
    'Keypad /': 0x54,
    'Keypad *': 0x55,
    'Keypad -': 0x56,
    'Keypad +': 0x57,
    'Keypad Enter': 0x58,
    'Keypad 1': 0x59,
    'Keypad 2': 0x5a,
    'Keypad 3': 0x5b,
    'Keypad 4': 0x5c,
    'Keypad 5': 0x5d,
    'Keypad 6': 0x5e,
    'Keypad 7': 0x5f,
    'Keypad 8': 0x60,
    'Keypad 9': 0x61,
    mouse_left: 0xf0,
    mouse_right: 0xf1,
    mouse_middle: 0xf2,
    mouse_forward: 0xf3,
    mouse_back: 0xf4,
    ControlLeft: 0xe0,
    ShiftLeft: 0xe1,
    AltLeft: 0xe2,
    ControlRight: 0xe4,
    ShiftRight: 0xe5,
    AltRight: 0xe6,
};

// Mappings from valueC 75% keyboard
export const KeyNumbers75Percent: { [key: string]: number } = {
    Esc: 0x00,
    '`': 0x01,
    Tab: 0x02,
    CapsLock: 0x03,
    ShiftLeft: 0x04,
    ControlLeft: 0x05,

    F1: 0x0c,
    '1': 0x07,
    Q: 0x08,
    A: 0x09,
    Z: 0x10,
    MetaLeft: 0x11,

    F2: 0x12,
    '2': 0x0d,
    W: 0x0e,
    S: 0x0f,
    X: 0x16,
    AltLeft: 0x17,

    '3': 0x13,
    E: 0x14,
    D: 0x15,
    C: 0x1c,

    F3: 0x18,
    '4': 0x19,
    R: 0x1a,
    F: 0x1b,
    V: 0x22,
    Space: 0x23,

    F5: 0x24,
    '5': 0x1f,
    T: 0x20,
    G: 0x21,
    B: 0x28,

    F6: 0x2a,
    '6': 0x25,
    Y: 0x26,
    H: 0x27,
    N: 0x2e,

    F7: 0x30,
    '7': 0x2b,
    U: 0x2c,
    J: 0x2d,
    M: 0x34,

    F8: 0x36,
    '8': 0x31,
    I: 0x32,
    K: 0x33,
    ',': 0x3a,
    AltRight: 0x2f,

    F9: 0x3c,
    '9': 0x37,
    O: 0x38,
    L: 0x39,
    '.': 0x40,

    '0': 0x3d,
    P: 0x3e,
    ';': 0x3f,
    '/': 0x46,
    Fn: 0x35,

    F10: 0x42,
    '-': 0x43,
    '[': 0x44,
    "'": 0x45,
    ShiftRight: 0x4c,
    ArrowLeft: 0x4d,

    F11: 0x48,
    '=': 0x49,
    ']': 0x4a,

    F12: 0x4e,
    Backspace: 0x4f,
    '\\': 0x50,
    Return: 0x51,
    ArrowUp: 0x52,
    ArrowDown: 0x53,

    ScrollWheel: 0x54,
    ScrollWheelDown: 0x41,
    ScrollWheelUp: 0x3b,

    Delete: 0x55,
    PageUp: 0x56,
    PageDown: 0x57,
    End: 0x58,
    ArrowRight: 0x59,
};

export const KeyNumbers100Percent: { [key: string]: number } = {
    ContextMenu: 0x3b,
    ControlRight: 0x41,

    PrintScreen: 0x54,
    Insert: 0x55,
    Delete: 0x56,
    ArrowLeft: 0x47,

    ScrollLock: 0x5a,
    Home: 0x5b,
    End: 0x5c,

    ArrowUp: 0x52,
    ArrowDown: 0x4d,

    Pause: 0x60,
    PageUp: 0x61,
    PageDown: 0x62,
    ArrowRight: 0x53,

    NumLock: 0x68,
    Numpad7: 0x57,
    Numpad4: 0x58,
    Numpad1: 0x59,
    Numpad0: 0x6b,

    NumpadDivide: 0x6e,
    Numpad8: 0x5d,
    Numpad5: 0x5e,
    Numpad2: 0x5f,

    NumpadMultiply: 0x69,
    Numpad9: 0x63,
    Numpad6: 0x64,
    Numpad3: 0x65,
    NumpadDecimal: 0x6a,

    // TODO: get the number for rotary
    ScrollWheel: 0xff,
    ScrollWheelDown: 0x6d,
    ScrollWheelUp: 0x6c,

    NumpadSubtract: 0x6f,
    NumpadAdd: 0x70,
    NumpadEnter: 0x71,
};

export enum ModifierKeys {
    CtrlLeft = 0xe0,
    CtrlRight = 0xe4,
    ShiftLeft = 0xe1,
    ShiftRight = 0xe5,
    AltLeft = 0xe2,
    AltRight = 0xe6,
    MetaLeft = 0xe3,
    MetaRight = 0xe7,
}

const VID = 0x342d;
// valueC/valueDHE PIDs
const wired65 = [0xe3da, 0xe3dd, 0xe3ef, 0xe3f2];
const wired75 = [0xe3db, 0xe3de, 0xe3f0, 0xe3f3];
const wired100 = [0xe3dc, 0xe3df, 0xe3f1, 0xe3f4];
const wireless65 = [0xe3d7, 0xe3ec];
const wireless75 = [0xe3d8, 0xe3ed];
const wireless100 = [0xe3d9, 0xe3ee];
const valueCAll = wired65.concat(wired75, wired100, wireless65, wireless75, wireless100);
const toSN = (pid: number) => `0x${VID.toString(16).toUpperCase()}0x${pid.toString(16).toUpperCase()}`;

const isvalueC = (SN: string) => valueCAll.filter((val) => toSN(val) == SN) != null;
const isWired = (SN: string) => wired65.concat(wired75, wired100).filter((val) => toSN(val) == SN) != null;
const isWireless = (SN: string) => wireless65.concat(wireless75, wireless100).filter((val) => toSN(val) == SN) != null;

const is65 = (SN: string) => wired65.concat(wireless65).filter((val) => toSN(val) == SN) != null;
const is75 = (SN: string) => wired75.concat(wireless75).filter((val) => toSN(val) == SN) != null;
const is100 = (SN: string) => wired100.concat(wireless100).filter((val) => toSN(val) == SN) != null;

export const PhysicalKeyMapping = (deviceSN: string) => {
    if (is65(deviceSN)) return KeyNumbers75Percent;
    if (is75(deviceSN)) return KeyNumbers75Percent;
    if (is100(deviceSN)) return  {...KeyNumbers75Percent, ...KeyNumbers100Percent};
    return {};
};
