/*! cross-framework - v0.1.2 - 2015-12-19 */$(function(){var a=loopOptions({startNum:0,endNum:23});$("select[name='hour']").append(a);var b=loopOptions({startNum:0,endNum:59,interval:5});$("select[name='minute']").append(b);var c=loopOptions({startNum:25,endNum:55,interval:30});$("select[name='duration']").append(c);var d=loopOptions({startNum:4e3,endNum:1e4,interval:1e3});$("select[name='select-points']").append(d),$("#rPwdRadioOpen").on("click",function(){$(".J-pwd-form").removeClass("none")}),$("#rPwdRadioClose").on("click",function(){$(".J-pwd-form").addClass("none")}),$("#btnChangePW").on("click",function(){$("#rPwd").trigger("keyup"),$("#rPwdTips").text().length>0&&"true"==$("[name='room-radio']:checked").val()||$.ajax({url:"/member/roomSetPwd",dataType:"json",type:"POST",data:{password:$("#rPwd").val(),"room-radio":$("[name='room-radio']:checked").val()},success:function(a){1==a.code?$.tips(a.msg):$.tips(a.msg)},error:function(a,b){window.console}})}),$(".reserveLabel").on("click",function(){var a=$(this).find('[type="radio"]');a.prop("checked",!0),$("#radioSelectPoints").is(":checked")?($('select[name="select-points"]').prop("disabled",!1),$('input[name="input-points"]').prop("disabled",!0)):($('select[name="select-points"]').prop("disabled",!0),$('input[name="input-points"]').prop("disabled",!1))}),$("#btnReservation").on("click",function(){var a=$("input[name='mintime']").val(),b=$("select[name='hour']").val(),c=$("select[name='minute']").val();if(!$.trim(a).length)return void $.tips("请选择开播日期。");var d=a.split("-"),e=new Date(parseInt(d[0],10),parseInt(d[1],10)-1,parseInt(d[2],10),b,c);if(e.getTime()<Date.now())return void $.tips("不能设置过去的时间。");var f="",g="";if($("#radioSelectPoints").is(":checked"))f=$("select[name='select-points']").val(),g="";else if(f="",g=$("input[name='input-points']").val(),Number(g)<=1e4)return void $.tips("手动输入值必须大于10000");$.ajax({url:"/member/roomSetDuration",dataType:"json",type:"GET",data:{tid:4,mintime:a,hour:$("select[name='hour']").val(),minute:$("select[name='minute']").val(),duration:$("select[name='duration']").val(),"select-points":f,"input-points":g},success:function(a){1==a.code?$.tips("预约房间（一对一）添加成功！",function(){location.reload()}):$.tips(a.msg)},error:function(a,b){window.console}})}),$("#roomSetList").on("click",".btn-reserve-delete",function(){var a=$(this);$.ajax({url:"/member/delRoomDuration",data:{rid:$(this).data("roomid")},type:"GET",success:function(b){1==b.code?(a.closest("tr").remove(),$.tips("删除成功！")):$.tips(b.msg)}})}),$("#roomSetList").on("click",".btn-reserve-modify",function(){var a="<div class='m-form dialogRoomModify'><div class='m-form-item'><label for='resIptDate'>预约日期：</label><input id=\"resIptDate\" class=\"Wdate txt txt-s\" type=\"text\" onclick=\"WdatePicker()\" value=\"\"></div><div class='m-form-item'><label for='resSelectHour'>预约时间：</label><select id='resSelectHour'></select> : <select id='resSelectMinute'></select></div><div class='m-form-item'><label for='resSelectDuration'>预约时长：</label><select id='resSelectDuration'></select></div><div class='m-form-item'><label for='resSelectPoints'>钻石数量：</label><select id='resSelectPoints'></select></div></div>",b=$(this);$.dialog({title:"修改房间设置",content:a,onshow:function(){for(var a="",c=0;24>c;c++)a=10>c?a+"<option>0"+c+"</option>":a+"<option>"+c+"</option>";var d=loopOptions({startNum:0,endNum:23});$("#resSelectHour").append(d);var e=loopOptions({startNum:0,endNum:59,interval:5});$("#resSelectMinute").append(e);var f=loopOptions({startNum:25,endNum:55,interval:30});$("#resSelectDuration").append(f);var g=loopOptions({startNum:4e3,endNum:1e4,interval:1e3});$("#resSelectPoints").append(g);var h=b.closest("tr").find("td"),i=h.eq(1).text().split(" ")[0],j=h.eq(2).text(),k=h.eq(3).text(),l=h.eq(1).text().split(" ")[1].split(":")[0],m=h.eq(1).text().split(" ")[1].split(":")[1],n=$(".dialogRoomModify");n.find("#resIptDate").val(i),n.find("#resSelectHour").val(l),n.find("#resSelectMinute").val(m),n.find("#resSelectPoints").val(k),n.find("#resSelectDuration").val(j)},ok:function(){$.ajax({url:"/member/roomUpdateDuration",data:{durationid:b.data("roomid"),mintime:$("#resIptDate").val(),hour:$("#resSelectHour").val(),minute:$("#resSelectMinute").val(),points:$("#resSelectPoints").val(),duration:$("#resSelectDuration").val()},type:"GET",success:function(a){1==a.code?$.tips("修改成功！"):$.tips(a.msg)},error:function(a){}})},okValue:"确定",cancel:function(){},cancelValue:"取消"}).show()}),$("#rPwd").passwordInput("#rPwdTips")});