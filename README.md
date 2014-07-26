# grunt-bacon

> Makes for tastier Gruntfiles

## Features

* Allows inline definition of every task in a sequence
* No more scrolling back and forth between `grunt.registerTask` and `grunt.initConfig()`
* Automatically import all npm tasks
* Just syntactic sugar! All Grunt functionality works just like it used to.
* It's so good I named it "Bacon".

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bacon --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
var bacon = require('grunt-bacon')(grunt);
```

## Overview

Here's a sample (slightly contrived) Gruntfile enhanced by Bacon:

```js
module.exports = function(grunt) {
  var bacon = require('grunt-bacon')(grunt);
  bacon.loadNpmTasks(); // Automatically scans your node_modules folder

  // grunt.initConfig() is used for global tasks only - the way it should be!
  grunt.initConfig({
    jshint: {
      options: {
        curly: true
      },
      src: {
        files: {
          src: ['public/js/*.js']
        }
      }
    }
  });

  bacon.task('build', [ // Use instead of grunt.registerTask() for multi-step tasks

    'jshint', // Reference tasks the old-fashioned way, or...

    // Adds a `uglify:build` task
    // Also creates an alias as `build:uglify` for better readability
    bacon.subtask('uglify', { // First argument of subtask() is the `files` object
      src: 'public/js/*.js',
      dest: 'dist/js/'
    }, { // Second argument of subtask() is the `options` object
      sourceMap: true
    }),

    // Creates `clean:build` task and `build:clean` alias
    // subtaskConfig() uses the second argument as the entire task configuration
    bacon.subtaskConfig('clean', ['tmp']),

    // For multiple instances of a subtask in a task, you will need more specific names
    // Creates a `copy:buildImg` task and `build:copy:img` alias
    bacon.subtask('copy:img', {
      src: 'public/img/*.png',
      dest: 'dist/img/'
    }),

    // `copy:buildIndex`; alias: `build:copy:index`
    bacon.subtask('copy:index', {
      'dist/index.html': 'public/index.html'
    }),

    // Can't find a plugin? Just write a quick function to do the job!
    // Equivalent to grunt.registerTask('build:logDone', function() { ... })
    bacon.subtaskCustom('logDone', function() {
      console.log("Done!");
    })
  ]);

  // This whole task is registered as if you had used:
  // grunt.registerTask('build', ['jshint', 'uglify:build', 'clean:build', 'copy:buildImg', 'copy:buildIndex', 'build:logDone']);
};
```

For comparison, here's the same Gruntfile written without Bacon. Notice how you need to scroll back and forth between the `grunt.registerTask()` calls and the `grunt.initConfig()` section in order to understand it:

```js
module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      build: 'tmp'
    },

    jshint: {
      options: {
        curly: true
      },
      src: {
        files: {
          src: ['public/js/*.js']
        }
      }
    },

    copy: {
      buildImg: {
        files: {
          src: 'public/img/*.png',
          dest: 'dist/img/'
        }
      },
      buildIndex: {
        files: {
          'dist/index.html': 'public/index.html'
        }
      }
    },

    uglify: {
      build: {
        files: {
          src: 'public/js/*.js',
          dest: 'dist/js/'
        },
        options: {
          sourceMap: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build:logDone', function() {
    console.log("Done!");
  });

  grunt.registerTask('build', ['jshint', 'uglify:build', 'clean:build', 'copy:buildImg', 'copy:buildIndex', 'build:logDone']);
};
```
a
## Bacon functions

### `bacon.loadNpmTasks()`

Scans your project's node_modules directory for folders starting with `grunt-` (Exlcuding `grunt-bacon`, of course!) and calls `grunt.loadNpmTasks()` on each one.

### `bacon.task(taskName: String, subtasks: [String or BaconSubtask])`

Registers a new task sequence with the name `taskName`.

Any `BaconSubtasks` (created with `bacon.subtask()`, `bacon.subtaskConfig()`, or `bacon.subtaskCustom()`) in the `subtasks` array will be registered with Grunt. In addition, any strings in the `subtasks` array will be interpreted as the name of a task defined elsewhere.

If only strings are used in the `subtasks` array, this function is identical to `grunt.registerTask(taskName, subtasks)`.

### `bacon.subtask(subtaskName: String, files: Object, options: Object)`

Returns a `BaconSubtask` for use with `bacon.task()`. This function provides a concise syntax for the majority of subtasks you will create!

This is syntactic sugar for `bacon.subtaskConfig(subtaskName, {files: files, options: options})`, so refer to the documentation for that method for details.

### `bacon.subtaskConfig(subtaskName: String, config: Object)`

Returns a `BaconSubtask` for use with `bacon.task()`.

Example usage:
```js
bacon.task('doThings', [
  // Simple
  bacon.subtaskConfig('build', 'allTheThings'),
  // Specific name
  bacon.subtaskConfig('clean:tmp', ['tmp'])
])
```

Equivalent vanilla Gruntfile:
```js
grunt.initConfig({
  build: {
    doThings: 'allTheThings'
  },
  clean: {
    doThingsTmp: ['tmp']
  }
});

grunt.registerTask('doThings:build', ['build:doThings']);
grunt.registerTask('doThings:clean:tmp', ['clean:doThingsTmp']);
```

The `subtaskName` usually refers to the name of a multiTask (e.g. `clean` and `build` in this example, or `uglify`, `copy`, etc). You can optionally add additional colon-seperated names for additional specificity (e.g. `clean:tmp` in this example, or `copy:img`, `less:bootstrap`, etc). This is sometimes required, since every subtask must have a unique name within the task.

This function will set `config` as the Grunt configuration for a task with the convention of `<multiTask>:<parentTask><Specificiers>` (any colons in the `subtaskName` will be converted to camelcase). The examples above will create Grunt configuration for a `cleanThings:clean` and `cleanThings:cleanTmp` task, respectively.

For more intuitive task names, this function will also create an alias to this task called `<parentTask>:<subtaskName>`. In this example, the aliases are `doThings:build` and `doThings:clean:tmp`, respectively.

### `bacon.subtaskCustom(subtaskName: String, subtask: Function)`

Returns a `BaconSubtask` for use with `bacon.task()`.

Example usage:
```js
bacon.task('doThings', [
  // Simple
  bacon.subtaskCustom('build:allTheThings', function() {
    console.log("BUILT ALL THE THINGS");
  })
])
```

Equivalent vanilla Gruntfile:
```js
grunt.registerTask('doThings:build:allTheThings', function() {
  console.log("BUILT ALL THE THINGS");
});
```

This mounts the `subtask` function as a task called `<parentTask>:<subtaskName>`. Unlike with `bacon.subtaskConfig`, colons in the `subtaskName` are left mostly untouched. (In this example, the task is created as `doThings:build:allTheThings`).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.1.0: First release!
