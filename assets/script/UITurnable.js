

var UIHelper = require("./UIHelper");

var Observer = require("./Observer");
var StorageHelper = require("./StorageHelper");
var PlatformTool = require("./PlatformTool");
const GameParamsHelper = require("./GameParamsHelper");
const SceneHelper = require("./SceneHelper");
const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const WebBridge = require("./WebBridge");
const UIBase = require("./UIBase");
const GameMgr = require("./GameMgr");
const TimerHelper = require("./TimerHelper");
const ItemMgr = require("./ItemMgr");
const { ITEM_TYPE } = require("./EnumHelper");
const TurnableMgr = require("./TurnableMgr");
const PoolHelper = require("./PoolHelper");
const ImageMgr = require("./ImageMgr");
const EffectHelper = require("./EffectHelper");

cc.Class({
    extends: UIBase,

    properties: {
        
        spinNode: cc.Node,
        grayNode: cc.Node,

        
        progressLabel: cc.Label,

        
        item: cc.Node,
        
        
        itemPar: cc.Node,

        
        rewardMess: cc.Node,
        
        
        rotateNode: cc.Node,
        rotateSelectNode: cc.Node,
        
        
        arrowNode: cc.Node,
   
        pf: cc.Node,

        angles : [],
        itemList : [],
        selectTI: cc.Node,

        rDir : 0,
        arrowRRate : 1,
        step: 0,
        
        turnableResult : null,
        isRotate : false,
        baseSpeed : 30,
        maxSpeed  : 500,
        addSpeed: 200,
        moveDir : 1,
        constAddSpeed  : 200,

        rSpeed  : 10,

        angle : 0,
        deltaAngle : 0,
        roundNumber  : 4,

        //缓慢旋转的时间
        constSmoothAngle  : 270,

        //开始转折的角度
        cornerAngle  : 0,

        //减速旋转的时间
        smoothTime  : 1.5,

        //总的旋转角度
        rotateAngle: 0,
        targetAngle : 0,

        //总的旋转角度
        ar_rotateAngle  : 0,
        ar_min_rSpeed  : 60,
        ar_rSpeed  : 10,
        ar_addSpeed  : 200,
        ar_deltaAngle  : 0,
        ar_angle  : 0,

        left_arrow_angle  : -7,
        right_arrow_angle  : 18,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.moveDir = -1;
        this.roundNumber = 3;
        this.left_arrow_angle = -10;
        this.right_arrow_angle = 16;
        this.rotateSelectNode.scale = 0;

        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        
        this.angles = TurnableMgr.angles;

        let turnableConfigs = TurnableMgr.turnableConfigs;
        
        this.refreshInfo();

        this.item.active = false;
        for (let i = 0; i < turnableConfigs.length; i++)
        {
            let r = turnableConfigs[i];
            r.frame = ImageMgr.getItemFrame(r.type);

            let obj = PoolHelper.cloneItem(this.item,this.itemPar,cc.v2(),1,this.angles[i],true,this.itemList)
            obj.getComponent("TurnableItem").data = r;
        }

        this.angle = 0;
    },

    update(dt) {
        if (this.isRotate)
        {
            if (this.rotateSelectNode.scale != 0) this.rotateSelectNode.scale = 0;

            this.rSpeed += this.addSpeed * dt;
            this.ar_rSpeed += this.ar_addSpeed * dt;
            if (this.rSpeed * this.moveDir >= this.maxSpeed)
            {
                this.rSpeed = this.maxSpeed * this.moveDir;
                this.ar_rSpeed = this.maxSpeed;
            }

            if (this.rSpeed * this.moveDir <= 0)
            {
                this.rSpeed = 0;
                // this.ar_rSpeed = 0;
            }

            let _d = this.rSpeed * dt;
            this.deltaAngle += Math.abs(_d);
            this.angle += _d;
            this.angle %= 360;
            this.rotateNode.angle = this.angle;

            let _ar_d = this.ar_rSpeed * dt;
            this.ar_deltaAngle += _ar_d;
            this.ar_angle += _ar_d;
            this.ar_angle %= 360;
            this.arrowNode.angle += _ar_d * this.rDir;


            // this.arrowNode.angle += this.rSpeed * this.rDir * deltaTime * this.arrowRRate;
            if(this.arrowNode.angle > this.right_arrow_angle) 
            {
                this.rDir = -this.rDir;

                let _deltaA = this.arrowNode.angle - this.right_arrow_angle;
                this.arrowNode.angle = this.right_arrow_angle - _deltaA;
            }
            else if(this.arrowNode.angle < this.left_arrow_angle) 
            {
                this.rDir = -this.rDir;

                let _deltaA = this.left_arrow_angle - this.arrowNode.angle;
                this.arrowNode.angle = this.left_arrow_angle + _deltaA;
            }
            
            
            if (this.deltaAngle >= this.cornerAngle && this.addSpeed * this.moveDir > 0)
            {
                let _leaveAngle = this.rotateAngle - this.deltaAngle;
                let _leaveTime = (_leaveAngle * 2) / (this.rSpeed * this.moveDir);
                this.addSpeed = -this.rSpeed / _leaveTime;

                let _t = Math.abs(this.left_arrow_angle) * 2 + this.right_arrow_angle * 2;

                let _ar_delta2 = 0;
                if(this.rDir > 0)
                {
                    _ar_delta2 = this.right_arrow_angle - this.arrowNode.angle + this.right_arrow_angle;
                }
                else
                {
                    _ar_delta2 = Math.abs(this.left_arrow_angle - this.arrowNode.angle) + Math.abs(this.left_arrow_angle) + this.right_arrow_angle * 2;
                }

                let _ar_leaveAngle = (this.ar_rSpeed + this.ar_min_rSpeed) * _leaveTime / 2;
                let _ar_leaveAngle2 = Math.ceil((_ar_leaveAngle - _ar_delta2) / _t) * _t + _ar_delta2 + 4;
                let _ar_minS = (_ar_leaveAngle2 * 2) / _leaveTime - this.ar_rSpeed;

                this.ar_addSpeed = -(this.ar_rSpeed - _ar_minS) / _leaveTime;
            }

            if (this.rSpeed * this.moveDir <= 0)
            {
                this.isRotate = false;

                Observer.fireInterval("wheel",800);

                
                this.displayReward();
            }
        }
    },

    refreshInfo()
    {
        let _pInfo = TurnableMgr.getProgressInfo();

        this.progressLabel.string = _pInfo.progressDesc;
        this.pf.width = _pInfo.progressRate * 389;
        
        this.grayNode.active = !_pInfo.can;
        this.spinNode.active = _pInfo.can;
    },

    spinAction()
    {
        if(this.inClosing) return;
        
        if(this.isRotate) return;
        
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.TURNABLE)
        TurnableMgr.realTurnable();
        
        this.rotateSelectNode.scale = 0;
        this.arrowNode.angle = 0;

        let _rand = CocosHelper.randomRange(1, 100);
        
        this.turnableResult =CocosHelper.getRandomResult(_rand,TurnableMgr.turnableConfigs)
        let _idx = TurnableMgr.turnableConfigs.indexOf(this.turnableResult);

        this.selectTI = this.itemList[_idx];

        let _smoothAngle = (720 + (this.selectTI.angle + this.rotateNode.angle));
        let _otherAngle = _smoothAngle - this.constSmoothAngle;

        this.cornerAngle = 360 * this.roundNumber + _otherAngle;
        this.rotateAngle = this.cornerAngle + this.constSmoothAngle;
        this.targetAngle = (this.rotateNode.angle + this.rotateAngle) % 360;

        let _t = Math.abs(this.left_arrow_angle) * 2 + this.right_arrow_angle * 2;
        this.ar_rotateAngle = ((Math.floor(this.rotateAngle / _t) * _t));// + 4.1
        this.arrowRRate = this.ar_rotateAngle / this.rotateAngle;


        this.turnableResult = TurnableMgr.turnableConfigs[_idx];
        
        
        this.isRotate = true;
        this.rSpeed = this.baseSpeed * this.moveDir;
        this.addSpeed = this.constAddSpeed * this.moveDir;
        this.deltaAngle = 0;
        
        this.ar_rSpeed = this.baseSpeed;
        this.ar_addSpeed = this.constAddSpeed;
        this.ar_deltaAngle = 0;
        this.ar_angle = 0;

        this.rDir = 1;

        this.refreshInfo();
    },

    displayReward()
    {
        this.rotateSelectNode.scale = 0;
        this.rotateSelectNode.angle = (this.rotateNode.angle + this.selectTI.angle);
        cc.tween(this.rotateSelectNode).to(0.2, { scale: 1 })
            .delay(0.2)
            .call(() =>
            {
                this.realFly();
            }).start();
    },

    realFly()
    {
        if (!this.turnableResult) return;

        let _type = this.turnableResult.type;
        let _quantity = this.turnableResult.number
        ItemMgr.addItemCount(_type, _quantity, true);

        if (_type == ITEM_TYPE.COIN)
        {
            EffectHelper.displayCoinFly(10, this.selectTI, null, cc.v2(), 0, () =>
            {
                Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
            })
        }
        else
        {
            EffectHelper.displayPropFly(_type,_quantity, this.selectTI, this.spinNode, cc.v2(), 0, () =>
            {
            })
        }
        
    },

    close()
    {
        if (this.isRotate) return;

        this.close2();
    },
});
