/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-10 23:11:59
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-06-17 18:03:43
 * @FilePath: \Block\assets\script\GameParamsHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


module.exports =
{
    isNewBest: false,
    
    selfCloseAD: false,

    contacted: false,
    playNumber : 0,
        
        
    score: 0,
    dayScore: 0,
    weekScore: 0,
    monthScore: 0,
    yearScore: 0,
        
    reliveCnt: 1,
    
    shadowOpacity: 90,
        
    staticID: 0,
    
    Eliminating: false,
    
    eliminateTime: 0.25,
    
    countInPerLine: 10,
    blockUnitLength: 68,
    blockUnitInterval: 2,

    stackWidth: 170,
    stackHeight : 220,
        
    
    blockEliminateInterval: 0.06,
        
    isBigStack: false,
        
    isLongStack: false,
        
    couldShake: true,
        
    hightLightFadeTime: 0.2,
    
    adNotReadyTip: "video is not ready!",
    
    gameDuration: 0,
    
    currPuzzleLevel: 1,

    maxScoreDelta: 0.1,
    maxScoreDuration: 0.3,
    
    maxCacheStackDistance: 160,

    isInExchanging: false,
    
    stackRotationTime : 0.12,
    maxTouchTimeBeforeExchange: 0.2,
    maxTouchDistanceBeforeExchange: 5,
    
    stackAngle : 0,
}
