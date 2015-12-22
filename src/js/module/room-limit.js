/**
 * @description 限制房间首页交互
 * @author Young
 * @param $limitedRoom 限制的房间
 */

var bindLimitedRoom = function($limitedRoom){
    var $rooms = $limitedRoom;
    $rooms.on("click", function(e){

        var $that = $(this);
        var roomId = $that.data("roomid");

        var dialogSwitchShow = $.dialog({title:"提示", content:"正在跳转至主播房间..."});
        dialogSwitchShow.show();

        //阻止a标签默认事件
        e.preventDefault();

        $.ajax({
            url: window.V_PATH + "/video_gs/room/loadEnterRoomLimit",
            data: {"uid": User.UID, "roomid": roomId},
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"cb",
            success: function(data){

                dialogSwitchShow.close();

                //1. 是否主播开启限制。 2. 是否主播是自己。
                var isLimited = data.open;
                if (!isLimited || User.UID == roomId) {
                    location.href = window.V_PATH + "/" + roomId;
                    return;
                };

                if (data.richLvLimit == 0 || data.richLvLimit == 1) {
                    data.richLvNameLimit = "无限制";
                };

                var tmp = ["<div class='limited-d'><div class='limited-content clearfix'>",
                        "<table class='limited-table limited-table_left'><th colspan='2'>当前房间进入条件</th>",
                            "<tr><td>邮箱验证</td><td><span class='limited-font-i'>" + (data.mailCheckedLimit == 0 ? "无需验证" : "需要验证") + "</span></td></tr>",
                            "<tr><td>当前余额</td><td><span class='limited-font-i'>" + data.richLimit + "钻石</span></td></tr>",
                            "<tr><td>进入财富等级</td><td><span class='limited-font-i'>" + data.richLvNameLimit + "</span></td></tr>",
                        "</table>",
                        "<table class='limited-table'><th colspan='2'>您目前的条件</th>",
                            "<tr><td>邮箱验证</td><td><span class='limited-font-i'>" + (data.mailChecked == 0 ? "否" : "是") + "</span></td></tr>",
                            "<tr><td>当前余额</td><td><span class='limited-font-i'>" + data.points + "钻石</span></td></tr>",
                            "<tr><td>进入财富等级</td><td><span class='limited-font-i'>" + data.richLvName + "</span></td></tr>",
                        "</table>",
                    "</div>",
                    "<p>您<span class='limited-font-i'>未达到</span>房间进入条件</p>",
                    "<div class='limited-btnbox clearfix'>",
                        "<a href='/mailverific' target='_blank' class='btn btn-left'>验证邮箱</a>",
                        "<a href='/charge/order' target='_blank' class='btn btn-right'>充值</a>",
                    "</div></div>"].join("");

                var dialogLimited = $.dialog({
                    title:"提示",
                    content: tmp
                });

                dialogLimited.show();
            },
            error: function(){

            }
        });

    });
}
