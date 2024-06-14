export {}

declare global
{
    interface String
    {
        isPadAs(value: string): boolean;
    }
    interface StringConstructor 
    {
        padLeft(value: string, length: number): string;
        padRight(value: string, length: number): string;
    }
}

String.prototype.isPadAs = function(str)
{
    var re = new RegExp(str, 'g');
    return (this.replace(re, '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') == '');
};

String.padLeft = function(str,lenght)
{ 
    if(str.length >= lenght) 
       return str; 
    else 
      return String.padLeft(" " +str,lenght);   
} 

String.padRight = function(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return String.padRight(str+" ",lenght);
}