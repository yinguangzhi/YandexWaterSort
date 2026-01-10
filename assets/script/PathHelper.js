/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-13 22:55:14
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-01-14 20:12:48
 * @FilePath: \Block\assets\script\PathHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = 
{
    commonFramePath : "image/block/",
    commonPrefabPath: "prefab/",
    commonAudioPath : "audio/",

    getPrefabPath(_name)
    {
        return this.commonPrefabPath + _name;
    },

    getBlockFramePath(_name)
    {
        return this.commonFramePath + _name;
    },

    getAudioPath(_name)
    {
        return this.commonAudioPath + _name;
    }
}