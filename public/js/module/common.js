$(function(){

    //tabswitch
    tabSwitch();

    //初始化header info
    if ($("#livePage").length == 0) {
        loginInfoInit();
    };

});

/**
 * @description J-tab 列表切换初始化
 * @author Peter
 * @param: null
 */
var tabSwitch = function($btn, callback){

    if(arguments.length == 0){
        var $btn = $("body");
    }

    $btn.find('.J-tab-menu li:not(.close)').on("click", function() {
        var $tab = $(this).closest(".J-tab");
        $(this).parent().children('li').removeClass('active');
        $(this).addClass('active');
        var tabMain = $tab.find('.J-tab-main');
        tabMain.removeClass('active');
        tabMain.eq($(this).index()).addClass('active');
        if (callback) {callback();};
    });

}

/**
 * @description 时间比较 -- start时间是否超过end时间
 * @author Young
 * @param: null
 */
var timeComparing = function(id){
    var $box = $("#" + id),
        $startTime = $box.find(".J-start"),
        $endTime = $box.find(".J-end"),
        $form = $box.find(".btn");

    var startVal = $startTime.val();
    var endVal = $endTime.val();

    var day1 = new Date(startVal.replace(/-/g,"/"));
    var day2 = new Date(endVal.replace(/-/g,"/"));
    var m = (day2.getTime() - day1.getTime())/(1000*60*60*24);

    if (m < 0) {
        $.tips("请输入正确的时间起始点。");
        return false;
    }else{
        $box.submit();
    }
}

/**
 * @description 简易字符串计数器，以后将做修改 // todo
 * @author Young
 * @param: null
 */
var wordsCount = function(input, tips, num){
    $(input).on('keydown keyup blur mousecenter mouseleave mousemove',function(){
        var len = $(this).val().length || 0,
            chrLen = num - len;
        tips && $(tips).text(chrLen > 0 ? chrLen : 0);
        if(chrLen < 0){
            $(this).val($(this).val().substring(0, num))
            return false;
        }
    });
}


/**
 * @description 用户相关验证
 * @author Peter
 * @param:
 */
