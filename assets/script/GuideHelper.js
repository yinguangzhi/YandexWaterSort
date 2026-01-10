/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-12-03 13:34:37
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-21 16:06:07
 * @FilePath: \Decompression\assets\script\GuideHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const StorageHelper = require("./StorageHelper");


module.exports =
{
    inGuiding: false,
    inStepGuiding: false,
    
    gTarget1: null,
    gTarget2: null,
    
    guideMaxStep : 2,
    guideStep: -1,
    unlockPropNode : null,
    
    handNode : null,
    setHand(_hand)
    { 
        this.handNode = _hand;
        this.displayHandAnima(0);
    },

    setUnlockProp(_unlockNode) {
        
        this.unlockPropNode = _unlockNode;
    },
    
    isInGuidingByStep(_step)
    { 
        return ItemMgr.getItemCount(ITEM_TYPE.GUIDE) == _step;
    },

    setGuideByStep(_step)
    {
        console.log("set guide : ", _step);
        this.guideStep = _step;
        if(_step == 0)
        {
            GameMgr.sortPipes();
            this.setGuideTarget1(GameMgr.pipeList[1].node, true);
            this.setGuideTarget2(GameMgr.pipeList[2].node);
            this.displayHandAnima(1);
        }
        else if (_step == 1)
        {
            this.setGuideTarget1(GameMgr.pipeList[0].node, true);
            this.setGuideTarget2(GameMgr.pipeList[1].node);
            this.displayHandAnima(1);
        }
        else if (_step == 2)
        {
            this.setGuideTarget1(GameMgr.pipeList[2].node, true);
            this.setGuideTarget2(GameMgr.pipeList[0].node);
            this.displayHandAnima(1);
        }
        else if (_step == 3)
        {
            this.setGuideTarget1(this.unlockPropNode, true);
            this.setGuideTarget2(null);
            this.displayHandAnima(1);
        }
        else if (_step == 4)
        {
            this.setGuideTarget1(GameMgr.pipeList[2].node, true);
            this.setGuideTarget2(GameMgr.pipeList[3].node);
            this.displayHandAnima(1);
        }
    },
    
    resetGuide(_guiding)
    { 
        this.guideStep = -1;
        this.inGuiding = _guiding;
        this.inStepGuiding = false;
    },
    
    addStep()
    { 
        this.guideStep++;
        return this.guideStep < this.guideMaxStep; 
    },
    
    completeGuide()
    { 
        this.inGuiding = false;
        this.inStepGuiding = false;
        ItemMgr.setItemCount(ITEM_TYPE.GUIDE, 100,false);
        ItemMgr.saveData();
    },

    checkGuideStep(_step)
    {
        return ItemMgr.getItemCount(ITEM_TYPE.GUIDE) == _step;
    },

    completeGuideStep(_step)
    {
        if (!this.inGuiding) return;
        if (!this.inStepGuiding) return;

        console.log("complete step guide : ", ItemMgr.getItemCount(ITEM_TYPE.GUIDE));
        ItemMgr.addItemCount(ITEM_TYPE.GUIDE, 1,true);
        this.gTarget1 = null;
        this.gTarget2 = null;
        this.inStepGuiding = false;
    },

    setGuideTarget1(_tar1,_begin)
    {
        this.gTarget1 = _tar1;
        
        if (_begin)
        {
            this.inGuiding = true;
            this.inStepGuiding = true;
        }

    },

    setGuideTarget2(_tar2)
    {
        this.gTarget2 = _tar2;
    },
    
    isRightGuide1(_note)
    {
        if (!this.inGuiding) return false;
        if (!this.inStepGuiding) return false;
        
        if (this.gTarget1 == _note)
        {
            return true;
        }
        return false;
    },
    isRightGuide2(_note)
    {
        if (!this.inGuiding) return false;
        if (!this.inStepGuiding) return false;
        
        if (this.gTarget2 == _note)
        {
            return true;
        }
        return false;
    },

    isWrongGuide1(_note)
    {
        if (!this.inGuiding) return false;
        if (!this.inStepGuiding) return false;
        
        if (this.gTarget1 != _note)
        {
            return true;
        }
        return false;
    },
    isWrongGuide2(_note)
    {
        if (!this.inGuiding) return false;
        if (!this.inStepGuiding) return false;
        
        if (this.gTarget2 != _note)
        {
            return true;
        }
        return false;
    },

    displayHandAnima(_state)
    {
        this.handNode.stopAllActions();
        if (_state == 1)
        {
            let _pos2 = CocosHelper.convertPos(this.gTarget1.parent, this.handNode.parent, this.gTarget1.position);
         
            // console.log(_pos2, "  ", this.gTarget1.position, this.handNode.position);
            this.handNode.scale = 1;
            this.handNode.position = _pos2;
            this.handNode.y += (this.gTarget1 == this.unlockPropNode ? 0 : 160);
            this.handNode.opacity = 0;

            cc.tween(this.handNode)
                .repeatForever(
                    cc.tween(this.handNode)
                        .to(0.5, { scale: 0.86,opacity : 255 })
                        .delay(0.2)
                        .to(0.5, { scale: 1 })
                        .delay(0.2)
                )
                .start();
        }
        else if (_state == 2)
        {
            this.handNode.scale = 1;
            this.handNode.position = this.gTarget2.position;
            this.handNode.y += 160;
            this.handNode.opacity = 0;

            cc.tween(this.handNode)
                .repeatForever(
                    cc.tween(this.handNode)
                        .to(0.5, { scale: 0.86,opacity : 255  })
                        .delay(0.2)
                        .to(0.5, { scale: 1 })
                        .delay(0.2)
                )
                .start();
        }
        else if (_state == 0)
        {
            this.handNode.scale = 0;
            this.handNode.opacity = 0;
        }
    },
    
}
    

