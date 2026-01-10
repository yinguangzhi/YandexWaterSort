/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2023-11-10 21:41:32
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-02-18 21:40:33
 * @FilePath: \Decompression\assets\script\CocosHelper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */



module.exports =
{
    loadAsyncRes(url, type, bundleName = 'resources') 
    {
        return new Promise<T>((resolve, reject) => 
        {
            console.log(reject);
            console.log(resolve);
            if (bundleName == 'resources') //加載resource包資源
            {    
                cc.resources.load(url, type, (err, asset) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    
                    resolve(asset)
                })
                return;
            }
        })
    },

    getChildByPath(_note, _path) {
        
        if (!_note) return null;
        if (!_path) return _note;

        let _ns = _path.split('/');
        if (_ns.length == 0) return _note;

        let _child = _note;
        for (let i = 0; i < _ns.length; i++)
        {
            let _na = _ns[i];
            if (_na)
            {
                let _c2 = _child.getChildByName(_na);
                if (!_c2) {
                    break;
                }
                else _child = _c2;
            }
            else break;
        }
        return _child;
    },

    getChildComponent(_note,_name,_type)
    { 
        if (!_note) return null;

        let _child = this.getChild(_note, _name);
        
        return this.getComponent(_child, _type);
    },
    
    getComponent(_note,_type)
    { 
        if (!_note) return null;

        let arg = _note.getComponent(_type);
        return arg;
    },
    
    getChild(_note,_name)
    { 
        let _child = _note.getChildByName(_name);
        return _child;
    },
    
    getSSDScript(_note)
    { 
        if (!_note) return null;
        return _note.getComponent("SSDScript");
    },
    
    getNote(_parent,_state,_scale)
    {
        let note = new cc.Node();
        if(_parent) note.parent = _parent;
        note.scale = _scale;
        return note;
    },

    randomRange(min, max) {
        let _val = Math.floor(Math.random() * (max - min) + min);
        return _val;
    },

    randomRangeFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    },

    randomInArray(list) {
        let temp = [];
        for (let i = 0; i < list.length; i++) {
            for (let m = 0; m < 10; m++) {
                temp.push(list[i]);
            }
        }
        let ran = this.randomRange(0, temp.length);
        return temp[ran];
    },

    isInArray(arr,val)
    {
        return arr.indexOf(val) >= 0;
    },

    removeFromArray(arr,unit,_setNull = false)
    {
        if (!arr) return false;

        if (arr.length == 0) return false; 

        let _idx = arr.indexOf(unit);
        if (_idx == -1) return false;

        if (_setNull)
        {
            arr[_idx] = null;
        }
        else
        {
            arr.splice(_idx, 1);
        }    
        return true;
    },
    
    removeArrayFromArray(array,deleteArr)
    {
        if (!array) return;
        if (array.length == 0) return;

        if (!deleteArr) return;
        if (deleteArr.length == 0) return;

        while (true)
        {
            let k = deleteArr[0];
            this.removeFromArray(array, k);
            deleteArr.splice(0, 1);

            if (deleteArr.length == 0) break;
        }
    },

    getRandomResult(_rand,_probabilityArr)
    {
        let ctp = 0;
        let cfg = _probabilityArr[0];
        for(let i = 0;i < _probabilityArr.length;i++)
        {
            if (_probabilityArr[i].probability <= 0) continue;
            
            ctp += _probabilityArr[i].probability;
            if(ctp >= _rand)
            {
                cfg = _probabilityArr[i];
                break;
            }
        }
        return cfg;
    },

    clone(from, to) {
        if (!to) to = {};
        for (let key in from) {
            to[key] = from[key];
        }
        return to;
    },

    calcTime(time)
    {
        let minutes = Math.floor(time / 60);
        if (minutes < 10) minutes = '0' + minutes;

        let seconds = Math.floor(time % 60);
        if (seconds < 10) seconds = '0' + seconds;
        
        return (minutes + ":" + seconds);
    },

    getTime() {
        let now = new Date();
        return now.getTime() / 1000;
    },

    currentTimeStr: function () {
        let now = new Date();

        let year = now.getFullYear();       //年
        let month = now.getMonth() + 1;     //月
        let day = now.getDate();            //日

        let clock = year + "-";

        if (month < 10) clock += "0";

        clock += month + "-";

        if (day < 10) clock += "0";

        clock += day;
        return (clock);
    },

    normalSort(list, random) {
        if (random) {
            list.sort(() => {
                return Math.random() > 0.5 ? 1 : -1;
            });
        }
        else {
            list.sort((a, b) => {
                return a - b;
            });
        }
    },
    normalSortByParams(list, params) {
        list.sort((a, b) => {
                return a[params] - b[params];
            });
    },

    calcDistance(pos1,pos2)
    { 
        if (!pos1) return 0;
        if (!pos2) return pos1.mag();
        let pos3 = pos1.sub(pos2);
        return pos3.mag();
    },
    
    convertPos(_from,_to,_pos)
    {
        if (!_from || !_to) return cc.v2();
        
        let _w_pos = _from.convertToWorldSpaceAR(_pos);
        return _to.convertToNodeSpaceAR(_w_pos);
    },

    classicCanvasRect: null,//new cc.Rect(-size.width * 0.5, -size.height * 0.5, size.width, size.height),
    canvasRect: null,//new cc.Rect(-size.width * 0.5, -size.height * 0.5, size.width, size.height),

    refreshCanvasRect() {
        let size = cc.winSize;
        this.canvasRect = new cc.Rect(-size.width * 0.5, -size.height * 0.5, size.width, size.height);
        this.classicCanvasRect = new cc.Rect(-size.width * 0.5, -size.height * 0.5, size.width, size.height);
    },


    isInCanvas(node, crect) {
        let _rect = node.getBoundingBox();
        return cc.Intersection.rectRect(_rect, crect);
    },

    isOutScreen(node, camera) {
        let _pos = node.convertToWorldSpaceAR(cc.v2());
        _pos = camera.getWorldToScreenPoint(_pos);

        if (_pos._x >= cc.winSize.width ||
            _pos.x <= 0 ||
            _pos.y >= cc.winSize.height ||
            _pos.y <= 0) return true;

        return false;
        console.log(_pos);
    },

    twoList: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536],
    getTwoFromValue(val) {
        let _arg = this.twoList.indexOf(val);
        return _arg + 1;
    },

    removeFromList(list, unit) {
        let _idx = list.indexOf(unit);
        if (_idx != -1) {
            list.splice(_idx, 1);
        }
        return _idx;
    },


    getNumDesc(val) {
        if (val >= 10000) {
            let valDesc = val;
            if (val >= 1000000000) valDesc = parseInt(val / 1000000000) + "G";
            else if (val >= 1000000) valDesc = parseInt(val / 1000000) + "M";
            else if (val >= 10000) valDesc = parseInt(val / 1000) + "K";
            return valDesc;
        }
        else return val;
    },

    // realSize: { width: 720, height: 1280 },
    //     getRealSize() {
    //         let frameSize = cc.view.getFrameSize();
    //         let frameRate = frameSize.height / frameSize.width;

    //         let designSize = { width: 720, height: 1280 };
    //         let designRate = designSize.height / designSize.width;

    //         let realWidth = designSize.width;
    //         let realHeight = designSize.height;
    //         if (frameRate > designRate) {
    //             realHeight = frameSize.height * designSize.width / frameSize.width;
    //         }
    //         else
    //         {
    //             realWidth = frameSize.width * designSize.height / frameSize.height;
    //         }

    //         this.realSize.width = realWidth;
    //         this.realSize.height = realHeight;

    //         return { width: realWidth, height: realHeight };
    // },
        
    widthDevice: false,//是否是宽屏设备
    realSize: { width: 720, height: 1280 ,canvasWidth : 720,canvasHeight : 1280,designRate : 1 ,realRate : 1 },
    getRealSize() {
        let frameSize = cc.view.getFrameSize();
        let frameRate = frameSize.height / frameSize.width;

        let designSize = { width: 720, height: 1280 };
        let designRate = designSize.height / designSize.width;

        
        this.widthDevice = frameRate < designRate;//宽屏设备

        this.realSize.designRate = designRate;
        this.realSize.realRate = designRate;

        let realWidth = designSize.width;
        let realHeight = designSize.height;
        if (frameRate > designRate) {
            this.realSize.realRate = frameRate;
            realHeight = frameSize.height * designSize.width / frameSize.width;
        }
        else
        {
            realWidth = frameSize.width * designSize.height / frameSize.height;
        }


        this.realSize.width = realWidth;
        this.realSize.height = realHeight;

        console.log(this.realSize);
        return this.realSize;
    },

    isWidthDevice() {
        let frameSize = cc.view.getFrameSize();
        let frameRate = frameSize.height / frameSize.width;

        let designSize = { width: 720, height: 1280 };
        let designRate = designSize.height / designSize.width;

        return frameRate < designRate;
    },

    bezierNTo(node,time, _easing, callback,perCallback,posn)
    {
        let bPArr = posn;
        if(!bPArr)
        {
            return;
        }

        let startPos = bPArr[0];
        if(bPArr.length == 1)
        {
            console.warn("beizer is something wrong,only one pos");
            node.position = startPos;

            perCallback && perCallback();
            callback && callback();

            return;
        }

        let _aArr = this.getYangHui(bPArr.length);
        // console.log(bPArr.length,"  ",_aArr)
        //几阶贝塞尔曲线
        let orderNumber = bPArr.length - 1;
        let endPos = bPArr[bPArr.length - 1];
    
        let tempVec = cc.v2();
        let dis = 0;

        cc.tween(node)
        .to(time, { position: endPos }, {easing : "sineIn", onUpdate: (target, ratio) => {

            let t = ratio;

            tempVec.x = 0;
            tempVec.y = 0;
            for(let i = 0;i < bPArr.length;i++)
            {
                let _a = _aArr[i];
                let _b = bPArr.length - 1 - i;
                let _c = i;
                tempVec.x += _a * (Math.pow(1 - t,_b)) * (Math.pow(t,_c)) * bPArr[i].x;
                tempVec.y += _a * (Math.pow(1 - t,_b)) * (Math.pow(t,_c)) * bPArr[i].y;
            }

            // if(orderNumber == 2)
            // {
            //     let p1 = startPos;
            //     let p2 = bPArr[1];
            //     let p3 = endPos;

            //     tempVec.x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * p2.x + t * t * p3.x;
            //     tempVec.y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * p2.y + t * t * p3.y;
            // }
            // else if(orderNumber == 3)
            // {
            //     let p1 = startPos;
            //     let p2 = bPArr[1];
            //     let p3 = bPArr[ 2];
            //     let p4 = endPos;

            //     tempVec.x = (1 - t) * (1 - t) * (1 - t) * p1.x + 3 * t * (1 - t) * (1 - t) * p2.x + 3 * t * t * (1 - t) * p3.x + t * t * t * p4.x;
            //     tempVec.y = (1 - t) * (1 - t) * (1 - t) * p1.y + 3 * t * (1 - t) * (1 - t) * p2.y + 3 * t * t * (1 - t) * p3.y + t * t * t * p4.y;
            // }
            // else if(orderNumber == 4)
            // {
            //     let p1 = startPos;
            //     let p2 = bPArr[1];
            //     let p3 = bPArr[2];
            //     let p4 = bPArr[3];
            //     let p5 = endPos;

            //     tempVec.x = (1 - t) * (1 - t) * (1 - t) * (1 - t) * p1.x + 4 * t * (1 - t) * (1 - t) * (1 - t) * p2.x + 6 * t * t * (1 - t) * (1 - t) * p3.x + 4 * t * t * t * (1 - t) * p4.x + t * t * t * t * p5.x;
            //     tempVec.y = (1 - t) * (1 - t) * (1 - t) * (1 - t) * p1.y + 4 * t * (1 - t) * (1 - t) * (1 - t) * p2.y + 6 * t * t * (1 - t) * (1 - t) * p3.y + 4 * t * t * t * (1 - t) * p4.y + t * t * t * t * p5.y;
                 
            // }

            dis += cc.Vec2.distance(tempVec,node.position);

            node.position = tempVec;

            perCallback && perCallback(ratio,dis);
        }})
        .call(() =>
        {
            callback && callback();
        })
        .start();
    },

    getYangHui(n)
    {
        if(n == 3) return[1,2,1];
        else if(n == 4) return[1,3,3,1];
        else if(n == 5) return[1,4,6,4,1];
        else if(n == 6) return[1,5,10,10,5,1];
        else if(n == 7) return[1,6,15,20,15,6,1];
        else if(n == 8) return[1,7,21,35,35,21,7,1];
        else if(n == 9) return[1,8,28,56,70,56,28,8,1];
        else if(n == 10) return[1,9,36,84,126,126,84,36,9,1];
    },

    // 保存字符串内容到文件。
    // 效果相当于从浏览器下载了一个文件到本地。
    // textToWrite - 要保存的文件内容
    // fileNameToSaveAs - 要保存的文件名
    saveForBrowser(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
            let textFileAsBlob = new Blob([textToWrite], { type: 'application/json' });
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";

            if (window.webkitURL != null) {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                // downloadLink.pathname = "D:/CocosCreatorProject/BeatFireFolder/copy/BeatFire20201020/assets/resources/Json"
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        }
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