var s           = require('node-static')
  , ircb        = require('ircb')
  , engine      = require('engine.io')
  , http        = require('http')
  , file        = new(s.Server)('./public')
  , connected   = false
  , openSockets = {}
  , irc
  ;

var cfg =
  { channel : '#realtimeconfeu'
  , host    : 'irc.freenode.org'
  , nick    : 'ktrc'
  , name    : 'Keep it Realtime Yo!'
  }
  ;

var http_server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
}).listen(8342);

console.log('listening on port 8342');

function connectToIRC(cb) {
  var irc = ircb({
    host: cfg.host,
    nick: cfg.nick + '_' + (~~(Math.random() * 1e9)).toString(36),
    username: cfg.nick,
    realName: cfg.name
  }, function (err) {
    if(err) {
      return cb(err);
    }
    irc.join(cfg.channel, function (err) {
      if (err) {
        return cb(err);
      }
      connected=true;
      cb(null, irc);
    });
  });

  irc.on('close', function () {
    throw new Error('IRCB disconnected, restarting process');
  });
  irc.on('end', function () {
    throw new Error('IRCB disconnected, restarting process');
  });
}

server = engine.attach(http_server);

server.on('connection', function (socket) {
  var uuid = '#'+(~~(Math.random() * 1e9)).toString(36);
  console.log(uuid + ' +');
  openSockets[uuid] = socket;

  socket.on('message', function (data) {
    if(!connected) {
      return socket.close();
    }
    console.log(uuid + '> ' + data);
    irc.say(cfg.channel, data + ' ' + uuid);
  });

  socket.on('close', function () {
    console.log(uuid + ' —');
    delete openSockets[uuid];
  });
});

connectToIRC(function (err, ircb) {
  //
  // restart the script
  //
  if(err) {
    console.log(JSON.stringify(err));
    throw err;
  }
  console.log('connected to irc');
  irc = ircb;
  irc.on('message', function (who, where, wat) {
    var match = wat.match(/#[a-z0-9]{5,6}/);
    if(match) {
      var uuid = match[0];
      var socket = openSockets[uuid];
      if(socket) {
        var toSend = wat.replace(/#[a-z0-9]{5,6}/, '');
        console.log(uuid + '< ' + toSend);
        socket.send(toSend);
      }
      else {
        irc.say(who, 'Sorry, ' + uuid + ' disconnected.');
      }
    }
  });
});