$.fn.extend({

    /*清除input同级的提示icon*/
    removeVCIcon: function(){
        return this.each(function(){
            var $this = $(this);
            $this.siblings(".i-vc").remove();
        });
    },

    /*验证后面添加icon方法*/
    afterIcon: function(tmp) {
        return this.each(function() {
            $(this).removeVCIcon();
            $(this).after(tmp);
        });
    },

    /*邮箱验证*/
    accountInput: function (tip){

        return this.each(function() {

            $(this).on("focus blur", function(e){

                var $that = $(this);
                var val = $that.val()
                if (val.length == 0) {
                    $(tip).html("请输入您的邮箱！").css({"color":"#29a2ff"});
                    $that.afterIcon(vcIconInfoTMP);
                };

            }).on("keyup", function(){

                var $that = $(this);
                var val = $.trim($that.val());

                if (val.length == 0) {
                    return;
                }else{

                    if(val.length < 6 ){
                        $(tip).html("您的邮箱地址过短！").css("color", "#c1111c");
                        $that.afterIcon(vcIconWarnTMP);
                    }else if(val.length > 30){
                        $(tip).html("您的邮箱地址过长！").css("color", "#c1111c");
                        $that.afterIcon(vcIconWarnTMP);
                    }else if(!Validation.isEmail(val)){
                        $(tip).html("您的邮箱格式不正确！").css("color", "#c1111c");
                        $that.afterIcon(vcIconWarnTMP);
                    }else{

                        if( tip == '.rTip'){
                            $.ajax({
                                url: '/verfiyName',
                                type: 'GET',
                                dataType: 'json',
                                data:{
                                    type: 'username',
                                    username: val
                                },
                                success:function(res){
                                    if(res.data == 0){
                                        $(tip).html(res.msg).css("color", "#c1111c");
                                        $that.afterIcon(vcIconWarnTMP);
                                    }else{
                                        $(tip).html("");
                                        $that.afterIcon(vcIconCorrectTMP);
                                    }
                                }
                            });
                        }else{
                            $(tip).html("");
                            $that.afterIcon(vcIconCorrectTMP);
                        }
                    }
                }
            });
        });
    },

    //昵称验证
    isNickname: function(tip){
        return this.each(function(){

            $(this).on("focus blur", function(){
                var $that = $(this);
                var val = $that.val();
                if (val.length == 0) {
                    $(tip).html("请输入昵称！").css({"color":"#29a2ff"});
                    $that.afterIcon(vcIconInfoTMP);
                };
            });

            $(this).on("keyup", function(){

                var $that = $(this);
                var val = $.trim($that.val());

                if (val.length == 0) {
                    return;
                }else if(!Validation.isAccount($that.val())){
                    $(tip).html("注册昵称不能使用/:;\\空格,等特殊符号！(2-8位的昵称)").css("color", "#c1111c");
                    $that.afterIcon(vcIconWarnTMP);
                }else{
                    $.ajax({
                        url: '/verfiyName',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'nickname',
                            username: val
                        },
                        success: function(res){
                            if(res.data == 0){
                                $(tip).html(res.msg).css("color", "#c1111c");
                                $that.afterIcon(vcIconWarnTMP);
                            }else{
                                $(tip).html("昵称格式输入正确！").css("color", "#29a2ff");
                                $that.afterIcon(vcIconCorrectTMP);
                            }
                        }
                    });
                }

            });
        });
    },

    /*密码验证*/
    passwordInput: function (tip){

        return this.each(function (){

            var $that = $(this);

            $that.on("focus blur", function (){
                var val = $.trim($that.val());
                if (val.length == 0) {
                    $(tip).html("请输入您的密码！").css("color", "#29a2ff");
                    $that.afterIcon(vcIconInfoTMP);
                };
            });

            $that.on("keyup", function (){
                var val = $that.val();
                var pwReg = /^[0-9a-zA-Z]{6,22}$/;
                if (val.length == 0){
                    $(tip).html("请输入您的密码！").css("color", "#c1111c");
                    $that.afterIcon(vcIconWarnTMP);
                }else if (!pwReg.test(val)){
                    $(tip).html("密码格式错误！").css("color", "#c1111c");
                    $that.afterIcon(vcIconWarnTMP);
                }else{
                    $(tip).html("");
                    $that.afterIcon(vcIconCorrectTMP);
                }
            });

        });

    },

    //验证码验证
    sCodeInput: function (tip){

        return this.each(function (){

            var $that = $(this);

            $that.on("focus blur", function (){
                var val = $.trim($that.val());
                if (val.length == 0) {
                    $(tip).html("请输入验证码！").css("color", "#29a2ff");
                };
            });

            $that.on("keyup", function (){
                var pw = $(this).val();
                var codeReg = /^[a-zA-Z0-9]{4}$/;
                if (pw.length == 0){
                    $(tip).html("您的验证码不能为空！").css("color", "#c1111c");
                }else if(!codeReg.test(pw)){
                    $(tip).html("请输入4位由数字或字母组成的验证码！").css("color", "#c1111c");
                }else{
                    $(tip).html("");
                }
            });

        });
    },

    //重复密码验证方法
    passwordAgain: function(originalPwd, tip){
        return this.each(function(){
            var $that = $(this);

            $that.on("focus blur", function() {
                var oVal = $that.val();
                if (oVal.length == 0) {
                    $(tip).html("请输入确认密码！").css("color", "#29a2ff");
                    $that.afterIcon(vcIconInfoTMP);
                };
            });

            $that.on("keyup", function(){
                var pVal = $(originalPwd).val();
                var oVal = $that.val();

                if(pVal === oVal){
                    if (pVal == "") {
                        $(tip).html('确认密码不能为空').css("color", "#c1111c");
                        $that.afterIcon(vcIconWarnTMP);
                    }else{
                        $(tip).html('');
                        $that.afterIcon(vcIconCorrectTMP);
                    };
                }else{
                    $(tip).html('两次密码输入不同').css("color", "#c1111c");
                    $that.afterIcon(vcIconWarnTMP);
                }
            });
        });
    }

});

//验证设置icon图标
var vcIconCorrectTMP = '<span class="i-vc i-vc-correct"></span>';
var vcIconWarnTMP = '<span class="i-vc i-vc-warn"></span>';
var vcIconInfoTMP = '<span class="i-vc i-vc-info"></span>';

/**
 * @description 简易URL分析，已知key，获取value
 * @author: Young
 * @param: String value值
 */
var getLocation = function(p){
    var reg = new RegExp("(^|&)" + p + "=([^&]*)(&|$)");
    var get = parent.location.search.substr(1).match(reg);
    return get!= null ? decodeURIComponent(get[2]) : '';
}


/**
 * @description 第二邮箱验证绑定
 * @author: Young
 * @param: null
 */
var secMailCheck = function(){
    var $close = $(".mail-check-close");
    var $link = $(".mail-check-reg");

    $close.on("click", function(){
        $(".mail-check-wrap").hide();
    });

    $link.on("click", function(){
        $(".mail-check-wrap").hide();
    });
}

