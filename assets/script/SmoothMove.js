// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const Config = require("./Config");

cc.Class({
    extends: cc.Component,

    properties: {
        points:  [],
        moving : false,

        speed : 10,

        index : 0,

        dir : cc.v2(),

        lastOffset : cc.v2(),

        callback : null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.moving = false;
    },

    start () {

    },

    update (dt) {
        if (this.moving)
        {
            let dV = this.dir.mul(this.speed * Config.dt);
            this.node.x += dV.x;
            this.node.y += dV.y;

            this.lastOffset = (this.points[this.index].sub(this.node.position)).normalize();
            // console.log(Vec3.angle(this.dir, this.lastOffset));
            if (cc.Vec2.angle(this.dir, this.lastOffset) > 1)
            {
                console.log(cc.Vec2.angle(this.dir, this.lastOffset));

                let _o_dis = cc.Vec2.distance(this.node.position,this.points[this.index]);

                this.index++;
                if (this.index >= this.points.length)
                {
                    this.node.position = this.points[this.points.length - 1];
                    this.moving = false;

                    this.callback && this.callback(true)
                    
                    return;
                }
                else
                {

                    this.dir = (this.points[this.index].sub(this.points[this.index - 1])).normalize(); 
                    let _o_dV = this.dir.mul(_o_dis);
                    this.node.x = this.points[this.index - 1].x + _o_dV.x;
                    this.node.y = this.points[this.index - 1].y + _o_dV.y;
                }
            }
        }
    },

    setMove(_points,_speed,_callback,_forceStart)
    {
        this.points = _points;
        this.speed = _speed;
        this.callback = _callback;

        this.moving = this.points.length != 0;
        this.index = 0;

        if (_forceStart)
        {
            this.node.position = this.points[this.index];
            this.index++;
        }

        this.dir = (this.points[this.index].sub(this.node.position)).normalize(); 
    },
});
