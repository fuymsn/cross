webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(178);


/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(175);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(164)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./grid.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./grid.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(163)();
	// imports


	// module
	exports.push([module.id, "\r\n.container {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .container {\r\n    width: 750px;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .container {\r\n    width: 970px;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .container {\r\n    width: 1170px;\r\n  }\r\n}\r\n\r\n\r\n\r\n.row {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n\r\n.row:after, .row:before{\r\n  display: table;\r\n  content: \" \";\r\n}\r\n\r\n:after, :before {\r\n    -webkit-box-sizing: border-box;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.row:after{\r\n  clear: both;\r\n}\r\n\r\n\r\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\r\n  position: relative;\r\n  min-height: 1px;\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n}\r\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\r\n  float: left;\r\n}\r\n.col-xs-12 {\r\n  width: 100%;\r\n}\r\n.col-xs-11 {\r\n  width: 91.66666667%;\r\n}\r\n.col-xs-10 {\r\n  width: 83.33333333%;\r\n}\r\n.col-xs-9 {\r\n  width: 75%;\r\n}\r\n.col-xs-8 {\r\n  width: 66.66666667%;\r\n}\r\n.col-xs-7 {\r\n  width: 58.33333333%;\r\n}\r\n.col-xs-6 {\r\n  width: 50%;\r\n}\r\n.col-xs-5 {\r\n  width: 41.66666667%;\r\n}\r\n.col-xs-4 {\r\n  width: 33.33333333%;\r\n}\r\n.col-xs-3 {\r\n  width: 25%;\r\n}\r\n.col-xs-2 {\r\n  width: 16.66666667%;\r\n}\r\n.col-xs-1 {\r\n  width: 8.33333333%;\r\n}\r\n.col-xs-pull-12 {\r\n  right: 100%;\r\n}\r\n.col-xs-pull-11 {\r\n  right: 91.66666667%;\r\n}\r\n.col-xs-pull-10 {\r\n  right: 83.33333333%;\r\n}\r\n.col-xs-pull-9 {\r\n  right: 75%;\r\n}\r\n.col-xs-pull-8 {\r\n  right: 66.66666667%;\r\n}\r\n.col-xs-pull-7 {\r\n  right: 58.33333333%;\r\n}\r\n.col-xs-pull-6 {\r\n  right: 50%;\r\n}\r\n.col-xs-pull-5 {\r\n  right: 41.66666667%;\r\n}\r\n.col-xs-pull-4 {\r\n  right: 33.33333333%;\r\n}\r\n.col-xs-pull-3 {\r\n  right: 25%;\r\n}\r\n.col-xs-pull-2 {\r\n  right: 16.66666667%;\r\n}\r\n.col-xs-pull-1 {\r\n  right: 8.33333333%;\r\n}\r\n.col-xs-pull-0 {\r\n  right: auto;\r\n}\r\n.col-xs-push-12 {\r\n  left: 100%;\r\n}\r\n.col-xs-push-11 {\r\n  left: 91.66666667%;\r\n}\r\n.col-xs-push-10 {\r\n  left: 83.33333333%;\r\n}\r\n.col-xs-push-9 {\r\n  left: 75%;\r\n}\r\n.col-xs-push-8 {\r\n  left: 66.66666667%;\r\n}\r\n.col-xs-push-7 {\r\n  left: 58.33333333%;\r\n}\r\n.col-xs-push-6 {\r\n  left: 50%;\r\n}\r\n.col-xs-push-5 {\r\n  left: 41.66666667%;\r\n}\r\n.col-xs-push-4 {\r\n  left: 33.33333333%;\r\n}\r\n.col-xs-push-3 {\r\n  left: 25%;\r\n}\r\n.col-xs-push-2 {\r\n  left: 16.66666667%;\r\n}\r\n.col-xs-push-1 {\r\n  left: 8.33333333%;\r\n}\r\n.col-xs-push-0 {\r\n  left: auto;\r\n}\r\n.col-xs-offset-12 {\r\n  margin-left: 100%;\r\n}\r\n.col-xs-offset-11 {\r\n  margin-left: 91.66666667%;\r\n}\r\n.col-xs-offset-10 {\r\n  margin-left: 83.33333333%;\r\n}\r\n.col-xs-offset-9 {\r\n  margin-left: 75%;\r\n}\r\n.col-xs-offset-8 {\r\n  margin-left: 66.66666667%;\r\n}\r\n.col-xs-offset-7 {\r\n  margin-left: 58.33333333%;\r\n}\r\n.col-xs-offset-6 {\r\n  margin-left: 50%;\r\n}\r\n.col-xs-offset-5 {\r\n  margin-left: 41.66666667%;\r\n}\r\n.col-xs-offset-4 {\r\n  margin-left: 33.33333333%;\r\n}\r\n.col-xs-offset-3 {\r\n  margin-left: 25%;\r\n}\r\n.col-xs-offset-2 {\r\n  margin-left: 16.66666667%;\r\n}\r\n.col-xs-offset-1 {\r\n  margin-left: 8.33333333%;\r\n}\r\n.col-xs-offset-0 {\r\n  margin-left: 0;\r\n}\r\n@media (min-width: 768px) {\r\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\r\n    float: left;\r\n  }\r\n  .col-sm-12 {\r\n    width: 100%;\r\n  }\r\n  .col-sm-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-sm-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-sm-9 {\r\n    width: 75%;\r\n  }\r\n  .col-sm-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-sm-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-sm-6 {\r\n    width: 50%;\r\n  }\r\n  .col-sm-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-sm-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-sm-3 {\r\n    width: 25%;\r\n  }\r\n  .col-sm-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-sm-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-sm-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-sm-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-sm-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-sm-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-sm-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-sm-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-sm-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-sm-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-sm-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-sm-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-sm-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-sm-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-sm-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-sm-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-sm-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-sm-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-sm-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-sm-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-sm-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-sm-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-sm-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-sm-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-sm-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-sm-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-sm-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-sm-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-sm-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-sm-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-sm-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-sm-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-sm-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-sm-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-sm-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-sm-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-sm-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-sm-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-sm-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-sm-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-sm-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\r\n    float: left;\r\n  }\r\n  .col-md-12 {\r\n    width: 100%;\r\n  }\r\n  .col-md-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-md-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-md-9 {\r\n    width: 75%;\r\n  }\r\n  .col-md-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-md-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-md-6 {\r\n    width: 50%;\r\n  }\r\n  .col-md-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-md-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-md-3 {\r\n    width: 25%;\r\n  }\r\n  .col-md-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-md-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-md-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-md-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-md-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-md-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-md-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-md-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-md-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-md-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-md-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-md-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-md-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-md-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-md-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-md-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-md-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-md-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-md-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-md-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-md-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-md-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-md-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-md-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-md-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-md-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-md-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-md-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-md-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-md-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-md-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-md-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-md-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-md-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-md-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-md-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-md-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-md-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-md-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-md-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-md-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\r\n    float: left;\r\n  }\r\n  .col-lg-12 {\r\n    width: 100%;\r\n  }\r\n  .col-lg-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-lg-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-lg-9 {\r\n    width: 75%;\r\n  }\r\n  .col-lg-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-lg-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-lg-6 {\r\n    width: 50%;\r\n  }\r\n  .col-lg-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-lg-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-lg-3 {\r\n    width: 25%;\r\n  }\r\n  .col-lg-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-lg-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-lg-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-lg-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-lg-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-lg-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-lg-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-lg-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-lg-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-lg-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-lg-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-lg-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-lg-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-lg-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-lg-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-lg-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-lg-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-lg-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-lg-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-lg-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-lg-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-lg-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-lg-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-lg-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-lg-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-lg-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-lg-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-lg-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-lg-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-lg-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-lg-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-lg-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-lg-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-lg-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-lg-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-lg-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-lg-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-lg-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-lg-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-lg-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-lg-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}", ""]);

	// exports


