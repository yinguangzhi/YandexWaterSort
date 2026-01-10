/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-02-11 10:11:37
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-10 00:24:37
 * @FilePath: \WaterSort\assets\script\CoinPop.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ImageMgr = require("./ImageMgr");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const UIBase = require("./UIBase");
const WebBridge = require("./WebBridge");

cc.Class({
    extends: UIBase,

    properties: {
        
        freeItem: cc.Node,
        layout: cc.Node,
        prefab : cc.Node,
        pf: cc.Node,
        items : [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        Observer.registerMass(Observer.EVENT_NAME.REFRESH_AD_REWARD, this.refreshInfo, this);
        
        this.setData();
    },

    // update (dt) {},

    setData() {

        let freeRewardConfig = {type : 0,quantity : 100,progress : 0}

        let adRewardConfigs =
            [
                {type : 1,quantity : 600,progress : 1},
                {type : 1,quantity : 1200,progress : 2},
                {type : 1,quantity : 1800,progress : 3},
                {type : 1,quantity : 3000,progress : 4},
            ]

        this.freeItem.getComponent("RewardItem").data = freeRewardConfig;

        for(let i = 0;i < adRewardConfigs.length;i++)
        {
            let _cg = adRewardConfigs[i];
            let obj = cc.instantiate(this.prefab);
            obj.parent = this.layout;
            obj.active = true;

            obj.getComponent("RewardItem").data = _cg;
            
            this.items.push(obj);

        }

        this.refreshInfo();
    },

    refreshInfo()
    {
        let _ps = ItemMgr.getItemCount(ITEM_TYPE.REWARD_PROGRESS);
        console.log(_ps);
  
        this.pf.height = Math.abs(this.items[_ps - 1].y);
        if (_ps == 4) this.pf.height = 503;
    },
    
    adAction()
    {
        if (!Observer.fireInterval("prop", 200)) return;
        
        WebBridge.displayVideoInCommon(true, (state) =>
        {
            if (!state) return;

            // ItemMgr.addItemCount(_tp, _number, true);
            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);

            if (!cc.isValid(this))
            {
                return;
            }
        })
        
    }
});
