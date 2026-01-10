/*
 * @Author: shaoshude 2797275476@qq.com
 * @Date: 2022-09-23 22:08:10
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-18 21:57:32
 * @FilePath: \ADPiano5\assets\Scripts\PoolHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports =
{
    POOL_NAME: 
    {
        PIPE: "PIPE",
        BLOCK : "BLOCK",
        CELL : "CELL",
        dragPoint: "dragPoint",
        eliminate : "eliminate",
        unitPuzzle: "unitPuzzle",
        blockUnit : "blockUnit",
        blockUnit2: "blockUnit2",
        coin : "coin",
    },
    
    poolArray: [],
    register(name, prefab) {

        if (!prefab) return;

        let _poolAbout = this.poolArray[name];
        
        if (_poolAbout) {
            let _idx = this.poolArray.indexOf(_poolAbout);
            _poolAbout.pool = null;
            _poolAbout.prefab = null;
            this.poolArray.splice(_idx, 1);
        }

        this.poolArray[name] = { name: name, pool: new cc.NodePool(), prefab: prefab };
    },

    getNote(name, _active, _parent,_list) {
        let poolAbout = this.poolArray[name];
        if (poolAbout == null) {
            return null;
        }

        let obj = null;

        if (poolAbout.pool.size() == 0)
        {
            // console.log(name ," : ",1)

            obj = cc.instantiate(poolAbout.prefab);
            if (_list) _list.push(obj);
        }
        else
        {
            obj = poolAbout.pool.get();
            if (!cc.isValid(obj))
            {
                obj = cc.instantiate(poolAbout.prefab);
                if (_list) _list.push(obj);
            }
        }

        obj.active = _active;
        obj.parent = _parent;

        return obj;
    },

    restore(name, unit) {
        let poolAbout = this.poolArray[name];
        if (poolAbout == null) {
            return null;
        }
        
        if (!unit) return;
        if (!cc.isValid(unit)) return;

        poolAbout.pool.put(unit);
    },

    cloneItem(_item,_parent,_pos,_scale,_angle,_active,_list)
    {
        let obj = cc.instantiate(_item);
        obj.parent = _parent;
        obj.active = _active;
        obj.position = _pos;
        obj.angle = _angle;
        obj.scale = _scale;

        if (Array.isArray(_list)) _list.push(obj);
        return obj;
    },

    clear(name)
    {
        let poolAbout = this.poolArray[name];
        if (poolAbout == null) {
            return null;
        }

        poolAbout.pool.clear();
    },
}