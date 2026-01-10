const AudioHelper = require("./AudioHelper");
const { MISSION_TYPE } = require("./EnumHelper");
const GameParamsHelper = require("./GameParamsHelper");
const HintHelper = require("./HintHelper");
const ItemMgr = require("./ItemMgr");
const MissionMgr = require("./MissionMgr");
const PlatformTool = require("./PlatformTool");
const StorageHelper = require("./StorageHelper");
const TimerHelper = require("./TimerHelper");
const UIHelper = require("./UIHelper");

module.exports = {

    minAdLevel: 3,

    /** 自动创建桌面快捷方式 */
    autoShortcutInCommon(_autoCreate, _checkCallback, _createCallback) {
        console.log("autoShortcutInCommon")
        PlatformTool.createShortcut(true, (_bool) => {
            _checkCallback && _checkCallback(_bool);

            if (_bool && _autoCreate) {
                let timeStr = TimerHelper.currentTimeStr();
                if (StorageHelper.getItem(StorageHelper.STORAGE_PROPERTY.SHORTCUT_TIME) != timeStr) {
                    AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

                    PlatformTool.createShortcut(false, (_bool) => {
                        StorageHelper.saveItem(StorageHelper.STORAGE_PROPERTY.SHORTCUT_TIME, timeStr);
                        _createCallback && _createCallback(_bool);
                    });
                }
                // else _createCallback && _createCallback(false);
            }
        });
    },

    displayBannerInCommon() {

        // return;
        // if (GameParamsHelper.gameDuration > 300)
        // {
        //     GameParamsHelper.gameDuration = 0;
        //     PlatformTool.hideBanner();
        // }

        setTimeout(() => {

            PlatformTool.displayBanner((state) => {

                if (PlatformTool.isIOS) return;

                // if (!state) {
                //     if (cc.isValid(window.selfBanner)) window.selfBanner.setBannerState(true);
                //     else CocosLoader.loadAssetRes("prefab/banner", cc.Prefab, this.node, true, null, 0);
                // }
                // else { 
                //     if (cc.isValid(window.selfBanner)) window.selfBanner.setBannerState(false);
                // }

            });
        }, 1000);

    },

    displayFullInCommon(wait, _interval, callback) {

        console.log(_interval);

        let displayCall = () => {

            if (ItemMgr.getLevel() >= this.minAdLevel) {
                AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);

                PlatformTool.displayFullAD(_interval, () => {

                    callback && callback();
                })
            }
            else callback && callback();
        }


        if (PlatformTool.isFullADLoading() && wait) {

            UIHelper.displayMask(true);


            let t = setTimeout(() => {

                UIHelper.displayMask(false);

                PlatformTool.setFullADLoadCallBack(null);

                displayCall();

            }, 5000)

            PlatformTool.setFullADLoadCallBack(() => {

                UIHelper.displayMask(false);
                clearTimeout(t);
                displayCall();
            });

        }
        else displayCall();
    },


    displayVideoInCommon(initBefore, callback) {

        let displayCall = () => {


            if (PlatformTool.isVideoADLoad()) {

                AudioHelper.playAudio(AudioHelper.AUDIO_NAME.MUTE);


                PlatformTool.displayVideoAD((state, _result) => {

                    if (state) MissionMgr.addMission(MISSION_TYPE.AD, 1, true);

                    callback && callback(state);
                    if (_result && _result.code && _result.code == "PENDING_REQUEST") {
                        HintHelper.displayHint("display video fail.because Pending Request");
                    }
                })
            }
            else {
                HintHelper.displayHint(GameParamsHelper.adNotReadyTip);
                callback && callback(false);

            }
        }

        PlatformTool.initVideoADBefore(initBefore);

        if (PlatformTool.isVideoADLoading()) {

            UIHelper.displayMask(true);

            let t = setTimeout(() => {

                UIHelper.displayMask(false);

                PlatformTool.setVideoADLoadCallBack(null);

                displayCall();

            }, 5000)

            PlatformTool.setVideoADLoadCallBack(() => {

                UIHelper.displayMask(false);
                clearTimeout(t);
                displayCall();
            });

        }
        else displayCall();
    },
}