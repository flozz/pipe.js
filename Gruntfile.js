module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dist: {
                files: {
                    'dist/pipe.js': ['src/pipe.js'],
                },
                options: {
                    browserifyOptions: {
                        'standalone': 'Pipe'
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/pipe.min.js': ['dist/pipe.js']
                }
            }
        },

        yuidoc: {
            doc: {
                name: 'Pipe.js',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: 'https://github.com/flozz/pipe.js',
                options: {
                    linkNatives: true,
                    attributesEmit: true,
                    selleck: true,
                    paths: ['./src/'],
                    outdir: './doc/',
                    tabtospace: 4
                }
            }
        },

        jasmine: {
            pivotal: {
                src: 'dist/pipe.js',
                options: {
                    specs: 'test/*Spec.js'
                }
            }
        },

        jshint: {
            all: ['src/*.js'],
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                browserify: true
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify', 'yuidoc']);
    grunt.registerTask('test', ['jshint', 'jasmine']);

};
