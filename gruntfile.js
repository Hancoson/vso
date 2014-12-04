
module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            //files: ['src/pages/<%= grunt.config.get("page") %>/*.js'],
            page: {
                options: {
                    force:true,
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true
                    }
                },
                src: ['src/pages/<%= grunt.config.get("page") %>/*.js']
            }
        },
        copy: {
            common: {
                src: ['common/**/*'],
                dest: 'build/',
                filter: 'isFile'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            page: {
                 src: ['src/pages/<%= grunt.config.get("page") %>/*.js'],
                 dest: 'build/pages/<%= grunt.config.get("page") %>/index.js'
            }
        },
        css_combo: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            page: {
                src: 'src/pages/<%= grunt.config.get("page") %>/index.css',
                dest: 'build/pages/<%= grunt.config.get("page") %>/index.css'
            }
        },
        requirejs: {
            page: {
                options: {
                    force:true,
                    baseUrl: 'src/pages/<%= grunt.config.get("page") %>',
                    mainConfigFile: 'common/config.js',
                    src:['**/*.js','!jquery.min.js'],
                    //name: '<%= grunt.config.get("page") %>',
                    name:'index',
                    out: 'build/pages/<%= grunt.config.get("page") %>/index.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            page: {
                src:'build/pages/<%= grunt.config.get("page") %>/index.js',
                dest: 'build/pages/<%= grunt.config.get("page") %>/index.min.js'
            },
            common: {
                expand:true,
                cwd:'common/',
                src:['**/*.js','!**/*.min.js'],
                dest:'build/common',
                ext:'.min.js'
            }
        },
        cssmin: {
            common: {
                expand:true,
                cwd:'common/',
                src:'**/*.css',
                dest:'build/common/',
                ext:'.min.css'
            },
            page: {
                expand:true,
                cwd:'build/pages/<%= grunt.config.get("page") %>/',
                src:'index.css',
                dest:'build/pages/<%= grunt.config.get("page") %>/',
                ext:'.min.css'
            }
        },
        imagemin:{
            common:{
                files:[{
                    expand:true,
                    cwd:'images/',
                    src:['**/*.{png,jpg,gif}'],
                    dest: 'build/images/'
                }]
            }
        }
    });

    /**
     * 载入使用到的通过NPM安装的模块
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * 注册基本任务
     */
    
    //grunt.registerTask('build',['jshint','copy:common','concat:page','css_combo:page','uglify:page','cssmin:page']);
    grunt.registerTask('build',function(pageName){
        if(pageName == 'common'){
            grunt.task.run(['copy:common','cssmin:common','uglify:common']);
        }else if(pageName == 'image'){
            grunt.task.run(['imagemin:common']);
        }else{
            grunt.config.set('page',pageName);
            //grunt.task.run(['jshint','copy:common','requirejs:page','css_combo:page','uglify:page','cssmin:page']);
            grunt.task.run(['jshint:page','concat:page','css_combo:page','uglify:page','cssmin:page']);
        } 
    });
}
