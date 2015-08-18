/**
* QuickLinks -- Gulp tasks
*
* Copyright (c) 2014-2015 GochoMugo <mugo@forfuture.co.ke>
* See LICENSE in project root directory
*/


"use strict";


// npm-installed modules
var gulp = require("gulp");
var jshint = require("gulp-jshint");


// path variables
var paths = {
  js: ["gulpfile.js", "lib/**/*.js", "data/js/*.js"]
};


/**
* Gulp task -- jshint
* Runs jshint against all javascript files
*/
gulp.task("jshint", function() {
  "use strict";
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});


/**
* Gulp task -- default
* The default task
*/
gulp.task("default", ["jshint"]);
