/*! cross-framework - v0.1.2 - 2015-12-21 */var rankPanelTmp=['<div class="personContent-top clearfix">','<img class="personImg" src="#{headimg}" alt="" />','<div class="per-content">','<div class="per-content-title" clearfix">','<span class="per-name">#{nickname}</span>',"</div>",'<div class="per-hostid">#{hostId}</div>','<div class="per-icon">',"#{badge}",'<span class="hotListImg basicLevel#{lv_rich}"></span>',"#{richMark}","</div>",'<div class="per-des">#{description}</div>',"</div>","</div>",'<div class="personContent-middle clearfix">','<span class="per-info">#{sex} | #{age} | #{starname} | #{procity}</span>',"#{isLive}",'<a href="#{space_url}" target="_blank" class="personLink">TA的空间</a>',"</div>",'<div class="personContent-bottom clearfix">','<div class="per-handle">','<i class="per-fav"></i><a href="javascript:void(0)" class="per-fav-btn" data-fav="" title="点击关注"><span class="per-fav-btn-title">关注</span>（<i class="per-fav-btn-num">#{attens}</i>）</a>',"</div>",'<div class="per-handle">','<i class="per-msg"></i><a href="javascript:void(0)" class="displayWinBtn per-msg-btn">发私信</a>',"</div>",'<a href="#{room_url}/#{rid}" target="_blank" class="btn btn-red per-video-btn">进入房间</a>',"</div>"].join(""),showMsgDialog=function(){var a=$.dialog({title:"发私信给",content:['<div class="msg-reply">','<textarea class="textarea" name="" id="txtContent" rows="10"></textarea>','<div class="tool clearfix">','<span class="tool-tips">',"还能输入",'<span class="tool-num">200</span>',"字","</span>",'<button class="btn">发送</button>',"</div>","</div>"].join(""),onshow:function(){var a=this;if(!User.isLogin())return alert("请登录后再发送私信"),void a.remove();var b=a.buttonTarget.closest(".personDiv").find(".per-name").text(),c=a.buttonTarget.closest(".personDiv").data("rel"),d=$(".msg-reply"),e=$("#txtContent");e.val(""),a.setTitle("发私信给"+b),wordsCount(e,d.find(".tool-num"),200);var f;d.off("click",".btn"),d.on("click",".btn",function(){return 0==$.trim(e.val()).length?($.tips("发送内容不能为空。"),void a.remove()):(f&&4!=f.readyState&&f.abort(),void(f=$.ajax({url:"/member/domsg",data:{content:e.val(),tid:c,fid:User.UID},dataType:"json",type:"POST",success:function(b){b.ret?(a.remove(),$.tips("私信发送成功")):alert(b.info)}})))})}});$(document).on("click",".per-msg-btn",function(){a.setBtnTarget($(this)),a.show()})},favoriteHandle=function(a){var b=a.target.find(".per-fav-btn"),c=b.find("span");parseInt(a.checkatten,10)?(c.text("已关注"),b.data("fav","1")):(c.text("关注"),b.data("fav","0")),favoriteBtnSub(a)},favoriteBtnSub=function(a){var b,c=a.target.find(".per-fav-btn"),d=c.find("span"),e=c.find(".per-fav-btn-num");c.on("click",function(){var f=parseInt(c.data("fav"),10),g=1,h=parseInt(e.text(),10);return g=0==f?1:2,User.isLogin()?(b&&4!=b.readyState&&b.abort(),void(b=$.ajax({url:"/focus",type:"GET",dataType:"json",data:{pid:a.uid,ret:g},success:function(a){1==a.status?f?(d.text("关注"),c.data("fav","0"),e.text(h-1)):(d.text("已关注"),c.data("fav","1"),e.text(h+1)):3==a.status&&$.tips(a.msg)},error:function(a){}}))):void alert("请登录后再关注")})},getPanelData=function(a,b){a.find(".panel-hover").off("click"),a.on("mouseenter",".panel-hover",function(){var a=this;$(a).find(".personContent-top").length||$.ajax({type:"GET",url:"/majax/getfidinfo",data:{uid:$(a).attr("rel"),atten:!0},dataType:"json",success:function(c){if(c.ret){if(0==c.info.sex?c.info.sex="女":c.info.sex="男",3==c.info.roled?(c.info.hostId="(主播ID："+c.info.uid+")",c.info.richMark='<span class="hotListImg AnchorLevel'+c.info.lv_exp+'"></span>'):(c.info.hostId="",c.info.richMark=""),c.info.badge=0==c.info.vip?0==c.info.icon_id?"":'<span class="per-badge badge badge'+c.info.icon_id+'"></span>':'<span class="hotListImg basicLevel'+c.info.vip+'"></span>',3==Number(c.info.roled))switch(Number(c.info.live_status)){case 0:c.info.isLive="<span class='per-live per-live-nl'>休息</span>";break;case 1:c.info.isLive="<span class='per-live per-live-ol'>直播</span>";break;default:c.info.isLive=""}var d=Utility.template(rankPanelTmp,c.info);$(a).find(".personContent").html(d),3!=c.info.roled&&($(a).find(".per-video-btn").remove(),$(a).find(".personLink").remove()),$(a).find(".personLoading").remove(),c.info.target=$(a),favoriteHandle(c.info),b&&b(c)}},error:function(){window.console}})}),showMsgDialog()};$(function(){getPanelData($(".watch-content")),$(".cancelBtn").on("click",function(){var a=$(this);$.ajax({url:"/focus",data:{pid:a.parents("li").data("rel"),ret:2},type:"GET",dataType:"json",success:function(b){b.status?a.parents("li").remove():alert(b.msg)},error:function(){}})})});