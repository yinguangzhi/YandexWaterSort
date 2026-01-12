// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
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
cc.Class({
    extends: UIBase,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        UIHelper.hideUI("UIPause");
        
        PlatformTool.initFullADBefore(true);
        
        PlatformTool.initVideoADBefore(true);
        
                
        WebBridge.displayBannerInCommon();
        
        SceneHelper.fromType = SceneHelper.FROM_TYPE.GAME_FAIL;
        
        WebBridge.autoShortcutInCommon(true, null, null);
        
                
    },

    // update (dt) {},

    adAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500))
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
        
    
    againAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        SceneHelper.fromType = SceneHelper.FROM_TYPE.GAME_AGAIN;

        WebBridge.displayFullInCommon(false,0,() =>
        {
            Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
            this.close2();
        })
    },
    
    homeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME, true);
        this.close2();
    },
    
});
