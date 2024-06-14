import { PerKeyLightingKeyData } from '../../../common/data/records/device-data.record';
import { SupportData } from '../../../common/SupportData';
import { KeyboardvalueCData, KeyboardvalueCKeyData } from '../../../common/data/valueC-data';

export const KEYASSIGN_INPUTMAX = 83;
export class KeyboardData
{
    defaultName = '未配置';
    profileindex = 0;
    KeyBoardArray: KeyboardAssignmentData[];
    sideLightSwitch = false;
    maxKayCapNumber: number;
    notClickedYet = true;
    profileLayers: (KeyboardAssignmentData[])[] = [];
    profileLayerIndex = [0, 0, 0];
    layerMaxNumber = 3;

    constructor(inputmax: any = KEYASSIGN_INPUTMAX)
    {
        this.maxKayCapNumber = inputmax;
        this.KeyBoardArray =
        [
            new KeyboardAssignmentData('PROFILE1', inputmax, 0),
            new KeyboardAssignmentData('PROFILE2', inputmax, 1),
            new KeyboardAssignmentData('PROFILE3', inputmax, 2),//profile
        ];

        for (let index = 1; index <= this.KeyBoardArray.length; index++)
        {
            const layers = new Array<KeyboardAssignmentData>();
            for (let index2 = 1; index2 <= this.layerMaxNumber; index2++)
            {
                layers.push(new KeyboardAssignmentData('PROFILE' + index2 * index, inputmax, index2 * index));
            }
            this.profileLayers.push(layers);
        }

    }

    setALLDefaultKeyArray(data: any)
    {
        console.log('setALLDefaultKeyArray', this.profileLayers);
        var KBMarr = this.KeyBoardArray!;
        for (let index = 0; index < KBMarr.length; index++)
        {
            KBMarr[index].setTargetDefaultKeyArray(data);
            for (let index2 = 0; index2 < this.layerMaxNumber; index2++)
            {
                this.profileLayers[index][index2].setTargetDefaultKeyArray(data);
            }
        }
    }

    getNowProfileLayersData()
    {
        var obj=this.profileLayers[this.profileindex];
        return obj;
    }

    getProfileLayerIndex()
    {
       return this.profileLayerIndex[this.profileindex];
    }

    changeProfileLayer()
    {
        var T = this.getProfileLayerIndex();
        if (T < this.layerMaxNumber - 1)
        {
            T = T + 1;
        }
        else
        {
            T = 0;
        }
        this.profileLayerIndex[this.profileindex] = T;
        console.log('changeProfileLayer',  this.getProfileLayerIndex());
        console.log('changeProfileLayer_profile', this.getTarget());

    }

    clearRecordMacroData(m_id = '')
    {
        //console.log('clearRecordMacroData', targetName)
        var KBMarr = this.KeyBoardArray!;
        for (let index = 0; index < KBMarr.length; index++)
        {
            KBMarr[index].delete_Find_MacroData(m_id)
            for (let index2 = 0; index2 < this.layerMaxNumber; index2++)
            {
                this.profileLayers[index][index2].delete_Find_MacroData(m_id);
            }
        }
    }

    setAllProfileFieldData(field: any,obj: any)
    {
        var KBMarr = this.KeyBoardArray!;
        for (let index = 0; index < KBMarr.length; index++)
        {
            KBMarr[index][field] = obj;
            //console.log('KBMarr[index][field]', KBMarr[index][field])
            for (let index2 = 0; index2 < this.layerMaxNumber; index2++)
            {
                this.profileLayers[index][index2][field]=obj;
            }
        }
    }

    getTarget()
    {
        try
        {
            if(this.layerMaxNumber > 0)
            {
                return this.profileLayers[this.profileindex][this.getProfileLayerIndex()];
            }
            else
            {
                return this.KeyBoardArray![this.profileindex]
            }
        }
        catch (error)
        {
            console.log('%c profileindex', 'background: blue; color: red', this.profileindex);
            console.log('%c this.getProfileLayerIndex()', 'background: blue; color: red', this.getProfileLayerIndex());
        }

    }

