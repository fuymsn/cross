/**
 * @description 首页
 * @author Young
 * @contacts young@kingjoy.co
 */

//主播请求的ajax
var hostAjax;

//数组去重
var arrayOnly = function(ele, arr){

    if(arr.length==0){
        return true;
    }

    for(var j=0; j<arr.length; j++){
        if(ele==arr[j]){
            return false;
        }else{
            return true;
        }
    }
}

//返回随机字符串
var randomString = function(){
    var seed = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                         'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','Q','r','s','t','u','v','w','x','y','z',
                         '0','1','2','3','4','5','6','7','8','9'
                         );//数组
    seedLen = seed.length;//数组长度
    var str = '';
    for (i=0; i<4; i++) {
        j = Math.floor(Math.random()*seedLen);
        str += seed[j];
    }
    return str;
}

//获取首页数据
var getHostItemData = function(sucCb){
    $.ajax({
        url: "/videolist.json?_=" + (new Date()).valueOf() + randomString(),
        dataType: "json",
        type: "GET",
        success: function(json){
            if (sucCb) { sucCb(json); };
            if (window.console) {console.info(json);};
        },
        error: function(res, text){
            if (window.console) {console.warn(text); console.warn("Host data fetch fail");};
        }
    });
}

/**
 * @description 首页JSONP数据加载
 * @author Young
 * @param obj => 查阅OPTIONS
 */

var getItemData = function(obj){

    var OPTIONS = {
        url: "",
        data: {},
        failText: "data fetch fail",
        successCallback: function(){}
    }

    $.extend(true, OPTIONS, obj);

    //若前一次请求未完成，阻断。
    if (hostAjax && hostAjax.readyState != 4) {
        hostAjax.abort();
    };

    hostAjax = $.ajax({
        type: "GET",
        url: OPTIONS.url,
        data: OPTIONS.data,
        dataType:'json',
        // dataType: "jsonp",
        // jsonp: "callback",
        // jsonpCallback:"cb",
        success: function(json){
            if (OPTIONS.successCallback) { OPTIONS.successCallback(json); };
            if (window.console) {console.info(json);};
        },
        error: function(){
            if (window.console) {console.warn(OPTIONS.failText);};
        }
    });
}

/**
 * @description 首页显示访问量和热门视频连接
 * @author Young
 * @param baseURL: 域名, roomId: 房间ID
 */
var setHotUrl = function(baseURL, roomId){
    var url = baseURL + "/" + roomId;
    $(".side-hot").attr("href", url);
}



/**
 * @description 首页四种类型视频列表输出到页面
 * @author Young
 * @param datalist: JSONP所获取的数据
 */
var renderHostList = function(dataList){

    //首页渲染页面
    if( dataList == null ){
        $('#rec').html('服务器维修中，敬请期待！');
    }else{
        for(var cat in dataList){
            if (!$.isArray(dataList[cat])) { continue; };
            if (cat == "rec" || cat == "gen" || cat == "vip") {
                var tmp = renderItem(dataList[cat]);
                //清空$("#"+cat)并添加数据
                $("#"+cat).html(tmp);

                //限制房间拦截逻辑
                //bindLimitedRoom($("#"+cat).find(".movieList"));
            };
            if (cat == "ord") {
                var tmp = renderOrdItem(dataList[cat]);
                $("#"+cat).html(tmp);
                //一对一房间
                bindOrd();
            };
        }

        $('.side-online').find('.onlinePer-num').html(dataList.total_users);
    }


}

/**
 * @description 一对一房间首页交互
 * @author Young
 */
var bindOrd = function(){
    var $ord = $(".ordRoom");
    $ord.on("click", function(){

        var $that = $(this);

        var ordImg = $that.find("img").attr("src"),
            ordTitle = $that.find(".title").text(),
            ordDuration = $that.data("duration"),
            ordPoints = $that.data("points"),
            ordStarttime = $that.data("starttime"),
            ordRoomId = $that.data("roomid"),
            ordAppointState = $that.data("appointstate");

        if (ordAppointState != '1') {
            return;
        };

        var tmp = "<div class='ordDialog'>" +
                "<img src=" + ordImg + " alt />"+
                "<div class='ordDialogContent'>"+
                    "<h4>"+ ordTitle +"</h4>"+
                    "<p>直播时长："+ordDuration+"</br>直播费用："+ordPoints+"钻</br>开播时间："+ordStarttime+"</p>"+
                "</div>"+
            "</div>";

        $.dialog({
            title: "立即约会",
            content: tmp,
            ok: function(){
                reserveRoom(ordRoomId);
            },
            okValue: "立即约会"
        }).show();

    });
}

/**
 * @description 生成首页排行榜，并输出到页面
 * @author Young
 * @param data: JSONP所获取的数据
 */
