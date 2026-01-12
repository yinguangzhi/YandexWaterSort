/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-02-11 22:12:18
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-11 23:40:29
 * @FilePath: \WaterSort\assets\script\RewardItem.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const GameParamsHelper = require("./GameParamsHelper");
const TimerHelper = require("./TimerHelper");
const { log } = require("console");
const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const SSDScript = require("./SSDScript");
const WebBridge = require("./WebBridge");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const HintHelper = require("./HintHelper");
const ColorHelper = require("./ColorHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const EffectHelper = require("./EffectHelper");

cc.Class({
    extends: SSDScript,

    properties: {
        freeNode : cc.Node,
        adNode : cc.Node,
        lockNode : cc.Node,
        claimedNode : cc.Node,
        selectTip : cc.Node,
        image : cc.Sprite,
        rewardLabel : cc.Label,
        frames2 : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Observer.registerMass(Observer.EVENT_NAME.REFRESH_AD_REWARD, this.refreshInfo, this);
    },


    setData() {
        this.refreshInfo();
    },

    refreshInfo()
    {
        this.rewardLabel.string = 'x' + this.data.quantity;

        let _freed = ItemMgr.getItemCount(ITEM_TYPE.FREE_REWARD) == 1;
        let _ps = ItemMgr.getItemCount(ITEM_TYPE.REWARD_PROGRESS);
        let _isThis = this.data.progress == _ps;
        let _isFree = this.data.progress == 0;

        if(_isFree)
        {
            if(this.lockNode) this.lockNode.active = false;
            if(this.adNode) this.adNode.active = false;
            if(this.freeNode) this.freeNode.active = !_freed;
            if(this.claimedNode) this.claimedNode.active = _freed;
        }   
        else
        {
            if(this.lockNode) this.lockNode.active = this.data.progress > _ps;
            if(this.adNode) this.adNode.active = _isThis;
            if(this.freeNode) this.freeNode.active = false;
            if(this.claimedNode) this.claimedNode.active = this.data.progress < _ps;
        }
        if(this.selectTip) this.selectTip.active = this.data.progress == _ps && this.data.progress > 0;

        if(this.data.progress < this.frames2.length)this.image.spriteFrame = this.frames2[this.data.progress];
    },

    adAction()
    {
        if(!Observer.fireInterval("reward",200)) return;

        WebBridge.displayVideoInCommon(true,(state) =>
        {
            if(state && cc.isValid(this)) this.realClaim();
        })

    },
    
    freeAction()
    {
        if(!Observer.fireInterval("reward",200)) return;

        this.realClaim();
    },

    realClaim()
    {

        let _step = ItemMgr.getItemCount(ITEM_TYPE.REWARD_PROGRESS) + 1;
        if(_step > 4) _step = 1;

        if (this.data.progress == 0) ItemMgr.setItemCount(ITEM_TYPE.FREE_REWARD, 1);
        else ItemMgr.setItemCount(ITEM_TYPE.REWARD_PROGRESS, _step);
        
        ItemMgr.addItemCount(ITEM_TYPE.COIN, this.data.quantity,true);

        Observer.fireMass(Observer.EVENT_NAME.REFRESH_AD_REWARD);
        EffectHelper.displayCoinFly(10, this.claimedNode, null, cc.v2(), 0, () =>
        {
            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        })
    },
});
