var gulp = require('gulp');

module.exports = function main(tasks) {
  tasks.forEach(function loadTasks(taskName) {
    gulp.task(taskName, require('./tasks/'+taskName));
  });

  return gulp;
};
