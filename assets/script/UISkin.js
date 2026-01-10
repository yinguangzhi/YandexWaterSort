/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-03-17 23:15:01
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-19 23:30:13
 * @FilePath: \WaterSort\assets\script\UISkin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const UIBase = require("./UIBase");
const MissionMgr = require("./MissionMgr");
const PoolHelper = require("./PoolHelper");
const TimerHelper = require("./TimerHelper");
const EffectHelper = require("./EffectHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const JsonConfig = require("./JsonConfig");

cc.Class({
    extends: UIBase,

    properties: {
        
        prefab: cc.Node,
        layout: cc.Node,
        
        items: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        
        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        
        this.prefab.active = false;

        for (let i = 0; i < JsonConfig.skinConfigs.length; i++) {
            let config = JsonConfig.skinConfigs[i];
            let obj = PoolHelper.cloneItem(this.prefab, this.layout, cc.v2(), 1, 0, true, this.items);
            // console.log(config);
            obj.getComponent("SkinItem").data = config;
        }

    },

    // update (dt) {},
});
