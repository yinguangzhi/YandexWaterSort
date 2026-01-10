/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-09-14 08:42:33
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-04-08 20:25:37
 * @FilePath: \Solitaire\assets\scripts\UIBase.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-09-14 08:42:33
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2023-09-29 15:51:13
 * @FilePath: \Solitaire\assets\scripts\UIBase.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { log } = require("console");
const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const AudioHelper = require("./AudioHelper");
const SSDScript = require("./SSDScript");

cc.Class({
    extends: SSDScript,

    properties: {
        content : cc.Node,
        elements: [],
        
        isAnima: true,
        isTouchAnima: false,
        isTouchClose: false,
        
        inClosing: false,
        inLockClosing: false,
        
        couldBinder: false,
        // __data : null,
        // data: {
        //     get: function () {
        //         return this.__data;
        //     },
        //     set: function (value) {
        //         this.__data = value;
        //         if(this.__data != null)
        //         {
        //             this.setData();
        //         }
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.inClosing = false;
        this.inLockClosing = false;
        
        this.elements = {};
        if (this.couldBinder)
        {
            this.binderElements(this.node);
            console.log(this.elements);
        }

        if (this.isAnima) this.display();
        
        let touch = this.node.children[0];
        if (touch.name == "touch" && this.isTouchClose)
        {
            let moveDistance = 0;
            let startPos = cc.v2();
            let endPos = cc.v2();
            touch.on(cc.Node.EventType.TOUCH_START, (event) =>
            {
                startPos = event.touch.getLocation();
                endPos = event.touch.getLocation();
                moveDistance = 0;
            },this);

            
            touch.on(cc.Node.EventType.TOUCH_MOVE, function (event)
            {
                endPos = event.touch.getLocation();
            }, this);


            let cancel = (event) =>
            {
                
                endPos = event.touch.getLocation();
                let distance = cc.Vec2.distance(startPos,endPos);
        
                if (distance > 20) return;
                
                this.closeFromTouch();
            };

            // node.on(cc.Node.EventType.TOUCH_CANCEL, cancel,this)
            touch.on(cc.Node.EventType.TOUCH_END, cancel,this)  
        }
        
    },

    start () {

    },

    // update (dt) {},

    binderElements(note,path)
    {
        if (!path) path = ""; 
        
        let _children = note.children;
        if (_children.length == 0) return;
        
        for (let i = 0; i < _children.length; i++)
        {
            let arg = _children[i];
            let _secondPath = path + arg.name;

            if (this.elements[_secondPath])
            {
                console.log("element is same name : ", _secondPath);
                
                let _sib = i;
                _secondPath += "(ssd_clone_" + _sib + ")";
            }
            
            this.elements[_secondPath] = arg;

            this.binderElements(arg, _secondPath + "/");
        }
        
    },

    setData()
    { 
        
    },
    
    /**
     * @description 播放界面展示动画
     */
    display()
    {
        if (this.isTouchAnima)
        {
            let touch = this.node.children[0];
            if (touch && touch.name == "touch")
            {
                touch.stopAllActions();

                touch.opacity = 0;
                cc.tween(touch).to(0.2,{ opacity: 200 }).start();
            }
        }

        if (this.content)
        {
            this.lockClose(0.3);
            
            this.content.scale = 0;
            cc.tween(this.content)
                .to(0.2, { scale: 1.2 })
                .to(0.08, { scale: 1 })
                .start();
            
            
        }
        
    },
    
    /**
     * @description 冻结关闭行为
     * @param {*} _time 
     */
    lockClose(_time)
    {
        this.inLockClosing = true;
        if (_time >= 0) 
        {
            this.scheduleOnce(() =>
            {
                this.reLockClose();
            },_time)    
        }
    },

    /**
     * @description 恢复关闭行为
     * @param {*} _time 
     */
    reLockClose()
    {
        this.inLockClosing = false;
    },

    close()
    {
        AudioHelper.playAudio(AudioHelper.AUDIO_NAME.CLICK);
        // if (!Observer.fireInterval("click", 500)) return;
        
        if (this.inLockClosing) return;

        this.close2();
    },

    /**
     * @description 点击背景关闭界面
     */
    closeFromTouch()
    {
        // if (!Observer.fireInterval("click", 500)) return;
        
        this.close2();
    },

    close2()
    {
        if (this.inLockClosing) return;
        if (this.inClosing) return;

        this.inClosing = true;
        
        if (this.isTouchAnima)
        {
            let touch = this.node.children[0];
            if (touch && touch.name == "touch")
            {
                touch.stopAllActions();

                cc.tween(touch).to(0.2,{ opacity: 0 }).start();
            }
        }

        
        // if (this.isAnima && this.content)
        // {
        //     this.content.stopAllActions();
        
        //     cc.tween(this.content)
        //         .to(0.2, { scale: 1.25,opacity : 40 })
        //         .call(() =>
        //         {
        //             this.inClosing = false;
        //             UIHelper.hideUI(this.node.name);

        //             this.endCall && this.endCall();
        //         })
        //         .start();
        // }
        // else
        {
            this.inClosing = false;
            UIHelper.hideUI(this.node.name);

            this.endCall && this.endCall();
        }
        
        
    },

    /**
     * @description 界面是否有用或是可操作
     * @returns 
     */
    isUIValid()
    {
        return !this.inClosing;
    }
});
