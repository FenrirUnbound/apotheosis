var gulp = require('./gulp')([
  'browserify'
]);

gulp.task('default', ['browserify']);
