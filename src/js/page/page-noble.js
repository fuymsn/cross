$(function(){
    //绑定贵族开通弹窗事件
    var bindNobleChargeDialogEvent = function(){

        var nb = new Noble();

        $(".J-noble-charge").on("click", function(e){

            //实例
            Noble.ins = nb;

            //设置群组id
            Noble.ins.setCurrentGid($(this).data("groupid"));

            //设置房间id测试
            //Noble.ins.setRoomId(100008);

            //回调函数测试
            Noble.chargeNobleSuccessCB = function(res){
                location.reload();
            };
            
            //显示窗口
            Noble.showChargeDialog();

        });
    }


    //动态读取贵族说明表数据
    Noble.getNobleAllInfo(function(data){
        var info = data['info'],
            levelName = ['<td><h4>贵族特权</h4></td>'], //标题
            open = ['<td><h4>开通贵族</h4></td>'],
            icon = ['<td><h4>贵族标识</h4></td>'], //icon
            openMoney = ['<td><h4>开通价格</h4></td>'], //开通价格
            giftmoney = ['<td><h4>首开礼包</h4></td>'], //首开礼包
            giftLevel = ['<td><h4>赠送爵位</h4></td>'], //爵位赠送
            gmountName = ['<td><h4>专属座骑</h4></td>'], //专属坐骑
            allowVisitRoom = ['<td><h4>房间限制</h4></td>'], //房间限制
            modNickname = ['<td><h4>改名限制</h4></td>'], //改名限制
            hasWelcome = ['<td><h4>特效欢迎语</h4></td>'], //特效欢迎语
            hasChatEffect = ['<td><h4>聊天特效</h4></td>'], //聊天特效
            chatSecond = ['<td><h4>发送文字特权</h4></td>'], //发送文字特权
            hasVipSeat = ['<td><h4>贵宾席位</h4></td>'], //贵宾席位
            noChat = ['<td><h4>防禁言</h4></td>'], //防禁言
            noChatLimit = ['<td><h4>禁言</h4></td>'], //禁言
            avoidOut = ['<td><h4>防踢人</h4></td>'], //防踢人
            letOut = ['<td><h4>踢人</h4></td>'], //踢人
            table = [],
            tableBody = "";

        for(var i = 0; i<info.length; i++) {
            var infoCell = Noble.changeNobleData(info[i]),
                system = infoCell['system'],
                permission = infoCell['permission'];

            levelName.push('<td><h4>'+infoCell['level_name']+'</h4></td>');
            open.push('<td>'+'<button class="btn btn-xs J-noble-charge" data-groupid="'+infoCell['gid']+'">开通</button>'+'</td>');
            icon.push('<td>'+infoCell['level_id_icon']+'</td>');
            openMoney.push('<td>'+system['open_money']+'</td>');
            giftmoney.push('<td>'+system['gift_money']+'</td>');
            giftLevel.push('<td>'+system['gift_level']+'</td>');
            gmountName.push('<td>'+infoCell['g_mount']['name']+'</td>');
            allowVisitRoom.push('<td>'+permission['allowvisitroom']+'</td>');
            hasWelcome.push('<td>'+permission['haswelcome']+'</td>');
            modNickname.push('<td>'+permission['modnickname']+'</td>');
            hasChatEffect.push('<td>'+permission['haschateffect']+'</td>');
            chatSecond.push('<td>'+permission['chatsecond'] + ' ' + permission['chatlimit']+'</td>');
            hasVipSeat.push('<td>'+permission['hasvipseat']+'</td>');
            noChat.push('<td>'+permission['nochat']+'</td>');
            noChatLimit.push('<td>'+permission['nochatlimit']+'</td>');
            avoidOut.push('<td>'+permission['avoidout']+'</td>');
            letOut.push('<td>'+permission['letout']+'</td>');
        }

        table = [levelName,open,icon,openMoney,giftmoney,giftLevel,gmountName,allowVisitRoom,modNickname,hasWelcome,hasChatEffect,chatSecond,hasVipSeat,noChat,noChatLimit,avoidOut,letOut];

        for(var i=0; i < table.length; i++) {
            tableBody += "<tr>"+ table[i].join("") +"</tr>";
        }
        $('.noble-table').html(tableBody);


        //绑定开通贵族事件
        bindNobleChargeDialogEvent();
    });
    
});