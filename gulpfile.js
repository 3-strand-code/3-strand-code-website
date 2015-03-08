(function() {
    'use strict';

    var gulp = require('gulp');
    var autoprefixer = require('gulp-autoprefixer');
    var less = require('gulp-less');
    var webserver = require('gulp-webserver');
    var plumber = require('gulp-plumber');

    var paths = {
        root: './',
        less: './less/',
    };


    gulp.task('less', function() {
        return gulp.src([
            paths.less + 'app.less'
        ])
            .pipe(plumber(function onError(err) {
                    console.log(err.message);
                    this.emit('end');
                }
            ))
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(gulp.dest('.'));
    });

    gulp.task('watch', function() {
        gulp.watch([paths.root + '**/*.less'], ['less']);
    });

    gulp.task('serve', function() {
        return gulp.src(paths.root)
            .pipe(webserver({
                https: false,
                host: 'localhost',
                port: '8000',
                fallback: 'index.html',
                livereload: {
                    enable: true,
                    filter: function(fileName) {
                        // exclude less files
                        if (
                            fileName.match(/package.json/) ||
                            fileName.match(/bower.json/) ||
                            fileName.match(/node_modules/) ||
                            fileName.match(/bower_components/) ||
                            fileName.match(/.less$/) ||
                            fileName.match(/^gulpfile.js$/)                        
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                directoryListing: false,
                open: false,
            }));

    });

    gulp.task('default', [
        'less',
        'serve',
        'watch',
    ]);

}());
