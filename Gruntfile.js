var jshint = {
  options: { jshintrc: './jshintrc' },
  target: {
    src: ['src/**/*.js', 'tests/**/*.js']
  }
};

var karma = {
  unit: { configFile: './karma.conf.js' }
};

var requirejs = {
  compile: {
    options: {
      baseUrl: 'src',
      out: 'dist/cola.js',
      name: 'Cola',

      optimize: 'uglify2',
      generateSourceMaps: true,
      preserveLicenseComments: false,
      useSourceUrl: true,

      paths: {
        underscore:    '../vendor/underscore',
        eventemitter2: '../vendor/eventemitter2'
      },

      shim: {
        underscore: {
          exports: '_'
        },

        eventemitter2: {
          exports: 'EventEmitter2'
        }
      }
    }
  }
};

var watch = {
  scripts: {
    files: ['src/**/*.js'],
    tasks: ['requirejs']
  }
};

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: jshint,
    karma: karma,
    requirejs: requirejs,
    watch: watch
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'requirejs']);
  grunt.registerTask('test', ['karma']);
};
