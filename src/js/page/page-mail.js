/**
 * @description 安全邮箱确认相关页面
 * @author Young
 * @contacts young@kingjoy.co
 */

/**
 * @description 将时间戳转换为分钟和秒钟
 * @param msd: 时间戳
 * @return tn: string 分钟和秒钟
 * @author Young
 * @contacts young@kingjoy.co
 */

function millisecondToDate(msd) {
    var minutes = Math.floor(msd/60/1000);
	var seconds = (msd - minutes *60*1000)/1000;
	var tn = "";
	if (minutes == 0) {
		tn = seconds + "秒";
	}else{
		tn = minutes + "分" + seconds + "秒";
	};
    return tn;
}


function timeCount(time){
	var timeCount = setInterval(function(){
		var $btn = $(".mail-btn-box").find(".btn");
		var $mailIpt = $("#sMailComfirm");

		if (time <= 0) {
			$btn.removeClass("btn-disabled").addClass("btn-orange");
			$btn.prop("disabled", false);
			$(".mail-btn-tips-time").text("0秒");
			$mailIpt.prop("disabled", false);
			clearTimeout(timeCount);
		}else{
			var timeNow = millisecondToDate(time);
			$(".mail-btn-tips-time").text(timeNow);
			time = time - 1000;
		};

	}, 1000);
}

$(function(){
	var $btn = $(".mail-btn-box").find(".btn");
	var $mailIpt = $(".mail").find('.mail-ipt');
	$mailIpt.accountInput(".mail-ipt-tips");

	var $pwdIpt = $(".mail").find("#newPwd");
	var $pwdIptAgain = $(".mail").find("#newPwdAgain");
	$pwdIpt.passwordInput(".pwd-ipt-tips");
	$pwdIptAgain.passwordAgain("#newPwd", ".pwdagain-ipt-tips");

	if ($("#pageMailSend").length) {
		var time = 600000;
		timeCount(time);
	};

	if ($("#pagePwdSend").length) {
		$("#pwdSendBtn").on("click", function(){
			$("#getPwd").trigger("focus");
			if ($(".mail-ipt-tips").text().length == 0) {
				$("#pwdSendForm").submit();
			};
		});
	};

	if ($("#pagePwdChange").length) {
		$("#pwdChangeBtn").on("click", function(){
			$("#newPwd").trigger("focus");
			$("#newPwdAgain").trigger("focus");

			if ($(".pwd-ipt-tips").text().length == 0 && $(".pwdagain-ipt-tips").text().length == 0) {
				$("#pwdChangeForm").submit();
			};
		});
	};

	if ($("#pageMailVerific").length) {
		$("#mailVerificBtn").on("click", function(){
			$("#sMail").trigger("focus");

			if ($(".mail-ipt-tips").text().length == 0) {
				$("#mailVerificForm").submit();
			};
		});
	};

	//重发安全邮箱
	// $("#resendMail").on("click", function(){
	// 	if (!$(this).prop("disabled")) {
	// 		$btn.prop("disabled", true);
	// 		$(".mail-btn-tips-time").text("10分钟");
	// 		$btn.removeClass("btn-orange").addClass("btn-disabled");
	// 		var time = 60000;
	// 		timeCount(time);
	// 	};
	// });

});