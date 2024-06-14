import { FuncType } from '../../common/FunctionVariable';
import { IPCService } from './ipc.service';
import { MessageChannels } from '../../common/channel-maps/MessageChannels';

export class ProtocolService {
    /**
     * Set function from fron-end to back-end
     * @param obj
     */
    public static RunSetFunction(obj: any) {
        return ProtocolService._RunSetFunction(obj, null);
    }

    /**
     * Set function from fron-end to back-end
     * @param obj
     * @param callback
     */
    private static async _RunSetFunction(obj: any, callback: any) {
        switch (obj.Type) {
            case FuncType.System:
                return ProtocolService.RunSetFunctionSystem(obj, callback);
            case FuncType.Device:
            case FuncType.Mouse:
            case FuncType.Keyboard:
            case FuncType.valueE:
                return ProtocolService.RunSetFunctionDevice(obj, callback);
            default:
                return Promise.reject();
        }
    }

    private static async RunSetFunctionSystem(obj: any, callback: any) {
        const data = { Type: FuncType.System, Func: obj.Func, Param: obj.Param };
        const response = await IPCService.invoke(MessageChannels.ProtocolChannel.RunSetFunctionSystem, data);
        if (!response.success) {
            console.error(response);
            callback(response.data);
        }
        return response;
    }

    private static async RunSetFunctionDevice(obj: any, callback: any) {
        const data = { Type: obj.Type, Func: obj.Func, Param: obj.Param, SN: obj.SN };
        const response = await IPCService.invoke(MessageChannels.ProtocolChannel.RunSetFunctionDevice, data);
        if (!response.success) {
            console.error(response);
            callback(response.data);
        }
        return response.data;
    }
}
