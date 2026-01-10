const { MISSION_TYPE, ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const StorageHelper = require("./StorageHelper");

module.exports = {
    missionConfigs: [
        {id : 1,desc : "Finish 10 Levels",type : MISSION_TYPE.LEVEL,cost : 10,reward : 10},
        {id : 2,desc : "Finish 20 Levels",type : MISSION_TYPE.LEVEL,cost : 20,reward : 10},
        {id : 3,desc : "Finish 40 Levels",type : MISSION_TYPE.LEVEL,cost : 40,reward : 20},
        {id : 4,desc : "Watch 5 Videos",type : MISSION_TYPE.AD,cost : 5,reward : 10},
        {id : 5,desc : "Watch 10 Videos",type : MISSION_TYPE.AD,cost : 10,reward : 10},
        {id : 6,desc : "Watch 20 Videos",type : MISSION_TYPE.AD,cost : 20,reward : 20},
        {id : 7,desc : "Login for one day",type : MISSION_TYPE.LOGIN,cost : 1,reward : 10},
        {id : 8,desc : "Login for 3 days",type : MISSION_TYPE.LOGIN,cost : 3,reward : 10},
    ],


    missionRewardConfigs: [
        {id : 1, cost: 30, reward : 1500,percent : 0.3},
        {id : 2, cost: 60, reward : 4000,percent : 0.6},
        {id : 3,cost: 100, reward : 10000,percent : 1},
    ],

    /** 做一项任务 */
    addMission(_type,_val,_save)
    {
        if (_type == MISSION_TYPE.LEVEL) ItemMgr.addItemCount(ITEM_TYPE.MISSION_LEVEL, _val,_save);
        else if (_type == MISSION_TYPE.AD) ItemMgr.addItemCount(ITEM_TYPE.MISSION_AD, _val,_save);
        else if (_type == MISSION_TYPE.LOGIN) ItemMgr.addItemCount(ITEM_TYPE.MISSION_LOGIN, _val,_save);
    },

    /** 任务是否已完成 */
    isMissionComplete(_id)
    {
        let _arr = this.getCompletes();
        return _arr.indexOf(_id) != -1;

    },

    getMissionProgress(_id)
    {
        let _config = this.getConfig(_id);

        let _arg = {
            can: false,
            claimed : false,
            percent: 0,
            percentDesc : "",
        }

        if (this.isMissionComplete(_id))
        {
            _arg.claimed = true;
            _arg.percent = 1;
            _arg.percentDesc = _config.cost + "/" + _config.cost;
            return _arg;
        }


        let _val = 0;
        if (_config.type == MISSION_TYPE.AD) _val = ItemMgr.getItemCount(ITEM_TYPE.MISSION_AD)
        else if (_config.type == MISSION_TYPE.LEVEL) _val = ItemMgr.getItemCount(ITEM_TYPE.MISSION_LEVEL)
        else if (_config.type == MISSION_TYPE.LOGIN) _val = ItemMgr.getItemCount(ITEM_TYPE.MISSION_LOGIN);
        
        if (_val > _config.cost) _val = _config.cost;
        _arg.can = _val >= _config.cost;
        _arg.percent = _val / _config.cost;
        _arg.percentDesc = _val + "/" + _config.cost;

        return _arg;
    },



    /** 完成某一项任务后，领取该任务的奖励 */
    claimMission(_id)
    {
        StorageHelper.addItem(StorageHelper.STORAGE_PROPERTY.MISSION_COMPLETES, _id,true);
    },

    /** 领取任务的阶段性的奖励 */
    claimMissionReward(_id)
    {
        let _config = this.getRewardConfig(_id);
        ItemMgr.addItemCount(ITEM_TYPE.COIN, _config.reward);
        StorageHelper.addItem(StorageHelper.STORAGE_PROPERTY.MISSION_REWARDS, _id,true);
    },

    getCurrMissionList()
    {
        let _currMissions = [];
        let _types = [MISSION_TYPE.LEVEL, MISSION_TYPE.AD, MISSION_TYPE.LOGIN];
        for (let i = 0; i < _types.length; i++)
        {
            let _type = _types[i];
            let _selectC = null;
            let _defaultC = null;

            for (let j = 0; j < this.missionConfigs.length; j++)
            {
                let _config = this.missionConfigs[j];

                if (_config.type != _type) continue;

                _defaultC = _config;
                if (this.isMissionComplete(_config.id)) continue;

                _selectC = _config;
                break;
            }

            if (_selectC) _currMissions.push(_selectC);
            else _currMissions.push(_defaultC);
        }
        return _currMissions;
    },

    /** 获取下一个同类型的任务 */
    getNextMission(_id)
    {
        let _config = this.getConfig(_id);

        let _selectC = null;
        for (let i = 0; i < this.missionConfigs.length; i++)
        {
            let _c = this.missionConfigs[i];
            
            if (_c.id == _id) continue;
            if (_c.type != _config.type) continue;

            if (this.isMissionComplete(_c.id)) continue;

            _selectC = _c;
            break;
        }

        return _selectC;
    },


    getMissionRewardProgress()
    {
        let _cnt = 0;
        let arr = this.getCompletes();
        for (let i = 0; i < arr.length; i++)
        {
            let _config = this.getConfig(arr[i]);
            if (!_config) continue;

            _cnt += _config.reward;
        }

        let _canRewards = [];
        let _receivedRewards = this.getReceivedRewards();
        for (let i = 0; i < this.missionRewardConfigs.length; i++)
        {
            let _rc = this.missionRewardConfigs[i];
            if (_cnt >= _rc.cost)
            {
                if (_receivedRewards.indexOf(_rc.id) == -1)
                {
                    _canRewards.push(_rc);
                }
            }
            else
            {
                
            }
            
        }

        let _rate = _cnt / 100;
        return {
            percent: _rate,
            percentDesc: (_cnt + "/100"),
            canRewards : _canRewards,
            receivedRewards : _receivedRewards,
        }
    },

    getConfig(_id)
    {
        return this.missionConfigs.find(element => element.id == _id);
    },

    getRewardConfig(_id)
    {
        return this.missionRewardConfigs.find(element => element.id == _id);
    },

    getCompletes()
    {
        return StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.MISSION_COMPLETES);
    },

    getReceivedRewards()
    {
        return StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.MISSION_REWARDS);
    },
}