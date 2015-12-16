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
require("../less/register.less");

var Login = React.createClass({

	getInitialState: function(){

		return {
			loginState: "未注册"
		}

	},

	loginHandle: function(){

		var un = this.refs.uname.value;
		var nn = this.refs.nname.value;
		var pwd = this.refs.password.value;
		var repwd = this.refs.repassword.value;
		var cap = this.refs.captcha.value;

		var that = this;

        //登录接口调用
        UserService.actionRegister({
            username: un,
            nickname: nn,
            password: pwd,
            repassword: repwd,
            captcha: "",
            sucCallback: function(){
                that.setState({ loginState: "已注册" });
            },
            errCallback: function(){
                that.setState({ loginState: "注册失败" });
            }
        });

	},

	render: function(){

		return (
			<div id="login" className="container">
				<div className="login-header">
					<div className="login-title">使用第一坊账号注册</div>
					<div className="login-line"></div>
				</div>
				<div className="login-item">
					<input id="uname" type="text" ref="uname" placeholder="请输入您的邮箱" />
				</div>
				<div className="login-item">
					<input id="nname" type="text" ref="nname" placeholder="请输入您的昵称" />
				</div>
				<div className="login-item">
					<input id="password" type="password" ref="password" placeholder="密码由6-22个字母和数字组成" />
				</div>
				<div className="login-item">
					<input id="repassword" type="password" ref="repassword" placeholder="输入确认密码" />
				</div>
				<div className="login-item row">
					<div className="col-xs-6">
						<input id="captcha" type="text" ref="captcha" placeholder="验证码" />
					</div>
					<div className="col-xs-6">
						<img src="/verfiycode" />
					</div>
				</div>
				<div className="row">
					<label className="col-xs-6">
						<input type="button" value="返回登录" className="btn btn-white btn-block"/>
					</label>
					<label className="col-xs-6">
						<input type="button" value="注册" className="btn btn-red btn-block" onClick={this.loginHandle}/>
					</label>
				</div>
				<div id="loginState">{ this.state.loginState }</div>
			</div>
		)

	}

});

ReactDom.render(
	<Login />,
	document.getElementById("regPage")
);