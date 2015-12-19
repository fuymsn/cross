/*global module:false*/
module.exports = function(grunt) {
    
    //package config
    var pkg = grunt.file.readJSON('package.json');
    
    //public version
    var publishVersion = pkg.publishVersion;
    
    //subject public version
    var subPublishVersion = pkg.subPublishVersion;
    
    /**
     *  合并文件的映射关系
     */
    var ued_conf = require("./page_list.js"),

        //base path
        baseJsPath = "js/",

        //serivce path => /web/service/user.js @example /回到public的父级
        serviceJsPath = "../",
        baseCssPath = "css/",
        distPath = 'dist/'+ publishVersion + '/',
        importDistPath = distPath + 'ued.import.js',
        importMinDistPath = distPath + 'ued.import-min.js';

    //判断是否从service文件夹导入
    var isServiceFile = function(str){
        return /^service\//.test(str);
    }
    
    //less 编译数组列表
    var lessCompile = {};
    var cssCompile = {};
    
    for (var i in ued_conf){
        
        if(i.indexOf(".js") > -1){ continue; }
        
        var arrCssItem = [];
        var cssDistPath = distPath + "css/" + i.replace(".css", "-min.css");
        
        for(var j=0; j< ued_conf[i].length; j++){
            arrCssItem[j] = baseCssPath + ued_conf[i][j];
        }
        
        lessCompile[cssDistPath] = arrCssItem;
        cssCompile[cssDistPath] = cssDistPath;
    }
    
    //console.log(lessCompile);
    //console.log(cssCompile);
    
    var jsConcat = {};
    var jsMinify = {};
    
    var jsImportConcat = {};
    jsImportConcat[importDistPath] = ['ued.concat.js', 'ued.conf.js', 'import.js'];
    
    var jsImportMinify = {};
    jsImportMinify[importMinDistPath] = importDistPath;
    
    for(var i in ued_conf){
        //如果是css，返回
        if(i.indexOf(".css") > -1){ continue; }
        
        //js处理
        var arrJsItem = [];
        var jsDistPath = distPath + "js/" + i.replace(".js", "-min.js");
        
        for(var j = 0; j < ued_conf[i].length; j++){
            
            if(isServiceFile(ued_conf[i][j])){
                arrJsItem[j] = serviceJsPath + ued_conf[i][j];
            }else{
                arrJsItem[j] = baseJsPath + ued_conf[i][j];
            }
            
        }
        
        jsConcat[jsDistPath] = arrJsItem;
        jsMinify[jsDistPath] = jsDistPath;
    }
    
    
    //console.log(jsConcat);
    //console.log(jsMinify);

    //生成ued.concat.js
    grunt.file.write('ued.concat.js', 'window.UED_PUBLISH_VERSION = "'+ publishVersion + '";\nwindow.UED_SUB_PUBLISH_VERSION = "'+ subPublishVersion +'";\nwindow.UED_LIST ='+ JSON.stringify(ued_conf) +';');

    //replace HTML files task
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
            cleantmp: {
                src: ['ued.concat.js']
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
            img: {
                expand: true,
                cwd: 'css/i',
                src: '**',
                dest: 'dist/' + publishVersion + '/i'
            }
        },

        //将css, js合并
        concat:{
            import: {
                files: jsImportConcat
            }
        },

        qunit: {
            files: ['test/**/*.html']
        },

        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
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

        //压缩js
        uglify: {
            options:{
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                compress: {
                    //移除console
                    drop_console: true
                }
            },
            
            //import文件压缩
            import: {
                files: jsImportMinify
            },
            
            //页面文件压缩
            dist: {
                files: jsConcat
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
    require('load-grunt-tasks')(grunt, { scope: ['dependencies', 'devDependencies'] });

    // 默认任务
    
    grunt.registerTask('dist-copy', ['clean:dist', 'copy']);
    grunt.registerTask('dist-cleantmp', ['clean:cleantmp']);
    grunt.registerTask('css-lint', ['csslint']);
    
    //清除dist目录
    grunt.registerTask('dist-clean', ['clean:dist']);
    
    
    //生成css
    //grunt.registerTask('dist-css', ['clean:dist', 'concat:default','copy:cssimg', 'copy:less', 'less', 'csscomb', 'autoprefixer', 'cssmin', "clean:cleantmp"]);
    grunt.registerTask('dist-css', ['clean:css', 'less', 'csscomb', 'cssmin']);
    
    //生成js
    //grunt.registerTask('dist-js', ['concat:default', 'uglify']);
    grunt.registerTask('dist-js', ['clean:js', 'concat:import', 'uglify']);
    
    //压缩图片
    grunt.registerTask('dist-img', ['clean:img', 'copy:img', 'imagemin']);
    
    //test
    grunt.registerTask('test', ['clean:cleantmp']);

    //dev
    //grunt.registerTask('dev', ['clean:dist', 'concat:default', 'copy:cssimg', 'copy:less', 'less', 'csscomb', 'cssmin', 'uglify', 'clean:cleantmp']);
    
    //online
    grunt.registerTask('default', ['clean:dist', 'dist-css', 'dist-js', 'dist-img']);


};
