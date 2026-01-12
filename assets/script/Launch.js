/*
 * @Author: shaoshude 2797275476@qq.com
 * @Date: 2023-02-04 20:11:11
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-09 23:34:07
 * @FilePath: \Block\assets\script\Initializer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var StorageHelper = require("./StorageHelper");
var PlatformTool = require("./PlatformTool");
const AudioHelper = require("./AudioHelper");
const GameParamsHelper = require("./GameParamsHelper");
const Observer = require("./Observer");
const HHAssetPreLoader = require("./HHAssetPreLoader");
const PathHelper = require("./PathHelper");
const CocosLoader = require("./CocosLoader");
const SceneHelper = require("./SceneHelper");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const { ITEM_TYPE } = require("./EnumHelper");
const WebBridge = require("./WebBridge");
const RankHelper = require("./RankHelper");
const PoolHelper = require("./PoolHelper");
const { default: i18nMgr } = require("./i18n/i18nMgr");
// cc.dynamicAtlasManager.maxFrameSize = 1024;

    
cc.Class({
    extends: cc.Component,

    properties: {
        loadCnt: 0,

        circleLoading : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad()
    {
        this.loadCnt = 0;
    },

    start()
    {
        //临时的
        // for (let i = 0; i < 100; i++)
        // {
        //     console.log(GameMgr.reCalcLevel(i));
        // }

        PlatformTool.init();
        i18nMgr.ins.setLanguage(PlatformTool.lang);

        RankHelper.generateRankList();

        StorageHelper.readBoardData();
        StorageHelper.readUserDataFromPlatform( () =>
        {
            GameParamsHelper.couldShake = StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.VIBRATE) == 1;
            AudioHelper.setAudioState(StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.AUDIO) == 1);
            AudioHelper.setMusicState(StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.MUSIC) == 1);

            PlatformTool.initPlayer();

            setTimeout(() => {
                PlatformTool.initVideoADBefore(true);
            }, 10000);
            

            setTimeout(() => {
                WebBridge.displayBannerInCommon();
            }, 5000);

            
            this.realEnterScene();

            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        });
    },

    
    realEnterScene()
    {
        this.loadCnt ++;
        if(this.loadCnt >= 1)
        {
            let _guide = StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.GUIDE);
            if (_guide == 0 && ItemMgr.getLevel() == 1)
            {
                // let _hc = ItemMgr.getItemCount(ITEM_TYPE.PROP_HINT);
                // let _hu = ItemMgr.getItemCount(ITEM_TYPE.PROP_UNDO);
                // let _huk = ItemMgr.getItemCount(ITEM_TYPE.PROP_UNLOCK);
                ItemMgr.setItemCount(ITEM_TYPE.PROP_HINT, 1, false);
                ItemMgr.setItemCount(ITEM_TYPE.PROP_UNDO, 1, false);
                ItemMgr.setItemCount(ITEM_TYPE.PROP_UNLOCK, 1, false);
            
                SceneHelper.translateScene(SceneHelper.SCENE_NAME.GAME);
            }
            else
            {
                SceneHelper.translateScene(SceneHelper.SCENE_NAME.HOME);
            }
            
        }

        CocosLoader.loadAssetAsync("prefab/UILoading", cc.Prefab, null, 0);
        CocosLoader.loadAssetAsync("prefab/UIHint", cc.Prefab, null, 0);
        CocosLoader.loadAssetAsync("prefab/Coin", cc.Prefab, null, 0).then((asset) =>
        {
            // console.log(asset);
            PoolHelper.register(PoolHelper.POOL_NAME.coin, asset);
        })
    },
});
