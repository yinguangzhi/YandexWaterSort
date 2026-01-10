/*
 * @Author: shaoshude 2797275476@qq.com
 * @Date: 2023-02-26 19:46:57
 * @LastEditors: shaoshude 2797275476@qq.com
 * @LastEditTime: 2023-05-18 22:27:30
 * @FilePath: \ADPiano5\assets\Scripts\DebugTool.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

module.exports = 
{
    isDebug : false,

    log(...data)
    {
        if (!this.isDebug) return;

        console.log(...data);
    },

    error(...data)
    {
        if (!this.isDebug) return;
        
        console.error(...data);
    }
}