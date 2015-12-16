(function (name, factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define(["../vendor/jquery/jquery.min.js"], factory);

    } else if (typeof module === "object" && module.exports) {

        // Node, CommonJS-like
        module.exports = factory();

    } else {

        // Browser globals (this is window)
        this[name] = factory(jQuery);

    }

}("Captcha", function ($) {

	var Captcha = function(){

		/**
		 * @description 刷新验证码flashSCode
		 * @author Young
		 * @param: image jquery对象
		 */
		this.flashCaptcha = function($img){
		    var date = (new Date()).valueOf();
		    $img.attr("src", "/verfiycode?t=" + date);
		}

		/**
		 * @description 绑定按钮刷新验证码changeSCode
		 * @author Young
		 * @param: null
		 */
		this.bindChangeCaptcha = function(){

			var that = this;

		    $(".J-change-scode").on("click", function(){
		        var $img = $(this).siblings(".s-code-img");
		        that.flashCaptcha($img);
		    });
		}

	};

	//在amd 和 cmd中暴露给当前作用域
	return Captcha;

}));