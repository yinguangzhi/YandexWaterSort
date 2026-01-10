/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-21 15:55:40
 * @FilePath: \WaterSort\assets\script\HintHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const AudioHelper = require("./AudioHelper");
const CocosHelper = require("./CocosHelper");
const CocosLoader = require("./CocosLoader");
const PathHelper = require("./PathHelper");
const UIHelper = require("./UIHelper");

module.exports = 
{
    hintMap : {},
    
    comboPosition: cc.v2(0, 256),

    loadAssetRes(url,_name,_callback)
    { 
        console.log("load hint url ",url);
        let canvas = UIHelper.getPermanentsParent();
        CocosLoader.loadAssetResAsync(url, cc.Prefab,true, canvas, null, 0)
            .then((obj) =>
            {
                let _o_obj = this.hintMap[_name];
                if (!_o_obj || !cc.isValid(_o_obj))
                {  
                    this.hintMap[_name] = obj;
                    _callback(obj);
                }
                else
                {
                    obj.destroy();
                }
            })
    },
    
    getAsset(_name)
    { 
        let hint = this.hintMap[_name];
        return hint;
    },

    displayHint(desc)
    {
        let _call = (_hint) =>
        {
            _hint.stopAllActions();

            let _num = _hint.parent.childrenCount;
            _hint.setSiblingIndex(_num);

            _hint.children[1].getComponent(cc.Label).string = desc;

            _hint.scale = 0;
            _hint.opacity = 255;

            cc.tween(_hint)
                .to(0.2, { scale: 1.12 })
                .to(0.06, { scale: 1 })
                .delay(0.8)
                .to(0.2,{opacity : 0})
                .start();
        }

        let _name = "UIHint";
        let hint = this.getAsset(_name);
        if (hint && cc.isValid(hint)) {
            _call(hint);
        }
        else
        {
            this.loadAssetRes(PathHelper.getPrefabPath(_name),_name, (obj) =>
            {
                _call(obj);
            })
        }
    },
}
    
