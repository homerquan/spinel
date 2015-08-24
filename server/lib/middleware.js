var $ = require('./dollar').$;

var doNothing = function(req, res, next) {
	next();
};

//redirect "/#abc" to "/abc" 
var rewriteUrl = function(req, res, next) {
	if (req.url.match(/^\/(?!#)/) && req.url !== '/') {
		if (!req.url.match(new RegExp('^\/(font|css|img|js|api|tpl|comp)'))) {
			var url = req.url.replace(/^\//, "/#").replace(/\/$/, '');
			res.redirect(url);
		} else {
			next();
		}
	} else {
		next();
	}
};

var middleware = [rewriteUrl, doNothing];

module.exports = middleware;