var renderRankList = function(data){

    $.each(data, function(id, item) {
        if (id.indexOf("rank_") > -1) {
            var userItem = "", first = "";
            for (var i = 0; i < item.length; i++) {

                (i == 0) ? first = "rank-text-bold" : first = "";

                //容错 bug fix，只显示5条数据
                if(i == 5) break;

                var badge = "", //排行榜第一列图标
                    level = "", //排行榜第二列图标
                    isExp = false, //是否是主播
                    exp = ""; //排行榜主播名字长度css

                if(id.indexOf("_exp_") > 0) isExp = true; // 判断是否是主播，当json中key包含“_exp_”的数据为主播排行榜数据

                // 当vip字段不为空时，显示贵族勋章，否则显示普通徽章
                // 如果是主播，不显示任何图标(lv_rich=0为主播)
                if(isExp) {
                    exp = 'rank-text-exp';
                }
                else {
                    if('undefined' == typeof item[i].vip || item[i].vip.toString() == '0') {
                        badge = (item[i].icon_id == 0) ? "" : '<div class="rank-badge badge badge' + item[i].icon_id + '"></div>';
                    }
                    else {
                        badge = '<div class="hotListImg basicLevel'+item[i].vip+'"></div>';
                    }
                }

                // 赌圣、富豪榜显示爵位icon
                // 如果是主播的话不显示爵位，只显示等级icon
                level = isExp ? "AnchorLevel" + item[i].lv_exp : "basicLevel" + item[i].lv_rich;

                userItem += '<div class="rank-item panel-hover" rel="'+ item[i].uid +'">' +
                    '<div class="rank-num rank-num-'+ i +'"></div>'+
                    '<div class="rank-text '+ first + ' ' + exp +'">' + item[i].username +'</div>'+
                    badge +
                    '<div class="rank-mark hotListImg '+ level +'"></div>'+
                    '<div class="personDiv" data-rel="'+ item[i].uid +'">'+
                        '<div class="arrow"></div>'+
                        '<div class="personContent clearfix">'+
                            '<img class="personLoading" src="' + Config.imagePath + '/loading.gif" />'+
                        '</div>'+
                    '</div>'+
                '</div>';
            }

            $('#'+id).html(userItem);

        };
    });
}


/**
 * @description 动态设置轮播图src
 * @author Young
 */
var sliderLoad = function($slider, defaultImg){

    var getHost = function(arr){
        var o = "";
        for (var i = 0; i < arr.length ; i++) {
            if (i == arr.length - 1) {
                o = arr[i];
            };
        };

        return o;
    }
    var $imgLen = $slider.find("img");

    for(var i = 1; i < $imgLen.length; i++){
        $imgLen.eq(i).attr("src", window.PIC_PATH + '/images/staticad/' + ($imgLen.eq(i).data("src") ? $imgLen.eq(i).data("src") : defaultImg));

    }

}

/**
 * @description 搜索功能设置跳转
 * @author Young
 */
var searchHandle = function(){
    var $searchIpt = $("#searchIpt");
    var $searchBtn = $("#searchIptBtn");

    //绑定click事件
    $searchBtn.on("click", function(){
        var searchVal = $searchIpt.val();
        $searchBtn.attr("href", "/search.html?nickname=" + searchVal);
    });

    //回车键触发click事件
    $searchIpt.on("keyup", function(e){
        if (e.keyCode == 13) {
            var searchVal = $searchIpt.val();
            location.href = "/search.html?nickname=" + searchVal;
        };
    });
}

