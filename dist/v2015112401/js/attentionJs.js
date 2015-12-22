var rankPanelTmp = ['<div class="personContent-top clearfix">',
        '<img class="personImg" src="#{headimg}" alt="" />',
        '<div class="per-content">',
            '<div class="per-content-title" clearfix">',
                '<span class="per-name">#{nickname}</span>',
            '</div>',
            '<div class="per-hostid">#{hostId}</div>',
            '<div class="per-icon">',
                '#{badge}',
                '<span class="hotListImg basicLevel#{lv_rich}"></span>',
                '#{richMark}',
            '</div>',
            '<div class="per-des">#{description}</div>',
        '</div>',
    '</div>',
    '<div class="personContent-middle clearfix">',
        '<span class="per-info">#{sex} | #{age} | #{starname} | #{procity}</span>',
        '#{isLive}',
        '<a href="#{space_url}" target="_blank" class="personLink">TA的空间</a>',
    '</div>',
    '<div class="personContent-bottom clearfix">',
        '<div class="per-handle">',
            '<i class="per-fav"></i><a href="javascript:void(0)" class="per-fav-btn" data-fav="" title="点击关注"><span class="per-fav-btn-title">关注</span>（<i class="per-fav-btn-num">#{attens}</i>）</a>',
        '</div>',
        '<div class="per-handle">',
            '<i class="per-msg"></i><a href="javascript:void(0)" class="displayWinBtn per-msg-btn">发私信</a>',
        '</div>',
        '<a href="#{room_url}/#{rid}" target="_blank" class="btn btn-red per-video-btn">进入房间</a>',
    '</div>'].join("");


var showMsgDialog = function(){
    
    var msgDialog = $.dialog({
        title: "发私信给",
        content: ['<div class="msg-reply">',
                    '<textarea class="textarea" name="" id="txtContent" rows="10"></textarea>',
                    '<div class="tool clearfix">',
                        '<span class="tool-tips">',
                            '还能输入',
                            '<span class="tool-num">200</span>',
                            '字',
                        '</span>',
                        '<button class="btn">发送</button>',
                    '</div>',
                '</div>'].join(""),

        onshow: function(){

            var that = this;

            if (!User.isLogin()) {
                alert("请登录后再发送私信");
                that.remove();
                return;
            };

            var name = that.buttonTarget.closest(".personDiv").find(".per-name").text(),
                rel = that.buttonTarget.closest(".personDiv").data("rel"),
                $replyDialog = $(".msg-reply"),
                $replyTextarea = $("#txtContent");

            $replyTextarea.val("");

            that.setTitle('发私信给' + name);

            wordsCount($replyTextarea, $replyDialog.find(".tool-num"), 200);

            var focusXHR;

            $replyDialog.off('click', ".btn");
            $replyDialog.on('click', ".btn", function(){

                if ($.trim($replyTextarea.val()).length == 0) {
                    $.tips("发送内容不能为空。");
                    that.remove();
                    return;
                };

                if (focusXHR && focusXHR.readyState != 4) {
                    focusXHR.abort();
                };

                focusXHR = $.ajax({
                    url:'/member/domsg',
                    data:{ content: $replyTextarea.val(), tid: rel, fid: User.UID },
                    dataType: "json",
                    type: "POST",
                    success: function(data){
                        if( data.ret ){
                            that.remove();
                            $.tips("私信发送成功");
                        }else{
                            alert(data.info);
                        }
                    }
                });
                
            });
        }
    });

    $(document).on("click", ".per-msg-btn", function(){
        msgDialog.setBtnTarget($(this));
        msgDialog.show();
    });
}

// data: 传入所有信息
var favoriteHandle = function(data){
    var $btn = data.target.find(".per-fav-btn"),
        $btnText = $btn.find("span");

    if (parseInt(data.checkatten, 10)) {
        //如果已经关注
        $btnText.text("已关注");
        $btn.data("fav", "1");

    }else{
        //如果未关注
        $btnText.text("关注");
        $btn.data("fav", "0");
    };

    favoriteBtnSub(data);
}

