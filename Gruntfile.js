/*global module:false*/
module.exports = function(grunt) {
    
    //package config
    var pkg = grunt.file.readJSON('package.json');
    var config = getConfig();
    
    //publish version
    var publishVersion = config.publishVersion;
    
    //subject publish version
    var subPublishVersion = config.subPublishVersion;
    
    var pageList = getListConfig(),

        //base path
        basePath = "src/",
        baseJsPath = basePath + "js/",
        baseCssPath = basePath + "style/",
        
        //serivce path => src/service/user.js @example /回到src的父级
        serviceJsPath = basePath,
        
        //dest path
        destPath = 'dest/',
        destToPath = destPath + publishVersion + '/',
        
        //dev path
        devPath = 'dev/',
        devCssPath = devPath + "css/";

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
        var cssDestPath = destToPath + "css/" + i;
        var cssDestMinPath = destToPath + "css/" + i.replace(".css", "-min.css");
        
        for(var j = 0; j < pageList[i].length; j++){
            arrCssItem[j] = baseCssPath + pageList[i][j];
        }
        
        lessCompile[cssDestPath] = arrCssItem;
        cssCompile[cssDestMinPath] = cssDestPath;
    }
    
    //console.log(lessCompile);
    //console.log(cssCompile);
    
    //js编译列表
    var jsImportConcat = {};
    var jsConcat = {};
    var jsImportMinify = {};
    var jsMinify = {};
    
    jsImportConcat[destToPath + 'cross.js'] = ['cross.list.js', 'cross.config.js', 'cross.import.js'];
    jsImportMinify[destToPath + 'cross-min.js'] = destToPath + 'cross.js';
    
    for(var i in pageList){
        //如果是css，返回
        if(i.indexOf(".css") > -1){ continue; }
        
        //js处理
        var arrJsItem = [];
        var jsDestPath = destToPath + "js/" + i;
        var jsDestMinPath = destToPath + "js/" + i.replace(".js", "-min.js");
        
        for(var j = 0; j < pageList[i].length; j++){
            
            if(isServiceFile(pageList[i][j])){
                arrJsItem[j] = serviceJsPath + pageList[i][j];
            }else{
                arrJsItem[j] = baseJsPath + pageList[i][j];
            }
            
        }
        
        jsConcat[jsDestPath] = arrJsItem;
        jsMinify[jsDestMinPath] = jsDestPath;
    }
    
    //console.log(jsConcat);
    //console.log(jsMinify);
    
    //开发模式编译数组列表
    var lessDevCompile = {};
    
    for(var i in pageList){
        
        if(i.indexOf(".js") > -1){ continue; }
        
        for(var j = 0; j < pageList[i].length; j++){
            lessDevCompile[devCssPath + pageList[i][j].replace(".less", ".css")] = baseCssPath + pageList[i][j];
        }
        
    }
    
    //console.log(lessDevCompile);
    
    //从cross.config.js获取配置信息
    function getConfig(){
        var configContent = grunt.file.read("cross.config.js");
        eval(configContent);
        return Config;
    };
    
    //从cross.list.js获取配置信息
    function getListConfig(){
        var listContent = grunt.file.read("cross.list.js");
        eval(listContent);
        return crossList;
    };
    
    // 项目配置
    grunt.initConfig({
        //清除dest目录所有文件
        pkg: pkg,
        clean: {
            dest: {
                src: [destPath]
            },
            dev: {
                src: [devPath]
            },
            js: {
                src: [destToPath + 'js']
            },
            css: {
                src: [destToPath + 'css']
            },
            img: {
                src: [destToPath + 'img']
            }
        },

        //将css背景图片资源复制到dest中
        copy: {
            img: {
                expand: true,
                cwd: basePath + 'img',
                src: '**',
                dest: destToPath + 'img'
            }
        },

        qunit: {
            files: ['test/**/*.html']
        },
        
        //css检查
        csslint: {
            options: {
                //csslintrc: 'style/.csslintrc'
                "qualified-headings": true,
                "unique-headings": false,
                "known-properties": false
            },
            test:{
                src: [ devCssPath + '**/*.css']
            }
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
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            test: {
                src: [ baseJsPath + "**/*.js", "!" + baseJsPath + "core/*"]
            }
        },
        
        watch: {
            options: {
                //spawn 设置为false 编译速度更快
                spawn: false,
            },
            
            //配置文件修改监听
            configFiles: {
                files: ["Gruntfile.js", "cross.config.js", "cross.list.js", "cross.import.js"],
                options: {
                    reload: true
                },
                tasks: ['dest-import']
            },
            
            //less文件修改监听
            less: {
                files: [ basePath + '**/*.less', basePath + '**/*.css'],
                tasks: ['less:dev']
            },
            
            //css语法检查
            css: {
                files: '<%= csslint.test.src %>',
                tasks: [ "csslint" ]
            },
            
            //js语法检查
            js: {
                files: "<%= jshint.test.src %>",
                tasks: [ "jshint"]
            }
        },

        //合并js
        concat:{
            import: {
                files: jsImportConcat
            },
            js: {
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
            import: {
                files: jsImportMinify  
            },
            //页面文件压缩
            dest: {
                files: jsMinify
            }
        },
        
        //less
        less:{
            //开发模式
            dev:{
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    
                    //压缩
                    compress: false,
                    
                    //替换变量
                    modifyVars: {
                        imgPath: '"../../../src/img/"'
                    }
                },
                files: lessDevCompile
            },
            
            //线上发布
            
            dest:{
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
                        
                    ],
                    
                    //替换变量
                    modifyVars: {
                        imgPath: '"../img/"'
                    }
                },
                files: lessCompile
            }
        },
        
        //梳理css
        csscomb: {
            dest: {
                options: {
                    //config: 'style/.csscomb.json'
                },
                files: cssCompile
            }
        },
        
        cssmin: {
            dest: {
                options: {
                    
                },
                
                files: cssCompile
            }
        },

        //image min
        imagemin: {
            dest: {
                options: {
                    optimizationLevel: 3 //定义图片优化水平
                },
                files: [{
                    expand: true, 
                    cwd: destToPath + 'img/',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化 cwd路径目录下所有 png/jpg/jpeg 图片
                    dest: destToPath + 'img/'
                }]
            }
        }

    });

    // 加载所有依赖插件
    require('load-grunt-tasks')(grunt, { scope: 'dependencies'});
    
    //替换html文件中的version版本号
    grunt.registerTask('replace-html', 'HTML version code replace.', function(){
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
    });
    
    //dest import
    grunt.registerTask('dest-import', ['concat:import', 'uglify:import']);
    //注册开发模式任务
    //生成css
    grunt.registerTask('dev-css', ['dest-import', 'less:dev']);
    //dev
    grunt.registerTask('dev', ['clean:dev', 'dev-css']);
    
    //注册线上模式任务
    //清除dest目录
    grunt.registerTask('dest-clean', ['clean:dest']);
    
    //生成css
    grunt.registerTask('dest-css', ['clean:css', 'dest-import', 'less:dest', 'csscomb', 'cssmin']);
    
    //生成js
    grunt.registerTask('dest-js', ['clean:js', 'concat', 'uglify']);
    
    //压缩图片
    grunt.registerTask('dest-img', ['clean:img', 'copy:img', 'imagemin']);
    
    //build 任务配置
    grunt.registerTask('build', ['less:dest', 'csscomb', 'cssmin', 'concat', 'uglify', 'copy:img', 'imagemin']);

    //online
    grunt.registerTask('dest', 'CROSS dest task', function(){
        
        grunt.log.writeln('Processing dest concat task...');
        
        //文件清理，执行build，清除缓存文件
        grunt.task.run(['replace-html', 'dest-clean', 'build']);
        
    });
    
    //default
    grunt.registerTask('default', function(){
        grunt.task.run(['dest']);
    });

};
