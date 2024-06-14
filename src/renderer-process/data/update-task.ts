type UpdateTask = {
    key: string;
    percentageOfTotal?: number;
    translate: string;
};

export const UpdateTasks_App: UpdateTask[] = [
    { key: 'download', translate: 'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
    { key: 'execute', translate: 'FirmwareUpdate_Task_Execute' }, // not an 'update' step because we don't monitor this
    { key: 'shutdown', translate: 'FirmwareUpdate_Task_Shutdown', percentageOfTotal: 10 },
];
export const UpdateTasks_Wired: UpdateTask[] = [
    { key: 'download', translate: 'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
    { key: 'updateDevice', translate: 'FirmwareUpdate_Task_UpdateDevice' },
];
export const UpdateTasks_WirelessReceiver: UpdateTask[] = [
    { key: 'download', translate: 'FirmwareUpdate_Task_Download', percentageOfTotal: 20 },
    { key: 'updateDevice', translate: 'FirmwareUpdate_Task_UpdateDevice' },
    { key: 'updateReceiver', translate: 'FirmwareUpdate_Task_UpdateReceiver' },
];

export const DeviceUpdateTasks = new Map(Object.entries(
{
    "0x320F0x5044": UpdateTasks_Wired, // GMMK PRO
    "0x320F0x5092": UpdateTasks_Wired, // GMMK PRO
    "0x320F0x5046": UpdateTasks_Wired, // GMMK PRO ISO
    "0x320F0x5093": UpdateTasks_Wired, // GMMK PRO ISO
    "0x320F0x504A": UpdateTasks_Wired, // GMMK v2 65 ISO
    "0x320F0x5045": UpdateTasks_Wired, // GMMK v2 65 US
    "0x320F0x505A": UpdateTasks_Wired, // GMMK v2 96 ISO
    "0x320F0x504B": UpdateTasks_Wired, // GMMK v2 96 US
    "0x320F0x5088": UpdateTasks_Wired, // GMMK Numpad

    '0x342D0xE3C5': UpdateTasks_Wired, // valueB
    '0x342D0xE3CE': UpdateTasks_Wired, // valueBISO
    '0x342D0xE3CB': UpdateTasks_WirelessReceiver, // valueBWireless
    '0x342D0xE3D4': UpdateTasks_WirelessReceiver, // valueBWirelessISO
    '0x342D0xE3C7': UpdateTasks_Wired, // valueB65
    '0x342D0xE3D0': UpdateTasks_Wired, // valueB65ISO
    '0x342D0xE3CD': UpdateTasks_WirelessReceiver, // valueB65Wireless
    '0x342D0xE3D6': UpdateTasks_WirelessReceiver, // valueB65WirelessISO
    '0x342D0xE3C6': UpdateTasks_Wired, // valueB75
    '0x342D0xE3CF': UpdateTasks_Wired, // valueB75ISO
    '0x342D0xE3CC': UpdateTasks_WirelessReceiver, // valueB75Wireless
    '0x342D0xE3D5': UpdateTasks_WirelessReceiver, // valueB75WirelessISO
    '0x342D0xE3C8': UpdateTasks_Wired, // valueD100
    '0x342D0xE3D1': UpdateTasks_Wired, // valueD100ISO
    '0x342D0xE3C9': UpdateTasks_Wired, // valueD75
    '0x342D0xE3D2': UpdateTasks_Wired, // valueD75ISO
    '0x342D0xE3CA': UpdateTasks_Wired, // valueD65
    '0x342D0xE3D3': UpdateTasks_Wired, // valueD65ISO

    '0x342D0xE3D7': UpdateTasks_WirelessReceiver, // valueC 65% Wireless ANSI
    '0x342D0xE3D8': UpdateTasks_WirelessReceiver, // valueC 75% Wireless ANSI
    '0x342D0xE3D9': UpdateTasks_WirelessReceiver, // valueC 100% Wireless ANSI
    '0x342D0xE3EC': UpdateTasks_WirelessReceiver, // valueC 65% Wireless ISO
    '0x342D0xE3ED': UpdateTasks_WirelessReceiver, // valueC 75% Wireless ISO
    '0x342D0xE3EE': UpdateTasks_WirelessReceiver, // valueC 100% Wireless ISO

    '0x342D0xE3DA': UpdateTasks_Wired, // valueC 65% ANSI
    '0x342D0xE3DB': UpdateTasks_Wired, // valueC 75% ANSI
    '0x342D0xE3DC': UpdateTasks_Wired, // valueC 100% ANSI
    '0x342D0xE3EF': UpdateTasks_Wired, // valueC 65% ISO
    '0x342D0xE3F0': UpdateTasks_Wired, // valueC 75% ISO
    '0x342D0xE3F1': UpdateTasks_Wired, // valueC 100% ISO

    '0x342D0xE3DD': UpdateTasks_Wired, // valueA valueD HE 65% ANSI
    '0x342D0xE3F2': UpdateTasks_Wired, // valueA valueD HE 65% ISO
    '0x342D0xE3DE': UpdateTasks_Wired, // valueA valueD HE 75% ANSI
    '0x342D0xE3F3': UpdateTasks_Wired, // valueA valueD HE 75% ISO
    '0x342D0xE3DF': UpdateTasks_Wired, // valueA valueD HE 100% ANSI
    '0x342D0xE3F4': UpdateTasks_Wired, // valueA valueD HE 100% ISO

    '0x320F0x8888': UpdateTasks_Wired, // Model O Wired
    '0x258A0x2011': UpdateTasks_WirelessReceiver, // Model O Wireless
    '0x258A0x2036': UpdateTasks_Wired, // Model O Minus Wired
    '0x258A0x2013': UpdateTasks_WirelessReceiver, // Model O Minus Wireless
    '0x258A0x2015': UpdateTasks_WirelessReceiver, // Model O Pro Wireless
    '0x320F0x823A': UpdateTasks_Wired, // Model O2 Wired
    '0x093A0x822A': UpdateTasks_WirelessReceiver, // Model O2 Wireless
    '0x258A0x2019': UpdateTasks_WirelessReceiver, // Model O2 Pro 1k
    '0x258A0x201B': UpdateTasks_WirelessReceiver, // Model O 2 Pro 8k
    '0x258A0x2012': UpdateTasks_WirelessReceiver, // Model D Wireless
    '0x258A0x2014': UpdateTasks_WirelessReceiver, // Model D Minus Wireless
    '0x258A0x2017': UpdateTasks_WirelessReceiver, // Model D Pro Wireless
    '0x258A0x201A': UpdateTasks_WirelessReceiver, // Model D 2 Pro 1k
    '0x258A0x201C': UpdateTasks_WirelessReceiver, // Model D 2 Pro 8k
    '0x22D40x1503': UpdateTasks_Wired, // Model I
    '0x093A0x821A': UpdateTasks_WirelessReceiver, // Model I2
    '0x320F0x831A': UpdateTasks_Wired, // Model valueG
    '0x320F0x825A': UpdateTasks_Wired, // Model D2 Wired
    '0x093A0x824A': UpdateTasks_WirelessReceiver, // Model D2 Wireless
    '0x258A0x2018': UpdateTasks_WirelessReceiver, // Series One Pro Wireless
    '0x258A0x201D': UpdateTasks_WirelessReceiver, //valueH Pro (8k wireless)
    '0x093A0x826A': UpdateTasks_WirelessReceiver, //valueF Wireless
    '0x320F0x827A': UpdateTasks_Wired, //valueF

    '0x12CF0x0491': UpdateTasks_Wired, //GMP 2 GLO

    '0x24420x2682': UpdateTasks_Wired, // temporary valueB
    '0x24420x0056': UpdateTasks_WirelessReceiver, // temporary valueB Wireless
    '0x24420x0052': UpdateTasks_Wired, // temporary valueB 65%
    '0x24420x0054': UpdateTasks_WirelessReceiver, // temporary valueB 65% Wireless
    '0x24420x0053': UpdateTasks_Wired, // temporary valueB 75%
    '0x24420x0055': UpdateTasks_WirelessReceiver, // temporary valueB 75% Wireless

    }),
);
