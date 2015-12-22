/**
 * @description 系统消息和私信消息页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){

    //点开回复消息面板

    var msgListDialog = $.dialog({
        title: "发私信给",
        content: ['<div class="msg-reply">',
                    '<textarea name="" id="txtContent" rows="10" class="textarea"></textarea>',
                    '<div class="tool clearfix">',
                        '<span class="tool-tips">',
                            '还能输入',
                            '<span class="tool-num">200</span>',
                            '字',
                        '</span>',
                        '<button class="btn">发送</button>',
                    '</div>',
                '</div>'].join(""),

        onshow: function(){

            var msgData = this.buttonTarget.closest('li').data('store'),
                tid = msgData.fid,
                $textAreaBox = $(".msg-reply"),
                $textAreaNum = $textAreaBox.find(".tool-num"),
                $textArea = $("#txtContent");

            var that = this;

            $textArea.val("");

            wordsCount($textArea, $textAreaNum, 200);

            that.setTitle('发私信给' + msgData.nickname);

            var xhr;

            $textAreaBox.off('click', '.btn');
            $textAreaBox.on('click', '.btn', function(){

                if ($.trim($textArea.val()).length == 0) {
                    $.tips("发送私信的内容不能为空");
                    that.remove();
                    return;
                };

                if (xhr && xhr.readyState != 4) {
                    xhr.abort();
                };

                focusXHR = $.ajax({
                    url:'/member/domsg',
                    type: "POST",
                    dataType: "json",
                    data:{content: $textArea.val(), tid: tid, fid: User.UID},
                    success: function(data){
                        if( data.ret ){
                            that.remove();
                            $.tips("私信发送成功");
                        }else{
                            alert(data.info);
                        }
                    }
                });
            });
        }
    });

    $('#personMenuTab').on('click', '.displayWinBtn', function(){
        msgListDialog.setBtnTarget($(this));
        msgListDialog.show();
    });
    
    //私信删除
    $('#personMenuTab').on('click', '.list-tool-delete', function(){
        
        var $li =  $(this).parents('li'),
            store = $li.data('store');

        $.ajax({
            url:'/majax/delmsg',
            type: "POST",
            dataType: "json",
            data: store,
            success: function(data){
                if( data.ret ){
                    $li.remove();
                }else{
                    alert(data.info);
                }
            }
        });
    });

    //系统信息删除
    $('#sysMsg').on('click', '.list-tool-delete', function(){

        var $li =  $(this).closest('li'),
        store = $li.data('store');

        $.ajax({
            url:'/majax/delmsg',
            type: "POST",
            dataType: "json",
            data: store,
            success: function(data){
                if( data.ret ){
                    $li.remove();
                }else{
                    alert(data.info);
                }
            }
        });

    });
});
