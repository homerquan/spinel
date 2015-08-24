module.exports = function(js_dest) {
  return {
    minify: {
      options: {
        compress: {
          drop_console: true
        },
        beautify: {
          ascii_only: true,
          quote_keys: true
        }
      },
      files: [{
        expand: true,
        cwd: 'public/js',
        src: ['**/*.js'],
        dest: js_dest
      }]
    }
  };
};