export class DisplayOption
{
    optionKey: string;
    translationKey: string;
    value: any = null;
    data: any = null;

    get integerValue(): number
    {
        const val = parseInt(this.value);
        if(isNaN(val)) { return -1; }
        return val;
    }
    get floatValue(): number
    {
        const val = parseFloat(this.value);
        if(isNaN(val)) { return -1; }
        return val;
    }
    get stringValue(): string
    {
        switch(typeof this.value)
        {
            case 'string': return this.value;
            case 'number': return this.value.toString();
            case 'object': return JSON.stringify(this.value, null, 2);
        }
        return '';
    }

    constructor(optionKey: string, translationKey: string, value: any = null, data: any = null)
    {
        this.optionKey = optionKey;
        this.translationKey = translationKey;
        this.value = value;
        this.data = data;
    }
}