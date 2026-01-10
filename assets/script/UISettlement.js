var UIHelper = require("./UIHelper");

var Observer = require("./Observer");
var StorageHelper = require("./StorageHelper");
var PlatformTool = require("./PlatformTool");
const GameParamsHelper = require("./GameParamsHelper");
const SceneHelper = require("./SceneHelper");
const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const WebBridge = require("./WebBridge");
const UIBase = require("./UIBase");
const GameMgr = require("./GameMgr");
const TimerHelper = require("./TimerHelper");
const ItemMgr = require("./ItemMgr");
const { ITEM_TYPE } = require("./EnumHelper");
const EffectHelper = require("./EffectHelper");
const TurnableMgr = require("./TurnableMgr");
cc.Class({
    extends: UIBase,

    properties: {
        
        rewardQuantityLabel: cc.Label,
        resultLabel: cc.Label,
        adNode: cc.Node,
        adLayoutNode: cc.Node,

        isAutoToHome: true,
        rewardQuantity: 0,
    },

    start()
    {
        UIHelper.hideUI("UIPause");
        
        this.isAutoToHome = false;

        GameParamsHelper.playNumber += 1;

        SceneHelper.fromType = GameMgr.isGameSuccess() ? SceneHelper.FROM_TYPE.GAME_SUCCESS : SceneHelper.FROM_TYPE.GAME_FAIL;
        
        this.rewardQuantity = GameMgr.willRewardCurrency;
        this.rewardQuantityLabel.string = "+" + this.rewardQuantity;
        this.resultLabel.string = ItemMgr.getItemCount(ITEM_TYPE.STREAK);

        
        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);

        ItemMgr.addItemCount(ITEM_TYPE.COIN, this.rewardQuantity,true);

        PlatformTool.setProtoRank("allUser",ItemMgr.getLevel() );
        

        this.scheduleOnce(() =>
        {
            let _community = false;
            let _share = false;
            if (GameParamsHelper.playNumber % 3 == 0)
            {
                // _community = GameData.checkCommunity();    
            }
            else if (GameParamsHelper.playNumber % 4 == 0)
            {
                // _share = true;
                // let _shareData = {index : 0,score :ItemMgr.getLevel()};
                // PlatformTool.updateToPlatform("/image/share",PlatformTool.updateType.share,_shareData,null,() =>
                // {});    
            }
            
            if (!_community && !_share) PlatformTool.postSessionScore(ItemMgr.getLevel());
            
        },0.2);

        PlatformTool.initVideoADBefore(true);
        
        PlatformTool.initFullADBefore(true);
        
        WebBridge.displayBannerInCommon();
        this.post();
    },

    post()
    {
        let _data = {index : 0,score : ItemMgr.getLevel()};
        let contextID = PlatformTool.getContextID();
        if(!CocosHelper.isEmpty(contextID))
        {
            PlatformTool.updateToPlatform("/image/share",PlatformTool.updateType.update,_data);
        }

        this.scheduleOnce(() =>
        {
            WebBridge.autoShortcutInCommon(true,null,null);
        },1);

        this.scheduleOnce(() =>
        {
            if(this.isAutoToHome)
            {
                SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
            }
        })
    },

    hide()
    {
        UIHelper.hideUI(this.node.name);
    },
    

    // playWithFriendAction()
    // {
    //     AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

    //     if(!Observer.fireInterval("settlement",500)) return;

    //     let _fight = GameParamsHelper.playNumber % 4 == 0;
    //     let _fUser = PlatformTool.getNextFriend();
    //     if (_fUser && _fight)
    //     {
    //         PlatformTool.fightWithUser(_fUser.id, _fUser.name, _fUser.photo,ItemMgr.getLevel(), () =>
    //         {
    //             Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
    //             this.hide();
    //         })    
    //     }
    //     else
    //     {
    //         PlatformTool.playWithFriend((bool) =>
    //         {
    //             Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
    //             this.hide();
    //         })
    //     }
    // },

    adAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("share",500)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

        WebBridge.displayVideoInCommon(true, (state) =>
        {
            if (state)
            {
                ItemMgr.addItemCount(ITEM_TYPE.COIN, this.rewardQuantity * 2, true);
                if (cc.isValid(this))
                {
                    EffectHelper.displayCoinFly(10, this.adNode, null, cc.v2(), 0, () =>
                    {
                        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
                    })

                    this.rewardQuantityLabel.string = "+" + this.rewardQuantity * 3;
                    this.adNode.active = false;
                    this.adLayoutNode.x = 0;
                }
            }
        })
    },

    homeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        WebBridge.displayFullInCommon(false,0,() =>
        {
            SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME, true);
            this.close2();
        })
    },

    nextAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        WebBridge.displayFullInCommon(false,0,() =>
        {
            if (TurnableMgr.canForcePop() || TurnableMgr.canForceSuggest())
            {
                SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME, true);
            }
            else
            {
                SceneHelper.translateScene(SceneHelper.SCENE_NAME.GAME, true);
            }
            this.close2();
        })
    },

    inviteAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("click",500)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

        let _data = {index : 0,score : ItemMgr.getLevel()};
        PlatformTool.inviteFriend("/image/share",() =>
        {
        });
    },

    // suggestAction()
    // {
    //     AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

    //     if (!Observer.fireInterval("suggest", 500)) return;
        
    //     AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

    //     PlatformTool.suggestGame(PlatformTool.neonID);
    // },
    // suggestAction2()
    // {
    //     AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

    //     if (!Observer.fireInterval("suggest", 500)) return;
        
    //     AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

    //     PlatformTool.suggestGame(PlatformTool.solitaireID);
    // },
});
