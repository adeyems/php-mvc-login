const gulp = require('gulp');

const notify = require('gulp-notify');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglifycss = require('gulp-uglifycss');
const clean = require('gulp-clean');




/*
  -- TOP LEVEL FUNCTIONS --
  gulp.task - Define tasks
  gulp.src - Point to files to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/



//const SCSS_FILES = 'src/sass/**/*.scss';
const HTML_FILES = 'App/Views/**/*.html';
const CSS_FILES = 'public/css/**/*.css';
const IMAGE_FILES ='public/images/*';
const JS_FILES = 'public/js/**/*.js';
//const ES6_FILES = 'src/js/es6/**/*.js';


const errorHandler = error => {
    notify.onError({
        title: 'Task Failed [' + error.plugin + ']',
        message: 'Oops! Something went north!',
        sound: true
    })(error);

    // Prevent gulp watch from stopping
    this.emit('end');
};


// message
gulp.task('message', () => {
    return console.log('Gulp is running...');
});


// Optimize Images
gulp.task('imageMin', () => {
        return gulp.src('src/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('public/images/'));
    }
);

// minify js files
gulp.task('scripts', function() {
    return gulp.src(JS_FILES)
        .pipe(concat('compiled.js'))
        .pipe(minify())
        .pipe(gulp.dest('public/js/'));
});


// minify css
gulp.task('css', function () {
    gulp.src(CSS_FILES)
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('public/css'));
});

//minify html pages
gulp.task('pages', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

//concat all css into a file
gulp.task('styles', function() {
    return gulp.src(CSS_FILES)
        .pipe(concat('compiled.css'))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('image', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            pngquant: true,
            progressive: true
        })))
        .pipe(gulp.dest('built/imgs'));
});

gulp.task('scripts', function() {
    return gulp.src(JS_FILES)
        .pipe(concat('compiled.js'))
        .pipe(minify())
        .pipe(gulp.dest('public/js/'));
});

// Clean output directory
gulp.task('clean', () => {
    return gulp.src('/', {read: false})
        .pipe(clean());
});

// Gulp task to minify all files
gulp.task('default', ['clean'], () => {
    runSequence(
        'styles',
        'scripts',
        'pages',
        'images'
    );
});

gulp.task('watch', function(){
    gulp.watch(JS_FILES, ['scripts']);
    gulp.watch(IMAGE_FILES, ['images']);
    gulp.watch(CSS_FILES, ['styles']);
    gulp.watch(HTML_FILES, ['pages']);

});
