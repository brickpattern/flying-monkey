
var app = angular.module('app', [
  'uiGmapgoogle-maps',
  'btford.socket-io'
]);

app.controller('Index', function($scope, $timeout, $http) {
  $scope.players = [];

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

  $http.get('/players')
    .then(function(response) {
      $scope.players = (response.data || []).map(function(p) {
        return {
          _id: p._id,
          icon: '/img/monkey.png',
          coords: toCoords(p)
        };
      });
    });
});
