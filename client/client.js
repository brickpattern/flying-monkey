
var app = angular.module('app', [
  'uiGmapgoogle-maps',
  'btford.socket-io'
]);

app.controller('Index', function($scope, $timeout) {
  $scope.msg = 'hello from Angular!';

  $timeout(function() {
    $scope.msg = 'a few seconds later';
  }, 3000);
});
