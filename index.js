/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  var bacon = {
    task: require('./lib/task')(grunt),
    subtaskConfig: require('./lib/subtask-config')(grunt),
    subtaskCustom: require('./lib/subtask-custom')(grunt),
    loadNpmTasks: require('./lib/load-npm-tasks')(grunt)
  };

  bacon.subtask = require('./lib/subtask')(grunt, bacon);
  return bacon;
};