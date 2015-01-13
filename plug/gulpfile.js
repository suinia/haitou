var gulp         = require('gulp');
var rev = require('gulp-rev');

var jsmin = require('gulp-jsmin');
var csso = require('gulp-csso');

gulp.task('css', function () {
    return gulp.src('css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('../pulg-pro/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/css' ) );
});

gulp.task('scripts', function () {
    return gulp.src('js/**/*.js')
    	.pipe(jsmin())
        .pipe(rev())
        .pipe(gulp.dest('../pulg-pro/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/js' ) );
});

var revCollector = require('gulp-rev-collector');

gulp.task('rev',['css', 'scripts'], function () {
    return gulp.src(['rev/**/*.json', '*.html','*.json'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
            }
        }) )
        .pipe( gulp.dest('../pulg-pro') );
});

gulp.task('default', ['rev','css', 'scripts']);
