
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
cc.Class({
    extends: SSDScript,

    properties: {
        
        icon: cc.Sprite ,

        
        numberLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    setData() {
        this.icon.spriteFrame = this.data.frame;
        // this.icon.node.scale = v3(0.6, 0.6, 0.6);
        this.numberLabel.string = 'x' + this.data.number;
    },

    getPos()
    {
        return cc.v2(0,this.numberLabel.node.y + 20);
    }
});
