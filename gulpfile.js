var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev'),
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    revController = require('gulp-rev-collector');

// gulp对象,提供了若干方法



//处理图片
gulp.task('image', function () {
    return gulp.src(['./public/images/**/*', './uploads/*', './favicon.ico'], {base: './'})
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./release'))
        .pipe(rev.manifest())
        .pipe(rename('image-manifest.json'))
        .pipe(gulp.dest('./release/rev'));
});

//处理css
gulp.task('css', function () {
    return gulp.src('./public/less/main.css')
        .pipe(cssmin())
        .pipe(autoprefixer())
        .pipe(rev())
        .pipe(gulp.dest('./release/public/less'))
        .pipe(rev.manifest())
        .pipe(rename('css-manifest.json'))
        .pipe(gulp.dest('./release/rev'));
});


//处理js
gulp.task('useref', function () {
    return gulp.src('./index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.js', rev()))
        .pipe(gulp.dest('./release'))
        .pipe(rev.manifest())
        .pipe(rename('js-manifest.json'))
        .pipe(gulp.dest('./release/rev'));
});


//其他
gulp.task('other', function () {
    return gulp.src(['./api/*', './public/fonts/*', './public/libs/*', './views/*.html'], {base: './'})
        .pipe(gulp.dest('./release'));
});
//替换
gulp.task('rev1', ['css', 'image'], function () {
    gulp.src(['./release/rev/*.json', './release/public/less/*.css'], {base: './release'})
        .pipe(revController())
        .pipe(gulp.dest('./release'));
})

gulp.task('rev', ['useref', 'rev1'], function () {
     gulp.src(['./release/rev/*.json', './release/index.html', './release/views/*'], {base: './release'})
        .pipe(revController())
        .pipe(gulp.dest('./release'));
});


gulp.task('default', ['rev', 'other']);
