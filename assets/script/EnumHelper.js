/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-11 15:06:32
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-09 18:18:50
 * @FilePath: \Block\assets\script\EnumHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

module.exports = {

    ITEM_TYPE : 
    {
        COIN : 1,
        LEVEL: 2,

        PROP_UNDO : 11,
        PROP_UNLOCK : 12,
        PROP_HINT : 13,
        // PROP_ADD
        /** 连胜 */
        STREAK: 21,
        SKIN_ID: 22,
        SKINS: 23,
        
        SUGGESTED_LEVEL : 31,

        GUIDE: 80,
        
        FREE_REWARD: 101,
        REWARD_PROGRESS : 102,
        TURNABLE_STAGE: 201,
        
        MISSION_LOGIN: 301,
        MISSION_AD: 302,
        MISSION_LEVEL: 303,
        
        MISSION_STAR : 320
    },

    DATA_TYPE : 
    {
        number : "number",
        string : "string",
        boolean : "boolean",
        array : "array",
        object : "object",
    },

    /**
     * @description 游戏模式
     */
    LEVEL_MODE :
    {
        /**
         * @description 常规
         */
        NORMAL: 1,
        
        /**
         * @description 计时
         */
        TIME: 2,
        
        /**
         * @description 升级
         */
        UPGRADE : 3,
    },

    DIFFICULTY: 
    {
        EASY: 1,
        NORMAL: 2,
        HARD: 3,
        SPECIAL : 4,
    },

    /**
     * @description 游戏阶段
     */
    GAME_STATUS:
    {
        IDLE: 1,
        PLAYING: 2,
        SUCCESS: 3,
        FAIL : 4,
        END: 5,
    },

    /** 方块的状态 */
    BLOCK_STATUS:
    {
        NORMAL: 1,
        MASK: 2,
        HIDE: 3,
        MOVING : 4,
    },
    
    HINT_TYPE:
    {
        GENERATOR: 1,
        CACHE: 2,
        SPECIAL_COLOR : 3,
    },
    
    PIPE_STATUS:
    {

    },
    
    PIPE_TYPE:
    {
        /** 常规管道 */
        NORMAL: 1,

        /** 缓存管道 */
        CACHE: 2,

        /** 生成方块的管道 */
        GENERATOR : 3,
    },
    
    /**
     * 块的颜色
     */
    COLOR:
    {
        NULL: 0,
        
        RED: 1,

        YELLOW: 2,
        
        BLUE: 3,
        
        GREEN: 4,
        
        /** 紫 */
        PURPLE: 5,
        
        /** 粉 */
        PINK: 6,
        
        /** 青 */
        CYAN: 7,
        
        WHITE: 8,
        
        BLACK : 9,
    },

    AXIOS:
    {
        HORIZONTAL: 1,
        VERTICAL : 2,
    },

    MISSION_TYPE : 
    {
        LOGIN : 1,
        AD : 2,
        LEVEL : 3,
    },

    LOCK_TYPE:
    {
        FREE: 0,
        COIN: 1,
        AD : 2,
    }
}