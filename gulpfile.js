// requirements
const argv = require('minimist')(process.argv.slice(2))
const browserSync = require('browser-sync').create()
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')
const del = require('del')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const htmlMin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify')
const packageJson = require('./package.json');
const replace = require('gulp-replace')
const uglify = require('gulp-uglify')


// configuration
const productionMode = argv.production || false

const versionToBeReplaced = {
  orig: "version: '',",
  dest: "version: '" + packageJson.version + "',"
}

const uriToBeReplaced = {
  orig: "'http://' + window.location.hostname + ':8027'",
  dest: "'https://' + window.location.hostname + '/ma/api'"
}

const buildPath = 'build'
const htmlFiles = ['src/**/*.html']
const jsFiles = ['src/**/**/*.js']
const cssFiles = ['src/**/**/*.css']
const imgFiles = ['src/assets/images/**/*']
const localeFiles = ['src/assets/locales/*.json']


// tasks
gulp.task('clean', function () {
  del.sync(buildPath)
})

gulp.task('build:html', function () {
  const timestamp = new Date().getTime()
  gulp.src(htmlFiles)
    .pipe(replace('"css/styles.min.css"', '"css/styles.min.css?v=' + timestamp + '"'))
    .pipe(replace('"js/main.min.js"', '"js/main.min.js?v=' + timestamp + '"'))
    .pipe(gulpIf(productionMode,
      htmlMin({
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }).on('error', function (e) {
        console.log(e)
      })))
    .pipe(gulp.dest(buildPath))
})

gulp.task('build:js', function () {
  gulp.src(jsFiles)
    .pipe(concat('main.min.js'))
    .pipe(replace(versionToBeReplaced.orig, versionToBeReplaced.dest))
    .pipe(gulpIf(productionMode, replace(uriToBeReplaced.orig, uriToBeReplaced.dest)))
    .pipe(gulpIf(productionMode,
      uglify({ mangle: true }).on('error', function (e) {
        console.log(e)
      })))
    .pipe(gulp.dest(buildPath + '/js'))
})

gulp.task('build:css', function () {
  gulp.src(cssFiles)
    .pipe(concat('styles.min.css'))
    .pipe(gulpIf(productionMode,
      cleanCss({ keepSpecialComments: 0 }).on('error', function (e) {
        console.log(e)
      })))
    .pipe(gulp.dest(buildPath + '/css'))
})

gulp.task('build:img', function () {
  gulp.src(imgFiles)
    .pipe(gulp.dest(buildPath + '/assets/images'))
})

gulp.task('build:locale', function () {
  gulp.src(localeFiles)
    .pipe(gulpIf(productionMode,
      jsonminify().on('error', function (e) {
        console.log(e)
      })))
    .pipe(gulp.dest(buildPath + '/assets/locales'))
})

gulp.task('build:all', ['build:css', 'build:html', 'build:img', 'build:js', 'build:locale'])

gulp.task('serve', ['build:all'], function () {
  browserSync.init({
    server: {
      baseDir: buildPath
    },
    port: 9027,
    ui: {
      port: 9127
    }
  })

  // watch
  gulp.watch(htmlFiles, ['build:html']).on('change', browserSync.reload)
  gulp.watch(jsFiles, ['build:js']).on('change', browserSync.reload)
  gulp.watch(cssFiles, ['build:css']).on('change', browserSync.reload)
  gulp.watch(imgFiles, ['build:img']).on('change', browserSync.reload)
  gulp.watch(localeFiles, ['build:locale']).on('change', browserSync.reload)
})

gulp.task('default', ['clean', 'serve'])
