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
