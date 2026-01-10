/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 23:18:38
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-19 22:40:45
 * @FilePath: \WaterSort\assets\script\Block.js
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
const ColorHelper = require("./ColorHelper");
const Config = require("./Config");
const { PIPE_TYPE, COLOR } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const GameParamsHelper = require("./GameParamsHelper");
const ItemMgr = require("./ItemMgr");
const PlatformTool = require("./PlatformTool");
const PoolHelper = require("./PoolHelper");
const SSDScript = require("./SSDScript");

cc.Class({
    extends: SSDScript,

    properties: {
        
        content : cc.Node,
        image : cc.Sprite,
        maskNode : cc.Node,
        trailNode : cc.Node,
        commonMask : cc.Mask,
        trailParticle : cc.ParticleSystem,

        outlineNode: cc.Node,
        outlineNode2: cc.Node,
        outlineNode3: cc.Node,
        
        motionTrail : null,

        isHide : false,
        isMask : false,
        uncontrollable: false,
        uncontrollableInMoveOther : false,
        pipeType : PIPE_TYPE.NORMAL,

        color : {
            get: function ()
            {
                if(this.data) return this.data['color'];
            }
        },

        seat: 0,
        
        isShake: false,
        isShakeY: false,
        shakeDir: 0,
        addOrMinus: 0,
        shakeSpeed : 0,
        maxShakeY: 0,
        baseShakeY : 0,
        maxShakeAngle: 1,
        
        lastAngle : 0,
        currAngle : 0,
        currTotalAngle: 0,
        
        baseContentY : 0,
        baseImageY : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update(dt) {
        if (this.isShake)
        {
            let _a = dt * this.shakeSpeed * this.shakeDir;
            // let _a = Config.dt * this.shakeSpeed * this.shakeDir;
            let _ca = this.currAngle + _a;

            if (_ca > this.maxShakeAngle || _ca < -this.maxShakeAngle)
            {
                _ca = this.shakeDir * this.maxShakeAngle;
                _a = _ca - this.currAngle;

                this.shakeDir = -this.shakeDir;
            }

            this.currAngle = _ca;
            this.content.angle = this.currAngle;

            if (this.currAngle * this.lastAngle <= 0)
            {
                if (this.currTotalAngle < this.maxShakeAngle)
                {
                    //低点
                 
                    this.addOrMinus = 1;   
                    this.currTotalAngle = Math.abs(this.currAngle);
                }
                else 
                {
                    //高点
                    
                    this.addOrMinus = -1;
                    this.currTotalAngle = this.maxShakeAngle * 2 - Math.abs(this.currAngle);
                }
            }
            else
            {
                this.currTotalAngle += Math.abs(_a) * this.addOrMinus;
            }

            if (this.isShakeY)
            {
                let _r = this.currTotalAngle / (this.maxShakeAngle * 2);
                // console.log(_r,
                //     "  corner : ", (this.currAngle * this.lastAngle <= 0),
                //     "  currTotalAngle : ", this.currTotalAngle,
                //     "   currAngle : ", this.currAngle,
                //     "   lastAngle : ", this.lastAngle);
                
                this.content.y = this.baseShakeY + _r * this.maxShakeY;
            }

            this.lastAngle = this.currAngle;
        }
    },
    
    setData()
    {
        GameMgr.addBlocks(this);

        this.isShake = false;
        this.isShakeY = false;
        this.uncontrollable = false;
        this.uncontrollableInMoveOther = false;

        this.setCommonMaskState(false);
        this.commonMask.width = GameMgr.blockWidth;
        this.commonMask.height = GameMgr.blockHeight;

        this.image.spriteFrame = GameMgr.getFrame(this.color);
        this.image.node.width = GameMgr.blockWidth;
        this.image.node.height = GameMgr.blockHeight;
        this.image.node.y = 0;
        this.baseImageY = 0;
        
        this.baseContentY = GameMgr.blockOffsetY();
        this.content.scale = 1;
        this.content.angle = 0;
        this.content.opacity = 255;
        this.content.position = cc.v2(0,this.baseContentY);

        this.outlineNode2.color = ColorHelper.convertHexToColor(GameMgr.getColorByID(this.color));
        this.outlineNode2.getComponent(cc.Sprite).spriteFrame = GameMgr.outlineFadeFrame;
        this.outlineNode3.getComponent(cc.Sprite).spriteFrame = GameMgr.outlineFrame;
        this.setOutlineState(false, false);

        this.trailNode.opacity = 1;
        this.trailNode.position = cc.v2();
        this.trailParticle.node.active = false;
        // this.trailParticle.resetSystem();

        this.motionTrail = this.trailNode.getComponentInChildren("MotionTrail");
        if (this.motionTrail && this.trailNode.active)
        {
            this.motionTrail.headWidth = GameMgr.getTrailWidth()
            this.motionTrail.tailWidth = GameMgr.getTrailWidth()
            this.motionTrail.headOpacity = 0;
            this.motionTrail.length = 0;
            this.motionTrail.active = true;
            this.scheduleOnce(() =>
            {
                this.motionTrail.length = GameMgr.trailLength;
                this.motionTrail.headOpacity = 255;
            },1)
        }

        this.maskNode.children[0].getComponent(cc.Sprite).spriteFrame = GameMgr.whoFrame;
    },

    /** 当前格子是否可以回退 */
    isCouldUndo()
    {
        return !this.uncontrollable;
    },

    /** 是否会打断点击抬起 */
    isBreakTap()
    {
        if(this.uncontrollable) return true;
        return false;
    },

    /** 是否可以点击抬起 */
    isCouldTap(_color)
    {
        if (this.isMask) return false;
        if (this.uncontrollable) return false;
        if (this.uncontrollableInMoveOther) return false;
        
        if(this.pipeType == PIPE_TYPE.GENERATOR)
        {
            if (this.isHide) return false;
        }

        if (_color != this.color) return false;

        return true;
    },

    setMaskState(_mask,_smooth,_idx,_callback)
    {
        let _delayTime = 0.1 * _idx;

        this.isMask = _mask;
        
        let _tOpacity = _mask ? 255 : 0;
        let _tOpacity2 = _mask ? 0 : 255;
        let _fOpacity = _mask ? 0 : 255;
        let _fOpacity2 = _mask ? 255 : 0;
        this.maskNode.opacity = _fOpacity;
        this.image.node.opacity = _fOpacity2

        if (_smooth) {
            console.log("delay mask : ", _delayTime, "  ", this.maskNode.opacity);

            this.uncontrollable = true;

            cc.tween(this.image.node)
                .delay(_delayTime)
                .to(0.12, { opacity: _tOpacity2 })
                .start();
            
            cc.tween(this.maskNode)
                .delay(_delayTime)
                .to(0.12, { opacity: _tOpacity })
                .call(() =>
                {
                    this.uncontrollable = false;
                    _callback && _callback();
                })
                .start();
        }
        else
        {
            this.maskNode.opacity = _tOpacity;
            this.image.node.opacity = _tOpacity2
            _callback && _callback();
            
        }    
    },

    setHideState(_state)
    {
        if (this.pipeType != PIPE_TYPE.GENERATOR) 
        {
            this.isHide = false;
            return;
        }

        // this.motionTrail.headOpacity = _state ? 0 : 255;
        // this.motionTrail.active = !_state;
        this.isHide = _state;
    },

    /** 设置方块所属管道的类型 */
    setPipeType(_pipeType)
    {
        this.pipeType =_pipeType;
    },

    /** 设置方块在管道中的位置 */
    setSeat(_seat,_pipeType,_setPos)
    {
        this.seat = _seat;
        if(_pipeType) this.setPipeType(_pipeType);
        if(_setPos) 
        {
            this.node.position = GameMgr.getCellPosBySeat(this.seat,this.pipeType);
        }
    },

    /** 在生成式管道里，方块展示 */
    displayInGenerator(_display,_smooth)
    {
        if (_display)
        {
            if (_smooth)
            {
                this.motionTrail.length = 0;
                this.motionTrail.headOpacity = 0;
                this.motionTrail.active = true;

                this.content.opacity = 100;
                this.content.scale = 0.9;
                this.content.y = this.baseContentY + 10;

                cc.tween(this.content)
                    .to(0.5, { opacity: 255,scale : 1,y : this.baseContentY })
                    .call(() =>
                    {
                        this.motionTrail.length = GameMgr.trailLength;
                        this.motionTrail.headOpacity = 255;
                        this.setHideState(false);
                    })
                    .start();
            }
            else this.setHideState(false);
        }
        else
        {
            this.setHideState(true);
            this.content.opacity = 0;   
            // this.content.scale = 0.9;
            // this.content.y = this.baseContentY + 40; 
        }
        
    },
    
    setOutlineState(_state,_smooth)
    {
        this.outlineNode.stopAllActions();

        let _op = _state ? 255 : 0;
        if (_smooth)
        {
            cc.tween(this.outlineNode)
                .to(0.2, { opacity: _op })
                .start();
        }
        else 
        {
            this.outlineNode.opacity = _op;
        }
        
     },
    
    /** 下移 */
    moveDown(_callback)
    {
        this.setOutlineState(false,true);

        this.isShake = false;
        this.isShakeY = false;
        this.node.stopAllActions();
        
        let _pos = GameMgr.getCellPosBySeat(this.seat,this.pipeType);

        this.uncontrollable = true;
        cc.tween(this.node)
            .to(0.2, { y: _pos.y })
            .call(() =>
            {
                this.uncontrollable = false;
                // console.log("move back : ", this.uncontrollable);
                
                this.content.stopAllActions();
                this.content.y = this.baseContentY;

                _callback && _callback();
            })
            .start();
        
        cc.tween(this.content)
            .to(0.1, { y : this.baseContentY,angle : 0 })
            .start();
        
    },

    /** 点击上移 */
    moveUp()
    {
        this.setOutlineState(true,true);

        this.isShake = true;
        this.lastAngle = 0;
        this.currAngle = 0;
        this.currTotalAngle = 0;
        this.shakeDir = CocosHelper.randomRange(0,100) > 50 ? 1 : -1;
        this.maxShakeAngle = CocosHelper.randomRangeFloat(GameMgr.minShakeAngle, GameMgr.maxShakeAngle);
        // this.shakeSpeed = CocosHelper.randomRangeFloat(GameMgr.minShakeSpeed, GameMgr.maxShakeSpeed);
        let _time = CocosHelper.randomRangeFloat(GameMgr.minShakeTime,GameMgr.maxShakeTime);
        this.shakeSpeed = this.maxShakeAngle * 4 / _time;
        this.maxShakeY = CocosHelper.randomRangeFloat(GameMgr.minShakeY, GameMgr.maxShakeY);
        this.addOrMinus = 1;

        let _y = this.node.y + GameMgr.blockHeight;
        cc.tween(this.node)
            .to(0.2, { y: _y })
            .call(() =>
            {
                this.isShakeY = true;
                this.baseShakeY = this.baseContentY - this.maxShakeY * this.currTotalAngle / (this.maxShakeAngle * 2);
                // console.log("calc base shake y :  baseShakeY : ", this.baseShakeY,
                //     "   baseContentY :", this.baseContentY,
                //     "   currTotalAngle :", this.currTotalAngle,
                //     "   maxShakeAngle :", this.maxShakeAngle)
            })
            .start();
        
    },
    
    /**
     * 移动到另一个管道
     * @param 要移动到的管道 _pipe 
     * @param 该管道中的位置 _seat 
     * @param 移动到另一管道后，是否在顶部 _isTop 
     */
    moveOther(_isBezier,_idx,_pipeType,_seat,_isTop,_pArr,_isRoad,_newTime,_callback)
    {
        this.setOutlineState(false,true);
        
        this.setCommonMaskState(false);

        this.setSeat(_seat,_pipeType);

        this.isShake = false;
        this.isShakeY = false;
        this.node.stopAllActions();

        
        this.trailNode.opacity = 255;
        // this.trailNode.active = true;
        this.trailParticle.node.active = true;
        this.trailParticle.resetSystem();

        this.uncontrollable = true;
        // this.uncontrollableInMoveOther = true;

        _newTime = _newTime == -1 ? GameMgr.timeInSuccessMove : _newTime;
        let _duration = _newTime + GameMgr.addTimeInSuccessMove * _idx;

        let _moveECall = () =>
        {
            this.uncontrollable = false;
            // this.uncontrollableInMoveOther = false;
            _callback && _callback();
        }

        cc.tween(this.content)
            .to(0.2, { y : this.baseContentY,angle : 0 })
            .start();

        cc.tween(this.image.node)
            .to(0.2, { y : this.baseImageY})
            .start();
        
        if(_isBezier)
        {
            let _rPMessage = this.node.getComponent("SmoothBezier").play(_duration,_pArr,_isRoad,() =>
            {
                
                this.trailParticle.stopSystem();
                
                if(GameParamsHelper.couldShake) PlatformTool.vibrateAction(30);
                
                AudioHelper.playAudio(AudioHelper.AUDIO_NAME.DOWN);
                        
                
                if (_isTop)
                {
                    let _y = this.node.y;
                    let _ty1 = _y + 10;
                    let _ty2 = _y;
                    cc.tween(this.node)
                        .to(0.08, { y: _ty1 })
                        .to(0.06, { y: _ty2 })
                        .call(_moveECall)
                        .start();
                }
                else _moveECall(); 
            })

            return _rPMessage;

            // CocosHelper.bezierNTo(this.node,_duration,"sineIn",_moveECall,null,_pArr);
        
        }
        else
        {
            CocosHelper.bezierNTo(this.node,_duration,"quadIn",() =>
                {
                    this.trailParticle.stopSystem();
                
                    if(GameParamsHelper.couldShake) PlatformTool.vibrateAction(30);
                    
                    AudioHelper.playAudio(AudioHelper.AUDIO_NAME.DOWN);
                            
                    
                    if (_isTop)
                    {
                        let _y = this.node.y;
                        let _ty1 = _y + 10;
                        let _ty2 = _y;
                        cc.tween(this.node)
                            .to(0.08, { y: _ty1 })
                            .to(0.06, { y: _ty2 })
                            .call(_moveECall)
                            .start();
                    }
                    else _moveECall(); 

                },null,_pArr);
                
            // let _dis = 0;
            // for(let k = 1;k < _pArr.length;k++)
            // {
            //     _dis += cc.Vec2.distance(_pArr[k],_pArr[k - 1]);
            // }
            // let _cSpeed = _dis / _duration

            // this.node.getComponent("SmoothMove").setMove(_pArr,_cSpeed,_moveECall)
        }   
        
    },

    /** 填充完成后的微调 */
    moveInFull(_idx,_oY,_t_length,_smooth)
    {
        let _top = (_idx == _t_length - 1);
        // let _bTime = GameMgr.timeInFull2 * _idx;
        let _bTime = GameMgr.timeInFull2s[_idx];
        if (_bTime <= 0) _bTime = 0.01;
        
        
        let _y = this.node.y;
        let _ty = _y - _oY;

        let _n = this.image.node;
        let _y2 = _n.y;
        let _ty2 = _y2 + _oY;
        
        if (_top)
        {
            let _ty3 = _ty - 1.4;
            if (_smooth)
            {
                cc.tween(this.node)
                    .to(GameMgr.timeInFull, { y: _ty })
                    .call(() =>
                    {
                        
                        this.setCommonMaskState(_top);
                        
                        cc.tween(_n)
                            .to(_bTime, { y: _ty2 })
                            .start();
                    })
                    .to(_bTime,{y : _ty3})
                    .start();
            }
            else
            {
                this.setCommonMaskState(_top);
                
                this.node.y = _ty3;
                _n.y = _ty2;
            }
            
        }
        else
        {
            this.setCommonMaskState(_top);
            
            if (_smooth)
            {
                cc.tween(this.node)
                    .to(GameMgr.timeInFull, { y: _ty })
                    .to(_bTime, { y: _y })
                    .start();
            }
            else
            {
                this.node.y = _y;
            }
            
        }
    },

    worldPos()
    {
        return this.node.convertToWorldSpaceAR(cc.v2());
    },

    setCommonMaskState(_state)
    {
        if (this.commonMask.enabled == _state) return;
        
        this.commonMask.enabled = _state;
     },
    
    restore()
    {
        this.isShake = false;
        this.isShakeY = false;
        this.node.stopAllActions();
        this.content.stopAllActions();
        this.maskNode.stopAllActions();
        this.image.node.stopAllActions();
        
        this.unscheduleAllCallbacks();

        PoolHelper.restore(PoolHelper.POOL_NAME.BLOCK,this.node);
    }
});
