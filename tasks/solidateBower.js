//TODO: rewrite this in Esprima

var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
module.exports = function(grunt) {
	grunt.registerTask('solidateBower', function() {
		var done = this.async();
		var options = this.options();
		var configFile = path.resolve(__dirname + '/../', options.config);
		var config = fs.readFileSync(configFile, 'utf8');
		// match path generated by grunt bower requirejs
		var bowerRegex = new RegExp(options.from + "\/.+(?=')", 'g');
		var bowerComponents = config.match(bowerRegex);
		bowerComponents.forEach(function(file) {
			var source = __dirname + '/' + file.substring(6) + '.js';
			var targetConfig = file.substring(file.lastIndexOf('/'));
			var target = __dirname + '/../public/js/libs/plugins' + targetConfig + '.js';
			fs.writeFileSync(target, fs.readFileSync(source));
			config = config.replace(file, '../libs/plugins' + targetConfig);
		});
		fs.writeFileSync(configFile, config, 'utf8');
	});
};