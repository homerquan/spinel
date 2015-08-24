var paths = {
    dest: 'production/',
    cssSrc: 'styles/',
    cssDest: 'public/css/',
    jsDest: 'production/js/',
    rjsConfig: 'public/js/app/config/config.js'
};

module.exports = function(grunt) {
    /*  Load tasks  */

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            target: {
                rjsConfig: paths.rjsConfig,
                options: {
                    transitive: true,
                    baseUrl: 'public/js/app/'
                }
            }
        },
        requirejs: {
            mobileJS: {
                options: {
                    baseUrl: "public/js/app",
                    paths: {
                        "mobile": "init/MobileInit"
                    },
                    wrap: true,
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    optimizeCss: "standard",
                    mainConfigFile: paths.rjsConfig,
                    include: ["mobile"],
                    out: "public/js/app/init/MobileInit.min.js"
                }
            },
            mobileCSS: {
                options: {
                    optimizeCss: "standard",
                    cssIn: "./public/css/mobile.css",
                    out: "./public/css/mobile.min.css"
                }
            },
            desktopJS: {
                options: {
                    baseUrl: "public/js/app",
                    paths: {
                        "desktop": "init/DesktopInit"
                    },
                    wrap: true,
                    preserveLicenseComments: false,
                    optimize: "uglify",
                    mainConfigFile: paths.rjsConfig,
                    include: ["desktop"],
                    out: "public/js/app/init/DesktopInit.min.js"
                }
            },
            desktopCSS: {
                options: {
                    optimizeCss: "standard",
                    cssIn: "./public/css/desktop.css",
                    out: "./public/css/desktop.min.css"
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/js/app/**/*.js', '!public/js/app/**/*min.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: false,
                    module: true,
                    document: true
                }
            }
        },
        plato: {
            your_task: {
                options: {
                    exclude: /\.min\.js$/ // excludes source files finishing with ".min.js"
                },
                files: {
                    'reports': ['public/js/app/**/*.js']
                }
            }
        },
        shell: {
            bowerUpdate: {
                command: 'bower update --save --force'
            },
            npmUpdate: {
                command: 'npm update --save'
            },
            publish: {
                command: 'npm publish'
            },
            version: {
                command: 'npm version patch'
            },
            commit: {
                command: 'git commit -a -m "release a new version"; git push'
            }
        },
        solidateBower: {
            options: {
                config: paths.rjsConfig,
                from: '../../../bower_components',
                to: '../libs/plugins'
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'public/font/',
                    src: ['*'],
                    dest: 'production/font/'
                }, {
                    expand: true,
                    cwd: 'public/img/',
                    src: ['*'],
                    dest: 'production/img/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'public/tpl/',
                    src: ['*'],
                    dest: 'production/tpl/',
                }, {
                    expand: true,
                    cwd: 'public/css/',
                    src: ['*'],
                    dest: 'production/css/',
                }, {
                    src: 'public/index.html',
                    dest: 'production/index.html'
                }]
            },
        },
        less: require('./tasks/less')(paths.cssSrc, paths.cssDest),
        cssmin: require('./tasks/cssMin')(paths.cssDest),
        uglify: require('./tasks/uglify')(paths.jsDest)
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-plato');
    grunt.registerTask('refresh-deps', ['shell:npmUpdate', 'shell:bowerUpdate', 'bower', 'solidateBower']);
    grunt.registerTask('complexity:report', 'plato');
    grunt.registerTask('compileLess', ['less:build']);
    grunt.registerTask('preTest', ['jshint']);
    grunt.registerTask('unitTest', ['jshint']);
    grunt.registerTask('funcTest', ['jshint']);
    grunt.registerTask('test', ['preTest', 'unitTest', 'funcTest']);
    grunt.registerTask('build', ['uglify', 'copy']);
    grunt.registerTask('default', ['test', 'build']);
    grunt.registerTask('release', ['shell:version', 'shell:publish', 'shell:commit']);
};