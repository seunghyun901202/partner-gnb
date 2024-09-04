const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const bless = require('gulp-bless');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const size = require('gulp-size');
const clean = require('gulp-clean');
const ver = require('gulp-ver');
const stripDebug = require('gulp-strip-debug');
const debug = require('gulp-debug');
const connect = require('gulp-connect');
const vendorScripts = require('./vendor.scripts.json');
const conf = require('./gulp.conf.json');
const browserSync = require('browser-sync').create();

// gulp build-watch -> 프로젝트 빌드 후 브라우저에서 렌더링 확인
gulp.task('build-watch', ['build', 'watch', 'connect']);

// gulp build -> template 파일 html 폴더로 추출
gulp.task('build', ['vendor', 'app', 'sass', 'html-template']);

// gulp dist -> css, js 압축
gulp.task('dist', ['build-css', 'concat-js']);

// 모바일도 확인할 수 있도록 해줌.
gulp.task('sync-watch', ['build', 'watch', 'browserSync']);

gulp.task('browserSync', function () {
  return browserSync.init(
    {
      port: 9000,
      server: {
        baseDir: './'
      }
    });
});

// ::: Build Task :::
gulp.task('concat-js', ['dist-clean-js'], function () {
  const vendor = conf.path.build.js + '/' + conf.name.vendor;
  const app = conf.path.build.js + '/' + conf.name.app;

  gulp.src([vendor, app])
    .pipe(babel())
    .pipe(concat(conf.name.default))
    .pipe(stripDebug()) // 콘솔 제거
    .pipe(ver())
    .pipe(uglify())
    .pipe(gulp.dest(conf.path.dist.js));
});

gulp.task('dist-clean-js', function () {

  return gulp.src(conf.path.dist.js + '/*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('build-css', ['dist-clean-css'], function () {

  return gulp.src(conf.path.build.css + '/*.css')
    .pipe(ver())
    .pipe(cssmin({showLog: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(conf.path.dist.css));
});

gulp.task('dist-clean-css', function () {

  return gulp.src(conf.path.dist.css + '/*', {read: false}).pipe(clean({force: true}));
});

gulp.task('sass', ['clean-css'], function () {
  return gulp.src(conf.path.src.scss)
    .pipe(sass())
    .pipe(bless({
      imports: false
    }))
    .pipe(debug({title: 'console:'}))
    .pipe(gulp.dest(conf.path.build.css));
});

// css 적용이 잘 안될 때
gulp.task('clean-css', function () {
  return gulp.src(conf.path.build.css + '/*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('app', function () {
  return gulp.src(conf.path.src.js)
    .pipe(babel())
    .pipe(concat(conf.name.app))
    .pipe(minify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(debug({title: 'console:'}))
    .pipe(gulp.dest(conf.path.build.js));
});

gulp.task('vendor', ['clean-js'], function () {
  // check
  vendorScripts.forEach(function (item) {
    gulp.src(item).pipe(size()).pipe(debug({title: 'script :'}));
  });

  return gulp.src(vendorScripts)
    .pipe(concat(conf.name.vendor))
    .pipe(minify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest(conf.path.build.js));
});

gulp.task('clean-js', function () {
  return gulp.src(conf.path.build.js + '/*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('html-template', ['clean-html-template'], function () {
  // Include partial HTML templates and compile them to the build directory.
  return gulp.src(conf.path.src.html)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(conf.path.build.html))
    .pipe(connect.reload());
});

gulp.task('clean-html-template', function () {
  return gulp.src(conf.path.build.html + '/*.html', {read: false})
    .pipe(clean({force: true}));

});

gulp.task('watch', function () {
  gulp.watch(conf.path.watch.js, ['app']);
  gulp.watch(conf.path.watch.scss, ['sass']);
  gulp.watch(conf.path.watch.html, ['html-template']);
});

// localhost port 번호
gulp.task('connect', function () {
  connect.server({
    root: './',
    port: 8888
  });
});
