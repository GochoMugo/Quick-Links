/**
 * Grunt, The Javascript Task Runner
 */


// npm-installed modules
import load from "load-grunt-tasks";


export default function(grunt) {
  load(grunt);

  grunt.initConfig({
    eslint: {
      src: ["src/**/*.js"],
    },
  });

  grunt.registerTask("test", ["eslint"]);
}
