// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const TimerHelper = require("./TimerHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        removeList : null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.removeList = [];
    },

    update(dt) {
        if (!TimerHelper.isValid()) return;

        for (let i = 0; i < TimerHelper.eventListeners.length; i++)
        {
            let timer = TimerHelper.eventListeners[i];
            if (!timer) continue;

            if (timer.count == 0) continue;

            if (!timer.isPause)
            {
                timer.left -= dt;
            }    
            else
            {
                continue;    
            }
            
            
            if (timer.left <= 0)
            {
                timer.count -= 1;
                timer.left = timer.duration;
                timer.call && timer.call();

                if (timer.count == 0)
                {
                    this.removeList.push(timer);
                }
                
            }
            
        }
        
        if (this.removeList.length != 0)
        {
            for (let i = this.removeList.length - 1; i >= 0; i--)
            {
                let timer = this.removeList[i];
                if (!timer) continue;
                
                TimerHelper.unRegister(timer.name);    
                
            }    

            this.removeList.length = 0;
        }
        
    },
});
