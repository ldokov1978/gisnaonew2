const { src, dest, watch, parallel, series } = require ('gulp');
const less = require ('gulp-less');
const lessAutoprefix = require ('less-plugin-autoprefix');
const autoprefix = new lessAutoprefix ({
  browsers: ['last 10 versions']
});
const cssmin = require ('gulp-cssmin');
const concat = require ('gulp-concat');
const browserSync = require ('browser-sync').create ();
const uglify = require ('gulp-uglify-es').default;
const imagemin = require ('gulp-imagemin');
const del = require ('del');

// Синхронизация (обновление страницы) браузера
function browsersync () {
  browserSync.init ({
    server: {
      baseDir: 'app/'
    }
  });
};

// Сборка скриптов
function scripts () {
  return src (['app/js/main.js'])
  .pipe (concat ('main.min.js'))
  .pipe (uglify ())
  .pipe (dest ('app/js'))
  .pipe (browserSync.stream ())
};

// Сборка стилей LESS -> CSS
function styles () {
  return src ('app/less/style.less')
    .pipe (less({
      plugins: [autoprefix]
    }))
    .pipe (cssmin ())
    .pipe (concat ('style.min.css'))
    .pipe (dest ('app/css'))
    .pipe (browserSync.stream ())
}

// Сборка картинок
function images () {
  return src ('app/img/**/*')
  .pipe (imagemin ([
    imagemin.gifsicle ({interlaced: true}),
    imagemin.mozjpeg ({quality: 75, progressive: true}),
    imagemin.optipng ({optimizationLevel: 5}),
    imagemin.svgo ({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
  ]))
  .pipe (dest ('app/img'))
};

// Удаление папки DIST
function cleanDist () {
  return del ('dist')
};

// Сборка в DIST, запускается -> gulp build
function build () {
  return src ([
    'app/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/fonts/**/*',
    'app/img/**/*'
  ], {base: 'app'})
  .pipe (dest ('dist'))
};

// Отслеживание изменений
function watching () {
  watch (['app/less/**/*.less'], styles); // в CSS
  watch (['app/js/**/*.js', '!app/js/main.min.js'], scripts); // в скриптах
  watch (['app/*.html']).on ('change', browserSync.reload); // в HTML
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = series (cleanDist, images, build);
exports.default = parallel (scripts, browsersync, watching);