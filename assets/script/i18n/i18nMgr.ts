import i18nLabel from "./i18nLabel";


const { ccclass, property } = cc._decorator;

/**
 * i18n管理类
 */
@ccclass
export default class i18nMgr {

    //单例
    private static _ins: i18nMgr;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new i18nMgr();
        }
        return this._ins;
    }

    /**语言路径 */
    private language_path = {
        "1": "zh",
        "2": "en",
        "3": "ja",
        "4": "pt",
        "5": "es",
        "6": "id",
        "7": "ko",
        "8": "ru"
    }
    private languageTitles = [
        {code : Language.en,folder : "en"},
        {code : Language.zh,folder : "zh"},
        {code : Language.ja,folder : "ja"},
        {code : Language.pt,folder : "pt"},
        {code : Language.es,folder : "es"},
        {code : Language.id,folder : "id"},
        {code : Language.ko,folder : "ko"},
        {code : Language.ru,folder : "ru"},
    ];

    /**是否初始化过 */
    private _inited: boolean = false;
    /**语言，默认英文 */
    private _language: Language = Language.en;
    /**文本配置 */
    private _labelConfig = {};
    /**组件列表 */
    private _componentList = [];

    public setLanguageFromExternal(language : any)
    {
        let _lg = Language.en;
        
        // if (language.indexOf("ja") != -1) _lg = Language.ja;
        // else if (language.indexOf("es") != -1) _lg = Language.es;
        // else if (language.indexOf("id") != -1) _lg = Language.id;
        // else if (language.indexOf("pt") != -1) _lg = Language.pt;
        // else if (language.indexOf("es") != -1) _lg = Language.es;
        // else if (language.indexOf("zh") != -1) _lg = Language.zh;
        // else if (language.indexOf("ko") != -1) _lg = Language.ko;
        // else if (language.indexOf("ru") != -1) _lg = Language.ru;
        if (language.indexOf("ru") != -1) _lg = Language.ru;
        
        this.setLanguage(_lg);
     }
    
    /**
     * 设置语言
     * @param language 语言
     */
    public setLanguage(language: Language) {
        if (this._language == language) {
            return;
        }
        this._language = language;
        this.loadConfig();
    }

    public getLanguage()
    { 
        return this._language;
    }
    
    /**加载配置，重置组件 */
    private loadConfig() {

        let url = this.getLabelPath(this._language);

        cc.resources.load(url, cc.JsonAsset, (err, assets) => 
        {
            if (err == null)
            {
                this._labelConfig = (assets as cc.JsonAsset).json;

                // console.log(this._labelConfig);
                
                for (let com of this._componentList) {
                    if(com) com.resetValue();
                }
            } 
            else
            {
                console.error("[i18nMgr] 文本配置不存在:", url);
            }
        });
    }

    /**
     * 获取文本配置路径
     * @param language 语言
     * @returns 返回文本配置路径
     */
    public getLabelPath(language: Language) {
        return "i18n/label/" + this.getLanguageFolder(language);
    }

    public getLanguageFolder(language: Language)
    {
        let _lt = this.languageTitles.find(element => element.code == language);
        if(_lt) return _lt.folder;

        return this.languageTitles[0].folder;
    }

    /**
     * 获取图片路径
     * @param language 语言
     * @param key  图片key
     * @returns 返回图片路径
     */
    public getSpritePath(language: Language, key) {
        return "i18n/sprite/" + this.getLanguageFolder(language) + "/" + key;
    }

    /**
     * 添加组件
     * @param componet 组件
     */
    public add(component) {
        this._componentList.push(component);
    }

    /**
     * 移除组件
     * @param component 组件
     */
    public remove(component) {
        let index = this._componentList.indexOf(component);
        if (index != -1) {
            this._componentList.splice(index, 1);
        }
    }

    /**
     * 获取配置文本
     * @param key key值
     * @param params 传入参数
     * @returns 返回字符串
     */
    public getLabel(key: string, params: string[] = null) {

        this.checkInit();
        
        if (params == null || params.length == 0) 
        {
            return this._labelConfig[key] || key;
        }

        let str = this._labelConfig[key] || key;
        for (let i = 0; i < params.length; i++) 
        {
            let reg = new RegExp("#" + i, "g");
            str = str.replace(reg, params[i]);
        }
        return str;
    }
 
    /**
     * 获取图片
     * @param key key值
     * @param cb 回调
     * @param target 回调对象
     * @returns 返回图片spriteFrame
     */
    public getSpriteFrame(key: string, cb: Function, target: any) {
        this.checkInit();
        let url = this.getSpritePath(this._language, key);
        cc.resources.load(url, cc.SpriteFrame, (err, assets) => {
            if (err == null) {
                cb.call(target, assets);
            } else {
                cb.call(target, null);
            }
        });
    }

    /**检查初始化 */
    private checkInit() {
        if (this._inited == false) {
            this._inited = true;
            this.loadConfig();
        }
    }
}

/**语言 */
export enum Language {
    /**中文 */
    zh = 1,
    /**英文 */
    en = 2,
    /**日文 */
    ja = 3,
    /**葡文 */
    pt = 4,
    /**西班牙文 */
    es = 5,
    /**印尼文 */
    id = 6,
    /**韩文 */
    ko = 7,
    /**韩文 */
    ru = 8,
}
