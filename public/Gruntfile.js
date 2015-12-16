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
        ued_lessComplieObj = {},   //{ dist/.tmp/xxx.css : css/xxx.less }
        ued_cssMinLinkArr = [],
        ued_cssCombObj = {},

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

        } else if (j.indexOf(".css") > -1) {
            for (var m=0; m<ASource.length; m++) {
                ASource[m] = baseCssPath + ASource[m];
            }
            for (var q=0; q<BSource.length; q++) {
                BSource[q] = baseCssPath + BSource[q];
            }

            ued_cssCombObj[distPath + ".tmp/" + j] = [distPath + ".tmp/" + j];
            ued_cssMinLinkArr.push(distPath + "css/" + j);
        }

        ued_conf[j] = BSource;
        
        ued_concat[distPath + ".tmp/" + j.replace(".css", ".less")] = ASource;

        //console.log(ASource);
    }

    //console.log(ued_conf);
    //console.log(ued_cssCombObj);
    //console.log(ued_cssMinLinkArr);
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
    var ued_mincss = {};

    var _minCount = 0;
    var _minCssCount = 0;

    //console.log(ued_concat);
    //console.log("ued_jsMinLinkArr " + ued_jsMinLinkArr.length);
    //console.log("ued_cssMinLinkArr " + ued_cssMinLinkArr);

    for (var i in ued_concat) {

        //console.log("i out" + i);
        //console.log("ued_jsMinLinkArr: " + ued_jsMinLinkArr);
        //console.log("ued_cssMinLinkArr: " + ued_cssMinLinkArr);

        if ('ued.import.js' === i) {
            continue;
        }

        if (i.indexOf(".js") > -1) {
            if (ued_jsMinLinkArr[_minCount] == undefined) {continue; };
            ued_minjs[ued_jsMinLinkArr[_minCount].replace(".js", "-min.js")] = [i];
            _minCount++;
        } else if (i.indexOf(".less") > -1) {
            ued_mincss[ued_cssMinLinkArr[_minCssCount].replace(".css", "-min.css")] = [i.replace(".less", ".css")];

            ued_lessComplieObj[i.replace(".less", ".css")] = i;

            _minCssCount++;
        }
    }

    //console.log(ued_lessComplieObj);
    //console.log(ued_minjs);
    //console.log(ued_mincss)  //dist/min <-- css/.tmp

    // 项目配置
    grunt.initConfig({
        //清除dist目录所有文件
        clean: {
            dist: {
                src: ['dist/']
            },
            cleantmp: {
                src: ['dist/'+ publishVersion +'/.tmp', 'dist/'+ publishVersion +'/module', 'ued.concat.js']
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
            },
            less: {
                files: [{
                    expand: true,
                    cwd: 'css/module',
                    src: '**',
                    dest: 'dist/' + publishVersion + '/.tmp'
                }, {
                    expand: true,
                    cwd: 'css/module',
                    src: '**',
                    dest: 'dist/' + publishVersion + '/.tmp/module'
                }, {
                    expand: true,
                    cwd: 'css/module',
                    src: '**',
                    dest: 'dist/' + publishVersion + '/module'
                }]
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
            complile:{
                options: {
                    strictMath: true,
                    ieCompat: true
                },
                files: ued_lessComplieObj
            }
        },
        //梳理css
        csscomb: {
            dist: {
                options: {
                    config: 'css/.csscomb.json'
                },
                files: ued_cssCombObj
            }
        },
        // css3浏览器修复
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/' + publishVersion + '/.tmp',
                    src: '*Css.css',
                    dest: 'dist/' + publishVersion + '/.tmp'
                }]
            }
        },
        //压缩css
        cssmin: {
            compress: {
                files: ued_mincss
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
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // 默认任务
    grunt.registerTask('dist-clean', ['clean:dist']);
    grunt.registerTask('dist-copy', ['clean:dist', 'copy']);
    grunt.registerTask('copy-img', ['clean:dist', 'copy:cssimg']);
    grunt.registerTask('copy-less', ['clean:dist', 'copy:less']);
    grunt.registerTask('dist-cleantmp', ['clean:cleantmp']);
    grunt.registerTask('css-check', ['csslint']);
    grunt.registerTask('imgmin', ['imagemin']);

    grunt.registerTask('dist-css', ['clean:dist', 'concat:default','copy:cssimg', 'copy:less', 'less', 'csscomb', 'autoprefixer', 'cssmin', "clean:cleantmp"]);
    
    //grunt.registerTask('dist-js', ['concat:default', 'uglify']);
    grunt.registerTask('dist-js', ['clean:cleanjs', 'concat:default']);
    
    //test
    grunt.registerTask('test', ['clean:cleantmp']);

    //dev
    grunt.registerTask('dev', ['clean:dist', 'concat:default', 'copy:cssimg', 'copy:less', 'less', 'csscomb', 'autoprefixer', 'cssmin', 'uglify', 'clean:cleantmp']);
    
    //online
    grunt.registerTask('default', ['clean:dist', 'concat:default', 'copy:cssimg', 'copy:less', 'less', 'csscomb', 'autoprefixer', 'cssmin', 'uglify', 'clean:cleantmp', 'imagemin:dist']);


};
