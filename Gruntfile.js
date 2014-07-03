module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.task.loadTasks('tasks');
    
    var LIVERELOAD_PORT = 35729;
    var lrSnippet = require('connect-livereload')({
        port: LIVERELOAD_PORT
    });
    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };
    var modRewrite = require('connect-modrewrite');

    // Project configuration.
    grunt.initConfig({
        config: grunt.file.readJSON('config.json'),
        watch: {
            less: {
                files:  ['app/styles/{,*/}*.less'],
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/**/*.html',
                    '{.tmp,app}/styles/{,*/}*.css',
                    '{.tmp,app}/**/*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        //Connect
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '!\\.html|\\.xml|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg|\\.ico /index.html [L]'
                            ]),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    keepalive: false,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '!\\.html|\\.xml|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg|\\.ico /index.html [L]'
                            ]),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            dist: {
                options: {
                },
                files: {
                    'app/styles/index.css': ['app/styles/index.less']
                }
            }
        },
        peg: {
            options: { trackLineAndColumn: true },
            excelGrammar : {
                src: 'pegjs/excelGrammar.pegjs',
                dest: 'app/modules/excel-parser.js',
                angular: {
                    module: 'excel-parser',
                    factory: 'ExcelParser'
                }
            },
            formulaGrammar : {
                src: 'pegjs/formulaGrammar.pegjs',
                dest: 'app/modules/formula-parser.js',
                angular: {
                    module: 'formula-parser',
                    factory: 'FormulaParser'
                }
            }
        },
        'swagger-js-codegen': {
            options: {
                apis: [
                    {
                        swagger: 'swagger/reports.json',
                        moduleName: 'report-api',
                        className: 'ReportAPI',
                        fileName: 'report-api.js',
                        angularjs: true
                    },
                    {
                        swagger: 'swagger/session.json',
                        moduleName: 'session-api',
                        className: 'SessionAPI',
                        fileName: 'session-api.js',
                        angularjs: true
                    }
                ],
                dest: 'app/modules'
            },
            all: {}
        },
        clean: {
            pre: ['dist/', 'coverage/', 'out/'],
            post: []
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: ['Gruntfile.js',
                  'app/modules/**/*.js',
                  'app/report/**/*.js',
                  'app/reports/**/*.js',
                  'app/app.js',
                  'tasks/**/*.js',
                  'tests/**/*.js'
            ]
        },
        karma: {
            options: {
                configFile: './karma.conf.js'
            },
            dev: {
                browsers: ['Chrome'],
                autoWatch: true,
                singleRun: false
            },
            '1.2.9': {
                options: {
                    files: [
                        'app/bower_components/angular/angular.js',
                        'app/bower_components/angular-mocks-1.2.9/angular-mocks.js',
                        'app/modules/excel-parser.js',
                        'app/modules/formula-parser.js',
                        'app/modules/report-api.js',
                        'app/modules/report-model.js',
                        'app/modules/rules-model.js',
                        'tests/unit/karma.start.js',
                        'tests/unit/*.js'
                    ]
                }
            }
        },
        coveralls: {
            options: {
                'coverage_dir': 'coverage'
            }
        },
        protractor: {
            travis: 'tests/e2e/config/protractor-travis-conf.js',
            local: 'tests/e2e/config/protractor-conf.js'
        },
        ngconstant: {
            options: {
                space: '    '
            },
            server: {
                dest: 'app/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'APPNAME': 'report-editor',
                    'API_URL': '//<%= config.server.api %>/v1',
                    'REGISTRATION_URL': '<%= config.server.registration %>',
                    'DEBUG': true
                }
            },
            test: {
                dest: 'app/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'APPNAME': 'report-editor',
                    'API_URL': '//<%= config.test.api %>/v1',
                    'REGISTRATION_URL': '<%= config.test.registration %>',
                    'DEBUG': true
                }
            },
            beta: {
                dest: 'app/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'APPNAME': 'report-editor',
                    'API_URL': '//<%= config.beta.api %>/v1',
                    'REGISTRATION_URL': '<%= config.beta.registration %>',
                    'DEBUG': false
                }
            },
            prod: {
                dest: 'app/constants.js',
                name: 'constants',
                wrap: '/*jshint quotmark:double */\n"use strict";\n\n<%= __ngModule %>',
                constants: {
                    'APPNAME': 'report-editor',
                    'API_URL': '//<%= config.prod.api %>/v1',
                    'REGISTRATION_URL': '<%= config.prod.registration %>',
                    'DEBUG': false
                }
            }
        },
        jsonlint: {
            all: {
                src: [
                    'package.json',
                    'config.json',
                    'bower.json',
                    'swagger/*'
                ]
            }
        }
    });

    grunt.registerTask('e2e', function(){
        var target = process.env.TRAVIS_JOB_NUMBER ? 'travis' : 'local';
        grunt.task.run([
            'webdriver',
            'connect:test',
            'protractor:' + target
        ]); 
    });

    grunt.registerTask('server', function (target) {
        if(target === 'dist'){
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'peg',
            'ngconstant:server',
            'swagger-js-codegen',
            'less',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('unit-tests', ['clean:pre', 'less', 'karma:1.2.9', 'clean:post']);
    grunt.registerTask('test', ['clean:pre', 'less', 'karma:1.2.9', 'clean:post', 'e2e']);
    grunt.registerTask('build', ['clean:pre', 'peg', 'swagger-js-codegen']);
    grunt.registerTask('default', ['jsonlint', 'jshint', 'build', 'test']);
};
