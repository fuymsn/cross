/**
 * @description 个人中心首页
 * @author Young
 * @contacts young@kingjoy.co
 */

var uploadDialog;
var flashEventHandler = function(data){
    data = JSON.parse(data);
    if( data.ret == null ){
        return;
    }
    if( data.ret){
        selImg = window.IMG_PATH + "/"+ data.info.md5;
        uploadDialog.remove();
        $('input[name="headimg"]').val(selImg);
        $('#userimg').attr('src', selImg);
    }else{
        $.tips('文件上传失败'+ data.info);
    }
}

$(function() {

    var flashObj = ['<object width="689" height="506" type="application/x-shockwave-flash" data="/public/js/widget/avatar.swf" id="avatarflashNode">',
        '<param name="flashvars" value="saveUrl=/upload&amp;callback=flashEventHandler&amp;thumbList=150|80|40&amp;urlPic=/public/images/head_150.png">',
        '<param name="allowScriptAccess" value="always">',
        '<param name="wmode" value="opaque">',
    '</object>'].join("");

    if (!$.support.opacity) {
        flashObj = ['<object width="689" height="506" type="application/x-shockwave-flash" data="" id="avatarflashNode">',
                '<param name="flashvars" value="saveUrl=/upload&amp;callback=flashEventHandler&amp;thumbList=150|80|40&amp;urlPic=/public/images/head_150.png">',
                '<param name="allowScriptAccess" value="always">',
                '<param name="wmode" value="opaque">',
                '<param name="movie" value="/public/js/widget/avatar.swf">',
            '</object>'].join("");
    };

    uploadDialog = $.dialog({
        title: "图片上传",
        content: flashObj
    });

    //上传插件dialog弹窗
    $(".editPic").on("click", function(){
        uploadDialog.show();
    });

    //用户中心打开新窗口方法
    $('.J-edit').on("click", function() {
        $(this).closest('.perDetails').addClass('none');
        $('.perEditDetails').removeClass('none');
    });

    wordsCount($(".description"), $(".description-tip"), 30);

    $('#infoSubmit').on("click", function(){
        var $input = $('table.J-perEdit').find('input:not(:radio)');
        if( $('input[name="nickname"]').val()==''){
            $.tips("请填写昵称");
            return;
        }else if(!Validation.isAccount($.trim($('input[name="nickname"]').val()))){
            $.tips("昵称不能使用/:;空格,等特殊符号！(2-8位的昵称)");
            return;
        };

        if( $('input[name="birthday"]').val()==''){
            $.tips("填写生日信息");
            return;
        }

        var params = {};
        var picmd5 = $('input[name="headimg"]').val().split('/');
        $('input[name="headimg"]').val(picmd5[picmd5.length-1]);
        $input.each(function(item,index){
            params[$(this).attr('name')] = $(this).val();
        });

        var $select =  $('table.J-perEdit').find('select'),pca='province,city,county';
        $select.each(function(item,index){
            if( pca.indexOf($(this).attr('name')) > -1 ){
                params[$(this).attr('name')] =  $('#'+$(this).attr('name')).find('option:checked').attr('code');
            }else{
                params[$(this).attr('name')] = $(this).val();
            }
        });
        params['sex'] = $('.sex:checked').val();
        params['description'] = $('textarea').val();
        $.ajax({
            url:'/member/edituserinfo',
            data: params,
            dataType: "json",
            method:'post',
            success: function(data, textStatus, jqXhr){
                if( data.ret ){
                    $.tips('更新成功', function(){
                        location.href = '/member/index';
                    });
                }else{
                    $.tips(data.info);
                }
            }
        });
    });

});