export {}

declare global
{
    interface Date
    {
        format(formatKey: string): string;
        add(milliseconds: number): Date;
        addSeconds(seconds: number): Date;
        addMinutes(minutes: number): Date;
        addHours(hours: number): Date;
        addDays(days: number): Date;
        addMonths(months: number): Date;
        addMonth(): Date;
        subtractMonth(): Date;
        addYears(years: number): Date;

        isLeapYear(year: number): boolean;
        // daysInMonth(year: number, month: number): number;
    }
    interface DateConstructor
    {
        // format(formatKey: string): string;
        // add(milliseconds: number): Date;
        // addSeconds(seconds: number): Date;
        // addMinutes(minutes: number): Date;
        // addHours(hours: number): Date;
        // addDays(days: number): Date;
        // addMonths(months: number): Date;
        // addMonth(): Date;
        // subtractMonth(): Date;
        // addYears(years: number): Date;

        // isLeapYear(year: number): boolean;
        daysInMonth(year: number, month: number): number;
    }
};

Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) 
        format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

Date.prototype.add = function(milliseconds)
{
    var m = this.getTime() + milliseconds;
    return new Date(m);
};
Date.prototype.addSeconds = function(second)
{ 
    return this.add(second * 1000);
};
Date.prototype.addMinutes = function(minute)
{ 
    return this.addSeconds(minute*60);
};
Date.prototype.addHours = function(hour)
{ 
    return this.addMinutes(60*hour);
};
Date.prototype.addDays = function(day)
{
    return this.addHours(day * 24);
};
Date.prototype.addMonths = function(addMonth)
{
    var result;
    if(addMonth > 0){
        while(addMonth > 0){
            result = this.addMonth();
            addMonth -- ;
        }
    }else if(addMonth < 0){
        while(addMonth < 0){
            result = this.subtractMonth();
            addMonth ++ ;
        }
    }else{
        result = this;
    }
    return result;
};
Date.prototype.addMonth = function()
{
    var m = this.getMonth();
    if(m == 11)return new Date(this.getFullYear() + 1,1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
    
    var daysInNextMonth = Date.daysInMonth(this.getFullYear(),this.getMonth() + 1);
    var day = this.getDate();
    if(day > daysInNextMonth){
        day = daysInNextMonth;
    }
    return new Date(this.getFullYear(),this.getMonth() + 1,day,this.getHours(),this.getMinutes(),this.getSeconds());    
};
Date.prototype.subtractMonth = function()
{
    var m = this.getMonth();
    if(m == 0)return new Date(this.getFullYear() -1,12,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
    var day = this.getDate();
    var daysInPreviousMonth = Date.daysInMonth(this.getFullYear(),this.getMonth());
    if(day > daysInPreviousMonth){
        day = daysInPreviousMonth;
    }
    return new Date(this.getFullYear(),this.getMonth() - 1,day,this.getHours(),this.getMinutes(),this.getSeconds());
};
Date.prototype.addYears = function(year)
{
    return new Date(this.getFullYear() + year,this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
};

Date.prototype.isLeapYear = function(year)
{
    return (year % 4 == 0 && year % 100 != 0)
};

Date.daysInMonth = function(year,month)
{
    if(month == 2){
        if(year % 4 == 0 && year % 100 != 0)
            return 29;
        else
            return 28;
    }
    else if((month <= 7 && month % 2 == 1) || (month > 7 && month % 2 == 0))
        return 31;
    else
        return 30;
};