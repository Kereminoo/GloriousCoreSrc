import { BrowserWindowConstructorOptions } from "electron"

export const appSettings: 
{ 
    // setting types
    WindowSizeFlag?: boolean,

    Window: BrowserWindowConstructorOptions
} = 
{
    // setting values
    WindowSizeFlag: undefined,

    Window: 
    {
        frame: false,
        center: true,
        width: 1440,
        height: 880,
        minWidth: 1440,
        minHeight: 880,
        skipTaskbar: false,
        show: true,
        resizable: true,
        transparent: true,
        maximizable: false,
        webPreferences: {
          nodeIntegration: true,
        //   contextIsolation: false,
        //   devTools: true
        },
        icon: "./src/renderer-process/images/icon.ico"
      }
}