const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('default', ['sass', 'sass:watch']);
//--------- Sass: --------------------------
gulp.task('sass', function () 
{
 	 gulp.src('./sass/**/main.scss')
    	.pipe(sass().on('error', sass.logError))
    	.pipe(gulp.dest('./static/css/'));
});

gulp.task('sass:watch', function () 
{
  	gulp.watch('./sass/**/*.scss', ['sass']);
});