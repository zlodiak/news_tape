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
          'js/project/views/NewsTapeView.js', 
          'js/project/views/NewsUnitView.js', 
          'js/project/views/NewsModalView.js', 
          'js/project/collections/collections.js', 
          'js/project/config.js'
        ],
        dest: 'js/production.js',
      }
    },

    uglify: {
      build: {
        src: 'js/production.js',
        dest: 'js/production.min.js'
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'images/production/'
        }]
      }
    }    
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);

};