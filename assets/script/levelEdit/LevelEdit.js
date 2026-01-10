// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("../CocosHelper");
const CocosLoader = require("../CocosLoader");
const { LEVEL_MODE, DIFFICULTY } = require("../EnumHelper");
const GameMgr = require("../GameMgr");
const ImageMgr = require("../ImageMgr");
const LevelEditMgr = require("./LevelEditMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        
        layout: cc.Node,
        pipePrefab: cc.Node,

        colorGroup: cc.ToggleContainer,
        blockStateGroup: cc.ToggleContainer,
        pipeTypeGroup: cc.ToggleContainer,

        scaleEdit: cc.EditBox,
        diffEdit: cc.EditBox,
        timeEdit: cc.EditBox,
        ltEdit: cc.EditBox,

        pipeLengthEdit: cc.EditBox,

        // pColorEdit: cc.EditBox,

        pXEdit: cc.EditBox,
        pYEdit: cc.EditBox,
        lEdit: cc.EditBox,
        processEdit: cc.EditBox,
        
        nullImage : cc.SpriteFrame,
        imageList: [cc.SpriteFrame],

        pipeList: [],
        
        pType: 1,
        processes: [],
        processesIdx : 0,
        addToProcessInExport : false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        LevelEditMgr.levelEditCtl = this;
        
        GameMgr.setFrames(this.imageList)
    
        this.processesIdx = 0;
        this.processes = [];
    },

    // update (dt) {},

    selectPipeAction()
    { 
        if (!LevelEditMgr.selectPipe) return;

        this.refreshSelectPos(LevelEditMgr.selectPipe.node)
        
        let _color = LevelEditMgr.selectPipe.color;
        let _type = LevelEditMgr.selectPipe.type;
        this.pipeLengthEdit.string = LevelEditMgr.selectPipe.length;
        this.colorGroup.node.children[_color].getComponent(cc.Toggle).isChecked = true;
        this.pipeTypeGroup.node.children[_type - 1].getComponent(cc.Toggle).isChecked = true;
        
    },
    
    selectBlockAction()
    {
        if (!LevelEditMgr.selectBlock) return;

        let _color = LevelEditMgr.selectBlock.color;
        this.colorGroup.node.children[_color].getComponent(cc.Toggle).isChecked = true;

        let _i = 0;
        if (LevelEditMgr.selectBlock.isMask) _i = 2;
        else if (LevelEditMgr.selectBlock.isLock) _i = 1;
        
        this.blockStateGroup.node.children[_i].getComponent(cc.Toggle).isChecked = true;
     },
    
    refreshSelectPos(_note)
    {
        this.pXEdit.string = _note.x;
        this.pYEdit.string = _note.y;
    },

    applyAction()
    { 
        if (!cc.isValid(LevelEditMgr.selectPipe)) return;

        let _x = parseInt(this.pXEdit.string);
        if (isNaN(_x)) _x = 0;
        let _y = parseInt(this.pYEdit.string);
        if (isNaN(_y)) _y = 0;

        LevelEditMgr.selectPipe.node.x = _x;
        LevelEditMgr.selectPipe.node.y = _y;
    },

    applyScaleAction()
    { 
        let _s = parseFloat(this.scaleEdit.string);
        if (isNaN(_s)) _s = 1;

        this.layout.scale = _s;
    },
    
    colorToggle(arg1,arg2)
    { 
        let _color = parseInt(arg2);
        console.log("color : ", _color);
        LevelEditMgr.selectColor = _color;

        let _cIM = null;
        if (_color > 0) _cIM = this.imageList[_color - 1];

        if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setColor(_color)
        if (LevelEditMgr.selectPipe) LevelEditMgr.selectPipe.setColor(_color)
        
    },
    
    blockStateToggle(arg1,arg2)
    { 
        let _t = parseInt(arg2);
        if (_t == 1)
        {
            //锁
            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setLock(true);
            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setMask(false);
        }
        else if (_t == 2)
        {
            //问号？

            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setLock(false);
            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setMask(true);
        }
        else if (_t == 0)
        {
            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setLock(false);
            if (LevelEditMgr.selectBlock) LevelEditMgr.selectBlock.setMask(false);
        }
    },
    
    loadAction()
    {
        let _lStr = this.lEdit.string;
        if (CocosHelper.isEmpty(_lStr))
        {
            console.warn("请填写 关卡");
            return;
        }

        let _level = parseInt(_lStr);
        if (isNaN(_level))
        {
            console.warn("无效的 关卡");
            return;
        }

        this.clearAction();

        CocosLoader.loadAssetAsync("level/" + _level, cc.JsonAsset, null, 0)
            .then(asset =>
            {
                this.processesIdx = 0;

                let _json = asset.json;
                console.log(_json);
                
                this.scaleEdit.string = CocosHelper.isEmpty(_json.scale) ? 1 : _json.scale;
                this.ltEdit.string = _json.levelType;
                this.timeEdit.string = _json.time;
                this.diffEdit.string = _json.difficulty;
                this.processEdit.string = this.processesIdx;

                this.processes = _json.processes;
                let _process = _json.processes;
                let _ps = _process[this.processesIdx].pipes;
                for (let i = 0; i < _ps.length; i++)
                {
                    let pipe = _ps[i];
                    this.realAddPipe(pipe.x,pipe.y,pipe.pipeType,pipe.cells,pipe.pipeColor)
                }
            }
        )
    },
    
    
    pipeTypeAction(arg1,arg2)
    {
        this.pType = parseInt(arg2);
    },
    
    
    addAction()
    { 
        let _lStr = this.pipeLengthEdit.string;
        if (CocosHelper.isEmpty(_lStr))
        {
            console.warn("请填写 管道长度");
            return;
        }

        let _pLen = parseInt(_lStr);
        if (isNaN(_pLen))
        {
            console.warn("无效的 管道长度");
            return;
        }

        if (_pLen <= 0)
        {
            console.warn("管道长度无效");
            return;
        }


        let _bms = [];
        for (let i = 0; i < _pLen; i++)
        {
            // let _c = parseInt(_colorStr[i]);
            let _c = 0;
            if (isNaN(_c))
            {
                console.warn("管道里有无效颜色值")
                return;
            }
            _bms.push({
                color: 0,
                lock: 0,
                mask : 0,
            });
        }

        if (_bms.length != _pLen)
        {
            console.warn("管道长度和颜色数量不匹配");
            return;
        }

        
        let _x = parseInt(this.pXEdit.string);
        if (isNaN(_x)) _x = 0;
        let _y = parseInt(this.pYEdit.string);
        if (isNaN(_y)) _y = 0;

        this.realAddPipe(_x, _y, this.pType, _bms, 0);

        this.colorGroup.node.children[0].getComponent(cc.Toggle).isChecked = false;
    },

    realAddPipe(_x, _y,_pType,_bms,_color)
    {
        let obj = cc.instantiate(this.pipePrefab);
        obj.parent = this.layout;
        obj.active = true;
        obj.position = cc.v2(_x, _y);
        obj.getComponent("EditPipe").setData(_pType,_bms);
        obj.getComponent("EditPipe").setColor(_color);

        this.pipeList.push(obj.getComponent("EditPipe"))
    },
    

    
    deleteAction()
    { 
        if (!cc.isValid(LevelEditMgr.selectPipe))
        {
            console.warn("请选择要去掉的管道")
            return;
        }

        CocosHelper.removeFromArray(this.pipeList, LevelEditMgr.selectPipe)
        LevelEditMgr.selectPipe.node.destroy();
        LevelEditMgr.selectPipe = null
    },
    
    goToProcess()
    {
        let _lStr = this.processEdit.string;
        if (CocosHelper.isEmpty(_lStr))
        {
            console.warn("请填写 流程索引");
            return;
        }

        let _pIdx = parseInt(_lStr);
        if (_pIdx >= this.processes.length)
        {
            console.warn("要跳转的流程不存在");
            return;
        }

        this.calcCurrProcess();


        this.clear2();


        this.processesIdx = _pIdx;
        let _ps = this.processes[_pIdx].pipes;
        
        for (let i = 0; i < _ps.length; i++)
        {
            let pipe = _ps[i];
            this.realAddPipe(pipe.x,pipe.y,pipe.pipeType,pipe.cells,pipe.pipeColor)
        }
    },

    addNewProcess()
    {
        this.calcCurrProcess();
        
        this.clear2();
        this.processesIdx += 1;
        this.processEdit.string = this.processesIdx;

        this.addToProcessInExport = true;
    },
    
    refreshCurrProcess()
    { 

    },
    
    clearAction()
    {
        this.clear2();
        this.processesIdx = 0;
        this.processes = [];
    },

    clear2()
    {
        for (let i = 0; i < this.pipeList.length; i++)
        {
            this.pipeList[i].node.destroy();
        }

        this.pipeList.length = 0;
        LevelEditMgr.selectBlock = null;
        LevelEditMgr.selectPipe = null;
    },

    exportAction()
    {
        if (this.pipeList.length == 0)
        {
            console.warn("请配置管道")
            return;
        }

        let _lStr = this.lEdit.string;
        if (CocosHelper.isEmpty(_lStr))
        {
            console.warn("请填写 关卡");
            return;
        }
        let _level = parseInt(_lStr);


        let _dStr = this.diffEdit.string;
        if (CocosHelper.isEmpty(_dStr))
        {
            console.warn("请填写 关卡难度");
            return;
        }
        let _difficult = parseInt(_dStr);

        let _tStr = this.ltEdit.string;
        if (CocosHelper.isEmpty(_tStr))
        {
            console.warn("请填写 关卡类型");
            return;
        }
        let _levelType = parseInt(_tStr);

        let _timeStr = this.timeEdit.string;
        if (CocosHelper.isEmpty(_timeStr))
        {
            console.warn("请填写 实践");
            return;
        }
        let _levelTime = parseInt(_timeStr);

        let _scaleStr = this.scaleEdit.string;
        if (CocosHelper.isEmpty(_scaleStr))
        {
            console.warn("请填写 整体缩放");
            return;
        }
        let _scale = parseFloat(this.scaleEdit.string);
        if (isNaN(_scale)) _scale = 1;


        if (_levelType == LEVEL_MODE.TIME) {
            if (isNaN(_levelTime) || _levelTime < 10) {
                console.warn("计时关卡请填写时间");
                return;
            }
        }

        this.calcCurrProcess();

        let arg = {
            level: _level,
            
            /** 关卡类型 */
            levelType: _levelType,
            
            /** 关卡难度 */
            difficulty: _difficult,
            
            /** 计时，只有计时关卡才有效 */
            time: _levelTime,

            scale : _scale,

            processes: this.processes,
        }

        let _ssss = JSON.stringify(arg);

        console.log(arg);
        console.log(_ssss);

        CocosHelper.saveForBrowser(_ssss,_level)
    },

    calcCurrProcess()
    {
        if (this.pipeList.length == 0) return null;

        let _isOK = false;
        let _ps = [];
        for (let i = 0; i < this.pipeList.length; i++)
        {
            let pipe = this.pipeList[i];
            let _pm = {
                /** 管道类型 */
                pipeType: pipe.type,

                /** 管道的颜色，如果不为空，则只有特定的块才能放到该管道上 */
                pipeColor: pipe.color,
                
                x: pipe.node.x,
                y: pipe.node.y,

                /** 管道上的格子列表，列表长度即为管道长度，从下到上排序 */
                cells:
                    [
                        // {color : COLOR.RED,lock : 0,mask : 1},
                        // {color : COLOR.RED,lock : 0,mask : 0},
                        // {color : COLOR.YELLOW,lock : 0,mask : 1},
                        // {color : COLOR.YELLOW,lock : 0,mask : 0},
                    ]
            }

            let _blocks = pipe.blocks;
            for (let k = 0; k < _blocks.length; k++)
            {
                
                let _b = _blocks[k].getComponent("EditBlock");
                if (!_b.node.active) continue;

                _pm.cells.push(
                    {
                        color: _b.color,
                        lock: _b.isLock ? 1 : 0,
                        mask : _b.isMask ? 1 : 0,
                    }
                )

                if (GameMgr.isValidColor(_b.color))
                {
                    _isOK = true;
                }
            }
            _ps.push(_pm);
        }

        if (!_isOK)
        {
            console.log("没有有效的方块")
            return null;
        }


        let _p =
        {
            pipes : _ps,
        }

        if (_p)
        {
            if (this.processes.length > this.processesIdx)
            {
                this.processes[this.processesIdx] = _p;
            }
            else
            {
                this.processes.push(_p);
            }
        }

        return _p;
    },
});
