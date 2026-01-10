/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-09-08 07:42:17
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-16 23:16:05
 * @FilePath: \Block\assets\script\TimerHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { log } = require("console");

module.exports =
{
    EVENT_NAME:
    {
        SAVE_BOARD: "SAVE_BOARD",
        RELIVE_COUNT_DOWN : "RELIVE_COUNT_DOWN",
    },

    eventListeners: null,
    
    register(_name,_duration,_count,_call)
    {
        if (!this.eventListeners) this.eventListeners = [];
        let timer =
        {
            name: _name,
            left : _duration,
            duration: _duration,
            count: _count,
            call: _call,
            isPause : false,
        }
        
        let _idx = this.findTimer(_name);
        if (_idx != -1) this.eventListeners.splice(_idx, 1);

            log(timer);
        this.eventListeners.push(timer);
    },

    unRegister(_name)
    {

        if (!this.eventListeners) this.eventListeners = [];
        
        let _idx = this.findTimer(_name);
        if (_idx != -1) this.eventListeners.splice(_idx, 1);
    },
    
    pauseTimer(_name)
    {
        let _idx = this.findTimer(_name);
        if (_idx == -1) return;

        this.eventListeners[_idx].isPause = true;
    },

    
    resumeTimer(_name)
    {
        let _idx = this.findTimer(_name);
        if (_idx == -1) return;

        this.eventListeners[_idx].isPause = false;
    },

    findTimer(_name)
    {
        if (!this.eventListeners || this.eventListeners.length == 0) return -1;
        let timer = this.eventListeners.find(element => element.name == _name);
        if (timer)
        {
            return this.eventListeners.indexOf(timer);    
        }
        return -1;
     },
    
    fireTimer()
    {

    },

    isValid()
    {
        return this.eventListeners && this.eventListeners.length > 0;
    },

    getWeek()
    {
        /*  
        date1是当前日期  
        date2是当年第一天  
        d是当前日期是今年第多少天  
        用d + 当前年的第一天的周差距的和在除以7就是本年第几周  
        */
        let cd = this.getDate();
        let cw = cd.getDay() == 0 ? 7 : cd.getDay();

        let fd = new Date(cd.getFullYear(), 0, 1);
        let fw = fd.getDay() == 0 ? 7 : fd.getDay();

        let d = Math.floor((cd.valueOf() - fd.valueOf() + (fw - cw) * 24 * 60 * 60 * 1000) / 86400000);
        let w = Math.ceil(d / 7) + 1;
        console.log("第x周 : " + w);
        return w;
    },

    getWeekDay()
    { 
        let date = this.getDate();
        return date.getDay();
    },
    
    getMonthDay()
    { 
        let date = this.getDate();
        return date.getDate();
    },
    
    getMonth()
    { 
        let date = this.getDate();
        return date.getMonth() + 1;
    },

    getYear()
    {
        let date = this.getDate();
        console.log(date.getYear() + " " + date.getFullYear());  
        return date.getFullYear();
    },
    
    getDate()
    {
        let date = new Date();//new Date(2022,5,20);// 
        
        return date;
    },

    currentTimeStr: function () {
        let now = this.getDate();// new Date();

        let year = now.getFullYear();       //年
        let month = now.getMonth() + 1;     //月
        let day = now.getDate();            //日

        let clock = year + "-";

        if (month < 10) clock += "0";

        clock += month + "-";

        if (day < 10) clock += "0";

        clock += day;
        return (clock);
    },


    /** 从1971年开始的毫秒数 */
    getMission()
    { 
        let _date = this.getDate();
        let _mission = _date.getTime();
        return _mission;
    },
    
    /**
     * 是否超过时间
     * @param 毫秒数 _time 
     */
    isOutTime(_time)
    {
        let _currMission = this.getMission();
        console.log("check out time : ",_time, "  ", _currMission,"  ",_currMission > _time);
        
        if (_currMission > _time)
        {
            return true;
        }
        return false;
    },

    /**
     * @description 时间转化,12d 8h
     * @param seconds 
     * @returns 
     */
    secondToDH(seconds)
    {
        let remainingSeconds = seconds % 86400;
        let remainingHours = Math.floor(remainingSeconds / 3600);
        let days = Math.floor(seconds / 86400);
        let result = days + "d " + remainingHours + "h";
        return result;
    },

    getLeaveTimeInWeek()
    {
        let leaveTime = 0;

        let date = this.getDate();
        let nowDate = new Date(date);

        let firstDay = new Date(date);
        firstDay.setMonth(0);//设置1月
        firstDay.setDate(1);//设置1号
        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setSeconds(0);

        //当年的第一天是星期几
        let fWeekDay = firstDay.getDay() == 0 ? 7 : firstDay.getDay();

        //当年的第一个星期是几天，多长时间
        let fWeekTimes = (7 - fWeekDay + 1) * this.dayMilliseconds(); 

        //当前时间和本年度第一天的时间差
        let diff = nowDate.valueOf() - firstDay.valueOf(); 

        if (diff <= fWeekTimes)
        {
            leaveTime = fWeekTimes - diff;
        }
        else
        {  
            let deltaWeek = Math.ceil((diff - fWeekTimes) / this.weekMilliseconds());
            let _targetTime = deltaWeek * this.weekMilliseconds() + fWeekTimes;
            leaveTime = _targetTime - diff;
        }
        
        return leaveTime / 1000;
    },

    daySeconds()
    {
        return 24 * 60 * 60;
    },

    dayMilliseconds()
    {
        return 24 * 60 * 60 * 1000;
    },

    weekMilliseconds()
    {
        return 7 * 24 * 60 * 60 * 1000;
    },
    // /** 返回秒 */
    // getTime() {
    //     return Math.round(this._time + this._debugTime);
    // },

    // get timeMs() {
    //     return this._time + this._debugTime;
    // }
}