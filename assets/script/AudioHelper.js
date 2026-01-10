/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-19 21:27:09
 * @FilePath: \WaterSort\assets\script\AudioHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { log } = require("console");
const DebugTool = require("./DebugTool");

var MusicStatus = cc.Enum({
    None: 1,
    Playing: 2,
    Pause: 3,
});

module.exports =
{
    AUDIO_NAME: 
    {
        BGM: "bgm",
        MUTE: "mute",
        CLICK: "click",
        GAME_OVER: "success",
        HIT: "hit",
        DOWN: "down",
        AGAIN: "again",
        ROTATE: "rotate",
        UNLOCK: "unlock",
        UNKNOWN: "unknown",
        COMPLETE: "pipeComplete",
        COIN: "coin",
        TURNABLE: "turnable",
    },
    
    music: null,
    noteList : null,
    audioList: [],
    
    musicStatus: MusicStatus.None,
    musicState: true,
    audioState: true,

    bomb: "bomb",
    mute: "mute",
    click: "click",
    start: "start",
    window: "window",
    star : "star2",

    audioTimes: [],
    
    setAudioState(state) {
        this.audioState = state;
    },

    setMusicState(state, _behavior) {
        this.musicState = state;
        if (_behavior) {
            if (this.musicState) this.playAudio(this.AUDIO_NAME.BGM, true, true);
            else this.pauseMusic();
        }
    },

    pauseMusic() {
        // console.log("pause : ", this.musicStatus);
        if (this.musicStatus == MusicStatus.None) return;

        this.musicStatus = MusicStatus.Pause;
        cc.audioEngine.pauseMusic();
    },
    

    playAudio(url, loop, isMusic) {

        if (!url) return;

        if (url == this.mute) {
            if (!window.isIOS) return;
        }

        let clip = this.audioList[url];

        if (cc.isValid(clip)) {

            this.realPlayAudio(clip, loop, isMusic);
            return;
        }

        let url1 = 'audio/' + url;

        cc.resources.load(url1, cc.AudioClip, (err, clip) => {
            if (err) {
                DebugTool.log("music error : " + url1)
                DebugTool.log(err);
                return;
            }

            this.audioList[url] = clip;

            this.realPlayAudio(clip, loop, isMusic);
        });
    },

    realPlayAudio(clip, loop, isMusic) {
        let volume = 1;

        if (isMusic) {
            if (!this.musicState) {
                volume = 0;
                return;
            }
        }
        else if (!this.audioState) {
            volume = 0;
            return;
        }
        
        if (isMusic)
        {
            // console.log("music : ", this.musicStatus);
            if (this.musicStatus == MusicStatus.Playing) return;

            cc.audioEngine.setMusicVolume(volume);
            if (this.musicStatus == MusicStatus.None) cc.audioEngine.playMusic(clip, true);
            else if (this.musicStatus == MusicStatus.Pause) cc.audioEngine.resumeMusic();

            this.musicStatus = MusicStatus.Playing;
        }
        else {
            // volume = 0.5;
            cc.audioEngine.play(clip, loop, volume);
        }
    },

    hasAudio(url)
    { 
        if (!url) return false;

        let url2 = 'audio/' + url;
        if (this.audioList[url2]) return true;
        else return false;
    },
    
    preLoadAudio(url) {

        if (!url) return;

        let clip = this.audioList[url];
        if (cc.isValid(clip)) return;

        url = 'audio/' + url;
        cc.resources.load(url, cc.AudioClip, (err, clip) => {
            if (err) {
                DebugTool.log("music error : " + url)
                DebugTool.log(err);
                return;
            }

            // log("success preload : " + url);
            this.audioList[url] = clip;
        });
    },

    prePlayMusic()
    {
        cc.audioEngine.playMusic(this.music, false);
        cc.audioEngine.setMusicVolume(0);
    },
}