# Bacon for Grunt

> Makes for tastier Gruntfiles
> (not in any way related to [Bacon.js](http://baconjs.github.io/))

## Features

* Allows inline definition of every task in a sequence
* No more scrolling back and forth between `grunt.registerTask` and `grunt.initConfig()`
* Define glob patterns in one line of code instead of four!
* Just syntactic sugar! All Grunt functionality works just like it used to.
* It's so good I named it "Bacon".

## Getting Started
This add-on requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains Grunt's inner workings. Once you're familiar with the basics of Grunt, you may install Bacon with this command:

```shell
npm install bacon-grunt --save-dev
```

Once the module has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
var bacon = require('bacon-grunt')(grunt);
```

## Overview

Here's a sample (slightly contrived) Gruntfile enhanced by Bacon:

```js
module.exports = function(grunt) {
  var bacon = require('bacon-grunt')(grunt);  
  require('load-grunt-tasks')(grunt); // If you're not using load-grunt-tasks, you should be!

  // grunt.initConfig() is used for global tasks only - the way it should be!
  grunt.initConfig({
    jshint: {
      options: {
        curly: true
      },
      all: {
        src: ['public/js/**/*.js']
      }
    }
  });

  bacon.task('build', [ // Use instead of grunt.registerTask() for multi-step tasks

    'jshint', // Reference tasks the old-fashioned way, or...

    // Adds a `uglify:build` task
    // Also creates an alias as `build:uglify` for better readability
    bacon.subtask('uglify', 
      // Second argument of subtask() is the configuration for the task
      // bacon.globFiles() automatically generates an `expand: true` configuration block
      bacon.globFiles('public/js/**/*.js', 'dist/js/', {
        ext: '.min.js'
      }), { // Third argument of subtask() is the `options` object of the configuration
        sourceMap: true
      }),

    // Creates `clean:build` task and `build:clean` alias
    // subtask() uses the second argument as the entire task configuration; it doesn't have to be an object
    bacon.subtask('clean', ['tmp']),

    // For multiple instances of a subtask in a task, you will need more specific names
    // Creates a `copy:buildImg` task and `build:copy:img` alias
    bacon.subtask('copy:img', bacon.globFiles('public/img/**/*.png', 'dist/img/')),

    // `copy:buildIndex`; alias: `build:copy:index`
    bacon.subtask('copy:index', {
      src: 'dist/index.html',
      dest: 'public/index.html'
    }),

    // Can't find a plugin? Just write a quick function to do the job!
    // Equivalent to grunt.registerTask('build:logDone', function() { ... })
    bacon.subtaskCustom('logDone', function() {
      console.log("Done!");
    })
  ]);

  // This whole task is registered like this:
  // grunt.registerTask('build', ['jshint', 'uglify:build', 'clean:build', 'copy:buildImg', 'copy:buildIndex', 'build:logDone']);
};
```

For comparison, here's the same Gruntfile written without Bacon and [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks) (a fellow warrior in the battle against messy Gruntfiles). Notice how you need to scroll back and forth between the `grunt.registerTask()` calls and the `grunt.initConfig()` section in order to understand it:

```js
module.exports = function(grunt) {

  grunt.initConfig({

    clean: {
      build: ['tmp']
    },

    jshint: {
      options: {
        curly: true
      },
      all: {
        src: ['public/js/*.js']
      }
    },

    copy: {
      buildImg: {
        expand: true,
        cwd: 'public/img/'
        src: '**/*.png',
        dest: 'dist/img/'
      },
      buildIndex: {
        src: 'dist/index.html',
        dest: 'public/index.html'
      }
    },

    uglify: {
      build: {
        expand: true,
        cwd: 'public/js/'
        src: '**/*.js',
        dest: 'dist/js/',
        ext: '.min.js',
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

## Bacon functions

### `bacon.task(taskName: String, subtasks: [String or BaconSubtask])`

Registers a new task sequence with the name `taskName`.

Any `BaconSubtasks` (created with `bacon.subtask()`, or `bacon.subtaskCustom()`) in the `subtasks` array will be registered with Grunt. In addition, any strings in the `subtasks` array will be interpreted as the name of a task defined elsewhere.

If only strings are used in the `subtasks` array, this function is identical to `grunt.registerTask(taskName, subtasks)`.

### `bacon.subtask(subtaskName: String, config: Object[, options: Object])`

Returns a `BaconSubtask` for use with `bacon.task()`.

Example usage:
```js
bacon.task('doThings', [
  // Simple
  bacon.subtask('build', 'allTheThings'),
  // Specific name
  bacon.subtask('clean:tmp', ['tmp']),
  // With options
  bacon.subtask('uglify', {
    src: 'public/**/*.js', dest: 'build'
  }, {
    mangle: false
  })
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
  },
  uglify: {
    doThings: {
      src: 'public/**/*.js', dest: 'build',
      options: {
        mangle: false
      }
    }
  }
});

grunt.registerTask('doThings:build', ['build:doThings']);
grunt.registerTask('doThings:clean:tmp', ['clean:doThingsTmp']);
```

The `subtaskName` usually refers to the name of a multiTask (e.g. `clean`, `build`, and `uglify` in this example, or `copy`, `less`, etc). You can optionally add additional colon-seperated names for additional specificity (e.g. `clean:tmp` in this example, or `copy:img`, `less:bootstrap`, etc). This is sometimes required, since every subtask must have a unique name within the task.

This function will set `config` as the Grunt configuration for a task with the convention of `<multiTask>:<parentTask><Specificiers>` (any colons in the `subtaskName` will be converted to camelcase). The examples above will create Grunt configuration for `build:doThings`, `clean:doThingsTmp`, and `uglify:doThings` tasks, respectively.

If the optional `options` argument is provided, the value will merged into `config` with a key of `options`; see the `uglify` task in this example.

For more intuitive task names, this function will also create an alias to this task called `<parentTask>:<subtaskName>`. In this example, the aliases are `doThings:build`, `doThings:clean:tmp`, and `doThings:uglify` respectively.

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

This mounts the `subtask` function as a task called `<parentTask>:<subtaskName>`. Unlike with `bacon.subtask()`, colons in the `subtaskName` are left mostly untouched. (In this example, the task is created as `doThings:build:allTheThings`).

### `bacon.globFiles(src: String, dest: String[, extras: Object])`

Returns an Object configuration for [building a Files list dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

The `src` argument will be split between the `cwd` and `src` properties of the return object: everything before the first wildcard (`*`) will be put into `cwd`.

Any properties in `extras` will be merged into the result.

Example usage: 
```js
bacon.task('build', [
  bacon.subtask('uglify', bacon.globFiles('public/js/**/*.js', 'dist/js', { 
    ext: '.min.js'
  }))
])
```

Equivalent vanilla Gruntfile:
```js
grunt.initConfig({
  uglify: {
    build: {
      expand: true,
      cwd: 'public/js/',
      src: '**/*.js',
      dest: 'dist/js',
      ext: '.min.js'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.3.0: Renamed to `bacon-grunt` from `grunt-bacon`; removed `bacon.loadNpmTasks()`. Added `bacon.globFiles()`.
* v0.2.0: Major refactor of `bacon.subtask()`, removed `bacon.subtaskConfig()`.
* v0.1.0: First release!
