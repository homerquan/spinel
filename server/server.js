var express = require("express"),
    flash = require('connect-flash'),
    httpProxy = require('http-proxy'),
    server = module.exports = express();

server.configure(function() {

    server.use(express["static"](__dirname + "/../public"));

    server.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    // Proxy to forward api calls
    var proxy = new httpProxy.RoutingProxy();

    var apiProxy = function(host, port) {
        return function(req, res, next) {
            if (req.url.match(new RegExp('^\/api\/v1\/'))) {
                req.url = req.url.replace(/^\/api\/v1\//, "/");
                proxy.proxyRequest(req, res, {
                    host: host,
                    port: port
                });
            } else {
                next();
            }
        };
    };

    server.use(apiProxy('localhost', 8004));
    server.use(express.bodyParser());
    server.use(server.router);

    // development only
    if ('development' == server.get('env')) {
        server.use(express.errorHandler());
    }

});


// SERVER
// ======
// Start Node.js Server
server.listen(8003);

console.log('Please go to http://localhost:8003 to run demo');