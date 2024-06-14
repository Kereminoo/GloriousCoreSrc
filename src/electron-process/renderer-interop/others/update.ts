
// 'use strict';
// var AdmZip = require('adm-zip');
// var events = require('events');
// var env = require('./env');
// var gUrl = require('url');
// var http = require('http');
// var https = require('https');
// var path = require('path');
// var fs = require('fs');
// var EventTypes = require('./EventVariable').EventTypes;
// var = require('./FunctionVariable');
// var cp = require('child_process');
// var os = require('os');
// var request = require('request');
// var AppData = require('./AppData');

import EventEmitter from "events";
import { env } from "./env";
import { FuncType } from "../../../common/FunctionVariable";
import { EventTypes } from "../../../common/EventVariable";
import fs from "node:fs";
import path from "path";
import os from "os";
import request from "request";
import { AppData } from "./AppData";
import gUrl from "url";
import http from "http";
import https from "https";
import cp from "node:child_process";
import { shell } from "electron";
import AdmZip from "adm-zip";
import { AppPaths } from "../app-files/appPaths";

export class UpdateClass extends EventEmitter
{
    AppFileDownload: boolean;

    ProxyEnable: any;
    ProxyHost: any;
    ProxyPort: any;
    DownloadFileCancel: any;
    CheckDownloadTimeoutId: any;

    constructor()
    {
        super();
        env.log('UpdateClass','UpdateClass','Begin...');
        this.AppFileDownload = false;
    }


    GetEventParamerObj(sn, func, param){
        var Obj = {
            Type : FuncType.System,
            SN : sn,
            Func : func,
            Param : param
        };
        return Obj;
    };

    GetExtFilePath(aPath, ext){
        var files: any[] = [];
        if(fs.existsSync(aPath)) {
            files = fs.readdirSync(aPath);
            for (var file of files){
                if (file.endsWith(ext)){
                    var curPath = path.join(aPath, file);
                    return curPath;
                }
            }
        }
    };

    UpdateApp = () => {
        env.log('UpdateClass','UpdateClass','UpdateApp');
        return new Promise<void>((resolve,reject) => {
            try{
                if(env.isMac && fs.existsSync(os.tmpdir()+"/GSPYUpdate"))
                {
                    var Obj: any={
                        Type : FuncType.System,
                        Func : EventTypes.UpdateApp,
                        Param : 0
                    };

                    this.emit(EventTypes.ProtocolMessage, Obj);
                    return resolve();
                }
                else if(env.isWindows && fs.existsSync(os.tmpdir()+"\\"+"GSPYUpdate")){
                    var Obj: any={
                        Type : FuncType.System,
                        SN : null,
                        Func : EventTypes.UpdateApp,
                        Param : 0
                    };

                    this.emit(EventTypes.ProtocolMessage, Obj);
                    return resolve();
                }
                request.get(AppData.UpdateUrl+'/UpdateApp.json',(err, resp, body) => {
                    var body = JSON.parse(body);
                    if(body.hasOwnProperty('Version') && env.CompareVersion(AppData.Version,body.Version)){
                        var fromFile;
                        var toFile;
                        if(env.isWindows){
                            fromFile = AppData.UpdateUrl+body.AppName.Win;
                            toFile = os.tmpdir()+"\\"+AppData.ProjectName+".zip";
                        }
                        else{
                            fromFile = AppData.UpdateUrl+body.AppName.Mac;
                            toFile = os.tmpdir()+"/"+AppData.ProjectName+".zip";
                        }
                        this.DownloadFileFromURL(fromFile, toFile, true).then((obj) => {
                            // this.DownloadInstallPackage(() => {
                                env.log('UpdateClass','UpdateApp','DownloadFileFromURL success');

                                var Obj={
                                    Type : FuncType.System,
                                    SN : null,
                                    Func : EventTypes.UpdateApp,
                                    Param : 0
                                };

                                this.emit(EventTypes.ProtocolMessage, Obj);

                                resolve();
                            // })
                        })
                    }else{
                        resolve();
                    }
                })

            }catch(ex){
                reject(ex);
            }
        });
    }

