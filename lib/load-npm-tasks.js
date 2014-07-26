/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

module.exports = function(grunt) {

  /**
  Scans the node_modules directory for folders starting with "grunt-" and loads
  tasks from them.

  TODO: Allow manual excludes
  **/
  return function loadNpmTasks() {
    var dirs = fs.readdirSync('./node_modules');
    dirs.forEach(function(dir) {
      if (dir !== 'grunt-bacon' && dir.indexOf('grunt-') === 0) {
        grunt.loadNpmTasks(dir);
      }
    });
  };

};