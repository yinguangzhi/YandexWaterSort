/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2025-01-14 20:30:33
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-01-15 10:57:23
 * @FilePath: \WaterSort\assets\script\RankItem.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


const UIHelper = require("./UIHelper");
const Observer = require("./Observer");
const PlatformTool = require("./PlatformTool");
const GameParamsHelper = require("./GameParamsHelper");
const TimerHelper = require("./TimerHelper");
const { log } = require("console");
const AudioHelper = require("./AudioHelper");
const CocosLoader = require("./CocosLoader");
const SSDScript = require("./SSDScript");
const WebBridge = require("./WebBridge");
const GameMgr = require("./GameMgr");
const ItemMgr = require("./ItemMgr");
const HintHelper = require("./HintHelper");
const ColorHelper = require("./ColorHelper");

cc.Class({
    extends: SSDScript,

    properties: {
        bg: cc.Sprite,
        rankImage: cc.Sprite,
        rankLabel: cc.Label,
        scoreLabel: cc.Label,
        nameLabel: cc.Label,
        
        bgFrames : [cc.SpriteFrame],
        rankFrames : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setData()
    {
        let _scoreColors = ["#D93423","#C600FF","#D05A19","#20519B","#FFFFFF"]
        let _nameColors = ["#AB5813", "#388F95", "#488C61", "#3E6CB0", "#215B00"];
        let _rankColors = ["#406EB3","#215B00"];

        this.rankImage.node.active = this.data.rank <= 3;
        this.rankLabel.node.active = this.data.rank > 3;

        if (this.data.rank <= 3)
        {
            this.rankImage.spriteFrame = this.rankFrames[this.data.rank - 1];
            this.bg.spriteFrame = this.bgFrames[this.data.rank - 1];
            this.nameLabel.node.color = ColorHelper.convertHexToColor(_nameColors[this.data.rank - 1])
            this.scoreLabel.node.color = ColorHelper.convertHexToColor(_scoreColors[this.data.rank - 1])
        }
        else
        {
            this.bg.spriteFrame = this.bgFrames[3];
            this.nameLabel.node.color = ColorHelper.convertHexToColor(_nameColors[3])
            this.scoreLabel.node.color = ColorHelper.convertHexToColor(_scoreColors[3])
            this.rankLabel.node.color = ColorHelper.convertHexToColor(_rankColors[0])
        }
        
        if (this.data.isSelf)
        {
            this.bg.spriteFrame = this.bgFrames[4];
            this.nameLabel.node.color = ColorHelper.convertHexToColor(_nameColors[4])
            this.scoreLabel.node.color = ColorHelper.convertHexToColor(_scoreColors[4])
            this.rankLabel.node.color = ColorHelper.convertHexToColor(_rankColors[1])
        }
        

        this.rankLabel.string = this.data.rank;
        this.nameLabel.string = this.data.name;
        this.scoreLabel.string = "Level " + this.data.score;
    }
});
