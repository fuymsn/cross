!function(a,b){var c=["<div class='noble-d-prop'>","<div class='noble-d-prop_left'>","<img src='"+b.PIC_PATH+"/images/noble/#{gid}.png'/>","</div>","<div class='noble-d-prop_right'>","<h2>#{title}</h2>","<p>获取资格：#{level_title}</p>","<p>获取方式：贵族坐骑，顾名思义是贵族的象征。当你开通#{level_title}后，该坐骑就会随着#{level_title}一起出现。</p>","<p>坐骑描述：#{desc}</p>","</div>","</div>"].join("");a=function(){this.currentGid=30,this.roomId=0,this.init=function(){Noble.initChargeDialog()},this.getCurrentGid=function(){return this.currentGid},this.setCurrentGid=function(a){this.currentGid=a},this.getRoomId=function(){return this.roomId},this.setRoomId=function(a){this.roomId=a},this.init()},$.extend(a,{currentChargeDialog:null,ins:null,getProp:function(a,b){$.ajax({url:"/getvipmount",type:"POST",dataType:"json",data:a,success:function(a){b&&b(a)},error:function(){Utility.log("get vip mount error!")}})},changeNobleData:function(a){if(a=a||[],!a.length){var b=a.permission,c=a.system;a.level_id_icon='<span class="hotListImg basicLevel'+a.level_id+'"></span>';for(var d in c)"keep_level"==d?c[d]=c[d]+"钻":c[d]="gift_level"==d?'<span class="hotListImg basicLevel'+c[d]+'"></span>':c[d]+'<span class="noble-table-diamond"></span>';switch(b.allowvisitroom=0==b.allowvisitroom?"不受限":"限制",b.modnickname.toString()){case"-1":b.modnickname="不受限";break;case"0":b.modnickname="限制";break;default:var e=b.modnickname.split("|"),f="";"month"==e[1]?f="月":"week"==e[1]?f="周":"year"==e[1]&&(f="年"),b.modnickname=e[0]+"次/"+f}switch(b.haswelcome=0==b.haswelcome?"无":"有",b.chatsecond=0==b.chatsecond?"":b.chatsecond+"/次",b.haschateffect=0==b.haschateffect?"无":"有",b.chatlimit.toString()){case"-1":b.chatlimit="不限制";break;case"0":b.chatlimit="禁言";break;default:b.chatlimit=b.chatlimit+"字"}switch(b.hasvipseat=0==b.hasvipseat?"无":"有",b.nochat.toString()){case"1":b.nochat="防止房主";break;case"0":b.nochat="无";break;case"2":b.nochat="防止管理员";break;case"1|2":b.nochat="防止房主、管理员"}switch(b.nochatlimit=0==b.nochatlimit?"无":b.nochatlimit+"普通用户/天",b.avoidout.toString()){case"1":b.avoidout="防房主";break;case"0":b.avoidout="无";break;case"2":b.avoidout="防止管理员";break;case"1|2":b.avoidout="防止房主、管理员"}b.letout=0==b.letout?"无":b.letout+"普通用户/天",b.allowstealth=0==b.allowstealth?"无":"有"}return a},chargeNoble:function(a){var b=this;$.ajax({url:Utility.switchOrigin("v.","www.")+"/openvip",type:"get",dataType:"jsonp",jsonp:"callback",jsonpCallback:"cb",data:a,success:function(a){switch(a.code){case 0:b.currentChargeDialog.close(),b.chargeNoblePreSuccessCB(a),$.tips("贵族开通成功！您现在就可以使用您的专属坐骑啦！",function(){b.chargeNobleSuccessCB(a)});break;default:$.tips(a.msg)}},error:function(){Utility.log("charge noble error!"),b.chargeNobleErrorCB()}})},chargeNobleSuccessCB:function(a){},chargeNoblePreSuccessCB:function(a){},chargeNobleErrorCB:function(){},initChargeDialog:function(){var a=this,b=["<div class='noble-d-charge'>","<ul class='noble-d_menu clearfix'></ul>","<div class='noble-d_main'></div>","</div>"].join("");a.currentChargeDialog=$.dialog({title:"开通贵族",content:b,onshow:function(){var b=a.ins.getCurrentGid();a.appendNobleDialogList(b),a.bindNobleSwitchEvent()}})},appendNobleDialogList:function(a){var b=this;b.getNobleAllInfo(function(b){var c="",d=b.info;$.each(d,function(a,b){c=c+"<li class='noble-d_tab' data-gid='"+d[a].gid+"'><span class='hotListImg basicLevel"+d[a].level_id+"'></span></li>"});var e=$(c);e.eq(0).addClass("active"),$(".noble-d_menu").html(e),$(".noble-d_menu").find(".noble-d_tab").filter("[data-gid="+a+"]").trigger("click")})},showChargeDialog:function(){this.currentChargeDialog.show()},getPropInfo:function(a){return{gid:a.data("gid"),title:a.data("title"),level_title:a.data("lvtitle"),desc:a.data("desc")}},showGetPropsDialog:function(a,b){var d=this,e=Utility.template(c,d.getPropInfo(a)),f=$.dialog({title:"贵族专属",content:e,onshow:function(){},ok:function(){f.close(),b&&b()},okValue:"开通贵族身份"}).show()},getNobleInfo:function(a){var b=this;$.ajax({url:Utility.switchOrigin("v.","www.")+"/getgroup",type:"get",dataType:"jsonp",jsonp:"callback",jsonpCallback:"cb",data:{gid:b.ins.getCurrentGid()},success:function(b){Utility.log(b),0==b.code?a&&b.info&&a(b.info):$.tips(b.msg)},error:function(){Utility.log("get noble group info failure.")}})},getNobleAllInfo:function(a){$.ajax({url:Utility.switchOrigin("v.","www.")+"/getgroupall",type:"get",dataType:"jsonp",jsonp:"callback",jsonpCallback:"cb",data:"",success:function(b){b.code?Utility.log(b.msg):a&&a(b)},error:function(){Utility.log("ajax request error")}})},flushNobleInfo:function(a){a.nobleLink=Utility.switchOrigin("v.","www.")+"/noble";var b=["<div class='noble-d-charge_head'>","<h2>"+a.level_name+"</h2>","</div>","<div class='noble-d-charge_content'>","<table>","<tr><td>首开礼包：</td><td>"+a.system.gift_money+"</td><td>改名限制：</td><td>"+a.permission.modnickname+"</td></tr>","<tr><td>赠送爵位：</td><td>"+a.system.gift_level+"</td><td>房间特效欢迎语：</td><td>"+a.permission.haswelcome+"</td></tr>","<tr><td>贵族标识：</td><td>"+a.level_id_icon+"</td><td>聊天特效：</td><td>"+a.permission.haschateffect+"</td></tr>","<tr><td>房间限制：</td><td>"+a.permission.allowvisitroom+"</td><td>发送文字特权：</td><td>"+a.permission.chatlimit+"</td></tr>","<tr><td>坐骑：</td><td>"+a.g_mount.name+"</td><td>贵宾席位置：</td><td>"+a.permission.hasvipseat+"</td></tr>","</table>","<h3>开通价格："+a.system.open_money+"</h3>","<p>次月保级条件：贵族等级有效期内，累计充值达"+a.system.keep_level+"。</p>","</div>","<div class='noble-d-charge_btnbox'>","<button class='noble-d_charge_btn btn' data-gid='"+a.gid+"'>立即开通贵族</button>","<a href='"+a.nobleLink+"' target='_blank' class='noble-d-link'>了解更多</a>","</div>"].join("");$(".noble-d_main").html(b)},bindNobleSwitchEvent:function(){var a=this;$(".noble-d_menu").on("click",".noble-d_tab",function(){var b=$(this);a.ins.setCurrentGid(b.data("gid")),b.siblings(".noble-d_tab").removeClass("active").end().addClass("active"),a.getNobleInfo(function(b){a.bindNobleDialogEvent(b)})})},bindNobleDialogEvent:function(a){var b=this;a=b.changeNobleData(a),b.flushNobleInfo(a),$(".noble-d_charge_btn").on("click",function(a){$(this).prop("disabled",!0);var c=$(this).data("gid");b.chargeNoble({gid:c,roomId:b.ins.getRoomId()}),b.chargeNobleErrorCB=function(){$(this).prop("disabled",!1)}})}}),b.Noble=a}("undefined"!=typeof Noble?Noble:{},window),$(function(){var a=function(){var a=new Noble;$(".J-noble-charge").on("click",function(b){Noble.ins=a,Noble.ins.setCurrentGid($(this).data("groupid")),Noble.chargeNobleSuccessCB=function(a){location.reload()},Noble.showChargeDialog()})};Noble.getNobleAllInfo(function(b){for(var c=b.info,d=["<td><h4>贵族特权</h4></td>"],e=["<td><h4>开通贵族</h4></td>"],f=["<td><h4>贵族标识</h4></td>"],g=["<td><h4>开通价格</h4></td>"],h=["<td><h4>首开礼包</h4></td>"],i=["<td><h4>赠送爵位</h4></td>"],j=["<td><h4>专属座骑</h4></td>"],k=["<td><h4>房间限制</h4></td>"],l=["<td><h4>改名限制</h4></td>"],m=["<td><h4>特效欢迎语</h4></td>"],n=["<td><h4>聊天特效</h4></td>"],o=["<td><h4>发送文字特权</h4></td>"],p=["<td><h4>贵宾席位</h4></td>"],q=["<td><h4>防禁言</h4></td>"],r=["<td><h4>禁言</h4></td>"],s=["<td><h4>防踢人</h4></td>"],t=["<td><h4>踢人</h4></td>"],u=[],v="",w=0;w<c.length;w++){var x=Noble.changeNobleData(c[w]),y=x.system,z=x.permission;d.push("<td><h4>"+x.level_name+"</h4></td>"),e.push('<td><button class="btn btn-xs J-noble-charge" data-groupid="'+x.gid+'">开通</button></td>'),f.push("<td>"+x.level_id_icon+"</td>"),g.push("<td>"+y.open_money+"</td>"),h.push("<td>"+y.gift_money+"</td>"),i.push("<td>"+y.gift_level+"</td>"),j.push("<td>"+x.g_mount.name+"</td>"),k.push("<td>"+z.allowvisitroom+"</td>"),m.push("<td>"+z.haswelcome+"</td>"),l.push("<td>"+z.modnickname+"</td>"),n.push("<td>"+z.haschateffect+"</td>"),o.push("<td>"+z.chatsecond+" "+z.chatlimit+"</td>"),p.push("<td>"+z.hasvipseat+"</td>"),q.push("<td>"+z.nochat+"</td>"),r.push("<td>"+z.nochatlimit+"</td>"),s.push("<td>"+z.avoidout+"</td>"),t.push("<td>"+z.letout+"</td>")}u=[d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t];for(var w=0;w<u.length;w++)v+="<tr>"+u[w].join("")+"</tr>";$(".noble-table").html(v),a()})});