/**
 * @description 首页四种类型视频列表item组装
 * @author Young
 * @param arr: 每一项的列表数组, url: 视频path(不接roomid):
 */
var renderItem = function(arr){

    var tmp = "",
        url = window.V_PATH + "/";

    for (var i = 0; i < arr.length; i++) {
        var data = arr[i];

        //数据容错过滤
        if (typeof data !== "object" || data === null) {
            continue;
        };

        if(data['live_time']){
            if ( data['live_time'].indexOf("时") > -1 ) {
                var index = data['live_time'].indexOf("钟");
                if (index > -1) {
                    data['live_time'] = data['live_time'].substring(0, index + 1);
                };

            };
            data['live_time'] = data['live_time'].replace(/([0-9]+)/g, function(s){
                return '<span>'+s+'</span>';
            });
        }

        data['lv_type'] ? data['lv_type'] : data['lv_type'] = 1;

        switch(data['lv_type']){
            case 1:
                data.lvType = "<span class='lvtype lvtype1'></span>";
                break;
            case 2:
                data.lvType = "<span class='lvtype lvtype2'></span>";
                break;
            case 3:
                data.lvType = "<span class='lvtype lvtype3'></span>";
                break;
            default:
                data.lvType = "<span class='lvtype lvtype1'></span>";
        }

        data["enterRoomlimit"] == 1 ? data.isLock = '<span class="limit"></span>' : data["tid"] == 2 ? data.isLock = '<span class="lock"></span>' : data.isLock = '';

        data["enterRoomlimit"] == 1 ? data.isLockTips = "该房间有限制" : data["tid"] == 2 ? data.isLockTips = "该房间需要密码才能进入" : data.isLockTips = "";

        data["tid"] == 2 ? data.videoPath = 'href="javascript:;"' : data.videoPath = 'href="'+ (url + data['rid']) +'" target="_blank"';

        switch(data.live_status){
            case 0:
                data.status_color = "free";
                data.status_title = "休息";
                break;
            case 1:
                data.status_color = "live";
                data.status_title = "直播";
                break;
            case 2:
                data.status_color = "hot";
                data.status_title = "热播";
                break;
            default:
                data.status_color = "free";
                data.status_title = "休息";
        }

        (data['new_user'] && data['new_user'] == 800000) ? data.isNewUser = '<div class="badge badge800000"></div>' : data.isNewUser = '';

        data['headimg'] = /\d{13}/.test(data['headimg']) ? (window.PIC_PATH + "/images/anchorimg/" + data["uid"] + "_" + data['headimg'].match(/\d{13}/)[0] + ".jpg") : window.PIC_PATH + '/images/vzhubo.jpg';

        tmp += '<dl class="movieList" title="'+ data.isLockTips +'" data-tid="'+ data.tid +'" data-roomid="' + data.rid + '" data-isLimited="'+ data.enterRoomlimit +'">'+
            '<dt><a '+ data.videoPath +' class="movieBlock">'+
            '<img src="'+ data['headimg']+'" alt=""/>'+
            '<div class="status ' + data.status_color + '">'+ data.status_title +'</div>'+ data.isNewUser +'<div class="play">'+
            '</div></a></dt>'+
            '<dd class="title">'+
                data.lvType +
                '<a '+ data.videoPath +'>'+ data['username']+'</a>' +
                data.isLock +
            '</dd>'+
            '<dd class="smallTitle"><div class="time">'+
            '<div class="time-ico"></div>'+(data['live_time']=='null'?'':data['live_time'])+'</div>'+
            //'<div class="person"><div class="person-ico"></div><span>'+ data['total']+'</span></div></dd>'+
        '</dl>';
    };

    return tmp;
}

/**
 * @description 首页四种类型视频列表item组装
 * @author Young
 * @param arr: 每一项的列表数组, url: 视频path(不接roomid):
 */
