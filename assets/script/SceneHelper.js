/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-14 10:01:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-04-08 22:14:58
 * @FilePath: \WaterSort\assets\script\SceneHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { log } = require("console");
const UIHelper = require("./UIHelper");
const Observer = require("./Observer");

module.exports =
{
    isTranslating : false,
    isHomeLoaded : false,
    currScene : "launch",
    fromType : 1,
    translateScene(scene)
    {
        // if (scene == this.SCENE_NAME.HOME)
        // {
        //     if (this.isHomeLoaded)
        //     {
        //         this.currScene = scene;
                
        //         cc.director.loadScene(scene);
        //         return;
        //     }
        // }
        
        UIHelper.displayUI("ScenePage",null,true, false,(page) =>
        {
            this.currScene = scene;

            if(page) page.getComponent("ScenePage").setData(scene);
            else cc.director.loadScene(scene);
        })
    },

    translateComplete()
    {
        
        let sg = UIHelper.getUI("ScenePage");
        if (sg)
        {
            let _ssg = sg.getComponent("ScenePage");
            
            if (_ssg) _ssg.realComplete()
            else UIHelper.hideUI("ScenePage");
        }
    },

    preLoadScene(_scene,_callback)
    {
        cc.director.preloadScene(_scene, () => {
            _callback && _callback();
        });
    },

    isGameScene()
    {
        console.log("is game scene : ",this.currScene)
        return this.currScene == this.SCENE_NAME.GAME;
    },

    FROM_TYPE :
    {
        LAUNCH : 1,
        GAME_AGAIN : 11,
        GAME_SUCCESS : 12,
        GAME_FAIL : 13,
    },
    SCENE_NAME: 
    {
        LAUNCH : "launch",
        HOME : "home",
        GAME : "game",
    }
}