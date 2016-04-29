/**
 * 静态文件加载器 - v0.1.2 - 2015-11-25
 * Copyright (c) 2015 Young Foo
 */
var Cross = function(){
    
}

var Application = function(config){
    
    //声明实例对象
    //Application 实例化完成后将会挂载到Cross.instance 上面
    Cross.instance = {};
    
    //私有变量less，css，js模板
    var __jsTemplate = '<script src="${src}" charset="utf-8" type="text/javascript" itemid="${itemid}"><\/script>',
    __cssTemplate = '<link rel="stylesheet" type="text/css" href="${href}" itemid="${itemid}" />';

    /**
     * aliases the registered type aliases
     * 注册假名列表
     * var array
     * private
     */
    var aliases = [];

    //container
    this.container = {};
    
    //instance
    this.instances = {};

    //config
    this.config = {}

    //cdn path
    this.cdnPath = "";

    //dest path
    this.destPath = "";
    
    /**
     * 设置假名
     * Alias a type to a different name.
     * @param  string  abstract 类名
     * @param  string  alias 假名
     * @return void
     */
    this.alias = function(alias, abstract){
        aliases[alias] = abstract;
    };

    /**
     * 获取假名
     * Get the alias for an abstract if available.
     * @param  string  $abstract
     * @return string
     */
    this.getAlias = function(abstract){
        return aliases[abstract] ? aliases[abstract] : abstract;
    }



    /**
     * 装载配置文件
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    this.configure = function(conf){
        this.config = conf;
    }
    
    
    /**
     * 注册实例到容器中
     */
    this.instance = function(abstract, instance){
        
        this.instances[abstract] = instance;
        
    }

    /**
     * 获取容器实例
     * Set the globally available instance of the container.
     * @param null
     * @return obj
     */
    this.getInstance = function(){
        return Cross.instance;
    }
    
    /**
     * 设置容器实例
     * Set the shared instance of the container.
     */
    this.setInstance = function(container){
        Cross.instance = container
    }
    
    
    
    /**
     * 创建单例模式
     * 参数：args 传给单例的一个参数集合
     */    
    this.singleTon = function(args){
        
        var args = args || {};
        
        this.name = "SingleTonTester";
        
        this.pointX = args.pointX || 6;
        
        this.pointY = args.pointY || 10;
        
    }
    
    
    //将实例注册到容器上  user  user config 学习singleton ， provider, provider用于提供工具类之类的东西
    this.register = function(objName){
        this.container[objName] = new window[objName]();
    }

    /**
     * 获取容器上的对象
     * @param obj 对象名
     * @return 返回容器中的对象
     */
    this.make = function(objName){
        //判断容器中是否存在，如果存在就返回对象
        for(var key in this.container){
            if(key == objName){
                return this.container[objName];
            }
        };

        //如果不存在就直接返回注册对象
        this.register(objName);
        return this.container[objName];
    }
 
    /**
     * 初始化导入
     * @return {[type]} [description]
     */
    this.initImport = function(){

        this.cdnPath = this.config.cdnPath || "/";
        this.destPath = this.config.cdnPath + "/dest/" + this.config.publishVersion + "/";

        /**
         * 根据是否是开发版修改cdn路径和判断加载less编译文件
         */
        if (this.config.mode == "dev") {

            //dev环境路径配置
            this.cdnPath = this.cdnPath + "/";

        };

    };

    /**
     * [__importdest 导入压缩文件]
     * @param  {[type]} file     [文件]
     * @param  {[type]} fileType [文件类型]
     * @param  {[type]} id       [文件id]
     * @return {[type]}          [null]
     */
    var __importDest = function(file, fileType, ins, isHead){

        var outStr = '';
        var fileDest = '';
        
        if(ins.config.mode == "onlinedev"){
            fileDest = file;
        }
        
        if(ins.config.mode == "online"){
            fileDest = file.split(".")[0] + "-min." + fileType;
        }
        
        if (fileType == "js") {
            
            outStr = __jsTemplate.replace("${src}", ins.destPath + "js/" + fileDest + "?v=" + ins.config.subPublishVersion).replace("${itemid}", file);
        
        } else if (fileType == "css") {

            outStr = __cssTemplate.replace("${href}", ins.destPath + "css/" + fileDest + "?v=" + ins.config.subPublishVersion).replace("${itemid}", file);
        
        }

        if(isHead){
            ins.asyncImportJs(ins.cdnPath + file);
        }else{
            document.write(outStr);
        }
    }

    /**
     * [__importDest 导入debug文件]
     * @param  {[type]} files    [文件数组]
     * @param  {[type]} fileType [文件类型]
     * @param  {[type]} id       [文件id]
     * @return {[type]}          [null]
     */
    var __importDev = function(files, fileType, ins, isHead) {

        for(var i = 0; i < files.length; i++) {

            var outStr = '';

            if (fileType == "js") {

                outStr = __jsTemplate.replace("${src}", ins.cdnPath + "src/" + files[i]).replace("${itemid}", files[i]);

            } else if (fileType == "css") {

                outStr = __cssTemplate.replace("${href}", ins.cdnPath + "dev/" + files[i]).replace("${itemid}", files[i]).replace(".less", ".css");
            
            };

            if(isHead){
                ins.asyncImportJs(ins.cdnPath + files[i]);
            }else{
                document.write(outStr);
            }
        }

    }

    /**
     * @function importFile 导入文件
     * @param id 静态文件的id名称
     * @param fileType  文件类型  js/css
     * @param mode 运行环境 dev/online dev表示环境加载多个源码文件 online代表线上环境 加载单个合并压缩后的文件
    */
    this.importFile = function(id, fileType, mode, isHead) {

        var __mode = this.config.mode,
            __id = id +'.' + fileType;

        //判断是否有指定模式
        if (mode) {
            __mode = mode;
        }

        //判断resource数组是否为空
        if (!this.config.resource[__id]) {
            return false;
        }

        //通过不同的模式导入不同的文件
        if (__mode == "online" || __mode == "onlinedev") {

            //线上模式导入
            __importDest(__id, fileType, this, isHead);

        } else if (__mode == "dev") {

            //调试模式导入
            __importDev(this.config.resource[__id], fileType, this, isHead);
        }
    }

    /** 
     * @function asyncImport 异步导入
     * @param src js的路径
    */
    this.asyncImportJs = function(src, charset) {
        
        var head = document.getElementsByTagName("head")[0];

        //创建script
        var script = document.createElement("script");
        script.type = "text/javascript";

        //设置为异步
        script.async = true;
        script.src = src;


        //charset设置
        if (charset) {
            script.charset = charset;
        }

        //防止没有head标签的情况
        if (!head) {
            document.body.insertBefore(script, document.body.firstChild);
        } else {
            head.appendChild(script);
        }
    }

    /**
     * 构造函数
     * @return {[type]} [description]
     */
    this.init = function(conf){

        //初始化配置文件
        this.configure(conf);

        //导入配置文件
        this.initImport();

    }

    //初始化
    this.init(config);

}

var cross = new Application(window.Config);

