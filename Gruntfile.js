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

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },    

    watch: {
      scripts: {
        files: [
          'js/project/*.js',
          'js/project/collections/*.js',
          'js/project/models/*.js',
          'js/project/views/*.js'
        ],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: ['css/*.css'],
        tasks: ['uglify', 'cssmin'],
        options: {
          spawn: false,
        },
      }      
    }        
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');  
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);

};