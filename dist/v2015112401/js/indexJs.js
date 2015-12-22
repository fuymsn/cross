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
* each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数<br/>
* 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
{%example
<script>
     var a = [1,2,3,4].each(function(x){return x > 2 ? x : null});
     var b = [1,2,3,4].each(function(x){return x < 0 ? x : null});
     alert(a);
     alert(b);
</script>
%}
* @param {Function} fn 进行迭代判定的函数
* @param more ... 零个或多个可选的用户自定义参数
* @returns {Array} 结果集，如果没有结果，返回空集
*/
Array.prototype.each = function(fn){
    fn = fn || Function.K;
     var a = [];
     var args = Array.prototype.slice.call(arguments, 1);
     for(var i = 0; i < this.length; i++){
         var res = fn.apply(this,[this[i],i].concat(args));
         if(res != null) a.push(res);
     }
     return a;
};

/**
* 得到一个数组不重复的元素集合<br/>
* 唯一化一个数组
* @returns {Array} 由不重复元素构成的数组
*/
Array.prototype.uniquelize = function(){
     var ra = new Array();
     for(var i = 0; i < this.length; i ++){
         if(!ra.contains(this[i])){
            ra.push(this[i]);
         }
     }
     return ra;
};

/**
* 求两个集合的去重
{%example
<script>
     var a = [1,2,3,4];
     var b = [3,4,5,6];
     alert(Array.complement(a,b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的去重
*/
Array.complement = function(a, b){
     return Array.minus(Array.union(a, b), Array.intersect(a, b));
};

/**
* 求两个集合的交集
{%example
<script>
     var a = [1,2,3,4];
     var b = [3,4,5,6];
     alert(Array.intersect(a,b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的交集
*/
Array.intersect = function(a, b){
     return a.uniquelize().each(function(o){return b.contains(o) ? o : null});
};

/**
* 求两个集合的差集
{%example
<script>
     var a = [1,2,3,4];
     var b = [3,4,5,6];
     alert(Array.minus(a,b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的差集
*/
Array.minus = function(a, b){
     return a.uniquelize().each(function(o){return b.contains(o) ? null : o});
};

/**
* 求两个集合的并集
{%example
<script>
     var a = [1,2,3,4];
     var b = [3,4,5,6];
     alert(Array.union(a,b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的并集
*/
Array.union = function(a, b){
     return a.concat(b).uniquelize();
};

/**
* 数组中是否包含指定的元素
* @param obj 指定元素
* @returns Bool
*/
Array.prototype.contains = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
/*
 * @ description task 任务系统
 * @ type Class
 * @ return null
 */
