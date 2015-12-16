(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    'use strict';

    /**
     * 将dialog居中
     * @param  {[type]} ins [传入dialog this对象]
     * @return {[type]}     [null]
     */
    var _center = function(ins){
        var d = ins.$dialog;
        var $window = $(window);
        var $document = $(document);
        var fixed = ins.options.fixed;
        var dl = fixed ? 0 : $document.scrollLeft();
        var dt = fixed ? 0 : $document.scrollTop();
        var ww = $window.width();
        var wh = $window.height();
        var ow = d.width();
        var oh = d.height();
        var left = (ww - ow) / 2 + dl;
        var top = (wh - oh) * 382 / 1000 + dt;// 黄金比例
        var style = d[0].style;

        style.left = Math.max(parseInt(left), dl) + 'px';
        style.top = Math.max(parseInt(top), dt) + 'px';
    }

    /**
     * [Dialog]
     * @param {[type]} options [传入dialog属性]
     */
    var Dialog = function(options){
        this.$main;
        this.$dialog;
        this.$shadow;
        this.$closeBtn;
        this.$buttonBox;

        //初始化参数
        this.options;
        this.originalOptions;
        this.buttonTarget;

        //初始化方法
        this.onshow;

        //初始化dialog
        this.init(options);
    }

    //弹窗个数
    var count = 0;
    var wrapperHTML = ['<div class="d-dialog">',
        '<div class="d-wrapper">',
            '<div class="d-close"></div>',
            '<div class="d-main">',
                '<div class="d-title">#{title}</div>',
                '<div class="d-content">#{content}</div>',
                '<div class="d-bottom"></div>',
            '</div>',
        '</div>',
    '</div>',
    '<div class="d-shadow"></div>'].join("");

    Dialog.DEFAULTS = {
        id: (new Date() - 0) + count,
        title: "Dialog",
        content: "这是Dialog",
        width: "auto",
        height: "auto",
        okValue: "确定",
        cancelValue: "取消",

        //用户点击的触发按钮
        cancelDisplay: true,

        //定义目标点击按钮
        buttonTarget: null,

        //是否固定
        fixed: true,

        //是否聚焦
        autofocus: true
    }

    $.extend(Dialog.prototype, {

        //初始化dialog
        init: function(options){

            //初始化后，this.x 会以特权方法的形式挂载在对象上
            //获取options
            this.options = this.getOptions(options);
            this.originalOptions = this.options;

            //生成模板
            var tmp = Utility.template(wrapperHTML, this.options),
                id = this.options.id,
                that = this;

            //生成节点
            this.$main = $(tmp);
            this.$closeBtn = this.$main.find(".d-close");
            this.$dialog = this.$main.siblings(".d-dialog");
            this.$shadow = this.$main.siblings(".d-shadow");
            this.$buttonBox = this.$main.find(".d-bottom");

            //设置dialog ID
            this.$dialog.attr("id", id);

            //this.$main.width(this.options.width);
            //this.$main.height(this.options.height);

            //bind close btn
            $(document).on("click", ".d-close", function(e){
                
                that.remove();

                e.stopPropagation();
            });

            count ++;
        },

        create: function(){
            // button handle
            this.options = this.getOptions(this.originalOptions);

            if (!$.isArray(this.options.button)) {
                this.options.button = [];
            }
            // title设置
            if (!this.options.title) {
                this.$main.find(".d-title").remove();
            };

            // 确定按钮
            if (this.options.ok) {
                this.options.button.push({
                    id: 'ok',
                    value: this.options.okValue,
                    callback: this.options.ok,
                    autofocus: true
                });
            }

            // 取消按钮
            if (this.options.cancel) {
                this.options.button.push({
                    id: 'cancel',
                    value: this.options.cancelValue,
                    callback: this.options.cancel,
                    display: this.options.cancelDisplay
                });
            }

            this.setButton(this.options.button);

            if (!this.options.button.length) {
                this.$main.find(".d-bottom").remove();
            };

        },

        //get default config
        getDefaults: function(){
            return Dialog.DEFAULTS;
        },

        //get options
        getOptions: function(options){
            return $.extend(true, {}, this.getDefaults(), options);
        },

        //向dialog传值
        setData: function(data){
            this.data = data;
            return this;
        },
        //show
        show: function(){

            this.create();
            $("body").append(this.$main);

            //居中
            _center(this);
            //显示
            this.$dialog.show();
            this.$shadow.show();

            // 显示的时候触发
            if (this.options.onshow) {
                //解法1
                //原this.options.onshow中的this只存在于this.options中的值
                //将this中的方法挂载到 this options上，以便onshow方法调用
                // this.options = $.extend({}, this, this.options);
                // 这种方式不对。。。

                //解法2
                //这样做得好处是可以更好的让开发者理解onshow方法里面所调用的this
                this.onshow = this.options.onshow;
                this.onshow();
            };

            //焦点控制
            //若不控制焦点，enter回车键会触发dialog弹出按钮，而出现第二次弹窗
            //并且完成焦点控制后，当窗口弹出，用户可以直接输入内容
            var $inputArr = this.$dialog.find("input, textarea, select").not("input[type='button']"),
                $buttonArr = this.$dialog.find("input[type='button'], input[type='submit'], button, a");

            //先判断是否有表单，先聚焦表单
            setTimeout(function(){
                 $inputArr.length ? $inputArr[0].focus() : ($buttonArr[0] && $buttonArr[0].focus());
            }, 0);

            //返回本身
            return this;
        },

        //hide dialog
        close: function(){
            this.$main.hide();
            return this;
        },

        //remove dialog
        remove: function(){
            this.$main.remove();
            delete $.dialog.list[this.id];

            //移除后触发的事件
            if (this.options.onremove) {
                this.options.onremove();
            };

            return this;
        },

        //button定义，arg
        setButton: function(args){
            args = args || [];
            var that = this;
            var html = '';
            var number = 0;
            this.callbacks = {};
            
            if (typeof args === 'string') {
                html = args;
                number ++;
            } else {
                $.each(args, function (i, val) {

                    var id = val.id = val.id || val.value;
                    var style = '';
                    that.callbacks[id] = val.callback;

                    if (val.display === false) {
                        style = ' style="display:none"';
                    } else {
                        number ++;
                    }

                    html +=
                      '<button'
                    + ' type="button"'
                    + ' class="btn"'
                    + ' i-id="' + id + '"'
                    + style
                    + (val.disabled ? ' disabled' : '')
                    + (val.autofocus ? ' autofocus class="ui-dialog-autofocus"' : '')
                    + '>'
                    + val.value
                    + '</button>';

                    that.$buttonBox
                    .on('click', '[i-id=' + id +']', function (e) {                
                        var $this = $(this);
                        if (!$this.attr('disabled')) {
                            // IE BUG
                            that._trigger(id);
                        }
                        e.preventDefault();
                    });

                });
            }

            this.$buttonBox.html(html);
            return this;
        },

        setTitle: function(str){
            this.$main.find(".d-title").text(str);
            return this;
        },

        setBtnTarget: function($target){
            this.buttonTarget = $target;
            return this;
        },

        focus: function(){

        },

        blur: function(){

        },

        // 触发按钮回调函数
        _trigger: function (id) {
            var fn = this.callbacks[id];
                
            return typeof fn !== 'function' || fn.call(this) !== false ?
                this.close().remove() : this;
        }
    });
    
    //将dialog的实例挂载到$上
    $.dialog = function(options){
        var id = Dialog.DEFAULTS.id;
        if (options.id) { id = options.id };
        return $.dialog.list[id] = new Dialog(options);
    }

    //通过get获取dialog
    $.dialog.list = {};
    $.dialog.get = function(id){
        return id === undefined ? $.dialog.list : $.dialog.list[id];
    };

    //extend
    $.tips = function(c, callback){
        var tip = $.dialog({
            title: "提示",
            content: c,
            cancel: function(){},
            cancelValue: "关闭",
            onremove: function(){
                if (callback) {callback()};
            }
        });

        tip.show();
    }

}));
