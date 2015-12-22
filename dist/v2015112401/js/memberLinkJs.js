/**
 * @description 邀请链接页面
 * @author Young
 * @contacts young@kingjoy.co
 */

$(function(){
	var client = new ZeroClipboard(document.getElementById("copyBtn"));

	client.on( "ready", function( readyEvent ) {
	  // alert( "ZeroClipboard SWF is ready!" );

		client.on( "aftercopy", function( event ) {
	    	// `this` === `client`
	    	// `event.target` === the element that was clicked
			$.tips("复制成功");
	  	});
	});

});