export class IpcResponse
{
    success: boolean;
    data?: any;
    constructor()
    {
        this.success = false;
        this.data = undefined;
    }
}