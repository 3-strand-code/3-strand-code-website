(function() {
    'use strict';

    angular.module('App.process', [])

        .directive('process', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/process/process.html',
                    scope: {},
                    link: function(scope, elem, attrs) {

                    }
                };
            }]);

}());
