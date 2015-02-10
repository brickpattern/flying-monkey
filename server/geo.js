
// http://stackoverflow.com/questions/7927208

var R = 6371000; // Earth's radius in meters

function bearing(lat1, lng1, lat2, lng2) {
  var dLon = lng2 - lng1;
  var cos2 = Math.cos(lat2);
  var y = Math.sin(dLon) * cos2;
  var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*cos2*Math.cos(dLon);
  var theta = Math.atan2(y, x);

  return theta;
}

function haversine(lat1, lng1, lat2, lng2) {
  var dLat = lat2 - lat1;
  var dLon = lng2 - lng1;
  var sinLat = Math.sin(dLat/2);
  var sinLng = Math.sin(dLon/2);
  var a = sinLat * sinLat + sinLng * sinLng * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d;
}

function offset(lat1, lng1, bearing, distance) {
  var d = distance/R;
  var cosD = Math.cos(d);
  var sinD = Math.sin(d);
  var sin1 = Math.sin(lat1);
  var cos1 = Math.cos(lat1);
  var lat2 = Math.asin(sin1*cosD + cos1*sinD*Math.cos(bearing));
  var sin2 = Math.sin(lat2);
  var lng2 = lng1 + Math.atan2(Math.sin(bearing)*sinD*cos1, cosD-sin1*sin2);

  return { lat: lat2, lng: lng2 };
}

function normalize(coord, size) {
  var mag = Math.abs(coord);

  if (mag > size) {
    var lngSign = Math.floor(mag / size) % 2 === 0;
    var lngRem = mag % size;

    coord = (coord > size) ?
      ((lngSign) ? 0 + lngRem : -(size - lngRem)) :
      ((lngSign) ? 0 - lngRem : (size - lngRem));
  }

  return coord;
}

function constrain(point) {
  // constrain point lng/lat within bounds for mongo
  var MAX_LAT = 90;
  var MAX_LNG = 180;

  return {
    lng: normalize(point.lng, MAX_LNG),
    lat: normalize(point.lat, MAX_LAT)
  };
}

function divide(p1, p2, n) {
  var lat1 = p1.lat * Math.PI / 180;
  var lng1 = p1.lng * Math.PI / 180;
  var lat2 = p2.lat * Math.PI / 180;
  var lng2 = p2.lng * Math.PI / 180;

  var heading = bearing(lat1, lng1, lat2, lng2);
  var D = haversine(lat1, lng1, lat2, lng2);

  var points = [];

  for (var i = 1; i < n; ++i) {
    var p = offset(lat1, lng1, heading, i * D / n);

    points.push(constrain({
      lat: p.lat * 180 / Math.PI,
      lng: p.lng * 180 / Math.PI
    }));
  }

  return points;
}

module.exports.getPoints = function(start, end, steps) {
  return divide(start, end, steps);
};

module.exports.getDistance = function(start, end) {
  var lat1 = start.lat * Math.PI / 180;
  var lng1 = start.lng * Math.PI / 180;
  var lat2 = end.lat * Math.PI / 180;
  var lng2 = end.lng * Math.PI / 180;

  return haversine(lat1, lng1, lat2, lng2);
};
