
module.exports = {
    
    itemFrameMap: {},
    
    addItemFrame(_frame)
    {
        if (!_frame) return;
        if (!cc.isValid(_frame)) return;

        let _name = _frame.name;
        let _arg = this.itemFrameMap[_name];
    
        this.itemFrameMap[_name] = _frame;
    },

    setItemFrames(_frames,_clear)
    {
        if (_clear) 
        {
            this.itemFrameMap = {};
        }

        for (let i = 0; i < _frames.length; i++)
        {
            let _frame = _frames[i];
            this.addItemFrame(_frame);
        }
    },

    getItemFrame(_itemType)
    {
        let _name = 'item_' + _itemType;
        return this.itemFrameMap[_name];
    },
    
    clearItemFrames()
    { 

    },
    
    setPropFrames()
    {

    },
}