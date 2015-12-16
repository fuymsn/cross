
/**
 * @description 帮助下拉菜单切换处理
 * @author Young
 * @contacts young@kingjoy.co
 */
var helpHandle = function(){

	var optionTmp = "",
		optionArr = ["登陆注册类", "充值提款类", "优惠活动类", "客服服务类", "投诉意见类"];

	wordsCount($("#helpTextarea"), $(".displaySuggestion").find(".tool-num"), 200);

	$.each(optionArr, function(i, t){
		optionTmp += "<option value='"+ i +"'>" + t + "</option>";
	});

	$("#helpSelCat").html(optionTmp);

}

/**
 * 帮助页面锚点定位
 * @return {[type]} [description]
 */
var scrollAction = function(){
	var hash = window.location.hash,
	$mao = $(hash); //获得锚点
	if ($mao.length > 0) { //判断对象是否存在
		var moveDist = $mao.offset().top -  $mao.height() - 90;
		$("html,body").animate({ scrollTop:  moveDist}, 100);
		$mao.find('.help-qa-answer').show();
	}
}

$(function(){

	scrollAction();

	//qa问答下拉面板事件绑定
	$(".i-a").on("click", function(){
		var $parent = $(this).closest(".help-qa-item");
		$parent.find(".help-qa-answer").slideToggle(200);
	});

	var complaintsTimes = 0;
	//我要扩建dialog
	var dialogStrenth = $.dialog({
		title: "我要扩建",
		content: "<div class='displayStrenth'></div>"
	});

	//投诉与建议dialog
	var dialogSug = $.dialog({
		title: "投诉与建议",
		content: ['<div class="displaySuggestion">',
            	'<div class="display-item">',
            		'<label for="helpSelService">',
            			'<span class="d-help-title">投诉客服</span>',
            			'<input id="helpSelService" class="d-help-ser-ipt" />',
            		'</label>',
            		'<label for="helpSelCat">',
            			'<span class="d-help-title">投诉与建议业务类别</span>',
            			'<select id="helpSelCat"><option>ob</option></select>',
            		'</label>',
            	'</div>',
            	'<textarea id="helpTextarea" class="d-help-ta textarea"></textarea>',
                '<div class="tool clearfix">',
                    '<span class="tool-tips">',
                        '还能输入',
                        '<span class="tool-num">200</span>',
                        '字',
                    '</span>',
                    '<button class="btn d-help-sub">发送</button>',
                '</div>',
            '</div>'].join(""),
        onshow: function(){
        	
        	var that = this;
        	//判断是否登录
			if (!User.isLogin()) {
				that.remove();
				$.tips("请登录后再操作");
				return;
			}

			//清空数据
			$("#helpSelService").val("");
			$("#helpTextarea").val("");

			//提交textarea和下拉菜单数据
			$(".d-help-sub").on("click", function(){

				var serName = $("#helpSelService").val(),
					textArea = $("#helpTextarea").val(),
					cat = $("#helpSelCat").val();

				$.ajax({
					url: "/complaints",
					type: "POST",
					dataType: "json",

					data: {
						sername: serName,
						sertype: cat,
						sercontent: textArea
					},

					success: function(json){
						if (json.ret) {

							that.remove();
							dialogFinish.show();

						}else{

							that.remove();
							$.tips("您本日使用投诉与建议次数已达上限，请明天再试或直接联系在线客服处理。");
						};
					},

					error: function(){

					}
				});

			});

			helpHandle();

        }
	});
	
	//提交成功dialog
	var dialogFinish = $.dialog({
		title: "提交成功",
		content: ['<div class="finishSuggestion">',
            	'亲爱的用户，感谢您宝贵的意见和建议，第一坊将尽快处理该问题，并在3个工作日内以站内短信的方式回复您，请您注意查看哦！',
            '</div>'].join(""),
        cancel: function(){},
        cancelValue: "关闭"
	});

	//点击我要扩建，显示dialog
	$(".help-apply-arc").on("click", function(){
		dialogStrenth.show();
	});

	//点击帮助建议，显示dialog
	$(".help-apply-sug").on("click", function(){
		dialogSug.show();
	});

});