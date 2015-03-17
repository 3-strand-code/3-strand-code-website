(function() {
    'use strict';

    angular.module('App.ourProcess', [])

        .directive('ourProcess', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/our-process/our-process.html',
                    scope: {},
                    link: function(scope, elem, attrs) {

                    }
                };
            }]);

}());
