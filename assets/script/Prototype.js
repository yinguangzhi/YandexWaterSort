//Prototype

const { log } = require("console");

// Array.prototype.getPos = function (value)
// {
//     for (let i = 0; i < this.length; i++)
//     {
//         if (this[i] === value)
//         {
//             return i;
//         }
//     }
//     return -1;
// };

Array.prototype.contains = function (value)
{
    for (let i = 0; i < this.length; i++)
    {
        if (this[i] === value)
        {
            return true;
        }
    }
    return false;
};

// Array.prototype.getObjectPos = function (key, value)
// {
//     for (let i = 0; i < this.length; i++)
//     {
//         if (this[i] && this[i][key])
//         {
//             if (this[i][key] === value)
//             {
//                 return i;
//             }
//         }
//     }
//     return -1;
// };

// Array.prototype.getObjectValue = function (key, value)
// {
//     for (let i = 0; i < this.length; i++)
//     {
//         if (this[i] && this[i][key])
//         {
//             if (this[i][key] === value)
//             {
//                 return this[i];
//             }
//         }
//     }
//     return null;
// };

// Array.prototype.getObjectContains = function (key, value)
// {
//     for (let i = 0; i < this.length; i++)
//     {
//         if (this[i] && this[i][key])
//         {
//             if (this[i][key] === value)
//             {
//                 return true;
//             }
//         }
//     }
//     return false;
// };

Array.prototype.clear = function ()
{
    this.length = 0;
};

/**
 * 集合取交集 [1,2,3].intersect([2,3]) = [2,3]
 * @returns {[]}
 */
Array.intersect = function ()
{

    let result = [];
    let obj = {};
    for (let i = 0; i < arguments.length; i++)
    {
        for (let j = 0; j < arguments[i].length; j++)
        {
            let str = arguments[i][j];
            if (!obj[str])
            {
                obj[str] = 1;
            }
            else
            {
                obj[str]++;
                if (obj[str] === arguments.length)
                {
                    result.push(str);
                }
            }
        }
    }
    return result;
};

Array.union = function ()
{
    //并集 [1,2,3].union([2,3,4]) = [1,2,3,4]
    let arr = [];
    let obj = {};
    for (let i = 0; i < arguments.length; i++)
    {
        for (let j = 0; j < arguments[i].length; j++)
        {
            let str = arguments[i][j];
            if (!obj[str])
            {
                obj[str] = 1;
                arr.push(str);
            }
        }
    }
    return arr;
};

Array.prototype.unique = function ()
{
    //集合去掉重复 [1,2,3,2,1].unique = [1,2,3]
    let tmp = {},
        ret = [];
    for (let i = 0, j = this.length; i < j; i++)
    {
        if (!tmp[this[i]])
        {
            tmp[this[i]] = 1;
            ret.push(this[i]);
        }
    }

    return ret;
};

