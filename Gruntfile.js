/*jslint node: true */
"use strict";


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 3000,
                    base: './public'
                }
            }
        },
        watch: {
            taskName: {
                options: { // Live reload is now specific to this task
                    livereload: true
                },
                files: [ // Files to livereload on
                    "app/*.js",
                    "views/*.html"
                ],
                tasks: ['html2js', 'concat'],
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    "./public/stylesheets/style.css": "./less/app.less" // destination file and source file
                }
            }
        },
        html2js: {
            options: {
                rename: function(name) {
                    return name.replace('../', '');
                }
            },
            dist: {
                src: ['views/*.html'],
                dest: 'tmp/templates.js',
            },
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['bower_components/bootstrap/fonts/**'],
                    dest: 'public/fonts',
                    filter: 'isFile',
                }],
            },
        },
        concat: {
            dist: {
                src: [
                    'bower_components/underscore/underscore.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/chosen/chosen.jquery.min.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-cookies/angular-cookies.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'app/*.js',
                    'tmp/*.js'
                ],
                dest: 'public/javascripts/main.js'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');


    grunt.registerTask('default', ['less:development', 'html2js', 'concat', 'copy', 'connect:server', 'watch']);

};
