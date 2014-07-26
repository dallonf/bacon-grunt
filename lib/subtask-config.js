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

  function SubtaskConfig(subtaskName, config) {
    this.subtaskName = subtaskName;
    this.config = config;
  }

  SubtaskConfig.prototype._bacon = 'subtaskConfig';
  SubtaskConfig.prototype.addToGrunt = function(parentTask) {
    var extras = this.subtaskName.split(':');
    var gruntTask = extras.shift();

    // gruntTask:parentTaskExtras
    var camelSubtaskName = inflection.camelize([parentTask].concat(extras).join('_'), true);
    var actualName = gruntTask + ':' + camelSubtaskName;
    // parentTask:gruntTask[:extras]
    var aliasName = [parentTask].concat(gruntTask).concat(extras).join(':');

    // gruntTask.parentTaskExtras
    var propertyName = [gruntTask, camelSubtaskName];
    if (grunt.config.get(propertyName)) {
      throw new Error("Attempted to define duplicate task: " + actualName + " (alias: " + aliasName + ")." +
        " You should specify a more specific name, ex: bacon.subtaskConfig('" + [gruntTask].concat(extras).concat('task1').join(':') + "')");
    }
    grunt.config.set(propertyName, this.config);

    grunt.registerTask(aliasName, [actualName]);

    return actualName;
  };

  return function subtaskConfig(subtaskName, config) {
    return new SubtaskConfig(subtaskName, config);
  };

};