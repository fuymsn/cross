/**
 * @description 密码房间模块
 * @author Young
 */

var RoomPwd = function(){
    //this cache
    var that = this;

    var roomPwdAjax;

    var roomid = 0;

    //密码输入错误次数
    this.times = 1;
    //是否第一次请求
    this.firstTimeApply = true;

    //构造
    this.init = function(){
        //绑定click事件到movie list列表上
        $(document).on("click", ".movieList", function(){
            var tid = $(this).data("tid"),
                rid = $(this).data("roomid"),
                tmp = "";

            if (tid == 2) {

                //第一次请求获取请求次数
                if (that.firstTimeApply) {
                    
                    that.roomPwdAjaxSet({
                        data: { roomid: rid },
                        successCallback: function(res){
                            that.times = parseInt(res.times, 10);
                            that.showPwdDialog(rid);
                            that.firstTimeApply = false;
                        }
                    });

                }else{
                    that.showPwdDialog(rid);
                };

            };
        });
    }

    this.setRoomId = function(rid){
        roomid = rid;
    }

    this.getRoomId = function(){
        return roomid;
    }

    //显示dialog
    this.showPwdDialog = function(roomid){
        //输错5次密码后出现验证码
        if (that.times > 4) {
            tmp = ['<div class="m-form">',
                '<div class="m-form-item">',
                    '<label for="pwdRoom">房间密码：</label>',
                    '<input type="password" class="txt" id="pwdRoom" />',
                '</div>',
                '<div class="m-form-item">',
                    '<label for="pwdRoomCode">验证码：</label>',
                    '<input type="text" class="txt txt-short" id="pwdRoomCode" />',
                    '<img src="" alt="验证码" id="pwdRoomCodeImg" class="s-code-img" />',
                    '<a href="javascript:void(0);" class="change-roomcode m-form-tip J-change-scode">换一换</a>',
                '</div>',
                '<div class="m-form-item">',
                    '<span id="pwdRoomTips"></span>',
                '</div>',
            '</div>'].join("");
        }else{
            tmp = ['<div class="m-form">',
                '<div class="m-form-item">',
                    '<label for="pwdRoom">房间密码：</label>',
                    '<input type="password" class="txt" id="pwdRoom" />',
                '</div>',
                '<div class="m-form-item">',
                    '<span id="pwdRoomTips"></span>',
                '</div>',
            '</div>'].join("");
        };

        var pwdDialog = $.dialog({
            title: "密码房间",
            content: tmp,
            width: 400,
            onshow: function(){

                var that = this;

                //验证码
                var cap = new Captcha();

                //输入密码错误5次以上刷新验证码
                if (that.times > 4) {
                    cap.flashCaptcha($("#pwdRoomCodeImg"));
                    $(".change-roomcode").on("click", function(){
                        cap.flashCaptcha($("#pwdRoomCodeImg"));
                    });
                };

                //密码验证
                $('#pwdRoom').passwordInput('#pwdRoomTips');

                //回车键触发密码验证
                $('#pwdRoom, #pwdRoomCode').on("keyup", function(e){
                    if (e.keyCode == 13) {
                        if ($("#pwdRoomCode").length == 1 && $("#pwdRoomCode").val().length <= 0) { 
                            $("#pwdRoomTips").text("请输入验证码。");
                            return;
                        };
                        //触发ok按键
                        that.ok();
                        that.remove();
                    };
                });

            },

            ok: function(){

                //触发密码验证
                $("#pwdRoom").trigger("keyup");

                //检查密码验证错误
                if ($.trim($("#pwdRoomTips").text()).length != 0) {
                    //跳出ok方法，但是点ok不关闭弹窗
                    return false;
                };

                //验证密码
                that.roomPwdAjaxSet({
                    data: { 
                        roomid: roomid, 
                        password: $("#pwdRoom").val(), 
                        captcha: $("#pwdRoomCode").val()
                    },
                    successCallback: function(res){
                        if(res.code == 1){
                            //密码验证成功，跳转
                            location.href = window.V_PATH + "/" + roomid;
                        }else{
                            //密码验证失败
                            $.tips(res.msg);
                            that.times = parseInt(res.times, 10);
                        }
                    }
                });

            },
            okValue: "确定"
        });

        pwdDialog.show();
    }

    /**
     * @description 密码房间ajax请求
     * @author Young
     * @param obj (查阅OPTIONS)
     */
    this.roomPwdAjaxSet = function(obj){

        var OPTIONS = {
            data: {},
            successCallback: function(){}
        }

        var option = $.extend(true, OPTIONS, obj);

        //如果是本人，不弹窗
        if (option.data.roomid == User.UID) {
            location.href = window.V_PATH + "/" + User.UID;
        };

        if (roomPwdAjax && roomPwdAjax.readyState != 4) {
            roomPwdAjax.abort();
        };

        $.ajax({
            url: "/checkroompwd",
            data: option.data,
            dataType: "json",
            type: "POST",
            success: function(res){
                if (option.successCallback) {option.successCallback(res); };
            },
            error: function(res){
                $.tips("请求超时。");
            }
        });
    }

    //构造函数
    this.init();

}