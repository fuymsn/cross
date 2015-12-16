/**
 * @description 个人中心主播页面
 * @author Young
 * @contacts young@kingjoy.co
 */

var baseURL = '/member/anchor',
    divId = 0;

//删除操作
var delHanlder = function(id){

    $.ajax({
        url: baseURL,
        data: { handle: "del", id: id },
        type: "GET",
        dataType: "json",
        success: function(data){
            var d = data;

            if(!d.code){
                $('#'+id).remove();
                $('#piccount').text( parseInt($('#piccount').text()) - 1);
            }else{
                $.tips(d.info);
            }

        }
    });
};

$(function() {

    var delConfirm = $.dialog({
        title: "删除提示",
        content: "图片删除后不可恢复。",
        ok: function(){
            var id = this.buttonTarget.parents('dl').attr('id');
            delHanlder(id);
        },
        cancel: function(){}
    });

    var editDialog = $.dialog({
        title: "图片编辑",
        content: ['<table><tr>',
                '<th>图片名称：</th>',
                '<td>',
                    '<input id="modifyName" type="text" class="txt"/>',
                    '<div class="tool">还能输入<span class="d-name-tip fred"></span>字</div>',
                '</td>',
            '</tr>',
            '<tr>',
                '<th>图片描述：</th>',
                '<td>',
                    '<textarea id="modifySummary" id="" cols="30" rows="10" class="textarea"></textarea>',
                    '<div class="tool">还能输入<span class="d-des-tip fred"></span>字</div>',
                '</td>',
            '</tr>',
        '</table>'].join(""),
        ok: function(){

            var id = this.buttonTarget.parents('dl').attr('id');

            $.ajax({
                url: baseURL, 
                data: { 
                    handle: "set", 
                    id: id, 
                    name:$('#modifyName').val(), 
                    summary:$('#modifySummary').val() 
                },
                dataType: "json",
                type: "POST",
                success: function(data){
                    location.reload();
                }
            });

        },
        okValue: "保存",
        cancel: function(){},
        onshow: function(){
            var id = this.buttonTarget.parents('dl').attr('id');

            //wordsCount
            wordsCount("#modifyName", ".d-name-tip", 20);
            wordsCount("#modifySummary", ".d-des-tip", 60);

            $.ajax({
                url: baseURL,
                data: { 
                    handle: "get",
                    id: id
                },
                dataType: "json",
                type: "GET",
                function: function(data){
                    var d = data;

                    if (!d.code){
                        $('#modifyName').val(data.name);
                        $('#modifySummary').val(data.summary);
                    }
                }
            });
        }
    })

    $(document).on("click", ".delAction", function(){
        delConfirm.setBtnTarget($(this));
        delConfirm.show();
    });

    $(document).on("click", ".editAction", function(){
        editDialog.setBtnTarget($(this));
        editDialog.show();
    });

    setTimeout(function () {
        $("#Uploadx").uploadify({
            formData : {
                'handle'    : 'uploadx',
                'uid'       : $.cookie("webuid"),
                'multi'     : false,
                'PHPSESSID' : $.cookie("PHPSESSID")
            },
            height          : 24,
            width           : 100,
            swf             : '/public/js/widget/uploadify/uploadify.swf',
            uploader        : '/fupload',
            fileTypeExts    : '*.gif; *.jpg; *.png',
            buttonText      : '+上传照片',
            fileSizeLimit   : '20000KB',
            queueSizeLimit  : 10,
            onUploadError   : function(file, errorCode, errorMsg, errorString) {
                $.tips(file.name + '该文件无法上传 ' + errorString);
            },
            onCancel : function(file) {
               //处理图片的删除
                if( divId > 0){
                    delHanlder(divId);
                }
            },
            onUploadSuccess : function(file, data, response) {
            //每次成功上传后执行的回调函数，从服务端返回数据到前端
                var d = JSON.parse(data);
                if(d.ret){
                    var $pichtml = $('.imgbox');
                    var date = (new Date()).valueOf();
                    var src = $pichtml.find('img').attr('src');
                    $pichtml.find(".picGrp").attr("id", d.info.id);
                    $pichtml.find(".picGrpWrapper").attr("rel", "prettyPhoto[gallery]");
                    divId = d.info.id;
                    src = RegExp(src,"gi");
                    var pichtml = $pichtml.html().replace(src, window.IMG_PATH + '/' + d.info.md5 + '?w=200&h=200');

                    //append handle
                    $('#gallerylist').prepend(pichtml);
                    $('#piccount').text(parseInt($('#piccount').text(), 10)+1);
                    //bind event
                }else{
                    $.tips('上传照片错误:'+d.info+' ['+file.name+']');
                }
            },
            onQueueComplete : function(queueData) {

            }
        });
    }, 10);

    //初始化瀑布流图片
    $("a[rel^='prettyPhoto']").prettyPhoto({social_tools:"", gallery_markup: ""});
});