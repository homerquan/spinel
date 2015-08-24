module.exports = function(css_src, css_dest) {
  return {
    build: {
      options: {
        paths: [css_src]
      },
      files: [{
        dest: css_dest + 'bootstrap.css',
        src: [css_src + 'custom-bootstrap/bootstrap.less']
      }, {
        dest: css_dest + 'commonstyles.css',
        src: [css_src + 'common/commonstyles.less']
      }, {
        dest: css_dest + 'mobile.css',
        src: [css_src + 'common/mobile.less']
      }, {
        dest: css_dest + 'desktop.css',
        src: [css_src + 'common/desktop.less']
      }]
    }
  }
}