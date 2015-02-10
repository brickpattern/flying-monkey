var express = require('express');
var app = express();
var PORT = 8080;

app.use(express.static(__dirname + '/../client'));

app.get('/ping', function(req, res) {
  return res.json({
    ip: req.ip,
    time: new Date()
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
