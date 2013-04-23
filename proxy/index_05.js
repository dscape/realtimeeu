var http = require('http'),
    httpProxy = require('http-proxy');

var seed = ~~(Math.random() * 1e9),
    ports = [1337, 1338];

var hash = require('./hash')(seed);

httpProxy.createServer(function (req, res, proxy) {}).listen(8080);
