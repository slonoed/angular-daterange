'use strict';

angular.module('MyApp', ['slonoed.daterange'])
    .controller('MainCtrl', ['$scope', function($scope) {
        $scope.range = {
            start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            finish: new Date()
        };

        $scope.getTimeStr = function (time) {
            return moment(time).format('DD-MM-YYYY');
        }
    }]);