
const Observer = require("./Observer");
var StorageHelper = require("./StorageHelper");
const UIHelper = require("./UIHelper");
const SceneHelper = require("./SceneHelper");
const AudioHelper = require("./AudioHelper");
const GameParamsHelper = require("./GameParamsHelper");
const PlatformTool = require("./PlatformTool");
const { log } = require("console");
const WebBridge = require("./WebBridge");
const ItemMgr = require("./ItemMgr");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const HintHelper = require("./HintHelper");
const UIBase = require("./UIBase");

cc.Class({
    extends: UIBase,

    properties: {
        audioNode: cc.Node,
        musicNode: cc.Node,
        vibrateNode: cc.Node,
        layout : cc.Layout,
        
        restartBtn: cc.Node,
        homeBtn: cc.Node,
        inviteBtn: cc.Node,
    },

    // onLoad()
    // {
        
    // },

    start()
    {
        PlatformTool.initFullADBefore(true);
     
        
        this.inviteBtn.active = false// !SceneHelper.isGameScene();

        this.homeBtn.active = SceneHelper.isGameScene();
        this.restartBtn.active = SceneHelper.isGameScene();

        GameMgr.pauseGame = true;
        
        if (!PlatformTool.isPhoneSupportVibrate())
        {
            this.layout.spacingY = 66;
            this.vibrateNode.active = false;
        }
        
        
        AudioHelper.preLoadAudio(AudioHelper.AUDIO_NAME.START);
        
        this.setAudioState(StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.AUDIO) == 1);
        this.setMusicState(StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.MUSIC) == 1);
        this.setShakeState(StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.VIBRATE) == 1);
        
        WebBridge.displayBannerInCommon();
    },

    onDisable()
    {
        GameMgr.pauseGame = false;
    },

    hide()
    {
        cc.tween(this.node).to(0.12,{opacity : 0}).call( () =>
        {
            UIHelper.hideUI(this.node.name);
        }).start();
    },

    restartAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if (GameMgr.isGameEnd()) {
                HintHelper.displayHint("game is over,please close setting")
            return;
        }

        if(!Observer.fireInterval("game",300)) return;

        
        WebBridge.displayFullInCommon(false,60, () =>
        {
            if (!cc.isValid(this)) return;

            if (GameMgr.isGameEnd())
            {
                HintHelper.displayHint("game is over,please close setting")
                this.hideUI();
                return;
            }
            
            ItemMgr.setItemCount(ITEM_TYPE.STREAK, 0, true);

            SceneHelper.fromType = SceneHelper.FROM_TYPE.GAME_AGAIN;

            Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
            Observer.fire(Observer.EVENT_NAME.REFRESH_STREAK);

            this.hide();

            UIHelper.displayUI("UISecond", null, true, true, (page) =>
            {
                page.getComponent("UISecond").data = {
                    isAgain : true,
                }
            })
        })
        
    },

    homeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if (GameMgr.isGameEnd()) return;

        if (!Observer.fireInterval("click", 600)) return;

        // WebBridge.displayFullInCommon(false, () =>
        // {
        //     SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
        // })

        SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
        
        this.hide();
        
        // UIHelper.displayUI("UISecond", null, true, true, (page) =>
        // {
        //     page.getComponent("UISecond").data = {
        //         isAgain : false,
        //     }
        // })
    },

    closeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        if(!Observer.fireInterval("click",600)) return;

        this.hide();
    },

    audioAction()
    {
        let state = StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.AUDIO);
        state = state == 1 ? 0 : 1;
        StorageHelper.saveItem(StorageHelper.STORAGE_PROPERTY.AUDIO,state,true);

        this.setAudioState(state == 1);

        AudioHelper.setAudioState(state == 1);
        
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
    },

    setAudioState(bool)
    {
        this.audioNode.children[0].active = !bool;
        this.audioNode.children[1].active = bool;
    },

    musicAction()
    {
        let state = StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.MUSIC);
        state = state == 1 ? 0 : 1;
        StorageHelper.saveItem(StorageHelper.STORAGE_PROPERTY.MUSIC,state,true);

        this.setMusicState(state == 1);

        AudioHelper.setMusicState(state == 1,true);
        
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
    },

    setMusicState(bool)
    {
        this.musicNode.children[0].active = !bool;
        this.musicNode.children[1].active = bool;
    },

    shakeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        let state = StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.VIBRATE);
        state = state == 1 ? 0 : 1;
        
        StorageHelper.saveItem(StorageHelper.STORAGE_PROPERTY.VIBRATE,state,true);
        
        GameParamsHelper.couldShake = state == 1;
        this.setShakeState(state == 1);
    },

    setShakeState(bool)
    {
        this.vibrateNode.children[0].active = !bool;
        this.vibrateNode.children[1].active = bool;
    },

    inviteAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("click",500)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

    },

    contactAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("click",500)) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);
    }
});
