/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-11 15:09:56
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-01-20 22:58:10
 * @FilePath: \Block\assets\script\TouchHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports =
{
    touchStartPos: cc.v2(),
    touchEndPos: cc.v2(),
    
    touchStartTime : 0,
    touchDistance : 0,
    touchDuration: 0,

    touchID : -1,
    /**
     * @description 注册点击
     * @param {*} touch 
     * @param {点下的回调} startCall 
     * @param {点中后移动的回调} moveCall 
     * @param {点击释放的回调} endCall 
     * @returns 
     */
    bindTouch(touch,startCall,moveCall,endCall,isUnique = true)
    {
        if(!touch) return;

        touch.on(cc.Node.EventType.TOUCH_START, (event) =>
        {
            if(this.touchID != event.touch.getID() && this.touchID != -1) return;

            this.touchID = event.touch.getID();
            
            let pos = event.touch.getLocation();
            this.touchStartPos = pos;
            this.touchEndPos = pos;
            
            this.touchStartTime = this.getTime();

            this.touchDistance = 0;
            this.touchDuration = 0;

            startCall && startCall(event)
            return;
        });

        touch.on(cc.Node.EventType.TOUCH_MOVE, (event) =>
        {
            if(this.touchID != event.touch.getID()) return;

            let pos = event.touch.getLocation();
            this.touchEndPos = pos;
            
            this.touchDistance = this.touchEndPos.sub(this.touchStartPos).mag();
            
            this.touchDuration = this.getTime() - this.touchStartTime;

            moveCall && moveCall(event)
        });


        let cancelCall = (event) =>
        {
            let pos = event.touch.getLocation();
            
            // let dis = pos.sub(this.touchStartPos).mag();
            // this.touchDistance = dis;
            
            // this.touchDuration = this.getTime() - this.touchStartTime;

            endCall && endCall(event)
        };

        touch.on(cc.Node.EventType.TOUCH_CANCEL, (event) =>
        {
            if(this.touchID != event.touch.getID()) return;
            this.touchID = -1;

            cancelCall(event);
        })

        touch.on(cc.Node.EventType.TOUCH_END, (event) =>
        {
            if(this.touchID != event.touch.getID()) return;
            this.touchID = -1;

            cancelCall(event);
        })
    },

    resetTouchID()
    {
        this.touchID = -1;
    },

    isInTouching()
    {
        return this.touchID != -1;
    },


    operateMap : {},
    addOperate(attach, val)
    {
        let cnt = this.operateMap[attach];
        if (this.isEmpty(cnt)) this.operateMap[attach] = 0;

        this.operateMap[attach] += val;
    },

    /**
     * @description 设置操作值，默认为0
     * @param {*} attach 
     * @param {*} value 
     */
    setOperateValue(attach,value = 0)
    { 
        let cnt = this.operateMap[attach];
        if (this.isEmpty(cnt)) this.operateMap[attach] = 0;

        this.operateMap[attach] = value;
    },
    
    isInOperating(attach)
    { 
        let cnt = this.operateMap[attach];
        if (this.isEmpty(cnt)) this.operateMap[attach] = 0;

        return this.operateMap[attach] > 0;
    },
    

    getTime() {
        let now = new Date();
        return now.getTime() / 1000;
    },

    isEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}