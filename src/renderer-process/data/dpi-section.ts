export class DPISection
{
    min: number = 0;
    max: number = 0;
    ticks: number = 0;

    constructor(min: number = 0, max: number = 0, ticks: number = 0)
    {
        this.min = min;
        this.max = max;
        this.ticks = ticks;
    }
}

export const DPISections_19000 = 
[
    new DPISection(100, 1000, 0),
    new DPISection(1000, 2000, 0),
    new DPISection(2000, 3000, 0),
    new DPISection(3000, 4000, 0),
    new DPISection(4000, 8000, 3),
    new DPISection(8000, 12000, 3),
    new DPISection(12000, 19000, 5)
];

export const DPISections_26000 = 
[
    new DPISection(100, 2000, 0),
    new DPISection(2000, 4000, 0),
    new DPISection(4000, 6000, 0),
    new DPISection(6000, 8000, 1),
    new DPISection(8000, 10000, 1),
    new DPISection(10000, 15000, 2),
    new DPISection(15000, 20000, 2),
    new DPISection(20000, 26000, 3),
];