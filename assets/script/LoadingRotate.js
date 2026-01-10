// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        cubes : [cc.Node],
        space : 55,
        rIndex : 0,
        anchorArr : [cc.Vec2],
        rotateInfo : null,
        cIndex : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.space = 54;
        this.rIndex = 0;

        this.rotateInfo = [
            {time : 0.4,anchorX : 1,anchorY : 1,addX : this.space * 0.5,addY : this.space * 0.5,deltaAngle : -180,offsetX : -this.space * 0.5},
            {time : 0.2,anchorX : 0,anchorY : 1,addX : this.space * 1.0,addY : 0,deltaAngle : -90,offsetX : 0},
            {time : 0.4,anchorX : 0,anchorY : 0,addX : this.space * 1.0,addY : 0,deltaAngle : -180,offsetX : -this.space * 0.5}
        ]

        this.cIndex = (this.cubes.length - 1) * 0.5;
        

        this.rotateCube();
    },

    // update (dt) {},

    rotateCube()
    {
        this.rIndex = 0;
        this.cubes.sort((a,b) =>
        {
            return parseInt(a.x) - parseInt(b.x);
        })
        // console.log(this.cubes);
        for(let i = 0;i < this.cubes.length;i++)
        {
            let _cube = this.cubes[i]
            this.setCubeBasePos(_cube,i);
        }

        this.stepRotateCube();
    },

    stepRotateCube()
    {
        if(this.rIndex >= this.rotateInfo.length)
        {
            this.scheduleOnce(this.rotateCube,0.02);
            // this.rotateCube()
            return;
        }

        
        let _rInfo = this.rotateInfo[this.rIndex];
        let _time = _rInfo.time;
        // console.log(_rInfo)

        this.rIndex += 1;

        for(let i = 0;i < this.cubes.length;i++)
        {
            let _cube = this.cubes[i]
            if(i == 0)
            {
                _cube.anchorX = _rInfo.anchorX;
                _cube.anchorY = _rInfo.anchorY;
                _cube.x += _rInfo.addX;
                _cube.y += _rInfo.addY;
                let _angle = _cube.angle;
                let _t_angle = _angle + _rInfo.deltaAngle
                let _t_x = _cube.x + _rInfo.offsetX;
                cc.tween(_cube)
                    .to(_time,{angle : _t_angle,x : _t_x})
                    .delay(0.04)
                    .call(() =>
                    {
                        this.stepRotateCube();
                    })
                    .start();
            }
            else 
            {
                let _x = _cube.x;
                let _t_x = _x + _rInfo.offsetX;
                cc.tween(_cube)
                    .to(_time,{x : _t_x})
                    .start();
            }
        }
    },

    setCubeAnchorAndPos(_cube,_ax,_ay)
    {
        let _axDelta = _ax - _cube.anchorX;
        let _ayDelta = _ay - _cube.anchorY;

        _cube.anchorX = _ax;
        _cube.anchorY = _ay;

        _cube.x += _axDelta * _cube.width;
        _cube.y += _ayDelta * _cube.height;
    },

    setCubeBasePos(_cube,_idx)
    {
        _cube.anchorX = 0.5;
        _cube.anchorY = 0.5;
        _cube.angle = 0;
        _cube.y = 0;
        _cube.x = (_idx - this.cIndex) * this.space;
    },


});
