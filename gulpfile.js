const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin'); // Not using it, that's why discolored text
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
gulp.task('copyDependencies', function() {
	gulp.src(['node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
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
		// .pipe(imageMin())
		.pipe(gulp.dest('dist/img'))
);

// Compile Sass, move to dist/css and inject into browser
gulp.task('sass', function() {
	gulp.src('src/scss/*.scss')
		.pipe(plumber())
		// .pipe(sass({ outputStyle: 'compressed' }))
		.pipe(sass())
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
gulp.task('default', ['copyHtml', 'copyDependencies', 'copyJS', 'copyImg', 'sass', 'serve']);
