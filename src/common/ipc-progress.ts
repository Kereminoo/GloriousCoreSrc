export class IPCProgress<T>
{
    constructor(public item: T, public type: 'start'|'progress'|'complete'|'error', public value: any, public message: string)
    {

    }
}