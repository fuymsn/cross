//库引用
var React = require("react");
var ReactDom = require("react-dom");
var $ = require("jquery");

//引用js模块
var UserService = require("../../service/user.js");
var Captcha = require("../../service/captcha.js");

//引用css模块
require("../css/reset-css/build/reset.min.css");
require("../css/common.css");
require("../css/grid.css");
require("../less/login.less");

var Login = React.createClass({

	getInitialState: function(){

		return {
			loginState: "未登录"
		}

	},

	loginHandle: function(){

		var un = this.refs.uname.value;
		var pwd = this.refs.password.value;
		var that = this;

        //登录接口调用
        UserService.actionLogin({
            username: un,
            password: pwd,
            captcha: "",
            remember: 1,
            sucCallback: function(){
                that.setState({ loginState: "已登录" });
            },
            errCallback: function(){
                that.setState({ loginState: "登录失败" });
            }
        });

	},

	render: function(){

		return (
			<div id="login" className="container">
				<div className="login-header">
					<div className="login-title">使用第一坊账号登录</div>
					<div className="login-line"></div>
				</div>
				<div className="login-item">
					<input id="uname" type="text" ref="uname" placeholder="请输入您的登录邮箱" />
				</div>
				<div className="login-item">
					<input id="password" type="password" ref="password" placeholder="请输入您的密码" />
				</div>
				<div className="row">
					<label className="col-xs-6">
						<input type="button" value="新用户注册" className="btn btn-white btn-block" onClick={this.loginHandle}/>
					</label>
					<label className="col-xs-6">
						<input type="button" value="登录" className="btn btn-red btn-block" onClick={this.loginHandle}/>
					</label>
				</div>
				<div id="loginState">{ this.state.loginState }</div>
			</div>
		)

	}

});

ReactDom.render(
	<Login />,
	document.getElementById("loginPage")
);