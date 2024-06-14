import { AppRecord } from './app-record';

// export class MacroItem
// {
//     targetIndex: number = -1;
//     data: MacroItemEntry[] = [];
// }

// export class MacroItemEntry
// {
//     startTime: number;
//     endTime: number;
//     isDown: boolean = false;
//     tipStart: string;
//     tipEnd: string;
//     tipInterval: string;

//     constructor(startTime: number, endTime: number, tipKeyString: string, pressIndex:number, options?: { isDown: boolean })
//     {
//         this.startTime = startTime;
//         this.endTime = endTime;

//         this.tipStart = `${tipKeyString}_tipStart${pressIndex}`;
//         this.tipEnd = `${tipKeyString}_tipEnd${pressIndex}`;
//         this.tipInterval = `${tipKeyString}_tipInterval${pressIndex}`;
//     }
// }

// export type MacroEntries = { [key: string]: MacroItem }

// export class MacroRecord extends AppRecord
// {
//     name: string = 'New Macro';
//     value: number = 0;
//     content: any = {};
//     m_Identifier: string = '';

//     constructor()
//     {
//         super();
//     }
// }



export class MacroItemEntry
{
  inputName: string;
  startTime: number;
  endTime?: number;

  get description(): { inputValue: string, label: string }
  {
    let inputValue = this.inputName.replace("Key", "");
    inputValue = inputValue.replace("Left", "");
    inputValue = inputValue.replace("Right", "");
    inputValue = inputValue.replace(/([A-Z]|(?<!F|\d)\d+)/g, ' $1').trim();

    let label = this.inputName.replace(/([A-Z]|(?<!F|\d)\d+)/g, ' $1').trim();
    return { inputValue, label };
  }

  constructor(inputName: string, startTime: number, endTime?: number)
  {
    this.inputName = inputName;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

export class MacroItem
{
  targetIndex: number = -1;
  data: MacroItemEntry[] = [];
}

export class MacroContent
{
  [inputName: string]: MacroItem;

  static getSize(macroContent: MacroContent): number
  {
    return Object.getOwnPropertyNames(macroContent).length;
  }
}

export class MacroRecord extends AppRecord {
    name: string = 'New Macro';
    value: number = 0;
    content: any = {};
    m_Identifier: '1' | '2' | '3' = '1';

    constructor(data?: any) {
        super();

        this.content = data?.content ?? this.content;
        this.m_Identifier = data?.m_Identifier ?? this.m_Identifier;
        this.name = data?.name ?? this.name;
        this.value = data?.value ?? this.value;
        this._id = data?._id ?? this._id;
    }
}