    getAssignTarget(index: any)
    {
        return this.KeyBoardArray![index]
    }
}
export class KeyboardAssignmentData
{
    profileName = 'default';
    profileid = 0;
    hibernate = true
    winLock = false
    hibernateTimeArr: any = [1, 3, 5, 10]
    hibernateTime: any = 3
    defaultName = "Default";
    pollingrate = 1000;
    sensitivity = 2;
    standby = 1;
    standbyvalue = 8;
    inputLatency = 2;
    light_PRESETS_Data = {};
    light_PERKEY_Data = { value: 1 };
    light_PERKEY_KeyAssignments: (PerKeyLightingKeyData[])[] = [[]];
    light_PERKEY_Layout: number = 0;
    recordAssignBtnIndex: any = 0;
    assignText: any = 'defaultKey';
    maxKayCapNumber: any;
    assignedKeyboardKeys: (KeyboardKeyAssignmentData[])[] = [[]]; //61KEY
    assignedFnKeyboardKeys = []; //61KEY
    fnModeMartrix = [false, false, false];
    fnModeindex = 0;
    fiveDefaultLedCode: any = [];
    fiveRecordIndex: any = 0;
    keyHoverIndex = 0;
    profileLayerIndex = 0;

    valueCData: KeyboardvalueCData | null = null;

    constructor(name: string = '', inputMax: number, profileid: any)
    {
        this.maxKayCapNumber = inputMax
        this.profileName = name;
        this.profileid = profileid;
        for (let index = 0; index < 1; index++)
        {
            for (let i2 = 0; i2 < this.maxKayCapNumber; i2++)
            {
                this.assignedKeyboardKeys[index].push(new KeyboardKeyAssignmentData());
                this.light_PERKEY_KeyAssignments[index].push(new PerKeyLightingKeyData());
            }
        }
        this.valueCData = new KeyboardvalueCData();
    }

    setTargetDefaultKeyArray(data: any)
    {
        //console.log('setTargetDefaultKeyArray',AllFunctionMapping);
        for (let index = 0; index < data.length; index++)
        {
            var targetValue = SupportData.AllFunctionMapping.find((x: any) => x.code == data[index])
            // console.log('setTargetDefaultKeyArray_index', index, targetValue);
            if(targetValue!=undefined)
            {
                this.getNowModeKeyMatrix()[index].defaultValue = targetValue.value;
            }

        }
    }

    getHibernateStepTime()
    {
        //console.log("getHibernateStepTime",this.hibernateTimeArr,this.hibernateTime);
        return this.hibernateTimeArr[this.hibernateTime];
    }

    ImportClassData(InputData: any)
    {
        // console.log('ImportClassData', InputData)
        var tempData=JSON.parse(JSON.stringify(InputData));
        var excludeVar = ['KB61Prohibit', 'profileLayerIndex','profileName', 'light_PERKEY_KeyAssignments']
        var arr: any = Object.keys(this);
        var self: any = this;
        for (let index: any = 0; index < arr.length; index++)
        {
            if(excludeVar.indexOf(arr[index]) == -1)
            {
                self[arr[index]] = tempData[arr[index]];
            }
        }
    }

    HasSet(checkIndex = 0)
    {
        var target = this.getNowModeKeyMatrix();
        var N = target[checkIndex].value;
        var N2 = target[checkIndex].profileName;
        var N3 = target[checkIndex].LongTimePressValue;
        var N4 = target[checkIndex].InstantPressValue;
        return N != '' || N2 != '' || N3 != '' || N4 != '' ? true : false;
    }

    getKeyTargetOptionFrequency()
    {
        var N = this.getNowModeTargetMatrixKey().macroOptionNumber;
        console.log('getKeyTargetOptionFrequency', N);
        switch (true) {
            case N < 65535:
                return N;
            case N == 65535:
                return 1;
            case N == 65536:
                return 1;
        }
    }

