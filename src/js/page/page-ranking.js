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
