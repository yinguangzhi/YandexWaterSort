// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

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

    },

    // update (dt) {},
    setData()
    {
        this.streakLabel.string = 'x0';
        this.levelLabel.string = 'Level ' + ItemMgr.getLevel();
    },

});
