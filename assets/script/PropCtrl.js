/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-25 09:47:22
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-21 09:04:47
 * @FilePath: \WaterSort\assets\script\PropCtrl.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const GuideHelper = require("./GuideHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const UIBase = require("./UIBase");
const UIHelper = require("./UIHelper");

cc.Class({
    extends: UIBase,

    properties: {
        unlockProp: cc.Node,
        undoProp: cc.Node,
        hintProp: cc.Node,
        
        isPropMax: true,
        
        rewardPropNumber : 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        

        GuideHelper.setUnlockProp(this.unlockProp);

    },

    start() {

        this.rewardPropNumber = 2;

        Observer.register(Observer.EVENT_NAME.REFRESH_PROP,this.refreshProp,this);
        this.refreshProp();

        if (cc.sys.isBrowser && !PlatformTool.isFB) 
        {
            this.isPropMax = false;
            cc.log("it's editor mode");
        }

        if (PlatformTool.isFB)
        {
            this.isPropMax = false;
        }
    },

    // update (dt) {},

    refreshProp()
    {
        let unlockLabel = CocosHelper.getChildByPath(this.unlockProp,'num/number');
        let undoLabel = CocosHelper.getChildByPath(this.undoProp,'num/number')
        let hintLabel = CocosHelper.getChildByPath(this.hintProp, 'num/number')
        
        let unlockNum = CocosHelper.getChildByPath(this.unlockProp,'num');
        let undoNum = CocosHelper.getChildByPath(this.undoProp,'num')
        let hintNum = CocosHelper.getChildByPath(this.hintProp, 'num')
        
        let unlockAdd = CocosHelper.getChildByPath(this.unlockProp,'add');
        let undoAdd = CocosHelper.getChildByPath(this.undoProp,'add')
        let hintAdd = CocosHelper.getChildByPath(this.hintProp,'add')

        //解锁槽位道具
        let _unlockNum = ItemMgr.getItemCount(ITEM_TYPE.PROP_UNLOCK);
        unlockLabel.getComponent(cc.Label).string = _unlockNum;
        unlockAdd.opacity = _unlockNum > 0 ? 0 : 255;
        unlockNum.opacity = _unlockNum > 0 ? 255 : 0;
        
        let _cUnlock = GameMgr.leaveLockNumber > 0 && !GameMgr.isGameEnd()// && !GuideHelper.isWrongGuide1(this.unlockProp);
        this.unlockProp.opacity = _cUnlock ? 255 : 120;
        this.unlockProp.getComponent(cc.Button).interactable = _cUnlock;


        
        //返回道具
        let _undoNum = ItemMgr.getItemCount(ITEM_TYPE.PROP_UNDO);
        undoLabel.getComponent(cc.Label).string = _undoNum;
        undoAdd.opacity = _undoNum > 0 ? 0 : 255;
        undoNum.opacity = _undoNum > 0 ? 255 : 0;

        let _cUndo = GameMgr.leaveStepNumber() > 0 && !GameMgr.isGameEnd() && !GuideHelper.isWrongGuide1(this.hintProp);
        this.undoProp.opacity = _cUndo ? 255 : 120;
        this.undoProp.getComponent(cc.Button).interactable = _cUndo;

        
        //提示道具
        let _hintNum = ItemMgr.getItemCount(ITEM_TYPE.PROP_HINT);
        hintLabel.getComponent(cc.Label).string = _hintNum;
        hintAdd.opacity = _hintNum > 0 ? 0 : 255;
        hintNum.opacity = _hintNum > 0 ? 255 : 0;

        let _cHint = GameMgr.leaveMaskNumber() > 0 && !GameMgr.isGameEnd() && !GuideHelper.isWrongGuide1(this.hintProp);
        this.hintProp.opacity = _cHint ? 255 : 120;
        this.hintProp.getComponent(cc.Button).interactable = _cHint;
        
        this.hintProp.active = GameMgr.leaveMaskNumber() > 0;
    },

    unlockAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if (GameMgr.isGameEnd())
        {
            return;
        }



        if (!this.isPropMax)
        {
            if (ItemMgr.getItemCount(ITEM_TYPE.PROP_UNLOCK) <= 0)
            {
                UIHelper.displayUI("PropPop", null, true, true, (page) =>
                {
                    page.getComponent("UIBase").data = {
                        desc: "Obtain unlock items to help you pass the level",
                        number: this.rewardPropNumber,
                        price : 2000,
                        itemType : ITEM_TYPE.PROP_UNLOCK,
                    }
                })
                return;
            }
        }
        
        let _success = GameMgr.releaseOneLock();
        if(_success)
        {
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.UNLOCK)
            if (!this.isPropMax)
            {
                ItemMgr.addItemCount(ITEM_TYPE.PROP_UNLOCK, -1, true);
            }
            this.refreshProp();
            
            if (GuideHelper.isRightGuide1(this.unlockProp))
            {
                GuideHelper.displayHandAnima(0);
                
                GuideHelper.completeGuideStep();
                if (GuideHelper.checkGuideStep(4))
                {
                    GuideHelper.setGuideByStep(4);
                }
            }
        }
    },

    undoAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if (GameMgr.isGameEnd())
        {
            return;
        }

        if (!this.isPropMax)
        {
            if (ItemMgr.getItemCount(ITEM_TYPE.PROP_UNDO) <= 0)
            {
                UIHelper.displayUI("PropPop", null, true, true, (page) =>
                {
                    page.getComponent("UIBase").data = {
                        desc: "Obtain undo items to help you pass the level",
                        number: this.rewardPropNumber,
                        price : 1000,
                        itemType : ITEM_TYPE.PROP_UNDO,
                    }
                })
                return;
            }
        }

        let _success = GameMgr.undoStep();
        if(_success)
        {
            if (!this.isPropMax)
            {
                ItemMgr.addItemCount(ITEM_TYPE.PROP_UNDO, -1, true);
            }
            this.refreshProp();
        }
        
    },

    hintAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if (GameMgr.isGameEnd())
        {
            return;
        }

        if (!this.isPropMax)
        {
            if (ItemMgr.getItemCount(ITEM_TYPE.PROP_HINT) <= 0)
            {
                UIHelper.displayUI("PropPop", null, true, true, (page) =>
                {
                    page.getComponent("UIBase").data = {
                        desc: "Obtain hint items to help you pass the level",
                        number: this.rewardPropNumber,
                        price : 3000,
                        itemType : ITEM_TYPE.PROP_HINT,
                    }
                })
                return;
            }
        }

        let _success = GameMgr.hintAction();
        if(_success)
        {
            if (!this.isPropMax)
            {
                ItemMgr.addItemCount(ITEM_TYPE.PROP_HINT, -1, true);
            }
            this.refreshProp();
        }
    },
});
