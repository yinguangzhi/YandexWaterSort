// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { log } = require("console");

module.exports =
{
    isH5: false,
    ySdk : null,
    userInfo: null,
    player: null,
    playerName: "",
    playerPhoto: "",
    shareBattle: false,
    iconList: {},
    localPlatform: "ANDROID",
    supportedAPIs: null,
    authorization: false,//授权
    screenWidth: 0,
    screenHeight: 0,
    isIOS : false,
    isPC : false,
    lang : 'en',

    isNative() {
        return cc.sys.isNative;
    },

    trackEvent2(_eventID,_key,_val)
    {},

    hasApi(apiName) {
        if (!this.supportedAPIs) {
            if (window.isFB) this.supportedAPIs = FBInstant.getSupportedAPIs();
            // console.log(this.supportedAPIs);
        }

        let ret = false;
        if (this.supportedAPIs) {
            ret = this.supportedAPIs.indexOf(apiName) != -1;
            if (!ret) console.log("api is not exist : ", apiName)
        }
        return ret;
    },

    init: function () {
        this.ySdk = window.ysdk;
        this.isH5 = this.ySdk != null;

        // this.isPC = true;
        console.log("is h5 : ",this.isH5);
        // this.lastFullTime = this.currentTime();
        
        if (!this.isH5) return;
        
        console.log(`User Language: ${ysdk.environment.i18n.lang}`);
        this.lang = this.ySdk.environment.i18n.lang;
        try{
            this.isPC = this.ySdk.deviceInfo.isDesktop();
            console.log('deviceInfo : ',this.ySdk.deviceInfo);
            console.log('desktop : ',this.ySdk.deviceInfo.isDesktop());
            console.log('mobile : ',this.ySdk.deviceInfo.isMobile());
            console.log('tablet : ',this.ySdk.deviceInfo.isTablet());
            console.log('tv : ',this.ySdk.deviceInfo.isTV());
        }
        catch(e)
        {

            console.log('deviceInfo err : ',this.lang);
        }
        console.log('User Language: ',this.lang);
    },

    login(callback) {
        console.log("login ...");

        if (callback) callback(true);
    },

    realEnterH5()
    {
        if (!this.isH5) return;
        this.ySdk.features.LoadingAPI?.ready();
    },

    initPlayer() {

        if (!this.isH5) return;

        this.ySdk.getPlayer()
            .then(_player => {
                player = _player;
                console.log(JSON.stringify(player));
            }).catch(err => {
                // 初始化 Player 对象时出错。
                console.log("get player error " + JSON.stringify(err));
            });
    },

    paused: false,
    bindPause() {

        if (this.paused) return;

        this.paused = true;

       
    },

    getDelayTime(isMidi)
    {
        if(isMidi) return 0;

        if (this.isH5) {
            if (this.isIOS) return 0.02;
            else return 0.02;// 0.24;
        }
        else if (this.isNative()) return 0.22;
        else return 0.02;
    },

    getSDKVersion() {
        let ret = "";
    },

    getContextID() {
        let ret = "";
    },

    trackEvent(eventStr) { },

    loadRemoteTexture: function (container, url, userID, _loading, _callback) {

        let that = this;

        let setIcon = (frame) =>
        {
            that.iconList[userID] = frame;

            if (cc.isValid(container)) container.spriteFrame = frame;
            if (cc.isValid(_loading)) _loading.active = false;
            _callback && _callback();
        };

        let frame = that.iconList[userID];
        if (frame) {
            setIcon(frame);
            return;
        }

        if (cc.isValid(_loading)) _loading.active = true;

        if (this.isH5) {
            let playerImage = new Image();
            playerImage.crossOrigin = 'anonymous';
            playerImage.onload = function ()
            {
                let texture2d = new cc.Texture2D();
                texture2d.initWithElement(playerImage);
                texture2d.handleLoadedTexture();

                frame = new cc.SpriteFrame(texture2d);

                setIcon(frame);
            }

            playerImage.src = this.playerPhoto;
        }
        else {
            if (cc.isValid(_loading)) _loading.active = false;
            _callback && _callback();
        }
    },

    isPhoneSupportVibrate()
    {
        this.pVib();
        return this.vibrateTip == 1 || this.vibrateTip == 2;
    },

    vibrateTip : 0,
    pVib() {
        if (this.vibrateTip != 0) return;
        
        let _can = "vibrate" in navigator;
        if (_can) this.vibrateTip = 2;
        else this.vibrateTip = 3;

        
        // if (!this.isFB) return;
            
        // if (this.localPlatform != "IOS" && this.localPlatform != "ANDROID") 
        // {
        //     this.vibrateTip = 3;
        // }
        // else if (this.vibrateTip == 3)
        // {
        //     if (this.hasApi("performHapticFeedbackAsync")) this.vibrateTip = 1;
        // }
    },

    /** 震动 */
    vibrate() {
        this.pVib();

        if (this.vibrateTip == 1) FBInstant.performHapticFeedbackAsync();
        else if (this.vibrateTip == 2) navigator.vibrate(40);
    },

     
    checkVibrate() {
        this.pVib();
    },

    vibrateAction(vibrateTime) {
        this.vibrate();
    },
    vibrateState: 0,
     
    checkVibrate() {
        if (this.vibrateState != 0) return;

        let _could = "vibrate" in navigator;
        if (_could) this.vibrateState = 2;
        else this.vibrateState = 3;
    },

    vibrateAction(vibrateTime) {
        
        if (this.isIOS) return;

        this.checkVibrate();
        if (this.vibrateState == 2) navigator.vibrate(40);
    
    },

    suggestGame(id,type)
    {
    },

    inviteFriend(texPath, _callback) {

        let that = this;


    },

    battleScore: 0,
    battleFriendID: -1,
    battleFriendName: "",
    battleFriendPhoto: null,
    playWithFriend: function (_callback) {
        
    },

    createShortcut: function (_check, _callback) {
        
        if (!this.isH5) return;

        this.ySdk.shortcut.canShowPrompt()
            .then(prompt => {
                console.log('Shortcut is allowed?:', prompt);
                if (prompt.canShow) {
                    // 您可以在此处显示用于添加快捷方式的按钮
                }
            });
        
        if (_check) return;

        this.ySdk.shortcut.showPrompt()
            .then(result => {
                console.log('Shortcut created?:', result);
                if (result.outcome === 'accepted') {
                    // 您可以在此处提供添加快捷方式的奖励
                    console.log('Shortcut is success allowed?:', prompt);
                }
            });

    },

    createTTShortcut() {

    },

    updateType:
    {
        update: 1, share: 5
    },

    updateToPlatform: function (texPath, updateAT, data, _callback) {
       
    },

    realUpdateToPlatform: function (canvasTex, updateAT, data, _callback) {
        
    },

    couldDrawImage(image) {
        let ret = false;
        try {
            ret = image instanceof HTMLImageElement ||
                image instanceof SVGImageElement ||
                image instanceof HTMLVideoElement ||
                image instanceof HTMLCanvasElement ||
                image instanceof ImageBitmap ||
                image instanceof OffscreenCanvas;
        }
        catch (e) { }
        return ret;
    },

    setProtoRank(title, score) {
        
        
    },


    ADState:
    {
        NotLoad: 0, LoadSuccess: 1, LoadFail: 2, Loading: 3,
    },


    initFullADBefore(_initFull) {
        this.initFullAD();
    },

    loadFullFinishCallBack : null,
    setFullADLoadCallBack(callback) { 
        this.loadFullFinishCallBack = callback;
    },

    fullFailInitCnt: 0,
    fullLoadTime: 0,
    fullState: 0,
    fullAD: null,
    initFullAD: function () {
        if (this.isH5) {
        }
        else {
            this.fullState = this.ADState.LoadSuccess;
        }
    },

    lastFullTime: -10,
    displayFullAD(_callback) {

        if (this.isH5) {

            this.ySdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function(wasShown) {
                        
                        console.log("display intertisital : ",wasShown);
                        _callback && _callback();
                    },
                    onError: function(error) {
                        console.log("err in display intertisital : ",JSON.stringify(error));
                        _callback && _callback();
                    }
                }
            })
        }
        else {
            
            if (_callback) _callback();
        }
    },

    initVideoADBefore(_initVideo) {
        
        if (_initVideo ) {
            this.initVideoAD();
        }
    },
    
    loadVideoFinishCallBack : null,
    setVideoADLoadCallBack(callback) { 
        this.loadVideoFinishCallBack = callback;
    },

    initVideoAD: function () {
        console.log("init video ad")
        
    },

    displayVideoAD(_callback) {
      
        let _cacheCallBack = _callback;
        if (this.isH5) {
            let _complete = false;
            this.ySdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        console.log('Video ad open.');
                    },
                    onRewarded: () => {
                        _complete = true;
                        console.log('Rewarded!');
                    },
                    onClose: () => {
                        _cacheCallBack && _cacheCallBack(_complete);
                        _cacheCallBack = null;
                        console.log('Video ad closed.');
                    },
                    onError: (e) => {
                        console.log('Error while open video ad:', e);
                    }
                }
            })
            
        }
        else { 
            
            _cacheCallBack && _cacheCallBack(true);

        } 
    },

    isVideoADLoad() {
        return true;
    },

    isVideoADLoading() {
        return false;
     },

    isFullADLoad() {
        return true;
    },

    isFullADLoading() {
        return false;
     },

    displayBanner(_callback) {

    },

    setBannerState(_state)
    {

    },

    hideBanner() {

        
    },
    postSessionScore(_score) {
        
    },

    exitGame: function () {
        if (window.isFB) {
            FBInstant.quit();
        }
    },

    isEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },

    currentTime() {
        let now = new Date();
        let seconds = now.getTime() / 1000;
        return seconds;
    },

    getUpdateString: function (core) {
        let locale = FBInstant.getLocale();
        let shareStr = "Wow,it's real cool.";

        let ud =
        {
            default: shareStr,
            localizations:
            {
                en_US: shareStr,
                es_ES: shareStr,
                pt_BR: shareStr,
                pt_PT: shareStr,
                fr_CA: shareStr,
                fr_FR: shareStr,
                ar_AR: shareStr,
                id_ID: shareStr,
                tr_TR: shareStr,
                de_DE: shareStr,
                it_IT: shareStr,
                ru_RU: shareStr,
                ja_JP: shareStr,
                nl_BE: shareStr,
                nl_NL: shareStr,
                sv_SE: shareStr,
                hu_HU: shareStr,
                el_GR: shareStr,
                cs_CZ: shareStr,
                vi_VN: shareStr,
                pl_PL: shareStr,
                tl_PH: shareStr,
                zh_HK: shareStr,
                zh_TW: shareStr,
                zh_CN: shareStr,
                ko_KO: shareStr,
                ms_MY: shareStr,
                th_TH: shareStr,
            }
        };
        return ud;
    },

    getShareString: function (core) {
        let shareStr = "Wow,it's real cool.";
        return shareStr;
    },
}
