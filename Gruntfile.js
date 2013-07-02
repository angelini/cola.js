var jshint = {
  options: { jshintrc: './jshintrc' },
  target: {
    src: ['src/**/*.js', 'tests/**/*.js']
  }
};

var karma = {
  unit: { configFile: './karma.conf.js' }
};

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: jshint,
    karma: karma
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['karma']);
};
