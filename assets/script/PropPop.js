/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-12-07 22:33:51
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-11 10:17:06
 * @FilePath: \WaterSort\assets\script\PropPop.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");
const { ITEM_TYPE } = require("./EnumHelper");
const GameMgr = require("./GameMgr");
const ImageMgr = require("./ImageMgr");
const ItemMgr = require("./ItemMgr");
const Observer = require("./Observer");
const UIBase = require("./UIBase");
const UIHelper = require("./UIHelper");
const WebBridge = require("./WebBridge");

cc.Class({
    extends: UIBase,

    properties: {
        
        numLabel: cc.Label,
        descLabel: cc.Label,
        priceLabel : cc.Label,
        image: cc.Sprite,
        price : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        GameMgr.pauseGame = true;
        Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
        
    },

    onDisable()
    {
        GameMgr.pauseGame = false;
    },
    // update (dt) {},

    setData()
    {
        this.image.spriteFrame = ImageMgr.getItemFrame(this.data.itemType);
        
        this.numLabel.string = 'x' + this.data.number;
        this.descLabel.string = this.data.desc;
        this.priceLabel.string = this.data.price;
        this.price = this.data.price;
    },

    adAction()
    {
        if (!Observer.fireInterval("prop", 200)) return;

        let _tp = this.data.itemType
        let _number = this.data.number;
        WebBridge.displayVideoInCommon(true, (state) =>
        {
            if (!cc.isValid(this))
            {
                ItemMgr.addItemCount(_tp, _number, true);
                Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
                return;
            }

            if (state) 
            {
                this.realGet(_number);
            }
        })

    },

    coinAction()
    {
        if (!Observer.fireInterval("prop", 200)) return;

        let _coin = ItemMgr.getItemCount(ITEM_TYPE.COIN);
        if (_coin < this.price)
        {
            UIHelper.displayUI("UICoinPop", null, true, true, null);
            return;
        }

        ItemMgr.addItemCount(ITEM_TYPE.COIN, -this.price,false);
        
        this.realGet(this.data.number);
    },

    realGet(_mul)
    {
        ItemMgr.addItemCount(this.data.itemType, _mul, true);
        Observer.fire(Observer.EVENT_NAME.REFRESH_PROP);
    
        this.close2();
    },
});
