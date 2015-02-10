
var app = angular.module('app', [
  'uiGmapgoogle-maps',
  'btford.socket-io'
]);

app.factory('socket', function(socketFactory) {
  return socketFactory();
});

app.factory('session', function() {
  return {
    getId: function() {
      return localStorage.getItem('_id');
    },
    setId: function(id) {
      localStorage.setItem('_id', id);
    },
    clear: function() {
      localStorage.clear();
    }
  };
});

app.controller('Index', function($scope, $timeout, $http, socket, session) {
  $scope.players = [];
  $scope.bananas = [];

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

        socket.emit('player.move', {
          _id: session.getId(),
          lat: pos.lat(),
          lng: pos.lng()
        });
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

  socket.on('player.pos', function(pos) {
    if ($scope.players.length === 0) {
      $scope.players.push({
        _id: pos._id,
        icon: '/img/monkey.png',
        coords: null
      });
    }

    var idx = findById($scope.players, session.getId());

    if (idx > -1) {
      $scope.players[idx].coords = toCoords(pos);
    }

    if (!session.getId() && pos._id) {
      session.setId(pos._id);
    }
  });

  socket.on('player.gone', function() {
    session.clear();
    window.location.reload();
  });

  socket.on('banana.list', function(bananas) {
    $scope.bananas = bananas.map(function(b) {
      return {
        _id: b._id,
        coords: toCoords(b.coords),
        icon: '/img/banana.png'
      };
    });
  });

  socket.emit('player.load', { _id: session.getId() });
});
