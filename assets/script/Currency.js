// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");

cc.Class({
    extends: cc.Component,

    properties: {
       

        currencyLabel: cc.Label,
        currencyImage : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateCurrency();
    },

    start () {
    },

    // update (dt) {},
    updateCurrency()
    {
        if (!cc.isValid(this)) return;
        if (!cc.isValid(this.currencyLabel)) return;
        this.currencyLabel.string = ItemMgr.getItemCount(ITEM_TYPE.COIN);
    },
});
