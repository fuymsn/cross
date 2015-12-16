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