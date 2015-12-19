/**
 * @description 同意加入主播确认信息
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){

    var cap = new Captcha();

    $("#btnAgree").on("click", function(){
        var loginState = $("#loginState").val();

        if (loginState == 0) {
            //打开弹出窗
            $(".login").trigger("click");
            cap.flashCaptcha($("#lsCode"));

        }else{
            location.href = "/business/signup";
        };
    });

});