//cdn 数组
var cdnPathArr = [
	'http://s.1room1.com'
	// 'http://s.mvbroadcast.com',
	// 'http://s.daxiubroadcast.net',
	// 'http://s.mmbroadcast.net',
	// 'http://s.mvbroadcast.net'
];

/**
 * 随机切换CDN方法
 * @param  {[type]} arr [cdn数组]
 * @return {[type]}     [返回cdn中的一个值]
 */
var __randomSeedFromArr = function(arr){
    var arrLen = arr.length;
    var randomNum = Math.floor(Math.random()*arrLen);
    return arr[randomNum];
}

//优化目的将ued_config 改为了 Config
var __cdn = __randomSeedFromArr(cdnPathArr);
var Config = {
    publishVersion: window.UED_PUBLISH_VERSION || "",
    subPublishVersion: window.UED_SUB_PUBLISH_VERSION || "",
    resource: window.UED_LIST,
    language: navigator.language || navigator.browserLanguage,
    cdnJquery: false,
    //cdnPath: '',
    cdnPath: __cdn, //'http://s.1room1.co/public',
    imagePath: __cdn + '/public/images',
    mode: 'online' // dev/online
};