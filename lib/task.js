/*
 * bacon-grunt
 * https://github.com/DallonF/bacon-grunt
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  return function task(taskName, subtasks) {
    var subtaskNames = subtasks.map(function(subtask) {
      if (typeof subtask === 'string') {
          return subtask;
      } else if (subtask._bacon) {
        return subtask.addToGrunt(taskName);
      } else {
        throw new Error("bacon tasks only support bacon subtasks and strings!");
      }
    });

    grunt.registerTask(taskName, subtaskNames);
  };

};