/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-09 23:59:48
 * @FilePath: \WaterSort\assets\script\Permanenter.js
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

const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const GameParamsHelper = require("./GameParamsHelper");
const HintHelper = require("./HintHelper");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const UIHelper = require("./UIHelper");
const WebBridge = require("./WebBridge");

window.Permanents = null;
cc.Class({
    extends: cc.Component,

    properties: {
        // prefab : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.game.setFrameRate(59)
        cc.game.addPersistRootNode(this.node);
        window.Permanents = this;

        UIHelper.addPermanents(this);
        
        this.scheduleOnce(() =>
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.BGM, true, true);
        },7);

        setInterval(() => {
            WebBridge.displayBannerInCommon();
            
        }, 50000);

        // if (typeof window.console !== 'undefined' && console.log) {
        //     window.console.log = function() {}; // 禁用控制台输出
        // }
    },

    start() {
        let _external = 0;
        this.node.x = (cc.winSize.width + _external) * 0.5;
        this.node.y = (cc.winSize.height + _external) * 0.5;

        this.node.width = cc.winSize.width + _external;
        this.node.height = cc.winSize.height + _external;


        this.scheduleOnce(() =>
        {
            WebBridge.displayBannerInCommon();
        }, 5)

        this.scheduleOnce(() =>
        {
            WebBridge.displayBannerInCommon();
        }, 25)

        setInterval(() =>
        {
            WebBridge.displayBannerInCommon();
        },40000)
        
        
        this.scheduleOnce(() =>
        {
            PlatformTool.initFullADBefore(true);
        },45)
    },
});
