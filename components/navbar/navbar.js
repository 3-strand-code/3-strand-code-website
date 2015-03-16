(function() {
    'use strict';

    angular.module('App.navbar', [])

        .directive('navbar', [
            '$interval', '$filter', '$kinvey', '$http',
            function($interval, $filter, $kinvey, $http) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'components/navbar/navbar.html',
                    scope: {},
                    link: function(scope, elem, attrs) {
                        scope.doc = angular.element(document);
                        scope.navbar = angular.element('.navbar');
                        scope.triggerEle = angular.element('.jumbotron h1');
                        scope.breakPoint = scope.triggerEle.outerHeight() - scope.navbar.outerHeight();

                        scope.updateOpaque = function() {
                            scope.isOpaque = scope.doc.scrollTop() < scope.breakPoint;
                            scope.navbar.toggleClass('transparent', scope.isOpaque)
                        };

                        angular.element(document).on('scroll', function() {
                            scope.updateOpaque();
                        });
                    }
                };
            }]);

}());