/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-10 19:19:55
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-12-14 16:07:34
 * @FilePath: \WaterSort\assets\script\levelEdit\EditPipe.js
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

        blockPrefab: cc.Node,
    
        layout : cc.Node,
        length: 0,

        color :0,
        type : 1,
        blocks : [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        TouchHelper.bindTouch(this.touch,
        () =>
        {
            LevelEditMgr.selectBlock = null;
            LevelEditMgr.selectPipe = this;
            LevelEditMgr.levelEditCtl.selectPipeAction();
            
        },
            (event) => {
                
                if (event.touch.getDelta().mag() < 2) return;

                this.node.x += event.touch.getDelta().x;
                this.node.y += event.touch.getDelta().y;
                LevelEditMgr.levelEditCtl.refreshSelectPos(this.node);
            },
            
        () => { });
    },

    // update (dt) {},

    setData(_type,_bms)
    {
        this.color = 0;
        this.type = _type;

        for (let i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].active = false;
        }
        
        let _length = _bms.length;
        this.length = _length;

        for (let i = 0; i < _length; i++)
        {
            
            let obj = null;
            if (i < this.blocks.length) obj = this.blocks[i]
            else
            {
                obj = cc.instantiate(this.blockPrefab);
                this.blocks.push(obj);
            }
            
            obj.parent = this.layout;
            obj.active = true;
            obj.getComponent("EditBlock").setData(_bms[i]);
        }

        this.node.width = GameMgr.cellWidth;
        this.node.height = GameMgr.getPipeHeight(this.length);
    },

    setColor(_color,_cImage)
    {
        this.color = _color;
    },

    selectAction()
    {

    },
});
