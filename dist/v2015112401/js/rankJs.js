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
 * @description 排行页面
 * @author Young
 * @contacts young@kingjoy.co
 */

var JSON = {
    isEmpty:function(o){
        for (var i in o) {
            return false
        };
        return true;
    },
    getLength:function(o){
        var l = 0;
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                l++;
            }
        };
        return l;
    }
};

var view = {},
    data = {},
    //初始化数据
    dataInit = function(cb){

        $.ajax({
            url: window.V_PATH + '/video_gs/rank/data_ajax',
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"cb",
            success: function(json){
                data.rankData = json;
                if (cb) { cb() };
            },
            error: function(json){
               if(console){console.log("rank data fetch error")}
            }
        });

    },
    //初始化视图
    viewInit = function(){
        $.extend(view, {
            "$container": $(".J-tab")
        });

        //普通列表渲染
        $.each(data.rankData, function(id, item) {

            if (id.indexOf("rank_appoint") > -1) { return; };

            var user = '',
                userItem = "",
                index = 0;

            var dataLen = JSON.getLength(item);

            for(var i in item){
                index++;
                var num = i>0 ? ' num'+index : '';
                var imgURL = (item[i].headimg == "" || item[i].headimg == "null") ? (Config.imagePath + "/head_40.png") : window.IMG_PATH + '/' + item[i].headimg +'?w=40&h=40';
                var img = (index == 1 || index == 2 || index == 3) ? '<img class="rank-list_por" src="'+ imgURL +'">' : '';

                var badge = "", //排行榜第一列图标
                    mark = "", //排行榜第二列图标
                    isExp = false; //是否是主播

                if(id.indexOf("_exp_") > 0) isExp = true; // 判断是否是主播，当json中key包含“_exp_”的数据为主播排行榜数据

                // 当vip字段不为空时，显示贵族勋章，否则显示普通徽章
                // 如果是主播，不显示任何图标
                if(!isExp) {
                    if('undefined' == typeof item[i].vip || item[i].vip.toString() == '0') {
                        badge = (Number(item[i].icon_id) == 0) ? "" : '<div class="rank-list_badge badge badge' + item[i].icon_id + '"></div>';
                    }
                    else {
                        badge = '<div class="rank-list_badge hotListImg basicLevel' + item[i].vip + '"></div>';
                    }
                }

                // 赌圣、富豪榜显示爵位icon
                // 如果是主播的话不显示爵位，只显示等级icon
                mark = isExp ? "AnchorLevel" + item[i].lv_exp : "basicLevel" + item[i].lv_rich;

                var shortName = (i < 3 && (Number(item[i].icon_id) > 0 || Number(item[i].vip) > 0)) ? "rank-list_name__inshort" : "";
                //tmp
                userItem += '<li>'
                                +'<div class="rank-list_num'+ num +'"></div>' + img
                                +'<a href="#" rel="'+ item[i].uid +'" class="rank-list_name panel-hover">'
                                    +'<span class="rank-list_name__in '+ shortName +'">'+ item[i].username +'</span>'
                                    +'<div class="personDiv" data-rel="'+ item[i].uid +'">'
                                        +'<div class="arrow"></div>'
                                        +'<div class="personContent clearfix">'
                                            +'<img class="personLoading" src="'+ Config.imagePath +'/loading.gif" />'
                                        +'</div>'
                                    +'</div>'
                                +'</a>' + badge
                                +'<div class="hotListImg '+mark+'"></div>'
                            +'</li>';

                if (dataLen < 5) {

                    user = user + userItem;
                    userItem = "";

                    if (dataLen == (Number(i)+1)) {
                        user = "<ul class='rank-menu_col'>" + user + "</ul>";
                    };

                }else{

                    if (index % 5 == 0){
                        user = user + "<ul class='rank-menu_col'>" + userItem + "</ul>";
                        userItem = "";
                    }
                };

            }

            $('#'+id).html(user);

        });

        //特殊列表渲染（排名前五人气排行榜）
        $.each(data.rankData, function(id, item) {

            if (id.indexOf("rank_appoint") == -1) { return; };

            var user = '',
                userItem = "",
                index = 0;

            var dataLen = 5;

            for(var i in item){

                if (index == 5) {break;};

                index++;

                var num = i>0 ? ' num'+index : '';
                var imgURL = (item[i].headimg == "" || item[i].headimg == "null") ? (Config.imagePath + "/head_150.png") : window.IMG_PATH + '/' + item[i].headimg +'?w=150&h=150';
                var img = '<img class="rank-list_por" src="'+ imgURL +'">';
                //tmp
                userItem += '<li>'
                                +'<div class="rank-list_num'+ num +'"></div>' + img
                                +'<a href="#" rel="'+ item[i].uid +'" class="rank-list_name panel-hover">'
                                    +'<span class="rank-list_name__in">'+ item[i].username +'</span>'
                                    +'<div class="personDiv" data-rel="'+ item[i].uid +'">'
                                        +'<div class="arrow"></div>'
                                        +'<div class="personContent clearfix">'
                                            +'<img class="personLoading" src="'+ Config.imagePath +'/loading.gif" />'
                                        +'</div>'
                                    +'</div>'
                                +'</a>'
                                +'<div class="rank-list_des">'+ (item[i].description == "" ? "此人好懒，大家帮TA想想写些什么吧。" : item[i].description) +'</div>'
                            +'</li>';

                user = user + userItem;
                userItem = "";
                user = "<ul class='rank-menu_col'>" + user + "</ul>";
            }

            $('#'+id).html(user);

        });
    },

    //初始化事件
    eventInit = function(){
        getPanelData(view.$container);
    };


$(function(){
    dataInit(function(){
        viewInit();
        eventInit();
    });
});
