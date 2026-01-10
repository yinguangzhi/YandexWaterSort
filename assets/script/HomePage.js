/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-18 22:21:35
 * @FilePath: \WaterSort\assets\script\HomePage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


var Observer = require("./Observer");
var PlatformTool = require("./PlatformTool");
var StorageHelper = require("./StorageHelper");
const UIHelper = require("./UIHelper");
const SceneHelper = require("./SceneHelper");
const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const UIBase = require("./UIBase");
const TimerHelper = require("./TimerHelper");
const WebBridge = require("./WebBridge");
const ItemMgr = require("./ItemMgr");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const HintHelper = require("./HintHelper");
const HHAssetPreLoader = require("./HHAssetPreLoader");
const GuideHelper = require("./GuideHelper");
const ImageMgr = require("./ImageMgr");
const TurnableMgr = require("./TurnableMgr");
const MissionMgr = require("./MissionMgr");
const Config = require("./Config");

cc.Class({
    extends: UIBase,

    properties: {

        suggestNode: cc.Node,
        shortcutNode: cc.Node,
        tournamentNode: cc.Node,
        
        levelEdit : cc.EditBox,

        levelLabel : cc.Label,
        streakFailNode: cc.Node,
        streakLabel: cc.Label,
        itemFrames : [cc.SpriteFrame],
    },

    onLoad()
    {
        ImageMgr.setItemFrames(this.itemFrames, true);
        
        GuideHelper.resetGuide();
        
        SceneHelper.isTranslating = false;
        this.scheduleOnce(() =>
        {
            if (!Config.enteredHome)
            {
                PlatformTool.getEntryPoint();
            }
            Config.enteredHome = true;

            SceneHelper.translateComplete();
            if (TurnableMgr.canForcePop())
            {
                UIHelper.displayUI("UITurnable", null, true, true, null);
            }
            else if (TurnableMgr.canForceSuggest())
            {
                Config.canPopSuggest = false;
                
                let _level = ItemMgr.getLevel();
                ItemMgr.setItemCount(ITEM_TYPE.SUGGESTED_LEVEL, _level,true);

                
                UIHelper.displayUI("UISuggest", null, true, true, null);
            }
                
        }, 0.3)

        
        UIHelper.hideUI("UIPause");
        UIHelper.hideUI("UISecond");

        this.levelLabel.string = 'Level ' + ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        this.streakLabel.string = ItemMgr.getItemCount(ITEM_TYPE.STREAK);
        this.streakFailNode.active = ItemMgr.getItemCount(ITEM_TYPE.STREAK) <= 0;
        if (this.suggestNode)
        {
            this.suggestNode.active = !PlatformTool.isIOS;
            // if (this.suggestNode.active)
            // {
            //     cc.tween(this.suggestNode)
            //         .to(0.4, { scale: 1.16 })
            //         .to(0.6, { scale: 1 })
            //         .delay(0.2)
            //         .union()
            //         .repeatForever()
            //         .start();
            // }
        }

        PlatformTool.isInTournament = true;
        if (this.tournamentNode) this.tournamentNode.active = false;
        PlatformTool.getCurrentTournament((tournament) =>
        {
            if (!cc.isValid(this)) return;

            try
            {
                if (tournament && tournament.getEndTime())
                {
                    let _isOut = TimerHelper.isOutTime(tournament.getEndTime() * 1000)
                    console.log("is tournament out : ", _isOut);
                    
                    if (this.tournamentNode)
                    {
                        this.tournamentNode.active = _isOut;
                    }
                    
                    PlatformTool.isInTournament = !_isOut;
                }
                else
                {
                    PlatformTool.isInTournament = false;
                    
                    if (this.tournamentNode) this.tournamentNode.active = true;
                }    
            }
            catch (err)
            {
                console.log("get curr tournament in home error : ", err);
                
                PlatformTool.isInTournament = false;

                if (this.tournamentNode) this.tournamentNode.active = true;
            }
        })
    },

    start()
    {
        //防止各种意外导致的未领取任务奖励
        let rewardProgress = MissionMgr.getMissionRewardProgress();
        let _canRewards = rewardProgress.canRewards;
        if (_canRewards.length != 0)
        {
            for (let i = 0; i < _canRewards.length; i++) {
                let _config = _canRewards[i];
                MissionMgr.claimMissionReward(_config.id)
            }
        }
        console.log(JSON.stringify(rewardProgress));

        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        
        PlatformTool.initFullADBefore(true);

        this.setShortcutState(false);
        this.scheduleOnce( () =>
        {
            WebBridge.autoShortcutInCommon(true,(_check) =>
            {
                if(cc.isValid(this)) this.setShortcutState(_check);
            },(_create) =>
            {
                if(cc.isValid(this)) this.setShortcutState(!_create);;
            })
        }, 0.1);
        
        SceneHelper.preLoadScene(SceneHelper.SCENE_NAME.GAME, () =>
        {

        })
        
        HHAssetPreLoader.addAsset("home", "prefab/UICoinPop", cc.Prefab, 1, null);
        HHAssetPreLoader.addAsset("home", "audio/coin", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("home", "prefab/UIPause", cc.Prefab, 1, null);
        HHAssetPreLoader.addAsset("home", "prefab/UISocial", cc.Prefab, 2, null);
        HHAssetPreLoader.addAsset("home", "prefab/UITurnable", cc.Prefab, 2, null);
        HHAssetPreLoader.addAsset("home", "prefab/UIRank", cc.Prefab, 2, null);
        HHAssetPreLoader.addAsset("home", "prefab/UISuggest", cc.Prefab, 2, null);


        this.scheduleOnce(() =>
        {
            HHAssetPreLoader.beginPreLoad("home")
        },3)
    },

    settingAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",200))
            return;

        UIHelper.displayUI("UIPause", null, true, true, null);
    },

    turnableAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",200))
            return;
        
        UIHelper.displayUI("UITurnable", null, true, true, null);
    },
    missionAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",200))
            return;
        
        UIHelper.displayUI("UIMission", null, true, true, null);
    },
    shopAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",200))
            return;
        
        UIHelper.displayUI("UIShop", null, true, true, null);
    },
    inviteAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",300)) return;

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

    HexAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("suggest",1000)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
        
        console.log("begin suggest")
        PlatformTool.suggestGame(PlatformTool.hexID,"hex");
    },
    
    shareAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("home",300)) return;

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
    
    shortcutAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("shortcut",200))
            return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
        
            
        PlatformTool.createShortcut(false, (_bool) =>
        {
            if(!cc.isValid(this)) return;
            this.setShortcutState(_bool);
            if(!_bool) HintHelper.displayHint("Failed to create a shortcut")
        });
    },

    setShortcutState(_state)
    {
        if (this.shortcutNode) this.shortcutNode.active = _state;
    },
    
    rankAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("home",300))
            return;
        
        UIHelper.displayUI("UIRank", null, true, true, null);
    },

    rewardAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if (!Observer.fireInterval("home", 200)) return;
        
        UIHelper.displayUI("UICoinPop", null, true, true, null);
    },

    
    socialAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("play",200))
            return;
        
        UIHelper.displayUI("UISocial", null, true, true, null);
    },

    playWithFriendAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("play",2000)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
        
        PlatformTool.playWithFriend((bool) =>
        {
            if (!cc.isValid(this)) return;
            
            this.realEnterGame();
        })
    },

    
    
    levelAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("play",2000))
            return;
        
        this.realEnterGame();
    },

    realEnterGame()
    {
        if (SceneHelper.isTranslating) return;
         
        let _level = ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        if(this.levelEdit && this.levelEdit.node.active)
        {
            let _str = this.levelEdit.string;
            try
            {
                let _pi = parseInt(_str);
                if (isNaN(_pi))
                {
                    
                }
                else _level = _pi;
                ItemMgr.setItemCount(ITEM_TYPE.LEVEL, _level);
            }
            catch(e)
            {

            }
        }
        
        GameMgr.currLevel = _level;

        SceneHelper.translateScene(SceneHelper.SCENE_NAME.GAME);
        
        SceneHelper.isTranslating = true;
        HHAssetPreLoader.stopPreLoad("home");
    },
});
