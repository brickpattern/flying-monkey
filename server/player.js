var ObjectID = require('mongodb').ObjectID;

module.exports.getOrCreate = function(db, pos, cb) {
  var players = db.collection('players');
  var DALLAS = {
    lng: -96.7967,
    lat: 32.7758
  };

  if (!pos._id) {
    players.insert(DALLAS, function(err, result) {
      if (err) {
        return cb(null);
      }

      return cb(result[0]);
    });
  }
  else {
    players.findOne({ _id: new ObjectID(pos._id) }, function(err, found) {
      if (err) {
        return cb(null);
      }

      return cb(found);
    });
  }
};

module.exports.update = function(db, player, newPos, cb) {
  var players = db.collection('players');

  var values = {
    $set: {
      lng: newPos.lng,
      lat: newPos.lat
    }
  };

  players.update({ _id: player._id }, values, function(err) {
    if (err) {
      console.log('update error', err);
      return;
    }

    return cb();
  });
};

module.exports.consumeBanana = function(db, player, banana, cb) {
  var bananas = db.collection('bananas');
  var players = db.collection('players');

  bananas.remove({ _id: new ObjectID(banana._id) }, function(err) {
    if (err) {
      return console.log('err eat ban', err);
    }

    players.update({ _id: new ObjectID(player._id) }, { $inc: { points: 1 } }, function(err) {
      if (err) {
        return console.log('err upd consume', err);
      }

      return cb();
    });
  });
};

module.exports.getAll = function(db, cb) {
  var players = db.collection('players');

  var opts = { sort: [['points', 'desc']] };

  players.find({}, {}, opts).toArray(function(err, found) {
    if (err) {
      return cb(null);
    }

    return cb(found);
  });
};
