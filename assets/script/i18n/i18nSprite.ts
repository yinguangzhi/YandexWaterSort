import i18nMgr from "./i18nMgr";


const { ccclass, property, executeInEditMode, requireComponent, disallowMultiple , menu} = cc._decorator;

/**
 * i18nSprite
 * @author chenkai 2022.3.8
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
@disallowMultiple
@menu("多语言/i18nSprite")
export default class i18nSprite extends cc.Component {

    @property({ visible: false })
    private _key: string = "";
    @property({ type: cc.String, tooltip: "配置key值" })
    public get key() {
        return this._key;
    }
    public set key(value) {
        this._key = value;
        this.resetValue();
    }

    start() {
        i18nMgr.ins.add(this);
        this.resetValue();
    }

    onDestroy() {
        i18nMgr.ins.remove(this);
    }

    /**
     * 设置
     * @param key   配置key值 
     */
    public setValue(key: string) {
        this._key = key;
        this.resetValue();
    }

    /**重置 */
    public resetValue() {
        i18nMgr.ins.getSpriteFrame(this._key, (spriteFrame: cc.SpriteFrame) => {
            if (spriteFrame != null && cc.isValid(this.node)) {
                let sp: cc.Sprite = this.node.getComponent(cc.Sprite);
                sp.spriteFrame = spriteFrame;
            }
        }, this)
    }
}
