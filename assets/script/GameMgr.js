/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 22:21:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-07 16:49:07
 * @FilePath: \WaterSort\assets\script\GameMgr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const CocosHelper = require("./CocosHelper");
const { COLOR, PIPE_TYPE, GAME_MODE, LEVEL_MODE, DIFFICULTY, GAME_STATUS, ITEM_TYPE, MISSION_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const MissionMgr = require("./MissionMgr");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const StorageHelper = require("./StorageHelper");
const UIHelper = require("./UIHelper");

module.exports = {

    skinRes: null,

    /** 是否暂停游戏 */
    pauseGame: false,
    
    maxLevel: 59,
    
    onlyOneMask: false,
    
    gStatus: 0,
    reviveCnt: 0,
    maxReviveCnt : 3,
    addTimeInRevive : 60,
    /** 填充满管道后的移动时间 */
    timeInFull : 0.25,
    timeInFull2: 0.08,
    timeInFullDelta: 0.06,
    timeInFull2s: [0,0.08, 0.14, 0.19, 0.24, 0.28, 0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.50, 0.53, 0.56, 0.59, 0.62, 0.65],


    addTimeInSuccessMove : .06,
    timeInSuccessMove : .56,
    /** 管道上方的转折点和管道顶部的距离 */
    distanceToPipe : 40,

    minShakeTime : 1.8,
    maxShakeTime : 3.2,
    minShakeSpeed : 2,
    maxShakeSpeed : 3,
    maxShakeAngle: 5,
    minShakeAngle : 2,
    maxShakeY: 16,
    minShakeY : 8,

    /** 拖尾长度 */
    trailLength : 40,

    realLevel : 1,
    currLevel: 1,
    
    /** 管道中顶部格子的高度 */
    cellTopHeight: 68,

    /** 管道中一个格子的高度 */
    cellHeight: 68,
    cellWidth: 78,
    
    blockHeight: 96,
    blockWidth: 88,
    
    /** 管道中（格子和方块的父节点）的基础偏移 */
    baseOffsetInPipe: 23,

    /** 管道填满后，整体上移的距离 */
    upYInComplete : 15,
    upYInCompleteInBotDi: 22,
    
    /** 方块下边缘的透明部分的高度 */
    transparentHeightInBlockInBot: 8,
    /** 方块上边缘的透明部分的高度 */
    transparentHeightInBlockInTop: 1.5,
    
    blockOffsetY()
    {
        let _oy = this.cellHeight - this.blockHeight * 0.5 + this.transparentHeightInBlockInTop;
        return _oy;
    },

    /** 管道总长度 */
    getPipeHeight(_length)
    {
        return this.baseOffsetInPipe + (_length - 1) * this.cellHeight + this.cellTopHeight;
    },

    /** 管道的有效长度 ，也就是方块占用的长度 */
    getPipeValidHeight(_length)
    {
        return (_length - 2) * this.cellHeight +
            this.cellTopHeight +
            this.blockHeight -
            this.upYInComplete -
            this.transparentHeightInBlockInBot;
    },

    /** 管道的宽度 */
    pipeWidth: 84,
    
    /** 管道底部的基础偏移 */
    baseOffsetInPipe : 20,

    leaveProcessTime : 0,
    processIndex : 0,

    getLevelProcess()
    {
        return this.levelJson.processes[this.processIndex];
    },

    getGameTime()
    {
        return this.levelJson['time'];
    },

    calcMoveTimeInSuccess(_distance)
    {
        if (_distance < 840) return this.timeInSuccessMove;
        else if (_distance < 980) return this.timeInSuccessMove + 0.04;
        else if (_distance < 1080) return this.timeInSuccessMove + 0.07;
        else if (_distance < 1180) return this.timeInSuccessMove + 0.10;
        else if (_distance < 1280) return this.timeInSuccessMove + 0.13;
        else if (_distance < 1380) return this.timeInSuccessMove + 0.15;
        else if (_distance < 1480) return this.timeInSuccessMove + 0.17;
        else if (_distance < 1580) return this.timeInSuccessMove + 0.19;
        else if (_distance < 1680) return this.timeInSuccessMove + 0.20;
        else if (_distance < 1780) return this.timeInSuccessMove + 0.21;
        else if (_distance < 1880) return this.timeInSuccessMove + 0.22;
        else if (_distance < 1980) return this.timeInSuccessMove + 0.23;
        else return this.timeInSuccessMove + 0.23;
    },

    blockList : [],
    addBlocks(_block)
    {
        if (this.blockList.indexOf(_block) != -1)
        {
            return;
        }

        this.blockList.push(_block);
    },

    sortPipes()
    {
        this.pipeList.sort((a, b) =>
        {
            return a.node.x - b.node.x;
        })
    },

    pipeList : [],
    addPipe(_pipe)
    {
        if (this.pipeList.indexOf(_pipe) != -1)
        {
            return;
        }

        this.pipeList.push(_pipe);
    },

    getPipe(_id)
    {
        return this.pipeList.find(element => element.uniqueID == _id);
    },

    clearPipe()
    {
        for(let i = 0;i < this.pipeList.length;i++)
        {
            if(cc.isValid(this.pipeList[i])) this.pipeList[i].restore();
        }
        
        this.pipeList.length = 0;
    },

    movePipesFarAway()
    {
        let _pArr = this.pipeList.concat();
        this.pipeList.length = 0;

        for(let i = 0;i < _pArr.length;i++)
        {
            if(cc.isValid(_pArr[i])) _pArr[i].moveToFarAway();
        }
    },

    upperPar : null,
    setUpper(_upper)
    {
        this.upperPar = _upper;
    },

    getPosInUpper(_from,_pos)
    {
        let _cPos = CocosHelper.convertPos(_from, this.upperPar, _pos);
        return _cPos;
    },

    getCellPosBySeat(_seat,_pType = PIPE_TYPE.NORMAL)
    {
        let _y = 0;
        if(_pType == PIPE_TYPE.GENERATOR)
        {
        }
        else
        {
            _y = _seat * this.cellHeight;
        }
        return cc.v2(0,_y);
    },

    isValidColor(_color)
    {
        if(_color <= COLOR.BLACK && _color >= COLOR.RED)
        {
            return true;
        }
        else
        {
            // console.warn("is not valid color : ",_color)
            return false;
        }
    },

    smallColorFrames : [],
    setSmallColorFrames(_frames)
    {
        this.smallColorFrames = _frames.concat();
    },

    setSmallColorFrame(_frame)
    {
        let _idx = this.smallColorFrames.indexOf(_frame)
        if(_idx == -1) 
        {
            this.smallColorFrames.push(_frame);
        }
    },

    getSmallColorFrame(_color)
    {
        return this.smallColorFrames.find(element => element.name == _color);
    },

    outlineFadeFrame : null,
    outlineFrame : null,
    whoFrame : null,
    blockFrames : [],
    setFrames(_frames)
    {
        this.blockFrames = _frames.concat();
    },

    setFrame(_frame)
    {
        let _idx = this.blockFrames.indexOf(_frame)
        if(_idx == -1) 
        {
            this.blockFrames.push(_frame);
        }
    },

    getFrame(_color)
    {
        return this.blockFrames.find(element => element.name == _color);
    },

    setFramesFromRes()
    {
        this.blockFrames = [];
        
        let _res = cc.instantiate(this.skinRes);
    
        let _frames = _res.getComponent("SkinRes").assets;
        
        for (let i = 0; i < _frames.length; i++)
        {
            this.setFrame(_frames[i]);
        }
        this.whoFrame = _frames[9];
        this.outlineFrame = _frames[10];
        this.outlineFadeFrame = _frames[11];
    },
    
    normalPipeFrames: [],
    colorPipeFrames : [],
    
    setPipeFrame(_frame)
    {
        let _idx = this.colorPipeFrames.indexOf(_frame)
        if(_idx == -1) 
        {
            this.colorPipeFrames.push(_frame);
        }
    },

    
    getPipeFrame(_name)
    { 

        return this.colorPipeFrames.find(element => element.name == _name);
    },
    
    /** 已选择的方块 */
    selectBlocks : [],
    selectPipe : null,

    isHaveSelect()
    {
        return this.selectPipe && this.selectBlocks && this.selectBlocks.length > 0;
    },

    /**
     * 选中的方块上抬
     * @param {*} _bArr 
     */
    moveUpInSelectBlocks(_pipe,_bArr)
    {
        this.selectPipe = _pipe;
        this.selectBlocks = _bArr;

        if(_bArr && _bArr.length != 0)
        {
            for(let i = _bArr.length - 1;i >= 0;i--)
            {
                let _b = _bArr[i];
                if(!cc.isValid(_b)) continue;
    
                _b.moveUp();
            }
        }
    },

    /**
     * 将选中管道里的方块移除
     * @param 方块列表 _aArr 
     * @returns 
     */
    removeBlocksFromPipe(_pipe,_aArr)
    {
        if (!_pipe)
        {
            _pipe = this.selectPipe;
        }

        if (!_pipe) return;

        if (!_aArr || _aArr.length == 0) return;

        _pipe.removeBlocks(_aArr);
    },
    
    
    /**
     * 方块回到原位
     * @param 回到原位的方块列表 _bArr 
     * @param 是否要把选中的管道置空 _setPNull 
     */
    moveDownInSelectBlocks(_bArr,_setPNull = true)
    {
        if(!_bArr)
        {
            _bArr = this.selectBlocks;
        }

        if(_bArr && _bArr.length != 0)
        {
            for(let i = _bArr.length - 1;i >= 0;i--)
            {
                let _b = _bArr[i];
                if(!cc.isValid(_b)) continue;
    
                _b.moveDown();
            }

            _bArr.length = 0;
        }

        this.forceClearSelectBlocks();
    },

    forceClearSelectBlocks()
    {
        this.selectPipe = null;
        if(this.selectBlocks) this.selectBlocks.length = 0;
    },

    isSortedInHint : false,
    /**
     * 方块按照从上到下，从左到右排序
     * @returns 
     */
    sortBlockInHint()
    {
        if(this.isSortedInHint) return;

        this.isSortedInHint = true;
        
        this.blockList.sort((a,b) =>
        {
            return a.worldPos().x - b.worldPos().x;
        })
        this.blockList.sort((a,b) =>
        {
            return b.worldPos().y - a.worldPos().y;
        });
    },

    /** 剩余的被遮挡的方块的数量 */
    leaveMaskNumber()
    {
        let _hNum = 0;
        for(let i = 0;i < this.blockList.length;i++)
        {
            let _b = this.blockList[i];
            
            if(_b.isMask)
            {
                _hNum += 1;
            }
        }
        return _hNum;
    },

    /** 提示功能，将部分被遮挡的方块展示出来 */
    hintAction()
    {
        this.sortBlockInHint();

        let _hNum = 0;
        let _t_hNum = 5;
        for(let i = 0;i < this.blockList.length;i++)
        {
            let _b = this.blockList[i];
            
            if(_b.isMask)
            {
                _hNum += 1;
                _b.setMaskState(false,true,_hNum);
            }

            if(_hNum == _t_hNum)
            {
                break;
            }
        }

        //问号遮罩去掉后，检测是否有管道填充完成,游戏是否结束
        if (_hNum > 0)
        {
            for (let i = 0; i < this.pipeList.length; i++)
            {
                this.pipeList[i] && this.pipeList[i].checkFull(false,true);
            }
            this.checkGameEnd();
        }

        return _hNum > 0;
    },

    /** 剩余的锁的个数 */
    leaveLockNumber: 0,
    
    /** 解锁管道中的一个锁 */
    releaseOneLock()
    {
        let _lockedP = null;
        for(let i = 0;i < this.pipeList.length;i++)
        {
            let _p = this.pipeList[i];
            
            if (!cc.isValid(_p)) continue;
            if (!_p.isHasLock()) continue;
            _lockedP = _p;
            
            break;
        }

        if (_lockedP)
        {
            this.leaveLockNumber -= 1;
            _lockedP?.releaseOneLock();
            Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
        }
        return _lockedP != null;
    },

    /** 回退时，是否重置当前的选择 */
    resetWhenUndo : true,

    stepMessageMap : [],
    leaveStepNumber()
    {
        return this.stepMessageMap.length;
    },

    /** 记录每一步的信息 */
    recordStepMessage(_f_pipe,_t_pipe,_bArr)
    {
        // console.log(_bArr)
        let _arg = 
        {
            fPipe : _f_pipe,
            tPipe : _t_pipe,
            blocks : _bArr.concat(),
        }
        this.stepMessageMap.push(_arg);
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
    },

    /** 清除记录的步骤 */
    clearRecordMessage()
    { 
        this.stepMessageMap.length = 0;
    },
    
    /** 回退上一步 */
    undoStep()
    {
        let _len = this.stepMessageMap.length;
        if(_len == 0)
        {
            console.warn("don't have step that undo");
            return false;
        }

        let _rRemoveStep = (_continueUndo) =>
        {
            this.stepMessageMap.splice(_len - 1);
            if(_continueUndo) this.undoStep();
        }

        let _mess = this.stepMessageMap[_len - 1];
        // console.log(_mess);
        if(!_mess)
        {
            console.warn("the step that undo is not exit. deep continue undo");
            _rRemoveStep(true);
            return false;
        }

        let _f_pipe = _mess.fPipe;
        if(!cc.isValid(_f_pipe))
        {
            console.warn("f pipe is not valid in undo");
            _rRemoveStep(true);
            return false;
        }

        if(!_f_pipe.isCouldUndo())
        {
            console.warn("f pipe can't undo now");
            return false;
        }

        let _t_pipe = _mess.tPipe;
        if(!cc.isValid(_t_pipe))
        {
            console.warn("t pipe is not valid in undo");
            _rRemoveStep(true);
            return false;
        }

        if(!_t_pipe.isCouldUndo())
        {
            console.warn("t pipe can't undo now");
            return false;
        }

        let _bArr = _mess.blocks;
        if(!_bArr || _bArr.length == 0)
        {
            console.warn("don't have blocks in undo");
            return false;
        }

        let _b_c_undo = true;
        for(let i = 0;i < _bArr.length;i++)
        {
            let _b = _bArr[i];
            if(!_b.isCouldUndo())
            {
                _b_c_undo = false;
                break;
            }
        }
        if(!_b_c_undo)
        {
            console.warn("some block can't undo");
            return false;
        }

        _rRemoveStep(false);

        if(this.resetWhenUndo) this.moveDownInSelectBlocks();

        _f_pipe.realUndo(_t_pipe, _bArr.reverse());
        
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
        return true;
    },

    /** 游戏开始 */
    checkGameStart()
    {
        if (this.gStatus == GAME_STATUS.IDLE)
        {
            this.gStatus = GAME_STATUS.PLAYING;
        }
    },

    /** 检测游戏是否结束 */
    checkGameEnd(_timeOut = false)
    {
        if (this.isGameEnd()) return;
        
        // console.log(this.pipeList)
        let _success = true;
        for(let i = 0;i < this.pipeList.length;i++)
        {
            if (this.pipeList[i])
            {
                // console.log("check game end ....")
                
                let _complete = this.pipeList[i].isComplete();

                // console.log("check game end 222....",_complete);

                if(!_complete)
                {
                    // console.log("check game end 333....")
                    _success = false;
                    break;
                }
            }
        }

        // console.log("is success : ",_success)
        if (!_success)
        {
            if (_timeOut) 
            {
                this.clearBoard();

                this.gStatus = GAME_STATUS.FAIL;
                this.reviveCnt += 1;
                if (this.reviveCnt <= this.maxReviveCnt)
                {
                    setTimeout(() => {
                
                        UIHelper.displayUI("UIRevive",null,true,true,null);

                        console.log(" you over game time out : ", this.isGameSuccess());
                        
                    }, 1000);
                    return;
                }
            }
        }
        else 
        {
            this.clearBoard();
                
            this.gStatus = GAME_STATUS.SUCCESS;

            //进入下一阶段
            if (this.checkNextProcesses())
            {
                setTimeout(() => {
                    
                    this.gStatus = GAME_STATUS.PLAYING;
                    Observer.fire(Observer.EVENT_NAME.GAME_NEXT_PROCESSES, true);
                    
                    this.couldSaveBoard = true;
                    this.saveBoard();
                }, 800);

                return;
            }
        }
      
        if (this.isGameEnd())
        {
            this.realGameEnd(1.6);
        }
    },

    realGameEnd(_delay)
    {
        UIHelper.hideUI("UIPause");
        // UIHelper.hideUI("PropPop");

        let pn = "UISettlement"
        if (this.isGameSuccess())
        {
            let _lll = ItemMgr.getLevel();
            if (_lll == 1 || _lll == 2 || _lll == 3 || _lll % 5 == 0)
            {
                let _eID = "Level" + _lll;
                PlatformTool.logEvent(_eID);
            }

            MissionMgr.addMission(MISSION_TYPE.LEVEL, 1);
            ItemMgr.addItemCount(ITEM_TYPE.STREAK, 1, false);
            ItemMgr.addItemCount(ITEM_TYPE.LEVEL, 1, true);
        }
        else
        {
            pn = "UIFail";
            ItemMgr.setItemCount(ITEM_TYPE.STREAK, 0, true);
        }
        
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
        setTimeout(() => {
            
            UIHelper.displayUI(pn,null,true,true,null);

            console.log(" you over game : ", this.isGameSuccess());
            
        }, _delay * 1000);
    },

    revive()
    {
        this.gStatus = GAME_STATUS.PLAYING;
        Observer.fire(Observer.EVENT_NAME.GAME_CONTINUE);
    },


    isGamePlaying()
    {
        return this.gStatus == GAME_STATUS.PLAYING;
    },

    isGameEnd()
    {
        return this.gStatus == GAME_STATUS.FAIL || this.gStatus == GAME_STATUS.SUCCESS;
    },

    isGameSuccess()
    {
        return this.gStatus == GAME_STATUS.SUCCESS;
    },

    /** 检测是否可以进行下一阶段 */
    checkNextProcesses()
    { 
        let _nPIndex = this.processIndex + 1;
        if (_nPIndex >= this.levelJson.processes.length)
        {
            return false;
        }

        return true;
    },
    
    clearGame()
    {
        this.reviveCnt = 0;
        this.processIndex = 0;
        this.leaveProcessTime = 0;

        this.leaveLockNumber = 0;
        this.couldSaveBoard = false;

        this.selectPipe = null;
        this.selectBlocks.length = 0;

        this.stepMessageMap.length = 0;
        
        this.isSortedInHint = false;

        this.gStatus = GAME_STATUS.IDLE;

        this.clearPipe();
        this.blockList.length = 0;
    },

    reCalcLevel(_level)
    {
        let _circleMinLevel = 12;
        let _circleMaxLevel = this.maxLevel;
        let _circleDelta = _circleMaxLevel - _circleMinLevel;

        if (_level < 1) _level = 1;
        if (_level > _circleMaxLevel)
        {
            let _l2 = (_level - _circleMaxLevel) % _circleDelta;
            if (_l2 == 0) _l2 = _circleDelta;

            _level = _circleMinLevel + _l2
        }

        console.log("real level : ", _level);
        return _level;
    },

    getLayoutScale()
    {
        if (CocosHelper.isEmpty(this.levelJson.scale)) return 1;
        else if (this.levelJson.scale <= 0) return 1;
        else return this.levelJson.scale;
    },
    
    willRewardCurrency: 0,
    /** 计算结算的时候的奖励 */
    computeRewardCurrency()
    {
        if (CocosHelper.isEmpty(this.levelJson)) this.willRewardCurrency = 100;
        else
        {
            this.willRewardCurrency = this.levelJson.processes.length > 1 ? 100 : 50;    
        }
        
    },
    
    /** 获取拖尾宽度 */
    getTrailWidth()
    {
        return this.getLayoutScale() * (this.blockWidth - 2);
    },

    /** 获取所有特殊颜色的管道 */
    getColorPipes(_json)
    {
        if (!_json) return null;

        // console.log(_json);
        let _arr = [];
        for (let i = 0; i < _json.processes.length; i++)
        {
            let _process = _json.processes[i];
            for (let j = 0; j < _process.pipes.length; j++)
            {
                let _pipe = _process.pipes[j];
                if (this.isValidColor(_pipe.pipeColor))
                {
                    _arr.push(_pipe.pipeColor)
                }
            }
        }

        // console.log(_arr);

        return _arr;
    },


    couldSaveBoard : false,
    saveBoard()
    {
        // console.log(1111111);
        if (!this.isGamePlaying()) return;
        if (!this.couldSaveBoard) return;

        // 新手引导关卡不保存数据
        let _level = ItemMgr.getLevel()
        if (_level == 1 || _level == 3) return;

        // console.log(1122225);

        let arg = {
            level: _level,
            time: this.levelJson.time,
            leaveTime : this.leaveProcessTime,
            levelType : this.levelJson.levelType,
            processIndex : this.processIndex,
            pipeList : [],
        }

        let _couldSave = true;
        for (let i = 0; i < this.pipeList.length; i++)
        {
            let pipe = this.pipeList[i];
            if (!cc.isValid(pipe)) continue;

            let _pd = pipe.getSavedCells();
            if (!_pd) return;

            arg.pipeList.push(_pd);
        }

        // console.log(arg);
        StorageHelper.saveBoardData(arg);
        
        this.couldSaveBoard = false;
    },

    clearBoard()
    {
        StorageHelper.saveBoardData("");
    },
    
    checkSavedBoardValid()
    { 
        let _boardData = StorageHelper.readBoardData();
        if (CocosHelper.isEmpty(_boardData)) return null;

        // console.log(_boardData);
        // console.log("this board 1");
        try
        {
            if (isNaN(_boardData.time)) return null;
            if (isNaN(_boardData.level)) return null;
            if (isNaN(_boardData.leaveTime)) return null;
            if (isNaN(_boardData.processIndex)) return null;
            
            // console.log("this board 2");
            
            if (_boardData.level != ItemMgr.getLevel()) return null;
            if (_boardData.processIndex >= this.levelJson.processes.length) return null;
            
            // console.log("this board 3");
            
            if (_boardData.levelType != this.levelJson.levelType) return null;
            if (_boardData.time != this.levelJson.time) return null;
            if (_boardData.leaveTime < 0) return null;

            // console.log("this board 4");

            let sdPipeList = _boardData.pipeList;
            if (CocosHelper.isEmpty(sdPipeList)) return null;

            // console.log("this board 5");
            let _process = this.levelJson.processes[_boardData.processIndex];
            let cPipeList = _process.pipes;
            
            if (sdPipeList.length != cPipeList.length) return null;
            // console.log("this board 6");
            for (let i = 0; i < cPipeList.length; i++)
            {
                let sdp = sdPipeList[i];
                let cp = cPipeList[i];
                
                // console.log(sdp, "  ", cp);
                
                if (CocosHelper.isEmpty(sdp) || CocosHelper.isEmpty(cp))
                {
                    return null;
                }

                if (CocosHelper.isEmpty(sdp.cells) || CocosHelper.isEmpty(cp.cells))
                {
                    return null;
                }
                
                // console.log("this board 7");
                
                if (sdp.cells.length != cp.cells.length) return null;
                if (sdp.pipeColor != cp.pipeColor) return null;
                if (sdp.pipeType != cp.pipeType) return null;
            }
        }
        catch (e)
        {
            console.log("check board error");
            return null;
        }
        return _boardData;
    },
    
    cacheColors: [
        "#115426ff",
        "#b1610cff",
        "#093171ff",
        "#20730dff",
        "#620a9aff",
        "#721276ff",
        "#035f91ff",
        "#691e0dff",
        "#ffffffff",
    ],
    
    getColorByID(_color)
    { 
        if(this.isValidColor(_color))
            return this.cacheColors[_color - 1];
        
        return this.cacheColors[this.cacheColors.length - 1];
    },
    
    levelJson: 
    {
        /** 等级标志 */
        level: 1,
        
        /** 关卡类型 */
        levelType: LEVEL_MODE.NORMAL,
        
        /** 关卡难度 */
        difficulty : DIFFICULTY.EASY,
        
        /** 计时，只有计时关卡才有效 */
        time: 100,
                
        /** 关卡的流程，绝大多数只有一个流程，升级类关卡则有多个流程 */
        processes: [
            {
                /** 计时，只有计时关卡才有效 */
                time: 100,

                /** 关卡的管道列表 */
                pipes:
                    [
                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: -200,
                            y: -200,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.RED,lock : 0,mask : 1},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                    {color : COLOR.YELLOW,lock : 0,mask : 1},
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 0,
                            y: -200,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: -100,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 1},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.YELLOW,
                            
                            x: 250,
                            y: -100,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 100,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.CACHE,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 250,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.GENERATOR,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 250,
                            y: -300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.GREEN,lock : 0,mask : 0},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                ]
                        }
                    
                    ]
                
                
            },
            
            {
                /** 计时，只有计时关卡才有效 */
                time: 100,

                /** 关卡的管道列表 */
                pipes:
                    [
                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: -200,
                            y: -200,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.RED,lock : 0,mask : 1},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                    {color : COLOR.YELLOW,lock : 0,mask : 1},
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 0,
                            y: -200,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.GREEN,lock : 0,mask : 1},
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: -100,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 1},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.YELLOW,
                            
                            x: 250,
                            y: -100,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.YELLOW,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.NORMAL,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 100,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                    {color : COLOR.NULL,lock : 1,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.CACHE,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 250,
                            y: 300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                    {color : COLOR.NULL,lock : 0,mask : 0},
                                ]
                        },

                        {
                            /** 管道类型 */
                            pipeType: PIPE_TYPE.GENERATOR,

                            /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                            pipeColor: COLOR.NULL,
                            
                            x: 250,
                            y: -300,

                            /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                            cells:
                                [
                                    {color : COLOR.GREEN,lock : 0,mask : 0},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                    {color : COLOR.RED,lock : 0,mask : 0},
                                ]
                        }
                    
                    ]
                
                
            }
        ]

        
        
    },

}