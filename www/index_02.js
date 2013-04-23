var s = require('node-static')
  , http = require('http')
  , file = new(s.Server)('./public');