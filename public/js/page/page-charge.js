/**
 * @description 充值页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){
	//标记支付状态
	var markCharge = function(orderId, sucCb){
	    $.ajax({
	        url: "/charge/checkCharge",
	        data: { "orderId": orderId},
	        dataType: "json",
	        type: "GET",
	        success: function(res){
	            if (sucCb) {sucCb(res)};
	        },
	        error: function(){

	        }
	    });
	}
	//充值记录页面删除操作
	var delItem = function(d){
		$.ajax({
			url: "/charge/del",
			type: "POST",
			data: {"lid": d.id},
			dataType: "json",
			success: function(json){
				if (json.ret) {
					$.tips(json.info);
					d.target.closest("tr").remove();
				}else{
					$.tips(json.info);
				};
			},
			error: function(){
				$.tips("删除失败");
			}
		});
	}

	//绑定充值记录页面事件
	$(document).on("click", ".charge-del", function(){
		var data = {};
		data.target = $(this);
		data.id= $(this).data("id");

		delItem(data);
	});

	$(document).on("click", ".charge-unknown", function(){
		var tradeNo = $(this).data("tradeno");
		var dialogFinishState = $.dialog({title:"提示", content:"正在获取状态，请稍等"}).show();

		markCharge(tradeNo, function(res){
			$.tips(res.msg);
			dialogFinishState.remove();
		});
	});


	//充值页面点击按钮提交充值额度
	$("#chargePay").on("click", function(){

		var $tipsBox = $(".charge-tips");
		var inputPrice = $("#chargeIpt").val();

		var $chargePrice = $("input[name='charge-price']");
		var $chargeChannel = $("#chargePlat");
		var $chargeIptRadio = $("#chargeIptRadio");

		if (!$chargePrice.is(":checked")) {
			$tipsBox.text("请选择要充值的金额");
			return;
		};

		if ($chargeIptRadio.is(":checked") && (!$.isNumeric(inputPrice) || !/^[1-9]\d*$/.test(inputPrice) || parseInt(inputPrice, 10) < 10 || parseInt(inputPrice, 10) > 100000)) {
			$tipsBox.text("请填写正确的金额");
			return;
		};

		//radio 表单值
        var radioPrice = $chargePrice.filter(":checked").val();

        //充值金额
        var price = Number(radioPrice) != -1 ? radioPrice : inputPrice;

        //创建一个新窗口
        var newWindow = window.open();

        //请求跳转链接key

        $.ajax({
            url: "/charge/pay",
            data: {
                "price": price,
                "vipLevel": $chargeChannel.val()
            },
            dataType: "json",
            type: "POST",
            success: function(res){
				//是否已经提交成功            	
                if (!res.status) {
                    var dialogPayState = $.dialog({
                        title: "支付状态",
                        id: "dialogChargeState",
                        content: "<p>充值金额：" + price + "元<br/></p>",
                        onshow: function(){
                        	$("#dialogChargeState").on("click", function(){
                        		markCharge(res.msg.orderId);
                        	});
                        },
                        okValue: "已完成支付",
                        ok: function(){

                        	//获取充值状态
                        	var makeSureMarkCharge = function(){

                        		var dialogFinishState = $.dialog({title:"提示", content:"正在获取状态，请稍等"}).show();

	                        	markCharge(res.msg.orderId, function(json){
	                        		//如果返回0，则能够获取状态，即成功，失败，或交易未知
	                        		if(!json.status){
	                        			location.href = "/member/charge";
	                        		}else{
	                        		//如果返回1，即程序内部问题
	                        			$.dialog({
	                        				title: "提示",
	                        				content: json.msg,
	                        				ok: function(){
	                        					makeSureMarkCharge();
	                        					return false;
	                        				},
	                        				okValue: "再次向系统确认",
	                        				cancel: function(){},
	                        				cancelValue: "关闭"
	                        			}).show();
	                        		}

	                        		dialogFinishState.remove();
	                        	});
                        	}

                        	makeSureMarkCharge();
                        }
                    });

                    dialogPayState.show();

                    newWindow.location.href = res.msg.gotourl;
                }else{
                	$.tips(res.msg);
                };

            },
            error: function(res){
                console.log(res);
            }
        });
	});

	$("[name='charge-price']").on("click", function(){
		$(".charge-tips").html("");
	});

	//url带msg参数
	if (!!getLocation("msg")) {
		$.tips(getLocation("msg"));
	};

	//url带radioprice参数
	if (!!getLocation("radioprice")) {
		var price = getLocation("radioprice");
		var $radio = $("[type=radio][value=" + price + "]");
		var $input = $("#chargeIpt");
		if ($radio.length) {
			$radio.prop("checked", true);
		}else{
			$("#chargeIptRadio").prop("checked", true);
			$input.val(price);
		};
		
	};

	//选择自行输入选项，焦点聚焦到input
	$("#chargeIptBox").on("click", function(){
		$("#chargeIpt").focus();
	});

	$("#chargeIpt").on("click", function(){

		$("#chargeIptRadio").prop("checked", true);

	}).on("keyup", function(){

		var num = 0;
		var val = $(this).val();
		var $inputBox = $(this).parent("span").siblings(".charge-diamond");
		var $tipsBox = $(".charge-tips");

		//最多充值100000元
		if($.isNumeric(val) && parseInt(val, 10) > 100000){

			num = parseInt(val, 10);
			$inputBox.text((num * 10) + "钻石");
			$tipsBox.text("最多充值100000元");

		//最少充值10元
		}else if($.isNumeric(val) && parseInt(val, 10) < 10){

			$tipsBox.text("最少充值10元");

		//符合标准
		}else if($.isNumeric(val) && /^[1-9]\d*$/.test(val) && parseInt(val, 10) >= 10 && parseInt(val, 10) <= 100000){
			
			num = parseInt(val, 10);
			$inputBox.text((num * 10) + "钻石");
			$tipsBox.text("");

		//不可输入0，小数，负数，字母和特殊符号
		}else{

			$inputBox.text("");
			$tipsBox.text("不可输入0，小数，负数，字母和特殊符号");

		};

	});

});