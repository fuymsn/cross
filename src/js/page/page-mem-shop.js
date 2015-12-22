/**
 * @description 个人中心商城页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){
    //商城按钮切换方法

    var shoppingHTMLTmp = ['<div class="payContent clearfix">',
        '<div class="payleft">',
            '<ul class="shop-item payInfo">',
                '<li><img src="#{img}" alt="" /></li>',
                '<li class="forange">#{name}</li>',
                '<li>价格：#{price}<img src="'+ Config.imagePath +'/diamond.jpg" alt="" />/月</li>',
            '</ul>',
            '<ul class="payTips">',
                '<li>按月购买：30天/月<br/>按年购买：365天/年</li>',
                '<li>商品有效期内购买本商品，有效期累加。<br/>其他情况，有效期从购买时算起。</li>',
            '</ul>',
        '</div>',
        '<div class="payright">',
            '<table class="table-form">',
                '<thead>',
                '<tr>',
                    '<th>开通账号：</th>',
                    '<td class="bold">#{nickname}</td>',
                '</tr>',
                '</thead>',
                '<tbody>',
                '<tr>',
                    '<th>购买方式：</th>',
                    '<td id="payBtn"><button class="btn-red">按月付费</button><button>按年付费</button><img src="'+ Config.imagePath +'/discount.jpg" alt="" class="discount" /></td>',
                '</tr>',
                '<tr class="pr" id="numBox">',
                    '<th>购买时长：</th>',
                    '<td><input type="text" value="1" id="numId" class="txt"/>',
                        '<div class="datePanel none">',
                            '<ul>',
                                '<li>1</li>',
                                '<li>2</li>',
                                '<li>3</li>',
                                '<li>4</li>',
                                '<li>5</li>',
                                '<li>6</li>',
                                '<li>7</li>',
                                '<li>8</li>',
                                '<li>9</li>',
                                '<li>10</li>',
                                '<li>11</li>',
                                '<li>12</li>',
                            '</ul>',
                        '</div><span id="dateTitle">个月</span></td>',
                '</tr>',
                '<tr>',
                    '<th>应付金额：</th>',
                    '<td class="bold"><span id="total-price">#{price}</span><img src="'+ Config.imagePath +'/diamond.jpg" alt="" /></td>',
                '</tr>',
                '<tr>',
                    '<th>当前余额：</th>',
                    '<td class="bold"><span id="current-price" class="fred">#{money}</span><img src="'+ Config.imagePath +'/diamond.jpg" alt="" /></td>',
                '</tr>',
                '<tr class="pay-tip">',
                    '<th></th>',
                    '<td><img src="'+ Config.imagePath +'/pay-close.jpg" alt="" /><span class="fred">您的余额不足，请充值！</span></td>',
                '</tr>',
                '<tr>',
                    '<th></th>',
                    '<td>',
                        '<button class="btn btn-pay">购买</button>',
                        '<a href="/charge/order" class="btn btn-charge none">充值</a>',
                    '</td>',
                '</tr>',
                '</tbody>',
            '</table>',
        '</div>',
    '</div>'].join("");

    //总价变更
    var totalPrice = function($ul,$timeIpt){
        var btext = $('#payBtn').find('.btn-red').text();
        if (btext === "按月付费") {
            $('#total-price').html(Number($timeIpt.val()) * $ul.data('price'));
        }else{
            $('#total-price').html(parseInt(Number($timeIpt.val()) * $ul.data('price') * 12 * 0.9), 10);
        }
    }

    var priceCheck = function(){
        var $totalPrice = $('#total-price'),
            $currentPrice = $('#current-price'),
            $btnCharge = $(".btn-charge"),
            $payTip = $(".pay-tip");

        if (parseInt($.trim($totalPrice.text(), 10)) > parseInt($.trim($currentPrice.text(), 10))) {
            $btnCharge.removeClass("none");
            $payTip.show();
        }else{
            $btnCharge.addClass("none");
            $payTip.hide();
        };
    }

    $('#goods-list').find('.payBtn').on('click',function(){
        var $ul = $(this).parents('ul');

        //获取金额
        Shop.getMoney(function(data){

            switch(data.code){

                case 101:
                    $.dialog({
                        title: "提示",
                        content: "登陆后才可购买",
                        okValue: "立即登录",
                        ok: function(){
                            $(".login").trigger("click");
                        },
                        cancelValue: "关闭",
                        cancel: function(){}
                    }).show();
                    break;
                

                case 0:

                    var data = data.info;
                    data.img = $ul.find('.payImg').attr("src");
                    data.price = $ul.data('price');
                    data.name = $ul.find(".forange").text();

                    //生成模板
                    var tmp = Utility.template(shoppingHTMLTmp, data);

                    //初始化dialog
                    var shopDialog = $.dialog({
                        title:"购买道具",
                        content:tmp,
                        onshow: function(){
                            //初始化充值按钮是否隐藏功能
                            priceCheck();
                        }
                    });

                    shopDialog.show();

                    var $timeIpt = $('#numId'),
                        $dateSwitch = $('#payBtn'),
                        $dateTitle = $('#dateTitle'),
                        $timePanel = $('.datePanel');

                    //商城选择数字面板
                    $timeIpt.on('focus',function() {
                        $timePanel.removeClass('none');
                        $timePanel.find('li').on("click", function() {
                            $timeIpt.val($(this).text());
                            $timePanel.addClass('none');
                            totalPrice($ul,$timeIpt);
                            priceCheck();
                        });
                    });

                    $timeIpt.on("keyup", function(){
                        $timePanel.addClass('none');
                    });

                    //商城按钮切换方法
                    $dateSwitch.on('click', 'button', function() {
                        $dateSwitch.find('button').removeClass('btn-red');
                        $(this).addClass('btn-red');
                        var btext = $(this).text();
                        if (btext === "按月付费") {
                            $dateTitle.text('个月');
                        }else{
                            $dateTitle.text('年');
                        };

                        totalPrice($ul, $timeIpt);

                        priceCheck();

                    });
                    
                    //购买道具，点击购买按钮
                    var $payBtn = $('.payContent').find('.btn-pay');

                    $payBtn.off('click');
                    $payBtn.on('click',function(){

                        if (!Validation.isPositiveInteger(Number($timeIpt.val()))) {
                            $.tips("月份数输入不正确，请重新输入（月份数不可为小数）");
                            shopDialog.remove();
                            return;
                        };

                        $.ajax({
                            url: '/member/pay',
                            data: {
                                gid: $ul.data('gid'),
                                nums: $timeIpt.val(),
                                type: $('#payBtn').find('button').index($('#payBtn').find('.btn-red'))
                            },
                            dataType: 'json',
                            type: "POST",
                            success: function(json){

                                shopDialog.remove();

                                if(json.ret){
                                    Shop.showEquipComfirmDialog({gid: $ul.data('gid')});
                                }else{
                                    $.dialog({
                                        title: "提示",
                                        content: "购买失败，您的余额不足，或输入月份不正确！",
                                        ok: function(){
                                            location.href = "/charge/order";
                                        },
                                        okValue: "去充值",
                                        cancel: function(){},
                                        cancelValue: "取消"
                                    }).show();
                                }
                                
                            },
                            error: function(){

                            }
                        });

                    });

            }

        });

    });
    

    //当装备过期，然后跳转至商城可直接弹窗购买。
    var urlParamGID = getLocation("gid");

    $.each($('#goods-list > ul'), function(i, e){
        if (($(e).data("gid") + "") == urlParamGID) {
            $(e).find(".payBtn").trigger("click");
        };
    });

    //url传参为noble的时候，tab切换到贵族专属开通
    var urlParamHandle = getLocation("handle");
    if (urlParamHandle == "noble") {
        $("#tabNoble").trigger("click");
    };

    $("#cChargeBtn").on("click", function(){
        if (User.isLogin()) {
            location.href = "/charge/order";
        }else{

            var chargeDialog = $.dialog({
                title: "提示",
                content: "请登录后再充值",
                okValue: "去登录",
                ok: function(){
                    //chargeDialog.close();
                    $(".login").trigger("click");
                },
                cancelValue: "取消",
                cancel: function(){}
            }).show();

        };
    });

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

    //绑定贵族道具弹窗事件
    var bindNoblePropsDialogEvent = function(){
        $(".J-noble-prop").on("click", function(e){
            var $that = $(this);
            var mid = $that.closest(".shop-item").data("gid");
            var groupid = $that.closest(".shop-item").data("groupid");

            //获取坐骑
            Noble.getProp({
                "mid": mid
            }, function(json){

                switch(json.code){
                    //直接装备坐骑
                    case 0:
                        //是否装备坐骑弹窗
                        Shop.showEquipNobleComfirmDialog({ "gid": mid });
                        break;

                    //未登录
                    case 101:
                        $.tips("请登录后再获取坐骑！");
                        break;

                    //已经领过了
                    case 1002:
                        $.tips(json.msg);
                        break;

                    //开通贵族
                    case 1003:
                    case 1005:
                        //开通贵族弹窗
                        Noble.showGetPropsDialog($that.closest(".shop-item"), function(){
                            $("#groupList").find(".J-noble-charge").filter("[data-groupid='"+ groupid +"']").trigger("click");
                        });
                        
                        break;
                    default:
                        $.tips(json.msg);
                }

            });
        });
    }

    bindNobleChargeDialogEvent();
    bindNoblePropsDialogEvent();

});

