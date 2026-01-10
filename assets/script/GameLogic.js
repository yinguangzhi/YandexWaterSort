/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 22:21:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-19 22:47:51
 * @FilePath: \WaterSort\assets\script\GameLogic.js
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
const { ITEM_TYPE, HINT_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const GuideHelper = require("./GuideHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const PoolHelper = require("./PoolHelper");
const StorageHelper = require("./StorageHelper");
const TimerHelper = require("./TimerHelper");
const TouchHelper = require("./TouchHelper");
const UIHelper = require("./UIHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        
        content : cc.Node,
        pipePar : cc.Node,
        blockPar : cc.Node,
        upperPar : cc.Node,
        hand : cc.Node,
        touch : cc.Node,
    
        pipePrefab : cc.Prefab,
        blockPrefab : cc.Prefab,
        cellPrefab : cc.Prefab,

        processNode : cc.Node,
        timeNode : cc.Node,
        timeLabel : cc.Label,
        levelLabel : cc.Label,
        cdHandler: null,
        

        normalPipeFrames: [cc.SpriteFrame],
        
        boardData : null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        GuideHelper.setHand(this.hand);
        
        for (let i = 0; i < this.normalPipeFrames.length; i++)
        {
            GameMgr.setPipeFrame(this.normalPipeFrames[i]);
        }

        GameMgr.setFramesFromRes()
        
        TouchHelper.bindTouch(this.touch,
            () =>
            {
                if (GameMgr.isGameEnd()) return;
    
                if (GuideHelper.inGuiding) return;
                
                if(GameMgr.isHaveSelect())
                {
                    //之前选择的方块回到原位
                    GameMgr.moveDownInSelectBlocks();
                } 
            },
            () => {},
            () => { });

        PoolHelper.register(PoolHelper.POOL_NAME.PIPE, this.pipePrefab);
        PoolHelper.register(PoolHelper.POOL_NAME.CELL, this.cellPrefab);
        PoolHelper.register(PoolHelper.POOL_NAME.BLOCK, this.blockPrefab);

        Observer.register(Observer.EVENT_NAME.GAME_RE_START,this.gameStart,this);
        Observer.register(Observer.EVENT_NAME.GAME_NEXT_PROCESSES,this.generate,this);
        Observer.register(Observer.EVENT_NAME.GAME_CONTINUE,this.addTimeInRevive,this);

        GameMgr.setUpper(this.upperPar);
        
        this.boardData = GameMgr.checkSavedBoardValid();
        if (!this.boardData)
        {
            console.log("this board is null");
            GameMgr.clearBoard();
        }
        
        this.gameStart(true);

        this.levelLabel.string = "LV." + ItemMgr.getLevel();

        this.schedule(() => {
            
            GameMgr.saveBoard();

        }, 10);

        let _desc = "";
        let _title = "";
        let _hintType = 0;
        let _level = ItemMgr.getLevel();
        if (_level == 8)
        {
            _hintType = HINT_TYPE.CACHE;
            _desc = "Use storage to hold \nblocks temporarily.";
            _title = "Storage";
        }
        else if (_level == 14)
        {
            _hintType = HINT_TYPE.GENERATOR;
            _desc = "The generator spawns a new \nblock after you pick up \nthe current one.";
            _title = "Generator";
        }
        else if (_level == 12)
        {
            _hintType = HINT_TYPE.SPECIAL_COLOR;
            _desc = "Only stack blocks matching \nstorage’s color.";
            _title = "Specific heaps";
        }

        if (_hintType > 0)
        {
            UIHelper.displayUI("HintPop", null, true, true, (page) =>
            {
                page.getComponent("HintPop").data = {
                    type: _hintType,
                    desc: _desc,
                    title : _title,
                }
            })
        }
    },

    // update (dt) {},

    gameStart(_isStart)
    {
        if(!_isStart)
            AudioHelper.playAudio(AudioHelper.AUDIO_NAME.AGAIN);
        
        GameMgr.clearGame();
        GameMgr.pauseGame = false;

        let _time = this.boardData ? this.boardData.leaveTime : GameMgr.getGameTime();
        let _pIdx = this.boardData ? this.boardData.processIndex : 0;
        this.generate(false,_pIdx,_time);
        
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
        Observer.fire(Observer.EVENT_NAME.REFRESH_STREAK);

        GameMgr.computeRewardCurrency();
    },

    generate(_isNextProcesses,_processesIdx,_time)
    {
        GameMgr.clearRecordMessage();

        if (!_isNextProcesses)
        {
            GameMgr.clearPipe();
            this.checkCountDown(_time);

            GameMgr.processIndex = _processesIdx;
        }
        else
        {
            GameMgr.movePipesFarAway();
            GameMgr.processIndex += 1;
        }
        
        this.content.scale = GameMgr.getLayoutScale();
        
        let _pCnt = GameMgr.levelJson.processes.length;
        this.processNode.active = _pCnt > 1;
        if (_pCnt > 1)
        {
            let _t_pWidth = 425;
            let pf = this.processNode.getChildByName("pf");
            pf.x = -_t_pWidth * 0.5;
            
            let _tWidth = _t_pWidth * (GameMgr.processIndex / (_pCnt - 1));
            if (GameMgr.processIndex == 0) pf.width = _tWidth;
            else
            {
                cc.tween(pf).to(0.4, { width: _tWidth }).start();    
            }
            
        }

        let process = GameMgr.getLevelProcess();
        let pipes = process.pipes;

        let _sPipes = this.boardData ? this.boardData.pipeList : null;
        
        let _arr = [];
        for (let i = 0; i < pipes.length; i++)
        {
            let pipe = pipes[i];
            
            let pObj = PoolHelper.getNote(PoolHelper.POOL_NAME.PIPE, true, this.pipePar);
            
            let pScript = pObj.getComponent("Pipe")

            let _eData = _sPipes ? _sPipes[i] : null;
            pScript.setExternalData(_eData);
            pScript.data = pipe;

            if (_isNextProcesses)
            {
                pScript.moveFromFarAway()
            }

            _arr.push(pObj);
        }
        
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
        
        this.scheduleOnce(() => {

            GuideHelper.setHand(this.hand);
            
            if (ItemMgr.getLevel() == 1)
            {
                ItemMgr.setItemCount(ITEM_TYPE.GUIDE, 0);

                if (GuideHelper.checkGuideStep(0)) {
                    GuideHelper.setGuideByStep(0);
                }
            }
            else if (ItemMgr.getLevel() == 3)
            {
                ItemMgr.setItemCount(ITEM_TYPE.GUIDE, 3);

                if (GuideHelper.checkGuideStep(3) && ItemMgr.getItemCount(ITEM_TYPE.PROP_UNLOCK) > 0) {
                    GuideHelper.setGuideByStep(3);
                }
                else GuideHelper.resetGuide();
            }

        }, 0.1);

        this.boardData = null;
    },

    addTimeInRevive()
    {
        this.checkCountDown(GameMgr.addTimeInRevive);
    },
    
    checkCountDown(_time)
    {
        this.clearCountDown(); 

        GameMgr.leaveProcessTime = 0;

        this.timeNode.active = false;
        this.levelLabel.node.active = true;

        if (_time > 0) {
            GameMgr.leaveProcessTime = _time;

            this.timeNode.active = true;

            this.cdHandler = setInterval(() => {

                if (!cc.isValid(this)) return;

                this.countDown();

            }, 1000);

            this.countDown(false);
            this.levelLabel.node.active = false;
        }
    },

    countDown(_minus = true)
    {
        if (GameMgr.pauseGame) return;

        if(_minus && GameMgr.isGamePlaying()) GameMgr.leaveProcessTime -= 1;
        let _tStr = CocosHelper.calcTime(GameMgr.leaveProcessTime);
        this.timeLabel.string = _tStr;
        
        if(GameMgr.leaveProcessTime <= 0)
        {
            this.clearCountDown();
            GameMgr.checkGameEnd(true);
        }
    },

    clearCountDown()
    {
        if(this.cdHandler) clearInterval(this.cdHandler);
        this.cdHandler = null;
    },

    onDestroy()
    {
       this.clearCountDown(); 
    },
});
