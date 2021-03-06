module.exports = function (grunt) {

    /** 
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-msbuild');
    grunt.loadNpmTasks('grunt-iisexpress');

    /**
      * Load in our build configuration file.
      */
    var userConfig = require('./build.config.js');

    /**
     * This is the configuration object Grunt uses to give each plugin its 
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled 
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner:
                '/**\n' +
                    ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' * <%= pkg.homepage %>\n' +
                    ' *\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                    ' */\n'
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         * This task is called on BeforeBuid. see .csproj for details
         */
        clean: [
            '<%= build_dir %>',
            '<%= compile_dir %>'
        ],

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build: {
                files: [
                    { src: ['**'], dest: '<%= build_dir %>/assets/', cwd: '<%= fontend_root %>/assets', expand: true },
                    { src: ['<%= vendor_files.assets %>'], dest: '<%= build_dir %>/assets/', cwd: '.', expand: true, flatten: true },
                    {
                        src: [
                              '<%= app_files.js %>',
                              '<%= app_files.ts %>',
                              '<%= app_files.maps %>',
                              '<%= vendor_files.js %>',
                              '<%= app_files.webcfg %>'
                        ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true,
                    }
                ]
            },
            compile: {
                files: [
                    { src: ['**'], dest: '<%= compile_dir %>/assets', cwd: '<%= build_dir %>/assets', expand: true },
                    { src: ['<%= app_files.webcfg %>'], dest: '<%= compile_dir %>/', cwd: '.', expand: true }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `build_css` target concatenates compiled CSS and vendor CSS
             * together.
             */
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },

            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    '<%= app_files.build_modules %>',
                    '<%= build_dir %>/<%= fontend_root %>/**/*.js',
                    '<%= html2js.app.dest %>'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        /**
         * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
         * Only our `main.less` file is included in compilation; all other files
         * must be imported from this file.
         */
        less: {
            build: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                }
            },
            compile: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                },
                options: {
                    cleancss: true,
                    compress: true
                }
            }
        },

        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `<%= fontend_root %>/app`.
             */
            app: {
                options: {
                    base: '<%= fontend_root %>/app'
                },
                src: ['<%= app_files.atpl %>'],
                dest: '<%= build_dir %>/templates-app.js'
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js'
            },
            unit: {
                port: 9019,
                background: true
            },
            continuous: {
                singleRun: true
            }
        },

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= test_files.js %>',
                    '<%= app_files.modules %>'
                ]
            }
        },

        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {

            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the `<head>` of `index.html`. The
             * `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= app_files.build_modules %>',
                    '<%= build_dir %>/<%= fontend_root %>/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            },

            /**
             * When it is time to have a completely compiled application, we can
             * alter the above to include only a single JavaScript and a single CSS
             * file. Now we're back!
             */
            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            }
        },

        msbuild: {
            options: {
                targets: ['Clean', 'Rebuild'],
                version: 12.0,
                maxCpuCount: 4,
                buildParameters: {
                    WarningLevel: 2
                },
                verbosity: 'minimal'
            },
            debug: {
                src: ['<%= app_files.csproj %>'],
                options: {
                    projectConfiguration: 'Debug'
                }
            },
            release: {
                src: ['<%= app_files.csproj %>'],
                options: {
                    projectConfiguration: 'Release'
                }
            }
        },

        sync: {
            main: {
                files: [
                    {
                        src: [
                          '<%= app_files.js %>',
                          '<%= app_files.ts %>',
                          '<%= app_files.maps %>'
                        ],
                        dest: '<%= build_dir %>/'
                    }
                ],
                verbose: true // Display log messages when copying files 
            }
        },

        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed 
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files. 
         */
        watch: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },

            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: ['<%= app_files.html %>'],
                tasks: ['index:build']
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.atpl %>'
                ],
                tasks: ['html2js']
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: ['<%= fontend_root %>/**/*.less'],
                tasks: ['less:build']
            },

            /**
             * only watch the js files, then copy only changed files(*.js, *.ts, *.map) to the build_dir
             */
            js: {
                files: ['<%= app_files.js %>'],
                tasks: ['sync']
            },

            /**
             * When a JavaScript unit test file changes, we only want to
             * run the unit tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: ['karma:unit:run'],
                options: {
                    livereload: false
                }
            },
        },

        iisexpress: {
            options: {
                open: true,
                path: '<%= build_dir %>/'
            },
            server: {
                options: {
                    port: 3000
                }
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    /**
     * The debug task. 
     * We only run msbuild because it examines the '<%= csproj %>' file and starts another instance of grunt to run further tasks (vs_build on AfterBuild).
     * See *.csproj for details
     */
    grunt.registerTask('default', ['msbuild:debug', 'serve']);

    /**
     * starts a connect web server and starts watching for changes
     */
    grunt.registerTask('serve', ['iisexpress', 'watch']);

    /**
    * The task which is runt on visual studio build
    */
    grunt.registerTask('vs_build', ['build', 'compile']);

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask('build', [
        'html2js',
        'less:build',
        'concat:build_css',
        'copy:build',
        'index:build',
        'karmaconfig',
        'karma:continuous'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask('compile', [
        'less:compile',
        'copy:compile',
        'concat:compile_js',
        'uglify',
        'index:compile'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    /** 
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });
        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        var template = grunt.template.process('<%= fontend_root %>/index.html');
        grunt.file.copy(template, this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version')
                    }
                });
            }
        });
    });

    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS(this.filesSrc);

        grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });
}