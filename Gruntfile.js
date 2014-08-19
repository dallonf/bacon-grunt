/*
 * bacon-grunt
 * https://github.com/DallonF/bacon-grunt
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var bacon = require('./index')(grunt);
  bacon.loadNpmTasks();
  grunt.loadTasks('test/tasks');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'test-tasks/*.js',
        '<%= nodeunit.test %>' // Can reference tasks defined with bacon!
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // Whenever the "test" task is run, run
  // some sample tasks, then test the result.
  bacon.task('test', [

    // Test the files argument of subtask()
    bacon.subtask('testFiles', {
      src: 'tmp/custom_options',
      dest: 'test/fixtures/123'
    }),
    // Test the options argument of subtask()
    bacon.subtask('testOptions', {}, {
      test: 'tested'
    }),
    // Test subtaskConfig()
    bacon.subtask('testConfig', {
      testConfig: 'configTest'
    }),
    // // Test customSubtask()
    bacon.subtaskCustom('testCustom', function() {
      grunt.config.set('__testOutput__.custom.success', true);
    }),
    // Test multi-subtasks
    bacon.subtask('testMulti:superman', {
      superpower: 'everything'
    }),
    bacon.subtask('testMulti:batman', {
      superpower: 'being batman'
    }),

    'testLiteral',

    // Unit tests.
    bacon.subtask('nodeunit', ['test/*_test.js'])
  ]);
};
