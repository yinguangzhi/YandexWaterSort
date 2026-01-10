/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-11 10:50:55
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-12-14 21:12:25
 * @FilePath: \WaterSort\assets\script\levelEdit\EditBlock.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const GameMgr = require("../GameMgr");
const TouchHelper = require("../TouchHelper");
const LevelEditMgr = require("./LevelEditMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        touch: cc.Node,
        cellBG: cc.Node,
        image : cc.Sprite,
        maskNode : cc.Node,
        lockNode: cc.Node,
        isLock: false,
        isMask : false,
        color :0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        TouchHelper.bindTouch(this.touch,
        () =>
        {
            LevelEditMgr.selectPipe = null;
            LevelEditMgr.selectBlock = this;
            LevelEditMgr.levelEditCtl.selectBlockAction();
        },
        () => {},
        () => { });
    },

    // update (dt) {},

    setData(_bm)
    {
        this.setColor(_bm.color);
        this.setMask(_bm.mask == 1);
        this.setLock(_bm.lock == 1);
    },

    selectAction()
    {
        
    },
    
    setColor(_color,_cImage)
    { 
        this.color = _color;
        
        this.image.spriteFrame = GameMgr.getFrame(_color);
    },
    
    setMask(_state)
    {
        this.isMask = _state;
        this.maskNode.active = _state;
    },

    setLock(_state)
    {
        this.isLock = _state;
        this.lockNode.active = _state;
    },
    
});