/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(2);
	var ReactDom = __webpack_require__(159);
	var $ = __webpack_require__(160);

	//引用css模块
	__webpack_require__(161);
	__webpack_require__(165);
	__webpack_require__(174);
	__webpack_require__(179);
	//var bgimg = require("../image/ranking.png");

	window.PIC_PATH = "http://p1.1room1.co/public";
	window.V_PATH = "http://" + location.hostname.replace(/www./, 'v.');

	var getRankList = function getRankList(successCallback) {

		$.ajax({
			url: window.V_PATH + '/video_gs/rank/data_ajax',
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: "cb",
			success: function success(json) {
				if (successCallback) {
					successCallback(json);
				};
			},
			error: function error(json) {
				if (console) {
					console.log("rank data fetch error");
				}
			}
		});
	};

	var Rank = React.createClass({
		displayName: "Rank",

		/**
	  * 初始化数据
	  * @return {[type]} [description]
	  */
		getInitialState: function getInitialState() {
			//全部，富豪，主播，赌圣
			return {
				tabKey: "all",
				rankList: [],
				rankData: {}
			};
		},

		/**
	  * 页面加载完成后加载此数据
	  * @return {[type]} [description]
	  */
		componentDidMount: function componentDidMount() {
			this.loadInfoFromServer();
		},

		/**
	  * 获取排行榜数据方法
	  * @return {[type]} [description]
	  */
		loadInfoFromServer: function loadInfoFromServer() {
			getRankList($.proxy(function (data) {
				this.setState({ rankData: data });
			}, this));
		},

		/**
	  * 点击切换key
	  * @param  {[type]} e [description]
	  * @return {[type]}   [description]
	  */
		rootHandler: function rootHandler(e) {
			var key = e.target.dataset.id;
			this.setState({ tabKey: key });
		},

		render: function render() {
			return React.createElement(
				"div",
				{ id: "rank" },
				React.createElement(RankTab, { onRootHandler: this.rootHandler }),
				React.createElement(RankList, { rankData: this.state.rankData })
			);
		}

	});

	var RankTab = React.createClass({
		displayName: "RankTab",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "rank-tab clearfix" },
				React.createElement(
					"div",
					{ className: "rank-tab-btn active", "data-id": "all", onClick: this.props.onRootHandler },
					"总排行榜",
					React.createElement("div", { className: "rank-tab-active" })
				),
				React.createElement(
					"div",
					{ className: "rank-tab-btn", "data-id": "rich", onClick: this.props.onRootHandler },
					"日排行榜",
					React.createElement("div", { className: "rank-tab-active" })
				),
				React.createElement(
					"div",
					{ className: "rank-tab-btn", "data-id": "exp", onClick: this.props.onRootHandler },
					"周排行榜",
					React.createElement("div", { className: "rank-tab-active" })
				),
				React.createElement(
					"div",
					{ className: "rank-tab-btn", "data-id": "game", onClick: this.props.onRootHandler },
					"月排行榜",
					React.createElement("div", { className: "rank-tab-active" })
				)
			);
		}

	});

	var RankList = React.createClass({
		displayName: "RankList",

		/**
	  * 获取对象长度
	  * @param  {[type]} obj [description]
	  * @return {[type]}     [description]
	  */
		getObjectLength: function getObjectLength(obj) {
			var count = 0;

			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					count++;
				};
			}

			return count;
		},

		/**
	  * 判断对象是否为空
	  * @param  {[type]}  obj [description]
	  * @return {Boolean}     [description]
	  */
		isNullObject: function isNullObject(obj) {
			return this.getObjectLength(obj) == 0 ? true : false;
		},

		/**
	  * 生成排行榜前三数据
	  * @return {[type]} [description]
	  */
		generateTopData: function generateTopData() {

			if (this.isNullObject(this.props.rankData)) {
				return [];
			};

			var topData = this.props.rankData["rank_exp_his"];
			var topData = topData.slice(0, 3);

			var generateData = [topData[1], topData[0], topData[2]];

			return generateData;
		},

		/**
	  * 生成排行榜4-15排行数据
	  * @return {[type]} [description]
	  */
		generateBottomData: function generateBottomData() {

			if (this.isNullObject(this.props.rankData)) {
				return [];
			};

			var bottomData = this.props.rankData["rank_exp_his"];
			//slice方法能够自动处理topData的长度问题
			var generateData = bottomData.slice(3, 15);

			return generateData;
		},

		/**
	  * 生成排行榜前三模板
	  * @return {[type]} [description]
	  */
		getTopTmp: function getTopTmp() {

			var topTmp = [];
			var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

			var arrTopClass = ["rank-top-por ranl-top-por2", "rank-top-por ranl-top-por1", "rank-top-por ranl-top-por3"];
			var arrTopPor = ["rank-top-num rank-top-num2", "rank-top-num rank-top-num1", "rank-top-num rank-top-num3"];

			this.generateTopData().map(function (item, i) {
				topTmp.push(React.createElement(
					"div",
					{ className: "col-xs-4", key: i },
					React.createElement(
						"div",
						{ className: "rank-top-porwrapper clearfix" },
						React.createElement("div", { className: arrTopPor[i] }),
						React.createElement("div", { className: arrTopClass[i], style: { backgroundImage: "url(" + porimg + ")" } })
					),
					React.createElement(
						"div",
						{ className: "rank-top-title" },
						item.username
					),
					React.createElement(
						"div",
						{ className: "rank-top-diamond" },
						item.score
					)
				));
			});

			return topTmp;
		},

		/**
	  * 生成排行榜4-15排行模板
	  * @return {[type]} [description]
	  */
		getBottomTmp: function getBottomTmp() {
			var bottomTmp = [];
			var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

			this.generateBottomData().map(function (item, i) {

				var count = i + 4 < 10 ? "0" + (i + 4) : i + 4;

				bottomTmp.push(React.createElement(
					"div",
					{ className: "rank-bottom-item", key: i },
					React.createElement(
						"div",
						{ className: "rank-item-num" },
						count
					),
					React.createElement("img", { className: "rank-item-por", style: { backgroundImage: "url(" + porimg + ")" } }),
					React.createElement(
						"div",
						{ className: "rank-item-info" },
						React.createElement(
							"div",
							{ className: "rank-item-title" },
							item.username
						),
						React.createElement(
							"div",
							{ className: "rank-item-diamond" },
							item.score
						)
					)
				));
			});

			return bottomTmp;
		},

		/**
	  * 渲染list模板
	  * @return {[type]} [description]
	  */
		render: function render() {

			var topTmp = this.getTopTmp();
			var bottomTmp = this.getBottomTmp();

			var porimg = window.PIC_PATH + "/images/vzhubo.jpg";

			return React.createElement(
				"div",
				{ className: "rank-list" },
				React.createElement(
					"div",
					{ className: "rank-top-row clearfix" },
					topTmp
				),
				React.createElement(
					"div",
					{ className: "rank-bottom-row clearfix" },
					bottomTmp
				)
			);
		}

	});

	ReactDom.render(React.createElement(Rank, null), document.getElementById("rankPage"));

