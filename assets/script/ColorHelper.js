// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

module.exports = {

    RANK_1_COLOR : "#3C5636",
    RANK_4_COLOR : "#D4BD7C",

    signLabelColor : '#ffffff',
    todayOutlineColor : '#916700',
    yesterdayOutlineColor: '#005708',
    
    colors: ["#22de2b", "#ffe238", "ff9000", "#00ffff", "#f600ff", "#ffef39", "#9e9e9e", "#ff3318"],
    colorList: {},
    convertHexToColor(colorStr) {
      
        let color = this.colorList[colorStr];
        
        if (this.isEmpty(color)) {
            color = cc.Color.WHITE.fromHEX(colorStr);
            this.colorList[colorStr] = color;
        }
        return color;
    },

    isEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}
