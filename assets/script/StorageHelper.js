
const { DATA_TYPE } = require("./EnumHelper");
const PlatformTool = require("./PlatformTool");
const TimerHelper = require("./TimerHelper");


module.exports =
{
    
    userData: {},

    commonSaveUserData(_data)
    {
        if (!_data) _data = this.userData;

        this.saveData(this.SAVE_PATH.USER_DATA, _data,true);

        return _data;
    },

    saveItem : function(_property,_val,_save)//type: star, coin,grade
    {
        let _data = this.userData;
        let _name = _property.name;

        switch (_property) {
            case this.STORAGE_PROPERTY.AUDIO:

                _data[_name] = _val
                
                break;
            default:
                _data[_name] = _val
                break;
            
        }

        if(!_save) return;

        return this.commonSaveUserData(_data);
    },

    addItem: function (_property, _val, _save)
    {
        let _data = this.userData;
        let _name = _property.name;

        console.log("add item => ", _name,"   ", _data[_name],"  : ", _val);
        switch (_property) {
            default:

                if (_property.type == DATA_TYPE.number)
                {
                    if (isNaN(_data[_name]))
                    {
                        _data[_name] = _property.default;
                    }
                    _data[_name] += _val
                }
                else if ((_property.type == DATA_TYPE.object || _property.type == DATA_TYPE.array) &&
                            Array.isArray(_property.default))
                {
                    if (!Array.isArray(_data[_name]))
                    {
                        _data[_name] = _property.default;
                    }
                    if (!_property.canSame)
                    {
                        let _s_d = _data[_name].indexOf(_val) != -1;
                        if (_s_d) return;
                    }
                    _data[_name].push(_val);
                }
                else
                {
                    console.log("property is not number,please check");
                    return;
                }
                
                break;
            
        }

        if(!_save) return;

        return this.commonSaveUserData(_data);
    },
    

    getItem(_property,_defaultVal)
    {
        let val = this.userData[_property.name];
        if (this.isEmpty(val))
        {
            if (this.isEmpty(_defaultVal)) return _property.default;
            else return _defaultVal;
        }
        return val;
    },
    
    readUserData : function ()
    {
        let _data = this.readData(this.SAVE_PATH.USER_DATA)
        if (!_data) _data = {};
        
        // console.log(_data)
        this.userData = _data;
        
        this.checkUser();
        // console.log(this.userData)
        
        return _data;
    },

    checkDataProperty(tempData,key,defaultVal,valType)
    {
        if(this.isEmpty(tempData)) return;
        if(this.isEmpty(tempData[key])) tempData[key] = defaultVal;
        else if(!this.isEmpty(valType) && typeof tempData[key] !== valType) tempData[key] = defaultVal;
    },

    // clearStorage()
    // {
    // },

    readUserDataFromPlatform : function (_callback)
    {
        if(PlatformTool.isFB)
        {
            let _key = this.SAVE_PATH.USER_DATA;
            try
            {
                FBInstant.player
                    .getDataAsync([_key])
                    .then((data) =>
                    {
                        console.log(_key + ' is loaded');
                        let dataStr = data[_key];

                        let _reset = false;
                        if(this.isEmpty(dataStr))
                        {
                            _reset = true;
                            this.userData = {};
                        }
                        else
                        {
                            if (typeof dataStr == 'string')
                                this.userData = JSON.parse(dataStr);
                            else
                                this.userData = dataStr;
                        }   

                        this.checkUser();

                        this.saveData(this.SAVE_PATH.USER_DATA, this.userData, _reset);
                        
                        _callback && _callback();
                    })
                    .catch(err => {
                        this.readUserData();
                        _callback && _callback();
                    });
                
            }
            catch (e)
            {
                console.log(e);
                this.readUserData();
                
                _callback && _callback();
                
            }
        }
        else
        {
            this.readUserData();
            _callback();
        }
    },

    checkUser()
    {
        for(let key in this.STORAGE_PROPERTY)
        {
            let arg = this.STORAGE_PROPERTY[key];
            // console.log(arg," ",arg.name,arg.default,arg.type);
            this.checkDataProperty(this.userData,arg.name,arg.default,arg.type)
        }

        let _d_save = false;
        let _week = TimerHelper.getWeek();
        if (_week != this.getItem(this.STORAGE_PROPERTY.WEEK))
        {
            this.saveItem(this.STORAGE_PROPERTY.WEEK, _week);
            let _arr = [
                this.STORAGE_PROPERTY.MISSION_AD,
                this.STORAGE_PROPERTY.MISSION_LEVEL,
                this.STORAGE_PROPERTY.MISSION_LOGIN,
                this.STORAGE_PROPERTY.MISSION_COMPLETES,
                this.STORAGE_PROPERTY.MISSION_REWARDS
            ]
            for (let i = 0; i < _arr.length; i++)
            {
                this.saveItem(_arr[i], _arr[i].default);
            }
            _d_save = true;
        }

        let _tString = TimerHelper.currentTimeStr()
        if(_tString != this.getItem(this.STORAGE_PROPERTY.DAY))
        {
            console.log(_tString, "  day compare ", this.getItem(this.STORAGE_PROPERTY.DAY))

            this.saveItem(this.STORAGE_PROPERTY.DAY,_tString);
            this.saveItem(this.STORAGE_PROPERTY.FREE_REWARD,0);
            this.saveItem(this.STORAGE_PROPERTY.REWARD_PROGRESS, 1);
            this.addItem(this.STORAGE_PROPERTY.MISSION_LOGIN, 1);

            _d_save = true;
        }
        if (_d_save)
        {
            
            setTimeout(() => {
                this.commonSaveUserData();
            }, 2000);
        }
    },
    
    saveBoardData(_data)
    {
        this.saveData(this.SAVE_PATH.BOARD_DATA, _data,false);
    },

    readBoardData()
    {
        return this.readData(this.SAVE_PATH.BOARD_DATA);
    },

   
    SAVE_PATH:
    {
        BOARD_DATA: "BOARD_DATA",
        USER_DATA : "USER_DATA",
    },
    

    /**
     * @description 存储数据
     * @param {数据key} _savePath 
     * @param {数据结构} _data 
     * @param {是否推送到服务器或平台对应后端} _post 
     */
    saveData(_savePath,_data,_post)
    { 
        let _dataStr = JSON.stringify(_data);
        try
        {
            cc.sys.localStorage.setItem(_savePath, _dataStr);
        }
        catch (e)
        {
            cc.sys.localStorage.setItem(_savePath, "");
        }
        
        if (_post)
        {
            let _postData = {};
            _postData[_savePath] = _dataStr;
            this.postDataToFB(_postData,_savePath)
        }
    },
    
    readData(_savePath)
    {
        let _dataStr = "";
        try
        {
            _dataStr = cc.sys.localStorage.getItem(_savePath);
        }
        catch (e)
        {

        }
        

        let _data = null;

        try
        {
            if (!this.isEmpty(_dataStr)) {
                _data = JSON.parse(_dataStr);
            }
        }
        catch (e)
        {
            _data = null;
        }
        
        return _data;
    },
    
    postDataToFB(dataObj,title)
    {
        try
        {
            if(!this.isEmpty(dataObj) && window.isFB)
            {
                FBInstant.player
                    .setDataAsync(dataObj)
                    .then(function()
                    {
                    });
            }
        }
        catch (e)
        {
        }
        
    },

    
    isEmpty: function (obj)
    {
        if (obj === '' || obj === null || obj === undefined) return true;
        else return false;
    },

    STORAGE_PROPERTY : {
        /** 语言 */
        LANGUAGE: {
            name: "LANGUAGE",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },
        
    
        /** 引导 */
        GUIDE: {
            name: "GUIDE",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        /** 震动 */
        COIN: {
            name: "COIN",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },

        /** 音效 */
        AUDIO: {
            name: "AUDIO",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },

        /** 音乐 */
        MUSIC: {
            name: "MUSIC",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },

        /** 震动 */
        VIBRATE: {
            name: "VIBRATE",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },

        /** 关卡 */
        LEVEL: {
            name: "LEVEL",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },

        /** 关卡 */
        PROP_UNLOCK: {
            name: "PROP_UNLOCK",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },

        /** 关卡 */
        PROP_UNDO: {
            name: "PROP_UNDO",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        PROP_HINT: {
            name: "PROP_HINT",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        /** 关卡 */
        STREAK: {
            name: "STREAK",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        /** 添加桌面快捷方式的时间 */
        SHORTCUT_TIME: {
            name: "SHORTCUT_TIME",
            isSimple: false,
            default: '',
            type: DATA_TYPE.string
        },
        FREE_REWARD: {
            name: "FREE_REWARD",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        REWARD_PROGRESS: {
            name: "REWARD_PROGRESS",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },
        DAY: {
            name: "DAY",
            isSimple: false,
            default: "",
            type: DATA_TYPE.string
        },
        TURNABLE_STAGE: {
            name: "TURNABLE_STAGE",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        WEEK: {
            name: "WEEK",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        MISSION_LOGIN: {
            name: "MISSION_LOGIN",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        MISSION_AD: {
            name: "MISSION_AD",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        MISSION_LEVEL: {
            name: "MISSION_LEVEL",
            isSimple: false,
            default: 0,
            type: DATA_TYPE.number
        },
        MISSION_COMPLETES: {
            name: "MISSION_COMPLETES",
            isSimple: false,
            canSame : false,
            default: [],
            type: DATA_TYPE.object
        },
        MISSION_REWARDS: {
            name: "MISSION_REWARDS",
            isSimple: false,
            canSame : false,
            default: [],
            type: DATA_TYPE.object
        },
        SKIN_ID: {
            name: "SKIN_ID",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },
        
        SKINS: {
            name: "SKINS",
            isSimple: false,
            canSame : false,
            default: [1],
            type: DATA_TYPE.object
        },
        SUGGESTED_LEVEL :  {
            name: "SUGGESTED_LEVEL",
            isSimple: false,
            default: 1,
            type: DATA_TYPE.number
        },
    }
}
    