/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(180);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(164)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./rank.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./rank.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(163)();
	// imports


	// module
	exports.push([module.id, ".rank-tab {\n  height: 41px;\n}\n.rank-tab .rank-tab-btn {\n  float: left;\n  font-size: 14px;\n  width: 25%;\n  padding: 10px 0px;\n  cursor: pointer;\n  background-color: #fff;\n  text-align: center;\n  position: relative;\n}\n.rank-tab .rank-tab-btn.active .rank-tab-active {\n  width: 100%;\n  height: 4px;\n  background-color: #fb296b;\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n}\n.rank-list .rank-top-row {\n  margin-top: 25px;\n}\n.rank-list .rank-top-row .col-xs-4 {\n  padding-left: 10px;\n  padding-right: 10px;\n}\n.rank-list .rank-top-row .rank-top-porwrapper {\n  height: 100px;\n  position: relative;\n}\n.rank-list .rank-top-row .ranl-top-por1 {\n  height: 100px;\n  width: 100px;\n}\n.rank-list .rank-top-row .ranl-top-por2 {\n  height: 85px;\n  width: 85px;\n  margin-top: 15px;\n}\n.rank-list .rank-top-row .ranl-top-por3 {\n  height: 70px;\n  width: 70px;\n  margin-top: 30px;\n}\n.rank-list .rank-top-row .rank-top-por {\n  display: block;\n  border-radius: 100px;\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 0px;\n  background-size: cover;\n  background-position: center;\n}\n.rank-list .rank-top-row .rank-top-title {\n  margin-top: 6px;\n  text-align: center;\n}\n.rank-list .rank-top-row .rank-top-diamond {\n  text-align: center;\n}\n.rank-list .rank-top-row .rank-top-num {\n  width: 37px;\n  height: 37px;\n  position: absolute;\n  left: 50%;\n  margin-left: -19px;\n  background-image: url(" + __webpack_require__(181) + ");\n}\n.rank-list .rank-top-row .rank-top-num1 {\n  top: -17px;\n  background-position: 0px 0px;\n}\n.rank-list .rank-top-row .rank-top-num2 {\n  top: -3px;\n  background-position: -38px 0px;\n}\n.rank-list .rank-top-row .rank-top-num3 {\n  top: 13px;\n  background-position: -76px 0px;\n}\n.rank-list .rank-bottom-row {\n  margin: 15px 10px 0px 10px;\n  border-top: 1px solid #ccc;\n}\n.rank-list .rank-bottom-row .rank-bottom-item {\n  height: 50px;\n  padding: 10px 0px 10px 0px;\n  border-bottom: 1px solid #ccc;\n}\n.rank-list .rank-bottom-row .rank-item-num {\n  font-size: 24px;\n  line-height: 50px;\n  font-weight: bold;\n  float: left;\n  margin-right: 15px;\n}\n.rank-list .rank-bottom-row .rank-item-por {\n  display: block;\n  height: 50px;\n  width: 50px;\n  background-size: cover;\n  background-position: center;\n  float: left;\n  border-radius: 50px;\n  margin-right: 15px;\n}\n.rank-list .rank-bottom-row .rank-item-title {\n  font-size: 14px;\n  margin-top: 5px;\n}\n", ""]);

	// exports


/***/ },

/***/ 181:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2a76259356cc048338fb2ebeb140e840.png";

/***/ }

});