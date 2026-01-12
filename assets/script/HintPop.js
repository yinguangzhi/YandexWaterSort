// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");
const { ITEM_TYPE, HINT_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ImageMgr = require("./ImageMgr");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const UIBase = require("./UIBase");
const WebBridge = require("./WebBridge");

cc.Class({
    extends: UIBase,

    properties: {
        cacheNode : cc.Node,
        generateNode : cc.Node,
        specialColorNode : cc.Node,
        descLabel: cc.Label,
        titleLabel : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setData()
    {
        this.cacheNode.active = this.data.type == HINT_TYPE.CACHE;
        this.generateNode.active = this.data.type == HINT_TYPE.GENERATOR;
        this.specialColorNode.active = this.data.type == HINT_TYPE.SPECIAL_COLOR;
        this.descLabel.string = this.data.desc;
        this.titleLabel.string = this.data.title;
    },
});
