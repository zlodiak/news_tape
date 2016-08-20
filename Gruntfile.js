module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'js/project/models/models.js', 
          'js/project/views/newsTapeView.js', 
          'js/project/collections/collections.js', 
          'js/project/config.js'
        ],
        dest: 'js/production.js',
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};