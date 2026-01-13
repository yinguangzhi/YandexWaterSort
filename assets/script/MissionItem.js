// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const { MISSION_TYPE } = require("./EnumHelper");
const { default: i18nMgr } = require("./i18n/i18nMgr");
const MissionMgr = require("./MissionMgr");
const Observer = require("./Observer");
const SSDScript = require("./SSDScript");
const UIHelper = require("./UIHelper");

cc.Class({
    extends: SSDScript,

    properties: {
        starLabel: cc.Label,
        goBtn: cc.Node,
        claimBtn: cc.Node,
        claimedBtn: cc.Node,
        descLabel: cc.Label,
        pfLabel: cc.Label,
        pf: cc.Sprite,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    setData()
    {
        let _pInfo = MissionMgr.getMissionProgress(this.data.id);
        this.goBtn.active = !_pInfo.can && !_pInfo.claimed;
        this.claimBtn.active = _pInfo.can;
        this.claimedBtn.active = _pInfo.claimed;
        this.pfLabel.string = _pInfo.percentDesc;
        this.pf.node.width = _pInfo.percent * 210;
        // this.descLabel.string = this.data.desc;
        this.descLabel.string = i18nMgr.ins.getLabel(this.data.descLang,[this.data.params]) ;
    },

    refreshNext()
    {
        let _next = MissionMgr.getNextMission(this.data.id);
        if (!_next) this.setData();
        else this.data = _next;
    },
    
    
    goAction()
    { 
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("mission",200))
            return;
        
        if (this.data.type == MISSION_TYPE.AD)
        {
            UIHelper.hideUI("UIMission");
            UIHelper.displayUI("UICoinPop", null, true, true, null);
        }
        else if (this.data.type == MISSION_TYPE.LEVEL || this.data.type == MISSION_TYPE.LOGIN)
        {
            let _canvas = cc.find("Canvas");
            if (!_canvas) return;
            let _hg = _canvas.getComponent("HomePage");
            if (!_hg) return;
            _hg.realEnterGame();
            UIHelper.hideUI("UIMission");
        }
    },
    
    claimAction()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        
        if(!Observer.fireInterval("mission",200))
            return;
    
        MissionMgr.claimMission(this.data.id);

        let um = UIHelper.getUI("UIMission");
        if (!um) return;

        
        um.getComponent("UIMission").claim(this,this.data.reward,this.starLabel.node);
    },
});
