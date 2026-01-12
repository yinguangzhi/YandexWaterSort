// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const LanguageJson = require("./LanguageJson");

cc.Class({
    extends: cc.Component,

    properties: {
        key : "",
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        label : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        LanguageJson.addi8L(this);
    },

    onEnable()
    {
        if(this.key == '') return;
        this.refreshLanguage();
    },

    start () {

    },

    onDestroy()
    {
        LanguageJson.removei8L(this);
    },

    // update (dt) {},

    refreshLanguage()
    {
        this.checkLabel();
        if(!this.label) return;

        this.label.string = LanguageJson.getValue(this.key)
    },

    checkLabel()
    {
        if(this.label) return;

        this.label = this.node.getComponent(cc.Label);
    }
});
