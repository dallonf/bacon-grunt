/*
 * grunt-bacon
 * https://github.com/DallonF/grunt-bacon
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('testMulti', function() {

    var called = grunt.config.get('__testOutput__.multi.called') || [];
    called.push(this.target);

    grunt.config.set('__testOutput__.multi.called', called);
  });

};