/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 23:17:06
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-10 00:03:21
 * @FilePath: \WaterSort\assets\script\Pipe.js
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
const Config = require("./Config");
const { COLOR, PIPE_TYPE, ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const GameParamsHelper = require("./GameParamsHelper");
const GuideHelper = require("./GuideHelper");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const PoolHelper = require("./PoolHelper");
const SSDScript = require("./SSDScript");
const TouchHelper = require("./TouchHelper");

cc.Class({
    extends: SSDScript,

    properties: {
        touch : cc.Node,
        image: cc.Node,
        
        cellPar: cc.Node,
        blockPar: cc.Node,
        generatorInfo : cc.Node,
        generatorOverNode : cc.Node,
        conveyor : cc.Node,

        generatorPipeNode: cc.Node,
        normalPipeNode : cc.Node,
        cachePipeNode2 : cc.Node,
        cachePipeNode: cc.Node,

        normalPipeBotDi : null,
        
        wrongTip: cc.Node,
        completeTip: cc.Node,
        completeMask: cc.Node,
        colorTip: cc.Node,
        ctImage: cc.Sprite,
        
        normalBGFrame : cc.SpriteFrame,
        cacheBGFrame : cc.SpriteFrame, 

        isGenerated: false,
        uncontrollable: false,
        fillingTag : 0,
        lockNumber : 0,
        realHeight : 0,
    
        blockList : [],
        cellList: [],
        
        /** 是否填充完成 */
        isFull : false,

        baseBlockParY : 0,

        externalData: null,
        
        px : {
            get: function ()
            {
                if(this.data) return this.data['x'];
            }
        },
        py : {
            get: function ()
            {
                if(this.data) return this.data['y'];
            }
        },
        py : {
            get: function ()
            {
                if(this.data) return this.data['y'];
            }
        },
        pipeType : {
            get: function ()
            {
                if(this.data) return this.data['pipeType'];
            }
        },
        pipeColor : {
            get: function ()
            {
                if(this.data) return this.data['pipeColor'];
            }
        },
        cells : {
            get: function ()
            {
                if(this.data) return this.data['cells'];
            }
        },

        length : {
            get: function ()
            {
                if(this.cells) return this.cells.length;
            }
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    

    start () {
        Observer.registerMass(Observer.EVENT_NAME.SET_GUIDE_TIP, this.setGuideTip, this);
        Observer.registerMass(Observer.EVENT_NAME.HIDE_GUIDE_TIP, this.hideGuideTip, this);

        TouchHelper.bindTouch(this.touch,
        () =>
        {
            if (GameMgr.isGameEnd()) return;

            if(GameMgr.selectPipe == this)
            {
                if (GuideHelper.isWrongGuide2(this.node))
                {
                    return;
                }

                //之前选择的方块回到原位
                GameMgr.moveDownInSelectBlocks();
                return;
            }

            if(GameMgr.isHaveSelect())
            {
                if (GuideHelper.isWrongGuide2(this.node))
                {
                    return;
                }
                
                if (GuideHelper.isRightGuide2(this.node))
                {
                    Observer.fireMass(Observer.EVENT_NAME.HIDE_GUIDE_TIP);
                    GuideHelper.setGuideTarget1(null, false);
                    GuideHelper.setGuideTarget2(null);
                    GuideHelper.displayHandAnima(0);
                }

                let _tb = GameMgr.selectBlocks[0];
                if(this.isCouldMerge(_tb.color))
                {
                    this.fillBlock(GameMgr.selectPipe,GameMgr.selectBlocks, true, true,false);
                }   
                else
                {
                    this.tapAction();
                }
            } 
            else
            {
                if (GuideHelper.isWrongGuide1(this.node))
                {
                    return;
                }
                
                if (GuideHelper.isRightGuide1(this.node))
                {
                    Observer.fireMass(Observer.EVENT_NAME.SET_GUIDE_TIP);
                    GuideHelper.displayHandAnima(2);
                }
                
                this.tapAction();
            }
        },
        () => {},
        () => { });
    },

    // update (dt) {},

    setExternalData(_eData)
    { 
        this.externalData = _eData;
    },
    
    setData()
    {
        if (this.cells.length == 0)
        {
            console.error("the cell count in pipe is zero");
            this.restore();      
            return;
        }

        this.uniqueID = ++Config.uniqueID;
        GameMgr.addPipe(this);
        
        this.cellList = [];
        this.blockList = [];

        this.lockNumber = 0;
        this.isFull = false;
        this.fillingTag = 0;
        this.uncontrollable = false;

        this.realHeight = GameMgr.getPipeHeight(this.length);
        let _vHeight = GameMgr.getPipeValidHeight(this.length);

        this.node.position = cc.v2(this.px, this.py);

        this.normalPipeBotDi = this.normalPipeNode.getChildByName("bot_di");
        this.normalPipeBotDi.y = 0;
        this.normalPipeNode.active = this.pipeType == PIPE_TYPE.NORMAL;
        let normalDiImage = this.normalPipeBotDi.getChildByName("image2");

        this.cachePipeNode.active = this.pipeType == PIPE_TYPE.CACHE;
        this.cachePipeNode2.active = this.pipeType == PIPE_TYPE.CACHE;
        // this.node.getChildByName("cache_bot_di").active = this.pipeType == PIPE_TYPE.CACHE;

        this.generatorPipeNode.active = this.pipeType == PIPE_TYPE.GENERATOR;
        this.generatorInfo.opacity = 255;
        this.generatorOverNode.opacity = 0;
        this.conveyor.getComponent("Conveyor").stop();
        

        let _oy = GameMgr.baseOffsetInPipe;
        this.cellPar.position = cc.v2(0,_oy);
        this.blockPar.scale = 1;
        this.blockPar.position = cc.v2(0,_oy);
        this.baseBlockParY = this.blockPar.y;


        
        this.completeTip.y = this.realHeight + 25;
        this.completeTip.active = true;
        this.completeTip.opacity = 0;

        this.wrongTip.y = this.realHeight + 25;
        this.wrongTip.active = true;
        this.wrongTip.opacity = 0;



        this.completeMask.opacity = 0;
        this.completeMask.height = _vHeight + 1;
        this.completeMask.width = GameMgr.pipeWidth;
        this.completeMask.y = this.realHeight - _vHeight + 0.5;
        
        let _t_over_width = 40;
        let _t_over_height = 50;
        this.image.opacity = 255;
        if (this.pipeType == PIPE_TYPE.NORMAL)
        {
            this.touch.width = GameMgr.pipeWidth + _t_over_width;
            this.touch.height = this.realHeight + _t_over_height;
            this.touch.y = -_t_over_height * 0.6;
            
            let _spf_di = GameMgr.getPipeFrame(this.pipeColor + "_" + 1);
            let _spf = GameMgr.getPipeFrame(this.pipeColor + "_" + 2);
            this.image.getComponent(cc.Sprite).spriteFrame = _spf;
            normalDiImage.getComponent(cc.Sprite).spriteFrame = _spf_di;
            
            this.image.height = this.realHeight;
        }
        else if (this.pipeType == PIPE_TYPE.CACHE)
        {
            this.touch.width = GameMgr.pipeWidth + _t_over_width;
            this.touch.height = this.realHeight + _t_over_height;
            this.touch.y = -_t_over_height * 0.6;

            this.image.getComponent(cc.Sprite).spriteFrame = this.cacheBGFrame;
            this.image.height = this.realHeight;
            
            let _c_image_1 = CocosHelper.getChildByPath(this.cachePipeNode, "cache_bot_di/image2");
            _c_image_1.height = this.realHeight + 56;
        }
        else if (this.pipeType == PIPE_TYPE.GENERATOR)
        {
            this.image.opacity = 0;
            
            this.touch.width = 120 + _t_over_width;
            this.touch.height = 120 + _t_over_height;
            this.touch.y = -_t_over_height * 0.6;
        }


        this.isGenerated = false;
        this.generate();

        this.refreshColorTipState();

    },

    generate()
    {
        if (this.isGenerated) return;
        this.isGenerated = true;

        let _sdCells = this.externalData ? this.externalData.cells : null;

        let _cn = this.cells.length;
        for (let i = 0; i < this.cells.length; i++)
        {
            let _cInfo = this.cells[i];
            let _sInfo = _sdCells ? _sdCells[i] : null;

            let _color = _cInfo.color;
            let _isLock = _cInfo.lock == 1;
            let _isMask = _cInfo.mask == 1;
            if (_sInfo)
            {
                _color = _sInfo.color;
                _isLock = _sInfo.lock == 1;
                _isMask = _sInfo.mask == 1;
            }

            if(_isLock)
            {
                if(GameMgr.isValidColor(_color))
                {
                    console.error("color and lock is together,please check......");
                    _isLock = false;
                    continue;
                }
            }
            
            if (GameMgr.isValidColor(_color))
            {
                let b = PoolHelper.getNote(PoolHelper.POOL_NAME.BLOCK, true, this.blockPar);
                let _bk = b.getComponent("Block");

                _bk.data = {
                    color : _color,
                    lock: _cInfo.lock,
                    mask : _cInfo.mask,
                };

                _bk.setHideState(true);
                _bk.setMaskState(_isMask,false,0);
                _bk.setSeat(i,this.pipeType,true);

                this.blockList.push(_bk);
            }
            
            let c = PoolHelper.getNote(PoolHelper.POOL_NAME.CELL, true, this.cellPar);
            let _cl = c.getComponent("Cell");
            _cl.data = {
                seat : i,
                isLock: _isLock,
                lockFrameIdx : _cn - 1 - i,
                pLength : this.length,
                pipeType : this.pipeType,
            };

            if (_isLock)
            {
                this.lockNumber += 1;
                GameMgr.leaveLockNumber += 1;
            }

            this.cellList.push(_cl);
        }
        
        this.checkDisplayInGenerator(false);
        this.refreshGeneratorInfo(false, false);
        
        if (_sdCells)
        {
            this.checkFull(false,false);
        }
    },

    /**
     * 填充方块
     * @param 方块列表 bArr 
     * @param 是否平滑移动 smooth 
     * @param 溢出的方块是否回退 _cBack 
     * @param 是否为回退 _undo 
     */
    fillBlock(_fromPipe,_bArr,smooth,_cBack,_undo)
    {
        if (_bArr.length == 0) return;

        if (_fromPipe) _fromPipe.node.setSiblingIndex(99);
        this.node.setSiblingIndex(100);

        // this.uncontrollable = true;
        this.fillingTag += 1;

        let _maxLen = this.length;
        let _bLen = this.blockList.length;

        let _oArr = [];
        let _aArr = [];
        
        for (let i = 0; i < _bArr.length; i++)
        {
            let _ti = i + _bLen;
            let _b = _bArr[i];

            if (this.blockList.length == _maxLen || _ti >= this.cellList.length || this.cellList[_ti].isLocked())
            {
                _oArr.push(_b);
            }
            else _aArr.push(_b); 
        }

        let _rPMessage = null;
        let _rPoints = [];
        for(let i = 0;i < _aArr.length;i++)
        {
            let _b = _aArr[i];
            this.blockList.push(_b);

            let _isEndI = i == _aArr.length - 1;
                
            let _seat = _bLen + i;
            let _tLPos = GameMgr.getCellPosBySeat(_seat,this.pipeType);
            
            let _pArr = [];
            if (smooth)
            {
                let _fPos = GameMgr.getPosInUpper(_b.node, cc.v2());
                let _tPos = GameMgr.getPosInUpper(this.blockPar, _tLPos);

                let _fTPos = _fromPipe.getTopCornerPosInPipe();
                _fTPos = GameMgr.getPosInUpper(_fromPipe.node,_fTPos);

                let _tTPos = this.getTopCornerPosInPipe();
                _tTPos = GameMgr.getPosInUpper(this.node,_tTPos);


                let _isBezier = true;


                _b.node.parent = GameMgr.upperPar;
                _b.node.position = _fPos;
                _b.node.setSiblingIndex(0);
                
                let _c_y = Math.max(_fTPos.y,_tTPos.y);
                let _delta_y = Math.abs(_fPos.y - _tPos.y); 
                if(_isBezier)
                {
                    _c_y += 80;
                    let _c_x = (_fTPos.x + _tTPos.x) * 0.5;
                    let _cCtrl = cc.v2(_c_x,_c_y);
                    _pArr = [_fPos,_cCtrl,_tPos];
                }
                else
                {
                    _c_y += 80;
                    let _c_corner_pos1 = cc.v2(_fTPos.x - 2,_c_y);
                    let _c_corner_pos2 = cc.v2(_fTPos.x - 1,_c_y);
                    let _c_corner_pos3 = cc.v2(_fTPos.x,_c_y);
                    let _c_corner_pos4 = cc.v2(_fTPos.x + 1,_c_y);
                    let _c_corner_pos21 = cc.v2(_tTPos.x - 2,_c_y);
                    let _c_corner_pos22 = cc.v2(_tTPos.x - 1,_c_y);
                    let _c_corner_pos23 = cc.v2(_tTPos.x,_c_y);
                    let _c_corner_pos24 = cc.v2(_tTPos.x + 1,_c_y);
                    if(_delta_y < 200)
                    {
                        _pArr = [
                            _fPos,
                            _c_corner_pos1,_c_corner_pos2,_c_corner_pos3,_c_corner_pos4,
                            _c_corner_pos21,_c_corner_pos22,_c_corner_pos23,_c_corner_pos24,
                            _tPos];
                    }
                    else 
                    {
                        if(_fPos.y > _tPos.y)
                        {
                            _pArr = [
                                _fPos,
                                _c_corner_pos1,_c_corner_pos2,_c_corner_pos3,
                                _c_corner_pos21,_c_corner_pos22,_c_corner_pos23,_c_corner_pos24,
                                _tPos];
                        }
                        else 
                        {
                            _pArr = [
                                _fPos,
                                _c_corner_pos1,_c_corner_pos2,_c_corner_pos3,_c_corner_pos4,
                                _c_corner_pos21,_c_corner_pos22,_c_corner_pos23,
                                _tPos];
                        }
                    }
                }

                let _isRoad = false;
                if(_isBezier && _rPoints && _rPoints.length > 0)
                {
                    _pArr = [].concat(_rPoints);
                    _pArr.unshift(_fPos);

                    let _splitArr = [];
                    for(let j = _pArr.length - 1;j >= 0;j--)
                    {
                        if(_pArr[j].y <= _tPos.y + 13)
                        {
                            _splitArr.push(_pArr[j]);
                        }
                        else break;
                    }

                    CocosHelper.removeArrayFromArray(_pArr,_splitArr);
                    _pArr.push(_tPos);

                    _isRoad = true;
                }

                let _newTime = _rPMessage ? _rPMessage.time : -1;
                let _temp_rPMessage = _b.moveOther(_isBezier,i,this.pipeType,_seat,_isEndI,_pArr,_isRoad,_newTime,() =>
                {
                    _b.node.parent = this.blockPar;
                    _b.node.position = _tLPos;

                    if (_isEndI)
                    {
                        //检测完成新手引导的步骤
                        let _level = ItemMgr.getLevel();
                        if (_level == 1)
                        {
                            GuideHelper.completeGuideStep();
                            if (GuideHelper.checkGuideStep(1))
                            {
                                GuideHelper.setGuideByStep(1);
                            }
                            else if (GuideHelper.checkGuideStep(2))
                            {
                                GuideHelper.setGuideByStep(2);
                            } 
                        }
                        else if (_level == 3)
                        {
                            GuideHelper.completeGuideStep();
                            if (GuideHelper.checkGuideStep(5))
                            {
                                GuideHelper.completeGuide();
                            } 
                        }
                        

                        // this.uncontrollable = false;
                        this.fillingTag -= 1;
                        this.refreshBlockSiblingIndex();

                        if(this.fillingTag <= 0)
                            this.checkFull(true,true);
                        
                        // 刷新生成式管道的数据，在此处调用，表明处于回退阶段
                        this.checkDisplayInGenerator(false);
                        this.refreshGeneratorInfo(true, true);
                        
                    }
                });

                if(_temp_rPMessage)
                {
                    if (!_rPMessage)
                    {
                        _rPMessage = _temp_rPMessage;
                    }
                    
                    if(!_rPoints || _rPoints.length == 0) 
                    {
                        _rPoints = _temp_rPMessage.points;
                    }
                }
                
            }
        }

        if(!_undo)
        {
            // console.log(_aArr);
            //记录每一步的移动
            GameMgr.recordStepMessage(_fromPipe,this,_aArr);
        }

        GameMgr.removeBlocksFromPipe(_fromPipe,_aArr);
        GameMgr.moveDownInSelectBlocks(_oArr);
        GameMgr.couldSaveBoard = true;

        this.refreshColorTipState(true);
    },


    refreshBlockSiblingIndex()
    { 
        for (let i = 0; i < this.blockList.length; i++)
        {
            let _b = this.blockList[i];
            if (_b.node.parent != this.blockPar) continue;

            _b.node.setSiblingIndex(i);
        }
    },
    
    /**
     * 管道是否填充完毕
     * @param 检测是否完成游戏 _checkSuccess
     * @returns 
     */
    checkFull(_checkSuccess,_smooth)
    {
        if (this.isFull) return true;
        
        if (this.lockNumber > 0) return false;

        if (this.pipeType == PIPE_TYPE.CACHE) return false;
        if (this.pipeType == PIPE_TYPE.GENERATOR) return false;

        if (this.blockList.length != this.length) return false;

        let _color = -1;
        for (let i = 0; i < this.blockList.length; i++)
        {
            let _b = this.blockList[i];
            
            if (_b.isMask) return false;
            
            if (_color == -1) _color = _b.color; 
            
            if (_color != _b.color) return false;

            if (GameMgr.isValidColor(this.pipeColor))
            {
                if (_b.color != this.pipeColor) return false;
            }
        }

        this.isFull = true;
        
        this.displayFullAnima(true,_smooth);
        

        if(_checkSuccess) GameMgr.checkGameEnd();

        return true;
    },

    displayFullAnima(_complete,_smooth)
    {
        let _ty = _complete ? this.baseBlockParY + GameMgr.upYInComplete : this.baseBlockParY;
        let _ts = _complete ? 1 : 1;

        this.uncontrollable = true;
        let _upYSpace = GameMgr.upYInComplete / (this.length - 1)

        if (_smooth)
        {
            cc.tween(this.blockPar)
                .delay(0.3)
                .call(() =>
                {
                    AudioHelper.playAudio(AudioHelper.AUDIO_NAME.COMPLETE)
                    
                    if(_complete)
                    {
                        for (let i = 0; i < this.blockList.length; i++)
                        {
                            let _b = this.blockList[i];
                            _b.moveInFull(i,i * _upYSpace,this.blockList.length,true);
                        }
                    }
                })
                .to(GameMgr.timeInFull, { y: _ty, scale: _ts })
                .call(() =>
                {
                    this.uncontrollable = false;
                })
                .start();
        }
        else
        {
            if(_complete)
            {
                for (let i = 0; i < this.blockList.length; i++)
                {
                    let _b = this.blockList[i];
                    _b.moveInFull(i,i * _upYSpace,this.blockList.length,false);
                }
            }

            this.blockPar.y = _ty;
            this.blockPar.scale = _ts;

            this.uncontrollable = false;
            
        }
        
        
        
        let _d_ty = _complete ? GameMgr.upYInCompleteInBotDi : 0;
        if (_smooth)
        {    
            cc.tween(this.normalPipeBotDi)
                .delay(0.3)
                .to(GameMgr.timeInFull, { y: _d_ty })
                .start();   
        }
        else 
        {
            this.normalPipeBotDi.y = _d_ty;
        }
        
        let _cmOpacity = _complete ? 255 : 0;
        let _d_c_t = _complete ? (0.3 + GameMgr.timeInFull) : 0;
        if (_smooth)
        {            
            cc.tween(this.completeMask)
                .delay(_d_c_t)
                .to(GameMgr.timeInFull2 * 2, { opacity: _cmOpacity})
                .start();
        }
        else
        {
            this.completeMask.opacity = _cmOpacity;    
        }
        
        if (!GuideHelper.inGuiding)
        {
            let _t_o = _complete ? 255 : 0;
            if (_smooth)
            {
                cc.tween(this.completeTip)
                    .delay(0.3)
                    .to(GameMgr.timeInFull, {opacity: _t_o})
                    .start();
            }
            else
            {
                this.completeTip.opacity = _t_o;    
            }
            
        }
    },

    /**
     * 管道是否填充完成
     * @returns 
     */
    isComplete()
    {
        if (this.pipeType == PIPE_TYPE.CACHE || this.pipeType == PIPE_TYPE.GENERATOR) 
        {
            console.log("cache or generator ","   length : ",this.blockList.length)
            return this.blockList.length == 0;
        }
        // console.log("isFull : ",this.isFull,"   length : ",this.blockList.length)
        return this.isFull || this.blockList.length == 0;
    },

    tapAction()
    {
        //之前选择的方块回到原位
        GameMgr.moveDownInSelectBlocks();

        if (this.isFull) return;
        if (this.uncontrollable) return;
        if (this.fillingTag > 0) return;

        let _bArr = this.getTapBlocks();

        if(!_bArr || _bArr.length == 0)
        {
            return;
        }

        if(GameParamsHelper.couldShake) PlatformTool.vibrateAction(30);
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.HIT);
        
        GameMgr.checkGameStart();
        GameMgr.moveUpInSelectBlocks(this, _bArr);
        
        this.node.setSiblingIndex(100);
    },

    /**
     * 获取要抬起来的方块列表,从上到下
     * @returns 
     */
    getTapBlocks()
    {
        if (!this.blockList || this.blockList.length == 0) return null;
        if (this.uncontrollable) return null;
        if (this.fillingTag > 0) return null;

        let _arr = [];
        let _color = COLOR.NULL;
        for(let i = this.blockList.length - 1;i >= 0;i--)
        {
            let _b = this.blockList[i];
            if(_b.isBreakTap())
            {
                // console.log("b controllable:",_b.uncontrollable)
                _arr.length = 0;
                break;
            }

            if (_color == COLOR.NULL) _color = _b.color; 

            if(!_b.isCouldTap(_color)) break;

            _arr.push(_b);
        }

        //如果是生成式管道，则只取最上层的一个方块
        if(this.pipeType == PIPE_TYPE.GENERATOR)
        {
            if(_arr.length > 1)
            {
                _arr.splice(1);
            }
        }
        

        return _arr;
    },

    /**
     * 管道内是否可以放置该颜色
     * @param 要放置的方块的颜色 _color 
     * @returns 
     */
    isCouldMerge(_color)
    {
        if (this.pipeType == PIPE_TYPE.GENERATOR) return false;

        //不可操作状态
        if(this.uncontrollable) 
        {
            console.log("can't controllable!");
            return false;
        }

        //特定的颜色管道，颜色不同，不能放置
        if(GameMgr.isValidColor(this.pipeColor))
        {
            // console.log("pipe's color is : ",this.pipeColor);
            if(this.pipeColor == _color)
            {
                return true;
            }
            
            return false;
        }

        //锁和块的个数等于管道的长度，则无空间
        if(this.blockList.length + this.lockNumber == this.length) 
        {
            return false;
        }

        //块的个数为0，则可以放置任意颜色
        if(this.blockList.length == 0)
        {
            return true;
        }
        else
        {
            //管道放满了块
            if(this.blockList.length == this.length)
            {
                console.log("pipe is man")
                return false;
            }

            let _tb = this.blockList[this.blockList.length - 1];

            //管道内上层的块的颜色和要移动过去的颜色一样
            if(_tb.color == _color)
            {
                //管道内上层的块处于遮罩状态，则不能放置
                if(_tb.isMask)
                {
                    return false;
                }

                return true;
            }

            return false;
        }
    },
    
    /** 当前管道是否可以回退 */
    isCouldUndo()
    {
        return !this.uncontrollable && this.fillingTag <= 0;
    },

    /** 正式回退 */
    realUndo(_fromPipe,_bArr)
    {
        this.fillBlock(_fromPipe,_bArr,true,false,true);
    },

    isHasLock()
    { 
        return this.lockNumber > 0;
    },
    
    /** 解锁管道中的一个锁 */
    releaseOneLock()
    {
        for (let i = 0; i < this.cellList.length; i++)
        {
            let c = this.cellList[i];
            if (c.isLock)
            {
                this.lockNumber -= 1;
                c.setLockState(false,true);
                break;
            }
        }
    },

    calcLock()
    {

    },

    /**
     * 方块回退到管道中
     * @param {*} _bArr 
     */
    downBlocks(_bArr)
    {
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
    },

    /**
     * 将方块从管道中移除,
     * 1、并检测下方是否有被遮罩的方块
     * 2、如果是生成式管道，则进行信息刷新
     * @param {*} _rArr 
     */
    removeBlocks(_rArr)
    {
        CocosHelper.removeArrayFromArray(this.blockList, _rArr);
    

        this.checkDisplayInGenerator(true);
        this.refreshGeneratorInfo(true,false);

        let _len = this.blockList.length;
        if (_len != 0)
        {
            let _b = this.blockList[_len - 1];
            let _bc = _b ? _b.color : COLOR.NULL;

            if (GameMgr.onlyOneMask)
            {
                if (_b && _b.isMask && _b.color == _bc)
                {
                    _b.setMaskState(false,true,0);
                }
            }
            else
            {
                for (let i = _len - 1; i >= 0; i--)
                {
                    let _b2 = this.blockList[i];
                    if (_b2 && _b2.isMask && _b2.color == _bc)
                    {
                        _b2.setMaskState(false, true, 0);
                    }
                    else break;
                }
            }
            
        }

        this.refreshColorTipState(true);

        //回退时，将方块从管道中移除，如果之前是填充完成的状态，则恢复未填充完成的状态
        if(this.isFull)
        {
            this.isFull = false;
            
            this.displayFullAnima(false,true);
        }
    },

    /** 检测 生成式管道 的 最上层方块 是否展示 */
    checkDisplayInGenerator(_smooth = true)
    {
        if (this.pipeType == PIPE_TYPE.GENERATOR)
        {
            let _ca = () =>
            {
                let _len = this.blockList.length;
                for(let i = 0;i < _len;i++)
                {
                    let _b = this.blockList[i];
    
                    let _display = i == _len - 1;
                    _b.displayInGenerator(_display,_smooth);
                }
            }
            
            if(_smooth)
            {
                this.scheduleOnce(_ca,GameMgr.timeInSuccessMove);
            }
            else _ca();
        }
    },

    /**  */
    /**
     * 刷新 生成式管道 的 ui展示
     * @param 是否有缓动动画 _smooth 
     * @param 是否反序 _reverse 
     * @returns 
     */
    refreshGeneratorInfo(_smooth,_reverse)
    {
        if (this.pipeType != PIPE_TYPE.GENERATOR) return;

        let _tVal = this.blockList.length - 1;
        let _fVal = _smooth ? (_reverse ? _tVal - 1 : _tVal + 1) : _tVal; 
        // let _val = _reverse ? this.blockList.length - 2 : this.blockList.length - 1;
        // let _val2 = _reverse ? this.blockList.length - 1 : this.blockList.length - 2;
        console.log(_fVal, _tVal);

        let _show = _tVal >= 0;

        if (_smooth)
        {
            if (!_show)
            {
                cc.tween(this.generatorInfo)
                    .delay(GameMgr.timeInSuccessMove)
                    .to(0.2, { opacity: 0 })
                    .call(() =>
                    {
                        this.generatorOverNode.opacity = 255;
                    })
                    .start();
                
                return;
            }
        }
        this.generatorInfo.opacity = _show ? 255 : 0;
        this.generatorOverNode.opacity = _show ? 0 : 255;
        
        let _y2 = 80;
        let nLabel = this.generatorInfo.getChildByName("number");
        let nLabel2 = this.generatorInfo.getChildByName("number2");

        nLabel.stopAllActions();
        nLabel2.stopAllActions();
        nLabel.position = cc.v2();
        nLabel2.position = cc.v2(0, _reverse ? -_y2 : _y2);

        if (_fVal < 0) _smooth = false;

        if (_smooth)
        {
            nLabel.getComponent(cc.Label).string = _fVal;
            nLabel2.getComponent(cc.Label).string = _tVal;
            let _delay = _reverse ? 0.01 : GameMgr.timeInSuccessMove;

            let _ty = _reverse ? _y2 : -_y2;
            cc.tween(nLabel)
                .delay(_delay)
                .call(() =>
                {
                    this.conveyor.getComponent("Conveyor").play();
                })
                .to(0.6, { y: _ty })
                .call(() =>
                {
                    nLabel.position = cc.v2();

                    nLabel2.stopAllActions();
                    nLabel2.position = cc.v2(0, _y2);
                    
                    nLabel.getComponent(cc.Label).string = _tVal;

                    this.conveyor.getComponent("Conveyor").stop();
                }).start();
            cc.tween(nLabel2)
                .delay(_delay)
                .to(0.56, { y: 0 })
                .start();
        }
        else
        {
            nLabel.getComponent(cc.Label).string = _tVal;
        }
    },

    /**
     * 刷新特定颜色的管道的标志
     */
    refreshColorTipState(_smooth)
    {
        //////////////////////
        this.colorTip.opacity = 0;



        let _len = this.blockList.length;

        let _dCT = this.pipeType == PIPE_TYPE.NORMAL &&
            GameMgr.isValidColor(this.pipeColor) &&
            _len < this.length;
        
        this.colorTip.active = _dCT;
        if(_dCT)
        {
            this.ctImage.spriteFrame = GameMgr.getSmallColorFrame(this.pipeColor);
            let _pos = GameMgr.getCellPosBySeat(_len);
            _pos.y += GameMgr.cellHeight * 0.5;

            this.colorTip.stopAllActions();
            if(_smooth)
            {
                cc.tween(this.colorTip).to(GameMgr.timeInSuccessMove,{position : _pos}).start();
            }
            else  this.colorTip.position = _pos;
        }
    },

    /** 管道顶部拐弯的点 */
    getTopCornerPosInPipe()
    {
        let _y = this.realHeight + GameMgr.distanceToPipe;
        return cc.v2(0,_y);
    },

    /** 从屏幕外移入 */
    moveFromFarAway()
    { 
        let _x = this.node.x;
        let _x2 = _x - 30;
        this.node.x = _x + 960;
        cc.tween(this.node)
            .to(0.6, { x: _x2 })
            .to(0.1, { x: _x })
            .start();
    },
    
    /** 移除屏幕 */
    moveToFarAway()
    {
        for (let i = 0; i < this.blockList.length; i++)
        {
            let b = this.blockList[i];
            b.motionTrail.active = false;
        }

        let _tX = this.node.x - 960;
        cc.tween(this.node)
            .to(0.6, { x: _tX })
            .start();
    },

    hideGuideTip()
    {
        this.wrongTip.opacity = 0;
        this.completeTip.opacity = 0;
    },

    setGuideTip()
    {
        if (this.isFull)
        {
            return;
        }

        if (GuideHelper.isRightGuide1(this.node))
        {
        }
        else if (GuideHelper.isRightGuide2(this.node))
        {
            this.completeTip.opacity = 255;
        }
        else
        {
            this.wrongTip.opacity = 255;
        }

    },

    getSavedCells()
    { 
        if (this.uncontrollable) return null;
        if (this.fillingTag > 0) return null;

        let _arg = {
            isFull: this.isFull,
            pipeColor: this.pipeColor,
            pipeType : this.pipeType,
            cells : [],
        }

        for (let i = 0; i < this.cellList.length; i++)
        {
            let _cell = this.cellList[i];
            let _block = this.blockList.length > i ? this.blockList[i] : null;
            let _mask = _block ? (_block.isMask ? 1 : 0) : 0;
            let _lock = _cell.isLocked() ? 1 : 0;
            _arg.cells.push({
                color: _block ? _block.color : COLOR.NULL,
                lock: _lock,
                mask : _mask,
            })
        }

        return _arg;
    },
    
    restore()
    {
        this.unscheduleAllCallbacks();

        this.blockPar.stopAllActions();
        this.colorTip.stopAllActions();
        this.completeTip.stopAllActions();
        this.generatorInfo.stopAllActions();
        this.normalPipeBotDi.stopAllActions();

        for(let i = 0;i < this.cellList.length;i++)
        {
            let c = this.cellList[i];
            c.restore();
        }
        this.cellList = [];

        for(let i = 0;i < this.blockList.length;i++)
        {
            let b = this.blockList[i];
            b.restore();
        }
        this.blockList = [];

        PoolHelper.restore(PoolHelper.POOL_NAME.PIPE, this.node);
    },
});
