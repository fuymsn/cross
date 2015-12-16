var React = require("react");
var ReactDom = require("react-dom");
var $ = require("jquery");

//引用css模块
require("../css/reset-css/build/reset.min.css");
require("../css/common.css");
require("../css/grid.css");
require("../less/rank.less");
//var bgimg = require("../image/ranking.png");

window.PIC_PATH = "http://p1.1room1.co/public";
window.V_PATH = "http://" + location.hostname.replace(/www./,'v.');

var getRankList = function(successCallback){

    $.ajax({
        url: window.V_PATH + '/video_gs/rank/data_ajax',
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"cb",
        success: function(json){
            if (successCallback) { successCallback(json) };
        },
        error: function(json){
           if(console){console.log("rank data fetch error")}
        }
    });

}

var Rank = React.createClass({

	/**
	 * 初始化数据
	 * @return {[type]} [description]
	 */
	getInitialState: function(){
		//全部，富豪，主播，赌圣
		return {
			tabKey: "all",
			rankList: [],
			rankData: {}
		}
	},

	/**
	 * 页面加载完成后加载此数据
	 * @return {[type]} [description]
	 */
	componentDidMount: function(){
		this.loadInfoFromServer();
	},

	/**
	 * 获取排行榜数据方法
	 * @return {[type]} [description]
	 */
	loadInfoFromServer: function(){
		getRankList($.proxy(function(data){
			this.setState({ rankData: data });
		}, this));
	},

	/**
	 * 点击切换key
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	rootHandler: function(e){
		var key = e.target.dataset.id;
		this.setState({ tabKey: key });
	},

	render: function(){
		return (
			<div id="rank">
				<RankTab onRootHandler={this.rootHandler}/>
				<RankList rankData={this.state.rankData} ></RankList>
			</div>
		)
	}

});

var RankTab = React.createClass({

	render: function(){
		return (
			<div className="rank-tab clearfix">
				<div className="rank-tab-btn active" data-id="all" onClick={this.props.onRootHandler}>总排行榜<div className="rank-tab-active"></div></div>
				<div className="rank-tab-btn" data-id="rich" onClick={this.props.onRootHandler}>日排行榜<div className="rank-tab-active"></div></div>
				<div className="rank-tab-btn" data-id="exp" onClick={this.props.onRootHandler}>周排行榜<div className="rank-tab-active"></div></div>
				<div className="rank-tab-btn" data-id="game" onClick={this.props.onRootHandler}>月排行榜<div className="rank-tab-active"></div></div>
			</div>
		)
	}

});

var RankList = React.createClass({
	
	/**
	 * 获取对象长度
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	getObjectLength: function(obj){
		var count = 0;
		
		for(var i in obj){
			if (obj.hasOwnProperty(i)) {
				count ++;
			};
		}

		return count;
	},

	/**
	 * 判断对象是否为空
	 * @param  {[type]}  obj [description]
	 * @return {Boolean}     [description]
	 */
	isNullObject: function(obj){
		return (this.getObjectLength(obj) == 0)? true: false;
	},

	/**
	 * 生成排行榜前三数据
	 * @return {[type]} [description]
	 */
	generateTopData: function(){
		
		if (this.isNullObject(this.props.rankData)) { return []; };

		var topData = this.props.rankData["rank_exp_his"];
		var topData = topData.slice(0, 3);

		var generateData = [topData[1], topData[0], topData[2]];

		return generateData;
	},

	/**
	 * 生成排行榜4-15排行数据
	 * @return {[type]} [description]
	 */
	generateBottomData: function(){

		if (this.isNullObject(this.props.rankData)) { return []; };

		var bottomData = this.props.rankData["rank_exp_his"];
		//slice方法能够自动处理topData的长度问题
		var generateData = bottomData.slice(3, 15);

		return generateData;
	},

	/**
	 * 生成排行榜前三模板
	 * @return {[type]} [description]
	 */
	getTopTmp: function(){

		var topTmp = [];
		var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

		var arrTopClass = ["rank-top-por ranl-top-por2", "rank-top-por ranl-top-por1", "rank-top-por ranl-top-por3"];
		var arrTopPor = ["rank-top-num rank-top-num2", "rank-top-num rank-top-num1", "rank-top-num rank-top-num3"];

		this.generateTopData().map(function(item, i){
			topTmp.push(
				<div className="col-xs-4" key={i}>
					<div className="rank-top-porwrapper clearfix">
						<div className={arrTopPor[i]}></div>
						<div className={arrTopClass[i]} style={{ backgroundImage:"url(" + porimg + ")" }}></div>
					</div>
					<div className="rank-top-title">{ item.username }</div>
					<div className="rank-top-diamond">{ item.score }</div>
				</div>
			);
		});

		return topTmp;

	},

	/**
	 * 生成排行榜4-15排行模板
	 * @return {[type]} [description]
	 */
	getBottomTmp: function(){
		var bottomTmp = [];
		var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

		this.generateBottomData().map(function(item, i){

			var count = ((i + 4) < 10) ? "0" + (i+4) : (i+4);

			bottomTmp.push(
				<div className="rank-bottom-item" key={ i }>
					<div className="rank-item-num">{ count }</div>
					<img className="rank-item-por" style={{ backgroundImage:"url(" + porimg + ")" }} />
					<div className="rank-item-info">
						<div className="rank-item-title">{ item.username }</div>
						<div className="rank-item-diamond">{ item.score }</div>
					</div>
				</div>
			);
		});

		return bottomTmp;
	},

	/**
	 * 渲染list模板
	 * @return {[type]} [description]
	 */
	render: function(){

		var topTmp = this.getTopTmp();
		var bottomTmp = this.getBottomTmp();

		var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

		return (
			<div className="rank-list">
				<div className="rank-top-row clearfix">
					{ topTmp }
				</div>

				<div className="rank-bottom-row clearfix">
					{ bottomTmp }
				</div>

			</div>
		)
	}

});

ReactDom.render(
	<Rank />,
	document.getElementById("rankPage")
);