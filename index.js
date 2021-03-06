/*
 * bacon-grunt
 * https://github.com/DallonF/bacon-grunt
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  var bacon = {
    task: require('./lib/task')(grunt),
    subtask: require('./lib/subtask')(grunt),
    subtaskCustom: require('./lib/subtask-custom')(grunt),
    globFiles: require('./lib/glob-files')(grunt)
  };
  return bacon;
};