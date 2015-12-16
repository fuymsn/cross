var webpack = require('webpack');

//创建公共文件common
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var jqueryPlugin = new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" });

//__dirname
console.log("__dirname: " + __dirname);
//console.log("_webpack_public_path__: " + window.resourcePublicPath);

module.exports = {
	entry: {
		index: ["./components/index.jsx"],
		rank: ["./components/rank.jsx"],
		login: ["./components/login.jsx"],
		register: ["./components/register.jsx"]
	},
	
	output: {
		path: "./build/",
		publicPath: "../mobile/build/", /*设置图片路径*/
		filename: "[name].js"
	},
	
	//开启后缀名的自动补全, 现在可以写 require('file') 代替 require('file.coffee')
	resolve:{
		extensions: ["", ".js", ".jsx", ".css"],
	},
	
	module: {
		//指定jsx-loader编译后缀名为 .jsx
		loaders: [
			{ test: /\.jsx$/, loaders: ['babel'] },
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // 用 ! 来连接多个人 loader
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
		]
	},
	//缓存common插件
	plugins: [commonsPlugin, jqueryPlugin]
}