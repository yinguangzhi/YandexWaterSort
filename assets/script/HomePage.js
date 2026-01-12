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
const { default: i18nMgr } = require("./i18n/i18nMgr");

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
           
            Config.enteredHome = true;

            SceneHelper.translateComplete();
            if (TurnableMgr.canForcePop())
            {
                UIHelper.displayUI("UITurnable", null, true, true, null);
            }
                
        }, 0.3)

        
        UIHelper.hideUI("UIPause");
        UIHelper.hideUI("UISecond");

        this.levelLabel.string = i18nMgr.ins.getLabel('Level') + ' ' + ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        this.streakLabel.string = ItemMgr.getItemCount(ITEM_TYPE.STREAK);
        this.streakFailNode.active = ItemMgr.getItemCount(ITEM_TYPE.STREAK) <= 0;
        if (this.suggestNode)
        {
            this.suggestNode.active = false;
        }

        if (this.tournamentNode) this.tournamentNode.active = false;
        
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
        
    },

    HexAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("suggest",1000)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
       
    },
    
    shareAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("home",300)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);


    },
    
    shortcutAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("shortcut",200))
            return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
        
        
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
