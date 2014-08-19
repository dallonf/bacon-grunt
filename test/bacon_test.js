'use strict';

var grunt = require('grunt');
var bacon = require('../')(grunt);

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.bacon = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  test_config: function(test) {
    test.expect(3);

    test.deepEqual(grunt.config.get('testConfig.test'), { testConfig: 'configTest' }, "should have created configuration for the testConfig:test task");
    test.ok(grunt.task.exists('test:testConfig'), "should have created a test:testConfig alias task");
    test.equal(grunt.config.get('__testOutput__.config.called'), 'test', "should have run the testConfig:test task");

    test.done();
  },
  test_literal: function(test) {
    test.expect(1);

    test.ok(grunt.config.get('__testOutput__.literal.success'), "should have called testLiteral task");

    test.done();
  },
  test_subtask_files: function(test) {
    test.expect(3);

    test.deepEqual(grunt.config.get('testFiles.test'), {
      src: 'tmp/custom_options',
      dest: 'test/fixtures/123'
    }, "should have created configuration for the testFiles:test task");
    test.ok(grunt.task.exists('test:testFiles'), "should have created a test:testFiles alias task");
    test.equal(grunt.config.get('__testOutput__.files.called'), 'test', "should have run the testFiles:test task");

    test.done();
  },
  test_subtask_options: function(test) {
    test.expect(3);

    test.deepEqual(grunt.config.get('testOptions.test'), {
      options: {
        test: 'tested'
      }
    }, "should have created configuration for the testOptions:test task");
    test.ok(grunt.task.exists('test:testOptions'), "should have created a test:testOptions alias task");
    test.equal(grunt.config.get('__testOutput__.options.called'), 'test', "should have run the testOptions:test task");

    test.done();
  },
  test_multi: function(test) {
    test.expect(5);

    test.deepEqual(grunt.config.get('testMulti.testSuperman'), { superpower: 'everything' },
      "should have created configuration for the testMulti:testSuperman task");
    test.ok(grunt.task.exists('test:testMulti:superman'),
      "should have created a test:testMulti:superman alias task");

    test.deepEqual(grunt.config.get('testMulti.testBatman'), { superpower: 'being batman' },
      "should have created configuration for the testMulti:testBatman task");
    test.ok(grunt.task.exists('test:testMulti:batman'),
      "should have created a test:testMulti:batman alias task");

    test.deepEqual(grunt.config.get('__testOutput__.multi.called'), ['testSuperman', 'testBatman'],
      "should have run the testMulti:testSuperman and testMulti:testBatman tasks");

    test.done();
  },
  test_custom: function(test) {
    test.expect(2);

    test.ok(grunt.config.get('__testOutput__.custom.success'), "should have run the custom task");
    test.ok(grunt.task.exists('test:testCustom'), "should have created a test:testCustom task");

    test.done();
  },
  test_uniqueNamesError: function(test) {
    test.expect(1);

    test.throws(function() {
      bacon.task('uniqueNamesTest', [
        bacon.subtask('multi', {}),
        bacon.subtask('multi', {})
      ]);
    });

    test.done();
  },
  test_globfiles: function(test) {
    test.expect(4);

    test.throws(function() {
      bacon.globFiles('public/js/foo.js', 'dist/js');
    });

    test.deepEqual(bacon.globFiles('public/js/**/*.js', 'dist/js'), {
      expand: true,
      cwd: 'public/js/',
      src: '**/*.js',
      dest: 'dist/js'
    }, "should configure glob files");

    test.deepEqual(bacon.globFiles('public/js/*.js', 'dist/js'), {
      expand: true,
      cwd: 'public/js/',
      src: '*.js',
      dest: 'dist/js'
    }, "should configure glob files with a single level");

    test.deepEqual(bacon.globFiles('public/js/*.js', 'dist/js', { ext: '.min.js' }), {
      expand: true,
      cwd: 'public/js/',
      src: '*.js',
      dest: 'dist/js',
      ext: '.min.js'
    }, "should include extras")

    test.done();
  }
};
