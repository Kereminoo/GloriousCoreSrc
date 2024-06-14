

export class FirewareManager {
    chooseDeviceIndex=0;
    FwServerData=new Array<any>();
    forceUpgradeData=new Array<any>();
    forceUpgradeIndex=0;
    /*
    * getNowTargetData
    */
    getTarget() : any
    {
       if(this.FwServerData.length>0)
       {
        return this.FwServerData[this.chooseDeviceIndex];
       }
       return undefined;
    }

    /*
    * getforceTarget
    */
    getforceTarget() : any
    {
        return this.forceUpgradeData[this.forceUpgradeIndex];
     }

    /*
    * reset Var
    */
    reset(){
        this.chooseDeviceIndex=0;
        this.FwServerData=[];
    }

    /*
    * checkHasUpdate
    */
    checkHasUpdate(){
        for (let index = 0; index < this.FwServerData.length; index++)
        {
            const item : any = this.FwServerData[index];
            if(!item.tryToUpdate){     
                return "YES"
            } 
        }
        return "NO"
    }

    /**
    *compare version
    * @param version number:A version
    * @param targetVersion number:B version
    * @param exponent number:exponent 
    * return result:
    * 0: is equal to
    * 1: is more than
    * -1: is less than
    */
    versionCompare(version: any, targetVersion: any, exponent: any) {
        var getVersionNumber, length;
        exponent = exponent || 2;
        if (!version || !targetVersion) {
            console.log('Need two versions to compare!',version,targetVersion);
            throw new Error('Need two versions to compare!');
        }
        if (version === targetVersion) {
            return 0;
        }
        length = Math.max(version.split('.').length, targetVersion.split('.').length);
        let self = this;
        getVersionNumber = (function (length, exponent) {
            return function (version: any) {
                return self.versionToNumber(version, length, exponent);
            };
        })(length, exponent);
        version = getVersionNumber(version);
        targetVersion = getVersionNumber(targetVersion);
        return version > targetVersion ? 1 : (version < targetVersion ? -1 : 0);
    }

    /*
    * format version
    */
    // versionToNumber(version: any, length: any, exponent: any)
    // {
    //     let arr;
    //     if (arguments.length < 3) {
    //         return 0;
    //     }
    //     arr = version.split('.');
    //     version = 0;
    //     arr.forEach(function (value: any, index: any, array: any) {
    //         version += value * Math.pow(10, length * exponent - 1);
    //         length--;
    //     });
    //     return version;
    // }

    versionToNumber(version: any, length: any, exponent: any)
    {
        // [dmercer]: rewritten to work around prerelease tags like (-dev, -rc) and build metadata (+[date].forcecompile).


        let workingString = version;

        const metadataArray: string[] = workingString.split('+');
        workingString = metadataArray.shift();
        let metadata: string[]|undefined;
        if(metadataArray.length > 0)
        {
            metadata = metadataArray[0].split('.');
        }

        const prereleaseTagArray: string[] = workingString.split('-');
        workingString = prereleaseTagArray.shift();
        let prereleaseTag: string|undefined;
        if(prereleaseTagArray.length > 0)
        {
            prereleaseTag = prereleaseTagArray[0];
        }

        const versionNumberArray: string[] = workingString.split('.');
        let versionNumber = 0;
        versionNumberArray.forEach(function (value: any, index: any, array: any) {
            versionNumber += value * Math.pow(10, length * exponent - 1);
            length--;
        });
        return versionNumber;
    }
}
