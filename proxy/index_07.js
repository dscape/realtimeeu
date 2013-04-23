var http = require('http'),
    httpProxy = require('http-proxy');

var seed = ~~(Math.random() * 1e9),
    ports = [1337, 1338];

var hash = require('./hash')(seed);

httpProxy.createServer(function (req, res, proxy) {
  var ip = req.connection.remoteAddress
}).listen(8080);

console.log('listening on 8080, expecting 1337 and 1338');