var ccpath = require('path');
var fs = require('fs');

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(ccpath.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

function onBeforeBuildFinish(options, callback) {

    let rootPath = Editor.Project.path;
    Editor.log('WR :: Building root: ' + rootPath);

    let _compressedDir = "assets/WRRes/CompressedTexture";
    let _pngDir = "assets/WRRes/NeedCompressTexturePng";
    let _jpgDir = "assets/WRRes/NeedCompressTextureJpg";
    let _mp3Dir = "assets/WRRes/NeedCompressAudio";
    let _resDir = "assets/WRRes/";

    let _tempdir = ccpath.join(rootPath, _resDir);
    if (!fs.existsSync(_tempdir)) fs.mkdirSync(_tempdir);

    _tempdir = ccpath.join(rootPath, _pngDir);
    if (!fs.existsSync(_tempdir)) fs.mkdirSync(_tempdir);

    _tempdir = ccpath.join(rootPath, _jpgDir);
    if (!fs.existsSync(_tempdir)) fs.mkdirSync(_tempdir);
    
    _tempdir = ccpath.join(rootPath, _compressedDir);
    if (!fs.existsSync(_tempdir)) fs.mkdirSync(_tempdir);
    
    _tempdir = ccpath.join(rootPath, _mp3Dir);
    if (!fs.existsSync(_tempdir)) fs.mkdirSync(_tempdir);

    // get all textures in build

    //需要压缩的图片存放的位置，
    //每次构建的时候 都会把未压缩的图片克隆一份放在该目录下（如果 srcDir 目录下存在该图片，则表明该图片已压缩过）
    //开发者可以用任何压缩工具或是压缩网站对该目录下的图片进行压缩
    //图片压缩后，可以存放到 srcDir 目录下
    let compressPngDir = ccpath.join(rootPath, _pngDir);
    let compressJpgDir = ccpath.join(rootPath, _jpgDir);
    let compressMp3Dir = ccpath.join(rootPath, _mp3Dir);

    //图片压缩后存放的位置，之后再进行构建的时候，就会用该文件夹下的图片 替换 原始图片
    let srcDir = ccpath.join(rootPath, _compressedDir);


    let fileList = fs.readdirSync(compressPngDir);
    fileList.forEach(function (fileName) {
        fs.unlinkSync(ccpath.join(compressPngDir, fileName));
    });

    let fileList2 = fs.readdirSync(compressJpgDir);
    fileList2.forEach(function (fileName) {
        fs.unlinkSync(ccpath.join(compressJpgDir, fileName));
    });

    let fileList3 = fs.readdirSync(compressMp3Dir);
    fileList3.forEach(function (fileName) {
        fs.unlinkSync(ccpath.join(compressMp3Dir, fileName));
    });
    
    Editor.log("WR :: options" + JSON.stringify(options));
    Editor.log('WR :: Building dest: ' + options.dest);
    Editor.log('WR :: Building platform: ' + options.platform);

    let textureType = cc.js._getClassId(cc.Texture2D);
    let audioType = cc.js._getClassId(cc.AudioClip);

    //处理图片
    let processCall = (buildResults) =>
    {
        let cnt = 0;
        let textures = [];
        let assets = buildResults.getAssetUuids();
        for (let i = 0; i < assets.length; ++i) {
            let asset = assets[i];

            let _b_type = buildResults.getAssetType(asset);
            /** texture2d */
            if (_b_type === textureType || _b_type == audioType) {

                //构建后 图片的路径
                let path = buildResults.getNativeAssetPath(asset);//Editor.assetdb.uuidToFspath(asset);//

                if (path == '' || path == null) {
                    if(_b_type === textureType) Editor.log(asset +   ' path is null(找不到图片路径)');
                    if(_b_type === audioType) Editor.log(asset +   ' path is null(找不到音效路径)');
                }
                else {
                    /*let pathArray = path.split("DancingDot\\");
                    if(pathArray.length > 1)
                    {
                        path = "db://" + pathArray[1];
                    }
                    path = path.replace(/\\/g,"/");*/

                    let destPath = path;

                    //后缀名
                    let extName = ccpath.extname(destPath);

                    //图片名字
                    let assName = ccpath.basename(destPath);

                    //是否未png格式的图片
                    let isPng = extName == ".png";
                    let isMp3 = extName == ".mp3";

                    //已压缩图片的路径
                    let srcPath = ccpath.join(srcDir, assName);
                    

                    //如果图片已压缩过，则用压缩过的图片替换原始图片
                    if (fs.existsSync(srcPath)) 
                    {
                        let srcData = fs.readFileSync(srcPath);//, 'utf8'
                        fs.writeFileSync(destPath, srcData)
                    }
                    else
                    {
                        //如果图片未压缩过，则将原始图片克隆一份放置于待压缩目录下
                        let srcData = fs.readFileSync(destPath);
                        let clonePath = "";
                        if (isMp3)
                        {
                            clonePath = ccpath.join(compressMp3Dir, assName);
                        }
                        else
                        {
                            clonePath = isPng ? ccpath.join(compressPngDir, assName) : ccpath.join(compressJpgDir,assName);
                        }
                        
                        fs.writeFileSync(clonePath, srcData);

                        Editor.log("WR :: " + srcPath + " --> " + assName + " is not compress(未压缩)");
                    }

                    textures.push("WR :: " + path);
                    cnt++;
                }
                //Editor.log('textures ' + cnt + ' : ' + path);
            }
        }

        let textureCnt = textures.length;
        Editor.log("WR :: " + 'All textures length: ' + textureCnt);
    }


    //creator的版本是否为2.4.x
    let isVersion24 = options.bundles;
    if(isVersion24)
    {
        options.bundles.forEach(function (bundle) 
        {
            let buildResults = bundle.buildResults;

            // Editor.log("WR :: " + `All textures in build: ${textures}`);

            processCall(buildResults);

        })
    }
    else
    {
        let buildResults = options.buildResults;
        processCall(buildResults);
    }
    
    //刷新文件夹
    Editor.assetdb.refresh('db://assets/WRRes/', function (err, results) {

    });

    // Editor.assetdb.refresh('db://assets/WRRes/NeedCompressTexture/', function (err, results) {

    // });
    callback();
}

module.exports = {
    load() {
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },

    unload() {
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    }
};
