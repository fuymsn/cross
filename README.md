# CROSS
## 什么是CROSS?
CROSS能够为你迅速搭建前端环境，能让前端开发者高效地管理前端资源，极大地提升了前端的可扩展性
CROSS包含以下特点

### ENV
* 开发和发布代码分离，利于开发者有效管理和定位代码
* 开发(dev)/线上(online)/线上调试(onlinedev)模式快速切换，使开发者迅速定位问题
* 代码一键编译发布
* 资源文件CDN一键配置和切换

### CSS
* css根据配置列表拼接，页面css加载量可控
* less代码实时编译监听
* css图片资源url可配置
* css autoprefix浏览器差异自动补全（可根据需求在Gruntjs中进行配置）
* css排序优化，压缩优化
* css语法检查

### JS
* js根据配置列表拼接，页面js加载可控
* js拼接，压缩优化
* js可配置动态导入
* js语法检查

### IMAGE
* PNG图片压缩
* todo: 图片资源文件CDN可配置
* todo: css sprite图片自动拼接
* todo: jpg 图片资源压缩

### 为移动端优化
* 公共第三方组件包vendor
* todo: 可用于子系统的service包
* todo: 方便集成webpack

### others
A Front-End Framework can be used to common website & mobile
* A simple application to import javascript &amp; css into page as the sync &amp; async way
* todo: can be applied to Grunt & webpack.
* todo: framework can be simple used the same node_modules from grunt and webpack.
* todo: 开启css, js, html语法检查
* todo: multi-app run
* todo: MVVM

# 环境配置
* node.js安装, [安装入口](https://nodejs.org/en/)
* npm依赖包安装，执行
```shell
$ npm install
```

# 基本操作
### 操作步骤
##### 1.环境配置
安装nodejs
安装npm依赖包
##### 2.运行grunt
```shell
$ grunt
```
##### 3.在html页面中导入入口文件
```html
<script type="text/javascript" src="dist/v2015112401/ued.import.js?v=1.0"></script>
```
##### 3.在html页面中导入入口文件script
src="dist/v2015112401/ued.import.js?v=1.0"
##### 4.在cross.list.js中配置页面css和js依赖
```js
module.exports = {
    'commonCss.css' : [
        'module/reset.css',
        'module/common.less'
    ],
    'commonJs.js' : [
        'widget/jquery.cookie.js',
        'module/dialog.js',
        'module/validation.js',
        'service/user.js',
    ]
}
```
##### 5.在html页面中导入依赖
```html
    <script type="text/javascript">
        app.importFile("commonCss", "css");
        app.importFile("commonJs", "js");
    </script>
```
##### 6.运行html页面

### 其他操作
##### 初始化package.json
```shell
$ npm init
```
然后按照步骤进行操作
##### 开发模式下，开启less代码编译监听
```shell
$ grunt watch
```
##### 开发模式(dev)/线上模式(online)/线上调试模式切换(onlinedev)
在/dist/v2014******/ued.import.js文件中修改如下配置，即可马上实现切换
```js
var Config = {
    mode: 'online' // dev/online/onlinedev
};
```

# Release History
* 2015-12-17 v0.1.0 optimize the process of less compilation
* 2015-12-18 v0.1.1 update grunt with csscomb
* 2015-12-19 v0.1.2 update grunt js's process of concat & uglify
* 2015-12-19 v0.1.3 put a unified config into package.json
* 2015-12-21 v0.2.0 
  1. 新增dev开发调试模式
  2. 新增onlinedev线上调试模式
  3. 优化dev/onlinedev/online三种模式切换
  4. 调试模式下，添加watch监听
  5. 调试模式下，移除页面加载less库和less配置文件
* 2015-12-21 v0.2.1
  1. 图片资源整合，可在grunt:less中配置图片资源路径
  2. 简化图片配置和发布流程
  3. 可对背景图片进行压缩
* 2014-12-22 v0.3.0
  1. 目录结构更新，分为src开发目录，dev调试目录和dist工程产出目录
  2. cross.import.js，Gruntfile.js配置更新
