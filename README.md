# CROSS
## 什么是CROSS?
CROSS能够帮助你迅速搭建前端环境，让前端开发者高效地管理前端资源，提高开发效率
CROSS包含以下特性
### Environment
* 开发和发布代码分离，利于开发者有效管理和定位代码
* 开发(dev)/线上(online)/线上调试(onlinedev)模式快速切换，使开发者迅速定位问题
* 生产环境代码一键编译发布
* 快速CDN切换和配置

### CSS
* css根据配置列表按需加载，页面css加载量可控
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
A Front-End Env can be used to common website & mobile
* todo: can be applied to Grunt & webpack.
* todo: framework can be simple used the same node_modules from grunt and webpack.
* todo: multi-app run
* todo: MVVM

# 环境配置
* 安装node.js, [安装入口](https://nodejs.org/en/)
* 安装grunt运行环境（需要网络）
```shell
$ npm install -g grunt-cli
```
* 安装npm依赖包
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
##### 开发模式下，开启开发模式监听
```shell
$ grunt watch
```
开发模式监听包括
* 配置文件监听，当配置文件被修改以后，配置文件会重载，并重新执行grunt dev任务
* less编译监听，grunt watch会实时检测less文件是否有修改，如果有修改，less会被重新编译成css文件
* css语法检查（可自行开启和关闭）
* JavaScript语法检查（可自行开启和关闭）
##### 开发模式(dev)/线上模式(online)/线上调试模式切换(onlinedev)
在/dist/v2016******/ued.import.js文件中修改如下配置，即可马上实现切换
```js
var Config = {
    mode: 'online' // dev/online/onlinedev
};
```

# 配置 Config
### Grunt配置
##### Gruntfile.js
CROSS中Grunt已经完成了大部分配置，开发者如需要添加grunt的其他功能，只需通过npm添加grunt插件，然后在Gruntfile.js中配置即可。[配置直通车](http://gruntjs.com/configuring-tasks)
##### package.json
CROSS中的package.json为标准的npm配置，开发者也可通过npm自行配置，例如初始化package.json
```shell
$ npm init
```
然后根据提示输入相应信息。
##### css图片路径修改
将grunt中initConfig中的modifyVars的imagePath对象修改为自己需要的路径，示例如下：
```js
grunt.initConfig({
    less: {
        modifyVars: {
            imagePath:'"http://www.your-path.com"'
        }
    }
}
```

### CROSS配置
##### cross.config.js
cross的配置在cross.config.js文件中配置
* **publishVersion**
<br/>发布版本号，可自定义 
* **subPublishVersion**
<br/>发布子版本号，可自定义
* **resource**
<br/>由corss自动生成
* **cdnPath**
<br/>用于配置cdn列表，如果配置两个以上的cdn，每次刷新页面cdn会随机选择和跳转
* **imagePath**
<br/>用于配置图片cdn，可自定义
* **mode**
<br/>JavaScript运行模式。分别为dev（开发）, onlinedev（线上调试）, online（生产）模式

##### cross.list.js
所有页面依赖配置都在cross.list.js中配置，配置的格式以key value的形式表现。例如配置page-a：
```js
{
    'pageaJs.js' : [
        'module/module-b.js',
        'page/page-a.js'
    ]
}
```
然后在页面中引用pageaJs.js即可，css文件引用同理
```html
<script type="text/javascript">
    cross.importFile("pageaJs", "js");
</script>
```

### 目录结构说明
##### dest
dest目录为grunt执行`grunt dest`任务后的目标目录，即生产环境代码。
##### dev
dev目录为grunt执行`grunt dev`任务后的目标目录，即开发调试代码，less编译后的文件都在这里生成。
##### mobile
mobile目录是移动端需要的开发资源。
##### node_modules
node_modules目录是npm包管理目录。
##### src
src目录为开发资源文件目录，所有的开发资源文件都集中到此目录统一管理。所有开发者在开发时只需关注此目录即可。
##### 其他
* cross.config.js, cross.import.js和cross.list.js分别为cross配置文件，cross页面加载导入程序和页面加载依赖列表。
* index.html 测试页面
* Gruntfile.js, package.json 为grunt相关配置文件


# Release History
* 2015-12-17 v0.1.0 初始版本发布，优化less发布流程 optimize the process of less compilation
* 2015-12-18 v0.1.1 更新grunt csscomb配置 update grunt with csscomb
* 2015-12-19 v0.1.2 优化js拼接和压缩过程 update grunt js's process of concat & uglify
* 2015-12-19 v0.1.3 优化package.json配置 put a unified config into package.json
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
* 2015-12-22 v0.3.0
  1. 目录结构更新，分为src开发目录，dev调试目录和dist工程产出目录
  2. cross.import.js，Gruntfile.js配置更新
* 2015-12-23 v0.3.1 更新测试文件
* 2015-12-29 v0.3.2 优化发布流程，缩短发布时间，修复dev模式下，import.js中的list没有更新bug
* 2015-12-30 v0.3.3
  1. 重新设计配置文件，CROSS配置信息统一从cross.config.js读取
  2. 移除.cross.concat.js文件生成和删除任务
* 2015-12-31 v0.3.4 
  1. 优化cross.list.js列表
  2. 优化watch监听任务，分离corss.js生成方式
  3. 新增csslint语法检查监听
  4. 新增jslint语法检查监听
* 2016-1-1 v0.3.5
  1. 优化cross.list.js和grunt配置，优化配置复杂度
  2. 优化发布编译速度