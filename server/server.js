var express = require('express');
var app = express();
var PORT = 8080;
var db;
var Mongo = require('mongodb').MongoClient;

var Player = require('./player');

Mongo.connect('mongodb://localhost:27017/flying-monkey', function(err, _db) {
  if (err) {
    console.log('could not connect to db');
    return process.exit(1);
  }

  db = _db;
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
