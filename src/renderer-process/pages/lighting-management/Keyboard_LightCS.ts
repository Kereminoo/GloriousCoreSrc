/**-----------------------------------------------------------------------------------------
 * Author:G-SPY Louis
 * M_Light_CS:Light Module Class
 * Processing lighting effect calculation
-----------------------------------------------------------------------------------------*/
export class M_Light_CS {
    maxkaycapNumber = 0
    repeater;
    AllBlockColor: any = []
    lightData={
        translate:'GloriousMode',
        PointEffectName:'GloriousMode',
        colorPickerValue:[255,0,0,1],
        brightness:100,
        speed:50,
    };
    animationSpeed=1;
    currentBlockIndex=0;
    minKeyWidth=43;
    minKeyHeight=41;
    settingPerkeyName=''
    imageMaxWidth=0;
    imageMaxHeight=0;
    recordModeArr: any = []
    currentModeIndex: any = 0
    twoDimensionalArray=new Array(26);//8*26;
    KeyTableArray=[];
    qigong_Step2_Range=[22,23, 38,52,51 ,36];
    qigong_Step1_Range=[0,15,30,58,71,82];
    BreathTempArray=[];
    centerBlockPoint=37;
    break_DimensionalArray=[];
    max_X_Number=26;
    max_Y_Number=8;
    /**
     * constructor
     * @param inputMax number:maxkaycapNumber
    */
    constructor(inputMax) {
        this.maxkaycapNumber = inputMax
        for (var i_block = 0; i_block < this.maxkaycapNumber; i_block++) {
            this.AllBlockColor.push({ clearStatus:false,color: [0,0,0,0],breathing:false,border: true,coordinateData:[],keyCode:''})
            this.BreathTempArray.push({ clearStatus:false,color: [0,0,0,0],breathing:false,border: true,coordinateData:[],keyCode:''})

        }
        for (let index = 0; index < this.twoDimensionalArray.length; index++) {
                this.twoDimensionalArray[index]=[];
        }
        for (let index = 0; index < this.twoDimensionalArray.length; index++) {
            for (let index2 = 0; index2 < 8; index2++) {
                this.twoDimensionalArray[index].push(this.defaultModule());
            }
        }

    }

    /**
     * defaultModule
    */
    defaultModule() {
        var T = 
            {
                blockIndex:9999,
                color: [255,0,0,1],
            }
        
        return T
    }

    /**
     * setKeyTableArray
     * @param KeyTableArray Array:KeyTableArray
    */
    setKeyTableArray(KeyTableArray){
        this.KeyTableArray=KeyTableArray;
        for (let index = 0; index < this.KeyTableArray.length; index++) {
            var min = this.KeyTableArray[index][0];//14
            var max = this.KeyTableArray[index][1];//29
            var total = max - min;
            for (let i3 = 0; i3 <= total; i3++) {
                this.twoDimensionalArray[i3][index].blockIndex = i3 + min;
                //console.log('twoDimensionalArray', this.twoDimensionalArray[index][i3]=i3+min);
            }
        }
        //console.log('twoDimensionalArray', this.twoDimensionalArray);
        //console.log('KeyTableArray', this.KeyTableArray);
    }

    /**
     * showTwoDimensionalArray
    */
    showTwoDimensionalArray(){      
        for (let index = 0; index < this.twoDimensionalArray.length; index++) {
            for (let index2 = 0; index2 < 8; index2++) {
                let target=this.twoDimensionalArray[index][index2];
                if(target.blockIndex!=9999){
                    this.AllBlockColor[target.blockIndex].color=target.color;
                }
            }
        }
    }

    /**
     * resetTwoDimensionalArray
     * @param colors Array:RGBA
    */
    resetTwoDimensionalArray(colors=[0,0,0,1]){
        for (let index = 0; index < this.twoDimensionalArray.length; index++) {
            //var temp_=new Array(26);
            for (let index2 = 0; index2 < this.twoDimensionalArray[index].length; index2++) {
                //const element = array[index];
                let target=this.twoDimensionalArray[index][index2];
                target.color=colors;           
            }
        }
    }

    /**
     * setCoordinateData
     * @param RGBList obj:RGBList
    */
    setCoordinateData(RGBList){
        for (let index = 0; index < RGBList.length; index++) {
            let element = RGBList[index];
            //element.setAttribute('data-index', String(index));
            //element.setAttribute('coordinate', String(element));     
            var obj = {
                "clientHeight": element.clientHeight,
                "clientWidth": element.clientWidth,
                "offsetLeft": element.offsetLeft,
                "offsetTop": element.offsetTop,
                "scroll": element.scroll,
                "top_Left": [element.offsetLeft, element.offsetTop],
                "top_Right": [element.offsetLeft + element.clientWidth, element.offsetTop],
                "bottom_Left": [element.offsetLeft, element.offsetTop + element.clientHeight],
                "bottom_Right": [element.offsetLeft + element.clientWidth, element.offsetTop + element.clientHeight],
                "center_Point": [element.offsetLeft + (element.clientWidth/2), element.offsetTop + (element.clientHeight/2)],
            }
            try {
                this.AllBlockColor[index].coordinateData = obj;

            } catch (error) {
                console.log('coordinateData==undefined', this.AllBlockColor);  
            }
        }

    }
    
    /**
     * setPerkey
     * @param obj obj:resetData
     * @param Clear obj:resetData
     * @param colorPickerValue Array:RGBA
     * @param obj obj:breathingData
    */
    setPerkey(index,Clear,colorPickerValue,breathing){
        if(!Clear){
            this.AllBlockColor[index].color=[0,0,0,0];
            this.AllBlockColor[index].breathing=false;
            this.AllBlockColor[index].clearStatus=false;
        }
        else{
            this.AllBlockColor[index].color=JSON.parse(JSON.stringify(colorPickerValue));
            this.AllBlockColor[index].breathing=breathing;
            this.AllBlockColor[index].clearStatus=true;
            console.log('%c setPerkey,breathing,Clear','color:rgb(255,77,255)',  this.AllBlockColor[index].breathing,Clear);
        }
    }

    /**
     * resetDefault
     * @param obj obj:resetData
    */
    resetDefault(resetData) {
        this.lightData =resetData;
        var arr = Object.keys(resetData);
        for (var i = 0; i < this.AllBlockColor.length; i++) {
            for (let index = 0; index < arr.length; index++) {
                if (this.AllBlockColor[i][arr[index]] != undefined) {
                    this.AllBlockColor[i][arr[index]] = resetData[arr[index]]
                }
            }
            this.AllBlockColor[i].color=[0,0,0,0];
        }
    }

    /**
    * setGroupArrayColor
    *@param obj obj:GroupArray Data
    */
    setGroupArrayColor(obj){  
        //groupArray,assignColor=[],isAll=false,clearStatus=false,colorPickerValue,breathing
        if(obj.isAll){
            obj.groupArray=[];
            for (let i = 0; i < this.AllBlockColor.length; i++) {
                obj.groupArray.push(i);
            }
        }
        if(obj.assignColor.length<1){
            //console.log('setGroupArrayColor_assignColor', assignColor)
            obj.assignColor=JSON.parse(JSON.stringify(obj.colorPickerValue));
        }
        var target=this.AllBlockColor;
        obj.groupArray.forEach(function(value, index, array){//array=GroupArray
            target[value].color = obj.assignColor;
            target[value].breathing=obj.breathing;
            target[value].clearStatus=obj.clearStatus;
        });
    }

