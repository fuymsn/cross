/*! v - v0.0.1 - 2015-12-19 */var baseURL="/member/anchor",divId=0,delHanlder=function(a){$.ajax({url:baseURL,data:{handle:"del",id:a},type:"GET",dataType:"json",success:function(b){var c=b;c.code?$.tips(c.info):($("#"+a).remove(),$("#piccount").text(parseInt($("#piccount").text())-1))}})};$(function(){var a=$.dialog({title:"删除提示",content:"图片删除后不可恢复。",ok:function(){var a=this.buttonTarget.parents("dl").attr("id");delHanlder(a)},cancel:function(){}}),b=$.dialog({title:"图片编辑",content:["<table><tr>","<th>图片名称：</th>","<td>",'<input id="modifyName" type="text" class="txt"/>','<div class="tool">还能输入<span class="d-name-tip fred"></span>字</div>',"</td>","</tr>","<tr>","<th>图片描述：</th>","<td>",'<textarea id="modifySummary" id="" cols="30" rows="10" class="textarea"></textarea>','<div class="tool">还能输入<span class="d-des-tip fred"></span>字</div>',"</td>","</tr>","</table>"].join(""),ok:function(){var a=this.buttonTarget.parents("dl").attr("id");$.ajax({url:baseURL,data:{handle:"set",id:a,name:$("#modifyName").val(),summary:$("#modifySummary").val()},dataType:"json",type:"POST",success:function(a){location.reload()}})},okValue:"保存",cancel:function(){},onshow:function(){var a=this.buttonTarget.parents("dl").attr("id");wordsCount("#modifyName",".d-name-tip",20),wordsCount("#modifySummary",".d-des-tip",60),$.ajax({url:baseURL,data:{handle:"get",id:a},dataType:"json",type:"GET","function":function(a){var b=a;b.code||($("#modifyName").val(a.name),$("#modifySummary").val(a.summary))}})}});$(document).on("click",".delAction",function(){a.setBtnTarget($(this)),a.show()}),$(document).on("click",".editAction",function(){b.setBtnTarget($(this)),b.show()}),setTimeout(function(){$("#Uploadx").uploadify({formData:{handle:"uploadx",uid:$.cookie("webuid"),multi:!1,PHPSESSID:$.cookie("PHPSESSID")},height:24,width:100,swf:"/public/js/widget/uploadify/uploadify.swf",uploader:"/fupload",fileTypeExts:"*.gif; *.jpg; *.png",buttonText:"+上传照片",fileSizeLimit:"20000KB",queueSizeLimit:10,onUploadError:function(a,b,c,d){$.tips(a.name+"该文件无法上传 "+d)},onCancel:function(a){divId>0&&delHanlder(divId)},onUploadSuccess:function(a,b,c){var d=JSON.parse(b);if(d.ret){var e=$(".imgbox"),f=((new Date).valueOf(),e.find("img").attr("src"));e.find(".picGrp").attr("id",d.info.id),e.find(".picGrpWrapper").attr("rel","prettyPhoto[gallery]"),divId=d.info.id,f=RegExp(f,"gi");var g=e.html().replace(f,window.IMG_PATH+"/"+d.info.md5+"?w=200&h=200");$("#gallerylist").prepend(g),$("#piccount").text(parseInt($("#piccount").text(),10)+1)}else $.tips("上传照片错误:"+d.info+" ["+a.name+"]")},onQueueComplete:function(a){}})},10),$("a[rel^='prettyPhoto']").prettyPhoto({social_tools:"",gallery_markup:""})});