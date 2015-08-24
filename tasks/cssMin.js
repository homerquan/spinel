module.exports = function(css_dest) {
	return {
		minify: {
			expand: true,
			cwd: 'public/css',
			src: ['**/*.css'],
			dest: css_dest,
			ext: '.css'
		}
	};
};