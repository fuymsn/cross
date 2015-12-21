/*global module:false*/
module.exports = function(grunt) {
    
    //package config
    var pkg = grunt.file.readJSON('package.json');
    
    //public version
    var publishVersion = pkg.publishVersion;
    
    //subject public version
    var subPublishVersion = pkg.subPublishVersion;
    
    var pageList = require("./cross.list.js"),

        //base path
        baseJsPath = "js/",
        baseCssPath = "css/",
        
        //serivce path => /web/service/user.js @example /回到public的父级
        serviceJsPath = "../",
        
        //dist path
        distPath = 'dist/'+ publishVersion + '/',
        
        //dev path
        devPath = 'dev/';

    //判断是否从service文件夹导入
    var isServiceFile = function(str){
        return /^service\//.test(str);
    }
    
    //less 编译数组列表
    var lessCompile = {};
    var cssCompile = {};
    
    for (var i in pageList){
        
        if(i.indexOf(".js") > -1){ continue; }
        
        var arrCssItem = [];
        var cssDistPath = distPath + "css/" + i;
        var cssDistMinPath = distPath + "css/" + i.replace(".css", "-min.css");
        
        for(var j = 0; j < pageList[i].length; j++){
            arrCssItem[j] = baseCssPath + pageList[i][j];
        }
        
        lessCompile[cssDistPath] = arrCssItem;
        cssCompile[cssDistMinPath] = cssDistPath;
    }
    
    //console.log(lessCompile);
    //console.log(cssCompile);
    
    //js编译列表
    var jsConcat = {};
    var jsMinify = {};
    
    jsConcat[distPath + 'ued.import.js'] = ['.cross.concat.js', 'cross.conf.js', 'cross.import.js'];
    jsMinify[distPath + 'ued.import-min.js'] = distPath + 'ued.import.js';
    
    for(var i in pageList){
        //如果是css，返回
        if(i.indexOf(".css") > -1){ continue; }
        
        //js处理
        var arrJsItem = [];
        var jsDistPath = distPath + "js/" + i;
        var jsDistMinPath = distPath + "js/" + i.replace(".js", "-min.js");
        
        for(var j = 0; j < pageList[i].length; j++){
            
            if(isServiceFile(pageList[i][j])){
                arrJsItem[j] = serviceJsPath + pageList[i][j];
            }else{
                arrJsItem[j] = baseJsPath + pageList[i][j];
            }
            
        }
        
        jsConcat[jsDistPath] = arrJsItem;
        jsMinify[jsDistMinPath] = jsDistPath;
    }
    
    //console.log(jsConcat);
    //console.log(jsMinify);
    
    //开发模式编译数组列表
    var lessDevCompile = {};
    
    for(var i in pageList){
        
        if(i.indexOf(".js") > -1){ continue; }
        
        for(var j = 0; j < pageList[i].length; j++){
            lessDevCompile[devPath + "css/" + pageList[i][j].replace(".less", ".css")] = baseCssPath + pageList[i][j];
        }
        
    }
    
    //console.log(lessDevCompile);

    //生成cross.concat.js
    grunt.file.write('.cross.concat.js', 'window.UED_PUBLISH_VERSION = "'+ publishVersion + '";\nwindow.UED_SUB_PUBLISH_VERSION = "'+ subPublishVersion +'";\nwindow.UED_LIST = '+ JSON.stringify(pageList) +';');

    
    //HTML文件替换任务
    grunt.log.writeln("Running 'replace HTML files' task");

    var fs = require('fs');
    //同步的方式读取file文件
    var filenameArr = fs.readdirSync('../');
    //静态html文件对象
    var staticFilePath = {};
    //create a list of filenameArr
    for (var i = filenameArr.length - 1; i >= 0; i--) {
        if (/(?=.+).html/.test(filenameArr[i])) {
            staticFilePath['../' + filenameArr[i]] = '../' + filenameArr[i];
        };
    };

    //替换js/css目录中的url版本号
    for (var m in staticFilePath){
        var pageContent = grunt.file.read(m).replace(/v[0-9]{10}/g, publishVersion).replace(/[0-9]+.[0-9]+(?="\>\<\/script\>)/, subPublishVersion);
        grunt.file.write(staticFilePath[m], pageContent);
        console.log("'" + m + "' replace successfully");
    }

    grunt.log.oklns("finish replace HTML.");


    // 项目配置
    grunt.initConfig({
        //清除dist目录所有文件
        pkg: pkg,
        clean: {
            dist: {
                src: ['dist/']
            },
            dev: {
                src: ['dev/']
            },
            tmp: {
                src: ['.cross.concat.js']
            },
            js: {
                src: ['dist/'+ publishVersion +'/js']
            },
            css: {
                src: ['dist/'+ publishVersion +'/css']
            },
            img: {
                src: ['dist/'+ publishVersion + '/i']
            }
        },

        //将css背景图片资源复制到dist中
        copy: {
            devimg: {
                expand: true,
                cwd: 'css/i',
                src: '**',
                dest: 'dev/css/i'
            },
            img: {
                expand: true,
                cwd: 'css/i',
                src: '**',
                dest: 'dist/' + publishVersion + '/i'
            }
        },

        qunit: {
            files: ['test/**/*.html']
        },

        watch: {
            options: {
                spawn: true,
            },
            //配置文件修改监听
            configFiles: {
                files: [ 'Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            
            //less文件修改监听
            less: {
                files: ['css/*/*.less', 'css/*/*.css'],
                tasks: ['less:dev']
            },
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true
            }
        },
        
        //合并js
        concat:{
            import: {
                files: jsConcat
            }
        },

        //压缩js
        uglify: {
            options:{
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                compress: {
                    //移除console
                    drop_console: true
                }
            },
            
            //页面文件压缩
            dist: {
                files: jsMinify
            }
        },
        //css检查
        csslint: {
            options: {
                csslintrc: 'css/.csslintrc'
            },
            src: 'css/*.css'
        },

        less:{
            //开发模式
            dev:{
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    //压缩
                    compress: false,
                },
                files: lessDevCompile
            },
            
            //线上发布
            
            dist:{
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    //压缩
                    compress: false,
                    //ie兼容
                    ieCompat: true,
                    
                    //插件配置
                    plugins: [
                        //浏览器兼容性处理，css3浏览器修复，自动添加-webkit等前缀
                        new (require('less-plugin-autoprefix'))({
                            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9']
                        })
                        
                    ]
                },
                files: lessCompile
            }
        },
        
        //梳理css
        csscomb: {
            dist: {
                options: {
                    config: 'css/.csscomb.json'
                },
                files: cssCompile
            }
        },
        
        cssmin: {
            dist: {
                options: {
                    
                },
                
                files: cssCompile
            }
        },

        //image min
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义图片优化水平
                },
                files: [{
                    expand: true, 
                    cwd: 'dist/'+ publishVersion + '/i/',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化 cwd路径目录下所有 png/jpg/jpeg 图片
                    dest: 'dist/'+ publishVersion + '/i/'
                }]
            }
        }

    });

    // 加载所有依赖插件
    require('load-grunt-tasks')(grunt, { scope: 'dependencies'});

    // 默认任务
    grunt.registerTask('css-lint', ['csslint']);
    
    //注册开发模式
    //生成css
    grunt.registerTask('dev-css', ['less:dev', 'clean:tmp']);
    //dev
    grunt.registerTask('dev', ['clean:dev', 'copy:devimg', 'less:dev', 'clean:tmp']);
    
    
    
    //注册线上模式
    //清除dist目录
    grunt.registerTask('dist-clean', ['clean:dist']);
    
    //生成css
    grunt.registerTask('dist-css', ['clean:css', 'less:dist', 'csscomb', 'cssmin']);
    
    //生成js
    grunt.registerTask('dist-js', ['clean:js', 'concat:import', 'uglify']);
    
    //压缩图片
    grunt.registerTask('dist-img', ['clean:img', 'copy:img', 'imagemin']);
    
    //清除残留文件
    grunt.registerTask('dist-cleantmp', ['clean:tmp']);

    //online
    grunt.registerTask('default', ['dist-clean', 'dist-css', 'dist-js', 'dist-img', 'dist-cleantmp']);


};
