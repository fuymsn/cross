/*! cross-framework - v0.1.2 - 2015-12-31 */var crossList={"commonCss.css":["module/reset.css","module/module-a.less","module/module-b.less","widget/widget-a.less","widget/widget-b.less","module/common.less"],"commonJs.js":["widget/widget-a.js","widget/widget-b.js","module/module-a.js","module/module-b.js","service/service-a.js"],"pageaCss.css":["widget/widget-c.less","module/module-c.less","page/page-a.less"],"pageaJs.js":["module/module-c.js","widget/widget-c.js","page/page-a.js"],"pagebCss.css":["page/page-b.less"],"pagebJs.js":["module/module-c.js","page/page-b.js"],"pagecCss.css":["page/page-c.less"],"pagecJs.js":["module/module-b.js","page/page-c.js"]},cdnPathArr=["http://s.1.com"],__randomSeedFromArr=function(a){var b=a.length,c=Math.floor(Math.random()*b);return a[c]},__cdn=__randomSeedFromArr(cdnPathArr),Config={publishVersion:"v2015112401",subPublishVersion:"1.0",resource:"undefined"==typeof crossList?{}:crossList,cdnJquery:!1,cdnPath:__cdn,imagePath:__cdn+"/src/img",mode:"online"},Application=function(a){var b='<script src="${src}" charset="utf-8" type="text/javascript" itemid="${itemid}"></script>',c='<link rel="stylesheet" type="text/css" href="${href}" itemid="${itemid}" />';this.config={},this.cdnPath="",this.servicePath="../",this.distPath="",this.configure=function(a){this.config=a},this.make=function(){},this.initImport=function(){this.cdnPath=this.config.cdnPath||"",this.distPath=this.config.cdnPath+"/dist/"+this.config.publishVersion,"dev"==this.config.mode&&(this.cdnPath=this.cdnPath+"",this.servicePath=this.config.cdnPath+"/src/")};var d=function(a){return/^service\//.test(a)},e=function(a,d,e,f){var g="",h="";"onlinedev"==e.config.mode&&(h=a),"online"==e.config.mode&&(h=a.split(".")[0]+"-min."+d),"js"==d?g=b.replace("${src}",e.distPath+"/js/"+h+"?v="+e.config.subPublishVersion).replace("${itemid}",a):"css"==d&&(g=c.replace("${href}",e.distPath+"/css/"+h+"?v="+e.config.subPublishVersion).replace("${itemid}",a)),f?e.asyncImportJs(e.cdnPath+a):document.write(g)},f=function(a,e,f,g){for(var h=0;h<a.length;h++){var i="";"js"==e?i=d(a[h])?b.replace("${src}",f.servicePath+a[h]).replace("${itemid}",a[h]):b.replace("${src}",f.cdnPath+"/src/js/"+a[h]).replace("${itemid}",a[h]):"css"==e&&(i=c.replace("${href}",f.cdnPath+"/dev/css/"+a[h]).replace("${itemid}",a[h]).replace(".less",".css")),g?f.asyncImportJs(f.cdnPath+a[h]):document.write(i)}};this.importFile=function(a,b,c,d){var g=this.config.mode,h=a+"."+b;return c&&(g=c),this.config.resource[h]?void("online"==g||"onlinedev"==g?e(h,b,this,d):"dev"==g&&f(this.config.resource[h],b,this,d)):!1},this.asyncImportJs=function(a,b){var c=document.getElementsByTagName("head")[0],d=document.createElement("script");d.type="text/javascript",d.async=!0,d.src=a,b&&(d.charset=b),c?c.appendChild(d):document.body.insertBefore(d,document.body.firstChild)},this.libImportJs=function(){this.config.cdnJquery?document.write('<script src="http://cdn.staticfile.org/jquery/1.11.1-rc2/jquery.min.js" type="text/javascript" ></script>'):document.write('<script src="'+this.config.cdnPath+"/src/vendor/jquery/jquery.min.js?v="+this.config.subPublishVersion+'" type="text/javascript" ></script>')},this.init=function(a){this.configure(a),this.initImport()},this.init(a)},cross=new Application(window.Config);