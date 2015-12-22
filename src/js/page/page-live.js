$(function(){
	window.Fla = {};

	Fla.showNobleDialog = function(rid){

		var nb = new Noble();
		
		Noble.ins = nb;

		Noble.ins.setRoomId(rid);

		//调用开通成功后的前置方法
        Noble.chargeNoblePreSuccessCB = function(json){
			var str = "";
			// for( var a in json.data ){
			// 	str = str + json.data[a] + ",";
			// }
			str = json.data.roomid + "," + json.data.uid + "," + json.data.name + "," + json.data.vip + "," + json.data.cashback;
			
			document.getElementById("videoRoom").openVipSuccess(str);
        };

        //开通成功后的后置方法
        Noble.chargeNobleSuccessCB = function(json){
        	location.reload();
        }

		Noble.showChargeDialog();

	}

});