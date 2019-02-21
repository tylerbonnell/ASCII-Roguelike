module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build_target: {
                files: {
                    'game.js': ['src/**/*.js']
                }
            }
        },
        watch: {
            js: { 
                files: 'src/**/*.js', 
                tasks: ['uglify'] 
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};