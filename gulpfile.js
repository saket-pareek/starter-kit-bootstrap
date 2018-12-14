const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');

// Not able to minify js file with knockout syntax in it
// const uglify = require('gulp-uglify');


// Copy Html files to dist/ and inject into browser
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

// Move js dependencies files to dist/js and inject into browser
gulp.task('copyJS', function(){
  gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/umd/popper.min.js','node_modules/knockout/build/output/knockout-latest.js'])
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});

// Move font-awesome css file to dist/css
gulp.task('copyFa', function(){
  gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
      .pipe(gulp.dest('dist/css'));
});

// Move font-awesome folder contents to dist/fonts
gulp.task('copyFonts', function(){
  gulp.src('node_modules/font-awesome/fonts/*')
      .pipe(gulp.dest('dist/fonts'));
});

// Concatinating js files, move to dist/js and inject into browser
gulp.task('concatJS', function(){
  gulp.src('src/js/*.js')
      .pipe(plumber())
      .pipe(concat('main.js'))
      // .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});

// Optimize Images, move to dist/images
gulp.task('imageMin', () =>
    gulp.src('src/images/*')
        .pipe(imageMin())
        .pipe(gulp.dest('dist/images'))
);

// Compile Sass, move to dist/css and inject into browser
gulp.task('sass', function(){
    gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/*.scss'])
      .pipe(plumber())
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

// Serve dist/ directory on local server and Watch files to perform functions on change
gulp.task('serve', function(){
  browserSync.init({
    server: './dist'
  });
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
  gulp.watch('src/js/*.js', ['concatJS']);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/*.html', ['copyHtml']);
});


// Create default task to run all tasks at once
gulp.task('default', ['copyHtml', 'copyJS', 'copyFa', 'copyFonts', 'concatJS', 'imageMin', 'sass', 'serve']);
