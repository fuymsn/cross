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

}("UserService", function ($) {

    /**
     * @description pw编码
     * @type 私有方法
     * @author Young
     * @param string: 编码前的密码
     * @return string: 编码后的密码
     */
    var encode = function(s){
        var es = [], c='', ec='';
        s = s.split('');
        for(var i=0, length=s.length; i<length; i++){
            c = s[i];
            ec = encodeURIComponent(c);
            if(ec==c){
                ec = c.charCodeAt().toString(16);
                ec = ('00' + ec).slice(-2);
            }
            es.push(ec);
        }
        return es.join('').replace(/%/g,'').toUpperCase();
    }

    //User静态方法扩展
	var User = {

		/**
		 * 登录请求
		 * @return {[type]} [description]
		 */
		actionLogin: function(options){

            $.ajax({
                
                // url: location.origin.replace("http://v.", "http://www.") + '/login',
                // type: 'post',
                // dataType: "jsonp",
                // jsonp: "callback",
                // jsonpCallback: "cb",

                url: '/login',
                type: 'post',
                dataType: "json",

                data: {
                    "uname": options.username,
                    "password": encode(options.password),
                    "sCode": options.captcha,
                    "v_remember": options.remember,
                },

                success: function(res){
                    if(res.status == 1){
                        if (options.sucCallback) { options.sucCallback(res) };
                    } else {
                    	if (options.errCallback) { options.errCallback(res) };
                    }
                },

                error: function(res){
                    Utility.log("login server error");
                }

            });

		},

		/**
		 * 注册请求
		 * @return {[type]} [description]
		 */
		actionRegister: function(options){

            $.ajax({

                url: '/reg',
                type: 'post',
                dataType: "json",

                data:{
                    "username": options.username,
                    "nickname": options.nickname,
                    "password": encode(options.password),
                    "repassword": encode(options.repassword),
                    "sCode": options.captcha
                },

                success: function(res){
                    if(res.status == 1){
                        if (options.sucCallback) { options.sucCallback(res) };
                    } else {
                        if (options.errCallback) { options.errCallback(res) };
                    }
                },

                error: function(res){
                    Utility.log("register server error");
                }
                
            });

		}

	};

    return User;

}));