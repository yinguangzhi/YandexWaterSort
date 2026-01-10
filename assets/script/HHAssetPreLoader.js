/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-11-07 20:38:40
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-19 10:42:09
 * @FilePath: \Solitaire\assets\scripts\HHAssetPreLoader.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

module.exports = {

    assetMap : {},
    assetTaskMap :[],

    loadAssetAsync(url,type,callback)
    {
        
        return new Promise((resolve,reject) =>
        {
            let arg = this.assetMap[url];

            if(arg && arg.asset) resolve(arg.asset);
            else
            {
                cc.resources.load(url,type,(error,asset) =>
                {
                    // console.log(asset);
                    if(error)
                    {
                        reject(error)
                    }
                    else
                    {
                        this.assetMap[url] = {url : url,asset : asset};
                        resolve(asset);
                    }
                })
            }
            
        })
    },

    beginPreLoad(title)
    {
        this.checkPreLoad(title);
    },

    checkPreLoad(title)
    {
        let tasks = this.assetTaskMap[title];
        if(!tasks || tasks.length == 0) return;

        let arg = tasks[0];

        let delayCall = (asset) =>
        {
            arg && arg.callback && arg.callback(asset);
            
            if(!tasks || tasks.length == 0) return;
            tasks.splice(0,1);

            setTimeout(() => {
                this.checkPreLoad(title);
            }, arg.interval * 1000);
        }

        let _s = this.getSeconds();
        // console.log("preload begin : " + arg.url + "  :  " + _s);
        this.loadAssetAsync(arg.url,arg.type,null)
            .then((asset) =>
            {   
                let _es = this.getSeconds();
                let _dt = (_es - _s) / 1000;
                // console.log("preload complete : " + arg.url + "  :  " + _es + "  delta : " + _dt);
                
                delayCall(asset);
            })
            .catch((error) =>
            {
                delayCall(null);
            })
            
    },

    /**
     * @description 添加预加载任务
     * @param {任务标志} title 
     * @param {路径} url 
     * @param {类型} type 
     * @param {该资源加载完后，过多久可以加载下一个} interval 
     * @param {*} callback 
     * @returns 
     */
    addAsset(title,url,type,interval,callback)
    {
        let tasks = this.assetTaskMap[title];
        if (!tasks)
        {
            this.assetTaskMap[title] = [];
            tasks = this.assetTaskMap[title];
        }
        
        let find = tasks.find(element => element.url == url);
        if(find)
        {
            // console.log("sir!! 你已经将 " + url + " 加入到预加载列表里了!!!");
            return;
        }

        let arg = {
            title : title,
            url : url,
            type : type,
            interval : interval,
            callback : callback,
        }

        tasks.push(arg);
    },

    stopPreLoad(title)
    { 
        let tasks = this.assetTaskMap[title];
        if (tasks && tasks.length > 0)
        {
            this.assetTaskMap[title] = null;
        }
    },
    
    isPreloaded(url)
    {
        return this.assetMap[url] != null;
    },

    getSeconds()
    {
        return this.getDate().getTime();
    },

    getDate()
    {
        let date = new Date();//new Date(2022,5,20);// 
        return date;
    },
}
