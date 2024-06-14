import { AppEvent } from "@renderer/support/app.events";
import { IpcRendererEvent } from "electron";

// it's usually overkill to wrap global function calls
// into their own service, but since these global
// function calls are the ones used to communicate with
// the electron process, it makes sense to force all
// data communication through here for debug-ability;
class IPCServiceClass
{
    constructor()
    {
        // receive data
        window.electron.ipcRenderer.on('ipcEvent', (event: IpcRendererEvent, value: any) =>
        {
            // console.log(event, value);
            if(value.Func == null)
            {
                console.error(`Unexpected ipcEvent function: ${value}`);
                return;
            }

            AppEvent.publish(value.Func, value.Param);
        })
    }

    // send data
    send = window.electron.ipcRenderer.send;

    // execute function and get return value
    invoke = window.electron.ipcRenderer.invoke;
}

export const IPCService = new IPCServiceClass();