var renderOrdItem = function(arr){

    var tmp = "",
        url = window.V_PATH + "/",
        roomType = 'ordRoom'; //房间列表类型，默认一对一房间

    for (var i = 0; i < arr.length; i++) {
        var data = arr[i];
        if( data['starttime'] && data['starttime'].indexOf(" ") > -1 ){

            var dateNum = data['starttime'].split(" ")[0];
            var date = parseInt(dateNum.split("-")[0], 10) + "月" + parseInt(dateNum.split("-")[1], 10) + "日";
            var time = data['starttime'].split(" ")[1];
            data.sTime = date + " " + time;
        }

        switch(data['lv_type']){
            case 1:
                data.lvType = "<span class='lvtype lvtype1'></span>";
                break;
            case 2:
                data.lvType = "<span class='lvtype lvtype2'></span>";
                break;
            case 3:
                data.lvType = "<span class='lvtype lvtype3'></span>";
                break;
            default:
                data.lvType = "<span class='lvtype lvtype1'></span>";
        }

        data.videoPath = 'href="javascript:;"';

        data['headimg'] = /\d{13}/.test(data['headimg']) ? (window.PIC_PATH + "/images/anchorimg/" + data["uid"] + "_" + data['headimg'].match(/\d{13}/)[0] + ".jpg") : window.PIC_PATH + '/images/vzhubo.jpg';

        data['new_user'] == 0 ? data.isNewUser = '': data.isNewUser = '<div class="badge badge800000"></div>';

        switch(Number(data['appoint_state'])){
            case 1:
                data.btnReserve = '<span class="btn btn-xs btn-reserve">立即预约</span>';
                break;
            case 2:
                data.btnReserve = '<span class="btn btn-xs btn-reserve btn-disabled" >正在约会</span>';
                break;
            case 3:
                data.btnReserve = '<span class="btn btn-xs btn-reserve btn-disabled" >已被预约</span>';
                break;
            default:
                data.btnReserve = '<span class="btn btn-xs btn-reserve">立即预约</span>';
        }
        // 判断我的预约
        if('undefined' != typeof data['listType'] && data['listType'] == 'myres') {
            data.videoPath = 'href="'+ (url + data['uid']) +'" target="_blank"';
            data.btnReserve = '<a '+ data.videoPath +'><span class="btn btn-xs btn-reserve">进入房间</span></a>';
            roomType = "";
        }

        tmp += '<dl class="movieList '+ roomType +'" data-appointstate="'+ data['appoint_state'] +'" data-duration="'+ data["live_duration"] +'" data-points="'+ data["points"]+'" data-starttime="'+ data.sTime +'" data-roomid="'+data.id+'">'+
            '<dt><a '+ data.videoPath +' class="movieBlock">'+
            '<img src="'+ data['headimg']+'" alt=""/>'+
            '<div class="play">'+
            '</div>'+ data.isNewUser + '</a></dt>'+
            '<dd class="title">'+
                data.lvType +
                '<a '+ data.videoPath +'>'+ data['username']+'</a>' +
            '</dd>'+
            '<dd class="smallTitle">'+
                '<span>' + data.points + "钻 (" + data['live_duration'] + ')</span>'+
                data.btnReserve +
            '</dd>'+
        '</dl>';
    };

    return tmp;
}

/**
 * @description 预约房间接口
 * @author Young
 * @param rid 房间id
 */
var reserveRoom = function(rid){
    $.ajax({
        url: "/member/doReservation",
        dataType: "json",
        type: "GET",
        data: { duroomid: rid, flag: false },
        success: function(res){
            //预约成功
            if (res.code == 1) {
                $.tips("预约成功");
            //预约不成功
            }else if(res.code == 407){
                $.dialog({
                    title: "预约房间",
                    content: "在同时间段您已经预约了其它房间，确定预约相同时间段的本房间吗？",
                    ok: function(){
                        //重发ajax
                        $.ajax({
                            url: "/member/doReservation",
                            dataType: "json",
                            type: "GET",
                            //确定预约，将flag设置为true
                            data: { duroomid: rid, flag: true },
                            success: function(res){
                                if (res.code == 1) {
                                    $.tips("预约成功");
                                }else{
                                    $.tips(res.msg);
                                };
                            },
                            error: function(res, text){
                                $.tips("server error!");
                            }
                        });
                    },
                    okValue: "确定",
                    cancel: function(){},
                    cancelValue: "取消"
                }).show();

            //没有登录
            }else{
                $.tips(res.msg, function(){
                    location.href = "/?handle=reg";
                });
            };
        },
        error: function(res, text){
            $.tips("server error!");
        }
    });
}

/**
 * @description option循环列表
 * @author Young
 * @param obj: startNum开始数字 endNum结束数字 interval间隔 isPlusZero个位数前面是否加零
 */
var loopOptions = function(obj){

    var OPTIONS = {
        startNum: 0,
        endNum: 60,
        interval: 1,
        isPlusZero: true
    }

    var option = $.extend(true, OPTIONS, obj);

    var selectOptions = "";

    for (var i = option.startNum; i <= option.endNum; i = i + option.interval) {
        if (i < 10 && option.isPlusZero) {
            selectOptions = selectOptions + "<option>" + ("0" + i) + "</option>";
        }else{
            selectOptions = selectOptions + "<option>" + i + "</option>";
        };
    };

    return selectOptions;
}

