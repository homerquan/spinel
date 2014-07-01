var $ = require('./lib/dollar').$,
  express = require("express"),
  flash = require('connect-flash'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  proxy = require('./lib/proxy'),
  fs = require('fs'),
  https = require('https'),
  server = express();

/*
 * load common components
 */
require('./lib/allLoader').loadDollar();

server.use(express["static"](__dirname + "/../public"));
server.use(require('serve-favicon')(__dirname + '/../public/img/favicon.ico'));

// // csrf token 
// server.dynamicHelpers({
//   token: function(req, res) {
//       return req.session._csrf;
//   }
// });

/*
 * Proxy to restful api and oauth server
 */
server.use(proxy.apiProxy($('config').API_HOST, $('config').API_PORT));
server.use(proxy.graphProxy('54.187.139.12', 8182));

server.use(require('body-parser')());
server.use(require('cookie-parser')($('config').COOKIE_PASS));

//server.use(express.csrf());
server.use(flash());
server.use(require('method-override')());
server.use(require('express-session')({
  store: new RedisStore({
    host: $('config').REDIS_HOST,
    port: $('config').REDIS_PORT,
    db: $('config').REDIS_SESSION_DB,
    pass: $('config').REDIS_PASS
  }),
  secret: $('config').COOKIE_PASS
}));

// development only
if ('development' == server.get('env')) {
  server.use(require('morgan')());
  server.use(require('errorhandler')({
    dumpExceptions: true,
    showStack: true
  }));
}

server.set('title', $('config').TITLE);

var options = {
  key: fs.readFileSync(__dirname + '/certs/privatekey.pem'),
  cert: fs.readFileSync(__dirname + '/certs/certificate.pem')
};

// SERVER
// ======
// Start Node.js Server
https.createServer(options, server).listen($('config').PORT);
//server.listen($('config').PORT);

console.log('Please go to http://localhost:' + $('config').PORT + ' to run Whitetiger FE');