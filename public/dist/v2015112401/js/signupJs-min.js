$(function(){var a=$("#singup"),b=function(a){var b=$("#realName"),c=$("#phoneNum"),d=$("#qqNum"),e=$("#bDay"),f=$("#valTip"),g=$("#bankNum"),h=$("#bankName"),i=$("#bankAddr");return Validation.isAccount(b.val())?Validation.isDate(e.val())?Validation.isMobile(c.val())?Validation.isQQ(d.val())?Validation.isBankNum(g.val())?Validation.isBankName(h.val())?i.val().length>30||i.val().length<4?void f.text("请输入正确的银行卡开户地址"):(f.text(""),void(a&&a())):void f.text("请输入正确的银行卡开户名"):void f.text("请输入正确的银行卡号"):void f.text("请输入正确的qq号码"):void f.text("请输入正确的手机号码"):void f.text("请输入正确的日期格式（例:2005-12-12）"):void f.text("真实姓名请输入中英文数字下划线2-8个字符")};a.on("click","#stepFrom",function(){var a=$("#singup").serialize();b(function(){$.ajax({url:"/business/signup",data:a,type:"POST",success:function(a){var b=$.dialog({title:"提交",content:a.info+' <span class="time-count"></span>',cancel:function(){},cancelValue:"关闭",onshow:function(){}});if(0==a.code){b.show();var c=5,d=setInterval(function(){0==c&&(clearInterval(d),location.href="/"),$(".time-count").html(c+"秒后自动跳转, <a href='/' class='forange'>立即跳转</a>"),c--},1e3)}else{b.show();var c=3,e=setInterval(function(){0==c&&(b.remove(),clearInterval(e)),$(".time-count").text(c+"秒后自动关闭"),c--},1e3)}},error:function(){$.tips("基本资料提交失败")}})})})});