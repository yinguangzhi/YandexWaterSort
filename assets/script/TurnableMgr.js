/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-02-17 08:53:49
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-10 21:30:31
 * @FilePath: \WaterSort\assets\script\TurnableMgr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Config = require("./Config");
const { ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");

module.exports = {
    angles : [
        0,
        45,
        90,
        135,
        180,
        225,
        270,
        315,
    ],
    
    turnableConfigs :
        [
            {type : ITEM_TYPE.COIN,number : 100,frame : null,probability : 20},
            {type : ITEM_TYPE.PROP_UNDO,number : 1,frame : null,probability : 5},
            {type : ITEM_TYPE.COIN,number : 500,frame : null,probability : 20},
            {type : ITEM_TYPE.COIN,number : 1000,frame : null,probability : 10},
            {type : ITEM_TYPE.PROP_UNLOCK,number : 1,frame : null,probability : 5},
            {type : ITEM_TYPE.COIN,number : 600,frame : null,probability : 20},
            {type : ITEM_TYPE.PROP_HINT,number : 1,frame : null,probability : 5},
            {type : ITEM_TYPE.COIN,number : 800,frame : null,probability : 15},
        ],
    
    realTurnable()
    {
        ItemMgr.addItemCount(ITEM_TYPE.TURNABLE_STAGE, 1, true);
    },
    
    
    getProgressInfo()
    {
        let _level = ItemMgr.getItemCount(ITEM_TYPE.LEVEL);
        let _stage = ItemMgr.getItemCount(ITEM_TYPE.TURNABLE_STAGE);

        let _targetLevel = (_stage + 1) * 5;
        let _startLevel = _stage * 5 + 1;

        let _deltaL = _level - _startLevel;
        if(_deltaL < 0) _deltaL = 0;
        // if (_deltaL > 5) _deltaL = 5;
        
        let _pTotal = 5;
        let _rate = _deltaL / _pTotal;
        _rate = Math.min(1, _rate);

        let _arg = {
            level: _level,
            stage: _stage,
            startLevel: _startLevel,
            targetLevel: _targetLevel,
            progressValue: _deltaL,
            progressTotal: _pTotal,
            progressRate: _rate,
            progressDesc: (_deltaL + '/' + _pTotal),
            can : _rate >= 1,
        }
        return _arg;
    },

    isForcePop : true,
    canForcePop()
    {
        let _pop = this.canPop() && this.isForcePop;
        
        return _pop;
    },

    canForceSuggest()
    {
        return false;
    },

    canPop()
    {
        let _info = this.getProgressInfo();
        return _info.can
    }
}