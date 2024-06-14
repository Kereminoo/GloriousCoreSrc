export class DeviceIconData
{
    defaultSource: string;
    activeSource?: string;
    selectedSource?: string;

    constructor(defaultSource: string, activeSource?: string, selectedSource?: string)
    {
        this.defaultSource = defaultSource;
        this.activeSource = activeSource;
        this.selectedSource = selectedSource;
    }
}