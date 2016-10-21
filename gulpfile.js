'use strict';
var gulp = require('gulp');
require("gulp-include");

var sass = require('gulp-sass');
gulp.task('sass', function () {
  gulp.src('./public/styles/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles/sass/css'));
});

gulp.task('sass:watch', function () {
  console.log("-- gulp is running task 'sass:watch'");
  gulp.watch('./public/styles/sass/**/*.scss', ['sass']);
});

gulp.task("scripts", function() {
  // console.log("-- gulp is running task 'scripts'");
 
  // gulp.src("./public/index.html")
  // .pipe(include({
  //   extensions: "js",
  //   hardFail: true,
  //   includePaths: [
  //     __dirname + "./public/bower_components",
  //     __dirname + "./public/scripts/"
  //   ]
  // }))
  // .pipe(gulp.dest("dist/js"));

});

gulp.task("develop", ["scripts", "sass:watch"]);