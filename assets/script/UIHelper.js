// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { log } = require('console');
var CocosLoader = require('./CocosLoader');
module.exports =
{
        
    DAILY_PAGE: "UIDaily",
    GAME_PLAY_SETTING_PAGE: "GamePlaySettingPage",
    STYLE_PAGE: "UIStyle",
    SETTING_PAGE: "UISetting",
    HOW_TO_PLAY_PAGE: "UIHowToPlay",
    STATISTICS_PAGE: "UIStatistics",
    DAILY_GAME_PAGE: "UIDailyGame",
    GAME_SUCCESS_PAGE: "UISuccess",
    GAME_FAIL_PAGE: "UIFail",
    
    level:
    {
        level1: 1, level2: 2,
    },
    

    uiList: {},
    _debug: false,
        
    Permanents: null,
    
    addPermanents(_permanents)
    { 
        this.Permanents = _permanents;
    },
    
    getPermanentsParent(_parent,isDefault = true)
    { 
        if (_parent && cc.isValid(_parent)) return _parent;

        if (!isDefault) return _parent;
        
        if (this.Permanents && this.Permanents.node) return this.Permanents.node;

        let _canvas = cc.find("Canvas");
        return _canvas;
    },
    
    displayMask(state)
    {
        if(state)
        {
            let _parent = this.getPermanentsParent(null,true);
            this.displayUI("UILoading",_parent,true,false, (obj) =>
            {
                // log(obj);
            })
        }
        else
        {
            this.hideUI("UILoading");
        }
    },
    
    displayUI: function ( name, parent, state,isMask, callback) {

        if(this._debug)console.log("step 1 : ",name);
        
        // console.log(this.uiList);
        let _page = this.uiList[name];

        if (cc.isValid(_page) && _page != 1) { 

            if (this._debug) console.log("step 2 : ", name);
            let num = _page.parent.childrenCount;
            _page.setSiblingIndex(num);
            callback && callback(_page);
            return _page;
        }

        if(this._debug) console.log("step 3 : ",name);
        this.uiList[name] = null;


        if (isMask)
        {
            this.displayMask(true);
        }    
        
        CocosLoader.loadAsset("prefab/" + name, cc.Prefab, (prefab) => {

            if (this._debug) console.log("step 4 : ", name);
            
            if (isMask) this.displayMask(false);
            
            let _temp = this.uiList[name];
            if (_temp == 1) return;

            if (cc.isValid(_temp)) 
            {
                callback && callback(_temp);
                return ;
            }
            
            parent = this.getPermanentsParent(parent);
            

            if(this._debug) console.log("step 5 : ",name);
            let obj = null;
            if (cc.isValid(parent) && prefab) {
                
                if(this._debug) console.log("step 6 : ",name);
                obj = cc.instantiate(prefab);
                obj.active = state;
                obj.parent = parent;
                obj.name = name;

                this.uiList[name] = obj;
            }

            callback && callback(obj);
        }, 0);
    },

    hideUI: function (name) {
        let _page = this.uiList[name];

        if(_page == 1) return;

        if (cc.isValid(_page))  _page.destroy();

        this.uiList[name] = 1;
    },

    addUI(name, obj) {
        this.uiList[name] = obj;
    },

    getUI(name) {

        let _page = this.uiList[name];

        if(_page == 1) return null;

        if (cc.isValid(_page)) return _page;
        else return null;
    },

    hasUI(name) {
        let _page = this.uiList[name];

        if(_page == 1) return false;

        if (cc.isValid(_page)) return true;

        return false;
    },


    isEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}
    
