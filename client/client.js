
var app = angular.module('app', [
  'uiGmapgoogle-maps',
  'btford.socket-io'
]);

app.controller('Index', function($scope, $timeout) {
  $scope.map = {
    center: [0, 0],
    zoom: 3,
    options: {
      maxZoom: 3,
      minZoom: 3,
      disableDefaultUI: true,
      styles: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }]
    },
    events: {
      click: function(map, event, args) {
        var pos = args[0].latLng;

        console.log(pos.lat(), pos.lng());
      }
    }
  };

  function toCoords(pos) {
    return {
      longitude: pos.lng,
      latitude: pos.lat,
    };
  }

  function findById(collection, id) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i]._id == id) {
        return i;
      }
    }

    return -1;
  }
});
