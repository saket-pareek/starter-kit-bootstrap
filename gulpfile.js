const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify'); // Not using it because it does not minify js file with knockout syntax in it
const concat = require('gulp-concat'); // Not using it, that's why discolored text

// Copy Html files to dist/ and inject into browser
gulp.task('copyHtml', function() {
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

// Move js dependencies files to dist/js and inject into browser
gulp.task('copyJS', function() {
	gulp.src([
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/popper.js/dist/umd/popper.min.js',
		'node_modules/knockout/build/output/knockout-latest.js'
	])
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

// Move font-awesome css file to dist/css
gulp.task('copyFa', function() {
	gulp.src('node_modules/font-awesome/css/font-awesome.min.css').pipe(gulp.dest('dist/css'));
});

// Move font-awesome folder contents to dist/fonts
gulp.task('copyFonts', function() {
	gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest('dist/fonts'));
});

// Concatinating js files, move to dist/js and inject into browser
gulp.task('copyJS', function() {
	gulp.src('src/js/*.js')
		.pipe(plumber())
		// .pipe(concat('main.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

// Optimize Images, move to dist/images
gulp.task('copyImg', () =>
	gulp
		.src('src/img/*')
		.pipe(imageMin())
		.pipe(gulp.dest('dist/img'))
);

// Compile Sass, move to dist/css and inject into browser
gulp.task('sass', function() {
	gulp.src('src/scss/*.scss')
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

// Serve dist/ directory on local server and Watch files to perform functions on change
gulp.task('serve', function() {
	browserSync.init({
		server: './dist'
	});
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/js/*.js', ['copyJS']);
	gulp.watch('src/img/*', ['copyImg']);
	gulp.watch('src/*.html', ['copyHtml']);
});

// Create default task to run all tasks at once
gulp.task('default', ['copyHtml', 'copyJS', 'copyFa', 'copyFonts', 'copyJS', 'copyImg', 'sass', 'serve']);
