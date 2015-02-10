var express = require('express');
var app = express();
var PORT = 8080;
var db;
var Mongo = require('mongodb').MongoClient;
var io = require('socket.io')();

var Player = require('./player');
var Geo = require('./geo');
var Banana = require('./banana');

Mongo.connect('mongodb://localhost:27017/flying-monkey', function(err, _db) {
  if (err) {
    console.log('could not connect to db');
    return process.exit(1);
  }

  db = _db;

  Banana.spawn(db);
});

app.use(express.static(__dirname + '/../client'));

app.get('/ping', function(req, res) {
  return res.json({
    ip: req.ip,
    time: new Date()
  });
});

app.get('/players', function(req, res) {
  Player.getAll(db, function(scores) {
    return res.json(scores);
  });
});

app.all('*', function(req, res) {
  return res.status(404).json({
    error: '404!'
  });
});

var server = app.listen(PORT, function() {
  console.log('server up on %d', PORT);
});

io.serveClient(false);
io.attach(server);

io.on('connection', function(socket) {
  console.log('websocket client connected (%d)', io.engine.clientsCount);

  socket.on('player.load', function(pos) {
    Player.getOrCreate(db, pos, function(player) {
      if (!player) {
        return socket.emit('player.gone');
      }

      socket.emit('player.pos', {
        _id: player._id,
        lng: player.lng,
        lat: player.lat
      });
    });

    Banana.getAll(db, function(bananas) {
      socket.emit('banana.list', bananas);
    });
  });

  socket.on('player.move', function(pos) {
    var SPEED = 10000000; // m/s
    var RATE = 50; // ms refresh

    Player.getOrCreate(db, pos, function(player) {
      if (!player) {
        return socket.emit('player.gone');
      }

      var dist = Geo.getDistance(player, pos);
      var time = dist / SPEED;
      var steps = time / RATE * 1000;

      var pts = Geo.getPoints(player, pos, Math.ceil(steps));

      pts.push(pos);

      (function moveToPoint(point) {
        setTimeout(function() {
          Player.update(db, player, point, function() {
            var moved = {
              _id: player._id,
              lng: point.lng,
              lat: point.lat
            };

            socket.emit('player.pos', moved);

            if (pts.length) {
              moveToPoint(pts.shift());
            }
          });
        }, RATE);
      })(pts.shift());
    });
  });
});
