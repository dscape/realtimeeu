var s = require('node-static')
  , http = require('http')
  , file = new(s.Server)('./public');

var http_server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(8342);

console.log('listening on port 8342');