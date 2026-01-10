// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const SceneHelper = require("./SceneHelper");
const UIBase = require("./UIBase");
cc.Class({
    extends: UIBase,

    properties: {
        
        levelItem : cc.Node,
        layout : cc.Node,

        /** 最多展示的关卡数量 */
        maxDisplayLevelCount: 20,

        /** 展示的最小关卡和当前关卡的差值 */
        offsetBetweenCurrLevel: 2,
        
        maxDisplayLevel : 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.maxDisplayLevelCount = 20;
        this.offsetBetweenCurrLevel = 2;

        this.levelItem.active = false;
    },

    start () {

        let _cnt = this.maxDisplayLevelCount;
        
        let level = ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        // level = 5;
        let lastLevel = level - 1;

        let _startLevel = level - this.offsetBetweenCurrLevel;
        if (_startLevel < 1) _startLevel = 1;
        this.maxDisplayLevel = _startLevel + this.maxDisplayLevelCount - 1;

        let _fLI = null;
        let _tLI = null;

        for(let i = 0;i < _cnt;i++)
        {
            let _cl = _startLevel + i;
            let _obj = cc.instantiate(this.levelItem);
            _obj.parent = this.layout;
            _obj.active = true;
            _obj.getComponent('LevelItem').data = {
                level: _cl,
                topLevel : this.maxDisplayLevel,
            };
        
            if(_cl == lastLevel)
            {
                _fLI = _obj;
            }
            else if(_cl == level)
            {
                _tLI = _obj;
            }
        }

        if(SceneHelper.fromType == SceneHelper.FROM_TYPE.GAME_SUCCESS)
        {
            //成功
            if(_fLI && _tLI)
            {

            }
        }
        else if(SceneHelper.fromType == SceneHelper.FROM_TYPE.GAME_FAIL)
        {
            //失败
            if(_tLI)
            {

            }
        }

        // _startLevel = 6;
        if(_startLevel >= 6)
        {
            this.scheduleOnce(() =>
            {
                this.layout.y -= 160;
            },0)
        }
    },

    // update (dt) {},
});
