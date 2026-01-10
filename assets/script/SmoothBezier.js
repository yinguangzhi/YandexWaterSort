// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const BezierUtils = require("./BezierUtils");
const Config = require("./Config");
const GameMgr = require("./GameMgr");


cc.Class({
    extends: cc.Component,

    properties: {
        player : cc.Node,
        points : [],
        roadPoints : [],
        time : 1,
        moving : false,
        graphics : cc.Graphics,
        couldDraw : true,
        index : 0,
        speed : 100,
        callback : null,
    
        tweenT : 0,
        tweenB : 0,
        tweenC : 0,
        tweenD: 0,
        
        checkRedundant : true, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.stop();
        this.couldDraw = true;
        this.graphics = this.getComponent(cc.Graphics);
        if (!this.player) this.player = this.node;
        
        this.checkRedundant = true;
    },

    start () {
        // this.play(1,[
        //     cc.v2(-60,-100),
        //     cc.v2(60,400),
        //     cc.v2(180,-400)
        // ]);
    },

    update (dt) {
        
        if(!this.moving) return;

        this.tweenT += dt;
        // this.tweenT += Config.dt;
        // if (this.tweenT > this.tweenD) this.tweenT = this.tweenD;

        this.speed = this.calcSpeed(this.tweenT,this.tweenB,this.tweenC,this.tweenD);
        // if(this.speed > (this.tweenB + this.tweenC))
        // {
        //     // this.speed = this.tweenB + this.tweenC;
        //     console.log("over speed : ",this.tweenT,"  ",Config.dt,"   ",this.speed,"  _dis : ",Config.dt * this.speed);

        // }
        // else console.log("normal speed : ",this.tweenT,"  ",Config.dt,"   ",this.speed,"  _dis : ",Config.dt * this.speed);

        // console.log(this.moveDir.mul(dt * this.speed).mag(),"   ",dt);
        this.player.position = this.player.position.add(this.moveDir.mul(dt * this.speed));
        // this.player.position = this.player.position.add(this.moveDir.mul(Config.dt * this.speed));
        
        let _dir = this.target_point.sub(this.player.position);

        if (Math.abs(this.moveDir.angle(_dir)) > 1) 
        {
            let redundant = _dir.mag();
            this.moveNext(redundant);
        }
    },

    calcSpeed(t,b,c,d)
    {
        
        // return this.speed;
        //linear
        let _val = (c / d) * t + b;

        //easeInQuad  先慢后快
        // let _val = c * (t /= d) * t + b;

        //easeOutQuad 先快后慢
        // let _val = -c * (t /= d) * (t - 2) + b;
    
        //easeInCubic
        // let _val = c * (t /= d) * t * t + b;

        //easeOutCubic
        // let _val = c * ((t = t / d - 1) * t * t + 1) + b;

        //easeInQuart
        // let _val = c * (t /= d) * t * t * t + b;

        //easeInQuint
        // let _val = c * (t /= d) * t * t * t * t + b;

        //easeInCirc
        // let _val = -c * (Math.sqrt( 1 - (t /= d) * t ) - 1) + b;

        return _val;
    },

    moveNext(redundant) {
        // console.log("moveNext : ");
        
        while (true) {

            this.index++;
            if (this.index >= this.roadPoints.length) {

                this.player.position = this.roadPoints[this.roadPoints.length - 1]
                this.moving = false;

                this.callback && this.callback(this);

                break;
            }

            let last_point = this.roadPoints[this.index - 1];
            if (!this.checkRedundant)
            {
                // this.player.position = last_point;
                last_point = this.player.position;
            }

            this.target_point = this.roadPoints[this.index];
            this.moveDir = this.target_point.sub(last_point);

            let _distance = this.moveDir.mag();

            this.moveDir = this.moveDir.normalize();

            if (!this.checkRedundant) redundant = 0;
            
            if (redundant > 0) 
            {
                if (_distance > redundant) 
                {
                    // console.log("redundant ; ", redundant)
                    redundant = 0
                    // 此时 直接设置坐标会卡顿
                    this.player.position = last_point.add(this.moveDir.mul(redundant));
                }
                else 
                {
                    // console.log(this.index + " : ",redundant,"  ",_distance);
                    redundant -= _distance;
                    // console.log("redundant ; ", redundant, "   ", _distance)
                    // 此时 直接设置坐标会卡顿
                    this.player.position = this.target_point;// last_point.add(this.moveDir.mul(_distance));
                }
            }


            if (redundant <= 0) break;
        }

    },

    play(_time,_points,_isRoad,_callback)
    {
        let _supplement = 1000//400;
        let _speedDelta = 1000//500;
        // _time = 5;
        
        this.index = 0;
        this.time = _time;
        this.moving = !!this.player;
        this.points = _points;
        this.callback = _callback;

        if(_isRoad)
        {
            this.roadPoints = _points;
        }
        else
        {
            let _angle = 0.8;
            let _xThreshold = 10;

            let _s_point = _points[0];
            let _c_point = _points[1];
            let _e_point = _points[2];

            let _c_2_s_y = _c_point.y - _s_point.y;
            let _c_2_e_y = _c_point.y - _e_point.y;
            let _s_delta_x = Math.tan(_angle * Math.PI / 120) * _c_2_s_y;
            let _e_delta_x = Math.tan(_angle * Math.PI / 120) * _c_2_e_y;  

            let _s_offsetX = 0;
            if(_s_point.x - _e_point.x < -_xThreshold) _s_offsetX = -_s_delta_x 
            else if(_s_point.x - _e_point.x > _xThreshold) _s_offsetX = _s_delta_x 

            let _s_point_b1 = cc.v2(_s_point.x + _s_offsetX,_c_point.y);
            let _c_point_b1 = cc.v2(_s_point.x + _s_offsetX,_c_point.y);



            let _e_offsetX = 0;
            if(_s_point.x - _e_point.x < -_xThreshold) _e_offsetX = _e_delta_x 
            else if(_s_point.x - _e_point.x > _xThreshold) _e_offsetX = -_e_delta_x 

            let _c_point_b2 = cc.v2(_e_point.x + _e_offsetX,_c_point.y);
            let _e_point_b1 = cc.v2(_e_point.x + _e_offsetX,_c_point.y);

            let _roadPoint1s = BezierUtils.GetBezierPointList(120, [_s_point,_s_point_b1,_c_point_b1,_c_point]);
            _roadPoint1s.unshift(_s_point);
            
            let _roadPoint2s = BezierUtils.GetBezierPointList(120, [_c_point,_c_point_b2,_e_point_b1,_e_point]);

            this.roadPoints = [].concat(_roadPoint1s).concat(_roadPoint2s);


            // let _tempDistance = 0;
            // let _tempRoadPoints = [];
            // for (let j = 0; j < this.roadPoints.length; j++)
            // {
            //     let _rp = this.roadPoints[j];

            //     if(j == 0 || j == this.roadPoints.length - 1) _tempRoadPoints.push(_rp)
            //     else 
            //     {
            //         let _rp0 = this.roadPoints[j - 1];
            //         let _arg = _rp.sub(_rp0).mag();
            //         _tempDistance += _arg;
            //         // console.log(_arg);

            //         if (_tempDistance >= 16)
            //         {
            //             _tempRoadPoints.push(_rp);
            //             _tempDistance = 0;
            //         }
            //     }
            // }

            // this.roadPoints = _tempRoadPoints.concat();
            

            if(this.graphics && this.couldDraw)
            {
                this.graphics.clear();
                this.graphics.strokeColor = cc.Color.RED;
                this.graphics.lineWidth = 4;

                let _controls = [_s_point,_s_point_b1,_c_point_b1,_c_point,_c_point_b2,_e_point_b1,_e_point];
                for (let i = 0; i < _controls.length - 1; i++) {
                    this.graphics.moveTo(_controls[i].x, _controls[i].y);
                    this.graphics.lineTo(_controls[i + 1].x, _controls[i + 1].y);
                    this.graphics.stroke();
                }

                this.graphics.strokeColor = cc.Color.YELLOW;
                this.graphics.lineWidth = 8;
            }
        }
        


        let _distance = 0;
        let _roadPoints = this.roadPoints;

        for (let j = 0; j < _roadPoints.length; j++)
        {
            let _rp = _roadPoints[j];
            if (j > 0)
            {
                let _rp0 = _roadPoints[j - 1];
                let _arg = _rp.sub(_rp0).mag();
                _distance += _arg;
                // console.log(_arg);

                this._drawOneBezier(_rp,false);
            }
            else this._drawOneBezier(_rp,true);
        }

        if (!_isRoad)
        {
            this.time = GameMgr.calcMoveTimeInSuccess(_distance);
        }

        //(speed1 + speed2) * this.time / 2 = _distance;
        //speed2 = (_distance * 2) / this.time - speed1;

        //方案1
        // this.speed = 720;
        // let _speed2 = (_distance * 2) / this.time - this.speed;
        // let _speedDelta2 = _speed2 - this.speed;
        // if (_speedDelta2 < 300)
        // {
        //     this.speed = (_distance * 2 / this.time - _speedDelta) / 2;
        // }


        //方案2
        // this.speed = (_distance * 2 / this.time - _speedDelta) / 2;
        // if (this.speed > 900)
        // {
        //     this.speed = 900;
        //     let _speed2 = (_distance * 2) / this.time - this.speed;
        //     _speedDelta = _speed2 - this.speed;
        // }

        //方案3
        let _isOneRound = true;
        let _round = 1;
        let _speed2Rate = _isOneRound ? 2.25 : 1.96;
        this.speed = (_distance * 2 / this.time) / (1 + _speed2Rate);
        _speedDelta = this.speed * (_speed2Rate - 1);
        if (this.speed > 850 && !_isOneRound)
        {
            _round = 2;
            _speed2Rate = 2.22;
            this.speed = (_distance * 2 / this.time) / (1 + _speed2Rate);
            _speedDelta = this.speed * (_speed2Rate - 1);

            if (this.speed > 850)
            {
                _round = 3;
                _speed2Rate = 2.5;
                this.speed = (_distance * 2 / this.time) / (1 + _speed2Rate);
                _speedDelta = this.speed * (_speed2Rate - 1);

                if (this.speed > 850)
                {
                    _round = 4;
                    _speed2Rate = 2.76;
                    this.speed = (_distance * 2 / this.time) / (1 + _speed2Rate);
                    _speedDelta = this.speed * (_speed2Rate - 1);
                }
                
            }
        }

        this.tweenB = this.speed;
        this.tweenC = _speedDelta; //_speedDelta + _supplement;
        this.tweenT = 0;
        this.tweenD = this.time;

        // console.log("distance : ",_distance,"  round : ",_round,"   speed : ",this.speed,"   speedDE : ",_speedDelta,"   time : ",this.time);


        this.player.position = this.roadPoints[0];
        this.moveNext(0);

        return {
            points: this.roadPoints,
            distance: _distance,
            speed: this.speed,
            time : this.time,
        };
    },

    _drawOneBezier(point, _onlyMove = false)
    {
        if(!this.graphics || !this.couldDraw) return;

        if (!_onlyMove)
        {
            this.graphics.lineTo(point.x, point.y);
            this.graphics.stroke();
        }

        this.graphics.moveTo(point.x, point.y);
    },

    stop()
    {
        this.moving = false;
    },

});
