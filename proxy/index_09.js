var http = require('http'),
    httpProxy = require('http-proxy');

var seed = ~~(Math.random() * 1e9),
    ports = [1337, 1338];

var hash = require('./hash')(seed);

httpProxy.createServer(function (req, res, proxy) {
  var ip = req.connection.remoteAddress,
      h = ip ? hash(ip.split(/\./g)) : 0,
      port = h ? ports[h % 2] : ports[0];
}).listen(8080);

console.log('listening on 8080, expecting 1337 and 1338');