(function(__Task, window){

    __Task = function(){
        //已经完成按钮
        var btnFinishTmp = '<input type="button" class="btn btn-s" disabled value="已完成" />';

        this.mainTmp = '';

        this.setMainTmp = function(tmp){
            var taskTmp = ['<div class="task">',
                '<div class="task-header">',
                    '<div class="task-header-dialog"></div>',
                    '<div class="task-header_title">挣钻石喽</div>',
                    '<div class="task-header_close">关闭</div>',
                '</div>',
                '<div class="task-content">',
                    '<div class="task-content-top"></div>',
                    '<div class="task-content-wrapper" id="J-task-content">' +tmp+ '</div>',
                    '<div class="task-content-bottom"></div>',
                '</div>',
            '</div>'].join("");

            this.mainTmp = taskTmp;
        }

        this.getMainTmp = function(){
            return $(this.mainTmp);
        }

        this.getFinishBtn = function(){
            return btnFinishTmp;
        }
        /**
         * 生成领取奖励按钮
         * $param: id: 任务id
         * $return: string
         **/
        this.getBonusBtn = function(id){
            return '<button type="button" class="task-content_btn J-task-getBonus" data-id="'+ id +'" >领取奖励</button>';
        }

        /**
         * 生成特殊按钮
         * $param: btnObj: 按钮属性对象
         * $return: string
         **/
        this.getSpecailBtn = function(btnObj){

            var OPTIONS = {
                btnText: "按钮",
                btnUrl: "/"
            }

            var option = $.extend(true, OPTIONS, btnObj);

            return '<a class="task-content_btn" href="' + option.btnUrl + '">' + option.btnText + '</a>';
        }

        /**
         * 获取钻石数模板
         * $param: points: 钻石数
         * $return: string
         **/
        this.getPointsTmp = function(points){
            return points ? '<span class="task-content_points">+'+ points +'<img src="'+ Config.imagePath +'/diamond.png" /></span>' : '';
        }

        /**
         * 获取财富等级数模板
         * $param: level: 等级
         * $return: string
         **/
        this.getLevelTmp = function(level){
            return (level && level != "1") ? '<span class="hotListImg basicLevel' + level + '"></span>' : '';
        }

        /**
         * 获取坐骑模板
         * $param: bonusExpTimeObj: bonus对象数组
         * $return: string
         **/
        this.getExpTimeTmp = function(bonusExpTimeObj){

            if (bonusExpTimeObj && bonusExpTimeObj[0].exp) {
                return '<span class="task-content_bonus_exp">' + bonusExpTimeObj[0].exp + '天</span>';
            }else{
                return '';
            };

        }

        /**
         * 获取坐骑模板
         * $param: mountObj: 坐骑对象数组
         * $return: string
         **/
        this.getMountTmp = function(mountObj){

            var mountName = '';

            mountName = '<span class="task-content_bonus_mount">'+ (mountObj ? mountObj[0].name : "") + this.getExpTimeTmp(mountObj) + '</span>';

            return mountObj ? mountName: "";
        }

        /**
         * 获取徽章模板
         * $param: iconObj: 徽章对象数组
         * $return: string
         **/
        this.getIconTmp = function(iconObj){

            var iconName = '';

            iconName = '<span class="badge badge'+ (iconObj ? iconObj[0].id : "") + ' task-content_bonus_icon"></span>' + this.getExpTimeTmp(iconObj);

            return iconObj ? iconName: "";
        }

    }

    /**
     * $description: 获取任务数据
     * $param: callback: 获取数据后的回调
     * $return: null
     **/
    __Task.prototype.getTaskData = function(callback){
        var that = this;
        $.ajax({
            url: "/task",
            type: "GET",
            dataType: "json",
            success: function(res){
                if (callback) {callback(res)};
            },
            error: function(res){
                Utility.log("get task error");
            }
        });
    }

    /**
     * $description: 任务初始化
     * $param: null
     * $return: null
     **/
    __Task.prototype.initTask = function(){

        var that = this;

        that.getTaskData(function(res){
            that.renderTask(res.data);
            that.initTaskEvent();
        });

        //that.renderTask({"id":1440313251,"type":"task","data":{"points":[{"vtask_id":"15","pre_vtask_id":null,"task_name":"13213","description":"12312","icon":null,"user_group":null,"max_user":"1111","applicants":"0","achievers":"0","starttime":null,"endtime":null,"period":null,"period_type":null,"reward":"a:1:{i:0;s:6:\"points\";}","prize":null,"bonus":{"top": "1","points":"200"},"sort_order":null,"script_name":"points","status":"0","init_time":"2015-08-21 18:42:41","dml_time":"2015-08-21 18:42:41","dml_flag":"1","userStatus":"success"},{"vtask_id":"16","pre_vtask_id":null,"task_name":"13213","description":"12312","icon":null,"user_group":null,"max_user":"1111","applicants":"0","achievers":"0","starttime":"2015-08-21 19:08:04","endtime":"2015-10-24 19:08:06","period":null,"period_type":null,"reward":"a:3:{i:0;s:6:\"points\";i:1;s:5:\"goods\";i:2;s:4:\"icon\";}","prize":null,"bonus":{"top": "1","points":"200","goods":[{"id":"310006","num":"20","exp":"30","name":"千纸鹤"}],"icon":[{"id":"900001","exp":"60","name":"至尊（金）"}]},"sort_order":"16","script_name":"points","status":"0","init_time":"2015-08-21 18:43:09","dml_time":"2015-08-21 19:09:17","dml_flag":"2","points":{"auto_id":"12","vtask_id":"16","name":"充值","description":"满足任务条件金额","variable":"points","type":"text","value":["200","500"]},"userStatus":"doing"},{"vtask_id":"19","pre_vtask_id":null,"task_name":"测试任务3","description":"4464564","icon":null,"user_group":null,"max_user":"11111","applicants":"0","achievers":"0","starttime":null,"endtime":null,"period":null,"period_type":null,"reward":"a:1:{i:0;s:3:\"top\";}","prize":null,"bonus":{"top":"8"},"sort_order":"19","script_name":"points","status":"0","init_time":"2015-08-22 06:42:15","dml_time":"2015-08-22 06:42:15","dml_flag":"1","points":{"auto_id":"13","vtask_id":"19","name":"充值","description":"满足任务条件金额","variable":"points","type":"text","value":["100","200"]},"userStatus":"doing"},{"vtask_id":"20","pre_vtask_id":null,"task_name":"123","description":"77676767","icon":null,"user_group":null,"max_user":null,"applicants":"0","achievers":"0","starttime":null,"endtime":null,"period":null,"period_type":null,"reward":"a:2:{i:0;s:5:\"level\";i:1;s:6:\"medals\";}","prize":null,"bonus":{"top": "1","level":"2","medals":[{"id":"910000","exp":"30","name":null}]},"sort_order":"20","script_name":"points","status":"0","init_time":"2015-08-22 06:42:32","dml_time":"2015-08-22 06:45:54","dml_flag":"2","points":{"auto_id":"14","vtask_id":"20","name":"充值","description":"满足任务条件金额","variable":"points","type":"text","value":["200","500"]},"userStatus":"doing"}],"check_email":[{"vtask_id":"17","pre_vtask_id":null,"task_name":"测试任务2","description":"131231231","icon":null,"user_group":null,"max_user":null,"applicants":"0","achievers":"0","starttime":"2015-07-07 19:10:20","endtime":"2015-08-10 19:10:23","period":null,"period_type":null,"reward":"a:2:{i:0;s:6:\"points\";i:1;s:4:\"icon\";}","prize":null,"bonus":{"top": "1","points":"200","icon":[{"id":"900001","exp":"60","name":"至尊（金）"}]},"sort_order":"17","script_name":"check_email","status":"0","init_time":"2015-08-21 19:10:33","dml_time":"2015-08-21 19:10:33","dml_flag":"1","userStatus":"all"}],"invite":[{"vtask_id":"18","pre_vtask_id":"17","task_name":"20000","description":"200000","icon":null,"user_group":null,"max_user":"200","applicants":"0","achievers":"0","starttime":"2015-08-14 19:10:50","endtime":"2015-08-28 19:10:52","period":null,"period_type":null,"reward":"a:2:{i:0;s:6:\"points\";i:1;s:5:\"goods\";}","prize":null,"bonus":{"top": "1", "points":"200","goods":[{"id":"310006","num":"20","exp":"30","name":"千纸鹤"}]},"sort_order":"18","script_name":"invite","status":"0","init_time":"2015-08-21 19:11:30","dml_time":"2015-08-21 19:11:30","dml_flag":"1","userStatus":"can_apply"}]}}.data);
        
    }

    /**
     * $description: 刷新任务
     * $param: null
     * $return: null
     **/
    __Task.prototype.flashTask = function(){

        var that = this;

        that.getTaskData(function(res){
            that.renderTask(res.data);
        });
    }

    __Task.prototype.initTaskEvent = function(){
        //领取奖励事件
        var that = this;

        $(".J-task-getBonus").on("click", function(e){

            var $that = $(this);
            var taskId = $that.data("id");

            $that.prop("disabled", true);

            $.ajax({
                url: "/task/end/" + taskId,
                dataType: "json",
                type: "GET",
                success: function(res){
                    $.tips(res.msg);
                    $that.parent().html(that.getFinishBtn());
                    $that.prop("disabled", false);
                },
                error: function(){
                    Utility.log("fail to get bonus");
                    $that.prop("disabled", false);
                }
            });

        });

        //关闭任务栏操作
        $(".task-header_close").on("click", function(e){
            e.stopPropagation();
            $(".task-content").slideToggle(200);
            $(".task-header_close").hide();
        });

        //打开任务栏操作
        $(".task-header").on("click", function(){
            if ($(".task-content").is(":hidden")) {
                $(".task-content").slideToggle(200);
                $(".task-header_close").show();
            };
        });
    }

    //渲染任务列表
    __Task.prototype.renderTask = function(data){
        
        var that = this;
        var tmp = "";

        for( var item in data ){

            if ($.isEmptyObject(data)) { return; };

            var itemTmp = "";
            var itemData = data[item];

            for (var i = 0, len = itemData.length; i < len; i++) {

                var btn = "";
                var bonus = "";


                if (itemData[i].userStatus == "all") {
                    btn = that.getFinishBtn();
                }else if(itemData[i].userStatus == "success"){
                    btn = that.getBonusBtn(itemData[i].vtask_id);
                }else{

                    switch(item){
                        case "check_email":
                            btn = that.getSpecailBtn({ btnText: "验证", btnUrl: "/mailverific" });
                            break;
                        case "invite":
                            btn = that.getSpecailBtn({ btnText: "去推广", btnUrl: "/member/invite" });
                            break;
                        case "invite":
                            btn = that.getSpecailBtn({ btnText: "立即预约", btnUrl: "/viewmore.html?tag=ord" });
                            break;
                        case "points":
                            btn = that.getSpecailBtn({ btnText: "充值", btnUrl: '/charge/order?radioprice=' + (itemData[i].points ? itemData[i].points.value[0] : 100 ) + '' });
                            break;
                        case "openvip":
                            btn = that.getSpecailBtn({ btnText: "首开贵族", btnUrl: "/shop?handle=noble" });
                            break;
                        default:
                            break;
                    }

                }

                var points = that.getPointsTmp(itemData[i].bonus.points);
                var level = that.getLevelTmp(itemData[i].bonus.top);
                var mount = that.getMountTmp(itemData[i].bonus.goods);
                var icon = that.getIconTmp(itemData[i].bonus.icon);
                
                bonus = points + level + mount + icon;

                itemTmp += '<li><div class="task-content_title">' + itemData[i].task_name + '</div>' +
                    '<div class="task-content_info">' + bonus + '</div>' +
                    '<div class="task-content_btnbox">' + btn + '</div></li>';
            };

            //$("#task-" + item).append(tmp);
            tmp += '<ul class="task-item" id="task-'+ item +'">' + itemTmp + '</ul>'
            
        }

        this.setMainTmp(tmp);
        $("body").append(this.getMainTmp());
        $(".task").show();
    }

    window.Task = __Task;

})(typeof Task !== "undefined" ? Task: {}, window);
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
/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        //eventType = (touch) ? "touchend" : "click",
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {},
        focused = true;

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) slider.currentSlide = 0;
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") slider.vars.animation = "swing";
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) methods.controlNav.setup();

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.setup();

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) methods.pausePlay.setup();

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) methods.pauseInvisible.init();

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) slider.pause();
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) slider.play();
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) methods.asNav.setup();

        // TOUCH
        if (touch && slider.vars.touch) methods.touch();

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) $(window).bind("resize orientationchange focus", methods.resize);

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture)
                          e.currentTarget._gesture.addPointer(e.pointerId);
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"/>' : '<a>' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' != captn && undefined != captn ) item += '<span class="' + namespace + 'caption">' + captn + '</span>';
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            el.addEventListener('touchstart', onTouchStart, false);

            function onTouchStart(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            }

            function onTouchMove(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            }

            function onTouchEnd(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            }
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true);
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) slider.doMath();

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var prefixes = ['webkit','moz','ms','o'];

          if ('hidden' in document) return 'hidden';
          for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
            methods.pauseInvisible.visProp = prefixes[i] + 'Hidden';
          }
          if (methods.pauseInvisible.visProp) {
            var evtname = methods.pauseInvisible.visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                else slider.pause(); //Or just pause
              }
              else {
                if(slider.started) slider.play(); //Initiated before, just play
                else (slider.vars.initDelay > 0) ? setTimeout(slider.play, slider.vars.initDelay) : slider.play(); //Didn't init before: simply init or wait for it
              }
            });
          }
        },
        isHidden: function() {
          return document[methods.pauseInvisible.visProp] || false;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) slider.pause();

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) methods.sync("animate");

        // CONTROLNAV
        if (slider.vars.controlNav) methods.controlNav.active();

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) methods.directionNav.update();

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) slider.pause();
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }
            
            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight(slider.vars.animationSpeed);
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) slider.flexAnimate(slider.getTarget("next"));
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("play");
      // SYNC:
      if (slider.syncExists) methods.sync("pause");
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) clearInterval(slider.animatedSlides);
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) methods.pausePlay.update("pause");
      // SYNC:
      if (slider.syncExists) methods.sync("play");
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) slider.container.css(slider.args);

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") slider.container.find('.clone').remove();
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) methods.smoothHeight();
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) methods.smoothHeight();
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) methods.directionNav.update();

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,   		//{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) options = {};

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) options.start($this);
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") $slider.flexAnimate(options, true);
      }
    }
  };
})(jQuery);

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
