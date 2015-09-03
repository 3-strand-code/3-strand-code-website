(function() {
    'use strict';

    angular.module('App.apply', [])

        .directive('apply', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/apply/apply.html',
                    scope: {},
                    link: function(scope, elem, attrs) {

                    }
                };
            }]);

}());
