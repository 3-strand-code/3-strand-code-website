(function() {
    'use strict';

    angular.module('App.faq', [])

        .directive('faq', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/faq/faq.html',
                    scope: {},
                    link: function(scope, elem, attrs) {

                    }
                };
            }]);

}());
