webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(2);
	var ReactDom = __webpack_require__(159);
	var $ = __webpack_require__(160);

	//引用css模块
	__webpack_require__(161);
	__webpack_require__(165);
	__webpack_require__(167);

	/**
	 * @description 首页JSONP数据加载
	 * @author Young
	 * @param obj => 查阅OPTIONS
	 */
	var hostAjax;
	var getItemData = function getItemData(obj) {

		var OPTIONS = {
			url: "",
			data: {},
			failText: "data fetch fail",
			successCallback: function successCallback() {}
		};

		$.extend(true, OPTIONS, obj);

		//若前一次请求未完成，阻断。
		if (hostAjax && hostAjax.readyState != 4) {
			hostAjax.abort();
		};

		hostAjax = $.ajax({
			type: "GET",
			url: OPTIONS.url,
			data: OPTIONS.data,
			dataType: 'json',
			// dataType: "jsonp",
			// jsonp: "callback",
			// jsonpCallback:"cb",
			success: function success(json) {
				if (OPTIONS.successCallback) {
					OPTIONS.successCallback(json);
				};
				if (window.console) {
					console.info(json);
				};
			},
			error: function error() {
				if (OPTIONS.errorCallback) {
					OPTIONS.errorCallback(json);
				};
				if (window.console) {
					console.warn(OPTIONS.failText);
				};
			}
		});
	};

	//首页模块
	var IndexShow = React.createClass({
		displayName: "IndexShow",

		/**
	  * 初始化数据
	  * @return {[json]} [初始化数据json]
	  */
		getInitialState: function getInitialState() {
			return {
				tabKey: "all",
				tabName: {
					"all": "大厅",
					"rec": "推荐",
					"gen": "才艺",
					"ord": "预约",
					"vip": "会员"
				},
				videoList: []

			};
		},

		/**
	  * 从服务器获取数据
	  */
		loadInfoFromServer: function loadInfoFromServer(key) {

			//如果请求和上次相同，返回
			if (key && key == this.state.tabKey) {
				return;
			};

			//类别
			var category = key ? category = key : category = "all";

			var that = this;

			//ajax获取数据
			getItemData({
				url: '/videolist' + category + '.json',
				data: { "_": new Date().valueOf() },
				failText: "More data fetch fail",
				successCallback: function successCallback(data) {
					that.setState({ videoList: data.rooms });
				},
				errorCallback: function errorCallback(data) {}
			});
		},

		componentDidMount: function componentDidMount() {
			this.loadInfoFromServer();
		},

		/**
	  * 处理tab切换
	  * @param  {[string]} key [tab key]
	  * @return {[null]}     [null]
	  */
		handleSwitch: function handleSwitch(key) {

			//console.log(key);
			this.setState({ tabKey: key });
			this.loadInfoFromServer(key);
		},

		render: function render() {
			return React.createElement(
				"div",
				{ id: "indexShow" },
				React.createElement(
					IndexTab,
					null,
					React.createElement(IndexTabBtn, { tabName: this.state.tabName, handleSwitch: this.handleSwitch, tabKey: this.state.tabKey })
				),
				React.createElement("img", { className: "index-slider", src: "../mobile/image/hall-slider.png" }),
				React.createElement(IndexList, { videoList: this.state.videoList })
			);
		}

	});

	//tab模块
	var IndexTab = React.createClass({
		displayName: "IndexTab",

		render: function render() {

			return React.createElement(
				"div",
				{ id: "indexTab", className: "index-tab clearfix" },
				this.props.children
			);
		}

	});

	//tab btn按钮
	var IndexTabBtn = React.createClass({
		displayName: "IndexTabBtn",

		handleClick: function handleClick(e) {
			var tabKey = e.currentTarget.dataset["id"];
			this.props.handleSwitch(tabKey);
		},

		render: function render() {

			//保存that值
			var that = this;

			//从父级传值
			//var children = this.props.children;

			//从父级传值

			var tabNode = [];
			var tabName = this.props.tabName;
			var tabKey = this.props.tabKey;

			for (var key in tabName) {
				var tabState = "index-tab-btn";
				if (key == tabKey) {
					tabState = "index-tab-btn active";
				};

				tabNode.push(React.createElement(
					"div",
					{ className: tabState, onClick: this.handleClick, "data-id": key, key: key },
					tabName[key],
					React.createElement("div", { className: "index-tab-active" })
				));
				//tabNode.push(<IndexTabBtn tabClick={ that.handleClick } tabName={ data[key] } tabKey={key} key={key} tabState={tabState} />);
			};

			return React.createElement(
				"div",
				null,
				tabNode
			);
		}

	});

	//list模块
	var IndexList = React.createClass({
		displayName: "IndexList",

		render: function render() {

			var videoNode = this.props.videoList.map(function (item, i) {

				return React.createElement(IndexItem, { videoItem: item, key: i });
			});

			return React.createElement(
				"div",
				{ id: "indexList", className: "index-list" },
				React.createElement(
					"div",
					{ className: "index-wrapper clearfix" },
					videoNode
				)
			);
		}
	});

	//item模块
	var IndexItem = React.createClass({
		displayName: "IndexItem",

		render: function render() {

			var data = this.props.videoItem;

			window.PIC_PATH = "http://p1.1room1.co/public";

			//data['headimg'] = /\d{13}/.test(data['headimg']) ? (window.PIC_PATH + "/images/anchorimg/" + data["uid"] + "_" + data['headimg'].match(/\d{13}/)[0] + ".jpg") : window.PIC_PATH + '/images/vzhubo.jpg';
			data['headimg'] = window.PIC_PATH + '/images/vzhubo.jpg';

			return React.createElement(
				"div",
				{ className: "movie-item" },
				React.createElement("img", { src: data.headimg, alt: "", className: "movie-img" }),
				React.createElement(
					"div",
					{ className: "movie-info" },
					React.createElement(
						"div",
						{ className: "title" },
						data.username
					)
				)
			);
		}

	});

	//render
	ReactDom.render(React.createElement(IndexShow, null), document.getElementById("indexPage"));

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(168);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(164)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./index.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./index.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(163)();
	// imports


	// module
	exports.push([module.id, ".index-tab .index-tab-btn {\n  float: left;\n  font-size: 14px;\n  width: 20%;\n  padding: 10px 0px;\n  cursor: pointer;\n  background-color: #fff;\n  text-align: center;\n  position: relative;\n}\n.index-tab .index-tab-btn.active .index-tab-active {\n  width: 100%;\n  height: 4px;\n  background-color: #fb296b;\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n}\n.index-slider {\n  width: 100%;\n  display: block;\n}\n.index-list .index-wrapper {\n  margin: 10px;\n}\n.movie-item {\n  float: left;\n  width: 50%;\n  margin-bottom: 15px;\n}\n.movie-item .movie-img {\n  display: block;\n  width: 100%;\n}\n.movie-item .movie-info .title {\n  color: #333;\n}\n@media (min-width: 320px) {\n  .index-list .index-item {\n    width: 33.3%;\n  }\n}\n@media (min-width: 480px) {\n  .index-list .index-item {\n    width: 25%;\n  }\n}\n", ""]);

	// exports


/***/ }

});