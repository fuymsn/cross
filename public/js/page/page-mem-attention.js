/**
 * @description 个人中心关注页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){

    getPanelData($(".watch-content"));
    
    //取消关注
    $('.cancelBtn').on("click", function(){
        var $this = $(this);
        $.ajax({
            url: '/focus',
            data: { pid: $this.parents('li').data('rel'), ret: 2 },
            type: "GET",
            dataType: "json",
            success: function(json){
                if (json.status) {
                    $this.parents('li').remove();
                }else{
                    alert(json.msg);
                };
            },
            error: function(){

            }
        });
    });


});

