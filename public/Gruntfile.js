/*global module:false*/
module.exports = function(grunt) {

    //code version & publish version
    var version = "v1.0.4";
    var publishVersion = "v2015112401";
    var subPublishVersion = "1.0";

    /**
     *  合并文件的映射关系
     */
    var ued_conf = require("./page_list.js"),
        ued_concat = {},

        ued_jsMinLinkArr = [],

        //base path
        baseJsPath = "js/",

        //serivce path => /web/service/user.js @example /回到public的父级
        serviceJsPath = "../",
        baseCssPath = "css/",
        distPath = 'dist/'+ publishVersion + '/';

    //判断是否从service文件夹导入
    var isServiceFile = function(str){
        return /^service\//.test(str);
    }

    ued_concat[distPath + 'ued.import.js'] = ['ued.concat.js', 'ued.conf.js','import.js'];
    ued_jsMinLinkArr.push(distPath + 'ued.import.js');
    
    //console.log(ued_conf);
    
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
    console.log(cssCompile);
    
    for (var j in ued_conf) {

        //ued_conf key = ASource
        var ASource = ued_conf[j];

        //ued_conf value = BSource
        var BSource = [];

        BSource = BSource.concat(ASource);

        if (j.indexOf(".js") > -1) {

            //拼接生成 ASource
            for (var n=0; n<ASource.length; n++) {

                //判断是否以service路径开头
                if (isServiceFile(ASource[n])) {
                    ASource[n] = serviceJsPath + ASource[n];
                }else{
                    ASource[n] = baseJsPath + ASource[n];
                }                

            }
            //console.log("ASource: " + ASource);
            
            //拼接生成 BSource
            for (var p = 0; p < BSource.length; p++) {

                //判断是否以service路径开头
                if (isServiceFile(BSource[p])) {
                    BSource[p] = "" + BSource[p];
                }else{
                    BSource[p] = baseJsPath + BSource[p];
                }
                
            }

            ued_jsMinLinkArr.push(distPath + "js/" + j);

        }

        ued_conf[j] = BSource;
        
        ued_concat[distPath + ".tmp/" + j.replace(".css", ".less")] = ASource;

        //console.log(ASource);
    }

    //console.log(ued_conf);
    //console.log(ued_concat);
    //生成ued.concat.js
    grunt.file.write('ued.concat.js', 'window.UED_publishTime = '+ new Date().getTime() +';\nwindow.UED_PUBLISH_VERSION = "'+ publishVersion + '";\nwindow.UED_SUB_PUBLISH_VERSION = "'+ subPublishVersion +'";\nwindow.UED_LIST ='+ JSON.stringify(ued_conf) +';');

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


    /**
     *  压缩文件的映射关系
     */
    var ued_minjs = {};

    var _minCount = 0;

    //console.log(ued_concat);
    //console.log("ued_jsMinLinkArr " + ued_jsMinLinkArr.length);

    for (var i in ued_concat) {

        //console.log("i out" + i);
        //console.log("ued_jsMinLinkArr: " + ued_jsMinLinkArr);

        if ('ued.import.js' === i) {
            continue;
        }

        if (i.indexOf(".js") > -1) {
            if (ued_jsMinLinkArr[_minCount] == undefined) {continue; };
            ued_minjs[ued_jsMinLinkArr[_minCount].replace(".js", "-min.js")] = [i];
            _minCount++;
        }
    }

    //console.log(ued_minjs);

    // 项目配置
    grunt.initConfig({
        //清除dist目录所有文件
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: ['dist/']
            },
            cleantmp: {
                src: ['dist/'+ publishVersion +'/.tmp', 'ued.concat.js']
            },
            cleanjs: {
                src: ['dist/'+ publishVersion +'/.tmp']
            }
        },

        //将css背景图片资源复制到dist中
        copy: {
            cssimg: {
                expand: true,
                cwd: 'css/i',
                src: '**',
                dest: 'dist/' + publishVersion + '/i'
            }
        },

        //将css, js合并
        concat:{
            default: {
                files: ued_concat
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
                compress: {
                    drop_console: true
                },
                ASCIIOnly: false
            },
            my_target: {
                files: ued_minjs
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
                    optimizationLevel: 3 //定义 PNG 图片优化水平
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
    grunt.registerTask('dist-clean', ['clean:dist']);
    grunt.registerTask('dist-copy', ['clean:dist', 'copy']);
    grunt.registerTask('dist-cleantmp', ['clean:cleantmp']);
    grunt.registerTask('css-check', ['csslint']);
    grunt.registerTask('imgmin', ['imagemin']);
    
    //生成css
    //grunt.registerTask('dist-css', ['clean:dist', 'concat:default','copy:cssimg', 'copy:less', 'less', 'csscomb', 'autoprefixer', 'cssmin', "clean:cleantmp"]);
    grunt.registerTask('dist-css', ['clean:dist', 'copy:cssimg', 'less', 'csscomb', 'cssmin']);
    
    //生成image
    //grunt.registerTask('dist-js', ['concat:default', 'uglify']);
    grunt.registerTask('dist-js', ['clean:cleanjs', 'concat:default']);
    
    //test
    grunt.registerTask('test', ['clean:cleantmp']);

    //dev
    grunt.registerTask('dev', ['clean:dist', 'concat:default', 'copy:cssimg', 'copy:less', 'less', 'csscomb', 'cssmin', 'uglify', 'clean:cleantmp']);
    
    //online
    grunt.registerTask('default', ['clean:dist', 'concat:default', 'copy:cssimg', 'copy:less', 'less', 'csscomb', 'cssmin', 'uglify', 'clean:cleantmp', 'imagemin']);


};
