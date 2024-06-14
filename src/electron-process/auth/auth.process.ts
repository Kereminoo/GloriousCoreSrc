import { BrowserWindow } from 'electron';
import * as authService  from './auth.service';
import { EventTypes } from '../../common/EventVariable';

let win: any = null;

export async function createAuthWindow(options: any, MainWindow: BrowserWindow) {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 415,
    height: 560,
    webPreferences: {
      nodeIntegration: false
    }
  });
  win.setMenu(null);
  win.loadURL(await authService.getAuthenticationURL(options));

  const {
    session: {
      webRequest
    }
  } = win.webContents;

  const filter = {
    urls: [
      'http://localhost/callback/*',
      'https://localhost/callback/*'
    ]
  };

  webRequest.onBeforeRequest(filter, async ({ url }: { url: string }) => {
    try {
      await authService.loadTokensFromUrl(url);
      if (await authService.isLoggedIn()) {
        MainWindow.webContents.send('ipcEvent', { Func: EventTypes.UserLoggedIn, Param: null });
      }
    } catch(e) {
      console.error(e);
    }

    return destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) {
    return;
  }

  win.close();
  win = null;
}