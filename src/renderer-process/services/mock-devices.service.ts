import { IpcResponse } from "src/common/ipc-response";
import { MessageChannels } from "../../common/channel-maps/MessageChannels";
import { IPCService } from "./ipc.service";

export class MockDevicesService {

  async invokeMockDevice(channel: string, obj: any): Promise<IpcResponse> {
    const response = await IPCService.invoke(channel, obj);
    if (!response.success) {
      console.error(response);
    }
    return response.data;
  }

  async RegisterMockDevice(obj: any): Promise<IpcResponse> {
    return this.invokeMockDevice(MessageChannels.DeviceChannel.MockDeviceRegister, obj);
  }

  // create methods to generate calls for other MessageChannels
  async MockDeviceUnregister(obj: any): Promise<IpcResponse> {
    return this.invokeMockDevice(MessageChannels.DeviceChannel.MockDeviceUnregister, obj);
  }
  async MockDeviceCollect(obj: any): Promise<IpcResponse> {
    return this.invokeMockDevice(MessageChannels.DeviceChannel.MockDeviceCollect, obj);
  }
}