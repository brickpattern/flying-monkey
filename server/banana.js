function getRandomFloat(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function getRandomCoord() {
  return {
    lng: getRandomFloat(-180, 180),
    lat: getRandomFloat(-90, 90)
  };
}

module.exports.spawn = function(db) {
  var bananas = db.collection('bananas');
  var noop = function() {};

  bananas.remove({}, function() {
    for (var i = 0; i < 50; i++) {
      bananas.insert({ coords: getRandomCoord() }, noop);
    }

    bananas.ensureIndex({ coords: '2dsphere' }, function() {});
  });
};

module.exports.getAll = function(db, cb) {
  var bananas = db.collection('bananas');

  bananas.find({}).toArray(function(err, results) {
    if (err) {
      console.log('error retrieving bananas');
      return;
    }

    return cb(results);
  });
};
