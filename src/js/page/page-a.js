$(function(){
    
    if($.dialog){
        document.getElementById("module-a").innerText = "module 'A' 导入完成";
    }
    if(Utility){
        document.getElementById("module-b").innerText = "module 'B' 导入完成";
    }
    if(Validation){
        document.getElementById("module-c").innerText = "module 'C' 导入完成";
    }
    widgetA();
    widgetB();
    widgetC();
    
    if(new ServiceA()){
        document.getElementById("service-a").innerText = "service 'A' 导入完成";
    }
    
    document.getElementById("page-a").innerText = "page 'A' is running";
    
    
});