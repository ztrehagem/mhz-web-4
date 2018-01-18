const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const data = require('gulp-data');
const nop = require('gulp-nop');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const md5 = require('gulp-md5-assets');
const plumber = require('gulp-plumber');
const webserver = require('gulp-webserver');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');

const stylup = require('./stylup');

const srcPath = (...paths) => path.resolve(__dirname, 'src', ...paths);
const destPath = (...paths) => path.resolve(__dirname, 'assets', ...paths);
const ENTRIES = {
  PUG: [srcPath('views/*.pug'), srcPath('views/!(components|layouts)/**/*.pug')],
  STYLUS: [srcPath('styles/master.styl')],
  JS: fs.readdirSync(srcPath('scripts')).filter(name => name.endsWith('.js')).map(name => srcPath('scripts', name)),
};
const WATCH = {
  PUG: [srcPath('views/**/*.pug'), srcPath('data/**/*')],
  STYLUS: [srcPath('styles/**/*.styl')],
  JS: [srcPath('scripts/**/*.js')],
};
const DEST = {
  HTML: destPath(''),
  CSS: destPath('css'),
  JS: destPath('js'),
};
const ASSETS = {
  HTML: destPath('**/*.html'),
  CSS: destPath('**/*.css'),
  JS: destPath('**/*.js'),
};
const flags = {
  production: false,
  watch: false,
};

gulp.task('clean', () => del.sync([destPath('**/*.@(html|css|js|map)')]));

gulp.task('enable-production', () => flags.production = true);

gulp.task('enable-watch', () => flags.watch = true);

gulp.task('pug', () => gulp.src(ENTRIES.PUG)
  .pipe(plumber())
  .pipe(data((file) => require(srcPath('data', path.basename(file.path, '.pug')))))
  .pipe(pug())
  .pipe(gulp.dest(DEST.HTML))
);

gulp.task('stylus', () => gulp.src(ENTRIES.STYLUS, { read: false })
  .pipe(stylup({
    destDir: 'assets/css',
    watch: flags.watch,
    sourcemap: !flags.production,
    poststylus: ['autoprefixer', 'csswring'],
    stdio: 'inherit',
  }))
);

gulp.task('js', () => {
  const destFileName = 'app.js';

  const bundler = browserify({
    entries: ENTRIES.JS,
    debug: flags.production ? false : true,
    plugin: flags.watch ? watchify : null,
  }).transform(babelify, {
    presets: ['es2015', 'es2016', 'es2017'],
    plugins: [['transform-runtime', {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: 'babel-runtime'
    }]],
  });

  const bundle = () => bundler.bundle()
    .on('error', (error) => {
      gutil.log('js bundle error');
      gutil.log(error.toString());
    })
    .pipe(source(destFileName))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(flags.production ? nop() : sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(flags.production ? nop() : sourcemaps.write('./'))
    .pipe(gulp.dest(DEST.JS))
    .on('end', () => gutil.log(`write to '${destFileName}'`));

  bundler.on('update', bundle);

  return bundle();
});

gulp.task('default', ['clean', 'pug', 'stylus', 'js'], () => gulp.src([ASSETS.CSS, ASSETS.JS])
  .pipe(md5(null, ASSETS.HTML))
);

gulp.task('production', ['enable-production', 'default']);

gulp.task('watch', ['enable-watch', 'default'], () => {
  gulp.watch(WATCH.PUG, ['pug']);
});

gulp.task('serve', () => gulp.src(destPath()).pipe(webserver()));

gulp.task('local', ['watch', 'serve']);
