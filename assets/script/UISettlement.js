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


        this.scheduleOnce(() =>
        {
        },0.2);

        PlatformTool.initVideoADBefore(true);
        
        PlatformTool.initFullADBefore(true);
        
        WebBridge.displayBannerInCommon();
        this.post();
    },

    post()
    {
        
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

    },

});
