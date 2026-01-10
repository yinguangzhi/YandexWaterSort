/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-09-12 20:53:31
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2023-09-12 23:13:14
 * @FilePath: \Block\assets\script\AspectUnit2.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");

var ASPECT_DIR = cc.Enum({
	    TOP: 1,
	    BOTTOM: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        dir: ASPECT_DIR.BOTTOM,
        minP: 0,
        maxP : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let realSize = CocosHelper.getRealSize();
        let deltaY = realSize.height - 1280;
        
        if (deltaY < 0) deltaY = 0;
        
        let rate = deltaY / 300;

        let _value = this.minP + rate * (this.maxP - this.minP);
        if (this.dir == ASPECT_DIR.TOP)
        {
            if (_value < this.maxP) _value = this.maxP;    
        }
        else if (this.dir == ASPECT_DIR.BOTTOM)
        {
            if (_value > this.maxP) _value = this.maxP;    
        }
        
        this.node.y = _value;
    },

    // update (dt) {},
});
