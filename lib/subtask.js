/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt, bacon) {

  return function subtask(subtaskName, files, options) {
    return bacon.subtaskConfig(subtaskName, {
      files: files,
      options: options
    });
  };

};