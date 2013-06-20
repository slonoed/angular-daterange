'use strict';

angular.module('MyApp', ['MyApp.directives'])
    .controller('MainCtrl', ['$scope', function($scope) {
        $scope.range = {
            start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            finish: new Date()
        };
    }]);