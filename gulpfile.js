(function () {
    'use strict';

    var gulp = require('gulp');
    var autoprefixer = require('gulp-autoprefixer');
    var less = require('gulp-less');

    gulp.task('less', function () {
        return gulp.src([
            './start-to-finish.less'
        ])
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(gulp.dest('.'));
    });

    gulp.task('watch', function(cb) {
        gulp.watch([
            './start-to-finish.less'
        ], ['less']);
    });

}());
