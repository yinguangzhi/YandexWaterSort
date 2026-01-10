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
const PlatformTool = require("./PlatformTool");
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
        this.bg.height = PlatformTool.isInTournament ? 600 : 680;
        this.tournamentNode.active = !PlatformTool.isInTournament;
        console.log(this.bg.height, "  ", PlatformTool.isInTournament); 
    },

    // update (dt) {},

    inviteAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",1000)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
            
            console.log("begin invite")
            PlatformTool.inviteFriend("image/share",(_state,_result) =>
            {
                if (!cc.isValid(this)) return;
                
                if (_result)
                {
                    console.log("begin invite 4 : ", _result.code)
                    
                    if (_result.code && _result.code == "PENDING_REQUEST")
                    {
                        HintHelper.displayHint("Pending Request.please wait a minute");
                    }
                }
                // if(this.shareNode) this.shareNode.active = false;
            });
        },
    
        shareAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
    
            if(!Observer.fireInterval("home",500)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
    
    
            let _data = { index: 0, score: ItemMgr.getLevel() };
            
            // UIHelper.displayMask(true);
    
            // let _t = setTimeout(() => {
            //     UIHelper.displayMask(false);
            // }, 5000);
    
            PlatformTool.updateToPlatform("/image/share", PlatformTool.updateType.share, _data, (err) =>
            {
                
            }, (_result) =>
            {
                // UIHelper.displayMask(false);
             
                // clearTimeout(_t);
                
                if (!cc.isValid(this)) return;
    
    
                if (_result)
                {
                    if (_result.code && _result.code == "PENDING_REQUEST")
                    {
                        HintHelper.displayHint("Pending Request.please wait a minute");
                    }
                }
                // if(this.shareNode) this.shareNode.active = false;
            });
        },
        
        contactAction()
        {
            
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("contact",500))
                return;
    
            PlatformTool.communityPage((_could,_result) =>
            {
                if (!_could)
                {
                    HintHelper.displayHint("Unable follow official page,please wait.");
                }
                else
                {
                    if (!_result)
                    {
                        HintHelper.displayHint("follow official page fail,please wait.");
                    }
                }
                
            });
        },
    
        
        joinGroupAction2()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",500)) return;
    
            console.log("joinGameGroup.............. ");
            PlatformTool.joinGameGroup((state) =>
            {
            });
        },
    
        tournamentAction()
        { 
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("tournament",500))
                return;
    
            PlatformTool.createTournament(ItemMgr.getLevel(),(state) =>
            {
                if (!state) return;
                
                let _canvas = cc.find("Canvas");
                if (!_canvas) return;

                let _hp = _canvas.getComponent('HomePage');
                if (!_hp) return;

                _hp.realEnterGame();
                
                UIHelper.hideUI("UISocial");
            });
        },
        
    
        playWithFriendAction()
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
            if(!Observer.fireInterval("home",1000)) return;
    
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
            
            PlatformTool.playWithFriend((bool) =>
            {
                if (!cc.isValid(this)) return;
                
            })
        },
});
