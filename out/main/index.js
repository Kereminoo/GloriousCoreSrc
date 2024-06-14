"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const fs$1 = require("node:fs/promises");
const fs = require("node:fs");
const path$1 = require("node:path");
const EventEmitter = require("events");
const os = require("node:os");
const cp = require("node:child_process");
require("node:readline/promises");
const DBstore = require("nedb");
const lockfile = require("lockfile");
const module$1 = require("module");
const cp$1 = require("child_process");
const buffer = require("buffer");
const stream = require("stream");
const AdmZip = require("adm-zip");
const nodeDownloaderHelper = require("node-downloader-helper");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const runtime = require("@protobuf-ts/runtime");
const os$1 = require("os");
const request = require("request");
const gUrl = require("url");
const http = require("http");
const https = require("https");
const axios = require("axios");
const keytar = require("keytar");
const qs = require("qs");
const fs$2 = require("fs/promises");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs$1);
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path$1);
const cp__namespace = /* @__PURE__ */ _interopNamespaceDefault(cp);
const protoLoader__namespace = /* @__PURE__ */ _interopNamespaceDefault(protoLoader);
const grpc__namespace = /* @__PURE__ */ _interopNamespaceDefault(grpc);
Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1,
    //month
    "d+": this.getDate(),
    //day
    "h+": this.getHours(),
    //hour
    "m+": this.getMinutes(),
    //minute
    "s+": this.getSeconds(),
    //second
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //quarter
    "S": this.getMilliseconds()
    //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
};
Date.prototype.add = function(milliseconds) {
  var m = this.getTime() + milliseconds;
  return new Date(m);
};
Date.prototype.addSeconds = function(second) {
  return this.add(second * 1e3);
};
Date.prototype.addMinutes = function(minute) {
  return this.addSeconds(minute * 60);
};
Date.prototype.addHours = function(hour) {
  return this.addMinutes(60 * hour);
};
Date.prototype.addDays = function(day) {
  return this.addHours(day * 24);
};
Date.prototype.addMonths = function(addMonth) {
  var result;
  if (addMonth > 0) {
    while (addMonth > 0) {
      result = this.addMonth();
      addMonth--;
    }
  } else if (addMonth < 0) {
    while (addMonth < 0) {
      result = this.subtractMonth();
      addMonth++;
    }
  } else {
    result = this;
  }
  return result;
};
Date.prototype.addMonth = function() {
  var m = this.getMonth();
  if (m == 11)
    return new Date(this.getFullYear() + 1, 1, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
  var daysInNextMonth = Date.daysInMonth(this.getFullYear(), this.getMonth() + 1);
  var day = this.getDate();
  if (day > daysInNextMonth) {
    day = daysInNextMonth;
  }
  return new Date(this.getFullYear(), this.getMonth() + 1, day, this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.subtractMonth = function() {
  var m = this.getMonth();
  if (m == 0)
    return new Date(this.getFullYear() - 1, 12, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
  var day = this.getDate();
  var daysInPreviousMonth = Date.daysInMonth(this.getFullYear(), this.getMonth());
  if (day > daysInPreviousMonth) {
    day = daysInPreviousMonth;
  }
  return new Date(this.getFullYear(), this.getMonth() - 1, day, this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.addYears = function(year) {
  return new Date(this.getFullYear() + year, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.isLeapYear = function(year) {
  return year % 4 == 0 && year % 100 != 0;
};
Date.daysInMonth = function(year, month) {
  if (month == 2) {
    if (year % 4 == 0 && year % 100 != 0)
      return 29;
    else
      return 28;
  } else if (month <= 7 && month % 2 == 1 || month > 7 && month % 2 == 0)
    return 31;
  else
    return 30;
};
String.prototype.isPadAs = function(str) {
  var re = new RegExp(str, "g");
  return this.replace(re, "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") == "";
};
String.padLeft = function(str, lenght) {
  if (str.length >= lenght)
    return str;
  else
    return String.padLeft(" " + str, lenght);
};
String.padRight = function(str, lenght) {
  if (str.length >= lenght)
    return str;
  else
    return String.padRight(str + " ", lenght);
};
const icon = path.join(__dirname, "./chunks/app-icon-2cbd3657.ico");
const AppChannel = {
  GetAppSetting: "DBMESSAGE_GETAPPSETTING",
  SaveAppSetting: "DBMESSAGE_SAVEAPPSETTING",
  SaveStartupSetting: "APP_SAVE_STARTUP_SETTING",
  InitTray: "APP_INITTRAY",
  ShowOpenDialog: "APP_SHOWOPENDIALOG",
  ShowSaveDialog: "APP_SHOWSAVEDIALOG",
  CustomHyperlink: "APP_CUSTOMHYPERLINK",
  OpenHyperlink: "APP_CUSTOMHYPERLINK",
  CommandMin: "APP_COMMAND_MIN",
  CommandMax: "APP_COMMAND_MAX",
  CommandClose: "APP_COMMAND_CLOSE",
  Tool_SaveFile: "APP_TOOL_SAVEFILE",
  Tool_ClearFolder: "APP_TOOL_CLEARFOLDER",
  Tool_SupportSaveFile: "APP_TOOL_SUPPORTSAVEFILE",
  Tool_OpenFile: "APP_TOOL_OPENFILE",
  GetAvailableTranslations: "APP_GETAVAILABLETRANSLATIONS",
  GetVersion: "APP_GET_VERSION",
  GetVersionFileUrl: "APP_GETVERSIONFILEURL",
  GetCORE2VersionFileUrl: "APP_GETCORE2VERSIONFILEURL",
  GetBuildVersion: "APP_GET_BUILDVERSION",
  GetDownloadedFirmwareUpdaters: "APP_GETDOWNLOADEDFIRMWAREUPDATERS",
  BeginFirmwareDownloads: "APP_BEGINFIRMWAREDOWNLOADS",
  BeginFirmwareUpdates: "APP_BEGINFIRMWAREUPDATES",
  ShowDebug: "APP_SHOW_DEBUG",
  Login: "APP_LOGIN",
  Logout: "APP_LOGOUT",
  IsLoggedIn: "APP_ISLOGGEDIN",
  GetProfile: "APP_GETPROFILE",
  ChangePassword: "APP_CHANGEPASSWORD",
  GetCloudDeviceProfiles: "APP_GETDEVICEPROFILES",
  CreateCloudDeviceProfile: "APP_CREATEDEVICEPROFILE",
  DeleteCloudDeviceProfile: "APP_DELETEDEVICEPROFILE",
  GetAllCloudDevicesProfiles: "APP_GETALLDEVICEPROFILES",
  SetFirmwareOverrides: "APP_SET_FIRMWARE_OVERRIDES",
  Tool_DownloadFile: "APP_TOOL_DOWNLOADFILE",
  Tool_CancelDownload: "APP_TOOL_CANCELDOWNLOAD"
};
const EnvironmentChannel = {
  GetArch: "ENVMESSAGE_GETARCH"
};
const DataChannel = {
  // GetAppSetting : "DBMESSAGE_GETAPPSETTING",
  // SaveAppSetting : "DBMESSAGE_SAVEAPPSETTING",
  GetSupportDevice: "DBMESSAGE_GETSUPPORTDEVICE",
  GetLayout: "DBMESSAGE_GETLAYOUT",
  UpdateLayout: "DBMESSAGE_UPDATELAYOUT",
  GetPluginDevice: "DBMESSAGE_GETPLUGINDEVICE",
  UpdatePluginDevice: "DBMESSAGE_UPDATEPLUGINDEVICE",
  UpdateAllPluginDevice: "DBMESSAGE_UPDATEALLPLUGINDEVICE",
  UpdateDevice: "DBMESSAGE_UPDATEDEVICE",
  GetAllDevice: "DBMESSAGE_GETALLDEVICE",
  GetMacro: "DBMESSAGE_GETMACRO",
  GetMacroById: "DBMESSAGE_GETMACROBYID",
  InsertMacro: "DBMESSAGE_INSERTMACRO",
  DeleteMacro: "DBMESSAGE_DELETEMACRO",
  UpdateMacro: "DBMESSAGE_UPDATEMACRO",
  GetEQ: "DBMESSAGE_GETEQ",
  GetEQById: "DBMESSAGE_GETEQBYID",
  InsertEQ: "DBMESSAGE_INSERTEQ",
  UpdateEQ: "DBMESSAGE_UPDATEEQ",
  DeleteEQ: "DBMESSAGE_DELETEEQ"
};
const DeviceChannel = {
  AppSetting: "DEVICEMESSAGE_APPSETTING",
  MockDeviceRegister: "MOCK_DEVICE_REGISTER",
  MockDeviceUnregister: "MOCK_DEVICE_UNREGISTER",
  MockDeviceCollect: "MOCK_DEVICE_COLLECT",
  MockDeviceLoad: "MOCK_DEVICE_LOAD",
  DeviceSendHidReport: "DEVICE_SEND_HID_REPORT"
};
const ProtocolChannel = {
  RunSetFunctionSystem: "PROTOCOLCHANNEL_RUNSETFUNCTIONSYSTEM",
  RunSetFunctionDevice: "PROTOCOLCHANNEL_RUNSETFUNCTIONDEVICE"
};
const MessageChannels = { AppChannel, EnvironmentChannel, DataChannel, DeviceChannel, ProtocolChannel };
const name = "glorious-core";
const productName = "Glorious Core";
const description = "Glorious Device Management";
const author = "Glorious, LLC";
const version = "2.0.0";
const buildVersion = "2.0.1.4-rc+01";
const main = "./out/main/index.js";
const scripts = {
  "typecheck:node": "tsc --noEmit -p tsconfig.node.json --composite false",
  "typecheck:web": "tsc --noEmit -p tsconfig.web.json --composite false",
  typecheck: "npm run typecheck:node && npm run typecheck:web",
  "package": "electron-vite build --outDir=dist && electron-forge package",
  "make ": "electron-vite build --outDir=dist && electron-forge make",
  start: "electron-vite preview",
  dev: "electron-vite dev",
  build: "npm run typecheck && electron-vite build",
  postinstall: "electron-builder install-app-deps",
  "electron-vite-build": "electron-vite build",
  "build:win": "electron-vite build && electron-builder --win --config",
  "build:mac": "electron-vite build && electron-builder --mac --config",
  "build:linux": "electron-vite build && electron-builder --linux --config"
};
const dependencies = {
  "@electron-toolkit/preload": "^2.0.0",
  "@electron-toolkit/utils": "^1.0.2",
  "@grpc/grpc-js": "^1.10.6",
  "@grpc/proto-loader": "^0.7.12",
  "@ngx-translate/core": "^14.0.0",
  "@ngx-translate/http-loader": "^7.0.0",
  "@protobuf-ts/plugin": "^2.9.4",
  "@protobuf-ts/runtime": "^2.9.4",
  "@types/color-convert": "^2.0.0",
  "adm-zip": "^0.5.9",
  axios: "^1.6.2",
  "cmake-js": "^7.2.1",
  jquery: "^3.6.1",
  keytar: "^7.9.0",
  lockfile: "^1.0.4",
  lodash: "^4.17.21",
  nedb: "^1.8.0",
  "node-downloader-helper": "^2.1.9",
  "os-locale": "^2.1.0",
  prettier: "^3.0.3",
  qs: "^6.11.2",
  "react-colorful": "^5.6.1",
  "react-viewport-list": "^7.1.1",
  request: "^2.88.2",
  tslib: "^2.3.0",
  "universal-analytics": "^0.5.3"
};
const devDependencies = {
  "@electron-forge/cli": "^6.2.1",
  "@electron-forge/maker-deb": "^6.2.1",
  "@electron-forge/maker-rpm": "^6.2.1",
  "@electron-forge/maker-squirrel": "^6.2.1",
  "@electron-forge/maker-zip": "^6.2.1",
  "@electron-toolkit/tsconfig": "^1.0.1",
  "@electron/notarize": "^1.2.4",
  "@types/adm-zip": "^0.5.0",
  "@types/jquery": "^3.5.14",
  "@types/lodash": "^4.14.186",
  "@types/node": "^20.3.1",
  "@types/qs": "^6.9.11",
  "@types/react": "^18.2.9",
  "@types/react-dom": "^18.2.4",
  "@vitejs/plugin-react": "^4.0.1",
  electron: "^25.2.0",
  "electron-builder": "^24.4.0",
  "electron-vite": "^1.0.23",
  "file-loader": "^6.2.0",
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router": "^6.13.0",
  "react-router-dom": "^6.13.0",
  typescript: "~4.7.2",
  vite: "^4.3.9",
  yarn: "^1.22.19"
};
const optionalDependencies = {
  "dmg-license": "^1.0.11"
};
const window = {
  frame: false,
  center: true,
  width: 1440,
  height: 880,
  minWidth: 1440,
  minHeight: 880,
  "skip-taskbar": false,
  show: true,
  resizable: true,
  transparent: true,
  maximizable: false,
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    contextIsolation: false
  },
  icon: "./app-icon.ico"
};
const versionFileUrl = "https://gloriouscore.nyc3.digitaloceanspaces.com/Glorious_Core/Version.json";
const core2VersionFileUrl = "https://gloriouscore.nyc3.digitaloceanspaces.com/CORE2/version.json";
const useDebugVersionFileUrl = true;
const showDebugUI = true;
const BuiltType = 0;
const BuildCode = 2;
const mockDevices = [
  {
    name: "GMMK Numpad",
    vid: "z0x320F",
    pid: "z0x5088"
  },
  {
    name: "GMMK PRO",
    vid: "z0x320F",
    pid: "z0x5044"
  },
  {
    name: "GMMK PRO Alt",
    vid: "z0x320F",
    pid: "z0x5092"
  },
  {
    name: "GMMK PRO ISO",
    vid: "z0x320F",
    pid: "z0x5046"
  },
  {
    name: "GMMK PRO ISO alt",
    vid: "z0x320F",
    pid: "z0x5093"
  },
  {
    name: "GMMK V2 65 US",
    vid: "z0x320F",
    pid: "z0x5045"
  },
  {
    name: "GMMK V2 65 ISO",
    vid: "z0x320F",
    pid: "z0x504A"
  },
  {
    name: "GMMK V2 96 US",
    vid: "z0x320F",
    pid: "z0x504B"
  },
  {
    name: "GMMK V2 96 ISO",
    vid: "z0x320F",
    pid: "z0x505A"
  },
  {
    name: "Model O Wired",
    vid: "z0x258A",
    pid: "z0x0036"
  },
  {
    name: "Model O Wireless",
    vid: "z0x258A",
    pid: "z0x2011"
  },
  {
    name: "Model O Minus Wired",
    vid: "z0x258A",
    pid: "z0x2036"
  },
  {
    name: "Model O Minus Wireless",
    vid: "z0x258A",
    pid: "z0x2013"
  },
  {
    name: "Model O Pro Wireless",
    vid: "z0x258A",
    pid: "z0x2015"
  },
  {
    name: "Model O2 Wired",
    vid: "z0x320F",
    pid: "z0x823A"
  },
  {
    name: "Model O2 Wireless",
    vid: "z0x093A",
    pid: "z0x822A"
  },
  {
    name: "Model O2 Pro 1k Wireless",
    vid: "z0x258A",
    pid: "z0x2019"
  },
  {
    name: "Model O2 Pro 8k Wireless",
    vid: "z0x258A",
    pid: "z0x201B"
  },
  {
    name: "Series One Pro Wireless",
    vid: "z0x258A",
    pid: "z0x2018"
  },
  {
    name: "Model D Wireless",
    vid: "z0x258A",
    pid: "z0x2012"
  },
  {
    name: "Model D Minus Wireless",
    vid: "z0x258A",
    pid: "z0x2014"
  },
  {
    name: "Model D Pro Wireless",
    vid: "z0x258A",
    pid: "z0x2017"
  },
  {
    name: "Model D2 Wired",
    vid: "z0x320F",
    pid: "z0x825A"
  },
  {
    name: "Model D2 Wireless",
    vid: "z0x093A",
    pid: "z0x824A"
  },
  {
    name: "Model D2 Pro 1k Wireless",
    vid: "z0x258A",
    pid: "z0x201A"
  },
  {
    name: "Model D2 Pro 8k Wireless",
    vid: "z0x258A",
    pid: "z0x201C"
  },
  {
    name: "Model I Wired",
    vid: "z0x22D4",
    pid: "z0x1503"
  },
  {
    name: "Model I2 Wireless",
    vid: "z0x093A",
    pid: "z0x821A"
  }
];
const build = {
  extraResources: [
    {
      from: "src/renderer-process/public",
      to: "public"
    }
  ],
  files: [
    "!src/renderer-process/public/**/*"
  ],
  win: {
    target: "zip",
    icon: "./app-icon.ico"
  }
};
const packageProperties = {
  name,
  productName,
  description,
  author,
  version,
  buildVersion,
  main,
  scripts,
  "private": true,
  dependencies,
  devDependencies,
  optionalDependencies,
  window,
  versionFileUrl,
  core2VersionFileUrl,
  useDebugVersionFileUrl,
  showDebugUI,
  BuiltType,
  BuildCode,
  mockDevices,
  build
};
const appUserDataFolderPath = electron.app.getPath("userData");
const userName = os.userInfo().username;
const AppPaths = {
  UserDataFolder: appUserDataFolderPath,
  UserFile: path$1.join(appUserDataFolderPath, `${userName}.txt`),
  DataFolder: path$1.join(appUserDataFolderPath, "userdata", userName, "data"),
  LogsFolder: path$1.join(appUserDataFolderPath, "logs"),
  DownloadsFolder: path$1.join(appUserDataFolderPath, "downloads"),
  DBResource: utils.is.dev ? path$1.resolve(__dirname, "../../src/renderer-process/public/database") : path$1.join(process.resourcesPath, "./public/database"),
  TempFolder: path$1.join(appUserDataFolderPath, "temp")
};
const getDBResourceFilePath = (fileName) => path$1.join(AppPaths.DBResource, fileName);
const getDataFilePath = (fileName) => path$1.join(AppPaths.DataFolder, fileName);
const getTempFilePath = (fileName) => path$1.join(AppPaths.TempFolder, fileName);
const readUserDataFile = (fileName) => fs.readFileSync(getDataFilePath(fileName));
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
const createAppFolders = () => {
  createFolderIfNotExists(AppPaths.UserDataFolder);
  createFolderIfNotExists(AppPaths.DataFolder);
  createFolderIfNotExists(AppPaths.LogsFolder);
  createFolderIfNotExists(AppPaths.DownloadsFolder);
  createFolderIfNotExists(AppPaths.TempFolder);
};
const EnvironmentLogLevel = { ERROR: "ERROR", WARN: "WARN", INFO: "INFO", DEBUG: "DEBUG" };
class EnvironmentLog {
  level = EnvironmentLogLevel.INFO;
  #logFilePathRoot;
  constructor(logFilePath) {
    this.#logFilePathRoot = logFilePath;
  }
  logToFile(ClassName, functionName, info) {
    try {
      const date = /* @__PURE__ */ new Date();
      var msg = date.format("yyyy-MM-dd hh:mm:ss.S");
      if (typeof info == "object")
        info = JSON.stringify(info);
      msg = `${msg}    ${String.padRight(ClassName, 20)}   ${String.padRight(functionName, 30)}   ${info}`;
      var CurrentDate = date.format("yyyyMMdd");
      if (!fs.existsSync(this.#logFilePathRoot)) {
        fs.mkdirSync(this.#logFilePathRoot);
      }
      var LogFilePath = path$1.join(this.#logFilePathRoot, CurrentDate + ".log");
      fs.appendFileSync(LogFilePath, msg + "\r\n");
      console.log(ClassName, functionName, info);
    } catch (ex) {
      console.error(ex);
    }
  }
  walkLog(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach((file) => {
      var file1 = dir + "/" + file;
      var stat = fs.statSync(file1);
      if (stat && stat.isDirectory())
        results = results.concat(this.walkLog(file1));
      else {
        if (path$1.extname(file) == ".log")
          results.push(file);
      }
    });
    return results;
  }
  deleteLogs() {
    this.logToFile("env", "logToFile", "Clear Logs .");
    var date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - 7);
    var tmp = date.format("yyyyMMdd");
    this.walkLog(this.#logFilePathRoot).forEach((item) => {
      let aFile = item.substr(0, item.length - 4);
      if (aFile < tmp) {
        fs.unlinkSync(path$1.join(this.#logFilePathRoot, "/") + item);
      }
    });
  }
  privateDeleteLogFile() {
    try {
      var files = [];
      var CurrentDate = (/* @__PURE__ */ new Date()).format("yyyyMMdd");
      var LogFilePath = path$1.join(AppPaths.LogsFolder);
      if (fs.existsSync(LogFilePath)) {
        files = fs.readdirSync(LogFilePath);
        for (var file of files) {
          var curPath = path$1.join(LogFilePath, file);
          var f = file.split(".");
          if (f[0] != CurrentDate) {
            fs.unlinkSync(curPath);
          }
        }
      }
    } catch (e) {
    }
  }
}
class EnvironmentSession {
  #environmentLog;
  get logLevel() {
    return this.#environmentLog.level;
  }
  set logLevel(value) {
    this.#environmentLog.level = value;
  }
  isWindows;
  isMac;
  isLinux;
  osReleaseVer;
  BuiltType;
  BuildCode;
  // isTestMode: boolean
  // isDebugging: boolean
  winSettings;
  // keyBoardSettings = packageJson.keyboard || void 0;
  isLessThenWin81;
  runningInstanceHandle;
  appversion;
  buildVersion;
  exportVersion;
  DesktopDir;
  // mockDevices: typeof packageJson.mockDevices;
  // isTestServer: boolean;
  // useDebugControls: typeof packageJson.useDebugControls;
  // runningAutomatedTests: typeof packageJson.runningAutomatedTests;
  arch;
  constructor() {
    this.isWindows = process.platform === "win32";
    this.isMac = process.platform === "darwin";
    this.isLinux = process.platform === "linux";
    this.osReleaseVer = this.getWindowsReleaseVer();
    this.BuiltType = 0;
    this.BuildCode = packageProperties.BuildCode;
    this.winSettings = packageProperties.window || void 0;
    this.isLessThenWin81 = this.isWindows && this.CompareVersion(this.osReleaseVer, "6.3.9600");
    this.runningInstanceHandle = this.getRunningInstanceHandle();
    this.appversion = packageProperties.version;
    this.buildVersion = packageProperties.buildVersion;
    this.exportVersion = 1;
    this.DesktopDir = os.homedir();
    this.arch = this.getArch();
    this.#environmentLog = new EnvironmentLog(AppPaths.LogsFolder);
  }
  prepareEnvironment() {
    createAppFolders();
    this.#environmentLog.logToFile("env", "logToFile", `AppVersion:${this.appversion},${os.type()},${os.arch()},${process.platform},${this.osReleaseVer}`);
    if (this.BuildCode != 0)
      this.#environmentLog.logToFile("env", "logToFile", "-------------------Test Mode--------------------");
    this.#environmentLog.deleteLogs();
  }
  log = (ClassName, functionName, info) => this.#environmentLog.logToFile(ClassName, functionName, info);
  getPlatformIdentifier = () => this.privateGetPlatformIdentifier();
  DeleteLogFile = () => this.#environmentLog.privateDeleteLogFile();
  GetNumberHiLo = (num) => this.privateGetNumberHiLo(num);
  MergeHiLoToNumber = (hi, lo) => this.privateMergeHiLoToNumber(hi, lo);
  getArch() {
    if (this.isWindows) {
      return os.arch();
    }
    return process.platform;
  }
  getAppRoot() {
    return path$1.resolve(path$1.join(__dirname, "..", ".."));
  }
  getRunningInstanceHandle() {
    var handleName = "Glorious Core";
    if (process.platform === "win32") {
      return "\\\\.\\pipe\\" + handleName + "-" + os.userInfo().username + "-sock";
    }
    return path$1.join(os.tmpdir(), handleName + ".sock");
  }
  privateGetPlatformIdentifier() {
    if (process.platform === "linux") {
      return "linux-" + process.arch;
    }
    return process.platform;
  }
  getWindowsReleaseVer() {
    var strVer = os.release();
    if (this.isWindows && strVer == "6.2.9200") {
      var getVer = cp.execSync("ver.exe").toString("ascii").replace(/\0/g, "");
      var re = /\s[\d\.]+/i;
      if (re.test(getVer))
        strVer = re.exec(getVer)[0].replace(/(^\s*)|(\s*$)/g, "");
    }
    return strVer;
  }
  DeleteFolderRecursive(aPath, isDelRoot) {
    var files = [];
    if (fs.existsSync(aPath)) {
      files = fs.readdirSync(aPath);
      for (var file of files) {
        var curPath = path$1.join(aPath, file);
        if (fs.statSync(curPath).isDirectory()) {
          this.DeleteFolderRecursive(curPath, true);
        } else {
          fs.unlinkSync(curPath);
        }
      }
      if (isDelRoot)
        fs.rmdirSync(aPath);
    }
  }
  //转换数字为高低位
  privateGetNumberHiLo(num) {
    if (num >= 65536)
      num = num % 65536;
    var hex = Number(num).toString(16);
    hex = "0000".slice(0, 4 - hex.length) + hex;
    var ret = {};
    ret.Hi = parseInt(hex.slice(0, 2), 16);
    ret.Lo = parseInt(hex.slice(2, 4), 16);
    return ret;
  }
  //高低位合并为数字
  privateMergeHiLoToNumber(hi, lo) {
    var hex = Number(hi).toString(16);
    hex = "00".slice(0, 2 - hex.length) + hex;
    var hexLow = Number(lo).toString(16);
    hexLow = "00".slice(0, 2 - hexLow.length) + hexLow;
    hex = hex + hexLow;
    return parseInt(hex, 16);
  }
  IsNum(s) {
    if (s != null && s != "") {
      return !isNaN(s);
    }
    return false;
  }
  CompareVersion(oldVer, newVer) {
    if (this.IsNum(oldVer) && this.IsNum(newVer)) {
      return Number(oldVer) < Number(newVer);
    }
    var oldArr = oldVer.split(".");
    var newArr = newVer.split(".");
    var len = oldArr.length < newArr.length ? oldArr.length : newArr.length;
    var bResult = false;
    for (var i = 0; i < len; i++) {
      if (Number(oldArr[i]) !== Number(newArr[i])) {
        bResult = Number(oldArr[i]) < Number(newArr[i]);
        break;
      }
    }
    return bResult;
  }
}
const env = new EnvironmentSession();
env.prepareEnvironment();
const copyAppFile = (sourcePath, destinationPath) => {
  try {
    fs.copyFileSync(sourcePath, destinationPath);
    env.log("electron", "data", `File copied from ${sourcePath} to ${destinationPath}`);
  } catch (error) {
    env.log("electron", "error", `Error copying file from ${sourcePath} to ${destinationPath}: ${error}`);
  }
};
var DBNames = /* @__PURE__ */ ((DBNames2) => {
  DBNames2["SupportDevice"] = "SupportDevice";
  DBNames2["AppSettingDB"] = "AppSettingDB";
  DBNames2["PluginDB"] = "PluginDB";
  DBNames2["MacroDB"] = "MacroDB";
  DBNames2["DeviceDB"] = "DeviceDB";
  DBNames2["LayoutDB"] = "LayoutDB";
  DBNames2["SocialDB"] = "SocialDB";
  DBNames2["EQDB"] = "EQDB";
  return DBNames2;
})(DBNames || {});
var DBFiles = /* @__PURE__ */ ((DBFiles2) => {
  DBFiles2["SupportDevice"] = `SupportDevice.db`;
  DBFiles2["AppSettingDB"] = `AppSettingDB.db`;
  DBFiles2["PluginDB"] = `PluginDB.db`;
  DBFiles2["MacroDB"] = `MacroDB.db`;
  DBFiles2["DeviceDB"] = `DeviceDB.db`;
  DBFiles2["LayoutDB"] = `LayoutDB.db`;
  DBFiles2["SocialDB"] = `SocialDB.db`;
  DBFiles2["EQDB"] = `EQDB.db`;
  return DBFiles2;
})(DBFiles || {});
const copyDBResourceFile = (fileName, destinationPath) => {
  const sourceFile = getDBResourceFilePath(fileName);
  const destFile = path$1.join(destinationPath, fileName);
  copyAppFile(sourceFile, destFile);
};
const copyDBResourceFileContentInto = (fileName, destinationFilePath) => {
  copyAppFile(getDBResourceFilePath(fileName), destinationFilePath);
};
const copyDBResourceFileToDataFolder = (dbFileName) => {
  copyDBResourceFile(dbFileName, AppPaths.DataFolder);
};
const refreshSupportAndPluginsDB = () => {
  env.log("electron", "data", "Refreshing Support data");
  copyDBResourceFileToDataFolder(
    "SupportDevice.db"
    /* SupportDevice */
  );
  env.log("electron", "data", "Refreshing Plugin data");
  copyDBResourceFileToDataFolder(
    "PluginDB.db"
    /* PluginDB */
  );
};
const copyDBDataFileIfNotExists = (dbFile) => {
  if (fs.existsSync(getDataFilePath(dbFile))) {
    return false;
  }
  env.log("electron", "data", `No ${dbFile} found. Creating User ${dbFile}.`);
  copyDBResourceFileToDataFolder(dbFile);
  return true;
};
const LOCK_OPTS = { retries: 5, retryWait: 100 };
lockfile.unlockSync(DBNames.MacroDB);
lockfile.unlockSync(DBNames.DeviceDB);
lockfile.unlockSync(DBNames.AppSettingDB);
lockfile.unlockSync(DBNames.PluginDB);
function unlockDBFile(dbName) {
  return new Promise((resolve, reject) => {
    lockfile.unlock(getTempFilePath(dbName), (err) => {
      if (err)
        return reject(err);
      resolve();
    });
  });
}
function checkDBFileLock(dbName) {
  return new Promise((resolve, reject) => {
    lockfile.check(getTempFilePath(dbName), (err, isLocked) => {
      if (err) {
        const errorMessage = `checkDBFileLock: ${dbName} ${err}`;
        console.error(errorMessage);
        env.log(EnvironmentLogLevel.ERROR, errorMessage, err);
        reject(err);
      } else if (isLocked) {
        reject(new Error(`${dbName} database is locked`));
      } else {
        resolve();
      }
    });
  });
}
function lockDBFile(dbName) {
  return new Promise((resolve, reject) => {
    lockfile.lock(getTempFilePath(dbName), LOCK_OPTS, (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
}
async function handleErrorAndUnlock(dbName, logMessage, err) {
  env.log(EnvironmentLogLevel.ERROR, logMessage, err);
  try {
    return await unlockDBFile(dbName);
  } finally {
    throw err;
  }
}
const databases = {};
function setDB(dbName) {
  const filename = getDataFilePath(DBFiles[dbName]);
  env.log("DB", "getDB-dbPath:", filename);
  databases[dbName] = new DBstore({ filename, corruptAlertThreshold: 1 });
}
function handleError(dbName, logMessage, err) {
  env.log("DB", `${dbName} ${logMessage}`, err);
  console.error("DB Error", err, logMessage, dbName);
  throw err;
}
function getDB(dbName) {
  try {
    env.log("DB", "getDB-dbName:", dbName);
    if (!databases[dbName]) {
      setDB(dbName);
    }
    databases[dbName].loadDatabase();
    return databases[dbName];
  } catch (err) {
    handleError(dbName, "getDB", err);
  }
}
async function queryCmd(dbName, queryParameters) {
  try {
    await unlockDBFile(dbName);
    await checkDBFileLock(dbName);
    return new Promise((resolve, reject) => {
      const db = getDB(dbName);
      db.find(queryParameters, (er, docs) => {
        if (er)
          reject(er);
        else
          resolve(docs);
      });
    });
  } catch (err) {
    handleError(dbName, "queryCmdError", err);
  }
}
function getMax(dbName) {
  return new Promise((resolve, reject) => {
    getDB(dbName).find({}).sort({ value: -1 }).limit(1).exec((err, docs) => {
      const hasDocs = docs && docs.constructor === Array && docs.length > 0;
      if (err)
        reject(err);
      else if (hasDocs)
        resolve(docs[0].value);
      else
        resolve(1);
    });
  });
}
async function insertCmd(dbName, doc) {
  const db = getDB(dbName);
  try {
    await lockDBFile(dbName);
    const maxValue = await getMax(dbName);
    doc["value"] = doc["value"] ?? (maxValue ? maxValue + 1 : 1);
    const docs = await new Promise((resolve, reject) => {
      db.insert(doc, (er, docs2) => {
        if (er)
          reject(er);
        else
          resolve(docs2);
      });
    });
    db.persistence.compactDatafile();
    await unlockDBFile(dbName);
    return docs;
  } catch (err) {
    await handleErrorAndUnlock(dbName, "insertCmd", err);
  }
}
async function updateCmd(dbName, targetId, specifyField) {
  const db = getDB(dbName);
  delete specifyField._id;
  try {
    await lockDBFile(dbName);
    const numReplaced = await new Promise((resolve, reject) => {
      db.update(
        targetId,
        { $set: specifyField },
        { upsert: true, multi: true },
        (er, numReplaced2) => {
          if (er)
            reject(er);
          else
            resolve(numReplaced2);
        }
      );
    });
    db.persistence.compactDatafile();
    await unlockDBFile(dbName);
    await checkDBFileLock(dbName);
    return numReplaced;
  } catch (err) {
    await handleErrorAndUnlock(dbName, "updateCmd", err);
  }
}
async function deleteCmd(dbName, match) {
  const db = getDB(dbName);
  try {
    await lockDBFile(dbName);
    const numRemoved = await new Promise((resolve, reject) => {
      db.remove(match, { multi: true }, (er, numRemoved2) => {
        if (er)
          reject(er);
        else
          resolve(numRemoved2);
      });
    });
    db.persistence.compactDatafile();
    await unlockDBFile(dbName);
    return numRemoved;
  } catch (err) {
    await handleErrorAndUnlock(dbName, "deleteCmd", err);
  }
}
class AppSettingDB {
  /**
   * get appsetting data from AppsettingDB
   */
  getAppSetting() {
    return queryCmd(DBNames.AppSettingDB, {});
  }
  /**
   * save appsetting data to AppsettingDB
   * @param {*} obj
   */
  saveAppSetting(obj) {
    return updateCmd(DBNames.AppSettingDB, { "_id": "5Cyd2Zj4bnesrIGK" }, obj);
  }
}
class DeviceDB {
  /**
   * get data from SupportDeviceDB
   */
  getSupportDevice() {
    return queryCmd(DBNames.SupportDevice, {});
  }
  /**
   * get Default data from SupportDeviceDB
   * @param {*} vid
   * @param {*} pid
   */
  async getDefaultProfile(vid, pid) {
    const docs = await queryCmd(DBNames.SupportDevice, { vid, pid });
    return docs[0];
  }
  /**
   * get data from DeviceDB
   * @param {*} SN
   */
  async getDevice(SN) {
    const docs = await queryCmd(DBNames.DeviceDB, { SN });
    env.log(DBNames.DeviceDB, "getDevice", "queryCmd Done");
    return docs[0];
  }
  /**
   * get all data from DeviceDB
   */
  async getAllDevice() {
    const docs = await queryCmd(DBNames.DeviceDB, {});
    console.log("getAllDevice", docs);
    return docs;
  }
  /**
   * add data to DeviceDB
   * @param {*} obj
   */
  AddDevice(obj) {
    return insertCmd(DBNames.DeviceDB, obj);
  }
  /**
   * update data to device
   * @param {*} SN
   * @param {*} obj
   */
  updateDevice(SN, obj) {
    return updateCmd(DBNames.DeviceDB, { SN }, obj);
  }
}
class EQDB {
  getEQ() {
    return queryCmd(DBNames.EQDB, {});
  }
  insertEQ(obj) {
    return insertCmd(DBNames.EQDB, obj);
  }
  getEQById(value) {
    return queryCmd(DBNames.EQDB, { value });
  }
  updateEQ(value, obj) {
    return updateCmd(DBNames.EQDB, { value }, obj);
  }
  deleteEQ(value) {
    return deleteCmd(DBNames.EQDB, { value });
  }
}
class MacroDB {
  getMacro() {
    return queryCmd(DBNames.MacroDB, {});
  }
  insertMacro(obj) {
    return insertCmd(DBNames.MacroDB, obj);
  }
  getMacroById(value) {
    return queryCmd(DBNames.MacroDB, { value });
  }
  updateMacro(value, obj) {
    return updateCmd(DBNames.MacroDB, { value }, obj);
  }
  deleteMacro(value) {
    return deleteCmd(DBNames.MacroDB, { value });
  }
}
class PluginDB {
  async getPluginDevice() {
    const docs = await queryCmd(DBNames.PluginDB, {});
    console.log("PluginDB_getPluginDevice", docs);
    if (Array.isArray(docs) && docs.length > 0)
      return docs;
    return;
  }
  updatePluginDevice(obj) {
    return updateCmd(DBNames.PluginDB, { id: 1 }, obj);
  }
  async updateAllPluginDevice(obj) {
    const { Keyboard: Keyboard2, Mouse: Mouse2, valueE, MouseDock } = obj;
    return await updateCmd(DBNames.PluginDB, { id: 1 }, { Keyboard: Keyboard2, Mouse: Mouse2, valueE, MouseDock });
  }
}
class SocialDB {
  updateSocial(SocialId, SocialType, obj) {
    return updateCmd(DBNames.SocialDB, { SocialId, SocialType }, obj);
  }
  async getSocial(SocialId, SocialType) {
    const docs = await queryCmd(DBNames.SocialDB, { SocialId, SocialType });
    return docs[0];
  }
  getSocialType(SocialType) {
    return queryCmd(DBNames.SocialDB, { SocialType });
  }
  addSocial(obj) {
    return insertCmd(DBNames.SocialDB, obj);
  }
}
class AppDB {
  static #instance;
  DeviceDB;
  AppSettingDB;
  MacroDB;
  EQDB;
  PluginDB;
  SocialDB;
  constructor() {
    this.DeviceDB = new DeviceDB();
    this.AppSettingDB = new AppSettingDB();
    this.MacroDB = new MacroDB();
    this.EQDB = new EQDB();
    this.PluginDB = new PluginDB();
    this.SocialDB = new SocialDB();
  }
  static getInstance() {
    if (!this.#instance) {
      console.log("new AppDB Class");
      this.#instance = new AppDB();
    }
    return this.#instance;
  }
  //----------------------------Plugin--------------------------------//
  getPluginDevice() {
    return this.PluginDB.getPluginDevice();
  }
  updatePluginDevice(obj) {
    return this.PluginDB.updatePluginDevice(obj);
  }
  updateAllPluginDevice(obj) {
    return this.PluginDB.updateAllPluginDevice(obj);
  }
  //----------------------------AppSetting----------------------------//
  getAppSetting() {
    return this.AppSettingDB.getAppSetting();
  }
  saveAppSetting(obj) {
    return this.AppSettingDB.saveAppSetting(obj);
  }
  getSupportDevice() {
    return this.DeviceDB.getSupportDevice();
  }
  // setSupportDevice_defaultProfile_test(_id: any, obj: any): Promise<any> {
  //     console.log('setSupportDevice_defaultProfile_test', _id, obj);
  //     return updateCmd(DBNames.SupportDevice, { _id }, { defaultProfile: obj });
  // }
  getDefaultProfile(vid, pid) {
    return this.DeviceDB.getDefaultProfile(vid, pid);
  }
  getDevice(sn) {
    return this.DeviceDB.getDevice(sn);
  }
  AddDevice(obj) {
    return this.DeviceDB.AddDevice(obj);
  }
  getAllDevice() {
    return this.DeviceDB.getAllDevice();
  }
  updateDevice(_id, obj) {
    return this.DeviceDB.updateDevice(_id, obj);
  }
  //----------------------------Macro----------------------------//
  getMacro() {
    return this.MacroDB.getMacro();
  }
  getMacroById(id) {
    return this.MacroDB.getMacroById(id);
  }
  insertMacro(obj) {
    return this.MacroDB.insertMacro(obj);
  }
  DeleteMacro(index) {
    return this.MacroDB.deleteMacro(index);
  }
  updateMacro(id, obj) {
    return this.MacroDB.updateMacro(id, obj);
  }
  //----------------------------EQ----------------------------//
  getEQ() {
    return this.EQDB.getEQ();
  }
  getEQById(id) {
    return this.EQDB.getEQById(id);
  }
  insertEQ(obj) {
    return this.EQDB.insertEQ(obj);
  }
  DeleteEQ(index) {
    return this.EQDB.deleteEQ(index);
  }
  updateEQ(id, obj) {
    return this.EQDB.updateEQ(id, obj);
  }
  //----------------------------Layout----------------------------//
  getLayout() {
    return queryCmd(DBNames.LayoutDB, {});
  }
  getLayoutAssignField(compareData) {
    return queryCmd(DBNames.LayoutDB, compareData);
  }
  updateLayoutAlldata(compareData, obj) {
    return updateCmd(DBNames.LayoutDB, compareData, { "AllData": obj });
  }
  //----------------------------Social----------------------------//
  updateSocial(SocialId, SocialType, obj) {
  }
  getSocial(SocialId, SocialType) {
    return this.SocialDB.getSocial(SocialId, SocialType);
  }
  getSocialType(SocialType) {
    return this.SocialDB.getSocialType(SocialType);
  }
  AddSocial(obj) {
    return this.SocialDB.addSocial(obj);
  }
}
const audioSessionLibUrl = path.join(__dirname, "./chunks/AudioSession-626e3e71.node");
const hidLibUrl = path.join(__dirname, "./chunks/hiddevice-d25d1485.node");
const launchWinSocketLibUrl = path.join(__dirname, "./chunks/LaunchWinSocket-0531fb28.node");
const gloriousMOISDKLibUrl = path.join(__dirname, "./chunks/GloriousMOISDK-f57d5c7b.node");
const require$1 = module$1.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("index.js", document.baseURI).href);
const AudioSessionLib = require$1(audioSessionLibUrl);
const HidLib = require$1(hidLibUrl);
const LaunchWinSocketLib = require$1(launchWinSocketLibUrl);
const GloriousMOISDKLib = require$1(gloriousMOISDKLibUrl);
class HID {
  static #instance;
  hid = HidLib;
  constructor() {
    if (this.hid === void 0) {
      throw new Error("Hid not init");
    }
  }
  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    } else {
      console.log("new HID Class");
      this.#instance = new HID();
      return this.#instance;
    }
  }
  FindDevice(usagepage, usage, vid, pid) {
    return this.hid.FindDevice(parseInt(usagepage), parseInt(usage), parseInt(vid), parseInt(pid));
  }
  DeviceDataCallback(usagepage, usage, vid, pid) {
    return this.hid.DeviceDataCallback(parseInt(usagepage), parseInt(usage), parseInt(vid), parseInt(pid));
  }
  SetDeviceCallbackFunc(EP3Func) {
    return this.hid.SetDeviceCallbackFunc(EP3Func);
  }
  SetFeatureReport(DeviceId, ReportID, Length, buf) {
    return this.hid.SetFeatureReport(DeviceId, ReportID, Length, buf);
  }
  GetFeatureReport(DeviceId, ReportID, Length) {
    return this.hid.GetFeatureReport(DeviceId, ReportID, Length);
  }
  GetFWVersion(DeviceId) {
    return this.hid.GetFWVersion(DeviceId);
  }
  SetHidWrite(DeviceId, ReportID, Length, buf) {
    return this.hid.SetHidWrite(DeviceId, ReportID, Length, buf);
  }
  GetEPTempData(DeviceId) {
    return this.hid.GetEPTempData(DeviceId);
  }
  ExecuteHIDRead(DeviceId, bufferLength, timeout) {
    return this.hid.ExecuteHIDRead(DeviceId, bufferLength, timeout);
  }
  SetupHIDReadThread(start, DeviceId = 0, bufferLength = 0, callback = {}) {
    return this.hid.SetupHIDReadThread(start, DeviceId, bufferLength, callback);
  }
}
class FuncAudioSession {
  static #instance;
  AudioSession = AudioSessionLib;
  constructor() {
    if (this.AudioSession === void 0)
      throw new Error("AudioSession not init");
  }
  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    } else {
      console.log("new FuncAudioSession Class");
      this.#instance = new FuncAudioSession();
      return this.#instance;
    }
  }
  OnTimerGetAudioSession() {
    this.AudioSession.GetAudioSession();
  }
  Initialization() {
    return this.AudioSession.Initialization();
  }
  GetSystemAudioSession() {
    return this.AudioSession.GetAudioSession();
  }
  GetAudioSession() {
    return this.AudioSession.GetAudioSession();
  }
  SetAudioSession(ObjAudioSession) {
    return this.AudioSession.SetAudioSession(ObjAudioSession);
  }
  SetSpeakerValue(iSpeakerValue) {
    return this.AudioSession.SetSpeakerValue(iSpeakerValue);
  }
  SpeakerUp(iValue) {
    return this.AudioSession.SpeakerUp(iValue);
  }
  SpeakerDown(iValue) {
    return this.AudioSession.SpeakerDown(iValue);
  }
  //region MicrophoneValue
  SetMicrophoneValue(iSpeakerValue) {
    return this.AudioSession.SetMicrophoneValue(iSpeakerValue);
  }
  MicrophoneUp(iValue) {
    return this.AudioSession.MicrophoneUp(iValue);
  }
  MicrophoneDown(iValue) {
    return this.AudioSession.MicrophoneDown(iValue);
  }
  //endregion MicrophoneValue  
  //region AudioDevice
  SetNextAudioDeviceDefault() {
    return this.AudioSession.SetNextAudioDeviceDefault();
  }
  SetPreviousAudioDeviceDefault() {
    return this.AudioSession.SetPreviousAudioDeviceDefault();
  }
  //endregion AudioDevice
  // TimerAudioSession(ObjTimer) {
  //     if (this.m_TimerGetAudioSession  != undefined) {
  //         clearInterval(this.m_TimerGetAudioSession);
  //     }
  //     if (ObjTimer) {
  //         this.m_TimerGetAudioSession = setInterval(() => this.OnTimerGetAudioSession(), 10000);
  //     }
  // }
}
const EventTypes = {
  Error: "Error",
  HotPlug: "HotPlug",
  ProtocolMessage: "ProtocolMessage",
  DownloadProgress: "DownloadProgress",
  UpdateApp: "UpdateApp",
  UpdateFW: "UpdateFW",
  ChangeWindowSize: "ChangeWindowSize",
  ShowWindow: "ShowWindow",
  HIDEP2Data: "HIDEP2Data",
  KeyDataCallback: "KeyDataCallback",
  QuitApp: "QuitApp",
  RefreshDevice: "RefreshDevice",
  SwitchProfile: "SwitchProfile",
  ImportProfile: "ImportProfile",
  DownloadFileError: "DownloadFileError",
  //Battery
  GetBatteryStats: "GetBatteryStats",
  SwitchUIProfile: "SwitchUIProfile",
  SwitchLighting: "SwitchLighting",
  SwitchMultiColor: "SwitchMultiColor",
  SwitchSliderVolume: "SwitchSliderVolume",
  //FWUpdate
  SendFWUPDATE: "SendFWUPDATE",
  SwitchHotPlug: "SwitchHotPlug",
  HideApp: "HideApp",
  MaxSize: "MaxSize",
  //Audio Session
  GetAudioSession: "GetAudioSession",
  //Dock
  DockedCharging: "DockedCharging",
  DeleteMacro: "DeleteMacro",
  // 2.0
  SavedDevice: "SavedDevice",
  // Authentication events
  UserLoggedIn: "UserLogin",
  // valueC
  valueCVisualizationUpdate: "valueCVisualizationUpdate"
};
const FuncName = {
  ExecFile: "ExecFile",
  downloadFile: "downloadFile",
  //Init Device
  InitDevice: "InitDevice",
  ChangeProfileID: "ChangeProfileID",
  //Check AppVersion & download
  UpdateApp: "UpdateApp",
  //upzip AppUpdate File
  DownloadInstallPackage: "DownloadInstallPackage",
  UpdateFW: "UpdateFW",
  DownloadFWInstallPackage: "DownloadFWInstallPackage",
  ChangeWindowSize: "ChangeWindowSize",
  ShowWindow: "ShowWindow",
  RunApplication: "RunApplication",
  ImportProfile: "ImportProfile",
  QuitApp: "QuitApp",
  GetBatteryStats: "GetBatteryStats",
  ReadFWVersion: "ReadFWVersion",
  HideApp: "HideApp",
  MaxSize: "MaxSize",
  //Glorious
  setProfileToDevice: "setProfileToDevice",
  SetKeyMatrix: "SetKeyMatrix",
  SetLighting: "SetLighting",
  SleepTime: "SleepTime",
  LaunchFWUpdate: "LaunchFWUpdate",
  DeleteMacro: "DeleteMacro",
  GetAudioSession: "GetAudioSession",
  valueCVisualizationToggle: "SetVisualization",
  ResetDevice: "ResetDevice",
  ApplyLEDEffect: "ApplyLEDEffect",
  SetLEDEffect: "SetLEDEffect",
  GetProfileID: "GetProfileID"
};
const FuncType = {
  System: 1,
  Mouse: 2,
  Keyboard: 3,
  Device: 4,
  valueE: 5
};
const FakeDevice = [
  {
    vid: ["0x320F", "0x093a", "0x320F"],
    pid: ["0x5088", "0x2860", "0xB00D"],
    devicename: "GMMK Numpad",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x5044", "0xB007"],
    devicename: "GMMK PRO",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x5046", "0xB009"],
    devicename: "GMMK PRO",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x5093", "0xB010"],
    devicename: "GMMK PRO",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x5092", "0xB00F"],
    devicename: "GMMK PRO",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x504A", "0xB00A"],
    devicename: "GMMK 2 Compact TKL 65%",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x5045", "0xB008"],
    devicename: "GMMK 2 Compact TKL 65%",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x505A", "0xB00C"],
    devicename: "GMMK 2 Full Size 96%",
    StateID: 0
  },
  {
    vid: ["0x320F", "0x320F"],
    pid: ["0x504B", "0xB00B"],
    devicename: "GMMK 2 Full Size 96%",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2014", "0x2025"],
    devicename: "MODEL D- WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2013", "0x2024"],
    devicename: "MODEL O- WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2011", "0x2022"],
    devicename: "MODEL O WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x258A"],
    pid: ["0x2036"],
    devicename: "MODEL O-",
    StateID: 0
  },
  {
    vid: ["0x22D4"],
    pid: ["0x1503"],
    devicename: "MODEL I",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2012", "0x2023"],
    devicename: "MODEL D WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x320F"],
    pid: ["0x8888"],
    devicename: "MODEL O",
    StateID: 0
  },
  {
    vid: ["0x342D"],
    pid: ["0xE391"],
    devicename: "Wireless Dock",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2015", "0x2027"],
    devicename: "MODEL O PRO WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2017", "0x2029"],
    devicename: "MODEL D PRO WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x093A", "0x093A", "0x093A"],
    pid: ["0x822A", "0x822D", "0x822B"],
    devicename: "Model O 2 Wireless",
    StateID: 0
  },
  {
    vid: ["0x320F"],
    pid: ["0x823A"],
    devicename: "Model O 2 Wired",
    StateID: 0
  },
  {
    vid: ["0x258A", "0x258A"],
    pid: ["0x2018", "0x2031"],
    devicename: "SERIES ONE PRO WIRELESS",
    StateID: 0
  },
  {
    vid: ["0x093A", "0x093A", "0x093A"],
    pid: ["0x821A", "0x821D", "0x821B"],
    devicename: "Model I 2 Wireless",
    StateID: 0
  },
  {
    vid: ["0x0bda"],
    pid: ["0x8773"],
    devicename: "Glorious Wireless valueE",
    StateID: 0
  }
];
const KeyMapping = [
  { "keyCode": "65", "functionType": "Singlekey", "value": "A", "hid": 4, "translate": "A", "code": "KeyA" },
  { "keyCode": "66", "functionType": "Singlekey", "value": "B", "hid": 5, "translate": "B", "code": "KeyB" },
  { "keyCode": "67", "functionType": "Singlekey", "value": "C", "hid": 6, "translate": "C", "code": "KeyC" },
  { "keyCode": "68", "functionType": "Singlekey", "value": "D", "hid": 7, "translate": "D", "code": "KeyD" },
  { "keyCode": "69", "functionType": "Singlekey", "value": "E", "hid": 8, "translate": "E", "code": "KeyE" },
  { "keyCode": "70", "functionType": "Singlekey", "value": "F", "hid": 9, "translate": "F", "code": "KeyF" },
  { "keyCode": "71", "functionType": "Singlekey", "value": "G", "hid": 10, "translate": "G", "code": "KeyG" },
  { "keyCode": "72", "functionType": "Singlekey", "value": "H", "hid": 11, "translate": "H", "code": "KeyH" },
  { "keyCode": "73", "functionType": "Singlekey", "value": "I", "hid": 12, "translate": "I", "code": "KeyI" },
  { "keyCode": "74", "functionType": "Singlekey", "value": "J", "hid": 13, "translate": "J", "code": "KeyJ" },
  { "keyCode": "75", "functionType": "Singlekey", "value": "K", "hid": 14, "translate": "K", "code": "KeyK" },
  { "keyCode": "76", "functionType": "Singlekey", "value": "L", "hid": 15, "translate": "L", "code": "KeyL" },
  { "keyCode": "77", "functionType": "Singlekey", "value": "M", "hid": 16, "translate": "M", "code": "KeyM" },
  { "keyCode": "78", "functionType": "Singlekey", "value": "N", "hid": 17, "translate": "N", "code": "KeyN" },
  { "keyCode": "79", "functionType": "Singlekey", "value": "O", "hid": 18, "translate": "O", "code": "KeyO" },
  { "keyCode": "80", "functionType": "Singlekey", "value": "P", "hid": 19, "translate": "P", "code": "KeyP" },
  { "keyCode": "81", "functionType": "Singlekey", "value": "Q", "hid": 20, "translate": "Q", "code": "KeyQ" },
  { "keyCode": "82", "functionType": "Singlekey", "value": "R", "hid": 21, "translate": "R", "code": "KeyR" },
  { "keyCode": "83", "functionType": "Singlekey", "value": "S", "hid": 22, "translate": "S", "code": "KeyS" },
  { "keyCode": "84", "functionType": "Singlekey", "value": "T", "hid": 23, "translate": "T", "code": "KeyT" },
  { "keyCode": "85", "functionType": "Singlekey", "value": "U", "hid": 24, "translate": "U", "code": "KeyU" },
  { "keyCode": "86", "functionType": "Singlekey", "value": "V", "hid": 25, "translate": "V", "code": "KeyV" },
  { "keyCode": "87", "functionType": "Singlekey", "value": "W", "hid": 26, "translate": "W", "code": "KeyW" },
  { "keyCode": "88", "functionType": "Singlekey", "value": "X", "hid": 27, "translate": "X", "code": "KeyX" },
  { "keyCode": "89", "functionType": "Singlekey", "value": "Y", "hid": 28, "translate": "Y", "code": "KeyY" },
  { "keyCode": "90", "functionType": "Singlekey", "value": "Z", "hid": 29, "translate": "Z", "code": "KeyZ" },
  { "keyCode": "48", "functionType": "Singlekey", "value": "0", "hid": 39, "translate": "0", "code": "Digit0" },
  { "keyCode": "49", "functionType": "Singlekey", "value": "1", "hid": 30, "translate": "1", "code": "Digit1" },
  { "keyCode": "50", "functionType": "Singlekey", "value": "2", "hid": 31, "translate": "2", "code": "Digit2" },
  { "keyCode": "51", "functionType": "Singlekey", "value": "3", "hid": 32, "translate": "3", "code": "Digit3" },
  { "keyCode": "52", "functionType": "Singlekey", "value": "4", "hid": 33, "translate": "4", "code": "Digit4" },
  { "keyCode": "53", "functionType": "Singlekey", "value": "5", "hid": 34, "translate": "5", "code": "Digit5" },
  { "keyCode": "54", "functionType": "Singlekey", "value": "6", "hid": 35, "translate": "6", "code": "Digit6" },
  { "keyCode": "55", "functionType": "Singlekey", "value": "7", "hid": 36, "translate": "7", "code": "Digit7" },
  { "keyCode": "56", "functionType": "Singlekey", "value": "8", "hid": 37, "translate": "8", "code": "Digit8" },
  { "keyCode": "57", "functionType": "Singlekey", "value": "9", "hid": 38, "translate": "9", "code": "Digit9" },
  { "keyCode": "8", "functionType": "Singlekey", "value": "Backspace", "hid": 42, "translate": "Backspace", "code": "Backspace" },
  { "keyCode": "9", "functionType": "Singlekey", "value": "Tab", "hid": 43, "translate": "Tab", "code": "Tab" },
  { "keyCode": "144", "functionType": "Singlekey", "value": "Num Lock", "hid": 83, "translate": "Num Lock", "code": "NumLock" },
  { "keyCode": "13", "functionType": "Singlekey", "value": "Enter", "hid": 40, "translate": "Enter", "code": "Enter" },
  { "keyCode": "16", "functionType": "Singlekey", "value": "Shift", "hid": 225, "Modifier": 2, "translate": "Shift", "code": "ShiftRight" },
  { "keyCode": "16", "functionType": "Singlekey", "value": "Shift", "hid": 225, "Modifier": 0, "translate": "Shift", "code": "ShiftLeft" },
  { "keyCode": "17", "functionType": "Singlekey", "value": "Ctrl", "hid": 224, "Modifier": 1, "translate": "Ctrl", "code": "ControlLeft" },
  { "keyCode": "18", "functionType": "Singlekey", "value": "Alt", "hid": 226, "Modifier": 4, "translate": "Alt", "code": "AltLeft" },
  { "keyCode": "19", "functionType": "Singlekey", "value": "Break", "hid": 72, "translate": "Break", "code": "Pause" },
  { "keyCode": "20", "functionType": "Singlekey", "value": "CapsLock", "hid": 57, "translate": "CapsLock", "code": "CapsLock" },
  { "keyCode": "27", "functionType": "Singlekey", "value": "Esc", "hid": 41, "translate": "Esc", "code": "Escape" },
  { "keyCode": "32", "functionType": "Singlekey", "value": "Space", "hid": 44, "translate": "Space", "code": "Space" },
  { "keyCode": "33", "functionType": "Singlekey", "value": "PageUp", "hid": 75, "translate": "PageUp", "code": "PageUp" },
  { "keyCode": "34", "functionType": "Singlekey", "value": "PageDown", "hid": 78, "translate": "PageDown", "code": "PageDown" },
  { "keyCode": "35", "functionType": "Singlekey", "value": "End", "hid": 77, "translate": "End", "code": "End" },
  { "keyCode": "36", "functionType": "Singlekey", "value": "Home", "hid": 74, "translate": "Home", "code": "Home" },
  { "keyCode": "37", "functionType": "Singlekey", "value": "Left", "hid": 80, "translate": "Left", "code": "ArrowLeft" },
  { "keyCode": "38", "functionType": "Singlekey", "value": "Up", "hid": 82, "translate": "Up", "code": "ArrowUp" },
  { "keyCode": "39", "functionType": "Singlekey", "value": "Right", "hid": 79, "translate": "Right", "code": "ArrowRight" },
  { "keyCode": "40", "functionType": "Singlekey", "value": "Down", "hid": 81, "translate": "Down", "code": "ArrowDown" },
  { "keyCode": "44", "functionType": "Singlekey", "value": "PrintScreen", "hid": "0x46", "translate": "PrintScreen", "code": "PrintScreen" },
  { "keyCode": "45", "functionType": "Singlekey", "value": "Insert", "hid": 73, "translate": "Insert", "code": "Insert" },
  { "keyCode": "46", "functionType": "Singlekey", "value": "Delete", "hid": 76, "translate": "Delete", "code": "Delete" },
  { "keyCode": "91", "functionType": "Singlekey", "value": "Left Win", "hid": 227, "Modifier": 8, "translate": "Left Win", "code": "MetaLeft" },
  { "keyCode": "92", "functionType": "Singlekey", "value": "Right Win", "hid": 231, "Modifier": 128, "translate": "Right Win", "code": "MetaRight" },
  { "keyCode": "93", "functionType": "Singlekey", "value": "Menu", "hid": 101, "translate": "Menu", "code": "ContextMenu" },
  { "keyCode": "106", "functionType": "Singlekey", "value": "*", "hid": 85, "translate": "Num *", "code": "NumpadMultiply" },
  { "keyCode": "107", "functionType": "Singlekey", "value": "+", "hid": 87, "translate": "Num +", "code": "NumpadAdd" },
  { "keyCode": "109", "functionType": "Singlekey", "value": "-", "hid": 86, "translate": "Num -", "code": "NumpadSubtract" },
  { "keyCode": "110", "functionType": "Singlekey", "value": ".", "hid": 99, "translate": ".", "code": "NumpadDecimal" },
  { "keyCode": "111", "functionType": "Singlekey", "value": "/", "hid": 84, "translate": "Num /", "code": "NumpadDivide" },
  { "keyCode": "112", "functionType": "Singlekey", "value": "F1", "hid": 58, "translate": "F1", "code": "F1" },
  { "keyCode": "113", "functionType": "Singlekey", "value": "F2", "hid": 59, "translate": "F2", "code": "F2" },
  { "keyCode": "114", "functionType": "Singlekey", "value": "F3", "hid": 60, "translate": "F3", "code": "F3" },
  { "keyCode": "115", "functionType": "Singlekey", "value": "F4", "hid": 61, "translate": "F4", "code": "F4" },
  { "keyCode": "116", "functionType": "Singlekey", "value": "F5", "hid": 62, "translate": "F5", "code": "F5" },
  { "keyCode": "117", "functionType": "Singlekey", "value": "F6", "hid": 63, "translate": "F6", "code": "F6" },
  { "keyCode": "118", "functionType": "Singlekey", "value": "F7", "hid": 64, "translate": "F7", "code": "F7" },
  { "keyCode": "119", "functionType": "Singlekey", "value": "F8", "hid": 65, "translate": "F8", "code": "F8" },
  { "keyCode": "120", "functionType": "Singlekey", "value": "F9", "hid": 66, "translate": "F9", "code": "F9" },
  { "keyCode": "121", "functionType": "Singlekey", "value": "F10", "hid": 67, "translate": "F10", "code": "F10" },
  { "keyCode": "122", "functionType": "Singlekey", "value": "F11", "hid": 68, "translate": "F11", "code": "F11" },
  { "keyCode": "123", "functionType": "Singlekey", "value": "F12", "hid": 69, "translate": "F12", "code": "F12" },
  { "keyCode": "145", "functionType": "Singlekey", "value": "Scroll Lock", "hid": 71, "translate": "Scroll Lock", "code": "ScrollLock" },
  { "keyCode": "96", "functionType": "Singlekey", "value": "Numpad0", "hid": 98, "translate": "Numpad0", "code": "Numpad0" },
  { "keyCode": "97", "functionType": "Singlekey", "value": "Numpad1", "hid": 89, "translate": "Numpad1", "code": "Numpad1" },
  { "keyCode": "98", "functionType": "Singlekey", "value": "Numpad2", "hid": 90, "translate": "Numpad2", "code": "Numpad2" },
  { "keyCode": "99", "functionType": "Singlekey", "value": "Numpad3", "hid": 91, "translate": "Numpad3", "code": "Numpad3" },
  { "keyCode": "100", "functionType": "Singlekey", "value": "Numpad4", "hid": 92, "translate": "Numpad4", "code": "Numpad4" },
  { "keyCode": "101", "functionType": "Singlekey", "value": "Numpad5", "hid": 93, "translate": "Numpad5", "code": "Numpad5" },
  { "keyCode": "102", "functionType": "Singlekey", "value": "Numpad6", "hid": 94, "translate": "Numpad6", "code": "Numpad6" },
  { "keyCode": "103", "functionType": "Singlekey", "value": "Numpad7", "hid": 95, "translate": "Numpad7", "code": "Numpad7" },
  { "keyCode": "104", "functionType": "Singlekey", "value": "Numpad8", "hid": 96, "translate": "Numpad8", "code": "Numpad8" },
  { "keyCode": "105", "functionType": "Singlekey", "value": "Numpad9", "hid": 97, "translate": "Numpad9", "code": "Numpad9" },
  { "keyCode": "13", "functionType": "Singlekey", "value": "NumpadEnter", "hid": 88, "translate": "NumpadEnter", "code": "NumpadEnter" },
  { "keyCode": "186", "functionType": "Singlekey", "value": ";", "hid": 51, "translate": ";", "code": "Semicolon" },
  { "keyCode": "187", "functionType": "Singlekey", "value": "=", "hid": 46, "translate": "=", "code": "Equal" },
  { "keyCode": "188", "functionType": "Singlekey", "value": ",", "hid": 54, "translate": ",", "code": "Comma" },
  { "keyCode": "189", "functionType": "Singlekey", "value": "-", "hid": 45, "translate": "-", "code": "Minus" },
  { "keyCode": "190", "functionType": "Singlekey", "value": "dot", "hid": 55, "translate": "dot", "code": "Period" },
  { "keyCode": "191", "functionType": "Singlekey", "value": "/", "hid": 56, "translate": "/", "code": "Slash" },
  { "keyCode": "192", "functionType": "Singlekey", "value": "~", "hid": 53, "translate": "~", "code": "Backquote" },
  { "keyCode": "219", "functionType": "Singlekey", "value": "[", "hid": 47, "translate": "[", "code": "BracketLeft" },
  { "keyCode": "220", "functionType": "Singlekey", "value": "|", "hid": 49, "translate": "|", "code": "Backslash" },
  { "keyCode": "221", "functionType": "Singlekey", "value": "]", "hid": 48, "translate": "]", "code": "BracketRight" },
  { "keyCode": "222", "functionType": "Singlekey", "value": "'", "hid": 52, "translate": "'", "code": "Quote" },
  { "keyCode": "ScrollWheel", "functionType": "SingleKey", "value": "Volume", "hid": 1922, "translate": "ROTARY ENCODER", "code": "ROTARY ENCODER" }
];
const MediaMapping = [
  { keyCode: "1", value: "None", "hid": 4, hidMap: [0, 0], translate: "" },
  { keyCode: "1", value: "Media Player", "hid": 4, hidMap: [1, 131], translate: "" },
  { keyCode: "1", value: "Play/Pause", "hid": 4, hidMap: [0, 205], translate: "" },
  { keyCode: "1", value: "Next", "hid": 4, hidMap: [0, 181], translate: "" },
  { keyCode: "1", value: "Previous", "hid": 4, hidMap: [0, 182], translate: "" },
  { keyCode: "1", value: "Stop", "hid": 4, hidMap: [0, 183], translate: "" },
  { keyCode: "1", value: "Mute", "hid": 4, hidMap: [0, 226], translate: "" },
  { keyCode: "1", value: "Volume up", "hid": 4, hidMap: [0, 233], translate: "" },
  { keyCode: "1", value: "Volume down", "hid": 4, hidMap: [0, 234], translate: "" },
  { keyCode: "1", value: "Next track", "hid": 4, hidMap: [0, 181], translate: "" },
  { keyCode: "1", value: "Previous track", "hid": 4, hidMap: [0, 182], translate: "" }
];
const WindowsMapping = [
  { keyCode: "1", value: "None", "hid": 4, hidMap: [0, 0], translate: "" },
  { keyCode: "1", value: "Email", "hid": 4, hidMap: [1, 138], translate: "" },
  { keyCode: "1", value: "Calculator", "hid": 4, hidMap: [1, 146], translate: "" },
  { keyCode: "1", value: "My Computer", "hid": 4, hidMap: [1, 148], translate: "" },
  { keyCode: "1", value: "Explorer", "hid": 4, hidMap: [1, 148], translate: "" },
  { keyCode: "1", value: "WWW Home", "hid": 4, hidMap: [2, 35], translate: "" },
  { keyCode: "1", value: "WWW Refresh", "hid": 4, hidMap: [2, 39], translate: "" },
  { keyCode: "1", value: "WWW Stop", "hid": 4, hidMap: [2, 38], translate: "" },
  { keyCode: "1", value: "WWW Back", "hid": 4, hidMap: [2, 36], translate: "" },
  { keyCode: "1", value: "WWW Forward", "hid": 4, hidMap: [2, 37], translate: "" },
  { keyCode: "1", value: "WWW Search", "hid": 4, hidMap: [2, 33], translate: "" }
];
const Shortcuts_WindowsMapping = [
  { "keyCode": "Shortcuts_Fun_25", "functionType": "Shortcuts", "value": "Email", "hid": 17, "translate": "Email", "code": "Shortcuts_Fun_25" },
  { "keyCode": "Shortcuts_Fun_26", "functionType": "Shortcuts", "value": "Calculator", "hid": 16, "translate": "Calculator", "code": "Shortcuts_Fun_26" },
  { "keyCode": "Shortcuts_Fun_27", "functionType": "Shortcuts", "value": "My Computer", "hid": 15, "translate": "My Computer", "code": "Shortcuts_Fun_27" },
  { "keyCode": "Shortcuts_Fun_28", "functionType": "Shortcuts", "value": "Explorer", "hid": 15, "translate": "Explorer", "code": "Shortcuts_Fun_28" },
  { "keyCode": "Shortcuts_Fun_29", "functionType": "Shortcuts", "value": "WWW Home", "hid": 8, "translate": "WWW Home", "code": "Shortcuts_Fun_29" },
  { "keyCode": "Shortcuts_Fun_30", "functionType": "Shortcuts", "value": "WWW Refresh", "hid": 9, "translate": "WWW Refresh", "code": "Shortcuts_Fun_30" },
  { "keyCode": "Shortcuts_Fun_31", "functionType": "Shortcuts", "value": "WWW Stop", "hid": 10, "translate": "WWW Stop", "code": "Shortcuts_Fun_31" },
  { "keyCode": "Shortcuts_Fun_32", "functionType": "Shortcuts", "value": "WWW Back", "hid": 11, "translate": "WWW Back", "code": "Shortcuts_Fun_32" },
  { "keyCode": "Shortcuts_Fun_33", "functionType": "Shortcuts", "value": "WWW Forward", "hid": 12, "translate": "WWW Forward", "code": "Shortcuts_Fun_33" },
  { "keyCode": "Shortcuts_Fun_34", "functionType": "Shortcuts", "value": "WWW Search", "hid": 14, "translate": "WWW Search", "code": "Shortcuts_Fun_34" }
];
const SupportLanguage = [
  { name: "ENGLISH", value: "en" }
  // {name:'繁體中文', value:"tw"},
  // {name:'简体中文', value:"cn"}
];
const AllFunctionMapping = [
  { "keyCode": "Multimedia_Fun_0", "functionType": "Multimedia", "value": "Media Player", "hid": 0, "translate": "Media Player", "code": "Multimedia_Fun_0" },
  { "keyCode": "Multimedia_Fun_1", "functionType": "Multimedia", "value": "Play/Pause", "hid": 1, "translate": "Play/Pause", "code": "Multimedia_Fun_1" },
  { "keyCode": "Multimedia_Fun_2", "functionType": "Multimedia", "value": "Next", "hid": 7, "translate": "Next", "code": "Multimedia_Fun_2" },
  { "keyCode": "Multimedia_Fun_3", "functionType": "Multimedia", "value": "Previous", "hid": 6, "translate": "Previous", "code": "Multimedia_Fun_3" },
  { "keyCode": "Multimedia_Fun_4", "functionType": "Multimedia", "value": "Stop", "hid": 5, "translate": "Stop", "code": "Multimedia_Fun_4" },
  { "keyCode": "Multimedia_Fun_5", "functionType": "Multimedia", "value": "Mute", "hid": 2, "translate": "Mute", "code": "Multimedia_Fun_5" },
  { "keyCode": "Multimedia_Fun_6", "functionType": "Multimedia", "value": "Volume up", "hid": 3, "translate": "Volume up", "code": "Multimedia_Fun_6" },
  { "keyCode": "Multimedia_Fun_7", "functionType": "Multimedia", "value": "Volume down", "hid": 4, "translate": "Volume down", "code": "Multimedia_Fun_7" },
  { "keyCode": "Multimedia_Fun_8", "functionType": "Multimedia", "value": "Next track", "hid": 7, "translate": "Next track", "code": "Multimedia_Fun_8" },
  { "keyCode": "Multimedia_Fun_9", "functionType": "Multimedia", "value": "Previous track", "hid": 6, "translate": "Previoustrack", "code": "Multimedia_Fun_9" },
  { "keyCode": "KEYBOARD_Fun_10", "functionType": "KEYBOARD", "value": "Profilecycleup", "hid": 2, "translate": "Profilecycleup", "code": "KEYBOARD_Fun_10" },
  { "keyCode": "KEYBOARD_Fun_11", "functionType": "KEYBOARD", "value": "Profilecycledown", "hid": 1, "translate": "Profilecycledown", "code": "KEYBOARD_Fun_11" },
  { "keyCode": "KEYBOARD_Fun_12", "functionType": "KEYBOARD", "value": "Layercycleup", "hid": 4, "translate": "Layercycleup", "code": "KEYBOARD_Fun_12" },
  { "keyCode": "KEYBOARD_Fun_13", "functionType": "KEYBOARD", "value": "Layercycledown", "hid": 3, "translate": "Layercycledown", "code": "KEYBOARD_Fun_13" },
  { "keyCode": "mouse_left", "functionType": "MOUSE", "value": "Leftbutton", "hid": 1, "translate": "Leftbutton", "code": "mouse_left" },
  { "keyCode": "mouse_right", "functionType": "MOUSE", "value": "Rightbutton", "hid": 2, "translate": "Rightbutton", "code": "mouse_right" },
  { "keyCode": "mouse_middle", "functionType": "MOUSE", "value": "Middlebutton", "hid": 3, "translate": "Middlebutton", "code": "mouse_middle" },
  { "keyCode": "mouse_forward", "functionType": "MOUSE", "value": "Forward", "hid": 5, "translate": "Forward", "code": "mouse_forward" },
  { "keyCode": "mouse_back", "functionType": "MOUSE", "value": "Back", "hid": 4, "translate": "Back", "code": "mouse_back" },
  { "keyCode": "MOUSE_Fun_14", "functionType": "MOUSE", "value": "Leftbutton", "hid": 1, "translate": "Leftbutton", "code": "MOUSE_Fun_14" },
  { "keyCode": "MOUSE_Fun_15", "functionType": "MOUSE", "value": "Rightbutton", "hid": 2, "translate": "Rightbutton", "code": "MOUSE_Fun_15" },
  { "keyCode": "MOUSE_Fun_16", "functionType": "MOUSE", "value": "Middlebutton", "hid": 3, "translate": "Middlebutton", "code": "MOUSE_Fun_16" },
  { "keyCode": "MOUSE_Fun_17", "functionType": "MOUSE", "value": "Forward", "hid": 5, "translate": "Forward", "code": "MOUSE_Fun_17" },
  { "keyCode": "MOUSE_Fun_18", "functionType": "MOUSE", "value": "Back", "hid": 4, "translate": "Back", "code": "MOUSE_Fun_18" },
  { "keyCode": "MOUSE_Fun_19", "functionType": "MOUSE", "value": "Scrollup", "hid": 6, "translate": "Scrollup", "code": "MOUSE_Fun_19" },
  { "keyCode": "MOUSE_Fun_20", "functionType": "MOUSE", "value": "Scrolldown", "hid": 7, "translate": "Scrolldown", "code": "MOUSE_Fun_20" },
  { "keyCode": "MOUSE_Fun_21", "functionType": "MOUSE", "value": "Profilecycleup", "hid": 1944, "translate": "Profilecycleup", "code": "MOUSE_Fun_21" },
  { "keyCode": "MOUSE_Fun_22", "functionType": "MOUSE", "value": "Profilecycledown", "hid": 1943, "translate": "Profilecycledown", "code": "MOUSE_Fun_22" },
  { "keyCode": "MOUSE_Fun_23", "functionType": "MOUSE", "value": "Batterystatuscheck", "hid": 1942, "translate": "Batterystatuscheck", "code": "MOUSE_Fun_23" },
  { "keyCode": "LaunchProgram", "functionType": "LaunchProgram", "value": "LaunchProgram", "hid": 1941, "translate": "LaunchProgram", "code": "LaunchProgram" },
  { "keyCode": "LaunchWebsite", "functionType": "LaunchProgram", "value": "LaunchWebsite", "hid": 1940, "translate": "LaunchWebsite", "code": "LaunchWebsite" },
  { "keyCode": "Shortcuts_Fun_25", "functionType": "Shortcuts", "value": "Email", "hid": 17, "translate": "Email", "code": "Shortcuts_Fun_25" },
  { "keyCode": "Shortcuts_Fun_26", "functionType": "Shortcuts", "value": "Calculator", "hid": 16, "translate": "Calculator", "code": "Shortcuts_Fun_26" },
  { "keyCode": "Shortcuts_Fun_27", "functionType": "Shortcuts", "value": "My Computer", "hid": 15, "translate": "My Computer", "code": "Shortcuts_Fun_27" },
  { "keyCode": "Shortcuts_Fun_28", "functionType": "Shortcuts", "value": "Explorer", "hid": 15, "translate": "Explorer", "code": "Shortcuts_Fun_28" },
  { "keyCode": "Shortcuts_Fun_29", "functionType": "Shortcuts", "value": "WWW Home", "hid": 8, "translate": "WWW Home", "code": "Shortcuts_Fun_29" },
  { "keyCode": "Shortcuts_Fun_30", "functionType": "Shortcuts", "value": "WWW Refresh", "hid": 9, "translate": "WWW Refresh", "code": "Shortcuts_Fun_30" },
  { "keyCode": "Shortcuts_Fun_31", "functionType": "Shortcuts", "value": "WWW Stop", "hid": 10, "translate": "WWW Stop", "code": "Shortcuts_Fun_31" },
  { "keyCode": "Shortcuts_Fun_32", "functionType": "Shortcuts", "value": "WWW Back", "hid": 11, "translate": "WWW Back", "code": "Shortcuts_Fun_32" },
  { "keyCode": "Shortcuts_Fun_33", "functionType": "Shortcuts", "value": "WWW Forward", "hid": 12, "translate": "WWW Forward", "code": "Shortcuts_Fun_33" },
  { "keyCode": "Shortcuts_Fun_34", "functionType": "Shortcuts", "value": "WWW Search", "hid": 14, "translate": "WWW Search", "code": "Shortcuts_Fun_34" },
  { "keyCode": "MacroFunction", "functionType": "MacroFunction", "value": "MacroFunction", "hid": 1923, "translate": "MacroFunction", "code": "MacroFunction" },
  { "keyCode": "ScrollWheel", "functionType": "ScrollWheel", "value": "Volume", "hid": 1922, "translate": "ScrollWheel", "code": "ScrollWheel" },
  { "keyCode": "Custom_Fnkey", "functionType": "Custom_Fnkey", "value": "FN", "hid": "0x781", "translate": "FN", "code": "Custom_Fnkey" },
  { "keyCode": "0", "functionType": "Singlekey", "value": "Left Click", "hid": 176, "hid_ModelO:": 1, "translate": "Left Click", "code": "0" },
  { "keyCode": "1", "functionType": "Singlekey", "value": "Scroll Click", "hid": 178, "hid_ModelO:": 3, "translate": "Scroll Click", "code": "1" },
  { "keyCode": "2", "functionType": "Singlekey", "value": "Right Click", "hid": 177, "hid_ModelO:": 2, "translate": "Right Click", "code": "2" },
  { "keyCode": "3", "functionType": "Singlekey", "value": "Back Key", "hid": 179, "hid_ModelO": 2, "translate": "Back Key", "code": "3" },
  { "keyCode": "4", "functionType": "Singlekey", "value": "Forward Key", "hid": 180, "hid_ModelO": 2, "translate": "Forward Key", "code": "4" },
  { "keyCode": "65", "functionType": "Singlekey", "value": "A", "hid": 4, "translate": "A", "code": "KeyA" },
  { "keyCode": "66", "functionType": "Singlekey", "value": "B", "hid": 5, "translate": "B", "code": "KeyB" },
  { "keyCode": "67", "functionType": "Singlekey", "value": "C", "hid": 6, "translate": "C", "code": "KeyC" },
  { "keyCode": "68", "functionType": "Singlekey", "value": "D", "hid": 7, "translate": "D", "code": "KeyD" },
  { "keyCode": "69", "functionType": "Singlekey", "value": "E", "hid": 8, "translate": "E", "code": "KeyE" },
  { "keyCode": "70", "functionType": "Singlekey", "value": "F", "hid": 9, "translate": "F", "code": "KeyF" },
  { "keyCode": "71", "functionType": "Singlekey", "value": "G", "hid": 10, "translate": "G", "code": "KeyG" },
  { "keyCode": "72", "functionType": "Singlekey", "value": "H", "hid": 11, "translate": "H", "code": "KeyH" },
  { "keyCode": "73", "functionType": "Singlekey", "value": "I", "hid": 12, "translate": "I", "code": "KeyI" },
  { "keyCode": "74", "functionType": "Singlekey", "value": "J", "hid": 13, "translate": "J", "code": "KeyJ" },
  { "keyCode": "75", "functionType": "Singlekey", "value": "K", "hid": 14, "translate": "K", "code": "KeyK" },
  { "keyCode": "76", "functionType": "Singlekey", "value": "L", "hid": 15, "translate": "L", "code": "KeyL" },
  { "keyCode": "77", "functionType": "Singlekey", "value": "M", "hid": 16, "translate": "M", "code": "KeyM" },
  { "keyCode": "78", "functionType": "Singlekey", "value": "N", "hid": 17, "translate": "N", "code": "KeyN" },
  { "keyCode": "79", "functionType": "Singlekey", "value": "O", "hid": 18, "translate": "O", "code": "KeyO" },
  { "keyCode": "80", "functionType": "Singlekey", "value": "P", "hid": 19, "translate": "P", "code": "KeyP" },
  { "keyCode": "81", "functionType": "Singlekey", "value": "Q", "hid": 20, "translate": "Q", "code": "KeyQ" },
  { "keyCode": "82", "functionType": "Singlekey", "value": "R", "hid": 21, "translate": "R", "code": "KeyR" },
  { "keyCode": "83", "functionType": "Singlekey", "value": "S", "hid": 22, "translate": "S", "code": "KeyS" },
  { "keyCode": "84", "functionType": "Singlekey", "value": "T", "hid": 23, "translate": "T", "code": "KeyT" },
  { "keyCode": "85", "functionType": "Singlekey", "value": "U", "hid": 24, "translate": "U", "code": "KeyU" },
  { "keyCode": "86", "functionType": "Singlekey", "value": "V", "hid": 25, "translate": "V", "code": "KeyV" },
  { "keyCode": "87", "functionType": "Singlekey", "value": "W", "hid": 26, "translate": "W", "code": "KeyW" },
  { "keyCode": "88", "functionType": "Singlekey", "value": "X", "hid": 27, "translate": "X", "code": "KeyX" },
  { "keyCode": "89", "functionType": "Singlekey", "value": "Y", "hid": 28, "translate": "Y", "code": "KeyY" },
  { "keyCode": "90", "functionType": "Singlekey", "value": "Z", "hid": 29, "translate": "Z", "code": "KeyZ" },
  { "keyCode": "48", "functionType": "Singlekey", "value": "0", "hid": 39, "translate": "0", "code": "Digit0" },
  { "keyCode": "49", "functionType": "Singlekey", "value": "1", "hid": 30, "translate": "1", "code": "Digit1" },
  { "keyCode": "50", "functionType": "Singlekey", "value": "2", "hid": 31, "translate": "2", "code": "Digit2" },
  { "keyCode": "51", "functionType": "Singlekey", "value": "3", "hid": 32, "translate": "3", "code": "Digit3" },
  { "keyCode": "52", "functionType": "Singlekey", "value": "4", "hid": 33, "translate": "4", "code": "Digit4" },
  { "keyCode": "53", "functionType": "Singlekey", "value": "5", "hid": 34, "translate": "5", "code": "Digit5" },
  { "keyCode": "54", "functionType": "Singlekey", "value": "6", "hid": 35, "translate": "6", "code": "Digit6" },
  { "keyCode": "55", "functionType": "Singlekey", "value": "7", "hid": 36, "translate": "7", "code": "Digit7" },
  { "keyCode": "56", "functionType": "Singlekey", "value": "8", "hid": 37, "translate": "8", "code": "Digit8" },
  { "keyCode": "57", "functionType": "Singlekey", "value": "9", "hid": 38, "translate": "9", "code": "Digit9" },
  { "keyCode": "8", "functionType": "Singlekey", "value": "Backspace", "hid": 42, "translate": "Backspace", "code": "Backspace" },
  { "keyCode": "9", "functionType": "Singlekey", "value": "Tab", "hid": 43, "translate": "Tab", "code": "Tab" },
  { "keyCode": "144", "functionType": "Singlekey", "value": "Num Lock", "hid": 83, "translate": "Num Lock", "code": "NumLock" },
  { "keyCode": "13", "functionType": "Singlekey", "value": "Enter", "hid": 40, "translate": "Enter", "code": "Enter" },
  { "keyCode": "16", "functionType": "Singlekey", "value": "Shift", "hid": 229, "Modifier": 2, "translate": "Shift", "code": "ShiftRight" },
  { "keyCode": "16", "functionType": "Singlekey", "value": "Shift", "hid": 225, "Modifier": 0, "translate": "Shift", "code": "ShiftLeft" },
  { "keyCode": "17", "functionType": "Singlekey", "value": "Ctrl", "hid": 224, "Modifier": 1, "translate": "Ctrl", "code": "ControlLeft" },
  { "keyCode": "17", "functionType": "Singlekey", "value": "Ctrl", "hid": 228, "translate": "Ctrl", "code": "ControlRight" },
  { "keyCode": "18", "functionType": "Singlekey", "value": "Alt", "hid": 230, "Modifier": 4, "translate": "AltGr", "code": "AltRight" },
  { "keyCode": "18", "functionType": "Singlekey", "value": "Alt", "hid": 226, "translate": "Alt", "code": "AltLeft" },
  { "keyCode": "19", "functionType": "Singlekey", "value": "Break", "hid": 72, "translate": "Break", "code": "Pause" },
  { "keyCode": "20", "functionType": "Singlekey", "value": "CapsLock", "hid": 57, "translate": "CapsLock", "code": "CapsLock" },
  { "keyCode": "27", "functionType": "Singlekey", "value": "Esc", "hid": 41, "translate": "Esc", "code": "Escape" },
  { "keyCode": "32", "functionType": "Singlekey", "value": "Space", "hid": 44, "translate": "Space", "code": "Space" },
  { "keyCode": "33", "functionType": "Singlekey", "value": "PageUp", "hid": 75, "translate": "PageUp", "code": "PageUp" },
  { "keyCode": "34", "functionType": "Singlekey", "value": "PageDown", "hid": 78, "translate": "PageDown", "code": "PageDown" },
  { "keyCode": "35", "functionType": "Singlekey", "value": "End", "hid": 77, "translate": "End", "code": "End" },
  { "keyCode": "36", "functionType": "Singlekey", "value": "Home", "hid": 74, "translate": "Home", "code": "Home" },
  { "keyCode": "37", "functionType": "Singlekey", "value": "Left", "hid": 80, "translate": "Left", "code": "ArrowLeft" },
  { "keyCode": "38", "functionType": "Singlekey", "value": "Up", "hid": 82, "translate": "Up", "code": "ArrowUp" },
  { "keyCode": "39", "functionType": "Singlekey", "value": "Right", "hid": 79, "translate": "Right", "code": "ArrowRight" },
  { "keyCode": "40", "functionType": "Singlekey", "value": "Down", "hid": 81, "translate": "Down", "code": "ArrowDown" },
  { "keyCode": "44", "functionType": "Singlekey", "value": "PrintScreen", "hid": "0x46", "translate": "PrintScreen", "code": "PrintScreen" },
  { "keyCode": "45", "functionType": "Singlekey", "value": "Insert", "hid": 73, "translate": "Insert", "code": "Insert" },
  { "keyCode": "46", "functionType": "Singlekey", "value": "Delete", "hid": 76, "translate": "Delete", "code": "Delete" },
  { "keyCode": "91", "functionType": "Singlekey", "value": "Left Win", "hid": 227, "Modifier": 8, "translate": "Left Win", "code": "MetaLeft" },
  { "keyCode": "92", "functionType": "Singlekey", "value": "Right Win", "hid": 231, "Modifier": 128, "translate": "Right Win", "code": "MetaRight" },
  { "keyCode": "93", "functionType": "Singlekey", "value": "Menu", "hid": 101, "translate": "Menu", "code": "ContextMenu" },
  { "keyCode": "96", "functionType": "Singlekey", "value": "Numpad0", "hid": 98, "translate": "Numpad0", "code": "Numpad0" },
  { "keyCode": "97", "functionType": "Singlekey", "value": "Numpad1", "hid": 89, "translate": "Numpad1", "code": "Numpad1" },
  { "keyCode": "98", "functionType": "Singlekey", "value": "Numpad2", "hid": 90, "translate": "Numpad2", "code": "Numpad2" },
  { "keyCode": "99", "functionType": "Singlekey", "value": "Numpad3", "hid": 91, "translate": "Numpad3", "code": "Numpad3" },
  { "keyCode": "100", "functionType": "Singlekey", "value": "Numpad4", "hid": 92, "translate": "Numpad4", "code": "Numpad4" },
  { "keyCode": "101", "functionType": "Singlekey", "value": "Numpad5", "hid": 93, "translate": "Numpad5", "code": "Numpad5" },
  { "keyCode": "102", "functionType": "Singlekey", "value": "Numpad6", "hid": 94, "translate": "Numpad6", "code": "Numpad6" },
  { "keyCode": "103", "functionType": "Singlekey", "value": "Numpad7", "hid": 95, "translate": "Numpad7", "code": "Numpad7" },
  { "keyCode": "104", "functionType": "Singlekey", "value": "Numpad8", "hid": 96, "translate": "Numpad8", "code": "Numpad8" },
  { "keyCode": "105", "functionType": "Singlekey", "value": "Numpad9", "hid": 97, "translate": "Numpad9", "code": "Numpad9" },
  { "keyCode": "13", "functionType": "Singlekey", "value": "NumpadEnter", "hid": 88, "translate": "NumpadEnter", "code": "NumpadEnter" },
  { "keyCode": "106", "functionType": "Singlekey", "value": "*", "hid": 85, "translate": "Num *", "code": "NumpadMultiply" },
  { "keyCode": "107", "functionType": "Singlekey", "value": "+", "hid": 87, "translate": "Num +", "code": "NumpadAdd" },
  { "keyCode": "109", "functionType": "Singlekey", "value": "-", "hid": 86, "translate": "Num -", "code": "NumpadSubtract" },
  { "keyCode": "110", "functionType": "Singlekey", "value": ".", "hid": 99, "translate": ".", "code": "NumpadDecimal" },
  { "keyCode": "111", "functionType": "Singlekey", "value": "/", "hid": 84, "translate": "Num /", "code": "NumpadDivide" },
  { "keyCode": "112", "functionType": "Singlekey", "value": "F1", "hid": 58, "translate": "F1", "code": "F1" },
  { "keyCode": "113", "functionType": "Singlekey", "value": "F2", "hid": 59, "translate": "F2", "code": "F2" },
  { "keyCode": "114", "functionType": "Singlekey", "value": "F3", "hid": 60, "translate": "F3", "code": "F3" },
  { "keyCode": "115", "functionType": "Singlekey", "value": "F4", "hid": 61, "translate": "F4", "code": "F4" },
  { "keyCode": "116", "functionType": "Singlekey", "value": "F5", "hid": 62, "translate": "F5", "code": "F5" },
  { "keyCode": "117", "functionType": "Singlekey", "value": "F6", "hid": 63, "translate": "F6", "code": "F6" },
  { "keyCode": "118", "functionType": "Singlekey", "value": "F7", "hid": 64, "translate": "F7", "code": "F7" },
  { "keyCode": "119", "functionType": "Singlekey", "value": "F8", "hid": 65, "translate": "F8", "code": "F8" },
  { "keyCode": "120", "functionType": "Singlekey", "value": "F9", "hid": 66, "translate": "F9", "code": "F9" },
  { "keyCode": "121", "functionType": "Singlekey", "value": "F10", "hid": 67, "translate": "F10", "code": "F10" },
  { "keyCode": "122", "functionType": "Singlekey", "value": "F11", "hid": 68, "translate": "F11", "code": "F11" },
  { "keyCode": "123", "functionType": "Singlekey", "value": "F12", "hid": 69, "translate": "F12", "code": "F12" },
  { "keyCode": "145", "functionType": "Singlekey", "value": "Scroll Lock", "hid": 71, "translate": "Scroll Lock", "code": "ScrollLock" },
  { "keyCode": "186", "functionType": "Singlekey", "value": ";", "hid": 51, "translate": ";", "code": "Semicolon" },
  { "keyCode": "187", "functionType": "Singlekey", "value": "=", "hid": 46, "translate": "=", "code": "Equal" },
  { "keyCode": "188", "functionType": "Singlekey", "value": ",", "hid": 54, "translate": ",", "code": "Comma" },
  { "keyCode": "189", "functionType": "Singlekey", "value": "-", "hid": 45, "translate": "-", "code": "Minus" },
  { "keyCode": "190", "functionType": "Singlekey", "value": "dot", "hid": 55, "translate": "dot", "code": "Period" },
  { "keyCode": "191", "functionType": "Singlekey", "value": "/", "hid": 56, "translate": "/", "code": "Slash" },
  { "keyCode": "192", "functionType": "Singlekey", "value": "~", "hid": 53, "translate": "~", "code": "Backquote" },
  { "keyCode": "219", "functionType": "Singlekey", "value": "[", "hid": 47, "translate": "[", "code": "BracketLeft" },
  { "keyCode": "220", "functionType": "Singlekey", "value": "|", "hid": 49, "translate": "|", "code": "Backslash" },
  { "keyCode": "226", "functionType": "Singlekey", "value": "\\", "hid": 49, "translate": "IntlBackslash", "code": "IntlBackslash" },
  { "keyCode": "221", "functionType": "Singlekey", "value": "]", "hid": 48, "translate": "]", "code": "BracketRight" },
  { "keyCode": "222", "functionType": "Singlekey", "value": "'", "hid": 52, "translate": "'", "code": "Quote" }
];
function ProfileDefault() {
  const Profile_Info_Default = {
    //ProfileID:1,
    MousePerformance: {
      iStage: 1,
      iXYSync: 2,
      iPollingRate: 500,
      iCalibration: 1
    },
    MouseLighting: {
      Amplitude: 2500,
      Angle: 1,
      bQuickEffect: false,
      ColorNumber: 5,
      Decay: 50,
      Fire: 5,
      iBrightness: 50,
      iEffect: 1,
      iSpeed: 50,
      Width: 3
    },
    MouseBtnList: [
      { id: 1, group: 1, function: 1, name: "Left button" },
      { id: 2, group: 1, function: 2, name: "Right button" },
      { id: 3, group: 1, function: 3, name: "Middle button" },
      { id: 4, group: 4, function: 1, name: "Lighting effect switch" },
      { id: 5, group: 1, function: 10, name: "DPI increase loop" },
      { id: 6, group: 1, function: 4, name: "Forward button" },
      { id: 7, group: 1, function: 5, name: "Backward button" },
      { id: 8, group: 1, function: 13, name: "Squeeze" }
    ]
  };
  return Profile_Info_Default;
}
const SupportData = {
  KeyMapping,
  MediaMapping,
  WindowsMapping,
  AllFunctionMapping,
  Shortcuts_WindowsMapping,
  SupportLanguage,
  ProfileDefault
};
let Device$1 = class Device extends EventEmitter {
  static #instance;
  nedbObj;
  hid;
  AudioSession;
  constructor() {
    env.log("Device", "Device class", "begin");
    super();
    this.nedbObj = AppDB.getInstance();
  }
  static getInstance() {
    if (this.#instance) {
      env.log("Device", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Device", "getInstance", `New Device() INSTANCE`);
      this.#instance = new Device();
      return this.#instance;
    }
  }
  /**
   * Set Device Data to Device
   * @param {*} dev
   * @param {*} callback
   */
  SaveProfileToDevice(dev, callback) {
    env.log(dev.BaseInfo.devicename, "SaveProfileToDevice", `SaveProfileToDevice`);
    var BaseInfo = dev.BaseInfo;
    var profile = BaseInfo.defaultProfile;
    var obj = {
      vid: BaseInfo.vid,
      pid: BaseInfo.pid,
      SN: BaseInfo.SN,
      devicename: BaseInfo.devicename,
      ModelType: BaseInfo.ModelType,
      image: BaseInfo.img,
      battery: BaseInfo.battery,
      profile,
      profileindex: 1,
      EnableRGBSync: false
    };
    if (dev.BaseInfo.deviceInfo != void 0 && dev.BaseInfo.deviceInfo.SyncFlag) {
      obj.EnableRGBSync = false;
    }
    this.nedbObj.AddDevice(obj).then(() => {
      callback(obj);
    });
  }
  /**
   * update Device Data to DB
   * @param {*} dev
   * @param {*} callback
   */
  setProfileToDevice(dev, callback) {
    env.log(dev.BaseInfo.devicename, "setProfileToDevice", "Begin");
    this.nedbObj.updateDevice(dev.BaseInfo.SN, dev.deviceData);
    callback();
  }
  /**
   * Switch Profile
   * @param {*} dev
   * @param {*} obj
   * @param {*} callback
   */
  ChangeProfile(dev, obj, callback) {
    try {
      this.ChangeProfileID(dev, obj, (params) => {
        if (dev.BaseInfo.deviceInfo != void 0 && dev.BaseInfo.deviceInfo.SyncFlag) {
          var ProfileID = dev.deviceData.profileindex;
          dev.m_bSetSyncEffect = dev.deviceData.EnableRGBSync;
        }
        callback(obj);
      });
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "ChangeProfile", `${e}`);
      callback();
    }
  }
  hexToRgb(InputData) {
    try {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(InputData);
      return result ? {
        color: {
          R: parseInt(result[1], 16),
          G: parseInt(result[2], 16),
          B: parseInt(result[3], 16)
        }
      } : null;
    } catch {
      return 1;
    }
  }
  // padLeft(num,numZeros){
  //     var n = Math.abs(num);
  //     var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
  //     var zeroString = Math.pow(10,zeros).toString().substr(1);
  //     if( num < 0 ) {
  //         zeroString = '-' + zeroString;
  //     }
  //     return zeroString+n;
  // }
  /**
   * Run the WebSite
   * @param {*} obj
   * @param {*} callback
   */
  RunWebSite(obj, _callback) {
    try {
      env.log("DeviceApi RunWebSite", "RunWebSite", JSON.stringify(obj));
      if (env.isWindows) {
        electron.shell.openExternal(obj);
      } else {
        obj = "open -nF " + obj;
        cp$1.exec(obj, { shell: "/bin/bash" }, function(err, data) {
        });
      }
    } catch (e) {
      env.log("RunWebSite", "LaunchProgram", `Error:${e}`);
    }
  }
  /**
   * Run the application
   * @param {*} obj
   * @param {*} callback
   */
  RunApplication(obj, callback) {
    try {
      env.log("DeviceApi RunApplication", "RunApplication", JSON.stringify(obj));
      if (env.isWindows) {
        electron.shell.openExternal(obj);
      } else {
        obj = "open -nF " + obj;
        cp$1.exec(obj, { shell: "/bin/bash" }, function(err, data) {
        });
      }
    } catch (e) {
      env.log("RunApplication", "LaunchProgram", `Error:${e}`);
    }
  }
  /**
   * Import Profile
   * @param {*} obj import profile Data
   */
  ImportProfile(dev, obj, callback) {
    env.log("DeviceApi ImportProfile", "ImportProfile", JSON.stringify(obj));
    let ProfileIndex = dev.deviceData.profile.findIndex((x) => x.profileid == obj.profileid);
    if (ProfileIndex != -1) {
      dev.deviceData.profile[ProfileIndex] = obj;
      this.SetImportProfileData(dev, 0, () => {
        callback();
      });
    }
  }
  /**
   * Sleep Time
   * @param {*} dev
   * @param {*} obj
   * @param {*} callback
   */
  SleepTime(dev, obj, callback) {
    env.log("DeviceApi", "SleepTime", JSON.stringify(obj));
    this.SetSleepTimetoDevice(dev, obj, () => {
      callback();
    });
  }
  SetSleepTimeFromDataBase(dev, obj, callback) {
    this.nedbObj.getAppSetting().then((doc) => {
      var ObjSleep;
      if (doc[0].sleep != void 0 && doc[0].sleeptime != void 0) {
        ObjSleep = doc[0];
        this.SetSleepTimetoDevice(dev, ObjSleep, () => {
          callback();
        });
      } else {
        callback();
      }
    });
  }
  NumTo16Decimal(rgb) {
    var hex = Number(rgb).toString(16).toUpperCase();
    while (hex.length < 4) {
      hex = "0" + hex;
    }
    return hex;
  }
  /**
   * get battery info
   * @param {*} dev
   */
  OnTimerGetBattery(dev) {
    try {
      if (env.BuiltType == 1) {
        return;
      }
      if (dev.BaseInfo.battery) {
        this.GetDeviceBatteryStats(dev, 0, (ObjBattery) => {
          if (ObjBattery == false) {
            return;
          }
          var Obj2 = {
            Func: EventTypes.GetBatteryStats,
            SN: dev.BaseInfo.SN,
            Param: ObjBattery
          };
          if (ObjBattery.Status == 0) {
            this.emit(EventTypes.ProtocolMessage, Obj2);
          }
        });
      }
    } catch (e) {
      env.log("Device:" + dev.BaseInfo.devicename, "OnTimerGetBattery", `Error:${e}`);
    }
  }
  DeleteBatteryTimeout(dev, Obj, callback) {
    if (dev.m_TimerGetBattery != void 0) {
      clearInterval(dev.m_TimerGetBattery);
    }
    callback();
  }
  StartBatteryTimeout(dev, Obj, callback) {
    if ((dev.BaseInfo.SN == "0x093A0x822A" || dev.BaseInfo.SN == "0x093A0x821A" || dev.BaseInfo.SN == "0x093A0x824A" || dev.BaseInfo.SN == "0x093A0x826A" || dev.BaseInfo.SN == "0x093A0x833A") && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle")
      ;
    else if (dev.BaseInfo.battery) {
      if (dev.m_TimerGetBattery != void 0) {
        clearInterval(dev.m_TimerGetBattery);
      }
      dev.m_TimerGetBattery = setInterval(() => this.OnTimerGetBattery(dev), 15e3);
    }
    callback();
  }
  /**
   * Get Battery info
   * @param {*} dev
   * @param {*} obj
   * @param {*} callback
   */
  GetBatteryStats(dev, obj, callback) {
    if (env.BuiltType == 1) {
      callback(0);
      return;
    }
    if (dev.BaseInfo.battery) {
      setTimeout(() => {
        this.GetDeviceBatteryStats(dev, 0, (ObjBattery) => {
          if (ObjBattery.Status == 1) {
            ObjBattery.Status = 0;
            ObjBattery.Battery = "Device Not Detected";
          }
          if (ObjBattery == false) {
            env.log(
              "Device-" + dev.BaseInfo.devicename,
              "GetBatteryStats-" + JSON.stringify(ObjBattery),
              JSON.stringify(ObjBattery.Battery)
            );
            callback(false);
          } else {
            env.log(
              "Device-" + dev.BaseInfo.devicename,
              "GetBatteryStats-" + JSON.stringify(ObjBattery.Status) + ":",
              JSON.stringify(ObjBattery.Battery)
            );
            var Obj2 = {
              Func: "GetBatteryStats",
              SN: dev.BaseInfo.SN,
              Param: ObjBattery
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
            env.log(
              "Device-" + dev.BaseInfo.devicename,
              "GetBatteryStats-" + JSON.stringify(ObjBattery.Status) + ":",
              JSON.stringify(ObjBattery.Battery)
            );
            callback(ObjBattery);
          }
        });
      }, 1e3);
    } else {
      callback(0);
    }
  }
  /**
   * RefreshPlugDevice
   * @param {*} dev
   * @param {*} ObjDeviceInfo
   * @param {*} callback
   */
  RefreshPlugDevice(dev, ObjDeviceInfo, callback) {
    if (this.hid == null) {
      throw new Error("Cannot refresh plug device before hid property is set");
    }
    this.DeleteBatteryTimeout(dev, 0, function() {
    });
    var deviceresult = 0;
    var StateID = -1;
    for (var iState = 0; iState < ObjDeviceInfo.pid.length; iState++) {
      var result;
      for (var index = 0; index < ObjDeviceInfo.set.length; index++) {
        result = this.hid.FindDevice(
          ObjDeviceInfo.set[index].usagepage,
          ObjDeviceInfo.set[index].usage,
          ObjDeviceInfo.vid[iState],
          ObjDeviceInfo.pid[iState]
        );
        if (result != 0) {
          break;
        } else {
          var StateArraynum = dev.BaseInfo.StateArray.indexOf(dev.BaseInfo.StateType[iState]);
          if (StateArraynum != -1) {
            dev.BaseInfo.StateArray.splice(StateArraynum, 1);
          }
        }
      }
      if (result != 0) {
        if (deviceresult == 0) {
          deviceresult = result;
          StateID = iState;
        }
        var StateArraynum = dev.BaseInfo.StateArray.indexOf(dev.BaseInfo.StateType[iState]);
        if (StateArraynum == -1) {
          dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType[iState]);
        }
      }
    }
    if (deviceresult != 0) {
      dev.BaseInfo.DeviceId = deviceresult;
      dev.BaseInfo.StateID = StateID;
      this.StartBatteryTimeout(dev, 0, function() {
      });
      this.ReadFWVersion(dev, 0, function() {
        var ObjResult2 = {
          Plug: true,
          StateID
        };
        callback(ObjResult2);
      });
    } else {
      if (dev.BaseInfo.ModelType == 1) {
        var Obj2 = {
          Func: "SendDisconnected",
          SN: dev.BaseInfo.SN,
          Param: {
            SN: dev.BaseInfo.SN
          }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
      }
      var ObjResult = {
        Plug: false,
        StateID: 0
      };
      callback(ObjResult);
    }
  }
  ////////////////////RGB SYNC////////////////////////////
  SyncFlag(dev, Obj, callback) {
    if (dev.BaseInfo.deviceInfo != void 0 && dev.BaseInfo.deviceInfo.SyncFlag) {
      dev.deviceData.EnableRGBSync = Obj;
      dev.m_bSetSyncEffect = Obj;
    }
    callback();
  }
  ////////////////////RGB SYNC////////////////////////////
  //#region AudioSession
  //---------------------timer for get Audio Session-------------------------------
  /**
   * get Audio Session
   * @param {*} dev
   * @param {*} callback
   */
  OnTimerGetAudioSession(dev) {
    if (dev.m_TimerGetSession != void 0) {
      clearInterval(dev.m_TimerGetSession);
    }
    dev.m_TimerGetSession = setInterval(() => {
      try {
        this.GetAudioSession(dev, 0, (ObjSession) => {
          if (this.CompareContent(ObjSession, dev.deviceData.AudioSession) == false) {
            dev.deviceData.AudioSession = JSON.parse(JSON.stringify(ObjSession));
            var Obj2 = {
              Func: EventTypes.GetAudioSession,
              SN: dev.BaseInfo.SN,
              Param: dev.deviceData.AudioSession
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
          }
        });
      } catch (e) {
        env.log("GmmkNumpadSeries", "OnTimerGetAudioSession", `Error:${e}`);
      }
    }, 1e3);
  }
  CompareContent(object1, object2) {
    var bCompare = false;
    if (object1 == void 0 || object2 == void 0)
      return false;
    if (object1.length != object2.length)
      return false;
    for (var iIndex = 0; iIndex < object1.length; iIndex++) {
      if (object1[iIndex].filename != object2[iIndex].filename)
        break;
      if (parseInt(object1[iIndex].percent) != parseInt(object2[iIndex].percent))
        break;
      if (parseInt(object1[iIndex].processid) != parseInt(object2[iIndex].processid))
        break;
      if (iIndex == object1.length - 1) {
        bCompare = true;
      }
    }
    return bCompare;
  }
  GetAudioSession(dev, Obj, callback) {
    try {
      var arrAudioSession = this.AudioSession?.GetSystemAudioSession();
      if (!arrAudioSession) {
        env.log("GmmkNumpadSeries", "GetAudioSession", `No audio sessions.`);
        return;
      }
      var FrontSession = [];
      let AudioSession = {
        filepath: "Windows Default Sound Output",
        filename: "Windows Default Sound Output",
        percent: 0,
        processid: 1
      };
      FrontSession.push(AudioSession);
      for (let index = 0; index < arrAudioSession.length; index++) {
        var FileDescription = arrAudioSession[index].FileDescription;
        var Filepath = arrAudioSession[index].filepath;
        if (arrAudioSession[index].filepath == "System Sounds") {
          FileDescription = arrAudioSession[index].filepath;
        }
        if (FileDescription != "") {
          AudioSession = {
            filepath: FileDescription,
            filename: FileDescription,
            percent: arrAudioSession[index].percent,
            processid: arrAudioSession[index].processid
          };
          FrontSession.push(AudioSession);
        } else if (FileDescription == "" && Filepath != "") {
          var filename = arrAudioSession[index].filepath;
          if (arrAudioSession[index].filepath.indexOf("\\") != -1) {
            filename = arrAudioSession[index].filepath.replace(/^.*[\\\/]/, "");
            var extIndex = filename.lastIndexOf(".");
            if (extIndex != -1) {
              filename = filename.substr(0, extIndex);
            }
          }
          AudioSession = {
            filepath: filename,
            filename,
            percent: arrAudioSession[index].percent,
            processid: arrAudioSession[index].processid
          };
          FrontSession.push(AudioSession);
        } else if (FileDescription == "" && Filepath == "") {
        }
      }
      for (let index = 0; index < FrontSession.length; index++) {
        var iRepratCount = 0;
        for (let index2 = 0; index2 < FrontSession.length; index2++) {
          if (FrontSession[index].filename == FrontSession[index2].filename) {
            iRepratCount++;
            if (iRepratCount >= 2) {
              FrontSession[index2].filename += iRepratCount.toString();
            }
          }
        }
        if (iRepratCount >= 2) {
          FrontSession[index].filename += "1";
        }
      }
      callback(FrontSession);
    } catch (e) {
      env.log("GmmkNumpadSeries", "GetAudioSession", `Error ${e}`);
    }
  }
  //#endregion AudioSession
  SetImportProfileData(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
  ChangeProfileID(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
  SetSleepTimetoDevice(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
  GetDeviceBatteryStats(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
  ReadFWVersion(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
  SearchPerKeyContent(dev, Obj) {
    var T_data = Obj.Perkeylist.filter(function(item, index, array) {
      if (item.SN == dev.BaseInfo.SN) {
        return item;
      }
    });
    if (T_data.length < 1) {
      return;
    }
    var iPerKeyIndex = Obj.PerKeyData.value;
    var PerKeyContent;
    for (var i = 0; i < T_data.length; i++) {
      if (iPerKeyIndex == parseInt(T_data[i].value) && T_data[i].SN == dev.BaseInfo.SN) {
        PerKeyContent = T_data[i].content;
        break;
      }
    }
    return PerKeyContent;
  }
};
class Mouse extends Device$1 {
  static #instance;
  constructor() {
    env.log("Mouse", "Mouseclass", "begin");
    super();
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("Mouse", "getInstance", `Get exist Mouse() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Mouse", "getInstance", `New Mouse() INSTANCE`);
      this.#instance = new Mouse();
      return this.#instance;
    }
  }
  /**
   * init Mouse Device
   * @param {*} dev
   */
  initDevice(dev) {
    env.log("Mouse", "initDevice", "begin");
    return new Promise((resolve, reject) => {
      dev.CancelPairing = false;
      this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
        if (exist) {
          dev.deviceData = exist;
          var StateID = dev.BaseInfo.StateID;
          if (dev.BaseInfo.StateType[StateID] == "Bootloader") {
            resolve();
            return;
          }
          this.InitialDevice(dev, 0, () => {
            resolve();
          });
        } else {
          this.SaveProfileToDevice(dev, (data) => {
            dev.deviceData = data;
            var StateID2 = dev.BaseInfo.StateID;
            if (dev.BaseInfo.StateType[StateID2] == "Bootloader") {
              resolve();
              return;
            }
            this.InitialDevice(dev, 0, () => {
              resolve();
            });
          });
        }
      });
    });
  }
  ImportProfile(dev, obj, callback) {
    let ProfileIndex = dev.deviceData.profileindex;
    env.log("DeviceApi ImportProfile", "ImportProfile", JSON.stringify(obj));
    dev.deviceData.profile[ProfileIndex - 1] = obj;
    this.SetImportProfileData(dev, 0, () => {
      callback();
    });
  }
  //-------------Pairing For ModelOV2Series MOW V2 and MIW V2-------------------------
  PairingFail(dev, doRefresh = true) {
    dev.m_bDonglepair = false;
    if (doRefresh) {
      this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {
      });
    }
    var Obj2 = {
      Func: "PairingFail",
      SN: dev.BaseInfo.SN,
      Param: {
        SN: dev.BaseInfo.SN
      }
    };
    this.emit(EventTypes.ProtocolMessage, Obj2);
  }
  CancelPairing(dev, Obj, callback) {
    dev.m_bDonglepair = false;
    dev.CancelPairing = true;
    this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {
    });
    callback();
  }
  DongleParingStart(dev, Obj, callback) {
    this.DeleteBatteryTimeout(dev, 0, () => {
    });
    dev.m_iSnCount = 0;
    dev.m_iSnCount2 = 0;
    this.OpenDongleDevice(dev, 0, (res) => {
      if (res) {
        this.ClearPairing(dev, Obj, (res2) => {
          if (res2) {
            this.StartPairing(dev, Obj, (res3) => {
              callback();
            });
          } else {
            this.PairingFail(dev);
            env.log(dev.BaseInfo.devicename, "DongleParingStart", "PairingFail");
            callback();
          }
        });
      } else {
        this.PairingFail(dev);
        env.log(dev.BaseInfo.devicename, "DonglePairing", "Cannot find Dongle Device");
      }
    });
  }
  DonglePairing(dev, Obj, callback) {
    this.DeleteBatteryTimeout(dev, 0, () => {
    });
    dev.m_iSnCount = 0;
    dev.m_iSnCount2 = 0;
    this.OpenDongleDevice(dev, 0, (res) => {
      if (res) {
        this.ClearPairing(dev, Obj, (res2) => {
          if (res2) {
            this.StartPairing(dev, Obj, (res3) => {
            });
          } else {
            this.PairingFail(dev);
            env.log(dev.BaseInfo.devicename, "DonglePairing", "PairingFail");
          }
        });
      } else {
        this.PairingFail(dev);
        env.log(dev.BaseInfo.devicename, "DonglePairing", "Cannot find Dongle Device");
      }
    });
    callback();
  }
  //
  /**
   * RefreshPlugDevice
   * @param {*} dev
   * @param {*} ObjDeviceInfo
   * @param {*} callback
   */
  OpenDongleDevice(dev, Obj, callback) {
    dev.m_bDonglepair = true;
    var deviceresult = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      callback(true);
    } else {
      for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
        var result = 0;
        for (var index = 0; index < dev.BaseInfo.set.length; index++) {
          result = this.hid.FindDevice(
            dev.BaseInfo.set[index].usagepage,
            dev.BaseInfo.set[index].usage,
            dev.BaseInfo.vid[iState],
            dev.BaseInfo.pid[iState]
          );
          if (result != 0 && dev.BaseInfo.StateType[iState] == "Dongle") {
            break;
          } else {
            result = 0;
            continue;
          }
        }
        if (result != 0) {
          dev.BaseInfo.StateID = iState;
          dev.BaseInfo.DeviceId = result;
          deviceresult = result;
          break;
        }
      }
      callback(deviceresult != 0);
    }
  }
  //
  ClearPairing(dev, Obj, callback) {
    const ClearChannel = (iChannel) => {
      if (iChannel < 5 + 1) {
        var ObjChannel = { Channel: iChannel };
        this.ClearPairtoDevice(dev, ObjChannel, (res) => {
          ClearChannel(iChannel + 1);
        });
      } else {
        callback(true);
      }
    };
    ClearChannel(1);
  }
  StartPairing(dev, Obj, callback) {
    var ObjChannel = { Channel: 1, State: 1 };
    this.StartPairStep1toDevice(dev, ObjChannel, (res) => {
      this.StartPairStep2toDevice(dev, ObjChannel, (res2) => {
        env.log(dev.BaseInfo.devicename, "StartPairing", "Start TimerPairing");
        if (res2) {
          this.StartTimerPairing(dev, 100);
        } else {
          this.PairingFail(dev);
          env.log(dev.BaseInfo.devicename, "StartPairing", "PairingFail");
        }
        callback(true);
      });
    });
  }
  StartTimerPairing(dev, iDelay) {
    const TimerPairing = (PairingCount) => {
      if (dev.CancelPairing) {
        dev.CancelPairing = false;
      } else if (PairingCount < 500) {
        setTimeout(() => {
          var ObjChannel = { Channel: 1 };
          this.CheckDetectfromDevice(dev, ObjChannel, (res, resConnect) => {
            if (res == true && resConnect == true) {
              dev.m_bDonglepair = false;
              this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {
              });
              var Obj2 = {
                //Func: "PairingFail",
                Func: "PairingSuccess",
                SN: dev.BaseInfo.SN,
                Param: {
                  SN: dev.BaseInfo.SN
                }
              };
              this.emit(EventTypes.ProtocolMessage, Obj2);
              env.log(dev.BaseInfo.devicename, "CheckDetectfromDevice", "PairingSuccess");
            } else {
              TimerPairing(PairingCount + 1);
            }
          });
        }, iDelay);
      } else {
        this.PairingFail(dev);
        env.log(dev.BaseInfo.devicename, "StartTimerPairing", "PairingFail");
      }
    };
    TimerPairing(0);
  }
  StartPairStep1toDevice(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var iTarget = Obj.Channel;
    var iState = Obj.State;
    var iDataLen = 0, iDataReportID = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      iDataReportID = 3;
      iDataLen = 64;
    }
    var Data = Buffer.alloc(iDataLen);
    Data[2] = 49;
    Data[3] = 5;
    Data[4] = iSn;
    Data[5] = 0;
    Data[6] = iTarget;
    Data[7] = iState;
    function ArraySum(total, num) {
      return total + num;
    }
    var CheckSum = Data.reduce(ArraySum);
    Data[0] = iDataReportID;
    Data[1] = CheckSum;
    dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
      dev.m_iSnCount++;
      dev.m_iSnCount2++;
      callback(true);
    });
  }
  StartPairStep2toDevice(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var iTarget = Obj.Channel;
    var iDataLen = 0, iDataReportID = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      iDataReportID = 3;
      iDataLen = 64;
    }
    var Data = Buffer.alloc(iDataLen);
    Data[2] = 56;
    Data[3] = 1;
    Data[4] = iSn;
    Data[5] = 0;
    Data[6] = iTarget;
    Data[7] = 0;
    function ArraySum(total, num) {
      return total + num;
    }
    var CheckSum = Data.reduce(ArraySum);
    Data[0] = iDataReportID;
    Data[1] = CheckSum;
    dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
      var ObjResponse = { CheckCount: 100, FunctionID: 56 };
      this.GetResponseData(dev, ObjResponse, (res) => {
        if (res == true) {
          dev.m_iSnCount++;
          dev.m_iSnCount2++;
        }
        callback(res);
      });
    });
  }
  GetResponseData(dev, Obj, callback) {
    var CheckCount = Obj.CheckCount;
    var FunctionID = Obj.FunctionID;
    var Data = Buffer.alloc(264);
    (function GetData(iCount) {
      if (iCount > 0) {
        dev.SeriesInstance.GetFeatureReport(dev, Data, 1).then((rtnData) => {
          var rtnFunctionID = rtnData[1 - 1];
          var res = true;
          res &= FunctionID == rtnFunctionID && dev.m_iSnCount == rtnData[4 - 1];
          res &= rtnData[2 - 1] == 0;
          if (!res && iCount > 0) {
            GetData(iCount - 1);
          } else {
            callback(true, rtnData);
          }
        });
      } else {
        callback(false, false);
      }
    })(CheckCount);
  }
  CheckDetectfromDevice(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var iTarget = Obj.Channel;
    var iDataLen = 0, iDataReportID = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      iDataReportID = 3;
      iDataLen = 64;
    }
    var Data = Buffer.alloc(iDataLen);
    Data[2] = 50;
    Data[3] = 1;
    Data[4] = iSn;
    Data[5] = 0;
    Data[6] = iTarget;
    Data[7] = 0;
    function ArraySum(total, num) {
      return total + num;
    }
    var CheckSum = Data.reduce(ArraySum);
    Data[0] = iDataReportID;
    Data[1] = CheckSum;
    dev.SeriesInstance.SetFeatureReport(dev, Data, 10).then(() => {
      var ObjResponse = { CheckCount: 1, FunctionID: 50 };
      this.GetResponseData(dev, ObjResponse, (res, rtnData) => {
        var resConnect = false;
        if (res == true) {
          resConnect = rtnData[5 - 1];
          if (resConnect) {
            resConnect = true;
          }
          dev.m_iSnCount < 255 ? dev.m_iSnCount++ : dev.m_iSnCount = 0;
          dev.m_iSnCount2 < 255 ? dev.m_iSnCount2++ : dev.m_iSnCount2 = 0;
        }
        callback(res, resConnect);
      });
    });
  }
  ClearPairtoDevice(dev, Obj, callback) {
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] != "Dongle") {
      callback(false);
      return;
    }
    var iSn = dev.m_iSnCount;
    var iTarget = Obj.Channel;
    var iDataLen = 0, iDataReportID = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      iDataReportID = 3;
      iDataLen = 64;
    }
    var Data = Buffer.alloc(iDataLen);
    Data[2] = 53;
    Data[3] = 1;
    Data[4] = iSn;
    Data[5] = 0;
    Data[6] = iTarget;
    Data[7] = 0;
    function ArraySum(total, num) {
      return total + num;
    }
    var CheckSum = Data.reduce(ArraySum);
    Data[0] = iDataReportID;
    Data[1] = CheckSum;
    dev.SeriesInstance.SetFeatureReport(dev, Data, 100).then(() => {
      dev.m_iSnCount++;
      callback(true);
    });
  }
  InitialDevice(dev, obj, callback) {
    throw new Error("Not Implemented");
  }
}
var _this;
class ModelO2ProPairing extends EventEmitter {
  static #instance;
  constructor(hid) {
    env.log("ModelO2ProPairing", "ModelO2ProPairing class", "begin");
    super();
    _this = this;
    _this.hid = hid;
    _this.arrDongleDevices = [
      { vid: "0x258A", pid: "0x2033", pairingFlag: 2, devicename: "MO2 PRO W_1K" },
      { vid: "0x258A", pid: "0x2034", pairingFlag: 2, devicename: "MD2 PRO W_1K" },
      { vid: "0x258A", pid: "0x2035", pairingFlag: 3, devicename: "MO2 PRO W_4K/8K" },
      { vid: "0x258A", pid: "0x2036", pairingFlag: 3, devicename: "MD2 PRO W_4K/8K" },
      { vid: "0x258A", pid: "0x2038", pairingFlag: 3, devicename: "Pro2_4K/8K Dongle Kit" }
    ];
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelO2ProPairing", "getInstance", `Get exist ModelO2ProPairing() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelO2ProPairing", "getInstance", `New ModelO2ProPairing() INSTANCE`);
      this.#instance = new ModelO2ProPairing(hid);
      return this.#instance;
    }
  }
  /**
   * Get Device RFAddress from Device
   * @param {*} dev
   */
  OpenDongleDevice(dev) {
    var result = false;
    var PairingSeries = 0;
    for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
      var DeviceId = _this.hid.FindDevice(
        dev.BaseInfo.set[0].usagepage,
        dev.BaseInfo.set[0].usage,
        dev.BaseInfo.vid[iState],
        dev.BaseInfo.pid[iState]
      );
      if (DeviceId != 0 && iState == 0) {
        dev.BaseInfo.DeviceId = DeviceId;
        if (dev.BaseInfo.pairingFlag != void 0) {
          PairingSeries = dev.BaseInfo.pairingFlag;
        }
        break;
      } else if (DeviceId != 0 && iState == 1) {
        if (dev.BaseInfo.pairingFlag != void 0) {
          PairingSeries = dev.BaseInfo.pairingFlag;
        }
      }
    }
    for (var iDongle = 0; iDongle < _this.arrDongleDevices.length; iDongle++) {
      if (_this.arrDongleDevices[iDongle].pairingFlag == PairingSeries) {
        var RFDeviceId = _this.hid.FindDevice(
          dev.BaseInfo.set[0].usagepage,
          dev.BaseInfo.set[0].usage,
          _this.arrDongleDevices[iDongle].vid,
          _this.arrDongleDevices[iDongle].pid
        );
        if (RFDeviceId != 0) {
          dev.BaseInfo.DeviceId_RF = RFDeviceId;
          result = true;
          break;
        }
      }
    }
    return result;
  }
  ///////////For 1k Devices////////////
  CheckPairingAddress(dev, callback) {
    _this.GetDeviceRFAddress(dev, dev.BaseInfo.DeviceId, function(res1) {
      _this.GetDeviceRFAddress(dev, dev.BaseInfo.DeviceId_RF, function(res2) {
        if (JSON.stringify(res1) == JSON.stringify(res2)) {
          callback(true, res1);
        } else {
          callback(false, res1);
        }
      });
    });
  }
  /**
   * Set Device RFAddress to Dongle Device
   * @param {*} dev
   * @param {*} arrAddress
   * @param {*} callback
   */
  SetAddresstoDongle(dev, arrAddress, callback) {
    var Data = Buffer.alloc(65);
    Data[0] = 0;
    Data[1] = 0;
    Data[2] = 0;
    Data[3] = 1;
    Data[4] = 4;
    Data[5] = 0;
    Data[6] = 10;
    for (let index = 0; index < arrAddress.length; index++) {
      Data[7 + index] = arrAddress[index];
    }
    _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
    setTimeout(function() {
      var rtnData = _this.hid.GetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
      var result = true;
      if (rtnData[0] == 161) {
        for (let index = 0; index < arrAddress.length; index++) {
          if (arrAddress[index] != rtnData[6 + index]) {
            result = false;
          }
        }
      }
      callback(result);
    }, 200);
  }
  /**
   * Change Device VIDPID to Dongle Device
   * @param {*} dev
   * @param {*} arrAddress
   * @param {*} callback
   */
  SetVIDPIDtoDongle(dev, callback) {
    var Data = Buffer.alloc(65);
    Data[0] = 0;
    Data[1] = 0;
    Data[2] = 0;
    Data[3] = 1;
    Data[4] = 6;
    Data[5] = 0;
    Data[6] = 11;
    Data[7] = 2;
    Data[8] = 1;
    Data[9] = dev.BaseInfo.vid[1] >> 8;
    Data[10] = dev.BaseInfo.vid[1] & 255;
    Data[11] = dev.BaseInfo.pid[1] >> 8;
    Data[12] = dev.BaseInfo.pid[1] & 255;
    _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
    setTimeout(() => {
      var RFDeviceId = _this.hid.FindDevice(
        dev.BaseInfo.set[0].usagepage,
        dev.BaseInfo.set[0].usage,
        dev.BaseInfo.vid[1],
        dev.BaseInfo.pid[1]
      );
      if (RFDeviceId != 0) {
        dev.BaseInfo.DeviceId_RF = RFDeviceId;
        env.log("ModelO2ProPairing", dev.BaseInfo.devicename + ":SetVIDPIDtoDongle", "Success");
      } else {
        env.log("ModelO2ProPairing", dev.BaseInfo.devicename + ":SetVIDPIDtoDongle", "New ID is not Detected");
      }
      callback();
    }, 500);
  }
  /**
   * Change Device VIDPID to Dongle Device
   * @param {*} dev
   * @param {*} arrAddress
   * @param {*} callback
   */
  ResetDongle(dev, callback) {
    var iDeviceCount = 2;
    var arrDeviceID = [1, 0];
    if (dev.BaseInfo.pairingFlag == 3) {
      iDeviceCount = 2;
    } else {
      iDeviceCount = 1;
    }
    (function Reset2Device(j) {
      if (j < iDeviceCount) {
        try {
          var Data = Buffer.alloc(65);
          Data[0] = 0;
          Data[1] = 0;
          Data[2] = 0;
          Data[3] = arrDeviceID[j];
          Data[4] = 10;
          Data[5] = 0;
          Data[6] = 0;
          Data[7] = 192;
          Data[8] = 0;
          _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
          setTimeout(() => {
            Reset2Device(j + 1);
          }, 200);
        } catch (e) {
          Reset2Device(j + 1);
        }
      } else {
        env.log("ModelO2ProPairing", dev.BaseInfo.devicename + ":ResetDongle", "Finished");
        callback();
      }
    })(0);
  }
  /**
   * Get Device RFAddress from Device
   * @param {*} dev
   */
  GetDeviceRFAddress(dev, DeviceId, callback) {
    var Data = Buffer.alloc(65);
    Data[0] = 0;
    Data[1] = 0;
    Data[2] = 0;
    Data[3] = 1;
    Data[4] = 4;
    Data[5] = 0;
    Data[6] = 138;
    var arrAddress = [];
    _this.hid.SetFeatureReport(DeviceId, 0, 65, Data);
    setTimeout(function() {
      var rtnData = _this.hid.GetFeatureReport(DeviceId, 0, 65, Data);
      if (rtnData[0] == 161) {
        for (let index = 0; index < 4; index++) {
          arrAddress.push(rtnData[6 + index]);
        }
        callback(arrAddress);
      }
    }, 200);
  }
  ///////////////////For 4k/8K Devices/////////////////
  /**
   * Start RF Device Pairing
   * @param {*} dev
   */
  StartRFDevicePairing(dev, callback) {
    var Data = Buffer.alloc(65);
    Data[0] = 0;
    Data[1] = 0;
    Data[2] = 2;
    Data[3] = 0;
    Data[4] = 1;
    Data[5] = 0;
    Data[6] = 12;
    Data[7] = 1;
    _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
    setTimeout(function() {
      callback(true);
    }, 200);
  }
  /**
   * Get RF Device Pairing Status
   * @param {*} dev
   */
  GetRFDevicePairingStatus(dev, callback) {
    var Data = Buffer.alloc(65);
    Data[0] = 0;
    Data[1] = 0;
    Data[2] = 2;
    Data[3] = 0;
    Data[4] = 1;
    Data[5] = 0;
    Data[6] = 140;
    _this.hid.SetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
    setTimeout(() => {
      var rtnData = _this.hid.GetFeatureReport(dev.BaseInfo.DeviceId_RF, 0, 65, Data);
      if (rtnData[0] == 161) {
        if (rtnData[6] == 2) {
          callback(1);
        } else if (rtnData[6] == 0) {
          env.log("ModelO2ProPairing", dev.BaseInfo.devicename + ":PairingStatus", "Failed-Stop");
          callback(-1);
        } else if (rtnData[6] == 3) {
          env.log("ModelO2ProPairing", dev.BaseInfo.devicename + ":PairingStatus", "Failed-Timeout");
          callback(-1);
        } else {
          callback(0);
        }
      } else {
        callback(0);
      }
    }, 100);
  }
}
module.exports = ModelO2ProPairing;
const GetValidURL = (url) => {
  if (url.length == 0)
    throw new Error("Empty URL is not valid!");
  if (!url.match("^(http|https)://")) {
    return `https://${url}`;
  }
  return url;
};
class ModelOSeries extends Mouse {
  static #instance;
  m_bSetFWEffect;
  MDFMapping;
  MouseMapping;
  ButtonMapping;
  MouseMacroContentMap = {};
  modelO2ProPairing = void 0;
  constructor(hid) {
    env.log("ModelOSeries", "ModelOSeries class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.hid = hid;
    this.MDFMapping = [
      { keyCode: "16", value: "Shift", MDFKey: 2, code: "ShiftLeft" },
      { keyCode: "17", value: "Ctrl", MDFKey: 1, code: "ControlLeft" },
      { keyCode: "18", value: "Alt", MDFKey: 4, code: "AltLeft" },
      { keyCode: "91", value: "Left Win", MDFKey: 8, code: "MetaLeft" },
      { keyCode: "16", value: "RShift", MDFKey: 32, code: "ShiftRight" },
      { keyCode: "17", value: "RCtrl", MDFKey: 16, code: "ControlRight" },
      { keyCode: "18", value: "RAlt", MDFKey: 64, code: "AltRight" },
      { keyCode: "92", value: "Right Win", MDFKey: 128, code: "MetaLeft" }
    ];
    this.MouseMapping = [
      { keyCode: "16", value: "Left Click", hid: 1, code: "0" },
      { keyCode: "17", value: "Scroll Click", hid: 4, code: "1" },
      { keyCode: "18", value: "Right Click", hid: 2, code: "2" },
      { keyCode: "91", value: "Back Key", hid: 8, code: "3" },
      { keyCode: "92", value: "Forward Key", hid: 16, code: "4" }
    ];
    this.ButtonMapping = [
      { ButtonID: 1, value: "LeftClick" },
      { ButtonID: 3, value: "ScorllClick" },
      { ButtonID: 2, value: "RightClick" },
      { ButtonID: 5, value: "Forward" },
      { ButtonID: 4, value: "Backward" },
      { ButtonID: 20, value: "DPISwitch" },
      { ButtonID: 16, value: "Scroll Up" },
      { ButtonID: 17, value: "Scroll Down" }
    ];
    this.MouseMacroContentMap = {
      mouse_left: "0",
      mouse_middle: "1",
      mouse_right: "2",
      mouse_back: "3",
      mouse_forward: "4",
      "0": "mouse_left",
      "1": "mouse_middle",
      "2": "mouse_right",
      "3": "mouse_back",
      "4": "mouse_forward"
    };
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelOSeries", "getInstance", `Get exist ModelOSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelOSeries", "getInstance", `New ModelOSeries() INSTANCE`);
      this.#instance = new ModelOSeries(hid);
      return this.#instance;
    }
  }
  InitialDevice(dev, Obj, callback) {
    try {
      env.log("ModelOSeries", "initDevice", "Begin");
      if (this.modelO2ProPairing == void 0) {
        this.modelO2ProPairing = ModelO2ProPairing.getInstance(this.hid);
      }
      dev.bwaitForPair = false;
      dev.m_bSetHWDevice = false;
      dev.ChangingDockedEffect = 0;
      dev.Batterytest = 0;
      dev.SetFromDB = false;
      if (env.BuiltType == 0) {
        dev.SetFromDB = true;
        this.SetProfileDataFromDB(dev, 0, () => {
          dev.SetFromDB = false;
          callback(0);
        });
      } else {
        dev.BaseInfo.version_Wired = "00.03.01.00";
        dev.BaseInfo.version_Wireless = "00.03.01.00";
        callback(0);
      }
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "InitialDevice", `Error:${e}`);
      callback(0);
    }
  }
  //------Recieve Callback From Device Input Data------
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 2) {
      dev.deviceData.profileindex = ObjData[2];
      var iProfile = ObjData[2];
      env.log("ModelOSeries", "HIDEP2Data-SwitchProfile", iProfile);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: dev.BaseInfo.SN,
          Profile: iProfile,
          ModelType: dev.BaseInfo.ModelType
          //Mouse:1,Keyboard:2,Dock:4
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 4 && ObjData[1] == 6) {
      if (ObjData[2] == 1) {
        dev.bwaitForPair = false;
        this.ReconnectDevice(dev, () => {
        });
      } else {
        dev.bwaitForPair = true;
      }
    } else if (ObjData[0] == 1 && ObjData[1] == 15) {
      this.LaunchProgram(dev, ObjData[2]);
    }
  }
  //--------------------------------------------------------
  ReconnectDevice(dev, callback) {
    if (dev.arrLostBuffer != void 0) {
      this.SetFeatureReport(dev, dev.arrLostBuffer, 5).then(() => {
        delete dev.arrLostBuffer;
        callback();
      });
    } else {
      callback();
    }
  }
  //------We recieved just include Button ID, So We must decide function from the application Data base------
  LaunchProgram(dev, iKey) {
    var iProfile = dev.deviceData.profileindex - 1;
    var KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];
    switch (KeyAssignData.group) {
      case 2:
        if (KeyAssignData.function == 1) {
          var csProgram = KeyAssignData.param;
          if (csProgram != "")
            this.RunApplication(csProgram);
        } else if (KeyAssignData.function == 2) {
          var csProgram = KeyAssignData.param;
          if (csProgram != null && csProgram.trim() != "") {
            this.RunWebSite(GetValidURL(csProgram));
          }
        } else if (KeyAssignData.function == 3)
          ;
        break;
      case 8:
        if (KeyAssignData.function == 1) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 2) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 3) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 4) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        break;
    }
  }
  GetWirelessMode(dev, Obj, callback) {
    var bWireless = false;
    for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
      var StateSN = "0x" + this.NumTo16Decimal(dev.BaseInfo.vid[iState]) + "0x" + this.NumTo16Decimal(dev.BaseInfo.pid[iState]);
      if (dev.BaseInfo.SN == StateSN && iState > 0) {
        bWireless = true;
        break;
      }
    }
    callback(bWireless);
  }
  ReadFWVersion(dev, Obj, callback) {
    try {
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "USB") {
        var Data = Buffer.alloc(65);
        Data[0] = 0;
        Data[1] = 0;
        Data[2] = 0;
        Data[3] = 2;
        Data[4] = 3;
        Data[5] = 0;
        Data[6] = 129;
        this.SetAndCheckStatus(dev, Data, 50).then((rtnData) => {
          if (!rtnData) {
            callback();
            return;
          }
          dev.BaseInfo.version_Wireless = "99.99.99.99";
          if (rtnData[0] != 161 || dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
            dev.BaseInfo.version_Wired = "99.99.99.99";
          } else {
            var verHigh = rtnData[6].toString();
            var verMid = rtnData[7].toString();
            var verLow = rtnData[8].toString();
            var verRev = rtnData[9].toString();
            var strVertion = verHigh + "." + verMid + "." + verLow + "." + verRev;
            dev.BaseInfo.version_Wired = strVertion;
          }
          callback();
        });
      } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        var Data = Buffer.alloc(65);
        Data[0] = 0;
        Data[1] = 0;
        Data[2] = 0;
        Data[3] = 0;
        Data[4] = 3;
        Data[5] = 0;
        Data[6] = 129;
        this.SetAndCheckStatus(dev, Data, 100).then((rtnData) => {
          if (!rtnData) {
            callback();
            return;
          }
          dev.BaseInfo.version_Wired = "99.99.99.99";
          if (rtnData[0] != 161) {
            dev.BaseInfo.version_Wireless = "99.99.99.99";
          } else {
            var verHigh = rtnData[6].toString();
            var verMid = rtnData[7].toString();
            var verLow = rtnData[8].toString();
            var verRev = rtnData[9].toString();
            var strVertion = verHigh + "." + verMid + "." + verLow + "." + verRev;
            dev.BaseInfo.version_Wireless = strVertion;
          }
          callback();
        });
      }
    } catch (e) {
      env.log("ModelOSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  //Get Device Battery Status From Device
  GetDeviceBatteryStats(dev, Obj, callback) {
    try {
      if (dev.m_bSetHWDevice) {
        callback(false);
        return;
      }
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 0;
      Data[6] = 131;
      this.SetFeatureReport(dev, Data, 50).then(() => {
        this.GetFeatureReport(dev, Data, 50).then((rtnData) => {
          var arrStatus = [161, 164, 162, 160, 163];
          var Status = arrStatus.indexOf(rtnData[0]);
          if (rtnData[5] != 131)
            Status = 2;
          if (rtnData[7] == 0)
            rtnData[7] = 1;
          if (Status == 2) {
            env.log(dev.BaseInfo.devicename, "GetDeviceBatteryStats", "Fail-Status:" + Status);
            callback(false);
          } else {
            var ObjBattery = {
              SN: dev.BaseInfo.SN,
              Status,
              Battery: rtnData[7],
              Charging: rtnData[6]
            };
            callback(ObjBattery);
          }
        });
      });
    } catch (e) {
      env.log("ModelOSeries", "GetDeviceBatteryStats", `Error:${e}`);
    }
  }
  GetProfileIDFromDevice(dev, Obj, callback) {
    try {
      if (env.BuiltType == 1) {
        callback("GetProfileIDFromDevice Done");
        return;
      }
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 1;
      Data[5] = 0;
      Data[6] = 133;
      this.SetFeatureReport(dev, Data, 30).then(() => {
        this.GetFeatureReport(dev, Data, 20).then((rtnData) => {
          var iProfile = rtnData[6];
          callback(iProfile);
        });
      });
    } catch (e) {
      env.log("ModelOSeries", "GetProfileIDFromDevice", `Error:${e}`);
    }
  }
  ChangeProfileID(dev, Obj, callback) {
    env.log("ModelOSeries", "ChangeProfileID", "Begin");
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      }
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 1;
      Data[5] = 0;
      Data[6] = 5;
      Data[7] = Obj;
      dev.deviceData.profileindex = Obj;
      this.SetAndCheckStatus(dev, Data, 50).then(() => {
        var iProfile = Obj - 1;
        var ProfileData = dev.deviceData.profile[iProfile];
        var LightingData = ProfileData.lighting;
        var ObjLighting = {
          iProfile,
          LightingData
        };
        this.SetLEDBright(dev, ObjLighting, (param1) => {
          this.setProfileToDevice(dev, () => {
            callback("ChangeProfileID Done");
          });
        });
      });
    } catch (e) {
      env.log("ModelOSeries", "ChangeProfileID", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetLEDEffect(dev, Obj, callback) {
    if (dev.BaseInfo.LEDSetting == false) {
      callback("SetLEDEffect Done");
      return;
    }
    env.log(dev.BaseInfo.devicename, "SetLEDEffect", "Begin");
    try {
      var iEffect;
      var Colors = Obj.LightingData.Color;
      var iSpeed = (105 - Obj.LightingData.RateValue) / 5;
      if (Obj.LightingData.Effect == 6 || Obj.LightingData.Effect == 7)
        iSpeed = (105 - Obj.LightingData.RateValue) * 2;
      var iBrightness;
      var iProfile = Obj.iProfile;
      var arrEffectName = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      iEffect = arrEffectName[Obj.LightingData.Effect];
      var iDataNum = Colors.length * 3 + 5;
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = iDataNum;
      Data[5] = 2;
      Data[6] = 0;
      Data[7] = iProfile + 1;
      Data[8] = 255;
      Data[9] = iEffect;
      Data[10] = 0;
      Data[11] = iSpeed;
      if (iEffect == 2) {
        Data[12] = 255;
        Data[13] = 0;
        Data[14] = 0;
      } else {
        for (var index = 0; index < Colors.length; index++) {
          if (Colors[index].flag == false) {
            Data[12 + index * 3 + 0] = 0;
            Data[12 + index * 3 + 1] = 0;
            Data[12 + index * 3 + 2] = 0;
          } else if (Colors[index].flag == true && Colors[index].R == 0 && Colors[index].G == 0 && Colors[index].B == 0) {
            Data[12 + index * 3 + 0] = 1;
            Data[12 + index * 3 + 1] = 0;
            Data[12 + index * 3 + 2] = 0;
          } else {
            Data[12 + index * 3 + 0] = Colors[index].R;
            Data[12 + index * 3 + 1] = Colors[index].G;
            Data[12 + index * 3 + 2] = Colors[index].B;
          }
        }
      }
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetLEDEffect Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetLEDBright(dev, Obj, callback) {
    if (dev.BaseInfo.LEDSetting == false) {
      callback("SetLEDBright Done");
      return;
    }
    env.log("ModelOSeries", "SetLEDBright", "Begin");
    try {
      var iWiredBrightness = Obj.LightingData.WiredBrightnessValue / 100 * 255;
      var iWirelessBrightness = Obj.LightingData.WirelessBrightnessValue / 100 * 255;
      var bCheckValue = Obj.LightingData.SepatateCheckValue;
      var iProfile = Obj.iProfile;
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 2;
      Data[6] = 2;
      Data[7] = 1;
      Data[8] = iWiredBrightness;
      this.SetFeatureReport(dev, Data, 30).then(() => {
        Data[7] = 0;
        if (bCheckValue)
          Data[8] = iWirelessBrightness;
        else
          Data[8] = iWiredBrightness;
        this.SetFeatureReport(dev, Data, 30).then(() => {
          callback("SetLEDBright Done");
        });
      });
    } catch (e) {
      env.log("ModelOSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetSleepTimetoDevice(dev, Obj, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 0;
      Data[6] = 7;
      if (Obj.sleep) {
        var iSleeptime = Obj.sleeptime * 60;
        Data[7] = iSleeptime / 255;
        Data[8] = iSleeptime & 255;
      } else {
        Data[7] = 255;
        Data[8] = 255;
      }
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetSleepTime2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetSleepTimetoDevice", `Error:${e}`);
    }
  }
  //Send Import App data and convert deviceData into Firmware
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex - 1;
    var ProfileData = dev.deviceData.profile[iProfile];
    var KeyAssignData = ProfileData.keybinding;
    var LightingData = ProfileData.lighting;
    var PerformanceData = ProfileData.performance;
    var ObjKeyAssign = {
      iProfile,
      KeyAssignData
    };
    var ObjLighting = {
      iProfile,
      LightingData
    };
    var ObjPerformance = {
      iProfile,
      PerformanceData
    };
    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
      this.SetLEDEffect(dev, ObjLighting, (param2) => {
        this.SetLEDBright(dev, ObjLighting, (param25) => {
          this.SetPerformance(dev, ObjPerformance, (param3) => {
            var ObjActiveDPI = { profile: iProfile, activeDPI: ProfileData.performance.dpiSelectIndex };
            this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param35) => {
              this.nedbObj.getMacro().then((doc) => {
                var MacroData = doc;
                var ObjMacroData = {
                  MacroData
                };
                this.SetMacroFunction(dev, ObjMacroData, (param22) => {
                  callback("SetProfileDataFromDB Done");
                });
              });
            });
          });
        });
      });
    });
  }
  //Send App data and convert deviceData into Firmware From Local Data File
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    const SetProfileData = (iProfile) => {
      var ProfileData = dev.deviceData.profile[iProfile];
      if (iProfile < 3 && ProfileData != void 0) {
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
          iProfile,
          KeyAssignData
        };
        var ObjLighting = {
          iProfile,
          LightingData
        };
        var ObjPerformance = {
          iProfile,
          PerformanceData
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param3) => {
            this.SetPerformance(dev, ObjPerformance, (param4) => {
              SetProfileData(iProfile + 1);
            });
          });
        });
      } else {
        this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
          var iProfile2 = dev.deviceData.profileindex - 1;
          var ProfileData2 = dev.deviceData.profile[iProfile2];
          var LightingData2 = ProfileData2.lighting;
          var ObjLighting2 = {
            iProfile: iProfile2,
            LightingData: LightingData2
          };
          this.SetLEDBright(dev, ObjLighting2, (param1) => {
            var ProfileData3 = dev.deviceData.profile[iProfile2];
            var PerformanceData2 = ProfileData3.performance;
            var ObjActiveDPI = { profile: iProfile2, activeDPI: PerformanceData2.dpiSelectIndex };
            if (PerformanceData2.dpiSelectIndex == void 0) {
              ObjActiveDPI.activeDPI = 0;
            }
            this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param2) => {
              this.setProfileToDevice(dev, (paramDB2) => {
                callback("SetProfileDataFromDB Done");
              });
            });
          });
        });
      }
    };
    SetProfileData(0);
  }
  //Apply and Send data Fron Frontend,the subprogram that can choose type
  SetKeyMatrix(dev, Obj, callback) {
    env.log("ModelOSeries", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.profileData;
    var iProfile = dev.deviceData.profileindex - 1;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var KeyAssignData = Obj.profileData[iProfile].keybinding;
            var ObjKeyAssign = {
              iProfile,
              KeyAssignData
            };
            var ObjMacroData = {
              MacroData
            };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.setProfileToDevice(dev, (paramDB) => {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Done");
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          var LightingData = Obj.profileData[iProfile].lighting;
          var ObjLighting = {
            iProfile,
            LightingData
          };
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            this.SetLEDBright(dev, ObjLighting, (param25) => {
              this.setProfileToDevice(dev, (paramDB) => {
                dev.ChangingDockedEffect = 0;
                dev.m_bSetHWDevice = false;
                callback("SetKeyMatrix Done");
              });
            });
          });
          break;
        case switchUIflag.performanceflag:
          var PerformanceData = Obj.profileData[iProfile].performance;
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetPerformance(dev, ObjPerformance, (param1) => {
            var ObjActiveDPI = {
              profile: iProfile,
              activeDPI: Obj.profileData[iProfile].performance.dpiSelectIndex
            };
            if (ObjPerformance.PerformanceData.dpiSelectIndex == void 0) {
              ObjActiveDPI.activeDPI = 0;
            }
            this.SetActiveDPIStages2Device(dev, ObjActiveDPI, (param2) => {
              this.setProfileToDevice(dev, (paramDB) => {
                dev.m_bSetHWDevice = false;
                callback("SetKeyMatrix Done");
              });
            });
          });
          break;
      }
    } catch (e) {
      env.log("ModelOSeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  //Send performance data and convert deviceData into Firmware
  SetPerformance(dev, ObjPerformance, callback) {
    env.log(dev.BaseInfo.devicename, "SetPerformance", "Begin");
    var DpiStage = ObjPerformance.PerformanceData.DpiStage;
    var DataDPIStages = Buffer.alloc(65);
    DataDPIStages[0] = ObjPerformance.iProfile + 1;
    DataDPIStages[1] = DpiStage.length;
    for (var i = 0; i < DpiStage.length; i++) {
      DataDPIStages[2 + i * 4 + 0] = DpiStage[i].value >> 8;
      DataDPIStages[2 + i * 4 + 1] = DpiStage[i].value & 255;
      DataDPIStages[2 + i * 4 + 2] = DpiStage[i].value >> 8;
      DataDPIStages[2 + i * 4 + 3] = DpiStage[i].value & 255;
    }
    var DataDPIColor = Buffer.alloc(65);
    DataDPIColor[0] = ObjPerformance.iProfile + 1;
    for (var i = 0; i < DpiStage.length; i++) {
      var DPIColor = this.hexToRgb(DpiStage[i].color);
      DataDPIColor[1 + i * 3 + 0] = DPIColor.color.R;
      DataDPIColor[1 + i * 3 + 1] = DPIColor.color.G;
      DataDPIColor[1 + i * 3 + 2] = DPIColor.color.B;
    }
    var DataCalibration = [];
    if (dev.BaseInfo.SN == "0x258A0x201B" || dev.BaseInfo.SN == "0x258A0x201C" || dev.BaseInfo.SN == "0x258A0x2019" || dev.BaseInfo.SN == "0x258A0x201D" || dev.BaseInfo.SN == "0x258A0x201A") {
      DataCalibration.push(ObjPerformance.iProfile + 1);
    }
    DataCalibration.push(ObjPerformance.PerformanceData.LodValue);
    var DataPollingRate = [];
    var arrNewRateValue = [
      { PollingRate: 125, HIDvalue: 8, translate: "125Hz", Wireless: true },
      { PollingRate: 250, HIDvalue: 4, translate: "250Hz", Wireless: true },
      { PollingRate: 500, HIDvalue: 2, translate: "500Hz", Wireless: true },
      { PollingRate: 1e3, HIDvalue: 1, translate: "1000Hz", Wireless: true },
      { PollingRate: 2e3, HIDvalue: 32, translate: "2000Hz", Wireless: true },
      { PollingRate: 4e3, HIDvalue: 64, translate: "4000Hz", Wireless: true },
      { PollingRate: 8e3, HIDvalue: 128, translate: "8000Hz", Wireless: false }
    ];
    if (dev.BaseInfo.SN == "0x258A0x201D" || dev.BaseInfo.SN == "0x258A0x201B" || dev.BaseInfo.SN == "0x258A0x201C" || dev.BaseInfo.SN == "0x258A0x2019" || dev.BaseInfo.SN == "0x258A0x201A") {
      DataPollingRate.push(ObjPerformance.iProfile + 1);
      const pollingratearray = ObjPerformance.PerformanceData.pollingratearray;
      for (let index = 0; index < pollingratearray.length; index++) {
        var target;
        if (ObjPerformance.PerformanceData.pollingrateSelect == true) {
          target = arrNewRateValue.find((x) => x.PollingRate == pollingratearray[index]);
          DataPollingRate.push(target.Wireless == false && index == 1 ? 64 : target.HIDvalue);
        } else {
          target = arrNewRateValue.find((x) => x.PollingRate == pollingratearray[0]);
          DataPollingRate.push(target.HIDvalue);
          if (pollingratearray.length == 1) {
            DataPollingRate.push(target.Wireless == false ? 64 : target.HIDvalue);
          }
        }
      }
    } else {
      var target = arrNewRateValue.find((x) => x.PollingRate == ObjPerformance.PerformanceData.pollingrate);
      if (target != void 0) {
        DataPollingRate.push(target.HIDvalue);
      }
    }
    var DataDebounce = [];
    DataDebounce.push(ObjPerformance.iProfile + 1);
    if (ObjPerformance.PerformanceData.AdvancedDebounce != void 0) {
      if (ObjPerformance.PerformanceData.AdvancedDebounce.AdvancedSwitch == true) {
        DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.BeforePressValue);
        DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.BeforeReleaseValue);
        DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.AfterPressValue);
        DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.AfterReleaseValue);
        DataDebounce.push(ObjPerformance.PerformanceData.AdvancedDebounce.LiftOffPressValue);
        DataDebounce.push(0);
      } else {
        DataDebounce.push(ObjPerformance.PerformanceData.DebounceValue);
        DataDebounce.push(0);
        DataDebounce.push(0);
        DataDebounce.push(0);
        DataDebounce.push(0);
        DataDebounce.push(0);
      }
    } else {
      DataDebounce.push(ObjPerformance.PerformanceData.DebounceValue);
    }
    var DataMotionSync = Buffer.alloc(2);
    if (ObjPerformance.PerformanceData.MotionSyncFlag != void 0 && (dev.BaseInfo.SN == "0x258A0x201D" || dev.BaseInfo.SN == "0x258A0x201B" || dev.BaseInfo.SN == "0x258A0x201C" || dev.BaseInfo.SN == "0x258A0x2019" || dev.BaseInfo.SN == "0x258A0x201A")) {
      DataMotionSync[0] = ObjPerformance.iProfile + 1;
      DataMotionSync[1] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
    } else {
      DataMotionSync[0] = 255;
    }
    this.SetDPIStages2Device(dev, DataDPIStages, (param1) => {
      this.SetDPIColor2Device(dev, DataDPIColor, (param2) => {
        this.SetCalibration2Device(dev, DataCalibration, (param3) => {
          this.SetPollingRate2Device(dev, DataPollingRate, (param4) => {
            this.SetDebounce2Device(dev, DataDebounce, (param5) => {
              this.SetMotionSync2Device(dev, DataMotionSync, (param6) => {
                callback("SetPerformance Done");
              });
            });
          });
        });
      });
    });
  }
  //Send current DPI stage from frontend
  SetActiveDPIStages2Device(dev, ObjActiveDPI, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 1;
      Data[6] = 2;
      Data[7] = ObjActiveDPI.profile + 1;
      Data[8] = ObjActiveDPI.activeDPI + 1;
      this.SetFeatureReport(dev, Data, 120).then(() => {
        callback("SetActiveDPIStages2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetActiveDPIStages2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetDPIStages2Device(dev, DataBuffer, callback) {
    try {
      var Data = Buffer.alloc(65);
      var iDataNum = DataBuffer[1] * 4 + 2;
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = iDataNum;
      Data[5] = 1;
      Data[6] = 1;
      for (var i = 0; i < 58; i++)
        Data[7 + i] = DataBuffer[i];
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetDPIStages2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetDPIStages2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetDPIColor2Device(dev, DataBuffer, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 19;
      Data[5] = 2;
      Data[6] = 1;
      for (var i = 0; i < 58; i++)
        Data[7 + i] = DataBuffer[i];
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetDPIStages2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetDPIStages2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetCalibration2Device(dev, DataBuffer, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = DataBuffer.length;
      Data[5] = 1;
      if (dev.BaseInfo.SN == "0x258A0x201B" || dev.BaseInfo.SN == "0x258A0x201C" || dev.BaseInfo.SN == "0x258A0x2019" || dev.BaseInfo.SN == "0x258A0x201A" || dev.BaseInfo.SN == "0x258A0x201D") {
        Data[6] = 11;
      } else {
        Data[6] = 8;
      }
      for (var i = 0; i < DataBuffer.length; i++) {
        Data[7 + i] = DataBuffer[i];
      }
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetCalibration2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetCalibration2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetPollingRate2Device(dev, DataBuffer, callback) {
    try {
      if (DataBuffer.length < 1) {
        return callback();
      }
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = DataBuffer.length;
      Data[5] = 1;
      if (dev.BaseInfo.SN == "0x258A0x201B" || dev.BaseInfo.SN == "0x258A0x201D" || dev.BaseInfo.SN == "0x258A0x201C" || dev.BaseInfo.SN == "0x258A0x2019" || dev.BaseInfo.SN == "0x258A0x201A") {
        Data[6] = 10;
      } else {
        Data[6] = 0;
      }
      for (var i = 0; i < DataBuffer.length; i++) {
        Data[7 + i] = DataBuffer[i];
      }
      this.SetFeatureReport(dev, Data, 30).then(() => {
        callback("SetPollingRate2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetPollingRate2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetDebounce2Device(dev, DataBuffer, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = DataBuffer.length;
      Data[5] = 0;
      Data[6] = 8;
      for (var i = 0; i < 58; i++) {
        Data[7 + i] = DataBuffer[i];
      }
      this.SetAndCheckStatus(dev, Data, 50).then(() => {
        callback("SetDebounce2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetDebounce2Device", `Error:${e}`);
    }
  }
  //Send Converted deviceData into Firmware
  SetMotionSync2Device(dev, DataBuffer, callback) {
    try {
      if (DataBuffer[0] == 255) {
        return callback();
      }
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 1;
      Data[6] = 9;
      for (var i = 0; i < 2; i++) {
        Data[7 + i] = DataBuffer[i];
      }
      this.SetAndCheckStatus(dev, Data, 50).then(() => {
        callback();
      });
    } catch (e) {
      env.log("ModelOSeries", "SetMotionSync2Device", `Error:${e}`);
    }
  }
  //-------------------Set Key Function And Macro----------------------
  //Send Macro data and convert deviceData into Firmware
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: MacroData.value, MacroData: BufferKey };
        var DataDelete = Buffer.alloc(65);
        var DataCreate = Buffer.alloc(65);
        DataDelete[0] = 0;
        DataDelete[1] = 0;
        DataDelete[2] = 0;
        DataDelete[3] = 2;
        DataDelete[4] = 2;
        DataDelete[5] = 4;
        DataDelete[6] = 2;
        DataDelete[7] = MacroData.value / 255;
        DataDelete[8] = MacroData.value & 255;
        DataCreate[0] = 0;
        DataCreate[1] = 0;
        DataCreate[2] = 0;
        DataCreate[3] = 2;
        DataCreate[4] = 6;
        DataCreate[5] = 4;
        DataCreate[6] = 1;
        DataCreate[7] = MacroData.value / 255;
        DataCreate[8] = MacroData.value & 255;
        DataCreate[9] = 0;
        DataCreate[10] = 0;
        DataCreate[11] = BufferKey.length / 255;
        DataCreate[12] = BufferKey.length & 255;
        this.SetAndCheckStatus(dev, DataDelete, 50).then(() => {
          this.SetAndCheckStatus(dev, DataCreate, 50).then(() => {
            this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
              SetMacro(iMacro + 1);
            });
          });
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  //Send Converted deviceData into Firmware
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    const SetMacroData = (iMacro) => {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 0;
      Data[5] = 4;
      Data[6] = 3;
      Data[7] = MacroID / 255;
      Data[8] = MacroID & 255;
      var iMaxSize = 51;
      var iOffset = iMacro * iMaxSize;
      if (iOffset < MacroData.length) {
        Data[11] = iOffset / 255;
        Data[12] = iOffset & 255;
        var iSize = MacroData.length % iMaxSize;
        Data[13] = iSize;
        Data[13] = iMaxSize;
        Data[4] = Data[13] + 7;
        for (var k = 0; k < iMaxSize; k++) {
          if (iOffset + k >= MacroData.length)
            break;
          Data[14 + k] = MacroData[iOffset + k];
        }
        var delaytime = 50;
        if (iMacro >= 5)
          delaytime = 70;
        this.SetAndCheckStatus(dev, Data, delaytime).then(() => {
          SetMacroData(iMacro + 1);
        });
      } else {
        callback();
      }
    };
    SetMacroData(0);
  }
  //convert APP Macro Data into deviceData
  MacroToData(MacroData) {
    var BufferKey = [];
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = this.MouseMacroContentMap[Macrokeys[icontent]];
      for (var iData = 0; iData < MacroData.content[this.MouseMacroContentMap[Hashkeys]].data.length; iData++) {
        var MacroEvent = {
          keydown: true,
          key: Hashkeys,
          times: MacroData.content[this.MouseMacroContentMap[Hashkeys]].data[iData].startTime
        };
        DataEvent.push(MacroEvent);
        MacroEvent = {
          keydown: false,
          key: Hashkeys,
          times: MacroData.content[this.MouseMacroContentMap[Hashkeys]].data[iData].endTime
        };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      var bModifyKey = false;
      var bMouseButton = false;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = SupportData.AllFunctionMapping[i].hid;
          break;
        }
      }
      for (var i = 0; i < this.MouseMapping.length; i++) {
        if (DataEvent[iEvent].key == this.MouseMapping[i].code) {
          var Mousehid = this.MouseMapping[i].hid;
          KeyCode = DataEvent[iEvent].keydown ? Mousehid : 0;
          bMouseButton = true;
          break;
        }
      }
      for (var i = 0; i < this.MDFMapping.length; i++) {
        if (DataEvent[iEvent].key == this.MDFMapping[i].code) {
          KeyCode = this.MDFMapping[i].MDFKey;
          bModifyKey = true;
          break;
        }
      }
      var ID;
      if (iEvent > 0) {
        var iDelay = DataEvent[iEvent].times - DataEvent[iEvent - 1].times > 0 ? DataEvent[iEvent].times - DataEvent[iEvent - 1].times : 1;
        ID = iDelay <= 255 ? 32 : 33;
        if (ID == 32) {
          BufferKey.push(ID);
          BufferKey.push(iDelay);
        } else {
          BufferKey.push(ID);
          BufferKey.push(iDelay / 255);
          BufferKey.push(iDelay & 255);
        }
      }
      if (bMouseButton)
        ID = DataEvent[iEvent].keydown ? 1 : 1;
      else if (bModifyKey)
        ID = DataEvent[iEvent].keydown ? 9 : 10;
      else
        ID = DataEvent[iEvent].keydown ? 2 : 3;
      BufferKey.push(ID);
      BufferKey.push(KeyCode);
    }
    return BufferKey;
  }
  //Send Button data and convert deviceData into Firmware
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var iProfile = ObjKeyAssign.iProfile;
    const SetAssignKey = (iButton) => {
      if (iButton < ObjKeyAssign.KeyAssignData.length) {
        var KeyAssignData = ObjKeyAssign.KeyAssignData[iButton];
        var BufferKey = this.KeyAssignToData(KeyAssignData);
        var DataBuffer = Buffer.alloc(58);
        DataBuffer[0] = iProfile + 1;
        DataBuffer[1] = this.ButtonMapping[iButton].ButtonID;
        DataBuffer[2] = 0;
        for (var i = 0; i < BufferKey.length; i++)
          DataBuffer[3 + i] = BufferKey[i];
        var Data = Buffer.alloc(65);
        Data[0] = 0;
        Data[1] = 0;
        Data[2] = 0;
        Data[3] = 2;
        Data[4] = 10;
        Data[5] = 3;
        Data[6] = 0;
        for (var i = 0; i < DataBuffer.length; i++)
          Data[7 + i] = DataBuffer[i];
        return new Promise((resolve) => {
          this.SetAndCheckStatus(dev, Data, 100).then(() => {
            SetAssignKey(iButton + 1);
          });
        });
      } else {
        callback("SetKeyFunction Done");
      }
    };
    SetAssignKey(0);
  }
  //convert APP KeyAssign Data into deviceData
  KeyAssignToData(KeyAssignData) {
    var BufferKey = Buffer.alloc(55);
    switch (KeyAssignData.group) {
      case 1:
        if (KeyAssignData.param == 3) {
          BufferKey[0] = 18;
          BufferKey[1] = 2;
        } else if (KeyAssignData.param == 2) {
          BufferKey[0] = 17;
          BufferKey[1] = 2;
        } else {
          BufferKey[0] = 16;
          BufferKey[1] = 3;
          BufferKey[4] = 1;
        }
        BufferKey[2] = KeyAssignData.function >> 8;
        BufferKey[3] = KeyAssignData.function & 255;
        break;
      case 7:
        for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
          if (KeyAssignData.function == SupportData.AllFunctionMapping[iMap].value) {
            var arrModifiers = [1, 0, 2, 3, 4];
            BufferKey[0] = 4;
            BufferKey[1] = 2;
            BufferKey[2] = 0;
            for (var index = 0; index < KeyAssignData.param.length; index++) {
              if (KeyAssignData.param[index] == true)
                BufferKey[2] |= Math.pow(2, arrModifiers[index]);
            }
            if (SupportData.AllFunctionMapping[iMap].Modifier != void 0)
              BufferKey[2] |= SupportData.AllFunctionMapping[iMap].Modifier;
            else
              BufferKey[3] = SupportData.AllFunctionMapping[iMap].hid;
            break;
          }
        }
        break;
      case 3:
        var arrMouseValue = [1, 1, 2, 3, 5, 4, 16, 17, 24, 25, 12];
        BufferKey[0] = 1;
        BufferKey[1] = 1;
        BufferKey[2] = arrMouseValue[KeyAssignData.function];
        if (arrMouseValue[KeyAssignData.function] == 12) {
          BufferKey[0] = 12;
          BufferKey[2] = 1;
        } else if (arrMouseValue[KeyAssignData.function] == 24) {
          BufferKey[0] = 8;
          BufferKey[2] = 4;
        } else if (arrMouseValue[KeyAssignData.function] == 25) {
          BufferKey[0] = 8;
          BufferKey[2] = 3;
        }
        break;
      case 8:
        BufferKey[0] = 5;
        BufferKey[1] = 2;
        BufferKey[2] = KeyAssignData.value;
        BufferKey[3] = 15;
        break;
      case 4:
        var arrDPIValue = [1, 1, 2, 6, 7, 5];
        BufferKey[0] = 7;
        BufferKey[1] = 1;
        BufferKey[2] = arrDPIValue[KeyAssignData.function];
        if (arrDPIValue[KeyAssignData.function] == 5) {
          var DpiValue = KeyAssignData.param;
          BufferKey[1] = 5;
          BufferKey[2] = 5;
          BufferKey[3] = parseInt(DpiValue) >> 8;
          BufferKey[4] = parseInt(DpiValue) & 255;
          BufferKey[5] = parseInt(DpiValue) >> 8;
          BufferKey[6] = parseInt(DpiValue) & 255;
        }
        break;
      case 5:
        var hidMap = SupportData.MediaMapping[KeyAssignData.function].hidMap;
        BufferKey[0] = 5;
        BufferKey[1] = 2;
        for (var index = 0; index < hidMap.length; index++) {
          BufferKey[2 + index] = hidMap[index];
        }
        break;
      case 2:
        if (KeyAssignData.function == 1) {
          BufferKey[0] = 5;
          BufferKey[1] = 2;
          BufferKey[2] = KeyAssignData.value;
          BufferKey[3] = 15;
        } else if (KeyAssignData.function == 2) {
          BufferKey[0] = 5;
          BufferKey[1] = 2;
          BufferKey[2] = KeyAssignData.value;
          BufferKey[3] = 15;
        } else if (KeyAssignData.function == 3) {
          var hidMap;
          if (KeyAssignData.param == 4) {
            hidMap = [8, 8];
            BufferKey[0] = 4;
            BufferKey[1] = 2;
          } else {
            hidMap = SupportData.WindowsMapping[KeyAssignData.param].hidMap;
            BufferKey[0] = 5;
            BufferKey[1] = 2;
          }
          for (var index = 0; index < hidMap.length; index++) {
            BufferKey[2 + index] = hidMap[index];
          }
        }
        break;
      case 6:
        BufferKey[0] = 0;
        BufferKey[1] = 0;
        break;
    }
    return BufferKey;
  }
  //-------------------Set Key Function End----------------------
  SetAndCheckStatus(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var csFailStasus;
        var rtnData;
        rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, buf);
        const SetCheckStatus = (iTimes) => {
          var WaitCount = 3;
          if (dev.SetFromDB == true) {
            WaitCount = 2;
          } else if (dev.BaseInfo.LEDSetting == false) {
            WaitCount = 10;
          }
          if (iTimes < WaitCount) {
            if (!dev.bwaitForPair) {
              setTimeout(() => {
                rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 65);
                if (rtnData[0] == 162) {
                  csFailStasus = "0xa2-Firmware Command Failure";
                  setTimeout(() => {
                    this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, buf);
                    SetCheckStatus(iTimes + 1);
                  }, 40);
                } else if (rtnData[0] == 160) {
                  csFailStasus = "0xa0-Firmware Command Busy";
                  setTimeout(() => {
                    SetCheckStatus(iTimes + 1);
                  }, 40);
                } else if (rtnData[0] == 164) {
                  csFailStasus = "0xa4-Wireless-Receiver Did Not Find Device";
                  SetCheckStatus(iTimes + 1);
                } else {
                  resolve(rtnData);
                }
              }, iSleep);
            } else {
              dev.arrLostBuffer = buf;
              setTimeout(() => {
                env.log("ModelOSeries", "SetAndCheckStatus", "waitForPair- times:" + iTimes);
                SetCheckStatus(iTimes + 1);
              }, iSleep);
            }
          } else {
            env.log("ModelOSeries", "SetAndCheckStatus", "Fail:" + csFailStasus || rtnData[0]);
            resolve(0);
          }
        };
        SetCheckStatus(0);
      } catch (err) {
        env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  //Send Firmware Data Into node Driver
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, buf);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 65);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  /**
   * Save Device Data to Device
   * @param {*} dev
   */
  SavingProfile2Device(dev) {
    return new Promise((resolve) => {
      var Data = Buffer.alloc(65);
      Data[0] = 7;
      Data[1] = 166;
      Data[2] = 1;
      Data[3] = 75;
      if (m_CurrentData.CurrentSW > 2) {
        Data[6] = 4;
      } else {
        Data[6] = m_CurrentData.CurrentSW + 1;
      }
      this.SetFeatureReport(dev, Data, 5).then(() => {
        resolve("12");
      });
    });
  }
  //
  DockedCharging(dev, Obj, callback) {
    try {
      if (Obj.Charging != dev.ChangingDockedEffect) {
        dev.ChangingDockedEffect = Obj.Charging;
        var iProfile = dev.deviceData.profileindex - 1;
        var ProfileData = dev.deviceData.profile[iProfile];
        var LightingData;
        if (dev.ChangingDockedEffect) {
          LightingData = ProfileData.templighting[5];
        } else {
          LightingData = ProfileData.lighting;
        }
        var ObjLighting = {
          iProfile,
          LightingData
        };
        this.SetLEDEffect(dev, ObjLighting, (param1) => {
        });
      }
      callback("DockedCharging Done");
    } catch (e) {
      env.log("ModelOSeries", "DockedCharging", `Error:${e}`);
    }
  }
  //------------------Dongle Pairing--------------------------
  //Start Dongle Pairing For MOW2 Pro Series
  DongleParingStart(dev, AssignSN, callback) {
    env.log("ModelOSeries", "DongleParingStart", "Begin");
    if (env.BuiltType == 1) {
      return callback("DongleParingStart Done");
    }
    if (dev.BaseInfo.SN != "0x258A0x201B" && dev.BaseInfo.SN != "0x258A0x201C" && dev.BaseInfo.SN != "0x258A0x2019" && dev.BaseInfo.SN != "0x258A0x201A" && dev.BaseInfo.SN != "0x258A0x201D" && dev.BaseInfo.SN != "0x258A0x2037" && dev.BaseInfo.SN != "0x258A0x2038") {
      return callback("DongleParingStart Done");
    }
    this.DeleteBatteryTimeout(dev, 0, () => {
    });
    try {
      var res = this.modelO2ProPairing.OpenDongleDevice(dev);
      if (res && dev.BaseInfo.pairingFlag != void 0 && dev.BaseInfo.pairingFlag == 3) {
        this.modelO2ProPairing.StartRFDevicePairing(dev, (res2) => {
          if (res2 == true && dev.TimerWait4K8KParing == void 0) {
            dev.TimerWait4K8KParing = setInterval(() => this.OnTimerWait4K8KPairing(dev, AssignSN), 2e3);
          }
        });
      } else if (res) {
        this.modelO2ProPairing.CheckPairingAddress(dev, (res2, arrAddress) => {
          if (res2 == true) {
            setTimeout(() => {
              this.PairingSuccess(dev);
            }, 500);
          } else {
            this.modelO2ProPairing.SetAddresstoDongle(dev, arrAddress, (res3) => {
              this.modelO2ProPairing.SetVIDPIDtoDongle(dev, (res4) => {
                this.modelO2ProPairing.ResetDongle(dev, (res5) => {
                  this.OnTimerWaitParing(dev);
                });
              });
            });
          }
        });
      } else {
        this.PairingFail(dev, false);
        env.log("ModelOSeries", dev.BaseInfo.devicename, "Cannot find Dongle Device");
      }
      callback();
    } catch (e) {
      env.log("ModelOSeries", "DongleParingStart", `Error:${e}`);
      this.PairingFail(dev, false);
      callback();
    }
  }
  OnTimerWaitParing(dev) {
    dev.TimerWaitParing = setInterval(() => {
      var res = this.modelO2ProPairing.OpenDongleDevice(dev);
      if (res) {
        this.modelO2ProPairing.CheckPairingAddress(dev, (res1) => {
          if (res1 == true) {
            clearInterval(dev.TimerWaitParing);
            this.PairingSuccess(dev);
          }
        });
      }
    }, 2e3);
  }
  OnTimerWait4K8KPairing(dev, AssignSN) {
    var res = this.modelO2ProPairing.OpenDongleDevice(dev);
    if (!res && AssignSN != void 0) {
      clearInterval(dev.TimerWait4K8KParing);
      this.PairingSuccess(dev);
    } else if (res) {
      this.modelO2ProPairing.GetRFDevicePairingStatus(dev, (res1) => {
        if (res1 == 1) {
          clearInterval(dev.TimerWait4K8KParing);
          this.PairingSuccess(dev);
        } else if (res1 == -1) {
          clearInterval(dev.TimerWait4K8KParing);
          this.PairingFail(dev, false);
        }
      });
    }
  }
  //-------------Pairing For MOWPro V2 Series-------------------------
  PairingFail(dev, bRefresh) {
    dev.m_bDonglepair = false;
    if (bRefresh) {
      this.RefreshPlugDevice(dev, dev.BaseInfo, (ObjResult) => {
      });
    }
    var Obj2 = {
      Func: "PairingFail",
      SN: dev.BaseInfo.SN,
      Param: {}
    };
    this.emit(EventTypes.ProtocolMessage, Obj2);
  }
  PairingSuccess(dev) {
    dev.m_bDonglepair = false;
    var Obj2 = {
      Func: "PairingSuccess",
      SN: dev.BaseInfo.SN,
      Param: {}
    };
    this.emit(EventTypes.ProtocolMessage, Obj2);
    env.log(dev.BaseInfo.devicename, "CheckDetectfromDevice", "PairingSuccess");
  }
}
module.exports = ModelOSeries;
class ModelOV2Series extends Mouse {
  static #instance;
  m_bSetFWEffect;
  m_bSetHWDevice;
  LEDType;
  MouseMapping;
  constructor(hid) {
    env.log("ModelOV2Series", "ModelOV2Series class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.m_bSetHWDevice = false;
    this.hid = hid;
    this.LEDType = [
      { EffectID: 0, HidEffectID: 1, ColorIndexID: 255, value: "GloriousMode" },
      { EffectID: 1, HidEffectID: 2, ColorIndexID: 255, value: "SeamlessBreathing" },
      { EffectID: 2, HidEffectID: 3, ColorIndexID: 0, value: "Breathing" },
      { EffectID: 3, HidEffectID: 4, ColorIndexID: 6, value: "SingleColor" },
      { EffectID: 4, HidEffectID: 5, ColorIndexID: 7, value: "BreathingSingleColor" },
      { EffectID: 5, HidEffectID: 6, ColorIndexID: 255, value: "Tail" },
      { EffectID: 6, HidEffectID: 7, ColorIndexID: 8, value: "Rave" },
      { EffectID: 7, HidEffectID: 8, ColorIndexID: 255, value: "Wave" },
      { EffectID: 8, HidEffectID: 0, ColorIndexID: 255, value: "LEDOFF" }
    ];
    this.MouseMapping = [
      { keyCode: "16", value: "Left Click", hid: 183, code: 1 },
      { keyCode: "17", value: "Scroll Click", hid: 185, code: 3 },
      { keyCode: "18", value: "Right Click", hid: 184, code: 2 },
      { keyCode: "91", value: "Back Key", hid: 186, code: 4 },
      { keyCode: "92", value: "Forward Key", hid: 187, code: 5 }
    ];
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelOV2Series", "getInstance", `Get exist ModelOV2Series() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelOV2Series", "getInstance", `New ModelOV2Series() INSTANCE`);
      this.#instance = new ModelOV2Series(hid);
      return this.#instance;
    }
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    try {
      env.log("ModelOV2Series", "initDevice", "Begin");
      dev.bwaitForPair = false;
      dev.m_bSetHWDevice = false;
      dev.m_bDonglepair = false;
      if (dev.BaseInfo.SN == "0x093A0x821A") {
        dev.ButtonMapping = [
          { ButtonID: 0, HidButtonID: 0, value: "LeftClick" },
          { ButtonID: 1, HidButtonID: 2, value: "ScorllClick" },
          { ButtonID: 2, HidButtonID: 1, value: "RightClick" },
          { ButtonID: 3, HidButtonID: 4, value: "Forward" },
          { ButtonID: 4, HidButtonID: 3, value: "Backward" },
          { ButtonID: 5, HidButtonID: 8, value: "DPI UP" },
          //DPISwitch->DPI UP
          { ButtonID: 6, HidButtonID: 255, value: "Scroll Up" },
          { ButtonID: 7, HidButtonID: 255, value: "Scroll Down" },
          { ButtonID: 8, HidButtonID: 6, value: "DPI Lock" },
          //(Big Side Button)
          { ButtonID: 9, HidButtonID: 5, value: "HOME" },
          //(Former Side Button)
          { ButtonID: 10, HidButtonID: 7, value: "DPI Down" }
        ];
      } else {
        dev.ButtonMapping = [
          { ButtonID: 0, HidButtonID: 0, value: "LeftClick" },
          { ButtonID: 1, HidButtonID: 2, value: "ScorllClick" },
          { ButtonID: 2, HidButtonID: 1, value: "RightClick" },
          { ButtonID: 3, HidButtonID: 4, value: "Forward" },
          { ButtonID: 4, HidButtonID: 3, value: "Backward" },
          { ButtonID: 5, HidButtonID: 5, value: "DPISwitch" },
          { ButtonID: 6, HidButtonID: 6, value: "Scroll Up" },
          { ButtonID: 7, HidButtonID: 7, value: "Scroll Down" }
        ];
      }
      dev.BaseInfo.version_Wireless = "0001";
      if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
        dev.BaseInfo.version_Wired = "0001";
        callback(0);
      } else if (env.BuiltType == 0) {
        this.SetProfileDataFromDB(dev, 0, () => {
          callback(0);
        });
      } else {
        dev.BaseInfo.version_Wired = "0001";
        callback(0);
      }
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "InitialDevice", `Error:${e}`);
      callback(0);
    }
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    const SetProfileData = (iProfile) => {
      var ProfileData = dev.deviceData.profile[iProfile];
      if (iProfile < 3 && ProfileData != void 0) {
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
          iProfile,
          KeyAssignData,
          KeyAssignDataLayerShift: void 0
        };
        if (dev.BaseInfo.SN == "0x093A0x821A") {
          ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
        }
        var ObjLighting = {
          iProfile,
          LightingData
        };
        var ObjPerformance = {
          iProfile,
          PerformanceData
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param3) => {
            this.SetPerformance(dev, ObjPerformance, (param4) => {
              SetProfileData(iProfile + 1);
            });
          });
        });
      } else {
        this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
          setTimeout(() => {
            this.SetSleepTimeFromDataBase(dev, 0, (paramDB2) => {
              callback("SetProfileDataFromDB Finish");
            });
          }, 1e3);
        });
      }
    };
    SetProfileData(0);
  }
  ChangeProfileID(dev, Obj, callback) {
    env.log("ModelOV2Series", "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Finish");
        return;
      }
      var Data = Buffer.alloc(64);
      Data[0] = 3;
      Data[1] = 1;
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        Data[2] = 251;
      } else {
        Data[2] = 250;
      }
      Data[3] = Obj;
      this.SetFeatureReport(dev, Data, 50).then(() => {
        dev.deviceData.profileindex = Obj;
        this.setProfileToDevice(dev, () => {
          callback("ChangeProfileID Finish");
        });
      });
    } catch (e) {
      env.log("ModelOV2Series", "ChangeProfileID", `Error:${e}`);
      callback();
    }
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex - 1;
    var ProfileData = dev.deviceData.profile[iProfile];
    var KeyAssignData = ProfileData.keybinding;
    var LightingData = ProfileData.lighting;
    var PerformanceData = ProfileData.performance;
    var ObjKeyAssign = {
      iProfile,
      KeyAssignData,
      KeyAssignDataLayerShift: void 0
    };
    var ObjLighting = {
      iProfile,
      LightingData
    };
    var ObjPerformance = {
      iProfile,
      PerformanceData
    };
    if (dev.BaseInfo.SN == "0x093A0x821A" && ProfileData.keybindingLayerShift != void 0) {
      ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
    }
    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
      this.SetLEDEffect(dev, ObjLighting, (param2) => {
        this.SetPerformance(dev, ObjPerformance, (param3) => {
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var ObjMacroData = { MacroData };
            this.SetMacroFunction(dev, ObjMacroData, (param22) => {
              callback("SetProfileDataFromDB Finish");
            });
          });
        });
      });
    });
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 6 && ObjData[1] == 246) {
      dev.deviceData.profileindex = ObjData[2];
      var iProfile = ObjData[2];
      env.log("ModelOV2Series", "HIDEP2Data-SwitchProfile", iProfile);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: dev.BaseInfo.SN,
          Profile: iProfile,
          ModelType: dev.BaseInfo.ModelType
          //Mouse:1,Keyboard:2,Dock:4
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 6 && ObjData[1] == 249 && ObjData[2] >= 128) {
      var target = dev.ButtonMapping.find((x) => x.HidButtonID == ObjData[3]);
      var iIndex = target.ButtonID;
      var bLayershift = ObjData[4];
      this.LaunchProgram(dev, iIndex, bLayershift);
    } else if (ObjData[0] == 6 && ObjData[1] == 251) {
      if (ObjData[2] < 0 || ObjData[2] > 100) {
        return;
      }
      var ObjBattery = {
        Status: 0,
        Battery: ObjData[2],
        Charging: ObjData[3],
        SN: dev.BaseInfo.SN
      };
      var Obj2 = {
        Func: EventTypes.GetBatteryStats,
        SN: dev.BaseInfo.SN,
        Param: ObjBattery
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey, bLayershift) {
    var iProfile = dev.deviceData.profileindex - 1;
    var KeyAssignData;
    if (dev.BaseInfo.SN == "0x093A0x821A" && bLayershift) {
      KeyAssignData = dev.deviceData.profile[iProfile].keybindingLayerShift[iKey];
    } else {
      KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];
    }
    switch (KeyAssignData.group) {
      case 2:
        if (KeyAssignData.function == 1) {
          var csProgram = KeyAssignData.param;
          if (csProgram != "")
            this.RunApplication(csProgram);
        } else if (KeyAssignData.function == 2) {
          var csProgram = KeyAssignData.param;
          if (csProgram != null && csProgram.trim() != "") {
            this.RunWebSite(GetValidURL(csProgram));
          }
        } else if (KeyAssignData.function == 3)
          ;
        break;
      case 8:
        if (KeyAssignData.function == 1) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 2) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 3) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 4) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        break;
    }
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVersion = verRev.padStart(4, "0");
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        dev.BaseInfo.version_Wired = "99.99.99.99";
        dev.BaseInfo.version_Wireless = strVersion;
      } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        dev.BaseInfo.version_Wired = "99.99.99.99";
        dev.BaseInfo.version_Wireless = strVersion;
      } else {
        dev.BaseInfo.version_Wired = strVersion;
        dev.BaseInfo.version_Wireless = "99.99.99.99";
      }
      callback(strVersion);
    } catch (e) {
      env.log("ModelOV2Series", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("ModelOV2Series", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.profileData;
    var iProfile = dev.deviceData.profileindex - 1;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Finish");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var KeyAssignData = Obj.profileData[iProfile].keybinding;
            var ObjKeyAssign = {
              iProfile,
              KeyAssignData,
              KeyAssignDataLayerShift: void 0
            };
            if (dev.BaseInfo.SN == "0x093A0x821A") {
              ObjKeyAssign.KeyAssignDataLayerShift = Obj.profileData[iProfile].keybindingLayerShift;
            }
            var ObjMacroData = { MacroData };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.setProfileToDevice(dev, (paramDB) => {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Finish");
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          var LightingData = Obj.profileData[iProfile].lighting;
          var ObjLighting = {
            iProfile,
            LightingData
          };
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Finish");
            });
          });
          break;
        case switchUIflag.performanceflag:
          var PerformanceData = Obj.profileData[iProfile].performance;
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetPerformance(dev, ObjPerformance, (param1) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Finish");
            });
          });
          break;
      }
    } catch (e) {
      env.log("ModelOV2Series", "SetKeyMatrix", `Error:${e}`);
    }
  }
  //Send performance data and convert deviceData into Firmware
  SetPerformance(dev, ObjPerformance, callback) {
    var iSleeptime = 30;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      iSleeptime = 500;
    }
    setTimeout(() => {
      this.SetPerformance2Device(dev, ObjPerformance, (param1) => {
        callback("SetPerformance Finish");
      });
    }, iSleeptime);
  }
  //Send current DPI stage from frontend
  SetPerformance2Device(dev, ObjPerformance, callback) {
    var Data = Buffer.alloc(64);
    var iProfile = ObjPerformance.iProfile;
    var DataPerformance = this.PerformanceToData(dev, ObjPerformance);
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      const SetAp = (j) => {
        if (j < 4) {
          Data = Buffer.alloc(64);
          Data[0] = 5;
          Data[1] = 4;
          Data[2] = j;
          Data[3] = iProfile + 1;
          if (j == 0) {
            for (var i2 = 0; i2 < 11; i2++)
              Data[4 + i2] = DataPerformance[i2];
          } else {
            for (var i2 = 0; i2 < 10; i2++)
              Data[4 + i2] = DataPerformance[11 + 10 * (j - 1) + i2];
          }
          this.SetFeatureReport(dev, Data, 30).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SetPerformance2Device Finish");
        }
      };
      SetAp(0);
    } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      const SetAp = (j) => {
        if (j < 4) {
          Data = Buffer.alloc(64);
          Data[0] = 3;
          Data[1] = 4;
          Data[2] = 251;
          Data[3] = j;
          Data[4] = iProfile + 1;
          if (j == 0) {
            for (var i2 = 0; i2 < 11; i2++)
              Data[5 + i2] = DataPerformance[i2];
          } else {
            for (var i2 = 0; i2 < 10; i2++)
              Data[5 + i2] = DataPerformance[11 + 10 * (j - 1) + i2];
          }
          this.SetFeatureReport(dev, Data, 150).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SetPerformance2Device Finish");
        }
      };
      SetAp(0);
    } else {
      Data[0] = 3;
      Data[1] = 4;
      Data[2] = 250;
      Data[3] = iProfile + 1;
      for (var i = 0; i < 256; i++)
        Data[4 + i] = DataPerformance[i];
      this.SetFeatureReport(dev, Data, 150).then(() => {
        callback("SetPerformance2Device Finish");
      });
    }
  }
  PerformanceToData(dev, ObjPerformance) {
    var DataBuffer = Buffer.alloc(256);
    var DpiStage = ObjPerformance.PerformanceData.DpiStage;
    if (ObjPerformance.PerformanceData.dpiSelectIndex != void 0) {
      DataBuffer[0] = ObjPerformance.PerformanceData.dpiSelectIndex;
    }
    DataBuffer[1] = DpiStage.length;
    DataBuffer[2] = ObjPerformance.PerformanceData.LodValue;
    DataBuffer[3] = ObjPerformance.PerformanceData.DebounceValue;
    var arrRate = [125, 250, 500, 1e3];
    var arrRateValue = [1, 2, 3, 4];
    var PollingRate = arrRate.indexOf(
      ObjPerformance.PerformanceData.pollingrate != null && typeof ObjPerformance.PerformanceData.pollingrate === "string" ? parseInt(ObjPerformance.PerformanceData.pollingrate) : ObjPerformance.PerformanceData.pollingrate
    );
    if (PollingRate != -1) {
      DataBuffer[4] = arrRateValue[PollingRate];
    }
    DataBuffer[5] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle" || dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      for (var i = 0; i < DpiStage.length; i++) {
        var DpiValue = DpiStage[i].value / 50;
        DataBuffer[6 + i * 5 + 1] = DpiValue >> 8;
        DataBuffer[6 + i * 5 + 0] = DpiValue & 255;
        var DPIColor = this.hexToRgb(DpiStage[i].color);
        DataBuffer[6 + i * 5 + 2] = DPIColor.color.R;
        DataBuffer[6 + i * 5 + 3] = DPIColor.color.G;
        DataBuffer[6 + i * 5 + 4] = DPIColor.color.B;
      }
    } else {
      for (var i = 0; i < DpiStage.length; i++) {
        var DpiValue = DpiStage[i].value / 50;
        DataBuffer[12 + i * 8 + 1] = DpiValue >> 8;
        DataBuffer[12 + i * 8 + 0] = DpiValue & 255;
        var DPIColor = this.hexToRgb(DpiStage[i].color);
        DataBuffer[12 + i * 8 + 2] = DPIColor.color.R;
        DataBuffer[12 + i * 8 + 3] = DPIColor.color.G;
        DataBuffer[12 + i * 8 + 4] = DPIColor.color.B;
      }
    }
    return DataBuffer;
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var ObjBufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: ObjBufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Finish");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroDataKey = ObjMacroData.MacroData.BufferKey;
    var MacroActionCount = ObjMacroData.MacroData.ActionCount;
    if (MacroActionCount == 0) {
      MacroActionCount = 1;
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var byteAction = Math.ceil(MacroActionCount / 3);
      const SetAp = (j) => {
        if (j < byteAction) {
          var Data = Buffer.alloc(64);
          Data[0] = 5;
          Data[1] = 5;
          Data[2] = MacroID - 1;
          Data[3] = j;
          Data[4] = byteAction;
          Data[5] = MacroActionCount;
          for (var i = 0; i < 9; i++)
            Data[6 + i] = MacroDataKey[9 * j + i];
          this.SetFeatureReport(dev, Data, 30).then(function() {
            SetAp(j + 1);
          });
        } else {
          callback("SetMacroDataToDevice Finish");
        }
      };
      SetAp(0);
    } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      var byteAction = Math.ceil(MacroActionCount / 3);
      const SetAp = (j) => {
        if (j < byteAction) {
          var Data = Buffer.alloc(64);
          Data[0] = 3;
          Data[1] = 5;
          Data[2] = 251;
          Data[3] = MacroID - 1;
          Data[4] = j;
          Data[5] = byteAction;
          Data[6] = MacroActionCount;
          for (var i = 0; i < 9; i++)
            Data[7 + i] = MacroDataKey[9 * j + i];
          this.SetFeatureReport(dev, Data, 30).then(() => {
            SetAp(j + 1);
          });
        } else {
          setTimeout(() => {
            callback("SetMacroDataToDevice Finish");
          }, 200);
        }
      };
      SetAp(0);
    } else {
      var byteAction = Math.ceil(MacroActionCount / 18);
      const SetAp = (j) => {
        if (j < byteAction) {
          var Data = Buffer.alloc(64);
          Data[0] = 3;
          Data[1] = 5;
          Data[2] = 250;
          Data[3] = MacroID - 1;
          Data[4] = j;
          Data[5] = byteAction;
          Data[6] = MacroActionCount;
          for (var i = 0; i < 54; i++)
            Data[8 + i] = MacroDataKey[54 * j + i];
          this.SetFeatureReport(dev, Data, 30).then(function() {
            SetAp(j + 1);
          });
        } else {
          callback("SetMacroDataToDevice Finish");
        }
      };
      SetAp(0);
    }
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(256);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = {
          keydown: true,
          key: Hashkeys,
          times: MacroData.content[Hashkeys].data[iData].startTime
        };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    for (let iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      const currentEvent = DataEvent[iEvent];
      let KeyCode = SupportData.AllFunctionMapping.find((value) => value.code == currentEvent.key)?.hid ?? 0;
      KeyCode = this.MouseMapping.find((value) => value.code == KeyCode)?.hid ?? KeyCode;
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[iEvent * 3 + 0] += 128;
      BufferKey[iEvent * 3 + 1] = iDelay & 255;
      BufferKey[iEvent * 3 + 2] = KeyCode;
    }
    var ObjMacroData = { BufferKey, ActionCount: DataEvent.length };
    return ObjMacroData;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      DataBuffer
    };
    if (dev.BaseInfo.SN == "0x093A0x821A") {
      var KeyAssignData2 = ObjKeyAssign.KeyAssignDataLayerShift;
      KeyAssignData2.layershift = true;
      var DataBuffer2 = this.KeyAssignToData(dev, KeyAssignData2);
      for (let index = 0; index < 36; index++) {
        DataBuffer[36 + index] = DataBuffer2[index];
      }
    }
    this.SendButtonMatrix2Device(dev, Obj1, function() {
      callback("SetKeyFunction Finish");
    });
  }
  SendButtonMatrix2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var Data = Buffer.alloc(64);
    var DataBuffer = Obj.DataBuffer;
    var IndexCount_USB = 1;
    var IndexCount_Wireless = 2;
    if (dev.BaseInfo.SN == "0x093A0x821A") {
      IndexCount_Wireless = 6;
      IndexCount_USB = 2;
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      const SetAp = (j) => {
        if (j < IndexCount_Wireless) {
          Data = Buffer.alloc(64);
          Data[0] = 5;
          Data[1] = 3;
          Data[2] = j;
          Data[3] = iProfile + 1;
          for (var i = 0; i < 12; i++)
            Data[4 + i] = DataBuffer[12 * j + i];
          this.SetFeatureReport(dev, Data, 30).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SendButtonMatrix2Device Finish");
        }
      };
      SetAp(0);
    } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
      const SetAp = (j) => {
        if (j < IndexCount_Wireless) {
          Data = Buffer.alloc(64);
          Data[0] = 3;
          Data[1] = 3;
          Data[2] = 251;
          Data[3] = j;
          Data[4] = iProfile + 1;
          for (var i = 0; i < 12; i++)
            Data[5 + i] = DataBuffer[12 * j + i];
          this.SetFeatureReport(dev, Data, 150).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SendButtonMatrix2Device Finish");
        }
      };
      SetAp(0);
    } else {
      const SetAp = (j) => {
        if (j < IndexCount_USB) {
          Data[0] = 3;
          Data[1] = 3;
          Data[2] = 250;
          Data[3] = iProfile + 1;
          if (dev.BaseInfo.SN == "0x093A0x821A") {
            Data[4] = j;
          }
          for (var i = 0; i < 36; i++)
            Data[8 + i] = DataBuffer[36 * j + i];
          this.SetFeatureReport(dev, Data, 100).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SendButtonMatrix2Device Finish");
        }
      };
      SetAp(0);
    }
  }
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(256);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var target = dev.ButtonMapping.find((x) => x.ButtonID == i);
      var iIndex = target.HidButtonID;
      var Temp_BtnData = KeyAssignData[i];
      switch (Temp_BtnData.group) {
        case 1:
          DataBuffer[iIndex * 4 + 0] = 31 + Temp_BtnData.function;
          if (Temp_BtnData.param == 3) {
            DataBuffer[iIndex * 4 + 1] = 225;
          } else if (Temp_BtnData.param == 2) {
            DataBuffer[iIndex * 4 + 1] = 224;
          } else {
            DataBuffer[iIndex * 4 + 1] = 1;
          }
          break;
        case 7:
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnData.function == SupportData.AllFunctionMapping[iMap].value) {
              var arrModifiers = [1, 0, 2, 3, 4];
              DataBuffer[iIndex * 4 + 0] = 2;
              for (var index = 0; index < Temp_BtnData.param.length; index++) {
                if (Temp_BtnData.param[index] == true)
                  DataBuffer[iIndex * 4 + 1] |= Math.pow(2, arrModifiers[index]);
              }
              DataBuffer[iIndex * 4 + 2] = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          break;
        case 3:
          var arrMouseValue = [1, 1, 2, 3, 5, 4, 160, 161, 177, 176, 119];
          DataBuffer[iIndex * 4 + 0] = 1;
          DataBuffer[iIndex * 4 + 1] = arrMouseValue[Temp_BtnData.function];
          if (arrMouseValue[Temp_BtnData.function] == 119) {
            DataBuffer[iIndex * 4 + 0] = 119;
            DataBuffer[iIndex * 4 + 1] = 0;
          } else if (Temp_BtnData.function == 11) {
            DataBuffer[iIndex * 4 + 0] = 136;
            DataBuffer[iIndex * 4 + 1] = 0;
          }
          break;
        case 8:
          DataBuffer[iIndex * 4 + 0] = 4;
          DataBuffer[iIndex * 4 + 1] = 1;
          break;
        case 4:
          var arrDPIValue = [1, 1, 2, 3, 4, 5];
          DataBuffer[iIndex * 4 + 0] = 102;
          DataBuffer[iIndex * 4 + 1] = arrDPIValue[Temp_BtnData.function];
          if (arrDPIValue[Temp_BtnData.function] == 5) {
            var DpiValue = parseInt(Temp_BtnData.param) / 50;
            DataBuffer[iIndex * 4 + 3] = DpiValue >> 8;
            DataBuffer[iIndex * 4 + 2] = DpiValue & 255;
          }
          break;
        case 5:
          var hidMap = SupportData.MediaMapping[Temp_BtnData.function].hidMap;
          DataBuffer[iIndex * 4 + 0] = 3;
          for (var iTemp = 0; iTemp < hidMap.length; iTemp++) {
            DataBuffer[iIndex * 4 + 2 - iTemp] = hidMap[iTemp];
          }
          break;
        case 2:
          if (Temp_BtnData.function == 1) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 2) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 3) {
            var hidMap;
            if (Temp_BtnData.param == 4) {
              hidMap = [8, 8];
              DataBuffer[iIndex * 4 + 0] = 2;
            } else {
              hidMap = SupportData.WindowsMapping[Temp_BtnData.param].hidMap;
              DataBuffer[iIndex * 4 + 0] = 3;
            }
            for (var index = 0; index < hidMap.length; index++) {
              DataBuffer[iIndex * 4 + 2 - index] = hidMap[index];
            }
          }
          break;
        case 6:
          DataBuffer[iIndex * 4 + 0] = 0;
          DataBuffer[iIndex * 4 + 1] = 0;
          break;
        default:
          DataBuffer[iIndex * 4] = 255;
          break;
      }
    }
    return DataBuffer;
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("ModelOV2Series", "SetLEDEffect", "Begin");
    try {
      var ObjEffectData = { iProfile: Obj.iProfile, Data: Obj.LightingData };
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        callback("SetLEDEffect Finish");
      });
    } catch (e) {
      env.log("ModelOV2Series", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(64);
      var iProfile = ObjEffectData.iProfile;
      var iIndex = this.LEDType.findIndex((x) => x.EffectID == ObjEffectData.Data.Effect);
      var HidEffectID = this.LEDType[iIndex].HidEffectID;
      var DataBuffer = this.LEDEffectToData(dev, ObjEffectData);
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[0] = 5;
        Data[1] = 2;
        Data[2] = 0;
        Data[3] = iProfile + 1;
        Data[4] = HidEffectID;
        for (var i = 0; i < 11; i++)
          Data[5 + i] = DataBuffer[0 + i];
        this.SetFeatureReport(dev, Data, 30).then(() => {
          Data[2] = 1;
          for (var i2 = 0; i2 < 12; i2++)
            Data[5 + i2] = DataBuffer[11 + i2];
          this.SetFeatureReport(dev, Data, 30).then(() => {
            callback("SetLEDEffectToDevice Finish");
          });
        });
      } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        Data[0] = 3;
        Data[1] = 2;
        Data[2] = 251;
        Data[3] = 0;
        Data[4] = iProfile + 1;
        Data[5] = HidEffectID;
        for (var i = 0; i < 8; i++)
          Data[6 + i] = DataBuffer[0 + i];
        this.SetFeatureReport(dev, Data, 280).then(() => {
          Data[3] = 1;
          for (var i2 = 0; i2 < 9; i2++)
            Data[6 + i2] = DataBuffer[8 + i2];
          this.SetFeatureReport(dev, Data, 280).then(() => {
            Data[3] = 2;
            for (var i3 = 0; i3 < 9; i3++)
              Data[6 + i3] = DataBuffer[8 + 9 + i3];
            this.SetFeatureReport(dev, Data, 280).then(() => {
              callback("SetLEDEffectToDevice Finish");
            });
          });
        });
      } else {
        Data[0] = 3;
        Data[1] = 2;
        Data[2] = 250;
        Data[3] = iProfile + 1;
        Data[4] = HidEffectID;
        for (var i = 0; i < 29; i++)
          Data[5 + i] = DataBuffer[0 + i];
        this.SetFeatureReport(dev, Data, 100).then(() => {
          callback("SetLEDEffectToDevice Finish");
        });
      }
    } catch (e) {
      env.log("ModelOV2Series", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  LEDEffectToData(dev, ObjEffectData) {
    var DataBuffer = Buffer.alloc(256);
    DataBuffer[0] = ObjEffectData.Data.RateValue > 0 ? ObjEffectData.Data.RateValue * 20 / 100 : 1;
    DataBuffer[1] = ObjEffectData.Data.WiredBrightnessValue * 20 / 100;
    if (ObjEffectData.Data.SepatateCheckValue) {
      DataBuffer[4] = ObjEffectData.Data.WirelessBrightnessValue * 20 / 100;
    } else {
      DataBuffer[4] = ObjEffectData.Data.WiredBrightnessValue * 20 / 100;
    }
    DataBuffer[3] = ObjEffectData.Data.RateValue > 0 ? ObjEffectData.Data.RateValue * 20 / 100 : 1;
    var Colors = ObjEffectData.Data.Color;
    var ColorCount = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle" || dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      for (var index = 0; index < Colors.length; index++) {
        if (Colors[index].flag == true) {
          DataBuffer[5 + ColorCount * 3 + 0] = Colors[index].R;
          DataBuffer[5 + ColorCount * 3 + 1] = Colors[index].G;
          DataBuffer[5 + ColorCount * 3 + 2] = Colors[index].B;
          ColorCount++;
        }
      }
    } else {
      for (var index = 0; index < Colors.length; index++) {
        if (Colors[index].flag == true) {
          DataBuffer[11 + ColorCount * 3 + 0] = Colors[index].R;
          DataBuffer[11 + ColorCount * 3 + 1] = Colors[index].G;
          DataBuffer[11 + ColorCount * 3 + 2] = Colors[index].B;
          ColorCount++;
        }
      }
    }
    DataBuffer[2] = ColorCount > 0 ? ColorCount : 0;
    return DataBuffer;
  }
  //Set Sleep Time Into Device
  SetSleepTimetoDevice(dev, Obj, callback) {
    try {
      if (dev.m_bSetHWDevice) {
        env.log(dev.BaseInfo.devicename, "SetSleepTimetoDevice", "Device Has Setting,Stop Forward");
        callback(false);
        return;
      }
      dev.sleep = Obj.sleep;
      dev.sleeptime = Obj.sleeptime;
      var DataSleeptime;
      if (Obj.sleep) {
        var iSleeptime = Obj.sleeptime;
        DataSleeptime = iSleeptime & 255;
      } else {
        DataSleeptime = 255;
      }
      var Data = Buffer.alloc(64);
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[0] = 5;
        Data[1] = 6;
        Data[2] = DataSleeptime;
      } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        Data[0] = 3;
        Data[1] = 6;
        Data[2] = 251;
        Data[3] = DataSleeptime;
      } else {
        Data[0] = 3;
        Data[1] = 6;
        Data[2] = 250;
        Data[3] = DataSleeptime;
      }
      this.SetFeatureReport(dev, Data, 30).then(function() {
        callback("SetSleepTimetoDevice Finish");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetSleepTimetoDevice", `Error:${e}`);
    }
  }
  //Get Device Battery Status From Device
  GetDeviceBatteryStats(dev, ObjDelay, callback) {
    try {
      if (dev.m_bSetHWDevice || dev.m_bSetHWDevice == void 0 || dev.m_bDonglepair == true) {
        callback(false);
        return;
      }
      var Data = Buffer.alloc(64);
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[0] = 5;
        Data[1] = 8;
        Data[2] = 20;
      } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
        Data[0] = 3;
        Data[1] = 8;
        Data[2] = 251;
        Data[3] = 20;
      } else {
        Data[0] = 3;
        Data[1] = 8;
        Data[2] = 250;
        Data[3] = 20;
      }
      const GetDeviceBattery = (iCheck) => {
        if (iCheck < 3) {
          this.SetFeatureReport(dev, Data, 50).then(() => {
            this.GetFeatureReport(dev, Data, 50).then((rtnData) => {
              var Status = "";
              if (rtnData[2 - 1] != 20)
                Status = "Not BatteryStats Status";
              else if (rtnData[3 - 1] == 255)
                GetDeviceBattery(iCheck + 1);
              else {
                if (Status != "") {
                  env.log(dev.BaseInfo.devicename, "GetDeviceBatteryStats", "Fail-Status:" + Status);
                  callback(false);
                } else {
                  if (rtnData[3 - 1] == 0)
                    rtnData[3 - 1] = 1;
                  var ObjBattery2 = {
                    SN: dev.BaseInfo.SN,
                    Status,
                    Battery: rtnData[3 - 1],
                    Charging: rtnData[4 - 1]
                  };
                  callback(ObjBattery2);
                }
              }
            });
          });
        } else {
          env.log(
            dev.BaseInfo.devicename,
            "GetDeviceBatteryStats",
            "Fail-Status:BatteryStats Status is Not response"
          );
          var ObjBattery = {
            SN: dev.BaseInfo.SN,
            Status: 0,
            Battery: 0,
            Charging: 0
          };
          callback(ObjBattery);
        }
      };
      GetDeviceBattery(0);
    } catch (e) {
      env.log("ModelOSeries", "GetDeviceBatteryStats", `Error:${e}`);
    }
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
          rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 5, 21, buf);
        } else {
          rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 3, 64, buf);
        }
        setTimeout(() => {
          if (rtnData < 8)
            env.log(
              "ModelOV2Series SetFeatureReport",
              "SetFeatureReport(error) return data length : ",
              JSON.stringify(rtnData)
            );
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("ModelOV2Series Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
          rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 5, 21);
        } else {
          rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 3, 64);
        }
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
}
class ModelISeries extends Mouse {
  static #instance;
  GloriousMOISDK = GloriousMOISDKLib;
  m_bSetFWEffect;
  MDFMapping;
  MouseMapping;
  ButtonMapping;
  constructor(hid) {
    env.log("ModelISeries", "ModelISeries class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.hid = hid;
    this.MDFMapping = [
      { keyCode: 160, value: "Shift", MDFKey: 1, code: "ShiftLeft" },
      { keyCode: 162, value: "Ctrl", MDFKey: 0, code: "ControlLeft" },
      { keyCode: 164, value: "Alt", MDFKey: 2, code: "AltLeft" },
      { keyCode: 91, value: "Left Win", MDFKey: 3, code: "MetaLeft" },
      { keyCode: 161, value: "RShift", MDFKey: 5, code: "ShiftRight" },
      { keyCode: 163, value: "RCtrl", MDFKey: 4, code: "ControlRight" },
      { keyCode: 165, value: "RAlt", MDFKey: 6, code: "AltRight" },
      { keyCode: 92, value: "Right Win", MDFKey: 7, code: "MetaLeft" }
    ];
    this.MouseMapping = [
      { keyCode: "16", value: "Left Click", hid: 1, code: "0" },
      { keyCode: "17", value: "Scroll Click", hid: 4, code: "1" },
      { keyCode: "18", value: "Right Click", hid: 2, code: "2" },
      { keyCode: "91", value: "Back Key", hid: 8, code: "3" },
      { keyCode: "92", value: "Forward Key", hid: 16, code: "4" }
    ];
    this.ButtonMapping = [
      { ButtonID: 1, value: "LeftClick" },
      //DLL BUTTON_1
      { ButtonID: 3, value: "ScorllClick" },
      { ButtonID: 2, value: "RightClick" },
      { ButtonID: 5, value: "Forward" },
      { ButtonID: 6, value: "Backward" },
      { ButtonID: 7, value: "DPI UP" },
      { ButtonID: 0, value: "Scroll Up" },
      { ButtonID: 0, value: "Scroll Down" },
      { ButtonID: 9, value: "Profile Cycle" },
      //(Big Side Button)
      { ButtonID: 4, value: "Layer Cycle" },
      //(Former Side Button)
      { ButtonID: 8, value: "DPI Down" },
      // Shift Key Button
      { ButtonID: 10, value: "LeftClick" },
      //DLL BUTTON_1
      { ButtonID: 12, value: "ScorllClick" },
      { ButtonID: 11, value: "RightClick" },
      { ButtonID: 14, value: "Forward" },
      { ButtonID: 15, value: "Backward" },
      { ButtonID: 16, value: "DPI UP" },
      { ButtonID: 0, value: "Scroll Up" },
      { ButtonID: 0, value: "Scroll Down" },
      { ButtonID: 18, value: "Profile Cycle" },
      //(Big Side Button)
      { ButtonID: 13, value: "Layer Cycle" },
      //(Former Side Button)
      { ButtonID: 17, value: "DPI Down" }
    ];
    if (env.isWindows) {
      var DeviceFlags = this.GloriousMOISDK.Initialization();
      env.log("ModelISeries", "GloriousMOISDK-Initialization:", JSON.stringify(DeviceFlags));
    }
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelISeries", "getInstance", `Get exist ModelISeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelISeries", "getInstance", `New ModelISeries() INSTANCE`);
      this.#instance = new ModelISeries(hid);
      return this.#instance;
    }
  }
  InitialDevice(dev, Obj, callback) {
    env.log("ModelISeries", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    dev.DLLDevice = false;
    if (env.BuiltType == 0) {
      this.GloriousMOISDK.CaptureCBData();
      env.log("ModelISeries", "initDevice-CaptureCBData", "Done,then SetProfileDataFromDB");
      dev.BaseInfo.version_Wired = "00.00";
      dev.BaseInfo.version_Wireless = "00.00";
      this.SetProfileDataFromDB(dev, 0, () => {
        callback(0);
      });
    } else {
      dev.BaseInfo.version_Wired = "00.03.01.00";
      dev.BaseInfo.version_Wireless = "00.03.01.00";
      callback(0);
    }
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 3 && ObjData[1] == 1) {
      dev.deviceData.profileindex = ObjData[2];
      var iProfile = ObjData[2];
      env.log("ModelISeries", "HIDEP2Data-SwitchProfile", iProfile);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: dev.BaseInfo.SN,
          Profile: iProfile,
          ModelType: dev.BaseInfo.ModelType
          //Mouse:1,Keyboard:2,Dock:4
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 3 && ObjData[1] == 35) {
      var UIButtonID = this.ButtonMapping.findIndex((x) => x.ButtonID == ObjData[4]);
      this.LaunchProgram(dev, UIButtonID);
    } else if (ObjData[0] == 3 && ObjData[1] == 36) {
      var UIButtonID = this.ButtonMapping.findIndex((x) => x.ButtonID == ObjData[4]);
      this.LaunchProgram(dev, UIButtonID);
    }
  }
  LaunchProgram(dev, iKey) {
    var iProfile = dev.deviceData.profileindex - 1;
    var KeyAssignData;
    if (iKey >= 11) {
      KeyAssignData = dev.deviceData.profile[iProfile].keybindingLayerShift[iKey - 11];
    } else {
      KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];
    }
    switch (KeyAssignData.group) {
      case 2:
        if (KeyAssignData.function == 1) {
          var csProgram = KeyAssignData.param;
          if (csProgram != "") {
            this.RunApplication(csProgram);
          }
        } else if (KeyAssignData.function == 2) {
          var csProgram = KeyAssignData.param;
          if (csProgram != null && csProgram.trim() != "") {
            this.RunWebSite(GetValidURL(csProgram));
          }
        } else if (KeyAssignData.function == 3)
          ;
        break;
      case 8:
        if (KeyAssignData.function == 1) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 2) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 3) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 4) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        break;
    }
  }
  GetWirelessMode(dev, Obj, callback) {
    var bWireless = false;
    for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
      var StateSN = "0x" + this.NumTo16Decimal(dev.BaseInfo.vid[iState]) + "0x" + this.NumTo16Decimal(dev.BaseInfo.pid[iState]);
      if (dev.BaseInfo.SN == StateSN && iState > 0) {
        bWireless = true;
        break;
      }
    }
    callback(bWireless);
  }
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.GloriousMOISDK.GetFWVersion();
      var verRev = rtnData / 100;
      var strVersion = verRev.toString();
      dev.BaseInfo.version_Wired = strVersion;
      dev.BaseInfo.version_Wireless = "0.00";
      callback(strVersion);
    } catch (e) {
      env.log("ModelISeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  ChangeProfileID(dev, Obj, callback) {
    env.log("ModelISeries", "ChangeProfileID", "Begin");
    try {
      if (env.BuiltType == 1) {
        callback();
        return;
      }
      dev.deviceData.profileindex = Obj;
      var DeviceFlags = this.GloriousMOISDK.ChangeCurProfileID(dev.deviceData.profileindex);
      this.setProfileToDevice(dev, () => {
        callback("ChangeProfileID Done");
      });
    } catch (e) {
      env.log("ModelISeries", "ChangeProfileID", `Error:${e}`);
    }
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("ModelISeries", "SetLEDEffect", "Begin");
    try {
      var iEffect;
      var iModeaux = 0;
      var Colors = Obj.LightingData.Color;
      var iSpeed = Obj.LightingData.RateValue;
      var iBrightness = Obj.LightingData.WiredBrightnessValue;
      var iProfile = Obj.iProfile;
      var arrEffectName = [1, 2, 4, 6, 5, 7, 19, 9, 0];
      iEffect = arrEffectName[Obj.LightingData.Effect];
      if (iEffect == 4 || iEffect == 19) {
        for (var index = 0; index < Colors.length; index++) {
          if (Colors[index].flag == true) {
            iModeaux++;
          }
        }
      }
      var DataColors = Buffer.alloc(40);
      DataColors[0] = Colors.length * 3;
      for (var index = 0; index < Colors.length; index++) {
        if (Colors[index].flag == false) {
          DataColors[1 + index * 3 + 0] = 0;
          DataColors[1 + index * 3 + 1] = 0;
          DataColors[1 + index * 3 + 2] = 0;
        } else if (Colors[index].flag == true && Colors[index].R == 0 && Colors[index].G == 0 && Colors[index].B == 0) {
          DataColors[1 + index * 3 + 0] = 1;
          DataColors[1 + index * 3 + 1] = 0;
          DataColors[1 + index * 3 + 2] = 0;
        } else {
          DataColors[1 + index * 3 + 0] = Colors[index].R;
          DataColors[1 + index * 3 + 1] = Colors[index].G;
          DataColors[1 + index * 3 + 2] = Colors[index].B;
        }
      }
      var DeviceFlags = this.GloriousMOISDK.SetLEDEffect(iProfile + 1, iEffect, iBrightness, iSpeed, 0, iModeaux, DataColors);
      callback("SetLEDEffect Done");
    } catch (e) {
      env.log("ModelISeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetSleepTimetoDevice(dev, Obj, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[0] = 0;
      Data[1] = 0;
      Data[2] = 0;
      Data[3] = 2;
      Data[4] = 2;
      Data[5] = 0;
      Data[6] = 7;
      if (Obj.sleep) {
        var iSleeptime = Obj.sleeptime * 60;
        Data[7] = iSleeptime / 255;
        Data[8] = iSleeptime & 255;
      } else {
        Data[7] = 255;
        Data[8] = 255;
      }
      this.SetFeatureReport(dev, Data, 30).then(function() {
        callback("SetCalibration2Device Done");
      });
    } catch (e) {
      env.log("ModelISeries", "SetCalibration2Device", `Error:${e}`);
    }
  }
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    this.nedbObj.getMacro().then((doc) => {
      var iProfile = dev.deviceData.profileindex - 1;
      var ProfileData = dev.deviceData.profile[iProfile];
      var KeyAssignData = ProfileData.keybinding;
      var KeyAssignDataShift = ProfileData.keybindingLayerShift;
      var LightingData = ProfileData.lighting;
      var PerformanceData = ProfileData.performance;
      var MacroData = doc;
      var ObjKeyAssign = {
        iProfile,
        KeyAssignData,
        KeyAssignDataShift,
        MacroData
      };
      var ObjLighting = {
        iProfile,
        LightingData
      };
      var ObjPerformance = {
        iProfile,
        PerformanceData
      };
      this.GloriousMOISDK.SetLEDOnOff(0);
      this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
        this.SetLEDEffect(dev, ObjLighting, (param2) => {
          this.SetPerformance(dev, ObjPerformance, (param3) => {
            this.GloriousMOISDK.SetLEDOnOff(1);
            callback("SetProfileDataFromDB Done");
          });
        });
      });
    });
  }
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    this.nedbObj.getMacro().then((doc) => {
      env.log("ModelISeries", "SetProfileDataFromDB", "SetLEDOnOff Begin");
      this.GloriousMOISDK.SetLEDOnOff(0);
      env.log("ModelISeries", "SetProfileDataFromDB", "SetLEDOnOff Done");
      var MacroData = doc;
      const SetProfileData = (iProfile) => {
        var ProfileData = dev.deviceData.profile[iProfile];
        if (iProfile < 3 && ProfileData != void 0) {
          var KeyAssignData = ProfileData.keybinding;
          var KeyAssignDataShift = ProfileData.keybindingLayerShift;
          var LightingData = ProfileData.lighting;
          var PerformanceData = ProfileData.performance;
          var ObjKeyAssign = {
            iProfile,
            KeyAssignData,
            KeyAssignDataShift,
            MacroData
          };
          var ObjLighting = {
            iProfile,
            LightingData
          };
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param3) => {
              this.SetPerformance(dev, ObjPerformance, (param4) => {
                SetProfileData(iProfile + 1);
              });
            });
          });
        } else {
          this.ChangeProfileID(dev, dev.deviceData.profileindex, (param) => {
            setTimeout(() => {
              this.GloriousMOISDK.SetLEDOnOff(1);
              this.setProfileToDevice(dev, (paramDB) => {
                callback("SetProfileDataFromDB Done");
              });
            }, 50);
          });
        }
      };
      SetProfileData(0);
    });
  }
  SetKeyMatrix(dev, Obj, callback) {
    env.log("ModelISeries", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.profileData;
    var iProfile = dev.deviceData.profileindex - 1;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var KeyAssignData = Obj.profileData[iProfile].keybinding;
            var KeyAssignDataShift = Obj.profileData[iProfile].keybindingLayerShift;
            var ObjKeyAssign = {
              iProfile,
              KeyAssignData,
              KeyAssignDataShift,
              MacroData
            };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.setProfileToDevice(dev, (paramDB) => {
                dev.m_bSetHWDevice = false;
                callback("SetKeyMatrix Done");
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          var LightingData = Obj.profileData[iProfile].lighting;
          var ObjLighting = {
            iProfile,
            LightingData
          };
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
        case switchUIflag.performanceflag:
          var PerformanceData = Obj.profileData[iProfile].performance;
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetPerformance(dev, ObjPerformance, (param1) => {
            var ObjActiveDPI = { profile: iProfile, activeDPI: Obj.profileData[iProfile].performance.dpiSelectIndex };
            if (ObjPerformance.PerformanceData.dpiSelectIndex == void 0) {
              ObjActiveDPI.activeDPI = 0;
            }
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
      }
    } catch (e) {
      env.log("ModelISeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  SetPerformance(dev, ObjPerformance, callback) {
    var DpiStage = ObjPerformance.PerformanceData.DpiStage;
    var DataDPIStages = Buffer.alloc(40);
    DataDPIStages[0] = DpiStage.length * 4;
    for (var i = 0; i < DpiStage.length; i++) {
      DataDPIStages[1 + i * 4 + 0] = DpiStage[i].value >> 8;
      DataDPIStages[1 + i * 4 + 1] = DpiStage[i].value & 255;
      DataDPIStages[1 + i * 4 + 2] = DpiStage[i].value >> 8;
      DataDPIStages[1 + i * 4 + 3] = DpiStage[i].value & 255;
    }
    var DPICurStage = 0;
    if (ObjPerformance.PerformanceData.dpiSelectIndex != void 0) {
      DPICurStage = ObjPerformance.PerformanceData.dpiSelectIndex + 1;
    }
    var DataDPIColor = Buffer.alloc(30);
    DataDPIColor[0] = DpiStage.length * 3;
    for (var i = 0; i < DpiStage.length; i++) {
      var DPIColor = this.hexToRgb(DpiStage[i].color);
      DataDPIColor[1 + i * 3 + 0] = DPIColor.color.R;
      DataDPIColor[1 + i * 3 + 1] = DPIColor.color.G;
      DataDPIColor[1 + i * 3 + 2] = DPIColor.color.B;
    }
    var LODValue = ObjPerformance.PerformanceData.LodValue - 1;
    var arrRate = [125, 250, 500, 1e3];
    var PollingRate = 1e3;
    var isPollingRate = arrRate.indexOf(ObjPerformance.PerformanceData.pollingrate);
    if (isPollingRate != -1) {
      PollingRate = ObjPerformance.PerformanceData.pollingrate;
    }
    var Responsetime = ObjPerformance.PerformanceData.DebounceValue;
    var DPINumber = DpiStage.length;
    var iProfile = ObjPerformance.iProfile + 1;
    var DeviceFlags = this.GloriousMOISDK.SetPerformance(iProfile, PollingRate, Responsetime, LODValue, DPINumber, DPICurStage, DataDPIStages, DataDPIColor);
    if (!DeviceFlags) {
      env.log("ModelISeries", "SetPerformance", "GloriousMOISDK Error");
    }
    callback("SetPerformance Done");
  }
  MacroToData(MacroData, Repeat) {
    var BufferKey = [];
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = { keydown: true, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].startTime };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    var DLLRepeat;
    if (Repeat == 1)
      DLLRepeat = 2;
    else if (Repeat == 2)
      DLLRepeat = 1;
    else
      DLLRepeat = 0;
    if (DataEvent.length > 72) {
      DataEvent.length = 72;
    }
    BufferKey.push(MacroData.value);
    BufferKey.push(DataEvent.length);
    BufferKey.push(DLLRepeat);
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      var bMouseButton = false;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = parseInt(SupportData.AllFunctionMapping[i].keyCode);
          break;
        }
      }
      for (var i = 0; i < this.MouseMapping.length; i++) {
        if (DataEvent[iEvent].key == this.MouseMapping[i].code) {
          var Mousehid = this.MouseMapping[i].hid;
          KeyCode = Mousehid;
          bMouseButton = true;
          break;
        }
      }
      for (var i = 0; i < this.MDFMapping.length; i++) {
        if (DataEvent[iEvent].key == this.MDFMapping[i].code) {
          KeyCode = this.MDFMapping[i].keyCode;
          break;
        }
      }
      var Event_type;
      var iDelay = 20;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 20;
      }
      if (bMouseButton)
        Event_type = 16;
      else
        Event_type = 18;
      var Make = DataEvent[iEvent].keydown ? 0 : 1;
      BufferKey.push(Event_type);
      BufferKey.push(KeyCode);
      BufferKey.push(Make);
      BufferKey.push(parseInt(iDelay / 255));
      BufferKey.push(parseInt(iDelay & 255));
    }
    return BufferKey;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var iProfile = ObjKeyAssign.iProfile;
    var iMacroUSECount = 0;
    var ObjarrButtonData = [];
    var ObjarrDLLButtonData = [];
    var AllKeyAssignData = [];
    for (let iButton = 0; iButton < ObjKeyAssign.KeyAssignData.length; iButton++) {
      AllKeyAssignData.push(ObjKeyAssign.KeyAssignData[iButton]);
    }
    if (ObjKeyAssign.KeyAssignDataShift != void 0) {
      for (let iButton = 0; iButton < ObjKeyAssign.KeyAssignDataShift.length; iButton++) {
        AllKeyAssignData.push(ObjKeyAssign.KeyAssignDataShift[iButton]);
      }
    }
    ObjKeyAssign.KeyAssignData.length;
    for (let iButton = 0; iButton < AllKeyAssignData.length; iButton++) {
      if (iButton == 6 || iButton == 7 || iButton == 11 + 6 || iButton == 11 + 7)
        continue;
      var KeyAssignData = AllKeyAssignData[iButton];
      var ObjButtonData = this.KeyAssignToData(KeyAssignData);
      var DLLDataMacro = [];
      if (KeyAssignData.group == 1) {
        var MacroID = KeyAssignData.function;
        for (var iMacro = 0; iMacro < ObjKeyAssign.MacroData.length; iMacro++) {
          if (iMacro + 1 == ObjKeyAssign.MacroData.length && MacroID != ObjKeyAssign.MacroData[iMacro].value) {
            MacroID = ObjKeyAssign.MacroData[iMacro].value;
          }
          if (MacroID == ObjKeyAssign.MacroData[iMacro].value) {
            iMacroUSECount++;
            var MacroData = ObjKeyAssign.MacroData[iMacro];
            var DLLDataMacro1 = this.MacroToData(MacroData, KeyAssignData.param);
            var i = -1;
            while (++i < DLLDataMacro1.length) {
              DLLDataMacro.push(DLLDataMacro1[i]);
            }
            break;
          }
        }
      }
      ObjButtonData.DLLButtonID = this.ButtonMapping[iButton].ButtonID;
      ObjButtonData.DLLDataMacro = DLLDataMacro;
      ObjarrButtonData.push(ObjButtonData);
    }
    for (let iButton = 0; iButton < ObjarrButtonData.length; iButton++) {
      var ButtonDataIndex = ObjarrButtonData.findIndex((x) => x.DLLButtonID == iButton + 1);
      ObjarrDLLButtonData.push(ObjarrButtonData[ButtonDataIndex]);
    }
    var iSleep = 120 + iMacroUSECount * 160;
    this.SetAllButtonIntoDLL(dev, iSleep, iProfile + 1, ObjarrDLLButtonData).then(() => {
      callback("SetKeyFunction Done");
    });
  }
  KeyAssignToData(KeyAssignData) {
    var DLLfunction = 0;
    var DLLbinding = 0;
    var DLLbinding_aux = 0;
    switch (KeyAssignData.group) {
      case 1:
        DLLfunction = 17;
        var arrDLLRepeat = [0, 2, 1];
        DLLbinding = arrDLLRepeat.indexOf(KeyAssignData.param);
        if (DLLbinding == -1) {
          DLLbinding = 0;
        }
        break;
      case 7:
        for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
          if (KeyAssignData.function == SupportData.AllFunctionMapping[iMap].value) {
            var arrModifiers = [1, 0, 2, 3, 4];
            DLLfunction = 16;
            for (var index = 0; index < KeyAssignData.param.length; index++) {
              if (KeyAssignData.param[index] == true)
                DLLbinding |= Math.pow(2, arrModifiers[index]);
            }
            DLLbinding_aux = parseInt(SupportData.AllFunctionMapping[iMap].keyCode);
            for (var i = 0; i < this.MDFMapping.length; i++) {
              if (SupportData.AllFunctionMapping[iMap].value == this.MDFMapping[i].value) {
                DLLbinding |= Math.pow(2, this.MDFMapping[i].MDFKey);
                DLLbinding_aux = 0;
                break;
              }
            }
            break;
          }
        }
        break;
      case 3:
        DLLfunction = 19;
        if (KeyAssignData.function == 11) {
          DLLfunction = 11;
          DLLbinding = 2;
        } else {
          var arrMouseValue = [1, 1, 2, 4, 16, 8, 17, 18, 22, 21, 1];
          DLLbinding = arrMouseValue[KeyAssignData.function];
        }
        break;
      case 8:
        DLLfunction = 18;
        DLLbinding = 35;
        break;
      case 4:
        DLLfunction = 20;
        var arrDPIValue = [0, 0, 1, 3, 4, 10];
        DLLbinding = arrDPIValue[KeyAssignData.function];
        if (arrDPIValue[KeyAssignData.function] == 10) {
          var DpiValue = KeyAssignData.param;
          DLLbinding_aux = DpiValue;
        }
        break;
      case 5:
        DLLfunction = 21;
        var arrMediaValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 3, 4];
        DLLbinding = arrMediaValue[KeyAssignData.function];
        break;
      case 2:
        DLLfunction = 18;
        switch (KeyAssignData.function) {
          case 1:
            DLLbinding = 35;
            break;
          case 2:
            DLLbinding = 35;
            break;
        }
        if (KeyAssignData.function == 1) {
          DLLbinding = 36;
        } else if (KeyAssignData.function == 2) {
          DLLbinding = 36;
        } else if (KeyAssignData.function == 3) {
          switch (KeyAssignData.param) {
            case 1:
              DLLbinding = 0;
              break;
            case 2:
              DLLbinding = 1;
              break;
            case 3:
              DLLbinding = 2;
              break;
            case 4:
              DLLfunction = 16;
              DLLbinding = 8;
              DLLbinding_aux = 69;
              break;
            case 5:
              DLLbinding = 4;
              break;
            case 6:
              DLLbinding = 5;
              break;
            case 7:
              DLLbinding = 7;
              break;
            case 8:
              DLLbinding = 8;
              break;
            case 9:
              DLLbinding = 9;
              break;
            case 10:
              DLLbinding = 16;
              break;
          }
        }
        break;
      case 6:
        DLLfunction = 10;
        break;
    }
    var Obj = { DLLfunction, DLLbinding, DLLbinding_aux };
    return Obj;
  }
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, buf);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 65);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  SetButtonFuncIntoDLL(dev, iSleep, iProfile, DLLButtonID, DLLfunction, DLLbinding, DLLbinding_aux, DLLDataMacro) {
    return new Promise((resolve, reject) => {
      try {
        var DeviceFlags = this.GloriousMOISDK.SetButtonFunc(iProfile, DLLButtonID, DLLfunction, DLLbinding, DLLbinding_aux, DLLDataMacro);
        setTimeout(() => {
          resolve(DeviceFlags);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetButtonFuncIntoDLL", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  SetAllButtonIntoDLL(dev, iSleep, iProfile, ObjButtonData) {
    return new Promise((resolve, reject) => {
      try {
        var DeviceFlags = this.GloriousMOISDK.SetAllButton(iProfile, ObjButtonData);
        setTimeout(() => {
          resolve(DeviceFlags);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetAllButtonIntoDLL", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  SetLEDOnOffIntoDLL(dev, iSleep, iOnOff) {
    return new Promise((resolve, reject) => {
      try {
        var DeviceFlags = this.GloriousMOISDK.SetLEDOnOff(iOnOff);
        setTimeout(() => {
          resolve(DeviceFlags);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetAllButtonIntoDLL", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
}
class CommonMouseSeries extends Mouse {
  static #instance;
  constructor(hid) {
    env.log("CommonMouseSeries", "CommonMouseSeries class", "begin");
    super();
    this.hid = hid;
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("CommonMouseSeries", "getInstance", `Get exist CommonMouseSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("CommonMouseSeries", "getInstance", `New CommonMouseSeries() INSTANCE`);
      this.#instance = new CommonMouseSeries(hid);
      return this.#instance;
    }
  }
}
class ModelOWiredSeries extends Mouse {
  static #instance;
  m_bSetFWEffect;
  m_bSetHWDevice;
  ButtonMapping;
  LEDType;
  constructor(hid) {
    env.log("ModelOWiredSeries", "ModelOWiredSeries class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.m_bSetHWDevice = false;
    this.hid = hid;
    this.ButtonMapping = [
      { ButtonID: 0, HidButtonID: 0, value: "LeftClick" },
      { ButtonID: 1, HidButtonID: 2, value: "ScorllClick" },
      { ButtonID: 2, HidButtonID: 1, value: "RightClick" },
      { ButtonID: 3, HidButtonID: 3, value: "Forward" },
      { ButtonID: 4, HidButtonID: 4, value: "Backward" },
      { ButtonID: 5, HidButtonID: 5, value: "DPISwitch" },
      { ButtonID: 6, HidButtonID: 6, value: "Scroll Up" },
      { ButtonID: 7, HidButtonID: 7, value: "Scroll Down" }
    ];
    this.LEDType = [
      { EffectID: 0, HidEffectID: 1, value: "GloriousMode" },
      { EffectID: 1, HidEffectID: 2, value: "SeamlessBreathing" },
      { EffectID: 2, HidEffectID: 3, value: "Breathing" },
      { EffectID: 3, HidEffectID: 4, value: "SingleColor" },
      { EffectID: 4, HidEffectID: 5, value: "BreathingSingleColor" },
      { EffectID: 5, HidEffectID: 6, value: "Tail" },
      { EffectID: 6, HidEffectID: 7, value: "Rave" },
      { EffectID: 7, HidEffectID: 8, value: "Wave" },
      { EffectID: 8, HidEffectID: 0, value: "LEDOFF" }
    ];
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelOWiredSeries", "getInstance", `Get exist ModelOWiredSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelOWiredSeries", "getInstance", `New ModelOWiredSeries() INSTANCE`);
      this.#instance = new ModelOWiredSeries(hid);
      return this.#instance;
    }
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    env.log("ModelOWiredSeries", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    dev.BaseInfo.version_Wireless = "0001";
    if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    } else if (env.BuiltType == 0) {
      this.SetProfileDataFromDB(dev, 0, () => {
        callback(0);
      });
    } else {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    }
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    const SetProfileData = (iProfile) => {
      var ProfileData = dev.deviceData.profile[iProfile];
      if (iProfile < 3 && ProfileData != void 0) {
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
          iProfile,
          KeyAssignData
        };
        var ObjLighting = {
          iProfile,
          LightingData
        };
        var ObjPerformance = {
          iProfile,
          PerformanceData
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param3) => {
            this.SetPerformance(dev, ObjPerformance, (param4) => {
              this.setProfileToDevice(dev, (paramDB) => {
                SetProfileData(iProfile + 1);
              });
            });
          });
        });
      } else {
        this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
          callback("SetProfileDataFromDB Done");
        });
      }
    };
    SetProfileData(0);
  }
  ChangeProfileID(dev, Obj, callback) {
    env.log("ModelOWiredSeries", "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      }
      var Data = Buffer.alloc(256);
      Data[0] = 7;
      Data[1] = 1;
      Data[2] = Obj;
      this.SetFeatureReport(dev, Data, 50).then(() => {
        dev.deviceData.profileindex = Obj;
        this.setProfileToDevice(dev, () => {
          callback("ChangeProfileID Done");
        });
      });
    } catch (e) {
      env.log("ModelOWiredSeries", "SetKeyMatrix", `Error:${e}`);
      callback();
    }
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex - 1;
    var ProfileData = dev.deviceData.profile[iProfile];
    var KeyAssignData = ProfileData.keybinding;
    var LightingData = ProfileData.lighting;
    var PerformanceData = ProfileData.performance;
    var ObjKeyAssign = {
      iProfile,
      KeyAssignData
    };
    var ObjLighting = {
      iProfile,
      LightingData
    };
    var ObjPerformance = {
      iProfile,
      PerformanceData
    };
    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
      this.SetLEDEffect(dev, ObjLighting, (param2) => {
        this.SetPerformance(dev, ObjPerformance, (param3) => {
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var ObjMacroData = {
              MacroData
            };
            this.SetMacroFunction(dev, ObjMacroData, (param22) => {
              callback("SetProfileDataFromDB Done");
            });
          });
        });
      });
    });
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 241) {
      dev.deviceData.profileindex = ObjData[2];
      var iProfile = ObjData[2];
      env.log("ModelOSeries", "HIDEP2Data-SwitchProfile", iProfile);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: dev.BaseInfo.SN,
          Profile: iProfile,
          ModelType: dev.BaseInfo.ModelType
          //Mouse:1,Keyboard:2,Dock:4
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[2] >= 128) {
      var target = this.ButtonMapping.find((x) => x.HidButtonID == ObjData[3]);
      var iIndex = target.ButtonID;
      this.LaunchProgram(dev, iIndex);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey) {
    var iProfile = dev.deviceData.profileindex - 1;
    var KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];
    switch (KeyAssignData.group) {
      case 2:
        if (KeyAssignData.function == 1) {
          var csProgram = KeyAssignData.param;
          if (csProgram != "")
            this.RunApplication(csProgram);
        } else if (KeyAssignData.function == 2) {
          const csProgram2 = KeyAssignData.param;
          if (csProgram2 != null && csProgram2.trim() != "") {
            this.RunWebSite(GetValidURL(csProgram2));
          }
        } else if (KeyAssignData.function == 3)
          ;
        break;
      case 8:
        if (KeyAssignData.function == 1) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 2) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 3) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 4) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        break;
    }
  }
  /**
   * Set Polling Rate to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetPollingRatetoDevice(dev, Obj, callback) {
    var Data = Buffer.alloc(256);
    var arrPollingrate = [1e3, 500, 250, 125];
    Data[0] = 7;
    Data[1] = 8;
    Data[8] = arrPollingrate.indexOf(Obj.iPollingrate);
    Data[9] = Obj.EP2Enable;
    Data[10] = Obj.LEDNoChange;
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback();
      });
    });
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVersion = verRev.padStart(4, "0");
      if (strVersion == "2000") {
        dev.BaseInfo.version_Wired = "0001";
      } else {
        dev.BaseInfo.version_Wired = strVersion;
      }
      dev.BaseInfo.version_Wireless = "99.99.99.99";
      callback(strVersion);
    } catch (e) {
      env.log("ModelOWiredSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("ModelOWiredSeries", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.profileData;
    var iProfile = dev.deviceData.profileindex - 1;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var KeyAssignData = Obj.profileData[iProfile].keybinding;
            var ObjKeyAssign = {
              iProfile,
              KeyAssignData
            };
            var ObjMacroData = { MacroData };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.setProfileToDevice(dev, (paramDB) => {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Done");
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          var LightingData = Obj.profileData[iProfile].lighting;
          var ObjLighting = {
            iProfile,
            LightingData
          };
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
        case switchUIflag.performanceflag:
          var PerformanceData = Obj.profileData[iProfile].performance;
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetPerformance(dev, ObjPerformance, (param1) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
      }
    } catch (e) {
      env.log("ModelOWiredSeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  //Send performance data and convert deviceData into Firmware
  SetPerformance(dev, ObjPerformance, callback) {
    var DpiStage = ObjPerformance.PerformanceData.DpiStage;
    var DataPerformance = Buffer.alloc(256);
    DataPerformance[0] = 7;
    DataPerformance[1] = 4;
    DataPerformance[2] = ObjPerformance.iProfile + 1;
    if (ObjPerformance.PerformanceData.dpiSelectIndex != void 0) {
      DataPerformance[3] = ObjPerformance.PerformanceData.dpiSelectIndex + 1;
    }
    DataPerformance[4] = DpiStage.length;
    for (var i = 0; i < DpiStage.length; i++) {
      DataPerformance[16 + i * 8 + 0] = DpiStage[i].value / 100;
      var DPIColor = this.hexToRgb(DpiStage[i].color);
      DataPerformance[16 + i * 8 + 2] = DPIColor.color.R;
      DataPerformance[16 + i * 8 + 3] = DPIColor.color.G;
      DataPerformance[16 + i * 8 + 4] = DPIColor.color.B;
    }
    var arrRate = [125, 250, 500, 1e3];
    var arrRateValue = [1, 2, 3, 4];
    var PollingRate = arrRate.indexOf(ObjPerformance.PerformanceData.pollingrate);
    if (PollingRate != -1) {
      DataPerformance[7] = arrRateValue[PollingRate];
    }
    DataPerformance[5] = ObjPerformance.PerformanceData.LodValue;
    DataPerformance[6] = ObjPerformance.PerformanceData.DebounceValue;
    this.SetPerformance2Device(dev, DataPerformance, (param1) => {
      callback("SetPerformance Done");
    });
  }
  //Send current DPI stage from frontend
  SetPerformance2Device(dev, DataPerformance, callback) {
    try {
      var Data = Buffer.alloc(256);
      for (var i = 0; i < DataPerformance.length; i++)
        Data[i] = DataPerformance[i];
      this.SetFeatureReport(dev, Data, 150).then(() => {
        callback("SetPerformance2Device Done");
      });
    } catch (e) {
      env.log("ModelOSeries", "SetPerformance2Device", `Error:${e}`);
    }
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    var Data = Buffer.alloc(256);
    Data[0] = 7;
    Data[1] = 5;
    Data[2] = MacroID;
    var iMaxSize = 248;
    for (var k = 0; k < iMaxSize; k++)
      Data[8 + k] = MacroData[0 + k];
    this.SetFeatureReport(dev, Data, 100).then(() => {
      callback("SetMacroDataToDevice Done");
    });
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(256);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = { keydown: true, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].startTime };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    BufferKey[0] = DataEvent.length;
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = SupportData.AllFunctionMapping[i].hid;
          break;
        }
      }
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[1 + iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[1 + iEvent * 3 + 0] += 128;
      BufferKey[1 + iEvent * 3 + 1] = iDelay & 255;
      BufferKey[1 + iEvent * 3 + 2] = KeyCode;
    }
    return BufferKey;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      DataBuffer
    };
    this.SendButtonMatrix2Device(dev, Obj1).then(() => {
      callback("SetKeyFunction Done");
    });
  }
  SendButtonMatrix2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var Data = Buffer.alloc(256);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 3;
    Data[2] = iProfile + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 150).then(() => {
        resolve("SendButtonMatrix2Device Done");
      });
    });
  }
  SendMacroType2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(256);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 4;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      if (DataBuffer == false) {
        resolve("SendButtonMatrix2Device Done");
      } else {
        for (var i = 0; i < DataBuffer.length; i++) {
          Data[8 + i] = DataBuffer[i];
        }
        this.SetFeatureReport(dev, Data, 150).then(() => {
          resolve("SendButtonMatrix2Device Done");
        });
      }
    });
  }
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(256);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var target = this.ButtonMapping.find((x) => x.ButtonID == i);
      var iIndex = target.HidButtonID;
      var Temp_BtnData = KeyAssignData[i];
      switch (Temp_BtnData.group) {
        case 1:
          DataBuffer[iIndex * 4 + 0] = 32 + Temp_BtnData.function;
          if (Temp_BtnData.param == 3) {
            DataBuffer[iIndex * 4 + 1] = 225;
          } else if (Temp_BtnData.param == 2) {
            DataBuffer[iIndex * 4 + 1] = 224;
          } else {
            DataBuffer[iIndex * 4 + 1] = 1;
          }
          break;
        case 7:
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnData.function == SupportData.AllFunctionMapping[iMap].value) {
              var arrModifiers = [1, 0, 2, 3, 4];
              DataBuffer[iIndex * 4 + 0] = 2;
              for (var index = 0; index < Temp_BtnData.param.length; index++) {
                if (Temp_BtnData.param[index] == true)
                  DataBuffer[iIndex * 4 + 1] |= Math.pow(2, arrModifiers[index]);
              }
              DataBuffer[iIndex * 4 + 2] = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          break;
        case 3:
          var arrMouseValue = [1, 1, 2, 3, 5, 4, 160, 161, 177, 176, 1];
          DataBuffer[iIndex * 4 + 0] = 1;
          DataBuffer[iIndex * 4 + 1] = arrMouseValue[Temp_BtnData.function];
          break;
        case 8:
          DataBuffer[iIndex * 4 + 0] = 4;
          DataBuffer[iIndex * 4 + 1] = 1;
          break;
        case 4:
          var arrDPIValue = [1, 1, 2, 3, 4, 5];
          DataBuffer[iIndex * 4 + 0] = 102;
          DataBuffer[iIndex * 4 + 1] = arrDPIValue[Temp_BtnData.function];
          if (arrDPIValue[Temp_BtnData.function] == 5) {
            var DpiValue = Temp_BtnData.param;
            DataBuffer[iIndex * 4 + 2] = parseInt(DpiValue) / 100;
          }
          break;
        case 5:
          var hidMap = SupportData.MediaMapping[Temp_BtnData.function].hidMap;
          DataBuffer[iIndex * 4 + 0] = 3;
          for (var iTemp = 0; iTemp < hidMap.length; iTemp++) {
            DataBuffer[iIndex * 4 + 2 - iTemp] = hidMap[iTemp];
          }
          break;
        case 2:
          if (Temp_BtnData.function == 1) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 2) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 3) {
            var hidMap;
            if (Temp_BtnData.param == 4) {
              hidMap = [8, 8];
              DataBuffer[iIndex * 4 + 0] = 2;
            } else {
              hidMap = SupportData.WindowsMapping[Temp_BtnData.param].hidMap;
              DataBuffer[iIndex * 4 + 0] = 3;
            }
            for (var index = 0; index < hidMap.length; index++) {
              DataBuffer[iIndex * 4 + 2 - index] = hidMap[index];
            }
          }
          break;
        case 6:
          DataBuffer[iIndex * 4 + 0] = 0;
          DataBuffer[iIndex * 4 + 1] = 0;
          break;
        default:
          DataBuffer[iIndex * 4] = 255;
          break;
      }
    }
    return DataBuffer;
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("ModelOWiredSeries", "SetLEDEffect", "Begin");
    try {
      var ObjEffectData = { iProfile: Obj.iProfile, Data: Obj.LightingData };
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        callback("SetLEDEffect Done");
      });
    } catch (e) {
      env.log("ModelOWiredSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(256);
      var iProfile = ObjEffectData.iProfile;
      var Colors = ObjEffectData.Data.Color;
      var iIndex = this.LEDType.findIndex((x) => x.EffectID == ObjEffectData.Data.Effect);
      var HidEffectID = this.LEDType[iIndex].HidEffectID;
      Data[0] = 7;
      Data[1] = 2;
      Data[2] = iProfile + 1;
      Data[3] = HidEffectID;
      Data[4] = ObjEffectData.Data.RateValue > 0 ? ObjEffectData.Data.RateValue * 20 / 100 : 1;
      Data[5] = ObjEffectData.Data.WiredBrightnessValue * 20 / 100;
      var ColorCount = 0;
      for (var index = 0; index < Colors.length; index++) {
        if (Colors[index].flag == true) {
          Data[16 + ColorCount * 3 + 0] = Colors[index].R;
          Data[16 + ColorCount * 3 + 1] = Colors[index].G;
          Data[16 + ColorCount * 3 + 2] = Colors[index].B;
          ColorCount++;
        }
      }
      Data[6] = ColorCount > 0 ? ColorCount - 1 : 0;
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log("ModelOWiredSeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 256, buf);
        setTimeout(() => {
          if (rtnData < 8)
            env.log("ModelOWiredSeries SetFeatureReport", "SetFeatureReport(error) return data length : ", JSON.stringify(rtnData));
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("ModelOWiredSeries Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 256);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
}
class ModelOV2WiredSeries extends Mouse {
  static #instance;
  m_bSetFWEffect;
  m_bSetHWDevice;
  ButtonMapping;
  LEDType;
  MouseMapping;
  constructor(hid) {
    env.log("ModelOV2WiredSeries", "ModelOV2WiredSeries class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.m_bSetHWDevice = false;
    this.hid = hid;
    this.ButtonMapping = [
      { ButtonID: 0, HidButtonID: 0, value: "LeftClick" },
      { ButtonID: 1, HidButtonID: 2, value: "ScorllClick" },
      { ButtonID: 2, HidButtonID: 1, value: "RightClick" },
      { ButtonID: 3, HidButtonID: 4, value: "Forward" },
      { ButtonID: 4, HidButtonID: 3, value: "Backward" },
      { ButtonID: 5, HidButtonID: 5, value: "DPISwitch" },
      { ButtonID: 6, HidButtonID: 6, value: "Scroll Up" },
      { ButtonID: 7, HidButtonID: 7, value: "Scroll Down" }
    ];
    this.LEDType = [
      { EffectID: 0, HidEffectID: 1, ColorIndexID: 255, value: "GloriousMode" },
      { EffectID: 1, HidEffectID: 2, ColorIndexID: 255, value: "SeamlessBreathing" },
      { EffectID: 2, HidEffectID: 3, ColorIndexID: 0, value: "Breathing" },
      { EffectID: 3, HidEffectID: 4, ColorIndexID: 6, value: "SingleColor" },
      { EffectID: 4, HidEffectID: 5, ColorIndexID: 7, value: "BreathingSingleColor" },
      { EffectID: 5, HidEffectID: 6, ColorIndexID: 255, value: "Tail" },
      { EffectID: 6, HidEffectID: 7, ColorIndexID: 8, value: "Rave" },
      { EffectID: 7, HidEffectID: 8, ColorIndexID: 255, value: "Wave" },
      { EffectID: 8, HidEffectID: 0, ColorIndexID: 255, value: "LEDOFF" }
    ];
    this.MouseMapping = [
      { keyCode: "16", value: "Left Click", hid: 183, code: "0" },
      { keyCode: "17", value: "Scroll Click", hid: 185, code: "1" },
      { keyCode: "18", value: "Right Click", hid: 184, code: "2" },
      { keyCode: "91", value: "Back Key", hid: 186, code: "3" },
      { keyCode: "92", value: "Forward Key", hid: 187, code: "4" }
    ];
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("ModelOV2WiredSeries", "getInstance", `Get exist ModelOV2WiredSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelOV2WiredSeries", "getInstance", `New ModelOV2WiredSeries() INSTANCE`);
      this.#instance = new ModelOV2WiredSeries(hid);
      return this.#instance;
    }
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    env.log("ModelOV2WiredSeries", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    if (dev.BaseInfo.SN == "0x320F0x831A") {
      dev.ButtonMapping = [
        { ButtonID: 0, HidButtonID: 0, RGBSyncID: 0, value: "LeftClick" },
        { ButtonID: 1, HidButtonID: 2, RGBSyncID: 0, value: "ScorllClick" },
        { ButtonID: 2, HidButtonID: 1, RGBSyncID: 0, value: "RightClick" },
        { ButtonID: 3, HidButtonID: 4, RGBSyncID: 3, value: "Forward" },
        { ButtonID: 4, HidButtonID: 3, RGBSyncID: 4, value: "Backward" },
        { ButtonID: 5, HidButtonID: 5, RGBSyncID: 2, value: "DPI UP" },
        //DPISwitch->DPI UP
        { ButtonID: 6, HidButtonID: 255, RGBSyncID: 255, value: "Scroll Up" },
        { ButtonID: 7, HidButtonID: 255, RGBSyncID: 255, value: "Scroll Down" },
        { ButtonID: 8, HidButtonID: 8, RGBSyncID: 1, value: "DPI Lock" },
        //(Big Side Button)
        { ButtonID: 9, HidButtonID: 7, RGBSyncID: 1, value: "HOME" },
        //(Former Side Button)
        { ButtonID: 10, HidButtonID: 6, RGBSyncID: 3, value: "DPI Down" }
      ];
    } else {
      dev.ButtonMapping = [
        { ButtonID: 0, HidButtonID: 0, RGBSyncID: 0, value: "LeftClick" },
        { ButtonID: 1, HidButtonID: 2, RGBSyncID: 0, value: "ScorllClick" },
        { ButtonID: 2, HidButtonID: 1, RGBSyncID: 0, value: "RightClick" },
        { ButtonID: 3, HidButtonID: 4, RGBSyncID: 2, value: "Forward" },
        { ButtonID: 4, HidButtonID: 3, RGBSyncID: 1, value: "Backward" },
        { ButtonID: 5, HidButtonID: 5, RGBSyncID: 2, value: "DPISwitch" },
        { ButtonID: 6, HidButtonID: 6, RGBSyncID: 255, value: "Scroll Up" },
        { ButtonID: 7, HidButtonID: 7, RGBSyncID: 255, value: "Scroll Down" }
      ];
    }
    dev.BaseInfo.version_Wireless = "0001";
    if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    } else if (env.BuiltType == 0) {
      this.SetProfileDataFromDB(dev, 0, () => {
        callback(0);
      });
    } else {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    }
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    const SetProfileData = (iProfile) => {
      var ProfileData = dev.deviceData.profile[iProfile];
      if (iProfile < 3 && ProfileData != void 0) {
        var KeyAssignData = ProfileData.keybinding;
        var LightingData = ProfileData.lighting;
        var PerformanceData = ProfileData.performance;
        var ObjKeyAssign = {
          iProfile,
          KeyAssignDataLayerShift: {},
          KeyAssignData
        };
        if (dev.BaseInfo.SN == "0x320F0x831A") {
          ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
        }
        var ObjLighting = {
          iProfile,
          LightingData
        };
        var ObjPerformance = {
          iProfile,
          PerformanceData
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param3) => {
            this.SetPerformance(dev, ObjPerformance, (param4) => {
              SetProfileData(iProfile + 1);
            });
          });
        });
      } else {
        this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
          callback("SetProfileDataFromDB Done");
        });
      }
    };
    SetProfileData(0);
  }
  ChangeProfileID(dev, Obj, callback) {
    env.log("ModelOV2WiredSeries", "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      }
      var Data = Buffer.alloc(264);
      Data[0] = 7;
      Data[1] = 1;
      Data[2] = Obj;
      this.SetFeatureReport(dev, Data, 50).then(() => {
        dev.deviceData.profileindex = Obj;
        this.setProfileToDevice(dev, () => {
          callback("ChangeProfileID Done");
        });
      });
    } catch (e) {
      env.log("ModelOV2WiredSeries", "ChangeProfileID", `Error:${e}`);
      callback();
    }
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex - 1;
    var ProfileData = dev.deviceData.profile[iProfile];
    var KeyAssignData = ProfileData.keybinding;
    var LightingData = ProfileData.lighting;
    var PerformanceData = ProfileData.performance;
    var ObjKeyAssign = {
      iProfile,
      KeyAssignDataLayerShift: {},
      KeyAssignData
    };
    var ObjLighting = {
      iProfile,
      LightingData
    };
    var ObjPerformance = {
      iProfile,
      PerformanceData
    };
    if (dev.BaseInfo.SN == "0x320F0x831A" && ProfileData.keybindingLayerShift != void 0) {
      ObjKeyAssign.KeyAssignDataLayerShift = ProfileData.keybindingLayerShift;
    }
    this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
      this.SetLEDEffect(dev, ObjLighting, (param2) => {
        this.SetPerformance(dev, ObjPerformance, (param3) => {
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var ObjMacroData = {
              MacroData
            };
            this.SetMacroFunction(dev, ObjMacroData, (param22) => {
              callback("SetProfileDataFromDB Done");
            });
          });
        });
      });
    });
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 241 && ObjData[2] == 160) {
      env.log("ModelOV2WiredSeries", "HIDEP2Data-HardwareReset", "");
    } else if (ObjData[0] == 4 && ObjData[1] == 241 && ObjData[2] <= 3) {
      dev.deviceData.profileindex = ObjData[2];
      var iProfile = ObjData[2];
      env.log("ModelOV2WiredSeries", "HIDEP2Data-SwitchProfile", iProfile);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: dev.BaseInfo.SN,
          Profile: iProfile,
          ModelType: dev.BaseInfo.ModelType
          //Mouse:1,Keyboard:2,Dock:4
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[2] >= 128) {
      var target = dev.ButtonMapping.find((x) => x.HidButtonID == ObjData[3]);
      var iIndex = target.ButtonID;
      this.LaunchProgram(dev, iIndex);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey, bLayershift = void 0) {
    var iProfile = dev.deviceData.profileindex - 1;
    var KeyAssignData;
    if (dev.BaseInfo.SN == "0x320F0x831A" && bLayershift) {
      KeyAssignData = dev.deviceData.profile[iProfile].keybindingLayerShift[iKey];
    } else {
      KeyAssignData = dev.deviceData.profile[iProfile].keybinding[iKey];
    }
    switch (KeyAssignData.group) {
      case 2:
        if (KeyAssignData.function == 1) {
          var csProgram = KeyAssignData.param;
          if (csProgram != "")
            this.RunApplication(csProgram);
        } else if (KeyAssignData.function == 2) {
          var csProgram = KeyAssignData.param;
          if (csProgram != null && csProgram.trim() != "") {
            this.RunWebSite(GetValidURL(csProgram));
          }
        } else if (KeyAssignData.function == 3)
          ;
        break;
      case 8:
        if (KeyAssignData.function == 1) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 2) {
          var Obj2 = { Func: "SwitchKeyboardProfile", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 3) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 2 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        } else if (KeyAssignData.function == 4) {
          var Obj2 = { Func: "SwitchKeyboardLayer", SN: dev.BaseInfo.SN, Updown: 1 };
          this.emit(EventTypes.ProtocolMessage, Obj2);
        }
        break;
    }
  }
  /**
   * Set Polling Rate to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetPollingRatetoDevice(dev, Obj, callback) {
    var Data = Buffer.alloc(264);
    var arrPollingrate = [1e3, 500, 250, 125];
    Data[0] = 7;
    Data[1] = 8;
    Data[8] = arrPollingrate.indexOf(Obj.iPollingrate);
    Data[9] = Obj.EP2Enable;
    Data[10] = Obj.LEDNoChange;
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback();
      });
    });
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVersion = verRev.padStart(4, "0");
      if (strVersion == "2000") {
        dev.BaseInfo.version_Wired = "0001";
      } else {
        dev.BaseInfo.version_Wired = strVersion;
      }
      dev.BaseInfo.version_Wireless = "99.99.99.99";
      callback(strVersion);
    } catch (e) {
      env.log("ModelOV2WiredSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("ModelOV2WiredSeries", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.profileData;
    var iProfile = dev.deviceData.profileindex - 1;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var KeyAssignData = Obj.profileData[iProfile].keybinding;
            var ObjKeyAssign = {
              iProfile,
              KeyAssignDataLayerShift: {},
              KeyAssignData
            };
            if (dev.BaseInfo.SN == "0x320F0x831A") {
              ObjKeyAssign.KeyAssignDataLayerShift = Obj.profileData[iProfile].keybindingLayerShift;
            }
            var ObjMacroData = { MacroData };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.setProfileToDevice(dev, (paramDB) => {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Done");
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          var LightingData = Obj.profileData[iProfile].lighting;
          var ObjLighting = {
            iProfile,
            LightingData
          };
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
        case switchUIflag.performanceflag:
          var PerformanceData = Obj.profileData[iProfile].performance;
          var ObjPerformance = {
            iProfile,
            PerformanceData
          };
          this.SetPerformance(dev, ObjPerformance, (param1) => {
            this.setProfileToDevice(dev, (paramDB) => {
              dev.m_bSetHWDevice = false;
              callback("SetKeyMatrix Done");
            });
          });
          break;
      }
    } catch (e) {
      env.log("ModelOV2WiredSeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  //Send performance data and convert deviceData into Firmware
  SetPerformance(dev, ObjPerformance, callback) {
    var DpiStage = ObjPerformance.PerformanceData.DpiStage;
    var DataPerformance = Buffer.alloc(264);
    DataPerformance[0] = 7;
    DataPerformance[1] = 4;
    DataPerformance[2] = ObjPerformance.iProfile + 1;
    if (ObjPerformance.PerformanceData.dpiSelectIndex != void 0) {
      DataPerformance[3] = ObjPerformance.PerformanceData.dpiSelectIndex + 1;
    }
    DataPerformance[4] = DpiStage.length;
    for (var i = 0; i < DpiStage.length; i++) {
      var DpiValue = DpiStage[i].value / 50;
      DataPerformance[16 + i * 8 + 0] = DpiValue >> 8;
      DataPerformance[16 + i * 8 + 1] = DpiValue & 255;
      var DPIColor = this.hexToRgb(DpiStage[i].color);
      DataPerformance[16 + i * 8 + 2] = DPIColor.color.R;
      DataPerformance[16 + i * 8 + 3] = DPIColor.color.G;
      DataPerformance[16 + i * 8 + 4] = DPIColor.color.B;
    }
    DataPerformance[5] = ObjPerformance.PerformanceData.LodValue;
    DataPerformance[6] = ObjPerformance.PerformanceData.DebounceValue;
    var arrRate = [125, 250, 500, 1e3];
    var arrRateValue = [1, 2, 3, 4];
    var PollingRate = arrRate.indexOf(
      ObjPerformance.PerformanceData.pollingrate != null && typeof ObjPerformance.PerformanceData.pollingrate === "string" ? parseInt(ObjPerformance.PerformanceData.pollingrate) : ObjPerformance.PerformanceData.pollingrate
    );
    if (PollingRate != -1) {
      DataPerformance[7] = arrRateValue[PollingRate];
    }
    DataPerformance[8] = ObjPerformance.PerformanceData.MotionSyncFlag ? 1 : 0;
    this.SetPerformance2Device(dev, DataPerformance, (param1) => {
      callback("SetPerformance Done");
    });
  }
  //Send current DPI stage from frontend
  SetPerformance2Device(dev, DataPerformance, callback) {
    try {
      var Data = Buffer.alloc(264);
      for (var i = 0; i < DataPerformance.length; i++)
        Data[i] = DataPerformance[i];
      this.SetFeatureReport(dev, Data, 150).then(() => {
        callback("SetPerformance2Device Done");
      });
    } catch (e) {
      env.log("ModelOV2WiredSeries", "SetPerformance2Device", `Error:${e}`);
    }
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    var Data = Buffer.alloc(264);
    Data[0] = 7;
    Data[1] = 5;
    Data[2] = MacroID - 1;
    var iMaxSize = 248;
    for (var k = 0; k < iMaxSize; k++)
      Data[8 + k] = MacroData[0 + k];
    this.SetFeatureReport(dev, Data, 100).then(() => {
      callback("SetMacroDataToDevice Done");
    });
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(256);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = {
          keydown: true,
          key: Hashkeys,
          times: MacroData.content[Hashkeys].data[iData].startTime
        };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    BufferKey[0] = DataEvent.length;
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      const currentEvent = DataEvent[iEvent];
      let KeyCode = SupportData.AllFunctionMapping.find((value) => value.code == currentEvent.key)?.hid ?? 0;
      KeyCode = this.MouseMapping.find((value) => value.code == KeyCode)?.hid ?? KeyCode;
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[1 + iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[1 + iEvent * 3 + 0] += 128;
      BufferKey[1 + iEvent * 3 + 1] = iDelay & 255;
      BufferKey[1 + iEvent * 3 + 2] = KeyCode;
    }
    return BufferKey;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      DataBuffer
    };
    if (dev.BaseInfo.SN == "0x320F0x831A") {
      var KeyAssignData2 = ObjKeyAssign.KeyAssignDataLayerShift;
      KeyAssignData2.layershift = true;
      var DataBuffer2 = this.KeyAssignToData(dev, KeyAssignData2);
      for (let index = 0; index < 36; index++) {
        DataBuffer[36 + index] = DataBuffer2[index];
      }
    }
    this.SendButtonMatrix2Device(dev, Obj1).then(() => {
      callback("SetKeyFunction Done");
    });
  }
  SendButtonMatrix2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 3;
    Data[2] = iProfile + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 150).then(() => {
        resolve("SendButtonMatrix2Device Done");
      });
    });
  }
  SendMacroType2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 4;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      if (DataBuffer == false) {
        resolve("SendButtonMatrix2Device Done");
      } else {
        for (var i = 0; i < DataBuffer.length; i++) {
          Data[8 + i] = DataBuffer[i];
        }
        this.SetFeatureReport(dev, Data, 150).then(() => {
          resolve("SendButtonMatrix2Device Done");
        });
      }
    });
  }
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var target = dev.ButtonMapping.find((x) => x.ButtonID == i);
      var iIndex = target.HidButtonID;
      var Temp_BtnData = KeyAssignData[i];
      switch (Temp_BtnData.group) {
        case 1:
          DataBuffer[iIndex * 4 + 0] = 31 + Temp_BtnData.function;
          if (Temp_BtnData.param == 3) {
            DataBuffer[iIndex * 4 + 1] = 225;
          } else if (Temp_BtnData.param == 2) {
            DataBuffer[iIndex * 4 + 1] = 224;
          } else {
            DataBuffer[iIndex * 4 + 1] = 1;
          }
          break;
        case 7:
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnData.function == SupportData.AllFunctionMapping[iMap].value) {
              var arrModifiers = [1, 0, 2, 3, 4];
              DataBuffer[iIndex * 4 + 0] = 2;
              for (var index = 0; index < Temp_BtnData.param.length; index++) {
                if (Temp_BtnData.param[index] == true)
                  DataBuffer[iIndex * 4 + 1] |= Math.pow(2, arrModifiers[index]);
              }
              DataBuffer[iIndex * 4 + 2] = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          break;
        case 3:
          var arrMouseValue = [1, 1, 2, 3, 5, 4, 160, 161, 177, 176, 1];
          DataBuffer[iIndex * 4 + 0] = 1;
          DataBuffer[iIndex * 4 + 1] = arrMouseValue[Temp_BtnData.function];
          if (Temp_BtnData.function == 11) {
            DataBuffer[iIndex * 4 + 0] = 136;
            DataBuffer[iIndex * 4 + 1] = 0;
          }
          break;
        case 8:
          DataBuffer[iIndex * 4 + 0] = 4;
          DataBuffer[iIndex * 4 + 1] = 1;
          break;
        case 4:
          var arrDPIValue = [1, 1, 2, 3, 4, 5];
          DataBuffer[iIndex * 4 + 0] = 102;
          DataBuffer[iIndex * 4 + 1] = arrDPIValue[Temp_BtnData.function];
          if (arrDPIValue[Temp_BtnData.function] == 5) {
            var DpiValue = Temp_BtnData.param;
            var DpiValue = parseInt(Temp_BtnData.param) / 50;
            DataBuffer[iIndex * 4 + 3] = DpiValue >> 8;
            DataBuffer[iIndex * 4 + 2] = DpiValue & 255;
          }
          break;
        case 5:
          var hidMap = SupportData.MediaMapping[Temp_BtnData.function].hidMap;
          DataBuffer[iIndex * 4 + 0] = 3;
          for (var iTemp = 0; iTemp < hidMap.length; iTemp++) {
            DataBuffer[iIndex * 4 + 2 - iTemp] = hidMap[iTemp];
          }
          break;
        case 2:
          if (Temp_BtnData.function == 1) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 2) {
            DataBuffer[iIndex * 4 + 0] = 4;
            DataBuffer[iIndex * 4 + 1] = 1;
          } else if (Temp_BtnData.function == 3) {
            var hidMap;
            if (Temp_BtnData.param == 4) {
              hidMap = [8, 8];
              DataBuffer[iIndex * 4 + 0] = 2;
            } else {
              hidMap = SupportData.WindowsMapping[Temp_BtnData.param].hidMap;
              DataBuffer[iIndex * 4 + 0] = 3;
            }
            for (var index = 0; index < hidMap.length; index++) {
              DataBuffer[iIndex * 4 + 2 - index] = hidMap[index];
            }
          }
          break;
        case 6:
          DataBuffer[iIndex * 4 + 0] = 0;
          DataBuffer[iIndex * 4 + 1] = 0;
          break;
        default:
          DataBuffer[iIndex * 4] = 255;
          break;
      }
    }
    return DataBuffer;
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("ModelOV2WiredSeries", "SetLEDEffect", "Begin");
    try {
      var ObjEffectData = { iProfile: Obj.iProfile, Data: Obj.LightingData };
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        callback("SetLEDEffect Done");
      });
    } catch (e) {
      env.log("ModelOV2WiredSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iProfile = ObjEffectData.iProfile;
      var iIndex = this.LEDType.findIndex((x) => x.EffectID == ObjEffectData.Data.Effect);
      var HidEffectID = this.LEDType[iIndex].HidEffectID;
      Data[0] = 7;
      Data[1] = 2;
      Data[2] = iProfile + 1;
      Data[3] = HidEffectID;
      Data[4] = ObjEffectData.Data.RateValue > 0 ? ObjEffectData.Data.RateValue * 20 / 100 : 1;
      Data[5] = ObjEffectData.Data.WiredBrightnessValue * 20 / 100;
      for (let LEDindex = 0; LEDindex < dev.deviceData.profile[iProfile].templighting.length; LEDindex++) {
        var arrLightingData = dev.deviceData.profile[iProfile].templighting[LEDindex];
        var tempID = this.LEDType.findIndex((x) => x.EffectID == arrLightingData.Effect);
        var ColorIndexID = this.LEDType[tempID].ColorIndexID;
        if (ColorIndexID != 255) {
          var tempColors = arrLightingData.Color;
          var ColorCount = 0;
          for (var index = 0; index < tempColors.length; index++) {
            if (tempColors[index].flag == true) {
              Data[16 + ColorIndexID * 3 + ColorCount * 3 + 0] = tempColors[index].R;
              Data[16 + ColorIndexID * 3 + ColorCount * 3 + 1] = tempColors[index].G;
              Data[16 + ColorIndexID * 3 + ColorCount * 3 + 2] = tempColors[index].B;
              ColorCount++;
            }
          }
          if (this.LEDType[tempID].value == "Rave") {
            if (ColorCount <= 1) {
              Data[16 + ColorIndexID * 3 + 1 * 3 + 0] = tempColors[0].R;
              Data[16 + ColorIndexID * 3 + 1 * 3 + 1] = tempColors[0].G;
              Data[16 + ColorIndexID * 3 + 1 * 3 + 2] = tempColors[0].B;
            }
          } else if (this.LEDType[tempID].value == "Breathing") {
            Data[6] = ColorCount > 0 ? ColorCount - 1 : 0;
          }
        }
      }
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log("ModelOV2WiredSeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 264, buf);
        setTimeout(() => {
          if (rtnData < 8)
            env.log(
              "ModelOV2WiredSeries SetFeatureReport",
              "SetFeatureReport(error) return data length : ",
              JSON.stringify(rtnData)
            );
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("ModelOV2WiredSeries Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 256);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
}
class Dock extends Device$1 {
  static #instance;
  constructor() {
    env.log("Dock", "Dockclass", "begin");
    super();
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("Dock", "getInstance", `Get exist Dock() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Dock", "getInstance", `New Dock() INSTANCE`);
      this.#instance = new Dock();
      return this.#instance;
    }
  }
  /**
   * init Dock Device
   * @param {*} dev 
   */
  initDevice(dev) {
    env.log("Dock", "initDevice", "begin");
    return new Promise((resolve, reject) => {
      this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
        if (exist) {
          dev.deviceData = exist;
          var StateID = dev.BaseInfo.StateID;
          if (dev.BaseInfo.StateType[StateID] == "Bootloader") {
            resolve();
            return;
          }
          this.InitialDevice(dev, 0, () => {
            resolve();
          });
        } else {
          this.SaveProfileToDevice(dev, (data) => {
            dev.deviceData = data;
            var StateID2 = dev.BaseInfo.StateID;
            if (dev.BaseInfo.StateType[StateID2] == "Bootloader") {
              resolve();
              return;
            }
            this.InitialDevice(dev, 0, () => {
              resolve();
            });
          });
        }
      });
    });
  }
  ImportProfile(dev, obj, callback) {
    let ProfileIndex = dev.deviceData.profileindex;
    env.log("Dock", "ImportProfile", JSON.stringify(obj));
    dev.deviceData.profile[ProfileIndex - 1] = obj;
    this.SetImportProfileData(dev, 0, () => {
      callback();
    });
  }
  InitialDevice(dev, Obj, callback) {
    throw new Error("Not Implemented");
  }
}
class CommonDockSeries extends Dock {
  static #instance;
  arrLEDType;
  arrBatteryStats;
  constructor(hid) {
    env.log("CommonDockSeries", "CommonDockSeries class", "begin");
    super();
    this.hid = hid;
    this.arrLEDType = [
      { UIEffect: 0, value: "Glorious Mode", EffectHID: 3, RGB: true, BatteryCheck: false },
      { UIEffect: 3, value: "Single Color", EffectHID: 4, RGB: false, BatteryCheck: false },
      { UIEffect: 9, value: "Battery Level", EffectHID: 2, RGB: false, BatteryCheck: true },
      { UIEffect: 8, value: "LED Off", EffectHID: 0, RGB: false, BatteryCheck: false }
    ];
    this.arrBatteryStats = [
      { BatteryStats: -1, hid: 0, BatteryFull: false, BatteryLow: false, SleepMode: false, value: "Disconnected", MinValue: -1, MaxValue: -1 },
      { BatteryStats: 0, hid: 3, BatteryFull: false, BatteryLow: false, SleepMode: false, value: "Red Battery", MinValue: 6, MaxValue: 25 },
      { BatteryStats: 1, hid: 2, BatteryFull: false, BatteryLow: false, SleepMode: false, value: "Orange Battery", MinValue: 26, MaxValue: 60 },
      { BatteryStats: 2, hid: 1, BatteryFull: false, BatteryLow: false, SleepMode: false, value: "Yellow Battery", MinValue: 61, MaxValue: 90 },
      { BatteryStats: 3, hid: 0, BatteryFull: false, BatteryLow: false, SleepMode: false, value: "Green Battery", MinValue: 91, MaxValue: 99 },
      { BatteryStats: 4, hid: 0, BatteryFull: true, BatteryLow: false, SleepMode: false, Charging: true, value: "Battery Full", MinValue: 100, MaxValue: 100 },
      { BatteryStats: 5, hid: 3, BatteryFull: false, BatteryLow: true, SleepMode: false, Charging: false, value: "Battery Low", MinValue: 0, MaxValue: 5 },
      { BatteryStats: 4, hid: 0, BatteryFull: false, BatteryLow: false, SleepMode: false, Charging: false, value: "Battery Full-OFF", MinValue: 100, MaxValue: 100 },
      { BatteryStats: 5, hid: 3, BatteryFull: false, BatteryLow: false, SleepMode: false, Charging: true, value: "Battery Low-OFF", MinValue: 0, MaxValue: 5 },
      { BatteryStats: 6, hid: 0, BatteryFull: false, BatteryLow: false, SleepMode: true, value: "Sleep Mode", MinValue: -1, MaxValue: -1 }
    ];
  }
  static getInstance(hid) {
    if (this.#instance) {
      env.log("CommonDockSeries", "getInstance", `Get exist CommonDockSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("CommonDockSeries", "getInstance", `New CommonDockSeries() INSTANCE`);
      this.#instance = new CommonDockSeries(hid);
      return this.#instance;
    }
  }
  InitialDevice(dev, Obj, callback) {
    env.log("CommonDockSeries", "initDevice", "Begin");
    dev.m_bSetHWDevice = false;
    dev.BatteryStats = -1;
    dev.BatteryLow = false;
    dev.BatteryFull = false;
    dev.SleepMode = false;
    dev.MouseCharging = 0;
    if (env.BuiltType == 0) {
      this.ReadFWVersion(dev, 0, () => {
        this.SetProfileDataFromDB(dev, 0, () => {
          var ObjEffectData = dev.deviceData.profile[0].lighting;
          var Obj3 = {
            SN: ObjEffectData.ChooseMouseDataValue
          };
          this.SendDockedCharging(dev, Obj3, () => {
            callback("SetLighting Done");
          });
        });
      });
      callback(0);
    } else {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    }
  }
  /**
   * Read FW Version from device
   * @param {*} dev 
   * @param {*} Obj 
   * @param {*} callback 
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVertion = verRev.padStart(4, "0");
      dev.BaseInfo.version_Wired = strVertion;
      callback(strVertion);
    } catch (e) {
      env.log("GmmkNumpadSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Refresh Mouse Battery Stats 
   * @param {*} dev 
   * @param {*} Obj 
   * @param {*} callback 
   */
  SendBatteryValue(dev, Obj, callback) {
    if (dev.deviceData.profile.length <= 0) {
      callback();
      return;
    }
    var EffectData = dev.deviceData.profile[0].lighting;
    if (EffectData.ChooseMouseDataValue == Obj.SN) {
      if (Obj.Battery == "Device Not Detected") {
        var target = this.arrBatteryStats.find((x) => x.value == "Sleep Mode");
        var arrBatteryStats = target;
        if (arrBatteryStats.BatteryStats == dev.BatteryStats) {
          callback();
          return;
        }
        dev.BatteryFull = arrBatteryStats.BatteryFull;
        dev.BatteryLow = arrBatteryStats.BatteryLow;
        dev.BatteryStats = arrBatteryStats.BatteryStats;
        dev.SleepMode = arrBatteryStats.SleepMode;
        var ObjEffectData = dev.deviceData.profile[0].lighting;
        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
          callback();
        });
        return;
      }
      for (let index = 0; index < this.arrBatteryStats.length; index++) {
        var arrBatteryStats = this.arrBatteryStats[index];
        if (arrBatteryStats.MinValue <= Obj.Battery && arrBatteryStats.MaxValue >= Obj.Battery) {
          var bSwitchFullandLow = false;
          if (arrBatteryStats.Charging != void 0) {
            if (arrBatteryStats.Charging == Obj.Charging) {
              if (dev.BatteryFull != arrBatteryStats.BatteryFull || dev.BatteryLow != arrBatteryStats.BatteryLow) {
                bSwitchFullandLow = true;
              }
            }
          }
          if (arrBatteryStats.BatteryStats != dev.BatteryStats || bSwitchFullandLow || dev.MouseCharging != Obj.Charging) {
            dev.BatteryFull = arrBatteryStats.BatteryFull;
            dev.BatteryLow = arrBatteryStats.BatteryLow;
            dev.BatteryStats = arrBatteryStats.BatteryStats;
            dev.SleepMode = arrBatteryStats.SleepMode;
            dev.MouseCharging = Obj.Charging;
            var ObjEffectData;
            if (dev.deviceData.profile[0].DockedChargingFlag && Obj.Charging) {
              ObjEffectData = dev.deviceData.profile[0].templighting[2];
            } else {
              ObjEffectData = dev.deviceData.profile[0].lighting;
            }
            this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
            });
            break;
          }
        }
      }
    }
    callback();
  }
  SendDisconnected(dev, Obj, callback) {
    var EffectData = dev.deviceData.profile[0].lighting;
    if (EffectData.ChooseMouseDataValue == Obj.SN) {
      dev.Disconnected = true;
      dev.BatteryStats = -1;
      var ObjEffectData = dev.deviceData.profile[0].lighting;
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
      });
    }
    callback();
  }
  //Send App data and convert deviceData into Firmware From Local Data File
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var ObjEffectData;
    if (dev.deviceData.profile[0].DockedChargingFlag && dev.MouseCharging) {
      ObjEffectData = dev.deviceData.profile[0].templighting[2];
    } else {
      ObjEffectData = dev.deviceData.profile[0].lighting;
    }
    this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
      callback("SetProfileDataFromDB Done");
    });
  }
  //Send From UI
  SetLighting(dev, Obj, callback) {
    dev.deviceData.profile = Obj.profileData;
    var ObjEffectData;
    if (dev.deviceData.profile[0].DockedChargingFlag && dev.MouseCharging) {
      ObjEffectData = dev.deviceData.profile[0].templighting[2];
    } else {
      ObjEffectData = dev.deviceData.profile[0].lighting;
    }
    if (ObjEffectData.Effect == 9 && ObjEffectData.ChooseMouseDataValue != void 0) {
      dev.BatteryStats = -1;
      var Obj2 = {
        Func: "RefreshBatteryStats",
        SN: ObjEffectData.ChooseMouseDataValue,
        Param: 0
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.setProfileToDevice(dev, () => {
        var Obj3 = {
          SN: ObjEffectData.ChooseMouseDataValue
        };
        this.SendDockedCharging(dev, Obj3, () => {
          callback("SetLighting Done");
        });
      });
    } else {
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        this.setProfileToDevice(dev, () => {
          var Obj3 = {
            SN: ObjEffectData.ChooseMouseDataValue
          };
          this.SendDockedCharging(dev, Obj3, () => {
            callback("SetLighting Done");
          });
        });
      });
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var target = this.arrLEDType.find((x) => x.UIEffect == ObjEffectData.Effect);
      var iEffect = target.EffectHID;
      var bBreathing = ObjEffectData.BreathingCheckValue;
      if (target.value == "Single Color" && bBreathing == true) {
        iEffect = 5;
      } else if (target.value == "Battery Level" && dev.BatteryStats == -1) {
        iEffect = 0;
      }
      var bRGB = target.RGB;
      Data[0] = 7;
      Data[1] = 2;
      Data[2] = iEffect;
      Data[3] = ObjEffectData.RateValue / 5;
      Data[4] = ObjEffectData.WiredBrightnessValue / 5;
      if (target.BatteryCheck == true) {
        Data[5] = dev.BatteryLow ? 1 : 0;
        Data[6] = dev.BatteryFull ? 1 : 0;
        Data[7] = dev.SleepMode ? 1 : 0;
      }
      if (dev.BatteryStats != -1) {
        target = this.arrBatteryStats.find((x) => x.BatteryStats == dev.BatteryStats);
        Data[8] = target.hid;
      }
      Data[9] = bRGB ? 0 : 1;
      if (ObjEffectData.Color.length > 0) {
        Data[10] = ObjEffectData.Color[0].R;
        Data[11] = ObjEffectData.Color[0].G;
        Data[12] = ObjEffectData.Color[0].B;
      }
      this.SetFeatureReport(dev, Data, 5).then(() => {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  //Send Firmware Data Into node Driver
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 256, buf);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 65);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  SendDockedCharging(dev, Obj, callback) {
    setTimeout(() => {
      var Obj2 = {
        Func: EventTypes.DockedCharging,
        SN: dev.BaseInfo.SN,
        Param: {
          SN: Obj.SN,
          Charging: dev.deviceData.profile[0].DockedChargingFlag
          //Charging:Obj.Charging
        }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      callback();
    }, 100);
  }
}
class valueJ extends Device$1 {
  static instance;
  constructor() {
    env.log("valueJ", "valueJclass", "begin");
    super();
  }
  static getInstance(hid, AudioSession) {
    if (this.instance) {
      env.log("valueJ", "getInstance", `Get exist valueJ() INSTANCE`);
      return this.instance;
    } else {
      env.log("valueJ", "getInstance", `New valueJ() INSTANCE`);
      this.instance = new valueJ();
      return this.instance;
    }
  }
  /**
   * init valueJ Device
   * @param {*} dev 
   */
  initDevice(dev) {
    env.log("valueJ", "initDevice", "begin");
    return new Promise((resolve, reject) => {
      this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
        if (exist) {
          dev.deviceData = exist;
          var StateID = dev.BaseInfo.StateID;
          if (dev.BaseInfo.StateType[StateID] == "Bootloader") {
            resolve();
            return;
          }
          this.InitialDevice(dev, 0, () => {
            resolve();
          });
        } else {
          this.SaveProfileToDevice(dev, (data) => {
            dev.deviceData = data;
            var StateID2 = dev.BaseInfo.StateID;
            if (dev.BaseInfo.StateType[StateID2] == "Bootloader") {
              resolve();
              return;
            }
            this.InitialDevice(dev, 0, () => {
              resolve();
            });
          });
        }
      });
    });
  }
  ImportProfile(dev, obj, callback) {
    var _this2 = this;
    let ProfileIndex = dev.deviceData.profileindex;
    env.log("valueJ", "ImportProfile", JSON.stringify(obj));
    dev.deviceData.profile[ProfileIndex - 1] = obj;
    _this2.SetImportProfileData(dev, 0, function() {
      callback();
    });
  }
  InitialDevice(dev, Obj, callback) {
    throw new Error("Not Implemented");
  }
}
module.exports = valueJ;
const arrLEDType = [
  { UIEffect: 1, value: "Seamless Breathing (RGB)", EffectHID: 11, RGB: true },
  { UIEffect: 3, value: "Breathing", EffectHID: 2, RGB: false },
  { UIEffect: 2, value: "Single Color", EffectHID: 1, RGB: false },
  { UIEffect: 4, value: "Breathing (Single Color)", EffectHID: 3, RGB: false },
  { UIEffect: 8, value: "LED Off", EffectHID: 0, RGB: false }
];
class RGBvalueJSeries extends valueJ {
  constructor(hid = void 0) {
    console.log("RGBvalueJSeries", "RGBvalueJSeries class", "begin");
    super();
    this.hid = hid;
  }
  static getInstance(hid = void 0) {
    if (this.instance) {
      console.log("RGBvalueJSeries", "getInstance", `Get exist RGBvalueJSeries() INSTANCE`);
      return this.instance;
    } else {
      console.log("RGBvalueJSeries", "getInstance", `New RGBvalueJSeries() INSTANCE`);
      this.instance = new RGBvalueJSeries(hid);
      return this.instance;
    }
  }
  InitialDevice(dev, Obj, callback) {
    console.log("RGBvalueJSeries", "initDevice", "Begin");
    callback(0);
    if (env.BuiltType == 0) {
      this.ReadFWVersion(dev, 0, () => {
        this.SetProfileDataFromDB(dev, 0, function() {
          callback("SetLighting Done");
        });
      });
      callback(0);
    } else {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    }
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      this.GetFWVersionFromDevice(dev, 0, (rtnData) => {
        var CurFWVersion = rtnData;
        var verRev = CurFWVersion.toString();
        var strVertion = verRev.padStart(4, "0");
        dev.BaseInfo.version_Wired = strVertion;
        callback(strVertion);
      });
    } catch (e) {
      console.error(dev.BaseInfo.devicename, "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  GetFWVersionFromDevice(dev, Obj, callback) {
    try {
      var Data = Buffer.alloc(9);
      Data[0] = 0;
      Data[1] = 196;
      Data[2] = 8;
      this.SetFeatureReport(dev, Data, 10).then(() => {
        this.GetFeatureReport(dev, Data, 10).then((rtnData) => {
          var FWVer = 0;
          if (rtnData[1] == 85 && rtnData[2] == 170) {
            FWVer = rtnData[3];
          }
          callback(FWVer);
        });
      });
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "GetFWVersionFromDevice", `Error:${e}`);
      callback(0);
    }
  }
  //Send App data and convert deviceData into Firmware From Local Data File
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    this.SetLEDEffect(dev, dev.deviceData.profile[0], () => {
      callback("SetProfileDataFromDB Done");
    });
  }
  //Send From UI
  ApplyLEDEffect(dev, Obj, callback) {
    dev.deviceData.profile = Obj.profileData;
    var ObjEffectData;
    ObjEffectData = dev.deviceData.profile[0].lighting;
    this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
      this.setProfileToDevice(dev, () => {
        callback("SetLighting Done");
      });
    });
  }
  //SetLEDEffect
  SetLEDEffect(dev, ObjLEDEffect, callback) {
    env.log(dev.BaseInfo.devicename, "SetLEDEffect", "Begin");
    try {
      var iZone = ObjLEDEffect.lighting.Zone;
      var ZoneLightData = ObjLEDEffect.lightData[iZone];
      var iSpeed = ZoneLightData.RateValue;
      var iBrightness = ZoneLightData.WiredBrightnessValue;
      var target = arrLEDType.find((x) => x.UIEffect == ZoneLightData.Effect);
      var iEffect = target?.EffectHID;
      var ObjEffectData = { iZone, iEffect };
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        var ObjColorData = {
          iZone,
          iLEDGroup: 1,
          iEffect,
          Color: iEffect == 11 ? [] : ZoneLightData.Color
        };
        this.SetLEDColorToDevice(dev, ObjColorData, () => {
          ObjColorData = {
            iZone,
            iLEDGroup: 2,
            iEffect,
            Color: iEffect == 11 ? [] : ZoneLightData.Color
          };
          this.SetLEDColorToDevice(dev, ObjColorData, () => {
            var ObjBrightData = {
              iZone,
              iLEDGroup: 1,
              iEffect,
              iBright: iBrightness,
              iSpeed
            };
            this.SetBrightSpeedToDevice(dev, ObjBrightData, () => {
              ObjBrightData = {
                iZone,
                iLEDGroup: 2,
                iEffect,
                iBright: iBrightness,
                iSpeed
              };
              this.SetBrightSpeedToDevice(dev, ObjBrightData, () => {
                var ObjDeviceDb = {
                  ...dev
                };
                ObjDeviceDb.deviceData.profile[0] = ObjLEDEffect;
                this.setProfileToDevice(ObjDeviceDb, () => {
                  console.log("setProfileToDevice Done");
                  callback("SetLEDEffect Done");
                });
              });
            });
          });
        });
      });
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(9);
      Data[0] = 0;
      Data[1] = 222;
      switch (ObjEffectData.iZone) {
        case 1:
          Data[2] = 82;
          break;
        case 2:
          Data[2] = 132;
          break;
        default:
          Data[2] = 0;
          break;
      }
      Data[4] = ObjEffectData.iEffect;
      this.SetFeatureReport(dev, Data, 20).then(() => {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  SetBrightSpeedToDevice(dev, ObjBrightData, callback) {
    try {
      var iZone = ObjBrightData.iZone;
      var iLEDGroup = ObjBrightData.iLEDGroup;
      var iSpeed = ObjBrightData.iSpeed;
      var iBrightness = ObjBrightData.iBright;
      var SpeedGroup;
      var BrightGroup = iLEDGroup == 1 ? 83 : 133;
      switch (ObjBrightData.iEffect) {
        case 11:
          SpeedGroup = iLEDGroup == 1 ? 130 : 180;
          break;
        case 2:
          SpeedGroup = iLEDGroup == 1 ? 23 : 30;
          break;
        case 3:
          SpeedGroup = iLEDGroup == 1 ? 23 : 30;
          break;
        default:
          iZone = 1;
          iLEDGroup = 2;
          break;
      }
      var Data = Buffer.alloc(9);
      Data[0] = 0;
      Data[1] = 222;
      Data[3] = 0;
      Data[2] = BrightGroup;
      Data[4] = iBrightness;
      this.SetFeatureReport(dev, Data, 10).then(() => {
        if (iZone == 1 && iLEDGroup != 1) {
          callback(false);
        } else if (iZone == 2 && iLEDGroup != 2) {
          callback(false);
        } else {
          Data[2] = SpeedGroup;
          Data[4] = iSpeed;
          this.SetFeatureReport(dev, Data, 10).then(() => {
            callback("SetBrightSpeedToDevice Done");
          });
        }
      });
    } catch (e) {
      env.log(dev.BaseInfo.devicename, "SetBrightSpeedToDevice", `Error:${e}`);
    }
  }
  SetLEDColorToDevice(dev, ObjColorData, callback) {
    try {
      var iZone = ObjColorData.iZone;
      var iLEDGroup = ObjColorData.iLEDGroup;
      var arrColor = [];
      if (!Array.isArray(ObjColorData.Color) && ObjColorData.Color.R == void 0) {
        var ColorData = this.hexToRgb(ObjColorData.Color);
        if (ColorData) {
          arrColor.push(ColorData);
        }
      } else if (ObjColorData.Color.length > 0) {
        for (var i = 0; i < ObjColorData.Color.length; i++) {
          if (ObjColorData.Color[i].R == void 0) {
            var ColorData = this.hexToRgb(ObjColorData.Color[i]);
            if (ColorData) {
              arrColor.push(ColorData);
            }
          } else {
            if (ObjColorData.Color[i].R != void 0) {
              arrColor.push(ObjColorData.Color[i]);
            }
          }
        }
      } else {
        arrColor = ObjColorData.Color;
      }
      var LEDGroup;
      var iColorCount = 0;
      switch (ObjColorData.iEffect) {
        case 1:
          iColorCount = 1;
          LEDGroup = iLEDGroup == 1 ? 84 : 134;
          break;
        case 2:
          iColorCount = arrColor.length;
          LEDGroup = iLEDGroup == 1 ? 88 : 138;
          break;
        case 3:
          iColorCount = 1;
          LEDGroup = iLEDGroup == 1 ? 88 : 138;
          break;
        default:
          iZone = 1;
          iLEDGroup = 2;
          break;
      }
      var Data = Buffer.alloc(9);
      Data[0] = 0;
      Data[1] = 222;
      Data[3] = 0;
      const SetAp = (iColor, jRGB) => {
        if (iColor < iColorCount) {
          var Color = [arrColor[iColor].R, arrColor[iColor].G, arrColor[iColor].B];
          if (jRGB < 3) {
            Data[2] = LEDGroup + iColor * 3 + jRGB;
            Data[4] = Color[jRGB];
            this.SetFeatureReport(dev, Data, 10).then(() => {
              SetAp(iColor, jRGB + 1);
            });
          } else {
            SetAp(iColor + 1, 0);
          }
        } else {
          if (ObjColorData.iEffect == 2) {
            Data[2] = iLEDGroup == 1 ? 87 : 137;
            Data[4] = ObjColorData.Color.length;
            this.SetFeatureReport(dev, Data, 10).then(() => {
              callback("SetLEDColorToDevice Done");
            });
          } else {
            callback("SetLEDColorToDevice Done");
          }
        }
      };
      if (iZone == 1 && iLEDGroup != 1) {
        callback(false);
      } else if (iZone == 2 && iLEDGroup != 2) {
        callback(false);
      } else {
        SetAp(0, 0);
      }
    } catch (e) {
      console.error(dev.BaseInfo.devicename, "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  //Send Firmware Data Into node Driver
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        if (env.BuiltType == 0) {
          var rtnData = this.hid?.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 9, buf);
          setTimeout(() => {
            resolve(rtnData);
          }, iSleep);
        } else {
          resolve(0);
        }
      } catch (err) {
        console.error("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid?.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 9);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        console.error("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  ////////////////////RGB SYNC////////////////////////////
  //#region RGBSYNC
  SetLEDMatrix(dev, Obj) {
    var DataBuffer = Buffer.alloc(512);
    if (dev.m_bSetHWDevice || !dev.m_bSetSyncEffect) {
      return;
    }
    for (var i = 0; i < 2; i++) {
      var iIndex = i;
      DataBuffer[iIndex * 3 + 0] = Obj.Buffer[i][0];
      DataBuffer[iIndex * 3 + 1] = Obj.Buffer[i][1];
      DataBuffer[iIndex * 3 + 2] = Obj.Buffer[i][2];
    }
    var Obj3 = {
      DataBuffer
    };
    this.SendLEDData2Device(dev, Obj3);
  }
  SendLEDData2Device(dev, Obj) {
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    var Data = Buffer.alloc(9);
    Data[0] = 0;
    Data[1] = 196;
    Data[2] = 224;
    for (var i = 0; i < 6; i++)
      Data[3 + i] = DataBuffer[i];
    this.SetFeatureReport(dev, Data, 10).then(() => {
    });
  }
  SyncFlag(dev, Obj, callback) {
    if (dev.BaseInfo.deviceInfo != void 0 && dev.BaseInfo.deviceInfo.SyncFlag) {
      if (Obj) {
        var ObjEffectData = { iZone: 0, iEffect: 1 };
        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        });
      }
      dev.deviceData.EnableRGBSync = Obj;
      dev.m_bSetSyncEffect = Obj;
    }
    callback();
  }
  //#endregion RGBSYNC
}
module.exports = RGBvalueJSeries;
const GMMKLocation = {
  keyBoardList: {
    "0x320F0x5044": {
      DeviceName: "GMMK PRO",
      Matrix_LEDCode: [
        //GMMK PRO-87 Keys 
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "k45",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "RCtrl",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        100,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x5092": {
      //WB
      DeviceName: "GMMK PRO",
      Matrix_LEDCode: [
        //GMMK PRO-87 Keys 
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "k45",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "RCtrl",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        100,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x5046": {
      DeviceName: "GMMK PRO ISO",
      Matrix_LEDCode: [
        //GMMK PRO-87 Keys 
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "RCtrl",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        //GMMK PRO-87 Keys-UK Buttoninfo_Default
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x5093": {
      //WB
      DeviceName: "GMMK PRO ISO",
      Matrix_LEDCode: [
        //GMMK PRO-87 Keys 
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "RCtrl",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Insert",
        "Mute",
        "~",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Home",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        //GMMK PRO-87 Keys-UK Buttoninfo_Default
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x5045": {
      DeviceName: "GMMK V2 65US",
      Matrix_LEDCode: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "delete",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        53,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        41,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x504A": {
      DeviceName: "GMMK V2 65ISO",
      Matrix_LEDCode: [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "delete",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "",
        "PageUp",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "",
        "",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "",
        "",
        "Space",
        "",
        "",
        "RAlt",
        "fn",
        "",
        "",
        "Left",
        "Down",
        "Right",
        "",
        "",
        "",
        "",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "PageDown",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        2,
        1,
        2,
        255,
        1,
        1,
        1,
        255,
        255,
        255,
        255,
        255,
        53,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        2,
        255,
        255,
        255,
        255,
        255,
        41,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        76,
        255,
        255,
        255,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        75,
        255,
        255,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        78,
        255,
        255,
        255,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        77,
        255,
        255,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        230,
        160,
        228,
        255,
        80,
        81,
        79,
        255,
        255,
        255,
        255,
        255
      ]
    },
    "0x320F0x504B": {
      DeviceName: "GMMK V2 96US",
      Matrix_LEDCode: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "delete",
        "insert",
        "PageUp",
        "PageDown",
        "",
        "",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "Num7",
        "Num8",
        "Num9",
        "",
        "",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Numplus",
        "",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "Numenter",
        "",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "delete",
        "insert",
        "PageUp",
        "PageDown",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        76,
        73,
        75,
        78,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        83,
        84,
        85,
        86,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        95,
        96,
        97,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        92,
        93,
        94,
        87,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        89,
        90,
        91,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        230,
        160,
        228,
        80,
        81,
        79,
        98,
        99,
        88,
        255,
        255
      ]
    },
    "0x320F0x505A": {
      DeviceName: "GMMK V2 96ISO",
      Matrix_LEDCode: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "delete",
        "insert",
        "PageUp",
        "PageDown",
        "",
        "",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "",
        "",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "Num7",
        "Num8",
        "Num9",
        "",
        "",
        "",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Numplus",
        "",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "",
        "",
        "",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "Numenter",
        "",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "delete",
        "insert",
        "PageUp",
        "PageDown",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        41,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        76,
        73,
        75,
        78,
        255,
        255,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        83,
        84,
        85,
        86,
        255,
        255,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        95,
        96,
        97,
        255,
        255,
        255,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        92,
        93,
        94,
        87,
        255,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        229,
        82,
        89,
        90,
        91,
        255,
        255,
        255,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        230,
        160,
        228,
        80,
        81,
        79,
        98,
        99,
        88,
        255,
        255
      ]
    },
    "0x320F0x5088": {
      DeviceName: "GMMK Numpad",
      Matrix_KEYCode: [
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "Num4",
        "Num5",
        "Num6",
        "Mute",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Num0",
        "",
        "",
        "Numdot"
      ],
      Matrix_LEDCode: [
        "SideLED1",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "SideLED8",
        "SideLED2",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "SideLED9",
        "SideLED3",
        "",
        "",
        "",
        "",
        "SideLED10",
        "SideLED4",
        "Num4",
        "Num5",
        "Num6",
        "Numplus",
        "SideLED11",
        "SideLED5",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "SideLED12",
        "SideLED6",
        "",
        "",
        "",
        "",
        "SideLED13",
        "SideLED7",
        "",
        "Num0",
        "Numdot",
        "",
        "SideLED14"
      ],
      Matrix_KEYButtons: [
        "SideLED1",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Mute",
        "SideLED8",
        "SideLED2",
        "SideLED3",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "Slider",
        "SideLED9",
        "SideLED10",
        "SideLED4",
        "Num4",
        "Num5",
        "Num6",
        "SideLED11",
        "SideLED12",
        "SideLED5",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "SideLED13",
        "SideLED6",
        "SideLED7",
        "Num0",
        "Numdot",
        "SideLED14"
      ],
      Buttoninfo_Default: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        3,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        83,
        84,
        85,
        86,
        95,
        96,
        97,
        87,
        92,
        93,
        94,
        16,
        89,
        90,
        91,
        88,
        98,
        0,
        0,
        99
      ]
    },
    "0x342D0xE3C5": {
      DeviceName: "valueA PRO valueB",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x342D0xE3CB": {
      DeviceName: "valueA PRO valueB Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x342D0xE3C6": {
      DeviceName: "valueA PRO valueB 75%",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End		
    "0x342D0xE3CC": {
      DeviceName: "valueA PRO valueB 75% Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x342D0xE3C7": {
      DeviceName: "valueA PRO valueB 65%",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "Mute",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageUp",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "PageDown",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x342D0xE3CD": {
      DeviceName: "valueA PRO valueB 65% Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "Mute",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageUp",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "PageDown",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x24420x2682": {
      DeviceName: "valueA PRO valueB",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x24420x0056": {
      DeviceName: "valueA PRO valueB Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "Num4",
        "Num5",
        "Num6",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "Numdot",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x24420x0053": {
      DeviceName: "valueA PRO valueB 75%",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End		
    "0x24420x0055": {
      DeviceName: "valueA PRO valueB 75% Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "delete",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "PageUp",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageDown",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "End",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x24420x0052": {
      DeviceName: "valueA PRO valueB 65%",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "Mute",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageUp",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "PageDown",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    },
    //End
    "0x24420x0054": {
      DeviceName: "valueA PRO valueB 65% Wireless",
      Matrix_LEDCode: [
        "Esc",
        "",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "print",
        "ScLk",
        "Pause",
        "",
        "",
        "",
        "Mute",
        "period",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "insert",
        "Home",
        "PageUp",
        "Numlock",
        "Numdivide",
        "Nummulti",
        "Numminus",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "delete",
        "End",
        "PageDown",
        "Num7",
        "Num8",
        "Num9",
        "Numplus",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "k42",
        "Enter",
        "",
        "",
        "",
        "Num4",
        "Num5",
        "Num6",
        "",
        "Shift",
        "k45",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "",
        "RShift",
        "",
        "Up",
        "",
        "Num1",
        "Num2",
        "Num3",
        "Numenter",
        "Ctrl",
        "Left Win",
        "Alt",
        "K131",
        "K151",
        "Space",
        "",
        "K132",
        "K131",
        "",
        "RAlt",
        "fn",
        "Menu",
        "RCtrl",
        "Left",
        "Down",
        "Right",
        "Num0",
        "",
        "Numdot",
        "",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20",
        ""
      ],
      Matrix_KEYButtons: [
        "Esc",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Bksp",
        "Mute",
        "Tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        "[",
        "]",
        "k29",
        "CapsLock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        ";",
        "'",
        "Enter",
        "PageUp",
        "Shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        ",   ",
        "dot",
        "/",
        "RShift",
        "Up",
        "PageDown",
        "Ctrl",
        "Left Win",
        "Alt",
        "Space",
        "RAlt",
        "fn",
        "Left",
        "Down",
        "Right",
        "SideLED1",
        "SideLED2",
        "SideLED3",
        "SideLED4",
        "SideLED5",
        "SideLED6",
        "SideLED7",
        "SideLED8",
        "SideLED9",
        "SideLED10",
        "SideLED11",
        "SideLED12",
        "SideLED13",
        "SideLED14",
        "SideLED15",
        "SideLED16",
        "SideLED17",
        "SideLED18",
        "SideLED19",
        "SideLED20"
      ],
      Buttoninfo_Default: [
        1,
        255,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        3,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        255,
        255,
        1,
        1,
        1,
        255,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        255,
        2,
        255,
        1,
        255,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        255,
        255,
        1,
        255,
        255,
        255,
        255,
        2,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        255,
        1,
        255,
        41,
        255,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        255,
        255,
        255,
        2,
        53,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        45,
        46,
        42,
        73,
        74,
        75,
        83,
        84,
        85,
        86,
        43,
        20,
        26,
        8,
        21,
        23,
        28,
        24,
        12,
        18,
        19,
        47,
        48,
        49,
        76,
        77,
        78,
        95,
        96,
        97,
        87,
        57,
        4,
        22,
        7,
        9,
        10,
        11,
        13,
        14,
        15,
        51,
        52,
        50,
        40,
        255,
        255,
        255,
        92,
        93,
        94,
        255,
        225,
        100,
        29,
        27,
        6,
        25,
        5,
        17,
        16,
        54,
        55,
        56,
        255,
        229,
        255,
        82,
        91,
        89,
        90,
        91,
        88,
        224,
        227,
        226,
        255,
        255,
        44,
        255,
        255,
        255,
        255,
        230,
        160,
        101,
        228,
        80,
        81,
        79,
        98,
        255,
        99,
        255,
        255,
        255,
        255,
        255
      ]
    }
    //End
  }
};
class Keyboard extends Device$1 {
  static #instance;
  setDeviceDataCallback = null;
  constructor() {
    env.log("Keyboard", "Keyboardclass", "begin");
    super();
  }
  static getInstance(hid, AudioSession) {
    if (this.#instance) {
      env.log("Keyboard", "getInstance", `Get exist Keyboard() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Keyboard", "getInstance", `New Keyboard() INSTANCE`);
      this.#instance = new Keyboard();
      return this.#instance;
    }
  }
  /**
   * init Keyboard Device
   * @param {*} dev  device Info
   */
  initDevice(dev) {
    try {
      return new Promise((resolve, reject) => {
        this.nedbObj.getDevice(dev.BaseInfo.SN).then((exist) => {
          if (exist) {
            dev.deviceData = exist;
            var StateID = dev.BaseInfo.StateID;
            if (dev.BaseInfo.StateType[StateID] == "Bootloader") {
              resolve();
              return;
            }
            this.InitialDevice(dev, 0, () => {
              resolve();
            });
          } else {
            this.SaveProfileToDevice(dev, (data) => {
              var StateID2 = dev.BaseInfo.StateID;
              if (dev.BaseInfo.StateType[StateID2] == "Bootloader") {
                resolve();
                return;
              }
              dev.deviceData = data;
              this.InitialDevice(dev, 0, () => {
                resolve();
              });
            });
          }
        });
      });
    } catch (e) {
      env.log("Device:" + dev.BaseInfo.devicename, "initDevice", `Error:${e}`);
    }
  }
  /**
   * Save Device data to DB
   * @param {*} dev
   * @param {*} callback
   */
  SaveProfileToDevice(dev, callback) {
    env.log("Device", "SaveProfileToDevice", `SaveProfileToDevice`);
    var BaseInfo = dev.BaseInfo;
    var obj = {
      vid: BaseInfo.vid,
      pid: BaseInfo.pid,
      SN: BaseInfo.SN,
      devicename: BaseInfo.devicename,
      ModelType: BaseInfo.ModelType,
      image: BaseInfo.img,
      battery: BaseInfo.battery,
      layerMaxNumber: BaseInfo.layerMaxNumber,
      profile: BaseInfo.defaultProfile,
      profileLayerIndex: BaseInfo.profileLayerIndex,
      sideLightSwitch: BaseInfo.sideLightSwitch,
      profileLayers: BaseInfo.profileLayers,
      profileindex: 0
    };
    this.nedbObj.AddDevice(obj).then(() => {
      callback(obj);
    });
  }
  /*
  Keyboards:
  GMMK Numpad: 0x320F0x5088
  GMMK PRO: 0x320F0x5044 (alternate board: 0x320F0x5092)
  GMMK PRO ISO: 0x320F0x5046 (alternate board: 0x320F0x5093)
  GMMK v2 65 ISO: 0x320F0x504A
  GMMK v2 65 US: 0x320F0x5045
  GMMK v2 96 ISO: 0x320F0x505A
  GMMK v2 96 US: 0x320F0x504B
  
  valueA valueB: TODO
  valueA valueD: TODO
  valueA valueC 65% Wireless ANSI: 0x342D0xE3D7
  valueA valueC 75% Wireless ANSI: 0x342D0xE3D8
  valueA valueC 100% Wireless ANSI: 0x342D0xE3D9
  valueA valueC 65% ANSI: 0x342D0xE3DA
  valueA valueC 75% ANSI: 0x342D0xE3DB
  valueA valueC 100% ANSI: 0x342D0xE3DC
  valueA valueC 65% Wireless ISO: 0x342D0xE3EC
  valueA valueC 75% Wireless ISO: 0x342D0xE3ED
  valueA valueC 100% Wireless ISO: 0x342D0xE3EE
  valueA valueC 65% ISO: 0x342D0xE3EF
  valueA valueC 75% ISO: 0x342D0xE3F0
  valueA valueC 100% ISO: 0x342D0xE3F1
  valueA valueD HE 65% ANSI: 0x342D0xE3DD
  valueA valueD HE 65% ISO: 0x342D0xE3F2
  valueA valueD HE 75% ANSI: 0x342D0xE3DE
  valueA valueD HE 75% ISO: 0x342D0xE3F3
  valueA valueD HE 100% ANSI: 0x342D0xE3DF
  valueA valueD HE 100% ISO: 0x342D0xE3F4
  
  */
  /**
   * Switch Profile
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ChangeProfileID(dev, Obj, callback) {
    env.log(dev.BaseInfo.devicename, "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      }
      var Data = Buffer.alloc(264);
      dev.deviceData.profileindex = Obj;
      var iLayerIndex = dev.deviceData.profileLayerIndex[Obj];
      Data[0] = 7;
      Data[1] = 1;
      Data[2] = Obj + 1;
      Data[3] = iLayerIndex + 1;
      const isGmmkV2 = dev.deviceData.SN == "0x320F0x504A" || dev.deviceData.SN == "0x320F0x5045" || dev.deviceData.SN == "0x320F0x505A" || dev.deviceData.SN == "0x320F0x504B";
      if (isGmmkV2 == true) {
        this.setDeviceDataCallback = callback.bind("ChangeProfileID Done");
      }
      this.SetFeatureReport(dev, Data, 50).then(() => {
        if (isGmmkV2 == false) {
          callback("ChangeProfileID Done");
        }
      });
    } catch (e) {
      env.log("ModelOSeries", "SetKeyMatrix", `Error:${e}`);
      callback();
    }
  }
  /**
   * Mouse change Keyboard Profile
   * @param {*} obj 1:up 2:down
   */
  ChangeProfile(dev, obj) {
    new Promise((resolve, reject) => {
      if (obj == 1)
        dev.deviceData.profileindex++;
      if (obj == 2)
        dev.deviceData.profileindex--;
      if (dev.deviceData.profileindex >= dev.deviceData.profile.length)
        dev.deviceData.profileindex = 0;
      else if (dev.deviceData.profileindex < 0)
        dev.deviceData.profileindex = dev.deviceData.profile.length - 1;
      this.ChangeProfileID(dev, dev.deviceData.profileindex, (data) => {
        this.setProfileToDevice(dev, (data2) => {
          var ObjProfileIndex = { Profile: dev.deviceData.profileindex, LayerIndex: dev.deviceData.profileLayerIndex[dev.deviceData.profileindex], SN: dev.BaseInfo.SN };
          var Obj2 = {
            Func: EventTypes.SwitchUIProfile,
            SN: dev.BaseInfo.SN,
            Param: ObjProfileIndex
          };
          this.emit(EventTypes.ProtocolMessage, Obj2);
          resolve();
        });
      });
    });
  }
  /**
   * Mouse change Keyboard Layer
   * @param {*} obj 1:up 2:down
   */
  ChangeLayer(dev, obj) {
    new Promise((resolve, reject) => {
      if (obj == 1)
        dev.deviceData.profileLayerIndex[dev.deviceData.profileindex]++;
      if (obj == 2)
        dev.deviceData.profileLayerIndex[dev.deviceData.profileindex]--;
      if (dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] >= dev.deviceData.profileLayerIndex.length)
        dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] = 0;
      else if (dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] < 0)
        dev.deviceData.profileLayerIndex[dev.deviceData.profileindex] = dev.deviceData.profileLayerIndex.length - 1;
      this.ChangeProfileID(dev, dev.deviceData.profileindex, (data) => {
        this.setProfileToDevice(dev, (data2) => {
          var ObjProfileIndex = { Profile: dev.deviceData.profileindex, LayerIndex: dev.deviceData.profileLayerIndex[dev.deviceData.profileindex], SN: dev.BaseInfo.SN };
          var Obj2 = {
            Func: EventTypes.SwitchUIProfile,
            SN: dev.BaseInfo.SN,
            Param: ObjProfileIndex
          };
          this.emit(EventTypes.ProtocolMessage, Obj2);
          resolve();
        });
      });
    });
  }
  /**
   * Import Profile
   * @param {*} dev
   * @param {*} obj
   * @param {*} callback
   */
  ImportProfile(dev, obj, callback) {
    let ProfileIndex = dev.deviceData.profileindex;
    var profilelist = obj.profilelist;
    env.log("DeviceApi ImportProfile", "ImportProfile", JSON.stringify(obj));
    for (var i = 0; i < profilelist.length; i++) {
      dev.deviceData.profileLayers[ProfileIndex][i] = profilelist[i];
    }
    var Obj2 = {
      Perkeylist: obj.PERKEYlist,
      Macrolist: obj.macrolist
    };
    this.SetImportProfileData(dev, Obj2, () => {
      callback();
    });
  }
  InitialDevice(dev, Obj, callback) {
    throw new Error("Not Implemented");
  }
  SetFeatureReport(dev, buf, iSleep) {
    throw new Error("Not Implemented");
  }
}
module.exports = Keyboard;
class GmmkSeries extends Keyboard {
  static #instance;
  m_bSetFWEffect;
  m_bSetHWDevice;
  Matrix_SideLED;
  arrLEDType;
  constructor(hid, AudioSession) {
    env.log("GmmkSeries", "GmmkSeries class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.m_bSetHWDevice = false;
    this.hid = hid;
    this.AudioSession = AudioSession;
    this.Matrix_SideLED = ["SideLED1", "SideLED2", "SideLED3", "SideLED4", "SideLED5", "SideLED6", "SideLED7", "SideLED8", "SideLED9", "SideLED10", "SideLED11", "SideLED12", "SideLED13", "SideLED14", "SideLED15", "SideLED16", "SideLED17", "SideLED18", "SideLED19", "SideLED20"];
    this.arrLEDType = [
      8,
      //'LEDOFF',
      0,
      //'GloriousMode',
      1,
      //'Wave#1',
      3,
      //'Wave#2',
      4,
      //'SpiralingWave',
      5,
      //'AcidMode',
      2,
      //'Breathing',
      6,
      //'NormallyOn',
      7,
      //'RippleGraff',
      9,
      //'PassWithoutTrace',
      10,
      //'FastRunWithoutTrace',
      11,
      //'Matrix2',
      12,
      //'Matrix3',
      13,
      //'Rainbow',
      14,
      //'HeartbeatSensor',
      15,
      //'DigitTimes',
      16,
      //'Kamehameha',
      17,
      //'Pingpong',
      18
      //'Surmount',
    ];
  }
  static getInstance(hid, AudioSession) {
    if (this.#instance) {
      env.log("GmmkSeries", "getInstance", `Get exist GmmkSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("GmmkSeries", "getInstance", `New GmmkSeries() INSTANCE`);
      this.#instance = new GmmkSeries(hid, AudioSession);
      return this.#instance;
    }
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    env.log("GmmkSeries", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    var keyBoardList = GMMKLocation.keyBoardList[dev.BaseInfo.SN];
    if (keyBoardList != void 0) {
      dev.Matrix_LEDCode_GMMK = keyBoardList.Matrix_LEDCode;
      dev.Matrix_KEYButtons_GMMK = keyBoardList.Matrix_KEYButtons;
      dev.Buttoninfo_Default = keyBoardList.Buttoninfo_Default;
    } else {
      env.log("GmmkNumpadSeries", dev.BaseInfo.devicename, "GMMKLocation is not Exists");
      callback(0);
      return;
    }
    if (dev.BaseInfo.SN == "0x24420x0054" || dev.BaseInfo.SN == "0x24420x0053" || dev.BaseInfo.SN == "0x24420x0055" || dev.BaseInfo.SN == "0x24420x2862" || dev.BaseInfo.SN == "0x24420x0052") {
      dev.KeyMatrixLength = 126;
      dev.KeyColumnLength = 21;
    } else {
      dev.KeyMatrixLength = 120;
      dev.KeyColumnLength = 21;
    }
    dev.BaseInfo.version_Wireless = "0001";
    if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    } else if (env.BuiltType == 0) {
      var ObjPollingrate = { iPollingrate: 1e3, EP2Enable: 1, LEDNoChange: 1 };
      this.SetPollingRatetoDevice(dev, ObjPollingrate, (param1) => {
        this.SetProfileDataFromDB(dev, 0, () => {
          setTimeout(() => {
            this.OnTimerGetAudioSession(dev);
          }, 3e3);
          callback(0);
        });
      });
    } else {
      dev.BaseInfo.version_Wired = "0021";
      callback(0);
    }
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    this.nedbObj.getLayout().then((data) => {
      const SetProfileData = (iProfile, iLayerIndex) => {
        var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
        var ProfileData = dev.deviceData.profile[iProfile];
        if (iProfile < 3 && iLayerIndex < 3 && ProfileData != void 0) {
          var appProfileLayers = dev.deviceData.profileLayers;
          var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
          var ObjKeyAssign = {
            iProfile,
            iLayerIndex,
            KeyAssignData
          };
          var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
          LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
          var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
          var ObjLighting = {
            iProfile,
            iLayerIndex,
            LightingData,
            LightingPerKeyData,
            Perkeylist: layoutDBdata
          };
          this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
              SetProfileData(iProfile, iLayerIndex + 1);
            });
          });
        } else if (iProfile < 3 && ProfileData != void 0) {
          SetProfileData(iProfile + 1, 0);
        } else {
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var ObjMacroData = { MacroData };
            this.SetMacroFunction(dev, ObjMacroData, (param1) => {
              this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                var iProfile2 = dev.deviceData.profileindex;
                var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfile2];
                var appProfileLayers2 = dev.deviceData.profileLayers;
                var iPollingrate = appProfileLayers2[iProfile2][iLayerIndex2].pollingrate;
                var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
                this.SetPollingRatetoDevice(dev, ObjPollingrate, (param12) => {
                  callback("SetProfileDataFromDB Done");
                });
              });
            });
          });
        }
      };
      SetProfileData(0, 0);
    });
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex;
    const SetLayoutData = (iLayerIndex) => {
      if (iLayerIndex < 3) {
        var appProfileLayers = dev.deviceData.profileLayers;
        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
        var ObjKeyAssign = {
          iProfile,
          iLayerIndex,
          KeyAssignData
        };
        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
        var Perkeylist = Obj.Perkeylist;
        var ObjLighting = {
          iProfile,
          iLayerIndex,
          LightingData,
          LightingPerKeyData,
          Perkeylist
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            SetLayoutData(iLayerIndex + 1);
          });
        });
      } else {
        var Macrolist = Obj.Macrolist;
        var MacroData = [];
        for (let index = 0; index < Macrolist.length; index++) {
          if (parseInt(Macrolist[index].m_Identifier) > 0) {
            MacroData.push(Macrolist[index]);
          }
        }
        var ObjMacroData = { MacroData };
        this.SetMacroFunction(dev, ObjMacroData, (param1) => {
          var iProfile2 = dev.deviceData.profileindex;
          var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfile2];
          var appProfileLayers2 = dev.deviceData.profileLayers;
          var iPollingrate = appProfileLayers2[iProfile2][iLayerIndex2].pollingrate;
          var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
          this.SetPollingRatetoDevice(dev, ObjPollingrate, (param12) => {
            this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
              callback("SetProfileDataFromDB Done");
            });
          });
        });
      }
    };
    SetLayoutData(0);
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[2] >= 128) {
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      if (iKeyColumn == 4 && (iKeyRaw == 15 || iKeyRaw == 16)) {
        this.LaunchProgramKnob(dev, iKeyRaw == 16 ? 1 : 0, false);
      } else {
        var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn * 20 + iKeyRaw]);
        this.LaunchProgram(dev, iKey);
      }
    } else if (ObjData[0] == 4 && ObjData[1] == 241 && ObjData[8] != 1) {
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var ObjProfileIndex = { Profile: iProfile, LayerIndex: iLayerIndex, SN: dev.BaseInfo.SN };
      env.log("GmmkSeries", "HIDEP2Data-SwitchProfile", JSON.stringify(ObjProfileIndex));
      dev.deviceData.profileindex = iProfile;
      dev.deviceData.profileLayerIndex[iProfile] = iLayerIndex;
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: ObjProfileIndex
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.setProfileToDevice(dev, (paramDB) => {
        if (this.setDeviceDataCallback != null) {
          this.setDeviceDataCallback();
          this.setDeviceDataCallback = null;
        }
      });
    } else if (ObjData[0] == 4 && ObjData[1] == 242) {
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var iEffect = this.arrLEDType[ObjData[4]];
      var iSpeed = ObjData[5] * 100 / 20;
      var iBright = ObjData[6] * 100 / 20;
      var ObjLighting = { Profile: iProfile, LayerIndex: iLayerIndex, Effect: iEffect, Speed: iSpeed, Bright: iBright, SN: dev.BaseInfo.SN };
      var Obj2 = {
        Func: EventTypes.SwitchLighting,
        SN: dev.BaseInfo.SN,
        Param: ObjLighting
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 4 && ObjData[1] == 249) {
      var iEffect = this.arrLEDType[ObjData[2]];
      var bMultiColor = ObjData[3] == 1 ? true : false;
      var iProfileindex = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfileindex];
      var LightingData = JSON.parse(JSON.stringify(dev.deviceData.profileLayers[iProfileindex][iLayerIndex].light_PRESETS_Data));
      if (iEffect == LightingData.value) {
        LightingData.Multicolor = bMultiColor;
        var ObjLighting2 = { Effect: LightingData, SN: dev.BaseInfo.SN };
        var Obj2 = {
          Func: EventTypes.SwitchMultiColor,
          SN: dev.BaseInfo.SN,
          Param: ObjLighting2
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        this.setProfileToDevice(dev, (paramDB) => {
        });
      }
    }
    if (ObjData[0] == 4 && (ObjData[1] == 248 || ObjData[1] == 247) && ObjData[2] >= 128) {
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn * 20 + iKeyRaw]);
      var Obj3 = { Func: "SendKeynumber", SN: dev.BaseInfo.SN, Param: iKey };
      this.emit(EventTypes.ProtocolMessage, Obj3);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
    switch (KeyAssignData.recordBindCodeType) {
      case "LaunchProgram":
        var csProgram = KeyAssignData.ApplicationPath;
        if (csProgram == void 0) {
          console.log(dev.BaseInfo.devicename, "---csProgram is undefined");
        } else if (csProgram != "") {
          this.RunApplication(csProgram);
        }
        break;
      case "LaunchWebsite":
        var csProgram = KeyAssignData.WebsitePath;
        if (csProgram == void 0) {
          console.log(dev.BaseInfo.devicename, "---csProgram is undefined");
        }
        if (csProgram != null && csProgram.trim() != "") {
          this.RunWebSite(GetValidURL(csProgram));
        }
        break;
    }
  }
  /**
   * Launch Program Knob
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgramKnob(dev, iKey, bSwitch) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKnob[iKey];
    env.log("GmmkNumpad-LaunchProgram", "KnobData:" + JSON.stringify(KeyAssignData), "iKey:" + JSON.stringify(iKey));
    switch (KeyAssignData.recordBindCodeType) {
      case "Shortcuts":
        if (KeyAssignData.recordBindCodeName == "Microphone_Down") {
          this.AudioSession?.MicrophoneDown(2);
        } else if (KeyAssignData.recordBindCodeName == "Microphone_Up") {
          this.AudioSession?.MicrophoneUp(2);
        } else if (KeyAssignData.recordBindCodeName == "Audio_Device_Prev") {
          this.AudioSession?.Initialization();
          this.AudioSession?.SetNextAudioDeviceDefault();
        } else if (KeyAssignData.recordBindCodeName == "Audio_Device_Next") {
          this.AudioSession?.Initialization();
          this.AudioSession?.SetNextAudioDeviceDefault();
        }
        break;
    }
  }
  /**
   * Set Polling Rate to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetPollingRatetoDevice(dev, Obj, callback) {
    var Data = Buffer.alloc(264);
    var arrPollingrate = [1e3, 500, 250, 125];
    Data[0] = 7;
    Data[1] = 8;
    Data[8] = arrPollingrate.indexOf(Obj.iPollingrate);
    Data[9] = Obj.EP2Enable;
    Data[10] = Obj.LEDNoChange;
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback();
      });
    });
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVertion = verRev.padStart(4, "0");
      if (strVertion == "2000") {
        dev.BaseInfo.version_Wired = "0001";
      } else {
        dev.BaseInfo.version_Wired = strVertion;
      }
      callback("0");
    } catch (e) {
      env.log("GmmkSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("GmmkSeries", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.KeyBoardManager.KeyBoardArray;
    dev.deviceData.profileLayers = Obj.KeyBoardManager.profileLayers;
    dev.deviceData.profileindex = Obj.KeyBoardManager.profileindex;
    dev.deviceData.profileLayerIndex = Obj.KeyBoardManager.profileLayerIndex;
    dev.deviceData.sideLightSwitch = Obj.KeyBoardManager.sideLightSwitch;
    var iProfile = Obj.KeyBoardManager.profileindex;
    var appProfileLayers = Obj.KeyBoardManager.profileLayers;
    Obj.KeyBoardManager.layerMaxNumber;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var KeyAssignData = appProfileLayers[iProfile][iLayerIndex2].assignedKeyboardKeys[0];
            var ObjKeyAssign = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              KeyAssignData
            };
            var ObjMacroData = { MacroData };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.ChangeProfileID(dev, iProfile, (param0) => {
                  this.setProfileToDevice(dev, (paramDB) => {
                    dev.m_bSetHWDevice = false;
                    callback("SetKeyMatrix Done");
                  });
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          this.nedbObj.getLayout().then((data) => {
            var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var LightingData = appProfileLayers[iProfile][iLayerIndex2].light_PRESETS_Data;
            LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex2].inputLatency;
            var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex2].light_PERKEY_Data;
            var ObjLighting = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              LightingData,
              LightingPerKeyData,
              Perkeylist: layoutDBdata
            };
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
              this.setProfileToDevice(dev, (paramDB) => {
                this.ChangeProfileID(dev, iProfile, (param0) => {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Done");
                });
              });
            });
          });
          break;
        case switchUIflag.performanceflag:
          var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
          var iPollingrate = appProfileLayers[iProfile][iLayerIndex].pollingrate;
          var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
          this.SetPollingRatetoDevice(dev, ObjPollingrate, (paramDB) => {
            var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
            LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
            var ObjTypeData = { iProfile, iLayerIndex, Data: LightingData };
            this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
              this.setProfileToDevice(dev, (paramDB2) => {
                callback("SetKeyMatrix Done");
              });
            });
          });
          break;
      }
    } catch (e) {
      env.log("GmmkSeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    var Data = Buffer.alloc(264);
    Data[0] = 7;
    Data[1] = 5;
    Data[2] = MacroID;
    var iMaxSize = 248;
    for (var k = 0; k < iMaxSize; k++)
      Data[8 + k] = MacroData[0 + k];
    this.SetFeatureReport(dev, Data, 100).then(() => {
      callback("SetMacroDataToDevice Done");
    });
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(256);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = { keydown: true, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].startTime };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = SupportData.AllFunctionMapping[i].hid;
          break;
        }
      }
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[iEvent * 3 + 0] += 128;
      BufferKey[iEvent * 3 + 1] = iDelay & 255;
      BufferKey[iEvent * 3 + 2] = KeyCode;
    }
    return BufferKey;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer
    };
    var DataBuffer2 = this.MacroTypeToData(dev, KeyAssignData);
    var Obj2 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer2
    };
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer3 = this.KeyAltGrToData(dev, KeyAssignData);
    var Obj3 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer3
    };
    this.SendButtonMatrix2Device(dev, Obj1).then(() => {
      this.SendMacroType2Device(dev, Obj2).then(() => {
        this.SendAlrGR2Device(dev, Obj3, () => {
          callback("SetKeyFunction Done");
        });
      });
    });
  }
  SendAlrGR2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 9;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    this.SetFeatureReport(dev, Data, 150).then(() => {
      callback();
    });
  }
  SendButtonMatrix2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 3;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 150).then(() => {
        resolve("SendButtonMatrix2Device Done");
      });
    });
  }
  SendMacroType2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 4;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      if (DataBuffer == false) {
        resolve("SendButtonMatrix2Device Done");
      } else {
        for (var i = 0; i < DataBuffer.length; i++) {
          Data[8 + i] = DataBuffer[i];
        }
        this.SetFeatureReport(dev, Data, 150).then(() => {
          resolve("SendButtonMatrix2Device Done");
        });
      }
    });
  }
  MacroTypeToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    var iMacroCount = 0;
    var arrMacroType = [1, 65535, 0];
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "MacroFunction":
          DataBuffer[iIndex * 2] = arrMacroType[Temp_BtnList.macro_RepeatType] >> 8;
          DataBuffer[iIndex * 2 + 1] = arrMacroType[Temp_BtnList.macro_RepeatType] & 255;
          iMacroCount++;
          break;
      }
    }
    if (iMacroCount <= 0)
      return false;
    else
      return DataBuffer;
  }
  KeyAltGrToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var arrcomplex = [false, false, Temp_BtnList.AltGr];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
      }
    }
    return DataBuffer;
  }
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = JSON.parse(JSON.stringify(dev.Buttoninfo_Default));
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          var arrcomplex = [Temp_BtnList.Ctrl, Temp_BtnList.Shift, Temp_BtnList.Alt, Temp_BtnList.Windows, Temp_BtnList.hasFNStatus];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0 || Temp_BtnList.AltGr) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
        case "MOUSE":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 9;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "KEYBOARD":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 8;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "Multimedia":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 3;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "LaunchProgram":
        case "LaunchWebsite":
          DataBuffer[iIndex] = 7;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
        case "Shortcuts":
          var KeyCode = 0;
          var KeyValue;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              KeyValue = SupportData.AllFunctionMapping[iMap].value;
              break;
            }
          }
          if (KeyValue == "Explorer") {
            var bycomplex = 0;
            bycomplex |= Math.pow(2, 3);
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
            DataBuffer[dev.KeyMatrixLength + iIndex] = 8;
          } else {
            DataBuffer[iIndex] = 3;
            DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          }
          break;
        case "MacroFunction":
          DataBuffer[iIndex] = 5;
          DataBuffer[dev.KeyMatrixLength + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
          break;
        case "Disable":
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
      }
    }
    return DataBuffer;
  }
  KnobAssignToData(dev, KnobAssignData, DataBuffer) {
    var Matrix_Knob = ["Knobleft", "KnobRight"];
    var KnobFuncMapping = [
      { BindCodeName: "Scroll_APP", HidType: 228, HidData: 41 },
      //Scroll Through Active Applications:ALT+ESC
      { BindCodeName: "brightness_UP", HidType: 240, HidData: 26 },
      //brightness UP:FN+W
      { BindCodeName: "brightness_DOWN", HidType: 240, HidData: 22 },
      //brightness DOWN:FN+S
      { BindCodeName: "Windows_Zoom_In", HidType: 225, HidData: 46 },
      //Windows Zoom In:Ctrl+"+"
      { BindCodeName: "Windows_Zoom_Out", HidType: 225, HidData: 45 },
      //Windows Zoom In:Ctrl+"-"
      { BindCodeName: "Video_Scrub_Forward", HidType: 225, HidData: 79 },
      //Video Scrubbing Forward:Ctrl+Right
      { BindCodeName: "Video_Scrub_Backward", HidType: 225, HidData: 80 },
      //Video Scrubbing Back:Ctrl+Left
      { BindCodeName: "Mouse_Scroll_Up", HidType: 9, HidData: 6 },
      //Mouse_Scroll_Up
      { BindCodeName: "Mouse_Scroll_Down", HidType: 9, HidData: 7 },
      //Mouse_Scroll_Down
      { BindCodeName: "Mouse_Scroll_Right", HidType: 9, HidData: 8 },
      //Mouse_Scroll_Right
      { BindCodeName: "Mouse_Scroll_Left", HidType: 9, HidData: 9 },
      //Mouse_Scroll_Left
      { BindCodeName: "Mouse_Movement_Up", HidType: 11, HidData: 1 },
      //Mouse_Movement_Up
      { BindCodeName: "Mouse_Movement_Down", HidType: 11, HidData: 2 },
      //Mouse_Movement_Down
      { BindCodeName: "Mouse_Movement_Left", HidType: 11, HidData: 3 },
      //Mouse_Movement_Left
      { BindCodeName: "Mouse_Movement_Right", HidType: 11, HidData: 4 },
      //Mouse_Movement_Right
      { BindCodeName: "Audio_Device_Prev", HidType: 7, HidData: 15 },
      //Audio_Device_Prev(LaunchProgram Function)
      { BindCodeName: "Audio_Device_Next", HidType: 7, HidData: 15 },
      //Audio_Device_Next(LaunchProgram Function)
      { BindCodeName: "Microphone_Down", HidType: 7, HidData: 15 },
      //Microphone_Down(LaunchProgram Function)
      { BindCodeName: "Microphone_Up", HidType: 7, HidData: 15 }
      //Microphone_Up(LaunchProgram Function)
    ];
    for (var i = 0; i < KnobAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(Matrix_Knob[i]);
      var Temp_BtnList = KnobAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          var arrcomplex = [Temp_BtnList.Ctrl, Temp_BtnList.Shift, Temp_BtnList.Alt, Temp_BtnList.Windows, Temp_BtnList.hasFNStatus];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0 || Temp_BtnList.AltGr) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
        case "Shortcuts":
          for (var iMap = 0; iMap < KnobFuncMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == KnobFuncMapping[iMap].BindCodeName) {
              DataBuffer[iIndex] = KnobFuncMapping[iMap].HidType;
              DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData;
              if (KnobFuncMapping[iMap].HidType == 7) {
                DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData + i;
              }
              break;
            }
          }
          break;
        case "Disable":
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
      }
    }
    return DataBuffer;
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("GMMKSeries", "SetLEDEffect", "Begin");
    try {
      var ObjTypeData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      var ObjEffectData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
          var T_data = Obj.Perkeylist.filter((item, index, array) => {
            if (item.SN == dev.BaseInfo.SN) {
              return item;
            }
          });
          if (T_data.length < 1) {
            callback("SetLEDEffect Done");
            return;
          }
          var ObjLayoutData = {
            iProfile: Obj.iProfile,
            iLayerIndex: Obj.iLayerIndex,
            PerKeyData: Obj.LightingPerKeyData,
            Perkeylist: T_data
          };
          this.SetLEDLayoutToDevice(dev, ObjLayoutData, () => {
            callback("SetLEDEffect Done");
          });
        });
      });
    } catch (e) {
      env.log("GMMKSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      Data[0] = 7;
      Data[1] = 2;
      Data[2] = iEffect;
      Data[8] = 0;
      Data[9] = 0;
      if (ObjEffectData.Data.Multicolor_Enable == true) {
        Data[10] = ObjEffectData.Data.Multicolor;
      }
      if (iEffect == 13 || ObjEffectData.Data.PointEffectName == "Rainbow") {
        Data[12] = 1;
      }
      Data[15] = ObjEffectData.Data.colorPickerValue[0];
      Data[16] = ObjEffectData.Data.colorPickerValue[1];
      Data[17] = ObjEffectData.Data.colorPickerValue[2];
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log("GMMKSeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  SetLEDTypeToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      Data[0] = 7;
      Data[1] = 7;
      Data[2] = ObjEffectData.iProfile + 1;
      Data[3] = ObjEffectData.iLayerIndex + 1;
      Data[4] = iEffect;
      Data[5] = 0;
      Data[6] = 1;
      Data[7] = dev.deviceData.sideLightSwitch ? 0 : 1;
      Data[8] = ObjEffectData.Data.brightness * 20 / 100;
      if (ObjEffectData.Data.inputLatency != void 0) {
        Data[10] = ObjEffectData.Data.inputLatency;
      }
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback("SetLEDTypeToDevice Done");
      });
    } catch (e) {
      env.log("GMMKSeries", "SetLEDTypeToDevice", `Error:${e}`);
    }
  }
  SetLEDLayoutToDevice(dev, ObjLayoutData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var DataBuffer = this.LayoutToData(dev, ObjLayoutData);
      Data[0] = 7;
      Data[1] = 6;
      Data[2] = ObjLayoutData.iProfile + 1;
      Data[3] = ObjLayoutData.iLayerIndex + 1;
      Data[4] = 83;
      var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
      var PerKeyContent;
      for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
        if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value) && ObjLayoutData.Perkeylist[i].SN == dev.BaseInfo.SN) {
          PerKeyContent = ObjLayoutData.Perkeylist[i].content;
          break;
        }
      }
      if (PerKeyContent == void 0) {
        callback("SetLEDLayoutToDevice Failed");
        env.log("GMMKSeries", "SetLEDEffectToDevice", "Failed");
        return;
      }
      var brightness = PerKeyContent.lightData.brightness * 20 / 100;
      Data[6] = brightness;
      var iLayerCount;
      if (dev.BaseInfo.SN == "0x320F0x504B" || //GMMK V2 96US
      dev.BaseInfo.SN == "0x320F0x505A")
        iLayerCount = 4;
      else
        iLayerCount = 3;
      const SetAp = (j) => {
        if (j < iLayerCount) {
          Data[5] = j;
          for (var k = 0; k < 200; k++)
            Data[8 + k] = DataBuffer[200 * j + k];
          this.SetFeatureReport(dev, Data, 100).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SetLEDLayoutToDevice Done");
        }
      };
      SetAp(0);
    } catch (e) {
      env.log("GMMKSeries", "SetLEDLayoutToDevice", `Error:${e}`);
      callback("SetLEDLayoutToDevice Done");
    }
  }
  LayoutToData(dev, ObjLayoutData) {
    var DataBuffer = Buffer.alloc(1e3);
    var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
    var PerKeyContent;
    for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
      if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value) && dev.BaseInfo.SN == ObjLayoutData.Perkeylist[i].SN) {
        PerKeyContent = ObjLayoutData.Perkeylist[i].content;
        break;
      }
    }
    if (PerKeyContent == void 0)
      return DataBuffer;
    for (var i = 0; i < PerKeyContent.AllBlockColor.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var RgbData = PerKeyContent.AllBlockColor[i].color;
      var visible = 255;
      RgbData = PerKeyContent.AllBlockColor[i].color;
      if (PerKeyContent.AllBlockColor[i].breathing && PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 254;
      } else if (PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 255;
      } else {
        visible = 0;
      }
      DataBuffer[iIndex * 5 + 0] = visible;
      DataBuffer[iIndex * 5 + 1] = iIndex;
      DataBuffer[iIndex * 5 + 2] = RgbData[0];
      DataBuffer[iIndex * 5 + 3] = RgbData[1];
      DataBuffer[iIndex * 5 + 4] = RgbData[2];
    }
    if (PerKeyContent.lightData.sideLightColor[3] != void 0) {
      var RgbData = PerKeyContent.lightData.sideLightColor;
      var bBreathing = RgbData[3] ? PerKeyContent.lightData.sideLightSync : false;
      for (var iside = 0; iside < this.Matrix_SideLED.length; iside++) {
        var visible = 255;
        if (parseInt(RgbData[3]) == 0) {
          visible = 0;
        } else if (bBreathing) {
          visible = 254;
        }
        var iIndexside = dev.Matrix_LEDCode_GMMK.indexOf(this.Matrix_SideLED[iside]);
        DataBuffer[iIndexside * 5 + 0] = visible;
        DataBuffer[iIndexside * 5 + 1] = iIndexside;
        DataBuffer[iIndexside * 5 + 2] = RgbData[0];
        DataBuffer[iIndexside * 5 + 3] = RgbData[1];
        DataBuffer[iIndexside * 5 + 4] = RgbData[2];
      }
    }
    return DataBuffer;
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData;
        if (dev.KeyMatrixLength > 120) {
          rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 264, buf);
        } else {
          let currentBuffer = buf;
          if (currentBuffer.length == 264) {
            currentBuffer = currentBuffer.slice(0, currentBuffer.length - 8);
          }
          rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 256, currentBuffer);
        }
        setTimeout(function() {
          if (rtnData < 8)
            env.log("GmmkSeries SetFeatureReport", "SetFeatureReport(error) return data length : ", JSON.stringify(rtnData));
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("GmmkSeries Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData;
        if (dev.KeyMatrixLength > 120) {
          rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 264);
        } else {
          rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 256);
        }
        setTimeout(function() {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  ////////////////////RGB SYNC////////////////////////////
  //#region RGBSYNC
  SetLEDMatrix(dev, Obj) {
    var DataBuffer = Buffer.alloc(512);
    if (dev.m_bSetHWDevice || !dev.m_bSetSyncEffect) {
      return;
    }
    for (var i = 0; i < dev.Matrix_KEYButtons.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      DataBuffer[0 + iIndex] = Obj.Buffer[i][0];
      DataBuffer[140 + iIndex] = Obj.Buffer[i][1];
      DataBuffer[280 + iIndex] = Obj.Buffer[i][2];
    }
    var Obj3 = {
      DataBuffer
    };
    this.SendLEDData2Device(dev, Obj3).then(function() {
    });
  }
  SendLEDData2Device(dev, Obj) {
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      const SetAp = (j) => {
        if (j < 3) {
          Data = Buffer.alloc(264);
          Data[0] = 7;
          Data[1] = 16;
          Data[2] = j + 1;
          for (var i = 0; i < 140; i++)
            Data[8 + i] = DataBuffer[140 * j + i];
          this.SetFeatureReport(dev, Data, 5).then(function() {
            SetAp(j + 1);
          });
        } else {
          resolve();
        }
      };
      SetAp(0);
    });
  }
  //#endregion RGBSYNC
}
class GmmkNumpadSeries extends Keyboard {
  static #instance;
  AudioSession;
  CheckSliderClose;
  arrLEDType;
  FrontendValue1;
  FrontendValue2;
  repeateTest;
  TargetVolume;
  constructor(hid, AudioSession) {
    env.log("GmmkNumpadSeries", "GmmkNumpadSeries class", "begin");
    super();
    this.hid = hid;
    this.AudioSession = AudioSession;
    this.arrLEDType = [
      8,
      //'LEDOFF',
      0,
      //'GloriousMode',
      1,
      //'Wave#1',
      3,
      //'Wave#2',
      4,
      //'SpiralingWave',
      5,
      //'AcidMode',
      2,
      //'Breathing',
      6,
      //'NormallyOn',
      7,
      //'RippleGraff',
      9,
      //'PassWithoutTrace',
      10,
      //'FastRunWithoutTrace',
      11,
      //'Matrix2',
      12,
      //'Matrix3',
      13,
      //'Rainbow',
      14,
      //'HeartbeatSensor',
      15,
      //'DigitTimes',
      16,
      //'Kamehameha',
      17,
      //'Pingpong',
      18
      //'Surmount',
    ];
    this.CheckSliderClose = false;
  }
  static getInstance(hid, AudioSession) {
    if (this.#instance) {
      env.log("GmmkNumpadSeries", "getInstance", `Get exist GmmkNumpadSeries() INSTANCE`);
      return this.#instance;
    } else {
      env.log("GmmkNumpadSeries", "getInstance", `New GmmkNumpadSeries() INSTANCE`);
      this.#instance = new GmmkNumpadSeries(hid, AudioSession);
      return this.#instance;
    }
  }
  GetAudioSession(dev, Obj, callback) {
    var arrAudioSession = this.AudioSession.GetAudioSession();
    if (arrAudioSession == null) {
      callback(void 0);
      return;
    }
    var FrontSession = [];
    var AudioSession = {
      filepath: "Windows Default Sound Output",
      filename: "Windows Default Sound Output",
      percent: 0,
      processid: 1
    };
    FrontSession.push(AudioSession);
    for (let index = 0; index < arrAudioSession.length; index++) {
      var FileDescription = arrAudioSession[index].FileDescription;
      var Filepath = arrAudioSession[index].filepath;
      if (arrAudioSession[index].filepath == "System Sounds") {
        FileDescription = arrAudioSession[index].filepath;
      }
      var AudioSession;
      if (FileDescription != "") {
        AudioSession = {
          filepath: FileDescription,
          filename: FileDescription,
          percent: arrAudioSession[index].percent,
          processid: arrAudioSession[index].processid
        };
        FrontSession.push(AudioSession);
      } else if (FileDescription == "" && Filepath != "") {
        var filename = arrAudioSession[index].filepath;
        if (arrAudioSession[index].filepath.indexOf("\\") != -1) {
          filename = arrAudioSession[index].filepath.replace(/^.*[\\\/]/, "");
          var extIndex = filename.lastIndexOf(".");
          if (extIndex != -1) {
            filename = filename.substr(0, extIndex);
          }
        }
        AudioSession = {
          filepath: filename,
          filename,
          percent: arrAudioSession[index].percent,
          processid: arrAudioSession[index].processid
        };
        FrontSession.push(AudioSession);
      } else
        ;
    }
    for (let index = 0; index < FrontSession.length; index++) {
      var iRepratCount = 0;
      for (let index2 = 0; index2 < FrontSession.length; index2++) {
        if (FrontSession[index].filename == FrontSession[index2].filename) {
          iRepratCount++;
          if (iRepratCount >= 2) {
            FrontSession[index2].filename += iRepratCount.toString();
          }
        }
      }
      if (iRepratCount >= 2) {
        FrontSession[index].filename += "1";
      }
    }
    callback(FrontSession);
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    env.log("GmmkNumpadSeries", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    dev.m_bAudioControl = false;
    dev.DataNumber = 0;
    dev.awaitHidWrite = false;
    dev.awaittime = 0;
    dev.BTErrorcount = 0;
    var keyBoardList = GMMKLocation.keyBoardList[dev.BaseInfo.SN];
    if (keyBoardList != void 0) {
      dev.Matrix_KEYCode_GMMK = keyBoardList.Matrix_KEYCode;
      dev.Matrix_LEDCode_GMMK = keyBoardList.Matrix_LEDCode;
      dev.Matrix_KEYButtons_GMMK = keyBoardList.Matrix_KEYButtons;
      dev.Buttoninfo_Default = keyBoardList.Buttoninfo_Default;
    } else {
      env.log("GmmkNumpadSeries", dev.BaseInfo.devicename, "GMMKLocation is not Exists");
      callback(0);
    }
    this.FrontendValue1 = 0;
    this.FrontendValue2 = 0;
    dev.BaseInfo.version_Wired = "0021";
    dev.BaseInfo.version_Wireless = "0001";
    this.nedbObj.getAppSetting().then((doc) => {
      if (doc[0].sleep != void 0) {
        dev.sleep = doc[0].sleep;
      }
      if (doc[0].sleeptime != void 0) {
        dev.sleeptime = doc[0].sleeptime;
      }
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
        dev.BaseInfo.version_Wired = "0001";
        dev.BaseInfo.version_Wireless = "0001";
        callback(0);
      } else if (env.BuiltType == 0) {
        this.SetProfileDataFromDB(dev, 0, () => {
          callback(0);
        });
      } else {
        callback(0);
      }
      this.OnTimerGetAudioSession(dev);
    });
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var iProfile = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
      var appProfileLayers = dev.deviceData.profileLayers;
      this.StartHIDWrite(dev, () => {
        var ObjPollRateAndSleep = {
          iProfile,
          iLayerIndex,
          appProfileLayers
        };
        this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
          this.EndHIDWrite(dev, () => {
            setTimeout(() => {
              callback("SetProfileDataFromDB Done");
            }, 100);
          });
        });
      });
    } else
      this.nedbObj.getLayout().then((data) => {
        const SetProfileData = (iProfile2, iLayerIndex2) => {
          var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
          var ProfileData = dev.deviceData.profile[iProfile2];
          if (iProfile2 < 3 && iLayerIndex2 < 3 && ProfileData != void 0) {
            var appProfileLayers2 = dev.deviceData.profileLayers;
            var KeyAssignData = appProfileLayers2[iProfile2][iLayerIndex2].assignedKeyboardKeys[0];
            var ObjKeyAssign = {
              iProfile: iProfile2,
              iLayerIndex: iLayerIndex2,
              KeyAssignData
            };
            var LightingData = appProfileLayers2[iProfile2][iLayerIndex2].light_PRESETS_Data;
            LightingData.inputLatency = appProfileLayers2[iProfile2][iLayerIndex2].inputLatency;
            if (LightingData.sensitivity == void 0) {
              var KeyAssignData = appProfileLayers2[iProfile2][iLayerIndex2].assignedKeyboardKeys[0];
              var Temp_BtnList = KeyAssignData[5];
              LightingData.sensitivity = Temp_BtnList.sensitivity;
            }
            var LightingPerKeyData = appProfileLayers2[iProfile2][iLayerIndex2].light_PERKEY_Data;
            var ObjLighting = {
              iProfile: iProfile2,
              iLayerIndex: iLayerIndex2,
              LightingData,
              LightingPerKeyData,
              Perkeylist: layoutDBdata
            };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetLEDEffect(dev, ObjLighting, (param2) => {
                SetProfileData(iProfile2, iLayerIndex2 + 1);
              });
            });
          } else if (iProfile2 < 3 && ProfileData != void 0) {
            SetProfileData(iProfile2 + 1, 0);
          } else {
            this.nedbObj.getMacro().then((doc) => {
              var MacroData = doc;
              var ObjMacroData = { MacroData };
              this.SetMacroFunction(dev, ObjMacroData, (param1) => {
                this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                  var iProfile3 = dev.deviceData.profileindex;
                  var iLayerIndex3 = dev.deviceData.profileLayerIndex[iProfile3];
                  var appProfileLayers3 = dev.deviceData.profileLayers;
                  var ObjPollRateAndSleep = {
                    iProfile: iProfile3,
                    iLayerIndex: iLayerIndex3,
                    appProfileLayers: appProfileLayers3
                  };
                  this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param12) => {
                    this.CheckSliderfunction(dev);
                    callback("SetProfileDataFromDB Done");
                  });
                });
              });
            });
          }
        };
        SetProfileData(0, 0);
      });
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex;
    const SetLayoutData = (iLayerIndex) => {
      if (iLayerIndex < 3) {
        var appProfileLayers = dev.deviceData.profileLayers;
        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
        var ObjKeyAssign = {
          iProfile,
          iLayerIndex,
          KeyAssignData
        };
        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
        LightingData.sensitivity = appProfileLayers[iProfile][iLayerIndex].sensitivity;
        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
        var Perkeylist = Obj.Perkeylist;
        var ObjLighting = {
          iProfile,
          iLayerIndex,
          LightingData,
          LightingPerKeyData,
          Perkeylist
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            SetLayoutData(iLayerIndex + 1);
          });
        });
      } else {
        var Macrolist = Obj.Macrolist;
        var MacroData = [];
        for (let index = 0; index < Macrolist.length; index++) {
          if (parseInt(Macrolist[index].m_Identifier) > 0) {
            MacroData.push(Macrolist[index]);
          }
        }
        var ObjMacroData = { MacroData };
        this.SetMacroFunction(dev, ObjMacroData, (param1) => {
          this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
            var iProfile2 = dev.deviceData.profileindex;
            var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfile2];
            var appProfileLayers2 = dev.deviceData.profileLayers;
            var ObjPollRateAndSleep = {
              iProfile: iProfile2,
              iLayerIndex: iLayerIndex2,
              appProfileLayers: appProfileLayers2
            };
            this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param12) => {
              callback("SetProfileDataFromDB Done");
            });
          });
        });
      }
    };
    SetLayoutData(0);
  }
  OnTimerEmitFrontend(dev) {
    try {
      if (this.FrontendValue1 != this.FrontendValue2) {
        this.FrontendValue2 = JSON.parse(JSON.stringify(this.FrontendValue1));
        this.LaunchSliderFunction(dev, this.FrontendValue2);
        var Obj2 = {
          Func: EventTypes.SwitchSliderVolume,
          SN: dev.BaseInfo.SN,
          Param: { Value: this.FrontendValue2 }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        clearInterval(dev.m_TimerEmitFrontend);
        dev.m_TimerEmitFrontend = void 0;
      } else {
        clearInterval(dev.m_TimerEmitFrontend);
        dev.m_TimerEmitFrontend = void 0;
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "TimerEmitFrontend", `Error:${e}`);
    }
  }
  OnTimerSoundControlFlag(dev) {
    try {
      clearInterval(dev.m_TimerSoundControlFlag);
      dev.m_TimerSoundControlFlag = void 0;
      dev.m_bAudioControl = false;
    } catch (e) {
      env.log("GmmkNumpadSeries", "OnTimerSoundControlFlag", `Error:${e}`);
    }
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[2] >= 128) {
      var EPTempData = this.hid.GetEPTempData(dev.BaseInfo.DeviceId);
      if (EPTempData[0] == 4 && EPTempData[1] == 247 && EPTempData[2] >= 128) {
        for (var i = 0; i < ObjData.length; i++) {
          ObjData[i] = EPTempData[i];
        }
        env.log(dev.BaseInfo.devicename, "overlayEPTempData-Launch:", JSON.stringify(ObjData));
      }
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw]);
      var bSwitch = true;
      if (ObjData[4] == 255) {
        bSwitch = false;
      }
      env.log(
        "HIDEP2Data-Launch Program:",
        "StringKey:",
        JSON.stringify(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw])
      );
      this.LaunchProgram(dev, iKey, bSwitch);
    } else if (ObjData[0] == 4 && ObjData[1] == 252) {
      dev.awaitHidWrite = false;
    } else if (ObjData[0] == 4 && ObjData[1] == 138) {
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        var ObjBattery = {
          SN: dev.BaseInfo.SN,
          Status: 0,
          Battery: ObjData[2],
          Charging: ObjData[3]
        };
        var Obj2 = {
          Func: EventTypes.GetBatteryStats,
          SN: dev.BaseInfo.SN,
          Param: ObjBattery
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        if (ObjData[4] != 0 || ObjData[5] != 0) {
          var FWHex = ObjData[5] * 256 + ObjData[4];
          var FWVersion = parseInt(FWHex.toString(16), 10);
          var verRev = FWVersion.toString();
          var strVertion = verRev.padStart(4, "0");
          dev.BaseInfo.version_Wired = strVertion;
        }
      }
    } else if (ObjData[0] == 4 && ObjData[1] == 248 && ObjData[2] == 50) {
      var iValue = ObjData[4];
      this.FrontendValue1 = iValue;
      if (dev.m_TimerEmitFrontend == void 0) {
        dev.m_TimerEmitFrontend = setInterval(() => this.OnTimerEmitFrontend(dev), 40);
      }
    } else if (ObjData[0] == 4 && ObjData[1] == 250) {
      var bUp = false;
      var iValue = 2;
      if (ObjData[3] == 255) {
        bUp = false;
        iValue = (256 - ObjData[2]) * 2;
      } else {
        bUp = true;
        iValue = ObjData[2] * 2;
      }
      this.LaunchKnobFunction(dev, bUp, iValue);
    } else if (ObjData[0] == 4 && ObjData[1] == 241 && ObjData[8] != 1) {
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var ObjProfileIndex = { Profile: iProfile, LayerIndex: iLayerIndex, SN: dev.BaseInfo.SN };
      env.log("GmmkNumpadSeries", "HIDEP2Data-SwitchProfile", JSON.stringify(ObjProfileIndex));
      dev.deviceData.profileindex = iProfile;
      dev.deviceData.profileLayerIndex[iProfile] = iLayerIndex;
      this.CheckSliderfunction(dev);
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: ObjProfileIndex
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.setProfileToDevice(dev, (paramDB) => {
      });
    } else if (ObjData[0] == 4 && ObjData[1] == 242) {
      if (ObjData[3] == 1 && ObjData[4] == 18 && ObjData[5] == 20 && ObjData[6] == 20 && ObjData[7] == 1)
        ;
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var iEffect = this.arrLEDType[ObjData[4]];
      var iSpeed = ObjData[5] * 100 / 20;
      var iBright = ObjData[6] * 100 / 20;
      var ObjLighting = {
        Profile: iProfile,
        LayerIndex: iLayerIndex,
        Effect: iEffect,
        Speed: iSpeed,
        Bright: iBright,
        SN: dev.BaseInfo.SN
      };
      var Obj2 = {
        Func: EventTypes.SwitchLighting,
        SN: dev.BaseInfo.SN,
        Param: ObjLighting
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (ObjData[0] == 4 && ObjData[1] == 249) {
      var iEffect = this.arrLEDType[ObjData[2]];
      var bMultiColor = ObjData[3] == 1 ? true : false;
      var iProfileindex = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfileindex];
      var LightingData = JSON.parse(
        JSON.stringify(dev.deviceData.profileLayers[iProfileindex][iLayerIndex].light_PRESETS_Data)
      );
      if (iEffect == LightingData.value) {
        LightingData.Multicolor = bMultiColor;
        var ObjLighting = { Effect: LightingData, SN: dev.BaseInfo.SN };
        var Obj2 = {
          Func: EventTypes.SwitchMultiColor,
          SN: dev.BaseInfo.SN,
          Param: ObjLighting
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        this.setProfileToDevice(dev, (paramDB) => {
        });
      }
    }
    if (ObjData[0] == 4 && (ObjData[1] == 248 || ObjData[1] == 247) && ObjData[2] >= 128) {
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      var iKey = dev.Matrix_KEYButtons_GMMK.indexOf(dev.Matrix_KEYCode_GMMK[iKeyColumn * 4 + iKeyRaw]);
      var Obj2 = { Func: "SendKeynumber", SN: dev.BaseInfo.SN, Param: iKey };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    }
  }
  /**
   * ControlTargetVolume-Use Slider's value to adjust
   * @param {*} bUp
   */
  ControlTargetVolume(ivalue) {
    if (this.TargetVolume.processid == 1) {
      this.AudioSession.SetSpeakerValue(ivalue);
    } else {
      this.TargetVolume.percent = ivalue;
      this.AudioSession.SetAudioSession(this.TargetVolume);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey, bSwitch) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
    env.log(
      "GmmkNumpad-LaunchProgram",
      "KeyAssignData:" + JSON.stringify(KeyAssignData),
      "iKey:" + JSON.stringify(iKey)
    );
    switch (KeyAssignData.recordBindCodeType) {
      case "LaunchProgram":
        var csProgram = KeyAssignData.ApplicationPath;
        if (csProgram != "") {
          this.RunApplication(csProgram);
        }
        break;
      case "LaunchWebsite":
        var csProgram = KeyAssignData.WebsitePath;
        if (csProgram != null && csProgram.trim() != "") {
          this.RunWebSite(GetValidURL(csProgram));
        }
        break;
      case "SOUND CONTROL":
        if (bSwitch) {
          this.TargetVolume = KeyAssignData.d_SoundVolume.bindTarget;
          this.CheckSliderClose = true;
          if (this.TargetVolume.filename == "default") {
            this.TargetVolume.filename = "Windows Default Sound Output";
          }
          for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
            const AudioSession = dev.deviceData.AudioSession[i];
            if (this.TargetVolume.filename == AudioSession.filename) {
              this.TargetVolume = AudioSession;
              break;
            }
          }
          this.TargetVolume.KeyNumber = iKey;
        } else {
          if (this.TargetVolume != void 0) {
            delete this.TargetVolume;
            this.CheckSliderfunction(dev);
          }
        }
        break;
    }
  }
  CheckSliderfunction(dev) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var iKey = 13;
    var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
    if (AssignData.recordBindCodeType == "SOUND CONTROL" && AssignData.recordBindCodeName != "Windows Default Sound Output") {
      this.CheckSliderClose = true;
    } else {
      this.CheckSliderClose = false;
    }
  }
  /**
   * Launch Side Slider Function
   * @param {*} dev
   * @param {*} iVolume
   */
  LaunchKnobFunction(dev, bUp, iValue) {
    var iKey = 5;
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
    var SoundVolume = AssignData.d_SoundVolume.bindTarget;
    if (SoundVolume.filename == "Windows Default Sound Output") {
      if (bUp) {
        this.AudioSession.SpeakerUp(iValue);
      } else {
        this.AudioSession.SpeakerDown(iValue);
      }
    } else {
      for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
        const AudioSession = dev.deviceData.AudioSession[i];
        if (SoundVolume.filename == AudioSession.filename) {
          var SliderSoundVolume = AudioSession;
          if (SliderSoundVolume.percent >= 100 && bUp) {
            SliderSoundVolume.percent = 100;
          } else if (bUp) {
            SliderSoundVolume.percent += iValue;
          } else if (SliderSoundVolume.percent <= 0 && !bUp) {
            SliderSoundVolume.percent = 0;
          } else if (!bUp) {
            SliderSoundVolume.percent -= iValue;
          }
          this.SwitchAudioSession(SliderSoundVolume);
          break;
        }
      }
    }
  }
  /**
   * Confirm Value is Close Function
   * @param {*} dev
   * @param {*} iVolume
   */
  ConfirmValueisClose(srcValue, dstValue) {
    var bResult = false;
    if (Math.abs(srcValue - dstValue) < 5) {
      bResult = true;
    }
    return bResult;
  }
  /**
   * Launch Side Slider Function
   * @param {*} dev
   * @param {*} iVolume
   */
  LaunchSliderFunction(dev, iVolume) {
    if (this.CheckSliderClose && this.TargetVolume != void 0) {
      if (this.ConfirmValueisClose(this.TargetVolume.percent, iVolume)) {
        this.CheckSliderClose = false;
        this.ControlTargetVolume(iVolume);
      }
    } else if (this.TargetVolume != void 0) {
      this.ControlTargetVolume(iVolume);
    } else if (this.CheckSliderClose) {
      var iKey = 13;
      var iProfile = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
      var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
      if (AssignData.recordBindCodeType == "SOUND CONTROL") {
        var SoundVolume = AssignData.d_SoundVolume.bindTarget;
        for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
          const AudioSession = dev.deviceData.AudioSession[i];
          if (SoundVolume.filename == AudioSession.filename) {
            if (this.ConfirmValueisClose(AudioSession.percent, iVolume)) {
              this.CheckSliderClose = false;
            }
            break;
          }
        }
      }
    } else {
      var iKey = 13;
      var iProfile = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
      var AssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
      switch (AssignData.recordBindCodeType) {
        case "SOUND CONTROL":
          var SoundVolume = AssignData.d_SoundVolume.bindTarget;
          for (var i = 0; i < dev.deviceData.AudioSession.length; i++) {
            const AudioSession = dev.deviceData.AudioSession[i];
            if (SoundVolume.filename == AudioSession.filename) {
              var SliderSoundVolume = AudioSession;
              SliderSoundVolume.percent = iVolume;
              this.SwitchAudioSession(SliderSoundVolume);
              break;
            }
          }
          break;
        case "Disable":
          break;
        default:
          this.AudioSession.SetSpeakerValue(iVolume);
          break;
      }
    }
  }
  /**
   * Switch Profile
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ChangeProfileID(dev, Obj, callback) {
    env.log(dev.BaseInfo.devicename, "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      } else if (dev.m_bSetHWDevice) {
        env.log(dev.BaseInfo.devicename, "ChangeProfileID", "Device Has Setting,Stop Forward");
        callback(false);
        return;
      }
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        dev.m_bSetHWDevice = true;
        this.StartHIDWrite(dev, () => {
          this.ChangeProfileIDtodevice(dev, Obj, () => {
            this.EndHIDWrite(dev, () => {
              dev.m_bSetHWDevice = false;
              this.setProfileToDevice(dev, () => {
                callback("ChangeProfileID Done");
              });
            });
          });
        });
      } else {
        this.ChangeProfileIDtodevice(dev, Obj, () => {
          this.setProfileToDevice(dev, () => {
            callback("ChangeProfileID Done");
          });
        });
      }
    } catch (e) {
      env.log("ModelOSeries", "ChangeProfileID", `Error:${e}`);
      callback();
    }
  }
  ChangeProfileIDtodevice(dev, Obj, callback) {
    env.log(dev.BaseInfo.devicename, "ChangeProfileID", `${Obj}`);
    try {
      if (env.BuiltType == 1) {
        callback("ChangeProfileID Done");
        return;
      }
      var Data = Buffer.alloc(264);
      dev.deviceData.profileindex = Obj;
      var iLayerIndex = dev.deviceData.profileLayerIndex[Obj];
      this.CheckSliderfunction(dev);
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[0] = 7;
        Data[1] = 1;
        Data[2] = 1;
        Data[3] = Obj + 1;
        Data[4] = iLayerIndex + 1;
        this.SetHidWriteAwait(dev, Data).then(() => {
          this.setProfileToDevice(dev, () => {
            callback("ChangeProfileID Done");
          });
        });
      } else {
        Data[0] = 7;
        Data[1] = 1;
        Data[2] = Obj + 1;
        Data[3] = iLayerIndex + 1;
        this.SetFeatureReport(dev, Data, 50).then(() => {
          this.setProfileToDevice(dev, () => {
            callback("ChangeProfileID Done");
          });
        });
      }
    } catch (e) {
      env.log("ModelOSeries", "SetKeyMatrix", `Error:${e}`);
      callback();
    }
  }
  /**
   * Set Polling Rate to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetPollRateAndSleeptoDevice(dev, Obj, callback) {
    var iShift = 0;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      iShift = 1;
    }
    var Data = Buffer.alloc(264);
    var arrPollingrate = [1e3, 500, 250, 125];
    Data[0] = 7;
    Data[iShift + 1] = 8;
    Data[iShift + 8] = arrPollingrate.indexOf(Obj.iPollingrate);
    Data[iShift + 9] = 1;
    Data[iShift + 10] = 0;
    for (var i = 0; i < Obj.DataSleep.length; i++) {
      Data[iShift + 11 + i] = Obj.DataSleep[i];
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      Data[1] = 1;
      this.SetHidWriteAwait(dev, Data).then(() => {
        callback();
      });
    } else {
      this.SetFeatureReport(dev, Data, 150).then(() => {
        callback();
      });
    }
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        this.GetDeviceBatteryStats(dev, Obj, (FWData) => {
          setTimeout(() => {
            callback(dev.BaseInfo.version_Wired);
          }, 200);
        });
      } else {
        var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
        var CurFWVersion = parseInt(rtnData.toString(16), 10);
        var verRev = CurFWVersion.toString();
        var strVertion = verRev.padStart(4, "0");
        this.GetDeviceBatteryStats(dev, Obj, (FWData) => {
          setTimeout(() => {
            if (parseInt(FWData.FWVersion) > 0) {
              dev.BaseInfo.version_Wired = FWData.FWVersion;
              strVertion = FWData.FWVersion;
            } else {
              dev.BaseInfo.version_Wired = strVertion;
            }
            callback(strVertion);
          }, 200);
        });
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  //---------------test--------------------
  initializeUart(dev, Obj, callback) {
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var DataBTHid = Buffer.alloc(21);
      DataBTHid[0] = 7;
      DataBTHid[1] = 255;
      DataBTHid[2] = 255;
      DataBTHid[3] = 255;
      DataBTHid[4] = 255;
      DataBTHid[5] = 255;
      this.SetHidWrite(dev, DataBTHid, 800).then(() => {
      });
    }
    callback("");
  }
  setKeyMatrixTest(dev, Obj, callback) {
    if (!this.repeateTest || this.repeateTest == void 0) {
      this.repeateTest = true;
    } else {
      this.repeateTest = false;
      callback("setKeyMatrixTest Done");
      return;
    }
    const Test = (iTest) => {
      if (iTest != -1) {
        this.SetKeyMatrix(dev, Obj, (paramDB) => {
          setTimeout(() => {
            if (!this.repeateTest) {
              Test(-1);
            } else {
              Test(iTest + 1);
            }
          }, 3e3);
        });
      } else {
        this.repeateTest = false;
      }
    };
    Test(0);
    callback("setKeyMatrixTest Done");
  }
  //---------------test--------------------
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("GmmkNumpadSeries", "SetKeyMatrix", "Begin");
    if (dev.m_bSetHWDevice) {
      env.log(dev.BaseInfo.devicename, "SetKeyMatrix", "Device Has Setting,Stop Forward");
      callback(false);
      return;
    }
    dev.deviceData.profile = Obj.KeyBoardManager.KeyBoardArray;
    dev.deviceData.profileLayers = Obj.KeyBoardManager.profileLayers;
    dev.deviceData.profileindex = Obj.KeyBoardManager.profileindex;
    dev.deviceData.profileLayerIndex = Obj.KeyBoardManager.profileLayerIndex;
    dev.deviceData.sideLightSwitch = Obj.KeyBoardManager.sideLightSwitch;
    var iProfile = Obj.KeyBoardManager.profileindex;
    var appProfileLayers = Obj.KeyBoardManager.profileLayers;
    Obj.KeyBoardManager.layerMaxNumber;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, (paramDB) => {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var KeyAssignData = appProfileLayers[iProfile][iLayerIndex2].assignedKeyboardKeys[0];
            var ObjKeyAssign = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              KeyAssignData
            };
            var ObjMacroData = { MacroData };
            dev.DataNumber = 0;
            this.StartHIDWrite(dev, () => {
              this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
                this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                  dev.DataNumber = 255;
                  this.ChangeProfileIDtodevice(dev, iProfile, (param0) => {
                    this.EndHIDWrite(dev, () => {
                      dev.m_bSetHWDevice = false;
                      this.setProfileToDevice(dev, (paramDB) => {
                        this.CheckSliderfunction(dev);
                        dev.DataNumber = 0;
                        callback("SetKeyMatrix Done");
                      });
                    });
                  });
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          this.nedbObj.getLayout().then((data) => {
            var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var LightingData = appProfileLayers[iProfile][iLayerIndex2].light_PRESETS_Data;
            var ProfileData = appProfileLayers[iProfile][iLayerIndex2];
            LightingData.sensitivity = ProfileData.sensitivity;
            LightingData.inputLatency = ProfileData.inputLatency;
            var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex2].light_PERKEY_Data;
            var ObjLighting = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              LightingData,
              LightingPerKeyData,
              Perkeylist: layoutDBdata
            };
            env.log(dev.BaseInfo.devicename, "SetKeyMatrix", "lightingflag-StartHIDWrite");
            this.StartHIDWrite(dev, () => {
              env.log(dev.BaseInfo.devicename, "SetKeyMatrix", "StartHIDWrite Done,then SetLEDEffect");
              this.SetLEDEffect(dev, ObjLighting, (param2) => {
                this.ChangeProfileIDtodevice(dev, iProfile, (param0) => {
                  this.EndHIDWrite(dev, () => {
                    dev.m_bSetHWDevice = false;
                    this.setProfileToDevice(dev, (paramDB) => {
                      dev.DataNumber = 0;
                      callback("SetKeyMatrix Done");
                    });
                  });
                });
              });
            });
          });
          break;
        case switchUIflag.performanceflag:
          var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
          this.StartHIDWrite(dev, () => {
            var ObjPollRateAndSleep = {
              iProfile,
              iLayerIndex,
              appProfileLayers
            };
            this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
              var ProfileData = appProfileLayers[iProfile][iLayerIndex];
              var ObjProfile = { iProfile, iLayerIndex, Data: ProfileData };
              this.SetVolumeSensitivity(dev, ObjProfile, (param2) => {
                this.EndHIDWrite(dev, () => {
                  dev.m_bSetHWDevice = false;
                  this.setProfileToDevice(dev, (paramDB) => {
                    callback("SetKeyMatrix Done");
                  });
                });
              });
            });
          });
          break;
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetKeyMatrix", `Error:${e}`);
    }
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, () => {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    if (MacroData == false) {
      callback("SetMacroDataToDevice Done");
      return;
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var Data = Buffer.alloc(300);
      Data[0] = 5;
      Data[1] = MacroID;
      var iDataSize = 0;
      for (var k = 0; k < MacroData.length; k++) {
        if (MacroData[0 + k] == void 0) {
          break;
        }
        Data[7 + k] = MacroData[0 + k];
        iDataSize++;
      }
      var DataNumber = 0;
      var iLayerCount = Math.ceil((8 + iDataSize) / 19);
      const SetAp = (j) => {
        if (j < iLayerCount) {
          var DataBTHid = Buffer.alloc(21);
          DataBTHid[0] = 7;
          DataBTHid[1] = DataNumber + 1;
          DataNumber++;
          for (var k2 = 0; k2 < 19; k2++)
            DataBTHid[2 + k2] = Data[19 * j + k2];
          this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
            if (!bResult) {
              SetAp(0);
            } else {
              SetAp(j + 1);
            }
          });
        } else {
          callback("SendButtonMatrix2Device Done");
        }
      };
      SetAp(0);
    } else {
      var Data = Buffer.alloc(264);
      Data[0] = 7;
      Data[1] = 5;
      Data[2] = MacroID;
      var iMaxSize = 248;
      for (var k = 0; k < iMaxSize; k++)
        Data[8 + k] = MacroData[0 + k];
      this.SetFeatureReport(dev, Data, 100).then(() => {
        callback("SetMacroDataToDevice Done");
      });
    }
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(256);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = {
          keydown: true,
          key: Hashkeys,
          times: MacroData.content[Hashkeys].data[iData].startTime
        };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort((a, b) => {
      return a.times >= b.times ? 1 : -1;
    });
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = SupportData.AllFunctionMapping[i].hid;
          break;
        }
      }
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[iEvent * 3 + 0] += 128;
      BufferKey[iEvent * 3 + 1] = iDelay & 255;
      BufferKey[iEvent * 3 + 2] = KeyCode;
    }
    if (DataEvent.length < 0) {
      return false;
    } else {
      return BufferKey;
    }
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer
    };
    var DataBuffer2 = this.MacroTypeToData(dev, KeyAssignData);
    var Obj2 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer2
    };
    var iKey = 5;
    var AssignData = KeyAssignData[iKey];
    var KnobControl = false;
    if (AssignData.d_SoundVolume?.bindTarget?.filename != "Windows Default Sound Output") {
      KnobControl = true;
    }
    var DataBuffer3 = this.KeyGlowToData(dev, KeyAssignData);
    var Obj3 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer3,
      KnobControl
    };
    this.SendButtonMatrix2Device(dev, Obj1, () => {
      this.SendMacroType2Device(dev, Obj2, () => {
        this.SendKeyGlow2Device(dev, Obj3, () => {
          callback("SetKeyFunction Done");
        });
      });
    });
  }
  SendButtonMatrix2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      Data[0] = 3;
      Data[1] = iProfile + 1;
      Data[2] = iLayerIndex + 1;
      for (var i = 0; i < DataBuffer.length; i++)
        Data[7 + i] = DataBuffer[i];
      var DataNumber = 0;
      var iLayerCount = Math.ceil((DataBuffer.length + 8) / 19);
      const SetAp = (j) => {
        if (j < iLayerCount) {
          var DataBTHid = Buffer.alloc(21);
          DataBTHid[0] = 7;
          DataBTHid[1] = DataNumber + 1;
          DataNumber++;
          for (var k = 0; k < 19; k++)
            DataBTHid[2 + k] = Data[19 * j + k];
          this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
            if (!bResult) {
              SetAp(0);
            } else {
              SetAp(j + 1);
            }
          });
        } else {
          callback("SendButtonMatrix2Device Done");
        }
      };
      SetAp(0);
    } else {
      Data[0] = 7;
      Data[1] = 3;
      Data[2] = iProfile + 1;
      Data[3] = iLayerIndex + 1;
      for (var i = 0; i < DataBuffer.length; i++)
        Data[8 + i] = DataBuffer[i];
      this.SetFeatureReport(dev, Data, 150).then(() => {
        callback("SendButtonMatrix2Device Done");
      });
    }
  }
  SendMacroType2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    if (DataBuffer == false) {
      callback("SendMacroType2Device Done");
      return;
    }
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      Data[0] = 4;
      Data[1] = iProfile + 1;
      Data[2] = iLayerIndex + 1;
      for (var i = 0; i < DataBuffer.length; i++) {
        Data[7 + i] = DataBuffer[i];
      }
      var DataNumber = 0;
      var iLayerCount = Math.ceil((7 + DataBuffer.length) / 19);
      const SetAp = (j) => {
        if (j < iLayerCount) {
          var DataBTHid = Buffer.alloc(21);
          DataBTHid[0] = 7;
          DataBTHid[1] = DataNumber + 1;
          DataNumber++;
          for (var k = 0; k < 19; k++)
            DataBTHid[2 + k] = Data[19 * j + k];
          this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
            if (!bResult) {
              SetAp(0);
            } else {
              SetAp(j + 1);
            }
          });
        } else {
          callback("SendMacroType2Device Done");
        }
      };
      SetAp(0);
    } else {
      if (DataBuffer == false) {
        callback("SendMacroType2Device Done");
      } else {
        Data[0] = 7;
        Data[1] = 4;
        Data[2] = iProfile + 1;
        Data[3] = iLayerIndex + 1;
        for (var i = 0; i < DataBuffer.length; i++) {
          Data[8 + i] = DataBuffer[i];
        }
        this.SetFeatureReport(dev, Data, 150).then(() => {
          callback("SendMacroType2Device Done");
        });
      }
    }
  }
  MacroTypeToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    var iMacroCount = 0;
    var arrMacroType = [1, 65535, 0];
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_KEYCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "MacroFunction":
          DataBuffer[iIndex * 2] = arrMacroType[Temp_BtnList.macro_RepeatType] >> 8;
          DataBuffer[iIndex * 2 + 1] = arrMacroType[Temp_BtnList.macro_RepeatType] & 255;
          iMacroCount++;
          break;
      }
    }
    if (iMacroCount <= 0)
      return false;
    else
      return DataBuffer;
  }
  //-----------------------------------------
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = JSON.parse(JSON.stringify(dev.Buttoninfo_Default));
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_KEYCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      if (iIndex == -1) {
        continue;
      }
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 1;
          DataBuffer[20 + iIndex] = KeyCode;
          var arrcomplex = [
            Temp_BtnList.Ctrl,
            Temp_BtnList.Shift,
            Temp_BtnList.Alt,
            Temp_BtnList.Windows,
            Temp_BtnList.hasFNStatus
          ];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
        case "MOUSE":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 9;
          DataBuffer[20 + iIndex] = KeyCode;
          break;
        case "KEYBOARD":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 8;
          DataBuffer[20 + iIndex] = KeyCode;
          break;
        case "Multimedia":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 3;
          DataBuffer[20 + iIndex] = KeyCode;
          break;
        case "LaunchProgram":
        case "LaunchWebsite":
          DataBuffer[iIndex] = 7;
          DataBuffer[20 + iIndex] = 0;
          break;
        case "SOUND CONTROL":
          if (Temp_BtnList.defaultValue == "ROTARY ENCODER") {
            DataBuffer[iIndex] = 3;
            DataBuffer[20 + iIndex] = 16;
          } else {
            DataBuffer[iIndex] = 10;
            DataBuffer[20 + iIndex] = 0;
          }
          break;
        case "Shortcuts":
          var KeyCode = 0;
          var KeyValue;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              KeyValue = SupportData.AllFunctionMapping[iMap].value;
              break;
            }
          }
          if (KeyValue == "Explorer") {
            var bycomplex = 0;
            bycomplex |= Math.pow(2, 3);
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
            DataBuffer[20 + iIndex] = 8;
          } else {
            DataBuffer[iIndex] = 3;
            DataBuffer[20 + iIndex] = KeyCode;
          }
          break;
        case "MacroFunction":
          DataBuffer[iIndex] = 5;
          DataBuffer[20 + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
          break;
        case "Disable":
          DataBuffer[iIndex] = 1;
          DataBuffer[20 + iIndex] = 0;
          break;
      }
    }
    return DataBuffer;
  }
  //Set Glow When Active
  KeyGlowToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SOUND CONTROL":
          if (Temp_BtnList.d_SoundVolume.lightData.clearStatus == true) {
            var RgbData = Temp_BtnList.d_SoundVolume.lightData.colorPickerValue;
            var visible = 255;
            if (Temp_BtnList.d_SoundVolume.lightData.breathing == true)
              visible = 254;
            DataBuffer[iIndex * 5 + 0] = visible;
            DataBuffer[iIndex * 5 + 1] = iIndex;
            DataBuffer[iIndex * 5 + 2] = RgbData[0];
            DataBuffer[iIndex * 5 + 3] = RgbData[1];
            DataBuffer[iIndex * 5 + 4] = RgbData[2];
          }
          break;
      }
    }
    return DataBuffer;
  }
  SendKeyGlow2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      Data[0] = 9;
      Data[1] = iProfile + 1;
      Data[2] = iLayerIndex + 1;
      Data[3] = 42;
      Data[5] = 20;
      Data[6] = Obj.KnobControl;
      for (var i = 0; i < DataBuffer.length; i++)
        Data[7 + i] = DataBuffer[i];
      var DataNumber = 0;
      var iLayerCount = Math.ceil((DataBuffer.length + 7) / 19);
      const SetAp = (j) => {
        if (j < iLayerCount) {
          var DataBTHid = Buffer.alloc(21);
          DataBTHid[0] = 7;
          DataBTHid[1] = DataNumber + 1;
          DataNumber++;
          for (var k = 0; k < 19; k++)
            DataBTHid[2 + k] = Data[19 * j + k];
          this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
            if (!bResult) {
              SetAp(0);
            } else {
              SetAp(j + 1);
            }
          });
        } else {
          callback("SendButtonMatrix2Device Done");
        }
      };
      SetAp(0);
    } else {
      Data[0] = 7;
      Data[1] = 9;
      Data[2] = iProfile + 1;
      Data[3] = iLayerIndex + 1;
      Data[4] = 42;
      Data[6] = 20;
      Data[7] = Obj.KnobControl;
      var iLayerCount;
      iLayerCount = 1;
      const SetAp = (j) => {
        if (j < iLayerCount) {
          Data[5] = j;
          for (var k = 0; k < 256; k++)
            Data[8 + k] = DataBuffer[256 * j + k];
          this.SetFeatureReport(dev, Data, 150).then(() => {
            SetAp(j + 1);
          });
        } else {
          callback("SendKeyGlow2Device Done");
        }
      };
      SetAp(0);
    }
  }
  //-------------------Lighting Effect------------------------
  SetLEDEffect(dev, Obj, callback) {
    env.log("GmmkNumpadSeries", "SetLEDEffect", "Begin");
    try {
      var ObjTypeData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      var ObjEffectData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
        this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
          var T_data = Obj.Perkeylist.filter((item, index, array) => {
            if (item.SN == dev.BaseInfo.SN) {
              return item;
            }
          });
          if (T_data.length < 1) {
            callback("SetLEDEffect Done");
            return;
          }
          var ObjLayoutData = {
            iProfile: Obj.iProfile,
            iLayerIndex: Obj.iLayerIndex,
            PerKeyData: Obj.LightingPerKeyData,
            Perkeylist: T_data
          };
          this.SetLEDLayoutToDevice(dev, ObjLayoutData, () => {
            callback("SetLEDEffect Done");
          });
        });
      });
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      var iShift = 0;
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[1] = 1;
        iShift = 1;
      }
      Data[0] = 7;
      Data[iShift + 1] = 2;
      Data[iShift + 2] = ObjEffectData.iProfile + 1;
      Data[iShift + 3] = ObjEffectData.iLayerIndex + 1;
      Data[iShift + 4] = iEffect;
      Data[iShift + 8] = 20 - ObjEffectData.Data.speed * 19 / 100;
      Data[iShift + 9] = 0;
      if (ObjEffectData.Data.Multicolor_Enable == true) {
        Data[iShift + 10] = ObjEffectData.Data.Multicolor;
      }
      if (iEffect == 13 || ObjEffectData.Data.PointEffectName == "Rainbow") {
        Data[iShift + 12] = 1;
      }
      Data[iShift + 15] = ObjEffectData.Data.colorPickerValue[0];
      Data[iShift + 16] = ObjEffectData.Data.colorPickerValue[1];
      Data[iShift + 17] = ObjEffectData.Data.colorPickerValue[2];
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        this.SetHidWriteAwait(dev, Data).then(() => {
          callback();
        });
      } else {
        this.SetFeatureReport(dev, Data, 100).then(() => {
          env.log("GmmkNumpadSeries", "SetLEDEffectToDevice", `2`);
          callback();
          env.log("GmmkNumpadSeries", "SetLEDEffectToDevice", `3`);
        });
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  SetLEDTypeToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      var SidelightsFlag = dev.deviceData.profileLayers[ObjEffectData.iProfile][ObjEffectData.iLayerIndex].lockSidelightsFlag;
      var batteryLevel = dev.deviceData.profileLayers[ObjEffectData.iProfile][ObjEffectData.iLayerIndex].batteryLevelIndicator;
      var iShift = 0;
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[1] = 1;
        iShift = 1;
      }
      Data[0] = 7;
      Data[iShift + 1] = 7;
      Data[iShift + 2] = ObjEffectData.iProfile + 1;
      Data[iShift + 3] = ObjEffectData.iLayerIndex + 1;
      Data[iShift + 4] = iEffect;
      Data[iShift + 5] = 0;
      Data[iShift + 6] = 1;
      Data[iShift + 7] = SidelightsFlag ? 1 : 0;
      Data[iShift + 8] = ObjEffectData.Data.brightness * 20 / 100;
      Data[iShift + 10] = 8;
      if (ObjEffectData.Data.inputLatency != void 0) {
      }
      if (ObjEffectData.Data.sensitivity != void 0) {
        Data[iShift + 11] = ObjEffectData.Data.sensitivity / 2;
      }
      Data[iShift + 12] = batteryLevel;
      if (ObjEffectData.Data.brightnessFlag == void 0)
        Data[iShift + 13] = ObjEffectData.Data.brightness * 20 / 100;
      else if (ObjEffectData.Data.brightnessFlag)
        Data[iShift + 13] = ObjEffectData.Data.wirelessBrightness * 20 / 100;
      else
        Data[iShift + 13] = ObjEffectData.Data.brightness * 20 / 100;
      if (iEffect == 0 || ObjEffectData.Data.PointEffectName == "LEDOFF") {
        Data[iShift + 8] = 10;
        Data[iShift + 13] = 10;
      }
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        this.SetHidWriteAwait(dev, Data).then(() => {
          callback("SetLEDTypeToDevice Done");
        });
      } else {
        this.SetFeatureReport(dev, Data, 100).then(() => {
          callback("SetLEDTypeToDevice Done");
        });
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetLEDTypeToDevice", `Error:${e}`);
    }
  }
  SetVolumeSensitivity(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var ProfileData = Obj.Data;
    var iLayerIndex = Obj.iLayerIndex;
    var LightingData = ProfileData.light_PRESETS_Data;
    LightingData.inputLatency = ProfileData.inputLatency;
    LightingData.sensitivity = ProfileData.sensitivity;
    var ObjTypeData = { iProfile, iLayerIndex, Data: LightingData };
    this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
      callback("SetVolumeSensitivity Done");
    });
  }
  //--------------------------------------------
  SetLEDLayoutToDevice(dev, ObjLayoutData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var DataBuffer = this.LayoutToData(dev, ObjLayoutData);
      var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
      var PerKeyContent;
      for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
        if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value)) {
          PerKeyContent = ObjLayoutData.Perkeylist[i].content;
          break;
        }
      }
      if (PerKeyContent == void 0) {
        callback("SetLEDLayoutToDevice Failed");
        env.log("GmmkNumpadSeries", "SetLEDEffectToDevice", "Failed");
        return;
      }
      var brightness = PerKeyContent.lightData.brightness * 20 / 100;
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        Data[0] = 6;
        Data[1] = ObjLayoutData.iProfile + 1;
        Data[2] = ObjLayoutData.iLayerIndex + 1;
        Data[3] = 42;
        Data[5] = brightness;
        Data[4] = 0;
        for (var j = 0; j < 256; j++)
          Data[7 + j] = DataBuffer[j];
        var iLayerCount = Math.ceil(DataBuffer.length / 13);
        var DataNumber = 0;
        const SetAp = (j2) => {
          if (j2 < iLayerCount) {
            var DataBTHid = Buffer.alloc(21);
            DataBTHid[0] = 7;
            DataBTHid[1] = DataNumber + 1;
            DataNumber++;
            for (var k = 0; k < 19; k++)
              DataBTHid[2 + k] = Data[19 * j2 + k];
            this.SetHidWriteAwait(dev, DataBTHid).then((bResult) => {
              if (!bResult) {
                SetAp(0);
              } else {
                SetAp(j2 + 1);
              }
            });
          } else {
            callback("SetLEDLayoutToDevice Done");
          }
        };
        SetAp(0);
      } else {
        Data[0] = 7;
        Data[1] = 6;
        Data[2] = ObjLayoutData.iProfile + 1;
        Data[3] = ObjLayoutData.iLayerIndex + 1;
        Data[4] = 42;
        Data[6] = brightness;
        var iLayerCount;
        iLayerCount = 1;
        const SetAp = (j2) => {
          if (j2 < iLayerCount) {
            Data[5] = j2;
            for (var k = 0; k < 256; k++)
              Data[8 + k] = DataBuffer[256 * j2 + k];
            this.SetFeatureReport(dev, Data, 100).then(() => {
              SetAp(j2 + 1);
            });
          } else {
            callback("SetLEDLayoutToDevice Done");
          }
        };
        SetAp(0);
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetLEDLayoutToDevice", `Error:${e}`);
      callback("SetLEDLayoutToDevice Done");
    }
  }
  LayoutToData(dev, ObjLayoutData) {
    var DataBuffer = Buffer.alloc(210);
    var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
    var PerKeyContent;
    for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
      if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value)) {
        PerKeyContent = ObjLayoutData.Perkeylist[i].content;
        break;
      }
    }
    if (PerKeyContent == void 0)
      return DataBuffer;
    for (var i = 0; i < PerKeyContent.AllBlockColor.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons_GMMK[i]);
      var RgbData = PerKeyContent.AllBlockColor[i].color;
      var visible = 255;
      RgbData = PerKeyContent.AllBlockColor[i].color;
      if (PerKeyContent.AllBlockColor[i].breathing && PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 254;
      } else if (PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 255;
      } else {
        visible = 0;
      }
      DataBuffer[iIndex * 5 + 0] = visible;
      DataBuffer[iIndex * 5 + 1] = iIndex;
      DataBuffer[iIndex * 5 + 2] = RgbData[0];
      DataBuffer[iIndex * 5 + 3] = RgbData[1];
      DataBuffer[iIndex * 5 + 4] = RgbData[2];
    }
    return DataBuffer;
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 264, buf);
        setTimeout(() => {
          if (rtnData < 8)
            env.log(
              "GmmkNumpadSeries SetFeatureReport",
              "SetFeatureReport(error) return data length : ",
              JSON.stringify(rtnData)
            );
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("GmmkNumpadSeries Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 264);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  //
  SetHidWrite(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetHidWrite(dev.BaseInfo.DeviceId, 7, 21, buf);
        setTimeout(() => {
          if (rtnData < 8)
            env.log(
              "GmmkNumpadSeries SetHidWrite",
              "SetHidWrite(error) return data length : ",
              JSON.stringify(rtnData)
            );
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("GmmkNumpadSeries Error", "SetHidWrite", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  StartHIDWrite(dev, callback) {
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var Data0 = Buffer.alloc(264);
      Data0[0] = 7;
      Data0[1] = 0;
      this.SetHidWriteAwait(dev, Data0).then(() => {
        callback();
      });
    } else {
      callback();
    }
  }
  EndHIDWrite(dev, callback) {
    if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
      var Data0 = Buffer.alloc(264);
      Data0[0] = 7;
      Data0[1] = 255;
      this.SetHidWriteAwait(dev, Data0).then(() => {
        callback();
      });
    } else {
      callback();
    }
  }
  //
  SetHidWriteAwait(dev, buf) {
    return new Promise((resolve, reject) => {
      dev.awaitHidWrite = true;
      var rtnData = this.hid.SetHidWrite(dev.BaseInfo.DeviceId, 7, 21, buf);
      if (rtnData < 1)
        env.log(
          "GmmkNumpadSeries SetHidWriteAwait",
          "SetHidWriteAwait(error) return data length : ",
          JSON.stringify(rtnData)
        );
      dev.timerawait = setInterval(() => {
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "USB") {
          dev.BTErrorcount = 0;
          dev.awaittime = 0;
          clearInterval(dev.timerawait);
          resolve(true);
        } else if (!dev.awaitHidWrite) {
          dev.BTErrorcount = 0;
          dev.awaittime = 0;
          clearInterval(dev.timerawait);
          resolve(true);
        } else if (dev.BTErrorcount >= 50 && dev.awaitHidWrite) {
          dev.BTErrorcount = 0;
          dev.awaittime = 0;
          clearInterval(dev.timerawait);
          resolve(true);
        } else if (dev.awaittime >= 50 && dev.awaitHidWrite) {
          dev.BTErrorcount++;
          env.log("GmmkNumpad SetHidWriteAwait", "BLE No res count: ", JSON.stringify(dev.BTErrorcount));
          rtnData = this.hid.SetHidWrite(dev.BaseInfo.DeviceId, 7, 21, buf);
          dev.awaittime = 0;
        } else {
          dev.awaittime++;
        }
      }, 50);
    });
  }
  SwitchAudioSession(ObjSoundControl) {
    if (ObjSoundControl.processid == 1) {
      this.AudioSession.SetSpeakerValue(ObjSoundControl.percent);
    } else if (ObjSoundControl.filepath != void 0) {
      this.AudioSession.SetAudioSession(ObjSoundControl);
    }
  }
  //---------------------timer for get Audio Session-------------------------------
  /**
   * get Audio Session
   * @param {*} dev
   * @param {*} callback
   */
  OnTimerGetAudioSession(dev) {
    if (dev.m_TimerGetSession != void 0) {
      clearInterval(dev.m_TimerGetSession);
    }
    dev.m_TimerGetSession = setInterval(() => {
      try {
        this.GetAudioSession(dev, 0, (ObjSession) => {
          if (ObjSession == null) {
            return;
          }
          if (this.CompareContent(ObjSession, dev.deviceData.AudioSession) == false) {
            dev.deviceData.AudioSession = JSON.parse(JSON.stringify(ObjSession));
            var Obj2 = {
              Func: EventTypes.GetAudioSession,
              SN: dev.BaseInfo.SN,
              Param: dev.deviceData.AudioSession
            };
            this.emit(EventTypes.ProtocolMessage, Obj2);
          }
        });
      } catch (e) {
        env.log("GmmkNumpadSeries", "OnTimerGetAudioSession", `Error:${e}`);
      }
    }, 1e3);
  }
  CompareContent(object1, object2) {
    var bCompare = false;
    if (object1 == void 0 || object2 == void 0)
      return false;
    if (object1.length != object2.length)
      return false;
    for (var iIndex = 0; iIndex < object1.length; iIndex++) {
      if (object1[iIndex].filename != object2[iIndex].filename)
        break;
      if (parseInt(object1[iIndex].percent) != parseInt(object2[iIndex].percent))
        break;
      if (parseInt(object1[iIndex].processid) != parseInt(object2[iIndex].processid))
        break;
      if (iIndex == object1.length - 1) {
        bCompare = true;
      }
    }
    return bCompare;
  }
  /**
   * Set PollRate and Sleep Time
   * @param {*} dev
   * @param {*} Obj: appProfileLayers,iProfile,iLayerIndex
   */
  //Set PollRate and Sleep Time
  SetPollRateAndSleep(dev, Obj, callback) {
    var appProfileLayers = Obj.appProfileLayers;
    var iCurProfile = Obj.iProfile;
    var iCurLayerIndex = Obj.iLayerIndex;
    var iPollingrate = appProfileLayers[iCurProfile][iCurLayerIndex].pollingrate;
    var DataSleep = Buffer.alloc(9);
    for (var iProfile = 0; iProfile < 3; iProfile++) {
      for (var iLayer = 0; iLayer < 3; iLayer++) {
        var ProfileLayers = appProfileLayers[iProfile][iLayer];
        if (ProfileLayers.standby == 2) {
          DataSleep[iProfile * 3 + iLayer] = ProfileLayers.standbyvalue;
        } else if (dev.sleep) {
          DataSleep[iProfile * 3 + iLayer] = dev.sleeptime;
        } else {
          DataSleep[iProfile * 3 + iLayer] = 255;
        }
      }
    }
    var ObjPollRateAndSleep = { iPollingrate, DataSleep };
    this.SetPollRateAndSleeptoDevice(dev, ObjPollRateAndSleep, (param1) => {
      callback();
    });
  }
  //Set Sleep Time Into Device
  SetSleepTimetoDevice(dev, Obj, callback) {
    try {
      if (dev.m_bSetHWDevice) {
        env.log(dev.BaseInfo.devicename, "SetSleepTimetoDevice", "Device Has Setting,Stop Forward");
        callback(false);
        return;
      }
      dev.sleep = Obj.sleep;
      dev.sleeptime = Obj.sleeptime;
      var iProfile = dev.deviceData.profileindex;
      var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
      var appProfileLayers = dev.deviceData.profileLayers;
      this.StartHIDWrite(dev, () => {
        var ObjPollRateAndSleep = {
          iProfile,
          iLayerIndex,
          appProfileLayers
        };
        this.SetPollRateAndSleep(dev, ObjPollRateAndSleep, (param1) => {
          this.EndHIDWrite(dev, () => {
            callback();
          });
        });
      });
    } catch (e) {
      env.log("GmmkNumpadSeries", "SetSleepTimetoDevice", `Error:${e}`);
    }
  }
  //Get Device Battery Status From Device
  GetDeviceBatteryStats(dev, Obj, callback) {
    try {
      if (dev.m_bAudioControl)
        return;
      else if (dev.m_bSetHWDevice) {
        callback(false);
        return;
      }
      if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
        dev.m_bSetHWDevice = true;
        this.StartHIDWrite(dev, () => {
          var Data2 = Buffer.alloc(264);
          Data2[0] = 7;
          Data2[1] = 1;
          Data2[2] = 138;
          this.SetHidWriteAwait(dev, Data2).then(() => {
            this.EndHIDWrite(dev, () => {
              dev.m_bSetHWDevice = false;
              callback(false);
            });
          });
        });
      } else {
        var Data = Buffer.alloc(264);
        Data[0] = 7;
        Data[1] = 138;
        this.SetFeatureReport(dev, Data, 30).then(() => {
          this.GetFeatureReport(dev, Data, 30).then((rtnData) => {
            var batteryvalue = rtnData[2 - 1];
            var batterycharging = rtnData[3 - 1];
            var FWHex = rtnData[5 - 1] * 256 + rtnData[4 - 1];
            var FWVersion = parseInt(FWHex.toString(16), 10);
            var verRev = FWVersion.toString();
            var strVertion = verRev.padStart(4, "0");
            var ObjBattery = {
              SN: dev.BaseInfo.SN,
              Status: 0,
              Battery: batteryvalue,
              Charging: batterycharging,
              FWVersion: strVertion
            };
            callback(ObjBattery);
          });
        });
      }
    } catch (e) {
      env.log("ModelOSeries", "GetDeviceBatteryStats", `Error:${e}`);
    }
  }
}
module.exports = GmmkNumpadSeries;
var TriggerPoint = /* @__PURE__ */ ((TriggerPoint2) => {
  TriggerPoint2[TriggerPoint2["StageOnePress"] = 0] = "StageOnePress";
  TriggerPoint2[TriggerPoint2["StageOneRelease"] = 3] = "StageOneRelease";
  TriggerPoint2[TriggerPoint2["StageTwoPress"] = 1] = "StageTwoPress";
  TriggerPoint2[TriggerPoint2["StageTwoRelease"] = 2] = "StageTwoRelease";
  return TriggerPoint2;
})(TriggerPoint || {});
const KeyCodeMapping = {
  A: 4,
  B: 5,
  C: 6,
  D: 7,
  E: 8,
  F: 9,
  G: 10,
  H: 11,
  I: 12,
  J: 13,
  K: 14,
  L: 15,
  M: 16,
  N: 17,
  O: 18,
  P: 19,
  Q: 20,
  R: 21,
  S: 22,
  T: 23,
  U: 24,
  V: 25,
  W: 26,
  X: 27,
  Y: 28,
  Z: 29,
  "1": 30,
  "2": 31,
  "3": 32,
  "4": 33,
  "5": 34,
  "6": 35,
  "7": 36,
  "8": 37,
  "9": 38,
  "0": 39,
  Return: 40,
  Escape: 41,
  Backspace: 42,
  Tab: 43,
  Space: 44,
  "-": 45,
  "=": 46,
  "[": 47,
  "]": 48,
  "\\": 49,
  "Europe 1 (Note 2)": 50,
  ";": 51,
  "'": 52,
  "`": 53,
  ",": 54,
  ".": 55,
  "/": 56,
  "Caps Lock": 57,
  F1: 58,
  F2: 59,
  F3: 60,
  F4: 61,
  F5: 62,
  F6: 63,
  F7: 64,
  F8: 65,
  F9: 66,
  F10: 67,
  F11: 68,
  F12: 69,
  "Print Screen": 70,
  "Scroll Lock": 71,
  Break: 72,
  Pause: 72,
  Insert: 73,
  Home: 74,
  "Page Up": 75,
  Delete: 76,
  End: 77,
  "Page Down": 78,
  "Right Arrow": 79,
  "Left Arrow": 80,
  "Down Arrow": 81,
  "Up Arrow": 82,
  "Num Lock": 83,
  "Keypad /": 84,
  "Keypad *": 85,
  "Keypad -": 86,
  "Keypad +": 87,
  "Keypad Enter": 88,
  "Keypad 1": 89,
  "Keypad 2": 90,
  "Keypad 3": 91,
  "Keypad 4": 92,
  "Keypad 5": 93,
  "Keypad 6": 94,
  "Keypad 7": 95,
  "Keypad 8": 96,
  "Keypad 9": 97,
  mouse_left: 240,
  mouse_right: 241,
  mouse_middle: 242,
  mouse_forward: 243,
  mouse_back: 244,
  ControlLeft: 224,
  ShiftLeft: 225,
  AltLeft: 226,
  ControlRight: 228,
  ShiftRight: 229,
  AltRight: 230
};
const KeyNumbers75Percent = {
  Esc: 0,
  "`": 1,
  Tab: 2,
  CapsLock: 3,
  ShiftLeft: 4,
  ControlLeft: 5,
  F1: 12,
  "1": 7,
  Q: 8,
  A: 9,
  Z: 16,
  MetaLeft: 17,
  F2: 18,
  "2": 13,
  W: 14,
  S: 15,
  X: 22,
  AltLeft: 23,
  "3": 19,
  E: 20,
  D: 21,
  C: 28,
  F3: 24,
  "4": 25,
  R: 26,
  F: 27,
  V: 34,
  Space: 35,
  F5: 36,
  "5": 31,
  T: 32,
  G: 33,
  B: 40,
  F6: 42,
  "6": 37,
  Y: 38,
  H: 39,
  N: 46,
  F7: 48,
  "7": 43,
  U: 44,
  J: 45,
  M: 52,
  F8: 54,
  "8": 49,
  I: 50,
  K: 51,
  ",": 58,
  AltRight: 47,
  F9: 60,
  "9": 55,
  O: 56,
  L: 57,
  ".": 64,
  "0": 61,
  P: 62,
  ";": 63,
  "/": 70,
  Fn: 53,
  F10: 66,
  "-": 67,
  "[": 68,
  "'": 69,
  ShiftRight: 76,
  ArrowLeft: 77,
  F11: 72,
  "=": 73,
  "]": 74,
  F12: 78,
  Backspace: 79,
  "\\": 80,
  Return: 81,
  ArrowUp: 82,
  ArrowDown: 83,
  ScrollWheel: 84,
  ScrollWheelDown: 65,
  ScrollWheelUp: 59,
  Delete: 85,
  PageUp: 86,
  PageDown: 87,
  End: 88,
  ArrowRight: 89
};
const KeyNumbers100Percent = {
  ContextMenu: 59,
  ControlRight: 65,
  PrintScreen: 84,
  Insert: 85,
  Delete: 86,
  ArrowLeft: 71,
  ScrollLock: 90,
  Home: 91,
  End: 92,
  ArrowUp: 82,
  ArrowDown: 77,
  Pause: 96,
  PageUp: 97,
  PageDown: 98,
  ArrowRight: 83,
  NumLock: 104,
  Numpad7: 87,
  Numpad4: 88,
  Numpad1: 89,
  Numpad0: 107,
  NumpadDivide: 110,
  Numpad8: 93,
  Numpad5: 94,
  Numpad2: 95,
  NumpadMultiply: 105,
  Numpad9: 99,
  Numpad6: 100,
  Numpad3: 101,
  NumpadDecimal: 106,
  // TODO: get the number for rotary
  ScrollWheel: 255,
  ScrollWheelDown: 109,
  ScrollWheelUp: 108,
  NumpadSubtract: 111,
  NumpadAdd: 112,
  NumpadEnter: 113
};
var ModifierKeys = /* @__PURE__ */ ((ModifierKeys2) => {
  ModifierKeys2[ModifierKeys2["CtrlLeft"] = 224] = "CtrlLeft";
  ModifierKeys2[ModifierKeys2["CtrlRight"] = 228] = "CtrlRight";
  ModifierKeys2[ModifierKeys2["ShiftLeft"] = 225] = "ShiftLeft";
  ModifierKeys2[ModifierKeys2["ShiftRight"] = 229] = "ShiftRight";
  ModifierKeys2[ModifierKeys2["AltLeft"] = 226] = "AltLeft";
  ModifierKeys2[ModifierKeys2["AltRight"] = 230] = "AltRight";
  ModifierKeys2[ModifierKeys2["MetaLeft"] = 227] = "MetaLeft";
  ModifierKeys2[ModifierKeys2["MetaRight"] = 231] = "MetaRight";
  return ModifierKeys2;
})(ModifierKeys || {});
const VID = 13357;
const wired65 = [58330, 58333, 58351, 58354];
const wired75 = [58331, 58334, 58352, 58355];
const wired100 = [58332, 58335, 58353, 58356];
const wireless65 = [58327, 58348];
const wireless75 = [58328, 58349];
const wireless100 = [58329, 58350];
const toSN = (pid) => `0x${VID.toString(16).toUpperCase()}0x${pid.toString(16).toUpperCase()}`;
const is65 = (SN) => wired65.concat(wireless65).filter((val) => toSN(val) == SN) != null;
const is75 = (SN) => wired75.concat(wireless75).filter((val) => toSN(val) == SN) != null;
const is100 = (SN) => wired100.concat(wireless100).filter((val) => toSN(val) == SN) != null;
const PhysicalKeyMapping = (deviceSN) => {
  if (is65(deviceSN))
    return KeyNumbers75Percent;
  if (is75(deviceSN))
    return KeyNumbers75Percent;
  if (is100(deviceSN))
    return { ...KeyNumbers75Percent, ...KeyNumbers100Percent };
  return {};
};
const otherFlag = 20;
const CalculateChecksum = (buffer2) => {
  const sum = buffer2.reduce((sum2, val) => sum2 + val, 0);
  return 255 - (sum & 255);
};
const ActuationToTravel = (percent) => {
  const fwValue = Math.round(percent * 39 / 100);
  return fwValue > 0 ? fwValue : 1;
};
const ActuationToRapidTrigger = (percent) => {
  const fraction = (percent > 100 ? 100 : percent < 0 ? 0 : percent) / 100;
  const delta = 25 - 2;
  return Math.round(fraction * delta) + 2;
};
const ActuationToDynamicKeystroke = (percent) => {
  percent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
  return Math.round(percent * 25 / 100) + 2;
};
const VisualizationToPercent = (firmwareValue) => {
  if (firmwareValue == null)
    return 0;
  const min = 0;
  const max = 42;
  const percent = (firmwareValue - min) / (max - min) * 100;
  const clamped = percent > 100 ? 100 : percent < 0 ? 0 : percent;
  if (clamped < percent) {
    console.warn(
      `valueC: Visualization value received (${firmwareValue}) is higher then current limit (${42})`
    );
  }
  const rounded = Math.round(clamped);
  return rounded;
};
const ProfileIndexToFWProfileNumber = (profileIndex) => {
  switch (profileIndex) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    default:
      throw new Error("Incorrect profile index!");
  }
};
const PrepareSetKeystroke = (buffer2, keyNumberPhysical, firmwareProfileNo, keycode, layer, layerIndex) => {
  buffer2.fill(0);
  buffer2[0] = 19;
  buffer2[1] = firmwareProfileNo;
  buffer2[2] = keyNumberPhysical;
  buffer2[3] = layer;
  buffer2[4] = layerIndex;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
  if (keycode.length != 4) {
    console.error("keycode must be 4 bytes long");
    throw new Error("valueC: PrepareSetDynamicKeystroke: keycode must be 4 bytes long");
  }
  buffer2.set(keycode, 8);
};
const PrepareToggleMagnetismReport = (buffer2, profileIndex, keyNumberPhysical, toggleType) => {
  buffer2.fill(0);
  buffer2[0] = 26;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[2] = 0;
  buffer2[3] = 4 + toggleType;
  buffer2[6] = keyNumberPhysical;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareModTapMagnetismReport = (buffer2, profileIndex, keyNumberPhysical, holdTimeout) => {
  buffer2.fill(0);
  buffer2[0] = 26;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[2] = 0;
  buffer2[3] = 3;
  buffer2[6] = keyNumberPhysical;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
  const clampedHoldTimeout = holdTimeout > 1e3 ? 1e3 : holdTimeout < 10 ? 10 : holdTimeout;
  const timeoutAsFraction = clampedHoldTimeout / 1e3;
  const firmwareHoldTimeout = Math.ceil(
    timeoutAsFraction * 64
    /* ModTapHoldMaxTimeout */
  );
  buffer2[16] = firmwareHoldTimeout;
};
const PrepareDynamicKeyStrokeMagnetismReport = (buffer2, profileIndex, data, keyNumberPhysical) => {
  buffer2.fill(0);
  buffer2[0] = 26;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[2] = 0;
  buffer2[3] = 2;
  buffer2[5] = 0;
  buffer2[6] = keyNumberPhysical;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
  buffer2[11] = data.firstPointValue != null ? ActuationToDynamicKeystroke(data.firstPointValue) : 12;
  buffer2[12] = data.firstPointPressButton != null ? 1 : 0;
  buffer2[13] = data.secondPointPressButton != null ? 4 : 0;
  buffer2[14] = data.secondPointReleaseButton != null ? 16 : 0;
  buffer2[15] = data.firstPointReleaseButton != null ? 64 : 0;
  buffer2[16] = otherFlag;
};
const PrepareSetCustomActuationMode = (buffer2) => {
  buffer2.fill(0);
  buffer2[0] = 29;
  buffer2[1] = 3;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareActuationPointAndRapidTriggerMagnetismReport = (buffer2, data, profileIndex, layer, isPerKey, keyNumberPhysical) => {
  const profile = ProfileIndexToFWProfileNumber(profileIndex);
  const layerAndProfile = (layer & 15) << 4 | profile & 15;
  buffer2.fill(0);
  buffer2[0] = 26;
  buffer2[1] = layerAndProfile;
  buffer2[2] = 0;
  buffer2[3] = data.rapidTriggerEnabled ? 128 : 0;
  buffer2[4] = ActuationToTravel(data.actuationPointPress);
  buffer2[5] = isPerKey ? 0 : 1;
  buffer2[6] = isPerKey ? keyNumberPhysical : 0;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
  buffer2[8] = ActuationToTravel(data.actuationPointRelease);
  if (data.rapidTriggerEnabled) {
    buffer2[9] = ActuationToRapidTrigger(data.rapidTriggerPointPress);
    buffer2[10] = ActuationToRapidTrigger(data.rapidTriggerPointRelease);
  }
  buffer2[16] = otherFlag;
};
const PrepareVisualization = (buffer2, enable) => {
  buffer2.fill(0);
  buffer2[0] = 27;
  buffer2[1] = enable ? 1 : 0;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareReset = (buffer2) => {
  buffer2.fill(0);
  buffer2[0] = 2;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareSetReportRate = (buffer2, profileIndex, firmwareRate) => {
  buffer2.fill(0);
  buffer2[0] = 4;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[2] = firmwareRate;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareKeystrokeClear = (buffer2, profileIndex) => {
  buffer2.fill(0);
  buffer2[0] = 26;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[6] = 0;
  buffer2[16] = otherFlag;
};
const UpdateKeystrokeClear = (buffer2, keyNumberPhysical) => {
  buffer2[6] = keyNumberPhysical;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareLightingBuffers = (lightingEffect) => {
  const effectData = lightingEffect.toUint8Array();
  const LEDBuffer = buffer.Buffer.alloc(9, 0);
  LEDBuffer[0] = 7;
  LEDBuffer.set(effectData, 1);
  LEDBuffer[8] = CalculateChecksum(LEDBuffer.subarray(0, 8));
  const SideLEDBuffer = buffer.Buffer.alloc(9, 0);
  SideLEDBuffer[0] = 8;
  SideLEDBuffer.set(effectData, 1);
  SideLEDBuffer[8] = CalculateChecksum(SideLEDBuffer.subarray(0, 8));
  return { LEDBuffer, SideLEDBuffer };
};
const PrepareGetFWVersion = () => {
  const requests = {
    USB: buffer.Buffer.alloc(9, 0),
    RF: buffer.Buffer.alloc(9, 0),
    LED: buffer.Buffer.alloc(9, 0),
    Dongle: buffer.Buffer.alloc(9, 0)
  };
  requests.USB[1] = 240;
  requests.USB[8] = CalculateChecksum(requests.USB);
  requests.RF[1] = 128;
  requests.RF[8] = CalculateChecksum(requests.RF);
  requests.LED[1] = 174;
  requests.LED[8] = CalculateChecksum(requests.LED);
  requests.Dongle[1] = 240;
  requests.Dongle[8] = CalculateChecksum(requests.Dongle);
  return requests;
};
const ParseFWVersionResponse = (buffer$1) => {
  if (!buffer.Buffer.isBuffer(buffer$1)) {
    console.error("ParseFWVersion: Malformed buffer");
    return "";
  }
  const command = buffer$1.readUInt8(0);
  switch (command) {
    case 240: {
      return `KBv${buffer$1.readUint16LE(1).toString(16)}`;
    }
    case 128: {
      return `RFv${buffer$1.readUint16LE(1).toString(16)}`;
    }
    case 174: {
      return `LEDv${buffer$1.readUint16LE(1).toString(16)}`;
    }
    default: {
      console.warn(`valueC: Unexpected response in FW Version: 0x${command.toString(16).padStart(2, "0")}`);
      return "";
    }
  }
};
const ParseDongleVersionResponse = (buffer$1) => {
  if (buffer.Buffer.isBuffer(buffer$1) && buffer$1.length >= 2) {
    return `DongleV${buffer$1.readUint16BE(0).toString(16).padStart(4, "0")}`;
  }
  console.warn(`valueC: Unexpected response in Dongle FW Version`);
  return "";
};
const PrepareSetProfileIndex = (buffer2, profileIndex, layer) => {
  buffer2.fill(0);
  buffer2[0] = 5;
  buffer2[1] = ProfileIndexToFWProfileNumber(profileIndex);
  buffer2[2] = layer;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareGetProfileIndex = (buffer2) => {
  buffer2.fill(0);
  buffer2[0] = 133;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const ParseProfileIndexResponse = (buffer$1) => {
  if (!buffer.Buffer.isBuffer(buffer$1))
    throw new Error("ParseProfileResponse: Malformed buffer");
  if (buffer$1[0] != 133)
    throw new Error("ParseProfileResponse: Buffer structure mismatch");
  switch (buffer$1[1]) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    default:
      throw new Error(`ParseProfileResponse: Unexpected profile number: 0x${buffer$1.readUInt8(1).toString(16)}`);
  }
};
const PrepareMacroBuffer = (buffer2, id, page, isLastPage) => {
  buffer2.fill(0);
  buffer2[0] = 22;
  buffer2[1] = id;
  buffer2[2] = page;
  buffer2[3] = 56;
  buffer2[4] = isLastPage ? 1 : 0;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
};
const PrepareGetDeviceID = (buffer2) => {
  buffer2.fill(0);
  buffer2[0] = 143;
  buffer2[7] = CalculateChecksum(buffer2.subarray(0, 7));
  return buffer2;
};
const ParseDeviceID = (buffer$1) => {
  if (!buffer.Buffer.isBuffer(buffer$1) || buffer$1.length < 8)
    console.error("Malformed buffer");
  if (buffer$1[0] != 143)
    console.error("Unexpected response!");
  const deviceID = buffer$1.readUInt32LE(1);
  const mode = buffer$1[5] == 0 ? "Wired" : "Wireless";
  const type = buffer$1[6] == 0 ? "Keyboard" : "Mouse";
  return { deviceID, mode, type };
};
class HSLColor {
  #hue = 0;
  get hue() {
    return this.#hue;
  }
  set hue(value) {
    this.#hue = value;
  }
  get h() {
    return this.#hue;
  }
  set h(value) {
    this.#hue = value;
  }
  #saturation = 100;
  get saturation() {
    return this.#saturation;
  }
  set saturation(value) {
    this.#saturation = value;
  }
  get s() {
    return this.#saturation;
  }
  set s(value) {
    this.#saturation = value;
  }
  #lightness = 100;
  get lightness() {
    return this.#lightness;
  }
  set lightness(value) {
    this.#lightness = value;
  }
  get l() {
    return this.#lightness;
  }
  set l(value) {
    this.#lightness = value;
  }
  toRGBA() {
    return toRGBA(this);
  }
  toHSL() {
    return this;
  }
  toHex() {
    return toHex(this);
  }
  toArray_rgba() {
    const rgbaColor = toRGBA(this);
    return [rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a];
  }
  toArray_hsl() {
    return [this.#hue, this.#saturation, this.#lightness];
  }
  static fromHSL(hue = 0, saturation = 100, lightness = 50) {
    const color = new HSLColor();
    color.#hue = hue;
    color.#saturation = saturation;
    color.#lightness = lightness;
    return color;
  }
}
function toRGBA(hsl) {
  const hue = hsl.h / 360;
  const saturation = hsl.s / 100;
  const luminosity = hsl.l / 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (saturation == 0) {
    red = green = blue = luminosity;
  } else {
    let hue2rgb = function(p2, q2, t) {
      if (t < 0)
        t += 1;
      if (t > 1)
        t -= 1;
      if (t < 1 / 6)
        return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2)
        return q2;
      if (t < 2 / 3)
        return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = luminosity < 0.5 ? luminosity * (1 + saturation) : luminosity + saturation - luminosity * saturation;
    const p = 2 * luminosity - q;
    red = hue2rgb(p, q, hue + 1 / 3);
    green = hue2rgb(p, q, hue);
    blue = hue2rgb(p, q, hue - 1 / 3);
  }
  red *= 255;
  green *= 255;
  blue *= 255;
  return RGBAColor.fromRGB(red, green, blue);
}
function toHSL(rgb) {
  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
  const average = (max + min) / 2;
  let hue = average;
  let saturation = average;
  let luminosity = average;
  if (max == min) {
    hue = saturation = 0;
  } else {
    const delta = max - min;
    saturation = luminosity > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max == red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max == green) {
      hue = (blue - red) / delta + 2;
    } else if (max == blue) {
      hue = (red - green) / delta + 4;
    }
    hue /= 6;
  }
  hue *= 360;
  saturation *= 100;
  luminosity *= 100;
  return HSLColor.fromHSL(hue, saturation, luminosity);
}
function toHex(color) {
  const rgbaColor = color instanceof RGBAColor ? color : toRGBA(color);
  let redString = Math.round(rgbaColor.r).toString(16);
  let greenString = Math.round(rgbaColor.g).toString(16);
  let blueString = Math.round(rgbaColor.b).toString(16);
  if (redString.length == 1) {
    redString = "0" + redString;
  }
  if (greenString.length == 1) {
    greenString = "0" + greenString;
  }
  if (blueString.length == 1) {
    blueString = "0" + blueString;
  }
  return "#" + redString + greenString + blueString;
}
const HEX_COLOR_MAX = 255;
class RGBAColor {
  #red = 0;
  get red() {
    return this.#red;
  }
  set red(value) {
    this.#red = value;
  }
  get r() {
    return this.#red;
  }
  set r(value) {
    this.#red = value;
  }
  #green = 0;
  get green() {
    return this.#green;
  }
  set green(value) {
    this.#green = value;
  }
  get g() {
    return this.#green;
  }
  set g(value) {
    this.#green = value;
  }
  #blue = 100;
  get blue() {
    return this.#blue;
  }
  set blue(value) {
    this.#blue = value;
  }
  get b() {
    return this.#blue;
  }
  set b(value) {
    this.#blue = value;
  }
  #alpha = 100;
  get alpha() {
    return this.#alpha;
  }
  set alpha(value) {
    this.#alpha = value;
  }
  get a() {
    return this.#alpha;
  }
  set a(value) {
    this.#alpha = value;
  }
  constructor() {
  }
  toRGBA() {
    return this;
  }
  toHSL() {
    return toHSL(this);
  }
  toHex() {
    return toHex(this);
  }
  toArray_rgba() {
    return [this.#red, this.#green, this.#blue, this.#alpha];
  }
  toArray_hsl() {
    const hslColor = toHSL(this);
    return [hslColor.h, hslColor.s, hslColor.l];
  }
  static fromRGB(red = 0, green = 0, blue = 0, alpha = 1) {
    const color = new RGBAColor();
    color.#red = red;
    color.#green = green;
    color.#blue = blue;
    color.#alpha = alpha;
    return color;
  }
  static fromHSL(hue = 0, saturation = 0, lightness = 0, alpha = 1) {
    const color = new RGBAColor();
    const hue_local = hue / 360;
    const saturation_local = saturation / 100;
    const luminosity_local = lightness / 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (saturation_local == 0) {
      red = green = blue = luminosity_local;
    } else {
      let hue2rgb = function(p2, q2, t) {
        if (t < 0)
          t += 1;
        if (t > 1)
          t -= 1;
        if (t < 1 / 6)
          return p2 + (q2 - p2) * 6 * t;
        if (t < 1 / 2)
          return q2;
        if (t < 2 / 3)
          return p2 + (q2 - p2) * (2 / 3 - t) * 6;
        return p2;
      };
      const q = luminosity_local < 0.5 ? luminosity_local * (1 + saturation_local) : luminosity_local + saturation_local - luminosity_local * saturation_local;
      const p = 2 * luminosity_local - q;
      red = hue2rgb(p, q, hue_local + 1 / 3);
      green = hue2rgb(p, q, hue_local);
      blue = hue2rgb(p, q, hue_local - 1 / 3);
    }
    color.#red = red * 255;
    color.#green = green * 255;
    color.#blue = blue * 255;
    color.#alpha = alpha;
    return color;
  }
  static fromHex(hex) {
    const color = new RGBAColor();
    const rgbArray = ["0x" + hex[1] + hex[2] | 0, "0x" + hex[3] + hex[4] | 0, "0x" + hex[5] + hex[6] | 0];
    color.#red = rgbArray[0];
    color.#green = rgbArray[1];
    color.#blue = rgbArray[2];
    if (hex.length > 7) {
      const hexInteger = "0x" + hex[6] + hex[7] | 0;
      const hexPercent = hexInteger / HEX_COLOR_MAX;
      color.#alpha = hexPercent;
    }
    return color;
  }
}
const MapEffectValue = (value) => {
  switch (value) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 6;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 7;
    case 7:
      return 8;
    case 8:
      return 0;
    case 9:
      return 9;
    case 10:
      return 10;
    case 11:
      return 11;
    case 12:
      return 12;
    case 13:
      return 13;
    case 14:
      return 14;
    case 15:
      return 15;
    case 16:
      return 16;
    case 17:
      return 17;
    case 18:
      return 18;
    default:
      return 0;
  }
};
var ColorMode = /* @__PURE__ */ ((ColorMode2) => {
  ColorMode2[ColorMode2["Red"] = 0] = "Red";
  ColorMode2[ColorMode2["Orange"] = 1] = "Orange";
  ColorMode2[ColorMode2["Yellow"] = 2] = "Yellow";
  ColorMode2[ColorMode2["Green"] = 3] = "Green";
  ColorMode2[ColorMode2["Cyan"] = 4] = "Cyan";
  ColorMode2[ColorMode2["Blue"] = 5] = "Blue";
  ColorMode2[ColorMode2["Purple"] = 6] = "Purple";
  ColorMode2[ColorMode2["APColor"] = 7] = "APColor";
  ColorMode2[ColorMode2["RGBMode"] = 8] = "RGBMode";
  return ColorMode2;
})(ColorMode || {});
class LightingEffect {
  static #speedSteps = 4;
  static #brightnessSteps = 4;
  effect;
  speedPercent;
  brightnessPercent;
  colorMode;
  type;
  RGB;
  constructor(effect, speedPercent, brightnessPercent, color, type, RGB = RGBAColor.fromRGB(180, 180, 180)) {
    this.effect = effect;
    this.speedPercent = speedPercent;
    this.brightnessPercent = brightnessPercent;
    this.colorMode = color;
    this.type = type;
    this.RGB = RGB;
  }
  toUint8Array() {
    const optionLow = 15 & this.colorMode;
    const optionHigh = (15 & this.type) << 4;
    const option = optionLow | optionHigh;
    const speed = Math.ceil(this.speedPercent / 100 * LightingEffect.#speedSteps);
    const brightness = Math.ceil(this.brightnessPercent / 100 * LightingEffect.#brightnessSteps);
    const data = new Uint8Array(7);
    data[0] = this.effect;
    data[1] = speed;
    data[2] = brightness;
    data[3] = option;
    data[4] = this.RGB.r;
    data[5] = this.RGB.g;
    data[6] = this.RGB.b;
    return data;
  }
  fromUint8Array(data) {
    this.effect = data[0];
    this.speedPercent = data[1] / LightingEffect.#speedSteps * 100;
    this.brightnessPercent = data[2] / LightingEffect.#brightnessSteps * 100;
    this.colorMode = data[3] & 15;
    this.type = (data[3] & 240) >> 4;
    this.RGB = RGBAColor.fromRGB(data[4], data[5], data[6]);
  }
}
class MacroSequence {
  static attribute_delay_mask = 127;
  static attribute_press_mask = 128;
  static max_page_size = 56;
  static max_page_count = 5;
  sequence = [];
  constructor(repeatCount = 1) {
    this.sequence.push(repeatCount);
    this.sequence.push(0);
  }
  // TODO: verify if actually possible, doesn't seem to work
  // addDelay(delay: number) {
  //     this.sequence.push(0x01);
  //     if (delay <= MacroSequence.attribute_delay_mask) {
  //         this.sequence.push(delay);
  //     } else {
  //         const delayLow = delay & 0xff;
  //         const delayHigh = (delay >> 4) & 0xff;
  //         this.sequence.push(0);
  //         this.sequence.push(delayLow);
  //         this.sequence.push(delayHigh);
  //     }
  // }
  add(keyName, press, delayAfter) {
    const keyCode = KeyCodeMapping[keyName];
    if (keyCode == null) {
      console.error(`Unmatched key encountered: ${keyName}`);
      return;
    }
    this.sequence.push(keyCode);
    if (delayAfter <= MacroSequence.attribute_delay_mask) {
      this.sequence.push(
        (press ? MacroSequence.attribute_press_mask : 0) | delayAfter & MacroSequence.attribute_delay_mask
      );
    } else {
      this.sequence.push(press ? MacroSequence.attribute_press_mask : 0);
      const delayLow = delayAfter & 255;
      const delayHigh = delayAfter >> 4 & 255;
      this.sequence.push(delayLow);
      this.sequence.push(delayHigh);
    }
    const sequenceCount = Math.ceil(this.sequence.length / MacroSequence.max_page_size);
    if (sequenceCount > MacroSequence.max_page_count) {
      console.warn(`Macro sequence now length exceeds maximum!`);
    }
  }
  finalize() {
    this.sequence.push(0);
    this.sequence.push(0);
  }
  getBuffers() {
    const sequenceCount = Math.ceil(this.sequence.length / MacroSequence.max_page_size);
    if (sequenceCount > MacroSequence.max_page_count) {
      throw new Error(`Macro sequence too long: got ${sequenceCount} pages, max ${MacroSequence.max_page_count}`);
    }
    let buffers = [];
    for (let i = 0; i < sequenceCount; i++) {
      const offset = i * MacroSequence.max_page_size;
      buffers.push(Buffer.from(this.sequence.slice(offset, offset + MacroSequence.max_page_size)));
    }
    return buffers;
  }
}
const PrepareMacroData = (macro) => {
  const content = macro.content;
  let macroEvents = [];
  for (const obj in content) {
    const val = content[obj];
    macroEvents = macroEvents.concat(
      val.data.map((x) => {
        return {
          key: x.inputName.replace("Key", "").replace("Digit", ""),
          start: x.startTime,
          duration: x.endTime - x.startTime
        };
      })
    );
  }
  if (macroEvents.length == 0) {
    console.warn(`PrepareMacroData: macroEvents length is 0`);
    return [];
  }
  macroEvents.sort((a, b) => a.start - b.start);
  const sequentialMacroEvents = macroEvents.flatMap((event) => {
    const pressEvent = { key: event.key, start: event.start, press: true };
    const releaseEvent = { key: event.key, start: event.start + event.duration, press: false };
    return [pressEvent, releaseEvent];
  });
  sequentialMacroEvents.sort((a, b) => a.start - b.start);
  const macroSequence = new MacroSequence();
  for (let index = 0; index < sequentialMacroEvents.length - 1; index++) {
    const evt = sequentialMacroEvents[index];
    const evtNext = sequentialMacroEvents[index + 1];
    let delayAfter = evtNext.start - evt.start;
    if (delayAfter <= 0) {
      console.error(`Macro keystroke delay is incorrect: ${delayAfter} for keystroke ${evt}`);
      delayAfter = 1;
    }
    macroSequence.add(evt.key, evt.press, delayAfter);
  }
  const evtLast = sequentialMacroEvents[sequentialMacroEvents.length - 1];
  macroSequence.add(evtLast.key, evtLast.press, 1);
  macroSequence.finalize();
  return macroSequence.getBuffers();
};
const GenerateMacroKeyCode = (macroID, macroRepeatType) => {
  return Uint8Array.from([9, macroRepeatType, macroID, 0]);
};
const GetMacroRepeatType = (value) => {
  switch (value) {
    case "3":
      return 1;
    case "2":
      return 2;
    case "1":
      return 0;
    default:
      return 0;
  }
};
const ProduceKeyCode = (key, modifierData) => {
  const result = new Uint8Array(4);
  if (modifierData.Shift)
    result[1] = ModifierKeys.ShiftLeft;
  if (modifierData.Alt)
    result[1] = ModifierKeys.AltLeft;
  if (modifierData.Ctrl)
    result[1] = ModifierKeys.CtrlLeft;
  if (modifierData.Windows)
    result[1] = ModifierKeys.MetaLeft;
  result[2] = key;
  return result;
};
function getProfileData(dev) {
  const currentProfileIndex = dev.deviceData.profileindex;
  const currentProfileLayerIndex = dev.deviceData.profileLayerIndex[currentProfileIndex];
  const currentProfile = dev.deviceData.profileLayers[currentProfileIndex][currentProfileLayerIndex];
  return { currentProfileIndex, currentProfile, currentProfileLayerIndex };
}
function getProfile$1(dev, profileIndex, layer) {
  return dev.deviceData.profileLayers[profileIndex][layer];
}
function getLayers(dev, profileIndex) {
  return dev.deviceData.profileLayers[profileIndex];
}
function getPhysicalDeviceSN(dev) {
  let deviceSN = dev.BaseInfo?.SN;
  if (!deviceSN) {
    console.warn("valueC.getDeviceSN: dev.BaseInfo.SN is undefined");
    return "";
  }
  const stateID = dev.BaseInfo.StateID ?? 0;
  if (stateID != 0)
    deviceSN = `${dev.BaseInfo.vid[stateID]}${dev.BaseInfo.pid[stateID]}`;
  return deviceSN;
}
class valueC extends Keyboard {
  static #instance;
  static #usagePage = 65535;
  static #settingsUsage = 2;
  static #reportID = 0;
  static #visualisationUsage = 1;
  visualizationUpdateIntervalID = null;
  visualizationState = 0;
  constructor(hid) {
    super();
    this.hid = hid;
  }
  static getInstance(hid = null) {
    if (this.#instance) {
      return this.#instance;
    }
    if (!hid) {
      throw new Error(`valueC could not be initialized: hid == ${hid}`);
    }
    this.#instance = new valueC(hid);
    return this.#instance;
  }
  FindDevice(deviceSN, usagePage = valueC.#usagePage, usage = valueC.#settingsUsage) {
    if (deviceSN.length != 12) {
      console.error("valueC GetDeviceID: Invalid deviceSN!");
      return null;
    }
    const vid = parseInt(deviceSN.substring(0, 6), 16);
    const pid = parseInt(deviceSN.substring(6, 12), 16);
    return this.hid.FindDevice(usagePage, usage, vid, pid);
  }
  SendReportToDevice(dev, report, delayAfter = 450) {
    return new Promise((resolve) => {
      setTimeout(() => {
        report[0] = valueC.#reportID;
        const msg = Array.from(report).map((value) => value.toString(16).padStart(2, "0")).join(" ");
        const physicalSN = getPhysicalDeviceSN(dev);
        console.debug("valueC", `SendReportToDevice ${physicalSN} ${msg}`);
        const deviceID = this.FindDevice(physicalSN);
        if (deviceID) {
          const bytesWritten = this.hid.SetFeatureReport(
            deviceID,
            valueC.#reportID,
            report.length,
            report
          );
          if (bytesWritten < 0) {
            console.error("valueC", "Failed to send report");
          } else {
            console.debug("valueC", `Report sent`);
          }
          resolve(bytesWritten);
        } else {
          console.error(`valueC failed to get deviceID`);
          resolve(0);
        }
      }, delayAfter);
    });
  }
  GetReportFromDevice(dev, delayAfter = 150) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const physicalSN = getPhysicalDeviceSN(dev);
        const deviceID = this.FindDevice(physicalSN);
        if (deviceID) {
          const report = this.hid.GetFeatureReport(deviceID, valueC.#reportID, 65);
          if (report.length > 0) {
            console.debug("valueC", `GetReportFromDevice ${physicalSN} ${report}`);
          } else {
            console.error("valueC", `GetReportFromDevice failed: ${physicalSN} ${deviceID} ${report})`);
          }
          resolve(buffer.Buffer.from(report));
        } else {
          console.error(`valueC failed to get deviceID`);
          resolve(buffer.Buffer.alloc(1, 0));
        }
      }, delayAfter);
    });
  }
  // @ts-ignore
  async InitialDevice(dev, Obj, callback) {
    console.log("valueC", "InitialDevice", dev.BaseInfo.SN);
    await this.getFWVersion(dev);
    callback(0);
  }
  SetFeatureReport(dev, buf, iSleep) {
    console.log("valueC", `SetFeatureReport ${dev.BaseInfo.SN}`);
    return new Promise((resolve) => {
      try {
        const result = this.SendReportToDevice(dev, buf);
        setTimeout(() => {
          console.log("valueC", `SetFeatureReport ${result != buf.length ? "Error" : "Success"}`);
          resolve(result);
        }, iSleep);
      } catch (error) {
        console.log("valueC", `SetFeatureReport Error: ${error}`);
        resolve(error);
      }
    });
  }
  async initDevice(dev) {
    console.warn("valueC", "initDevice");
    const readDeviceID = this.FindDevice(dev.BaseInfo.SN, valueC.#usagePage, valueC.#visualisationUsage);
    await super.initDevice(dev);
    const res = this.hid.SetDeviceCallbackFunc((buffer2, deviceData) => {
      if (buffer2[0] == 5 && buffer2[1] == 1) {
        const profileIndex = buffer2[2];
        const layerIndex = buffer2[3];
        const deviceSN = `0x${deviceData.vid.toString(16).toUpperCase()}0x${deviceData.pid.toString(16).toUpperCase()}`;
        const ProfileSwitchEvent = {
          Func: EventTypes.SwitchUIProfile,
          SN: deviceSN,
          Param: {
            SN: deviceSN,
            Profile: profileIndex,
            Layer: layerIndex,
            ModelType: dev.BaseInfo.ModelType
            // 2 - Keyboard
          }
        };
        console.log(`Device [${readDeviceID} ] profile changed: ${profileIndex}-${layerIndex}`);
        this.emit(EventTypes.ProtocolMessage, ProfileSwitchEvent);
      }
    });
    console.log(`valueC init device: ${res}`);
  }
  SaveProfileToDevice(dev, callback) {
    console.warn("valueC", "SaveProfileToDevice");
    super.SaveProfileToDevice(dev, callback);
    callback("valueC Done");
  }
  // @ts-ignore
  async ChangeProfileID(dev, profileAndLayerIndex, callback) {
    console.log("valueC", "ChangeProfileID");
    const profileIndex = 15 & profileAndLayerIndex;
    const layer = (240 & profileAndLayerIndex) >> 4;
    await this.setSelectedProfileIndex(dev, profileIndex, layer);
    const result = await this.getSelectedProfileIndex(dev);
    if (result == profileIndex) {
      dev.deviceData.profileindex = profileIndex;
      dev.profile = dev.deviceData.profileLayers[profileIndex];
      this.setProfileToDevice(dev, () => {
        console.log("valueC", "ChangeProfile done");
        callback("valueC Done");
      });
    } else {
      console.log("valueC", "Failed to ChangeProfile. Switch mismatch?");
      callback(void 0);
    }
  }
  // @ts-ignore
  ChangeProfile(dev, obj) {
    console.warn("valueC", "ChangeProfile");
  }
  // @ts-ignore
  ChangeLayer(dev, obj) {
    console.warn("valueC", "ChangeLayer");
    console.log(obj);
  }
  // @ts-ignore
  ImportProfile(dev, obj, callback) {
    console.warn("valueC", "ImportProfile");
    callback("valueC Done");
  }
  ReadFWVersion(dev, _obj, callback) {
    this.getFWVersion(dev).then(callback(0));
  }
  // @ts-ignore
  StartBatteryTimeout(dev, Obj, callback) {
    callback(0);
  }
  // @ts-ignore
  SetKeyMatrix(dev, obj, callback) {
    if (obj.switchUIflag.keybindingflag || obj.switchUIflag.performanceflag) {
      this.setKeyboardDataFromProfile(dev).then((result) => {
        callback(result);
      });
    }
    if (obj.switchUIflag.lightingflag) {
      this.setLightingDataFromProfile(dev).then((result) => {
        callback(result);
      });
    }
  }
  ResetDevice(dev, Obj, callback) {
    console.debug("valueC", "ResetDevice", Obj);
    this.resetDevice(dev).then((_result) => callback({ success: true, data: "valueC Done" }));
  }
  async SetVisualization(dev, Obj, callback) {
    console.debug("valueC", "SetVisualization", Obj);
    await this.setVisualization(dev, Obj.value);
    callback({ success: true, data: "valueC Done" });
  }
  async GetProfileID(dev, _obj, callback) {
    const id = await this.getSelectedProfileIndex(dev);
    callback({ profileID: id });
  }
  async getDeviceID(deviceSN) {
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    const dev = { BaseInfo: { SN: deviceSN } };
    PrepareGetDeviceID(buffer$1.subarray(1));
    const bytesSent = await this.SendReportToDevice(dev, buffer$1);
    console.log(bytesSent);
    const response = await this.GetReportFromDevice(dev);
    const deviceInfo = ParseDeviceID(response);
    return deviceInfo.deviceID;
  }
  async setLightingDataFromProfile(dev) {
    const { currentProfileIndex, currentProfile } = getProfileData(dev);
    await this.setGlobalLighting(dev, currentProfileIndex, currentProfile);
    this.setProfileToDevice(dev, () => {
      console.debug("valueC", "setLightingDataFromProfile", "done");
    });
    return { success: true, data: "valueC setLightingDataFromProfile Done" };
  }
  async setKeyboardDataFromProfile(dev) {
    console.debug("valueC", "setKeyboardDataFromProfile");
    const { currentProfileIndex, currentProfile } = getProfileData(dev);
    if (!currentProfile || currentProfileIndex < 0) {
      console.warn("valueC", "setKeyboardDataFromProfile", "no profile found");
      return { success: false, data: "Error: No profile found" };
    }
    await this.setPollingRate(dev, currentProfileIndex, currentProfile);
    if (currentProfile.valueCData) {
      await this.setGlobalActuationAndRapidTrigger(dev, currentProfile, currentProfileIndex);
      await this.setCustomActuationMode(dev);
    }
    const layers = getLayers(dev, currentProfileIndex);
    for (let layerNo = 0; layerNo < layers.length; ++layerNo) {
      await this.processDefaultBindings(dev, currentProfileIndex, layerNo);
      await this.clearRemovedvalueCBindings(dev, currentProfileIndex, layerNo);
      const profileLayer = layers[layerNo];
      if (!profileLayer.valueCData) {
        console.warn(
          "valueC",
          "setKeyboardDataFromProfile",
          `no valueC data found in profile ${currentProfileIndex}-${layerNo}`
        );
      } else {
        if (!profileLayer.valueCData.VisualisationEnabled) {
          await this.setPerKeyActuationAndRapidTrigger(dev, currentProfileIndex, layerNo);
          await this.setDynamicKeystroke(dev, currentProfileIndex, layerNo);
          await this.setModTap(dev, currentProfileIndex, layerNo);
          await this.setToggle(dev, currentProfileIndex, layerNo);
        }
      }
      await this.processBindingsWithMacros(dev, currentProfileIndex, layerNo);
    }
    this.setProfileToDevice(dev, () => {
      console.debug("valueC", "setProfileToDevice", "done");
    });
    console.debug("valueC", "setKeyboardDataFromProfile", "done");
    return { success: true, data: "valueC setKeyboardDataFromProfile Done" };
  }
  async setCustomActuationMode(dev) {
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareSetCustomActuationMode(buffer$1.subarray(1));
    await this.SendReportToDevice(dev, buffer$1);
  }
  async setGlobalActuationAndRapidTrigger(dev, profile, profileIndex) {
    const valueCData = profile.valueCData;
    const actuationData = {
      actuationPointPress: valueCData.ActuationPressValue,
      actuationPointRelease: valueCData.ActuationReleaseValue,
      rapidTriggerEnabled: valueCData.RapidTriggerEnabled,
      rapidTriggerPointPress: valueCData.RapidTriggerPressValue,
      rapidTriggerPointRelease: valueCData.RapidTriggerReleaseValue
    };
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareActuationPointAndRapidTriggerMagnetismReport(
      buffer$1.subarray(1),
      actuationData,
      profileIndex,
      0,
      false,
      0
    );
    await this.SendReportToDevice(dev, buffer$1);
  }
  async setPerKeyActuationAndRapidTrigger(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysActuationOrRapidTrigger = profile.assignedKeyboardKeys[0].filter(
      (key) => key.valueCKeyData != null && (key.valueCKeyData.actuationData != null || key.valueCKeyData.rapidTriggerData != null)
    );
    console.debug(
      "valueC",
      "setPerKeyActuationAndRapidTrigger",
      `keysActuationOrRapidTrigger: ${keysActuationOrRapidTrigger.length}`
    );
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    for (const key of keysActuationOrRapidTrigger) {
      const valueCKeyData = key.valueCKeyData;
      const perKeyActuationData = {
        actuationPointPress: valueCKeyData.actuationData?.ActuationPressValue ?? 50,
        actuationPointRelease: valueCKeyData.actuationData?.ActuationReleaseValue ?? 50,
        rapidTriggerEnabled: valueCKeyData.rapidTriggerData !== null,
        rapidTriggerPointPress: valueCKeyData.rapidTriggerData?.RapidTriggerPressValue ?? 0,
        rapidTriggerPointRelease: valueCKeyData.rapidTriggerData?.RapidTriggerReleaseValue ?? 0
      };
      const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      PrepareActuationPointAndRapidTriggerMagnetismReport(
        buffer$1.subarray(1),
        perKeyActuationData,
        profileIndex,
        layer,
        true,
        keyNumberPhysical
      );
      await this.SendReportToDevice(dev, buffer$1);
      key.changed = true;
    }
  }
  async setDynamicKeystroke(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysWithDynamicKeystroke = profile.assignedKeyboardKeys[0].filter(
      (keyData) => keyData.valueCKeyData != null && keyData.valueCKeyData.DynamicKeystrokeData != null
    );
    console.debug(
      "valueC",
      "setDynamicKeystroke",
      `keysWithDynamicKeystroke: ${keysWithDynamicKeystroke.length}.`
    );
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    for (const key of keysWithDynamicKeystroke) {
      if (key.valueCKeyData?.DynamicKeystrokeData == null || key.valueCKeyData.DynamicKeystrokeData.length == 0) {
        continue;
      }
      const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      for (const triggerPoint in TriggerPoint) {
        if (isNaN(Number(triggerPoint)))
          continue;
        const assignedKey = key.valueCKeyData.DynamicKeystrokeData.find(
          (x) => x.triggerPoint == Number(triggerPoint)
        )?.assignedKey;
        const keycode = new DeviceKeyCode(assignedKey ? KeyCodeMapping[assignedKey] : 0);
        const keystrokeFWProfileNo = ProfileIndexToFWProfileNumber(profileIndex);
        const dksLayerIndex = Number(triggerPoint);
        PrepareSetKeystroke(
          buffer$1.subarray(1),
          keyNumberPhysical,
          keystrokeFWProfileNo,
          keycode.valueOf(),
          layer,
          dksLayerIndex
        );
        await this.SendReportToDevice(dev, buffer$1);
      }
      const dynamicKeystrokeData = {
        firstPointValue: key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOnePress)?.triggerPointValue ?? null,
        firstPointPressButton: key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOnePress)?.assignedKey ?? null,
        firstPointReleaseButton: key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageOneRelease)?.assignedKey ?? null,
        secondPointPressButton: key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageTwoPress)?.assignedKey ?? null,
        secondPointReleaseButton: key.valueCKeyData.DynamicKeystrokeData.find((x) => x.triggerPoint == TriggerPoint.StageTwoRelease)?.assignedKey ?? null
      };
      PrepareDynamicKeyStrokeMagnetismReport(
        buffer$1.subarray(1),
        profileIndex,
        dynamicKeystrokeData,
        keyNumberPhysical
      );
      await this.SendReportToDevice(dev, buffer$1);
      key.changed = true;
    }
  }
  async SetComplexKeystroke(dev, profileIndex, layer, keyNumberPhysical, keyCode0, keyCode1 = new DeviceKeyCode(), keyCode2 = new DeviceKeyCode(), keyCode3 = new DeviceKeyCode()) {
    const FWProfileOffset = ProfileIndexToFWProfileNumber(profileIndex);
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareSetKeystroke(buffer$1.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode0.valueOf(), layer, 0);
    await this.SendReportToDevice(dev, buffer$1, 600);
    PrepareSetKeystroke(buffer$1.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode1.valueOf(), layer, 1);
    await this.SendReportToDevice(dev, buffer$1, 600);
    PrepareSetKeystroke(buffer$1.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode2.valueOf(), layer, 2);
    await this.SendReportToDevice(dev, buffer$1, 600);
    PrepareSetKeystroke(buffer$1.subarray(1), keyNumberPhysical, FWProfileOffset, keyCode3.valueOf(), layer, 3);
    await this.SendReportToDevice(dev, buffer$1);
  }
  async setModTap(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysWithModTapData = profile.assignedKeyboardKeys[0].filter(
      (key) => key.valueCKeyData != null && key.valueCKeyData.ModTapData != null
    );
    console.debug("valueC", "setModTap", ``);
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    for (const key of keysWithModTapData) {
      const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      const holdKeyCode = KeyCodeMapping[key.valueCKeyData.ModTapData.holdAction] ?? KeyCodeMapping[key.defaultValue];
      const tapKeyCode = KeyCodeMapping[key.valueCKeyData.ModTapData.tapAction] ?? 0;
      await this.SetComplexKeystroke(
        dev,
        profileIndex,
        layer,
        keyNumberPhysical,
        new DeviceKeyCode(holdKeyCode),
        new DeviceKeyCode(tapKeyCode)
      );
      PrepareModTapMagnetismReport(
        buffer$1.subarray(1),
        profileIndex,
        keyNumberPhysical,
        key.valueCKeyData.ModTapData.holdTimeout
      );
      await this.SendReportToDevice(dev, buffer$1);
      key.changed = true;
    }
  }
  async sendVisualizationUpdate(deviceSN, value) {
    if (this.visualizationState != value) {
      this.visualizationState = value;
      this.emit(EventTypes.ProtocolMessage, {
        Func: EventTypes.valueCVisualizationUpdate,
        SN: deviceSN,
        Param: { SN: deviceSN, value: this.visualizationState }
      });
    }
  }
  async setToggle(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysWithToggleData = profile.assignedKeyboardKeys[0].filter(
      (key) => key.valueCKeyData != null && key.valueCKeyData.ToggleData != null
    );
    console.debug("valueC", "setToggle", ``);
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    for (const key of keysWithToggleData) {
      const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      const toggleKeyCode = KeyCodeMapping[key.valueCKeyData.ToggleData.toggleAction];
      const baseKeyCode = KeyCodeMapping[key.defaultValue];
      await this.SetComplexKeystroke(
        dev,
        profileIndex,
        layer,
        keyNumberPhysical,
        new DeviceKeyCode(toggleKeyCode),
        new DeviceKeyCode(baseKeyCode)
      );
      const toggleType = key.valueCKeyData.ToggleData.toggleType;
      PrepareToggleMagnetismReport(buffer$1.subarray(1), profileIndex, keyNumberPhysical, toggleType);
      await this.SendReportToDevice(dev, buffer$1);
      key.changed = true;
    }
  }
  async setVisualization(dev, enable) {
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareVisualization(buffer$1.subarray(1), enable);
    if (enable) {
      await this.SendReportToDevice(dev, buffer$1);
      const physicalSN = getPhysicalDeviceSN(dev);
      const deviceID = this.FindDevice(physicalSN, valueC.#usagePage, valueC.#visualisationUsage);
      if (deviceID) {
        this.hid.SetupHIDReadThread(true, deviceID, 4, (result) => {
          if (buffer.Buffer.isBuffer(result) && result.length > 0) {
            const parsedResult = VisualizationToPercent(result.at(2));
            console.debug("valueC", `Received visualization data: ${result.at(2)} == ${parsedResult}%`);
            this.sendVisualizationUpdate(dev.BaseInfo.SN, parsedResult);
          }
        });
      } else {
        console.error("valueC setVisualization: failed to get deviceID");
      }
    } else {
      this.hid.SetupHIDReadThread(false);
      await this.SendReportToDevice(dev, buffer$1);
    }
  }
  async resetDevice(dev) {
    await this.setVisualization(dev, false);
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareReset(buffer$1.subarray(1));
    await this.SendReportToDevice(dev, buffer$1);
  }
  async clearRemovedvalueCBindings(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysWithBindingsToClear = profile.assignedKeyboardKeys[0].filter(
      (keyData) => keyData.valueCKeyData === null && keyData.changed
    );
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareKeystrokeClear(buffer$1.subarray(1), 0);
    for (const key of keysWithBindingsToClear) {
      const keyNumberPhysical = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      const defaultMapping = KeyCodeMapping[key.defaultValue];
      await this.SetComplexKeystroke(
        dev,
        profileIndex,
        layer,
        keyNumberPhysical,
        new DeviceKeyCode(defaultMapping)
      );
      UpdateKeystrokeClear(buffer$1.subarray(1), keyNumberPhysical);
      await this.SendReportToDevice(dev, buffer$1);
      key.changed = false;
    }
  }
  async processDefaultBindings(dev, profileIndex, layer) {
    console.log("valueC", "processDefaultBindings");
    const profile = getProfile$1(dev, profileIndex, layer);
    if (!profile || !profile.assignedKeyboardKeys || profile.assignedKeyboardKeys.length == 0) {
      return;
    }
    const keysWithBindings = profile.assignedKeyboardKeys[0].filter(
      (keyData) => keyData.recordBindCodeType == "SingleKey"
    );
    const deviceSN = dev.BaseInfo.SN;
    for (const key of keysWithBindings) {
      const mappedKeyName = key.recordBindCodeName.replace("Key", "").replace("Digit", "");
      const originalKey = PhysicalKeyMapping(deviceSN)[key.defaultValue];
      const mappedKey = KeyCodeMapping[mappedKeyName];
      if (mappedKey != null && originalKey != null) {
        const buffer$1 = buffer.Buffer.alloc(65, 0);
        PrepareSetKeystroke(
          buffer$1.subarray(1),
          originalKey,
          ProfileIndexToFWProfileNumber(profileIndex),
          ProduceKeyCode(mappedKey, key),
          layer,
          0
        );
        await this.SendReportToDevice(dev, buffer$1);
        key.value = key.recordBindCodeName;
        key.changed = true;
      }
    }
  }
  async setPollingRate(dev, currentProfileIndex, profile) {
    const pollingRate = Number(profile.pollingrate);
    if (pollingRate && !isNaN(pollingRate)) {
      let firmwareRate = 1;
      switch (pollingRate) {
        case 125:
          firmwareRate = 8;
          break;
        case 250:
          firmwareRate = 4;
          break;
        case 500:
          firmwareRate = 2;
          break;
        case 1e3:
        default:
          firmwareRate = 1;
          break;
      }
      const buffer$1 = buffer.Buffer.alloc(65, 0);
      PrepareSetReportRate(buffer$1.subarray(1), currentProfileIndex, firmwareRate);
      await this.SendReportToDevice(dev, buffer$1);
    }
  }
  // @ts-ignore
  async setGlobalLighting(dev, _currentProfileIndex, profile) {
    console.log("valueC", "setLighting");
    const effect = MapEffectValue(profile.light_PRESETS_Data.value);
    const color = RGBAColor.fromHex(profile.light_PRESETS_Data.colors[0]);
    const speed = profile.light_PRESETS_Data.speed;
    const brightness = profile.light_PRESETS_Data.brightness * (color.alpha / 100);
    const lightingEffect = new LightingEffect(effect, speed, brightness, ColorMode.APColor, 0, color);
    const { LEDBuffer, SideLEDBuffer } = PrepareLightingBuffers(lightingEffect);
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    buffer$1.set(LEDBuffer, 1);
    await this.SendReportToDevice(dev, buffer$1, 600);
    buffer$1.set(SideLEDBuffer, 1);
    await this.SendReportToDevice(dev, buffer$1, 600);
  }
  // TODO: finish per-key lighting
  async setPerKeyLighting(dev, _currentProfileIndex, profile) {
    console.log("valueC", `setPerKeyLighting`);
  }
  async getSelectedProfileIndex(dev) {
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareGetProfileIndex(buffer$1.subarray(1));
    await this.SendReportToDevice(dev, buffer$1);
    const response = await this.GetReportFromDevice(dev);
    return ParseProfileIndexResponse(response);
  }
  async setSelectedProfileIndex(dev, profileIndex, layer) {
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    PrepareSetProfileIndex(buffer$1.subarray(1), profileIndex, layer);
    await this.SendReportToDevice(dev, buffer$1);
  }
  async getFWVersion(dev) {
    console.log("valueC", `getFWVersion`);
    const requests = PrepareGetFWVersion();
    const result = {};
    await this.SendReportToDevice(dev, requests.USB);
    result.USB = await this.GetReportFromDevice(dev);
    await this.SendReportToDevice(dev, requests.RF);
    result.RF = await this.GetReportFromDevice(dev);
    await this.SendReportToDevice(dev, requests.LED);
    result.LED = await this.GetReportFromDevice(dev);
    let version2 = ParseFWVersionResponse(result.USB) + ParseFWVersionResponse(result.RF) + ParseFWVersionResponse(result.LED);
    const dongleIndex = dev.BaseInfo.StateType.indexOf("Dongle");
    if (dongleIndex != -1) {
      const dongle = { BaseInfo: { ...dev.BaseInfo } };
      dongle.BaseInfo.StateID = dongleIndex;
      await this.SendReportToDevice(dongle, requests.USB);
      const dongleResponse = await this.GetReportFromDevice(dongle);
      const dongleVersion = ParseDongleVersionResponse(dongleResponse);
      if (dongleVersion)
        version2 += ` ${dongleVersion}`;
    }
    console.log("valueC", `getFWVersion done: ${version2}`);
    dev.BaseInfo.version_Wired = version2;
    dev.BaseInfo.version_Wireless = version2;
  }
  async processBindingsWithMacros(dev, profileIndex, layer) {
    const profile = getProfile$1(dev, profileIndex, layer);
    const keysWithMacrosAssigned = profile.assignedKeyboardKeys[0].filter(
      (keyData) => keyData.recordBindCodeType == "MacroFunction"
    );
    const allMacros = new Set(keysWithMacrosAssigned.map((key) => key.macro_Data.value));
    for (const macroID of allMacros) {
      await this.saveMacroToDevice(dev, macroID);
    }
    for (const keyWithMacro of keysWithMacrosAssigned) {
      await this.setMacroKeybind(
        dev,
        profileIndex,
        layer,
        keyWithMacro.defaultValue,
        keyWithMacro.macro_Data.value
      );
    }
  }
  async getMacroByID(macroID) {
    const macro = await this.nedbObj.getMacroById(macroID);
    if (!macro || macro.length == 0)
      throw new Error(`valueC::saveMacroToDevice: Failed to get macro by id: ${macroID}`);
    if (macro.length != 1)
      console.warn(`Macros array size = ${macro.length}, expected exactly 1!`);
    return macro[0];
  }
  async setMacroKeybind(dev, profileIndex, layer, key, macroID) {
    const deviceSN = dev.BaseInfo.SN;
    const buffer$1 = buffer.Buffer.alloc(65, 0);
    const keyNumber = PhysicalKeyMapping(deviceSN)[key];
    const macro = await this.getMacroByID(macroID);
    const macroRepeatType = GetMacroRepeatType(macro.m_Identifier);
    const macroKeyCode = GenerateMacroKeyCode(macroID, macroRepeatType);
    PrepareSetKeystroke(buffer$1.subarray(1), keyNumber, profileIndex, macroKeyCode, layer, 0);
    await this.SendReportToDevice(dev, buffer$1);
  }
  async saveMacroToDevice(dev, macroID) {
    const macro = await this.getMacroByID(macroID);
    const macroDataBuffers = PrepareMacroData(macro);
    let pageCounter = 0;
    for (const macroData of macroDataBuffers) {
      const buffer$1 = buffer.Buffer.alloc(65, 0);
      PrepareMacroBuffer(buffer$1.subarray(1), macroID, pageCounter++, pageCounter == macroDataBuffers.length);
      buffer$1.set(macroData, 9);
      await this.SendReportToDevice(dev, buffer$1);
    }
  }
}
class DeviceKeyCode {
  data;
  constructor(MappedKeyCode = 0, modifier1 = 0, modifier2 = 0, isMouseButton = false) {
    if (modifier1 && modifier2) {
      this.data = Uint8Array.from([0, modifier1, modifier2, MappedKeyCode]);
    } else if (modifier1) {
      this.data = Uint8Array.from([0, modifier1, MappedKeyCode, 0]);
    } else {
      this.data = Uint8Array.from([0, 0, MappedKeyCode, 0]);
    }
    if (isMouseButton)
      this.data[0] = 1;
  }
  valueOf() {
    return this.data;
  }
}
class Gmmk3Series extends Keyboard {
  static #instance;
  m_bSetFWEffect;
  m_bSetHWDevice;
  Matrix_SideLED;
  arrLEDType;
  constructor(hid, AudioSession) {
    env.log("Gmmk3Series", "Gmmk3Series class", "begin");
    super();
    this.m_bSetFWEffect = false;
    this.m_bSetHWDevice = false;
    this.hid = hid;
    this.AudioSession = AudioSession;
    this.Matrix_SideLED = ["SideLED1", "SideLED2", "SideLED3", "SideLED4", "SideLED5", "SideLED6", "SideLED7", "SideLED8", "SideLED9", "SideLED10", "SideLED11", "SideLED12", "SideLED13", "SideLED14", "SideLED15", "SideLED16", "SideLED17", "SideLED18", "SideLED19", "SideLED20"];
    this.arrLEDType = [
      8,
      //'LEDOFF',
      0,
      //'GloriousMode',
      1,
      //'Wave#1',
      3,
      //'Wave#2',
      4,
      //'SpiralingWave',
      5,
      //'AcidMode',
      2,
      //'Breathing',
      6,
      //'NormallyOn',
      7,
      //'RippleGraff',
      9,
      //'PassWithoutTrace',
      10,
      //'FastRunWithoutTrace',
      11,
      //'Matrix2',
      12,
      //'Matrix3',
      13,
      //'Rainbow',
      14,
      //'HeartbeatSensor',
      15,
      //'DigitTimes',
      16,
      //'Kamehameha',
      17,
      //'Pingpong',
      18
      //'Surmount',
    ];
  }
  static getInstance(hid, AudioSession) {
    if (this.#instance) {
      env.log("Gmmk3Series", "getInstance", `Get exist Gmmk3Series() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Gmmk3Series", "getInstance", `New Gmmk3Series() INSTANCE`);
      this.#instance = new Gmmk3Series(hid, AudioSession);
      return this.#instance;
    }
  }
  /**
   * Init Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  InitialDevice(dev, Obj, callback) {
    env.log("Gmmk3Series", "initDevice", "Begin");
    dev.bwaitForPair = false;
    dev.m_bSetHWDevice = false;
    var keyBoardList = GMMKLocation.keyBoardList[dev.BaseInfo.SN];
    if (keyBoardList != void 0) {
      dev.Matrix_LEDCode_GMMK = keyBoardList.Matrix_LEDCode;
      dev.Matrix_KEYButtons = keyBoardList.Matrix_KEYButtons;
      dev.Buttoninfo_Default = keyBoardList.Buttoninfo_Default;
    } else {
      env.log(dev.BaseInfo.devicename, "InitialDevice", "GMMKLocation is not Exists");
      callback(0);
      return;
    }
    dev.KeyMatrixLength = 110;
    dev.BaseInfo.version_Wireless = "0001";
    if (env.BuiltType == 0 && dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bootloader") {
      dev.BaseInfo.version_Wired = "0001";
      callback(0);
    } else if (env.BuiltType == 0) {
      var ObjPollingrate = { iPollingrate: 1e3, EP2Enable: 1, LEDNoChange: 1 };
      this.SetPollingRatetoDevice(dev, ObjPollingrate, function(param1) {
        callback(0);
      });
    } else {
      dev.BaseInfo.version_Wired = "0021";
      callback(0);
    }
  }
  /**
   * Set Device Data from DB to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetProfileDataFromDB(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    this.nedbObj.getLayout().then((data) => {
      const SetProfileData = (iProfile, iLayerIndex) => {
        var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
        var ProfileData = dev.deviceData.profile[iProfile];
        if (iProfile < 3 && iLayerIndex < 3 && ProfileData != void 0) {
          var appProfileLayers = dev.deviceData.profileLayers;
          var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
          var ObjKeyAssign = {
            iProfile,
            iLayerIndex,
            KeyAssignData,
            assignedKnob: void 0
          };
          if (appProfileLayers[iProfile][iLayerIndex].assignedKnob != void 0) {
            ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex].assignedKnob;
          }
          var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
          LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
          var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
          var ObjLighting = {
            iProfile,
            iLayerIndex,
            LightingData,
            LightingPerKeyData,
            Perkeylist: layoutDBdata
          };
          this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
              SetProfileData(iProfile, iLayerIndex + 1);
            });
          });
        } else if (iProfile < 3 && ProfileData != void 0) {
          SetProfileData(iProfile + 1, 0);
        } else {
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var ObjMacroData = { MacroData };
            this.SetMacroFunction(dev, ObjMacroData, (param1) => {
              this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
                var iProfile2 = dev.deviceData.profileindex;
                var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfile2];
                var appProfileLayers2 = dev.deviceData.profileLayers;
                var iPollingrate = appProfileLayers2[iProfile2][iLayerIndex2].pollingrate;
                var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
                this.SetPollingRatetoDevice(dev, ObjPollingrate, (param12) => {
                  callback("SetProfileDataFromDB Done");
                });
              });
            });
          });
        }
      };
      SetProfileData(0, 0);
    });
  }
  /**
   * Set Device Data from Import Profile to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetImportProfileData(dev, Obj, callback) {
    if (env.BuiltType == 1) {
      callback();
      return;
    }
    var iProfile = dev.deviceData.profileindex;
    const SetLayoutData = (iLayerIndex) => {
      if (iLayerIndex < 3) {
        var appProfileLayers = dev.deviceData.profileLayers;
        var KeyAssignData = appProfileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0];
        var ObjKeyAssign = {
          iProfile,
          iLayerIndex,
          KeyAssignData,
          assignedKnob: void 0
        };
        if (appProfileLayers[iProfile][iLayerIndex].assignedKnob != void 0) {
          ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex].assignedKnob;
        }
        var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
        LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
        var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex].light_PERKEY_Data;
        var Perkeylist = Obj.Perkeylist;
        var ObjLighting = {
          iProfile,
          iLayerIndex,
          LightingData,
          LightingPerKeyData,
          Perkeylist
        };
        this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
          this.SetLEDEffect(dev, ObjLighting, (param2) => {
            SetLayoutData(iLayerIndex + 1);
          });
        });
      } else {
        var Macrolist = Obj.Macrolist;
        var MacroData = [];
        for (let index = 0; index < Macrolist.length; index++) {
          if (parseInt(Macrolist[index].m_Identifier) > 0) {
            MacroData.push(Macrolist[index]);
          }
        }
        var ObjMacroData = { MacroData };
        this.SetMacroFunction(dev, ObjMacroData, (param1) => {
          var iProfile2 = dev.deviceData.profileindex;
          var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfile2];
          var appProfileLayers2 = dev.deviceData.profileLayers;
          var iPollingrate = appProfileLayers2[iProfile2][iLayerIndex2].pollingrate;
          var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
          this.SetPollingRatetoDevice(dev, ObjPollingrate, (param12) => {
            this.ChangeProfileID(dev, dev.deviceData.profileindex, (paramDB) => {
              callback("SetProfileDataFromDB Done");
            });
          });
        });
      }
    };
    SetLayoutData(0);
  }
  HIDEP2Data(dev, ObjData) {
    if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[2] >= 128) {
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      if (iKeyColumn == 4 && (iKeyRaw == 15 || iKeyRaw == 16)) {
        this.LaunchProgramKnob(dev, iKeyRaw == 16 ? 1 : 0, false);
      } else {
        var iKey = dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn * 20 + iKeyRaw]);
        this.LaunchProgram(dev, iKey);
      }
    } else if (ObjData[0] == 4 && ObjData[1] == 247 && ObjData[4] == 1) {
      var iKeyColumn = ObjData[2];
      var iKeyRaw = ObjData[3];
      var iKey = dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn * 5 + iKeyRaw]);
      this.LaunchProgram(dev, iKey);
    } else if (ObjData[0] == 4 && ObjData[1] == 241 && ObjData[8] != 1) {
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var ObjProfileIndex = { Profile: iProfile, LayerIndex: iLayerIndex, SN: dev.BaseInfo.SN };
      env.log("Gmmk3Series", "HIDEP2Data-SwitchProfile", JSON.stringify(ObjProfileIndex));
      dev.deviceData.profileindex = iProfile;
      dev.deviceData.profileLayerIndex[iProfile] = iLayerIndex;
      var Obj2 = {
        Func: EventTypes.SwitchUIProfile,
        SN: dev.BaseInfo.SN,
        Param: ObjProfileIndex
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.setProfileToDevice(dev, function(paramDB) {
      });
    } else if (ObjData[0] == 4 && ObjData[1] == 242) {
      var iProfile = ObjData[2] - 1;
      var iLayerIndex = ObjData[3] - 1;
      var iEffect = this.arrLEDType[ObjData[4]];
      var iSpeed = ObjData[5] * 100 / 20;
      var iBright = ObjData[6] * 100 / 20;
      var ObjLighting = { Profile: iProfile, LayerIndex: iLayerIndex, Effect: iEffect, Speed: iSpeed, Bright: iBright, SN: dev.BaseInfo.SN };
      var Obj3 = {
        Func: EventTypes.SwitchLighting,
        SN: dev.BaseInfo.SN,
        Param: ObjLighting
      };
      this.emit(EventTypes.ProtocolMessage, Obj3);
    } else if (ObjData[0] == 4 && ObjData[1] == 249) {
      var iEffect = this.arrLEDType[ObjData[2]];
      var bMultiColor = ObjData[3] == 1 ? true : false;
      var iProfileindex = dev.deviceData.profileindex;
      var iLayerIndex2 = dev.deviceData.profileLayerIndex[iProfileindex];
      var LightingData = JSON.parse(JSON.stringify(dev.deviceData.profileLayers[iProfileindex][iLayerIndex2].light_PRESETS_Data));
      if (iEffect == LightingData.value) {
        LightingData.Multicolor = bMultiColor;
        var ObjLighting2 = { Effect: LightingData, SN: dev.BaseInfo.SN };
        var Obj4 = {
          Func: EventTypes.SwitchMultiColor,
          SN: dev.BaseInfo.SN,
          Param: ObjLighting2
        };
        this.emit(EventTypes.ProtocolMessage, Obj4);
        this.setProfileToDevice(dev, function(paramDB) {
        });
      }
    }
    if (ObjData[0] == 4 && (ObjData[1] == 248 || ObjData[1] == 247) && ObjData[2] >= 128) {
      var iKeyColumn = ObjData[2] & 127;
      var iKeyRaw = ObjData[3];
      var iKey = dev.Matrix_KEYButtons.indexOf(dev.Matrix_LEDCode_GMMK[iKeyColumn * 20 + iKeyRaw]);
      var Obj5 = { Func: "SendKeynumber", SN: dev.BaseInfo.SN, Param: iKey };
      this.emit(EventTypes.ProtocolMessage, Obj5);
    }
  }
  /**
   * Launch Program
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgram(dev, iKey) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKeyboardKeys[0][iKey];
    switch (KeyAssignData.recordBindCodeType) {
      case "LaunchProgram":
        var csProgram = KeyAssignData.ApplicationPath;
        if (csProgram == void 0) {
          console.log(dev.BaseInfo.devicename, "---csProgram is undefined");
        } else if (csProgram != "") {
          this.RunApplication(csProgram);
        }
        break;
      case "LaunchWebsite":
        var csProgram = KeyAssignData.WebsitePath;
        if (csProgram == void 0) {
          console.log(dev.BaseInfo.devicename, "---csProgram is undefined");
        } else if (csProgram != "") {
          this.RunWebSite(GetValidURL(csProgram), null);
        }
        break;
    }
  }
  /**
   * Launch Program Knob
   * @param {*} dev
   * @param {*} iKey
   */
  LaunchProgramKnob(dev, iKey, bSwitch) {
    var iProfile = dev.deviceData.profileindex;
    var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
    var KeyAssignData = dev.deviceData.profileLayers[iProfile][iLayerIndex].assignedKnob[iKey];
    env.log("GmmkNumpad-LaunchProgram", "KnobData:" + JSON.stringify(KeyAssignData), "iKey:" + JSON.stringify(iKey));
    switch (KeyAssignData.recordBindCodeType) {
      case "Shortcuts":
        if (KeyAssignData.recordBindCodeName == "Microphone_Down") {
          this.AudioSession?.MicrophoneDown(2);
        } else if (KeyAssignData.recordBindCodeName == "Microphone_Up") {
          this.AudioSession?.MicrophoneUp(2);
        } else if (KeyAssignData.recordBindCodeName == "Audio_Device_Prev") {
          this.AudioSession?.Initialization();
          this.AudioSession?.SetNextAudioDeviceDefault();
        } else if (KeyAssignData.recordBindCodeName == "Audio_Device_Next") {
          this.AudioSession?.Initialization();
          this.AudioSession?.SetNextAudioDeviceDefault();
        }
        break;
    }
  }
  /**
   * Set Polling Rate to Device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetPollingRatetoDevice(dev, Obj, callback) {
    var Data = Buffer.alloc(264);
    Data[0] = 7;
    Data[1] = 8;
    Data[2] = Obj.EP2Enable;
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 100).then(function() {
        callback();
      });
    });
  }
  /**
   * Read FW Version from device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  ReadFWVersion(dev, Obj, callback) {
    try {
      var rtnData = this.hid.GetFWVersion(dev.BaseInfo.DeviceId);
      var CurFWVersion = parseInt(rtnData.toString(16), 10);
      var verRev = CurFWVersion.toString();
      var strVertion = verRev.padStart(4, "0");
      if (strVertion == "2000") {
        dev.BaseInfo.version_Wired = "0001";
      } else {
        dev.BaseInfo.version_Wired = strVertion;
      }
      callback("0");
    } catch (e) {
      env.log("Gmmk3Series", "ReadFWVersion", `Error:${e}`);
      callback(false);
    }
  }
  /**
   * Set key matrix to device
   * @param {*} dev
   * @param {*} Obj
   * @param {*} callback
   */
  SetKeyMatrix(dev, Obj, callback) {
    env.log("Gmmk3Series", "SetKeyMatrix", "Begin");
    dev.deviceData.profile = Obj.KeyBoardManager.KeyBoardArray;
    dev.deviceData.profileLayers = Obj.KeyBoardManager.profileLayers;
    dev.deviceData.profileindex = Obj.KeyBoardManager.profileindex;
    dev.deviceData.profileLayerIndex = Obj.KeyBoardManager.profileLayerIndex;
    dev.deviceData.sideLightSwitch = Obj.KeyBoardManager.sideLightSwitch;
    var iProfile = Obj.KeyBoardManager.profileindex;
    var appProfileLayers = Obj.KeyBoardManager.profileLayers;
    Obj.KeyBoardManager.layerMaxNumber;
    var switchUIflag = Obj.switchUIflag;
    if (env.BuiltType == 1) {
      this.setProfileToDevice(dev, function(paramDB) {
        callback("SetKeyMatrix Done");
      });
      return;
    }
    try {
      dev.m_bSetHWDevice = true;
      switch (true) {
        case switchUIflag.keybindingflag:
          this.nedbObj.getMacro().then((doc) => {
            var MacroData = doc;
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var KeyAssignData = appProfileLayers[iProfile][iLayerIndex2].assignedKeyboardKeys[0];
            var ObjKeyAssign = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              KeyAssignData,
              assignedKnob: void 0
            };
            if (appProfileLayers[iProfile][iLayerIndex2].assignedKnob != void 0) {
              ObjKeyAssign.assignedKnob = appProfileLayers[iProfile][iLayerIndex2].assignedKnob;
            }
            var ObjMacroData = { MacroData };
            this.SetKeyFunction(dev, ObjKeyAssign, (param1) => {
              this.SetMacroFunction(dev, ObjMacroData, (param2) => {
                this.ChangeProfileID(dev, iProfile, (param0) => {
                  this.setProfileToDevice(dev, (paramDB) => {
                    dev.m_bSetHWDevice = false;
                    callback("SetKeyMatrix Done");
                  });
                });
              });
            });
          });
          break;
        case switchUIflag.lightingflag:
          this.nedbObj.getLayout().then((data) => {
            var layoutDBdata = JSON.parse(JSON.stringify(data[0].AllData));
            var iLayerIndex2 = Obj.KeyBoardManager.profileLayerIndex[iProfile];
            var LightingData = appProfileLayers[iProfile][iLayerIndex2].light_PRESETS_Data;
            LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex2].inputLatency;
            var LightingPerKeyData = appProfileLayers[iProfile][iLayerIndex2].light_PERKEY_Data;
            var ObjLighting = {
              iProfile,
              iLayerIndex: iLayerIndex2,
              LightingData,
              LightingPerKeyData,
              Perkeylist: layoutDBdata
            };
            this.SetLEDEffect(dev, ObjLighting, (param2) => {
              this.setProfileToDevice(dev, (paramDB) => {
                this.ChangeProfileID(dev, iProfile, function(param0) {
                  dev.m_bSetHWDevice = false;
                  callback("SetKeyMatrix Done");
                });
              });
            });
          });
          break;
        case switchUIflag.performanceflag:
          var iLayerIndex = Obj.KeyBoardManager.profileLayerIndex[iProfile];
          var iPollingrate = appProfileLayers[iProfile][iLayerIndex].pollingrate;
          var ObjPollingrate = { iPollingrate, EP2Enable: 1, LEDNoChange: 0 };
          this.SetPollingRatetoDevice(dev, ObjPollingrate, (paramDB) => {
            var LightingData = appProfileLayers[iProfile][iLayerIndex].light_PRESETS_Data;
            LightingData.inputLatency = appProfileLayers[iProfile][iLayerIndex].inputLatency;
            var ObjTypeData = { iProfile, iLayerIndex, Data: LightingData };
            this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
              this.setProfileToDevice(dev, function(paramDB2) {
                callback("SetKeyMatrix Done");
              });
            });
          });
          break;
      }
    } catch (e) {
      env.log("Gmmk3Series", "SetKeyMatrix", `Error:${e}`);
    }
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroFunction(dev, ObjMacroData, callback) {
    const SetMacro = (iMacro) => {
      if (iMacro < ObjMacroData.MacroData.length) {
        var MacroData = ObjMacroData.MacroData[iMacro];
        var BufferKey = this.MacroToData(MacroData);
        var ObjMacroData2 = { MacroID: parseInt(MacroData.value), MacroData: BufferKey };
        this.SetMacroDataToDevice(dev, ObjMacroData2, function() {
          SetMacro(iMacro + 1);
        });
      } else {
        callback("SetMacroFunction Done");
      }
    };
    SetMacro(0);
  }
  /**
   * Set Macro to Device
   * @param {*} dev
   * @param {*} ObjMacroData
   * @param {*} callback
   */
  SetMacroDataToDevice(dev, ObjMacroData, callback) {
    var MacroID = ObjMacroData.MacroID;
    var MacroData = ObjMacroData.MacroData;
    var Data = Buffer.alloc(264);
    Data[0] = 7;
    Data[1] = 5;
    Data[2] = MacroID;
    var iMaxSize = 248;
    for (var k = 0; k < iMaxSize; k++)
      Data[8 + k] = MacroData[0 + k];
    this.SetFeatureReport(dev, Data, 100).then(function() {
      callback("SetMacroDataToDevice Done");
    });
  }
  MacroToData(MacroData) {
    var BufferKey = new Array(264);
    var DataEvent = [];
    var Macrokeys = Object.keys(MacroData.content);
    for (var icontent = 0; icontent < Macrokeys.length; icontent++) {
      var Hashkeys = Macrokeys[icontent];
      for (var iData = 0; iData < MacroData.content[Hashkeys].data.length; iData++) {
        var MacroEvent = { keydown: true, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].startTime };
        DataEvent.push(MacroEvent);
        MacroEvent = { keydown: false, key: Hashkeys, times: MacroData.content[Hashkeys].data[iData].endTime };
        DataEvent.push(MacroEvent);
      }
    }
    DataEvent = DataEvent.sort(function(a, b) {
      return a.times >= b.times ? 1 : -1;
    });
    for (var iEvent = 0; iEvent < DataEvent.length; iEvent++) {
      var KeyCode = 4;
      for (var i = 0; i < SupportData.AllFunctionMapping.length; i++) {
        if (DataEvent[iEvent].key == SupportData.AllFunctionMapping[i].code) {
          KeyCode = SupportData.AllFunctionMapping[i].hid;
          break;
        }
      }
      var iDelay = 1;
      if (iEvent < DataEvent.length - 1) {
        iDelay = DataEvent[iEvent + 1].times - DataEvent[iEvent].times > 0 ? DataEvent[iEvent + 1].times - DataEvent[iEvent].times : 1;
      }
      BufferKey[iEvent * 3 + 0] = iDelay >> 8;
      if (DataEvent[iEvent].keydown)
        BufferKey[iEvent * 3 + 0] += 128;
      BufferKey[iEvent * 3 + 1] = iDelay & 255;
      BufferKey[iEvent * 3 + 2] = KeyCode;
    }
    return BufferKey;
  }
  SetKeyFunction(dev, ObjKeyAssign, callback) {
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer = this.KeyAssignToData(dev, KeyAssignData);
    var Obj1 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer
    };
    if (ObjKeyAssign.assignedKnob != void 0) {
      this.KnobAssignToData(dev, ObjKeyAssign.assignedKnob, DataBuffer);
    }
    var DataBuffer2 = this.MacroTypeToData(dev, KeyAssignData);
    var Obj2 = {
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer2
    };
    var KeyAssignData = ObjKeyAssign.KeyAssignData;
    var DataBuffer3 = this.KeyAltGrToData(dev, KeyAssignData);
    ({
      iProfile: ObjKeyAssign.iProfile,
      iLayerIndex: ObjKeyAssign.iLayerIndex,
      DataBuffer: DataBuffer3
    });
    this.SendButtonMatrix2Device(dev, Obj1).then(() => {
      this.SendMacroType2Device(dev, Obj2).then(() => {
        callback("SetKeyFunction Done");
      });
    });
  }
  SendAlrGR2Device(dev, Obj, callback) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 9;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    this.SetFeatureReport(dev, Data, 150).then(function() {
      callback();
    });
  }
  SendButtonMatrix2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 3;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    for (var i = 0; i < DataBuffer.length; i++)
      Data[8 + i] = DataBuffer[i];
    return new Promise((resolve) => {
      this.SetFeatureReport(dev, Data, 150).then(function() {
        resolve("SendButtonMatrix2Device Done");
      });
    });
  }
  SendMacroType2Device(dev, Obj) {
    var iProfile = Obj.iProfile;
    var iLayerIndex = Obj.iLayerIndex;
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    Data[0] = 7;
    Data[1] = 4;
    Data[2] = iProfile + 1;
    Data[3] = iLayerIndex + 1;
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      if (DataBuffer == false) {
        resolve("SendButtonMatrix2Device Done");
      } else {
        for (var i = 0; i < DataBuffer.length; i++) {
          Data[8 + i] = DataBuffer[i];
        }
        this.SetFeatureReport(dev, Data, 150).then(function() {
          resolve("SendButtonMatrix2Device Done");
        });
      }
    });
  }
  MacroTypeToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    var iMacroCount = 0;
    var arrMacroType = [1, 0, 65535];
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "MacroFunction":
          DataBuffer[iIndex * 2] = arrMacroType[Temp_BtnList.macro_RepeatType] >> 8;
          DataBuffer[iIndex * 2 + 1] = arrMacroType[Temp_BtnList.macro_RepeatType] & 255;
          iMacroCount++;
          break;
      }
    }
    if (iMacroCount <= 0)
      return false;
    else
      return DataBuffer;
  }
  KeyAltGrToData(dev, KeyAssignData) {
    var DataBuffer = Buffer.alloc(264);
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var arrcomplex = [false, false, Temp_BtnList.AltGr];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
      }
    }
    return DataBuffer;
  }
  KeyAssignToData(dev, KeyAssignData) {
    var DataBuffer = JSON.parse(JSON.stringify(dev.Buttoninfo_Default));
    for (var i = 0; i < KeyAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      var Temp_BtnList = KeyAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          var arrcomplex = [Temp_BtnList.Ctrl, Temp_BtnList.Shift, Temp_BtnList.Alt, Temp_BtnList.Windows, Temp_BtnList.hasFNStatus];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0 || Temp_BtnList.AltGr) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
        case "MOUSE":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 9;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "KEYBOARD":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 8;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "Multimedia":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 3;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          break;
        case "LaunchProgram":
        case "LaunchWebsite":
          DataBuffer[iIndex] = 7;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
        case "Shortcuts":
          var KeyCode = 0;
          var KeyValue;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              KeyValue = SupportData.AllFunctionMapping[iMap].value;
              break;
            }
          }
          if (KeyValue == "Explorer") {
            var bycomplex = 0;
            bycomplex |= Math.pow(2, 3);
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
            DataBuffer[dev.KeyMatrixLength + iIndex] = 8;
          } else {
            DataBuffer[iIndex] = 3;
            DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          }
          break;
        case "MacroFunction":
          DataBuffer[iIndex] = 5;
          DataBuffer[dev.KeyMatrixLength + iIndex] = parseInt(Temp_BtnList.macro_Data.value);
          break;
        case "Disable":
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
      }
    }
    return DataBuffer;
  }
  KnobAssignToData(dev, KnobAssignData, DataBuffer) {
    var Matrix_Knob = ["Knobleft", "KnobRight"];
    var KnobFuncMapping = [
      { BindCodeName: "Scroll_APP", HidType: 228, HidData: 41 },
      //Scroll Through Active Applications:ALT+ESC
      { BindCodeName: "brightness_UP", HidType: 240, HidData: 26 },
      //brightness UP:FN+W
      { BindCodeName: "brightness_DOWN", HidType: 240, HidData: 22 },
      //brightness DOWN:FN+S
      { BindCodeName: "Windows_Zoom_In", HidType: 225, HidData: 46 },
      //Windows Zoom In:Ctrl+"+"
      { BindCodeName: "Windows_Zoom_Out", HidType: 225, HidData: 45 },
      //Windows Zoom In:Ctrl+"-"
      { BindCodeName: "Video_Scrub_Forward", HidType: 225, HidData: 79 },
      //Video Scrubbing Forward:Ctrl+Right
      { BindCodeName: "Video_Scrub_Backward", HidType: 225, HidData: 80 },
      //Video Scrubbing Back:Ctrl+Left
      { BindCodeName: "Mouse_Scroll_Up", HidType: 9, HidData: 6 },
      //Mouse_Scroll_Up
      { BindCodeName: "Mouse_Scroll_Down", HidType: 9, HidData: 7 },
      //Mouse_Scroll_Down
      { BindCodeName: "Mouse_Scroll_Right", HidType: 9, HidData: 8 },
      //Mouse_Scroll_Right
      { BindCodeName: "Mouse_Scroll_Left", HidType: 9, HidData: 9 },
      //Mouse_Scroll_Left
      { BindCodeName: "Mouse_Movement_Up", HidType: 11, HidData: 1 },
      //Mouse_Movement_Up
      { BindCodeName: "Mouse_Movement_Down", HidType: 11, HidData: 2 },
      //Mouse_Movement_Down
      { BindCodeName: "Mouse_Movement_Left", HidType: 11, HidData: 3 },
      //Mouse_Movement_Left
      { BindCodeName: "Mouse_Movement_Right", HidType: 11, HidData: 4 },
      //Mouse_Movement_Right
      { BindCodeName: "Audio_Device_Prev", HidType: 7, HidData: 15 },
      //Audio_Device_Prev(LaunchProgram Function)
      { BindCodeName: "Audio_Device_Next", HidType: 7, HidData: 15 },
      //Audio_Device_Next(LaunchProgram Function)
      { BindCodeName: "Microphone_Down", HidType: 7, HidData: 15 },
      //Microphone_Down(LaunchProgram Function)
      { BindCodeName: "Microphone_Up", HidType: 7, HidData: 15 }
      //Microphone_Up(LaunchProgram Function)
    ];
    for (var i = 0; i < KnobAssignData.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(Matrix_Knob[i]);
      var Temp_BtnList = KnobAssignData[i];
      switch (Temp_BtnList.recordBindCodeType) {
        case "SingleKey":
          var KeyCode = 0;
          for (var iMap = 0; iMap < SupportData.AllFunctionMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == SupportData.AllFunctionMapping[iMap].code) {
              KeyCode = SupportData.AllFunctionMapping[iMap].hid;
              break;
            }
          }
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = KeyCode;
          var arrcomplex = [Temp_BtnList.Ctrl, Temp_BtnList.Shift, Temp_BtnList.Alt, Temp_BtnList.Windows, Temp_BtnList.hasFNStatus];
          var bycomplex = 0;
          for (var icomplex = 0; icomplex < arrcomplex.length; icomplex++) {
            if (arrcomplex[icomplex] == true)
              bycomplex |= Math.pow(2, icomplex);
          }
          if (bycomplex > 0 || Temp_BtnList.AltGr) {
            DataBuffer[iIndex] = 224;
            DataBuffer[iIndex] += bycomplex;
          }
          break;
        case "Shortcuts":
          for (var iMap = 0; iMap < KnobFuncMapping.length; iMap++) {
            if (Temp_BtnList.recordBindCodeName == KnobFuncMapping[iMap].BindCodeName) {
              DataBuffer[iIndex] = KnobFuncMapping[iMap].HidType;
              DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData;
              if (KnobFuncMapping[iMap].HidType == 7) {
                DataBuffer[dev.KeyMatrixLength + iIndex] = KnobFuncMapping[iMap].HidData + i;
              }
              break;
            }
          }
          break;
        case "Disable":
          DataBuffer[iIndex] = 1;
          DataBuffer[dev.KeyMatrixLength + iIndex] = 0;
          break;
      }
    }
    return DataBuffer;
  }
  SetLEDEffect(dev, Obj, callback) {
    env.log("valueASeries", "SetLEDEffect", "Begin");
    try {
      var ObjTypeData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      var ObjEffectData = { iProfile: Obj.iProfile, iLayerIndex: Obj.iLayerIndex, Data: Obj.LightingData };
      this.SetLEDTypeToDevice(dev, ObjTypeData, () => {
        this.SetLEDEffectToDevice(dev, ObjEffectData, () => {
          var ObjLayoutData = {
            iProfile: Obj.iProfile,
            iLayerIndex: Obj.iLayerIndex,
            PerKeyData: Obj.LightingPerKeyData
            //Perkeylist:T_data
          };
          callback("SetLEDEffect Done");
        });
      });
    } catch (e) {
      env.log("valueASeries", "SetLEDEffect", `Error:${e}`);
    }
  }
  SetLEDEffectToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      Data[0] = 7;
      Data[1] = 2;
      Data[2] = iEffect;
      Data[8] = 20 - ObjEffectData.Data.speed * 19 / 100;
      Data[9] = ObjEffectData.Data.brightness * 20 / 100;
      if (ObjEffectData.Data.Multicolor_Enable == true) {
        Data[10] = ObjEffectData.Data.Multicolor;
      }
      if (iEffect == 13 || ObjEffectData.Data.PointEffectName == "Rainbow") {
        Data[12] = 1;
      }
      Data[15] = ObjEffectData.Data.colorPickerValue[0];
      Data[16] = ObjEffectData.Data.colorPickerValue[1];
      Data[17] = ObjEffectData.Data.colorPickerValue[2];
      Data[18] = ObjEffectData.Data.brightness * 20 / 100;
      this.SetFeatureReport(dev, Data, 100).then(function() {
        callback("SetLEDEffectToDevice Done");
      });
    } catch (e) {
      env.log("valueASeries", "SetLEDEffectToDevice", `Error:${e}`);
    }
  }
  SetLEDTypeToDevice(dev, ObjEffectData, callback) {
    try {
      var Data = Buffer.alloc(264);
      var iEffect = this.arrLEDType.indexOf(ObjEffectData.Data.value);
      if (iEffect == -1)
        iEffect = 0;
      Data[0] = 7;
      Data[1] = 7;
      Data[2] = ObjEffectData.iProfile + 1;
      Data[3] = ObjEffectData.iLayerIndex + 1;
      Data[4] = iEffect;
      Data[5] = 0;
      Data[6] = 1;
      Data[7] = dev.deviceData.sideLightSwitch ? 0 : 1;
      if (ObjEffectData.Data.inputLatency != void 0) {
        Data[10] = ObjEffectData.Data.inputLatency;
      }
      Data[11] = 255;
      this.SetFeatureReport(dev, Data, 100).then(function() {
        callback("SetLEDTypeToDevice Done");
      });
    } catch (e) {
      env.log("valueASeries", "SetLEDTypeToDevice", `Error:${e}`);
    }
  }
  SetLEDLayoutToDevice(dev, ObjLayoutData, callback) {
    try {
      var PerKeyContent = this.SearchPerKeyContent(dev, ObjLayoutData);
      if (PerKeyContent == void 0) {
        callback("SetLEDLayoutToDevice Failed");
        env.log("valueASeries", "SetLEDEffectToDevice", "Failed");
        return;
      }
      var Data = Buffer.alloc(264);
      var DataBuffer = this.LayoutToData(dev, ObjLayoutData);
      Data[0] = 7;
      Data[1] = 6;
      Data[2] = ObjLayoutData.iProfile + 1;
      Data[3] = ObjLayoutData.iLayerIndex + 1;
      var brightness = PerKeyContent.lightData.brightness * 20 / 100;
      Data[5] = brightness;
      var iLayerCount;
      iLayerCount = 3;
      const SetAp = (j) => {
        if (j < iLayerCount) {
          Data[4] = j;
          for (var k = 0; k < 220; k++)
            Data[8 + k] = DataBuffer[220 * j + k];
          this.SetFeatureReport(dev, Data, 100).then(function() {
            SetAp(j + 1);
          });
        } else {
          callback("SetLEDLayoutToDevice Done");
        }
      };
      SetAp(0);
    } catch (e) {
      env.log("valueASeries", "SetLEDLayoutToDevice", `Error:${e}`);
      callback("SetLEDLayoutToDevice Done");
    }
  }
  LayoutToData(dev, ObjLayoutData) {
    var DataBuffer = Buffer.alloc(1e3);
    var iPerKeyIndex = ObjLayoutData.PerKeyData.value;
    var PerKeyContent;
    for (var i = 0; i < ObjLayoutData.Perkeylist.length; i++) {
      if (iPerKeyIndex == parseInt(ObjLayoutData.Perkeylist[i].value) && dev.BaseInfo.SN == ObjLayoutData.Perkeylist[i].SN) {
        PerKeyContent = ObjLayoutData.Perkeylist[i].content;
        break;
      }
    }
    if (PerKeyContent == void 0)
      return DataBuffer;
    for (var i = 0; i < PerKeyContent.AllBlockColor.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      var RgbData = PerKeyContent.AllBlockColor[i].color;
      var visible = 255;
      RgbData = PerKeyContent.AllBlockColor[i].color;
      if (PerKeyContent.AllBlockColor[i].breathing && PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 254;
      } else if (PerKeyContent.AllBlockColor[i].clearStatus) {
        visible = 255;
      } else {
        visible = 0;
      }
      DataBuffer[iIndex * 5 + 0] = visible;
      DataBuffer[iIndex * 5 + 1] = iIndex;
      DataBuffer[iIndex * 5 + 2] = RgbData[0];
      DataBuffer[iIndex * 5 + 3] = RgbData[1];
      DataBuffer[iIndex * 5 + 4] = RgbData[2];
    }
    if (PerKeyContent.lightData.sideLightColor[3] != void 0) {
      var RgbData = PerKeyContent.lightData.sideLightColor;
      var bBreathing = RgbData[3] ? PerKeyContent.lightData.sideLightSync : false;
      for (var iside = 0; iside < this.Matrix_SideLED.length; iside++) {
        var visible = 255;
        if (parseInt(RgbData[3]) == 0) {
          visible = 0;
        } else if (bBreathing) {
          visible = 254;
        }
        var iIndexside = dev.Matrix_LEDCode_GMMK.indexOf(this.Matrix_SideLED[iside]);
        DataBuffer[iIndexside * 5 + 0] = visible;
        DataBuffer[iIndexside * 5 + 1] = iIndexside;
        DataBuffer[iIndexside * 5 + 2] = RgbData[0];
        DataBuffer[iIndexside * 5 + 3] = RgbData[1];
        DataBuffer[iIndexside * 5 + 4] = RgbData[2];
      }
    }
    return DataBuffer;
  }
  //
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData;
        if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Bluetooth") {
          var DataBuffer = Buffer.alloc(264);
          DataBuffer[0] = 240;
          DataBuffer[1] = 241;
          DataBuffer[2] = 242;
          DataBuffer[3] = 243;
          for (var i = 0; i < buf.length; i++) {
            DataBuffer[4 + i] = buf[i];
          }
          const SetBluetooth = (j) => {
            if (j < 4) {
              var Data = Buffer.alloc(264);
              Data[0] = 6;
              Data[1] = 85;
              for (var i2 = 0; i2 < 64; i2++) {
                Data[2 + i2] = DataBuffer[64 * j + i2];
              }
              var rtnData2 = this.hid.SetHidWrite(dev.BaseInfo.DeviceId, 6, 65, Data);
              setTimeout(function() {
                SetBluetooth(j + 1);
              }, 100);
            } else {
              resolve(0);
            }
          };
          SetBluetooth(0);
        } else if (dev.BaseInfo.StateType[dev.BaseInfo.StateID] == "Dongle") {
          var DataBuffer = Buffer.alloc(264);
          DataBuffer[0] = 224;
          DataBuffer[1] = 225;
          DataBuffer[2] = 226;
          DataBuffer[3] = 227;
          for (var i = 0; i < buf.length; i++) {
            DataBuffer[4 + i] = buf[i];
          }
          var DataCount = 0;
          const SetDongle = (j) => {
            if (j < 4) {
              var DongleLength = j == 0 ? 64 : 63;
              var StartByte = j == 0 ? 1 : 2;
              this.GetDongleStatus(dev, (rtn) => {
                if (rtn) {
                  var Data = Buffer.alloc(264);
                  for (var i2 = 0; i2 < DongleLength; i2++) {
                    Data[StartByte + i2] = DataBuffer[DataCount];
                    DataCount++;
                  }
                  var rtnData2 = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, Data);
                  setTimeout(function() {
                    SetDongle(j + 1);
                  }, iSleep);
                } else {
                  resolve(0);
                }
              });
            } else {
              resolve(0);
            }
          };
          SetDongle(0);
        } else {
          rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 7, 264, buf);
          setTimeout(function() {
            if (rtnData < 8)
              env.log("Gmmk3Series SetFeatureReport", "SetFeatureReport(error) return data length : ", JSON.stringify(rtnData));
            resolve(rtnData);
          }, iSleep);
        }
      } catch (err) {
        env.log("Gmmk3Series Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 7, 264);
        setTimeout(function() {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  GetDongleStatus(dev, callback) {
    try {
      var Data = Buffer.alloc(65);
      Data[1] = 247;
      var WaitCount = 5;
      const SetCheckStatus = (iTimes) => {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, Data);
        setTimeout(() => {
          var rtnData1 = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, 0, 65, Data);
          if (iTimes < WaitCount) {
            setTimeout(function() {
              if (rtnData1[5] == 1) {
                callback(true);
              } else {
                env.log("Gmmk3Series", "GetDongleStatus", "waitForPair- times:" + iTimes);
                SetCheckStatus(iTimes + 1);
              }
            }, 15);
          } else {
            callback(false);
          }
        }, 10);
      };
      SetCheckStatus(0);
    } catch (err) {
      env.log("DeviceApi Error", "GetDongleStatus", `ex:${err.message}`);
      callback(err);
    }
  }
  ////////////////////RGB SYNC////////////////////////////
  //#region RGBSYNC
  SetLEDMatrix(dev, Obj) {
    var DataBuffer = Buffer.alloc(512);
    if (dev.m_bSetHWDevice || !dev.m_bSetSyncEffect) {
      return;
    }
    for (var i = 0; i < dev.Matrix_KEYButtons.length; i++) {
      var iIndex = dev.Matrix_LEDCode_GMMK.indexOf(dev.Matrix_KEYButtons[i]);
      DataBuffer[0 + iIndex] = Obj.Buffer[i][0];
      DataBuffer[140 + iIndex] = Obj.Buffer[i][1];
      DataBuffer[280 + iIndex] = Obj.Buffer[i][2];
    }
    var Obj3 = {
      DataBuffer
    };
    this.SendLEDData2Device(dev, Obj3).then(function() {
    });
  }
  SendLEDData2Device(dev, Obj) {
    var Data = Buffer.alloc(264);
    var DataBuffer = Obj.DataBuffer;
    return new Promise((resolve) => {
      const SetAp = (j) => {
        if (j < 3) {
          Data = Buffer.alloc(264);
          Data[0] = 7;
          Data[1] = 16;
          Data[2] = j + 1;
          for (var i = 0; i < 140; i++)
            Data[8 + i] = DataBuffer[140 * j + i];
          this.SetFeatureReport(dev, Data, 5).then(() => {
            SetAp(j + 1);
          });
        } else {
          resolve();
        }
      };
      SetAp(0);
    });
  }
  //#endregion RGBSYNC
}
module.exports = Gmmk3Series;
class DeviceData {
  BaseInfo = {};
  SeriesInstance;
  deviceData;
}
class DeviceService extends EventEmitter {
  static #instance;
  nedbObj;
  SupportDevice;
  AllDevices;
  hid;
  AudioSession;
  //device instance
  ModelOSeries;
  ModelOV2Series;
  ModelISeries;
  CommonMouseSeries;
  DockSeries;
  RGBvalueJSeries;
  GmmkSeries;
  Gmmk3Series;
  GmmkNumpadSeries;
  ModelOWiredSeries;
  ModelOV2WiredSeries;
  valueC;
  SetPluginDB = false;
  ObjHotPlug = {};
  arrObjHotPlug = [];
  constructor() {
    env.log("DeviceService", "DeviceService", "begin");
    try {
      super();
      this.nedbObj = AppDB.getInstance();
      this.SupportDevice = [];
      this.AllDevices = /* @__PURE__ */ new Map();
      this.hid = HID.getInstance();
      this.AudioSession = FuncAudioSession.getInstance();
      this.SetPluginDB = false;
      this.ObjHotPlug = {};
      this.arrObjHotPlug = [];
    } catch (e) {
      env.log("ERROR", "DeviceService", e);
    }
  }
  static getInstance() {
    if (this.#instance) {
      env.log("DeviceService", "getInstance", `Get exist DeviceService() INSTANCE`);
      return this.#instance;
    } else {
      env.log("DeviceService", "getInstance", `New DeviceService() INSTANCE`);
      this.#instance = new DeviceService();
      return this.#instance;
    }
  }
  /**
   * Device sends a message back to the App
   * @param {*} Obj
   */
  OnDeviceMessage(Obj) {
    if (Obj.SN != void 0) {
      var dev = this.AllDevices.get(Obj.SN);
      if (Obj.Func == "SwitchKeyboardProfile" && global.ChangeProfileLayerFlag == false) {
        env.log("DeviceService", "OnDeviceMessage-SwitchKeyboardProfile", Obj.Updown);
        this.ChangeKeyboardProfileLayer(1, Obj.Updown);
      } else if (Obj.Func == "SwitchKeyboardLayer" && global.ChangeProfileLayerFlag == false) {
        env.log("DeviceService", "OnDeviceMessage-SwitchKeyboardLayer", Obj.Updown);
        this.ChangeKeyboardProfileLayer(2, Obj.Updown);
      } else if (Obj.Func == "GetBatteryStats") {
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
          if (this.AllDevices.has(sn)) {
            var devDetect = this.AllDevices.get(sn);
            if (devDetect.BaseInfo.routerID == "DockSeries") {
              devDetect.SeriesInstance["SendBatteryValue"](devDetect, Obj.Param, function() {
              });
            }
          }
        }
        this.emit(EventTypes.ProtocolMessage, Obj);
      } else if (Obj.Func == "DockedCharging") {
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
          if (this.AllDevices.has(sn)) {
            var devDetect = this.AllDevices.get(sn);
            if (devDetect.BaseInfo.SN == Obj.Param.SN) {
              devDetect.SeriesInstance["DockedCharging"](devDetect, Obj.Param, function() {
              });
            }
          }
        }
      } else if (Obj.Func == "SendDisconnected") {
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
          if (this.AllDevices.has(sn)) {
            var devDetect = this.AllDevices.get(sn);
            if (devDetect.BaseInfo.routerID == "DockSeries") {
              devDetect.SeriesInstance["SendDisconnected"](devDetect, Obj.Param, function() {
              });
            }
          }
        }
      } else if (Obj.Func == "RefreshBatteryStats") {
        if (this.AllDevices.has(Obj.SN)) {
          var devDetect = this.AllDevices.get(Obj.SN);
          this[dev.BaseInfo.routerID].GetBatteryStats(dev, 0, function() {
          });
        }
      } else {
        this.emit(EventTypes.ProtocolMessage, Obj);
      }
    }
  }
  /**
   * Receive messages from the front-end
   * @param {*} Obj
   * @param {*} callback
   */
  async RunFunction(Obj, callback) {
    if (env.BuiltType == 1) {
      if (Obj.Func != FuncName.GetAudioSession) {
        callback();
        return;
      }
    }
    try {
      if (this.AllDevices.size <= 0)
        throw new Error("Please initDevice first (AllDevices are empty)");
      if (!this.AllDevices.has(Obj.SN))
        throw new Error(`No device with SN ${Obj.SN} in AllDevices`);
      const lookupDevice = this.AllDevices.get(Obj.SN);
      const dev = Object.assign(lookupDevice, Obj.Param.device);
      delete Obj.Param.device;
      const devfun = lookupDevice.SeriesInstance[Obj.Func];
      if (devfun === void 0)
        throw new Error(`Error: device's SeriesInstance does not have ${Obj.Func}`);
      await lookupDevice.SeriesInstance[Obj.Func](dev, Obj.Param, callback);
    } catch (e) {
      env.log("DeviceService", "RunFunction", `Error ${e}`);
    }
  }
  NumTo16Decimal(rgb) {
    return Number(rgb).toString(16).toUpperCase().padStart(4, "0");
  }
  HIDEP2DataFromDevice(Obj, Obj2) {
    try {
      if (Obj[0] == 6 && Obj[1] == 246 && Obj[2] == 0) {
        return;
      }
      if (env.BuiltType == 1)
        return;
      var EP2Array = Obj;
      var DeviceInfo = Obj2;
      if (DeviceInfo.vid != void 0 && DeviceInfo.pid != void 0) {
        var SN;
        for (var i = 0; i < this.SupportDevice.length; i++) {
          for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
            if (this.SupportDevice[i].vid[iState] == DeviceInfo.vid && this.SupportDevice[i].pid[iState] == DeviceInfo.pid) {
              SN = "0x" + this.NumTo16Decimal(this.SupportDevice[i].vid[0]) + "0x" + this.NumTo16Decimal(this.SupportDevice[i].pid[0]);
              break;
            }
          }
        }
        var dev = this.AllDevices.get(SN);
        if (dev.SeriesInstance === void 0)
          return;
        else {
          var devfun = dev.SeriesInstance["HIDEP2Data"];
          if (devfun === void 0) {
            env.log("DeviceService", "HIDEP2DataFromDevice", `${Obj.Func}`);
            return;
          }
          dev.SeriesInstance["HIDEP2Data"](dev, EP2Array);
        }
      }
      return;
    } catch (e) {
      env.log("DeviceService", "HIDEP2DataFromDevice", `Error ${e}`);
    }
  }
  /**
   * Init All Device
   */
  initDevice() {
    env.log("DeviceService", "initDevice", "begin");
    this.hid.SetDeviceCallbackFunc(this.HIDEP2DataFromDevice.bind(this));
    var filterDevice = [];
    return new Promise((resolve, reject) => {
      this.GetSupportDevice(() => {
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var deviceresult = 0;
          var StateID = -1;
          var EnableStates = [];
          for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
            var result;
            for (let index = 0; index < this.SupportDevice[i].set.length; index++) {
              result = this.hid.FindDevice(
                this.SupportDevice[i].set[index].usagepage,
                this.SupportDevice[i].set[index].usage,
                this.SupportDevice[i].vid[iState],
                this.SupportDevice[i].pid[iState]
              );
              if (result != 0)
                break;
            }
            if (result != 0) {
              var csCallback = "FindDevice-" + this.SupportDevice[i].devicename + " : ";
              env.log("DeviceService", csCallback, "Found-" + result);
              EnableStates.push(iState);
              if (deviceresult == 0) {
                deviceresult = result;
                StateID = iState;
              }
            }
          }
          if (deviceresult != 0 || env.BuiltType == 1) {
            let FakeDeviceFlag = false;
            if (env.BuiltType == 1) {
              for (let j = 0; j < FakeDevice.length; j++) {
                if (this.SupportDevice[i].vid[0] == FakeDevice[j].vid[0] && this.SupportDevice[i].pid[0] == FakeDevice[j].pid[0]) {
                  FakeDeviceFlag = true;
                  StateID = FakeDevice[j].StateID;
                }
              }
            }
            if (env.BuiltType == 1 && !FakeDeviceFlag)
              continue;
            var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
            var dev = {};
            dev.BaseInfo = this.SupportDevice[i];
            dev.BaseInfo.DeviceId = deviceresult;
            dev.BaseInfo.StateID = StateID;
            dev.BaseInfo.SN = sn;
            dev.BaseInfo.StateArray = [];
            for (let index = 0; index < EnableStates.length; index++) {
              dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType[EnableStates[index]]);
            }
            filterDevice.push(dev);
            if (env.isWindows) {
              for (let index = 0; index < this.SupportDevice[i].get.length; index++) {
                var getEndpoint = this.SupportDevice[i].get[index];
                var csCallback = "DeviceDataCallback-" + index + "index : " + index;
                var rtn2 = this.hid.DeviceDataCallback(
                  getEndpoint.usagepage,
                  getEndpoint.usage,
                  this.SupportDevice[i].vid[StateID],
                  this.SupportDevice[i].pid[StateID]
                );
                env.log("initDevice", csCallback, rtn2);
              }
            }
          }
        }
        filterDevice.reduce((sequence, dev2) => {
          return sequence.then(() => {
            this.AllDevices.set(dev2.BaseInfo.SN, dev2);
            return;
          }).then(() => {
            if (dev2.BaseInfo.StateID == 255) {
              return;
            } else {
              return this.GetDeviceInst(dev2);
            }
          }).catch((e) => {
            env.log("DeviceService", "initDevice", `Error:${e}`);
          });
        }, Promise.resolve()).then(() => {
          return this.SavePluginDevice();
        }).then(() => {
          resolve();
        }).catch((e) => {
          env.log("DeviceService", "initDevice", `Error:${e}`);
        });
      });
    });
  }
  /**
   * Init All Device
   */
  initDevicebySN(ObjSN, callback) {
    env.log("DeviceService", "initDevicebySN", "begin");
    this.GetSupportDevice(() => {
      var DeviceID = 0;
      var EnableStates = [];
      var deviceresult;
      var StateID;
      for (var i = 0; i < this.SupportDevice.length; i++) {
        deviceresult = 0;
        StateID = -1;
        var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
        if (ObjSN == sn) {
          DeviceID = i;
          break;
        }
      }
      for (var iState = 0; iState < this.SupportDevice[DeviceID].pid.length; iState++) {
        var result;
        for (let index = 0; index < this.SupportDevice[DeviceID].set.length; index++) {
          result = this.hid.FindDevice(
            this.SupportDevice[DeviceID].set[index].usagepage,
            this.SupportDevice[DeviceID].set[index].usage,
            this.SupportDevice[DeviceID].vid[iState],
            this.SupportDevice[DeviceID].pid[iState]
          );
          if (result != 0)
            break;
        }
        if (result != 0) {
          env.log("DeviceService", "FindDevice", "begin");
          EnableStates.push(iState);
          if (deviceresult == 0) {
            deviceresult = result;
            StateID = iState;
          }
        }
      }
      var devDetect = new DeviceData();
      if (deviceresult != 0 || env.BuiltType == 1) {
        if (env.isWindows) {
          for (let index = 0; index < this.SupportDevice[i].get.length; index++) {
            var getEndpoint = this.SupportDevice[i].get[index];
            var csCallback = "DeviceDataCallback- " + index + " : ";
            var rtn = this.hid.DeviceDataCallback(
              getEndpoint.usagepage,
              getEndpoint.usage,
              this.SupportDevice[i].vid[StateID],
              this.SupportDevice[i].pid[StateID]
            );
            env.log("initDevice", csCallback, rtn);
          }
        }
        if (this.AllDevices.has(ObjSN)) {
          devDetect = this.AllDevices.get(ObjSN);
          devDetect.BaseInfo.DeviceId = deviceresult;
          devDetect.BaseInfo.StateID = StateID;
          devDetect.BaseInfo.StateArray = [];
          for (let index = 0; index < EnableStates.length; index++) {
            devDetect.BaseInfo.StateArray.push(devDetect.BaseInfo.StateType[EnableStates[index]]);
          }
          devDetect.SeriesInstance["InitialDevice"](devDetect, 0, () => {
            devDetect.SeriesInstance["ReadFWVersion"](devDetect, 0, () => {
              this.SavePluginDevice();
              callback(true);
            });
          });
        } else {
          devDetect.BaseInfo = this.SupportDevice[DeviceID];
          devDetect.BaseInfo.SN = ObjSN;
          devDetect.BaseInfo.DeviceId = deviceresult;
          devDetect.BaseInfo.StateID = StateID;
          devDetect.BaseInfo.StateArray = [];
          for (let index = 0; index < EnableStates.length; index++) {
            devDetect.BaseInfo.StateArray.push(devDetect.BaseInfo.StateType[EnableStates[index]]);
          }
          this.AllDevices.set(ObjSN, devDetect);
          this.GetDeviceInst(devDetect).then(() => {
            this.SavePluginDevice();
            callback(true);
          });
        }
      } else {
        callback(false);
      }
    });
  }
  RefreshAllDevices() {
    for (var val of this.AllDevices.values()) {
      var result;
      for (var iState = 0; iState < val.BaseInfo.pid.length; iState++) {
        for (let index = 0; index < val.BaseInfo.set.length; index++) {
          result = this.hid.FindDevice(
            val.BaseInfo.set[index].usagepage,
            val.BaseInfo.set[index].usage,
            val.BaseInfo.vid[iState],
            val.BaseInfo.pid[iState]
          );
          if (result != 0)
            break;
        }
        if (result != 0)
          break;
      }
      if (result == 0) {
        this.AllDevices.delete(val.BaseInfo.SN);
      }
    }
  }
  /**
   * Get Support Data From SupportDB
   */
  GetSupportDevice(callback) {
    if (this.SupportDevice.length == 0) {
      this.nedbObj.getSupportDevice().then((data) => {
        this.SupportDevice = data;
        callback();
      });
    } else {
      callback();
    }
  }
  /**
   * init device instance and register device event
   * @param {*} dev
   */
  GetDeviceInst(dev) {
    return new Promise((resolve, reject) => {
      env.log("DeviceService", "GetDeviceInst", "begin");
      var cmdInst = null;
      if (dev.BaseInfo.routerID == "ModelOSeries") {
        if (this.ModelOSeries == void 0) {
          this.ModelOSeries = ModelOSeries.getInstance(this.hid);
          this.ModelOSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.ModelOSeries;
      } else if (dev.BaseInfo.routerID == "ModelOV2Series") {
        if (this.ModelOV2Series == void 0) {
          this.ModelOV2Series = ModelOV2Series.getInstance(this.hid);
          this.ModelOV2Series.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.ModelOV2Series;
      } else if (dev.BaseInfo.routerID == "ModelISeries") {
        if (this.ModelISeries == void 0) {
          this.ModelISeries = ModelISeries.getInstance(this.hid);
          this.ModelISeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.ModelISeries;
      } else if (dev.BaseInfo.routerID == "CommonMouseSeries") {
        if (this.CommonMouseSeries == void 0) {
          this.CommonMouseSeries = CommonMouseSeries.getInstance(this.hid);
        }
        cmdInst = this.CommonMouseSeries;
      } else if (dev.BaseInfo.routerID == "GmmkSeries") {
        if (this.GmmkSeries == void 0) {
          this.GmmkSeries = GmmkSeries.getInstance(this.hid, this.AudioSession);
          this.GmmkSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.GmmkSeries;
      } else if (dev.BaseInfo.routerID == "Gmmk3Series") {
        if (this.Gmmk3Series == void 0) {
          this.Gmmk3Series = Gmmk3Series.getInstance(this.hid, this.AudioSession);
          this.Gmmk3Series.on(EventTypes.ProtocolMessage, this.OnDeviceMessage);
        }
        cmdInst = this.Gmmk3Series;
      } else if (dev.BaseInfo.routerID == "GmmkNumpadSeries") {
        if (this.GmmkNumpadSeries == void 0) {
          this.GmmkNumpadSeries = GmmkNumpadSeries.getInstance(this.hid, this.AudioSession);
          this.GmmkNumpadSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.GmmkNumpadSeries;
      } else if (dev.BaseInfo.routerID == "ModelOWiredSeries") {
        if (this.ModelOWiredSeries == void 0) {
          this.ModelOWiredSeries = ModelOWiredSeries.getInstance(this.hid);
          this.ModelOWiredSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.ModelOWiredSeries;
      } else if (dev.BaseInfo.routerID == "ModelOV2WiredSeries") {
        if (this.ModelOV2WiredSeries == void 0) {
          this.ModelOV2WiredSeries = ModelOV2WiredSeries.getInstance(this.hid);
          this.ModelOV2WiredSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.ModelOV2WiredSeries;
      } else if (dev.BaseInfo.routerID == "DockSeries") {
        if (this.DockSeries == void 0) {
          this.DockSeries = CommonDockSeries.getInstance(this.hid);
          this.DockSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.DockSeries;
      } else if (dev.BaseInfo.routerID == "valueC") {
        if (!this.valueC) {
          this.valueC = valueC.getInstance(this.hid);
          this.valueC.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.valueC;
      } else if (dev.BaseInfo.routerID == "RGBvalueJSeries") {
        if (!this.RGBvalueJSeries) {
          this.RGBvalueJSeries = RGBvalueJSeries.getInstance(this.hid);
          this.RGBvalueJSeries.on(EventTypes.ProtocolMessage, this.OnDeviceMessage.bind(this));
        }
        cmdInst = this.RGBvalueJSeries;
      } else {
        throw Error("Unknown device routerID!!!");
      }
      if (cmdInst != null) {
        dev.SeriesInstance = cmdInst;
        cmdInst.initDevice(dev).then(() => {
          if (env.BuiltType == 1) {
            resolve();
          } else {
            dev.SeriesInstance.ReadFWVersion(dev, 0, () => {
              dev.SeriesInstance.StartBatteryTimeout(dev, 0, function() {
              });
              resolve();
            });
          }
        }).catch((e) => {
          env.log("DeviceService", "GetDeviceInst", `err: ${e}`);
          resolve();
        });
      } else {
        env.log("DeviceService", "GetDeviceInst", "cmdInst undefined");
        resolve();
      }
    });
  }
  /**
   * Save plugin Device to PlugingDB
   */
  SavePluginDevice() {
    env.log("DeviceService", "SavePluginDevice", "SavePluginDevice");
    return new Promise((resolve, reject) => {
      let devList = {
        Keyboard: [],
        Mouse: [],
        valueE: [],
        MouseDock: []
      };
      for (var val of this.AllDevices.values()) {
        if (val.BaseInfo.ModelType == 1) {
          var Mouse2 = {
            vid: val.BaseInfo.vid,
            pid: val.BaseInfo.pid,
            devicename: val.BaseInfo.devicename,
            ModelType: val.BaseInfo.ModelType,
            SN: val.BaseInfo.SN,
            DeviceId: val.BaseInfo.DeviceId,
            StateID: val.BaseInfo.StateID,
            //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
            StateArray: val.BaseInfo.StateArray,
            version_Wired: val.BaseInfo.version_Wired,
            version_Wireless: val.BaseInfo.version_Wireless,
            pairingFlag: val.BaseInfo.pairingFlag
            // img: val.BaseInfo.img
          };
          devList.Mouse.push(Mouse2);
        } else if (val.BaseInfo.ModelType == 2) {
          var Keyboaerd = {
            vid: val.BaseInfo.vid,
            pid: val.BaseInfo.pid,
            devicename: val.BaseInfo.devicename,
            ModelType: val.BaseInfo.ModelType,
            SN: val.BaseInfo.SN,
            DeviceId: val.BaseInfo.DeviceId,
            StateID: val.BaseInfo.StateID,
            //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
            StateArray: val.BaseInfo.StateArray,
            version_Wired: val.BaseInfo.version_Wired,
            version_Wireless: val.BaseInfo.version_Wireless,
            pairingFlag: val.BaseInfo.pairingFlag
            // img: val.BaseInfo.img
          };
          devList.Keyboard.push(Keyboaerd);
        } else if (val.BaseInfo.ModelType == 3) {
          var valueE = {
            vid: val.BaseInfo.vid,
            pid: val.BaseInfo.pid,
            devicename: val.BaseInfo.devicename,
            ModelType: val.BaseInfo.ModelType,
            SN: val.BaseInfo.SN,
            DeviceId: val.BaseInfo.DeviceId,
            StateID: val.BaseInfo.StateID,
            //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
            StateArray: val.BaseInfo.StateArray,
            version_Wired: val.BaseInfo.version_Wired,
            version_Wireless: val.BaseInfo.version_Wireless,
            pairingFlag: val.BaseInfo.pairingFlag
            // img: val.BaseInfo.img
          };
          devList.valueE.push(valueE);
        } else if (val.BaseInfo.ModelType == 4) {
          var MouseDock = {
            vid: val.BaseInfo.vid,
            pid: val.BaseInfo.pid,
            devicename: val.BaseInfo.devicename,
            ModelType: val.BaseInfo.ModelType,
            SN: val.BaseInfo.SN,
            DeviceId: val.BaseInfo.DeviceId,
            StateID: val.BaseInfo.StateID,
            //StateType: val.BaseInfo.StateType[val.BaseInfo.StateID],
            StateArray: val.BaseInfo.StateArray,
            version_Wired: val.BaseInfo.version_Wired,
            version_Wireless: val.BaseInfo.version_Wireless,
            pairingFlag: val.BaseInfo.pairingFlag
          };
          devList.MouseDock.push(MouseDock);
        }
      }
      this.nedbObj.updateAllPluginDevice(devList).then(() => {
        setTimeout(() => {
          var Obj2 = {
            Type: FuncType.Device,
            Func: EventTypes.RefreshDevice,
            Param: ""
          };
          this.emit(EventTypes.ProtocolMessage, Obj2);
          resolve();
        }, 200);
      });
    });
  }
  /**
   * When device unplug, remove device from davice data
   */
  DeleteBTDevice() {
    for (var i = 0; i < this.SupportDevice.length; i++) {
      var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
      if (this.AllDevices.has(sn)) {
        var devDetect = this.AllDevices.get(sn);
        if (devDetect.BaseInfo.StateID == 255) {
          this.AllDevices.delete(sn);
        }
      }
    }
  }
  /**
   * Device plugin event
   * @param {*} obj
   */
  HotPlug(obj) {
    this.arrObjHotPlug.push(obj);
    var StateID = -1;
    for (var i = 0; i < this.SupportDevice.length; i++) {
      for (var iState = 0; iState < this.SupportDevice[i].pid.length; iState++) {
        if (parseInt(this.SupportDevice[i].vid[iState]) == obj.vid && parseInt(this.SupportDevice[i].pid[iState]) == obj.pid) {
          StateID = iState;
          this.SupportDevice[i].vid[StateID] + this.SupportDevice[i].pid[StateID];
          break;
        }
      }
    }
    if (StateID == -1) {
      return;
    }
    if (this.ObjHotPlug.vid == obj.vid && this.ObjHotPlug.pid == obj.pid) {
      return;
    }
    this.ObjHotPlug = JSON.parse(JSON.stringify(obj));
    env.log("DeviceService-HotPlug", "this.ObjHotPlug:", JSON.stringify(this.ObjHotPlug));
    try {
      setTimeout(() => {
        var indexHotPlug = 0;
        for (var i2 = 0; i2 < this.arrObjHotPlug.length; i2++) {
          if (this.arrObjHotPlug[i2].vid == this.ObjHotPlug.vid && this.arrObjHotPlug[i2].pid == this.ObjHotPlug.pid) {
            indexHotPlug = i2;
          }
        }
        var HotPlugstatus = this.arrObjHotPlug[indexHotPlug]?.status;
        this.arrObjHotPlug = [];
        env.log("DeviceService-HotPlug", "HotPlugstatus:", JSON.stringify(HotPlugstatus));
        var DeviceID = -1;
        var StateID2 = -1;
        env.log("DeviceService-HotPlug", "filter ObjHotPlug Device:", this.ObjHotPlug);
        if (HotPlugstatus == 1) {
          var deviceresult = 0;
          var EnableStates = [];
          for (var i2 = 0; i2 < this.SupportDevice.length; i2++) {
            for (var iState2 = 0; iState2 < this.SupportDevice[i2].pid.length; iState2++) {
              if (parseInt(this.SupportDevice[i2].vid[iState2]) == this.ObjHotPlug.vid && parseInt(this.SupportDevice[i2].pid[iState2]) == this.ObjHotPlug.pid) {
                DeviceID = i2;
                break;
              }
            }
          }
          if (DeviceID != -1) {
            for (var iState2 = 0; iState2 < this.SupportDevice[DeviceID].pid.length; iState2++) {
              var result;
              for (let index = 0; index < this.SupportDevice[DeviceID].set.length; index++) {
                result = this.hid.FindDevice(
                  this.SupportDevice[DeviceID].set[index].usagepage,
                  this.SupportDevice[DeviceID].set[index].usage,
                  this.SupportDevice[DeviceID].vid[iState2],
                  this.SupportDevice[DeviceID].pid[iState2]
                );
                if (result != 0 && StateID2 == -1) {
                  StateID2 = iState2;
                  deviceresult = result;
                  break;
                }
              }
              if (result != 0) {
                EnableStates.push(iState2);
                env.log(
                  "HotPlug-" + this.SupportDevice[DeviceID].devicename,
                  `State${iState2}-FindDevice result:`,
                  result
                );
              }
            }
          }
          if (deviceresult != 0) {
            for (let index = 0; index < this.SupportDevice[DeviceID].get.length; index++) {
              var getEndpoint = this.SupportDevice[DeviceID].get[index];
              var csCallback = "DeviceDataCallback- " + index + " : ";
              var rtn = this.hid.DeviceDataCallback(
                getEndpoint.usagepage,
                getEndpoint.usage,
                this.SupportDevice[DeviceID].vid[StateID2],
                this.SupportDevice[DeviceID].pid[StateID2]
              );
              env.log("DeviceService-HotPlug", csCallback, rtn);
            }
            var sn = this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];
            if (this.AllDevices.has(sn)) {
              var dev = this.AllDevices.get(sn);
              this[dev.BaseInfo.routerID]?.RefreshPlugDevice(dev, this.SupportDevice[DeviceID], () => {
                this.SavePluginDevice();
              });
            } else {
              var dev = new DeviceData();
              dev.BaseInfo = this.SupportDevice[DeviceID];
              dev.BaseInfo.SN = sn;
              dev.BaseInfo.DeviceId = deviceresult;
              dev.BaseInfo.StateID = StateID2;
              dev.BaseInfo.StateArray = [];
              for (let index = 0; index < EnableStates.length; index++) {
                dev.BaseInfo.StateArray.push(dev.BaseInfo.StateType[EnableStates[index]]);
              }
              this.AllDevices.set(sn, dev);
              this.GetDeviceInst(dev).then(() => {
                console.log("final");
                this.SavePluginDevice();
              });
            }
          }
        } else {
          var deviceresult = 0;
          for (var i2 = 0; i2 < this.SupportDevice.length; i2++) {
            for (var iState2 = 0; iState2 < this.SupportDevice[i2].pid.length; iState2++) {
              if (parseInt(this.SupportDevice[i2].vid[iState2]) == this.ObjHotPlug.vid && parseInt(this.SupportDevice[i2].pid[iState2]) == this.ObjHotPlug.pid) {
                StateID2 = iState2;
                DeviceID = i2;
                break;
              }
            }
          }
          if (StateID2 != -1) {
            var sn = this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];
            if (this.AllDevices.has(sn)) {
              var dev = this.AllDevices.get(sn);
              this[dev.BaseInfo.routerID]?.RefreshPlugDevice(
                dev,
                this.SupportDevice[DeviceID],
                (ObjResult) => {
                  if (ObjResult.Plug == true) {
                    StateID2 = ObjResult.StateID;
                    for (let index = 0; index < this.SupportDevice[DeviceID].get.length; index++) {
                      var getEndpoint2 = this.SupportDevice[DeviceID].get[index];
                      var csCallback2 = "DeviceDataCallback- " + index + " : ";
                      var rtn2 = this.hid.DeviceDataCallback(
                        getEndpoint2.usagepage,
                        getEndpoint2.usage,
                        this.SupportDevice[DeviceID].vid[StateID2],
                        this.SupportDevice[DeviceID].pid[StateID2]
                      );
                      env.log("DeviceService-HotPlug", csCallback2, rtn2);
                    }
                    this.SavePluginDevice();
                  } else {
                    var sn2 = this.SupportDevice[DeviceID].vid[0] + this.SupportDevice[DeviceID].pid[0];
                    this.AllDevices.forEach((dev2, devicesn) => {
                      if (sn2 == devicesn) {
                        this.AllDevices.delete(sn2);
                        this.SavePluginDevice();
                      }
                    });
                  }
                }
              );
            }
          }
        }
        this.ObjHotPlug = {};
      }, 100);
    } catch (e) {
      env.log("ERROR", "HotPlug:", e);
    }
  }
  /**
   * Change keyboard Profile
   * @param flag 1:Profile 2:Layer
   * @param updown 1:Up 2:Down
   */
  async ChangeKeyboardProfileLayer(flag, updown) {
    global.ChangeProfileLayerFlag = true;
    let i = 0;
    let length = this.MapArraylength(this.AllDevices);
    for (var val of this.AllDevices.values()) {
      var dev = this.AllDevices.get(val.BaseInfo.SN);
      if (val.BaseInfo.ModelType == 2 && flag == 1)
        await dev.SeriesInstance["ChangeProfile"](dev, updown);
      else if (val.BaseInfo.ModelType == 2 && flag == 2)
        await dev.SeriesInstance["ChangeLayer"](dev, updown);
      i++;
      if (i >= length)
        global.ChangeProfileLayerFlag = false;
    }
  }
  //Count Map Array length
  MapArraylength(x) {
    var len = 0;
    for (var count of x)
      len++;
    return len;
  }
  // //SwitchHotPlug
  // SwitchHotPlug(HotPlugFlag){
  //     for(var i = 0; i < this.SupportDevice.length; i++) {
  //         var sn = this.SupportDevice[i].vid[0]+this.SupportDevice[i].pid[0];
  //         if(this.AllDevices.has(sn)){
  //             var devDetect = this.AllDevices.get(sn);
  //             this.RefreshDeviceID(devDetect, HotPlugFlag,function () {});
  //         }
  //     }
  // }
  RefreshDeviceID(dev, Obj, callback) {
    if (Obj == true) {
      var result = 0;
      var StateID = 0;
      for (var iState = 0; iState < dev.BaseInfo.pid.length; iState++) {
        for (let index = 0; index < dev.BaseInfo.set.length; index++) {
          result = this.hid.FindDevice(
            dev.BaseInfo.set[index].usagepage,
            dev.BaseInfo.set[index].usage,
            dev.BaseInfo.vid[iState],
            dev.BaseInfo.pid[iState]
          );
          if (result != 0) {
            dev.BaseInfo.DeviceId = result;
            StateID = iState;
            break;
          }
        }
        if (result != 0)
          break;
      }
      if (result != 0) {
        if (env.isWindows) {
          for (let index = 0; index < dev.BaseInfo.get.length; index++) {
            var getEndpoint = dev.BaseInfo.get[index];
            var csCallback = "DeviceDataCallback- " + index + " : ";
            var rtn = this.hid.DeviceDataCallback(
              getEndpoint.usagepage,
              getEndpoint.usage,
              dev.BaseInfo.vid[StateID],
              dev.BaseInfo.pid[StateID]
            );
            env.log("RefreshDeviceID", csCallback, rtn);
          }
        }
      }
    }
    callback();
  }
  DeleteBatteryTimeBySN(sn) {
    if (this.AllDevices.has(sn)) {
      var dev = this.AllDevices.get(sn);
      if (dev.SeriesInstance === void 0)
        return;
      dev.SeriesInstance["DeleteBatteryTimeout"](dev, 0, function() {
      });
    }
  }
  StartBatteryTimeBySN(sn) {
    if (this.AllDevices.has(sn)) {
      var dev = this.AllDevices.get(sn);
      if (dev.SeriesInstance === void 0)
        return;
      dev.SeriesInstance["StartBatteryTimeout"](dev, 0, function() {
      });
    }
  }
  DonglePairing(sn) {
    if (this.AllDevices.has(sn)) {
      var dev = this.AllDevices.get(sn);
      if (dev.SeriesInstance === void 0)
        return;
      dev.SeriesInstance["DonglePairing"](dev, 0, function() {
      });
    }
  }
  //
  DeleteMacro(obj) {
    return new Promise((resolve, reject) => {
      for (var i = 0; i < this.SupportDevice.length; i++) {
        var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
        if (this.AllDevices.has(sn)) {
          var dev = this.AllDevices.get(sn);
          var iProfile;
          var ProfileData;
          var bDeleteMacro = false;
          var ObjKeyAssign;
          if (dev.BaseInfo.routerID == "ModelOSeries" || dev.BaseInfo.routerID == "ModelOV2Series" || dev.BaseInfo.routerID == "ModelISeries" || dev.BaseInfo.routerID == "ModelOWiredSeries") {
            iProfile = dev.deviceData.profileindex - 1;
            ProfileData = dev.deviceData.profile[iProfile];
            var arrKeyAssignData = ProfileData.keybinding;
            for (let iButton = 0; iButton < arrKeyAssignData.length; iButton++) {
              var KeyAssignData = arrKeyAssignData[iButton];
              if (KeyAssignData.group == 1) {
                if (KeyAssignData.function == obj.MacroValue) {
                  var defaultData = this.SupportDevice[i].defaultProfile[iProfile].keybinding[iButton];
                  arrKeyAssignData[iButton] = defaultData;
                  bDeleteMacro = true;
                }
              }
            }
            ObjKeyAssign = {
              iProfile,
              KeyAssignData: arrKeyAssignData
            };
          } else if (dev.BaseInfo.routerID == "GmmkSeries" || dev.BaseInfo.routerID == "GmmkNumpadSeries" || dev.BaseInfo.routerID == "Gmmk3Series") {
            iProfile = dev.deviceData.profileindex;
            var iLayerIndex = dev.deviceData.profileLayerIndex[iProfile];
            ProfileData = dev.deviceData.profileLayers[iProfile][iLayerIndex];
            var arrKeyAssignData = ProfileData.assignedKeyboardKeys[0];
            for (let iButton = 0; iButton < arrKeyAssignData.length; iButton++) {
              var KeyAssignData = arrKeyAssignData[iButton];
              if (KeyAssignData.recordBindCodeType == "MacroFunction" && KeyAssignData.macro_Data.value == obj.MacroValue) {
                var defaultData = this.SupportDevice[i].defaultProfile[iProfile].assignedKeyboardKeys[0][iButton];
                arrKeyAssignData[iButton] = defaultData;
                bDeleteMacro = true;
              }
            }
            ObjKeyAssign = {
              iProfile,
              iLayerIndex,
              KeyAssignData: arrKeyAssignData
            };
          } else {
            continue;
          }
          if (bDeleteMacro) {
            dev.SeriesInstance["SetKeyFunction"](dev, ObjKeyAssign, function() {
            });
            if (dev.BaseInfo.routerID == "GmmkSeries" || dev.BaseInfo.routerID == "Gmmk3Series") {
              dev.SeriesInstance["ChangeProfileID"](dev, iProfile, function() {
              });
            }
            dev.SeriesInstance["setProfileToDevice"](dev, (paramDB) => {
              resolve();
            });
          }
        }
      }
    });
  }
}
class ModelOV2USBDriver extends EventEmitter {
  static #instance;
  DefSleep;
  CheckCount;
  LOWORD(l) {
    return l & 65535;
  }
  HIWORD(l) {
    return l >> 16 & 65535;
  }
  LOBYTE(w) {
    return w & 255;
  }
  HIBYTE(w) {
    return w >> 8 & 255;
  }
  MAKEWORD(a, b) {
    return a & 255 | (b & 255) << 8;
  }
  hid;
  constructor() {
    env.log("Device", "Device class", "begin");
    super();
    try {
      this.DefSleep = 1e3;
      this.CheckCount = 1e3;
    } catch (err) {
      console.log("Device Error", "Init", `ex:${err.message}`);
    }
  }
  static getInstance(hid, ObjDeviceInfo) {
    if (this.#instance) {
      env.log("Device", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("Device", "getInstance", `New Device() INSTANCE`);
      this.#instance = new ModelOV2USBDriver();
      return this.#instance;
    }
  }
  //--------------------------------------------
  CMD_FW_WRITE_27(dev, ObjDataLength, callback) {
    var datalen = ObjDataLength;
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    if (datalen == void 0)
      datalen = 0;
    var buf = Buffer.alloc(65);
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 39;
    buf[7] = iSn2;
    buf[8] = 6;
    buf[9] = 39;
    buf[10] = this.LOBYTE(this.LOWORD(datalen));
    buf[11] = this.HIBYTE(this.LOWORD(datalen));
    buf[12] = this.LOBYTE(this.HIWORD(datalen));
    buf[13] = this.HIBYTE(this.HIWORD(datalen));
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 10, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 10, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  CMD_FW_INIT_NEW_CHECK_42(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    var buf = Buffer.alloc(65);
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 66;
    buf[7] = iSn2;
    buf[8] = 2;
    buf[9] = 66;
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  //
  CMD_FW_OBJECT_CREATE_25(dev, indexCount, callback) {
    var iSn = dev.m_iSnCount;
    var iTarget = dev.m_iTarget;
    var buf = Buffer.alloc(65);
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 37;
    buf[7] = iSn;
    buf[8] = 9;
    buf[9] = 37;
    buf[10] = this.LOBYTE(this.LOWORD(indexCount));
    buf[11] = this.HIBYTE(this.LOWORD(indexCount));
    buf[12] = this.LOBYTE(this.HIWORD(indexCount));
    buf[13] = this.HIBYTE(this.HIWORD(indexCount));
    buf[14] = this.LOBYTE(this.LOWORD(dev.OtaParamData.MaxObjectSize));
    buf[15] = this.HIBYTE(this.LOWORD(dev.OtaParamData.MaxObjectSize));
    buf[16] = this.LOBYTE(this.HIWORD(dev.OtaParamData.MaxObjectSize));
    buf[17] = this.HIBYTE(this.HIWORD(dev.OtaParamData.MaxObjectSize));
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  //
  CMD_FW_UPGRADE_18(dev, Obj, callback) {
    var datalen = dev.FileSize;
    var checksum = dev.Checksum;
    if (dev.FileChecksum != void 0) {
      checksum = dev.FileChecksum;
    }
    var strVersion = dev.DeviceVersion;
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    if (datalen == void 0)
      datalen = 0;
    var buf = Buffer.alloc(65);
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 24;
    buf[7] = iSn2;
    buf[8] = 12;
    buf[9] = 24;
    buf[10] = this.LOBYTE(this.LOWORD(datalen));
    buf[11] = this.HIBYTE(this.LOWORD(datalen));
    buf[12] = this.LOBYTE(this.HIWORD(datalen));
    buf[13] = this.HIBYTE(this.HIWORD(datalen));
    buf[14] = this.LOBYTE(checksum);
    buf[15] = this.HIBYTE(checksum);
    var arFWString = this.String2byte(strVersion);
    for (let index = 0; index < 5; index++) {
      buf[16 + index] = arFWString[index];
    }
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  //
  CMD_FW_CONTENT_40(dev, vdBuffer, callback) {
    dev.FileSize;
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    var buf = Buffer.alloc(65);
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 64;
    buf[7] = iSn2;
    buf[8] = vdBuffer.Size;
    for (let index = 0; index < vdBuffer.Buffer.length; index++) {
      buf[9 + index] = vdBuffer.Buffer[index];
    }
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 5, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
      dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
      callback(Databack);
    });
  }
  //
  CMD_FW_GET_INFO_23(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    var buf = Buffer.alloc(65);
    buf[1] = 0;
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 35;
    buf[7] = iSn2;
    buf[8] = 2;
    buf[9] = 35;
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 10, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 10, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  //
  CMD_FW_CRC_CHECK_41(dev, Checksum, callback) {
    var iSn = dev.m_iSnCount;
    var iSn2 = dev.m_iSnCount2;
    var iTarget = dev.m_iTarget;
    var buf = Buffer.alloc(65);
    if (iSn == 312) {
      buf[4] = iSn;
    }
    buf[1] = 0;
    buf[2] = 101;
    buf[3] = 58;
    buf[4] = iSn;
    buf[5] = iTarget;
    buf[6] = 65;
    buf[7] = iSn2;
    buf[8] = 3;
    buf[9] = 65;
    buf[10] = this.LOBYTE(Checksum);
    buf[11] = this.HIBYTE(Checksum);
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    var ObjSetData = { buffer: buf, iSleep: 1, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      var ObjGetData = { buffer: buf, iSleep: 1, com: 101, sn: iSn, CheckCount: 1e3 };
      this.GetDatafromDevice(dev, ObjGetData, (Databack2) => {
        dev.m_iSnCount = this.LOBYTE(dev.m_iSnCount + 1);
        dev.m_iSnCount2 = this.LOBYTE(dev.m_iSnCount2 + 1);
        callback(Databack2);
      });
    });
  }
  //
  CMD_FW__RESET2(dev, Obj, callback) {
    var iSn = dev.m_iSnCount;
    var buf = Buffer.alloc(65);
    buf[1] = 8;
    buf[2] = 250;
    buf[3] = 6;
    const initialValue = 0;
    const bChecksun = buf.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    buf[0] = 3;
    buf[1] = this.LOBYTE(bChecksun);
    this.CheckCount = 1;
    var ObjSetData = { buffer: buf, iSleep: 50, com: 101, sn: iSn };
    this.SetDataintoDevice(dev, ObjSetData, (Databack) => {
      this.CheckCount = 1e3;
      callback(Databack);
    });
  }
  //---------------------------------------
  GetDatafromDevice(dev, Obj, callback) {
    var CheckCount = Obj.CheckCount;
    var comID = Obj.com;
    var Data = Obj.buffer;
    const GetData = (iCount) => {
      if (iCount > 0) {
        this.GetFeatureReport(dev, Data, 1).then((rtnData) => {
          var res = true;
          res &= comID == rtnData[1 - 1] && dev.m_iSnCount == rtnData[4 - 1];
          res &= rtnData[2 - 1] == 0;
          if (!res && iCount > 0) {
            GetData(iCount - 1);
          } else {
            callback(rtnData);
          }
        });
      } else {
        callback(false);
      }
    };
    GetData(CheckCount);
  }
  /**
   * Set Data into Device
   * @param {*} dev 
   * @param {*} Obj 
   *      @param {*} iSleep 
   *      @param {*} buffer 
   * @param {*} callback 
   */
  SetDataintoDevice(dev, Obj, callback) {
    try {
      if (Obj.iSleep == void 0)
        Obj.iSleep = this.DefSleep;
      var CheckCount = this.CheckCount;
      const SetData = (iCount) => {
        if (iCount > 0) {
          this.SetFeatureReport(dev, Obj.buffer, Obj.iSleep).then((res) => {
            if (res > 0) {
              callback(true);
            } else if (iCount == 0) {
              callback(false);
            } else {
              SetData(iCount - 1);
            }
          });
        } else {
          callback(false);
        }
      };
      SetData(CheckCount);
    } catch (err) {
      console.log("SetData_Fail");
      callback(false);
    }
  }
  //-----------------------------------------------------
  //-----------------------------------------------------
  //Send Firmware Data Into node Driver
  SetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.SetFeatureReport(dev.BaseInfo.DeviceId, buf[0], 65, buf);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "SetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  //
  GetFeatureReport(dev, buf, iSleep) {
    return new Promise((resolve, reject) => {
      try {
        var rtnData = this.hid.GetFeatureReport(dev.BaseInfo.DeviceId, buf[0], 64);
        setTimeout(() => {
          resolve(rtnData);
        }, iSleep);
      } catch (err) {
        env.log("DeviceApi Error", "GetFeatureReport", `ex:${err.message}`);
        resolve(err);
      }
    });
  }
  //
  String2byte(string) {
    let utf8Encode = new TextEncoder();
    var result = utf8Encode.encode(string);
    return result;
  }
}
class ModelOV2FWUpdate extends ModelOV2USBDriver {
  static #instance;
  hid;
  //FirmwareData: any;
  ArrayDev;
  DeviceStep;
  TimerBootloader;
  ApModeTimeOut;
  ProcessSum2;
  OpenInBootloader;
  SN;
  m_TimerSendFWUPDATE;
  constructor(hid, ObjDeviceInfo) {
    super();
    this.hid = HID.getInstance();
    this.ArrayDev = [];
    this.DeviceStep = 0;
    this.TimerBootloader = null;
    this.ApModeTimeOut = 0;
    this.ProcessSum2 = 0;
    this.OpenInBootloader = false;
  }
  static getInstance(hid, ObjDeviceInfo) {
    if (this.#instance) {
      env.log("ModelOV2FWUpdate", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelOV2FWUpdate", "getInstance", `New Device() INSTANCE`);
      this.#instance = new ModelOV2FWUpdate(hid, ObjDeviceInfo);
      return this.#instance;
    }
  }
  Initialization(arrDeviceInfo, SN, ObjFile) {
    try {
      this.SN = SN;
      this.ZipfiletoFirmwareData(arrDeviceInfo, ObjFile.execPath, (result) => {
        if (!result) {
          this.SendProgressMessage("FAIL");
          return;
        }
        this.OpenDevice(this.ArrayDev, (result2) => {
          if (result2) {
            this.StartFWUpdate(this.ArrayDev);
          } else {
            this.SendProgressMessage("FAIL");
          }
        });
      });
    } catch (err) {
      env.log("ModelOV2FWUpdate Error", "Initialization", `ex:${err.message}`);
      console.log("FWUpdate Error", "Initialization", `ex:${err.message}`);
    }
  }
  ZipfiletoFirmwareData(arrDeviceInfo, ZipFile, callback) {
    var ExtCount = arrDeviceInfo[0].FWUpdateExtension.length;
    const WriteFirmwareData = (i) => {
      if (i < ExtCount) {
        var ObjFilePath = ZipFile.replace(".zip", arrDeviceInfo[0].FWUpdateExtension[i]);
        ObjFilePath = ObjFilePath.replace("FWUpdate.exe", "");
        var ObjFilename;
        fs.readdir(ObjFilePath, (err, files) => {
          for (var f of files) {
            if (f.endsWith(".bin")) {
              ObjFilename = f;
              break;
            }
          }
          var FilePath = ObjFilePath + ObjFilename;
          var BaseInfo = JSON.parse(JSON.stringify(arrDeviceInfo[i]));
          BaseInfo.vid = JSON.parse(JSON.stringify(arrDeviceInfo[i].vid[BaseInfo.StateID]));
          BaseInfo.pid = JSON.parse(JSON.stringify(arrDeviceInfo[i].pid[BaseInfo.StateID]));
          var ObjFirmwareData = { FilePath, BaseInfo };
          this.ArrayDev.push(ObjFirmwareData);
          WriteFirmwareData(i + 1);
        });
      } else {
        callback(true);
      }
    };
    WriteFirmwareData(0);
  }
  OpenDevice(ArrayDev, callback) {
    try {
      var deviceresult = false;
      if (this.hid != void 0) {
        for (var iState = 0; iState < ArrayDev.length; iState++) {
          var StateDevice = ArrayDev[iState].BaseInfo;
          var result;
          result = this.hid.FindDevice(StateDevice.set[0].usagepage, StateDevice.set[0].usage, StateDevice.vid, StateDevice.pid);
          env.log("ModelOV2FWUpdate", "OpenDevice: ", result);
          if (result > 0) {
            if (StateDevice.vid_BT == StateDevice.vid && StateDevice.pid_BT == StateDevice.pid) {
              this.OpenInBootloader = true;
            }
            deviceresult = true;
            ArrayDev[iState].BaseInfo.DeviceId = result;
          } else {
            ArrayDev[iState].BaseInfo.DeviceId = 0;
          }
        }
      }
      callback(deviceresult);
    } catch (err) {
      console.log("FWUpdate Error", "OpenDevice", `ex:${err.message}`);
    }
  }
  PluginDevice(dev) {
  }
  ///////////////////////Update Progress/////////////////////////////
  StartFWUpdate(ArrayDev) {
    const FWUpdatetoDevice = (iDevice) => {
      this.DeviceStep = iDevice;
      if (iDevice < ArrayDev.length) {
        var dev = ArrayDev[iDevice];
        if (dev.BaseInfo.DeviceId == 0) {
          this.StartFakeProcess(dev, (res) => {
            FWUpdatetoDevice(iDevice + 1);
          });
        } else {
          dev.m_iSnCount = 0;
          dev.m_iSnCount2 = 0;
          dev.m_iTarget = 0;
          this.StartDeviceFWUpdate(dev, (res) => {
            FWUpdatetoDevice(iDevice + 1);
          });
        }
      } else {
        this.SendProgressMessage("PASS");
      }
    };
    FWUpdatetoDevice(0);
  }
  StartFakeProcess(dev, callback) {
    const FakeProcess = (iProcess) => {
      if (iProcess < 100) {
        setTimeout(() => {
          this.SendProgressMessage(iProcess);
          FakeProcess(iProcess + 5);
        }, 100);
      } else {
        callback(true);
      }
    };
    FakeProcess(0);
  }
  StartDeviceFWUpdate(dev, callback) {
    this.CMD_FW_WRITE_27(dev, 0, (res1) => {
      this.SendProgressMessage(2);
      this.CMD_FW_INIT_NEW_CHECK_42(dev, 0, (res2) => {
        if (res2 == false) {
          this.SendProgressMessage("FAIL");
          callback(false);
        }
        var BufData = Buffer.alloc(64);
        for (let index = 1; index < BufData.length - 6; index++) {
          BufData[index] = res2[index - 1 + 6];
        }
        var OtaParamData = {};
        OtaParamData.OtaNewFlow = BufData[3] != 0 || BufData[4] != 1;
        OtaParamData.crc = BufData[8] << 8 | BufData[7];
        OtaParamData.MaxObjectSize = BufData[12] << 24 | BufData[11] << 16 | BufData[10] << 8 | BufData[9];
        OtaParamData.MtuSize = BufData[14] << 8 | BufData[13];
        OtaParamData.PrnThreshold = BufData[16] << 8 | BufData[15];
        OtaParamData.spec_check_result = BufData[17];
        dev.OtaParamData = OtaParamData;
        this.SendProgressMessage(4);
        this.CMD_FW_GET_INFO_23(dev, 0, (res3) => {
          this.SendProgressMessage(6);
          if (res3 == false) {
            this.SendProgressMessage("FAIL");
            callback(false);
          } else {
            var wcVersion = Buffer.alloc(6);
            for (let index = 0; index < wcVersion.length; index++) {
              wcVersion[index] = res3[10 + index - 1];
            }
            var strVersion = this.byte2String(wcVersion);
            var Checksum = this.MAKEWORD(res3[15 - 1], res3[16 - 1]);
            console.log("strVersion:" + strVersion, "checksum:" + Checksum.toString(16));
            dev.DeviceVersion = strVersion;
            dev.DeviceChecksum = Checksum;
            this.FirmwareDataintovdBuffer(dev, (res4) => {
              if (res4 == false) {
                this.SendProgressMessage("FAIL");
                callback(false);
              } else {
                this.SendProgressMessage(7);
                this.SendFwToDevice(dev, (res5) => {
                  if (res5 == false) {
                    callback(false);
                  } else {
                    callback(true);
                  }
                });
              }
            });
          }
        });
      });
    });
  }
  SendFwToDevice(dev, callback) {
    this.SendProgressMessage(8);
    dev.m_iSnCount = 1;
    this.CMD_FW_WRITE_27(dev, dev.FileSize, (res1) => {
      if (!res1)
        callback(false);
      this.SendProgressMessage(9);
      this.CMD_FW_INIT_NEW_CHECK_42(dev, 0, (res2) => {
        if (!res1)
          callback(false);
        this.SendProgressMessage(10);
        this.CMD_FW_OBJECT_CREATE_25(dev, 0, (res3) => {
          var bufChecksum = 0;
          var indexCount = 0;
          const WriteFWData = (iWriteCount) => {
            if (iWriteCount < dev.vdBuffer.length) {
              indexCount += dev.vdBuffer[iWriteCount].Size;
              this.CheckFirstCRCCHECK_41(dev, indexCount, bufChecksum, (res) => {
                if (!res)
                  callback(false);
                bufChecksum += dev.vdBuffer[iWriteCount].Checksum;
                bufChecksum &= 65535;
                this.CMD_FW_CONTENT_40(dev, dev.vdBuffer[iWriteCount], (res4) => {
                  if (!res4)
                    callback(false);
                  this.CheckLastCRCCHECK_41_45(dev, indexCount, bufChecksum, (res5) => {
                    if (!res5)
                      callback(false);
                    var iProgress = iWriteCount * 80 / dev.vdBuffer.length;
                    this.SendProgressMessage(10 + iProgress);
                    WriteFWData(iWriteCount + 1);
                  });
                });
              });
            } else {
              this.CMD_FW_CRC_CHECK_41(dev, bufChecksum, (res) => {
                if (!res)
                  callback(false);
                this.SendProgressMessage(92);
                this.CMD_FW_UPGRADE_18(dev, 0, (res4) => {
                  setTimeout(() => {
                    if (!res4)
                      callback(false);
                    this.SendProgressMessage(95);
                    this.CMD_FW__RESET2(dev, 0, (res5) => {
                      setTimeout(() => {
                        callback(true);
                      }, 1e3);
                    });
                  }, 1e3);
                });
              });
            }
          };
          WriteFWData(0);
        });
      });
    });
  }
  CheckFirstCRCCHECK_41(dev, indexCount, bufChecksum, callback) {
    if (indexCount % dev.OtaParamData.MaxObjectSize == 0 && bufChecksum != 0) {
      this.CMD_FW_CRC_CHECK_41(dev, bufChecksum, (res) => {
        if (res == false) {
          this.SendProgressMessage("FAIL");
          callback(false);
        } else {
          setTimeout(() => {
            callback(true);
          }, 50);
        }
      });
    } else {
      callback(true);
    }
  }
  CheckLastCRCCHECK_41_45(dev, indexCount, bufChecksum, callback) {
    if (indexCount % dev.OtaParamData.MaxObjectSize == 0) {
      this.CMD_FW_CRC_CHECK_41(dev, bufChecksum, (res) => {
        if (res == false)
          callback(false);
        setTimeout(() => {
          this.CMD_FW_OBJECT_CREATE_25(dev, indexCount, (res2) => {
            if (res2 == false)
              callback(false);
            callback(true);
          });
        }, 50);
      });
    } else {
      callback(true);
    }
  }
  ///////////////////////API///////////////////////////////////
  FirmwareDataintovdBuffer(dev, callback) {
    var FilePath = dev.FilePath;
    this.ReadBinToData(FilePath, (FirmwareData) => {
      if (FirmwareData != void 0) {
        var iFileSize = FirmwareData.length;
        dev.FileSize = iFileSize;
        const initialValue = 0;
        var bChecksum = FirmwareData.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
        bChecksum &= 65535;
        dev.FileChecksum = JSON.parse(JSON.stringify(bChecksum));
        var iMaxObjectSize = dev.OtaParamData.MaxObjectSize;
        var vdBuffer = [];
        var iSizeCount = 0;
        var iIndex = 0;
        var iBuffSize = dev.OtaParamData.MtuSize;
        while (iIndex < iFileSize) {
          if (vdBuffer.length == 1286) {
            if (vdBuffer.length == 1286)
              ;
          }
          var bBuff = [];
          for (let i = 0; i < iBuffSize; i++) {
            if (iIndex + i >= iFileSize) {
              bBuff.push(0);
            } else {
              bBuff.push(FirmwareData[iIndex + i]);
            }
          }
          bChecksum = bBuff.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
          bChecksum &= 65535;
          var ObjvdBuffer = { Buffer: bBuff, Checksum: bChecksum, Size: iBuffSize };
          vdBuffer.push(ObjvdBuffer);
          iIndex += iBuffSize;
          iSizeCount += iBuffSize;
          if (iMaxObjectSize - iSizeCount >= dev.OtaParamData.MtuSize) {
            iBuffSize = dev.OtaParamData.MtuSize;
          } else if (iMaxObjectSize - iSizeCount <= 0) {
            iBuffSize = dev.OtaParamData.MtuSize;
            iSizeCount = 0;
          } else {
            iBuffSize = iMaxObjectSize - iSizeCount;
          }
        }
        dev.vdBuffer = vdBuffer;
        callback(true);
      } else {
        callback(false);
      }
    });
  }
  ReadBinToData(ObjFile, callback) {
    try {
      console.log(ObjFile);
      fs.open(ObjFile, "r", (err, FileTemp) => {
        if (err) {
          env.log("Error", "ReadHexToData", err);
          callback(void 0);
        } else {
          var buffer2 = Buffer.alloc(1e5);
          fs.read(FileTemp, buffer2, 0, 1e5, 0, (err2, lsize) => {
            console.log(buffer2.toString("utf8", 0, lsize));
            var pData = Buffer.alloc(lsize);
            for (var i = 0; i < lsize; i++) {
              pData[i] = parseInt(buffer2[i]);
            }
            fs.close(FileTemp, (err3) => {
              callback(pData);
            });
          });
        }
      });
    } catch (err) {
      console.log("FWUpdate Error", "ReadBinToData", `ex:${err.message}`);
      callback(`Error:${err.message}`);
    }
  }
  isNumber(value) {
    return !isNaN(parseInt(value, 10));
  }
  OnTimerSendFWUPDATE(ProcessSum) {
    try {
      if (ProcessSum != this.ProcessSum2) {
        this.ProcessSum2 = JSON.parse(JSON.stringify(ProcessSum));
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: this.ProcessSum2 }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        clearInterval(this.m_TimerSendFWUPDATE);
        this.m_TimerSendFWUPDATE = void 0;
      } else {
        clearInterval(this.m_TimerSendFWUPDATE);
        this.m_TimerSendFWUPDATE = void 0;
      }
    } catch (e) {
      env.log("GmmkNumpadSeries", "TimerEmitFrontend", `Error:${e}`);
    }
  }
  SendProgressMessage(Current) {
    env.log("ModelOV2FWUpdate", "SendProgressMessage", Current);
    var ProcessSum = Current;
    if (this.isNumber(Current)) {
      ProcessSum = parseInt(100 / this.ArrayDev.length * this.DeviceStep + Current / this.ArrayDev.length);
      if (this.m_TimerSendFWUPDATE == void 0) {
        this.m_TimerSendFWUPDATE = setInterval(() => this.OnTimerSendFWUPDATE(ProcessSum), 500);
      }
    } else {
      setTimeout(() => {
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: ProcessSum }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
      }, 200);
    }
    if (Current == "PASS" || Current == "FAIL") {
      while (this.ArrayDev.length) {
        this.ArrayDev.pop();
      }
    }
  }
  StartDonglePairing() {
    setTimeout(() => {
      var Obj2 = {
        Func: "DonglePairing",
        SN: this.SN,
        Param: true
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    }, 1e3);
  }
  byte2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i]));
    }
    return result;
  }
}
class ModelOFWUpdate extends EventEmitter {
  static #instance;
  LaunchWinSocket = LaunchWinSocketLib;
  TimerWaitForLaunch;
  //Timer For Function
  TimerStartFWUpdate;
  //Timer For Function
  WaitForLaunchCount;
  TimerGetProcess;
  //Timer For Function
  LaunchStep;
  LaunchStepCount;
  LaunchPath;
  TimerFakerProcess;
  CurrentProcess;
  ProcessFailCount;
  SuccessCount;
  FailedDevices;
  devicename;
  SN;
  TimerFakeProcess;
  currentFirmwareProcessId = NaN;
  constructor(hid, ObjDeviceInfo) {
    super();
    this.TimerWaitForLaunch = null;
    this.TimerStartFWUpdate = null;
    this.WaitForLaunchCount = 0;
    this.TimerGetProcess = null;
    this.LaunchStep = 0;
    this.LaunchStepCount = 2;
    this.LaunchPath = [];
    this.TimerFakerProcess = null;
    this.CurrentProcess = 0;
    this.ProcessFailCount = 0;
    this.SuccessCount = 0;
    this.FailedDevices = [];
  }
  static getInstance(hid, ObjDeviceInfo) {
    if (this.#instance) {
      env.log("SocketFWUpdate", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("SocketFWUpdate", "getInstance", `New Device() INSTANCE`);
      this.#instance = new ModelOFWUpdate(hid, ObjDeviceInfo);
      return this.#instance;
    }
  }
  Initialization(DeviceInfo, SN, Obj) {
    try {
      this.devicename = DeviceInfo.devicename;
      this.SN = SN;
      this.LaunchPath = [];
      for (var i = 0; i < DeviceInfo.FWUpdateExtension.length; i++) {
        this.LaunchPath.push(Obj.execPath.replace(/\s*?\(\d+\)/, "").replace(".zip", DeviceInfo.FWUpdateExtension[i]));
      }
      this.LaunchStepCount = this.LaunchPath.length;
      this.SuccessCount = 0;
      this.LaunchStep = 0;
      var ObjFWUpdate = { execPath: this.LaunchPath[this.LaunchStep], Step: this.LaunchStep };
      this.ExecuteFWUpdate(ObjFWUpdate);
    } catch (err) {
      env.log("FWUpdate " + this.devicename + "Error", "Initialization", `ex:${err.message}`);
      console.log("FWUpdate Error", "Initialization", `ex:${err.message}`);
    }
  }
  ExecuteFWUpdate(Obj) {
    env.log("FWUpdate " + this.devicename, "ExecuteFWUpdate", Obj.execPath);
    var execFile = cp$1.execFile;
    var T_Path_Stringify = JSON.parse(JSON.stringify(Obj.execPath));
    var returnValue = execFile(T_Path_Stringify, (err, data) => {
      if (err)
        env.log("FWUpdate " + this.devicename, "ExecuteFWUpdate-Error", err);
      else
        env.log("FWUpdate " + this.devicename, "ExecuteFWUpdate", "success");
    });
    this.currentFirmwareProcessId = returnValue.pid ?? NaN;
    if (isNaN(this.currentFirmwareProcessId)) {
      console.error(new Error("Unable to launch firmware"));
    }
    console.log(returnValue);
    this.ProcessFailCount = 0;
    this.WaitForLaunchCount = 0;
    clearInterval(this.TimerWaitForLaunch);
    this.TimerWaitForLaunch = null;
    this.TimerWaitForLaunch = setInterval(() => this.OnTimerWaitForLaunch(), 1e3);
  }
  OnTimerWaitForLaunch() {
    var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
    if (this.WaitForLaunchCount >= 15) {
      this.WaitForLaunchCount = 0;
      clearInterval(this.TimerWaitForLaunch);
      this.TimerWaitForLaunch = null;
      console.log("LaunchFWUpdate-Failed:");
      env.log("FWUpdate " + this.devicename, "OnTimerWaitForLaunch", "LaunchFWUpdate-Failed");
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: "FAIL" }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else if (csRtn1.indexOf("GETPROGRESSOK:") != -1) {
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: "START" }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      var ProcessSum = 100 / this.LaunchStepCount * this.LaunchStep;
      var Process2 = ProcessSum.toString();
      Obj2.Param.Data = Process2;
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.WaitForLaunchCount = 0;
      clearInterval(this.TimerWaitForLaunch);
      this.TimerWaitForLaunch = null;
      console.log("LaunchFWUpdate-Start To Update:");
      env.log("FWUpdate " + this.devicename, "OnTimerWaitForLaunch", "Start To Update");
      clearInterval(this.TimerStartFWUpdate);
      this.TimerStartFWUpdate = null;
      this.TimerStartFWUpdate = setInterval(() => this.OnTimerStartFWUpdate(), 1e3);
    }
    this.WaitForLaunchCount++;
  }
  OnTimerStartFWUpdate() {
    if (this.FailedDevices.indexOf(this.devicename) > -1) {
      clearInterval(this.TimerStartFWUpdate);
      this.TimerStartFWUpdate = null;
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        env.log("FWUpdate " + this.devicename, "StartFWUpdate", "Device with same name has failed during this update; skipping device.");
        this.CurrentProcess = 0;
        clearInterval(this.TimerFakeProcess);
        this.TimerFakeProcess = null;
        this.ProcessFailCount = 0;
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "ERROR", deviceName: this.devicename, errorKey: this.LaunchStep == 0 ? "device" : "dongle" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        this.FailedDevices.push(this.devicename);
        this.FinishedFWUpdate();
      });
      return;
    }
    var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "START");
    if (csRtn1.indexOf("Device Not Found") != -1 && this.WaitForLaunchCount >= 5) {
      csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
      env.log("FWUpdate " + this.devicename, "StartFWUpdate", csRtn1);
      clearInterval(this.TimerStartFWUpdate);
      this.TimerStartFWUpdate = null;
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        env.log("FWUpdate " + this.devicename, "StartFWUpdate", "Device Not Found");
        this.CurrentProcess = 0;
        clearInterval(this.TimerFakeProcess);
        this.TimerFakeProcess = null;
        this.ProcessFailCount = 0;
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "ERROR", deviceName: this.devicename, errorKey: this.LaunchStep == 0 ? "device" : "dongle" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        this.FailedDevices.push(this.devicename);
        this.FinishedFWUpdate();
      });
    } else if (csRtn1.indexOf("Device Not Found") != -1) {
      this.WaitForLaunchCount++;
      env.log("FWUpdate " + this.devicename, "StartFWUpdate", "Device Not Found,Times:" + this.WaitForLaunchCount);
    } else {
      clearInterval(this.TimerStartFWUpdate);
      this.TimerStartFWUpdate = null;
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
    }
  }
  StartFWUpdate() {
    var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "START");
    console.log("LaunchWinSocket-Message:", csRtn1);
    if (csRtn1.indexOf("Device Not Found") != -1) {
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        env.log("FWUpdate " + this.devicename, "StartFWUpdate", "Device Not Found");
        this.CurrentProcess = 0;
        clearInterval(this.TimerFakeProcess);
        this.TimerFakeProcess = null;
        this.ProcessFailCount = 0;
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "ERROR", deviceName: this.devicename, errorKey: this.LaunchStep == 0 ? "device" : "dongle" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
        this.FailedDevices.push(this.devicename);
        this.FinishedFWUpdate();
      });
    } else {
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
    }
  }
  //For ModelO ,If one of the wireless and wired devices is not plugged in, update the progress bar
  OnTimerFakeProcess() {
    this.CurrentProcess++;
    var ProcessSum = 100 / this.LaunchStepCount * this.LaunchStep + this.CurrentProcess;
    if (ProcessSum >= 100 / this.LaunchStepCount * (this.LaunchStep + 1)) {
      clearInterval(this.TimerFakeProcess);
      this.TimerFakeProcess = null;
      this.FinishedFWUpdate();
    } else {
      var Process2 = ProcessSum.toString();
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: Process2 }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    }
  }
  OnTimerGetProcess() {
    var csRtn1 = this.LaunchWinSocket.SendMessageToServer("FirmwareUpdater", "GETPROGRESS");
    if (csRtn1.indexOf("PASS") != -1) {
      this.SuccessCount++;
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        this.FinishedFWUpdate();
      });
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
    } else if (csRtn1.indexOf("Not Found ProcessName App") != -1) {
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        env.log("FWUpdate " + this.devicename, "Not Found app-CurProcess:", CurProcess);
        this.ProcessFailCount = 0;
        var Obj22 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "FAIL" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj22);
      });
    } else if (csRtn1.indexOf("FAIL") != -1) {
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
        env.log("FWUpdate " + this.devicename, "FAIL-" + csRtn1, "CurProcess:" + CurProcess);
        this.ProcessFailCount = 0;
        var Obj22 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "FAIL" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj22);
      });
    } else {
      var Processlength = csRtn1.split("GETPROGRESSOK:").length;
      var Process = parseInt(csRtn1.split("GETPROGRESSOK:")[Processlength - 1] / this.LaunchStepCount);
      var CurProcess = parseInt(csRtn1.split("GETPROGRESSOK:")[Processlength - 1]);
      if (this.CurrentProcess == CurProcess && this.ProcessFailCount >= 100 && CurProcess < 100) {
        clearInterval(this.TimerGetProcess);
        this.TimerGetProcess = null;
        this.TerminateFWUpdate("FirmwareUpdater", (csRtn) => {
          env.log("FWUpdate " + this.devicename, "processingCount:" + this.ProcessFailCount, "CurProcess:" + CurProcess);
          this.ProcessFailCount = 0;
          var Obj22 = {
            Func: EventTypes.SendFWUPDATE,
            SN: this.SN,
            Param: { Data: "FAIL" }
          };
          this.emit(EventTypes.ProtocolMessage, Obj22);
        });
      } else if (this.CurrentProcess == CurProcess) {
        this.ProcessFailCount++;
      } else {
        this.ProcessFailCount = 0;
        this.CurrentProcess = CurProcess;
        var ProcessSum = 100 / this.LaunchStepCount * this.LaunchStep + Process;
        var Process2 = ProcessSum.toString();
        env.log("FWUpdate " + this.devicename, "GETPROGRESSOK:", Process2);
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: Process2 }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
      }
    }
  }
  TerminateFWUpdate(Obj, callback) {
    var csRtn;
    const TerminateEXE = (iTimes) => {
      if (iTimes < 5) {
        var iFindRtn = this.LaunchWinSocket.FindWindowProcess(Obj);
        if (iFindRtn >= 1) {
          csRtn = this.LaunchWinSocket.TerminateProcess(Obj);
          console.log("LaunchWinSocket TerminateProcess:", csRtn);
          env.log("FWUpdate " + this.devicename, "TerminateProcess:", csRtn);
          setTimeout(() => {
            TerminateEXE(iTimes + 1);
          }, 1e3);
        } else {
          setTimeout(() => {
            callback("Exit ProcessName App Success");
          }, 500);
        }
      } else {
        env.log("FWUpdate " + this.devicename, "TerminateProcess:", "Exit ProcessName App FAIL");
        callback(csRtn);
      }
    };
    TerminateEXE(0);
  }
  FinishedFWUpdate() {
    this.LaunchStep++;
    if (this.LaunchStep == this.LaunchStepCount) {
      console.log("FinishedFWUpdate");
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: "PASS" }
      };
      if (this.SuccessCount <= 0 && env.BuiltType != 1 || this.FailedDevices.length > 0) {
        Obj2.Param.Data = "FAIL";
        env.log("FWUpdate " + this.devicename, "FAIL-FinishedFWUpdate-SuccessCount:", this.SuccessCount);
      }
      this.emit(EventTypes.ProtocolMessage, Obj2);
      this.FailedDevices = [];
    } else {
      var ProcessSum = 100 / this.LaunchStepCount * this.LaunchStep + 0;
      var Process2 = ProcessSum.toString();
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: Process2 }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
      env.log("FWUpdate " + this.devicename, "FinishedFWUpdate-LaunchStep:", this.LaunchStep);
      console.log("ExecuteFWUpdate LaunchStep:", this.LaunchStep);
      var ObjFWUpdate = { execPath: this.LaunchPath[this.LaunchStep], Step: this.LaunchStep };
      this.ExecuteFWUpdate(ObjFWUpdate);
    }
  }
}
class ModelIFWUpdate extends stream.EventEmitter {
  static #instance;
  LaunchWinSocket = LaunchWinSocketLib;
  GloriousMOISDK = GloriousMOISDKLib;
  TimerWaitForLaunch;
  WaitForLaunchCount;
  TimerGetProcess;
  LaunchPath;
  CurrentProcess;
  ProcessFailCount;
  SuccessCount;
  LaunchStep;
  SN;
  constructor(hid, ObjDeviceInfo) {
    super();
    this.TimerWaitForLaunch = null;
    this.WaitForLaunchCount = 0;
    this.TimerGetProcess = null;
    this.LaunchPath;
    this.CurrentProcess = 0;
    this.ProcessFailCount = 0;
    this.SuccessCount = 0;
  }
  static getInstance(hid, ObjDeviceInfo) {
    if (this.#instance) {
      env.log("ModelIFWUpdate", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("ModelIFWUpdate", "getInstance", `New Device() INSTANCE`);
      this.#instance = new ModelIFWUpdate(hid, ObjDeviceInfo);
      return this.#instance;
    }
  }
  Initialization(DeviceInfo, SN, Obj) {
    try {
      var DeviceFlags = this.GloriousMOISDK.Initialization();
      var LaunchPath = Obj.execPath.replace(".zip", ".bin");
      this.SuccessCount = 0;
      this.LaunchStep = 0;
      this.SN = SN;
      if (env.BuiltType == 1) {
        var Obj2 = {
          Func: EventTypes.SendFWUPDATE,
          SN: this.SN,
          Param: { Data: "PASS" }
        };
        this.emit(EventTypes.ProtocolMessage, Obj2);
      } else {
        var ObjFWUpdate = { execPath: LaunchPath };
        this.ExecuteFWUpdate(ObjFWUpdate);
      }
    } catch (err) {
      env.log("ModelIFWUpdate Error", "Initialization", `ex:${err.message}`);
      console.log("FWUpdate Error", "Initialization", `ex:${err.message}`);
    }
  }
  ExecuteFWUpdate(Obj) {
    var result = this.GloriousMOISDK.UpdateFirmware(Obj.execPath);
    if (result) {
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.TimerGetProcess = setInterval(() => this.OnTimerGetProcess(), 100);
    }
  }
  OnTimerGetProcess() {
    var csRtn1 = this.GloriousMOISDK.GetUpdateStats();
    console.log(csRtn1);
    if (csRtn1.indexOf("PASS") != -1) {
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      this.FinishedFWUpdate();
    } else if (csRtn1.indexOf("FAIL") != -1) {
      env.log("ModelIFWUpdate-GetProcess", "GetUpdateStats FAIL", csRtn1);
      console.log("ModelIFWUpdate-GetProcess", "GetUpdateStats FAIL", csRtn1);
      clearInterval(this.TimerGetProcess);
      this.TimerGetProcess = null;
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: "FAIL" }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    } else {
      var Processlength = csRtn1.split("GETPROGRESS:").length;
      var CurProcess = parseInt(csRtn1.split("GETPROGRESS:")[Processlength - 1]);
      if (CurProcess > 100) {
        CurProcess = 100;
      }
      var Process2 = CurProcess.toString();
      var Obj2 = {
        Func: EventTypes.SendFWUPDATE,
        SN: this.SN,
        Param: { Data: Process2 }
      };
      this.emit(EventTypes.ProtocolMessage, Obj2);
    }
  }
  //Finished,So the update is done
  FinishedFWUpdate() {
    console.log("FinishedFWUpdate");
    var Obj2 = {
      Func: EventTypes.SendFWUPDATE,
      SN: this.SN,
      Param: { Data: "PASS" }
    };
    this.emit(EventTypes.ProtocolMessage, Obj2);
  }
}
class IPCProgress {
  constructor(item, type, value, message) {
    this.item = item;
    this.type = type;
    this.value = value;
    this.message = message;
  }
}
function normalizeMethodInfo(method, service) {
  var _a, _b, _c;
  let m = method;
  m.service = service;
  m.localName = (_a = m.localName) !== null && _a !== void 0 ? _a : runtime.lowerCamelCase(m.name);
  m.serverStreaming = !!m.serverStreaming;
  m.clientStreaming = !!m.clientStreaming;
  m.options = (_b = m.options) !== null && _b !== void 0 ? _b : {};
  m.idempotency = (_c = m.idempotency) !== null && _c !== void 0 ? _c : void 0;
  return m;
}
class ServiceType {
  constructor(typeName, methods, options) {
    this.typeName = typeName;
    this.methods = methods.map((i) => normalizeMethodInfo(i, this));
    this.options = options !== null && options !== void 0 ? options : {};
  }
}
var DangleDevType = /* @__PURE__ */ ((DangleDevType2) => {
  DangleDevType2[DangleDevType2["DangleDevTypeNone"] = 0] = "DangleDevTypeNone";
  DangleDevType2[DangleDevType2["Keyboard"] = 1] = "Keyboard";
  DangleDevType2[DangleDevType2["Mouse"] = 2] = "Mouse";
  return DangleDevType2;
})(DangleDevType || {});
var CheckSumType = /* @__PURE__ */ ((CheckSumType2) => {
  CheckSumType2[CheckSumType2["Bit7"] = 0] = "Bit7";
  CheckSumType2[CheckSumType2["Bit8"] = 1] = "Bit8";
  CheckSumType2[CheckSumType2["None"] = 2] = "None";
  return CheckSumType2;
})(CheckSumType || {});
var DeviceListChangeType = /* @__PURE__ */ ((DeviceListChangeType2) => {
  DeviceListChangeType2[DeviceListChangeType2["Init"] = 0] = "Init";
  DeviceListChangeType2[DeviceListChangeType2["Add"] = 1] = "Add";
  DeviceListChangeType2[DeviceListChangeType2["Remove"] = 2] = "Remove";
  DeviceListChangeType2[DeviceListChangeType2["Change"] = 3] = "Change";
  return DeviceListChangeType2;
})(DeviceListChangeType || {});
var DeviceType = /* @__PURE__ */ ((DeviceType2) => {
  DeviceType2[DeviceType2["YZWKeyboard"] = 0] = "YZWKeyboard";
  DeviceType2[DeviceType2["YZWBoot"] = 1] = "YZWBoot";
  DeviceType2[DeviceType2["YZWVender"] = 2] = "YZWVender";
  return DeviceType2;
})(DeviceType || {});
var LightType = /* @__PURE__ */ ((LightType2) => {
  LightType2[LightType2["Music2"] = 0] = "Music2";
  LightType2[LightType2["Screen"] = 1] = "Screen";
  LightType2[LightType2["Other"] = 2] = "Other";
  return LightType2;
})(LightType || {});
var UpgradeMethod = /* @__PURE__ */ ((UpgradeMethod2) => {
  UpgradeMethod2[UpgradeMethod2["YZW"] = 0] = "YZW";
  UpgradeMethod2[UpgradeMethod2["YZW24"] = 1] = "YZW24";
  UpgradeMethod2[UpgradeMethod2["YC3016A"] = 2] = "YC3016A";
  UpgradeMethod2[UpgradeMethod2["OLED"] = 3] = "OLED";
  UpgradeMethod2[UpgradeMethod2["MLED"] = 4] = "MLED";
  UpgradeMethod2[UpgradeMethod2["MOUSE"] = 5] = "MOUSE";
  UpgradeMethod2[UpgradeMethod2["DANGLE1K"] = 6] = "DANGLE1K";
  UpgradeMethod2[UpgradeMethod2["MOUSE8K"] = 7] = "MOUSE8K";
  UpgradeMethod2[UpgradeMethod2["MOUSE8KRF"] = 8] = "MOUSE8KRF";
  UpgradeMethod2[UpgradeMethod2["DANGLE4K"] = 9] = "DANGLE4K";
  UpgradeMethod2[UpgradeMethod2["DANGLE4KRF"] = 10] = "DANGLE4KRF";
  UpgradeMethod2[UpgradeMethod2["KEYBOARD8K"] = 11] = "KEYBOARD8K";
  UpgradeMethod2[UpgradeMethod2["KEYBOARD8KRF"] = 12] = "KEYBOARD8KRF";
  UpgradeMethod2[UpgradeMethod2["NORDICDANGLE"] = 13] = "NORDICDANGLE";
  UpgradeMethod2[UpgradeMethod2["NORDICKEYBOARD"] = 14] = "NORDICKEYBOARD";
  UpgradeMethod2[UpgradeMethod2["FLASH"] = 15] = "FLASH";
  UpgradeMethod2[UpgradeMethod2["BK100"] = 16] = "BK100";
  UpgradeMethod2[UpgradeMethod2["TOUCHSCREEN"] = 17] = "TOUCHSCREEN";
  return UpgradeMethod2;
})(UpgradeMethod || {});
class WeatherReq$Type extends runtime.MessageType {
  constructor() {
    super("driver.WeatherReq", [
      {
        no: 1,
        name: "language",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "address",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const WeatherReq = new WeatherReq$Type();
class WeatherRes$Type extends runtime.MessageType {
  constructor() {
    super("driver.WeatherRes", [
      {
        no: 1,
        name: "res",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const WeatherRes = new WeatherRes$Type();
class Version$Type extends runtime.MessageType {
  constructor() {
    super("driver.Version", [
      {
        no: 1,
        name: "baseVersion",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "timeStamp",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const Version = new Version$Type();
class WirelessLoopStatus$Type extends runtime.MessageType {
  constructor() {
    super("driver.WirelessLoopStatus", [
      {
        no: 1,
        name: "lock",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      }
    ]);
  }
}
const WirelessLoopStatus = new WirelessLoopStatus$Type();
class InsertDb$Type extends runtime.MessageType {
  constructor() {
    super("driver.InsertDb", [
      {
        no: 1,
        name: "dbPath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "key",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 3,
        name: "value",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const InsertDb = new InsertDb$Type();
class DeleteItem$Type extends runtime.MessageType {
  constructor() {
    super("driver.DeleteItem", [
      {
        no: 1,
        name: "dbPath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "key",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const DeleteItem = new DeleteItem$Type();
class GetItem$Type extends runtime.MessageType {
  constructor() {
    super("driver.GetItem", [
      {
        no: 1,
        name: "dbPath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "key",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const GetItem = new GetItem$Type();
class Item$Type extends runtime.MessageType {
  constructor() {
    super("driver.Item", [
      {
        no: 1,
        name: "value",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "err_str",
        kind: "scalar",
        localName: "err_str",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const Item = new Item$Type();
class GetAll$Type extends runtime.MessageType {
  constructor() {
    super("driver.GetAll", [
      {
        no: 1,
        name: "dbPath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const GetAll = new GetAll$Type();
class AllList$Type extends runtime.MessageType {
  constructor() {
    super("driver.AllList", [
      {
        no: 1,
        name: "data",
        kind: "scalar",
        repeat: 2,
        T: 12
        /*ScalarType.BYTES*/
      },
      {
        no: 2,
        name: "err_str",
        kind: "scalar",
        localName: "err_str",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const AllList = new AllList$Type();
class MicrophoneMuteStatus$Type extends runtime.MessageType {
  constructor() {
    super("driver.MicrophoneMuteStatus", [
      {
        no: 1,
        name: "is_mute",
        kind: "scalar",
        localName: "is_mute",
        T: 8
        /*ScalarType.BOOL*/
      },
      {
        no: 2,
        name: "err",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const MicrophoneMuteStatus = new MicrophoneMuteStatus$Type();
class MuteMicrophone$Type extends runtime.MessageType {
  constructor() {
    super("driver.MuteMicrophone", [
      {
        no: 1,
        name: "need_mute",
        kind: "scalar",
        localName: "need_mute",
        T: 8
        /*ScalarType.BOOL*/
      }
    ]);
  }
}
const MuteMicrophone = new MuteMicrophone$Type();
class OTAUpgrade$Type extends runtime.MessageType {
  constructor() {
    super("driver.OTAUpgrade", [
      {
        no: 1,
        name: "devPath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "file_buf",
        kind: "scalar",
        localName: "file_buf",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const OTAUpgrade = new OTAUpgrade$Type();
class Progress$Type extends runtime.MessageType {
  constructor() {
    super("driver.Progress", [
      {
        no: 1,
        name: "progress",
        kind: "scalar",
        T: 2
        /*ScalarType.FLOAT*/
      },
      {
        no: 2,
        name: "err",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const Progress = new Progress$Type();
class Empty$Type extends runtime.MessageType {
  constructor() {
    super("driver.Empty", []);
  }
}
const Empty = new Empty$Type();
class ResSend$Type extends runtime.MessageType {
  constructor() {
    super("driver.ResSend", [
      {
        no: 1,
        name: "err",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const ResSend = new ResSend$Type();
class ResRead$Type extends runtime.MessageType {
  constructor() {
    super("driver.ResRead", [
      {
        no: 1,
        name: "err",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "msg",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const ResRead = new ResRead$Type();
class SendMsg$Type extends runtime.MessageType {
  constructor() {
    super("driver.SendMsg", [
      {
        no: 1,
        name: "devicePath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "msg",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      },
      { no: 3, name: "checkSumType", kind: "enum", T: () => ["driver.CheckSumType", CheckSumType] },
      { no: 4, name: "dangleDevType", kind: "enum", T: () => ["driver.DangleDevType", DangleDevType] }
    ]);
  }
}
const SendMsg = new SendMsg$Type();
class ReadMsg$Type extends runtime.MessageType {
  constructor() {
    super("driver.ReadMsg", [
      {
        no: 1,
        name: "devicePath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const ReadMsg = new ReadMsg$Type();
class DeviceList$Type extends runtime.MessageType {
  constructor() {
    super("driver.DeviceList", [
      { no: 1, name: "devList", kind: "message", repeat: 1, T: () => DJDev },
      { no: 2, name: "type", kind: "enum", T: () => ["driver.DeviceListChangeType", DeviceListChangeType] }
    ]);
  }
}
const DeviceList = new DeviceList$Type();
class DJDev$Type extends runtime.MessageType {
  constructor() {
    super("driver.DJDev", [
      { no: 1, name: "dev", kind: "message", oneof: "oneofDev", T: () => Device2 },
      { no: 2, name: "dangleCommonDev", kind: "message", oneof: "oneofDev", T: () => DangleCommon }
    ]);
  }
}
const DJDev = new DJDev$Type();
class Device$Type extends runtime.MessageType {
  constructor() {
    super("driver.Device", [
      { no: 1, name: "devType", kind: "enum", T: () => ["driver.DeviceType", DeviceType] },
      {
        no: 2,
        name: "is24",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      },
      {
        no: 3,
        name: "path",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 4,
        name: "id",
        kind: "scalar",
        T: 5
        /*ScalarType.INT32*/
      },
      {
        no: 5,
        name: "battery",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 6,
        name: "isOnline",
        kind: "scalar",
        T: 8
        /*ScalarType.BOOL*/
      },
      {
        no: 7,
        name: "vid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 8,
        name: "pid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      }
    ]);
  }
}
const Device2 = new Device$Type();
class Status24$Type extends runtime.MessageType {
  constructor() {
    super("driver.Status24", [
      {
        no: 1,
        name: "battery",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 2,
        name: "is_online",
        kind: "scalar",
        localName: "is_online",
        T: 8
        /*ScalarType.BOOL*/
      }
    ]);
  }
}
const Status24 = new Status24$Type();
class DangleStatus$Type extends runtime.MessageType {
  constructor() {
    super("driver.DangleStatus", [
      { no: 1, name: "empty", kind: "message", oneof: "dangleDev", T: () => Empty },
      { no: 2, name: "status", kind: "message", oneof: "dangleDev", T: () => Status24 }
    ]);
  }
}
const DangleStatus = new DangleStatus$Type();
class DangleCommon$Type extends runtime.MessageType {
  constructor() {
    super("driver.DangleCommon", [
      { no: 1, name: "keyboard", kind: "message", T: () => DangleStatus },
      { no: 2, name: "mouse", kind: "message", T: () => DangleStatus },
      {
        no: 3,
        name: "path",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 5,
        name: "keyboard_id",
        kind: "scalar",
        localName: "keyboard_id",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 6,
        name: "mouse_id",
        kind: "scalar",
        localName: "mouse_id",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 7,
        name: "vid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 8,
        name: "pid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      }
    ]);
  }
}
const DangleCommon = new DangleCommon$Type();
class VenderMsg$Type extends runtime.MessageType {
  constructor() {
    super("driver.VenderMsg", [
      {
        no: 1,
        name: "msg",
        kind: "scalar",
        T: 12
        /*ScalarType.BYTES*/
      }
    ]);
  }
}
const VenderMsg = new VenderMsg$Type();
class SystemInfo$Type extends runtime.MessageType {
  constructor() {
    super("driver.SystemInfo", [
      {
        no: 1,
        name: "disk_space_total",
        kind: "scalar",
        localName: "disk_space_total",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 2,
        name: "disk_spce_available",
        kind: "scalar",
        localName: "disk_spce_available",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 3,
        name: "net_work_total_up",
        kind: "scalar",
        localName: "net_work_total_up",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 4,
        name: "net_work_total_down",
        kind: "scalar",
        localName: "net_work_total_down",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 5,
        name: "cpu_temperater",
        kind: "scalar",
        localName: "cpu_temperater",
        T: 2
        /*ScalarType.FLOAT*/
      },
      {
        no: 6,
        name: "mem_total",
        kind: "scalar",
        localName: "mem_total",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 7,
        name: "mem_used",
        kind: "scalar",
        localName: "mem_used",
        T: 4,
        L: 0
        /*LongType.BIGINT*/
      },
      {
        no: 8,
        name: "cpu_usage",
        kind: "scalar",
        localName: "cpu_usage",
        T: 2
        /*ScalarType.FLOAT*/
      }
    ]);
  }
}
const SystemInfo = new SystemInfo$Type();
class SetLight$Type extends runtime.MessageType {
  constructor() {
    super("driver.SetLight", [
      {
        no: 1,
        name: "devicePath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 2, name: "lightType", kind: "enum", T: () => ["driver.LightType", LightType] },
      {
        no: 3,
        name: "screen_id",
        kind: "scalar",
        localName: "screen_id",
        T: 13
        /*ScalarType.UINT32*/
      },
      { no: 4, name: "dangleDevType", kind: "enum", T: () => ["driver.DangleDevType", DangleDevType] }
    ]);
  }
}
const SetLight = new SetLight$Type();
class UpgradeDevInfo$Type extends runtime.MessageType {
  constructor() {
    super("driver.UpgradeDevInfo", [
      {
        no: 1,
        name: "dev_id",
        kind: "scalar",
        localName: "dev_id",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 2,
        name: "vid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 3,
        name: "pid",
        kind: "scalar",
        T: 13
        /*ScalarType.UINT32*/
      },
      {
        no: 4,
        name: "devicePath",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const UpgradeDevInfo = new UpgradeDevInfo$Type();
class ResUpgradeInfo$Type extends runtime.MessageType {
  constructor() {
    super("driver.ResUpgradeInfo", [
      {
        no: 1,
        name: "err_str",
        kind: "scalar",
        localName: "err_str",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 2,
        name: "res",
        kind: "scalar",
        T: 9
        /*ScalarType.STRING*/
      }
    ]);
  }
}
const ResUpgradeInfo = new ResUpgradeInfo$Type();
class UpgradeInfo$Type extends runtime.MessageType {
  constructor() {
    super("driver.UpgradeInfo", [
      { no: 1, name: "dev", kind: "message", T: () => UpgradeDevInfo },
      {
        no: 2,
        name: "version_str",
        kind: "scalar",
        localName: "version_str",
        T: 9
        /*ScalarType.STRING*/
      },
      {
        no: 3,
        name: "file_path",
        kind: "scalar",
        localName: "file_path",
        T: 9
        /*ScalarType.STRING*/
      },
      { no: 5, name: "upgrade_method", kind: "enum", localName: "upgrade_method", repeat: 1, T: () => ["driver.UpgradeMethod", UpgradeMethod] }
    ]);
  }
}
const UpgradeInfo = new UpgradeInfo$Type();
new ServiceType("driver.DriverGrpc", [
  { name: "watchDevList", serverStreaming: true, options: {}, I: Empty, O: DeviceList },
  { name: "watchVender", serverStreaming: true, options: {}, I: Empty, O: VenderMsg },
  { name: "watchSystemInfo", serverStreaming: true, options: {}, I: Empty, O: SystemInfo },
  { name: "sendMsg", options: {}, I: SendMsg, O: ResSend },
  { name: "readMsg", options: {}, I: ReadMsg, O: ResRead },
  { name: "sendRawFeature", options: {}, I: SendMsg, O: ResSend },
  { name: "readRawFeature", options: {}, I: ReadMsg, O: ResRead },
  { name: "setLightType", options: {}, I: SetLight, O: Empty },
  { name: "upgradeOTAGATT", serverStreaming: true, options: {}, I: OTAUpgrade, O: Progress },
  { name: "muteMicrophone", options: {}, I: MuteMicrophone, O: ResSend },
  { name: "toggleMicrophoneMute", options: {}, I: Empty, O: ResSend },
  { name: "getMicrophoneMute", options: {}, I: Empty, O: MicrophoneMuteStatus },
  { name: "changeWirelessLoopStatus", options: {}, I: WirelessLoopStatus, O: Empty },
  { name: "insertDb", options: {}, I: InsertDb, O: ResSend },
  { name: "deleteItemFromDb", options: {}, I: DeleteItem, O: ResSend },
  { name: "getItemFromDb", options: {}, I: GetItem, O: Item },
  { name: "getAllKeysFromDb", options: {}, I: GetAll, O: AllList },
  { name: "getAllValuesFromDb", options: {}, I: GetAll, O: AllList },
  { name: "cleanDev", options: {}, I: ReadMsg, O: ResSend },
  { name: "getVersion", options: {}, I: Empty, O: Version },
  { name: "getWeather", options: {}, I: WeatherReq, O: WeatherRes },
  { name: "getUpgradeInfo", options: {}, I: UpgradeDevInfo, O: ResUpgradeInfo },
  { name: "upgradeDev", serverStreaming: true, options: {}, I: UpgradeInfo, O: Progress }
]);
const UPGRADE_SEQUENCE = {
  Wired: [UpgradeMethod.KEYBOARD8K, UpgradeMethod.KEYBOARD8KRF, UpgradeMethod.MLED],
  Wireless: [UpgradeMethod.KEYBOARD8K, UpgradeMethod.KEYBOARD8KRF, UpgradeMethod.NORDICKEYBOARD, UpgradeMethod.MLED],
  Dongle: [UpgradeMethod.NORDICDANGLE]
};
const DONGLE_DEVICE_ID = {
  "0x342D0xE3E0": 1732,
  "0x342D0xE3E1": 1733,
  "0x342D0xE3E2": 1734,
  // valueB ANSI, kept for reference,
  // '0x342D0xE3E6': 1735,
  // '0x342D0xE3E7': 1736,
  // '0x342D0xE3E8': 1737,
  "0x342D0xE3F5": 1738,
  "0x342D0xE3F6": 1739,
  "0x342D0xE3F7": 1740
  // valueB ISO, kept for reference,
  // '0x342D0xE3FB': 1741,
  // '0x342D0xE3FC': 1743,
  // '0x342D0xE3FD': 1744,
};
const valueC_WIRELESS = [
  // valueC ANSI Wireless
  "0x342D0xE3D7",
  // 65%
  "0x342D0xE3D8",
  // 75%
  "0x342D0xE3D9",
  // 100%
  // valueC ISO Wireless
  "0x342D0xE3EC",
  // 65%
  "0x342D0xE3ED",
  // 75%
  "0x342D0xE3EE"
  // 100%
];
class valueCFWUpdate extends EventEmitter {
  static instance;
  driverGrpc;
  childProcess;
  hasDongle = false;
  constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new valueCFWUpdate();
    }
    return this.instance;
  }
  async Initialization(deviceInfo, SN, data) {
    try {
      if (this.childProcess != null)
        return;
      this.emit(EventTypes.ProtocolMessage, { Param: { Data: "START" } });
      const execPath = path.parse(data.execPath);
      const realExecPath = path.join(execPath.dir, execPath.name + ".exe");
      await this.startUpdaterExecutable(realExecPath);
      const def = protoLoader__namespace.loadSync(path.join(execPath.dir, "driver.proto"), {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
      const driver = grpc__namespace.loadPackageDefinition(def).driver;
      this.driverGrpc = new driver.DriverGrpc("localhost:3814", grpc__namespace.credentials.createInsecure());
      await this.updateDevice(deviceInfo, SN, data);
    } catch (ex) {
      this.emit(EventTypes.ProtocolMessage, {
        Param: { Data: { Error: ex } }
      });
      await this.stopUpdaterExecutable();
      console.error(ex);
    }
  }
  async updateDevice(dev, SN, _data) {
    const isWireless = valueC_WIRELESS.includes(SN);
    const deviceID = await valueC.getInstance()?.getDeviceID(SN);
    if (!deviceID)
      throw new Error("Could not get device ID!");
    const devicePath = valueC.getInstance().FindDevice(SN);
    const devInfo = {
      dev_id: deviceID,
      vid: parseInt(dev.vid[0], 16),
      pid: parseInt(dev.pid[0], 16),
      devicePath
    };
    const response = await this.getUpgradeInfo(devInfo);
    if (!response)
      throw new Error("Failed to get upgrade info!");
    const value = JSON.parse(response.res);
    const data = value.data;
    const file_path = data.file_path;
    const version_str = data.version_str;
    this.emit(EventTypes.ProtocolMessage, {
      Param: {
        Data: 0,
        message: `### valueC updating device: ${devicePath}, fw: ${file_path}, ver: ${version_str} ### `
      }
    });
    const dongle_idx = dev.StateType.indexOf("Dongle");
    this.hasDongle = dev.FWUpdateExtension.length > 1 && dongle_idx >= 0;
    if (!isWireless && this.hasDongle)
      throw new Error(`Device ${SN} has a dongle but is not marked as wireless!`);
    const updateSequence = isWireless ? UPGRADE_SEQUENCE.Wireless : UPGRADE_SEQUENCE.Wired;
    const upgradeRequest = {
      dev: devInfo,
      file_path,
      version_str,
      upgrade_method: updateSequence
    };
    const progressStream = this.driverGrpc.upgradeDev(upgradeRequest);
    if (!progressStream) {
      this.emit(EventTypes.ProtocolMessage, {
        Param: {
          Data: { Error: "Failed to start device upgrade process!" }
        }
      });
    }
    const multiplier = this.hasDongle ? 50 : 100;
    progressStream.on("data", (progress) => {
      if (progress.err != "") {
        this.emit(EventTypes.ProtocolMessage, {
          Param: {
            Data: { Error: `Device update error: ${progress.err}` }
          }
        });
        throw new Error(progress.err);
      }
      const progressPercent = progress.progress * multiplier;
      this.emit(EventTypes.ProtocolMessage, { Param: { Data: progressPercent } });
    });
    progressStream.on("end", () => {
      console.log(`Update finished`);
      this.emit(EventTypes.ProtocolMessage, { Param: {
        Data: this.hasDongle ? 50 : 100
        /* Upd100 */
      } });
      if (this.hasDongle) {
        const dongleSN = `${dev.vid[dongle_idx]}${dev.pid[dongle_idx]}`;
        this.updateDongle(dongleSN);
      } else {
        this.stopUpdaterExecutable();
      }
    });
    progressStream.on("error", (progress) => {
      console.error(`Update encountered an error: ${progress?.err}`);
      this.emit(EventTypes.ProtocolMessage, {
        Param: {
          Data: { Error: progress?.err }
        }
      });
      throw new Error(`Error during update: ${progress.err}`);
    });
  }
  async updateDongle(dongleSN) {
    const dongleID = DONGLE_DEVICE_ID[dongleSN];
    if (dongleID == null)
      throw new Error("Failed to get dongle ID!");
    const vid = parseInt(dongleSN.substring(0, 6), 16);
    const pid = parseInt(dongleSN.substring(6, 12), 16);
    const devicePath = valueC.getInstance().FindDevice(dongleSN);
    const dongleInfo = {
      dev_id: dongleID,
      vid,
      pid,
      devicePath
    };
    const response = await this.getUpgradeInfo(dongleInfo);
    if (!response)
      throw new Error("Failed to get dongle upgrade info!");
    const value = JSON.parse(response.res);
    const data = value.data;
    const file_path = data.file_path;
    const version_str = data.version_str;
    this.emit(EventTypes.ProtocolMessage, {
      Param: {
        Data: 0,
        message: `### valueC updating dongle: ${devicePath}, fw: ${file_path}, ver: ${version_str} ### `
      }
    });
    const dongleUpgradeRequest = {
      dev: dongleInfo,
      file_path,
      version_str,
      upgrade_method: UPGRADE_SEQUENCE.Dongle
    };
    const progressStream = this.driverGrpc.upgradeDev(dongleUpgradeRequest);
    if (!progressStream) {
      this.emit(EventTypes.ProtocolMessage, {
        Param: {
          Data: { Error: "Failed to start dongle upgrade process!" }
        }
      });
    }
    progressStream.on("data", (progress) => {
      if (progress.err != "") {
        this.emit(EventTypes.ProtocolMessage, {
          Param: { Data: { Error: `Dongle update error: ${progress.err}` } }
        });
        throw new Error(progress.err);
      }
      const progressPercent = 50 * (1 + progress.progress);
      this.emit(EventTypes.ProtocolMessage, { Param: { Data: progressPercent } });
    });
    progressStream.on("end", () => {
      console.log(`Update finished`);
      this.emit(EventTypes.ProtocolMessage, { Param: {
        Data: 100
        /* Upd100 */
      } });
      this.stopUpdaterExecutable();
    });
    progressStream.on("error", (progress) => {
      console.error(`Dongle update encountered an error: ${progress?.err}`);
      this.emit(EventTypes.ProtocolMessage, {
        Param: {
          Data: { Error: progress?.err }
        }
      });
      throw new Error(`Error during update: ${progress?.err}`);
    });
  }
  async getUpgradeInfo(request2) {
    return new Promise((resolve, reject) => {
      this.driverGrpc.getUpgradeInfo(request2, (error, response) => {
        if (error)
          reject(error);
        else
          resolve(response);
      });
    });
  }
  async startUpdaterExecutable(execPath) {
    if (this.childProcess)
      throw new Error("Updater already running!");
    this.childProcess = cp__namespace.execFile(execPath);
    await new Promise((r) => setTimeout(r, 3e3));
    try {
      process.kill(this.childProcess.pid, 0);
    } catch (_ex) {
      this.childProcess = void 0;
      throw new Error("Failed to spawn updater process!");
    }
  }
  async stopUpdaterExecutable() {
    try {
      if (this.childProcess?.pid != null && this.childProcess.pid != 0) {
        process.kill(this.childProcess.pid, "SIGKILL");
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      this.childProcess = void 0;
    }
  }
}
const FirmwareFilenameDeviceMap = /* @__PURE__ */ new Map([
  ["Model_O-", "0x258A0x2013"],
  ["model_o_pro", "0x258A0x2015"],
  ["Model_O_V2", "0x320F0x823A"],
  ["Model_O", "0x258A0x2011"],
  ["MOW_V2", "0x093A0x822A"],
  ["Model_D-", "0x258A0x2014"],
  ["Model_D_Pro", "0x258A0x2017"],
  ["Model_D_V2", "0x320F0x825A"],
  ["Model_D", "0x258A0x2012"],
  ["MDW_V2", "0x093A0x824A"],
  ["Model_I_V2", "0x320F0x831A"],
  ["Model_I", "0x22D40x1503"],
  ["MIW_V2", "0x093A0x821A"],
  ["Series_One_Pro", "0x258A0x2018"],
  ["RGBvalueJ", "0x12CF0x0491"],
  ["GMMK_Pro_ISO_WB", "0x320F0x5093"],
  ["GMMK_Pro_WB", "0x320F0x5092"],
  ["GMMK_Pro_ISO", "0x320F0x5046"],
  ["GMMK_Pro", "0x320F0x5044"],
  ["GMMK_V2_65US", "0x320F0x5045"],
  ["GMMK_V2_65ISO", "0x320F0x504A"],
  ["GMMK_V2_96US", "0x320F0x504B"],
  ["GMMK_V2_96ISO", "0x320F0x505A"],
  ["GMMK_Numpad", "0x320F0x5088"],
  // Temporary
  ["valueC", "0x342D0xE3D7"],
  // valueC 65% Wireless ANSI
  ["valueC", "0x342D0xE3D8"],
  // valueC 75% Wireless ANSI
  ["valueC", "0x342D0xE3D9"],
  // valueC 100% Wireless ANSI
  ["valueC", "0x342D0xE3DA"],
  // valueC 65% ANSI
  ["valueC", "0x342D0xE3DB"],
  // valueC 75% ANSI
  ["valueC", "0x342D0xE3DC"],
  // valueC 100% ANSI
  ["valueC", "0x342D0xE3EC"],
  // valueC 65% Wireless ISO
  ["valueC", "0x342D0xE3ED"],
  // valueC 75% Wireless ISO
  ["valueC", "0x342D0xE3EE"],
  // valueC 100% Wireless ISO
  ["valueC", "0x342D0xE3EF"],
  // valueC 65% ISO
  ["valueC", "0x342D0xE3F0"],
  // valueC 75% ISO
  ["valueC", "0x342D0xE3F1"],
  // valueC 100% ISO
  ["valueC", "0x342D0xE3DD"],
  // valueA valueD HE 65% ANSI
  ["valueC", "0x342D0xE3F2"],
  // valueA valueD HE 65% ISO
  ["valueC", "0x342D0xE3DE"],
  // valueA valueD HE 75% ANSI
  ["valueC", "0x342D0xE3F3"],
  // valueA valueD HE 75% ISO
  ["valueC", "0x342D0xE3DF"],
  // valueA valueD HE 100% ANSI
  ["valueC", "0x342D0xE3F4"]
  // valueA valueD HE 100% ISO
]);
class FWUpdateSilent extends EventEmitter {
  static #instance;
  LaunchWinSocket = LaunchWinSocketLib;
  nedbObj;
  SupportDevice;
  ModelOFWUpdate;
  ModelOV2FWUpdate;
  ModelIFWUpdate;
  valueC;
  constructor() {
    env.log("FWUpdateSilent", "FWUpdateSilent class", "begin");
    super();
    this.nedbObj = AppDB.getInstance();
    this.GetSupportDevice();
  }
  static getInstance() {
    if (this.#instance) {
      env.log("FWUpdateSilent", "getInstance", `Get exist FWUpdateSilent() INSTANCE`);
      return this.#instance;
    } else {
      env.log("FWUpdateSilent", "getInstance", `New FWUpdateSilent() INSTANCE`);
      this.#instance = new FWUpdateSilent();
      return this.#instance;
    }
  }
  /**
   * get data from SupportDeviceDB
   */
  GetSupportDevice(callback) {
    this.nedbObj.getSupportDevice().then((data) => {
      this.SupportDevice = data;
      if (callback != null) {
        callback();
      }
    });
  }
  /**
   * Exec FW  update
   * @param {*} Obj
   */
  LaunchFWUpdate(Obj) {
    var DeviceInfo;
    for (var i = 0; i < this.SupportDevice.length; i++) {
      var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
      if (Obj.SN == sn) {
        DeviceInfo = this.SupportDevice[i];
      }
    }
    var cmdInst = void 0;
    if (Obj.CurrentdeviceSN != Obj.SN && DeviceInfo.routerID == "ModelOV2Series") {
      if (this.ModelOV2FWUpdate == void 0) {
        this.ModelOV2FWUpdate = ModelOV2FWUpdate.getInstance();
        this.ModelOV2FWUpdate.on(EventTypes.ProtocolMessage, this.OnModelOUpdateMessage);
      }
      cmdInst = this.ModelOV2FWUpdate;
    } else if (DeviceInfo.routerID == "ModelOSeries" || DeviceInfo.routerID == "GmmkSeries" || DeviceInfo.routerID == "Gmmk3Series" || DeviceInfo.routerID == "GmmkNumpadSeries" || DeviceInfo.routerID == "ModelOV2Series" || DeviceInfo.routerID == "ModelOWiredSeries" || DeviceInfo.routerID == "ModelOV2WiredSeries") {
      if (this.ModelOFWUpdate == void 0) {
        this.ModelOFWUpdate = ModelOFWUpdate.getInstance();
        this.ModelOFWUpdate.on(
          EventTypes.ProtocolMessage,
          this.OnModelOUpdateMessage.bind(FWUpdateSilent.getInstance())
        );
      }
      cmdInst = this.ModelOFWUpdate;
    } else if (DeviceInfo.routerID == "ModelISeries") {
      if (this.ModelIFWUpdate == void 0) {
        this.ModelIFWUpdate = ModelIFWUpdate.getInstance();
        this.ModelIFWUpdate.on(
          EventTypes.ProtocolMessage,
          this.OnModelOUpdateMessage.bind(FWUpdateSilent.getInstance())
        );
      }
      cmdInst = this.ModelIFWUpdate;
    }
    if (cmdInst != void 0) {
      var ObjFWUpdate = { execPath: Obj.execPath };
      if (Obj.CurrentdeviceSN != Obj.SN && DeviceInfo.routerID == "ModelOV2Series") {
        var ArrayDevInfo = [];
        var BaseInfo;
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
          if (Obj.SN == sn) {
            BaseInfo = JSON.parse(JSON.stringify(this.SupportDevice[i]));
          }
        }
        var iState = BaseInfo.StateType.indexOf("USB");
        BaseInfo.StateID = iState;
        ArrayDevInfo.push(BaseInfo);
        for (var i = 0; i < this.SupportDevice.length; i++) {
          var sn = this.SupportDevice[i].vid[0] + this.SupportDevice[i].pid[0];
          if (Obj.CurrentdeviceSN == sn) {
            BaseInfo = JSON.parse(JSON.stringify(this.SupportDevice[i]));
          }
        }
        var iState = BaseInfo.StateType.indexOf("Dongle");
        BaseInfo.StateID = iState;
        ArrayDevInfo.push(BaseInfo);
        DeviceInfo = JSON.parse(JSON.stringify(ArrayDevInfo));
      }
      cmdInst.Initialization(DeviceInfo, Obj.SN, ObjFWUpdate);
    }
  }
  OnModelOUpdateMessage(Obj) {
    this.emit(EventTypes.UpdateFW, Obj);
  }
  async getExistingFirmwareUpdaters() {
    const files = await fs__namespace.readdir(AppPaths.DownloadsFolder);
    const mappedFiles = [];
    for (let [deviceKey, deviceSN] of FirmwareFilenameDeviceMap) {
      const file = files.find((item) => item.toLowerCase().indexOf(deviceKey.toLowerCase()) > -1);
      if (file != null) {
        mappedFiles.push({ SN: deviceSN, filename: file });
      }
    }
    return mappedFiles;
  }
  beginFirmwareDownloads(items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const deviceInfo = this.SupportDevice.find((entry) => entry.vid[0] + entry.pid[0] == item.SN);
      const downloadHelper = new nodeDownloaderHelper.DownloaderHelper(item.downloadPath, AppPaths.DownloadsFolder, {
        override: true
      });
      downloadHelper.on("start", () => {
        const message = `Download Progress | ${item.name} | Start`;
        env.log("FWUpdateSilent", "beginFirmwareDownloads", message);
        this.emit(EventTypes.DownloadProgress, new IPCProgress(item, "start", null, message));
      });
      downloadHelper.on("progress", (stats) => {
        const message = `Download Progress | ${item.name} | ${stats.progress.toFixed(2)}% [${stats.downloaded.toFixed(2)} / ${stats.total.toFixed(2)}]`;
        env.log("FWUpdateSilent", "beginFirmwareDownloads", message);
        this.emit(EventTypes.DownloadProgress, new IPCProgress(item, "progress", stats, message));
      });
      downloadHelper.on("end", async (stats) => {
        const message = `Download Progress | ${item.name} | Download Completed`;
        env.log("FWUpdateSilent", "beginFirmwareDownloads", message);
        if (stats.fileName.endsWith(".zip")) {
          if (env.isWindows) {
            const downloadedArchivePath = stats.filePath;
            const directoryName = stats.fileName.substring(0, stats.fileName.lastIndexOf("."));
            const baseFileName = directoryName.replace(/\s*?\(\d+\)$/, "");
            const extractedArchiveDirectory = path__namespace.join(AppPaths.DownloadsFolder, baseFileName);
            try {
              const existingExtractedDirectoryStats = await fs__namespace.stat(extractedArchiveDirectory);
              if (existingExtractedDirectoryStats != null) {
                await fs__namespace.rm(extractedArchiveDirectory, { recursive: true, force: true });
              }
            } catch (_) {
            }
            const zip = new AdmZip(downloadedArchivePath);
            zip.extractAllTo(extractedArchiveDirectory, true);
            try {
              const updaterFilepath = deviceInfo.FWUpdateExtension[0] == ".exe" ? path__namespace.join(extractedArchiveDirectory, baseFileName + ".exe") : path__namespace.join(
                extractedArchiveDirectory,
                baseFileName,
                deviceInfo.FWUpdateExtension[0]
              );
              const updaterStats = await fs__namespace.stat(updaterFilepath);
              console.log(updaterStats);
            } catch (exception) {
              console.log(exception);
              const message2 = `Download Progress | ${item.name} | Error: Did not find executable firmware after unpacking the archive.`;
              env.log("FWUpdateSilent", "beginFirmwareDownloads", message2);
              this.emit(EventTypes.DownloadProgress, new IPCProgress(item, "error", null, message2));
              return;
            }
            console.log(zip);
          } else if (env.isMac)
            ;
        }
        this.emit(EventTypes.DownloadProgress, new IPCProgress(item, "complete", stats, message));
      });
      downloadHelper.on("error", (err) => {
        const message = `Download Progress | ${item.name} | Download Failed: ${JSON.stringify(err, void 0, 2)}`;
        env.log("FWUpdateSilent", "beginFirmwareDownloads", message);
        this.emit(EventTypes.DownloadProgress, new IPCProgress(item, "error", null, message));
      });
      downloadHelper.start();
    }
  }
  async beginFirmwareUpdates(items) {
    const files = await fs__namespace.readdir(AppPaths.DownloadsFolder, {
      withFileTypes: true
    });
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const deviceInfo = this.SupportDevice.find((entry) => entry.vid[0] + entry.pid[0] == item.SN);
      console.log(deviceInfo);
      if (deviceInfo == null) {
        return;
      }
      let updaterInstance = null;
      if (deviceInfo.routerID == "ModelOSeries" || deviceInfo.routerID == "GmmkSeries" || deviceInfo.routerID == "Gmmk3Series" || deviceInfo.routerID == "GmmkNumpadSeries" || deviceInfo.routerID == "ModelOV2Series" || deviceInfo.routerID == "ModelOWiredSeries" || deviceInfo.routerID == "ModelOV2WiredSeries" || deviceInfo.routerID == "RGBvalueJSeries") {
        if (this.ModelOFWUpdate == void 0) {
          this.ModelOFWUpdate = ModelOFWUpdate.getInstance();
          this.ModelOFWUpdate.on(EventTypes.ProtocolMessage, this.onFirmwareUpdateMessage.bind(this, item));
        }
        updaterInstance = this.ModelOFWUpdate;
      } else if (deviceInfo.routerID == "ModelISeries") {
        if (this.ModelIFWUpdate == void 0) {
          this.ModelIFWUpdate = ModelIFWUpdate.getInstance();
          this.ModelIFWUpdate.on(EventTypes.ProtocolMessage, this.OnModelOUpdateMessage.bind(this, item));
        }
        updaterInstance = this.ModelIFWUpdate;
      } else if (deviceInfo.routerID == "valueC") {
        if (this.valueC == null) {
          this.valueC = valueCFWUpdate.getInstance();
          this.valueC.on(EventTypes.ProtocolMessage, this.onFirmwareUpdateMessage.bind(this, item));
        }
        updaterInstance = this.valueC;
      }
      if (updaterInstance == null) {
        console.error("No updater instance set.");
        return;
      }
      let deviceKey = "";
      for (let [key, deviceSN] of FirmwareFilenameDeviceMap) {
        if (item.SN == deviceSN) {
          deviceKey = key;
          break;
        }
      }
      const file = files.find(
        (item2) => item2.isFile() == true ? item2.name.toLowerCase().indexOf(deviceKey.toLowerCase()) > -1 : false
      );
      if (file == null) {
        console.error("No updater file found.");
        return;
      }
      const fileBaseName = file.name.substring(0, file.name.lastIndexOf("."));
      const fileNameWithoutCopyNumber = fileBaseName.replace(/\s*?\(\d+\)$/, "");
      updaterInstance.Initialization(deviceInfo, item.SN, {
        execPath: path__namespace.join(AppPaths.DownloadsFolder, fileNameWithoutCopyNumber, file.name)
      });
    }
  }
  onFirmwareUpdateMessage(item, obj) {
    let message = `Update Progress | ${item.name} | `;
    let value = null;
    let type = "start";
    if (obj.Param?.Data == null) {
      return;
    }
    if (obj.Param.message) {
      message += obj.Param.message;
    }
    if (obj.Param.Data == "START") {
      message += "Start";
    } else if (obj.Param.Data?.Error != null) {
      type = "error";
      message += `Error: ${obj.Param?.Data.Error}`;
    } else {
      const parsedProgress = parseFloat(obj.Param.Data);
      if (!isNaN(parsedProgress)) {
        type = "progress";
        message += `${parsedProgress.toFixed(2)}%`;
        value = parsedProgress;
      }
      if (parsedProgress == 100) {
        this.emit(EventTypes.UpdateFW, new IPCProgress(item, type, value, message));
        type = "complete";
        message += "Update Complete";
      }
    }
    this.emit(EventTypes.UpdateFW, new IPCProgress(item, type, value, message));
  }
  // env.log('UpdateClass','UpdateClass','DownloadInstallPackage')
  //     try{
  //         var packPath = os.tmpdir()+"/"+AppData.ProjectName+"FW.zip";
  //         this.DownloadFileCancel = false;
  //         env.log('UpdateClass','DownloadInstallPackage',`package:${packPath}`);
  //         var pathExt = path.extname(packPath).toLowerCase();
  //         var dirName = path.join(path.dirname(packPath), 'GSPYFWUpdate');
  //         if (fs.existsSync(dirName)){
  //             env.DeleteFolderRecursive(dirName, false);
  //         }else{
  //             fs.mkdirSync(dirName);
  //         }
  //         if(env.isMac && pathExt === '.zip'){
  //             cp.execFile('/usr/bin/unzip',['-q','-o',packPath,'-d',dirName],(err, stdout, stderr) => {
  //                 if(err != undefined && err != null){
  //                     env.log('Error','DownloadInstallPackage',`upzip error : ${err}`);
  //                 }
  //                 if(stderr != undefined && stderr != null){
  //                     env.log('Error','DownloadInstallPackage',`upzip error :`+stderr);
  //                 }
  //                 var baseName = this.GetExtFilePath(dirName, '.mpkg');
  //                 if (baseName === undefined){
  //                     baseName = this.GetExtFilePath(dirName, '.pkg');
  //                 }
  //                 if (baseName === undefined){
  //                     env.log('Error','DownloadInstallPackage',`Not found .mpkg file in:${dirName}`);
  //                     callback(0x1008);
  //                     return;
  //                 }
  //                 cp.execFile('/bin/chmod',['777',baseName],(err, stdout, stderr) => {
  //                     if(err!=undefined && err!=null){
  //                         env.log('Error','DownloadInstallPackage',`chomd error:${err}`);
  //                     }
  //                     if(stderr != undefined && stderr != null){
  //                         env.log('Error','DownloadInstallPackage',`chomd error:${stderr}`);
  //                     }
  //                     fs.unlink(packPath,() => {
  //                         env.log('UpdateClass','DownloadInstallPackage',`run insPack:${baseName}`);
  //                         shell.openPath(baseName!);
  //                         callback();
  //                     });
  //                 });
  //             });
  //         }else if(env.isWindows && pathExt === '.zip'){
  //             try
  //             {
  //                 var zip = new AdmZip(packPath);
  //                 zip.extractAllTo(dirName, true);
  //                 var baseName = this.GetExtFilePath(dirName, '.exe');
  //                 if (baseName === undefined){
  //                     env.log('Error','DownloadInstallPackage',`Not found .exe file in ${dirName}`);
  //                     callback(0x1008);
  //                     return;
  //                 }
  //                 fs.unlink(packPath,function ()
  //                 {
  //                     env.log('UpdateClass','DownloadInstallPackage',`run insPack:${dirName}`);
  //                     try
  //                     {
  //                         shell.openPath(baseName!);
  //                     }catch(e){
  //                         env.log('Error','openPath error : ',e);
  //                     }
  //                     callback();
  //                 });
  //             }catch(e){
  //                 env.log('UpdateClass','openPath : ',(e as Error).toString());
  //             }
  //         }
  //     }catch(ex){
  //         env.log('Error','DownloadInstallPackage',`ex:${(ex as Error).message}`);
  //         callback(0x1008);
  //     }
}
class DBCheckService extends EventEmitter {
  static #instance;
  AppDB;
  constructor(AppDB2) {
    super();
    this.AppDB = AppDB2;
  }
  static getInstance(AppDB2) {
    if (this.#instance) {
      env.log("DBCheckService", "getInstance", `Get exist Device() INSTANCE`);
      return this.#instance;
    } else {
      env.log("DBCheckService", "getInstance", `New Device() INSTANCE`);
      this.#instance = new DBCheckService(AppDB2);
      return this.#instance;
    }
  }
  /**
   * get data from SupportDeviceDB
   */
  CheckDevicedata(callback) {
    this.AppDB.getSupportDevice().then((arrSupportDevicedata) => {
      this.AppDB.getAllDevice().then((result) => {
        const arrDevicedata = result;
        if (arrDevicedata) {
          for (let index = 0; index < arrDevicedata.length; index++) {
            var SupportDevicedata;
            for (let index2 = 0; index2 < arrSupportDevicedata.length; index2++) {
              var SupportSN = arrSupportDevicedata[index2].vid[0] + arrSupportDevicedata[index2].pid[0];
              if (SupportSN == arrDevicedata[index].SN) {
                SupportDevicedata = arrSupportDevicedata[index2];
                break;
              }
            }
            if (this.KeybindingCheck(SupportDevicedata, arrDevicedata[index])) {
              this.AppDB.updateDevice(arrDevicedata[index].SN, arrDevicedata[index]);
            }
          }
        }
        callback();
      });
    });
  }
  /**
   * get data from SupportDeviceDB
   */
  KeybindingCheck(SupportDevicedata, Devicedata) {
    if (Devicedata.SN == "0x22D40x1503") {
      if (Devicedata.profile[0].keybindingLayerShift == void 0) {
        for (let i = 0; i < Devicedata.profile.length; i++) {
          Devicedata.profile[i].keybindingLayerShift = SupportDevicedata.defaultProfile[i].keybindingLayerShift;
        }
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
}
const AppData = {
  "ProjectName": "BK700",
  "Version": "1.0.0.0",
  "UpdateUrl": "http://gspy.ddns.net:9527/files/BK700/Update/",
  "FWVersion": "1001"
};
class UpdateClass extends EventEmitter {
  AppFileDownload;
  ProxyEnable;
  ProxyHost;
  ProxyPort;
  DownloadFileCancel;
  CheckDownloadTimeoutId;
  constructor() {
    super();
    env.log("UpdateClass", "UpdateClass", "Begin...");
    this.AppFileDownload = false;
  }
  GetEventParamerObj(sn, func, param) {
    var Obj = {
      Type: FuncType.System,
      SN: sn,
      Func: func,
      Param: param
    };
    return Obj;
  }
  GetExtFilePath(aPath, ext) {
    var files = [];
    if (fs.existsSync(aPath)) {
      files = fs.readdirSync(aPath);
      for (var file of files) {
        if (file.endsWith(ext)) {
          var curPath = path.join(aPath, file);
          return curPath;
        }
      }
    }
  }
  UpdateApp = () => {
    env.log("UpdateClass", "UpdateClass", "UpdateApp");
    return new Promise((resolve, reject) => {
      try {
        if (env.isMac && fs.existsSync(os$1.tmpdir() + "/GSPYUpdate")) {
          var Obj = {
            Type: FuncType.System,
            Func: EventTypes.UpdateApp,
            Param: 0
          };
          this.emit(EventTypes.ProtocolMessage, Obj);
          return resolve();
        } else if (env.isWindows && fs.existsSync(os$1.tmpdir() + "\\GSPYUpdate")) {
          var Obj = {
            Type: FuncType.System,
            SN: null,
            Func: EventTypes.UpdateApp,
            Param: 0
          };
          this.emit(EventTypes.ProtocolMessage, Obj);
          return resolve();
        }
        request.get(AppData.UpdateUrl + "/UpdateApp.json", (err, resp, body) => {
          var body = JSON.parse(body);
          if (body.hasOwnProperty("Version") && env.CompareVersion(AppData.Version, body.Version)) {
            var fromFile;
            var toFile;
            if (env.isWindows) {
              fromFile = AppData.UpdateUrl + body.AppName.Win;
              toFile = os$1.tmpdir() + "\\" + AppData.ProjectName + ".zip";
            } else {
              fromFile = AppData.UpdateUrl + body.AppName.Mac;
              toFile = os$1.tmpdir() + "/" + AppData.ProjectName + ".zip";
            }
            this.DownloadFileFromURL(fromFile, toFile, true).then((obj) => {
              env.log("UpdateClass", "UpdateApp", "DownloadFileFromURL success");
              var Obj2 = {
                Type: FuncType.System,
                SN: null,
                Func: EventTypes.UpdateApp,
                Param: 0
              };
              this.emit(EventTypes.ProtocolMessage, Obj2);
              resolve();
            });
          } else {
            resolve();
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };
  DownloadFileFromURL = (url, dest, emitProgress) => {
    return new Promise((resolve, reject) => {
      try {
        env.log("UpdateClass", "DownloadFileFromURL", `Begin downloadFile:${url}      ${dest}`);
        var isError = false;
        var preStep = 0, curStep = 0;
        var urlObj = gUrl.parse(url);
        var protocol = urlObj.protocol == "https:" ? https : http;
        var opts;
        var req = null;
        if (this.ProxyEnable) {
          opts = {
            host: this.ProxyHost,
            port: this.ProxyPort,
            path: url,
            // timeout:5000,
            headers: {
              Host: urlObj.host
            }
          };
        } else {
          opts = url;
        }
        var file = fs.createWriteStream(dest);
        req = protocol.get(opts, (response) => {
          var totalLen = parseInt(response.headers["content-length"], 10);
          var cur = 0;
          file.on("finish", () => {
            file.close((_) => {
              if (!isError) {
                resolve({ Data: dest });
              }
            });
          });
          if (emitProgress) {
            response.on("data", (chunk) => {
              cur += chunk.length;
              curStep = Math.floor(cur / totalLen * 100);
              if (preStep !== curStep) {
                preStep = curStep;
                var Obj2 = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: cur, Total: totalLen });
                this.emit(EventTypes.ProtocolMessage, Obj2);
              }
              if (this.DownloadFileCancel) {
                env.log("UpdateClass", "DownloadFileFromURL", `User Cancel DownloadFile`);
                req.abort();
                this.DownloadFileCancel = false;
              }
              if (this.CheckDownloadTimeoutId != null) {
                clearTimeout(this.CheckDownloadTimeoutId);
                this.CheckDownloadTimeoutId = null;
              }
              this.CheckDownloadTimeoutId = setTimeout(() => {
                env.log("UpdateClass", "DownloadFileFromURL", `server is not responsed`);
                file.close((_) => {
                  fs.unlink(dest, () => {
                    var obj2 = {
                      Error: 4104,
                      Data: null
                    };
                    resolve(obj2);
                    req.abort();
                    this.DownloadFileCancel = false;
                  });
                });
              }, 15e3);
            });
            response.on("end", (chunk) => {
              env.log("UpdateClass", "DownloadFileFromURL", `get data end`);
              if (this.CheckDownloadTimeoutId != null) {
                clearTimeout(this.CheckDownloadTimeoutId);
                this.CheckDownloadTimeoutId = null;
              }
            });
          }
          response.pipe(file);
        }).on("error", (err) => {
          isError = true;
          this.DownloadFileCancel = false;
          env.log("Error", "DownloadFileFromURL", `[downloadFile error:${err} url:${url}]`);
          file.close((_) => {
            fs.unlink(dest, () => {
              var obj2 = {
                Error: 4104,
                Data: err
              };
              resolve(obj2);
            });
          });
          var Obj2 = this.GetEventParamerObj(null, EventTypes.DownloadFileError, null);
          this.emit(EventTypes.ProtocolMessage, Obj2);
          if (this.CheckDownloadTimeoutId != null) {
            clearTimeout(this.CheckDownloadTimeoutId);
            this.CheckDownloadTimeoutId = null;
          }
        });
      } catch (ex) {
        env.log("Error", "DownloadFileFromURL", `ex:${ex.message}`);
        var obj = {
          Error: 4104,
          Data: ex
        };
        if (this.CheckDownloadTimeoutId != null) {
          clearTimeout(this.CheckDownloadTimeoutId);
          this.CheckDownloadTimeoutId = null;
        }
        var Obj = this.GetEventParamerObj(null, EventTypes.DownloadFileError, null);
        this.emit(EventTypes.ProtocolMessage, Obj);
        resolve(obj);
      }
    });
  };
  DownloadInstallPackage = (callback) => {
    env.log("UpdateClass", "UpdateClass", "DownloadInstallPackage");
    try {
      var packPath = os$1.tmpdir() + "/" + AppData.ProjectName + ".zip";
      this.DownloadFileCancel = false;
      env.log("UpdateClass", "DownloadInstallPackage", `package:${packPath}`);
      var pathExt = path.extname(packPath).toLowerCase();
      var dirName = path.join(path.dirname(packPath), "GSPYUpdate");
      if (fs.existsSync(dirName)) {
        env.DeleteFolderRecursive(dirName, false);
      } else {
        fs.mkdirSync(dirName);
      }
      if (env.isMac && pathExt === ".zip") {
        cp.execFile("/usr/bin/unzip", ["-q", "-o", packPath, "-d", dirName], (err, stdout, stderr) => {
          if (err != void 0 && err != null) {
            env.log("Error", "DownloadInstallPackage", `upzip error : ${err}`);
          }
          if (stderr != void 0 && stderr != null) {
            env.log("Error", "DownloadInstallPackage", `upzip error :` + stderr);
          }
          var baseName2 = this.GetExtFilePath(dirName, ".mpkg");
          if (baseName2 === void 0) {
            baseName2 = this.GetExtFilePath(dirName, ".pkg");
          }
          if (baseName2 === void 0) {
            env.log("Error", "DownloadInstallPackage", `Not found .mpkg file in:${dirName}`);
            callback(4104);
            return;
          }
          cp.execFile("/bin/chmod", ["777", baseName2], (err2, stdout2, stderr2) => {
            if (err2 != void 0 && err2 != null) {
              env.log("Error", "DownloadInstallPackage", `chomd error:${err2}`);
            }
            if (stderr2 != void 0 && stderr2 != null) {
              env.log("Error", "DownloadInstallPackage", `chomd error:${stderr2}`);
            }
            fs.unlink(packPath, () => {
              env.log("UpdateClass", "DownloadInstallPackage", `run insPack:${baseName2}`);
              electron.shell.openPath(baseName2);
              callback();
            });
          });
        });
      } else if (env.isWindows && pathExt === ".zip") {
        try {
          var zip = new AdmZip(packPath);
          zip.extractAllTo(dirName, true);
          var baseName = this.GetExtFilePath(dirName, ".exe");
          if (baseName === void 0) {
            env.log("Error", "DownloadInstallPackage", `Not found .exe file in ${dirName}`);
            callback(4104);
            return;
          }
          fs.unlink(packPath, function() {
            env.log("UpdateClass", "DownloadInstallPackage", `run insPack:${dirName}`);
            try {
              electron.shell.openPath(baseName);
            } catch (e) {
              env.log("Error", "openPath error : ", e);
            }
            callback();
          });
        } catch (e) {
          env.log("UpdateClass", "openPath : ", e.toString());
        }
      }
    } catch (ex) {
      env.log("Error", "DownloadInstallPackage", `ex:${ex.message}`);
      callback(4104);
    }
  };
  UpdateFW = () => {
    env.log("UpdateClass", "UpdateClass", "UpdateFW");
    return new Promise((resolve, reject) => {
      try {
        if (env.isMac && fs.existsSync(os$1.tmpdir() + "/GSPYFWUpdate")) {
          var Obj = {
            Type: FuncType.System,
            Func: EventTypes.UpdateFW,
            Param: 0
          };
          this.emit(EventTypes.ProtocolMessage, Obj);
          return resolve();
        } else if (env.isWindows && fs.existsSync(os$1.tmpdir() + "\\GSPYFWUpdate")) {
          var Obj = {
            Type: FuncType.System,
            SN: null,
            Func: EventTypes.UpdateFW,
            Param: 0
          };
          this.emit(EventTypes.ProtocolMessage, Obj);
          return resolve();
        }
        request.get(AppData.UpdateUrl + "/UpdateApp.json", (err, resp, body) => {
          var body = JSON.parse(body);
          if (body.hasOwnProperty("FWVersion") && env.CompareVersion(AppData.FWVersion, body.FWVersion)) {
            var fromFile;
            var toFile;
            if (env.isWindows) {
              fromFile = AppData.UpdateUrl + body.FWName.Win;
              toFile = os$1.tmpdir() + "\\" + AppData.ProjectName + "FW.zip";
            } else {
              fromFile = AppData.UpdateUrl + body.FWName.Mac;
              toFile = os$1.tmpdir() + "/" + AppData.ProjectName + "FW.zip";
            }
            this.DownloadFileFromURL(fromFile, toFile, true).then((obj) => {
              env.log("UpdateClass", "UpdateApp", "DownloadFileFromURL success");
              var Obj2 = {
                Type: FuncType.System,
                SN: null,
                Func: EventTypes.UpdateFW,
                Param: 0
              };
              this.emit(EventTypes.ProtocolMessage, Obj2);
              resolve();
            });
          } else {
            env.log("UpdateClass", "UpdateApp", "DownloadFileFromURL fail");
            resolve();
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };
  DownloadFWInstallPackage = (callback) => {
    env.log("UpdateClass", "UpdateClass", "DownloadInstallPackage");
    try {
      var packPath = os$1.tmpdir() + "/" + AppData.ProjectName + "FW.zip";
      this.DownloadFileCancel = false;
      env.log("UpdateClass", "DownloadInstallPackage", `package:${packPath}`);
      var pathExt = path.extname(packPath).toLowerCase();
      var dirName = path.join(path.dirname(packPath), "GSPYFWUpdate");
      if (fs.existsSync(dirName)) {
        env.DeleteFolderRecursive(dirName, false);
      } else {
        fs.mkdirSync(dirName);
      }
      if (env.isMac && pathExt === ".zip") {
        cp.execFile("/usr/bin/unzip", ["-q", "-o", packPath, "-d", dirName], (err, stdout, stderr) => {
          if (err != void 0 && err != null) {
            env.log("Error", "DownloadInstallPackage", `upzip error : ${err}`);
          }
          if (stderr != void 0 && stderr != null) {
            env.log("Error", "DownloadInstallPackage", `upzip error :` + stderr);
          }
          var baseName2 = this.GetExtFilePath(dirName, ".mpkg");
          if (baseName2 === void 0) {
            baseName2 = this.GetExtFilePath(dirName, ".pkg");
          }
          if (baseName2 === void 0) {
            env.log("Error", "DownloadInstallPackage", `Not found .mpkg file in:${dirName}`);
            callback(4104);
            return;
          }
          cp.execFile("/bin/chmod", ["777", baseName2], (err2, stdout2, stderr2) => {
            if (err2 != void 0 && err2 != null) {
              env.log("Error", "DownloadInstallPackage", `chomd error:${err2}`);
            }
            if (stderr2 != void 0 && stderr2 != null) {
              env.log("Error", "DownloadInstallPackage", `chomd error:${stderr2}`);
            }
            fs.unlink(packPath, () => {
              env.log("UpdateClass", "DownloadInstallPackage", `run insPack:${baseName2}`);
              electron.shell.openPath(baseName2);
              callback();
            });
          });
        });
      } else if (env.isWindows && pathExt === ".zip") {
        try {
          var zip = new AdmZip(packPath);
          zip.extractAllTo(dirName, true);
          var baseName = this.GetExtFilePath(dirName, ".exe");
          if (baseName === void 0) {
            env.log("Error", "DownloadInstallPackage", `Not found .exe file in ${dirName}`);
            callback(4104);
            return;
          }
          fs.unlink(packPath, function() {
            env.log("UpdateClass", "DownloadInstallPackage", `run insPack:${dirName}`);
            try {
              electron.shell.openPath(baseName);
            } catch (e) {
              env.log("Error", "openPath error : ", e);
            }
            callback();
          });
        } catch (e) {
          env.log("UpdateClass", "openPath : ", e.toString());
        }
      }
    } catch (ex) {
      env.log("Error", "DownloadInstallPackage", `ex:${ex.message}`);
      callback(4104);
    }
  };
  downloadFile = (url, Filepath) => {
    global.UpdateFlag = true;
    env.log("update", "downloadFile", `start donwload url:${url}`);
    return new Promise((resolve, reject) => {
      try {
        var urlObj = gUrl.parse(url);
        var protocol = urlObj.protocol == "https:" ? https : http;
        ;
        let temptext;
        var Files = fs.createWriteStream(Filepath);
        var buffer2 = "";
        let request2 = protocol.get(url, { rejectUnauthorized: false }, (response) => {
          var len = parseInt(response.headers["content-length"], 10);
          var cur = 0;
          var total = len / 1048576;
          request2.on("error", (e) => {
            env.log("update.js", "downloadFile", `${e}`);
            var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: `downloadFile_Fail:${e}`, Func: "DownloadProgress" });
            this.emit(EventTypes.ProtocolMessage, Obj);
            global.UpdateFlag = false;
            resolve();
            request2.abort();
          });
          response.on("data", (chunk) => {
            buffer2 += chunk;
            cur += chunk.length;
            temptext = "Downloading " + (100 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r.<br/> Total size: " + total.toFixed(2) + " mb";
            console.log(temptext);
            env.log("update.js", "downloadFile", temptext);
            let progress = (100 * cur / len).toFixed(0);
            var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: progress, Func: "DownloadProgress" });
            this.emit(EventTypes.ProtocolMessage, Obj);
          });
          response.on("end", () => {
            temptext = "Downloading complete";
            env.log("update.js", "downloadFile", "Downloading complete");
            console.log(temptext);
          });
          response.pipe(Files);
          Files.on("finish", () => {
            Files.close((error) => {
              if (error) {
                env.log("update.js", "downloadFile", `${error}`);
                var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: "downloadFile_Fail", Func: "DownloadProgress" });
                this.emit(EventTypes.ProtocolMessage, Obj);
                resolve();
                return;
              }
              var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: "Success", Func: "DownloadProgress" });
              if (Filepath.indexOf(".zip") != -1) {
                try {
                  let Zip = new AdmZip(Filepath);
                  Zip.extractAllTo(AppPaths.DownloadsFolder + "\\", true);
                  this.emit(EventTypes.ProtocolMessage, Obj);
                } catch (e) {
                  env.log("update", "DownloadProgress", `err:${e}`);
                  var AdmZipFail = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: "AdmZip_Fail", Func: "DownloadProgress" });
                  this.emit(EventTypes.ProtocolMessage, AdmZipFail);
                  resolve();
                  return;
                }
              } else {
                this.emit(EventTypes.ProtocolMessage, Obj);
              }
              resolve();
            });
          });
          Files.on("error", () => {
            env.log("update.js", "downloadFile", "downloadFile_Fail,Files.on error");
            var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: "downloadFile_Fail", Func: "DownloadProgress" });
            this.emit(EventTypes.ProtocolMessage, Obj);
            resolve();
          });
        }).on("error", (err) => {
          env.log("update.js", "downloadFile", `${err}`);
          var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: `downloadFile_Fail${err}`, Func: "DownloadProgress" });
          this.emit(EventTypes.ProtocolMessage, Obj);
          global.UpdateFlag = false;
          resolve();
          request2.abort();
        }).setTimeout(15e3, () => {
          env.log("update.js", "downloadFile", "timeout");
          var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, { Current: "downloadFile_Fail", Func: "DownloadProgress" });
          this.emit(EventTypes.ProtocolMessage, Obj);
          global.UpdateFlag = false;
          resolve();
          request2.abort();
        });
      } catch (e) {
        env.log("update", "downloadFile", `err:${e}`);
        resolve();
      }
    });
  };
}
function ClearFolder(folderpath) {
  let folder_exists = fs.existsSync(folderpath);
  if (folder_exists) {
    let filelist = fs.readdirSync(folderpath, { withFileTypes: true });
    filelist.forEach(function(file) {
      if (file.isFile()) {
        fs.unlinkSync(path$1.join(folderpath, file.name));
      } else if (file.isDirectory()) {
        const dir = path$1.join(folderpath, file.name);
        ClearFolder(dir);
        fs.rmdir(dir, (exception) => {
          console.log(exception);
          env.log("Tool", "ClearFolder", exception);
        });
      }
    });
  }
}
class ProtocolInterface extends EventEmitter {
  //支援机种
  SupportDevice = void 0;
  hiddevice = HidLib;
  LaunchWinSocket = LaunchWinSocketLib;
  //是否拔插时正刷新设备列表
  IsRefreshDevice = false;
  AppDB = false;
  update = false;
  //当前最前程序路径
  //ForegroundAppPath = undefined;
  deviceService;
  FWUpdateService;
  DBCheckService;
  constructor() {
    super();
    try {
      env.log("Interface", "ProtocolInterface", " New ProtocolInterface INSTANCE. ");
      this.AppDB = AppDB.getInstance();
      this.deviceService = DeviceService.getInstance();
      this.deviceService.on(EventTypes.ProtocolMessage, this.OnProtocolMessage.bind(this));
      this.FWUpdateService = FWUpdateSilent.getInstance();
      this.FWUpdateService.on(EventTypes.ProtocolMessage, this.OnFWUpdateMessage.bind(this));
      this.DBCheckService = DBCheckService.getInstance(this.AppDB);
      this.update = new UpdateClass();
      this.update.on(EventTypes.ProtocolMessage, this.OnProtocolMessage.bind(this));
      this.hiddevice.DebugMessageCallback(this.DebugCallback);
      this.hiddevice.StartHidPnpNotify();
      this.hiddevice.HIDPnpCallBack(this.HIDDevicePnp.bind(this));
      if (this.hiddevice === void 0)
        env.log("Interface", "InterfaceClass", `hiddevice init error.`);
      this.DBCheckService.CheckDevicedata(() => {
      });
      this.ClearDownloadFile();
    } catch (ex) {
      env.log("Interface Error", "ProtocolInterface", `ex:${ex.message}`);
    }
  }
  InitDevice(callback) {
    this.deviceService.initDevice().then(() => {
      console.log("initDevice finish");
      env.log("ProtocolInterface", "InitDevice", "initDevice finish");
    });
  }
  DeleteMacro(obj) {
    return new Promise((resolve, reject) => {
      this.deviceService.DeleteMacro(obj).then(() => {
        env.log("ProtocolInterface", "DeleteMacro", "DeleteMacro finish");
        resolve();
      });
    });
  }
  CloseAllDevice(callback) {
    return new Promise((resolve) => {
      try {
        env.log("Interface", "CloseAllDevice", ` Begin Close Device `);
        resolve(0);
      } catch (ex) {
        env.log("Interface Error", "CloseAllDevice", `ex:${ex.message}`);
        resolve(0);
      }
    });
  }
  HIDDevicePnp(Obj) {
    this.deviceService.HotPlug(Obj);
  }
  DebugCallback(Obj) {
    env.log("Interface", "DebugCallback", JSON.stringify(Obj));
  }
  KeyDataCallback(Obj) {
    var Obj2 = {
      Type: FuncType.System,
      SN: null,
      Func: EventTypes.KeyDataCallback,
      Param: Obj
    };
    this.emit(EventTypes.ProtocolMessage, Obj2);
  }
  OnProtocolMessage(Obj) {
    this.emit(EventTypes.ProtocolMessage, Obj);
  }
  OnFWUpdateMessage(Obj) {
    if (Obj.Func == "SendFWUPDATE") {
      console.log("SendFWUPDATE: ", Obj.Param.Data);
    }
    if (env.BuiltType == 1) {
      this.emit(EventTypes.ProtocolMessage, Obj);
    } else if (Obj.Func == EventTypes.SendFWUPDATE && Obj.Param.Data == "PASS") {
      this.deviceService.RefreshAllDevices();
      this.deviceService.initDevicebySN(Obj.SN, (res) => {
        this.deviceService.StartBatteryTimeBySN(Obj.SN);
        this.hiddevice.SwitchHidIntercept(false);
        if (!res) {
          Obj.Param.Data = "FAIL";
        }
        this.deviceService.StartBatteryTimeBySN(Obj.SN);
        this.emit(EventTypes.ProtocolMessage, Obj);
      });
    } else if (Obj.Func == EventTypes.SendFWUPDATE && Obj.Param.Data == "FAIL") {
      this.deviceService.initDevicebySN(Obj.SN, (res) => {
        this.deviceService.StartBatteryTimeBySN(Obj.SN);
        this.hiddevice.SwitchHidIntercept(false);
        this.emit(EventTypes.ProtocolMessage, Obj);
      });
    } else if (Obj.Func == "DonglePairing") {
      this.deviceService.DonglePairing(Obj.SN);
    } else {
      this.emit(EventTypes.ProtocolMessage, Obj);
    }
  }
  OnPairingMessage(Obj) {
    this.emit(EventTypes.ProtocolMessage, Obj);
  }
  async RunFunction(Obj, callback) {
    try {
      if (!this.CheckParam(Obj)) {
        callback("Error", "ProtocolInterface.RunFunction");
        return;
      }
      if (Obj.Func == FuncName.InitDevice) {
        await this.InitDevice(callback);
        return;
      } else if (Obj.Func == "ClearDownloadFile") {
        await this.ClearDownloadFile();
        return;
      } else if (Obj.Func == FuncName.UpdateApp) {
        await this.update.UpdateApp();
        return;
      } else if (Obj.Func == FuncName.DownloadInstallPackage) {
        await this.update.DownloadInstallPackage();
        return;
      } else if (Obj.Func == FuncName.UpdateFW) {
        await this.update.UpdateFW();
        return;
      } else if (Obj.Func == FuncName.downloadFile) {
        await this.downloadFile(Obj.Param);
        return;
      } else if (Obj.Func == FuncName.DownloadFWInstallPackage) {
        await this.update.DownloadFWInstallPackage();
        return;
      } else if (Obj.Func == FuncName.ExecFile) {
        await this.ExecFile(Obj.Param, callback);
        return;
      } else if (Obj.Func == FuncName.LaunchFWUpdate) {
        await this.hiddevice.SwitchHidIntercept(true);
        Obj.Param.CurrentdeviceSN = Obj.SN;
        await this.FWUpdateService.LaunchFWUpdate(Obj.Param);
        await this.deviceService.DeleteBatteryTimeBySN(Obj.SN);
        return;
      } else if (Obj.Func == FuncName.ChangeWindowSize) {
        var options = {
          Type: FuncType.System,
          Func: EventTypes.ChangeWindowSize,
          Param: Obj.Param
        };
        this.emit(EventTypes.ProtocolMessage, options);
        return;
      } else if (Obj.Func == FuncName.ShowWindow) {
        var options = {
          Type: FuncType.System,
          Func: EventTypes.ShowWindow,
          Param: Obj.Param
        };
        this.emit(EventTypes.ProtocolMessage, options);
        return;
      } else if (Obj.Func == FuncName.QuitApp) {
        var options = {
          Type: FuncType.System,
          Func: EventTypes.QuitApp,
          Param: Obj.Param
        };
        this.emit(EventTypes.ProtocolMessage, options);
        return;
      } else if (Obj.Func == FuncName.HideApp) {
        var options = {
          Type: FuncType.System,
          Func: EventTypes.HideApp,
          Param: Obj.Param
        };
        this.emit(EventTypes.ProtocolMessage, options);
        return;
      } else if (Obj.Type == FuncType.System) {
        var fn = this[Obj.Func];
        fn(Obj.Param).then((data) => {
          callback(data);
        });
        return;
      }
      switch (Obj.Type) {
        case FuncType.Device:
        case FuncType.Mouse:
        case FuncType.Keyboard:
          await this.deviceService.RunFunction(Obj, callback);
          break;
        default:
          callback("InterFace RunFun Error", Obj.Type);
          return;
      }
    } catch (ex) {
      env.log("Interface Error", "RunFunction", ` ex:${ex.message}`);
    }
  }
  ExecFile = (obj, callback) => {
    env.log("interface", "ExecFile", `${obj.path}`);
    var exec = require("child_process").exec;
    if (obj.path.indexOf("UpdateApp.bat") != -1) {
      let batPath = path.resolve(path.join(AppPaths.DownloadsFolder, "/UpdateApp.bat"));
      if (fs.existsSync(batPath))
        fs.unlinkSync(batPath);
      let filename = obj.filename.split(".zip")[0];
      filename = path.resolve(path.join(AppPaths.DownloadsFolder, "/" + filename));
      let batData = 'chcp 65001\r\nstart "" "' + filename + '.exe" /SUPPRESSMSGBOXES /NORESTART';
      fs.writeFileSync(batPath, batData);
      var T_Path_Stringify = JSON.stringify(obj.path);
      exec(T_Path_Stringify, (err, data) => {
        if (err) {
          env.log("ProtocolInterface", "ExecFile", err);
          callback(err);
        } else {
          env.log("ProtocolInterface", "ExecFile", "success");
          callback("success");
        }
      });
    } else {
      exec(T_Path_Stringify, (err, data) => {
        if (err) {
          env.log("ProtocolInterface", "ExecFile", err);
          callback(err);
        } else {
          env.log("ProtocolInterface", "ExecFile", "success");
          callback("success");
        }
      });
    }
  };
  CheckParam(Obj) {
    if (Obj === null || Obj === void 0 || typeof Obj !== "object")
      return false;
    if (!Obj.hasOwnProperty("Type") || !Obj.hasOwnProperty("Func") || !Obj.hasOwnProperty("Param"))
      return false;
    if (Obj.Type === null || Obj.Type === void 0 || typeof Obj.Type !== "number")
      return false;
    return true;
  }
  downloadFile = (obj) => {
    env.log("interface", "downloadFile", `${obj}`);
    this.TerminateFWUpdate("FirmwareUpdater", () => {
      this.update.downloadFile(obj.UrlPath, obj.FilePath);
    });
  };
  TerminateFWUpdate = (Obj, callback) => {
    var csRtn;
    const TerminateEXE = (iTimes) => {
      if (iTimes < 5) {
        var iFindRtn = this.LaunchWinSocket.FindWindowProcess(Obj);
        if (iFindRtn >= 1) {
          csRtn = this.LaunchWinSocket.TerminateProcess(Obj);
          console.log("LaunchWinSocket TerminateProcess:", csRtn);
          env.log("Interface FWUpdate", "TerminateProcess:", csRtn);
          setTimeout(() => {
            TerminateEXE(iTimes + 1);
          }, 1e3);
        } else {
          callback("Exit ProcessName App Success");
        }
      } else {
        env.log("Interface FWUpdate", "TerminateProcess:", "Exit ProcessName App FAIL");
        callback(csRtn);
      }
    };
    TerminateEXE(0);
  };
  ClearDownloadFile = () => {
    ClearFolder(AppPaths.DownloadsFolder);
  };
}
class IpcResponse {
  success;
  data;
  constructor() {
    this.success = false;
    this.data = void 0;
  }
}
const authConfig = {
  region_detect_api: "https://core.gloriousgaming.com/region",
  dev: {
    auth_ui: "https://dev.d2wei9h4wba5h1.amplifyapp.com/init",
    auth_api: "https://glorious-auth-2e3530ae-2e3530ae-dev.auth.us-east-2.amazoncognito.com",
    auth_client_id: "6uvjnhf31sb0jmeleplhfsj9lp",
    cognito_api: "https://cognito-idp.us-east-2.amazonaws.com"
  },
  eu: {
    auth_ui: "https://eu.d2go41l28m21au.amplifyapp.com/init",
    auth_api: "https://glorious-auth-2e3530ae-2e3530ae-eu.auth.eu-west-1.amazoncognito.com",
    auth_client_id: "icmlhsirq878clpshooil7v0n",
    cognito_api: "https://cognito-idp.eu-west-1.amazonaws.com"
  },
  us: {
    auth_ui: "https://us.d2wei9h4wba5h1.amplifyapp.com/init",
    auth_api: "https://glorious-auth-2e3530ae-2e3530ae-us.auth.us-east-2.amazoncognito.com",
    auth_client_id: "1p7mj2gtuln2dmoosqt85e8ns1",
    cognito_api: "https://cognito-idp.us-east-2.amazonaws.com"
  }
};
const KEYTAR_TOKEN = "glorious-token";
const KEYTAR_REGION = "glorious-region";
const KEYTAR_ACCOUNT = os$1.userInfo().username;
let idToken = "";
let accessToken = "";
let refreshToken = "";
let refreshInProgress = false;
async function getRegion() {
  let region = await keytar.getPassword(KEYTAR_REGION, KEYTAR_ACCOUNT);
  if (!region) {
    try {
      const response = await axios.get(authConfig.region_detect_api);
      region = response.data.region;
      await keytar.setPassword(KEYTAR_REGION, KEYTAR_ACCOUNT, region);
    } catch (error) {
      throw new Error("An error occurred during region detection. Please try again later.");
    }
  }
  return region;
}
async function changePassword({ oldPassword, newPassword }) {
  const region = await getRegion();
  const token = await getAccessToken();
  const options = {
    adapter: "http",
    method: "POST",
    url: `${authConfig[region].cognito_api}/`,
    headers: {
      "content-type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.ChangePassword"
    },
    data: {
      AccessToken: token,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword
    }
  };
  try {
    await axios(options);
  } catch (error) {
    throw error;
  }
}
function isExpired(token) {
  if (!token) {
    return true;
  }
  const expiration = token.split(".")[1];
  const decoded = Buffer.from(expiration, "base64").toString();
  const { exp } = JSON.parse(decoded);
  return Date.now() >= exp * 1e3;
}
async function isLoggedIn() {
  if (!accessToken || isExpired(accessToken)) {
    await refreshTokens();
  }
  return !!accessToken;
}
async function getAccessToken() {
  if (!accessToken || isExpired(accessToken)) {
    await refreshTokens();
  }
  return accessToken;
}
async function getIdToken() {
  if (!idToken || isExpired(idToken)) {
    await refreshTokens();
  }
  return idToken;
}
async function getProfile() {
  const idToken2 = await getIdToken();
  const decoded = Buffer.from(idToken2.split(".")[1], "base64").toString();
  const profile = JSON.parse(decoded);
  const linkedAccounts = (profile.identities || []).map((identity) => identity.providerName.toLowerCase());
  return {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    linkedAccounts
  };
}
async function getAuthenticationURL(options) {
  const region = await getRegion();
  const params = qs.stringify(options);
  console.log("going to: " + authConfig[region].auth_ui + "?" + params);
  return authConfig[region].auth_ui + "?" + params;
}
async function refreshTokens() {
  const region = await getRegion();
  refreshToken = await keytar.getPassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT) || "";
  if (refreshToken && !refreshInProgress) {
    refreshInProgress = true;
    const refreshOptions = {
      adapter: "http",
      method: "POST",
      url: `${authConfig[region].auth_api}/oauth2/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        grant_type: "refresh_token",
        client_id: authConfig[region].auth_client_id,
        refresh_token: refreshToken
      })
    };
    try {
      const response = await axios(refreshOptions);
      accessToken = response.data.access_token;
      idToken = response.data.id_token;
      refreshInProgress = false;
    } catch (error) {
      throw error;
    }
  }
}
async function loadTokensFromUrl(callbackURL) {
  const urlParts = gUrl.parse(callbackURL, true);
  const query = urlParts.query;
  const { token, id_token, refresh_token } = query;
  if (refresh_token) {
    accessToken = token;
    idToken = id_token;
    refreshToken = refresh_token;
    await keytar.setPassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT, refreshToken);
  }
}
async function logout() {
  try {
    await keytar.deletePassword(KEYTAR_TOKEN, KEYTAR_ACCOUNT);
  } catch (e) {
    throw e;
  }
}
let win = null;
async function createAuthWindow(options, MainWindow2) {
  destroyAuthWin();
  win = new electron.BrowserWindow({
    width: 415,
    height: 560,
    webPreferences: {
      nodeIntegration: false
    }
  });
  win.setMenu(null);
  win.loadURL(await getAuthenticationURL(options));
  const {
    session: {
      webRequest
    }
  } = win.webContents;
  const filter = {
    urls: [
      "http://localhost/callback/*",
      "https://localhost/callback/*"
    ]
  };
  webRequest.onBeforeRequest(filter, async ({ url }) => {
    try {
      await loadTokensFromUrl(url);
      if (await isLoggedIn()) {
        MainWindow2.webContents.send("ipcEvent", { Func: EventTypes.UserLoggedIn, Param: null });
      }
    } catch (e) {
      console.error(e);
    }
    return destroyAuthWin();
  });
  win.on("closed", () => {
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
const migrateDeviceData = () => {
  try {
    env.log("electron", "data", "Migrating Device Data");
    env.log("electron", "data", "Begin 2.0 Migration");
    const deviceDataText = readUserDataFile(DBFiles.DeviceDB).toString();
    const updatedText = deviceDataText.replace(/"image":"image\/(.*?)"/g, `"image": "$1"`);
    if (updatedText !== deviceDataText) {
      fs.writeFileSync(getDataFilePath(DBFiles.DeviceDB), updatedText);
      env.log("electron", "data", "Completed 2.0 Migration");
    } else {
      env.log("electron", "data", "Device Data up to date; Skipped 2.0 Migration");
    }
  } catch (err) {
    env.log("electron", "data", `An error occurred while updating Device Data: ${err}`);
    env.log("electron", "data", "Creating new device data.");
    copyDBResourceFileToDataFolder(DBFiles.DeviceDB);
  }
};
const refreshLegacyDBFiles = async () => {
  const hasDataFolder = fs.existsSync(AppPaths.DataFolder);
  const hasUserData = fs.existsSync(AppPaths.UserFile);
  if (!hasDataFolder) {
    fs.mkdirSync(AppPaths.DataFolder, { recursive: true });
  }
  if (!hasUserData) {
    env.log("electron", "data", "No User data found. Creating User data.");
    copyDBResourceFileContentInto(DBFiles.AppSettingDB, AppPaths.UserFile);
    refreshSupportAndPluginsDB();
  }
  const supportDeviceDataFilePath = getDataFilePath(DBFiles.SupportDevice);
  fs.existsSync(supportDeviceDataFilePath);
  refreshSupportAndPluginsDB();
  copyDBDataFileIfNotExists(DBFiles.AppSettingDB);
  copyDBDataFileIfNotExists(DBFiles.MacroDB);
  if (!copyDBDataFileIfNotExists(DBFiles.DeviceDB)) {
    migrateDeviceData();
  }
  copyDBDataFileIfNotExists(DBFiles.LayoutDB);
};
const cloudConfig = {
  dev: "https://fxozmz6r7fcydb3pkeerz2rkby.appsync-api.us-east-2.amazonaws.com/graphql",
  us: "https://xhmmzxoz6zgwlcdqbkfhr6z7pi.appsync-api.us-east-2.amazonaws.com/graphql",
  eu: "https://h7h6tdfsfvfslausidg3oge2mm.appsync-api.eu-west-1.amazonaws.com/graphql"
};
const createProfile = (
  /* GraphQL */
  `mutation CreateProfile(
  $input: CreateProfileInput!
  $condition: ModelProfileConditionInput
) {
  createProfile(input: $input, condition: $condition) {
    id
    name
    data
    sn
    deviceName
    deviceCategory
    owner
    createdAt
    updatedAt
    __typename
  }
}
`
);
const updateProfile = (
  /* GraphQL */
  `mutation UpdateProfile(
  $input: UpdateProfileInput!
  $condition: ModelProfileConditionInput
) {
  updateProfile(input: $input, condition: $condition) {
    id
    name
    data
    sn
    deviceName
    deviceCategory
    owner
    createdAt
    updatedAt
    __typename
  }
}
`
);
const deleteProfile = (
  /* GraphQL */
  `mutation DeleteProfile(
  $input: DeleteProfileInput!
  $condition: ModelProfileConditionInput
) {
  deleteProfile(input: $input, condition: $condition) {
    id
    name
    data
    sn
    deviceName
    deviceCategory
    owner
    createdAt
    updatedAt
    __typename
  }
}
`
);
const queryByOwner = (
  /* GraphQL */
  `query QueryByOwner(
  $owner: String!
  $sn: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  queryByOwner(
    owner: $owner
    sn: $sn
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      data
      sn
      deviceName
      deviceCategory
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
`
);
async function makeGraphQlRequest(query, variables) {
  try {
    const accessToken2 = await getAccessToken();
    const region = await getRegion();
    const response = await axios({
      url: cloudConfig[region],
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken2}`
      },
      data: {
        query,
        variables: JSON.stringify(variables)
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
async function getDeviceProfiles(filters) {
  const profile = await getProfile();
  const vars = { owner: `${profile.id}::${profile.id}` };
  if (filters.sn) {
    vars.sn = { eq: filters.sn };
  }
  const data = await makeGraphQlRequest(queryByOwner, vars);
  return data?.data?.queryByOwner?.items;
}
async function getAllDevicesProfiles() {
  const profile = await getProfile();
  const vars = { owner: `${profile.id}::${profile.id}` };
  const data = await makeGraphQlRequest(queryByOwner, vars);
  return data?.data?.queryByOwner?.items;
}
async function saveProfile(input) {
  const query = input.id ? updateProfile : createProfile;
  return await makeGraphQlRequest(query, { input });
}
async function deleteDeviceProfile(id) {
  return await makeGraphQlRequest(deleteProfile, { input: { id } });
}
class AppUpdateServiceClass extends EventEmitter {
  downloadHelper;
  downloadAppUpdater(url) {
    return new Promise((resolve, reject) => {
      const parsedUrl = url.replaceAll("%20", " ");
      const fileName = parsedUrl.substring(parsedUrl.lastIndexOf("/"));
      this.downloadHelper = new nodeDownloaderHelper.DownloaderHelper(parsedUrl, AppPaths.DownloadsFolder, {
        override: true,
        fileName
      });
      this.downloadHelper.on("start", () => {
        const message = `Download Progress | ${parsedUrl} | Start`;
        env.log("FWUpdateSilent", "downloadAppUpdater", message);
      });
      this.downloadHelper.on("progress", (stats) => {
        const message = `Download Progress | ${parsedUrl} | ${stats.progress.toFixed(2)}% [${stats.downloaded.toFixed(2)} / ${stats.total.toFixed(2)}]`;
        env.log("FWUpdateSilent", "downloadAppUpdater", message);
        this.emit(EventTypes.DownloadProgress, new IPCProgress("APP", "progress", stats, message));
      });
      this.downloadHelper.on("end", async (stats) => {
        const message = `Download Progress | ${parsedUrl} | Download Completed`;
        env.log("FWUpdateSilent", "downloadAppUpdater", message);
        if (fileName.endsWith(".zip")) {
          if (env.isWindows) {
            const downloadedArchivePath = path.join(AppPaths.DownloadsFolder, fileName);
            const directoryName = fileName.substring(0, fileName.lastIndexOf("."));
            const baseFileName = directoryName.replace(/\s*?\(\d+\)$/, "");
            const extractedArchiveDirectory = path.join(AppPaths.DownloadsFolder, baseFileName);
            try {
              const existingExtractedDirectoryStats = await fs$2.stat(extractedArchiveDirectory);
              if (existingExtractedDirectoryStats != null) {
                await fs$2.rm(extractedArchiveDirectory, { recursive: true, force: true });
              }
            } catch (_) {
            }
            const zip = new AdmZip(downloadedArchivePath);
            zip.extractAllTo(extractedArchiveDirectory, true);
            try {
              const updaterFilepath = path.join(extractedArchiveDirectory, baseFileName + ".exe");
              const updaterStats = await fs$2.stat(updaterFilepath);
              console.log(updaterStats);
              electron.shell.openPath(updaterFilepath);
            } catch (exception) {
              console.log(exception);
              const message2 = `Download Progress | APP | Error: Did not find executable firmware after unpacking the archive.`;
              env.log("FWUpdateSilent", "beginFirmwareDownloads", message2);
              this.emit(EventTypes.DownloadProgress, new IPCProgress("APP", "error", null, message2));
              return;
            }
          } else if (env.isMac)
            ;
        }
        resolve();
        this.emit(EventTypes.DownloadProgress, new IPCProgress("APP", "complete", stats, message));
      });
      this.downloadHelper.on("error", (err) => {
        const message = `Download Progress | ${parsedUrl} | Download Failed: ${JSON.stringify(err, void 0, 2)}`;
        env.log("FWUpdateSilent", "downloadAppUpdater", message);
        reject();
      });
      this.downloadHelper.start();
    });
  }
}
const AppUpdateService = new AppUpdateServiceClass();
const TrayItemNames = ["Open Glorious Core", "Quit Glorious Core"];
let MainWindow;
let AppProtocol;
let DeviceServiceRef;
let DatabaseService;
let VersionFileUrl;
function createWindow() {
  MainWindow = new electron.BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 800,
    minHeight: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path$1.join(__dirname, "../preload/index.js"),
      sandbox: false,
      devTools: false
    },
    icon: "./src/renderer-process/public/images/icons/appIcon2.png"
  });
  MainWindow.on("ready-to-show", async () => {
    const appSetting = await DatabaseService.getAppSetting();
    if (!appSetting[0]?.minimize) {
      MainWindow.show();
    }
  });
  MainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  MainWindow.webContents.on("did-finish-load", () => {
    AppProtocol.on(EventTypes.ProtocolMessage, function(obj) {
      try {
        if (obj.Func == "ShowWindow") {
          if (obj.Param == "Hide") {
            MainWindow.minimize();
          }
          if (obj.Param == "Close") {
            env.log("electron", "ShowWindow", JSON.stringify(obj.Param));
            MainWindow.hide();
          }
        } else if (obj.Func == "QuitApp") {
          electron.app.quit();
        } else if (obj.Func == "HideApp") {
          MainWindow.minimize();
        }
        var t = { Func: obj.Func, Param: obj.Param };
        console.log("send to web contents", JSON.stringify(t));
        MainWindow.webContents.send("ipcEvent", t);
      } catch (e) {
        env.log("electron", "AppProtocol", "error:" + e);
      }
    });
    AppUpdateService.on(EventTypes.DownloadProgress, (data) => {
      const content = {
        Func: EventTypes.DownloadProgress,
        Param: data
      };
      MainWindow.webContents.send("ipcEvent", content);
    });
    AppProtocol.FWUpdateService.on(EventTypes.DownloadProgress, (data) => {
      const content = {
        Func: EventTypes.DownloadProgress,
        Param: data
      };
      MainWindow.webContents.send("ipcEvent", content);
    });
    AppProtocol.FWUpdateService.on(EventTypes.UpdateFW, (data) => {
      const content = {
        Func: EventTypes.UpdateFW,
        Param: data
      };
      MainWindow.webContents.send("ipcEvent", content);
    });
  });
  const filter = {
    urls: ["https://*.digitaloceanspaces.com/*"]
    // Remote API URS for which you are getting CORS error
  };
  MainWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders.Origin = `https://*.digitaloceanspaces.com/*`;
    callback({ requestHeaders: details.requestHeaders });
  });
  MainWindow.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
    if (details.responseHeaders == null) {
      details.responseHeaders = {};
    }
    details.responseHeaders["access-control-allow-origin"] = [
      "*"
      // URL your local electron app hosted
    ];
    callback({ responseHeaders: details.responseHeaders });
  });
  electron.session.defaultSession.webRequest.onBeforeSendHeaders({
    urls: ["https://www.gloriousgaming.com/*"]
  }, (details, callback) => {
    console.log(details);
    details.requestHeaders["Origin"] = "https://www.gloriousgaming.com/";
    callback({ requestHeaders: details.requestHeaders });
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    MainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    MainWindow.loadFile(path$1.join(__dirname, "../renderer-process/index.html"));
  }
}
electron.app.commandLine.appendSwitch(" --enable-logging");
electron.app.commandLine.appendSwitch("touch-events", "enabled");
electron.app.commandLine.appendSwitch("--disable-http-cache");
electron.app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512");
electron.app.commandLine.appendSwitch("disable-features", "WidgetLayering");
const instanceData = {};
const haslock = electron.app.requestSingleInstanceLock(instanceData);
if (!haslock) {
  electron.app.quit();
}
electron.app.on("second-instance", (event, commandLine, workingDirectory, instanceData2) => {
  if (MainWindow) {
    if (MainWindow.isMinimized()) {
      MainWindow.restore();
    }
    MainWindow.focus();
  }
});
electron.app.whenReady().then(async () => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, _2) => {
  });
  await refreshLegacyDBFiles();
  AppProtocol = new ProtocolInterface();
  DeviceServiceRef = AppProtocol.deviceService;
  DatabaseService = DeviceServiceRef.nedbObj;
  registerIPCmethods();
  installTray(TrayItemNames);
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function registerIPCmethods() {
  let AppChannel2 = MessageChannels.AppChannel;
  electron.ipcMain.handle(AppChannel2.GetAppSetting, async (_, data) => {
    return handleIpcRequest(DatabaseService.getAppSetting.bind(appDataInstance));
  });
  electron.ipcMain.handle(AppChannel2.SaveAppSetting, async (_, data) => {
    return handleIpcRequest(DatabaseService.saveAppSetting.bind(appDataInstance), data);
  });
  electron.ipcMain.handle(AppChannel2.SaveStartupSetting, async (_, startupState) => {
    electron.app.setLoginItemSettings({
      openAtLogin: startupState
    });
  });
  electron.ipcMain.handle(AppChannel2.GetVersion, async (_, data) => {
    const response = new IpcResponse();
    response.data = env.appversion;
    response.success = true;
    return response;
  });
  electron.ipcMain.handle(AppChannel2.GetAvailableTranslations, async (_, data) => {
    const response = new IpcResponse();
    response.success = true;
    return response;
  });
  electron.ipcMain.handle(AppChannel2.GetBuildVersion, async (_, data) => {
    const response = new IpcResponse();
    response.data = packageProperties.buildVersion;
    response.success = true;
    return response;
  });
  electron.ipcMain.handle(AppChannel2.GetVersionFileUrl, async (_, data) => {
    const response = new IpcResponse();
    if (VersionFileUrl == null) {
      {
        try {
          let data2 = fs.readFileSync(getDataFilePath("GSPYTESTServer.TEST")).toString();
          let parsedData = JSON.parse(data2);
          VersionFileUrl = parsedData.UpdateUrl;
        } catch (e) {
          VersionFileUrl = packageProperties.versionFileUrl;
          env.log("GetVersionFileUrl", "ReadFile-Error", `Error:${e}`);
        }
      }
    }
    response.data = VersionFileUrl;
    response.success = true;
    env.log("GetVersionFileUrl", "Using URL:", `${VersionFileUrl}`);
    return response;
  });
  electron.ipcMain.handle(AppChannel2.GetCORE2VersionFileUrl, async (_, data) => {
    const response = new IpcResponse();
    if (VersionFileUrl == null) {
      {
        try {
          let data2 = fs.readFileSync(getDataFilePath("GSPYTESTServer.TEST")).toString();
          let parsedData = JSON.parse(data2);
          VersionFileUrl = parsedData.CORE2UpdateUrl;
        } catch (e) {
          VersionFileUrl = packageProperties.core2VersionFileUrl;
          env.log("GetCORE2VersionFileUrl", "ReadFile-Error", `Error:${e}`);
        }
      }
    }
    response.data = VersionFileUrl;
    response.success = true;
    env.log("GetCORE2VersionFileUrl", "Using URL:", `${VersionFileUrl}`);
    return response;
  });
  electron.ipcMain.handle(AppChannel2.GetDownloadedFirmwareUpdaters, async (_) => {
    const response = new IpcResponse();
    try {
      response.data = await AppProtocol.FWUpdateService.getExistingFirmwareUpdaters();
      response.success = true;
    } catch (exception) {
      env.log("Electron", "Get Downloaded Firmware Updaters", exception);
    }
    return response;
  });
  electron.ipcMain.handle(AppChannel2.BeginFirmwareDownloads, async (_, data) => {
    const response = new IpcResponse();
    response.data = null;
    try {
      AppProtocol.FWUpdateService.beginFirmwareDownloads(data);
      response.success = true;
    } catch (exception) {
      env.log("Electron", "Firmware Download", exception);
    }
    return response;
  });
  electron.ipcMain.handle(AppChannel2.BeginFirmwareUpdates, async (_, data) => {
    const response = new IpcResponse();
    response.data = null;
    try {
      AppProtocol.FWUpdateService.beginFirmwareUpdates(data);
      response.success = true;
    } catch (exception) {
      env.log("Electron", "Firmware Update", exception);
    }
    return response;
  });
  electron.ipcMain.handle(AppChannel2.SetFirmwareOverrides, async (_, overridesData) => {
    const response = new IpcResponse();
    return response;
  });
  electron.ipcMain.handle(AppChannel2.ShowDebug, async (_, data) => {
    const response = new IpcResponse();
    response.data = packageProperties.showDebugUI;
    response.success = true;
    return response;
  });
  electron.ipcMain.on(AppChannel2.InitTray, function(event, labs) {
    installTray(labs);
  });
  electron.ipcMain.handle(AppChannel2.ShowOpenDialog, async (_, data) => {
    const response = new IpcResponse();
    try {
      var window2 = electron.BrowserWindow.getFocusedWindow();
      var result = await electron.dialog.showOpenDialog(window2, data);
      if (result == void 0) {
        return void 0;
      }
      response.data = result.filePaths[0];
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.ShowSaveDialog, async (_, data) => {
    const response = new IpcResponse();
    try {
      var window2 = electron.BrowserWindow.getFocusedWindow();
      var result = await electron.dialog.showSaveDialog(window2, data);
      if (result == void 0) {
        return void 0;
      }
      response.data = result.filePath;
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.CommandMin, async (_, data) => {
    const response = new IpcResponse();
    try {
      var window2 = electron.BrowserWindow.getFocusedWindow();
      window2.minimize();
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.CommandMax, async (_, data) => {
    const response = new IpcResponse();
    try {
      var window2 = electron.BrowserWindow.getFocusedWindow();
      if (window2.isMaximized()) {
        window2.unmaximize();
      } else if (window2.isMaximizable()) {
        window2.maximize();
      }
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.CommandClose, async (_, data) => {
    const response = new IpcResponse();
    try {
      var window2 = electron.BrowserWindow.getFocusedWindow();
      window2.hide();
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.OpenHyperlink, async (_, data) => {
    const response = new IpcResponse();
    try {
      console.log(data);
      electron.shell.openExternal(data);
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_DownloadFile, async (_, data) => {
    const response = new IpcResponse();
    let resultData;
    try {
      const result = await AppUpdateService.downloadAppUpdater(data.url);
      response.success = true;
      return response;
    } catch (exception) {
      response.data = { error: exception, data: resultData };
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_CancelDownload, async (_, data) => {
    const response = new IpcResponse();
    let resultData;
    try {
      if (AppUpdateService.downloadHelper != null) {
        response.success = await AppUpdateService.downloadHelper.stop();
      }
      response.success = true;
      return response;
    } catch (exception) {
      response.data = { error: exception, data: resultData };
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_SaveFile, async (_, data) => {
    const response = new IpcResponse();
    let resultData;
    try {
      let finalData = {
        filename: data.filename,
        exportVersion: data.exportVersion,
        value: data.value
      };
      resultData = await fs$1.writeFile(data.path, JSON.stringify(finalData));
      response.success = true;
      return response;
    } catch (exception) {
      response.data = { error: exception, data: resultData };
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_ClearFolder, async (_, data) => {
    const response = new IpcResponse();
    try {
      let folder_exists = fs.existsSync(data);
      if (folder_exists) {
        let filelist = fs.readdirSync(data);
        filelist.forEach(function(fileName) {
          fs.unlinkSync(path$1.join(data, fileName));
        });
      }
      response.success = true;
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_SupportSaveFile, async (_, data) => {
    const response = new IpcResponse();
    let resultData;
    try {
      resultData = await fs$1.writeFile(data.path, JSON.stringify(data.data));
      response.success = true;
      return response;
    } catch (exception) {
      response.data = { error: exception, data: resultData };
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Tool_OpenFile, async (_, data) => {
    const response = new IpcResponse();
    try {
      const resultData = fs$1.readFile(data);
      response.success = true;
      response.data = (await resultData).toString();
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  const appDataInstance = AppDB.getInstance();
  let DataChannel2 = MessageChannels.DataChannel;
  electron.ipcMain.handle(DataChannel2.GetSupportDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.getSupportDevice.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.GetLayout, async (_, data) => {
    return handleIpcRequest(DatabaseService.getLayout.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.UpdateLayout, async (_, data) => {
    return handleIpcRequest(DatabaseService.updateLayoutAlldata.bind(appDataInstance), data.compareData, data.obj);
  });
  electron.ipcMain.handle(DataChannel2.GetPluginDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.getPluginDevice.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.UpdatePluginDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.updatePluginDevice.bind(appDataInstance), data.obj);
  });
  electron.ipcMain.handle(DataChannel2.UpdateAllPluginDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.updateAllPluginDevice.bind(appDataInstance), data.obj);
  });
  electron.ipcMain.handle(DataChannel2.UpdateDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.updateDevice.bind(appDataInstance), data._id, data.obj);
  });
  electron.ipcMain.handle(DataChannel2.GetAllDevice, async (_, data) => {
    return handleIpcRequest(DatabaseService.getAllDevice.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.GetMacro, async (_, data) => {
    return handleIpcRequest(DatabaseService.getMacro.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.GetMacroById, async (_, data) => {
    return handleIpcRequest(DatabaseService.getMacroById.bind(appDataInstance), data);
  });
  electron.ipcMain.handle(DataChannel2.InsertMacro, async (_, data) => {
    return handleIpcRequest(DatabaseService.insertMacro.bind(appDataInstance), data);
  });
  electron.ipcMain.handle(DataChannel2.DeleteMacro, async (_, data) => {
    return handleIpcRequest(DatabaseService.DeleteMacro.bind(appDataInstance), data);
  });
  electron.ipcMain.handle(DataChannel2.UpdateMacro, async (_, data) => {
    return handleIpcRequest(DatabaseService.updateMacro.bind(appDataInstance), data.id, data.obj);
  });
  electron.ipcMain.handle(DataChannel2.GetEQ, async (_, data) => {
    return handleIpcRequest(DatabaseService.getEQ.bind(appDataInstance));
  });
  electron.ipcMain.handle(DataChannel2.GetEQById, async (_, data) => {
    return handleIpcRequest(DatabaseService.getEQById.bind(appDataInstance), data.id);
  });
  electron.ipcMain.handle(DataChannel2.InsertEQ, async (_, data) => {
    return handleIpcRequest(DatabaseService.insertEQ.bind(appDataInstance), data.obj);
  });
  electron.ipcMain.handle(DataChannel2.DeleteEQ, async (_, data) => {
    return handleIpcRequest(DatabaseService.DeleteEQ.bind(appDataInstance), data.index);
  });
  electron.ipcMain.handle(DataChannel2.UpdateEQ, async (_, data) => {
    return handleIpcRequest(DatabaseService.updateEQ.bind(appDataInstance), data.id, data.obj);
  });
  let DeviceChannel2 = MessageChannels.DeviceChannel;
  electron.ipcMain.handle(DeviceChannel2.MockDeviceRegister, async (_, device) => {
    const response = new IpcResponse();
    try {
      const path2 = device.path.toUpperCase();
      AppProtocol.hiddevice.EmulateDeviceConnection(true, path2);
    } catch (exception) {
      response.data = exception;
    }
    return response;
  });
  electron.ipcMain.handle(DeviceChannel2.MockDeviceLoad, async (_, path2) => {
    let response;
    try {
      const filePath = path2 ?? "fakeDeviceData.json";
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      response = { data, success: true };
      return response;
    } catch (err) {
      response = { data: void 0, success: false };
      return response;
    }
  });
  electron.ipcMain.handle(DeviceChannel2.MockDeviceUnregister, async (_, device) => {
    let response = new IpcResponse();
    try {
      if (device !== void 0) {
        const path2 = device.path.toUpperCase();
        AppProtocol.hiddevice.EmulateDeviceConnection(false, path2);
      } else {
        AppProtocol.hiddevice.EmulateDeviceConnection(false, "");
      }
      response.success = true;
    } catch (err) {
      response.success = false;
      response.data = err;
    }
    return response;
  });
  electron.ipcMain.handle(DeviceChannel2.DeviceSendHidReport, async (_, data) => {
    const response = new IpcResponse();
    try {
      const checksum = 255 - (data.report.reduce((sum, val) => sum + val, 0) & 255);
      const length = data.report.length + 2;
      let buffer2 = Buffer.alloc(length);
      buffer2[0] = data.reportID;
      buffer2.set(data.report, 1);
      buffer2[length - 1] = checksum;
      const deviceId = AppProtocol.hiddevice.FindDevice(data.usagePage, data.usage, data.vid, data.pid);
      if (deviceId > 0) {
        response.data = AppProtocol.hiddevice.SetFeatureReport(deviceId, data.reportID, length, buffer2);
        response.success = true;
      }
    } catch (err) {
      response.success = false;
      response.data = err;
    }
    return response;
  });
  const ProtocolChannel2 = MessageChannels.ProtocolChannel;
  electron.ipcMain.handle(ProtocolChannel2.RunSetFunctionSystem, async (_, data) => {
    const response = new IpcResponse();
    try {
      let error;
      await AppProtocol.RunFunction(data, (err, data2) => {
        error = err;
      });
      response.success = error == null;
      if (!response.success) {
        response.data = error;
      }
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(ProtocolChannel2.RunSetFunctionDevice, async (_, data) => {
    const response = new IpcResponse();
    try {
      let error;
      let resultData;
      await AppProtocol.RunFunction(data, (result, data2) => {
        if (result != null && typeof result === "string" && result.includes("Error")) {
          error = result;
        } else {
          resultData = result;
        }
      });
      response.success = error == null;
      if (response.success) {
        response.data = resultData;
      } else {
        response.data = error;
      }
      return response;
    } catch (exception) {
      response.data = exception;
      return response;
    }
  });
  electron.ipcMain.handle(AppChannel2.Login, (_ev, options) => createAuthWindow(options, MainWindow));
  electron.ipcMain.handle(AppChannel2.IsLoggedIn, isLoggedIn);
  electron.ipcMain.handle(AppChannel2.GetProfile, getProfile);
  electron.ipcMain.handle(AppChannel2.ChangePassword, (_ev, options) => changePassword(options));
  electron.ipcMain.handle(AppChannel2.Logout, logout);
  electron.ipcMain.handle(AppChannel2.GetCloudDeviceProfiles, (_ev, variables) => getDeviceProfiles(variables));
  electron.ipcMain.handle(AppChannel2.GetAllCloudDevicesProfiles, (_ev, variables) => getAllDevicesProfiles());
  electron.ipcMain.handle(AppChannel2.CreateCloudDeviceProfile, (_ev, options) => saveProfile(options));
  electron.ipcMain.handle(AppChannel2.DeleteCloudDeviceProfile, (_ev, options) => deleteDeviceProfile(options));
}
async function handleIpcRequest(getData, ...args) {
  const response = new IpcResponse();
  try {
    response.data = await getData(...args);
    response.success = true;
    return response;
  } catch (exception) {
    response.data = exception;
    return response;
  }
}
let TrayIcon;
function installTray(labs) {
  if (labs === null || labs === void 0 || labs.constructor !== Array || labs.length !== 2) {
    labs = ["Open", "Exit"];
  }
  if (TrayIcon !== void 0) {
    TrayIcon.destroy();
    TrayIcon = null;
  }
  try {
    const trayIconPath = true ? path$1.join(process.resourcesPath, "public/images/icons/app-icon.ico") : "./app-icon.ico";
    console.log("Tray Icon Path", trayIconPath);
    TrayIcon = new electron.Tray(`${trayIconPath}`);
    var contextMenu = electron.Menu.buildFromTemplate([{
      label: labs[0],
      // icon:'./src/renderer-process/assets/images/topmost.png', // if these images don't exist, the tray doesn't work; uncomment when assets are available
      click: function(event) {
        console.log(event);
        global.CanQuit = false;
        MainWindow.show();
        MainWindow.setSkipTaskbar(false);
      }
    }, {
      label: labs[1],
      // icon:'./src/renderer-process/assets/images/exit.png', // if these images don't exist, the tray doesn't work; uncomment when assets are available
      click: function() {
        global.CanQuit = true;
        AppProtocol.CloseAllDevice().then(function() {
          electron.app.quit();
        });
      }
    }]);
    TrayIcon.setTitle("Glorious Core");
    TrayIcon.setToolTip("Glorious Core");
    TrayIcon.setContextMenu(contextMenu);
    TrayIcon.on("double-click", function() {
      global.CanQuit = false;
      MainWindow.show();
      setTimeout(function() {
        MainWindow.setSkipTaskbar(false);
      }, 100);
    });
    TrayIcon.on("right-click", function() {
      global.CanQuit = false;
    });
  } catch (exception) {
  }
}
