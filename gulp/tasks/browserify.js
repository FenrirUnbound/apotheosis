var browserify = require('browserify');
var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var source = require('vinyl-source-stream');

function gatherSources() {
  var targetFolder = path.resolve(__dirname, '../../public/js')
  var files = fs.readdirSync(targetFolder);
  var result = [];

  files.forEach(function createAbsolutePath(file) {
    if (path.extname(file) === '.js') {
      result.push(path.join(targetFolder, file));
    }
  });
  return result;
}


module.exports = function main() {
  var sourceFiles = gatherSources();
  sourceFiles.forEach(function compile(sourceFile) {
    return browserify({
      debug: true,
      entries: [sourceFile]
    })
    .bundle()
    .pipe(source(path.basename(sourceFile)))
    .pipe(gulp.dest('./public/scripts/'))
  });
};
