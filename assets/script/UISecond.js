/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-17 17:51:06
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-07 16:39:32
 * @FilePath: \WaterSort\assets\script\UISecond.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
        
        btnNode: cc.Node,
        
        closeNode: cc.Node,
        descLabel : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setData()
    {
        this.btnNode.active = !this.data.isAgain;
        this.closeNode.active = !this.data.isAgain;
        this.content.height = this.data.isAgain ? 530 : 664;

        this.descLabel.string = "You will lose your \nwin streak!"
        if (this.data.isAgain)
        {
            this.descLabel.string = "Restart a winning \nstreak"
            
            this.scheduleOnce(() =>
            {
                GameMgr.clearBoard();

                this.close2();
            },2)
        }
    },

    againAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        GameMgr.clearBoard();

        SceneHelper.fromType = SceneHelper.FROM_TYPE.GAME_AGAIN;

        Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
        this.close2();
    },
    
    homeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if(!Observer.fireInterval("settlement",500)) return;

        SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME, true);
        this.close2();
    },

    continueAction()
    {
        
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);

        if (!Observer.fireInterval("settlement", 500)) return;
        
        this.close2();
    }
});
