const path = require('path');
const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const data = require('gulp-data');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const webserver = require('gulp-webserver');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');

const srcPath = (...paths) => path.resolve(__dirname, 'src', ...paths);
const destPath = (...paths) => path.resolve(__dirname, 'assets', ...paths);
const ENTRIES = {
  PUG: [srcPath('views/*.pug'), srcPath('views/!(components|layouts)/**/*.pug')],
  STYLUS: [srcPath('styles/master.styl')],
  JS: [srcPath('scripts/app.js')],
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
const flags = {
  watchingJs: false,
};

del.sync([destPath('!(.git|favicon.ico|img/)')])

gulp.task('enable-wathing-js', () => flags.watchingJs = true);

gulp.task('pug', () => gulp.src(ENTRIES.PUG)
  .pipe(plumber())
  .pipe(data((file) => require(srcPath('data', path.basename(file.path, '.pug')))))
  .pipe(pug())
  .pipe(gulp.dest(DEST.HTML))
);

gulp.task('stylus', () => gulp.src(ENTRIES.STYLUS)
  .pipe(plumber())
  .pipe(stylus({compress: true}))
  .pipe(gulp.dest(DEST.CSS))
);

gulp.task('js', () => {
  const destFileName = 'app.js';

  const bundler = browserify({
    entries: ENTRIES.JS,
    debug: true,
    plugin: flags.watchingJs ? watchify : null,
  }).transform(babelify, {presets: 'es2015'});

  const bundle = () => bundler.bundle()
    .on('error', () => console.log('bundle error'))
    .pipe(source(destFileName))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(DEST.JS))
    .on('end', () => console.log(`[${new Date().toLocaleTimeString()}] write to '${destFileName}'`));

  bundler.on('update', bundle);

  return bundle();
});

gulp.task('serve', () => gulp.src(destPath()).pipe(webserver()));

gulp.task('default', ['pug', 'stylus', 'js']);

gulp.task('watch', ['enable-wathing-js', 'default'], () => {
  gulp.watch(WATCH.PUG, ['pug']);
  gulp.watch(WATCH.STYLUS, ['stylus']);
});

gulp.task('local', ['watch', 'serve']);
