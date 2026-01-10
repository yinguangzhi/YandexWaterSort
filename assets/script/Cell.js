// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { PIPE_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const PoolHelper = require("./PoolHelper");
const SSDScript = require("./SSDScript");

cc.Class({
    extends: SSDScript,

    properties: {
        line : cc.Node,
        image : cc.Node,
        lockNode : cc.Node,
        
        lockFrame1 : cc.SpriteFrame,
        lockFrame2 : cc.SpriteFrame,
        lockFrame3 : cc.SpriteFrame,

        isLock : false,

        seat : {
            get: function ()
            {
                if(this.data) return this.data['seat'];
            }
        },
        pLength : {
            get: function ()
            {
                if(this.data) return this.data['pLength'];
            }
        },
        pipeType : {
            get: function ()
            {
                if(this.data) return this.data['pipeType'];
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setData()
    {
        let _isTop = this.seat == this.pLength - 1;
        let _isBot = this.seat == 0;

        this.image.width = GameMgr.cellWidth;
        this.image.height = GameMgr.cellHeight;
        
        // if (this.pipeType == PIPE_TYPE.CACHE) this.image.width = GameMgr.cellWidth - 10;

        if (_isTop)
        {
            this.image.getComponent(cc.Sprite).spriteFrame = this.lockFrame3;
        }
        else
        {
            this.image.getComponent(cc.Sprite).spriteFrame =
                this.data.lockFrameIdx % 2 == 1 ? this.lockFrame1 : this.lockFrame2;
        }

        this.line.position = cc.v2(0,GameMgr.cellHeight - 1);
        this.line.opacity = _isTop ? 0 : 255;

        this.node.opacity = this.pipeType != PIPE_TYPE.GENERATOR ? 255 : 0;
        this.node.position = GameMgr.getCellPosBySeat(this.seat,this.pipeType);

        this.lockNode.opacity = 255;
        this.setLockState(this.data['isLock']);

    },

    isLocked()
    {
        return this.isLock;
    },
    
    
    setLockState(_state ,_smooth = false)
    {
        this.isLock = _state;
        
        this.refreshLockState(_smooth);
    },

    refreshLockState(_smooth = false)
    {
        let _isTop = this.seat == this.pLength - 1;

        let _lNode = this.lockNode

        this.image.y = -1;

        if (_smooth)
        {
            cc.tween(_lNode)
                .to(0.3, { opacity: 0 })
                .call(() =>
                {
                    _lNode.active = this.isLock;    
                })
                .start();
            
            cc.tween(this.image)
                .to(0.3, { opacity: 0 })
                .start();
            
            if (!_isTop)
            {
                cc.tween(this.line)
                    .to(0.3, { opacity: 255 })
                    .start();
            }
        }
        else
        {
            _lNode.active = this.isLock;    

            if (!_isTop)
            {
                this.line.opacity = this.isLock ? 0 : 255;
            }
            this.image.opacity = this.isLock ? 255 : 0;
        }
    },
    
    restore()
    {
        this.lockNode.stopAllActions();
        
        this.image.stopAllActions();
        PoolHelper.restore(PoolHelper.POOL_NAME.CELL,this.node);
    }
});