    DownloadFileFromURL = (url, dest, emitProgress) => {
        return new Promise((resolve, reject) => {
            try{
                env.log('UpdateClass','DownloadFileFromURL',`Begin downloadFile:${url}      ${dest}`);
                var isError = false;
                var preStep = 0, curStep = 0;
                var urlObj = gUrl.parse(url);
                var protocol = urlObj.protocol == 'https:' ? https : http;
                var opts;
                var req: any = null;
                if (this.ProxyEnable){
                    opts = {
                        host: this.ProxyHost,
                        port: this.ProxyPort,
                        path: url,
                       // timeout:5000,
                        headers: {
							Host: urlObj.host
						}
                    };
                }else{
                    opts = url;
                }

                var file = fs.createWriteStream(dest);
                req = protocol.get(opts, (response) => {
                    var totalLen = parseInt(response.headers['content-length'] as any, 10);
                    var cur = 0;
                    file.on('finish', () => {
                      file.close((_) => {
                        if (!isError){
                            resolve({Data : dest});
                        }
                      });
                    });
                    if(emitProgress){
                        response.on("data", (chunk) => {
                            cur += chunk.length;
                            curStep = Math.floor(cur / totalLen *100);
                            if (preStep !== curStep){
                                preStep = curStep;
                                var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : cur,Total : totalLen});
                                this.emit(EventTypes.ProtocolMessage, Obj);
                            }

                            if(this.DownloadFileCancel) {
                                env.log('UpdateClass','DownloadFileFromURL',`User Cancel DownloadFile`);
                                req.abort();
                                this.DownloadFileCancel = false;
                            }

                            if(this.CheckDownloadTimeoutId != null)
                            {
                                clearTimeout( this.CheckDownloadTimeoutId );
                                this.CheckDownloadTimeoutId = null;
                            }

                            this.CheckDownloadTimeoutId = setTimeout(() => {
                                env.log('UpdateClass','DownloadFileFromURL',`server is not responsed`);

                                file.close((_) => {
                                    fs.unlink(dest, () => {
                                        var obj = {
                                            Error : 0x1008,
                                            Data : null
                                        };
                                        resolve(obj);

                                        req.abort();
                                        this.DownloadFileCancel = false;
                                    });
                                });
                            }, 15000);
                        });
                        response.on("end", (chunk) => {

                            env.log('UpdateClass','DownloadFileFromURL',`get data end`);

                            // var Obj={
                            //     Type : FuncType.System,
                            //     SN : null,
                            //     Func : EventTypes.UpdateApp,
                            //     Param : 0
                            // };

                            // this.emit(EventTypes.ProtocolMessage, Obj);

                            if(this.CheckDownloadTimeoutId != null)
                            {
                                clearTimeout( this.CheckDownloadTimeoutId );
                                this.CheckDownloadTimeoutId = null;
                            }
                        });
                    }
                    response.pipe(file);
                }).on('error', (err) => {
                    isError = true;  this.DownloadFileCancel = false;
                    env.log('Error','DownloadFileFromURL',`[downloadFile error:${err} url:${url}]`);
                    file.close((_) => {
                        fs.unlink(dest, () => {
                            var obj = {
                                Error : 0x1008,
                                Data : err
                            };
                            resolve(obj);
                        });
                    });
                    var Obj = this.GetEventParamerObj(null, EventTypes.DownloadFileError, null);
                    this.emit(EventTypes.ProtocolMessage, Obj);
                    if(this.CheckDownloadTimeoutId != null)
                    {
                        clearTimeout( this.CheckDownloadTimeoutId );
                        this.CheckDownloadTimeoutId = null;
                    }
                });
            }catch(ex){
                env.log('Error','DownloadFileFromURL',`ex:${(ex as Error).message}`);
                var obj = {
                            Error : 0x1008,
                            Data : ex
                          };
                if(this.CheckDownloadTimeoutId != null)
                {
                    clearTimeout( this.CheckDownloadTimeoutId );
                    this.CheckDownloadTimeoutId = null;
                }
                var Obj = this.GetEventParamerObj(null, EventTypes.DownloadFileError, null);
                this.emit(EventTypes.ProtocolMessage, Obj);
                resolve(obj);
            }
        });
    };

    DownloadInstallPackage = (callback) => {
        env.log('UpdateClass','UpdateClass','DownloadInstallPackage')
        try{
            var packPath = os.tmpdir()+"/"+AppData.ProjectName+".zip";
            this.DownloadFileCancel = false;
            env.log('UpdateClass','DownloadInstallPackage',`package:${packPath}`);
            var pathExt = path.extname(packPath).toLowerCase();
            var dirName = path.join(path.dirname(packPath), 'GSPYUpdate');
            if (fs.existsSync(dirName)){
                env.DeleteFolderRecursive(dirName, false);
            }else{
                fs.mkdirSync(dirName);
            }

            if(env.isMac && pathExt === '.zip'){
                cp.execFile('/usr/bin/unzip',['-q','-o',packPath,'-d',dirName],(err, stdout, stderr) => {
                    if(err != undefined && err != null){
                        env.log('Error','DownloadInstallPackage',`upzip error : ${err}`);
                    }
                    if(stderr != undefined && stderr != null){
                        env.log('Error','DownloadInstallPackage',`upzip error :`+stderr);
                    }
                    var baseName = this.GetExtFilePath(dirName, '.mpkg');
                    if (baseName === undefined){
                        baseName = this.GetExtFilePath(dirName, '.pkg');
                    }
                    if (baseName === undefined){
                        env.log('Error','DownloadInstallPackage',`Not found .mpkg file in:${dirName}`);
                        callback(0x1008);
                        return;
                    }
                    cp.execFile('/bin/chmod',['777',baseName],(err, stdout, stderr) => {
                        if(err!=undefined && err!=null){
                            env.log('Error','DownloadInstallPackage',`chomd error:${err}`);
                        }
                        if(stderr != undefined && stderr != null){
                            env.log('Error','DownloadInstallPackage',`chomd error:${stderr}`);
                        }
                        fs.unlink(packPath,() => {
                            env.log('UpdateClass','DownloadInstallPackage',`run insPack:${baseName}`);
                            shell.openPath(baseName!);
                            callback();
                        });
                    });
                });
            }else if(env.isWindows && pathExt === '.zip'){
                try
                {
                    var zip = new AdmZip(packPath);
                    zip.extractAllTo(dirName, true);
                    var baseName = this.GetExtFilePath(dirName, '.exe');
                    if (baseName === undefined){
                        env.log('Error','DownloadInstallPackage',`Not found .exe file in ${dirName}`);
                        callback(0x1008);
                        return;
                    }
                    fs.unlink(packPath,function ()
                    {
                        env.log('UpdateClass','DownloadInstallPackage',`run insPack:${dirName}`);
                        try
                        {
                            shell.openPath(baseName!);
                        }catch(e){
                            env.log('Error','openPath error : ',e);
                        }
                        callback();
                    });
                }catch(e){
                    env.log('UpdateClass','openPath : ',(e as Error).toString());
                }

            }
        }catch(ex){
            env.log('Error','DownloadInstallPackage',`ex:${(ex as Error).message}`);
            callback(0x1008);
        }
    };

    UpdateFW = () => {
        env.log('UpdateClass','UpdateClass','UpdateFW');
        return new Promise<void>((resolve,reject) => {
            try{
                if(env.isMac && fs.existsSync(os.tmpdir()+"/GSPYFWUpdate"))
                {
                    var Obj: any ={
                        Type : FuncType.System,
                        Func : EventTypes.UpdateFW,
                        Param : 0
                    };

                    this.emit(EventTypes.ProtocolMessage, Obj);
                    return resolve();
                }
                else if(env.isWindows && fs.existsSync(os.tmpdir()+"\\"+"GSPYFWUpdate")){
                    var Obj: any ={
                        Type : FuncType.System,
                        SN : null,
                        Func : EventTypes.UpdateFW,
                        Param : 0
                    };

                    this.emit(EventTypes.ProtocolMessage, Obj);
                    return resolve();
                }
                request.get(AppData.UpdateUrl+'/UpdateApp.json',(err, resp, body) => {
                    var body = JSON.parse(body);
                    if(body.hasOwnProperty('FWVersion') && env.CompareVersion(AppData.FWVersion,body.FWVersion)){
                        var fromFile;
                        var toFile;
                        if(env.isWindows){
                            fromFile = AppData.UpdateUrl+body.FWName.Win;
                            toFile = os.tmpdir()+"\\"+AppData.ProjectName+"FW.zip";
                        }
                        else{
                            fromFile = AppData.UpdateUrl+body.FWName.Mac;
                            toFile = os.tmpdir()+"/"+AppData.ProjectName+"FW.zip";
                        }
                        this.DownloadFileFromURL(fromFile, toFile, true).then((obj) => {
                            // this.DownloadFWInstallPackage(() => {
                                env.log('UpdateClass','UpdateApp','DownloadFileFromURL success');
                                var Obj={
                                    Type : FuncType.System,
                                    SN : null,
                                    Func : EventTypes.UpdateFW,
                                    Param : 0
                                };

                                this.emit(EventTypes.ProtocolMessage, Obj);

                                resolve();
                            // })
                        })
                    }else{
                        env.log('UpdateClass','UpdateApp','DownloadFileFromURL fail');
                        resolve();
                    }
                })

            }catch(ex){
                reject(ex);
            }
        });
    }


    DownloadFWInstallPackage = (callback) => {
        env.log('UpdateClass','UpdateClass','DownloadInstallPackage')
        try{
            var packPath = os.tmpdir()+"/"+AppData.ProjectName+"FW.zip";
            this.DownloadFileCancel = false;
            env.log('UpdateClass','DownloadInstallPackage',`package:${packPath}`);
            var pathExt = path.extname(packPath).toLowerCase();
            var dirName = path.join(path.dirname(packPath), 'GSPYFWUpdate');
            if (fs.existsSync(dirName)){
                env.DeleteFolderRecursive(dirName, false);
            }else{
                fs.mkdirSync(dirName);
            }
            if(env.isMac && pathExt === '.zip'){
                cp.execFile('/usr/bin/unzip',['-q','-o',packPath,'-d',dirName],(err, stdout, stderr) => {
                    if(err != undefined && err != null){
                        env.log('Error','DownloadInstallPackage',`upzip error : ${err}`);
                    }
                    if(stderr != undefined && stderr != null){
                        env.log('Error','DownloadInstallPackage',`upzip error :`+stderr);
                    }
                    var baseName = this.GetExtFilePath(dirName, '.mpkg');
                    if (baseName === undefined){
                        baseName = this.GetExtFilePath(dirName, '.pkg');
                    }
                    if (baseName === undefined){
                        env.log('Error','DownloadInstallPackage',`Not found .mpkg file in:${dirName}`);
                        callback(0x1008);
                        return;
                    }
                    cp.execFile('/bin/chmod',['777',baseName],(err, stdout, stderr) => {
                        if(err!=undefined && err!=null){
                            env.log('Error','DownloadInstallPackage',`chomd error:${err}`);
                        }
                        if(stderr != undefined && stderr != null){
                            env.log('Error','DownloadInstallPackage',`chomd error:${stderr}`);
                        }
                        fs.unlink(packPath,() => {
                            env.log('UpdateClass','DownloadInstallPackage',`run insPack:${baseName}`);
                            shell.openPath(baseName!);
                            callback();
                        });
                    });
                });
            }else if(env.isWindows && pathExt === '.zip'){
                try
                {
                    var zip = new AdmZip(packPath);
                    zip.extractAllTo(dirName, true);
                    var baseName = this.GetExtFilePath(dirName, '.exe');
                    if (baseName === undefined){
                        env.log('Error','DownloadInstallPackage',`Not found .exe file in ${dirName}`);
                        callback(0x1008);
                        return;
                    }
                    fs.unlink(packPath,function ()
                    {
                        env.log('UpdateClass','DownloadInstallPackage',`run insPack:${dirName}`);
                        try
                        {
                            shell.openPath(baseName!);
                        }catch(e){
                            env.log('Error','openPath error : ',e);
                        }
                        callback();
                    });
                }catch(e){
                    env.log('UpdateClass','openPath : ',(e as Error).toString());
                }

            }
        }catch(ex){
            env.log('Error','DownloadInstallPackage',`ex:${(ex as Error).message}`);
            callback(0x1008);
        }
    };
    downloadFile = (url,Filepath) => {
        global.UpdateFlag = true;
        env.log('update','downloadFile',`start donwload url:${url}`)
        return new Promise<void>((resolve, reject) => {
            try{
                var urlObj = gUrl.parse(url);
                var protocol = urlObj.protocol == 'https:' ? https : http;;
                let temptext;
                var Files = fs.createWriteStream(Filepath);
                var buffer = "";
                let request = protocol.get(url, { rejectUnauthorized: false}, (response) => {
                    var len = parseInt(response.headers['content-length'] as any, 10);
                    var cur = 0;
                    var total = len / 1048576; //1048576 - bytes in  1Megabyte

                    request.on("error", (e) => {
                        env.log('update.js','downloadFile',`${e}`)
                        var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'downloadFile_Fail:'+`${e}`, Func: 'DownloadProgress'});
                        this.emit(EventTypes.ProtocolMessage, Obj);
                        global.UpdateFlag = false;
                        resolve();
                        request.abort();
                    });

                    response.on("data", (chunk) => {
                        buffer += chunk;
                        cur += chunk.length;
                        temptext = "Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r" + ".<br/> Total size: " + total.toFixed(2) + " mb";
                        console.log(temptext);
                        env.log('update.js','downloadFile',temptext);
                        let progress = (100.0 * cur / len).toFixed(0)
                        var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : progress, Func: 'DownloadProgress'});
                        this.emit(EventTypes.ProtocolMessage, Obj);
                    });

                    response.on("end", () => {
                        temptext = "Downloading complete";
                        env.log('update.js','downloadFile','Downloading complete');
                        console.log(temptext)
                    });
                    response.pipe(Files);
                    Files.on('finish', () => {
                        Files.close((error) => {
                            if(error) {
                                env.log('update.js','downloadFile',`${error}`)
                                var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'downloadFile_Fail', Func: 'DownloadProgress'});
                                this.emit(EventTypes.ProtocolMessage, Obj);
                                resolve()
                                return;
                            }
                            var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : "Success", Func: 'DownloadProgress'});
                            if(Filepath.indexOf('.zip') != -1) {
                                try{
                                    let Zip = new AdmZip(Filepath);
                                    Zip.extractAllTo(AppPaths.DownloadsFolder+"\\",true);
                                    this.emit(EventTypes.ProtocolMessage, Obj);
                                }
                                catch(e) {
                                    env.log('update','DownloadProgress',`err:${e}`)

                                    var AdmZipFail = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'AdmZip_Fail', Func: 'DownloadProgress'});
                                    this.emit(EventTypes.ProtocolMessage, AdmZipFail);
                                    resolve()
                                    return;
                                }
                            }
                            else {
                                this.emit(EventTypes.ProtocolMessage, Obj);
                            }
                            resolve();
                        });
                    });
                    Files.on('error',() => {
                        env.log('update.js','downloadFile','downloadFile_Fail,Files.on error');
                        var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'downloadFile_Fail', Func: 'DownloadProgress'});
                        this.emit(EventTypes.ProtocolMessage, Obj);
                        resolve()
                    });
                }).on('error', (err) => {
                    env.log('update.js','downloadFile',`${err}`)
                    var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'downloadFile_Fail'+`${err}`, Func: 'DownloadProgress'});
                    this.emit(EventTypes.ProtocolMessage, Obj);
                    global.UpdateFlag = false;
                    resolve();
                    request.abort();
                }).setTimeout(15000, () => {
                    env.log('update.js','downloadFile','timeout')
                    var Obj = this.GetEventParamerObj(null, EventTypes.DownloadProgress, {Current : 'downloadFile_Fail', Func: 'DownloadProgress'});
                    this.emit(EventTypes.ProtocolMessage, Obj);
                    global.UpdateFlag = false;
                    resolve();
                    request.abort();
                });
            } catch(e) {
                env.log('update','downloadFile',`err:${e}`)
                resolve()
            }
        });
    }
}
