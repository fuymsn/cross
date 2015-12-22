/**
 * @description 加入主播表单填写
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){
	var $form = $("#singup");

	var formValidation = function(cb){
		var $realName = $("#realName"),
			$phoneNum = $("#phoneNum"),
			$qqNum = $("#qqNum"),
			$bDay = $("#bDay"),
			$valTip = $("#valTip"),
            $bankNum = $("#bankNum"),
            $bankName = $("#bankName"),
            $bankAddr = $("#bankAddr");

		if(!Validation.isAccount($realName.val())) {
			$valTip.text("真实姓名请输入中英文数字下划线2-8个字符");
			return;
		};

		if(!Validation.isDate($bDay.val())){
			$valTip.text("请输入正确的日期格式（例:2005-12-12）");
			return;
		}

		if(!Validation.isMobile($phoneNum.val())){
			$valTip.text("请输入正确的手机号码");
			return;
		}

		if(!Validation.isQQ($qqNum.val())){
			$valTip.text("请输入正确的qq号码");
			return;
		}

        if (!Validation.isBankNum($bankNum.val())) {
            $valTip.text("请输入正确的银行卡号");
            return;
        };

        if (!Validation.isBankName($bankName.val())) {
            $valTip.text("请输入正确的银行卡开户名");
            return;
        };

        if ($bankAddr.val().length > 30 || $bankAddr.val().length < 4) {
            $valTip.text("请输入正确的银行卡开户地址");
            return;
        };

        //清楚提示框
        $valTip.text("");

		if (cb) { cb()};
	}

	$form.on("click", "#stepFrom", function(){
		var formData = $("#singup").serialize();

		formValidation(function(){
			$.ajax({
				url: "/business/signup",
				data: formData,
				type: "POST",
				success: function(json){

                    var sucTips = $.dialog({
                        title: "提交",
                        content: json.info + ' <span class="time-count"></span>',
                        cancel: function(){},
                        cancelValue: "关闭",
                        onshow: function(){

                        }
                    });

					//code handle
					if (json.code == 0) {
                        sucTips.show();

						var timeCount = 5;
						var c = setInterval(function(){
							if (timeCount == 0) {
								clearInterval(c);
								location.href = "/";
							};

							$(".time-count").html(timeCount + "秒后自动跳转, <a href='/' class='forange'>立即跳转</a>");
							timeCount --;
						}, 1000);
					}else{
                        sucTips.show();

                        var timeCount = 3;
                        var a = setInterval(function(){
                            if (timeCount == 0) {
                                sucTips.remove();
                                clearInterval(a);
                            };
                            
                            $(".time-count").text(timeCount + "秒后自动关闭");
                            timeCount --;
                        }, 1000);
                    };
				},
				error: function(){
					$.tips("基本资料提交失败");
				}
			});
		});

	});

});