/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('testFiles', function() {
    grunt.config.set('__testOutput__.files.called', this.target);
  });

  grunt.registerMultiTask('testOptions', function() {
    grunt.config.set('__testOutput__.options.called', this.target);
  });

};