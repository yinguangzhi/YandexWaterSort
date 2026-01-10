/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-02-04 14:12:19
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-12-23 20:40:48
 * @FilePath: \Block\assets\script\UIRelive.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const GameParamsHelper = require("./GameParamsHelper");
const TimerHelper = require("./TimerHelper");
const { log } = require("console");
const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const UIBase = require("./UIBase");
const WebBridge = require("./WebBridge");
const GameMgr = require("./GameMgr");
cc.Class({
    extends: UIBase,

    properties: {
        timeLabel: cc.Label,
        addTime: 0,
        
        skipNode : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    start()
    {
        this.skipNode.active = false;
        this.addTime = 60;

        this.timeLabel.string = "+01:00";
        
        
        this.scheduleOnce(() =>
        {
            PlatformTool.initVideoADBefore(true);
        }, 0.1)
        
        this.scheduleOnce(() =>
        {
            WebBridge.displayBannerInCommon();
        }, 0.2)
        
        
        this.scheduleOnce(() =>
        {
            this.skipNode.active = true;
        },2)
    },

    adAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("relive",500))
            return;

        WebBridge.displayVideoInCommon(true, (state) =>
        {
            if (!cc.isValid(this)) return;
            
            if (state) {
                GameMgr.revive();
                this.close2();
            }
        })
    },

    coinAction()
    {

    },

    skipAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("relive",500))
            return;

        GameMgr.realGameEnd(0.6);

        this.close2();
    },
});