    /**
     * componentToHex
     * @param r number:Red
     * @param g number:Green
     * @param b number:blue
    */
    rgbToHex(r, g, b) {
        r = Number(r);
        g = Number(g);
        b = Number(b);
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /**
     * componentToHex
     * @param c number:number to Hexadecimal
    */
    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * getNowBlock
     * @param index number:AllBlockColor index
    */
    getNowBlock(index) {
        try {
            return this.AllBlockColor[index];
        } catch (error) {
            return this.AllBlockColor[this.currentBlockIndex];
        }
    }

    /**
     * getNowTargetData
    */
    getTarget() {
        //console.log(" this.recordModeArr[this.currentModeIndex];", this.recordModeArr[this.currentModeIndex]);
        return this.recordModeArr[this.currentModeIndex]
    }

    /**
     * distanceCalculation
     * @param x1y1:number:Point1 coordinate
     * @param x2y2:number:Point2 coordinate
     * 
    */
    distanceCalculation(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));//å…©é»žè·�é›¢
    }

    /**
     * onSetModeRefresh
    */
    onSetModeRefresh(){
        this.setAnimationSpeed();
        clearInterval(this.repeater);
        this.setAllBlockColor([0, 0, 0, 1]);
    }

    /**
     * mode_NormallyOn
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_NormallyOn(colors =[[0,0,0,1]], isRainbow = true) {
        clearInterval(this.repeater);
        console.log('%c mode_NormallyOn','color:rgb(255,75,255,1)',colors,colors[this.getRandom(0, colors.length - 1)]);
        this.repeater = setInterval(() => {  
            var temp_colorData = JSON.parse(JSON.stringify(colors[this.getRandom(0, colors.length - 1)]));
            for (let index = 0; index < 3; index++) {
                temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }     
            this.setAllBlockColor(temp_colorData);
        }, 50)
    }

    /**
     * mode_NormallyOnMulticolor
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_NormallyOnMulticolor(colors = [[255,0,0,1]], isRainbow = true) {
        clearInterval(this.repeater);
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        var setRGB;
        var RGBObj =[[255,0,0,1],[255,0,0,1],[0, 255, 0,1],[0,0,255,1],[0, 0, 255,1]];
        var Rainbow_totalstep=60;
        var Rainbow_step=0;
        var Rainbow_i=0;
        console.log('%c mode_NormallyOnMulticolor','color:rgb(255,75,255,1)',colors);
        for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.imageMaxWidth/60/5) {
            if(Rainbow_step<Rainbow_totalstep){
                Rainbow_step+=1; 
            }
            else{
                Rainbow_step=0;
                if(Rainbow_i<RGBObj.length-2){
                    Rainbow_i+=1; 
                }
                else{
                    Rainbow_i=0;
                }    
            }
                var t_data = [0,0,0,1];
                for (let index = 0; index < 3; index++) {
                    t_data[index] = (RGBObj[Rainbow_i][index] * (Rainbow_totalstep - Rainbow_step) + RGBObj[Rainbow_i+1][index] * Rainbow_step) / Rainbow_totalstep;
                }
                setRGB=t_data;
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(0,this.imageMaxHeight/2, element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
                    var temp_colorData = JSON.parse(JSON.stringify(setRGB));
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }     
                    element.color=temp_colorData;
                }    
            }
        }
    }

    /**
     * mode_NormallyOnMulticolor
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_AcidMode(colors=[]){
        clearInterval(this.repeater);
        colors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]];
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(50).coordinateData;
        var mode_step = 0;
        var step = 60;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.minKeyWidth) {
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
               
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
                    repeatCountList.push({
                        color: colors[0],
                        recordIndex:index,
                        repeatTime: this.getRandom(5, 25),
                    });
                }     
            }
        }
        console.log('repeatCountList', repeatCountList)
        this.repeater = setInterval(() => {
            var t_Count=repeatCount%3;
            var t_Count2;
            if(t_Count+1<colors.length)
            {
                t_Count2=t_Count+1;
            }
            else{
                t_Count2=0;
            } 
            for (let index = 0; index < repeatCountList.length; index++) {     
                var nowColor=JSON.parse(JSON.stringify(colors));
                var temp_colorData = [0,0,0,1];
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = (nowColor[t_Count][index] * (step - nowStep) + nowColor[t_Count2][index] * nowStep) / step;
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                } 
                var target = this.AllBlockColor;
                target[repeatCountList[index].recordIndex].color=JSON.parse(JSON.stringify(temp_colorData));        
            }
            if(nowStep<step-1){
                nowStep+=1;
                
            }
            else{
                nowStep=0;
                repeatCount += 1;
            }              
        }, 50*this.animationSpeed)
    }

    /**
     * mode_Kamehemeha
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Kamehemeha(colors=[[255,0,0,1]], isRainbow = true){
        clearInterval(this.repeater);
        if(isRainbow){
            colors = this.rainbow7Color();
        }
        var centerBlockIndex=this.centerBlockPoint;
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(this.centerBlockPoint).coordinateData;
        this.setAllBlockColor([0, 0, 0, 1]);
        var target = this.AllBlockColor;
        var setRGB=this.rainbow7Color();
        var setArray=JSON.parse(JSON.stringify(this.qigong_Step1_Range));
        console.log('enter mode_Kamehemeha')
        this.repeater = setInterval(() => {
            for (let index = 0; index < setArray.length; index++) {
            var temp_colorData = JSON.parse(JSON.stringify(colors[this.getRandom(0,colors.length-1)]));
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }     
            target[setArray[index]].color=temp_colorData; 
            }
            for (let index = 0; index < setArray.length; index++) {
                if (setArray[index] < centerBlockIndex) {
                    setArray[index]+=1;
                }
                else{
                    if( target[setArray[index]].coordinateData.center_Point[0]>StartPoint.center_Point[0]){
                        setArray[index]-=1;
                    }
                }
            }       
            repeatCount += 1;
            if(repeatCount>7){
                if(isRainbow){
                    this.mode_Kamehemeha2(colors,true);              
                }
                else{
                    this.mode_Kamehemeha2(colors,false);              
                }
            }
        }, 55*this.animationSpeed)
    }

    /**
     * mode_Kamehemeha2
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Kamehemeha2(colors=[[255,0,0,1],[0,255,0,1],[0,0,255,1]], isRainbow = true){
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(this.centerBlockPoint).coordinateData;
        if(isRainbow){
            colors = this.rainbow7Color();
        }
        var qigongRangeIndex = [0];
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        for (let index = 0; index < target.length; index++) {
            var element = target[index];
            var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
            if (dis>5&& dis <= this.minKeyWidth*1.5 ) {
                repeatCountList.push({
                    color: colors[0],
                    recordIndex:index,
                    repeatTime: this.getRandom(5, 25),
                });
            }     
        }
        this.repeater = setInterval(() => {
            this.setAllBlockColor([0, 0, 0, 1]);
            var target = this.AllBlockColor;    
            for (let index = 0; index < qigongRangeIndex.length; index++) { 
                var temp_colorData = JSON.parse(JSON.stringify(colors[this.getRandom(0,colors.length-1)]));
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }          temp_colorData  
            target[this.qigong_Step2_Range[qigongRangeIndex[index]]].color=temp_colorData; 

            }
            for (let index = 0; index < qigongRangeIndex.length; index++) {        
                if(qigongRangeIndex[index]<this.qigong_Step2_Range.length-1){
                    qigongRangeIndex[index]+=1;
                }
                else{
                    qigongRangeIndex[index]=0;
                }
            }  
            repeatCount += 1;
            if(repeatCount>27){
                if(isRainbow){
                    this.mode_RippleGraff(colors,true,this.centerBlockPoint);              
                }
                else{
                    this.mode_RippleGraff(colors,false,this.centerBlockPoint);              
                }
            }
        }, 50*this.animationSpeed)

    }

	/**
	 * Array Sort
	 * @param array 
	 * @param key 
	 */
    ArraySort(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];x
            return x - y;
        });
    }

    /**
     * setAnimationSpeed
    */
    setAnimationSpeed(){
    this.animationSpeed =1*(1-this.lightData.speed/400);
    console.log('%c setAnimationSpeed','color:rgb(255,75,255,1)',this.animationSpeed,this.lightData);

    }
    /**
     * mode_Surmount
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_Surmount(colors = [[255,0,0,1]], isRainbow = true,blockIndex=48) {
        console.log('%cmode_Surmount_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        var mode_step = 0;
        var step = 30;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        this.repeater = setInterval(() => {
            var target = this.AllBlockColor;
            var setRGB;
            if (isRainbow) {
                setRGB = this.rainbow7Color()[this.getRandom(0, colors.length - 1)];
            }
            else {
                setRGB = colors[this.getRandom(0, colors.length - 1)];
            }
            var compareResult = this.minKeyWidth * repeatCount;
            var compareResultMax = this.minKeyWidth * repeatCount - this.minKeyWidth;
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (mode_step == 0) {
                    if (dis <= compareResult && dis >= compareResultMax) {
                        var temp_colorData=JSON.parse(JSON.stringify(setRGB));
                        for (let index2 = 0; index2 < 3; index2++) {
                            temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                        }
                        element.color = temp_colorData;
                    }
                }
                else {
                    clearInterval(this.repeater);
                }

            }
            if (nowStep + 1 < step) {
                nowStep += 1;
            }
            else {
                nowStep = 0;
                mode_step = 0;
                repeatCount = 0;
                clearInterval(this.repeater);
                this.setAllBlockColor([0, 0, 0, 1]);
            }
            if (this.minKeyWidth * repeatCount < this.imageMaxWidth) {
                repeatCount += 1;
            }
            else {
                mode_step = 1;
            }
        }, 50**this.animationSpeed)
    }

    /**
     * mode_RippleGraff
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_RippleGraff(colors = [[255,0,0,1]], isRainbow = true,blockIndex=48) {
        console.log('%c mode_RippleGraff','color:rgb(255,75,255,1)',colors,isRainbow);
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        var mode_step = 0;
        var totalstep = 30;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var r_totalstep = 30;
        var r_nowStep = 0;
        this.repeater = setInterval(() => {
            var target = this.AllBlockColor;
            var setRGB;
            if (isRainbow) {
                setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];
            }
            else {
                setRGB = colors[this.getRandom(0, colors.length - 1)];
            }
            var compareResult = this.minKeyWidth * repeatCount;
            var compareResultMax = this.minKeyWidth * repeatCount - this.minKeyWidth;
            if (r_nowStep + 1 < r_totalstep) {
                r_nowStep += 1;
            }
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (mode_step == 0) {
                    if (dis <= compareResult && dis >= compareResultMax) {
                        var temp_colorData = JSON.parse(JSON.stringify(setRGB));
                        for (let index = 0; index < 3; index++) {
                            temp_colorData[index] = (temp_colorData[index] * (r_totalstep - r_nowStep) + 0 * r_nowStep) / r_totalstep;
                            temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                        } 
                        element.color = temp_colorData;
                    }

                }
                else {
                    var temp_colorData = JSON.parse(JSON.stringify(setRGB));
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = (temp_colorData[index] * (totalstep - nowStep) + 0 * nowStep) / totalstep;
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    } 
                    element.color = temp_colorData;
                }

            }
            if (nowStep + 1 < totalstep) {
                nowStep += 1;
            }
            else {
                nowStep = 0;
                mode_step = 0;
                repeatCount = 0;
                clearInterval(this.repeater);
                this.setAllBlockColor([0, 0, 0, 1]);
                if(this.lightData.PointEffectName=="Kamehemeha"){
                    this.mode_Kamehemeha(colors,isRainbow);
                }
            }
            if (this.minKeyWidth * repeatCount < this.imageMaxWidth) {
                repeatCount += 1;
            }
            else {
                mode_step = 1;
            }
        }, 50**this.animationSpeed)
    }

    /**
     * mode_ConicRipple
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_ConicRipple(colors = [[255,0,0,1]], isRainbow = true,blockIndex=37) {
        console.log('%c mode_ConccRipple','color:rgb(255,75,255,1)',colors,isRainbow);
        clearInterval(this.repeater);
        var StartPoint = this.getNowBlock(this.centerBlockPoint).coordinateData;
        console.log('%c StartPoint','color:rgb(255,75,255,1)',StartPoint);
        var mode_step = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var setRGB;
        if (isRainbow) {
            var gradientRGB=[];
            var T_RGB=this.rainbow7Color();
            var g_totalStep=2;
            var g_nowstep=0;
            var T_nowColorIndex=0;
            while (T_nowColorIndex<T_RGB.length-1) {
                var T1Color=T_RGB[T_nowColorIndex];
                var T2Color=T_RGB[T_nowColorIndex+1];
                var gradient_COLOR=[0,0,0,1];
                for (let i_2 = 0; i_2 < 3; i_2++) {
                    //console.log('%c mode_ConicRippleRGB_gradientRGB','color:rgb(255,75,255,1)', T1Color[i_2],T2Color[i_2],gradient_COLOR,T1Color,T2Color);
                    gradient_COLOR[i_2]=(T1Color[i_2] * (g_totalStep - g_nowstep) + T2Color[i_2] * g_nowstep) /g_totalStep;
                }
                gradientRGB.push(gradient_COLOR);
                if(g_nowstep<g_totalStep){
                    g_nowstep+=1;
                }
                else{
                    g_nowstep=0;
                    T_nowColorIndex+=1;
                }

            }
            //console.log('%c mode_ConicRippleRGB_gradientRGB','color:rgb(255,75,255,1)',gradientRGB);
            setRGB = gradientRGB;//this.rainbow7Color();

            //setRGB = zzzzzzz;//this.rainbow7Color();
            
       
        }
        else {
            setRGB = colors[this.getRandom(0, colors.length - 1)];
        }
        var T_center_Point=StartPoint.center_Point;
        var diameter=this.imageMaxWidth-T_center_Point[0]+this.minKeyWidth;
        var diameter=this.minKeyWidth*setRGB.length;
        var target = this.AllBlockColor;
        var direction=0;
        var averagearr=[];
         for (let d_index = 0; d_index < setRGB.length; d_index++) {
            var averagePrevious=diameter/setRGB.length*d_index;
            var averageNext=averagePrevious+(diameter/setRGB.length);
             for (let index = 0; index < target.length; index++) {
                 var element = target[index];
                 var dis = this.distanceCalculation(T_center_Point[0], T_center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                 if (mode_step == 0) {
                     if (dis >= averagePrevious && dis <= averageNext) {
                         if (averagearr.some((x) => x.recordIndex == index) == false) {
                             averagearr.push(
                                 {
                                     color: setRGB[d_index],
                                     colorIndex: d_index,
                                     recordIndex: index,
                                 }
                             )
                         }
                     }
                 }
             }
         }
         console.log('%c mode_ConccRipple_averagearr','color:rgb(255,75,255,1)',averagearr);
         this.repeater = setInterval(() => {
           for (let index = 0; index < averagearr.length; index++) {
               const element = averagearr[index];
               if (direction == 1) {
                   if (element.colorIndex < setRGB.length - 1) {
                       element.colorIndex += 1;
                   }
                   else {
                       element.colorIndex = 0;
                   }
               }
               else {
                   if (element.colorIndex > 0) {
                       element.colorIndex -= 1;
                   }
                   else {
                       element.colorIndex = setRGB.length - 1;
                   }
               }
               var temp_colorData = JSON.parse(JSON.stringify(setRGB[element.colorIndex]));
               for (let index = 0; index < 3; index++) {
                   temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
               }
               target[element.recordIndex].color = temp_colorData;
           }
        }, 220*this.animationSpeed)
    }

    /**
     * mode_Blossom
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_Blossom(colors = [[255,0,0,1]], isRainbow = true,blockIndex=48) {
        //console.log('%c mode_RippleGraff_enter','color:rgb(255,75,255,1)',colors,this.AllBlockColor);
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        var mode_step = 0;
        var step = 30;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        this.repeater = setInterval(() => {
            var target = this.AllBlockColor;
            var setRGB;
            if (isRainbow) {
                setRGB = this.rainbow7Color()[this.getRandom(0, colors.length - 1)];
            }
            else {
                setRGB = colors[this.getRandom(0, colors.length - 1)];
            }
            var compareResult = this.minKeyWidth * repeatCount;
            var compareResultMax = this.minKeyWidth * repeatCount - this.minKeyWidth;
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (mode_step == 0) {
                    //console.log('mode_step', mode_step)
                    console.log('%c mode_Blossom','color:rgb(255,75,255,1)',dis,compareResult,compareResultMax);

                    if (dis <= compareResult && dis >= compareResultMax) {
                        var temp_colorData =JSON.parse(JSON.stringify(setRGB));
                        for (let index = 0; index < 3; index++) {
                            temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                        }                        
                        element.color =temp_colorData;
                    }
                }
                else {
                    var temp_colorData =JSON.parse(JSON.stringify(element.color));
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = (temp_colorData[index] * (step - nowStep) + index * nowStep) / step;
                    }                        
                    element.color =temp_colorData;
                    //console.log('element.color', temp_colorData, step, nowStep)
                }

            }
            if (nowStep + 1 < step) {
                nowStep += 1;
            }
            else {
                nowStep = 0;
                mode_step = 0;
                repeatCount = 0;
                clearInterval(this.repeater);
                //console.log('nowStep_end', mode_step, repeatCount, nowStep)
                this.setAllBlockColor([0, 0, 0, 1]);
            }
            if (this.minKeyWidth * repeatCount < 100) {
                repeatCount += 1;
                //console.log('repeatCount', repeatCount)
            }
            else {
                mode_step = 1;
            }
        }, 50*this.animationSpeed)
    }
    
    /**
     * mode_Cross
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_Cross(colors = [[255,0,0,1]], isRainbow = true,blockIndex=48) {
        //console.log('%c mode_RippleGraff_enter','color:rgb(255,75,255,1)',colors,this.AllBlockColor);
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        var mode_step = 0;
        var step = 30;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var RangeList=[];

        for (let index = -StartPoint.center_Point[0]; index < this.imageMaxWidth; index+=this.minKeyWidth/2) {
            RangeList.push([index,StartPoint.center_Point[1]]);
        }
        for (let index = -StartPoint.center_Point[1]; index < this.imageMaxHeight; index+=this.minKeyHeight) {
            RangeList.push([StartPoint.center_Point[0],index]);
            RangeList.push([StartPoint.center_Point[0]+this.minKeyWidth/2,index]);
        }
        this.repeater = setInterval(() => {
            var target = this.AllBlockColor;
            var setRGB;
            if (isRainbow) {
                setRGB = this.rainbow7Color()[this.getRandom(0, colors.length - 1)];
            }
            else {
                setRGB = colors[this.getRandom(0, colors.length - 1)];
            }
            console.log('RangeList', RangeList)
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (mode_step == 0) {
                    //console.log('%c mode_Cross','color:rgb(255,75,255,1)',dis);
                    for (let i2 = 0; i2 < RangeList.length; i2++) {
                        var T=RangeList[i2];
                        if (T[0] > element.coordinateData.top_Left[0] &&
                            T[0] < element.coordinateData.top_Right[0] &&
                            T[1] > element.coordinateData.top_Left[1] &&
                            T[1] < element.coordinateData.bottom_Left[1]
                        ) {
                            element.color = setRGB;
                            break;
                        }
                    }
                    var temp_colorData =JSON.parse(JSON.stringify(element.color));
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = (temp_colorData[index] * (step - nowStep) + index * nowStep) / step;
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }                        
                    element.color =temp_colorData;
                }
                // else {
                //     var T = JSON.parse(JSON.stringify(element.color));
                //     T[0] = (T[0] * (step - nowStep) + 0 * nowStep) / step;
                //     T[1] = (T[1] * (step - nowStep) + 0 * nowStep) / step;
                //     T[2] = (T[2] * (step - nowStep) + 0 * nowStep) / step;
                //     element.color = T;
                //     //console.log('element.color', T, step, nowStep)
                // }
            }
            if (nowStep + 1 < step) {
                nowStep += 1;
            }
            else {
                nowStep = 0;
                mode_step = 0;
                clearInterval(this.repeater);
                //console.log('nowStep_end', mode_step, repeatCount, nowStep)
                //this.setAllBlockColor([0, 0, 0, 1]);
            }

        }, 50*this.animationSpeed)
        //clearInterval(this.repeater);
    }

    /**
     * mode_Breathing
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Breathing(colors = [[255,0,0,1]], isRainbow = true) {
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var mode_step = 0;
        var step = 60;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        var setRGB;
        var repeatCircleCount=0;
        console.log('%c mode_Breathing','color:rgb(255,75,255,1)',this.imageMaxWidth);

        for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.minKeyWidth) {
            //const element = array[index];
            if (isRainbow) {
                setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];  
            }
            else {
                setRGB = colors[0];
            }
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
               
                var dis = this.distanceCalculation(StartPoint.center_Point[0], StartPoint.center_Point[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
                    //element.color = setRGB;
                    repeatCountList.push({
                        color: setRGB,
                        recordIndex:index,
                        repeatTime: this.getRandom(5, 25),
                    });
                }     
                
    
            }
        }
        console.log('repeatCountList', repeatCountList)

        this.repeater = setInterval(() => {
            //this.mode_reset();
            var t_Count=repeatCount%2;
            var t_Count2=0;
            if(t_Count==0){
                t_Count2=1;
            }
            else{
                t_Count2=0;
            }
            for (let index = 0; index < repeatCountList.length; index++) {     
                var nowColor=[JSON.parse(JSON.stringify(repeatCountList[index].color)),[0,0,0,1]];

                var temp_colorData = [0, 0, 0, 1];
                for (let index2 = 0; index2 < 3; index2++) {
                    temp_colorData[index2] = (nowColor[t_Count][index2] * (step - nowStep) + nowColor[t_Count2][index2] * nowStep) / step;
                    temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                }
                var target = this.AllBlockColor;
                target[repeatCountList[index].recordIndex].color= temp_colorData;         
                //console.log('element.color', t_data, step, nowStep)
            }

            if(nowStep<step-1){
                nowStep+=1;
                
            }
            else{
                nowStep=0;
                repeatCount += 1;
                //repeatCount=0;            
            }              
        }, 50*this.animationSpeed)
        //clearInterval(this.repeater);
    }

    /**
     * mode_BreathingMulticolor
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_BreathingMulticolor(colors = [[255,0,0,1]], isRainbow = true) {
        clearInterval(this.repeater);
        var repeatCount = 0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var totalstep = 60;
        var nowStep = 0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        var setRGB;
        var repeatCircleCount=0;
        //var RGBObj=this.rainbow7Color()
        var RGBObj =[[255,0,0,1],[255,0,0,1],[0, 255, 0,1],[0,0,255,1],[0, 0, 255,1]];

        //[this.getRandom(0, this.rainbow7Color().length - 1)];
        var Rainbow_totalstep=60;
        var Rainbow_step=0;
        var Rainbow_i=0;
        console.log('%c mode_BreathingMulticolor','color:rgb(255,75,255,1)',this.imageMaxWidth);
         
        for (let i_compare = 0; i_compare < this.imageMaxWidth; i_compare+=this.imageMaxWidth/60/5) {

            //const element = array[index];
            if(Rainbow_step<Rainbow_totalstep){
                Rainbow_step+=1; 
            }
            else{
                Rainbow_step=0;
                if(Rainbow_i<RGBObj.length-2){
                    Rainbow_i+=1; 
                }
                else{
                    Rainbow_i=0;
                }    
            }

            if (isRainbow) {
                var t_data = [0,0,0,1];
                if(RGBObj[Rainbow_i]==undefined){
                    console.log('%c RGBObjError','color:rgb(255,75,255,1)',RGBObj,Rainbow_i);
                    return;
                }
                else{
                    console.log('%c RGBObj','color:rgb(255,75,255,1)',Rainbow_i);
                }
                var temp_colorData = [0, 0, 0, 1];
                for (let index2 = 0; index2 < 3; index2++) {
                    temp_colorData[index2] = (RGBObj[Rainbow_i][index2] * (Rainbow_totalstep - Rainbow_step) + RGBObj[Rainbow_i+1][index2] * Rainbow_step) / Rainbow_totalstep;
                    temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                }
                //setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];
                console.log('%c RGBObj_t_data','color:rgb(255,75,255,1)',temp_colorData);
                setRGB=temp_colorData;
            }
            else {
                setRGB = colors[0];
            }
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                var dis = this.distanceCalculation(0,this.imageMaxHeight/2, element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                if (dis <= i_compare && dis >= i_compare-this.minKeyWidth) {
                    //element.color = setRGB;
                    repeatCountList.push({
                        color: setRGB,
                        recordIndex:index,
                        //repeatTime: this.getRandom(5, 25),
                    });
                }              
            }
        }
        console.log('repeatCountList', repeatCountList)

        this.repeater = setInterval(() => {
            //this.mode_reset();
            var t_Count=repeatCount%2;
            var t_Count2=0;
            if(t_Count==0){
                t_Count2=1;
            }
            else{
                t_Count2=0;
            }
            for (let index = 0; index < repeatCountList.length; index++) {     
                var nowColor=[JSON.parse(JSON.stringify(repeatCountList[index].color)),[0,0,0,1]];    
                var temp_colorData = [0, 0, 0, 1];
                for (let index2 = 0; index2 < 3; index2++) {
                    temp_colorData[index2] = (nowColor[t_Count][index2] * (totalstep - nowStep) + nowColor[t_Count2][index2] * nowStep) / totalstep;
                    temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                }
                var target = this.AllBlockColor;
                target[repeatCountList[index].recordIndex].color= temp_colorData;          
                //console.log('element.color', t_data, step, nowStep)
            }

            if(nowStep<totalstep-1){
                nowStep+=1;
                
            }
            else{
                nowStep=0;
                repeatCount += 1;
                //repeatCount=0;            
            }              
        }, 50*this.animationSpeed)
        //clearInterval(this.repeater);
    }

        /**
     * mode_CycleBreath
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_CycleBreath(colors = [[255,0,0,1]], isRainbow = true) {
        clearInterval(this.repeater);
        var repeatCount = 0;
        var mode_step = 0;
        var totalstep = 60;
        var nowStep = 0;
        if(isRainbow){
        colors=this.rainbow7Color();
        }
        else{
        //colors=[[0, 0, 255, 1],[255, 0, 0, 1]];
        }
        var nowC_index=0;
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList=[];
        var target = this.AllBlockColor;
        var setRGB;
        var repeatCircleCount=0;
        console.log('%c mode_Breathing','color:rgb(255,75,255,1)',colors,isRainbow);
        //setRGB = this.rainbow7Color()[this.getRandom(0, this.rainbow7Color().length - 1)];  
        for (let index = 0; index < target.length; index++) {
            //var element = target[index];
            repeatCountList.push({
                color: [0, 0, 0, 1],
                recordIndex: index,
                repeatTime: this.getRandom(5, 25),
            });
        }
        console.log('repeatCountList', repeatCountList)
        this.repeater = setInterval(() => {
            //this.mode_reset();
            var t_Count=repeatCount%2;
            var t_Count2=0;
            if(t_Count==0){
                t_Count2=1;
            }
            else{
                t_Count2=0;
            }
            var T_colors=JSON.parse(JSON.stringify(colors[nowC_index]));
            //console.log('T_colors', T_colors)
            for (let index = 0; index < repeatCountList.length; index++) {     
                var nowColor=[[0,0,0,1],T_colors];
                
                var temp_colorData = [0, 0, 0, 1];
                for (let index2 = 0; index2 < 3; index2++) {
                    temp_colorData[index2] = (nowColor[t_Count][index2] * (totalstep - nowStep) + nowColor[t_Count2][index2] * nowStep) / totalstep;
                    temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                }
                var target = this.AllBlockColor;
                target[repeatCountList[index].recordIndex].color= JSON.parse(JSON.stringify(temp_colorData))          
                //console.log('element.color', t_data, nowStep, totalstep)
            }

            if(nowStep<totalstep-1){
                nowStep+=1;
            }
            else{
                nowStep=0;
                repeatCount += 1;
                var t_Count3=repeatCount%2;
                console.log('t_Count', t_Count3)
                if(t_Count3==0){
                    if(nowC_index<colors.length-1){
                        nowC_index+=1;
                    }
                    else{
                        nowC_index=0;
                    }
                }
                
                //repeatCount=0;            
            }              
        }, 50*this.animationSpeed)
        //clearInterval(this.repeater);
    }

    /**
     * mode_LEDOFF
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_LEDOFF() {
        clearInterval(this.repeater);
        this.setAllBlockColor([0,0,0,1]);
    }

    /**
     * mode_WaveSync
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param bandwidth number:Effeect bandwidth
     * @param BaseSpeed number:Effeect BaseSpeed
    */
    mode_WaveSync(colors = [[255,0,0,1]], isRainbow = true,bandwidth=20,BaseSpeed=140){
        console.log('%c mode_WaveSync_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        var intervalCount=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        if (isRainbow) {
            //colors =this.rainbow7Color();
            colors= [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
            //colors= colors.concat(colors);
        }
        else{
            var maxPercent=55;
            var currentPercent=55;
            var tempColorArray=[];
            var inputColor_T=colors[0];
            //console.log('%c inputColor_T','color:rgb(255,75,255,1)',inputColor_T);
            while (currentPercent>25) {
                currentPercent-=5;
                var tempColor=[0,0,0,1];
                tempColor[0]=inputColor_T[0]*currentPercent/maxPercent;
                tempColor[1]=inputColor_T[1]*currentPercent/maxPercent;
                tempColor[2]=inputColor_T[2]*currentPercent/maxPercent;
                //console.log('%c currentPercent>0','color:rgb(255,75,255,1)',tempColor);
                tempColorArray.push(tempColor);
            }
            colors=tempColorArray;
            //console.log('%c tempColorArray','color:rgb(255,75,255,1)',tempColorArray);

        }
        //console.log('%c colors','color:rgb(255,75,255,1)',colors);
        var setRGB=colors[this.getRandom(0, colors.length - 1)];
        var spacing=-5;
        var nowColor=0;        
        this.setAllBlockColor([0, 0, 0, 1]);
        var angle=40;
        var theta = Math.PI * angle / 180;//弧度
		var dx =  Math.cos(theta);
        var dy = -Math.sin(theta);
        if (Math.abs(dx) < 1e-5) dx = 0;
		if (Math.abs(dy) < 1e-5) dy = 0;
        var position=0;
        var color_number=colors.length;
        var target = this.AllBlockColor;       
        var handleAllList=[];
        position+=5;
        //console.log('%c getColor','color:rgb(255,75,255,1)',result,this.use_scales,loop,this.colors,scales);
        this.repeater = setInterval(() => {
            //position+=5;
            position += 50;
            position %= bandwidth * color_number;
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                //var y=sinx + cosx;
                //var y=sinx + cosx;
                var OffsetValue = element.coordinateData.center_Point[0] * dx + element.coordinateData.center_Point[1] * dy;  //x*cos+y*sin=P(x,y)theta
                var scale = (OffsetValue - position) / bandwidth / color_number;      
                var defaultscales = [
                    0, 0.2, 0.4, 0.6, 0.8
                ];
                //console.log('%c dy','color:rgb(255,75,255,1)',dx,dy);
                // console.log('%c OffsetValue','color:rgb(255,75,255,1)',OffsetValue);
                // console.log('%c scale','color:rgb(255,75,255,1)',String(scale));
                // console.log('%c position','color:rgb(255,75,255,1)',position);
                // console.log('%c bandwidth','color:rgb(255,75,255,1)',bandwidth);
                var scales = defaultscales.slice(0);
                scale -= Math.floor(scale);	// [0, 1)                
                var lower_index = -1;
                var lower_scale = 0;
                var upper_index = colors.length;
                var upper_scale = 1;
                for (let i=0; i<color_number; ++i){
                    if (scales[i] <= scale) {
                        if (scales[i] >= lower_scale)
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                            lower_scale = scales[lower_index = i];
                            //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);

                    } else {
                        if (scales[i] < upper_scale)
                            upper_scale = scales[upper_index = i];
                    }
                }
                //console.log('%c lower_scale','color:rgb(255,75,255,1)',upper_scale);

                //console.log('%c upper_scale','color:rgb(255,75,255,1)',upper_scale);
                    // colors[lower_index];
                //element.color = JSON.parse(JSON.stringify(colors[nowColor]));
                var temp_colorData =JSON.parse(JSON.stringify(colors[lower_index]));
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                } 
                element.color = temp_colorData;   
            }

        }, BaseSpeed*this.animationSpeed)
    }

    /**
     * mode_Spiral
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Spiral(colors = [[255,0,0,1]], isRainbow = true,direction=0,BaseSpeed = 100){
    console.log('%c mode_Spiral','color:rgb(255,75,255,1)',colors,this.repeater);
    clearInterval(this.repeater);
    this.currentBlockIndex=0;
    var intervalCount=0;
    var StartPoint = this.getNowBlock(0).coordinateData;
    if (isRainbow) {
        //colors =this.rainbow7Color();
        colors= [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
        //colors= colors.concat(colors);
    }
    else{
        var maxPercent=55;
        var currentPercent=55;
        var tempColorArray=[];
        var inputColor_T=colors[0];
        console.log('%c inputColor_T','color:rgb(255,75,255,1)',inputColor_T);
        while (currentPercent>25) {
            currentPercent-=5;
            var tempColor=[0,0,0,1];
            tempColor[0]=inputColor_T[0]*currentPercent/maxPercent;
            tempColor[1]=inputColor_T[1]*currentPercent/maxPercent;
            tempColor[2]=inputColor_T[2]*currentPercent/maxPercent;
            console.log('%c currentPercent>0','color:rgb(255,75,255,1)',tempColor);
            tempColorArray.push(tempColor);
        }
        colors=tempColorArray;
        console.log('%c tempColorArray','color:rgb(255,75,255,1)',tempColorArray);
    }
    //console.log('%c colors','color:rgb(255,75,255,1)',colors);

    var setRGB=colors[this.getRandom(0, colors.length - 1)];
    var spacing=-5;
    var nowColor=0;        
    this.setAllBlockColor([0, 0, 0, 1]);
    var angle=0;
    var theta = Math.PI * 30 / 180;//弧度
    var dx =  Math.cos(theta);
    var dy = -Math.sin(theta);
    if (Math.abs(dx) < 1e-5) dx = 0;
    if (Math.abs(dy) < 1e-5) dy = 0;
    var position=0;
    var color_number=colors.length;
    var bandwidth=20;
    var target = this.AllBlockColor;       
    position+=5;    
    this.repeater = setInterval(() => {
        if (direction == 1) {
            angle+=10*1;//-1 反向
        }
        else {
            angle+=10*-1;//-1 反向
        }
        var bandangle=360/(colors.length);
        var dis_angle=angle%360;
        for (let index = 0; index < target.length; index++) {
            var element = target[index];
            //var y=sinx + cosx;
            //var OffsetValue = element.coordinateData.center_Point[0] * dx + element.coordinateData.center_Point[1] * dy;  //x*cos+y*sin=P(x,y)theta

            var center_Point=[this.imageMaxWidth/2,this.imageMaxHeight/2];
            center_Point[0]-=40;
            //center_Point[1]-=30;
            var PointRotation=this.PointRotation(center_Point,element.coordinateData.center_Point);
            if(PointRotation<0){
                PointRotation+=360;
            }
            var remainder;
            var scale = (PointRotation - angle) / bandangle / colors.length;// / colors.length
            var defaultscales = [
                0, 0.5,0.1, 0.3, 0.5, 0.7, 0.9
            ];
            // var defaultscales = [
            // ];
            // var addvalue=0;
            // for (let index = 0; index < colors.length; index++) {
            //     addvalue+=1/colors.length;
            //     defaultscales.push(addvalue);    
            // }
            ///(360/colors.length);
            remainder=Math.floor(remainder);
            scale -= Math.floor(scale);	// [0, 1)
            var data={
                PointRotation:PointRotation,
                remainder:scale,
                dis_angle:dis_angle,
                part:bandangle,
            }
            //console.log('%c mode_Spiral','color:rgb(255,75,255,1)',data);

            var scales = defaultscales.slice(0);
            
            var lower_index = -1;
            var lower_scale = 0;
            var upper_index = colors.length;
            var upper_scale = 1;
            for (let i=0; i<color_number; ++i){
                if (scales[i] <= scale) {
                    if (scales[i] >= lower_scale)
                    //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                        lower_scale = scales[lower_index = i];
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);

                } else {
                    if (scales[i] < upper_scale)
                        upper_scale = scales[upper_index = i];
                }
            }
            var temp_colorData = JSON.parse(JSON.stringify(colors[lower_index]));
            for (let index = 0; index < 3; index++) {
                temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
            }     
            element.color = temp_colorData;
        }

    }, BaseSpeed*this.animationSpeed)
}

    /**
     * mode_Rain
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param bandwidth number:Effeect bandwidth
     * @param BaseSpeed number:Effeect BaseSpeed
    */
    mode_Rain(colors = [[0, 0, 255, 1]], isRainbow = false, bandwidth = 20, BaseSpeed = 140) {
        console.log('%c mode_Rain', 'color:rgb(255,75,255,1)', colors, this.repeater);
        clearInterval(this.repeater);
        this.currentBlockIndex = 0;
        console.log('%c mode_Starlight', 'color:rgb(255,75,255,1)', colors);

        //colors=[[255,0,0,1]];
        var translatecolors = [];
        if (isRainbow) {
            translatecolors = this.rainbow7Color();
        }
        else {
            translatecolors = colors;
        }
        var totalStep = 5;
        var intervalCount = 0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var target = this.AllBlockColor;
        this.setAllBlockColor([0, 0, 0, 1]);
        var repeatCountList = [];
        var RanRange = [1, 200];
        var coordinateAllList=[];
        //RotationMatrixValue: xpos + space+ypos,
        //x' = cos(θ) * x - sin(θ) * y
        //y' = sin(θ) * x + cos(θ) * y
        //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));
        for (let xpos = -this.minKeyWidth*5; xpos < this.imageMaxWidth; xpos += this.imageMaxWidth/7 ) {
            var space = 0;
            for (let ypos = -this.minKeyHeight; ypos < this.imageMaxHeight-50; ypos += this.imageMaxHeight/8) {
                //space += this.minKeyWidth/2;
                space += 5;
                coordinateAllList.push(
                    {
                        coordinate: [xpos + space, ypos],
                        backupPos: [xpos + space, ypos],
                        RotationMatrixValue: xpos + space+ypos,
                        isCheck: false,
                    });
            }
        }
        for (let index = 0; index < target.length; index++) {
            //var modStep = (target[index].coordinateData.center_Point[0] % this.imageMaxWidth) / this.imageMaxWidth;
            var ran = this.getRandom(0, translatecolors.length - 1);
            console.log('ran', ran);
            repeatCountList.push({
                nowColor: [0, 0, 0, 1],
                nextColor: translatecolors[ran],
                recordIndex: index,
                nowStep: 10,
                totalStep: 10,
                repeatCount: 0,
                repeatTime: this.getRandom(RanRange[0], RanRange[1]),
                switchOn:false,
            })
            //target[index].color=repeatCountList[index].color;
        }
        var MoveCenter=[0,0];

        this.repeater = setInterval(() => {
            this.setAllBlockColor([0, 0, 0, 1]);
            var nowAddx=0;
            // if(MoveCenter[0]<this.imageMaxWidth){
            //     MoveCenter[0]+=50;
            //     MoveCenter[1]+=50;
            // }
            // else{
            //     MoveCenter[0]=0;
            //     MoveCenter[1]=0;
            // }
            for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
                var T_CA = coordinateAllList[c2];
                //T_CA.coordinate[0]+=this.getRandom(25, 75);
                if(T_CA.coordinate[1]<this.imageMaxHeight){
                    nowAddx=50;
                     //T_CA.coordinate[0]+=this.getRandom(25, 75);
                    T_CA.coordinate[0]+=this.minKeyHeight;
                    T_CA.coordinate[1]+=this.minKeyHeight;
                }
                else{
                    //T_CA.coordinate[0]=this.getRandom(0, 20);
                    T_CA.coordinate[0]=T_CA.backupPos[0];
                    T_CA.coordinate[1]=-this.minKeyHeight;
                }
            }

             
            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                var temp_block=repeatCountList[index];
                var RotationMatrixValue=MoveCenter[0]+MoveCenter[1];
                var RotationMatrixValue2=element.coordinateData.top_Left[0]+ element.coordinateData.top_Left[1];
                for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
                    var T_CA = coordinateAllList[c2];
                    if (T_CA.coordinate[0] > element.coordinateData.top_Left[0] &&
                        T_CA.coordinate[0] < element.coordinateData.top_Right[0] &&
                        T_CA.coordinate[1] > element.coordinateData.top_Left[1] &&
                        T_CA.coordinate[1] < element.coordinateData.bottom_Left[1] 
                    ) {  
                        var colorData = [0, 0, 0, 1]
                        colorData[0] = (temp_block.nowColor[0] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[0] * temp_block.nowStep) / temp_block.totalStep;
                        colorData[1] = (temp_block.nowColor[1] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[1] * temp_block.nowStep) / temp_block.totalStep;
                        colorData[2] = (temp_block.nowColor[2] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[2] * temp_block.nowStep) / temp_block.totalStep;
                        element.color = JSON.parse(JSON.stringify(colorData));
                    }
                    // var dis = this.distanceCalculation(T_CA.coordinate[0], T_CA.coordinate[1], element.coordinateData.center_Point[0], element.coordinateData.center_Point[1]);
                    // if (dis < 25&&element.coordinateData.center_Point[0]>T_CA.coordinate[0]) {
                    //     //if (Math.abs(RotationMatrixValue2-RotationMatrixValue) < 10) {
                    //     console.log('%c RotationMatrixValue', 'color:rgb(255,75,255,1)', RotationMatrixValue, RotationMatrixValue2);
                    //     // if (temp_block.nowStep < temp_block.totalStep) {
                    //     //     temp_block.nowStep += 1;
                    //     // }
                    //     // else {
                    //     //     //temp_block.nowStep = 0;
                    //     //     temp_block.repeatCount += 1;
                    //     //     // var T_Now = JSON.parse(JSON.stringify(temp_block.nowColor));
                    //     //     // var T_Next = JSON.parse(JSON.stringify(temp_block.nextColor));
                    //     //     // temp_block.nextColor = T_Now;
                    //     //     // temp_block.nowColor = T_Next;
                    //     //     temp_block.switchOn = false;
                    //     //     // if(temp_block.repeatCount>=1){
                    //     //     //     temp_block.repeatCount=0;
                    //     //     //     temp_block.switchOn=false;
                    //     //     // }
                    //     // }
                    //     var colorData = [0, 0, 0, 1]
                    //     colorData[0] = (temp_block.nowColor[0] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[0] * temp_block.nowStep) / temp_block.totalStep;
                    //     colorData[1] = (temp_block.nowColor[1] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[1] * temp_block.nowStep) / temp_block.totalStep;
                    //     colorData[2] = (temp_block.nowColor[2] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[2] * temp_block.nowStep) / temp_block.totalStep;
                    //     element.color = JSON.parse(JSON.stringify(colorData));
                    //     break;

                    // }
                }

            }
        }, 250)
    }

    /**
     * mode_Pingpong
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Pingpong(colors = [[255,0,0,1]], isRainbow = true){
        console.log('%cmode_Pingpong_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        var intervalCount=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        if (isRainbow) {
            colors =this.rainbow7Color();
        }
        //console.log('StartPoint','color:green',JSON.stringify(StartPoint),this.AllBlockColor); 
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        //Math.trunc(3.7); // 3
        var repeatCount=0;
        this.repeater = setInterval(() => {
            this.setAllBlockColor([0, 0, 0, 1]);
            var horizontalList = [];
            var setRGB=colors[this.getRandom(0, colors.length - 1)];
            //console.log('repeatCount', repeatCount);
            var spacing=-5;
            if (repeatCount%2==0) {
                for (let index = 0; index < this.imageMaxHeight; index += StartPoint.clientHeight) {
                    var ypos = index;
                    spacing += 1;
                   var min=intervalCount * StartPoint.clientWidth+spacing*22;
                   var max=intervalCount * StartPoint.clientWidth+StartPoint.clientWidth*4+spacing*22;
                    for (let index2 = min; index2 < max; index2 += 1) {
                        var xpos = index2;
                        horizontalList.push([xpos, ypos]);
                    }
                }
            }
            else {
                var spacing=-5;
                for (let index = 0; index < this.imageMaxHeight; index += StartPoint.clientHeight) {
                    spacing += 1;
                    var ypos = index;
                    var min=this.imageMaxWidth-intervalCount * StartPoint.clientWidth-spacing*22-StartPoint.clientWidth*4;
                    var max=this.imageMaxWidth-intervalCount * StartPoint.clientWidth-spacing*22;
                    //var spacing2 = this.minKeyWidth * intervalCount;
                    for (let index2 = max; index2 > min; index2 -= 1) {
                        var xpos = index2;
                        horizontalList.push([xpos, ypos]);
                    }
                }
            }
            //console.log('horizontalList', horizontalList); 
            var target = this.AllBlockColor;

            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                for (let i2 = 0; i2 < horizontalList.length; i2++) {
                    var T = horizontalList[i2];
                    if (T[0] > element.coordinateData.top_Left[0] &&
                        T[0] < element.coordinateData.top_Right[0] &&
                        T[1] > element.coordinateData.top_Left[1] &&
                        T[1] < element.coordinateData.bottom_Left[1]
                    ) {
                        var temp_colorData = JSON.parse(JSON.stringify(colors[this.getRandom(0, colors.length - 1)]));
                        for (let index = 0; index < 3; index++) {
                            temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                        }     
                        element.color = temp_colorData;
                        //element.color = setRGB;
                        continue;
                    }

                }

            }
            if (intervalCount * StartPoint.clientWidth*2 < this.imageMaxWidth) {
                intervalCount += 1;
            }
            else {
                intervalCount = 0;
                repeatCount += 1;
            }
        }, 100)
    }

    /**
     * mode_BreatheSeparately
    */
    mode_BreatheSeparately(){
            clearInterval(this.repeater);
            var opacity=1;
            var opacityCount=0;
            //RGBcolors =[[255,0,0,1],[255,0,0,0.8],[0,255,0,1],[0,255,0,0.8],[0,0,255,1],[0,0,255,0.8]];
            var totalStep=30;
            var intervalCount=0;
            var StartPoint = this.getNowBlock(0).coordinateData;
            var target = this.AllBlockColor;
            this.setAllBlockColor([0,0,255,1]);
           var repeatCountList=[];
           var RanRange=[10,100];
            //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));   
            for (let index = 0; index < target.length; index ++) {
                //var modStep=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
                repeatCountList.push({
                    color: 0,
                    nowPos: 0,
                    nowstep: 0,
                    repeatCount: 1,
                    repeatTime: this.getRandom(RanRange[0], RanRange[1]),
                });
            }
            //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
            var repeatCount=0;
            var exist=[];
            this.repeater = setInterval(() => {
                if(opacityCount%2==0){
                    opacity-=0.05;
                }
                else{
                    opacity+=0.05;
                }
                if(opacity>=1||opacity<=0){
                    opacityCount+=1;
                }
                //var horizontalList = [];
                for (let index = 0; index < target.length; index++) {
                    const element = target[index];
                    // var resultL = exist.find((x) => x == index)
                    // if (resultL != undefined) {
                    //     break;
                    // }
                    if (element.breathing&&element.clearStatus) {
                        //console.log('%c mode_BreatheSeparately_element','color:rgb(255,77,255)',  element);
                        element.color[3]=opacity;
                    }
                    else{

                    }
                    //continue;
                    //break;
                }
            }, 100)
    
        

    }

    /**
     * mode_BreatheSeparatelyBlack
    */
    mode_BreatheSeparatelyBlack(){
        console.log('%c Enter_BreatheSeparatelyBlack','color:rgb(255,77,255)');
        clearInterval(this.repeater);
        var totalStep=255;
        var nowStep=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var target = this.AllBlockColor;
        var repeatCount=0;
        var nowColor=[];
        var newColor=[];
        this.repeater = setInterval(() => {
            if(nowStep<totalStep){
                nowStep+=5;
            }
            else{
                nowStep=0;
                repeatCount+=1;
            }
            for (let index = 0; index < target.length; index++) {
                const element = target[index];     
                var listItem=target[index];
                if (element.breathing&&element.clearStatus) {
                    if(repeatCount%2==1){
                        nowColor=[0,0,0,1];
                        newColor=JSON.parse(JSON.stringify(listItem.color));
                    }
                    else{
                        nowColor=JSON.parse(JSON.stringify(listItem.color));
                        newColor=[0,0,0,1];
                    }

                    var t_data = [0,0,0,1];
                    for (let i_step = 0; i_step < 3; i_step++) {
                        t_data[i_step] =Math.floor((nowColor[i_step] * (totalStep - nowStep) + newColor[i_step] * nowStep) / totalStep);
                    }
                    this.BreathTempArray[index].color=JSON.parse(JSON.stringify(t_data));
                }
                else{
                    this.BreathTempArray[index].color=JSON.parse(JSON.stringify(listItem.color));
                }
            }
            //console.log('%c Enter_BreatheSeparatelyBlack','color:rgb(255,77,255)',t_data,nowColor,newColor,nowStep,totalStep);
        }, 30)
    }

    /**
     * mode_Rainbow
    */
    mode_Rainbow(){
        console.log('%c Enter_mode_Rainbow','color:rgb(255,77,255)');
        clearInterval(this.repeater);
       this.currentBlockIndex=0;
       var StartPoint = this.getNowBlock(0).coordinateData;
       this.setAllBlockColor([0,0,0,1]);
       var H_spacing=Math.trunc(this.imageMaxHeight/StartPoint.clientHeight);
       var w_range=Math.trunc(this.imageMaxWidth/this.minKeyWidth);
       var repeatCountList=[];
       var times=0;
       var setColors=this.rainbow7Color();
      var target = this.twoDimensionalArray;
       for (let index = 0; index < this.max_X_Number; index++) {
           //this.twoDimensionalArray[index][0].color=[0,0,255,1];
           for (let index2 = 0; index2 < setColors.length; index2++) {
               repeatCountList.push({
                   nowPos:index2,
                   color: setColors[index2],
                   pos: [index,index2],
                   backupPos:[index,index2],
                   step: 5,
                   nowStep: 0,
               });
           }
       }
       this.repeater=setInterval(()=>{
           this.resetTwoDimensionalArray();
           for (let i2 = 0; i2 < repeatCountList.length; i2++) {
               var T = repeatCountList[i2];   
               if (T.nowStep + 1 < T.step) {
                T.nowStep+=1;
               }
               else{
                T.nowStep=0;
                T.nowPos+=1;
               }
               var temp_C=setColors[T.nowPos];
               var nextColor=[];
               if (T.nowPos + 1 < setColors.length-1) {
                   //T.nowPos+=1;
                   nextColor = setColors[T.nowPos+1];
               }
               else {
                   T.nowPos = 0;
                   nextColor = setColors[T.nowPos];
               }
               var temp_colorData = [0, 0, 0, 1];
               for (let index2 = 0; index2 < 3; index2++) {
                   temp_colorData[index2]= (temp_C[index2]*(T.step-T.nowStep)+nextColor[index2]*T.nowStep)/T.step;
                   temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
               }
               this.twoDimensionalArray[T.pos[0]][T.pos[1]].color=temp_colorData;              
           }
           this.showTwoDimensionalArray();
       },50*this.animationSpeed);
    }

    mode_Rainbow2(colors = [[255,0,0,1]], isRainbow = true,bandwidth=20,BaseSpeed=140){
        console.log('%c mode_Rainbow_enter','color:rgb(255,75,255,1)',colors,this.repeater);
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        if (isRainbow) {
            //colors =this.rainbow7Color();
            colors= [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
        }
        else{
            var maxPercent=55;
            var currentPercent=55;
            var tempColorArray=[];
            var inputColor_T=colors[0];
            //console.log('%c inputColor_T','color:rgb(255,75,255,1)',inputColor_T);
            while (currentPercent>25) {
                currentPercent-=5;
                var tempColor=[0,0,0,1];
                tempColor[0]=inputColor_T[0]*currentPercent/maxPercent;
                tempColor[1]=inputColor_T[1]*currentPercent/maxPercent;
                tempColor[2]=inputColor_T[2]*currentPercent/maxPercent;
                //console.log('%c currentPercent>0','color:rgb(255,75,255,1)',tempColor);
                tempColorArray.push(tempColor);
            }
            colors=tempColorArray;
        }     
        this.setAllBlockColor([0, 0, 0, 1]);
        var angle=-270;
        var theta = Math.PI * angle / 180;//弧度
        var dx =  Math.cos(theta);
        var dy = -Math.sin(theta);
        if (Math.abs(dx) < 1e-5) dx = 0;
        if (Math.abs(dy) < 1e-5) dy = 0;
        var position=0;
        var color_number=colors.length;
        var target = this.AllBlockColor;       
        var handleAllList=[];
        position+=5;
        //console.log('%c getColor','color:rgb(255,75,255,1)',result,this.use_scales,loop,this.colors,scales);
        this.repeater = setInterval(() => {
            //position+=5;
            position += 50;
            position %= bandwidth * color_number;
            for (let index = 0; index < target.length; index++) {
                var element = target[index];
                //var y=sinx + cosx;
                //var y=sinx + cosx;
                var OffsetValue = element.coordinateData.center_Point[0] * dx + element.coordinateData.center_Point[1] * dy;  //x*cos+y*sin=P(x,y)theta
                var scale = (OffsetValue - position) / bandwidth / color_number;      
                var defaultscales = [
                    0, 0.2, 0.4, 0.6, 0.8
                ];
                //console.log('%c dy','color:rgb(255,75,255,1)',dx,dy);
                // console.log('%c OffsetValue','color:rgb(255,75,255,1)',OffsetValue);
                // console.log('%c scale','color:rgb(255,75,255,1)',String(scale));
                // console.log('%c position','color:rgb(255,75,255,1)',position);
                // console.log('%c bandwidth','color:rgb(255,75,255,1)',bandwidth);
                var scales = defaultscales.slice(0);
                scale -= Math.floor(scale);	// [0, 1)                
                var lower_index = -1;
                var lower_scale = 0;
                var upper_index = colors.length;
                var upper_scale = 1;
                for (let i=0; i<color_number; ++i){
                    if (scales[i] <= scale) {
                        if (scales[i] >= lower_scale)
                        //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                            lower_scale = scales[lower_index = i];
                            //console.log('%c lower_index','color:rgb(255,75,255,1)',lower_index);
                    } else {
                        if (scales[i] < upper_scale)
                            upper_scale = scales[upper_index = i];
                    }
                }
                //console.log('%c lower_scale','color:rgb(255,75,255,1)',upper_scale);
                //console.log('%c upper_scale','color:rgb(255,75,255,1)',upper_scale);
                //element.color = JSON.parse(JSON.stringify(colors[nowColor]));
                var temp_colorData =JSON.parse(JSON.stringify(colors[lower_index]));
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                } 
                element.color = temp_colorData;   
            }
    
        }, BaseSpeed*this.animationSpeed)
    }





    /**
     * mode_Snowing
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Snowing(colors = [[255,0,0,1]], isRainbow = true){
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        this.setAllBlockColor([0,0,0,1]);
        var H_spacing=Math.trunc(this.imageMaxHeight/StartPoint.clientHeight);
        var w_range=Math.trunc(this.imageMaxWidth/this.minKeyWidth);
        var repeatCountList=[];
        for (let x=StartPoint.top_Left[0]; x<this.imageMaxWidth; x+=this.minKeyWidth) {
            var temp_list=[];
            for (let index2 = StartPoint.top_Left[1];index2 < this.imageMaxHeight; index2+=StartPoint.clientHeight) {
                temp_list.push([x,index2]);
            }
            repeatCountList.push({
                color:[0,255,255,1],
                i_list:temp_list,
                pos:0,
                repeatCount:6,
                repeatTime:this.getRandom(1,25),
            });
        }
        console.log('repeatCountList;', repeatCountList); 
        this.repeater=setInterval(()=>{
            this.setAllBlockColor([0,0,0,1]);
            for (let i2 = 0; i2 < repeatCountList.length; i2++) {
                var T = repeatCountList[i2];
                if(T.repeatTime>0){
                    repeatCountList[i2].repeatTime-=1;
                }
                else if(T.repeatTime==0&& T.repeatCount<T.i_list.length){
                    repeatCountList[i2].repeatCount+=1;
                }              
                if(T.repeatCount>=T.i_list.length){
                    repeatCountList[i2].repeatCount=0;
                    repeatCountList[i2].repeatTime=this.getRandom(1,25);
                }      
            }
            var target = this.AllBlockColor;
            
            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                for (let i2 = 0; i2 < repeatCountList.length; i2++) {
                    var T = repeatCountList[i2];
                    var now=T.i_list[T.repeatCount];
                    if (now[0] >= element.coordinateData.top_Left[0] &&
                        now[0] <= element.coordinateData.top_Right[0] &&
                        now[1] >= element.coordinateData.top_Left[1] &&
                        now[1] <= element.coordinateData.bottom_Left[1]
                    )
                    {
                        var temp_colorData = JSON.parse(JSON.stringify(repeatCountList[i2].color));
                        for (let index = 0; index < 3; index++) {
                            temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                        }
                        target[index].color=temp_colorData;
                    }                
                }
            }

        },100*this.animationSpeed)
    }

    /**
     * mode_DigitTimes
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_DigitTimes(colors = [[0, 0, 255, 1]], isRainbow = true) {
        clearInterval(this.repeater);
        this.currentBlockIndex = 0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        this.setAllBlockColor([0, 0, 0, 1]);
        var H_spacing = Math.trunc(this.imageMaxHeight / StartPoint.clientHeight);
        var w_range = Math.trunc(this.imageMaxWidth / this.minKeyWidth);
        var repeatCountList = [];
        var setRGB;
        var target = this.twoDimensionalArray;
        // var a2=[0,3,5,8,11,13];
        //    var randomList=[];
        //    for (let i = 0; i < this.KeyTableArray[0][1]-1; i++) {
        //        randomList.push(this.getRandom(0, this.KeyTableArray[0][1]-1));   //亂數產生，亂數產生的範圍是1~9
        //        for (let j = 0; j < i; j++) {
        //            while (randomList[j] == randomList[i])    //檢查是否與前面產生的數值發生重複，如果有就重新產生
        //            {
        //                j = 0;  //如有重複，將變數j設為0，再次檢查 (因為還是有重複的可能)
        //                randomList[i] = this.getRandom(0, this.KeyTableArray[0][1]-1);   //重新產生，存回陣列，亂數產生的範圍是1~9
        //            }
        //        }
        //    }
        for (let index = 0; index <= this.KeyTableArray[0][1]; index++) {
            //this.twoDimensionalArray[index][0].color=[0,0,255,1];
            repeatCountList.push({
                color: colors[this.getRandom(0, colors.length - 1)],
                pos: [index, index % (this.max_Y_Number / 2)],
                backupPos: [index, index % (this.max_Y_Number / 2)],
                repeatTime: this.getRandom(0, 3),
            });
        }

        this.repeater = setInterval(() => {
            this.resetTwoDimensionalArray();
            for (let i2 = 0; i2 < repeatCountList.length; i2++) {
                var T = repeatCountList[i2];
                if (T.repeatTime > 0) {
                    T.repeatTime -= 1;
                }
                if (T.repeatTime == 0) {
                    if (T.pos[1] + 1 < this.max_Y_Number) {
                        if (T.pos[0] < 1) {
                            T.pos[1] += 1;
                        }
                        else {
                            T.pos[1] += 1;
                            T.pos[0] += 1;
                        }

                    }
                    else {
                        T.pos[0] = T.backupPos[0];
                        T.pos[1] = 0;
                        T.repeatTime = 1;
                    }
                    //console.log('repeatCountList;', i2,repeatCountList[i2].repeatCount);
                }
                var temp_colorData=JSON.parse(JSON.stringify(T.color));
                for (let index = 0; index < 3; index++) {
                    temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                }
                this.twoDimensionalArray[T.pos[0]][T.pos[1]].color = temp_colorData;

            }
            this.showTwoDimensionalArray();
        }, 500 * this.animationSpeed);


    }
        /**
     * mode_KeepRaining
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param BaseSpeed int:BaseSpeed

    */
    mode_KeepRaining(colors = [[0, 0, 255, 1]], isRainbow = false,BaseSpeed = 140) {
    console.log('%c mode_KeepRaining', 'color:rgb(255,75,255,1)', colors, this.repeater);
    clearInterval(this.repeater);
    this.currentBlockIndex = 0;
    console.log('%c mode_Starlight', 'color:rgb(255,75,255,1)', colors);
    //colors=[[255,0,0,1]];
    var translatecolors = [];
    if (isRainbow) {
        translatecolors = this.rainbow7Color();
    }
    else {
        translatecolors = colors;
    }
    var totalStep = 5;
    var intervalCount = 0;
    var StartPoint = this.getNowBlock(0).coordinateData;
    var target = this.AllBlockColor;
    this.setAllBlockColor([0, 0, 0, 1]);
    var repeatCountList = [];
    var RanRange = [0, 2];
    var coordinateAllList=[];
    var countNumber = 0;
    //RotationMatrixValue: xpos + space+ypos,
    //x' = cos(θ) * x - sin(θ) * y
    //y' = sin(θ) * x + cos(θ) * y
    //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));
    for (let xpos = -350; xpos < this.imageMaxWidth; xpos += 40 ) {
        countNumber += 1;
        for (let ypos = 0; ypos < this.imageMaxHeight; ypos += 40) {
            //space += this.minKeyWidth/2;
            if(countNumber%3>0){
                coordinateAllList.push(
                {
                        coordinate: [xpos , ypos],
                        backupPos: [xpos , ypos],
                        RotationMatrixValue: xpos +ypos,
                        isVisible: countNumber%3==0?false:true,
                });
            }
        }
    }
    for (let index = 0; index < target.length; index++) {
        //var modStep = (target[index].coordinateData.center_Point[0] % this.imageMaxWidth) / this.imageMaxWidth;
        var ran = this.getRandom(0, translatecolors.length - 1);
        console.log('ran', ran);
        repeatCountList.push({
            nowColor: [0, 0, 0, 1],
            nextColor: translatecolors[ran],
            recordIndex: index,
            nowStep: 10,
            totalStep: 10,
            repeatCount: 0,
            repeatTime: this.getRandom(RanRange[0], RanRange[1]),
            switchOn:false,
        })
        //target[index].color=repeatCountList[index].color;
    }
    var MoveCenter=[0,0];

    this.repeater = setInterval(() => {
        this.setAllBlockColor([0, 0, 0, 1]);
        var nowAddx=0;
        // if(MoveCenter[0]<this.imageMaxWidth){
        //     MoveCenter[0]+=50;
        //     MoveCenter[1]+=50;
        // }
        // else{
        //     MoveCenter[0]=0;
        //     MoveCenter[1]=0;
        // }
        for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
            var T_CA = coordinateAllList[c2];
            //T_CA.coordinate[0]+=this.getRandom(25, 75);
            if(T_CA.coordinate[1]<this.imageMaxHeight){
                // nowAddx=50;
                T_CA.coordinate[0]+=this.getRandom(0, this.minKeyWidth*2);
                //T_CA.coordinate[0]+=this.minKeyHeight;
                T_CA.coordinate[1]+=this.minKeyHeight;
            }
            else{
                //T_CA.coordinate[0]=this.getRandom(0, 20);
                T_CA.coordinate[0]=T_CA.backupPos[0];
                T_CA.coordinate[1]=0;
            }
        }

         
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            var temp_block=repeatCountList[index];
            var RotationMatrixValue=MoveCenter[0]+MoveCenter[1];
            var RotationMatrixValue2=element.coordinateData.top_Left[0]+ element.coordinateData.top_Left[1];
            for (let c2 = 0; c2 < coordinateAllList.length; c2++) {
                var T_CA = coordinateAllList[c2];
                if (T_CA.coordinate[0] > element.coordinateData.top_Left[0] &&
                    T_CA.coordinate[0] < element.coordinateData.top_Right[0] &&
                    T_CA.coordinate[1] > element.coordinateData.top_Left[1] &&
                    T_CA.coordinate[1] < element.coordinateData.bottom_Left[1] 
                ) {  
                    var colorData = [0, 0, 0, 1]
                    colorData[0] = (temp_block.nowColor[0] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[0] * temp_block.nowStep) / temp_block.totalStep;
                    colorData[1] = (temp_block.nowColor[1] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[1] * temp_block.nowStep) / temp_block.totalStep;
                    colorData[2] = (temp_block.nowColor[2] * (temp_block.totalStep - temp_block.nowStep) + temp_block.nextColor[2] * temp_block.nowStep) / temp_block.totalStep;
                    element.color = this.getBrightnessRatio(colorData)
                }
            }

        }
    }, BaseSpeed * this.animationSpeed)
    }

    getBrightnessRatio(setRGB=[]){ 
        var temp_colorData = JSON.parse(JSON.stringify(setRGB));
        for (let index2 = 0; index2 < 3; index2++) {
            temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness / 100;
        }
        return temp_colorData;
    }


    /**
     * mode_HeartbeatSensor
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_HeartbeatSensor(colors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]],BaseSpeed=60){
    console.log('%c Enter_mode_HeartbeatSensor','color:rgb(255,77,255)',colors);
    var Brightness=1;
    clearInterval(this.repeater);
    this.currentBlockIndex=43;
    //var StartPoint = [this.imageMaxWidth/2,this.imageMaxHeight/2];
    var StartPoint = this.getNowBlock(0).coordinateData;
    

    var share_RepeatCount=0;

    var horizontalList=[];
    for (let index = 0; index < this.imageMaxWidth; index+=this.minKeyWidth/2) {
        var ratio  =Math.sin((index * Math.PI / 180))
            //var xpos=120+index;
            //const scale = (Math.sin(radian - Math.PI * 0.5) + 1) * 0.5*maxH; 
        var ypos=(ratio+1)*this.imageMaxHeight;
        horizontalList.push(
            {
                repeatCount:0,
                coordinate:[index,+ypos],
                //StartPoint.top_Left[0]+ypos
                //StartPoint[1]+ypos
            }    
           );
    }
    this.repeater=setInterval(()=>{
        this.setAllBlockColor([0,0,0,1]);
        var isEnd=false;
        var spacing=-5;
        // if(horizontalList[0]['coordinate'][1]<=0||horizontalList[1]['coordinate'][1]>=this.imageMaxHeight){
        //     //h_Item['repeatCount']+=1;
        //     share_RepeatCount+=1;
        // }
        for (let index = 0; index < horizontalList.length; index++) {
            var h_Item=horizontalList[index];
            if(h_Item.coordinate[1]<=0||h_Item.coordinate[1]>=this.imageMaxHeight){
                h_Item['repeatCount']+=1;    
                //isEnd=true;
                //break;
            }
            if(h_Item['repeatCount']%2==0){
                h_Item['coordinate'][1]-=40;
                if(h_Item['coordinate'][1]<=0){
                    h_Item['coordinate'][1]=0;
                }
            }
            else{
                h_Item['coordinate'][1]+=40;
                if(h_Item['coordinate'][1]>=this.imageMaxHeight){
                   h_Item['coordinate'][1]=this.imageMaxHeight;
                }
            }   
        }
        // if(isEnd){
        //     for (let i_2 = 0; i_2 <  horizontalList.length; i_2++) {
        //         var h_Item2=horizontalList[i_2];
        //         h_Item2.repeatCount+=1; 
        //     }
        // }
        console.log('horizontalList', horizontalList,share_RepeatCount%2);    
        var target = this.AllBlockColor;
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            for (let i2 = 0; i2 < horizontalList.length; i2++) {
                var T = horizontalList[i2].coordinate;
                //console.log('SlopeEquation[index]', i2, T, element.coordinateData.top_Left);
                if (T[0] >= element.coordinateData.top_Left[0] &&
                    T[0] <= element.coordinateData.top_Right[0] &&
                    T[1] >= element.coordinateData.top_Left[1] &&
                    T[1] <= element.coordinateData.bottom_Left[1]
                ) {
                    var temp_colorData =JSON.parse(JSON.stringify(colors[this.getRandom(0, colors.length-1)]));
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }                        
                    element.color =temp_colorData;
                    continue;
                }
            }
        }
    //console.log('this.animationSpeed', this.animationSpeed);
    },BaseSpeed*this.animationSpeed)
}

    /**
     * mode_Matrix3
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Matrix3(colors = [[255,255,0,1]], isRainbow = false){
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        var RGBcolors=[];
        RGBcolors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]];
        //RGBcolors =[[255,0,0,1],[255,0,0,0.8],[0,255,0,1],[0,255,0,0.8],[0,0,255,1],[0,0,255,0.8]];
        if(isRainbow){
            //colors=this.rainbow7Color();
            colors=RGBcolors;

        }   
        else{
            colors=[colors[0],[0,0,0,1]];
        }
        var totalStep=30;

        var intervalCount=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var target = this.AllBlockColor;
        this.setAllBlockColor([0,0,0,1]);
       var repeatCountList=[];
       var RanRange=[1,25];
        //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));

        for (let index = 0; index < target.length; index ++) {
            //console.log(' target[index].center_Point[0]', target[index].coordinateData.center_Point[0]);
           // var alpha=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            var modStep=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            //var ran=this.getRandom(0, colors.length - 1);
            var ran=(colors.length - 1)-Math.round(modStep* (colors.length - 1));
            //console.log('alpha',alpha);
            //console.log('modStep',modStep);
            //nowstep:modStep*totalStep
            repeatCountList.push({
                                color:0,
                                nowPos:0,
                                nowstep:0,
                                repeatCount:1,
                                repeatTime:this.getRandom(RanRange[0],RanRange[1]),
                            });
            var temp_block=repeatCountList[index];
            var temp_C=colors[0];
            var nextColor=colors[1];
            if(isRainbow){
                repeatCountList[index].nowPos=ran;
                if(ran<colors.length - 1){
                    temp_C=colors[ran];
                    nextColor=colors[ran+1];
                }
                else{
                    temp_C=colors[0];
                    nextColor=colors[0];
                }

            }

        }
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        var repeatCount=0;
        
        var exist=[];
        this.repeater = setInterval(() => {
            //this.setAllBlockColor([0, 0, 0, 1]);
            var horizontalList = [];
            //console.log('horizontalList;',horizontalList);
            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                // var resultL = exist.find((x) => x == index)
                // if (resultL != undefined) {
                //     break;
                // }
                exist.push(index);
                var temp_block = repeatCountList[index];
                //console.log('temp_block.color',temp_block.color);
                var tempColors = colors;
                //var tempColors =temp_block.color;
                var nextColor;
                if (temp_block.repeatTime > 0) {
                    temp_block.repeatTime -= 1;
                }
                if (temp_block.repeatTime == 0) { 
                    if (temp_block.nowStep + 1 < totalStep) {
                        temp_block.nowStep += 1;
                    }
                    else {
                        temp_block.nowStep = 0;
                        var newRand=this.getRandom(RanRange[0],RanRange[1]);
                        temp_block.repeatTime=newRand;
                        if (temp_block.nowPos + 1 < tempColors.length) {
                            temp_block.nowPos += 1;
                        }
                        else {
                            temp_block.nowPos = 0;
                        }
                    }
                    var temp_C = tempColors[temp_block.nowPos];
                    if (temp_block.nowPos + 1 < tempColors.length) {
                        nextColor = tempColors[temp_block.nowPos + 1];
                    }
                    else {
                        nextColor = tempColors[0]
                    }
                    var temp_colorData = [0, 0, 0, 1];
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }
                    element.color = temp_colorData;
                } 
                //continue;
                //break;
            }
            if (intervalCount * StartPoint.clientWidth < this.imageMaxWidth) {
                intervalCount += 1;
            }
            else {
                intervalCount = 0;
                exist=[];
                repeatCount += 1;
            }
            // if(repeatCount>2){
            //     clearInterval(this.repeater);
            // }
        }, 100)

    }

    /**
     * mode_Matrix2
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Matrix2(colors = [[255,255,0,1]], isRainbow = false){
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        var RGBcolors=[];
        RGBcolors =[[255,0,0,1],[0,255,0,1],[0,0,255,1]];
        if(isRainbow){
            //colors=this.rainbow7Color();
            colors=RGBcolors;

        }   
        else{
            colors=[colors[0],[0,0,0,1]];
        }
        var totalStep=30;

        var intervalCount=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var target = this.AllBlockColor;
        this.setAllBlockColor([0,0,0,1]);
       var repeatCountList=[];
       var RanRange=[10,100];
        //var temp_target=JSON.parse(JSON.stringify(this.AllBlockColor));

        for (let index = 0; index < target.length; index ++) {
            //console.log(' target[index].center_Point[0]', target[index].coordinateData.center_Point[0]);
           // var alpha=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            var modStep=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            //var ran=this.getRandom(0, colors.length - 1);
            var ran=(colors.length - 1)-Math.round(modStep* (colors.length - 1));
            //console.log('alpha',alpha);
            //console.log('modStep',modStep);

            //nowstep:modStep*totalStep
            repeatCountList.push({
                                color:0,
                                nowPos:0,
                                nowstep:0,
                                repeatCount:1,
                                repeatTime:this.getRandom(RanRange[0],RanRange[1]),
                            });
            

            var temp_block=repeatCountList[index];
            var temp_C=colors[0];
            var nextColor=colors[1];
            if(isRainbow){
                repeatCountList[index].nowPos=ran;
                if(ran<colors.length - 1){
                    temp_C=colors[ran];
                    nextColor=colors[ran+1];
                }
                else{
                    temp_C=colors[0];
                    nextColor=colors[0];
                }

            }
            // var temp_colorData = [0, 0, 0, 1];
            // for (let index = 0; index < 3; index++) {
            //     temp_colorData[index] = (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
            //     temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
            // }
        }
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        var repeatCount=0;
        
        var exist=[];
        this.repeater = setInterval(() => {
            //this.setAllBlockColor([0, 0, 0, 1]);
            var horizontalList = [];
            //console.log('horizontalList;',horizontalList);
            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                // var resultL = exist.find((x) => x == index)
                // if (resultL != undefined) {
                //     break;
                // }
                exist.push(index);
                var temp_block = repeatCountList[index];
                var tempColors = colors;
                var nextColor;
                //var tempColors =temp_block.color;
                if (temp_block.repeatTime > 0) {
                    temp_block.repeatTime -= 1;
                }
                if (temp_block.repeatTime == 0) { 
                    if (temp_block.nowStep + 1 < totalStep) {
                        temp_block.nowStep += 1;
                    }
                    else {
                        temp_block.nowStep = 0;
                        var newRand=this.getRandom(RanRange[0],RanRange[1]);
                        temp_block.repeatTime=newRand;
                        if (temp_block.nowPos + 1 < tempColors.length) {
                            temp_block.nowPos += 1;
                        }
                        else {
                            temp_block.nowPos = 0;
                        }
                    }
                    var temp_C = tempColors[temp_block.nowPos];
                    if (temp_block.nowPos + 1 < tempColors.length) {
                        nextColor = tempColors[temp_block.nowPos + 1];
                    }
                    else {
                        nextColor = tempColors[0]
                    }
                    var temp_colorData = [0, 0, 0, 1];
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index] = (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
                        temp_colorData[index] = temp_colorData[index] * this.lightData.brightness/100;
                    }
                    element.color = temp_colorData;
                } 
                //continue;
                //break;
            }
            if (intervalCount * StartPoint.clientWidth < this.imageMaxWidth) {
                intervalCount += 1;
            }
            else {
                intervalCount = 0;
                exist=[];
                repeatCount += 1;
            }
            // if(repeatCount>2){
            //     clearInterval(this.repeater);
            // }
        }, 100)

    }

    /**
     * mode_Starlight
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
    */
    mode_Starlight(colors = [[255,255,0,1]], isRainbow = false){
        clearInterval(this.repeater);
        this.currentBlockIndex=0;
        console.log('%c mode_Starlight','color:rgb(255,75,255,1)',colors);
        var translatecolors=[];
        if(isRainbow){
            translatecolors=this.rainbow7Color();
        }
        else{
            translatecolors=colors;
        }
        var totalStep=5;
        var intervalCount=0;
        var StartPoint = this.getNowBlock(0).coordinateData;
        var target = this.AllBlockColor;
        this.setAllBlockColor([0,0,0,1]);
       var repeatCountList=[];
       var RanRange=[1,200];
        for (let index = 0; index < target.length; index ++) {
            var modStep=(target[index].coordinateData.center_Point[0]%this.imageMaxWidth)/this.imageMaxWidth;
            var ran=this.getRandom(0, translatecolors.length - 1);
            //var ran=(colors.length - 1)-Math.round(modStep* (colors.length - 1));
            //console.log('modStep',modStep);
            console.log('ran',ran);
            repeatCountList.push({
                nowColor: [0, 0, 0, 1],
                nextColor: translatecolors[ran],
                nowStep: 0,
                repeatCount: 0,
                repeatTime: this.getRandom(RanRange[0], RanRange[1]),
            })
            //target[index].color=repeatCountList[index].color;
        }
        //var SlopeEquation=this.SlopeEquation([0,0],[834,372]);//StartPoint.clientWidth
        this.repeater = setInterval(() => {
            //this.setAllBlockColor([0, 0, 0, 1]);
            for (let index = 0; index < target.length; index++) {
                const element = target[index];
                var temp_block = repeatCountList[index];
                var tempColors = translatecolors;
                //var tempColors =temp_block.color;
                if (temp_block.repeatTime > 0) {
                    temp_block.repeatTime -= 1;
                }
                else if (temp_block.repeatTime == 0) { 
                    if (temp_block.nowStep + 1 < totalStep) {
                        temp_block.nowStep += 1;
                    }
                    else {
                        var newRand=this.getRandom(RanRange[0],RanRange[1]);
                        temp_block.nowStep = 0;
                        temp_block.repeatCount+=1;
                        temp_block.nowColor=JSON.parse(JSON.stringify(temp_block.nextColor));
                        if(temp_block.repeatCount%2){ 
                            temp_block.nextColor=[0,0,0,1];
                            temp_block.repeatTime=40;
                        }
                        else{
                        temp_block.nextColor=JSON.parse(JSON.stringify(translatecolors[this.getRandom(0, translatecolors.length - 1)]));
                        temp_block.repeatTime=this.getRandom(RanRange[0],RanRange[1]);

                        }

                    }
                    //console.log('temp_block',temp_block);

                    var temp_colorData = [0, 0, 0, 1];
                    for (let index2 = 0; index2 < 3; index2++) {
                        temp_colorData[index2] = (temp_block.nowColor[index2] * (totalStep - temp_block.nowStep) + temp_block.nextColor[index2] * temp_block.nowStep) / totalStep;
                        temp_colorData[index2] = temp_colorData[index2] * this.lightData.brightness/100;
                        
                    }

                    element.color = temp_colorData;
                } 
                //continue;
                //break;
            }
        }, 100)

    }

    /**
     * mode_FastRunWithoutTrace
     * @param colors array:RGBA
     * @param isRainbow boolean:RainbowMode
     * @param blockIndex number:StartPoint
    */
    mode_FastRunWithoutTrace(colors = [[255,0,0,1]], isRainbow = false,blockIndex=37){
        console.log('%c mode_FastRunWithoutTrace','color:rgb(255,77,255)',colors, isRainbow);
        if (isRainbow) {
            colors =this.rainbow7Color();
        }
        clearInterval(this.repeater);
        this.currentBlockIndex=blockIndex;
        var repeatCount=0;
        var StartPoint = this.getNowBlock(blockIndex).coordinateData;
        this.setAllBlockColor([0,0,0,1]);
        var totalStep=10;
        var horizontalList={
        };
        var target = this.AllBlockColor;
        var randomValue=this.getRandom(0,colors.length-1);
        var step_End=false;
        horizontalList[this.currentBlockIndex]={
               color:colors[this.getRandom(0,colors.length-1)]
        }
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            var Ysdis=Math.abs(StartPoint.top_Left[1]-element.coordinateData.top_Left[1]);
            if (Ysdis <= 10) {
                horizontalList[index]={
                    color:colors[this.getRandom(0,colors.length-1)],
                    nowPos:0,
                    nowstep:0,
                    repeatCount:0,
                    repeatTime:this.getRandom(15,20),
                }
            }
        }
        console.log('horizontalList',Object.keys(horizontalList))
        this.repeater=setInterval(()=>{
            var LIndex=this.currentBlockIndex-repeatCount;
            var RIndex=this.currentBlockIndex+repeatCount;
            var resultL = horizontalList[LIndex];
            var resultR = horizontalList[RIndex];
            if (step_End) {
                var tempColors = colors;
                var nextColor=[0,0,0,1];
                var arr = Object.keys(horizontalList);
                for (let index = 0; index < arr.length; index++) {
                    var index_num = parseInt(arr[index])
                    var temp_block = horizontalList[index_num]
                    if (temp_block.nowStep + 1 <= totalStep) {
                        temp_block.nowStep += 1;
                    }
                    else {
                        temp_block.nowStep = 0;
                        temp_block.repeatCount += 1;
                    }
                    var temp_C = temp_block.color;
                    var temp_colorData = [0, 0, 0, 1];
                    for (let index = 0; index < 3; index++) {
                        temp_colorData[index]= (temp_C[index] * (totalStep - temp_block.nowStep) + nextColor[index] * temp_block.nowStep) / totalStep;
                        temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
                    }
                    if(temp_block.repeatCount!=2){
                        target[index_num].color = temp_colorData;
                    }
                }
                if(horizontalList[arr[0]].repeatCount==2){
                    step_End = false;
                    clearInterval(this.repeater);
                }
                return;
            }  
            if (resultL == undefined && resultR == undefined) {
                repeatCount=0;
                step_End=true;
            }
            else{
                console.log('%c mode_FastRunWithoutTrace','color:rgb(255,77,255)',this.lightData.brightness);
                if (resultL != undefined) {
                    var temp_color=JSON.parse(JSON.stringify(horizontalList[LIndex].color));
                    for (let index = 0; index < 3; index++) {
                        temp_color[index]=temp_color[index]*this.lightData.brightness/100;    
                    }
                    target[LIndex].color = temp_color;
                }
                if (resultR != undefined) {
                    var temp_color=JSON.parse(JSON.stringify(horizontalList[RIndex].color));
                    for (let index = 0; index < 3; index++) {
                        temp_color[index]=temp_color[index]*this.lightData.brightness/100;    
                    }
                    target[RIndex].color = temp_color;                
                };
                repeatCount+=1;
            }
        },35*this.animationSpeed)
    }

    /**
     * mode_PassWithoutTrace
     * @param colors array:RGBA
     * @param fixMulticolor boolean:RainbowMode
    */
   mode_PassWithoutTrace(colors=[[0,0,255,1]],index=20,BaseSpeed=50) {
    clearInterval(this.repeater);
    //this.setAllBlockColor([0,0,0,1]);
    var nowStep=0;
    var totalStep=30;
    var nextColor=[0,0,0,1];
    var randomColor=colors[this.getRandom(0,colors.length-1)];
    this.repeater = setInterval(() => {
        this.setAllBlockColor([0,0,0,1]);
        if (nowStep<totalStep) {
            nowStep+=1;
        }
        else{
            clearInterval(this.repeater);
        } 
        var temp_colorData = [0, 0, 0, 1];
        for (let index = 0; index < 3; index++) {
            temp_colorData[index] = (randomColor[index] * (totalStep - nowStep) + nextColor[index] * nowStep) / totalStep;
            temp_colorData[index]=temp_colorData[index]*this.lightData.brightness/100;
        }
        var target = this.AllBlockColor;
        target[index].color = temp_colorData;   
    }, BaseSpeed*this.animationSpeed)
}

    /**
     * setAllBlockColor
     *@param rgba: array:color value
    */
    setAllBlockColor(rgba=[0,0,0,1]) {
        var target = this.AllBlockColor;
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            element.color =JSON.parse(JSON.stringify(rgba));
        }
    }

    /**
     * replaceAllBlockColor
     * @param AllBlock: array:AllBlockColorData
    */
    replaceAllBlockColor(AllBlock){
        for (let index = 0; index < AllBlock.length; index++) {
            this.AllBlockColor[index].color=AllBlock[index].color;
            this.AllBlockColor[index].breathing=AllBlock[index].breathing;
            this.AllBlockColor[index].clearStatus=AllBlock[index].clearStatus;
        }
    }

    /**
     * mode_reset
    */
    mode_reset() {
        var target = this.AllBlockColor;
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            element.color = [0,0,0,0];
        }
    }

    /**
     * rainbow7Color
    */
    rainbow7Color(){
       return [[255,0,0,1],[255, 165, 0,1],[255, 255, 0,1],[0, 255, 0 ,1],[0, 127, 255,1],[0, 0, 255,1],[139, 0, 255,1]];
    }
   
    /**
     * PointRotation
     * @param PointA: array:X,Y
     * @param PointB: array:X,Y
    */
    PointRotation(PointA, PointB) {
        var Dx =(PointB[0] - PointA[0]);
        var Dy =(PointB[1] - PointA[1]);
        var DRoation = Math.atan2(Dy, Dx);
        var WRotation = DRoation / Math.PI * 180;
        return WRotation;
    }

    /**
     * slopeEquation
    */
    slopeEquation(point1=[25,0],point2=[320,400]){
        var Slope =(point2[1]-point1[1])/(point2[0]-point1[0]);//x*1 y*1*Slope
        var LinearList=[];
        var temp_x=[point1[0],point1[1]];
        while (temp_x[0]<point2[0]&&temp_x[1]<point2[1]) {
            temp_x[0]+=1;
            temp_x[1]+=1*Slope;
            LinearList.push([temp_x[0],temp_x[1]]);
        }
        return LinearList;
    }

    /**
     * getIndexRGBCss
     * @param i: number:AllBlockColor index
    */
    getIndexRGBCss(i){
        //console.log('getIndexRGBCss', i)
        var target = this.AllBlockColor;
        if(target[i].color!=undefined){
            return this.toCssRGB(target[i].color);
        }

    }

    /**
     * getIndexRGBPerkeyCss
     * @param i: number:BreathTempArray index
    */
    getIndexRGBPerkeyCss(i) {
        //console.log('getIndexRGBPerkeyCss', i)
        var target = this.BreathTempArray;
        if (target[i].color != undefined) {
            return this.toCssRGB(target[i].color);
        }
    }

    /**
     * getRandom
     * @param min: number:minValue
     * @param max: number:maxValue
    */
    getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
    
    /**
     * getRandom
     * @param RGBA: array:color value
    */
    toCssRGB(RGBA=[0,0,0,0]){
          return 'rgb('+RGBA[0] + ',' + RGBA[1] + ',' + RGBA[2] + ',' + RGBA[3] + ')';
    }
}
