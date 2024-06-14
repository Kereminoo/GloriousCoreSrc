import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { default as packageJson } from '../../../../package.json';
import cp from 'node:child_process';
import { log } from 'node:console';
import { AppPaths } from '../app-files/appPaths';
import { createAppFolders } from '../app-files/appFiles';


export const EnvironmentLogLevel = {  ERROR: "ERROR",  WARN: "WARN",  INFO: "INFO",  DEBUG:"DEBUG" } as const;
class EnvironmentLog
{
    level: typeof EnvironmentLogLevel[keyof typeof EnvironmentLogLevel] = EnvironmentLogLevel.INFO;

    #logFilePathRoot: string;
    constructor(logFilePath: string)
    {
        this.#logFilePathRoot = logFilePath;
    }

    logToFile(ClassName,functionName,info)
    {
        try
        {
            const date = new Date();
            var msg = date.format('yyyy-MM-dd hh:mm:ss.S');
            if(typeof info == 'object')
                info = JSON.stringify(info)
            msg = `${msg}    ${String.padRight(ClassName,20)}   ${String.padRight(functionName,30)}   ${info}`;
            var CurrentDate = date.format('yyyyMMdd');
            if(!fs.existsSync(this.#logFilePathRoot)){ fs.mkdirSync(this.#logFilePathRoot); }
            var LogFilePath = path.join(this.#logFilePathRoot, CurrentDate + '.log');
            fs.appendFileSync(LogFilePath, msg +"\r\n");
            console.log(ClassName,functionName,info)
        }
        catch(ex)
        {
            console.error(ex);
        }
    }
    walkLog(dir)
    {
        var results: any[] = [];
        var list = fs.readdirSync(dir)
        list.forEach((file) =>
        {
            var file1 = dir + '/' + file
            var stat = fs.statSync(file1)
            if (stat && stat.isDirectory()) results = results.concat(this.walkLog(file1))
            else
            {
                if(path.extname(file) =='.log')   results.push(file)
            }
        })
        return results
    }
    deleteLogs()
    {
        this.logToFile('env','logToFile','Clear Logs .')  ;
        var date = new Date();
        date.setDate(date.getDate() -7);
        var tmp = date.format('yyyyMMdd');
        this.walkLog(this.#logFilePathRoot).forEach((item) =>
        {
            let aFile = item.substr(0,item.length-4);
            if(aFile<tmp){
                fs.unlinkSync(path.join(this.#logFilePathRoot,'/')+item);
            }
        })
    }
    privateDeleteLogFile()
    {
        try
        {
            var files: any[] = [] ; var CurrentDate = new Date().format('yyyyMMdd');
            var LogFilePath = path.join(AppPaths.LogsFolder);
            if(fs.existsSync(LogFilePath))
            {
                files = fs.readdirSync(LogFilePath);
                for (var file of files)
                {
                    var curPath = path.join(LogFilePath, file);
                    var f = file.split(".");
                    if (f[0]!=CurrentDate){   fs.unlinkSync(curPath); }
                }
            }
        }
        catch(e){     }
    }
}


export class EnvironmentSession
{
    #environmentLog: EnvironmentLog;
    get logLevel(): keyof typeof EnvironmentLogLevel
    {
        return this.#environmentLog.level;
    }
    set logLevel(value: keyof typeof EnvironmentLogLevel)
    {
        this.#environmentLog.level = value;
    }

    isWindows: boolean;
    isMac: boolean;
    isLinux: boolean;
    osReleaseVer: string;

    BuiltType: number
    BuildCode: number
    // isTestMode: boolean
    // isDebugging: boolean
    winSettings: typeof packageJson.window | void;
    // keyBoardSettings = packageJson.keyboard || void 0;
    isLessThenWin81:boolean;
    runningInstanceHandle: string;
    appversion: string;
    buildVersion: string;
    exportVersion: number;
    DesktopDir: string;
    // mockDevices: typeof packageJson.mockDevices;
    // isTestServer: boolean;
    // useDebugControls: typeof packageJson.useDebugControls;
    // runningAutomatedTests: typeof packageJson.runningAutomatedTests;
    arch:string;

    constructor()
    {

        this.isWindows = (process.platform === 'win32');
        this.isMac = (process.platform === 'darwin');
        this.isLinux = (process.platform === 'linux');
        this.osReleaseVer = this.getWindowsReleaseVer();

        this.BuiltType = packageJson.BuiltType || 0;
        this.BuildCode = packageJson.BuildCode || 0;
        // this.isTestMode = BuiltType === 0;
        // this.isDebugging = packageJson.isDebugging;
        this.winSettings = packageJson.window || void 0;
        // this.keyBoardSettings = packageJson.keyboard || void 0;
        this.isLessThenWin81 = (this.isWindows && this.CompareVersion(this.osReleaseVer, '6.3.9600'));
        this.runningInstanceHandle = this.getRunningInstanceHandle();
        this.appversion = packageJson.version;
        this.buildVersion = packageJson.buildVersion;
        this.exportVersion = 1;
        // const appRoot = getAppRoot();
        this.DesktopDir = os.homedir();
        // this.mockDevices = packageJson.mockDevices;
        // this.isTestServer = true;
        // this.useDebugControls = packageJson.useDebugControls;
        // this.runningAutomatedTests = packageJson.runningAutomatedTests;
        this.arch = this.getArch();
        this.#environmentLog = new EnvironmentLog(AppPaths.LogsFolder);
    }


    prepareEnvironment()
    {
        // create program data directories
        createAppFolders();

        // this.#environmentLog.logToFile('env','logToFile', `AppVersion:${this.appversion},${os.type()},${os.arch()},${process.platform},${this.osReleaseVer},BuiltType:${this.BuiltType},BuiltCode:${this.BuildCode}`);
        this.#environmentLog.logToFile('env','logToFile', `AppVersion:${this.appversion},${os.type()},${os.arch()},${process.platform},${this.osReleaseVer}`);
        if(this.BuildCode != 0)
            this.#environmentLog.logToFile('env','logToFile','-------------------Test Mode--------------------')
        this.#environmentLog.deleteLogs();
    }

    log = (ClassName,functionName,info) => this.#environmentLog.logToFile(ClassName,functionName,info)
    getPlatformIdentifier = () => this.privateGetPlatformIdentifier();
    DeleteLogFile = () => this.#environmentLog.privateDeleteLogFile();
    GetNumberHiLo = (num) => this.privateGetNumberHiLo(num);
    MergeHiLoToNumber = (hi, lo) => this.privateMergeHiLoToNumber(hi, lo);

    getArch()
    {
        if (this.isWindows)
        {
            return os.arch();
        }
        return process.platform;
    }
    getAppRoot()
    {
        return path.resolve(path.join(__dirname, '..', '..'));
    }
    getRunningInstanceHandle()
    {
        var handleName  = "Glorious Core";
        // Windows: use named pipe
        if (process.platform === 'win32') {
            return '\\\\.\\pipe\\' + handleName + '-' + os.userInfo().username + '-sock';
        }
        // Mac/Unix: use socket file
        return path.join(os.tmpdir(), handleName + '.sock');
    }

    privateGetPlatformIdentifier()
    {
        if (process.platform === 'linux') {
            return "linux-" + process.arch;
        }
        return process.platform;
    }

    getWindowsReleaseVer()
    {
        var strVer = os.release();
        if (this.isWindows && strVer == '6.2.9200'){
            var getVer = cp.execSync('ver.exe').toString('ascii').replace(/\0/g, '');
            var re = /\s[\d\.]+/i;
            if (re.test(getVer))
                strVer = re.exec(getVer)![0].replace(/(^\s*)|(\s*$)/g, '');
        }
        return strVer;
    }

    DeleteFolderRecursive (aPath, isDelRoot)
    {
        var files: any[] = [];
        if(fs.existsSync(aPath)) {
            files = fs.readdirSync(aPath);
            for (var file of files){
                var curPath = path.join(aPath, file);
                if(fs.statSync(curPath).isDirectory())
                {
                    // recurse
                    this.DeleteFolderRecursive(curPath, true);
                }
                else
                { // delete file
                    fs.unlinkSync(curPath);
                }
            }
            if (isDelRoot)
                fs.rmdirSync(aPath);
        }
    }


    //转换数字为高低位
    privateGetNumberHiLo(num)
    {
        if(num>=0x10000)
            num = num % 0x10000;
        var hex=Number(num).toString(16);
        hex = "0000".slice(0, 4 - hex.length) + hex;
        var ret: { Hi?: number, Lo?: number } = {};
        ret.Hi=parseInt(hex.slice(0,2),16);
        ret.Lo=parseInt(hex.slice(2,4),16);
        return ret;
    }

    //高低位合并为数字
    privateMergeHiLoToNumber(hi,lo)
    {
        var hex=Number(hi).toString(16);
        hex = "00".slice(0, 2 - hex.length) + hex;
        var hexLow=Number(lo).toString(16);
        hexLow = "00".slice(0, 2 - hexLow.length) + hexLow;
        hex = hex + hexLow;
        return parseInt(hex,16)
    }

    IsNum(s)
    {
        if (s != null && s != ""){
            return !isNaN(s);
        }
        return false;
    }
    CompareVersion(oldVer, newVer)
    {
        if (this.IsNum(oldVer) && this.IsNum(newVer)){
            return Number(oldVer) < Number(newVer);
        }
        var oldArr = oldVer.split('.');
        var newArr = newVer.split('.');
        var len = oldArr.length < newArr.length ? oldArr.length : newArr.length;
        var bResult = false;
        for (var i = 0; i < len; i++) {
            if (Number(oldArr[i]) !== Number(newArr[i])){
                bResult = (Number(oldArr[i]) < Number(newArr[i]));
                break;
            }
        }
        return bResult;
    }
}

export const env = new EnvironmentSession();
env.prepareEnvironment();
