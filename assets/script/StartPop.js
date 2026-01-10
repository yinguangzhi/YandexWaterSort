/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-07 22:51:50
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-12-26 20:35:10
 * @FilePath: \WaterSort\assets\script\StartPop.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const SSDScript = require("./SSDScript");
cc.Class({
    extends: SSDScript,

    properties: {
        levelLabel : cc.Label,
        streakLabel : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.setData();
    },

    // update (dt) {},
    setData()
    {
        this.streakLabel.string = 'x' + ItemMgr.getItemCount(ITEM_TYPE.STREAK);
        this.levelLabel.string = ItemMgr.getLevel();
    },

    display()
    {
        this.node.active = true;
        this.node.opacity = 100;
        this.node.scale = 0;

        cc.tween(this.node)
            .to(0.3,{scale : 1,opacity : 255})
            .delay(0.6)
            .to(0.2,{opacity : 0})
            .call(() =>
            {
                this.node.active = false;
            })
            .start();
    },
});
