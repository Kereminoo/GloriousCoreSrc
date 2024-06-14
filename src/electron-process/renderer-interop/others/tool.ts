import fs_promises from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env";

/**
*   @data 儲存資料
*   @path 儲存位置
*/
export function SaveFile(filename, data, path, callback,exportVersion) {
    return new Promise<void>(async () =>
    {
        const finaldata: any = {
            filename: filename,
            exportVersion:exportVersion,
            value: data
        }
        let result;
        try
        {
            result = await fs_promises.writeFile(path, JSON.stringify(finaldata));
            callback(result, true);
        }
        catch(error)
        {
            callback(error, result);
        }
    });
}

export function ClearFolder(folderpath) 
{
    let folder_exists = fs.existsSync(folderpath);
    if(folder_exists) {
        let filelist = fs.readdirSync(folderpath, {withFileTypes: true});
        filelist.forEach(function(file) 
        {
            if(file.isFile())
            {
                fs.unlinkSync(path.join(folderpath,file.name))
            }
            else if(file.isDirectory())
            {
                const dir = path.join(folderpath,file.name);
                ClearFolder(dir);
                fs.rmdir(dir, (exception) =>
                {
                    console.log(exception);
                    env.log('Tool', 'ClearFolder', exception);
                });
            }
        })
    }
}



export function SupportSaveFile(data, path, callback) {
    return new Promise<void>(async () =>
    {
        let result;
        try
        {
            result = await fs_promises.writeFile(path, JSON.stringify(data));
            callback(result, true);
        }
        catch(error)
        {
            callback(error, result);
        }
    });
}









/**
*   @path 檔案位置
*/
export function OpenFile(path, callback) {
    fs.readFile(path, function(err,data){
        if(err)
            callback(err, data)
        else
            callback(err, data.toString());
    })
}

export function wait(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


// export function getNodeLibrary(path: string, timeoutMs: number = 100)
// {
//     let result;
//     const importFile = async () =>
//     {
//         result = await new Promise(async (resolve, reject) =>
//         {
//             try
//             {
//                 const value = await import(path);
//                 if(result == null)
//                 {
//                     resolve(value);
//                 }
//             }
//             catch(error)
//             {
//                 reject(error);
//             }
//         });
//     };
//     const startTime = Date.now();
//     const loop = () =>
//     {
//         const elapsedTime = Date.now() - startTime;
//         if(elapsedTime > timeoutMs)
//         {
//             throw new Error(`Timed out when importing node library: ${path}`) 
//         }

//         if(result == null)
//         {
//             requestAnimationFrame(loop);
//         }
//         if(result instanceof Error)
//         {
//             throw result;
//         }
//     };
//     importFile();
//     requestAnimationFrame(loop);
//     return result;
// }

// export function getNodeLibrary(path: string)
// {
//     new Promise<void>((_) => 
//     {
//         import(path).then(value => 
//         {
//             return value;
//         })
//         .catch(error => { throw error });
//     })
// }

// export function getNodeLibrary(path: string)
// {
//     const value = new Promise(() =>
//     {

//     });

//     for(let i = 0; i < )
// }