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
        points : [cc.Node],

        maskHeight : 0,
        space: 0,
        speed : 50,
        topPoint : null,
        botPoint : null,
        moving : false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.space = 20;
        this.speed = 90;
        this.maskHeight = this.node.height;
        this.centerScale = 0.9;
        this.deltaScale = 0.2; 
        this.moving = false;
    },

    update (dt) {
        
        if(!this.moving) return;

        this.botPoint = null;
        this.topPoint = null;
        for(let i = 0;i < this.points.length;i++)
        {
            let arrow = this.points[i];
            arrow.y -= this.speed * Config.dt;
            
            arrow.scale = this.centerScale + this.deltaScale * ((0 - arrow.y) / (this.maskHeight * 0.5));
            
            
            if(!this.botPoint)
            {
                this.botPoint = arrow;
            }

            if(!this.topPoint)
            {
                this.topPoint = arrow;
            }

            if(this.botPoint.y > arrow.y)
            {
                this.botPoint = arrow;
            }

            if(this.topPoint.y < arrow.y)
            {
                this.topPoint = arrow;
            }
        }

        if(this.botPoint)
        {
            if(this.botPoint.y <= -this.maskHeight * 0.5 - 20)
            {
                if(this.topPoint)
                {
                    this.botPoint.y = this.topPoint.y + this.space; 
                }
            }
        }
    },

    play()
    {
        this.moving = true;
    },

    stop()
    {
        this.moving = false;
    },
});
