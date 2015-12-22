var React = require("react");
var ReactDom = require("react-dom");
var $ = require("jquery");

//引用css模块
require("../css/reset-css/build/reset.min.css");
require("../css/common.css");
require("../less/index.less");

/**
 * @description 首页JSONP数据加载
 * @author Young
 * @param obj => 查阅OPTIONS
 */
var hostAjax;
var getItemData = function(obj){

    var OPTIONS = {
        url: "",
        data: {},
        failText: "data fetch fail",
        successCallback: function(){}
    }

    $.extend(true, OPTIONS, obj);

    //若前一次请求未完成，阻断。
    if (hostAjax && hostAjax.readyState != 4) {
        hostAjax.abort();
    };

    hostAjax = $.ajax({
        type: "GET",
        url: OPTIONS.url,
        data: OPTIONS.data,
        dataType:'json',
        // dataType: "jsonp",
        // jsonp: "callback",
        // jsonpCallback:"cb",
        success: function(json){
            if (OPTIONS.successCallback) { OPTIONS.successCallback(json); };
            if (window.console) {console.info(json);};
        },
        error: function(){
        	if (OPTIONS.errorCallback) { OPTIONS.errorCallback(json); };
            if (window.console) {console.warn(OPTIONS.failText);};
        }
    });
}


//首页模块
var IndexShow = React.createClass({
	
	/**
	 * 初始化数据
	 * @return {[json]} [初始化数据json]
	 */
	getInitialState: function(){
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
			
		}
	},

	/**
	 * 从服务器获取数据
	 */
	loadInfoFromServer: function(key){

		//如果请求和上次相同，返回
       	if (key && key == this.state.tabKey) {
       		return;
       	};

       	//类别
        var category = key ? category = key: category = "all";

        var that = this;

        //ajax获取数据
        getItemData({
            url: '/videolist'+ category +'.json',
            data: { "_": (new Date()).valueOf()},
            failText: "More data fetch fail",
            successCallback: function(data){
                that.setState({ videoList: data.rooms });
            },
            errorCallback: function(data){

            }
        });

	},

	componentDidMount: function(){
		this.loadInfoFromServer();
	},

	/**
	 * 处理tab切换
	 * @param  {[string]} key [tab key]
	 * @return {[null]}     [null]
	 */
	handleSwitch: function(key){

		//console.log(key);
		this.setState({ tabKey: key });
		this.loadInfoFromServer(key);
	},

	render: function(){
		return (
			<div id="indexShow">
				<IndexTab>
					<IndexTabBtn tabName={ this.state.tabName } handleSwitch={ this.handleSwitch } tabKey={ this.state.tabKey }></IndexTabBtn>
				</IndexTab>
				<img className="index-slider" src="../mobile/image/hall-slider.png" />
				<IndexList videoList={ this.state.videoList } />
			</div>
		);
	}

});

//tab模块
var IndexTab = React.createClass({

	render: function(){

		return(
			<div id="indexTab" className="index-tab clearfix">
				{ this.props.children }
			</div>
		);

	}

});

//tab btn按钮
var IndexTabBtn = React.createClass({

	handleClick: function(e){
		var tabKey = e.currentTarget.dataset["id"];
		this.props.handleSwitch(tabKey);
	},

	render: function(){

		//保存that值
		var that = this;

		//从父级传值
		//var children = this.props.children;

		//从父级传值
		
		var tabNode = [];
		var tabName = this.props.tabName;
		var tabKey = this.props.tabKey;

		for(var key in tabName){
			var tabState = "index-tab-btn";
			if (key == tabKey) {
				tabState = "index-tab-btn active";
			};

			tabNode.push(
				<div className={ tabState } onClick={ this.handleClick } data-id={ key } key={ key }>
					{ tabName[key] }
					<div className="index-tab-active"></div>
				</div>
			);
			//tabNode.push(<IndexTabBtn tabClick={ that.handleClick } tabName={ data[key] } tabKey={key} key={key} tabState={tabState} />);
		};

		return (
			<div>{tabNode}</div>
		);

	}

});

//list模块
var IndexList = React.createClass({

	render: function(){

		var videoNode = this.props.videoList.map(function(item, i){

			return (
				<IndexItem videoItem={item} key={i}/>
			);

		});

		return(
			<div id="indexList" className="index-list">
				<div className="index-wrapper clearfix">
					{videoNode}
				</div>
			</div>
		)

	}
});

//item模块
var IndexItem = React.createClass({

	render: function(){

		var data = this.props.videoItem;

		window.PIC_PATH = "http://p1.1.co/public";

		//data['headimg'] = /\d{13}/.test(data['headimg']) ? (window.PIC_PATH + "/images/anchorimg/" + data["uid"] + "_" + data['headimg'].match(/\d{13}/)[0] + ".jpg") : window.PIC_PATH + '/images/vzhubo.jpg';
		data['headimg'] = window.PIC_PATH + '/images/vzhubo.jpg';

		return (
			<div className="movie-item">
	            <img src={ data.headimg } alt="" className="movie-img"/>
	            <div className="movie-info">
	            	<div className="title">{ data.username }</div>
	            </div>
			</div>
		);

	}

})

//render
ReactDom.render(
	<IndexShow />,
	document.getElementById("indexPage")
);