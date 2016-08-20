module.exports = function(grunt) {

  // 1. Вся настройка находится здесь
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

  // 3. Тут мы указываем Grunt, что хотим использовать этот плагин
  grunt.loadNpmTasks('grunt-contrib-concat');

  // 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
  grunt.registerTask('default', ['concat']);

};