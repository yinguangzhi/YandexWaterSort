/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-03-17 21:48:07
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-04-27 22:34:30
 * @FilePath: \WaterSort\assets\script\JsonConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const { LOCK_TYPE } = require("./EnumHelper");

module.exports = {
    skinConfigs: [
        {id : 1,unknown : 0,lock : LOCK_TYPE.FREE,price : 0,},
        {id : 2,unknown : 0,lock : LOCK_TYPE.COIN,price : 1000,},
        // {id : 100,unknown : 1,lock : LOCK_TYPE.COIN,price : 1000,},
    ]
}