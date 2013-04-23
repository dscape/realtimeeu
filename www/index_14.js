var s = require('node-static')
  , http = require('http')
  , engine = require('engine.io')
  , file = new(s.Server)('./public');

var http_server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(8342);

var server = engine.attach(http_server);

server.on('connection', function (socket) {
  var uuid = '#'+(~~(Math.random() * 1e9)).toString(36);
});

console.log('listening on port 8342');