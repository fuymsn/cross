/*! cross-framework - v0.1.2 - 2015-12-22 */function millisecondToDate(a){var b=Math.floor(a/60/1e3),c=(a-60*b*1e3)/1e3,d="";return d=0==b?c+"秒":b+"分"+c+"秒"}function timeCount(a){var b=setInterval(function(){var c=$(".mail-btn-box").find(".btn"),d=$("#sMailComfirm");if(0>=a)c.removeClass("btn-disabled").addClass("btn-orange"),c.prop("disabled",!1),$(".mail-btn-tips-time").text("0秒"),d.prop("disabled",!1),clearTimeout(b);else{var e=millisecondToDate(a);$(".mail-btn-tips-time").text(e),a-=1e3}},1e3)}$(function(){var a=($(".mail-btn-box").find(".btn"),$(".mail").find(".mail-ipt"));a.accountInput(".mail-ipt-tips");var b=$(".mail").find("#newPwd"),c=$(".mail").find("#newPwdAgain");if(b.passwordInput(".pwd-ipt-tips"),c.passwordAgain("#newPwd",".pwdagain-ipt-tips"),$("#pageMailSend").length){var d=6e5;timeCount(d)}$("#pagePwdSend").length&&$("#pwdSendBtn").on("click",function(){$("#getPwd").trigger("focus"),0==$(".mail-ipt-tips").text().length&&$("#pwdSendForm").submit()}),$("#pagePwdChange").length&&$("#pwdChangeBtn").on("click",function(){$("#newPwd").trigger("focus"),$("#newPwdAgain").trigger("focus"),0==$(".pwd-ipt-tips").text().length&&0==$(".pwdagain-ipt-tips").text().length&&$("#pwdChangeForm").submit()}),$("#pageMailVerific").length&&$("#mailVerificBtn").on("click",function(){$("#sMail").trigger("focus"),0==$(".mail-ipt-tips").text().length&&$("#mailVerificForm").submit()})});