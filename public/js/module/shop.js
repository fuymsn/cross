(function(__Shop, window){

	var equipDialog;

	/**
	 * 初始化装备道具弹窗
	 * @param  {json} data {gid: 坐骑id}
	 * @return null
	 */
	var initEquipDialog = function(dInfo){
	    equipDialog = $.dialog({
	        title: dInfo.title,
	        content: dInfo.content,
	        ok: function(){
	        	var that = this;
	        	__Shop.equipMount(dInfo.data, function(){
	        		that.remove();
	        	});
	        },
	        okValue: "装备",
	        cancel: function(){},
	        cancelValue: "不装备"
	    });
	}

	$.extend(__Shop, {

		/**
		 * 获取用户金额
		 * @param  {function} func 回调函数
		 * @return null
		 */
		getMoney: function(func){
	        $.ajax({
	            url: '/getmoney',
	            dataType: "json",
	            type: "POST",
	            success: function(data){
	            	if (func) { func(data); };
	            },
	            error: function(){
	            	Utility.log("get money error!");
	            }
	        });

		},

		/**
		 * 装备坐骑
		 * @param  {json} data {gid: 坐骑id}
		 * @param  {function} func 成功后的回调函数
		 * @return null
		 */
		equipMount: function(data, func){
           $.ajax({
                url: "/majax/equipHandle",
                type: "GET",
                dataType: "json",
                data: data,
                success: function(res){
                    if (res.ret) {
						$.tips("装备坐骑成功！");
                        if (func) { func(res); };
                    }else{
                        Utility.log(res.info);
                    };
                },
                error: function(){
                	Utility.log("Equip mount");
                }
            });
		},

		/**
		 * 显示是否装备道具弹窗
		 * @param {data:json} {gid 传入坐骑id}
		 * @return null
		 */
		showEquipComfirmDialog: function(data){
			initEquipDialog({
				"title": "装备道具",
				"content": "购买成功，是否立即装备道具？",
				"data": data
			});

			equipDialog.show();
		},

		/**
		 * 显示是否装备道具弹窗
		 * @param {data:json} {gid 传入坐骑id}
		 * @return null
		 */
		showEquipNobleComfirmDialog: function(data){
			initEquipDialog({
				"title": "装备贵族道具",
				"content": "获取成功，是否立即装备贵族道具？",
				"data": data
			});
			equipDialog.show();
		}


	});

	window.Shop = __Shop;

})(typeof Shop !== "undefined" ? Shop : {}, window);