/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-07 17:11:20
 * @FilePath: \WaterSort\assets\script\ScenePage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const AudioHelper = require("./AudioHelper");
// const CocosLoader = require("./CocosLoader");

const CocosLoader = require("./CocosLoader");
const Config = require("./Config");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const GameParamsHelper = require("./GameParamsHelper");
const ItemMgr = require("./ItemMgr");
const PlatformTool = require("./PlatformTool");
const SceneHelper = require("./SceneHelper");
const { SCENE_NAME } = require("./SceneHelper");
const UIHelper = require("./UIHelper");

cc.Class({
    extends: cc.Component,
    properties: {
    
        callback: null,
        backNode: cc.Node,
        progressSprite: cc.Sprite,


        progress : 0,
        totalPreLoadCnt : 0,
        preLoadCnt : 0,
        speed: 30,
        
        scene: "",
    
        autoTranslate : false,
        progressLabel: cc.Label,
    },

    onLoad() {
        let _sg = UIHelper.getUI(this.node.name);
        if (!_sg)
        {
            UIHelper.addUI(this.node.name,this.node);
        }

        this.speed = 8;
        this.totalPreLoadCnt = 999;
        
        this.canceled = false;

        this.progress = 0;
        this.setProgress(0);
    },

    start()
    {
        this.node.parent = UIHelper.getPermanentsParent(null); 
    },

     update(dt) {

        if (this.progress < 98) {

            if (this.preLoadCnt < this.totalPreLoadCnt) {

                if (this.progress < 96) {

                    this.progress += dt * this.speed;
                }
                if (this.progress >= 98) this.progress = 96;
                // console.log(this.progress);
                this.setProgress(this.progress);
                
            } 
            else {
                
                this.speed = 60;

                this.progress += dt * this.speed;
                this.setProgress(this.progress);
            }

            if (this.progress >= 98) {
                console.log(this.scene);
                
                this.onLoadComplete();
            }
        }
     },
    
    setData(_scene , _autoTranslate ) {

        let staticID = ++GameParamsHelper.staticID;

        this.scene = _scene;

        this.autoTranslate = _autoTranslate;

        if (this.backNode) this.backNode.active = false;

        this.preLoadCnt = 0;
        this.totalPreLoadCnt = 0;

        let _addC = () =>
        {
            if (staticID != GameParamsHelper.staticID) return;
            
            if (!cc.isValid(this)) return;
            
            if (this.canceled) return;
            
            this.preLoadCnt++;

        }


        if (this.scene == SCENE_NAME.GAME) {

            
            this.totalPreLoadCnt = 3 //+ _cArr.length * 2;

            let _level = ItemMgr.getLevel();
            _level = GameMgr.reCalcLevel(_level);

            CocosLoader.loadAssetAsync("level/" + _level, cc.JsonAsset, null, 0)
                .then(asset =>
                {
                    let _json = asset.json;
                    GameMgr.levelJson = _json;
                    
                    let _pColors = GameMgr.getColorPipes(_json);
                    if (_pColors && _pColors.length > 0)
                    {
                        this.totalPreLoadCnt += _pColors.length * 3;
                        for (let i = 0; i < _pColors.length; i++)
                        {
                            let _c = _pColors[i];
                            for (let j = 1; j <= 4; j++)
                            {
                                if (j == 3) continue;

                                CocosLoader.loadAssetAsync("image/pipe/" + _c + "_" + j, cc.SpriteFrame, null, 0)
                                    .then((asset) =>
                                    {
                                        // console.log(asset);
                                        GameMgr.setPipeFrame(asset);
                                        _addC();
                                    })
                                
                            }
                        }
                    }

                    _addC();
                }
            )

            let _skinPath = "prefab/Skin" + ItemMgr.skinID();
            CocosLoader.loadAssetAsync(_skinPath, cc.Prefab, null, 0)
                .then((asset) => {
                    GameMgr.skinRes = asset;
                    _addC();
                });
        }
        else if (this.scene == SCENE_NAME.HOME) { 
            
            this.totalPreLoadCnt = 1;
        }

        cc.director.preloadScene(_scene, () => {
            
            _addC();
        });
        
    },

    onLoadComplete() {
     
        this.progress = 98;
        this.setProgress(this.progress);

        
        if (this.scene == SCENE_NAME.HOME) SceneHelper.isHomeLoaded = true;
        
        cc.director.loadScene(this.scene, function () { 
        });
        
    },

    realComplete() { 
        
        this.progress = 100;
        this.setProgress(this.progress);

        this.scheduleOnce(() => { 
            
            if(SceneHelper.lastScene == SCENE_NAME.LAUNCH)
            {
                PlatformTool.realEnterH5();
            }

            UIHelper.hideUI("ScenePage");
        },0.02)
    },

    setProgress(percent ) {

        // this.progressLabel.string = "loading... " + `${Math.floor(percent)}%`;
        this.progressLabel.string = `${Math.floor(percent)}%`;
        if(this.progressSprite) this.progressSprite.fillRange = percent * 0.01;

        if (percent > 50 &&
            this.preLoadCnt < this.totalPreLoadCnt &&
            this.scene.indexOf("game") != -1 &&
            !this.canceled &&
            this.backNode ) {

            this.backNode.active = true;
        }
    },

    backAction() { 
        this.canceled = true;
        if(this.backNode) this.backNode.active = false;

        UIHelper.hideUI("ScenePage");
        
    },
});
