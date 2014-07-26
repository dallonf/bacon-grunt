/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

var inflection = require('inflection');

module.exports = function(grunt) {

  function SubtaskCustom(subtaskName, func) {
    this.subtaskName = subtaskName;
    this.func = func;
  }

  SubtaskCustom.prototype._bacon = 'subtaskCustom';
  SubtaskCustom.prototype.addToGrunt = function(parentTask) {
    var taskName = [parentTask].concat(this.subtaskName).join(':');

    grunt.registerTask(taskName, this.func);
    return taskName;
  };

  return function subtaskCustom(subtaskName, func) {
    return new SubtaskCustom(subtaskName, func);
  };

};