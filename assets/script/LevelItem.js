/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-07 22:51:50
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-12-16 12:22:52
 * @FilePath: \WaterSort\assets\script\LevelItem.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const SSDScript = require("./SSDScript");
cc.Class({
    extends: SSDScript,

    properties: {
        
        levelLabel: cc.Label,
        
        line : cc.Node,
        yesterday : cc.Node,
        today : cc.Node,
        tomorrow : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setData()
    {
        this.levelLabel.string = this.data.level;

        let _yes = this.data.level < ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        let _tod = this.data.level == ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        let _tom = this.data.level > ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        this.yesterday.active = _yes;
        this.today.active = _tod;
        this.tomorrow.active = _tom;

        this.levelLabel.node.y = _yes ? 20 : 9;
        this.line.opacity = this.data.level < this.data.topLevel ? 255 : 0;
    },

    setCompleteState()
    {

    },
});
