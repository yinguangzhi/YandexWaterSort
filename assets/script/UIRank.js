/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-01-14 20:30:33
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-17 19:01:53
 * @FilePath: \WaterSort\assets\script\UIRank.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const GameParamsHelper = require("./GameParamsHelper");
const TimerHelper = require("./TimerHelper");
const { log } = require("console");
const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const UIBase = require("./UIBase");
const WebBridge = require("./WebBridge");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const HintHelper = require("./HintHelper");
const RankHelper = require("./RankHelper");

cc.Class({
    extends: UIBase,

    properties: {
        rankPrefab: cc.Node,
        layout : cc.Node,
        self: cc.Node,
        
        items : [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad()
    {
        this.generateLayout(false)
    },

    generateLayout(_friend) {
        
        let _self = RankHelper.getPlayerRank();
        _self.rank = _friend ? 1 : _self.rank;

        let _array = _friend ? [_self] : RankHelper.rankData.concat();

        if (!_friend)
        {
            if (_self.rank <= _array[_array.length - 1].rank)
            {
                _array.push(_self);
            
                _array.sort((a, b) =>
                {
                    return a.rank - b.rank;
                })
            }
        }

        console.log(_array);

        for (let i = 0; i < this.items.length; i++)
        {
            this.items[i].active = false;
        }
        
        for (let i = 0; i < _array.length; i++)
        {
            _array[i].rank = i + 1;
            
            let obj = null;
            if (this.items.length > i) {
                obj = this.items[i];
            }
            else {
                obj = cc.instantiate(this.rankPrefab);
                this.items.push(obj);
            }

            obj.parent = this.layout;
            obj.active = true;

            obj.getComponent("RankItem").data = _array[i];
        }

        this.self.active = !_friend;
        this.rankPrefab.getComponent("RankItem").data = _self;
    },

    // update (dt) {},

    friendAction()
    { 

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
            
        // if (!Observer.fireInterval("rank", 500)) return;
        
        this.generateLayout(true);
    },
    
    worldAction()
    {
        

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
            
        // if (!Observer.fireInterval("rank", 500)) return;
        
        this.generateLayout(false);
    },
});
