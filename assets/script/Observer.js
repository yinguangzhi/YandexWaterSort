/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-08-13 11:14:47
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-19 22:26:15
 * @FilePath: \Solitaire\assets\scripts\Observer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


    

module.exports =
{
    EVENT_NAME :
    {
        
        /**
         * @description 重新开始一局游戏
         */
        GAME_RE_START: "GAME_RE_START",      

        
        /**
         * @description 开始下一阶段
         */
        GAME_NEXT_PROCESSES: "GAME_NEXT_PROCESSES",    
        
        /**
         * @description 继续游戏
         */
        GAME_CONTINUE: "GAME_CONTINUE", 

        /**
         * @description 游戏结束
         */
        REAL_GAME_OVER: "REAL_GAME_OVER",
        
        
        /**
         * @description 保存格局
         */
        SAVE_BOARD_DATA: "SAVE_BOARD_DATA",        

      
        /**
         * @description 刷新道具数量
         */
        REFRESH_PROP: "REFRESH_PROP",
        
        /**
         * @description 刷新连胜记录
         */
        REFRESH_STREAK: "REFRESH_STREAK",
    
        /**
         * @description 设置阶段ui的状态
         */
        SET_MERGE_STAGE_UI: "SET_MERGE_STAGE_UI",
        
        /**
         * @description 展示合成的弹框提示
         */
        DISPLAY_COMBINE_EFFECT_TIP: "DISPLAY_COMBINE_EFFECT_TIP",
        

        /**
         * @description 生成游戏
         */
        GENERATE_GAME: "GENERATE_GAME",
        
        
        /**
         * @description 进入游戏主页
         */
        ENTER_HOME_PAGE: "ENTER_HOME_PAGE",
        
    
        
       
        /**
         * @description 刷新时间
         */
        REFRESH_CHALLENGE_LEVEL_TIME: "REFRESH_CHALLENGE_LEVEL_TIME",
       
       
        
        /**
         * @description 签到
         */
        REAL_SIGN_IN: "REAL_SIGN_IN",

        /**
         * @description 刷新收集进度
         */
        REFRESH_COLLECT_PROGRESS: "REFRESH_COLLECT_PROGRESS",

        /**
         * @description 刷新签到状态
         */
        REFRESH_SIGN_IN_STATE: "REFRESH_SIGN_IN_STATE",

        /**
         * @description 屏幕抖动
         */
        CAMERA_SHAKE: "CAMERA_SHAKE",

        REFRESH_CURRENCY: "REFRESH_CURRENCY",//金币
        
        DELAY_LOAD_2 : "DELAY_LOAD_2",//费金币
        SET_GUIDE_TIP : "SET_GUIDE_TIP",//
        HIDE_GUIDE_TIP: "HIDE_GUIDE_TIP",//
        REFRESH_AD_REWARD : "REFRESH_AD_REWARD",
        REFRESH_SKIN_SELECT : "REFRESH_SKIN_SELECT",
    },
    
    /** 回调函数 */
    massListeners : [],
    listeners: [],
    eventListeners: [],
    lastFireTime: 0,

    register(funcStr, func, attach) {
        this.listeners[funcStr] = { func: func, attach: attach };
    },

    fire(funcStr, params, params1, ...paramsn) {
        let _data = this.listeners[funcStr];

        if (!_data || !_data.func || !cc.isValid(_data.attach))
            return;


        let _length = arguments.length;
        if (_length == 1) _data.func.call(_data.attach);
        else if (_length == 2) _data.func.call(_data.attach, arguments[1]);
        else if (_length == 3) _data.func.call(_data.attach, arguments[1], arguments[2]);
        else if (_length == 4) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3]);
        else if (_length == 5) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4]);
        else if (_length == 6) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    },

    fireInterval(eventName, deltaTime, toAll) {
        let ret = false;
        let now = new Date();
        let _time = this.eventListeners[eventName];
        if (this.isEmpty(_time)) {
            this.eventListeners[eventName] = now.getTime();
            ret = true;
        }
        else {
            ret = (now.getTime() - _time) > deltaTime;
            if (ret) this.eventListeners[eventName] = now.getTime();
        }


        return ret;
    },

    clearMass()
    {
        this.massListeners = {};
    },
    
    registerMass(funcStr, func,attach)
    {
        if (!this.massListeners[funcStr]) this.massListeners[funcStr] = [];

        let arg = this.massListeners[funcStr].find(element => element.attach == attach);
        if(!arg) this.massListeners[funcStr].push({func : func,attach : attach});
    },

    removeMass(funcStr)
    {
        if (!this.massListeners[funcStr]) return;
        this.massListeners[funcStr] = null;
    },

    removeMassChild(funcStr, attach)
    {
        if (!this.massListeners[funcStr]) return;
        if (this.massListeners[funcStr].length == 0) return;

        let arg = this.massListeners[funcStr].find(element => element.attach == attach);
        if (!arg) return;

        let idx = this.massListeners[funcStr].indexOf(arg);
        this.massListeners[funcStr].splice(idx, 1);
        // console.log("success remove mass : " + funcStr + " : " + this.massListeners[funcStr].length);
    },
    
    fireMass(funcStr,params, params1, ...paramsn)
    {
        if (!this.massListeners[funcStr]) return;
        if (this.massListeners[funcStr].length == 0) return;

        let _length = arguments.length;
        
        let arr = this.massListeners[funcStr];
        for (let i = 0; i < arr.length; i++)
        {
            let _data = arr[i];
            if (cc.isValid(_data) && cc.isValid(_data.attach) && cc.isValid(_data.func))
            {
                if (_length == 1) _data.func.call(_data.attach);
                else if (_length == 2) _data.func.call(_data.attach, arguments[1]);
                else if (_length == 3) _data.func.call(_data.attach, arguments[1], arguments[2]);
                else if (_length == 4) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3]);
                else if (_length == 5) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4]);
                else if (_length == 6) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                
                // obj.func.call(obj.attach,track);
            }
            
                
        }
    },
    
    isEmpty: function (obj) {
        if (obj == '' || obj == null || obj == undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}