//添加关注
// 参数
// pid 是被关注者的uid
// ret=1是添加关注
// ret=2是取消关注
var favoriteBtnSub = function(data){
    var $favBtn = data.target.find(".per-fav-btn"),
        $favBtnText = $favBtn.find("span"),
        $favBtnNum = $favBtn.find(".per-fav-btn-num");

    var xhr;

    $favBtn.on("click", function(){

        var state = parseInt($favBtn.data("fav"), 10);
        var ajaxRet = 1;
        var num = parseInt($favBtnNum.text(), 10);

        //1: 关注 ， 2: 取消关注
        state == 0 ? ajaxRet = 1 : ajaxRet = 2;

        if (!User.isLogin()) {
            alert("请登录后再关注");
            return;
        }

        if (xhr && xhr.readyState != 4) {
            xhr.abort();
        };

        xhr = $.ajax({
            url: "/focus",
            type: "GET",
            dataType: "json",
            data: {
                pid: data.uid, 
                ret: ajaxRet
            },
            success: function(json){
                if (json.status == 1) {

                    if (state) {
                        $favBtnText.text("关注");
                        $favBtn.data("fav", "0");
                        $favBtnNum.text(num - 1);
                    }else{
                        $favBtnText.text("已关注");
                        $favBtn.data("fav", "1");
                        $favBtnNum.text(num + 1);
                    };

                }else if (json.status == 3) {
                    $.tips(json.msg);
                };

            },
            error: function(json){

            }
        });
    });
}

var getPanelData = function($view, callback){
    $view.find(".panel-hover").off("click");

    $view.on("mouseenter", ".panel-hover", function(){

        var that = this;
        //$(that).after(view.rankPanel);
        if ($(that).find(".personContent-top").length) { return; };
        $.ajax({
            type: 'GET',
            url: '/majax/getfidinfo',
            data: {uid: $(that).attr('rel'), atten:true},
            dataType:'json',
            success: function(data){
                if (data.ret) {
                    //解析男女
                    if(data.info.sex == 0){
                        data.info.sex = "女";
                    }else{
                        data.info.sex = "男";
                    }

                    //判断图标
                    if (data.info.roled == 3) {
                        data.info.hostId = '(主播ID：' + data.info.uid + ')';
                        data.info.richMark = '<span class="hotListImg AnchorLevel'+ data.info.lv_exp +'"></span>';
                    }else{
                        data.info.hostId = '';
                        data.info.richMark = '';
                    };

                    //显示徽章
                    data.info.badge = (data.info["vip"] == 0) ? (data.info["icon_id"] == 0) ? "" : '<span class="per-badge badge badge'+ data.info["icon_id"] +'"></span>' : '<span class="hotListImg basicLevel'+data.info["vip"]+'"></span>';

                    //是否在线
                    if (Number(data.info.roled) == 3) {
                        switch(Number(data.info.live_status)){
                            case 0:
                                data.info.isLive = "<span class='per-live per-live-nl'>休息</span>";
                                break;
                            case 1:
                                data.info.isLive = "<span class='per-live per-live-ol'>直播</span>";
                                break;
                            default:
                                data.info.isLive = "";
                        }
                    };

                    //生成模板
                    var tmp = Utility.template(rankPanelTmp, data.info);
                    $(that).find(".personContent").html(tmp);

                    if (data.info.roled != 3) {
                        $(that).find(".per-video-btn").remove();
                        $(that).find(".personLink").remove();
                    };

                    $(that).find(".personLoading").remove();

                    //callback
                    data.info.target = $(that);

                    //bind favorite event
                    favoriteHandle(data.info);

                    if (callback) { callback(data) };
                };
            },
            error: function(){
                if (window.console) {console.log("ajax request error")};
            }
        });
    });

    //bind msg event
    showMsgDialog();
}
/**
 * @description 个人中心关注页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){

    getPanelData($(".watch-content"));
    
    //取消关注
    $('.cancelBtn').on("click", function(){
        var $this = $(this);
        $.ajax({
            url: '/focus',
            data: { pid: $this.parents('li').data('rel'), ret: 2 },
            type: "GET",
            dataType: "json",
            success: function(json){
                if (json.status) {
                    $this.parents('li').remove();
                }else{
                    alert(json.msg);
                };
            },
            error: function(){

            }
        });
    });


});

