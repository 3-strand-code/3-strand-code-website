(function() {
    'use strict';

    angular.module('App.whatYouGet', [])

        .directive('whatYouGet', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/what-you-get/what-you-get.html',
                    scope: {},
                    link: function(scope, elem, attrs) {

                    }
                };
            }]);

}());
