/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-15 09:54:15
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-09 18:44:10
 * @FilePath: \WaterSort\assets\script\GamePage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const HHAssetPreLoader = require("./HHAssetPreLoader");
const ImageMgr = require("./ImageMgr");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const SceneHelper = require("./SceneHelper");
const UIBase = require("./UIBase");
const UIHelper = require("./UIHelper");
const WebBridge = require("./WebBridge");

cc.Class({
    extends: UIBase,

    properties: {
        streakInfo: cc.Node,
        streakLabel : cc.Label,
        itemFrames : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        ImageMgr.setItemFrames(this.itemFrames, true);
    },

    start() {
        
        PlatformTool.initFullADBefore(true);
        
        Observer.register(Observer.EVENT_NAME.REFRESH_STREAK, this.refreshStreak, this);
        this.refreshStreak();

        SceneHelper.translateComplete();


        HHAssetPreLoader.addAsset("game", "audio/pipeComplete", cc.AudioClip, 2, null);
        HHAssetPreLoader.addAsset("game", "audio/again", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("game", "prefab/UIPause", cc.Prefab, 3, null);
        HHAssetPreLoader.addAsset("game", "prefab/UICoinPop", cc.Prefab, 3, null);
        HHAssetPreLoader.addAsset("game", "prefab/UISecond", cc.Prefab, 4, null);
        HHAssetPreLoader.addAsset("game", "audio/success", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("game", "audio/coin", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("game", "prefab/UISettlement", cc.Prefab, 5, null);
        HHAssetPreLoader.addAsset("game", "audio/unlock", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("game", "audio/unknown", cc.AudioClip, 3, null);
        HHAssetPreLoader.addAsset("game", "prefab/UIRevive", cc.Prefab, 6, null);
        HHAssetPreLoader.addAsset("game", "prefab/UIFail", cc.Prefab, 5, null);
        HHAssetPreLoader.addAsset("game", "prefab/UISuggest", cc.Prefab, 5, null);

        this.scheduleOnce(() =>
        {
            HHAssetPreLoader.beginPreLoad("game")
        },3)
    },

    // update (dt) {},

    againAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("game",500)) return;

        if (GameMgr.isGameEnd()) return;
        
        ItemMgr.setItemCount(ITEM_TYPE.STREAK, 0, true);
        this.refreshStreak();

        SceneHelper.fromType = SceneHelper.FROM_TYPE.GAME_AGAIN;

        Observer.fire(Observer.EVENT_NAME.GAME_RE_START);
    },

    settingAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("game",500)) return;

        if (GameMgr.isGameEnd()) return;

        UIHelper.displayUI("UIPause", null, true, true, null);
    },

    homeAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("game",500)) return;

        if (GameMgr.isGameEnd()) return;
        
        GameMgr.pauseGame = true;
        // WebBridge.displayFullInCommon(false, () =>
        // {
        //     SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
        // })
        SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
    },

    refreshStreak()
    {
        this.streakLabel.string = "Streak x" + ItemMgr.getItemCount(ITEM_TYPE.STREAK);
    },
});
