var $ = require('./lib/dollar').$,
  express = require("express"),
  flash = require('connect-flash'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  RedisStore = require('connect-redis')(session),
  proxy = require('./lib/proxy'),
  fs = require('fs'),
  https = require('https'),
  http = require('https'),
  server = express();

/*
 * load common components
 */
require('./lib/allLoader').loadDollar();


// in production enviroment, use minified resources
if ($('env') === 'product') {
  server.all(/^\/|^\/(font|css|img|js)/, require('./lib/middleware'),
    express["static"](__dirname + "/../production")
  );
} else {
  server.all(/^\/|^\/(font|css|img|js)/, require('./lib/middleware'),
    express["static"](__dirname + "/../public")
  );
}

server.use(require('serve-favicon')(__dirname + '/../public/img/favicon.ico'));

// csrf token 
// server.dynamicHelpers({
//   token: function(req, res) {
//       return req.session._csrf;
//   }
// });

/*
 * Proxy to restful api and oauth server
 */
server.use(proxy.apiProxy($('config').API_HOST, $('config').API_PORT));
server.use(proxy.authProxy($('config').AUTH_HOST, $('config').AUTH_PORT));

server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(bodyParser.json());
server.use(require('cookie-parser')($('config').COOKIE_PASS));

//server.use(express.csrf());
server.use(flash());
server.use(require('method-override')());
server.use(session({
  store: new RedisStore({
    host: $('config').REDIS_HOST,
    port: $('config').REDIS_PORT,
    db: $('config').REDIS_SESSION_DB,
    pass: $('config').REDIS_PASS
  }),
  secret: $('config').COOKIE_PASS,
  resave: false,
  saveUninitialized: true
}));

// development only
if ('development' == server.get('env')) {
  server.use(require('morgan')('combined'));
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
// Start Server (http or https)
// https.createServer(options, server).listen($('config').PORT);
server.listen($('config').PORT);

console.log('Please go to http://localhost:' + $('config').PORT + ' to run Spinel');