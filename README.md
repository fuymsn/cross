# CROSS-Framework
A Front-End Framework can be used to common website & mobile
* A simple application to import javascript &amp; css into page as the sync &amp; async way
* todo: can be applied to Grunt & webpack.
* todo: framework can be simple used the same node_modules from grunt and webpack.

# 基本操作
### 初始化package.json
``shell
$ npm init
``
然后按照步骤进行操作
### 开发模式下，开启less代码编译监听
``shell
$ grunt watch
``
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
