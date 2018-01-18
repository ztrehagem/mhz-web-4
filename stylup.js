const path = require('path');
const through = require('through2');
const gutil = require('gulp-util');
const { spawn } = require('child_process');

module.exports = ({
  destDir,
  watch,
  sourcemap,
  include,
  includeCss,
  poststylus,
  stdio,
} = {}) => through.obj(function(file, encoding, callback) {
  const cwd = process.cwd();

  const command = [
    'stylus',
    watch ? ' --watch' : '',
    sourcemap ? ' --sourcemap-inline' : '',
    include ? ` --include ${include}` : '',
    includeCss ? ' --include-css' : '',
    Array.isArray(poststylus) ? ` --use ./node_modules/poststylus --with "[${poststylus.map(s => `'${s}'`).join(',')}]"` : '',
    ` ${path.relative(cwd, file.path)}`,
    destDir ? ` --out ${path.relative(cwd, path.join(destDir, path.relative(file.base, path.dirname(file.path))))}` : '',
  ].join('');

  gutil.log(`stylup: ${command}`);

  const child = spawn(command, { shell: true, stdio });

  if (watch) {
    callback(null, file);
  } else {
    child.on('close', () => callback(null, file));
  }
});
