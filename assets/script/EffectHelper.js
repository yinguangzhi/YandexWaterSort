// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const Config = require("./Config");
const { ITEM_TYPE } = require("./EnumHelper");
const ImageMgr = require("./ImageMgr");
const PoolHelper = require("./PoolHelper");
const UIHelper = require("./UIHelper");

module.exports = {
    
    collectPos: cc.v2(),
    constCurrency : null,
    coinCollectNode: null,
    
    isCurrencyValid()
    {
        return cc.isValid(this.constCurrency);
    },
    setCurrency(cCurrency)
    {
        this.constCurrency = cCurrency;
    },

    displayCoinFly(number,from,to,pos,delay,callback)
    {
        for (let i = 0; i < number; i++)
        {
            let index = i;
            let scale1 = CocosHelper.randomRangeFloat(0.95, 1.12);
            let scale2 = CocosHelper.randomRangeFloat(0.6, 0.86);
            let xDelta = CocosHelper.randomRange(-90, 90);
            let yDelta = CocosHelper.randomRange(-80, 80);
            
            let pos2 = cc.v2(pos.x + xDelta, pos.y + yDelta);
        
            let par = UIHelper.getPermanentsParent(null);
            pos2 = CocosHelper.convertPos(from, par, pos2);
           
            if (!to) to = this.constCurrency.getCoinNode();
            let pos3 = CocosHelper.convertPos(to, par, cc.v2());

            let obj = PoolHelper.getNote(PoolHelper.POOL_NAME.coin, true, par);
            if (!obj) continue;
            
            obj.getComponent(cc.Sprite).spriteFrame = ImageMgr.getItemFrame(ITEM_TYPE.COIN);
            obj.position = pos2;
            obj.scale = 0;
            
            cc.tween(obj)
                .delay(delay)
                .delay(0.1 * (index ))
                .to(0.25, { scale: scale1 })
                .to(0.18, { scale: scale2 })
                .to(0.5,{position : pos3,scale : 1})
                .call(() =>
                {
                    PoolHelper.restore(PoolHelper.POOL_NAME.coin, obj);
                    
                    AudioHelper.playAudio(AudioHelper.AUDIO_NAME.COIN);

                    if (index == 0) callback && callback();
                    // this.constCurrency?.displayAnima();
                })
                .start();    
        }
        
        
    },

    
    displayPropFly(_itemType,number,from,to,pos,delay,callback)
    {
        for (let i = 0; i < number; i++)
        {
            let index = i;
            let scale1 = CocosHelper.randomRangeFloat(0.95, 1.12);
            let scale2 = CocosHelper.randomRangeFloat(0.6, 0.86);
            let xDelta = CocosHelper.randomRange(-90, 90);
            let yDelta = CocosHelper.randomRange(-80, 80);
            
            let pos2 = cc.v2(pos.x + xDelta, pos.y + yDelta);
        
            let par = UIHelper.getPermanentsParent(null);
            pos2 = CocosHelper.convertPos(from, par, pos2);
           
            let pos3 = cc.v2(0,-cc.view.getFrameSize().height * 0.5 - 200)
            if(to) pos3 = CocosHelper.convertPos(to, par, cc.v2());

            let obj = PoolHelper.getNote(PoolHelper.POOL_NAME.coin, true, par);
            if (!obj) continue;
            
            obj.getComponent(cc.Sprite).spriteFrame = ImageMgr.getItemFrame(_itemType);
            obj.position = pos2;
            obj.scale = 0;
            
            cc.tween(obj)
                .delay(delay)
                .delay(0.1 * (index ))
                .to(0.25, { scale: scale1 })
                .to(0.18, { scale: scale2 })
                .to(0.5,{position : pos3,scale : 1})
                .call(() =>
                {
                    PoolHelper.restore(PoolHelper.POOL_NAME.coin, obj);
                    
                    AudioHelper.playAudio(AudioHelper.AUDIO_NAME.COIN);

                    if (index == 0) callback && callback();
                })
                .start();    
        }
        
        
    },
}
