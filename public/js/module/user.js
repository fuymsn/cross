/*
 * @ description User用户
 * @ type Class
 * @ return null
 */
(function(__User, window){

    //user实例化
    var instanceUser;
    var cap = new Captcha();

    __User = function(){

        /*
         * @ description 设置注册提示颜色
         * @ type 特权方法
         * @ param str
         * @ return null
         */
        this.setRegErrorTips = function(str){
            $(".rTip").text(str).css("color", "#c1111c");
        }

        /*
         * @ description 设置登录提示颜色
         * @ type 特权方法
         * @ param str
         * @ return null
         */
        this.setLoginErrorTips = function(str){
            $(".lTip").text(str).css("color", "#c1111c");
        }

        /*
         * @ description 用户注册
         * @ type function
         * @ param option: 按钮
         * @ return null
         */
        this.submitR = function(option, sucCallback){

            var that = this;

            var $regName = $("#rName"),
                $regNickname = $("#rNickname"),
                $regPwd = $("#rPassword"),
                $regPwdAgain = $("#rAPassword"),
                $regScode = $("#rsCodeIpt");

            $(option).off("click");
            $(option).on("click", function() {

                //用户邮箱验证
                if ($regName.val().length == 0) {
                    that.setRegErrorTips("请输入登录邮箱！");
                    return;
                }else if(!Validation.isEmail($regName.val())){
                    that.setRegErrorTips("邮箱格式不正确，且注册邮箱不能使用中文/:;\\空格，等特殊符号！");
                    return;
                };

                //用户昵称验证
                if ($regNickname.val().length == 0) {
                    that.setRegErrorTips("请输入昵称！");
                    return;
                }else if(!Validation.isAccount($regNickname.val())){
                    that.setRegErrorTips("注册昵称不能使用/:;\\空格,等特殊符号！(2-8位的昵称)");
                    return;
                };

                //用户密码不能为空验证
                if ($regPwd.val().length == 0) {
                    that.setRegErrorTips("请输入密码！");
                    return;
                };

                //用户再次输入密码不能为空验证
                if ($regPwdAgain.val().length == 0) {
                    that.setRegErrorTips("请输入确认密码！");
                    return;
                };

                //用户两次确认密码不能相同
                if ($regPwd.val().length != 0 && $regPwdAgain.val().length != 0 && $regPwd.val() != $regPwdAgain.val()) {
                    that.setRegErrorTips("两次密码输入不同！");
                    return;
                };

                //用户security code验证
                if ($regScode.val().length == 0) {
                    that.setRegErrorTips("请输入验证码！");
                    return;
                };

                var pw = $.trim($regPwd.val());
                var rpw = $.trim($regPwdAgain.val());

                UserService.actionRegister({
                    username: $regName.val(),
                    nickname: $regNickname.val(),
                    password: pw,
                    repassword: rpw,
                    captcha: $regScode.val(),
                    sucCallback: function(res){
                        if (window.IFRAME_LOGIN_STATE) {IFRAME_LOGIN_STATE.regSuc();};
                        //window.location.reload();

                        if (sucCallback) { sucCallback(); };
                    },
                    errCallback: function(res){
                        that.setRegErrorTips(res.msg);
                        cap.flashCaptcha($("#rsCodeImg"));
                        Utility.log(res.msg);
                    }
                });


            });

            $("#rsCodeIpt, #rAPassword, #rPassword, #uid, #rName").on("keydown", function(e){
                if (e.keyCode == "13") {
                    $(option).trigger("click");
                };
            });
        }

        /*
         * @ description 用户登录(跨域登录)
         * @ type function
         * @ param option: 按钮
         * @ return null
         */
        this.submitL = function(option){

            var that = this;

            var $loginName = $("#lName"),
                $loginPwd = $("#lPassword"),
                $loginScode = $("#lsCodeIpt"),
                $loginAuto = $("#lAuto");

            $(option).off("click");
            $(option).on("click", function() {

                if ($.trim($loginName.val()).length == 0) {
                    that.setLoginErrorTips("请输入登录邮箱！");
                    return;
                };

                if ($.trim($loginPwd.val()).length == 0) {
                    that.setLoginErrorTips("请输入登录密码！");
                    return;
                };

                if (!$loginScode.is(":hidden") && $.trim($loginScode.val()).length == 0) {
                    that.setLoginErrorTips("请输入验证码！");
                    return;
                };

                var pw = $.trim($loginPwd.val());

                //登录接口调用
                UserService.actionLogin({
                    username: $loginName.val(),
                    password: pw,
                    captcha: $loginScode.val(),
                    remember: $loginAuto.prop('checked') ? 1 : 0,
                    sucCallback: function(res){
                        if (window.IFRAME_LOGIN_STATE) {IFRAME_LOGIN_STATE.loginSuc();};
                        window.location.reload();
                    },
                    errCallback: function(res){
                        //提示错误信息
                        that.setLoginErrorTips(res.msg);

                        $loginName.afterIcon(vcIconWarnTMP);
                        $loginPwd.afterIcon(vcIconWarnTMP);
                        
                        //刷新code
                        cap.flashCaptcha($("#lsCodeImg"));
                        //隐藏code
                        if (res.failNums >= 5) {
                            $(".login-code").show();
                        };

                        Utility.log(res.msg);
                    }
                });


            });

            $("#lsCodeIpt, #lPassword, #lName").on("keydown", function(e){
                if (e.keyCode == "13") {
                    $(option).trigger("click");
                };
            });
        }

        /*
         * @ description 用户登录成功
         * @ type function
         * @ param data 登录成功时返回的数据 func: 回调
         * @ return null
         */
        this.handleLoginSuccess = function(data, func){

            var dataInfo = data.info;

            var loginTmp = ['<div class="inx-banner-login" id="inx-banner-login">',
                    '<div class="loginImg">',
                        '<img src="#{headimg}" alt="" width="130" height="130" />',
                        '#{userState}',
                    '</div>',
                    '<ul class="loginAlready">',

                        '<li class="loginName clearfix">',
                            '<span class="loginNameIn">#{nickname}</span>',
                            '<span class="loginHostId">#{hostId}</span>',
                        '</li>',
                        '<li class="loginInfo">',
                            '<span class="loginPoints">',
                                '<span class="loginDiamond"></span>',
                                '<span class="hz">#{points}</span>',
                            '</span>',
                            '#{badge}',
                            '<span class="hotListImg basicLevel#{lv_rich}"></span>',
                            '#{mark}',
                        '</li>',
                        '<li class="buttonGrp">',
                            '<a class="buttonGrp-item" href="/member/msglist">消息 <span class="fred">#{mails}</span></a>',
                            '<span class="displayBtnGrp buttonGrp-item">',
                                '<a class="" href="/member/index">个人中心</a>',
                                '<ul>',
                                    '<li>',
                                        '<a  target="_blank" href="/member/index">基本信息</a>',
                                    '</li>',
                                    '#{live}',
                                    '<li>',
                                        '<a target="_blank" href="/member/attention">我的关注</a>',
                                    '</li>',
                                    '<li>',
                                        '<a target="_blank" href="/member/scene">我的道具</a>',
                                    '</li>',
                                    '<li>',
                                        '<a target="_blank" href="/member/consumerd">消费记录</a>',
                                    '</li>',
                                    '<li>',
                                        '<a target="_blank" href="/member/password">密码管理</a>',
                                    '</li>',
                                    '<li>',
                                        '<a target="_blank" href="/member/myReservation">一对一约会</a>',
                                    '</li>',
                                    '<li>',
                                        '<a href="/logout">退&nbsp;&nbsp;&nbsp;&nbsp;出</a>',
                                    '</li>',
                                '</ul>',
                            '</span>',
                            '<a href="/charge/order" class="buttonGrp-item" target="_blank">充值</a>',
                            '<a href="/about/help" class="buttonGrp-item">帮助</a>',
                            '<a href="/logout" class="buttonGrp-item bn">退出</a>',
                        '</li>',
                    '</ul>',
                    '<div class="loginMail"><span>您还没有完成安全邮箱验证，请<a href="/mailverific" target="_blank">立即验证</a>。</span></div>',
                '</div>'].join("");

            //清空登录状态
            $("#inx-banner-login").html("");

            //登录成功数据组装(主播和非主播的区别)
            if (dataInfo.roled == 3) {
                dataInfo.hostId = '(主播ID：' + dataInfo.uid + ')';
                dataInfo.live = '<li><a target="_blank" href="' + window.V_PATH + '/' + dataInfo.rid + '">我要直播</a></li>';
                dataInfo.mark = '<span class="hotListImg AnchorLevel' + dataInfo.lv_exp + '"></span>';
            }else{
                dataInfo.hostId = '';
                dataInfo.live = '';
                dataInfo.mark = '';
            };

            //头部消息数目处理
            var mailNum = parseInt(dataInfo.mails, 10);

            if (!mailNum) {
                dataInfo.mails = "";
            }else if(mailNum && mailNum == 99){
                dataInfo.mails = "(" + dataInfo.mails + "+)";
            }else{
                dataInfo.mails = "(" + dataInfo.mails + ")";
            };

            //头部处理徽章
            dataInfo.badge = (parseInt(dataInfo["vip"], 10) == 0) ? (dataInfo["icon_id"] == 0) ? "" : '<span class="loginBadge badge badge' + dataInfo["icon_id"] + '"></span>' : '<a href="/member/vip" title="进入个人中心查看保级信息" target="_blank" class="hotListImg basicLevel'+dataInfo["vip"]+'"></a>';

            //头部隐身处理
            if (typeof dataInfo.hidden != "undefined") {

                //用户在线状态值
                var hiddenText = parseInt(dataInfo.hidden, 10) ? "隐身" : "在线";
                var hiddenClassState = parseInt(dataInfo.hidden, 10) ? "dropdown-title-hidden": "dropdown-title-online";

                //用户在线状态下拉菜单列表
                dataInfo.userState = ["<div class='loginDropdown dropdown' id='loginDropdown'>",
                    "<div class='dropdown-title " + hiddenClassState + "'><div class='dropdown-title-text'>"+ hiddenText +"</div><span class='dropdown-tri'></span></div>",
                    "<div class='dropdown-list'>",
                        "<div class='dropdown-item' id='loginOnline' data-value='0'>在线</div>",
                        "<div class='dropdown-item' id='loginHide' data-value='1'>隐身</div>",
                    "</div></div>"].join("");
            };

            //dataInfo.badge = (dataInfo["icon_id"] == 0) ? "" : '<span class="loginBadge"><img style="width: 27px;height: 28px; margin: 0 3px;" src="/flash/image/gift_material/'+dataInfo["icon_id"]+'.png" /></span>';
            var tmp = Utility.template(loginTmp, dataInfo);

            $("#headerInner").append(tmp);
            $(".headlogin").hide();

            //将UID赋值到User上
            __User.UID = dataInfo.uid;
            //user level
            __User.UL = parseInt(dataInfo.lv_rich, 10);

            //执行回调
            if (func) { func(data) };

        }
    }

    //静态属性和方法
    $.extend(__User, {

        UID: $.cookie("webuid"),

        //登录弹窗
        loginDialog : $.dialog({
            id: "loginDialog",
            title: false,
            content: ['<div class="J-dialog-tab J-tab">',
                '<ul class="tab-title J-tab-menu clearfix" style="list-style: none;">',
                    '<li class="tab-item active" id="dialogLogin">',
                        '<span>用户登录</span>',
                    '</li>',
                    '<li class="tab-item" id="dialogRegister">',
                        '<span>用户注册</span>',
                    '</li>',
                '</ul>',

                '<div class="J-tab-main active">',
                    '<div class="m-form-wrapper">',
                        '<form action="" class="lForm m-form" onSubmit="return false">',

                            '<div class="m-form-item">',
                                '<label for="lName">登录邮箱：</label>',
                                '<input type="text" class="txt" id="lName" tabIndex="1" placeholder="您的登录邮箱" />',
                            '</div>',
                            '<div class="m-form-item">',
                                '<label for="lPassword">登录密码：</label>',
                                '<input type="password" class="txt" id="lPassword" tabIndex="2" autocomplete="off" placeholder="您的密码"/>',
                            '</div>',

                            '<div class="m-form-item login-code">',
                                '<label for="lsCodeIpt">验&nbsp;&nbsp;证&nbsp;&nbsp;码：</label>',
                                '<input type="text" class="txt txt-short" id="lsCodeIpt" tabIndex="3" placeholder="不区分大小写"/>',
                                '<img src="" alt="验证码" id="lsCodeImg" class="s-code-img" />',
                                '<a href="javascript:void(0);" class="m-form-tip J-change-scode">换一换</a>',
                            '</div>',

                            '<div class="m-form-item clearfix">',
                                '<label for="lAuto" class="login-auto">',
                                    '<input type="checkbox" id="lAuto" class="login-checkbox" />',
                                    '<span>7天免登录</span>',
                                '</label>',
                                '<a href="/getpwd" target="_blank" class="forget-pw" title="忘记密码怎么办？点我">',
                                    '<span>忘记密码</span>',
                                    '<span class="i-vc i-vc-help"></span>',
                                '</a>',
                            '</div>',
                            '<div class="lTip"></div>',
                        '</form>',
                    '</div>',
                    '<div class="m-form-btnbox clearfix">',
                        '<button class="btn lButton btn-left" tabIndex="4">登 录</button>',
                        '<button class="btn rButtonSwitch btn-orange btn-right" tabIndex="5">注 册</button>',
                    '</div>',

                '</div>',
                '<div class="J-tab-main">',
                    '<div class="m-form-wrapper">',
                        '<form action="" class="rForm m-form" onSubmit="return false">',
                            '<div class="m-form-item">',
                                '<label for="rName">登录邮箱：</label>',
                                '<input type="text" class="txt" id="rName" tabIndex="1" placeholder="填写您的邮箱地址"/>',
                            '</div>',
                            '<div class="m-form-item">',
                                '<label for="rNickname">您的昵称：</label>',
                                '<input type="text" class="txt" maxlength="16" id="rNickname" tabIndex="2" placeholder="2-8位汉字、数字或字母组成"/>',
                            '</div>',
                            '<div class="m-form-item">',
                                '<label for="rPassword">登录密码：</label>',
                                '<input type="password" class="txt" id="rPassword" tabIndex="3" autocomplete="off" placeholder="6-22个字母和数字组成"/>',
                            '</div>',
                            '<div class="m-form-item">',
                                '<label for="rAPassword">确认密码：</label>',
                                '<input type="password" class="txt" id="rAPassword" tabIndex="4" autocomplete="off"/>',
                            '</div>',
                            '<div class="m-form-item">',
                                '<label for="rsCodeIpt">验&nbsp;&nbsp;证&nbsp;&nbsp;码：</label>',
                                '<input type="text" class="txt txt-short" id="rsCodeIpt" tabIndex="5" placeholder="不区分大小写"/>',
                                '<img src="" alt="验证码" id="rsCodeImg" class="s-code-img" />',
                                '<a href="javascript:void(0);" class="m-form-tip J-change-scode">换一换</a>',
                            '</div>',
                            '<span class="rTip"></span>',
                        '</form>',
                    '</div>',
                    '<div class="m-form-btnbox">',
                        '<button class="btn btn-register rButton" tabIndex="6">立即注册，马上去看</button>',
                    '</div>',
                '</div>',
            '</div>'].join(""),

            onshow: function(){

                //面板内部登录，注册切换
                $("#dialogLogin, #dialogRegister").on("click", function(e){
                    if (e.currentTarget.id == "dialogLogin") {
                        cap.flashCaptcha($("#lsCodeImg"));
                    }else if(e.currentTarget.id == "dialogRegister"){
                        cap.flashCaptcha($("#rsCodeImg"));
                    };
                });

                //从登录面板跳转到注册面板
                $(".rButtonSwitch").on("click", function(){
                    $("#dialogRegister").trigger("click");
                });

                //登录和注册tab切换绑定事件
                tabSwitch($(".J-dialog-tab"));

                //绑定刷新验证码按钮
                cap.bindChangeCaptcha();

                //登录
                $('#lName').accountInput(".lTip");
                $('#lPassword').passwordInput('.lTip');
                $("#lsCodeIpt").sCodeInput(".lTip");

                //注册
                $('#rName').accountInput(".rTip");
                $('#rNickname').isNickname('.rTip');
                $('#rPassword').passwordInput('.rTip');
                $("#rsCodeIpt").sCodeInput(".rTip");
                //调用重复密码验证
                $('#rAPassword').passwordAgain('#rPassword','.rTip');

                //注册事件
                instanceUser.submitR('.rButton', function(){
                    window.location.reload();
                });

                //登录事件
                instanceUser.submitL('.lButton');
            }
        }),
        /*
         * @ description 返回是否有过链接状态，用于7天免登录
         * @ type 静态方法
         * @ param null
         * @ return bool
         */
        isConnection: function(){
            return !!$.cookie("webuid") || !!$.cookie("v_remember_encrypt") || !!$.cookie("PHPSESSID");
        },

        /*
         * @ description 返回是否登录
         * @ type 静态方法
         * @ param null
         * @ return bool
         */
        isLogin: function(){
            return this.UID ? true : false;
        },

        /*
         * @ description 处理登录弹窗
         * @ type 静态方法
         * @ param u: User的实例 func: 回调
         * @ return bool
         */
        handleLoginDialog: function(u, func){

            instanceUser = u;

            $(".headlogin").show();

            //直接启动面板
            $(".login, .register").on("click", function(e){
                __User.showLoginDialog();
                if ($(e.currentTarget).hasClass("login")) {
                    $("#dialogLogin").trigger("click");
                }else if($(e.currentTarget).hasClass("register")){
                    $("#dialogRegister").trigger("click");
                };
            });

            if (func) { func() };

        },

        /**
         * 显示登录窗口
         * @type {[type]}
         */
        showLoginDialog: function(){
            this.loginDialog.show();
        },

        /**
         * 显示注册窗口
         * @type {[type]}
         */

        showRegDialog: function(){
            this.loginDialog.show();
            $("#dialogRegister").trigger("click");
        }
    });

    window.User = __User;

})(typeof User !== "undefined" ? User : {}, window);