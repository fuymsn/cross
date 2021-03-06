//cdn 数组
var cdnPathArr = [
	'http://s.1.com'
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
    publishVersion: "v2015112401",
    subPublishVersion: "1.0",
    resource: typeof crossList == "undefined" ? {}: crossList,
    //language: navigator.language || navigator.browserLanguage,
    cdnPath: __cdn,
    //cdnPath: "../../dest/",
    imagePath: __cdn + '/src/img',
    mode: 'online' // dev/online/onlinedev
};