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
    userInfo: null,
    playerID: 0,
    asid : 0,
    playerName: "",
    playerPhoto: "",
    shareBattle: false,
    iconList: {},
    localPlatform: "ANDROID",
    supportedAPIs: null,
    authorization: false,//授权
    screenWidth: 0,
    screenHeight: 0,
    isIOS: false,
    isPC : true,
    isFB : false,

    isNative() {
        return cc.sys.isNative;
    },

    hasApi(apiName) {
        if (!this.supportedAPIs) {
            if (window.isFB) this.supportedAPIs = FBInstant.getSupportedAPIs();
            // console.log(this.supportedAPIs);
        }

        let ret = false;
        if (this.supportedAPIs) {
            ret = this.supportedAPIs.indexOf(apiName) != -1;
            // if (!ret) console.log("api is not exist : ", apiName)
        }
        return ret;
    },

    init: function () {
        this.isFB = window.FBInstant != null;
        window.isFB = window.FBInstant != null;

        this.lastFullTime = this.currentTime();
    },

    getTopOffsetInPlatform() {
        if (window.isFB) return 0;
        else return 0;
    },

    login(callback) {
        let that = this;
        // console.log("login ...");

        if (callback) callback(true);
    },


    initPlayer() {

        if (window.isFB) {
            
            // console.log("enter init player");

            setTimeout(() => {
                
                let _sid = FBInstant.player.getASIDAsync()
                    .then(asid =>
                    {
                        this.asid = asid;
                        // console.log("asid : " + asid);
                        this.subscribeFBBot();
                        // this.setBotMessage(true);
                        
                    })
                    .catch((err) =>
                    {
                        // console.log("error in get asid");
                        // console.log(err);
                    });
                
            }, 2000);
            
            
            // let sdkVersion = FBInstant.getSDKVersion();
            this.playerID = FBInstant.player.getID();
            this.localPlatform = FBInstant.getPlatform();
            this.isIOS = this.localPlatform == "IOS";
            this.isPC = this.localPlatform == "WEB";

            this.playerName = FBInstant.player.getName();
            this.playerPhoto = FBInstant.player.getPhoto();

            console.log("local : ", this.localPlatform);
            this.pVib();
        }
    },

    /**
     * 关注游戏主页
     * @param {*} _callback 
     */
    communityPage(_callback)
    {
        if (this.isFB) {
            // if (!this.hasApi("community.canFollowOfficialPageAsync")) return;

            FBInstant.community.canFollowOfficialPageAsync()
                .then((players) => {
                    // console.log("canFollowOfficialPageAsync success :" + JSON.stringify(players));
                    
                    FBInstant.community.followOfficialPageAsync()
                        .then((players) => {
                            // console.log("成功,followOfficialPageAsync:" + JSON.stringify(players));
                            _callback && _callback(true,true);
                        })
                        .catch((err) => {
                            // console.log("失败,followOfficialPageAsync " + JSON.stringify(err));
                            _callback && _callback(true,false);
                        });
                })
                .catch((error) => {
                    // console.log("canFollowOfficialPageAsync error : ", error);
                    _callback && _callback(false,false);
                })
            
        }
        else _callback && _callback(false,false);
        
    },

    /**
     * 加入小组
     * @param {*} _callback 
     */
    joinGameGroup(_callback)
    {
        // console.log("canJoinOfficialGroupAsync.............. ");
        if (!this.isFB)
        {
            _callback && _callback(false);
            return;
        }

        // console.log("canJoinOfficialGroupAsync.............. ");
        
        FBInstant.community.canJoinOfficialGroupAsync()
            .then((data) => {
                // console.log("canJoinOfficialGroupAsync : ",data);
                FBInstant.community.joinOfficialGroupAsync()
                    .then((result) =>
                    {
                        // console.log("joinOfficialGroupAsync success : ",result);
                        _callback && _callback(true);
                    })
                    .catch(error =>
                    {
                        // console.log("joinOfficialGroupAsync fail : ",JSON.stringify(error));
                        _callback && _callback(false);
                    }
                )
                
            })
            .catch(error =>
            {
                // console.log("canJoinOfficialGroupAsync fail : ",JSON.stringify(error));
                _callback && _callback(false);
                
            });
    },

    cusPostSession(score)
    {
        if (window.isFB )
            {

                // FBInstant.getTournamentAsync()
                // .then(function(tournament) {
                //    console.log("tournament : " + tournament.getContextID());
                //    console.log("tournament : " + tournament.getEndTime());
                //    console.log("tournament : " + tournament.getTitle());
                //    console.log("tournament : " + tournament.getPayload());
                // })
                // .catch(error =>
                //     {
                //         console.log("tournament fail : " + JSON.stringify(error));
                //     }
                // );

                try
                {
                    FBInstant.tournament.postScoreAsync(score)
                    .then(
                        response => {
                            // console.log("tournament.postScoreAsync: " + score);
                    })
                    .catch(error =>
                        {
                            // console.log("tournament.postScoreAsync fail : " + JSON.stringify(error));
                        }
                    );
                }
                catch(err)
                {

                }
            }
    },

    paused: false,
    bindPause() {

        if (this.paused) return;

        this.paused = true;

        if (window.isFB) {
            // console.log('subscribe pause');
            FBInstant.onPause(function () {
                // console.log('pause was triggered');
            });
        }
    },

    sBot : false,
    subscribeFBBot()
    {
        if(this.sBot) return;
        this.sBot = true;

        if(window.isFB)
        {
            this.hasApi("player.canSubscribeBotAsync");
            this.hasApi("player.subscribeBotAsync");

            FBInstant.player.canSubscribeBotAsync()
                .then((can_subscribe) =>
                {
                    // console.log("can subscribeFBBot : ",can_subscribe);

                    if (can_subscribe)
                    {
                        FBInstant.player.subscribeBotAsync()
                            .then(() =>
                            {
                                this.saveBotResult(1);
                                this.setBotMessage(true);
                                // console.log("success subscribeFBBot");
                            })
                            .catch((e) =>
                            {
                                this.saveBotResult(0);
                                this.setBotMessage(false);
                                // console.log("subscribeFBBot error : ",e.message);
                            });
                    }
                    else
                    {
                        this.saveBotResult(0);
                        this.setBotMessage(false);
                        // console.log("can not subscribeFBBot");
                    }
                })
                .catch((e) =>
                {
                    this.readBotResult();
                    // console.log("canSubscribeBotAsync error : ",e.message);
                });
        }
        else
        {
            this.saveBotResult(1);
            this.setBotMessage(true);
        }
    },

    readBotResult:function()
    {
        if(window.isFB)
        {
            FBInstant.player.getDataAsync(['post'])
                .then((data) =>
                {
                    let post = data['post'];
                    this.setBotMessage(post == 1);
                })
                .catch((e) =>
                {
                    this.setBotMessage(true);
                    // console.log("fb bot error : ");
                });
        }
        else
        {
            this.setBotMessage(true);
        }
    },

    saveBotResult:function(post)
    {
        if(window.isFB)
        {
            FBInstant.player.setDataAsync (
                { //0不可以  1可以
                    post: post,
                })
                .then(function()
                {})
                .catch(error => console.error('set data error' + error));
        }
    }, 

    sessionBlock :
        {
            scoutSent: true,
            name: "",
            asid : "",
            scoutDurationInHours: 24,
        },

    setBotMessage:function(isSent)
    {
        this.sessionBlock.scoutSent = isSent;
        this.sessionBlock.asid = this.asid;
        this.sessionBlock.name = this.playerName;
        this.sessionBlock.scoutDurationInHours = 24;

        if(window.isFB)
        {
            this.hasApi("setSessionData");

            // console.log("post : " + this.sessionBlock.name + "  " + this.sessionBlock.asid);
            FBInstant.setSessionData(this.sessionBlock);
        }
    },

    getSDKVersion() {
        let ret = "";
        if (window.isFB) ret = FBInstant.getSDKVersion();
        console.log("SDKVersion : " + ret);
        return ret
    },

    getContextID() {
        let ret = "";
        if (window.isFB) ret = FBInstant.context.getID()
        console.log("context.id : " + ret);
        return ret
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

        if (window.isFB) {
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

        
        if (!this.isFB) return;
            
        if (this.localPlatform != "IOS" && this.localPlatform != "ANDROID") 
        {
            this.vibrateTip = 3;
        }
        else if (this.vibrateTip == 3)
        {
            if (this.hasApi("performHapticFeedbackAsync")) this.vibrateTip = 1;
        }
    },

    /** 震动 */
    vibrate() {
        this.pVib();

        if (this.vibrateTip == 1) FBInstant.performHapticFeedbackAsync();
        else if (this.vibrateTip == 2) navigator.vibrate(40);
    },

    vibrateState: 0,
     
    checkVibrate() {
        this.pVib();
        return;
        if (this.vibrateState != 0) return;

        let _could = "vibrate" in navigator;
        if (_could) this.vibrateState = 2;
        else this.vibrateState = 3;


        let _plat = "";
        if (this.isFB)
        {
            _plat = this.localPlatform;
        
            if (_plat != "IOS" && _plat != "ANDROID") this.vibrateState = 3;
            else if (this.vibrateState = 3 && this.hasApi("performHapticFeedbackAsync"))
            {
                this.vibrateState = 1;
                console.log("use fb vibrate api");
            }
        }
    },

    vibrateAction(vibrateTime) {
        this.vibrate();
        return;
        this.checkVibrate();
        if (this.vibrateState == 1) FBInstant.performHapticFeedbackAsync();
        else if (this.vibrateState == 2) navigator.vibrate(40);
    },

    getEntryPoint()
    {
        if (!this.isFB) return;

        try
        {
            let entryPointData = FBInstant.getEntryPointData();
            console.log("entryPointData : ", entryPointData);
            if (!this.isEmpty(entryPointData) &&
                !this.isEmpty(entryPointData['enterTip']) &&
                !this.isEmpty(entryPointData['type']))
            {
                let _eID = entryPointData['enterTip'] + "_" + entryPointData['type'];
                this.logEvent(_eID)
            }

            FBInstant.getEntryPointAsync()
                .then((entrypoint) => {
                    
                    console.log("getEntryPointAsync : ", entrypoint);
                });
        }
        catch (e)
        {

        }
        
    },

    solitaireID : "851462616235993",
    neonID: "266284738900640",
    hexID : "1349678699786744",
    suggestGame(id,type)
    {
        let arg = this.isEmpty(type) ? "suggest" : type;
        if(this.isFB)
        {
            // console.log("switchGame in fb")
    
            this.logEvent("ClickSuggest")
            FBInstant.switchGameAsync(id,{enterTip: 'suggest',type:arg})
                .catch(function (e)
                {
                    // console.log("switchGame error : " + e.message)
                });
        }
    },

    inviteFriend(texPath, _callback) {


        cc.resources.load(texPath, cc.Texture2D, (err, canvasTex) => {
            
            if (this.isFB) {

                
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = 600;
                canvas.height = 345;

                let image = null;

                if (canvasTex) {
                    image = canvasTex.getHtmlElementObj();
                    if (this.couldDrawImage(image)) ctx.drawImage(image, 0, 0, 600, 345);
                }
                else {
                    // console.log(" canvasTex is wrong in : inviteFriend");
                }

                let base64Picture = canvas.toDataURL('image/png');

                let desc = this.getUpdateString();
                let id = this.playerID;

                FBInstant.inviteAsync({
                    image: base64Picture,
                    text: desc,
                    data: { type: "invite", score: 0, id: id },
                }).then(() => {

                    if (_callback) _callback(true,null);

                }).catch((error) => {

                    if (_callback) _callback(false,error);
                });
            }
            else if (_callback) _callback(true,{code:"PENDING_REQUEST"});
        })

    },

    battleScore: 0,
    battleFriendID: -1,
    battleFriendName: "",
    battleFriendPhoto: null,
    playWithFriend: function (_callback) {
        let that = this;

        if (window.isFB) {
            FBInstant.context.chooseAsync()
                .then(() => {
                    

                    FBInstant.context.getPlayersAsync()
                        .then((players) => {
                            that.battleFriendID = 1;
                            
                            console.log(players);

                            if (that.isEmpty(players)) {
                            }
                            else {
                                if (players.length > 0)
                                {
                                    players.forEach(function (_player) {
                                        if (_player.getID() != that.playerID) {

                                            that.addToCompleteFriend(_player.getID(), _player.getName(), _player.getPhoto());
                                        }
                                    })    
                                }
                                
                                if (players.length == 2) {
                                    players.forEach(function (_player) {
                                        if (_player.getID() != that.playerID) {
                                            that.battleFriendID = _player.getID();
                                            that.battleFriendName = _player.getName();
                                            that.battleFriendPhoto = _player.getPhoto();
                                        }
                                    })
                                }
                            }
                            if (_callback) _callback(true);
                        })
                        .catch(function (error) {
                            if (_callback) _callback(false);
                        });
                })
                .catch(function (error) {
                    if (error.code == "USER_INPUT") {
                        if (_callback) _callback(false);
                    }
                    else {
                        that.battleFriendID = 1;
                        if (_callback) _callback(true);
                    }
                });
        }
        else {
            if (_callback) _callback(true);
        }
    },

    fightWithUser: function (userID, userName, userPhoto, userScore, _callback) {
        let that = this;

        if (window.isFB) {
            if (that.isEmpty(userID)) userID = "1";

            this.battleFriendID = userID;
            this.battleFriendName = userName;
            this.battleFriendPhoto = userPhoto;
            this.battleScore = userScore;
            
            FBInstant.context.createAsync(userID)
                .then(function () {
                    that.shareBattle = true;
                    _callback && _callback(true);
                })
                .catch(function (error) {
                    if (error.code == "SAME_CONTEXT") {
                        that.shareBattle = true;
                        _callback && _callback(true);
                    }
                    else {
                        _callback && _callback(false);
                    }
                });
        }
        else {
            _callback && _callback(true);
        }
    },

    shorted : false,
    createShortcut: function (_check, _callback) {
       
        if (this.isFB) {

            if (this.isIOS || this.shorted)
            {
                _callback && _callback(false);
                return;
            }
            // if (!that.hasApi("canCreateShortcutAsync")) {
            //     _callback && _callback(false);
            //     return;
            // }

            // if (!that.hasApi("createShortcutAsync")) {
            //     _callback && _callback(false);
            //     return;
            // }

            if (_check) 
            {
                FBInstant.canCreateShortcutAsync()
                    .then(function (canCreateShortcut) {
                        _callback && _callback(canCreateShortcut);
                    })
                    .catch(function (error) {
                        _callback && _callback(false);
                    });

                return;
            }

            FBInstant.canCreateShortcutAsync()
                .then( (canCreateShortcut) => 
                {
                    if (canCreateShortcut)
                    {
                        this.shorted = true;

                        FBInstant.createShortcutAsync()
                            .then(function () {
                                _callback && _callback(true);
                            })
                            .catch(function () {
                                _callback && _callback(false);
                            });
                    }
                    else _callback && _callback(false);
                })
                .catch(function (error) {
                    _callback && _callback(false);
                });
        }
        else 
        {
            _callback && _callback(false);
        }
    },

    createTTShortcut() {

    },

    pkdFriends : null,
    completeFriends: null,
    setConnectPlayer() {

        if (this.completeFriends) return;

        if (this.isFB) {

            this.hasApi("player.getConnectedPlayersAsync");
            this.hasApi("FBInstant.context.getPlayersAsync");

            this.pkdFriends = [];
            this.completeFriends = [];

            FBInstant.player.getConnectedPlayersAsync()
                // FBInstant.context.getPlayersAsync()
                .then((players) => {

                    console.log(players);

                    if (players && players.length != 0)
                    {
                        players.forEach((player) => {

                            this.addToCompleteFriend(player.getID(), player.getName(), player.getPhoto());
                        });
                    }
                    
                });
            
            let _cID = this.getContextID();
            if (this.isEmpty(_cID)) return;

            FBInstant.context.getPlayersAsync()
                .then((players) => {

                    console.log(players);

                    if (players && players.length != 0)
                    {
                        players.forEach((player) => {

                            this.addToCompleteFriend(player.getID(), player.getName(), player.getPhoto());
                        });
                    }
                    
                });
        }
    },

    addToCompleteFriend(id, name, photo) {

        if (this.completeFriends) {

            let _find = this.completeFriends.find(element => element.id == id);

            if (!_find) {

                let f = {
                    id: id,
                    name: name,
                    photo: photo,
                }
                this.pkdFriends.push(f)
                this.completeFriends.push(f)
            }
        }
            console.log(this.completeFriends);
    },

    getNextFriend()
    { 
        if (!this.pkdFriends) return null;
        if (this.pkdFriends.length == 0)
        {
            if (this.completeFriends.length != 0)
            {
                this.pkdFriends = this.completeFriends.concat();    
            }
        }
        if (this.pkdFriends.length == 0) return null;
        
        let arg = this.pkdFriends.pop();
        return arg;
    },
    
    getRealPlayerBlock(_id) {
        let _find = null;
        if (this.completeFriends) _find = this.completeFriends.find(element => element.id == _id);
        return _find;
    },

    updateType:
    {
        update: 1, share: 5
    },

    updateToPlatform: function (texPath, updateAT, data,_l_callback, _callback) {

        if (this.isFB) {
            
            
            cc.resources.load(texPath, cc.Texture2D, (err, canvasTex) => {
                
                _l_callback && _l_callback(err);

                this.realUpdateToPlatform(canvasTex, updateAT, data, _callback);
            })
        }
        else {
            _l_callback && _l_callback(false);
            _callback && _callback(null);
        }
    },

    realUpdateToPlatform: function (canvasTex, updateAT, data, _callback) {


        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 345;

        let image = null;

        if (canvasTex) {
            image = canvasTex.getHtmlElementObj();
            if (this.couldDrawImage(image)) ctx.drawImage(image, 0, 0, 600, 345);
        }
        else {
            // console.log(" canvasTex is wrong in : " + updateAT);
        }

        let shareBattle64 = canvas.toDataURL('image/png');

        if (updateAT === this.updateType.update) {
            FBInstant.updateAsync(
                {
                    action: 'CUSTOM',
                    cta: 'Play',
                    image: shareBattle64,
                    text: this.getUpdateString(data.score),
                    template: 'WORD_PLAYED',
                    data: { type: "update", score: data.score, id: this.playerID },
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH',
                })
                .then(function () {
                    _callback && _callback(null);
                })
                .catch(function (result) {
                    _callback && _callback(null);
                });;
        }
        else {
            let _text = this.getShareString(data.score);
            let _data = { enterTip: '0', type: "", score: data.score, id: this.playerID };

            if (updateAT === this.updateType.share)
                _data = { enterTip: '0', type: "share", score: data.score, id: this.playerID };

            
            try
            {
                FBInstant.shareAsync(
                    {
                        // intent: 'REQUEST',
                        image: shareBattle64,
                        text: _text,
                        data: _data,
                        // image: shareBattle64,
                        // text: _text,
                        // data: _data,
                        // shareDestination: ['NEWSFEED', 'GROUP', 'COPY_LINK', 'MESSENGER'],
                        // switchContext : false,
                    })
                    .then(function () {
                        _callback && _callback(null);
                    })
                    .catch(function (result) {
                        _callback && _callback(result);
                    });
                
            }
            catch (e)
            {
                _callback && _callback(null);
            }
        }
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
        
        let contextID = this.getContextID();
        if (this.isEmpty(contextID)) return;

        if (window.isFB) {
            if (!this.hasApi("getLeaderboardAsync")) return;

            FBInstant.getLeaderboardAsync(title + '.' + contextID)//
                .then((leaderboard) => {
                    console.log(leaderboard.getName())
                    return leaderboard.setScoreAsync(score);
                })
                .then((entry) => {
                    console.log("success set rank : ", entry.getScore());
                })
                .catch(error => {
                    console.log("fail set rank : ");
                    console.log(error);
                });
        }
    },


    ADState:
    {
        NotLoad: 0, LoadSuccess: 1, LoadFail: 2, Loading: 3,
    },

    isFullMaxDelta() {
        
        let _time = this.currentTime();
        return _time - this.lastFullTime > 100;
     },

    initFullADBefore(_initFull) {
        if (_initFull && this.isFullAdCouldInitAgain()) {
            this.initFullAD();
        }
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
        let that = this;
        if (window.isFB) {

            if (that.fullState != that.ADState.LoadSuccess &&
                that.fullState != that.ADState.Loading) {

                that.fullState = that.ADState.Loading;

                that.fullLoadTime = that.currentTime();

                FBInstant.getInterstitialAdAsync(that.convertAD(that.ADEncryType.Full))
                    .then(function (interstitial) {
                        that.fullState = that.ADState.Loading;
                        that.fullAD = interstitial;
                        return that.fullAD.loadAsync();
                    })
                    .then(function () {
                        that.fullFailInitCnt = 0;
                        console.log("load full success");

                        that.fullState = that.ADState.LoadSuccess;

                        that.loadFullFinishCallBack && that.loadFullFinishCallBack();
                        that.setFullADLoadCallBack(null);
                    })
                    .catch(function (err) {

                        that.fullFailInitCnt++;
                        console.log("load full fail : ", err);

                        that.fullState = that.ADState.LoadFail;

                        that.loadFullFinishCallBack && that.loadFullFinishCallBack();
                        that.setFullADLoadCallBack(null);
                    });
            }
        }
        else {
            that.fullState = that.ADState.LoadSuccess;
        }
    },

    lastFullTime: -10,
    displayFullAD(_interval,_callback) {
        let that = this;

        let seconds = that.currentTime();

        if (window.isFB) {

            // if (that.selfCloseVideo) {
            //     that.selfCloseVideo = false;
            //     if (_callback) _callback();
            //     return;
            // }

            if (_interval <= 0) _interval = 60;

            if (that.fullState == that.ADState.LoadSuccess && seconds - that.lastFullTime > _interval) {

                that.lastFullTime = seconds;

                that.fullState = that.ADState.NotLoad;

                that.fullAD.showAsync()
                    .then(function () {
                        console.log('success display full ad');
                        if (_callback) _callback();
                        // that.initFullAD();
                    })
                    .catch(function (e) {
                        console.error("fail display full ad");
                        if (_callback) _callback();
                        // that.initFullAD();
                    });
            }
            else {
                if (_callback) _callback();
            }
        }
        else {
            that.fullState = that.ADState.NotLoad;
            
            if (_callback) _callback();
        }
    },

    initVideoADBefore(_initVideo) {
        
        if (_initVideo && this.isVideoCouldInitAgain()) {
            this.initVideoAD();
        }
    },
    
    loadVideoFinishCallBack : null,
    setVideoADLoadCallBack(callback) { 
        this.loadVideoFinishCallBack = callback;
    },

    selfCloseVideo: false,
    videoLoadTime: 0,
    videoFailInitCnt: 0,
    videoState: 0,
    videoAD: null,
    initVideoAD: function () {
        
        let that = this;
        if (window.isFB) {

            if (that.videoState != that.ADState.LoadSuccess &&
                that.videoState != that.ADState.Loading) {

                that.videoState = that.ADState.Loading;
                that.videoLoadTime = that.currentTime();

                FBInstant.getRewardedVideoAsync(that.convertAD(that.ADEncryType.Video))
                    .then(function (rewarded) {
                        that.videoState = that.ADState.Loading;
                        that.videoAD = rewarded;
                        return that.videoAD.loadAsync();
                    })
                    .then(function () {
                        that.videoState = that.ADState.LoadSuccess;
                        that.videoFailInitCnt = 0;
                        
                        that.loadVideoFinishCallBack && that.loadVideoFinishCallBack();
                        that.setVideoADLoadCallBack(null);
                    })
                    .catch(function (err) {
                        that.videoFailInitCnt++;
                        that.videoState = that.ADState.LoadFail;
                        
                        that.loadVideoFinishCallBack && that.loadVideoFinishCallBack();
                        that.setVideoADLoadCallBack(null);
                    });
            }
        }
        else {
            
            that.videoState = that.ADState.Loading;
            
            // that.videoState = that.ADState.LoadSuccess;

            setTimeout(() => { 
                that.videoState = that.ADState.LoadSuccess;
                
                that.loadVideoFinishCallBack && that.loadVideoFinishCallBack();                
                    
                that.setVideoADLoadCallBack(null);
            
            },5000)
        }
    },

    displayVideoAD(_callback) {
      
        if (this.isFB) {
            if (this.videoState == this.ADState.LoadSuccess) {
                
                this.videoState = this.ADState.NotLoad;
                
                this.lastFullTime = this.currentTime();

                this.videoAD.showAsync()
                    .then( () => {
                        if (_callback) _callback(true,null);
                    })
                    .catch( (e) => {

                        if (_callback) _callback(false,e);

                        this.selfCloseVideo = true;
                        
                        if (e && e.code && e.code == "PENDING_REQUEST") this.selfCloseVideo = false;
                    });
            }
            else if (_callback) _callback(false,null);
        }
        else { 
            
            this.videoState = this.ADState.NotLoad;
            
            
            if (_callback) _callback(true,null);

        } 
    },

    isVideoADLoad() {
        if (window.isFB) {
            let ret = this.videoState == this.ADState.LoadSuccess;
            return ret;
        }
        else return this.videoState == this.ADState.LoadSuccess;
    },

    isVideoADLoading() {
        if (window.isFB) return this.videoState == this.ADState.Loading;
        else return this.videoState == this.ADState.Loading;
     },

    isFullADLoad() {
        if (window.isFB) return this.fullState == this.ADState.LoadSuccess;
        else return true;
    },

    isFullADLoading() {
        if (window.isFB) return this.fullState == this.ADState.Loading;
        else return false;
     },

    adBaseLoadDeltas: [0, 60, 120, 210, 600, 1000],
    adLoadDeltas :    [30, 60, 90, 120, 240, 240],
    isVideoCouldInitAgain() {
        
        if (this.videoState == this.ADState.LoadFail ||
            this.videoState == this.ADState.NotLoad) {

            let _arg = parseInt(this.videoFailInitCnt / 3);
            let _arg2 = parseInt(this.videoFailInitCnt % 3);
            if (_arg >= this.adBaseLoadDeltas.length) _arg = this.adBaseLoadDeltas.length - 1;

            let _baseDeltaTime = this.adBaseLoadDeltas[_arg];
            let _deltaTime = this.adLoadDeltas[_arg];

            let _time = this.currentTime();
            let _isTimeReady = (_time - this.videoLoadTime) > (_baseDeltaTime + _arg2 * _deltaTime);
            return _isTimeReady;
        }
        else { 
            return false;
            
        } 
    },

    isFullAdCouldInitAgain() {
        if (this.fullState == this.ADState.LoadFail ||
            this.fullState == this.ADState.NotLoad) {

            let _arg = parseInt(this.fullFailInitCnt / 3);
            let _arg2 = parseInt(this.fullFailInitCnt % 3);
            if (_arg >= this.adBaseLoadDeltas.length) _arg = this.adBaseLoadDeltas.length - 1;

            let _baseDeltaTime = this.adBaseLoadDeltas[_arg];
            let _deltaTime = this.adLoadDeltas[_arg];

            let _time = this.currentTime();
            let _isTimeReady = (_time - this.fullLoadTime) > (_baseDeltaTime + _arg2 * _deltaTime);
            return _isTimeReady;//this.fullFailInitCnt < 5 && 
        }
        else return false;
    },

    bannerAd: null,
    bannerState: 0,
    lastBannerTime: -10,
    bannerFailInitCnt: 0,
    displayBanner(_callback) {

        let that = this;

        if (window.isFB) {

            // if (!this.hasApi("loadBannerAdAsync")) {
            //     if (_callback) _callback(false);
            //     return;
            // }

            if (this.bannerState == this.ADState.LoadSuccess)
            {
                let dt = this.currentTime() - this.lastBannerTime;
                if (dt > 300)
                {
                    // this.bannerState = this.ADState.NotLoad;
                }
                
            }

            if (this.bannerState != this.ADState.Loading &&
                this.bannerState != this.ADState.LoadSuccess) {

                if (!this.isBannerAdLoadByInterval()) {
                    if (_callback) _callback(false);
                    return;
                }

                this.lastBannerTime = this.currentTime();
                this.bannerState = this.ADState.Loading;

                
                let t = setTimeout(() => {

                    if (this.bannerState == this.ADState.Loading)
                    {
                        this.bannerState = this.ADState.LoadFail;
                        t = null;

                        _callback && _callback(false);
                    }

                }, 10000)
                
                try {
                    FBInstant.loadBannerAdAsync(this.convertAD(this.ADEncryType.Banner))
                        .then(() => {


                            if (this.bannerState == this.ADState.NotLoad) {
                                this.hideBanner();
                            }
                            else this.bannerState = this.ADState.LoadSuccess;
                        
                            t && clearTimeout(t);

                            _callback && _callback(this.bannerState == this.ADState.LoadSuccess);
                            this.bannerFailInitCnt = 0;
                        })
                        .catch((err) => {


                            if (this.bannerState == this.ADState.NotLoad) {
                                this.hideBanner();
                            }
                            else this.bannerState = this.ADState.LoadFail;

                            t && clearTimeout(t);

                            _callback && _callback(false);

                            this.bannerFailInitCnt++;
                        })
                }
                catch (e)
                {
                    t && clearTimeout(t);
                    
                    _callback && _callback(false);
                    
                    this.bannerState = this.ADState.LoadFail;
                    
                }
            }
        }
        else _callback && _callback(false);
    },

    hideBanner() {

        if (window.isFB) {
            // if (this.hasApi("hideBannerAdAsync"))
            {
                FBInstant.hideBannerAdAsync()
                    .then(() =>
                    {
                    })
                    .catch((err) =>
                    {
                    });
            }
            this.bannerState = this.ADState.NotLoad;
        }
    },

    isBannerAdLoadByInterval() {
        let seconds = this.currentTime();
        let maxInterval = this.bannerFailInitCnt * 20;
        if (maxInterval > 120) maxInterval = 120;

        return seconds - this.lastBannerTime > maxInterval;
    },

    isBannerADLoad() {
        if (window.isFB) return this.bannerState == this.ADState.LoadSuccess;
        else return true;
    },

    adPrefixIndex: 1,
    adPrefixs: ["VID_HD_16_9_15S_APP_INSTALL#", "CAROUSEL_IMG_SQUARE_APP_INSTALL#", "PLAYABLE#"],
    ADEncryType: { Video: 0, Full: 1, Banner: 2 },

    // ve: 'DACCBIDDFHDEEDE_PMOOOPRRRTPPVNO',
    // fe: 'DACCBIDDFHDEEDE_PMOOOPQSVMSTORQ',
    // be: 'DACCBIDDFHDEEDE_PMOOOPQMRTPPVOT',
    adIDArray: 
        [
            '891189492878640_891191129545143',//video
            '891189492878640_891190996211823',//full
            '891189492878640_891190909545165',//banner
        ],
    convertAD: function (_type) {
        
        let ads = this.adIDArray;
        return ads[_type];
    },

    // adConvert(str) {
    //     let arr = str.split('_');
    //     let chars = "";
    //     for (let i = 0; i < arr[0].length; i++) {
    //         chars += String.fromCharCode(parseInt(arr[0][i]) + 65)
    //     }

    //     chars += "_";
    //     for (let i = 0; i < arr[1].length; i++) {
    //         chars += String.fromCharCode(parseInt(arr[1][i]) + 65 + 12)
    //     }
    //     console.log(chars);
    // },

    isInTournament : false,
    getCurrentTournament(_callback)
    {
        if (!this.isFB)
        {
            _callback && _callback(null);
            return;
        }
        FBInstant.getTournamentAsync()
            .then((tournament) => {
        
                // console.log("get current tournament : ",tournament);
                // console.log(tournament.getID());
                // console.log(tournament.getContextID());
                // console.log(tournament.getEndTime());
                _callback && _callback(tournament);
            })
            .catch(error =>
            {
                console.log("get current tournament error : ",error);
                _callback && _callback(null);
            });
    },

    getTournamentList(_callback)
    {
        if (!this.isFB)
        {
            _callback && _callback([]);
            return;
        }

        FBInstant.tournament.getTournamentsAsync()
            .then(tournaments => {
                console.log("tournament array : ",tournaments);
                _callback && _callback(tournaments);
            });
    },

    /** 创建tournament挑战赛 */
    createTournament(score,_callback) {

        if (!this.isFB)
        {
            _callback && _callback(true);
            return;
        }
        

        let currentName = this.playerName;
        let tInfo = {
            initialScore: score,
            config:
            {
                tournamentTitle: currentName + " Super Cup Tournament"
            },
            data:
            {
                //game_level: 1,
                id:this.playerID,
                //type:"Tournament",
                entry_source: "tournament",
                // entry_source_id: this.contextID(),
            },
        }

        // console.log(tInfo);

        FBInstant.tournament.createAsync(tInfo)
            .then((tournament) =>
            {
                // console.log("createTournament success : ",tournament);
                _callback && _callback(true);
            })
            .catch((error) =>
            {
                // console.log("createTournament fail : ", error);
                _callback && _callback(false);
            })
    },
    
    logEvent(_eventID)
        { 
            if (!this.isFB) return;
    
            FBInstant.logEvent(_eventID);
    },
    

    postSessionScore(_score) {
        if (window.isFB) {
            // console.log("postSession : ", _score);
            try {
                FBInstant.postSessionScoreAsync(_score);
            }
            catch (e) { }
        }

        // this.tournamentPostSessionScore(_score);
    },

    tournamentPostSessionScore(_score)
    {
        if (window.isFB )
        {

            // FBInstant.getTournamentAsync()
            // .then(function(tournament) {
            //    console.log("tournament : " + tournament.getContextID());
            //    console.log("tournament : " + tournament.getEndTime());
            //    console.log("tournament : " + tournament.getTitle());
            //    console.log("tournament : " + tournament.getPayload());
            // })
            // .catch(error =>
            //     {
            //         console.log("tournament fail : " + JSON.stringify(error));
            //     }
            // );

            try
            {
                FBInstant.tournament.postScoreAsync(_score)
                .then(
                    response => {
                        console.log("FBInstant.tournament: " + _score);
                })
                .catch(error =>
                    {
                        console.log("FBInstant.tournament fail : " + JSON.stringify(error));
                    }
                );
            }
            catch(err)
            {

            }
        }
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
        // let locale = FBInstant.getLocale();
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