/* 用户登录初始化 */
var loginInfoInit = function(){

    window.user = new User();

    var setLoginDialogState = function(){
        User.handleLoginDialog(user, function(){
            //设置邀请key
            var uKey = getLocation("u");
            if (uKey) {
                var ref = document.referrer;
                $.cookie("invitation_uid", uKey, 1/24);
                $.cookie("invitation_refer", ref, 1/24);
            };

            //邀请人记录
            var uAgent = getLocation("agent");
            if(uAgent){
                $.cookie("agent", uAgent, {
                    expires: 1/48,
                    domain: document.domain.replace(/^www/, "")
                });
            }

            //注册跳转弹窗处理
            var handle = getLocation("handle");
            if (handle == "reg") {
                $(".register").trigger("click");
            };
            if (handle == "login"){
                $(".login").trigger("click");
            }

        });
    }

    //检测页面登录状态
    if (User.isConnection()) {

        //如果没有登录，获取站点头部记录
        $.ajax({
            url: '/indexinfo',
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function(json){

                if (json.ret) {
                    //如果登录成功
                    user.handleLoginSuccess(json, function(data){

                        //更多页面数据
                        if ($("#index-more").length){
                            //显示按钮
                            $("#tabBtnfav").css({"display": "inline-block"});
                            $("#tabBtnres").css({"display": "inline-block"});
                        };

                        //首页和更多页面数据
                        if ($("#index").length || $("#index-more").length) {
                            //加载我的关注数据
                            var tmp = renderItem(data['myfav']);
                            $("#fav").html(tmp);
                            if (data['myfav'].length > 0) {
                                $("#inxFavBox").show();
                            };

                            //加载我的预约数据
                            var tmp = renderOrdItem(data['myres']);
                            $("#res").html(tmp);
                            if (data['myres'].length > 0) {
                                $("#inxResBox").show();
                            };
                        };

                        //首页数据
                        if ($("#index").length) {

                            //安全邮箱验证，保存是否已经弹出dialog提示状态
                            if (window.sessionStorage) {
                                var smState = sessionStorage.getItem("sm") == "1" ? true : false;

                                if (!Validation.isEmail(data.info.safemail) && !smState) {
                                    $(".mail-check-wrap").show();
                                    $(".loginMail").show();
                                    sessionStorage.setItem("sm", "1");
                                    secMailCheck();
                                }else if (!Validation.isEmail(data.info.safemail)) {
                                    $(".loginMail").show();
                                };
                            };
                        };


                        //绑定头部下拉菜单事件
                        var loginDropdown = new Dropdown({
                            id: "loginDropdown",
                            handleItem: function(target){
                                $.ajax({
                                    url: "/member/hidden/" + target.dataset.value,
                                    type: "get",
                                    dataType: "json",
                                    data: "",
                                    success: function(json){

                                        if (json.status == 1) {
                                            Utility.log("hidden set succ");

                                            var targetVal = parseInt(target.dataset.value);
                                            var $targetTitle = $("#loginDropdown").find(".dropdown-title");
                                            //0 在线，1 隐身
                                            if (targetVal == 0) {
                                                $targetTitle.addClass("dropdown-title-online").removeClass("dropdown-title-hidden");
                                            }else{
                                                $targetTitle.addClass("dropdown-title-hidden").removeClass("dropdown-title-online");
                                            };

                                        }else{
                                            Utility.log("hidden set fail");
                                        };
                                    },

                                    error: function(){
                                        Utility.log("hidden set error(500)!");
                                    }
                                });
                            }
                        });
                    });

                }else{

                    //如果登录失败，重新显示登录按钮
                    setLoginDialogState();

                    Utility.log("user login error!");

                };

                //设置下载链接
                var downloadUrl = json.downloadUrl;

                if (downloadUrl) {
                    // 当所给url不是http开头时，url前拼接当前网址的域名
                    if(downloadUrl.toLowerCase().indexOf("http") != 0) {
                        downloadUrl = document.location.protocol + "//" + document.domain + downloadUrl;
                    }
                    $("#float-box-dl").attr("href", downloadUrl);
                };

            },

            error: function(json){

                //如果登录失败，仍然再次显示登录按钮
                setLoginDialogState();

                Utility.log("server login error!");

            }

        });

    }else{

        setLoginDialogState();

    };

}
