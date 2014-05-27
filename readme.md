Livereload and connect variables -------------------------------------------------

Clean ----------------------------------------------------------------------------
    Clean build folder

SASS/SCSS ------------------------------------------------------------------------
    Compiles all Sass/SCSS files and appends project banner

JSHint ---------------------------------------------------------------------------
    Manage the options inside .jshintrc file

Concatenate js files-----------------------------------------------------------------
    imports all .js files and appends project banner

imagemin ---------------------------------------------------------------------------
    minify all build/ png or jpg

lineremover -------------------------------------------------------------------------

minify every png or jpg

uglify ------------------------------------------------------------------------------

cssmin ------------------------------------------------------------------------------

bumpversion number

copy --------------------------------------------------------------------------------

connect -------------------------------------------------------------------------------

watch -------------------------------------------------------------------------------
    js and sass files

load our tasks using matchdep
grunt.loadNpmTasks('grunt-contrib-jshint');
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

Measure time of grunt tasks
require('time-grunt')(grunt);

======== development
grunt dev

======== release bump version
grunt release

======== build
grunt build