$(function(){

    //个人信息面板
    getPanelData($(".rank-content"));

    //初始化main-slider图片，先加第一张图片
    var $firstImg = $('#mainSlider').find("img").eq(0);
    $firstImg.attr("src", window.PIC_PATH + '/images/staticad/' + ($firstImg.data("src") ? $firstImg.data("src") : "default.jpg"));

    //初始化slide-slider图片，先加第一张图片
    var $sideFirstImg = $('#sideSlider').find("img").eq(0);
    $sideFirstImg.attr("src", window.PIC_PATH + '/images/staticad/' + ($sideFirstImg.data("src") ? $sideFirstImg.data("src") : "side-default.jpg"));

    //图片滚动
    $('.flexslider').flexslider({
        animation: "slide",
        //direction: "vertical",
        slideshowSpeed: 5000,
        animationSpeed: 300,
        initDelay: 5000
    });

    //搜索
    searchHandle();

    //首页加载逻辑
    if ($("#index").length) {

        //首页数据处理和视图渲染
        var indexRender = function(){
            //获取首页主要数据
            getHostItemData(function(hostData){

                //设置最热直播url
                setHotUrl(window.V_PATH, hostData.hot_room_id);

                //设置在线玩家数量
                $('.side-online-num').html(hostData.total_users);

                //渲染视频列表
                renderHostList(hostData);

                //渲染排行榜列表
                renderRankList(hostData);

            });
        }

        indexRender();

        //首页主播数据，每1分钟请求一次
        setInterval(function(){
            indexRender();
        }, 60000);

        //初始化任务系统，该任务无需用户登录状态
        var indexTask = new Task();
        indexTask.initTask();

        //初始化密码房间
        var roomPwd = new RoomPwd();

        var handle = getLocation("handle");
        var roomid = getLocation("rid");

        //判断是否是本人
        if (roomid == User.UID) {
            return;
        };

        //处理密码房间，如果url参数不存在，不做请求
        if (handle == "roompwd" && roomid && roomPwd.firstTimeApply) {
            roomPwd.roomPwdAjaxSet({
                data: { "roomid": roomid },
                successCallback: function(res){
                    roomPwd.times = parseInt(res.times, 10);
                    roomPwd.showPwdDialog(roomid);
                    roomPwd.firstTimeApply = false;
                }
            });
        };
        //};

    //index more 页面加载逻辑
    }else if($("#index-more").length){

        //获取url参数
        var loc = getLocation("tag");
        loc = loc == "" ? "all" : loc;

        //当前翻页类型
        var cat = "all";
        var loadTmp = "<div class='m-load'></div>";
        var loadBtnTmp = "<div class='inx-more-btn'>点击按钮，加载更多</div>";

        //加载数量
        var pageCount = 0;

        /**
         * @description 更多页面视频追加列表渲染
         * @author Young
         * @param $tab: tab容器, data:JSONP所获取的数据, countStart列表截取的起始值
         */
        var renderData = function($tab, data, countStart){

            var currentData = [];

            //带参个数判定
            if (arguments.length == 3) {
                currentData = data.rooms.slice(countStart, countStart + 20);
            }else{
                currentData = data.rooms;
            };

            //一对一房间渲染
            if ($tab[0].id == "ord") {
                var tmp = renderOrdItem(currentData);
            }else{
                var tmp = renderItem(currentData);
            };

            //append数据
            $tab.append(tmp);

            //绑定一对一房间预约
            if ($tab[0].id == "ord") {
                bindOrd();
            };

            //限制房间拦截逻辑
            //bindLimitedRoom($tab.find(".movieList"));

            //添加隐藏了的append按钮
            $tab.append(loadBtnTmp);

            //取消加载圆圈
            $tab.find(".m-load").remove();

            //显示和不显示按钮
            var $moreBtn = $tab.find(".inx-more-btn");

            //追加列表的事件绑定
            if($(tmp).filter(".movieList").length == 20){

                //绑定一次加载更多按钮
                $moreBtn.one("click", function(){

                    //添加转圈圈
                    $("#" + cat).append(loadTmp);

                    //按照参数cat类型显示数据
                    renderData($("#" + cat), data, pageCount);

                    //如果追加成功，删除这个按钮
                    $(this).remove();
                });

                //如果length==20显示追加按钮
                $moreBtn.show();
            }else{
                //如果追加一次不足20个，则删除这个按钮
                $moreBtn.remove();
            };

            pageCount = pageCount + 20;
        }

        //bool => 第一次房间密码事件绑定, flag
        var firstPwdRoomFlag = true;

        /**
         * @description 页面切换
         * @author Young
         */
        var handleData = function(){

            //添加转圈圈
            $("#" + cat).append(loadTmp);

            //按照参数cat类型获取数据
            getItemData({
                url: '/videolist'+ cat +'.json',
                data: { "_": (new Date()).valueOf() + randomString() },
                failText: "More data fetch fail",
                successCallback: function(data){

                    //展示数据
                    renderData($("#" + cat), data, pageCount);

                    //“更多页面” 绑定密码房间
                    if (firstPwdRoomFlag) {
                        var roomPwd = new RoomPwd();
                        firstPwdRoomFlag = false;
                    };
                }
            });

        }

        //绑定tab事件
        $(".tab-item").on("click", function(){

            cat = $(this).data("cat");
            //重置panel，并排除清除关注的情况
            if (cat != "fav" && cat != "res") {

                $("#" + cat).html("");

                //重置pageCount
                pageCount = 0;

                //render page
                handleData();

            };

        });

        //页面刷新的时候触发
        $("#tabBtn"+loc).trigger("click");

    };

    //页面所有元素渲染结束后加载
    window.onload = function(){
        //轮播图
        sliderLoad($("#mainSlider"), "default.jpg");
        sliderLoad($("#sideSlider"), "side-default.jpg");
    }

    //弹窗提示存书签
    // if (!$.cookie("firstenter") || !$.cookie("webuid")) {
    //     window.onbeforeunload = function(){
    //         return "亲，喜欢我们的网站就存书签吧！或者下载网站右下角的网站地址发布器，随时观看大秀，精彩不容错过！\n\n（登录后不再显示）";
    //     }
    //     $.cookie("firstenter", 1);
    // };


});
