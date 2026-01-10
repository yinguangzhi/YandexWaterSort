/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-10 00:27:48
 * @FilePath: \WaterSort\assets\script\CommonCurrency.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const EffectHelper = require("./EffectHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const SSDScript = require("./SSDScript");
const StorageHelper = require("./StorageHelper");
const UIHelper = require("./UIHelper");
cc.Class({
    extends: SSDScript,

    properties: {
        setCollect: false,
        collectNode : cc.Node,
        coinLabel : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.setCollect) EffectHelper.setCurrency(this);
        else
        {
            if (!EffectHelper.isCurrencyValid())
            {
                EffectHelper.setCurrency(this);
            }
        }
        
        Observer.registerMass(Observer.EVENT_NAME.REFRESH_CURRENCY, this.refreshCurrency, this);
    },

    onDestroy()
    {
        Observer.removeMassChild(Observer.EVENT_NAME.REFRESH_CURRENCY, this);
    },

    // update (dt) {},

    refreshCurrency()
    {
        let cnt = ItemMgr.getItemCount(ITEM_TYPE.COIN);
        this.coinLabel.string = cnt; 
    },

    displayAnima()
    {
        if (!this.collectNode) return;

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.COLLECT_COIN);
        
        this.collectNode.stopAllActions();
        this.collectNode.scale = 1;
        cc.tween(this.collectNode)
            .to(0.12, { scale: 1.2 })
            .to(0.09, { scale: 1 })
            .start();
    },

    getCoinNode()
    {
        return this.collectNode;
    },

    addAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
            
        if (!Observer.fireInterval("prop", 200)) return;
        
        UIHelper.displayUI("UICoinPop", null, true, true, null);
        
    }
});
