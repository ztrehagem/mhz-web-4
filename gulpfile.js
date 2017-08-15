const path = require('path');
const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');

const srcPath = filepath => path.resolve(__dirname, 'src', filepath);
const destPath = filepath => path.resolve(__dirname, 'assets', filepath);
const SRC = {
  PUG: srcPath('views/index.pug'),
  STYLUS: srcPath('styles/master.styl'),
  JS: srcPath('scripts/app.js'),
};
const DEST = {
  HTML: destPath(''),
  CSS: destPath('css'),
  JS: destPath('js'),
};
const flags = {
  watchingJs: false,
};

del.sync([destPath('!(.git)')]);

gulp.task('enable-wathing-js', () => flags.watchingJs = true);

gulp.task('pug', () => gulp.src(SRC.PUG)
  .pipe(pug())
  .pipe(gulp.dest(DEST.HTML))
);

gulp.task('stylus', () => gulp.src(SRC.STYLUS)
  .pipe(stylus({compress: true}))
  .pipe(gulp.dest(DEST.CSS))
);

gulp.task('js', () => {
  const destFileName = 'app.js';

  const bundler = browserify({
    entries: [SRC.JS],
    debug: true,
    plugin: flags.watchingJs ? watchify : null,
  }).transform(babelify, {presets: 'es2015'});

  const bundle = () => bundler.bundle()
    .on('error', () => console.log('bundle error'))
    .pipe(source(destFileName))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(DEST.JS))
    .on('end', () => console.log(`[${new Date().toLocaleTimeString()}] write to '${destFileName}'`));

  bundler.on('update', bundle);

  return bundle();
});

gulp.task('default', ['pug', 'stylus', 'js']);

gulp.task('w', ['watch']);
gulp.task('watch', ['enable-wathing-js', 'default'], () => {
  gulp.watch(SRC.PUG, ['pug']);
  gulp.watch(SRC.STYLUS, ['stylus']);
});
