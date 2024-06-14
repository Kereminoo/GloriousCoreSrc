import { MacroRecord } from "src/common/data/records/macro.record";
import { MessageChannels } from "../../common/channel-maps/MessageChannels";
import { IPCService } from "./ipc.service";
import { LightingLayoutData } from "src/common/data/records/lighting-layout.record";
import { PluginDeviceRecord } from "src/common/data/records/plugin-device.record";
import { PluginDevices } from "src/common/data/types/plugin-devices.type";

const Channels = MessageChannels.DataChannel;

export class DataServiceClass
{
    async getSupportDevice() 
    {
        const response = await IPCService.invoke(Channels.GetSupportDevice);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
    }
    
      //----------------------------Plugin--------------------------------//
      async getPluginDevice()
      {
        const response = await IPCService.invoke(Channels.GetPluginDevice);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data as PluginDevices[];
      }
    
      async updatePluginDevice(obj: any)
      {
        const response = await IPCService.invoke(Channels.UpdatePluginDevice, obj);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      async updateAllPluginDevice(obj: any)
      {
        const response = await IPCService.invoke(Channels.UpdateAllPluginDevice, obj);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      async updateDevice(_id : any, obj : any)
      {
        const data = {_id, obj};
        const response = await IPCService.invoke(Channels.UpdateDevice, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      async getAllDevice(){
        const response = await IPCService.invoke(Channels.GetAllDevice);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      //----------------------------Macro----------------------------//
    
      async getMacro(): Promise<any[]>
      {
        const response = await IPCService.invoke(Channels.GetMacro);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      } 
    
      async getMacroById(id:any)
      {
        const response = await IPCService.invoke(Channels.GetMacroById, id);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      async insertMacro(obj:any, callback:any = undefined)
      {
        const response = await IPCService.invoke(Channels.InsertMacro, obj);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }; 
    
      async DeleteMacro(index:any)
      {
        const response = await IPCService.invoke(Channels.DeleteMacro, index);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }; 
    
      async updateMacro(id:any,obj:any)
      {
        const data = {id, obj};
        const response = await IPCService.invoke(Channels.UpdateMacro, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      };
      //----------------------------EQ----------------------------//
    
      async getEQ()
      {
        const response = await IPCService.invoke(Channels.GetEQ);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }; 
    
      async getEQById(id:any) {
        const data = {id};
        const response = await IPCService.invoke(Channels.GetEQById, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
    
      async insertEQ(obj:any, callback:any = null){
        const data:any = {obj};
        const response = await IPCService.invoke(Channels.InsertEQ, data);
        if(!response.success)
        {
          console.error(response);
          if(callback != null)
          {
            callback(response.data.error, response.data.data);
          }
        }
        return true;
      }; 
    
      async DeleteEQ(index:any) {
        const data = {index};
        const response = await IPCService.invoke(Channels.DeleteEQ, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }; 
    
      async updateEQ(id:any,obj:any){
        const data = {id, obj};
        const response = await IPCService.invoke(Channels.UpdateEQ, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      };
    
      //----------------------------Layout----------------------------//
      async getLayout() : Promise<LightingLayoutData>
      {
        const response = await IPCService.invoke(Channels.GetLayout);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data[0];
      }
      
      // getLayoutAssignField(compareData) {
      //     return new Promise(function (resolve, reject) {
      //         return  _this.Node_NeDB.queryCmd('LayoutDB',compareData,function(docs){  
      //             resolve(docs);     
      //         });  
      //     });
      // }
    
      async updateLayoutAlldata(compareData: any,obj: any) : Promise<any>
      {
        const data = {compareData, obj};
        const response = await IPCService.invoke(Channels.UpdateLayout, data);
        if(!response.success)
        {
          console.error(response);
        }
        return response.data;
      }
}

export const DataService = new DataServiceClass();