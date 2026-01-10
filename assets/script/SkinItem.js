
const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const { MISSION_TYPE, ITEM_TYPE } = require("./EnumHelper");
const ItemMgr = require("./ItemMgr");
const MissionMgr = require("./MissionMgr");
const Observer = require("./Observer");
const SSDScript = require("./SSDScript");
const StorageHelper = require("./StorageHelper");
const UIHelper = require("./UIHelper");

cc.Class({
    extends: SSDScript,

    properties: {
        grayBG: cc.Node,
        normalBG: cc.Node,
        priceLabel: cc.Label,
        selectedNode: cc.Node,
        currencyBtn : cc.Node,
        selectBtn : cc.Node,
        unknownNode: cc.Node,
        skin1 : cc.Node,
        skin2 : cc.Node,
        skinWho: cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Observer.registerMass(Observer.EVENT_NAME.REFRESH_SKIN_SELECT, this.setData, this);
    },

    setData()
    {
        console.log(this.data);
        let _unknown = this.data.unknown == 1;
        this.grayBG.active = _unknown;
        this.normalBG.active = !_unknown;
        this.priceLabel.string = _unknown ? "???" : this.data.price;
        this.unknownNode.active = _unknown;

        let _arr = ItemMgr.getItemCount(ITEM_TYPE.SKINS);
        let _unlock = _arr.indexOf(this.data.id) != -1;
        let _selected = ItemMgr.skinID() == this.data.id;
        this.selectedNode.active = !_unknown && _unlock && _selected;
        this.selectBtn.active = !_unknown && _unlock && !_selected;
        this.currencyBtn.active = !_unknown && !_unlock;

        this.skin1.active = this.data.id == 1;
        this.skin2.active = this.data.id == 2;
        this.skinWho.active = _unknown;
    },

    buyAction()
    {

        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("skin",200))
            return;

        if (this.data.price > ItemMgr.getItemCount(ITEM_TYPE.COIN))
        {
            UIHelper.displayUI("UICoinPop", null, true, true, null);
        }
        else
        {
            ItemMgr.addItemCount(ITEM_TYPE.COIN, -this.data.price, false);
            ItemMgr.setItemCount(ITEM_TYPE.SKIN_ID, this.data.id,false);
            StorageHelper.addItem(StorageHelper.STORAGE_PROPERTY.SKINS, this.data.id, true);
            Observer.fireMass(Observer.EVENT_NAME.REFRESH_CURRENCY);
            Observer.fireMass(Observer.EVENT_NAME.REFRESH_SKIN_SELECT);
        }
        
    },

    selectAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("skin",200))
            return;

        console.log("set item : ", this.data.id);
        ItemMgr.setItemCount(ITEM_TYPE.SKIN_ID, this.data.id,true);
        Observer.fireMass(Observer.EVENT_NAME.REFRESH_SKIN_SELECT);

    },
});
