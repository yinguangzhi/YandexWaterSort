/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-01-13 22:24:56
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-20 19:23:07
 * @FilePath: \WaterSort\assets\script\UISocial.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const GameParamsHelper = require("./GameParamsHelper");
const TimerHelper = require("./TimerHelper");
const { log } = require("console");
const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const UIBase = require("./UIBase");
const WebBridge = require("./WebBridge");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const HintHelper = require("./HintHelper");

cc.Class({
    extends: UIBase,

    properties: {
        tournamentNode : cc.Node,
        bg : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    inviteAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",1000)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
            
           
        },
    
        shareAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
    
            if(!Observer.fireInterval("home",500)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
    
        },
        
        contactAction()
        {
            
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("contact",500))
                return;
    
        },
    
        
        joinGroupAction2()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",500)) return;
    
        },
    
        tournamentAction()
        { 
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("tournament",500))
                return;
    
            
        },
        
    
        playWithFriendAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",1000)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
           
        },
});
