/*
 * bacon-grunt
 * https://github.com/DallonF/bacon-grunt
 *
 * Copyright (c) 2014 Dallon Feldner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  return function globFiles(src, dest, extras) {
    // find the first instance of a wildcard
    // TODO: This isn't robust - it wouldn't properly handle something like "js/test_*.js". But it's good enough for now.
    var globIndex = src.indexOf('*'); 
    var config = { expand: true };

    if (globIndex === -1) {
      throw new Error("bacon.globFiles() expects src to contain a glob pattern or wildcard");
    }

    config.cwd = src.slice(0, globIndex);
    config.src = src.slice(globIndex);
    config.dest = dest;

    if (extras) {
      Object.keys(extras).forEach(function(k) {
        config[k] = extras[k];
      });
    }

    return config;
  };

};