    checkNowModeTargetMatrixAssignKey(index: any, compareKeyCode: any)
    {
        //console.log('getNowModeTargetMatrixKey', this.getNowModeKeyMatrix()[this.recordAssignBtnIndex])
        if (this.getNowModeKeyMatrix()[index].defaultValue == compareKeyCode)
        {
            return false;
        }
        return true;
    }

    getNowModeKeyMatrix()
    {
        return this.assignedKeyboardKeys[this.fnModeindex];
    }

    getNowModeTargetMatrixKey()
    {
        //console.log('getNowModeTargetMatrixKey', this.getNowModeKeyMatrix()[this.recordAssignBtnIndex])
        return this.getNowModeKeyMatrix()[this.recordAssignBtnIndex];
    }

    getMacroList()
    {
        var data = this.getNowModeKeyMatrix();
        var macrolist: any[] = [];
        for (let index = 0; index < data.length; index++)
        {
            const target = data[index];
            switch (target.recordBindCodeType)
            {
                case 'MacroFunction':
                //console.log('case MacroFunction:',target);
                macrolist.push(target.macro_Data);
                break;
            }
        }
        console.log("%c getMacroList","color:red",macrolist);
        return macrolist;
    }

    setAssignTargetData(data: any)
    {
        var target = this.getNowModeTargetMatrixKey();
        console.log('setAssignTargetData:', data, 'ManagerTarget:', target);
        var arrKeys = Object.keys(data);
        for (let index = 0; index < arrKeys.length; index++)
        {
            if (target[arrKeys[index]] != undefined)
            {
                target[arrKeys[index]] = data[arrKeys[index]];
            }
        }
        target.changed = true;
    }

    reset_AllKey()
    {
        var KeyArray = this.getNowModeKeyMatrix();
        for (let index = 0; index < KeyArray.length; index++)
        {
            for (var [key, value] of Object.entries(KeyArray[index]))
            {
                if (key != "defaultValue")
                {
                    KeyArray[index][key] = DefaultKeyboardKeyAssignmentData[key];
                }
            }
        }
    }

    delete_Find_MacroData(m_id='')
    {
        var KeyArray = this.getNowModeKeyMatrix();
        for (let index = 0; index < KeyArray.length; index++)
        {
            if(KeyArray[index].recordBindCodeType=="MacroFunction")
            {
                if(KeyArray[index].macro_Data.m_Identifier==m_id)
                {
                    for (var [key, value] of Object.entries(KeyArray[index]))
                    {
                        if (key != "defaultValue")
                        {
                            KeyArray[index][key] = DefaultKeyboardKeyAssignmentData[key];
                        }
                    }
                }
            }
        }
    }
}
export class KeyboardKeyAssignmentData {
    keyAssignType: string[] = ['', '', ''];
    LongTimePressValue: string = '';
    InstantPressValue: string = '';
    LongTime_Instant_Status: boolean = false;
    openLongTimePress: boolean = false;
    defaultValue: string = 'Default';
    value: string = '';
    macro_RepeatType: number = 0;
    macro_Data: any = {};
    assignValue: string = '';
    profileName: string = '';
    recordBindCodeType: string = '';
    recordBindCodeName: string = '';
    shortcutsWindowsEnable: boolean = false;
    ApplicationPath: string = '';
    WebsitePath: string = '';
    combinationkeyEnable: boolean = false;
    Shift: boolean = false;
    Alt: boolean = false;
    Ctrl: boolean = false;
    hasFNStatus: boolean = false;
    AltGr: boolean = false;
    Windows: boolean = false;
    changed: boolean = false;

    valueCKeyData: KeyboardvalueCKeyData | null = null;

    constructor(values: Partial<KeyboardKeyAssignmentData> = { value: 'Default', recordBindCodeName: 'Default' }) {
        Object.assign(this, values);
        this.valueCKeyData = new KeyboardvalueCKeyData();
    }
}

export const DefaultKeyboardKeyAssignmentData: KeyboardKeyAssignmentData = new KeyboardKeyAssignmentData();
