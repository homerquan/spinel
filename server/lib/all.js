/*
 * using this to concertrate all global vars and functions
 * For performance, only put most neccessary GLOBAL vars here
 */

var _ = require('underscore'),
	env = process.env.NODE_ENV || 'development',
	defaultConfig = require('../config/default.json'),
	envConfig = require('../config/' + env + '.json');

var config = _.extend(defaultConfig, envConfig);

exports.all = {
	config: config
};