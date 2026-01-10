/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-03-15 10:55:28
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-19 23:30:03
 * @FilePath: \WaterSort\assets\script\UIMission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const UIBase = require("./UIBase");
const MissionMgr = require("./MissionMgr");
const PoolHelper = require("./PoolHelper");
const TimerHelper = require("./TimerHelper");
const EffectHelper = require("./EffectHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");

cc.Class({
    extends: UIBase,

    properties: {
        prefab: cc.Node,
        layout: cc.Node,
        timeLabel: cc.Label,
        pf: cc.Sprite,
        starCollect: cc.Node,

        rewardItems: [cc.Node],

        items: [cc.Node],

        refreshedCurrency : false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        
        let rewardProgress = MissionMgr.getMissionRewardProgress();

        this.pf.node.width = 512 * rewardProgress.percent;
        this.timeLabel.string = TimerHelper.secondToDH(TimerHelper.getLeaveTimeInWeek());
        
        console.log(JSON.stringify(rewardProgress));

        let arr = MissionMgr.getCurrMissionList();

        for (let i = 0; i < arr.length; i++) {
            let config = arr[i];
            let obj = PoolHelper.cloneItem(this.prefab, this.layout, cc.v2(), 1, 0, true, this.items);
            obj.getComponent("MissionItem").data = config;
        }

        let _pfLeftX = -256;
        let _pfLength = 512;
        for (let i = 0; i < this.rewardItems.length; i++) {
            let _rs = MissionMgr.missionRewardConfigs[i];
            let _rewardItem = this.rewardItems[i];

            _rewardItem.x = -_pfLength * 0.5 + _rs.percent * _pfLength;
            if (i == this.rewardItems.length - 1) _rewardItem.x -= 42;

            let _rBox = _rewardItem.getChildByName("box");

            let _rewarded = rewardProgress.receivedRewards.indexOf(_rs.id) != -1;
            _rBox.children[0].active = !_rewarded;
            _rBox.children[1].active = _rewarded;

            let _valueInfo = _rewardItem.getChildByName("valueInfo")
            _valueInfo.getChildByName("value").getComponent(cc.Label).string = _rs.cost;
        }
    },

    // update (dt) {},

    onDestroy()
    {
        if (!this.refreshedCurrency)
        {
            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        }
    },

    claim(_item, _star, _starNode) {

        let _rewardedItems = [];
        let _missionRewardProgress = MissionMgr.getMissionRewardProgress();
        let _canRewards = _missionRewardProgress.canRewards;

        if (_canRewards.length != 0)
        {
            for (let i = 0; i < _canRewards.length; i++) {
                let _config = _canRewards[i];

                MissionMgr.claimMissionReward(_config.id);
                _rewardedItems.push(this.rewardItems[_config.id - 1]);
            }
        }

        EffectHelper.displayPropFly(ITEM_TYPE.MISSION_STAR, 5, _starNode, this.starCollect, cc.v2(), 0, () => {
            
            if (!cc.isValid(this)) return;

            cc.tween(this.pf.node)
                .to(0.3, { width: _missionRewardProgress.percent * 512 })
                .call(() => {

                    if (!cc.isValid(this)) return;
                    
                    for (let i = 0; i < _rewardedItems.length; i++) {
                        let _box = _rewardedItems[i];
                        let _rBox = _box.getChildByName("box");
                        _rBox.children[0].active = false;
                        _rBox.children[1].active = true;

                        let _idx = _canRewards[i].id - 1;
                        EffectHelper.displayCoinFly(6, _rBox, null, cc.v2(), 0, () =>
                        {
                            if (cc.isValid(this))
                            {
                                this.refreshedCurrency = true;
                            }
                            
                            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
                        })
                    }

                    if (cc.isValid(_item)) _item.refreshNext();
                })
                .start();
        });
    },
});
