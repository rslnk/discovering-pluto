var gulp = require('gulp')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , webpack = require('gulp-webpack')
  , jade = require('gulp-jade')
  , debug = require('gulp-debug')
  , autoprefixee = require('gulp-autoprefixer')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')
  , stylus = require('gulp-stylus')
  , koutoSwiss = require('kouto-swiss')
  , path = require('path')
  , iconify = require('gulp-iconify')

gulp.task('stylus', function () {
  return gulp.src('./src/stylus/main.styl')
    .pipe(stylus({ use: [ koutoSwiss() ] }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(reload({ stream : true }))
})

gulp.task('jade', function() {
  return gulp.src('./src/views/pages/*.jade')
    .pipe(jade({ 
      locals: { 
        intro : require('./src/data/intro.js'),
        slides : require('./src/data/slides.js'),
        subscribeView : require('./src/data/subscribe.js'),
        footer : require('./src/data/footer.js'),
        links : require('./src/data/links.js'),
        credits : require('./src/data/credits.js'),
        references : require('./src/data/references.js'),
        gratitudes : require('./src/data/gratitudes.js')
      }
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('images', function() {
  return gulp.src('./src/images/*.*')
    .pipe(gulp.dest('./dist/images/'))
})

gulp.task('videos', function() {
  return gulp.src('./src/videos/*.*')
    .pipe(gulp.dest('./dist/videos/'))
})

gulp.task('iconify', function() {
  return iconify({
    src: './src/icons/*.svg',
    cssOutput: './dist/css'
  })
})

gulp.task('js', function(){
  return gulp.src('./src/js/index.js')
    .pipe(webpack({ 
      output : { filename : 'index.js' },
      loaders: [
        { test: require.resolve('jquery'), loader: 'imports?jQuery=jquery' },
      ],
      resolve : {
        alias: {
          TweenMax : path.join(__dirname +  '/src/vendor/gsap/src/uncompressed/TweenMax.js'),
          TweenLite : path.join(__dirname + '/src/vendor/gsap/src/uncompressed/TweenLite.js'),
          TimelineMax : path.join(__dirname + '/src/vendor/gsap/src/uncompressed/TimelineMax.js')
        }
      }
    }))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('browser-sync', function() {
  browserSync({
    server: { baseDir: './dist/' },
    port: 7200,
    open: false
  })
})

gulp.task('build', ['stylus','jade','js','images','videos'])

gulp.task('go', ['stylus','jade','js','images','videos','browser-sync'], function() {
  gulp.watch('./src/stylus/**/*.styl', ['stylus'])
  gulp.watch('./src/views/**/*.jade', ['jade', reload])
  gulp.watch('./src/js/**/*.js', ['js', reload])
})
