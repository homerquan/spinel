/*global module:false*/
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    example: grunt.file.read('examples/html-script/example.html'),
    nav: grunt.file.read('docs/nav.html'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */\n',
    includereplace: {
      pre: {
        options: {
          globals: {
            VERSION: '<%= pkg.version %>',
            INDEX_VERSION: '<%= pkg.index_version %>',
            EXAMPLE: '<%= example %>'
          }
        },
        files: [
          {src: 'lib/hummingbird.litcoffee', dest: 'build/hummingbird.litcoffee'},
          {src: 'docs/readme.md', dest: 'README.md'}
        ]
      },
      post: {
        options: {
          globals: {
            EXAMPLE: '<%= example %>',
            NAVIGATION: '<%= nav %>'
          }
        },
        src: 'build/index.html',
        dest: 'index.html'
      }
    },
    browserify: {
      dist: {
        files: {
          'build/vendor.js': ['lib/vendor.js']
        },
        debug: true
      }
    },
    coffee:{
      dist: {
        files: {
          'build/hummingbird-core.js' : ['build/hummingbird.litcoffee', 'lib/utils.litcoffee', 'lib/*.litcoffee', '!lib/hummingbird.litcoffee']
        },
        options: {
          bare: true,
          sourceMap: false
        }
      }
    },
    concat: {
      dist: {
        src: ['build/vendor.js', 'build/hummingbird-core.js'],
        dest: 'hummingbird.js'
      }
    },
    watch: {
      dev: {
        files: ["lib/*", "docs/*", "test/*"],
        tasks: ['default'],
        options: {
          interrupt: true
        }
      }
    },
    clean: {
      dist: {
        src: ['hummingbird.js', 'README.md', 'build/*', 'build/index.html']
      }
    },
    shell: {
      docs: {
         options: {
           stdout: false,
           stderr: true
         },
        command: 'PATH="node_modules/.bin:${PATH}" doc-n-toc docs/header.md docs/readme.md docs/intro.md docs/examples.md docs/features.md docs/contribute.md --css docs/my.less --title "Hummingbird v<%= pkg.version %>" > build/index.html'
      },
      npm: {
         options: {
           stdout: false,
           stderr: true
         },
        command: 'git commit -am "publish new version to npmjs.org"; git push origin master; npm publish ./; git checkout gh-pages; git merge master; git push origin gh-pages; git checkout master'
      },
      index: {
         options: {
           stdout: false,
           stderr: true
         },
        command: 'pushd ./examples/coffee-repl; coffee ./repl.coffee exit; popd'
      }
    },
    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8100/test',
          ]
        }
      }
    },
    connect: {
      dev: {
        options: {
          port: 8100,
          base: '.'
        }
      }
    }
  });

  // Default task
  grunt.registerTask('default', ['clean', 'includereplace:pre', 'browserify', 'coffee', 'concat', 'shell:docs', 'includereplace:post', 'shell:index']);
  grunt.registerTask('dev', ['default',  'connect:dev', 'watch']);
  grunt.registerTask('test', ['default',  'connect:dev', 'qunit', 'watch']);
  grunt.registerTask('docs', ['includereplace:pre', 'shell:docs', 'includereplace:post']);
  grunt.registerTask('serve', ['connect:dev', 'watch']);
  grunt.registerTask('publish', ['default','shell:npm']);
};
