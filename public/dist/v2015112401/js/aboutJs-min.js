/*! cross-framework - v0.1.2 - 2015-12-21 */var helpHandle=function(){var a="",b=["登陆注册类","充值提款类","优惠活动类","客服服务类","投诉意见类"];wordsCount($("#helpTextarea"),$(".displaySuggestion").find(".tool-num"),200),$.each(b,function(b,c){a+="<option value='"+b+"'>"+c+"</option>"}),$("#helpSelCat").html(a)},scrollAction=function(){var a=window.location.hash,b=$(a);if(b.length>0){var c=b.offset().top-b.height()-90;$("html,body").animate({scrollTop:c},100),b.find(".help-qa-answer").show()}};$(function(){scrollAction(),$(".i-a").on("click",function(){var a=$(this).closest(".help-qa-item");a.find(".help-qa-answer").slideToggle(200)});var a=$.dialog({title:"我要扩建",content:"<div class='displayStrenth'></div>"}),b=$.dialog({title:"投诉与建议",content:['<div class="displaySuggestion">','<div class="display-item">','<label for="helpSelService">','<span class="d-help-title">投诉客服</span>','<input id="helpSelService" class="d-help-ser-ipt" />',"</label>",'<label for="helpSelCat">','<span class="d-help-title">投诉与建议业务类别</span>','<select id="helpSelCat"><option>ob</option></select>',"</label>","</div>",'<textarea id="helpTextarea" class="d-help-ta textarea"></textarea>','<div class="tool clearfix">','<span class="tool-tips">',"还能输入",'<span class="tool-num">200</span>',"字","</span>",'<button class="btn d-help-sub">发送</button>',"</div>","</div>"].join(""),onshow:function(){var a=this;return User.isLogin()?($("#helpSelService").val(""),$("#helpTextarea").val(""),$(".d-help-sub").on("click",function(){var b=$("#helpSelService").val(),d=$("#helpTextarea").val(),e=$("#helpSelCat").val();$.ajax({url:"/complaints",type:"POST",dataType:"json",data:{sername:b,sertype:e,sercontent:d},success:function(b){b.ret?(a.remove(),c.show()):(a.remove(),$.tips("您本日使用投诉与建议次数已达上限，请明天再试或直接联系在线客服处理。"))},error:function(){}})}),void helpHandle()):(a.remove(),void $.tips("请登录后再操作"))}}),c=$.dialog({title:"提交成功",content:['<div class="finishSuggestion">',"亲爱的用户，感谢您宝贵的意见和建议，第一坊将尽快处理该问题，并在3个工作日内以站内短信的方式回复您，请您注意查看哦！","</div>"].join(""),cancel:function(){},cancelValue:"关闭"});$(".help-apply-arc").on("click",function(){a.show()}),$(".help-apply-sug").on("click",function(){b.show()})});