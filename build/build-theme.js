const gulp = require('gulp')
const sass = require('gulp-dart-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')

gulp.task('compile', function() {
  return gulp.src('./src/assets/styles/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/styles'))
})

gulp.task('build', gulp.series('compile'))
