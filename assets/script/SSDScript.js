/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-30 19:40:22
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-01-31 18:10:08
 * @FilePath: \Block\assets\script\SSDScript.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        uniqueID: 0,
        
        __data : null,
        data: {
            get: function ()
            {
                return this.__data;
            },
            set: function (value)
            {
                this.__data = value;
                if(this.__data != null)
                {
                    this.setData();
                }
            }
        },

        __endCall : null,
        endCall: {
            get: function ()
            {
                return this.__endCall;
            },
            set: function (value)
            {
                this.__endCall = value;
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},
    setData()
    { 
        
    },

    /**
     * @description 展示动画
     */
    displayAnima()
    {
        
    },
});