Array.prototype.minus = function (arr)
{
    //2个集合的差集 在arr不存在 [1,2,3].minus([2,3,4]) = [1]
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++)
    {
        obj[arr[i]] = 1;
    }
    for (let j = 0; j < this.length; j++)
    {
        if (!obj[this[j]])
        {
            obj[this[j]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};

Array.prototype.equals = function (arr)
{
    if (this.length !== arr.length)
    {
        return false;
    }
    return this.sort().toString() === arr.sort().toString()
};

String.prototype.append = function (str)
{
    return String(this) + str;
};

String.prototype.trim = function ()
{
    return String(this).replace(/^\s+|\s+$/g, '');
};

String.prototype.empty = function ()
{
    return !(this && this.length > 0);
};

// String.prototype.replaceAll = function (FindText, RepText)
// {
//     let regExp = new RegExp(FindText, "g");
//     return this.replace(regExp, RepText);
// };
//
// String.prototype.endWith = function (str)
// {
//     if (str == null || str === "" || this.length === 0 || str.length > this.length)
//         return false;
//     return this.substring(this.length - str.length) === str;
// };
//
// String.prototype.startWith = function (str)
// {
//     if (str == null || str === "" || this.length === 0 || str.length > this.length)
//         return false;
//     return this.substr(0, str.length) === str;
// };

if (typeof (String.prototype.trim) === "undefined")
{

}

cc.Node.prototype.data = {};

// cc.Node.prototype.enable = true;

/*cc.Node.prototype.setVisible = function (visible) {
    this.active = visible;
};

cc.Node.prototype.visible = function (visible) {
    this.active = visible;
};

cc.Node.prototype.setScaleX = function (scale) {
    this.scaleX = scale;
};

cc.Node.prototype.setScaleY = function (scale) {
    this.scaleY = scale;
};

cc.Node.prototype.setOpacity = function (num) {
    this.opacity = num;
};

cc.Node.prototype.setRotation = function (rotation) {
    this.rotation = rotation
};

cc.Node.prototype.setColor = function (color) {
    this.color = color
};

cc.Node.prototype.setName = function (name) {
    this.name = name
};*/

// cc.Node.prototype.isVisible = function ()
// {
//     return this.active;
// };

// cc.Node.prototype.getParent = function ()
// {
//     return this.parent;
// };

// cc.Node.prototype.setEnabled = function (enable)
// {
//     if (enable)
//     {
//         this.resumeSystemEvents(true);
//         //this.enable = true;
//     }
//     else
//     {
//         this.pauseSystemEvents(true);
//         //this.enable = false;
//     }
// };

// cc.Node.prototype.setSpriteFrameUrl = function (url)
// {
//     let sprite = this.getComponent(cc.Sprite);
//     if (sprite && url.startWith('http'))
//     {
//         let load = this.getChildByName("load");
//         if(load)
//         {
//             load.active = true;
//             let action = cc.rotateBy(2, 360);
//             load.runAction(action.repeatForever());
//         }
//         cc.loader.load(url, function (err, tex)
//         {
//             if(load)
//             {
//                 load.stopAllActions();
//                 load.active = false;
//             }
//             if (err) {
//                 cc.error('setSpriteFrameUrl' + JSON.stringify(err));
//                 return;
//             }
//             if (tex) {
//                 sprite.spriteFrame = new cc.SpriteFrame(tex);
//             }
//         });
//     }
// };

// cc.Node.prototype.setSpriteFrameRes = function (url)
// {
//     let sprite = this.getComponent(cc.Sprite);
//     if (sprite)
//     {
//         let load = this.getChildByName("load");
//         if(load)
//         {
//             load.active = true;
//             let action = cc.rotateBy(2, 360);
//             load.runAction(action.repeatForever());
//         }
//         cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame)
//         {
//             if(load)
//             {
//                 load.stopAllActions();
//                 load.active = false;
//             }
//             if (err) {
//                 cc.error('setSpriteFrameRes' + err);
//                 return;
//             }
//             if (spriteFrame) {
//                 sprite.spriteFrame = spriteFrame;
//             }
//         });
//     }
// };

cc.Node.prototype.setSpriteFrameValue = function (value)
{
    let sprite = this.getComponent(cc.Sprite);
    let flag = typeof (value) === "string";
    if (sprite && value)
    {
        if (value instanceof cc.SpriteFrame)
        {
            sprite.spriteFrame = value;
        }
        else if (value instanceof cc.Texture2D)
        {
            sprite.spriteFrame = new cc.SpriteFrame(value);
        }
        // else if (typeof (value) === "string" && value.startWith('http'))
        // {
        //     this.setSpriteFrameUrl(value);
        // }
        // else if (typeof (value) === "string" && value.startWith("img"))
        // {
        //     this.setSpriteFrameRes(value);
        // }
    }
};

cc.Node.prototype.setSpriteFrame = function (value)
{
    this.setSpriteFrameValue(value);
};

cc.Node.prototype.setString = function (str)
{
    let label = this.getComponent(cc.Label);
    if (label)  label.string = str + '';
};

cc.Node.prototype.getString = function ()
{
    let label = this.getComponent(cc.Label);
    if (label) return label.string;
};

cc.Node.prototype.playAnim = function (name)
{
    if (this)
    {
        let anim = this.getComponent(cc.Animation);
        if (anim) anim.play(name);
    }
};

cc.Node.prototype.stopAnim = function (name)
{
    if (this)
    {
        let anim = this.getComponent(cc.Animation);
        if (anim) anim.stop(name);
    }
};

// cc.Node.prototype.playAnimation = function (name)
// {
//     if (this)
//     {
//         let anim = this.getComponent(cc.Animation);
//         if (anim) anim.play(name);
//     }
// };

// cc.Node.prototype.onClick = function (callback) {
//     let that = this;
//     let self = {};
//     self.initScale = this.scale;
//     self.scaleDownAction = cc.scaleTo(0.05, 1.1 * self.initScale);
//     self.scaleUpAction = cc.scaleTo(0.05, self.initScale);
//
//     function onTouchDown(event) {
//         this.stopAllActions();
//         this.runAction(self.scaleDownAction);
//     }
//
//     function onTouchUp(event) {
//         this.stopAllActions();
//         this.runAction(self.scaleUpAction);
//         that.playAudio();
//         callback();
//     }
//
//     function onTouchCancel(event) {
//         this.stopAllActions();
//         this.runAction(self.scaleUpAction);
//     }
//
//     this.on('touchstart', onTouchDown, this);
//     this.on('touchend', onTouchUp, this);
//     this.on('touchcancel', onTouchCancel, this);
// };

// cc.Node.clickDelay = function (callback, delay) {
//     this.onClick(callback);
//     this.pauseSystemEvents(true);
//     let that = this;
//     this.scheduleOnce(function () {
//         that.resumeSystemEvents(true);
//     }, delay)
//
// };

// cc.Node.prototype.onClickColor = function (callback)
// {
//     let that = this;
//
//     function onTouchDown(event) {
//         //this.color = cc.Color.GRAY;
//         this.opacity = 220;
//     }
//
//     function onTouchUp(event) {
//         //this.color = cc.Color.WHITE;
//         this.opacity = 255;
//         that.playAudio();
//         callback();
//     }
//
//     function onTouchCancel(event) {
//         //this.color = cc.Color.WHITE;
//         this.opacity = 255;
//     }
//
//     this.on('touchstart', onTouchDown, this);
//     this.on('touchend', onTouchUp, this);
//     this.on('touchcancel', onTouchCancel, this);
// };


// cc.Label.prototype.setString = function (content)
// {
//     this.string = content;
// };



