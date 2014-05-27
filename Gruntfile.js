'use strict';

//--- Livereload and connect variables -------------------------------------------------
var
  LIVERELOAD_PORT = 35729,
  lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
  mountFolder = function( connect, dir ) {
    return connect.static(require('path').resolve(dir));
  };


module.exports = function(grunt) {
  grunt.initConfig({

    // package.json file
    pkg: grunt.file.readJSON('package.json'),

    // Set project info
    project: {
        src: 'src',
        app: 'app',
        build: 'build',
        buildAssets: '<%= project.build %>/assets',
        assets: '<%= project.app %>/assets',
        css: [
          '<%= project.src %>/sass/*.sass'
        ],
        js: [
          '<%= project.src %>/js/*.js'
        ],
        font: [
          '<%= project.src %>/font'
        ]
    },

    //--- Project banner from package.json -------------------------------------------------
          // Dynamically appended to CSS/JS files
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },

    //--- Clean ----------------------------------------------------------------------------
          // Clean build folder
    clean: {
        build: [
          '<%= project.build %>'
        ]
    },

    //--- SASS/SCSS ------------------------------------------------------------------------
          // Compiles all Sass/SCSS files and appends project banner
    sass: {
      dist: {
        options: {
          style: 'compressed',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.buildAssets %>/css/style.min.css': '<%= project.css %>'
        }
      },
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.assets %>/css/style.min.css': '<%= project.css %>'
        }
      },
    },

    //--- JSHint ---------------------------------------------------------------------------
          // Manage the options inside .jshintrc file
    jshint: {
      files: [
        '<%= project.js %>',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //--- Concatenate js files-----------------------------------------------------------------
          // imports all .js files and appends project banner
    concat: {
      dev: {
        files: {
          '<%= project.assets %>/js/script.js': '<%= project.js %>'
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },

    //--- imagemin ---------------------------------------------------------------------------
          // minify all build/ png or jpg
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: '<%= project.buildAssets %>/',
            src: ['**/*.jpg'],
            dest: '<%= project.buildAssets %>/',
            ext: '.jpg'
          },
          {
            expand: true,
            cwd: '<%= project.buildAssets %>/',
            src: ['**/*.png'],
            dest: '<%= project.buildAssets %>/',
            ext: '.png'
          }
        ]
      }
    },

    //--- lineremover -------------------------------------------------------------------------
          // minify every png or jpg
    lineremover: {
      html: {
        files: [
          {
            expand: true,
            cwd: '<%= project.build %>/',
            src: ['**/*.html'],
            dest: '<%= project.build %>/',
            ext: '.html'
          }
        ]
      }
    },

    //--- uglify ------------------------------------------------------------------------------
    uglify: {
      build: {
        files: {
          '<%= project.buildAssets %>/js/script.min.js': '<%= project.src %>/js/*.js'
        }
      }
    },

    //--- cssmin ------------------------------------------------------------------------------
    cssmin: {
      build: {
        expand: true,
        cwd: '<%= project.buildAssets %>/css',
        src: ['*.css'],
        dest: '<%= project.buildAssets %>/css',
        ext: '.min.css'
      }
    },

    //--- cssmin ------------------------------------------------------------------------------
          // bumpversion number
    shell: {
      bumpVersion: {
        command: 'npm version patch'
      }
    },

    //--- copy --------------------------------------------------------------------------------
    copy: {
      font: {
        files: [
           {
            expand: true,
            flatten: true,
            src: '<%= project.font %>/*',
            dest: '<%= project.buildAssets %>/fonts'
          }
        ]
      },
      jsvendor: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= project.src %>/js/vendor/*',
            dest: '<%= project.buildAssets %>/js/vendor'
          }
        ]
      },
      jsvendordev: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= project.src %>/js/vendor/*',
            dest: '<%= project.assets %>/js/vendor'
          }
        ]
      },
      html: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= project.app %>/*.html',
            dest: '<%= project.build %>/'
          }
        ]
      }
    },

    //--- connect -------------------------------------------------------------------------------
    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     */
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },

    //--- watch -------------------------------------------------------------------------------
          // js and sass files
    watch: {
      js: {
        files: [
          '<%= project.js %>'
        ],
        tasks: [
          'jshint',
          'concat',
        ]
      },
      sass: {
        files: [
          '<%= project.css %>'
        ],
        tasks: [
          'sass:dev'
        ]
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.assets %>/css/*.css',
          '<%= project.assets %>/js/{,*/}*.js',
          // '<%= project.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
    },
  });

  // load our tasks using matchdep
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Measure time of grunt tasks
  // require('time-grunt')(grunt);

  // ======== development
  grunt.registerTask('dev', [
    'jshint',
    'concat',
    'copy:jsvendordev',
    'sass:dev',
    'connect:livereload',
    'open',
    'watch'
  ]);

  // ======== release bump version
  grunt.registerTask('release', [
    'shell:bumpVersion'
  ]);

  // ======== build
  grunt.registerTask('build', [
    'clean:build',
    'copy:html',
    'copy:jsvendor',
    'copy:font',
    'lineremover',
    'concat',
    'uglify:build',
    'sass:dist',
    'cssmin:build',
    'imagemin:dist',
  ]);
};
