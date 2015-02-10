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
