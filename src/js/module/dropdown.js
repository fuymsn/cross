(function(__Dropdown, window){

    'use strict';

    __Dropdown = function(options){

        var that = this;

        /**
         * 私有方法：展开dropdown
         * @return {[type]} [description]
         */
        var open = function(ins){
            ins.objList.show();
            ins.state = true;
        }

        /**
         * 私有方法：关闭dropdown
         */
        var close = function(ins){
            ins.objList.hide();
            ins.state = false;
        }

        /**
         * 初始化状态机
         * @type {Object}
         */
        this.initState = {
            "dropdown": function(){
                open(that);
            },
            "dropup": function(){
                close(that);
            }
        }

        /**
         * 初始化下拉状态，false 关闭，open打开
         * @type {bool}     
         */
        this.state = false;

        /**
         * 初始化item点击事件
         * @type {function}
         */
        this.handleItem;

        /**
         * 初始化程序
         * @return {[type]} [null]
         */
        this.init = function(){
            
            //初始化option
            this.setOptions();

            //初始化界面对象
            this.target = $("#"+this.options.id);
            this.objTtile = this.target.find(".dropdown-title-text");
            this.objList = this.target.find(".dropdown-list");

            //初始化item点击事件
            this.handleItem = this.options.handleItem;

            //绑定事件
            this.bindEvents();
        }

        //设置options
        this.setOptions = function(){
            return this.options = options;
        }

        //获取options
        this.getOptions = function(){
            return this.options;
        }

        /**
         * 绑定title点击事件和 item点击事件
         * @return {[type]} [description]
         */
        this.bindEvents = function(){

            this.objTtile.on("click", function(){

                if (!that.state) {
                    that.setState("dropdown");
                }else{
                    that.setState("dropup");
                };
                
            });

            this.objList.on("click", ".dropdown-item", function(e){

                var title = e.target.innerText;
                that.setTitle(title);
                that.setState("dropup");

                //关闭list后，执行回调
                that.handleItem(e.target);

            });
        }

        /**
         * 设置dropdown状态
         * @param {[type]} state [状态]
         */
        this.setState = function(state){
            this.initState[state]();
        }

        /**
         * 设置title
         * @param {[type]} title [title]
         */
        this.setTitle = function(title){
            this.objTtile.text(title);
        }

        //初始化
        this.init();
    }

    window.Dropdown = __Dropdown;

})(typeof Dropdown !== "undefined" ? Dropdown : {}, window);