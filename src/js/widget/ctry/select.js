/**
 * jQuery :  省市县联动插件
 * @author   Peter
 * @example  $("#test").province_city_county();
 */
$.fn.province_city_county = function(v_province,v_city,v_county){
    var _self = this;
    //插入3个空的下拉框
    //_self.append("<select id='province' name='province'></select>");
    //_self.append("<select id='city' name='city'></select>");
    //_self.append("<select id='county' name='county'></select>");
    /*_self.html("<select id='province' name='province' style='width: 100px'></select>" +
            "<select id='city' name='city' style='width: 100px'></select>" +
            "<select id='county' name='county' style='width: 100px'></select>");*/

    //分别获取3个下拉框
    var sel1 = $("#province"),
        sel2 = $("#city"),
        sel3 = $("#county");

    var setSelectVal = function(select, val, text){
        var count = select.find("option").length,
            val = $.trim(val);

        for(var i = 0; i < count; i++){
            if(select.get(0).options[i].text == val){
                select.get(0).options[i].selected = true;  
                break;
            }
        }
        select.find("option[text='"+ val +"']").attr("selected", true);
    }

    //定义3个默认值
    if (DATAPCA) {
        //_self.data("province", ["四川省", "000"]);
        _self.data("province", [DATAPCA.province.text, DATAPCA.province.code]);
        _self.data("city", [DATAPCA.city.text, DATAPCA.city.code]);
        _self.data("county", [DATAPCA.area.text, DATAPCA.area.code]);
    }else{
        //参数值0:text，参数值1: code
        _self.data("province", ["请选择", ""]);
        _self.data("city", ["请选择", ""]);
        _self.data("county", ["请选择", ""]);
    };

    //默认省级下拉
    if(_self.data("province")){
        sel1.append("<option value='"+_self.data("province")[1]+"'>"+_self.data("province")[0]+"</option>");
    }
    //默认城市下拉
    if(_self.data("city")){
        sel2.append("<option value='"+_self.data("city")[1]+"'>"+_self.data("city")[0]+"</option>");
    }
    //默认县区下拉
    if(_self.data("county")){
        sel3.append("<option value='"+_self.data("county")[1]+"'>"+_self.data("county")[0]+"</option>");
    }

    //获取省市数据
    $.get('/public/js/widget/ctry/xml/province_city.xml', function(data){
        var arrList = [];
        $(data).find('province').each(function(){
            var $province = $(this);
            sel1.append("<option value='"+$province.attr('value')+"' code='"+ $province.attr('code') +"'>"+$province.attr('value')+"</option>");
        });
        if(typeof v_province != 'undefined'){
            //sel1.val(v_province);

            setSelectVal(sel1, v_province);

            sel1.change();
        }
    });
     
    //省级联动控制
    var index1 = "",
        provinceValue = "",
        cityValue = "";

    sel1.change(function(){
        //清空其它2个下拉框
        sel2[0].options.length=0;
        sel3[0].options.length=0;
        index1 = this.selectedIndex;
        if(index1 == 0){    //当选择的为 "请选择" 时
            if(_self.data("city")){
                sel2.append("<option value='"+_self.data("city")[1]+"' code='"+ $("city").attr('code') +"'>"+_self.data("city")[0]+"</option>");
            }
            if(_self.data("county")){
                sel3.append("<option value='"+_self.data("county")[1]+"'>"+_self.data("county")[0]+"</option>");
            }
        } else{
            provinceValue = $('#province').val();
            $.get('/public/js/widget/ctry/xml/province_city.xml', function(data){
                $(data).find("province[value='"+provinceValue+"'] > city").each(function(){
                    var $city = $(this);
                    sel2.append("<option value='"+$city.attr('value')+"' code='"+ $city.attr('code') +"'>"+$city.attr('value')+"</option>");
                });
                cityValue = $("#city").val();
                $(data).find("city[value='"+cityValue+"'] > county").each(function(){
                    var $county = $(this);
                    sel3.append("<option value='"+$county.attr('value')+"' code='"+ $county.attr('code') +"'>"+$county.attr('value')+"</option>");
                });
 
                if(typeof v_city != 'undefined'){
                    sel2.val(v_city);
                    setSelectVal(sel2, v_city);
                    sel2.change();
                }
 
                if(typeof v_county != 'undefined'){
                    sel3.val(v_county);
                    setSelectVal(sel3, v_county);
                }
            });
        }
    });

    //城市联动控制
    sel2.change(function(){
        sel3[0].options.length=0;
        var cityValue2 = $('#city').val();
        $.get('/public/js/widget/ctry/xml/province_city.xml', function(data){
            $(data).find("city[value='"+cityValue2+"'] > county").each(function(){
                var $county = $(this);
                sel3.append("<option value='"+$county.attr('value')+"' code='"+ $county.attr('code') +"'>"+$county.attr('value')+"</option>");
            });
            if(typeof v_county != 'undefined'){
                sel3.val(v_county);
                setSelectVal(sel3, v_county);
            }
        });
    });
    return _self;
};

$(function(){

    // 数据测试
    /*  
        window.DATAPCA = {
            province: { text:"四川省", code: "000"},
            city: { text:"成都市", code: "111"},
            area: { text:"武侯区", code: "222"}
        }
    */
    
    // 空数据测试
    //window.DATAPCA = null;

    $("#ctry").province_city_county();
    //test
    //$("#ctry").province_city_county("四川省", "成都市", "武侯区");

})
