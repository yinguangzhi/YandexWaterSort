/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-11-26 09:08:30
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-05-09 18:19:59
 * @FilePath: \WaterSort\assets\script\ItemMgr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { ITEM_TYPE } = require("./EnumHelper")
const StorageHelper = require("./StorageHelper")

module.exports = {

    propertyMap :null,

    addItemCount(_iType,_val,_save)
    {
        let _curr = this.getItemCount(_iType);
        return this.setItemCount(_iType,_curr + _val,_save)
    },

    setItemCount(_iType,_val,_save)
    {
        let _property = this.getProperty(_iType)
        StorageHelper.saveItem(_property,_val,_save);
        return _val;
    },

    getItemCount(_iType)
    {
        let _property = this.getProperty(_iType)
        if(!_property)
        {
            return null;
        }

        return StorageHelper.getItem(_property,_property.default);
    },

    getLevel()
    { 
        return this.getItemCount(ITEM_TYPE.LEVEL);
    },
    
    getProperty(_iType)
    {
        if(this.propertyMap == null)
        {
            this.propertyMap = {};
            this.propertyMap[ITEM_TYPE.COIN] = StorageHelper.STORAGE_PROPERTY.COIN;
            this.propertyMap[ITEM_TYPE.LEVEL] = StorageHelper.STORAGE_PROPERTY.LEVEL;
            this.propertyMap[ITEM_TYPE.STREAK] = StorageHelper.STORAGE_PROPERTY.STREAK;
            this.propertyMap[ITEM_TYPE.PROP_UNDO] = StorageHelper.STORAGE_PROPERTY.PROP_UNDO;
            this.propertyMap[ITEM_TYPE.PROP_UNLOCK] = StorageHelper.STORAGE_PROPERTY.PROP_UNLOCK;
            this.propertyMap[ITEM_TYPE.PROP_HINT] = StorageHelper.STORAGE_PROPERTY.PROP_HINT;
            this.propertyMap[ITEM_TYPE.GUIDE] = StorageHelper.STORAGE_PROPERTY.GUIDE;
            this.propertyMap[ITEM_TYPE.FREE_REWARD] = StorageHelper.STORAGE_PROPERTY.FREE_REWARD;
            this.propertyMap[ITEM_TYPE.REWARD_PROGRESS] = StorageHelper.STORAGE_PROPERTY.REWARD_PROGRESS;
            this.propertyMap[ITEM_TYPE.TURNABLE_STAGE] = StorageHelper.STORAGE_PROPERTY.TURNABLE_STAGE;
            this.propertyMap[ITEM_TYPE.MISSION_AD] = StorageHelper.STORAGE_PROPERTY.MISSION_AD;
            this.propertyMap[ITEM_TYPE.MISSION_LEVEL] = StorageHelper.STORAGE_PROPERTY.MISSION_LEVEL;
            this.propertyMap[ITEM_TYPE.MISSION_LOGIN] = StorageHelper.STORAGE_PROPERTY.MISSION_LOGIN;
            this.propertyMap[ITEM_TYPE.SKINS] = StorageHelper.STORAGE_PROPERTY.SKINS;
            this.propertyMap[ITEM_TYPE.SKIN_ID] = StorageHelper.STORAGE_PROPERTY.SKIN_ID;
            this.propertyMap[ITEM_TYPE.SUGGESTED_LEVEL] = StorageHelper.STORAGE_PROPERTY.SUGGESTED_LEVEL;
        }
        
        let _property = this.propertyMap[_iType];
        return _property;
    },

    saveData()
    {
        StorageHelper.commonSaveUserData();
    },

    skinID()
    {
        return this.getItemCount(ITEM_TYPE.SKIN_ID);
    }
}