// let debug = require('../../../../package.json')
// let UpdateUrl = ""
// let env = require('./env')
// let fs = require('fs')
// if (fs.existsSync(process.env.APPDATA + "\\GSPYTESTServer.TEST"))
// {
//     try{
//         // fs.readFile(process.env.APPDATA + "\\GSPYTESTServer.TEST", function(err,data){
//         //     if(err){
//         //         UpdateUrl = 'https://gloriouscore.nyc3.digitaloceanspaces.com/Glorious_Core/Version.json';
//         //         env.log('Setting','readFile-error',`Error:err`);
//         //     }else{
//         //         let parsedData = JSON.parse(data);
//         //         UpdateUrl = parsedData.UpdateUrl;
//         //     }
//         // })
//         let data = fs.readFileSync(process.env.APPDATA + "\\GSPYTESTServer.TEST");
//         let parsedData = JSON.parse(data);
//         UpdateUrl = parsedData.UpdateUrl;
//     } catch(e) {
//         UpdateUrl = 'https://gloriouscore.nyc3.digitaloceanspaces.com/Glorious_Core/Version.json';
//         env.log('Setting','readFile-error',`Error:${e}`);
//     }
// }

// if(UpdateUrl == null || (UpdateUrl.trim != null && UpdateUrl.trim(UpdateUrl) == ""))
// {
//     UpdateUrl = 'https://gloriouscore.nyc3.digitaloceanspaces.com/Glorious_Core/Version.json';
// }
// function getUpdateUrl() {
//     return UpdateUrl
// }
// exports.getUpdateUrl = getUpdateUrl;